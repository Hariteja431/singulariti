import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/blog/search', '/search',],
    },
    sitemap: 'https://www.singulariti.in/sitemap.xml',
  };
}
