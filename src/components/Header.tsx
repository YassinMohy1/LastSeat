import { Phone, Menu, X, DoorOpen, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPromo, setShowPromo] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    checkAdminStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
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

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-slideUp overflow-hidden">
            <div className="bg-gradient-to-r from-brand-blue via-sky-600 to-brand-blue text-white p-6 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute right-4 top-4 text-white/80 hover:text-white transition z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10">
                <Mail className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                <h3 className="text-xl font-bold text-center mb-2">Unlock Exclusive Savings!</h3>
                <p className="text-sm text-center text-white/90">Limited time offer on your next trip</p>
              </div>
            </div>
            <div className="p-6 text-center">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Offer expires in:</p>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg font-mono text-2xl font-bold text-brand-blue inline-block">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <a
                href="tel:888-602-6667"
                onClick={() => setShowPopup(false)}
                className="block w-full bg-gradient-to-r from-brand-blue to-sky-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 mb-3"
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

      <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white py-2">
        <div className="container mx-auto px-3 flex justify-between items-center">
          <div className="flex items-center gap-1.5 group">
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <a
              href="tel:888-602-6667"
              className="text-white text-xs font-semibold hover:text-white/80 transition relative"
            >
              <span className="relative inline-block animate-[pulse_2s_ease-in-out_infinite]">
                888-602-6667
              </span>
            </a>
          </div>
          <div className="text-[10px] hidden sm:block">
            Available 24/7
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-3 py-1.5">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn.discordapp.com/attachments/1322984185811435641/1432494452705988700/5285517b-4a48-4557-b84b-ef4a9aa619db.png?ex=690141eb&is=68fff06b&hm=eaecebb87b6bbf8f9aee13084555faa83c81bb3d679c2ff3b5275498ea57d6f5&"
              alt="Last Seat Ticket"
              className="h-8 sm:h-10 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.error('Failed to load logo');
              }}
            />
          </Link>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <ul className="hidden lg:flex gap-4 items-center text-xs">
            <li><Link to="/" className="hover:text-brand-blue transition">Home</Link></li>
            <li><a href="/#how-to-book" className="hover:text-brand-blue transition">How to Book</a></li>
            <li><Link to="/blog" className="hover:text-brand-blue transition">Blog</Link></li>
            <li><a href="/#offers" className="hover:text-brand-blue transition">Offers</a></li>
            <li><a href="/#gift-vouchers" className="hover:text-brand-blue transition">Gift Vouchers</a></li>
            <li><a href="/#about" className="hover:text-brand-blue transition">About Us</a></li>
            <li><a href="/#contact" className="hover:text-brand-blue transition">Contact Us</a></li>
            <li>
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-all duration-300"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center gap-1 px-2 py-1 border border-brand-blue/30 text-brand-blue rounded-lg hover:bg-brand-blue/5 transition-all duration-300"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Login</span>
                </Link>
              )}
            </li>
          </ul>
        </div>

        {mobileMenuOpen && (
          <ul className="lg:hidden mt-3 space-y-2 pb-3 text-sm">
            <li><Link to="/" className="block hover:text-brand-blue transition">Home</Link></li>
            <li><a href="/#how-to-book" className="block hover:text-brand-blue transition">How to Book</a></li>
            <li><Link to="/blog" className="block hover:text-brand-blue transition">Blog</Link></li>
            <li><a href="/#offers" className="block hover:text-brand-blue transition">Offers</a></li>
            <li><a href="/#gift-vouchers" className="block hover:text-brand-blue transition">Gift Vouchers</a></li>
            <li><a href="/#about" className="block hover:text-brand-blue transition">About Us</a></li>
            <li><a href="/#contact" className="block hover:text-brand-blue transition">Contact Us</a></li>
            <li>
              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 px-2 py-1 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue/20 transition-all duration-300 w-fit"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="flex items-center gap-1 px-2 py-1 border border-brand-blue/30 text-brand-blue rounded-lg hover:bg-brand-blue/5 transition-all duration-300 w-fit"
                >
                  <DoorOpen className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Login</span>
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
