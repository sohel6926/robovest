import React, { useState } from 'react';
import { Filter, Download, ArrowDownToLine, Check, X, Eye, Image as ImageIcon, QrCode } from 'lucide-react';
import { Transaction } from '../../../types';

interface AdminTopupsViewProps {
  pendingTransactions?: Transaction[];
  onApproveRecharge?: (txnId: string) => void;
  onRejectRecharge?: (txnId: string, reason: string) => void;
  onExportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onNavigate?: (tab: string) => void;
}

export const AdminTopupsView: React.FC<AdminTopupsViewProps> = ({
  pendingTransactions = [],
  onApproveRecharge,
  onRejectRecharge,
  onExportCSV,
  showToast,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Live top-up items
  const recharges = pendingTransactions.filter(t => t.type === 'RECHARGE');

  const filteredRecharges = recharges.filter(t => {
    if (activeFilter === 'PENDING') return t.status === 'PENDING';
    if (activeFilter === 'APPROVED') return t.status === 'COMPLETED';
    if (activeFilter === 'REJECTED') return t.status === 'REJECTED';
    return true;
  });

  const handleExport = () => {
    const headers = ['Txn ID', 'Type', 'Amount', 'Status', 'Date', 'Description', 'UTR Reference'];
    const rows = filteredRecharges.map(t => [
      t.id,
      t.type,
      t.amount,
      t.status,
      t.formattedTime || t.timestamp,
      t.description,
      t.proofReference || t.paymentReference || ''
    ]);
    onExportCSV(`FanCode_Topups_${activeFilter}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
              Top-up Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Approve or reject user reinvestment requests.
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('rechargeGateway')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Configure Recharge Details (UPI & QR)</span>
            </button>
          )}
        </div>

        {/* Filter Pills + Export Button (matching Screenshot 2) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setActiveFilter('PENDING')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeFilter === 'PENDING'
                  ? 'bg-[#70c028] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter('APPROVED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeFilter === 'APPROVED'
                  ? 'bg-[#70c028] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveFilter('REJECTED')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeFilter === 'REJECTED'
                  ? 'bg-[#70c028] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                activeFilter === 'ALL'
                  ? 'bg-[#70c028] text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 text-xs font-extrabold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredRecharges.length === 0 ? (
        /* Empty State (exact replica of Screenshot 2) */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 sm:p-24 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-slate-500 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-['Space_Grotesk']">
            No Requests Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Try changing the filter or wait for new requests.
          </p>
        </div>
      ) : (
        /* Recharges List */
        <div className="space-y-3">
          {filteredRecharges.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      t.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{t.description}</p>
                  <p className="text-[11px] font-mono text-slate-400">{t.formattedTime || t.timestamp}</p>
                  {(t.proofReference || t.paymentReference) && (
                    <p className="text-xs font-mono font-bold text-[#70c028]">
                      UTR: {t.proofReference || t.paymentReference}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Amount</span>
                  <span className="text-lg font-bold text-emerald-600">₹{t.amount.toLocaleString()}</span>
                </div>

                {t.proofImage && (
                  <button
                    onClick={() => setPreviewImage(t.proofImage || null)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="View Receipt Screenshot"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                )}

                {t.status === 'PENDING' && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onRejectRecharge && onRejectRecharge(t.id, 'Invalid UTR reference')}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApproveRecharge && onApproveRecharge(t.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={previewImage} alt="Payment Proof" className="w-full h-auto rounded-xl object-contain max-h-[80vh]" />
          </div>
        </div>
      )}
    </div>
  );
};
