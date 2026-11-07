import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { sendBookingStatusEmail } from '@/lib/email';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;

  try {
    const { status } = await req.json();
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });

    const oldBooking = await prisma.booking.findUnique({ where: { id } });
    if (!oldBooking) return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { room: true }
    });

    if (oldBooking.status !== status && ['CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      await sendBookingStatusEmail(updatedBooking, updatedBooking.room.nameFr, status);
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}