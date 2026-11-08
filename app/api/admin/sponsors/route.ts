import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  if ((await cookies()).get('admin_session')?.value !== 'true') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }
  const sponsors = await prisma.sponsorRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ sponsors });
}