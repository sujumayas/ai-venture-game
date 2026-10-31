// Title screen, pause menu, options, chapter select, save/load, about.
import { t, tr, UI, L } from './i18n.js';
import { REG, escapeHtml } from './engine.js';
import { audio } from './audio.js';

const $ = (id) => document.getElementById(id);

export class Menu {
  constructor(game, cfg) {
    this.g = game; this.cfg = cfg; this.open = false; this.mode = null;
    game.menu = this;
  }
  get layer() { return $('menu-layer'); }
  show(html, overlay) {
    const l = this.layer; l.innerHTML = html; l.classList.remove('hidden'); l.classList.toggle('overlay', !!overlay);
    l.style.backgroundImage = overlay ? '' : `url("${this.cfg.titleImg}")`;
    this.open = true;
    l.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', (e) => { audio.ensure(); audio.sfx('click'); this.action(b.dataset.act, b.dataset.arg, e); }));
  }
  close() { this.layer.classList.add('hidden'); this.layer.innerHTML = ''; this.open = false; }

  btn(act, label, arg = '', dis = false, cls = '') { return `<button class="menu-btn ${cls}" data-act="${act}" data-arg="${arg}" ${dis ? 'disabled' : ''}>${escapeHtml(tr(label))}</button>`; }

  title() {
    this.mode = 'title';
    audio.ambience('space');
    const hasSave = !!this.g.readSlot('auto');
    this.show(`<div class="menu-wrap">
      <div class="menu-logo">HYPERION</div>
      <div class="menu-tag">${escapeHtml(tr(UI.tagline))}</div>
      ${hasSave ? this.btn('continue', UI.cont) : ''}
      ${this.btn('new', UI.newGame)}
      ${this.btn('chapters', UI.chapters)}
      ${this.btn('loadmenu', UI.load)}
      ${this.btn('options', UI.options)}
      ${this.btn('about', UI.about)}
      </div>
      <div class="menu-foot">${escapeHtml(tr(UI.fanNotice))}</div>`);
  }

  pause() {
    if (this.g.busy || !this.g.scene) return;
    this.mode = 'pause';
    this.show(`<div class="menu-wrap">
      <div class="menu-logo" style="font-size:110px">HYPERION</div>
      ${this.btn('resume', UI.resume)}
      ${this.btn('savemenu', UI.save)}
      ${this.btn('loadmenu', UI.load)}
      ${this.btn('chapters', UI.chapters)}
      ${this.btn('options', UI.options)}
      ${this.btn('quit', UI.quitTitle)}
      </div>`, true);
  }

  toggle() { if (this.open) { if (this.mode === 'pause') this.close(); else if (this.mode !== 'title') this.back(); } else this.pause(); }
  back() { if (this.g.scene && this.mode !== 'title' && this.prev !== 'title') this.pause(); else this.title(); }

  options() {
    const prev = this.mode; if (prev !== 'options') this.prev = prev; this.mode = 'options';
    const s = this.g.settings;
    const opt = (act, val, label, on) => `<button class="menu-btn ${on ? 'on' : ''}" data-act="${act}" data-arg="${val}">${escapeHtml(tr(label))}</button>`;
    this.show(`<div class="menu-panel"><h2>${escapeHtml(tr(UI.options))}</h2>
      <div class="menu-row"><span>${escapeHtml(tr(UI.language))}</span><span class="opts">${opt('lang', 'en', 'English', L.lang === 'en')}${opt('lang', 'es', 'Español', L.lang === 'es')}</span></div>
      <div class="menu-row"><span>${escapeHtml(tr(UI.textSpeed))}</span><span class="opts">${opt('speed', 0, UI.slow, s.textSpeed === 0)}${opt('speed', 1, UI.normal, s.textSpeed === 1)}${opt('speed', 2, UI.fast, s.textSpeed === 2)}</span></div>
      <div class="menu-row"><span>${escapeHtml(tr(UI.volume))}</span><span class="opts">${opt('sound', 1, UI.on_, s.sound)}${opt('sound', 0, UI.off_, !s.sound)}</span></div>
      <div class="menu-row"><span>${escapeHtml(tr(UI.reviewer))}</span><span class="opts">${opt('reviewer', 1, UI.on_, s.reviewer)}${opt('reviewer', 0, UI.off_, !s.reviewer)}</span></div>
      <p style="font-size:24px;opacity:.7">${escapeHtml(tr(t('Controls: left-click = walk / default action · right-click = look · Tab = show hotspots · Space/Enter = skip line · Esc = menu · keys L/P/U/T/O select verbs.', 'Controles: clic izquierdo = caminar / acción por defecto · clic derecho = mirar · Tab = mostrar zonas · Espacio/Intro = saltar línea · Esc = menú · teclas L/P/U/T/O eligen verbos.')))}</p>
      <div class="menu-actions">${this.btn('back', UI.back)}</div></div>`, prev !== 'title' && !!this.g.scene && this.prev !== 'title');
  }

  chapters() {
    if (this.mode !== 'chapters') this.prev = this.mode; this.mode = 'chapters';
    const s = this.g.settings;
    const cells = REG.chapters.map((c) => {
      const ok = s.reviewer || s.reached.includes(c.id) || c.alwaysOpen;
      return `<div class="chap ${ok ? '' : 'locked'}" ${ok ? `data-act="chapter" data-arg="${c.id}"` : ''} style="background-image:url('${c.thumb || c.cardImg || ''}')"><div class="chap-t"><small>${escapeHtml(tr(c.kicker || ''))}</small>${escapeHtml(tr(c.short || c.title))}${ok ? '' : `<small>${escapeHtml(tr(UI.locked))}</small>`}</div></div>`;
    }).join('');
    this.show(`<div class="menu-panel"><h2>${escapeHtml(tr(UI.chapters))}</h2><div class="chap-grid">${cells}</div>
      <div class="menu-actions">${this.btn('back', UI.back)}</div></div>`, this.prev !== 'title' && !!this.g.scene);
  }

  slots(saving) {
    if (this.mode !== 'slots') this.prev = this.mode; this.mode = 'slots';
    const rows = [];
    const fmt = (s) => s ? `${escapeHtml(tr(s.label.chapter))} — ${escapeHtml(tr(s.label.scene))} <small style="opacity:.6">(${new Date(s.date).toLocaleString()})</small>` : escapeHtml(tr(UI.empty));
    if (!saving) { const a = this.g.readSlot('auto'); rows.push(`<div class="save-slot"><span><b>${escapeHtml(tr(UI.autosave))}</b>: ${fmt(a)}</span>${this.btn('load', UI.load, 'auto', !a, 'small')}</div>`); }
    for (let i = 1; i <= 5; i++) {
      const s = this.g.readSlot(i);
      rows.push(`<div class="save-slot"><span><b>${escapeHtml(tr(UI.slot))} ${i}</b>: ${fmt(s)}</span>${saving ? this.btn('save', UI.save, i, false, 'small') : this.btn('load', UI.load, i, !s, 'small')}</div>`);
    }
    this.show(`<div class="menu-panel"><h2>${escapeHtml(tr(saving ? UI.save : UI.load))}</h2>${rows.join('')}<div class="menu-actions">${this.btn('back', UI.back)}</div></div>`, this.prev !== 'title' && !!this.g.scene);
  }

  about() {
    if (this.mode !== 'about') this.prev = this.mode; this.mode = 'about';
    this.show(`<div class="menu-panel"><h2>${escapeHtml(tr(UI.about))}</h2>${tr(this.cfg.about)}<div class="menu-actions">${this.btn('back', UI.back)}</div></div>`);
  }

  async action(act, arg) {
    const g = this.g;
    switch (act) {
      case 'new': this.close(); g.newState(); await g.startChapter(REG.chapters[0].id); break;
      case 'continue': this.close(); g.newState(); await g.loadSlot('auto'); break;
      case 'chapters': this.chapters(); break;
      case 'chapter': this.close(); g.newState(); await g.startChapter(arg); break;
      case 'options': this.options(); break;
      case 'about': this.about(); break;
      case 'resume': this.close(); break;
      case 'savemenu': this.slots(true); break;
      case 'loadmenu': this.slots(false); break;
      case 'save': g.saveSlot(arg); this.slots(true); break;
      case 'load': this.close(); g.newState(); await g.loadSlot(arg); break;
      case 'quit': this.close(); g.scene = null; g.state.scene = null; this.title(); break;
      case 'back': if (this.prev === 'pause') this.pause(); else if (this.prev === 'title' || !g.scene) this.title(); else this.close(); break;
      case 'lang': g.setLanguage(arg); this.refreshMode(); break;
      case 'speed': g.settings.textSpeed = +arg; g.saveSettings(); this.options(); break;
      case 'sound': g.settings.sound = arg === '1'; audio.setEnabled(g.settings.sound); g.saveSettings(); this.options(); break;
      case 'reviewer': g.settings.reviewer = arg === '1'; g.saveSettings(); this.options(); break;
    }
  }
  refreshMode() { const m = this.mode; this.mode = null; if (m === 'options') this.options(); else this.title(); }
}
