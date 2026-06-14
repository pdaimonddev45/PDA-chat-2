import React, { useState, useEffect } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import {
  User,
  Shield,
  Layers,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle,
  Flame,
  Settings,
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Eye,
  RefreshCw,
  Search,
  Check,
  Plus,
  Trash2,
  Lock,
  Globe,
  Radio,
  FileCheck,
  Database,
  Cpu,
  Cloud,
  CreditCard,
  Calendar,
  Wrench,
  Play,
  Terminal,
  Sliders,
  Network,
  KeyRound,
  Info
} from "lucide-react";
import AdComponent from "./AdComponent";

// Simple simulated users database for Admin panel
interface SimulatedUser {
  id: string;
  name: string;
  email: string;
  avatarLetter: string;
  plan: "free" | "premium";
  status: "Active" | "Banned" | "Pending";
  joinedDate: string;
  apiTokensUsed: number;
}

export default function DashboardView() {
  const { plan, setPlan, allowances, resetAllowances, setIsUpgradeModalOpen } = useSubscription();

  // Active sub-section within the Dashboard View
  const [activeTab, setActiveTab] = useState<"user_workspace" | "admin_console" | "tech_architecture" | "project_timeline">("user_workspace");

  // Tech stack statuses
  const [mongoDbStatus, setMongoDbStatus] = useState<"connected" | "degraded" | "disconnected">("connected");
  const [cloudinaryStatus, setCloudinaryStatus] = useState<"connected" | "degraded" | "disconnected">("connected");
  const [firebaseStatus, setFirebaseStatus] = useState<"connected" | "degraded" | "disconnected">("connected");
  const [primaryGateway, setPrimaryGateway] = useState<"paystack" | "flutterwave">("paystack");
  const [selectedLlm, setSelectedLlm] = useState<"gemini" | "openai" | "anthropic">("gemini");
  const [selectedCreativeVoice, setSelectedCreativeVoice] = useState<"elevenlabs" | "suno" | "runway" | "dalle">("elevenlabs");

  // Key configurations input simulation
  const [mongoUri, setMongoUri] = useState("mongodb+srv://pda-prod-cluster.auth.mongodb.net/pda_db");
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState("pda-digital-asset-bucket");
  const [firebaseKey, setFirebaseKey] = useState("AIzaSyD-m45vEwOmA_PDAsEcUrE_LoCk");

  // Key stats checking helper action
  const [healthChecking, setHealthChecking] = useState(false);
  const [healthCheckMessage, setHealthCheckMessage] = useState("");

  // Timeline Task list
  const [activeRoadmapWeek, setActiveRoadmapWeek] = useState<number>(7);
  const [weeksTasks, setWeeksTasks] = useState([
    {
      week: 1,
      title: "UI Design & Planning",
      desc: "Architect pixel-perfect screens, space layouts, atomic typography scales, and high contrast palette nodes.",
      status: "completed",
      metrics: "Figma frame links verified, 4 components exported"
    },
    {
      week: 2,
      title: "Authentication & Dashboard",
      desc: "Integrate Firebase Authentication flows and create administration workspaces to evaluate system nodes.",
      status: "completed",
      metrics: "Firebase OAuth links active, Simulated users ready"
    },
    {
      week: 3,
      title: "Chat System & Memory",
      desc: "Establish server-side Gemini intelligence coupled with long-term memory retrieval databases.",
      status: "completed",
      metrics: "Local storage cognition keys verified, Stream active"
    },
    {
      week: 4,
      title: "Voice & Research System",
      desc: "Configure high-speed Text-to-Speech synthesis and search-grounded deep research exploration pipelines.",
      status: "completed",
      metrics: "ElevenLabs API model live, Google Search grounded"
    },
    {
      week: 5,
      title: "Creative Tools Design",
      desc: "Build professional media workspace utilities for image rendering, cinematic editing, and acoustics synthesis.",
      status: "completed",
      metrics: "Canvas drawing matrix active, Audio synthesizer loop"
    },
    {
      week: 6,
      title: "Google AdSense Integration",
      desc: "Inject banner arrays inside main layouts for ad-supported free users, guaranteed removal on premium upgrades.",
      status: "completed",
      metrics: "AdSense header script loaded, CTR counters verified"
    },
    {
      week: 7,
      title: "Payment gateway integration",
      desc: "Deploy Paystack + Flutterwave gateways with Naira & global credit systems supporting rapid billing upgrades.",
      status: "in_progress",
      metrics: "Adaptive Checkout modules ready, Sim hooks active"
    },
    {
      week: 8,
      title: "Rigorous Test & Public Launch",
      desc: "Execute complete end-to-end full-stack diagnostic sequences, load benchmarks, and final Cloud Run container delivery.",
      status: "planned",
      metrics: "Awaiting final workspace validation sequence"
    }
  ]);

  const updateTaskStatus = (weekNum: number, nextStatus: "completed" | "in_progress" | "planned") => {
    setWeeksTasks(prev => prev.map(t => t.week === weekNum ? { ...t, status: nextStatus } : t));
  };

  // Launch compilation diagnostic states
  const [diagnosticProgress, setDiagnosticProgress] = useState<number>(-1);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  // Simulated live creations from different generators
  const [savedCreations, setSavedCreations] = useState<any[]>(() => {
    const saved = localStorage.getItem("pda_saved_creations");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "c-1", type: "Image", prompt: "Cyberpunk Alleyway Neon Signboard", ratio: "16:9", ts: "14-Jun-2026 10:45 AM" },
      { id: "c-2", type: "Video", prompt: "Starfield interstellar journey fast flight warp speed", ratio: "16:9", ts: "14-Jun-2026 11:22 AM" },
      { id: "c-3", type: "Music", prompt: "Ambient focus lofi sequence with filtered pads", ratio: "90 BPM", ts: "14-Jun-2026 12:05 PM" }
    ];
  });

  // Admin states
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>([
    { id: "u-1", name: "Miracle Ewoma", email: "miracleewoma45@gmail.com", avatarLetter: "M", plan: "premium", status: "Active", joinedDate: "2026-05-10", apiTokensUsed: 1450 },
    { id: "u-2", name: "Sarah Williams", email: "sarah.w@vectorlabs.io", avatarLetter: "S", plan: "free", status: "Active", joinedDate: "2026-06-01", apiTokensUsed: 220 },
    { id: "u-3", name: "Alex Mercer", email: "alex.mercer@blackwatch.org", avatarLetter: "A", plan: "free", status: "Banned", joinedDate: "2026-04-18", apiTokensUsed: 4096 },
    { id: "u-4", name: "John Doe", email: "john.doe@gmail.com", avatarLetter: "J", plan: "premium", status: "Active", joinedDate: "2026-06-12", apiTokensUsed: 890 }
  ]);

  // Pricing values for premium subscriptions editable by admin
  const [monthlyPrice, setMonthlyPrice] = useState(19);
  const [isAdMonitoringActive, setIsAdMonitoringActive] = useState(true);
  const [currentAdYield, setCurrentAdYield] = useState(384.45);
  const [adImpressions, setAdImpressions] = useState(12845);
  const [adClickThroughRate, setAdClickThroughRate] = useState(2.3);

  // States to add new simulated users
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPlan, setNewUserPlan] = useState<"free" | "premium">("free");

  // Telemetry system parameters (Admin read)
  const [cpuUsage, setCpuUsage] = useState(34);
  const [memoryUsage, setMemoryUsage] = useState(58);
  const [networkSla, setNetworkSla] = useState(99.98);

  useEffect(() => {
    localStorage.setItem("pda_saved_creations", JSON.stringify(savedCreations));
  }, [savedCreations]);

  // Periodic random adjustment of admin stats to give it dynamic realism
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(10, Math.min(95, prev + delta));
      });
      setMemoryUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(40, Math.min(85, prev + delta));
      });
      if (isAdMonitoringActive) {
        setAdImpressions(prev => prev + Math.floor(Math.random() * 5) + 1);
        setCurrentAdYield(prev => prev + (Math.random() * 0.15));
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isAdMonitoringActive]);

  const handleAddNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim() || !newUserName.trim()) return;

    const userObj: SimulatedUser = {
      id: `u-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      avatarLetter: newUserName.charAt(0).toUpperCase(),
      plan: newUserPlan,
      status: "Active",
      joinedDate: new Date().toISOString().split("T")[0],
      apiTokensUsed: 0
    };

    setSimulatedUsers(prev => [...prev, userObj]);
    setNewUserName("");
    setNewUserEmail("");
  };

  const toggleUserPlan = (id: string) => {
    setSimulatedUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextPlan = u.plan === "free" ? "premium" : "free";
        return { ...u, plan: nextPlan };
      }
      return u;
    }));
  };

  const toggleUserStatus = (id: string) => {
    setSimulatedUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Banned" : "Active";
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteSimulatedUser = (id: string) => {
    setSimulatedUsers(prev => prev.filter(u => u.id !== id));
  };

  const deleteCreation = (id: string) => {
    setSavedCreations(prev => prev.filter(c => c.id !== id));
  };

  const totalAllowancesUsed =
    10 - allowances.image_generation +
    (10 - allowances.image_editing) +
    (10 - allowances.video_generation) +
    (10 - allowances.video_editing) +
    (10 - allowances.music_generation);

  return (
    <div id="dashboard-hub-box" className="flex-1 flex flex-col h-full bg-[#0b0d14] overflow-hidden select-none">
      {/* Dashboard Subheader */}
      <div id="dashboard-subheader" className="bg-[#121622] border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> SYSTEM PORTAL & DASHBOARD HUB
          </h2>
          <p className="text-[11px] text-slate-400">Track client generation metrics, manage visual creations, or administer network subscription nodes.</p>
        </div>

        {/* Workspace selector */}
        <div className="flex flex-wrap gap-1.5 bg-[#0a0c12] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("user_workspace")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "user_workspace"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab("admin_console")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "admin_console"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={() => setActiveTab("tech_architecture")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "tech_architecture"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Tech Stack</span>
          </button>

          <button
            onClick={() => setActiveTab("project_timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "project_timeline"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>8-Week Roadmap</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        {/* UPPER SPONSOR BANNER (HOMEPAGE SECTION PLACEMENT) */}
        {plan === "free" && (
          <div className="max-w-5xl mx-auto">
            <AdComponent placement="homepage_sections" />
          </div>
        )}

        {activeTab === "user_workspace" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* 1. Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div id="stat-profile" className="bg-[#111422] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">CLIENT PROFILE</span>
                <h3 className="text-sm font-bold text-slate-100 truncate">miracleewoma45@gmail.com</h3>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active Vetted Node
                </p>
                <div className="absolute right-4 bottom-4 text-slate-800">
                  <User className="w-12 h-12" />
                </div>
              </div>

              <div id="stat-status" className="bg-[#111422] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">PRICING CLASSIFICATION</span>
                  <div className="flex items-center gap-2 mt-1">
                    {plan === "premium" ? (
                      <span className="px-2.5 py-0.5 rounded bg-indigo-505/15 border border-indigo-500/30 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Premium Enterprise
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-350 font-mono text-xs font-semibold">
                        Free Sandbox Plan
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {plan === "premium" ? (
                    <button
                      onClick={() => { setPlan("free"); resetAllowances(); }}
                      className="text-[10px] text-slate-400 hover:text-white underline font-mono text-left"
                    >
                      Demote to free test plan
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all"
                    >
                      Acquire Premium Access
                    </button>
                  )}
                </div>
              </div>

              <div id="stat-usage" className="bg-[#111422] border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">RESOURCE TRACKING</span>
                {plan === "premium" ? (
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">UNLIMITED</h3>
                    <p className="text-[10px] text-indigo-400 font-mono mt-1">All image, video, and acoustic generators unlocked</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono">{totalAllowancesUsed} / 50</h3>
                    <p className="text-[10px] text-slate-450 font-mono mt-1">Simulation tokens consumed today</p>
                  </div>
                )}
                <div className="absolute right-4 bottom-4 text-slate-800">
                  <Layers className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* 2. Inner workspace columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* SAVED CREATIONS & CHAT HISTORY */}
              <div className="lg:col-span-7 bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4.5 h-4.5 text-indigo-400" /> Saved Creations Registry
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-medium">
                    {savedCreations.length} items
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Review parameters and descriptors utilized in generative workspaces across this active user session.
                </p>

                {savedCreations.length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500">
                    <p className="text-xs">No entries established. Access Creative Studio workspace to render media objects.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedCreations.map((creation) => (
                      <div
                        key={creation.id}
                        className="p-3 bg-slate-950/60 rounded-xl border border-slate-850/80 flex items-start justify-between gap-3 group hover:border-slate-800 transition-colors"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-slate-850 text-indigo-400 font-mono px-1.5 py-0.2 rounded uppercase font-bold">
                              {creation.type}
                            </span>
                            <span className="text-[9px] text-[#00ffaa] font-mono font-medium">
                              {creation.ratio}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 select-text font-mono truncate" title={creation.prompt}>
                            "{creation.prompt}"
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Logged: {creation.ts}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteCreation(creation.id)}
                          title="Remove from history"
                          className="p-1 px-2 text-[10px] border border-transparent hover:border-slate-800 hover:text-rose-400 rounded-lg text-slate-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SIMULATED SYSTEM USAGE ANALYTICS */}
              <div className="lg:col-span-5 bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4.5 h-4.5 text-[#00ffaa]" /> System Usage Visualization
                </h3>

                <p className="text-xs text-slate-400">
                  Interactive load metrics simulated dynamically through the web hosting environment.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Image Gen Quota consumed:</span>
                      <span>{10 - allowances.image_generation} / 10 calls</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${(10 - allowances.image_generation) * 10}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Video Gen/Edit active:</span>
                      <span>{20 - allowances.video_generation - allowances.video_editing} / 20 steps</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${((20 - allowances.video_generation - allowances.video_editing) / 20) * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Music Generation active:</span>
                      <span>{10 - allowances.music_generation} / 10 sessions</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full transition-all duration-300" style={{ width: `${(10 - allowances.music_generation) * 10}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Host Node Region:</span>
                    <span className="text-slate-200">UK-WEST2</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>IP Protocol Link:</span>
                    <span className="text-slate-200">TCP Secured IPv6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "admin_console" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* ADMIN CONSOLE HEADER GRIDS */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono">
              <div className="bg-[#121624] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Pricing Plan Yield</span>
                <span className="block text-lg font-bold text-emerald-400">${monthlyPrice}.00 / mo</span>
              </div>
              <div className="bg-[#121624] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Active Ad impressions</span>
                <span className="block text-lg font-bold text-indigo-400">{adImpressions.toLocaleString()} views</span>
              </div>
              <div className="bg-[#121624] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Ad Monetization CTR</span>
                <span className="block text-lg font-bold text-[#00ffcc]">{adClickThroughRate}%</span>
              </div>
              <div className="bg-[#121624] border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="block text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Simulated Ad Earnings</span>
                <span className="block text-lg font-bold text-yellow-400">${currentAdYield.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ADMIN USERS LIST */}
              <div className="lg:col-span-8 bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4.5 h-4.5 text-indigo-400" /> User Directory Management
                    </h3>
                    <p className="text-[11px] text-slate-450 mt-1">Audit current user profiles, toggle active block bans, or elevate roles.</p>
                  </div>
                </div>

                {/* Users list table layout */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800/80 font-mono text-slate-500 text-[10px] uppercase tracking-wider">
                        <th className="py-2.5 pb-2">Vetted Identity</th>
                        <th className="py-2.5 pb-2">Plan State</th>
                        <th className="py-2.5 pb-2 font-center">Node Status</th>
                        <th className="py-2.5 pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {simulatedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-900/10">
                          <td className="py-3 pr-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold text-indigo-400 font-mono text-xs">
                                {user.avatarLetter}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-200 text-xs">{user.name}</div>
                                <div className="text-[9.5px] text-slate-500 font-mono select-text truncate">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => toggleUserPlan(user.id)}
                              className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                                user.plan === "premium"
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {user.plan}
                            </button>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                                user.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                              }`}
                            >
                              {user.status}
                            </button>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => deleteSimulatedUser(user.id)}
                              title="Delete user record"
                              className="p-1 px-2 border border-transparent hover:border-slate-800 hover:text-rose-400 rounded text-slate-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add new user utility form */}
                <form onSubmit={handleAddNewUser} className="pt-4 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="User Name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                      className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-lg px-2.5 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="email"
                      placeholder="user@domain.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                      className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-lg px-2.5 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value as "free" | "premium")}
                      className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-lg px-2 py-2 border border-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD
                    </button>
                  </div>
                </form>
              </div>

              {/* ADMIN SYSTEM TELEMETRY CONTROL */}
              <div className="lg:col-span-4 bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Settings className="w-4.5 h-4.5 text-slate-350" /> System Metrics Control
                </h3>

                <div className="space-y-4">
                  {/* Cpu / Memory indicators */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Server Engine Core CPU load:</span>
                      <span className="text-[#00ffaa]">{cpuUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00ffaa] h-full transition-all duration-300"
                        style={{ width: `${cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Cache Memory (RAM) leak index:</span>
                      <span className="text-indigo-400">{memoryUsage}%</span>
                    </div>
                    <div className="w-full bg-slate-900 border border-slate-850 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-505 h-full transition-all duration-300"
                        style={{ width: `${memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Ad Toggle switch in telemetry */}
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Live AdSense Feeds:</span>
                      <button
                        onClick={() => setIsAdMonitoringActive(!isAdMonitoringActive)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          isAdMonitoringActive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {isAdMonitoringActive ? "MONITORING ACTIVE" : "STOPPED"}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Toggle whether Google AdSense code layers actively run on live instances or pause.
                    </p>
                  </div>

                  {/* Editable monthly pricing tier */}
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Edit Subscription Pricing:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">Price USD:</span>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={monthlyPrice}
                        onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                        className="w-16 bg-[#181c2b] text-slate-200 font-mono text-xs text-center border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                      />
                      <span className="text-[9.5px] font-mono text-slate-500">/ user / mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TECH ARCHITECTURE VIEW IMPLEMENTATION */}
        {activeTab === "tech_architecture" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header Description banner */}
            <div className="bg-[#121624] border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Database className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono tracking-tight uppercase">Technical Architecture & Services Registry</h3>
                  <p className="text-xs text-slate-400">Control core databases, API authorization states, and third-party media rendering engines.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => {
                    setHealthChecking(true);
                    setHealthCheckMessage("Pinging active MongoDB Cluster & API endpoints...");
                    setTimeout(() => {
                      setHealthCheckMessage(`All nodes verified! MongoDB connected (${mongoDbStatus}), Firebase Active (${firebaseStatus}), Cloudinary Active, Payment gateway (${primaryGateway}) responding within 82ms.`);
                      setHealthChecking(false);
                    }, 1500);
                  }}
                  disabled={healthChecking}
                  className="p-3 bg-indigo-650 hover:bg-indigo-550 border border-slate-800 rounded-xl text-left transition-all font-semibold flex items-center justify-between text-xs text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    {healthChecking ? "Running Diagnostics..." : "Execute Health Check"}
                  </span>
                  <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${healthChecking ? "animate-spin" : ""}`} />
                </button>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Selected LLM:</span>
                  <span className="text-indigo-400 font-bold uppercase">{selectedLlm}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Payment Channel:</span>
                  <span className="text-[#00ffcc] font-bold uppercase">{primaryGateway}</span>
                </div>
              </div>

              {healthCheckMessage && (
                <div className="p-3 bg-slate-950 border border-indigo-950 text-xs text-indigo-300 rounded-xl flex items-start gap-2 max-w-full font-mono animate-fadeIn">
                  <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{healthCheckMessage}</span>
                </div>
              )}
            </div>

            {/* Core Tech Stack Modules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Databases & Storage APIs */}
              <div className="lg:col-span-8 bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                    <Cpu className="w-4.5 h-4.5 text-indigo-400" /> Active Platform Providers
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Configure credentials, toggle visual connection node integrity states, and monitor latency.</p>
                </div>

                <div className="space-y-4">
                  {/* Database Block: MongoDB */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Database className="w-4.5 h-4.5 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">MongoDB Atlas</span>
                        <span className="text-[10px] bg-slate-900 text-slate-500 font-mono px-1.5 py-0.2 rounded font-semibold">DATABASE</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setMongoDbStatus(prev => prev === "connected" ? "degraded" : prev === "degraded" ? "disconnected" : "connected")}
                          className="text-[9.5px] font-mono text-slate-550 underline hover:text-slate-350 cursor-pointer"
                        >
                          Toggle State
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          mongoDbStatus === "connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          mongoDbStatus === "degraded" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}>
                          {mongoDbStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">Mongo Connection String</label>
                      <input
                        type="text"
                        value={mongoUri}
                        onChange={(e) => setMongoUri(e.target.value)}
                        className="w-full bg-[#181c2b] text-slate-300 font-mono text-xs text-left border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Auth Block: Firebase Auth */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4.5 h-4.5 text-yellow-400" />
                        <span className="text-xs font-bold text-slate-200">Firebase Authentication</span>
                        <span className="text-[10px] bg-slate-900 text-slate-500 font-mono px-1.5 py-0.2 rounded font-semibold">SECURITY</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFirebaseStatus(prev => prev === "connected" ? "degraded" : prev === "degraded" ? "disconnected" : "connected")}
                          className="text-[9.5px] font-mono text-slate-550 underline hover:text-slate-350 cursor-pointer"
                        >
                          Toggle State
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          firebaseStatus === "connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          firebaseStatus === "degraded" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}>
                          {firebaseStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">SDK API Key Token Credentials</label>
                      <input
                        type="password"
                        value={firebaseKey}
                        onChange={(e) => setFirebaseKey(e.target.value)}
                        className="w-full bg-[#181c2b] text-slate-300 font-mono text-xs text-left border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Cloud Asset: Cloudinary Storage */}
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 space-y-3 hover:border-slate-800 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Cloud className="w-4.5 h-4.5 text-blue-400" />
                        <span className="text-xs font-bold text-slate-200">Cloudinary Asset Bucket</span>
                        <span className="text-[10px] bg-slate-900 text-slate-500 font-mono px-1.5 py-0.2 rounded font-semibold">CDN STORAGE</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCloudinaryStatus(prev => prev === "connected" ? "degraded" : prev === "degraded" ? "disconnected" : "connected")}
                          className="text-[9.5px] font-mono text-slate-550 underline hover:text-slate-350 cursor-pointer"
                        >
                          Toggle State
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          cloudinaryStatus === "connected" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          cloudinaryStatus === "degraded" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        }`}>
                          {cloudinaryStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">Cloudinary Domain Reference</label>
                      <input
                        type="text"
                        value={cloudinaryCloudName}
                        onChange={(e) => setCloudinaryCloudName(e.target.value)}
                        className="w-full bg-[#181c2b] text-slate-300 font-mono text-xs text-left border border-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Model Gates & Payment processors */}
              <div className="lg:col-span-4 space-y-6">
                {/* PAYMENT INTEGRATION CARD */}
                <div className="bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                    <CreditCard className="w-4.5 h-4.5 text-indigo-400" /> Billing Gateways
                  </h4>
                  <p className="text-[11px] text-slate-400">Select active primary billing processing node for upgrade checkouts (Paystack vs Flutterwave).</p>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setPrimaryGateway("paystack")}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        primaryGateway === "paystack"
                          ? "bg-indigo-605 text-white border-indigo-500 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-mono">PAYSTACK</span>
                      <span className="text-[8.5px] text-indigo-300 block font-mono font-normal">Active SDK 2.0</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryGateway("flutterwave")}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        primaryGateway === "flutterwave"
                          ? "bg-indigo-605 text-white border-indigo-500 font-bold"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <span className="block text-xs font-mono">FLUTTERWAVE</span>
                      <span className="text-[8.5px] text-indigo-300 block font-mono font-normal">SDK Live v3</span>
                    </button>
                  </div>

                  {/* Webhook log simulator */}
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 mt-1 select-text space-y-2">
                    <span className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">Gateway Webhook Receiver Logging</span>
                    <p className="text-[9.5px] font-mono text-indigo-400 leading-normal break-all select-all">
                      [WEBHOOK] {primaryGateway === "paystack" ? "paystack.co" : "flutterwave.com"}/v2/callbacks receiving: {"{"} "event": "charge.success", "gateway": "{primaryGateway}" {"}"}
                    </p>
                  </div>
                </div>

                {/* AI GATEWAYS PANEL */}
                <div className="bg-[#121624] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                    <Network className="w-4.5 h-4.5 text-indigo-400" /> AI LLM Gateways
                  </h4>
                  <p className="text-[11px] text-slate-400">Toggle central conversational reasoning orchestrator. Each uses distinct token rate weights.</p>

                  <div className="space-y-2">
                    <div
                      role="button"
                      onClick={() => setSelectedLlm("gemini")}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedLlm === "gemini" ? "bg-indigo-500/10 border-indigo-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-mono font-semibold">Google Gemini 2.5 Flash</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-indigo-300">Default API</span>
                    </div>

                    <div
                      role="button"
                      onClick={() => setSelectedLlm("openai")}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedLlm === "openai" ? "bg-indigo-500/10 border-indigo-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-mono font-semibold">OpenAI GPT-4o proxy</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-indigo-300">Custom key</span>
                    </div>

                    <div
                      role="button"
                      onClick={() => setSelectedLlm("anthropic")}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedLlm === "anthropic" ? "bg-indigo-505/10 border-indigo-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-mono font-semibold">Anthropic Claude 3.5</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-indigo-300">Mock active</span>
                    </div>
                  </div>

                  {/* Multi-AI Creators integration summary */}
                  <div className="pt-3 border-t border-slate-850 space-y-2">
                    <span className="block text-[8.5px] font-mono font-bold text-slate-500 uppercase tracking-widest">Active Multi-AI Integrations</span>
                    <div className="grid grid-cols-2 gap-1.5 text-[9.5px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>DALL-E Images</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Runway Videos</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Suno Audios</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-900/60 rounded border border-slate-850">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>ElevenLabs TTS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT TIMELINE ROADMAP VIEW IMPLEMENTATION */}
        {activeTab === "project_timeline" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Roadmap Header metrics banner */}
            <div className="bg-[#121624] border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono tracking-tight uppercase">8-Week Project Milestone Timeline</h3>
                    <p className="text-xs text-slate-400 font-sans">Track accomplishments, milestone schedules, and live testing compilation codes.</p>
                  </div>
                </div>
                
                {/* Metric completion bar */}
                <div className="bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-850 flex items-center gap-3 w-full md:w-auto font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">ROADMAP PROGRESS:</span>
                    <span className="text-sm font-extrabold text-indigo-400">{Math.floor((weeksTasks.filter(t => t.status === "completed").length / 8) * 100)}% COMPLETE</span>
                  </div>
                  <div className="w-20 bg-slate-900 border border-slate-805 h-2.5 rounded-full overflow-hidden flex-shrink-0">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300" 
                      style={{ width: `${(weeksTasks.filter(t => t.status === "completed").length / 8) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Progress track nodes list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-4 border-t border-slate-800/60 text-center text-[10px] font-mono">
                {weeksTasks.map((t) => (
                  <div 
                    key={t.week}
                    onClick={() => setActiveRoadmapWeek(t.week)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      activeRoadmapWeek === t.week 
                        ? "bg-indigo-500/15 border-indigo-550 text-white font-bold scale-[1.03]" 
                        : t.status === "completed"
                        ? "bg-emerald-950/10 border-emerald-900/30 text-emerald-400"
                        : t.status === "in_progress"
                        ? "bg-amber-955/10 border-amber-900/30 text-amber-400 font-medium"
                        : "bg-slate-900/40 border-slate-850 text-slate-500"
                    }`}
                  >
                    <span className="block font-semibold">Wk {t.week}</span>
                    <span className="text-[8px] opacity-75 capitalize font-normal">{t.status.replace("_", " ")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Roadmap Week Details and Simulator Logs Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Focused Week Card Details */}
              <div className="lg:col-span-6 bg-[#121624] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                {(() => {
                  const focusedTask = weeksTasks.find(t => t.week === activeRoadmapWeek);
                  if (!focusedTask) return null;
                  return (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-85 pb-3">
                          <span className="px-2.5 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                            MILESTONE WEEK {focusedTask.week}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                            focusedTask.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                            focusedTask.status === "in_progress" ? "bg-amber-500/10 text-amber-400" :
                            "bg-slate-800 text-slate-500"
                          }`}>
                            {focusedTask.status.replace("_", " ")}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-white tracking-tight leading-snug">{focusedTask.title}</h4>
                          <p className="text-xs text-slate-400 leading-normal">{focusedTask.desc}</p>
                        </div>

                        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 space-y-1 font-mono text-[11px]">
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Vetted Metrics Logs</span>
                          <span className="block text-slate-300">{focusedTask.metrics}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-850/60 space-y-2">
                        <span className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Override Task Status Simulation</span>
                        <div className="flex gap-2.5">
                          <button
                            type="button"
                            onClick={() => updateTaskStatus(activeRoadmapWeek, "completed")}
                            className="flex-1 py-1 px-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Mark Completed
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTaskStatus(activeRoadmapWeek, "in_progress")}
                            className="flex-1 py-1 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Mark Active
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTaskStatus(activeRoadmapWeek, "planned")}
                            className="flex-1 py-1 px-2 bg-slate-800 hover:bg-slate-750 text-slate-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Reset Planned
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Right Column: Week 8 Launch diagnostic Simulator compiler */}
              <div className="lg:col-span-6 bg-[#121624] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Terminal className="w-4.5 h-4.5 text-indigo-400 animate-pulse" /> Launch Diagnostic Controller
                  </h4>
                  <p className="text-xs text-slate-400">
                    Verify complete compilation bounds of the 8-week production launch payload. Ping databases, check integrations, and initiate production shipping container builds.
                  </p>
                </div>

                <div className="bg-slate-950 font-mono text-[10.5px] p-4 rounded-xl border border-slate-850 h-56 overflow-y-auto space-y-1.5 scrollbar-thin select-text">
                  {diagnosticProgress === -1 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 py-8">
                      <Terminal className="w-8 h-8 text-indigo-950 mb-2" />
                      <span>Console diagnostics waiting to ignite. Unlock system checks below.</span>
                    </div>
                  ) : (
                    <>
                      {diagnosticLogs.map((log, idx) => (
                        <div key={idx} className={`leading-normal ${
                          log.includes("[RELEASE SUCCESS]") || log.includes("SUCCESS") ? "text-emerald-400 font-bold" :
                          log.includes("[COMPILER]") || log.includes("[DEPLOY]") ? "text-indigo-450" :
                          log.includes("[AUTHENTICATED]") ? "text-yellow-400" : "text-slate-400"
                        }`}>
                          {log}
                        </div>
                      ))}
                      {diagnosticProgress < 100 && (
                        <div className="flex items-center gap-1.5 text-indigo-400 animate-pulse text-[9.5px]">
                          <span>●</span>
                          <span>Compiling launch files... ({diagnosticProgress}%)</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDiagnosticProgress(0);
                      setDiagnosticLogs(["[SYSTEM] Initializing launchpad diagnostic sequence..."]);
                      
                      const logs = [
                        "[SYSTEM] Loading production environment variables...",
                        `[DATABASE] Connecting to MongoDB Cluster: "${mongoUri.substring(0, 30)}..."`,
                        "[DATABASE] Connection pool verified. SLA: 100% stable.",
                        `[AUTH] Initializing Firebase Auth node with secure JWT verification key...`,
                        "[AUTH] Auth verified. Google & email credentials sandbox active.",
                        `[STORAGE] Checking Cloudinary Cloud API: "${cloudinaryCloudName}"...`,
                        "[STORAGE] Cloudinary assets mapped. 4 image buffers online.",
                        `[PAYMENTS] Validating primary payment processing channels (${primaryGateway.toUpperCase()})...`,
                        "[PAYMENTS] Webhook registers authenticated successfully with payment nodes.",
                        `[INTEGRATION] Pre-compiling LLM central controller router (${selectedLlm.toUpperCase()})...`,
                        `[CREATIVE] Synchronizing voice (ElevenLabs), video (Runway), music (Suno)...`,
                        "[COMPILER] Packaging optimized production Next.js & Tailwind static files...",
                        "[DEPLOY] Building container layer. Push successful to production hosting hub.",
                        "🎉 [RELEASE SUCCESS] Application platform is fully live at launchpad!"
                      ];

                      let currentLogIndex = 0;
                      const interval = setInterval(() => {
                        if (currentLogIndex < logs.length) {
                          setDiagnosticLogs(prev => [...prev, logs[currentLogIndex]]);
                          setDiagnosticProgress(prev => Math.min(100, Math.floor(((currentLogIndex + 1) / logs.length) * 100)));
                          currentLogIndex++;
                        } else {
                          clearInterval(interval);
                        }
                      }, 700);
                    }}
                    disabled={diagnosticProgress !== -1 && diagnosticProgress < 100}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{diagnosticProgress === 100 ? "Restart Launch Diagnostic Sequence" : "Initialize End-to-End Compile & Ship"}</span>
                  </button>
                  <p className="text-[9.5px] text-slate-500 leading-normal text-center select-none font-mono">
                    Compiles local frontend modules with server backend microservices and registers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
