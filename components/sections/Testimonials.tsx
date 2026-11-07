import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('reviews');

  const reviews = [
    { author: "Sophie M.", date: "Octobre 2026", text: "Un séjour magnifique ! L'hôtel est superbe, le personnel est aux petits soins et la vue sur la colline est à couper le souffle." },
    { author: "Jean-Pierre D.", date: "Septembre 2026", text: "Chambre très propre, literie excellente. Le Wi-Fi fonctionne parfaitement, ce qui était important pour mon travail." },
    { author: "Amélie T.", date: "Août 2026", text: "Nous avons passé un week-end en famille. Les enfants ont adoré la piscine. Le service de navette a été très pratique." }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-emerald-600 font-semibold tracking-widest uppercase text-xs mb-3 block">{t('testimonialsSubtitle')}</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-emerald-950 mb-4">{t('testimonialsTitle')}</h2>
          <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className={`bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}>
              <div className="flex text-amber-400 mb-4">
                {[1,2,3,4,5].map(star => (
                  <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{review.author}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}