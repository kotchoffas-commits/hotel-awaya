'use client';

import { useState } from 'react';

type Props = {
  booking: any;
  roomName: string;
  onClose: () => void;
};

export default function DecisionModal({ booking, roomName, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const decide = async (status: 'CONFIRMED' | 'CANCELLED') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      onClose();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la décision');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-mono font-bold text-gray-500">{booking.reference}</p>
            <h2 className="font-serif text-xl font-bold text-emerald-900">{booking.guestName}</h2>
          </div>
          <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <div className="text-sm text-gray-700 space-y-1 mb-6">
          <p><span className="font-medium">Chambre :</span> {roomName}</p>
          <p>
            <span className="font-medium">Séjour :</span>{' '}
            {new Date(booking.checkIn).toLocaleDateString('fr-FR')} au {new Date(booking.checkOut).toLocaleDateString('fr-FR')}
          </p>
          {booking.guestEmail && <p><span className="font-medium">Email :</span> {booking.guestEmail}</p>}
          {booking.guestPhone && <p><span className="font-medium">Téléphone :</span> {booking.guestPhone}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => decide('CANCELLED')} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-medium disabled:opacity-50">
            Refuser
          </button>
          <button onClick={() => decide('CONFIRMED')} disabled={loading} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium disabled:opacity-50">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
