import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';

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

            return (
              <article
                key={room.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      {name}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-serif text-xl font-bold text-emerald-900 mb-2">
                    {name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{desc}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>{t('capacity')} : {room.capacity} {t('capacityUnit')}</span>
                    <span>{t('size')} : {room.sizeSqm} {t('sizeUnit')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">{t('startingFrom')}</span>
                      <div className="text-emerald-700 font-bold text-xl">
                        {room.basePrice} CHF
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          / {t('perNight')}
                        </span>
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