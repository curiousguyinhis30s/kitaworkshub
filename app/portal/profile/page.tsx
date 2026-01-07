"use client";

import PortalLayout from '../components/PortalLayout';
import { EditIcon } from '../../components/icons/CustomIcons';

const profile = {
  name: "Ahmad bin Abdullah",
  email: "ahmad.abdullah@company.com.my",
  phone: "+60 12-345 6789",
  company: "Petronas Dagangan Berhad",
  position: "Senior Project Manager",
  department: "Digital Transformation",
  memberSince: "January 2024",
  memberType: "Premium",
  bio: "Passionate about driving organizational change through effective project management and agile practices. 15+ years of experience in the oil & gas industry.",
  linkedin: "linkedin.com/in/ahmadabdullah",
  skills: ["Project Management", "Agile", "Scrum", "Leadership", "PMO Setup", "Stakeholder Management"],
};

export default function ProfilePage() {
  return (
    <PortalLayout title="Profile" subtitle="Manage your account settings">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              <button className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors flex items-center gap-2">
                <EditIcon size={16} />
                Edit Profile
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-xl bg-primary-800 flex items-center justify-center text-2xl font-bold text-white">
                  AB
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                  <p className="text-gray-500">{profile.position}</p>
                  <p className="text-gray-600 text-sm">{profile.company}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                    <span className="font-medium text-primary-700">{profile.memberType}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>Since {profile.memberSince}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{profile.bio}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{profile.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Phone</label>
                  <p className="text-gray-900 font-medium">{profile.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Department</label>
                  <p className="text-gray-900 font-medium">{profile.department}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">LinkedIn</label>
                  <p className="text-primary-700 font-medium">{profile.linkedin}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Skills & Expertise</h2>
              <button className="px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                + Add Skill
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                  Enable 2FA
                </button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Login Sessions</p>
                  <p className="text-sm text-gray-500">Manage your active sessions</p>
                </div>
                <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Achievements</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 text-sm">Courses Completed</span>
                <span className="text-xl font-bold text-gray-900">1</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 text-sm">Events Attended</span>
                <span className="text-xl font-bold text-gray-900">4</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-gray-600 text-sm">Certificates</span>
                <span className="text-xl font-bold text-gray-900">1</span>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-primary-800 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-white/20 rounded text-xs font-semibold">Premium</span>
              <span className="text-primary-200 text-xs">Active</span>
            </div>
            <p className="text-primary-100 text-sm mb-4">
              Full access to courses, events, and resources.
            </p>
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <p className="text-xs text-primary-200">Valid until</p>
              <p className="text-lg font-bold">December 2025</p>
            </div>
            <button className="w-full px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
              Manage Subscription
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Preferences</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">Course Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 text-sm">Event Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-700"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
