'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function SponsorActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = async (status: string) => {
    setLoading(true);
    try {
      await fetch('/api/admin/sponsors/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return <span className="text-xs text-gray-500 italic">Traitée</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => update('ACCEPTED')}
        disabled={loading}
        className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800 disabled:bg-gray-400 transition"
      >
        Accepter
      </button>
      <button
        onClick={() => update('REJECTED')}
        disabled={loading}
        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 disabled:bg-gray-200 transition"
      >
        Refuser
      </button>
    </div>
  );
}