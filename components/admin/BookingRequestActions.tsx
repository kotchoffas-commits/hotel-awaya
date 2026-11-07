'use client';
import { useState } from 'react';

export default function BookingRequestActions({ requestId, currentStatus, guestEmail, guestName, reference, checkIn, checkOut, onActionComplete }: any) {
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
        if (onActionComplete) {
          setTimeout(onActionComplete, 1000); // Rafraîchit la liste après 1s
        } else {
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    } catch (e) {
      alert('Erreur lors de la mise à jour');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full mt-3">
      <select 
        value={status} 
        onChange={(e) => handleAction(e.target.value)}
        disabled={loading}
        className={`w-full border rounded-lg px-3 py-2 text-xs font-bold outline-none cursor-pointer ${
          status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
          status === 'REJECTED' ? 'bg-red-50 border-red-300 text-red-800' :
          status === 'WAITLIST' ? 'bg-amber-50 border-amber-300 text-amber-800' :
          status === 'CONTACTED' ? 'bg-blue-50 border-blue-300 text-blue-800' :
          'bg-gray-50 border-gray-300 text-gray-700'
        }`}
      >
        <option value="PENDING" disabled>En attente...</option>
        <option value="APPROVED">✅ Accepter (Dispo)</option>
        <option value="REJECTED">❌ Refuser (Indispo)</option>
        <option value="WAITLIST">⏳ Liste d'attente</option>
        <option value="CONTACTED">📞 Contacté</option>
      </select>
      {loading && <span className="text-[10px] text-gray-500 text-center animate-pulse">Envoi...</span>}
    </div>
  );
}