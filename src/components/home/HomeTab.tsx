import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/products';
import { 
  Lock, 
  CheckCircle2, 
  Coins, 
  Calendar,
  Globe
} from 'lucide-react';

interface HomeTabProps {
  onNavigateToRecharge?: () => void;
  onNavigateToWithdraw?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToRecharge, onNavigateToWithdraw }) => {
  const { 
    catalog, 
    setShowBuyModal, 
    setShowCustomerCare,
    canInvestInProduct, 
    getProductOwnedCount
  } = useApp();

  return (
    <div className="pb-24 max-w-md mx-auto bg-[#F8FAFC] text-slate-900 animate-in fade-in duration-200">
      
      {/* 1. Seamless Full-Bleed Hero Section */}
      <div className="relative w-full h-72 overflow-hidden bg-slate-900 shadow-sm">
        <img 
          src={HERO_IMAGE} 
          alt="Autonomous Robotics Industrial Headquarters"
          className="w-full h-full object-cover object-center"
        />
        {/* Top contrast scrim for navigation pills */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none z-1" />

        {/* Dark contrast scrim behind the text for crystal-clear legibility */}
        <div className="absolute bottom-8 left-0 right-0 h-36 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none z-1" />

        {/* White Gradient Effect in the highlighted bottom section across the action card overlap */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent pointer-events-none z-2" />

        {/* Top Controls Overlay on Hero: Brand & Language Pill */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          {/* Brand Logo inside hero */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center p-1.5 shadow-lg shadow-black/40 border border-white/40">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-white" />
              </span>
            </div>
            <span className="font-black text-lg tracking-wider text-white font-['Space_Grotesk'] drop-shadow-md">
              ROBO<span className="text-blue-400">VEST</span>
            </span>
          </div>

          {/* Right Language Pill */}
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-extrabold shadow-sm border border-white">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>ENG</span>
          </div>
        </div>

        {/* Hero Copy positioned cleanly with high contrast */}
        <div className="absolute bottom-9 left-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 text-[10px] font-black tracking-wider mb-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-blue-700">AUTONOMOUS YIELD FLEET</span>
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight font-['Space_Grotesk'] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            More Robots <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              A Better Tomorrow
            </span>
          </h1>
          <p className="text-[11px] text-slate-200 mt-1 font-semibold flex items-center gap-1.5 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            <span>Safe Fleets</span>
            <span className="text-orange-400">·</span>
            <span>More Opportunities</span>
            <span className="text-orange-400">·</span>
            <span>Growing Together</span>
          </p>
        </div>
      </div>

      {/* 2. Four Action Buttons (Recharge, Withdraw, Channel, Online) - Matching Reference Image Gradient Cards */}
      <div className="relative -mt-6 z-20 px-3.5">
        <div className="grid grid-cols-4 gap-2">
          {/* Recharge */}
          <button
            onClick={onNavigateToRecharge}
            className="flex flex-col items-center justify-between h-[98px] py-3 px-1 rounded-[22px] bg-gradient-to-b from-white via-white/95 to-blue-50/70 border border-blue-100/80 shadow-[0_4px_14px_rgba(254,70,0,0.09),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(254,70,0,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all text-center group"
          >
            <div className="flex-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9v10H13V9c0-1.66-1.34-3-3-3H6c-1.66 0-3 1.34-3 3v12h14v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V17h2v-3.5c0-1.3-.84-2.4-2.03-2.82l1.8-1.8-1-1.65zM6 10h4v3H6v-3z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-0.5">Recharge</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={onNavigateToWithdraw}
            className="flex flex-col items-center justify-between h-[98px] py-3 px-1 rounded-[22px] bg-gradient-to-b from-white via-white/95 to-blue-50/70 border border-blue-100/80 shadow-[0_4px_14px_rgba(254,70,0,0.09),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(254,70,0,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all text-center group"
          >
            <div className="flex-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M4 4h16c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5H4c-.83 0-1.5-.67-1.5-1.5v-3C2.5 4.67 3.17 4 4 4zm-1 8h18c.55 0 1 .45 1 1v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6c0-.55.45-1 1-1zm6 2c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-0.5">Withdraw</span>
          </button>

          {/* Channel */}
          <button
            onClick={() => setShowCustomerCare(true)}
            className="flex flex-col items-center justify-between h-[98px] py-3 px-1 rounded-[22px] bg-gradient-to-b from-white via-white/95 to-blue-50/70 border border-blue-100/80 shadow-[0_4px_14px_rgba(254,70,0,0.09),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(254,70,0,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all text-center group"
          >
            <div className="flex-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-blue-600 fill-current -rotate-12 translate-x-0.5" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-0.5">Channel</span>
          </button>

          {/* Online */}
          <button
            onClick={() => setShowCustomerCare(true)}
            className="flex flex-col items-center justify-between h-[98px] py-3 px-1 rounded-[22px] bg-gradient-to-b from-white via-white/95 to-blue-50/70 border border-blue-100/80 shadow-[0_4px_14px_rgba(254,70,0,0.09),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(254,70,0,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all text-center group"
          >
            <div className="flex-1 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-blue-600 fill-current" viewBox="0 0 24 24">
                <path d="M12 3C6.5 3 2 6.58 2 11c0 2.24 1.15 4.28 3.01 5.72-.15 1.28-.7 2.62-1.54 3.56a.5.5 0 0 0 .42.82c2.42 0 4.39-1.21 5.37-2.01.56.07 1.14.11 1.74.11 5.5 0 10-3.58 10-8s-4.5-8-10-8zm-4.5 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-0.5">Online</span>
          </button>
        </div>
      </div>

      {/* 3. Product Cards List */}
      <div className="space-y-4 px-4 mt-3.5">
        {catalog.map((product) => {
          const ownedCount = getProductOwnedCount(product.id);
          const prereqCheck = canInvestInProduct(product.id);
          const isMaxLimitReached = ownedCount >= product.maxPurchase;
          const isLocked = !prereqCheck.allowed;

          // Corner ribbon text matching Image 1 or custom badge
          const ribbonLabel = 
            product.badge ||
            (product.id === 'A' ? '★ Popular' :
            product.id === 'B' ? '👑 Best Value' :
            product.id === 'C' ? '⚡ High Growth' :
            product.id === 'D' ? '💎 Super Tier' :
            product.id === 'E' ? '🔒 VIP Elite' :
            product.id === 'F' ? '🔒 Executive' : '🔒 Apex Matrix');

          return (
            <div
              key={product.id}
              className={`relative overflow-hidden rounded-[28px] bg-white border border-slate-200/90 p-3.5 shadow-sm transition-all duration-300 ${
                isLocked ? 'opacity-90' : 'hover:shadow-md hover:border-blue-400'
              }`}
            >
              {/* Diagonal Cut Corner Ribbon (Matching Image 1 corner ribbon) */}
              <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-none z-10">
                <div className={`absolute -right-7 top-6 w-32 py-1 text-center rotate-45 text-[10px] font-black uppercase tracking-wider shadow-xs ${
                  isLocked 
                    ? 'bg-slate-300 text-slate-700' 
                    : 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white'
                }`}>
                  {ribbonLabel}
                </div>
              </div>

              {/* Main Card Body */}
              <div className="flex gap-3.5">
                {/* Left: Large Rounded Square Robot Image */}
                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200/90 shadow-xs">
                  <img
                    src={product.image}
                    alt={product.robotModel}
                    className={`w-full h-full object-cover ${product.imagePosition || 'object-center'}`}
                  />
                  
                  {/* Top-left Brand Logo Badge inside image */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[9px] font-black text-slate-900 border border-slate-200 shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-white" />
                    </span>
                    <span>ROBO</span>
                  </div>



                  {/* Bottom Bonus Badge */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/95 backdrop-blur-xs py-1 px-2 rounded-xl text-center border border-slate-200/90 shadow-xs flex items-center justify-center gap-1.5">
                    <span className="text-slate-600 font-black text-xs tracking-wider">BONUS</span>
                    <span className="text-blue-700 text-sm font-black font-['Space_Grotesk']">₹{product.bonus.toLocaleString()}</span>
                  </div>
                </div>

                {/* Right: Plan Title, Price, Stats & Glossy Buy Button */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  {/* Product Title & Owned pill */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base text-slate-900 font-['Space_Grotesk'] leading-tight">
                        {product.name}
                      </h3>
                      {ownedCount > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {ownedCount}/10
                        </span>
                      )}
                    </div>

                    {/* Price / 150 Days */}
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-blue-600 font-['Space_Grotesk']">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-lg font-extrabold text-slate-600 font-['Space_Grotesk'] tracking-tight">
                        /{product.durationDays} Days
                      </span>
                    </div>
                  </div>

                  {/* Daily & Total Stats Rows with Emerald Profit Highlight */}
                  <div className="space-y-1.5 my-1.5">
                    {/* Daily Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-slate-700 font-bold">Daily</span>
                      </div>
                      <span className="text-base font-black text-emerald-600 tabular-nums font-['Space_Grotesk']">
                        ₹{product.dailyIncome.toLocaleString()}
                      </span>
                    </div>

                    {/* Total Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
                          <Coins className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm text-slate-700 font-bold">Total</span>
                      </div>
                      <span className="text-base font-black text-blue-600 tabular-nums font-['Space_Grotesk']">
                        ₹{product.totalReturn.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Glossy Pill Buy Button */}
                  <div>
                    {isLocked ? (
                      <button
                        onClick={() => alert(prereqCheck.reason)}
                        className="w-full py-2 px-3 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-not-allowed shadow-inner"
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Locked (Plan A-D First)</span>
                      </button>
                    ) : isMaxLimitReached ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-full bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Max Units (10/10)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowBuyModal(product)}
                        className="w-full py-2.5 px-3 rounded-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black text-xs tracking-wide shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 border-t border-blue-400/50"
                      >
                        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                          ⚡
                        </span>
                        <span>Buy Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
