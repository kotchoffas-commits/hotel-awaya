import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import CalendarView from '@/components/admin/CalendarView';

export default async function AdminCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if ((await cookies()).get('admin_session')?.value !== 'true') redirect(`/${locale}/admin/login`);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-emerald-900">Calendrier des réservations</h1>
          <p className="text-gray-500 text-sm mt-1">Vue globale de l'occupation de l'hôtel</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-emerald-700 bg-gray-100 px-4 py-2 rounded-lg">
          ← Retour au tableau de bord
        </Link>
      </div>

      <CalendarView />
    </div>
  );
}