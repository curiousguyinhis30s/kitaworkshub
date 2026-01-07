import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function GET() {
  try {
    // Get upcoming events
    const now = new Date().toISOString();
    const events = await pb.collection('events').getFullList({
      filter: `date >= "${now}"`,
      sort: 'date',
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, slug, description, type, date, time, duration, location, price, capacity } = body;

    if (!title || !date || !time) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const eventSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const event = await pb.collection('events').create({
      title,
      slug: eventSlug,
      description: description || '',
      type: type || 'workshop',
      date,
      time,
      duration: duration || 60,
      location: location || 'Online',
      price: price || 0,
      capacity: capacity || 50,
      published: false,
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: 'Failed to create event' },
      { status: 500 }
    );
  }
}
