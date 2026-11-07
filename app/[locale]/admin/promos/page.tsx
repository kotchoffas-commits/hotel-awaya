'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchPromos = async () => {
    try {
      const res = await fetch('/api/admin/promos/list');
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/promos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, discount }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      // Réinitialiser le formulaire et rafraîchir la liste
      setCode('');
      setDiscount('');
      fetchPromos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-emerald-900">Codes Promo</h1>
        <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-emerald-700 underline">← Retour</Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Code</th>
              <th className="px-6 py-4 font-medium text-gray-900">Réduction</th>
              <th className="px-6 py-4 font-medium text-gray-900">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Chargement...</td></tr>
            ) : promos.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Aucun code promo pour le moment.</td></tr>
            ) : (
              promos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700">{p.code}</td>
                  <td className="px-6 py-4">{p.discountPercent}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {p.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="font-medium text-gray-900 mb-4">Créer un nouveau code promo</h2>
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Code (ex: ETE2026)</label>
            <input 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())} 
              required 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase font-mono" 
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-600 mb-1">Réduction (%)</label>
            <input 
              type="number" 
              value={discount} 
              onChange={(e) => setDiscount(e.target.value)} 
              required 
              min="1" 
              max="100" 
              className="w-full border border-gray-300 rounded-lg px-3 py-2" 
            />
          </div>
          <button type="submit" disabled={submitting} className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-800 disabled:bg-gray-400 transition">
            {submitting ? 'Création...' : 'Créer'}
          </button>
        </form>
      </div>
    </div>
  );
}