"use client";

import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  SearchIcon,
  ViewIcon,
  DeleteIcon,
  ContactsIcon,
  ClockIcon,
  SuccessIcon
} from '../../components/icons/CustomIcons';

const contacts = [
  {
    id: 1,
    name: "Sarah Lee",
    email: "sarah@company.com",
    phone: "+60 12-345 6789",
    company: "Tech Solutions Sdn Bhd",
    subject: "Corporate Training Inquiry",
    message: "We're looking to train our team of 50 project managers on Agile practices. Can you provide a customized package and quote?",
    type: "inquiry",
    status: "new",
    submittedAt: "30 min ago"
  },
  {
    id: 2,
    name: "James Wong",
    email: "james@startup.io",
    phone: "+60 17-987 6543",
    company: "StartupIO Malaysia",
    subject: "Partnership Opportunity",
    message: "We're a tech startup accelerator and would like to discuss potential partnerships for providing training to our portfolio companies.",
    type: "partnership",
    status: "new",
    submittedAt: "2 hours ago"
  },
  {
    id: 3,
    name: "Priya Sharma",
    email: "priya@enterprise.my",
    phone: "+60 19-111 2222",
    company: "Enterprise Corp",
    subject: "Bulk Enrollment Discount",
    message: "We want to enroll 25 employees in the PMO Fundamentals course. Do you offer volume discounts?",
    type: "inquiry",
    status: "replied",
    submittedAt: "5 hours ago"
  },
  {
    id: 4,
    name: "Ahmad Razak",
    email: "ahmad.r@gov.my",
    phone: "+60 13-444 5555",
    company: "JPM Malaysia",
    subject: "Government Training Programs",
    message: "Looking for approved training providers for government staff development programs. Are you HRDC certified?",
    type: "inquiry",
    status: "replied",
    submittedAt: "1 day ago"
  },
  {
    id: 5,
    name: "Michelle Tan",
    email: "m.tan@consulting.my",
    phone: "+60 16-777 8888",
    company: "Asia Consulting Group",
    subject: "Speaker Request",
    message: "Would any of your instructors be available to speak at our annual leadership conference in March 2025?",
    type: "speaking",
    status: "new",
    submittedAt: "1 day ago"
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    email: "rajesh@bank.com.my",
    phone: "+60 12-999 0000",
    company: "National Bank Malaysia",
    subject: "Custom Course Development",
    message: "We need a custom course on Digital Transformation for financial institutions. Can you develop tailored content?",
    type: "inquiry",
    status: "resolved",
    submittedAt: "3 days ago"
  }
];

const typeFilters = ["All", "Inquiry", "Partnership", "Speaking"];
const statusFilters = ["All", "New", "Replied", "Resolved"];

export default function AdminContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || contact.type === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === "All" || contact.status === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const newCount = contacts.filter(c => c.status === 'new').length;

  return (
    <AdminLayout title="Contact Inquiries" subtitle="Manage incoming messages and requests">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <ContactsIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{contacts.length}</span>
          </div>
          <p className="text-primary-100">Total Messages</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">{newCount}</span>
          </div>
          <p className="text-red-100">Needs Response</p>
        </div>
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">{contacts.filter(c => c.status === 'replied').length}</span>
          </div>
          <p className="text-accent-100">Replied</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <SuccessIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{contacts.filter(c => c.status === 'resolved').length}</span>
          </div>
          <p className="text-emerald-100">Resolved</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {typeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  typeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                statusFilter === filter
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
              {filter === 'New' && newCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">{newCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="xl:col-span-2 space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`bg-white rounded-2xl border shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedContact?.id === contact.id ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{contact.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        contact.status === 'new' ? 'bg-red-100 text-red-700' :
                        contact.status === 'replied' ? 'bg-accent-100 text-accent-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    contact.type === 'inquiry' ? 'bg-primary-100 text-primary-700' :
                    contact.type === 'partnership' ? 'bg-accent-100 text-accent-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 mb-1">{contact.subject}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{contact.message}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{contact.company}</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon size={14} />
                    {contact.submittedAt}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ViewIcon size={18} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteIcon size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Detail Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          {selectedContact ? (
            <>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedContact.name}</h3>
                    <p className="text-primary-100">{selectedContact.company}</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-primary-100">
                  <p>{selectedContact.email}</p>
                  <p>{selectedContact.phone}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Subject</span>
                  <h4 className="text-lg font-bold text-gray-900">{selectedContact.subject}</h4>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Message</span>
                  <p className="text-gray-700 mt-1 leading-relaxed">{selectedContact.message}</p>
                </div>

                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                    Reply via Email
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <ContactsIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
