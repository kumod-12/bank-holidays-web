export const dynamic = 'force-dynamic';

/**
 * Long Weekend Page
 * URL: /long-weekend/
 * Shows calendar highlighting long weekends and text format
 * Filter URLs: /long-weekend/?year=2026&country=india&month=1
 */

import { Metadata } from 'next';
import { getAllHolidaysByYear, getCountries } from '@/lib/api';
import { formatDate, getDayOfWeek, getCountryName } from '@/lib/utils';
import Link from 'next/link';

interface LongWeekendPageProps {
  searchParams: Promise<{
    year?: string;
    country?: string;
    month?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: LongWeekendPageProps): Promise<Metadata> {
  const filters = await searchParams;
  const hasFilters = filters.year || filters.country || filters.month;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myholidaycalendar.com';
  const canonicalUrl = `${baseUrl}/long-weekend`;

  return {
    title: 'Long Weekends 2026 - All Countries | My Holiday Calendar',
    description: 'Plan your perfect long weekends in 2026 across all countries. Discover opportunities to extend your holidays and maximize your time off.',
    keywords: ['long weekends', 'holiday planning', 'leave planning', '2026 holidays', 'global holidays'],
    robots: hasFilters
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

interface LongWeekend {
  holiday: any;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  leaveRequired: number;
  description: string;
  countryName: string;
  countryCode: string;
}

export default async function LongWeekendPage({ searchParams }: LongWeekendPageProps) {
  const filters = await searchParams;
  const countries = await getCountries();

  const currentYear = filters.year ? parseInt(filters.year) : 2026;
  const selectedCountry = filters.country?.toLowerCase();
  const selectedMonth = filters.month ? parseInt(filters.month) : undefined;

  const allHolidays = await getAllHolidaysByYear(currentYear);

  // Filter holidays by country if specified
  let filteredHolidays = allHolidays;
  if (selectedCountry) {
    filteredHolidays = allHolidays.filter((h) => {
      const countrySlug = typeof h.country === 'object' ? h.country.slug : '';
      return countrySlug.toLowerCase() === selectedCountry;
    });
  }

  // Calculate long weekends from filtered holidays
  const longWeekends: LongWeekend[] = [];

  filteredHolidays.forEach((holiday) => {
    const holidayDate = new Date(holiday.date);
    const dayOfWeek = holidayDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const countryName = getCountryName(holiday);
    const countryCode = typeof holiday.country === 'object' ? holiday.country.code : '';

    // Case 1: Holiday on Monday (3-day weekend)
    if (dayOfWeek === 1) {
      longWeekends.push({
        holiday,
        startDate: new Date(holidayDate.getTime() - 2 * 24 * 60 * 60 * 1000), // Saturday
        endDate: holidayDate,
        totalDays: 3,
        leaveRequired: 0,
        description: `Three days of long weekend without taking any leave on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 2: Holiday on Friday (3-day weekend)
    if (dayOfWeek === 5) {
      longWeekends.push({
        holiday,
        startDate: holidayDate,
        endDate: new Date(holidayDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Sunday
        totalDays: 3,
        leaveRequired: 0,
        description: `Three days of long weekend without taking any leave on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 3: Holiday on Thursday (4-day weekend with 1 day leave)
    if (dayOfWeek === 4) {
      longWeekends.push({
        holiday,
        startDate: holidayDate,
        endDate: new Date(holidayDate.getTime() + 3 * 24 * 60 * 60 * 1000), // Sunday
        totalDays: 4,
        leaveRequired: 1,
        description: `Four days of long weekend, when you take one day leave starts from ${getDayOfWeek(holiday.date)}, ${formatDateShort(holiday.date)} on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 4: Holiday on Tuesday (4-day weekend with 1 day leave)
    if (dayOfWeek === 2) {
      longWeekends.push({
        holiday,
        startDate: new Date(holidayDate.getTime() - 2 * 24 * 60 * 60 * 1000), // Sunday
        endDate: holidayDate,
        totalDays: 4,
        leaveRequired: 1,
        description: `Four days of long weekend, when you take one day leave starts from ${getDayOfWeek(new Date(holidayDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString())}, ${formatDateShort(new Date(holidayDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString())} on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 5: Holiday on Wednesday (5-day weekend with 2 days leave)
    if (dayOfWeek === 3) {
      longWeekends.push({
        holiday,
        startDate: new Date(holidayDate.getTime() - 3 * 24 * 60 * 60 * 1000), // Sunday
        endDate: new Date(holidayDate.getTime() + 3 * 24 * 60 * 60 * 1000), // Saturday
        totalDays: 5,
        leaveRequired: 2,
        description: `Five days of long weekend, when you take two days leave from ${getDayOfWeek(new Date(holidayDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString())} to ${getDayOfWeek(new Date(holidayDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString())} on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 6: Holiday on Sunday (3-day weekend with 1 day leave on Monday)
    if (dayOfWeek === 0) {
      longWeekends.push({
        holiday,
        startDate: new Date(holidayDate.getTime() - 1 * 24 * 60 * 60 * 1000), // Saturday
        endDate: new Date(holidayDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Monday
        totalDays: 3,
        leaveRequired: 1,
        description: `Three days of long weekend, when you take one day leave on Monday on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }

    // Case 7: Holiday on Saturday (3-day weekend with 1 day leave on Friday)
    if (dayOfWeek === 6) {
      longWeekends.push({
        holiday,
        startDate: new Date(holidayDate.getTime() - 1 * 24 * 60 * 60 * 1000), // Friday
        endDate: new Date(holidayDate.getTime() + 1 * 24 * 60 * 60 * 1000), // Sunday
        totalDays: 3,
        leaveRequired: 1,
        description: `Three days of long weekend, when you take one day leave on Friday on the occasion of ${holiday.name}.`,
        countryName,
        countryCode,
      });
    }
  });

  // Sort by date
  longWeekends.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Filter by month if specified
  let monthFilteredWeekends = longWeekends;
  if (selectedMonth !== undefined) {
    monthFilteredWeekends = longWeekends.filter((lw) => {
      const month = new Date(lw.holiday.date).getMonth();
      return month === selectedMonth - 1; // Month is 1-indexed in query param, 0-indexed in Date
    });
  }

  // Group by month
  const longWeekendsByMonth: Record<number, LongWeekend[]> = {};
  monthFilteredWeekends.forEach((lw) => {
    const month = lw.holiday.date ? new Date(lw.holiday.date).getMonth() : 0;
    if (!longWeekendsByMonth[month]) {
      longWeekendsByMonth[month] = [];
    }
    longWeekendsByMonth[month].push(lw);
  });

  // Get selected country name
  const selectedCountryName = selectedCountry
    ? countries.find((c) => c.slug.toLowerCase() === selectedCountry)?.name
    : null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            {selectedCountryName
              ? `Long Weekends in ${currentYear} for the ${selectedCountryName}`
              : `Long Weekends in ${currentYear} - All Countries`}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {selectedCountryName
              ? `Discover all long weekend opportunities in ${selectedCountryName} for ${currentYear}. Plan strategically to maximize your time off.`
              : `Plan your perfect long weekends across the globe and maximize your time off by strategically using your leave days.`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Long Weekends</h2>
          <form method="get" action="/long-weekend" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Year Filter */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                name="year"
                defaultValue={currentYear}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue={selectedCountry || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.slug}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                id="month"
                name="month"
                defaultValue={selectedMonth || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Months</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
              <Link
                href="/long-weekend"
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
              >
                Clear Filters
              </Link>
            </div>
          </form>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {monthFilteredWeekends.length}
            </div>
            <div className="text-gray-600">Long Weekend Opportunities</div>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {monthFilteredWeekends.filter((lw) => lw.leaveRequired === 0).length}
            </div>
            <div className="text-gray-600">Without Taking Leave</div>
          </div>
          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {monthFilteredWeekends.filter((lw) => lw.holiday.isBankHoliday).length}
            </div>
            <div className="text-gray-600">Bank Holidays</div>
          </div>
          <div className="bg-white border-2 border-orange-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {monthFilteredWeekends.reduce((sum, lw) => sum + lw.totalDays, 0)}
            </div>
            <div className="text-gray-600">Total Days Off</div>
          </div>
        </div>

        {/* Long Weekend Calendar */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Long Weekend Calendar
          </h2>
          <div className="space-y-8">
            {Object.keys(longWeekendsByMonth)
              .map(Number)
              .sort((a, b) => a - b)
              .map((monthIndex) => {
                const monthLongWeekends = longWeekendsByMonth[monthIndex];
                return (
                  <div key={monthIndex} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {monthNames[monthIndex]} {currentYear}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {monthLongWeekends.map((lw, index) => (
                        <div
                          key={`${lw.holiday.id}-${index}`}
                          className="border-2 border-green-200 rounded-lg p-4 bg-green-50"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {lw.holiday.name}
                                </h4>
                                {lw.holiday.isBankHoliday && (
                                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                                    Bank
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">{getCountryFlag(lw.countryCode)}</span>
                                <span>{lw.countryName}</span>
                              </div>
                            </div>
                            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded ml-2">
                              {lw.totalDays} Days
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">📅</span>
                              <span>{formatDate(lw.holiday.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">📆</span>
                              <span>{getDayOfWeek(lw.holiday.date)}</span>
                            </div>
                            {lw.leaveRequired > 0 && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">✋</span>
                                <span className="text-orange-700 font-medium">
                                  Take {lw.leaveRequired} day{lw.leaveRequired > 1 ? 's' : ''} leave
                                </span>
                              </div>
                            )}
                            {lw.leaveRequired === 0 && (
                              <div className="flex items-center">
                                <span className="font-medium mr-2">✅</span>
                                <span className="text-green-700 font-medium">
                                  No leave required
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Text Format */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Long Weekend Details
          </h2>
          <div className="space-y-4">
            {monthFilteredWeekends.map((lw, index) => {
              const date = new Date(lw.holiday.date);
              const monthName = monthNames[date.getMonth()];
              const day = date.getDate();
              const dayName = getDayOfWeek(lw.holiday.date);

              return (
                <div key={`${lw.holiday.id}-text-${index}`} className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="text-gray-800 leading-relaxed">
                    <strong>{getCountryFlag(lw.countryCode)} {lw.countryName} - {monthName} {day}, {currentYear}, {dayName}:</strong> {lw.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper function to format date in short format (e.g., "1st, January")
function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });

  // Add ordinal suffix
  const suffix = getOrdinalSuffix(day);

  return `${day}${suffix}, ${month}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
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
