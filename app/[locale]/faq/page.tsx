import { getTranslations } from 'next-intl/server';

export default async function FAQPage() {
  const t = await getTranslations('faq');

  const faqs = ['q1', 'q2', 'q3', 'q4', 'q5'];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((key) => (
            <details
              key={key}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition">
                <h2 className="font-medium text-emerald-900">
                  {t(`${key}.q`)}
                </h2>
                <span className="text-emerald-700 transition group-open:rotate-180">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {t(`${key}.a`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}