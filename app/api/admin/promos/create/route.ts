import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    if ((await cookies()).get('admin_session')?.value !== 'true') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    
    const body = await req.json();
    const code = body.code;
    const discount = parseInt(body.discount);

    if (!code || !discount) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Vérifier si le code existe déjà
    const existing = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 });
    }

    const newPromo = await prisma.promoCode.create({ 
      data: { code: code.toUpperCase(), discountPercent: discount } 
    });

    return NextResponse.json(newPromo);
  } catch (error) {
    console.error('[PROMO CREATE]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}