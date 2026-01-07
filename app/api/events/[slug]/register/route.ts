import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { emailService } from '@/lib/email';

/**
 * POST: Register current user for an event.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Login required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid || !pb.authStore.model) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model.id;

    // Get Event
    const event = await pb
      .collection('events')
      .getFirstListItem(`slug = "${slug}"`);

    // Check capacity
    const registrations = await pb.collection('event_registrations').getList(1, 1, {
      filter: `event = "${event.id}"`,
    });

    if (registrations.totalItems >= (event.capacity || 0)) {
      return NextResponse.json(
        { success: false, message: 'Event is fully booked' },
        { status: 400 }
      );
    }

    // Check if already registered
    try {
      const existing = await pb
        .collection('event_registrations')
        .getFirstListItem(`user = "${userId}" && event = "${event.id}"`);

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Already registered for this event' },
          { status: 409 }
        );
      }
    } catch {
      // Not found, proceed
    }

    // Generate confirmation code
    const confirmationCode = `KWH-${Date.now().toString(36).toUpperCase()}`;

    // Create Registration
    const registrationData = {
      user: userId,
      event: event.id,
      status: 'confirmed',
      confirmation_code: confirmationCode,
    };

    const record = await pb.collection('event_registrations').create(registrationData);

    // Update event registered_count
    try {
      await pb.collection('events').update(event.id, {
        registered_count: (event.registered_count || 0) + 1,
      });
    } catch (e) {
      console.error('Failed to update registered_count:', e);
    }

    // Send confirmation email
    try {
      const user = await pb.collection('users').getOne(userId);
      emailService.sendEventRegistrationEmail(
        { name: user.name || 'Participant', email: user.email },
        {
          title: event.title || event.name,
          date: event.start_date || event.date,
          location: event.location || event.venue || 'TBA',
        }
      );
    } catch (e) {
      console.error('Failed to send registration email:', e);
    }

    return NextResponse.json(
      { success: true, message: 'Registered successfully', data: record },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to register' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Unregister from event.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    pb.authStore.save(token, null);

    if (!pb.authStore.model) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model.id;

    const event = await pb
      .collection('events')
      .getFirstListItem(`slug = "${slug}"`);

    const registration = await pb
      .collection('event_registrations')
      .getFirstListItem(`user = "${userId}" && event = "${event.id}"`);

    await pb.collection('event_registrations').delete(registration.id);

    // Update event registered_count
    try {
      await pb.collection('events').update(event.id, {
        registered_count: Math.max(0, (event.registered_count || 1) - 1),
      });
    } catch (e) {
      console.error('Failed to update registered_count:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Unregistered successfully',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to unregister' },
      { status: 500 }
    );
  }
}
