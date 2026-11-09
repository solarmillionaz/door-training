import type { TeamEntry } from './leaderboard';

const K = 'shu.v1.';
function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(K + key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown) { try { localStorage.setItem(K + key, JSON.stringify(v)); } catch { /* ignore */ } }

export const bestKey = (category: string, seconds: number) => `best.${category}.${seconds}`;
export const getBest = (category: string, seconds: number) => read<number>(bestKey(category, seconds), 0);
/** Saves if higher; returns { best, isNew }. */
export function recordBest(category: string, seconds: number, correct: number) {
  const prev = getBest(category, seconds);
  if (correct > prev) { write(bestKey(category, seconds), correct); return { best: correct, isNew: correct > 0 }; }
  return { best: prev, isNew: false };
}

export interface Competition { teams: TeamEntry[]; turn: number }
export const loadCompetition = () => read<Competition | null>('competition', null);
export const saveCompetition = (c: Competition | null) => (c ? write('competition', c) : localStorage.removeItem(K + 'competition'));

export const loadSettings = () => read<{ category: string; seconds: number; calibrate: boolean }>('settings', { category: 'objections', seconds: 60, calibrate: true });
export const saveSettings = (s: { category: string; seconds: number; calibrate: boolean }) => write('settings', s);
