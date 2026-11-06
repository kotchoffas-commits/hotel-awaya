import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/navigation';
import RoomEditForm from '@/components/admin/RoomEditForm';

export default async function AdminRoomEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'true') {
    redirect(`/${locale}/admin/login`);
  }

  const room = await prisma.room.findUnique({
    where: { id },
  });

  if (!room) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/admin/rooms" className="text-sm text-emerald-700 hover:text-emerald-900 mb-4 inline-block">
          ← Retour à la liste
        </Link>
        <h1 className="font-serif text-3xl font-bold text-emerald-900">
          Modifier : {locale === 'fr' ? room.nameFr : room.nameEn}
        </h1>
      </div>

      <RoomEditForm room={room} locale={locale} />
    </div>
  );
}