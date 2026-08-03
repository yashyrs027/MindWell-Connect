import React, { useState } from 'react';
import Card from './common/Card';

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin') => void;
  onNavigateToSignup: () => void;
  onNavigateToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onNavigateToLanding }) => {
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) newErrors.email = 'Enter a valid email address.';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) onLogin(role);
  };

  const clearError = (field: 'email' | 'password') => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-slate-50 to-purple-100 p-4">
      <Card className="max-w-md w-full text-center p-8 lg:p-12 shadow-2xl animate-fade-in-up">
        <button
          onClick={onNavigateToLanding}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <div className="flex justify-center items-center gap-3 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            <path d="M15.5 12.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <h1 className="text-3xl font-bold text-slate-800">MindWell Connect</h1>
        </div>
        <p className="text-slate-600 mb-8">Welcome back! Please sign in to your account.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          <div className="flex border border-slate-200 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`w-1/2 py-2 rounded-md transition-colors duration-200 text-sm font-semibold ${role === 'user' ? 'bg-blue-500 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`w-1/2 py-2 rounded-md transition-colors duration-200 text-sm font-semibold ${role === 'admin' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Administrator
            </button>
          </div>
        
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-left ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.email && <p id="email-error" className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-left ${errors.password ? 'border-red-400' : 'border-slate-300'}`}
            />
            {errors.password && <p id="password-error" className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
          
        <p className="text-sm text-slate-500 mt-4">
            Don't have an account?{' '}
            <button onClick={onNavigateToSignup} className="font-semibold text-blue-600 hover:underline">
              Sign up
            </button>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
