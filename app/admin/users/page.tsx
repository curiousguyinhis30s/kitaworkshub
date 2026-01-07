"use client";

import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  SearchIcon,
  FilterIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  AddIcon,
  LearnIcon,
  EventsIcon,
  CertificateIcon
} from '../../components/icons/CustomIcons';

const users = [
  {
    id: 1,
    name: "Ahmad bin Abdullah",
    email: "ahmad.abdullah@company.com.my",
    company: "Petronas Dagangan Berhad",
    memberType: "Premium",
    enrolledCourses: 3,
    eventsAttended: 6,
    certificates: 2,
    joinedAt: "Jan 2024",
    status: "active",
    avatar: "AA"
  },
  {
    id: 2,
    name: "Siti Nurhaliza binti Hassan",
    email: "siti.nurhaliza@startup.io",
    company: "TechStart Malaysia",
    memberType: "Premium",
    enrolledCourses: 2,
    eventsAttended: 4,
    certificates: 1,
    joinedAt: "Mar 2024",
    status: "active",
    avatar: "SN"
  },
  {
    id: 3,
    name: "Kumar Selvam",
    email: "kumar.s@enterprise.my",
    company: "Maybank Berhad",
    memberType: "Standard",
    enrolledCourses: 1,
    eventsAttended: 2,
    certificates: 0,
    joinedAt: "Jun 2024",
    status: "active",
    avatar: "KS"
  },
  {
    id: 4,
    name: "Fatimah Zahra Abdullah",
    email: "fatimah.z@gov.my",
    company: "MAMPU",
    memberType: "Premium",
    enrolledCourses: 4,
    eventsAttended: 8,
    certificates: 3,
    joinedAt: "Nov 2023",
    status: "active",
    avatar: "FZ"
  },
  {
    id: 5,
    name: "Tan Wei Ming",
    email: "weiming.tan@corp.com",
    company: "CIMB Group",
    memberType: "Standard",
    enrolledCourses: 2,
    eventsAttended: 3,
    certificates: 1,
    joinedAt: "Aug 2024",
    status: "inactive",
    avatar: "TW"
  },
  {
    id: 6,
    name: "Priya Sharma",
    email: "priya@consulting.my",
    company: "Deloitte Malaysia",
    memberType: "Premium",
    enrolledCourses: 5,
    eventsAttended: 10,
    certificates: 4,
    joinedAt: "Feb 2024",
    status: "active",
    avatar: "PS"
  }
];

const memberFilters = ["All", "Premium", "Standard"];
const statusFilters = ["All", "Active", "Inactive"];

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [memberFilter, setMemberFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMember = memberFilter === "All" || user.memberType === memberFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter.toLowerCase();
    return matchesSearch && matchesMember && matchesStatus;
  });

  return (
    <AdminLayout title="User Management" subtitle="Manage platform users and memberships">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">2,547</span>
          </div>
          <p className="text-primary-100">Total Users</p>
        </div>
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">1,823</span>
          </div>
          <p className="text-accent-100">Premium Members</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">2,401</span>
          </div>
          <p className="text-emerald-100">Active Users</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">+127</span>
          </div>
          <p className="text-orange-100">New This Month</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {memberFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setMemberFilter(filter)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  memberFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  statusFilter === filter
                    ? 'bg-accent-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            <p className="text-gray-500 text-sm">Showing {filteredUsers.length} of {users.length} users</p>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
            <AddIcon size={18} />
            Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-600 text-sm">Company</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">Membership</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">Activity</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-600 text-sm">Status</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-600">{user.company}</p>
                    <p className="text-xs text-gray-400">Joined {user.joinedAt}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.memberType === 'Premium'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.memberType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600" title="Courses">
                        <LearnIcon size={14} className="text-primary-500" />
                        <span>{user.enrolledCourses}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600" title="Events">
                        <EventsIcon size={14} className="text-accent-500" />
                        <span>{user.eventsAttended}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600" title="Certificates">
                        <CertificateIcon size={14} className="text-orange-500" />
                        <span>{user.certificates}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <ViewIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <EditIcon size={18} className="text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <DeleteIcon size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-6 of 2,547 users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
