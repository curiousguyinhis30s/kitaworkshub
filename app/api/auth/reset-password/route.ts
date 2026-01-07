import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const { token, password, passwordConfirm } = await request.json();

    if (!token || !password || !passwordConfirm) {
      return NextResponse.json(
        { message: 'Token, password, and password confirmation are required' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Confirm password reset with PocketBase
    await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);

    return NextResponse.json({
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error);

    const pbError = error as { status?: number };
    if (pbError?.status === 400) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token. Please request a new one.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
