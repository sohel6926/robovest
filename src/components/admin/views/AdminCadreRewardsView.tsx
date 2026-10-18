import React from 'react';
import { Award, CheckCircle2, TrendingUp, Gift, Users, Shield, Wallet } from 'lucide-react';
import { CadreClaimItem } from './AdminDashboardView';

interface AdminCadreRewardsViewProps {
  cadreClaims: CadreClaimItem[];
  onCreditCadreReward: (claimId: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminCadreRewardsView: React.FC<AdminCadreRewardsViewProps> = ({
  cadreClaims,
  onCreditCadreReward,
  showToast,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-['Space_Grotesk'] tracking-tight">
          Cadre Rewards Management
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track leadership ranks, performance milestones, and member gold gift bonuses.
        </p>
      </div>

      {/* Cadre Ranks Ladder */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tier 1: Star */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
              LEVEL 1
            </span>
            <Award className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 font-['Space_Grotesk'] text-base">Star Rank</h4>
            <p className="text-xs text-slate-400 mt-0.5">Standard Active Member</p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Direct Req:</span>
              <span className="font-bold text-slate-800">₹0</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Team Req:</span>
              <span className="font-bold text-slate-800">₹0</span>
            </div>
          </div>
        </div>

        {/* Tier 2: AGM */}
        <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-xs space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-[9px] px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
              LEVEL 2
            </span>
            <Gift className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 font-['Space_Grotesk'] text-base">AGM</h4>
            <p className="text-xs text-purple-700 font-bold mt-0.5">Gift: Worth Gold (₹1,25,000)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Direct Req:</span>
              <span className="font-bold text-slate-800">₹50,000</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Team Req:</span>
              <span className="font-bold text-slate-800">₹5,00,000</span>
            </div>
          </div>
        </div>

        {/* Tier 3: DGM */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
              LEVEL 3
            </span>
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 font-['Space_Grotesk'] text-base">DGM</h4>
            <p className="text-xs text-blue-700 font-bold mt-0.5">Gift: Luxury Vehicle (₹3,50,000)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Direct Req:</span>
              <span className="font-bold text-slate-800">₹1,50,000</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Team Req:</span>
              <span className="font-bold text-slate-800">₹15,00,000</span>
            </div>
          </div>
        </div>

        {/* Tier 4: GM */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              LEVEL 4
            </span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 font-['Space_Grotesk'] text-base">General Manager</h4>
            <p className="text-xs text-emerald-700 font-bold mt-0.5">Gift: Luxury Villa (₹10,00,000)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Direct Req:</span>
              <span className="font-bold text-slate-800">₹5,00,000</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Team Req:</span>
              <span className="font-bold text-slate-800">₹50,00,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Claims Review Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900 font-['Space_Grotesk']">
              Cadre Reward Claims Queue
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
            {cadreClaims.filter(c => !c.isCredited).length} Pending Claims
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Member Name</th>
                <th className="px-4 py-3">Cadre Achieved</th>
                <th className="px-4 py-3">Reward / Gift Entitlement</th>
                <th className="px-4 py-3">Wallet Cash Equivalent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {cadreClaims.map((claim, index) => (
                <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3.5 font-bold font-['Space_Grotesk'] text-slate-900">
                    {claim.name}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                      {claim.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-purple-600">
                    {claim.gift}
                  </td>
                  <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                    ₹ {claim.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    {claim.isCredited ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Credited ✓
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                        Pending Claim
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {claim.isCredited ? (
                      <span className="text-[11px] text-slate-400 font-bold font-mono">Completed</span>
                    ) : (
                      <button
                        onClick={() => onCreditCadreReward(claim.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 ml-auto"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Credit Wallet</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
