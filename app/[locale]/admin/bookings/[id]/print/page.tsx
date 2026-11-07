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
    include: { room: true, promoCode: true },
  });

  if (!booking) notFound();

  const nights = Math.max(1, Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86400000));
  const discount = booking.discountApplied || 0;
  const baseTotal = booking.totalAmount + discount; // Prix sans la réduction
  const finalTotal = booking.totalAmount; // Prix final

  return (
    <div className="bg-gray-100 min-h-screen text-black p-4 md:p-8 flex justify-center items-start">
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          main { padding: 0 !important; margin: 0 !important; }
          .invoice-container { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; min-height: auto !important; page-break-inside: avoid; }
          .page-break-avoid { page-break-inside: avoid; }
          @page { size: A4 portrait; margin: 1cm; }
        }
      `}</style>

      <div className="invoice-container w-full max-w-[21cm] bg-white shadow-2xl p-8 md:p-10 flex flex-col">
        
        <div className="flex justify-between items-start border-b-4 border-emerald-900 pb-4 mb-6 page-break-avoid">
          <div>
            <h1 className="text-2xl font-serif font-bold text-emerald-900 uppercase tracking-widest">Hôtel Awaya Colline 132</h1>
            <p className="text-sm mt-1 text-gray-600 font-medium">Colline 132, Bénin</p>
            <p className="text-sm text-gray-600">+229 00 00 00 00 | contact@awaya-colline132.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800 uppercase">Facture</h2>
            <p className="text-sm text-gray-500 mt-1">N° {booking.reference}</p>
            <p className="text-sm text-gray-500">Date : {new Date().toLocaleDateString('fr-FR')}</p>
            <div className="mt-3 no-print">
              <PrintButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6 page-break-avoid">
          <div>
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Facturé à</h3>
            <div className="space-y-1 text-sm text-gray-800">
              <p className="font-bold text-base">{booking.guestName}</p>
              <p>{booking.guestEmail}</p>
              <p>{booking.guestPhone || 'Non renseigné'}</p>
              <p className="mt-2"><strong>Voyageurs :</strong> {booking.guests} personne(s)</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Détails du séjour</h3>
            <div className="space-y-1 text-sm text-gray-800">
              <p><strong>Chambre :</strong> {booking.room.nameFr}</p>
              <p><strong>Arrivée :</strong> {booking.checkIn.toLocaleDateString('fr-FR')} (14h00)</p>
              <p><strong>Départ :</strong> {booking.checkOut.toLocaleDateString('fr-FR')} (12h00)</p>
              <p><strong>Statut :</strong> <span className="font-bold text-emerald-700 uppercase">{booking.status}</span></p>
            </div>
          </div>
        </div>

        <div className="mb-6 page-break-avoid">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="p-3 text-left rounded-tl-lg">Description</th>
                <th className="p-3 text-right">P.U. (CHF)</th>
                <th className="p-3 text-center">Qté (Nuits)</th>
                <th className="p-3 text-right rounded-tr-lg">Total (CHF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 border-b border-gray-200">
              <tr>
                <td className="p-3">
                  <span className="font-medium">Hébergement</span> - {booking.room.nameFr}<br/>
                  <span className="text-gray-500 text-xs">Du {booking.checkIn.toLocaleDateString('fr-FR')} au {booking.checkOut.toLocaleDateString('fr-FR')}</span>
                </td>
                <td className="p-3 text-right">{booking.room.basePrice}.00</td>
                <td className="p-3 text-center">{nights}</td>
                <td className="p-3 text-right">{baseTotal.toFixed(2)}</td>
              </tr>
              {discount > 0 && (
                <tr className="text-amber-700 bg-amber-50">
                  <td colSpan={3} className="p-3 font-medium">
                    Réduction appliquée {booking.promoCode ? `(Code: ${booking.promoCode.code})` : ''}
                  </td>
                  <td className="p-3 text-right font-medium">-{discount.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="p-4 text-right font-bold text-gray-800">TOTAL À PAYER</td>
                <td className="p-4 text-right font-bold text-xl text-emerald-900 bg-emerald-50 rounded-br-lg">{finalTotal.toFixed(2)} CHF</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 pt-4 text-center text-xs text-gray-500 border-t border-gray-200 page-break-before-avoid">
          <p className="font-bold text-gray-700 mb-1">Merci de votre confiance.</p>
          <p>Cette facture tient lieu de confirmation de réservation.</p>
        </div>
      </div>
    </div>
  );
}