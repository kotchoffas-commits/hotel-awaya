import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma pour valider les données envoyées par le Channel Manager (Booking, Airbnb, etc.)
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
  // Vérification de sécurité (le Channel Manager doit fournir un mot de passe secret)
  const secret = req.headers.get('x-ota-secret');
  if (secret !== process.env.OTA_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // 1. On cherche la chambre correspondante
    const room = await prisma.room.findUnique({
      where: { slug: data.roomSlug },
    });

    if (!room) {
      return NextResponse.json({ error: 'Chambre introuvable sur notre système' }, { status: 404 });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    // 2. On vérifie que la chambre n'est pas déjà prise sur ces dates sur notre site
    const existing = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });

    if (existing) {
      // En vrai, on renverrait une erreur à Booking pour dire "surréservation"
      return NextResponse.json({ error: 'Surréservation : La chambre est déjà occupée sur ces dates' }, { status: 409 });
    }

    // 3. On enregistre la réservation venant de Booking/Airbnb
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
        notes: `Réservation importée automatiquement depuis ${data.platform}`,
      },
    });

    console.log(`[OTA WEBHOOK] Nouvelle réservation ${data.platform} reçue pour la chambre ${room.slug}`);

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err: any) {
    console.error('[OTA WEBHOOK] Erreur:', err);
    return NextResponse.json({ error: 'Données invalides ou erreur serveur' }, { status: 500 });
  }
}