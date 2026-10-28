import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, UserPlus, Headset, Users, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setShowCustomerCare, user, setShowAuthModal } = useApp();

  const handleTabClick = (tab: 'home' | 'invite' | 'team' | 'profile') => {
    if ((tab === 'invite' || tab === 'team') && !user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_25px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto relative flex items-center justify-around h-16 px-1">
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer"
        >
          <Home
            className={`w-[22px] h-[22px] transition-transform ${
              activeTab === 'home'
                ? 'text-[#FF4A00] stroke-[2.2] scale-105'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 leading-tight ${
              activeTab === 'home'
                ? 'text-[#FF4A00] font-bold'
                : 'text-slate-400 font-medium'
            }`}
          >
            Home
          </span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A00] mt-0.5 shadow-xs" />
          )}
        </button>

        {/* Tab 2: Invite (Login Protected) */}
        <button
          onClick={() => handleTabClick('invite')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer"
        >
          <UserPlus
            className={`w-[22px] h-[22px] transition-transform ${
              activeTab === 'invite'
                ? 'text-[#FF4A00] stroke-[2.2] scale-105'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 leading-tight ${
              activeTab === 'invite'
                ? 'text-[#FF4A00] font-bold'
                : 'text-slate-400 font-medium'
            }`}
          >
            Invite
          </span>
          {activeTab === 'invite' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A00] mt-0.5" />
          )}
        </button>

        {/* Tab 3: Center Elevated Floating Contact Button with Warm Glow */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-4 cursor-pointer">
          <div className="relative group">
            {/* Soft Warm Glow behind circle */}
            <div className="absolute -inset-1.5 bg-[#FF4A00]/25 rounded-full blur-md group-hover:bg-[#FF4A00]/40 transition-all pointer-events-none" />
            <button
              onClick={() => setShowCustomerCare(true)}
              aria-label="Contact Customer Support"
              className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF4500] via-[#FF5500] to-[#FF6E14] text-white shadow-[0_6px_18px_rgba(255,74,0,0.45)] flex items-center justify-center transform active:scale-95 transition-all border-2 border-white cursor-pointer"
            >
              <Headset className="w-6 h-6 text-white stroke-[2.2]" />
            </button>
          </div>
          <span className="text-[11px] font-bold text-[#FF4A00] mt-1 leading-tight">
            Contact
          </span>
        </div>

        {/* Tab 4: Team (Login Protected) */}
        <button
          onClick={() => handleTabClick('team')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer"
        >
          <Users
            className={`w-[22px] h-[22px] transition-transform ${
              activeTab === 'team'
                ? 'text-[#FF4A00] stroke-[2.2] scale-105'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 leading-tight ${
              activeTab === 'team'
                ? 'text-[#FF4A00] font-bold'
                : 'text-slate-400 font-medium'
            }`}
          >
            Team
          </span>
          {activeTab === 'team' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A00] mt-0.5" />
          )}
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer"
        >
          <User
            className={`w-[22px] h-[22px] transition-transform ${
              activeTab === 'profile'
                ? 'text-[#FF4A00] stroke-[2.2] scale-105'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          />
          <span
            className={`text-[11px] mt-0.5 leading-tight ${
              activeTab === 'profile'
                ? 'text-[#FF4A00] font-bold'
                : 'text-slate-400 font-medium'
            }`}
          >
            Profile
          </span>
          {activeTab === 'profile' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A00] mt-0.5" />
          )}
        </button>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="pb-1 pt-0.5 flex justify-center">
        <div className="w-32 h-1 bg-slate-400/60 rounded-full" />
      </div>
    </nav>
  );
};
