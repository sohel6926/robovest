import React, { useState } from 'react';
import { Clock, Percent, Save, CheckCircle2, Sliders } from 'lucide-react';
import { PlatformSettings } from '../../../types';

interface AdminSettingsViewProps {
  settings: PlatformSettings;
  onSaveSettings: (settings: PlatformSettings) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
  showToast,
}) => {
  const [withdrawalDays, setWithdrawalDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]);
  const [withdrawalStart, setWithdrawalStart] = useState(settings?.dailyWithdrawalWindowStart || '00:30');
  const [withdrawalEnd, setWithdrawalEnd] = useState(settings?.dailyWithdrawalWindowEnd || '17:00');

  const [topupDays, setTopupDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  const [topupStart, setTopupStart] = useState('00:00');
  const [topupEnd, setTopupEnd] = useState('23:59');

  const [tdsPercent, setTdsPercent] = useState<number>(settings?.withdrawalFeePercent || 10);

  React.useEffect(() => {
    if (settings) {
      if (settings.dailyWithdrawalWindowStart) setWithdrawalStart(settings.dailyWithdrawalWindowStart);
      if (settings.dailyWithdrawalWindowEnd) setWithdrawalEnd(settings.dailyWithdrawalWindowEnd);
      if (settings.withdrawalFeePercent !== undefined) setTdsPercent(settings.withdrawalFeePercent);
    }
  }, [settings]);

  const toggleWithdrawalDay = (day: string) => {
    setWithdrawalDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleTopupDay = (day: string) => {
    setTopupDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const updated: PlatformSettings = {
      ...settings,
      withdrawalFeePercent: tdsPercent,
      dailyWithdrawalWindowStart: withdrawalStart,
      dailyWithdrawalWindowEnd: withdrawalEnd,
    };
    onSaveSettings(updated);
    showToast('Platform Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure global application parameters dynamically.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4A00] hover:bg-[#E04000] text-white font-extrabold text-sm shadow-md shadow-[#FF4A00]/25 transition active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 2-Column Grid: Withdrawal & Top-up Settings (matching Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Withdrawal Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-sans">
              Withdrawal Settings
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2.5">
              Allowed Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => {
                const isSelected = withdrawalDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWithdrawalDay(day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      isSelected
                        ? 'bg-[#0B1536] text-white font-extrabold'
                        : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Start Time (IST)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={withdrawalStart}
                  onChange={(e) => setWithdrawalStart(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
                />
                <Clock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                End Time (IST)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={withdrawalEnd}
                  onChange={(e) => setWithdrawalEnd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
                />
                <Clock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Top-up Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-sans">
              Top-up Settings
            </h3>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2.5">
              Allowed Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => {
                const isSelected = topupDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleTopupDay(day)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      isSelected
                        ? 'bg-[#FF4A00] text-white font-extrabold shadow-md shadow-[#FF4A00]/25'
                        : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Start Time (IST)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topupStart}
                  onChange={(e) => setTopupStart(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
                />
                <Clock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                End Time (IST)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topupEnd}
                  onChange={(e) => setTopupEnd(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-800 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
                />
                <Clock className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax & Deductions Card (matching Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            %
          </div>
          <h3 className="font-bold text-base text-slate-900 font-sans">
            Tax & Deductions
          </h3>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            TDS Deduction (%)
          </label>
          <div className="relative max-w-xs">
            <input
              type="number"
              min={0}
              max={50}
              value={tdsPercent}
              onChange={(e) => setTdsPercent(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 outline-none focus:border-[#FF4A00] focus:ring-1 focus:ring-[#FF4A00]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              %
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Percentage deducted automatically on withdrawals.
          </p>
        </div>
      </div>
    </div>
  );
};
