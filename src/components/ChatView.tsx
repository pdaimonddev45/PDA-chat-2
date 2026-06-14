import React, { useState, useRef, useEffect } from "react";
import { Message, FileAttachment } from "../types";
import { useSubscription } from "../context/SubscriptionContext";
import {
  Send,
  Paperclip,
  Trash2,
  Pencil,
  Plus,
  Pin,
  Search,
  Brain,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  Info,
  X,
  MessageSquare,
  Bookmark,
  Layers,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AdComponent from "./AdComponent";

// Defined Chat Session representation
interface ChatSession {
  id: string;
  name: string;
  isPinned: boolean;
  messages: Message[];
  activeRole: string;
  systemInstruction: string;
  timestamp: string;
}

// Defined Long-Term Memory representation
interface LongTermMemory {
  id: string;
  fact: string;
  active: boolean;
  addedOn: string;
}

export default function ChatView() {
  const { plan } = useSubscription();

  // Chat sessions state mapped from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("pda_chat_sessions");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "sess-1",
        name: "Welcome Onboarding Core",
        isPinned: true,
        activeRole: "General",
        systemInstruction: "You are PDA Chat AI, a brilliant and unlimited AI companion designed to help the user with any complex task.",
        timestamp: "14-Jun-2026",
        messages: [
          {
            id: "initial-1",
            role: "assistant",
            content: "Hello! I am **PDA Chat AI** connected directly to your server-side Gemini system.\n\nYou can ask me any logical question, select custom agent personalities, upload multimodal files, or manage your conversational memory context on the right.",
            timestamp: new Date()
          }
        ]
      },
      {
        id: "sess-2",
        name: "Quantum Mechanics Proofing",
        isPinned: false,
        activeRole: "General",
        systemInstruction: "You are PDA Chat AI, a brilliant and unlimited AI companion designed to help the user with any complex task.",
        timestamp: "14-Jun-2026",
        messages: [
          {
            id: "qm-1",
            role: "user",
            content: "Summarize the primary difference between Copenhagen interpretation and many-worlds interpretation.",
            timestamp: new Date()
          },
          {
            id: "qm-2",
            role: "assistant",
            content: "The **Copenhagen interpretation** asserts that physical systems only have definite properties upon measurement, positing wave function collapse. In contrast, the **Many-Worlds interpretation (MWI)** states that wave function collapse is mathematically impossible. It claims all alternative histories and futures are real, with each quantum transition branching the universe into a multiverse.",
            timestamp: new Date()
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>("sess-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Rename session state helper
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Prompt input and file uploads
  const [inputValue, setInputValue] = useState("");
  const [modelName, setModelName] = useState("gemini-3.5-flash");
  const [isSending, setIsSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<FileAttachment | null>(null);
  const [fileError, setFileError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Long-Term Memory structures
  const [memories, setMemories] = useState<LongTermMemory[]>(() => {
    const saved = localStorage.getItem("pda_long_term_memories");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "mem-1", fact: "User prefers clean TypeScript over legacy JavaScript files.", active: true, addedOn: "14-Jun-2026" },
      { id: "mem-2", fact: "Miracle's primary research centers on serverless Node clusters.", active: true, addedOn: "14-Jun-2026" },
      { id: "mem-3", fact: "Loves elegant dark-mode cosmic slate interface designs.", active: false, addedOn: "14-Jun-2026" }
    ];
  });
  const [newMemoryInput, setNewMemoryInput] = useState("");

  // Roles preset loader matching the previous config
  const roles = [
    { name: "General", desc: "Balanced intelligence", sys: "You are PDA Chat AI, a brilliant and unlimited AI companion designed to help the user with any complex task." },
    { name: "Code Specialist", desc: "Refactored engineering", sys: "You are the PDA Senior Software Architect. Write high-quality, optimal, beautifully documented code structure." },
    { name: "Creative Writer", desc: "Sensory draft forge", sys: "You are an elite creative writer. Write rich, evocative, highly sensory stories." },
    { name: "Cynical Critic", desc: "Rigorous analytical critique", sys: "You are a cynical academic reviewer. Critique logical fallacies immediately and propose absolute truths." }
  ];

  // Sync state modifications to browser disk storage
  useEffect(() => {
    localStorage.setItem("pda_chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("pda_long_term_memories", JSON.stringify(memories));
  }, [memories]);

  // Find current session object
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, isSending]);

  // Handle Session selection
  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setRenamingId(null);
  };

  // Create new conversation
  const handleCreateNewSession = () => {
    const nextId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: nextId,
      name: `Core Dialogue Node ${sessions.length + 1}`,
      isPinned: false,
      activeRole: "General",
      systemInstruction: roles[0].sys,
      timestamp: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" }),
      messages: [
        {
          id: `init-${Date.now()}`,
          role: "assistant",
          content: "System buffer initialized. Brand new conversation thread spawned. How may I support your research?",
          timestamp: new Date()
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(nextId);
  };

  // Toggle Session Pin
  const toggleSessionPin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, isPinned: !s.isPinned };
      }
      return s;
    }));
  };

  // Trigger Renaming input
  const startRenameSession = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const submitRenameSession = (id: string) => {
    if (!renameValue.trim()) return;
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, name: renameValue.trim() };
      }
      return s;
    }));
    setRenamingId(null);
  };

  // Delete dynamic Session thread
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Keep at least one default
      alert("At least one dialogue thread must remain initialized.");
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Personality role switcher within session context
  const handleRoleSelection = (role: typeof roles[0]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          activeRole: role.name,
          systemInstruction: role.sys
        };
      }
      return s;
    }));
  };

  // Conversational Memory controls
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryInput.trim()) return;
    const newMem: LongTermMemory = {
      id: `mem-${Date.now()}`,
      fact: newMemoryInput.trim(),
      active: true,
      addedOn: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
    };
    setMemories(prev => [newMem, ...prev]);
    setNewMemoryInput("");
  };

  const toggleMemoryActive = (id: string) => {
    setMemories(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, active: !m.active };
      }
      return m;
    }));
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Base64 file conversions helper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File too large. Maximum size is 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const strippedBase64 = base64String.split(",")[1];
      setAttachedFile({
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        base64: strippedBase64
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Chat message submit
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && !attachedFile) return;

    const userText = inputValue;
    const userAttach = attachedFile;

    const newUserMsg: Message = {
      id: `m-${Date.now()}-user`,
      role: "user",
      content: userText || `Uploaded attachment: ${userAttach?.name}`,
      attachment: userAttach || undefined,
      timestamp: new Date()
    };

    // Optimistically update list in active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, newUserMsg]
        };
      }
      return s;
    }));

    setInputValue("");
    setAttachedFile(null);
    setIsSending(true);

    try {
      // Gather current session history messages
      const activeThread = sessions.find(s => s.id === activeSessionId) || sessions[0];
      const chatHistory = [...activeThread.messages, newUserMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Gather active Memory context points
      const activeMemFacts = memories
        .filter(m => m.active)
        .map(m => `- ${m.fact}`)
        .join("\n");

      const enrichedSystemInstruction = activeMemFacts
        ? `${activeThread.systemInstruction}\n\n[USER CONTEXT LONG-TERM MEMORY]:\n${activeMemFacts}`
        : activeThread.systemInstruction;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          messages: chatHistory,
          systemInstruction: enrichedSystemInstruction,
          modelName: modelName,
          attachment: userAttach
        })
      });

      const data = await res.json();
      if (data.success) {
        const assistantMsg: Message = {
          id: `m-${Date.now()}-assistant`,
          role: "assistant",
          content: data.text,
          timestamp: new Date()
        };

        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            // Check if MWI, codes, or preferences are talked about and auto-commit to memory
            const contentLower = data.text.toLowerCase();
            let addedMemoryFeedback = false;
            
            return {
              ...s,
              messages: [...s.messages, assistantMsg]
            };
          }
          return s;
        }));

        // Dynamically parse if a new fact should be remembered
        const textLower = data.text.toLowerCase();
        if (textLower.includes("remember") || textLower.includes("fav") || textLower.includes("prefer")) {
          const matchedWords = data.text.match(/(?:remember|preference|prefers) (?:that|to|for)?\s*([^.]+)/i);
          if (matchedWords && matchedWords[1]) {
            const factExtracted = matchedWords[1].trim();
            if (factExtracted.length > 8 && factExtracted.length < 150) {
              setMemories(prev => [
                {
                  id: `mem-${Date.now()}`,
                  fact: `Inferred preference: ${factExtracted}`,
                  active: true,
                  addedOn: new Date().toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
                },
                ...prev
              ]);
            }
          }
        }

      } else {
        throw new Error(data.error || "Server model synthesis error.");
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: `m-${Date.now()}-assistant`,
        role: "assistant",
        content: `⚠️ **Service Error**: ${err.message || "Failed to reach your API route. Ensure your environment has a valid GEMINI_API_KEY established in secrets."}`,
        timestamp: new Date()
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, errorMsg]
          };
        }
        return s;
      }));
    } finally {
      setIsSending(false);
    }
  };

  // Rendering formatted block sections
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const rawCode = part.replace(/^```[a-zA-Z0-9]*\n/, "").replace(/```$/, "");
        return (
          <div key={index} className="my-3 bg-black/50 border border-slate-800 rounded-lg overflow-hidden font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-slate-450">
              <span className="text-[9px] tracking-wider uppercase">PDA High-Precision Sandbox</span>
              <button
                onClick={() => navigator.clipboard.writeText(rawCode)}
                className="flex items-center gap-1 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto whitespace-pre-wrap">{rawCode}</pre>
          </div>
        );
      } else {
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} className="leading-relaxed mb-2 whitespace-pre-line text-slate-200">
            {boldParts.map((bp, bpIdx) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return (
                  <strong key={bpIdx} className="text-white font-semibold">
                    {bp.substring(2, bp.length - 2)}
                  </strong>
                );
              }
              return bp;
            })}
          </p>
        );
      }
    });
  };

  // Search filtered session threads array
  const searchedSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Split sessions: pinned stay at top
  const pinnedSessions = searchedSessions.filter(s => s.isPinned);
  const unpinnedSessions = searchedSessions.filter(s => !s.isPinned);
  const displaySessions = [...pinnedSessions, ...unpinnedSessions];

  return (
    <div id="chat-multi-workspace" className="flex-1 flex h-full bg-[#11141c] overflow-hidden">
      
      {/* 1. LEFT SIDEBAR: Conversational Threads */}
      {isLeftSidebarOpen ? (
        <aside
          id="chat-sessions-sidebar"
          className="w-72 bg-[#0c0e14] border-r border-slate-900 flex flex-col flex-shrink-0 relative animate-fadeIn"
        >
          {/* Brand/Search Container */}
          <div className="p-4 border-b border-slate-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">DIALOGUE PANELS</span>
              <button
                onClick={handleCreateNewSession}
                className="p-1 px-2.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3 h-3" /> NEW
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121622] text-slate-205 text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-850 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sessions List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {displaySessions.length === 0 ? (
              <p className="text-[10px] text-slate-550 text-center font-mono py-8">Zero threads matching query.</p>
            ) : (
              displaySessions.map((sect) => {
                const isActive = sect.id === activeSessionId;
                const isRenaming = renamingId === sect.id;

                return (
                  <div
                    key={sect.id}
                    onClick={() => handleSelectSession(sect.id)}
                    className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-1 ${
                      isActive
                        ? "bg-[#151924] border-slate-805 text-slate-100"
                        : "bg-transparent border-transparent text-slate-400 hover:bg-slate-900/30 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      {isRenaming ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.key === "Enter" && submitRenameSession(sect.id)}
                          autoFocus
                          className="flex-1 bg-black text-slate-100 text-xs px-1.5 py-0.5 rounded border border-indigo-550"
                        />
                      ) : (
                        <span className="font-medium text-xs truncate max-w-[150px]">
                          {sect.name}
                        </span>
                      )}

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isRenaming ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); submitRenameSession(sect.id); }}
                            className="p-0.5 hover:text-emerald-400 text-slate-500"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={(e) => startRenameSession(sect.id, sect.name, e)}
                              title="Rename session thread"
                              className="p-0.5 hover:text-indigo-400 text-slate-500"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => toggleSessionPin(sect.id, e)}
                              title={sect.isPinned ? "Unpin session" : "Pin session thread"}
                              className={`p-0.5 hover:text-yellow-405 ${sect.isPinned ? "text-yellow-450" : "text-slate-550"}`}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteSession(sect.id, e)}
                              title="Delete discussion thread"
                              className="p-0.5 hover:text-rose-450 text-slate-550"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9.5px] text-slate-550 font-mono">
                      <span>{sect.messages.length} messages</span>
                      <span className="flex items-center gap-1">
                        {sect.isPinned && <Pin className="w-2.5 h-2.5 text-yellow-500 scale-75" />}
                        {sect.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => setIsLeftSidebarOpen(false)}
            title="Collapse Sidebar"
            className="absolute bottom-4 -right-3 w-6 h-6 bg-[#1a1f2e] border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shadow z-10"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </aside>
      ) : (
        <button
          onClick={() => setIsLeftSidebarOpen(true)}
          title="Expand Threads Sidebar"
          className="p-2 border-r border-slate-900 bg-[#0c0e14] hover:bg-slate-900/60 text-slate-500 hover:text-slate-205 flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* 2. CENTER PANEL: Main Messages Screen */}
      <div id="chat-central-panel" className="flex-1 flex flex-col h-full bg-[#11141c] overflow-hidden">
        
        {/* Top bar header */}
        <div className="bg-[#151924]/90 border-b border-slate-900/80 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 pr-2">
            <h2 className="text-xs font-bold text-white tracking-wide uppercase truncate select-text">
              {currentSession?.name || "AI CORE DIALOGUE LINK"}
            </h2>
            <p className="text-[10px] text-slate-400 truncate">
              Modeling {currentSession?.activeRole || "General"} system. Secure server transport verified.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="bg-[#1d2433] border border-slate-800 rounded-lg px-2.5 py-1.5 text-[10.5px] font-mono text-slate-200 cursor-pointer"
            >
              <option value="gemini-3.5-flash">PDA Lite (gemini-3.5-flash)</option>
              <option value="gemini-3.1-pro-preview">PDA Deep (gemini-3.1-pro)</option>
            </select>
          </div>
        </div>

        {/* Dynamic personality selector tray */}
        <div className="px-4 py-2 bg-[#0c0e13]/80 border-b border-slate-900/60 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap">Agent Preset:</span>
          {roles.map((r) => {
            const isSelected = r.name === currentSession?.activeRole;
            return (
              <button
                key={r.name}
                onClick={() => handleRoleSelection(r)}
                className={`px-2.5 py-1 rounded-full text-[10.5px] transition-all font-mono ${
                  isSelected
                    ? "bg-indigo-650 text-white font-semibold outline-none"
                    : "bg-slate-900/40 text-slate-450 hover:bg-slate-800"
                }`}
              >
                {r.name}
              </button>
            );
          })}
        </div>

        {/* Message logs container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentSession?.messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 border shadow-amber-400/5 transition-all duration-200 ${
                    isUser
                      ? "bg-[#1f2538] border-slate-750 text-slate-100 rounded-tr-none"
                      : "bg-[#131622] border-slate-850/80 text-slate-201 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-6 mb-2">
                    <span className={`text-[9px] uppercase font-mono font-bold tracking-widest ${isUser ? "text-indigo-400" : "text-purple-400"}`}>
                      {isUser ? "USER SECURE CORE" : "PDA COMPANION ENGINE"}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.attachment && (
                    <div className="mb-2 p-2 rounded-lg bg-black/45 border border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        <Paperclip className="w-3 h-3 text-indigo-400 animate-pulse" />
                        <span className="truncate max-w-[120px]">{message.attachment.name}</span>
                        <span className="text-[9px] text-[#00ffaa]">({message.attachment.size})</span>
                      </div>
                      {message.attachment.mimeType.startsWith("image/") && message.attachment.base64 && (
                        <img
                          src={`data:${message.attachment.mimeType};base64,${message.attachment.base64}`}
                          alt="att thumb"
                          className="w-10 h-10 object-cover rounded border border-slate-800"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}

                  <div className="text-xs leading-relaxed select-text space-y-1">
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex justify-start">
              <div id="thinking-indicator" className="p-3 bg-[#131622] border border-slate-850 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="flex space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-225"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Refactoring matrix...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* AdSense Placement Footer Banner (displayed for free plan users) */}
        {plan === "free" && (
          <div className="px-6 py-1 select-none">
            <AdComponent placement="footer_banner" />
          </div>
        )}

        {/* Attachment state logs and submit box */}
        <div className="px-6 space-y-1.5">
          {fileError && <p className="text-[10.5px] text-rose-450 font-mono">⚠️ {fileError}</p>}
          {attachedFile && (
            <div className="inline-flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-850 px-2.5 py-1 rounded-xl text-[10.5px] text-indigo-300 font-mono">
              <Paperclip className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{attachedFile.name}</span>
              <button onClick={removeAttachment} className="hover:text-white transition-colors cursor-pointer">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Form panel input field */}
        <form onSubmit={handleSend} className="p-4 bg-[#0a0c12]/80 border-t border-slate-900 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload multimodal context file (PDF/Img up to 10MB)"
            className="p-3 bg-[#111420] border border-slate-850 hover:border-indigo-505 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,text/*,application/pdf"
            className="hidden"
          />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSending}
            placeholder={attachedFile ? "Label details for this uploaded attachment file..." : "Prompt PDA AI (e.g., explain Copenhagen interpretations recursively)..."}
            className="flex-1 bg-[#131620] text-slate-100 text-xs border border-slate-850 hover:border-slate-800 focus:border-indigo-500/80 focus:outline-none rounded-xl px-4 py-3 placeholder-slate-500 transition-colors"
          />

          <button
            type="submit"
            disabled={(!inputValue.trim() && !attachedFile) || isSending}
            className="p-3.5 bg-indigo-650 hover:bg-indigo-550 disabled:opacity-45 text-white rounded-xl cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. RIGHT SIDEBAR: Long-Term Memory context */}
      {isRightSidebarOpen ? (
        <aside
          id="chat-memory-sidebar"
          className="w-72 bg-[#0c0e14] border-l border-slate-900 flex flex-col flex-shrink-0 relative animate-fadeIn"
        >
          <div className="p-4 border-b border-slate-900/80 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-white tracking-widest flex items-center gap-1.5 uppercase">
              <Brain className="w-4.5 h-4.5 text-purple-400" /> Neural Memory Hub
            </h3>
            <p className="text-[10px] text-slate-500 leading-normal">
              Long-term cognitive assertions preserved server-side to guide ongoing AI dialogue patterns.
            </p>
          </div>

          {/* Add fact block form */}
          <div className="p-3 border-b border-slate-905/60">
            <form onSubmit={handleAddMemory} className="flex gap-2.5">
              <input
                type="text"
                placeholder="Prescribe a system memory..."
                value={newMemoryInput}
                onChange={(e) => setNewMemoryInput(e.target.value)}
                className="flex-1 bg-[#121622] text-slate-200 text-[10.5px] rounded-lg px-2 py-1.5 border border-slate-850 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-purple-650 hover:bg-purple-550 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-colors"
              >
                ADD
              </button>
            </form>
          </div>

          {/* Fact list items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {memories.length === 0 ? (
              <p className="text-[10px] text-slate-550 text-center font-mono py-8">Zero memories recorded.</p>
            ) : (
              memories.map((mem) => (
                <div
                  key={mem.id}
                  className={`p-3 rounded-xl border transition-all ${
                    mem.active
                      ? "bg-[#151322] border-purple-900/30"
                      : "bg-[#0f1118]/80 border-slate-900/80 opacity-60"
                  }`}
                >
                  <p className="text-[10.5px] text-slate-250 font-mono leading-relaxed select-text">
                    "{mem.fact}"
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[8px] font-mono text-slate-550 uppercase">
                    <span>Added: {mem.addedOn}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMemoryActive(mem.id)}
                        className={`hover:underline font-bold ${mem.active ? "text-purple-400" : "text-slate-400"}`}
                      >
                        {mem.active ? "ENABLED" : "PAUSED"}
                      </button>
                      <button
                        onClick={() => deleteMemory(mem.id)}
                        className="text-slate-600 hover:text-rose-400"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setIsRightSidebarOpen(false)}
            title="Collapse Memory Hub"
            className="absolute bottom-4 -left-3 w-6 h-6 bg-[#1a1f2e] border border-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shadow z-10"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      ) : (
        <button
          onClick={() => setIsRightSidebarOpen(true)}
          title="Expand Memory Hub"
          className="p-2 border-l border-slate-900 bg-[#0c0e14] hover:bg-slate-900/60 text-slate-500 hover:text-slate-205 flex items-center justify-center cursor-pointer transition-colors animate-fadeIn"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}
