import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Send, Mic, MicOff, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ChatMessage, TriageLevel } from "@/types";
import {
  startNewCheckinService,
  postChatMessageService,
  finishCheckinService,
} from "@/services/checkinService";

export const CheckinPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepCount, setStepCount] = useState(1);
  const [triageResult, setTriageResult] = useState<TriageLevel | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setSpeechSupported(isSupported);

    if (isSupported) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    startNewCheckinService().then((id) => {
      setSessionId(id);
      setMessages([
        {
          id: "m_init",
          sender: "bot",
          text: "नमस्ते! I am your SehatSaathi health assistant. Please describe what symptoms or health concerns you are experiencing today.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading || !sessionId) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await postChatMessageService(sessionId, userText, stepCount);
      setStepCount((prev) => prev + 1);

      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: "bot",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (res.triage_level) {
        setTriageResult(res.triage_level);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleCompleteCheckin = async () => {
    if (!sessionId) return;
    setLoading(true);
    const finalLevel: TriageLevel = triageResult || "self_care";
    const firstUserMsg = messages.find((m) => m.sender === "user")?.text || "General Symptom Check";

    await finishCheckinService(sessionId, firstUserMsg, finalLevel);
    navigate(`/results/${sessionId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-text-muted/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Symptom Check-in</h1>
          <p className="text-xs text-text-muted">Multi-turn triage evaluation</p>
        </div>
        {triageResult && (
          <Button onClick={handleCompleteCheckin} variant="primary" size="sm" className="shadow-sm">
            View Triage Results &rarr;
          </Button>
        )}
      </div>

      <Card className="h-[480px] flex flex-col p-4 bg-surface border border-text-muted/15 shadow-sm rounded-2xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isUser ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[78%] p-4 rounded-2xl space-y-1 ${
                    isUser
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-bg border border-text-muted/10 text-text rounded-tl-none"
                  }`}
                >
                  <p className="text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[11px] text-right ${
                      isUser ? "text-white/70" : "text-text-muted"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-text-muted text-sm italic">
              <Bot className="w-5 h-5 text-primary animate-pulse" />
              <span>Analyzing your response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {triageResult ? (
          <div className="pt-3 border-t border-text-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-bg/50 p-3 rounded-xl">
            <span className="text-sm font-medium text-text">
              Triage Assessment Completed!
            </span>
            <Button onClick={handleCompleteCheckin} variant="primary" size="md" className="w-full sm:w-auto">
              See Detailed Triage & Next Steps
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="pt-3 border-t border-text-muted/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... Speak now" : "Type symptoms here (or speak)..."}
              className="flex-1 text-base px-4 py-3 bg-bg border border-text-muted/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />

            {speechSupported && (
              <Button
                type="button"
                variant={isListening ? "ghost" : "secondary"}
                size="md"
                onClick={handleMicToggle}
                className={isListening ? "text-escalate animate-pulse border-escalate" : ""}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-primary" />}
              </Button>
            )}

            <Button type="submit" variant="primary" size="md" disabled={!input.trim() || loading}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
