import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // On crÃ©e la rÃ©ponse et on installe le cookie de session
    const res = NextResponse.json({ success: true });
    
    res.cookies.set('admin_session', 'true', {
      httpOnly: true, // EmpÃªche le vol du cookie par JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // Expire dans 24 heures
      path: '/',
    });

    return res;
  } catch (err: any) {
    console.error('[ADMIN LOGIN]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}