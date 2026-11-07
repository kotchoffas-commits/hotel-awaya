import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('rates');

  const rooms = await prisma.room.findMany({
    where: { published: true },
    orderBy: { basePrice: 'asc' },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">{t('pricing')}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">{t('title')}</h1>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </header>

        <div className="space-y-4">
          {rooms.map((room, index) => {
            const name = locale === 'fr' ? room.nameFr : room.nameEn;
            return (
              <div key={room.id} className={`bg-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-gray-100 hover:shadow-md transition animate-fade-in-up delay-${(index % 3 + 1) * 100}`}>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-bold text-emerald-950 mb-1">{name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{t('capacity')} : {room.capacity} pers. • {room.sizeSqm} m²</p>
                </div>
                
                <div className="text-center md:text-right md:border-r border-gray-200 md:pr-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">{t('from')}</p>
                  <p className="text-3xl font-bold text-emerald-700">{room.basePrice} <span className="text-base font-medium">CHF</span></p>
                  <p className="text-xs text-gray-400">/ {t('perNight')}</p>
                </div>

                <Link href={`/chambres/${room.slug}`} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition w-full md:w-auto text-center">
                  {t('book')}
                </Link>
              </div>
            );
          })}
        </div>
        
        <p className="text-sm text-gray-400 mt-12 text-center italic animate-fade-in-up delay-300">{t('note')}</p>
      </div>
    </div>
  );
}