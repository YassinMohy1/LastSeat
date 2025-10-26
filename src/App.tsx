import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CreateInvoice from './pages/CreateInvoice';
import CustomerPayment from './pages/CustomerPayment';
import CustomersManagement from './pages/CustomersManagement';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-invoice" element={<CreateInvoice />} />
          <Route path="/admin/customers" element={<CustomersManagement />} />

          <Route path="/pay/:paymentLink" element={<CustomerPayment />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
