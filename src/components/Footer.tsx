import { Phone, Mail, MapPin, Facebook, Instagram, CreditCard, Shield, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Last Seat Ticket</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for affordable flights worldwide. Book with confidence, fly with comfort.
            </p>
            <div className="flex gap-3 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61576220788258" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center hover:bg-brand-blue/90 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/lastseatticket/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center hover:bg-brand-red/90 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Secure Payment Methods
              </h4>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3.5" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-4" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-4" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" className="h-4" />
                </div>
                <div className="bg-white rounded px-2.5 py-1.5 flex items-center justify-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" className="h-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><a href="/#how-to-book" className="hover:text-white transition">How to Book</a></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><a href="/#offers" className="hover:text-white transition">Offers</a></li>
              <li><Link to="/gift-vouchers" className="hover:text-white transition">Gift Vouchers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  <a href="tel:888-602-6667" className="hover:text-white transition font-semibold">
                    888-602-6667
                  </a>
                  <div className="text-sm">24/7 Support</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 flex-shrink-0 mt-1" />
                <a href="mailto:support@lastseatticket.com" className="hover:text-white transition">
                  support@lastseatticket.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <div>
                  United States
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="text-center text-sm text-gray-400">
            © 2025 Last Seat Ticket. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
