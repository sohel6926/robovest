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

  // Recharge / Deposit Gateway Configuration
  rechargeUpiId?: string;
  rechargePayeeName?: string;
  rechargeBankName?: string;
  rechargeQrImageUrl?: string;
  rechargeAccountHolder?: string;
  rechargeAccountNumber?: string;
  rechargeIfscCode?: string;
  rechargeInstructions?: string;
  rechargeQuickAmounts?: number[];
  rechargeGatewayActive?: boolean;

  // Multiple QR Codes & Multiple Bank Accounts
  rechargeQrList?: AdminRechargeQrCode[];
  rechargeBankList?: AdminRechargeBankAccount[];
}

export interface AdminRechargeQrCode {
  id: string;
  label: string; // e.g. "UPI Option 1 (PhonePe / GPay)", "Scanner 2 (Paytm / BHIM)"
  upiId: string;
  payeeName: string;
  qrImageUrl?: string; // Optional custom uploaded QR image
  isActive: boolean;
}

export interface AdminRechargeBankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType?: string; // "Current Account" | "Savings Account"
  branch?: string;
  isActive: boolean;
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
  cyclesHarvested?: number;
  lastHarvestDate?: string;
  nextPayoutCountdown?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface Transaction {
  id: string;
  type: 'RECHARGE' | 'WITHDRAWAL' | 'DAILY_RETURN' | 'SIGNUP_BONUS' | 'PRODUCT_BONUS' | 'COMMISSION';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'REJECTED';
  timestamp: number;
  formattedTime: string;
  description: string;
  referenceId?: string;
  fee?: number;
  netAmount?: number;
  adminNote?: string;
  rejectionReason?: string;
  userId?: string;
  userPhone?: string;
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
  email?: string;
  phone: string;
  inviteCode: string;
  vipLevel: number;
  availableBalance: number;
  withdrawableBalance: number;
  totalRecharge: number;
  totalIncome: number;
  isLoggedIn: boolean;
  bankAccount: BankAccount;
  pin?: string;
  bankDetailsLocked?: boolean;
  inviterId?: string;
  status?: 'Active' | 'InActive';
  directBusiness?: number;
  totalBusiness?: number;
}
