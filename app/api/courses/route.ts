import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

/**
 * GET: List all published courses with pagination, filtering, and search.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build PocketBase filter
    let filter = 'published = true';

    if (category) {
      filter += ` && category = "${category}"`;
    }

    if (search) {
      filter += ` && (title ~ "${search}" || description ~ "${search}")`;
    }

    const resultList = await pb.collection('courses').getList(page, perPage, {
      filter: filter,
      sort: '-created',
      expand: 'instructor',
    });

    return NextResponse.json({
      success: true,
      data: resultList.items,
      pagination: {
        page: resultList.page,
        perPage: resultList.perPage,
        totalItems: resultList.totalItems,
        totalPages: resultList.totalPages,
      },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new course (Admin Only).
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, price, difficulty, instructor } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const data = {
      title,
      slug,
      description,
      category: category || 'general',
      price: price || 0,
      difficulty: difficulty || 'beginner',
      instructor: instructor || pb.authStore.model?.id,
      published: false,
    };

    const record = await pb.collection('courses').create(data);

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create course' },
      { status: err.status || 500 }
    );
  }
}
