import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

/**
 * GET: Get single course by slug with modules/lessons.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const record = await pb
      .collection('courses')
      .getFirstListItem(`slug = "${slug}"`, {
        expand: 'instructor',
      });

    if (!record) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    // Fetch modules for this course
    const modules = await pb.collection('modules').getFullList({
      filter: `course = "${record.id}"`,
      sort: 'order',
    });

    // Fetch lessons for each module
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await pb.collection('lessons').getFullList({
          filter: `module = "${module.id}"`,
          sort: 'order',
        });
        return { ...module, lessons };
      })
    );

    return NextResponse.json({
      success: true,
      data: { ...record, modules: modulesWithLessons },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update course (Admin Only).
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

    const course = await pb
      .collection('courses')
      .getFirstListItem(`slug = "${slug}"`);

    const updatedRecord = await pb.collection('courses').update(course.id, body);

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update course' },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete course (Admin Only).
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

    const course = await pb
      .collection('courses')
      .getFirstListItem(`slug = "${slug}"`);

    await pb.collection('courses').delete(course.id);

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete course' },
      { status: 500 }
    );
  }
}
