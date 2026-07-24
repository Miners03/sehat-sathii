import { saveAssessmentApi, getAssessmentsApi, getLatestAssessmentApi } from "@/api/assessment";
import { ASSESSMENT_INSTRUMENTS } from "@/constants/assessments";
import { checkPHQ9Item9Crisis } from "@/services/crisisDetector";
import type { AssessmentInstrument, AssessmentResponse, WellnessSignal } from "@/types";

export async function processAssessmentSubmission(
  userId: string,
  instrument: AssessmentInstrument,
  responses: number[]
): Promise<{ record: AssessmentResponse; crisisTriggered: boolean }> {
  const config = ASSESSMENT_INSTRUMENTS[instrument];
  const score = responses.reduce((a, b) => a + b, 0);

  let wellness_signal: WellnessSignal = config ? config.evaluateSignal(responses) : "steady";
  let crisisTriggered = false;

  // Extra check for PHQ-9 item 9
  if (instrument === "phq9" && responses.length >= 9) {
    const item9Crisis = checkPHQ9Item9Crisis(responses[8]);
    if (item9Crisis.isCrisis) {
      crisisTriggered = true;
      wellness_signal = "reach_out";
    }
  }

  if (wellness_signal === "reach_out") {
    crisisTriggered = true;
  }

  const record = await saveAssessmentApi(userId, instrument, responses, score, wellness_signal);
  return { record, crisisTriggered };
}

export async function getAssessmentHistory(userId: string): Promise<AssessmentResponse[]> {
  return getAssessmentsApi(userId);
}

export async function getLatestAssessment(userId: string): Promise<AssessmentResponse | null> {
  return getLatestAssessmentApi(userId);
}
