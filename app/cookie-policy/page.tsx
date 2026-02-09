import { generatePageMetadata } from '@/lib/page-metadata';
import { StaticPage } from '@/components/StaticPage';

export async function generateMetadata() {
  return generatePageMetadata('cookie-policy');
}

export default function CookiePolicyPage() {
  return <StaticPage slug="cookie-policy" />;
}
