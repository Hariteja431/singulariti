import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://singulariti.in';

  const sitemaps = [
    '/sitemap-categories.xml',
    '/sitemap-tools.xml',
    '/sitemap-guides.xml',
    '/sitemap-blog.xml'
  ];

  const xmlItems = sitemaps.map(sitemapPath => {
    const loc = `${baseUrl}${sitemapPath}`;
    return `  <sitemap>
    <loc>${loc}</loc>
  </sitemap>`;
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems.join('\n')}
</sitemapindex>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
