import { NextResponse } from 'next/server';

export async function GET() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || '';
  
  if (!pubId) {
    return new NextResponse('', { status: 404 });
  }

  // Remove 'ca-' if the user accidentally included it in the ENV var, ads.txt only uses 'pub-...'
  const cleanPubId = pubId.replace(/^ca-/, '');
  
  const content = `google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0`;
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
