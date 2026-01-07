import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration - stricter for auth endpoints
const rateLimitConfig = {
  '/api/auth/login': { limit: 5, window: 60 * 1000 }, // 5 login attempts/minute
  '/api/auth/register': { limit: 3, window: 60 * 1000 }, // 3 registrations/minute
  '/api/auth/forgot-password': { limit: 3, window: 300 * 1000 }, // 3 per 5 minutes
  '/api/auth': { limit: 10, window: 60 * 1000 }, // 10 requests/minute for other auth
  '/api/contact': { limit: 3, window: 60 * 1000 }, // 3 contact requests/minute
  '/api/analytics/track': { limit: 20, window: 60 * 1000 }, // 20 requests/minute
  '/api/event-registrations': { limit: 5, window: 60 * 1000 }, // 5 registrations/minute
};

// In-memory store for rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Helper function to get rate limit config based on path (most specific first)
function getRateLimitConfig(pathname: string) {
  if (pathname === '/api/auth/login') return rateLimitConfig['/api/auth/login'];
  if (pathname === '/api/auth/register') return rateLimitConfig['/api/auth/register'];
  if (pathname === '/api/auth/forgot-password') return rateLimitConfig['/api/auth/forgot-password'];
  if (pathname.startsWith('/api/auth')) return rateLimitConfig['/api/auth'];
  if (pathname.startsWith('/api/contact')) return rateLimitConfig['/api/contact'];
  if (pathname.startsWith('/api/analytics/track')) return rateLimitConfig['/api/analytics/track'];
  if (pathname.startsWith('/api/event-registrations')) return rateLimitConfig['/api/event-registrations'];
  return null;
}

// Helper function to check rate limit
function checkRateLimit(identifier: string, limit: number, window: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Helper function to get client identifier (IP address)
function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp ?? 'anonymous';
  return `${ip}-${request.nextUrl.pathname}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate Limiting
  const config = getRateLimitConfig(pathname);
  if (config) {
    const identifier = getClientIdentifier(request);
    const isAllowed = checkRateLimit(identifier, config.limit, config.window);

    if (!isAllowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      });
    }
  }

  const response = NextResponse.next();

  // Content Security Policy (strict - no unsafe-eval)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    connect-src 'self' https:;
    font-src 'self' data:;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Strict-Transport-Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Permissions-Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
