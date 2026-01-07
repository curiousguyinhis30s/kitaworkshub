import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { emailService } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, courseId, message } = body;

    // Validate required fields
    if (!name || !email || !courseId) {
      return NextResponse.json(
        { message: 'Name, email, and course selection are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get course details
    let courseName = 'the course';
    try {
      const course = await pb.collection('courses').getOne(courseId);
      courseName = course.title || course.name || 'the course';
    } catch {
      // Course not found, use default name
    }

    // Create enrollment inquiry in PocketBase
    await pb.collection('enrollments').create({
      name,
      email,
      phone: phone || '',
      course: courseId,
      message: message || '',
      status: 'pending',
    });

    // Send enrollment confirmation email
    emailService.sendCourseEnrollmentEmail(
      { name, email },
      { title: courseName, startDate: new Date() }
    );

    return NextResponse.json(
      { message: 'Thank you for your enrollment inquiry. Our admissions team will contact you within 24 hours.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enrollment form error:', error);
    return NextResponse.json(
      { message: 'Failed to submit enrollment inquiry' },
      { status: 500 }
    );
  }
}
