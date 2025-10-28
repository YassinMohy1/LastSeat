import { Gift, Heart, Plane, Star, Check, CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function GiftVouchers() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');

  const voucherAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-blue to-sky-500 rounded-full mb-6">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gift the Joy of Travel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Give your loved ones the gift of adventure with Last Seat Ticket gift vouchers
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Voucher Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Choose Your Gift Amount</h2>

            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {voucherAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
                    selectedAmount === amount && !customAmount
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-gray-300 hover:border-brand-blue hover:bg-brand-blue/5'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <button
                onClick={() => setSelectedAmount(0)}
                className={`p-4 rounded-lg border-2 font-semibold transition-all duration-300 col-span-3 ${
                  selectedAmount === 0 || customAmount
                    ? 'border-brand-blue bg-brand-blue text-white'
                    : 'border-gray-300 hover:border-brand-blue hover:bg-brand-blue/5'
                }`}
              >
                Custom Amount
              </button>
            </div>

            {/* Custom Amount Input */}
            {(selectedAmount === 0 || customAmount) && (
              <div className="mb-6 animate-fadeIn">
                <label className="block text-sm font-medium mb-2">Enter Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                    min="10"
                  />
                </div>
              </div>
            )}

            {/* Recipient Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Name</label>
                <input
                  type="text"
                  placeholder="Enter recipient's name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Email</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
                <textarea
                  placeholder="Add a personal message..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Purchase Button */}
            <button className="w-full bg-gradient-to-r from-brand-blue to-sky-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Purchase Gift Voucher
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              Voucher will be sent to recipient's email instantly
            </p>
          </div>

          {/* Right Column - Benefits & Info */}
          <div className="space-y-6">
            {/* Why Choose Our Vouchers */}
            <div className="bg-gradient-to-br from-brand-blue to-sky-500 text-white rounded-2xl p-8 shadow-xl">
              <Heart className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Why Gift a Travel Voucher?</h3>
              <p className="text-white/90">
                Give the gift of unforgettable experiences. Our vouchers never expire and can be used for
                any flight booking on Last Seat Ticket. It's the perfect present for any occasion!
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Voucher Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Never Expires</div>
                    <div className="text-sm text-gray-600">Use anytime, no expiration date</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Instant Delivery</div>
                    <div className="text-sm text-gray-600">Sent to recipient's email immediately</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Flexible Use</div>
                    <div className="text-sm text-gray-600">Valid for any destination worldwide</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Transferable</div>
                    <div className="text-sm text-gray-600">Can be transferred to another person</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 rounded-full p-1 mt-0.5">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Secure & Safe</div>
                    <div className="text-sm text-gray-600">Protected transaction & data encryption</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfect For */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Perfect Gift For</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Birthdays</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Anniversaries</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Graduations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Weddings</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Holidays</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Thank You</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <Plane className="w-10 h-10 text-brand-blue" />
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">1</span>
              </div>
              <h3 className="font-bold mb-2">Choose Amount</h3>
              <p className="text-gray-600 text-sm">Select a preset amount or enter your custom value</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">2</span>
              </div>
              <h3 className="font-bold mb-2">Personalize</h3>
              <p className="text-gray-600 text-sm">Add recipient details and a personal message</p>
            </div>
            <div className="text-center">
              <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">3</span>
              </div>
              <h3 className="font-bold mb-2">Instant Delivery</h3>
              <p className="text-gray-600 text-sm">Voucher sent immediately to recipient's email</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-gray-300 mb-6">
            Our team is available 24/7 to assist you with your gift voucher purchase
          </p>
          <a
            href="tel:888-602-6667"
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Call: 888-602-6667
          </a>
        </div>
      </div>
    </div>
  );
}
