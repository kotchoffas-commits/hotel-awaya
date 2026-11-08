import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SponsorActions from '@/components/admin/SponsorActions';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') {
    redirect('/' + locale + '/admin/login');
  }
  const t = await getTranslations('sponsors');

  const sponsors = await prisma.sponsorRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const pending = sponsors.filter((s) => s.status === 'PENDING');
  const others = sponsors.filter((s) => s.status !== 'PENDING');

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-emerald-950 mb-2">Demandes de partenariat</h1>
      <p className="text-gray-500 mb-8">{sponsors.length} demande(s) — {pending.length} en attente</p>

      {sponsors.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500">Aucune demande pour l&apos;instant.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-orange-700 mb-4">En attente ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((s) => (
              <SponsorCard key={s.id} sponsor={s} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Traitées ({others.length})</h2>
          <div className="space-y-4">
            {others.map((s) => (
              <SponsorCard key={s.id} sponsor={s} treated />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Sponsor = {
  id: string;
  reference: string;
  type: string;
  company: string;
  contactName: string;
  email: string;
  phone: string | null;
  website: string | null;
  budget: string | null;
  message: string | null;
  status: string;
  createdAt: Date;
};

function SponsorCard({ sponsor, treated = false }: { sponsor: Sponsor; treated?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-6 border ${treated ? 'border-gray-200 opacity-70' : 'border-orange-200 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 mr-2">
            {sponsor.type === 'SPONSOR' ? 'SPONSOR' : 'PARTENAIRE'}
          </span>
          <span className="font-mono text-xs text-gray-500">{sponsor.reference}</span>
          <h3 className="text-xl font-bold text-emerald-950 mt-2">{sponsor.company}</h3>
          <p className="text-sm text-gray-500">{new Date(sponsor.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
        <div><span className="text-gray-500">Contact :</span> <strong>{sponsor.contactName}</strong></div>
        <div><span className="text-gray-500">Email :</span> <a href={'mailto:' + sponsor.email} className="text-emerald-700 hover:underline">{sponsor.email}</a></div>
        {sponsor.phone && <div><span className="text-gray-500">Téléphone :</span> <a href={'tel:' + sponsor.phone} className="text-emerald-700 hover:underline">{sponsor.phone}</a></div>}
        {sponsor.website && <div><span className="text-gray-500">Site :</span> <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">{sponsor.website}</a></div>}
        {sponsor.budget && <div><span className="text-gray-500">Budget :</span> <strong>{sponsor.budget}</strong></div>}
      </div>
      {sponsor.message && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-4 italic">
          « {sponsor.message} »
        </div>
      )}
      {!treated && <SponsorActions id={sponsor.id} currentStatus={sponsor.status} />}
    </div>
  );
}