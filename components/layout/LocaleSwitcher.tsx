'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: 'fr' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 text-sm">
      <button
        onClick={() => switchTo('fr')}
        className={`px-2.5 py-1 rounded transition ${
          locale === 'fr'
            ? 'bg-emerald-700 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <button
        onClick={() => switchTo('en')}
        className={`px-2.5 py-1 rounded transition ${
          locale === 'en'
            ? 'bg-emerald-700 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}