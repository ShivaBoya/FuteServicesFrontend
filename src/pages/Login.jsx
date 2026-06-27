import React, { useState } from 'react';
import { api } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const data = await api.login(email, password);
      localStorage.setItem('fute_access_token', data.accessToken);
      localStorage.setItem('fute_refresh_token', data.refreshToken);
      localStorage.setItem('fute_admin_user', JSON.stringify({ email: data.email, role: data.role }));
      
      onLoginSuccess(data.accessToken, data.email);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-6 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_45%)]">
      <div className="w-full max-w-[440px] bg-dark-surface/65 backdrop-blur-md border border-dark-border rounded-2xl p-10 shadow-2xl transition-all">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-linear-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            F
          </div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-indigo-200 bg-clip-text text-transparent tracking-tight">
            Fute Services
          </h1>
          <p className="text-gray-400 text-sm mt-1">Lead Management Dashboard</p>
        </div>

        {error && (
          <div className="bg-lead-lost/12 border border-lead-lost/30 text-red-200 px-4 py-3 rounded-lg text-sm mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0 text-lead-lost">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-xs font-semibold text-gray-400 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@futeservices.com"
              className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-3 text-white text-sm focus:outline-hidden focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 transition-all placeholder:text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-xs font-semibold text-gray-400 mb-2">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-dark-bg/60 border border-dark-border rounded-md px-4 py-3 text-white text-sm focus:outline-hidden focus:border-brand-primary focus:ring-3 focus:ring-brand-primary/20 transition-all placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:brightness-95 text-white rounded-md py-3 font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:pointer-events-none"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
