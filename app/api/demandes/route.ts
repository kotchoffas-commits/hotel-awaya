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
    
    // 1. Validation des données
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides. Vérifiez vos dates et votre email.' }, { status: 400 });
    }
    const data = parsed.data;

    // 2. Génération du code de demande (ex: REQ-1234)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const reference = `REQ-${randomCode}`;

    // 3. Création dans la base
    const request = await prisma.bookingRequest.create({
      data: {
        reference,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        roomSlug: data.roomSlug,
        status: 'PENDING',
        isNotified: false,
      }
    });

    return NextResponse.json({ success: true, reference: request.reference });
    
  } catch (err: any) {
    console.error('[DEMANDE POST] ERREUR COMPLETE:', err);
    
    // Si l'erreur est liée à Prisma (ex: table manquante)
    if (err.code === 'P2021' || err.message?.includes('does not exist')) {
      return NextResponse.json({ 
        error: 'La base de donnees nest pas a jour. Contactez l administrateur.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Une erreur est survenue lors de lenvoi. Veuillez reessayer.' 
    }, { status: 500 });
  }
}