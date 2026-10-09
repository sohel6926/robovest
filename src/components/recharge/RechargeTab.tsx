import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, QrCode, Copy, CheckCircle2 } from 'lucide-react';

interface RechargeTabProps {
  onBack: () => void;
  onSwitchToWithdraw: () => void;
}

const PRESET_AMOUNTS = [
  { amount: 520, popular: false },
  { amount: 1999, popular: false },
  { amount: 2100, popular: false },
  { amount: 4000, popular: true },
  { amount: 8200, popular: false },
  { amount: 15500, popular: false },
  { amount: 35000, popular: false },
  { amount: 75000, popular: false },
];

export const RechargeTab: React.FC<RechargeTabProps> = ({ onBack, onSwitchToWithdraw }) => {
  const { user, rechargeWallet, platformSettings } = useApp();
  const [selectedAmount, setSelectedAmount] = useState<number>(platformSettings?.minRecharge || 520);
  const [customInput, setCustomInput] = useState<string>((platformSettings?.minRecharge || 520).toString());
  const [showPaymentSheet, setShowPaymentSheet] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('827192039182');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const handlePresetClick = (val: number) => {
    setSelectedAmount(val);
    setCustomInput(val.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setSelectedAmount(num);
    } else {
      setSelectedAmount(0);
    }
  };

  const handleContinue = () => {
    const minRec = platformSettings?.minRecharge || 520;
    if (selectedAmount < minRec) {
      alert(`Minimum recharge amount is ₹${minRec.toLocaleString()}.`);
      return;
    }
    setShowPaymentSheet(true);
  };

  const handleConfirmPayment = () => {
    const result = rechargeWallet(selectedAmount, utrNumber);
    if (result.success) {
      setPaymentSuccessMsg(result.message);
      setTimeout(() => {
        setPaymentSuccessMsg(null);
        setShowPaymentSheet(false);
        onBack();
      }, 1500);
    } else {
      alert(result.message);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText('robovest.payments@hdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

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
        <h1 className="text-base font-bold text-slate-900">Recharge</h1>
        <div className="w-8" />
      </div>

      {/* Wallet Balance Hero Banner */}
      <div className="p-4">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/20 text-center relative overflow-hidden text-white">
          <div className="text-[11px] font-bold text-blue-100 tracking-wider uppercase mb-1">
            WALLET BALANCE
          </div>
          <div className="text-4xl font-black text-white tracking-tight tabular-nums font-['Space_Grotesk']">
            ₹{user.availableBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sub-tab Switcher: Recharge | Withdraw */}
      <div className="px-4">
        <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
            Recharge
          </button>
          <button
            onClick={onSwitchToWithdraw}
            className="flex-1 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 font-semibold text-sm transition"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Enter Amount Card */}
      <div className="p-4 space-y-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-900">Enter amount</span>
            <span className="text-slate-500">Tap a quick amount below</span>
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
                  setSelectedAmount(0);
                }}
                className="absolute right-3 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-blue-600 font-bold">ℹ</span> Minimum recharge ₹520
          </div>

          {/* Quick Amount Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {PRESET_AMOUNTS.map(({ amount, popular }) => {
              const isSelected = selectedAmount === amount;
              return (
                <button
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
                  className={`relative py-3 rounded-xl font-bold text-sm transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-white'
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-blue-700 text-white text-[9px] font-black uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  ₹{amount.toLocaleString()}
                </button>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span>📋</span>
            <span>How it works</span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                1
              </span>
              <span>Minimum deposit amount is ₹520.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <span>Pay and submit within the given time window.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <span>Your balance is credited automatically once payment is confirmed.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <span>For any payment issue, contact customer support.</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>Continue ₹{selectedAmount.toLocaleString()}</span>
        </button>
      </div>

      {/* Simulated UPI & Instant Payment Drawer in Crisp White */}
      {showPaymentSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in">
          <div className="w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Instant UPI Gateway</h3>
                <p className="text-xs text-slate-500">Scan QR or Pay via any UPI App</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Amount</span>
                <p className="text-lg font-black text-blue-600">₹{selectedAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* QR Simulation Card */}
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-xs border border-slate-200">
                <QrCode className="w-36 h-36 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-500">Scan using PhonePe, Google Pay, Paytm, or BHIM</p>

              {/* UPI ID Copy */}
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-800 font-mono font-medium">robovest.payments@hdfcbank</span>
                <button
                  onClick={copyUpi}
                  className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* UTR Input Form */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>12-Digit UTR / Transaction Reference</span>
                <span className="text-[10px] text-blue-600 font-medium">Pre-generated for test</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                placeholder="Enter 12-digit UTR"
              />
            </div>

            {paymentSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPaymentSheet(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20"
              >
                Confirm Payment & Submit UTR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
