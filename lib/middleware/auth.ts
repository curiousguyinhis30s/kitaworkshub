import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

export type UserRole = 'student' | 'instructor' | 'admin';

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  company?: string;
  avatar?: string;
  verified: boolean;
  created: string;
  updated: string;
}

interface AuthResult {
  authenticated: boolean;
  user: UserRecord | null;
  error?: string;
}

/**
 * Verify authentication from request
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Check for auth cookie
    const pbAuth = request.cookies.get('pb_auth');

    if (!pbAuth) {
      // Check for Bearer token in header
      const authHeader = request.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return { authenticated: false, user: null, error: 'No authentication provided' };
      }

      const token = authHeader.replace('Bearer ', '');
      pb.authStore.save(token, null);
    } else {
      pb.authStore.loadFromCookie(pbAuth.value);
    }

    if (!pb.authStore.isValid) {
      return { authenticated: false, user: null, error: 'Invalid or expired session' };
    }

    // Refresh to get latest user data
    const authData = await pb.collection('users').authRefresh();

    return { authenticated: true, user: authData.record as unknown as UserRecord };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, user: null, error: 'Authentication failed' };
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: UserRecord | null, allowedRoles: UserRole[]): boolean {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Require authentication middleware
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const auth = await verifyAuth(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { message: auth.error || 'Authentication required' },
      { status: 401 }
    );
  }

  return null; // Proceed
}

/**
 * Require specific role(s) middleware
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<NextResponse | null> {
  const auth = await verifyAuth(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      { message: auth.error || 'Authentication required' },
      { status: 401 }
    );
  }

  if (!hasRole(auth.user, allowedRoles)) {
    return NextResponse.json(
      { message: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return null; // Proceed
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  return requireRole(request, ['admin']);
}

/**
 * Require instructor or admin role
 */
export async function requireInstructor(request: NextRequest): Promise<NextResponse | null> {
  return requireRole(request, ['instructor', 'admin']);
}

/**
 * Get current user from request (returns null if not authenticated)
 */
export async function getCurrentUser(request: NextRequest): Promise<UserRecord | null> {
  const auth = await verifyAuth(request);
  return auth.user;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>
) {
  try {
    await pb.collection('audit_logs').create({
      user: userId,
      action,
      resource,
      resource_id: resourceId,
      details: details || {},
      ip_address: '', // Would get from request in real implementation
      user_agent: '',
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
