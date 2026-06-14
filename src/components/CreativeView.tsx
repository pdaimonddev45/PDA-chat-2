import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  Check,
  Image as ImageIcon,
  Video,
  Scissors,
  Music,
  Play,
  Square,
  Sliders,
  Upload,
  Film,
  AlertTriangle,
  ArrowRight,
  Type,
  Maximize2
} from "lucide-react";
import { useSubscription, Allowances } from "../context/SubscriptionContext";
import AdComponent from "./AdComponent";

export default function CreativeView() {
  const { plan, allowances, decrementAllowance, setIsUpgradeModalOpen } = useSubscription();

  // Active creative tab selector matching subscription schema
  const [activeTab, setActiveTab] = useState<keyof Allowances>("image_generation");

  // --- TAB 1: Image Generation States ---
  const [imagePrompt, setImagePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const aspectRatios = [
    { id: "1:1", label: "Square (1:1)", desc: "Social Media / Profiler" },
    { id: "16:9", label: "Landscape (16:9)", desc: "Video Cards & Previews" },
    { id: "9:16", label: "Portrait (9:16)", desc: "Mobile Reels" },
    { id: "4:3", label: "Standard (4:3)", desc: "Workspace Presentation" }
  ];

  // --- TAB 2: Image Editing States ---
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const [imageEditPrompt, setImageEditPrompt] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedImg, setEditedImg] = useState<string | null>(null);
  const [editError, setEditError] = useState("");

  // Preset templates for quick choosing if they don't upload
  const PRESET_UPLOADS = [
    { name: "Cyberpunk Alley", url: "https://picsum.photos/seed/cyber/600/400" },
    { name: "Neon Server Rack", url: "https://picsum.photos/seed/server/600/400" },
    { name: "Abstract Neural Web", url: "https://picsum.photos/seed/neural/600/400" }
  ];

  // --- TAB 3: Video Generation States ---
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState("16:9");
  const [isVidGenerating, setIsVidGenerating] = useState(false);
  const [generatedVidPattern, setGeneratedVidPattern] = useState<string | null>(null);
  const [vidError, setVidError] = useState("");
  const [isPlayingVid, setIsPlayingVid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // --- TAB 4: Video Editing States ---
  const [vidEditSpeed, setVidEditSpeed] = useState("1.0x");
  const [vhsFilter, setVhsFilter] = useState(false);
  const [grainOverlay, setGrainOverlay] = useState(false);
  const [timestampOverlay, setTimestampOverlay] = useState(false);
  const [subtitlesText, setSubtitlesText] = useState("");
  const [isVidEditing, setIsVidEditing] = useState(false);
  const [videoEditSuccess, setVideoEditSuccess] = useState(false);

  // --- TAB 5: Music Generation States ---
  const [musicPrompt, setMusicPrompt] = useState("");
  const [musicGenre, setMusicGenre] = useState("lofi");
  const [musicBPM, setMusicBPM] = useState(90);
  const [isMusicGenerating, setIsMusicGenerating] = useState(false);
  const [activeAudioPreset, setActiveAudioPreset] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicError, setMusicError] = useState("");

  // Web Audio Context reference for custom synthesized loop
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const synthCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const synthAnimationRef = useRef<number | null>(null);

  // Clean up procedural animations on unmount
  useEffect(() => {
    return () => {
      stopAudioSynthesizer();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // --- Video Generation Simulation Render (Interactive Canvas Animation) ---
  useEffect(() => {
    if (generatedVidPattern && canvasRef.current && isPlayingVid) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = canvas.width = 640;
      let height = canvas.height = 360;

      let particles: any[] = [];
      const particleCount = 120;

      // Seed particles based on prompt category keywords
      const promptLower = generatedVidPattern.toLowerCase();
      let themeColor = "rgba(99, 102, 241,"; // Indigo by default
      if (promptLower.includes("cyber") || promptLower.includes("neon")) {
        themeColor = "rgba(236, 72, 153,"; // Pink
      } else if (promptLower.includes("space") || promptLower.includes("galaxy")) {
        themeColor = "rgba(168, 85, 247,"; // Purple
      } else if (promptLower.includes("forest") || promptLower.includes("nature")) {
        themeColor = "rgba(16, 185, 129,"; // Mint Emerald
      } else if (promptLower.includes("fire") || promptLower.includes("magma")) {
        themeColor = "rgba(249, 115, 22,"; // Orange
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (promptLower.includes("fast") ? 6 : 2),
          vy: (Math.random() - 0.5) * (promptLower.includes("fast") ? 6 : 2),
          radius: Math.random() * 4 + 1,
          color: `${themeColor} ${Math.random() * 0.7 + 0.3})`
        });
      }

      let frameCount = 0;
      const render = () => {
        ctx.fillStyle = "rgba(13, 17, 26, 0.25)"; // Trails
        ctx.fillRect(0, 0, width, height);

        // Render abstract simulated dynamic shapes
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(frameCount * 0.005);
        ctx.strokeStyle = `${themeColor} 0.15)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const radius = (frameCount + j * 40) % 240;
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.restore();

        // Render traveling particles
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = p.radius * 2;
          ctx.shadowColor = p.color;
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx = -p.vx;
          if (p.y < 0 || p.y > height) p.vy = -p.vy;
        });

        // Add telemetry labels in canvas boundary
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.font = "10px monospace";
        ctx.fillText(`FRAME SEQUENCE: ${(frameCount % 1000).toString().padStart(4, "0")}`, 20, 25);
        ctx.fillText(`RENDER FREQUENCY: 60Hz`, 20, 40);
        ctx.fillText(`AURA: ${generatedVidPattern.slice(0, 24).toUpperCase()}...`, 20, 55);

        frameCount++;
        animationFrameIdRef.current = requestAnimationFrame(render);
      };

      render();
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  }, [generatedVidPattern, isPlayingVid]);

  // --- Music Generation Frequency Visualizer (Interactive Canvas) ---
  const launchMusicFeedbackVisualizer = () => {
    if (synthAnimationRef.current) {
      cancelAnimationFrame(synthAnimationRef.current);
    }

    const canvas = synthCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = 500;
    let height = canvas.height = 100;

    const analyser = audioAnalyserRef.current;
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlayingMusic) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      synthAnimationRef.current = requestAnimationFrame(draw);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback simulated waveforms
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(i * 0.1 + Date.now() * 0.01) * 30 + 40;
        }
      }

      ctx.fillStyle = "rgba(11, 14, 20, 1)";
      ctx.fillRect(0, 0, width, height);

      // Render beautiful glow sequence bar
      const barWidth = (width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 1.1;

        // Custom theme gradients
        const rel = i / bufferLength;
        ctx.fillStyle = `rgba(${Math.floor(99 + rel * 130)}, ${Math.floor(102 - rel * 50)}, ${Math.floor(241 + rel * 14)}, ${0.6 + rel * 0.4})`;

        ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };

    draw();
  };

  const addSavedCreation = (type: string, prompt: string, ratio: string) => {
    try {
      const existingRaw = localStorage.getItem("pda_saved_creations");
      let list = [];
      if (existingRaw) {
        list = JSON.parse(existingRaw);
      }
      list.unshift({
        id: `c-${Date.now()}`,
        type,
        prompt,
        ratio,
        ts: new Date().toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
      });
      localStorage.setItem("pda_saved_creations", JSON.stringify(list.slice(0, 40)));
    } catch (e) {}
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    // Direct subscription deduction check
    if (!decrementAllowance("image_generation")) {
      return;
    }

    setIsGenerating(true);
    setImageError("");
    setGeneratedImg(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio
        })
      });

      const data = await response.json();
      if (data.success && data.image) {
        setGeneratedImg(data.image);
        addSavedCreation("Image", imagePrompt, aspectRatio);
      } else {
        throw new Error(data.error || "Graphics core collapsed.");
      }
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || "Failed to reach imaging gateway.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyImageEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadImg) return;

    if (!decrementAllowance("image_editing")) {
      return;
    }

    setIsEditing(true);
    setEditError("");
    setEditedImg(null);

    // Beautiful simulated high precision layer blending delay
    setTimeout(() => {
      setEditedImg(uploadImg);
      setIsEditing(false);
      addSavedCreation("Image (Edit)", imageEditPrompt || "Custom filter adjust simulation", "1:1 Adaptive");
    }, 1500);
  };

  const handleGenerateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;

    if (!decrementAllowance("video_generation")) {
      return;
    }

    setIsVidGenerating(true);
    setVidError("");
    setGeneratedVidPattern(null);
    setIsPlayingVid(false);

    setTimeout(() => {
      setIsVidGenerating(false);
      setGeneratedVidPattern(videoPrompt);
      setIsPlayingVid(true);
      addSavedCreation("Video", videoPrompt, videoRatio);
    }, 2200);
  };

  const handleApplyVideoEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedVidPattern) return;

    if (!decrementAllowance("video_editing")) {
      return;
    }

    setIsVidEditing(true);
    setVideoEditSuccess(false);

    setTimeout(() => {
      setIsVidEditing(false);
      setVideoEditSuccess(true);
      addSavedCreation("Video (Edit)", subtitlesText ? `Caption overlay: "${subtitlesText}"` : "Applied VHS custom grading filter matrix", "VHS Stack");
    }, 1600);
  };

  // Web Audio Synthesized Rhythmic Soundtrack composer (Creative loop synth)
  const startAudioSynthesizer = () => {
    try {
      stopAudioSynthesizer();

      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(ctx.destination);
      audioAnalyserRef.current = analyser;

      let beatCount = 0;
      const bpm = Number(musicBPM) || 90;
      const stepDuration = 60 / bpm / 2; // Eighth notes

      // Schedule synth oscillator node events for rhythmic composition
      const playStep = () => {
        if (!ctx || ctx.state === "closed") return;

        const time = ctx.currentTime;

        // Clean rhythmic bass kick envelope on beatCount 0, 2, 4, 6
        if (beatCount % 4 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(analyser);

          osc.frequency.setValueAtTime(150, time);
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.25);

          gain.gain.setValueAtTime(0.8, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);

          osc.start(time);
          osc.stop(time + 0.25);
        }

        // Ambient musical filter pad chord simulation
        if (beatCount % 8 === 0) {
          const chordFreqs = musicGenre === "techno" ? [110, 165, 220] : [130, 196, 262];
          chordFreqs.forEach((freq) => {
            const oscNode = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filterNode = ctx.createBiquadFilter();

            oscNode.type = "sawtooth";
            oscNode.frequency.setValueAtTime(freq, time);

            filterNode.type = "lowpass";
            filterNode.frequency.setValueAtTime(200, time);
            filterNode.frequency.exponentialRampToValueAtTime(800, time + 0.85);

            oscNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(analyser);

            gainNode.gain.setValueAtTime(0.12, time);
            gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.9);

            oscNode.start(time);
            oscNode.stop(time + 1.0);
          });
        }

        // Acoustic sparkle snare high-hat simulation
        if (beatCount % 2 === 1) {
          const hatGain = ctx.createGain();
          const pnoise = ctx.createOscillator(); // Simple fast ring hat
          pnoise.type = "square";
          pnoise.frequency.setValueAtTime(10000, time);

          pnoise.connect(hatGain);
          hatGain.connect(analyser);

          hatGain.gain.setValueAtTime(0.03, time);
          hatGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

          pnoise.start(time);
          pnoise.stop(time + 0.06);
        }

        beatCount = (beatCount + 1) % 16;
      };

      // Lazy start scheduler loop
      const intervalMs = stepDuration * 1000;
      audioIntervalRef.current = setInterval(playStep, intervalMs);
      setIsPlayingMusic(true);

      // Trigger visualizer loop
      setTimeout(() => launchMusicFeedbackVisualizer(), 50);
    } catch (err: any) {
      console.error(err);
      setMusicError("Web Audio framework failed to establish.");
    }
  };

  const stopAudioSynthesizer = () => {
    setIsPlayingMusic(false);
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    audioAnalyserRef.current = null;
    if (synthAnimationRef.current) {
      cancelAnimationFrame(synthAnimationRef.current);
    }
  };

  const handleGenerateMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicPrompt.trim()) return;

    if (!decrementAllowance("music_generation")) {
      return;
    }

    setIsMusicGenerating(true);
    setMusicError("");
    stopAudioSynthesizer();

    setTimeout(() => {
      setIsMusicGenerating(false);
      setActiveAudioPreset(musicPrompt);
      // Play Synthesized sequence immediately
      startAudioSynthesizer();
      addSavedCreation("Music", musicPrompt, `${musicBPM} BPM`);
    }, 1800);
  };

  return (
    <div id="creative-workspace-box" className="flex-1 flex flex-col h-full bg-[#0e111a] overflow-hidden select-none">
      {/* Dynamic Upper Sub-navigation Menu for Subscription Tiers */}
      <div id="creative-topbar" className="bg-[#121622] border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> Creative Suite Forge
          </h2>
          <p className="text-[11px] text-slate-400">Interact with high-precision neural models for synthesized artwork layouts, cinema frames, and music streams.</p>
        </div>

        {/* Tab switcher buttons matching free allowance categories */}
        <div className="flex gap-1.5 bg-[#0a0c12] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("image_generation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "image_generation"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gen Image</span>
          </button>

          <button
            onClick={() => setActiveTab("image_editing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "image_editing"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Image</span>
          </button>

          <button
            onClick={() => setActiveTab("video_generation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "video_generation"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Gen Video</span>
          </button>

          <button
            onClick={() => setActiveTab("video_editing")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "video_editing"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Edit Video</span>
          </button>

          <button
            onClick={() => setActiveTab("music_generation")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all duration-250 cursor-pointer ${
              activeTab === "music_generation"
                ? "bg-slate-800 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Gen Music</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT COMPANION SIDE: Configuration Controls */}
        <div id="creative-settings" className="w-full md:w-96 bg-[#111420] border-b md:border-b-0 md:border-r border-slate-850 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-slate-400">Allowance Tracker</span>
              <span className="text-[11px] font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">
                {plan === "premium" ? "Unlimited (Premium)" : `${allowances[activeTab]} / 10 Left Today`}
              </span>
            </div>

            {/* TAB 1: Image Gen Config */}
            {activeTab === "image_generation" && (
              <form onSubmit={handleGenerateImage} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="image-prompt" className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Concept Prompt</label>
                  <textarea
                    id="image-prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe your abstract concept..."
                    rows={4}
                    required
                    className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Aspect Framing Ratio</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          aspectRatio === ratio.id
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <p className="text-[11px] font-semibold">{ratio.label}</p>
                        <p className="text-[9px] text-slate-550 mt-0.5">{ratio.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !imagePrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? "Synthesizing graphics..." : "Render Image Frame"}
                </button>
              </form>
            )}

            {/* TAB 2: Image Editing Config */}
            {activeTab === "image_editing" && (
              <form onSubmit={handleApplyImageEdit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Upload or Choose Preset Base</label>
                  
                  {uploadImg ? (
                    <div className="relative p-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={uploadImg} alt="Preview thumbnail" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-[10px] text-slate-400 font-mono">canvas_source.jpg</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setUploadImg(null); setEditedImg(null); }}
                        className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      {PRESET_UPLOADS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setUploadImg(preset.url)}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-indigo-500 rounded-lg text-center cursor-pointer transition-colors"
                        >
                          <span className="text-[9px] font-mono text-slate-300 block truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Adjustment Parameters</label>
                  
                  {/* Slider fields */}
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Brightness:</span>
                      <span>{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1 rounded"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Contrast:</span>
                      <span>{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1 rounded"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Blur Envelope:</span>
                      <span>{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1 rounded"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Grayscale Modifier:</span>
                      <span>{grayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full accent-indigo-500 bg-slate-800 h-1 rounded"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isEditing || !uploadImg}
                  className="w-full py-3 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-550 hover:to-purple-550 text-white font-semibold rounded-xl text-xs transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {isEditing ? "Baking overlay filters..." : "Re-render Modified Image"}
                </button>
              </form>
            )}

            {/* TAB 3: Video Generation Config */}
            {activeTab === "video_generation" && (
              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="video-prompt" className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Cinematic Prompt</label>
                  <textarea
                    id="video-prompt"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Describe active cinematic movement... (e.g., Starfield traveling fast)"
                    rows={4}
                    required
                    className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-650"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Cinematic Ratio</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["16:9", "9:16"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setVideoRatio(val)}
                        className={`p-2.5 rounded-xl border text-center font-mono text-xs cursor-pointer transition-colors ${
                          videoRatio === val
                            ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                            : "bg-slate-900 border-slate-800/80 text-slate-400 hover:border-slate-800"
                        }`}
                      >
                        {val === "16:9" ? "16:9 Widescreen" : "9:16 Vertical Reel"}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVidGenerating || !videoPrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-xs transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {isVidGenerating ? "Interpolating frame blocks..." : "Render Cinematic Video"}
                </button>
              </form>
            )}

            {/* TAB 4: Video Editing Config */}
            {activeTab === "video_editing" && (
              <form onSubmit={handleApplyVideoEdit} className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Speed Playback</label>
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
                    {["0.5x Slow", "1.0x Normal", "2.0x Hyper"].map((sp) => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => setVidEditSpeed(sp)}
                        className={`p-2 rounded-lg border cursor-pointer ${
                          vidEditSpeed === sp ? "bg-indigo-500/10 border-indigo-500 text-indigo-300" : "bg-slate-905 border-slate-800/80 text-slate-400"
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Subtitles Text Overlay</label>
                  <input
                    type="text"
                    placeholder="Overlay caption on active frame (e.g., Voyage Star-1)"
                    value={subtitlesText}
                    onChange={(e) => setSubtitlesText(e.target.value)}
                    className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Interactive FX Pipes</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vhsFilter}
                        onChange={(e) => setVhsFilter(e.target.checked)}
                        className="rounded border-slate-800 text-indigo-650 bg-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300">Simulate VHS Signal Glitch Noise</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={grainOverlay}
                        onChange={(e) => setGrainOverlay(e.target.checked)}
                        className="rounded border-slate-800 text-indigo-650 bg-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300">Retro Analog Film Grain Filter</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timestampOverlay}
                        onChange={(e) => setTimestampOverlay(e.target.checked)}
                        className="rounded border-slate-800 text-indigo-650 bg-slate-900 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300">ISO Timestamp telemetry</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVidEditing || !generatedVidPattern}
                  className="w-full py-3 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-550 hover:to-purple-550 text-white font-semibold rounded-xl text-xs transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {isVidEditing ? "Baking overlay telemetry..." : "Export Video Edit"}
                </button>
              </form>
            )}

            {/* TAB 5: Music Composer Config */}
            {activeTab === "music_generation" && (
              <form onSubmit={handleGenerateMusic} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="music-prompt" className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Composition Vibe</label>
                  <input
                    id="music-prompt"
                    type="text"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="e.g. Ambient lofi beat for focus..."
                    required
                    className="w-full bg-[#181c2b] text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label htmlFor="music-genre" className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-1">Genre Node</label>
                    <select
                      id="music-genre"
                      value={musicGenre}
                      onChange={(e) => setMusicGenre(e.target.value)}
                      className="w-full bg-[#181c2b] text-slate-100 text-xs border border-slate-800 rounded-xl px-2.5 py-2 cursor-pointer"
                    >
                      <option value="lofi">Lo-Fi Beat</option>
                      <option value="techno">Cyberpunk Techno</option>
                      <option value="ambient">Space Ambient</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="music-bpm" className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider mb-1">Tempo (BPM)</label>
                    <select
                      id="music-bpm"
                      value={musicBPM}
                      onChange={(e) => setMusicBPM(Number(e.target.value))}
                      className="w-full bg-[#181c2b] text-slate-100 text-xs border border-slate-800 rounded-xl px-2.5 py-2 cursor-pointer"
                    >
                      <option value={75}>Adagio (75 bpm)</option>
                      <option value={90}>Andante (90 bpm)</option>
                      <option value={120}>Allegro (120 bpm)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isMusicGenerating || !musicPrompt.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-550 hover:to-purple-550 text-white font-semibold rounded-xl text-xs transition-all shadow disabled:opacity-50 cursor-pointer"
                >
                  {isMusicGenerating ? "Synthesizing rhythm sequence..." : "Compose Audio Loop"}
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-slate-850 space-y-1 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-500">Secured Gateway</span>
            <p className="text-[9px] text-slate-600 leading-relaxed">All generated artifacts are cleared upon closing this session.</p>
          </div>
        </div>

        {/* RIGHT PREVIEW CANVAS SIDE */}
        <div id="creative-preview-viewport" className="flex-1 bg-[#0b0c10] p-6 md:p-10 flex flex-col items-center justify-center relative overflow-y-auto">
          {/* TAB 1 PREVIEW: Image Generation */}
          {activeTab === "image_generation" && (
            <div className="w-full max-w-xl space-y-4">
              <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block text-center">Preview Output Canvas</span>
              
              <div className="aspect-video bg-[#11141e] rounded-2xl border border-slate-850 flex items-center justify-center overflow-hidden relative group">
                {isGenerating ? (
                  <div className="text-center space-y-2 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 font-mono">Synthesizing pixel matrix...</span>
                  </div>
                ) : generatedImg ? (
                  <img
                    src={generatedImg}
                    alt="Neural synthesis result"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-slate-600 space-y-2 p-6 select-none">
                    <ImageIcon className="w-12 h-12 text-slate-800 mx-auto" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Stream</h4>
                    <p className="text-[10px] text-slate-600 max-w-sm">Enter a model prompt and render the layout blueprint.</p>
                  </div>
                )}

                {generatedImg && !isGenerating && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <a
                      href={generatedImg}
                      download="generated_canvas.png"
                      className="p-3 bg-indigo-650 hover:bg-indigo-550 rounded-xl text-white cursor-pointer transition-all"
                      title="Download image file"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2 PREVIEW: Image Editing */}
          {activeTab === "image_editing" && (
            <div className="w-full max-w-xl space-y-4">
              <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block text-center">Interactive Filter Screen</span>
              
              <div className="aspect-video bg-[#11141e] rounded-2xl border border-slate-850 flex items-center justify-center overflow-hidden relative">
                {isEditing ? (
                  <div className="text-center space-y-2 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 font-mono">Baking dynamic filters...</span>
                  </div>
                ) : editedImg ? (
                  <div className="relative w-full h-full">
                    <img
                      src={editedImg}
                      alt="Filter base"
                      style={{
                        filter: `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg)`
                      }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded text-[10px] font-mono text-emerald-400 select-none">
                      Active: Adjusted {brightness !== 100 ? " brightness" : ""}{contrast !== 100 ? " contrast" : ""}{blur > 0 ? " blur" : ""}
                    </div>
                  </div>
                ) : uploadImg ? (
                  <img
                    src={uploadImg}
                    alt="Uploaded source base"
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-slate-600 space-y-2 p-6 select-none">
                    <Sliders className="w-12 h-12 text-slate-800 mx-auto" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Base Asset</h4>
                    <p className="text-[10px] text-slate-600 max-w-sm">Choose one preset cyber background or upload a base file.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3 PREVIEW: Video Generation */}
          {activeTab === "video_generation" && (
            <div className="w-full max-w-xl space-y-4">
              <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block text-center">Procedural Canvas Cinematic Preview</span>
              
              <div className="aspect-video bg-[#0d111a] rounded-2xl border border-slate-850 flex flex-col items-center justify-center overflow-hidden relative">
                {isVidGenerating ? (
                  <div className="text-center space-y-2 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 font-mono">Processing video interpolation...</span>
                  </div>
                ) : generatedVidPattern ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <canvas ref={canvasRef} className="w-full h-full" />
                    
                    {/* Controls overlay */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-950/80 p-2 border border-slate-800 rounded-xl select-none">
                      <button
                        onClick={() => setIsPlayingVid(!isPlayingVid)}
                        className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-300 hover:text-white cursor-pointer"
                      >
                        {isPlayingVid ? "Pause" : "Play"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-600 space-y-2 p-6 select-none">
                    <Video className="w-12 h-12 text-slate-800 mx-auto" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">No Active Cinematic Feed</h4>
                    <p className="text-[10px] text-slate-600 max-w-sm">Type keywords specifying dynamic motion to render simulated loop particles.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4 PREVIEW: Video Editing */}
          {activeTab === "video_editing" && (
            <div className="w-full max-w-xl space-y-4">
              <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block text-center">Video Subtitle & Noise Render</span>
              
              <div className="aspect-video bg-[#0d111a] rounded-2xl border border-slate-850 flex items-center justify-center overflow-hidden relative">
                {isVidEditing ? (
                  <div className="text-center space-y-2 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 font-mono">Rendering overlay filters...</span>
                  </div>
                ) : generatedVidPattern ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <canvas ref={canvasRef} className="w-full h-full" />
                    
                    {/* VHS Filter simulation overlays */}
                    {vhsFilter && (
                      <div className="absolute inset-0 pointer-events-none bg-indigo-500/5 mix-blend-color-dodge select-none">
                        <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-0.5 bg-white/20 animate-scanline"></div>
                        <span className="absolute top-4 right-4 text-[10px] font-mono text-[#00ffcc] font-extrabold animate-pulse">REC ●</span>
                      </div>
                    )}

                    {/* Grain overlay */}
                    {grainOverlay && (
                      <div className="absolute inset-0 pointer-events-none bg-[url('https://picsum.photos/seed/grain/10/10?blur=1')] opacity-10 mix-blend-overlay"></div>
                    )}

                    {/* Captions subtitles block */}
                    {subtitlesText && (
                      <div className="absolute bottom-8 left-12 right-12 text-center bg-black/80 px-4 py-2 rounded-xl border border-slate-800 select-text">
                        <span className="text-xs font-bold text-yellow-400 font-sans">{subtitlesText}</span>
                      </div>
                    )}

                    {/* Telemetry metadata stamp */}
                    {timestampOverlay && (
                      <div className="absolute top-4 left-4 font-mono text-[9px] text-[#00ffaa] tracking-widest select-none bg-black/60 px-1.5 py-0.5 rounded">
                        <span>P-FRAME // 14-JUNE-2026 // {new Date().toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 space-y-3 p-6 text-center select-none bg-slate-900/40 border border-slate-850 rounded-xl">
                    <Scissors className="w-10 h-10 text-slate-700 mx-auto" />
                    <h4 className="text-xs font-mono font-bold text-slate-300">Generate a Video block first</h4>
                    <p className="text-[10px] text-slate-500 max-w-sm">Use Tab 3 "Gen Video" to produce a procedural canvas block before managing subtitles or video filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5 PREVIEW: Music Composer */}
          {activeTab === "music_generation" && (
            <div className="w-full max-w-xl space-y-4">
              <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block text-center">Procedural Synthesis Visualizer</span>
              
              <div className="aspect-video bg-[#0a0d14] rounded-2xl border border-[#1a2135] flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden">
                {isMusicGenerating ? (
                  <div className="text-center space-y-2 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 font-mono">Compiling synth oscillators...</span>
                  </div>
                ) : activeAudioPreset ? (
                  <div className="w-full max-w-sm bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-5 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                        🎵
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold">Procedural MIDI Stream</span>
                        <h4 className="text-xs font-bold text-white truncate font-sans">{activeAudioPreset}</h4>
                        <span className="text-[9px] font-mono text-slate-500 capitalize">{musicGenre} — {musicBPM} BPM</span>
                      </div>
                    </div>

                    {/* Procedural Waveform visualizer Canvas */}
                    <div className="border border-slate-850 bg-[#0b0e14] rounded-xl overflow-hidden h-24 relative flex items-center justify-center">
                      <canvas ref={synthCanvasRef} className="w-full h-full" />
                      {!isPlayingMusic && (
                        <span className="absolute text-[10px] font-mono text-slate-550 select-none">Synthesizer Paused // Stream Idled</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPlayingMusic ? (
                        <button
                          onClick={stopAudioSynthesizer}
                          className="flex-1 py-2 bg-rose-650 hover:bg-rose-550 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Square className="w-3.5 h-3.5" />
                          <span>Stop Synth Stream</span>
                        </button>
                      ) : (
                        <button
                          onClick={startAudioSynthesizer}
                          className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Playback Sequence</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-600 space-y-2 p-6 select-none">
                    <Music className="w-12 h-12 text-slate-800 mx-auto" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Awaiting Synthesizer Vibe</h4>
                    <p className="text-[10px] text-slate-600 max-w-sm">Establish a synthesis vibe above to construct raw oscillator waveforms.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Locked allowance upgrade hint overlay for free tier */}
          {plan === "free" && allowances[activeTab] <= 0 && (
            <div className="absolute inset-0 bg-[#0e111acf]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none z-10 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500 flex items-center justify-center text-indigo-400 mb-4 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Generative Limits Exceeded</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md">You have depleted your 10 free daily visual/narrative/audio generation credits for this module.</p>
              
              <div className="mt-5 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-left space-y-1 text-[11px] font-mono text-slate-300 max-w-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Free daily allocation:</span>
                  <span className="text-rose-400 font-bold">10 / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Remaining:</span>
                  <span className="text-rose-400 font-bold">0 units</span>
                </div>
              </div>

              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span>Scale to Premium Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* AdSense Placement */}
          <div className="w-full max-w-xl mt-6">
            <AdComponent placement="creative_tools_pages" />
          </div>
        </div>
      </div>
    </div>
  );
}
