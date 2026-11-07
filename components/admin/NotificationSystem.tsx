'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DecisionModal from './DecisionModal';

export default function NotificationSystem() {
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  
  // On utilise le router de next/navigation pour rafraichir sans clignoter
  const router = useRouter();

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (res.ok) setCount(data.count);
    } catch (error) {}
  };

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications/list');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
      // On marque comme lu
      await fetch('/api/admin/notifications/read', { method: 'POST' });
      setCount(0);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDrawer = () => {
    setIsOpen(true);
    fetchList();
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
    router.refresh(); // Met à jour le tableau de bord en arrière-plan
  };

  return (
    <>
      {/* LA CLOCHE */}
      <button
        onClick={handleOpenDrawer}
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
          {/* Fond sombre (cliquable pour fermer) */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleCloseDrawer}></div>
          
          {/* Le panneau qui glisse */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* En-tête du panneau */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-serif text-2xl font-bold text-emerald-900">Notifications</h2>
                <p className="text-sm text-gray-500 mt-1">{bookings.length} en attente</p>
              </div>
              <button onClick={handleCloseDrawer} className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Contenu de la liste */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <p className="text-center text-gray-500 py-10">Chargement...</p>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Vous êtes à jour !</h3>
                  <p className="text-gray-500 mt-1">Aucune nouvelle réservation.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-emerald-200 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded">En attente</span>
                      <span className="text-xs font-mono text-gray-500">{booking.reference}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{booking.guestName}</h3>
                    <p className="text-sm text-gray-600 mb-3">{booking.room.nameFr}</p>
                    <button 
                      onClick={() => setSelectedBooking(booking)} 
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium py-2 rounded-lg transition"
                    >
                      Ouvrir le dossier
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* LA FENÊTRE DE DÉCISION (Reste au-dessus du panneau) */}
      {selectedBooking && (
        <DecisionModal 
          booking={selectedBooking} 
          roomName={selectedBooking.room.nameFr} 
          onClose={() => { setSelectedBooking(null); fetchList(); }} 
        />
      )}
    </>
  );
}