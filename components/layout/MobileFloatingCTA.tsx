'use client';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function MobileFloatingCTA() {
  const t = useTranslations('booking');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex gap-3">
      <Link href="/reservation" className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-center font-bold py-3.5 rounded-xl transition shadow-md">
        Réserver
      </Link>
      <Link href="/demande" className="flex-1 bg-white border border-emerald-700 text-emerald-700 text-center font-bold py-3.5 rounded-xl transition">
        Demande
      </Link>
    </div>
  );
}