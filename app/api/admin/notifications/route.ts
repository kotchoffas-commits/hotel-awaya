import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // On compte les réservations en attente
  const pendingCount = await prisma.booking.count({
    where: { status: 'PENDING' },
  });

  return NextResponse.json({ count: pendingCount });
}