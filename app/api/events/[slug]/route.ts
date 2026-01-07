import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

/**
 * GET: Get event by slug.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const record = await pb
      .collection('events')
      .getFirstListItem(`slug = "${slug}"`, {
        expand: 'host',
      });

    // Get registration count
    const registrations = await pb.collection('registrations').getList(1, 1, {
      filter: `event = "${record.id}"`,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...record,
        registrations_count: registrations.totalItems,
        spots_remaining: (record.capacity || 0) - registrations.totalItems,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Event not found' },
      { status: 404 }
    );
  }
}

/**
 * PATCH: Update event (Admin Only).
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    const event = await pb
      .collection('events')
      .getFirstListItem(`slug = "${slug}"`);

    const updatedRecord = await pb.collection('events').update(event.id, body);

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update event' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete event (Admin Only).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const event = await pb
      .collection('events')
      .getFirstListItem(`slug = "${slug}"`);

    await pb.collection('events').delete(event.id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete event' },
      { status: 500 }
    );
  }
}
