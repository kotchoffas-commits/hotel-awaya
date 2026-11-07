'use client';

import { useState, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';

export default function RoomEditForm({ room, locale }: { room: any | null, locale: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isNew = !room;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialImages = room ? JSON.parse(room.images || '[]') : [];

  const [formData, setFormData] = useState({
    slug: room?.slug || '',
    nameFr: room?.nameFr || '',
    nameEn: room?.nameEn || '',
    descFr: room?.descFr || '',
    descEn: room?.descEn || '',
    basePrice: room?.basePrice?.toString() || '',
    capacity: room?.capacity?.toString() || '2',
    sizeSqm: room?.sizeSqm?.toString() || '',
    images: initialImages,
    amenitiesString: room ? JSON.parse(room.amenities || '[]').join(', ') : 'wifi, tv, ac',
    published: room?.published ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Erreur upload');

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, result.url],
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, index: number) => index !== indexToRemove),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        imagesString: formData.images.join('\n'),
      };

      const url = isNew ? '/api/admin/rooms' : `/api/admin/rooms/${room.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      router.push('/admin/rooms');
      router.refresh();
    } catch (err: any) {
      let errorMessage = err.message || 'Une erreur est survenue lors de la sauvegarde.';
      
      // On filtre les erreurs techniques pour ne pas afficher de code au gérant
      if (errorMessage.length > 100 || errorMessage.includes('Prisma') || errorMessage.includes('TypeError')) {
        console.error('Erreur technique Admin:', errorMessage);
        errorMessage = "Impossible de sauvegarder. Vérifiez que le nom de la chambre (slug) n'est pas déjà utilisé et que les champs sont corrects.";
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isNew && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant URL (Slug)</label>
          <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="ex: suite-luxe" />
          <p className="text-xs text-gray-500 mt-1">Minuscules et tirets uniquement. Exemple : chambre-deluxe</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom (FranÃƒÂ§ais)</label>
          <input type="text" name="nameFr" value={formData.nameFr} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Anglais)</label>
          <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (FranÃƒÂ§ais)</label>
          <textarea name="descFr" value={formData.descFr} onChange={handleChange} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Anglais)</label>
          <textarea name="descEn" value={formData.descEn} onChange={handleChange} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix par nuit (CHF)</label>
          <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required min="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CapacitÃƒÂ© (pers.)</label>
          <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required min="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (mÃ‚Â²)</label>
          <input type="number" name="sizeSqm" value={formData.sizeSqm} onChange={handleChange} required min="1" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Photos de la chambre</label>
        <div className="flex flex-wrap gap-4 mb-4">
          {formData.images.map((img: string, idx: number) => (
            <div key={idx} className="relative group w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={img} alt={`Room ${idx}`} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition">
            {uploading ? <span className="text-xs">Envoi...</span> : <><svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg><span className="text-xs font-medium">Ajouter</span></>}
          </button>
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Ãƒâ€°quipements (sÃƒÂ©parÃƒÂ©s par des virgules)</label>
        <input type="text" name="amenitiesString" value={formData.amenitiesString} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 text-emerald-600 rounded" />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">Publier cette chambre sur le site</label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <Link href="/admin/rooms" className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Annuler</Link>
        <button type="submit" disabled={loading || uploading} className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm">
          {loading ? 'Enregistrement...' : (isNew ? 'CrÃƒÂ©er la chambre' : 'Enregistrer les modifications')}
        </button>
      </div>
    </form>
  );
}