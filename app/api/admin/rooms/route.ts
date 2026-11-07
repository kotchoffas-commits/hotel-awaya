import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const existingRoom = await prisma.room.findUnique({
      where: { slug: body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') }
    });

    if (existingRoom) {
      return NextResponse.json({ error: 'Ce nom (slug) est déjà utilisé par une autre chambre.' }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: {
        slug: body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
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

    return NextResponse.json(newRoom);
  } catch (error: any) {
    console.error('[ADMIN ROOM CREATE]', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la chambre. Vérifiez vos données.' }, { status: 500 });
  }
}