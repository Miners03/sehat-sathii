import React, { useState, useEffect } from "react";
import { BookOpen, Mic, MicOff, Sparkles, Heart, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CrisisHelplineBanner } from "@/components/feature/CrisisHelplineBanner";
import { processAndSaveJournal, getJournalHistory } from "@/services/journalService";
import { isSpeechRecognitionSupported, startSpeechRecognition } from "@/services/speechService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { JournalEntry } from "@/types";

export const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const userId = user?.id || "guest_user";

  const [mode, setMode] = useState<"text" | "voice">("text");
  const [content, setContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestSaved, setLatestSaved] = useState<{ entry: JournalEntry; reflectionPrompt: string } | null>(null);
  const [crisisActive, setCrisisActive] = useState(false);
  const [history, setHistory] = useState<JournalEntry[]>([]);

  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    async function loadHistory() {
      const list = await getJournalHistory(userId);
      setHistory(list);
    }
    loadHistory();
  }, [userId]);

  const toggleSpeech = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      startSpeechRecognition(
        (text) => {
          setContent((prev) => (prev ? prev + " " + text : text));
          setIsListening(false);
        },
        () => setIsListening(false),
        language
      );
    }
  };

  const handleSave = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const res = await processAndSaveJournal(userId, mode, content);
      setLatestSaved({ entry: res.entry, reflectionPrompt: res.reflectionPrompt });
      if (res.crisisTriggered) {
        setCrisisActive(true);
      }
      setContent("");
      const updatedList = await getJournalHistory(userId);
      setHistory(updatedList);
    } catch (err) {
      console.error("Journal save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-3xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center font-bold">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">AI Mental Health Journal</h1>
            <p className="text-sm text-text-muted">Express freely in text or voice — with instant emotion synthesis</p>
          </div>
        </div>
      </div>

      {crisisActive && (
        <CrisisHelplineBanner
          pinned={true}
          message="Your journal entry expressed heavy distress. Immediate support is available to walk with you."
        />
      )}

      {/* Write / Speak Entry */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "text" ? "bg-primary text-white" : "bg-bg text-text-muted hover:text-text"
              }`}
            >
              Text Entry
            </button>
            <button
              type="button"
              onClick={() => setMode("voice")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === "voice" ? "bg-primary text-white" : "bg-bg text-text-muted hover:text-text"
              }`}
            >
              Voice Entry
            </button>
          </div>
          {speechSupported && mode === "voice" && (
            <button
              type="button"
              onClick={toggleSpeech}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                isListening ? "bg-reach-out text-white animate-pulse" : "bg-bg text-primary border border-primary/30"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isListening ? "Listening..." : "Tap to Speak"}
            </button>
          )}
        </div>

        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            mode === "voice"
              ? "Tap 'Tap to Speak' or type here to express your thoughts..."
              : "How are you feeling today? Write whatever comes to mind..."
          }
          className="w-full p-4 bg-bg border border-text-muted/20 rounded-2xl font-sans text-base text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading || !content.trim()} size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Save & Synthesize AI Emotion
          </Button>
        </div>
      </Card>

      {/* AI Emotion Analysis Result */}
      {latestSaved && (
        <Card className="p-6 bg-surface border border-primary/30 shadow-md space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-steady" />
              <h3 className="text-lg font-bold text-text">Journal Entry Saved</h3>
            </div>
            <Badge
              tone={
                latestSaved.entry.sentiment === "positive"
                  ? "steady"
                  : latestSaved.entry.sentiment === "negative"
                  ? "notice"
                  : "neutral"
              }
            >
              {latestSaved.entry.detected_emotion}
            </Badge>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">AI Summary</span>
            <p className="text-sm text-text-muted">{latestSaved.entry.ai_summary}</p>
          </div>

          <div className="p-4 bg-bg rounded-2xl border border-accent/20 flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-text block">Reflection Prompt for Next Time</span>
              <p className="text-sm text-text-muted italic pt-0.5">"{latestSaved.reflectionPrompt}"</p>
            </div>
          </div>
        </Card>
      )}

      {/* Past Entries Log */}
      <Card className="p-6 bg-surface border border-text-muted/15 shadow-sm space-y-4 text-left">
        <h3 className="text-lg font-bold text-text">Past Journal Entries</h3>
        {history.length === 0 ? (
          <p className="text-sm text-text-muted">No journal entries recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div key={entry.id} className="p-4 bg-bg rounded-2xl border border-text-muted/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>
                    {new Date(entry.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" • "}
                    <span className="uppercase font-semibold">{entry.mode}</span>
                  </span>
                  <Badge
                    tone={
                      entry.sentiment === "positive"
                        ? "steady"
                        : entry.sentiment === "negative"
                        ? "notice"
                        : "neutral"
                    }
                  >
                    {entry.detected_emotion}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-text line-clamp-2">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
