import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Singulariti Utilities',
    short_name: 'Singulariti',
    description: 'Free browser-based utility tools for PDF, image, text, developer, SEO, and calculator tasks.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F8FC',
    theme_color: '#00C4B4',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
