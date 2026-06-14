import React, { useState } from "react";
import { Search, Compass, BookOpen, Layers, Download, Copy, ExternalLink, HelpCircle } from "lucide-react";
import { ResearchReport, GroundingSource } from "../types";

export default function ResearchView() {
  const [topic, setTopic] = useState("");
  const [focusArea, setFocusArea] = useState("Technical & Statistical Review");
  const [depth, setDepth] = useState("High Depth");
  const [isCompiling, setIsCompiling] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // Suggested research tracks
  const researchSuggestions = [
    { topic: "The long-term impact of neural-symbolic AI on medical diagnostics", focus: "Accuracy metrics and production bottlenecks" },
    { topic: "Market penetration of localized vector databases in edge computing", focus: "Comparative bench testing & cost structures" },
    { topic: "Decentralized autonomous logistics networks utilizing zero-knowledge proof frameworks", focus: "Scalability, consensus, and security review" }
  ];

  const handleSuggestionClick = (sug: typeof researchSuggestions[0]) => {
    setTopic(sug.topic);
    setFocusArea(sug.focus);
  };

  const handleCopyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsCompiling(true);
    setErrorMsg("");
    setReport(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          focusArea,
          depth
        })
      });

      const data = await response.json();
      if (data.success) {
        // Parse Grounding Sources if returned
        let parsedSources: GroundingSource[] = [];
        if (data.groundingMetadata?.groundingChunks) {
          parsedSources = data.groundingMetadata.groundingChunks
            .map((chunk: any) => {
              if (chunk.web) {
                return {
                  title: chunk.web.title || "Retrieved Source Document",
                  uri: chunk.web.uri || "#"
                };
              }
              return null;
            })
            .filter(Boolean);
        }

        setReport({
          id: `rep-${Date.now()}`,
          topic,
          focusArea,
          depth,
          markdown: data.text,
          sources: parsedSources,
          timestamp: new Date()
        });
      } else {
        throw new Error(data.error || "Compilation error");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to reach Deep Research server node.");
    } finally {
      setIsCompiling(false);
    }
  };

  // Human-polished Custom Markdown Parser Helper
  const parseMarkdownHtml = (text: string) => {
    if (!text) return null;
    
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Heading level 1
      if (line.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl md:text-2xl font-bold text-white mt-6 mb-3 border-b border-slate-800 pb-2">
            {line.substring(2)}
          </h1>
        );
      }
      // Heading level 2
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-lg font-bold text-indigo-400 mt-5 mb-2">
            {line.substring(3)}
          </h2>
        );
      }
      // Heading level 3
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-sm font-semibold text-purple-400 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      // Bullet items
      if (line.startsWith("* ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="ml-6 list-disc text-xs md:text-sm text-slate-300 mb-1.5 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }
      // Source citations parser (e.g. custom markup inline brackets or numbered)
      const isBoldLine = line.startsWith("**") && line.endsWith("**");
      if (isBoldLine) {
        return (
          <p key={idx} className="font-semibold text-white my-2 text-sm">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }

      // Empty Lines
      if (!line.trim()) {
        return <div key={idx} className="h-2"></div>;
      }

      // Normal paragraph text with links parse
      return (
        <p key={idx} className="text-xs md:text-sm text-slate-300 mb-2 leading-relaxed">
          {line.split(/(\[.*?\]\(.*?\))/g).map((part, pIdx) => {
            const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
            if (linkMatch) {
              return (
                <a
                  key={pIdx}
                  href={linkMatch[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                >
                  {linkMatch[1]}
                  <ExternalLink className="w-2.5 h-2.5 inline-block" />
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div id="research-workspace" className="flex-1 flex flex-col h-full bg-[#11141c] overflow-y-auto">
      {/* Top Controller Bar */}
      <div id="research-header-bar" className="bg-[#151924]/90 backdrop-blur border-b border-slate-800 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Deep Research & Grounding Engine</h2>
          <p className="text-xs text-slate-400">Generates hyper-detailed scholarly data reports using Google Search Integration</p>
        </div>
      </div>

      <div id="research-content-grid" className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Setup Panel */}
        <div id="setup-panel" className="lg:col-span-5 bg-[#141822] border border-slate-800/80 rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800/60">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Parameters Configuration</h3>
          </div>

          <form id="research-form" onSubmit={handleLaunchResearch} className="space-y-4">
            <div>
              <label htmlFor="input-research-topic" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                1. Scientific or Commercial Topic
              </label>
              <textarea
                id="input-research-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Declare topic (e.g. quantum computing commercialization timeline...)"
                rows={3}
                required
                className="w-full bg-[#1c2230] text-slate-100 text-xs md:text-sm border border-slate-850 hover:border-slate-700/80 focus:border-indigo-500 rounded-xl px-4 py-3 focus:outline-none transition-colors placeholder-slate-500"
              />
            </div>

            <div>
              <label htmlFor="input-focus-area" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                2. Target Depth Focus Matrix
              </label>
              <input
                id="input-focus-area"
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder="e.g. Statistical tables, timeline analysis, business metrics"
                className="w-full bg-[#1c2230] text-slate-100 text-xs md:text-sm border border-slate-850 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
              />
            </div>

            <div>
              <label htmlFor="select-research-depth" className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                3. Grounding Iteration Depth
              </label>
              <select
                id="select-research-depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full bg-[#1c2230] text-slate-100 text-xs md:text-sm border border-slate-850 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Standard Depth">Standard Depth (1x Search cycle)</option>
                <option value="High Depth">High Depth (Iterative queries & citations)</option>
                <option value="Absolute Academic">Scholarly Integration (Comprehensive multi-source)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isCompiling || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs md:text-sm font-semibold transition-all shadow-md shadow-indigo-600/10 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{isCompiling ? "Compiling Web Matrix..." : "Launch Deep Research"}</span>
            </button>
          </form>

          {/* Quick presets / Suggestion tray */}
          <div className="space-y-3 pt-4 border-t border-slate-800/60">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Suggested Research Tracks
            </h4>
            <div className="space-y-2">
              {researchSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/40 hover:border-slate-800 transition-all group"
                >
                  <p className="text-xs font-medium text-slate-300 group-hover:text-white truncate">{sug.topic}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{sug.focus}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Output Dashboard */}
        <div id="output-dashboard" className="lg:col-span-7 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-2xl text-xs text-rose-300">
              <span className="font-semibold uppercase tracking-wide mr-2">Compilation Failure:</span>
              {errorMsg}
            </div>
          )}

          {isCompiling && (
            <div className="bg-[#141822] border border-slate-800/80 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
              <p className="text-sm font-medium text-slate-300">Interrogating live search aggregates...</p>
              <p className="text-xs text-slate-500 max-w-sm">Generating comprehensive multiline report layout, cross-referencing digital papers, and cataloging inline source citations.</p>
            </div>
          )}

          {!isCompiling && !report && !errorMsg && (
            <div className="bg-[#141822] border border-slate-800/80 rounded-2xl p-10 flex flex-col items-center justify-center text-center text-slate-500 space-y-3 min-h-[400px]">
              <Compass className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Awaiting Command Instruction</p>
              <p className="text-xs max-w-sm">Define a research thesis on the left panel to request real-time search synthesis output formatted with clean sections and links.</p>
            </div>
          )}

          {report && (
            <div id="rendered-report-card" className="bg-[#141822] border border-slate-880 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
              {/* Header card actions */}
              <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded-full font-mono font-bold tracking-wide">
                    {report.depth} Level Saved
                  </span>
                  <h3 className="text-xs font-semibold text-slate-300 truncate mt-1">Topic: {report.topic}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#252c3d] text-xs text-slate-300 border border-slate-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Copy Report"}</span>
                  </button>
                </div>
              </div>

              {/* Verified Sources Block */}
              {report.sources.length > 0 && (
                <div className="p-6 bg-[#0e111a] border-b border-slate-800/70">
                  <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Harvested Web Footprints ({report.sources.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.sources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-[#131620] hover:bg-[#1a1f2d] rounded-xl border border-slate-850/60 flex items-start justify-between gap-2.5 transition-all group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                            {source.title}
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono truncate mt-0.5">
                            {source.uri}
                          </p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 flex-shrink-0 mt-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rich Document Content */}
              <div className="p-6 md:p-8 select-text">
                {parseMarkdownHtml(report.markdown)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
