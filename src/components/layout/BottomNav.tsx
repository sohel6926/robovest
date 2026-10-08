import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, UserPlus, Headset, Users, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setShowCustomerCare } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe">
      <div className="max-w-md mx-auto relative flex items-center justify-around h-16 px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] font-medium mt-1">Home</span>
          {activeTab === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 2: Invite */}
        <button
          onClick={() => setActiveTab('invite')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            activeTab === 'invite' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <UserPlus className={`w-5 h-5 transition-transform ${activeTab === 'invite' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] font-medium mt-1">Invite</span>
          {activeTab === 'invite' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 3: Raised Center Action - Contact / Support */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            onClick={() => setShowCustomerCare(true)}
            aria-label="Contact Customer Care"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center transform active:scale-95 transition-all text-white border-2 border-white"
          >
            <Headset className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
          <span className="text-[10px] font-bold text-blue-600 mt-1">Contact</span>
        </div>

        {/* Tab 4: Team */}
        <button
          onClick={() => setActiveTab('team')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            activeTab === 'team' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className={`w-5 h-5 transition-transform ${activeTab === 'team' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] font-medium mt-1">Team</span>
          {activeTab === 'team' && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110 stroke-[2.5]' : ''}`} />
          <span className="text-[11px] font-medium mt-1">Profile</span>
          {activeTab === 'profile' && <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
        </button>
      </div>
    </nav>
  );
};
