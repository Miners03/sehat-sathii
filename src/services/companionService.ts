import { saveSessionApi, getSessionsApi } from "@/api/companion";
import { getLatestMoodCheckinApi } from "@/api/mood";
import { detectCrisis } from "@/services/crisisDetector";
import type { CompanionSession, CompanionMessage, MoodCheckin } from "@/types";

export const DEFAULT_OPENING_LINE = "Hi! I'm glad you're here today. How have you been feeling lately?";

export async function createNewSession(userId: string): Promise<CompanionSession> {
  const latestMood = await getLatestMoodCheckinApi(userId);
  let initialText = DEFAULT_OPENING_LINE;

  if (latestMood) {
    if (latestMood.mood <= 2 || latestMood.stress >= 4) {
      initialText = `Hi! I noticed from your recent check-in that things might be feeling a bit heavy or stressful right now. I'm right here with you. How would you like to share?`;
    } else if (latestMood.mood >= 4) {
      initialText = `Hi! It's wonderful to see your positive check-in today! How are you feeling right now as we chat?`;
    }
  }

  const session: CompanionSession = {
    id: "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    user_id: userId,
    transcript: [
      {
        id: "msg_init",
        sender: "companion",
        text: initialText,
        timestamp: new Date().toISOString(),
      },
    ],
    started_at: new Date().toISOString(),
  };

  await saveSessionApi(session);
  return session;
}

export async function sendUserMessage(
  session: CompanionSession,
  userText: string
): Promise<{ updatedSession: CompanionSession; crisisDetected: boolean; replyText: string }> {
  // Check Crisis Detection on userText
  const crisis = detectCrisis(userText);

  const userMsg: CompanionMessage = {
    id: "msg_" + Date.now() + "_u",
    sender: "user",
    text: userText,
    timestamp: new Date().toISOString(),
  };

  let replyText = "";

  if (crisis.isCrisis) {
    replyText = "I hear how much pain and distress you are experiencing right now. Please know that you are not alone, and your life matters deeply. I am staying right here with you. Please take a moment to connect with the KIRAN helpline below (1800-599-0019) or call someone you trust.";
  } else {
    // Empathetic contextual reply generator
    const lower = userText.toLowerCase();
    if (lower.includes("sad") || lower.includes("depressed") || lower.includes("down") || lower.includes("lonely")) {
      replyText = "Thank you for trusting me with how you're feeling. It takes courage to acknowledge sadness or loneliness. Would you like to talk more about what's on your mind, or try a gentle grounding reflection together?";
    } else if (lower.includes("anxious") || lower.includes("worried") || lower.includes("stress") || lower.includes("overwhelmed")) {
      replyText = "Feeling overwhelmed or anxious can take a heavy physical and emotional toll. Let's take things one step at a time. I'm right here with you. Would a brief 1-minute breathing exercise help right now?";
    } else if (lower.includes("sleep") || lower.includes("tired") || lower.includes("exhausted")) {
      replyText = "Rest is so crucial for emotional well-being. Being tired makes everything feel harder. Be extra gentle with yourself today. Have you been able to take any breaks?";
    } else if (lower.includes("assessment") || lower.includes("test") || lower.includes("phq") || lower.includes("gad")) {
      replyText = "Would it be alright if I asked a few structured questions to understand how you've been feeling over the last 2 weeks? There's no wrong answer here.";
    } else {
      replyText = "I hear you, and I appreciate you sharing that with me. How does it feel to talk about this today?";
    }
  }

  const companionMsg: CompanionMessage = {
    id: "msg_" + Date.now() + "_c",
    sender: "companion",
    text: replyText,
    timestamp: new Date().toISOString(),
  };

  const updatedTranscript = [...session.transcript, userMsg, companionMsg];
  const updatedSession: CompanionSession = {
    ...session,
    transcript: updatedTranscript,
  };

  await saveSessionApi(updatedSession);
  return { updatedSession, crisisDetected: crisis.isCrisis, replyText };
}

export async function getUserSessions(userId: string): Promise<CompanionSession[]> {
  return getSessionsApi(userId);
}
