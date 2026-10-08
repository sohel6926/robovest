import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bot, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState<string>('9845210492');
  const [password, setPassword] = useState<string>('password123');
  const [inviteCode, setInviteCode] = useState<string>('203C03');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Please agree to the Terms & Conditions.');
      return;
    }
    setSuccessNotice(mode === 'login' ? 'Welcome back! Logged in successfully.' : 'Registration complete! Welcome to RoboVest.');
    setTimeout(() => {
      setSuccessNotice(null);
      setShowAuthModal(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Lockup */}
        <div className="text-center pt-2 space-y-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 font-['Space_Grotesk']">
            ROBO<span className="text-blue-600">VEST</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Autonomous Robotics · Institutional Financial Yields
          </p>
        </div>

        {/* Tab Switcher: Login | Register */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Phone Field */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
            <span className="px-3.5 text-blue-600 font-bold border-r border-slate-200">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone Number"
              className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none tabular-nums"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
            <span className="pl-3.5 text-slate-400">🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent py-3 px-3 text-slate-900 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3.5 text-slate-400 hover:text-slate-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Invite Code Field (For Register) */}
          {mode === 'register' && (
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-blue-600 focus-within:bg-white transition">
              <span className="pl-3.5 text-slate-400">🎁</span>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Invite Code (e.g. 203C03)"
                className="w-full bg-transparent py-3 px-3 text-slate-900 uppercase font-mono focus:outline-none"
              />
            </div>
          )}

          {/* Agree Terms Checkbox */}
          <div
            onClick={() => setAgreedTerms(!agreedTerms)}
            className="flex items-center gap-2 cursor-pointer pt-1 text-[11px] text-slate-600 select-none"
          >
            {agreedTerms ? (
              <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 shrink-0" />
            )}
            <span>
              By continuing you agree to the{' '}
              <span className="text-blue-600 underline font-semibold">Terms & Conditions</span>
            </span>
          </div>

          {successNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center">
              {successNotice}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            {mode === 'login' ? 'Login Now' : 'Register Now'}
          </button>

          {/* Bottom Switcher */}
          <div className="text-center text-[11px] text-slate-500 pt-1">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
