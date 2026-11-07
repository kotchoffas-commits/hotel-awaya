import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function getEmailWrapper(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; color: #333; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #064e3b; padding: 25px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">H&ocirc;tel Awaya Colline 132</h1>
        </div>
        <div style="padding: 30px;">
          ${content}
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          &copy; ${new Date().getFullYear()} H&ocirc;tel Awaya Colline 132. Tous droits r&eacute;serv&eacute;s.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const content = `
      <h2 style="color: #064e3b; margin-top: 0;">Bonjour ${booking.guestName},</h2>
      <p style="font-size: 15px; line-height: 1.5;">Nous avons le plaisir de vous confirmer votre r&eacute;servation. Nous avons h&acirc;te de vous accueillir !</p>
      
      <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <p style="margin: 0; font-size: 13px; color: #4b5563; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">R&eacute;f&eacute;rence de r&eacute;servation</p>
        <p style="margin: 10px 0 5px 0; font-size: 28px; font-family: monospace; font-weight: bold; color: #064e3b;">${booking.reference || booking.id}</p>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">&#128203; Copiez ce num&eacute;ro pour suivre votre r&eacute;servation.</p>
      </div>

      <h3 style="color: #064e3b; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 30px;">D&eacute;tails du s&eacute;jour</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Chambre</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${roomName}</td></tr>
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Arriv&eacute;e</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">D&eacute;part</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Voyageurs</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${booking.guests} personne(s)</td></tr>
        <tr><td style="padding: 15px 0; color: #064e3b; font-weight: bold; font-size: 16px;">Total pay&eacute;</td><td style="text-align: right; font-weight: bold; font-size: 18px; color: #047857;">${booking.totalAmount} ${booking.currency}</td></tr>
      </table>
      
      <div style="text-align: center; margin-top: 35px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi?ref=${booking.reference}" style="display: inline-block; background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Suivre ma r&eacute;servation</a>
      </div>
    `;
    
    await resend.emails.send({
      from: 'Hotel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: `Confirmation de reservation - ${booking.reference}`,
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
      subject = `Reservation confirmee - ${booking.reference}`;
      statusText = 'Confirm&eacute;e';
      color = '#047857';
      messageHtml = `Nous avons le plaisir de vous informer que votre r&eacute;servation a &eacute;t&eacute; officiellement confirm&eacute;e par notre &eacute;quipe.`;
    } else if (newStatus === 'CANCELLED') {
      subject = `Annulation de votre reservation - ${booking.reference}`;
      statusText = 'Annul&eacute;e';
      color = '#dc2626';
      messageHtml = `Nous vous informons que votre r&eacute;servation a &eacute;t&eacute; annul&eacute;e. Si vous n'&ecirc;tes pas &agrave; l'origine de cette annulation, veuillez nous contacter d'urgence.`;
    } else if (newStatus === 'COMPLETED') {
      subject = `Merci pour votre sejour - ${booking.reference}`;
      statusText = 'Termin&eacute;e';
      color = '#6b7280';
      messageHtml = `Nous esp&eacute;rons que votre s&eacute;jour s'est merveilleusement bien pass&eacute;. Ce fut un plaisir de vous accueillir.`;
    } else if (newStatus === 'NO_SHOW') {
      subject = `Absence constatee - ${booking.reference}`;
      statusText = 'No-show (Absence)';
      color = '#b91c1c';
      messageHtml = `Nous avons constat&eacute; que vous ne vous &ecirc;tes pas pr&eacute;sent&eacute; &agrave; l'h&ocirc;tel pour votre r&eacute;servation. Si c'est une erreur, veuillez nous contacter d'urgence.`;
    } else if (newStatus === 'PENDING') {
      subject = `Mise a jour de votre reservation - ${booking.reference}`;
      statusText = 'En attente';
      color = '#d97706';
      messageHtml = `Votre r&eacute;servation est actuellement en cours de v&eacute;rification par notre &eacute;quipe. Nous vous tiendrons inform&eacute; tr&egrave;s prochainement.`;
    } else {
      return;
    }

    const content = `
      <h2 style="color: #064e3b; margin-top: 0;">Bonjour ${booking.guestName},</h2>
      
      <div style="background-color: ${color}15; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: ${color}; font-size: 16px;">Statut : ${statusText}</p>
        <p style="margin: 10px 0 0 0; font-size: 14px; line-height: 1.5;">${messageHtml}</p>
      </div>

      <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
        <p style="margin: 0; font-size: 13px; color: #4b5563; font-weight: bold; text-transform: uppercase;">R&eacute;f&eacute;rence de r&eacute;servation</p>
        <p style="margin: 10px 0 5px 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #064e3b;">${booking.reference || booking.id}</p>
        <p style="margin: 0; font-size: 12px; color: #6b7280;">&#128203; Copiez ce num&eacute;ro pour suivre votre dossier.</p>
      </div>

      <h3 style="color: #064e3b; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 30px;">Rappel de votre s&eacute;jour</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Chambre</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${roomName}</td></tr>
        <tr><td style="padding: 10px 0; color: #4b5563; border-bottom: 1px solid #f3f4f6;">Arriv&eacute;e</td><td style="text-align: right; font-weight: bold; border-bottom: 1px solid #f3f4f6;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
        <tr><td style="padding: 10px 0; color: #4b5563;">D&eacute;part</td><td style="text-align: right; font-weight: bold;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
      </table>
      
      <div style="text-align: center; margin-top: 35px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi?ref=${booking.reference}" style="display: inline-block; background-color: #047857; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 15px;">Voir ma r&eacute;servation</a>
      </div>
    `;

    await resend.emails.send({
      from: 'Hotel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: subject,
      html: getEmailWrapper(content),
    });
    console.log(`[RESEND] Email statut (${newStatus}) envoyé.`);
  } catch (error) {
    console.error('[RESEND] Erreur:', error);
  }
}