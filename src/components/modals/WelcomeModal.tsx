import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/products';
import { 
  Wallet, 
  Gift, 
  Send, 
  X, 
  Calendar, 
  Megaphone, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { showWelcomeModal, setShowWelcomeModal, setShowCustomerCare, catalog } = useApp();

  if (!showWelcomeModal) return null;

  const plan1 = catalog.find(p => p.id === 'A');
  const plan2 = catalog.find(p => p.id === 'B');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-[390px] bg-white border border-slate-200/90 rounded-[32px] shadow-[0_25px_70px_rgba(15,23,42,0.25),0_0_50px_rgba(37,99,235,0.12)] overflow-hidden max-h-[92vh] flex flex-col text-slate-800 transition-all transform scale-100"
      >
        {/* Scrollable Container with elegant padding and hidden scrollbar */}
        <div className="overflow-y-auto space-y-3 pb-5 scroll-smooth">
          
          {/* Top Banner with High-Tech Fleet Visual */}
          <div className="relative h-48 w-full bg-slate-950 overflow-hidden shrink-0 select-none">
            <img
              src={HERO_IMAGE}
              alt="Autonomous Robotics Fleet"
              className="w-full h-full object-cover object-top scale-105 transition-transform duration-700 hover:scale-100"
            />

            {/* Subtle cyber grid vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />

            {/* Live Fleet Pill Indicator (Top Left) */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono">AI FLEET ONLINE</span>
            </div>

            {/* Frosted Glass Close Button (Top Right) */}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all border border-white/25 z-20 shadow-lg active:scale-90 hover:scale-105"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Hero Branding Overlay */}
            <div className="absolute bottom-1.5 left-3 right-3 text-center">
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>WELCOME TO</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="font-black text-2xl tracking-wider text-slate-900 font-['Space_Grotesk'] drop-shadow-sm">
                  ROBO<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">VEST</span>
                </span>
              </div>
              <p className="text-xs font-black text-slate-800 tracking-tight mt-0.5">
                More Robots · A Better Tomorrow
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-500 mt-0.5">
                <span>Safe Fleets</span>
                <span className="text-blue-500">●</span>
                <span>More Opportunities</span>
                <span className="text-blue-500">●</span>
                <span>Growing Together</span>
              </div>
            </div>
          </div>

          <div className="px-4 space-y-3">
            {/* Top 2 Cards: Minimum Recharge & Minimum Withdrawal */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Minimum Recharge */}
              <div className="relative p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 overflow-hidden group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 block leading-tight truncate">
                    Min Recharge
                  </span>
                  <div className="mt-0.5 inline-block px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 font-black text-xs shadow-xs">
                    ₹520
                  </div>
                </div>
              </div>

              {/* Minimum Withdrawal */}
              <div className="relative p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 overflow-hidden group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 block leading-tight truncate">
                    Min Withdrawal
                  </span>
                  <div className="mt-0.5 inline-block px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 font-black text-xs shadow-xs">
                    ₹150
                  </div>
                </div>
              </div>
            </div>

            {/* Middle 2 Cards: PLAN 1 & PLAN 2 */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Plan 1 */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                {/* Header Strip with Glowing Badge */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-center py-1.5 text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>PLAN 1</span>
                </div>
                <div className="p-2.5 space-y-2">
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-medium">Invest </span>
                    <span className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                      ₹{plan1?.price || 520}
                    </span>
                  </div>

                  {/* Daily Income Pill (Emerald ROI) */}
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-black shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Get ₹{plan1?.dailyIncome || 130} Daily</span>
                  </div>

                  {/* Bonus Tag */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Gift className="w-3.5 h-3.5 text-blue-600" />
                      <span>Buy & Get</span>
                    </div>
                    <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      ₹{plan1?.bonus || 50} BONUS
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan 2 */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                {/* Header Strip with Glowing Badge */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-center py-1.5 text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span>PLAN 2</span>
                </div>
                <div className="p-2.5 space-y-2">
                  <div className="text-center">
                    <span className="text-xs text-slate-500 font-medium">Invest </span>
                    <span className="text-base font-black text-slate-900 font-['Space_Grotesk']">
                      ₹{plan2?.price || 2100}
                    </span>
                  </div>

                  {/* Daily Income Pill (Emerald ROI) */}
                  <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-700 text-xs font-black shadow-xs">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Get ₹{plan2?.dailyIncome || 500} Daily</span>
                  </div>

                  {/* Bonus Tag */}
                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      <Gift className="w-3.5 h-3.5 text-blue-600" />
                      <span>Buy & Get</span>
                    </div>
                    <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      ₹{plan2?.bonus || 100} BONUS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Invitation Banner with Megaphone */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-600/[0.08] via-indigo-600/[0.05] to-blue-500/[0.08] border border-blue-200/90 shadow-xs flex items-center justify-between gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                <Megaphone className="w-5 h-5 -rotate-12 text-blue-600" />
              </div>
              <div className="flex-1 text-center">
                <div className="text-[11px] font-semibold text-slate-600">
                  Share your exclusive invitation link
                </div>
                <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                  to get up to 25% reward
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
                <Send className="w-3.5 h-3.5 -rotate-12" />
              </div>
            </div>

            {/* 3 Medal Commission Rows */}
            <div className="space-y-1.5 text-xs">
              {/* Level 1 (Gold) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/[0.06] via-white to-amber-500/[0.03] border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black flex items-center justify-center text-xs shadow-sm ring-2 ring-amber-200/60">
                    1
                  </div>
                  <span className="font-bold text-slate-800">Level 1 commission</span>
                </div>
                <span className="font-black text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/80 shadow-xs">
                  22%
                </span>
              </div>

              {/* Level 2 (Silver) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 font-black flex items-center justify-center text-xs shadow-sm ring-2 ring-slate-200">
                    2
                  </div>
                  <span className="font-bold text-slate-800">Level 2 commission</span>
                </div>
                <span className="font-black text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/80 shadow-xs">
                  2%
                </span>
              </div>

              {/* Level 3 (Bronze) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-black flex items-center justify-center text-xs shadow-sm ring-2 ring-amber-700/30">
                    3
                  </div>
                  <span className="font-bold text-slate-800">Level 3 commission</span>
                </div>
                <span className="font-black text-blue-700 text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200/80 shadow-xs">
                  1%
                </span>
              </div>
            </div>

            {/* Big Bottom Capsule Button: Official Channel with Shimmer and Reflection */}
            <div className="pt-1 pb-1">
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  setShowCustomerCare(true);
                }}
                className="relative w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-between shadow-[0_12px_25px_-5px_rgba(37,99,235,0.45)] border-t border-white/30 active:scale-[0.98] transition-all group overflow-hidden"
              >
                {/* Subtle shine sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
                    <Send className="w-4 h-4 fill-white -rotate-12" />
                  </div>
                  <span className="tracking-wide font-['Space_Grotesk'] text-sm">Official Telegram Channel</span>
                </div>
                <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
