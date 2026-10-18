import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware for singulariti.in
 * 
 * Handles:
 * 1. WWW canonical enforcement (non-www → www, single-hop 301)
 * 2. Malformed single-character path rejection (/$, /&, etc.)
 * 3. Explicit 301 redirects for moved/renamed routes
 * 4. 410 Gone for permanently removed routes
 * 5. X-Robots-Tag: noindex on static asset paths
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

export function middleware(request: NextRequest) {
  const { pathname, search, host, protocol } = request.nextUrl;
  const url = request.nextUrl.clone();

  // ──────────────────────────────────────────────
  // 1. Canonical domain enforcement: non-www → www
  //    This handles: singulariti.in → www.singulariti.in
  //    HTTP → HTTPS is handled at the hosting/CDN level (Vercel does this automatically)
  // ──────────────────────────────────────────────
  if (host === 'singulariti.in') {
    url.host = 'www.singulariti.in';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // ──────────────────────────────────────────────
  // 2. Malformed single-character paths → 404
  //    Catches /$, /&, /%, etc.
  // ──────────────────────────────────────────────
  if (MALFORMED_PATH_REGEX.test(pathname)) {
    // Return a lightweight 400 response to avoid wasting crawl budget
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
  //    /random/generators → /random
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/...)
     * - _next/image (image optimization files)
     * - Static files with extensions (.css, .js, .png, .jpg, etc.)
     *   except .woff2 and paths under /_next/static/ which we explicitly handle
     */
    '/((?!api|_next/image|.*\\.(?:css|js|png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)',
    '/_next/static/:path*',
  ],
};
