import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, guestEmail, guestName, reference, checkIn, checkOut } = await req.json();

  await prisma.bookingRequest.update({ where: { id }, data: { status } });

  const checkInFmt = new Date(checkIn).toLocaleDateString('fr-FR');
  const checkOutFmt = new Date(checkOut).toLocaleDateString('fr-FR');

  let subject = '';
  let htmlContent = '';

  if (status === 'APPROVED') {
    subject = `Votre demande est acceptée - ${reference}`;
    htmlContent = `<h2>Bonjour ${guestName},</h2><p>Bonne nouvelle ! Votre demande pour un séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong> a été <strong>acceptée</strong>.</p><p>Notre équipe vous contactera très rapidement pour finaliser le paiement et confirmer votre réservation.</p><p>Votre code de suivi : <strong>${reference}</strong></p>`;
  } else if (status === 'REJECTED') {
    subject = `Mise à jour de votre demande - ${reference}`;
    htmlContent = `<h2>Bonjour ${guestName},</h2><p>Nous sommes au regret de vous informer que votre demande pour un séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong> n'a pas pu être acceptée en raison d'une indisponibilité sur ces dates.</p><p>Votre code de suivi : <strong>${reference}</strong></p>`;
  } else if (status === 'WAITLIST') {
    subject = `Votre demande est en liste d'attente - ${reference}`;
    htmlContent = `<h2>Bonjour ${guestName},</h2><p>Votre demande pour un séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong> est actuellement en <strong>liste d'attente</strong>.</p><p>Nous vous informerons dès qu'une chambre se libérera pour ces dates.</p><p>Votre code de suivi : <strong>${reference}</strong></p>`;
  } else if (status === 'CONTACTED') {
    subject = `Nous traitons votre demande - ${reference}`;
    htmlContent = `<h2>Bonjour ${guestName},</h2><p>Notre équipe a bien pris en compte votre demande pour un séjour du <strong>${checkInFmt}</strong> au <strong>${checkOutFmt}</strong>.</p><p>Nous vous avons contacté ou allons vous contacter très prochainement pour finaliser les détails de votre séjour.</p><p>Votre code de suivi : <strong>${reference}</strong></p>`;
  }

  if (subject && htmlContent) {
    await resend.emails.send({
      from: 'Hôtel Awaya <onboarding@resend.dev>',
      to: [guestEmail],
      subject: subject,
      html: `<div style="font-family:sans-serif; max-width:600px; margin:auto;">${htmlContent}<hr/><p style="font-size:12px; color:#666;">Hôtel Awaya Colline 132</p></div>`,
    });
  }

  return NextResponse.json({ success: true });
}