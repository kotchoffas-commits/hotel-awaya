import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileFloatingCTA from '@/components/layout/MobileFloatingCTA';
import { Jost } from 'next/font/google';
import '../globals.css';

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
  weight: ['400', '700'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotel-awaya.com';
  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
  const ogImageUrl = siteUrl + '/' + locale + '/opengraph-image';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('defaultTitle'),
      template: '%s | ' + t('siteName'),
    },
    description: t('defaultDescription'),
    keywords: t('keywords').split(',').map((k: string) => k.trim()),
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: siteUrl + '/' + locale,
      siteName: t('siteName'),
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: t('siteName') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('defaultTitle'),
      description: t('defaultDescription'),
      images: [ogImageUrl],
    },
    alternates: {
      canonical: siteUrl + '/' + locale,
      languages: {
        fr: siteUrl + '/fr',
        en: siteUrl + '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={jost.variable}>
      <body className="min-h-screen bg-white text-gray-900 antialiased flex flex-col font-sans pb-20 md:pb-0">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileFloatingCTA />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}