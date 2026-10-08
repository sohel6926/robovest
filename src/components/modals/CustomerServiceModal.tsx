import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Headset, Shield } from 'lucide-react';

export const CustomerServiceModal: React.FC = () => {
  const { showCustomerCare, setShowCustomerCare } = useApp();
  const [inLiveChat, setInLiveChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Hello Commander! Welcome to RoboVest 24/7 Priority Support Desk. How may we assist your robotics portfolio today?',
      time: '12:00 PM'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');

  if (!showCustomerCare) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    const curTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: curTime }]);
    setInputVal('');

    setTimeout(() => {
      let reply = 'Our support officer is verifying your account ID. Please note our official withdrawal window is 00:30 to 17:00 daily, and funds invested today unlock next day after 12:30 AM.';
      const lower = userMsg.toLowerCase();
      if (lower.includes('withdraw') || lower.includes('12:30') || lower.includes('next day')) {
        reply = 'Withdrawal Rule Reminder: Any investment deployed today unlocks for withdrawal tomorrow after 12:30 AM (00:30 hrs). Minimum withdrawal is ₹150 with a 10% tax deduction.';
      } else if (lower.includes('product') || lower.includes('unlock') || lower.includes('e') || lower.includes('f') || lower.includes('g')) {
        reply = 'Elite Products E, F, and G require holding an active investment in Product A, B, C, or D first. You can purchase up to 10 units per robot model!';
      } else if (lower.includes('recharge') || lower.includes('deposit') || lower.includes('upi')) {
        reply = 'Recharges are credited instantly once you submit your 12-digit UTR reference code. Minimum recharge is ₹520.';
      }
      setMessages(prev => [...prev, { sender: 'agent', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Headset className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Support & Helpline</h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live 24×7 Official Desk
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCustomerCare(false);
              setInLiveChat(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {inLiveChat ? (
          /* Live Chat Desk */
          <div className="flex-1 flex flex-col min-h-[320px] max-h-[420px]">
            <div className="flex-1 overflow-y-auto space-y-2.5 p-1 pr-1.5">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-br-xs shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 mt-0.5">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="flex gap-1.5 overflow-x-auto py-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInputVal('When can I withdraw my investment returns?');
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-[10px] text-slate-700 hover:text-blue-600 border border-slate-200 transition"
              >
                Withdrawal Rule?
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputVal('How to unlock Product E, F, G?');
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-[10px] text-slate-700 hover:text-blue-600 border border-slate-200 transition"
              >
                Unlock E, F, G?
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 shrink-0">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Hub view */
          <div className="space-y-4">
            {/* We Are Here For You Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2 text-xs shadow-xs">
              <h4 className="font-extrabold text-sm text-slate-900">We are here for you</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Whether it is a recharge, a withdrawal, your plan or your account — our team is here to help. Use the buttons below to reach our official team directly. Never share your password or OTP with anyone.
              </p>
            </div>

            {/* Channels & Chat options */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                GET IN TOUCH
              </span>

              {/* Official Channel */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-xs hover:border-blue-200 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 border border-sky-100 flex items-center justify-center">
                    <Send className="w-5 h-5 -rotate-12" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Official Channel</h5>
                    <p className="text-[10px] text-slate-500">Latest updates & announcements</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open('https://t.me', '_blank')}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Join
                </button>
              </div>

              {/* Customer Care */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-xs hover:border-blue-200 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                    <Headset className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Customer Care</h5>
                    <p className="text-[10px] text-slate-500">Personal help, one to one</p>
                  </div>
                </div>
                <button
                  onClick={() => setInLiveChat(true)}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Chat
                </button>
              </div>
            </div>

            {/* Official Security Caution Note */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[10px] text-slate-700 leading-relaxed flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Our team is reachable only through official verified links. Please do not trust any duplicate or unofficial accounts.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
