import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  InvestmentProduct, 
  UserInvestment, 
  Transaction, 
  BankAccount, 
  TeamMember, 
  MemberPlanHolding,
  UserProfile, 
  PlatformSettings,
  DailyWithdrawalLog
} from '../types';
import { PRODUCTS_CATALOG, resolveProductImage } from '../data/products';
import { 
  supabase,
  fetchPlatformSettings,
  updatePlatformSettingsDB,
  fetchInvestmentProducts,
  saveInvestmentProductDB,
  deleteInvestmentProductDB,
  fetchUserProfile,
  updateUserProfileDB,
  updateBankAccountDB,
  fetchTransactions,
  insertTransactionDB,
  updateTransactionStatusDB,
  fetchUserInvestments,
  saveUserInvestmentDB,
  cancelUserInvestmentDB,
  fetchTeamMembersWithPlans,
  saveTeamMemberDB,
  deleteTeamMemberDB,
  saveMemberPlanHoldingDB,
  deleteMemberPlanHoldingDB,
  getAuthSession,
  signOutUser,
  ensureUserProfile
} from '../lib/supabase';

interface AppContextType {
  user: UserProfile;
  investments: UserInvestment[];
  transactions: Transaction[];
  teamMembers: TeamMember[];
  catalog: InvestmentProduct[];
  activeTab: 'home' | 'invite' | 'contact' | 'team' | 'profile';
  setActiveTab: (tab: 'home' | 'invite' | 'contact' | 'team' | 'profile') => void;
  
  // Modals
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  showBuyModal: InvestmentProduct | null;
  setShowBuyModal: (product: InvestmentProduct | null) => void;
  showCustomerCare: boolean;
  setShowCustomerCare: (show: boolean) => void;
  showOrdersModal: boolean;
  setShowOrdersModal: (show: boolean) => void;
  showBankCardModal: boolean;
  setShowBankCardModal: (show: boolean) => void;
  showColorTrustGuide: boolean;
  setShowColorTrustGuide: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;

  // Actions
  rechargeWallet: (amount: number, utr: string) => { success: boolean; message: string };
  purchaseProduct: (productId: string, quantity: number) => { success: boolean; message: string };
  requestWithdrawal: (amount: number) => { success: boolean; message: string };
  updateBankAccount: (bank: BankAccount) => void;
  unharvestedYield: number;
  isHarvestedToday: boolean;
  unharvestedDays: number;
  claimDailyReturns: () => { 
    success: boolean; 
    message: string; 
    claimed: number;
    alreadyHarvested?: boolean;
    daysStacked?: number;
  };
  
  // Prerequisite & limit helpers
  canInvestInProduct: (productId: string) => { allowed: boolean; reason?: string };
  getProductOwnedCount: (productId: string) => number;
  
  // Withdrawal 12:30 AM next day logic
  simulatedTime: Date;
  advanceTimeToNextDayAfter1230: () => void;
  resetSimulatedTime: () => void;
  checkWithdrawalEligibility: () => {
    isEligible: boolean;
    reason: string;
    nextUnlockTime: string;
    isWithinDailyWindow: boolean;
    hasInvestedToday: boolean;
  };

  // ADMIN CONTROL METHODS
  addPlan: (plan: InvestmentProduct) => { success: boolean; message: string };
  updatePlan: (id: string, updatedPlan: Partial<InvestmentProduct>) => { success: boolean; message: string };
  deletePlan: (id: string) => { success: boolean; message: string };
  resetCatalogToDefault: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  adjustUserBalance: (amount: number, reason: string) => void;
  approveWithdrawal: (transactionId: string, bankReference?: string, adminNote?: string) => { success: boolean; message: string };
  rejectWithdrawal: (transactionId: string, reason?: string) => { success: boolean; message: string };
  approveRecharge: (transactionId: string) => { success: boolean; message: string };
  rejectRecharge: (transactionId: string, reason?: string) => { success: boolean; message: string };
  triggerDailyYieldPayout: () => { success: boolean; message: string; yieldDistributed: number; commissionDistributed: number; activeNodesCount: number };
  performNightResetSettlement: (resetDate?: Date) => { success: boolean; message: string; yieldDistributed: number; commissionDistributed: number; activeNodesCount: number; memberPlansUpdatedCount?: number };
  assignPlanToUser: (userId: string, productId: string, quantity: number) => { success: boolean; message: string };
  updateUserSecurity: (userId: string, updates: { pin?: string; password?: string; bankDetailsLocked?: boolean }) => void;
  addCustomTransaction: (txn: Omit<Transaction, 'id' | 'timestamp' | 'formattedTime'>) => void;
  cancelInvestment: (investmentId: string) => { success: boolean; message: string };
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  resetPlatformSettings: () => void;

  // REFERRAL NETWORK & MEMBER PLANS ADMIN METHODS
  updateTeamMember: (id: string, updated: Partial<TeamMember>) => void;
  addTeamMember: (member: TeamMember) => { success: boolean; message: string };
  deleteTeamMember: (id: string) => { success: boolean; message: string };
  addMemberPlan: (memberId: string, plan: MemberPlanHolding) => { success: boolean; message: string };
  updateMemberPlan: (memberId: string, planHoldingId: string, updated: Partial<MemberPlanHolding>) => { success: boolean; message: string };
  deleteMemberPlan: (memberId: string, planHoldingId: string) => { success: boolean; message: string };
  resetTeamToDefault: () => void;

  // DAILY WITHDRAWAL LOGS
  getDailyWithdrawalLogs: () => DailyWithdrawalLog[];
  navigateToRecharge: () => void;
  setNavigateToRechargeFn: (fn: () => void) => void;
  refreshUserData?: (userId?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_BANK: BankAccount = {
  accountHolder: '',
  accountNumber: '',
  ifscCode: '',
  bankName: '',
  upiId: '',
  isBound: false,
};

const INITIAL_TEAM: TeamMember[] = [
  { 
    id: 'TM-101', 
    phone: '+91 98234 11029', 
    joinDate: '2026-10-02', 
    level: 1, 
    inviterId: 'User5294 (You)',
    inviteCount: 4, 
    rechargeAmount: 4000, 
    teamInvested: 12500,
    commissionGenerated: 880, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-101-A',
        planId: 'C',
        planName: 'Product C',
        robotModel: 'ASIMO-V Precision Service Biped',
        quantity: 1,
        unitPrice: 4000,
        totalInvested: 4000,
        dailyYield: 950,
        purchaseDate: '2026-10-02',
        daysElapsed: 8,
        durationDays: 150,
        totalEarned: 7600,
        status: 'ACTIVE'
      }
    ]
  },
  { 
    id: 'TM-102', 
    phone: '+91 97112 88472', 
    joinDate: '2026-10-04', 
    level: 1, 
    inviterId: 'User5294 (You)',
    inviteCount: 2, 
    rechargeAmount: 2100, 
    teamInvested: 4200,
    commissionGenerated: 462, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-102-A',
        planId: 'B',
        planName: 'Product B',
        robotModel: 'Spot-X Quadruped Patrol Bot',
        quantity: 1,
        unitPrice: 2100,
        totalInvested: 2100,
        dailyYield: 500,
        purchaseDate: '2026-10-04',
        daysElapsed: 6,
        durationDays: 150,
        totalEarned: 3000,
        status: 'ACTIVE'
      }
    ]
  },
  { 
    id: 'TM-103', 
    phone: '+91 88390 44910', 
    joinDate: '2026-10-06', 
    level: 2, 
    inviterId: 'TM-101',
    inviteCount: 1, 
    rechargeAmount: 1040, 
    teamInvested: 520,
    commissionGenerated: 20.8, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-103-A',
        planId: 'A',
        planName: 'Product A',
        robotModel: 'Nao Core Micro Assistant',
        quantity: 2,
        unitPrice: 520,
        totalInvested: 1040,
        dailyYield: 260,
        purchaseDate: '2026-10-06',
        daysElapsed: 4,
        durationDays: 150,
        totalEarned: 1040,
        status: 'ACTIVE'
      }
    ]
  },
  { 
    id: 'TM-104', 
    phone: '+91 91456 22091', 
    joinDate: '2026-10-07', 
    level: 3, 
    inviterId: 'TM-103',
    inviteCount: 0, 
    rechargeAmount: 520, 
    teamInvested: 0,
    commissionGenerated: 5.2, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-104-A',
        planId: 'A',
        planName: 'Product A',
        robotModel: 'Nao Core Micro Assistant',
        quantity: 1,
        unitPrice: 520,
        totalInvested: 520,
        dailyYield: 130,
        purchaseDate: '2026-10-07',
        daysElapsed: 3,
        durationDays: 150,
        totalEarned: 390,
        status: 'ACTIVE'
      }
    ]
  },
  { 
    id: 'TM-105', 
    phone: '+91 96541 77290', 
    joinDate: '2026-10-08', 
    level: 1, 
    inviterId: 'User5294 (You)',
    inviteCount: 3, 
    rechargeAmount: 8200, 
    teamInvested: 6000,
    commissionGenerated: 1804, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-105-A',
        planId: 'D',
        planName: 'Product D',
        robotModel: 'Atlas Prime AI Diagnostics Android',
        quantity: 1,
        unitPrice: 8200,
        totalInvested: 8200,
        dailyYield: 2000,
        purchaseDate: '2026-10-08',
        daysElapsed: 2,
        durationDays: 150,
        totalEarned: 4000,
        status: 'ACTIVE'
      }
    ]
  },
  { 
    id: 'TM-106', 
    phone: '+91 81230 99401', 
    joinDate: '2026-10-09', 
    level: 2, 
    inviterId: 'TM-102',
    inviteCount: 0, 
    rechargeAmount: 2100, 
    teamInvested: 0,
    commissionGenerated: 42, 
    status: 'ACTIVE',
    plans: [
      {
        id: 'MP-106-A',
        planId: 'B',
        planName: 'Product B',
        robotModel: 'Spot-X Quadruped Patrol Bot',
        quantity: 1,
        unitPrice: 2100,
        totalInvested: 2100,
        dailyYield: 500,
        purchaseDate: '2026-10-09',
        daysElapsed: 1,
        durationDays: 150,
        totalEarned: 500,
        status: 'ACTIVE'
      }
    ]
  }
];

const DEFAULT_SETTINGS: PlatformSettings = {
  minRecharge: 520,
  minWithdrawal: 150,
  withdrawalFeePercent: 10,
  dailyWithdrawalWindowStart: '00:30',
  dailyWithdrawalWindowEnd: '17:00',
  enforceNextDayWithdrawalLock: true,
  telegramSupportUrl: 'https://t.me/fancode_support',
  telegramChannelUrl: 'https://t.me/fancode_official',
  platformAnnouncement: 'FanCode Official Sports Investment Platform. Daily yields processing 24/7.',
  rechargeUpiId: 'fancode.payments@hdfcbank',
  rechargePayeeName: 'FanCode Payments',
  rechargeBankName: 'HDFC Bank',
  rechargeQrImageUrl: '',
  rechargeAccountHolder: 'FanCode Technologies Pvt Ltd',
  rechargeAccountNumber: '50200084729103',
  rechargeIfscCode: 'HDFC0000128',
  rechargeInstructions: 'Scan using PhonePe, Google Pay, Paytm, or BHIM. After payment is successful, enter the 12-digit UTR transaction reference number below.',
  rechargeQuickAmounts: [520, 1999, 2100, 5999, 8200, 17960],
  rechargeGatewayActive: true,
  rechargeQrList: [
    {
      id: 'qr-1',
      label: 'Primary UPI (PhonePe / GPay / BHIM)',
      upiId: 'fancode.payments@hdfcbank',
      payeeName: 'FanCode Payments',
      qrImageUrl: '',
      isActive: true,
    }
  ],
  rechargeBankList: [
    {
      id: 'bank-1',
      bankName: 'HDFC Bank',
      accountHolder: 'FanCode Technologies Pvt Ltd',
      accountNumber: '50200084729103',
      ifscCode: 'HDFC0000128',
      accountType: 'Current Account',
      branch: 'Indiranagar Branch',
      isActive: true,
    }
  ],
};

// Helper function: calculate how many night resets (00:30 AM) have passed since purchase
export function calculateDaysPassed(
  purchaseTimestampOrDate: number | string,
  currentTime: Date,
  resetTimeStr: string = '00:30',
  fallbackDays: number = 0
): number {
  if (!purchaseTimestampOrDate) return fallbackDays;

  let pDate: Date;
  if (typeof purchaseTimestampOrDate === 'number') {
    pDate = new Date(purchaseTimestampOrDate);
  } else {
    pDate = new Date(purchaseTimestampOrDate);
    if (isNaN(pDate.getTime())) {
      const parts = String(purchaseTimestampOrDate).split('/');
      if (parts.length === 3) {
        pDate = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
      }
    }
  }

  if (isNaN(pDate.getTime())) return fallbackDays;

  const [resetH, resetM] = (resetTimeStr || '00:30').split(':').map(Number);
  if (currentTime.getTime() < pDate.getTime()) return 0;

  let days = 0;
  const cursor = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), resetH, resetM || 0, 0, 0);

  if (pDate.getTime() >= cursor.getTime()) {
    cursor.setDate(cursor.getDate() + 1);
  }

  while (cursor.getTime() <= currentTime.getTime()) {
    days++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

// Helper: Get the daily cycle date string (YYYY-MM-DD) taking 00:30 AM reset into account
export function getCycleDateKey(date: Date, resetTimeStr: string = '00:30'): string {
  const [resetH, resetM] = (resetTimeStr || '00:30').split(':').map(Number);
  const d = new Date(date);
  if (d.getHours() < resetH || (d.getHours() === resetH && d.getMinutes() < (resetM || 0))) {
    d.setDate(d.getDate() - 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Calculate total cycles elapsed for an active plan from its purchase date
export function getInvestmentEligibleCycles(
  inv: UserInvestment,
  currentDate: Date = new Date(),
  resetTimeStr: string = '00:30'
): number {
  if (inv.status !== 'ACTIVE') return inv.daysElapsed || 0;

  const pDate = inv.purchaseTimestamp ? new Date(inv.purchaseTimestamp) : new Date(inv.purchaseDateFormatted);
  if (isNaN(pDate.getTime())) {
    return Math.max(1, (inv.daysElapsed || 0) + 1);
  }

  const purchaseCycleKey = getCycleDateKey(pDate, resetTimeStr);
  const currentCycleKey = getCycleDateKey(currentDate, resetTimeStr);

  const pParts = purchaseCycleKey.split('-').map(Number);
  const cParts = currentCycleKey.split('-').map(Number);

  const pUtc = Date.UTC(pParts[0], pParts[1] - 1, pParts[2]);
  const cUtc = Date.UTC(cParts[0], cParts[1] - 1, cParts[2]);

  const diffDays = Math.max(0, Math.round((cUtc - pUtc) / (1000 * 60 * 60 * 24)));
  const cycles = diffDays + 1; // Purchase cycle is Cycle 1
  return Math.min(cycles, 150);
}

// Helper: Get unharvested days/amount for a single investment
export function getInvestmentUnharvested(
  inv: UserInvestment,
  currentDate: Date = new Date(),
  resetTimeStr: string = '00:30'
): { eligibleCycles: number; harvestedCycles: number; unharvestedCycles: number; unharvestedAmount: number; isHarvestedToday: boolean } {
  if (inv.status !== 'ACTIVE') {
    return { eligibleCycles: 0, harvestedCycles: 0, unharvestedCycles: 0, unharvestedAmount: 0, isHarvestedToday: true };
  }

  const currentCycleKey = getCycleDateKey(currentDate, resetTimeStr);
  const eligibleCycles = getInvestmentEligibleCycles(inv, currentDate, resetTimeStr);

  let harvestedCycles = 0;
  let localHarvestMap: Record<string, { cyclesHarvested: number; lastHarvestDate: string }> = {};
  try {
    const saved = localStorage.getItem('fancode_harvest_map');
    if (saved) localHarvestMap = JSON.parse(saved);
  } catch (e) {}

  const mapped = localHarvestMap[inv.id];

  if (inv.cyclesHarvested !== undefined) {
    harvestedCycles = inv.cyclesHarvested;
  } else if (mapped?.cyclesHarvested !== undefined) {
    harvestedCycles = mapped.cyclesHarvested;
  } else if (inv.lastHarvestDate === currentCycleKey || mapped?.lastHarvestDate === currentCycleKey) {
    harvestedCycles = eligibleCycles;
  } else if (inv.totalEarned && inv.dailyIncome && inv.totalEarned > 0) {
    harvestedCycles = Math.min(eligibleCycles, Math.floor(inv.totalEarned / inv.dailyIncome));
  } else {
    harvestedCycles = 0;
  }

  const unharvestedCycles = Math.max(0, eligibleCycles - harvestedCycles);
  const unharvestedAmount = unharvestedCycles * inv.dailyIncome;
  const isHarvestedToday = unharvestedCycles === 0;

  return {
    eligibleCycles,
    harvestedCycles,
    unharvestedCycles,
    unharvestedAmount,
    isHarvestedToday
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'invite' | 'contact' | 'team' | 'profile'>('home');
  const navigateToRechargeRef = React.useRef<() => void>(() => {});
  const navigateToRecharge = () => navigateToRechargeRef.current();
  const setNavigateToRechargeFn = (fn: () => void) => { navigateToRechargeRef.current = fn; };
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [showBuyModal, setShowBuyModal] = useState<InvestmentProduct | null>(null);
  const [showCustomerCare, setShowCustomerCare] = useState<boolean>(false);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);
  const [showBankCardModal, setShowBankCardModal] = useState<boolean>(false);
  const [showColorTrustGuide, setShowColorTrustGuide] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (localStorage.getItem('fancode_admin_auth') || localStorage.getItem('robovest_admin_auth')) === 'true';
  });

  // Dynamic Catalog backed by Supabase
  const [catalog, setCatalog] = useState<InvestmentProduct[]>(() => {
    try {
      const saved = localStorage.getItem('fancode_catalog_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: InvestmentProduct) => ({
            ...p,
            image: resolveProductImage(p.id, p.image)
          }));
        }
      }
    } catch (e) {
      console.error('Failed to parse catalog from storage', e);
    }
    return PRODUCTS_CATALOG;
  });

  // Platform Settings backed by Supabase
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('fancode_settings') || localStorage.getItem('robovest_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.telegramChannelUrl) {
          parsed.telegramChannelUrl = String(parsed.telegramChannelUrl).replace(/robovest/gi, 'fancode');
        }
        if (parsed.telegramSupportUrl) {
          parsed.telegramSupportUrl = String(parsed.telegramSupportUrl).replace(/robovest/gi, 'fancode');
        }
        if (parsed.rechargeUpiId) {
          parsed.rechargeUpiId = String(parsed.rechargeUpiId).replace(/robovest/gi, 'fancode');
        }
        if (parsed.platformAnnouncement) {
          parsed.platformAnnouncement = String(parsed.platformAnnouncement).replace(/robovest/gi, 'fancode');
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Simulated Time
  const [simulatedTime, setSimulatedTime] = useState<Date>(new Date());

  // Guest User template
  const GUEST_USER: UserProfile = {
    id: '',
    email: '',
    phone: '',
    inviteCode: '',
    vipLevel: 1,
    availableBalance: 0,
    withdrawableBalance: 0,
    totalRecharge: 0,
    totalIncome: 0,
    isLoggedIn: false,
    bankAccount: INITIAL_BANK,
  };

  // User Profile backed by Supabase Auth
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fancode_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.id !== 'User5294') return parsed;
      }
    } catch (e) {
      console.error('Failed to parse user from storage', e);
    }
    return GUEST_USER;
  });

  // Investments backed by Supabase
  const [investments, setInvestments] = useState<UserInvestment[]>(() => {
    try {
      const saved = localStorage.getItem('fancode_investments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Transactions backed by Supabase
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('fancode_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Team Members backed by Supabase
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('fancode_team_members') || localStorage.getItem('robovest_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse team members from storage', e);
    }
    return INITIAL_TEAM;
  });

  const refreshUserData = async (targetUserId?: string) => {
    try {
      const userId = targetUserId || user.id;
      if (!userId) return;

      const [profileRes, userInvs, userTxns] = await Promise.all([
        fetchUserProfile(userId),
        fetchUserInvestments(userId),
        fetchTransactions(userId)
      ]);

      if (profileRes) {
        setUser(profileRes.user);
      }
      setInvestments(userInvs || []);
      setTransactions(userTxns || []);
    } catch (err) {
      console.error('refreshUserData error:', err);
    }
  };

  const logoutUser = async () => {
    await signOutUser();
    setUser(GUEST_USER);
    setInvestments([]);
    setTransactions([]);
    localStorage.removeItem('fancode_user');
    localStorage.removeItem('fancode_investments');
    localStorage.removeItem('fancode_transactions');
  };

  // ---------------------------------------------------------------------------
  // SUPABASE DATA FETCHING & REALTIME SYNCHRONIZATION
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        // 1. Fetch public platform settings and catalog
        const [remoteSettings, remoteProducts, remoteTeam] = await Promise.all([
          fetchPlatformSettings(),
          fetchInvestmentProducts(),
          fetchTeamMembersWithPlans()
        ]);

        if (!isMounted) return;

        if (remoteSettings) {
          setPlatformSettings(prev => ({
            ...prev,
            ...remoteSettings,
            telegramChannelUrl: remoteSettings.telegramChannelUrl ? remoteSettings.telegramChannelUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_official',
            telegramSupportUrl: remoteSettings.telegramSupportUrl ? remoteSettings.telegramSupportUrl.replace(/robovest/gi, 'fancode') : 'https://t.me/fancode_support',
            rechargeQrList: (remoteSettings.rechargeQrList && remoteSettings.rechargeQrList.length > 0)
              ? remoteSettings.rechargeQrList
              : (prev.rechargeQrList && prev.rechargeQrList.length > 0 ? prev.rechargeQrList : DEFAULT_SETTINGS.rechargeQrList),
            rechargeBankList: (remoteSettings.rechargeBankList && remoteSettings.rechargeBankList.length > 0)
              ? remoteSettings.rechargeBankList
              : (prev.rechargeBankList && prev.rechargeBankList.length > 0 ? prev.rechargeBankList : DEFAULT_SETTINGS.rechargeBankList),
          }));
        }

        if (remoteProducts && remoteProducts.length > 0) {
          const resolved = remoteProducts.map(p => ({
            ...p,
            image: resolveProductImage(p.id, p.image)
          }));
          setCatalog(resolved);
        }

        if (remoteTeam && remoteTeam.length > 0) {
          setTeamMembers(remoteTeam);
        }

        // 2. Check active Supabase Auth session
        const { session } = await getAuthSession();
        if (session?.user && isMounted) {
          const profileRes = await ensureUserProfile(
            session.user.id, 
            session.user.email!, 
            session.user.user_metadata
          );

          if (profileRes && isMounted) {
            setUser(profileRes.user);
          }

          const [userInvs, userTxns] = await Promise.all([
            fetchUserInvestments(session.user.id),
            fetchTransactions(session.user.id)
          ]);

          if (isMounted) {
            setInvestments(userInvs || []);
            setTransactions(userTxns || []);
          }
        }
      } catch (err) {
        console.error('Failed to initialize app from Supabase:', err);
      }
    }

    initializeApp();

    // 3. Listen to Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const profileRes = await ensureUserProfile(session.user.id, session.user.email!, session.user.user_metadata);
          if (profileRes && isMounted) {
            setUser(profileRes.user);
          }
          const [userInvs, userTxns] = await Promise.all([
            fetchUserInvestments(session.user.id),
            fetchTransactions(session.user.id)
          ]);
          if (isMounted) {
            setInvestments(userInvs || []);
            setTransactions(userTxns || []);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(GUEST_USER);
        setInvestments([]);
        setTransactions([]);
        localStorage.removeItem('fancode_user');
        localStorage.removeItem('fancode_investments');
        localStorage.removeItem('fancode_transactions');
      }
    });

    // 4. Real-time subscriptions across public catalog and settings
    const publicSubscription = supabase
      .channel('public_platform_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'platform_settings' },
        async () => {
          const s = await fetchPlatformSettings();
          if (s && isMounted) setPlatformSettings(prev => ({ ...prev, ...s }));
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'investment_products' },
        async () => {
          const p = await fetchInvestmentProducts();
          if (p && p.length > 0 && isMounted) {
            setCatalog(p.map(x => ({ ...x, image: resolveProductImage(x.id, x.image) })));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
      supabase.removeChannel(publicSubscription);
    };
  }, []);

  // 5. User-specific real-time listener (when user is logged in)
  useEffect(() => {
    if (!user.isLoggedIn || !user.id) return;

    const userChannel = supabase
      .channel(`user_realtime_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        async () => {
          const updated = await fetchTransactions(user.id);
          setTransactions(updated);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles', filter: `id=eq.${user.id}` },
        async () => {
          const updated = await fetchUserProfile(user.id);
          if (updated) setUser(updated.user);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_investments', filter: `user_id=eq.${user.id}` },
        async () => {
          const updated = await fetchUserInvestments(user.id);
          setInvestments(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(userChannel);
    };
  }, [user.id, user.isLoggedIn]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    localStorage.setItem('fancode_catalog_v3', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('fancode_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem('fancode_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fancode_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('fancode_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fancode_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('fancode_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Count how many units user already owns of a product
  const getProductOwnedCount = (productId: string): number => {
    return investments
      .filter(inv => inv.productId === productId && inv.status === 'ACTIVE')
      .reduce((sum, inv) => sum + inv.quantity, 0);
  };

  // Helper: Prerequisite check
  const canInvestInProduct = (productId: string): { allowed: boolean; reason?: string } => {
    const product = catalog.find(p => p.id === productId);
    if (!product) return { allowed: false, reason: 'Product does not exist.' };

    if (!product.requiresPriorInvestment) {
      return { allowed: true };
    }

    const foundationalProductIds = catalog
      .filter(p => !p.requiresPriorInvestment)
      .map(p => p.id);

    const hasBaseInvestment = investments.some(inv => 
      foundationalProductIds.includes(inv.productId) && inv.status === 'ACTIVE'
    );

    if (!hasBaseInvestment) {
      return {
        allowed: false,
        reason: `Prerequisite Required: You must invest in a foundational plan (such as Product A, B, C, or D) before unlocking ${product.name}.`
      };
    }

    return { allowed: true };
  };

  // Helper: Check withdrawal eligibility
  const checkWithdrawalEligibility = () => {
    const curTime = simulatedTime;
    const hours = curTime.getHours();
    const minutes = curTime.getMinutes();
    const currentMinutesOfDay = hours * 60 + minutes;

    const [startH, startM] = platformSettings.dailyWithdrawalWindowStart.split(':').map(Number);
    const [endH, endM] = platformSettings.dailyWithdrawalWindowEnd.split(':').map(Number);
    const windowStartM = (startH || 0) * 60 + (startM || 0);
    const windowEndM = (endH || 17) * 60 + (endM || 0);

    const isWithinDailyWindow = currentMinutesOfDay >= windowStartM && currentMinutesOfDay <= windowEndM;

    if (platformSettings.enforceNextDayWithdrawalLock) {
      const simYear = curTime.getFullYear();
      const simMonth = curTime.getMonth();
      const simDate = curTime.getDate();

      const todayInvestments = investments.filter(inv => {
        const invDate = new Date(inv.purchaseTimestamp);
        return (
          invDate.getFullYear() === simYear &&
          invDate.getMonth() === simMonth &&
          invDate.getDate() === simDate
        );
      });

      const hasInvestedToday = todayInvestments.length > 0;

      const tomorrow = new Date(curTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 30, 0, 0);

      const nextUnlockFormatted = `Tomorrow at 12:30 AM (${tomorrow.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      })}, 00:30 hrs)`;

      if (hasInvestedToday) {
        return {
          isEligible: false,
          reason: 'New Investment In Effect: Withdrawals for funds invested today unlock Next Day after 12:30 AM.',
          nextUnlockTime: nextUnlockFormatted,
          isWithinDailyWindow,
          hasInvestedToday: true,
        };
      }
    }

    if (!isWithinDailyWindow) {
      return {
        isEligible: false,
        reason: `Outside Daily Withdrawal Hours: Daily withdrawals are processed between ${platformSettings.dailyWithdrawalWindowStart} AM and ${platformSettings.dailyWithdrawalWindowEnd} hrs.`,
        nextUnlockTime: `Next Window: ${platformSettings.dailyWithdrawalWindowStart} AM`,
        isWithinDailyWindow: false,
        hasInvestedToday: false,
      };
    }

    return {
      isEligible: true,
      reason: 'Eligible for withdrawal! Daily window active and no active lock.',
      nextUnlockTime: `Open Now until ${platformSettings.dailyWithdrawalWindowEnd} hrs`,
      isWithinDailyWindow: true,
      hasInvestedToday: false,
    };
  };



  // ---------------------------------------------------------------------------
  // AUTOMATED EVERYDAY NIGHT RESET ENGINE
  // (Advances days elapsed for all active user & downline plans, credits returns & commissions)
  // ---------------------------------------------------------------------------
  const performNightResetSettlement = (resetDate: Date = new Date()) => {
    let completedInvsCount = 0;
    let memberPlansUpdatedCount = 0;

    // Synchronous yield sum of all active user investments
    const activeInvs = investments.filter(inv => inv.status === 'ACTIVE');
    const yieldSum = activeInvs.reduce((sum, inv) => sum + inv.dailyIncome, 0);
    let commissionSum = 0;

    // 1. Advance all active user robot investments
    setInvestments(prevInvs => {
      return prevInvs.map(inv => {
        if (inv.status !== 'ACTIVE') return inv;
        const dailyYield = inv.dailyIncome;
        const newDays = calculateDaysPassed(inv.purchaseTimestamp || inv.purchaseDateFormatted, resetDate, platformSettings.dailyWithdrawalWindowStart, inv.daysElapsed + 1);
        const newEarned = newDays * dailyYield;
        const isCompleted = newDays >= 150 || newEarned >= (inv.totalInvested * 2);
        if (isCompleted) completedInvsCount++;

        const updated: UserInvestment = {
          ...inv,
          daysElapsed: newDays,
          totalEarned: newEarned,
          status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        };
        saveUserInvestmentDB(user.id, updated);
        return updated;
      });
    });

    // 2. Advance all team members' plan holdings (Level 1, Level 2, Level 3)
    const levelRates: Record<number, number> = { 1: 0.10, 2: 0.05, 3: 0.02 };

    setTeamMembers(prevTeam => {
      return prevTeam.map(m => {
        let memberPlansChanged = false;
        const updatedPlans = (m.plans || []).map(p => {
          if (p.status !== 'ACTIVE') return p;
          memberPlansChanged = true;
          memberPlansUpdatedCount++;
          const newDays = p.daysElapsed + 1;
          const newEarned = newDays * p.dailyYield;
          const isCompleted = newDays >= p.durationDays;
          const updatedPlan: MemberPlanHolding = {
            ...p,
            daysElapsed: newDays,
            totalEarned: newEarned,
            status: isCompleted ? ('COMPLETED' as const) : ('ACTIVE' as const)
          };
          saveMemberPlanHoldingDB(m.id, updatedPlan);
          return updatedPlan;
        });

        const rate = levelRates[m.level] || 0.01;
        const comm = yieldSum > 0 ? Math.round(yieldSum * rate * 100) / 100 : 0;
        if (comm > 0) commissionSum += comm;

        const updatedMember: TeamMember = {
          ...m,
          commissionGenerated: m.commissionGenerated + comm,
          plans: updatedPlans
        };

        if (memberPlansChanged || comm > 0) {
          saveTeamMemberDB(updatedMember, user.id);
        }

        return updatedMember;
      });
    });

    // 3. Referral commissions credited to user wallet if applicable
    if (commissionSum > 0) {
      setUser(prev => {
        const newAvail = prev.availableBalance + commissionSum;
        const newWithdr = prev.withdrawableBalance + commissionSum;
        const newIncome = prev.totalIncome + commissionSum;
        updateUserProfileDB(prev.id, {
          availableBalance: newAvail,
          withdrawableBalance: newWithdr,
          totalIncome: newIncome,
        });
        return {
          ...prev,
          availableBalance: newAvail,
          withdrawableBalance: newWithdr,
          totalIncome: newIncome,
        };
      });

      const commTxn: Transaction = {
        id: `TXN-COMM-${Date.now().toString().slice(-6)}`,
        type: 'COMMISSION',
        amount: commissionSum,
        status: 'COMPLETED',
        timestamp: resetDate.getTime(),
        formattedTime: resetDate.toLocaleString(),
        description: `Referral Level Commission Distributed Across Downline Network`,
        referenceId: `COMM-TREE-${Date.now().toString().slice(-4)}`
      };
      insertTransactionDB(user.id, commTxn);
      setTransactions(prev => [commTxn, ...prev]);
    }

    return {
      success: true,
      message: `Night reset completed! Active plans advanced to next cycle. Distributed ₹${commissionSum.toLocaleString()} in referral commissions. Daily yields of ₹${yieldSum.toLocaleString()} accumulated for manual harvest. ${completedInvsCount > 0 ? `${completedInvsCount} plan(s) completed.` : ''}`,
      yieldDistributed: yieldSum,
      commissionDistributed: commissionSum,
      activeNodesCount: investments.filter(inv => inv.status === 'ACTIVE').length,
      memberPlansUpdatedCount
    };
  };

  // Automated everyday night reset engine (Runs everyday at night reset time e.g. 00:30 AM / 12:30 AM)
  useEffect(() => {
    const checkAndExecuteNightReset = () => {
      const now = new Date();
      const todayKey = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
      const lastResetDate = localStorage.getItem('fancode_last_night_reset_date') || localStorage.getItem('robovest_last_night_reset_date');

      // Platform reset time (default 00:30 AM)
      const [resetH, resetM] = (platformSettings.dailyWithdrawalWindowStart || '00:30').split(':').map(Number);
      const isPastResetTime = now.getHours() > resetH || (now.getHours() === resetH && now.getMinutes() >= resetM);

      if (isPastResetTime && lastResetDate !== todayKey) {
        localStorage.setItem('fancode_last_night_reset_date', todayKey);
        performNightResetSettlement(now);
      }
    };

    checkAndExecuteNightReset();
    const interval = setInterval(checkAndExecuteNightReset, 30000);
    return () => clearInterval(interval);
  }, [platformSettings.dailyWithdrawalWindowStart]);

  // Time simulator actions
  const advanceTimeToNextDayAfter1230 = () => {
    const nextDay = new Date(simulatedTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 35, 0, 0);
    setSimulatedTime(nextDay);
    performNightResetSettlement(nextDay);
  };

  const resetSimulatedTime = () => {
    setSimulatedTime(new Date());
  };

  // Wallet recharge action
  const rechargeWallet = (amount: number, utr: string) => {
    if (!user.isLoggedIn || !user.id) {
      setShowAuthModal(true);
      return { success: false, message: 'Please sign in or register to recharge your account.' };
    }

    if (amount < platformSettings.minRecharge) {
      return { success: false, message: `Minimum recharge amount is ₹${platformSettings.minRecharge.toLocaleString()}.` };
    }

    const newTxn: Transaction = {
      id: `TXN-REC-${Date.now().toString().slice(-6)}`,
      type: 'RECHARGE',
      amount,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Wallet Deposit (UTR: ${utr || 'FAST-UPI'})`,
      referenceId: utr || `UTR-${Math.floor(100000000000 + Math.random() * 900000000000)}`
    };

    const newBalance = user.availableBalance + amount;
    const newTotalRecharge = user.totalRecharge + amount;

    setUser(prev => ({
      ...prev,
      availableBalance: newBalance,
      totalRecharge: newTotalRecharge,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    // Persist to Supabase
    insertTransactionDB(user.id, newTxn);
    updateUserProfileDB(user.id, {
      availableBalance: newBalance,
      totalRecharge: newTotalRecharge,
    });

    return { success: true, message: `Successfully recharged ₹${amount.toLocaleString()} into your account!` };
  };

  // Product purchase action
  const purchaseProduct = (productId: string, quantity: number) => {
    if (!user.isLoggedIn || !user.id) {
      setShowAuthModal(true);
      return { success: false, message: 'Please sign in or register to purchase plans.' };
    }

    const product = catalog.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Invalid product selected.' };

    const minPur = product.minPurchase || 1;
    const maxPur = product.maxPurchase || 10;

    if (quantity < minPur || quantity > maxPur) {
      return { success: false, message: `You can purchase minimum ${minPur} unit(s) and maximum ${maxPur} unit(s) at a time.` };
    }

    const currentlyOwned = getProductOwnedCount(productId);
    if (currentlyOwned + quantity > maxPur) {
      return {
        success: false,
        message: `Limit Exceeded: You currently own ${currentlyOwned} units. Maximum allowed per product is ${maxPur} units.`
      };
    }

    const prereq = canInvestInProduct(productId);
    if (!prereq.allowed) {
      return { success: false, message: prereq.reason || 'Prerequisites not met.' };
    }

    const totalCost = product.price * quantity;
    if (user.availableBalance < totalCost) {
      return {
        success: false,
        message: `Insufficient balance! Product total is ₹${totalCost.toLocaleString()}, but your available balance is ₹${user.availableBalance.toLocaleString()}. Please recharge.`
      };
    }

    const totalBonus = product.bonus * quantity;
    const totalDaily = product.dailyIncome * quantity;

    const newInvestment: UserInvestment = {
      id: `INV-${productId}-${Date.now().toString().slice(-6)}`,
      productId,
      productName: product.name,
      robotModel: product.robotModel,
      quantity,
      unitPrice: product.price,
      totalInvested: totalCost,
      dailyIncome: totalDaily,
      bonusReceived: totalBonus,
      purchaseTimestamp: simulatedTime.getTime(),
      purchaseDateFormatted: simulatedTime.toLocaleDateString(),
      daysElapsed: 0,
      totalEarned: 0,
      cyclesHarvested: 0,
      status: 'ACTIVE',
    };

    const purchaseTxn: Transaction = {
      id: `TXN-BUY-${Date.now().toString().slice(-6)}`,
      type: 'DAILY_RETURN',
      amount: -totalCost,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Purchased ${quantity}x ${product.name} (${product.robotModel})`,
      referenceId: newInvestment.id
    };

    const bonusTxn: Transaction = {
      id: `TXN-BON-${Date.now().toString().slice(-6)}`,
      type: 'PRODUCT_BONUS',
      amount: totalBonus,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Welcome Bonus for ${quantity}x ${product.name}`,
      referenceId: `BONUS-${productId}`
    };

    const updatedAvailBalance = user.availableBalance - totalCost + totalBonus;
    const updatedWithdrawableBalance = user.withdrawableBalance + totalBonus;
    const updatedTotalIncome = user.totalIncome + totalBonus;

    setUser(prev => ({
      ...prev,
      availableBalance: updatedAvailBalance,
      withdrawableBalance: updatedWithdrawableBalance,
      totalIncome: updatedTotalIncome,
    }));

    setInvestments(prev => [newInvestment, ...prev]);
    setTransactions(prev => [bonusTxn, purchaseTxn, ...prev]);

    // Persist to Supabase
    saveUserInvestmentDB(user.id, newInvestment);
    insertTransactionDB(user.id, purchaseTxn);
    insertTransactionDB(user.id, bonusTxn);
    updateUserProfileDB(user.id, {
      availableBalance: updatedAvailBalance,
      withdrawableBalance: updatedWithdrawableBalance,
      totalIncome: updatedTotalIncome,
    });

    return {
      success: true,
      message: `Congratulations! Successfully deployed ${quantity} unit(s) of ${product.name}. ₹${totalBonus.toLocaleString()} bonus credited to your wallet!`
    };
  };

  // Withdrawal action
  const requestWithdrawal = (amount: number) => {
    if (!user.isLoggedIn || !user.id) {
      setShowAuthModal(true);
      return { success: false, message: 'Please sign in or register to request withdrawals.' };
    }

    if (!user.bankAccount.isBound) {
      return { success: false, message: 'Please bind your Bank Account or UPI details first.' };
    }

    if (amount < platformSettings.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal amount is ₹${platformSettings.minWithdrawal.toLocaleString()}.` };
    }

    if (amount > user.withdrawableBalance) {
      return {
        success: false,
        message: `Amount exceeds withdrawable balance of ₹${user.withdrawableBalance.toLocaleString()}.`
      };
    }

    const eligibility = checkWithdrawalEligibility();
    if (!eligibility.isEligible) {
      return { success: false, message: eligibility.reason };
    }

    const feeRate = (platformSettings.withdrawalFeePercent || 10) / 100;
    const fee = Math.round(amount * feeRate * 100) / 100;
    const netAmount = amount - fee;

    const newTxn: Transaction = {
      id: `TXN-WTH-${Date.now().toString().slice(-6)}`,
      type: 'WITHDRAWAL',
      amount: -amount,
      fee,
      netAmount,
      status: 'PROCESSING',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Withdrawal to ${user.bankAccount.bankName} (A/C ...${user.bankAccount.accountNumber.slice(-4)})`,
      referenceId: `PO-${Math.floor(10000000 + Math.random() * 90000000)}`
    };

    const updatedWithdrawable = user.withdrawableBalance - amount;
    const updatedAvailable = user.availableBalance >= amount ? user.availableBalance - amount : user.availableBalance;

    setUser(prev => ({
      ...prev,
      withdrawableBalance: updatedWithdrawable,
      availableBalance: updatedAvailable,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    // Persist to Supabase
    insertTransactionDB(user.id, newTxn);
    updateUserProfileDB(user.id, {
      withdrawableBalance: updatedWithdrawable,
      availableBalance: updatedAvailable,
    });

    return {
      success: true,
      message: `Withdrawal request for ₹${amount.toLocaleString()} submitted successfully! ₹${netAmount.toLocaleString()} will arrive in your bank upon approval.`
    };
  };

  // Bank account binding
  const updateBankAccount = (bank: BankAccount) => {
    if (!user.isLoggedIn || !user.id) {
      setShowAuthModal(true);
      return;
    }

    const updatedBank = { ...bank, isBound: true };
    setUser(prev => ({
      ...prev,
      bankAccount: updatedBank
    }));

    // Persist to Supabase
    updateBankAccountDB(user.id, updatedBank);
  };

  // Calculate unharvested yield & today's status across all active plans
  const unharvestedStats = useMemo(() => {
    const active = investments.filter(i => i.status === 'ACTIVE');
    if (active.length === 0) {
      return { totalUnharvested: 0, isHarvestedToday: true, maxUnharvestedDays: 0 };
    }
    let totalUnharvested = 0;
    let maxUnharvestedDays = 0;
    let anyUnharvested = false;

    active.forEach(inv => {
      const { unharvestedCycles, unharvestedAmount } = getInvestmentUnharvested(
        inv,
        simulatedTime,
        platformSettings.dailyWithdrawalWindowStart
      );
      if (unharvestedCycles > 0) {
        anyUnharvested = true;
        totalUnharvested += unharvestedAmount;
        if (unharvestedCycles > maxUnharvestedDays) {
          maxUnharvestedDays = unharvestedCycles;
        }
      }
    });

    return {
      totalUnharvested,
      isHarvestedToday: !anyUnharvested,
      maxUnharvestedDays
    };
  }, [investments, simulatedTime, platformSettings.dailyWithdrawalWindowStart]);

  // Claim daily accumulated returns (Harvest Yield)
  // Rule: Can only harvest once per day. If missed 1 or multiple days, stacks up and harvests in a single click!
  const claimDailyReturns = () => {
    if (!user.isLoggedIn || !user.id) {
      setShowAuthModal(true);
      return {
        success: false,
        alreadyHarvested: false,
        message: 'Please sign in or register to claim daily returns.',
        claimed: 0,
        daysStacked: 0
      };
    }

    const activeInvs = investments.filter(inv => inv.status === 'ACTIVE');
    if (activeInvs.length === 0) {
      return {
        success: false,
        alreadyHarvested: false,
        message: 'No active plan investments to claim returns from.',
        claimed: 0,
        daysStacked: 0
      };
    }

    const currentCycleKey = getCycleDateKey(simulatedTime, platformSettings.dailyWithdrawalWindowStart);

    let localHarvestMap: Record<string, { cyclesHarvested: number; lastHarvestDate: string }> = {};
    try {
      const saved = localStorage.getItem('fancode_harvest_map');
      if (saved) localHarvestMap = JSON.parse(saved);
    } catch (e) {}

    let totalHarvestAmount = 0;
    let maxDaysHarvested = 0;
    let anyHarvested = false;

    const updatedInvs = investments.map(inv => {
      if (inv.status !== 'ACTIVE') return inv;

      const { eligibleCycles, unharvestedCycles, unharvestedAmount } = getInvestmentUnharvested(
        inv,
        simulatedTime,
        platformSettings.dailyWithdrawalWindowStart
      );

      if (unharvestedCycles > 0) {
        anyHarvested = true;
        totalHarvestAmount += unharvestedAmount;
        if (unharvestedCycles > maxDaysHarvested) {
          maxDaysHarvested = unharvestedCycles;
        }

        const newDaysHarvested = eligibleCycles;
        const newTotalEarned = (inv.totalEarned || 0) + unharvestedAmount;
        const isCompleted = newDaysHarvested >= 150 || newTotalEarned >= (inv.totalInvested * 2);

        localHarvestMap[inv.id] = {
          cyclesHarvested: newDaysHarvested,
          lastHarvestDate: currentCycleKey
        };

        const updated: UserInvestment = {
          ...inv,
          daysElapsed: eligibleCycles,
          cyclesHarvested: newDaysHarvested,
          lastHarvestDate: currentCycleKey,
          totalEarned: newTotalEarned,
          status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        };
        saveUserInvestmentDB(user.id, updated);
        return updated;
      }

      return inv;
    });

    if (!anyHarvested || totalHarvestAmount <= 0) {
      return {
        success: false,
        alreadyHarvested: true,
        message: 'You have already harvested your yield for today! Next yield available tomorrow after 00:30.',
        claimed: 0,
        daysStacked: 0
      };
    }

    try {
      localStorage.setItem('fancode_harvest_map', JSON.stringify(localHarvestMap));
    } catch (e) {}

    setInvestments(updatedInvs);

    const newWithdrawable = user.withdrawableBalance + totalHarvestAmount;
    const newAvailable = user.availableBalance + totalHarvestAmount;
    const newTotalIncome = user.totalIncome + totalHarvestAmount;

    setUser(prev => ({
      ...prev,
      withdrawableBalance: newWithdrawable,
      availableBalance: newAvailable,
      totalIncome: newTotalIncome,
    }));

    const desc = maxDaysHarvested > 1
      ? `Harvested ₹${totalHarvestAmount.toLocaleString()} (${maxDaysHarvested} days stacked yield)`
      : `Harvested ₹${totalHarvestAmount.toLocaleString()} Daily Yield`;

    const newTxn: Transaction = {
      id: `TXN-CLM-${Date.now().toString().slice(-6)}`,
      type: 'DAILY_RETURN',
      amount: totalHarvestAmount,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: desc,
      referenceId: `CLAIM-${Date.now().toString().slice(-4)}`
    };

    setTransactions(prev => [newTxn, ...prev]);

    insertTransactionDB(user.id, newTxn);
    updateUserProfileDB(user.id, {
      withdrawableBalance: newWithdrawable,
      availableBalance: newAvailable,
      totalIncome: newTotalIncome,
    });

    const successMsg = maxDaysHarvested > 1
      ? `Successfully harvested ₹${totalHarvestAmount.toLocaleString()} (${maxDaysHarvested} days stacked yield)!`
      : `Successfully harvested ₹${totalHarvestAmount.toLocaleString()} in daily yield!`;

    return {
      success: true,
      alreadyHarvested: false,
      message: successMsg,
      claimed: totalHarvestAmount,
      daysStacked: maxDaysHarvested
    };
  };

  // ================= ADMIN ACTIONS =================

  // 1. Add New Plan
  const addPlan = (plan: InvestmentProduct) => {
    const id = plan.id ? plan.id.trim().toUpperCase() : `PLAN-${Date.now().toString().slice(-4)}`;
    
    if (catalog.some(p => p.id.toUpperCase() === id.toUpperCase())) {
      return { success: false, message: `A plan with ID "${id}" already exists. Please choose a different ID.` };
    }

    const newPlan: InvestmentProduct = {
      ...plan,
      id,
      name: plan.name || `Plan ${id}`,
      tagline: plan.tagline || plan.name || '',
      robotModel: plan.robotModel || plan.name || '',
      durationDays: Number(plan.durationDays) || 150,
      price: Number(plan.price) || 500,
      dailyIncome: Number(plan.dailyIncome) || 100,
      bonus: Number(plan.bonus) || 0,
      totalReturn: Number(plan.totalReturn) || ((Number(plan.dailyIncome) || 100) * (Number(plan.durationDays) || 150)),
      minPurchase: Number(plan.minPurchase) || 1,
      maxPurchase: Number(plan.maxPurchase) || 10,
      requiresPriorInvestment: Boolean(plan.requiresPriorInvestment),
      specs: Array.isArray(plan.specs) && plan.specs.length > 0 ? plan.specs : ['High ROI Yield', 'Autonomous Fleet Node'],
      isActive: plan.isActive !== undefined ? plan.isActive : true,
      image: plan.image || '',
      imagePosition: plan.imagePosition || 'object-center',
      tier: plan.tier || 'STANDARD',
    };

    const newCatalog = [...catalog, newPlan];
    setCatalog(newCatalog);
    try {
      localStorage.setItem('fancode_catalog_v3', JSON.stringify(newCatalog));
    } catch (e) {
      console.error('Failed to save catalog to localStorage', e);
    }

    // Persist to Supabase
    saveInvestmentProductDB(newPlan);

    return { success: true, message: `Plan "${newPlan.name}" (${newPlan.id}) added successfully!` };
  };

  // 2. Update Plan
  const updatePlan = (id: string, updatedPlan: Partial<InvestmentProduct>) => {
    const existingIndex = catalog.findIndex(p => p.id.toUpperCase() === id.toUpperCase());
    if (existingIndex === -1) return { success: false, message: `Plan "${id}" not found.` };

    const currentPlan = catalog[existingIndex];
    const dailyIncomeVal = updatedPlan.dailyIncome !== undefined ? Number(updatedPlan.dailyIncome) : currentPlan.dailyIncome;
    const durationDaysVal = updatedPlan.durationDays !== undefined ? Number(updatedPlan.durationDays) : currentPlan.durationDays;

    const merged: InvestmentProduct = {
      ...currentPlan,
      ...updatedPlan,
      id: currentPlan.id,
      name: updatedPlan.name || currentPlan.name,
      tagline: updatedPlan.tagline || currentPlan.tagline || currentPlan.name,
      robotModel: updatedPlan.robotModel || currentPlan.robotModel || currentPlan.name,
      price: updatedPlan.price !== undefined ? Number(updatedPlan.price) : currentPlan.price,
      dailyIncome: dailyIncomeVal,
      durationDays: durationDaysVal,
      bonus: updatedPlan.bonus !== undefined ? Number(updatedPlan.bonus) : currentPlan.bonus,
      totalReturn: updatedPlan.totalReturn !== undefined ? Number(updatedPlan.totalReturn) : (dailyIncomeVal * durationDaysVal),
      minPurchase: updatedPlan.minPurchase !== undefined ? Number(updatedPlan.minPurchase) : currentPlan.minPurchase,
      maxPurchase: updatedPlan.maxPurchase !== undefined ? Number(updatedPlan.maxPurchase) : currentPlan.maxPurchase,
      requiresPriorInvestment: updatedPlan.requiresPriorInvestment !== undefined ? Boolean(updatedPlan.requiresPriorInvestment) : Boolean(currentPlan.requiresPriorInvestment),
      isActive: updatedPlan.isActive !== undefined ? Boolean(updatedPlan.isActive) : (currentPlan.isActive !== false),
      specs: Array.isArray(updatedPlan.specs) && updatedPlan.specs.length > 0 ? updatedPlan.specs : currentPlan.specs,
      image: updatedPlan.image || currentPlan.image,
      imagePosition: updatedPlan.imagePosition || currentPlan.imagePosition || 'object-center',
      tier: updatedPlan.tier || currentPlan.tier || 'STANDARD',
    };

    const newCatalog = [...catalog];
    newCatalog[existingIndex] = merged;

    setCatalog(newCatalog);
    try {
      localStorage.setItem('fancode_catalog_v3', JSON.stringify(newCatalog));
    } catch (e) {
      console.error('Failed to save catalog to localStorage', e);
    }

    // Persist to Supabase
    saveInvestmentProductDB(merged);

    return { success: true, message: `Plan "${merged.name}" (${merged.id}) updated successfully!` };
  };

  // 3. Delete Plan
  const deletePlan = (id: string) => {
    const newCatalog = catalog.filter(p => p.id.toUpperCase() !== id.toUpperCase());
    setCatalog(newCatalog);
    try {
      localStorage.setItem('fancode_catalog_v3', JSON.stringify(newCatalog));
    } catch (e) {
      console.error('Failed to save catalog to localStorage', e);
    }

    // Persist to Supabase
    deleteInvestmentProductDB(id);

    return { success: true, message: `Plan "${id}" deleted.` };
  };

  // 4. Reset Catalog to Default
  const resetCatalogToDefault = () => {
    setCatalog(PRODUCTS_CATALOG);
    try {
      localStorage.setItem('fancode_catalog_v3', JSON.stringify(PRODUCTS_CATALOG));
    } catch (e) {
      console.error('Failed to save catalog to localStorage', e);
    }
    PRODUCTS_CATALOG.forEach(p => saveInvestmentProductDB(p));
  };

  // 5. Update User Profile
  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
    updateUserProfileDB(user.id, updated);
  };

  // 6. Adjust User Balance
  const adjustUserBalance = (amount: number, reason: string) => {
    const isCredit = amount >= 0;
    const newTxn: Transaction = {
      id: `TXN-ADM-${Date.now().toString().slice(-6)}`,
      type: isCredit ? 'RECHARGE' : 'WITHDRAWAL',
      amount: Math.abs(amount),
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Admin Adjustment: ${reason || (isCredit ? 'Manual Credit' : 'Manual Debit')}`,
      referenceId: `ADMIN-${Date.now().toString().slice(-4)}`
    };

    const newAvail = Math.max(0, user.availableBalance + amount);
    const newWithdr = Math.max(0, user.withdrawableBalance + amount);

    setUser(prev => ({
      ...prev,
      availableBalance: newAvail,
      withdrawableBalance: newWithdr,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    // Persist to Supabase
    insertTransactionDB(user.id, newTxn);
    updateUserProfileDB(user.id, {
      availableBalance: newAvail,
      withdrawableBalance: newWithdr,
    });
  };

  // 7. Approve Withdrawal (Bee Grow pattern: supports bank transfer reference & admin remarks)
  const approveWithdrawal = (transactionId: string, bankReference?: string, adminNote?: string) => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.type !== 'WITHDRAWAL') {
      return { success: false, message: 'Withdrawal transaction not found.' };
    }

    const ref = bankReference || txn.referenceId || `PAY-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const note = adminNote || 'Approved and settled via NEFT/UPI';

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return { ...t, status: 'COMPLETED', referenceId: ref, adminNote: note };
        }
        return t;
      })
    );

    // Persist to Supabase
    updateTransactionStatusDB(transactionId, 'COMPLETED', undefined, note, ref);

    return { success: true, message: `Withdrawal ${transactionId} approved! Payment Reference: ${ref}` };
  };

  // 8. Reject Withdrawal (Bee Grow pattern: mandatory reason & atomic refund)
  const rejectWithdrawal = (transactionId: string, reason = 'Administrative review: Details mismatch') => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.type !== 'WITHDRAWAL') {
      return { success: false, message: 'Transaction not found.' };
    }

    const refundAmount = Math.abs(txn.amount);

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return { 
            ...t, 
            status: 'REJECTED', 
            rejectionReason: reason,
            adminNote: reason,
            description: `${t.description} (REJECTED: ${reason})` 
          };
        }
        return t;
      })
    );

    const newWithdr = user.withdrawableBalance + refundAmount;
    const newAvail = user.availableBalance + refundAmount;

    setUser(prev => ({
      ...prev,
      withdrawableBalance: newWithdr,
      availableBalance: newAvail,
    }));

    // Persist to Supabase
    updateTransactionStatusDB(transactionId, 'REJECTED', reason, reason);
    updateUserProfileDB(user.id, {
      withdrawableBalance: newWithdr,
      availableBalance: newAvail,
    });

    return { success: true, message: `Withdrawal rejected. Full gross amount of ₹${refundAmount.toLocaleString()} refunded to user's wallet.` };
  };

  // 8a. Approve Recharge (Bee Grow Top-up Management pattern)
  const approveRecharge = (transactionId: string) => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.type !== 'RECHARGE') {
      return { success: false, message: 'Recharge transaction not found.' };
    }

    if (txn.status === 'COMPLETED') {
      return { success: false, message: 'Recharge is already approved and completed.' };
    }

    const creditAmount = Math.abs(txn.amount);

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return { ...t, status: 'COMPLETED', adminNote: 'Verified & Credited by Admin' };
        }
        return t;
      })
    );

    const newAvail = user.availableBalance + creditAmount;
    const newTotalRecharge = user.totalRecharge + creditAmount;

    setUser(prev => ({
      ...prev,
      availableBalance: newAvail,
      totalRecharge: newTotalRecharge,
    }));

    // Persist to Supabase
    updateTransactionStatusDB(transactionId, 'COMPLETED', undefined, 'Verified & Credited by Admin');
    updateUserProfileDB(user.id, {
      availableBalance: newAvail,
      totalRecharge: newTotalRecharge,
    });

    return { success: true, message: `Recharge approved! ₹${creditAmount.toLocaleString()} credited to user account.` };
  };

  // 8b. Reject Recharge (Bee Grow Top-up Management pattern)
  const rejectRecharge = (transactionId: string, reason = 'Invalid or duplicate UTR reference') => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.type !== 'RECHARGE') {
      return { success: false, message: 'Recharge transaction not found.' };
    }

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return { ...t, status: 'REJECTED', rejectionReason: reason, adminNote: reason };
        }
        return t;
      })
    );

    // If it was previously marked COMPLETED, deduct the balance
    if (txn.status === 'COMPLETED') {
      const deductAmount = Math.abs(txn.amount);
      const newAvail = Math.max(0, user.availableBalance - deductAmount);
      const newTotal = Math.max(0, user.totalRecharge - deductAmount);
      setUser(prev => ({
        ...prev,
        availableBalance: newAvail,
        totalRecharge: newTotal
      }));
      updateUserProfileDB(user.id, {
        availableBalance: newAvail,
        totalRecharge: newTotal
      });
    }

    // Persist to Supabase
    updateTransactionStatusDB(transactionId, 'REJECTED', reason, reason);

    return { success: true, message: `Recharge request marked as REJECTED (${reason}).` };
  };

  // 8c. Automated Daily Yield & Referral Level Commission Distribution Engine (Bee Grow dailyRoi.ts pattern)
  const triggerDailyYieldPayout = () => {
    return performNightResetSettlement(simulatedTime);
  };

  // 8d. Direct Plan Allocation by Admin (Bee Grow UserDetail.tsx Top-Up pattern)
  const assignPlanToUser = (userId: string, productId: string, quantity: number) => {
    const product = catalog.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Invalid product selected.' };

    const totalCost = product.price * quantity;
    const totalDaily = product.dailyIncome * quantity;
    const totalBonus = product.bonus * quantity;

    const newInvestment: UserInvestment = {
      id: `INV-ADM-${productId}-${Date.now().toString().slice(-6)}`,
      productId,
      productName: product.name,
      robotModel: product.robotModel,
      quantity,
      unitPrice: product.price,
      totalInvested: totalCost,
      dailyIncome: totalDaily,
      bonusReceived: totalBonus,
      purchaseTimestamp: simulatedTime.getTime(),
      purchaseDateFormatted: simulatedTime.toLocaleDateString(),
      daysElapsed: 0,
      totalEarned: 0,
      cyclesHarvested: 0,
      status: 'ACTIVE',
    };

    setInvestments(prev => [newInvestment, ...prev]);
    saveUserInvestmentDB(userId, newInvestment);

    const adminAssignTxn: Transaction = {
      id: `TXN-ADM-ASSIGN-${Date.now().toString().slice(-6)}`,
      type: 'PRODUCT_BONUS',
      amount: totalBonus,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Admin Plan Allocation: ${quantity}x ${product.name} (${product.robotModel})`,
      referenceId: newInvestment.id
    };

    setTransactions(prev => [adminAssignTxn, ...prev]);
    insertTransactionDB(userId, adminAssignTxn);

    return { success: true, message: `Successfully allocated ${quantity}x ${product.name} to user ${userId}!` };
  };

  // 8e. User Security & Bank Lock Controls (Bee Grow UserDetail.tsx pattern)
  const updateUserSecurity = (userId: string, updates: { pin?: string; password?: string; bankDetailsLocked?: boolean }) => {
    setUser(prev => ({
      ...prev,
      pin: updates.pin !== undefined ? updates.pin : prev.pin,
      bankDetailsLocked: updates.bankDetailsLocked !== undefined ? updates.bankDetailsLocked : prev.bankDetailsLocked,
    }));

    updateUserProfileDB(userId, {
      pin: updates.pin,
      bankDetailsLocked: updates.bankDetailsLocked
    });
  };

  // 9. Add Custom Transaction
  const addCustomTransaction = (txnData: Omit<Transaction, 'id' | 'timestamp' | 'formattedTime'>) => {
    const newTxn: Transaction = {
      ...txnData,
      id: `TXN-MAN-${Date.now().toString().slice(-6)}`,
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
    };
    setTransactions(prev => [newTxn, ...prev]);

    // Persist to Supabase
    insertTransactionDB(user.id, newTxn);
  };

  // 10. Cancel Investment
  const cancelInvestment = (investmentId: string) => {
    setInvestments(prev =>
      prev.map(inv => {
        if (inv.id === investmentId) {
          return { ...inv, status: 'COMPLETED' };
        }
        return inv;
      })
    );

    // Persist to Supabase
    cancelUserInvestmentDB(investmentId);

    return { success: true, message: `Investment "${investmentId}" marked as completed/cancelled.` };
  };

  // 11. Update Platform Settings
  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => {
      const merged = { ...prev, ...settings };
      try {
        localStorage.setItem('fancode_settings', JSON.stringify(merged));
      } catch (e) {
        console.error('Failed to save settings to localStorage', e);
      }
      return merged;
    });
    updatePlatformSettingsDB(settings);
  };

  // 12. Reset Settings
  const resetPlatformSettings = () => {
    setPlatformSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('fancode_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Failed to reset settings to localStorage', e);
    }
    updatePlatformSettingsDB(DEFAULT_SETTINGS);
  };

  // ================= REFERRAL NETWORK & MEMBER PLANS ADMIN ACTIONS =================

  // 13. Update Team Member
  const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const merged = { ...m, ...updated };
          saveTeamMemberDB(merged, user.id);
          return merged;
        }
        return m;
      })
    );
  };

  // 14. Add New Team Member
  const addTeamMember = (member: TeamMember) => {
    if (teamMembers.some(m => m.id === member.id)) {
      return { success: false, message: `Member ID "${member.id}" already exists.` };
    }
    setTeamMembers(prev => [member, ...prev]);
    saveTeamMemberDB(member, user.id);
    return { success: true, message: `Member ${member.phone} (${member.id}) added to network.` };
  };

  // 15. Delete Team Member
  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    deleteTeamMemberDB(id);
    return { success: true, message: `Member "${id}" deleted.` };
  };

  // 16. Add Plan to Member
  const addMemberPlan = (memberId: string, plan: MemberPlanHolding) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return { success: false, message: 'Member not found.' };

    const newPlans = [...(member.plans || []), plan];
    const newRecharge = newPlans.reduce((sum, p) => sum + p.totalInvested, 0);

    setTeamMembers(prev =>
      prev.map(m => (m.id === memberId ? { ...m, plans: newPlans, rechargeAmount: newRecharge } : m))
    );

    saveMemberPlanHoldingDB(memberId, plan);
    saveTeamMemberDB({ ...member, plans: newPlans, rechargeAmount: newRecharge }, user.id);

    return { success: true, message: `Added ${plan.planName} (${plan.quantity} unit) to member ${memberId}.` };
  };

  // 17. Update Member Plan
  const updateMemberPlan = (memberId: string, planHoldingId: string, updated: Partial<MemberPlanHolding>) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.id !== memberId) return m;
        let savedPlan: MemberPlanHolding | null = null;
        const updatedPlans = (m.plans || []).map(p => {
          if (p.id === planHoldingId) {
            const merged = { ...p, ...updated };
            savedPlan = merged;
            return merged;
          }
          return p;
        });
        const newRecharge = updatedPlans.reduce((sum, p) => sum + p.totalInvested, 0);
        if (savedPlan) {
          saveMemberPlanHoldingDB(memberId, savedPlan);
        }
        saveTeamMemberDB({ ...m, plans: updatedPlans, rechargeAmount: newRecharge }, user.id);
        return { ...m, plans: updatedPlans, rechargeAmount: newRecharge };
      })
    );
    return { success: true, message: 'Member plan updated successfully.' };
  };

  // 18. Delete Member Plan
  const deleteMemberPlan = (memberId: string, planHoldingId: string) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.id !== memberId) return m;
        const updatedPlans = (m.plans || []).filter(p => p.id !== planHoldingId);
        const newRecharge = updatedPlans.reduce((sum, p) => sum + p.totalInvested, 0);
        deleteMemberPlanHoldingDB(planHoldingId);
        saveTeamMemberDB({ ...m, plans: updatedPlans, rechargeAmount: newRecharge }, user.id);
        return { ...m, plans: updatedPlans, rechargeAmount: newRecharge };
      })
    );
    return { success: true, message: 'Member plan deleted.' };
  };

  // 19. Reset Team to Default
  const resetTeamToDefault = () => {
    setTeamMembers(INITIAL_TEAM);
    INITIAL_TEAM.forEach(m => {
      saveTeamMemberDB(m, user.id);
      m.plans.forEach(p => saveMemberPlanHoldingDB(m.id, p));
    });
  };

  // ================= DAILY WITHDRAWAL LOGS AGGREGATOR =================
  const getDailyWithdrawalLogs = (): DailyWithdrawalLog[] => {
    const withdrawalTxns = transactions.filter(t => t.type === 'WITHDRAWAL');
    const dayMap = new Map<string, {
      date: string;
      formattedDate: string;
      totalRequested: number;
      totalFees: number;
      totalNet: number;
      totalRequests: number;
      completedAmount: number;
      processingAmount: number;
      rejectedAmount: number;
      transactions: Transaction[];
    }>();

    withdrawalTxns.forEach(txn => {
      const d = new Date(txn.timestamp);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const formattedDate = d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const requested = Math.abs(txn.amount);
      const fee = txn.fee !== undefined ? txn.fee : Math.round(requested * 0.1);
      const net = txn.netAmount !== undefined ? txn.netAmount : (requested - fee);

      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, {
          date: dateKey,
          formattedDate,
          totalRequested: 0,
          totalFees: 0,
          totalNet: 0,
          totalRequests: 0,
          completedAmount: 0,
          processingAmount: 0,
          rejectedAmount: 0,
          transactions: []
        });
      }

      const log = dayMap.get(dateKey)!;
      log.totalRequested += requested;
      log.totalFees += fee;
      log.totalNet += net;
      log.totalRequests += 1;
      log.transactions.push(txn);

      if (txn.status === 'COMPLETED') {
        log.completedAmount += requested;
      } else if (txn.status === 'PROCESSING') {
        log.processingAmount += requested;
      } else {
        log.rejectedAmount += requested;
      }
    });

    // Sort descending by date
    return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        investments,
        transactions,
        teamMembers,
        catalog,
        activeTab,
        setActiveTab,
        showWelcomeModal,
        setShowWelcomeModal,
        showBuyModal,
        setShowBuyModal,
        showCustomerCare,
        setShowCustomerCare,
        showOrdersModal,
        setShowOrdersModal,
        showBankCardModal,
        setShowBankCardModal,
        showColorTrustGuide,
        setShowColorTrustGuide,
        showAuthModal,
        setShowAuthModal,
        showAdminPanel,
        setShowAdminPanel,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        rechargeWallet,
        purchaseProduct,
        requestWithdrawal,
        updateBankAccount,
        unharvestedYield: unharvestedStats.totalUnharvested,
        isHarvestedToday: unharvestedStats.isHarvestedToday,
        unharvestedDays: unharvestedStats.maxUnharvestedDays,
        claimDailyReturns,
        canInvestInProduct,
        getProductOwnedCount,
        simulatedTime,
        advanceTimeToNextDayAfter1230,
        resetSimulatedTime,
        checkWithdrawalEligibility,
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
        performNightResetSettlement,
        assignPlanToUser,
        updateUserSecurity,
        addCustomTransaction,
        cancelInvestment,
        platformSettings,
        updatePlatformSettings,
        resetPlatformSettings,
        updateTeamMember,
        addTeamMember,
        deleteTeamMember,
        addMemberPlan,
        updateMemberPlan,
        deleteMemberPlan,
        resetTeamToDefault,
        getDailyWithdrawalLogs,
        navigateToRecharge,
        setNavigateToRechargeFn,
        refreshUserData,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
