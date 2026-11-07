import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // On ne compte QUE les réservations en attente ET non notifiées
  const count = await prisma.booking.count({
    where: { 
      status: 'PENDING',
      isNotified: false 
    }
  });

  return NextResponse.json({ count });
}