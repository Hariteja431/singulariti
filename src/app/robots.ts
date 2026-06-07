import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/blog/search', '/*?*'],
    },
    sitemap: 'https://singulariti.in/sitemap.xml',
  };
}
