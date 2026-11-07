'use client';

import { useEffect, useState } from 'react';

export default function AutoRefresh() {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const refreshData = () => {
      setLastUpdated(new Date().toLocaleTimeString('fr-FR'));
      // On force le navigateur à recharger complètement la page
      setTimeout(() => {
        window.location.reload();
      }, 100);
    };

    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="no-print fixed bottom-4 right-4 bg-emerald-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      {lastUpdated ? `Actualisé à ${lastUpdated}` : 'Mise à jour auto (30s)'}
    </div>
  );
}