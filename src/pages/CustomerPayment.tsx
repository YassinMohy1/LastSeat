import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NMIPaymentForm from '../components/NMIPaymentForm';
import {
  Plane,
  Calendar,
  Users,
  CreditCard,
  Building2,
  CheckCircle,
  Loader2,
  AlertCircle
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

export default function CustomerPayment() {
  const { paymentLink } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'bank' | null>(null);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [bankTransferSuccess, setBankTransferSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
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
      if (!data) throw new Error('الفاتورة غير موجودة');

      setInvoice(data);
    } catch (err: any) {
      setError(err.message || 'فشل تحميل الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = async (method: 'visa' | 'bank') => {
    setPaymentMethod(method);
  };

  const handlePaymentSuccess = async () => {
    try {
      await supabase
        .from('invoices')
        .update({ payment_status: 'paid' })
        .eq('id', invoice!.id);
      setPaymentSuccess(true);
    } catch (err: any) {
      console.error('Error updating payment status:', err);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleBankTransferConfirm = async () => {
    try {
      await supabase
        .from('invoices')
        .update({
          payment_status: 'pending',
          payment_method: 'bank_transfer',
        })
        .eq('id', invoice!.id);

      setBankTransferSuccess(true);
    } catch (err: any) {
      setError(err.message || 'فشل تأكيد التحويل');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  if (invoice.payment_status === 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم الدفع مسبقاً</h2>
          <p className="text-gray-600">هذه الفاتورة تم دفعها بالفعل</p>
        </div>
      </div>
    );
  }

  if (processingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري تحويلك لصفحة الدفع الآمنة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-blue to-blue-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white mb-2">فاتورة رقم {invoice.invoice_number}</h1>
            <p className="text-blue-100">أكمل الدفع لإتمام حجزك</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">تفاصيل الحجز</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Plane className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{invoice.flight_from} → {invoice.flight_to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <div>
                      <p className="text-sm">المغادرة: {new Date(invoice.departure_date).toLocaleDateString('ar-EG')}</p>
                      {invoice.return_date && (
                        <p className="text-sm">العودة: {new Date(invoice.return_date).toLocaleDateString('ar-EG')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Users className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <p>{invoice.passengers} مسافر - {invoice.cabin_class}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">المبلغ الإجمالي:</span>
                    <span className="text-3xl font-bold text-brand-blue">
                      ${Number(invoice.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">طريقة الدفع</h2>

                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold mb-1">خطأ في الدفع</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {!paymentMethod ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => handlePaymentMethodSelect('visa')}
                      disabled={processingPayment}
                      className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-brand-blue hover:bg-blue-50 transition-all text-right group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-brand-blue/10 p-3 rounded-lg group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          <CreditCard className="w-6 h-6 text-brand-blue group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">بطاقة الائتمان / Visa</p>
                          <p className="text-sm text-gray-600">ادفع بأمان باستخدام بطاقتك</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handlePaymentMethodSelect('bank')}
                      disabled={processingPayment}
                      className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-brand-blue hover:bg-blue-50 transition-all text-right group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-brand-blue/10 p-3 rounded-lg group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          <Building2 className="w-6 h-6 text-brand-blue group-hover:text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">تحويل بنكي</p>
                          <p className="text-sm text-gray-600">حول المبلغ مباشرة إلى حسابنا</p>
                        </div>
                      </div>
                    </button>
                  </div>
                ) : paymentMethod === 'visa' ? (
                  <div>
                    <button
                      onClick={() => setPaymentMethod(null)}
                      className="text-sm text-brand-blue hover:underline mb-4"
                    >
                      ← تغيير طريقة الدفع
                    </button>

                    {paymentSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">تم الدفع بنجاح!</h3>
                        <p className="text-gray-600">شكراً لك. سيتم التواصل معك قريباً لتأكيد الحجز.</p>
                      </div>
                    ) : (
                      <NMIPaymentForm
                        amount={invoice.amount}
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
                ) : paymentMethod === 'bank' ? (
                  <div>
                    <button
                      onClick={() => setPaymentMethod(null)}
                      className="text-sm text-brand-blue hover:underline mb-4"
                    >
                      ← تغيير طريقة الدفع
                    </button>

                    {bankTransferSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">تم استلام طلبك!</h3>
                        <p className="text-gray-600">سيتم تأكيد الدفع خلال 24 ساعة</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                          <h3 className="font-bold text-gray-900 mb-3">معلومات الحساب البنكي:</h3>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>البنك:</strong> بنك مصر</p>
                            <p><strong>رقم الحساب:</strong> 1234567890</p>
                            <p><strong>IBAN:</strong> EG12 0000 1234 5678 9012 3456 789</p>
                            <p><strong>المبلغ:</strong> ${Number(invoice.amount).toFixed(2)}</p>
                            <p><strong>الرجاء ذكر:</strong> {invoice.invoice_number}</p>
                          </div>
                        </div>

                        <button
                          onClick={handleBankTransferConfirm}
                          className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-4 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]"
                        >
                          تأكيد إتمام التحويل
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-3">
                          بالضغط على "تأكيد"، أنت تؤكد أنك قمت بتحويل المبلغ
                        </p>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {invoice.notes && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-700">
                  <strong>ملاحظات:</strong> {invoice.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
