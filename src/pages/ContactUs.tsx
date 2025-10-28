import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-blue to-sky-500 rounded-full mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help 24/7. Reach out to us anytime for questions, support, or bookings
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Form - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">Flight Booking</option>
                    <option value="support">Customer Support</option>
                    <option value="refund">Refund Request</option>
                    <option value="change">Change Booking</option>
                    <option value="voucher">Gift Vouchers</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-brand-blue focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-blue to-sky-500 text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              <p className="text-sm text-gray-500 text-center">
                We typically respond within 1-2 hours during business hours
              </p>
            </form>
          </div>

          {/* Contact Information - 1/3 width */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="bg-gradient-to-br from-brand-blue to-sky-500 text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform duration-300">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <a href="tel:888-602-6667" className="text-2xl font-bold hover:text-white/90">
                888-602-6667
              </a>
              <p className="text-sm text-white/80 mt-2">Available 24/7</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-brand-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <a
                href="mailto:support@lastseatticket.com"
                className="text-brand-blue hover:underline break-all"
              >
                support@lastseatticket.com
              </a>
              <p className="text-sm text-gray-600 mt-2">Response within 24 hours</p>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Business Hours</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday:</span>
                  <span className="font-semibold">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday:</span>
                  <span className="font-semibold">24/7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday:</span>
                  <span className="font-semibold">24/7</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Office Location</h3>
              <p className="text-gray-600 text-sm">
                Last Seat Ticket<br />
                123 Travel Avenue<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2">How do I book a flight?</h3>
              <p className="text-gray-600 text-sm">
                Simply call us at 888-602-6667 or fill out the contact form above with your travel details.
                Our team will find the best deals for you.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I cancel or change my booking?</h3>
              <p className="text-gray-600 text-sm">
                Yes, contact us as soon as possible. Cancellation and change policies vary by airline,
                and we'll help you understand your options.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do you offer price matching?</h3>
              <p className="text-gray-600 text-sm">
                We strive to offer the best prices available. If you find a lower price, contact us and
                we'll do our best to match or beat it.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">How long does it take to get a response?</h3>
              <p className="text-gray-600 text-sm">
                We typically respond to inquiries within 1-2 hours during business hours. For urgent
                matters, please call us directly at 888-602-6667.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
          <p className="text-lg mb-6 text-white/90">
            For urgent booking changes or travel emergencies, call us now
          </p>
          <a
            href="tel:888-602-6667"
            className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-5 h-5" />
            888-602-6667
          </a>
        </div>
      </div>
    </div>
  );
}
