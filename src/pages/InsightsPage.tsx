import React, { useState, useEffect } from "react";
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CrisisHelplineBanner } from "@/components/feature/CrisisHelplineBanner";
import { getLatestAssessment, getAssessmentHistory } from "@/services/assessmentService";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import type { AssessmentResponse, WellnessSignal } from "@/types";

export const InsightsPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest_user";
  const navigate = useNavigate();

  const [latestAssessment, setLatestAssessment] = useState<AssessmentResponse | null>(null);
  const [history, setHistory] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const latest = await getLatestAssessment(userId);
        const list = await getAssessmentHistory(userId);
        setLatestAssessment(latest);
        setHistory(list);
      } catch (err) {
        console.error("Failed to load assessment insights", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const getFramingText = (signal: WellnessSignal) => {
    switch (signal) {
      case "steady":
        return {
          headline: "Balanced & Grounded",
          body: "You're feeling grounded and emotionally stable right now. Continuing your daily self-care routines and mindfulness can keep you feeling centered.",
          recommendation: "Keep up with your regular sleep hygiene and supportive habits.",
        };
      case "notice":
        return {
          headline: "Gentle Care & Reflection Needed",
          body: "You may be experiencing some mild stress, worry, or emotional weight. Taking small breaks, practicing box breathing, and journaling can offer great relief.",
          recommendation: "Try a 2-minute grounding exercise from your Self-Care Library.",
        };
      case "reach_out":
        return {
          headline: "Extra Warm Support Needed",
          body: "You are navigating a heavy or overwhelming moment right now. Connecting with someone you trust or talking with a supportive counsellor can provide safe, comforting guidance.",
          recommendation: "Reach out to a trusted loved one or connect with the KIRAN Helpline below.",
        };
    }
  };

  const signal = latestAssessment?.wellness_signal || "steady";
  const framing = getFramingText(signal);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Emotional Insights</h1>
            <p className="text-sm text-text-muted">Empathetic, supportive summary of your recent assessments</p>
          </div>
        </div>
        <Button onClick={() => navigate("/chat")} size="md">
          Talk in Companion Chat <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Main Signal Card */}
      <Card className="p-6 sm:p-8 bg-surface border border-text-muted/15 shadow-sm space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text-muted/10 pb-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-text-muted">Current Wellness Signal</span>
          </div>
          <Badge tone={signal} className="text-base px-4 py-1.5" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-text">{framing.headline}</h2>
          <p className="text-base text-text-muted leading-relaxed">{framing.body}</p>
        </div>

        <div className="p-4 bg-bg rounded-2xl border border-text-muted/15 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block">Gentle Recommendation</span>
            <p className="text-sm text-text font-medium pt-0.5">{framing.recommendation}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate("/self-care")} fullWidth>
            Explore Self-Care Exercises
          </Button>
          <Button variant="primary" onClick={() => navigate("/dashboard")} fullWidth>
            View Mood Dashboard
          </Button>
        </div>
      </Card>

      {/* Surface Crisis Helpline if signal is reach_out */}
      {signal === "reach_out" && (
        <CrisisHelplineBanner
          pinned={false}
          message="Your latest assessment indicates you might be carrying a heavy burden right now. Please consider connecting with immediate support."
        />
      )}

      {/* History Log */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-4 text-left">
        <h3 className="text-lg font-bold text-text">Assessment History</h3>
        {loading ? (
          <p className="text-sm text-text-muted">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-text-muted">No prior assessments recorded yet. You can complete one in Companion Chat.</p>
        ) : (
          <div className="divide-y divide-text-muted/10">
            {history.map((asm) => (
              <div key={asm.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-text uppercase tracking-wide">{asm.instrument} Assessment</span>
                  <span className="text-xs text-text-muted block">
                    {new Date(asm.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <Badge tone={asm.wellness_signal} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
