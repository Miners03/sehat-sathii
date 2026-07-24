import type { AssessmentInstrument, WellnessSignal } from "@/types";

export interface AssessmentQuestion {
  id: number;
  text: string;
  options: { label: string; value: number }[];
}

export interface InstrumentDefinition {
  id: AssessmentInstrument;
  title: string;
  description: string;
  leadIn: string;
  questions: AssessmentQuestion[];
  evaluateSignal: (scores: number[]) => WellnessSignal;
}

const PHQ9_OPTIONS = [
  { label: "Not at all (0)", value: 0 },
  { label: "Several days (1)", value: 1 },
  { label: "More than half the days (2)", value: 2 },
  { label: "Nearly every day (3)", value: 3 },
];

export const ASSESSMENT_INSTRUMENTS: Record<AssessmentInstrument, InstrumentDefinition> = {
  phq9: {
    id: "phq9",
    title: "PHQ-9 Mood Assessment",
    description: "Standard 9-item questionnaire for understanding mood and distress levels.",
    leadIn: "Would it be alright if I asked a few questions to understand how you've been feeling over the last 2 weeks? There's no wrong answer here.",
    questions: [
      { id: 1, text: "Little interest or pleasure in doing things", options: PHQ9_OPTIONS },
      { id: 2, text: "Feeling down, depressed, or hopeless", options: PHQ9_OPTIONS },
      { id: 3, text: "Trouble falling or staying asleep, or sleeping too much", options: PHQ9_OPTIONS },
      { id: 4, text: "Feeling tired or having little energy", options: PHQ9_OPTIONS },
      { id: 5, text: "Poor appetite or overeating", options: PHQ9_OPTIONS },
      { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", options: PHQ9_OPTIONS },
      { id: 7, text: "Trouble concentrating on things, such as reading or watching television", options: PHQ9_OPTIONS },
      { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being fidgety or restless", options: PHQ9_OPTIONS },
      { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself in some way", options: PHQ9_OPTIONS },
    ],
    evaluateSignal: (scores: number[]): WellnessSignal => {
      // Rule: Item 9 > 0 forces reach_out!
      if (scores[8] && scores[8] > 0) {
        return "reach_out";
      }
      const total = scores.reduce((a, b) => a + b, 0);
      if (total <= 4) return "steady";
      if (total <= 14) return "notice";
      return "reach_out";
    },
  },
  gad7: {
    id: "gad7",
    title: "GAD-7 Anxiety Assessment",
    description: "Standard 7-item scale for understanding worry and tension.",
    leadIn: "Let's take a quick look at how worry or anxiety might have felt for you recently. Take your time.",
    questions: [
      { id: 1, text: "Feeling nervous, anxious, or on edge", options: PHQ9_OPTIONS },
      { id: 2, text: "Not being able to stop or control worrying", options: PHQ9_OPTIONS },
      { id: 3, text: "Worrying too much about different things", options: PHQ9_OPTIONS },
      { id: 4, text: "Trouble relaxing", options: PHQ9_OPTIONS },
      { id: 5, text: "Being so restless that it is hard to sit still", options: PHQ9_OPTIONS },
      { id: 6, text: "Becoming easily annoyed or irritable", options: PHQ9_OPTIONS },
      { id: 7, text: "Feeling afraid as if something awful might happen", options: PHQ9_OPTIONS },
    ],
    evaluateSignal: (scores: number[]): WellnessSignal => {
      const total = scores.reduce((a, b) => a + b, 0);
      if (total <= 4) return "steady";
      if (total <= 9) return "notice";
      return "reach_out";
    },
  },
  who5: {
    id: "who5",
    title: "WHO-5 Well-Being Index",
    description: "5-item index measuring positive psychological well-being.",
    leadIn: "I'd love to ask 5 short questions about your sense of vitality and cheerfulness over the last two weeks.",
    questions: [
      { id: 1, text: "I have felt cheerful and in good spirits", options: [
        { label: "All of the time (5)", value: 5 },
        { label: "Most of the time (4)", value: 4 },
        { label: "More than half (3)", value: 3 },
        { label: "Less than half (2)", value: 2 },
        { label: "Some of the time (1)", value: 1 },
        { label: "At no time (0)", value: 0 },
      ] },
      { id: 2, text: "I have felt calm and relaxed", options: [
        { label: "All of the time (5)", value: 5 },
        { label: "Most of the time (4)", value: 4 },
        { label: "More than half (3)", value: 3 },
        { label: "Less than half (2)", value: 2 },
        { label: "Some of the time (1)", value: 1 },
        { label: "At no time (0)", value: 0 },
      ] },
      { id: 3, text: "I have felt active and vigorous", options: [
        { label: "All of the time (5)", value: 5 },
        { label: "Most of the time (4)", value: 4 },
        { label: "More than half (3)", value: 3 },
        { label: "Less than half (2)", value: 2 },
        { label: "Some of the time (1)", value: 1 },
        { label: "At no time (0)", value: 0 },
      ] },
      { id: 4, text: "I woke up feeling fresh and rested", options: [
        { label: "All of the time (5)", value: 5 },
        { label: "Most of the time (4)", value: 4 },
        { label: "More than half (3)", value: 3 },
        { label: "Less than half (2)", value: 2 },
        { label: "Some of the time (1)", value: 1 },
        { label: "At no time (0)", value: 0 },
      ] },
      { id: 5, text: "My daily life has been filled with things that interest me", options: [
        { label: "All of the time (5)", value: 5 },
        { label: "Most of the time (4)", value: 4 },
        { label: "More than half (3)", value: 3 },
        { label: "Less than half (2)", value: 2 },
        { label: "Some of the time (1)", value: 1 },
        { label: "At no time (0)", value: 0 },
      ] },
    ],
    evaluateSignal: (scores: number[]): WellnessSignal => {
      const percentage = (scores.reduce((a, b) => a + b, 0) / 25) * 100;
      if (percentage >= 60) return "steady";
      if (percentage >= 40) return "notice";
      return "reach_out";
    },
  },
  rses: {
    id: "rses",
    title: "Rosenberg Self-Esteem Scale",
    description: "10-item scale evaluating global self-worth.",
    leadIn: "Here are a few questions regarding how you feel about yourself right now.",
    questions: [
      { id: 1, text: "On the whole, I am satisfied with myself", options: [{ label: "Strongly Agree (3)", value: 3 }, { label: "Agree (2)", value: 2 }, { label: "Disagree (1)", value: 1 }, { label: "Strongly Disagree (0)", value: 0 }] },
      { id: 2, text: "At times I think I am no good at all", options: [{ label: "Strongly Disagree (3)", value: 3 }, { label: "Disagree (2)", value: 2 }, { label: "Agree (1)", value: 1 }, { label: "Strongly Agree (0)", value: 0 }] },
      { id: 3, text: "I feel that I have a number of good qualities", options: [{ label: "Strongly Agree (3)", value: 3 }, { label: "Agree (2)", value: 2 }, { label: "Disagree (1)", value: 1 }, { label: "Strongly Disagree (0)", value: 0 }] },
      { id: 4, text: "I am able to do things as well as most other people", options: [{ label: "Strongly Agree (3)", value: 3 }, { label: "Agree (2)", value: 2 }, { label: "Disagree (1)", value: 1 }, { label: "Strongly Disagree (0)", value: 0 }] },
      { id: 5, text: "I feel I do not have much to be proud of", options: [{ label: "Strongly Disagree (3)", value: 3 }, { label: "Disagree (2)", value: 2 }, { label: "Agree (1)", value: 1 }, { label: "Strongly Agree (0)", value: 0 }] },
    ],
    evaluateSignal: (scores: number[]): WellnessSignal => {
      const total = scores.reduce((a, b) => a + b, 0);
      if (total >= 11) return "steady";
      if (total >= 7) return "notice";
      return "reach_out";
    },
  },
};
