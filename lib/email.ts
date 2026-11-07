import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const data = await resend.emails.send({
      from: 'Hôtel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: `Confirmation de réservation - Hôtel Awaya Colline 132`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Hôtel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <p>Nous avons le plaisir de vous confirmer votre réservation. Nous avons hâte de vous accueillir !</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #064e3b;">Détails de votre séjour</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Numéro :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${booking.id}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Arrivée :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Départ :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 12px 0;"><strong>Total :</strong></td><td style="padding: 12px 0; text-align: right; font-size: 18px; color: #047857;"><strong>${booking.totalAmount} ${booking.currency}</strong></td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma réservation</a>
            </div>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function sendBookingStatusEmail(booking: any, roomName: string, newStatus: string) {
  try {
    let subject = '';
    let messageHtml = '';
    let color = '';
    let statusText = '';

    if (newStatus === 'CONFIRMED') {
      subject = `✅ Votre réservation est confirmée - Hôtel Awaya`;
      statusText = 'Confirmée';
      color = '#047857';
      messageHtml = `Nous avons le plaisir de vous informer que votre réservation a été officiellement confirmée par notre équipe.`;
    } else if (newStatus === 'CANCELLED') {
      subject = `❌ Annulation de votre réservation - Hôtel Awaya`;
      statusText = 'Annulée';
      color = '#dc2626';
      messageHtml = `Nous vous informons que votre réservation a été annulée. Si vous n'êtes pas à l'origine de cette annulation, veuillez nous contacter.`;
    } else if (newStatus === 'COMPLETED') {
      subject = `🌟 Merci pour votre séjour - Hôtel Awaya`;
      statusText = 'Terminée';
      color = '#6b7280';
      messageHtml = `Nous espérons que votre séjour s'est merveilleusement bien passé. Ce fut un plaisir de vous accueillir.`;
    } else {
      return;
    }

    await resend.emails.send({
      from: 'Hôtel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Hôtel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <div style="background-color: ${color}15; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: ${color};">Statut de votre réservation : ${statusText}</p>
              <p style="margin: 10px 0 0 0;">${messageHtml}</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Arrivée :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Départ :</strong></td><td style="padding: 8px 0; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma réservation</a>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`[RESEND] Email statut (${newStatus}) envoyé.`);
  } catch (error) {
    console.error('[RESEND] Erreur:', error);
  }
}