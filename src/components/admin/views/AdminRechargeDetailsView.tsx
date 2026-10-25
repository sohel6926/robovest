import React, { useState } from 'react';
import {
  QrCode,
  CreditCard,
  Building2,
  Copy,
  Check,
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  Eye,
  Sliders,
  X,
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { PlatformSettings, AdminRechargeQrCode, AdminRechargeBankAccount } from '../../../types';

interface AdminRechargeDetailsViewProps {
  settings: PlatformSettings;
  onSaveSettings: (settings: PlatformSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminRechargeDetailsView: React.FC<AdminRechargeDetailsViewProps> = ({
  settings,
  onSaveSettings,
  showToast,
}) => {
  // Navigation sub-tab inside Recharge Management
  const [activeSection, setActiveSection] = useState<'qr' | 'bank' | 'general'>('qr');

  // Master Gateway Status
  const [gatewayActive, setGatewayActive] = useState<boolean>(
    settings?.rechargeGatewayActive !== undefined ? settings.rechargeGatewayActive : true
  );

  // Initialize QR Codes list (with fallback to legacy single UPI if list is empty)
  const [qrList, setQrList] = useState<AdminRechargeQrCode[]>(() => {
    if (settings?.rechargeQrList && settings.rechargeQrList.length > 0) {
      return settings.rechargeQrList;
    }
    return [
      {
        id: 'qr-1',
        label: 'Primary UPI Gateway (PhonePe / GPay / BHIM)',
        upiId: settings?.rechargeUpiId || 'fancode.payments@hdfcbank',
        payeeName: settings?.rechargePayeeName || 'FanCode Payments',
        qrImageUrl: settings?.rechargeQrImageUrl || '',
        isActive: true,
      }
    ];
  });

  // Initialize Bank Accounts list (with fallback to legacy single bank if list is empty)
  const [bankList, setBankList] = useState<AdminRechargeBankAccount[]>(() => {
    if (settings?.rechargeBankList && settings.rechargeBankList.length > 0) {
      return settings.rechargeBankList;
    }
    return [
      {
        id: 'bank-1',
        bankName: settings?.rechargeBankName || 'HDFC Bank',
        accountHolder: settings?.rechargeAccountHolder || 'FanCode Technologies Pvt Ltd',
        accountNumber: settings?.rechargeAccountNumber || '50200084729103',
        ifscCode: settings?.rechargeIfscCode || 'HDFC0000128',
        accountType: 'Current Account',
        branch: 'Indiranagar Branch',
        isActive: true,
      }
    ];
  });

  // General Settings
  const [minRecharge, setMinRecharge] = useState<number>(settings?.minRecharge || 520);
  const [quickAmounts, setQuickAmounts] = useState<string>(
    (settings?.rechargeQuickAmounts || [520, 1999, 2100, 5999, 8200, 17960]).join(', ')
  );
  const [instructions, setInstructions] = useState<string>(
    settings?.rechargeInstructions ||
      'Scan using PhonePe, Google Pay, Paytm, or BHIM. After payment is successful, enter the 12-digit UTR transaction reference number below.'
  );

  React.useEffect(() => {
    if (settings) {
      if (settings.rechargeGatewayActive !== undefined) {
        setGatewayActive(settings.rechargeGatewayActive);
      }
      if (settings.rechargeQrList && settings.rechargeQrList.length > 0) {
        setQrList(settings.rechargeQrList);
      } else if (settings.rechargeUpiId) {
        setQrList([{
          id: 'qr-1',
          label: 'Primary UPI Gateway (PhonePe / GPay / BHIM)',
          upiId: settings.rechargeUpiId,
          payeeName: settings.rechargePayeeName || 'FanCode Payments',
          qrImageUrl: settings.rechargeQrImageUrl || '',
          isActive: true,
        }]);
      }
      if (settings.rechargeBankList && settings.rechargeBankList.length > 0) {
        setBankList(settings.rechargeBankList);
      } else if (settings.rechargeAccountNumber) {
        setBankList([{
          id: 'bank-1',
          bankName: settings.rechargeBankName || 'HDFC Bank',
          accountHolder: settings.rechargeAccountHolder || 'FanCode Technologies Pvt Ltd',
          accountNumber: settings.rechargeAccountNumber,
          ifscCode: settings.rechargeIfscCode || 'HDFC0000128',
          accountType: 'Current Account',
          branch: 'Indiranagar Branch',
          isActive: true,
        }]);
      }
      if (settings.minRecharge !== undefined) {
        setMinRecharge(settings.minRecharge);
      }
      if (settings.rechargeQuickAmounts && settings.rechargeQuickAmounts.length > 0) {
        setQuickAmounts(settings.rechargeQuickAmounts.join(', '));
      }
      if (settings.rechargeInstructions !== undefined) {
        setInstructions(settings.rechargeInstructions);
      }
    }
  }, [settings]);

  // Modal / Form state for Add / Edit QR Code
  const [editingQrId, setEditingQrId] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrForm, setQrForm] = useState<Omit<AdminRechargeQrCode, 'id'>>({
    label: '',
    upiId: '',
    payeeName: '',
    qrImageUrl: '',
    isActive: true,
  });

  // Modal / Form state for Add / Edit Bank Account
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);
  const [bankForm, setBankForm] = useState<Omit<AdminRechargeBankAccount, 'id'>>({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Current Account',
    branch: '',
    isActive: true,
  });

  // Error states for modal validations
  const [qrErrors, setQrErrors] = useState<{ label?: string; upiId?: string }>({});
  const [bankErrors, setBankErrors] = useState<{ bankName?: string; accountHolder?: string; accountNumber?: string; ifscCode?: string }>({});

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // ---------------------------------------------------------------------------
  // QR CODE ACTIONS
  // ---------------------------------------------------------------------------
  const handleOpenAddQr = () => {
    setEditingQrId(null);
    setQrErrors({});
    setQrForm({
      label: `UPI Option ${qrList.length + 1}`,
      upiId: '',
      payeeName: 'FanCode Payments',
      qrImageUrl: '',
      isActive: true,
    });
    setIsQrModalOpen(true);
  };

  const handleOpenEditQr = (item: AdminRechargeQrCode) => {
    setEditingQrId(item.id);
    setQrErrors({});
    setQrForm({
      label: item.label,
      upiId: item.upiId,
      payeeName: item.payeeName,
      qrImageUrl: item.qrImageUrl || '',
      isActive: item.isActive,
    });
    setIsQrModalOpen(true);
  };

  const handleSaveQrModal = () => {
    const errors: { label?: string; upiId?: string } = {};
    if (!qrForm.label.trim()) {
      errors.label = 'Method name / label is required';
    }
    if (!qrForm.upiId.trim()) {
      errors.upiId = 'UPI ID (VPA) is required (e.g. name@bank)';
    }

    if (Object.keys(errors).length > 0) {
      setQrErrors(errors);
      showToast('Please enter the required UPI details highlighted below.', 'error');
      return;
    }
    setQrErrors({});

    if (editingQrId) {
      setQrList(prev =>
        prev.map(item =>
          item.id === editingQrId
            ? { ...item, ...qrForm }
            : item
        )
      );
      showToast('QR Code updated.');
    } else {
      const newQr: AdminRechargeQrCode = {
        id: `qr-${Date.now()}`,
        ...qrForm,
      };
      setQrList(prev => [...prev, newQr]);
      showToast('New QR Code added.');
    }
    setIsQrModalOpen(false);
  };

  const handleDeleteQr = (id: string) => {
    if (qrList.length === 1) {
      showToast('At least one QR code / UPI option must remain configured.', 'error');
      return;
    }
    if (window.confirm('Are you sure you want to delete this QR code?')) {
      setQrList(prev => prev.filter(item => item.id !== id));
      showToast('QR code removed.');
    }
  };

  const handleToggleQrActive = (id: string) => {
    setQrList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file size must be under 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setQrForm(prev => ({ ...prev, qrImageUrl: result }));
        showToast('Custom QR image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // ---------------------------------------------------------------------------
  // BANK ACCOUNT ACTIONS
  // ---------------------------------------------------------------------------
  const handleOpenAddBank = () => {
    setEditingBankId(null);
    setBankForm({
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'Current Account',
      branch: '',
      isActive: true,
    });
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (item: AdminRechargeBankAccount) => {
    setEditingBankId(item.id);
    setBankForm({
      bankName: item.bankName,
      accountHolder: item.accountHolder,
      accountNumber: item.accountNumber,
      ifscCode: item.ifscCode,
      accountType: item.accountType || 'Current Account',
      branch: item.branch || '',
      isActive: item.isActive,
    });
    setIsBankModalOpen(true);
  };

  const handleSaveBankModal = () => {
    const errors: { bankName?: string; accountHolder?: string; accountNumber?: string; ifscCode?: string } = {};
    if (!bankForm.bankName.trim()) errors.bankName = 'Bank name is required';
    if (!bankForm.accountHolder.trim()) errors.accountHolder = 'Account holder is required';
    if (!bankForm.accountNumber.trim()) errors.accountNumber = 'Account number is required';
    if (!bankForm.ifscCode.trim()) errors.ifscCode = 'IFSC code is required';

    if (Object.keys(errors).length > 0) {
      setBankErrors(errors);
      showToast('Please fill in the required bank details highlighted below.', 'error');
      return;
    }
    setBankErrors({});

    if (editingBankId) {
      setBankList(prev =>
        prev.map(item =>
          item.id === editingBankId
            ? { ...item, ...bankForm }
            : item
        )
      );
      showToast('Bank account details updated.');
    } else {
      const newBank: AdminRechargeBankAccount = {
        id: `bank-${Date.now()}`,
        ...bankForm,
      };
      setBankList(prev => [...prev, newBank]);
      showToast('New bank account added.');
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      setBankList(prev => prev.filter(item => item.id !== id));
      showToast('Bank account removed.');
    }
  };

  const handleToggleBankActive = (id: string) => {
    setBankList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  // ---------------------------------------------------------------------------
  // MASTER SAVE & RESET
  // ---------------------------------------------------------------------------
  const handleMasterSave = () => {
    const parsedAmounts = quickAmounts
      .split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n > 0);

    // Pick first active QR code or first QR code as primary for backward compatibility
    const primaryQr = qrList.find(q => q.isActive) || qrList[0];
    const primaryBank = bankList.find(b => b.isActive) || bankList[0];

    const updated: PlatformSettings = {
      ...settings,
      minRecharge: Number(minRecharge) || 520,
      rechargeGatewayActive: gatewayActive,
      rechargeInstructions: instructions.trim(),
      rechargeQuickAmounts: parsedAmounts.length > 0 ? parsedAmounts : [520, 1999, 2100, 5999, 8200, 17960],

      // Legacy fallback fields
      rechargeUpiId: primaryQr?.upiId || '',
      rechargePayeeName: primaryQr?.payeeName || '',
      rechargeQrImageUrl: primaryQr?.qrImageUrl || '',
      rechargeBankName: primaryBank?.bankName || '',
      rechargeAccountHolder: primaryBank?.accountHolder || '',
      rechargeAccountNumber: primaryBank?.accountNumber || '',
      rechargeIfscCode: primaryBank?.ifscCode || '',

      // Multi lists
      rechargeQrList: qrList,
      rechargeBankList: bankList,
    };

    onSaveSettings(updated);
    showToast('All recharge details saved! Changes are now live across the website.', 'success');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all recharge details, QR codes, and bank accounts to defaults?')) {
      const defaultQr: AdminRechargeQrCode[] = [
        {
          id: 'qr-1',
          label: 'Primary UPI Gateway (PhonePe / GPay / BHIM)',
          upiId: 'fancode.payments@hdfcbank',
          payeeName: 'FanCode Payments',
          qrImageUrl: '',
          isActive: true,
        }
      ];
      const defaultBank: AdminRechargeBankAccount[] = [
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
      ];

      setQrList(defaultQr);
      setBankList(defaultBank);
      setMinRecharge(520);
      setQuickAmounts('520, 1999, 2100, 5999, 8200, 17960');
      setInstructions('Scan using PhonePe, Google Pay, Paytm, or BHIM. After payment is successful, enter the 12-digit UTR transaction reference number below.');
      setGatewayActive(true);
      showToast('Reset to defaults. Remember to click "Save & Apply Changes".');
    }
  };

  const activeQrCount = qrList.filter(q => q.isActive).length;
  const activeBankCount = bankList.filter(b => b.isActive).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fe4600] to-orange-400 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">Recharge & Deposit Details</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    gatewayActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${gatewayActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {gatewayActive ? 'Gateway Active' : 'Gateway Paused'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure multiple UPI QR codes, IMPS/NEFT bank accounts, and deposit amounts shown to members.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleMasterSave}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4A00] hover:bg-[#E04000] text-white font-extrabold text-xs shadow-md shadow-[#FF4A00]/25 transition active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Changes</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills: Clean & Easy to Understand */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'qr'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>UPI & QR Codes</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeSection === 'qr' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {activeQrCount} Active
          </span>
        </button>

        <button
          onClick={() => setActiveSection('bank')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'bank'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bank Accounts (IMPS/NEFT)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeSection === 'bank' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {activeBankCount} Active
          </span>
        </button>

        <button
          onClick={() => setActiveSection('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSection === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>General & Limits</span>
        </button>
      </div>

      {/* =======================================================================
          SECTION 1: MULTIPLE UPI & QR CODES
      ======================================================================== */}
      {activeSection === 'qr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Configured UPI IDs & QR Codes</h2>
              <p className="text-xs text-slate-500">
                Members will see these QR codes on the deposit page. If multiple are active, members can switch between them.
              </p>
            </div>
            <button
              onClick={handleOpenAddQr}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New QR Code</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qrList.map((item, idx) => {
              const deepLink = `upi://pay?pa=${encodeURIComponent(item.upiId)}&pn=${encodeURIComponent(item.payeeName)}&cu=INR`;
              const autoQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(deepLink)}`;
              const qrSrc = item.qrImageUrl || autoQr;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                    item.isActive ? 'border-slate-200 ring-1 ring-emerald-500/10' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Label and Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-100 text-[#fe4600] font-bold text-xs flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{item.label}</h3>
                          <span className="text-[10px] text-slate-400">
                            {item.qrImageUrl ? 'Custom Uploaded QR' : 'Dynamic Auto-Generated'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleQrActive(item.id)}
                        type="button"
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Click to toggle Active status"
                      >
                        {item.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    {/* QR Code Preview Thumbnail */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                        <img
                          src={qrSrc}
                          alt="QR Thumbnail"
                          className="w-18 h-18 object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">UPI ID (VPA)</span>
                        <div className="flex items-center justify-between gap-1 bg-white px-2 py-1 rounded-md border border-slate-200">
                          <span className="font-sans text-xs font-bold text-slate-900 truncate">
                            {item.upiId}
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.upiId, item.id)}
                            className="text-slate-400 hover:text-blue-600 transition shrink-0 cursor-pointer"
                            title="Copy UPI ID"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">
                          Payee: <strong className="text-slate-900">{item.payeeName}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditQr(item)}
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteQr(item.id)}
                      type="button"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =======================================================================
          SECTION 2: MULTIPLE BANK ACCOUNTS (IMPS / NEFT)
      ======================================================================== */}
      {activeSection === 'bank' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Direct Bank Accounts (IMPS / NEFT / RTGS)</h2>
              <p className="text-xs text-slate-500">
                Members can transfer directly into these accounts for high-value deposits.
              </p>
            </div>
            <button
              onClick={handleOpenAddBank}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bank Account</span>
            </button>
          </div>

          {bankList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">No bank accounts added yet.</p>
              <button
                onClick={handleOpenAddBank}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                + Add First Bank Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bankList.map((item, idx) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col justify-between ${
                    item.isActive ? 'border-slate-200 ring-1 ring-purple-500/10' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Bank Name & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs">{item.bankName}</h3>
                          <span className="text-[10px] text-purple-600 font-semibold">
                            {item.accountType || 'Current Account'} {item.branch ? `• ${item.branch}` : ''}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleBankActive(item.id)}
                        type="button"
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Click to toggle Active status"
                      >
                        {item.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    {/* Account Details Box */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Beneficiary / Holder</span>
                        <span className="font-semibold text-slate-900 text-xs truncate block">
                          {item.accountHolder}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Account Number</span>
                          <span className="font-sans font-bold text-slate-900 text-xs">
                            {item.accountNumber}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.accountNumber, `acc-${item.id}`)}
                          className="text-slate-400 hover:text-purple-600 transition shrink-0 cursor-pointer"
                          title="Copy Account Number"
                        >
                          {copiedId === `acc-${item.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">IFSC Code</span>
                          <span className="font-sans font-bold text-slate-900 text-xs">
                            {item.ifscCode}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.ifscCode, `ifsc-${item.id}`)}
                          className="text-slate-400 hover:text-purple-600 transition shrink-0 cursor-pointer"
                          title="Copy IFSC Code"
                        >
                          {copiedId === `ifsc-${item.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditBank(item)}
                      type="button"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBank(item.id)}
                      type="button"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =======================================================================
          SECTION 3: GENERAL SETTINGS & LIMITS
      ======================================================================== */}
      {activeSection === 'general' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recharge Gateway Master Controls</h2>
              <p className="text-xs text-slate-500">Configure global limits and member deposit instructions.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Recharge Allowed:</span>
              <input
                type="checkbox"
                checked={gatewayActive}
                onChange={(e) => setGatewayActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
              <span className={`text-xs font-extrabold ${gatewayActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {gatewayActive ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Minimum Deposit */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Minimum Deposit Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                value={minRecharge}
                onChange={(e) => setMinRecharge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
              />
              <p className="text-[11px] text-slate-400">
                Members cannot deposit lower than this value. Default is ₹520.
              </p>
            </div>

            {/* Quick Amounts */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Quick Selection Amount Chips (₹)
              </label>
              <input
                type="text"
                value={quickAmounts}
                onChange={(e) => setQuickAmounts(e.target.value)}
                placeholder="520, 1999, 2100, 5999, 8200, 17960"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-sans font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
              />
              <p className="text-[11px] text-slate-400">
                Comma-separated values shown as 1-tap preset chips on the deposit screen.
              </p>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Deposit Instructions & Notice Text
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Scan using PhonePe, Google Pay, Paytm, or BHIM..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
              />
              <p className="text-[11px] text-slate-400">
                This notice is shown prominently below the QR code to guide users through copying the UTR.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: ADD / EDIT QR CODE
      ======================================================================== */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#fe4600] flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingQrId ? 'Edit QR Code / UPI Details' : 'Add New UPI QR Code'}
                </h3>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Method Label */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Method Name / Label <span className="text-rose-500">*</span></span>
                  {qrErrors.label && <span className="text-[11px] font-bold text-rose-500">{qrErrors.label}</span>}
                </label>
                <input
                  type="text"
                  value={qrForm.label}
                  onChange={(e) => {
                    setQrForm({ ...qrForm, label: e.target.value });
                    if (qrErrors.label) setQrErrors({ ...qrErrors, label: undefined });
                  }}
                  placeholder="e.g. UPI Option 1 (PhonePe / GPay) or Company Scanner"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none transition ${
                    qrErrors.label ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>UPI ID (VPA) <span className="text-rose-500">*</span></span>
                  {qrErrors.upiId && <span className="text-[11px] font-bold text-rose-500">{qrErrors.upiId}</span>}
                </label>
                <input
                  type="text"
                  value={qrForm.upiId}
                  onChange={(e) => {
                    setQrForm({ ...qrForm, upiId: e.target.value });
                    if (qrErrors.upiId) setQrErrors({ ...qrErrors, upiId: undefined });
                  }}
                  placeholder="e.g. fancode.payments@hdfcbank"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-sans font-bold text-slate-900 focus:bg-white focus:outline-none transition ${
                    qrErrors.upiId ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
              </div>

              {/* Payee Name */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Payee / Business Name</label>
                <input
                  type="text"
                  value={qrForm.payeeName}
                  onChange={(e) => setQrForm({ ...qrForm, payeeName: e.target.value })}
                  placeholder="e.g. FanCode Payments"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {/* Custom QR Image Upload (Optional) */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Custom QR Image <span className="text-slate-400 font-normal">(Optional - Leave empty for Auto Dynamic QR)</span>
                </label>
                <div className="flex items-center gap-3">
                  {qrForm.qrImageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 p-1 bg-white">
                      <img src={qrForm.qrImageUrl} alt="Uploaded QR" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setQrForm({ ...qrForm, qrImageUrl: '' })}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 text-slate-600 cursor-pointer transition">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Scanner Image</span>
                      <input type="file" accept="image/*" onChange={handleQrImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={qrForm.isActive}
                  onChange={(e) => setQrForm({ ...qrForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-bold text-slate-800">Enable this QR code for members</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQrModal}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {editingQrId ? 'Save Changes' : 'Add QR Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: ADD / EDIT BANK ACCOUNT
      ======================================================================== */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingBankId ? 'Edit Bank Account' : 'Add Direct Bank Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Bank Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 flex items-center justify-between">
                    <span>Bank Name <span className="text-rose-500">*</span></span>
                    {bankErrors.bankName && <span className="text-[10px] font-bold text-rose-500">{bankErrors.bankName}</span>}
                  </label>
                  <input
                    type="text"
                    value={bankForm.bankName}
                    onChange={(e) => {
                      setBankForm({ ...bankForm, bankName: e.target.value });
                      if (bankErrors.bankName) setBankErrors({ ...bankErrors, bankName: undefined });
                    }}
                    placeholder="e.g. HDFC Bank, ICICI Bank"
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none transition ${
                      bankErrors.bankName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-purple-600'
                    }`}
                  />
                </div>

                {/* Account Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Account Type</label>
                  <select
                    value={bankForm.accountType}
                    onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 transition"
                  >
                    <option value="Current Account">Current Account</option>
                    <option value="Savings Account">Savings Account</option>
                  </select>
                </div>
              </div>

              {/* Account Holder */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Account Beneficiary / Holder Name <span className="text-rose-500">*</span></span>
                  {bankErrors.accountHolder && <span className="text-[10px] font-bold text-rose-500">{bankErrors.accountHolder}</span>}
                </label>
                <input
                  type="text"
                  value={bankForm.accountHolder}
                  onChange={(e) => {
                    setBankForm({ ...bankForm, accountHolder: e.target.value });
                    if (bankErrors.accountHolder) setBankErrors({ ...bankErrors, accountHolder: undefined });
                  }}
                  placeholder="e.g. FanCode Technologies Pvt Ltd"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none transition ${
                    bankErrors.accountHolder ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Account Number <span className="text-rose-500">*</span></span>
                  {bankErrors.accountNumber && <span className="text-[10px] font-bold text-rose-500">{bankErrors.accountNumber}</span>}
                </label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => {
                    setBankForm({ ...bankForm, accountNumber: e.target.value });
                    if (bankErrors.accountNumber) setBankErrors({ ...bankErrors, accountNumber: undefined });
                  }}
                  placeholder="e.g. 50200084729103"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-sans font-bold text-slate-900 focus:bg-white focus:outline-none transition ${
                    bankErrors.accountNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>IFSC Code <span className="text-rose-500">*</span></span>
                  {bankErrors.ifscCode && <span className="text-[10px] font-bold text-rose-500">{bankErrors.ifscCode}</span>}
                </label>
                <input
                  type="text"
                  value={bankForm.ifscCode}
                  onChange={(e) => {
                    setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() });
                    if (bankErrors.ifscCode) setBankErrors({ ...bankErrors, ifscCode: undefined });
                  }}
                  placeholder="e.g. HDFC0000128"
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs font-sans font-bold text-slate-900 uppercase focus:bg-white focus:outline-none transition ${
                    bankErrors.ifscCode ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 focus:border-purple-600'
                  }`}
                />
              </div>

              {/* Branch */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Branch Name (Optional)</label>
                <input
                  type="text"
                  value={bankForm.branch}
                  onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-purple-600 transition"
                />
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={bankForm.isActive}
                  onChange={(e) => setBankForm({ ...bankForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-bold text-slate-800">Enable this bank account for members</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBankModal}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {editingBankId ? 'Save Changes' : 'Add Bank Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
