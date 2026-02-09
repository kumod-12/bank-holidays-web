/**
 * Source & Disclaimer Footer
 * SEO Guidelines: Section 1.6 - E-E-A-T Signals
 */

import { Holiday } from '@/lib/types';
import { slateToHtml } from '@/lib/utils';

interface SourceFooterProps {
  holiday: Holiday;
}

export function SourceFooter({ holiday }: SourceFooterProps) {
  const lastUpdated = holiday.lastUpdated
    ? new Date(holiday.lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <footer className="mt-16 pt-8 border-t border-gray-200">
      {/* Source Attribution */}
      {(holiday.authoritySource || holiday.sourceUrl) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Source</h3>
          {holiday.authoritySource && !holiday.sourceUrl && (
            <p className="text-gray-700">{holiday.authoritySource}</p>
          )}
          {holiday.sourceUrl && (
            <a
              href={holiday.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              {holiday.authoritySource || 'Official Source'}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            <strong>Last updated:</strong> {lastUpdated}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      {holiday.disclaimer && holiday.disclaimer.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Disclaimer
          </h3>
          <div
            className="text-sm text-gray-600 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: slateToHtml(holiday.disclaimer),
            }}
            suppressHydrationWarning
          />
        </div>
      )}

      {/* Site Footer */}
      <div className="text-center text-sm text-gray-500 pt-6">
        <p suppressHydrationWarning>
          © 2026 {process.env.NEXT_PUBLIC_SITE_NAME || 'Global Bank Holidays'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
