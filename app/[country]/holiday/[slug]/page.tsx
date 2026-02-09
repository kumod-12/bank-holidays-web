/**
 * Individual Holiday Page
 * URL: /{country}/holiday/{holiday-slug}
 * SEO Guidelines: All sections implemented
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getHolidayBySlug, getAllHolidaySlugs } from '@/lib/api';
import {
  slateToHtml,
  getCountryName,
  getCountryCode,
  generateEventSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
} from '@/lib/utils';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { QuickFactsCard } from '@/components/QuickFactsCard';
import { DatesTable } from '@/components/DatesTable';
import { ExtensionTips } from '@/components/ExtensionTips';
import { FAQSection } from '@/components/FAQSection';
import { SourceFooter } from '@/components/SourceFooter';
import { ImageCredit } from '@/components/ImageCredit';

interface HolidayPageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

/**
 * Clean legacy slug format to new format
 * Removes year and country code patterns for backward compatibility
 * Examples:
 *   australia-day-2026-au → australia-day
 *   republic-day-2026-india → republic-day
 *   melbourne-cup-2028-au → melbourne-cup
 */
function cleanSlug(slug: string): string {
  // Remove year pattern (4 digits) and anything after it
  // This handles: holiday-name-2026-au, holiday-name-2026-india
  let cleaned = slug.replace(/-\d{4}-.+$/, '');

  // If that didn't match, try removing just trailing country codes
  // Match known country codes/names: au, uk, us, ca, in, india, un, etc.
  // Use word boundary to ensure we only match complete country codes at the end
  if (cleaned === slug) {
    cleaned = slug.replace(/-(au|uk|us|ca|in|india|un|nz|za)$/, '');
  }

  return cleaned;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: HolidayPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Clean legacy slug format for backward compatibility
  const cleanedSlug = cleanSlug(slug);
  const holiday = await getHolidayBySlug(cleanedSlug);

  if (!holiday) {
    return {
      title: 'Holiday Not Found',
    };
  }

  const countryName = getCountryName(holiday);
  const title = holiday.metaTitle || `${holiday.name} in ${countryName}`;
  const description =
    holiday.metaDescription ||
    `Information about ${holiday.name} in ${countryName}. Date, bank holiday status, and more.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/${getCountryCode(holiday).toLowerCase()}/holiday/${holiday.slug}`;

  return {
    title,
    description,
    keywords: holiday.keywords,
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: holiday.imageUrl ? [{ url: holiday.imageUrl, alt: holiday.imageAlt || holiday.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: holiday.imageUrl ? [holiday.imageUrl] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function HolidayPage({ params }: HolidayPageProps) {
  const { slug } = await params;

  // Clean legacy slug format for backward compatibility
  const cleanedSlug = cleanSlug(slug);
  const holiday = await getHolidayBySlug(cleanedSlug);

  if (!holiday) {
    notFound();
  }

  const countryName = getCountryName(holiday);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Generate schema markup
  const eventSchema = generateEventSchema(holiday);
  const faqSchema = generateFAQSchema(holiday.faqs, holiday.id);
  const breadcrumbSchema = generateBreadcrumbSchema(holiday, baseUrl);
  const webPageSchema = generateWebPageSchema(holiday, baseUrl);

  return (
    <>
      {/* Schema Markup (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-white">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs holiday={holiday} />

          {/* H1 + Hero Section */}
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {holiday.name} in {countryName}
            </h1>
            {holiday.imageUrl && (
              <div className="mb-6">
                <img
                  src={holiday.imageUrl}
                  alt={holiday.imageAlt || holiday.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                {holiday.imageCredit?.photographerName && holiday.imageCredit?.photographerUrl && holiday.imageCredit?.unsplashUrl && (
                  <ImageCredit
                    photographerName={holiday.imageCredit.photographerName}
                    photographerUrl={holiday.imageCredit.photographerUrl}
                    unsplashUrl={holiday.imageCredit.unsplashUrl}
                  />
                )}
              </div>
            )}
          </header>

          {/* Quick Facts Card (Above the Fold) */}
          <QuickFactsCard holiday={holiday} />

          {/* Short Description */}
          {holiday.description && (
            <section className="mb-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.description),
                }}
              />
            </section>
          )}

          {/* What is {Holiday Name}? */}
          {holiday.longDescription && (
            <section className="mb-8">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.longDescription),
                }}
              />
            </section>
          )}

          {/* Is it a Bank Holiday? */}
          {holiday.isBankHoliday && holiday.bankHolidayDetails && (
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Is {holiday.name} a Bank Holiday?
              </h2>
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.bankHolidayDetails),
                }}
              />
            </section>
          )}

          {/* Dates Table */}
          <DatesTable
            holidayName={holiday.name}
            upcomingDates={holiday.upcomingDates}
          />

          {/* Region Applicability */}
          {holiday.applicableRegions && (
            <section className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Where is {holiday.name} Observed?
              </h2>
              <p className="text-gray-700 text-lg">{holiday.applicableRegions}</p>
            </section>
          )}

          {/* Holiday Extension Tips */}
          <ExtensionTips
            holidayName={holiday.name}
            tips={holiday.extensionTips}
          />

          {/* History */}
          {holiday.history && (
            <section className="mt-12">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.history),
                }}
              />
            </section>
          )}

          {/* Traditions */}
          {holiday.traditions && (
            <section className="mt-12">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.traditions),
                }}
              />
            </section>
          )}

          {/* Celebrations */}
          {holiday.celebrations && (
            <section className="mt-12">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: slateToHtml(holiday.celebrations),
                }}
              />
            </section>
          )}

          {/* FAQs */}
          <FAQSection faqs={holiday.faqs} />

          {/* Source & Disclaimer */}
          <SourceFooter holiday={holiday} />
        </main>
      </div>
    </>
  );
}
