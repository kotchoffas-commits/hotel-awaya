import { getTranslations } from 'next-intl/server';

export default async function ReviewsPage() {
  const t = await getTranslations('reviews');
  const reviews = ['review1', 'review2', 'review3'];

  const stars = (
    <div className="flex text-amber-400 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">{t('subtitle')}</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">{t('title')}</h1>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 mb-8">{t('subtitle')}</p>
          
          <div className="inline-flex flex-col items-center bg-white px-10 py-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-5xl font-bold text-emerald-950">4.9</span>
              <span className="text-gray-400 text-xl">/ 5</span>
            </div>
            {stars}
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('basedOn')}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((key, index) => (
            <div key={key} className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full animate-fade-in-up delay-${(index + 1) * 100}`}>
              {stars}
              <p className="text-gray-600 leading-relaxed italic mb-6 flex-1 text-sm">"{t(`${key}.text`)}"</p>
              <div className="flex items-center gap-3 mt-auto pt-6 border-t border-gray-100">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {t(`${key}.author`).charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-emerald-950 text-sm">{t(`${key}.author`)}</p>
                  <p className="text-xs text-gray-500 font-medium">{t(`${key}.date`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}