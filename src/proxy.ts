import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const url = request.nextUrl.clone();

  // Local development bypass check
  const isLocal = 
    hostname.includes('localhost') || 
    hostname.includes('127.0.0.1') || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.endsWith('.local');

  // Permanent 301 Redirect for non-www and HTTP requests on production
  if (!isLocal && (proto === 'http' || hostname !== 'www.singulariti.in')) {
    const targetUrl = `https://www.singulariti.in${url.pathname}${url.search}`;
    return NextResponse.redirect(targetUrl, 301);
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

// Ensure proxy runs on all paths except Next.js internals and static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - Static images, webmanifest, and internal worker files directly inside public/
     */
    '/((?!api|_next/static|_next/image|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webmanifest|pdf.worker.min.mjs).*)',
  ],
};
