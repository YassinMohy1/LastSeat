'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ToastContainer';
import { Mail, Phone, MapPin, Calendar, MessageSquare, Eye, X, Check, ArrowLeft } from 'lucide-react';

interface ContactInquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  destination: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export default function InquiriesManagement() {
  const router = useRouter();
  const toast = useToast();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [notes, setNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: string, newNotes?: string) => {
    setUpdatingStatus(true);
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newNotes !== undefined) {
        updateData.notes = newNotes;
      }

      const { error } = await supabase
        .from('contact_inquiries')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Inquiry status updated successfully!');
      await fetchInquiries();

      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any, notes: newNotes || selectedInquiry.notes });
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    completed: inquiries.filter(i => i.status === 'completed').length,
    cancelled: inquiries.filter(i => i.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-700 font-medium"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
              <p className="text-sm text-gray-600">Manage and respond to customer inquiries</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-brand-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({statusCounts.all})
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'new'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          New ({statusCounts.new})
        </button>
        <button
          onClick={() => setFilter('contacted')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'contacted'
              ? 'bg-yellow-600 text-white'
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
          }`}
        >
          Contacted ({statusCounts.contacted})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'completed'
              ? 'bg-green-600 text-white'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
        >
          Completed ({statusCounts.completed})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'cancelled'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Cancelled ({statusCounts.cancelled})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600">
            {filter === 'all' ? 'No inquiries yet' : `No ${filter} inquiries`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{inquiry.full_name}</h3>
                    {getStatusBadge(inquiry.status)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(inquiry.created_at)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setNotes(inquiry.notes || '');
                  }}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${inquiry.email}`} className="hover:text-brand-blue">
                    {inquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${inquiry.phone}`} className="hover:text-brand-blue">
                    {inquiry.phone}
                  </a>
                </div>
                {inquiry.destination && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{inquiry.destination.replace('-', ' ')}</span>
                  </div>
                )}
              </div>

              {inquiry.message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
                  <p className="text-gray-600 text-sm">{inquiry.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'new')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedInquiry.status === 'new'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    } disabled:opacity-50`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'contacted')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedInquiry.status === 'contacted'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    } disabled:opacity-50`}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'completed')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedInquiry.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    } disabled:opacity-50`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'cancelled')}
                    disabled={updatingStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedInquiry.status === 'cancelled'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } disabled:opacity-50`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{selectedInquiry.full_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
                  <p className="text-gray-900 capitalize">
                    {selectedInquiry.destination ? selectedInquiry.destination.replace('-', ' ') : 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <a href={`mailto:${selectedInquiry.email}`} className="text-brand-blue hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <a href={`tel:${selectedInquiry.phone}`} className="text-brand-blue hover:underline">
                  {selectedInquiry.phone}
                </a>
              </div>

              {selectedInquiry.message && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{selectedInquiry.message}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                  placeholder="Add notes about this inquiry..."
                />
                <button
                  onClick={() => {
                    updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, notes);
                  }}
                  disabled={updatingStatus}
                  className="mt-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  {updatingStatus ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                <p>Created: {formatDate(selectedInquiry.created_at)}</p>
                <p>Last Updated: {formatDate(selectedInquiry.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
