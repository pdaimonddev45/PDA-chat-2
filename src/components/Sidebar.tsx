import React from "react";
import { MessageSquare, Binary, Volume2, Sparkles, User, Database, Check, Award, ShieldAlert } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  userEmail?: string;
}

export default function Sidebar({ currentView, onChangeView, userEmail = "miracleewoma45@gmail.com" }: SidebarProps) {
  const { plan, allowances, setIsUpgradeModalOpen } = useSubscription();

  const menuItems = [
    { id: "dashboard", label: "System Dashboard", icon: Database, desc: "Telemetry logs & accounts" },
    { id: "chat", label: "Unlimited Chat", icon: MessageSquare, desc: "Multimodal dialogue suite" },
    { id: "research", label: "Deep Research", icon: Binary, desc: "Search grounded exploration" },
    { id: "voice", label: "Voice Arena", icon: Volume2, desc: "High-end TTS conversation" },
    { id: "creative", label: "Creative Studio", icon: Sparkles, desc: "Image gen & story crafts" },
  ];

  // Helper to compute overall remaining allowances for free users
  const totalFreeRemaining =
    allowances.image_generation +
    allowances.image_editing +
    allowances.video_generation +
    allowances.video_editing +
    allowances.music_generation;

  return (
    <aside id="sidebar-container" className="w-80 bg-[#0c0e12] border-r border-[#1a1f29] flex flex-col h-full text-slate-300">
      {/* Brand Header */}
      <div id="sidebar-header" className="p-6 border-b border-[#1a1f29] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">PDA CHAT AI</h1>
          <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-widest">Enterprise Core</span>
        </div>
      </div>

      {/* Navigation list */}
      <nav id="sidebar-nav" className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] uppercase font-semibold text-slate-500 px-3 tracking-widest mb-3">
          Core Workspaces
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`tab-btn-${item.id}`}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-start gap-3.5 p-3.5 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? "bg-slate-800/60 border border-slate-700/50 shadow-inner text-white shadow-slate-900/40"
                  : "hover:bg-slate-900/50 border border-transparent hover:text-slate-100"
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? "bg-indigo-600/30 text-indigo-400" : "bg-slate-900 text-slate-400"}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.label}</div>
                <div className={`text-[10px] truncate ${isActive ? "text-slate-400" : "text-slate-500"}`}>{item.desc}</div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Stateful subscription summary card */}
      <div id="sidebar-subscription-badge" className="p-4 mx-4 mb-3 bg-[#111420] border border-indigo-900/20 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Pricing Bracket</span>
          {plan === "premium" ? (
            <span className="flex items-center gap-1 text-[10px] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
              <Award className="w-3 h-3" /> Premium
            </span>
          ) : (
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
              Free Plan
            </span>
          )}
        </div>

        {plan === "premium" ? (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-200">Unlimited System Stream Active</p>
            <p className="text-[10px] text-indigo-450 font-mono">No ads. Priority queue access.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Simulated Allowances</span>
              <span className="font-mono font-semibold text-indigo-400">{totalFreeRemaining} / 50</span>
            </div>
            {/* Visual allocation slider progress */}
            <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{ width: `${(totalFreeRemaining / 50) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-550 hover:to-purple-550 text-white rounded-xl text-xs font-bold transition-all shadow hover:scale-[1.02] active:scale-[0.98] select-none text-center"
            >
              Unlock Premium Portal
            </button>
          </div>
        )}
      </div>

      {/* Diagnostic Server State */}
      <div id="sidebar-diagnostic" className="p-4 mx-4 mb-3 bg-[#111622] rounded-xl border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-mono text-slate-400">Node Status: Active</span>
        </div>
        <div className="flex items-center gap-1 bg-[#182033] px-2 py-0.5 rounded text-[10px] font-mono text-indigo-400">
          <Database className="w-3 h-3" />
          <span>V3.5-G</span>
        </div>
      </div>

      {/* User Area */}
      <div id="sidebar-user" className="p-4 border-t border-[#1a1f29] bg-[#090b0e] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold shadow-sm">
          <User className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-400 truncate">Vetted Member</div>
          <div className="text-xs font-semibold text-slate-200 truncate" title={userEmail}>
            {userEmail}
          </div>
        </div>
      </div>
    </aside>
  );
}
