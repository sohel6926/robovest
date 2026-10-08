import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Coins, ChevronRight } from 'lucide-react';

interface TeamTabProps {
  onNavigateToInvite: () => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ onNavigateToInvite }) => {
  const { user, teamMembers } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false);

  // Filter members by level
  const level1Members = teamMembers.filter(m => m.level === 1);
  const level2Members = teamMembers.filter(m => m.level === 2);
  const level3Members = teamMembers.filter(m => m.level === 3);

  const currentList = selectedLevel === 1 ? level1Members : selectedLevel === 2 ? level2Members : level3Members;
  const currentRate = selectedLevel === 1 ? '22%' : selectedLevel === 2 ? '2%' : '1%';

  const currentTotalRecharge = currentList.reduce((acc, m) => acc + m.rechargeAmount, 0);
  const currentTotalComm = currentList.reduce((acc, m) => acc + m.commissionGenerated, 0);

  const allRecharge = teamMembers.reduce((acc, m) => acc + m.rechargeAmount, 0);

  return (
    <div className="pb-24 max-w-md mx-auto space-y-4 px-4 pt-2 text-slate-900">
      {/* Top Header with Invite Code Badge */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-black text-slate-900 font-['Space_Grotesk']">Team</h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold">
          <span>📋</span>
          <span>{user.inviteCode}</span>
        </div>
      </div>

      {/* Top 2 Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Team Members */}
        <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Team members</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-['Space_Grotesk']">
            {teamMembers.length}
          </div>
          <div className="text-[11px] text-blue-600 font-bold">
            {teamMembers.filter(m => m.status === 'ACTIVE').length} active
          </div>
        </div>

        {/* Card 2: Team Recharge */}
        <div className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>Team recharge</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 tabular-nums font-['Space_Grotesk']">
            ₹{allRecharge.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            across 3 levels
          </div>
        </div>
      </div>

      {/* Segmented Level Buttons */}
      <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {[1, 2, 3].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as 1 | 2 | 3)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
              selectedLevel === lvl
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Level {lvl}
          </button>
        ))}
      </div>

      {/* Level Details Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              L{selectedLevel}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Level {selectedLevel}</h2>
              <p className="text-[11px] text-slate-500">
                {selectedLevel === 1
                  ? 'People you invited directly'
                  : selectedLevel === 2
                  ? 'Invited by your Level 1 partners'
                  : 'Invited by your Level 2 partners'}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold text-xs">
            {currentRate}
          </span>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Members</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">{currentList.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Active</span>
            <span className="text-xl font-bold text-emerald-600 tabular-nums">
              {currentList.filter(m => m.status === 'ACTIVE').length}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Recharge</span>
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              ₹{currentTotalRecharge.toLocaleString()}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Commission</span>
            <span className="text-xl font-bold text-blue-600 tabular-nums">
              ₹{currentTotalComm.toLocaleString()}
            </span>
          </div>
        </div>

        {/* View Members Button */}
        <button
          onClick={() => setShowMembersModal(true)}
          className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
        >
          <span>📋</span>
          <span>View members ({currentList.length})</span>
        </button>
      </div>

      {/* Total Income Credited */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total income credited</span>
            <span className="text-2xl font-black text-blue-600 tabular-nums font-['Space_Grotesk']">
              ₹{user.totalIncome.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Grow Your Team CTA Button */}
      <button
        onClick={onNavigateToInvite}
        className="w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-between active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm leading-tight text-white">Grow your team</h3>
            <p className="text-[11px] font-medium text-blue-100">Share your link — earn on all 3 levels</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* How Team Income Works */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-2 text-xs shadow-sm">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <span className="text-blue-600">ℹ</span>
          <span>How team income works</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Commission is credited to your wallet the moment a team member invests, and it never reduces what they earn. Rates above are set per level (22% for Level 1, 2% for Level 2, 1% for Level 3).
        </p>
      </div>

      {/* Team Roster Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 space-y-4 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">Level {selectedLevel} Members ({currentList.length})</h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {currentList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No members joined under Level {selectedLevel} yet.</div>
              ) : (
                currentList.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{m.phone}</span>
                      <span className="text-[10px] text-slate-400 block">Joined {m.joinDate}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">₹{m.rechargeAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-blue-600 font-bold block">+₹{m.commissionGenerated} earned</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
