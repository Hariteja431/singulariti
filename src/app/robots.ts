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
          // NOTE: /_next/static/ is intentionally NOT disallowed here.
          // Crawlers (including AdSense) must be able to fetch JS chunks
          // to render the page. X-Robots-Tag: noindex in next.config.ts
          // prevents these assets from appearing in search results.
        ],
      },
    ],
    sitemap: 'https://www.singulariti.in/sitemap.xml',
  };
}
