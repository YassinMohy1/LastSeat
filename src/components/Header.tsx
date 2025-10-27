import { Phone, Menu, X, DoorOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white py-2">
        <div className="container mx-auto px-3 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <a href="tel:888-602-6667" className="text-white text-xs font-semibold hover:text-white/80 transition">
              888-602-6667
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
            <div className="text-lg sm:text-xl font-bold text-brand-blue">
              Last Seat Ticket
            </div>
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
