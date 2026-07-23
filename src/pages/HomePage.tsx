import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Sparkles, ArrowRight, Activity, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchCheckinHistoryService } from "@/services/checkinService";
import type { CheckinHistoryItem } from "@/types";

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [recentHistory, setRecentHistory] = useState<CheckinHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCheckinHistoryService()
      .then((data) => setRecentHistory(data.slice(0, 2)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-text">
          {t("welcomeBack")}, {user?.name || "Friend"}! 👋
        </h1>
        <p className="text-text-muted text-base">
          Check your health symptoms or review your previous check-ins below.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-surface to-surface border-2 border-primary/20 p-8 space-y-6 shadow-md rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> AI Health Assistant
            </span>
            <h2 className="text-2xl font-bold text-text">
              How are you feeling right now?
            </h2>
            <p className="text-text-muted text-base max-w-xl">
              Describe your symptoms in English or हिन्दी. Takes only 2 minutes to evaluate your condition and guide your next step.
            </p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-primary/15 items-center justify-center text-primary shrink-0">
            <Activity className="w-8 h-8" />
          </div>
        </div>

        <div>
          <Link to="/checkin">
            <Button size="lg" fullWidth variant="primary" className="sm:w-auto text-lg py-4 px-8 shadow-md">
              <Sparkles className="w-5 h-5 mr-2" />
              {t("startCheckin")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Check-ins
          </h2>
          <Link to="/history" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All History <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Card className="p-6 text-center text-text-muted">Loading recent history...</Card>
        ) : recentHistory.length === 0 ? (
          <Card className="p-6 text-center text-text-muted">
            No previous check-ins found. Click above to complete your first symptom check!
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recentHistory.map((item) => (
              <Card key={item.id} className="p-5 hover:border-primary/30 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium">{item.date}</span>
                  <Badge tone={item.triageLevel} />
                </div>
                <h3 className="text-base font-semibold text-text">{item.primarySymptom}</h3>
                <p className="text-sm text-text-muted">{item.statusText}</p>
                <Link
                  to={`/results/${item.id}`}
                  className="inline-block text-xs font-semibold text-primary hover:underline pt-1"
                >
                  View Details & Summary &rarr;
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
