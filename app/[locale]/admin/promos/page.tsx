import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';

export default async function AdminPromosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') redirect(`/${locale}/admin/login`);

  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-emerald-900">Codes Promo</h1>
        <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:text-emerald-700 underline">← Retour</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr><th className="px-6 py-4 font-medium text-gray-900">Code</th><th className="px-6 py-4 font-medium text-gray-900">Réduction</th><th className="px-6 py-4 font-medium text-gray-900">Statut</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promos.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Aucun code promo.</td></tr>
            ) : (
              promos.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700">{p.code}</td>
                  <td className="px-6 py-4">{p.discountPercent}%</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{p.isActive ? 'Actif' : 'Inactif'}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="font-medium text-gray-900 mb-4">Créer un nouveau code promo</h2>
        <form action="/api/admin/promos/create" method="POST" className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-600 mb-1">Code (ex: ETE2026)</label>
            <input type="text" name="code" required className="w-full border border-gray-300 rounded-lg px-3 py-2 uppercase font-mono" />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-600 mb-1">Réduction (%)</label>
            <input type="number" name="discount" required min="1" max="100" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          <button type="submit" className="bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-800">Créer</button>
        </form>
      </div>
    </div>
  );
}