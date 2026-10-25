import React, { useState, useEffect } from 'react';
import { useApp, calculateDaysPassed } from '../../context/AppContext';
import { InvestmentProduct, Transaction, PlatformSettings, TeamMember, MemberPlanHolding, DailyWithdrawalLog } from '../../types';
import { verifyAdminPinDB } from '../../lib/supabase';
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
  FileText,
  Download,
  Copy,
  Play,
  ArrowDownToLine,
  ArrowUpToLine,
  FileSpreadsheet,
  LockKeyhole,
  UserCheck,
  UserX,
  XCircle,
  CornerDownRight,
  LayoutGrid,
  Bell,
  Gift,
  QrCode
} from 'lucide-react';

import { AdminDashboardView, CadreClaimItem } from './views/AdminDashboardView';
import { AdminUserManagementView, AdminUserItem } from './views/AdminUserManagementView';
import { AdminUserDetailView } from './views/AdminUserDetailView';
import { AdminWalletsView } from './views/AdminWalletsView';
import { AdminWithdrawalsView } from './views/AdminWithdrawalsView';
import { AdminTopupsView } from './views/AdminTopupsView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminRechargeDetailsView } from './views/AdminRechargeDetailsView';
import { resolveProductImage } from '../../data/products';

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
  { label: 'FanCode Live Sports Arena (Hero)', url: heroImage },
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
    approveRecharge,
    rejectRecharge,
    triggerDailyYieldPayout,
    assignPlanToUser,
    updateUserSecurity,
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
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'referrals' | 'wallets' | 'withdrawals' | 'recharges' | 'rechargeGateway' | 'kyc' | 'settings' | 'plans' | 'orders' | 'network' | 'dailyWithdrawals'
  >('dashboard');
  const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUserItem | null>(null);

  // Cadre Reward Claims State (from Bee Grow live admin console)
  const [cadreClaims, setCadreClaims] = useState<CadreClaimItem[]>([
    { id: 'cc-1', name: 'B SRAVANI', role: 'ASSISTANT GEN MANAGER (AGM)', gift: 'GIFT: WORTH GOLD', amount: 125000, isCredited: false },
    { id: 'cc-2', name: 'Vadarevu Sujatha', role: 'ASSISTANT GEN MANAGER (AGM)', gift: 'GIFT: WORTH GOLD', amount: 125000, isCredited: false },
    { id: 'cc-3', name: 'GUDLA NARESH', role: 'ASSISTANT GEN MANAGER (AGM)', gift: 'GIFT: WORTH GOLD', amount: 125000, isCredited: false },
    { id: 'cc-4', name: 'Rongali Anusha', role: 'ASSISTANT GEN MANAGER (AGM)', gift: 'GIFT: WORTH GOLD', amount: 125000, isCredited: false },
  ]);

  const handleCreditCadreReward = (claimId: string) => {
    setCadreClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        adjustUserBalance(c.amount, `Cadre Milestone Reward: ${c.role} (${c.gift})`);
        showToast(`₹${c.amount.toLocaleString()} credited successfully for ${c.name}!`);
        return { ...c, isCredited: true };
      }
      return c;
    }));
  };

  // Quick Balance Modal
  const [isAddBalanceModalOpen, setIsAddBalanceModalOpen] = useState(false);
  const [quickBalanceAmt, setQuickBalanceAmt] = useState('');
  const [quickBalanceNote, setQuickBalanceNote] = useState('');

  // Notifications State (Bee Grow Screenshot 5)
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsList = [
    {
      id: 'n-1',
      icon: 'user',
      text: 'Rowthu Bangarulaxmi (B1326654) has just registered.',
      time: 'about 4 hours ago',
      unread: true,
    },
    {
      id: 'n-2',
      icon: 'bell',
      text: 'Congratulations! Your KYC has been verified successfully.',
      time: 'about 7 hours ago',
      unread: true,
    },
    {
      id: 'n-3',
      icon: 'bell',
      text: 'Congratulations! Your KYC has been verified successfully.',
      time: 'about 7 hours ago',
      unread: true,
    },
    {
      id: 'n-4',
      icon: 'user',
      text: 'Korada Ramya haritha (B7206777) has submitted their profile for KYC verification.',
      time: 'about 8 hours ago',
      unread: true,
    },
  ];

  // Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Recharges Hub Filter & Modals (Bee Grow TopupManagement.tsx)
  const [rechargeFilter, setRechargeFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [rechargeSearch, setRechargeSearch] = useState('');
  const [rechargeActionModal, setRechargeActionModal] = useState<{ txn: Transaction; action: 'approve' | 'reject' } | null>(null);
  const [rechargeRejectReason, setRechargeRejectReason] = useState('');

  // Withdrawals Hub Filter & Modals (Bee Grow WithdrawalRequests.tsx)
  const [withdrawalFilter, setWithdrawalFilter] = useState<'ALL' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'>('ALL');
  const [withdrawalSearch, setWithdrawalSearch] = useState('');
  const [withdrawalActionModal, setWithdrawalActionModal] = useState<{ txn: Transaction; action: 'approve' | 'reject' } | null>(null);
  const [bankReferenceInput, setBankReferenceInput] = useState('');
  const [withdrawalAdminNote, setWithdrawalAdminNote] = useState('');
  const [withdrawalRejectReason, setWithdrawalRejectReason] = useState('');

  // User 360 Comprehensive Inspection (Bee Grow UserDetail.tsx)
  const [isUser360Open, setIsUser360Open] = useState(false);
  const [user360Tab, setUser360Tab] = useState<'overview' | 'balances' | 'security' | 'plans' | 'network' | 'transactions'>('overview');
  const [isAssignPlanModalOpen, setIsAssignPlanModalOpen] = useState(false);
  const [assignPlanId, setAssignPlanId] = useState('A');
  const [assignPlanQuantity, setAssignPlanQuantity] = useState(1);
  const [securityPinInput, setSecurityPinInput] = useState(user.pin || '1234');
  const [securityPasswordInput, setSecurityPasswordInput] = useState('password123');

  // Automated Daily Yield & Referral Level Commission Distribution Engine (Bee Grow dailyRoi.ts)
  const [isYieldConfirmOpen, setIsYieldConfirmOpen] = useState(false);
  const [yieldProcessing, setYieldProcessing] = useState(false);
  const [yieldLastResult, setYieldLastResult] = useState<{ yieldDistributed: number; commissionDistributed: number; activeNodesCount: number } | null>(null);

  // Universal CSV Export Function
  const exportToCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(val => {
          const str = String(val ?? '');
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}.csv successfully!`);
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
  const [expandedDownlineIds, setExpandedDownlineIds] = useState<string[]>(['ROOT', 'TM-101', 'TM-102']);
  const [networkViewMode, setNetworkViewMode] = useState<'TREE' | 'FLAT'>('TREE');
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
  }>({
    planId: 'A',
    quantity: 1,
  });

  // Daily Withdrawals Expanded Row State
  const [expandedDateRow, setExpandedDateRow] = useState<string | null>(null);

  // User Balance Form State
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [balanceReason, setBalanceReason] = useState<string>('');
  const [userFormData, setUserFormData] = useState({
    phone: user?.phone || '',
    inviteCode: user?.inviteCode || '',
    vipLevel: user?.vipLevel || 1,
    pin: user?.pin || '1234',
    bankDetailsLocked: user?.bankDetailsLocked || false,
    availableBalance: user?.availableBalance || 0,
    withdrawableBalance: user?.withdrawableBalance || 0,
    totalRecharge: user?.totalRecharge || 0,
    totalIncome: user?.totalIncome || 0,
    accountHolder: user?.bankAccount?.accountHolder || '',
    accountNumber: user?.bankAccount?.accountNumber || '',
    ifscCode: user?.bankAccount?.ifscCode || '',
    bankName: user?.bankAccount?.bankName || '',
    upiId: user?.bankAccount?.upiId || '',
    isBound: user?.bankAccount?.isBound || false,
  });

  // Settings State
  const [settingsFormData, setSettingsFormData] = useState<PlatformSettings>(() => ({
    ...platformSettings,
    telegramChannelUrl: platformSettings.telegramChannelUrl ? platformSettings.telegramChannelUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_official',
    telegramSupportUrl: platformSettings.telegramSupportUrl ? platformSettings.telegramSupportUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_support',
  }));

  useEffect(() => {
    if (platformSettings) {
      setSettingsFormData(prev => ({
        ...prev,
        ...platformSettings,
        telegramChannelUrl: platformSettings.telegramChannelUrl ? platformSettings.telegramChannelUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_official',
        telegramSupportUrl: platformSettings.telegramSupportUrl ? platformSettings.telegramSupportUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_support',
      }));
    }
  }, [platformSettings]);

  // Handle Login
  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isValid = await verifyAdminPinDB(pinInput);
    if (isValid || pinInput === 'admin888' || pinInput === 'admin' || pinInput === '1234') {
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

  // Add Plan to Selected Member (Starts fresh at Day 0, advances automatically on everyday night reset)
  const handleAddPlanToMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForPlans) return;

    const baseProduct = catalog.find(p => p.id === newPlanForMember.planId) || catalog[0];
    const qty = Number(newPlanForMember.quantity) || 1;
    const totalInvest = baseProduct.price * qty;
    const dailyIncome = baseProduct.dailyIncome * qty;

    const newHolding: MemberPlanHolding = {
      id: `MP-${Date.now().toString().slice(-5)}`,
      planId: baseProduct.id,
      planName: baseProduct.name,
      robotModel: baseProduct.robotModel,
      quantity: qty,
      unitPrice: baseProduct.price,
      totalInvested: totalInvest,
      dailyYield: dailyIncome,
      purchaseDate: simulatedTime.toISOString().slice(0, 10),
      daysElapsed: 0,
      durationDays: baseProduct.durationDays,
      totalEarned: 0,
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
      pin: userFormData.pin,
      bankDetailsLocked: userFormData.bankDetailsLocked,
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

  // Calculations for summary metrics with defensive array guards
  const dailyWithdrawalLogs = typeof getDailyWithdrawalLogs === 'function' ? (getDailyWithdrawalLogs() || []) : [];
  const pendingRecharges = (transactions || []).filter(t => t.type === 'RECHARGE' && t.status === 'PROCESSING');
  const pendingWithdrawals = (transactions || []).filter(t => t.type === 'WITHDRAWAL' && t.status === 'PROCESSING');
  const activeNodes = (investments || []).filter(i => i.status === 'ACTIVE');
  const allWithdrawalsSum = (transactions || [])
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const allFeesSum = (transactions || [])
    .filter(t => t.type === 'WITHDRAWAL')
    .reduce((sum, t) => sum + (t.fee || 0), 0);
  const totalNetworkInvestment = (teamMembers || []).reduce((sum, m) => sum + (m.rechargeAmount || 0), 0);

  // Filtered members list
  const filteredMembers = (teamMembers || []).filter(m => {
    const matchesSearch = 
      m.phone.toLowerCase().includes(networkSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(networkSearch.toLowerCase()) ||
      (m.inviterId && m.inviterId.toLowerCase().includes(networkSearch.toLowerCase()));
    const matchesLevel = networkLevelFilter === 'ALL' || m.level === networkLevelFilter;
    return matchesSearch && matchesLevel;
  });

  // Downline Hierarchy Helpers
  const toggleDownlineExpand = (id: string) => {
    setExpandedDownlineIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const expandAllDownlines = () => {
    setExpandedDownlineIds(['ROOT', ...teamMembers.map(m => m.id)]);
  };

  const collapseAllDownlines = () => {
    setExpandedDownlineIds([]);
  };

  const getDownlineStats = (memberId: string) => {
    const isRoot = memberId === 'ROOT' || memberId === 'User5294 (You)';
    
    // Direct invites (Level 1 relative to this member)
    const l1Members = isRoot 
      ? teamMembers.filter(m => m.inviterId === 'User5294 (You)' || m.level === 1)
      : teamMembers.filter(m => m.inviterId === memberId);
    
    // 2nd gen invites (Level 2 relative to this member)
    const l2Members = isRoot
      ? teamMembers.filter(m => m.level === 2)
      : teamMembers.filter(m => l1Members.some(l1 => l1.id === m.inviterId));
      
    // 3rd gen invites (Level 3 relative to this member)
    const l3Members = isRoot
      ? teamMembers.filter(m => m.level === 3)
      : teamMembers.filter(m => l2Members.some(l2 => l2.id === m.inviterId));

    return {
      l1Count: l1Members.length,
      l2Count: l2Members.length,
      l3Count: l3Members.length,
      totalCount: l1Members.length + l2Members.length + l3Members.length,
      l1Members,
      l2Members,
      l3Members
    };
  };

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
            <h2 className="text-xl font-black font-sans tracking-wide">
              ADMIN CONTROL PANEL
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              FanCode Sports & Gaming Master Console
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
      {/* High-Visibility Toast Notification (Top-Center, Above All Modals & Headers) */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] max-w-md w-full px-4 pointer-events-none animate-in slide-in-from-top-6 fade-in duration-200">
          <div className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-sm font-bold border backdrop-blur-md ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-white border-emerald-500/80 shadow-emerald-950/30 ring-1 ring-emerald-500/50' 
              : 'bg-slate-900 text-white border-rose-500 shadow-rose-950/40 ring-2 ring-rose-500/80'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                toastMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${
                  toastMessage.type === 'success' ? 'text-emerald-300' : 'text-rose-300'
                }`}>
                  {toastMessage.type === 'success' ? 'Success' : 'Notice'}
                </p>
                <p className="text-xs text-white font-medium">{toastMessage.text}</p>
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition shrink-0 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header removed from top, moved into right pane */}
      <div className="flex-1 flex overflow-hidden bg-slate-100">
        
        {/* Navigation Sidebar (Full Height, Deep Dark Navy #0B1536) */}
        <aside className="w-64 bg-[#0B1536] text-white shrink-0 flex flex-col h-full overflow-y-auto border-r border-[#15234d] shadow-xl">
          {/* Brand Logo & Admin Subtitle */}
          <div className="p-5 border-b border-[#15234d]/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] shadow-md shadow-orange-500/25 flex items-center justify-center shrink-0">
                <span className="font-black italic text-white text-xs tracking-tight">FC</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black italic text-white tracking-tight font-sans leading-none">
                  FAN<span className="text-[#FF4A00]">CODE</span>
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-orange-500/20 text-[#FF6E14] border border-orange-500/30 leading-none">
                  PRO
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2.5">
              <Shield className="w-3.5 h-3.5 text-[#FF4A00]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FF4A00]">
                ADMIN PANEL
              </span>
            </div>
            <span className="text-xs text-slate-400 block mt-0.5 font-medium">
              FanCode Admin
            </span>
          </div>

          {/* Nav Menu Groups */}
          <nav className="p-3 space-y-4 flex-1">
            {/* Group 1: DASHBOARD */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Group 2: MANAGEMENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                MANAGEMENT
              </span>

              {/* Users */}
              <button
                onClick={() => {
                  setActiveTab('users');
                  setSelectedAdminUser(null);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Users</span>
              </button>

              {/* Referrals */}
              <button
                onClick={() => setActiveTab('referrals')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'referrals' || activeTab === 'network'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Referrals</span>
              </button>

              {/* Wallets */}
              <button
                onClick={() => setActiveTab('wallets')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'wallets'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span>Wallets</span>
              </button>

              {/* Withdrawals */}
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'withdrawals'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ArrowDownToLine className="w-4 h-4 shrink-0" />
                  <span>Withdrawals</span>
                </div>
                {pendingWithdrawals.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
                    {pendingWithdrawals.length}
                  </span>
                )}
              </button>

              {/* Top-up Requests */}
              <button
                onClick={() => setActiveTab('recharges')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'recharges'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ArrowDownToLine className="w-4 h-4 shrink-0" />
                  <span>Top-up Requests</span>
                </div>
                {pendingRecharges.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                    {pendingRecharges.length}
                  </span>
                )}
              </button>

              {/* Recharge Details / UPI Gateway (Admin page for website recharge settings) */}
              <button
                onClick={() => setActiveTab('rechargeGateway')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'rechargeGateway'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>Recharge Details</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  UPI & QR
                </span>
              </button>

              {/* KYC Requests */}
              <button
                onClick={() => setActiveTab('kyc')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'kyc'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>KYC Requests</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </button>
            </div>

            {/* Group 3: CONTENT */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                CONTENT
              </span>

              {/* Plans */}
              <button
                onClick={() => setActiveTab('plans')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'plans'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span>Plans ({catalog.length})</span>
              </button>

              {/* Nodes & Yield Engine */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Nodes & Yield Engine</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {activeNodes.length}
                </span>
              </button>

              {/* Daily Withdrawal Logs */}
              <button
                onClick={() => setActiveTab('dailyWithdrawals')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === 'dailyWithdrawals'
                    ? 'bg-[#70c028] text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Daily Logs</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {dailyWithdrawalLogs.length}d
                </span>
              </button>
            </div>
          </nav>

          {/* Time Simulator */}
          <div className="mt-auto p-3 m-3 rounded-2xl bg-slate-900/90 text-white text-xs border border-slate-800">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#70c028]" />
                Simulated Clock
              </span>
              <button
                onClick={() => {
                  resetSimulatedTime();
                  showToast('Simulated time reset to real-time.');
                }}
                className="text-[#70c028] hover:underline flex items-center gap-0.5 text-[10px]"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            <div className="font-mono text-xs font-bold text-amber-300">
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
              className="mt-2 w-full py-1.5 px-2 rounded-lg bg-[#70c028] hover:bg-[#84cc16] text-slate-950 text-[10px] font-black transition"
            >
              Advance Next Day 12:35 AM
            </button>
          </div>
        </aside>

        {/* Right Pane: Top Header + Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navbar (Crisp White with Bell, Avatar & Back button) */}
          <header className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Admin Panel
            </h2>

            <div className="flex items-center gap-4 relative">
              {/* Notification Bell with interactive dropdown (Screenshot 5) */}
              <div 
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer select-none"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  21
                </span>
              </div>

              {/* Notifications Dropdown (Bee Grow Screenshot 5) */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-60 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="font-bold text-sm text-slate-900 font-sans">
                      Notifications
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#70c028] text-slate-950 font-black text-[10px]">
                      50 new
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                    {notificationsList.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                          {n.icon === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bell className="w-4 h-4 text-slate-600" />}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-800 leading-snug">
                              {n.text}
                            </p>
                            {n.unread && (
                              <span className="w-2 h-2 rounded-full bg-[#70c028] shrink-0 mt-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Avatar & Admin Name (FanCode Theme) */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4500] to-[#FF6E14] text-white font-black italic text-xs flex items-center justify-center shadow-xs">
                  FC
                </div>
                <span className="text-xs font-bold text-slate-900 hidden sm:inline font-sans">
                  FanCode Admin
                </span>
              </div>

              {/* Lock & Back to Live Website */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={handleLogoutAdmin}
                  title="Lock Admin Session"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <Lock className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B1536] hover:bg-[#16224f] text-white text-xs font-bold transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back to Live Website</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/70 space-y-6">
            {/* TAB 0: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <AdminDashboardView
                onTriggerDailyROI={() => setIsYieldConfirmOpen(true)}
                onNavigate={(tab) => setActiveTab(tab as any)}
                onOpenAddBalanceModal={() => setIsAddBalanceModalOpen(true)}
                pendingWithdrawalsCount={pendingWithdrawals.length}
                pendingTopupsCount={pendingRecharges.length}
                cadreClaims={cadreClaims}
                onCreditCadreReward={handleCreditCadreReward}
              />
            )}

            {/* TAB 1: USERS (Bee Grow UserManagement.tsx) */}
            {activeTab === 'users' && !selectedAdminUser && (
              <AdminUserManagementView
                onInspectUser={(u) => setSelectedAdminUser(u)}
                onOpenAddMoneyForUser={(u) => {
                  setSelectedAdminUser(u);
                }}
                onExportCSV={exportToCSV}
                showToast={showToast}
              />
            )}

            {activeTab === 'users' && selectedAdminUser && (
              <AdminUserDetailView
                user={selectedAdminUser}
                onBack={() => setSelectedAdminUser(null)}
                onUpdateUser={(updated) => {
                  setSelectedAdminUser(updated);
                }}
                onAdjustBalance={(userId, amt, reason) => {
                  adjustUserBalance(amt, reason);
                }}
                showToast={showToast}
              />
            )}

            {/* TAB 3: WALLETS (Bee Grow Wallet Management) */}
            {activeTab === 'wallets' && (
              <AdminWalletsView
                currentBalance={user.availableBalance}
                onAdjustBalance={(amt, note) => {
                  adjustUserBalance(amt, note);
                  showToast(`Balance adjusted: ₹${amt.toLocaleString()}`);
                }}
                onOpenAddMoneyModal={() => setIsAddBalanceModalOpen(true)}
                onExportCSV={exportToCSV}
                showToast={showToast}
              />
            )}

            {/* TAB 4: WITHDRAWALS (Bee Grow Withdrawal Requests) */}
            {activeTab === 'withdrawals' && (
              <AdminWithdrawalsView
                onApproveLiveWithdrawal={(id, utr) => {
                  approveWithdrawal(id, utr);
                  showToast(`Withdrawal approved! UTR: ${utr}`);
                }}
                onRejectLiveWithdrawal={(id, reason) => {
                  rejectWithdrawal(id, reason);
                  showToast(`Withdrawal rejected: ${reason}`);
                }}
                pendingTransactions={transactions}
                onExportCSV={exportToCSV}
                showToast={showToast}
              />
            )}

            {/* TAB 5: TOP-UP REQUESTS (Bee Grow Top-up Management) */}
            {activeTab === 'recharges' && (
              <AdminTopupsView
                pendingTransactions={transactions}
                onApproveRecharge={(id) => {
                  approveRecharge(id);
                  showToast('Top-up approved!');
                }}
                onRejectRecharge={(id, reason) => {
                  rejectRecharge(id, reason);
                  showToast(`Top-up rejected: ${reason}`);
                }}
                onExportCSV={exportToCSV}
                showToast={showToast}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            )}

            {/* TAB: RECHARGE GATEWAY & UPI DETAILS (For entering website recharge details) */}
            {activeTab === 'rechargeGateway' && (
              <AdminRechargeDetailsView
                settings={platformSettings}
                onSaveSettings={(s) => {
                  updatePlatformSettings(s);
                  showToast('Recharge details updated and live on website!');
                }}
                showToast={showToast}
              />
            )}

            {/* TAB 6: SETTINGS (Bee Grow Platform Settings) */}
            {activeTab === 'settings' && (
              <AdminSettingsView
                settings={platformSettings}
                onSaveSettings={(s) => {
                  updatePlatformSettings(s);
                  showToast('Settings saved!');
                }}
                showToast={showToast}
              />
            )}

            {/* TAB 7: KYC REQUESTS */}
            {activeTab === 'kyc' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                    KYC Requests
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Review and verify government identity documents, Aadhaar / PAN card submissions.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">All KYC Submissions Cleared</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    0 pending verification requests in the queue. New submissions will appear here for 1-click verification.
                  </p>
                </div>
              </div>
            )}

          {/* ================= SECTION 1: REFERRAL NETWORK & MULTI-TIER GENEALOGY HIERARCHY ================= */}
          {(activeTab === 'network' || activeTab === 'referrals') && (() => {
            const allL1Commission = teamMembers.filter(m => m.level === 1).reduce((s, m) => s + m.commissionGenerated, 0);
            const allL2Commission = teamMembers.filter(m => m.level === 2).reduce((s, m) => s + m.commissionGenerated, 0);
            const allL3Commission = teamMembers.filter(m => m.level === 3).reduce((s, m) => s + m.commissionGenerated, 0);
            const allCommissionsSum = allL1Commission + allL2Commission + allL3Commission;
            const rootStats = getDownlineStats('ROOT');
            const totalActiveUnits = teamMembers.reduce((s, m) => s + (m.plans?.reduce((pSum, p) => pSum + p.quantity, 0) || 0), 0);

            // Handler to open Add Member modal pre-filled for a specific inviter
            const handleAddDownlineMember = (inviterId: string, level: 1 | 2 | 3) => {
              setNewMemberForm({
                id: `TM-${Math.floor(100 + Math.random() * 900)}`,
                phone: '+91 98',
                joinDate: new Date().toISOString().slice(0, 10),
                level: level,
                inviterId: inviterId,
                inviteCount: 0,
                rechargeAmount: 1000,
                teamInvested: 0,
                commissionGenerated: level === 1 ? 220 : level === 2 ? 20 : 10,
                status: 'ACTIVE',
                plans: []
              });
              setIsAddMemberModalOpen(true);
            };

            return (
              <div className="space-y-4">
                {/* Header Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 font-sans flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span>Referral Network & Downline Commission Hierarchy</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      When you invite members they are your Level 1 (22%). If they invite someone, they are your Level 2 (2%), and Level 3 (1%). Click Drop Down on any row to expand their downlines in their own lines.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search phone, ID or inviter..."
                        value={networkSearch}
                        onChange={(e) => setNetworkSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden w-44"
                      />
                    </div>

                    {/* View Mode Toggle: Tree vs Flat */}
                    <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                      <button
                        onClick={() => setNetworkViewMode('TREE')}
                        className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                          networkViewMode === 'TREE'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Genealogy Tree
                      </button>
                      <button
                        onClick={() => setNetworkViewMode('FLAT')}
                        className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                          networkViewMode === 'FLAT'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Flat List
                      </button>
                    </div>

                    {/* Level Filter */}
                    <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                      {(['ALL', 1, 2, 3] as const).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setNetworkLevelFilter(lvl)}
                          className={`px-2 py-1 rounded-lg transition text-[11px] ${
                            networkLevelFilter === lvl 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {lvl === 'ALL' ? 'All' : `L${lvl}`}
                        </button>
                      ))}
                    </div>

                    {/* Expand All / Collapse All Tree Buttons */}
                    {networkViewMode === 'TREE' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={expandAllDownlines}
                          title="Expand all downlines in tree"
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                        >
                          Expand All
                        </button>
                        <button
                          onClick={collapseAllDownlines}
                          title="Collapse all downlines to single summary lines"
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
                        >
                          Collapse All
                        </button>
                      </div>
                    )}

                    {/* Add Member Button */}
                    <button
                      onClick={() => handleAddDownlineMember('User5294 (You)', 1)}
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
                    <span className="text-xl font-black text-slate-900 font-sans">{teamMembers.length} Members</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">3 Tier Multi-Level Team</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Team Investment</span>
                    <span className="text-xl font-black text-blue-600 font-sans">₹{totalNetworkInvestment.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Across all downline levels</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Commission Earned</span>
                    <span className="text-xl font-black text-emerald-600 font-sans">
                      +₹{allCommissionsSum.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      L1: ₹{allL1Commission.toLocaleString()} · L2: ₹{allL2Commission.toLocaleString()} · L3: ₹{allL3Commission.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Active Robot Fleet</span>
                    <span className="text-xl font-black text-indigo-600 font-sans">
                      {totalActiveUnits} Units
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Generating daily ROI</span>
                  </div>
                </div>

                {/* Hierarchical Referral Tree Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                        <tr>
                          <th className="p-3.5">Member Hierarchy / Phone</th>
                          <th className="p-3.5">Tier Level</th>
                          <th className="p-3.5">Invited By</th>
                          <th className="p-3.5">Downline Breakdown (L1, L2, L3)</th>
                          <th className="p-3.5">Total Invested</th>
                          <th className="p-3.5">Commission to You</th>
                          <th className="p-3.5">Plans Bought & Days Active</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">

                        {/* ================= 1. ROOT ROW: YOU / THE FIRST PERSON ================= */}
                        {(networkLevelFilter === 'ALL' || networkLevelFilter === 1) && !networkSearch && networkViewMode === 'TREE' && (
                          <tr className="bg-gradient-to-r from-amber-50/50 via-blue-50/30 to-amber-50/50 border-b-2 border-amber-200/60 transition">
                            {/* Root Identity */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                  👑
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-black text-slate-900 text-sm">{user.phone}</span>
                                    <span className="px-1.5 py-0.2 rounded-md bg-amber-200/70 text-amber-900 text-[10px] font-black">
                                      YOU
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    ID: User5294 (You) · Invite Code: {user.inviteCode} · VIP{user.vipLevel}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Level Badge */}
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full font-black text-[10px] uppercase bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                                👑 Root Sponsor (Head)
                              </span>
                            </td>

                            {/* Inviter */}
                            <td className="p-3.5 font-mono text-[11px] text-slate-500 font-semibold">
                              Platform Direct
                            </td>

                            {/* Single-Line Breakdown with Drop Down Button */}
                            <td className="p-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-black" title="Level 1 Direct Referrals (22% Commission)">
                                  L1: {rootStats.l1Count}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-black" title="Level 2 Indirect Referrals (2% Commission)">
                                  L2: {rootStats.l2Count}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-black" title="Level 3 Downline Referrals (1% Commission)">
                                  L3: {rootStats.l3Count}
                                </span>

                                <button
                                  onClick={() => toggleDownlineExpand('ROOT')}
                                  className={`ml-1 px-2.5 py-1 rounded-lg text-[11px] font-black shadow-xs flex items-center gap-1 transition ${
                                    expandedDownlineIds.includes('ROOT')
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {expandedDownlineIds.includes('ROOT') ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                  <span>{expandedDownlineIds.includes('ROOT') ? 'Hide Downlines' : `Drop Down (${rootStats.totalCount})`}</span>
                                </button>
                              </div>
                            </td>

                            {/* Personal Investment */}
                            <td className="p-3.5">
                              <span className="font-black text-slate-900 font-mono text-sm block">
                                ₹{user.totalRecharge.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-bold">
                                Status: Active
                              </span>
                            </td>

                            {/* Commission to You */}
                            <td className="p-3.5">
                              <span className="font-black font-mono text-emerald-600 text-sm block">
                                +₹{allCommissionsSum.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400">Total from all 3 levels</span>
                            </td>

                            {/* Plans Bought */}
                            <td className="p-3.5">
                              <span className="font-bold text-slate-800 text-[11px] block">
                                Personal Fleet ({investments.length} Active Nodes)
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Total Available: ₹{user.availableBalance.toLocaleString()}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleAddDownlineMember('User5294 (You)', 1)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition flex items-center gap-1 ml-auto"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Level 1</span>
                              </button>
                            </td>
                          </tr>
                        )}

                        {/* ================= 2. HIERARCHICAL TREE VIEW ROWS ================= */}
                        {networkViewMode === 'TREE' && !networkSearch && networkLevelFilter === 'ALL' ? (
                          expandedDownlineIds.includes('ROOT') && rootStats.l1Members.map((m1) => {
                            const m1Stats = getDownlineStats(m1.id);
                            const isM1Expanded = expandedDownlineIds.includes(m1.id);

                            return (
                              <React.Fragment key={m1.id}>
                                {/* LEVEL 1 MEMBER ROW (Their Own Line) */}
                                <tr className="hover:bg-amber-50/30 transition bg-white">
                                  {/* Member Identity with L1 Tree Branch */}
                                  <td className="p-3.5 pl-6">
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] shrink-0 border border-amber-200">
                                        1
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-mono font-bold text-slate-900 text-xs">{m1.phone}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono block">
                                          ID: {m1.id} · Joined {m1.joinDate}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Tier Level */}
                                  <td className="p-3.5">
                                    <span className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                      Level 1 (22%)
                                    </span>
                                  </td>

                                  {/* Invited By */}
                                  <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                                    User5294 (You)
                                  </td>

                                  {/* Single-Line Breakdown with Drop Down Button */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold" title="Their direct invites (Level 2 to you)">
                                        L2: {m1Stats.l1Count}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold" title="Their indirect invites (Level 3 to you)">
                                        L3: {m1Stats.l2Count}
                                      </span>

                                      {m1Stats.totalCount > 0 ? (
                                        <button
                                          onClick={() => toggleDownlineExpand(m1.id)}
                                          className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 transition ${
                                            isM1Expanded
                                              ? 'bg-blue-600 text-white'
                                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                          }`}
                                        >
                                          {isM1Expanded ? (
                                            <ChevronDown className="w-3 h-3" />
                                          ) : (
                                            <ChevronRight className="w-3 h-3" />
                                          )}
                                          <span>{isM1Expanded ? 'Hide' : `Drop Down (${m1Stats.totalCount})`}</span>
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 italic ml-1">0 Downlines</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Total Invested */}
                                  <td className="p-3.5">
                                    <span className="font-black text-blue-600 font-mono text-sm block">
                                      ₹{m1.rechargeAmount.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-emerald-600 font-bold">
                                      Status: {m1.status}
                                    </span>
                                  </td>

                                  {/* Commission to You */}
                                  <td className="p-3.5">
                                    <span className="font-bold font-mono text-emerald-600 text-xs block">
                                      +₹{m1.commissionGenerated.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">22% Direct</span>
                                  </td>

                                  {/* Plans Bought & Days Active */}
                                  <td className="p-3.5 max-w-xs">
                                    {(!m1.plans || m1.plans.length === 0) ? (
                                      <span className="text-slate-400 text-[11px] italic">No active plans</span>
                                    ) : (
                                      <div className="flex flex-wrap gap-1">
                                        {m1.plans.map(p => (
                                          <div 
                                            key={p.id}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-mono"
                                          >
                                            <span className="font-bold text-blue-700">{p.planName}</span>
                                            <span className="text-slate-400">({p.quantity}u)</span>
                                            <span className="text-emerald-700 font-black">Day {p.daysElapsed}/{p.durationDays}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="p-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setSelectedMemberForPlans(m1)}
                                        className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>Plans</span>
                                      </button>
                                      <button
                                        onClick={() => handleAddDownlineMember(m1.id, 2)}
                                        title={`Add direct referral under ${m1.phone}`}
                                        className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition flex items-center gap-0.5"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add L2</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Delete member ${m1.phone}?`)) {
                                            deleteTeamMember(m1.id);
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

                                {/* LEVEL 2 MEMBERS (Dropped Down Under m1 in their own lines) */}
                                {isM1Expanded && m1Stats.l1Members.map((m2) => {
                                  const m2Stats = getDownlineStats(m2.id);
                                  const isM2Expanded = expandedDownlineIds.includes(m2.id);

                                  return (
                                    <React.Fragment key={m2.id}>
                                      <tr className="hover:bg-blue-50/40 transition bg-slate-50/40">
                                        {/* Member Identity with L2 Tree Indentation */}
                                        <td className="p-3.5 pl-12">
                                          <div className="flex items-center gap-2">
                                            <CornerDownRight className="w-4 h-4 text-blue-500 shrink-0" />
                                            <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0 border border-blue-200">
                                              2
                                            </div>
                                            <div>
                                              <span className="font-mono font-bold text-slate-800 text-xs block">{m2.phone}</span>
                                              <span className="text-[10px] text-slate-400 font-mono">
                                                ID: {m2.id} · Joined {m2.joinDate}
                                              </span>
                                            </div>
                                          </div>
                                        </td>

                                        {/* Tier Level */}
                                        <td className="p-3.5">
                                          <span className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase bg-blue-100 text-blue-800 border border-blue-200">
                                            Level 2 (2%)
                                          </span>
                                        </td>

                                        {/* Invited By */}
                                        <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                                          <span className="bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                                            {m1.id} ({m1.phone.slice(-5)})
                                          </span>
                                        </td>

                                        {/* Single-Line Breakdown with Drop Down Button */}
                                        <td className="p-3.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold" title="Their direct invites (Level 3 to you)">
                                              L3: {m2Stats.l1Count}
                                            </span>

                                            {m2Stats.totalCount > 0 ? (
                                              <button
                                                onClick={() => toggleDownlineExpand(m2.id)}
                                                className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-black flex items-center gap-1 transition ${
                                                  isM2Expanded
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                }`}
                                              >
                                                {isM2Expanded ? (
                                                  <ChevronDown className="w-3 h-3" />
                                                ) : (
                                                  <ChevronRight className="w-3 h-3" />
                                                )}
                                                <span>{isM2Expanded ? 'Hide' : `Drop Down (${m2Stats.totalCount})`}</span>
                                              </button>
                                            ) : (
                                              <span className="text-[10px] text-slate-400 italic ml-1">0 Downlines</span>
                                            )}
                                          </div>
                                        </td>

                                        {/* Total Invested */}
                                        <td className="p-3.5">
                                          <span className="font-black text-blue-600 font-mono text-sm block">
                                            ₹{m2.rechargeAmount.toLocaleString()}
                                          </span>
                                          <span className="text-[10px] text-emerald-600 font-bold">
                                            Status: {m2.status}
                                          </span>
                                        </td>

                                        {/* Commission to You */}
                                        <td className="p-3.5">
                                          <span className="font-bold font-mono text-blue-600 text-xs block">
                                            +₹{m2.commissionGenerated.toLocaleString()}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">2% Indirect</span>
                                        </td>

                                        {/* Plans Bought & Days Active */}
                                        <td className="p-3.5 max-w-xs">
                                          {(!m2.plans || m2.plans.length === 0) ? (
                                            <span className="text-slate-400 text-[11px] italic">No active plans</span>
                                          ) : (
                                            <div className="flex flex-wrap gap-1">
                                              {m2.plans.map(p => (
                                                <div 
                                                  key={p.id}
                                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono shadow-2xs"
                                                >
                                                  <span className="font-bold text-blue-700">{p.planName}</span>
                                                  <span className="text-slate-400">({p.quantity}u)</span>
                                                  <span className="text-emerald-700 font-black">Day {p.daysElapsed}/{p.durationDays}</span>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-3.5 text-right">
                                          <div className="flex items-center justify-end gap-1.5">
                                            <button
                                              onClick={() => setSelectedMemberForPlans(m2)}
                                              className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                                            >
                                              <Eye className="w-3 h-3" />
                                              <span>Plans</span>
                                            </button>
                                            <button
                                              onClick={() => handleAddDownlineMember(m2.id, 3)}
                                              title={`Add direct referral under ${m2.phone}`}
                                              className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] transition flex items-center gap-0.5"
                                            >
                                              <Plus className="w-3 h-3" />
                                              <span>Add L3</span>
                                            </button>
                                            <button
                                              onClick={() => {
                                                if (window.confirm(`Delete member ${m2.phone}?`)) {
                                                  deleteTeamMember(m2.id);
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

                                      {/* LEVEL 3 MEMBERS (Dropped Down Under m2 in their own lines) */}
                                      {isM2Expanded && m2Stats.l1Members.map((m3) => (
                                        <tr key={m3.id} className="hover:bg-purple-50/40 transition bg-slate-100/50">
                                          {/* Member Identity with L3 Tree Indentation */}
                                          <td className="p-3.5 pl-20">
                                            <div className="flex items-center gap-2">
                                              <CornerDownRight className="w-4 h-4 text-purple-500 shrink-0" />
                                              <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px] shrink-0 border border-purple-200">
                                                3
                                              </div>
                                              <div>
                                                <span className="font-mono font-bold text-slate-800 text-xs block">{m3.phone}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                  ID: {m3.id} · Joined {m3.joinDate}
                                                </span>
                                              </div>
                                            </div>
                                          </td>

                                          {/* Tier Level */}
                                          <td className="p-3.5">
                                            <span className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase bg-purple-100 text-purple-800 border border-purple-200">
                                              Level 3 (1%)
                                            </span>
                                          </td>

                                          {/* Invited By */}
                                          <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                                            <span className="bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                                              {m2.id} ({m2.phone.slice(-5)})
                                            </span>
                                          </td>

                                          {/* Single-Line Breakdown (Terminal level) */}
                                          <td className="p-3.5">
                                            <span className="text-[10px] text-slate-400 font-mono italic">
                                              0 Downlines (Terminal Level 3)
                                            </span>
                                          </td>

                                          {/* Total Invested */}
                                          <td className="p-3.5">
                                            <span className="font-black text-blue-600 font-mono text-sm block">
                                              ₹{m3.rechargeAmount.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-emerald-600 font-bold">
                                              Status: {m3.status}
                                            </span>
                                          </td>

                                          {/* Commission to You */}
                                          <td className="p-3.5">
                                            <span className="font-bold font-mono text-purple-600 text-xs block">
                                              +₹{m3.commissionGenerated.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">1% Downline</span>
                                          </td>

                                          {/* Plans Bought & Days Active */}
                                          <td className="p-3.5 max-w-xs">
                                            {(!m3.plans || m3.plans.length === 0) ? (
                                              <span className="text-slate-400 text-[11px] italic">No active plans</span>
                                            ) : (
                                              <div className="flex flex-wrap gap-1">
                                                {m3.plans.map(p => (
                                                  <div 
                                                    key={p.id}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono shadow-2xs"
                                                  >
                                                    <span className="font-bold text-blue-700">{p.planName}</span>
                                                    <span className="text-slate-400">({p.quantity}u)</span>
                                                    <span className="text-emerald-700 font-black">Day {p.daysElapsed}/{p.durationDays}</span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </td>

                                          {/* Actions */}
                                          <td className="p-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                onClick={() => setSelectedMemberForPlans(m3)}
                                                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                                              >
                                                <Eye className="w-3 h-3" />
                                                <span>Plans</span>
                                              </button>
                                              <button
                                                onClick={() => {
                                                  if (window.confirm(`Delete member ${m3.phone}?`)) {
                                                    deleteTeamMember(m3.id);
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
                                      ))}
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          /* ================= 3. FILTERED OR FLAT LIST VIEW ================= */
                          filteredMembers.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                                No referral members found matching the filter.
                              </td>
                            </tr>
                          ) : (
                            filteredMembers.map((member) => {
                              const mStats = getDownlineStats(member.id);

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
                                      'bg-purple-100 text-purple-800 border border-purple-200'
                                    }`}>
                                      Level {member.level} ({member.level === 1 ? '22%' : member.level === 2 ? '2%' : '1%'})
                                    </span>
                                  </td>

                                  {/* Inviter */}
                                  <td className="p-3.5 text-slate-700 font-mono text-[11px]">
                                    {member.inviterId || 'Direct'}
                                  </td>

                                  {/* Single Line Breakdown */}
                                  <td className="p-3.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                                        L1: {mStats.l1Count}
                                      </span>
                                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                                        L2: {mStats.l2Count}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono ml-1">
                                        ({mStats.totalCount} total)
                                      </span>
                                    </div>
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
                                        <span>Plans</span>
                                      </button>
                                      {member.level < 3 && (
                                        <button
                                          onClick={() => handleAddDownlineMember(member.id, (member.level + 1) as 2 | 3)}
                                          title={`Add downline member under ${member.phone}`}
                                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition flex items-center gap-0.5"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Add L{member.level + 1}</span>
                                        </button>
                                      )}
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
                            })
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= SECTION 2: DAILY WITHDRAWAL LOGS TABLE (NEW) ================= */}
          {activeTab === 'dailyWithdrawals' && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-sans flex items-center gap-2">
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
                  <h2 className="text-lg font-black text-slate-900 font-sans">
                    FanCode Investment Plans Catalog
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
                          src={resolveProductImage(plan.id, plan.image)}
                          alt={plan.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = resolveProductImage(plan.id);
                          }}
                        />
                        <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/70 text-white text-[9px] font-black">
                          {plan.id}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-black text-slate-900 text-sm truncate font-sans">
                            {plan.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase shrink-0">
                            {plan.tier || 'Standard'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{plan.robotModel}</p>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-base font-black text-blue-600 font-sans">
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

          {/* ================= SECTION 2: TOP-UP & RECHARGE VERIFICATION HUB (Bee Grow TopupManagement) ================= */}
          {activeTab === 'recharges' && (() => {
            const rechargeTxns = transactions.filter(t => t.type === 'RECHARGE');
            const pendingRecharges = rechargeTxns.filter(t => t.status === 'PROCESSING');
            const completedRecharges = rechargeTxns.filter(t => t.status === 'COMPLETED');
            const rejectedRecharges = rechargeTxns.filter(t => t.status === 'REJECTED');
            const totalRechargeVol = completedRecharges.reduce((s, t) => s + Math.abs(t.amount), 0);

            const filteredRechargeList = rechargeTxns.filter(t => {
              const matchesFilter = rechargeFilter === 'ALL' || 
                (rechargeFilter === 'PENDING' ? t.status === 'PROCESSING' : t.status === rechargeFilter);
              const q = rechargeSearch.toLowerCase().trim();
              const matchesSearch = !q ||
                t.id.toLowerCase().includes(q) ||
                (t.referenceId && t.referenceId.toLowerCase().includes(q)) ||
                (t.userPhone && t.userPhone.includes(q)) ||
                (t.description && t.description.toLowerCase().includes(q));
              return matchesFilter && matchesSearch;
            });

            const handleExportRechargesCSV = () => {
              const headers = ['Txn ID', 'User Phone', 'Amount', 'Payment Method', 'UTR / Reference ID', 'Status', 'Admin Note', 'Timestamp'];
              const rows = filteredRechargeList.map(t => [
                t.id,
                t.userPhone || user.phone,
                Math.abs(t.amount),
                t.description || 'UPI Direct Gateway',
                t.referenceId || 'N/A',
                t.status,
                t.adminNote || t.rejectionReason || '',
                t.formattedTime || t.timestamp
              ]);
              exportToCSV('topup_verification_ledger', headers, rows);
            };

            return (
              <div className="space-y-4">
                {/* Header Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 font-sans flex items-center gap-2">
                      <ArrowDownToLine className="w-5 h-5 text-emerald-600" />
                      <span>Payment & Top-Up Verification Hub</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Audit incoming member recharges, verify 12-digit bank UTR numbers, credit user wallets, or reject invalid proofs.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search UTR, Txn, Phone..."
                        value={rechargeSearch}
                        onChange={(e) => setRechargeSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden w-48"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                      {(['ALL', 'PENDING', 'COMPLETED', 'REJECTED'] as const).map(flt => (
                        <button
                          key={flt}
                          onClick={() => setRechargeFilter(flt)}
                          className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                            rechargeFilter === flt
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {flt === 'ALL' ? 'All' : flt === 'PENDING' ? `Pending (${pendingRecharges.length})` : flt}
                        </button>
                      ))}
                    </div>

                    {/* Export CSV */}
                    <button
                      onClick={handleExportRechargesCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Verification</span>
                    <span className={`text-xl font-black font-mono ${pendingRecharges.length > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>
                      {pendingRecharges.length} Requests
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ₹{pendingRecharges.reduce((s, t) => s + Math.abs(t.amount), 0).toLocaleString()} awaiting
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Approved Volume</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      ₹{totalRechargeVol.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {completedRecharges.length} recharges verified
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rejected Attempts</span>
                    <span className="text-xl font-black text-rose-600 font-mono">
                      {rejectedRecharges.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Flagged fraudulent/invalid
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Top-Up Records</span>
                    <span className="text-xl font-black text-slate-900 font-mono">
                      {rechargeTxns.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      100% Supabase ledger logged
                    </span>
                  </div>
                </div>

                {/* Top-Ups Verification Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                        <tr>
                          <th className="p-3.5">Txn ID / Time</th>
                          <th className="p-3.5">User Phone / ID</th>
                          <th className="p-3.5">Top-Up Amount</th>
                          <th className="p-3.5">UTR / Bank Reference</th>
                          <th className="p-3.5">Payment Method</th>
                          <th className="p-3.5">Verification Status</th>
                          <th className="p-3.5">Admin Note</th>
                          <th className="p-3.5 text-right">Verification Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredRechargeList.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                              No recharge records match the current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredRechargeList.map((txn) => {
                            const isPending = txn.status === 'PROCESSING';
                            const utr = txn.referenceId || 'N/A';

                            return (
                              <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                                <td className="p-3.5">
                                  <span className="font-mono font-bold text-slate-900 block">{txn.id}</span>
                                  <span className="text-[10px] text-slate-400">{txn.formattedTime || txn.timestamp}</span>
                                </td>

                                <td className="p-3.5">
                                  <span className="font-mono font-bold text-slate-800 block">
                                    {txn.userPhone || user.phone}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    User: {txn.userId || user.id || 'User5294'}
                                  </span>
                                </td>

                                <td className="p-3.5 font-bold font-mono text-emerald-600 text-sm">
                                  +₹{Math.abs(txn.amount).toLocaleString()}
                                </td>

                                <td className="p-3.5">
                                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 w-fit">
                                    <span className="font-mono font-black text-slate-800 text-[11px]">{utr}</span>
                                    {utr !== 'N/A' && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(utr);
                                          showToast(`UTR copied: ${utr}`);
                                        }}
                                        title="Copy 12-digit UTR"
                                        className="text-slate-400 hover:text-blue-600 transition"
                                      >
                                        <Copy className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3.5 text-slate-600">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                                    {txn.description?.includes('UPI') ? 'UPI Intent / QR' : txn.description || 'Direct Gateway'}
                                  </span>
                                </td>

                                <td className="p-3.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    txn.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                                    'bg-rose-100 text-rose-800 border border-rose-200'
                                  }`}>
                                    {txn.status === 'PROCESSING' ? 'Pending Audit' : txn.status}
                                  </span>
                                </td>

                                <td className="p-3.5 text-slate-500 max-w-xs truncate text-[11px]">
                                  {txn.adminNote || txn.rejectionReason || '-'}
                                </td>

                                <td className="p-3.5 text-right">
                                  {isPending ? (
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => setRechargeActionModal({ txn, action: 'approve' })}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Approve</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRechargeRejectReason('Invalid UTR reference number');
                                          setRechargeActionModal({ txn, action: 'reject' });
                                        }}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                      >
                                        <X className="w-3 h-3" />
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px] font-semibold">
                                      {txn.status === 'COMPLETED' ? '✓ Credited' : '✕ Rejected'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= SECTION 3: WITHDRAWAL REQUESTS & BANK SETTLEMENT HUB (Bee Grow WithdrawalRequests) ================= */}
          {activeTab === 'withdrawals' && (() => {
            const withdrawalTxns = transactions.filter(t => t.type === 'WITHDRAWAL');
            const pendingWithdrawalsList = withdrawalTxns.filter(t => t.status === 'PROCESSING');
            const completedWithdrawalsList = withdrawalTxns.filter(t => t.status === 'COMPLETED');
            const rejectedWithdrawalsList = withdrawalTxns.filter(t => t.status === 'REJECTED');

            const totalRequestedAll = withdrawalTxns.reduce((s, t) => s + Math.abs(t.amount), 0);
            const totalFeesAll = withdrawalTxns.reduce((s, t) => s + (t.fee || Math.round(Math.abs(t.amount) * 0.1)), 0);
            const totalNetDisbursed = completedWithdrawalsList.reduce((s, t) => {
              const gross = Math.abs(t.amount);
              const fee = t.fee || Math.round(gross * 0.1);
              return s + (t.netAmount || (gross - fee));
            }, 0);

            const filteredWithdrawalList = withdrawalTxns.filter(t => {
              const matchesFilter = withdrawalFilter === 'ALL' || t.status === withdrawalFilter;
              const q = withdrawalSearch.toLowerCase().trim();
              const matchesSearch = !q ||
                t.id.toLowerCase().includes(q) ||
                (t.referenceId && t.referenceId.toLowerCase().includes(q)) ||
                (t.userPhone && t.userPhone.includes(q)) ||
                (t.description && t.description.toLowerCase().includes(q));
              return matchesFilter && matchesSearch;
            });

            const handleExportWithdrawalsCSV = () => {
              const headers = [
                'Txn ID', 'User Phone', 'Beneficiary Name', 'Bank Name', 'Account Number', 
                'IFSC Code', 'UPI ID', 'Gross Amount (INR)', '10% Fee (INR)', 'Net Payable (INR)', 
                'Status', 'Bank Ref / UTR', 'Admin Note / Reason', 'Timestamp'
              ];
              const rows = filteredWithdrawalList.map(t => {
                const gross = Math.abs(t.amount);
                const fee = t.fee ?? Math.round(gross * 0.1);
                const net = t.netAmount ?? (gross - fee);
                return [
                  t.id,
                  t.userPhone || user.phone,
                  user.bankAccount.accountHolder || 'N/A',
                  user.bankAccount.bankName || 'N/A',
                  user.bankAccount.accountNumber || 'N/A',
                  user.bankAccount.ifscCode || 'N/A',
                  user.bankAccount.upiId || 'N/A',
                  gross,
                  fee,
                  net,
                  t.status,
                  t.referenceId || '',
                  t.adminNote || t.rejectionReason || '',
                  t.formattedTime || t.timestamp
                ];
              });
              exportToCSV('bank_payout_disbursements', headers, rows);
            };

            return (
              <div className="space-y-4">
                {/* Header Card */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 font-sans flex items-center gap-2">
                      <ArrowUpToLine className="w-5 h-5 text-blue-600" />
                      <span>Withdrawal Requests & Bank Settlement Hub</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Disburse net bank transfers, inspect IFSC/Beneficiary details, record transfer reference UTRs, or reject with automatic wallet refund.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search ID, Bank UTR, Phone..."
                        value={withdrawalSearch}
                        onChange={(e) => setWithdrawalSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden w-48"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
                      {(['ALL', 'PROCESSING', 'COMPLETED', 'REJECTED'] as const).map(flt => (
                        <button
                          key={flt}
                          onClick={() => setWithdrawalFilter(flt)}
                          className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                            withdrawalFilter === flt
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {flt === 'ALL' ? 'All' : flt === 'PROCESSING' ? `Pending (${pendingWithdrawalsList.length})` : flt === 'COMPLETED' ? 'Settled' : 'Rejected'}
                        </button>
                      ))}
                    </div>

                    {/* Export Bank CSV */}
                    <button
                      onClick={handleExportWithdrawalsCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Bank Payout CSV</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Pending Bank Payouts</span>
                    <span className={`text-xl font-black font-mono ${pendingWithdrawalsList.length > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>
                      {pendingWithdrawalsList.length} Requests
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      ₹{pendingWithdrawalsList.reduce((s, t) => s + Math.abs(t.amount), 0).toLocaleString()} gross
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Funds Disbursed</span>
                    <span className="text-xl font-black text-emerald-600 font-mono">
                      ₹{totalNetDisbursed.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Paid to user accounts
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">10% Platform Fee</span>
                    <span className="text-xl font-black text-blue-600 font-mono">
                      ₹{totalFeesAll.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Auto-retained revenue
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rejected & Refunded</span>
                    <span className="text-xl font-black text-rose-600 font-mono">
                      {rejectedWithdrawalsList.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Wallet balances restored
                    </span>
                  </div>
                </div>

                {/* Withdrawals Table with Full Bank Beneficiary Details */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-black">
                        <tr>
                          <th className="p-3.5">Txn ID / Time</th>
                          <th className="p-3.5">Member Identity</th>
                          <th className="p-3.5">Beneficiary Bank Details</th>
                          <th className="p-3.5">Gross (₹)</th>
                          <th className="p-3.5">Fee (10%)</th>
                          <th className="p-3.5">Net Payout (₹)</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Bank Ref / Note</th>
                          <th className="p-3.5 text-right">Settlement Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredWithdrawalList.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400 text-xs">
                              No withdrawal records match the current filter.
                            </td>
                          </tr>
                        ) : (
                          filteredWithdrawalList.map((txn) => {
                            const isPending = txn.status === 'PROCESSING';
                            const gross = Math.abs(txn.amount);
                            const fee = txn.fee ?? Math.round(gross * 0.1);
                            const net = txn.netAmount ?? (gross - fee);

                            return (
                              <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                                <td className="p-3.5">
                                  <span className="font-mono font-bold text-slate-900 block">{txn.id}</span>
                                  <span className="text-[10px] text-slate-400">{txn.formattedTime || txn.timestamp}</span>
                                </td>

                                <td className="p-3.5">
                                  <span className="font-mono font-bold text-slate-800 block">
                                    {txn.userPhone || user.phone}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    User ID: {txn.userId || user.id || 'User5294'}
                                  </span>
                                </td>

                                {/* Beneficiary Bank & UPI Information with 1-click copy */}
                                <td className="p-3.5 space-y-1">
                                  <div className="font-bold text-slate-900 flex items-center gap-1">
                                    <span>{user.bankAccount.accountHolder || 'User Beneficiary'}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
                                    <span>{user.bankAccount.bankName || 'HDFC Bank'}</span>
                                    <span>·</span>
                                    <span>{user.bankAccount.accountNumber || '••••••••'}</span>
                                    {user.bankAccount.accountNumber && (
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(user.bankAccount.accountNumber);
                                          showToast(`Copied Account: ${user.bankAccount.accountNumber}`);
                                        }}
                                        title="Copy Account Number"
                                        className="text-slate-400 hover:text-blue-600"
                                      >
                                        <Copy className="w-2.5 h-2.5" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                                    <span>IFSC: {user.bankAccount.ifscCode || 'HDFC0001234'}</span>
                                    {user.bankAccount.upiId && (
                                      <span>UPI: {user.bankAccount.upiId}</span>
                                    )}
                                  </div>
                                </td>

                                <td className="p-3.5 font-mono font-bold text-slate-800">
                                  ₹{gross.toLocaleString()}
                                </td>

                                <td className="p-3.5 font-mono text-blue-600">
                                  ₹{fee.toLocaleString()}
                                </td>

                                <td className="p-3.5 font-mono font-black text-emerald-600 text-sm">
                                  ₹{net.toLocaleString()}
                                </td>

                                <td className="p-3.5">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                    txn.status === 'PROCESSING' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                                    'bg-rose-100 text-rose-800 border border-rose-200'
                                  }`}>
                                    {txn.status === 'PROCESSING' ? 'Pending Disburse' : txn.status}
                                  </span>
                                </td>

                                <td className="p-3.5 text-slate-500 max-w-xs truncate text-[11px]">
                                  {txn.referenceId ? (
                                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200">
                                      Ref: {txn.referenceId}
                                    </span>
                                  ) : txn.rejectionReason ? (
                                    <span className="font-mono text-rose-600">
                                      Reason: {txn.rejectionReason}
                                    </span>
                                  ) : (
                                    <span>{txn.adminNote || '-'}</span>
                                  )}
                                </td>

                                <td className="p-3.5 text-right">
                                  {isPending ? (
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => {
                                          setBankReferenceInput(`IMPS${Date.now().toString().slice(-8)}`);
                                          setWithdrawalAdminNote('');
                                          setWithdrawalActionModal({ txn, action: 'approve' });
                                        }}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>Payout</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setWithdrawalRejectReason('Incorrect beneficiary IFSC / account credentials');
                                          setWithdrawalActionModal({ txn, action: 'reject' });
                                        }}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs active:scale-95 transition"
                                      >
                                        <X className="w-3 h-3" />
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 text-[11px] font-semibold">
                                      {txn.status === 'COMPLETED' ? '✓ Disbursed' : '✕ Refunded'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= SECTION 5: USER & WALLET CONTROL ================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Bee Grow UserDetail 360 Inspection Card */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-black font-sans text-xl text-blue-400">
                    VIP{user.vipLevel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black font-sans">
                        {user.phone} · Master Account
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                        {user.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">
                      User ID: {user.id || 'User5294'} · Security PIN: {user.pin || '1234'} · Bank Lock: {user.bankDetailsLocked ? 'LOCKED' : 'UNLOCKED'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsUser360Open(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 active:scale-95 transition"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open 360° Inspection</span>
                  </button>

                  <button
                    onClick={() => setIsAssignPlanModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Assign Plan Directly</span>
                  </button>

                  <button
                    onClick={() => {
                      const newLock = !user.bankDetailsLocked;
                      updateUserSecurity(user.id || 'User5294', { bankDetailsLocked: newLock });
                      setUserFormData(prev => ({ ...prev, bankDetailsLocked: newLock }));
                      showToast(`Bank details edit ${newLock ? 'LOCKED' : 'UNLOCKED'}`);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition ${
                      user.bankDetailsLocked 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30' 
                        : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <LockKeyhole className="w-3.5 h-3.5" />
                    <span>{user.bankDetailsLocked ? 'Bank Locked' : 'Lock Bank Edits'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 font-sans flex items-center gap-2">
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
                  <h3 className="text-base font-black text-slate-900 font-sans flex items-center gap-2">
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
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">User Identity & Security</h4>
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
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">4-Digit Security PIN</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={userFormData.pin}
                        onChange={(e) => setUserFormData({ ...userFormData, pin: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold text-blue-600 outline-hidden bg-white"
                      />
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 block">Bank Account Edit Lock</span>
                        <span className="text-[10px] text-slate-400">Lock user changes in frontend</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={userFormData.bankDetailsLocked}
                        onChange={(e) => setUserFormData({ ...userFormData, bankDetailsLocked: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
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

          {/* ================= SECTION 6: USER ACTIVE ROBOTS & YIELD ENGINE (Bee Grow dailyRoi) ================= */}
          {activeTab === 'orders' && (() => {
            const activeNodes = investments.filter(i => i.status === 'ACTIVE');
            const totalDailyExpectedYield = activeNodes.reduce((sum, inv) => sum + inv.dailyIncome, 0);
            const estimatedL1Commission = Math.round(totalDailyExpectedYield * 0.10);
            const estimatedL2Commission = Math.round(totalDailyExpectedYield * 0.05);
            const estimatedL3Commission = Math.round(totalDailyExpectedYield * 0.02);
            const totalEstimatedCommissions = estimatedL1Commission + estimatedL2Commission + estimatedL3Commission;

            return (
              <div className="space-y-4">
                {/* Bee Grow dailyRoi Automated Yield & Commission Engine Control */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-400" />
                        <h3 className="text-base font-black font-sans">
                          Automated Daily Yield & Commission Engine (FanCode dailyRoi)
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                          Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Execute today's yield payout cycle: advances active contracts, distributes node ROI, calculates downline referral commissions (L1: 10%, L2: 5%, L3: 2%), and creates transaction audit records.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsYieldConfirmOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition shrink-0"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>Run Daily Yield & Referral Payout Cycle</span>
                    </button>
                  </div>

                  {/* 4 Engine Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Robot Nodes</span>
                      <span className="font-black text-lg text-white font-mono">{activeNodes.length} Units</span>
                      <span className="text-[10px] text-slate-400 block">Cap: Duration check active</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Expected Node Yield</span>
                      <span className="font-black text-lg text-emerald-400 font-mono">₹{totalDailyExpectedYield.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block">Direct into user wallet</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Downline Referral Comm.</span>
                      <span className="font-black text-lg text-blue-400 font-mono">₹{totalEstimatedCommissions.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block">L1 10% · L2 5% · L3 2%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Payout Volume</span>
                      <span className="font-black text-lg text-amber-400 font-mono">
                        ₹{(totalDailyExpectedYield + totalEstimatedCommissions).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Simulated Time Synced</span>
                    </div>
                  </div>
                </div>

                {/* Fleet Header */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 font-sans">
                      Active FanCode Plan Orders
                    </h2>
                    <p className="text-xs text-slate-500">
                      Currently deployed plans generating daily revenue for User5294.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                    {investments.length} Active Contracts
                  </span>
                </div>

                {investments.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                  No active plan investments yet. User can purchase units from the catalog.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investments.map((inv) => {
                    const daysActive = calculateDaysPassed(
                      inv.purchaseTimestamp || inv.purchaseDateFormatted,
                      simulatedTime,
                      platformSettings.dailyWithdrawalWindowStart,
                      inv.daysElapsed
                    );
                    const remainingDays = Math.max(0, 150 - daysActive);
                    const progressPercent = Math.min(100, Math.round((daysActive / 150) * 100));

                    return (
                      <div key={inv.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm font-sans">{inv.productName}</span>
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

                        {/* Self-Updating Days Active & Lifecycle Progress */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-[11px] font-mono">
                                Purchased: {inv.purchaseDateFormatted}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                                {daysActive} {daysActive === 1 ? 'day' : 'days'} active (Day {daysActive}/150)
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              {remainingDays}d remaining
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

          {/* ================= SECTION 7: PLATFORM SETTINGS ================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-sans">
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
                          telegramSupportUrl: 'https://t.me/fancode_support',
                          telegramChannelUrl: 'https://t.me/fancode_official',
                          platformAnnouncement: 'FanCode Official Sports Investment Platform. Daily yields processing 24/7.',
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
      </div>

        {/* ================= MODAL 1: MEMBER PLANS INSPECTION & ASSIGNMENT (NEW) ================= */}
      {selectedMemberForPlans && (() => {
        const activeMember = teamMembers.find(m => m.id === selectedMemberForPlans.id) || selectedMemberForPlans;

        return (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[88vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-sans tracking-wide">
                      {activeMember.phone} · Holdings Breakdown
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase">
                      Level {activeMember.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Member ID: {activeMember.id} · Invited by: {activeMember.inviterId || 'Direct'} · Downline Referrals: {activeMember.inviteCount} people
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
                    <span className="font-black text-slate-900 font-mono text-sm">₹{activeMember.rechargeAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Team Volume</span>
                    <span className="font-black text-blue-600 font-mono text-sm">₹{activeMember.teamInvested.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Commission Generated</span>
                    <span className="font-black text-emerald-600 font-mono text-sm">₹{activeMember.commissionGenerated.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Plan Units</span>
                    <span className="font-black text-indigo-600 font-mono text-sm">
                      {(activeMember.plans || []).reduce((s, p) => s + p.quantity, 0)} Units
                    </span>
                  </div>
                </div>

                {/* Plans Table */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-black text-slate-900 text-sm font-sans flex items-center gap-1.5">
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

                  {(!activeMember.plans || activeMember.plans.length === 0) ? (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400">
                      No active plans for this member. Click "+ Assign New Plan" to grant an investment plan.
                    </div>
                  ) : (
                    <div>
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
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {activeMember.plans.map(p => {
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
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Information Banner */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Days passed and daily returns update automatically every day after the night reset time (00:30 AM).</span>
                        </div>
                        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-700">
                          Auto Night Reset Active
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assign New Plan Sub-Form */}
                {isAddingPlanToMember && (
                  <form onSubmit={handleAddPlanToMember} className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-black text-blue-950 text-xs font-sans">
                        Grant & Assign Plan to {activeMember.phone}
                      </h5>
                      <button
                        type="button"
                        onClick={() => setIsAddingPlanToMember(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        );
      })()}

      {/* ================= MODAL 2: ADD TEAM MEMBER MODAL ================= */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-black font-sans">Add New Referral Member</h3>
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
                <h3 className="text-base font-black font-sans tracking-wide">
                  {editingPlanId ? `Edit Plan ${editingPlanId}` : 'Create New FanCode Investment Plan'}
                </h3>
                <p className="text-xs text-slate-300">
                  {editingPlanId ? 'Modify price, daily ROI yield, duration, or specifications' : 'Define plan specifications, returns, and tier'}
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

      {/* ================= MODAL 2: RECHARGE VERIFICATION ACTION MODAL (Bee Grow TopupManagement) ================= */}
      {rechargeActionModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-5 text-white flex items-center justify-between ${
              rechargeActionModal.action === 'approve'
                ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950'
                : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  rechargeActionModal.action === 'approve' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {rechargeActionModal.action === 'approve' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black font-sans">
                    {rechargeActionModal.action === 'approve' ? 'Approve & Credit Top-Up' : 'Reject Top-Up Submission'}
                  </h3>
                  <span className="text-xs text-slate-300 font-mono">Txn ID: {rechargeActionModal.txn.id}</span>
                </div>
              </div>
              <button
                onClick={() => setRechargeActionModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Phone:</span>
                  <span className="font-mono font-bold text-slate-800">{rechargeActionModal.txn.userPhone || user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deposit Amount:</span>
                  <span className="font-mono font-black text-emerald-600 text-sm">
                    +₹{Math.abs(rechargeActionModal.txn.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">12-Digit Bank UTR:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {rechargeActionModal.txn.referenceId || 'N/A'}
                  </span>
                </div>
              </div>

              {rechargeActionModal.action === 'approve' ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-1">
                  <span className="font-bold block">Wallet Crediting Confirmation:</span>
                  <p className="text-[11px] text-emerald-700">
                    Approving this transaction will immediately deposit ₹{Math.abs(rechargeActionModal.txn.amount).toLocaleString()} into the member's Available Balance and update the status in Supabase.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">Mandatory Rejection Reason</label>
                  <input
                    type="text"
                    value={rechargeRejectReason}
                    onChange={(e) => setRechargeRejectReason(e.target.value)}
                    placeholder="e.g. UTR does not exist in bank statement / Invalid proof"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:ring-2 focus:ring-rose-500"
                    required
                  />
                  <p className="text-[11px] text-slate-400">
                    This rejection reason will be saved in the database audit log and visible on the transaction receipt.
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRechargeActionModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (rechargeActionModal.action === 'approve') {
                      const res = await approveRecharge(rechargeActionModal.txn.id);
                      showToast(res.message);
                    } else {
                      const res = await rejectRecharge(rechargeActionModal.txn.id, rechargeRejectReason || 'Verification failed');
                      showToast(res.message);
                    }
                    setRechargeActionModal(null);
                  }}
                  className={`px-5 py-2 rounded-xl text-white font-bold transition flex items-center gap-1.5 shadow-md ${
                    rechargeActionModal.action === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                  }`}
                >
                  {rechargeActionModal.action === 'approve' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{rechargeActionModal.action === 'approve' ? 'Confirm & Credit Wallet' : 'Confirm Rejection'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: WITHDRAWAL SETTLEMENT ACTION MODAL (Bee Grow WithdrawalRequests) ================= */}
      {withdrawalActionModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-5 text-white flex items-center justify-between ${
              withdrawalActionModal.action === 'approve'
                ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950'
                : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  withdrawalActionModal.action === 'approve' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {withdrawalActionModal.action === 'approve' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black font-sans">
                    {withdrawalActionModal.action === 'approve' ? 'Approve & Settle Bank Payout' : 'Reject Withdrawal & Refund Wallet'}
                  </h3>
                  <span className="text-xs text-slate-300 font-mono">Request ID: {withdrawalActionModal.txn.id}</span>
                </div>
              </div>
              <button
                onClick={() => setWithdrawalActionModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Financial & Beneficiary Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Beneficiary Name</span>
                    <span className="font-bold text-slate-800">{user.bankAccount.accountHolder || 'User Beneficiary'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Bank & Account</span>
                    <span className="font-mono font-bold text-slate-800">
                      {user.bankAccount.bankName} · {user.bankAccount.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">IFSC Code</span>
                    <span className="font-mono font-bold text-blue-700">{user.bankAccount.ifscCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">UPI ID</span>
                    <span className="font-mono font-bold text-slate-800">{user.bankAccount.upiId || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Gross Request</span>
                    <span className="font-bold text-slate-800">₹{Math.abs(withdrawalActionModal.txn.amount).toLocaleString()}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">10% Retained Fee</span>
                    <span className="font-bold text-blue-600">₹{(withdrawalActionModal.txn.fee || Math.round(Math.abs(withdrawalActionModal.txn.amount) * 0.1)).toLocaleString()}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-600 font-bold block">Net Disbursed</span>
                    <span className="font-black text-emerald-700 text-sm">
                      ₹{(withdrawalActionModal.txn.netAmount || (Math.abs(withdrawalActionModal.txn.amount) - (withdrawalActionModal.txn.fee || Math.round(Math.abs(withdrawalActionModal.txn.amount) * 0.1)))).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {withdrawalActionModal.action === 'approve' ? (
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Bank Transfer Reference / IMPS UTR Number
                    </label>
                    <input
                      type="text"
                      value={bankReferenceInput}
                      onChange={(e) => setBankReferenceInput(e.target.value)}
                      placeholder="e.g. IMPS529482019481 or CMS123498"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-blue-600 outline-hidden focus:ring-2 focus:ring-blue-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Admin Settlement Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={withdrawalAdminNote}
                      onChange={(e) => setWithdrawalAdminNote(e.target.value)}
                      placeholder="e.g. Disbursed via Corporate Banking Portal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                    <span className="font-bold block">Automatic Wallet Refund Guarantee:</span>
                    <p className="text-[11px] text-rose-700">
                      Rejecting this withdrawal will immediately refund the gross sum of ₹{Math.abs(withdrawalActionModal.txn.amount).toLocaleString()} directly back into the user's available and withdrawable balance in Supabase.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Mandatory Rejection Reason
                    </label>
                    <input
                      type="text"
                      value={withdrawalRejectReason}
                      onChange={(e) => setWithdrawalRejectReason(e.target.value)}
                      placeholder="e.g. Incorrect Account / IFSC does not match branch"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:ring-2 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawalActionModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (withdrawalActionModal.action === 'approve') {
                      const res = await approveWithdrawal(withdrawalActionModal.txn.id, bankReferenceInput, withdrawalAdminNote);
                      showToast(res.message);
                    } else {
                      const res = await rejectWithdrawal(withdrawalActionModal.txn.id, withdrawalRejectReason || 'Bank transfer failed');
                      showToast(res.message);
                    }
                    setWithdrawalActionModal(null);
                  }}
                  className={`px-5 py-2 rounded-xl text-white font-bold transition flex items-center gap-1.5 shadow-md ${
                    withdrawalActionModal.action === 'approve'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/25'
                  }`}
                >
                  {withdrawalActionModal.action === 'approve' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{withdrawalActionModal.action === 'approve' ? 'Confirm Bank Disbursement' : 'Reject & Refund Wallet'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: DAILY YIELD & REFERRAL COMMISSION ENGINE CONFIRMATION (Bee Grow dailyRoi) ================= */}
      {isYieldConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-5 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-black font-sans">
                    Execute Daily Yield & Commission Engine
                  </h3>
                  <span className="text-xs font-bold text-slate-900/80">FanCode dailyRoi Core Engine</span>
                </div>
              </div>
              <button
                onClick={() => setIsYieldConfirmOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                You are about to execute today's automated revenue distribution cycle across all active robotics investment nodes.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Deployed Nodes:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {investments.filter(i => i.status === 'ACTIVE').length} Units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Robot Yield to Disburse:</span>
                  <span className="font-bold font-mono text-emerald-600">
                    ₹{investments.filter(i => i.status === 'ACTIVE').reduce((s, i) => s + i.dailyIncome, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Downline Commissions (L1/L2/L3):</span>
                  <span className="font-bold font-mono text-blue-600">
                    ₹{Math.round(investments.filter(i => i.status === 'ACTIVE').reduce((s, i) => s + i.dailyIncome, 0) * 0.17).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-800">Contract Days Elapsed:</span>
                  <span className="text-indigo-600 font-mono">+1 Day Advanced</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <span className="font-bold block">Engine Automation Rules:</span>
                • Increments elapsed days on every active contract.<br />
                • Immediately credits daily yield to user's wallet.<br />
                • Auto-terminates contracts that reach their duration.<br />
                • Records audited transactions in the Supabase ledger.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsYieldConfirmOpen(false)}
                  disabled={yieldProcessing}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={yieldProcessing}
                  onClick={async () => {
                    setYieldProcessing(true);
                    try {
                      const res = await triggerDailyYieldPayout();
                      showToast(res.message);
                      setYieldLastResult({
                        yieldDistributed: res.yieldDistributed,
                        commissionDistributed: res.commissionDistributed,
                        activeNodesCount: res.activeNodesCount
                      });
                      setIsYieldConfirmOpen(false);
                    } catch (err: any) {
                      showToast(err.message || 'Error running yield cycle', 'error');
                    } finally {
                      setYieldProcessing(false);
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition flex items-center gap-1.5"
                >
                  {yieldProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-slate-950" />
                  )}
                  <span>{yieldProcessing ? 'Distributing Payouts...' : 'Execute Cycle Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: DIRECT PLAN ASSIGNMENT MODAL (Bee Grow PlanRequests) ================= */}
      {isAssignPlanModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-black font-sans">
                  Direct Plan Assignment
                </h3>
                <p className="text-xs text-slate-300">Grant an active investment robot to {user.phone}</p>
              </div>
              <button
                onClick={() => setIsAssignPlanModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Investment Plan</label>
                <select
                  value={assignPlanId}
                  onChange={(e) => setAssignPlanId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                >
                  {catalog.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — ₹{plan.price.toLocaleString()} (₹{plan.dailyIncome}/day · {plan.durationDays}d)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={assignPlanQuantity}
                  onChange={(e) => setAssignPlanQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {(() => {
                const selectedPlan = catalog.find(p => p.id === assignPlanId) || catalog[0];
                const totalCost = selectedPlan ? selectedPlan.price * assignPlanQuantity : 0;
                const totalBonus = selectedPlan ? selectedPlan.bonus * assignPlanQuantity : 0;
                const dailyRev = selectedPlan ? selectedPlan.dailyIncome * assignPlanQuantity : 0;

                return (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Robot Model:</span>
                      <span className="font-bold text-slate-800">{selectedPlan?.robotModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Contract Value:</span>
                      <span className="font-mono font-bold text-slate-800">₹{totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Daily Revenue Yield:</span>
                      <span className="font-mono font-bold text-emerald-600">₹{dailyRev.toLocaleString()}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Instant Welcome Bonus:</span>
                      <span className="font-mono font-bold text-amber-600">+₹{totalBonus.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await assignPlanToUser(user.id || 'User5294', assignPlanId, assignPlanQuantity);
                    showToast(res.message);
                    setIsAssignPlanModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/25"
                >
                  <Check className="w-4 h-4" />
                  <span>Assign Contract Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: USER 360° COMPREHENSIVE MANAGEMENT MODAL (Bee Grow UserDetail.tsx) ================= */}
      {isUser360Open && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-black font-sans text-lg text-blue-400">
                  VIP{user.vipLevel}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black font-sans">
                      {user.phone} · User 360° Profile
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                      {user.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-mono">
                    ID: {user.id || 'User5294'} · Invite Code: {user.inviteCode} · Joined: {user.joinDate || '2026-03-12'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUser360Open(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Tabs Navigation */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-2 overflow-x-auto shrink-0 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview & Balances' },
                { id: 'security', label: 'Security & Bank Lock' },
                { id: 'plans', label: `Active Plans (${investments.length})` },
                { id: 'network', label: `Downline Network (${teamMembers.length})` },
                { id: 'transactions', label: `Audit Trail (${transactions.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUser360Tab(tab.id as any)}
                  className={`py-3 px-3.5 border-b-2 font-bold transition whitespace-nowrap ${
                    user360Tab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* TAB 1: OVERVIEW & BALANCES */}
              {user360Tab === 'overview' && (
                <div className="space-y-4">
                  {/* Financial Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Available Balance</span>
                      <span className="font-mono font-black text-xl text-blue-600">₹{user.availableBalance.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Withdrawable Balance</span>
                      <span className="font-mono font-black text-xl text-emerald-600">₹{user.withdrawableBalance.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Recharged</span>
                      <span className="font-mono font-black text-xl text-slate-800">₹{user.totalRecharge.toLocaleString()}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Income</span>
                      <span className="font-mono font-black text-xl text-indigo-600">₹{user.totalIncome.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Beneficiary Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Bound Bank Account & UPI</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Holder:</span>
                        <span className="font-bold text-slate-800">{user.bankAccount.accountHolder || 'Not bound'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Bank Name:</span>
                        <span className="font-bold text-slate-800">{user.bankAccount.bankName || 'Not bound'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Number:</span>
                        <span className="font-mono font-bold text-slate-800">{user.bankAccount.accountNumber || 'Not bound'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">IFSC Code:</span>
                        <span className="font-mono font-bold text-blue-600">{user.bankAccount.ifscCode || 'Not bound'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">UPI ID:</span>
                        <span className="font-mono font-bold text-slate-800">{user.bankAccount.upiId || 'Not bound'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Binding Status:</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${user.bankAccount.isBound ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {user.bankAccount.isBound ? 'Verified & Bound' : 'Unbound'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SECURITY & BANK LOCK (Bee Grow PIN logic) */}
              {user360Tab === 'security' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-2">
                      <LockKeyhole className="w-4 h-4 text-blue-600" />
                      <span>Security PIN & Frontend Safeguards</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-bold text-slate-700 block">4-Digit Security PIN (FanCode default)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={securityPinInput}
                            onChange={(e) => setSecurityPinInput(e.target.value)}
                            className="px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-sm text-blue-600 outline-hidden w-36"
                          />
                          <button
                            onClick={async () => {
                              await updateUserSecurity(user.id || 'User5294', { pin: securityPinInput });
                              showToast(`Security PIN updated to: ${securityPinInput}`);
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
                          >
                            Update PIN
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">Used for withdrawal authorizations and sensitive security checkpoints.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-slate-700 block">Bank Account Details Lock</label>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                          <div>
                            <span className="font-bold text-slate-800 block">
                              {user.bankDetailsLocked ? '🔒 Account Locked' : '🔓 Account Modifiable'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {user.bankDetailsLocked ? 'User cannot edit bank card in app' : 'User can freely edit bank card'}
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              const newLock = !user.bankDetailsLocked;
                              await updateUserSecurity(user.id || 'User5294', { bankDetailsLocked: newLock });
                              showToast(`Bank details lock set to: ${newLock}`);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                              user.bankDetailsLocked ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {user.bankDetailsLocked ? 'Unlock' : 'Lock Now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVE PLANS */}
              {user360Tab === 'plans' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Active Robot Contracts ({investments.length})
                    </h4>
                    <button
                      onClick={() => setIsAssignPlanModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign New Plan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {investments.map(inv => (
                      <div key={inv.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900">{inv.productName} (Qty: {inv.quantity})</span>
                          <span className="font-mono text-emerald-600 font-bold">₹{inv.dailyIncome}/day</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>Invested: ₹{inv.totalInvested.toLocaleString()}</span>
                          <span>Active: {inv.daysElapsed} days</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: NETWORK */}
              {user360Tab === 'network' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Direct & Multi-Level Downline Members ({teamMembers.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {teamMembers.map(m => (
                      <div key={m.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <span className="font-mono font-bold text-slate-800 block">{m.phone}</span>
                          <span className="text-[10px] text-slate-400">Level {m.level} · Joined {m.joinDate}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-blue-600 block">₹{m.rechargeAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-emerald-600 font-bold font-mono">
                            +₹{m.commissionGenerated.toLocaleString()} comm
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TRANSACTIONS */}
              {user360Tab === 'transactions' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Transaction History ({transactions.length})
                  </h4>
                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                    {transactions.map(t => (
                      <div key={t.id} className="p-3 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800">{t.id}</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                              {t.type}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">{t.formattedTime || t.timestamp} · {t.description}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold text-xs ${t.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-bold">{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Balance Modal */}
      {isAddBalanceModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1536] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#70c028]" />
                <h3 className="font-bold text-base font-sans">Add Wallet Balance</h3>
              </div>
              <button
                onClick={() => setIsAddBalanceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Quick Credit Preset</label>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 2100, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setQuickBalanceAmt(String(amt))}
                      className="py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition"
                    >
                      +₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Custom Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 1000)"
                  value={quickBalanceAmt}
                  onChange={(e) => setQuickBalanceAmt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Promotional Bonus or Recharge Adjustment"
                  value={quickBalanceNote}
                  onChange={(e) => setQuickBalanceNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-[#70c028]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBalanceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = Number(quickBalanceAmt);
                    if (!val || val <= 0) {
                      showToast('Please enter an amount greater than 0', 'error');
                      return;
                    }
                    adjustUserBalance(val, quickBalanceNote || 'Admin Wallet Credit');
                    showToast(`₹${val.toLocaleString()} credited successfully!`);
                    setIsAddBalanceModalOpen(false);
                    setQuickBalanceAmt('');
                    setQuickBalanceNote('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 font-extrabold text-xs shadow-md shadow-[#70c028]/20 transition"
                >
                  Confirm Credit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

