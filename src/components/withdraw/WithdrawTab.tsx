import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CreditCard, Clock } from 'lucide-react';

interface WithdrawTabProps {
  onBack: () => void;
  onSwitchToRecharge: () => void;
}

export const WithdrawTab: React.FC<WithdrawTabProps> = ({ onBack, onSwitchToRecharge }) => {
  const { 
    user, 
    requestWithdrawal, 
    setShowBankCardModal, 
    checkWithdrawalEligibility,
    advanceTimeToNextDayAfter1230,
    resetSimulatedTime
  } = useApp();

  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const eligibility = checkWithdrawalEligibility();

  const handlePercentageClick = (percentage: number) => {
    const calculated = Math.floor((user.withdrawableBalance * percentage) / 100);
    setWithdrawAmount(calculated);
    setCustomInput(calculated.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setWithdrawAmount(num);
    } else {
      setWithdrawAmount(0);
    }
  };

  const handleWithdrawSubmit = () => {
    if (withdrawAmount < 150) {
      setStatusMessage({ text: 'Minimum withdrawal amount is ₹150.', isError: true });
      return;
    }

    if (withdrawAmount > user.withdrawableBalance) {
      setStatusMessage({ text: `Amount exceeds withdrawable balance of ₹${user.withdrawableBalance.toLocaleString()}`, isError: true });
      return;
    }

    const res = requestWithdrawal(withdrawAmount);
    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setWithdrawAmount(0);
      setCustomInput('');
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  const fee = Math.round(withdrawAmount * 0.10 * 100) / 100;
  const netReceive = Math.max(0, withdrawAmount - fee);

  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/90 shadow-sm">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">Withdraw</h1>
        <div className="w-8" />
      </div>

      {/* Withdrawable Balance Hero Banner */}
      <div className="p-4">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 text-center relative overflow-hidden text-white">
          <div className="text-[11px] font-bold text-blue-100 tracking-wider uppercase mb-1">
            WITHDRAWABLE BALANCE
          </div>
          <div className="text-4xl font-black text-white tracking-tight tabular-nums font-['Space_Grotesk']">
            ₹{user.withdrawableBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sub-tab Switcher: Recharge | Withdraw */}
      <div className="px-4">
        <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <button
            onClick={onSwitchToRecharge}
            className="flex-1 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-sm transition"
          >
            Recharge
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
            Withdraw
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Next Day After 12:30 AM Rule Banner in Crisp White */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Next Day 12:30 AM Rule Status</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              eligibility.isEligible 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {eligibility.isEligible ? 'WINDOW OPEN' : 'RESTRICTED'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {eligibility.reason}
          </p>

          {/* Interactive Fast-Forward simulator button to verify rule */}
          {eligibility.hasInvestedToday && (
            <div className="pt-1.5 flex gap-2">
              <button
                onClick={advanceTimeToNextDayAfter1230}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>⚡ Simulate Next Day (12:35 AM)</span>
              </button>
              <button
                onClick={resetSimulatedTime}
                className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 transition"
              >
                Reset Time
              </button>
            </div>
          )}
        </div>

        {/* Bank Account Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">Bank account</span>
            </div>
            {user.bankAccount.isBound && (
              <button
                onClick={() => setShowBankCardModal(true)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Change
              </button>
            )}
          </div>

          {user.bankAccount.isBound ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-900">{user.bankAccount.accountHolder}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Bank:</span>
                <span className="font-semibold text-slate-800">{user.bankAccount.bankName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">A/C Number:</span>
                <span className="font-mono font-bold text-blue-600">
                  •••• {user.bankAccount.accountNumber.slice(-4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                No bank account linked yet. Bind your bank card to start withdrawing.
              </p>
              <button
                onClick={() => setShowBankCardModal(true)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bind bank card</span>
              </button>
            </div>
          )}
        </div>

        {/* Enter Amount Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-900">Enter amount</span>
            <span className="text-slate-500">Available ₹{user.withdrawableBalance.toLocaleString()}</span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-4 text-2xl font-bold text-blue-600">₹</span>
            <input
              type="text"
              value={customInput}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-10 text-2xl font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white tabular-nums"
              placeholder="0"
            />
            {customInput && (
              <button
                onClick={() => {
                  setCustomInput('');
                  setWithdrawAmount(0);
                }}
                className="absolute right-3 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-blue-600 font-bold">ℹ</span> Minimum withdrawal ₹150
          </div>

          {/* Quick Percentage Chips */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercentageClick(pct)}
                className="py-2.5 rounded-xl font-bold text-xs bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-800 transition"
              >
                {pct === 100 ? 'Max' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Breakdown Calculation Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2 text-xs shadow-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>Withdraw amount</span>
            <span className="font-bold text-slate-900 tabular-nums">₹{withdrawAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Fee (-10.00% tax)</span>
            <span className="font-semibold text-rose-600 tabular-nums">- ₹{fee.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold">
            <span className="text-slate-900">You receive</span>
            <span className="text-base text-blue-600 tabular-nums">₹{netReceive.toLocaleString()}</span>
          </div>
        </div>

        {/* Withdrawal Instructions */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>📋</span>
            <span>Withdrawal instructions</span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <span>Minimum withdrawal amount is ₹150.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <span>A 10.00% service tax is deducted from every transaction.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <span>Withdrawal time: 00:30 - 17:00 (12:30 AM to 5:00 PM).</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <span>Funds usually arrive within 30 minutes (max 24 hours).</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                5
              </span>
              <span>Ensure your bank details are correct to avoid failed payments.</span>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.isError 
              ? 'bg-rose-50 border border-rose-200 text-rose-700' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleWithdrawSubmit}
          disabled={!eligibility.isEligible}
          className={`w-full py-3.5 rounded-xl font-black text-base shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${
            eligibility.isEligible
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Continue ₹{withdrawAmount.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
};
