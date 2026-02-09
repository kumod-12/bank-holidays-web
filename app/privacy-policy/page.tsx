import { generatePageMetadata } from '@/lib/page-metadata';
import { StaticPage } from '@/components/StaticPage';

export async function generateMetadata() {
  return generatePageMetadata('privacy-policy');
}

export default function PrivacyPolicyPage() {
  return <StaticPage slug="privacy-policy" />;
}
