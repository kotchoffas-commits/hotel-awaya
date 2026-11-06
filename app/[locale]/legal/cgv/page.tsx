import { getTranslations } from 'next-intl/server';

export default async function CGVPage() {
  const t = await getTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
        {t('cgv')}
      </h1>
      
      <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre l'Hôtel Awaya Colline 132 et toute personne effectuant une réservation via le site internet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">2. Réservation et Paiement</h2>
          <p>
            La réservation est confirmée dès réception du paiement (par carte bancaire via Stripe, Twint, ou Mobile Money). 
            Le client s'engage à fournir des informations exactes lors de la réservation. Le prix total inclut les nuitées et les éventuelles taxes de séjour.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">3. Annulation et Modification</h2>
          <p>
            Toute annulation doit être notifiée par écrit. 
            - Annulation gratuite jusqu'à 48 heures avant l'arrivée.
            - Annulation à moins de 48 heures ou non-présentation (No-show) : la première nuit sera facturée.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">4. Séjour et Règlement Intérieur</h2>
          <p>
            L'arrivée (Check-in) se fait à partir de 14h00 et le départ (Check-out) avant 12h00. 
            Les clients sont tenus de respecter le calme de l'établissement et le matériel mis à leur disposition. L'hôtel est un espace non-fumeur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">5. Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit béninois. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
          </p>
        </section>
      </div>
    </div>
  );
}