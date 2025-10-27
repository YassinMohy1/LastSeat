import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ToastContainer';
import {
  LogOut,
  Plus,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Copy,
  Check,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  AlertCircle,
  Activity,
  Shield
} from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  flight_from: string;
  flight_to: string;
  departure_date: string;
  return_date: string | null;
  passengers: number;
  cabin_class: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method: string | null;
  payment_link: string;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  created_by_admin_id: string | null;
  created_by_admin_email: string | null;
}

interface AuditLog {
  id: string;
  admin_id: string;
  admin_email: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { adminProfile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    cancelled: 0,
    revenue: 0,
    todayRevenue: 0,
    monthRevenue: 0
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditStats, setAuditStats] = useState({
    totalActions: 0,
    invoicesCreated: 0,
    invoicesPaid: 0,
    invoicesCancelled: 0,
    invoicesDeleted: 0,
    uniqueAdmins: 0
  });
  const isMainAdmin = adminProfile?.role === 'main_admin';

  useEffect(() => {
    if (authLoading) return;

    if (!adminProfile) {
      navigate('/login', { replace: true });
      return;
    }

    if (adminProfile.role !== 'admin' && adminProfile.role !== 'main_admin') {
      navigate('/', { replace: true });
      return;
    }

    fetchInvoices();
    if (adminProfile.role === 'main_admin') {
      fetchAuditLogs();
    }
  }, [authLoading, adminProfile, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-blue"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!adminProfile) {
    return null;
  }

  useEffect(() => {
    filterInvoices();
  }, [searchQuery, statusFilter, dateFilter, invoices]);

  const fetchInvoices = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setInvoices(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setAuditLogs(data || []);

      // Calculate audit statistics
      const stats = {
        totalActions: data?.length || 0,
        invoicesCreated: data?.filter(log => log.action_type === 'create_invoice').length || 0,
        invoicesPaid: data?.filter(log => log.action_type === 'update_invoice_status' && log.details?.new_status === 'paid').length || 0,
        invoicesCancelled: data?.filter(log => log.action_type === 'update_invoice_status' && log.details?.new_status === 'cancelled').length || 0,
        invoicesDeleted: data?.filter(log => log.action_type === 'delete_invoice').length || 0,
        uniqueAdmins: new Set(data?.map(log => log.admin_email)).size || 0
      };
      setAuditStats(stats);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const logAdminAction = async (actionType: string, entityType: string, entityId: string, details: any = {}) => {
    try {
      await supabase.from('audit_logs').insert({
        admin_id: adminProfile?.id,
        admin_email: adminProfile?.email || '',
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        details: details
      });

      if (isMainAdmin) {
        fetchAuditLogs();
      }
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const calculateStats = (data: Invoice[]) => {
    const total = data.length;
    const pending = data.filter(inv => inv.payment_status === 'pending').length;
    const paid = data.filter(inv => inv.payment_status === 'paid').length;
    const cancelled = data.filter(inv => inv.payment_status === 'cancelled').length;

    const revenue = data
      .filter(inv => inv.payment_status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const today = new Date().toDateString();
    const todayRevenue = data
      .filter(inv => inv.payment_status === 'paid' && inv.paid_at && new Date(inv.paid_at).toDateString() === today)
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthRevenue = data
      .filter(inv => {
        if (inv.payment_status === 'paid' && inv.paid_at) {
          const paidDate = new Date(inv.paid_at);
          return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
        }
        return false;
      })
      .reduce((sum, inv) => sum + Number(inv.amount), 0);

    setStats({ total, pending, paid, cancelled, revenue, todayRevenue, monthRevenue });
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoice_number.toLowerCase().includes(query) ||
        inv.customer_name.toLowerCase().includes(query) ||
        inv.customer_email.toLowerCase().includes(query) ||
        inv.flight_from.toLowerCase().includes(query) ||
        inv.flight_to.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.payment_status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(inv => {
        const createdDate = new Date(inv.created_at);
        switch (dateFilter) {
          case 'today':
            return createdDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return createdDate >= weekAgo;
          case 'month':
            return createdDate.getMonth() === now.getMonth() &&
                   createdDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredInvoices(filtered);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج بنجاح');
    window.location.href = '/login';
  };

  const copyPaymentLink = (invoiceId: string, paymentLink: string) => {
    const fullLink = `${window.location.origin}/pay/${paymentLink}`;
    navigator.clipboard.writeText(fullLink);
    toast.success('Payment link copied to clipboard!');
    setCopiedId(invoiceId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const updateData: any = { payment_status: newStatus };
      if (newStatus === 'paid' && !invoices.find(i => i.id === invoiceId)?.paid_at) {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;

      await logAdminAction('update_invoice_status', 'invoice', invoiceId, {
        old_status: invoices.find(i => i.id === invoiceId)?.payment_status,
        new_status: newStatus
      });

      toast.success('Invoice status updated successfully!');
      await fetchInvoices();
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      await logAdminAction('delete_invoice', 'invoice', invoiceId, {
        invoice_number: invoices.find(i => i.id === invoiceId)?.invoice_number
      });

      toast.success('Invoice deleted successfully!');
      await fetchInvoices();
      setSelectedInvoice(null);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    const labels = {
      pending: 'قيد الانتظار',
      paid: 'مدفوعة',
      cancelled: 'ملغية'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-brand-blue to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-xs text-gray-600">مرحباً، {adminProfile?.full_name}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {isMainAdmin && (
                <button
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className="bg-white text-purple-600 border border-purple-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  السجل
                </button>
              )}
              <button
                onClick={() => navigate('/admin/customers')}
                className="bg-white text-brand-blue border border-brand-blue px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-blue hover:text-white transition-all duration-300 flex items-center gap-1"
              >
                <Users className="w-3 h-3" />
                العملاء
              </button>
              <button
                onClick={() => navigate('/admin/inquiries')}
                className="bg-white text-green-600 border border-green-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                استفسارات
              </button>
              <button
                onClick={() => navigate('/admin/flight-inquiries')}
                className="bg-white text-orange-600 border border-orange-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                طلبات
              </button>
              <button
                onClick={() => navigate('/admin/flight-prices')}
                className="bg-white text-amber-600 border border-amber-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300 flex items-center gap-1"
              >
                <DollarSign className="w-3 h-3" />
                أسعار
              </button>
              <button
                onClick={() => navigate('/admin/create-invoice')}
                className="bg-gradient-to-r from-brand-blue to-blue-600 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                جديد
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {isMainAdmin && showAuditLogs && (
          <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden mb-6">
            <div className="px-5 py-4 bg-gradient-to-r from-purple-600 to-purple-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">سجل الأنشطة الإدارية</h2>
                    <p className="text-purple-100 text-xs">تتبع شامل لجميع العمليات والأنشطة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuditLogs(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Activity className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.totalActions}</p>
                  <p className="text-purple-100 text-xs">إجمالي الأنشطة</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Plus className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.invoicesCreated}</p>
                  <p className="text-purple-100 text-xs">فواتير مُنشأة</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <CheckCircle className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.invoicesPaid}</p>
                  <p className="text-purple-100 text-xs">مدفوعة</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <XCircle className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.invoicesCancelled}</p>
                  <p className="text-purple-100 text-xs">ملغاة</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Trash2 className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.invoicesDeleted}</p>
                  <p className="text-purple-100 text-xs">محذوفة</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Users className="w-4 h-4 text-white mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{auditStats.uniqueAdmins}</p>
                  <p className="text-purple-100 text-xs">مدراء نشطين</p>
                </div>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Activity className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                  <p className="text-base font-semibold">لا توجد أنشطة مسجلة بعد</p>
                  <p className="text-sm text-gray-400 mt-1">سيتم عرض جميع الأنشطة هنا</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {auditLogs.map((log, index) => {
                    const actionIcons: Record<string, { icon: JSX.Element; color: string; label: string }> = {
                      'create_invoice': { icon: <Plus className="w-4 h-4" />, color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'إنشاء فاتورة' },
                      'update_invoice_status': {
                        icon: log.details?.new_status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />,
                        color: log.details?.new_status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200',
                        label: log.details?.new_status === 'paid' ? 'تأكيد دفع' : 'إلغاء فاتورة'
                      },
                      'delete_invoice': { icon: <Trash2 className="w-4 h-4" />, color: 'bg-red-50 text-red-600 border-red-200', label: 'حذف فاتورة' },
                      'update_invoice': { icon: <Edit className="w-4 h-4" />, color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'تعديل فاتورة' }
                    };

                    const action = actionIcons[log.action_type] || { icon: <Activity className="w-4 h-4" />, color: 'bg-gray-50 text-gray-600 border-gray-200', label: log.action_type };

                    return (
                      <div key={log.id} className="p-4 hover:bg-purple-50/30 transition-all duration-200">
                        <div className="flex items-start gap-4">
                          <div className={`${action.color} p-2.5 rounded-lg border flex-shrink-0`}>
                            {action.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 mb-1">{action.label}</h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                    <Users className="w-3 h-3" />
                                    {log.admin_email === 'system' ? 'النظام' : log.admin_email}
                                  </span>
                                  {log.details?.invoice_number && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                                      <FileText className="w-3 h-3" />
                                      {log.details.invoice_number}
                                    </span>
                                  )}
                                  {log.details?.customer_name && (
                                    <span className="text-xs text-gray-600">
                                      العميل: {log.details.customer_name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-left flex-shrink-0">
                                <div className="text-xs font-medium text-gray-700">
                                  {new Date(log.created_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(log.created_at).toLocaleTimeString('ar-EG', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            {(log.details?.amount || log.details?.old_status) && (
                              <div className="flex items-center gap-3 text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                                {log.details?.amount && (
                                  <span className="flex items-center gap-1 font-medium">
                                    <DollarSign className="w-3 h-3" />
                                    {formatCurrency(Number(log.details.amount))}
                                  </span>
                                )}
                                {log.details?.old_status && log.details?.new_status && (
                                  <span className="flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{log.details.old_status}</span>
                                    →
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{log.details.new_status}</span>
                                  </span>
                                )}
                                {log.details?.flight_from && log.details?.flight_to && (
                                  <span>{log.details.flight_from} → {log.details.flight_to}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-blue-100 text-xs font-medium">إجمالي الفواتير</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-100 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>جميع الفواتير المسجلة</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-yellow-100 text-xs font-medium">قيد الانتظار</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-100 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>في انتظار الدفع</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-green-100 text-xs font-medium">المدفوعة</p>
                <p className="text-2xl font-bold mt-1">{stats.paid}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-100 text-xs">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">{formatCurrency(stats.revenue)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-red-100 text-xs font-medium">الملغية</p>
                <p className="text-2xl font-bold mt-1">{stats.cancelled}</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 text-red-100 text-xs">
              <XCircle className="w-3 h-3" />
              <span>فواتير ملغاة</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">إيرادات اليوم</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.todayRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">إيرادات الشهر</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.monthRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">إجمالي الإيرادات</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.revenue)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-3 py-3 border-b border-gray-200">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">الفواتير</h2>
                <button
                  onClick={fetchInvoices}
                  disabled={refreshing}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث في الفواتير..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="all">كل الحالات</option>
                  <option value="pending">قيد الانتظار</option>
                  <option value="paid">مدفوعة</option>
                  <option value="cancelled">ملغية</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="all">كل الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">آخر أسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-brand-blue"></div>
              <p className="mt-3 text-gray-600 text-sm">جاري التحميل...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm mb-2">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'لا توجد نتائج مطابقة للبحث'
                  : 'لا توجد فواتير بعد'}
              </p>
              {!searchQuery && statusFilter === 'all' && dateFilter === 'all' && (
                <button
                  onClick={() => navigate('/admin/create-invoice')}
                  className="mt-3 text-brand-blue text-sm font-semibold hover:underline"
                >
                  إنشاء أول فاتورة
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" dir="rtl">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">رقم الفاتورة</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">العميل</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">الرحلة</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">تاريخ السفر</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">المبلغ</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">الحالة</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">المسؤول</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2">
                        <div className="text-xs font-medium text-gray-900">{invoice.invoice_number}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(invoice.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs font-medium text-gray-900">{invoice.customer_name}</div>
                        <div className="text-[10px] text-gray-500">{invoice.customer_email}</div>
                        {invoice.customer_phone && (
                          <div className="text-[10px] text-gray-500">{invoice.customer_phone}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-gray-900">{invoice.flight_from} ← {invoice.flight_to}</div>
                        <div className="text-[10px] text-gray-500">
                          {invoice.passengers} راكب • {invoice.cabin_class}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-gray-900">
                          {new Date(invoice.departure_date).toLocaleDateString('ar-EG')}
                        </div>
                        {invoice.return_date && (
                          <div className="text-[10px] text-gray-500">
                            العودة: {new Date(invoice.return_date).toLocaleDateString('ar-EG')}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs font-semibold text-gray-900">
                          {formatCurrency(Number(invoice.amount))}
                        </div>
                        {invoice.payment_method && (
                          <div className="text-[10px] text-gray-500">{invoice.payment_method}</div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {getStatusBadge(invoice.payment_status)}
                        {invoice.paid_at && (
                          <div className="text-[10px] text-gray-500 mt-1">
                            {new Date(invoice.paid_at).toLocaleDateString('ar-EG')}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <div className="bg-purple-100 p-1.5 rounded-full">
                            <Users className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-900">
                              {invoice.created_by_admin_email === 'system' ? 'النظام' : (invoice.created_by_admin_email?.split('@')[0] || 'غير معروف')}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {new Date(invoice.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => copyPaymentLink(invoice.id, invoice.payment_link)}
                            className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                            title="نسخ رابط الدفع"
                          >
                            {copiedId === invoice.id ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => window.open(`/pay/${invoice.payment_link}`, '_blank')}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="معاينة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {selectedInvoice === invoice.id && (
                              <div className="absolute left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="py-1">
                                  {invoice.payment_status === 'pending' && (
                                    <button
                                      onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                                      className="w-full px-3 py-1.5 text-right text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                      تحديد كمدفوعة
                                    </button>
                                  )}
                                  {invoice.payment_status !== 'cancelled' && (
                                    <button
                                      onClick={() => updateInvoiceStatus(invoice.id, 'cancelled')}
                                      className="w-full px-3 py-1.5 text-right text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      إلغاء الفاتورة
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteInvoice(invoice.id)}
                                    className="w-full px-3 py-1.5 text-right text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    حذف الفاتورة
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
