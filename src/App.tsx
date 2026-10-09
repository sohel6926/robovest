/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { HomeTab } from './components/home/HomeTab';
import { RechargeTab } from './components/recharge/RechargeTab';
import { WithdrawTab } from './components/withdraw/WithdrawTab';
import { InviteTab } from './components/invite/InviteTab';
import { TeamTab } from './components/team/TeamTab';
import { ProfileTab } from './components/profile/ProfileTab';

// Modals
import { WelcomeModal } from './components/modals/WelcomeModal';
import { BuyModal } from './components/modals/BuyModal';
import { CustomerServiceModal } from './components/modals/CustomerServiceModal';
import { OrdersModal } from './components/modals/OrdersModal';
import { BankCardModal } from './components/modals/BankCardModal';
import { ColorTrustGuideModal } from './components/modals/ColorTrustGuideModal';
import { AuthModal } from './components/modals/AuthModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { Key } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setShowOrdersModal, 
    setShowBankCardModal, 
    setShowCustomerCare,
    showAdminPanel,
    setShowAdminPanel,
  } = useApp();

  const [currentSubView, setCurrentSubView] = useState<'none' | 'recharge' | 'withdraw'>('none');

  const handleOpenRecharge = () => {
    setCurrentSubView('recharge');
  };

  const handleOpenWithdraw = () => {
    setCurrentSubView('withdraw');
  };

  const handleBackToMain = () => {
    setCurrentSubView('none');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] sm:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] sm:from-slate-900 sm:via-[#0b0f19] sm:to-[#070a10] text-slate-900 font-['Plus_Jakarta_Sans'] antialiased selection:bg-blue-600 selection:text-white flex items-center justify-center sm:py-6 sm:px-4">
      {/* Background ambient decorative light orbs on desktop */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      {/* Main Container: Mobile view on phones, luxury flagship smartphone bezel on desktop */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[92vh] bg-[#F8FAFC] relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(37,99,235,0.15)] sm:rounded-[36px] border-x sm:border border-slate-200/90 flex flex-col overflow-hidden">
        {/* Sticky Top Bar (Only visible when not in full-screen subviews like Recharge/Withdraw) */}
        {currentSubView === 'none' && <Navbar />}

        {/* Main Content Area */}
        <main className="flex-1">
          {currentSubView === 'recharge' ? (
            <RechargeTab
              onBack={handleBackToMain}
              onSwitchToWithdraw={handleOpenWithdraw}
            />
          ) : currentSubView === 'withdraw' ? (
            <WithdrawTab
              onBack={handleBackToMain}
              onSwitchToRecharge={handleOpenRecharge}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeTab
                  onNavigateToRecharge={handleOpenRecharge}
                  onNavigateToWithdraw={handleOpenWithdraw}
                />
              )}
              {activeTab === 'invite' && <InviteTab />}
              {activeTab === 'team' && (
                <TeamTab onNavigateToInvite={() => setActiveTab('invite')} />
              )}
              {activeTab === 'profile' && (
                <ProfileTab
                  onNavigateToOrders={() => setShowOrdersModal(true)}
                  onNavigateToBank={() => setShowBankCardModal(true)}
                  onNavigateToContact={() => setShowCustomerCare(true)}
                />
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        {currentSubView === 'none' && <BottomNav />}

        {/* Modals & Dialogs */}
        <WelcomeModal />
        <BuyModal />
        <CustomerServiceModal />
        <OrdersModal />
        <BankCardModal />
        <ColorTrustGuideModal />
        <AuthModal />
      </div>

      {/* Floating Discrete Admin Trigger (Always accessible anywhere) */}
      <button
        onClick={() => setShowAdminPanel(true)}
        title="Open Admin Control Panel"
        className="fixed bottom-4 right-4 z-45 bg-slate-950/80 hover:bg-slate-900 text-amber-400 hover:text-amber-300 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
      >
        <Key className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Admin Panel</span>
      </button>

      {/* Full Admin Master Console Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
