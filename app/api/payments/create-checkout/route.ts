import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import pb from '@/lib/pocketbase';
import { verifyAuth, createAuditLog } from '@/lib/middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { type, itemId, successUrl, cancelUrl } = await request.json();

    if (!type || !itemId) {
      return NextResponse.json(
        { message: 'Type and itemId are required' },
        { status: 400 }
      );
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const metadata: Record<string, string> = {
      userId: auth.user.id,
      type,
      itemId,
    };

    if (type === 'course') {
      // Fetch course details
      const course = await pb.collection('courses').getOne(itemId);

      if (!course) {
        return NextResponse.json(
          { message: 'Course not found' },
          { status: 404 }
        );
      }

      // Check if already enrolled
      const existingEnrollment = await pb.collection('enrollments').getList(1, 1, {
        filter: `user="${auth.user.id}" && course="${itemId}" && status!="cancelled"`,
      });

      if (existingEnrollment.totalItems > 0) {
        return NextResponse.json(
          { message: 'You are already enrolled in this course' },
          { status: 400 }
        );
      }

      lineItems = [{
        price_data: {
          currency: 'myr',
          product_data: {
            name: course.title,
            description: course.description || undefined,
          },
          unit_amount: Math.round(course.price * 100), // Convert to cents
        },
        quantity: 1,
      }];

      metadata.courseTitle = course.title;

    } else if (type === 'event') {
      // Fetch event details
      const event = await pb.collection('events').getOne(itemId);

      if (!event) {
        return NextResponse.json(
          { message: 'Event not found' },
          { status: 404 }
        );
      }

      // Check capacity
      if (event.registered_count >= event.capacity) {
        return NextResponse.json(
          { message: 'This event is fully booked' },
          { status: 400 }
        );
      }

      // Check if already registered
      const existingReg = await pb.collection('event_registrations').getList(1, 1, {
        filter: `user="${auth.user.id}" && event="${itemId}" && status!="cancelled"`,
      });

      if (existingReg.totalItems > 0) {
        return NextResponse.json(
          { message: 'You are already registered for this event' },
          { status: 400 }
        );
      }

      // Free events don't need Stripe
      if (event.price === 0) {
        // Create registration directly
        const confirmationCode = `KWH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        await pb.collection('event_registrations').create({
          user: auth.user.id,
          event: itemId,
          name: auth.user.name,
          email: auth.user.email,
          status: 'confirmed',
          confirmation_code: confirmationCode,
        });

        // Update registered count
        await pb.collection('events').update(itemId, {
          registered_count: event.registered_count + 1,
        });

        // Audit log
        await createAuditLog(auth.user.id, 'event_registration', 'events', itemId, {
          confirmation_code: confirmationCode,
          price: 0,
        });

        return NextResponse.json({
          success: true,
          free: true,
          confirmationCode,
          message: 'Registration successful!',
        });
      }

      lineItems = [{
        price_data: {
          currency: 'myr',
          product_data: {
            name: event.title,
            description: `${event.type} - ${event.date}`,
          },
          unit_amount: Math.round(event.price * 100),
        },
        quantity: 1,
      }];

      metadata.eventTitle = event.title;

    } else {
      return NextResponse.json(
        { message: 'Invalid type. Must be "course" or "event"' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'fpx'], // FPX for Malaysian banks
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/portal/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/portal/dashboard?payment=cancelled`,
      customer_email: auth.user.email,
      metadata,
      payment_intent_data: {
        metadata,
      },
    });

    // Create pending payment record
    await pb.collection('payments').create({
      user: auth.user.id,
      stripe_session_id: session.id,
      type,
      item_id: itemId,
      amount: lineItems[0]?.price_data?.unit_amount || 0,
      currency: 'MYR',
      status: 'pending',
    });

    // Audit log
    await createAuditLog(auth.user.id, 'payment_initiated', type, itemId, {
      session_id: session.id,
      amount: lineItems[0]?.price_data?.unit_amount,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
