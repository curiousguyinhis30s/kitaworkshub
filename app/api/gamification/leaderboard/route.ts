import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { getLevelFromXP } from '@/lib/gamification';

/**
 * GET: Get leaderboard (top users by XP)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'all'; // all, weekly, monthly
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // For now, we'll just get users sorted by XP
    // In production, you'd want to track XP gains by date for weekly/monthly
    const users = await pb.collection('users').getList(1, limit, {
      sort: '-xp_points',
      fields: 'id,name,avatar,xp_points,level',
    });

    const leaderboard = users.items.map((user, index) => {
      const levelInfo = getLevelFromXP(user.xp_points || 0);
      return {
        rank: index + 1,
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp_points || 0,
        level: levelInfo.level,
        title: levelInfo.title,
      };
    });

    return NextResponse.json({
      success: true,
      period,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
