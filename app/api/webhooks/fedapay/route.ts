import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { Webhook } from 'fedapay';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('x-fedapay-signature');
  const endpointSecret = process.env.FEDAPAY_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('[WEBHOOK FEDAPAY] Signature ou secret manquant');
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  let event: any;
  try {
    // VÃ©rification de la signature avec le corps brut
    event = Webhook.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error('[WEBHOOK FEDAPAY] Signature invalide:', err.message);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  // FedaPay utilise event.name
  if (event.name === 'transaction.approved' || event.name === 'transaction.successful') {
    const transactionId = event.entity?.id;
    if (transactionId) {
      const booking = await prisma.booking.findFirst({
        where: { paymentId: transactionId.toString() }
      });
      if (booking) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'CONFIRMED' }
        });
        console.log(`[WEBHOOK FEDAPAY] RÃ©servation ${booking.id} confirmÃ©e !`);
      }
    }
  }

  return NextResponse.json({ received: true });
}