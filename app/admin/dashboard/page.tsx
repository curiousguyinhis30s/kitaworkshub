"use client";

import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import {
  UsersIcon,
  LearnIcon,
  EventsIcon,
  RevenueIcon,
  AddIcon,
  ViewIcon,
  ContactsIcon,
  SuccessIcon,
  ClockIcon
} from '../../components/icons/CustomIcons';

const stats = [
  {
    icon: UsersIcon,
    label: "Total Users",
    value: "2,547",
    change: "+12%",
    changeLabel: "this month",
    color: "from-primary-600 to-primary-700"
  },
  {
    icon: LearnIcon,
    label: "Active Courses",
    value: "18",
    change: "+3",
    changeLabel: "this quarter",
    color: "from-accent-500 to-accent-600"
  },
  {
    icon: RevenueIcon,
    label: "Revenue (MTD)",
    value: "RM 248K",
    change: "+18%",
    changeLabel: "vs last month",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: EventsIcon,
    label: "Upcoming Events",
    value: "6",
    change: "2",
    changeLabel: "need attention",
    color: "from-orange-500 to-orange-600"
  }
];

const recentEnrollments = [
  { id: 1, student: "Siti Nurhaliza", course: "Agile Certified Practitioner", date: "2 hours ago", amount: "RM 3,500", avatar: "SN" },
  { id: 2, student: "Kumar Selvam", course: "PMO Fundamentals & Setup", date: "5 hours ago", amount: "RM 2,800", avatar: "KS" },
  { id: 3, student: "Fatimah Zahra", course: "Executive Leadership Presence", date: "1 day ago", amount: "RM 1,800", avatar: "FZ" },
  { id: 4, student: "Ahmad Razak", course: "Advanced Scrum Master Training", date: "1 day ago", amount: "RM 2,400", avatar: "AR" },
  { id: 5, student: "Tan Wei Ming", course: "Project Management Essentials", date: "2 days ago", amount: "RM 2,200", avatar: "TW" }
];

const recentContacts = [
  { id: 1, name: "Sarah Lee", email: "sarah@company.com", subject: "Corporate Training Inquiry", time: "30 min ago", status: "new" },
  { id: 2, name: "James Wong", email: "james@startup.io", subject: "Partnership Opportunity", time: "2 hours ago", status: "new" },
  { id: 3, name: "Priya Sharma", email: "priya@enterprise.my", subject: "Bulk Enrollment Discount", time: "5 hours ago", status: "replied" },
];

const upcomingEvents = [
  { id: 1, title: "Building Resilient PMO Systems", date: "Jan 15, 2025", registrations: 45, capacity: 50 },
  { id: 2, title: "Leadership in the Age of AI", date: "Jan 22, 2025", registrations: 120, capacity: 200 },
  { id: 3, title: "Agile Fundamentals Workshop", date: "Feb 5, 2025", registrations: 28, capacity: 30 },
];

export default function AdminDashboardPage() {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get today's date formatted
  const today = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {getGreeting()}, <span className="text-indigo-300">Admin</span>
            </h1>
            <p className="text-slate-300 mt-1">
              Welcome to KitaWorksHub Admin Panel. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="text-right text-sm text-slate-400">
            {today}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold">{stat.value}</span>
              </div>
            </div>
            <p className="text-white/80 text-sm">{stat.label}</p>
            <p className="text-white/60 text-xs mt-1">
              <span className="text-white font-medium">{stat.change}</span> {stat.changeLabel}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/courses" className="flex flex-col items-center gap-3 p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group">
            <div className="w-14 h-14 bg-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AddIcon size={24} className="text-white" />
            </div>
            <span className="font-semibold text-primary-900">Add Course</span>
          </Link>
          <Link href="/admin/events" className="flex flex-col items-center gap-3 p-6 bg-accent-50 rounded-xl hover:bg-accent-100 transition-colors group">
            <div className="w-14 h-14 bg-accent-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <AddIcon size={24} className="text-white" />
            </div>
            <span className="font-semibold text-accent-900">Add Event</span>
          </Link>
          <Link href="/admin/contacts" className="flex flex-col items-center gap-3 p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ContactsIcon size={24} className="text-white" />
            </div>
            <span className="font-semibold text-orange-900">View Contacts</span>
          </Link>
          <Link href="/admin/users" className="flex flex-col items-center gap-3 p-6 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group">
            <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <UsersIcon size={24} className="text-white" />
            </div>
            <span className="font-semibold text-emerald-900">Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Enrollments - Takes 2 columns */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Enrollments</h2>
              <p className="text-gray-500 text-sm">Latest course registrations</p>
            </div>
            <Link href="/admin/users" className="text-primary-600 text-sm font-medium hover:text-primary-700">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">Course</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">Date</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Amount</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map(enrollment => (
                  <tr key={enrollment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
                          {enrollment.avatar}
                        </div>
                        <span className="font-medium text-gray-900">{enrollment.student}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{enrollment.course}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{enrollment.date}</td>
                    <td className="py-4 px-6 text-right font-semibold text-gray-900">{enrollment.amount}</td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ViewIcon size={18} className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Contacts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Recent Contacts</h2>
              <Link href="/admin/contacts" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center text-sm font-bold text-white">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    {contact.status === 'new' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">New</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.subject}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <ClockIcon size={12} />
                    {contact.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
              <Link href="/admin/events" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {upcomingEvents.map((event) => {
                const percentFull = (event.registrations / event.capacity) * 100;
                const isAlmostFull = percentFull >= 80;
                return (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                      {isAlmostFull && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded">Almost Full</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{event.date}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isAlmostFull ? 'bg-orange-500' : 'bg-primary-500'}`}
                          style={{ width: `${percentFull}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {event.registrations}/{event.capacity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
