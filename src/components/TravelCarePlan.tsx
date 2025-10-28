import { Shield, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface TravelCarePlanProps {
  plans: any[];
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
  baseFare: number;
}

const PLAN_DETAILS = {
  basic: {
    sections: [
      {
        title: 'VIP Support & Flight Delay Rebooking',
        description: 'Get priority assistance and protection for flight delays',
        features: [
          {
            title: 'VIP Support',
            description: 'Get the fastest response time and highest priority help with your booking requests'
          },
          {
            title: 'Price Drop Protection',
            description: 'Get up to $1,000 if the price of your flight drops in the next 24hrs. We will continuously monitor the price for you, and you get to pocket the savings as a voucher'
          },
          {
            title: 'Flight Delay & Cancellation',
            description: 'If your flight is delayed by more than 1 hour or gets canceled by the airline, we will book you on a new flight on the same airline for free (up to $1,000 value)'
          },
          {
            title: 'Missed Connection',
            description: 'If you miss your connecting flight due to an airline delay or if the airline cancels it during your trip, we will rebook you and cover the cost of your new flight (up to $1,000 value) on the same airline to your destination.'
          }
        ]
      }
    ]
  },
  premium: {
    sections: [
      {
        title: 'VIP Support & Flight Delay Rebooking',
        description: 'Get priority assistance and protection for flight delays',
        features: [
          {
            title: 'VIP Support',
            description: 'Get the fastest response time and highest priority help with your booking requests'
          },
          {
            title: 'Price Drop Protection',
            description: 'Get up to $1,000 if the price of your flight drops in the next 24hrs. We will continuously monitor the price for you, and you get to pocket the savings as a voucher'
          },
          {
            title: 'Flight Delay & Cancellation',
            description: 'If your flight is delayed by more than 1 hour or gets canceled by the airline, we will book you on a new flight on the same airline for free (up to $1,000 value)'
          },
          {
            title: 'Missed Connection',
            description: 'If you miss your connecting flight due to an airline delay or if the airline cancels it during your trip, we will rebook you and cover the cost of your new flight (up to $1,000 value) on the same airline to your destination.'
          }
        ]
      },
      {
        title: 'Change for Free',
        description: 'Maximum flexibility for your travel plans',
        features: [
          {
            title: 'Add flexibility to your trip and we will waive all fees',
            description: ''
          },
          {
            title: 'Change for Any Reason',
            description: 'Change your flight anytime before departure, no questions asked. We cover 100% of your original ticket cost.'
          },
          {
            title: 'All agency service fees waived',
            description: '$0 agency fees for any changes, cancellations, or refunds.'
          }
        ]
      }
    ]
  }
};

export default function TravelCarePlan({ plans, selectedPlan, onPlanChange, baseFare }: TravelCarePlanProps) {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const basicPlan = plans.find(p => p.id === 'basic');
  const premiumPlan = plans.find(p => p.id === 'premium');
  const nonePlan = plans.find(p => p.id === 'none');

  const basicTotal = basicPlan && basicPlan.percentage ? (baseFare * basicPlan.percentage / 100) : 0;
  const premiumTotal = premiumPlan && premiumPlan.percentage ? (baseFare * premiumPlan.percentage / 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-3">
          <Shield className="w-6 h-6" />
          Choose the Travel Care plan that's right for you
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-4 min-w-[250px]"></th>
              <th className="text-center p-4 min-w-[180px] bg-gray-100">
                <div className="font-bold text-lg text-gray-900">Basic</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${basicTotal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {basicPlan?.percentage}% of ticket price
                </div>
              </th>
              <th className="text-center p-4 min-w-[180px] bg-white relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="font-bold text-lg text-gray-900 mt-2">Premium</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  ${premiumTotal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {premiumPlan?.percentage}% of ticket price
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* VIP Support Section - Basic */}
            <tr className="border-b border-gray-200">
              <td className="p-4 bg-gray-50">
                <button
                  onClick={() => toggleSection('vip-basic')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-semibold text-gray-900">VIP Support & Flight Delay Rebooking</span>
                  {expandedSections['vip-basic'] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </td>
              <td className="p-4 bg-gray-100 align-top">
                <div className="flex flex-col items-center">
                  <Check className="w-6 h-6 text-green-500" />
                  {expandedSections['vip-basic'] && (
                    <div className="mt-4 space-y-3 text-left w-full">
                      {PLAN_DETAILS.basic.sections[0].features.map((feature, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-semibold text-gray-900">{feature.title}:</div>
                          <div className="text-gray-700 text-xs mt-1">{feature.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 bg-white align-top">
                <div className="flex flex-col items-center">
                  <Check className="w-6 h-6 text-green-500" />
                  {expandedSections['vip-basic'] && (
                    <div className="mt-4 space-y-3 text-left w-full">
                      {PLAN_DETAILS.premium.sections[0].features.map((feature, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-semibold text-gray-900">{feature.title}:</div>
                          <div className="text-gray-700 text-xs mt-1">{feature.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>

            {/* Change for Free Section - Premium only */}
            <tr className="border-b border-gray-200">
              <td className="p-4 bg-gray-50">
                <button
                  onClick={() => toggleSection('change-free')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-semibold text-gray-900">Change for Free</span>
                  {expandedSections['change-free'] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </td>
              <td className="p-4 bg-gray-100 align-top">
                <div className="flex flex-col items-center">
                  <X className="w-6 h-6 text-gray-400" />
                </div>
              </td>
              <td className="p-4 bg-white align-top">
                <div className="flex flex-col items-center">
                  <Check className="w-6 h-6 text-green-500" />
                  {expandedSections['change-free'] && (
                    <div className="mt-4 space-y-3 text-left w-full">
                      {PLAN_DETAILS.premium.sections[1].features.map((feature, idx) => (
                        <div key={idx} className="text-sm">
                          {feature.description ? (
                            <>
                              <div className="font-semibold text-gray-900">{feature.title}:</div>
                              <div className="text-gray-700 text-xs mt-1">{feature.description}</div>
                            </>
                          ) : (
                            <div className="text-gray-700">{feature.title}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
            </tr>

            {/* Selection Radio Buttons */}
            <tr className="bg-white">
              <td className="p-4">
                <label className="flex items-center gap-3 cursor-pointer text-green-600">
                  <input
                    type="radio"
                    name="travel-care-plan"
                    checked={selectedPlan === 'none'}
                    onChange={() => onPlanChange('none')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm">
                    No, thanks, I choose not to add Travel Care Plan and take all the risks on myself.
                  </span>
                </label>
              </td>
              <td className="p-4 text-center bg-gray-100">
                <label className="flex items-center justify-center cursor-pointer">
                  <input
                    type="radio"
                    name="travel-care-plan"
                    checked={selectedPlan === 'basic'}
                    onChange={() => onPlanChange('basic')}
                    className="w-5 h-5 cursor-pointer"
                  />
                </label>
                <div className="mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Terms & Conditions
                  </a>
                </div>
              </td>
              <td className="p-4 text-center bg-white">
                <label className="flex items-center justify-center cursor-pointer">
                  <input
                    type="radio"
                    name="travel-care-plan"
                    checked={selectedPlan === 'premium'}
                    onChange={() => onPlanChange('premium')}
                    className="w-5 h-5 cursor-pointer"
                  />
                </label>
                <div className="mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Terms & Conditions
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
