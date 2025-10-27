import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  city: string;
  is_active: boolean;
  created_at: string;
}

export default function CustomersManagement() {
  const { adminProfile } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!adminProfile || (adminProfile.role !== 'admin' && adminProfile.role !== 'main_admin')) {
      navigate('/login');
      return;
    }
    fetchCustomers();
  }, [adminProfile, navigate]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage({ type: 'error', text: 'فشل تحميل العملاء' });
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (customerId: string) => {
    setPromoting(customerId);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/promote-to-admin`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to promote customer');
      }

      setMessage({ type: 'success', text: 'تم ترقية العميل إلى أدمن بنجاح!' });
      await fetchCustomers();
    } catch (error: any) {
      console.error('Error promoting customer:', error);
      setMessage({ type: 'error', text: error.message || 'فشل ترقية العميل' });
    } finally {
      setPromoting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-brand-blue to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
                <p className="text-sm text-gray-600">عرض وترقية العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                العملاء ({customers.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-blue"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">لا يوجد عملاء بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" dir="rtl">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">الهاتف</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">المدينة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">تاريخ التسجيل</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {customer.full_name || `${customer.first_name} ${customer.last_name}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.city || '-'}</td>
                      <td className="px-6 py-4">
                        {customer.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="w-4 h-4" />
                            نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-4 h-4" />
                            غير نشط
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => promoteToAdmin(customer.id)}
                          disabled={promoting === customer.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-blue to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {promoting === customer.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              جاري الترقية...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              ترقية لأدمن
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
