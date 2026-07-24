import type { AssessmentResponse, AssessmentInstrument, WellnessSignal } from "@/types";

const ASSESSMENTS_KEY = "sehat_saathi_assessments";

export async function saveAssessmentApi(
  userId: string,
  instrument: AssessmentInstrument,
  responses: number[],
  score: number,
  wellness_signal: WellnessSignal
): Promise<AssessmentResponse> {
  const existingJson = localStorage.getItem(ASSESSMENTS_KEY);
  const list: AssessmentResponse[] = existingJson ? JSON.parse(existingJson) : [];

  const record: AssessmentResponse = {
    id: "asm_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    user_id: userId,
    instrument,
    responses,
    score,
    wellness_signal,
    created_at: new Date().toISOString(),
  };

  list.unshift(record);
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(list));
  return record;
}

export async function getAssessmentsApi(userId: string): Promise<AssessmentResponse[]> {
  const existingJson = localStorage.getItem(ASSESSMENTS_KEY);
  if (!existingJson) return [];
  const list: AssessmentResponse[] = JSON.parse(existingJson);
  return list.filter((a) => a.user_id === userId);
}

export async function getLatestAssessmentApi(userId: string): Promise<AssessmentResponse | null> {
  const list = await getAssessmentsApi(userId);
  return list.length > 0 ? list[0] : null;
}
