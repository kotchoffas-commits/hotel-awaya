import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import ReservationForm from '@/components/booking/ReservationForm';

export const dynamic = 'force-dynamic';

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

  // ============================================
  // CAS 1 : Le client a choisi une chambre précise (formulaire de réservation)
  // ============================================
  if (slug) {
    const room = await prisma.room.findUnique({ where: { slug } });
    if (!room) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-4">Chambre introuvable.</p>
          <Link href="/chambres" className="text-emerald-700 underline">Retour aux chambres</Link>
        </div>
      );
    }

    const images = JSON.parse(room.images) as string[];
    const name = locale === 'fr' ? room.nameFr : room.nameEn;

    const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
    const total = nights * room.basePrice;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
          {t('confirm')}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ReservationForm roomSlug={room.slug} checkIn={checkIn} checkOut={checkOut} guests={guests} />
          </div>
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              {images[0] && <img src={images[0]} alt={name} className="w-full h-40 object-cover rounded-lg mb-4" />}
              <h3 className="font-serif text-lg font-bold text-emerald-900 mb-3">{name}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between"><span>{t('checkin')}</span><strong>{checkIn}</strong></div>
                <div className="flex justify-between"><span>{t('checkout')}</span><strong>{checkOut}</strong></div>
                <div className="flex justify-between"><span>{t('guests')}</span><strong>{guests}</strong></div>
                <div className="flex justify-between"><span>{t('nights')}</span><strong>{nights}</strong></div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">{t('total')}</span>
                <span className="text-emerald-700 font-bold text-2xl">{total} CHF</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ============================================
  // CAS 2 : Recherche de disponibilité (pas de chambre choisie)
  // On calcule les chambres disponibles pour ces dates !
  // ============================================
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));

  // Chambres bloquées par une réservation existante sur ces dates
  const blockedBookings = await prisma.booking.findMany({
    where: {
      status: { in: ['CONFIRMED', 'PENDING'] },
      AND: [{ checkIn: { lt: end } }, { checkOut: { gt: start } }],
    },
    select: { roomId: true },
  });
  const blockedIds = blockedBookings.map((b) => b.roomId);

  // Chambres disponibles = publiées + capacité suffisante + non bloquées
  const availableRooms = await prisma.room.findMany({
    where: {
      published: true,
      capacity: { gte: guests },
      id: { notIn: blockedIds },
    },
    orderBy: { basePrice: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* En-tête avec les dates recherchées */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-10">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-emerald-950 mb-2">
          Résultats de recherche
        </h1>
        <p className="text-gray-700">
          Du <strong>{checkIn}</strong> au <strong>{checkOut}</strong> — {nights} nuit(s) — {guests} voyageur(s)
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {availableRooms.length > 0 
            ? `${availableRooms.length} chambre(s) disponible(s) trouvée(s)` 
            : 'Aucune chambre disponible pour ces dates'}
        </p>
      </div>

      {availableRooms.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-50 text-amber-500 rounded-full mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-900 mb-3">
            Désolé, aucune chambre disponible
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Toutes nos chambres sont occupées pour ces dates. Veuillez vérifier nos chambres en ligne pour trouver une autre période.
          </p>
          <Link href="/chambres" className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-lg transition">
            Voir toutes nos chambres
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRooms.map((room) => {
            const images = JSON.parse(room.images) as string[];
            const name = locale === 'fr' ? room.nameFr : room.nameEn;
            const desc = locale === 'fr' ? room.descFr : room.descEn;
            const total = nights * room.basePrice;

            return (
              <article key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100 flex flex-col">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {images[0] ? (
                    <img src={images[0]} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">{name}</div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl font-bold text-emerald-900 mb-2">{name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{desc}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>👥 {room.capacity} pers.</span>
                    <span>📏 {room.sizeSqm} m²</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">{nights} nuit(s) × {room.basePrice} CHF</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-emerald-700">{total} CHF</span>
                      <Link 
                        href={`/reservation?room=${room.slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}