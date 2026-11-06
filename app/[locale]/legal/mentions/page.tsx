import { getTranslations } from 'next-intl/server';

export default async function MentionsPage() {
  const t = await getTranslations('footer');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
        {t('mentions')}
      </h1>
      
      <div className="prose prose-emerald max-w-none text-gray-700 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">1. Éditeur du site</h2>
          <p>
            Le site <strong>Hôtel Awaya Colline 132</strong> est édité par la société Awaya Hôtellerie.<br />
            Siège social : Colline 132, Bénin.<br />
            Numéro de téléphone : +229 00 00 00 00<br />
            Adresse email : contact@awaya-colline132.com<br />
            Numéro d'immatriculation (RCCM) : RB/COT/XX/XXXXX
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">2. Hébergement</h2>
          <p>
            Le site est hébergé par la société Vercel Inc.<br />
            440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.<br />
            Site web : https://vercel.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos) est la propriété exclusive de l'Hôtel Awaya Colline 132. 
            Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-emerald-800 mb-2">4. Responsabilité</h2>
          <p>
            L'Hôtel Awaya Colline 132 s'efforce de fournir des informations aussi précises que possible sur son site. 
            Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour.
          </p>
        </section>
      </div>
    </div>
  );
}