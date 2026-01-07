// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').slice(0, 200); // Max 200 chars
    const typeParam = searchParams.get('type');
    const type = (typeParam === 'course' || typeParam === 'event') ? typeParam : undefined;
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20') || 20, 1), 100); // 1-100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0') || 0, 0);
    const category = (searchParams.get('category') || '').slice(0, 50); // Max 50 chars

    if (!query && !category) {
      return NextResponse.json({
        hits: [],
        totalHits: 0,
        query: '',
        processingTimeMs: 0,
      });
    }

    // Build filters
    const filters: Record<string, string> = {};
    if (category) filters.category = category;

    await searchService.connect();

    const results = await searchService.search(query, {
      type,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      limit,
      offset,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API] Search error:', error);
    return NextResponse.json(
      { error: 'Search service unavailable' },
      { status: 503 }
    );
  }
}

// Suggestions endpoint
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    await searchService.connect();
    const suggestions = await searchService.getSuggestions(query);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('[API] Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
