import { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { trackBookingStart, trackBookingComplete, trackPhoneClick } from '../lib/analytics';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    destination: string;
    amount: number;
    description: string;
  };
}

export default function PaymentModal({ isOpen, onClose, bookingDetails }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });

  if (isOpen) {
    trackBookingStart();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

      if (!stripeKey || stripeKey === 'your_stripe_publishable_key_here') {
        alert('Payment is currently being processed by phone. Please call 888-602-6667 to complete your booking.');
        window.location.href = 'tel:888-602-6667';
        return;
      }

      const stripe = await loadStripe(stripeKey);

      if (!stripe) {
        throw new Error('Failed to load payment processor');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          amount: bookingDetails.amount,
          description: bookingDetails.description,
          customerEmail: formData.email
        })
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      trackBookingComplete({
        bookingId: clientSecret,
        totalAmount: bookingDetails.amount,
        currency: 'USD',
        to: bookingDetails.destination
      });

      alert('Payment setup successful! Our agent will contact you shortly to finalize your booking.');
      onClose();

    } catch (error) {
      console.error('Payment error:', error);
      alert('For immediate assistance with payment, please call us at 888-602-6667');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19);
    }

    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }

    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Secure Payment</h3>
            <p className="text-blue-100 text-sm mt-1">Complete your booking payment</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Booking:</span>
              <span className="font-semibold">{bookingDetails.destination}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${bookingDetails.amount}</span>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                paymentMethod === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💳 Card
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                paymentMethod === 'paypal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setPaymentMethod('applepay')}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                paymentMethod === 'applepay'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Apple Pay
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <div className="font-semibold mb-1">Secure Payment Processing</div>
                <div>Your payment information is encrypted and secure. We accept all major credit cards.</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay $${bookingDetails.amount}`}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  trackPhoneClick('888-602-6667');
                  window.location.href = 'tel:888-602-6667';
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                Or call 888-602-6667 to pay by phone
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="text-xs bg-gray-100 px-3 py-1 rounded font-semibold">VISA</div>
              <div className="text-xs bg-gray-100 px-3 py-1 rounded font-semibold">MASTERCARD</div>
              <div className="text-xs bg-gray-100 px-3 py-1 rounded font-semibold">AMEX</div>
              <div className="text-xs bg-gray-100 px-3 py-1 rounded font-semibold">DISCOVER</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
