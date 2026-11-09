export type CoachId =
  | 'mccarthy' | 'cardone' | 'ziglar' | 'voss' | 'miner'
  | 'belfort' | 'elliott' | 'carnegie' | 'tracy' | 'rackham';

export interface Coach { id: CoachId; name: string; idea: string }

export const COACHES: Record<CoachId, Coach> = {
  mccarthy: { id: 'mccarthy', name: 'Taylor McCarthy', idea: 'Door-to-door rapport, tonality, smooth assumptive transitions' },
  cardone: { id: 'cardone', name: 'Grant Cardone', idea: 'Agree first, then overcome; persistent follow-up' },
  ziglar: { id: 'ziglar', name: 'Zig Ziglar', idea: 'Earn trust, find the need, genuinely help' },
  voss: { id: 'voss', name: 'Chris Voss', idea: 'Tactical empathy, labeling, mirroring, calibrated how/what questions' },
  miner: { id: 'miner', name: 'Jeremy Miner (NEPQ)', idea: 'Neutral, curious questions that build problem awareness' },
  belfort: { id: 'belfort', name: 'Jordan Belfort', idea: 'Straight Line: certainty, then loop back to the goal' },
  elliott: { id: 'elliott', name: 'Andy Elliott', idea: 'Confidence and energy in every interaction' },
  carnegie: { id: 'carnegie', name: 'Dale Carnegie', idea: 'Genuine interest in people; use their name' },
  tracy: { id: 'tracy', name: 'Brian Tracy', idea: 'The person asking questions controls the conversation' },
  rackham: { id: 'rackham', name: 'Neil Rackham (SPIN)', idea: 'Situation, Problem, Implication, Need-payoff questions' },
};

export const COACH_LIST: Coach[] = Object.values(COACHES);

export const COACH_DISCLAIMER =
  'Coaching tips are original and inspired by general publicly known ideas from these trainers; not affiliated with or endorsed by them.';
