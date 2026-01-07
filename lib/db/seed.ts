/**
 * Seed script for PocketBase
 *
 * Run with: npx tsx lib/db/seed.ts
 *
 * This creates sample data for development/demo purposes.
 * Make sure PocketBase is running at NEXT_PUBLIC_POCKETBASE_URL
 */

import PocketBase from 'pocketbase';
import { courses } from '../data/courses';
import { events } from '../data/events';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

async function seed() {
  console.log('🌱 Starting seed...\n');

  try {
    // Login as admin (you need to create an admin first in PocketBase UI)
    console.log('Authenticating as admin...');
    await pb.admins.authWithPassword(
      process.env.PB_ADMIN_EMAIL || 'admin@kitaworkshub.com',
      process.env.PB_ADMIN_PASSWORD || 'adminpassword123'
    );
    console.log('✅ Authenticated\n');

    // Seed Courses
    console.log('📚 Seeding courses...');
    for (const course of courses) {
      try {
        await pb.collection('courses').create({
          slug: course.slug,
          title: course.title,
          description: course.description,
          long_description: course.longDescription,
          category: course.category,
          duration_hours: parseInt(course.duration) || 40,
          price: course.price,
          instructor_name: course.instructor,
          instructor_bio: course.instructorBio,
          features: course.features,
          learning_outcomes: course.learningOutcomes,
          prerequisites: course.prerequisites,
          target_audience: course.targetAudience,
          published: true,
          featured: false,
        });
        console.log(`  ✅ ${course.title}`);
      } catch (err) {
        const pbError = err as { status?: number; data?: { slug?: string }; message?: string };
        if (pbError?.status === 400 && pbError?.data?.slug) {
          console.log(`  ⏭️  ${course.title} (already exists)`);
        } else {
          console.error(`  ❌ ${course.title}:`, pbError?.message || err);
        }
      }
    }

    // Seed Events
    console.log('\n📅 Seeding events...');
    for (const event of events) {
      try {
        // Parse date from "15" and "Jan 2025" format
        const [monthName, year] = event.month.split(' ');
        const monthMap: Record<string, number> = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const eventDate = new Date(parseInt(year), monthMap[monthName], parseInt(event.date));

        await pb.collection('events').create({
          slug: event.slug,
          title: event.title,
          description: event.description,
          long_description: event.longDescription,
          type: event.type,
          date: eventDate.toISOString(),
          time: event.time,
          location: event.location,
          address: event.address,
          price: event.priceValue,
          capacity: event.capacity,
          registered_count: event.registered,
          speaker: event.speaker,
          speaker_bio: event.speakerBio,
          highlights: event.highlights,
          agenda: event.agenda,
          requirements: event.requirements,
          featured: event.featured || false,
          published: true,
        });
        console.log(`  ✅ ${event.title}`);
      } catch (err) {
        const pbError = err as { status?: number; data?: { slug?: string }; message?: string };
        if (pbError?.status === 400 && pbError?.data?.slug) {
          console.log(`  ⏭️  ${event.title} (already exists)`);
        } else {
          console.error(`  ❌ ${event.title}:`, pbError?.message || err);
        }
      }
    }

    // Create demo user
    console.log('\n👤 Creating demo user...');
    try {
      const user = await pb.collection('users').create({
        email: 'ahmad@demo.com',
        password: 'demo123456',
        passwordConfirm: 'demo123456',
        name: 'Ahmad bin Abdullah',
        role: 'student',
        phone: '+60 12-345 6789',
        company: 'Petronas Dagangan Berhad',
      });

      // Create user profile
      await pb.collection('user_profiles').create({
        user: user.id,
        bio: 'Passionate about driving organizational change through effective project management.',
        department: 'Digital Transformation',
        position: 'Senior Project Manager',
        skills: ['Project Management', 'Agile', 'Scrum', 'Leadership'],
        member_type: 'premium',
        member_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        notification_email: true,
        notification_courses: true,
        notification_events: true,
      });

      console.log('  ✅ Demo user created (ahmad@demo.com / demo123456)');

      // Enroll demo user in first course
      const firstCourse = await pb.collection('courses').getFirstListItem('slug="agile-certified-practitioner"');
      if (firstCourse) {
        await pb.collection('enrollments').create({
          user: user.id,
          course: firstCourse.id,
          status: 'active',
          enrolled_at: new Date().toISOString(),
        });
        console.log('  ✅ Enrolled in Agile Certified Practitioner');
      }

      // Register for first event
      const firstEvent = await pb.collection('events').getFirstListItem('slug="building-resilient-pmo-systems"');
      if (firstEvent) {
        await pb.collection('event_registrations').create({
          user: user.id,
          event: firstEvent.id,
          name: 'Ahmad bin Abdullah',
          email: 'ahmad@demo.com',
          status: 'confirmed',
          confirmation_code: `KWH-${Date.now()}`,
        });
        console.log('  ✅ Registered for Building Resilient PMO Systems');
      }

    } catch (err) {
      const pbError = err as { status?: number; data?: { email?: string }; message?: string };
      if (pbError?.status === 400 && pbError?.data?.email) {
        console.log('  ⏭️  Demo user already exists');
      } else {
        console.error('  ❌ Demo user:', pbError?.message || err);
      }
    }

    // Create sample resources
    console.log('\n📁 Creating sample resources...');
    const resources = [
      { title: 'PMO Setup Checklist 2025', description: 'Complete checklist for establishing a new PMO', type: 'PDF', category: 'PMO', premium_only: false },
      { title: 'Agile Transformation Roadmap', description: 'Step-by-step guide for enterprise agile adoption', type: 'PDF', category: 'Agile', premium_only: false },
      { title: 'Stakeholder Analysis Template', description: 'Excel template for stakeholder mapping and analysis', type: 'XLSX', category: 'Templates', premium_only: true },
      { title: 'Project Charter Template', description: 'Standard project charter with Malaysian context', type: 'DOC', category: 'Templates', premium_only: false },
    ];

    for (const resource of resources) {
      try {
        await pb.collection('resources').create({
          ...resource,
          downloads: Math.floor(Math.random() * 500) + 50,
        });
        console.log(`  ✅ ${resource.title}`);
      } catch {
        console.log(`  ⏭️  ${resource.title} (skipped)`);
      }
    }

    console.log('\n✨ Seed complete!\n');
    console.log('Demo credentials:');
    console.log('  Email: ahmad@demo.com');
    console.log('  Password: demo123456\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
