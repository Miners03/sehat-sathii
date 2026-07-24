import type { JournalEntry } from "@/types";

const JOURNAL_KEY = "sehat_saathi_journal_entries";

export async function saveJournalEntryApi(
  data: Omit<JournalEntry, "id" | "created_at">
): Promise<JournalEntry> {
  const existingJson = localStorage.getItem(JOURNAL_KEY);
  const list: JournalEntry[] = existingJson ? JSON.parse(existingJson) : [];

  const newEntry: JournalEntry = {
    ...data,
    id: "journal_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    created_at: new Date().toISOString(),
  };

  list.unshift(newEntry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(list));
  return newEntry;
}

export async function getJournalEntriesApi(userId: string): Promise<JournalEntry[]> {
  const existingJson = localStorage.getItem(JOURNAL_KEY);
  if (!existingJson) return [];
  const list: JournalEntry[] = JSON.parse(existingJson);
  return list.filter((j) => j.user_id === userId);
}
