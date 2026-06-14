import { NextResponse } from 'next/server';
import { registry } from '@/registry';
import { toolRegistry } from '@/content/tools/toolRegistry';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://singulariti.in';
  const lastModified = '2026-06-12';

  const toolPaths = new Set<string>();

  // Add hardcoded tools
  toolPaths.add('/tools/editing/online-whiteboard');
  toolPaths.add('/tools/image/editor');

  // Add tools from registry
  registry.categories.forEach(category => {
    category.collections.forEach(collection => {
      collection.tools.forEach(tool => {
        if (tool.path) {
          toolPaths.add(tool.path);
        }
      });
    });
  });

  // Add tools from toolRegistry
  toolRegistry.forEach(tool => {
    if (tool.utilityUrl) {
      toolPaths.add(tool.utilityUrl);
    }
  });

  // Clean and sort
  const cleanPaths = Array.from(toolPaths).map(p => {
    let cp = p.trim();
    if (cp !== '/' && cp.endsWith('/')) {
      cp = cp.slice(0, -1);
    }
    if (!cp.startsWith('/')) {
      cp = '/' + cp;
    }
    return cp;
  });

  const uniquePaths = Array.from(new Set(cleanPaths)).sort();

  const xmlItems = uniquePaths.map(path => {
    const loc = `${baseUrl}${path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
