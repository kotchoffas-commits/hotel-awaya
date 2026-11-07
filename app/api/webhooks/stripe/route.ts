import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { sendConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Signature ou secret manquant' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[WEBHOOK STRIPE] Erreur de signature:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
        include: { room: true }
      });
      
      console.log('[WEBHOOK STRIPE] Reservation confirmee:', bookingId);

      // On envoie l'email de confirmation
      const roomName = booking.room.nameFr;
      await sendConfirmationEmail(booking, roomName);
    }
  }

  return NextResponse.json({ received: true });
}