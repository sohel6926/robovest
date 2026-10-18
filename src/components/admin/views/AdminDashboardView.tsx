import React from 'react';
import { 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpToLine, 
  ShieldCheck, 
  TrendingUp, 
  Play, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle2, 
  Activity,
  PhoneCall,
  UserCheck,
  Award,
  CreditCard
} from 'lucide-react';

export interface CadreClaimItem {
  id: string;
  name: string;
  role: string;
  gift: string;
  amount: number;
  isCredited: boolean;
}

interface AdminDashboardViewProps {
  onTriggerDailyROI: () => void;
  onNavigate: (tab: string) => void;
  onOpenAddBalanceModal: () => void;
  pendingWithdrawalsCount: number;
  pendingTopupsCount: number;
  cadreClaims: CadreClaimItem[];
  onCreditCadreReward: (claimId: string) => void;
  totalUsersCount?: number;
  totalWalletBalance?: number;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onTriggerDailyROI,
  onNavigate,
  onOpenAddBalanceModal,
  pendingWithdrawalsCount,
  pendingTopupsCount,
  cadreClaims,
  onCreditCadreReward,
  totalUsersCount = 693,
  totalWalletBalance = 4897392.55,
}) => {
  const pendingCadresCount = cadreClaims.filter(c => !c.isCredited).length;

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of all platform activity and key metrics.
          </p>
        </div>

        <button
          onClick={onTriggerDailyROI}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1536] hover:bg-[#16224f] text-white text-sm font-bold shadow-md shadow-[#0B1536]/20 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Trigger Daily ROI</span>
        </button>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Users</span>
            <div className="text-3xl font-black text-[#0B1536] font-['Space_Grotesk'] tracking-tight mt-1">
              {totalUsersCount.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">1 registered today</span>
          </div>
        </div>

        {/* 2. Total Wallet Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Wallet Balance</span>
            <div className="text-2xl font-black text-[#0B1536] font-['Space_Grotesk'] tracking-tight mt-1">
              ₹ {totalWalletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Across all users</span>
          </div>
        </div>

        {/* 3. Pending Withdrawals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ArrowUpToLine className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending Withdrawals</span>
            <div className={`text-3xl font-black font-['Space_Grotesk'] tracking-tight mt-1 ${pendingWithdrawalsCount > 0 ? 'text-rose-600 animate-pulse' : 'text-[#0B1536]'}`}>
              {pendingWithdrawalsCount}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">₹ 2,21,99,913.94 total withdrawn</span>
          </div>
        </div>

        {/* 4. Pending Top-ups */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending Top-ups</span>
            <div className={`text-3xl font-black font-['Space_Grotesk'] tracking-tight mt-1 ${pendingTopupsCount > 0 ? 'text-amber-600 animate-pulse' : 'text-[#0B1536]'}`}>
              {pendingTopupsCount}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Reinvestment requests</span>
          </div>
        </div>
      </div>

      {/* Row 2 of Metric Cards: Pending KYC & Pending Cadres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 5. Pending KYC */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending KYC</span>
            <div className="text-3xl font-black text-[#0B1536] font-['Space_Grotesk'] tracking-tight mt-1">
              0
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">0 new today</span>
          </div>
        </div>

        {/* 6. Pending Cadres */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Pending Cadres</span>
            <div className={`text-3xl font-black font-['Space_Grotesk'] tracking-tight mt-1 ${pendingCadresCount > 0 ? 'text-purple-600' : 'text-[#0B1536]'}`}>
              {pendingCadresCount}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">Bonus/Gift claims</span>
          </div>
        </div>
      </div>

      {/* ================= SECTION: PENDING ACTIONS ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
            Pending Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Pending Withdrawals */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <ArrowUpToLine className="w-4 h-4 text-amber-500" />
                <span>Pending Withdrawals</span>
              </div>
              <button
                onClick={() => onNavigate('withdrawals')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              {pendingWithdrawalsCount === 0 ? (
                <>
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    No pending withdrawals 🚀
                  </span>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                    {pendingWithdrawalsCount} withdrawal requests await approval
                  </span>
                  <div>
                    <button
                      onClick={() => onNavigate('withdrawals')}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Process Queue Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: New Plan Interests */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-purple-500" />
                <span>New Plan Interests</span>
              </div>
              <button
                onClick={() => onNavigate('plans')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                No new callback requests 🚀
              </span>
            </div>
          </div>

          {/* Card 3: Pending Top-ups */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <ArrowDownToLine className="w-4 h-4 text-emerald-500" />
                <span>Pending Top-ups</span>
              </div>
              <button
                onClick={() => onNavigate('recharges')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              {pendingTopupsCount === 0 ? (
                <>
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    No pending top-ups 🚀
                  </span>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                    {pendingTopupsCount} top-ups require payment verification
                  </span>
                  <div>
                    <button
                      onClick={() => onNavigate('recharges')}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                    >
                      Verify Payments
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Pending Cadre Rewards */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span>Pending Cadre Rewards</span>
              </div>
              <button
                onClick={() => onNavigate('cadres')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>View All</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {cadreClaims.map((claim) => (
                <div key={claim.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block font-['Space_Grotesk']">
                      {claim.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      {claim.role} <span className="text-purple-600 font-bold">• {claim.gift}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 block text-xs">
                      ₹ {claim.amount.toLocaleString()}
                    </span>
                    {claim.isCredited ? (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        Credited ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => onCreditCadreReward(claim.id)}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 justify-end"
                      >
                        <span>Credit Wallet</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION: QUICK ACTIONS ================= */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-['Space_Grotesk']">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tile 1: Manage Users */}
          <button
            onClick={() => onNavigate('users')}
            className="text-left bg-[#182a4d] hover:bg-[#203660] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <Users className="w-5 h-5 text-blue-200" />
            <div>
              <span className="font-bold text-sm block">Manage Users</span>
              <span className="text-xs text-slate-300 block mt-0.5">View, edit, and activate accounts</span>
            </div>
          </button>

          {/* Tile 2: KYC Management */}
          <button
            onClick={() => onNavigate('kyc')}
            className="text-left bg-[#4338ca] hover:bg-[#4f46e5] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <ShieldCheck className="w-5 h-5 text-indigo-200" />
            <div>
              <span className="font-bold text-sm block">KYC Management</span>
              <span className="text-xs text-indigo-200 block mt-0.5">0 pending requests</span>
            </div>
          </button>

          {/* Tile 3: Top-up Requests */}
          <button
            onClick={() => onNavigate('recharges')}
            className="text-left bg-[#1e293b] hover:bg-[#334155] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <ArrowDownToLine className="w-5 h-5 text-slate-300" />
            <div>
              <span className="font-bold text-sm block">Top-up Requests</span>
              <span className="text-xs text-slate-300 block mt-0.5">
                {pendingTopupsCount} pending requests
              </span>
            </div>
          </button>

          {/* Tile 4: Add Wallet Balance */}
          <button
            onClick={onOpenAddBalanceModal}
            className="text-left bg-[#65a30d] hover:bg-[#84cc16] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <Wallet className="w-5 h-5 text-emerald-100" />
            <div>
              <span className="font-bold text-sm block">Add Wallet Balance</span>
              <span className="text-xs text-emerald-100 block mt-0.5">Credit money to a users wallet</span>
            </div>
          </button>

          {/* Tile 5: Plan Interests */}
          <button
            onClick={() => onNavigate('plans')}
            className="text-left bg-[#7c3aed] hover:bg-[#8b5cf6] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <TrendingUp className="w-5 h-5 text-purple-200" />
            <div>
              <span className="font-bold text-sm block">Plan Interests</span>
              <span className="text-xs text-purple-200 block mt-0.5">0 pending callback requests</span>
            </div>
          </button>

          {/* Tile 6: Cadre Management */}
          <button
            onClick={() => onNavigate('cadres')}
            className="text-left bg-[#4f46e5] hover:bg-[#6366f1] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <Award className="w-5 h-5 text-blue-200" />
            <div>
              <span className="font-bold text-sm block">Cadre Management</span>
              <span className="text-xs text-blue-200 block mt-0.5">{pendingCadresCount} pending rewards</span>
            </div>
          </button>

          {/* Tile 7: Review Withdrawals */}
          <button
            onClick={() => onNavigate('withdrawals')}
            className="text-left bg-[#d97706] hover:bg-[#b45309] text-white p-5 rounded-2xl shadow-sm transition-all duration-200 active:scale-98 flex flex-col justify-between min-h-[110px]"
          >
            <ArrowUpToLine className="w-5 h-5 text-amber-100" />
            <div>
              <span className="font-bold text-sm block">Review Withdrawals</span>
              <span className="text-xs text-amber-100 block mt-0.5">
                {pendingWithdrawalsCount} pending requests
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ================= SECTION: PLATFORM SUMMARY BANNER ================= */}
      <div className="bg-[#0B1536] rounded-2xl p-6 text-white border border-[#1e293b] shadow-lg">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="font-bold text-sm tracking-wide text-white">
            Platform Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Total Invested
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-white mt-1">
              ₹ 7,42,00,000
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Total Withdrawn
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-white mt-1">
              ₹ 2,21,99,913.94
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Active Users
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-emerald-400 mt-1">
              557
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Inactive Users
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-slate-300 mt-1">
              136
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
