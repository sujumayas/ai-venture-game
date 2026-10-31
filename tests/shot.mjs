// Screenshot helper: node tests/shot.mjs "<query string>" <out.png> [extraWaitMs] [jsToEvalBeforeShot]
// e.g. node tests/shot.mjs "scene=priest_cleft&player=dure&debug" /tmp/cleft.png 800
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [q, out, wait = '600', js] = process.argv.slice(2);
const BASE = process.env.BASE || 'http://localhost:8123/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto(BASE + '?' + q);
await page.waitForFunction(() => window.HYP && document.getElementById('loading').classList.contains('done'), null, { timeout: 30000 });
await page.waitForTimeout(+wait);
if (js) await page.evaluate(js);
await page.waitForTimeout(200);
await page.screenshot({ path: out });
const e2 = await page.evaluate(() => HYP.errors());
if (errs.length || e2.length) console.log('errors:', [...errs, ...e2].join('\n'));
await browser.close();
