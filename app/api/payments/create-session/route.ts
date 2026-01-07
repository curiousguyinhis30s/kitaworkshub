import { NextRequest, NextResponse } from 'next/server';
import { createPaymentSession } from '@/lib/stripe';
import pb from '@/lib/pocketbase';

/**
 * POST: Create a Stripe Checkout Session.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, eventId, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    if (!courseId && !eventId) {
      return NextResponse.json(
        { error: 'Either courseId or eventId must be provided' },
        { status: 400 }
      );
    }

    let productName = '';
    let productDescription = '';
    let amount = 0;

    if (courseId) {
      const course = await pb.collection('courses').getOne(courseId);
      productName = course.title;
      productDescription = course.description?.substring(0, 200) || '';
      amount = course.price || 0;
    } else if (eventId) {
      const event = await pb.collection('events').getOne(eventId);
      productName = event.title;
      productDescription = event.description?.substring(0, 200) || '';
      amount = event.price || 0;
    }

    const metadata: Record<string, string> = { userId };
    if (courseId) metadata.courseId = courseId;
    if (eventId) metadata.eventId = eventId;

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/portal/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/portal/checkout/cancel`;

    const session = await createPaymentSession({
      amount,
      currency: 'myr',
      productName,
      productDescription,
      metadata,
      successUrl,
      cancelUrl,
    });

    // Create pending payment record
    await pb.collection('payments').create({
      user: userId,
      type: courseId ? 'course' : 'event',
      reference_id: courseId || eventId,
      amount,
      currency: 'MYR',
      stripe_session_id: session.id,
      status: 'pending',
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error creating session' },
      { status: 500 }
    );
  }
}
