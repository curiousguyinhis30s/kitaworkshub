"use client";

import { useState } from 'react';
import Link from 'next/link';
import PortalLayout from '../components/PortalLayout';
import { ClockIcon, LocationIcon } from '../../components/icons/CustomIcons';
import { parseEventDateTime, getGoogleCalendarUrl, downloadICS } from '@/lib/utils/calendar';
import { useEventsData } from '@/lib/hooks/usePortalData';

export default function EventsPage() {
  const { registeredEvents, pastEvents, isLoading } = useEventsData();
  const [calendarMenuOpen, setCalendarMenuOpen] = useState<string | number | null>(null);

  const handleAddToCalendar = (event: typeof registeredEvents[0], type: 'google' | 'ics') => {
    const dateStr = `${event.month.split(' ')[0]} ${event.date}, ${event.month.split(' ')[1] || '2025'}`;
    const { start, end } = parseEventDateTime(dateStr, event.time);
    const calEvent = {
      title: event.title,
      description: `Confirmation: ${event.confirmationCode || 'N/A'}`,
      location: event.location,
      startDate: start,
      endDate: end,
    };

    if (type === 'google') {
      window.open(getGoogleCalendarUrl(calEvent), '_blank');
    } else {
      downloadICS(calEvent);
    }
    setCalendarMenuOpen(null);
  };

  if (isLoading) {
    return (
      <PortalLayout title="Events">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-xl border border-gray-200 h-40" />
          <div className="bg-white rounded-xl border border-gray-200 h-32" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Events">
      {/* Stats - Clean text, no colored pills */}
      <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
        <span>{registeredEvents.length} upcoming</span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span>{pastEvents.length} attended</span>
      </div>

      {/* Upcoming - Compact List */}
      {registeredEvents.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6">
          {registeredEvents.map((event) => (
            <div key={event.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* Date Badge - dark green, professional */}
                <div className="w-14 h-14 rounded-xl bg-primary-800 text-white flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold leading-none">{event.date}</span>
                  <span className="text-[10px] uppercase opacity-80">{event.month.split(' ')[0]}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-medium flex-shrink-0">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <ClockIcon size={14} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <LocationIcon size={14} />
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Actions - Desktop */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0 relative">
                  <div className="relative">
                    <button
                      onClick={() => setCalendarMenuOpen(calendarMenuOpen === event.id ? null : event.id)}
                      className="px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      + Calendar
                    </button>
                    {calendarMenuOpen === event.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                        <button
                          onClick={() => handleAddToCalendar(event, 'google')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          Google Calendar
                        </button>
                        <button
                          onClick={() => handleAddToCalendar(event, 'ics')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          Download .ics
                        </button>
                      </div>
                    )}
                  </div>
                  <Link href={`/events/${event.slug}`} className="px-4 py-2 text-sm bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium">
                    Details
                  </Link>
                </div>
              </div>

              {/* Actions - Mobile */}
              <div className="flex sm:hidden items-center gap-2 mt-3 ml-[72px]">
                <div className="relative">
                  <button
                    onClick={() => setCalendarMenuOpen(calendarMenuOpen === event.id ? null : event.id)}
                    className="px-3 py-1.5 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    + Calendar
                  </button>
                  {calendarMenuOpen === event.id && (
                    <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[160px]">
                      <button
                        onClick={() => handleAddToCalendar(event, 'google')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        Google Calendar
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(event, 'ics')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        Download .ics
                      </button>
                    </div>
                  )}
                </div>
                <Link href={`/events/${event.slug}`} className="px-3 py-1.5 text-sm bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
          <p className="text-gray-500 mb-4">No upcoming events</p>
          <Link href="/events" className="text-primary-700 font-medium hover:text-primary-800">
            Browse events →
          </Link>
        </div>
      )}

      {/* Past - Simple List */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Past Events</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {pastEvents.map((event) => (
              <div key={event.id} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{event.title}</span>
                  <span className="text-gray-400 text-sm ml-3">{event.date}</span>
                </div>
                {event.hasCert && (
                  <button className="px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                    View Certificate →
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </PortalLayout>
  );
}
