export const dynamic = 'force-dynamic';

import { generatePageMetadata } from '@/lib/page-metadata';
import { StaticPage } from '@/components/StaticPage';

export async function generateMetadata() {
  return generatePageMetadata('terms-conditions');
}

export default function TermsConditionsPage() {
  return <StaticPage slug="terms-conditions" />;
}
