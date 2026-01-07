import { NextRequest, NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';
import { verifyAuth, hasRole } from '@/lib/middleware/auth';

// Get financial reports (admin only)
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
    const period = searchParams.get('period') || 'month'; // day, week, month, year
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    const now = new Date();
    let start: Date;
    const end = new Date(endDate || now);

    if (startDate) {
      start = new Date(startDate);
    } else {
      start = new Date(now);
      switch (period) {
        case 'day':
          start.setDate(start.getDate() - 1);
          break;
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
        case 'year':
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
    }

    // Fetch completed payments in range
    const payments = await pb.collection('payments').getFullList({
      filter: `status="completed" && created>="${start.toISOString()}" && created<="${end.toISOString()}"`,
      sort: '-created',
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const courseRevenue = payments
      .filter(p => p.type === 'course')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    const eventRevenue = payments
      .filter(p => p.type === 'event')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Get refunds
    const refunds = await pb.collection('payments').getFullList({
      filter: `status="refunded" && created>="${start.toISOString()}" && created<="${end.toISOString()}"`,
    });
    const totalRefunds = refunds.reduce((sum, p) => sum + (p.refund_amount || 0), 0);

    // Group by day for chart data
    const dailyRevenue: Record<string, number> = {};
    payments.forEach(p => {
      const date = new Date(p.created).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (p.amount || 0);
    });

    // Get top courses by revenue
    const courseRevenueMap: Record<string, { id: string; title: string; revenue: number; enrollments: number }> = {};
    for (const p of payments.filter(p => p.type === 'course')) {
      if (!courseRevenueMap[p.item_id]) {
        try {
          const course = await pb.collection('courses').getOne(p.item_id);
          courseRevenueMap[p.item_id] = {
            id: p.item_id,
            title: course.title,
            revenue: 0,
            enrollments: 0,
          };
        } catch {
          courseRevenueMap[p.item_id] = {
            id: p.item_id,
            title: 'Unknown Course',
            revenue: 0,
            enrollments: 0,
          };
        }
      }
      courseRevenueMap[p.item_id].revenue += p.amount || 0;
      courseRevenueMap[p.item_id].enrollments += 1;
    }

    const topCourses = Object.values(courseRevenueMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get recent transactions
    const recentTransactions = payments.slice(0, 10).map(p => ({
      id: p.id,
      type: p.type,
      amount: p.amount / 100,
      status: p.status,
      date: p.created,
    }));

    return NextResponse.json({
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      summary: {
        totalRevenue: totalRevenue / 100,
        courseRevenue: courseRevenue / 100,
        eventRevenue: eventRevenue / 100,
        totalRefunds: totalRefunds / 100,
        netRevenue: (totalRevenue - totalRefunds) / 100,
        transactionCount: payments.length,
        refundCount: refunds.length,
      },
      dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({
        date,
        amount: amount / 100,
      })),
      topCourses: topCourses.map(c => ({
        ...c,
        revenue: c.revenue / 100,
      })),
      recentTransactions,
    });
  } catch (error) {
    console.error('Financial report error:', error);
    return NextResponse.json(
      { message: 'Failed to generate financial report' },
      { status: 500 }
    );
  }
}
