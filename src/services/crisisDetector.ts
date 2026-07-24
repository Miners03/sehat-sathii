export interface CrisisDetectionResult {
  isCrisis: boolean;
  reason?: string;
  triggeredKeyword?: string;
}

// Deterministic keywords and regex patterns in English, Hindi, Hinglish, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi
const CRISIS_PATTERNS: RegExp[] = [
  // English
  /\b(suicide|suicidal|kill\s*my\s*self|end\s*my\s*life|want\s*to\s*die|harm\s*my\s*self|self\s*harm|no\s*reason\s*to\s*live|hopeless|cannot\s*go\s*on|give\s*up\s*on\s*life|better\s*off\s*dead)\b/i,
  // Hindi / Hinglish / Devanagari
  /(खुदकुशी|आत्महत्या|जान\s*देना|मर्\s*जाना|जीने\s*का\s*मन|mar\s*jana|khudkushi|aatmahathya|marna\s*chah|zindagi\s*khatam)/i,
  // Regional script triggers
  /(ਆਤਮਹੱਤਿਆ|ਮਰਨਾ|આત્મહત્યા|આપઘાત|ஆatmா|தற்கொலை|ஆத்மஹத்யா|తొలగించు|ఆత్మహత్య|আত্মহত্যা|মরতে)/i,
];

/**
 * Checks text against deterministic crisis patterns.
 * @param text Content from Chat, Journal, or Assessment free-text
 * @returns CrisisDetectionResult
 */
export function detectCrisis(text: string): CrisisDetectionResult {
  if (!text || typeof text !== "string") {
    return { isCrisis: false };
  }

  const normalized = text.toLowerCase().trim();

  for (const pattern of CRISIS_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) {
      return {
        isCrisis: true,
        reason: "Detected expression of severe distress or self-harm intent",
        triggeredKeyword: match[0],
      };
    }
  }

  return { isCrisis: false };
}

/**
 * Specifically checks PHQ-9 item 9 (Thoughts that you would be better off dead, or of hurting yourself in some way).
 * Any score > 0 (Several days, More than half the days, Nearly every day) triggers crisis pathway.
 * @param item9Score score for item 9 (0 to 3)
 */
export function checkPHQ9Item9Crisis(item9Score: number): CrisisDetectionResult {
  if (item9Score > 0) {
    return {
      isCrisis: true,
      reason: "PHQ-9 Item 9 flagged self-harm thoughts",
      triggeredKeyword: "PHQ-9 Item 9",
    };
  }
  return { isCrisis: false };
}
