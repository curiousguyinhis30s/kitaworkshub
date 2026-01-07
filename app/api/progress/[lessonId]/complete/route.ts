import { NextRequest, NextResponse } from 'next/server';
import { completeLesson } from '@/lib/progress';
import { awardXP, calculateLessonXP } from '@/lib/gamification';
import pb from '@/lib/pocketbase';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await req.json();
    const { enrollmentId } = body;

    if (!enrollmentId) {
      return NextResponse.json(
        { message: 'Missing enrollmentId' },
        { status: 400 }
      );
    }

    // Mark lesson complete
    const progressRecord = await completeLesson(enrollmentId, lessonId);

    // Get lesson details for XP calculation
    let xpAwarded = 0;
    let newTotalXP = 0;
    let leveledUp = false;

    try {
      const lesson = await pb.collection('lessons').getOne(lessonId);
      const enrollment = await pb.collection('enrollments').getOne(enrollmentId);

      const xpAmount = calculateLessonXP(lesson.type || 'text');
      const result = await awardXP(enrollment.user, xpAmount, `Completed lesson: ${lesson.title}`);

      xpAwarded = xpAmount;
      newTotalXP = result.newTotal;
      leveledUp = result.leveledUp;
    } catch (e) {
      console.error('XP award failed:', e);
    }

    return NextResponse.json({
      success: true,
      xpAwarded,
      newTotalXP,
      leveledUp,
      progress: progressRecord,
    });
  } catch (error) {
    console.error('Completion failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
