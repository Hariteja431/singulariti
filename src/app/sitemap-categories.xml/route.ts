import { NextResponse } from 'next/server';
import { registry } from '@/registry';
import { toolRegistry } from '@/content/tools/toolRegistry';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://singulariti.in';
  const lastModified = '2026-06-12';

  const categoriesSet = new Set<string>();
  const collectionsSet = new Set<string>();

  // Extract categories and collections from registry
  registry.categories.forEach((category) => {
    if (category.path) categoriesSet.add(category.path);
    category.collections.forEach((collection) => {
      if (collection.path) collectionsSet.add(collection.path);
    });
  });

  // Extract from toolRegistry to capture any unmapped categories/collections
  toolRegistry.forEach((tool) => {
    const url = tool.utilityUrl;
    if (url) {
      const segments = url.split('/').filter(Boolean);
      if (segments.length >= 2) {
        if (segments[0] === 'tools' && segments.length >= 3) {
          categoriesSet.add(`/tools/${segments[1]}`);
          collectionsSet.add(`/tools/${segments[1]}`);
        } else {
          categoriesSet.add(`/${segments[0]}`);
          collectionsSet.add(`/${segments[0]}/${segments[1]}`);
        }
      }
    }
  });

  const staticRoutes = [
    '/',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/cookie-policy',
    '/disclaimer',
    '/tools',
    '/blog',
    '/typing-speed-test',
    '/pomodoro-timer'
  ];

  const allPaths = new Set<string>();
  staticRoutes.forEach(p => allPaths.add(p));
  categoriesSet.forEach(p => allPaths.add(p));
  collectionsSet.forEach(p => allPaths.add(p));

  // Remove trailing slashes and ensure leading slashes
  const cleanPaths = Array.from(allPaths).map(p => {
    let cp = p.trim();
    if (cp !== '/' && cp.endsWith('/')) {
      cp = cp.slice(0, -1);
    }
    if (!cp.startsWith('/')) {
      cp = '/' + cp;
    }
    return cp;
  });

  // Unique and sorted
  const uniquePaths = Array.from(new Set(cleanPaths)).sort();

  const xmlItems = uniquePaths.map(path => {
    const loc = `${baseUrl}${path === '/' ? '' : path}`;
    let priority = '0.5';
    let changefreq = 'monthly';

    if (path === '/') {
      priority = '1.0';
      changefreq = 'weekly';
    } else if (path === '/tools' || path === '/blog') {
      priority = '0.9';
      changefreq = 'weekly';
    } else if (categoriesSet.has(path)) {
      priority = '0.9';
      changefreq = 'weekly';
    } else if (collectionsSet.has(path)) {
      priority = '0.8';
      changefreq = 'weekly';
    } else if (path === '/about' || path === '/contact' || path === '/typing-speed-test' || path === '/pomodoro-timer') {
      priority = '0.8';
      changefreq = 'weekly';
    }

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems.join('\n')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
