/**
 * Utility to generate metadata for static pages
 */

import { Metadata } from 'next';
import { getPageBySlug } from './api';

export async function generatePageMetadata(slug: string): Promise<Metadata> {
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  const title = page.metaTitle || page.title;
  const description = page.metaDescription || `Learn more about ${page.title}`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myholidaycalendar.com';
  const canonicalUrl = `${baseUrl}/${page.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
