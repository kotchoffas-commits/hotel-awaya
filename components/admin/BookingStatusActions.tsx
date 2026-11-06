'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingStatusActions({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      
      router.refresh(); // Recharge les données du tableau de bord
    } catch (error) {
      console.error(error);
      alert('Erreur lors du changement de statut');
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={loading}
      className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition-colors ${
        currentStatus === 'CONFIRMED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
        currentStatus === 'PENDING' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
        currentStatus === 'CANCELLED' ? 'bg-red-50 border-red-200 text-red-800' :
        'bg-gray-50 border-gray-200 text-gray-800'
      }`}
    >
      <option value="PENDING">En attente</option>
      <option value="CONFIRMED">Confirmée</option>
      <option value="COMPLETED">Terminée</option>
      <option value="CANCELLED">Annulée</option>
      <option value="NO_SHOW">No-show</option>
    </select>
  );
}