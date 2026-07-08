export type AssistantState = "idle" | "listening" | "thinking" | "speaking";

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface PresetCommand {
  id: string;
  title: string;
  category: "productivity" | "creative" | "information" | "system";
  icon: string;
  prompt: string;
}

export interface AnalyticsDay {
  name: string;
  voice: number;
  text: number;
  responseTime: number; // in milliseconds
}

export interface UsageCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}
