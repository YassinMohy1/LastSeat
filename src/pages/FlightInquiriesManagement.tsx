import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Plane,
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface FlightInquiry {
  id: string;
  flight_from: string;
  flight_to: string;
  departure_date: string;
  return_date: string | null;
  passengers: number;
  cabin_class: string;
  trip_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string | null;
  status: string;
  source: string;
  created_at: string;
}

export default function FlightInquiriesManagement() {
  const { adminProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<FlightInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<FlightInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!adminProfile || adminProfile.role !== 'admin') {
      navigate('/login', { replace: true });
      return;
    }

    fetchInquiries();
  }, [authLoading, adminProfile, navigate]);

  useEffect(() => {
    filterInquiries();
  }, [searchQuery, statusFilter, inquiries]);

  const fetchInquiries = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('flight_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterInquiries = () => {
    let filtered = [...inquiries];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inq =>
        inq.customer_name.toLowerCase().includes(query) ||
        inq.customer_email.toLowerCase().includes(query) ||
        inq.customer_phone.toLowerCase().includes(query) ||
        inq.flight_from.toLowerCase().includes(query) ||
        inq.flight_to.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(inq => inq.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('flight_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200'
    };
    const icons = {
      pending: <Clock className="w-3.5 h-3.5" />,
      contacted: <Mail className="w-3.5 h-3.5" />,
      completed: <CheckCircle className="w-3.5 h-3.5" />
    };
    const labels = {
      pending: 'Pending',
      contacted: 'Contacted',
      completed: 'Completed'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter(i => i.status === 'pending').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    completed: inquiries.filter(i => i.status === 'completed').length
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-brand-blue"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-brand-blue transition"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Flight Inquiries</h1>
            </div>
            <button
              onClick={fetchInquiries}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-brand-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Plane className="w-8 h-8 text-brand-blue" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Flight</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Details</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {inquiry.customer_name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            {inquiry.customer_email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            {inquiry.customer_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{inquiry.flight_from}</span>
                          <Plane className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{inquiry.flight_to}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">
                          {inquiry.trip_type}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span>{formatDate(inquiry.departure_date)}</span>
                          </div>
                          {inquiry.return_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>{formatDate(inquiry.return_date)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span>{inquiry.passengers} passengers, {inquiry.cabin_class}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
