// app/api/certificates/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCertificatePDF, generateCertificateId, saveCertificate } from '@/lib/certificate';
import { emailService } from '@/lib/email';
import pb from '@/lib/pocketbase';

export async function POST(request: NextRequest) {
  try {
    const { userId, courseId } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      );
    }

    // Fetch user and course data
    const [user, course] = await Promise.all([
      pb.collection('users').getOne(userId),
      pb.collection('courses').getOne(courseId),
    ]);

    // Check if user completed the course
    const enrollment = await pb.collection('enrollments').getFirstListItem(
      `user = "${userId}" && course = "${courseId}" && status = "completed"`
    ).catch(() => null);

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Course not completed' },
        { status: 400 }
      );
    }

    // Generate certificate
    const certificateId = generateCertificateId();
    const certificateData = {
      studentName: user.name || 'Student',
      courseName: course.title || course.name,
      completionDate: enrollment.completed_at || new Date().toISOString(),
      instructorName: course.instructor || 'KitaWorksHub Instructor',
      certificateId,
    };

    // Save to PocketBase
    const { url, recordId } = await saveCertificate(certificateData, userId);

    // Send email notification
    emailService.sendCertificateEmail(
      { name: user.name, email: user.email },
      { courseName: certificateData.courseName, pdfUrl: url }
    );

    return NextResponse.json({
      success: true,
      certificate: {
        id: certificateId,
        recordId,
        url,
        courseName: certificateData.courseName,
        issuedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
