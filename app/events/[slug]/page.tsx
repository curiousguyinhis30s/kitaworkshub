"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Users, Calendar, CheckCircle2, User, AlertCircle } from 'lucide-react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { getEventBySlug } from '@/lib/data/events';

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = getEventBySlug(slug);

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/events">
              <Button>Browse All Events</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registered;
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft > 0 && spotsLeft <= 10;

  const scrollToRegister = () => {
    const registerSection = document.getElementById('register-section');
    registerSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event type colors
  const typeColors: Record<string, string> = {
    Workshop: 'bg-primary-700',
    Seminar: 'bg-primary-800',
    Networking: 'bg-primary-600',
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/events" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className={`${typeColors[event.type]} text-white pt-12 pb-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Event Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold uppercase tracking-wide">
                    {event.type}
                  </span>
                  {isAlmostFull && !isFull && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-full text-xs font-semibold">
                      Almost Full
                    </span>
                  )}
                  {isFull && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-xs font-semibold">
                      Sold Out
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  {event.longDescription || event.description}
                </p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-white/70" />
                    <span>{event.date} {event.month}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/70" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-white/70" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/70" />
                    <span>{event.registered}/{event.capacity} registered</span>
                  </div>
                </div>
              </div>

              {/* Registration Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900">
                  <div className="mb-6">
                    <span className="text-sm text-gray-500">Registration Fee</span>
                    <p className="text-4xl font-bold text-primary-900">
                      {event.priceValue === 0 ? 'Free' : `RM ${event.price}`}
                    </p>
                  </div>

                  {/* Spots indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">{event.registered} registered</span>
                      <span className="text-gray-600">{spotsLeft} spots left</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-primary-600'
                        }`}
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={scrollToRegister}
                    disabled={isFull}
                    className={`w-full py-6 text-lg mb-4 ${
                      isFull
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-700 hover:bg-primary-800'
                    }`}
                  >
                    {isFull ? 'Sold Out' : 'Register Now'}
                  </Button>

                  <div className="space-y-3 text-sm">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-primary-700" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Agenda */}
                {event.agenda && event.agenda.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-24 flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-700">{item.time}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Speaker */}
                {event.speakerBio && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {event.type === 'Networking' ? 'About This Event' : 'Your Speaker'}
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6 flex gap-6">
                      <div className="w-16 h-16 rounded-xl bg-primary-700 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                        {event.speaker.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{event.speaker}</h3>
                        <p className="text-gray-600">{event.speakerBio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Details */}
                {event.address && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{event.location}</h3>
                          <p className="text-gray-600">{event.address}</p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary-700 text-sm font-medium mt-3 hover:text-primary-800"
                          >
                            View on Google Maps →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Requirements */}
                {event.requirements && event.requirements.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-primary-700" />
                      What to Bring
                    </h3>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Event Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{event.date} {event.month}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary-700 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Capacity</p>
                        <p className="font-medium text-gray-900">{event.capacity} participants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registration CTA */}
        <section id="register-section" className="py-20 bg-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {isFull ? 'This Event is Sold Out' : 'Secure Your Spot'}
            </h2>
            <p className="text-primary-100 text-lg mb-8">
              {isFull
                ? 'Join our waitlist to be notified if a spot opens up.'
                : `Only ${spotsLeft} spots remaining. Register now to join ${event.registered} other professionals.`}
            </p>
            <div className="bg-white rounded-2xl p-8 text-gray-900 max-w-md mx-auto">
              <div className="mb-6">
                <span className="text-sm text-gray-500">Registration Fee</span>
                <p className="text-4xl font-bold text-primary-900">
                  {event.priceValue === 0 ? 'Free' : `RM ${event.price}`}
                </p>
              </div>
              <Link href={`/events?register=${event.slug}`}>
                <Button
                  className={`w-full py-6 text-lg ${
                    isFull
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-700 hover:bg-primary-800'
                  }`}
                  disabled={isFull}
                >
                  {isFull ? 'Join Waitlist' : 'Register Now'}
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Confirmation email sent immediately
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
