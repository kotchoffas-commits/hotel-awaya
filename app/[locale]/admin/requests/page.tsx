import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import BookingRequestActions from '@/components/admin/BookingRequestActions';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') redirect(`/${locale}/admin/login`);

  // On récupère TOUTES les demandes, de la plus récente à la plus ancienne
  const requests = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900">Historique des demandes</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez et modifiez les décisions des demandes de disponibilité</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-emerald-700 bg-gray-100 px-4 py-2 rounded-lg">← Retour</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">Réf. & Date</th>
                <th className="px-6 py-4 font-medium text-gray-900">Client & Contact</th>
                <th className="px-6 py-4 font-medium text-gray-900">Séjour</th>
                <th className="px-6 py-4 font-medium text-gray-900">Décision / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucune demande dans l'historique.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-emerald-700">{req.reference}</div>
                      <div className="text-xs text-gray-500 mt-1">{req.createdAt.toLocaleDateString('fr-FR')} à {req.createdAt.toLocaleTimeString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{req.guestName}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{req.guestEmail}</div>
                      <div className="text-gray-500 text-xs">Tél: {req.guestPhone || '-'}</div>
                      <div className="text-gray-500 text-xs">WhatsApp: {req.whatsapp || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{new Date(req.checkIn).toLocaleDateString('fr-FR')} au {new Date(req.checkOut).toLocaleDateString('fr-FR')}</div>
                      <div className="text-xs text-gray-500 mt-1">{req.guests} personne(s)</div>
                      {req.message && (
                        <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded mt-2 max-w-[250px] truncate" title={req.message}>
                          "{req.message}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* ICI : On met le menu déroulant à la place du simple badge */}
                      <BookingRequestActions 
                        requestId={req.id} 
                        currentStatus={req.status} 
                        guestEmail={req.guestEmail} 
                        guestName={req.guestName} 
                        reference={req.reference} 
                        checkIn={req.checkIn} 
                        checkOut={req.checkOut} 
                      />
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