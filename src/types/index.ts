export interface InvestmentProduct {
  id: string;
  name: string;
  tagline: string;
  price: number;
  dailyIncome: number;
  durationDays: number;
  totalReturn: number;
  bonus: number;
  minPurchase: number;
  maxPurchase: number;
  requiresPriorInvestment: boolean;
  image: string;
  imagePosition?: string;
  badge?: string;
  tier: 'Standard' | 'Elite' | 'Quantum Apex' | string;
  robotModel: string;
  specs: string[];
  isActive?: boolean;
}

export interface PlatformSettings {
  minRecharge: number;
  minWithdrawal: number;
  withdrawalFeePercent: number;
  dailyWithdrawalWindowStart: string; // e.g. "00:30"
  dailyWithdrawalWindowEnd: string;   // e.g. "17:00"
  enforceNextDayWithdrawalLock: boolean;
  telegramSupportUrl: string;
  telegramChannelUrl: string;
  platformAnnouncement: string;
}

export interface UserInvestment {
  id: string;
  productId: string;
  productName: string;
  robotModel: string;
  quantity: number;
  unitPrice: number;
  totalInvested: number;
  dailyIncome: number;
  bonusReceived: number;
  purchaseTimestamp: number;
  purchaseDateFormatted: string;
  daysElapsed: number;
  totalEarned: number;
  nextPayoutCountdown?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface Transaction {
  id: string;
  type: 'RECHARGE' | 'WITHDRAWAL' | 'DAILY_RETURN' | 'SIGNUP_BONUS' | 'PRODUCT_BONUS' | 'COMMISSION';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING';
  timestamp: number;
  formattedTime: string;
  description: string;
  referenceId?: string;
  fee?: number;
  netAmount?: number;
}

export interface BankAccount {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
  isBound: boolean;
}

export interface MemberPlanHolding {
  id: string;
  planId: string;
  planName: string;
  robotModel: string;
  quantity: number;
  unitPrice: number;
  totalInvested: number;
  dailyYield: number;
  purchaseDate: string;
  daysElapsed: number;
  durationDays: number;
  totalEarned: number;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface TeamMember {
  id: string;
  phone: string;
  joinDate: string;
  level: 1 | 2 | 3;
  inviterId?: string;
  inviteCount: number;
  rechargeAmount: number;
  teamInvested: number;
  commissionGenerated: number;
  status: 'ACTIVE' | 'INACTIVE';
  plans: MemberPlanHolding[];
}

export interface DailyWithdrawalLog {
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
}

export interface UserProfile {
  id: string;
  phone: string;
  inviteCode: string;
  vipLevel: number;
  availableBalance: number;
  withdrawableBalance: number;
  totalRecharge: number;
  totalIncome: number;
  isLoggedIn: boolean;
  bankAccount: BankAccount;
}
