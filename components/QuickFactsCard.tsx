/**
 * Quick Facts Card - Above the fold
 * SEO Guidelines: Section 2.2 - Above-the-Fold (Most Important)
 */

import { Holiday } from '@/lib/types';
import { formatDate, getDayOfWeek } from '@/lib/utils';

interface QuickFactsCardProps {
  holiday: Holiday;
}

export function QuickFactsCard({ holiday }: QuickFactsCardProps) {
  const quickFacts = holiday.quickFacts;
  const date = quickFacts?.dateDisplay || formatDate(holiday.date);
  const day = quickFacts?.dayOfWeek || getDayOfWeek(holiday.date);
  const holidayType = quickFacts?.holidayType || getHolidayTypeLabel(holiday.type);
  const bankStatus = quickFacts?.bankHolidayStatus || (holiday.isBankHoliday ? 'Official Bank Holiday' : 'Not a Bank Holiday');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-600 mb-1">Date</dt>
          <dd className="text-lg font-semibold text-gray-900">{date}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600 mb-1">Day</dt>
          <dd className="text-lg font-semibold text-gray-900">{day}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600 mb-1">Type</dt>
          <dd className="text-lg font-semibold text-gray-900">{holidayType}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600 mb-1">Bank Holiday Status</dt>
          <dd className={`text-lg font-semibold ${holiday.isBankHoliday ? 'text-green-700' : 'text-gray-700'}`}>
            {bankStatus}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function getHolidayTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    national: 'National Holiday',
    regional: 'Regional Holiday',
    bank: 'Bank Holiday',
    optional: 'Optional Holiday',
  };
  return labels[type] || type;
}
