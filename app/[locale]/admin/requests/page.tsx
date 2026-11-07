import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsHistoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') redirect(`/${locale}/admin/login`);

  // On récupère TOUTES les demandes, de la plus récente à la plus ancienne
  const requests = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Acceptée (Dispo)</span>;
      case 'REJECTED': return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Refusée (Indispo)</span>;
      case 'WAITLIST': return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Liste d'attente</span>;
      case 'CONTACTED': return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-bold">Contacté</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-bold">En attente</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900">Historique des demandes</h1>
          <p className="text-gray-500 text-sm mt-1">Toutes les demandes de disponibilité et leurs décisions</p>
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
                <th className="px-6 py-4 font-medium text-gray-900">Décision</th>
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
                      {getStatusBadge(req.status)}
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