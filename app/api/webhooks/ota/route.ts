import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';


// SchÃƒÂ©ma pour valider les donnÃƒÂ©es envoyÃƒÂ©es par le Channel Manager (Booking, Airbnb, etc.)
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
  // VÃƒÂ©rification de sÃƒÂ©curitÃƒÂ© (le Channel Manager doit fournir un mot de passe secret)
  const secret = req.headers.get('x-ota-secret');
  if (secret !== process.env.OTA_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Non autorisÃƒÂ©' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // 1. On cherche la chambre correspondante
    const room = await prisma.room.findUnique({
      where: { slug: data.roomSlug },
    });

    if (!room) {
      return NextResponse.json({ error: 'Chambre introuvable sur notre systÃƒÂ¨me' }, { status: 404 });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // 2. On vÃƒÂ©rifie que la chambre n'est pas dÃƒÂ©jÃƒÂ  prise sur ces dates sur notre site
    const existing = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });

    if (existing) {
      // En vrai, on renverrait une erreur ÃƒÂ  Booking pour dire "surrÃƒÂ©servation"
      return NextResponse.json({ error: 'SurrÃƒÂ©servation : La chambre est dÃƒÂ©jÃƒÂ  occupÃƒÂ©e sur ces dates' }, { status: 409 });
    }

    // 3. On enregistre la rÃƒÂ©servation venant de Booking/Airbnb
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
        notes: `RÃƒÂ©servation importÃƒÂ©e automatiquement depuis ${data.platform}`,
      },
    });

    console.log(`[OTA WEBHOOK] Nouvelle rÃƒÂ©servation ${data.platform} reÃƒÂ§ue pour la chambre ${room.slug}`);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err: any) {
    console.error('[OTA WEBHOOK] Erreur:', err);
    return NextResponse.json({ error: 'DonnÃƒÂ©es invalides ou erreur serveur' }, { status: 500 });
  }
}