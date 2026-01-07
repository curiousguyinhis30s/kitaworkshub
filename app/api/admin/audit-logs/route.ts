import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { verifyAuth, hasRole } from '@/lib/middleware/auth';
import { sanitizeForPocketbaseFilter, validatePocketbaseId, clampPagination } from '@/lib/utils/sanitize';

// Validate ISO date format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
function isValidDate(dateStr: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?Z?)?$/;
  if (!isoDateRegex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Get audit logs (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!hasRole(auth.user, ['admin'])) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Validate and clamp pagination
    const { page, limit } = clampPagination(
      parseInt(searchParams.get('page') || '1'),
      parseInt(searchParams.get('limit') || '50'),
      100
    );

    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter with sanitization
    const filters: string[] = [];

    // Validate and sanitize userId (must be valid PocketBase ID)
    if (userId) {
      if (validatePocketbaseId(userId)) {
        filters.push(`user="${userId}"`);
      }
    }

    // Sanitize action and resource strings
    if (action) {
      const sanitizedAction = sanitizeForPocketbaseFilter(action);
      if (sanitizedAction) {
        filters.push(`action~"${sanitizedAction}"`);
      }
    }

    if (resource) {
      const sanitizedResource = sanitizeForPocketbaseFilter(resource);
      if (sanitizedResource) {
        filters.push(`resource="${sanitizedResource}"`);
      }
    }
    // Validate dates before using in filter
    if (startDate && isValidDate(startDate)) {
      filters.push(`created>="${startDate}"`);
    }
    if (endDate && isValidDate(endDate)) {
      filters.push(`created<="${endDate}"`);
    }

    const filterString = filters.length > 0 ? filters.join(' && ') : '';

    const logs = await pb.collection('audit_logs').getList(page, limit, {
      filter: filterString,
      sort: '-created',
      expand: 'user',
    });

    return NextResponse.json({
      logs: logs.items.map(log => ({
        id: log.id,
        user: log.expand?.user ? {
          id: log.expand.user.id,
          name: log.expand.user.name,
          email: log.expand.user.email,
        } : null,
        action: log.action,
        resource: log.resource,
        resourceId: log.resource_id,
        details: log.details,
        ipAddress: log.ip_address,
        userAgent: log.user_agent,
        createdAt: log.created,
      })),
      pagination: {
        page: logs.page,
        totalPages: logs.totalPages,
        totalItems: logs.totalItems,
        perPage: logs.perPage,
      },
    });
  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// Export audit logs to CSV
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!hasRole(auth.user, ['admin'])) {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { startDate, endDate, format = 'csv' } = await request.json();

    const filters: string[] = [];
    // Validate dates before using in filter
    if (startDate && isValidDate(startDate)) {
      filters.push(`created>="${startDate}"`);
    }
    if (endDate && isValidDate(endDate)) {
      filters.push(`created<="${endDate}"`);
    }

    const logs = await pb.collection('audit_logs').getFullList({
      filter: filters.length > 0 ? filters.join(' && ') : '',
      sort: '-created',
      expand: 'user',
    });

    if (format === 'csv') {
      const headers = ['Timestamp', 'User', 'Email', 'Action', 'Resource', 'Resource ID', 'Details', 'IP Address'];
      const rows = logs.map(log => [
        log.created,
        log.expand?.user?.name || 'Unknown',
        log.expand?.user?.email || 'Unknown',
        log.action,
        log.resource,
        log.resource_id || '',
        JSON.stringify(log.details || {}),
        log.ip_address || '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Export audit logs error:', error);
    return NextResponse.json(
      { message: 'Failed to export audit logs' },
      { status: 500 }
    );
  }
}
