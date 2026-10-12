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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 text-slate-900 shadow-xs transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* FanCode Brand Lockup */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] shadow-sm shadow-orange-500/20 flex items-center justify-center">
            <span className="font-black italic text-white text-xs">FC</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black italic text-base tracking-tight text-slate-950 font-['Space_Grotesk']">
                FAN<span className="text-[#FF4A00]">CODE</span>
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-50 text-[#FF4A00] border border-orange-200 uppercase">
                SPORTS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Live Sports Every Moment</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* Admin Panel Trigger */}
          <button
            onClick={() => setShowAdminPanel(true)}
            title="Open Admin Panel"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-bold border border-slate-700 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* User Status */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:brightness-105 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Shield className="w-3 h-3" />
            <span>VIP{user.vipLevel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
