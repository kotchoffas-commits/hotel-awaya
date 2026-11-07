import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BookingRequestActions from '@/components/admin/BookingRequestActions';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') redirect(`/${locale}/admin/login`);

  // On récupère TOUTES les demandes en attente
  const requests = await prisma.bookingRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  // On récupère TOUTES les réservations en attente
  const bookings = await prisma.booking.findMany({
    where: { status: 'PENDING' },
    include: { room: true },
    orderBy: { createdAt: 'desc' },
  });

  // Une fois la page ouverte, on marque tout comme "Lu" (la cloche disparaît)
  if (requests.length > 0 || bookings.length > 0) {
    await prisma.bookingRequest.updateMany({ where: { status: 'PENDING', isNotified: false }, data: { isNotified: true } });
    await prisma.booking.updateMany({ where: { status: 'PENDING', isNotified: false }, data: { isNotified: true } });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900">Centre de notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Demandes et réservations en attente</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-emerald-700 bg-gray-100 px-4 py-2 rounded-lg">← Retour</Link>
      </div>

      {/* SECTION DEMANDES */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Demandes de disponibilité ({requests.length})</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200 mb-12">
          <p className="text-gray-500 text-sm">Aucune demande en attente.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {requests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">Demande</span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{req.reference}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{req.guestName}</h3>
                <p className="text-sm text-gray-600">Email : {req.guestEmail}</p>
                <p className="text-sm text-gray-600">Tél : {req.guestPhone || '-'} | WhatsApp : {req.whatsapp || '-'}</p>
                <p className="text-sm font-medium text-gray-800 mt-2 bg-gray-50 p-2 rounded-lg inline-block">
                  Du {req.checkIn.toLocaleDateString('fr-FR')} au {req.checkOut.toLocaleDateString('fr-FR')} ({req.guests} pers.)
                </p>
                {req.message && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-1">Message du client :</p>
                    <p className="text-sm text-gray-700 italic">"{req.message}"</p>
                  </div>
                )}
              </div>
              <BookingRequestActions 
                requestId={req.id} 
                currentStatus={req.status} 
                guestEmail={req.guestEmail} 
                guestName={req.guestName} 
                reference={req.reference} 
                checkIn={req.checkIn} 
                checkOut={req.checkOut} 
              />
            </div>
          ))}
        </div>
      )}

      {/* SECTION RÉSERVATIONS */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Réservations en attente de paiement ({bookings.length})</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-500 text-sm">Aucune réservation en attente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded mb-2 inline-block">{b.reference}</span>
                <h3 className="font-bold text-gray-900">{b.guestName}</h3>
                <p className="text-sm text-gray-500">{b.room.nameFr}</p>
              </div>
              <Link href="/admin/dashboard" className="text-emerald-700 font-medium text-sm hover:underline">
                Gérer →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}