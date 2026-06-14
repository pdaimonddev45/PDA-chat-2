import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set higher limits for large model inputs like base64 spoken voice recording / base64 image generation
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Helper to initialize the Google GenAI SDK lazily so lack of API key doesn't crash server immediately
let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in your Secrets / Settings.");
    }
    genAIInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return genAIInstance;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Unlimited Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, modelName, attachment } = req.body;
    const ai = getGenAI();

    const selectedModel = modelName || "gemini-3.5-flash";

    // Prepare contents
    const contents: any[] = [];

    // Add prior context
    if (messages && Array.isArray(messages)) {
      messages.forEach((msg: any) => {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      });
    }

    // Prepare current parts
    const currentParts: any[] = [];
    
    // Add file or image attachment if available
    if (attachment && attachment.base64 && attachment.mimeType) {
      currentParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.base64
        }
      });
    }

    // Add user text
    const userPrompt = req.body.prompt || "";
    if (userPrompt) {
      currentParts.push({ text: userPrompt });
    }

    // append to contents
    if (currentParts.length > 0) {
      contents.push({
        role: "user",
        parts: currentParts
      });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: contents,
      config: {
        systemInstruction: systemInstruction || "You are PDA Chat AI, a brilliant and unlimited AI companion designed to help the user with any complex task.",
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      text: response.text || "No response received.",
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during chat processing."
    });
  }
});

// 2. Deep Research Engine
app.post("/api/research", async (req, res) => {
  try {
    const { topic, focusArea, depth } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, error: "Research topic is required." });
    }

    const ai = getGenAI();
    
    // Instruction to build a meticulous, comprehensive academic or product report
    const systemInstruction = `You are the PDA Deep Research Engine, an elite scientific and web analyst. 
Your goal is to prepare highly comprehensive, authoritative, multi-section markdown reports using Google Search Grounding. 
Structure your response perfectly with:
1. EXECUTIVE SUMMARY
2. CORE TIMELINE & HISTORICAL DEVELOPMENT
3. STRUCTURAL CRITIQUE / TECHNICAL BREAKDOWN (deep exploration)
4. RETRIEVED WEB STATS & CONFLICTING OPINIONS
5. FUTURE PROJECTIONS & STRATEGISM
Include real citations/sources parsed in brackets like [Source Title](URL). Keep markdown formatting clean, spacious, and extremely analytical.`;

    const instructionsPrompt = `Perform a deep web research analysis on: "${topic}".
Focus Area: ${focusArea || "General Overview, technical specs and real-world statistics"}
Research Depth Level: ${depth || "High Depth - multi-angle integration"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: instructionsPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for factual consistency
        tools: [{ googleSearch: {} }],
      }
    });

    // Extract grounding metadata to show sources
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    res.json({
      success: true,
      text: response.text || "No research findings were compiled.",
      groundingMetadata: groundingMetadata || null
    });
  } catch (error: any) {
    console.error("Deep Research Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during the deep research process."
    });
  }
});

// 3. Voice Arena Endpoint (Speech to Response to Speech)
app.post("/api/voice", async (req, res) => {
  try {
    const { audioBase64, mimeType, textInput, voiceName } = req.body;
    const ai = getGenAI();

    let responseText = "";
    let userTranscript = "";

    const selectedVoice = voiceName || "Kore"; // Puck, Charon, Kore, Fenrir, Zephyr

    if (audioBase64 && mimeType) {
      // Step A: Convert voice audio to transcript + reply in a single prompt with structured JSON Schema
      const prompt = "Please listen to the user's spoken audio. Transcribe what they said exactly, then generate a concise, friendly, and helpful voice response in 1-2 short sentences.";
      
      const audioPart = {
        inlineData: {
          mimeType: mimeType,
          data: audioBase64
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [audioPart, prompt],
        config: {
          systemInstruction: "You are the vocal core of PDA Chat AI. You speak in a highly caring, efficient tone, returning JSON format with keys 'transcript' and 'reply'. Keep reply under 25 words.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transcript: { type: Type.STRING, description: "Direct Transcription of what user said." },
              reply: { type: Type.STRING, description: "Your conversational conversational reply." }
            },
            required: ["transcript", "reply"]
          }
        }
      });

      try {
        const resultJson = JSON.parse(response.text || "{}");
        userTranscript = resultJson.transcript || "Spoken audio input";
        responseText = resultJson.reply || "I heard your audio and am happy to assist you.";
      } catch (e) {
        // Fallback if parsing fails
        responseText = response.text || "I heard your audio.";
        userTranscript = "Voice Input";
      }
    } else if (textInput) {
      // If user typed instead of spoke but wants voice feedback
      userTranscript = textInput;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: textInput,
        config: {
          systemInstruction: "You are the vocal core of PDA Chat AI. Keep your response conversational and extremely short (1-2 sentences, max 25 words) for audio playback.",
          temperature: 0.8,
        }
      });
      responseText = response.text || "I am happy to assist you.";
    } else {
      return res.status(400).json({ success: false, error: "Either audio or text input is required." });
    }

    // Step B: Synthesize responseText using gemini-3.1-flash-tts-preview
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say naturally but clearly: ${responseText}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    res.json({
      success: true,
      text: responseText,
      transcript: userTranscript,
      audio: base64Audio || null
    });
  } catch (error: any) {
    console.error("Voice Arena Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during voice synthesis."
    });
  }
});

// 4. Creative Studio: Image Generation
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Image prompt is required." });
    }

    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
        }
      }
    });

    let generatedBase64 = "";
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedBase64) {
      throw new Error("Could not extract generated image bytes from Gemini response.");
    }

    res.json({
      success: true,
      image: `data:image/png;base64,${generatedBase64}`
    });
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during image generation."
    });
  }
});

// ----------------------------------------------------
// VITE OR STATIC HANDLING FOR FRONTEND
// ----------------------------------------------------
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: Mount Vite's middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: Serve standard build dist static folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PDA Chat AI server online at http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

setupServer();
