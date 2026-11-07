import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { z } from 'zod';
export const dynamic = 'force-dynamic';

// SchÃ©ma pour valider les donnÃ©es envoyÃ©es par le Channel Manager (Booking, Airbnb, etc.)
const schema = z.object({
  platform: z.enum(['BOOKING', 'AIRBNB', 'EXPEDIA', 'TRIP']),
  externalId: z.string(),
  roomSlug: z.string(),
  guestName: z.string(),
  guestEmail: z.string().email(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number(),
  totalAmount: z.number(),
});

export async function POST(req: NextRequest) {
  // VÃ©rification de sÃ©curitÃ© (le Channel Manager doit fournir un mot de passe secret)
  const secret = req.headers.get('x-ota-secret');
  if (secret !== process.env.OTA_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Non autorisÃ©' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // 1. On cherche la chambre correspondante
    const room = await prisma.room.findUnique({
      where: { slug: data.roomSlug },
    });

    if (!room) {
      return NextResponse.json({ error: 'Chambre introuvable sur notre systÃ¨me' }, { status: 404 });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // 2. On vÃ©rifie que la chambre n'est pas dÃ©jÃ  prise sur ces dates sur notre site
    const existing = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });

    if (existing) {
      // En vrai, on renverrait une erreur Ã  Booking pour dire "surrÃ©servation"
      return NextResponse.json({ error: 'SurrÃ©servation : La chambre est dÃ©jÃ  occupÃ©e sur ces dates' }, { status: 409 });
    }

    // 3. On enregistre la rÃ©servation venant de Booking/Airbnb
    const booking = await prisma.booking.create({
      data: {
        roomId: room.id,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        checkIn,
        checkOut,
        guests: data.guests,
        totalAmount: data.totalAmount,
        currency: 'CHF',
        status: 'CONFIRMED',
        source: data.platform,
        externalId: data.externalId,
        notes: `RÃ©servation importÃ©e automatiquement depuis ${data.platform}`,
      },
    });

    console.log(`[OTA WEBHOOK] Nouvelle rÃ©servation ${data.platform} reÃ§ue pour la chambre ${room.slug}`);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err: any) {
    console.error('[OTA WEBHOOK] Erreur:', err);
    return NextResponse.json({ error: 'DonnÃ©es invalides ou erreur serveur' }, { status: 500 });
  }
}