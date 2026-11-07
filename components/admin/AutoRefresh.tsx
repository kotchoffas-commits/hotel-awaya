'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Toutes les 30 000 ms (30 secondes), on rafraîchit la page
    const interval = setInterval(() => {
      router.refresh();
    }, 30000);

    // On nettoie l'intervalle si l'utilisateur quitte la page
    return () => clearInterval(interval);
  }, [router]);

  return null;
}