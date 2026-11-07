import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { Transaction } from '@/lib/fedapay';
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
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json({ error: 'Les dates choisies sont invalides.' }, { status: 400 });
    }

    const existing = await prisma.booking.findFirst({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [{ checkIn: { lt: checkOut } }, { checkOut: { gt: checkIn } }],
      },
    });
    
    // --- DEBUG : On affiche l'ID de la réservation qui bloque ---
    if (existing) {
      return NextResponse.json({ 
        error: `BLOQUÉ PAR : ${existing.guestName} (Réf: ${existing.reference || existing.id}). Dates: ${existing.checkIn.toLocaleDateString()} au ${existing.checkOut.toLocaleDateString()}` 
      }, { status: 409 });
    }

    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
    const total = nights * room.basePrice;

    const roomCode = room.slug.split('-').pop()?.substring(0, 3).toUpperCase() || 'CH';
    let count = await prisma.booking.count({ where: { roomId: room.id } }) + 1;
    let reference = `REF-${roomCode}-${count.toString().padStart(2, '0')}`;
    
    while (await prisma.booking.findUnique({ where: { reference } })) {
      count++;
      reference = `REF-${roomCode}-${count.toString().padStart(2, '0')}`;
    }

    const booking = await prisma.booking.create({
      data: {
        reference: reference,
        roomId: room.id,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn,
        checkOut,
        guests: data.guests,
        totalAmount: total,
        currency: 'CHF',
        status: 'PENDING',
        source: 'DIRECT',
        paymentMethod: data.paymentMethod,
        notes: 'Reservation en attente de paiement',
      },
    });

    if (data.paymentMethod === 'MOBILE_MONEY') {
      const xofAmount = Math.floor(total * 655);
      const transaction = await Transaction.create({
        description: `Reservation Hotel Awaya - ${booking.reference}`,
        amount: xofAmount,
        currency: { iso: 'XOF' },
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/confirmation?booking=${booking.reference}`,
        customer: { firstname: 'Client', lastname: 'Test', email: data.guestEmail, phone_number: { number: '', country: 'bj' } }
      });
      const token = await transaction.generateToken();
      await prisma.booking.update({ where: { id: booking.id }, data: { paymentId: transaction.id.toString() } });
      return NextResponse.json({ bookingId: booking.reference, paymentUrl: token.url, total, nights });
    }

    const stripe = getStripe();
    const amountInCents = Math.round(total * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'chf',
      metadata: { bookingId: booking.id },
      payment_method_types: ['card'],
      receipt_email: data.guestEmail,
    });

    await prisma.booking.update({ where: { id: booking.id }, data: { paymentId: paymentIntent.id } });

    return NextResponse.json({ bookingId: booking.reference, clientSecret: paymentIntent.client_secret, total, nights });

  } catch (err: any) {
    return NextResponse.json({ error: 'Une erreur est survenue. Veuillez réessayer.' }, { status: 500 });
  }
}