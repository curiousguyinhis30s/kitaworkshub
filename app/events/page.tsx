"use client";

import { useState, useRef } from 'react';
import { ArrowRight, Calendar, MapPin, Users, Clock, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import WarmHero from '../components/WarmHero';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useFormSubmit } from '@/lib/hooks/useFormSubmit';
import { events, eventTypes, eventMonths, type Event } from '@/lib/data/events';

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("All Events");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { isSubmitting, isSuccess, isError, message, submit, reset } = useFormSubmit('/api/event-registrations');

  const filteredEvents = events.filter(event => {
    const typeMatch = selectedType === "All Events" || event.type === selectedType;
    const monthMatch = selectedMonth === "All Months" || event.month === selectedMonth;
    return typeMatch && monthMatch;
  });

  // Sort: featured first
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await submit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      eventId: formData.get('event') as string,
      company: formData.get('company') as string,
      dietaryRequirements: formData.get('dietary') as string,
    }, formRef.current);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop':
        return 'bg-sage-100 text-sage-700';
      case 'Seminar':
        return 'bg-peach-100 text-peach-700';
      case 'Networking':
        return 'bg-lavender-100 text-lavender-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getBgColor = (index: number) => {
    const colors = [
      'bg-sage-600',
      'bg-peach-500',
      'bg-sage-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <WarmHero
          className="min-h-[700px] pt-24"
          variant="split"
          imageSrc="/images/heroes/hero-events.jpeg"
          imageAlt="Professional networking event in modern Malaysian conference venue"
        >
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-text mb-6 leading-tight">
              Events That{' '}
              <span className="text-sage-500">
                Connect & Elevate
              </span>
            </h1>
            <p className="text-lg text-text-muted max-w-lg mb-8">
              Join workshops, seminars, and networking events designed for adaptive leaders.
            </p>

            <div className="flex flex-wrap gap-6 text-sm font-medium text-text-muted">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-peach-500" />
                Monthly Events
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-peach-500" />
                Expert Speakers
              </span>
            </div>
          </div>
        </WarmHero>

        {/* Filter Section */}
        <section className="sticky top-20 z-30 bg-white border-b border-surface shadow-sm py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-heading font-bold text-text">Upcoming Events</h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Type Filter */}
                <div className="flex flex-wrap justify-center gap-2 p-1 bg-sage-50 rounded-lg">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedType === type
                          ? 'bg-sage-600 text-white shadow-md'
                          : 'text-sage-700 hover:bg-sage-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Month Filter */}
                <div className="flex flex-wrap justify-center gap-2 p-1 bg-peach-50 rounded-lg">
                  {eventMonths.map((month) => (
                    <button
                      key={month}
                      onClick={() => setSelectedMonth(month)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        selectedMonth === month
                          ? 'bg-peach-500 text-white shadow-md'
                          : 'text-peach-700 hover:bg-peach-100'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Events */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {sortedEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted text-lg mb-4">No events found matching your filters.</p>
                <Button
                  variant="link"
                  className="text-sage-600"
                  onClick={() => {
                    setSelectedType("All Events");
                    setSelectedMonth("All Months");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="relative group">
                {/* Left Arrow */}
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-surface text-text-muted hover:text-sage-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Scrollable Container */}
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {sortedEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`flex-shrink-0 w-[90vw] sm:w-[70vw] lg:w-[45vw] xl:w-[35vw] snap-start group/card flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                        event.featured ? 'ring-2 ring-peach-400' : ''
                      }`}
                    >
                      {/* Colored Header */}
                      <div className={`${getBgColor(index)} p-6`}>
                        <div className="flex gap-4 items-start">
                          {/* Date Badge */}
                          <div className="flex-shrink-0 w-20 h-20 bg-white/20 backdrop-blur rounded-xl flex flex-col items-center justify-center text-white">
                            <span className="text-3xl font-bold font-heading">{event.date}</span>
                            <span className="text-xs uppercase">{event.month.split(' ')[0]}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur text-white rounded-full text-xs font-bold uppercase tracking-wide">
                                {event.type}
                              </span>
                              {event.featured && (
                                <span className="px-2 py-0.5 bg-peach-400 text-charcoal rounded text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-white leading-tight font-heading">
                              {event.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed mt-4 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* White Content Area */}
                      <div className="bg-white p-5 flex flex-col flex-grow">
                        {/* Event Details */}
                        <div className="space-y-2 pb-4 border-b border-surface mb-4">
                          <div className="flex items-center gap-3 text-sm text-text-muted">
                            <Clock className="w-4 h-4 text-peach-500" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-muted">
                            <MapPin className="w-4 h-4 text-peach-500" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-muted">
                            <Users className="w-4 h-4 text-peach-500" />
                            <span>{event.speaker}</span>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-4 flex-grow">
                          <ul className="flex flex-wrap gap-2">
                            {event.highlights.slice(0, 3).map((highlight, i) => (
                              <li key={i} className="flex items-center gap-1 text-xs text-sage-700 bg-sage-50 px-2 py-1 rounded">
                                <CheckCircle2 className="w-3 h-3 text-peach-500" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Capacity Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-sage-500 mb-1">
                            <span>Seats</span>
                            <span>{event.registered}/{event.capacity}</span>
                          </div>
                          <div className="w-full bg-sage-100 rounded-full h-1.5">
                            <div
                              className="bg-peach-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Price & Register */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface">
                          <div>
                            {event.price === "Free" ? (
                              <span className="font-bold text-2xl text-peach-600 font-heading">FREE</span>
                            ) : (
                              <span className="font-bold text-2xl text-text font-heading">RM {event.price}</span>
                            )}
                          </div>

                          <Button
                            size="sm"
                            asChild
                          >
                            <a href="#register-section">
                              Register
                              <ArrowRight className="ml-1 w-3 h-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-surface text-text-muted hover:text-sage-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Scroll Right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Registration Section */}
        <section id="register-section" className="py-24 bg-sage-600 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">Register for an Event</h2>
              <p className="text-sage-100">Secure your spot. Limited seats available.</p>
            </div>

            <Card className="shadow-2xl border-0">
              <CardContent className="p-8">
                {isSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">You&apos;re registered!</h3>
                    <p className="text-text-muted mb-6">{message}</p>
                    <Button onClick={reset} variant="outline">Register for Another</Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    {isError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {message}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                          placeholder="+60 12-345 6789"
                        />
                      </div>
                      <div>
                        <label htmlFor="event-select" className="block text-sm font-medium text-text mb-1">
                          Event
                        </label>
                        <select
                          id="event-select"
                          name="event"
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50 bg-white"
                        >
                          {events.map(event => (
                            <option key={event.id} value={event.title}>
                              {event.title} - {event.date} {event.month}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-text mb-1">
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border border-sage-200 focus:border-sage-500 focus:ring-2 focus:ring-sage-500/20 outline-none transition-all disabled:opacity-50"
                        placeholder="Your company"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      variant="warm"
                      className="w-full py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-center text-xs text-text-muted">
                      You&apos;ll receive a confirmation email.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
