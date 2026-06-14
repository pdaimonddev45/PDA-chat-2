export interface FileAttachment {
  name: string;
  mimeType: string;
  size: string;
  base64?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachment?: FileAttachment;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  systemInstruction: string;
  modelName: string;
  createdAt: Date;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface ResearchReport {
  id: string;
  topic: string;
  focusArea: string;
  depth: string;
  markdown: string;
  sources: GroundingSource[];
  timestamp: Date;
}

export interface VoiceMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  transcript?: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface CreativeItem {
  id: string;
  type: "image" | "writing";
  prompt: string;
  resultUrl?: string; // for image
  resultText?: string; // for writing forge
  aspectRatio?: string;
  category?: string;
  timestamp: Date;
}
