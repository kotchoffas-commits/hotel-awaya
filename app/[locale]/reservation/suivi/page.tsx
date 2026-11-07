'use client';
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

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
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-emerald-950 mb-2">Suivre ma réservation</h1>
          <p className="text-gray-600">Entrez votre code pour voir l'état de votre séjour.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <input type="text" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} placeholder="Ex: REF-DEL-01" className="flex-1 px-4 py-3 rounded-xl focus:outline-none bg-gray-50 font-mono uppercase" required />
          <button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold transition">{loading ? '...' : 'Rechercher'}</button>
        </form>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center mb-8">{error}</div>}

        {booking && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="bg-emerald-950 p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-emerald-400 text-sm mb-1 font-mono">{booking.reference}</p>
                <h2 className="font-serif text-2xl font-bold">{booking.roomName}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}`}>
                {booking.status === 'CONFIRMED' ? 'Confirmée' : booking.status === 'PENDING' ? 'En attente' : booking.status}
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div><p className="text-sm text-gray-500 mb-1">Client</p><p className="font-bold text-gray-900">{booking.guestName}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Voyageurs</p><p className="font-bold text-gray-900">{booking.guests} pers.</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Arrivée</p><p className="font-bold text-gray-900">{new Date(booking.checkIn).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Départ</p><p className="font-bold text-gray-900">{new Date(booking.checkOut).toLocaleDateString('fr-FR')}</p></div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 text-center">Progression</p>
                <div className="flex items-center justify-between relative max-w-md mx-auto">
                  <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -z-10 rounded-full"></div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-2 font-bold shadow-md">✓</div>
                    <span className="text-xs font-bold text-gray-900">Créée</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold shadow-sm ${['CONFIRMED', 'COMPLETED'].includes(booking.status) ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {['CONFIRMED', 'COMPLETED'].includes(booking.status) ? '✓' : '2'}
                    </div>
                    <span className="text-xs font-bold text-gray-500">Confirmée</span>
                  </div>
                  <div className="flex flex-col items-center bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold shadow-sm ${booking.status === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {booking.status === 'COMPLETED' ? '✓' : '3'}
                    </div>
                    <span className="text-xs font-bold text-gray-500">Terminée</span>
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