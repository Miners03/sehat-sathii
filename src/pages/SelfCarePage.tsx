import React, { useState, useEffect } from "react";
import { HeartHandshake, Flame, Moon, Zap, Play, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SELF_CARE_EXERCISES, type SelfCareExercise } from "@/constants/selfCare";
import { getLatestMood } from "@/services/moodService";
import { getLatestAssessment } from "@/services/assessmentService";
import { useAuth } from "@/context/AuthContext";

export const SelfCarePage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest_user";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeExercise, setActiveExercise] = useState<SelfCareExercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [recommendedCategory, setRecommendedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function determineRecommendation() {
      const mood = await getLatestMood(userId);
      const asm = await getLatestAssessment(userId);

      if (asm?.wellness_signal === "reach_out" || (mood && mood.anxiety >= 4)) {
        setRecommendedCategory("anxiety");
      } else if (mood && mood.stress >= 4) {
        setRecommendedCategory("stress");
      } else if (mood && mood.sleep <= 5) {
        setRecommendedCategory("sleep");
      } else if (mood && mood.motivation <= 2) {
        setRecommendedCategory("motivation");
      } else {
        setRecommendedCategory("anxiety");
      }
    }
    determineRecommendation();
  }, [userId]);

  const filteredExercises =
    activeCategory === "all"
      ? SELF_CARE_EXERCISES
      : SELF_CARE_EXERCISES.filter((e) => e.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Self-Care & Grounding Library</h1>
            <p className="text-sm text-text-muted">Personalized micro-habits tailored to your emotional check-ins</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {["all", "anxiety", "stress", "sleep", "motivation"].map((cat) => {
          const isRecommended = recommendedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface text-text-muted hover:text-text border border-text-muted/15"
              }`}
            >
              {cat === "all" ? "All Exercises" : cat}
              {isRecommended && cat !== "all" && (
                <span className="px-1.5 py-0.5 bg-accent text-text text-[10px] font-extrabold rounded-full">
                  Recommended
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Exercise Detail Modal / Card */}
      {activeExercise && (
        <Card className="p-6 bg-surface border-2 border-primary rounded-3xl shadow-lg space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">{activeExercise.category}</span>
              <h2 className="text-xl font-bold text-text">{activeExercise.title}</h2>
            </div>
            <Badge tone="steady">{activeExercise.duration}</Badge>
          </div>

          <p className="text-sm text-text-muted">{activeExercise.description}</p>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-text">Guided Steps:</h3>
            <ol className="space-y-2 list-decimal list-inside text-sm text-text">
              {activeExercise.steps.map((step, idx) => (
                <li key={idx} className="p-3 bg-bg rounded-xl border border-text-muted/10">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActiveExercise(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setCompletedExercises((prev) => [...prev, activeExercise.id]);
                setActiveExercise(null);
              }}
            >
              <CheckCircle2 className="w-5 h-5 mr-1" /> Mark Done
            </Button>
          </div>
        </Card>
      )}

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map((exercise) => {
          const isDone = completedExercises.includes(exercise.id);
          const isRec = recommendedCategory === exercise.category;

          return (
            <Card
              key={exercise.id}
              className={`p-6 bg-surface border transition-all text-left space-y-4 flex flex-col justify-between ${
                isRec ? "border-primary/40 shadow-sm" : "border-text-muted/15"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{exercise.category}</span>
                  <Badge tone={isDone ? "steady" : "neutral"}>
                    {isDone ? "Completed" : exercise.duration}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-text">{exercise.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{exercise.description}</p>
              </div>

              <Button
                variant={isRec ? "primary" : "secondary"}
                onClick={() => setActiveExercise(exercise)}
                fullWidth
              >
                <Play className="w-4 h-4 mr-2" /> Start Exercise
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
