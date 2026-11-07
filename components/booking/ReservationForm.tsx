'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ bookingId, locale }: { bookingId: string; locale: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const t = useTranslations('booking');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMessage(null);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/${locale}/reservation/confirmation?booking=${bookingId}` },
      redirect: 'if_required',
    });
    if (error) {
      setErrorMessage(error.message || 'Erreur de paiement');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      router.push(`/reservation/confirmation?booking=${bookingId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{errorMessage}</div>}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">Paiement sécurisé</h2>
        <PaymentElement />
      </div>
      <button type="submit" disabled={!stripe || loading} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition">
        {loading ? '...' : t('pay')}
      </button>
    </form>
  );
}

export default function ReservationForm({ roomSlug, checkIn, checkOut, guests, basePrice }: Props) {
  const t = useTranslations('booking');
  const locale = useLocale();
  const router = useRouter();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE_CARD' | 'TWINT' | 'MOBILE_MONEY'>('STRIPE_CARD');
  const [loading, setLoading] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // --- NOUVEAU : Gestion du code promo ---
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const baseTotal = nights * basePrice;
  const finalTotal = baseTotal - (baseTotal * (discountPercent / 100));

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setCheckingPromo(true);
    setPromoError(null);
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscountPercent(data.discountPercent);
    } catch (err: any) {
      setPromoError(err.message);
      setDiscountPercent(0);
    } finally {
      setCheckingPromo(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPopupError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSlug, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, paymentMethod,
          promoCode: discountPercent > 0 ? promoCode : null,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } catch (parseErr) { throw new Error("Erreur de communication."); }

      if (!res.ok) throw new Error(data.error || `Erreur (${res.status})`);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setBookingId(data.bookingId);
      } else {
        router.push(`/reservation/confirmation?booking=${data.bookingId}`);
      }
    } catch (err: any) {
      setPopupError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (clientSecret && bookingId) {
    return <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}><CheckoutForm bookingId={bookingId} locale={locale} /></Elements>;
  }

  return (
    <>
      {popupError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
            <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-3">Oups !</h3>
            <p className="text-gray-600 mb-6">{popupError}</p>
            <button onClick={() => setPopupError(null)} className="w-full bg-emerald-700 text-white py-3 rounded-xl">Compris</button>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">Vos coordonnées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t('guestName')} required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t('guestEmail')} required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder={t('guestPhone')} required={paymentMethod === 'MOBILE_MONEY'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2" />
          </div>
        </div>

        {/* CODE PROMO */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">Code Promo</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={promoCode} 
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())} 
              placeholder="Ex: BIENVENUE10" 
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase font-mono" 
            />
            <button type="button" onClick={handleApplyPromo} disabled={checkingPromo || !promoCode} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-gray-400">
              {checkingPromo ? '...' : 'Appliquer'}
            </button>
          </div>
          {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
          {discountPercent > 0 && <p className="text-emerald-600 text-sm font-medium mt-2">✅ Code appliqué : -{discountPercent}% de réduction !</p>}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">Mode de paiement</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="STRIPE_CARD" checked={paymentMethod === 'STRIPE_CARD'} onChange={() => setPaymentMethod('STRIPE_CARD')} />
              <span className="text-sm">Carte bancaire</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="TWINT" checked={paymentMethod === 'TWINT'} onChange={() => setPaymentMethod('TWINT')} />
              <span className="text-sm">Twint</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="MOBILE_MONEY" checked={paymentMethod === 'MOBILE_MONEY'} onChange={() => setPaymentMethod('MOBILE_MONEY')} />
              <span className="text-sm">Mobile Money</span>
            </label>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total à payer</p>
            {discountPercent > 0 && <p className="text-xs text-gray-500 line-through">{baseTotal} CHF</p>}
            <p className="text-3xl font-bold text-emerald-700">{finalTotal.toFixed(2)} CHF</p>
          </div>
          <button type="submit" disabled={loading} className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-lg transition shadow-md">
            {loading ? 'Traitement...' : t('confirm')}
          </button>
        </div>
      </form>
    </>
  );
}