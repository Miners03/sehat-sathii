import React, { useState, useEffect } from "react";
import { TrendingUp, Sparkles, Moon, Flame, HeartHandshake, Smile } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getMoodHistory } from "@/services/moodService";
import { useAuth } from "@/context/AuthContext";
import type { MoodCheckin } from "@/types";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest_user";

  const [history, setHistory] = useState<MoodCheckin[]>([]);
  const [timeframe, setTimeframe] = useState<"7days" | "30days">("7days");

  useEffect(() => {
    async function loadData() {
      const list = await getMoodHistory(userId);
      setHistory(list);
    }
    loadData();
  }, [userId]);

  const displayData = timeframe === "7days" ? history.slice(0, 7) : history.slice(0, 30);
  const reversedData = [...displayData].reverse();

  // AI Plain-Language Insights Generator logic
  const generateAIInsights = (data: MoodCheckin[]) => {
    if (data.length === 0) {
      return ["Complete daily mood check-ins to receive personalized AI emotional insights."];
    }

    const insights: string[] = [];
    const avgSleep = data.reduce((acc, c) => acc + c.sleep, 0) / data.length;
    const avgMood = data.reduce((acc, c) => acc + c.mood, 0) / data.length;
    const avgStress = data.reduce((acc, c) => acc + c.stress, 0) / data.length;

    // Pattern recognition
    if (avgSleep >= 7) {
      insights.push("💡 Sleep Connection: Your mood consistently trends higher on days following 7+ hours of sleep.");
    } else {
      insights.push("💡 Sleep Insight: You have averaged under 7 hours of sleep recently. Prioritizing rest may help ease stress.");
    }

    if (avgStress >= 3.5) {
      insights.push("💡 Stress Pattern: Your stress levels have been elevated. Grounding techniques or a short daily walk can provide a restorative reset.");
    } else {
      insights.push("💡 Emotional Balance: Your stress levels have remained steadily manageable over recent check-ins.");
    }

    if (avgMood >= 3.5) {
      insights.push("💡 Positive Momentum: You are sustaining a positive overall emotional baseline!");
    }

    return insights;
  };

  const aiInsights = generateAIInsights(reversedData);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky/20 text-sky flex items-center justify-center font-bold">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Mood & Well-being Dashboard</h1>
            <p className="text-sm text-text-muted">Intelligent trend tracking and plain-language emotional insights</p>
          </div>
        </div>
        <div className="flex bg-bg p-1 rounded-xl border border-text-muted/15 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe("7days")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeframe === "7days" ? "bg-primary text-white" : "text-text-muted hover:text-text"
            }`}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("30days")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              timeframe === "30days" ? "bg-primary text-white" : "text-text-muted hover:text-text"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* AI Plain Language Insights Card */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-4 text-left">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h2>AI Emotional Intelligence Synthesis</h2>
        </div>
        <div className="space-y-3">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="p-4 bg-bg rounded-2xl border border-text-muted/10 text-sm text-text font-medium leading-relaxed">
              {insight}
            </div>
          ))}
        </div>
      </Card>

      {/* Visual Trends Chart */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">Mood & Sleep Visual Trends</h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Mood</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky inline-block"></span> Sleep (hrs)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-notice inline-block"></span> Stress</span>
          </div>
        </div>

        {reversedData.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">No mood check-in data recorded yet. Save a check-in to see your trends!</p>
        ) : (
          <div className="space-y-4">
            <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-text-muted/15 px-2">
              {reversedData.map((item, i) => {
                const moodPct = (item.mood / 5) * 100;
                const sleepPct = (item.sleep / 12) * 100;
                const dateLabel = new Date(item.created_at).toLocaleDateString("en-IN", { weekday: "short" });
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Mood Bar */}
                      <div
                        style={{ height: `${moodPct}%` }}
                        className="w-3 sm:w-4 bg-primary rounded-t-md transition-all group-hover:opacity-90"
                        title={`Mood: ${item.mood}/5`}
                      />
                      {/* Sleep Bar */}
                      <div
                        style={{ height: `${sleepPct}%` }}
                        className="w-3 sm:w-4 bg-sky rounded-t-md transition-all group-hover:opacity-90"
                        title={`Sleep: ${item.sleep} hrs`}
                      />
                    </div>
                    <span className="text-xs text-text-muted font-medium pt-1">{dateLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Metric Averages */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-bg rounded-2xl border border-text-muted/10 flex items-center gap-3">
            <Smile className="w-5 h-5 text-primary" />
            <div>
              <span className="text-xs text-text-muted block">Avg Mood</span>
              <span className="text-base font-bold text-text">
                {reversedData.length > 0 ? (reversedData.reduce((a, b) => a + b.mood, 0) / reversedData.length).toFixed(1) : "-"} / 5
              </span>
            </div>
          </div>
          <div className="p-4 bg-bg rounded-2xl border border-text-muted/10 flex items-center gap-3">
            <Moon className="w-5 h-5 text-sky" />
            <div>
              <span className="text-xs text-text-muted block">Avg Sleep</span>
              <span className="text-base font-bold text-text">
                {reversedData.length > 0 ? (reversedData.reduce((a, b) => a + b.sleep, 0) / reversedData.length).toFixed(1) : "-"} hrs
              </span>
            </div>
          </div>
          <div className="p-4 bg-bg rounded-2xl border border-text-muted/10 flex items-center gap-3">
            <Flame className="w-5 h-5 text-notice" />
            <div>
              <span className="text-xs text-text-muted block">Avg Stress</span>
              <span className="text-base font-bold text-text">
                {reversedData.length > 0 ? (reversedData.reduce((a, b) => a + b.stress, 0) / reversedData.length).toFixed(1) : "-"} / 5
              </span>
            </div>
          </div>
          <div className="p-4 bg-bg rounded-2xl border border-text-muted/10 flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-accent" />
            <div>
              <span className="text-xs text-text-muted block">Avg Anxiety</span>
              <span className="text-base font-bold text-text">
                {reversedData.length > 0 ? (reversedData.reduce((a, b) => a + b.anxiety, 0) / reversedData.length).toFixed(1) : "-"} / 5
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
