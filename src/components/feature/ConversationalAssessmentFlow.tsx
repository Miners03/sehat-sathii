import React, { useState } from "react";
import { ASSESSMENT_INSTRUMENTS } from "@/constants/assessments";
import { processAssessmentSubmission } from "@/services/assessmentService";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AssessmentInstrument, AssessmentResponse } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

interface ConversationalAssessmentFlowProps {
  onComplete: (result: AssessmentResponse, crisisTriggered: boolean) => void;
  onCancel: () => void;
}

export const ConversationalAssessmentFlow: React.FC<ConversationalAssessmentFlowProps> = ({
  onComplete,
  onCancel,
}) => {
  const { user } = useAuth();
  const userId = user?.id || "guest_user";

  const [selectedInstrument, setSelectedInstrument] = useState<AssessmentInstrument>("phq9");
  const [started, setStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const instrumentConfig = ASSESSMENT_INSTRUMENTS[selectedInstrument];
  const currentQuestion = instrumentConfig?.questions[currentIndex];

  const handleAnswer = async (value: number) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < instrumentConfig.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all questions
      setLoading(true);
      try {
        const { record, crisisTriggered } = await processAssessmentSubmission(
          userId,
          selectedInstrument,
          updatedAnswers
        );
        onComplete(record, crisisTriggered);
      } catch (err) {
        console.error("Assessment submit failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-surface border border-text-muted/20 rounded-2xl p-5 shadow-md space-y-4 text-left">
      {!started ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text">Conversational Assessment</h3>
            <Badge tone="steady">Validated Scale</Badge>
          </div>
          <p className="text-sm text-text-muted">
            Choose an assessment instrument. The questions will be presented standardly to preserve accuracy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.keys(ASSESSMENT_INSTRUMENTS) as AssessmentInstrument[]).map((key) => {
              const inst = ASSESSMENT_INSTRUMENTS[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedInstrument(key)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedInstrument === key
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-text-muted/15 bg-bg hover:bg-surface"
                  }`}
                >
                  <div className="font-bold text-sm text-text">{inst.title}</div>
                  <div className="text-xs text-text-muted">{inst.description}</div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-bg rounded-xl text-xs text-text-muted border border-text-muted/10 italic">
            "{instrumentConfig.leadIn}"
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onCancel} size="sm">
              Cancel
            </Button>
            <Button onClick={() => setStarted(true)} size="sm">
              Begin Assessment
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-text-muted/10 pb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {instrumentConfig.title} • Question {currentIndex + 1} of {instrumentConfig.questions.length}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-text-muted hover:text-text"
            >
              Exit
            </button>
          </div>

          <div className="p-4 bg-bg rounded-2xl border border-text-muted/15">
            <h4 className="text-base font-bold text-text leading-snug">
              {currentQuestion?.text}
            </h4>
          </div>

          <div className="space-y-2">
            {currentQuestion?.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={loading}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left p-3.5 bg-surface hover:bg-primary/10 border border-text-muted/20 hover:border-primary rounded-xl text-sm font-medium text-text transition-all flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <CheckCircle2 className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
