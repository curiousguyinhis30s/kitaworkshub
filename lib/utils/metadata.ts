import type { Metadata } from 'next';

const SITE_NAME = 'KitaWorksHub';
const BASE_URL = 'https://kitaworkshub.com.my';

interface PageMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Creates page metadata with sensible defaults.
 *
 * Usage in any page.tsx:
 * ```ts
 * import { createMetadata } from '@/lib/utils/metadata';
 * export const metadata = createMetadata({ title: 'Courses', description: 'Browse our courses' });
 * ```
 */
export function createMetadata({
  title,
  description = 'Practical project management training and consulting for Malaysian businesses.',
  path = '',
  image = '/og-image.png',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const fullTitle = title;
  const url = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: `${fullTitle} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      locale: 'en_MY',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullTitle} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Creates metadata for a course page.
 */
export function createCourseMetadata(course: {
  title: string;
  description: string;
  slug: string;
  instructor?: string;
  image?: string;
}): Metadata {
  const desc = course.instructor
    ? `${course.description} Learn from ${course.instructor}.`
    : course.description;

  return createMetadata({
    title: course.title,
    description: desc,
    path: `/courses/${course.slug}`,
    image: course.image,
  });
}

/**
 * Creates metadata for an event page.
 */
export function createEventMetadata(event: {
  title: string;
  description: string;
  slug: string;
  date?: string;
  location?: string;
  image?: string;
}): Metadata {
  let desc = event.description;
  if (event.date) desc += ` Date: ${event.date}.`;
  if (event.location) desc += ` Location: ${event.location}.`;

  return createMetadata({
    title: event.title,
    description: desc,
    path: `/events/${event.slug}`,
    image: event.image,
  });
}

/**
 * Creates metadata for blog/article pages.
 */
export function createArticleMetadata(article: {
  title: string;
  excerpt: string;
  slug: string;
  author?: string;
  publishedAt?: string;
  image?: string;
}): Metadata {
  const base = createMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${article.slug}`,
    image: article.image,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      authors: article.author ? [article.author] : undefined,
      publishedTime: article.publishedAt,
    },
  };
}
