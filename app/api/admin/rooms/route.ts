import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  // VÃƒÂ©rification de sÃƒÂ©curitÃƒÂ©
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisÃƒÂ©' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // VÃƒÂ©rifier si le slug existe dÃƒÂ©jÃƒÂ 
    const existingRoom = await prisma.room.findUnique({
      where: { slug: body.slug }
    });

    if (existingRoom) {
      return NextResponse.json({ error: 'Ce slug est dÃƒÂ©jÃƒÂ  utilisÃƒÂ© par une autre chambre' }, { status: 400 });
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
    return NextResponse.json({ error: 'Erreur lors de la crÃƒÂ©ation de la chambre' }, { status: 500 });
  }
}