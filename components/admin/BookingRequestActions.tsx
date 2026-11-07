'use client';
import { useState } from 'react';

export default function BookingRequestActions({ requestId, currentStatus, guestEmail, guestName, reference, checkIn, checkOut }: any) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleAction = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, guestEmail, guestName, reference, checkIn, checkOut }),
      });
      if (res.ok) {
        setStatus(newStatus);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (e) {
      alert('Erreur lors de la mise à jour');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Décision :</label>
      <div className="relative">
        <select 
          value={status} 
          onChange={(e) => handleAction(e.target.value)}
          disabled={loading}
          className={`w-full border rounded-lg px-4 py-2.5 text-sm font-bold focus:ring-2 outline-none appearance-none cursor-pointer transition-colors ${
            status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
            status === 'REJECTED' ? 'bg-red-50 border-red-300 text-red-800' :
            status === 'WAITLIST' ? 'bg-amber-50 border-amber-300 text-amber-800' :
            status === 'CONTACTED' ? 'bg-blue-50 border-blue-300 text-blue-800' :
            'bg-gray-50 border-gray-300 text-gray-700'
          }`}
        >
          <option value="PENDING" disabled>En attente de traitement...</option>
          <option value="APPROVED">✅ Accepter (Chambre Disponible)</option>
          <option value="REJECTED">❌ Refuser (Chambre Indisponible)</option>
          <option value="WAITLIST">⏳ Mettre en liste d'attente</option>
          <option value="CONTACTED">📞 Client contacté (En cours)</option>
        </select>
        {loading && <span className="absolute right-8 top-3 text-xs text-gray-500">Envoi...</span>}
      </div>
    </div>
  );
}