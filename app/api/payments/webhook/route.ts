import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import pb from '@/lib/pocketbase';
import Stripe from 'stripe';

/**
 * POST: Handle Stripe Webhooks.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status === 'paid' && session.metadata) {
        const { userId, courseId, eventId } = session.metadata;

        console.log(`Payment successful for User: ${userId}`);

        // Update payment record
        try {
          const payment = await pb
            .collection('payments')
            .getFirstListItem(`stripe_session_id = "${session.id}"`, {
              requestKey: null,
            });

          await pb.collection('payments').update(payment.id, {
            status: 'completed',
            stripe_payment_intent: session.payment_intent as string,
          });
        } catch (e) {
          console.error('Failed to update payment record:', e);
        }

        // Grant access to course
        if (courseId && userId) {
          try {
            // Check if already enrolled
            await pb.collection('enrollments').getFirstListItem(
              `user = "${userId}" && course = "${courseId}"`,
              { requestKey: null }
            );
            console.log('User already enrolled in course');
          } catch {
            // Not enrolled, create enrollment
            try {
              await pb.collection('enrollments').create({
                user: userId,
                course: courseId,
                status: 'active',
                payment_id: session.id,
                enrolled_at: new Date().toISOString(),
              });
              console.log(`Granted access to Course: ${courseId}`);
            } catch (e) {
              console.error('Failed to create enrollment:', e);
            }
          }
        }

        // Register for event
        if (eventId && userId) {
          try {
            // Check if already registered
            await pb.collection('event_registrations').getFirstListItem(
              `user = "${userId}" && event = "${eventId}"`,
              { requestKey: null }
            );
            console.log('User already registered for event');
          } catch {
            // Not registered, create registration
            try {
              const confirmationCode = `KWH-${Date.now().toString(36).toUpperCase()}`;
              await pb.collection('event_registrations').create({
                user: userId,
                event: eventId,
                status: 'confirmed',
                payment_id: session.id,
                confirmation_code: confirmationCode,
              });
              console.log(`Registered for Event: ${eventId}`);

              // Update event registered_count
              try {
                const eventRecord = await pb.collection('events').getOne(eventId);
                await pb.collection('events').update(eventId, {
                  registered_count: (eventRecord.registered_count || 0) + 1,
                });
              } catch (e) {
                console.error('Failed to update event count:', e);
              }
            } catch (e) {
              console.error('Failed to create event registration:', e);
            }
          }
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed for intent: ${paymentIntent.id}`);

      // Update payment record to failed
      try {
        const payment = await pb
          .collection('payments')
          .getFirstListItem(`stripe_payment_intent = "${paymentIntent.id}"`, {
            requestKey: null,
          });

        await pb.collection('payments').update(payment.id, {
          status: 'failed',
        });
      } catch (e) {
        console.error('Failed to update payment record:', e);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
