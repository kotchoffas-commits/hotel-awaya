import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error('[STRIPE] ERREUR: STRIPE_SECRET_KEY manquante dans .env');
    throw new Error("STRIPE_SECRET_KEY manquante dans le fichier .env");
  }
  return new Stripe(key, { apiVersion: '2024-06-20' });
}