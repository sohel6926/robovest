import React from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE } from '../../data/products';
import { 
  Calendar, 
  Clock, 
  Coins, 
  Gift, 
  Zap, 
  ChevronRight, 
  Crown
} from 'lucide-react';

interface HomeTabProps {
  onNavigateToRecharge?: () => void;
  onNavigateToWithdraw?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ 
  onNavigateToRecharge, 
  onNavigateToWithdraw 
}) => {
  const { 
    catalog, 
    setShowBuyModal, 
    setShowCustomerCare,
    getProductOwnedCount,
    platformSettings
  } = useApp();

  return (
    <div className="pb-28 max-w-md mx-auto bg-[#F5F6F9] min-h-screen text-slate-900 select-none">
      
      {/* Top Sports Montage Banner (FANCODE LIVE SPORTS EVERY MOMENT) */}
      <div className="px-3 pt-3">
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-sm bg-gradient-to-r from-orange-500 to-amber-500">
          <img 
            src={HERO_IMAGE} 
            alt="FanCode Live Sports Every Moment"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* 3. Four Action Cards: Recharge, Withdraw, Channel, Online */}
      <div className="px-3 mt-1.5">
        <div className="grid grid-cols-4 gap-2.5">
          {/* Action 1: Recharge */}
          <button
            onClick={onNavigateToRecharge}
            className="flex flex-col items-center justify-center h-20 py-2 px-1 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center text-[#FF4A00] mb-1 group-hover:scale-110 transition-transform">
              {/* Wallet with plus icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 5h14v2h-8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8v2H5V5zm10.5 5.5h2v1h-2v2h-1v-2h-2v-1h2v-2h1v2z"/>
              </svg>
            </div>
            <span className="text-[12px] font-bold text-slate-800 tracking-tight leading-tight">
              Recharge
            </span>
          </button>

          {/* Action 2: Withdraw */}
          <button
            onClick={onNavigateToWithdraw}
            className="flex flex-col items-center justify-center h-20 py-2 px-1 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center text-[#FF4A00] mb-1 group-hover:scale-110 transition-transform">
              {/* ATM / Bank Card Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2zm-12 8H6v-2h2v2z"/>
              </svg>
            </div>
            <span className="text-[12px] font-bold text-slate-800 tracking-tight leading-tight">
              Withdraw
            </span>
          </button>

          {/* Action 3: Channel (Telegram) */}
          <button
            onClick={() => {
              if (platformSettings?.telegramChannelUrl) {
                window.open(platformSettings.telegramChannelUrl, '_blank');
              } else {
                setShowCustomerCare(true);
              }
            }}
            className="flex flex-col items-center justify-center h-20 py-2 px-1 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center text-[#FF4A00] mb-1 group-hover:scale-110 transition-transform">
              {/* Telegram Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
            </div>
            <span className="text-[12px] font-bold text-slate-800 tracking-tight leading-tight">
              Channel
            </span>
          </button>

          {/* Action 4: Online */}
          <button
            onClick={() => setShowCustomerCare(true)}
            className="flex flex-col items-center justify-center h-20 py-2 px-1 rounded-2xl bg-white border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center group cursor-pointer outline-none focus:outline-none focus-visible:outline-none focus:ring-0"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50/80 flex items-center justify-center text-[#FF4A00] mb-1 group-hover:scale-110 transition-transform">
              {/* Online Support Chat Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
              </svg>
            </div>
            <span className="text-[12px] font-bold text-slate-800 tracking-tight leading-tight">
              Online
            </span>
          </button>
        </div>
      </div>

      {/* 4. Products Catalog List */}
      <div className="space-y-3.5 px-3 mt-3.5">
        {catalog.map((product) => {
          const ownedCount = getProductOwnedCount(product.id);
          const isProductA = product.id === 'A';

          return (
            <div
              key={product.id}
              className="relative overflow-hidden rounded-[22px] bg-white border border-slate-100 p-3 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md flex gap-3"
            >
              {/* Left Column: Image with FANCODE Overlay and Bonus Pill */}
              <div className="relative w-36 self-stretch min-h-[215px] rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover ${product.imagePosition || 'object-center'}`}
                />
                
                {/* Top-left Brand Tag Overlay on Image */}
                <div className="absolute top-2 left-2 flex items-baseline font-black italic text-xs tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  FAN<span className="text-[#FF4A00]">CODE</span>
                </div>

                {/* Bottom Overlay: Bonus Pill Badge */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs py-1 px-2 rounded-full border border-slate-100 shadow-sm flex items-center justify-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#FF4A00]" />
                  <span className="text-[#FF4A00] font-black text-xs font-['Space_Grotesk']">
                    ₹{product.bonus} Bonus
                  </span>
                </div>
              </div>

              {/* Right Column: Title, Separate Colored Boxes for All Metrics, and View Plan CTA */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                
                {/* 1. Header Row: Product Name + POPULAR Crown Badge */}
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-black text-lg text-slate-900 font-['Space_Grotesk'] leading-tight truncate">
                    {product.name}
                  </h3>

                  {/* POPULAR Crown Badge (Matching Product A in screenshot) */}
                  {(isProductA || product.badge === 'POPULAR') && (
                    <span className="shrink-0 bg-gradient-to-r from-[#FF6600] to-[#FF4500] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Crown className="w-3 h-3 fill-white" />
                      <span>POPULAR</span>
                    </span>
                  )}

                  {!isProductA && product.badge && product.badge !== 'POPULAR' && (
                    <span className="shrink-0 bg-orange-50 text-[#FF4A00] border border-orange-200 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* 2. Separate Box: Investment Amount */}
                <div className="bg-[#FFF7F2] rounded-xl px-2.5 py-1.5 my-1.5 border border-[#FFE8DC]">
                  <p className="text-[10px] text-slate-400 font-semibold leading-none">
                    Investment Amount
                  </p>
                  <div className="text-[22px] font-black text-[#FF4800] font-['Space_Grotesk'] leading-tight mt-0.5">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>

                {/* 3. 2x2 Grid: Each Stat in its Own Separate Colored Box */}
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  
                  {/* Box 1: Daily Payout (Soft Mint Green Box) */}
                  <div className="bg-[#EDFBF5] rounded-xl p-1.5 border border-[#D0F3E2] flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-emerald-100/80 text-[#00B074] flex items-center justify-center shrink-0">
                      <Calendar className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] text-slate-500 font-medium leading-none truncate">
                        Daily Payout
                      </div>
                      <div className="text-[13px] font-black text-[#00B074] font-['Space_Grotesk'] leading-tight mt-0.5">
                        ₹{product.dailyIncome.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Box 2: Duration (Soft Cool Gray/Blue Box) */}
                  <div className="bg-[#F1F5F9] rounded-xl p-1.5 border border-[#E2E8F0] flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] text-slate-500 font-medium leading-none truncate">
                        Duration
                      </div>
                      <div className="text-[13px] font-black text-slate-800 font-['Space_Grotesk'] leading-tight mt-0.5">
                        {product.durationDays} Days
                      </div>
                    </div>
                  </div>

                  {/* Box 3: Total Payout (Soft Warm Peach/Orange Box) */}
                  <div className="bg-[#FFF4EC] rounded-xl p-1.5 border border-[#FFE3D1] flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-orange-100/90 text-[#FF4A00] flex items-center justify-center shrink-0">
                      <Coins className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] text-slate-500 font-medium leading-none truncate">
                        Total Payout
                      </div>
                      <div className="text-[13px] font-black text-[#FF4A00] font-['Space_Grotesk'] leading-tight mt-0.5">
                        ₹{product.totalReturn.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Box 4: Bonus (Soft Warm Peach/Orange Box) */}
                  <div className="bg-[#FFF4EC] rounded-xl p-1.5 border border-[#FFE3D1] flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-orange-100/90 text-[#FF4A00] flex items-center justify-center shrink-0">
                      <Gift className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] text-slate-500 font-medium leading-none truncate">
                        Bonus
                      </div>
                      <div className="text-[13px] font-black text-[#FF4A00] font-['Space_Grotesk'] leading-tight mt-0.5">
                        ₹{product.bonus.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Full-width Orange Pill View Plan Button */}
                <button
                  onClick={() => setShowBuyModal(product)}
                  className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#FF5E00] via-[#FF4D00] to-[#FF3500] hover:from-[#FF6800] hover:to-[#FF4000] text-white font-black text-xs tracking-wide shadow-md shadow-orange-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-white text-white" />
                  <span>View Plan</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
