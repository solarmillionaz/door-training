export type Outcome = 'correct' | 'pass';

export interface Score { correct: number; passed: number }

export const emptyScore = (): Score => ({ correct: 0, passed: 0 });

export function applyOutcome(s: Score, o: Outcome): Score {
  return o === 'correct' ? { ...s, correct: s.correct + 1 } : { ...s, passed: s.passed + 1 };
}

export const attempted = (s: Score) => s.correct + s.passed;

export function accuracy(s: Score): number {
  const n = attempted(s);
  return n === 0 ? 0 : Math.round((s.correct / n) * 100);
}
