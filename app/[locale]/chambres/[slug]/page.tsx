import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import RoomGallery from '@/components/rooms/RoomGallery';
import ShareButton from '@/components/ui/ShareButton';

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('rooms');

  const room = await prisma.room.findUnique({ where: { slug } });
  if (!room || !room.published) notFound();

  const images = JSON.parse(room.images) as string[];
  const amenities = JSON.parse(room.amenities) as string[];
  const name = locale === 'fr' ? room.nameFr : room.nameEn;
  const desc = locale === 'fr' ? room.descFr : room.descEn;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/chambres"
          className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-900 mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t('back')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Colonne principale : Galerie + Description */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Galerie */}
            <RoomGallery images={images} name={name} />

            {/* Titre & Infos */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950">
                  {name}
                </h1>
                <ShareButton title={name} />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pb-6 border-b border-gray-200">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Jusqu'à <strong>{room.capacity}</strong> personnes
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                  <strong>{room.sizeSqm}</strong> m²
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-emerald-950 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {desc}
              </p>
            </div>

            {/* Équipements */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-emerald-950 mb-6">
                {t('amenities')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 text-gray-700 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm font-medium">{t(`amenity.${a}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne latérale : Réservation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
              <div className="mb-6">
                <span className="text-sm text-gray-500 font-medium">{t('startingFrom')}</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-emerald-700 font-bold text-4xl">{room.basePrice}</span>
                  <span className="text-gray-500 font-medium">CHF</span>
                </div>
                <span className="text-sm text-gray-400">/ {t('perNight')}</span>
              </div>
              
              <Link
                href={`/reservation?room=${room.slug}`}
                className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-4 rounded-xl transition shadow-lg shadow-emerald-700/30"
              >
                {t('bookThisRoom')}
              </Link>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                Aucun paiement immédiat requis pour bloquer la chambre.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}