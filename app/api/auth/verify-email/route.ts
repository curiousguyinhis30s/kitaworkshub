import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// Request email verification
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    await pb.collection('users').requestVerification(email);

    return NextResponse.json({
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Request verification error:', error);
    return NextResponse.json(
      { message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

// Confirm email verification
export async function PUT(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Verification token is required' },
        { status: 400 }
      );
    }

    await pb.collection('users').confirmVerification(token);

    return NextResponse.json({
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Confirm verification error:', error);

    const pbError = error as { status?: number };
    if (pbError?.status === 400) {
      return NextResponse.json(
        { message: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
