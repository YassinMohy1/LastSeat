import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import StepIndicator from '../components/StepIndicator';
import FlightDetails from '../components/FlightDetails';
import PassengerForm, { PassengerData } from '../components/PassengerForm';
import TravelCarePlan from '../components/TravelCarePlan';
import BaggageProtection from '../components/BaggageProtection';
import BillingPayment, { BillingData } from '../components/BillingPayment';
import OrderSummary from '../components/OrderSummary';
import pricingData from '../data/pricing.json';
import { supabase } from '../lib/supabase';
import { trackButtonClick } from '../lib/analytics';

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const [currentStep, setCurrentStep] = useState(0);
  const [passengerData, setPassengerData] = useState<PassengerData | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('none');
  const [baggageProtection, setBaggageProtection] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const selectedPlanData = pricingData.addons.plans.find((p) => p.id === selectedPlan);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handlePayment = async (billingData: BillingData) => {
    if (!stripe || !elements) {
      setPaymentError('Payment system is not ready. Please refresh the page.');
      return;
    }

    if (!passengerData) {
      setPaymentError('Please fill in passenger details.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      trackButtonClick('Proceed with Payment', 'Checkout Page');

      const protectionCost = selectedPlanData?.percentage
        ? (pricingData.product.base_fare * selectedPlanData.percentage / 100)
        : 0;
      const baggageCost = baggageProtection ? pricingData.addons.baggage_protection.price * passengerCount : 0;
      const subtotal = pricingData.product.base_fare + protectionCost + baggageCost + pricingData.fees.service_fee;
      const tax = subtotal * (pricingData.fees.tax_rate / 100);
      const total = subtotal + tax;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: 'usd',
          metadata: {
            passenger_name: `${passengerData.firstName} ${passengerData.lastName}`,
            email: billingData.email,
            flight: pricingData.product.name,
          },
        }),
      });

      const { clientSecret, error: intentError } = await response.json();

      if (intentError) {
        throw new Error(intentError);
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${passengerData.firstName} ${passengerData.lastName}`,
            email: billingData.email,
            address: {
              line1: billingData.address,
              city: billingData.city,
              postal_code: billingData.postalCode,
              country: billingData.country === 'United States' ? 'US' : billingData.country.substring(0, 2).toUpperCase(),
            },
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        const { error: dbError } = await supabase.from('bookings').insert({
          passenger_name: `${passengerData.firstName} ${passengerData.lastName}`,
          email: billingData.email,
          phone: `${passengerData.countryCode}${passengerData.phoneNumber}`,
          flight_details: pricingData.product.name,
          total_amount: total,
          payment_intent_id: paymentIntent.id,
          protection_plan: selectedPlan,
          baggage_protection: baggageProtection,
          status: 'confirmed',
        });

        if (dbError) {
          console.error('Database error:', dbError);
        }

        setCurrentStep(4);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'Payment failed. Please check your card details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 text-center">Secure checkout - Your information is safe with us</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        {currentStep < 4 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <FlightDetails data={pricingData} />

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Number of Passengers</h3>
                <select
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>

              <PassengerForm onDataChange={setPassengerData} />

              <TravelCarePlan
                plans={pricingData.addons.plans}
                selectedPlan={selectedPlan}
                onPlanChange={setSelectedPlan}
                baseFare={pricingData.product.base_fare}
              />

              <BaggageProtection
                price={pricingData.addons.baggage_protection.price}
                coverage={pricingData.addons.baggage_protection.coverage}
                description={pricingData.addons.baggage_protection.description}
                selected={baggageProtection}
                onToggle={setBaggageProtection}
                passengerCount={passengerCount}
              />

              <BillingPayment
                onSubmit={handlePayment}
                isProcessing={isProcessing}
                error={paymentError}
              />
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                baseFare={pricingData.product.base_fare}
                selectedPlan={selectedPlanData}
                baggageProtection={baggageProtection}
                baggagePrice={pricingData.addons.baggage_protection.price}
                serviceFee={pricingData.fees.service_fee}
                taxRate={pricingData.fees.tax_rate}
                passengerCount={passengerCount}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your purchase. Your booking confirmation has been sent to your email.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-2">What's Next?</h3>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li>✓ Check your email for booking confirmation and e-ticket</li>
                  <li>✓ Review your travel protection coverage details</li>
                  <li>✓ Save your booking reference for check-in</li>
                  <li>✓ Arrive at the airport 3 hours before departure</li>
                </ul>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="bg-brand-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
