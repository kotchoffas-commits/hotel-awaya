import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  if ((await cookies()).get('admin_session')?.value !== 'true') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  
  const formData = await req.formData();
  const code = formData.get('code') as string;
  const discount = parseInt(formData.get('discount') as string);

  if (code && discount) {
    await prisma.promoCode.create({ data: { code: code.toUpperCase(), discountPercent: discount } });
  }
  return NextResponse.redirect(new URL('/fr/admin/promos', req.url));
}