import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Volume2, User, Play, Info, HelpCircle, ArrowRight, Loader } from "lucide-react";
import { VoiceMessage } from "../types";

export default function VoiceView() {
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: "v-initial",
      role: "assistant",
      text: "Vocal core system activated. You can speak into your microphone or enter query lines below to hear synthesized responses.",
      timestamp: new Date()
    }
  ]);
  const [selectedVoice, setSelectedVoice] = useState("Kore");
  const [isRecording, setIsRecording] = useState(false);
  const [textModeInput, setTextModeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayRef = useRef<HTMLAudioElement | null>(null);

  // Available prebuilt voices lists for gemini-3.1-flash-tts-preview
  const voices = [
    { id: "Kore", label: "Kore (Resonant Calm Master)", details: "Balanced female archetype" },
    { id: "Puck", label: "Puck (Witty Quick Companion)", details: "Playful high-register male" },
    { id: "Charon", label: "Charon (Philosopher Deep Pitch)", details: "Deep, gravelly, baritone" },
    { id: "Fenrir", label: "Fenrir (Nordic Stoic Anchor)", details: "Aura of intelligence" },
    { id: "Zephyr", label: "Zephyr (Ambient Cloud Wind)", details: "Neutral soothing flow" }
  ];

  // Request permissions and start live recording
  const startRecording = async () => {
    setVoiceError("");
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleAudioUpload(audioBlob);
        
        // Stop all tracks to release microphone icon in browser
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error(err);
      setVoiceError("Microphone permissions denied or not supported in this frame. Use the text prompt proxy block below to test synthesis.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Upload Voice Blob to Server Node
  const handleAudioUpload = async (blob: Blob) => {
    setIsLoading(true);
    setVoiceError("");

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const cleanedBase64 = base64data.split(",")[1];

        const response = await fetch("/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: cleanedBase64,
            mimeType: "audio/webm",
            voiceName: selectedVoice
          })
        });

        const data = await response.json();
        if (data.success) {
          const userMsg: VoiceMessage = {
            id: `v-${Date.now()}-user`,
            role: "user",
            text: "[Recorded Voice Message]",
            transcript: data.transcript || "Deciphering standard pitch...",
            timestamp: new Date()
          };

          const assistMsg: VoiceMessage = {
            id: `v-${Date.now()}-assistant`,
            role: "assistant",
            text: data.text,
            audioUrl: data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, userMsg, assistMsg]);

          // Automatically trigger speech playback
          if (data.audio) {
            playSynthesizedAudio(data.audio);
          }
        } else {
          throw new Error(data.error || "System synthesis glitch");
        }
      };
    } catch (err: any) {
      console.error(err);
      setVoiceError(err.message || "Failed to parse vocal query.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send typed query line to synthesize back voice response
  const handleTextVerifyLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textModeInput.trim()) return;

    const userText = textModeInput;
    setTextModeInput("");
    setIsLoading(true);
    setVoiceError("");

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textInput: userText,
          voiceName: selectedVoice
        })
      });

      const data = await response.json();
      if (data.success) {
        const userMsg: VoiceMessage = {
          id: `v-${Date.now()}-user`,
          role: "user",
          text: userText,
          timestamp: new Date()
        };

        const assistMsg: VoiceMessage = {
          id: `v-${Date.now()}-assistant`,
          role: "assistant",
          text: data.text,
          audioUrl: data.audio ? `data:audio/mp3;base64,${data.audio}` : undefined,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg, assistMsg]);

        if (data.audio) {
          playSynthesizedAudio(data.audio);
        }
      } else {
        throw new Error(data.error || "Synthesis node collapsed");
      }
    } catch (err: any) {
      console.error(err);
      setVoiceError(err.message || "Failed to reach audio generator.");
    } finally {
      setIsLoading(false);
    }
  };

  const playSynthesizedAudio = (base64Audio: string) => {
    try {
      if (audioPlayRef.current) {
        audioPlayRef.current.pause();
      }
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
      const newAudio = new Audio(audioUrl);
      audioPlayRef.current = newAudio;
      newAudio.play();
    } catch (playbackError) {
      console.error("Audio playback restricted, user gesture might be required.", playbackError);
    }
  };

  return (
    <div id="voice-workspace" className="flex-1 flex flex-col h-full bg-[#11141c] overflow-y-auto">
      {/* Top Controller Bar */}
      <div id="voice-header-bar" className="bg-[#151924]/90 backdrop-blur border-b border-slate-800 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">Voice Arena</h2>
          <p className="text-xs text-slate-400">Bidirectional Voice Dialogue backed by gemini-3.1-flash-tts-preview</p>
        </div>
      </div>

      <div id="voice-grid" className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Voice customization */}
        <div id="voice-sidebar-control" className="lg:col-span-5 bg-[#141822] border border-slate-800/80 rounded-2xl p-6 h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800/60">
            <Volume2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Aura Synthesis Settings</h3>
          </div>

          {/* Voice selector blocks */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Select Prebuilt Vocal Chord
            </label>
            <div className="space-y-2">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`w-full flex items-start justify-between p-3.5 rounded-xl border text-left transition-all ${
                    selectedVoice === v.id
                      ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                      : "bg-slate-900/50 border-slate-800/60 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold">{v.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{v.details}</p>
                  </div>
                  {selectedVoice === v.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mt-1"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Arena Controller */}
          <div className="p-5 bg-[#0e1119] rounded-xl border border-slate-800/70 text-center space-y-4">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Monaural Capture Terminal</p>
            
            <div className="flex items-center justify-center">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-650 hover:bg-red-500 flex items-center justify-center text-white ring-8 ring-red-500/20 cursor-pointer transition-all animate-pulse shadow-lg"
                >
                  <Square className="w-6 h-6 fill-white" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isLoading}
                  className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white ring-8 ring-indigo-500/20 cursor-pointer transition-all shadow-lg hover:scale-105 disabled:opacity-40"
                >
                  <Mic className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="text-center">
              <span className="text-xs font-semibold text-slate-300">
                {isRecording ? "Transmitting audio flow..." : "Click to initialize record capture"}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {isRecording ? "Will automatically synthesize reply upon click stop" : "Or use manual prompt line below"}
              </p>
            </div>
          </div>

          {/* Feedback logs error */}
          {voiceError && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-300">
              {voiceError}
            </div>
          )}

          {/* Manual Prompt Line fallback */}
          <div className="border-t border-slate-800/60 pt-4 space-y-3">
            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">
              Text-to-Voice Proxy Box
            </h4>
            <form onSubmit={handleTextVerifyLaunch} className="flex gap-2">
              <input
                type="text"
                value={textModeInput}
                onChange={(e) => setTextModeInput(e.target.value)}
                placeholder="Type testing line (e.g., Explain gravity)..."
                className="flex-1 bg-slate-900 text-slate-200 text-xs border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 placeholder-slate-650"
              />
              <button
                type="submit"
                disabled={isLoading || !textModeInput.trim()}
                className="px-3 bg-indigo-600/90 text-white rounded-xl hover:bg-indigo-500 text-xs transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Conversation stream transcript logs */}
        <div id="vocal-transcript-dashboard" className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-[#141822] border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col min-h-[450px]">
            {/* Header layout */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/65 mb-4 select-none">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-indigo-900/40 text-indigo-400">
                  <Play className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Dual Vocal Records</h3>
              </div>
              <span className="text-[10px] text-slate-500">Live Transcription Channel</span>
            </div>

            {/* Transcription message list */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] pr-2">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] border ${
                      isUser
                        ? "bg-[#1f2538] border-slate-700/80 rounded-tr-none text-slate-200"
                        : "bg-[#11141c]/90 border-slate-850 rounded-tl-none text-slate-100"
                    }`}>
                      <div className="flex items-center justify-between gap-6 mb-2">
                        <span className="text-[9px] font-mono uppercase bg-black/30 px-1.5 py-0.5 rounded text-indigo-400 font-bold select-none">
                          {isUser ? "User" : "Voice Core"}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm leading-relaxed">{m.text}</p>
                      
                      {/* Show Transcription block for recorded audios */}
                      {m.transcript && (
                        <div className="mt-2.5 p-2 bg-black/40 rounded-lg text-[11px] font-mono text-slate-400 border border-slate-850 select-text">
                          <span className="text-[9px] text-indigo-400 block uppercase font-bold tracking-wide">Decoded Transcript:</span>
                          "{m.transcript}"
                        </div>
                      )}

                      {/* Assistant speech player action */}
                      {m.audioUrl && (
                        <button
                          onClick={() => playSynthesizedAudio(m.audioUrl!.split(",")[1])}
                          className="mt-3.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-mono text-white transition-all shadow"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Play Audio Track</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-3">
                    <Loader className="w-3.5 h-3.5 animate-spin text-indigo-455" />
                    <span>Processing voice telemetry...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
