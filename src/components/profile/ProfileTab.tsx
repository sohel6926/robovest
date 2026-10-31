import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Bot, 
  Crown, 
  FileText, 
  Headset, 
  Building2, 
  CreditCard, 
  UserCheck, 
  Receipt, 
  ArrowUpRight, 
  Bell, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';

interface ProfileTabProps {
  onNavigateToOrders: () => void;
  onNavigateToBank: () => void;
  onNavigateToContact: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ 
  onNavigateToOrders, 
  onNavigateToBank, 
  onNavigateToContact 
}) => {
  const { user, transactions, investments, setShowAuthModal, logoutUser, setActiveTab } = useApp();
  const [activeSubModal, setActiveSubModal] = useState<
    'personal' | 'balanceDetails' | 'withdrawalDetails' | 'notifications' | 'about' | null
  >(null);

  const activeInvestments = (investments || []).filter(inv => inv.status === 'ACTIVE');
  const totalDailyRoi = activeInvestments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);

  const withdrawalsList = transactions.filter(t => t.type === 'WITHDRAWAL');

  return (
    <div className="pb-24 max-w-md mx-auto space-y-4 px-4 pt-2 text-slate-900">
      {/* Header with Settings Icon */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-black text-slate-900 font-sans">Profile</h1>
        <button
          onClick={() => {
            if (user.isLoggedIn) {
              setActiveSubModal('personal');
            } else {
              setShowAuthModal(true);
            }
          }}
          className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* User Info Hero Card */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with FanCode Emblem */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] p-0.5 shadow-md shadow-orange-500/20 shrink-0 flex items-center justify-center">
            <span className="font-black italic text-white text-2xl tracking-tight">FC</span>
            {user.isLoggedIn && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center border-2 border-white">
                <Crown className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="space-y-1 min-w-0">
            {user.isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {user.email || user.id.slice(0, 10)}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider shrink-0">
                    <Crown className="w-3 h-3 fill-blue-700" />
                    VIP{user.vipLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                  <span>Code: {user.inviteCode || 'N/A'}</span>
                </div>
              </>
            ) : (
              <div>
                <span className="font-extrabold text-base text-slate-900 block">Guest Investor</span>
                <span className="text-xs text-slate-400">Sign in to sync wallet and yields</span>
              </div>
            )}
          </div>
        </div>

        {!user.isLoggedIn && (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 shadow-sm active:scale-95 transition"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Available Balance Box */}
      <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            AVAILABLE BALANCE
          </span>
          <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums font-sans mt-0.5">
            ₹{user.availableBalance.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total recharge</span>
            <span className="text-base font-bold text-slate-900 tabular-nums">
              ₹{user.totalRecharge.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Total income</span>
            <span className="text-base font-bold text-blue-600 tabular-nums">
              ₹{user.totalIncome.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Rounded Cards */}
      <div className="grid grid-cols-4 gap-2.5">
        {/* Orders / My Plans */}
        <button
          onClick={onNavigateToOrders}
          className="relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition group active:scale-95 shadow-sm"
        >
          <div className="relative w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
            {activeInvestments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {activeInvestments.length}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">My Plans</span>
        </button>

        {/* Contact */}
        <button
          onClick={onNavigateToContact}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition group active:scale-95 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Headset className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Contact</span>
        </button>

        {/* About */}
        <button
          onClick={() => setActiveSubModal('about')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition group active:scale-95 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">About</span>
        </button>

        {/* Bank Card */}
        <button
          onClick={onNavigateToBank}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition group active:scale-95 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Bank Card</span>
        </button>
      </div>

      {/* Active Plans & Contracts Section */}
      <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#FF4A00] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-orange-500" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                My Active Contracts ({activeInvestments.length})
              </h2>
              {activeInvestments.length > 0 && (
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Earning ₹{totalDailyRoi.toLocaleString()}/day automatically
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeInvestments.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2">
            <Bot className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500 font-medium">
              You don't have any active sports contracts deployed yet.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FF5E00] to-[#FF4500] text-white text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
            >
              Explore FanCode Plans →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeInvestments.slice(0, 4).map((inv) => {
              const totalDays = 150;
              const daysReceived = Math.min(totalDays, Math.max(1, inv.daysElapsed || 1));
              const daysPending = Math.max(0, totalDays - daysReceived);
              const progressPercent = Math.min(100, Math.round((daysReceived / totalDays) * 100));
              const roiEarned = daysReceived * inv.dailyIncome;
              const bonusEarned = Number(inv.bonusReceived || 0);
              const totalEarned = inv.totalEarned || (roiEarned + bonusEarned);

              return (
                <div
                  key={inv.id}
                  onClick={onNavigateToOrders}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-orange-50/40 border border-slate-200/90 hover:border-orange-300 transition-all cursor-pointer space-y-2.5 shadow-xs"
                >
                  {/* Top: Name, Units, Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                        {inv.productName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[9.5px] font-black uppercase">
                        {inv.quantity}x Units
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>

                  {/* Days Received & Days Pending Layout */}
                  <div className="bg-white/90 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      {/* Days Received Badge */}
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                        <span><strong>{daysReceived}</strong> Days Received</span>
                      </span>

                      {/* Days Pending Badge */}
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                        <span><strong>{daysPending}</strong> Days Pending</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-[#FF4A00] rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                        <span>Day {daysReceived} of {totalDays}</span>
                        <span>{progressPercent}% Completed</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Metrics: Daily ROI, Total Earned, Invested */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                    <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100/90">
                      <span className="text-slate-400 block text-[9.5px]">Daily ROI</span>
                      <span className="font-extrabold text-emerald-600 tabular-nums text-xs">
                        ₹{inv.dailyIncome.toLocaleString()}/day
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100/90">
                      <span className="text-slate-400 block text-[9.5px]">Total Earned</span>
                      <span className="font-extrabold text-blue-700 tabular-nums text-xs">
                        ₹{totalEarned.toLocaleString()}
                      </span>
                      {bonusEarned > 0 && (
                        <span className="text-[8.5px] text-blue-500 block leading-tight font-medium mt-0.5">
                          (₹{roiEarned} + ₹{bonusEarned} bonus)
                        </span>
                      )}
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                      <span className="text-slate-400 block text-[9.5px]">Invested</span>
                      <span className="font-extrabold text-slate-800 tabular-nums text-xs">
                        ₹{inv.totalInvested.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeInvestments.length > 4 && (
              <button
                onClick={onNavigateToOrders}
                className="w-full py-1.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                + {activeInvestments.length - 4} more contract(s) · View Details
              </button>
            )}
          </div>
        )}
      </div>

      {/* Account Section List Rows */}
      <div className="space-y-2 pt-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Account
        </h2>

        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
          {/* Personal Information */}
          <button
            onClick={() => setActiveSubModal('personal')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Personal Information</h3>
                <p className="text-[11px] text-slate-500">Name, password and security</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Balance Details */}
          <button
            onClick={() => setActiveSubModal('balanceDetails')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Balance Details</h3>
                <p className="text-[11px] text-slate-500">Every credit and debit</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Withdrawal Details */}
          <button
            onClick={() => setActiveSubModal('withdrawalDetails')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Withdrawal Details</h3>
                <p className="text-[11px] text-slate-500">Payout requests and status</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Notification Center */}
          <button
            onClick={() => setActiveSubModal('notifications')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Notification Center</h3>
                <p className="text-[11px] text-slate-500">Announcements and alerts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Account Authentication Action (Login or Logout) */}
          {user.isLoggedIn ? (
            <button
              onClick={() => logoutUser()}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/50 transition text-left text-rose-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-rose-600">Logout</h3>
                  <p className="text-[11px] text-rose-500">Sign out of this device</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-blue-50/50 transition text-left text-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LogOut className="w-5 h-5 rotate-180" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-blue-600">Sign In / Register</h3>
                  <p className="text-[11px] text-blue-500">Connect to your account & wallet</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* Sub-modals for details in Crisp White */}
      {activeSubModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {activeSubModal === 'personal' && 'Personal Information'}
                {activeSubModal === 'balanceDetails' && 'Balance Details / Ledger'}
                {activeSubModal === 'withdrawalDetails' && 'Withdrawal Records'}
                {activeSubModal === 'notifications' && 'Notification Center'}
                {activeSubModal === 'about' && 'About FanCode'}
              </h3>
              <button
                onClick={() => setActiveSubModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
              {activeSubModal === 'personal' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">User ID</span>
                    <span className="font-bold text-slate-900">{user.id}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">Phone Number</span>
                    <span className="font-bold text-slate-900">{user.phone}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-500 block">Security Status</span>
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> 2FA Verified & Encrypted
                    </span>
                  </div>
                </div>
              )}

              {activeSubModal === 'balanceDetails' && (
                <div className="space-y-2">
                  {transactions.map(t => (
                    <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-slate-900 block">{t.description}</span>
                        <span className="text-[10px] text-slate-500">{t.formattedTime}</span>
                      </div>
                      <span className={`font-mono font-bold ${t.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {t.amount >= 0 ? `+₹${t.amount.toLocaleString()}` : `-₹${Math.abs(t.amount).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeSubModal === 'withdrawalDetails' && (
                <div className="space-y-2">
                  {withdrawalsList.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">No withdrawal requests yet.</div>
                  ) : (
                    withdrawalsList.map(w => (
                      <div key={w.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">₹{Math.abs(w.amount).toLocaleString()}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            {w.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Net payout: ₹{w.netAmount?.toLocaleString()}</span>
                          <span>{w.formattedTime}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeSubModal === 'notifications' && (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-700 block">Daily Withdrawal Window (00:30 - 17:00)</span>
                    <p className="text-slate-600">
                      Withdrawals unlock each day starting 12:30 AM (00:30 hrs). For plans bought today, funds unlock next day after 12:30 AM.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-600 block">Level 1 Commission Updated to 22%</span>
                    <p className="text-slate-600">
                      Invite friends and earn 22% direct commission on every sports pass purchase!
                    </p>
                  </div>
                </div>
              )}

              {activeSubModal === 'about' && (
                <div className="space-y-3 leading-relaxed text-slate-700">
                  <p>
                    <strong className="text-slate-900">FanCode</strong> is a premier live sports streaming and interactive sports entertainment platform delivering high-engagement sports broadcasts, real-time analytics, and high-yield digital sports event contracts worldwide.
                  </p>
                  <p>
                    Every investment contract delivers predictable, transparent daily revenue directly to our users worldwide.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
