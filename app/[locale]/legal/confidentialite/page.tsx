import { getTranslations } from 'next-intl/server';

export default async function ConfidentialitePage() {
  const t = await getTranslations('footer');

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-950 mb-8 pb-4 border-b border-gray-100">
            {t('privacy')}
          </h1>
          
          <div className="prose prose-emerald max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">1. Collecte des données</h2>
              <p className="leading-relaxed">Dans le cadre de la réservation de vos séjours, l'Hôtel Awaya Colline 132 collecte uniquement les données nécessaires : nom, prénom, adresse email, numéro de téléphone, et les informations relatives à votre séjour (dates, nombre de personnes). Les données bancaires sont traitées directement par nos prestataires sécurisés et ne sont <strong>jamais</strong> stockées sur nos serveurs.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">2. Utilisation de vos données</h2>
              <p className="leading-relaxed">Vos données sont utilisées exclusivement pour : gérer votre réservation et votre séjour, vous envoyer des emails de confirmation, et respecter nos obligations légales et comptables.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">3. Vos droits</h2>
              <p className="leading-relaxed">Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, vous pouvez nous contacter à l'adresse : <strong>contact@awaya-colline132.com</strong>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}