import type { CoachId } from './coaches';

export type CategoryId = 'objections' | 'smokescreens' | 'concerns';

export interface Card {
  id: string;
  category: CategoryId;
  statement: string;
  classification: string;
  meaning: string;
  question: string;
  response: string;
  tip: string;
  coach: CoachId;
}

export const CATEGORIES: { id: CategoryId; label: string; short: string; blurb: string; icon: string }[] = [
  { id: 'objections', label: 'Objections', short: 'OBJECTIONS', blurb: 'Pushback on solar, cost, trust, or the roof.', icon: '🛑' },
  { id: 'smokescreens', label: 'Smokescreens', short: 'SMOKESCREENS', blurb: 'Brush-offs vs. real timing issues vs. clear refusals.', icon: '💨' },
  { id: 'concerns', label: 'Real Concerns', short: 'CONCERNS', blurb: 'Honest questions Arizona homeowners ask.', icon: '❓' },
];


/** Actual card counts (kept in sync by a unit test) so the menu can show them without loading the decks. */
export const CARD_COUNTS: Record<CategoryId, number> = { objections: 533, smokescreens: 542, concerns: 513 };
export const TOTAL_CARDS = CARD_COUNTS.objections + CARD_COUNTS.smokescreens + CARD_COUNTS.concerns;
