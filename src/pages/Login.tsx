import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ToastContainer';
import { DoorOpen, Mail, Lock, User, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('One special character (!@#$%^&*)');
    return errors;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let email = loginData.emailOrUsername;

      if (!loginData.emailOrUsername.includes('@')) {
        const { data: customerData } = await supabase
          .from('customers')
          .select('email')
          .eq('username', loginData.emailOrUsername)
          .maybeSingle();

        if (customerData) {
          email = customerData.email;
        } else {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('email')
            .eq('username', loginData.emailOrUsername)
            .maybeSingle();

          if (adminData) {
            email = adminData.email;
          } else {
            throw new Error('Username not found. Please check your credentials.');
          }
        }
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: loginData.password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect email or password. Please try again.');
        }
        throw authError;
      }

      if (authData.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (adminData) {
          if (!adminData.is_active) {
            await supabase.auth.signOut();
            throw new Error('Your account has been deactivated. Please contact support.');
          }

          navigate('/admin/dashboard', { replace: true });
          return;
        }

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (customerError || !customerData) {
          await supabase.auth.signOut();
          throw new Error('Account not found. Please register a new account.');
        }

        if (!customerData.is_active) {
          await supabase.auth.signOut();
          throw new Error('Your account has been deactivated. Please contact support.');
        }

        toast.success('Login Successfully! Welcome back!');
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(registerData.password);
    if (passwordErrors.length > 0) {
      setError(`Password must have: ${passwordErrors.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('This email is already registered. Please login instead.');
        }
        throw authError;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('customers')
          .insert({
            id: authData.user.id,
            email: registerData.email,
            username: registerData.username,
            first_name: registerData.firstName,
            last_name: registerData.lastName,
            full_name: `${registerData.firstName} ${registerData.lastName}`,
            phone: registerData.phone,
            city: registerData.city,
            is_active: true,
          });

        if (profileError) throw profileError;

        toast.success('Account created successfully! You can now login.');
        setActiveTab('login');
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          phone: '',
          city: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex justify-center pt-6">
            <div className="bg-brand-blue/10 p-3 rounded-full">
              <DoorOpen className="w-8 h-8 text-brand-blue" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 text-center mt-4 mb-2">
            Welcome to Last Seat Ticket
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6 px-8">
            {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>

          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'register'
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800">{error}</p>
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginData.emailOrUsername}
                      onChange={(e) => setLoginData({ ...loginData, emailOrUsername: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="your@email.com or username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="w-full pl-9 pr-10 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                        className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                        className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="johndoe123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.city}
                      onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="New York"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="w-full pl-9 pr-10 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must include: 8+ chars, uppercase, lowercase, number, special char
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-9 pr-10 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-blue to-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>

          <div className="px-6 pb-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-600 hover:text-brand-blue transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
