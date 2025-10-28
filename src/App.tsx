import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastContainer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AboutUs from './pages/AboutUs';
import GiftVouchers from './pages/GiftVouchers';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import FlightQuote from './pages/FlightQuote';
import AdminDashboard from './pages/AdminDashboard';
import CreateInvoice from './pages/CreateInvoice';
import CustomerPayment from './pages/CustomerPayment';
import CustomersManagement from './pages/CustomersManagement';
import InquiriesManagement from './pages/InquiriesManagement';
import FlightInquiriesManagement from './pages/FlightInquiriesManagement';
import FlightPricesManagement from './pages/FlightPricesManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/gift-vouchers" element={<GiftVouchers />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/flight-quote" element={<FlightQuote />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-invoice" element={<CreateInvoice />} />
          <Route path="/admin/customers" element={<CustomersManagement />} />
          <Route path="/admin/inquiries" element={<InquiriesManagement />} />
          <Route path="/admin/flight-inquiries" element={<FlightInquiriesManagement />} />
          <Route path="/admin/flight-prices" element={<FlightPricesManagement />} />

          <Route path="/pay/:paymentLink" element={<CustomerPayment />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
