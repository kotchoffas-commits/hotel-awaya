import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if ((await cookies()).get('admin_session')?.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  // On définit la période du mois
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

  // On récupère toutes les réservations qui chevauchent ce mois
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ['CONFIRMED', 'PENDING'] },
      AND: [
        { checkIn: { lte: endOfMonth } },
        { checkOut: { gte: startOfMonth } }
      ]
    },
    include: { room: true }
  });

  return NextResponse.json({ bookings });
}