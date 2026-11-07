import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
    }

    const request = await prisma.bookingRequest.findUnique({
      where: { reference: ref.trim().toUpperCase() },
    });

    if (!request) {
      return NextResponse.json({ error: 'Aucune demande trouvée avec ce code.' }, { status: 404 });
    }

    return NextResponse.json({
      reference: request.reference,
      guestName: request.guestName,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      guests: request.guests,
      status: request.status,
      whatsapp: request.whatsapp,
      message: request.message
    });
    
  } catch (error: any) {
    console.error('[SUIVI API] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer.' }, { status: 500 });
  }
}