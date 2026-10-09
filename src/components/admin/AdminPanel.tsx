import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvestmentProduct, Transaction, PlatformSettings, TeamMember, MemberPlanHolding, DailyWithdrawalLog } from '../../types';
import { 
  Shield, 
  ShieldCheck, 
  Key, 
  Lock, 
  Bot, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Check, 
  AlertCircle, 
  Coins, 
  Wallet, 
  CreditCard, 
  Clock, 
  Calendar, 
  RefreshCw, 
  Sliders, 
  User, 
  Users, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  ChevronDown,
  Search, 
  CheckCircle2,
  Eye,
  LogOut,
  TrendingUp,
  Activity,
  Layers,
  FileText
} from 'lucide-react';

import heroImage from '../../assets/images/hero_home_robot_1791407310783.jpg';
import planAImage from '../../assets/images/plan_a_micro_nao.jpg';
import planBImage from '../../assets/images/plan_b_spot_dog.jpg';
import planCImage from '../../assets/images/plan_c_asimo_biped.jpg';
import planDImage from '../../assets/images/plan_d_atlas_lab.jpg';
import planEImage from '../../assets/images/plan_e_titan_freight.jpg';
import planFImage from '../../assets/images/plan_f_valkyrie_hero.jpg';
import planGImage from '../../assets/images/plan_g_colossus_titan.jpg';

const PRESET_IMAGES = [
  { label: 'Nao Micro Assistant (Plan A)', url: planAImage },
  { label: 'Spot-X Quadruped Bot (Plan B)', url: planBImage },
  { label: 'ASIMO-V Kinetic Biped (Plan C)', url: planCImage },
  { label: 'Atlas Prime Diagnostics (Plan D)', url: planDImage },
  { label: 'Aurora Freight Titan (Plan E)', url: planEImage },
  { label: 'Valkyrie Sovereign (Plan F)', url: planFImage },
  { label: 'Omega Colossus Titan (Plan G)', url: planGImage },
  { label: 'Robovest HQ Cyber Fleet (Hero)', url: heroImage },
];

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const {
    user,
    catalog,
    investments,
    transactions,
    teamMembers,
    platformSettings,
    simulatedTime,
    addPlan,
    updatePlan,
    deletePlan,
    resetCatalogToDefault,
    updateUserProfile,
    adjustUserBalance,
    approveWithdrawal,
    rejectWithdrawal,
    cancelInvestment,
    updatePlatformSettings,
    resetPlatformSettings,
    advanceTimeToNextDayAfter1230,
    resetSimulatedTime,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    addMemberPlan,
    updateMemberPlan,
    deleteMemberPlan,
    resetTeamToDefault,
    getDailyWithdrawalLogs,
  } = useApp();

  // Authentication State
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<'plans' | 'network' | 'dailyWithdrawals' | 'withdrawals' | 'users' | 'orders' | 'settings'>('plans');

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Plan Edit/Create Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planFormData, setPlanFormData] = useState<InvestmentProduct>({
    id: '',
    name: '',
    tagline: '',
    robotModel: '',
    price: 1000,
    dailyIncome: 250,
    durationDays: 150,
    totalReturn: 37500,
    bonus: 100,
    minPurchase: 1,
    maxPurchase: 10,
    requiresPriorInvestment: false,
    image: planAImage,
    tier: 'Standard',
    specs: ['Autonomous Yield Node', 'AI Fleets 24/7', 'Instant Welcome Bonus'],
    badge: 'Popular',
    isActive: true,
  });

  const [specsInput, setSpecsInput] = useState('');
  const [planSearch, setPlanSearch] = useState('');

  // Referral / Network Member Filtering & Modal State
  const [networkSearch, setNetworkSearch] = useState('');
  const [networkLevelFilter, setNetworkLevelFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [selectedMemberForPlans, setSelectedMemberForPlans] = useState<TeamMember | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<TeamMember>({
    id: `TM-${Math.floor(100 + Math.random() * 900)}`,
    phone: '+91 98',
    joinDate: new Date().toISOString().slice(0, 10),
    level: 1,
    inviterId: 'User5294 (You)',
    inviteCount: 0,
    rechargeAmount: 520,
    teamInvested: 0,
    commissionGenerated: 114.4,
    status: 'ACTIVE',
    plans: []
  });

  // Adding Plan to Member Form State
  const [isAddingPlanToMember, setIsAddingPlanToMember] = useState(false);
  const [newPlanForMember, setNewPlanForMember] = useState<{
    planId: string;
    quantity: number;
    daysElapsed: number;
  }>({
    planId: 'A',
    quantity: 1,
    daysElapsed: 1,
  });

  // Daily Withdrawals Expanded Row State
  const [expandedDateRow, setExpandedDateRow] = useState<string | null>(null);

  // User Balance Form State
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [balanceReason, setBalanceReason] = useState<string>('');
  const [userFormData, setUserFormData] = useState({
    phone: user.phone,
    inviteCode: user.inviteCode,
    vipLevel: user.vipLevel,
    availableBalance: user.availableBalance,
    withdrawableBalance: user.withdrawableBalance,
    totalRecharge: user.totalRecharge,
    totalIncome: user.totalIncome,
    accountHolder: user.bankAccount.accountHolder,
    accountNumber: user.bankAccount.accountNumber,
    ifscCode: user.bankAccount.ifscCode,
    bankName: user.bankAccount.bankName,
    upiId: user.bankAccount.upiId || '',
    isBound: user.bankAccount.isBound,
  });

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState<PlatformSettings>({ ...platformSettings });

  // Handle Login
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === 'admin888' || pinInput === 'admin' || pinInput === '1234') {
      setIsAdminAuthenticated(true);
      setPinError('');
      showToast('Admin Console Unlocked! Welcome Administrator.');
    } else {
      setPinError('Invalid passcode. Hint: Use default PIN "admin888" or click Quick Access.');
    }
  };

  const handleQuickDemoAccess = () => {
    setIsAdminAuthenticated(true);
    setPinError('');
    showToast('Admin Console Unlocked via Quick Access.');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    showToast('Admin session locked.');
  };

  // Plan Management
  const handleOpenCreatePlan = () => {
    setEditingPlanId(null);
    const nextChar = String.fromCharCode(65 + catalog.length);
    const defaultId = catalog.some(p => p.id === nextChar) ? `PLAN-${catalog.length + 1}` : nextChar;
    
    setPlanFormData({
      id: defaultId,
      name: `Product ${defaultId}`,
      tagline: 'Autonomous AI Yield Robotic Fleet',
      robotModel: `Cybernetic Unit-${defaultId}01`,
      price: 1500,
      dailyIncome: 375,
      durationDays: 150,
      totalReturn: 56250,
      bonus: 100,
      minPurchase: 1,
      maxPurchase: 10,
      requiresPriorInvestment: false,
      image: planBImage,
      tier: 'Standard',
      specs: ['25.0% Daily ROI Yield', 'Autonomous Fleet Protocol', 'Instant ₹100 Cash Bonus'],
      badge: 'New Release',
      isActive: true,
    });
    setSpecsInput('25.0% Daily ROI Yield, Autonomous Fleet Protocol, Instant Cash Bonus');
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: InvestmentProduct) => {
    setEditingPlanId(plan.id);
    setPlanFormData({ ...plan });
    setSpecsInput(plan.specs ? plan.specs.join(', ') : '');
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormData.name || !planFormData.id) {
      showToast('Plan ID and Name are required.', 'error');
      return;
    }

    const parsedSpecs = specsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const finalPlan: InvestmentProduct = {
      ...planFormData,
      specs: parsedSpecs.length > 0 ? parsedSpecs : ['Autonomous Yield Node', 'High Efficiency ROI'],
      totalReturn: Number(planFormData.dailyIncome) * Number(planFormData.durationDays),
    };

    if (editingPlanId) {
      const res = updatePlan(editingPlanId, finalPlan);
      if (res.success) {
        showToast(res.message);
        setIsPlanModalOpen(false);
      } else {
        showToast(res.message, 'error');
      }
    } else {
      const res = addPlan(finalPlan);
      if (res.success) {
        showToast(res.message);
        setIsPlanModalOpen(false);
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (window.confirm(`Delete plan "${name}" (${id})?`)) {
      const res = deletePlan(id);
      showToast(res.message);
    }
  };

  // Add Member to Network
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addTeamMember({
      ...newMemberForm,
      rechargeAmount: Number(newMemberForm.rechargeAmount) || 0,
      inviteCount: Number(newMemberForm.inviteCount) || 0,
      teamInvested: Number(newMemberForm.teamInvested) || 0,
      commissionGenerated: Number(newMemberForm.commissionGenerated) || 0,
    });
    if (res.success) {
      showToast(res.message);
      setIsAddMemberModalOpen(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Add Plan to Selected Member
  const handleAddPlanToMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForPlans) return;

    const baseProduct = catalog.find(p => p.id === newPlanForMember.planId) || catalog[0];
    const qty = Number(newPlanForMember.quantity) || 1;
    const days = Number(newPlanForMember.daysElapsed) || 1;
    const totalInvest = baseProduct.price * qty;
    const dailyIncome = baseProduct.dailyIncome * qty;
    const earned = dailyIncome * days;

    const newHolding: MemberPlanHolding = {
      id: `MP-${Date.now().toString().slice(-5)}`,
      planId: baseProduct.id,
      planName: baseProduct.name,
      robotModel: baseProduct.robotModel,
      quantity: qty,
      unitPrice: baseProduct.price,
      totalInvested: totalInvest,
      dailyYield: dailyIncome,
      purchaseDate: new Date(Date.now() - 86400000 * days).toISOString().slice(0, 10),
      daysElapsed: days,
      durationDays: baseProduct.durationDays,
      totalEarned: earned,
      status: 'ACTIVE'
    };

    const res = addMemberPlan(selectedMemberForPlans.id, newHolding);
    if (res.success) {
      showToast(res.message);
      setIsAddingPlanToMember(false);
      // update local reference
      setSelectedMemberForPlans(prev => prev ? {
        ...prev,
        plans: [...(prev.plans || []), newHolding],
        rechargeAmount: prev.rechargeAmount + totalInvest
      } : null);
    }
  };

  // User Profile
  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      phone: userFormData.phone,
      inviteCode: userFormData.inviteCode,
      vipLevel: Number(userFormData.vipLevel),
      availableBalance: Number(userFormData.availableBalance),
      withdrawableBalance: Number(userFormData.withdrawableBalance),
      totalRecharge: Number(userFormData.totalRecharge),
      totalIncome: Number(userFormData.totalIncome),
      bankAccount: {
        accountHolder: userFormData.accountHolder,
        accountNumber: userFormData.accountNumber,
        ifscCode: userFormData.ifscCode,
        bankName: userFormData.bankName,
        upiId: userFormData.upiId,
        isBound: userFormData.isBound,
      }
    });
    showToast('User profile & bank details saved!');
  };

  const handleQuickAdjustBalance = (amount: number, reason: string) => {
    adjustUserBalance(amount, reason);
    setUserFormData(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance + amount),
      withdrawableBalance: Math.max(0, prev.withdrawableBalance + amount),
    }));
    showToast(`${amount > 0 ? 'Credited' : 'Debited'} ₹${Math.abs(amount).toLocaleString()} (${reason})`);
  };

  const handleCustomAdjustBalance = (isCredit: boolean) => {
    const val = parseFloat(balanceAmount);
    if (!val || val <= 0) {
      showToast('Please enter a valid positive amount.', 'error');
      return;
    }
    const finalAmount = isCredit ? val : -val;
    adjustUserBalance(finalAmount, balanceReason || (isCredit ? 'Manual Credit' : 'Manual Debit'));
    setUserFormData(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance + finalAmount),
      withdrawableBalance: Math.max(0, prev.withdrawableBalance + finalAmount),
    }));
    setBalanceAmount('');
    setBalanceReason('');
    showToast(`${isCredit ? 'Credited' : 'Debited'} ₹${val.toLocaleString()} successfully!`);
  };

  // Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(settingsFormData);
    showToast('Platform settings and withdrawal rules updated!');
  };

  // Calculations for summary metrics
  const dailyWithdrawalLogs = getDailyWithdrawalLogs();
  const pendingWithdrawals = transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PROCESSING');
  const allWithdrawalsSum = transactions
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const allFeesSum = transactions
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + (t.fee || 0), 0);
  const totalNetworkInvestment = teamMembers.reduce((sum, m) => sum + m.rechargeAmount, 0);

  // Filtered members list
  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = 
      m.phone.toLowerCase().includes(networkSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(networkSearch.toLowerCase()) ||
      (m.inviterId && m.inviterId.toLowerCase().includes(networkSearch.toLowerCase()));
    const matchesLevel = networkLevelFilter === 'ALL' || m.level === networkLevelFilter;
    return matchesSearch && matchesLevel;
  });

  // Filtered plans
  const filteredPlans = catalog.filter(p => 
    p.name.toLowerCase().includes(planSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(planSearch.toLowerCase()) ||
    p.robotModel.toLowerCase().includes(planSearch.toLowerCase()) ||
    (p.tier && p.tier.toLowerCase().includes(planSearch.toLowerCase()))
  );

  // ================= 1. AUTH GATE =================
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-xl font-black font-['Space_Grotesk'] tracking-wide">
              ADMIN CONTROL PANEL
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Robovest Autonomous Robotics Fleet Master Console
            </p>
          </div>

          <div className="p-6 space-y-4">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Administrator Master PIN
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Enter admin PIN (default: admin888)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 text-sm font-mono tracking-wider outline-hidden"
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Authorize & Access Admin Panel</span>
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink mx-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">or</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>One-Click Quick Access (No PIN Required)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold text-center transition"
            >
              Cancel and Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. FULL AUTHORIZED ADMIN PANEL =================
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col overflow-hidden text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-60 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold border ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-600 text-white border-emerald-500' 
              : 'bg-rose-600 text-white border-rose-500'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-950 text-white px-4 py-3 border-b border-slate-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base tracking-wider font-['Space_Grotesk']">
                ROBO<span className="text-blue-400">VEST</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                ADMIN CONSOLE
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5">
              Full Master Control: Plans, Referrals, Member Holdings, Daily Withdrawals & Rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogoutAdmin}
            title="Lock Admin Session"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Back to Live Website</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto">
          {/* Quick Metrics */}
          <div className="hidden md:block p-4 border-b border-slate-100 bg-slate-50">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              System Overview
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Catalog Plans</span>
                <span className="font-black text-slate-900 text-base">{catalog.length}</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Pending Payouts</span>
                <span className={`font-black text-base ${pendingWithdrawals.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {pendingWithdrawals.length}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 md:p-3 flex md:flex-col gap-1 w-full shrink-0">
            {/* 1. Plans */}
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'plans' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span>Investment Plans ({catalog.length})</span>
            </button>

            {/* 2. Referral Network & Plans Bought */}
            <button
              onClick={() => setActiveTab('network')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'network' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>Referral & Member Plans</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
                {teamMembers.length}
              </span>
            </button>

            {/* 3. Daily Withdrawal Log */}
            <button
              onClick={() => setActiveTab('dailyWithdrawals')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'dailyWithdrawals' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Daily Withdrawal Logs</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                {dailyWithdrawalLogs.length}d
              </span>
            </button>

            {/* 4. Single Withdrawals Queue */}
            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'withdrawals' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>All Transactions Queue</span>
              </div>
              {pendingWithdrawals.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {pendingWithdrawals.length}
                </span>
              )}
            </button>

            {/* 5. User & Wallet Control */}
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'users' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>User & Wallet Control</span>
            </button>

            {/* 6. Active Robots */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span>User Active Robots ({investments.length})</span>
            </button>

            {/* 7. Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Platform Rules & Settings</span>
            </button>
          </nav>

          {/* Time Simulator */}
          <div className="hidden md:block mt-auto p-3 m-3 rounded-2xl bg-slate-900 text-white text-xs border border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                Simulated Clock
              </span>
              <button
                onClick={() => {
                  resetSimulatedTime();
                  showToast('Simulated time reset to real-time.');
                }}
                className="text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-amber-300">
              {simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-slate-400">
              {simulatedTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button
              onClick={() => {
                advanceTimeToNextDayAfter1230();
                showToast('Fast forwarded to Next Day 12:35 AM.');
              }}
              className="mt-2 w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold transition"
            >
              Advance to Next Day 12:35 AM
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* ================= SECTION 1: REFERRAL NETWORK & PLANS BOUGHT TABLE (NEW) ================= */}
          {activeTab === 'network' && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Referral Network & Member Plans Audit</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track who invited whom, levels (L1/L2/L3), total invested, commissions, and every plan purchased with exact days elapsed.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search phone or ID..."
                      value={networkSearch}
                      onChange={(e) => setNetworkSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden w-40"
                    />
                  </div>

                  {/* Level Filter */}
                  <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                    {(['ALL', 1, 2, 3] as const).map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setNetworkLevelFilter(lvl)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          networkLevelFilter === lvl 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lvl === 'ALL' ? 'All' : `L${lvl}`}
                      </button>
                    ))}
                  </div>

                  {/* Add Member Button */}
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Member</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset network members to default sample dataset?')) {
                        resetTeamToDefault();
                        showToast('Team members reset.');
                      }
                    }}
                    title="Reset to default team"
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Network Members</span>
                  <span className="text-xl font-black text-slate-900 font-['Space_Grotesk']">{teamMembers.length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Member Recharges</span>
                  <span className="text-xl font-black text-blue-600 font-['Space_Grotesk']">₹{totalNetworkInvestment.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Level 1 Commission (22%)</span>
                  <span className="text-xl font-black text-emerald-600 font-['Space_Grotesk']">
                    ₹{teamMembers.filter(m => m.level === 1).reduce((s, m) => s + m.commissionGenerated, 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Active Robot Units</span>
                  <span className="text-xl font-black text-indigo-600 font-['Space_Grotesk']">
                    {teamMembers.reduce((s, m) => s + (m.plans?.reduce((pSum, p) => pSum + p.quantity, 0) || 0), 0)} Units
                  </span>
                </div>
              </div>

              {/* Clean, Orderly Referral Network Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                      <tr>
                        <th className="p-3.5">Member ID / Phone</th>
                        <th className="p-3.5">Level</th>
                        <th className="p-3.5">Invited By</th>
                        <th className="p-3.5">Referrals Made</th>
                        <th className="p-3.5">Total Invested</th>
                        <th className="p-3.5">Commission</th>
                        <th className="p-3.5">Plans Bought & Days Active</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredMembers.map((member) => {
                        const totalUnits = (member.plans || []).reduce((acc, p) => acc + p.quantity, 0);

                        return (
                          <tr key={member.id} className="hover:bg-slate-50/70 transition">
                            {/* Member Identity */}
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-slate-900 block">{member.phone}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {member.id} · Joined {member.joinDate}</span>
                            </td>

                            {/* Level Pill */}
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                                member.level === 1 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                member.level === 2 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                Level {member.level} ({member.level === 1 ? '22%' : member.level === 2 ? '2%' : '1%'})
                              </span>
                            </td>

                            {/* Inviter */}
                            <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                              {member.inviterId || 'Direct'}
                            </td>

                            {/* Referrals Made */}
                            <td className="p-3.5">
                              <span className="font-bold text-slate-900 block font-mono">
                                {member.inviteCount} {member.inviteCount === 1 ? 'person' : 'people'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Team Vol: ₹{member.teamInvested.toLocaleString()}
                              </span>
                            </td>

                            {/* Personal Investment */}
                            <td className="p-3.5">
                              <span className="font-black text-blue-600 font-mono text-sm block">
                                ₹{member.rechargeAmount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold">
                                Status: {member.status}
                              </span>
                            </td>

                            {/* Commission */}
                            <td className="p-3.5 font-bold font-mono text-emerald-600">
                              +₹{member.commissionGenerated.toLocaleString()}
                            </td>

                            {/* Plans Bought & Days Active */}
                            <td className="p-3.5 max-w-sm">
                              {(!member.plans || member.plans.length === 0) ? (
                                <span className="text-slate-400 text-[11px] italic">No active plans</span>
                              ) : (
                                <div className="space-y-1">
                                  {member.plans.map(p => (
                                    <div 
                                      key={p.id}
                                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono mr-1 mb-1"
                                    >
                                      <span className="font-bold text-blue-700">{p.planName}</span>
                                      <span className="text-slate-400">({p.quantity}u)</span>
                                      <span className="text-emerald-700 font-black">Day {p.daysElapsed}/{p.durationDays}</span>
                                    </div>
                                  ))}
                                  <div className="text-[10px] text-slate-400">
                                    Total: {totalUnits} units · ₹{(member.plans.reduce((s, p) => s + p.dailyYield, 0)).toLocaleString()}/day
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedMemberForPlans(member)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View & Edit Plans</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete member ${member.phone}?`)) {
                                      deleteTeamMember(member.id);
                                      showToast('Member deleted.');
                                    }
                                  }}
                                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                                  title="Delete member"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: DAILY WITHDRAWAL LOGS TABLE (NEW) ================= */}
          {activeTab === 'dailyWithdrawals' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>Daily Withdrawal Log & Payout Ledger</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Day-by-day record of how much money was requested, fees collected, and net disbursed to bank accounts.
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs font-mono">
                  All-Time Payouts: ₹{allWithdrawalsSum.toLocaleString()}
                </div>
              </div>

              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Requested (Gross)</span>
                  <span className="text-xl font-black text-slate-900 font-mono">₹{allWithdrawalsSum.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">10% Platform Fees Retained</span>
                  <span className="text-xl font-black text-blue-600 font-mono">₹{allFeesSum.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Money Disbursed</span>
                  <span className="text-xl font-black text-emerald-600 font-mono">₹{(allWithdrawalsSum - allFeesSum).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Review</span>
                  <span className={`text-xl font-black font-mono ${pendingWithdrawals.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                    ₹{pendingWithdrawals.reduce((s, t) => s + Math.abs(t.amount), 0).toLocaleString()} ({pendingWithdrawals.length})
                  </span>
                </div>
              </div>

              {/* Day-By-Day Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                      <tr>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Withdrawal Requests</th>
                        <th className="p-3.5">Gross Requested</th>
                        <th className="p-3.5">Fee Retained (10%)</th>
                        <th className="p-3.5">Net Disbursed</th>
                        <th className="p-3.5">Status Breakdown</th>
                        <th className="p-3.5 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {dailyWithdrawalLogs.map((log) => {
                        const isExpanded = expandedDateRow === log.date;

                        return (
                          <React.Fragment key={log.date}>
                            <tr className="hover:bg-slate-50/70 transition">
                              <td className="p-3.5 font-bold font-mono text-slate-900">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                  <span>{log.formattedDate}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 block font-normal">{log.date}</span>
                              </td>
                              <td className="p-3.5 font-bold font-mono">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px]">
                                  {log.totalRequests} {log.totalRequests === 1 ? 'request' : 'requests'}
                                </span>
                              </td>
                              <td className="p-3.5 font-black font-mono text-slate-900 text-sm">
                                ₹{log.totalRequested.toLocaleString()}
                              </td>
                              <td className="p-3.5 font-mono text-blue-600 font-bold">
                                ₹{log.totalFees.toLocaleString()}
                              </td>
                              <td className="p-3.5 font-mono text-emerald-600 font-black text-sm">
                                ₹{log.totalNet.toLocaleString()}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5 text-[11px] font-mono">
                                  {log.completedAmount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Done: ₹{log.completedAmount.toLocaleString()}
                                    </span>
                                  )}
                                  {log.processingAmount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                      Pending: ₹{log.processingAmount.toLocaleString()}
                                    </span>
                                  )}
                                  {log.rejectedAmount > 0 && (
                                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                                      Rejected: ₹{log.rejectedAmount.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => setExpandedDateRow(isExpanded ? null : log.date)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition inline-flex items-center gap-1"
                                >
                                  <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </button>
                              </td>
                            </tr>

                            {/* Nested Expandable Row: Individual Withdrawals for this Day */}
                            {isExpanded && (
                              <tr className="bg-slate-50/80">
                                <td colSpan={7} className="p-4 border-y border-slate-200">
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Individual Withdrawals for {log.formattedDate} ({log.transactions.length})</span>
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                                      {log.transactions.map(txn => (
                                        <div 
                                          key={txn.id}
                                          className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs"
                                        >
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="font-mono font-bold text-slate-900">{txn.id}</span>
                                              <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                                                txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                                txn.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800' :
                                                'bg-rose-100 text-rose-800'
                                              }`}>
                                                {txn.status}
                                              </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">{txn.description}</p>
                                            <span className="text-[10px] text-slate-400 font-mono">{txn.formattedTime}</span>
                                          </div>

                                          <div className="text-right">
                                            <div className="font-black text-sm text-slate-900 font-mono">
                                              ₹{Math.abs(txn.amount).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono">
                                              Net: ₹{(txn.netAmount || (Math.abs(txn.amount) - (txn.fee || 0))).toLocaleString()}
                                            </div>

                                            {txn.status === 'PROCESSING' && (
                                              <div className="flex items-center justify-end gap-1 mt-1">
                                                <button
                                                  onClick={() => {
                                                    const res = approveWithdrawal(txn.id);
                                                    showToast(res.message);
                                                  }}
                                                  className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                                                >
                                                  Approve
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    const reason = prompt('Rejection reason (refunds to user):', 'Incorrect bank details');
                                                    if (reason) {
                                                      const res = rejectWithdrawal(txn.id, reason);
                                                      showToast(res.message);
                                                    }
                                                  }}
                                                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px]"
                                                >
                                                  Reject
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 3: INVESTMENT PLANS CRUD ================= */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                    Robotics Investment Plans Catalog
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add new investment plans, modify prices, yields, durations, prerequisites, or remove plans.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search plans..."
                      value={planSearch}
                      onChange={(e) => setPlanSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden w-40 sm:w-56"
                    />
                  </div>

                  <button
                    onClick={handleOpenCreatePlan}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Plan</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Reset catalog back to the original default plans?')) {
                        resetCatalogToDefault();
                        showToast('Catalog restored to default.');
                      }
                    }}
                    title="Restore default catalog"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                        <img
                          src={plan.image}
                          alt={plan.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = planAImage;
                          }}
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-black">
                          {plan.id}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-black text-slate-900 text-sm truncate font-['Space_Grotesk']">
                            {plan.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase shrink-0">
                            {plan.tier || 'Standard'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{plan.robotModel}</p>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-base font-black text-blue-600 font-['Space_Grotesk']">
                            ₹{plan.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400">
                            /{plan.durationDays} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs bg-slate-50/50">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Daily Revenue:</span>
                        <span className="font-black text-emerald-600 font-mono">
                          ₹{plan.dailyIncome.toLocaleString()} / day
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Total Return:</span>
                        <span className="font-black text-blue-600 font-mono">
                          ₹{(plan.totalReturn || plan.dailyIncome * plan.durationDays).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Instant Bonus:</span>
                        <span className="font-bold text-amber-600 font-mono">
                          ₹{plan.bonus.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Prerequisite Lock:</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          plan.requiresPriorInvestment 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {plan.requiresPriorInvestment ? 'Requires Base Plan' : 'Unlocked (No Prereq)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEditPlan(plan)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Plan</span>
                      </button>

                      <button
                        onClick={() => handleDeletePlan(plan.id, plan.name)}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 4: ALL TRANSACTIONS & WITHDRAWALS QUEUE ================= */}
          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                    All Transactions Audit Trail
                  </h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive ledger across all transaction types.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                  Total Records: {transactions.length}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                      <tr>
                        <th className="p-3.5">ID / Time</th>
                        <th className="p-3.5">Type</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Fee & Net</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Description</th>
                        <th className="p-3.5 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {transactions.map((txn) => {
                        const isWithdrawal = txn.type === 'WITHDRAWAL';
                        const isProcessing = txn.status === 'PROCESSING';

                        return (
                          <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-slate-800 block">{txn.id}</span>
                              <span className="text-[10px] text-slate-400">{txn.formattedTime}</span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-md font-black text-[10px] uppercase ${
                                txn.type === 'WITHDRAWAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                txn.type === 'RECHARGE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                txn.type === 'PRODUCT_BONUS' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {txn.type}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold font-mono text-sm">
                              <span className={txn.amount < 0 ? 'text-amber-700' : 'text-emerald-600'}>
                                {txn.amount < 0 ? '-' : '+'}₹{Math.abs(txn.amount).toLocaleString()}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-xs">
                              {txn.netAmount ? (
                                <div>
                                  <span className="text-slate-800 font-bold">Net: ₹{txn.netAmount.toLocaleString()}</span>
                                  <span className="text-slate-400 text-[10px] block">Fee: ₹{txn.fee || 0}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                txn.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {txn.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600 max-w-xs truncate">
                              {txn.description}
                            </td>
                            <td className="p-3.5 text-right">
                              {isWithdrawal && isProcessing ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      const res = approveWithdrawal(txn.id);
                                      showToast(res.message);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Enter rejection reason:', 'Bank processing rejection');
                                      if (reason !== null) {
                                        const res = rejectWithdrawal(txn.id, reason);
                                        showToast(res.message);
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[11px] font-semibold">Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION 5: USER & WALLET CONTROL ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span>User Balance Direct Adjustment</span>
                  </h3>
                  <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                    Current: ₹{user.availableBalance.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-2">1-Click Quick Credits</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleQuickAdjustBalance(500, 'Admin +₹500 Bonus')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
                    >
                      +₹500 Credit
                    </button>
                    <button
                      onClick={() => handleQuickAdjustBalance(2100, 'Admin +₹2,100 Credit')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
                    >
                      +₹2,100 Credit
                    </button>
                    <button
                      onClick={() => handleQuickAdjustBalance(5000, 'Admin +₹5,000 Credit')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
                    >
                      +₹5,000 Credit
                    </button>
                    <button
                      onClick={() => handleQuickAdjustBalance(10000, 'Admin +₹10,000 Credit')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition"
                    >
                      +₹10,000 Credit
                    </button>
                    <button
                      onClick={() => handleQuickAdjustBalance(-1000, 'Admin -₹1,000 Adjustment')}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                    >
                      -₹1,000 Debit
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="number"
                    placeholder="Enter custom amount (₹)"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full sm:w-56 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Reason / Note (optional)"
                    value={balanceReason}
                    onChange={(e) => setBalanceReason(e.target.value)}
                    className="w-full sm:flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleCustomAdjustBalance(true)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      + Add Credit
                    </button>
                    <button
                      onClick={() => handleCustomAdjustBalance(false)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      - Debit
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Ledger Profile Form */}
              <form onSubmit={handleSaveUserProfile} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 font-['Space_Grotesk'] flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>User Profile & Banking Master Ledger</span>
                  </h3>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All User Data</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">User Identity</h4>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={userFormData.phone}
                        onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Invite Code</label>
                      <input
                        type="text"
                        value={userFormData.inviteCode}
                        onChange={(e) => setUserFormData({ ...userFormData, inviteCode: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">VIP Level (1 - 10)</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={userFormData.vipLevel}
                        onChange={(e) => setUserFormData({ ...userFormData, vipLevel: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Wallet Balances</h4>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Available Balance (₹)</label>
                      <input
                        type="number"
                        value={userFormData.availableBalance}
                        onChange={(e) => setUserFormData({ ...userFormData, availableBalance: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-blue-600 outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Withdrawable Balance (₹)</label>
                      <input
                        type="number"
                        value={userFormData.withdrawableBalance}
                        onChange={(e) => setUserFormData({ ...userFormData, withdrawableBalance: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-emerald-600 outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Total Recharge (₹)</label>
                      <input
                        type="number"
                        value={userFormData.totalRecharge}
                        onChange={(e) => setUserFormData({ ...userFormData, totalRecharge: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Total Income (₹)</label>
                      <input
                        type="number"
                        value={userFormData.totalIncome}
                        onChange={(e) => setUserFormData({ ...userFormData, totalIncome: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Bank & UPI Settlement</h4>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Holder Name</label>
                      <input
                        type="text"
                        value={userFormData.accountHolder}
                        onChange={(e) => setUserFormData({ ...userFormData, accountHolder: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={userFormData.bankName}
                        onChange={(e) => setUserFormData({ ...userFormData, bankName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Account Number</label>
                      <input
                        type="text"
                        value={userFormData.accountNumber}
                        onChange={(e) => setUserFormData({ ...userFormData, accountNumber: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={userFormData.ifscCode}
                        onChange={(e) => setUserFormData({ ...userFormData, ifscCode: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">UPI ID</label>
                      <input
                        type="text"
                        value={userFormData.upiId}
                        onChange={(e) => setUserFormData({ ...userFormData, upiId: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono outline-hidden bg-white"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ================= SECTION 6: USER ACTIVE ROBOTS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                    Active Robot Fleet Orders
                  </h2>
                  <p className="text-xs text-slate-500">
                    Currently deployed robotic units generating daily revenue for User5294.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                  {investments.length} Active Contracts
                </span>
              </div>

              {investments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  No active robot investments yet. User can purchase units from the catalog.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investments.map((inv) => (
                    <div key={inv.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm font-['Space_Grotesk']">{inv.productName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                              Qty: {inv.quantity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{inv.robotModel}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          inv.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Invested</span>
                          <span className="font-bold text-slate-800">₹{inv.totalInvested.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Daily Yield</span>
                          <span className="font-bold text-emerald-600">₹{inv.dailyIncome.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Bonus Given</span>
                          <span className="font-bold text-blue-600">₹{inv.bonusReceived.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-slate-400 text-[11px]">
                          Purchased: {inv.purchaseDateFormatted} ({inv.daysElapsed} days active)
                        </span>
                        {inv.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Mark contract ${inv.id} as completed?`)) {
                                cancelInvestment(inv.id);
                                showToast('Investment marked completed.');
                              }
                            }}
                            className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                          >
                            Terminate Contract
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 7: PLATFORM SETTINGS ================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-['Space_Grotesk']">
                    Platform Rules & Global Financial Policies
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set minimum deposit/withdrawal limits, withdrawal windows, fee percentage, and next-day lock rules.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all financial rules to factory defaults?')) {
                        resetPlatformSettings();
                        setSettingsFormData({
                          minRecharge: 520,
                          minWithdrawal: 150,
                          withdrawalFeePercent: 10,
                          dailyWithdrawalWindowStart: '00:30',
                          dailyWithdrawalWindowEnd: '17:00',
                          enforceNextDayWithdrawalLock: true,
                          telegramSupportUrl: 'https://t.me/robovest_support',
                          telegramChannelUrl: 'https://t.me/robovest_official',
                          platformAnnouncement: 'Autonomous Robotics Fleet v2.4 active.',
                        });
                        showToast('Settings reset to default.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Platform Settings</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <span>Deposit & Withdrawal Thresholds</span>
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Minimum Recharge Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsFormData.minRecharge}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, minRecharge: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard rule default: ₹520</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Minimum Withdrawal Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsFormData.minWithdrawal}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, minWithdrawal: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard rule default: ₹150</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Withdrawal Processing Fee Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={settingsFormData.withdrawalFeePercent}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, withdrawalFeePercent: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard deduction: 10% fee</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Time Window & Investment Lock Rules</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Daily Window Start (HH:MM)
                      </label>
                      <input
                        type="text"
                        value={settingsFormData.dailyWithdrawalWindowStart}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, dailyWithdrawalWindowStart: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 00:30 (12:30 AM)</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Daily Window End (HH:MM)
                      </label>
                      <input
                        type="text"
                        value={settingsFormData.dailyWithdrawalWindowEnd}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, dailyWithdrawalWindowEnd: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 17:00 (5:00 PM)</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Enforce Next-Day 12:30 AM Investment Lock
                        </span>
                        <p className="text-[11px] text-slate-500">
                          When active: Withdrawals for capital invested today lock until next day after 12:30 AM.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsFormData.enforceNextDayWithdrawalLock}
                        onChange={(e) => setSettingsFormData({ ...settingsFormData, enforceNextDayWithdrawalLock: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Telegram Channel Link
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.telegramChannelUrl}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, telegramChannelUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

        </main>
      </div>

      {/* ================= MODAL 1: MEMBER PLANS INSPECTION & ASSIGNMENT (NEW) ================= */}
      {selectedMemberForPlans && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black font-['Space_Grotesk'] tracking-wide">
                    {selectedMemberForPlans.phone} · Holdings Breakdown
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase">
                    Level {selectedMemberForPlans.level}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Member ID: {selectedMemberForPlans.id} · Invited by: {selectedMemberForPlans.inviterId || 'Direct'} · Downline Referrals: {selectedMemberForPlans.inviteCount} people
                </p>
              </div>
              <button
                onClick={() => setSelectedMemberForPlans(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Member Stats Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Self Investment</span>
                  <span className="font-black text-slate-900 font-mono text-sm">₹{selectedMemberForPlans.rechargeAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Team Volume</span>
                  <span className="font-black text-blue-600 font-mono text-sm">₹{selectedMemberForPlans.teamInvested.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Commission Generated</span>
                  <span className="font-black text-emerald-600 font-mono text-sm">₹{selectedMemberForPlans.commissionGenerated.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Plan Units</span>
                  <span className="font-black text-indigo-600 font-mono text-sm">
                    {(selectedMemberForPlans.plans || []).reduce((s, p) => s + p.quantity, 0)} Units
                  </span>
                </div>
              </div>

              {/* Plans Table */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-black text-slate-900 text-sm font-['Space_Grotesk'] flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>Purchased Plans & Day Elapsed Progression</span>
                  </h4>
                  <button
                    onClick={() => setIsAddingPlanToMember(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Assign New Plan</span>
                  </button>
                </div>

                {(!selectedMemberForPlans.plans || selectedMemberForPlans.plans.length === 0) ? (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400">
                    No active plans for this member. Click "+ Assign New Plan" to grant an investment plan.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-3">Plan / Robot</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Invested</th>
                          <th className="p-3">Daily Yield</th>
                          <th className="p-3">Days Active / Remaining</th>
                          <th className="p-3">Earned So Far</th>
                          <th className="p-3 text-right">Edit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedMemberForPlans.plans.map(p => {
                          const remainingDays = Math.max(0, p.durationDays - p.daysElapsed);
                          const progressPercent = Math.min(100, Math.round((p.daysElapsed / p.durationDays) * 100));

                          return (
                            <tr key={p.id} className="hover:bg-slate-50 transition">
                              <td className="p-3 font-bold text-slate-900">
                                <span className="block font-black">{p.planName}</span>
                                <span className="text-[10px] text-slate-400">{p.robotModel}</span>
                              </td>
                              <td className="p-3 font-mono font-bold">
                                {p.quantity} {p.quantity === 1 ? 'unit' : 'units'}
                              </td>
                              <td className="p-3 font-mono font-bold text-blue-600">
                                ₹{p.totalInvested.toLocaleString()}
                              </td>
                              <td className="p-3 font-mono font-bold text-emerald-600">
                                ₹{p.dailyYield.toLocaleString()}/day
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="font-bold text-emerald-700">Day {p.daysElapsed}</span>
                                    <span className="text-slate-400">{remainingDays}d left</span>
                                  </div>
                                  <div className="w-32 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-blue-600 h-full rounded-full transition-all"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-mono font-bold text-emerald-600">
                                ₹{p.totalEarned.toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => {
                                      const newDays = prompt(`Edit days elapsed for ${p.planName} (Current: ${p.daysElapsed}):`, p.daysElapsed.toString());
                                      if (newDays !== null) {
                                        const parsed = parseInt(newDays, 10);
                                        if (!isNaN(parsed) && parsed >= 0) {
                                          updateMemberPlan(selectedMemberForPlans.id, p.id, {
                                            daysElapsed: parsed,
                                            totalEarned: p.dailyYield * parsed
                                          });
                                          setSelectedMemberForPlans(prev => prev ? {
                                            ...prev,
                                            plans: (prev.plans || []).map(item => item.id === p.id ? {
                                              ...item,
                                              daysElapsed: parsed,
                                              totalEarned: p.dailyYield * parsed
                                            } : item)
                                          } : null);
                                          showToast('Days elapsed updated.');
                                        }
                                      }
                                    }}
                                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px]"
                                  >
                                    Adjust Days
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Remove plan ${p.planName} from member?`)) {
                                        deleteMemberPlan(selectedMemberForPlans.id, p.id);
                                        setSelectedMemberForPlans(prev => prev ? {
                                          ...prev,
                                          plans: (prev.plans || []).filter(item => item.id !== p.id),
                                          rechargeAmount: prev.rechargeAmount - p.totalInvested
                                        } : null);
                                        showToast('Plan removed.');
                                      }
                                    }}
                                    className="p-1 rounded text-rose-500 hover:bg-rose-50"
                                    title="Delete plan"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Assign New Plan Sub-Form */}
              {isAddingPlanToMember && (
                <form onSubmit={handleAddPlanToMember} className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-black text-blue-950 text-xs font-['Space_Grotesk']">
                      Grant & Assign Plan to {selectedMemberForPlans.phone}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsAddingPlanToMember(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Select Plan</label>
                      <select
                        value={newPlanForMember.planId}
                        onChange={(e) => setNewPlanForMember({ ...newPlanForMember, planId: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white outline-hidden"
                      >
                        {catalog.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} - ₹{c.price.toLocaleString()} (₹{c.dailyIncome}/day)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Quantity (Units)</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={newPlanForMember.quantity}
                        onChange={(e) => setNewPlanForMember({ ...newPlanForMember, quantity: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold bg-white outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Days Elapsed (Already active)</label>
                      <input
                        type="number"
                        min={0}
                        max={150}
                        value={newPlanForMember.daysElapsed}
                        onChange={(e) => setNewPlanForMember({ ...newPlanForMember, daysElapsed: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold bg-white outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                  >
                    Confirm & Grant Plan to Member
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD TEAM MEMBER MODAL ================= */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-black font-['Space_Grotesk']">Add New Referral Member</h3>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-5 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Member ID</label>
                <input
                  type="text"
                  value={newMemberForm.id}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, id: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                  placeholder="+91 98..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hierarchy Level</label>
                  <select
                    value={newMemberForm.level}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, level: Number(e.target.value) as 1 | 2 | 3 })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value={1}>Level 1 (22% Comm)</option>
                    <option value={2}>Level 2 (2% Comm)</option>
                    <option value={3}>Level 3 (1% Comm)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Invited By</label>
                  <input
                    type="text"
                    value={newMemberForm.inviterId}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, inviterId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Referrals Made</label>
                  <input
                    type="number"
                    value={newMemberForm.inviteCount}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, inviteCount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recharge Amount (₹)</label>
                  <input
                    type="number"
                    value={newMemberForm.rechargeAmount}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, rechargeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 font-mono font-bold text-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: PLAN CREATE / EDIT MODAL ================= */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-['Space_Grotesk'] tracking-wide">
                  {editingPlanId ? `Edit Plan ${editingPlanId}` : 'Create New Robotic Investment Plan'}
                </h3>
                <p className="text-xs text-slate-300">
                  {editingPlanId ? 'Modify price, daily ROI yield, duration, or specifications' : 'Define robot specifications, returns, and tier'}
                </p>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Identifier (ID)</label>
                  <input
                    type="text"
                    disabled={!!editingPlanId}
                    value={planFormData.id}
                    onChange={(e) => setPlanFormData({ ...planFormData, id: e.target.value.toUpperCase() })}
                    placeholder="e.g. H, TITAN-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 disabled:bg-slate-100 font-mono font-bold uppercase outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Unique identifier for this plan</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Display Name</label>
                  <input
                    type="text"
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                    placeholder="e.g. Product H"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Robot Model Name</label>
                  <input
                    type="text"
                    value={planFormData.robotModel}
                    onChange={(e) => setPlanFormData({ ...planFormData, robotModel: e.target.value })}
                    placeholder="e.g. Genesis Unit-X Quantum Biped"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marketing Tagline</label>
                  <input
                    type="text"
                    value={planFormData.tagline}
                    onChange={(e) => setPlanFormData({ ...planFormData, tagline: e.target.value })}
                    placeholder="e.g. Next-Gen Autonomous High Frequency Node"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Investment Price (₹)</label>
                  <input
                    type="number"
                    value={planFormData.price}
                    onChange={(e) => setPlanFormData({ ...planFormData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-blue-600 outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daily Income Yield (₹)</label>
                  <input
                    type="number"
                    value={planFormData.dailyIncome}
                    onChange={(e) => setPlanFormData({ ...planFormData, dailyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-emerald-600 outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contract Duration (Days)</label>
                  <input
                    type="number"
                    value={planFormData.durationDays}
                    onChange={(e) => setPlanFormData({ ...planFormData, durationDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Instant Cash Bonus (₹)</label>
                  <input
                    type="number"
                    value={planFormData.bonus}
                    onChange={(e) => setPlanFormData({ ...planFormData, bonus: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-amber-600 outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tier / Class</label>
                  <select
                    value={planFormData.tier}
                    onChange={(e) => setPlanFormData({ ...planFormData, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Elite">Elite</option>
                    <option value="Quantum Apex">Quantum Apex</option>
                    <option value="VIP Elite">VIP Elite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Corner Ribbon Badge</label>
                  <input
                    type="text"
                    value={planFormData.badge || ''}
                    onChange={(e) => setPlanFormData({ ...planFormData, badge: e.target.value })}
                    placeholder="e.g. ★ POPULAR, ⚡ HIGH GROWTH"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Requires Prior Foundational Investment</span>
                  <p className="text-[11px] text-slate-500">
                    If checked, users must hold at least one foundational plan (Product A, B, C, or D) to purchase this plan.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={planFormData.requiresPriorInvestment}
                  onChange={(e) => setPlanFormData({ ...planFormData, requiresPriorInvestment: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Select Robot Avatar Image</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPlanFormData({ ...planFormData, image: preset.url })}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        planFormData.image === preset.url 
                          ? 'border-blue-600 ring-2 ring-blue-500/30' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      {planFormData.image === preset.url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Key Specifications (comma-separated)</label>
                <input
                  type="text"
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  placeholder="e.g. 25% Daily Yield, Automated AI Fleet, Instant Bonus"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/25 transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPlanId ? 'Save Changes' : 'Create Plan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
