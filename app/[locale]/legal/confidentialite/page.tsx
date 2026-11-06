import { getTranslations } from 'next-intl/server';

export default async function ConfidentialitePage() {
  const t = await getTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
        {t('privacy')}
      </h1>
      
      <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">1. Collecte des données</h2>
          <p>
            Dans le cadre de la réservation de vos séjours, l'Hôtel Awaya Colline 132 collecte uniquement les données nécessaires :
            nom, prénom, adresse email, numéro de téléphone, et les informations relatives à votre séjour (dates, nombre de personnes). 
            Les données bancaires sont traitées directement par nos prestataires sécurisés (Stripe et FedaPay) et ne sont <strong>jamais</strong> stockées sur nos serveurs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">2. Utilisation de vos données</h2>
          <p>
            Vos données sont utilisées exclusivement pour :
            - Gérer votre réservation et votre séjour.
            - Vous envoyer des emails de confirmation ou d'information relatifs à votre séjour.
            - Respecter nos obligations légales et comptables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">3. Partage des données</h2>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers. 
            Elles peuvent être transmises à nos prestataires techniques (Stripe, FedaPay, hébergeur web) uniquement pour la bonne exécution de vos paiements et de votre réservation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">4. Conservation des données</h2>
          <p>
            Vos données sont conservées pendant la durée de votre séjour, puis archivées pour une durée maximale de 10 ans conformément aux obligations légales et comptables en vigueur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">5. Vos droits</h2>
          <p>
            Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. 
            Pour exercer ce droit, vous pouvez nous contacter à l'adresse : <strong>contact@awaya-colline132.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}