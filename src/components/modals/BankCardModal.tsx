import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const BankCardModal: React.FC = () => {
  const { showBankCardModal, setShowBankCardModal, user, updateBankAccount } = useApp();

  const [holder, setHolder] = useState<string>(user.bankAccount.accountHolder || '');
  const [bank, setBank] = useState<string>(user.bankAccount.bankName || '');
  const [accNum, setAccNum] = useState<string>(user.bankAccount.accountNumber || '');
  const [ifsc, setIfsc] = useState<string>(user.bankAccount.ifscCode || '');
  const [upi, setUpi] = useState<string>(user.bankAccount.upiId || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!showBankCardModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holder || !bank || !accNum || !ifsc) {
      alert('Please fill in all mandatory banking fields.');
      return;
    }

    updateBankAccount({
      accountHolder: holder,
      bankName: bank,
      accountNumber: accNum,
      ifscCode: ifsc.toUpperCase(),
      upiId: upi,
      isBound: true,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowBankCardModal(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Bank Account Binding</h3>
              <p className="text-[10px] text-slate-500 font-medium">Secure Direct Settlement</p>
            </div>
          </div>
          <button
            onClick={() => setShowBankCardModal(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security badge */}
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Encrypted 256-bit automated payout routing</span>
        </div>

        {/* Form in Clean Slate Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              Account Holder Name *
            </label>
            <input
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="Full name as in bank passbook"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              Bank Name *
            </label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              placeholder="e.g. HDFC Bank, SBI, ICICI"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              Bank Account Number *
            </label>
            <input
              type="text"
              value={accNum}
              onChange={(e) => setAccNum(e.target.value)}
              placeholder="Enter full account number"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              IFSC Code *
            </label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono uppercase focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              required
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              UPI VPA ID (Optional)
            </label>
            <input
              type="text"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="e.g. name@okhdfcbank"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bank card linked and verified successfully!</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Save Bank Card Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
