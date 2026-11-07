import { getTranslations } from 'next-intl/server';

export default async function CGVPage() {
  const t = await getTranslations('footer');

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-950 mb-8 pb-4 border-b border-gray-100">
            {t('cgv')}
          </h1>
          
          <div className="prose prose-emerald max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">1. Objet</h2>
              <p className="leading-relaxed">Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre l'Hôtel Awaya Colline 132 et toute personne effectuant une réservation via le site internet.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">2. Réservation et Paiement</h2>
              <p className="leading-relaxed">La réservation est confirmée dès réception du paiement (par carte bancaire via Stripe, Twint, ou Mobile Money). Le client s'engage à fournir des informations exactes lors de la réservation. Le prix total inclut les nuitées et les éventuelles taxes de séjour.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">3. Annulation et Modification</h2>
              <p className="leading-relaxed">Toute annulation doit être notifiée par écrit. Annulation gratuite jusqu'à 48 heures avant l'arrivée. Annulation à moins de 48 heures ou non-présentation (No-show) : la première nuit sera facturée.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">4. Séjour et Règlement Intérieur</h2>
              <p className="leading-relaxed">L'arrivée (Check-in) se fait à partir de 14h00 et le départ (Check-out) avant 12h00. Les clients sont tenus de respecter le calme de l'établissement et le matériel mis à leur disposition. L'hôtel est un espace non-fumeur.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">5. Droit applicable</h2>
              <p className="leading-relaxed">Les présentes conditions sont soumises au droit béninois. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}