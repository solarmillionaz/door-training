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


export const CARDS_PER_CATEGORY = 1000;
