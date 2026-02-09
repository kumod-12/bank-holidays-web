/**
 * Holiday Extension Tips - High Engagement Section
 * SEO Guidelines: Section 2.4 - Holiday Extension UX (High Engagement)
 */

import { ExtensionTip } from '@/lib/types';
import { slateToHtml } from '@/lib/utils';

interface ExtensionTipsProps {
  holidayName: string;
  tips?: ExtensionTip[];
}

export function ExtensionTips({ holidayName, tips }: ExtensionTipsProps) {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        How to Extend Your {holidayName} Holiday
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {tip.title}
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white rounded-lg px-4 py-2 border border-green-300">
                <div className="text-xs text-gray-600 mb-1">Leave Days</div>
                <div className="text-2xl font-bold text-green-700">
                  {tip.leaveDays}
                </div>
              </div>
              <div className="text-gray-400 text-2xl">=</div>
              <div className="bg-green-700 rounded-lg px-4 py-2">
                <div className="text-xs text-green-50 mb-1">Total Days Off</div>
                <div className="text-2xl font-bold text-white">{tip.totalDays}</div>
              </div>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: slateToHtml(tip.description) }}
              suppressHydrationWarning
            />
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>💡 Pro Tip:</strong> Plan your leave early to maximize your holiday experience. Check with your employer's leave policy and coordinate with your team.
        </p>
      </div>
    </section>
  );
}
