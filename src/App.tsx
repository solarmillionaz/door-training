import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, cardsFor, type Card, type CategoryId } from './data/cards';
import { COACHES, COACH_DISCLAIMER, COACH_LIST, type CoachId } from './data/coaches';
import { Deck, shuffle } from './lib/deck';
import { accuracy, applyOutcome, attempted, emptyScore, type Outcome, type Score } from './lib/scoring';
import { TiltDetector, motionSupported, needsMotionPermission, requestMotionPermission, screenPitch } from './lib/tilt';
import { rankTeams, addRound, teamAccuracy } from './lib/leaderboard';
import { getBest, recordBest, loadCompetition, saveCompetition, loadSettings, saveSettings, type Competition } from './lib/storage';

type Cat = CategoryId | 'all';
type Screen = 'menu' | 'howto' | 'category' | 'setup' | 'ready' | 'countdown' | 'play' | 'results' | 'practice' | 'team';
type Mode = 'solo' | 'team';
const TIMES = [60, 90, 120] as const;

const catLabel = (c: Cat) => (c === 'all' ? 'Mixed — All Categories' : CATEGORIES.find((x) => x.id === c)!.label);
const catShort = (c: Cat) => (c === 'all' ? 'MIXED' : CATEGORIES.find((x) => x.id === c)!.short);

// ---------- small helpers ----------
let audioCtx: AudioContext | null = null;
function beep(freq: number, ms = 120) {
  try {
    audioCtx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.frequency.value = freq; o.type = 'square'; g.gain.value = 0.06;
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + ms / 1000);
  } catch { /* no audio */ }
}
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* ignore */ } };

async function enterGameMode() {
  try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({ navigationUI: 'hide' }); } catch { /* unsupported (e.g. iPhone Safari) */ }
  try { await (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock?.('landscape'); } catch { /* not allowed */ }
}
async function exitGameMode() {
  try { (screen.orientation as unknown as { unlock?: () => void }).unlock?.(); } catch { /* ignore */ }
  try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* ignore */ }
}

function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock: WakeLockSentinel | null = null; let cancelled = false;
    navigator.wakeLock.request('screen').then((l) => { if (cancelled) l.release(); else lock = l; }).catch(() => {});
    return () => { cancelled = true; lock?.release().catch(() => {}); };
  }, [active]);
}

// ---------- UI atoms ----------
function Btn({ children, onClick, variant = 'gold', className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'gold' | 'ghost' | 'go' | 'stop' | 'dark' }) {
  const styles = {
    gold: 'bg-gold text-navy shadow-[0_6px_0_#a16207] active:shadow-[0_2px_0_#a16207] active:translate-y-1',
    go: 'bg-go text-white shadow-[0_6px_0_#0f6b30] active:shadow-[0_2px_0_#0f6b30] active:translate-y-1',
    stop: 'bg-stop text-white shadow-[0_6px_0_#8f1f2f] active:shadow-[0_2px_0_#8f1f2f] active:translate-y-1',
    dark: 'bg-navy-3 text-white border border-white/10 shadow-[0_6px_0_#05080f] active:shadow-[0_2px_0_#05080f] active:translate-y-1',
    ghost: 'bg-transparent text-white/80 border-2 border-white/20 hover:border-gold hover:text-gold',
  }[variant];
  return (
    <button onClick={onClick} className={`font-display uppercase rounded-2xl px-6 py-4 text-lg sm:text-xl transition-all duration-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/70 disabled:opacity-40 ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function Title({ small = false }: { small?: boolean }) {
  return (
    <div className="text-center select-none">
      <h1 className={`font-display text-gold glow leading-none ${small ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-7xl'}`}>SALES<br className="sm:hidden" /> HEADS UP!</h1>
      <p className={`font-display tracking-[0.18em] text-white mt-3 ${small ? 'text-[11px] sm:text-sm' : 'text-xs sm:text-base'}`}>OBJECTIONS • SMOKESCREENS • CONCERNS</p>
    </div>
  );
}

function Shell({ children, onBack, title }: { children: React.ReactNode; onBack?: () => void; title?: string }) {
  return (
    <div className="min-h-full flex flex-col max-w-3xl mx-auto px-4 pb-10 pt-[max(1rem,env(safe-area-inset-top))] anim-fade">
      {(onBack || title) && (
        <header className="flex items-center gap-3 mb-4">
          {onBack && <button onClick={onBack} aria-label="Back" className="font-display text-gold text-2xl w-12 h-12 rounded-xl bg-navy-3 border border-white/10">←</button>}
          {title && <h2 className="font-display text-2xl sm:text-3xl text-white uppercase">{title}</h2>}
        </header>
      )}
      {children}
    </div>
  );
}

function ShareButton({ className = '' }: { className?: string }) {
  const [msg, setMsg] = useState('');
  const url = typeof location !== 'undefined' ? location.origin + location.pathname : '';
  const share = async () => {
    const data = { title: 'SALES HEADS UP! — AZ Power Program', text: 'Think Fast. Respond Better. Win More Deals. Play the solar sales training game:', url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch (e) { if ((e as Error).name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); setMsg('Link copied!'); }
    catch { window.prompt('Copy this link:', url); }
    setTimeout(() => setMsg(''), 2000);
  };
  return (
    <div className={`relative ${className}`}>
      <Btn variant="ghost" className="w-full" onClick={share} aria-label="Share game link">📤 Share Game</Btn>
      {msg && <div role="status" className="absolute -top-10 left-1/2 -translate-x-1/2 bg-go text-white font-bold px-3 py-1 rounded-lg anim-pop">{msg}</div>}
    </div>
  );
}

// ---------- Screens ----------
function Menu({ go, cat, seconds, hasComp }: { go: (s: Screen, m?: Mode) => void; cat: Cat; seconds: number; hasComp: boolean }) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-5 py-8 gap-7 anim-fade">
      <div className="text-xs font-bold tracking-[0.3em] text-white/60">AZ POWER PROGRAM</div>
      <div className="anim-float"><Title /></div>
      <p className="text-center text-lg sm:text-xl font-semibold text-white/90">Think Fast. Respond Better. <span className="text-gold">Win More Deals.</span></p>
      <div className="w-full max-w-sm flex flex-col gap-4">
        <Btn onClick={() => go('setup', 'solo')} className="text-2xl py-5">▶ Start Game</Btn>
        <Btn variant="dark" onClick={() => go('howto')}>How to Play</Btn>
        <Btn variant="dark" onClick={() => go('category')}>Choose Category</Btn>
        <Btn variant="dark" onClick={() => go('practice')}>Practice Mode</Btn>
        <Btn variant="go" onClick={() => go('team', 'team')}>🏆 Team Competition{hasComp ? ' (resume)' : ''}</Btn>
        <ShareButton />
        <a href="./qr.png" download="sales-heads-up-qr.png" className="text-center text-sm text-gold underline underline-offset-4">Download QR code (PNG)</a>
      </div>
      <p className="text-sm text-white/50 text-center">Category: <b className="text-white/80">{catLabel(cat)}</b> · {seconds}s · No login needed</p>
    </div>
  );
}

function HowTo({ back }: { back: () => void }) {
  const steps = [
    ['📱', 'Hold the phone on your forehead', 'Landscape, screen facing your teammate. Tap START, then hold still for the 3-2-1 calibration.'],
    ['🏠', 'Teammate plays the homeowner', 'They read the card out loud — an objection, smokescreen, or real concern.'],
    ['🗣️', 'You respond like you would at the door', 'Name what it is (objection / smokescreen / concern / clear refusal) and handle it respectfully.'],
    ['⬆️', 'Tilt UP = CORRECT (+1)', 'The homeowner decides. Tilt the screen toward the ceiling, swipe up, tap green, or press ↑.'],
    ['⬇️', 'Tilt DOWN = PASS (0)', 'Tilt toward the floor, swipe down, tap red, or press ↓. Return to center before the next tilt.'],
    ['⏱️', 'Beat the clock', '60, 90, or 120 seconds. Your best score per category and time is saved on this device.'],
  ];
  return (
    <Shell onBack={back} title="How to Play">
      <ol className="flex flex-col gap-3">
        {steps.map(([icon, t, d], i) => (
          <li key={i} className="flex gap-4 bg-navy-2 rounded-2xl p-4 border border-white/10 anim-pop" style={{ animationDelay: `${i * 50}ms` }}>
            <span className="text-3xl" aria-hidden>{icon}</span>
            <div><div className="font-display text-gold text-lg">{t}</div><div className="text-white/80">{d}</div></div>
          </li>
        ))}
      </ol>
      <section className="mt-6 bg-navy-2 rounded-2xl p-4 border border-gold/30">
        <h3 className="font-display text-gold text-lg mb-2">Ground rules at the door</h3>
        <ul className="list-disc pl-5 space-y-1 text-white/85">
          <li>A clear refusal is <b>not</b> a smokescreen. Thank them and leave. Honor “No Soliciting” and opt-outs.</li>
          <li>Never guarantee eligibility, savings, free equipment, or $0 payments. Offers depend on program terms and qualification.</li>
          <li>AZ Power Program is independent — not affiliated with APS, SRP, or TEP.</li>
          <li>Qualifiers: homeowner, utility &amp; bill, credit (about 650+), all decision-makers present, existing solar/battery, roof, and appointment availability.</li>
        </ul>
      </section>
      <section className="mt-6 bg-navy-2 rounded-2xl p-4 border border-white/10">
        <h3 className="font-display text-gold text-lg mb-2">Coach styles</h3>
        <p className="text-white/70 text-sm mb-3">Every card’s coaching tip is labeled “Inspired by” a well-known sales trainer’s general approach.</p>
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          {COACH_LIST.map((c) => <li key={c.id}><b className="text-white">{c.name}</b> <span className="text-white/60">— {c.idea}</span></li>)}
        </ul>
        <p className="mt-4 text-xs text-white/60 italic">{COACH_DISCLAIMER}</p>
      </section>
      <p className="mt-6 text-xs text-white/50">Tilt needs motion sensors (iPhone asks for permission once). No sensors? Use the buttons, swipes, or arrow keys. Data stays on this device — no account, no login.</p>
    </Shell>
  );
}

function CategoryPicker({ cat, onPick, back }: { cat: Cat; onPick: (c: Cat) => void; back: () => void }) {
  const opts: { id: Cat; label: string; blurb: string; icon: string; n: number }[] = [
    ...CATEGORIES.map((c) => ({ id: c.id as Cat, label: c.label, blurb: c.blurb, icon: c.icon, n: cardsFor(c.id).length })),
    { id: 'all', label: 'Mixed', blurb: 'Every card from all three decks.', icon: '🎲', n: cardsFor('all').length },
  ];
  return (
    <Shell onBack={back} title="Choose Category">
      <div className="grid sm:grid-cols-2 gap-4">
        {opts.map((o, i) => (
          <button key={o.id} onClick={() => onPick(o.id)} aria-pressed={cat === o.id}
            className={`text-left rounded-3xl p-5 card-shadow border-2 transition-transform hover:scale-[1.02] anim-pop ${cat === o.id ? 'bg-gold text-navy border-gold' : 'bg-navy-2 border-white/10'}`}
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="text-4xl" aria-hidden>{o.icon}</div>
            <div className="font-display text-2xl uppercase mt-2">{o.label}</div>
            <div className={`${cat === o.id ? 'text-navy/80' : 'text-white/70'}`}>{o.blurb}</div>
            <div className={`mt-2 text-sm font-bold ${cat === o.id ? 'text-navy' : 'text-gold'}`}>{o.n} cards</div>
          </button>
        ))}
      </div>
    </Shell>
  );
}

function Setup({ cat, seconds, setSeconds, go, back, mode, teamName }: { cat: Cat; seconds: number; setSeconds: (n: number) => void; go: (s: Screen) => void; back: () => void; mode: Mode; teamName?: string }) {
  const best = getBest(cat, seconds);
  return (
    <Shell onBack={back} title={mode === 'team' ? 'Team Turn' : 'Game Setup'}>
      {teamName && <div className="text-center mb-4"><div className="text-white/60 text-sm">UP NEXT</div><div className="font-display text-4xl text-gold glow">{teamName}</div></div>}
      <button onClick={() => go('category')} className="w-full text-left bg-navy-2 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
        <div><div className="text-white/60 text-sm">CATEGORY</div><div className="font-display text-2xl">{catLabel(cat)}</div></div>
        <span className="text-gold font-bold">Change ›</span>
      </button>
      <div className="mt-5">
        <div className="text-white/60 text-sm mb-2">ROUND TIME</div>
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Round time">
          {TIMES.map((t) => (
            <button key={t} role="radio" aria-checked={seconds === t} onClick={() => setSeconds(t)}
              className={`font-display text-3xl rounded-2xl py-5 border-2 transition ${seconds === t ? 'bg-gold text-navy border-gold scale-105' : 'bg-navy-2 border-white/10'}`}>
              {t}<span className="text-base">s</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center mt-5 text-white/70">Personal best ({catShort(cat)}, {seconds}s): <b className="text-gold">{best}</b></p>
      <Btn className="mt-6 text-2xl py-5" onClick={() => go('ready')}>Let’s Go ▶</Btn>
    </Shell>
  );
}

function Ready({ onStart, back }: { onStart: (tilt: boolean) => void; back: () => void }) {
  const hasMotion = motionSupported();
  const [denied, setDenied] = useState(false);
  const startTilt = async () => {
    const ok = await requestMotionPermission(); // must be first await in the tap for iOS
    if (!ok) { setDenied(true); return; }
    onStart(true);
  };
  return (
    <Shell onBack={back}>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
        <div className="text-7xl anim-float" aria-hidden>📱🧠</div>
        <h2 className="font-display text-3xl sm:text-4xl text-gold">Phone on your forehead</h2>
        <p className="text-white/80 max-w-md">Turn the phone sideways (landscape), screen facing your teammate. Hold still during the <b>3-2-1</b> — that calibrates your neutral angle.</p>
        <div className="flex flex-wrap justify-center gap-3 font-display">
          <span className="bg-go/20 border border-go text-white px-3 py-2 rounded-xl">⬆ TILT UP = CORRECT</span>
          <span className="bg-stop/20 border border-stop text-white px-3 py-2 rounded-xl">⬇ TILT DOWN = PASS</span>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
          {hasMotion && <Btn onClick={startTilt} className="text-2xl py-5">{needsMotionPermission() ? 'Enable Tilt & Start' : 'Start with Tilt'}</Btn>}
          <Btn variant="dark" onClick={() => onStart(false)}>Buttons / Swipe Only</Btn>
        </div>
        {denied && <p role="alert" className="text-stop font-bold">Motion access was denied. Use buttons, or allow Motion &amp; Orientation access in Safari settings and reload.</p>}
        <p className="text-xs text-white/50 max-w-md">Tip: on iPhone, the browser can’t go true full-screen — use “Add to Home Screen” for a full-screen app feel.</p>
      </div>
    </Shell>
  );
}

function Countdown({ onDone, detector, tiltOn }: { onDone: () => void; detector: TiltDetector; tiltOn: boolean }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) { onDone(); return; }
    beep(n === 1 ? 660 : 440, 100); buzz(40);
    const t = setTimeout(() => setN((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [n, onDone]);
  useEffect(() => {
    if (!tiltOn) return;
    const h = (e: DeviceOrientationEvent) => { if (e.beta != null && e.gamma != null) detector.addCalibrationSample(screenPitch(e.beta, e.gamma)); };
    window.addEventListener('deviceorientation', h);
    return () => window.removeEventListener('deviceorientation', h);
  }, [tiltOn, detector]);
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-navy" data-testid="countdown">
      <div className="text-white/60 font-display tracking-widest">{tiltOn ? 'HOLD STILL — CALIBRATING' : 'GET READY'}</div>
      <div key={n} className="font-display text-[10rem] leading-none text-gold glow anim-count">{n || 'GO!'}</div>
    </div>
  );
}

function Play({ cat, seconds, tiltOn, detector, onEnd, teamName }: { cat: Cat; seconds: number; tiltOn: boolean; detector: TiltDetector; onEnd: (s: Score, log: { card: Card; outcome: Outcome }[], cleared: boolean) => void; teamName?: string }) {
  const [deck] = useState(() => new Deck(cardsFor(cat)));
  const [card, setCard] = useState<Card | null>(() => deck.next());
  const [score, setScore] = useState<Score>(emptyScore);
  const [flash, setFlash] = useState<{ o: Outcome; k: number } | null>(null);
  const [left, setLeft] = useState(seconds * 1000);
  const [tiltSeen, setTiltSeen] = useState(false);
  const endAt = useRef(Date.now() + seconds * 1000);
  const ended = useRef(false);
  const lastInput = useRef(0);
  const scoreRef = useRef(score); scoreRef.current = score;
  const logRef = useRef<{ card: Card; outcome: Outcome }[]>([]);
  const cardRef = useRef(card); cardRef.current = card;
  useWakeLock(true);

  const finish = useCallback((cleared: boolean) => {
    if (ended.current) return; ended.current = true;
    beep(220, 400); buzz([200, 100, 200]);
    onEnd(scoreRef.current, logRef.current, cleared);
  }, [onEnd]);

  const act = useCallback((o: Outcome, source: 'tilt' | 'ui') => {
    const now = performance.now();
    if (ended.current || !cardRef.current) return;
    if (source === 'ui' && now - lastInput.current < 350) return; // guard double taps
    lastInput.current = now;
    logRef.current.push({ card: cardRef.current, outcome: o });
    const next = applyOutcome(scoreRef.current, o);
    scoreRef.current = next; setScore(next);
    setFlash({ o, k: now });
    if (o === 'correct') { beep(880); buzz(60); } else { beep(300); buzz([30, 40, 30]); }
    const nc = deck.next();
    if (!nc) { finish(true); return; }
    setCard(nc);
  }, [deck, finish]);

  // timer
  useEffect(() => {
    const id = setInterval(() => {
      const ms = Math.max(0, endAt.current - Date.now());
      setLeft(ms);
      if (ms <= 0) finish(false);
    }, 100);
    return () => clearInterval(id);
  }, [finish]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (['ArrowUp', 'c', 'C'].includes(e.key)) { e.preventDefault(); act('correct', 'ui'); }
      if (['ArrowDown', 'p', 'P'].includes(e.key)) { e.preventDefault(); act('pass', 'ui'); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [act]);

  // tilt
  useEffect(() => {
    if (!tiltOn) return;
    detector.reset();
    const h = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      setTiltSeen(true);
      const o = detector.feed(screenPitch(e.beta, e.gamma), performance.now());
      if (o) act(o, 'tilt');
    };
    window.addEventListener('deviceorientation', h);
    return () => window.removeEventListener('deviceorientation', h);
  }, [tiltOn, detector, act]);

  // swipe
  const touch = useRef<{ y: number; x: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { y: e.touches[0].clientY, x: e.touches[0].clientX }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    touch.current = null;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.3) act(dy < 0 ? 'correct' : 'pass', 'ui');
  };

  const secs = Math.ceil(left / 1000);
  const pct = (left / (seconds * 1000)) * 100;
  const low = secs <= 10;
  const catInfo = card ? CATEGORIES.find((c) => c.id === card.category)! : null;

  return (
    <div className="fixed inset-0 flex flex-col bg-navy select-none overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} data-testid="play">
      <div className="flex items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] gap-3">
        <div className="font-display text-gold text-xl" aria-live="polite" data-testid="score">✔ {score.correct}</div>
        <div className="text-white/60 text-xs sm:text-sm font-bold tracking-widest truncate">{teamName ? `${teamName} · ` : ''}{catShort(cat)}{tiltOn ? (tiltSeen ? ' · TILT ON' : ' · WAITING FOR SENSOR') : ''}</div>
        <div className={`font-display text-3xl tabular-nums ${low ? 'text-stop animate-pulse' : 'text-white'}`} data-testid="timer" role="timer" aria-label={`${secs} seconds left`}>{secs}</div>
      </div>
      <div className="h-3 mx-4 mt-2 rounded-full bg-white/10 overflow-hidden" aria-hidden>
        <div className={`h-full rounded-full transition-[width] duration-100 ease-linear ${low ? 'bg-stop' : 'bg-gold'}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex-1 flex landscape:flex-row portrait:flex-col items-stretch gap-3 p-3 min-h-0">
        <button onClick={() => act('pass', 'ui')} aria-label="Pass" className="portrait:hidden landscape:flex w-28 sm:w-36 shrink-0 rounded-3xl bg-stop font-display text-2xl items-center justify-center shadow-[0_6px_0_#8f1f2f] active:translate-y-1">PASS<br />⬇</button>
        {card && (
          <div key={card.id} className="flex-1 min-h-0 rounded-[2rem] bg-gradient-to-b from-navy-3 to-navy-2 border-2 border-gold/60 card-shadow flex flex-col items-center justify-center text-center p-4 sm:p-8 anim-pop" data-testid="card">
            <div className="text-gold font-display text-xs sm:text-sm tracking-[0.2em] mb-3">{catInfo?.icon} {catInfo?.short} · HOMEOWNER SAYS</div>
            <p className="font-display text-white leading-tight text-[clamp(1.8rem,7vw,4.5rem)] landscape:text-[clamp(1.8rem,7vh+2vw,5rem)]" data-testid="statement">“{card.statement}”</p>
          </div>
        )}
        <button onClick={() => act('correct', 'ui')} aria-label="Correct" className="portrait:hidden landscape:flex w-28 sm:w-36 shrink-0 rounded-3xl bg-go font-display text-2xl items-center justify-center shadow-[0_6px_0_#0f6b30] active:translate-y-1">CORRECT<br />⬆</button>
        <div className="landscape:hidden grid grid-cols-2 gap-3">
          <button onClick={() => act('pass', 'ui')} aria-label="Pass" className="rounded-3xl bg-stop font-display text-2xl py-6 shadow-[0_6px_0_#8f1f2f] active:translate-y-1">⬇ PASS</button>
          <button onClick={() => act('correct', 'ui')} aria-label="Correct" className="rounded-3xl bg-go font-display text-2xl py-6 shadow-[0_6px_0_#0f6b30] active:translate-y-1">⬆ CORRECT</button>
        </div>
      </div>

      {flash && (
        <div key={flash.k} className={`pointer-events-none fixed inset-0 flex items-center justify-center anim-flash ${flash.o === 'correct' ? 'bg-go/90' : 'bg-stop/90'}`} aria-hidden>
          <div className="font-display text-7xl sm:text-9xl text-white drop-shadow-lg">{flash.o === 'correct' ? 'CORRECT!' : 'PASS'}</div>
        </div>
      )}
    </div>
  );
}

function Results({ score, best, isNew, cleared, log, mode, teamName, nextTeam, onAgain, onChange, onMenu, onBoard }: {
  score: Score; best: number; isNew: boolean; cleared: boolean; log: { card: Card; outcome: Outcome }[]; mode: Mode; teamName?: string; nextTeam?: string;
  onAgain: () => void; onChange: () => void; onMenu: () => void; onBoard: () => void;
}) {
  const stats: [string, string | number, string][] = [
    ['Correct', score.correct, 'text-go'], ['Skipped', score.passed, 'text-stop'],
    ['Accuracy', `${accuracy(score)}%`, 'text-gold'], ['Attempted', attempted(score), 'text-white'],
  ];
  return (
    <Shell>
      <div className="text-center mt-4">
        {teamName && <div className="font-display text-xl text-white/70">{teamName}</div>}
        <h2 className="font-display text-5xl sm:text-6xl text-gold glow anim-pop">ROUND COMPLETE!</h2>
        {cleared && <p className="mt-2 text-white/70">You cleared the whole deck — no repeats left!</p>}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6" data-testid="results">
        {stats.map(([l, v, c], i) => (
          <div key={l} className="bg-navy-2 rounded-2xl p-4 text-center border border-white/10 anim-pop" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`font-display text-5xl ${c}`} data-testid={`stat-${l.toLowerCase()}`}>{v}</div>
            <div className="text-white/60 uppercase text-sm font-bold tracking-widest">{l}</div>
          </div>
        ))}
      </div>
      <div className={`mt-4 rounded-2xl p-4 text-center border-2 ${isNew ? 'border-gold bg-gold/10' : 'border-white/10 bg-navy-2'}`}>
        <div className="text-white/60 text-sm font-bold tracking-widest">PERSONAL BEST</div>
        <div className="font-display text-4xl text-gold" data-testid="best">{best}</div>
        {isNew && <div className="font-display text-gold anim-pop">🎉 NEW RECORD!</div>}
      </div>
      <div className="flex flex-col gap-3 mt-6">
        {mode === 'team' ? (
          <>
            <Btn onClick={onBoard} className="text-xl">🏆 Leaderboard{nextTeam ? ` · Next: ${nextTeam}` : ''}</Btn>
            <Btn variant="dark" onClick={onMenu}>Main Menu</Btn>
          </>
        ) : (
          <>
            <Btn onClick={onAgain} className="text-xl">Play Again</Btn>
            <Btn variant="dark" onClick={onChange}>Change Category</Btn>
            <Btn variant="ghost" onClick={onMenu}>Main Menu</Btn>
          </>
        )}
      </div>
      {log.length > 0 && (
        <details className="mt-6 bg-navy-2 rounded-2xl p-4 border border-white/10">
          <summary className="font-display cursor-pointer">Review this round ({log.length})</summary>
          <ul className="mt-3 space-y-2">
            {log.map(({ card, outcome }, i) => (
              <li key={i} className="flex gap-2 text-sm"><span className={outcome === 'correct' ? 'text-go' : 'text-stop'}>{outcome === 'correct' ? '✔' : '✘'}</span><span><b>{card.statement}</b> <span className="text-white/60">— {card.classification}</span></span></li>
            ))}
          </ul>
        </details>
      )}
    </Shell>
  );
}

function Practice({ back }: { back: () => void }) {
  const [cat, setCat] = useState<Cat>('all');
  const [coach, setCoach] = useState<CoachId | 'all'>('all');
  const list = useMemo(() => shuffle(cardsFor(cat).filter((c) => coach === 'all' || c.coach === coach)), [cat, coach]);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  useEffect(() => { setI(0); setShown(false); }, [list]);
  const card = list[i];
  const move = (d: number) => { setI((x) => (x + d + list.length) % list.length); setShown(false); };
  const coachInfo = card ? COACHES[card.coach] : null;
  return (
    <Shell onBack={back} title="Practice & Coaching">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <label className="flex-1 text-sm text-white/60">Category
          <select value={cat} onChange={(e) => setCat(e.target.value as Cat)} className="mt-1 w-full bg-navy-3 text-white rounded-xl p-3 border border-white/10 font-bold">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label className="flex-1 text-sm text-white/60">Coach style
          <select value={coach} onChange={(e) => setCoach(e.target.value as CoachId | 'all')} className="mt-1 w-full bg-navy-3 text-white rounded-xl p-3 border border-white/10 font-bold" data-testid="coach-filter">
            <option value="all">All coaches</option>
            {COACH_LIST.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      {!card ? <p className="text-white/70">No cards match this filter.</p> : (
        <>
          <div className="text-white/50 text-sm text-right mb-1" data-testid="practice-count">{i + 1} / {list.length}</div>
          <div key={card.id} className="rounded-3xl bg-gradient-to-b from-navy-3 to-navy-2 border-2 border-gold/60 card-shadow p-6 text-center anim-pop">
            <div className="text-gold font-display text-sm tracking-[0.25em]">HOMEOWNER SAYS</div>
            <p className="font-display text-3xl sm:text-4xl mt-2" data-testid="practice-statement">“{card.statement}”</p>
          </div>
          {!shown ? (
            <div className="text-center mt-5">
              <p className="text-white/70 mb-3">Say your response out loud first: What is it? What would you ask? How would you answer?</p>
              <Btn onClick={() => setShown(true)} className="w-full">Reveal Coaching</Btn>
            </div>
          ) : (
            <dl className="mt-5 grid gap-3 anim-fade" data-testid="coaching">
              {([
                ['Classification', card.classification, 'text-gold font-display text-xl'],
                ['What they might mean', card.meaning, ''],
                ['Clarifying question', card.question, ''],
                ['Example response', card.response, ''],
              ] as const).map(([k, v, cls]) => (
                <div key={k} className="bg-navy-2 rounded-2xl p-4 border border-white/10">
                  <dt className="text-white/50 text-xs font-bold tracking-widest uppercase">{k}</dt>
                  <dd className={`mt-1 ${cls || 'text-white/90'}`}>{v}</dd>
                </div>
              ))}
              <div className="bg-gold/10 rounded-2xl p-4 border-2 border-gold/50">
                <dt className="text-gold text-xs font-bold tracking-widest uppercase">Coaching tip · Inspired by {coachInfo?.name}</dt>
                <dd className="mt-1 text-white">{card.tip}</dd>
                <dd className="mt-2 text-xs text-white/50">{coachInfo?.name}: {coachInfo?.idea}</dd>
              </div>
            </dl>
          )}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <Btn variant="dark" onClick={() => move(-1)}>‹ Prev</Btn>
            <Btn variant="dark" onClick={() => move(1)}>Next ›</Btn>
          </div>
          <p className="mt-6 text-xs text-white/50 italic">{COACH_DISCLAIMER}</p>
        </>
      )}
    </Shell>
  );
}

function Team({ comp, setComp, onPlay, back }: { comp: Competition | null; setComp: (c: Competition | null) => void; onPlay: (team: string) => void; back: () => void }) {
  const [names, setNames] = useState<string[]>(['Team 1', 'Team 2']);
  const [confirm, setConfirm] = useState(false);
  if (!comp) {
    const valid = names.map((n) => n.trim()).filter(Boolean);
    const unique = new Set(valid.map((n) => n.toLowerCase())).size === valid.length;
    return (
      <Shell onBack={back} title="Team Competition">
        <p className="text-white/70 mb-4">Enter team or player names. Pass one phone around — each team plays a timed round in turn.</p>
        <div className="flex flex-col gap-3">
          {names.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input aria-label={`Team ${i + 1} name`} value={n} maxLength={24} onChange={(e) => setNames(names.map((x, j) => (j === i ? e.target.value : x)))}
                className="flex-1 bg-navy-3 border border-white/10 rounded-xl p-4 text-lg font-bold text-white focus:outline-none focus:border-gold" />
              {names.length > 2 && <button aria-label={`Remove ${n}`} onClick={() => setNames(names.filter((_, j) => j !== i))} className="w-14 rounded-xl bg-stop/80 font-bold text-xl">✕</button>}
            </div>
          ))}
        </div>
        {names.length < 12 && <Btn variant="ghost" className="mt-3" onClick={() => setNames([...names, `Team ${names.length + 1}`])}>+ Add Team</Btn>}
        {!unique && <p className="text-stop mt-2" role="alert">Team names must be different.</p>}
        <Btn className="mt-6 text-2xl" disabled={valid.length < 2 || !unique}
          onClick={() => setComp({ teams: valid.map((name) => ({ name, correct: 0, passed: 0, rounds: 0 })), turn: 0 })}>Start Competition</Btn>
      </Shell>
    );
  }
  const ranked = rankTeams(comp.teams);
  const up = comp.teams[comp.turn % comp.teams.length].name;
  return (
    <Shell onBack={back} title="Leaderboard">
      <ol className="flex flex-col gap-2" data-testid="leaderboard">
        {ranked.map((t, i) => (
          <li key={t.name} className={`flex items-center gap-3 rounded-2xl p-4 border-2 anim-pop ${i === 0 && t.correct > 0 ? 'border-gold bg-gold/10' : 'border-white/10 bg-navy-2'}`} style={{ animationDelay: `${i * 60}ms` }}>
            <span className="font-display text-3xl w-10 text-center">{i === 0 && t.correct > 0 ? '🥇' : i === 1 && t.correct > 0 ? '🥈' : i === 2 && t.correct > 0 ? '🥉' : i + 1}</span>
            <span className="flex-1 font-display text-xl truncate">{t.name}</span>
            <span className="text-right"><span className="font-display text-3xl text-gold">{t.correct}</span><span className="block text-xs text-white/60">{teamAccuracy(t)}% · {t.rounds} rd</span></span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-white/50 mt-2">Ranked by total correct; accuracy breaks ties.</p>
      <Btn className="mt-6 text-2xl" onClick={() => onPlay(up)}>▶ Play Turn: {up}</Btn>
      {!confirm ? (
        <Btn variant="ghost" className="mt-3" onClick={() => setConfirm(true)}>Reset Competition</Btn>
      ) : (
        <div className="mt-3 bg-stop/20 border border-stop rounded-2xl p-4 text-center" role="alertdialog" aria-label="Confirm reset">
          <p className="font-bold mb-3">Erase all team scores?</p>
          <div className="grid grid-cols-2 gap-3">
            <Btn variant="dark" onClick={() => setConfirm(false)}>Cancel</Btn>
            <Btn variant="stop" onClick={() => { setComp(null); setConfirm(false); }}>Yes, Reset</Btn>
          </div>
        </div>
      )}
    </Shell>
  );
}

// ---------- App ----------
export default function App() {
  const init = useMemo(loadSettings, []);
  const [screen, setScreen] = useState<Screen>('menu');
  const [mode, setMode] = useState<Mode>('solo');
  const [cat, setCat] = useState<Cat>((init.category as Cat) || 'objections');
  const [seconds, setSeconds] = useState<number>(init.seconds || 60);
  const [tiltOn, setTiltOn] = useState(false);
  const [comp, setCompState] = useState<Competition | null>(loadCompetition);
  const [result, setResult] = useState<{ score: Score; best: number; isNew: boolean; cleared: boolean; log: { card: Card; outcome: Outcome }[] } | null>(null);
  const [catReturn, setCatReturn] = useState<Screen>('menu');
  const detector = useRef(new TiltDetector()).current;
  const [roundKey, setRoundKey] = useState(0);

  useEffect(() => saveSettings({ category: cat, seconds, calibrate: true }), [cat, seconds]);
  const setComp = (c: Competition | null) => { setCompState(c); saveCompetition(c); };
  const teamUp = comp ? comp.teams[comp.turn % comp.teams.length].name : undefined;

  const go = (s: Screen, m?: Mode) => {
    if (m) setMode(m);
    if (s === 'category') setCatReturn(screen === 'menu' ? 'menu' : screen);
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const start = (tilt: boolean) => { setTiltOn(tilt); void enterGameMode(); setRoundKey((k) => k + 1); setScreen('countdown'); };
  const onCountdownDone = useCallback(() => { if (tiltOn) detector.finishCalibration(); setScreen('play'); }, [tiltOn, detector]);

  const onEnd = useCallback((score: Score, log: { card: Card; outcome: Outcome }[], cleared: boolean) => {
    void exitGameMode();
    const { best, isNew } = recordBest(cat, seconds, score.correct);
    if (mode === 'team' && comp) {
      const name = comp.teams[comp.turn % comp.teams.length].name;
      setComp({ teams: addRound(comp.teams, name, score), turn: comp.turn + 1 });
    }
    setResult({ score, best, isNew, cleared, log });
    setScreen('results');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, seconds, mode, comp]);

  switch (screen) {
    case 'menu': return <Menu go={go} cat={cat} seconds={seconds} hasComp={!!comp} />;
    case 'howto': return <HowTo back={() => go('menu')} />;
    case 'category': return <CategoryPicker cat={cat} onPick={(c) => { setCat(c); if (catReturn === 'menu') setMode('solo'); setScreen(catReturn === 'menu' ? 'setup' : catReturn); window.scrollTo(0, 0); }} back={() => go(catReturn)} />;
    case 'setup': return <Setup cat={cat} seconds={seconds} setSeconds={setSeconds} go={go} back={() => go(mode === 'team' ? 'team' : 'menu')} mode={mode} teamName={mode === 'team' ? teamUp : undefined} />;
    case 'ready': return <Ready onStart={start} back={() => go('setup')} />;
    case 'countdown': return <Countdown key={roundKey} onDone={onCountdownDone} detector={detector} tiltOn={tiltOn} />;
    case 'play': return <Play key={roundKey} cat={cat} seconds={seconds} tiltOn={tiltOn} detector={detector} onEnd={onEnd} teamName={mode === 'team' ? teamUp : undefined} />;
    case 'results': return result && (
      <Results {...result} mode={mode} teamName={mode === 'team' ? comp?.teams[(comp.turn - 1 + comp.teams.length) % comp.teams.length].name : undefined}
        nextTeam={mode === 'team' ? teamUp : undefined}
        onAgain={() => go('ready')} onChange={() => { setCatReturn('setup'); setScreen('category'); }} onMenu={() => go('menu')} onBoard={() => go('team')} />
    );
    case 'practice': return <Practice back={() => go('menu')} />;
    case 'team': return <Team comp={comp} setComp={setComp} onPlay={() => go('setup', 'team')} back={() => go('menu')} />;
  }
}
