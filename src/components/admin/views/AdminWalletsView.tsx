import React, { useState } from 'react';
import { Wallet, Plus, Minus, Search, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../../../types';

interface AdminWalletsViewProps {
  currentBalance: number;
  onAdjustBalance: (amount: number, reason: string) => void;
  transactions: Transaction[];
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminWalletsView: React.FC<AdminWalletsViewProps> = ({
  currentBalance,
  onAdjustBalance,
  transactions,
  showToast,
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('');
  const [searchTxn, setSearchTxn] = useState('');

  const handleQuickAdjust = (amount: number, note: string) => {
    onAdjustBalance(amount, note);
  };

  const handleCustomSubmit = (isCredit: boolean) => {
    const val = Number(customAmount);
    if (!val || val <= 0) {
      showToast('Please enter a valid amount greater than 0', 'error');
      return;
    }
    const finalAmt = isCredit ? val : -val;
    const finalReason = reason.trim() || (isCredit ? 'Manual Admin Credit' : 'Manual Admin Debit');
    onAdjustBalance(finalAmt, finalReason);
    setCustomAmount('');
    setReason('');
  };

  const filteredTxns = transactions.filter(t => {
    if (!searchTxn) return true;
    const q = searchTxn.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Wallets & Balances Ledger
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Execute direct credits and debits to user accounts with instant transaction auditing.
        </p>
      </div>

      {/* Balance Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B1536] text-white rounded-2xl p-5 border border-[#1e293b] shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Active Pool Balance</span>
            <Wallet className="w-5 h-5 text-[#70c028]" />
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-white">
            ₹ {currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-400 block font-medium">
            Live Master Account Balance
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Audited Transactions</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-slate-900">
            {transactions.length}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Historical System Ledger Records
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total System Withdrawn</span>
            <ArrowUpRight className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-slate-900">
            ₹ 2,21,99,913.94
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Verified External Bank Disbursals
          </span>
        </div>
      </div>

      {/* Direct Adjustment Tool */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Wallet className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-base text-slate-900 font-['Space_Grotesk']">
            Direct Wallet Adjustment
          </h3>
        </div>

        {/* 1-Click Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-2">1-Click Quick Credits</label>
          <div className="flex flex-wrap gap-2">
            {[500, 2100, 5000, 10000].map(amt => (
              <button
                key={amt}
                onClick={() => handleQuickAdjust(amt, `Admin Quick Credit +₹${amt}`)}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
              >
                +₹{amt.toLocaleString()} Credit
              </button>
            ))}
            <button
              onClick={() => handleQuickAdjust(-1000, 'Admin -₹1,000 Debit')}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
            >
              -₹1,000 Debit
            </button>
          </div>
        </div>

        {/* Custom Input */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="number"
            placeholder="Custom amount (₹)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full sm:w-60 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
          />
          <input
            type="text"
            placeholder="Reason or audit note (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#70c028]"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCustomSubmit(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              + Add Credit
            </button>
            <button
              onClick={() => handleCustomSubmit(false)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
            >
              - Debit
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900 font-['Space_Grotesk']">
            Wallet Transaction Ledger
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ledger..."
              value={searchTxn}
              onChange={(e) => setSearchTxn(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#70c028]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No transactions matching search.
                  </td>
                </tr>
              ) : (
                filteredTxns.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800">{t.description}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{t.formattedTime || t.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      <span className={t.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {t.amount >= 0 ? '+' : ''}₹{t.amount.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
