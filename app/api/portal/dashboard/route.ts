import { NextResponse } from 'next/server';
import pb from '@/lib/pocketbase';

// GET - Fetch dashboard data
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    // Return demo data if no auth
    // Consistent with courses page:
    // - 2 in-progress (Agile 75%, PMO 40%)
    // - 1 completed (Executive Leadership = 1 certificate)
    if (!authHeader) {
      return NextResponse.json({
        user: {
          name: 'Ahmad',
          avatar: null,
        },
        stats: {
          activeCourses: 2,
          upcomingEvents: 2,
          certificates: 1,
          learningHours: 42,
        },
        enrolledCourses: [
          {
            id: 1,
            title: 'Agile Certified Practitioner',
            progress: 75,
            nextLesson: 'Sprint Planning Deep Dive',
            instructor: 'Sarah Lim',
            totalModules: 12,
            completedModules: 9,
          },
          {
            id: 2,
            title: 'PMO Fundamentals & Setup',
            progress: 40,
            nextLesson: 'Governance Frameworks',
            instructor: 'David Chen',
            totalModules: 10,
            completedModules: 4,
          },
          {
            id: 3,
            title: 'Executive Leadership Presence',
            progress: 100,
            nextLesson: 'Completed',
            instructor: 'Amina Karim',
            totalModules: 8,
            completedModules: 8,
          },
        ],
        upcomingEvents: [
          {
            id: 1,
            title: 'Building Resilient PMO Systems',
            date: 'Jan 15',
            time: '9:00 AM',
            location: 'KL Convention Centre',
            type: 'Workshop',
          },
          {
            id: 2,
            title: 'Leadership in the Age of AI',
            date: 'Jan 22',
            time: '2:00 PM',
            location: 'Online (Zoom)',
            type: 'Seminar',
          },
        ],
        recentActivity: [
          { id: 1, action: 'Completed lesson', detail: 'Scrum Events Overview', time: '2 hours ago', type: 'lesson' },
          { id: 2, action: 'Earned certificate', detail: 'Executive Leadership Presence', time: 'Yesterday', type: 'certificate' },
          { id: 3, action: 'Registered for event', detail: 'Building Resilient PMO Systems', time: '2 days ago', type: 'event' },
          { id: 4, action: 'Downloaded resource', detail: 'PMO Setup Checklist 2025', time: '3 days ago', type: 'resource' },
        ],
      });
    }

    const token = authHeader.replace('Bearer ', '');
    pb.authStore.save(token, null);

    if (!pb.authStore.isValid || !pb.authStore.model) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = pb.authStore.model.id;
    const user = pb.authStore.model;

    // Fetch enrollments
    const enrollments = await pb.collection('enrollments').getFullList({
      filter: `user="${userId}"`,
      expand: 'course,course.instructor',
    });

    // Fetch upcoming events
    const now = new Date().toISOString();
    const registrations = await pb.collection('event_registrations').getFullList({
      filter: `user="${userId}" && status="confirmed"`,
      expand: 'event',
    });

    const upcomingEvents = registrations
      .filter((reg) => reg.expand?.event?.date > now)
      .slice(0, 2);

    // Fetch certificates
    const certificates = await pb.collection('certificates').getFullList({
      filter: `user="${userId}"`,
    });

    // Calculate learning hours
    const learningHours = enrollments.reduce((acc, enr) => {
      const course = enr.expand?.course;
      return acc + (course?.duration || 0) / 60;
    }, 0);

    return NextResponse.json({
      user: {
        name: user.name?.split(' ')[0] || 'User',
        avatar: user.avatar || null,
      },
      stats: {
        activeCourses: enrollments.filter((e) => e.status === 'active').length,
        upcomingEvents: upcomingEvents.length,
        certificates: certificates.length,
        learningHours: Math.round(learningHours),
      },
      enrolledCourses: enrollments.map((enr) => ({
        id: enr.id,
        title: enr.expand?.course?.title || 'Unknown Course',
        progress: enr.status === 'completed' ? 100 : 0, // Would calculate from lesson_progress
        nextLesson: enr.status === 'completed' ? 'Completed' : 'Continue',
        instructor: enr.expand?.course?.expand?.instructor?.name || 'Unknown',
        totalModules: 10,
        completedModules: enr.status === 'completed' ? 10 : 0,
      })),
      upcomingEvents: upcomingEvents.map((reg) => ({
        id: reg.id,
        title: reg.expand?.event?.title || 'Unknown Event',
        date: new Date(reg.expand?.event?.date || '').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        time: reg.expand?.event?.time || '',
        location: reg.expand?.event?.location || 'TBD',
        type: reg.expand?.event?.type || 'Event',
      })),
      recentActivity: [], // Would fetch from activity_logs collection
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard' }, { status: 500 });
  }
}
