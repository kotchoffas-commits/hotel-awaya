import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(booking: any, roomName: string) {
  try {
    const data = await resend.emails.send({
      // Avec Resend sans nom de domaine, on doit utiliser onboarding@resend.dev
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
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Numéro de réservation :</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${booking.id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Chambre :</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${roomName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Arrivée :</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkIn).toLocaleDateString('fr-FR')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Départ :</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${new Date(booking.checkOut).toLocaleDateString('fr-FR')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Voyageurs :</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${booking.guests} personne(s)</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;"><strong>Total payé :</strong></td>
                  <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #047857;"><strong>${booking.totalAmount} ${booking.currency}</strong></td>
                </tr>
              </table>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Si vous avez des questions, n'hésitez pas à nous contacter en répondant à cet email.
            </p>
            <p style="font-size: 14px; color: #6b7280;">
              À très bientôt,<br>
              <strong>L'équipe de l'Hôtel Awaya</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log('[RESEND] Email envoye avec succes:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[RESEND] Erreur lors de l envoi:', error);
    return { success: false, error };
  }
}