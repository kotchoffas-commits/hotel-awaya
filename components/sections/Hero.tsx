import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SearchForm from '@/components/booking/SearchForm';

export default function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Image de fond (URL d'origine fiable) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80)',
        }}
      />
      {/* Overlay dégradé pour la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        <span className="text-emerald-300 font-semibold tracking-[0.2em] uppercase text-sm mb-6 block">
          Hôtel Awaya Colline 132
        </span>

        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight max-w-4xl">
          {t('heroTitle')}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12">
          {t('heroSubtitle')}
        </p>

        {/* Formulaire de recherche flottant */}
        <div className="w-full max-w-4xl mx-auto">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}