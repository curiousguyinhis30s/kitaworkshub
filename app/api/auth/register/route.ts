import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, company } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Create user in PocketBase
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
      phone: phone || '',
      company: company || '',
      role: 'student',
    });

    // Auto-login
    const authData = await pb.collection('users').authWithPassword(email, password);

    // Return user without sensitive data
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      { user: userWithoutPassword, message: 'Registration successful' },
      { status: 201 }
    );

    // Set PocketBase cookie
    response.cookies.set('pb_auth', pb.authStore.exportToCookie(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Registration error:', error);

    // Handle PocketBase specific errors
    if (error && typeof error === 'object' && 'data' in error) {
      const pbError = error as { data?: { data?: Record<string, unknown> } };
      if (pbError.data?.data?.email) {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
