export interface SelfCareExercise {
  id: string;
  category: "stress" | "anxiety" | "motivation" | "sleep";
  title: string;
  duration: string;
  description: string;
  steps: string[];
}

export const SELF_CARE_EXERCISES: SelfCareExercise[] = [
  {
    id: "box_breathing",
    category: "anxiety",
    title: "Box Breathing (4-4-4-4)",
    duration: "2 mins",
    description: "A calming breathing rhythm used to calm your nervous system instantly.",
    steps: [
      "Inhale deeply through your nose for 4 seconds.",
      "Hold your breath for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Pause and hold for 4 seconds before the next breath.",
    ],
  },
  {
    id: "grounding_54321",
    category: "anxiety",
    title: "5-4-3-2-1 Grounding Technique",
    duration: "3 mins",
    description: "Bring your awareness back to the present moment using your 5 senses.",
    steps: [
      "Acknowledge 5 things you can see around you.",
      "Acknowledge 4 things you can physically touch.",
      "Acknowledge 3 things you can hear.",
      "Acknowledge 2 things you can smell.",
      "Acknowledge 1 thing you can taste or feel grateful for.",
    ],
  },
  {
    id: "mindful_walk",
    category: "stress",
    title: "5-Minute Mindful Stroll",
    duration: "5 mins",
    description: "Step away from screens and gently observe your surroundings.",
    steps: [
      "Stand up and stretch your shoulders gently.",
      "Take slow, deliberate steps while noticing the feeling of your feet touching the ground.",
      "Feel the air against your skin and focus purely on movement.",
    ],
  },
  {
    id: "micro_goal",
    category: "motivation",
    title: "Tiny 1-Minute Goal",
    duration: "1 min",
    description: "Break inertia by completing one tiny, low-pressure micro-task.",
    steps: [
      "Pick a tiny action: drink a glass of water, tidy your desk, or stretch your legs.",
      "Perform that single action without worrying about what comes after.",
      "Celebrate yourself for taking that single step!",
    ],
  },
  {
    id: "sleep_winddown",
    category: "sleep",
    title: "Bedtime Progressive Relaxation",
    duration: "4 mins",
    description: "Systematically release muscle tension before going to sleep.",
    steps: [
      "Lie down comfortably and close your eyes.",
      "Tense your feet for 5 seconds, then completely release.",
      "Move up to your calves, thighs, shoulders, and jaw, releasing tension sequentially.",
      "Take 3 deep, quiet breaths into your belly.",
    ],
  },
];
