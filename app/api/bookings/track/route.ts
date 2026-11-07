import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get('id');

  if (!bookingId) return NextResponse.json({ error: 'Numéro de réservation manquant' }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true }
  });

  if (!booking) return NextResponse.json({ error: 'Aucune réservation trouvée avec ce numéro.' }, { status: 404 });

  return NextResponse.json({
    id: booking.id,
    guestName: booking.guestName,
    roomName: booking.room.nameFr,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    totalAmount: booking.totalAmount,
    status: booking.status,
  });
}