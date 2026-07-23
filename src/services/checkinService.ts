import type { CheckinHistoryItem, CheckinSession, TriageLevel } from "@/types";
import * as checkinApi from "@/api/checkin";

export async function startNewCheckinService(): Promise<string> {
  const res = await checkinApi.createCheckin();
  return res.session_id;
}

export async function postChatMessageService(
  sessionId: string,
  messageText: string,
  stepCount: number
) {
  return await checkinApi.sendMessage(sessionId, messageText, stepCount);
}

export async function finishCheckinService(
  sessionId: string,
  primarySymptom: string,
  triageLevel: TriageLevel
): Promise<CheckinSession> {
  return await checkinApi.closeCheckin(sessionId, { primarySymptom, triageLevel });
}

export async function fetchCheckinHistoryService(): Promise<CheckinHistoryItem[]> {
  return await checkinApi.getCheckinHistory();
}

export async function requestEscalationService(sessionId: string) {
  return await checkinApi.escalateCheckin(sessionId);
}

export function markContactedService(id: string) {
  return checkinApi.markHistoryItemContacted(id);
}
