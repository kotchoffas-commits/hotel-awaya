'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import CopyButton from '@/components/ui/CopyButton';

export default function TrackingRequestPage() {
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequest(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/demandes/suivi?ref=${ref.trim()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRequest(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED': return { label: 'Disponible (Acceptée)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'REJECTED': return { label: 'Indisponible (Refusée)', color: 'bg-red-100 text-red-800 border-red-200' };
      case 'WAITLIST': return { label: "Liste d'attente", color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'CONTACTED': return { label: 'En cours de traitement', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      default: return { label: 'En attente de vérification', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-emerald-950 mb-2">Suivre ma demande</h1>
          <p className="text-gray-600">Entrez votre code (ex: REQ-1234) pour voir l'état de votre demande.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <input type="text" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} placeholder="Ex: REQ-1234" className="flex-1 px-4 py-3 rounded-lg focus:outline-none bg-transparent uppercase font-mono" required />
          <button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-medium transition">{loading ? 'Recherche...' : 'Rechercher'}</button>
        </form>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center mb-8">{error}</div>}

        {request && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-emerald-950 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-emerald-300 text-sm font-mono">{request.reference}</p>
                  <CopyButton text={request.reference} />
                </div>
                <h2 className="font-serif text-xl font-bold">Demande de {request.guestName}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusInfo(request.status).color.replace('bg-', 'bg-white/10 ').replace('text-', 'text-white ').replace('border-', 'border-white/20 ')}`}>
                {getStatusInfo(request.status).label}
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div><p className="text-sm text-gray-500 mb-1">Arrivée</p><p className="font-medium text-gray-900">{new Date(request.checkIn).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Départ</p><p className="font-medium text-gray-900">{new Date(request.checkOut).toLocaleDateString('fr-FR')}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Voyageurs</p><p className="font-medium text-gray-900">{request.guests} personne(s)</p></div>
              </div>

              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  {request.status === 'APPROVED' ? "La chambre est disponible ! L'hôtel va vous contacter pour finaliser." : 
                   request.status === 'REJECTED' ? "La chambre est indisponible pour ces dates. N'hésitez pas à tester d'autres dates." :
                   "L'hôtel vérifie actuellement la disponibilité. Vous recevrez un email dès qu'une décision sera prise."}
                </p>
                <Link href="/" className="inline-block mt-4 text-emerald-700 hover:text-emerald-900 font-medium underline">Retour à l'accueil</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}