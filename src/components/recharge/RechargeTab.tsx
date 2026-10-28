import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, AlertTriangle, LogIn } from 'lucide-react';
import { PaymentPage } from './PaymentPage';

interface RechargeTabProps {
  onBack: () => void;
  onSwitchToWithdraw: () => void;
}

export const RechargeTab: React.FC<RechargeTabProps> = ({ onBack, onSwitchToWithdraw }) => {
  const { user, rechargeWallet, platformSettings, setShowAuthModal } = useApp();

  // Dynamic values configured from Admin Panel
  const minRec = platformSettings?.minRecharge || 520;
  const instructions = platformSettings?.rechargeInstructions;
  const quickAmounts = platformSettings?.rechargeQuickAmounts && platformSettings.rechargeQuickAmounts.length > 0
    ? platformSettings.rechargeQuickAmounts
    : [520, 1999, 2100, 4000, 8200, 15500, 35000, 75000];
  const isGatewayActive = platformSettings?.rechargeGatewayActive !== false;

  // Active QR codes from Admin
  const activeQrList = (platformSettings?.rechargeQrList || []).filter(q => q.isActive);
  const effectiveQrList = activeQrList.length > 0 ? activeQrList : [
    {
      id: 'default-qr',
      label: 'Primary UPI Gateway',
      upiId: platformSettings?.rechargeUpiId || 'fancode.payments@hdfcbank',
      payeeName: platformSettings?.rechargePayeeName || 'FanCode Payments',
      qrImageUrl: platformSettings?.rechargeQrImageUrl || '',
      isActive: true,
    }
  ];

  // Active Bank Accounts from Admin
  const activeBankList = (platformSettings?.rechargeBankList || []).filter(b => b.isActive);
  const effectiveBankList = activeBankList.length > 0 ? activeBankList : (
    platformSettings?.rechargeAccountNumber ? [
      {
        id: 'default-bank',
        bankName: platformSettings?.rechargeBankName || 'HDFC Bank',
        accountHolder: platformSettings?.rechargeAccountHolder || 'FanCode Technologies Pvt Ltd',
        accountNumber: platformSettings?.rechargeAccountNumber || '50200084729103',
        ifscCode: platformSettings?.rechargeIfscCode || 'HDFC0000128',
        accountType: 'Current Account',
        branch: '',
        isActive: true,
      }
    ] : []
  );

  const [selectedQrId, setSelectedQrId] = useState<string>(effectiveQrList[0]?.id || 'default-qr');
  const [selectedBankId, setSelectedBankId] = useState<string>(effectiveBankList[0]?.id || 'default-bank');

  const currentQr = effectiveQrList.find(q => q.id === selectedQrId) || effectiveQrList[0];
  const currentBank = effectiveBankList.find(b => b.id === selectedBankId) || effectiveBankList[0];

  const [selectedAmount, setSelectedAmount] = useState<number>(minRec);
  const [customInput, setCustomInput] = useState<string>(minRec.toString());
  const [showPaymentPage, setShowPaymentPage] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (minRec) {
      setSelectedAmount(prev => (prev === 520 || prev < minRec ? minRec : prev));
      setCustomInput(prev => (prev === '520' || Number(prev) < minRec ? minRec.toString() : prev));
    }
  }, [minRec]);

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
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!isGatewayActive) {
      alert('The recharge gateway is temporarily offline for scheduled system maintenance. Please try again later.');
      return;
    }
    if (selectedAmount < minRec) {
      alert(`Minimum recharge amount is ₹${minRec.toLocaleString()}.`);
      return;
    }
    setShowPaymentPage(true);
  };

  const handleConfirmPayment = () => {
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      alert('Please enter a valid 12-digit UTR or Transaction Reference Number.');
      return;
    }
    const result = rechargeWallet(selectedAmount, utrNumber);
    if (result.success) {
      setPaymentSuccessMsg(result.message);
      setTimeout(() => {
        setPaymentSuccessMsg(null);
        setShowPaymentPage(false);
        onBack();
      }, 1500);
    } else {
      alert(result.message);
    }
  };



  // If user clicked Continue to Pay, render the full payment page
  if (showPaymentPage) {
    return (
      <PaymentPage
        amount={selectedAmount}
        qrList={effectiveQrList}
        bankList={effectiveBankList}
        instructions={instructions}
        utrNumber={utrNumber}
        onUtrChange={setUtrNumber}
        onConfirm={handleConfirmPayment}
        onBack={() => setShowPaymentPage(false)}
        successMsg={paymentSuccessMsg}
      />
    );
  }

  return (
    <div className="pb-24 max-w-md mx-auto min-h-screen bg-[#FFF7F2] text-slate-900 font-sans">
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
          <div className="text-4xl font-extrabold text-white tracking-tight tabular-nums">
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

      {/* Gateway Offline Warning */}
      {!isGatewayActive && (
        <div className="m-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Gateway Under Maintenance</span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Online UPI recharge is currently undergoing scheduled server upgrades. Please check back shortly.
            </p>
          </div>
        </div>
      )}

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
            <span className="text-blue-600 font-bold">ℹ</span> Minimum recharge ₹{minRec.toLocaleString()}
          </div>

          {/* Quick Amount Grid dynamically rendered from admin config */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {quickAmounts.map((amount) => {
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
              <span>Minimum deposit amount is ₹{minRec.toLocaleString()}.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                2
              </span>
              <span>Scan QR code or copy the UPI ID to complete payment in any UPI app.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                3
              </span>
              <span>Copy the 12-digit UTR / Reference number from receipt and submit.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                4
              </span>
              <span>Your balance is credited automatically once transaction reference is confirmed.</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={user.isLoggedIn && !isGatewayActive}
          className={`w-full py-3.5 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
            !user.isLoggedIn
              ? 'bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:from-[#FF6500] hover:to-[#FF4000] text-white shadow-lg shadow-orange-500/25 active:scale-[0.99] cursor-pointer'
              : isGatewayActive
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {!user.isLoggedIn ? (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In to Recharge</span>
            </>
          ) : isGatewayActive ? (
            'Continue to Pay'
          ) : (
            'Gateway Offline'
          )}
        </button>
      </div>


    </div>
  );
};
