import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['PARTNER', 'SPONSOR']).default('PARTNER'),
  company: z.string().min(1),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const reference = 'SPO-' + Math.floor(1000 + Math.random() * 9000);
    const sponsor = await prisma.sponsorRequest.create({
      data: {
        reference, type: data.type, company: data.company,
        contactName: data.contactName, email: data.email,
        phone: data.phone || null, website: data.website || null,
        budget: data.budget || null, message: data.message || null,
        status: 'PENDING', isNotified: false,
      },
    });
    return NextResponse.json({ success: true, reference: sponsor.reference });
  } catch (err: any) {
    console.error('[SPONSOR POST] Erreur:', err);
    return NextResponse.json({ error: 'Erreur: ' + err.message }, { status: 500 });
  }
}