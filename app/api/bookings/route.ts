import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { z } from 'zod';

const schema = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  guests: z.number().int().min(1).max(10),
  guestName: z.string().min(2),
  guestEmail: z.string().min(3),
  guestPhone: z.string().optional(),
  paymentMethod: z.enum(['STRIPE_CARD', 'TWINT', 'MOBILE_MONEY']),
  promoCode: z.string().nullable().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const room = await prisma.room.findUnique({ where: { slug: data.roomSlug } });
    if (!room) return NextResponse.json({ error: 'Chambre introuvable.' }, { status: 404 });

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    
    const existing = await prisma.booking.findFirst({
      where: { roomId: room.id, status: { in: ['CONFIRMED', 'PENDING'] }, AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }] },
    });
    if (existing) return NextResponse.json({ error: 'Chambre indisponible pour ces dates.' }, { status: 409 });

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
    let total = nights * room.basePrice;
    let promoCodeId = null;
    let discountApplied = 0;

    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: data.promoCode.toUpperCase() } });
      if (promo && promo.isActive) {
        discountApplied = (total * promo.discountPercent) / 100;
        total = total - discountApplied;
        promoCodeId = promo.id;
      }
    }

    // --- GÉNÉRATION DE LA RÉFÉRENCE COURTE (ex: REF-DEL-01) ---
    const roomCode = room.slug.split('-').pop()?.substring(0, 3).toUpperCase() || 'CH';
    let count = await prisma.booking.count({ where: { roomId: room.id } }) + 1;
    let reference = `REF-${roomCode}-${count.toString().padStart(2, '0')}`;
    
    // Sécurité anti-doublon
    while (await prisma.booking.findUnique({ where: { reference } })) {
      count++;
      reference = `REF-${roomCode}-${count.toString().padStart(2, '0')}`;
    }
    // ---------------------------------------------------------

    const booking = await prisma.booking.create({
      data: {
        reference: reference, // <-- On assigne la référence propre
        roomId: room.id, guestName: data.guestName, guestEmail: data.guestEmail, guestPhone: data.guestPhone,
        checkIn, checkOut, guests: data.guests, totalAmount: total, currency: 'CHF',
        status: 'PENDING', source: 'DIRECT', paymentMethod: data.paymentMethod,
        promoCodeId, discountApplied,
      },
    });

    const stripe = getStripe();
    const amountInCents = Math.round(total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, currency: 'chf', metadata: { bookingId: booking.id }, receipt_email: data.guestEmail,
    });

    await prisma.booking.update({ where: { id: booking.id }, data: { paymentId: paymentIntent.id } });

    return NextResponse.json({ bookingId: booking.reference, clientSecret: paymentIntent.client_secret, total, nights });
  } catch (err: any) {
    console.error('[bookings/POST]', err);
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}