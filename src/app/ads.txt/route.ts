import { NextResponse } from 'next/server';

export async function GET() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'pub-7596639289168349';
  
  // Remove 'ca-' if included, ads.txt only uses 'pub-...'
  const cleanPubId = pubId.replace(/^ca-/, '');
  
  const content = `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0\n`;
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
