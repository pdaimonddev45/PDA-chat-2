import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { ExternalLink, Info, ShieldAlert, Sparkles, X } from "lucide-react";

interface AdComponentProps {
  placement: "footer_banner" | "homepage_sections" | "creative_tools_pages";
}

export default function AdComponent({ placement }: AdComponentProps) {
  const { plan, setIsUpgradeModalOpen } = useSubscription();
  const [isDismissed, setIsDismissed] = useState(false);

  // If user is premium, AdSense guarantees "no_ads".
  if (plan === "premium" || isDismissed) {
    return null;
  }

  // Realistic mock sponsor campaigns
  const campaigns = {
    footer_banner: {
      title: "Neon Cloud DB: Scaleproof Relational Postgres Node",
      desc: "Instantly spin up serverless database clusters with branching engines and scale-to-zero capabilities.",
      cta: "Explore Cloud Node",
      url: "https://neon.tech",
      color: "from-emerald-500 via-teal-600 to-cyan-500"
    },
    homepage_sections: {
      title: "Aura Creative API: Dynamic Media Pipelines",
      desc: "Deploy premium Stable Diffusion and Llama text-to-video micro-pipelines with simple REST parameters.",
      cta: "Acquire API Access Token",
      url: "https://replicate.com",
      color: "from-purple-600 via-indigo-600 to-pink-500"
    },
    creative_tools_pages: {
      title: "Synthesia Studio: Pro Cinematic Video Generation",
      desc: "Tired of daily limits? Generate studio-grade commercial videos, lifelike avatars, and acoustics with advanced rendering endpoints.",
      cta: "Remove Limits",
      url: "#upgrade",
      color: "from-indigo-600 via-purple-600 to-pink-600"
    }
  };

  const ad = campaigns[placement];

  return (
    <div
      id={`adsense-panel-${placement}`}
      className={`relative w-full overflow-hidden border border-slate-800 bg-[#0a0c13]/90 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl shadow-black/40 animate-fadeIn ${
        placement === "footer_banner" ? "mt-auto max-w-5xl mx-auto mb-4" : ""
      }`}
    >
      {/* Background radial highlight */}
      <div className={`absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none`}></div>

      {/* Sponsored Badging */}
      <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[8px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none select-none">
        <span>Ads by Google AdSense</span>
        <Info className="w-2.5 h-2.5" />
      </div>

      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Dynamic miniature visual container */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ad.color} flex items-center justify-center text-white font-bold text-xs shadow flex-shrink-0 relative`}>
          <Sparkles className="w-5.5 h-5.5 animate-pulse" />
          <div className="absolute -top-1 -left-1 bg-yellow-400 text-slate-950 font-bold text-[8px] px-1 rounded-full scale-90 select-none">
            AD
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h4 className="text-xs font-bold text-slate-100 tracking-tight flex items-center gap-2">
            {ad.title}
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal max-w-2xl text-justify">
            {ad.desc}
          </p>
        </div>
      </div>

      {/* Click and dismissed controls */}
      <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
        {ad.url === "#upgrade" ? (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="w-full md:w-auto px-4 py-2 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all select-none duration-250 cursor-pointer"
          >
            {ad.cta}
          </button>
        ) : (
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-4 py-2 bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-center transition-all select-none duration-250 inline-flex items-center justify-center gap-1.5"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <button
          onClick={() => setIsDismissed(true)}
          title="Dismiss ad banner"
          className="p-2 rounded-xl bg-slate-900/50 border border-transparent hover:border-slate-800 hover:text-rose-450 text-slate-500 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer warning suggesting premium status toggle */}
      <div className="absolute bottom-1 left-4 text-[7.5px] font-mono text-slate-600">
        👑 Premium members experience <strong>absolute zero ads</strong> layout-wide. Click <button onClick={() => setIsUpgradeModalOpen(true)} className="text-indigo-400 underline hover:text-indigo-350 bg-transparent py-0 px-0.5 border-none font-bold">here</button> to unlock.
      </div>
    </div>
  );
}
