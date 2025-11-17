'use client';

import { Plane, Calendar, Clock } from 'lucide-react';

interface FlightDetailsProps {
  data: any;
}

export default function FlightDetails({ data }: FlightDetailsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{data.product.name}</h2>

      <div className="space-y-6">
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-brand-blue" />
              <h3 className="font-bold text-gray-900">Outbound Flight</h3>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{data.flights.outbound.date}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Departure</div>
                <div className="font-semibold text-gray-900">{data.flights.outbound.departure_time}</div>
                <div className="text-sm text-gray-600">{data.flights.outbound.from}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Arrival</div>
                <div className="font-semibold text-gray-900">{data.flights.outbound.arrival_time}</div>
                <div className="text-sm text-gray-600">{data.flights.outbound.to}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{data.flights.outbound.duration}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{data.flights.outbound.airline}</span> - Flight {data.flights.outbound.flight_number}
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b-2 border-gray-200">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-green-600 transform rotate-180" />
              <h3 className="font-bold text-gray-900">Return Flight</h3>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{data.flights.return.date}</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Departure</div>
                <div className="font-semibold text-gray-900">{data.flights.return.departure_time}</div>
                <div className="text-sm text-gray-600">{data.flights.return.from}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Arrival</div>
                <div className="font-semibold text-gray-900">{data.flights.return.arrival_time}</div>
                <div className="text-sm text-gray-600">{data.flights.return.to}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{data.flights.return.duration}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{data.flights.return.airline}</span> - Flight {data.flights.return.flight_number}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
