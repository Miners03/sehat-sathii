// Web Speech API helper wrapper with fallback handling

export interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as SpeechRecognitionWindow;
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

export function startSpeechRecognition(
  onResult: (text: string) => void,
  onError?: (err: any) => void,
  lang: string = "en-IN"
): { stop: () => void } | null {
  if (!isSpeechRecognitionSupported()) return null;

  const win = window as SpeechRecognitionWindow;
  const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

  recognition.onresult = (event: any) => {
    const transcript = event.results[0]?.[0]?.transcript || "";
    if (transcript) {
      onResult(transcript);
    }
  };

  if (onError) {
    recognition.onerror = (err: any) => onError(err);
  }

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    },
  };
}

export function speakText(text: string, lang: string = "en"): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Warm, gentle pace
    utterance.pitch = 1.0;
    utterance.lang = lang === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis unavailable", e);
  }
}
