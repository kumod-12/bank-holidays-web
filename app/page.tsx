/**
 * Homepage - Holiday Calendar for All Countries
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getCountries, getHolidaysByDateRange } from '@/lib/api';
import { formatDate, getDayOfWeek, getCountryName } from '@/lib/utils';

// Enable ISR with revalidation
export const revalidate = 3600; // Revalidate every hour

// Reduce runtime chunk for faster initial load
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'My Holiday Calendar - Bank Holidays & Public Holidays 2026',
  description: 'Complete guide to bank holidays and public holidays for India, USA, UK, Canada, and Australia. Plan long weekends, view upcoming dates, and maximize your time off with our comprehensive holiday calendar.',
  keywords: [
    'bank holidays',
    'public holidays',
    'holiday calendar 2026',
    'India holidays',
    'USA holidays',
    'UK bank holidays',
    'Canada holidays',
    'Australia holidays',
    'long weekend planning',
    'leave planning',
    'holiday dates',
    'upcoming holidays',
  ],
  alternates: {
    canonical: 'https://myholidaycalendar.com',
  },
  openGraph: {
    title: 'My Holiday Calendar - Bank Holidays & Public Holidays 2026',
    description: 'Complete guide to bank holidays and public holidays worldwide. Plan long weekends and maximize your time off.',
    url: 'https://myholidaycalendar.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Holiday Calendar - Bank Holidays & Public Holidays 2026',
    description: 'Complete guide to bank holidays and public holidays worldwide. Plan long weekends and maximize your time off.',
  },
};

export default async function Home() {
  const countries = await getCountries();
  const currentYear = 2026; // Static year for consistency

  // Use a stable date range for static generation (first 6 months of year)
  // This prevents hydration mismatches from Date.now()
  const upcomingMonthsCount = 6;
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-06-30`;

  // Fetch holidays for first half of year (optimized query with date range)
  const upcomingHolidays = await getHolidaysByDateRange(
    startDate,
    endDate
  );

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a bank holiday?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A bank holiday is a public holiday when banks and many businesses are closed. These are typically designated by the government and may vary by country and region. On bank holidays, most employees get a paid day off work.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which countries are covered in this holiday calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We currently cover bank holidays and public holidays for India, United States, United Kingdom, Canada, and Australia. Each country page includes national holidays as well as regional observances specific to states, territories, and provinces.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I plan long weekends using this calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Visit our Long Weekend page to discover opportunities where holidays fall on Mondays or Fridays, creating natural 3-day weekends. We also show you strategic days to take leave for extended 4-day or 5-day weekends when holidays fall mid-week.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are the holiday dates updated for future years?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Each holiday page shows upcoming dates for the next 5 years. We regularly update our database to reflect official announcements from government sources, ensuring you have accurate information for long-term planning.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do regional holidays differ within countries?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Many countries have region-specific holidays in addition to national bank holidays. For example, individual states in India, Australia, and the US may observe different holidays. Our calendar includes both national and regional holiday information where applicable.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I filter holidays by year or country?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! You can browse holidays by selecting a specific country from our country list, which shows all holidays for that nation. The main calendar displays all countries together, and our long weekend page offers filtering by year, country, and month.',
        },
      },
    ],
  };

  // Group upcoming holidays by month
  const holidaysByMonth: Record<number, typeof upcomingHolidays> = {};
  upcomingHolidays.forEach((holiday) => {
    const month = new Date(holiday.date).getMonth();
    if (!holidaysByMonth[month]) {
      holidaysByMonth[month] = [];
    }
    holidaysByMonth[month].push(holiday);
  });

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      {/* FAQ Schema Markup (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            My Holiday Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover bank holidays, public holidays, and celebrations from around the world.
            Plan your leave and make the most of your time off.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Browse by Country
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
              <Link
                key={country.id}
                href={`/${country.slug}`}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="text-4xl mb-2">{getCountryFlag(country.code)}</div>
                <h3 className="font-semibold text-gray-900">{country.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{country.code}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Holiday Calendar */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Holidays {currentYear}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Showing January - June {currentYear} • <Link href="/long-weekend" className="text-blue-600 hover:underline">View all holidays →</Link>
          </p>
          <div className="space-y-8">
            {Object.keys(holidaysByMonth)
              .map(Number)
              .sort((a, b) => a - b)
              .map((monthIndex) => {
                const holidays = holidaysByMonth[monthIndex];
                return (
                  <div key={monthIndex} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {monthNames[monthIndex]} {currentYear}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {holidays.map((holiday) => {
                        const countryName = getCountryName(holiday);
                        const countrySlug = typeof holiday.country === 'object' ? holiday.country.slug : '';
                        const countryCode = typeof holiday.country === 'object' ? holiday.country.code : '';

                        return (
                          <Link
                            key={holiday.id}
                            href={`/${countrySlug}/${holiday.slug}`}
                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                  {holiday.name}
                                </h4>
                                <div className="flex items-center text-xs text-gray-600 mb-1">
                                  <span className="mr-2">{getCountryFlag(countryCode)}</span>
                                  <span>{countryName}</span>
                                </div>
                              </div>
                              {holiday.isBankHoliday && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded ml-2">
                                  Bank
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Complete Global Holiday Calendar
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Welcome to My Holiday Calendar, your comprehensive resource for bank holidays, public holidays, and observances from around the world. Whether you're planning your annual leave, organizing international business meetings, or simply staying informed about upcoming celebrations, we provide accurate and up-to-date holiday information for multiple countries.
              </p>
              <p className="mb-4">
                Our holiday calendar covers major countries including India, United States, United Kingdom, Canada, and Australia, with detailed information about each holiday including dates, traditions, historical significance, and bank holiday status. We help you maximize your time off by identifying long weekend opportunities and providing smart leave planning strategies.
              </p>
              <p className="mb-4">
                Each holiday entry includes comprehensive details such as upcoming dates for the next 5 years, regional variations, bank holiday classifications, and cultural significance. Whether you're looking for India's Republic Day, Australia's Melbourne Cup, or the United Kingdom's bank holidays, you'll find everything you need to plan ahead.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose My Holiday Calendar?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Always Up-to-Date</h3>
                <p className="text-gray-700">
                  Our holiday dates are regularly updated and verified from official government sources to ensure accuracy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🌍 Global Coverage</h3>
                <p className="text-gray-700">
                  Access holiday information for multiple countries in one convenient location.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">💼 Smart Planning</h3>
                <p className="text-gray-700">
                  Discover long weekend opportunities and get tips to maximize your time off with strategic leave planning.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📖 Rich Details</h3>
                <p className="text-gray-700">
                  Learn about the history, traditions, and cultural significance of each holiday.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  What is a bank holiday?
                </h3>
                <p className="text-gray-700">
                  A bank holiday is a public holiday when banks and many businesses are closed. These are typically designated by the government and may vary by country and region. On bank holidays, most employees get a paid day off work.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Which countries are covered in this holiday calendar?
                </h3>
                <p className="text-gray-700">
                  We currently cover bank holidays and public holidays for India, United States, United Kingdom, Canada, and Australia. Each country page includes national holidays as well as regional observances specific to states, territories, and provinces.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  How can I plan long weekends using this calendar?
                </h3>
                <p className="text-gray-700">
                  Visit our <Link href="/long-weekend" className="text-blue-600 hover:underline">Long Weekend page</Link> to discover opportunities where holidays fall on Mondays or Fridays, creating natural 3-day weekends. We also show you strategic days to take leave for extended 4-day or 5-day weekends when holidays fall mid-week.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Are the holiday dates updated for future years?
                </h3>
                <p className="text-gray-700">
                  Yes! Each holiday page shows upcoming dates for the next 5 years. We regularly update our database to reflect official announcements from government sources, ensuring you have accurate information for long-term planning.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Do regional holidays differ within countries?
                </h3>
                <p className="text-gray-700">
                  Absolutely. Many countries have region-specific holidays in addition to national bank holidays. For example, individual states in India, Australia, and the US may observe different holidays. Our calendar includes both national and regional holiday information where applicable.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Can I filter holidays by year or country?
                </h3>
                <p className="text-gray-700">
                  Yes! You can browse holidays by selecting a specific country from our country list above, which shows all holidays for that nation. The main calendar displays all countries together, and our long weekend page offers filtering by year, country, and month.
                </p>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </>
  );
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    IN: '🇮🇳',
    US: '🇺🇸',
    GB: '🇬🇧',
    CA: '🇨🇦',
    AU: '🇦🇺',
  };
  return flags[code] || '🌍';
}
