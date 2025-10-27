import { useState, useRef, useEffect } from 'react';
import { Calendar, Users, ChevronDown } from 'lucide-react';
import { trackSearchFlight, trackButtonClick } from '../lib/analytics';
import { useToast } from './ToastContainer';
import CityAutocomplete from './CityAutocomplete';

export default function SearchBar() {
  const toast = useToast();
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState<'Economy' | 'Business' | 'First Class'>('Economy');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPassengersDisplay = () => {
    return `${adults} Adult${adults > 1 ? 's' : ''}, ${cabin}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSearch = () => {
    if (!origin.trim()) {
      toast.warning('Please enter your departure location');
      return;
    }
    if (!destination.trim()) {
      toast.warning('Please enter your destination');
      return;
    }
    if (!departDate) {
      toast.warning('Please select a departure date');
      return;
    }
    if (tripType === 'roundtrip' && !returnDate) {
      toast.warning('Please select a return date');
      return;
    }

    trackSearchFlight({
      from: origin,
      to: destination,
      departDate: departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      passengers: adults,
      tripType: tripType
    });

    trackButtonClick('Search Flights', 'Hero Search Bar');

    const searchParams = new URLSearchParams({
      from: origin,
      to: destination,
      departDate: departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : '',
      passengers: adults.toString(),
      cabin: cabin,
      tripType: tripType
    });

    window.location.href = `/flight-quote?${searchParams.toString()}`;
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-4 md:p-5 max-w-4xl mx-auto transform hover:scale-[1.01] transition-all duration-500 border border-white/30">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTripType('roundtrip')}
          className={`px-5 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${
            tripType === 'roundtrip'
              ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg'
              : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
          }`}
        >
          Round Trip
        </button>
        <button
          onClick={() => setTripType('oneway')}
          className={`px-5 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${
            tripType === 'oneway'
              ? 'bg-gradient-to-r from-brand-blue to-blue-600 text-white shadow-lg'
              : 'bg-white/30 text-white hover:bg-white/40 backdrop-blur-sm'
          }`}
        >
          One Way
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 mb-4">
        <CityAutocomplete
          label="From"
          value={origin}
          onChange={setOrigin}
          placeholder="Your Location"
        />

        <CityAutocomplete
          label="To"
          value={destination}
          onChange={setDestination}
          placeholder="Destination"
        />

        <div className="relative">
          <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">Departure</label>
          <div className="relative group">
            <Calendar className="absolute left-2 top-2 w-3.5 h-3.5 text-white pointer-events-none group-focus-within:text-brand-blue transition-colors" />
            <input
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-8 pr-2.5 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 cursor-pointer text-xs hover:border-white/50 hover:bg-white/20 [color-scheme:dark]"
            />
          </div>
        </div>

        {tripType === 'roundtrip' && (
          <div className="relative">
            <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">Return</label>
            <div className="relative group">
              <Calendar className="absolute left-2 top-2 w-3.5 h-3.5 text-white pointer-events-none group-focus-within:text-brand-blue transition-colors" />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                min={departDate || new Date().toISOString().split('T')[0]}
                className="w-full pl-8 pr-2.5 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 cursor-pointer text-xs hover:border-white/50 hover:bg-white/20 [color-scheme:dark]"
              />
            </div>
          </div>
        )}

        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">Passengers / Cabin</label>
          <div className="relative group">
            <Users className="absolute left-2 top-2 w-3.5 h-3.5 text-white group-focus-within:text-brand-blue transition-colors z-10 pointer-events-none" />
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full pl-8 pr-7 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 text-xs hover:border-white/50 hover:bg-white/20 cursor-pointer text-left"
            >
              {getPassengersDisplay()}
            </button>
            <ChevronDown className={`absolute right-2 top-2 w-3.5 h-3.5 text-white transition-transform duration-200 pointer-events-none ${isDropdownOpen ? 'rotate-180' : ''}`} />

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 overflow-hidden border-2 border-gray-200">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Number of Passengers</label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                      <span className="text-sm text-gray-700">Adults</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-5 h-5 rounded-full border-2 border-brand-blue text-brand-blue text-sm font-bold hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold text-gray-900 w-5 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(9, adults + 1))}
                          className="w-5 h-5 rounded-full border-2 border-brand-blue text-brand-blue text-sm font-bold hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Cabin Class</label>
                    <div className="space-y-2">
                      {(['Economy', 'Business', 'First Class'] as const).map((cabinType) => (
                        <button
                          key={cabinType}
                          type="button"
                          onClick={() => setCabin(cabinType)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            cabin === cabinType
                              ? 'bg-brand-blue text-white shadow-md'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {cabinType}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-brand-blue via-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-bold text-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] shadow-lg relative overflow-hidden group"
      >
        <span className="relative z-10">Search Flights & Get Best Quote</span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      <div className="mt-3.5 flex flex-wrap justify-center gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-white font-medium drop-shadow-md">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Price Match Guarantee
        </span>
        <span className="flex items-center gap-1.5 text-white font-medium drop-shadow-md">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Free Cancellation
        </span>
        <span className="flex items-center gap-1.5 text-white font-medium drop-shadow-md">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Expert Support
        </span>
      </div>
    </div>
  );
}
