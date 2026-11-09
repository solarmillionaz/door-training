import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('https://solarmillionaz.github.io/sales-heads-up/'); await p.waitForURL('**/door-training/**', { timeout: 15000 });
console.log('redirected to', p.url(), '| title:', await p.title());
await b.close();
