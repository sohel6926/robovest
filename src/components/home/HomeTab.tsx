import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/products';
import { 
  Lock, 
  CheckCircle2, 
  MapPin, 
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

        {/* Half-picture White Gradient Effect / Mask: smoothly fades the lower half into the light surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 via-45% to-transparent pointer-events-none z-1" />
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none z-1" />

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

        {/* Hero Copy positioned cleanly over the White Gradient Mask */}
        <div className="absolute bottom-9 left-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 text-[10px] font-black tracking-wider mb-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-blue-700">AUTONOMOUS YIELD FLEET</span>
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight font-['Space_Grotesk'] text-slate-900 drop-shadow-xs">
            More Robots <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">A Better Tomorrow</span>
          </h1>
          <p className="text-[11px] text-slate-600 mt-1 font-bold flex items-center gap-1.5">
            <span>Safe Fleets</span>
            <span className="text-blue-600">·</span>
            <span>More Opportunities</span>
            <span className="text-blue-600">·</span>
            <span>Growing Together</span>
          </p>
        </div>
      </div>

      {/* 2. Four Action Buttons (Recharge, Withdraw, Channel, Online) */}
      <div className="relative -mt-5 z-20 px-4">
        <div className="grid grid-cols-4 gap-2">
          {/* Recharge */}
          <button
            onClick={onNavigateToRecharge}
            className="flex flex-col items-center justify-center group active:scale-95 text-center transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 shadow-sm group-hover:shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9v10H13V9c0-1.66-1.34-3-3-3H6c-1.66 0-3 1.34-3 3v12h14v-7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V17h2v-3.5c0-1.3-.84-2.4-2.03-2.82l1.8-1.8-1-1.65zM6 10h4v3H6v-3z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 tracking-tight">Recharge</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={onNavigateToWithdraw}
            className="flex flex-col items-center justify-center group active:scale-95 text-center transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 shadow-sm group-hover:shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M4 5h16c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1zm1 7h14c.55 0 1 .45 1 1v5c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-5c0-.55.45-1 1-1zm5 2v2h4v-2h-4z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 tracking-tight">Withdraw</span>
          </button>

          {/* Channel */}
          <button
            onClick={() => setShowCustomerCare(true)}
            className="flex flex-col items-center justify-center group active:scale-95 text-center transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 shadow-sm group-hover:shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current -rotate-12 translate-x-0.5" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 tracking-tight">Channel</span>
          </button>

          {/* Online */}
          <button
            onClick={() => setShowCustomerCare(true)}
            className="flex flex-col items-center justify-center group active:scale-95 text-center transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 shadow-sm group-hover:shadow-md flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 11c-.83 0-1.5-.67-1.5-1.5S6.17 8 7 8s1.5.67 1.5 1.5S7.83 11 7 11zm5 0c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11zm5 0c-.83 0-1.5-.67-1.5-1.5S16.17 8 17 8s1.5.67 1.5 1.5S17.83 11 17 11z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2 tracking-tight">Online</span>
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

                  {/* City Location Pin */}
                  <div className="absolute top-2 right-2 text-slate-900 drop-shadow-md">
                    <div className="w-6 h-6 rounded-full bg-black/80 flex items-center justify-center text-blue-400 border border-white/40">
                      <MapPin className="w-3.5 h-3.5 fill-blue-400 text-black" />
                    </div>
                  </div>

                  {/* Bottom Bonus Badge */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-white/95 backdrop-blur-xs text-blue-700 text-[10px] font-black py-0.5 px-2 rounded-lg text-center border border-slate-200 shadow-xs flex items-center justify-center gap-1">
                    <span className="text-slate-500 font-bold">BONUS</span>
                    <span className="text-blue-700 text-xs">₹{product.bonus.toLocaleString()}</span>
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
                    <div className="mt-0.5 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-blue-600 font-['Space_Grotesk']">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
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
