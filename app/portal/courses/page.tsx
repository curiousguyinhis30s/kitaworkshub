"use client";

import PortalLayout from '../components/PortalLayout';
import Link from 'next/link';
import { useCoursesData } from '@/lib/hooks/usePortalData';

// Progress Circle Component for consistent treatment
function ProgressCircle({ progress, size = 40 }: { progress: number; size?: number }) {
  const isComplete = progress === 100;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90" viewBox="0 0 36 36" style={{ width: size, height: size }}>
        <circle
          cx="18" cy="18" r="15"
          fill="none"
          className="stroke-gray-100"
          strokeWidth="3"
        />
        <circle
          cx="18" cy="18" r="15"
          fill="none"
          className={isComplete ? "stroke-primary-700" : "stroke-primary-600"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progress * 0.94} 100`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
        {isComplete ? (
          <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          `${progress}`
        )}
      </span>
    </div>
  );
}

export default function CoursesPage() {
  const { courses, isLoading } = useCoursesData();

  if (isLoading) {
    return (
      <PortalLayout title="Courses">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-64" />
        </div>
      </PortalLayout>
    );
  }

  const inProgress = courses.filter(c => c.progress < 100);
  const completed = courses.filter(c => c.progress === 100);

  return (
    <PortalLayout title="Courses">
      {/* Stats - Clean text, no colored pills */}
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
        <span>{courses.length} enrolled</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{inProgress.length} in progress</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{completed.length} completed</span>
      </div>

      {/* Continue Learning - Featured */}
      {inProgress.length > 0 && (
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Current Course - Large Card */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Continue where you left off</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{inProgress[0].title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">with {inProgress[0].instructor} · {inProgress[0].currentModule || 'In Progress'}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary-700">{inProgress[0].progress}%</span>
                  <p className="text-xs text-gray-400">{inProgress[0].lessonsLeft} lessons left</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${inProgress[0].progress}%` }} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">Last accessed: {inProgress[0].lastAccessed}</span>
                <Link href={`/courses/${inProgress[0].slug}`} className="px-5 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors">
                  Continue →
                </Link>
              </div>
            </div>

            {/* Other in-progress courses */}
            {inProgress.slice(1).map((course) => (
              <div key={course.id} className="p-4 flex items-center gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                {/* Progress Circle */}
                <ProgressCircle progress={course.progress} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                  <p className="text-xs text-gray-400">{course.lessonsLeft} lessons left · {course.lastAccessed}</p>
                </div>
                <Link href={`/courses/${course.slug}`} className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors">
                  Resume
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Completed</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {completed.map((course) => (
              <div key={course.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Completed Progress Circle */}
                  <ProgressCircle progress={100} />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                    <p className="text-xs text-gray-400">with {course.instructor}</p>
                  </div>
                </div>
                <Link
                  href="/portal/certificates"
                  className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Certificate →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 mb-4">No courses yet</p>
          <Link href="/courses" className="text-primary-700 font-medium hover:text-primary-800">
            Browse courses →
          </Link>
        </div>
      )}
    </PortalLayout>
  );
}
