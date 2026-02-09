import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getFooter } from '@/lib/api';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { InstallPrompt } from '@/components/InstallPrompt';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Improve font loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Only preload main font
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Global Bank Holidays';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    'Discover bank holidays, public holidays, and celebrations from around the world. Complete information including dates, traditions, and leave planning tips.',
  keywords: [
    'bank holidays',
    'public holidays',
    'national holidays',
    'leave planning',
    'holiday calendar',
    'worldwide holidays',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description:
      'Discover bank holidays and public holidays from around the world with detailed information and leave planning tips.',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Discover bank holidays and public holidays from around the world.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icons/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HolidayCal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footer = await getFooter();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-74JXB82MQQ" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-74JXB82MQQ');
            `,
          }}
        />
        {/* Preconnect to API for faster data fetching */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'} />
        <meta name="theme-color" content="#2563EB" />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <Footer footer={footer} />
        <InstallPrompt />
      </body>
    </html>
  );
}
