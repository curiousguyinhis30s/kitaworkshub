"use client";

import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import {
  SearchIcon,
  AddIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  EventsIcon,
  UsersIcon,
  LocationIcon,
  ClockIcon,
  RevenueIcon
} from '../../components/icons/CustomIcons';
import { events as sharedEvents } from '@/lib/data/events';

// Extend shared events with admin-specific fields
const events = sharedEvents.map(event => ({
  ...event,
  date: `${event.month.split(' ')[0]} ${event.date}, ${event.month.split(' ')[1]}`,
  price: event.price === "Free" ? "FREE" : `RM ${event.price}`,
  registrations: event.registered,
  status: "upcoming" as "upcoming" | "completed", // All shared events are upcoming
}));

const typeFilters = ["All", "Workshop", "Seminar", "Networking"];
const statusFilters = ["All", "Upcoming", "Completed"];

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || event.type === typeFilter;
    const matchesStatus = statusFilter === "All" || event.status === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const totalRegistrations = events.reduce((sum, e) => sum + e.registrations, 0);

  return (
    <AdminLayout title="Event Management" subtitle="Organize and track events">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <EventsIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{events.length}</span>
          </div>
          <p className="text-primary-100">Total Events</p>
        </div>
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl font-bold">{upcomingEvents.length}</span>
          </div>
          <p className="text-accent-100">Upcoming</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <UsersIcon size={28} className="text-white/80" />
            <span className="text-4xl font-bold">{totalRegistrations.toLocaleString()}</span>
          </div>
          <p className="text-emerald-100">Total Registrations</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <RevenueIcon size={28} className="text-white/80" />
            <span className="text-3xl font-bold">RM 485K</span>
          </div>
          <p className="text-orange-100">Event Revenue</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px] relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
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
          <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2">
            <AddIcon size={20} />
            Create Event
          </button>
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
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const percentFull = (event.registrations / event.capacity) * 100;
          const isAlmostFull = percentFull >= 80;
          const isFull = percentFull >= 100;

          return (
            <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                {/* Date Sidebar */}
                <div className={`w-28 flex-shrink-0 flex flex-col items-center justify-center py-6 ${
                  event.status === 'upcoming'
                    ? 'bg-gradient-to-br from-accent-500 to-accent-600'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                } text-white`}>
                  <span className="text-3xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                  <span className="text-sm uppercase">{event.date.split(' ')[0]}</span>
                  <span className="text-xs opacity-80">{event.date.split(' ')[2]}</span>
                </div>

                {/* Event Details */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          event.type === 'Workshop' ? 'bg-primary-100 text-primary-700' :
                          event.type === 'Seminar' ? 'bg-accent-100 text-accent-700' :
                          event.type === 'Networking' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {event.type}
                        </span>
                        {event.status === 'completed' && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            Completed
                          </span>
                        )}
                        {isFull && event.status === 'upcoming' && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                            Sold Out
                          </span>
                        )}
                        {isAlmostFull && !isFull && event.status === 'upcoming' && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
                            Almost Full
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      <p className="text-gray-500 text-sm">Speaker: {event.speaker}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">{event.price}</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ClockIcon size={18} className="text-gray-400" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <LocationIcon size={18} className="text-gray-400" />
                      {event.location}
                    </div>
                    <div>
                      <span className="text-gray-400 block">Capacity</span>
                      <span className="font-semibold text-gray-900">{event.capacity} seats</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Registrations</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{event.registrations}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${Math.min(percentFull, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex items-center gap-2">
                      <ViewIcon size={16} />
                      View Registrations
                    </button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <EditIcon size={16} />
                      Edit Event
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                      <DeleteIcon size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
