'use client';

import { Gift, Heart, Plane, Check, User, Mail, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';
import { supabase } from '@/lib/supabase';

export default function GiftVouchers() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const voucherAmounts = [50, 70, 100];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `Gift Voucher Request - $${selectedAmount}\n\n${formData.message}`,
            inquiry_type: 'gift_voucher'
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSelectedAmount(50);

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting gift voucher request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-red to-brand-blue rounded-full mb-6">
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
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Choose Your Gift Amount</h2>

              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {voucherAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-6 rounded-xl border-2 font-bold text-xl transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'border-brand-blue bg-gradient-to-br from-brand-blue to-sky-500 text-white shadow-lg scale-105'
                        : 'border-gray-300 hover:border-brand-blue hover:bg-sky-50 text-gray-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Your Information */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Your Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@example.com"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Your Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Additional Information (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the occasion or any special requirements..."
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none resize-none transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-brand-red to-brand-blue text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Gift className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Request Gift Voucher'}
                </button>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg text-center font-semibold">
                    Request submitted successfully! We'll contact you shortly.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-center font-semibold">
                    Something went wrong. Please try again or call us.
                  </div>
                )}

                <p className="text-sm text-gray-600 text-center">
                  Our team will contact you to confirm your voucher details and complete the purchase
                </p>
              </form>
            </div>

            {/* Right Column - Benefits & Info */}
            <div className="space-y-6">
              {/* Why Choose Our Vouchers */}
              <div className="bg-gradient-to-br from-brand-red to-brand-blue text-white rounded-2xl p-8 shadow-xl">
                <Heart className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Why Gift a Travel Voucher?</h3>
                <p className="text-white/95 leading-relaxed">
                  Give the gift of unforgettable experiences. Our vouchers can be used for any flight booking on Last Seat Ticket. It's the perfect present for any occasion!
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Voucher Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Flexible Value</div>
                      <div className="text-sm text-gray-600">Choose from $50, $70, or $100 amounts</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Personalized Service</div>
                      <div className="text-sm text-gray-600">We'll help you find the best deals</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Valid Worldwide</div>
                      <div className="text-sm text-gray-600">Use for any destination we serve</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Transferable</div>
                      <div className="text-sm text-gray-600">Can be gifted to anyone</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1.5 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Secure & Safe</div>
                      <div className="text-sm text-gray-600">Protected transaction & data encryption</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-8 border-2 border-sky-200">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Need Assistance?</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our travel experts are available 24/7 to help you choose the perfect gift voucher and answer any questions.
                </p>
                <a
                  href="tel:888-602-6667"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-red to-brand-blue hover:shadow-lg text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Call: 888-602-6667
                </a>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <Plane className="w-10 h-10 text-brand-blue" />
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-brand-red to-brand-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">Choose Amount</h3>
                <p className="text-gray-600 text-sm">Select from $50, $70, or $100 gift voucher options</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-brand-red to-brand-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">Submit Request</h3>
                <p className="text-gray-600 text-sm">Fill out the form with your contact details</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-brand-red to-brand-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-bold mb-2 text-gray-900">We'll Contact You</h3>
                <p className="text-gray-600 text-sm">Our team will reach out to finalize your voucher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIAssistant isOpen={false} onClose={() => {}} onOpen={() => {}} />
      <Footer />
    </>
  );
}
