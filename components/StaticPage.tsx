/**
 * Shared component for rendering static pages from Payload CMS
 */

import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/api';
import { slateToHtml } from '@/lib/utils';

interface StaticPageProps {
  slug: string;
}

export async function StaticPage({ slug }: StaticPageProps) {
  const page = await getPageBySlug(slug);

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {page.title}
          </h1>
          {page.updatedAt && (
            <p className="text-sm text-gray-500">
              Last updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>

        {/* Page Content */}
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: slateToHtml(page.content),
          }}
          suppressHydrationWarning
        />
      </main>
    </div>
  );
}
