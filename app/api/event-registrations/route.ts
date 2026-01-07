import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventId, company, dietaryRequirements } = body;

    // Validate required fields
    if (!name || !email || !eventId) {
      return NextResponse.json(
        { message: 'Name, email, and event selection are required' },
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

    // Find event by title or ID
    let event;
    try {
      // First try to find by ID (if it's a PocketBase ID)
      if (eventId.length === 15) {
        event = await pb.collection('events').getOne(eventId);
      }
    } catch {
      // Not found by ID, try by title
    }

    if (!event) {
      try {
        // Try to find by title
        event = await pb.collection('events').getFirstListItem(
          `title = "${eventId.replace(/"/g, '\\"')}"`,
          { requestKey: null }
        );
      } catch {
        // Event not found in database - store as contact inquiry instead
        await pb.collection('contact_inquiries').create({
          name,
          email,
          phone: phone || '',
          company: company || '',
          message: `Event registration inquiry for: ${eventId}. Dietary: ${dietaryRequirements || 'None'}`,
          status: 'new',
        });

        return NextResponse.json(
          { message: 'Thank you for your interest! Our team will contact you shortly to confirm your registration.' },
          { status: 201 }
        );
      }
    }

    // Check capacity
    if (event.registered_count >= event.capacity) {
      return NextResponse.json(
        { message: 'Sorry, this event is fully booked. Please contact us for waitlist options.' },
        { status: 400 }
      );
    }

    // Check for existing registration by email
    try {
      const existing = await pb.collection('event_registrations').getFirstListItem(
        `event = "${event.id}"`,
        { requestKey: null }
      );

      // Check if email matches (we store in contact_inquiries for guest registrations)
      const relatedInquiry = await pb.collection('contact_inquiries').getFirstListItem(
        `email = "${email}"`,
        { requestKey: null }
      );

      if (relatedInquiry && existing) {
        return NextResponse.json(
          { message: 'You are already registered for this event!' },
          { status: 409 }
        );
      }
    } catch {
      // No existing registration found, proceed
    }

    // Generate confirmation code
    const confirmationCode = `KWH-${Date.now().toString(36).toUpperCase()}`;

    // For guest registration, store details in contact_inquiries and create event_registration
    // Create contact inquiry to store guest details
    const inquiry = await pb.collection('contact_inquiries').create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      message: `Event registration: ${event.title}. Dietary: ${dietaryRequirements || 'None'}. Confirmation: ${confirmationCode}`,
      status: 'new',
    });

    // Note: event_registrations requires a user relation, but for guests we can't link it
    // In a full implementation, you'd create a guest user or modify the schema
    // For now, store registration details in the inquiry

    // Update event registered_count
    try {
      await pb.collection('events').update(event.id, {
        registered_count: (event.registered_count || 0) + 1,
      });
    } catch (e) {
      console.error('Failed to update registered_count:', e);
    }

    return NextResponse.json(
      {
        message: 'Registration successful! You will receive a confirmation email shortly.',
        confirmationCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { message: 'Failed to register for event. Please try again.' },
      { status: 500 }
    );
  }
}
