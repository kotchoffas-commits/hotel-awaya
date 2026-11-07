import { getTranslations } from 'next-intl/server';

export default async function FAQPage() {
  const t = await getTranslations('faq');
  const faqs = ['q1', 'q2', 'q3', 'q4', 'q5'];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">Aide</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">{t('title')}</h1>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </header>

        <div className="space-y-4">
          {faqs.map((key, index) => (
            <details key={key} className={`bg-white border border-gray-200 rounded-2xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in-up delay-${(index + 1) * 100}`}>
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                <h2 className="font-bold text-emerald-950 text-lg pr-4">{t(`${key}.q`)}</h2>
                <span className="text-emerald-700 transition group-open:rotate-180 bg-emerald-50 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                {t(`${key}.a`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}