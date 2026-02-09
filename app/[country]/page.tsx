/**
 * Country Page
 * URL: /{country}
 * Lists all holidays for a specific country
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHolidaysByCountryYear, getCountries } from '@/lib/api';
import { formatDate, getDayOfWeek, generateCollectionPageSchema } from '@/lib/utils';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

// Generate static params for all countries
export async function generateStaticParams() {
  const countries = await getCountries();

  return countries.map((country) => ({
    country: country.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { country } = await params;
  const countries = await getCountries();
  const countryData = countries.find(
    (c) => c.slug === country
  );

  if (!countryData) {
    return {
      title: 'Country Not Found',
    };
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'My Holiday Calendar';
  const title = `${countryData.name} Bank Holidays & Public Holidays`;
  const description = `Complete list of bank holidays and public holidays in ${countryData.name}. Plan your leave with detailed information about dates, traditions, and celebrations.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myholidaycalendar.com';
  const url = `${baseUrl}/${country}`;

  return {
    title,
    description,
    keywords: [
      `${countryData.name} holidays`,
      `${countryData.name} bank holidays`,
      `${countryData.name} public holidays`,
      'holiday calendar',
      'leave planning',
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country } = await params;
  const countries = await getCountries();
  const countryData = countries.find(
    (c) => c.slug === country
  );

  if (!countryData) {
    notFound();
  }

  // Get current year and next year holidays
  const currentYear = new Date().getFullYear();
  const currentYearHolidays = await getHolidaysByCountryYear(
    countryData.code,
    currentYear
  );
  const nextYearHolidays = await getHolidaysByCountryYear(
    countryData.code,
    currentYear + 1
  );

  const allHolidays = [...currentYearHolidays, ...nextYearHolidays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get upcoming holidays (from today onwards)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingHolidays = allHolidays.filter(
    (h) => new Date(h.date) >= today
  );

  // Generate schema markup
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myholidaycalendar.com';
  const collectionSchema = generateCollectionPageSchema(
    countryData.name,
    countryData.slug,
    baseUrl,
    allHolidays.length
  );

  return (
    <>
      {/* Schema Markup (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">
                {countryData.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            {countryData.name} Bank Holidays
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete list of bank holidays and public holidays in{' '}
            {countryData.name} for {currentYear} and {currentYear + 1}.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {allHolidays.length}
            </div>
            <div className="text-gray-600">Total Holidays</div>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {upcomingHolidays.length}
            </div>
            <div className="text-gray-600">Upcoming Holidays</div>
          </div>
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {allHolidays.filter((h) => h.isBankHoliday).length}
            </div>
            <div className="text-gray-600">Bank Holidays</div>
          </div>
        </div>

        {/* Upcoming Holidays Section */}
        {upcomingHolidays.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Upcoming Holidays
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHolidays.slice(0, 6).map((holiday) => (
                <Link
                  key={holiday.id}
                  href={`/${country}/${holiday.slug}`}
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {holiday.name}
                    </h3>
                    {holiday.isBankHoliday && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        Bank Holiday
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📅</span>
                      <span>{formatDate(holiday.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">📆</span>
                      <span>{getDayOfWeek(holiday.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Holidays Table */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            All Holidays ({currentYear} - {currentYear + 1})
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Holiday
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Holiday
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allHolidays.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No holidays found for {countryData.name}.
                      </td>
                    </tr>
                  ) : (
                    allHolidays.map((holiday) => (
                      <tr
                        key={holiday.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/${country}/${holiday.slug}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {holiday.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(holiday.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getDayOfWeek(holiday.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {holiday.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {holiday.isBankHoliday ? (
                            <span className="text-green-600 font-medium">
                              ✓ Yes
                            </span>
                          ) : (
                            <span className="text-gray-400">✗ No</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* No holidays message */}
        {allHolidays.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Holidays Available Yet
            </h3>
            <p className="text-gray-700">
              We're currently building our database of holidays for{' '}
              {countryData.name}. Please check back soon!
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to all countries
            </Link>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
