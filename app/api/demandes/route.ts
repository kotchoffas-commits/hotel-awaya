import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().min(1),
  roomSlug: z.string().optional().nullable(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validation des données (Zod)
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      console.error('[DEMANDE POST] Zod Error:', parsed.error.issues);
      return NextResponse.json({ 
        error: `Données invalides : ${parsed.error.issues.map(i => i.message).join(', ')}` 
      }, { status: 400 });
    }
    const data = parsed.data;

    // 2. Génération du code de demande
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const reference = `REQ-${randomCode}`;

    // 3. Création dans la base (Prisma)
    const request = await prisma.bookingRequest.create({
      data: {
        reference,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone || null,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        roomSlug: data.roomSlug || null,
        status: 'PENDING',
        isNotified: false,
      }
    });

    return NextResponse.json({ success: true, reference: request.reference });
    
  } catch (err: any) {
    console.error('[DEMANDE POST] ERREUR COMPLETE:', err);
    
    // On renvoie l'erreur exacte pour comprendre le problème
    return NextResponse.json({ 
      error: `Erreur technique : ${err.message || 'Inconnue'}` 
    }, { status: 500 });
  }
}