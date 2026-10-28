import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  QrCode,
  Copy,
  CheckCircle2,
  Building2,
  Smartphone,
  Shield,
  ChevronRight,
  Hash,
  Clipboard,
  X,
  Info,
} from 'lucide-react';

interface QrEntry {
  id: string;
  label: string;
  upiId: string;
  payeeName: string;
  qrImageUrl?: string;
  isActive: boolean;
}

interface BankEntry {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType?: string;
  branch?: string;
  isActive: boolean;
}

interface PaymentPageProps {
  amount: number;
  qrList: QrEntry[];
  bankList: BankEntry[];
  instructions?: string;
  utrNumber: string;
  onUtrChange: (val: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  successMsg: string | null;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  amount,
  qrList,
  bankList,
  instructions,
  utrNumber,
  onUtrChange,
  onConfirm,
  onBack,
  successMsg,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'bank'>('upi');
  const [selectedQrId, setSelectedQrId] = useState<string>(qrList[0]?.id || '');
  const [selectedBankId, setSelectedBankId] = useState<string>(bankList[0]?.id || '');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  const currentQr = qrList.find((q) => q.id === selectedQrId) || qrList[0];
  const currentBank = bankList.find((b) => b.id === selectedBankId) || bankList[0];

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(currentQr?.upiId || '')}&pn=${encodeURIComponent(currentQr?.payeeName || 'Payment')}&am=${amount}&cu=INR`;
  const displayQrSrc =
    currentQr?.qrImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiDeepLink)}`;

  const copyText = (text: string, type: 'upi' | 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') { setCopiedUpi(true); setTimeout(() => setCopiedUpi(false), 2000); }
    if (type === 'acc') { setCopiedAccount(true); setTimeout(() => setCopiedAccount(false), 2000); }
    if (type === 'ifsc') { setCopiedIfsc(true); setTimeout(() => setCopiedIfsc(false), 2000); }
  };

  // Authentic 12-Digit UPI UTR formatting & helpers
  const cleanUtrDigits = (utrNumber || '').replace(/\D/g, '').slice(0, 12);
  const isUtrComplete = cleanUtrDigits.length === 12;

  const formatUtrDisplay = (digits: string) => {
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleUtrInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    onUtrChange(digits);
  };

  const handlePasteUtr = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      const digits = clipText.replace(/\D/g, '').slice(0, 12);
      if (digits) {
        onUtrChange(digits);
      }
    } catch (err) {
      console.warn('Clipboard read error', err);
    }
  };

  const handleClearUtr = () => {
    onUtrChange('');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-slate-900 font-sans flex flex-col max-w-md mx-auto">

      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Complete Payment</h1>
          <p className="text-[11px] text-slate-400 leading-tight">Choose your preferred method</p>
        </div>
        <div className="w-9" />
      </div>

      {/* ── Amount Banner ── */}
      <div className="px-4 pt-5 pb-3">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-5 flex items-center justify-between shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="relative">
            <p className="text-[11px] font-bold text-blue-100 uppercase tracking-widest mb-0.5">Amount to Pay</p>
            <p className="text-3xl font-black text-white tabular-nums">&#8377;{amount.toLocaleString()}</p>
          </div>
          <div className="relative bg-white/20 rounded-2xl px-4 py-2 text-center">
            <Shield className="w-5 h-5 text-white mx-auto mb-0.5" />
            <p className="text-[10px] font-bold text-white/90">Secure</p>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="px-4 pb-3">
        <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs gap-1">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'upi'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-400/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            UPI / QR Code
            {qrList.length > 1 && (
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${activeTab === 'upi' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                {qrList.length}
              </span>
            )}
          </button>
          {bankList.length > 0 && (
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'bank'
                  ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-400/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Bank Transfer
              {bankList.length > 1 && (
                <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-bold ${activeTab === 'bank' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-600'}`}>
                  {bankList.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 pb-6 space-y-4 overflow-y-auto">

        {/* ─ UPI / QR Tab ─ */}
        {activeTab === 'upi' && (
          <div className="space-y-4">

            {/* Multi-QR Pills */}
            {qrList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {qrList.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQrId(q.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition border ${
                      currentQr?.id === q.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {q.label || `Scanner ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* QR Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scan &amp; Pay</p>

              {/* QR Image */}
              <div className="w-52 h-52 mx-auto bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden p-2">
                {displayQrSrc ? (
                  <img
                    src={displayQrSrc}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                ) : (
                  <QrCode className="w-36 h-36 text-slate-400" />
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {instructions || 'Open PhonePe, Google Pay, Paytm, or BHIM and scan to pay'}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or pay with UPI ID</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* UPI ID Copy Row */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="text-left min-w-0 mr-3">
                  <p className="text-[10px] text-slate-500 mb-0.5">UPI ID</p>
                  <p className="text-sm font-mono font-bold text-slate-900 truncate">
                    {currentQr?.upiId || 'Not configured'}
                  </p>
                </div>
                <button
                  onClick={() => copyText(currentQr?.upiId || '', 'upi')}
                  className={`flex items-center gap-1.5 shrink-0 text-xs font-bold px-3 py-2 rounded-lg transition ${
                    copiedUpi ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUpi ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {currentQr?.payeeName && (
                <p className="text-[11px] text-slate-500">
                  Payee: <span className="font-semibold text-slate-800">{currentQr.payeeName}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─ Bank Transfer Tab ─ */}
        {activeTab === 'bank' && currentBank && (
          <div className="space-y-4">

            {/* Multi-bank pills */}
            {bankList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {bankList.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBankId(b.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition border ${
                      currentBank?.id === b.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {b.bankName}
                  </button>
                ))}
              </div>
            )}

            {/* Bank Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Bank Header */}
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{currentBank.bankName}</p>
                    <p className="text-purple-200 text-[11px]">{currentBank.accountType || 'Bank Account'}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg">
                  IMPS / NEFT
                </span>
              </div>

              {/* Bank Detail Rows */}
              <div className="divide-y divide-slate-100 px-5">
                <BankRow label="Account Holder" value={currentBank.accountHolder} />
                <BankRow
                  label="Account Number"
                  value={currentBank.accountNumber}
                  monospace
                  onCopy={() => copyText(currentBank.accountNumber, 'acc')}
                  copied={copiedAccount}
                />
                <BankRow
                  label="IFSC Code"
                  value={currentBank.ifscCode}
                  monospace
                  valueClass="text-purple-700"
                  onCopy={() => copyText(currentBank.ifscCode, 'ifsc')}
                  copied={copiedIfsc}
                />
                {currentBank.branch && (
                  <BankRow label="Branch" value={currentBank.branch} />
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-800">
              <span className="text-amber-500 font-bold text-base leading-none shrink-0">&#8505;</span>
              <p>After transferring, copy the 12-digit UTR/Reference number from your bank receipt and enter it below.</p>
            </div>
          </div>
        )}

        {/* ── Authentic 12-Digit UPI UTR Input Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3.5">
          {/* Card Header & Validation Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/80 text-[#FF4A00] flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-800 block">
                  12-Digit UPI UTR / Ref No
                </label>
                <p className="text-[10px] text-slate-400 font-medium">
                  Unique Transaction Reference from UPI receipt
                </p>
              </div>
            </div>

            {/* Real-time Status Badge */}
            {isUtrComplete ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>12 Digits Verified</span>
              </span>
            ) : cleanUtrDigits.length > 0 ? (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <span>{cleanUtrDigits.length} / 12 Digits</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                12 Digits Required
              </span>
            )}
          </div>

          {/* Formatted Input Field */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 transition">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formatUtrDisplay(cleanUtrDigits)}
              onChange={handleUtrInputChange}
              placeholder="e.g. 4301 2849 1823"
              maxLength={14}
              className="w-full bg-transparent py-2.5 px-3 text-base sm:text-lg font-mono font-black tracking-widest text-slate-950 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none"
            />
            
            <div className="flex items-center gap-1 pr-1.5 shrink-0">
              {cleanUtrDigits.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearUtr}
                  className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title="Clear UTR"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePasteUtr}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 transition active:scale-95 cursor-pointer"
                title="Paste 12-digit UTR from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            </div>
          </div>

          {/* 12-Segment Micro Progress Indicator */}
          <div className="space-y-1">
            <div className="grid grid-cols-12 gap-1 px-1">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    idx < cleanUtrDigits.length
                      ? isUtrComplete
                        ? 'bg-emerald-500 shadow-xs'
                        : 'bg-blue-600'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 pt-0.5">
              <span>Standard UPI Format: 12 Numeric Digits</span>
              <span className={isUtrComplete ? 'text-emerald-600 font-bold' : ''}>
                {isUtrComplete ? '✓ Ready to Submit' : `${12 - cleanUtrDigits.length} digits remaining`}
              </span>
            </div>
          </div>

          {/* Authentic Bank App Guide (Where to find UTR) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60 space-y-2">
              <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Where to find the 12-digit UTR on your receipt:</span>
              </p>
              
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <p className="font-extrabold text-indigo-600">PhonePe</p>
                  <p className="text-slate-500 mt-0.5">Look for <strong className="text-slate-800">UTR:</strong></p>
                  <span className="font-mono text-[9px] text-slate-600 block bg-slate-50 rounded px-1 mt-0.5">12 Digits</span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <p className="font-extrabold text-blue-600">Google Pay</p>
                  <p className="text-slate-500 mt-0.5"><strong className="text-slate-800">UPI txn ID</strong></p>
                  <span className="font-mono text-[9px] text-slate-600 block bg-slate-50 rounded px-1 mt-0.5">12 Digits</span>
                </div>

                <div className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <p className="font-extrabold text-sky-600">Paytm / BHIM</p>
                  <p className="text-slate-500 mt-0.5"><strong className="text-slate-800">UPI Ref / RRN</strong></p>
                  <span className="font-mono text-[9px] text-slate-600 block bg-slate-50 rounded px-1 mt-0.5">12 Digits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Success Banner ── */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
      </div>

      {/* ── Sticky Footer ── */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-[2] py-3.5 rounded-xl font-extrabold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer ${
            isUtrComplete
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-400/25'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
          }`}
        >
          <span>{isUtrComplete ? 'Confirm Payment & Submit UTR' : `Enter 12-Digit UTR (${cleanUtrDigits.length}/12)`}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ── Helper: bank detail row ── */
interface BankRowProps {
  label: string;
  value: string;
  monospace?: boolean;
  valueClass?: string;
  onCopy?: () => void;
  copied?: boolean;
}
const BankRow: React.FC<BankRowProps> = ({ label, value, monospace, valueClass, onCopy, copied }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-[11px] text-slate-500 shrink-0 mr-4">{label}</span>
    <div className="flex items-center gap-2 min-w-0">
      <span className={`text-sm font-bold truncate ${monospace ? 'font-mono' : ''} ${valueClass || 'text-slate-900'}`}>
        {value}
      </span>
      {onCopy && (
        <button
          onClick={onCopy}
          className={`shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition ${
            copied ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
  </div>
);
