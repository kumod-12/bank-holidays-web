/**
 * Utility functions for the frontend
 */

import { SlateContent, Holiday, FAQ, Country } from './types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS class merger
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert Slate content to plain text
 */
export function slateToText(content?: SlateContent[] | string): string {
  if (!content) return '';

  // Handle string input (in case content is already a string)
  if (typeof content === 'string') return content;

  // Handle non-array input
  if (!Array.isArray(content)) return '';

  if (content.length === 0) return '';

  return content
    .map((node) => {
      if ('text' in node && typeof node.text === 'string') {
        return node.text;
      }
      if (node.children) {
        return slateToText(node.children as SlateContent[]);
      }
      return '';
    })
    .join(' ')
    .trim();
}

/**
 * Convert Slate content to HTML
 */
export function slateToHtml(content?: SlateContent[] | string): string {
  if (!content) return '';

  // Handle string input (in case content is already a string)
  if (typeof content === 'string') return content;

  // Handle non-array input
  if (!Array.isArray(content)) return '';

  if (content.length === 0) return '';

  return content
    .map((node) => {
      // Text node
      if ('text' in node && typeof node.text === 'string') {
        let text = node.text;
        if (node.bold) text = `<strong>${text}</strong>`;
        if (node.italic) text = `<em>${text}</em>`;
        return text;
      }

      // Element nodes
      const children = node.children
        ? slateToHtml(node.children as SlateContent[])
        : '';

      switch (node.type) {
        case 'h2':
          return `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">${children}</h2>`;
        case 'h3':
          return `<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-800">${children}</h3>`;
        case 'ul':
          return `<ul class="list-disc list-inside space-y-2 my-4 ml-4">${children}</ul>`;
        case 'li':
          return `<li class="text-gray-700">${children}</li>`;
        default:
          return `<p class="text-gray-700 leading-relaxed mb-4">${children}</p>`;
      }
    })
    .join('');
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get day of week from date string
 */
export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Generate Event schema markup (JSON-LD)
 */
export function generateEventSchema(holiday: Holiday): object {
  const country = typeof holiday.country === 'object' ? holiday.country : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: holiday.name,
    startDate: holiday.date,
    description: holiday.metaDescription || slateToText(holiday.description),
    image: holiday.imageUrl,
    location: country
      ? {
          '@type': 'Country',
          name: country.name,
        }
      : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  };
}

/**
 * Generate FAQPage schema markup (JSON-LD)
 */
export function generateFAQSchema(faqs?: FAQ[], holidayId?: string): object | null {
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: slateToText(faq.answer),
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema markup (JSON-LD)
 */
export function generateBreadcrumbSchema(
  holiday: Holiday,
  baseUrl: string
): object {
  const country = typeof holiday.country === 'object' ? holiday.country : null;

  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ];

  if (country) {
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 2,
      name: country.name,
      item: `${baseUrl}/${country.slug}`,
    });

    breadcrumbs.push({
      '@type': 'ListItem',
      position: 3,
      name: holiday.name,
      item: `${baseUrl}/${country.slug}/${holiday.slug}`,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs,
  };
}

/**
 * Generate WebPage schema markup (JSON-LD)
 */
export function generateWebPageSchema(
  holiday: Holiday,
  baseUrl: string
): object {
  const country = typeof holiday.country === 'object' ? holiday.country : null;
  const url = `${baseUrl}/${country?.slug}/${holiday.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url: url,
    name: holiday.metaTitle || `${holiday.name} in ${country?.name}`,
    description: holiday.metaDescription || slateToText(holiday.description),
    image: holiday.imageUrl,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'Global Bank Holidays',
      description: 'Discover bank holidays, public holidays, and celebrations from around the world.',
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Global Bank Holidays',
        url: baseUrl,
      },
    },
    primaryImageOfPage: holiday.imageUrl
      ? {
          '@type': 'ImageObject',
          '@id': `${url}#primaryimage`,
          url: holiday.imageUrl,
          caption: holiday.imageAlt || holiday.name,
        }
      : undefined,
    datePublished: holiday.createdAt,
    dateModified: holiday.updatedAt,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
    },
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [url],
      },
    ],
  };
}

/**
 * Generate CollectionPage schema markup (JSON-LD) for country listing pages
 */
export function generateCollectionPageSchema(
  countryName: string,
  countrySlug: string,
  baseUrl: string,
  totalHolidays: number
): object {
  const url = `${baseUrl}/${countrySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url: url,
    name: `${countryName} Bank Holidays & Public Holidays`,
    description: `Complete list of bank holidays and public holidays in ${countryName}. Plan your leave with detailed information about dates, traditions, and celebrations.`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'My Holiday Calendar',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: countryName,
          item: url,
        },
      ],
    },
    numberOfItems: totalHolidays,
    about: {
      '@type': 'Country',
      name: countryName,
    },
  };
}

/**
 * Get country name from holiday
 */
export function getCountryName(holiday: Holiday): string {
  if (typeof holiday.country === 'object' && holiday.country.name) {
    return holiday.country.name;
  }
  return 'Unknown';
}

/**
 * Get country code from holiday
 */
export function getCountryCode(holiday: Holiday): string {
  if (typeof holiday.country === 'object' && holiday.country.code) {
    return holiday.country.code;
  }
  return '';
}

/**
 * Get country slug from holiday
 */
export function getCountrySlug(holiday: Holiday): string {
  if (typeof holiday.country === 'object' && holiday.country.slug) {
    return holiday.country.slug;
  }
  return '';
}

/**
 * Export type re-exports for convenience
 */
export type { Holiday, FAQ, ExtensionTip, UpcomingDate, QuickFacts } from './types';
