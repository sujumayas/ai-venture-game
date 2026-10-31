// HYPERION point-and-click engine: scenes, actors, verbs, inventory, dialogue, comic panels, saves.
import { t, tr, L, UI, DEFAULTS, setLang } from './i18n.js';
import * as geom from './geom.js';
import { audio } from './audio.js';

export const REG = { scenes: {}, chapters: [], chars: {}, items: {}, tales: {} };
export const defineScene = (def) => (REG.scenes[def.id] = def);
export const defineChapter = (def) => { REG.chapters.push(def); return def; };
export const defineChars = (obj) => Object.assign(REG.chars, obj);
export const defineItems = (obj) => Object.assign(REG.items, obj);
/** A pilgrim's tale: { id, chapter, kicker, title, sub, cardImg, player, inv, start, startPos, intro } */
export const defineTale = (def) => (REG.tales[def.id] = def);

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const W = 1920, SCENE_H = 820;
const params = new URLSearchParams(location.search);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function freshState() {
  return { v: 1, chapter: null, scene: null, player: 'consul', flags: {}, inv: [], pos: null, place: {} };
}

const SETTINGS_KEY = 'hyperion.settings';
function loadSettings() {
  const def = { lang: (navigator.language || 'en').startsWith('es') ? 'es' : 'en', textSpeed: 1, sound: true, reached: [], reviewer: false, grade: 'd' };
  try { return Object.assign(def, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')); } catch (e) { return def; }
}

export class Game {
  constructor() {
    this.state = freshState();
    this.settings = loadSettings();
    if (params.get('lang')) this.settings.lang = params.get('lang');
    setLang(this.settings.lang);
    this.fast = params.has('fast');
    this.debug = params.has('debug');
    this.verb = null; this.item = null;
    this.busyCount = 0; this.actors = {}; this.walkPolys = [];
    this.advanceFn = null; this.choiceFn = null; this.choiceOpts = null;
    this.talkingTo = null; this.hover = null; this.invOffset = 0;
    this.mouse = [0, 0]; this.stageScale = 1;
    this.scene = null; this.lastTime = 0; this.errors = [];
    this.imgCache = new Map();
    audio.enabled = this.settings.sound;
    audio.musicOn = this.settings.music !== false;
    document.body.classList.toggle('grade-d', this.settings.grade === 'd');
  }

  // ------------------------------------------------------------------ setup
  init() {
    this.fit(); window.addEventListener('resize', () => this.fit());
    this.buildVerbs();
    const sc = $('scene');
    sc.addEventListener('mousemove', (e) => this.onMove(e));
    sc.addEventListener('mouseleave', () => { this.hover = null; this.updateHover(); });
    sc.addEventListener('click', (e) => this.onClick(e, false));
    sc.addEventListener('contextmenu', (e) => { e.preventDefault(); this.onClick(e, true); });
    $('panel-layer').addEventListener('click', () => this.advance());
    $('card-layer').addEventListener('click', () => this.advance());
    $('ui').addEventListener('contextmenu', (e) => e.preventDefault());
    $('inv-up').addEventListener('click', () => { this.invOffset = Math.max(0, this.invOffset - 6); this.renderInv(); });
    $('inv-down').addEventListener('click', () => { this.invOffset += 6; this.renderInv(); });
    $('menu-btn').addEventListener('click', () => this.menu && this.menu.pause());
    window.addEventListener('keydown', (e) => this.onKey(e));
    window.addEventListener('keyup', (e) => { if (e.key === 'Tab') this.showHotspots(false); });
    window.addEventListener('pointerdown', () => audio.ensure(), { once: false });
    requestAnimationFrame((ts) => this.loop(ts));
    window.addEventListener('error', (e) => this.errors.push(String(e.message)));
    window.addEventListener('unhandledrejection', (e) => this.errors.push(String(e.reason && (e.reason.stack || e.reason))));
  }

  fit() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.min(vw / 1920, vh / 1080);
    this.stageScale = s;
    const st = $('stage');
    st.style.transform = `translate(${(vw - 1920 * s) / 2}px, ${(vh - 1080 * s) / 2}px) scale(${s})`;
  }

  saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch (e) { } }
  setLanguage(lang) { this.settings.lang = lang; setLang(lang); this.saveSettings(); this.buildVerbs(); this.renderInv(); this.updateHover(); }

  // ------------------------------------------------------------------ busy / script running
  get busy() { return this.busyCount > 0; }
  lock() { this.busyCount++; this.syncBusy(); }
  unlock() { this.busyCount = Math.max(0, this.busyCount - 1); this.syncBusy(); }
  syncBusy() {
    $('scene').classList.toggle('busy', this.busy && !this.choiceFn);
    $('ui').classList.toggle('locked', this.busy);
    if (this.busy) { $('hover-label').style.display = 'none'; }
    if (!this.busy) this.updateHover();
  }
  /** Run a script function with the UI locked. */
  async run(fn, ...args) {
    if (!fn) return;
    this.lock();
    try {
      if (typeof fn === 'function') await fn(this, ...args);
      else await this.say('player', fn);
    } catch (e) {
      console.error(e); this.errors.push(String(e && (e.stack || e)));
    } finally { this.unlock(); this.refresh(); }
  }

  // ------------------------------------------------------------------ state helpers (script API)
  f(name) { return this.state.flags[name]; }
  set(name, v = true) { this.state.flags[name] = v; }
  inc(name, by = 1) { this.state.flags[name] = (this.state.flags[name] || 0) + by; return this.state.flags[name]; }
  has(item) { return this.state.inv.includes(item); }
  give(item, quiet = false) {
    if (!this.has(item)) this.state.inv.push(item);
    this.renderInv();
    if (!quiet) { audio.sfx('pickup'); const it = REG.items[item]; this.toast(`${tr(UI.newItem)} ${tr(it ? it.name : item)}`, it && it.icon); }
  }
  drop(item) { this.state.inv = this.state.inv.filter((i) => i !== item); if (this.item === item) this.item = null; this.renderInv(); }
  clearInv() { this.state.inv = []; this.item = null; this.renderInv(); }
  sfx(n) { audio.sfx(n); }
  get player() { return this.state.player; }
  wait(ms) { return sleep(this.fast ? 0 : ms); }

  toast(text, icon) {
    const el = $('toast');
    el.innerHTML = (icon ? `<img src="${icon}" alt="">` : '') + `<span>${text}</span>`;
    el.classList.add('show'); clearTimeout(this.toastT);
    this.toastT = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ------------------------------------------------------------------ images
  loadImg(src) {
    if (!src) return Promise.resolve(null);
    if (this.imgCache.has(src)) return this.imgCache.get(src);
    const p = new Promise((res) => {
      const im = new Image(); im.decoding = 'async';
      im.onload = () => res(im);
      im.onerror = () => { this.errors.push('missing image: ' + src); res(null); };
      im.src = src;
    });
    this.imgCache.set(src, p);
    return p;
  }
  preload(list) { return Promise.all(list.filter(Boolean).map((s) => this.loadImg(s))); }

  // ------------------------------------------------------------------ scenes
  sceneDef(id) { const s = REG.scenes[id]; if (!s) throw new Error('Unknown scene ' + id); return s; }

  async goto(id, entry = {}, opts = {}) {
    const def = this.sceneDef(id);
    this.lock();
    try {
      if (!opts.noFade) await this.fade(true);
      this.clearText();
      this.state.scene = id;
      this.scene = def;
      const pl = REG.chars[this.state.player];
      const start = entry.x != null ? entry : (def.start || { x: 960, y: 700 });
      this.state.pos = { x: start.x, y: start.y, dir: start.dir || 'right' };
      await this.preload([def.bg, ...(def.fg || []).map((f) => f.img), pl && pl.sprite, ...(def.actors || []).map((a) => REG.chars[a.id] && REG.chars[a.id].sprite)]);
      $('bg').style.backgroundImage = def.bg ? `url("${def.bg}")` : 'none';
      $('bg').style.backgroundPosition = def.bgPos || 'center';
      $('bg').style.filter = def.bgFilter || '';
      this.walkPolys = geom.normalizeWalk(def.walk || []);
      this.buildFg();
      this.actors = {};
      $('actors').innerHTML = '';
      this.refresh();
      audio.ambience(def.ambience || 'none');
      if (!this.fast) audio.music(def.music !== undefined ? def.music : (this.musicFor ? this.musicFor(id) : null));
      if (this.debug) this.drawDebug();
      if (!opts.noFade) await this.fade(false);
      if (def.enter) await this.run(def.enter, { loaded: !!opts.loaded });
    } finally { this.unlock(); }
    if (!opts.noSave && this.state.scene === id) this.autosave();
  }

  buildFg() {
    const fg = $('fg'); fg.innerHTML = '';
    for (const f of this.scene.fg || []) {
      const im = document.createElement('img'); im.src = f.img;
      Object.assign(im.style, { left: f.x + 'px', top: f.y + 'px', width: (f.w ? f.w + 'px' : 'auto'), zIndex: 10000 });
      fg.appendChild(im);
    }
  }

  scaleAt(y) {
    const s = this.scene && this.scene.scale;
    if (!s) return 1;
    const [y1, s1, y2, s2] = s;
    const k = Math.max(0, Math.min(1, (y - y1) / (y2 - y1)));
    return s1 + (s2 - s1) * k;
  }

  /** Actors currently present: scene-defined NPCs (subject to `when`), placements, plus the player. */
  presentActors() {
    const list = [];
    const sc = this.scene; if (!sc) return list;
    const place = this.state.place[sc.id] || {};
    if (!sc.noPlayer && !this.f('hide:' + this.state.player)) {
      const p = this.state.pos || { x: 960, y: 700, dir: 'right' };
      list.push({ id: this.state.player, isPlayer: true, x: p.x, y: p.y, dir: p.dir });
    }
    for (const a of sc.actors || []) {
      if (a.id === this.state.player) continue;
      if (a.when && !a.when(this)) continue;
      const pl = place[a.id] || {};
      if (pl.hidden) continue;
      list.push(Object.assign({}, a, pl));
    }
    for (const id in place) {
      if (place[id].hidden || id === this.state.player) continue;
      if (!(sc.actors || []).some((a) => a.id === id)) list.push(Object.assign({ id }, place[id]));
    }
    return list;
  }

  /** Re-sync DOM actors with logic state. */
  refresh() {
    if (!this.scene) return;
    const want = this.presentActors();
    const ids = new Set(want.map((a) => a.id));
    for (const id of Object.keys(this.actors)) if (!ids.has(id)) { this.actors[id].el.remove(); delete this.actors[id]; }
    for (const a of want) {
      let act = this.actors[a.id];
      const ch = REG.chars[a.id] || { sprite: null, height: 500 };
      if (!act) {
        const el = document.createElement('div'); el.className = 'actor';
        if (ch.cls) el.classList.add(...ch.cls.split(' '));
        const im = document.createElement('img'); im.src = ch.sprite || ''; im.alt = '';
        im.draggable = false;
        el.appendChild(im); $('actors').appendChild(el);
        act = this.actors[a.id] = { id: a.id, el, img: im, x: a.x, y: a.y, dir: a.dir || 'right', path: null, def: a, ch };
      }
      act.def = a;
      if (!act.path) { act.x = a.x; act.y = a.y; if (a.dir) act.dir = a.dir; }
      if (a.cls) a.cls.split(' ').forEach((c) => act.el.classList.add(c));
      this.placeActor(act);
    }
    if (this.debug) this.drawDebug();
  }

  placeActor(act) {
    const ch = act.ch, s = this.scaleAt(act.y) * (ch.scale || 1) * (act.def.scale || 1);
    const h = (ch.height || 520) * s;
    const ratio = ch.ratio || (act.img.naturalWidth ? act.img.naturalWidth / act.img.naturalHeight : 0.55);
    const w = h * ratio;
    act.w = w; act.h = h;
    Object.assign(act.el.style, { width: w + 'px', height: h + 'px', left: (act.x - w / 2) + 'px', top: (act.y - h) + 'px', zIndex: Math.round(act.y) + (act.def.z || 0) });
    const native = ch.facing || 'right';
    act.img.classList.toggle('flip', act.dir !== native && act.dir !== 'front');
    act.el.style.opacity = act.def.opacity != null ? act.def.opacity : '';
  }

  actorBox(act) { return { x: act.x - act.w / 2, y: act.y - act.h, w: act.w, h: act.h }; }

  /** Move a non-player actor to a new placement (persisted). */
  place(id, x, y, dir, extra = {}) {
    const sc = this.state.scene; this.state.place[sc] = this.state.place[sc] || {};
    this.state.place[sc][id] = Object.assign({}, this.state.place[sc][id] || {}, { x, y, hidden: false }, dir ? { dir } : {}, extra);
    const a = this.actors[id]; if (a) { a.x = x; a.y = y; if (dir) a.dir = dir; }
    this.refresh();
  }
  hide(id) {
    if (id === 'player' || id === this.state.player) { this.set('hide:' + this.state.player); this.refresh(); return; }
    const sc = this.state.scene; this.state.place[sc] = this.state.place[sc] || {};
    this.state.place[sc][id] = Object.assign({}, this.state.place[sc][id] || {}, { hidden: true });
    this.refresh();
  }
  show(id, x, y, dir) {
    if (id === 'player' || id === this.state.player) { this.set('hide:' + this.state.player, false); this.refresh(); return; }
    const sc = this.state.scene; this.state.place[sc] = this.state.place[sc] || {};
    const cur = this.state.place[sc][id] || {};
    const base = (this.scene.actors || []).find((a) => a.id === id) || {};
    this.state.place[sc][id] = Object.assign({}, cur, { hidden: false, x: x ?? cur.x ?? base.x ?? 960, y: y ?? cur.y ?? base.y ?? 700 }, dir ? { dir } : {});
    this.refresh();
  }
  face(id, dir) {
    id = this.resolveId(id);
    const a = this.actors[id]; if (!a) return;
    if (typeof dir === 'string' && this.actors[dir]) dir = this.actors[dir].x < a.x ? 'left' : 'right';
    a.dir = dir; this.placeActor(a);
    if (id === this.state.player && this.state.pos) this.state.pos.dir = dir;
    else { const sc = this.state.scene; if (this.state.place[sc] && this.state.place[sc][id]) this.state.place[sc][id].dir = dir; }
  }
  resolveId(id) { return id === 'player' ? this.state.player : id; }

  /** Walk an actor along a path. Resolves on arrival. */
  walk(id, x, y, opts = {}) {
    id = this.resolveId(id);
    const a = this.actors[id];
    if (!a) return Promise.resolve();
    const path = opts.direct ? [[x, y]] : geom.findPath([a.x, a.y], [x, y], this.walkPolys);
    if (this.fast || opts.instant) {
      const last = path[path.length - 1] || [x, y];
      if (last[0] !== a.x) a.dir = last[0] < a.x ? 'left' : 'right';
      a.x = last[0]; a.y = last[1]; this.placeActor(a); this.syncActorState(a);
      return Promise.resolve();
    }
    return new Promise((res) => {
      if (a.resolveWalk) a.resolveWalk();
      a.path = path; a.resolveWalk = res; a.speed = opts.speed || a.ch.speed || 330;
      a.el.classList.add('walking');
    });
  }
  walkTo(x, y, opts) { return this.walk('player', x, y, opts); }
  stopWalking(id) { const a = this.actors[this.resolveId(id)]; if (a && a.path) { a.path = null; a.el.classList.remove('walking'); this.syncActorState(a); if (a.resolveWalk) { const r = a.resolveWalk; a.resolveWalk = null; r(); } } }

  syncActorState(a) {
    if (a.id === this.state.player) this.state.pos = { x: a.x, y: a.y, dir: a.dir };
    else {
      const sc = this.state.scene;
      if (this.state.place[sc] && this.state.place[sc][a.id]) Object.assign(this.state.place[sc][a.id], { x: a.x, y: a.y, dir: a.dir });
    }
  }

  loop(ts) {
    const dt = Math.min(0.05, (ts - (this.lastTime || ts)) / 1000); this.lastTime = ts;
    for (const a of Object.values(this.actors)) {
      if (!a.path) continue;
      const tgt = a.path[0];
      const s = this.scaleAt(a.y);
      const dx = tgt[0] - a.x, dy = tgt[1] - a.y, d = Math.hypot(dx, dy);
      const step = a.speed * Math.max(0.35, s) * dt;
      if (Math.abs(dx) > 2) a.dir = dx < 0 ? 'left' : 'right';
      if (d <= step) {
        a.x = tgt[0]; a.y = tgt[1]; a.path.shift();
        if (!a.path.length) {
          a.path = null; a.el.classList.remove('walking'); this.syncActorState(a);
          const r = a.resolveWalk; a.resolveWalk = null; if (r) r();
        }
      } else { a.x += dx / d * step; a.y += dy / d * step * 1.0; }
      this.placeActor(a);
      if (a.id === this.state.player) this.state.pos = { x: a.x, y: a.y, dir: a.dir };
    }
    requestAnimationFrame((t2) => this.loop(t2));
  }

  // ------------------------------------------------------------------ hotspots & input
  stagePoint(e) {
    const r = $('stage').getBoundingClientRect();
    return [(e.clientX - r.left) / this.stageScale, (e.clientY - r.top) / this.stageScale];
  }

  visibleHotspots() {
    const sc = this.scene; if (!sc) return [];
    return (sc.hotspots || []).filter((h) => !h.when || h.when(this));
  }

  /** Returns {kind:'actor'|'hotspot', def, name} at stage point. */
  targetAt(x, y) {
    const acts = Object.values(this.actors).filter((a) => !a.def.isPlayer && a.def.name !== null).sort((p, q) => q.y - p.y);
    for (const a of acts) {
      const b = this.actorBox(a);
      // shrink box a bit for better feel
      if (x >= b.x + b.w * 0.18 && x <= b.x + b.w * 0.82 && y >= b.y + b.h * 0.04 && y <= b.y + b.h) {
        return { kind: 'actor', id: a.id, def: a.def, act: a };
      }
    }
    const hs = this.visibleHotspots();
    for (let i = hs.length - 1; i >= 0; i--) if (geom.hitShape(x, y, hs[i])) return { kind: 'hotspot', id: hs[i].id, def: hs[i] };
    return null;
  }

  targetName(tg) {
    if (!tg) return '';
    if (tg.kind === 'actor') { const ch = REG.chars[tg.id]; return tr(tg.def.name || (ch && ch.name) || tg.id); }
    return tr(tg.def.name);
  }

  defaultVerb(tg) {
    if (!tg) return 'walk';
    if (tg.def.default) return tg.def.default;
    if (tg.def.exit) return 'walk';
    if (tg.kind === 'actor') return 'talk';
    return 'look';
  }

  onMove(e) {
    const [x, y] = this.stagePoint(e); this.mouse = [x, y];
    if (this.debug) $('debug-coords') && ($('debug-coords').textContent = `${Math.round(x)}, ${Math.round(y)}`);
    if (this.busy) return;
    this.hover = this.targetAt(x, y);
    this.updateHover();
  }

  sentence() {
    const tg = this.hover;
    if (this.item) {
      const it = REG.items[this.item];
      return `${tr(UI.verbs.use)} ${tr(it.name)} ${tr(UI.with)} ${tg ? this.targetName(tg) : (this.hoverItem ? tr(REG.items[this.hoverItem].name) : '')}`;
    }
    const verb = this.verb || this.defaultVerb(tg);
    if (this.hoverItem && !tg) return `${tr(UI.verbs[this.verb || 'look'])} ${tr(REG.items[this.hoverItem].name)}`;
    if (!tg) return this.verb ? tr(UI.verbs[this.verb]) : '';
    return `${tr(UI.verbs[verb])} ${this.targetName(tg)}`;
  }

  updateHover() {
    const lab = $('hover-label'), sc = $('scene');
    sc.classList.remove('hot', 'exit-l', 'exit-r', 'exit-u', 'exit-d');
    if (this.busy) { lab.style.display = 'none'; return; }
    $('sentence').textContent = this.sentence();
    const tg = this.hover;
    document.querySelectorAll('.verb').forEach((b) => b.classList.toggle('active', b.dataset.verb === (this.verb || (tg ? this.defaultVerb(tg) : null)) && !this.item));
    if (!tg) { lab.style.display = 'none'; return; }
    if (tg.def.exit) sc.classList.add('exit-' + (tg.def.exitDir || 'r')); else sc.classList.add('hot');
    lab.textContent = this.targetName(tg);
    lab.style.display = 'block';
    const [mx, my] = this.mouse;
    const lw = lab.offsetWidth;
    lab.style.left = Math.max(6, Math.min(W - lw - 6, mx - lw / 2)) + 'px';
    lab.style.top = Math.max(4, my - 64) + 'px';
  }

  onClick(e, right) {
    audio.ensure();
    if (this.advanceFn) { this.advance(); return; }
    if (this.busy) return;
    const [x, y] = this.stagePoint(e);
    const tg = this.targetAt(x, y);
    if (right) {
      if (this.item) { this.item = null; this.renderInv(); this.updateHover(); return; }
      if (tg) this.act('look', tg); else { this.verb = null; this.updateHover(); }
      return;
    }
    if (this.item && tg) { const it = this.item; this.item = null; this.renderInv(); this.act('item', tg, it); return; }
    if (!tg) {
      if (this.scene.noPlayer || this.f('hide:' + this.state.player)) return;
      this.item = null; this.verb = null; this.renderInv();
      this.walkTo(x, y);
      this.updateHover();
      return;
    }
    this.act(this.verb || this.defaultVerb(tg), tg);
  }

  /** Perform a verb on a target (also used by the test harness). */
  async act(verb, tg, itemId) {
    if (typeof tg === 'string') tg = this.findTarget(tg);
    if (!tg) throw new Error('No such target');
    this.verb = null; this.updateHover();
    const d = tg.def;
    const handler = (d.on || {})[verb];
    // walking up to the target
    this.lock();
    try {
      if (!this.scene.noPlayer && !this.f('hide:' + this.state.player) && d.walk !== false && !(verb === 'look' && !d.walkToLook)) {
        let wx, wy;
        if (d.walkTo) [wx, wy] = typeof d.walkTo === 'function' ? d.walkTo(this) : d.walkTo;
        else if (tg.kind === 'actor') { const a = tg.act || this.actors[tg.id]; const side = (this.state.pos.x < a.x ? -1 : 1); wx = a.x + side * Math.max(150, a.w * 0.9 + 60); wy = a.y; [wx, wy] = geom.clampToWalk(wx, wy, this.walkPolys); }
        else { const b = geom.shapeBounds(d); [wx, wy] = geom.clampToWalk(b.x + b.w / 2, b.y + b.h, this.walkPolys); }
        if (verb !== 'look' || d.walkToLook) await this.walkTo(wx, wy);
      }
      // face target
      if (this.actors[this.state.player]) {
        if (d.face) this.face('player', d.face);
        else if (tg.kind === 'actor') { this.face('player', tg.id); if (verb === 'talk' && !d.noFace) this.face(tg.id, this.state.player); }
        else { const [cx] = geom.shapeCenter(d); if (Math.abs(cx - this.state.pos.x) > 40) this.face('player', cx < this.state.pos.x ? 'left' : 'right'); }
      }
    } finally { this.unlock(); }

    if (verb === 'walk') {
      if (d.exit) {
        if (typeof d.exit === 'function') return this.run(d.exit);
        return this.goto(d.exit, d.entry || {});
      }
      if (handler) return this.run(handler);
      return;
    }
    if (verb === 'item') {
      const on = d.on || {};
      const fn = on['item:' + itemId] || (on.item && ((g) => on.item(g, itemId)));
      const res = REG.items[itemId] && REG.items[itemId].useOn && REG.items[itemId].useOn[tg.id];
      return this.run(fn || res || pick(DEFAULTS.item));
    }
    if (handler) return this.run(handler);
    if (verb === 'look' && d.desc) return this.run(d.desc);
    if (verb === 'open' && (d.on || {}).use) return this.run(d.on.use);
    return this.run(pick(DEFAULTS[verb] || DEFAULTS.use));
  }

  findTarget(id) {
    const a = this.actors[id];
    if (a && !a.def.isPlayer) return { kind: 'actor', id, def: a.def, act: a };
    const h = this.visibleHotspots().find((x) => x.id === id);
    if (h) return { kind: 'hotspot', id, def: h };
    return null;
  }

  // ------------------------------------------------------------------ verbs & inventory UI
  buildVerbs() {
    const v = $('verbs'); v.innerHTML = '';
    for (const k of ['look', 'take', 'use', 'talk', 'open', 'walk']) {
      const b = document.createElement('button'); b.className = 'verb'; b.dataset.verb = k; b.textContent = tr(UI.verbs[k]);
      b.addEventListener('click', () => { audio.sfx('click'); this.item = null; this.verb = k === 'walk' ? null : k; this.renderInv(); this.updateHover(); });
      v.appendChild(b);
    }
  }

  renderInv() {
    const slots = $('inv-slots'); slots.innerHTML = '';
    const inv = this.state.inv;
    if (this.invOffset >= inv.length) this.invOffset = Math.max(0, Math.floor((inv.length - 1) / 6) * 6);
    const view = inv.slice(this.invOffset, this.invOffset + 12);
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('div'); s.className = 'inv-slot';
      const id = view[i];
      if (id) {
        const it = REG.items[id] || { name: id };
        s.title = tr(it.name); s.dataset.item = id;
        if (it.icon) { const im = document.createElement('img'); im.src = it.icon; im.alt = tr(it.name); s.appendChild(im); }
        else s.textContent = tr(it.name);
        if (this.item === id) s.classList.add('selected');
        s.addEventListener('click', () => this.invClick(id, false));
        s.addEventListener('contextmenu', (e) => { e.preventDefault(); this.invClick(id, true); });
        s.addEventListener('mouseenter', () => { this.hoverItem = id; this.updateHover(); });
        s.addEventListener('mouseleave', () => { this.hoverItem = null; this.updateHover(); });
      }
      slots.appendChild(s);
    }
    $('inv-up').disabled = this.invOffset === 0;
    $('inv-down').disabled = this.invOffset + 12 >= inv.length;
  }

  invClick(id, right) {
    if (this.busy) return;
    audio.sfx('click');
    const it = REG.items[id] || {};
    if (right || this.verb === 'look') { this.verb = null; this.run(it.look || t("It's mine.", 'Es mío.')); return; }
    if (this.item && this.item !== id) {
      const a = this.item; this.item = null; this.renderInv();
      const A = REG.items[a] || {}, B = it;
      const fn = (A.combine && A.combine[id]) || (B.combine && B.combine[a]);
      this.run(fn || pick(DEFAULTS.item));
      return;
    }
    if (this.verb === 'take' || this.verb === 'talk') { this.verb = null; this.run(pick(DEFAULTS.use)); return; }
    if (this.verb === 'open' && it.open) { this.verb = null; this.run(it.open); return; }
    if (this.verb === 'use' && it.use) { this.verb = null; this.run(it.use); return; }
    this.verb = null;
    this.item = this.item === id ? null : id;
    this.renderInv(); this.updateHover();
  }

  // ------------------------------------------------------------------ text
  textTime(s) { if (this.fast) return 1; const base = 1400 + s.length * 52; return base * [1.5, 1, 0.65][this.settings.textSpeed ?? 1]; }

  waitAdvance(ms) {
    return new Promise((res) => {
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(timer); this.advanceFn = null; res(); };
      const timer = ms != null ? setTimeout(finish, ms) : null;
      this.advanceFn = finish;
    });
  }
  advance() { if (this.advanceFn) { const f = this.advanceFn; f(); } }

  clearText() { $('balloons').innerHTML = ''; $('captions').innerHTML = ''; }

  speakerName(id) { const ch = REG.chars[id]; return ch ? tr(ch.name) : id; }

  /** A character speaks. Shows a balloon over them if present, otherwise a caption with their name. */
  async say(who, text, opts = {}) {
    who = this.resolveId(who);
    const s = tr(text);
    if (!s) return;
    const act = this.actors[who];
    const ch = REG.chars[who] || {};
    this.clearText();
    let el;
    if (act && !opts.caption && $('panel-layer').classList.contains('hidden')) {
      el = document.createElement('div');
      el.className = 'balloon ' + (opts.style || ch.balloon || '');
      el.innerHTML = (opts.named ? `<span class="who">${this.speakerName(who)}</span>` : '') + escapeHtml(s);
      $('balloons').appendChild(el);
      const bw = el.offsetWidth, bh = el.offsetHeight;
      const headY = act.y - act.h * (ch.headroom ?? 1.0);
      let left = act.x - bw / 2, top = headY - bh - 34;
      let below = false;
      if (top < 8) { top = Math.max(8, act.y - act.h * 0.55); below = top + bh > SCENE_H; }
      left = Math.max(10, Math.min(W - bw - 10, left));
      el.style.left = left + 'px'; el.style.top = Math.max(8, top) + 'px';
      el.style.setProperty('--tail', Math.max(30, Math.min(bw - 30, act.x - left)) + 'px');
      el.style.setProperty('--skew', (act.x - left < bw / 2 ? '18deg' : '-18deg'));
      if (below) el.classList.add('below');
      act.el.classList.add('talking');
    } else {
      el = this.captionEl(s, { who: this.speakerName(who), style: opts.style || ch.caption || ch.balloon });
    }
    await this.waitAdvance(opts.ms ?? this.textTime(s));
    el.remove();
    if (act) act.el.classList.remove('talking');
  }

  captionEl(text, opts = {}) {
    const el = document.createElement('div');
    el.className = 'caption ' + (opts.style || '');
    el.innerHTML = (opts.who ? `<span class="who">${escapeHtml(opts.who)}</span>` : '') + escapeHtml(text);
    const host = $('panel-layer').classList.contains('hidden') ? $('captions') : $('panel-captions');
    if (host.id === 'panel-captions') el.classList.add('pos-' + (opts.pos || 'tl'));
    host.appendChild(el);
    return el;
  }

  /** Narration caption box. */
  async narrate(text, opts = {}) {
    const s = tr(text); if (!s) return;
    if (!opts.keep) this.clearText();
    const el = this.captionEl(s, { who: opts.who ? tr(opts.who) : null, style: opts.style, pos: opts.pos });
    await this.waitAdvance(opts.ms ?? this.textTime(s) + 600);
    if (!opts.keep) el.remove();
  }

  // ------------------------------------------------------------------ dialogue choices
  choose(options) {
    return new Promise((res) => {
      const list = $('choice-list'); list.innerHTML = '';
      list.classList.toggle('many', options.length > 4 && options.length <= 6);
      list.classList.toggle('lots', options.length > 6);
      $('choices').classList.remove('hidden');
      $('verbs').classList.add('hidden'); $('inventory').classList.add('hidden'); $('sentence').textContent = '';
      const pa = REG.chars[this.state.player], pb = this.talkingTo && REG.chars[this.talkingTo];
      setPortrait($('choice-portrait-a'), pa); setPortrait($('choice-portrait-b'), pb);
      this.choiceOpts = options;
      options.forEach((o, i) => {
        const li = document.createElement('li'); li.textContent = tr(o.text);
        if (o.used) li.classList.add('used');
        li.addEventListener('click', () => { audio.sfx('click'); finish(o.id ?? i); });
        list.appendChild(li);
      });
      const finish = (id) => {
        this.choiceFn = null; this.choiceOpts = null;
        $('choices').classList.add('hidden'); $('verbs').classList.remove('hidden'); $('inventory').classList.remove('hidden');
        this.syncBusy(); res(id);
      };
      this.choiceFn = finish;
      this.syncBusy();
    });
  }

  /**
   * Dialogue tree. opts: array of { id, text, when?, once?, exit?, silent?, run? }
   * Loops until an exit option is chosen or no options remain.
   */
  async dialog(npc, opts, key) {
    const prev = this.talkingTo; this.talkingTo = npc; key = key || npc;
    this.set('_endDialog', false);
    while (true) {
      const list = (typeof opts === 'function' ? opts(this) : opts).filter((o) => (!o.when || o.when(this)) && !(o.once && this.f(`d:${key}:${o.id}`)));
      if (!list.length) break;
      const show = list.map((o) => ({ id: o.id, text: o.text, used: !o.exit && this.f(`d:${key}:${o.id}`) }));
      const id = await this.choose(show);
      const o = list.find((x) => x.id === id);
      this.set(`d:${key}:${o.id}`);
      if (!o.silent) await this.say('player', o.say || o.text);
      if (o.run) await o.run(this);
      if (o.exit || this.f('_endDialog')) { this.set('_endDialog', false); break; }
    }
    this.talkingTo = prev;
  }
  endDialog() { this.set('_endDialog', true); }

  // ------------------------------------------------------------------ comic panels & cards
  /**
   * Show a sequence of comic panels. Each panel: { img, kb, captions: [ {text, pos, style, who} | t() ], balloons: [{text, x, y, who, style}], sfx }
   */
  async panels(list) {
    const layer = $('panel-layer');
    await this.preload(list.map((p) => p.img));
    this.lock();
    try {
      await this.fade(true, 250);
      this.clearText();
      layer.classList.remove('hidden');
      $('panel-hint').textContent = tr(UI.clickToContinue);
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        const img = $('panel-img');
        img.className = '';
        img.style.backgroundImage = p.img ? `url("${p.img}")` : 'none';
        img.style.backgroundPosition = p.pos || 'center';
        img.style.filter = p.filter || '';
        void img.offsetWidth;
        img.className = 'kb-' + (p.kb || ['in', 'out', 'left', 'right'][i % 4]);
        $('panel-captions').innerHTML = '';
        if (i === 0) await this.fade(false, 250); else if (!this.fast) await sleep(120);
        if (p.sfxSound) audio.sfx(p.sfxSound);
        if (p.sfx) {
          const s = document.createElement('div'); s.className = 'sfx'; s.textContent = tr(p.sfx.text || p.sfx);
          s.style.left = (p.sfx.x ?? 1100) + 'px'; s.style.top = (p.sfx.y ?? 200) + 'px';
          $('panel-captions').appendChild(s);
        }
        const caps = p.captions || [];
        if (!caps.length && !(p.balloons || []).length) await this.waitAdvance(this.fast ? 1 : (p.ms || 3500));
        for (let j = 0; j < caps.length; j++) {
          let c = caps[j]; if (c.en || typeof c === 'string') c = { text: c };
          const pos = c.pos || (j === 0 ? 'tl' : (j === caps.length - 1 ? 'br' : (j % 2 ? 'tr' : 'bl')));
          const prevEls = [...$('panel-captions').querySelectorAll('.caption')];
          if (prevEls.length >= 2 || c.clear) prevEls.forEach((e) => e.remove());
          // avoid overlapping same position
          prevEls.filter((e) => e.classList.contains('pos-' + pos)).forEach((e) => e.remove());
          this.captionEl(tr(c.text), { pos, style: c.style, who: c.who ? (REG.chars[c.who] ? tr(REG.chars[c.who].name) : tr(c.who)) : null });
          await this.waitAdvance(this.fast ? 1 : this.textTime(tr(c.text)) + 2500);
        }
        for (const b of p.balloons || []) {
          const el = document.createElement('div');
          el.className = 'balloon ' + (b.style || '');
          el.innerHTML = (b.who ? `<span class="who">${escapeHtml(REG.chars[b.who] ? tr(REG.chars[b.who].name) : tr(b.who))}</span>` : '') + escapeHtml(tr(b.text));
          el.style.left = (b.x ?? 700) + 'px'; el.style.top = (b.y ?? 80) + 'px';
          if (b.tail) el.style.setProperty('--tail', b.tail);
          $('panel-captions').appendChild(el);
          await this.waitAdvance(this.fast ? 1 : this.textTime(tr(b.text)) + 2500);
          if (!b.keep) el.remove();
        }
      }
      await this.fade(true, 250);
      layer.classList.add('hidden');
      $('panel-captions').innerHTML = '';
      await this.fade(false, 250);
    } finally { this.unlock(); }
  }

  /** Full-screen title card. */
  async card({ kicker, title, sub, img, ms }) {
    const el = $('card-layer');
    if (this.settings.grade === 'd' && this.cardsD && this.cardsD[img]) img = this.cardsD[img];
    if (img) await this.loadImg(img);
    this.lock();
    try {
      await this.fade(true, 300);
      el.style.backgroundImage = img ? `url("${img}")` : 'none';
      el.innerHTML = (kicker ? `<div class="card-kicker">${escapeHtml(tr(kicker))}</div>` : '') +
        `<div class="card-title">${escapeHtml(tr(title))}</div><div class="card-rule"></div>` +
        (sub ? `<div class="card-sub">${escapeHtml(tr(sub))}</div>` : '') +
        `<div class="card-hint">${escapeHtml(tr(UI.clickToContinue))}</div>`;
      el.classList.remove('hidden');
      await this.fade(false, 400);
      await this.waitAdvance(this.fast ? 1 : (ms || 9000));
      await this.fade(true, 400);
      el.classList.add('hidden');
      await this.fade(false, 300);
    } finally { this.unlock(); }
  }

  async fade(on, ms = 450) {
    const f = $('fade');
    if (this.fast) { f.style.transition = 'none'; f.classList.toggle('on', on); return; }
    f.style.transition = `opacity ${ms}ms`;
    f.classList.toggle('on', on);
    await sleep(ms);
  }
  async flash(color = 'white', ms = 160) {
    const f = $('fade'); f.classList.add(color === 'white' ? 'white' : 'x');
    await this.fade(true, ms); await this.fade(false, ms * 2); f.classList.remove('white', 'x');
  }
  shake(ms = 500) {
    if (this.fast) return;
    const s = $('scene'); s.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-12px,6px)' }, { transform: 'translate(10px,-8px)' }, { transform: 'translate(-6px,4px)' }, { transform: 'translate(0,0)' }], { duration: ms, iterations: 1 });
  }

  // ------------------------------------------------------------------ chapters
  chapterDef(id) { return REG.chapters.find((c) => c.id === id); }

  async startChapter(id, opts = {}) {
    const ch = this.chapterDef(id);
    if (!ch) throw new Error('Unknown chapter ' + id);
    this.state.chapter = id;
    this.state.player = ch.player || 'consul';
    this.state.inv = (ch.inv || []).slice();
    this.item = null; this.verb = null; this.renderInv();
    if (!this.settings.reached.includes(id)) { this.settings.reached.push(id); this.saveSettings(); }
    if (this.onChapter) this.onChapter(id);
    this.lock();
    try {
      if (!opts.noCard) await this.card({ kicker: ch.kicker, title: ch.title, sub: ch.sub, img: ch.cardImg });
      if (ch.intro) await this.run(ch.intro);
    } finally { this.unlock(); }
    await this.goto(ch.start, ch.startPos || {});
  }

  /** Switch the controlled character (used inside tales). */
  setPlayer(id, x, y, dir) {
    this.state.player = id;
    if (x != null) this.state.pos = { x, y, dir: dir || 'right' };
    this.refresh();
  }

  /** Begin a tale inside the current chapter: title card, switch player & inventory, go to its first scene. */
  async startTale(id, opts = {}) {
    const tl = REG.tales[id];
    if (!tl) throw new Error('Unknown tale ' + id);
    this.state.frame = { player: this.state.player, inv: this.state.inv.slice(), scene: this.state.scene, pos: this.state.pos };
    this.state.tale = id;
    if (tl.chapter) this.state.chapter = tl.chapter;
    if (!this.settings.reached.includes('tale:' + id)) { this.settings.reached.push('tale:' + id); this.saveSettings(); }
    this.state.player = tl.player;
    this.state.inv = (tl.inv || []).slice();
    this.item = null; this.verb = null; this.renderInv();
    this.lock();
    try {
      if (!opts.noCard) await this.card({ kicker: tl.kicker, title: tl.title, sub: tl.sub, img: tl.cardImg });
      if (tl.intro) await this.run(tl.intro);
    } finally { this.unlock(); }
    await this.goto(tl.start, tl.startPos || {});
  }

  /** End the current tale: restore the frame player/inventory and run the chapter's afterTale hook. */
  async endTale() {
    const id = this.state.tale;
    const fr = this.state.frame || { player: 'consul', inv: [] };
    this.state.tale = null;
    this.state.player = fr.player;
    this.state.inv = fr.inv || [];
    this.item = null; this.renderInv();
    const tl = REG.tales[id] || {};
    const ch = this.chapterDef(tl.chapter || this.state.chapter);
    if (ch && ch.afterTale) await this.run(ch.afterTale, id);
    else if (fr.scene) await this.goto(fr.scene, fr.pos || {});
  }

  async nextChapter() {
    const i = REG.chapters.findIndex((c) => c.id === this.state.chapter);
    const nxt = REG.chapters[i + 1];
    if (nxt) await this.startChapter(nxt.id);
  }

  // ------------------------------------------------------------------ saves
  snapshot(label) {
    const ch = this.chapterDef(this.state.chapter);
    const sc = this.scene;
    return { state: JSON.parse(JSON.stringify(this.state)), label: { chapter: ch ? ch.title : '', scene: sc ? sc.name || '' : '' }, date: new Date().toISOString(), lang: L.lang, label2: label };
  }
  autosave() { try { localStorage.setItem('hyperion.save.auto', JSON.stringify(this.snapshot())); } catch (e) { } }
  saveSlot(n) { localStorage.setItem('hyperion.save.' + n, JSON.stringify(this.snapshot())); this.toast(tr(UI.saved)); }
  readSlot(n) { try { return JSON.parse(localStorage.getItem('hyperion.save.' + n) || 'null'); } catch (e) { return null; } }
  async loadSlot(n) {
    const s = this.readSlot(n); if (!s) return false;
    this.state = Object.assign(freshState(), s.state);
    this.item = null; this.verb = null; this.renderInv();
    const pos = this.state.pos || {};
    if (this.onChapter && this.state.chapter) this.onChapter(this.state.chapter);
    await this.goto(this.state.scene, { x: pos.x, y: pos.y, dir: pos.dir }, { loaded: true });
    return true;
  }
  newState() { this.state = freshState(); this.renderInv(); }

  // ------------------------------------------------------------------ keyboard & debug
  onKey(e) {
    if (e.key === 'Tab') { e.preventDefault(); this.showHotspots(true); return; }
    if (e.key === ' ' || e.key === 'Enter') { if (this.advanceFn) { e.preventDefault(); this.advance(); } return; }
    if (e.key === 'Escape') {
      if (this.advanceFn) { this.advance(); return; }
      if (this.menu) this.menu.toggle();
      return;
    }
    if (this.choiceFn && /^[1-9]$/.test(e.key)) {
      const o = this.choiceOpts[+e.key - 1]; if (o) this.choiceFn(o.id ?? (+e.key - 1));
      return;
    }
    if (this.busy || !this.scene) return;
    const map = { l: 'look', p: 'take', u: 'use', t: 'talk', o: 'open', w: 'walk' };
    if (map[e.key] && !e.ctrlKey && !e.metaKey && this.menu && !this.menu.open) { this.verb = map[e.key] === 'walk' ? null : map[e.key]; this.item = null; this.renderInv(); this.updateHover(); }
  }

  showHotspots(on) {
    const L2 = $('debug-layer');
    if (!on && !this.debug) { L2.innerHTML = ''; return; }
    if (!this.scene || (this.busy && !this.debug)) return;
    let svg = `<svg width="1920" height="820" viewBox="0 0 1920 820">`;
    for (const h of this.visibleHotspots()) {
      const b = geom.shapeBounds(h); const [cx, cy] = geom.shapeCenter(h);
      if (this.debug) {
        if (h.poly) svg += `<polygon points="${h.poly.map((p) => p.join(',')).join(' ')}" fill="rgba(255,200,0,0.15)" stroke="#ff0" stroke-width="2"/>`;
        else svg += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="rgba(255,200,0,0.15)" stroke="#ff0" stroke-width="2"/>`;
        svg += `<text x="${b.x + 4}" y="${b.y + 22}" fill="#ff0" font-size="20" font-family="monospace">${h.id}</text>`;
        if (h.walkTo && typeof h.walkTo !== 'function') svg += `<circle cx="${h.walkTo[0]}" cy="${h.walkTo[1]}" r="6" fill="#0ff"/>`;
      } else {
        svg += `<circle cx="${cx}" cy="${cy}" r="11" fill="rgba(255,220,120,0.85)" stroke="#000" stroke-width="3"/>`;
      }
    }
    for (const a of Object.values(this.actors)) {
      if (a.def.isPlayer) continue;
      svg += `<circle cx="${a.x}" cy="${a.y - a.h * 0.6}" r="11" fill="rgba(120,255,220,0.85)" stroke="#000" stroke-width="3"/>`;
    }
    if (this.debug) for (const p of this.walkPolys) svg += `<polygon points="${p.map((q) => q.join(',')).join(' ')}" fill="rgba(0,255,120,0.12)" stroke="#0f8" stroke-width="2"/>`;
    svg += '</svg>';
    L2.innerHTML = svg;
  }
  drawDebug() {
    this.showHotspots(true);
    if (!$('debug-coords')) { const d = document.createElement('div'); d.id = 'debug-coords'; $('scene').appendChild(d); }
  }
}

function setPortrait(el, ch) {
  if (!ch || !ch.sprite) { el.style.visibility = 'hidden'; return; }
  el.style.visibility = 'visible';
  el.style.backgroundImage = `url("${ch.portraitImg || ch.sprite.replace('/chars/', '/portraits/')}")`;
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
}

export function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
export { t, tr, L };
