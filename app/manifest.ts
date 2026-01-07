import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KitaWorksHub - Where Leaders Grow Deep',
    short_name: 'KitaWorksHub',
    description: 'KitaWorksHub: A premier learning platform designed to cultivate leadership skills and foster deep professional growth.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e3a28',
    theme_color: '#1e3a28',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    categories: ['education', 'business'],
  }
}
