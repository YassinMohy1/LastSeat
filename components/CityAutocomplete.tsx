'use client';

import { useState, useEffect, useRef } from 'react';
import { Plane, MapPin, Loader2 } from 'lucide-react';

interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  displayName: string;
  fullName: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
}

export default function CityAutocomplete({ value, onChange, placeholder, label }: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAirports = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/search-airports?keyword=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch airports');
      }

      const data = await response.json();

      if (data.airports && data.airports.length > 0) {
        setSuggestions(data.airports);
      } else {
        setSuggestions([]);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching airports:', error);
        setSuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    searchAirports(inputValue);
    setIsOpen(true);
  };

  const handleSelectAirport = (airport: Airport) => {
    onChange(airport.displayName);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleFocus = () => {
    if (value && value.length >= 2) {
      searchAirports(value);
    }
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-semibold text-white mb-1 drop-shadow-md">{label}</label>
      <div className="relative group">
        <Plane className="absolute left-2 top-2 w-3.5 h-3.5 text-white group-focus-within:text-brand-blue transition-colors" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder || 'City or Airport (e.g., JFK, LAX)'}
          className="w-full pl-8 pr-8 py-2 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all duration-200 text-xs hover:border-white/50 hover:bg-white/20"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-2 top-2 w-3.5 h-3.5 text-white animate-spin" />
        )}
      </div>

      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border-2 border-gray-100 max-h-80 overflow-y-auto">
          {loading && suggestions.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-blue" />
              <p className="text-sm">Searching airports...</p>
            </div>
          ) : (
            suggestions.map((airport, index) => (
              <button
                key={`${airport.code}-${index}`}
                onClick={() => handleSelectAirport(airport)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0 flex items-start gap-3"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-brand-blue/10 rounded-lg flex-shrink-0">
                  <span className="text-xs font-bold text-brand-blue">{airport.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {airport.name}
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-600">
                      {airport.code}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {airport.city}, {airport.country}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {isOpen && !loading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border-2 border-gray-100 px-4 py-6 text-center text-gray-500">
          <p className="text-sm">No airports found</p>
          <p className="text-xs text-gray-400 mt-1">Try searching by airport code (e.g., JFK) or city name</p>
        </div>
      )}
    </div>
  );
}
