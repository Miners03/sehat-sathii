import type { CheckinHistoryItem, CheckinSession, TriageLevel } from "@/types";

const USE_MOCK = true;

const MOCK_HISTORY_KEY = "sehat_saathi_history_mock";

const INITIAL_MOCK_HISTORY: CheckinHistoryItem[] = [
  {
    id: "chk_101",
    date: "2026-07-22",
    triageLevel: "self_care",
    primarySymptom: "Mild Headache & Fatigue",
    statusText: "Rest & Hydration advised",
    summary: {
      symptoms: ["Headache", "Fatigue"],
      duration: "1 day",
      severity: "Mild",
      notes: "Symptoms resolved after sleep and drinking water.",
    },
  },
  {
    id: "chk_102",
    date: "2026-07-15",
    triageLevel: "monitor",
    primarySymptom: "Cough & Sore Throat",
    statusText: "Monitor temperature daily",
    summary: {
      symptoms: ["Cough", "Sore throat", "Low grade fever"],
      duration: "3 days",
      severity: "Moderate",
      notes: "Advised warm salt water gargle and temperature log.",
    },
  },
];

export async function createCheckin(): Promise<{ session_id: string }> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));
    return { session_id: `chk_${Date.now()}` };
  }
  throw new Error("Real backend not connected");
}

export async function sendMessage(
  _sessionId: string,
  messageText: string,
  stepCount: number
): Promise<{ reply: string; crisis_flag: boolean; triage_level?: TriageLevel }> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 600));
    const lower = messageText.toLowerCase();

    if (lower.includes("chest pain") || lower.includes("severe breath") || lower.includes("unconscious")) {
      return {
        reply: "You mentioned serious symptoms. Please stay calm. We recommend immediate contact with a health center or emergency service.",
        crisis_flag: true,
        triage_level: "escalate",
      };
    }

    if (stepCount === 1) {
      return {
        reply: "I hear you. How long have you had this issue?",
        crisis_flag: false,
      };
    } else if (stepCount === 2) {
      return {
        reply: "Understood. Is there any fever, nausea, or dizziness along with this?",
        crisis_flag: false,
      };
    } else {
      let triage: TriageLevel = "self_care";
      if (lower.includes("fever") || lower.includes("pain") || lower.includes("vomit")) {
        triage = "monitor";
      }
      if (lower.includes("severe") || lower.includes("blood") || lower.includes("high fever")) {
        triage = "escalate";
      }

      return {
        reply: "Thank you for answering all questions. I have evaluated your symptoms.",
        crisis_flag: false,
        triage_level: triage,
      };
    }
  }
  throw new Error("Real backend not connected");
}

export async function closeCheckin(
  sessionId: string,
  userSummary: { primarySymptom: string; triageLevel: TriageLevel }
): Promise<CheckinSession> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    const newItem: CheckinHistoryItem = {
      id: sessionId,
      date: new Date().toISOString().split("T")[0],
      triageLevel: userSummary.triageLevel,
      primarySymptom: userSummary.primarySymptom || "Health Check-in",
      statusText:
        userSummary.triageLevel === "self_care"
          ? "Home care & rest"
          : userSummary.triageLevel === "monitor"
          ? "Watch symptoms over 48h"
          : "Urgent consultation advised",
      summary: {
        symptoms: [userSummary.primarySymptom],
        duration: "1-3 days",
        severity: userSummary.triageLevel === "escalate" ? "Severe" : "Mild to Moderate",
        notes: "Detailed symptom summary recorded during check-in.",
        ashaName: "Sunita Sharma (ASHA Worker)",
        phcName: "Sub-District Health Center, Sector 4",
        contactPhone: "+91 98765 43210",
      },
      contactedByASHA: false,
    };

    const existing = getStoredHistory();
    const updated = [newItem, ...existing];
    localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(updated));

    return {
      id: sessionId,
      createdAt: newItem.date,
      status: "completed",
      messages: [],
      triageLevel: userSummary.triageLevel,
      summary: newItem.summary,
    };
  }
  throw new Error("Real backend not connected");
}

export async function getCheckinHistory(): Promise<CheckinHistoryItem[]> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));
    return getStoredHistory();
  }
  throw new Error("Real backend not connected");
}

export async function escalateCheckin(_sessionId: string) {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    return {
      structured_summary: {
        ashaName: "Sunita Sharma (ASHA Worker)",
        phcName: "Sub-District Health Center, Sector 4",
        contactPhone: "+91 98765 43210",
        notes: "Urgent triage case escalated for local ASHA follow-up.",
      },
    };
  }
  throw new Error("Real backend not connected");
}

export function getStoredHistory(): CheckinHistoryItem[] {
  const raw = localStorage.getItem(MOCK_HISTORY_KEY);
  if (!raw) {
    localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(INITIAL_MOCK_HISTORY));
    return INITIAL_MOCK_HISTORY;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_HISTORY;
  }
}

export function clearStoredData() {
  localStorage.removeItem(MOCK_HISTORY_KEY);
}

export function markHistoryItemContacted(id: string) {
  const history = getStoredHistory();
  const updated = history.map((item) =>
    item.id === id ? { ...item, contactedByASHA: true } : item
  );
  localStorage.setItem(MOCK_HISTORY_KEY, JSON.stringify(updated));
  return updated;
}
