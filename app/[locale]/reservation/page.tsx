import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import ReservationForm from '@/components/booking/ReservationForm';

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    room?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('booking');
  const tr = await getTranslations('rooms');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const checkIn = sp.checkIn || today;
  const checkOut = sp.checkOut || tomorrow;
  const guests = Number(sp.guests || '2');
  const slug = sp.room;

  if (slug) {
    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">{"Chambre introuvable."}</p>
          <Link href="/chambres" className="text-emerald-700 underline">
            {"Retour aux chambres"}
          </Link>
        </div>
      );
    }

    const images = JSON.parse(room.images) as string[];
    const name = locale === 'fr' ? room.nameFr : room.nameEn;

    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
      )
    );
    const total = nights * room.basePrice;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
          {t('confirm')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReservationForm
              roomSlug={room.slug}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {images[0] && (
                <img
                  src={images[0]}
                  alt={name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="font-serif text-lg font-bold text-emerald-900 mb-3">
                {name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>{t('checkin')}</span>
                  <strong>{checkIn}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('checkout')}</span>
                  <strong>{checkOut}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('guests')}</span>
                  <strong>{guests}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('nights')}</span>
                  <strong>{nights}</strong>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">{t('total')}</span>
                <span className="text-emerald-700 font-bold text-2xl">
                  {total} CHF
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
        {t('search')}
      </h1>
      <p className="text-gray-600 mb-8">
        {"S\u00e9lectionnez une chambre pour commencer votre r\u00e9servation."}
      </p>
      <Link
        href="/chambres"
        className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        {tr('title')}
      </Link>
    </div>
  );
}