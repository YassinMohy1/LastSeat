import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NMIPaymentForm from '../components/NMIPaymentForm';
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

  const calculateTotalAmount = (): number => {
    if (!invoice) return 0;

    let total = Number(invoice.amount);

    if (travelCarePlan === 'basic') {
      total += 220;
    } else if (travelCarePlan === 'premium') {
      total += 253;
    }

    if (baggageProtection) {
      total += 19.99 * invoice.passengers;
    }

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
                      ${travelCarePlan === 'basic' ? '220.00' : '253.00'}
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

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">{new Date(invoice.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-2xl font-bold text-gray-900">12:30 PM</p>
                  <p className="text-gray-600">{invoice.flight_from}</p>
                </div>

                <div className="flex-1 px-8">
                  <div className="relative">
                    <div className="h-0.5 bg-gray-300"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                      <Plane className="w-6 h-6 text-brand-blue transform rotate-90" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-orange-500 mt-2">1 Stop</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">{new Date(invoice.departure_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-2xl font-bold text-gray-900">11:50 PM</p>
                  <p className="text-gray-600">{invoice.flight_to}</p>
                </div>
              </div>
            </div>

            {invoice.return_date && (
              <>
                <h3 className="text-xl font-semibold text-brand-blue mb-4 mt-8">Return Flight</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-600">{new Date(invoice.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-2xl font-bold text-gray-900">12:30 PM</p>
                      <p className="text-gray-600">{invoice.flight_to}</p>
                    </div>

                    <div className="flex-1 px-8">
                      <div className="relative">
                        <div className="h-0.5 bg-gray-300"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                          <Plane className="w-6 h-6 text-brand-blue transform -rotate-90" />
                        </div>
                      </div>
                      <p className="text-center text-sm text-orange-500 mt-2">1 Stop</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date(invoice.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-2xl font-bold text-gray-900">1:10 AM</p>
                      <p className="text-gray-600">{invoice.flight_from}</p>
                    </div>
                  </div>
                </div>
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

          <div className="mb-8">
            <div className="bg-green-500 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">Choose the Travel Care plan</h3>
                <p className="text-sm text-green-50">that's right for you</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-b-lg overflow-hidden">
              <div className="grid grid-cols-3">
                <div className="p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-2">Features</h4>
                </div>
                <div className="p-6 bg-white border-l border-gray-200 text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Basic</h4>
                  <p className="text-2xl font-bold text-brand-blue">$220.00</p>
                </div>
                <div className="p-6 bg-white border-l border-gray-200 text-center relative">
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                    Most Popular
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Premium</h4>
                  <p className="text-2xl font-bold text-brand-blue">$253.00</p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-gray-200">
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">VIP Support & Flight Delay Rebooking</p>
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-gray-200">
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">Change for Free</p>
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <X className="w-6 h-6 text-gray-300 mx-auto" />
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <Check className="w-6 h-6 text-green-500 mx-auto" />
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-gray-200">
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-700">Select Plan</p>
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelCare"
                      value="basic"
                      checked={travelCarePlan === 'basic'}
                      onChange={() => setTravelCarePlan('basic')}
                      className="w-4 h-4 text-brand-blue"
                    />
                    <span className="text-sm">Add</span>
                  </label>
                </div>
                <div className="p-4 bg-white border-l border-gray-200 text-center">
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelCare"
                      value="premium"
                      checked={travelCarePlan === 'premium'}
                      onChange={() => setTravelCarePlan('premium')}
                      className="w-4 h-4 text-brand-blue"
                    />
                    <span className="text-sm font-semibold">Added</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-gray-200">
                <div className="p-4 bg-gray-50 col-span-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="travelCare"
                      value="none"
                      checked={travelCarePlan === 'none'}
                      onChange={() => setTravelCarePlan('none')}
                      className="w-4 h-4 text-gray-400"
                    />
                    <span className="text-sm text-green-600">
                      No, thanks. I choose not to add Travel Care Plan and take all the risks on myself.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

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
                        Optional add-on
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
                  ${travelCarePlan === 'basic' ? '220.00' : '253.00'}
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
