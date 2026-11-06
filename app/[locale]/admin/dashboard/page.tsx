import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import BookingStatusActions from '@/components/admin/BookingStatusActions';

export default async function AdminDashboardPage({
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

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { room: true },
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <h1 className="font-serif text-3xl font-bold text-emerald-900">
          Tableau de bord
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/admin/rooms" className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition shadow-sm">
            Gérer les chambres
          </Link>
          <Link href="/" className="text-gray-500 hover:text-emerald-700 underline px-2">
            Retour au site
          </Link>
          <a href={`/api/admin/logout?locale=${locale}`} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition">
            Déconnexion
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Réservations</p>
          <p className="text-3xl font-bold text-emerald-900">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Revenus (Confirmés + Terminés)</p>
          <p className="text-3xl font-bold text-emerald-700">{totalRevenue} CHF</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">En attente de paiement</p>
          <p className="text-3xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === 'PENDING').length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">Client</th>
                <th className="px-6 py-4 font-medium text-gray-900">Chambre</th>
                <th className="px-6 py-4 font-medium text-gray-900">Dates</th>
                <th className="px-6 py-4 font-medium text-gray-900">Statut</th>
                <th className="px-6 py-4 font-medium text-gray-900 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-gray-500 text-xs">{booking.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {locale === 'fr' ? booking.room.nameFr : booking.room.nameEn}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {booking.checkIn.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')} 
                      {' → '} 
                      {booking.checkOut.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')}
                    </td>
                    <td className="px-6 py-4">
                      <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {booking.totalAmount} CHF
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}