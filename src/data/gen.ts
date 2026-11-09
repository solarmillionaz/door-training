import type { Card, CategoryId } from './types';
import type { CoachId } from './coaches';

/** A core door situation (based on what D2D/solar trainers commonly list as the most frequent). */
export interface Theme {
  key: string;
  classification: string;
  phrasings: string[];
  meaning: string;
  questions: string[];
  responses: string[];
  /** Slots for coach tip templates. */
  feeling: string; // "worried about the cost"
  topic: string; // "the cost"
  need: string; // "a predictable bill"
  refusal?: boolean;
}

const COACH_ORDER: CoachId[] = ['mccarthy', 'voss', 'taggart', 'miner', 'cardone', 'ziglar', 'rackham', 'belfort', 'carnegie', 'tracy', 'elliott'];

type T = Pick<Theme, 'feeling' | 'topic' | 'need'>;
const TIPS: Record<CoachId, ((t: T) => string)[]> = {
  mccarthy: [
    (t) => `Keep your tonality relaxed and curious about ${t.topic}. Slow down, smile, and make a soft assumptive transition: "Let's just see if it even makes sense for your home."`,
    (t) => `Build rapport before you touch ${t.topic}: notice something real about the home or neighborhood, then bridge naturally toward a quick look at their numbers.`,
  ],
  voss: [
    (t) => `Label it: "It sounds like you're ${t.feeling}." Then pause and let them fill the silence.`,
    (t) => `Ask a calibrated question: "What would need to be true about ${t.topic} for this to be worth a look?"`,
    () => `Mirror their last three words as a question, then stay quiet. People explain themselves when you give them space.`,
  ],
  taggart: [
    () => `Keep it light and lower the pressure ("No big deal either way"). Stay curious and keep the momentum toward one small next step.`,
    (t) => `Don't over-react to ${t.topic}. Acknowledge it in one line, ask a simple question, and keep the conversation moving.`,
  ],
  miner: [
    (t) => `Stay neutral and curious: "Just so I understand, what's your biggest concern with ${t.topic}?" No pressure in your voice.`,
    (t) => `Help them notice the problem themselves. Ask how ${t.topic} affects them today instead of telling them.`,
  ],
  cardone: [
    (t) => `Agree first ("That makes total sense"), then address ${t.topic}. If today isn't the day, ask permission to follow up.`,
    () => `Never argue. Agree with the feeling, give one clear fact, and set a specific follow-up. Persistence with permission wins.`,
  ],
  ziglar: [
    (t) => `Trust comes first. They're ${t.feeling}. Help them honestly, even if the honest answer is that it's not a fit.`,
    (t) => `Focus on their need (${t.need}), not your pitch. People buy when they feel helped, not sold.`,
  ],
  rackham: [
    (t) => `Use SPIN: Situation (utility and bill), Problem (what bugs them about ${t.topic}), Implication (what it costs them), Need-payoff (what ${t.need} would mean to them).`,
    (t) => `Ask an implication question: "If nothing changes, how does ${t.topic} play out for you over the next few summers?"`,
  ],
  belfort: [
    (t) => `Stay certain and calm. Handle ${t.topic} briefly and truthfully, then loop back to the main goal: a no-pressure look at their real numbers.`,
    () => `Certainty is contagious, and so is doubt. Know your facts, answer cleanly, and loop back to the next step.`,
  ],
  carnegie: [
    (t) => `Show genuine interest in them as a person. Use their name and ask about the home before you get to ${t.topic}.`,
    () => `Make them feel important: listen more than you talk, and repeat back what you heard.`,
  ],
  tracy: [
    (t) => `Answer with a question. Whoever asks the questions guides the conversation, so find out what's really behind ${t.topic}.`,
    () => `Prepare your best questions in advance. A good question beats a great rebuttal.`,
  ],
  elliott: [
    (t) => `Bring confident, positive energy. Own the moment, address ${t.topic} in one sentence, and move forward.`,
    () => `Your energy sets the tone. Stand tall, keep eye contact, and speak with conviction, but never pressure.`,
  ],
};

const REFUSAL_TIPS: [CoachId, string][] = [
  ['carnegie', 'This is a clear no. Thank them, wish them a good day, and leave. Mark the home do-not-knock. Respect builds your reputation on the whole street.'],
  ['ziglar', 'A clear refusal is not a smokescreen or an objection to overcome. Thank them sincerely and walk away. Integrity is the long game.'],
  ['taggart', 'Read it correctly: this is a real no. Keep it light, say thanks, and move to the next door. Note any opt-out so nobody knocks again.'],
  ['elliott', 'Confidence includes knowing when to leave. Smile, say thank you, and take your energy to the next door.'],
];

export const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9$ ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Filler words ignored by the near-duplicate check (negations are kept on purpose: "not" changes meaning). */
const STOP = new Set(('a an the and or but so to of in on at for with from by is are was were be been am i im me my we us our you your yall '
  + 'it its this that these those just do does did have has had will would can could should gonna wanna got get gotta '
  + 'he she him her his they them their there here what whats who how when where why if then than too also really '
  + 'oh hey uh um well yeah ok okay man bro sir maam like very some any all about up out as y el la los las de que un una es en me mi lo se').split(' '));

export const contentWords = (s: string): Set<string> => {
  const all = normalize(s).split(' ').filter(Boolean);
  const cw = all.filter((w) => !STOP.has(w));
  return new Set(cw.length ? cw : all);
};

/** Jaccard overlap of content words (0..1). */
export function jaccard(a: string, b: string): number {
  const A = contentWords(a), B = contentWords(b);
  let inter = 0; A.forEach((w) => { if (B.has(w)) inter++; });
  const u = A.size + B.size - inter;
  return u ? inter / u : 1;
}
/** Two lines this similar (or more) count as the same line. */
export const MAX_SIMILARITY = 0.7;
/** "Spanish line || English meaning" */
export const SPLIT = ' || ';

interface BuildOpts { category: CategoryId; prefix: string; core: Card[]; themes: Theme[]; lines: Record<string, string[]> }

/** Lines rejected as near-duplicates during the build (for review in dev). */
export const rejected: { category: CategoryId; line: string; like: string }[] = [];

export function buildCategory({ category, prefix, core, themes, lines }: BuildOpts): Card[] {
  const out: Card[] = [];
  const seen: { text: string; words: Set<string> }[] = [];
  let n = 0;
  const push = (c: Omit<Card, 'id' | 'category'>) => {
    const words = contentWords(c.statement);
    for (const prev of seen) {
      let inter = 0; words.forEach((w) => { if (prev.words.has(w)) inter++; });
      const u = words.size + prev.words.size - inter;
      if ((u ? inter / u : 1) >= MAX_SIMILARITY) { rejected.push({ category, line: c.statement, like: prev.text }); return false; }
    }
    seen.push({ text: c.statement, words });
    out.push({ id: `${prefix}${String(++n).padStart(4, '0')}`, category, ...c });
    return true;
  };
  core.forEach((c) => push(c));

  const make = (th: Theme, raw: string, i: number): Omit<Card, 'id' | 'category'> => {
    const [statement, english] = raw.split(SPLIT);
    const meaning = english ? `Spanish: "${english.trim()}". ${th.meaning}` : th.meaning;
    const response = th.responses[i % th.responses.length];
    const question = th.questions[i % th.questions.length];
    if (th.refusal) {
      const [coach, tip] = REFUSAL_TIPS[i % REFUSAL_TIPS.length];
      return { statement: statement.trim(), classification: th.classification, meaning, question, response, tip, coach };
    }
    const coach = COACH_ORDER[(i * 3 + th.key.length) % COACH_ORDER.length];
    const tips = TIPS[coach];
    const tip = tips[i % tips.length](th);
    return { statement: statement.trim(), classification: th.classification, meaning, question, response, tip, coach };
  };

  const unknown = Object.keys(lines).filter((k) => !themes.some((t) => t.key === k));
  if (unknown.length) throw new Error(`${category}: lines tagged with unknown situations: ${unknown.join(', ')}`);
  themes.forEach((th) => {
    const all = [...th.phrasings, ...(lines[th.key] ?? [])];
    all.forEach((raw, i) => push(make(th, raw, i)));
  });
  return out;
}
