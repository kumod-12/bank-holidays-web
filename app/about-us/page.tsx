export const dynamic = 'force-dynamic';
import { generatePageMetadata } from '@/lib/page-metadata';
import { StaticPage } from '@/components/StaticPage';

export async function generateMetadata() {
  return generatePageMetadata('about-us');
}

export default function AboutUsPage() {
  return <StaticPage slug="about-us" />;
}
