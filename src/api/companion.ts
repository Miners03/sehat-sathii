import type { CompanionSession, CompanionMessage } from "@/types";

const SESSIONS_KEY = "sehat_saathi_companion_sessions";

export async function saveSessionApi(session: CompanionSession): Promise<CompanionSession> {
  const existingJson = localStorage.getItem(SESSIONS_KEY);
  const list: CompanionSession[] = existingJson ? JSON.parse(existingJson) : [];

  const index = list.findIndex((s) => s.id === session.id);
  if (index >= 0) {
    list[index] = session;
  } else {
    list.unshift(session);
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(list));
  return session;
}

export async function getSessionsApi(userId: string): Promise<CompanionSession[]> {
  const existingJson = localStorage.getItem(SESSIONS_KEY);
  if (!existingJson) return [];
  const list: CompanionSession[] = JSON.parse(existingJson);
  return list.filter((s) => s.user_id === userId);
}
