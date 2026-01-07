import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export async function POST() {
  // Clear PocketBase auth store
  pb.authStore.clear();

  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear cookie
  response.cookies.delete('pb_auth');

  return response;
}
