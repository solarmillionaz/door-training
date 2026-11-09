import { chromium } from 'playwright';
import fs from 'fs';
const qr = fs.readFileSync('deliverables/door-training-qr.png').toString('base64');
const font = (w) => fs.readFileSync(`node_modules/@fontsource/montserrat/files/montserrat-latin-${w}-normal.woff2`).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face{font-family:M;font-weight:800;src:url(data:font/woff2;base64,${font(800)})}
@font-face{font-family:M;font-weight:900;src:url(data:font/woff2;base64,${font(900)})}
*{margin:0;box-sizing:border-box}
body{width:1920px;height:1080px;font-family:M,sans-serif;color:#fff;overflow:hidden;
background:radial-gradient(1400px 700px at 50% -10%,#1d2f5c 0%,#0B1220 55%,#03050a 100%);position:relative}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding-top:44px}
.brand{font-weight:800;letter-spacing:.4em;color:rgba(255,255,255,.55);font-size:22px}
h1{font-weight:900;font-size:112px;color:#FACC15;line-height:1;margin-top:10px;text-shadow:0 0 40px rgba(250,204,21,.45),0 7px 0 #a16207}
.tag{font-weight:900;font-size:32px;letter-spacing:.16em;margin-top:12px}
.mid{display:flex;align-items:center;gap:70px;margin-top:34px}
.tile{margin-top:26px;background:#fff;border-radius:36px;padding:18px;box-shadow:0 0 0 8px #FACC15,0 30px 80px rgba(0,0,0,.6)}
.tile img{width:560px;height:560px;display:block;image-rendering:pixelated}
.side{display:flex;flex-direction:column;gap:30px;width:470px}
.scan{font-weight:900;font-size:60px;color:#FACC15;line-height:1;margin-top:26px;letter-spacing:.04em}
.pills{display:flex;gap:34px;margin-top:20px}
.pill{white-space:nowrap;font-weight:900;font-size:36px;padding:14px 30px;border-radius:24px;display:flex;align-items:center;gap:18px}
.go{background:#16A34A;box-shadow:0 8px 0 #0f6b30}.stop{background:#DC374B;box-shadow:0 8px 0 #8f1f2f}
.arrow{font-size:44px}
.bottom{position:absolute;bottom:34px;left:0;right:0;text-align:center;font-weight:800;font-size:40px}
.bottom b{color:#FACC15;font-weight:900}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(90deg,#DC374B,#FACC15,#16A34A)}

.mid{display:flex;align-items:center;justify-content:center;gap:56px;margin-top:34px;width:100%}
.col{width:520px;display:flex;flex-direction:column;gap:24px}
.left{align-items:flex-end;text-align:right}
.left .pill{width:400px;justify-content:flex-start;text-align:left;line-height:1.05}
.tile{margin-top:0}
.a2hs{background:rgba(255,255,255,.06);border:3px solid #FACC15;border-radius:28px;padding:28px 30px;gap:10px}
.a2t{font-weight:900;font-size:36px;color:#FACC15;margin-bottom:6px}
.os{font-weight:900;font-size:24px;letter-spacing:.12em;color:rgba(255,255,255,.65);margin-top:10px}
.step{font-weight:800;font-size:30px;line-height:1.25}
.step b{color:#fff;font-weight:900}
.scan{margin-top:0!important;font-size:68px!important}
</style></head><body><div class="wrap">
<div class="brand">AZ POWER PROGRAM</div>
<h1>DOOR TRAINING!</h1>
<div class="tag">OBJECTIONS • SMOKESCREENS • CONCERNS</div>
<div class="mid">
  <div class="col left">
    <div class="scan">SCAN<br>TO PLAY</div>
    <div class="pill go"><span class="arrow">⬆</span>TILT UP =<br>CORRECT</div>
    <div class="pill stop"><span class="arrow">⬇</span>TILT DOWN =<br>PASS</div>
  </div>
  <div class="tile"><img src="data:image/png;base64,${qr}"></div>
  <div class="col a2hs">
    <div class="a2t">📲 ADD TO HOME SCREEN</div>
    <div class="os">iPHONE · SAFARI</div>
    <div class="step">Tap <b>Share</b> ⬆️ → <b>“Add to Home Screen”</b> → <b>Add</b></div>
    <div class="os">ANDROID · CHROME</div>
    <div class="step">Tap <b>⋮</b> menu → <b>“Add to Home screen”</b> or <b>“Install app”</b></div>
  </div>
</div>
</div>
<div class="bottom">Think Fast. Respond Better. <b>Win More Deals.</b></div>
<div class="bar"></div>
</body></html>`;
fs.writeFileSync('deliverables/trainer-slide.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.setContent(html); await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'deliverables/trainer-slide.png' });
await p.pdf({ path: 'deliverables/trainer-slide.pdf', width: '1920px', height: '1080px', printBackground: true, pageRanges: '1' });
await b.close(); console.log('slide ok');
