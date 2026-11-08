import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import ReservationForm from '@/components/booking/ReservationForm';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string; room?: string; }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('booking');

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
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full animate-fade-in-up">
            <p className="text-gray-600 mb-6 font-medium">Chambre introuvable.</p>
            <Link href="/chambres" className="bg-emerald-700 text-white px-6 py-3 rounded-xl hover:bg-emerald-800 transition font-bold">Retour aux chambres</Link>
          </div>
        </div>
      );
    }

    const images = JSON.parse(room.images) as string[];
    const name = locale === 'fr' ? room.nameFr : room.nameEn;
    const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
    const total = nights * room.basePrice;

    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="font-serif text-4xl font-bold text-emerald-950 mb-2">{t('finalizeTitle')}</h1>
            <p className="text-gray-600">{t('finalizeSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-100">
            <div className="lg:col-span-2">
              <ReservationForm roomSlug={room.slug} checkIn={checkIn} checkOut={checkOut} guests={guests} basePrice={room.basePrice} />
            </div>
            
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50">
                {images[0] && <Image src={images[0]} alt={name} width={800} height={192} className="w-full h-48 object-cover" />}
                <div className="p-8">
                  <h3 className="font-serif text-xl font-bold text-emerald-950 mb-4">{name}</h3>
                  <div className="space-y-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex justify-between"><span>{t('checkin')}</span><strong className="text-gray-900">{new Date(checkIn).toLocaleDateString('fr-FR')}</strong></div>
                    <div className="flex justify-between"><span>{t('checkout')}</span><strong className="text-gray-900">{new Date(checkOut).toLocaleDateString('fr-FR')}</strong></div>
                    <div className="flex justify-between"><span>{t('guests')}</span><strong className="text-gray-900">{guests} pers.</strong></div>
                    <div className="flex justify-between"><span>{t('nights')}</span><strong className="text-gray-900">{nights}</strong></div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500 font-medium">Total estimé</span>
                    <span className="text-emerald-700 font-bold text-3xl">{total} <span className="text-lg">CHF</span></span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-20 px-4 animate-fade-in-up">
      <div className="max-w-xl w-full bg-white rounded-3xl p-10 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <h1 className="font-serif text-3xl font-bold text-emerald-950 mb-3">{t('searchTitle')}</h1>
        <p className="text-gray-600 mb-8">{t('searchSubtitle')}</p>
        <Link href="/chambres" className="inline-block bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-800 transition">
          Voir les chambres
        </Link>
      </div>
    </div>
  );
}
