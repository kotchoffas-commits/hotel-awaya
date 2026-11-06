import Stripe from 'stripe';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error('[STRIPE] ERREUR: STRIPE_SECRET_KEY manquante dans .env');
    throw new Error("STRIPE_SECRET_KEY manquante dans le fichier .env");
  }
  // On retire la version stricte pour laisser le SDK utiliser sa version par défaut
  return new Stripe(key);
}