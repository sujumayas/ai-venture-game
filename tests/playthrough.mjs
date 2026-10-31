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
const warnings = [];
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
      } else if (op === 'act' || op === 'use') {
        // clickability check: can a real mouse hit this target somewhere?
        const tid = op === 'act' ? b : b;
        const ok2 = await page.evaluate((id) => {
          const g = HYP.game; if (HYP.REG.items[id] && g.has(id)) return true;
          const tg = g.findTarget(id); if (!tg) return 'missing';
          let box;
          if (tg.kind === 'actor') { const a = tg.act || g.actors[id]; box = g.actorBox(a); }
          else { const d = tg.def; box = d.rect ? { x: d.rect[0], y: d.rect[1], w: d.rect[2], h: d.rect[3] } : d.circle ? { x: d.circle[0] - d.circle[2], y: d.circle[1] - d.circle[2], w: d.circle[2] * 2, h: d.circle[2] * 2 } : (() => { const xs = d.poly.map((p) => p[0]), ys = d.poly.map((p) => p[1]); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; })(); }
          let hits = 0, tot = 0;
          for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) {
            const x = box.x + box.w * i / 8, y = box.y + box.h * j / 8;
            if (x < 0 || y < 0 || x > 1920 || y > 820) continue;
            tot++; const t = g.targetAt(x, y); if (t && t.id === id) hits++;
          }
          return tot ? hits / tot : 0;
        }, tid);
        if (ok2 === 'missing') throw new Error('target not present: ' + tid);
        if (ok2 !== true && ok2 < 0.08) warnings.push(`${ch}: step ${i} target "${tid}" hard to click (${Math.round(ok2 * 100)}% of its box) in ${await page.evaluate(() => HYP.game.state.scene)}`);
        last = op === 'act' ? await page.evaluate(([v, id]) => HYP.act(v, id), [a, b]) : await page.evaluate(([it, id]) => HYP.use(it, id), [a, b]);
      }
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
if (warnings.length) console.log('WARNINGS:\n  ' + [...new Set(warnings)].join('\n  '));
await browser.close();
process.exit(failures ? 1 : 0);
