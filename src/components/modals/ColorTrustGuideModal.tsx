import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Palette, ShieldCheck } from 'lucide-react';

export const ColorTrustGuideModal: React.FC = () => {
  const { showColorTrustGuide, setShowColorTrustGuide } = useApp();

  if (!showColorTrustGuide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Design Palette System</h3>
              <p className="text-[10px] text-blue-600 font-medium">Option 2: Clean Fintech (Stripe & Revolut)</p>
            </div>
          </div>
          <button
            onClick={() => setShowColorTrustGuide(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Introduction */}
        <div className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            You selected <strong className="text-blue-600">Option 2 (Clean Modern Fintech)</strong>. The app utilizes a crisp <strong className="text-slate-800">Ice-White slate canvas</strong> with pure white cards, high-contrast <strong className="text-blue-600">Deep Cobalt</strong> primaries, and <strong className="text-emerald-600">Emerald Mint</strong> yield indicators.
          </p>
        </div>

        {/* Color Palette Cards */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Palette Breakdown</span>
            </div>

            <div className="grid grid-cols-4 gap-2 py-1">
              {/* Swatch 1 */}
              <div className="space-y-1 text-center">
                <div className="h-10 rounded-lg bg-[#F8FAFC] border border-slate-200 shadow-xs" />
                <span className="text-[9px] text-slate-600 block font-mono">#F8FAFC</span>
                <span className="text-[8px] text-slate-500 block">Ice Canvas</span>
              </div>
              {/* Swatch 2 */}
              <div className="space-y-1 text-center">
                <div className="h-10 rounded-lg bg-white border border-slate-200 shadow-xs" />
                <span className="text-[9px] text-slate-600 block font-mono">#FFFFFF</span>
                <span className="text-[8px] text-slate-500 block">Pure Card</span>
              </div>
              {/* Swatch 3 */}
              <div className="space-y-1 text-center">
                <div className="h-10 rounded-lg bg-blue-600 border border-blue-700 shadow-xs text-white" />
                <span className="text-[9px] text-blue-600 block font-mono font-bold">#2563EB</span>
                <span className="text-[8px] text-slate-500 block">Cobalt CTA</span>
              </div>
              {/* Swatch 4 */}
              <div className="space-y-1 text-center">
                <div className="h-10 rounded-lg bg-emerald-500 border border-emerald-600 shadow-xs text-white" />
                <span className="text-[9px] text-emerald-600 block font-mono font-bold">#10B981</span>
                <span className="text-[8px] text-slate-500 block">Yield Mint</span>
              </div>
            </div>

            <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4 pt-1">
              <li><strong>Institutional Trust:</strong> Sleek Ice Slate canvas combined with crisp card elevation generates maximum fintech reliability.</li>
              <li><strong>Clear Returns Distinction:</strong> Daily profits and passive harvests stand out in vibrant Emerald Mint rather than competing with actions.</li>
              <li><strong>Zero Clutter:</strong> Sharp slate typography ensures effortless readability across all screen sizes.</li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowColorTrustGuide(false)}
          className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition"
        >
          Close Guide
        </button>
      </div>
    </div>
  );
};
