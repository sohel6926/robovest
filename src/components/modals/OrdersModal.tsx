import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bot, Zap, CheckCircle2, Clock } from 'lucide-react';

export const OrdersModal: React.FC = () => {
  const { 
    showOrdersModal, 
    setShowOrdersModal, 
    investments, 
    setActiveTab 
  } = useApp();

  if (!showOrdersModal) return null;

  const activeInvestments = investments.filter(inv => inv.status === 'ACTIVE');
  const totalDailyRevenue = activeInvestments.reduce((sum, inv) => sum + inv.dailyIncome, 0);
  const totalUnits = activeInvestments.reduce((sum, inv) => sum + inv.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
              <Zap className="w-4 h-4 fill-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Active FanCode Contracts</h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {totalUnits} Units Deployed ({investments.length} contracts)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOrdersModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Automated Daily Yield Summary Box (No Manual Harvest Needed) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 space-y-2 shrink-0 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-emerald-800 uppercase font-black tracking-wider block">
                Daily Combined Return
              </span>
              <div className="text-xl font-black text-emerald-700 tabular-nums">
                ₹{totalDailyRevenue.toLocaleString()} <span className="text-xs font-semibold text-emerald-600">/ day</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Auto-Credited</span>
            </div>
          </div>

          {/* Subtext info pill */}
          <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-800">
            <span className="font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>Automatically credited directly to wallet daily at 00:30 AM</span>
            </span>
            <span className="font-bold text-emerald-700 text-[10px] shrink-0 ml-1">Automated</span>
          </div>
        </div>

        {/* Investments List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {investments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Zap className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No active sports contracts deployed yet.</p>
              <button
                onClick={() => {
                  setShowOrdersModal(false);
                  setActiveTab('home');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                Explore Sports Plans →
              </button>
            </div>
          ) : (
            investments.map((inv) => {
              const totalDays = 150;
              const daysReceived = Math.min(totalDays, Math.max(1, inv.daysElapsed || 1));
              const daysPending = Math.max(0, totalDays - daysReceived);
              const progressPercent = Math.min(100, Math.round((daysReceived / totalDays) * 100));
              const roiEarned = daysReceived * inv.dailyIncome;
              const bonusEarned = Number(inv.bonusReceived || 0);
              const totalEarned = inv.totalEarned || (roiEarned + bonusEarned);

              return (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 text-xs shadow-xs hover:border-blue-200 transition"
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

                  {/* Days Received vs Days Pending */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                        <span><strong>{daysReceived}</strong> Days Received</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                        <span><strong>{daysPending}</strong> Days Pending</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#FF4A00] rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Day {daysReceived} of {totalDays}</span>
                        <span>{progressPercent}% Complete</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Daily Payout</span>
                      <span className="font-bold text-emerald-600 tabular-nums">
                        +₹{inv.dailyIncome.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Total Earned</span>
                      <span className="font-black text-blue-700 tabular-nums">
                        ₹{totalEarned.toLocaleString()}
                      </span>
                      {bonusEarned > 0 && (
                        <span className="text-[8.5px] text-blue-500 block leading-tight font-medium">
                          (₹{roiEarned} + ₹{bonusEarned} bonus)
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9.5px]">Total Invested</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        ₹{inv.totalInvested.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-600" />
                      <span>Payout cycle: Daily 00:30 AM</span>
                    </span>
                    <span className="text-blue-600 font-medium">+₹{inv.bonusReceived} Bonus Given</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
