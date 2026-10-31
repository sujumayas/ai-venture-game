// Procedural audio: ambient soundscapes and sound effects synthesized with WebAudio.
// No audio files are shipped; everything is generated at runtime.

const PRESETS = {
  none: null,
  space:   { drone: [55, 82.4, 110], droneType: 'sine', droneGain: 0.05, lfo: 0.05, noise: { type: 'pink', f: 1200, q: 0.4, g: 0.012 }, chimes: { notes: [659, 784, 988, 1175, 1319], every: 5.5, g: 0.02 } },
  swamp:   { drone: [41.2, 61.7], droneType: 'triangle', droneGain: 0.06, lfo: 0.03, noise: { type: 'brown', f: 380, q: 0.6, g: 0.07, lfo: 0.07 }, bellow: { every: 11, g: 0.05 } },
  tree:    { drone: [73.4, 110, 146.8], droneType: 'sine', droneGain: 0.035, lfo: 0.04, noise: { type: 'pink', f: 700, q: 0.8, g: 0.04, lfo: 0.11 }, chimes: { notes: [587, 659, 784, 880, 988, 1175], every: 2.8, g: 0.025, wood: true } },
  city:    { drone: [49, 73.4], droneType: 'sawtooth', droneGain: 0.012, lfo: 0.02, noise: { type: 'brown', f: 500, q: 0.5, g: 0.06, lfo: 0.05 }, chimes: { notes: [392, 466, 523], every: 9, g: 0.012 } },
  river:   { drone: [65.4, 98], droneType: 'sine', droneGain: 0.04, lfo: 0.03, noise: { type: 'pink', f: 900, q: 0.9, g: 0.05, lfo: 0.21 }, chimes: { notes: [523, 587, 698, 784], every: 7, g: 0.012 } },
  grass:   { drone: [55, 82.4], droneType: 'sine', droneGain: 0.03, lfo: 0.02, noise: { type: 'pink', f: 1400, q: 0.5, g: 0.06, lfo: 0.09 }, chimes: { notes: [880, 1047, 1319], every: 8, g: 0.01 } },
  mountain:{ drone: [46.2, 69.3], droneType: 'triangle', droneGain: 0.04, lfo: 0.02, noise: { type: 'white', f: 600, q: 3.5, g: 0.05, lfo: 0.13, sweep: true }, chimes: null },
  keep:    { drone: [43.6, 65.4, 92.5], droneType: 'sine', droneGain: 0.05, lfo: 0.015, noise: { type: 'brown', f: 300, q: 0.8, g: 0.04, lfo: 0.06 }, chimes: { notes: [233, 277, 311], every: 12, g: 0.012 } },
  tombs:   { drone: [36.7, 38.9, 55], droneType: 'sawtooth', droneGain: 0.016, lfo: 0.01, noise: { type: 'pink', f: 260, q: 1.5, g: 0.05, lfo: 0.04, sweep: true }, swell: { every: 9, g: 0.05 } },
  sea:     { drone: [55, 82.4, 123.5], droneType: 'sine', droneGain: 0.03, lfo: 0.02, noise: { type: 'pink', f: 700, q: 0.4, g: 0.08, lfo: 0.09, waves: true }, chimes: { notes: [659, 784, 880, 1047], every: 6, g: 0.014 } },
  battle:  { drone: [41.2, 43.7], droneType: 'sawtooth', droneGain: 0.02, lfo: 0.05, noise: { type: 'brown', f: 260, q: 0.7, g: 0.07, lfo: 0.3 }, drums: { every: 1.6, g: 0.25 } },
  church:  { drone: [65.4, 98, 130.8, 196], droneType: 'sawtooth', droneGain: 0.008, lfo: 0.03, noise: { type: 'pink', f: 500, q: 0.5, g: 0.02 }, chimes: { notes: [261, 311, 392, 466], every: 6, g: 0.02 } },
  forest:  { drone: [49, 73.4], droneType: 'sine', droneGain: 0.04, lfo: 0.02, noise: { type: 'pink', f: 2200, q: 0.7, g: 0.025, lfo: 0.17 }, crackle: { every: 1.3, g: 0.06 } },
  home:    { drone: [87.3, 130.8, 174.6], droneType: 'sine', droneGain: 0.03, lfo: 0.02, noise: { type: 'pink', f: 1600, q: 0.3, g: 0.008 }, chimes: { notes: [523, 587, 659, 784, 880], every: 4.5, g: 0.02 } },
  data:    { drone: [110, 164.8, 220], droneType: 'square', droneGain: 0.006, lfo: 0.2, noise: { type: 'white', f: 3000, q: 2, g: 0.008, lfo: 0.5 }, chimes: { notes: [880, 1175, 1319, 1760, 1976], every: 0.9, g: 0.012 } },
  grief:   { drone: [69.3, 103.8], droneType: 'sine', droneGain: 0.03, lfo: 0.02, noise: { type: 'pink', f: 900, q: 0.3, g: 0.006 }, piano: { notes: [277, 330, 415, 554, 494, 415], every: 3.2, g: 0.06 } },
};

class AudioEngine {
  constructor() {
    this.ctx = null; this.master = null; this.enabled = true; this.current = null; this.currentName = 'none';
    this.volume = 0.8;
  }
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    const comp = this.ctx.createDynamicsCompressor();
    this.master.connect(comp); comp.connect(this.ctx.destination);
    this.noiseBufs = {};
    for (const type of ['white', 'pink', 'brown']) this.noiseBufs[type] = this._noise(type);
    // simple reverb
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this._impulse(2.8, 2.5);
    this.revGain = this.ctx.createGain(); this.revGain.gain.value = 0.35;
    this.reverb.connect(this.revGain); this.revGain.connect(this.master);
    if (this.pending) { const p = this.pending; this.pending = null; this.ambience(p); }
    return true;
  }
  setEnabled(on) { this.enabled = on; if (this.master) this.master.gain.setTargetAtTime(on ? this.volume : 0, this.ctx.currentTime, 0.1); }
  _noise(type) {
    const ctx = this.ctx, len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'white') d[i] = w * 0.5;
      else if (type === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    }
    return buf;
  }
  _impulse(sec, decay) {
    const ctx = this.ctx, len = ctx.sampleRate * sec, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return buf;
  }

  ambience(name) {
    if (name === this.currentName) return;
    if (!this.ctx) { this.pending = name; this.currentName = null; return; }
    this.currentName = name;
    const old = this.current;
    if (old) { old.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6); setTimeout(() => old.stop(), 3500); }
    this.current = null;
    const p = PRESETS[name];
    if (!p) return;
    this.current = this._build(p);
  }

  _build(p) {
    const ctx = this.ctx, out = ctx.createGain(), nodes = [], timers = [];
    out.gain.value = 0; out.connect(this.master); out.gain.setTargetAtTime(1, ctx.currentTime, 1.2);
    const send = ctx.createGain(); send.gain.value = 0.6; send.connect(this.reverb); out.connect(send);
    const lfoNode = (rate, depth, target) => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(target); o.start(); nodes.push(o); return o;
    };
    if (p.drone) {
      const dg = ctx.createGain(); dg.gain.value = p.droneGain; dg.connect(out);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(dg);
      p.drone.forEach((f, i) => {
        for (const det of [-4, 4]) {
          const o = ctx.createOscillator(); o.type = p.droneType; o.frequency.value = f; o.detune.value = det + i * 1.5; o.connect(lp); o.start(); nodes.push(o);
        }
      });
      if (p.lfo) lfoNode(p.lfo, p.droneGain * 0.5, dg.gain);
    }
    if (p.noise) {
      const n = p.noise, src = ctx.createBufferSource(); src.buffer = this.noiseBufs[n.type]; src.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = n.f; f.Q.value = n.q;
      const g = ctx.createGain(); g.gain.value = n.g;
      src.connect(f); f.connect(g); g.connect(out); src.start(); nodes.push(src);
      if (n.lfo) lfoNode(n.lfo, n.g * (n.waves ? 0.9 : 0.5), g.gain);
      if (n.sweep) lfoNode(n.lfo * 0.7, n.f * 0.6, f.frequency);
    }
    const every = (sec, fn) => {
      const tick = () => { if (!this.enabled) return; try { fn(); } catch (e) { /* ignore */ } };
      const loop = () => { tick(); timers.push(setTimeout(loop, sec * 1000 * (0.6 + Math.random() * 0.8))); };
      timers.push(setTimeout(loop, sec * 500 * Math.random() + 400));
    };
    if (p.chimes) every(p.chimes.every, () => this._chime(p.chimes.notes[Math.floor(Math.random() * p.chimes.notes.length)], p.chimes.g, out, p.chimes.wood));
    if (p.piano) every(p.piano.every, () => this.pianoNote(p.piano.notes[Math.floor(Math.random() * p.piano.notes.length)], 3.5, p.piano.g, out));
    if (p.bellow) every(p.bellow.every, () => this._bellow(p.bellow.g, out));
    if (p.swell) every(p.swell.every, () => this._swell(p.swell.g, out));
    if (p.drums) every(p.drums.every, () => this._drum(p.drums.g, out));
    if (p.crackle) every(p.crackle.every, () => this._crackle(p.crackle.g, out));
    return { out, stop: () => { timers.forEach(clearTimeout); nodes.forEach(n => { try { n.stop(); } catch (e) { } }); out.disconnect(); } };
  }

  _env(g, t0, a, peak, d) { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d); }
  _chime(freq, gain, dest, wood) {
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = freq;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * (wood ? 2.76 : 2.01);
    const g2 = ctx.createGain(); g2.gain.value = 0.3; o2.connect(g2); g2.connect(g);
    o.connect(g); g.connect(dest);
    this._env(g, t, 0.005, gain, wood ? 0.9 : 3);
    o.start(t); o2.start(t); o.stop(t + 4); o2.stop(t + 4);
  }
  _bellow(gain, dest) {
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(38, t + 2.4);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 260;
    const g = ctx.createGain(); o.connect(f); f.connect(g); g.connect(dest);
    this._env(g, t, 0.4, gain, 2.2); o.start(t); o.stop(t + 3);
  }
  _swell(gain, dest) {
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBufs.pink;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 6; f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(1800, t + 3.5);
    const g = ctx.createGain(); src.connect(f); f.connect(g); g.connect(dest);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 3.2); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
    src.start(t); src.stop(t + 4);
  }
  _drum(gain, dest) {
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    const g = ctx.createGain(); o.connect(g); g.connect(dest); this._env(g, t, 0.003, gain, 0.45); o.start(t); o.stop(t + 0.6);
  }
  _crackle(gain, dest) {
    const ctx = this.ctx, t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBufs.white;
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500;
      const g = ctx.createGain(); src.connect(f); f.connect(g); g.connect(dest);
      const ti = t + Math.random() * 0.4; this._env(g, ti, 0.002, gain, 0.05); src.start(ti, Math.random() * 3); src.stop(ti + 0.08);
    }
  }

  pianoNote(freq, dur = 2.5, gain = 0.12, dest = null, when = 0) {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime + when, out = ctx.createGain();
    out.connect(dest || this.master);
    const s = ctx.createGain(); s.gain.value = 0.5; out.connect(s); s.connect(this.reverb);
    [[1, 1], [2, 0.45], [3, 0.22], [4, 0.12], [5, 0.06]].forEach(([h, a]) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq * h * (1 + 0.0004 * h * h);
      const g = ctx.createGain(); o.connect(g); g.connect(out);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain * a, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / Math.sqrt(h));
      o.start(t); o.stop(t + dur + 0.1);
    });
  }

  /** The opening gesture of Rachmaninoff's Prelude in C-sharp minor, Op. 3 No. 2 (public domain, 1892). */
  rachmaninoff() {
    if (!this.ensure()) return 0;
    const N = (n) => 440 * Math.pow(2, (n - 69) / 12);
    const A2 = 45, Gs2 = 44, Cs2 = 37;
    const seq = [[0, [A2, A2 - 12]], [1.1, [Gs2, Gs2 - 12]], [2.2, [Cs2, Cs2 - 12]]];
    seq.forEach(([w, notes]) => notes.forEach(n => this.pianoNote(N(n), 5, 0.22, null, w)));
    // the tolling chords
    const chords = [[4.0, [61, 64, 68, 73]], [5.6, [61, 64, 68, 73]], [7.2, [60, 63, 66, 72]], [8.8, [61, 64, 68, 73]]];
    chords.forEach(([w, notes]) => notes.forEach(n => this.pianoNote(N(n), 3.5, 0.06, null, w)));
    [[10.4, [A2, A2 - 12]], [11.5, [Gs2, Gs2 - 12]], [12.6, [Cs2, Cs2 - 12]]].forEach(([w, notes]) => notes.forEach(n => this.pianoNote(N(n), 6, 0.2, null, w)));
    return 14000;
  }

  sfx(name) {
    if (!this.ensure() || !this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime, m = this.master;
    const tone = (f, type, a, d, g, f2) => {
      const o = ctx.createOscillator(), gn = ctx.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + d);
      o.connect(gn); gn.connect(m); this._env(gn, t, a, g, d); o.start(t); o.stop(t + a + d + 0.05);
    };
    const noise = (type, f, q, a, d, g, ftype = 'bandpass', f2) => {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBufs[type];
      const fl = ctx.createBiquadFilter(); fl.type = ftype; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
      if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + d);
      const gn = ctx.createGain(); src.connect(fl); fl.connect(gn); gn.connect(m); this._env(gn, t, a, g, d); src.start(t); src.stop(t + a + d + 0.05);
    };
    switch (name) {
      case 'click': tone(900, 'square', 0.002, 0.04, 0.03); break;
      case 'pickup': tone(660, 'sine', 0.005, 0.15, 0.12); setTimeout(() => this.ctx && tone(990, 'sine', 0.005, 0.25, 0.1), 90); break;
      case 'door': noise('brown', 300, 1, 0.02, 0.5, 0.4, 'lowpass'); tone(80, 'sine', 0.01, 0.3, 0.2); break;
      case 'whoosh': noise('pink', 300, 2, 0.15, 0.6, 0.25, 'bandpass', 2500); break;
      case 'fatline': [0, 0.18, 0.36].forEach((w, i) => setTimeout(() => this.ctx && tone(1320 + i * 220, 'sine', 0.005, 0.12, 0.08), w * 1000)); break;
      case 'shrike': tone(55, 'sawtooth', 0.05, 2.2, 0.2, 52); tone(58.3, 'sawtooth', 0.05, 2.2, 0.16, 61); noise('white', 4000, 8, 0.01, 0.9, 0.12, 'bandpass', 900); break;
      case 'shot': noise('white', 1200, 0.7, 0.002, 0.25, 0.5, 'lowpass', 200); tone(140, 'square', 0.002, 0.12, 0.2, 40); break;
      case 'laser': tone(2200, 'sawtooth', 0.003, 0.35, 0.08, 300); break;
      case 'thunder': noise('brown', 200, 0.5, 0.05, 2.5, 0.6, 'lowpass', 60); break;
      case 'splash': noise('pink', 1200, 0.8, 0.01, 0.8, 0.3, 'bandpass', 300); break;
      case 'bell': this._chime(392, 0.15, m); this._chime(587, 0.06, m); break;
      case 'heartbeat': tone(60, 'sine', 0.01, 0.15, 0.4); setTimeout(() => this.ctx && tone(55, 'sine', 0.01, 0.2, 0.3), 260); break;
      case 'crackle': this._crackle(0.15, m); this._crackle(0.12, m); break;
      case 'hum': tone(110, 'sawtooth', 0.4, 1.6, 0.05); tone(165, 'sine', 0.4, 1.6, 0.05); break;
      case 'baby': tone(520, 'triangle', 0.08, 0.6, 0.06, 680); break;
      case 'chime': this._chime(880, 0.08, m); break;
      case 'wind': noise('white', 500, 4, 0.6, 2.2, 0.15, 'bandpass', 1400); break;
      case 'explosion': noise('brown', 400, 0.4, 0.01, 3, 0.9, 'lowpass', 40); tone(50, 'sine', 0.01, 1.4, 0.5, 25); break;
      case 'tick': tone(2000, 'square', 0.001, 0.02, 0.03); break;
      default: break;
    }
  }
}

export const audio = new AudioEngine();
