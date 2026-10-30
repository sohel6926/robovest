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

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setShowOrdersModal, 
    setShowBankCardModal, 
    setShowCustomerCare,
    showAdminPanel,
    setShowAdminPanel,
    setNavigateToRechargeFn,
    setNavigateToWithdrawFn,
    user,
    setShowAuthModal,
  } = useApp();

  const [currentSubView, setCurrentSubView] = useState<'none' | 'recharge' | 'withdraw'>(() => {
    try {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#recharge') return 'recharge';
      if (hash === '#withdraw') return 'withdraw';
      const saved = localStorage.getItem('fancode_current_subview');
      if (saved === 'recharge' || saved === 'withdraw') return saved;
    } catch {}
    return 'none';
  });

  const updateSubView = (view: 'none' | 'recharge' | 'withdraw') => {
    setCurrentSubView(view);
    try {
      localStorage.setItem('fancode_current_subview', view);
      if (view === 'recharge') {
        window.history.replaceState(null, '', '#recharge');
      } else if (view === 'withdraw') {
        window.history.replaceState(null, '', '#withdraw');
      } else {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    } catch {}
  };

  // Detect referral code in URL (e.g. ?ref=ABC123 or /join?ref=ABC123)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      let ref = params.get('ref') || params.get('invite') || params.get('code') || params.get('r');
      
      if (!ref) {
        const match = window.location.pathname.match(/\/(?:join|ref)\/([a-zA-Z0-9]+)/i);
        if (match && match[1]) {
          ref = match[1];
        }
      }

      if (ref) {
        const cleanRef = ref.trim().toUpperCase();
        sessionStorage.setItem('fancode_ref_code', cleanRef);
        localStorage.setItem('fancode_ref_code', cleanRef);
        if (!user.isLoggedIn) {
          setShowAuthModal(true);
        }
      }
    } catch (e) {
      console.error('Error parsing referral code from URL', e);
    }
  }, [user.isLoggedIn, setShowAuthModal]);

  React.useEffect(() => {
    const handleUrlRoutes = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // Admin route check
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setShowAdminPanel(true);
        return;
      }

      // Subviews check
      if (hash === '#recharge') {
        setCurrentSubView('recharge');
        return;
      }
      if (hash === '#withdraw') {
        setCurrentSubView('withdraw');
        return;
      }

      // Modals check
      if (hash === '#orders') {
        setActiveTab('profile');
        setShowOrdersModal(true);
        return;
      }
      if (hash === '#bank') {
        setActiveTab('profile');
        setShowBankCardModal(true);
        return;
      }
      if (hash === '#contact') {
        setShowCustomerCare(true);
        return;
      }

      // Tabs check
      if (hash === '#invite') {
        setActiveTab('invite');
        setCurrentSubView('none');
        return;
      }
      if (hash === '#team') {
        setActiveTab('team');
        setCurrentSubView('none');
        return;
      }
      if (hash === '#profile') {
        setActiveTab('profile');
        setCurrentSubView('none');
        return;
      }
      if (hash === '#home') {
        setActiveTab('home');
        setCurrentSubView('none');
        return;
      }

      // Auth routes check (/login, /signin, /register, /signup, etc.)
      const isAuthPath = 
        path === '/login' || 
        path === '/signin' || 
        path === '/register' || 
        path === '/signup' || 
        hash === '#login' || 
        hash === '#signin' || 
        hash === '#register' || 
        hash === '#signup' ||
        hash.includes('access_token=') ||
        window.location.search.includes('reset=true');

      if (isAuthPath) {
        setShowAuthModal(true);
      }
    };

    handleUrlRoutes();
    window.addEventListener('hashchange', handleUrlRoutes);
    window.addEventListener('popstate', handleUrlRoutes);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoutes);
      window.removeEventListener('popstate', handleUrlRoutes);
    };
  }, [setShowAdminPanel, setShowAuthModal, setActiveTab, setShowOrdersModal, setShowBankCardModal, setShowCustomerCare]);

  const handleOpenRecharge = () => {
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    updateSubView('recharge');
  };

  // Register with context so any component (e.g. BuyModal, Navbar) can trigger recharge navigation
  React.useEffect(() => {
    setNavigateToRechargeFn(handleOpenRecharge);
    setNavigateToWithdrawFn(handleOpenWithdraw);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.isLoggedIn]);

  const handleOpenWithdraw = () => {
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    updateSubView('withdraw');
  };

  const handleBackToMain = () => {
    updateSubView('none');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] sm:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] sm:from-slate-900 sm:via-[#0b0f19] sm:to-[#070a10] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex items-center justify-center sm:py-6 sm:px-4">
      {/* Background ambient decorative light orbs on desktop */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      {/* Main Container: Mobile view on phones, luxury flagship smartphone bezel on desktop */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[92vh] bg-[#FFF7F2] relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_50px_rgba(255,74,0,0.15)] sm:rounded-[36px] border-x sm:border border-slate-200/90 flex flex-col overflow-hidden">
        {/* Sticky Top Bar Header */}
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

      {/* Full Admin Master Console Modal (Only accessible via /admin) */}
      {showAdminPanel && (
        <AdminPanel onClose={() => {
          setShowAdminPanel(false);
          if (window.location.pathname.toLowerCase() === '/admin') {
            window.history.pushState(null, '', '/');
          } else {
            window.history.pushState(null, '', `#${activeTab}`);
          }
        }} />
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
