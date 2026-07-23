export type TriageLevel = "self_care" | "monitor" | "escalate";

export interface User {
  phone: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface StructuredSummary {
  symptoms: string[];
  duration: string;
  severity: string;
  notes: string;
  ashaName?: string;
  phcName?: string;
  contactPhone?: string;
}

export interface CheckinSession {
  id: string;
  createdAt: string;
  status: "active" | "completed";
  messages: ChatMessage[];
  triageLevel?: TriageLevel;
  summary?: StructuredSummary;
  contactedByASHA?: boolean;
}

export interface CheckinHistoryItem {
  id: string;
  date: string;
  triageLevel: TriageLevel;
  primarySymptom: string;
  statusText: string;
  summary?: StructuredSummary;
  contactedByASHA?: boolean;
}

export interface ASHAContact {
  name: string;
  center: string;
  distance: string;
  phone: string;
  available: boolean;
}
