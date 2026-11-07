import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, guestEmail, guestName, reference, checkIn, checkOut } = await req.json();

  try {
    await prisma.bookingRequest.update({ where: { id }, data: { status } });

    const checkInFmt = new Date(checkIn).toLocaleDateString('fr-FR');
    const checkOutFmt = new Date(checkOut).toLocaleDateString('fr-FR');

    let subject = '';
    let htmlContent = '';

    if (status === 'APPROVED') {
      subject = `Bonne nouvelle : Chambre disponible - ${reference}`;
      htmlContent = `<h2 style="color:#047857;">Bonjour ${guestName},</h2><p>Excellente nouvelle ! Nous avons le plaisir de vous informer que <strong>la chambre est disponible</strong> pour votre séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong>.</p><p>Notre équipe vous contactera très rapidement pour finaliser votre réservation.</p>`;
    } else if (status === 'REJECTED') {
      subject = `Information sur votre demande - ${reference}`;
      htmlContent = `<h2 style="color:#b91c1c;">Bonjour ${guestName},</h2><p>Nous vous remercions pour votre intérêt pour l'Hôtel Awaya. Cependant, nous sommes au regret de vous informer que <strong>la chambre est indisponible</strong> pour les dates du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong>.</p><p>N'hésitez pas à nous recontacter pour d'autres dates.</p>`;
    } else if (status === 'WAITLIST') {
      subject = `Votre demande est en liste d'attente - ${reference}`;
      htmlContent = `<h2 style="color:#d97706;">Bonjour ${guestName},</h2><p>Votre demande pour un séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong> est actuellement en <strong>liste d'attente</strong>.</p>`;
    } else if (status === 'CONTACTED') {
      subject = `Nous traitons votre demande - ${reference}`;
      htmlContent = `<h2 style="color:#2563eb;">Bonjour ${guestName},</h2><p>Notre équipe a bien pris en compte votre demande. Nous vous contacterons très prochainement pour finaliser les détails.</p>`;
    }

    if (subject && htmlContent) {
      await resend.emails.send({
        from: 'Hôtel Awaya <onboarding@resend.dev>',
        to: [guestEmail],
        subject: subject,
        html: `<div style="font-family:sans-serif; max-width:600px; margin:auto; padding:20px;">${htmlContent}<hr/><p style="font-size:12px; color:#666; text-align:center;">Hôtel Awaya Colline 132</p></div>`,
      });
      console.log(`[EMAIL ENVOYÉ] Statut ${status} envoyé à ${guestEmail}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DECISION API] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}