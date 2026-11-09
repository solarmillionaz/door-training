import { accuracy, type Score } from './scoring';

export interface TeamEntry { name: string; correct: number; passed: number; rounds: number }

export const teamAccuracy = (t: TeamEntry) => accuracy({ correct: t.correct, passed: t.passed });

/** Ranked by total correct, then accuracy, then name. */
export function rankTeams(teams: readonly TeamEntry[]): TeamEntry[] {
  return teams.slice().sort((a, b) =>
    b.correct - a.correct || teamAccuracy(b) - teamAccuracy(a) || a.name.localeCompare(b.name));
}

export function addRound(teams: readonly TeamEntry[], name: string, s: Score): TeamEntry[] {
  return teams.map((t) => t.name === name
    ? { ...t, correct: t.correct + s.correct, passed: t.passed + s.passed, rounds: t.rounds + 1 } : t);
}
