"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  FileText,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import type { DashboardStats } from '@/lib/analytics';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(7);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics/dashboard?days=${selectedRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedRange]);

  const eventTypeLabels: Record<string, string> = {
    page_view: 'Page Views',
    button_click: 'Clicks',
    form_submit: 'Form Submissions',
    course_view: 'Course Views',
    contact: 'Contact Inquiries',
    event_register: 'Event Registrations',
  };

  const eventTypeIcons: Record<string, React.ReactNode> = {
    page_view: <Eye className="w-4 h-4" />,
    button_click: <MousePointer className="w-4 h-4" />,
    form_submit: <FileText className="w-4 h-4" />,
    course_view: <BarChart3 className="w-4 h-4" />,
    contact: <Users className="w-4 h-4" />,
    event_register: <Calendar className="w-4 h-4" />,
  };

  return (
    <AdminLayout title="Analytics" subtitle="Track visitor behavior and website performance">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
          <div className="flex gap-2">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading && !stats ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Page Views</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Unique Sessions</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.uniqueSessions.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Avg Views/Session</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.uniqueSessions > 0
                          ? (stats.totalPageViews / stats.uniqueSessions).toFixed(1)
                          : '0'}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Form Submissions</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.eventsByType.find(e => e.type === 'form_submit')?.count || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Page Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end gap-1">
                    {stats.viewsOverTime.map((day, index) => {
                      const maxViews = Math.max(...stats.viewsOverTime.map(d => d.views));
                      const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                            style={{ height: `${height}%`, minHeight: '4px' }}
                            title={`${day.date}: ${day.views} views`}
                          />
                          <span className="text-[10px] text-gray-400 -rotate-45 origin-left whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Events by Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Events by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.eventsByType.map((event) => {
                      const maxCount = Math.max(...stats.eventsByType.map(e => e.count));
                      const percentage = maxCount > 0 ? (event.count / maxCount) * 100 : 0;
                      return (
                        <div key={event.type} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {eventTypeIcons[event.type] || <BarChart3 className="w-4 h-4" />}
                              <span className="text-sm font-medium text-gray-700">
                                {eventTypeLabels[event.type] || event.type}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{event.count}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topPages.map((page, index) => (
                      <div
                        key={page.path}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{page.path}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{page.views}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {stats.recentEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {eventTypeIcons[event.event_type] || <Eye className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {eventTypeLabels[event.event_type] || event.event_type}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{event.page_path}</p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {event.created
                            ? new Date(event.created).toLocaleTimeString('en-MY', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
