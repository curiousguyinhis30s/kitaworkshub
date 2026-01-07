"use client";

import Link from 'next/link';
import PortalLayout from '../components/PortalLayout';
import { useDashboardData } from '@/lib/hooks/usePortalData';
import {
  BookOpen,
  Calendar,
  Award,
  Clock,
  Trophy,
  Zap,
  ArrowRight,
  PlayCircle,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
        </div>
      </PortalLayout>
    );
  }

  const currentCourse = data?.enrolledCourses?.find(c => c.progress < 100) || data?.enrolledCourses?.[0];

  return (
    <PortalLayout>
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-text dark:text-sage-100">
            Welcome back 👋
          </h1>
          <p className="text-text-muted dark:text-sage-400">
            Here&apos;s what&apos;s happening with your learning today.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* 1. Continue Learning (Spans 2 cols) */}
          <div className="group col-span-1 md:col-span-2 rounded-2xl border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900/50 p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sage-600 dark:text-sage-400">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wider">Continue Learning</span>
              </div>
              <Link
                href={currentCourse ? `/portal/courses/${currentCourse.slug}` : '/portal/courses'}
                className="rounded-full bg-sage-50 dark:bg-sage-800 px-3 py-1 text-xs font-medium text-sage-700 dark:text-sage-300 transition-colors hover:bg-sage-100 dark:hover:bg-sage-700"
              >
                Resume
              </Link>
            </div>

            <h2 className="font-heading mb-1 text-xl font-bold text-text dark:text-sage-100">
              {currentCourse?.title || 'Agile Certified Practitioner'}
            </h2>
            <p className="mb-6 text-sm text-text-muted dark:text-sage-400">
              {currentCourse?.nextLesson || 'Module 3: Scrum Framework Mastery'}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-sage-800 dark:text-sage-300">
                <span>Progress</span>
                <span>{currentCourse?.progress || 45}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-sage-100 dark:bg-sage-800">
                <div
                  className="h-full rounded-full bg-sage-500 transition-all duration-500"
                  style={{ width: `${currentCourse?.progress || 45}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Upcoming Events */}
          <div className="col-span-1 rounded-2xl border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900/50 p-6 shadow-sm hover:border-sage-200 dark:hover:border-sage-700 transition-colors">
            <div className="mb-4 flex items-center gap-2 text-sage-600 dark:text-sage-400">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Events</span>
            </div>
            <div className="space-y-4">
              {(data?.upcomingEvents || [
                { id: 1, title: 'PMO Workshop', date: '15', month: 'Jan', time: '10:00 AM' },
                { id: 2, title: 'Agile Seminar', date: '22', month: 'Jan', time: '2:00 PM' },
                { id: 3, title: 'Networking', date: '28', month: 'Jan', time: '6:00 PM' }
              ]).slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sage-50 dark:bg-sage-800 text-sage-700 dark:text-sage-300 font-bold text-xs">
                    <div className="text-center leading-none">
                      <span className="block text-lg">{event.date}</span>
                      <span className="uppercase text-[10px]">{typeof event.month === 'string' ? event.month.slice(0, 3) : ''}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text dark:text-sage-100">{event.title}</h4>
                    <p className="text-xs text-text-muted dark:text-sage-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Your Certificates (Peach Accent) */}
          <div className="col-span-1 relative overflow-hidden rounded-2xl border border-peach-100 dark:border-peach-900 bg-peach-50 dark:bg-peach-950/30 p-6 shadow-sm">
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2 text-peach-700 dark:text-peach-400">
                <Award className="w-5 h-5" />
                <span className="font-semibold text-sm uppercase tracking-wider">Certificates</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-peach-900 dark:text-peach-200">{data?.stats?.certificates || 3}</span>
                <span className="text-sm font-medium text-peach-700 dark:text-peach-400">Earned</span>
              </div>
              <p className="mt-2 text-xs text-peach-800/70 dark:text-peach-400/70">Complete courses to earn more</p>
              <Link
                href="/portal/certificates"
                className="mt-4 flex items-center gap-1 text-sm font-semibold text-peach-700 dark:text-peach-400 hover:text-peach-900 dark:hover:text-peach-300 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Decorative background element */}
            <Award className="absolute -bottom-4 -right-4 w-24 h-24 text-peach-200/50 dark:text-peach-800/30" />
          </div>

          {/* 4. Learning Stats */}
          <div className="col-span-1 rounded-2xl border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sage-600 dark:text-sage-400">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-sage-50 dark:bg-sage-800/50 p-3 text-center">
                <Clock className="w-4 h-4 mx-auto text-sage-600 dark:text-sage-400 mb-1" />
                <div className="text-lg font-bold text-sage-900 dark:text-sage-100">{data?.stats?.learningHours || 24}h</div>
                <div className="text-[10px] uppercase font-bold text-sage-500 dark:text-sage-500 tracking-wide">Hours</div>
              </div>
              <div className="rounded-lg bg-sage-50 dark:bg-sage-800/50 p-3 text-center">
                <Zap className="w-4 h-4 mx-auto text-sage-600 dark:text-sage-400 mb-1" />
                <div className="text-lg font-bold text-sage-900 dark:text-sage-100">{data?.stats?.activeCourses || 2}</div>
                <div className="text-[10px] uppercase font-bold text-sage-500 dark:text-sage-500 tracking-wide">Active</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-sage-100 dark:border-sage-700 bg-white dark:bg-sage-800/30 p-3">
              <span className="text-xs font-medium text-text-muted dark:text-sage-400">Rank</span>
              <span className="text-sm font-bold text-sage-700 dark:text-sage-300">Scholar</span>
            </div>
          </div>

          {/* 5. Quick Actions */}
          <div className="col-span-1 rounded-2xl border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sage-600 dark:text-sage-400">
              <Zap className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/portal/courses"
                className="flex items-center justify-between rounded-lg border border-sage-100 dark:border-sage-700 p-3 text-left text-sm font-medium text-text dark:text-sage-200 transition-all hover:bg-sage-50 dark:hover:bg-sage-800 hover:border-sage-200 dark:hover:border-sage-600"
              >
                <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Browse Courses</span>
                <ArrowRight className="w-4 h-4 text-sage-400" />
              </Link>
              <Link
                href="/portal/events"
                className="flex items-center justify-between rounded-lg border border-sage-100 dark:border-sage-700 p-3 text-left text-sm font-medium text-text dark:text-sage-200 transition-all hover:bg-sage-50 dark:hover:bg-sage-800 hover:border-sage-200 dark:hover:border-sage-600"
              >
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> View Events</span>
                <ArrowRight className="w-4 h-4 text-sage-400" />
              </Link>
              <Link
                href="/portal/resources"
                className="flex items-center justify-between rounded-lg border border-sage-100 dark:border-sage-700 p-3 text-left text-sm font-medium text-text dark:text-sage-200 transition-all hover:bg-sage-50 dark:hover:bg-sage-800 hover:border-sage-200 dark:hover:border-sage-600"
              >
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Resources</span>
                <ArrowRight className="w-4 h-4 text-sage-400" />
              </Link>
            </div>
          </div>

          {/* 6. Recent Activity */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl border border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sage-600 dark:text-sage-400">
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Recent Activity</span>
            </div>
            <div className="relative border-l-2 border-sage-100 dark:border-sage-700 ml-2 space-y-5 pb-2">
              {(data?.recentActivity || [
                { id: 1, text: 'Completed Lesson: Agile Manifesto Deep Dive', time: '2 hours ago' },
                { id: 2, text: 'Earned Badge: Fast Learner', time: '1 day ago' },
                { id: 3, text: 'Enrolled in: PMO Fundamentals & Setup', time: '3 days ago' }
              ]).map((activity) => (
                <div key={activity.id} className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white dark:border-sage-900 bg-sage-300 dark:bg-sage-600" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-500" />
                    <p className="text-sm font-medium text-text dark:text-sage-200">{activity.text}</p>
                  </div>
                  <p className="text-[11px] text-text-muted dark:text-sage-500 mt-1 ml-6">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PortalLayout>
  );
}
