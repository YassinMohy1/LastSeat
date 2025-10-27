import { Phone, Menu, X, DoorOpen, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPromo, setShowPromo] = useState(true);

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
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      {showPromo && (
        <div className="bg-gradient-to-r from-brand-blue via-sky-600 to-brand-blue text-white py-2.5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
          <div className="container mx-auto px-3 flex justify-center items-center gap-4 relative z-10">
            <Mail className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold">Unlock savings on your next trip!</span>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-md font-mono text-sm font-bold">
              {formatTime(timeLeft)}
            </div>
            <button
              className="bg-white text-brand-blue px-4 py-1.5 rounded-md text-sm font-bold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              SAVE NOW
            </button>
            <button
              onClick={() => setShowPromo(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      <nav className="container mx-auto px-3 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://cdn.discordapp.com/attachments/1322984185811435641/1432487733947011153/white_logooo_page-0001-removebg-preview.png?ex=69013baa&is=68ffea2a&hm=6ec4de08b2ce16bb82d4f93695125cd8ec72ea18ae9d51f4395ca83ad85bb47c&"
              alt="Last Seat Ticket"
              className="h-10 sm:h-12 w-auto object-contain"
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
  );
}
