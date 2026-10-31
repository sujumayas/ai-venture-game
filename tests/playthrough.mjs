// Automated playthrough: runs tests/walkthroughs/<chapter>.json in fast mode, in EN and ES.
// Usage: node tests/playthrough.mjs [chapter ...] [--lang=es] [--shots]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE || 'http://localhost:8123/';
const args = process.argv.slice(2);
const lang = (args.find((a) => a.startsWith('--lang=')) || '--lang=en').split('=')[1];
const shots = args.includes('--shots');
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), 'walkthroughs');
let chapters = args.filter((a) => !a.startsWith('--'));
if (!chapters.length) chapters = JSON.parse(fs.readFileSync(path.join(dir, 'order.json'), 'utf8'));
const outDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'out');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
let failures = 0;
for (const ch of chapters) {
  const steps = JSON.parse(fs.readFileSync(path.join(dir, ch + '.json'), 'utf8'));
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(`${BASE}?fast&lang=${lang}`);
  await page.waitForFunction(() => window.HYP && document.getElementById('loading').classList.contains('done'), null, { timeout: 30000 });
  let ok = true, i = 0, last = null;
  for (const st of steps) {
    i++;
    const [op, a, b] = st;
    try {
      if (op === 'start') {
        last = await page.evaluate(async (id) => { HYP.menu.close(); HYP.game.newState(); HYP.game.startChapter(id); await new Promise((r) => setTimeout(r, 50)); return HYP.idle(); }, a);
      } else if (op === 'tale') {
        last = await page.evaluate(async (id) => { HYP.menu.close(); HYP.game.newState(); HYP.game.state.chapter = HYP.REG.tales[id].chapter; HYP.game.startTale(id); await new Promise((r) => setTimeout(r, 50)); return HYP.idle(); }, a);
      } else if (op === 'scene') {
        last = await page.evaluate(async ([id, pl]) => { HYP.menu.close(); HYP.game.newState(); if (pl) HYP.game.state.player = pl; HYP.game.goto(id); await new Promise((r) => setTimeout(r, 50)); return HYP.idle(); }, [a, b]);
      } else if (op === 'endtale') {
        last = await page.evaluate(async () => { if (!HYP.game.state.tale) return HYP.idle(); HYP.game.busyCount = 0; HYP.game.endTale(); await new Promise((r) => setTimeout(r, 50)); return HYP.idle(); });
      } else if (op === 'flag') {
        await page.evaluate(([k, v]) => HYP.game.set(k, v ?? true), [a, b]);
      } else if (op === 'give') {
        await page.evaluate((it) => HYP.game.give(it, true), a);
      } else if (op === 'act') last = await page.evaluate(([v, id]) => HYP.act(v, id), [a, b]);
      else if (op === 'use') last = await page.evaluate(([it, id]) => HYP.use(it, id), [a, b]);
      else if (op === 'inv') last = await page.evaluate(([v, it]) => HYP.inv(v, it), [a, b]);
      else if (op === 'choose') last = await page.evaluate((id) => HYP.choose(id), a);
      else if (op === 'walk') last = await page.evaluate(async ([x, y]) => { await HYP.game.walkTo(x, y); return HYP.idle(); }, [a, b]);
      else if (op === 'expect') {
        const s = await page.evaluate(() => ({ ...HYP.state(), idle: !HYP.game.busy }));
        for (const [k, v] of Object.entries(a)) {
          if (k === 'has') { if (!s.inv.includes(v)) throw new Error(`expected item ${v}, inv=${s.inv}`); }
          else if (k === 'flag') { if (!s.flags[v]) throw new Error(`expected flag ${v}`); }
          else if (k === 'tale') { if (s.tale !== v) throw new Error(`expected tale=${v}, got ${s.tale}`); }
          else if (s[k] !== v) throw new Error(`expected ${k}=${v}, got ${s[k]}`);
        }
      } else if (op === 'shot') {
        await page.screenshot({ path: path.join(outDir, `${ch}_${lang}_${a}.png`) });
      } else throw new Error('unknown op ' + op);
      if (last && last.status === 'timeout') throw new Error('timeout waiting for idle: ' + JSON.stringify(last));
      if (shots && op !== 'expect' && op !== 'shot') await page.screenshot({ path: path.join(outDir, `${ch}_${lang}_${String(i).padStart(3, '0')}.png`) });
    } catch (e) {
      ok = false;
      console.log(`  ✗ ${ch} step ${i} ${JSON.stringify(st)}: ${e.message}`);
      console.log('    last:', JSON.stringify(last));
      console.log('    targets:', JSON.stringify(await page.evaluate(() => HYP.targets().map((t) => t.id))));
      await page.screenshot({ path: path.join(outDir, `${ch}_${lang}_FAIL.png`) });
      break;
    }
  }
  const gameErrs = await page.evaluate(() => HYP.errors());
  const allErrs = [...errs, ...gameErrs];
  if (allErrs.length) { ok = false; console.log(`  ✗ ${ch} errors:\n    ` + allErrs.slice(0, 15).join('\n    ')); }
  // untranslated check: any visible text identical in both languages is fine; we check for missing es strings at build time instead
  console.log(`${ok ? '✓' : '✗'} ${ch} (${lang}) — ${i}/${steps.length} steps, final scene ${last && last.scene}, chapter ${last && last.chapter}`);
  if (!ok) failures++;
  await page.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
