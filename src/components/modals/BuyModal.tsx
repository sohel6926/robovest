import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Zap, Gift, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const BuyModal: React.FC = () => {
  const { 
    showBuyModal, 
    setShowBuyModal, 
    purchaseProduct, 
    user, 
    canInvestInProduct, 
    getProductOwnedCount,
    setShowOrdersModal
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  if (!showBuyModal) return null;

  const product = showBuyModal;
  const currentOwned = getProductOwnedCount(product.id);
  const maxAvailableToBuy = Math.max(0, 10 - currentOwned);
  const prereqCheck = canInvestInProduct(product.id);

  const totalCost = product.price * quantity;
  const totalDaily = product.dailyIncome * quantity;
  const totalReturn = product.totalReturn * quantity;
  const totalBonus = product.bonus * quantity;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < maxAvailableToBuy) {
      setQuantity(quantity + 1);
    }
  };

  const handleConfirmPurchase = () => {
    const res = purchaseProduct(product.id, quantity);
    if (res.success) {
      setPurchaseSuccess(res.message);
      setTimeout(() => {
        setPurchaseSuccess(null);
        setShowBuyModal(null);
        setShowOrdersModal(true);
      }, 1800);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setShowBuyModal(null)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Identity */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img
              src={product.image}
              alt={product.robotModel}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${product.imagePosition || 'object-center'}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900">{product.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-black uppercase">
                {product.tier}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">{product.robotModel}</p>
            <div className="text-xs font-bold text-blue-600 mt-0.5">
              ₹{product.price.toLocaleString()} / 150 Days
            </div>
          </div>
        </div>

        {/* Prerequisite Check Banner for E, F, G */}
        {!prereqCheck.allowed ? (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Investment Requirement Locked</span>
            </div>
            <p className="text-[11px] text-rose-600 leading-relaxed">
              {prereqCheck.reason}
            </p>
          </div>
        ) : (
          /* Quantity Selector (Min 1, Max 10 rule) */
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Purchase Quantity</span>
              <span className="text-blue-600 font-bold">
                Owned: {currentOwned}/10 (Max 10 total)
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg bg-white disabled:opacity-40 text-slate-700 font-bold text-lg flex items-center justify-center active:scale-95 transition hover:bg-slate-100 border border-slate-200"
              >
                -
              </button>

              <div className="text-center">
                <span className="text-2xl font-black text-blue-600 font-['Space_Grotesk'] tabular-nums">
                  {quantity}
                </span>
                <span className="text-[10px] text-slate-500 block -mt-1">
                  {quantity === 1 ? 'Robot Unit' : 'Robot Units'}
                </span>
              </div>

              <button
                onClick={handleIncrease}
                disabled={quantity >= maxAvailableToBuy}
                className="w-10 h-10 rounded-lg bg-white disabled:opacity-40 text-slate-700 font-bold text-lg flex items-center justify-center active:scale-95 transition hover:bg-slate-100 border border-slate-200"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>Total Investment</span>
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              ₹{totalCost.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-800">
            <span>Daily Profit ({quantity} units)</span>
            <span className="font-bold text-emerald-600 tabular-nums">+₹{totalDaily.toLocaleString()} /day</span>
          </div>

          <div className="flex justify-between items-center text-slate-800">
            <span>Total 150-Day Return</span>
            <span className="font-bold text-slate-900 tabular-nums">₹{totalReturn.toLocaleString()}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-blue-700 font-bold">
            <span className="flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Instant Cash Bonus</span>
            </span>
            <span className="text-sm tabular-nums">+₹{totalBonus.toLocaleString()}</span>
          </div>
        </div>

        {/* Withdrawal Unlock Notice */}
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 flex items-start gap-2">
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Daily earnings from this robot unit unlock for withdrawal <strong>Next Day after 12:30 AM (00:30 hrs)</strong>.
          </span>
        </div>

        {/* Wallet Balance Check */}
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-slate-500">Your Wallet Balance:</span>
          <span className={`font-bold ${user.availableBalance >= totalCost ? 'text-slate-900' : 'text-rose-600'}`}>
            ₹{user.availableBalance.toLocaleString()}
          </span>
        </div>

        {purchaseSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{purchaseSuccess}</span>
          </div>
        )}

        {/* Purchase CTA */}
        {!prereqCheck.allowed ? (
          <button
            disabled
            className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-200"
          >
            Locked (Invest in Plan A, B, C or D First)
          </button>
        ) : user.availableBalance < totalCost ? (
          <button
            onClick={() => {
              setShowBuyModal(null);
              alert('Please recharge your wallet balance first.');
            }}
            className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition"
          >
            Insufficient Balance (Recharge Needed)
          </button>
        ) : (
          <button
            onClick={handleConfirmPurchase}
            disabled={quantity > maxAvailableToBuy}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Confirm Deployment (₹{totalCost.toLocaleString()})</span>
          </button>
        )}
      </div>
    </div>
  );
};
