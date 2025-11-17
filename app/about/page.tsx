'use client';

import { Award, Users, Target, Heart, Shield, TrendingUp, Plane, Zap, Search } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';

export default function AboutUs() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Last Seat Ticket
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in finding the best flight deals and making travel accessible to everyone
          </p>
        </div>

        {/* What is Last Seat Tickets - Special Box with Animation */}
        <div className="relative mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-sky-500 to-cyan-500 rounded-3xl opacity-10 animate-pulse"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-brand-red/20 p-8 md:p-12 transform hover:scale-[1.02] transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-red/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-brand-red to-brand-blue p-3 rounded-2xl animate-bounce">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-red to-brand-blue bg-clip-text text-transparent">
                  What is Last Seat Tickets?
                </h2>
              </div>

              <div className="space-y-4 text-center max-w-4xl mx-auto">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                  Your go-to destination for <span className="text-brand-red font-bold">unbeatable last-minute flight deals</span> and <span className="text-brand-blue font-bold">exclusive fares</span>.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed">
                  We specialize in helping smart travelers score the best prices on flights before the last seat is gone.
                  With access to major airlines worldwide, we make booking <span className="font-semibold text-brand-red">fast</span>, <span className="font-semibold text-brand-blue">simple</span>, and <span className="font-semibold text-green-600">secure</span> — whether you're planning a spontaneous getaway or a business trip.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-6">
                  <div className="flex items-center gap-2 bg-brand-red/10 px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-300">
                    <Search className="w-5 h-5 text-brand-red" />
                    <span className="font-semibold text-brand-red">Find it</span>
                  </div>
                  <div className="flex items-center gap-2 bg-brand-blue/10 px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
                    <Zap className="w-5 h-5 text-brand-blue" />
                    <span className="font-semibold text-brand-blue">Book it</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-600/10 px-6 py-3 rounded-full transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.4s' }}>
                    <Plane className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">Fly for less</span>
                  </div>
                </div>

                <div className="pt-6">
                  <p className="text-2xl font-bold bg-gradient-to-r from-brand-red via-brand-blue to-green-600 bg-clip-text text-transparent animate-pulse">
                    Find it. Book it. Fly for less with Last Seat Tickets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-brand-red to-brand-blue text-white rounded-2xl p-8 md:p-12 mb-16 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <Target className="w-12 h-12" />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <p className="text-lg leading-relaxed">
            At Last Seat Ticket, we're committed to making air travel affordable and accessible for everyone.
            We specialize in finding those last-minute deals, empty seats, and exclusive offers that other
            booking platforms miss. Our goal is to help you explore the world without breaking the bank.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-brand-blue/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3">Best Prices</h3>
            <p className="text-gray-600">
              We guarantee competitive prices and work tirelessly to find you the best deals on flights worldwide.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-sky-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-sky-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Customer First</h3>
            <p className="text-gray-600">
              Our 24/7 support team is always ready to assist you, ensuring a smooth booking experience.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure & Trusted</h3>
            <p className="text-gray-600">
              Your security is our priority. All transactions are encrypted and your data is protected.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Heart className="w-10 h-10 text-red-500" />
            <h2 className="text-3xl font-bold">Our Story</h2>
          </div>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p className="text-lg">
              Last Seat Ticket was founded with a simple idea: everyone deserves to travel. We noticed that
              traditional booking platforms often overlooked last-minute deals and unsold seats, leading to
              higher prices for travelers.
            </p>
            <p className="text-lg">
              Our team of travel experts and technology enthusiasts came together to create a platform that
              bridges this gap. We've built relationships with airlines worldwide and developed smart algorithms
              to identify the best deals in real-time.
            </p>
            <p className="text-lg">
              Today, we're proud to have helped thousands of travelers reach their destinations affordably.
              Whether you're planning a business trip, family vacation, or spontaneous adventure, we're here
              to make it happen.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-brand-red to-red-600 text-white rounded-xl p-6 text-center">
            <TrendingUp className="w-10 h-10 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">50K+</div>
            <div className="text-sm opacity-90">Happy Travelers</div>
          </div>

          <div className="bg-gradient-to-br from-brand-blue to-sky-600 text-white rounded-xl p-6 text-center">
            <Award className="w-10 h-10 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">98%</div>
            <div className="text-sm opacity-90">Satisfaction Rate</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-6 text-center">
            <Users className="w-10 h-10 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">24/7</div>
            <div className="text-sm opacity-90">Customer Support</div>
          </div>

          <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl p-6 text-center">
            <Shield className="w-10 h-10 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">100%</div>
            <div className="text-sm opacity-90">Secure Booking</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-6 text-gray-300">
            Let us help you find the perfect flight at the best price
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-brand-red to-brand-blue hover:shadow-xl text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Search Flights
            </Link>
            <a
              href="tel:888-602-6667"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Call: 888-602-6667
            </a>
          </div>
        </div>
      </div>
      </div>
      <AIAssistant isOpen={false} onClose={() => {}} onOpen={() => {}} />
      <Footer />
    </>
  );
}
