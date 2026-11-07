import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const reference = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const request = await prisma.bookingRequest.create({
      data: {
        reference,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone || null,
        whatsapp: data.whatsapp || null,
        message: data.message || null,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        status: 'PENDING',
        isNotified: false,
      }
    });

    return NextResponse.json({ success: true, reference: request.reference });
  } catch (err: any) {
    console.error('[DEMANDE POST] Erreur:', err);
    return NextResponse.json({ error: `Erreur: ${err.message}` }, { status: 500 });
  }
}