import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NMIPaymentForm from '../components/NMIPaymentForm';
import TravelCarePlan from '../components/TravelCarePlan';
import FlightRouteDisplay from '../components/FlightRouteDisplay';
import {
  Plane,
  Calendar,
  Users,
  CheckCircle,
  Loader2,
  AlertCircle,
  Shield,
  Briefcase,
  Check,
  X
} from 'lucide-react';

interface StopDetail {
  city: string;
  airport: string;
  duration: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  flight_from: string;
  flight_to: string;
  departure_date: string;
  return_date: string | null;
  passengers: number;
  cabin_class: string;
  amount: number;
  currency: string;
  payment_status: string;
  notes: string | null;
  outbound_departure_time?: string | null;
  outbound_arrival_time?: string | null;
  outbound_duration?: string | null;
  outbound_stops?: number | null;
  outbound_stops_info?: string | null;
  outbound_stops_details?: StopDetail[] | null;
  return_departure_time?: string | null;
  return_arrival_time?: string | null;
  return_duration?: string | null;
  return_stops?: number | null;
  return_stops_info?: string | null;
  return_stops_details?: StopDetail[] | null;
}

type TravelCarePlan = 'none' | 'basic' | 'premium';

export default function CustomerPayment() {
  const { paymentLink } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<'review' | 'payment'>('review');

  const [travelCarePlan, setTravelCarePlan] = useState<TravelCarePlan>('none');
  const [baggageProtection, setBaggageProtection] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [paymentLink]);

  const fetchInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('payment_link', paymentLink)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Invoice not found');

      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const getTipOptions = (): number[] => {
    if (!invoice) return [];

    const baseAmount = Number(invoice.amount);

    if (baseAmount < 1000) {
      return [10, 20, 30, 40, 50, 60];
    } else if (baseAmount < 2000) {
      return [15, 30, 45, 60, 75, 90];
    } else {
      return [20, 40, 60, 80, 100, 120];
    }
  };

  const getTipAmount = (): number => {
    if (selectedTip !== null) {
      return selectedTip;
    }
    if (customTip && !isNaN(parseFloat(customTip))) {
      return parseFloat(customTip);
    }
    return 0;
  };

  const getTravelCarePlanPrice = (planType: 'basic' | 'premium'): number => {
    if (!invoice) return 0;
    const baseAmount = Number(invoice.amount);
    const percentage = planType === 'basic' ? 0.15 : 0.17;
    return baseAmount * percentage;
  };

  const calculateTotalAmount = (): number => {
    if (!invoice) return 0;

    let total = Number(invoice.amount);

    if (travelCarePlan === 'basic') {
      total += getTravelCarePlanPrice('basic');
    } else if (travelCarePlan === 'premium') {
      total += getTravelCarePlanPrice('premium');
    }

    if (baggageProtection) {
      total += 19.99 * invoice.passengers;
    }

    total += getTipAmount();

    return total;
  };

  const handleProceedToPayment = () => {
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = async () => {
    try {
      await supabase
        .from('invoices')
        .update({
          payment_status: 'paid',
          amount: calculateTotalAmount()
        })
        .eq('id', invoice!.id);
      setPaymentSuccess(true);
    } catch (err: any) {
      console.error('Error updating payment status:', err);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  if (invoice.payment_status === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Paid</h2>
          <p className="text-gray-600">This invoice has already been paid</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-brand-blue to-blue-600 px-8 py-6">
              <h1 className="text-2xl font-bold text-white mb-2">Complete Payment</h1>
              <p className="text-blue-100">Invoice #{invoice.invoice_number}</p>
            </div>

            <div className="p-8">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Base Flight Cost:</span>
                  <span className="text-gray-900 font-semibold">${Number(invoice.amount).toFixed(2)}</span>
                </div>

                {travelCarePlan !== 'none' && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">
                      Travel Care Plan ({travelCarePlan === 'basic' ? 'Basic' : 'Premium'}):
                    </span>
                    <span className="text-gray-900 font-semibold">
                      ${getTravelCarePlanPrice(travelCarePlan as 'basic' | 'premium').toFixed(2)}
                    </span>
                  </div>
                )}

                {baggageProtection && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Lost Baggage Protection:</span>
                    <span className="text-gray-900 font-semibold">
                      ${(19.99 * invoice.passengers).toFixed(2)}
                    </span>
                  </div>
                )}

                {getTipAmount() > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Service Tip:</span>
                    <span className="text-gray-900 font-semibold">
                      ${getTipAmount().toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t border-blue-300 mt-3 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-brand-blue">
                      ${calculateTotalAmount().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep('review')}
                className="text-sm text-brand-blue hover:underline mb-6"
              >
                ← Back to review
              </button>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold mb-1">Payment Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {paymentSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600">Thank you! We will contact you soon to confirm your booking.</p>
                </div>
              ) : (
                <NMIPaymentForm
                  amount={calculateTotalAmount()}
                  currency={invoice.currency}
                  invoiceNumber={invoice.invoice_number}
                  customerEmail={invoice.customer_email}
                  customerName={invoice.customer_name}
                  customerPhone={invoice.customer_phone}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-800 text-white py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Review Details and Confirm Your Trip</h1>
              <p className="text-sm text-gray-300">You're on the final step. Only a few more minutes to finish!</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm">Request Quote</span>
            </div>

            <div className="flex-1 h-0.5 bg-green-500 mx-2"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm">Review Flight Options</span>
            </div>

            <div className="flex-1 h-0.5 bg-green-500 mx-2"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm">Flight Selection</span>
            </div>

            <div className="flex-1 h-0.5 bg-gray-600 mx-2"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                4
              </div>
              <span className="text-sm">Complete Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Flight to {invoice.flight_to}</h2>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">LST Confirm. No.:</div>
              <div className="text-brand-blue font-semibold">{invoice.invoice_number}</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Flight Details</h3>

            <FlightRouteDisplay
              departureDate={invoice.departure_date}
              departureTime={invoice.outbound_departure_time || '12:30 PM'}
              arrivalTime={invoice.outbound_arrival_time || '11:50 PM'}
              from={invoice.flight_from}
              to={invoice.flight_to}
              stops={invoice.outbound_stops ?? 0}
              stopsInfo={invoice.outbound_stops_info || undefined}
              stopsDetails={invoice.outbound_stops_details || undefined}
              duration={invoice.outbound_duration || undefined}
              type="outbound"
            />

            {invoice.return_date && (
              <>
                <h3 className="text-xl font-semibold text-brand-blue mb-4 mt-8">Return Flight</h3>
                <FlightRouteDisplay
                  departureDate={invoice.return_date}
                  departureTime={invoice.return_departure_time || '12:30 PM'}
                  arrivalTime={invoice.return_arrival_time || '1:10 AM'}
                  from={invoice.flight_to}
                  to={invoice.flight_from}
                  stops={invoice.return_stops ?? 0}
                  stopsInfo={invoice.return_stops_info || undefined}
                  stopsDetails={invoice.return_stops_details || undefined}
                  duration={invoice.return_duration || undefined}
                  type="return"
                />
              </>
            )}
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Passenger Details</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️</strong> Traveler names must match the government-issued identification document intended to use during travel
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-brand-blue mb-4">Passenger #1 Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{invoice.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{invoice.customer_email}</p>
                  <p className="text-sm text-gray-700">{invoice.customer_phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-4">
              <p className="text-sm text-orange-800">
                <strong>ℹ️</strong> Confirmation email and phone number fields are required!
              </p>
            </div>
          </div>

          <TravelCarePlan
            plans={[
              {
                id: 'none',
                title: 'No Protection',
                percentage: 0,
                features: [],
                recommended: false
              },
              {
                id: 'basic',
                title: 'Basic',
                percentage: 15,
                features: [
                  'VIP Support',
                  'Price Drop Protection',
                  'Flight Delay & Cancellation Coverage',
                  'Missed Connection Protection'
                ],
                recommended: false
              },
              {
                id: 'premium',
                title: 'Premium',
                percentage: 17,
                features: [
                  'Everything in Basic',
                  'Change Flight for Free',
                  'Cancel for Any Reason',
                  'All Agency Fees Waived'
                ],
                recommended: true
              }
            ]}
            selectedPlan={travelCarePlan}
            onPlanChange={(planId) => setTravelCarePlan(planId as TravelCarePlan)}
            baseFare={invoice ? Number(invoice.amount) : 0}
          />

          <div className="mb-8">
            <div className="bg-brand-blue text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
              <Briefcase className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">Lost Baggage Protection</h3>
                <p className="text-sm text-blue-100">Travel confidently, no lost luggage. Enjoy every moment!</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-b-lg p-6">
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    We will track and expedite the return of your undelivered bags by the airline
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Get <strong>$1,000 per bag</strong> (up to 2 bags) if your luggage is not delivered within 96 hours
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    No proof of baggage contents is required to receive our <strong>Satisfaction Guarantee Payment</strong>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded mr-2">
                        Recommended
                      </span>
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={baggageProtection}
                        onChange={(e) => setBaggageProtection(e.target.checked)}
                        className="w-4 h-4 text-brand-blue rounded"
                      />
                      <span className="text-sm text-gray-900">
                        Yes, I want to add Lost Baggage Protection for <strong>${(19.99 * invoice.passengers).toFixed(2)}</strong> (per person)
                        and I agree to the <a href="#" className="text-brand-blue hover:underline">Terms & Conditions</a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!baggageProtection}
                    onChange={(e) => setBaggageProtection(!e.target.checked)}
                    className="w-4 h-4 text-gray-400 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    No, I don't want to protect my bags
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                How was my service?
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                If you feel that the service provided was exceptional, you can express your gratitude (optional)
              </p>
            </div>

            <div className="border border-gray-200 rounded-b-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {getTipOptions().map((amount, index) => {
                  const labels = ['Average', 'Good', 'Great', 'Excellent', 'Perfect', 'Outstanding'];
                  return (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedTip(amount);
                        setCustomTip('');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedTip === amount
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-gray-900 mb-1">{labels[index]}</div>
                        <div className="text-lg font-bold text-blue-600">${amount.toFixed(2)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Think I did better?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const current = parseFloat(customTip) || 0;
                      if (current > 0) setCustomTip((current - 1).toFixed(2));
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={customTip}
                    onChange={(e) => {
                      setCustomTip(e.target.value);
                      setSelectedTip(null);
                    }}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-center text-lg font-semibold focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const current = parseFloat(customTip) || 0;
                      setCustomTip((current + 1).toFixed(2));
                    }}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={getTipAmount() > 0}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      setSelectedTip(null);
                      setCustomTip('');
                    }
                  }}
                  className="mt-0.5"
                />
                <span>
                  I agree, that this amount will be charged in addition to the cost of the airline ticket(s)
                </span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-medium">Base Flight Cost:</span>
              <span className="text-gray-900 font-semibold">${Number(invoice.amount).toFixed(2)}</span>
            </div>

            {travelCarePlan !== 'none' && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">
                  Travel Care Plan ({travelCarePlan === 'basic' ? 'Basic' : 'Premium'}):
                </span>
                <span className="text-gray-900 font-semibold">
                  ${getTravelCarePlanPrice(travelCarePlan as 'basic' | 'premium').toFixed(2)}
                </span>
              </div>
            )}

            {baggageProtection && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Lost Baggage Protection:</span>
                <span className="text-gray-900 font-semibold">
                  ${(19.99 * invoice.passengers).toFixed(2)}
                </span>
              </div>
            )}

            {getTipAmount() > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Service Tip:</span>
                <span className="text-gray-900 font-semibold">
                  ${getTipAmount().toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-gray-300 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-3xl font-bold text-brand-blue">
                  ${calculateTotalAmount().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">100% SAFE Purchase</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SSL</span>
              </div>
              <span className="text-sm">Optimum SSL Secure</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Proceed With Payment
          </button>
        </div>
      </div>
    </div>
  );
}
