// Analytics service for tracking website events
// Stores data in PocketBase and provides dashboard data

import pb from '@/lib/pocketbase';

export type AnalyticsEvent = {
  id?: string;
  event_type: 'page_view' | 'button_click' | 'form_submit' | 'course_view' | 'event_register' | 'contact';
  page_path: string;
  session_id: string;
  user_agent?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
  created?: string;
};

// Generate session ID for tracking
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('kwh_session_id');
  if (!sessionId) {
    sessionId = `ses_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('kwh_session_id', sessionId);
  }
  return sessionId;
}

// Track a page view
export async function trackPageView(path: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_view',
        page_path: path,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.debug('Analytics tracking failed:', error);
  }
}

// Track an event
export async function trackEvent(
  eventType: AnalyticsEvent['event_type'],
  path: string,
  metadata?: Record<string, unknown>
) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        page_path: path,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        metadata,
      }),
    });
  } catch (error) {
    console.debug('Analytics tracking failed:', error);
  }
}

// Dashboard data types
export type DashboardStats = {
  totalPageViews: number;
  uniqueSessions: number;
  topPages: { path: string; views: number }[];
  eventsByType: { type: string; count: number }[];
  viewsOverTime: { date: string; views: number }[];
  recentEvents: AnalyticsEvent[];
};

// Fetch dashboard data (for admin)
export async function getDashboardStats(days: number = 7): Promise<DashboardStats> {
  const response = await fetch(`/api/analytics/dashboard?days=${days}`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}
