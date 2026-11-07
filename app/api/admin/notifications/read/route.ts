import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';
export async function POST() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_session')?.value !== 'true') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  await prisma.booking.updateMany({ where: { isNotified: false }, data: { isNotified: true } });
  return NextResponse.json({ success: true });
}