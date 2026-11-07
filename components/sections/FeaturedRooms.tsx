import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';

export default async function FeaturedRooms() {
  const t = await getTranslations('home');
  const locale = await getLocale();

  const rooms = await prisma.room.findMany({
    where: { published: true },
    orderBy: { basePrice: 'desc' },
    take: 3,
  });

  if (rooms.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">Hébergements</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">Nos Chambres d'Exception</h2>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => {
            const images = JSON.parse(room.images) as string[];
            const name = locale === 'fr' ? room.nameFr : room.nameEn;
            const desc = locale === 'fr' ? room.descFr : room.descEn;

            return (
              <article
                key={room.id}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border border-gray-100 animate-fade-in-up delay-${(index + 1) * 100}`}
              >
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                  )}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-emerald-900 shadow-lg">
                    {room.basePrice} CHF <span className="text-xs text-gray-500 font-normal">/ nuit</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="font-serif text-2xl font-bold text-emerald-950 mb-3 group-hover:text-emerald-700 transition">
                    {name}
                  </h3>
                  <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed text-sm">
                    {desc}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>{room.capacity}</span>
                      <span className="flex items-center gap-1.5"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>{room.sizeSqm} m²</span>
                    </div>
                    <Link
                      href={`/chambres/${room.slug}`}
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300"
                    >
                      Découvrir
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-16 animate-fade-in-up delay-300">
          <Link
            href="/chambres"
            className="inline-block bg-emerald-950 text-white hover:bg-emerald-800 font-medium px-8 py-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-900/20"
          >
            Voir toutes nos chambres
          </Link>
        </div>
      </div>
    </section>
  );
}