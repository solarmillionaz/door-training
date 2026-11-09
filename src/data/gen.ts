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
  /** 'none' = never add a context (e.g. clear refusals). */
  contexts?: 'all' | 'none';
  exclude?: string[]; // context tags that don't fit this theme
  /** Only these context tags are paired with this theme (chosen so the combined line reads naturally). */
  allow?: string[];
  refusal?: boolean;
}

/** Extra homeowner detail appended to a statement, plus a matching line for the rep's response. */
export interface Context { tag: string; say: string; reply: string; hint: string }

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

export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9$ ]/g, ' ').replace(/\s+/g, ' ').trim();

export function jaccard(a: string, b: string): number {
  const A = new Set(normalize(a).split(' ')), B = new Set(normalize(b).split(' '));
  let inter = 0; A.forEach((w) => { if (B.has(w)) inter++; });
  return inter / (A.size + B.size - inter);
}
/** A context must change a statement enough that it reads as a different situation. */
const MAX_SIMILARITY = 0.7;

interface BuildOpts { category: CategoryId; prefix: string; core: Card[]; themes: Theme[]; contexts: Context[]; target: number }

export function buildCategory({ category, prefix, core, themes, contexts, target, allow }: BuildOpts & { allow?: Record<string, string[]> }): Card[] {
  if (allow) themes.forEach((t) => { if (allow[t.key]) t.allow = allow[t.key]; });
  const out: Card[] = [];
  const seen = new Set<string>();
  let n = 0;
  const push = (c: Omit<Card, 'id' | 'category'>) => {
    const k = normalize(c.statement);
    if (seen.has(k) || out.length >= target) return false;
    seen.add(k);
    out.push({ id: `${prefix}${String(++n).padStart(4, '0')}`, category, ...c });
    return true;
  };
  core.forEach((c) => push(c));

  const make = (th: Theme, pi: number, ctx: Context | null, salt: number): Omit<Card, 'id' | 'category'> => {
    const phr = th.phrasings[pi];
    const statement = ctx ? `${phr} ${ctx.say}` : phr;
    const response = th.responses[(pi + salt) % th.responses.length] + (ctx && !th.refusal ? ` ${ctx.reply}` : '');
    const question = th.questions[(pi + salt) % th.questions.length];
    const meaning = th.meaning + (ctx && !th.refusal ? ` ${ctx.hint}` : '');
    if (th.refusal) {
      const [coach, tip] = REFUSAL_TIPS[(pi + salt) % REFUSAL_TIPS.length];
      return { statement, classification: th.classification, meaning, question, response, tip, coach };
    }
    const coach = COACH_ORDER[(pi * 3 + salt * 5 + th.key.length) % COACH_ORDER.length];
    const tips = TIPS[coach];
    const tip = tips[(pi + salt) % tips.length](th);
    return { statement, classification: th.classification, meaning, question, response, tip, coach };
  };

  // 1) every base phrasing
  themes.forEach((th) => th.phrasings.forEach((_, pi) => push(make(th, pi, null, 0))));
  // 2) phrasing + a homeowner detail that fits this situation (theme.allow), spread round-robin
  const byCtx = new Map<string, string[]>();
  const ctxByTag = new Map(contexts.map((c) => [c.tag, c]));
  const pool = themes.filter((t) => t.contexts !== 'none' && !t.refusal && t.allow?.length);
  const maxRounds = Math.max(0, ...pool.map((t) => t.allow!.length));
  for (let round = 0; out.length < target && round < maxRounds; round++) {
    pool.forEach((th) => th.phrasings.forEach((_, pi) => {
      if (out.length >= target || round >= th.allow!.length) return;
      const ctx = ctxByTag.get(th.allow![(pi + round) % th.allow!.length]);
      if (!ctx || th.exclude?.includes(ctx.tag)) return;
      const card = make(th, pi, ctx, round + 1);
      if (jaccard(th.phrasings[pi], card.statement) >= MAX_SIMILARITY) return;
      const same = byCtx.get(ctx.tag) ?? [];
      if (same.some((st) => jaccard(st, card.statement) >= 0.75)) return;
      if (push(card)) { same.push(card.statement); byCtx.set(ctx.tag, same); }
    }));
  }
  return out;
}
