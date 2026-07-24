import {
  saveMoodCheckinApi,
  getMoodCheckinsApi,
  getLatestMoodCheckinApi,
} from "@/api/mood";
import type { MoodCheckin } from "@/types";

export async function saveMoodCheckin(
  userId: string,
  mood: number,
  stress: number,
  anxiety: number,
  sleep: number,
  energy: number,
  motivation: number
): Promise<MoodCheckin> {
  return saveMoodCheckinApi({
    user_id: userId,
    mood,
    stress,
    anxiety,
    sleep,
    energy,
    motivation,
  });
}

export async function getMoodHistory(userId: string): Promise<MoodCheckin[]> {
  return getMoodCheckinsApi(userId);
}

export async function getLatestMood(userId: string): Promise<MoodCheckin | null> {
  return getLatestMoodCheckinApi(userId);
}
