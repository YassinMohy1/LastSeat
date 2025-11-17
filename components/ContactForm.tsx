'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { VisaIcon, MastercardIcon, AmexIcon, PayPalIcon, ApplePayIcon, GooglePayIcon } from './PaymentIcons';
import { trackFormSubmit, trackPhoneClick } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_inquiries')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          message: formData.message,
          status: 'new'
        });

      if (dbError) throw dbError;

      trackFormSubmit('Contact Form');
      setSubmitted(true);

      setTimeout(() => {
        trackPhoneClick('888-602-6667');
        window.location.href = 'tel:888-602-6667';
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again or call us directly at 888-602-6667');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50" id="contact">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Your Free Quote
          </h2>
          <p className="text-xl text-gray-600">
            Fill out the form and we'll call you back with the best deals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-brand-blue to-brand-blue/90 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4 leading-tight">
              Let's Plan Your Journey
            </h3>
            <p className="mb-8 text-white/90 leading-relaxed">
              Our travel experts are ready to help you find the perfect flight at the best price. Call us now or submit the form and we'll reach out to you.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1 text-base">Call Us 24/7</div>
                  <a href="tel:888-602-6667" className="text-xl font-bold hover:text-blue-200 transition block">
                    888-602-6667
                  </a>
                  <div className="text-sm text-white/80 mt-1">Available round the clock</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1 text-base">Email Us</div>
                  <a href="mailto:support@lastseatticket.com" className="hover:text-white/80 transition block break-all">
                    support@lastseatticket.com
                  </a>
                  <div className="text-sm text-white/80 mt-1">We reply within 1 hour</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1 text-base">Serving Nationwide</div>
                  <div className="text-white/90">
                    United States & Canada
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <h4 className="text-lg font-bold mb-4">We Accept All Major Payment Methods</h4>
              <div className="space-y-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left flex-1">
                      <div className="font-bold text-gray-900 text-sm">Credit & Debit Cards</div>
                      <div className="text-xs text-gray-600">Secure & Instant</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <VisaIcon />
                      <MastercardIcon />
                      <AmexIcon />
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-left flex-1">
                      <div className="font-bold text-gray-900 text-sm">PayPal</div>
                      <div className="text-xs text-gray-600">Fast & Secure Payment</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PayPalIcon />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 text-xs">Apple Pay</div>
                        <div className="text-xs text-gray-600">One-Touch</div>
                      </div>
                      <ApplePayIcon />
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 text-xs">Google Pay</div>
                        <div className="text-xs text-gray-600">Quick Pay</div>
                      </div>
                      <GooglePayIcon />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-white/70 text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                All payments secured with 256-bit SSL encryption
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your request. One of our travel experts will contact you shortly.
                </p>
                <p className="text-brand-blue font-semibold">
                  Or call us now: 888-602-6667
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Destination
                  </label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                  >
                    <option value="">Select a destination</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="caribbean">Caribbean</option>
                    <option value="south-america">South America</option>
                    <option value="australia">Australia/Pacific</option>
                    <option value="africa">Africa</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none transition"
                    placeholder="Tell us about your travel dates, preferences, budget, etc."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-brand-red to-brand-red/90 text-white py-4 rounded-lg font-bold text-lg hover:from-brand-red/90 hover:to-brand-red/80 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? 'Submitting...' : 'Submit & Get Free Quote'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By submitting, you agree to receive calls/texts about your travel inquiry
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
