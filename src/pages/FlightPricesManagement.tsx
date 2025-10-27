import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plane, Plus, Edit2, Trash2, Save, X, DollarSign, Percent } from 'lucide-react';

interface FlightPrice {
  id: string;
  route_from: string;
  route_to: string;
  cabin_class: string;
  trip_type: string;
  original_price: number;
  discount_percentage: number;
  final_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FlightPricesManagement: React.FC = () => {
  const [prices, setPrices] = useState<FlightPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    route_from: '',
    route_to: '',
    cabin_class: 'Economy',
    trip_type: 'roundtrip',
    original_price: '',
    discount_percentage: '60',
  });

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('flight_prices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (originalPrice: number, discountPercentage: number) => {
    return Math.round(originalPrice * (1 - discountPercentage / 100));
  };

  const calculateSavings = (originalPrice: number, finalPrice: number) => {
    return originalPrice - finalPrice;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const originalPrice = parseFloat(formData.original_price);
    const discountPercentage = parseFloat(formData.discount_percentage);
    const finalPrice = calculateFinalPrice(originalPrice, discountPercentage);

    try {
      const { error } = await supabase.from('flight_prices').insert({
        route_from: formData.route_from,
        route_to: formData.route_to,
        cabin_class: formData.cabin_class,
        trip_type: formData.trip_type,
        original_price: originalPrice,
        discount_percentage: discountPercentage,
        final_price: finalPrice,
        is_active: true
      });

      if (error) throw error;

      setShowAddForm(false);
      setFormData({
        route_from: '',
        route_to: '',
        cabin_class: 'Economy',
        trip_type: 'roundtrip',
        original_price: '',
        discount_percentage: '60',
      });
      fetchPrices();
    } catch (error) {
      console.error('Error adding price:', error);
      alert('Failed to add flight price');
    }
  };

  const handleUpdate = async (id: string) => {
    const price = prices.find(p => p.id === id);
    if (!price) return;

    const finalPrice = calculateFinalPrice(price.original_price, price.discount_percentage);

    try {
      const { error } = await supabase
        .from('flight_prices')
        .update({
          original_price: price.original_price,
          discount_percentage: price.discount_percentage,
          final_price: finalPrice,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      setEditingId(null);
      fetchPrices();
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update flight price');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flight price?')) return;

    try {
      const { error } = await supabase
        .from('flight_prices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPrices();
    } catch (error) {
      console.error('Error deleting price:', error);
      alert('Failed to delete flight price');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('flight_prices')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchPrices();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  };

  const updatePrice = (id: string, field: string, value: any) => {
    setPrices(prev => prev.map(price =>
      price.id === id ? { ...price, [field]: value } : price
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Plane className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Flight Prices Management</h1>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Flight Price
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Flight Price</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From (City/Code)
                  </label>
                  <input
                    type="text"
                    name="route_from"
                    value={formData.route_from}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., JFK or New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To (City/Code)
                  </label>
                  <input
                    type="text"
                    name="route_to"
                    value={formData.route_to}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., LAX or Los Angeles"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cabin Class
                  </label>
                  <select
                    name="cabin_class"
                    value={formData.cabin_class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Type
                  </label>
                  <select
                    name="trip_type"
                    value={formData.trip_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="roundtrip">Round Trip</option>
                    <option value="oneway">One Way</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="100"
                    step="1"
                    placeholder="e.g., 60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {formData.original_price && formData.discount_percentage && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Original Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${parseFloat(formData.original_price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Final Price</p>
                      <p className="text-lg font-bold text-orange-600">
                        ${calculateFinalPrice(parseFloat(formData.original_price), parseFloat(formData.discount_percentage)).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">You Save</p>
                      <p className="text-lg font-bold text-green-600">
                        ${calculateSavings(
                          parseFloat(formData.original_price),
                          calculateFinalPrice(parseFloat(formData.original_price), parseFloat(formData.discount_percentage))
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Add Flight Price
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prices.map((price) => (
                <tr key={price.id} className={!price.is_active ? 'bg-gray-50 opacity-60' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Plane className="h-4 w-4 text-gray-400" />
                      {price.route_from} → {price.route_to}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {price.cabin_class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {price.trip_type === 'roundtrip' ? 'Round Trip' : 'One Way'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === price.id ? (
                      <input
                        type="number"
                        value={price.original_price}
                        onChange={(e) => updatePrice(price.id, 'original_price', parseFloat(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 font-medium line-through">
                        ${price.original_price.toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === price.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={price.discount_percentage}
                          onChange={(e) => updatePrice(price.id, 'discount_percentage', parseFloat(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          min="0"
                          max="100"
                          step="1"
                        />
                        <Percent className="h-3 w-3 text-gray-400" />
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {price.discount_percentage}% OFF
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-orange-600">
                      ${price.final_price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${calculateSavings(price.original_price, price.final_price).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(price.id, price.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        price.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {price.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {editingId === price.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(price.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Save"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              fetchPrices();
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditingId(price.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(price.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {prices.length === 0 && (
            <div className="text-center py-12">
              <Plane className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No flight prices</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new flight price.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Flight Price
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightPricesManagement;
