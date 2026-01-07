import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate with PocketBase
    const authData = await pb.collection('users').authWithPassword(email, password);

    // Return user without sensitive data
    const { password: _, ...userWithoutPassword } = authData.record;

    const response = NextResponse.json(
      { user: userWithoutPassword, message: 'Login successful' },
      { status: 200 }
    );

    // Set PocketBase cookie
    response.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }
}
