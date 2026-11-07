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

  const nights = Math.max(1, Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86400000));

  return (
    <div className="bg-white min-h-screen text-black p-8 md:p-12 flex justify-center">
      {/* 
        RÈGLES CSS D'IMPRESSION : 
        On cache le menu (header), le pied de page (footer) et les boutons.
        On force la page au format A4 sans marges parasites.
      */}
      <style>{`
        @media print {
          header, footer, nav { display: none !important; }
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          main { padding: 0 !important; margin: 0 !important; }
          .invoice-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          @page { size: A4; margin: 1.5cm; }
        }
      `}</style>

      {/* Le conteneur de la facture (format A4) */}
      <div className="invoice-container w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-xl border border-gray-200 p-10 flex flex-col">
        
        {/* En-tête Facture */}
        <div className="flex justify-between items-start border-b-4 border-emerald-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-emerald-900 uppercase tracking-widest">Hôtel Awaya Colline 132</h1>
            <p className="text-sm mt-2 text-gray-600 font-medium">Colline 132, Bénin</p>
            <p className="text-sm text-gray-600">+229 00 00 00 00</p>
            <p className="text-sm text-gray-600">contact@awaya-colline132.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">Facture</h2>
            <p className="text-sm text-gray-500 mt-1">N° {booking.reference}</p>
            <p className="text-sm text-gray-500">Date : {new Date().toLocaleDateString('fr-FR')}</p>
            <div className="mt-4 no-print">
              <PrintButton />
            </div>
          </div>
        </div>

        {/* Infos Client et Séjour */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 bg-emerald-50 p-2 rounded">Facturé à</h3>
            <div className="space-y-1 text-sm text-gray-800">
              <p className="font-bold text-lg">{booking.guestName}</p>
              <p>{booking.guestEmail}</p>
              <p>{booking.guestPhone || 'Non renseigné'}</p>
              <p className="mt-4 pt-2 border-t border-gray-100"><strong>Voyageurs :</strong> {booking.guests} personne(s)</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 bg-emerald-50 p-2 rounded">Détails du séjour</h3>
            <div className="space-y-1 text-sm text-gray-800">
              <p><strong>Chambre :</strong> {booking.room.nameFr}</p>
              <p><strong>Arrivée :</strong> {booking.checkIn.toLocaleDateString('fr-FR')} (14h00)</p>
              <p><strong>Départ :</strong> {booking.checkOut.toLocaleDateString('fr-FR')} (12h00)</p>
              <p><strong>Statut :</strong> <span className="font-bold text-emerald-700">{booking.status}</span></p>
            </div>
          </div>
        </div>

        {/* Tableau des montants */}
        <div className="mb-10 flex-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-right">P.U. (CHF)</th>
                <th className="p-3 text-center">Qté (Nuits)</th>
                <th className="p-3 text-right">Total (CHF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-3">
                  Hébergement - {booking.room.nameFr}<br/>
                  <span className="text-gray-500 text-xs">Du {booking.checkIn.toLocaleDateString('fr-FR')} au {booking.checkOut.toLocaleDateString('fr-FR')}</span>
                </td>
                <td className="p-3 text-right">{booking.room.basePrice}.00</td>
                <td className="p-3 text-center">{nights}</td>
                <td className="p-3 text-right">{booking.totalAmount}.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-emerald-900">
                <td colSpan={3} className="p-4 text-right font-bold text-lg">TOTAL À PAYER</td>
                <td className="p-4 text-right font-bold text-xl text-emerald-900">{booking.totalAmount}.00 CHF</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pied de facture */}
        <div className="mt-auto pt-8 text-center text-xs text-gray-500 border-t border-gray-200">
          <p className="font-bold mb-1">Merci de votre confiance.</p>
          <p>Cette facture tient lieu de confirmation de réservation.</p>
          <p>Hôtel Awaya Colline 132 - SIRET / RCCM : [À INSÉRER]</p>
        </div>
      </div>
    </div>
  );
}