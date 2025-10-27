import { useState, useEffect } from 'react';
import { Loader2, CreditCard, Lock } from 'lucide-react';

declare global {
  interface Window {
    CollectJS: {
      configure: (config: any) => void;
    };
  }
}

interface NMIPaymentFormProps {
  amount: number;
  currency: string;
  invoiceNumber: string;
  customerEmail: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function NMIPaymentForm({
  amount,
  currency,
  invoiceNumber,
  customerEmail,
  onSuccess,
  onError
}: NMIPaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const tokenizationKey = import.meta.env.VITE_NMI_TOKENIZATION_KEY;

    if (!tokenizationKey || tokenizationKey === 'YOUR_PUBLIC_TOKENIZATION_KEY_HERE') {
      onError('Payment system is not configured. Please contact support.');
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
      onError('Failed to load payment system. Please refresh the page.');
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
    if (scriptLoaded && window.CollectJS) {
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
            try {
              if (response.token) {
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
                      amount,
                      currency,
                      invoiceNumber,
                      customerEmail,
                    }),
                  }
                );

                const data = await result.json();

                if (!result.ok || !data.success) {
                  throw new Error(data.error || 'Payment failed');
                }

                onSuccess();
              } else {
                throw new Error('Failed to tokenize payment information');
              }
            } catch (err: any) {
              console.error('Payment processing error:', err);
              onError(err.message || 'Payment processing failed');
              setProcessing(false);
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
      } catch (err: any) {
        console.error('CollectJS configuration error:', err);
        onError('Failed to initialize payment fields');
      }
    }
  }, [scriptLoaded, amount, currency, invoiceNumber, customerEmail, onSuccess, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scriptLoaded || !window.CollectJS) {
      onError('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    setProcessing(true);
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

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
            <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p>معلومات الدفع الخاصة بك محمية بتشفير آمن</p>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
              processing
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
