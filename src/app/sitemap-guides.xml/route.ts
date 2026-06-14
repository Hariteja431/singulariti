import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://www.singulariti.in';
  const lastModified = '2026-06-12';

  const posts = getAllPosts();
  const guides = posts.filter(p => p.toolUrl);

  const xmlItems = guides.map(post => {
    const loc = `${baseUrl}/blog/${post.slug}`;
    const modDate = post.updatedAt || post.publishedAt || lastModified;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${modDate}</lastmod>
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
