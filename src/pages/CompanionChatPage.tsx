import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, MicOff, Volume2, Sparkles, ClipboardList, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CrisisHelplineBanner } from "@/components/feature/CrisisHelplineBanner";
import { ConversationalAssessmentFlow } from "@/components/feature/ConversationalAssessmentFlow";
import { createNewSession, sendUserMessage } from "@/services/companionService";
import { isSpeechRecognitionSupported, startSpeechRecognition, speakText } from "@/services/speechService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import type { CompanionSession, AssessmentResponse } from "@/types";

export const CompanionChatPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const userId = user?.id || "guest_user";

  const [session, setSession] = useState<CompanionSession | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speechSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    async function initSession() {
      const s = await createNewSession(userId);
      setSession(s);
    }
    initSession();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.transcript, showAssessment]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !session || loading) return;

    setInputText("");
    setLoading(true);

    try {
      const res = await sendUserMessage(session, text);
      setSession(res.updatedSession);
      if (res.crisisDetected) {
        setCrisisActive(true);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current = startSpeechRecognition(
        (recognizedText) => {
          setInputText((prev) => (prev ? prev + " " + recognizedText : recognizedText));
          setIsListening(false);
        },
        () => setIsListening(false),
        language
      );
    }
  };

  const handleAssessmentComplete = async (assessmentResult: AssessmentResponse, crisisTriggered: boolean) => {
    setShowAssessment(false);
    if (crisisTriggered || assessmentResult.wellness_signal === "reach_out") {
      setCrisisActive(true);
    }
    if (session) {
      const summaryMsg = `I completed the ${assessmentResult.instrument.toUpperCase()} assessment. Result signal: ${assessmentResult.wellness_signal}.`;
      await handleSend(summaryMsg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-text-muted/15 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">AI Companion Chat</h1>
            <p className="text-xs text-text-muted">Safe, private, empathetic mental health conversation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAssessment(!showAssessment)}
            className="text-xs font-semibold"
          >
            <ClipboardList className="w-4 h-4 mr-1 text-primary" />
            {showAssessment ? "Close Assessment" : "Take Assessment"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCrisisActive(!crisisActive)}
            className="text-xs font-semibold text-reach-out border-reach-out/30"
          >
            <ShieldAlert className="w-4 h-4 mr-1 text-reach-out" />
            {crisisActive ? "Hide Helpline" : "KIRAN Helpline"}
          </Button>
        </div>
      </div>

      {/* Persistent Crisis Helpline Banner if active */}
      {crisisActive && (
        <CrisisHelplineBanner
          pinned={true}
          message="If you or someone you know is in severe emotional distress, support is available immediately."
        />
      )}

      {/* Inline Assessment Flow */}
      {showAssessment && (
        <ConversationalAssessmentFlow
          onComplete={handleAssessmentComplete}
          onCancel={() => setShowAssessment(false)}
        />
      )}

      {/* Chat Messages Surface */}
      <Card className="p-4 sm:p-6 min-h-[450px] max-h-[550px] overflow-y-auto flex flex-col justify-between space-y-4 bg-surface border border-text-muted/15 shadow-sm">
        <div className="space-y-4">
          {session?.transcript.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.sender === "user"
                    ? "bg-accent text-text"
                    : "bg-primary text-white"
                }`}
              >
                {msg.sender === "user" ? "You" : "AI"}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-base font-sans leading-relaxed shadow-xs ${
                  msg.sender === "user"
                    ? "bg-accent/20 text-text rounded-tr-none"
                    : "bg-bg border border-text-muted/15 text-text rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sender === "companion" && (
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => speakText(msg.text, language)}
                      className="text-text-muted hover:text-primary p-1 rounded-lg"
                      aria-label="Listen to message"
                      title="Listen to message"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-text-muted/15 flex items-center gap-2"
        >
          {speechSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              className={`p-3 rounded-xl border transition-all ${
                isListening
                  ? "bg-reach-out text-white border-reach-out animate-pulse"
                  : "bg-bg text-text-muted hover:text-primary border-text-muted/20"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <div className="flex-1">
            <Input
              placeholder={isListening ? "Listening..." : "Type how you're feeling today..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading || !inputText.trim()} size="lg">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
};
