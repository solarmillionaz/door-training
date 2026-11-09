import { chromium, devices } from 'playwright';
const BASE = process.argv[2] || 'http://localhost:4173/';
const SHOTS = process.argv[3] || 'screenshots';
const ok = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('  ✓ ' + m); };
const browser = await chromium.launch();

async function newPage(landscape = false, perms = []) {
  const d = devices['iPhone 13'];
  const ctx = await browser.newContext({ ...d, ...(landscape ? { viewport: { width: d.viewport.height, height: d.viewport.width } } : {}) });
  if (perms.length) await ctx.grantPermissions(perms);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => { console.error('PAGE ERROR', e); process.exitCode = 1; });
  await page.clock.install();
  await page.goto(BASE);
  return page;
}
const btn = (page, name) => page.getByRole('button', { name, exact: false }).first();

// 1) Menu, how to, category
{
  console.log('Menu / How to / Category');
  const page = await newPage();
  await page.getByText('SALES HEADS UP!').first().waitFor();
  ok(await page.getByText('OBJECTIONS • SMOKESCREENS • CONCERNS').isVisible(), 'menu tagline');
  ok(await page.getByText('Win More Deals.').isVisible(), 'subtitle');
  for (const b of ['Start Game', 'How to Play', 'Choose Category', 'Practice Mode']) ok(await btn(page, b).isVisible(), `button ${b}`);
  await page.clock.runFor(1500);
  await page.screenshot({ path: `${SHOTS}/01-menu.png`, animations: 'disabled' });
  await btn(page, 'How to Play').click();
  ok(await page.getByText('not affiliated with or endorsed by them').isVisible(), 'coach disclaimer in How to Play');
  ok(await page.getByText('Chris Voss').isVisible(), 'coach list');
  await page.screenshot({ path: `${SHOTS}/02-howto.png`, fullPage: true, animations: 'disabled' });
  await btn(page, 'Back').click();
  await btn(page, 'Choose Category').click();
  await page.clock.runFor(800);
  await page.screenshot({ path: `${SHOTS}/03-category.png`, animations: 'disabled' });
  await page.getByRole('button', { name: /Smokescreens/ }).click();
  ok(await page.getByText('Game Setup').isVisible(), 'picking category opens setup');
  ok(await page.getByText('Smokescreens').first().isVisible(), 'category shown in setup');
  await page.getByRole('radio', { name: /90/ }).click();
  ok((await page.getByRole('radio', { name: /90/ }).getAttribute('aria-checked')) === 'true', 'time selector');
  await page.getByRole('radio', { name: /60/ }).click();
  await page.screenshot({ path: `${SHOTS}/04-setup.png`, animations: 'disabled' });
  await page.context().close();
}

// 2) Solo round with buttons + keyboard + swipe-free, timer end (landscape)
{
  console.log('Solo round (landscape)');
  const page = await newPage(true);
  await btn(page, 'Start Game').click();
  await btn(page, "Let’s Go").click();
  await btn(page, 'Buttons / Swipe Only').click();
  ok(await page.getByTestId('countdown').isVisible(), 'countdown shows');
  await page.clock.runFor(3200);
  await page.getByTestId('play').waitFor();
  ok(await page.getByTestId('timer').innerText() === '60', 'timer starts at 60');
  const seen = new Set([await page.getByTestId('statement').innerText()]);
  await page.screenshot({ path: `${SHOTS}/05-play-landscape.png`, animations: 'disabled' });
  await page.getByRole('button', { name: 'Correct' }).first().click();
  await page.getByRole('button', { name: 'Correct' }).first().click(); // instant double tap -> ignored
  await page.clock.runFor(400);
  seen.add(await page.getByTestId('statement').innerText());
  await page.getByRole('button', { name: 'Pass' }).first().click();
  await page.clock.runFor(400);
  seen.add(await page.getByTestId('statement').innerText());
  await page.keyboard.press('ArrowUp');
  await page.clock.runFor(400);
  seen.add(await page.getByTestId('statement').innerText());
  await page.keyboard.press('ArrowDown');
  await page.clock.runFor(400);
  seen.add(await page.getByTestId('statement').innerText());
  ok(seen.size === 5, 'five distinct cards shown (no repeats)');
  ok((await page.getByTestId('score').innerText()).includes('2'), 'score 2 after 2 correct (double-tap ignored)');
  await page.clock.runFor(10000);
  const t = Number(await page.getByTestId('timer').innerText());
  ok(t <= 49 && t >= 47, `timer counts down (${t})`);
  await page.clock.runFor(52000);
  await page.getByText('ROUND COMPLETE!').waitFor();
  ok(await page.getByTestId('stat-correct').innerText() === '2', 'results correct 2');
  ok(await page.getByTestId('stat-skipped').innerText() === '2', 'results skipped 2');
  ok(await page.getByTestId('stat-accuracy').innerText() === '50%', 'accuracy 50%');
  ok(await page.getByTestId('stat-attempted').innerText() === '4', 'attempted 4');
  ok(await page.getByTestId('best').innerText() === '2', 'personal best 2');
  await page.screenshot({ path: `${SHOTS}/06-results.png`, fullPage: true, animations: 'disabled' });
  await btn(page, 'Play Again').click();
  ok(await page.getByText('Phone on your forehead').isVisible(), 'play again goes to ready');
  await btn(page, 'Buttons / Swipe Only').click();
  await page.clock.runFor(3200);
  await page.getByTestId('play').waitFor();
  await page.clock.runFor(61000);
  await page.getByText('ROUND COMPLETE!').waitFor();
  await btn(page, 'Change Category').click();
  ok(await page.getByText('Choose Category').isVisible(), 'change category opens picker');
  await page.getByRole('button', { name: /Real Concerns/ }).click();
  ok(await page.getByText('Real Concerns').first().isVisible(), 'returns to setup with new category');
  await page.context().close();
}

// 3) Tilt via simulated deviceorientation (landscape on forehead: gamma ~ 90 is vertical)
{
  console.log('Tilt round (simulated sensors)');
  const page = await newPage(true, ['accelerometer', 'gyroscope', 'magnetometer']);
  const orient = (beta, gamma) => page.evaluate(([b, g]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: 0, beta: b, gamma: g })), [beta, gamma]);
  await btn(page, 'Start Game').click();
  await btn(page, "Let’s Go").click();
  await page.getByRole('button', { name: /Tilt.*Start|Start with Tilt/ }).click();
  for (let i = 0; i < 6; i++) { await orient(2, 85); await page.clock.runFor(450); }
  await page.getByTestId('play').waitFor();
  const s0 = await page.getByTestId('statement').innerText();
  await orient(2, 80); await page.clock.runFor(100);
  ok(await page.getByTestId('statement').innerText() === s0, 'small movement does not score');
  await orient(5, 35); await page.clock.runFor(50);   // tilt back (screen to ceiling)
  await orient(5, 30); await page.clock.runFor(50);   // still tilted -> no double
  ok((await page.getByTestId('score').innerText()).includes('1'), 'tilt up = correct once');
  await orient(2, 85); await page.clock.runFor(800);  // back to neutral
  await orient(178, 40); await page.clock.runFor(50); // tilt forward (screen to floor), beta flips
  await orient(2, 85); await page.clock.runFor(800);
  await orient(5, 35); await page.clock.runFor(50);
  ok((await page.getByTestId('score').innerText()).includes('2'), 'second tilt up after neutral scores');
  await page.clock.runFor(61000);
  await page.getByText('ROUND COMPLETE!').waitFor();
  ok(await page.getByTestId('stat-skipped').innerText() === '1', 'tilt down = pass recorded');
  ok(await page.getByTestId('stat-correct').innerText() === '2', 'tilt correct 2');
  await page.context().close();
}

// 4) Team competition
{
  console.log('Team competition');
  const page = await newPage();
  await btn(page, 'Team Competition').click();
  await page.getByLabel('Team 1 name').fill('Closers');
  await page.getByLabel('Team 2 name').fill('Door Kings');
  await btn(page, 'Add Team').click();
  await page.getByLabel('Team 3 name').fill('Sun Setters');
  await btn(page, 'Start Competition').click();
  const play = async (correct, pass) => {
    await btn(page, 'Play Turn').click();
    await btn(page, "Let’s Go").click();
    await btn(page, 'Buttons / Swipe Only').click();
    await page.clock.runFor(3200);
    for (let i = 0; i < correct; i++) { await page.getByRole('button', { name: 'Correct' }).last().click(); await page.clock.runFor(400); }
    for (let i = 0; i < pass; i++) { await page.getByRole('button', { name: 'Pass' }).last().click(); await page.clock.runFor(400); }
    await page.clock.runFor(61000);
    await page.getByText('ROUND COMPLETE!').waitFor();
    await btn(page, 'Leaderboard').click();
  };
  await play(3, 3); // Closers 3 @50%
  await play(3, 1); // Door Kings 3 @75%
  await play(1, 0); // Sun Setters 1
  const rows = await page.getByTestId('leaderboard').locator('li').allInnerTexts();
  ok(rows[0].includes('Door Kings') && rows[1].includes('Closers') && rows[2].includes('Sun Setters'), 'leaderboard ranked by correct, accuracy tiebreak');
  ok(await page.getByText('Play Turn: Closers').isVisible(), 'turn rotates back to first team');
  await page.clock.runFor(1000);
  await page.screenshot({ path: `${SHOTS}/07-leaderboard.png`, fullPage: true, animations: 'disabled' });
  await page.reload();
  await btn(page, 'Team Competition').click();
  ok((await page.getByTestId('leaderboard').locator('li').count()) === 3, 'leaderboard persists after reload');
  await btn(page, 'Reset Competition').click();
  await btn(page, 'Yes, Reset').click();
  ok(await btn(page, 'Start Competition').isVisible(), 'reset competition clears');
  await page.context().close();
}

// 5) Practice mode
{
  console.log('Practice mode');
  const page = await newPage();
  await btn(page, 'Practice Mode').click();
  ok(!(await page.getByTestId('coaching').isVisible().catch(() => false)), 'coaching hidden before attempt');
  await btn(page, 'Reveal Coaching').click();
  const txt = await page.getByTestId('coaching').innerText();
  for (const k of ['CLASSIFICATION', 'WHAT THEY MIGHT MEAN', 'CLARIFYING QUESTION', 'EXAMPLE RESPONSE', 'INSPIRED BY']) ok(txt.toUpperCase().includes(k), `coaching shows ${k}`);
  await page.clock.runFor(800);
  await page.screenshot({ path: `${SHOTS}/08-practice.png`, fullPage: true, animations: 'disabled' });
  await page.getByTestId('coach-filter').selectOption('voss');
  const count = await page.getByTestId('practice-count').innerText();
  const n = Number(count.split('/')[1]);
  ok(n > 0 && n < 20, `coach filter narrows cards (${count})`);
  for (let i = 0; i < n; i++) {
    await btn(page, 'Reveal Coaching').click();
    ok((await page.getByTestId('coaching').innerText()).includes('Chris Voss'), `card ${i + 1} inspired by Chris Voss`);
    await btn(page, 'Next').click();
  }
  await page.context().close();
}
await browser.close();
console.log('ALL E2E CHECKS PASSED');
