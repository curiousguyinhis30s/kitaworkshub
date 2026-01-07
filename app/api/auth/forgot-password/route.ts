import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { Resend } from 'resend';

// Lazy initialization to avoid build errors
const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Request password reset from PocketBase
    // PocketBase handles token generation and email sending if configured
    // If not configured, we send via Resend
    try {
      await pb.collection('users').requestPasswordReset(email);
    } catch (err) {
      // User might not exist, but we don't reveal that for security
      console.log('Password reset requested for:', email);
    }

    // Note: PocketBase sends its own password reset email with secure token
    // If PocketBase email is not configured, Resend can be used as backup
    // but we let PocketBase handle token generation for security
    const resend = getResend();
    if (resend && process.env.USE_RESEND_FOR_PASSWORD_RESET === 'true') {
      try {
        // Redirect to portal login with message - PocketBase handles the actual reset
        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/login`;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@kitaworkshub.com.my',
          to: email,
          subject: 'Reset your KitaWorksHub password',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password for your KitaWorksHub account.</p>
              <p>You should receive another email shortly from our system with a secure reset link.</p>
              <p>If you don't receive it within 5 minutes, please check your spam folder or try again.</p>
              <p style="margin-top: 20px;">
                <a href="${portalUrl}" style="color: #1e3a28;">Return to Login</a>
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                If you didn't request this, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
              <p style="color: #999; font-size: 12px;">
                KitaWorksHub - Where Leaders Grow Deep
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        // Don't fail the request if email fails - PocketBase handles primary reset
      }
    }

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      message: 'If an account exists with this email, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
