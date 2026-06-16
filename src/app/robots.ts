import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/blog/search', '/search', '/tools?q='],
    },
    sitemap: 'https://singulariti.in/sitemap.xml',
  };
}
