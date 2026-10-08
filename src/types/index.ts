export interface InvestmentProduct {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
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
  tier: 'Standard' | 'Elite' | 'Quantum Apex';
  robotModel: string;
  specs: string[];
}

export interface UserInvestment {
  id: string;
  productId: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
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

export interface TeamMember {
  id: string;
  phone: string;
  joinDate: string;
  level: 1 | 2 | 3;
  rechargeAmount: number;
  commissionGenerated: number;
  status: 'ACTIVE' | 'INACTIVE';
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
