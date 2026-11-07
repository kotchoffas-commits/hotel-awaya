import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) return NextResponse.json({ error: 'Code manquant' }, { status: 400 });

    console.log(`[PROMO API] Recherche du code : "${code}"`);

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() }
    });

    if (!promo) {
      console.log(`[PROMO API] Code introuvable : "${code}"`);
      return NextResponse.json({ error: 'Code promo invalide.' }, { status: 404 });
    }

    if (!promo.isActive) {
      console.log(`[PROMO API] Code inactif : "${code}"`);
      return NextResponse.json({ error: 'Ce code promo n\'est plus actif.' }, { status: 400 });
    }

    console.log(`[PROMO API] Code valide : "${code}" (-${promo.discountPercent}%)`);
    return NextResponse.json({ valid: true, discountPercent: promo.discountPercent });
    
  } catch (error) {
    console.error('[PROMO API] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}