import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InvestmentProduct, UserInvestment, Transaction, BankAccount, TeamMember, UserProfile } from '../types';
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

  // Actions
  rechargeWallet: (amount: number, utr: string) => { success: boolean; message: string };
  purchaseProduct: (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G', quantity: number) => { success: boolean; message: string };
  requestWithdrawal: (amount: number) => { success: boolean; message: string };
  updateBankAccount: (bank: BankAccount) => void;
  claimDailyReturns: () => { success: boolean; message: string; claimed: number };
  
  // Prerequisite & limit helpers
  canInvestInProduct: (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') => { allowed: boolean; reason?: string };
  getProductOwnedCount: (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') => number;
  
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
  { id: 'TM-101', phone: '+91 98234*****', joinDate: '2026-10-05', level: 1, rechargeAmount: 4000, commissionGenerated: 880, status: 'ACTIVE' },
  { id: 'TM-102', phone: '+91 97112*****', joinDate: '2026-10-06', level: 1, rechargeAmount: 2100, commissionGenerated: 462, status: 'ACTIVE' },
  { id: 'TM-103', phone: '+91 88390*****', joinDate: '2026-10-06', level: 2, rechargeAmount: 520, commissionGenerated: 10.4, status: 'ACTIVE' },
  { id: 'TM-104', phone: '+91 91456*****', joinDate: '2026-10-07', level: 3, rechargeAmount: 520, commissionGenerated: 5.2, status: 'ACTIVE' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'invite' | 'contact' | 'team' | 'profile'>('home');
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [showBuyModal, setShowBuyModal] = useState<InvestmentProduct | null>(null);
  const [showCustomerCare, setShowCustomerCare] = useState<boolean>(false);
  const [showOrdersModal, setShowOrdersModal] = useState<boolean>(false);
  const [showBankCardModal, setShowBankCardModal] = useState<boolean>(false);
  const [showColorTrustGuide, setShowColorTrustGuide] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Simulated Time: Defaults to Current Real Date
  const [simulatedTime, setSimulatedTime] = useState<Date>(new Date());

  const [user, setUser] = useState<UserProfile>({
    id: 'User5294',
    phone: '+91 98452*****',
    inviteCode: '203C03',
    vipLevel: 1,
    availableBalance: 4000, // starting balance for smooth exploration
    withdrawableBalance: 850,
    totalRecharge: 4000,
    totalIncome: 1357.6,
    isLoggedIn: true,
    bankAccount: INITIAL_BANK,
  });

  const [investments, setInvestments] = useState<UserInvestment[]>([
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
      purchaseTimestamp: Date.now() - 86400000 * 2, // 2 days ago
      purchaseDateFormatted: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
      daysElapsed: 2,
      totalEarned: 260,
      status: 'ACTIVE',
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-901',
      type: 'RECHARGE',
      amount: 4000,
      status: 'COMPLETED',
      timestamp: Date.now() - 86400000 * 2,
      formattedTime: '2026-10-05 11:30 AM',
      description: 'Account Wallet Top-Up via UPI',
      referenceId: 'UPI-77829104819'
    },
    {
      id: 'TXN-902',
      type: 'PRODUCT_BONUS',
      amount: 50,
      status: 'COMPLETED',
      timestamp: Date.now() - 86400000 * 2,
      formattedTime: '2026-10-05 11:32 AM',
      description: 'Instant Bonus for Product A Purchase',
      referenceId: 'BONUS-A'
    },
    {
      id: 'TXN-903',
      type: 'DAILY_RETURN',
      amount: 260,
      status: 'COMPLETED',
      timestamp: Date.now() - 86400000,
      formattedTime: '2026-10-06 01:00 AM',
      description: 'Daily Fleet Earnings (Atlas Gen-1)',
      referenceId: 'FLEET-PAYOUT'
    }
  ]);

  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM);

  // Helper: Count how many units user already owns of a product
  const getProductOwnedCount = (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'): number => {
    return investments
      .filter(inv => inv.productId === productId && inv.status === 'ACTIVE')
      .reduce((sum, inv) => sum + inv.quantity, 0);
  };

  // Helper: Prerequisite check for E, F, G
  // Rule: "If you want to invest in Product E F G then you must and should have invested in anyone of the products A B. C D previously."
  const canInvestInProduct = (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'): { allowed: boolean; reason?: string } => {
    if (['A', 'B', 'C', 'D'].includes(productId)) {
      return { allowed: true };
    }

    // For E, F, G: check if user holds at least one of A, B, C, or D
    const hasBaseInvestment = investments.some(inv => ['A', 'B', 'C', 'D'].includes(inv.productId));
    if (!hasBaseInvestment) {
      return {
        allowed: false,
        reason: 'Prerequisite Required: You must invest in Product A, B, C, or D before unlocking Product ' + productId + '.'
      };
    }

    return { allowed: true };
  };

  // Helper: Check withdrawal eligibility
  // Rule:
  // 1. Time window 00:30 to 17:00 (12:30 AM to 5:00 PM)
  // 2. "If you invest money Today there should be a option where you can withdraw money Next day after 12:30 am"
  const checkWithdrawalEligibility = () => {
    const curTime = simulatedTime;
    const hours = curTime.getHours();
    const minutes = curTime.getMinutes();
    const currentMinutesOfDay = hours * 60 + minutes;

    // Daily window: 00:30 (30 mins) to 17:00 (1020 mins)
    const isWithinDailyWindow = currentMinutesOfDay >= 30 && currentMinutesOfDay <= 1020;

    // Check recent investments done on the same simulated calendar day
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

    // Calculate next unlock time string
    const tomorrow = new Date(curTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 30, 0, 0);

    const nextUnlockFormatted = `Tomorrow at 12:30 AM (${tomorrow.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })}, 00:30 hrs)`;

    if (hasInvestedToday) {
      // Must wait for next day after 12:30 AM
      return {
        isEligible: false,
        reason: 'New Investment In Effect: Withdrawals for funds invested today will unlock Next Day after 12:30 AM.',
        nextUnlockTime: nextUnlockFormatted,
        isWithinDailyWindow,
        hasInvestedToday: true,
      };
    }

    if (!isWithinDailyWindow) {
      return {
        isEligible: false,
        reason: 'Outside Daily Withdrawal Hours: Daily withdrawals are processed between 00:30 AM and 05:00 PM (17:00 hrs).',
        nextUnlockTime: 'Next Window: 12:30 AM',
        isWithinDailyWindow: false,
        hasInvestedToday: false,
      };
    }

    return {
      isEligible: true,
      reason: 'Eligible for withdrawal! Daily window active (00:30 - 17:00) and no unvested same-day lock.',
      nextUnlockTime: 'Open Now until 17:00 hrs',
      isWithinDailyWindow: true,
      hasInvestedToday: false,
    };
  };

  // Time simulator actions
  const advanceTimeToNextDayAfter1230 = () => {
    const nextDay = new Date(simulatedTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 35, 0, 0); // 12:35 AM next day
    setSimulatedTime(nextDay);
  };

  const resetSimulatedTime = () => {
    setSimulatedTime(new Date());
  };

  // Wallet recharge action
  const rechargeWallet = (amount: number, utr: string) => {
    if (amount < 520) {
      return { success: false, message: 'Minimum recharge amount is ₹520.' };
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
  // Enforces:
  // 1. Min 1, Max 10 purchases per product
  // 2. Prerequisites for E, F, G
  // 3. Instant cash bonus credit to withdrawable balance
  const purchaseProduct = (productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G', quantity: number) => {
    const product = PRODUCTS_CATALOG.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Invalid product selected.' };

    if (quantity < 1 || quantity > 10) {
      return { success: false, message: 'You can purchase minimum 1 unit and maximum 10 units at a time.' };
    }

    const currentlyOwned = getProductOwnedCount(productId);
    if (currentlyOwned + quantity > 10) {
      return {
        success: false,
        message: `Limit Exceeded: You currently own ${currentlyOwned} units. Maximum allowed per product is 10 units.`
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

    // Transaction for purchase
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

    // Bonus transaction credited immediately
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

    if (amount < 150) {
      return { success: false, message: 'Minimum withdrawal amount is ₹150.' };
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

    const fee = Math.round(amount * 0.10 * 100) / 100;
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
      message: `Withdrawal request for ₹${amount.toLocaleString()} submitted successfully! ₹${netAmount.toLocaleString()} will arrive in your bank within 30 minutes.`
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
    const totalDaily = investments.reduce((sum, inv) => sum + inv.dailyIncome, 0);
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

  return (
    <AppContext.Provider
      value={{
        user,
        investments,
        transactions,
        teamMembers,
        catalog: PRODUCTS_CATALOG,
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
