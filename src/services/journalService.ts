import { saveJournalEntryApi, getJournalEntriesApi } from "@/api/journal";
import { detectCrisis } from "@/services/crisisDetector";
import type { JournalEntry } from "@/types";

export interface JournalSaveResult {
  entry: JournalEntry;
  crisisTriggered: boolean;
  reflectionPrompt: string;
}

export async function processAndSaveJournal(
  userId: string,
  mode: "voice" | "text",
  content: string
): Promise<JournalSaveResult> {
  const crisis = detectCrisis(content);

  const lower = content.toLowerCase();

  // Emotion and sentiment extraction heuristic
  let detected_emotion = "Reflective";
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  let reflectionPrompt = "What is one small thing that brought a moment of peace to your day?";

  if (lower.includes("happy") || lower.includes("grateful") || lower.includes("good") || lower.includes("peace")) {
    detected_emotion = "Grateful & Calm";
    sentiment = "positive";
    reflectionPrompt = "How can you hold onto this feeling of gratitude as you move forward tomorrow?";
  } else if (lower.includes("anxious") || lower.includes("worried") || lower.includes("scared") || lower.includes("fear")) {
    detected_emotion = "Anxious & Uneasy";
    sentiment = "negative";
    reflectionPrompt = "If your anxiety had a voice, what gentle comfort would you speak back to it?";
  } else if (lower.includes("sad") || lower.includes("lonely") || lower.includes("tired") || lower.includes("heavy")) {
    detected_emotion = "Tired & Vulnerable";
    sentiment = "negative";
    reflectionPrompt = "What gentle act of self-kindness can you treat yourself to right now?";
  } else if (lower.includes("hope") || lower.includes("inspired") || lower.includes("proud")) {
    detected_emotion = "Hopeful & Inspired";
    sentiment = "positive";
    reflectionPrompt = "What step, no matter how small, are you excited to take next?";
  }

  const ai_summary = `In this ${mode} entry, you expressed feeling ${detected_emotion.toLowerCase()}. Key themes centered around personal reflections and your ongoing emotional journey.`;

  const entry = await saveJournalEntryApi({
    user_id: userId,
    mode,
    content,
    ai_summary,
    detected_emotion,
    sentiment,
  });

  return {
    entry,
    crisisTriggered: crisis.isCrisis,
    reflectionPrompt,
  };
}

export async function getJournalHistory(userId: string): Promise<JournalEntry[]> {
  return getJournalEntriesApi(userId);
}
