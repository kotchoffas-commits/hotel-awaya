import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';

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

  const today = new Date();
  const futureBookings = await prisma.booking.findMany({
    where: { status: { in: ['CONFIRMED', 'PENDING'] }, checkOut: { gte: today } },
    include: { room: true },
    orderBy: { checkIn: 'asc' },
  });

  const nextBookingByRoom: Record<string, { checkIn: Date; checkOut: Date }> = {};
  futureBookings.forEach((b) => {
    if (!nextBookingByRoom[b.roomId]) {
      nextBookingByRoom[b.roomId] = { checkIn: b.checkIn, checkOut: b.checkOut };
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">{t('accommodations')}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('subtitle')}</p>
        </header>

        {rooms.length === 0 ? (
          <p className="text-center text-gray-500">{t('noRooms')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => {
              const images = JSON.parse(room.images) as string[];
              const name = locale === 'fr' ? room.nameFr : room.nameEn;
              const desc = locale === 'fr' ? room.descFr : room.descEn;
              const blocked = nextBookingByRoom[room.id];

              return (
                <article
                  key={room.id}
                  className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border border-gray-100 relative animate-fade-in-up delay-${(index % 3 + 1) * 100}`}
                >
                  <div className="relative h-72 overflow-hidden bg-gray-100">
                    {images[0] ? (
                      <Image src={images[0]} alt={name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">{name}</div>
                    )}
                    
                    {/* Badge {t('booked')} */}
                    {blocked && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t('booked')}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-emerald-900 shadow-lg">
                      {room.basePrice} CHF <span className="text-xs text-gray-500 font-normal">/ {t('perNight')}</span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col h-[calc(100%-18rem)]">
                    <h2 className="font-serif text-2xl font-bold text-emerald-950 mb-2 group-hover:text-emerald-700 transition">{name}</h2>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{desc}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6 mt-auto">
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{room.capacity} {t('capacityUnit')}</span>
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>{room.sizeSqm} {t('sizeUnit')}</span>
                    </div>

                    {blocked && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl mb-4">
                        <strong>{t('nextDates')} :</strong><br/>
                        Du {blocked.checkIn.toLocaleDateString('fr-FR')} au {blocked.checkOut.toLocaleDateString('fr-FR')}
                      </div>
                    )}

                    <Link
                      href={`/chambres/${room.slug}`}
                      className="w-full text-center bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold text-sm px-5 py-3 rounded-xl transition-all duration-300 mt-auto"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
