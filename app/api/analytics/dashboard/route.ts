import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// Demo analytics data for when PocketBase is not available
function getDemoData(days: number) {
  const now = new Date();
  const viewsOverTime = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    viewsOverTime.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10,
    });
  }

  return {
    totalPageViews: 847,
    uniqueSessions: 312,
    topPages: [
      { path: '/', views: 245 },
      { path: '/courses', views: 156 },
      { path: '/services', views: 98 },
      { path: '/events', views: 87 },
      { path: '/contact', views: 64 },
      { path: '/community', views: 52 },
    ],
    eventsByType: [
      { type: 'page_view', count: 847 },
      { type: 'button_click', count: 234 },
      { type: 'form_submit', count: 18 },
      { type: 'course_view', count: 89 },
      { type: 'contact', count: 12 },
    ],
    viewsOverTime,
    recentEvents: [
      { event_type: 'page_view', page_path: '/courses', session_id: 'ses_demo1', created: new Date().toISOString() },
      { event_type: 'form_submit', page_path: '/contact', session_id: 'ses_demo2', created: new Date(Date.now() - 3600000).toISOString() },
      { event_type: 'course_view', page_path: '/courses/agile-practitioner', session_id: 'ses_demo3', created: new Date(Date.now() - 7200000).toISOString() },
      { event_type: 'button_click', page_path: '/', session_id: 'ses_demo4', created: new Date(Date.now() - 10800000).toISOString() },
      { event_type: 'page_view', page_path: '/events', session_id: 'ses_demo5', created: new Date(Date.now() - 14400000).toISOString() },
    ],
  };
}

// GET - Fetch dashboard analytics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // Try to fetch from PocketBase
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const events = await pb.collection('analytics_events').getFullList({
        filter: `created >= "${cutoffDate.toISOString()}"`,
        sort: '-created',
      });

      // Calculate stats
      const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
      const uniqueSessions = new Set(events.map(e => e.session_id)).size;

      // Top pages
      const pageViewCounts: Record<string, number> = {};
      events.filter(e => e.event_type === 'page_view').forEach(e => {
        pageViewCounts[e.page_path] = (pageViewCounts[e.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageViewCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Events by type
      const typeCounts: Record<string, number> = {};
      events.forEach(e => {
        typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
      });
      const eventsByType = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Views over time
      const dateCounts: Record<string, number> = {};
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dateCounts[date.toISOString().split('T')[0]] = 0;
      }
      events.filter(e => e.event_type === 'page_view').forEach(e => {
        const date = e.created.split('T')[0];
        if (dateCounts.hasOwnProperty(date)) {
          dateCounts[date]++;
        }
      });
      const viewsOverTime = Object.entries(dateCounts).map(([date, views]) => ({ date, views }));

      // Recent events
      const recentEvents = events.slice(0, 20).map(e => ({
        event_type: e.event_type,
        page_path: e.page_path,
        session_id: e.session_id,
        created: e.created,
      }));

      return NextResponse.json({
        totalPageViews,
        uniqueSessions,
        topPages,
        eventsByType,
        viewsOverTime,
        recentEvents,
      });
    } catch {
      // Return demo data if PocketBase not available
      return NextResponse.json(getDemoData(days));
    }
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return NextResponse.json(getDemoData(7));
  }
}
