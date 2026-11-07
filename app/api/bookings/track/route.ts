import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');

  if (!ref) return NextResponse.json({ error: 'Référence manquante' }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { reference: ref.trim().toUpperCase() },
    include: { room: true }
  });

  if (!booking) return NextResponse.json({ error: 'Aucune réservation trouvée avec cette référence.' }, { status: 404 });

  return NextResponse.json({
    reference: booking.reference,
    guestName: booking.guestName,
    roomName: booking.room.nameFr,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    totalAmount: booking.totalAmount,
    status: booking.status,
  });
}