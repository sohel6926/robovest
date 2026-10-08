import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Bot } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setShowAuthModal
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-2.5 text-slate-900 shadow-sm transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand Lockup: Clean Fintech Ice-White & Deep Cobalt */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-blue-600 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-slate-900 font-['Space_Grotesk']">
                ROBO<span className="text-blue-600">VEST</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 font-medium">Autonomous Robotics Fleet</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          {/* User Status */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Shield className="w-3 h-3" />
            <span>VIP{user.vipLevel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
