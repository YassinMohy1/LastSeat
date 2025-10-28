import { Briefcase, Info } from 'lucide-react';
import { useState } from 'react';

interface BaggageProtectionProps {
  price: number;
  coverage: string;
  description: string;
  selected: boolean;
  onToggle: (selected: boolean) => void;
  passengerCount?: number;
}

export default function BaggageProtection({
  price,
  coverage,
  description,
  selected,
  onToggle,
  passengerCount = 1,
}: BaggageProtectionProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const totalPrice = price * passengerCount;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Lost Baggage Protection</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onToggle(true)}
          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
            selected
              ? 'border-brand-blue bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <input
              type="radio"
              name="baggage-protection"
              checked={selected}
              onChange={() => onToggle(true)}
              className="w-5 h-5 text-brand-blue cursor-pointer mt-1"
            />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">${totalPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                (per person){passengerCount > 1 && ` × ${passengerCount}`}
              </div>
            </div>
          </div>

          <h3 className="text-base font-normal text-gray-900 mb-2">
            Yes, I want to add Lost Baggage Protection for{' '}
            <span className="font-bold">${totalPrice.toFixed(2)}</span>{' '}
            <span className="text-sm text-gray-600">(per person)</span> and I agree to the{' '}
            <a href="#" className="text-brand-blue hover:underline">Terms & Conditions</a>
          </h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>

          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-green-800">
              <span className="font-semibold">Coverage:</span> {coverage}
            </div>
          </div>
        </div>

        <div
          onClick={() => onToggle(false)}
          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
            !selected
              ? 'border-gray-400 bg-gray-50 shadow-lg'
              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <input
              type="radio"
              name="baggage-protection"
              checked={!selected}
              onChange={() => onToggle(false)}
              className="w-5 h-5 text-gray-600 cursor-pointer mt-1"
            />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">$0.00</div>
              <div className="text-xs text-gray-500">no protection</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">No Thanks</h3>
          <p className="text-sm text-gray-600 mb-3">
            I'll take the risk. I understand that I won't be covered for lost or delayed baggage.
          </p>

          <div className="flex items-start gap-2 p-3 bg-gray-100 border border-gray-300 rounded-lg">
            <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700">
              Airline baggage policies may limit compensation to $50-$100 per bag.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Why choose baggage protection?</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>24-hour claim processing with fast reimbursement</li>
              <li>Coverage for lost, stolen, or damaged bags</li>
              <li>Covers personal belongings up to policy limit</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
