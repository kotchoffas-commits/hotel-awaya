import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-emerald-100/80 pt-16 pb-8 border-t border-emerald-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Colonne 1 - Marque */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-white">
                Awaya Colline 132
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Colonne 2 - Liens rapides */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">{t('quickLinks')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/chambres" className="hover:text-white transition">{tNav('rooms')}</Link></li>
              <li><Link href="/tarifs" className="hover:text-white transition">{tNav('rates')}</Link></li>
              <li><Link href="/services" className="hover:text-white transition">{tNav('services')}</Link></li>
              <li><Link href="/galerie" className="hover:text-white transition">{tNav('gallery')}</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">{tNav('faq')}</Link></li>
            </ul>
          </div>

          {/* Colonne 3 - Contact */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">{t('contactUs')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{t('address')}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{t('phone')}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Infos Développeur */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">Créé par</h4>
            <div className="text-sm space-y-1">
              <p className="font-bold text-white">Kotchoffa Serge</p>
              <p className="text-xs text-emerald-400">Développeur Web & Solutions IA</p>
              <p className="mt-3">Dassa-Zoumé, Bénin</p>
              <div className="flex gap-3 mt-3">
                <a href="https://wa.me/2290195123224" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-white transition">
                  WhatsApp
                </a>
                <span className="text-emerald-800">|</span>
                <a href="mailto:Kotchoffas@outlook.com" className="text-emerald-400 hover:text-white transition">
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {year} Awaya Colline 132 — {t('rights')}</p>
          <div className="flex gap-6">
            <Link href="/legal/cgv" className="hover:text-white transition">{t('cgv')}</Link>
            <Link href="/legal/mentions" className="hover:text-white transition">{t('mentions')}</Link>
            <Link href="/legal/confidentialite" className="hover:text-white transition">{t('privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}