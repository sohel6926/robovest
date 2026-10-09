import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { PRODUCTS_CATALOG } from '../data/products';

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
  claimDailyReturns: () => { success: boolean; message: string; claimed: number };
  
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
  approveWithdrawal: (transactionId: string) => { success: boolean; message: string };
  rejectWithdrawal: (transactionId: string, reason?: string) => { success: boolean; message: string };
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_BANK: BankAccount = {
  accountHolder: 'Rahul Sharma',
  accountNumber: '50100492817264',
  ifscCode: 'HDFC0001234',
  bankName: 'HDFC Bank',
  upiId: 'rahul.robo@okaxis',
  isBound: true,
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
  telegramSupportUrl: 'https://t.me/robovest_support',
  telegramChannelUrl: 'https://t.me/robovest_official',
  platformAnnouncement: 'Autonomous Robotics Fleet v2.4 active. Daily yields processing 24/7.',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'invite' | 'contact' | 'team' | 'profile'>('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [showBuyModal, setShowBuyModal] = useState<InvestmentProduct | null>(null);
  const [showCustomerCare, setShowCustomerCare] = useState<boolean>(false);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);
  const [showBankCardModal, setShowBankCardModal] = useState<boolean>(false);
  const [showColorTrustGuide, setShowColorTrustGuide] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('robovest_admin_auth') === 'true';
  });

  // Dynamic Catalog with LocalStorage persistence
  const [catalog, setCatalog] = useState<InvestmentProduct[]>(() => {
    try {
      const saved = localStorage.getItem('robovest_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse catalog from storage', e);
    }
    return PRODUCTS_CATALOG;
  });

  // Platform Settings with LocalStorage persistence
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('robovest_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to parse settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Simulated Time
  const [simulatedTime, setSimulatedTime] = useState<Date>(new Date());

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('robovest_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse user from storage', e);
    }
    return {
      id: 'User5294',
      phone: '+91 98452 77192',
      inviteCode: '203C03',
      vipLevel: 1,
      availableBalance: 4000,
      withdrawableBalance: 850,
      totalRecharge: 4000,
      totalIncome: 1357.6,
      isLoggedIn: true,
      bankAccount: INITIAL_BANK,
    };
  });

  // Investments
  const [investments, setInvestments] = useState<UserInvestment[]>(() => {
    try {
      const saved = localStorage.getItem('robovest_investments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse investments from storage', e);
    }
    return [
      {
        id: 'INV-A-01',
        productId: 'A',
        productName: 'Product A',
        robotModel: 'Nao Core Micro Assistant',
        quantity: 1,
        unitPrice: 520,
        totalInvested: 520,
        dailyIncome: 130,
        bonusReceived: 50,
        purchaseTimestamp: Date.now() - 86400000 * 2,
        purchaseDateFormatted: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
        daysElapsed: 2,
        totalEarned: 260,
        status: 'ACTIVE',
      }
    ];
  });

  // Transactions with comprehensive withdrawal logs spanning dates
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('robovest_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse transactions from storage', e);
    }

    const now = Date.now();
    const oneDay = 86400000;

    return [
      // Today (Oct 10)
      {
        id: 'TXN-WTH-1001',
        type: 'WITHDRAWAL',
        amount: -2100,
        fee: 210,
        netAmount: 1890,
        status: 'PROCESSING',
        timestamp: now - 3600000 * 2,
        formattedTime: '2026-10-10 11:15 AM',
        description: 'Withdrawal to HDFC Bank (A/C ...7264)',
        referenceId: 'PO-88192019'
      },
      {
        id: 'TXN-WTH-1002',
        type: 'WITHDRAWAL',
        amount: -520,
        fee: 52,
        netAmount: 468,
        status: 'COMPLETED',
        timestamp: now - 3600000 * 6,
        formattedTime: '2026-10-10 07:30 AM',
        description: 'Withdrawal to HDFC Bank (A/C ...7264)',
        referenceId: 'PO-88192018'
      },
      // Yesterday (Oct 9)
      {
        id: 'TXN-WTH-0901',
        type: 'WITHDRAWAL',
        amount: -4000,
        fee: 400,
        netAmount: 3600,
        status: 'COMPLETED',
        timestamp: now - oneDay - 3600000 * 4,
        formattedTime: '2026-10-09 02:45 PM',
        description: 'Withdrawal to ICICI Bank (A/C ...9102)',
        referenceId: 'PO-77291048'
      },
      {
        id: 'TXN-WTH-0902',
        type: 'WITHDRAWAL',
        amount: -1500,
        fee: 150,
        netAmount: 1350,
        status: 'COMPLETED',
        timestamp: now - oneDay - 3600000 * 8,
        formattedTime: '2026-10-09 10:10 AM',
        description: 'Withdrawal to State Bank of India (A/C ...4410)',
        referenceId: 'PO-77291049'
      },
      {
        id: 'TXN-WTH-0903',
        type: 'WITHDRAWAL',
        amount: -300,
        fee: 30,
        netAmount: 270,
        status: 'PENDING',
        timestamp: now - oneDay - 3600000 * 12,
        formattedTime: '2026-10-09 06:15 AM',
        description: 'Withdrawal to HDFC Bank (REJECTED: Incorrect IFSC Code)',
        referenceId: 'PO-77291050'
      },
      // 2 Days ago (Oct 8)
      {
        id: 'TXN-WTH-0801',
        type: 'WITHDRAWAL',
        amount: -8200,
        fee: 820,
        netAmount: 7380,
        status: 'COMPLETED',
        timestamp: now - oneDay * 2 - 3600000 * 3,
        formattedTime: '2026-10-08 03:20 PM',
        description: 'Withdrawal to Axis Bank (A/C ...8821)',
        referenceId: 'PO-66192031'
      },
      {
        id: 'TXN-WTH-0802',
        type: 'WITHDRAWAL',
        amount: -500,
        fee: 50,
        netAmount: 450,
        status: 'COMPLETED',
        timestamp: now - oneDay * 2 - 3600000 * 9,
        formattedTime: '2026-10-08 09:40 AM',
        description: 'Withdrawal to HDFC Bank (A/C ...7264)',
        referenceId: 'PO-66192032'
      },
      // Recharges & Returns
      {
        id: 'TXN-901',
        type: 'RECHARGE',
        amount: 4000,
        status: 'COMPLETED',
        timestamp: now - oneDay * 3,
        formattedTime: '2026-10-05 11:30 AM',
        description: 'Account Wallet Top-Up via UPI',
        referenceId: 'UPI-77829104819'
      },
      {
        id: 'TXN-902',
        type: 'PRODUCT_BONUS',
        amount: 50,
        status: 'COMPLETED',
        timestamp: now - oneDay * 3,
        formattedTime: '2026-10-05 11:32 AM',
        description: 'Instant Bonus for Product A Purchase',
        referenceId: 'BONUS-A'
      },
      {
        id: 'TXN-903',
        type: 'DAILY_RETURN',
        amount: 260,
        status: 'COMPLETED',
        timestamp: now - oneDay * 2,
        formattedTime: '2026-10-06 01:00 AM',
        description: 'Daily Fleet Earnings (Nao Gen-1)',
        referenceId: 'FLEET-PAYOUT'
      }
    ];
  });

  // Team Members State with LocalStorage persistence
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('robovest_team_members');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse team members from storage', e);
    }
    return INITIAL_TEAM;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('robovest_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('robovest_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem('robovest_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('robovest_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('robovest_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('robovest_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('robovest_admin_auth', isAdminAuthenticated ? 'true' : 'false');
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

  // Time simulator actions
  const advanceTimeToNextDayAfter1230 = () => {
    const nextDay = new Date(simulatedTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 35, 0, 0);
    setSimulatedTime(nextDay);
  };

  const resetSimulatedTime = () => {
    setSimulatedTime(new Date());
  };

  // Wallet recharge action
  const rechargeWallet = (amount: number, utr: string) => {
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

    setUser(prev => ({
      ...prev,
      availableBalance: prev.availableBalance + amount,
      totalRecharge: prev.totalRecharge + amount,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    return { success: true, message: `Successfully recharged ₹${amount.toLocaleString()} into your account!` };
  };

  // Product purchase action
  const purchaseProduct = (productId: string, quantity: number) => {
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

    setUser(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - totalCost + totalBonus,
      withdrawableBalance: prev.withdrawableBalance + totalBonus,
      totalIncome: prev.totalIncome + totalBonus,
    }));

    setInvestments(prev => [newInvestment, ...prev]);
    setTransactions(prev => [bonusTxn, purchaseTxn, ...prev]);

    return {
      success: true,
      message: `Congratulations! Successfully deployed ${quantity} unit(s) of ${product.name}. ₹${totalBonus.toLocaleString()} bonus credited to your wallet!`
    };
  };

  // Withdrawal action
  const requestWithdrawal = (amount: number) => {
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

    setUser(prev => ({
      ...prev,
      withdrawableBalance: prev.withdrawableBalance - amount,
      availableBalance: prev.availableBalance >= amount ? prev.availableBalance - amount : prev.availableBalance,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      message: `Withdrawal request for ₹${amount.toLocaleString()} submitted successfully! ₹${netAmount.toLocaleString()} will arrive in your bank upon approval.`
    };
  };

  // Bank account binding
  const updateBankAccount = (bank: BankAccount) => {
    setUser(prev => ({
      ...prev,
      bankAccount: { ...bank, isBound: true }
    }));
  };

  // Claim daily accumulated returns
  const claimDailyReturns = () => {
    const totalDaily = investments
      .filter(inv => inv.status === 'ACTIVE')
      .reduce((sum, inv) => sum + inv.dailyIncome, 0);

    if (totalDaily <= 0) {
      return { success: false, message: 'No active robot investments to claim returns from.', claimed: 0 };
    }

    const newTxn: Transaction = {
      id: `TXN-CLM-${Date.now().toString().slice(-6)}`,
      type: 'DAILY_RETURN',
      amount: totalDaily,
      status: 'COMPLETED',
      timestamp: simulatedTime.getTime(),
      formattedTime: simulatedTime.toLocaleString(),
      description: `Autonomous Fleet Revenue Collected`,
      referenceId: `CLAIM-${Date.now().toString().slice(-4)}`
    };

    setUser(prev => ({
      ...prev,
      withdrawableBalance: prev.withdrawableBalance + totalDaily,
      availableBalance: prev.availableBalance + totalDaily,
      totalIncome: prev.totalIncome + totalDaily,
    }));

    setTransactions(prev => [newTxn, ...prev]);

    return {
      success: true,
      message: `Claimed ₹${totalDaily.toLocaleString()} in daily autonomous returns!`,
      claimed: totalDaily
    };
  };

  // ================= ADMIN ACTIONS =================

  // 1. Add New Plan
  const addPlan = (plan: InvestmentProduct) => {
    const id = plan.id ? plan.id.trim().toUpperCase() : `PLAN-${Date.now().toString().slice(-4)}`;
    
    if (catalog.some(p => p.id === id)) {
      return { success: false, message: `A plan with ID "${id}" already exists. Please choose a different ID.` };
    }

    const newPlan: InvestmentProduct = {
      ...plan,
      id,
      durationDays: Number(plan.durationDays) || 150,
      price: Number(plan.price) || 500,
      dailyIncome: Number(plan.dailyIncome) || 100,
      bonus: Number(plan.bonus) || 0,
      totalReturn: Number(plan.totalReturn) || (Number(plan.dailyIncome) * Number(plan.durationDays)),
      minPurchase: Number(plan.minPurchase) || 1,
      maxPurchase: Number(plan.maxPurchase) || 10,
      specs: Array.isArray(plan.specs) && plan.specs.length > 0 ? plan.specs : ['High ROI Yield', 'Autonomous Fleet Node'],
      isActive: plan.isActive !== undefined ? plan.isActive : true,
    };

    setCatalog(prev => [...prev, newPlan]);
    return { success: true, message: `Plan "${newPlan.name}" (${newPlan.id}) added successfully!` };
  };

  // 2. Update Plan
  const updatePlan = (id: string, updatedPlan: Partial<InvestmentProduct>) => {
    const exists = catalog.some(p => p.id === id);
    if (!exists) return { success: false, message: 'Plan not found.' };

    setCatalog(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updatedPlan };
        if (updatedPlan.dailyIncome || updatedPlan.durationDays) {
          if (!updatedPlan.totalReturn) {
            merged.totalReturn = (Number(merged.dailyIncome) || 0) * (Number(merged.durationDays) || 150);
          }
        }
        return merged;
      })
    );

    return { success: true, message: `Plan "${id}" updated successfully!` };
  };

  // 3. Delete Plan
  const deletePlan = (id: string) => {
    setCatalog(prev => prev.filter(p => p.id !== id));
    return { success: true, message: `Plan "${id}" deleted.` };
  };

  // 4. Reset Catalog to Default
  const resetCatalogToDefault = () => {
    setCatalog(PRODUCTS_CATALOG);
  };

  // 5. Update User Profile
  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
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

    setUser(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance + amount),
      withdrawableBalance: Math.max(0, prev.withdrawableBalance + amount),
    }));

    setTransactions(prev => [newTxn, ...prev]);
  };

  // 7. Approve Withdrawal
  const approveWithdrawal = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId && t.type === 'WITHDRAWAL') {
          return { ...t, status: 'COMPLETED' };
        }
        return t;
      })
    );
    return { success: true, message: 'Withdrawal approved and marked COMPLETED.' };
  };

  // 8. Reject Withdrawal (Refunds money back to user)
  const rejectWithdrawal = (transactionId: string, reason = 'Administrative review') => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.type !== 'WITHDRAWAL') {
      return { success: false, message: 'Transaction not found.' };
    }

    const refundAmount = Math.abs(txn.amount);

    setTransactions(prev =>
      prev.map(t => {
        if (t.id === transactionId) {
          return { ...t, status: 'PENDING', description: `${t.description} (REJECTED: ${reason})` };
        }
        return t;
      })
    );

    setUser(prev => ({
      ...prev,
      withdrawableBalance: prev.withdrawableBalance + refundAmount,
      availableBalance: prev.availableBalance + refundAmount,
    }));

    return { success: true, message: `Withdrawal rejected and ₹${refundAmount.toLocaleString()} refunded to user.` };
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
    return { success: true, message: `Investment "${investmentId}" marked as completed/cancelled.` };
  };

  // 11. Update Platform Settings
  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings(prev => ({ ...prev, ...settings }));
  };

  // 12. Reset Settings
  const resetPlatformSettings = () => {
    setPlatformSettings(DEFAULT_SETTINGS);
  };

  // ================= REFERRAL NETWORK & MEMBER PLANS ADMIN ACTIONS =================

  // 13. Update Team Member
  const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeamMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  // 14. Add New Team Member
  const addTeamMember = (member: TeamMember) => {
    if (teamMembers.some(m => m.id === member.id)) {
      return { success: false, message: `Member ID "${member.id}" already exists.` };
    }
    setTeamMembers(prev => [member, ...prev]);
    return { success: true, message: `Member ${member.phone} (${member.id}) added to network.` };
  };

  // 15. Delete Team Member
  const deleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
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
    return { success: true, message: `Added ${plan.planName} (${plan.quantity} unit) to member ${memberId}.` };
  };

  // 17. Update Member Plan
  const updateMemberPlan = (memberId: string, planHoldingId: string, updated: Partial<MemberPlanHolding>) => {
    setTeamMembers(prev =>
      prev.map(m => {
        if (m.id !== memberId) return m;
        const updatedPlans = (m.plans || []).map(p =>
          p.id === planHoldingId ? { ...p, ...updated } : p
        );
        const newRecharge = updatedPlans.reduce((sum, p) => sum + p.totalInvested, 0);
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
        return { ...m, plans: updatedPlans, rechargeAmount: newRecharge };
      })
    );
    return { success: true, message: 'Member plan deleted.' };
  };

  // 19. Reset Team to Default
  const resetTeamToDefault = () => {
    setTeamMembers(INITIAL_TEAM);
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
