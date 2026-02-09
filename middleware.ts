import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle 301 redirects for legacy URL formats
 *
 * Redirects:
 * 1. Old structure: /in/holiday/republic-day → /india/republic-day
 * 2. Legacy slugs: /india/republic-day-2026-india → /india/republic-day
 * 3. Country code URLs: /in/republic-day → /india/republic-day
 */

// Map country codes to slugs
const COUNTRY_CODE_TO_SLUG: Record<string, string> = {
  in: 'india',
  au: 'australia',
  us: 'united-states',
  uk: 'united-kingdom',
  gb: 'united-kingdom',
  ca: 'canada',
  nz: 'new-zealand',
  za: 'south-africa',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Redirect country code only URLs to country slug (e.g. /in → /india)
  const countryOnlyMatch = pathname.match(/^\/([a-z]{2})$/);
  if (countryOnlyMatch) {
    const [, countryCode] = countryOnlyMatch;
    const countrySlug = COUNTRY_CODE_TO_SLUG[countryCode];

    if (countrySlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/${countrySlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // 2. Redirect old /[country-code]/holiday/[slug] to new /[country-slug]/[slug]
  const oldHolidayMatch = pathname.match(/^\/([a-z]{2})\/holiday\/(.+)$/);
  if (oldHolidayMatch) {
    const [, countryCode, slug] = oldHolidayMatch;
    const countrySlug = COUNTRY_CODE_TO_SLUG[countryCode] || countryCode;
    const cleanedSlug = cleanSlug(slug);

    const url = request.nextUrl.clone();
    url.pathname = `/${countrySlug}/${cleanedSlug}`;
    return NextResponse.redirect(url, 301);
  }

  // 3. Redirect country code to country slug for new URLs
  const newUrlMatch = pathname.match(/^\/([a-z]{2})\/(.+)$/);
  if (newUrlMatch) {
    const [, countryCode, slug] = newUrlMatch;
    const countrySlug = COUNTRY_CODE_TO_SLUG[countryCode];

    // Only redirect if it's a country code (2 letters) that we recognize
    if (countrySlug && countryCode.length === 2) {
      const cleanedSlug = cleanSlug(slug);
      const url = request.nextUrl.clone();
      url.pathname = `/${countrySlug}/${cleanedSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // 4. Clean legacy slugs in new URL structure
  const currentUrlMatch = pathname.match(/^\/([a-z-]+)\/(.+)$/);
  if (currentUrlMatch) {
    const [, country, slug] = currentUrlMatch;
    const cleanedSlug = cleanSlug(slug);

    // Only redirect if the slug was actually cleaned
    if (cleanedSlug !== slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/${country}/${cleanedSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

/**
 * Clean legacy slug format to new format
 * Removes year and country code patterns
 */
function cleanSlug(slug: string): string {
  // Remove year pattern (4 digits) and anything after it
  // Handles: holiday-name-2026-au, holiday-name-2026-india
  let cleaned = slug.replace(/-\d{4}-.+$/, '');

  // If that didn't match, try removing just trailing country codes
  // Match known country codes/names: au, uk, us, ca, in, india, un, nz, za
  if (cleaned === slug) {
    cleaned = slug.replace(/-(au|uk|us|ca|in|india|un|nz|za)$/, '');
  }

  return cleaned;
}

export const config = {
  matcher: [
    /*
     * Match all holiday pages except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
