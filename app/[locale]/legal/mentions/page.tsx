import { getTranslations } from 'next-intl/server';

export default async function MentionsPage() {
  const t = await getTranslations('footer');

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-950 mb-8 pb-4 border-b border-gray-100">
            {t('mentions')}
          </h1>
          
          <div className="prose prose-emerald max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">1. Éditeur du site</h2>
              <p className="leading-relaxed">Le site <strong>Hôtel Awaya Colline 132</strong> est édité par la société Awaya Hôtellerie.<br/>Siège social : Colline 132, Bénin.<br/>Numéro de téléphone : +229 00 00 00 00<br/>Adresse email : contact@awaya-colline132.com</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">2. Hébergement</h2>
              <p className="leading-relaxed">Le site est hébergé par la société Railway.<br/>Site web : https://railway.app</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-emerald-900 mb-3">3. Propriété intellectuelle</h2>
              <p className="leading-relaxed">L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de l'Hôtel Awaya Colline 132. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}