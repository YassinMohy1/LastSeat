'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Plane,
  Calendar,
  Users,
  DollarSign,
  Mail,
  Phone,
  User,
  FileText,
  Loader2
} from 'lucide-react';

interface StopDetail {
  city: string;
  airport: string;
  duration: string;
}

export default function CreateInvoice() {
  const { user, adminProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    flightFrom: '',
    flightTo: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    cabinClass: 'Economy',
    amount: '',
    currency: 'USD',
    notes: '',
    outboundDepartureTime: '',
    outboundArrivalTime: '',
    outboundDuration: '',
    outboundStops: '0',
    outboundStopsInfo: '',
    returnDepartureTime: '',
    returnArrivalTime: '',
    returnDuration: '',
    returnStops: '0',
    returnStopsInfo: ''
  });

  const [outboundStopsDetails, setOutboundStopsDetails] = useState<StopDetail[]>([]);
  const [returnStopsDetails, setReturnStopsDetails] = useState<StopDetail[]>([]);

  useEffect(() => {
    if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.role !== 'main_admin')) {
      router.push('/login');
    }
  }, [adminProfile, router]);

  if (!adminProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-blue"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Update stops details arrays when stops count changes
    if (name === 'outboundStops') {
      const count = parseInt(value);
      setOutboundStopsDetails(Array(count).fill({ city: '', airport: '', duration: '' }));
    } else if (name === 'returnStops') {
      const count = parseInt(value);
      setReturnStopsDetails(Array(count).fill({ city: '', airport: '', duration: '' }));
    }
  };

  const updateStopDetail = (type: 'outbound' | 'return', index: number, field: keyof StopDetail, value: string) => {
    if (type === 'outbound') {
      const updated = [...outboundStopsDetails];
      updated[index] = { ...updated[index], [field]: value };
      setOutboundStopsDetails(updated);
    } else {
      const updated = [...returnStopsDetails];
      updated[index] = { ...updated[index], [field]: value };
      setReturnStopsDetails(updated);
    }
  };

  const generateInvoiceNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${timestamp}-${random}`;
  };

  const generatePaymentLink = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const invoiceNumber = generateInvoiceNumber();
      const paymentLink = generatePaymentLink();

      const { error: insertError, data: insertedData } = await supabase
        .from('invoices')
        .insert([
          {
            invoice_number: invoiceNumber,
            admin_id: user?.id,
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            flight_from: formData.flightFrom,
            flight_to: formData.flightTo,
            departure_date: formData.departureDate,
            return_date: formData.returnDate || null,
            passengers: parseInt(formData.passengers),
            cabin_class: formData.cabinClass,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            payment_status: 'pending',
            payment_link: paymentLink,
            notes: formData.notes || null,
            outbound_departure_time: formData.outboundDepartureTime || null,
            outbound_arrival_time: formData.outboundArrivalTime || null,
            outbound_duration: formData.outboundDuration || null,
            outbound_stops: parseInt(formData.outboundStops) || 0,
            outbound_stops_info: formData.outboundStopsInfo || null,
            return_departure_time: formData.returnDepartureTime || null,
            return_arrival_time: formData.returnArrivalTime || null,
            return_duration: formData.returnDuration || null,
            return_stops: parseInt(formData.returnStops) || 0,
            return_stops_info: formData.returnStopsInfo || null,
            outbound_stops_details: outboundStopsDetails.length > 0 ? outboundStopsDetails : [],
            return_stops_details: returnStopsDetails.length > 0 ? returnStopsDetails : [],
            created_by_admin_id: adminProfile?.id,
            created_by_admin_email: adminProfile?.email
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Log the invoice creation
      if (insertedData && adminProfile) {
        await supabase.from('audit_logs').insert({
          admin_id: adminProfile.id,
          admin_email: adminProfile.email,
          action_type: 'create_invoice',
          entity_type: 'invoice',
          entity_id: insertedData.id,
          details: {
            invoice_number: invoiceNumber,
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            amount: parseFloat(formData.amount),
            currency: formData.currency,
            flight_from: formData.flightFrom,
            flight_to: formData.flightTo
          }
        });
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-brand-blue to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">إنشاء فاتورة جديدة</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-blue" />
              معلومات العميل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم العميل</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    placeholder="+20 123 456 7890"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plane className="w-5 h-5 text-brand-blue" />
              معلومات الرحلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">من</label>
                <input
                  type="text"
                  name="flightFrom"
                  value={formData.flightFrom}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  placeholder="القاهرة (CAI)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">إلى</label>
                <input
                  type="text"
                  name="flightTo"
                  value={formData.flightTo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  placeholder="دبي (DXB)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ المغادرة</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تاريخ العودة (اختياري)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">عدد المسافرين</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الدرجة</label>
                <select
                  name="cabinClass"
                  value={formData.cabinClass}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none"
                >
                  <option value="Economy">الاقتصادية - Economy</option>
                  <option value="Business">رجال الأعمال - Business</option>
                  <option value="First Class">الدرجة الأولى - First Class</option>
                </select>
              </div>
            </div>

            {/* Flight Details - Outbound */}
            <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-blue" />
                تفاصيل رحلة الذهاب
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">وقت الإقلاع</label>
                  <input
                    type="time"
                    name="outboundDepartureTime"
                    value={formData.outboundDepartureTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">وقت الوصول</label>
                  <input
                    type="time"
                    name="outboundArrivalTime"
                    value={formData.outboundArrivalTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">مدة الرحلة</label>
                  <input
                    type="text"
                    name="outboundDuration"
                    value={formData.outboundDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    placeholder="مثال: 5h 30m"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">عدد المحطات</label>
                  <select
                    name="outboundStops"
                    value={formData.outboundStops}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none"
                  >
                    <option value="0">مباشر (0 محطة)</option>
                    <option value="1">1 محطة</option>
                    <option value="2">2 محطة</option>
                    <option value="3">3 محطات</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">معلومات المحطات (نص مختصر)</label>
                  <input
                    type="text"
                    name="outboundStopsInfo"
                    value={formData.outboundStopsInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    placeholder="مثال: 2 Stops"
                    disabled={formData.outboundStops === '0'}
                  />
                </div>
              </div>

              {/* Detailed Stops Information */}
              {parseInt(formData.outboundStops) > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">تفاصيل المحطات (ستظهر في Tooltip)</h4>
                  {outboundStopsDetails.map((stop, index) => (
                    <div key={index} className="mb-3 p-3 bg-white rounded border border-blue-100">
                      <p className="text-xs font-semibold text-blue-600 mb-2">محطة {index + 1}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">المدينة</label>
                          <input
                            type="text"
                            value={stop.city}
                            onChange={(e) => updateStopDetail('outbound', index, 'city', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                            placeholder="Dubai"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">كود المطار</label>
                          <input
                            type="text"
                            value={stop.airport}
                            onChange={(e) => updateStopDetail('outbound', index, 'airport', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                            placeholder="DXB"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">مدة الانتظار</label>
                          <input
                            type="text"
                            value={stop.duration}
                            onChange={(e) => updateStopDetail('outbound', index, 'duration', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                            placeholder="2h 30m"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flight Details - Return */}
            {formData.returnDate && (
              <div className="mt-4 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-green-600 transform rotate-180" />
                  تفاصيل رحلة العودة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">وقت الإقلاع</label>
                    <input
                      type="time"
                      name="returnDepartureTime"
                      value={formData.returnDepartureTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">وقت الوصول</label>
                    <input
                      type="time"
                      name="returnArrivalTime"
                      value={formData.returnArrivalTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">مدة الرحلة</label>
                    <input
                      type="text"
                      name="returnDuration"
                      value={formData.returnDuration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="مثال: 6h 15m"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">عدد المحطات</label>
                    <select
                      name="returnStops"
                      value={formData.returnStops}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none"
                    >
                      <option value="0">مباشر (0 محطة)</option>
                      <option value="1">1 محطة</option>
                      <option value="2">2 محطة</option>
                      <option value="3">3 محطات</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">معلومات المحطات (نص مختصر)</label>
                    <input
                      type="text"
                      name="returnStopsInfo"
                      value={formData.returnStopsInfo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="مثال: 1 Stop"
                      disabled={formData.returnStops === '0'}
                    />
                  </div>
                </div>

                {/* Detailed Stops Information for Return */}
                {parseInt(formData.returnStops) > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">تفاصيل المحطات (ستظهر في Tooltip)</h4>
                    {returnStopsDetails.map((stop, index) => (
                      <div key={index} className="mb-3 p-3 bg-white rounded border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 mb-2">محطة {index + 1}</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">المدينة</label>
                            <input
                              type="text"
                              value={stop.city}
                              onChange={(e) => updateStopDetail('return', index, 'city', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                              placeholder="Dubai"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">كود المطار</label>
                            <input
                              type="text"
                              value={stop.airport}
                              onChange={(e) => updateStopDetail('return', index, 'airport', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                              placeholder="DXB"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">مدة الانتظار</label>
                            <input
                              type="text"
                              value={stop.duration}
                              onChange={(e) => updateStopDetail('return', index, 'duration', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-brand-blue focus:outline-none"
                              placeholder="30m"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-blue" />
              معلومات الدفع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">المبلغ</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">العملة</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all appearance-none"
                >
                  <option value="USD">USD - دولار أمريكي</option>
                  <option value="EUR">EUR - يورو</option>
                  <option value="GBP">GBP - جنيه إسترليني</option>
                  <option value="EGP">EGP - جنيه مصري</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">ملاحظات (اختياري)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all resize-none"
                  placeholder="أي معلومات إضافية..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  إنشاء الفاتورة
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
