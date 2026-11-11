import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, ShieldAlert, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LockScreen() {
  const { login, authError, lockedUntil } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle lockout countdown
  useEffect(() => {
    if (!lockedUntil) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setCountdown(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = countdown > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || isLocked || submitting) return;

    setSubmitting(true);
    await login(password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center">
        {/* Icon & Heading */}
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5 text-blue-600 shadow-inner">
          {isLocked ? (
            <ShieldAlert className="w-8 h-8 text-red-600" />
          ) : (
            <Lock className="w-8 h-8 text-blue-600" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isLocked ? 'Access Temporarily Locked' : 'Private Access'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isLocked
            ? `Too many failed attempts. Security cooldown active for ${countdown}s.`
            : 'Enter your master passphrase to unlock the dashboard and data portal.'}
        </p>

        {/* Error Alert */}
        {authError && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-left text-sm text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1 font-medium">{authError}</div>
          </div>
        )}

        {/* Lockout Notice */}
        {isLocked && (
          <div className="mb-5 p-4 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-sm font-semibold">
            Please wait <span className="text-orange-950 font-bold">{countdown}</span> seconds before trying again.
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative text-left">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                disabled={isLocked || submitting}
                autoFocus
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || submitting}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!password.trim() || isLocked || submitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Unlock Dashboard</span>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <span>Protected with serverless authentication</span>
        </div>
      </div>
    </div>
  );
}
