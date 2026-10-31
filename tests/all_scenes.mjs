// Screenshot every registered scene with an appropriate player (intros skipped): node tests/all_scenes.mjs outdir [prefix]
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [out, prefix = ''] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://localhost:8123/?fast');
await page.waitForFunction(() => window.HYP && document.getElementById('loading').classList.contains('done'));
const ids = await page.evaluate((p) => Object.keys(HYP.REG.scenes).filter((s) => s.startsWith(p) && !s.endsWith('_stub')), prefix);
for (const id of ids) {
  await page.evaluate(async (id) => {
    HYP.menu.close(); HYP.game.newState();
    const tale = Object.values(HYP.REG.tales).find((t) => id.startsWith(t.id + '_'));
    HYP.game.state.player = tale ? tale.player : 'consul';
    HYP.game.goto(id); await new Promise((r) => setTimeout(r, 30)); await HYP.idle(8000);
  }, id);
  await page.screenshot({ path: `${out}/${id}.png`, clip: { x: 0, y: 0, width: 960, height: 410 } });
}
console.log(ids.length, 'scenes', errs.length ? errs : '');
await browser.close();
