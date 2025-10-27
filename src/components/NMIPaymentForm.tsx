import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (!window.CollectJS) {
        throw new Error('Payment system not loaded. Please refresh the page.');
      }

      window.CollectJS.configure({
        paymentSelector: '#nmi-payment-form',
        variant: 'inline',
        styleSniffer: false,
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
            console.log(`Field ${field} validation error: ${message}`);
          }
        },
        fieldsAvailableCallback: () => {
          console.log('Payment fields are ready');
        },
        price: amount.toFixed(2),
        currency: currency.toUpperCase(),
      });
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      onError(err.message || 'Failed to initialize payment');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-brand-blue" />
        <h3 className="text-lg font-bold text-gray-900">بطاقة الائتمان / Visa</h3>
      </div>

      <form id="nmi-payment-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم البطاقة
            </label>
            <div id="ccnumber" className="border border-gray-300 rounded-lg p-3 bg-white"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الانتهاء
              </label>
              <div id="ccexp" className="border border-gray-300 rounded-lg p-3 bg-white"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div id="cvv" className="border border-gray-300 rounded-lg p-3 bg-white"></div>
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
