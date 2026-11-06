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

  // On récupère les chambres depuis la base de données
  const rooms = await prisma.room.findMany({
    where: { published: true },
    orderBy: { basePrice: 'asc' },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-900 text-white">
                  <th className="p-6 font-medium">{t('room')}</th>
                  <th className="p-6 font-medium text-center">{t('capacity')}</th>
                  <th className="p-6 font-medium text-right">{t('price')}</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => {
                  const name = locale === 'fr' ? room.nameFr : room.nameEn;
                  return (
                    <tr key={room.id} className="hover:bg-gray-50 transition">
                      <td className="p-6">
                        <div className="font-serif font-bold text-emerald-900 text-lg">
                          {name}
                        </div>
                      </td>
                      <td className="p-6 text-center text-gray-600">
                        {room.capacity} pers.
                      </td>
                      <td className="p-6 text-right">
                        <span className="block text-xs text-gray-500 mb-1">{t('from')}</span>
                        <span className="font-bold text-emerald-700 text-xl">
                          {room.basePrice} CHF
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <Link
                          href={`/chambres/${room.slug}`}
                          className="inline-block bg-white border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                          {t('book')}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-6 text-center italic">
          {t('note')}
        </p>
      </div>
    </div>
  );
}