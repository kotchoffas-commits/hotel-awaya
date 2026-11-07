import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/prisma';
import CopyButton from '@/components/ui/CopyButton';

export default async function ConfirmationPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ booking?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations('booking');

  if (!sp.booking) {
    return <div className="min-h-screen flex items-center justify-center p-4"><p className="text-gray-600">Réservation introuvable.</p></div>;
  }

  const booking = await prisma.booking.findFirst({
    where: { OR: [{ id: sp.booking }, { reference: sp.booking }] },
    include: { room: true },
  });

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center p-4"><p className="text-gray-600">Réservation introuvable.</p></div>;
  }

  const roomName = locale === 'fr' ? booking.room.nameFr : booking.room.nameEn;

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          
          {/* En-tête succès */}
          <div className="bg-emerald-950 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">{t('success')}</h1>
            <p className="text-emerald-200/80">{t('successMessage')}</p>
          </div>

          <div className="p-8 md:p-10">
            {/* Code de réservation */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center mb-8">
              <p className="text-sm text-emerald-800 font-bold uppercase tracking-widest mb-2">Votre numéro de réservation</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-4xl font-mono font-bold text-emerald-950">{booking.reference || booking.id}</p>
                <CopyButton text={booking.reference || booking.id} />
              </div>
            </div>

            {/* Détails */}
            <h3 className="font-serif text-xl font-bold text-emerald-950 mb-4 border-b border-gray-100 pb-2">Récapitulatif</h3>
            <div className="space-y-3 text-sm text-gray-600 mb-8">
              <div className="flex justify-between"><span>Chambre</span><strong className="text-gray-900">{roomName}</strong></div>
              <div className="flex justify-between"><span>{t('checkin')}</span><strong className="text-gray-900">{booking.checkIn.toLocaleDateString('fr-FR')}</strong></div>
              <div className="flex justify-between"><span>{t('checkout')}</span><strong className="text-gray-900">{booking.checkOut.toLocaleDateString('fr-FR')}</strong></div>
              <div className="flex justify-between"><span>{t('guests')}</span><strong className="text-gray-900">{booking.guests} pers.</strong></div>
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                <span className="font-bold text-emerald-950">{t('total')}</span>
                <strong className="text-xl text-emerald-700">{booking.totalAmount} CHF</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link href={`/reservation/suivi?ref=${booking.reference}`} className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition">
                Suivre ma réservation
              </Link>
              <Link href="/" className="block w-full text-center bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}