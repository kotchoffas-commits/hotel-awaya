'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import DecisionModal from '@/components/admin/DecisionModal';

export default function NotificationsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/notifications/list');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    fetch('/api/admin/notifications/read', { method: 'POST' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900">Centre de notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Réservations en attente de traitement</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-emerald-700 bg-gray-100 px-4 py-2 rounded-lg">
          ← Retour au tableau de bord
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900">Vous êtes à jour !</h2>
          <p className="text-gray-500 mt-2">Aucune nouvelle réservation en attente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-emerald-300 transition">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">En attente</span>
                  <span className="text-xs font-mono font-bold text-gray-500">{booking.reference}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{booking.guestName}</h3>
                <p className="text-sm text-gray-600">{booking.room.nameFr} • {new Date(booking.checkIn).toLocaleDateString('fr-FR')} au {new Date(booking.checkOut).toLocaleDateString('fr-FR')}</p>
              </div>
              <button onClick={() => setSelectedBooking(booking)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2.5 rounded-lg transition shadow-sm whitespace-nowrap">
                Ouvrir le dossier
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <DecisionModal 
          booking={selectedBooking} 
          roomName={selectedBooking.room.nameFr} 
          onClose={() => { setSelectedBooking(null); fetchPending(); }} 
        />
      )}
    </div>
  );
}