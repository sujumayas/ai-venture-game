// Boot: create the game, load content, show the title screen, expose a test/debug API.
import { Game, REG } from './engine/engine.js';
import { Menu } from './engine/menu.js';
import { tr } from './engine/i18n.js';
import { audio } from './engine/audio.js';
import { CONFIG } from './content/index.js';

const game = new Game();
game.init();
const menu = new Menu(game, CONFIG);

async function boot() {
  const fill = document.getElementById('loading-fill');
  const list = CONFIG.preload || [];
  let n = 0;
  await Promise.all([document.fonts.ready, ...list.map((s) => game.loadImg(s).then(() => { n++; fill.style.width = (100 * n / list.length) + '%'; }))]);
  fill.style.width = '100%';
  document.getElementById('loading').classList.add('done');
  const p = new URLSearchParams(location.search);
  if (p.get('chapter')) { game.newState(); await game.startChapter(p.get('chapter'), { noCard: p.has('nocard') }); }
  else if (p.get('scene')) { game.newState(); if (p.get('player')) game.state.player = p.get('player'); await game.goto(p.get('scene')); }
  else menu.title();
}
boot();

// ---------------------------------------------------------------- Test / debug API (used by automated playtests)
window.HYP = {
  game, REG, audio,
  /** Wait until the game is idle or waiting on a dialogue choice. */
  async idle(timeout = 30000) {
    const t0 = performance.now();
    while (performance.now() - t0 < timeout) {
      if (game.choiceFn) return { status: 'choice', options: game.choiceOpts.map((o) => ({ id: o.id, text: tr(o.text) })) };
      if (game.advanceFn) { game.advance(); await new Promise((r) => setTimeout(r, 5)); continue; }
      if (!game.busy && !menu.open) return { status: 'idle', scene: game.state.scene, chapter: game.state.chapter, player: game.state.player, inv: [...game.state.inv] };
      if (!game.busy && menu.open) return { status: 'menu', mode: menu.mode };
      await new Promise((r) => setTimeout(r, 10));
    }
    return { status: 'timeout', scene: game.state.scene, busy: game.busyCount };
  },
  targets() {
    const hs = game.visibleHotspots().map((h) => ({ id: h.id, kind: 'hotspot', name: tr(h.name), exit: h.exit || null }));
    const as = Object.values(game.actors).filter((a) => !a.def.isPlayer).map((a) => ({ id: a.id, kind: 'actor', name: tr(a.def.name || (REG.chars[a.id] || {}).name) }));
    return [...as, ...hs];
  },
  act(verb, id) { game.act(verb, id); return this.idle(); },
  use(item, id) {
    if (REG.items[id] && game.has(id)) { // item on item
      const A = REG.items[item] || {}, B = REG.items[id] || {};
      game.run((A.combine && A.combine[id]) || (B.combine && B.combine[item]));
    } else game.act('item', id, item);
    return this.idle();
  },
  inv(verb, item) { game.verb = verb === 'walk' ? null : verb; game.invClick(item, verb === 'look'); return this.idle(); },
  choose(id) { if (!game.choiceFn) throw new Error('No choice pending'); const o = game.choiceOpts.find((x) => x.id === id || x.text.en === id); if (!o) throw new Error('No option ' + id + ' in ' + game.choiceOpts.map((x) => x.id).join(',')); game.choiceFn(o.id); return this.idle(); },
  state() { return JSON.parse(JSON.stringify(game.state)); },
  errors() { return game.errors.slice(); },
  menu,
};
