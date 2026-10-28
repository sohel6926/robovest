import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, LogIn, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setShowAuthModal,
    logoutUser,
    setActiveTab,
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
              <span className="font-black italic text-[16px] sm:text-lg tracking-tight text-slate-950 font-sans leading-none">
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

        {/* Right Actions: Auth & VIP Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {user?.isLoggedIn ? (
            <>
              {/* VIP Badge when logged in */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:brightness-105 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 fill-white/20 text-white" />
                <span>VIP{user?.vipLevel || 1}</span>
              </button>
              {/* Logout button */}
              <button
                onClick={() => logoutUser()}
                title="Sign Out"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-200 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            /* Sign In button when logged out */
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:brightness-105 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
