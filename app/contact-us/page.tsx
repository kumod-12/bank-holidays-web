import { generatePageMetadata } from '@/lib/page-metadata';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/api';
import { slateToHtml } from '@/lib/utils';
import { ContactForm } from '@/components/ContactForm';

export async function generateMetadata() {
  return generatePageMetadata('contact-us');
}

export default async function ContactUsPage() {
  const page = await getPageBySlug('contact-us');

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
        </header>

        {/* CMS Content */}
        <article
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{
            __html: slateToHtml(page.content),
          }}
          suppressHydrationWarning
        />

        {/* Contact Form */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
