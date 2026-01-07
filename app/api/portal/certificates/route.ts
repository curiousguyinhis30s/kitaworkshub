import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { verifyAuth, hasRole } from '@/lib/middleware/auth';

// GET - Fetch user certificates
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = auth.user.id;


    // Fetch certificates with course expansion
    const certificates = await pb.collection('certificates').getFullList({
      filter: `user="${userId}"`,
      expand: 'course,course.instructor',
      sort: '-issued_at',
    });

    // Fetch in-progress courses (enrollments without completion)
    const enrollments = await pb.collection('enrollments').getFullList({
      filter: `user="${userId}" && status="active"`,
      expand: 'course',
    });

    // Calculate total learning hours from completed certificates
    const totalHours = certificates.reduce((acc, cert) => {
      const course = cert.expand?.course;
      return acc + (course?.duration || 0) / 60;
    }, 0);

    return NextResponse.json({
      certificates: certificates.map((cert) => ({
        id: cert.id,
        courseName: cert.expand?.course?.title || 'Unknown Course',
        instructor: cert.expand?.course?.expand?.instructor?.name || 'Unknown Instructor',
        issuedDate: new Date(cert.issued_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        credentialId: cert.credential_id,
        score: cert.score ? `${cert.score}%` : undefined,
        duration: cert.expand?.course?.duration
          ? `${Math.round(cert.expand.course.duration / 60)} hours`
          : undefined,
        skills: cert.skills || [],
      })),
      inProgress: enrollments.map((enr) => ({
        id: enr.id,
        name: enr.expand?.course?.title || 'Unknown Course',
        progress: 0, // Would calculate from lesson_progress
        estimatedCompletion: 'TBD',
      })),
      stats: {
        earned: certificates.length,
        inProgress: enrollments.length,
        totalHours: Math.round(totalHours),
      },
    });
  } catch (error) {
    console.error('Certificates fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// POST - Generate a new certificate (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const auth = await verifyAuth(request);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!hasRole(auth.user, ['admin'])) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, courseId, score, skills } = body;

    // Generate credential ID
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    const credentialId = `KWH-CERT-${year}-${random}`;

    const certificate = await pb.collection('certificates').create({
      user: userId,
      course: courseId,
      credential_id: credentialId,
      issued_at: new Date().toISOString(),
      score,
      skills,
    });

    // Update enrollment status
    try {
      const enrollment = await pb.collection('enrollments').getFirstListItem(
        `user="${userId}" && course="${courseId}"`
      );
      await pb.collection('enrollments').update(enrollment.id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
    } catch {
      // No enrollment found
    }

    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    console.error('Certificate creation error:', error);
    return NextResponse.json({ message: 'Failed to create certificate' }, { status: 500 });
  }
}
