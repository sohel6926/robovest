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
  ShieldCheck
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
  const { user, transactions, setShowAuthModal } = useApp();
  const [activeSubModal, setActiveSubModal] = useState<
    'personal' | 'balanceDetails' | 'withdrawalDetails' | 'notifications' | 'about' | null
  >(null);

  const withdrawalsList = transactions.filter(t => t.type === 'WITHDRAWAL');

  return (
    <div className="pb-24 max-w-md mx-auto space-y-4 px-4 pt-2 text-slate-900">
      {/* Header with Settings Icon */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-black text-slate-900 font-['Space_Grotesk']">Profile</h1>
        <button
          onClick={() => setActiveSubModal('personal')}
          className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* User Info Hero Card */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
        {/* Avatar with Robot Emblem */}
        <div className="relative w-16 h-16 rounded-2xl bg-blue-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center">
          <Bot className="w-9 h-9 text-white" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center border-2 border-white">
            <Crown className="w-3 h-3 fill-white" />
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900">{user.id}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-wider">
              <Crown className="w-3 h-3 fill-blue-700" />
              VIP{user.vipLevel}
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            ID {user.phone.slice(0, 6)}***{user.phone.slice(-4)}
          </div>
        </div>
      </div>

      {/* Available Balance Box */}
      <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
            AVAILABLE BALANCE
          </span>
          <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums font-['Space_Grotesk'] mt-0.5">
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
        {/* Orders */}
        <button
          onClick={onNavigateToOrders}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition group active:scale-95 shadow-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Orders</span>
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

          {/* Logout */}
          <button
            onClick={() => setShowAuthModal(true)}
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
                {activeSubModal === 'about' && 'About RoboVest Capital'}
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
                      Invite friends and earn 22% direct commission on every robot fleet purchase!
                    </p>
                  </div>
                </div>
              )}

              {activeSubModal === 'about' && (
                <div className="space-y-3 leading-relaxed text-slate-700">
                  <p>
                    <strong className="text-slate-900">RoboVest AI Capital</strong> is an international enterprise robotics management company deploying autonomous bipedal and industrial cybernetic hardware fleets across modern smart logistics, data centers, and advanced manufacturing hubs.
                  </p>
                  <p>
                    Every investment contract corresponds to a dedicated autonomous robot unit operating 24/7 on industrial tasks, delivering predictable, transparent daily revenue directly to our commanders worldwide.
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
