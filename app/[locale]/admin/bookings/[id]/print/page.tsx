import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from '@/components/ui/PrintButton';
import { cookies } from 'next/headers';

export default async function PrintBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'true') {
    return <div className="p-10 text-center">Accès non autorisé.</div>;
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking) notFound();

  return (
    <div className="bg-white min-h-screen text-black p-10 max-w-4xl mx-auto">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { margin: 2cm; }
        }
      `}</style>

      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold uppercase tracking-widest">Hôtel Awaya Colline 132</h1>
          <p className="text-sm mt-2 text-gray-600">Colline 132, Bénin</p>
          <p className="text-sm text-gray-600">+229 00 00 00 00 | contact@awaya-colline132.com</p>
        </div>
        <div className="text-right">
          <PrintButton />
        </div>
      </div>

      <div className="mb-10 flex justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">FICHE DE RÉSERVATION</h2>
          <p className="text-sm">Date d'émission : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <div className="text-right bg-gray-100 p-4 rounded border border-gray-300">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Référence</p>
          <p className="text-2xl font-mono font-bold">{booking.reference}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">Informations Client</h3>
          <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
            <p><strong>Nom :</strong> {booking.guestName}</p>
            <p><strong>Email :</strong> {booking.guestEmail}</p>
            <p><strong>Téléphone :</strong> {booking.guestPhone || '-'}</p>
            <p><strong>Voyageurs :</strong> {booking.guests}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">Détails du séjour</h3>
          <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
            <p><strong>Chambre :</strong> {booking.room.nameFr}</p>
            <p><strong>Arrivée :</strong> {booking.checkIn.toLocaleDateString('fr-FR')} (à partir de 14h00)</p>
            <p><strong>Départ :</strong> {booking.checkOut.toLocaleDateString('fr-FR')} (avant 12h00)</p>
            <p><strong>Statut :</strong> {booking.status}</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3">Détails Financiers</h3>
        <table className="w-full text-sm border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-left">Description</th>
              <th className="border border-gray-200 p-2 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2">Hébergement ({Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86400000)} nuit(s))</td>
              <td className="border border-gray-200 p-2 text-right">{booking.totalAmount} {booking.currency}</td>
            </tr>
            <tr className="font-bold">
              <td className="border border-gray-200 p-2 text-right">TOTAL</td>
              <td className="border border-gray-200 p-2 text-right">{booking.totalAmount} {booking.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 mt-20 pt-6 border-t border-gray-200 text-center">
        <p>Merci de conserver cette fiche pendant la durée de votre séjour.</p>
        <p>Hôtel Awaya Colline 132 - Votre havre de paix.</p>
      </div>
    </div>
  );
}