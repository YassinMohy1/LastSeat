import { Phone, Menu, X, DoorOpen, Mail, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

      <nav className="container mx-auto px-3 py-1.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
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

            <ul className="hidden lg:flex gap-4 items-center text-xs">
              <li><Link to="/" className="hover:text-brand-blue transition">Home</Link></li>
              <li><a href="/#how-to-book" className="hover:text-brand-blue transition">How to Book</a></li>
              <li><Link to="/blog" className="hover:text-brand-blue transition">Blog</Link></li>
              <li><a href="/#offers" className="hover:text-brand-blue transition">Offers</a></li>
              <li><Link to="/gift-vouchers" className="hover:text-brand-blue transition">Gift Vouchers</Link></li>
              <li><Link to="/about" className="hover:text-brand-blue transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-blue transition">Contact Us</Link></li>
            </ul>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <a
                href="tel:888-602-6667"
                className="flex items-center gap-1.5 text-brand-blue hover:text-brand-blue/80 transition text-xs font-semibold group hover:scale-105 duration-300"
              >
                <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-bold">888-602-6667</span>
              </a>
              <span className="text-[10px] text-gray-500 animate-pulse">Available 24/7</span>
            </div>
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
          </div>
        </div>

        {mobileMenuOpen && (
          <ul className="lg:hidden mt-3 space-y-2 pb-3 text-sm">
            <li><Link to="/" className="block hover:text-brand-blue transition">Home</Link></li>
            <li><a href="/#how-to-book" className="block hover:text-brand-blue transition">How to Book</a></li>
            <li><Link to="/blog" className="block hover:text-brand-blue transition">Blog</Link></li>
            <li><a href="/#offers" className="block hover:text-brand-blue transition">Offers</a></li>
            <li><Link to="/gift-vouchers" className="block hover:text-brand-blue transition">Gift Vouchers</Link></li>
            <li><Link to="/about" className="block hover:text-brand-blue transition">About Us</Link></li>
            <li><Link to="/contact" className="block hover:text-brand-blue transition">Contact Us</Link></li>
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
