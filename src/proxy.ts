import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy for singulariti.in
 *
 * Handles:
 * 1. WWW canonical enforcement (non-www → www, single-hop 301)
 * 2. Malformed single-character path rejection (/$, /&, etc.)
 * 3. Explicit 301 redirects for moved/renamed routes
 * 4. 410 Gone for permanently removed routes
 * 5. X-Robots-Tag: noindex on static asset paths
 * 6. Passes x-invoke-path header to layouts and components
 */

// Permanently removed routes → 410 Gone
const GONE_PATHS = new Set([
  '/media/video',
  '/media/audio',
]);

// Explicit 301 redirects: old path → new path
const REDIRECT_MAP: Record<string, string> = {
  // Article slug that was moved or renamed — redirect to canonical location
  '/blog/articles/singulariti-for-office-workers': '/blog/articles/singulariti-for-office-workers',
  // If /random/generators was a collection landing page that no longer resolves,
  // redirect to the parent /random category page
  '/random/generators': '/random',
};

/**
 * Regex to detect malformed single-character-only path segments
 * that are not valid route identifiers (e.g., /&, /$, /%, /#)
 */
const MALFORMED_PATH_REGEX = /^\/[^a-zA-Z0-9/]$/;

export function proxy(request: NextRequest) {
  const rawHost = request.headers.get('host') || '';
  const hostname = rawHost.split(':')[0];
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // ──────────────────────────────────────────────
  // 1. Canonical domain enforcement: non-www → www
  //    Also handles HTTP → HTTPS in one hop on production.
  //    Local development is bypassed.
  // ──────────────────────────────────────────────
  const isLocal =
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local');

  if (!isLocal && (proto === 'http' || hostname !== 'www.singulariti.in')) {
    const targetUrl = `https://www.singulariti.in${url.pathname}${url.search}`;
    return NextResponse.redirect(targetUrl, 301);
  }

  // ──────────────────────────────────────────────
  // 2. Malformed single-character paths → 400
  //    Catches /$, /&, /%, etc.
  // ──────────────────────────────────────────────
  if (MALFORMED_PATH_REGEX.test(pathname)) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ──────────────────────────────────────────────
  // 3. 410 Gone for permanently removed routes
  // ──────────────────────────────────────────────
  if (GONE_PATHS.has(pathname)) {
    return new NextResponse(
      '<!DOCTYPE html><html><head><title>410 Gone</title></head><body><h1>410 Gone</h1><p>This resource has been permanently removed.</p></body></html>',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex',
        },
      }
    );
  }

  // ──────────────────────────────────────────────
  // 4. Explicit 301 redirects for moved routes
  // ──────────────────────────────────────────────
  const redirectTarget = REDIRECT_MAP[pathname];
  if (redirectTarget && redirectTarget !== pathname) {
    url.pathname = redirectTarget;
    return NextResponse.redirect(url, 301);
  }

  // ──────────────────────────────────────────────
  // 5. X-Robots-Tag: noindex on /_next/static/ assets
  //    Prevents font files and JS chunks from competing for indexation
  // ──────────────────────────────────────────────
  if (pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // ──────────────────────────────────────────────
  // 6. Pass current pathname to layouts and components via headers
  // ──────────────────────────────────────────────
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-invoke-path', pathname);

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
     * - _next/image (image optimization files)
     * - Static images, webmanifest, and internal worker files directly inside public/
     * Note: /_next/static/ is explicitly included so we can set X-Robots-Tag headers.
     */
    '/((?!api|_next/image|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webmanifest|pdf.worker.min.mjs).*)',
    '/_next/static/:path*',
  ],
};
