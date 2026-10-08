import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Copy, Check, QrCode, MessageCircle, Send, Facebook, Twitter, MoreHorizontal } from 'lucide-react';

export const InviteTab: React.FC = () => {
  const { user } = useApp();
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const inviteLink = `https://robovest.capital/join?ref=${user.inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join RoboVest Autonomous AI Robotics investment platform! Earn daily payouts and automated returns. Use my invite code: ${user.inviteCode} -> ${inviteLink}`;
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({ title: 'RoboVest AI', text, url: inviteLink }).catch(() => {});
      } else {
        handleCopyLink();
      }
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto space-y-4 px-4 pt-2 text-slate-900">
      {/* Top Banner (Screenshot 8) */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-xl font-black text-slate-900 font-['Space_Grotesk']">Invite & Earn</h1>
        <button
          onClick={() => handleShare('native')}
          className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500 -mt-2">
        Let your friend scan the code — you earn on every plan they buy.
      </p>

      {/* QR Code Crisp Card */}
      <div className="rounded-3xl bg-white text-slate-900 p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-4">
        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <QrCode className="w-48 h-48 text-slate-950" />
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Scan this code to open your invite link
        </p>

        {/* Invite Code Pill in Crisp Cobalt */}
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-mono font-bold text-base transition active:scale-95 shadow-xs"
        >
          <span>📋</span>
          <span>{user.inviteCode}</span>
          {copiedCode ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
        </button>
      </div>

      {/* Referral Link Card with Copy Button */}
      <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-between gap-2 shadow-xs">
        <input
          type="text"
          readOnly
          value={inviteLink}
          className="bg-transparent text-xs text-slate-700 font-mono w-full truncate focus:outline-none"
        />
        <button
          onClick={handleCopyLink}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs active:scale-95 transition"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Share Via Circles */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
          Share via
        </span>
        <div className="flex items-center justify-around py-1">
          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 fill-white" />
            </div>
            <span className="text-[11px] text-slate-600 font-medium">WhatsApp</span>
          </button>

          {/* Telegram */}
          <button
            onClick={() => handleShare('telegram')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 fill-white -rotate-12" />
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Telegram</span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Facebook className="w-6 h-6 fill-white" />
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Facebook</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5 fill-white" />
            </div>
            <span className="text-[11px] text-slate-600 font-medium">Twitter</span>
          </button>

          {/* More */}
          <button
            onClick={() => handleShare('native')}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <MoreHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[11px] text-slate-600 font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Commission Levels Card */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          COMMISSION LEVELS
        </h2>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3 shadow-sm">
          {/* Level 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                LV 1
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs">Direct joins</span>
                <span className="text-[11px] text-slate-500 ml-1.5">People you invite yourself</span>
              </div>
            </div>
            <span className="text-lg font-black text-blue-600 tabular-nums">22%</span>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Level 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200">
                LV 2
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs">Second level</span>
                <span className="text-[11px] text-slate-500 ml-1.5">Invited by your Level 1</span>
              </div>
            </div>
            <span className="text-lg font-black text-blue-600 tabular-nums">2%</span>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Level 3 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200">
                LV 3
              </span>
              <div>
                <span className="font-bold text-slate-900 text-xs">Third level</span>
                <span className="text-[11px] text-slate-500 ml-1.5">Invited by your Level 2</span>
              </div>
            </div>
            <span className="text-lg font-black text-blue-600 tabular-nums">1%</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-2 pt-2">
        <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          HOW IT WORKS
        </h2>
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Share the code or link</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Let them scan the QR, or send the link on WhatsApp or Telegram.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">They register and buy a plan</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Your friend signs up through your link and activates a robotics plan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">You earn commission</h3>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Your share is credited to your wallet across all three levels immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
