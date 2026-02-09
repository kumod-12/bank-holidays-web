/**
 * FAQ Section with Accordion
 * SEO Guidelines: Section 1.2 - Recommended H2s (Frequently Asked Questions)
 * Critical for featured snippets
 */

'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/types';
import { slateToHtml } from '@/lib/utils';

interface FAQSectionProps {
  faqs?: FAQ[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-4 bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-8">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: slateToHtml(faq.answer) }}
                  suppressHydrationWarning
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
