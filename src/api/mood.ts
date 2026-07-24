import type { MoodCheckin } from "@/types";

const MOOD_CHECKINS_KEY = "sehat_saathi_mood_checkins";

export async function saveMoodCheckinApi(
  data: Omit<MoodCheckin, "id" | "created_at">
): Promise<MoodCheckin> {
  const existingJson = localStorage.getItem(MOOD_CHECKINS_KEY);
  const checkins: MoodCheckin[] = existingJson ? JSON.parse(existingJson) : [];

  const newCheckin: MoodCheckin = {
    ...data,
    id: "checkin_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    created_at: new Date().toISOString(),
  };

  checkins.unshift(newCheckin);
  localStorage.setItem(MOOD_CHECKINS_KEY, JSON.stringify(checkins));
  return newCheckin;
}

export async function getMoodCheckinsApi(userId: string): Promise<MoodCheckin[]> {
  const existingJson = localStorage.getItem(MOOD_CHECKINS_KEY);
  if (!existingJson) return [];
  const checkins: MoodCheckin[] = JSON.parse(existingJson);
  return checkins.filter((c) => c.user_id === userId);
}

export async function getLatestMoodCheckinApi(userId: string): Promise<MoodCheckin | null> {
  const list = await getMoodCheckinsApi(userId);
  return list.length > 0 ? list[0] : null;
}
