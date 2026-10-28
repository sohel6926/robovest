import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Users, 
  UserPlus, 
  CreditCard, 
  ArrowDownToLine, 
  Clock, 
  Building2, 
  Headset, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  ChevronRight,
  Wallet,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setShowAuthModal,
    logoutUser,
    setActiveTab,
    navigateToRecharge,
    navigateToWithdraw,
    setShowOrdersModal,
    setShowBankCardModal,
    setShowCustomerCare,
    setShowAdminPanel,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (destination: string) => {
    setIsMenuOpen(false);

    if (destination === 'home') {
      setActiveTab('home');
      return;
    }

    if (destination === 'contact') {
      setShowCustomerCare(true);
      return;
    }

    if (destination === 'admin') {
      setShowAdminPanel(true);
      return;
    }

    // Login-protected actions
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (destination === 'profile') {
      setActiveTab('profile');
    } else if (destination === 'team') {
      setActiveTab('team');
    } else if (destination === 'invite') {
      setActiveTab('invite');
    } else if (destination === 'recharge') {
      navigateToRecharge();
    } else if (destination === 'withdraw') {
      navigateToWithdraw();
    } else if (destination === 'orders') {
      setShowOrdersModal(true);
    } else if (destination === 'bank') {
      setShowBankCardModal(true);
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logoutUser();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3.5 py-2.5 text-slate-900 shadow-xs transition-all">
        <div className="flex items-center justify-between">
          {/* FanCode Brand Lockup */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 min-w-0 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] shadow-sm shadow-orange-500/25 flex items-center justify-center shrink-0">
              <span className="font-black italic text-white text-xs tracking-tight">FC</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black italic text-[16px] sm:text-lg tracking-tight text-slate-950 font-sans leading-none">
                  FAN<span className="text-[#FF4A00]">CODE</span>
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-orange-50 text-[#FF4A00] border border-orange-200 leading-none">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                Live Sports. Anytime. Anywhere.
              </p>
            </div>
          </div>

          {/* Right Action: Hamburger Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Navigation Drawer / Slide-Over Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-[320px] sm:max-w-xs h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-250 border-l border-slate-200">
            
            {/* Top Bar inside Drawer */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] flex items-center justify-center text-white font-black italic text-[10px]">
                  FC
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                    FAN<span className="text-[#FF4A00]">CODE</span> PRO
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* User Account / Guest Card */}
              {user.isLoggedIn ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                        {user.phone ? user.phone.slice(-2) : (user.email ? user.email.slice(0, 2).toUpperCase() : 'U')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {user.phone || user.email || 'Active User'}
                        </p>
                        <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Connected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Balance Summary */}
                  <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">Available Balance</p>
                      <p className="font-extrabold text-white text-sm">
                        ₹{Number(user.availableBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Withdrawable</p>
                      <p className="font-extrabold text-amber-400 text-sm">
                        ₹{Number(user.withdrawableBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200/80 text-slate-900 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-[#FF4A00] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Guest Visitor</p>
                      <p className="text-[10px] text-slate-500">Sign in to start investing</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#FF4A00] hover:bg-[#FF3500] text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                </div>
              )}

              {/* Navigation Links (All Pages Access) */}
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase px-2 py-1">
                  Pages & Navigation
                </p>

                {/* 1. Home */}
                <button
                  onClick={() => handleNavigate('home')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <span>Home & Fleet</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 2. Recharge */}
                <button
                  onClick={() => handleNavigate('recharge')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <span>Recharge Wallet</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 3. Withdraw */}
                <button
                  onClick={() => handleNavigate('withdraw')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <ArrowDownToLine className="w-4 h-4" />
                    </div>
                    <span>Withdraw Funds</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 4. My Orders / History */}
                <button
                  onClick={() => handleNavigate('orders')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span>Investment Orders</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 5. Bank & UPI Card */}
                <button
                  onClick={() => handleNavigate('bank')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span>Bank & UPI Accounts</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 6. Team & Downlines */}
                <button
                  onClick={() => handleNavigate('team')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <span>My Team & Downlines</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 7. Invite Friends */}
                <button
                  onClick={() => handleNavigate('invite')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span>Invite & Rewards</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 8. My Profile */}
                <button
                  onClick={() => handleNavigate('profile')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span>My Account Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 9. Customer Care */}
                <button
                  onClick={() => handleNavigate('contact')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Headset className="w-4 h-4" />
                    </div>
                    <span>24/7 Customer Care</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* 10. Admin Panel */}
                <button
                  onClick={() => handleNavigate('admin')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 text-xs font-semibold transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>Admin Master Console</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Bottom Footer Actions (Logout or Sign In) */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70">
              {user.isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center gap-2 border border-red-200/80 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF5A00] to-[#FF3500] hover:brightness-105 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition active:scale-98 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
