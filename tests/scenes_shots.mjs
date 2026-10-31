// Screenshot a list of scenes (intros skipped) for visual QA: node tests/scenes_shots.mjs out_dir scene1 scene2 ...
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [out, ...scenes] = process.argv.slice(2);
const BASE = process.env.BASE || 'http://localhost:8123/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
await page.goto(BASE + '?fast');
await page.waitForFunction(() => window.HYP && document.getElementById('loading').classList.contains('done'));
for (const s of scenes) {
  await page.evaluate(async (id) => { HYP.menu.close(); HYP.game.newState(); HYP.game.state.player = 'consul'; HYP.game.goto(id); await new Promise((r) => setTimeout(r, 30)); await HYP.idle(); }, s);
  await page.evaluate(() => { HYP.game.fast = false; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${s}.png` });
  await page.evaluate(() => { HYP.game.fast = true; });
}
await browser.close();
