import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  if ((await cookies()).get('admin_session')?.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING', isNotified: false } });
  const pendingRequests = await prisma.bookingRequest.count({ where: { status: 'PENDING', isNotified: false } });

  return NextResponse.json({ count: pendingBookings + pendingRequests });
}