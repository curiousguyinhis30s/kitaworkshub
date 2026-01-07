'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  ChevronRight,
  Play,
  Search,
  Flame,
} from 'lucide-react';

// Types
export interface DashboardStats {
  hoursLearned: number;
  coursesCompleted: number;
  currentStreak: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  progress: number;
  thumbnail?: string;
  totalDuration?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  time: string;
  type: 'workshop' | 'webinar' | 'meetup';
}

export interface Certificate {
  id: string;
  title: string;
  date: string;
}

export interface BentoDashboardProps {
  currentCourse: Course | null;
  stats: DashboardStats;
  upcomingEvents: Event[];
  certificates: Certificate[];
  userName?: string;
}

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
    <div
      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Main Component
const BentoDashboard: React.FC<BentoDashboardProps> = ({
  currentCourse,
  stats,
  upcomingEvents,
  certificates,
  userName = 'Learner',
}) => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your learning journey today.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        {/* Continue Learning Widget (Spans 2 cols) */}
        {currentCourse && (
          <div className="col-span-1 md:col-span-2 row-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-full flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-5" />

              <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Continue Learning
                  </span>
                  <Link
                    href={`/portal/courses/${currentCourse.slug}`}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-5 h-5 text-primary-600" fill="currentColor" />
                  </Link>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {currentCourse.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    by {currentCourse.instructor}
                  </p>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{currentCourse.totalDuration || '2h 15m'} remaining</span>
                  </div>

                  <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{currentCourse.progress}%</span>
                  </div>
                  <ProgressBar progress={currentCourse.progress} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Stats Widget */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Learning Stats</h3>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {stats.hoursLearned}
              </span>
              <span className="text-xs text-gray-500">Hours Learned</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {stats.coursesCompleted}
              </span>
              <span className="text-xs text-gray-500">Completed</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-amber-500">
            <Flame className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold">{stats.currentStreak} Day Streak</span>
          </div>
        </div>

        {/* Quick Actions Widget */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/portal/courses"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary-50 text-gray-700 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600 mr-3">
                  <Search className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Browse Courses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
            </Link>

            <Link
              href="/portal/events"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-accent-50 text-gray-700 transition-all group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-accent-100 rounded-lg text-accent-600 mr-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Join Event</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent-500" />
            </Link>
          </div>
        </div>

        {/* Upcoming Events Widget */}
        <div className="col-span-1 md:col-span-2 row-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
            <Link
              href="/portal/events"
              className="text-sm text-primary-600 font-medium hover:underline"
            >
              View Calendar
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="flex items-start p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mr-4 text-center bg-white border border-gray-200 rounded-lg p-2 w-14 shadow-sm">
                  <span className="block text-xs font-bold text-primary-600 uppercase">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="block text-lg font-bold text-gray-900">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.time}
                    <span className="mx-2">•</span>
                    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium text-gray-600">
                      {event.type}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {upcomingEvents.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No upcoming events scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Certificates Widget */}
        <div className="col-span-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 shadow-sm p-6 relative">
          <div className="absolute top-4 right-4">
            <Award className="w-6 h-6 text-amber-500 opacity-20" />
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">Certificates</h3>
          <p className="text-xs text-gray-500 mb-4">Your achievements</p>

          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold text-amber-600">
              {certificates.length}
            </span>
            <span className="text-sm font-medium text-gray-600 pb-1">Earned</span>
          </div>

          <Link
            href="/portal/certificates"
            className="flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            View All Certificates
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BentoDashboard;
