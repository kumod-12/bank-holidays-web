/**
 * Upcoming Dates Table
 * SEO Guidelines: Section 2.3 - Tables & Data Presentation
 */

import { UpcomingDate } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface DatesTableProps {
  holidayName: string;
  upcomingDates?: UpcomingDate[];
}

export function DatesTable({ holidayName, upcomingDates }: DatesTableProps) {
  if (!upcomingDates || upcomingDates.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {holidayName} Dates (Upcoming Years)
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Day
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {upcomingDates.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(item.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {item.day || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
