'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Props = {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

// Composant Pop-up avec la charte graphique de l'hÃ´tel
function ErrorModal({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="p-8 flex flex-col items-center text-center">
          
          {/* IcÃ´ne d'avertissement Ã©lÃ©gante (Ambre) */}
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-3">Dates indisponibles</h3>
          <p className="text-gray-600 leading-relaxed mb-8">
            {message}
          </p>
          
          {/* Bouton aux couleurs de l'hÃ´tel */}
          <button
            onClick={onClose}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3.5 rounded-xl transition shadow-md"
          >
            Choisir d'autres dates
          </button>
        </div>
      </div>
    </div>
  );
}

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
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/reservation/confirmation?booking=${bookingId}`,
      },
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
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">
          {"Paiement s\u00e9curis\u00e9"}
        </h2>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
      >
        {loading ? '...' : t('pay')}
      </button>
    </form>
  );
}

export default function ReservationForm({ roomSlug, checkIn, checkOut, guests }: Props) {
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
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        throw new Error("Erreur de communication avec le serveur.");
      }

      if (!res.ok) {
        throw new Error(data.error || `Erreur (${res.status})`);
      }

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
      setPopupError(err.message || 'Une erreur est survenue lors de la rÃ©servation.');
    } finally {
      setLoading(false);
    }
  };

  if (clientSecret && bookingId) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
        <CheckoutForm bookingId={bookingId} locale={locale} />
      </Elements>
    );
  }

  return (
    <>
      {popupError && (
        <ErrorModal message={popupError} onClose={() => setPopupError(null)} />
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">
            {"Vos coordonn\u00e9es"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={t('guestName')} required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={t('guestEmail')} required className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder={t('guestPhone')} required={paymentMethod === 'MOBILE_MONEY'} className="border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-emerald-900 mb-4">
            {t('paymentMethod')}
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="STRIPE_CARD" checked={paymentMethod === 'STRIPE_CARD'} onChange={() => setPaymentMethod('STRIPE_CARD')} />
              <span className="text-sm">{t('card')}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="TWINT" checked={paymentMethod === 'TWINT'} onChange={() => setPaymentMethod('TWINT')} />
              <span className="text-sm">{t('twint')}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="MOBILE_MONEY" checked={paymentMethod === 'MOBILE_MONEY'} onChange={() => setPaymentMethod('MOBILE_MONEY')} />
              <span className="text-sm">{t('mobileMoney')}</span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition">
          {loading ? '...' : t('confirm')}
        </button>
      </form>
    </>
  );
}