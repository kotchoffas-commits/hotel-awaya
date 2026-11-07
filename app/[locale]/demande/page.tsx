'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import CopyButton from '@/components/ui/CopyButton';

export default function DemandePage() {
  const [formData, setFormData] = useState({
    guestName: '', guestEmail: '', guestPhone: '', whatsapp: '', message: '', checkIn: '', checkOut: '', guests: 2
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let data: any = {};
      
      try { data = text ? JSON.parse(text) : {}; } 
      catch (parseError) { throw new Error(`Erreur serveur (${res.status}).`); }

      if (!res.ok) throw new Error(data.error || `Erreur (${res.status})`);
      setSuccess(data.reference);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white border border-emerald-100 rounded-3xl p-10 text-center shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="font-serif text-3xl font-bold text-emerald-900 mb-2">Demande envoyée !</h2>
          <p className="text-gray-600 mb-8">Notre équipe vérifie la disponibilité et vous répondra très vite par email.</p>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8">
            <p className="text-xs text-emerald-800 uppercase tracking-widest font-bold mb-2">Votre code de suivi</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-mono font-bold text-emerald-700">{success}</p>
              <CopyButton text={success} />
            </div>
          </div>

          <div className="space-y-3">
            <Link href={`/demande/suivi?ref=${success}`} className="block w-full bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl hover:bg-emerald-800 transition">Suivre ma demande</Link>
            <Link href="/" className="block w-full bg-white border border-gray-200 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex justify-end mb-6">
          <Link href="/demande/suivi" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-5 py-2.5 rounded-xl transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Suivre ma demande existante
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-emerald-900 mb-4">Demande de disponibilité</h1>
          <p className="text-gray-600 max-w-lg mx-auto">Vous préférez ne pas payer en ligne ? Envoyez-nous vos dates et nous vous confirmerons la disponibilité sous 24h.</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-emerald-900 border-b border-gray-100 pb-2">1. Vos coordonnées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Nom complet" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
              <input type="email" required placeholder="Adresse email" value={formData.guestEmail} onChange={e => setFormData({...formData, guestEmail: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
              <input type="tel" placeholder="Téléphone" value={formData.guestPhone} onChange={e => setFormData({...formData, guestPhone: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
              <input type="tel" placeholder="Numéro WhatsApp" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-emerald-900 border-b border-gray-100 pb-2 mt-8">2. Votre séjour</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1 ml-1">Date d'arrivée</label>
                <input type="date" required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1 ml-1">Date de départ</label>
                <input type="date" required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1 ml-1">Nombre de voyageurs</label>
              <select value={formData.guests} onChange={e => setFormData({...formData, guests: Number(e.target.value)})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition">
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} personne(s)</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-emerald-900 border-b border-gray-100 pb-2 mt-8">3. Message (Optionnel)</h3>
            <textarea 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value})} 
              placeholder="Avez-vous des demandes particulières ? (Arrivée tardive, lit bébé, allergie, etc.)" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition" 
              rows={3}
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-emerald-700/20 mt-6 flex justify-center items-center gap-2">
            {loading ? 'Envoi en cours...' : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                Envoyer ma demande
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}