'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold text-emerald-950 group-hover:text-emerald-700 transition">
              Awaya Colline 132
            </span>
          </Link>

          {/* NAVIGATION DESKTOP */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/demande" className="text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm">
              Demande
            </Link>
            <Link href="/reservation" className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-700/20">
              {t('book')}
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-gray-700">
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* MENU MOBILE DÉROULANT */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-xl pb-6">
            <nav className="flex flex-col py-4 px-4 gap-1">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-gray-50 px-4 py-3 rounded-xl transition">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-gray-100 px-4 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center px-2 mb-2">
                <span className="text-sm font-medium text-gray-500">Langue</span>
                <LocaleSwitcher />
              </div>
              <Link href="/demande" onClick={() => setOpen(false)} className="w-full text-center border border-emerald-700 text-emerald-700 font-bold px-4 py-3 rounded-xl">Demande</Link>
              <Link href="/reservation" onClick={() => setOpen(false)} className="w-full text-center bg-emerald-700 text-white font-bold px-4 py-3 rounded-xl shadow-md">{t('book')}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}