'use client';

import { useState, useEffect } from 'react';
import BookingRequestActions from './BookingRequestActions';
import { Link } from '@/i18n/navigation';

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<{ requests: any[], bookings: any[] }>({ requests: [], bookings: [] });
  const [loading, setLoading] = useState(false);

  // Récupérer le nombre de notifications non lues
  const fetchCount = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const resData = await res.json();
        setCount(resData.count);
      }
    } catch (e) {}
  };

  // Récupérer la liste complète
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications/list');
      if (res.ok) {
        const resData = await res.json();
        setData(resData);
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setCount(0); // Effacer le badge visuellement
    fetchList(); // Charger la liste
    fetch('/api/admin/notifications/read', { method: 'POST' }); // Marquer comme lu
  };

  const totalItems = data.requests.length + data.bookings.length;

  return (
    <>
      {/* L'ICÔNE DE LA CLOCHE */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
        title="Centre de notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-bounce">
            {count}
          </span>
        )}
      </button>

      {/* LE PANNEAU LATÉRAL (DRAWER) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fond sombre */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panneau coulissant */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            
            {/* En-tête du panneau */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="font-serif text-xl font-bold text-emerald-900">Notifications</h2>
                <p className="text-xs text-gray-500">{totalItems} en attente de traitement</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Contenu scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <p className="text-center text-gray-500 text-sm py-10">Chargement...</p>
              ) : totalItems === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Tout est à jour !</h3>
                  <p className="text-xs text-gray-500">Aucune nouvelle demande ou réservation.</p>
                </div>
              ) : (
                <>
                  {/* SECTION DEMANDES */}
                  {data.requests.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Demandes de dispo</h3>
                      <div className="space-y-3">
                        {data.requests.map(req => (
                          <div key={req.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Demande</span>
                              <span className="text-xs font-mono font-bold text-emerald-700">{req.reference}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">{req.guestName}</h4>
                            <p className="text-xs text-gray-500">{req.guestEmail}</p>
                            <p className="text-xs font-medium text-gray-800 mt-2 bg-gray-50 p-2 rounded">
                              Du {new Date(req.checkIn).toLocaleDateString('fr-FR')} au {new Date(req.checkOut).toLocaleDateString('fr-FR')} ({req.guests} pers.)
                            </p>
                            <BookingRequestActions 
                              requestId={req.id} 
                              currentStatus={req.status} 
                              guestEmail={req.guestEmail} 
                              guestName={req.guestName} 
                              reference={req.reference} 
                              checkIn={req.checkIn} 
                              checkOut={req.checkOut} 
                              onActionComplete={() => {
                                fetchCount();
                                fetchList();
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION RÉSERVATIONS */}
                  {data.bookings.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Réservations (Paiement en attente)</h3>
                      <div className="space-y-3">
                        {data.bookings.map(b => (
                          <div key={b.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Réservation</span>
                              <span className="text-xs font-mono font-bold text-emerald-700">{b.reference}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">{b.guestName}</h4>
                            <p className="text-xs text-gray-500">{b.room.nameFr}</p>
                            <Link href="/admin/dashboard" className="mt-3 block text-center bg-gray-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-800 transition">
                              Gérer sur le tableau de bord
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}