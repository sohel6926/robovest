import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Download, 
  UserPlus, 
  Eye, 
  Power, 
  Wallet, 
  Lock, 
  LockOpen, 
  ChevronLeft, 
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface AdminUserItem {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  sponsorId: string;
  kycStatus: 'UNFILLED' | 'APPROVED' | 'PENDING' | 'REJECTED';
  cadre?: string;
  vipLevel?: string;
  status: 'Active' | 'InActive';
  walletBalance: number;
  totalEarned: number;
  totalInvested?: number;
  activePlansCount?: number;
  directReferrals?: number;
  totalTeam?: number;
  referralIncome?: number;
  levelIncome?: number;
  roiIncome?: number;
  joined: string;
  profileLocked?: boolean;
  bankAccount?: {
    accountHolder?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    isBound?: boolean;
  };
  investments?: {
    id: string;
    planName: string;
    category: string;
    amountInvested: number;
    totalReturn: number;
    earnedSoFar: number;
    monthlyReturn: string;
    startDate: string;
    endDate: string;
    duration: string;
    nextPayout: string;
    status: 'Active' | 'Completed';
  }[];
}

// Authentic registered users from Bee Grow live console (Screenshot 4 & 5)
export const INITIAL_BEE_GROW_USERS: AdminUserItem[] = [
  {
    id: 'usr-maddi',
    userId: 'B4443722',
    name: 'Maddi Satyanarayana',
    mobile: '9676389932',
    email: 'satyanarayanamaddi821@gmail.com',
    city: 'Amadalavalasa',
    sponsorId: 'B9776636',
    kycStatus: 'UNFILLED',
    cadre: 'VIP 1',
    vipLevel: 'VIP 1',
    status: 'Active',
    walletBalance: 2220,
    totalEarned: 2220,
    totalInvested: 500000,
    activePlansCount: 1,
    directReferrals: 0,
    totalTeam: 0,
    referralIncome: 0,
    levelIncome: 0,
    roiIncome: 2220,
    joined: '2026-10-23',
    profileLocked: false,
    investments: [
      {
        id: 'fnc-spt-7721',
        planName: 'Product B (Formula 1 Grand Prix)',
        category: 'FanCode Sports Yield',
        amountInvested: 500000,
        totalReturn: 1000000,
        earnedSoFar: 2220,
        monthlyReturn: '₹500 / Day',
        startDate: '23/10/2026, 8:43:57 pm',
        endDate: '22/03/2027, 8:43:57 pm',
        duration: '150 Days',
        nextPayout: 'Daily 18:30 IST',
        status: 'Active'
      }
    ]
  },
  {
    id: 'usr-1',
    userId: 'B1326654',
    name: 'Rowthu Bangarulaxmi',
    mobile: '8688344830',
    sponsorId: 'B6176059',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-18',
    profileLocked: false,
  },
  {
    id: 'usr-2',
    userId: 'B2169683',
    name: 'GORLE HARISH',
    mobile: '8688951464',
    sponsorId: 'B9418694',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-18',
    profileLocked: false,
  },
  {
    id: 'usr-3',
    userId: 'B3273426',
    name: 'Konapala Santosh kumar',
    mobile: '6302507044',
    sponsorId: 'B6677949',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-17',
    profileLocked: false,
  },
  {
    id: 'usr-4',
    userId: 'B2485735',
    name: 'P SAMPATH KUMAR',
    mobile: '8328109953',
    sponsorId: 'B1734794',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-17',
    profileLocked: false,
  },
  {
    id: 'usr-5',
    userId: 'B4553454',
    name: 'Varshitha varma',
    mobile: '9014362717',
    sponsorId: 'B2895816',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-16',
    profileLocked: false,
  },
  {
    id: 'usr-6',
    userId: 'B1402520',
    name: 'YEDDU NAGABHUSHANA RAO',
    mobile: '7093626362',
    sponsorId: 'B3822517',
    kycStatus: 'APPROVED',
    cadre: 'Star',
    status: 'Active',
    walletBalance: 80.01,
    totalEarned: 1250,
    joined: '2026-10-15',
    profileLocked: false,
  },
  {
    id: 'usr-7',
    userId: 'B1641345',
    name: 'BUDIDA NARASA',
    mobile: '9441121206',
    sponsorId: 'B3822517',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-15',
    profileLocked: false,
  },
  {
    id: 'usr-8',
    userId: 'B5677881',
    name: 'SAVARA RAJARAO',
    mobile: '7702676850',
    sponsorId: 'B3822517',
    kycStatus: 'UNFILLED',
    cadre: 'Star',
    status: 'InActive',
    walletBalance: 0,
    totalEarned: 0,
    joined: '2026-10-15',
    profileLocked: false,
  },
  {
    id: 'usr-9',
    userId: 'B4386992',
    name: 'MEESALA ASWANI',
    mobile: '7780477960',
    sponsorId: 'B7638923',
    kycStatus: 'APPROVED',
    cadre: 'Star',
    status: 'Active',
    walletBalance: 666.66,
    totalEarned: 4500,
    joined: '2026-10-15',
    profileLocked: false,
  },
  {
    id: 'usr-10',
    userId: 'B7638923',
    name: 'MEESALA RAMU',
    mobile: '8185835615',
    sponsorId: 'B3434967',
    kycStatus: 'APPROVED',
    cadre: 'Star',
    status: 'Active',
    walletBalance: 5146.67,
    totalEarned: 18200,
    joined: '2026-10-15',
    profileLocked: true,
  },
  {
    id: 'usr-11',
    userId: 'B5294001',
    name: 'User5294 (Master Account)',
    mobile: '9876543210',
    sponsorId: 'Root',
    kycStatus: 'APPROVED',
    cadre: 'AGM',
    status: 'Active',
    walletBalance: 12450.00,
    totalEarned: 52400,
    joined: '2026-10-01',
    profileLocked: false,
  }
];

interface AdminUserManagementViewProps {
  onInspectUser: (user: AdminUserItem) => void;
  onOpenAddMoneyForUser: (user: AdminUserItem) => void;
  onExportCSV: (filename: string, headers: string[], rows: (string | number)[][]) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminUserManagementView: React.FC<AdminUserManagementViewProps> = ({
  onInspectUser,
  onOpenAddMoneyForUser,
  onExportCSV,
  showToast,
}) => {
  const [users, setUsers] = useState<AdminUserItem[]>(INITIAL_BEE_GROW_USERS);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<'' | 'today' | 'custom'>('');
  const [customDate, setCustomDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'Active' | 'InActive'>('');
  
  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    mobile: '',
    sponsorId: 'B5294001',
    password: '',
    initialBalance: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          user.userId.toLowerCase().includes(q) ||
          user.name.toLowerCase().includes(q) ||
          user.mobile.includes(q) ||
          user.sponsorId.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Status
      if (statusFilter && user.status !== statusFilter) {
        return false;
      }

      // Date
      if (dateFilter === 'today') {
        const todayStr = new Date().toISOString().slice(0, 10);
        if (user.joined !== todayStr && !user.joined.includes('10-18')) return false;
      } else if (dateFilter === 'custom' && customDate) {
        if (user.joined !== customDate) return false;
      }

      return true;
    });
  }, [users, search, statusFilter, dateFilter, customDate]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Toggle user active status
  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.userId === userId) {
        const newStatus = u.status === 'Active' ? 'InActive' : 'Active';
        showToast(`User ${u.userId} marked as ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // Toggle profile lock
  const handleToggleLock = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId || u.userId === userId) {
        const newLock = !u.profileLocked;
        showToast(`User ${u.userId} profile ${newLock ? 'LOCKED' : 'UNLOCKED'}`);
        return { ...u, profileLocked: newLock };
      }
      return u;
    }));
  };

  // Handle Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.mobile) {
      showToast('Name and mobile number are required.', 'error');
      return;
    }

    const randomId = `B${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newUser: AdminUserItem = {
      id: `usr-${Date.now()}`,
      userId: randomId,
      name: createForm.name,
      mobile: createForm.mobile,
      sponsorId: createForm.sponsorId || 'Root',
      kycStatus: 'UNFILLED',
      cadre: 'Star',
      status: 'Active',
      walletBalance: Number(createForm.initialBalance) || 0,
      totalEarned: 0,
      joined: new Date().toISOString().slice(0, 10),
      profileLocked: false,
    };

    setUsers(prev => [newUser, ...prev]);
    showToast(`User ${newUser.name} created successfully with ID ${newUser.userId}!`);
    setShowCreateModal(false);
    setCreateForm({ name: '', mobile: '', sponsorId: 'B5294001', password: '', initialBalance: 0 });
  };

  // Export Excel / CSV
  const handleExport = () => {
    const headers = ['#', 'User ID', 'Name', 'Mobile', 'Sponsor ID', 'KYC', 'VIP Tier', 'Status', 'Wallet Balance', 'Joined'];
    const rows = filteredUsers.map((u, i) => [
      i + 1,
      u.userId,
      u.name,
      u.mobile,
      u.sponsorId,
      u.kycStatus,
      u.vipLevel || u.cadre || 'VIP 1',
      u.status,
      u.walletBalance,
      u.joined
    ]);
    onExportCSV(`FanCode_Users_${dateFilter || 'All'}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View, search, and manage all registered users.
        </p>
      </div>

      {/* Filter Bar (Row 1) */}
      <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Name, Mobile or Sponsor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#70c028] focus:ring-1 focus:ring-[#70c028] transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => { setDateFilter(''); setCustomDate(''); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                !dateFilter ? 'bg-[#70c028] text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => { setDateFilter('today'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                dateFilter === 'today' ? 'bg-[#70c028] text-slate-950 shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateFilter(e.target.value ? 'custom' : '');
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 uppercase outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 uppercase outline-none focus:border-[#70c028]"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 text-xs font-extrabold transition shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* Filter Row 2 (Quick Date & Count) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => { setDateFilter(dateFilter === 'today' ? '' : 'today'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              dateFilter === 'today' ? 'bg-[#70c028] text-slate-950 border-[#70c028]' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            Today
          </button>
          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setDateFilter(e.target.value ? 'custom' : '');
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-medium outline-none"
          />
        </div>

        <span className="text-slate-400 font-medium ml-2">
          {filteredUsers.length} users found
        </span>

        <button
          onClick={handleExport}
          className="ml-auto flex items-center gap-1 px-3 py-1 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs shadow-xs transition"
        >
          <Download className="w-3 h-3" />
          <span>Export Excel</span>
        </button>
      </div>

      {/* The Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Sponsor ID</th>
                <th className="px-4 py-3">KYC</th>
                <th className="px-4 py-3">VIP Tier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => {
                  const serialNumber = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-slate-400 font-bold">
                        {serialNumber}
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                        {user.userId}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 font-sans">
                        {user.name}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        {user.mobile}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#70c028]">
                        {user.sponsorId}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          user.kycStatus === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.kycStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold">
                          {user.vipLevel || user.cadre || 'VIP 1'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                        ₹ {user.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                        {user.joined}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Eye / View 360 */}
                          <button
                            onClick={() => onInspectUser(user)}
                            title="View Full Profile Details"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Power / Toggle Active */}
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                            className={`p-1.5 rounded-lg transition ${
                              user.status === 'Active'
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-rose-500 hover:bg-rose-50'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          {/* Wallet / Credit/Debit */}
                          <button
                            onClick={() => onOpenAddMoneyForUser(user)}
                            title="Add Wallet Balance"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>

                          {/* Lock / Unlock */}
                          <button
                            onClick={() => handleToggleLock(user.id)}
                            title={user.profileLocked ? 'Unlock Profile' : 'Lock Profile'}
                            className={`p-1.5 rounded-lg transition ${
                              user.profileLocked
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {user.profileLocked ? <Lock className="w-4 h-4" /> : <LockOpen className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center gap-1.5 bg-white text-xs font-bold text-slate-600">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                  currentPage === pageNum
                    ? 'bg-[#0B1536] text-white font-bold shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                  currentPage === totalPages
                    ? 'bg-[#0B1536] text-white font-bold shadow-xs'
                    : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================= MODAL: CREATE USER ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1536] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#70c028]" />
                <h3 className="font-bold text-base font-sans">Create New User</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (Login ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="10-digit mobile number"
                  value={createForm.mobile}
                  onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sponsor ID</label>
                <input
                  type="text"
                  placeholder="e.g. B5294001 or Root"
                  value={createForm.sponsorId}
                  onChange={(e) => setCreateForm({ ...createForm, sponsorId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Initial Wallet Credit (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={createForm.initialBalance || ''}
                  onChange={(e) => setCreateForm({ ...createForm, initialBalance: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:border-[#70c028]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#70c028] hover:bg-[#84cc16] text-slate-950 font-extrabold text-xs shadow-md shadow-[#70c028]/20 transition"
                >
                  Confirm & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
