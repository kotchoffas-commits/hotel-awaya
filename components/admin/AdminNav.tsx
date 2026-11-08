'use client';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import NotificationDrawer from './NotificationDrawer';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Tableau de bord' },
    { href: '/admin/calendar', label: 'Calendrier' },
    { href: '/admin/rooms', label: 'Chambres' },
    { href: '/admin/requests', label: 'Demandes' },
    { href: '/admin/promos', label: 'Codes Promo' },
    { href: '/admin/sponsors', label: 'Sponsors' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 mb-8 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-emerald-900">Espace Admin</span>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {links.map((link) => {
              const isActive = pathname.includes(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <NotificationDrawer />
            <Link href="/" className="text-sm text-gray-500 hover:text-emerald-700 transition hidden sm:block">
              Voir le site
            </Link>
            <a href="/api/admin/logout?locale=fr" className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition">
              Déconnexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}