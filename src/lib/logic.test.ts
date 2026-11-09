import { describe, it, expect } from 'vitest';
import { Deck, shuffle } from './deck';
import { applyOutcome, emptyScore, accuracy, attempted } from './scoring';
import { TiltDetector, screenPitch } from './tilt';
import { rankTeams, addRound, type TeamEntry } from './leaderboard';
import { CARDS, cardsFor } from '../data/cards';
import { COACHES } from '../data/coaches';

const seeded = (s: number) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

describe('shuffle / deck', () => {
  it('shuffle keeps every item exactly once', () => {
    const a = Array.from({ length: 50 }, (_, i) => i);
    const s = shuffle(a, seeded(7));
    expect(s.slice().sort((x, y) => x - y)).toEqual(a);
    expect(s).not.toEqual(a);
  });
  it('deck never repeats a card within a round and ends with null', () => {
    for (const cat of ['objections', 'smokescreens', 'concerns', 'all'] as const) {
      const d = new Deck(cardsFor(cat));
      const seen = new Set<string>();
      let c;
      while ((c = d.next())) { expect(seen.has(c.id)).toBe(false); seen.add(c.id); }
      expect(seen.size).toBe(cardsFor(cat).length);
      expect(d.next()).toBeNull();
    }
  });
});

describe('scoring', () => {
  it('correct +1, pass 0, accuracy rounds', () => {
    let s = emptyScore();
    s = applyOutcome(s, 'correct'); s = applyOutcome(s, 'correct'); s = applyOutcome(s, 'pass');
    expect(s).toEqual({ correct: 2, passed: 1 });
    expect(attempted(s)).toBe(3);
    expect(accuracy(s)).toBe(67);
    expect(accuracy(emptyScore())).toBe(0);
  });
});

describe('tilt detection', () => {
  it('screenPitch: vertical ~0, face up +90, face down -90 (portrait & landscape)', () => {
    expect(screenPitch(90, 0)).toBeCloseTo(0);
    expect(screenPitch(0, 90)).toBeCloseTo(0);
    expect(screenPitch(0, -90)).toBeCloseTo(0);
    expect(screenPitch(0, 0)).toBeCloseTo(90);
    expect(screenPitch(180, 0)).toBeCloseTo(-90);
    // landscape on forehead tilting back: gamma moves from ±90 toward 0 -> pitch goes positive
    expect(screenPitch(0, 50)).toBeGreaterThan(30);
    // landscape tilting forward: gamma crosses ±90 and beta flips to ~±180 -> pitch negative, no discontinuity
    expect(screenPitch(180, 50)).toBeLessThan(-30);
  });

  const run = (pitches: number[], stepMs = 50, neutral = 0) => {
    const d = new TiltDetector();
    d.neutral = neutral;
    const out: string[] = [];
    pitches.forEach((p, i) => { const o = d.feed(p, i * stepMs); if (o) out.push(o); });
    return out;
  };

  it('tilt up scores correct exactly once even if held', () => {
    expect(run([0, 5, 15, 35, 50, 60, 60, 55, 50, 60])).toEqual(['correct']);
  });
  it('tilt down scores pass', () => {
    expect(run([0, -10, -40, -60, -60])).toEqual(['pass']);
  });
  it('must return to neutral before next trigger (no double scoring on jitter)', () => {
    // up, wobble around threshold without returning to neutral -> still one
    expect(run([0, 40, 25, 40, 25, 40, 30, 45])).toEqual(['correct']);
  });
  it('re-arms after returning to neutral and cooldown', () => {
    const seq = [0, 40, 40, ...Array(20).fill(0), -40, -40, ...Array(20).fill(0), 40];
    expect(run(seq)).toEqual(['correct', 'pass', 'correct']);
  });
  it('a brief return to neutral during cooldown still re-arms once cooldown passes', () => {
    const d = new TiltDetector();
    expect(d.feed(40, 0)).toBe('correct');
    expect(d.feed(0, 50)).toBeNull();
    expect(d.feed(-40, 900)).toBe('pass');
  });
  it('held tilt never re-arms without neutral, even after cooldown', () => {
    expect(run([40, ...Array(40).fill(45)])).toEqual(['correct']);
  });
  it('cooldown blocks a fast bounce', () => {
    // 10ms samples: up, back to 0, up again within 700ms -> only one
    expect(run([0, 40, 0, 0, 40, 0, 40], 10)).toEqual(['correct']);
  });
  it('uses calibrated neutral angle', () => {
    const d = new TiltDetector();
    [8, 10, 12, 10, 9, 11].forEach((p) => d.addCalibrationSample(p));
    expect(d.finishCalibration()).toBe(10);
    expect(d.feed(35, 0)).toBeNull(); // only +25 from neutral
    expect(d.feed(45, 50)).toBe('correct');
  });
});

describe('leaderboard', () => {
  const t = (name: string, correct: number, passed: number): TeamEntry => ({ name, correct, passed, rounds: 1 });
  it('ranks by correct, then accuracy', () => {
    const r = rankTeams([t('A', 5, 5), t('B', 7, 9), t('C', 5, 1), t('D', 7, 3)]);
    expect(r.map((x) => x.name)).toEqual(['D', 'B', 'C', 'A']);
  });
  it('addRound accumulates', () => {
    const r = addRound([t('A', 1, 1), t('B', 0, 0)], 'B', { correct: 3, passed: 2 });
    expect(r[1]).toEqual({ name: 'B', correct: 3, passed: 2, rounds: 2 });
    expect(r[0]).toEqual(t('A', 1, 1));
  });
});

describe('card data', () => {
  it('has 30+ cards per category with all fields and a valid coach', () => {
    for (const cat of ['objections', 'smokescreens', 'concerns'] as const) expect(cardsFor(cat).length).toBeGreaterThanOrEqual(30);
    const ids = new Set<string>();
    for (const c of CARDS) {
      for (const k of ['statement', 'classification', 'meaning', 'question', 'response', 'tip'] as const) expect(c[k].length).toBeGreaterThan(3);
      expect(COACHES[c.coach]).toBeDefined();
      expect(ids.has(c.id)).toBe(false); ids.add(c.id);
    }
  });
  it('spreads coaching across all 10 coaches', () => {
    expect(new Set(CARDS.map((c) => c.coach)).size).toBe(10);
  });
  it('never promises guarantees or free/$0', () => {
    for (const c of CARDS) {
      const txt = c.response.toLowerCase(); // what the rep actually says
      expect(txt).not.toMatch(/\bguarantee(d)? (you|savings|approval)|\$0|zero payment|you will save|you'll save/);
      expect(c.response.toLowerCase()).not.toMatch(/\bit'?s free\b|free solar|free panels/);
    }
  });
});
