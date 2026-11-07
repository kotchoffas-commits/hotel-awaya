import { useTranslations } from 'next-intl';

export default function WhyUs() {
  const features = [
    {
      title: "Emplacement Idéal",
      desc: "Situé au cœur de la colline, offrant une vue imprenable et un calme absolu.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    },
    {
      title: "Confort Premium",
      desc: "Des chambres spacieuses équipées de literie haut de gamme pour un sommeil parfait.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    },
    {
      title: "Service Personnalisé",
      desc: "Notre équipe est disponible 24h/24 pour répondre à toutes vos demandes.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    }
  ];

  return (
    <section className="py-24 bg-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">L'Expérience Awaya</h2>
          <p className="text-emerald-200/70 max-w-2xl mx-auto">Bien plus qu'un séjour, un moment d'exception au cœur de la colline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition duration-300 animate-fade-in-up delay-${(i + 1) * 100}`}>
              <div className="w-14 h-14 mx-auto bg-emerald-600 text-white rounded-full flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-emerald-100/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}