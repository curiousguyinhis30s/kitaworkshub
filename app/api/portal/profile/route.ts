import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// GET - Fetch user profile
export async function GET(request: Request) {
  try {
    // Get user ID from auth header or cookie
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model?.id;
    if (!userId) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch user with profile
    const user = await pb.collection('users').getOne(userId);

    let profile = null;
    try {
      profile = await pb.collection('user_profiles').getFirstListItem(`user="${userId}"`);
    } catch {
      // No profile exists yet
    }

    return NextResponse.json({
      user,
      profile,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PATCH - Update user profile
export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid || !pb.authStore.model) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model.id;
    const body = await request.json();
    const { bio, linkedin, department, position, skills, notifications } = body;

    // Get or create profile
    let profile;
    try {
      profile = await pb.collection('user_profiles').getFirstListItem(`user="${userId}"`);

      // Update existing profile
      profile = await pb.collection('user_profiles').update(profile.id, {
        bio,
        linkedin,
        department,
        position,
        skills,
        notification_email: notifications?.email,
        notification_courses: notifications?.courses,
        notification_events: notifications?.events,
      });
    } catch {
      // Create new profile
      profile = await pb.collection('user_profiles').create({
        user: userId,
        bio,
        linkedin,
        department,
        position,
        skills,
        member_type: 'standard',
        notification_email: notifications?.email ?? true,
        notification_courses: notifications?.courses ?? true,
        notification_events: notifications?.events ?? true,
      });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
