// Shared prompt bank for real-transcript corpus collection. Each house
// answers the SAME prompts at default settings (no style-steering) so the
// classifier learns register, not topic — see docs/SCOPE-v3.md §1D and the
// commit that introduced real transcripts for the rationale. Spans task
// types deliberately: explain / advise / argue / instruct / describe /
// compare / draft / reflect, so no single house's sample set skews toward
// one register-friendly task type.

export const PROMPT_BANK: string[] = [
  // explain
  "Explain how a credit score is actually calculated.",
  "Explain why a React useEffect can run twice in development mode.",
  "Explain how compound interest works to someone who's never invested before.",
  "Explain the difference between weather and climate.",
  // advise
  "Should I take a job with a longer commute but meaningfully higher pay?",
  "My upstairs neighbor is loud most nights. How should I handle it?",
  "I have $5,000 saved and a credit card balance. What should I do with it?",
  "Is it worth learning to cook at home versus mostly ordering in?",
  // argue / opinion
  "Is remote work actually better for productivity than working in an office?",
  "Are four-day work weeks a good idea for most companies?",
  "Should social media platforms be required to verify user identity?",
  "Is it better to rent or buy a home in your late twenties?",
  // instruct / how-to
  "How do I make a basic sourdough starter from scratch?",
  "Walk me through setting up a monthly budget for the first time.",
  "How should I prepare for a job interview with only two days' notice?",
  "What's the right way to jump-start a car battery?",
  // describe / creative
  "Write a short paragraph describing an abandoned lighthouse on a cold morning.",
  "Describe what a busy Saturday market feels like in a few sentences.",
  "Write a short scene of two old friends meeting again after ten years.",
  "Describe the atmosphere of a small town the week before a storm hits.",
  // compare
  "What's the real difference between a resume and a CV?",
  "Compare electric cars and gasoline cars for someone buying their first car.",
  // reflect / open-ended
  "What actually makes a new habit stick long-term?",
  "Why do some friendships fade even when nothing goes wrong?",
];
