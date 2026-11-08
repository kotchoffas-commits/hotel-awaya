import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import SponsorForm from '@/components/sponsors/SponsorForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sponsors' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hotel-awaya.com';
  const path = '/partenaires';
  const url = siteUrl + '/' + locale + path;
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: url,
      languages: { fr: siteUrl + '/fr' + path, en: siteUrl + '/en' + path },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url,
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
    },
  };
}

export default async function PartnersPage() {
  const t = await getTranslations('sponsors');
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-16 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">{t('title')}</h1>
          <p className="text-xl text-emerald-800 mb-6">{t('subtitle')}</p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{t('intro')}</p>
        </div>
        <SponsorForm />
      </div>
    </div>
  );
}