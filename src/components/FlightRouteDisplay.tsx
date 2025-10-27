import { Plane } from 'lucide-react';
import { useState } from 'react';

interface StopDetail {
  city: string;
  airport: string;
  duration: string;
}

interface FlightRouteDisplayProps {
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  stops: number;
  stopsInfo?: string;
  stopsDetails?: StopDetail[];
  duration?: string;
  type: 'outbound' | 'return';
}

export default function FlightRouteDisplay({
  departureDate,
  departureTime,
  arrivalTime,
  from,
  to,
  stops,
  stopsInfo,
  stopsDetails,
  duration,
  type
}: FlightRouteDisplayProps) {
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);

  const formattedDate = new Date(departureDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const renderStops = () => {
    if (stops === 0) {
      return (
        <div className="text-center">
          <p className="text-sm text-green-600 font-semibold mt-2">Direct</p>
          {duration && <p className="text-xs text-gray-500 mt-1">{duration}</p>}
        </div>
      );
    }

    if (!stopsDetails || stopsDetails.length === 0) {
      return (
        <div className="text-center">
          <p className="text-sm text-orange-500 font-semibold mt-2">
            {stopsInfo || `${stops} Stop${stops > 1 ? 's' : ''}`}
          </p>
          {duration && <p className="text-xs text-gray-500 mt-1">{duration}</p>}
        </div>
      );
    }

    // Calculate positions for stop dots
    const positions = stopsDetails.map((_, index) => {
      return ((index + 1) / (stopsDetails.length + 1)) * 100;
    });

    return (
      <div className="relative">
        {/* Main text */}
        <div className="text-center">
          <p className="text-sm text-orange-500 font-semibold mt-2">
            {stopsInfo || `${stops} Stop${stops > 1 ? 's' : ''}`}
          </p>
          {duration && <p className="text-xs text-gray-500 mt-1">{duration}</p>}
        </div>

        {/* Stop dots */}
        <div className="absolute top-[-8px] left-0 right-0 h-0.5">
          {stopsDetails.map((stop, index) => (
            <div
              key={index}
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${positions[index]}%` }}
              onMouseEnter={() => setHoveredStop(index)}
              onMouseLeave={() => setHoveredStop(null)}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform" />

                {/* Tooltip */}
                {hoveredStop === index && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-10 whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <div className="font-semibold">{stop.duration} in {stop.city}</div>
                      <div className="text-gray-300">{stop.airport}</div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{formattedDate}</p>
          <p className="text-2xl font-bold text-gray-900">{departureTime}</p>
          <p className="text-gray-600">{from}</p>
        </div>

        <div className="flex-1 px-8">
          <div className="relative">
            <div className="h-0.5 bg-gray-300"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
              <Plane
                className={`w-6 h-6 text-brand-blue ${type === 'return' ? 'transform -rotate-90' : 'transform rotate-90'}`}
              />
            </div>
          </div>
          {renderStops()}
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">{formattedDate}</p>
          <p className="text-2xl font-bold text-gray-900">{arrivalTime}</p>
          <p className="text-gray-600">{to}</p>
        </div>
      </div>
    </div>
  );
}
