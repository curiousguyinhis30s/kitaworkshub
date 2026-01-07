import pb from '@/lib/pocketbase';

export type LessonProgressData = {
  videoPosition: number;
  timeSpent: number;
  completed: boolean;
};

const COLLECTION_NAME = 'lesson_progress';

/**
 * Tracks or updates lesson progress.
 */
export async function trackLessonProgress(
  enrollmentId: string,
  lessonId: string,
  data: LessonProgressData
) {
  try {
    const existingRecord = await pb
      .collection(COLLECTION_NAME)
      .getFirstListItem(`enrollment = "${enrollmentId}" && lesson = "${lessonId}"`, {
        requestKey: null,
      });

    return await pb.collection(COLLECTION_NAME).update(existingRecord.id, {
      video_position_sec: data.videoPosition,
      time_spent_sec: data.timeSpent,
    });
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 404) {
      return await pb.collection(COLLECTION_NAME).create({
        enrollment: enrollmentId,
        lesson: lessonId,
        video_position_sec: data.videoPosition,
        time_spent_sec: data.timeSpent,
        completed_at: null,
      });
    }
    throw error;
  }
}

/**
 * Retrieves all progress records for a specific enrollment.
 */
export async function getEnrollmentProgress(enrollmentId: string) {
  return await pb
    .collection(COLLECTION_NAME)
    .getFullList({ filter: `enrollment = "${enrollmentId}"` });
}

/**
 * Calculates the total completion percentage of a course.
 */
export async function calculateCourseCompletion(
  enrollmentId: string,
  totalLessons: number
) {
  if (totalLessons === 0) return 0;

  const records = await getEnrollmentProgress(enrollmentId);
  const completedCount = records.filter((r) => r.completed_at !== null).length;

  return Math.round((completedCount / totalLessons) * 100);
}

/**
 * Retrieves the last watched position for resuming playback.
 */
export async function resumeLesson(enrollmentId: string, lessonId: string) {
  try {
    const record = await pb
      .collection(COLLECTION_NAME)
      .getFirstListItem(`enrollment = "${enrollmentId}" && lesson = "${lessonId}"`, {
        requestKey: null,
      });
    return record.video_position_sec || 0;
  } catch {
    return 0;
  }
}

/**
 * Marks a lesson as completed.
 */
export async function completeLesson(enrollmentId: string, lessonId: string) {
  try {
    const existingRecord = await pb
      .collection(COLLECTION_NAME)
      .getFirstListItem(`enrollment = "${enrollmentId}" && lesson = "${lessonId}"`, {
        requestKey: null,
      });

    if (existingRecord.completed_at) return existingRecord;

    return await pb.collection(COLLECTION_NAME).update(existingRecord.id, {
      completed_at: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 404) {
      return await pb.collection(COLLECTION_NAME).create({
        enrollment: enrollmentId,
        lesson: lessonId,
        video_position_sec: 0,
        time_spent_sec: 0,
        completed_at: new Date().toISOString(),
      });
    }
    throw error;
  }
}
