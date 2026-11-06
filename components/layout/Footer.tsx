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
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-emerald-100/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-emerald-100/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="text-emerald-100/60 hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
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
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>{t('email')}</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 - Newsletter & Légal */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">{t('newsletter')}</h4>
            <p className="text-sm mb-4">{t('newsletterText')}</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email" className="w-full bg-emerald-900/50 border border-emerald-800 rounded-lg px-3 py-2 text-sm text-white placeholder-emerald-100/40 focus:outline-none focus:border-emerald-500" />
              <button type="button" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Bas du footer */}
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