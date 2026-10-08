import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bot, Zap, CheckCircle2, Clock } from 'lucide-react';

export const OrdersModal: React.FC = () => {
  const { showOrdersModal, setShowOrdersModal, investments, claimDailyReturns, setActiveTab } = useApp();
  const [claimStatus, setClaimStatus] = useState<string | null>(null);

  if (!showOrdersModal) return null;

  const totalDailyRevenue = investments.reduce((sum, inv) => sum + inv.dailyIncome, 0);
  const totalUnits = investments.reduce((sum, inv) => sum + inv.quantity, 0);

  const handleClaim = () => {
    const res = claimDailyReturns();
    if (res.success) {
      setClaimStatus(res.message);
      setTimeout(() => setClaimStatus(null), 2500);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Active Robot Contracts</h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {totalUnits} Units Deployed ({investments.length} contracts)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOrdersModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Harvest Summary Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shrink-0 shadow-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Daily Combined Yield
            </span>
            <div className="text-xl font-black text-emerald-600 tabular-nums">
              ₹{totalDailyRevenue.toLocaleString()} <span className="text-xs font-semibold text-slate-400">/ day</span>
            </div>
          </div>
          <button
            onClick={handleClaim}
            disabled={totalDailyRevenue <= 0}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs active:scale-95 transition flex items-center gap-1.5 shadow-blue-500/20"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Harvest Yield</span>
          </button>
        </div>

        {claimStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{claimStatus}</span>
          </div>
        )}

        {/* Investments List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {investments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bot className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No active robot units deployed yet.</p>
              <button
                onClick={() => {
                  setShowOrdersModal(false);
                  setActiveTab('home');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs"
              >
                Explore Robotics Plans →
              </button>
            </div>
          ) : (
            investments.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2 text-xs shadow-xs hover:border-blue-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{inv.productName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        {inv.quantity}x Units
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{inv.robotModel}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Total Invested</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ₹{inv.totalInvested.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Daily Payout</span>
                    <span className="font-bold text-emerald-600 tabular-nums">
                      +₹{inv.dailyIncome.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Deploy Date</span>
                    <span className="text-slate-700">{inv.purchaseDateFormatted}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contract Period</span>
                    <span className="text-blue-700 font-semibold">150 Days</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Payout cycle: Daily 00:30 AM</span>
                  </span>
                  <span className="text-blue-600 font-medium">+₹{inv.bonusReceived} Bonus Given</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
