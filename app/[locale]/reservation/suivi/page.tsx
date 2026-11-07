'use client';

import { useState } from 'react';

export default function TrackingPage() {
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBooking(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/track?ref=${ref.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooking(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-emerald-950 mb-2">Suivre ma réservation</h1>
          <p className="text-gray-600">Entrez votre numéro de réservation pour voir son statut.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="Ex: REF-DEL-01"
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none bg-transparent uppercase font-mono"
            required
          />
          <button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition">
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center mb-8">{error}</div>}

        {booking && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-emerald-950 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-emerald-300 text-sm mb-1">{booking.reference}</p>
                <h2 className="font-serif text-xl font-bold">{booking.roomName}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-white/10 text-white border-white/20'}`}>
                {booking.status === 'CONFIRMED' ? 'Confirmée' : booking.status === 'PENDING' ? 'En attente' : booking.status === 'CANCELLED' ? 'Annulée' : 'Terminée'}
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Client</p>
                  <p className="font-medium text-gray-900">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Voyageurs</p>
                  <p className="font-medium text-gray-900">{booking.guests} personne(s)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Arrivée</p>
                  <p className="font-medium text-gray-900">{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Départ</p>
                  <p className="font-medium text-gray-900">{new Date(booking.checkOut).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-500 mb-3 text-center">Progression de votre réservation</p>
                <div className="flex items-center justify-between relative max-w-sm mx-auto">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10 rounded"></div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-2">✓</div>
                    <span className="text-xs font-medium">Créée</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${['CONFIRMED', 'COMPLETED'].includes(booking.status) ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {['CONFIRMED', 'COMPLETED'].includes(booking.status) ? '✓' : '2'}
                    </div>
                    <span className="text-xs font-medium">Confirmée</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${booking.status === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                      {booking.status === 'COMPLETED' ? '✓' : '3'}
                    </div>
                    <span className="text-xs font-medium">Terminée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}