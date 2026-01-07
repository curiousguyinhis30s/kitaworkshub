// app/api/search/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search';

// Sync search index with PocketBase data
export async function POST(request: NextRequest) {
  try {
    // Simple API key auth for admin operations
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.ADMIN_API_KEY;

    if (apiKey && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await searchService.connect();
    const result = await searchService.syncFromPocketBase();

    return NextResponse.json({
      success: true,
      indexed: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Search sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
