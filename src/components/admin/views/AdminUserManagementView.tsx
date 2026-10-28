import React, { useState, useMemo, useEffect } from 'react';
import { TablePagination } from '../TablePagination';
import { fetchAllUserProfilesDB } from '../../../lib/supabase';
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

// Initial registered users list (clean for production live accounts)
export const INITIAL_BEE_GROW_USERS: AdminUserItem[] = [];

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

  // Fetch real users from Supabase on mount
  useEffect(() => {
    async function loadRealUsers() {
      try {
        const liveUsers = await fetchAllUserProfilesDB();
        setUsers(liveUsers || []);
      } catch (e) {
        console.error('Error fetching live users in admin:', e);
      }
    }
    loadRealUsers();
  }, []);
  
  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    mobile: '',
    sponsorId: 'Root',
    password: '',
    initialBalance: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

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

    const randomId = `FC${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newUser: AdminUserItem = {
      id: `usr-${Date.now()}`,
      userId: randomId,
      name: createForm.name,
      mobile: createForm.mobile,
      sponsorId: createForm.sponsorId || 'Root',
      kycStatus: 'UNFILLED',
      vipLevel: 'VIP 1',
      status: 'Active',
      walletBalance: Number(createForm.initialBalance) || 0,
      totalEarned: 0,
      joined: new Date().toISOString().slice(0, 10),
      profileLocked: false,
    };

    setUsers(prev => [newUser, ...prev]);
    showToast(`User ${newUser.name} created successfully with ID ${newUser.userId}!`);
    setShowCreateModal(false);
    setCreateForm({ name: '', mobile: '', sponsorId: 'Root', password: '', initialBalance: 0 });
  };

  // Export Excel / CSV
  const handleExport = () => {
    const headers = ['#', 'User ID', 'Name', 'Mobile', 'Sponsor ID', 'KYC', 'Status', 'Wallet Balance', 'Joined'];
    const rows = filteredUsers.map((u, i) => [
      i + 1,
      u.userId,
      u.name,
      u.mobile,
      u.sponsorId,
      u.kycStatus,
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00] transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => { setDateFilter(''); setCustomDate(''); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                !dateFilter ? 'bg-[#FF4A00] text-white shadow-md shadow-[#FF4A00]/25' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => { setDateFilter('today'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                dateFilter === 'today' ? 'bg-[#FF4A00] text-white shadow-md shadow-[#FF4A00]/25' : 'text-slate-600 hover:bg-slate-100'
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
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 uppercase outline-none focus:border-[#FF4A00]"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4A00] hover:bg-[#E04000] text-white text-xs font-extrabold transition shadow-md shadow-[#FF4A00]/25"
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
              dateFilter === 'today' ? 'bg-[#FF4A00] text-white border-[#FF4A00] shadow-sm' : 'bg-white border-slate-200 text-slate-700'
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
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-sans font-medium outline-none"
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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => {
                  const serialNumber = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-sans text-slate-400 font-bold">
                        {serialNumber}
                      </td>
                      <td className="px-4 py-3.5 font-bold font-sans text-slate-900 tracking-tight">
                        {user.userId}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 font-sans">
                        {user.name}
                      </td>
                      <td className="px-4 py-3.5 font-sans font-semibold text-slate-700">
                        {user.mobile}
                      </td>
                      <td className="px-4 py-3.5 font-sans font-bold text-slate-800 tracking-tight">
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold font-sans text-slate-900 tracking-tight">
                        ₹ {user.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 font-sans font-medium text-slate-500 text-[11px]">
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

        {/* Pagination & Rows-Per-Page Selector */}
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="users"
        />
      </div>

      {/* ================= MODAL: CREATE USER ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1536] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FF4A00]" />
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans font-bold outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sponsor ID</label>
                <input
                  type="text"
                  placeholder="e.g. Sponsor ID or Root"
                  value={createForm.sponsorId}
                  onChange={(e) => setCreateForm({ ...createForm, sponsorId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans font-bold outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans font-bold outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
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
                  className="flex-1 py-2.5 rounded-xl bg-[#FF4A00] hover:bg-[#E04000] text-white font-extrabold text-xs shadow-md shadow-[#FF4A00]/25 transition"
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
