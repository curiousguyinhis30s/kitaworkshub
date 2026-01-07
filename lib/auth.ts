import PocketBase from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Types for KitaWorksHub User
export interface KitaUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  xp_points?: number;
  level?: number;
  created: string;
  updated: string;
}

export interface AuthResponse {
  user: KitaUser;
  token: string;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);

    return {
      user: authData.record as unknown as KitaUser,
      token: authData.token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid email or password.');
  }
}

/**
 * Register a new user
 */
export async function register(
  email: string,
  password: string,
  name: string,
  role: 'student' | 'instructor' = 'student'
): Promise<AuthResponse> {
  try {
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
      role,
      xp_points: 0,
      level: 1,
    });

    // Auto login after registration
    const authData = await pb.collection('users').authWithPassword(email, password);

    return {
      user: authData.record as unknown as KitaUser,
      token: authData.token,
    };
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const err = error as { message?: string };
    throw new Error(err?.message || 'Failed to create account.');
  }
}

/**
 * Logout the current user
 */
export function logout(): void {
  pb.authStore.clear();
}

/**
 * Get the currently authenticated user
 */
export function getCurrentUser(): KitaUser | null {
  if (!pb.authStore.isValid) {
    return null;
  }
  return pb.authStore.model as unknown as KitaUser | null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Check if the current user has a specific role
 */
export function hasRole(role: 'student' | 'instructor' | 'admin'): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role;
}

/**
 * Refresh the authentication token
 */
export async function refreshToken(): Promise<string> {
  try {
    await pb.collection('users').authRefresh();
    return pb.authStore.token;
  } catch (error) {
    console.error('Token refresh error:', error);
    logout();
    throw new Error('Session expired. Please login again.');
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: { name?: string; avatar?: string | File }): Promise<KitaUser> {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No authenticated user found.');
  }

  try {
    const updateData: Record<string, unknown> = {};

    if (data.avatar && typeof data.avatar !== 'string') {
      updateData.avatar = data.avatar;
    }

    if (data.name) {
      updateData.name = data.name;
    }

    const updatedRecord = await pb.collection('users').update(user.id, updateData);

    // Update local auth store
    pb.authStore.save(pb.authStore.token, updatedRecord);

    return updatedRecord as unknown as KitaUser;
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const err = error as { message?: string };
    throw new Error(err?.message || 'Failed to update profile.');
  }
}

// Export the initialized client instance
export default pb;
