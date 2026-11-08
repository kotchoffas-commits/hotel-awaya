'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function SponsorForm() {
  const t = useTranslations('sponsors.form');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: 'PARTNER',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    budget: '',
    message: '',
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setSuccess(data.reference);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">{t('success')}</h3>
        <p className="text-gray-600 mb-4">{t('successRef')} : <strong className="font-mono">{success}</strong></p>
        <p className="text-sm text-gray-500 mb-6">{t('successHint')}</p>
        <button onClick={() => router.push('/')} className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-800 transition">
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('type')}</label>
        <div className="grid grid-cols-2 gap-3">
          {['PARTNER', 'SPONSOR'].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => update('type', v)}
              className={`py-3 rounded-lg border-2 font-medium transition ${
                form.type === v
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {v === 'PARTNER' ? t('typePartner') : t('typeSponsor')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('company')} *</label>
        <input type="text" required value={form.company} onChange={(e) => update('company', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('contactName')} *</label>
          <input type="text" required value={form.contactName} onChange={(e) => update('contactName', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('email')} *</label>
          <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('phone')}</label>
          <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('website')}</label>
          <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('budget')}</label>
        <input type="text" value={form.budget} onChange={(e) => update('budget', e.target.value)}
          placeholder="ex: 500 000 FCFA"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('message')}</label>
        <textarea rows={4} value={form.message} onChange={(e) => update('message', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-emerald-700 text-white py-4 rounded-lg font-semibold hover:bg-emerald-800 disabled:bg-gray-400 transition">
        {loading ? t('sending') : t('submit')}
      </button>
    </form>
  );
}