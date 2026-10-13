import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Key } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setShowAuthModal,
    setShowAdminPanel,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3.5 py-2.5 text-slate-900 shadow-xs transition-all">
      <div className="flex items-center justify-between">
        {/* FanCode Brand Lockup */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] shadow-sm shadow-orange-500/25 flex items-center justify-center shrink-0">
            <span className="font-black italic text-white text-xs tracking-tight">FC</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black italic text-[16px] sm:text-lg tracking-tight text-slate-950 font-['Space_Grotesk'] leading-none">
                FAN<span className="text-[#FF4A00]">CODE</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-orange-50 text-[#FF4A00] border border-orange-200 leading-none">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
              Live Sports. Anytime. Anywhere.
            </p>
          </div>
        </div>

        {/* Right Actions: Admin & VIP Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Admin Panel Trigger */}
          <button
            onClick={() => setShowAdminPanel(true)}
            title="Open Admin Panel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-bold border border-slate-700/80 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* User VIP Status */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:brightness-105 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 fill-white/20 text-white" />
            <span>VIP{user?.vipLevel || 1}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
