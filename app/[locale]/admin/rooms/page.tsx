import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';

export default async function AdminRoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'true') {
    redirect(`/${locale}/admin/login`);
  }

  const rooms = await prisma.room.findMany({
    orderBy: { basePrice: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="font-serif text-3xl font-bold text-emerald-900">
          Gestion des chambres
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 hover:text-emerald-700 underline"
          >
            Retour au tableau de bord
          </Link>
          <Link
            href="/admin/rooms/new"
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nouvelle chambre
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">Chambre</th>
                <th className="px-6 py-4 font-medium text-gray-900">Capacité</th>
                <th className="px-6 py-4 font-medium text-gray-900">Prix / Nuit</th>
                <th className="px-6 py-4 font-medium text-gray-900">Statut</th>
                <th className="px-6 py-4 font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {locale === 'fr' ? room.nameFr : room.nameEn}
                    </div>
                    <div className="text-gray-500 text-xs">{room.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{room.capacity} pers.</td>
                  <td className="px-6 py-4 font-medium text-emerald-700">
                    {room.basePrice} CHF
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.published ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {room.published ? 'Publiée' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/rooms/${room.id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}