import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, QrCode, Copy, CheckCircle2, Building2, AlertTriangle, Info } from 'lucide-react';

interface RechargeTabProps {
  onBack: () => void;
  onSwitchToWithdraw: () => void;
}

export const RechargeTab: React.FC<RechargeTabProps> = ({ onBack, onSwitchToWithdraw }) => {
  const { user, rechargeWallet, platformSettings } = useApp();

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
      upiId: platformSettings?.rechargeUpiId || 'robovest.payments@hdfcbank',
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
        accountHolder: platformSettings?.rechargeAccountHolder || 'Robovest Technologies Pvt Ltd',
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
  const [showPaymentSheet, setShowPaymentSheet] = useState<boolean>(false);
  const [paymentTab, setPaymentTab] = useState<'upi' | 'bank'>('upi');
  const [utrNumber, setUtrNumber] = useState<string>('827192039182');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [copiedIfsc, setCopiedIfsc] = useState<boolean>(false);
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
    if (!isGatewayActive) {
      alert('The recharge gateway is temporarily offline for scheduled system maintenance. Please try again later.');
      return;
    }
    if (selectedAmount < minRec) {
      alert(`Minimum recharge amount is ₹${minRec.toLocaleString()}.`);
      return;
    }
    setShowPaymentSheet(true);
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
        setShowPaymentSheet(false);
        onBack();
      }, 1500);
    } else {
      alert(result.message);
    }
  };

  const copyUpi = () => {
    if (currentQr?.upiId) {
      navigator.clipboard.writeText(currentQr.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const copyBankDetail = (text: string, type: 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  // Generate dynamic QR Code for the specific selected UPI ID and amount
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(currentQr?.upiId || '')}&pn=${encodeURIComponent(currentQr?.payeeName || 'FanCode')}&am=${selectedAmount}&cu=INR`;
  const displayQrSrc = currentQr?.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;

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
          disabled={!isGatewayActive}
          className={`w-full py-3.5 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
            isGatewayActive
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isGatewayActive ? 'Continue to Pay' : 'Gateway Offline'}
        </button>
      </div>

      {/* Simulated UPI & Instant Payment Drawer in Crisp White (Live data from Admin Panel) */}
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

            {/* Optional Tab Toggle if Bank Details are provided */}
            {effectiveBankList.length > 0 && (
              <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-bold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentTab('upi')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    paymentTab === 'upi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  UPI & QR Code {effectiveQrList.length > 1 ? `(${effectiveQrList.length})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('bank')}
                  className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                    paymentTab === 'bank' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Direct Bank Transfer {effectiveBankList.length > 1 ? `(${effectiveBankList.length})` : ''}
                </button>
              </div>
            )}

            {paymentTab === 'upi' ? (
              /* QR Simulation Card with Live Admin Details */
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                {/* Multi-QR Option Pills (if more than 1 active QR code exists) */}
                {effectiveQrList.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-center">
                    {effectiveQrList.map((q, idx) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSelectedQrId(q.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                          currentQr?.id === q.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {q.label || `Scanner ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-xs border border-slate-200 overflow-hidden">
                  {displayQrSrc ? (
                    <img
                      src={displayQrSrc}
                      alt="UPI QR Code"
                      className="w-36 h-36 object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <QrCode className="w-36 h-36 text-slate-900" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {instructions || 'Scan using PhonePe, Google Pay, Paytm, or BHIM'}
                </p>

                {/* Live UPI ID with Instant Copy */}
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-800 font-mono font-bold truncate mr-2">
                    {currentQr?.upiId || 'No UPI ID configured'}
                  </span>
                  <button
                    onClick={copyUpi}
                    className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 shrink-0 cursor-pointer"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {currentQr?.payeeName && (
                  <div className="text-[11px] text-slate-500">
                    Payee: <span className="font-semibold text-slate-800">{currentQr.payeeName}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Bank Transfer Details */
              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                {/* Multi-Bank Option Pills (if more than 1 active bank account exists) */}
                {effectiveBankList.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-start">
                    {effectiveBankList.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBankId(b.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition shrink-0 cursor-pointer ${
                          currentBank?.id === b.id
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {b.bankName}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-slate-900">{currentBank?.bankName || 'Direct Bank IMPS / NEFT'}</span>
                  </div>
                  {currentBank?.accountType && (
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      {currentBank.accountType}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 text-[11px]">Account Holder:</span>
                  <span className="font-bold text-slate-900">{currentBank?.accountHolder}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                  <span className="text-slate-500 text-[11px]">Account Number:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900">{currentBank?.accountNumber}</span>
                    <button
                      onClick={() => copyBankDetail(currentBank?.accountNumber || '', 'acc')}
                      className="text-blue-600 text-[11px] font-bold cursor-pointer"
                    >
                      {copiedAccount ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                  <span className="text-slate-500 text-[11px]">IFSC Code:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-600">{currentBank?.ifscCode}</span>
                    <button
                      onClick={() => copyBankDetail(currentBank?.ifscCode || '', 'ifsc')}
                      className="text-blue-600 text-[11px] font-bold cursor-pointer"
                    >
                      {copiedIfsc ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {currentBank?.branch && (
                  <div className="flex justify-between items-center py-1 border-t border-slate-200/60">
                    <span className="text-slate-500 text-[11px]">Branch:</span>
                    <span className="text-slate-700 font-medium">{currentBank.branch}</span>
                  </div>
                )}
              </div>
            )}

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
                className="flex-2 py-3 rounded-xl bg-[#fe4600] hover:bg-[#ea3f00] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition"
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
