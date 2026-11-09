import { describe, it, expect } from 'vitest';
import { Deck, shuffle } from './deck';
import { applyOutcome, emptyScore, accuracy, attempted } from './scoring';
import { TiltDetector, screenPitch } from './tilt';
import { rankTeams, addRound, type TeamEntry } from './leaderboard';
import { cards as OBJ } from '../data/objections';
import { cards as SMK } from '../data/smokescreens';
import { cards as CON } from '../data/concerns';
import { normalize, contentWords, MAX_SIMILARITY } from '../data/gen';
import { CARD_COUNTS, type Card } from '../data/types';
import { OBJECTION_LINES } from '../data/lines/objections';
import { SMOKESCREEN_LINES } from '../data/lines/smokescreens';
import { CONCERN_LINES } from '../data/lines/concerns';
import { OBJECTION_THEMES } from '../data/objections';
import { SMOKESCREEN_THEMES } from '../data/smokescreens';
import { CONCERN_THEMES } from '../data/concerns';
const BY: Record<string, Card[]> = { objections: OBJ, smokescreens: SMK, concerns: CON, all: [...OBJ, ...SMK, ...CON] };
const CARDS = BY.all;
const cardsFor = (c: string) => BY[c];
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
  it('has at least 500 cards per category (counts match CARD_COUNTS) with all fields and a valid coach', () => {
    for (const cat of ['objections', 'smokescreens', 'concerns'] as const) {
      expect(cardsFor(cat).length).toBeGreaterThanOrEqual(500);
      expect(cardsFor(cat).length).toBe(CARD_COUNTS[cat]);
      expect(cardsFor(cat).every((c) => c.category === cat)).toBe(true);
    }
    const ids = new Set<string>();
    for (const c of CARDS) {
      for (const k of ['statement', 'classification', 'meaning', 'question', 'response', 'tip'] as const) expect(c[k].length).toBeGreaterThan(3);
      expect(COACHES[c.coach]).toBeDefined();
      expect(ids.has(c.id)).toBe(false); ids.add(c.id);
    }
  });
  it('includes every example statement from the spec', () => {
    const all = new Set(CARDS.map((c) => c.statement));
    for (const s of ["I'm not interested.", "I'm happy with my electric company.", 'Maybe next month.', "I don't make decisions at the door.", 'What if my roof isn\'t eligible?', 'Is the program affiliated with the utility?']) expect(all.has(s)).toBe(true);
  });
  it('has unique statements with no near-duplicates within a category (content words, < 70% overlap)', () => {
    for (const cat of ['objections', 'smokescreens', 'concerns'] as const) {
      const list = cardsFor(cat);
      const norm = list.map((c) => normalize(c.statement));
      expect(new Set(norm).size).toBe(norm.length);
      const sets = list.map((c) => contentWords(c.statement));
      let worst = 0;
      for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) {
        const a = sets[i], b = sets[j];
        let inter = 0; a.forEach((w) => { if (b.has(w)) inter++; });
        const jac = inter / (a.size + b.size - inter);
        if (jac > worst) worst = jac;
        if (jac >= MAX_SIMILARITY) throw new Error(`near-duplicate in ${cat}: "${list[i].statement}" ~ "${list[j].statement}"`);
      }
      expect(worst).toBeLessThan(0.7);
    }
  });
  it('statements are short standalone spoken lines (no appended detail suffixes)', () => {
    for (const c of CARDS) {
      const words = c.statement.split(/\s+/).length;
      expect(words, c.statement).toBeLessThanOrEqual(20);
      expect(c.statement.includes('||'), c.statement).toBe(false);
    }
  });
  it('has 5-10% Spanish/Spanglish lines per category, each with an English meaning', () => {
    for (const cat of ['objections', 'smokescreens', 'concerns'] as const) {
      const es = cardsFor(cat).filter((c) => c.meaning.startsWith('Spanish: "'));
      const share = es.length / cardsFor(cat).length;
      expect(share, cat).toBeGreaterThanOrEqual(0.05);
      expect(share, cat).toBeLessThanOrEqual(0.1);
      es.forEach((c) => expect(c.meaning).toMatch(/^Spanish: "[A-Za-z]/));
    }
  });
  it('every hand-written line is tagged to a real situation', () => {
    const check = (lines: Record<string, string[]>, themes: { key: string }[]) =>
      Object.keys(lines).forEach((k) => expect(themes.some((t) => t.key === k), k).toBe(true));
    check(OBJECTION_LINES, OBJECTION_THEMES); check(SMOKESCREEN_LINES, SMOKESCREEN_THEMES); check(CONCERN_LINES, CONCERN_THEMES);
  });
  it('spreads coaching across all 11 coaches', () => {
    expect(new Set(CARDS.map((c) => c.coach)).size).toBe(11);
  });
  it('responses never promise guarantees, savings, or free/$0', () => {
    for (const c of CARDS) {
      const txt = c.response.toLowerCase(); // what the rep actually says
      expect(txt).not.toMatch(/\bguarantee(d)? (you|savings|approval)|\$0|zero payment|zero down|you will save|you'll save|save from day one/);
      expect(txt).not.toMatch(/\bit'?s free\b|free solar|free panels|no cost to you/);
    }
  });
  it('clear refusals always coach leaving, never a follow-up', () => {
    const refusals = CARDS.filter((c) => /^clear refusal/i.test(c.classification));
    expect(refusals.length).toBeGreaterThanOrEqual(30);
    for (const c of refusals) expect(c.tip.toLowerCase()).toMatch(/leave|walk|next door|thank|honor|opt-out/);
  });
});
