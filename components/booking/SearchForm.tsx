'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function SearchForm() {
  const t = useTranslations('booking');
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/reservation?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 border border-white/20"
    >
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">
          {t('checkin')}
        </label>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">
          {t('checkout')}
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          required
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block ml-1">
          {t('guests')}
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} {n > 1 ? 'personnes' : 'personne'}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl px-6 py-3.5 text-sm transition shadow-lg shadow-emerald-700/30"
        >
          {t('search')}
        </button>
      </div>
    </form>
  );
}