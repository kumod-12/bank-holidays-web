/**
 * Breadcrumbs component
 * SEO Guidelines: Section 2.1 - Page Layout
 */

import Link from 'next/link';
import { Holiday } from '@/lib/types';
import { getCountryName, getCountryCode } from '@/lib/utils';

interface BreadcrumbsProps {
  holiday: Holiday;
}

export function Breadcrumbs({ holiday }: BreadcrumbsProps) {
  const countryName = getCountryName(holiday);
  const countryCode = getCountryCode(holiday).toLowerCase();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <Link
            href={`/${countryCode}`}
            className="hover:text-blue-600 transition-colors"
          >
            {countryName}
          </Link>
        </li>
        <li className="flex items-center">
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{holiday.name}</span>
        </li>
      </ol>
    </nav>
  );
}
