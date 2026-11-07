import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Modèle d'email unifié aux couleurs de l'hôtel
function getEmailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        
        <!-- En-tête Vert Émeraude -->
        <div style="background-color: #064e3b; padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">HÔTEL AWAYA</h1>
          <p style="color: #6ee7b7; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Colline 132</p>
        </div>
        
        <!-- Contenu -->
        <div style="padding: 40px 30px; color: #374151; line-height: 1.6;">
          ${content}
        </div>
        
        <!-- Pied de page -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Hôtel Awaya Colline 132. Tous droits réservés.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Besoin d'aide ? Contactez-nous au +229 00 00 00 00</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${booking.guestName},</h2>
      <p style="font-size: 16px;">Nous avons le plaisir de vous confirmer votre réservation. Nous avons hâte de vous accueillir à l'Hôtel Awaya.</p>
      
      <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0;">
        <p style="margin: 0; font-size: 13px; color: #047857; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Votre code de réservation</p>
        <p style="margin: 10px 0 0 0; font-size: 32px; font-family: monospace; font-weight: 700; color: #064e3b;">${booking.reference || booking.id}</p>
      </div>

      <h3 style="color: #064e3b; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 30px;">Détails de votre séjour</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 15px;">
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Chambre</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${roomName}</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Arrivée</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')} (14h00)</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Départ</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')} (12h00)</td></tr>
        <tr><td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Voyageurs</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${booking.guests} personne(s)</td></tr>
        <tr><td style="padding: 15px 0; color: #064e3b; font-weight: bold; font-size: 18px;">Total payé</td><td style="text-align: right; font-weight: bold; font-size: 20px; color: #047857;">${booking.totalAmount} ${booking.currency}</td></tr>
      </table>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi?ref=${booking.reference}" style="display: inline-block; background-color: #047857; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px;">Suivre ma réservation</a>
      </div>
    `;
    
    await resend.emails.send({
      from: 'Hôtel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: `Confirmation de réservation - ${booking.reference}`,
      html: getEmailWrapper(content),
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function sendBookingStatusEmail(booking: any, roomName: string, newStatus: string) {
  try {
    let subject = '';
    let messageHtml = '';
    let color = '';
    let statusText = '';

    if (newStatus === 'CONFIRMED') {
      subject = `Votre réservation est confirmée - ${booking.reference}`;
      statusText = 'Confirmée';
      color = '#047857';
      messageHtml = `Nous avons le plaisir de vous informer que votre réservation a été officiellement confirmée par notre équipe.`;
    } else if (newStatus === 'CANCELLED') {
      subject = `Annulation de votre réservation - ${booking.reference}`;
      statusText = 'Annulée';
      color = '#dc2626';
      messageHtml = `Nous vous informons que votre réservation a été annulée. Si vous n'êtes pas à l'origine de cette annulation, veuillez nous contacter.`;
    } else if (newStatus === 'COMPLETED') {
      subject = `Merci pour votre séjour - ${booking.reference}`;
      statusText = 'Terminée';
      color = '#6b7280';
      messageHtml = `Nous espérons que votre séjour s'est merveilleusement bien passé. Ce fut un plaisir de vous accueillir.`;
    } else if (newStatus === 'PENDING') {
      subject = `Mise à jour de votre réservation - ${booking.reference}`;
      statusText = 'En attente';
      color = '#d97706';
      messageHtml = `Votre réservation est actuellement en cours de vérification par notre équipe.`;
    } else {
      return;
    }

    const content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${booking.guestName},</h2>
      
      <div style="background-color: ${color}15; border-left: 4px solid ${color}; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; font-weight: bold; color: ${color}; font-size: 18px;">Statut : ${statusText}</p>
        <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;">${messageHtml}</p>
      </div>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
        <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Code de suivi</p>
        <p style="margin: 5px 0 0 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #064e3b;">${booking.reference || booking.id}</p>
      </div>

      <h3 style="color: #064e3b; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 30px;">Rappel de votre séjour</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 15px;">
        <tr><td style="padding: 10px 0; color: #6b7280;">Chambre</td><td style="text-align: right; font-weight: bold;">${roomName}</td></tr>
        <tr><td style="padding: 10px 0; color: #6b7280;">Arrivée</td><td style="text-align: right; font-weight: bold;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
        <tr><td style="padding: 10px 0; color: #6b7280;">Départ</td><td style="text-align: right; font-weight: bold;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
      </table>
      
      <div style="text-align: center; margin-top: 40px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi?ref=${booking.reference}" style="display: inline-block; background-color: #047857; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px;">Voir ma réservation</a>
      </div>
    `;

    await resend.emails.send({
      from: 'Hôtel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: subject,
      html: getEmailWrapper(content),
    });
  } catch (error) {
    console.error('[RESEND] Erreur:', error);
  }
}

export async function sendRequestDecisionEmail(guestEmail: string, guestName: string, reference: string, checkIn: string, checkOut: string, status: string) {
  const checkInFmt = new Date(checkIn).toLocaleDateString('fr-FR');
  const checkOutFmt = new Date(checkOut).toLocaleDateString('fr-FR');
  let subject = '';
  let content = '';

  if (status === 'APPROVED') {
    subject = `Bonne nouvelle : Chambre disponible - ${reference}`;
    content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${guestName},</h2>
      <p style="font-size: 16px;">Excellente nouvelle ! Nous avons le plaisir de vous informer que <strong>la chambre est disponible</strong> pour votre séjour.</p>
      <div style="background-color: #ecfdf5; border-left: 4px solid #047857; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #047857; font-weight: bold; font-size: 18px;">✅ Demande Acceptée</p>
        <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;">Du ${checkInFmt} au ${checkOutFmt}</p>
      </div>
      <p style="font-size: 15px;">Notre équipe vous contactera très rapidement pour finaliser votre réservation.</p>
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Code de suivi</p>
        <p style="margin: 5px 0 0 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #064e3b;">${reference}</p>
      </div>
    `;
  } else if (status === 'REJECTED') {
    subject = `Information sur votre demande - ${reference}`;
    content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${guestName},</h2>
      <p style="font-size: 16px;">Nous vous remercions pour votre intérêt pour l'Hôtel Awaya. Cependant, nous sommes au regret de vous informer que <strong>la chambre est indisponible</strong> pour les dates demandées.</p>
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">❌ Demande Refusée</p>
        <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;">Du ${checkInFmt} au ${checkOutFmt}</p>
      </div>
      <p style="font-size: 15px;">N'hésitez pas à nous recontacter pour d'autres dates.</p>
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Code de suivi</p>
        <p style="margin: 5px 0 0 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #064e3b;">${reference}</p>
      </div>
    `;
  } else if (status === 'WAITLIST') {
    subject = `Votre demande est en liste d'attente - ${reference}`;
    content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${guestName},</h2>
      <p style="font-size: 16px;">Votre demande est actuellement en <strong>liste d'attente</strong>.</p>
      <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #d97706; font-weight: bold; font-size: 18px;">⏳ Liste d'attente</p>
        <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;">Du ${checkInFmt} au ${checkOutFmt}</p>
      </div>
      <p style="font-size: 15px;">Nous vous informerons dès qu'une chambre se libérera pour ces dates.</p>
    `;
  } else if (status === 'CONTACTED') {
    subject = `Nous traitons votre demande - ${reference}`;
    content = `
      <h2 style="color: #064e3b; margin-top: 0; font-size: 22px;">Bonjour ${guestName},</h2>
      <p style="font-size: 16px;">Notre équipe a bien pris en compte votre demande et vous contactera très prochainement.</p>
      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #2563eb; font-weight: bold; font-size: 18px;">📞 En cours de traitement</p>
        <p style="margin: 10px 0 0 0; font-size: 15px; color: #374151;">Du ${checkInFmt} au ${checkOutFmt}</p>
      </div>
    `;
  } else {
    return;
  }

  await resend.emails.send({
    from: 'Hôtel Awaya <onboarding@resend.dev>',
    to: [guestEmail],
    subject: subject,
    html: getEmailWrapper(content),
  });
}