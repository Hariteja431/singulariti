import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Local development bypass check
  const isLocal = 
    hostname.includes('localhost') || 
    hostname.includes('127.0.0.1') || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.endsWith('.local');

  if (!isLocal && hostname !== 'www.singulariti.in') {
    const url = request.nextUrl.clone();
    // Redirect to www.singulariti.in preserving the full path and search queries
    const targetUrl = `https://www.singulariti.in${url.pathname}${url.search}`;
    return NextResponse.redirect(targetUrl, 308);
  }

  // Pass current pathname to layouts and components via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-invoke-path', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Ensure proxy runs on all paths except Next.js internals, static files, and APIs
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, ads.txt (metadata/static files)
     * - public assets like .svg, .png, .jpg, .webmanifest
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ads.txt|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webmanifest).*)',
  ],
};
