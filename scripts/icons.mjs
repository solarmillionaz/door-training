import { chromium } from 'playwright';
const door = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
<rect width="100" height="100" fill="#0B1220"/>
<g transform="translate(${pad} ${pad}) scale(${(100 - 2 * pad) / 100})">
<rect x="26" y="8" width="48" height="84" rx="5" fill="#FACC15"/><rect x="33" y="15" width="34" height="70" rx="3" fill="#0B1220"/>
<circle cx="60" cy="52" r="3.6" fill="#FACC15"/>
<path d="M47 20l9 12h-5.5v10h-7V32H38z" fill="#16A34A"/><path d="M47 80l-9-12h5.5V58h7v10H56z" fill="#DC374B"/></g></svg>`;
const b = await chromium.launch();
for (const [name, size, pad] of [['icon-192.png', 192, 4], ['icon-512.png', 512, 4], ['apple-touch-icon.png', 180, 6], ['icon-maskable-512.png', 512, 16]]) {
  const p = await b.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<style>*{margin:0}body{width:${size}px;height:${size}px}</style>${door(pad)}`);
  await p.screenshot({ path: `public/${name}` }); await p.close();
}
await b.close(); console.log('icons ok');
