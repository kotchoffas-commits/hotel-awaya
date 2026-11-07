import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const data = await resend.emails.send({
      from: 'HÃ´tel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: `Confirmation de rÃ©servation - HÃ´tel Awaya Colline 132`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HÃ´tel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <p>Nous avons le plaisir de vous confirmer votre rÃ©servation. Nous avons hÃ¢te de vous accueillir !</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #064e3b;">DÃ©tails de votre sÃ©jour</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>NumÃ©ro :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${booking.reference || booking.id}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>ArrivÃ©e :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>DÃ©part :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 12px 0;"><strong>Total :</strong></td><td style="padding: 12px 0; text-align: right; font-size: 18px; color: #047857;"><strong>${booking.totalAmount} ${booking.currency}</strong></td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma rÃ©servation</a>
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
      subject = `âœ… Votre rÃ©servation est confirmÃ©e - HÃ´tel Awaya`;
      statusText = 'ConfirmÃ©e';
      color = '#047857';
      messageHtml = `Nous avons le plaisir de vous informer que votre rÃ©servation a Ã©tÃ© officiellement confirmÃ©e par notre Ã©quipe.`;
    } else if (newStatus === 'CANCELLED') {
      subject = `âŒ Annulation de votre rÃ©servation - HÃ´tel Awaya`;
      statusText = 'AnnulÃ©e';
      color = '#dc2626';
      messageHtml = `Nous vous informons que votre rÃ©servation a Ã©tÃ© annulÃ©e. Si vous n'Ãªtes pas Ã  l'origine de cette annulation, veuillez nous contacter.`;
    } else if (newStatus === 'COMPLETED') {
      subject = `ðŸŒŸ Merci pour votre sÃ©jour - HÃ´tel Awaya`;
      statusText = 'TerminÃ©e';
      color = '#6b7280';
      messageHtml = `Nous espÃ©rons que votre sÃ©jour s'est merveilleusement bien passÃ©. Ce fut un plaisir de vous accueillir.`;
    } else {
      return;
    }

    await resend.emails.send({
      from: 'HÃ´tel Awaya <onboarding@resend.dev>',
      to: [booking.guestEmail],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #064e3b; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HÃ´tel Awaya Colline 132</h1>
          </div>
          <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #064e3b;">Bonjour ${booking.guestName},</h2>
            <div style="background-color: ${color}15; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: ${color};">Statut de votre rÃ©servation : ${statusText}</p>
              <p style="margin: 10px 0 0 0;">${messageHtml}</p>
            </div>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>ArrivÃ©e :</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>DÃ©part :</strong></td><td style="padding: 8px 0; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td></tr>
              </table>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/fr/reservation/suivi" style="display: inline-block; background-color: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Suivre ma rÃ©servation</a>
            </div>
          </div>
        </div>
      `,
    });
    console.log(`[RESEND] Email statut (${newStatus}) envoyÃ©.`);
  } catch (error) {
    console.error('[RESEND] Erreur:', error);
  }
}