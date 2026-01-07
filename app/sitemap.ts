import { MetadataRoute } from 'next';
import pb from '@/lib/pocketbase';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://kitaworkshub.com.my';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Fetch Dynamic Routes
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // Fetch Courses
  try {
    const courses = await pb.collection('courses').getFullList({
      fields: 'slug,updated',
    });

    const courseRoutes = courses.map((course) => ({
      url: `${BASE_URL}/courses/${course.slug}`,
      lastModified: new Date(course.updated),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    dynamicRoutes.push(...courseRoutes);
  } catch (error) {
    console.error('Failed to fetch courses for sitemap:', error);
  }

  // Fetch Events
  try {
    const events = await pb.collection('events').getFullList({
      fields: 'slug,updated',
    });

    const eventRoutes = events.map((event) => ({
      url: `${BASE_URL}/events/${event.slug}`,
      lastModified: new Date(event.updated),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    dynamicRoutes.push(...eventRoutes);
  } catch (error) {
    console.error('Failed to fetch events for sitemap:', error);
  }

  // 3. Combine and Return
  return [...staticRoutes, ...dynamicRoutes];
}
