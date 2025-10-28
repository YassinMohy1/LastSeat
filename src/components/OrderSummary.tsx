import { Receipt } from 'lucide-react';

interface OrderSummaryProps {
  baseFare: number;
  selectedPlan: any;
  baggageProtection: boolean;
  baggagePrice: number;
  serviceFee: number;
  taxRate: number;
  passengerCount?: number;
}

export default function OrderSummary({
  baseFare,
  selectedPlan,
  baggageProtection,
  baggagePrice,
  serviceFee,
  taxRate,
  passengerCount = 1,
}: OrderSummaryProps) {
  const protectionCost = selectedPlan?.per_passenger
    ? (selectedPlan?.price || 0) * passengerCount
    : (selectedPlan?.price || 0);
  const baggageCost = baggageProtection ? baggagePrice * passengerCount : 0;
  const subtotal = baseFare + protectionCost + baggageCost + serviceFee;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-700">Base Fare</span>
          <span className="font-semibold text-gray-900">${baseFare.toFixed(2)}</span>
        </div>

        {protectionCost > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <div>
              <div className="text-gray-700">{selectedPlan.title}</div>
              <div className="text-xs text-gray-500">
                Travel Protection
                {selectedPlan?.per_passenger && passengerCount > 1 && (
                  <span> (${selectedPlan.price} × {passengerCount})</span>
                )}
              </div>
            </div>
            <span className="font-semibold text-gray-900">${protectionCost.toFixed(2)}</span>
          </div>
        )}

        {baggageProtection && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <div>
              <div className="text-gray-700">Baggage Protection</div>
              <div className="text-xs text-gray-500">
                Lost baggage coverage
                {passengerCount > 1 && (
                  <span> (${baggagePrice.toFixed(2)} × {passengerCount})</span>
                )}
              </div>
            </div>
            <span className="font-semibold text-gray-900">${baggageCost.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-700">Service Fee</span>
          <span className="font-semibold text-gray-900">${serviceFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-700">Tax ({taxRate}%)</span>
          <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-brand-blue">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-green-800 text-center">
          <span className="font-semibold">Secure Payment</span> - Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}
