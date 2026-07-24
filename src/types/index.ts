export type WellnessSignal = "steady" | "notice" | "reach_out";

export type AssessmentInstrument = "phq9" | "gad7" | "who5" | "rses";

export interface User {
  id: string;
  phone: string;
  name?: string;
}

export interface MoodCheckin {
  id: string;
  user_id: string;
  mood: number; // 1 to 5
  stress: number; // 1 to 5
  anxiety: number; // 1 to 5
  sleep: number; // 1 to 10 (hours or rating)
  energy: number; // 1 to 5
  motivation: number; // 1 to 5
  created_at: string;
}

export interface CompanionMessage {
  id: string;
  sender: "user" | "companion";
  text: string;
  timestamp: string;
}

export interface CompanionSession {
  id: string;
  user_id: string;
  transcript: CompanionMessage[];
  started_at: string;
  closed_at?: string;
}

export interface AssessmentResponse {
  id: string;
  user_id: string;
  instrument: AssessmentInstrument;
  responses: number[];
  score: number;
  wellness_signal: WellnessSignal;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  mode: "voice" | "text";
  content: string;
  ai_summary: string;
  detected_emotion: string;
  sentiment: "positive" | "neutral" | "negative";
  created_at: string;
}
