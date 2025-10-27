import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plane, Calendar, Users, Phone, Mail, User, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ToastContainer';
import AIAssistant from '../components/AIAssistant';

export default function FlightQuote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [showAssistant, setShowAssistant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceSource, setPriceSource] = useState<'amadeus' | 'estimated'>('estimated');

  const flightDetails = {
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departDate: searchParams.get('departDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    passengers: parseInt(searchParams.get('passengers') || '1'),
    cabin: searchParams.get('cabin') || 'Economy',
    tripType: searchParams.get('tripType') || 'roundtrip'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const getAirportCoordinates = (cityCode: string): { lat: number; lng: number } | null => {
    const airports: Record<string, { lat: number; lng: number }> = {
      'JFK': { lat: 40.6413, lng: -73.7781 },
      'LAX': { lat: 33.9416, lng: -118.4085 },
      'LHR': { lat: 51.4700, lng: -0.4543 },
      'DXB': { lat: 25.2532, lng: 55.3657 },
      'CDG': { lat: 49.0097, lng: 2.5479 },
      'SIN': { lat: 1.3644, lng: 103.9915 },
      'HND': { lat: 35.5494, lng: 139.7798 },
      'AMS': { lat: 52.3105, lng: 4.7683 },
      'FRA': { lat: 50.0379, lng: 8.5622 },
      'ICN': { lat: 37.4602, lng: 126.4407 },
      'CAI': { lat: 30.1219, lng: 31.4056 },
      'JED': { lat: 21.6796, lng: 39.1567 },
      'RUH': { lat: 24.9578, lng: 46.6988 },
      'DOH': { lat: 25.2731, lng: 51.6083 },
      'IST': { lat: 41.2753, lng: 28.7519 },
      'ORD': { lat: 41.9742, lng: -87.9073 },
      'ATL': { lat: 33.6407, lng: -84.4277 },
      'DFW': { lat: 32.8998, lng: -97.0403 },
      'SFO': { lat: 37.6213, lng: -122.3790 },
      'MIA': { lat: 25.7959, lng: -80.2870 },
      'BOS': { lat: 42.3656, lng: -71.0096 },
      'SEA': { lat: 47.4502, lng: -122.3088 },
      'LAS': { lat: 36.0840, lng: -115.1537 },
      'MCO': { lat: 28.4312, lng: -81.3081 },
      'EWR': { lat: 40.6895, lng: -74.1745 },
    };

    const code = cityCode.substring(0, 3).toUpperCase();
    return airports[code] || null;
  };

  const calculateDistance = (from: string, to: string): number => {
    const coord1 = getAirportCoordinates(from);
    const coord2 = getAirportCoordinates(to);

    if (!coord1 || !coord2) {
      return 1000;
    }

    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  };

  const estimatePrice = () => {
    const distance = calculateDistance(flightDetails.from, flightDetails.to);

    let pricePerKm = 0.12;
    if (distance > 5000) pricePerKm = 0.10;
    if (distance > 10000) pricePerKm = 0.08;

    let basePrice = distance * pricePerKm;

    if (basePrice < 200) basePrice = 200;

    if (flightDetails.cabin === 'Business') basePrice *= 2.8;
    if (flightDetails.cabin === 'First Class') basePrice *= 5;

    if (flightDetails.tripType === 'roundtrip') basePrice *= 1.85;

    const seasonalMultiplier = 1.1;
    basePrice *= seasonalMultiplier;

    basePrice *= flightDetails.passengers;

    return Math.round(basePrice);
  };

  useEffect(() => {
    if (!flightDetails.from || !flightDetails.to || !flightDetails.departDate) {
      navigate('/');
    }
  }, [flightDetails, navigate]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!flightDetails.from || !flightDetails.to || !flightDetails.departDate) {
        setEstimatedPrice(estimatePrice());
        return;
      }

      setPriceLoading(true);
      setEstimatedPrice(estimatePrice());

      try {
        const cabinMap: Record<string, string> = {
          'Economy': 'ECONOMY',
          'Business': 'BUSINESS',
          'First Class': 'FIRST'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-flight-price`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              origin: flightDetails.from,
              destination: flightDetails.to,
              departureDate: flightDetails.departDate,
              returnDate: flightDetails.returnDate || undefined,
              adults: flightDetails.passengers,
              cabin: cabinMap[flightDetails.cabin] || 'ECONOMY',
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();

        if (data.price && data.source === 'amadeus') {
          setEstimatedPrice(data.price);
          setPriceSource('amadeus');
        } else {
          setPriceSource('estimated');
        }
      } catch (err) {
        console.error('Error fetching price:', err);
        setPriceSource('estimated');
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const displayPrice = estimatedPrice || estimatePrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('flight_inquiries')
        .insert({
          flight_from: flightDetails.from,
          flight_to: flightDetails.to,
          departure_date: flightDetails.departDate,
          return_date: flightDetails.returnDate || null,
          passengers: flightDetails.passengers,
          cabin_class: flightDetails.cabin,
          trip_type: flightDetails.tripType,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          message: formData.message || null,
          status: 'pending',
          source: 'landing_page'
        });

      if (error) throw error;

      toast.success('Your inquiry has been submitted successfully! We will contact you shortly.');
      setSubmitted(true);
    } catch (err: any) {
      toast.error('Failed to submit inquiry. Please try again or call us directly.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Request Received!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your inquiry. Our travel experts will contact you shortly with the best flight options and pricing.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">Need immediate assistance?</p>
            <a href="tel:888-602-6667" className="text-2xl font-bold text-brand-blue hover:text-blue-700 transition">
              888-602-6667
            </a>
            <p className="text-xs text-gray-600 mt-1">Available 24/7</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-blue transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-xl font-bold text-brand-blue">Last Seat Ticket</div>
            <a
              href="tel:888-602-6667"
              className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">888-602-6667</span>
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Flight Quote
            </h1>
            <p className="text-gray-600">
              Complete the form below and our experts will contact you with the best deals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Plane className="w-6 h-6 text-brand-blue" />
                  Flight Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">From</div>
                      <div className="font-semibold text-gray-900">{flightDetails.from}</div>
                    </div>
                    <Plane className="w-6 h-6 text-gray-400 mt-4" />
                    <div className="flex-1 text-right">
                      <div className="text-sm text-gray-500 mb-1">To</div>
                      <div className="font-semibold text-gray-900">{flightDetails.to}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-brand-blue" />
                        <span className="text-sm text-gray-500">Departure Date</span>
                      </div>
                      <div className="font-semibold text-gray-900">{formatDate(flightDetails.departDate)}</div>
                    </div>

                    {flightDetails.returnDate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-brand-blue" />
                          <span className="text-sm text-gray-500">Return Date</span>
                        </div>
                        <div className="font-semibold text-gray-900">{formatDate(flightDetails.returnDate)}</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-brand-blue" />
                        <span className="text-sm text-gray-500">Passengers</span>
                      </div>
                      <div className="font-semibold text-gray-900">{flightDetails.passengers}</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500 mb-2">Cabin Class</div>
                      <div className="font-semibold text-gray-900">{flightDetails.cabin}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Trip Type</div>
                    <div className="font-semibold text-brand-blue capitalize">{flightDetails.tripType}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Your Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Message (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all resize-none"
                        placeholder="Any special requests or questions?"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Get Best Quote Now'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Estimated Price</h3>
                <div className="text-center py-6 bg-gradient-to-br from-brand-blue to-blue-600 rounded-lg text-white mb-6">
                  <div className="text-sm mb-2">Starting from</div>
                  {priceLoading ? (
                    <div className="text-2xl font-bold">Loading...</div>
                  ) : (
                    <>
                      <div className="text-4xl font-bold">${displayPrice}</div>
                      <div className="text-xs mt-2 opacity-80">
                        {priceSource === 'amadeus' ? 'Real-time pricing' : 'Estimated pricing'}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Best price guarantee</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">24/7 customer support</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Free cancellation</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Instant confirmation</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Need immediate help?</div>
                    <a
                      href="tel:888-602-6667"
                      className="inline-flex items-center gap-2 text-2xl font-bold text-brand-blue hover:text-blue-700 transition"
                    >
                      <Phone className="w-6 h-6" />
                      888-602-6667
                    </a>
                    <div className="text-xs text-gray-500 mt-1">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        onOpen={() => setShowAssistant(true)}
      />
    </div>
  );
}
