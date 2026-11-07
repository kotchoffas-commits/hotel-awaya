'use client';

import { useState, useEffect } from 'react';
import DecisionModal from './DecisionModal';

export default function NotificationDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      // On marque comme lu dès l'ouverture
      fetch('/api/admin/notifications/read', { method: 'POST' });
      
      // On charge la liste
      const fetchList = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/admin/notifications/list');
          if (res.ok) setBookings(await res.json());
        } catch (e) {}
        setLoading(false);
      };
      fetchList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Fond sombre (Backdrop) */}
      <div 
        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panneau latéral */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-emerald-900">Notifications</h2>
            <p className="text-xs text-gray-500 mt-1">Réservations en attente</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Liste des notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Chargement...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <p className="text-gray-500">Vous êtes à jour !</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl hover:bg-white hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">En attente</span>
                  <span className="text-xs font-mono text-gray-400">{new Date(booking.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <h3 className="font-bold text-emerald-950">{booking.guestName}</h3>
                <p className="text-xs text-gray-500 mt-1">{booking.room.nameFr} • {new Date(booking.checkIn).toLocaleDateString('fr-FR')}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-bold text-emerald-700">{booking.totalAmount} CHF</span>
                  <button 
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    Gérer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pop-up de décision par-dessus le panneau */}
      {selectedBooking && (
        <DecisionModal 
          booking={selectedBooking} 
          roomName={selectedBooking.room.nameFr} 
          onClose={() => { 
            setSelectedBooking(null); 
            // On actualise la liste après une décision
            fetch('/api/admin/notifications/list').then(r => r.json()).then(d => setBookings(d));
          }} 
        />
      )}
    </>
  );
}