import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Power, 
  Trash2, 
  Users, 
  TrendingUp, 
  IndianRupee, 
  GitBranch, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Lock, 
  Plus, 
  Download, 
  ShieldCheck, 
  Building2, 
  RefreshCw,
  Award,
  Wallet,
  Check,
  X,
  Edit3,
  FileText,
  Shield,
  UploadCloud
} from 'lucide-react';
import { AdminUserItem } from './AdminUserManagementView';

interface AdminUserDetailViewProps {
  user: AdminUserItem;
  onBack: () => void;
  onUpdateUser?: (updated: AdminUserItem) => void;
  onAdjustBalance?: (userId: string, amount: number, reason: string) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminUserDetailView: React.FC<AdminUserDetailViewProps> = ({
  user: initialUser,
  onBack,
  onUpdateUser,
  onAdjustBalance,
  showToast,
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUserItem>(initialUser);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'investments' | 'team_tree' | 'income' | 'wallet_history' | 'profile' | 'kyc_bank' | 'add_money' | 'topup'
  >('overview');

  // Edit states for Profile (Screenshot 2)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileMobile, setProfileMobile] = useState(currentUser.mobile);
  const [profileEmail, setProfileEmail] = useState(
    currentUser.email || `${currentUser.name.toLowerCase().replace(/\s+/g, '')}821@gmail.com`
  );
  const [profileCity, setProfileCity] = useState(currentUser.city || 'Amadalavalasa');
  const [profilePassword, setProfilePassword] = useState('12345678');
  const [profilePin, setProfilePin] = useState('9025');
  const [profileAddress, setProfileAddress] = useState('—');
  const [profileDistrict, setProfileDistrict] = useState('—');
  const [profileState, setProfileState] = useState('—');
  const [profilePincode, setProfilePincode] = useState('—');

  // Edit states for KYC & Bank (Screenshot 3)
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [aadhaarNum, setAadhaarNum] = useState('—');
  const [panNum, setPanNum] = useState('—');
  const [bankName, setBankName] = useState(currentUser.bankAccount?.bankName || '—');
  const [bankAccountNum, setBankAccountNum] = useState(currentUser.bankAccount?.accountNumber || '—');
  const [bankIfsc, setBankIfsc] = useState(currentUser.bankAccount?.ifscCode || '—');
  const [bankBranch, setBankBranch] = useState('—');
  const [bankPayeeName, setBankPayeeName] = useState(currentUser.bankAccount?.accountHolder || '—');
  const [kycStatus, setKycStatus] = useState<'UNFILLED' | 'APPROVED' | 'PENDING' | 'REJECTED'>(
    currentUser.kycStatus || 'UNFILLED'
  );

  // Top-Up state (Screenshot 4)
  const [topupAmount, setTopupAmount] = useState('');

  // Add Money state
  const [addAmount, setAddAmount] = useState<string>('');
  const [addReason, setAddReason] = useState<string>('Admin Manual Credit');
  const [isCreditMode, setIsCreditMode] = useState<boolean>(true);

  // Investments state (Screenshot 3)
  const [userInvestments, setUserInvestments] = useState(
    currentUser.investments && currentUser.investments.length > 0
      ? currentUser.investments
      : [
          {
            id: 'cmvl41fl327klkva0wfcxeh2w',
            planName: 'Plan 2 (6.66% ROI with Security)',
            category: 'direct',
            amountInvested: currentUser.totalInvested || 500000,
            totalReturn: (currentUser.totalInvested || 500000) * 2,
            earnedSoFar: currentUser.totalEarned || 2220,
            monthlyReturn: '6.66%',
            startDate: '23/10/2026, 8:43:57 pm',
            endDate: '23/4/2029, 8:43:57 pm',
            duration: '30 Months',
            nextPayout: '23/4/2029, 8:43:57 pm',
            status: 'Active' as const,
          }
        ]
  );

  // New investment modal state
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('Plan 1 (High Efficiency Yield)');
  const [newPlanAmount, setNewPlanAmount] = useState('50000');
  const [newPlanRoi, setNewPlanRoi] = useState('8.5%');

  // Calculations & default fallbacks
  const walletBal = currentUser.walletBalance ?? 2220;
  const totalEarned = currentUser.totalEarned ?? 2220;
  const totalInvested = currentUser.totalInvested ?? 500000;
  const activePlansCount = userInvestments.filter(i => i.status === 'Active').length || 1;
  const directRefs = currentUser.directReferrals ?? 0;
  const totalTeam = currentUser.totalTeam ?? 0;
  const referralIncome = currentUser.referralIncome ?? 0;
  const levelIncome = currentUser.levelIncome ?? 0;
  const roiIncome = currentUser.roiIncome ?? 2220;

  // Toggle user active status
  const handleToggleActive = () => {
    const newStatus = currentUser.status === 'Active' ? 'InActive' : 'Active';
    const updated = { ...currentUser, status: newStatus };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    showToast(`User is now ${newStatus}`);
  };

  // Toggle profile lock
  const handleToggleLock = () => {
    const newLock = !currentUser.profileLocked;
    const updated = { ...currentUser, profileLocked: newLock };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    showToast(`User profile ${newLock ? 'LOCKED' : 'UNLOCKED'}`);
  };

  // Approve KYC
  const handleApproveKyc = () => {
    setKycStatus('APPROVED');
    const updated: AdminUserItem = { ...currentUser, kycStatus: 'APPROVED' };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    showToast(`KYC Approved for ${currentUser.name}!`);
  };

  // Reject KYC
  const handleRejectKyc = () => {
    setKycStatus('REJECTED');
    const updated: AdminUserItem = { ...currentUser, kycStatus: 'REJECTED' };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    showToast(`KYC Rejected for ${currentUser.name}.`, 'error');
  };

  // Handle Add / Deduct money
  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    const finalAmount = isCreditMode ? amt : -amt;
    const newBal = Math.max(0, walletBal + finalAmount);
    const updated = { ...currentUser, walletBalance: newBal };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    if (onAdjustBalance) onAdjustBalance(currentUser.id, finalAmount, addReason);
    setAddAmount('');
    showToast(`${isCreditMode ? 'Credited' : 'Debited'} ₹${amt.toLocaleString()} to user wallet`);
  };

  // Handle Account Top-Up (Screenshot 4)
  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid top-up amount', 'error');
      return;
    }
    const newInv = {
      id: `topup-${Date.now().toString().slice(-8)}`,
      planName: `Account Top-up (2X Renewal)`,
      category: 'direct',
      amountInvested: amt,
      totalReturn: amt * 2,
      earnedSoFar: 0,
      monthlyReturn: '6.66%',
      startDate: new Date().toLocaleString(),
      endDate: new Date(Date.now() + 86400000 * 365).toLocaleString(),
      duration: '12 Months',
      nextPayout: new Date(Date.now() + 86400000 * 30).toLocaleString(),
      status: 'Active' as const,
    };
    const updatedInvs = [newInv, ...userInvestments];
    setUserInvestments(updatedInvs);
    const newTotal = totalInvested + amt;
    const updated = {
      ...currentUser,
      totalInvested: newTotal,
      investments: updatedInvs,
    };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setTopupAmount('');
    showToast(`Account top-up of ₹${amt.toLocaleString()} executed! 2X returns limit renewed.`);
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminUserItem = {
      ...currentUser,
      name: profileName,
      mobile: profileMobile,
      email: profileEmail,
      city: profileCity,
    };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditingProfile(false);
    showToast('Profile information saved successfully!');
  };

  // Save Bank Changes
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminUserItem = {
      ...currentUser,
      kycStatus,
      bankAccount: {
        accountHolder: bankPayeeName,
        bankName,
        accountNumber: bankAccountNum,
        ifscCode: bankIfsc,
        isBound: true,
      }
    };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setIsEditingBank(false);
    showToast('Bank details updated successfully!');
  };

  // Handle Assign Plan
  const handleAssignPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newPlanAmount) || 50000;
    const newInv = {
      id: `inv-${Date.now().toString().slice(-8)}`,
      planName: newPlanName,
      category: 'direct',
      amountInvested: amt,
      totalReturn: amt * 2,
      earnedSoFar: 0,
      monthlyReturn: newPlanRoi,
      startDate: new Date().toLocaleString(),
      endDate: new Date(Date.now() + 86400000 * 365).toLocaleString(),
      duration: '12 Months',
      nextPayout: new Date(Date.now() + 86400000 * 30).toLocaleString(),
      status: 'Active' as const,
    };
    const updatedInvs = [newInv, ...userInvestments];
    setUserInvestments(updatedInvs);
    const updated = {
      ...currentUser,
      totalInvested: totalInvested + amt,
      investments: updatedInvs,
    };
    setCurrentUser(updated);
    if (onUpdateUser) onUpdateUser(updated);
    setShowAssignPlanModal(false);
    showToast(`Assigned ${newPlanName} of ₹${amt.toLocaleString()} to user!`);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Breadcrumb & User Title Bar */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Users</span>
        </button>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
          {currentUser.name}
        </h1>
        <p className="text-xs font-mono text-slate-500 mt-0.5">
          User ID: <span className="font-bold text-slate-700">{currentUser.userId}</span> — Sponsor:{' '}
          <span className="font-bold text-[#70c028]">{currentUser.sponsorId}</span> — Member since{' '}
          <span className="font-bold text-slate-700">{currentUser.joined}</span>
        </p>
      </div>

      {/* Hero Header Card (Exact match to Bee Grow dark navy console) */}
      <div className="bg-[#0B1536] text-white rounded-3xl p-5 md:p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          {/* Avatar + Main Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#70c028] text-slate-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#70c028]/20 font-sans">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-sans text-white tracking-tight">
                {currentUser.name}
              </h2>
              <div className="text-xs text-slate-300 font-mono">
                {profileEmail} · {currentUser.mobile} · {profileCity}
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentUser.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentUser.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  {currentUser.status}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[10px] font-extrabold tracking-wide uppercase">
                  KYC: {kycStatus}
                </span>

                {currentUser.profileLocked && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    🔒 Locked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Deactivate / Delete Account */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleToggleActive}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                currentUser.status === 'Active'
                  ? 'bg-rose-950/40 border-rose-500/30 text-rose-300 hover:bg-rose-900/60'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{currentUser.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete user ${currentUser.name} (${currentUser.userId})?`)) {
                  showToast(`Account ${currentUser.userId} marked as deleted.`);
                  onBack();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 hover:bg-rose-900 text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Wallet Balance</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              ₹ {walletBal.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Total Earned</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              ₹ {totalEarned.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Total Invested</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              ₹ {totalInvested.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Active Plans</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              {activePlansCount}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Direct Referrals</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              {directRefs}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Total Team</span>
            <span className="font-mono font-black text-xl text-white mt-0.5 block">
              {totalTeam}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Pill Tab Navigation (ALL 10 TABS - Exact match to Bee Grow Screenshots) */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'investments', label: 'Investments' },
            { id: 'team_tree', label: 'Team Tree' },
            { id: 'income', label: 'Income Breakdown' },
            { id: 'wallet_history', label: 'Wallet History' },
            { id: 'profile', label: 'Profile' },
            { id: 'kyc_bank', label: 'KYC & Bank' },
            { id: 'add_money', label: 'Add Money' },
            { id: 'topup', label: 'Top-Up' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                activeTab === tab.id
                  ? 'bg-[#70c028] text-slate-950 font-black shadow-md shadow-[#70c028]/20 scale-102'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in-50 duration-150">
          {/* Top 4 Income Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Referral Income</span>
                <span className="text-2xl font-black font-mono text-emerald-600">
                  ₹ {referralIncome.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <GitBranch className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Level Income</span>
                <span className="text-2xl font-black font-mono text-[#0B1536]">
                  ₹ {levelIncome.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">ROI Income</span>
                <span className="text-2xl font-black font-mono text-amber-500">
                  ₹ {roiIncome.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Total Earned</span>
                <span className="text-2xl font-black font-mono text-emerald-600">
                  ₹ {totalEarned.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Cadre Progress Card (Screenshot 2) */}
          <div className="bg-[#0B1536] text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <div>
              <h3 className="text-base font-bold font-sans text-white">Cadre Progress</h3>
              <span className="text-xs font-black text-[#70c028]">Not yet achieved</span>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                <span>Target to Marketing coordinator (MC):</span>
                <span className="font-mono font-bold text-white">₹ 25,00,000</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-[#70c028] transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalInvested / 2500000) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
                <span>Eligible: ₹ {totalInvested.toLocaleString('en-IN')}</span>
                <span>{((totalInvested / 2500000) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* 4 Team & Referral Stat Cards (Screenshot 2) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Direct Referrals</span>
              <span className="text-2xl font-black font-mono text-blue-600 mt-1 block">
                {directRefs}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Indirect Referrals</span>
              <span className="text-2xl font-black font-mono text-blue-600 mt-1 block">
                {Math.max(0, totalTeam - directRefs)}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Total Team Investment</span>
              <span className="text-2xl font-black font-mono text-amber-500 mt-1 block">
                ₹ 0
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Team Commission</span>
              <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                ₹ 0
              </span>
            </div>
          </div>

          {/* Active Investments Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-sans">Active Investments</h3>
              <button
                onClick={() => setActiveTab('investments')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All Plans →
              </button>
            </div>

            {userInvestments.slice(0, 2).map((inv) => (
              <div key={inv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{inv.planName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                        {inv.status}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 mt-0.5 block">
                      ID: {inv.id} · Category: {inv.category}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    {inv.monthlyReturn} Monthly
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Amount Invested</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">₹ {inv.amountInvested.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Total Return</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">₹ {inv.totalReturn.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Earned So Far</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">₹ {inv.earnedSoFar.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px]">Duration</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{inv.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: INVESTMENTS (Exact match to Screenshot 3 from prev message) ================= */}
      {activeTab === 'investments' && (
        <div className="space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-sans">Active & Completed Investments</h3>
            <button
              onClick={() => setShowAssignPlanModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 text-xs font-black transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign New Plan</span>
            </button>
          </div>

          {userInvestments.map((inv) => (
            <div key={inv.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base font-sans">{inv.planName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 mt-0.5 block">
                    ID: {inv.id} · Category: {inv.category}
                  </span>
                </div>
              </div>

              {/* 4 Large Highlight Boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">Amount Invested</span>
                  <span className="text-xl font-black font-mono text-slate-950">
                    ₹ {inv.amountInvested.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">Total Return</span>
                  <span className="text-xl font-black font-mono text-emerald-600">
                    ₹ {inv.totalReturn.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">Earned So Far</span>
                  <span className="text-xl font-black font-mono text-emerald-600">
                    ₹ {inv.earnedSoFar.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-bold block mb-1">Monthly Return</span>
                  <span className="text-xl font-black font-mono text-amber-500">
                    {inv.monthlyReturn}
                  </span>
                </div>
              </div>

              {/* Date Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start: {inv.startDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>End: {inv.endDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duration: {inv.duration}</span>
                </div>

                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <span>Next Payout: {inv.nextPayout}</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (inv.earnedSoFar / inv.totalReturn) * 100)}%` }}
                  />
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  {((inv.earnedSoFar / inv.totalReturn) * 100).toFixed(1)}% returned
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: TEAM TREE ================= */}
      {activeTab === 'team_tree' && (
        <div className="space-y-5 animate-in fade-in-50 duration-150">
          {/* Top 4 Business Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Direct Business</span>
              <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                ₹ 0
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Indirect Business</span>
              <span className="text-2xl font-black font-mono text-blue-600 mt-1 block">
                ₹ 0
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Total Team Investment</span>
              <span className="text-2xl font-black font-mono text-amber-500 mt-1 block">
                ₹ 0
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 block">Commission Earned</span>
              <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                ₹ 0
              </span>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm font-sans">Level-wise Business</h3>
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <div
                    key={lvl}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-slate-100 transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Level {lvl}</span>
                      <span className="text-[10px] text-slate-400">0 members</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-700 text-xs block">₹ 0</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">LOCKED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm font-sans">Detailed Team Report</h3>
                <button
                  onClick={() => showToast('Team report exported successfully!')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 text-xs font-black transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export All Levels</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Member Name</th>
                      <th className="px-4 py-3">User ID</th>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">Business</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 font-medium">
                        No team members found.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: INCOME BREAKDOWN ================= */}
      {activeTab === 'income' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in-50 duration-150">
          <h3 className="font-bold text-slate-900 text-base font-sans">Daily Yield & Commission Ledger</h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Income Type</th>
                  <th className="px-4 py-3">Reference / Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-500">2026-10-25 18:30</td>
                  <td className="px-4 py-3 font-bold text-amber-600">Daily Contract ROI Yield</td>
                  <td className="px-4 py-3 font-mono text-slate-600">Plan 2 (6.66% ROI)</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-600">+₹ 1,110.00</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Settled
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-500">2026-10-24 18:30</td>
                  <td className="px-4 py-3 font-bold text-amber-600">Daily Contract ROI Yield</td>
                  <td className="px-4 py-3 font-mono text-slate-600">Plan 2 (6.66% ROI)</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-600">+₹ 1,110.00</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Settled
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: WALLET HISTORY ================= */}
      {activeTab === 'wallet_history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-sans">User Transaction History</h3>
            <span className="text-xs font-mono font-bold text-slate-500">
              Current Available: ₹ {walletBal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Txn ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">TXN-DEP-9921</td>
                  <td className="px-4 py-3 font-bold text-blue-600">RECHARGE</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-600">+₹ 5,00,000</td>
                  <td className="px-4 py-3 text-slate-600">Bank Transfer / UPI (Ref: UTR884920)</td>
                  <td className="px-4 py-3 font-mono text-slate-500">2026-10-23 20:43</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">TXN-INV-4412</td>
                  <td className="px-4 py-3 font-bold text-indigo-600">INVESTMENT</td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">-₹ 5,00,000</td>
                  <td className="px-4 py-3 text-slate-600">Allocated Plan 2 (6.66% ROI with Security)</td>
                  <td className="px-4 py-3 font-mono text-slate-500">2026-10-23 20:44</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">TXN-YLD-1102</td>
                  <td className="px-4 py-3 font-bold text-amber-600">DAILY_YIELD</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-600">+₹ 2,220</td>
                  <td className="px-4 py-3 text-slate-600">Automated Contract Yield Cycle</td>
                  <td className="px-4 py-3 font-mono text-slate-500">2026-10-25 18:30</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ================= TAB 7: PROFILE (Exact match to Screenshot 2) ================= */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-sans">Profile Information</h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-6 text-xs">
              {/* Main Info Grid (Screenshot 2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Full Name</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Email</span>
                  <span className="font-bold text-slate-900">{profileEmail}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Mobile</span>
                  <span className="font-mono font-bold text-slate-900">{currentUser.mobile}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">City</span>
                  <span className="font-bold text-slate-900">{profileCity}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Password</span>
                  <span className="font-mono font-bold text-slate-900">{profilePassword}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Security PIN</span>
                  <span className="font-mono font-bold text-slate-900">{profilePin}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Sponsor ID</span>
                  <span className="font-mono font-bold text-[#70c028]">{currentUser.sponsorId}</span>
                </div>

                <div className="flex justify-between md:justify-start md:gap-16 items-center">
                  <span className="text-slate-500 font-semibold w-28">Joined</span>
                  <span className="font-mono font-bold text-slate-900">{currentUser.joined}</span>
                </div>
              </div>

              {/* Divider & Address Details (Screenshot 2) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Address Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex justify-between md:justify-start md:gap-16 items-center">
                    <span className="text-slate-500 font-semibold w-28">Address</span>
                    <span className="text-slate-700">{profileAddress}</span>
                  </div>

                  <div className="flex justify-between md:justify-start md:gap-16 items-center">
                    <span className="text-slate-500 font-semibold w-28">District</span>
                    <span className="text-slate-700">{profileDistrict}</span>
                  </div>

                  <div className="flex justify-between md:justify-start md:gap-16 items-center">
                    <span className="text-slate-500 font-semibold w-28">State</span>
                    <span className="text-slate-700">{profileState}</span>
                  </div>

                  <div className="flex justify-between md:justify-start md:gap-16 items-center">
                    <span className="text-slate-500 font-semibold w-28">Pincode</span>
                    <span className="text-slate-700">{profilePincode}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Editable Profile Form */
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile</label>
                  <input
                    type="text"
                    value={profileMobile}
                    onChange={(e) => setProfileMobile(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Login Password</label>
                  <input
                    type="text"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Security PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={profilePin}
                    onChange={(e) => setProfilePin(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-blue-600 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Address</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={profilePincode}
                    onChange={(e) => setProfilePincode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
                >
                  Save Profile Information
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ================= TAB 8: KYC & BANK (Exact match to Screenshot 3) ================= */}
      {activeTab === 'kyc_bank' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in-50 duration-150">
          {/* Header Row with Action Pills (Screenshot 3) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900 text-base font-sans">KYC & Bank Details</h3>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleApproveKyc}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 font-black text-xs transition shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve KYC</span>
              </button>

              <button
                onClick={handleRejectKyc}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold text-xs transition"
              >
                <X className="w-4 h-4" />
                <span>Reject KYC</span>
              </button>

              <button
                onClick={handleToggleLock}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-bold text-xs transition"
              >
                <Lock className="w-4 h-4" />
                <span>{currentUser.profileLocked ? 'Unlock Profile' : 'Lock Profile'}</span>
              </button>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <button
              onClick={() => setIsEditingBank(!isEditingBank)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingBank ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {!isEditingBank ? (
            <div className="space-y-6 text-xs">
              {/* Section 1: Aadhaar & PAN (Screenshot 3) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Aadhaar Number</span>
                  <span className="font-mono text-slate-700">{aadhaarNum}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-semibold block mb-1">PAN Number</span>
                  <span className="font-mono text-slate-700">{panNum}</span>
                </div>
              </div>

              {/* Section 2: Bank Information (Screenshot 3) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">Bank Information</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Bank Name</span>
                    <span className="text-slate-700">{bankName}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Account No</span>
                    <span className="font-mono text-slate-700">{bankAccountNum}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">IFSC Code</span>
                    <span className="font-mono text-slate-700">{bankIfsc}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Branch</span>
                    <span className="text-slate-700">{bankBranch}</span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-slate-500 font-semibold block mb-1">Payee Name</span>
                    <span className="text-slate-700">{bankPayeeName}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: KYC Documents (Screenshot 3) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">KYC Documents</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Aadhaar Front</span>
                    <span className="text-[11px] font-medium text-slate-400 block py-6">Not Uploaded</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Aadhaar Back</span>
                    <span className="text-[11px] font-medium text-slate-400 block py-6">Not Uploaded</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">PAN Card</span>
                    <span className="text-[11px] font-medium text-slate-400 block py-6">Not Uploaded</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Editable Bank Form */
            <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    value={aadhaarNum}
                    onChange={(e) => setAadhaarNum(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNum}
                    onChange={(e) => setPanNum(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccountNum}
                    onChange={(e) => setBankAccountNum(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch</label>
                  <input
                    type="text"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Payee Name</label>
                  <input
                    type="text"
                    value={bankPayeeName}
                    onChange={(e) => setBankPayeeName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBank(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ================= TAB 9: ADD / DEDUCT MONEY ================= */}
      {activeTab === 'add_money' && (
        <form onSubmit={handleBalanceSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-sans">Adjust User Wallet Balance</h3>
              <p className="text-xs text-slate-500">Directly credit or debit funds to this user account with an audited note.</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-semibold block">Current Balance</span>
              <span className="font-mono font-black text-xl text-emerald-600">
                ₹ {walletBal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Credit vs Debit Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setIsCreditMode(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                isCreditMode ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              + Credit Wallet (Deposit)
            </button>
            <button
              type="button"
              onClick={() => setIsCreditMode(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                !isCreditMode ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              - Debit Wallet (Deduction)
            </button>
          </div>

          {/* Quick Amounts */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Quick Select Amount</label>
            <div className="flex flex-wrap gap-2">
              {[500, 1000, 2500, 5000, 10000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAddAmount(amt.toString())}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 font-mono font-bold text-xs text-slate-700 transition"
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Enter Amount (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-base outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Adjustment Reason / Audit Remark</label>
              <input
                type="text"
                placeholder="e.g. Deposit reconciliation / promotional reward"
                value={addReason}
                onChange={(e) => setAddReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition ${
                isCreditMode ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
              }`}
            >
              {isCreditMode ? 'Confirm Wallet Credit' : 'Confirm Wallet Debit'}
            </button>
          </div>
        </form>
      )}

      {/* ================= TAB 10: TOP-UP (Exact match to Screenshot 4) ================= */}
      {activeTab === 'topup' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-300/80 shadow-md space-y-6 animate-in fade-in-50 duration-150">
          {/* Header with Icon (Screenshot 4) */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200/60">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-sans">Account Top-up</h3>
              <p className="text-xs text-slate-500">Renew {currentUser.name}'s 2X returns limit</p>
            </div>
          </div>

          {/* Light Blue-Gray Callout Notice (Screenshot 4) */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-slate-600 leading-relaxed">
            If the user has reached their 2X exact limit, you can top-up their account here to reactivate their daily ROI and Level Income generation. This effectively acts as a fresh investment.
          </div>

          {/* Form (Screenshot 4) */}
          <form onSubmit={handleTopupSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Top-up Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter top-up amount"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-mono font-bold text-sm text-slate-900 placeholder:text-slate-400 placeholder:font-normal outline-hidden focus:border-[#70c028] focus:ring-1 focus:ring-[#70c028] transition"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 font-black text-xs shadow-md shadow-[#70c028]/25 transition"
              >
                Execute Account Top-Up
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL: ASSIGN NEW PLAN ================= */}
      {showAssignPlanModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1536] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base font-sans">Assign New Investment Plan</h3>
                <span className="text-xs text-slate-400">Allocate robotic yield node to {currentUser.name}</span>
              </div>
              <button
                onClick={() => setShowAssignPlanModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignPlan} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan Name</label>
                <select
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-semibold outline-hidden focus:ring-2 focus:ring-[#70c028]"
                >
                  <option value="Plan 1 (High Efficiency Yield)">Plan 1 (High Efficiency Yield - 8.5% ROI)</option>
                  <option value="Plan 2 (6.66% ROI with Security)">Plan 2 (6.66% ROI with Security)</option>
                  <option value="Plan 3 (Autonomous Titan Fleet)">Plan 3 (Autonomous Titan Fleet - 10.0% ROI)</option>
                  <option value="Plan 4 (Cybernetic Core Pro)">Plan 4 (Cybernetic Core Pro - 12.5% ROI)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Investment Amount (₹)</label>
                <input
                  type="number"
                  value={newPlanAmount}
                  onChange={(e) => setNewPlanAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold outline-hidden focus:ring-2 focus:ring-[#70c028]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Return Rate (%)</label>
                <input
                  type="text"
                  value={newPlanRoi}
                  onChange={(e) => setNewPlanRoi(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold outline-hidden focus:ring-2 focus:ring-[#70c028]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignPlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 font-black transition shadow-md shadow-[#70c028]/25"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
