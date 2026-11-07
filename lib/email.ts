import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const data = await resend.emails.send({
      from: 'HÃƒÂ´tel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: `Confirmation de rÃƒÂ©servation - HÃƒÂ´tel Awaya Colline 132`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HÃƒÂ´tel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <p>Nous avons le plaisir de vous confirmer votre rÃƒÂ©servation. Nous avons hÃƒÂ¢te de vous accueillir !</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #064e3b;">DÃƒÂ©tails de votre sÃƒÂ©jour</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>NumÃƒÂ©ro :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${booking.reference || booking.id}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>ArrivÃƒÂ©e :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>DÃƒÂ©part :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 12px 0;"><strong>Total :</strong></td><td style="padding: 12px 0; text-align: right; font-size: 18px; color: #047857;"><strong>${booking.totalAmount} ${booking.currency}</strong></td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma rÃƒÂ©servation</a>
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
      subject = `Ã¢Å“â€¦ Votre rÃƒÂ©servation est confirmÃƒÂ©e - HÃƒÂ´tel Awaya`;
      statusText = 'ConfirmÃƒÂ©e';
      color = '#047857';
      messageHtml = `Nous avons le plaisir de vous informer que votre rÃƒÂ©servation a ÃƒÂ©tÃƒÂ© officiellement confirmÃƒÂ©e par notre ÃƒÂ©quipe.`;
    } else if (newStatus === 'CANCELLED') {
      subject = `Ã¢ÂÅ’ Annulation de votre rÃƒÂ©servation - HÃƒÂ´tel Awaya`;
      statusText = 'AnnulÃƒÂ©e';
      color = '#dc2626';
      messageHtml = `Nous vous informons que votre rÃƒÂ©servation a ÃƒÂ©tÃƒÂ© annulÃƒÂ©e. Si vous n'ÃƒÂªtes pas ÃƒÂ  l'origine de cette annulation, veuillez nous contacter.`;
    } else if (newStatus === 'COMPLETED') {
      subject = `Ã°Å¸Å’Å¸ Merci pour votre sÃƒÂ©jour - HÃƒÂ´tel Awaya`;
      statusText = 'TerminÃƒÂ©e';
      color = '#6b7280';
      messageHtml = `Nous espÃƒÂ©rons que votre sÃƒÂ©jour s'est merveilleusement bien passÃƒÂ©. Ce fut un plaisir de vous accueillir.`;
    } else {
      return;
    }

    await resend.emails.send({
      from: 'HÃƒÂ´tel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HÃƒÂ´tel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <div style="background-color: ${color}15; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: ${color};">Statut de votre rÃƒÂ©servation : ${statusText}</p>
              <p style="margin: 10px 0 0 0;">${messageHtml}</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>ArrivÃƒÂ©e :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>DÃƒÂ©part :</strong></td><td style="padding: 8px 0; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma rÃƒÂ©servation</a>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`[RESEND] Email statut (${newStatus}) envoyÃƒÂ©.`);
  } catch (error) {
    console.error('[RESEND] Erreur:', error);
  }
}