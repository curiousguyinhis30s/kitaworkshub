import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// POST - Track an analytics event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, page_path, session_id, user_agent, referrer, metadata } = body;

    // Validate required fields
    if (!event_type || !page_path || !session_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to save to PocketBase analytics collection
    try {
      await pb.collection('analytics_events').create({
        event_type,
        page_path,
        session_id,
        user_agent: user_agent || '',
        referrer: referrer || '',
        metadata: metadata || {},
      });
    } catch (pbError) {
      // If PocketBase is not available, log to console
      console.log('[Analytics]', {
        event_type,
        page_path,
        session_id,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Return success anyway - don't break the app for analytics
    return NextResponse.json({ success: true });
  }
}
