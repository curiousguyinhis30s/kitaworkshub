"use client";

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import {
  SearchIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  LearnIcon,
  UsersIcon,
  RevenueIcon
} from '../../components/icons/CustomIcons';
import { courses as sharedCourses, type Course } from '@/lib/data/courses';

// Extend shared courses with admin-specific calculated fields
const courses = sharedCourses.map(course => ({
  ...course,
  price: `RM ${course.price}`,
  revenue: `RM ${(course.enrollments * course.priceValue).toLocaleString()}`,
  revenueValue: course.enrollments * course.priceValue,
}));

const statusFilters = ["All", "Published", "Draft"];

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || course.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = courses.reduce((sum, c) => sum + c.revenueValue, 0);

  return (
    <AdminLayout title="Course Management" subtitle="Create and manage learning content">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <LearnIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{courses.length}</span>
          </div>
          <p className="text-primary-100">Total Courses</p>
        </div>
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">{courses.filter(c => c.status === 'published').length}</span>
          </div>
          <p className="text-accent-100">Published</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <UsersIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{courses.reduce((sum, c) => sum + c.enrollments, 0).toLocaleString()}</span>
          </div>
          <p className="text-emerald-100">Total Enrollments</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <RevenueIcon size={28} className="text-white/80" />
            <span className="text-3xl font-bold">RM {(totalRevenue / 1000000).toFixed(1)}M</span>
          </div>
          <p className="text-orange-100">Total Revenue</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by title or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <Link href="/admin/courses/create" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
            <AddIcon size={20} />
            Create Course with AI
          </Link>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="flex">
              {/* Thumbnail */}
              <div className={`w-32 flex-shrink-0 flex items-center justify-center text-3xl font-bold text-white ${
                course.status === 'published'
                  ? 'bg-gradient-to-br from-primary-600 to-primary-700'
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                {course.thumbnail}
              </div>

              {/* Details */}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        course.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">by {course.instructor}</p>
                  </div>
                  <span className="text-xl font-bold text-primary-600">{course.price}</span>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-400 block">Modules</span>
                    <span className="font-semibold text-gray-900">{course.modules}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Enrolled</span>
                    <span className="font-semibold text-gray-900">{course.enrollments}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Revenue</span>
                    <span className="font-semibold text-gray-900">{course.revenue}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Rating</span>
                    <span className="font-semibold text-gray-900">
                      {course.rating > 0 ? `★ ${course.rating}` : '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-2">
                    <ViewIcon size={16} />
                    View
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <EditIcon size={16} />
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                    <DeleteIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
