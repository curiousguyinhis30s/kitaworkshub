import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pb from '@/lib/pocketbase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const pbAuth = cookieStore.get('pb_auth');

    if (!pbAuth) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Load auth from cookie
    pb.authStore.loadFromCookie(pbAuth.value);

    if (!pb.authStore.isValid) {
      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      );
    }

    // Refresh auth and get user data
    const user = await pb.collection('users').authRefresh();

    const { password: _, ...userWithoutPassword } = user.record;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
