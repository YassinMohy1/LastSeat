import { useState, useEffect, useRef } from 'react';
import { Loader2, CreditCard, Lock } from 'lucide-react';

declare global {
  interface Window {
    CollectJS: {
      configure: (config: any) => void;
      startPaymentRequest: () => void;
    };
  }
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface NMIPaymentFormProps {
  amount: number;
  currency: string;
  invoiceNumber: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function NMIPaymentForm({
  amount,
  currency,
  invoiceNumber,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError
}: NMIPaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: customerName?.split(' ')[0] || '',
    lastName: customerName?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: customerPhone || '',
  });

  const paymentDataRef = useRef({ amount, currency, invoiceNumber, customerEmail, billingInfo });
  const billingInfoRef = useRef(billingInfo);
  const isProcessingRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const collectJSInitialized = useRef(false);

  useEffect(() => {
    billingInfoRef.current = billingInfo;
  }, [billingInfo]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    paymentDataRef.current = {
      amount,
      currency,
      invoiceNumber,
      customerEmail,
      billingInfo: billingInfoRef.current
    };
  }, [amount, currency, invoiceNumber, customerEmail]);

  useEffect(() => {
    const tokenizationKey = import.meta.env.VITE_NMI_TOKENIZATION_KEY;

    if (!tokenizationKey || tokenizationKey === 'YOUR_PUBLIC_TOKENIZATION_KEY_HERE') {
      onErrorRef.current('Payment system is not configured. Please contact support.');
      return;
    }

    if (document.querySelector('script[src*="Collect.js"]')) {
      if (window.CollectJS) {
        setScriptLoaded(true);
        return;
      }
    }

    const script = document.createElement('script');
    script.src = 'https://secure.nmi.com/token/Collect.js';
    script.setAttribute('data-tokenization-key', tokenizationKey);
    script.async = false;

    script.onload = () => {
      console.log('Collect.js loaded successfully');
      setTimeout(() => {
        setScriptLoaded(true);
      }, 200);
    };

    script.onerror = () => {
      onErrorRef.current('Failed to load payment system. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="Collect.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (scriptLoaded && window.CollectJS && !configured && !collectJSInitialized.current) {
      console.log('Configuring CollectJS for the first time...');
      collectJSInitialized.current = true;

      try {
        window.CollectJS.configure({
          variant: 'inline',
          styleSniffer: false,
          googleFont: 'Roboto:400',
          customCss: {
            'border': '1px solid #d1d5db',
            'border-radius': '0.5rem',
            'padding': '0.75rem',
            'font-size': '1rem',
            'color': '#111827',
            'background-color': '#ffffff',
            '::placeholder': {
              'color': '#9ca3af'
            },
            ':focus': {
              'border-color': '#2563eb',
              'outline': 'none'
            }
          },
          fields: {
            ccnumber: {
              placeholder: '1234 5678 9012 3456',
              selector: '#ccnumber'
            },
            ccexp: {
              placeholder: 'MM / YY',
              selector: '#ccexp'
            },
            cvv: {
              placeholder: 'CVV',
              selector: '#cvv'
            }
          },
          callback: async (response: any) => {
            // Check if already processing
            if (isProcessingRef.current) {
              console.log('Payment already being processed, ignoring duplicate callback');
              return;
            }

            // Check if we've already processed this exact token
            if (lastTokenRef.current === response.token) {
              console.log('Duplicate token detected, ignoring:', response.token);
              return;
            }

            // Immediately set to true and store token before any async operations
            isProcessingRef.current = true;
            lastTokenRef.current = response.token;

            try {
              if (response.token) {
                setPaymentSubmitted(true);
                console.log('Processing payment with token:', response.token);

                const result = await fetch(
                  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nmi-process-payment`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                      paymentToken: response.token,
                      amount: paymentDataRef.current.amount,
                      currency: paymentDataRef.current.currency,
                      invoiceNumber: paymentDataRef.current.invoiceNumber,
                      customerEmail: paymentDataRef.current.customerEmail,
                      billingInfo: billingInfoRef.current,
                    }),
                  }
                );

                const data = await result.json();

                // Check if 3DS authentication is required
                if (data.requires3DS && data.redirectUrl) {
                  console.log('Redirecting to 3DS authentication:', data.redirectUrl);
                  window.location.href = data.redirectUrl;
                  return;
                }

                if (!result.ok || !data.success) {
                  throw new Error(data.error || 'Payment failed');
                }

                onSuccessRef.current();
              } else {
                throw new Error('Failed to tokenize payment information');
              }
            } catch (err: any) {
              console.error('Payment processing error:', err);
              onErrorRef.current(err.message || 'Payment processing failed');
              setProcessing(false);
              setPaymentSubmitted(false);
              isProcessingRef.current = false;
            }
          },
          validationCallback: (field: string, status: boolean, message: string) => {
            if (!status) {
              console.log(`Field ${field} validation: ${message}`);
            }
          },
          fieldsAvailableCallback: () => {
            console.log('Payment fields are ready');
          }
        });
        setConfigured(true);
        console.log('CollectJS configured successfully');
      } catch (err: any) {
        console.error('CollectJS configuration error:', err);
        onErrorRef.current('Failed to initialize payment fields');
      }
    }
  }, [scriptLoaded, configured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (processing || paymentSubmitted || isProcessingRef.current) {
      console.log('Payment already in progress');
      return;
    }

    // Validate billing info for 3DS
    if (!billingInfo.address || !billingInfo.city || !billingInfo.zip) {
      onError('Please fill in all billing information for secure payment processing.');
      return;
    }

    if (!scriptLoaded || !window.CollectJS) {
      onError('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    try {
      console.log('Starting payment request...');
      setProcessing(true);
      window.CollectJS.startPaymentRequest();
    } catch (err: any) {
      console.error('Error starting payment request:', err);
      onError('Failed to process payment. Please try again.');
      setProcessing(false);
      isProcessingRef.current = false;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-brand-blue" />
        <h3 className="text-lg font-bold text-gray-900">بطاقة الائتمان / Visa</h3>
      </div>

      {!scriptLoaded && (
        <div className="text-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-brand-blue mx-auto mb-2" />
          <p className="text-sm text-gray-600">جاري تحميل نظام الدفع...</p>
        </div>
      )}

      <form id="nmi-payment-form" onSubmit={handleSubmit} style={{ display: scriptLoaded ? 'block' : 'none' }}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الأول
              </label>
              <input
                type="text"
                value={billingInfo.firstName}
                onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم العائلة
              </label>
              <input
                type="text"
                value={billingInfo.lastName}
                onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان
            </label>
            <input
              type="text"
              value={billingInfo.address}
              onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <input
                type="text"
                value={billingInfo.city}
                onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الرمز البريدي
              </label>
              <input
                type="text"
                value={billingInfo.zip}
                onChange={(e) => setBillingInfo({ ...billingInfo, zip: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">معلومات البطاقة</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم البطاقة
                </label>
                <div id="ccnumber"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الانتهاء
                  </label>
                  <div id="ccexp"></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <div id="cvv"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
            <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p>معلومات الدفع الخاصة بك محمية بتشفير 3D Secure</p>
          </div>

          <button
            type="submit"
            disabled={processing || paymentSubmitted}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              processing || paymentSubmitted
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-blue hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري معالجة الدفع...
              </span>
            ) : (
              `ادفع ${currency} ${amount.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
