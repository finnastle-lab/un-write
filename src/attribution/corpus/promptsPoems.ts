// Poem-specific prompt bank for corpus collection. Same shared-prompt
// principle as prompts.ts, but targeting a register the prose bank barely
// touches: pure creative/poetic writing. Motivated directly by a real gap
// found in testing — the real Gemini corpus (prose bank) skews toward
// structured technical/business answers, so its literary register (rule of
// three, pathetic fallacy, personification, adjective pairs — the durable
// tells in docs/ai-tells-raw-list.md) is underrepresented relative to how
// distinctive it actually is in creative-writing mode. Poems are where that
// register should show up hardest, for all three houses.
//
// Spans form and theme deliberately: free verse, haiku, apostrophe (direct
// address to a thing), rhyme — so no single house's sample set skews toward
// one poem-friendly shape.

export const POEM_PROMPT_BANK: string[] = [
  "Write a short free-verse poem about an abandoned quarry.",
  "Write a poem about an old kettle that's been in the same kitchen for twenty years.",
  "Write a poem about turning forty.",
  "Write a poem about a city street at 3am.",
  "Write a short poem in second person about leaving home for the first time.",
  "Write a poem about missing someone who's still alive, just far away.",
  "Write a poem about doing the same commute every day for ten years.",
  "Write three haiku about winter.",
  "Write a poem addressed directly to the sea.",
  "Write a poem about waiting for a phone call that isn't coming.",
  "Write a short rhyming poem about a storm rolling in.",
  "Write a poem about a memory you can't quite finish remembering.",
];
