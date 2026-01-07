import pb from '@/lib/pocketbase';

// XP Constants
export const XP_REWARDS = {
  LESSON_VIDEO: 50,
  LESSON_TEXT: 30,
  LESSON_QUIZ: 75,
  LESSON_LIVE: 100,
  COURSE_BEGINNER: 300,
  COURSE_INTERMEDIATE: 500,
  COURSE_ADVANCED: 750,
  EVENT_ATTENDED: 150,
  STREAK_7_DAYS: 200,
  STREAK_30_DAYS: 500,
};

// Level thresholds
const LEVELS = [
  { level: 1, minXP: 0, title: 'Beginner' },
  { level: 2, minXP: 500, title: 'Learner' },
  { level: 3, minXP: 1500, title: 'Student' },
  { level: 4, minXP: 3000, title: 'Achiever' },
  { level: 5, minXP: 5000, title: 'Expert' },
  { level: 6, minXP: 8000, title: 'Master' },
  { level: 7, minXP: 12000, title: 'Champion' },
  { level: 8, minXP: 18000, title: 'Legend' },
  { level: 9, minXP: 25000, title: 'Guru' },
  { level: 10, minXP: 35000, title: 'Grandmaster' },
];

/**
 * Calculate XP for completing a lesson based on type.
 */
export function calculateLessonXP(lessonType: 'video' | 'text' | 'quiz' | 'live'): number {
  switch (lessonType) {
    case 'video':
      return XP_REWARDS.LESSON_VIDEO;
    case 'text':
      return XP_REWARDS.LESSON_TEXT;
    case 'quiz':
      return XP_REWARDS.LESSON_QUIZ;
    case 'live':
      return XP_REWARDS.LESSON_LIVE;
    default:
      return XP_REWARDS.LESSON_TEXT;
  }
}

/**
 * Calculate XP for completing a course based on difficulty.
 */
export function calculateCourseXP(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  switch (difficulty) {
    case 'beginner':
      return XP_REWARDS.COURSE_BEGINNER;
    case 'intermediate':
      return XP_REWARDS.COURSE_INTERMEDIATE;
    case 'advanced':
      return XP_REWARDS.COURSE_ADVANCED;
    default:
      return XP_REWARDS.COURSE_BEGINNER;
  }
}

/**
 * Get user level from XP.
 */
export function getLevelFromXP(xp: number): {
  level: number;
  title: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || LEVELS[i];
      break;
    }
  }

  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpRequiredForNextLevel = nextLevel.minXP - currentLevel.minXP;
  const progress =
    xpRequiredForNextLevel > 0
      ? Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100)
      : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXP: xp,
    nextLevelXP: nextLevel.minXP,
    progress,
  };
}

/**
 * Check if user is eligible for a badge.
 */
export async function checkBadgeEligibility(
  userId: string,
  badgeType: string
): Promise<boolean> {
  try {
    // Check if badge already earned
    const existing = await pb.collection('user_badges').getFirstListItem(
      `user = "${userId}" && badge.name = "${badgeType}"`,
      { requestKey: null }
    );
    if (existing) return false; // Already has badge

    // Check eligibility based on badge type
    switch (badgeType) {
      case 'First Course':
        const enrollments = await pb.collection('enrollments').getList(1, 1, {
          filter: `user = "${userId}" && completed_at != null`,
        });
        return enrollments.totalItems >= 1;

      case 'PMO Master':
        // Check if completed all PMO courses
        const pmoCourses = await pb.collection('courses').getFullList({
          filter: 'category = "pmo"',
        });
        const pmoEnrollments = await pb.collection('enrollments').getFullList({
          filter: `user = "${userId}" && completed_at != null`,
        });
        const completedPMO = pmoEnrollments.filter((e) =>
          pmoCourses.some((c) => c.id === e.course)
        );
        return completedPMO.length === pmoCourses.length && pmoCourses.length > 0;

      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Award XP to user.
 */
export async function awardXP(
  userId: string,
  amount: number,
  reason: string
): Promise<{ newTotal: number; leveledUp: boolean; newLevel?: number }> {
  try {
    const user = await pb.collection('users').getOne(userId);
    const oldXP = user.xp_points || 0;
    const newTotal = oldXP + amount;

    const oldLevel = getLevelFromXP(oldXP);
    const newLevel = getLevelFromXP(newTotal);
    const leveledUp = newLevel.level > oldLevel.level;

    await pb.collection('users').update(userId, {
      xp_points: newTotal,
      level: newLevel.level,
    });

    console.log(`Awarded ${amount} XP to user ${userId} for: ${reason}`);

    return {
      newTotal,
      leveledUp,
      newLevel: leveledUp ? newLevel.level : undefined,
    };
  } catch (error) {
    console.error('Failed to award XP:', error);
    throw error;
  }
}

/**
 * Award badge to user.
 */
export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    // Check if already has badge
    try {
      await pb.collection('user_badges').getFirstListItem(
        `user = "${userId}" && badge = "${badgeId}"`,
        { requestKey: null }
      );
      return false; // Already has badge
    } catch {
      // Doesn't have badge, continue
    }

    // Get badge for XP reward
    const badge = await pb.collection('badges').getOne(badgeId);

    // Award badge
    await pb.collection('user_badges').create({
      user: userId,
      badge: badgeId,
      earned_at: new Date().toISOString(),
    });

    // Award badge XP if any
    if (badge.xp_reward && badge.xp_reward > 0) {
      await awardXP(userId, badge.xp_reward, `Badge earned: ${badge.name}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to award badge:', error);
    return false;
  }
}
