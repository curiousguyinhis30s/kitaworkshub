import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

/**
 * POST: Enroll current user in a specific course.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Login required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid || !pb.authStore.model) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model.id;

    // Get Course ID
    const course = await pb
      .collection('courses')
      .getFirstListItem(`slug = "${slug}"`);

    // Check if already enrolled
    try {
      const existing = await pb
        .collection('enrollments')
        .getFirstListItem(`user = "${userId}" && course = "${course.id}"`);

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Already enrolled in this course' },
          { status: 409 }
        );
      }
    } catch {
      // Not found, proceed with enrollment
    }

    // Create Enrollment
    const enrollmentData = {
      user: userId,
      course: course.id,
      enrolled_at: new Date().toISOString(),
      progress_percent: 0,
    };

    const record = await pb.collection('enrollments').create(enrollmentData);

    return NextResponse.json(
      { success: true, message: 'Enrolled successfully', data: record },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to enroll' },
      { status: 500 }
    );
  }
}
