'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: t('home') },
    { href: '/chambres', label: t('rooms') },
    { href: '/tarifs', label: t('rates') },
    { href: '/services', label: t('services') },
    { href: '/galerie', label: t('gallery') },
    { href: '/avis', label: t('reviews') },
    { href: '/faq', label: t('faq') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO (à gauche) */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-emerald-900">
              Awaya Colline 132
            </span>
          </Link>

          {/* NAVIGATION DESKTOP (au centre) */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-700 hover:text-emerald-700 transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS DESKTOP (à droite) */}
          <div className="hidden lg:flex items-center gap-4">
            <LocaleSwitcher />
            <Link
              href="/reservation"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
            >
              {t('book')}
            </Link>
          </div>

          {/* BOUTON HAMBURGER MOBILE (à droite) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-gray-700 hover:text-emerald-700 transition"
            aria-label="Menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MENU DÉROULANT MOBILE */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="flex flex-col py-4 px-2 gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-gray-50 px-4 py-3 rounded-lg transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            
            <div className="border-t border-gray-100 p-4 space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-medium text-gray-500">Langue / Language</span>
                <LocaleSwitcher />
              </div>
              <Link
                href="/reservation"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-3 rounded-lg transition"
              >
                {t('book')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}