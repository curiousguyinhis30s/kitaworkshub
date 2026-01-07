import { NextRequest, NextResponse } from 'next/server';
import { awardXP, getLevelFromXP } from '@/lib/gamification';
import pb from '@/lib/pocketbase';

/**
 * POST: Award XP to user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amount, reason } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { message: 'Missing userId or amount' },
        { status: 400 }
      );
    }

    const result = await awardXP(userId, amount, reason || 'Manual award');

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('XP award failed:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET: Get user's XP and level
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'Missing userId' },
      { status: 400 }
    );
  }

  try {
    const user = await pb.collection('users').getOne(userId);
    const levelInfo = getLevelFromXP(user.xp_points || 0);

    return NextResponse.json({
      success: true,
      xp: user.xp_points || 0,
      ...levelInfo,
    });
  } catch (error) {
    console.error('Failed to fetch XP:', error);
    return NextResponse.json(
      { message: 'User not found' },
      { status: 404 }
    );
  }
}
