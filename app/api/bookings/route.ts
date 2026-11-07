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
    if (existing) return NextResponse.json({ error: 'Chambre indisponible.' }, { status: 409 });

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
    let total = nights * room.basePrice;
    let promoCodeId = null;
    let discountApplied = 0;

    // --- VÉRIFICATION DU CODE PROMO ---
    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: data.promoCode.toUpperCase() } });
      if (promo && promo.isActive) {
        discountApplied = (total * promo.discountPercent) / 100;
        total = total - discountApplied;
        promoCodeId = promo.id;
      }
    }

    const booking = await prisma.booking.create({
      data: {
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

    return NextResponse.json({ bookingId: booking.id, clientSecret: paymentIntent.client_secret, total, nights });
  } catch (err: any) {
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}