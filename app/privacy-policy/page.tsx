'use client';

import { Shield, Lock, Eye, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-red to-brand-blue rounded-full mb-6">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            How we protect and use your information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Pricing Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                All the fares displayed are in USD and include all taxes, fees and applicable surcharges. All prices are 'from' per person, based on business class weekday travel (Monday – Thursday) from the USA, and depend on the chosen class of service, departure city, airline and the route. Lowest transatlantic fares are usually from the East Coast; transpacific fares – from the West Coast.
              </p>
              <p>
                LastSeatTickets is not able to identify some travel partners or itinerary details online so as not to directly compete with regular retail sales of the travel partner. Savings up to 77% off are indicated of the full un-restricted published airfares of major airlines and may vary based on individual fare rules. Some airlines may impose additional baggage charges. The fares are subject to seat availability in the corresponding booking inventory. Seats are limited and may not be available on all flights and dates.
              </p>
              <p>
                The fares have flexible booking policy: free exchange and/or cancellation is available now with our partner airlines. In the event of trip cancellation, unless otherwise stated, customers will retain travel credit with the issuing airline for one year, excluding airline fees. In the event of exchange, fare difference may apply. The fares and their governing rules are subject to change without prior notice. Other restrictions may apply.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Additional <strong className="text-brand-blue">$200 referral discounts</strong> apply as follows: referring customers receive $100 in their LastSeatTickets account for every new customer who gets a discount using their referral code, and referred customers get a $100 discount on their first eligible purchase.
              </p>
              <p className="font-semibold text-gray-900">
                Please, call toll-free for our best current prices, itinerary details and referral program details.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Best Price Guarantee</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                At LastSeatTickets We are so sure that our privately negotiated transatlantic and transpacific business class airfares from the U.S. are unbeatable and the lowest on the market that we will give you our "Best Price Guarantee" along with a $100-voucher! As long as you call us within 2 hours from the purchase of your ticket and provide us with a copy of the itinerary from any of our competitors which will include identical itinerary, exactly the same fare basis and fare calculation information, we will match the price and send you $100 voucher to use towards your next purchase with LastSeatTickets.
              </p>
              <p>
                Please, note: terms and conditions apply. To claim "Best Price Guarantee" voucher please, first, talk to your travel agent then email us at <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">support@LastSeatTickets.com</a>. For more details and the program rules and limitations, please, check our 'Terms of Use'.
              </p>
              <p className="text-sm text-gray-600 italic mt-4">
                LastSeatTickets is a brand of Travellester
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Make a booking or purchase</li>
                <li>Create an account</li>
                <li>Contact our customer service</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p>
                This information may include:
              </p>
              <ul className="list-disc pl-6">
                <li>Name, email address, phone number</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Passport details and travel preferences</li>
                <li>Communication preferences</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6">
                <li>Process and fulfill your bookings and transactions</li>
                <li>Communicate with you about your bookings</li>
                <li>Send you updates, special offers, and promotional materials</li>
                <li>Improve our services and customer experience</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Provide customer support</li>
                <li>Process referral program rewards</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6">
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing systems</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information by authorized personnel only</li>
                <li>Credit card verification procedures for third-party transactions</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Sharing Your Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We may share your information with:
              </p>
              <ul className="list-disc pl-6">
                <li><strong>Airlines and travel service providers</strong> to complete your bookings</li>
                <li><strong>Payment processors</strong> to process transactions securely</li>
                <li><strong>Government agencies</strong> when required by law (including TSA requirements)</li>
                <li><strong>Service providers</strong> who assist us in operating our website and services</li>
                <li><strong>Partner companies</strong> such as VisaHQ for visa services (when requested)</li>
              </ul>
              <p>
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
              <p>
                To exercise these rights, please contact us at <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">support@LastSeatTickets.com</a> or call us at <a href="tel:+18886026667" className="text-brand-blue hover:underline">+1 888-602-6667</a>.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to improve your browsing experience, analyze website traffic, and personalize content. You can control cookies through your browser settings, but disabling them may affect your ability to use certain features of our website.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-bold text-gray-900">Changes to This Policy</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none pl-0">
                <li className="mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">
                    support@LastSeatTickets.com
                  </a>
                </li>
                <li className="mb-2">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+18886026667" className="text-brand-blue hover:underline">
                    +1 888-602-6667
                  </a>
                </li>
                <li>
                  <strong>Location:</strong> San Francisco, California, USA
                </li>
              </ul>
            </div>
          </section>

          <div className="border-t pt-8 text-center">
            <p className="text-gray-600 text-sm">
              Last updated: October 28, 2025
            </p>
            <p className="text-gray-600 text-sm mt-2">
              LastSeatTickets LLC - A brand of Travellester
            </p>
          </div>
        </div>
      </div>
      </div>
      <AIAssistant isOpen={false} onClose={() => {}} onOpen={() => {}} />
      <Footer />
    </>
  );
}
