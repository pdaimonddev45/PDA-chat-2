import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ChatView from "./components/ChatView";
import ResearchView from "./components/ResearchView";
import VoiceView from "./components/VoiceView";
import CreativeView from "./components/CreativeView";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import UpgradeModal from "./components/UpgradeModal";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "chat":
        return <ChatView />;
      case "research":
        return <ResearchView />;
      case "voice":
        return <VoiceView />;
      case "creative":
        return <CreativeView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SubscriptionProvider>
      <div id="pda-root" className="flex h-screen w-screen overflow-hidden bg-[#0c0e12] font-sans antialiased text-slate-100 selection:bg-indigo-500/30 selection:text-white">
        {/* Sidebar navigation */}
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />

        {/* Main interactive area */}
        <main id="main-scroll-pane" className="flex-1 flex flex-col min-w-0 h-full relative">
          {renderActiveView()}
        </main>

        {/* Global Billing Upgrader Modal */}
        <UpgradeModal />
      </div>
    </SubscriptionProvider>
  );
}
