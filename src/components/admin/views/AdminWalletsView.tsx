import React, { useState, useMemo } from 'react';
import { Wallet, Search, Download, Plus, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../../../types';

export interface WalletRecordItem {
  id: string;
  serialNo: number;
  date: string;
  userName: string;
  userId: string;
  type: 'Credit' | 'Debit';
  amount: number;
  balanceAfter: number;
  description: string;
  source: 'Level Income' | 'Daily ROI' | 'Recharge' | 'Withdrawal' | 'Admin Bonus';
}

export const INITIAL_WALLET_RECORDS: WalletRecordItem[] = [
  {
    id: 'wr-1',
    serialNo: 1,
    date: '18/10/2026',
    userName: 'IPPLI USHA RANI',
    userId: 'FC2181901',
    type: 'Credit',
    amount: 0.27,
    balanceAfter: 45906.81,
    description: 'Level 8 income credited',
    source: 'Level Income',
  },
  {
    id: 'wr-2',
    serialNo: 2,
    date: '18/10/2026',
    userName: 'Vadarevu Sujatha',
    userId: 'FC3039084',
    type: 'Credit',
    amount: 0.27,
    balanceAfter: 30342.17,
    description: 'Level 7 income credited',
    source: 'Level Income',
  },
  {
    id: 'wr-3',
    serialNo: 3,
    date: '18/10/2026',
    userName: 'GUDLA NARESH',
    userId: 'FC3434967',
    type: 'Credit',
    amount: 0.27,
    balanceAfter: 30041.59,
    description: 'Level 6 income credited',
    source: 'Level Income',
  },
  {
    id: 'wr-4',
    serialNo: 4,
    date: '18/10/2026',
    userName: 'VADDI KAVYA',
    userId: 'FC3723445',
    type: 'Credit',
    amount: 0.53,
    balanceAfter: 21439.95,
    description: 'Level 5 income credited',
    source: 'Level Income',
  },
  {
    id: 'wr-5',
    serialNo: 5,
    date: '18/10/2026',
    userName: 'MEESALA RAMU',
    userId: 'FC7638923',
    type: 'Credit',
    amount: 130.00,
    balanceAfter: 5146.67,
    description: 'Daily Node ROI credited',
    source: 'Daily ROI',
  },
  {
    id: 'wr-6',
    serialNo: 6,
    date: '17/10/2026',
    userName: 'User5294',
    userId: 'FC5294001',
    type: 'Credit',
    amount: 520.00,
    balanceAfter: 12450.00,
    description: 'Top-up Verification Approved',
    source: 'Recharge',
  }
];

interface AdminWalletsViewProps {
  currentBalance: number;
  onAdjustBalance: (amount: number, reason: string) => void;
  onOpenAddMoneyModal: () => void;
  onExportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminWalletsView: React.FC<AdminWalletsViewProps> = ({
  currentBalance,
  onAdjustBalance,
  onOpenAddMoneyModal,
  onExportCSV,
  showToast,
}) => {
  const [records, setRecords] = useState<WalletRecordItem[]>(INITIAL_WALLET_RECORDS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !rec.userId.toLowerCase().includes(q) &&
          !rec.userName.toLowerCase().includes(q) &&
          !rec.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (typeFilter && rec.type !== typeFilter) return false;
      if (sourceFilter && rec.source !== sourceFilter) return false;
      return true;
    });
  }, [records, search, typeFilter, sourceFilter]);

  const handleExport = () => {
    const headers = ['#', 'Date', 'User', 'User ID', 'Type', 'Amount', 'Balance After', 'Description', 'Source'];
    const rows = filteredRecords.map(r => [
      r.serialNo,
      r.date,
      r.userName,
      r.userId,
      r.type,
      r.amount,
      r.balanceAfter,
      r.description,
      r.source
    ]);
    onExportCSV('FanCode_Wallet_Transactions', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
          Wallet Management
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View all wallet transactions and add money to user wallets.
        </p>
      </div>

      {/* 3 Metric Cards at Top (matching Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Transactions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">
            Total Transactions
          </span>
          <div className="text-3xl font-black font-sans text-[#0B1536]">
            10000
          </div>
        </div>

        {/* Card 2: Total Credited */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">
            Total Credited
          </span>
          <div className="text-3xl font-black font-sans text-[#16a34a]">
            ₹ 12,90,269.64
          </div>
        </div>

        {/* Card 3: Total Debited */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-semibold text-slate-500 block">
            Total Debited
          </span>
          <div className="text-3xl font-black font-sans text-[#e11d48]">
            ₹ 0
          </div>
        </div>
      </div>

      {/* Filter Row + Action Buttons (matching Screenshot 4) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
          />
        </div>

        {/* Type & Source Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#FF4A00]"
          >
            <option value="">All Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#FF4A00]"
          >
            <option value="">All Sources</option>
            <option value="Level Income">Level Income</option>
            <option value="Daily ROI">Daily ROI</option>
            <option value="Recharge">Recharge</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Admin Bonus">Admin Bonus</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={onOpenAddMoneyModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF4A00] hover:bg-[#E04000] text-white text-xs font-extrabold transition shadow-md shadow-[#FF4A00]/25"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Add Money</span>
          </button>
        </div>
      </div>

      {/* The Table (matching Screenshot 4) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-sans text-slate-400 font-bold">
                      {item.serialNo}
                    </td>
                    <td className="px-4 py-3.5 font-sans font-medium text-slate-500 text-[11px]">
                      {item.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-slate-900 block font-sans">
                        {item.userName}
                      </span>
                      <span className="text-[10px] font-sans text-slate-400">
                        {item.userId}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.type === 'Credit'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-sans font-extrabold tracking-tight">
                      <span className={item.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}>
                        {item.type === 'Credit' ? '+' : '-'} ₹ {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-sans font-bold text-slate-900 tracking-tight">
                      ₹ {item.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {item.description}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {item.source}
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
