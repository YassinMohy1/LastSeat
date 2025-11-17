'use client';

import { useState } from 'react';
import { CreditCard, Lock, Mail, MapPin } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface BillingPaymentProps {
  onSubmit: (billingData: BillingData) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export interface BillingData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  acceptTerms: boolean;
}

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Japan',
  'India',
  'Mexico',
  'Brazil',
];

export default function BillingPayment({ onSubmit, isProcessing, error }: BillingPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [billingData, setBillingData] = useState<BillingData>({
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    email: '',
    acceptTerms: false,
  });

  const handleChange = (field: keyof BillingData, value: string | boolean) => {
    setBillingData({ ...billingData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(billingData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Payment</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">Payment Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h3>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={billingData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={billingData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={billingData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={billingData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="ZIP/Postal"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={billingData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>

          <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    fontFamily: 'system-ui, sans-serif',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>

          <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Your payment information is encrypted and secure. We never store your card details.</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={billingData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              className="w-5 h-5 text-brand-blue rounded mt-0.5 cursor-pointer"
              required
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">
              I accept the{' '}
              <a href="#" className="text-brand-blue hover:underline font-semibold">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-brand-blue hover:underline font-semibold">
                Privacy Policy
              </a>
              . I understand that all sales are final and subject to the cancellation policy.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !stripe || !billingData.acceptTerms}
          className="w-full bg-gradient-to-r from-brand-blue via-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </span>
          ) : (
            'Proceed with Payment'
          )}
        </button>

        <div className="mt-4 text-center text-xs text-gray-500">
          By completing this purchase, you agree to receive booking confirmation and updates via email.
        </div>
      </form>
    </div>
  );
}
