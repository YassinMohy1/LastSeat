import { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import { trackSearchFlight, trackButtonClick } from '../lib/analytics';
import CityAutocomplete from './CityAutocomplete';

export default function SearchBar() {
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 Adult, Economy');

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSearch = () => {
    trackSearchFlight({
      from: origin || 'Not specified',
      to: destination || 'Not specified',
      departDate: departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      passengers: parseInt(passengers.split(' ')[0]) || 1,
      tripType: tripType
    });

    trackButtonClick('Search Flights', 'Hero Search Bar');

    window.location.href = '/checkout';
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
              type="text"
              value={departDate ? formatDateDisplay(departDate) : ''}
              onFocus={(e) => {
                e.target.type = 'date';
                e.target.value = departDate;
                e.target.showPicker?.();
              }}
              onBlur={(e) => {
                if (e.target.value) {
                  setDepartDate(e.target.value);
                }
                e.target.type = 'text';
                e.target.value = departDate ? formatDateDisplay(departDate) : '';
              }}
              onChange={(e) => {
                if (e.target.type === 'date') {
                  setDepartDate(e.target.value);
                }
              }}
              placeholder="DD/MM/YYYY"
              min={new Date().toISOString().split('T')[0]}
              lang="en-US"
              className="w-full pl-8 pr-2.5 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 cursor-pointer text-xs hover:border-white/50 hover:bg-white/20"
            />
          </div>
        </div>

        {tripType === 'roundtrip' && (
          <div className="relative">
            <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">Return</label>
            <div className="relative group">
              <Calendar className="absolute left-2 top-2 w-3.5 h-3.5 text-white pointer-events-none group-focus-within:text-brand-blue transition-colors" />
              <input
                type="text"
                value={returnDate ? formatDateDisplay(returnDate) : ''}
                onFocus={(e) => {
                  e.target.type = 'date';
                  e.target.value = returnDate;
                  e.target.showPicker?.();
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    setReturnDate(e.target.value);
                  }
                  e.target.type = 'text';
                  e.target.value = returnDate ? formatDateDisplay(returnDate) : '';
                }}
                onChange={(e) => {
                  if (e.target.type === 'date') {
                    setReturnDate(e.target.value);
                  }
                }}
                placeholder="DD/MM/YYYY"
                min={departDate || new Date().toISOString().split('T')[0]}
                lang="en-US"
                className="w-full pl-8 pr-2.5 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 cursor-pointer text-xs hover:border-white/50 hover:bg-white/20"
              />
            </div>
          </div>
        )}

        <div className="relative">
          <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">Passengers / Cabin</label>
          <div className="relative group">
            <Users className="absolute left-2 top-2 w-3.5 h-3.5 text-white group-focus-within:text-brand-blue transition-colors" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full pl-8 pr-2.5 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 appearance-none text-xs hover:border-white/50 hover:bg-white/20 cursor-pointer"
            >
              <option className="bg-gray-800 text-white">1 Adult, Economy</option>
              <option className="bg-gray-800 text-white">2 Adults, Economy</option>
              <option className="bg-gray-800 text-white">3 Adults, Economy</option>
              <option className="bg-gray-800 text-white">4 Adults, Economy</option>
              <option className="bg-gray-800 text-white">1 Adult, Business</option>
              <option className="bg-gray-800 text-white">2 Adults, Business</option>
              <option className="bg-gray-800 text-white">1 Adult, First Class</option>
            </select>
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
