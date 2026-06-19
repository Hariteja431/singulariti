import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/search', '/blog/search'],
    },
    sitemap: 'https://www.singulariti.in/sitemap.xml',
  };
}
