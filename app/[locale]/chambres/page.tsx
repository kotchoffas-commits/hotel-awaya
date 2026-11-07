import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('rooms');

  const rooms = await prisma.room.findMany({
    where: { published: true },
    orderBy: { basePrice: 'asc' },
  });

  // On récupère toutes les réservations futures pour savoir quelles chambres sont bloquées
  const today = new Date();
  const futureBookings = await prisma.booking.findMany({
    where: {
      status: { in: ['CONFIRMED', 'PENDING'] },
      checkOut: { gte: today },
    },
    include: { room: true },
    orderBy: { checkIn: 'asc' },
  });

  // On regroupe par chambre : la prochaine réservation pour chaque chambre
  const nextBookingByRoom: Record<string, { checkIn: Date; checkOut: Date }> = {};
  futureBookings.forEach((b) => {
    if (!nextBookingByRoom[b.roomId]) {
      nextBookingByRoom[b.roomId] = { checkIn: b.checkIn, checkOut: b.checkOut };
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </header>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500">{t('noRooms')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => {
            const images = JSON.parse(room.images) as string[];
            const name = locale === 'fr' ? room.nameFr : room.nameEn;
            const desc = locale === 'fr' ? room.descFr : room.descEn;
            const blocked = nextBookingByRoom[room.id];

            return (
              <article
                key={room.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group relative flex flex-col"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {images[0] ? (
                    <img src={images[0]} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">{name}</div>
                  )}
                  
                  {/* BADGE INDISPONIBLE */}
                  {blocked && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Réservée
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-serif text-xl font-bold text-emerald-900 mb-2">{name}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{desc}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{t('capacity')} : {room.capacity} {t('capacityUnit')}</span>
                    <span>{t('size')} : {room.sizeSqm} {t('sizeUnit')}</span>
                  </div>

                  {blocked && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg mb-4">
                      <strong>Prochaines dates prises :</strong><br/>
                      Du {blocked.checkIn.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')} au {blocked.checkOut.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      <span className="text-xs text-gray-500">{t('startingFrom')}</span>
                      <div className="text-emerald-700 font-bold text-xl">
                        {room.basePrice} CHF
                        <span className="text-sm font-normal text-gray-500 ml-1">/ {t('perNight')}</span>
                      </div>
                    </div>
                    <Link
                      href={`/chambres/${room.slug}`}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                    >
                      {t('viewDetails')}
                    </Link>
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