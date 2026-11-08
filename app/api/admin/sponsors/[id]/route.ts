import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if ((await cookies()).get('admin_session')?.value !== 'true') {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await req.json();
  const sponsor = await prisma.sponsorRequest.update({
    where: { id },
    data: { status, isNotified: true },
  });
  return NextResponse.json({ success: true, sponsor });
}