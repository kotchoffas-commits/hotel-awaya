import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) return NextResponse.json({ error: 'Code manquant' }, { status: 400 });

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!promo || !promo.isActive) {
    return NextResponse.json({ error: 'Code promo invalide ou expiré.' }, { status: 404 });
  }

  return NextResponse.json({ valid: true, discountPercent: promo.discountPercent });
}