import { useState, useEffect, useRef } from 'react';
import { Loader2, CreditCard, Lock, X } from 'lucide-react';

declare global {
  interface Window {
    CollectJS: {
      configure: (config: any) => void;
      startPaymentRequest: () => void;
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
  const [show3DsModal, setShow3DsModal] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

                // Check if 3D Secure authentication is required
                if (data.requiresAuth && data.authUrl) {
                  console.log('3DS authentication required, opening modal');
                  setAuthUrl(data.authUrl);
                  setShow3DsModal(true);
                  return;
                }

                if (!result.ok || !data.success) {
                  throw new Error(data.error || 'Payment failed');
                }

                console.log('Payment successful:', data);
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

  // Listen for 3DS authentication completion
  useEffect(() => {
    const handle3DsMessage = (event: MessageEvent) => {
      // Check if message is from NMI 3DS iframe
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          if (data.event === '3ds-authentication') {
            console.log('3DS authentication completed:', data);
            setShow3DsModal(false);
            setAuthUrl(null);

            if (data.success) {
              onSuccess();
            } else {
              onError('Authentication failed. Please try again.');
              setProcessing(false);
            }
          }
        } catch (e) {
          // Not a JSON message, ignore
        }
      }
    };

    window.addEventListener('message', handle3DsMessage);
    return () => window.removeEventListener('message', handle3DsMessage);
  }, [onSuccess, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scriptLoaded || !window.CollectJS) {
      onError('Payment system is not ready. Please wait a moment and try again.');
      return;
    }

    try {
      setProcessing(true);
      window.CollectJS.startPaymentRequest();
    } catch (err: any) {
      console.error('Error starting payment request:', err);
      onError('Failed to process payment. Please try again.');
      setProcessing(false);
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

      {/* 3D Secure Authentication Modal */}
      {show3DsModal && authUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">تأكيد الدفع من البنك</h3>
              </div>
              <button
                onClick={() => {
                  setShow3DsModal(false);
                  setAuthUrl(null);
                  setProcessing(false);
                  onError('Authentication cancelled');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  البنك بتاعك بيطلب منك تأكيد الدفع. الرجاء إدخال الكود اللي وصلك على موبايلك أو من تطبيق البنك.
                </p>
              </div>

              <iframe
                ref={iframeRef}
                src={authUrl}
                className="w-full h-[500px] border border-gray-200 rounded-lg"
                title="3D Secure Authentication"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
