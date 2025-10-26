import { Shield, Check } from 'lucide-react';

interface TravelCarePlanProps {
  plans: any[];
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
}

export default function TravelCarePlan({ plans, selectedPlan, onPlanChange }: TravelCarePlanProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Travel Care Protection Plan</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Protect your trip investment with comprehensive coverage. Choose the plan that best fits your needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanChange(plan.id)}
            className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
              selectedPlan === plan.id
                ? 'border-brand-blue bg-blue-50 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            } ${plan.recommended ? 'ring-2 ring-green-400' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <input
                type="radio"
                name="protection-plan"
                checked={selectedPlan === plan.id}
                onChange={() => onPlanChange(plan.id)}
                className="w-5 h-5 text-brand-blue cursor-pointer"
              />
              <div className="text-right">
                {plan.price > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                    <div className="text-xs text-gray-500">per person</div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-gray-900">Free</div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-3">{plan.title}</h3>

            {plan.features.length > 0 ? (
              <ul className="space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 italic">
                No protection coverage. You'll be responsible for all cancellation and change fees.
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Note:</span> Protection plans are non-refundable and must be purchased at the time of booking. Coverage details will be sent to your email after purchase.
        </p>
      </div>
    </div>
  );
}
