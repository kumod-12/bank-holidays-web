/**
 * Payload CMS API client
 */

import { Holiday, PayloadResponse, Country, Region, Footer, Page } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
  success: boolean;
  data?: { message: string };
  error?: { code: string; message: string };
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

/**
 * Fetch a single holiday by slug with optional filters
 */
export async function getHolidayBySlug(
  slug: string,
  filters?: {
    year?: number;
    region?: string;
    type?: string;
  }
): Promise<Holiday | null> {
  try {
    // Build query parameters - reduce depth for faster response
    let queryParams = `where[slug][equals]=${slug}&depth=1&limit=5`;

    // Add year filter if provided
    if (filters?.year) {
      queryParams += `&where[year][equals]=${filters.year}`;
    }

    // Add type filter if provided
    if (filters?.type) {
      queryParams += `&where[type][equals]=${filters.type}`;
    }

    const res = await fetch(
      `${API_URL}/holidays?${queryParams}`,
      {
        next: { revalidate: 7200 }, // Revalidate every 2 hours
        cache: 'default',
        // Add keepalive for faster connections
        keepalive: true,
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holiday: ${res.status}`);
    }

    const data: PayloadResponse<Holiday> = await res.json();

    if (data.docs.length === 0) {
      return null;
    }

    // If multiple holidays with same slug, prioritize by:
    // 1. Bank holidays first
    // 2. Holidays with more complete data (FAQs, extension tips, etc.)
    // 3. Most recent year
    const sortedHolidays = data.docs.sort((a, b) => {
      // Prioritize bank holidays
      if (a.isBankHoliday && !b.isBankHoliday) return -1;
      if (!a.isBankHoliday && b.isBankHoliday) return 1;

      // Prioritize holidays with FAQs
      const aHasFAQs = a.faqs && a.faqs.length > 0;
      const bHasFAQs = b.faqs && b.faqs.length > 0;
      if (aHasFAQs && !bHasFAQs) return -1;
      if (!aHasFAQs && bHasFAQs) return 1;

      // Prioritize holidays with extension tips
      const aHasTips = a.extensionTips && a.extensionTips.length > 0;
      const bHasTips = b.extensionTips && b.extensionTips.length > 0;
      if (aHasTips && !bHasTips) return -1;
      if (!aHasTips && bHasTips) return 1;

      // Most recent year
      return b.year - a.year;
    });

    return sortedHolidays[0];
  } catch (error) {
    console.error('Error fetching holiday:', error);
    return null;
  }
}

/**
 * Fetch holidays by country and year
 */
export async function getHolidaysByCountryYear(
  countryCode: string,
  year: number
): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `${API_URL}/holidays?where[and][0][country.code][equals]=${countryCode}&where[and][1][year][equals]=${year}&depth=2&limit=100`,
      {
        next: { revalidate: 7200 }, // Revalidate every 2 hours
        cache: 'default',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holidays: ${res.status}`);
    }

    const data: PayloadResponse<Holiday> = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

/**
 * Fetch all countries
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const res = await fetch(`${API_URL}/countries?limit=100`, {
      next: { revalidate: 86400 }, // Revalidate once per day
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.status}`);
    }

    const data: PayloadResponse<Country> = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Get all holiday slugs for static generation
 */
export async function getAllHolidaySlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${API_URL}/holidays?limit=1000&depth=0`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holiday slugs: ${res.status}`);
    }

    const data: PayloadResponse<Holiday> = await res.json();
    return data.docs
      .filter((holiday) => holiday.slug)
      .map((holiday) => holiday.slug);
  } catch (error) {
    console.error('Error fetching holiday slugs:', error);
    return [];
  }
}

/**
 * Fetch all holidays for a specific year across all countries
 */
export async function getAllHolidaysByYear(year: number): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `${API_URL}/holidays?where[year][equals]=${year}&depth=2&limit=500&sort=date`,
      {
        next: { revalidate: 7200 }, // Revalidate every 2 hours
        cache: 'default',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holidays: ${res.status}`);
    }

    const data: PayloadResponse<Holiday> = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
}

/**
 * Fetch holidays within a date range
 */
export async function getHolidaysByDateRange(
  startDate: string, // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `${API_URL}/holidays?where[and][0][date][greater_than_equal]=${startDate}&where[and][1][date][less_than_equal]=${endDate}&depth=2&limit=200&sort=date`,
      {
        next: { revalidate: 7200 }, // Revalidate every 2 hours (holidays don't change often)
        cache: 'default',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch holidays: ${res.status}`);
    }

    const data: PayloadResponse<Holiday> = await res.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching holidays by date range:', error);
    return [];
  }
}

/**
 * Fetch active footer configuration
 */
export async function getFooter(): Promise<Footer | null> {
  try {
    const res = await fetch(
      `${API_URL}/footer?where[isActive][equals]=true&limit=1`,
      {
        next: { revalidate: 86400 }, // Revalidate once per day
        cache: 'default', // Force cache to ensure consistency
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch footer: ${res.status}`);
      return null;
    }

    const data: PayloadResponse<Footer> = await res.json();

    if (!data.docs || data.docs.length === 0) {
      console.warn('No active footer found in database');
      return null;
    }

    return data.docs[0];
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

/**
 * Fetch a single page by slug (for legal pages, about us, etc.)
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetch(
      `${API_URL}/pages?where[slug][equals]=${slug}&where[published][equals]=true&limit=1`,
      {
        next: { revalidate: 86400 }, // Revalidate once per day
        cache: 'default',
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status}`);
    }

    const data: PayloadResponse<Page> = await res.json();

    if (data.docs.length === 0) {
      return null;
    }

    return data.docs[0];
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
