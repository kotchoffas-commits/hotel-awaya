import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import BookingStatusActions from '@/components/admin/BookingStatusActions';
import CopyButton from '@/components/ui/CopyButton';
import AdminNav from '@/components/admin/AdminNav';

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
    include: { room: true, promoCode: true },
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="font-serif text-3xl font-bold text-emerald-900">
            Tableau de bord
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Total Réservations</p>
            <p className="text-4xl font-bold text-emerald-900">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Revenus (Confirmés)</p>
            <p className="text-4xl font-bold text-emerald-700">{totalRevenue} <span className="text-lg">CHF</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">En attente de paiement</p>
            <p className="text-4xl font-bold text-amber-600">
              {bookings.filter((b) => b.status === 'PENDING').length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Réf. & Client</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Chambre</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Total</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Aucune réservation pour le moment.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            {booking.reference || booking.id.slice(0, 8)}
                          </span>
                          <CopyButton text={booking.reference || booking.id} />
                        </div>
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-gray-500 text-xs">{booking.guestEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {locale === 'fr' ? booking.room.nameFr : booking.room.nameEn}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        <span className="block">Arrivée: {booking.checkIn.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')}</span>
                        <span className="block">Départ: {booking.checkOut.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-emerald-700">
                          {booking.totalAmount} CHF
                        </div>
                        {booking.discountApplied && booking.discountApplied > 0 && (
                          <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1">
                            Promo: -{booking.discountApplied.toFixed(2)} CHF
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a href={`/${locale}/admin/bookings/${booking.id}/print`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition" title="Imprimer la facture">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}