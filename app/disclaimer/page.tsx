import { generatePageMetadata } from '@/lib/page-metadata';
import { StaticPage } from '@/components/StaticPage';

export async function generateMetadata() {
  return generatePageMetadata('disclaimer');
}

export default function DisclaimerPage() {
  return <StaticPage slug="disclaimer" />;
}
