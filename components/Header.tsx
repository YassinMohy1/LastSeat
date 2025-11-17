'use client';

import { Phone, Menu, X, DoorOpen, Mail, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPromo, setShowPromo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    generatePromoCode();

    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      clearTimeout(popupTimer);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setShowPromo(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: userData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      setIsAdmin(userData?.role === 'admin');
    } else {
      setIsAdmin(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePromoCode = () => {
    setPromoCode('LST35');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {showPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn"
          style={{
            backgroundImage: 'url(/image\ copy\ copy\ copy\ copy\ copy\ copy\ copy\ copy\ copy.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slideUp overflow-hidden z-10">
            <div className="bg-gradient-to-r from-red-600 via-sky-500 to-brand-blue text-white p-6 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white transition z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10">
                <Mail className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                <h3 className="text-xl font-bold text-center mb-2">Get $35 Extra OFF!</h3>
                <p className="text-sm text-center text-white/90">Call now and mention your exclusive code</p>
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="bg-gradient-to-r from-red-50 to-sky-50 rounded-lg p-4 mb-4 border-2 border-dashed border-red-300">
                <p className="text-xs text-gray-600 mb-2 font-semibold">YOUR EXCLUSIVE CODE</p>
                <div className="bg-white px-4 py-3 rounded-lg mb-2 flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-bold text-red-600 tracking-wider">{promoCode}</span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-red-700 font-semibold">Save an additional $35 on your booking!</p>
              </div>
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">Offer expires in:</p>
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg font-mono text-lg font-bold text-brand-blue inline-block">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <a
                href="tel:888-602-6667"
                onClick={() => setShowPopup(false)}
                className="block w-full bg-gradient-to-r from-red-600 to-sky-500 text-white px-6 py-3 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 mb-3"
              >
                CALL NOW: 888-602-6667
              </a>
              <button
                onClick={() => setShowPopup(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">

      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src="/Transparent Logo.png"
                alt="Last Seat Ticket"
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <ul className="hidden lg:flex gap-6 items-center text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red transition-colors duration-300 flex items-center gap-2"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Home
                </Link>
              </li>
              <li><a href="/#how-to-book" className="hover:text-brand-red transition-colors duration-300">How to Book</a></li>
              <li><Link href="/blog" className="hover:text-brand-red transition-colors duration-300">Blog</Link></li>
              <li><a href="/#offers" className="hover:text-brand-red transition-colors duration-300">Offers</a></li>
              <li><Link href="/gift-vouchers" className="hover:text-brand-red transition-colors duration-300">Gift Vouchers</Link></li>
              <li><Link href="/about" className="hover:text-brand-red transition-colors duration-300">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-red transition-colors duration-300">Contact Us</Link></li>
            </ul>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <a
                href="tel:888-602-6667"
                className="flex items-center gap-2 text-brand-blue hover:text-brand-red transition-colors duration-300 text-sm font-bold group"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-lg">888-602-6667</span>
              </a>
              <span className="text-xs text-gray-500 animate-pulse">Available 24/7</span>
            </div>
            {isAdmin ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-red transition-all duration-300 font-medium"
              >
                <DoorOpen className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all duration-300 font-medium"
              >
                <DoorOpen className="w-4 h-4" />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <ul className="lg:hidden mt-4 space-y-3 pb-4 text-sm">
            <li>
              <Link
                href="/"
                className="block py-2 hover:text-brand-red transition-colors duration-300"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </Link>
            </li>
            <li><a href="/#how-to-book" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>How to Book</a></li>
            <li><Link href="/blog" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
            <li><a href="/#offers" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Offers</a></li>
            <li><Link href="/gift-vouchers" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Gift Vouchers</Link></li>
            <li><Link href="/about" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
            <li><Link href="/contact" className="block py-2 hover:text-brand-red transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link></li>
            <li className="pt-2">
              <a
                href="tel:888-602-6667"
                className="flex items-center gap-2 text-brand-blue hover:text-brand-red transition-colors duration-300 font-bold py-2"
              >
                <Phone className="w-5 h-5" />
                <span>888-602-6667</span>
              </a>
            </li>
            <li>
              {isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-red transition-all duration-300 w-fit font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all duration-300 w-fit font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </li>
          </ul>
        )}
      </nav>
    </header>
    </>
  );
}
