"use client";

import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { useAuth } from '@/lib/context/AuthContext';

// Types
interface DashboardData {
  user: { name: string; avatar: string | null };
  stats: {
    activeCourses: number;
    upcomingEvents: number;
    certificates: number;
    learningHours: number;
  };
  enrolledCourses: EnrolledCourse[];
  upcomingEvents: UpcomingEvent[];
  recentActivity: Activity[];
}

interface EnrolledCourse {
  id: string | number;
  slug: string;
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string | null;
  lessonsLeft: number;
  lastAccessed: string;
  currentModule: string | null;
}

interface UpcomingEvent {
  id: string | number;
  slug: string;
  title: string;
  date: string;
  month: string;
  time: string;
  location: string;
  type: string;
  confirmationCode?: string;
}

interface Activity {
  id: string | number;
  text: string;
  time: string;
  type: 'lesson' | 'certificate' | 'event' | 'resource';
}

interface Certificate {
  id: string;
  courseName: string;
  courseSlug: string;
  credentialId: string;
  issuedDate: string;
  expiryDate: string | null;
  skills: string[];
  score: number | null;
}

// Demo data for when PocketBase is not available
const DEMO_ENROLLED_COURSES: EnrolledCourse[] = [
  {
    id: 1,
    slug: 'agile-certified-practitioner',
    title: 'Agile Certified Practitioner',
    instructor: 'Sarah Lim',
    progress: 75,
    nextLesson: 'Sprint Retrospectives',
    lessonsLeft: 12,
    lastAccessed: '2h ago',
    currentModule: 'Sprint Planning'
  },
  {
    id: 2,
    slug: 'pmo-fundamentals',
    title: 'PMO Fundamentals & Setup',
    instructor: 'David Chen',
    progress: 40,
    nextLesson: 'Governance Frameworks',
    lessonsLeft: 21,
    lastAccessed: '1d ago',
    currentModule: 'Governance'
  },
  {
    id: 3,
    slug: 'executive-leadership-presence',
    title: 'Executive Leadership Presence',
    instructor: 'Amina Karim',
    progress: 100,
    nextLesson: null,
    lessonsLeft: 0,
    lastAccessed: '1w ago',
    currentModule: null
  },
];

const DEMO_EVENTS: UpcomingEvent[] = [
  {
    id: 1,
    slug: 'building-resilient-pmo-systems',
    title: 'Building Resilient PMO Systems',
    date: '15',
    month: 'Jan 2025',
    time: '9:00 AM',
    location: 'KL Convention Centre',
    type: 'Workshop',
    confirmationCode: 'KWH-2025-001234'
  },
  {
    id: 2,
    slug: 'leadership-in-the-age-of-ai',
    title: 'Leadership in the Age of AI',
    date: '22',
    month: 'Jan 2025',
    time: '2:00 PM',
    location: 'Online (Zoom)',
    type: 'Seminar',
    confirmationCode: 'KWH-2025-001567'
  },
];

const DEMO_ACTIVITIES: Activity[] = [
  { id: 1, text: 'Completed lesson: Stakeholder Analysis', time: '2h ago', type: 'lesson' },
  { id: 2, text: 'Earned Certificate: Agile Foundations', time: '1d ago', type: 'certificate' },
  { id: 3, text: 'Registered for Leadership in AI webinar', time: '2d ago', type: 'event' },
];

const DEMO_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    courseName: 'Executive Leadership Presence',
    courseSlug: 'executive-leadership-presence',
    credentialId: 'KWH-ELP-2024-00847',
    issuedDate: '2024-11-15',
    expiryDate: null,
    skills: ['Executive Presence', 'Strategic Communication', 'Stakeholder Influence', 'Leadership Brand'],
    score: 92,
  },
];

// Hook for dashboard data
export function useDashboardData() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (authLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated && user) {
          // Fetch real data from PocketBase
          const userId = user.id;

          // Fetch enrollments with course data
          const enrollments = await pb.collection('enrollments').getFullList({
            filter: `user="${userId}" && status!="cancelled"`,
            expand: 'course',
            sort: '-created',
          });

          // Fetch event registrations
          const registrations = await pb.collection('event_registrations').getFullList({
            filter: `user="${userId}" && status="confirmed"`,
            expand: 'event',
            sort: 'event.date',
          });

          // Fetch certificates
          const certificates = await pb.collection('certificates').getFullList({
            filter: `user="${userId}"`,
            expand: 'course',
          });

          // Fetch recent activity
          const activities = await pb.collection('activity_logs').getFullList({
            filter: `user="${userId}"`,
            sort: '-created',
            perPage: 5,
          });

          // Calculate learning hours from completed lessons
          const lessonProgress = await pb.collection('lesson_progress').getFullList({
            filter: `user="${userId}" && completed=true`,
            expand: 'lesson',
          });

          const learningMinutes = lessonProgress.reduce((acc, lp) => {
            return acc + (lp.expand?.lesson?.duration_minutes || 0);
          }, 0);

          setData({
            user: {
              name: user.name?.split(' ')[0] || 'User',
              avatar: user.avatar || null,
            },
            stats: {
              activeCourses: enrollments.filter(e => e.status === 'active').length,
              upcomingEvents: registrations.length,
              certificates: certificates.length,
              learningHours: Math.round(learningMinutes / 60),
            },
            enrolledCourses: enrollments.map(e => {
              const course = e.expand?.course;
              return {
                id: e.id,
                slug: course?.slug || 'unknown',
                title: course?.title || 'Unknown Course',
                instructor: course?.instructor_name || 'Unknown',
                progress: e.status === 'completed' ? 100 : 50, // Calculate from lesson_progress
                nextLesson: e.status === 'completed' ? null : 'Continue Learning',
                lessonsLeft: 0,
                lastAccessed: 'Recently',
                currentModule: null,
              };
            }),
            upcomingEvents: registrations.map(r => {
              const event = r.expand?.event;
              const eventDate = event?.date ? new Date(event.date) : new Date();
              return {
                id: r.id,
                slug: event?.slug || 'unknown',
                title: event?.title || 'Unknown Event',
                date: eventDate.getDate().toString(),
                month: eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                time: event?.time || 'TBA',
                location: event?.location || 'TBA',
                type: event?.type || 'Event',
                confirmationCode: r.confirmation_code,
              };
            }),
            recentActivity: activities.map(a => ({
              id: a.id,
              text: `${a.action}: ${a.detail}`,
              time: getRelativeTime(a.created),
              type: a.type,
            })),
          });
        } else {
          // Use demo data
          setData({
            user: { name: 'Ahmad', avatar: null },
            stats: {
              activeCourses: 2,
              upcomingEvents: 2,
              certificates: 1,
              learningHours: 42,
            },
            enrolledCourses: DEMO_ENROLLED_COURSES,
            upcomingEvents: DEMO_EVENTS,
            recentActivity: DEMO_ACTIVITIES,
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        // Fallback to demo data on error
        setData({
          user: { name: 'Ahmad', avatar: null },
          stats: {
            activeCourses: 2,
            upcomingEvents: 2,
            certificates: 1,
            learningHours: 42,
          },
          enrolledCourses: DEMO_ENROLLED_COURSES,
          upcomingEvents: DEMO_EVENTS,
          recentActivity: DEMO_ACTIVITIES,
        });
        setError('Using demo data - PocketBase connection failed');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, isAuthenticated, authLoading]);

  return { data, isLoading: isLoading || authLoading, error };
}

// Hook for courses data
export function useCoursesData() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (authLoading) return;

      setIsLoading(true);

      try {
        if (isAuthenticated && user) {
          const enrollments = await pb.collection('enrollments').getFullList({
            filter: `user="${user.id}" && status!="cancelled"`,
            expand: 'course',
            sort: '-created',
          });

          setCourses(enrollments.map(e => {
            const course = e.expand?.course;
            return {
              id: e.id,
              slug: course?.slug || 'unknown',
              title: course?.title || 'Unknown Course',
              instructor: course?.instructor_name || 'Unknown',
              progress: e.status === 'completed' ? 100 : 50,
              nextLesson: e.status === 'completed' ? null : 'Continue Learning',
              lessonsLeft: 0,
              lastAccessed: getRelativeTime(e.updated),
              currentModule: null,
            };
          }));
        } else {
          setCourses(DEMO_ENROLLED_COURSES);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCourses(DEMO_ENROLLED_COURSES);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [user, isAuthenticated, authLoading]);

  return { courses, isLoading: isLoading || authLoading };
}

// Hook for events data
export function useEventsData() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<UpcomingEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<{ id: number; title: string; date: string; hasCert: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (authLoading) return;

      setIsLoading(true);

      try {
        if (isAuthenticated && user) {
          const registrations = await pb.collection('event_registrations').getFullList({
            filter: `user="${user.id}"`,
            expand: 'event',
            sort: 'event.date',
          });

          const now = new Date();
          const upcoming: UpcomingEvent[] = [];
          const past: { id: number; title: string; date: string; hasCert: boolean }[] = [];

          registrations.forEach(r => {
            const event = r.expand?.event;
            if (!event) return;

            const eventDate = new Date(event.date);
            if (eventDate >= now && r.status === 'confirmed') {
              upcoming.push({
                id: r.id,
                slug: event.slug,
                title: event.title,
                date: eventDate.getDate().toString(),
                month: eventDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                time: event.time || 'TBA',
                location: event.location || 'TBA',
                type: event.type,
                confirmationCode: r.confirmation_code,
              });
            } else if (eventDate < now && r.status === 'attended') {
              past.push({
                id: event.id,
                title: event.title,
                date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                hasCert: event.type === 'Workshop',
              });
            }
          });

          setRegisteredEvents(upcoming);
          setPastEvents(past);
        } else {
          setRegisteredEvents(DEMO_EVENTS);
          setPastEvents([
            { id: 3, title: 'Agile Fundamentals Workshop', date: 'Nov 20, 2024', hasCert: true },
            { id: 4, title: 'Project Leaders Mixer', date: 'Oct 15, 2024', hasCert: false },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setRegisteredEvents(DEMO_EVENTS);
        setPastEvents([
          { id: 3, title: 'Agile Fundamentals Workshop', date: 'Nov 20, 2024', hasCert: true },
          { id: 4, title: 'Project Leaders Mixer', date: 'Oct 15, 2024', hasCert: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [user, isAuthenticated, authLoading]);

  return { registeredEvents, pastEvents, isLoading: isLoading || authLoading };
}

// Hook for certificates
export function useCertificatesData() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      if (authLoading) return;

      setIsLoading(true);

      try {
        if (isAuthenticated && user) {
          const certs = await pb.collection('certificates').getFullList({
            filter: `user="${user.id}"`,
            expand: 'course',
            sort: '-issued_at',
          });

          setCertificates(certs.map(c => ({
            id: c.id,
            courseName: c.expand?.course?.title || 'Unknown Course',
            courseSlug: c.expand?.course?.slug || 'unknown',
            credentialId: c.credential_id,
            issuedDate: c.issued_at,
            expiryDate: c.expires_at || null,
            skills: c.skills || [],
            score: c.score || null,
          })));
        } else {
          setCertificates(DEMO_CERTIFICATES);
        }
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
        setCertificates(DEMO_CERTIFICATES);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCertificates();
  }, [user, isAuthenticated, authLoading]);

  return { certificates, isLoading: isLoading || authLoading };
}

// Utility function for relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}
