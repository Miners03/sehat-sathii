import React, { useState } from "react";
import { Smile, Zap, Moon, Flame, HeartHandshake, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { saveMoodCheckin } from "@/services/moodService";
import { useAuth } from "@/context/AuthContext";
import type { MoodCheckin } from "@/types";

interface DailyMoodCheckinCardProps {
  onCheckinSaved?: (checkin: MoodCheckin) => void;
  alreadyDoneToday?: MoodCheckin | null;
}

const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Low" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😊", label: "Great" },
  { value: 5, emoji: "😁", label: "Joyful" },
];

export const DailyMoodCheckinCard: React.FC<DailyMoodCheckinCardProps> = ({
  onCheckinSaved,
  alreadyDoneToday,
}) => {
  const { user } = useAuth();
  const userId = user?.id || "guest_user";

  const [mood, setMood] = useState<number>(alreadyDoneToday?.mood || 3);
  const [stress, setStress] = useState<number>(alreadyDoneToday?.stress || 2);
  const [anxiety, setAnxiety] = useState<number>(alreadyDoneToday?.anxiety || 2);
  const [sleep, setSleep] = useState<number>(alreadyDoneToday?.sleep || 7);
  const [energy, setEnergy] = useState<number>(alreadyDoneToday?.energy || 3);
  const [motivation, setMotivation] = useState<number>(alreadyDoneToday?.motivation || 3);

  const [saved, setSaved] = useState<boolean>(Boolean(alreadyDoneToday));
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await saveMoodCheckin(
        userId,
        mood,
        stress,
        anxiety,
        sleep,
        energy,
        motivation
      );
      setSaved(true);
      if (onCheckinSaved) {
        onCheckinSaved(result);
      }
    } catch (err) {
      console.error("Failed to save checkin", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-bold">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Daily Mood Check-In</h2>
            <p className="text-sm text-text-muted">Take a minute to tune into how you're feeling right now</p>
          </div>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-steady/15 text-steady text-xs font-semibold rounded-full">
            <CheckCircle className="w-4 h-4" /> Logged Today
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-text flex items-center gap-2">
            <Smile className="w-4 h-4 text-primary" /> Overall Mood
          </label>
          <div className="grid grid-cols-5 gap-2">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setMood(opt.value);
                  setSaved(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                  mood === opt.value
                    ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
                    : "border-text-muted/15 bg-bg hover:bg-surface"
                }`}
              >
                <span className="text-2xl mb-1">{opt.emoji}</span>
                <span className="text-xs font-medium text-text">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Stress Slider */}
          <div className="space-y-2 bg-bg/50 p-4 rounded-2xl border border-text-muted/10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-notice" /> Stress Level
              </span>
              <span className="font-bold text-notice">{stress} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={stress}
              onChange={(e) => {
                setStress(Number(e.target.value));
                setSaved(false);
              }}
              className="w-full accent-notice cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Calm (1)</span>
              <span>High (5)</span>
            </div>
          </div>

          {/* Anxiety Slider */}
          <div className="space-y-2 bg-bg/50 p-4 rounded-2xl border border-text-muted/10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-accent" /> Anxiety Level
              </span>
              <span className="font-bold text-accent">{anxiety} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={anxiety}
              onChange={(e) => {
                setAnxiety(Number(e.target.value));
                setSaved(false);
              }}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Relaxed (1)</span>
              <span>Severe (5)</span>
            </div>
          </div>

          {/* Sleep Hours Slider */}
          <div className="space-y-2 bg-bg/50 p-4 rounded-2xl border border-text-muted/10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-sky" /> Sleep Duration
              </span>
              <span className="font-bold text-sky">{sleep} hrs</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={sleep}
              onChange={(e) => {
                setSleep(Number(e.target.value));
                setSaved(false);
              }}
              className="w-full accent-sky cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>1 hr</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Energy & Motivation */}
          <div className="space-y-2 bg-bg/50 p-4 rounded-2xl border border-text-muted/10">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" /> Energy & Motivation
              </span>
              <span className="font-bold text-primary">Energy {energy} / Motiv {motivation}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <span className="text-xs text-text-muted">Energy</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energy}
                  onChange={(e) => {
                    setEnergy(Number(e.target.value));
                    setSaved(false);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs text-text-muted">Motivation</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={motivation}
                  onChange={(e) => {
                    setMotivation(Number(e.target.value));
                    setSaved(false);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth disabled={loading} size="lg">
          {saved ? "Update Mood Check-In" : "Save Mood Check-In"}
        </Button>
      </form>
    </Card>
  );
};
