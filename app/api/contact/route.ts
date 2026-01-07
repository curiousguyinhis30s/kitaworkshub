import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, phone, company } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create contact inquiry in PocketBase
    await pb.collection('contact_inquiries').create({
      name,
      email,
      message,
      phone: phone || '',
      company: company || '',
      status: 'new',
    });

    return NextResponse.json(
      { message: 'Thank you for your inquiry. We will get back to you soon.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
