import React, { useState, useMemo } from 'react';
import { 
  ArrowUpToLine, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Check, 
  X,
  CreditCard,
  Building,
  User,
  Search
} from 'lucide-react';
import { Transaction } from '../../../types';

export interface WithdrawalRequestItem {
  id: string;
  serialNo: number;
  userName: string;
  userId: string;
  requestedDate: string;
  amount: number;
  tdsPercent: number;
  tdsAmount: number;
  netAmount: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
  utrReference?: string;
  rejectReason?: string;
}

// Initial withdrawal items from Bee Grow live console (Screenshot 1)
export const INITIAL_WITHDRAWAL_ITEMS: WithdrawalRequestItem[] = [
  {
    id: 'w-1',
    serialNo: 1,
    userName: 'S Viswananda Chowdary',
    userId: 'B9271551',
    requestedDate: '12 Oct 2026',
    amount: 560,
    tdsPercent: 5,
    tdsAmount: 28,
    netAmount: 532,
    bankName: 'State Bank of india',
    accountNumber: '31877094491',
    ifscCode: 'SBIN0000919',
    accountHolder: 'S viswananda chowdary',
    status: 'PROCESSED',
    utrReference: 'UTR2026101201948',
  },
  {
    id: 'w-2',
    serialNo: 2,
    userName: 'KALISETTTI VENKATA RAMANA',
    userId: 'B2447574',
    requestedDate: '12 Oct 2026',
    amount: 10000,
    tdsPercent: 5,
    tdsAmount: 500,
    netAmount: 9500,
    bankName: 'Sbi',
    accountNumber: '33997522575',
    ifscCode: 'SBIN0004827',
    accountHolder: 'KALISETTTI VENKATA RAMANA',
    status: 'PROCESSED',
    utrReference: 'UTR2026101208819',
  },
  {
    id: 'w-3',
    serialNo: 3,
    userName: 'MEESALA RAMU',
    userId: 'B7638923',
    requestedDate: '14 Oct 2026',
    amount: 2500,
    tdsPercent: 5,
    tdsAmount: 125,
    netAmount: 2375,
    bankName: 'Union Bank of India',
    accountNumber: '09811010004921',
    ifscCode: 'UBIN0530981',
    accountHolder: 'MEESALA RAMU',
    status: 'PROCESSED',
    utrReference: 'UTR2026101404112',
  },
  {
    id: 'w-4',
    serialNo: 4,
    userName: 'YEDDU NAGABHUSHANA RAO',
    userId: 'B1402520',
    requestedDate: '15 Oct 2026',
    amount: 1200,
    tdsPercent: 5,
    tdsAmount: 60,
    netAmount: 1140,
    bankName: 'Punjab National Bank',
    accountNumber: '4421000100234190',
    ifscCode: 'PUNB0442100',
    accountHolder: 'YEDDU NAGABHUSHANA RAO',
    status: 'PROCESSED',
    utrReference: 'UTR2026101509121',
  },
  {
    id: 'w-5',
    serialNo: 5,
    userName: 'Varshitha varma',
    userId: 'B4553454',
    requestedDate: '16 Oct 2026',
    amount: 800,
    tdsPercent: 5,
    tdsAmount: 40,
    netAmount: 760,
    bankName: 'HDFC Bank',
    accountNumber: '50100349182910',
    ifscCode: 'HDFC0001290',
    accountHolder: 'Varshitha varma',
    status: 'REJECTED',
    rejectReason: 'IFSC code and Account Holder name mismatched',
  }
];

interface AdminWithdrawalsViewProps {
  onApproveLiveWithdrawal?: (id: string, utr: string) => void;
  onRejectLiveWithdrawal?: (id: string, reason: string) => void;
  pendingTransactions?: Transaction[];
  onExportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminWithdrawalsView: React.FC<AdminWithdrawalsViewProps> = ({
  onApproveLiveWithdrawal,
  onRejectLiveWithdrawal,
  pendingTransactions = [],
  onExportCSV,
  showToast,
}) => {
  const [items, setItems] = useState<WithdrawalRequestItem[]>(() => {
    // Merge any live pending withdrawal transactions from FanCode
    const livePendingItems: WithdrawalRequestItem[] = pendingTransactions
      .filter(t => t.type === 'WITHDRAWAL' && (t.status === 'PROCESSING' || t.status === 'PENDING'))
      .map((t, idx) => ({
        id: t.id,
        serialNo: 0,
        userName: t.bankDetails?.accountHolder || 'User Account',
        userId: 'B5294001',
        requestedDate: t.formattedTime || t.timestamp,
        amount: Math.abs(t.amount),
        tdsPercent: 5,
        tdsAmount: Math.round(Math.abs(t.amount) * 0.05),
        netAmount: Math.round(Math.abs(t.amount) * 0.95),
        bankName: t.bankDetails?.bankName || 'State Bank of India',
        accountNumber: t.bankDetails?.accountNumber || '31877094491',
        ifscCode: t.bankDetails?.ifscCode || 'SBIN0000919',
        accountHolder: t.bankDetails?.accountHolder || 'Master Account Holder',
        status: 'PENDING',
      }));

    return [...livePendingItems, ...INITIAL_WITHDRAWAL_ITEMS].map((item, idx) => ({
      ...item,
      serialNo: idx + 1,
    }));
  });

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'REJECTED' | 'PROCESSED'>('ALL');
  const [search, setSearch] = useState('');

  // Modals for Action
  const [approveModalItem, setApproveModalItem] = useState<WithdrawalRequestItem | null>(null);
  const [utrInput, setUtrInput] = useState('');
  const [rejectModalItem, setRejectModalItem] = useState<WithdrawalRequestItem | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('');

  // Counts
  const pendingCount = items.filter(i => i.status === 'PENDING').length;
  const processedCount = 1893 + items.filter(i => i.status === 'PROCESSED' && i.id.startsWith('live-')).length;
  const rejectedCount = 4 + items.filter(i => i.status === 'REJECTED' && i.id.startsWith('live-')).length;
  const pendingTotal = items.filter(i => i.status === 'PENDING').reduce((s, i) => s + i.amount, 0);

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeFilter === 'PENDING' && item.status !== 'PENDING') return false;
      if (activeFilter === 'PROCESSED' && item.status !== 'PROCESSED') return false;
      if (activeFilter === 'REJECTED' && item.status !== 'REJECTED') return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          item.userName.toLowerCase().includes(q) ||
          item.userId.toLowerCase().includes(q) ||
          item.accountNumber.includes(q) ||
          item.bankName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, activeFilter, search]);

  const handleApproveConfirm = () => {
    if (!approveModalItem) return;
    const finalUtr = utrInput.trim() || `UTR${Date.now().toString().slice(-8)}`;

    setItems(prev => prev.map(it => {
      if (it.id === approveModalItem.id) {
        return { ...it, status: 'PROCESSED', utrReference: finalUtr };
      }
      return it;
    }));

    if (onApproveLiveWithdrawal) {
      onApproveLiveWithdrawal(approveModalItem.id, finalUtr);
    }

    showToast(`Withdrawal of ₹${approveModalItem.amount.toLocaleString()} approved! UTR: ${finalUtr}`);
    setApproveModalItem(null);
    setUtrInput('');
  };

  const handleRejectConfirm = () => {
    if (!rejectModalItem) return;
    const finalReason = rejectReasonInput.trim() || 'Bank verification failed';

    setItems(prev => prev.map(it => {
      if (it.id === rejectModalItem.id) {
        return { ...it, status: 'REJECTED', rejectReason: finalReason };
      }
      return it;
    }));

    if (onRejectLiveWithdrawal) {
      onRejectLiveWithdrawal(rejectModalItem.id, finalReason);
    }

    showToast(`Withdrawal rejected: ${finalReason}`);
    setRejectModalItem(null);
    setRejectReasonInput('');
  };

  const handleExport = () => {
    const headers = ['#', 'User Name', 'User ID', 'Requested Date', 'Amount', 'TDS (5%)', 'Net Amount', 'Bank Name', 'A/C Number', 'IFSC', 'Status', 'UTR / Reason'];
    const rows = filteredItems.map(it => [
      it.serialNo,
      it.userName,
      it.userId,
      it.requestedDate,
      it.amount,
      it.tdsAmount,
      it.netAmount,
      it.bankName,
      it.accountNumber,
      it.ifscCode,
      it.status,
      it.utrReference || it.rejectReason || ''
    ]);
    onExportCSV(`FanCode_Withdrawals_${activeFilter}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Withdrawal Requests
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Review, approve, or reject user withdrawal requests.
        </p>
      </div>

      {/* 3 Metric Cards at Top (matching Screenshot 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Pending (Amber) */}
        <div className="bg-[#FFFDF5] rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Pending</span>
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-[#0B1536]">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            ₹ {pendingTotal.toLocaleString()} total
          </span>
        </div>

        {/* 2. Processed (Green) */}
        <div className="bg-[#F6FDF9] rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Processed</span>
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-[#0B1536]">
            {processedCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Disbursed to bank accounts
          </span>
        </div>

        {/* 3. Rejected (Red/Pink) */}
        <div className="bg-[#FFF8F8] rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>Rejected</span>
          </div>
          <div className="text-3xl font-black font-['Space_Grotesk'] text-[#0B1536]">
            {rejectedCount}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">
            Mismatches or invalid details
          </span>
        </div>
      </div>

      {/* Filter Row + Download Excel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              activeFilter === 'ALL'
                ? 'bg-[#70c028] text-slate-950 font-extrabold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              activeFilter === 'PENDING'
                ? 'bg-[#70c028] text-slate-950 font-extrabold'
                : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending {pendingCount > 0 && `(${pendingCount})`}
          </button>
          <button
            onClick={() => setActiveFilter('REJECTED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              activeFilter === 'REJECTED'
                ? 'bg-[#70c028] text-slate-950 font-extrabold'
                : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => setActiveFilter('PROCESSED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              activeFilter === 'PROCESSED'
                ? 'bg-[#70c028] text-slate-950 font-extrabold'
                : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
            }`}
          >
            Processed
          </button>
        </div>

        {/* Download Excel Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Excel</span>
        </button>
      </div>

      {/* Withdrawal Request Cards List (matching Screenshot 1) */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-medium">
            No withdrawal requests found for the selected filter.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-[#F8FAFC] hover:bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Download Tray Icon */}
                <div className="w-10 h-10 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowUpToLine className="w-5 h-5 text-slate-700" />
                </div>

                {/* Details */}
                <div className="space-y-1.5 flex-1">
                  {/* Row 1: ID, Name, User Code, Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold text-xs">
                      #{item.serialNo}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm font-['Space_Grotesk']">
                      {item.userName}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      {item.userId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'PROCESSED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {item.status === 'PROCESSED' ? 'Processed' : item.status === 'REJECTED' ? 'Rejected' : 'Pending Review'}
                    </span>
                  </div>

                  {/* Row 2: Requested on date */}
                  <div className="text-[11px] text-slate-500 font-medium">
                    Requested on {item.requestedDate}
                  </div>

                  {/* Row 3: Amount, TDS, Net */}
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-semibold pt-0.5">
                    <span className="text-slate-800">
                      Amount: <span className="font-bold">₹ {item.amount.toLocaleString()}</span>
                    </span>
                    <span className="text-amber-600">
                      TDS ({item.tdsPercent}%): - ₹ {item.tdsAmount.toLocaleString()}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      Net: ₹ {item.netAmount.toLocaleString()}
                    </span>
                  </div>

                  {/* Row 4: Bank Details */}
                  <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                    <span>Bank: <span className="text-slate-700 font-semibold">{item.bankName}</span></span>
                    <span>A/C: <span className="text-slate-700 font-semibold">{item.accountNumber}</span></span>
                    <span>IFSC: <span className="text-slate-700 font-semibold">{item.ifscCode}</span></span>
                    <span>Holder: <span className="text-slate-700 font-semibold">{item.accountHolder}</span></span>
                  </div>

                  {item.utrReference && (
                    <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                      Bank Reference / UTR: <span className="text-slate-700 font-bold">{item.utrReference}</span>
                    </div>
                  )}

                  {item.rejectReason && (
                    <div className="text-[11px] font-mono text-rose-600 pt-0.5">
                      Reason: <span className="font-bold">{item.rejectReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status or Action Buttons on Right */}
              <div className="self-end md:self-center shrink-0">
                {item.status === 'PROCESSED' ? (
                  <div className="px-4 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed</span>
                  </div>
                ) : item.status === 'REJECTED' ? (
                  <div className="px-4 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Rejected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRejectModalItem(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => setApproveModalItem(item)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL: APPROVE WITHDRAWAL ================= */}
      {approveModalItem && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1536] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-['Space_Grotesk']">
                Approve & Disburse Withdrawal
              </h3>
              <button
                onClick={() => setApproveModalItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-bold text-slate-900">{approveModalItem.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Net Disbursal:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹ {approveModalItem.netAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Account:</span>
                  <span className="font-bold text-slate-800">{approveModalItem.accountNumber} ({approveModalItem.ifscCode})</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bank Reference / UTR Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR2026101908291"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApproveModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApproveConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Disbursal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: REJECT WITHDRAWAL ================= */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-rose-950 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-base font-['Space_Grotesk']">
                Reject Withdrawal Request
              </h3>
              <button
                onClick={() => setRejectModalItem(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide details why this payout was rejected..."
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRejectConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
