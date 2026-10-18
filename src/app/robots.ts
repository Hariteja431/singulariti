import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/search',
          '/blog/search',
          '/_next/static/',      // Prevent crawling of static asset chunks (fonts, JS)
        ],
      },
    ],
    sitemap: 'https://www.singulariti.in/sitemap.xml',
  };
}
