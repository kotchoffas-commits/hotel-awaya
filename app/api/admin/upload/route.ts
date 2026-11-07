import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { writeFile, mkdir } from 'fs/promises';
export const dynamic = 'force-dynamic';
import path from 'path';
export const dynamic = 'force-dynamic';
import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // VÃ©rification de sÃ©curitÃ©
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session || session.value !== 'true') {
    return NextResponse.json({ error: 'Non autorisÃ©' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // VÃ©rifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit Ãªtre une image' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // CrÃ©er le dossier public/uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // GÃ©nÃ©rer un nom de fichier unique pour Ã©viter les doublons
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.name) || '.jpg';
    const filename = `room-${uniqueSuffix}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Sauvegarder le fichier
    await writeFile(filepath, buffer);

    // Retourner l'URL publique
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error('[UPLOAD]', error);
    return NextResponse.json({ error: 'Erreur lors de l upload' }, { status: 500 });
  }
}