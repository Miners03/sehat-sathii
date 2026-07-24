import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MessageCircle, Compass, BarChart3, BookOpen, HeartHandshake, Sparkles, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DailyMoodCheckinCard } from "@/components/feature/DailyMoodCheckinCard";
import { CrisisHelplineBanner } from "@/components/feature/CrisisHelplineBanner";
import { getLatestMood } from "@/services/moodService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { MoodCheckin } from "@/types";

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const userId = user?.id || "guest_user";
  const navigate = useNavigate();

  const [latestCheckin, setLatestCheckin] = useState<MoodCheckin | null>(null);

  useEffect(() => {
    async function loadLatest() {
      const checkin = await getLatestMood(userId);
      setLatestCheckin(checkin);
    }
    loadLatest();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Welcome Banner */}
      <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-text-muted/15 shadow-sm text-left relative overflow-hidden">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> AI Mental Health Companion
          </div>
          <h1 className="text-3xl font-extrabold text-text">
            Welcome back to SehatSaathi
          </h1>
          <p className="text-base text-text-muted leading-relaxed">
            Your safe, private space for empathetic AI conversation, mood tracking, guided assessments, and voice journaling.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/chat")} size="lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Open Companion Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Action: Daily Mood Check-In */}
      <DailyMoodCheckinCard
        alreadyDoneToday={latestCheckin}
        onCheckinSaved={(newCheckin) => setLatestCheckin(newCheckin)}
      />

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
        <Card
          onClick={() => navigate("/chat")}
          className="p-5 bg-surface hover:bg-bg border border-text-muted/15 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">Companion Chat</h2>
            <p className="text-xs text-text-muted">Empathetic voice & text conversation whenever you need to talk</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/insights")}
          className="p-5 bg-surface hover:bg-bg border border-text-muted/15 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">Emotional Insights</h2>
            <p className="text-xs text-text-muted">Non-clinical, plain-language evaluation & wellness signals</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/dashboard")}
          className="p-5 bg-surface hover:bg-bg border border-text-muted/15 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky/20 text-sky flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">Mood Dashboard</h2>
            <p className="text-xs text-text-muted">Daily visual trends & AI pattern synthesis from sleep and mood</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/journal")}
          className="p-5 bg-surface hover:bg-bg border border-text-muted/15 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">AI Voice Journal</h2>
            <p className="text-xs text-text-muted">Speech-to-text reflections with emotion detection & prompts</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/self-care")}
          className="p-5 bg-surface hover:bg-bg border border-text-muted/15 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">Self-Care Library</h2>
            <p className="text-xs text-text-muted">Box breathing, 5-4-3-2-1 grounding, and sleep relaxation</p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/settings")}
          className="p-5 bg-surface hover:bg-bg border border-reach-out/30 shadow-sm cursor-pointer transition-all hover:scale-[1.02] space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-reach-out/15 text-reach-out flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-text">24/7 KIRAN Helpline</h2>
            <p className="text-xs text-text-muted">Toll-free Govt helpline (1800-599-0019) always 1 tap away</p>
          </div>
        </Card>
      </div>

      {/* Quick Helpline Section */}
      <CrisisHelplineBanner pinned={false} />
    </div>
  );
};
