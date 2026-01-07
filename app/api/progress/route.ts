import { NextRequest, NextResponse } from 'next/server';
import { trackLessonProgress, getEnrollmentProgress } from '@/lib/progress';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { enrollmentId, lessonId, videoPosition, timeSpent, completed } = body;

    if (!enrollmentId || !lessonId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const progress = await trackLessonProgress(enrollmentId, lessonId, {
      videoPosition: videoPosition || 0,
      timeSpent: timeSpent || 0,
      completed: completed || false,
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Progress tracking failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const enrollmentId = searchParams.get('enrollmentId');

  if (!enrollmentId) {
    return NextResponse.json(
      { message: 'Missing enrollmentId' },
      { status: 400 }
    );
  }

  try {
    const progressList = await getEnrollmentProgress(enrollmentId);
    return NextResponse.json(progressList);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
