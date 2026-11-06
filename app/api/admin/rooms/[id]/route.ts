import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        nameFr: body.nameFr,
        nameEn: body.nameEn,
        descFr: body.descFr,
        descEn: body.descEn,
        basePrice: parseFloat(body.basePrice),
        capacity: parseInt(body.capacity),
        sizeSqm: parseInt(body.sizeSqm),
        images: JSON.stringify(body.imagesString.split('\n').map((s: string) => s.trim()).filter(Boolean)),
        amenities: JSON.stringify(body.amenitiesString.split(',').map((s: string) => s.trim()).filter(Boolean)),
        published: body.published,
      },
    });
    return NextResponse.json(updatedRoom);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await params;
  try {
    // On supprime d'abord les réservations liées pour éviter les erreurs de clé étrangère
    await prisma.booking.deleteMany({ where: { roomId: id } });
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}