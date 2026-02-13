/**
 * Next.js Middleware for FaxBella
 *
 * Applies security headers to all responses and protects
 * dashboard routes by checking for a valid session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_PREFIXES = ['/api/protected'];

// Routes that should never be cached
const NO_CACHE_PREFIXES = ['/api/', '/dashboard'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ─── Dashboard Route Protection ────────────────────────

    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
    );

    if (isProtected) {
        const sessionToken =
            request.cookies.get('faxbella_session')?.value || null;

        if (!sessionToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect authenticated users away from auth pages
    const AUTH_ROUTES = ['/login', '/signup'];
    if (AUTH_ROUTES.includes(pathname)) {
        const sessionToken =
            request.cookies.get('faxbella_session')?.value || null;
        if (sessionToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // ─── Build Response with Security Headers ──────────────

    const response = NextResponse.next();

    // Content Security Policy - allow Convex, self, inline styles for email previews
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.emailit.com https://api.stripe.com https://api.whop.com https://*.r2.cloudflarestorage.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    // HTTP Strict Transport Security - enforce HTTPS for 2 years
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
    );

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer policy - send origin only to same-origin, nothing to cross-origin
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions policy - disable unnecessary browser features
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    // Prevent XSS attacks in older browsers
    response.headers.set('X-XSS-Protection', '1; mode=block');

    // No cache for dynamic routes
    const shouldNotCache = NO_CACHE_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
    );
    if (shouldNotCache) {
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
    }

    return response;
}

export const config = {
    // Run middleware on all routes except static assets and internal Next.js routes
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)',
    ],
};
