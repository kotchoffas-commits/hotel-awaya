import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booking?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('booking');

  if (!sp.booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">{"R\u00e9servation introuvable."}</p>
        <Link href="/chambres" className="text-emerald-700 underline">
          {"Retour aux chambres"}
        </Link>
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id: sp.booking },
    include: { room: true },
  });

  if (!booking) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">{"R\u00e9servation introuvable."}</p>
        <Link href="/chambres" className="text-emerald-700 underline">
          {"Retour aux chambres"}
        </Link>
      </div>
    );
  }

  const roomName = locale === 'fr' ? booking.room.nameFr : booking.room.nameEn;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-2">
          {t('success')}
        </h1>
        <p className="text-gray-600">{t('successMessage')}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">
          {"R\u00e9capitulatif"}
        </h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">{"Num\u00e9ro de r\u00e9servation"}</dt>
            <dd className="font-mono text-xs">{booking.id}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">{"Chambre"}</dt>
            <dd className="font-medium">{roomName}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">{t('checkin')}</dt>
            <dd className="font-medium">
              {booking.checkIn.toISOString().split('T')[0]}
            </dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">{t('checkout')}</dt>
            <dd className="font-medium">
              {booking.checkOut.toISOString().split('T')[0]}
            </dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">{t('guests')}</dt>
            <dd className="font-medium">{booking.guests}</dd>
          </div>
          <div className="flex justify-between pt-2">
            <dt className="text-gray-700 font-medium">{t('total')}</dt>
            <dd className="font-bold text-emerald-700 text-lg">
              {booking.totalAmount} {booking.currency}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">
          {"Vos coordonn\u00e9es"}
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">{"Nom"}</dt>
            <dd className="font-medium">{booking.guestName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">{"Email"}</dt>
            <dd className="font-medium">{booking.guestEmail}</dd>
          </div>
          {booking.guestPhone && (
            <div className="flex justify-between">
              <dt className="text-gray-500">{"T\u00e9l\u00e9phone"}</dt>
              <dd className="font-medium">{booking.guestPhone}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          {"Retour \u00e0 l\u2019accueil"}
        </Link>
      </div>
    </div>
  );
}