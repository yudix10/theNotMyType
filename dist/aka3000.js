// ================= AUDIO: чиптюн-синт на WebAudio =================
function loadJSON(k) {
  try {
    return JSON.parse(localStorage.getItem(k));
  } catch (e) {
    return null;
  }
}
function saveJSON(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {}
}
const SET = Object.assign(
  { mus: 0.5, sfx: 0.7, speed: 44, blip: 1, tts: 0, shake: 1, crt: 1 },
  loadJSON('nmt_set') || {}
);
const AU = { ctx: null, th: null, cur: null };
const NOTE = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11
};
const QQ = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  7: [0, 4, 7, 10],
  M7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  sus: [0, 5, 7],
  6: [0, 4, 7, 9],
  dim: [0, 3, 6],
  add9: [0, 4, 7, 14]
};
function chord(s) {
  const m = s.match(/^([A-G][#b]?)(\d)(.*)$/);
  return QQ[m[3] || ''].map(i => 12 * (+m[2] + 1) + NOTE[m[1]] + i);
}
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const TH = {
  menu: {
    bpm: 78,
    prog: ['F3M7', 'E3m7', 'D3m7', 'C3M7'],
    arp: '01232101',
    aw: 'triangle',
    av: 0.035,
    bass: 'x.......',
    bl: 7,
    pad: 1,
    mel: 'x..x..x.',
    mw: 'square',
    mv: 0.022,
    ml: 2.5,
    seed: 3
  },
  campus: {
    bpm: 116,
    prog: ['C3', 'G2', 'A2m', 'F2'],
    arp: '0120.120',
    av: 0.026,
    bass: 'x.x.x.x5',
    k: 'x...x...',
    h: '.x.x.x.x',
    sn: '..x...x.',
    mel: 'x.x..x.x',
    mv: 0.03,
    seed: 5
  },
  hope: {
    bpm: 90,
    prog: ['F3', 'G3', 'E3m', 'A2m'],
    arp: '01210121',
    aw: 'triangle',
    av: 0.04,
    bass: 'x...x...',
    bl: 3,
    h: '..x...x.',
    hv: 0.015,
    pad: 0.7,
    mel: 'x..x.x..',
    mw: 'square',
    mv: 0.028,
    ml: 2,
    seed: 11
  },
  night: {
    bpm: 70,
    prog: ['A2m', 'F2', 'C3', 'G2'],
    arp: '0.1.2.1.',
    aw: 'triangle',
    av: 0.035,
    bass: 'x.......',
    bl: 7,
    pad: 0.8,
    mel: 'x.......',
    mw: 'sine',
    mv: 0.04,
    ml: 4,
    seed: 21
  },
  cringe: {
    bpm: 150,
    prog: ['C3', 'F3', 'G3', 'C3'],
    arp: '.c.c.c.c',
    aw: 'square',
    bass: 'x.5.x.5.',
    bw: 'square',
    bl: 0.8,
    k: 'x...x...',
    mel: 'xxx.x.x.',
    mv: 0.03,
    ml: 0.8,
    seed: 7
  },
  tension: {
    bpm: 104,
    prog: ['D3m', 'A#2', 'G2m', 'A2'],
    arp: '01020102',
    av: 0.025,
    bass: 'xx..xx..',
    k: 'x..x..x.',
    h: '.x.x.x.x',
    hv: 0.02,
    mel: 'x...x.x.',
    mv: 0.025,
    seed: 13
  },
  friendzone: {
    bpm: 66,
    prog: ['A2m', 'E2m', 'F2', 'E2'],
    arp: '0.1.2...',
    aw: 'triangle',
    av: 0.04,
    bass: 'x...x...',
    bl: 3,
    pad: 0.8,
    mel: 'x...x...',
    mw: 'triangle',
    mv: 0.04,
    ml: 3,
    seed: 17
  },
  sad: {
    bpm: 54,
    prog: ['A2m', 'F2', 'D2m', 'E2'],
    arp: '0...1...',
    aw: 'sine',
    av: 0.04,
    bass: 'x.......',
    bl: 7,
    pad: 1.2,
    mel: 'x.......',
    mw: 'sine',
    mv: 0.035,
    ml: 6,
    seed: 19
  },
  growth: {
    bpm: 128,
    prog: ['E2m', 'C3', 'G2', 'D3'],
    arp: '01210121',
    av: 0.028,
    bass: 'x.x.x.x.',
    bw: 'sawtooth',
    k: 'x.x.x.x.',
    h: '.x.x.x.x',
    sn: '..x...x.',
    mel: 'x.xx.x.x',
    mv: 0.032,
    seed: 23
  },
  garland: {
    bpm: 78,
    prog: ['D3M7', 'B2m7', 'G2M7', 'A2sus'],
    arp: '01232321',
    aw: 'triangle',
    av: 0.04,
    ao: 12,
    bass: 'x.......',
    bl: 7,
    pad: 0.7,
    mel: 'x..x....',
    mw: 'sine',
    mv: 0.04,
    ml: 3,
    seed: 29
  },
  fantasy: {
    bpm: 70,
    prog: ['C3M7', 'A2m7', 'F2M7', 'G26'],
    arp: '01230123',
    aw: 'sine',
    av: 0.05,
    ao: 12,
    bass: 'x.......',
    bl: 7,
    pad: 1,
    mel: 'x.x.x...',
    mw: 'triangle',
    mv: 0.035,
    ml: 2,
    seed: 31
  },
  meme: {
    bpm: 168,
    prog: ['C3', 'C37', 'F3', 'F3m'],
    arp: '.c.c.c.c',
    bass: 'x.5.x.5.',
    bw: 'square',
    bl: 0.7,
    k: 'x...x...',
    sn: '..x...x.',
    mel: 'x.x.xxx.',
    mv: 0.03,
    ml: 0.7,
    seed: 37
  },
  calm: {
    bpm: 86,
    prog: ['G2', 'D3', 'E2m', 'C3'],
    arp: '0121.121',
    aw: 'triangle',
    av: 0.035,
    bass: 'x...x...',
    bl: 3,
    h: '..x...x.',
    hv: 0.012,
    mel: 'x..x..x.',
    mw: 'triangle',
    mv: 0.035,
    ml: 2,
    seed: 41
  }
};
for (const k in TH) TH[k].ch = TH[k].prog.map(chord);
function auInit() {
  if (AU.ctx) return;
  const A = window.AudioContext || window.webkitAudioContext;
  if (!A) return;
  const c = new A();
  AU.ctx = c;
  AU.master = c.createGain();
  AU.master.connect(c.destination);
  AU.mus = c.createGain();
  AU.mus.gain.value = SET.mus;
  AU.mus.connect(AU.master);
  AU.sfx = c.createGain();
  AU.sfx.gain.value = SET.sfx;
  AU.sfx.connect(AU.master);
  AU.musIn = c.createGain();
  AU.musIn.connect(AU.mus);
  const d = c.createDelay();
  d.delayTime.value = 0.3;
  const fb = c.createGain();
  fb.gain.value = 0.28;
  const wet = c.createGain();
  wet.gain.value = 0.25;
  AU.musIn.connect(d);
  d.connect(fb);
  fb.connect(d);
  d.connect(wet);
  wet.connect(AU.mus);
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate),
    dd = b.getChannelData(0);
  for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
  AU.noise = b;
  if (AU.pend) {
    const p = AU.pend;
    AU.pend = null;
    AU.cur = null;
    playMusic(p);
  }
}
function tone(f, t0, dur, type, vol, dest, att = 0.005, rel = 0.08) {
  const c = AU.ctx,
    o = c.createOscillator(),
    g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + att);
  g.gain.setValueAtTime(vol, t0 + Math.max(att, dur - rel));
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  o.connect(g);
  g.connect(dest);
  o.start(t0);
  o.stop(t0 + dur + 0.03);
  return o;
}
function noise(t0, dur, vol, dest, ftype = 'highpass', freq = 6000, q = 1) {
  const c = AU.ctx,
    s = c.createBufferSource();
  s.buffer = AU.noise;
  const f = c.createBiquadFilter();
  f.type = ftype;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0005, t0 + dur);
  s.connect(f);
  f.connect(g);
  g.connect(dest);
  s.start(t0);
  s.stop(t0 + dur + 0.02);
  return { s, f };
}
function kick(t, d) {
  const c = AU.ctx,
    o = c.createOscillator(),
    g = c.createGain();
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
  g.gain.setValueAtTime(0.3, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o.connect(g);
  g.connect(d);
  o.start(t);
  o.stop(t + 0.2);
}
function sched(th, step, t, sd, dest) {
  const bar = Math.floor(step / 8) % th.prog.length,
    s = step % 8,
    ch = th.ch[bar];
  if (th.pad && s === 0)
    ch.forEach(n => tone(mtof(n + 12), t, sd * 8, 'triangle', 0.02 * th.pad, dest, 0.25, 0.6));
  const bp = th.bass[s];
  if (bp && bp !== '.')
    tone(
      mtof(ch[0] - 12 + (bp === '5' ? 7 : 0)),
      t,
      sd * (th.bl || 1.6),
      th.bw || 'triangle',
      0.1,
      dest,
      0.005,
      0.06
    );
  const ap = th.arp[s];
  if (ap && ap !== '.') {
    if (ap === 'c')
      ch.forEach(n => tone(mtof(n + 12), t, sd * 0.55, th.aw || 'square', 0.016, dest));
    else {
      const i = +ap,
        n = ch[i % ch.length] + 12 * (1 + Math.floor(i / ch.length)) + (th.ao || 0);
      tone(mtof(n), t, sd * 0.9, th.aw || 'square', th.av || 0.03, dest, 0.004, 0.05);
    }
  }
  if (th.mel && th.mel[s] === 'x') {
    const r = RNG(th.seed * 131 + (bar % 2) * 17 + s * 7 + 1);
    const k = Math.floor(r() * ch.length);
    tone(
      mtof(ch[k] + 24),
      t,
      sd * (th.ml || 1.5),
      th.mw || 'square',
      th.mv || 0.03,
      dest,
      0.01,
      0.12
    );
  }
  if (th.k && th.k[s] === 'x') kick(t, dest);
  if (th.h && th.h[s] === 'x') noise(t, 0.04, th.hv || 0.03, dest);
  if (th.sn && th.sn[s] === 'x') {
    noise(t, 0.14, 0.08, dest, 'bandpass', 1800, 0.8);
    tone(190, t, 0.08, 'triangle', 0.05, dest);
  }
}
function playMusic(name) {
  if (!AU.ctx) {
    AU.pend = name;
    return;
  }
  if (AU.cur === name) return;
  AU.cur = name;
  const c = AU.ctx;
  if (AU.tg) {
    const o = AU.tg;
    o.gain.setTargetAtTime(0, c.currentTime, 0.35);
    setTimeout(() => {
      try {
        o.disconnect();
      } catch (e) {}
    }, 2500);
  }
  AU.tg = null;
  if (!TH[name]) {
    AU.th = null;
    return;
  }
  const g = c.createGain();
  g.gain.value = 0;
  g.gain.setTargetAtTime(1, c.currentTime + 0.05, 0.5);
  g.connect(AU.musIn);
  AU.tg = g;
  AU.th = TH[name];
  AU.step = 0;
  AU.next = c.currentTime + 0.12;
}
setInterval(() => {
  if (!AU.ctx || !AU.th || !AU.tg) return;
  const th = AU.th,
    sd = 60 / th.bpm / 2;
  while (AU.next < AU.ctx.currentTime + 0.18) {
    sched(th, AU.step, AU.next, sd, AU.tg);
    AU.step++;
    AU.next += sd;
  }
}, 30);
function setVol() {
  if (!AU.ctx) return;
  AU.mus.gain.value = SET.mus;
  AU.sfx.gain.value = SET.sfx;
}
const SFX = {
  click() {
    const t = AU.ctx.currentTime;
    tone(880, t, 0.05, 'square', 0.05, AU.sfx);
    tone(1320, t + 0.04, 0.06, 'square', 0.04, AU.sfx);
  },
  hover() {
    tone(660, AU.ctx.currentTime, 0.03, 'square', 0.025, AU.sfx);
  },
  notif() {
    const t = AU.ctx.currentTime;
    tone(988, t, 0.09, 'triangle', 0.12, AU.sfx);
    tone(1480, t + 0.09, 0.16, 'triangle', 0.1, AU.sfx);
  },
  send() {
    const t = AU.ctx.currentTime;
    const o = tone(500, t, 0.12, 'sine', 0.08, AU.sfx);
    o.frequency.exponentialRampToValueAtTime(1400, t + 0.12);
  },
  heart() {
    const t = AU.ctx.currentTime;
    for (const d of [0, 0.22]) {
      const o = tone(90, t + d, 0.18, 'sine', 0.35, AU.sfx);
      o.frequency.exponentialRampToValueAtTime(45, t + d + 0.18);
    }
    tone(1760, t + 0.05, 0.3, 'triangle', 0.04, AU.sfx);
  },
  crash() {
    const t = AU.ctx.currentTime;
    noise(t, 0.6, 0.3, AU.sfx, 'lowpass', 2400);
    const o = tone(400, t, 0.7, 'sawtooth', 0.07, AU.sfx);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.7);
    tone(2200, t, 0.08, 'square', 0.05, AU.sfx);
    tone(3100, t + 0.05, 0.1, 'square', 0.04, AU.sfx);
  },
  cringe() {
    const t = AU.ctx.currentTime;
    [523, 494, 466, 440].forEach((f, i) => {
      const o = tone(f, t + i * 0.16, 0.18, 'square', 0.06, AU.sfx);
      if (i === 3) o.frequency.linearRampToValueAtTime(380, t + 0.75);
    });
  },
  scratch() {
    const t = AU.ctx.currentTime;
    const n = noise(t, 0.45, 0.35, AU.sfx, 'bandpass', 3000, 3);
    n.f.frequency.exponentialRampToValueAtTime(300, t + 0.4);
    const o = tone(800, t, 0.4, 'sawtooth', 0.05, AU.sfx);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.4);
  },
  realize() {
    const t = AU.ctx.currentTime;
    [0, 4, 7, 12, 16].forEach((s, i) =>
      tone(mtof(64 + s), t + i * 0.07, 0.5, 'triangle', 0.06, AU.sfx)
    );
    noise(t, 0.8, 0.06, AU.sfx, 'highpass', 5000);
  },
  stamp() {
    const t = AU.ctx.currentTime;
    kick(t, AU.sfx);
    noise(t, 0.2, 0.2, AU.sfx, 'lowpass', 900);
  },
  door() {
    const t = AU.ctx.currentTime;
    noise(t, 0.25, 0.25, AU.sfx, 'lowpass', 500);
    tone(120, t, 0.15, 'sine', 0.2, AU.sfx);
    noise(t + 0.25, 0.08, 0.1, AU.sfx, 'bandpass', 2000);
  },
  can() {
    const t = AU.ctx.currentTime;
    tone(1250, t, 0.25, 'square', 0.04, AU.sfx);
    tone(1870, t + 0.02, 0.3, 'triangle', 0.05, AU.sfx);
    tone(940, t + 0.15, 0.2, 'square', 0.03, AU.sfx);
  },
  alarm() {
    const t = AU.ctx.currentTime;
    for (let i = 0; i < 6; i++)
      tone(i % 2 ? 1046 : 880, t + i * 0.13, 0.11, 'square', 0.07, AU.sfx);
  },
  train() {
    const t = AU.ctx.currentTime;
    const n = noise(t, 2.4, 0.22, AU.sfx, 'lowpass', 300);
    n.f.frequency.linearRampToValueAtTime(1400, t + 1.1);
    n.f.frequency.linearRampToValueAtTime(200, t + 2.4);
    tone(523, t + 0.2, 0.5, 'square', 0.04, AU.sfx);
    tone(440, t + 0.7, 0.7, 'square', 0.04, AU.sfx);
  },
  car() {
    const t = AU.ctx.currentTime;
    const o = tone(48, t, 1.4, 'sawtooth', 0.12, AU.sfx, 0.05, 0.4);
    o.frequency.linearRampToValueAtTime(110, t + 0.5);
    o.frequency.linearRampToValueAtTime(70, t + 1.4);
    noise(t, 1.3, 0.12, AU.sfx, 'lowpass', 400);
    for (let i = 0; i < 6; i++) noise(t + i * 0.18, 0.06, 0.1, AU.sfx, 'bandpass', 180, 2);
  },
  win() {
    const t = AU.ctx.currentTime;
    [60, 64, 67, 72, 76].forEach((n, i) =>
      tone(mtof(n + 12), t + i * 0.08, 0.18, 'square', 0.05, AU.sfx)
    );
  },
  fail() {
    const t = AU.ctx.currentTime;
    [67, 63, 60, 55].forEach((n, i) => tone(mtof(n), t + i * 0.12, 0.16, 'square', 0.05, AU.sfx));
  },
  type() {
    tone(1800 + Math.random() * 400, AU.ctx.currentTime, 0.015, 'square', 0.02, AU.sfx);
  },
  pop() {
    const t = AU.ctx.currentTime;
    const o = tone(300, t, 0.08, 'square', 0.05, AU.sfx);
    o.frequency.exponentialRampToValueAtTime(900, t + 0.08);
  }
};
function sfx(n) {
  if (!AU.ctx || !SFX[n]) return;
  try {
    SFX[n]();
  } catch (e) {}
}
function blip(who) {
  if (!AU.ctx || !SET.blip) return;
  const v = (SP[who] || {}).v;
  if (!v) return;
  tone(v[0] * (1 + Math.random() * 0.1), AU.ctx.currentTime, 0.045, v[1], 0.045, AU.sfx);
}
const VOX = {
  ru: { p: 0.9, r: 1.08, m: 1 },
  nu: { p: 1.2, r: 1, f: 1 },
  dan: { p: 0.75, r: 1.15, m: 1 },
  lera: { p: 1.35, r: 1.1, f: 1 },
  pal: { p: 0.55, r: 0.9, m: 1 },
  in: { p: 0.6, r: 1.2, m: 1 },
  nar: { p: 1, r: 1.05 }
};
function speak(text, who) {
  if (!SET.tts || !window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*_]/g, ''));
    u.lang = 'ru-RU';
    const v = VOX[who] || { p: 1, r: 1 };
    u.pitch = v.p;
    u.rate = v.r;
    const vs = speechSynthesis
      .getVoices()
      .filter(x => x.lang && x.lang.toLowerCase().startsWith('ru'));
    const fem = /milena|irina|alena|alyona|svetlana|anna|female|катя|ekaterina|daria|google/i;
    let pick = vs.find(x => (v.f ? fem.test(x.name) : !fem.test(x.name))) || vs[0];
    if (pick) u.voice = pick;
    speechSynthesis.speak(u);
  } catch (e) {}
}

'use strict';
// ================= ART: всё рисуется в 320x180 =================
const W = 320,
  H = 180,
  cv = document.getElementById('cv'),
  X = cv.getContext('2d');
let C = X,
  T = 0;
const R = (x, y, w, h, c) => {
  C.fillStyle = c;
  C.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
const P1 = (x, y, c) => {
  C.fillStyle = c;
  C.fillRect(Math.round(x), Math.round(y), 1, 1);
};
function ell(x0, y0, rx, ry, c) {
  C.fillStyle = c;
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  const r = Math.round(ry);
  for (let y = -r; y <= r; y++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / ((ry + 0.5) * (ry + 0.5)))));
    C.fillRect(x0 - w, y0 + y, w * 2 + 1, 1);
  }
}
const disc = (x, y, r, c) => ell(x, y, r, r, c);
function ring(x, y, r, c) {
  for (let a = 0; a < 6.3; a += 0.18) P1(x + Math.cos(a) * r, y + Math.sin(a) * r, c);
}
function poly(pts, c) {
  C.fillStyle = c;
  let y0 = 1e9,
    y1 = -1e9;
  for (const p of pts) {
    y0 = Math.min(y0, p[1]);
    y1 = Math.max(y1, p[1]);
  }
  for (let y = Math.floor(y0); y < Math.ceil(y1); y++) {
    const yc = y + 0.5,
      xs = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i],
        b = pts[(i + 1) % pts.length];
      if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc))
        xs.push(a[0] + ((yc - a[1]) / (b[1] - a[1])) * (b[0] - a[0]));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const xa = Math.round(xs[i]),
        xb = Math.round(xs[i + 1]);
      if (xb > xa) C.fillRect(xa, y, xb - xa, 1);
    }
  }
}
function bands(y0, y1, cols, x0 = 0, w = W) {
  const n = cols.length;
  for (let y = y0; y < y1; y++) {
    const t = ((y - y0) / (y1 - y0)) * (n - 1),
      i = Math.min(n - 2, Math.floor(t)),
      f = t - i;
    if (f > 0.4 && f < 0.6) {
      for (let x = x0; x < x0 + w; x += 2) {
        P1(x + (y & 1), y, cols[i]);
        P1(x + 1 - (y & 1), y, cols[i + 1]);
      }
    } else R(x0, y, w, 1, f < 0.5 ? cols[i] : cols[i + 1]);
  }
}
function RNG(s) {
  s = Math.abs(Math.floor(s)) % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
function txt(s, x, y, c, sz = 7, f = '"Press Start 2P"') {
  C.fillStyle = c;
  C.font = sz + 'px ' + f;
  C.textBaseline = 'top';
  C.fillText(s, Math.round(x), Math.round(y));
}
const ga = a => (C.globalAlpha = a);
function line(x0, y0, x1, y1, c) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0;
  for (let i = 0; i <= n; i++) {
    const t = n ? i / n : 0;
    P1(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, c);
  }
}
const HEART = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
function pat(p, x, y, c, s = 1) {
  for (let j = 0; j < p.length; j++)
    for (let i = 0; i < p[j].length; i++) if (p[j][i] === 'X') R(x + i * s, y + j * s, s, s, c);
}

// ---------- props ----------
function can(x, y, body, acc) {
  R(x, y, 9, 18, body);
  R(x, y, 9, 2, '#c9ccd6');
  R(x, y + 16, 9, 2, '#9a9daa');
  R(x + 1, y + 5, 7, 7, acc);
  R(x + 1, y + 2, 1, 14, 'rgba(255,255,255,.28)');
  P1(x + 3, y + 7, '#fff');
}
function canTower(x, b) {
  can(x, b - 18, '#ff4f8f', '#ffd0e0');
  can(x, b - 36, '#6a3ab0', '#7ad0ff');
  can(x, b - 54, '#1a1a1e', '#ffc22a');
}
function tree(x, b, sun, seed = 3) {
  const r = RNG(seed + x * 7 + 11);
  R(x - 2, b - 42, 4, 42, '#4a2e22');
  R(x - 1, b - 42, 1, 42, '#6a4432');
  line(x, b - 30, x - 9, b - 44, '#4a2e22');
  line(x, b - 34, x + 9, b - 46, '#4a2e22');
  const cols = sun
    ? ['#b8442a', '#d86a34', '#f09a40', '#8a3424', '#ffb85a']
    : ['#e8902a', '#d0582a', '#f2c13a', '#b8402a', '#e8b040'];
  for (let i = 0; i < 24; i++) {
    const a = r() * 6.28,
      d = r() * 13;
    disc(
      x + Math.cos(a) * d * 1.25,
      b - 52 + Math.sin(a) * d * 0.8,
      (3 + r() * 4) | 0,
      cols[(r() * cols.length) | 0]
    );
  }
}
function litTree(x, b, h, seed) {
  const r = RNG(seed);
  R(x - 1, b - h, 3, h, '#2a2016');
  const br = [];
  for (let i = 0; i < 5; i++) {
    const y = b - h * (0.35 + r() * 0.6),
      d = (r() < 0.5 ? -1 : 1) * (8 + r() * 14);
    line(x, y, x + d, y - 10 - r() * 12, '#2a2016');
    br.push([x, y, x + d, y - 10 - r() * 12]);
  }
  for (let i = 0; i < 120; i++) {
    let px, py;
    if (r() < 0.55) {
      px = x - 1 + r() * 3;
      py = b - h + r() * h;
    } else {
      const q = br[(r() * br.length) | 0],
        t = r();
      px = q[0] + (q[2] - q[0]) * t;
      py = q[1] + (q[3] - q[1]) * t;
    }
    P1(px, py, r() < 0.3 ? '#fff4c8' : '#ffc85a');
  }
}
function lamp(x, b, h, on = 1) {
  R(x, b - h, 2, h, '#1e1e26');
  R(x - 3, b - h - 3, 8, 3, '#2a2a34');
  if (on) {
    ga(0.25);
    disc(x + 1, b - h + 1, 7, '#ffcf7a');
    ga(1);
    R(x - 2, b - h, 6, 2, '#fff1c0');
  }
}

// ---------- backgrounds ----------
const BGS = {
  black: {
    s() {
      R(0, 0, W, H, '#05040a');
    }
  },
  facade: {
    s(tod) {
      const sun = tod === 'sunset';
      bands(
        0,
        114,
        sun
          ? ['#241a46', '#4e2b66', '#8e3d6c', '#d45c5c', '#f6924f', '#ffc47a']
          : ['#4a88e0', '#62a0ee', '#86baf4', '#acd2f8', '#d8ecfc']
      );
      if (sun) {
        disc(262, 100, 15, '#ffd48a');
        disc(262, 100, 11, '#fff0c8');
      }
      const r = RNG(7);
      for (let x = 0; x < W; x += 3) {
        const h = 6 + r() * 9;
        R(x, 113 - h, 4, h, sun ? '#3a2340' : '#3c6a48');
      }
      const wall = sun ? '#d2a6a6' : '#dcd9e2',
        wallS = sun ? '#b08690' : '#c0bdca',
        glass = sun ? '#583a5a' : '#3d5878',
        refl = sun ? '#ffb070' : '#a9c8e8';
      R(34, 28, 252, 102, '#28223a');
      R(36, 30, 248, 100, wall);
      R(36, 30, 248, 4, wallS);
      R(36, 34, 248, 1, '#fff');
      for (let x = 41; x < 280; x += 8)
        for (let y = 40; y < 122; y += 9) {
          if (x > 132 && x < 188 && y > 70) continue;
          R(x, y, 6, 6, glass);
          P1(x, y, refl);
          P1(x + 1, y, refl);
          P1(x, y + 1, refl);
          if (sun && r() < 0.28) R(x + 1, y + 2, 4, 3, '#ffd27a');
        }
      for (let x = 36; x < 286; x += 40) R(x, 34, 2, 96, wallS);
      R(124, 72, 72, 12, '#14204a');
      R(125, 73, 70, 10, '#22378a');
      txt('РАНХиГС', 128, 75, '#ffffff', 7);
      R(130, 88, 60, 4, '#6a6676');
      R(130, 92, 60, 1, '#3a3646');
      R(136, 93, 48, 37, '#1a2432');
      for (let x = 138; x < 184; x += 11) {
        R(x, 95, 9, 35, sun ? '#3a3050' : '#30465e');
        P1(x + 1, 96, refl);
        P1(x + 1, 97, refl);
      }
      for (let i = 0; i < 5; i++)
        R(108 - i * 6, 130 + i * 2, 104 + i * 12, 2, i % 2 ? '#b2afba' : '#cac7d1');
      R(0, 140, W, 40, sun ? '#94747c' : '#8e8b98');
      for (let y = 144; y < 180; y += 6) R(0, y, W, 1, sun ? '#86666e' : '#7f7c89');
      for (let x = 0; x < W; x += 16)
        R(x + (((x / 16) | 0) % 2) * 8, 140, 1, 40, sun ? '#86666e' : '#7f7c89');
      R(116, 56, 1, 74, '#9a98a8');
      R(203, 56, 1, 74, '#9a98a8');
      tree(14, 142, sun, 1);
      tree(304, 144, sun, 2);
      tree(-6, 156, sun, 3);
      tree(326, 160, sun, 4);
    },
    a(t, tod) {
      for (const fx of [117, 204])
        for (let i = 0; i < 12; i++) {
          const o = Math.round(Math.sin(t * 4 - i * 0.6) * 1.2);
          R(fx + i, 56 + o, 1, 3, '#fff');
          R(fx + i, 59 + o, 1, 3, '#2a5ad0');
          R(fx + i, 62 + o, 1, 3, '#d02a2a');
        }
      if (tod !== 'sunset') {
        ga(0.85);
        for (let k = 0; k < 3; k++) {
          const x = ((t * 3 + k * 140) % 460) - 70,
            y = 8 + k * 9;
          ell(x, y, 16, 3, '#fff');
          ell(x + 10, y - 2, 10, 3, '#fff');
        }
        ga(1);
      }
      walkers(t, 150, 6, tod === 'sunset');
    }
  },
  lecture: {
    s() {
      R(0, 0, W, H, '#e9dfcc');
      R(0, 0, W, 16, '#d8d4cc');
      for (let x = 0; x < W; x += 20) R(x, 0, 1, 16, '#c4bfb6');
      R(0, 8, W, 1, '#c4bfb6');
      R(112, 2, 44, 4, '#fffbe8');
      R(204, 2, 44, 4, '#fffbe8');
      R(0, 16, W, 2, '#bfb6a6');
      R(0, 22, 66, 90, '#fff6dc');
      for (let x = 0; x < 66; x += 4) {
        R(x, 22, 3, 90, '#ecd8ac');
        R(x + 3, 22, 1, 90, '#c9b07c');
      }
      R(66, 20, 3, 94, '#a89878');
      R(84, 24, 154, 58, '#8a929c');
      R(86, 26, 150, 54, '#f4f6f8');
      R(86, 80, 150, 3, '#6f7781');
      txt('ТЕОРИЯ ИГР', 94, 31, '#2a4aa0', 7);
      R(94, 46, 62, 1, '#2a4aa0');
      R(94, 54, 44, 1, '#2a4aa0');
      R(94, 62, 56, 1, '#2a4aa0');
      R(94, 70, 30, 1, '#2a4aa0');
      R(170, 44, 58, 30, '#f4f6f8');
      R(198, 44, 1, 30, '#333');
      R(170, 59, 58, 1, '#333');
      txt('3,3', 174, 48, '#c03040', 6);
      txt('0,5', 203, 48, '#c03040', 6);
      txt('5,0', 174, 63, '#c03040', 6);
      txt('1,1', 203, 63, '#c03040', 6);
      R(250, 30, 46, 30, '#7a5a3a');
      R(252, 32, 42, 26, '#c8a46a');
      for (let i = 0; i < 5; i++)
        R(
          255 + i * 8,
          35 + (i % 2) * 6,
          6,
          8,
          ['#ff8a8a', '#8ad0ff', '#ffe08a', '#a8ff8a', '#fff'][i]
        );
      R(0, 104, W, 4, '#b9a585');
      R(0, 108, W, 72, '#d6c4a2');
      for (let i = 0; i < 3; i++) {
        const y = 114 + i * 22;
        R(0, y, W, 5, '#a0683e');
        R(0, y, W, 1, '#c88a58');
        R(0, y + 5, W, 13, '#6e4428');
        for (let x = 8; x < W; x += 40) R(x, y + 5, 26, 13, '#5a3620');
      }
    },
    a(t) {
      ga(0.1 + 0.03 * Math.sin(t * 0.7));
      poly(
        [
          [66, 24],
          [66, 70],
          [230, 180],
          [300, 180]
        ],
        '#fff4c0'
      );
      poly(
        [
          [66, 74],
          [66, 108],
          [150, 180],
          [200, 180]
        ],
        '#fff4c0'
      );
      ga(1);
    }
  },
  comp: {
    s() {
      R(0, 0, W, H, '#ebe7df');
      R(0, 0, W, 18, '#dedad2');
      for (let x = 0; x < W; x += 24) R(x, 0, 1, 18, '#c9c4ba');
      R(0, 9, W, 1, '#c9c4ba');
      R(150, 2, 24, 6, '#bdb8ae');
      for (let i = 0; i < 5; i++) R(152, 3 + i, 20, 1, i % 2 ? '#9a958c' : '#bdb8ae');
      R(0, 18, W, 2, '#c2bcb0');
      R(0, 22, 74, 96, '#fff3d4');
      for (let x = 0; x < 74; x += 5) {
        R(x, 22, 4, 96, '#e8cf9e');
        R(x + 4, 22, 1, 96, '#c6a66c');
      }
      R(236, 34, 70, 48, '#9aa2ac');
      R(238, 36, 66, 44, '#f6f7f9');
      txt('ПР 12', 244, 42, '#555', 6);
      R(244, 54, 40, 1, '#999');
      R(244, 62, 28, 1, '#999');
      R(0, 116, W, 6, '#f2f2f2');
      R(0, 122, W, 58, '#d4d4d8');
      R(0, 122, W, 1, '#b8b8bc');
      for (const x of [84, 146, 208]) {
        R(x, 76, 48, 32, '#0e1014');
        R(x + 2, 78, 44, 28, '#171a20');
        line(x + 6, 80, x + 16, 90, '#2a2e38');
        R(x + 21, 108, 6, 8, '#22242a');
        R(x + 14, 115, 20, 2, '#22242a');
        R(x + 3, 117, 40, 4, '#141418');
        for (let k = 0; k < 9; k++) P1(x + 6 + k * 4, 118, '#3a3a44');
      }
      line(30, 121, 84, 121, '#202024');
      line(130, 121, 146, 120, '#202024');
      canTower(46, 116);
    },
    a(t) {
      ga(0.09 + 0.03 * Math.sin(t * 0.6));
      poly(
        [
          [74, 24],
          [74, 90],
          [220, 180],
          [300, 180]
        ],
        '#fff2c4'
      );
      ga(1);
      if (((t * 1.6) | 0) % 2) R(232, 96, 3, 4, '#7cf2a0');
    }
  },
  corridor: {
    s() {
      R(0, 0, W, H, '#d9d4c8');
      poly(
        [
          [0, 0],
          [320, 0],
          [186, 62],
          [134, 62]
        ],
        '#ebe7e0'
      );
      poly(
        [
          [0, 0],
          [134, 62],
          [134, 96],
          [0, 180]
        ],
        '#cfc8b8'
      );
      poly(
        [
          [320, 0],
          [186, 62],
          [186, 96],
          [320, 180]
        ],
        '#c4bdac'
      );
      poly(
        [
          [0, 180],
          [320, 180],
          [186, 96],
          [134, 96]
        ],
        '#8a8478'
      );
      for (let k = 1; k < 12; k++) {
        const y = 96 + 84 * Math.pow(k / 12, 1.7),
          xl = 134 - ((y - 96) / 84) * 134,
          xr = 186 + ((y - 96) / 84) * 134;
        R(xl, y, xr - xl, 1, '#77716a');
      }
      for (let i = -5; i <= 5; i++) line(160 + i * 5.2, 96, 160 + i * 32, 180, '#7d776e');
      R(134, 62, 52, 34, '#fff6e0');
      R(159, 62, 2, 34, '#b8b2a4');
      R(134, 78, 52, 2, '#b8b2a4');
      for (let k = 0; k < 5; k++) {
        const u = k / 5,
          x0 = 160 - 26 * u - (1 - u) * 70,
          w = (1 - u) * 140 * 0.35 + 8;
        R(160 - w / 2, 6 + u * 50, w, 2 + (1 - u) * 2, '#fffbe8');
      }
      const door = (u1, u2, side) => {
        const pt = u => {
          const x = side < 0 ? 134 * u : 320 - 134 * u,
            top = 62 * u,
            bot = 180 - 84 * u;
          return [x, bot - (bot - top) * 0.6, bot];
        };
        const a = pt(u1),
          b = pt(u2);
        poly(
          [
            [a[0], a[1]],
            [b[0], b[1]],
            [b[0], b[2]],
            [a[0], a[2]]
          ],
          '#5e4430'
        );
        const m = pt((u1 + u2) / 2);
        R(m[0] - 2, m[1] + 4, 4, 2, '#e8e0c8');
      };
      door(0.12, 0.26, -1);
      door(0.48, 0.58, -1);
      door(0.74, 0.8, -1);
      door(0.2, 0.34, 1);
      door(0.6, 0.68, 1);
      poly(
        [
          [250, 58],
          [290, 48],
          [290, 80],
          [250, 84]
        ],
        '#b88a5a'
      );
      for (let i = 0; i < 6; i++)
        R(
          256 + i * 5,
          60 + (i % 3) * 6,
          4,
          5,
          ['#fff', '#ff9ad5', '#9ad0ff', '#ffe08a', '#fff', '#a8ff8a'][i]
        );
      poly(
        [
          [0, 178],
          [134, 95],
          [134, 97],
          [0, 182]
        ],
        '#6a6458'
      );
      poly(
        [
          [320, 178],
          [186, 95],
          [186, 97],
          [320, 182]
        ],
        '#6a6458'
      );
    },
    a(t) {
      if (Math.sin(t * 13) > 0.96) {
        ga(0.18);
        R(0, 0, W, 60, '#000');
        ga(1);
      }
    }
  },
  hall: {
    s() {
      R(0, 0, W, H, '#120d1c');
      R(40, 28, 240, 62, '#241a30');
      R(30, 88, 260, 10, '#5a3a26');
      R(30, 88, 260, 1, '#8a5a3a');
      R(30, 98, 260, 4, '#2e1c12');
      for (const [a, b] of [
        [30, 74],
        [246, 290]
      ])
        for (let x = a; x < b; x += 4) {
          R(x, 20, 3, 80, '#8a1a2a');
          R(x + 3, 20, 1, 80, '#560c18');
          P1(x + 1, 22, '#b83040');
        }
      R(30, 14, 260, 12, '#9a2030');
      for (let x = 30; x < 290; x += 10) ell(x + 5, 26, 5, 2, '#9a2030');
      R(30, 14, 260, 1, '#d8a040');
      R(108, 34, 104, 13, '#2a1a10');
      R(110, 36, 100, 9, '#ffd166');
      txt('ПОСВЯТ·2026', 114, 37, '#3a1a10', 6);
      for (let r = 0; r < 5; r++) {
        const y = 112 + r * 15;
        for (let x = -8 + (r % 2) * 7; x < W; x += 14) {
          ell(x + 7, y, 6, 4, '#5a1020');
          R(x + 1, y, 12, 9, '#6e1626');
          P1(x + 3, y - 2, '#9a2a3a');
        }
      }
    },
    a(t) {
      ga(0.1 + 0.04 * Math.sin(t * 2.2));
      poly(
        [
          [150, 0],
          [170, 0],
          [214, 98],
          [106, 98]
        ],
        '#fff1c8'
      );
      ell(160, 94, 52, 5, '#fff1c8');
      ga(1);
    }
  },
  bench: {
    s(tod) {
      const sun = tod === 'sunset';
      bands(
        0,
        118,
        sun
          ? ['#2c1c4a', '#5a2e6a', '#a8466a', '#e8705a', '#ffaa5e', '#ffd08a']
          : ['#5a96e6', '#78acf0', '#9cc6f6', '#c8e2fa']
      );
      if (sun) {
        disc(70, 104, 16, '#ffd48a');
        disc(70, 104, 12, '#fff0c8');
      }
      R(150, 50, 170, 68, sun ? '#4a3050' : '#b8b4c4');
      for (let x = 156; x < 316; x += 8)
        for (let y = 56; y < 114; y += 8) {
          R(x, y, 5, 5, sun ? ((x + y) % 24 ? '#3a2440' : '#ffc86a') : '#5a7494');
        }
      tree(30, 118, sun, 8);
      tree(130, 120, sun, 9);
      R(0, 118, W, 30, sun ? '#4a3a34' : '#5a8a44');
      for (let x = 0; x < W; x += 3) P1(x, 118 + ((x * 7) % 5), sun ? '#5a4a40' : '#6a9a50');
      R(0, 148, W, 32, sun ? '#8a7068' : '#aaa090');
      R(0, 148, W, 1, sun ? '#6a5048' : '#8a8070');
      lamp(286, 148, 58, sun);
      R(96, 116, 128, 3, '#6a4428');
      R(96, 121, 128, 3, '#6a4428');
      R(96, 126, 128, 3, '#6a4428');
      R(92, 133, 136, 4, '#7a5030');
      R(92, 133, 136, 1, '#9a6a40');
      for (const x of [100, 214]) R(x, 114, 3, 34, '#1a1a1e');
    }
  },
  park: {
    s() {
      bands(0, 104, ['#04050a', '#070912', '#0b0e1e', '#121630', '#171b36']);
      const r = RNG(42);
      for (let i = 0; i < 40; i++) P1(r() * W, r() * 60, r() < 0.5 ? '#3a3e60' : '#8a8eb0');
      for (let x = 0; x < W; x += 5) {
        const h = 14 + r() * 16;
        R(x, 100 - h, 1, h, '#2a2c34');
        line(x, 100 - h * 0.6, x + (r() - 0.5) * 8, 100 - h, '#1c1e26');
      }
      R(120, 92, 80, 10, '#24503a');
      poly(
        [
          [116, 92],
          [160, 80],
          [204, 92]
        ],
        '#2e6046'
      );
      R(146, 86, 28, 5, '#e8f0e0');
      txt('ПАРК', 148, 86, '#24503a', 4);
      bands(100, 180, ['#24180e', '#33230f', '#4a3216', '#5e401c', '#6a4a20']);
      for (let k = 1; k < 14; k++) {
        const y = 100 + 80 * Math.pow(k / 14, 1.6);
        R(0, y, W, 1, 'rgba(0,0,0,.18)');
      }
      for (let i = -10; i <= 10; i++) line(160 + i * 10, 100, 160 + i * 40, 180, 'rgba(0,0,0,.14)');
      litTree(18, 104, 58, 1);
      litTree(64, 102, 46, 2);
      litTree(250, 103, 50, 3);
      litTree(298, 105, 62, 4);
      litTree(196, 100, 30, 5);
      for (const x of [18, 64, 250, 298, 196]) {
        for (let y = 110; y < 180; y += 2) {
          ga(0.18 * (1 - (y - 110) / 70));
          R(x - 3 + ((y * 3) % 5), y, 6, 1, '#ffc860');
        }
      }
      ga(1);
      lamp(40, 104, 40);
      lamp(110, 102, 30);
      lamp(214, 102, 30);
      lamp(282, 104, 40);
    },
    a(t) {
      const G1 = [
        [-10, 30, 330, 58, 22],
        [-10, 70, 330, 64, 10],
        [-10, 82, 330, 90, 8],
        [-10, 10, 180, 96, 26]
      ];
      G1.forEach((g, gi) => {
        const [x0, y0, x1, y1, sag] = g;
        for (let x = x0, i = 0; x <= x1; x += 7, i++) {
          const u = (x - x0) / (x1 - x0),
            y = y0 + (y1 - y0) * u + sag * 4 * u * (1 - u);
          const tw = 0.55 + 0.45 * Math.sin(t * 2.3 + i * 1.7 + gi);
          ga(0.22 * tw);
          disc(x, y, 3, '#ffc060');
          ga(1);
          P1(x, y, tw > 0.5 ? '#fff6d0' : '#ffd890');
          P1(x + 1, y, '#ffd890');
        }
      });
      ga(0.06);
      for (let k = 0; k < 6; k++) {
        disc(((k * 67 + t * 4) % 340) - 10, 30 + ((k * 37) % 60), 10 + (k % 3) * 5, '#ffcf80');
      }
      ga(1);
    }
  },
  room: {
    s(tod, o) {
      const n = tod !== 'day';
      const wl = n ? '#221f40' : '#e6c4a0';
      R(0, 0, W, H, wl);
      R(0, 0, W, 6, n ? '#1a1834' : '#d8b48e');
      R(192, 24, 86, 68, '#141226');
      R(195, 27, 80, 62, n ? '#0c1230' : '#ffe0b8');
      if (n) {
        disc(256, 40, 6, '#f2eed8');
        disc(258, 38, 5, '#0c1230');
        const r = RNG(5);
        for (let x = 196; x < 274; x += 6) {
          const h = 10 + r() * 30;
          R(x, 89 - h, 6, h, '#070a1c');
          for (let y = 89 - h + 3; y < 88; y += 4) if (r() < 0.35) P1(x + 2, y, '#ffd27a');
        }
      } else {
        disc(244, 52, 10, '#fff6d8');
        R(196, 74, 78, 14, '#f8c8a0');
      }
      R(234, 27, 2, 62, '#141226');
      R(195, 57, 80, 2, '#141226');
      R(184, 20, 10, 78, n ? '#4a2e5e' : '#c86a6a');
      R(276, 20, 10, 78, n ? '#4a2e5e' : '#c86a6a');
      R(38, 26, 34, 46, n ? '#3a1a5a' : '#5a2a8a');
      poly(
        [
          [58, 30],
          [48, 48],
          [56, 48],
          [50, 66],
          [64, 44],
          [56, 44],
          [62, 30]
        ],
        '#ffd166'
      );
      R(0, 142, W, 38, n ? '#2a2236' : '#a88466');
      for (let x = 0; x < W; x += 20) R(x, 142, 1, 38, n ? '#231c2e' : '#977458');
      R(12, 110, 150, 5, '#5a3e2e');
      R(12, 110, 150, 1, '#7a5a42');
      R(18, 115, 4, 30, '#4a3226');
      R(152, 115, 4, 30, '#4a3226');
      R(58, 94, 40, 16, '#1a1a22');
      R(60, 96, 36, 12, n ? '#86c0ff' : '#d0e8ff');
      for (let i = 0; i < 4; i++)
        R(63, 98 + i * 3, 18 + ((i * 7) % 10), 1, n ? '#c8e4ff' : '#8aa8c8');
      R(54, 110, 48, 2, '#8a8a96');
      R(26, 88, 2, 22, '#2a2a30');
      R(20, 84, 14, 5, '#ffb347');
      canTower(128, 110);
      can(30, 150, '#1a1a1e', '#ffc22a');
      can(44, 156, '#6a3ab0', '#7ad0ff');
      R(222, 122, 98, 22, '#2a2a4a');
      R(222, 118, 98, 8, n ? '#4a4a8a' : '#7a7ac0');
      R(226, 112, 26, 9, '#e8e0f0');
    },
    a(t, tod, o) {
      const n = tod !== 'day';
      if (n) {
        ga(0.07 + 0.02 * Math.sin(t * 9));
        poly(
          [
            [60, 96],
            [96, 96],
            [130, 142],
            [30, 142]
          ],
          '#9ad0ff'
        );
        ga(1);
      }
      if (o && o.rain) {
        for (let i = 0; i < 26; i++) {
          const x = 196 + ((i * 37) % 78),
            y = ((t * 90 + i * 29) % 62) + 27;
          R(x, y, 1, 3, '#7a8ac8');
        }
      }
    }
  },
  city: {
    s() {
      bands(0, 140, ['#141436', '#2e2458', '#6a3a6a', '#c85e5e', '#f6924f', '#ffc87a', '#ffe6b0']);
      disc(160, 128, 22, '#ffe2a0');
      disc(160, 128, 17, '#fff4d4');
      const r = RNG(9);
      for (let x = 0; x < W; x += 7) {
        const h = 8 + r() * 22;
        R(x, 140 - h, 7, h, '#3a2440');
      }
      const tw = [
        [112, 70, 14],
        [130, 48, 12],
        [146, 30, 16],
        [166, 40, 14],
        [184, 58, 12],
        [200, 76, 10],
        [92, 88, 10],
        [220, 84, 12]
      ];
      for (const [x, h, w] of tw) {
        R(x, 140 - h - 30, w, h + 30, '#241634');
        R(x + 1, 140 - h - 30, 2, h + 30, '#ff9a6a');
        for (let y = 140 - h - 26; y < 138; y += 4)
          for (let xx = x + 4; xx < x + w - 1; xx += 3) if (r() < 0.3) P1(xx, y, '#ffcf8a');
      }
      bands(140, 180, ['#4a2a50', '#7a3a58', '#3a2448', '#1e1634']);
      for (let y = 142; y < 180; y += 3) {
        ga(0.5);
        R(150 - (y - 140) / 2, y, 20 + (y - 140), 1, '#ffd08a');
      }
      ga(1);
    },
    a(t) {
      ga(0.5 + 0.5 * Math.sin(t * 3));
      P1(152, 79, '#fff');
      P1(170, 98, '#fff');
      ga(1);
    }
  }
};
function walkers(t, y0, n, sun) {
  for (let k = 0; k < n; k++) {
    const sp = 6 + k * 2.3,
      dir = k % 2 ? 1 : -1;
    let x = ((t * sp + k * 71) % 380) - 30;
    if (dir < 0) x = W - x;
    const y = y0 + (k % 3) * 8,
      step = (t * 6 + k) | 0;
    const top = ['#2a2a3a', '#7a2a3a', '#2f5a7a', '#e8e0d0', '#3a6a3a', '#5a3a7a'][k % 6];
    R(x, y, 4, 7, top);
    R(x + 1, y - 3, 2, 3, '#f0c8a8');
    R(x, y - 4, 4, 2, ['#2a1a10', '#e8d090', '#5a3a20'][k % 3]);
    R(x + (step % 2), y + 7, 1, 4, '#222');
    R(x + 3 - (step % 2), y + 7, 1, 4, '#222');
  }
}
const bgCache = {};
function bgKey(b) {
  return b.n + '|' + (b.tod || '') + '|' + (b.x || '');
}
function drawBg(b) {
  const k = bgKey(b);
  if (!bgCache[k]) {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const p = C;
    C = c.getContext('2d');
    (BGS[b.n] || BGS.black).s(b.tod, b);
    C = p;
    bgCache[k] = c;
  }
  X.drawImage(bgCache[k], 0, 0);
  const bg = BGS[b.n];
  if (bg && bg.a) bg.a(T, b.tod, b);
}
if (document.fonts)
  document.fonts.ready.then(() => {
    for (const k in bgCache) delete bgCache[k];
  });

// ---------- particles ----------
const PARTS = [];
function emit(type) {
  const p = { type, x: Math.random() * W, y: -4, vx: 0, vy: 0, l: 0, ml: 6 };
  switch (type) {
    case 'leaf':
      p.vx = 0.2 + Math.random() * 0.4;
      p.vy = 0.25 + Math.random() * 0.3;
      p.c = ['#e8902a', '#d0582a', '#f2c13a', '#b8402a'][(Math.random() * 4) | 0];
      break;
    case 'dust':
      p.x = 70 + Math.random() * 180;
      p.y = 30 + Math.random() * 130;
      p.vx = (Math.random() - 0.5) * 0.08;
      p.vy = -0.03;
      p.ml = 4;
      p.c = '#fff6d0';
      break;
    case 'heart':
      p.y = H + 4;
      p.vy = -0.35 - Math.random() * 0.4;
      p.vx = (Math.random() - 0.5) * 0.2;
      p.c = ['#ff5fa2', '#ff9ad5', '#ffd6ec'][(Math.random() * 3) | 0];
      p.ml = 8;
      break;
    case 'spark':
      p.y = Math.random() * H;
      p.ml = 1.2;
      p.c = Math.random() < 0.5 ? '#fff' : '#ffd166';
      break;
    case 'rain':
      p.y = -6;
      p.vx = -0.6;
      p.vy = 5 + Math.random() * 2;
      p.ml = 1;
      p.c = '#6a78b0';
      break;
    case 'snow':
      p.vx = (Math.random() - 0.5) * 0.2;
      p.vy = 0.2 + Math.random() * 0.25;
      p.c = '#e8ecff';
      p.ml = 10;
      break;
  }
  PARTS.push(p);
}
const EMIT = {
  facade: ['leaf', 0.08],
  bench: ['leaf', 0.1],
  lecture: ['dust', 0.12],
  comp: ['dust', 0.1],
  park: ['snow', 0.12],
  hall: ['dust', 0.08]
};
function stepParts() {
  const b = G.bg || {};
  const e = EMIT[b.n];
  if (e && Math.random() < e[1]) emit(e[0]);
  if (G.fant && Math.random() < 0.25) emit(Math.random() < 0.5 ? 'heart' : 'spark');
  if (G.rainAll && Math.random() < 0.9) emit('rain');
  for (let i = PARTS.length - 1; i >= 0; i--) {
    const p = PARTS[i];
    p.l += 1 / 60;
    p.x += p.vx + (p.type === 'leaf' ? Math.sin(p.l * 3) * 0.3 : 0);
    p.y += p.vy;
    if (p.l > p.ml || p.y > H + 8 || p.y < -10 || p.x < -10 || p.x > W + 10) {
      PARTS.splice(i, 1);
      continue;
    }
    if (p.type === 'heart') pat(HEART, p.x, p.y, p.c);
    else if (p.type === 'spark') {
      const a = Math.sin((p.l / p.ml) * Math.PI);
      ga(a);
      P1(p.x, p.y, p.c);
      P1(p.x - 1, p.y, p.c);
      P1(p.x + 1, p.y, p.c);
      P1(p.x, p.y - 1, p.c);
      P1(p.x, p.y + 1, p.c);
      ga(1);
    } else if (p.type === 'rain') {
      ga(0.5);
      R(p.x, p.y, 1, 4, p.c);
      ga(1);
    } else if (p.type === 'dust') {
      ga(0.5 * Math.sin((p.l / p.ml) * Math.PI));
      P1(p.x, p.y, p.c);
      ga(1);
    } else if (p.type === 'leaf') {
      R(p.x, p.y, 2, 1, p.c);
      P1(p.x + (((p.l * 4) | 0) % 2), p.y + 1, p.c);
    } else P1(p.x, p.y, p.c);
  }
}

// ---------- characters ----------
const EMO = {
  neutral: { e: 'open', m: 'flat', b: 'norm' },
  smile: { e: 'open', m: 'smile', b: 'norm' },
  love: { e: 'happy', m: 'kiss', b: 'up', blush: 1, heart: 1 },
  hope: { e: 'wide', m: 'smile', b: 'up', blush: 1 },
  nerv: { e: 'open', m: 'wavy', b: 'sad', sweat: 1 },
  cringe: { e: 'half', m: 'wavy', b: 'sad', sweat: 1, gloom: 1 },
  sad: { e: 'sad', m: 'frown', b: 'sad' },
  broken: { e: 'closed', m: 'frown', b: 'sad', tear: 1, gloom: 1 },
  angry: { e: 'open', m: 'frown', b: 'angry' },
  think: { e: 'side', m: 'flat', b: 'up' },
  shock: { e: 'wide', m: 'o', b: 'up' },
  smug: { e: 'half', m: 'grin', b: 'norm' },
  grow: { e: 'half', m: 'smile', b: 'angry', spark: 1 },
  cool: { e: 'half', m: 'smile', b: 'norm', spark: 1 },
  soft: { e: 'happy', m: 'smile', b: 'norm', blush: 1 },
  cold: { e: 'half', m: 'flat', b: 'norm' },
  awk: { e: 'side', m: 'wavy', b: 'sad', sweat: 1 },
  tired: { e: 'half', m: 'flat', b: 'sad' },
  annoyed: { e: 'half', m: 'frown', b: 'angry' },
  laugh: { e: 'happy', m: 'open', b: 'up' }
};
function face(hx, hy, em, S, blink, t, talk) {
  const E = EMO[em] || EMO.neutral;
  let e = E.e;
  if (blink && ['open', 'wide', 'side', 'sad'].includes(e)) e = 'closed';
  const ec = S.eye,
    dx = S.edx || 6,
    ey = hy + 1;
  for (const d of [-1, 1]) {
    const x = hx + d * dx;
    switch (e) {
      case 'open':
        R(x - 1, ey - 2, 3, 4, ec);
        P1(x - 1, ey - 2, '#fff');
        break;
      case 'wide':
        R(x - 2, ey - 3, 5, 5, '#fff');
        R(x - 1, ey - 2, 3, 3, ec);
        P1(x, ey - 2, '#fff');
        break;
      case 'side':
        R(x - 2, ey - 2, 2, 4, '#fff');
        R(x, ey - 2, 2, 4, ec);
        break;
      case 'half':
        R(x - 2, ey - 1, 5, 1, S.lid);
        R(x - 1, ey, 3, 2, ec);
        break;
      case 'sad':
        R(x - 1, ey - 1, 3, 3, ec);
        P1(x - 1, ey - 1, '#fff');
        break;
      case 'closed':
        R(x - 2, ey, 5, 1, ec);
        break;
      case 'happy':
        P1(x - 2, ey, ec);
        R(x - 1, ey - 1, 3, 1, ec);
        P1(x + 2, ey, ec);
        break;
    }
    if (S.lash && e !== 'closed' && e !== 'happy') {
      R(x - 2, ey - 3, 5, 1, ec);
      P1(x + d * 3, ey - 4, ec);
    }
    const by = hy - 5 - (E.b === 'up' ? 1 : 0) - (e === 'wide' ? 1 : 0);
    for (let i = 0; i < 5; i++) {
      const inner = d < 0 ? i >= 3 : i <= 1;
      const dy = E.b === 'angry' ? (inner ? 1 : 0) : E.b === 'sad' ? (inner ? -1 : 0) : 0;
      P1(x - 2 + i, by + dy, S.brow);
    }
  }
  P1(hx, hy + 5, S.shade);
  P1(hx + 1, hy + 5, S.shade);
  let m = E.m;
  if (talk) m = ((t * 9) | 0) % 2 ? 'o' : m;
  const mc = S.lip,
    my = hy + 9;
  switch (m) {
    case 'flat':
      R(hx - 2, my, 5, 1, mc);
      break;
    case 'smile':
      R(hx - 2, my, 5, 1, mc);
      P1(hx - 3, my - 1, mc);
      P1(hx + 3, my - 1, mc);
      break;
    case 'grin':
      R(hx - 3, my - 1, 7, 1, mc);
      R(hx - 2, my, 5, 1, '#fff');
      R(hx - 2, my + 1, 5, 1, mc);
      P1(hx + 4, my - 2, mc);
      break;
    case 'open':
      R(hx - 2, my - 1, 5, 3, '#4a1420');
      R(hx - 1, my + 1, 3, 1, '#e0707a');
      break;
    case 'o':
      R(hx - 1, my - 1, 3, 3, '#4a1420');
      break;
    case 'frown':
      R(hx - 2, my, 5, 1, mc);
      P1(hx - 3, my + 1, mc);
      P1(hx + 3, my + 1, mc);
      break;
    case 'wavy':
      for (let i = 0; i < 6; i++) P1(hx - 3 + i, my - (i % 2), mc);
      break;
    case 'kiss':
      R(hx - 1, my - 1, 3, 3, '#c85a6a');
      P1(hx, my, '#7a2a3a');
      break;
  }
  if (E.blush) {
    ga(0.75);
    R(hx - dx - 3, hy + 5, 4, 1, '#ff7a98');
    R(hx + dx, hy + 5, 4, 1, '#ff7a98');
    ga(1);
  }
  if (E.sweat) {
    const sy = hy - 8 + (((t * 7) | 0) % 6);
    R(hx + 16, sy, 2, 3, '#9ad8ff');
    P1(hx + 16, sy, '#fff');
  }
  if (E.tear) {
    const ty = ey + 2 + (((t * 9) | 0) % 9);
    R(hx - dx, ty, 1, 2, '#9ad8ff');
    R(hx + dx, ty + 3, 1, 2, '#9ad8ff');
  }
  if (E.gloom) {
    ga(0.55);
    for (let i = -8; i <= 8; i += 4) R(hx + i, hy - 15, 1, 7, '#4a4aa8');
    ga(1);
  }
  if (E.heart) {
    const k = (t * 2) % 1;
    ga(1 - k);
    pat(HEART, hx + 16, hy - 14 - k * 10, '#ff5fa2');
    ga(1);
  }
  if (E.spark) {
    const k = (t * 1.3) % 1;
    ga(Math.sin(k * Math.PI));
    const sx = hx - 20 + (((t * 1.3) | 0) % 3) * 20,
      sy = hy - 18;
    R(sx, sy - 2, 1, 5, '#fff');
    R(sx - 2, sy, 5, 1, '#fff');
    ga(1);
  }
}
function head(x, hy, rx, ry, S, out) {
  ell(x, hy, rx + 1, ry + 1, out);
  ell(x, hy + 3, rx + 1, ry - 2, out);
  ell(x, hy, rx, ry, S.skin);
  ell(x, hy + 3, rx, ry - 3, S.skin);
  ga(0.35);
  R(x + rx - 3, hy - 2, 3, 10, S.shade);
  ga(1);
}
function glassesAv(x, hy) {
  const g = '#d8b468',
    g2 = '#a8843e';
  ga(0.22);
  R(x - 12, hy - 3, 9, 7, '#d8ecff');
  R(x + 3, hy - 3, 9, 7, '#d8ecff');
  ga(1);
  R(x - 12, hy - 3, 9, 1, g);
  R(x + 3, hy - 3, 9, 1, g);
  R(x - 12, hy - 2, 1, 5, g);
  R(x - 4, hy - 2, 1, 4, g);
  R(x + 3, hy - 2, 1, 4, g);
  R(x + 11, hy - 2, 1, 5, g);
  R(x - 11, hy + 3, 6, 1, g);
  P1(x - 5, hy + 2, g);
  R(x + 5, hy + 3, 6, 1, g);
  P1(x + 4, hy + 2, g);
  R(x - 3, hy - 3, 6, 1, g);
  R(x - 3, hy - 1, 6, 1, g2);
  R(x - 15, hy - 2, 3, 1, g);
  R(x + 12, hy - 2, 3, 1, g);
  P1(x - 10, hy - 2, '#fff');
  P1(x + 5, hy - 2, '#fff');
}
function glassesRound(x, hy, c = '#141418') {
  ga(0.15);
  disc(x - 6, hy + 1, 5, '#d8ecff');
  disc(x + 6, hy + 1, 5, '#d8ecff');
  ga(1);
  ring(x - 6, hy + 1, 5.2, c);
  ring(x + 6, hy + 1, 5.2, c);
  R(x - 1, hy, 2, 1, c);
  R(x - 15, hy - 1, 4, 1, c);
  R(x + 11, hy - 1, 4, 1, c);
}
function drawRu(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#f1c09c',
      shade: '#d4946f',
      eye: '#2a160e',
      brow: '#3a2216',
      lip: '#a8605a',
      lid: '#c98a6a'
    },
    out = '#160e14',
    by = hy + 21;
  const suit = o.outfit === 'suit',
    lea = o.outfit === 'leather';
  if (suit) {
    ell(x, by + 9, 34, 10, out);
    R(x - 34, by + 9, 68, H, out);
    ell(x, by + 9, 33, 9, '#17171e');
    R(x - 33, by + 9, 66, H, '#17171e');
    poly(
      [
        [x - 9, by - 3],
        [x + 9, by - 3],
        [x, by + 44]
      ],
      '#f2f2f6'
    );
    poly(
      [
        [x - 2, by + 3],
        [x + 2, by + 3],
        [x + 3, by + 36],
        [x, by + 40],
        [x - 3, by + 36]
      ],
      '#0a0a0e'
    );
    R(x - 3, by, 6, 4, '#0a0a0e');
    poly(
      [
        [x - 9, by - 3],
        [x - 16, by + 8],
        [x - 2, by + 44]
      ],
      '#24242e'
    );
    poly(
      [
        [x + 9, by - 3],
        [x + 16, by + 8],
        [x + 2, by + 44]
      ],
      '#24242e'
    );
    R(x - 24, by + 20, 1, 60, '#0c0c10');
    R(x + 23, by + 20, 1, 60, '#0c0c10');
  } else if (lea) {
    ell(x, by + 9, 34, 10, out);
    R(x - 34, by + 9, 68, H, out);
    ell(x, by + 9, 33, 9, '#2c1c18');
    R(x - 33, by + 9, 66, H, '#2c1c18');
    poly(
      [
        [x - 10, by - 2],
        [x + 10, by - 2],
        [x + 14, H],
        [x - 14, H]
      ],
      '#121216'
    );
    poly(
      [
        [x - 10, by - 2],
        [x - 20, by + 10],
        [x - 12, by + 40]
      ],
      '#3a2620'
    );
    poly(
      [
        [x + 10, by - 2],
        [x + 20, by + 10],
        [x + 12, by + 40]
      ],
      '#3a2620'
    );
    R(x - 15, by + 20, 1, 60, '#8a8a96');
    for (let y = by + 12; y < H; y += 12) R(x - 30, y, 60, 1, '#22140f');
  } else {
    ell(x, by + 9, 35, 10, out);
    R(x - 35, by + 9, 70, H, out);
    ell(x, by + 9, 34, 9, '#1c1b24');
    R(x - 34, by + 9, 68, H, '#1c1b24');
    poly(
      [
        [x - 12, by],
        [x + 12, by],
        [x + 17, H],
        [x - 17, H]
      ],
      '#5e6372'
    );
    R(x - 12, by, 24, 2, '#4a4e5c');
    ell(x, by - 1, 15, 4, '#26252f');
    R(x - 21, by + 10, 1, 44, '#2e2d38');
    R(x + 20, by + 12, 1, 40, '#2e2d38');
    R(x - 26, by + 24, 1, 70, '#121118');
    R(x + 25, by + 24, 1, 70, '#121118');
  }
  R(x - 5, hy + 12, 10, 11, S.skin);
  R(x - 5, hy + 12, 10, 3, S.shade);
  R(x - 17, hy - 1, 4, 8, out);
  R(x + 13, hy - 1, 4, 8, out);
  R(x - 16, hy, 3, 6, S.skin);
  R(x + 13, hy, 3, 6, S.skin);
  head(x, hy, 14, 16, S, out);
  face(x, hy, em, S, blink, t, talk);
  const hc = '#2e1a12',
    hm = '#4e2e1e',
    hl = '#7a5036',
    sc = suit ? 0.8 : 1,
    rr = RNG(77);
  ell(x, hy - 13, 16, 7, hc);
  R(x - 15, hy - 12, 4, 9, hc);
  R(x + 11, hy - 12, 4, 9, hc);
  const cur = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI * (1 + i / 14);
    cur.push([
      x + Math.cos(a) * (15 + rr() * 2.5),
      hy - 9 + Math.sin(a) * (12 + rr() * 3) * sc,
      3 + ((rr() * 2.4) | 0)
    ]);
  }
  for (let i = 0; i < 7; i++)
    cur.push([x - 10 + rr() * 20, hy - 17 - rr() * 5 * sc, 3 + ((rr() * 2) | 0)]);
  cur.push([x - 16, hy - 5, 3], [x + 16, hy - 5, 3], [x - 17, hy - 9, 3], [x + 17, hy - 10, 3]);
  for (const [a, b, r] of cur) disc(a, b, r, hc);
  for (const [a, b, r] of cur) {
    disc(a - 1, b - 1, r - 2, hm);
    P1(a - 1, b - r + 1, hl);
    P1(a, b - r + 1, hl);
  }
  for (let i = -4; i <= 4; i++) {
    const fx = x + i * 3.4,
      fy = hy - 9 + (i & 1) + (i === 1 ? 2 : 0);
    disc(fx, fy, 3, hc);
    disc(fx - 1, fy - 1, 1, hm);
    P1(fx, fy - 2, hl);
  }
  disc(x + 2, hy - 5, 2, hc);
  P1(x + 1, hy - 6, hm);
  P1(x + 3, hy - 3, hc);
  if (suit) glassesRound(x, hy);
  else if (!lea) glassesAv(x, hy);
  else {
    R(x + 13, hy + 6, 2, 2, '#e8e8f0');
  }
}
function drawNu(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#f8d8c6',
      shade: '#e4ae9c',
      eye: '#3a2216',
      brow: '#a27c5a',
      lip: '#d6868a',
      lid: '#e0a898',
      lash: 1
    },
    out = '#1a1218',
    H1 = '#f6e8ba',
    H2 = '#ddc58e',
    H3 = '#b49864',
    HL = '#fff7dc',
    by = hy + 21;
  const sw = Math.sin(t * 1.2) * 0.6;
  R(x - 17, hy - 6, 34, 72, H3);
  R(x - 16, hy - 6, 32, 72, H2);
  for (let i = -14; i < 16; i += 4) R(x + i, hy + 12, 1, 54, H3);
  ell(x, by + 10, 36, 11, out);
  R(x - 36, by + 10, 72, H, out);
  ell(x, by + 10, 35, 10, '#18171f');
  R(x - 35, by + 10, 70, H, '#18171f');
  for (let y = by + 17; y < H; y += 10) {
    R(x - 34, y, 68, 1, '#0b0a10');
    R(x - 34, y + 1, 68, 1, '#2a2838');
  }
  R(x - 12, by - 4, 24, 11, out);
  R(x - 11, by - 3, 22, 10, '#211f2c');
  poly(
    [
      [x - 5, by - 2],
      [x + 5, by - 2],
      [x, by + 13]
    ],
    '#f4f4f6'
  );
  R(x, by + 13, 1, H, '#3a3848');
  P1(x - 3, by, '#cfd3db');
  P1(x - 2, by + 2, '#cfd3db');
  P1(x + 2, by + 2, '#cfd3db');
  P1(x + 3, by, '#cfd3db');
  R(x, by + 3, 1, 4, '#e6e9f0');
  R(x - 1, by + 4, 3, 1, '#e6e9f0');
  R(x - 4, hy + 11, 8, 11, S.skin);
  R(x - 4, hy + 11, 8, 2, S.shade);
  head(x, hy, 13, 15, S, out);
  face(x, hy, em, S, blink, t, talk);
  ell(x, hy - 11, 15, 7, H2);
  ell(x, hy - 12, 14, 6, H1);
  R(x, hy - 18, 1, 7, H2);
  P1(x - 1, hy - 17, H2);
  P1(x + 1, hy - 17, H2);
  for (const d of [-1, 1]) {
    R(x + d * 6, hy - 16, 1, 4, HL);
    R(x + d * 10, hy - 14, 1, 5, HL);
  }
  poly(
    [
      [x, hy - 12],
      [x - 14, hy - 7],
      [x - 16, hy + 18],
      [x - 11, hy + 18],
      [x - 10, hy - 4]
    ],
    H1
  );
  poly(
    [
      [x + 1, hy - 12],
      [x + 15, hy - 7],
      [x + 17, hy + 18],
      [x + 12, hy + 18],
      [x + 11, hy - 4]
    ],
    H1
  );
  R(x - 14, hy - 4, 1, 20, HL);
  R(x + 14, hy - 4, 1, 20, HL);
  R(x - 11, hy - 2, 1, 18, H2);
  R(x + 11, hy - 2, 1, 18, H2);
  poly(
    [
      [x - 20, hy + 10],
      [x - 9, hy + 10],
      [x - 8, hy + 50],
      [x - 12, hy + 56],
      [x - 17, hy + 53],
      [x - 20, hy + 46]
    ],
    H1
  );
  poly(
    [
      [x + 9, hy + 10],
      [x + 20, hy + 10],
      [x + 20, hy + 46],
      [x + 17, hy + 53],
      [x + 12, hy + 56],
      [x + 8, hy + 50]
    ],
    H1
  );
  for (const d of [-1, 1])
    for (let k = 0; k < 11; k++) {
      const cx = x + d * (9 + k),
        len = 40 + ((k * 7) % 9) - (k > 8 ? 8 : 0),
        wv = Math.round(Math.sin(k * 0.9 + t * 1.2) * 0.6);
      const col = k % 3 === 0 ? HL : k % 3 === 1 ? H1 : H2;
      R(cx + wv, hy + 10 + (k > 8 ? 4 : 0), 1, len, col);
    }
  R(x - 12, hy - 7, 3, 2, '#0c0c0c');
  P1(x - 11, hy - 8, '#0c0c0c');
  R(x + 10, hy - 7, 3, 2, '#0c0c0c');
  P1(x + 11, hy - 8, '#0c0c0c');
  ring(x - 12, hy + 9, 1.6, '#d8dce4');
  ring(x + 12, hy + 9, 1.6, '#d8dce4');
}
function drawDan(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#e2ae86',
      shade: '#c08c66',
      eye: '#1e120c',
      brow: '#2a1a10',
      lip: '#9a5a4a',
      lid: '#b88060'
    },
    out = '#140e0c',
    by = hy + 21;
  ell(x, by + 9, 34, 10, out);
  R(x - 34, by + 9, 68, H, out);
  ell(x, by + 9, 33, 9, '#2f7a4c');
  R(x - 33, by + 9, 66, H, '#2f7a4c');
  ell(x, by - 1, 16, 5, '#28683f');
  R(x - 6, by + 2, 1, 16, '#fff');
  R(x + 5, by + 2, 1, 16, '#fff');
  R(x - 16, by + 40, 32, 20, '#28683f');
  R(x - 16, by + 40, 32, 1, '#22573a');
  R(x - 5, hy + 12, 10, 11, S.skin);
  R(x - 5, hy + 12, 10, 3, S.shade);
  head(x, hy, 14, 16, S, out);
  face(x, hy, em, S, blink, t, talk);
  ell(x, hy - 12, 15, 6, '#c83a3a');
  R(x - 15, hy - 12, 30, 4, '#c83a3a');
  R(x - 15, hy - 9, 30, 2, '#a02a2a');
  R(x - 3, hy - 10, 6, 3, '#2a1a10');
  R(x - 15, hy - 7, 3, 5, '#2a1a10');
  R(x + 12, hy - 7, 3, 5, '#2a1a10');
}
function drawLera(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#f4cdb8',
      shade: '#dca690',
      eye: '#22140e',
      brow: '#22141a',
      lip: '#c8303a',
      lid: '#d49a88',
      lash: 1
    },
    out = '#160e14',
    by = hy + 21;
  R(x - 17, hy - 6, 34, 26, '#24161e');
  ell(x, by + 9, 33, 10, out);
  R(x - 33, by + 9, 66, H, out);
  ell(x, by + 9, 32, 9, '#c9a27a');
  R(x - 32, by + 9, 64, H, '#c9a27a');
  poly(
    [
      [x - 9, by - 2],
      [x + 9, by - 2],
      [x, by + 30]
    ],
    '#141218'
  );
  poly(
    [
      [x - 9, by],
      [x - 20, by + 12],
      [x - 6, by + 38]
    ],
    '#b48a62'
  );
  poly(
    [
      [x + 9, by],
      [x + 20, by + 12],
      [x + 6, by + 38]
    ],
    '#b48a62'
  );
  R(x - 14, by + 44, 3, 3, '#6a4a2a');
  R(x + 11, by + 44, 3, 3, '#6a4a2a');
  R(x - 5, hy + 12, 10, 11, S.skin);
  head(x, hy, 13, 15, S, out);
  face(x, hy, em, S, blink, t, talk);
  ell(x, hy - 10, 16, 8, '#24161e');
  R(x - 12, hy - 12, 24, 6, '#24161e');
  R(x - 17, hy - 8, 5, 24, '#24161e');
  R(x + 12, hy - 8, 5, 24, '#24161e');
  R(x - 9, hy - 11, 8, 1, '#4a2e3a');
}
function drawPal(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#eebc9c',
      shade: '#cc9474',
      eye: '#1e120c',
      brow: '#8a8a94',
      lip: '#8a4a40',
      lid: '#c08a70'
    },
    out = '#140e0c',
    by = hy + 21;
  ell(x, by + 9, 35, 10, out);
  R(x - 35, by + 9, 70, H, out);
  ell(x, by + 9, 34, 9, '#6a4a32');
  R(x - 34, by + 9, 68, H, '#6a4a32');
  poly(
    [
      [x - 9, by - 2],
      [x + 9, by - 2],
      [x, by + 40]
    ],
    '#bcd4ec'
  );
  poly(
    [
      [x - 2, by + 2],
      [x + 2, by + 2],
      [x + 2, by + 34],
      [x - 2, by + 34]
    ],
    '#7a1a2a'
  );
  R(x - 5, hy + 12, 10, 11, S.skin);
  head(x, hy, 14, 16, S, out);
  face(x, hy, em, S, blink, t, talk);
  ell(x, hy + 11, 12, 6, '#9a9aa4');
  R(x - 3, hy + 8, 7, 2, S.lip);
  if (talk && ((t * 9) | 0) % 2) R(x - 2, hy + 9, 5, 2, '#4a1420');
  R(x - 15, hy - 8, 4, 10, '#b8b8c2');
  R(x + 11, hy - 8, 4, 10, '#b8b8c2');
  P1(x - 4, hy - 13, '#fff');
  glassesRound(x, hy, '#3a3020');
}
const CHD = { ru: drawRu, nu: drawNu, dan: drawDan, lera: drawLera, pal: drawPal };
const chCan = {};
function renderChar(id, emo, o, t, talk, dim) {
  if (!chCan[id]) {
    const c = document.createElement('canvas');
    c.width = 100;
    c.height = 164;
    chCan[id] = c;
  }
  const c = chCan[id],
    g = c.getContext('2d');
  g.clearRect(0, 0, 100, 164);
  const p = C;
  C = g;
  const blink = (t + id.length * 1.7) % 4.3 < 0.13;
  CHD[id](50, 42, emo, t, blink, o || {}, talk);
  if (dim) {
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = 'rgba(14,8,34,.42)';
    g.fillRect(0, 0, 100, 164);
    g.globalCompositeOperation = 'source-over';
  }
  C = p;
  return c;
}
const POS = { l: 84, c: 160, r: 236, ll: 48, rr: 272 };
function drawChars() {
  const ids = Object.keys(G.chars);
  for (const id of ids) {
    const ch = G.chars[id];
    if (ch.x == null) ch.x = ch.tx;
    if (ch.a == null) ch.a = 0;
    ch.x += (ch.tx - ch.x) * 0.14;
    ch.a += ((ch.out ? 0 : 1) - ch.a) * 0.14;
    if (ch.out && ch.a < 0.03) {
      delete G.chars[id];
      continue;
    }
    let ox = 0,
      oy = Math.round(Math.sin(T * 1.6 + id.length) * 0.7);
    const dt = T - (ch.t0 || 0);
    if (dt < 0.4) {
      if (['shock', 'cringe', 'angry', 'nerv', 'awk'].includes(ch.emo))
        ox = Math.round(Math.sin(dt * 70) * 2 * (1 - dt / 0.4));
      else if (['love', 'hope', 'laugh', 'smile', 'soft', 'smug', 'grow', 'cool'].includes(ch.emo))
        oy -= Math.round(Math.sin((dt / 0.4) * Math.PI) * 4);
    }
    if (['sad', 'broken', 'tired'].includes(ch.emo)) oy += 2;
    const sp = G.speaker,
      speak = sp === id || (sp === 'in' && id === 'ru');
    const dim = sp && sp !== 'nar' && !speak && SP[sp];
    const c = renderChar(id, ch.emo, ch, T, false, dim);
    ga(Math.min(1, ch.a));
    X.drawImage(c, Math.round(ch.x - 50 + ox), Math.round(16 + oy + (1 - ch.a) * 6));
    ga(1);
  }
}
function drawTrain() {
  if (!G.train) return;
  const k = (T - G.train) / 2.4;
  if (k > 1) {
    G.train = 0;
    return;
  }
  const x = W + 20 - k * (W + 560);
  ga(0.9);
  R(0, 64, W, 1, '#fff');
  ga(1);
  for (let i = 0; i < 4; i++) {
    const cx = x + i * 136;
    R(cx, 66, 132, 50, '#d8dce6');
    R(cx, 66, 132, 4, '#f2f4f8');
    R(cx, 96, 132, 5, '#d02a3a');
    for (let w = 0; w < 6; w++) {
      R(cx + 8 + w * 21, 74, 15, 14, '#1e2a40');
      R(cx + 9 + w * 21, 75, 13, 3, '#ffd27a');
    }
    R(cx, 116, 132, 4, '#30323c');
    for (const wx of [14, 40, 92, 118]) disc(cx + wx, 121, 4, '#16161c');
  }
  poly(
    [
      [x - 24, 116],
      [x, 66],
      [x, 116]
    ],
    '#d8dce6'
  );
  R(x - 16, 86, 10, 8, '#1e2a40');
  ga(0.5);
  for (let i = 0; i < 12; i++) R(x + 560 + i * 18, 70 + ((i * 4) % 40), 40, 1, '#fff');
  ga(1);
}
function miniPerson(x, y, p, s, t) {
  const st = ((t * 5 + p.ph) | 0) % 2,
    f = (a, b, w, h, c) => R(x + a * s, y + b * s, w * s, h * s, c);
  const sk = p.sk || '#f2c8aa';
  f(3, 19, 2, 9 + (p.walk ? st : 0), p.pants);
  f(6, 19, 2, 9 + (p.walk ? 1 - st : 0), p.pants);
  f(3, 28, 2, 1, '#111');
  f(6, 28, 2, 1, '#111');
  if (
    p.hair === 'blondeLong' ||
    p.hair === 'brownLong' ||
    p.hair === 'redLong' ||
    p.hair === 'darkLong'
  ) {
    const hc = {
      blondeLong: '#f2e2a8',
      brownLong: '#6a4428',
      redLong: '#b8502a',
      darkLong: '#24161e'
    }[p.hair];
    f(2, 3, 7, 12, hc);
  }
  f(2, 8, 7, 11, p.top);
  f(1, 9, 1, 8, p.top);
  f(9, 9, 1, 8, p.top);
  f(3, 2, 5, 6, sk);
  const hc = {
    blondeLong: '#f2e2a8',
    brownLong: '#6a4428',
    redLong: '#b8502a',
    darkLong: '#24161e',
    blondeShort: '#e8d48a',
    darkShort: '#2a1a10',
    blondeBun: '#f2e2a8',
    cap: '#c83a3a',
    curly: '#2e1a12'
  }[p.hair];
  f(3, 1, 5, 2, hc);
  f(2, 2, 1, 3, hc);
  f(8, 2, 1, 3, hc);
  if (p.hair === 'blondeBun') f(4, -1, 3, 2, hc);
  if (p.hair === 'cap') f(2, 2, 7, 1, '#a02a2a');
  if (p.hair === 'blondeLong') {
    f(4, 2, 1, 1, '#111');
    f(6, 2, 1, 1, '#111');
  }
  if (
    p.hair === 'blondeLong' ||
    p.hair === 'brownLong' ||
    p.hair === 'redLong' ||
    p.hair === 'darkLong'
  ) {
    f(2, 8, 2, 6, hc);
    f(7, 8, 2, 6, hc);
  }
}

'use strict';
// ================= ART 2: Нижний, Жигули, пацаны =================
function zhiguli(x, y, col = '#eeece6', t = 0, lights = 0) {
  const sh = '#c4c2bc',
    ol = '#16161a',
    cr = '#d8dce4';
  y += 2;
  R(x + 1, y + 9, 64, 11, ol);
  R(x + 2, y + 10, 62, 9, col);
  R(x + 2, y + 10, 62, 1, '#fff');
  R(x + 2, y + 15, 62, 1, cr);
  R(x + 2, y + 18, 62, 1, sh);
  poly(
    [
      [x + 15, y + 10],
      [x + 20, y],
      [x + 47, y],
      [x + 52, y + 10]
    ],
    ol
  );
  poly(
    [
      [x + 16, y + 10],
      [x + 21, y + 1],
      [x + 46, y + 1],
      [x + 51, y + 10]
    ],
    col
  );
  poly(
    [
      [x + 18, y + 9],
      [x + 22, y + 2],
      [x + 33, y + 2],
      [x + 33, y + 9]
    ],
    '#2a3444'
  );
  poly(
    [
      [x + 35, y + 9],
      [x + 35, y + 2],
      [x + 45, y + 2],
      [x + 49, y + 9]
    ],
    '#2a3444'
  );
  R(x + 24, y + 6, 6, 3, '#9a1e24');
  R(x + 37, y + 6, 6, 3, '#9a1e24');
  P1(x + 23, y + 3, '#9ec8e8');
  P1(x + 36, y + 3, '#9ec8e8');
  R(x + 34, y + 2, 1, 8, cr);
  R(x + 20, y + 1, 27, 1, cr);
  R(x + 33, y + 11, 1, 7, sh);
  R(x + 27, y + 12, 3, 1, cr);
  R(x + 40, y + 12, 3, 1, cr);
  R(x + 47, y + 4, 3, 2, cr);
  R(x - 1, y + 17, 7, 3, cr);
  R(x + 61, y + 17, 7, 3, cr);
  R(x + 1, y + 17, 2, 3, '#111');
  R(x + 63, y + 17, 2, 3, '#111');
  R(x + 62, y + 11, 3, 3, lights ? '#fff6c0' : '#f2eee0');
  R(x + 62, y + 14, 3, 2, '#ff9a2a');
  R(x + 1, y + 11, 2, 3, '#d02a2a');
  R(x + 1, y + 14, 2, 2, '#ff9a2a');
  if (lights) {
    ga(0.22);
    poly(
      [
        [x + 65, y + 11],
        [x + 112, y + 4],
        [x + 112, y + 24],
        [x + 65, y + 15]
      ],
      '#fff2b0'
    );
    ga(1);
  }
  for (const wx of [13, 53]) {
    disc(x + wx, y + 20, 5, ol);
    disc(x + wx, y + 20, 4, '#c8ccd6');
    disc(x + wx, y + 20, 2, '#8a8e98');
    P1(x + wx, y + 20, '#c03030');
    const a = t * 12;
    P1(x + wx + Math.round(Math.cos(a) * 3), y + 20 + Math.round(Math.sin(a) * 3), '#f4f6fa');
  }
}
function makeZhigaCG() {
  const c = document.createElement('canvas');
  c.width = 200;
  c.height = 150;
  const p = C;
  C = c.getContext('2d');
  R(0, 0, 200, 150, '#0c0b0e');
  for (const lx of [10, 26, 174, 190]) {
    ga(0.9);
    R(lx, 8, 2, 80, '#ffcf8a');
    ga(0.15);
    R(lx - 3, 8, 8, 80, '#ffcf8a');
    ga(1);
  }
  bands(98, 150, ['#141216', '#1c1a1e', '#121014']);
  for (let i = 0; i < 30; i++) {
    ga(0.25);
    R(20 + i * 5.5, 104 + ((i * 7) % 40), 2, 8, '#ffd8a0');
    ga(1);
  }
  const W2 = 200,
    cx = 100;
  R(28, 44, 144, 6, '#1a1a1e');
  poly(
    [
      [50, 44],
      [62, 22],
      [138, 22],
      [150, 44]
    ],
    '#1a1a1e'
  );
  poly(
    [
      [52, 44],
      [63, 24],
      [137, 24],
      [148, 44]
    ],
    '#eeece6'
  );
  poly(
    [
      [58, 43],
      [67, 27],
      [133, 27],
      [142, 43]
    ],
    '#2a2c34'
  );
  R(70, 34, 22, 9, '#8a1a22');
  R(108, 34, 22, 9, '#8a1a22');
  R(92, 30, 16, 3, '#3a3a44');
  line(66, 28, 80, 42, '#4a4e5a');
  R(26, 44, 148, 40, '#16161a');
  R(28, 46, 144, 36, '#eeece6');
  R(28, 46, 144, 2, '#ffffff');
  R(28, 60, 144, 1, '#c4c2bc');
  R(34, 58, 132, 18, '#9a9ea8');
  for (let y = 59; y < 75; y += 2) R(56, y, 88, 1, '#e8ecf2');
  for (const hx of [44, 60, 140, 156]) {
    disc(hx, 66, 7, '#16161a');
    disc(hx, 66, 6, '#e8ecf2');
    disc(hx, 66, 4, '#fff6d8');
    P1(hx - 1, 64, '#fff');
  }
  R(97, 60, 6, 9, '#c8a040');
  R(30, 76, 12, 4, '#ff9a2a');
  R(158, 76, 12, 4, '#ff9a2a');
  R(24, 82, 152, 6, '#d8dce4');
  R(24, 82, 152, 1, '#ffffff');
  R(44, 80, 8, 12, '#141416');
  R(148, 80, 8, 12, '#141416');
  R(80, 84, 40, 9, '#ffffff');
  R(80, 84, 40, 1, '#222');
  R(82, 86, 26, 5, '#222');
  R(110, 86, 8, 5, '#2a5ad0');
  R(30, 88, 140, 6, '#eeece6');
  R(30, 94, 140, 2, '#c4c2bc');
  for (const wx of [40, 160]) {
    ell(wx, 104, 13, 12, '#0c0c0e');
    ell(wx, 104, 10, 9, '#c8ccd6');
    ell(wx, 104, 6, 5, '#8a8e98');
    R(wx - 2, 98, 4, 4, '#c03030');
    for (let k = 0; k < 5; k++)
      line(wx, 104, wx + Math.cos(k * 1.26) * 9, 104 + Math.sin(k * 1.26) * 8, '#f4f6fa');
  }
  ga(0.35);
  R(28, 108, 144, 30, '#eeece6');
  ga(0.15);
  R(40, 138, 120, 8, '#fff6d8');
  ga(1);
  C = p;
  return c.toDataURL();
}
function firTree(x, b, h) {
  for (let i = 0; i < h; i += 3) {
    const w = Math.round((i / h) * h * 0.32) + 2;
    R(x - w, b - h + i, w * 2 + 1, 3, i % 6 ? '#1e4a2e' : '#265a36');
  }
  R(x - 1, b - 2, 3, 4, '#3a2618');
}
Object.assign(BGS, {
  niu: {
    s(tod, o) {
      const sun = tod === 'sunset';
      bands(
        0,
        120,
        sun
          ? ['#2a2050', '#5a3270', '#b0506e', '#f0885a', '#ffc07a']
          : ['#4c8ce0', '#6aa6ee', '#8cc0f4', '#b8d8f8', '#e0eefc']
      );
      R(156, 4, 1, 14, '#c8c8d0');
      R(157, 4, 8, 2, '#fff');
      R(157, 6, 8, 2, '#2a5ad0');
      R(157, 8, 8, 2, '#d02a2a');
      const G1 = sun ? '#3e8a3e' : '#3faa3c',
        G2 = sun ? '#2e6a30' : '#2f8a30',
        WH = sun ? '#e8d8d0' : '#f4f4f0',
        WS = sun ? '#c0b0a8' : '#d0d0cc',
        GL = sun ? '#5a4a6a' : '#5a86b8',
        GR = sun ? '#ffb070' : '#a8d0f0';
      R(118, 16, 84, 16, '#183a1a');
      R(119, 17, 82, 15, G1);
      R(122, 19, 76, 9, G2);
      txt('АКАДЕМИЯ ПРИ ПРЕЗИДЕНТЕ', 124, 20, '#d83030', 3);
      txt('РОССИЙСКОЙ ФЕДЕРАЦИИ', 128, 24, '#d83030', 3);
      R(36, 31, 248, 7, WS);
      R(36, 31, 248, 5, WH);
      R(40, 38, 240, 82, '#183a1a');
      R(41, 38, 238, 82, G1);
      for (let i = 0; i < 9; i++) {
        const cx = 60 + i * 25;
        R(cx - 4, 38, 9, 80, WS);
        R(cx - 3, 38, 7, 80, WH);
        R(cx - 5, 38, 11, 3, WH);
        R(cx - 5, 114, 11, 4, WH);
        R(cx + 2, 41, 1, 72, WS);
      }
      for (let i = 0; i < 8; i++) {
        const wx = 66 + i * 25;
        for (const wy of [46, 70, 94]) {
          R(wx, wy, 13, 16, WH);
          R(wx + 1, wy + 1, 11, 14, GL);
          R(wx + 6, wy + 1, 1, 14, WH);
          R(wx + 1, wy + 7, 11, 1, WH);
          P1(wx + 2, wy + 2, GR);
          P1(wx + 3, wy + 2, GR);
        }
      }
      R(44, 66, 1, 1, G1);
      for (const wx of [44, 270])
        for (const wy of [46, 70, 94]) {
          R(wx, wy, 8, 16, WH);
          R(wx + 1, wy + 1, 6, 14, GL);
        }
      R(232, 104, 8, 5, '#e0e0e0');
      R(36, 116, 248, 4, WH);
      R(36, 120, 248, 32, G2);
      R(37, 120, 246, 31, G1);
      for (const wx of [48, 74, 100, 212, 238, 262]) {
        R(wx, 126, 14, 16, WH);
        R(wx + 1, 127, 12, 14, GL);
        R(wx + 7, 127, 1, 14, WH);
      }
      R(126, 118, 80, 34, WH);
      R(132, 120, 68, 6, '#2a4a8a');
      txt('НИЖЕГОРОДСКИЙ ИНСТИТУТ УПРАВЛЕНИЯ', 133, 121, '#fff', 2);
      for (const dx of [134, 158, 182]) {
        R(dx, 128, 16, 24, '#3a1e14');
        R(dx + 1, 129, 14, 22, '#6a3a24');
        R(dx + 2, 130, 12, 6, GL);
        R(dx + 7, 136, 1, 15, '#3a1e14');
        P1(dx + 5, 143, '#e0c080');
        P1(dx + 10, 143, '#e0c080');
      }
      R(30, 152, 260, 4, '#9a9aa0');
      R(0, 156, W, 24, sun ? '#9a8080' : '#b4b4b8');
      for (let x = 0; x < W; x += 18) R(x, 156, 1, 24, sun ? '#8a7070' : '#a4a4a8');
      R(110, 150, 24, 6, '#7a7a80');
      R(196, 150, 24, 6, '#7a7a80');
      firTree(18, 158, 120);
      firTree(46, 160, 84);
      firTree(298, 158, 124);
      firTree(274, 160, 70);
      for (let i = 0; i < 14; i++) {
        const r = RNG(i + 3);
        disc(
          18 + r() * 40,
          120 + r() * 30,
          (3 + r() * 3) | 0,
          ['#c87a2a', '#a85a24', '#e09a3a'][i % 3]
        );
      }
      lamp(120, 156, 22);
      lamp(212, 156, 22);
      if (o && o.x === 'car') zhiguli(214, 130, '#eeece6', T);
    },
    a(t, tod, o) {
      walkers(t, 166, 4, tod === 'sunset');
      if (tod !== 'sunset') {
        ga(0.8);
        for (let k = 0; k < 2; k++) {
          const x = ((t * 3 + k * 190) % 480) - 80;
          ell(x, 10 + k * 6, 16, 3, '#fff');
        }
        ga(1);
      }
      if (o && o.x === 'car') {
        if (((t * 2) | 0) % 2) P1(276, 143, '#fff');
      }
    }
  },
  marshal: {
    s() {
      bands(0, 112, ['#1c1a3e', '#3a2a5a', '#7a3a6a', '#d0605a', '#f8924e', '#ffc070', '#ffe0a8']);
      ga(0.55);
      for (let i = 0; i < 5; i++) R(20 + i * 60, 18 + i * 7, 50 + i * 6, 2, '#2a1a3a');
      ga(1);
      R(0, 98, W, 10, '#4a3a5a');
      const r = RNG(12);
      for (let x = 0; x < W; x += 2)
        if (r() < 0.4) P1(x, 99 + r() * 8, r() < 0.5 ? '#ffc87a' : '#ff9a6a');
      bands(100, 112, ['#e0906a', '#b06a6a', '#6a4a6a'], 0, 90);
      for (let x = 0; x < 90; x += 6) P1(x + ((x * 3) % 5), 104, '#fff0c0');
      R(292, 52, 2, 50, '#8a8aa0');
      line(293, 52, 287, 100, '#7a7a90');
      line(293, 52, 299, 100, '#7a7a90');
      P1(293, 50, '#ff4040');
      const tw = [
        [66, 58, 22],
        [108, 40, 26],
        [178, 18, 30],
        [236, 36, 26],
        [150, 64, 18]
      ];
      for (const [x, top, w] of tw) {
        R(x - 1, top - 1, w + 2, 130, '#2a2434');
        R(x, top, w, 130, '#d8d6e0');
        R(x + w - 6, top, 6, 130, '#b8b4c8');
        for (let y = top + 3; y < 128; y += 4)
          for (let xx = x + 2; xx < x + w - 2; xx += 3)
            P1(xx, y, r() < 0.18 ? '#ffd88a' : '#4a4a62');
        R(x + 2, top - 4, w - 4, 4, '#3a3646');
      }
      R(0, 128, W, 52, '#2a2834');
      for (let x = -10; x <= 330; x++) {
        const u = (x - 160) / 175,
          top = 124 + u * u * 26;
        R(x, top, 1, 8, '#34323e');
        R(x, top + 8, 1, 60, '#d4d2dc');
        R(x, top + 8, 1, 1, '#fff');
      }
      for (let i = 0; i < 14; i++) {
        const x = 10 + i * 23,
          u = (x - 160) / 175,
          top = 124 + u * u * 26;
        R(x, top - 6, 8, 6, '#4a4856');
        R(x + 1, top - 6, 6, 1, '#5a5866');
      }
      for (let x = -6; x < 330; x += 4) {
        const u = (x - 160) / 175,
          top = 132 + u * u * 26;
        for (let y = top + 3; y < 180; y += 5) R(x, y, 2, 2, r() < 0.2 ? '#ffd88a' : '#5a5a72');
      }
      disc(312, 170, 12, '#1e3a24');
      disc(300, 176, 10, '#24462a');
    },
    a(t) {
      const tw = [
        [66, 58, 22],
        [108, 40, 26],
        [178, 18, 30],
        [236, 36, 26],
        [150, 64, 18]
      ];
      for (const [x, top, w] of tw) {
        for (let y = top + 6; y < 126; y += 14) {
          const k = 0.6 + 0.4 * Math.sin(t * 2 + y * 0.2 + x);
          ga(k);
          R(x + w - 1, y, 2, 6, '#ff3a8a');
          R(x - 1, y + 7, 2, 4, '#ff3a8a');
          ga(1);
        }
      }
      for (let x = 0; x < 330; x += 26) {
        const u = (x - 160) / 175,
          top = 132 + u * u * 26;
        const k = 0.5 + 0.5 * Math.sin(t * 1.7 + x * 0.1);
        ga(k);
        R(x, top + 2, 2, 10, '#ff3a8a');
        R(x, top + 22, 2, 8, '#ff3a8a');
        ga(1);
      }
    }
  },
  volga: {
    s(tod, o) {
      bands(0, 96, ['#04050c', '#080b1a', '#0e1430', '#1a2048']);
      const r = RNG(31);
      for (let i = 0; i < 50; i++) P1(r() * W, r() * 70, r() < 0.6 ? '#3a4070' : '#c8cce8');
      disc(262, 22, 6, '#f2eed8');
      R(0, 86, W, 10, '#0a0e18');
      for (let x = 0; x < W; x += 3) if (r() < 0.25) P1(x, 88 + r() * 6, '#ffc87a');
      bands(96, 150, ['#0e1630', '#121c3a', '#0c1428']);
      R(-4, 78, W + 8, 4, '#20242e');
      R(-4, 82, W + 8, 1, '#10121a');
      for (let a = 0; a < 4; a++) {
        const ax = 10 + a * 80;
        for (let x = 0; x <= 70; x++) {
          const y = 78 - Math.round(Math.sin((x / 70) * Math.PI) * 14);
          P1(ax + x, y, '#3a4050');
          if (x % 7 === 0) line(ax + x, y, ax + x, 78, '#2a2e3a');
        }
        for (let p = 0; p < 2; p++) R(ax - 2 + p * 72, 82, 4, 16, '#1a1c24');
      }
      R(0, 150, W, 30, '#3a3640');
      R(0, 150, W, 3, '#5a5662');
      for (let x = 0; x < W; x += 10) R(x, 153, 1, 27, '#2e2a34');
      R(0, 147, W, 3, '#24222a');
      for (let x = 4; x < W; x += 12) R(x, 140, 2, 7, '#24222a');
      R(0, 139, W, 2, '#2e2c36');
      lamp(30, 147, 38);
      lamp(130, 147, 38);
      lamp(230, 147, 38);
      if (o && o.x === 'car') zhiguli(127, 124, '#eeece6', 0, 1);
    },
    a(t) {
      for (let a = 0; a < 4; a++) {
        const ax = 10 + a * 80;
        for (let x = 0; x <= 70; x += 10) {
          const y = 78 - Math.round(Math.sin((x / 70) * Math.PI) * 14);
          const k = 0.5 + 0.5 * Math.sin(t * 2 + x + a);
          ga(k);
          P1(ax + x, y - 1, '#ffd88a');
          ga(1);
        }
      }
      for (let i = 0; i < 40; i++) {
        const x = (i * 41 + Math.sin(t + i) * 6) % W,
          y = 100 + ((i * 13) % 48);
        ga(0.25 + 0.2 * Math.sin(t * 2 + i));
        R(x, y, 4 + (i % 3) * 2, 1, i % 4 ? '#ffc87a' : '#c8d0ff');
        ga(1);
      }
    }
  }
});
BGS.city = BGS.marshal;
// --- пацаны ---
function drawKol(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#d8a07a',
      shade: '#b8805e',
      eye: '#1e120c',
      brow: '#1e140e',
      lip: '#8a4a40',
      lid: '#b07a5a'
    },
    out = '#120c0a',
    by = hy + 21;
  ell(x, by + 9, 34, 10, out);
  R(x - 34, by + 9, 68, H, out);
  ell(x, by + 9, 33, 9, '#1a1618');
  R(x - 33, by + 9, 66, H, '#1a1618');
  poly(
    [
      [x - 10, by - 3],
      [x + 10, by - 3],
      [x + 14, H],
      [x - 14, H]
    ],
    '#4a2c22'
  );
  for (let y = by; y < H; y += 2) R(x - 11, y, 22, 1, y % 4 ? '#4a2c22' : '#3e241c');
  R(x - 8, by - 5, 16, 7, '#4a2c22');
  poly(
    [
      [x - 10, by - 3],
      [x - 24, by + 4],
      [x - 14, by + 30]
    ],
    '#2a2428'
  );
  poly(
    [
      [x + 10, by - 3],
      [x + 24, by + 4],
      [x + 14, by + 30]
    ],
    '#2a2428'
  );
  R(x - 30, by + 12, 2, 40, '#2e282c');
  R(x + 12, by + 16, 1, 60, '#6a6a72');
  R(x - 5, hy + 12, 10, 9, S.skin);
  R(x - 5, hy + 12, 10, 3, S.shade);
  head(x, hy, 14, 16, S, out);
  face(x, hy, em, S, blink, t, talk);
  ell(x, hy - 12, 15, 6, '#1a1210');
  R(x - 15, hy - 11, 4, 7, '#1a1210');
  R(x + 11, hy - 11, 4, 7, '#1a1210');
  for (let i = -12; i < 13; i += 3) P1(x + i, hy - 15 + (i & 1), '#3a2a22');
  R(x - 12, hy - 7, 24, 1, '#1a1210');
  glassesRound(x, hy, '#c8ccd4');
}
function drawNik(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#f2cbb0',
      shade: '#d8a88c',
      eye: '#2a1e16',
      brow: '#6a5440',
      lip: '#c07a70',
      lid: '#d8a088'
    },
    out = '#140e10',
    by = hy + 21;
  ell(x, by + 9, 29, 10, out);
  R(x - 29, by + 9, 58, H, out);
  ell(x, by + 9, 28, 9, '#16151c');
  R(x - 28, by + 9, 56, H, '#16151c');
  ell(x, by - 1, 14, 4, '#202028');
  R(x - 5, by + 2, 1, 14, '#c8c8d0');
  R(x + 4, by + 2, 1, 14, '#c8c8d0');
  for (let i = 0; i < 9; i++) {
    P1(x - 6 + i * 1.5, by + 3 + Math.round(Math.sin((i / 8) * Math.PI) * 5), '#d8dce4');
  }
  R(x - 4, hy + 12, 8, 10, S.skin);
  R(x - 4, hy + 12, 8, 3, S.shade);
  head(x, hy, 12, 15, S, out);
  face(x, hy, em, S, blink, t, talk);
  const h1 = '#8a7a62',
    h2 = '#a8987c',
    h3 = '#c8b898';
  ell(x, hy - 11, 14, 7, h1);
  for (let i = -12; i <= 12; i += 3) {
    const len = 5 + ((((i * 7) % 4) + 4) % 4);
    poly(
      [
        [x + i - 2, hy - 14],
        [x + i + 2, hy - 14],
        [x + i + 1, hy - 14 - len]
      ],
      h2
    );
    P1(x + i, hy - 15 - len + 2, h3);
  }
  for (let i = -10; i <= 10; i += 4) {
    poly(
      [
        [x + i - 3, hy - 9],
        [x + i + 3, hy - 9],
        [x + i + 1, hy - 4]
      ],
      h1
    );
    P1(x + i, hy - 7, h2);
  }
  R(x - 13, hy - 10, 3, 7, h1);
  R(x + 10, hy - 10, 3, 7, h1);
}
function drawSan(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#f4d2bc',
      shade: '#dcaa92',
      eye: '#24140c',
      brow: '#1a100c',
      lip: '#c08078',
      lid: '#d8a090'
    },
    out = '#140e10',
    by = hy + 21;
  ell(x, by + 9, 33, 10, out);
  R(x - 33, by + 9, 66, H, out);
  ell(x, by + 9, 32, 9, '#eeeef2');
  R(x - 32, by + 9, 64, H, '#eeeef2');
  ell(x, by - 1, 10, 4, '#d8d8de');
  R(x - 24, by + 14, 1, 60, '#d0d0d8');
  R(x + 23, by + 14, 1, 60, '#d0d0d8');
  for (let i = 0; i < 16; i++)
    P1(x - 8 + i, by + 2 + Math.round(Math.sin((i / 15) * Math.PI) * 16), '#b8bcc6');
  R(x - 1, by + 18, 3, 4, '#d8dce4');
  R(x - 5, hy + 12, 10, 10, S.skin);
  R(x - 5, hy + 12, 10, 3, S.shade);
  head(x, hy, 14, 16, S, out);
  face(x, hy, em, { ...S, brow: '#140a08' }, blink, t, talk);
  R(x - 9, hy - 5, 6, 2, '#140a08');
  R(x + 3, hy - 5, 6, 2, '#140a08');
  const hc = '#140c0a',
    hm = '#2e1e18',
    rr = RNG(55);
  const cur = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI * (0.95 + (i / 16) * 1.1);
    cur.push([
      x + Math.cos(a) * (16 + rr() * 4),
      hy - 8 + Math.sin(a) * (13 + rr() * 5),
      3 + ((rr() * 3) | 0)
    ]);
  }
  for (let i = 0; i < 9; i++)
    cur.push([x - 12 + rr() * 24, hy - 18 - rr() * 7, 3 + ((rr() * 2) | 0)]);
  cur.push([x - 17, hy - 2, 3], [x + 17, hy - 3, 3], [x - 6, hy - 11, 3], [x + 6, hy - 12, 3]);
  for (const [a, b, r] of cur) disc(a, b, r, hc);
  for (const [a, b, r] of cur) {
    ring(a, b, r - 1.2, hm);
  }
}
function drawKn(x, hy, em, t, blink, o, talk) {
  const S = {
      skin: '#e0b090',
      shade: '#c48e70',
      eye: '#1e100a',
      brow: '#1a0e0a',
      lip: '#b87068',
      lid: '#c89078',
      lash: 1
    },
    out = '#140c0c',
    by = hy + 21;
  const h0 = '#0e0a0c',
    h1 = '#181214',
    h2 = '#2c2022',
    h3 = '#8a3426',
    hr = '#5e2420',
    rr = RNG(91);
  ell(x, by + 9, 31, 10, out);
  R(x - 31, by + 9, 62, H, out);
  ell(x, by + 9, 30, 9, '#5a2418');
  R(x - 30, by + 9, 60, H, '#5a2418');
  for (let y = by + 12; y < H; y += 3) R(x - 29, y, 58, 1, '#4e1e14');
  R(x - 11, by - 4, 22, 8, '#4a1c12');
  for (let i = -10; i < 11; i += 2) R(x + i, by - 4, 1, 8, '#62281a');
  R(x - 4, hy + 11, 8, 10, S.skin);
  R(x - 4, hy + 11, 8, 3, S.shade);
  head(x, hy, 13, 15, S, out);
  face(x, hy, em, S, blink, t, talk);
  R(x - 8, hy - 5, 6, 2, S.brow);
  R(x + 3, hy - 5, 6, 2, S.brow);
  ell(x, hy - 13, 14, 4, h0);
  R(x - 12, hy - 10, 24, 2, h0);
  R(x, hy - 16, 1, 5, '#3a2a22');
  const cur = [];
  for (let i = 0; i < 14; i++)
    cur.push([x - 13 + rr() * 26, hy - 17 - rr() * 9, 3 + ((rr() * 2) | 0)]);
  cur.push([x - 15, hy - 11, 3], [x + 15, hy - 11, 3], [x - 12, hy - 20, 3], [x + 12, hy - 20, 3]);
  for (const [a, b, r] of cur) {
    disc(a, b, r, h1);
  }
  cur.forEach(([a, b, r], i) => {
    ring(a, b, r - 1, i % 4 === 0 ? hr : h2);
    if (i % 3 === 0) P1(a - 1, b - r + 1, h3);
  });
  for (const d of [-1, 1])
    for (let k = 0; k < 3; k++) {
      const sx = x + d * (14 + k * 2);
      for (let y = hy - 8; y < hy + 12 + k * 3; y += 3) {
        const wx = Math.round(Math.sin((y + k * 5) / 3 + t) * 1);
        ring(sx + wx, y, 1.6, k === 1 ? hr : h1);
      }
      if (k === 1) P1(sx, hy + 13 + k * 3, h3);
    }
  ring(x - 13, hy + 8, 1.8, '#d8dce4');
  ring(x + 13, hy + 8, 1.8, '#d8dce4');
}
function womanDraw(c) {
  return function (x, hy, em, t, blink, o, talk) {
    const S = {
        skin: c.skin,
        shade: c.shade,
        eye: '#1e120c',
        brow: c.brow,
        lip: c.lip,
        lid: c.lid,
        lash: 1
      },
      out = '#140e10',
      by = hy + 21,
      h = c.hair,
      hl = c.hl;
    if (c.style === 'long') {
      R(x - 16, hy - 6, 32, 64, h);
    }
    ell(x, by + 9, 32, 10, out);
    R(x - 32, by + 9, 64, H, out);
    ell(x, by + 9, 31, 9, c.top);
    R(x - 31, by + 9, 62, H, c.top);
    if (c.knit) for (let y = by + 12; y < H; y += 3) R(x - 30, y, 60, 1, c.knit);
    poly(
      [
        [x - 8, by - 2],
        [x + 8, by - 2],
        [x, by + 28]
      ],
      c.inner
    );
    if (c.lapel) {
      poly(
        [
          [x - 8, by - 2],
          [x - 18, by + 10],
          [x - 6, by + 34]
        ],
        c.lapel
      );
      poly(
        [
          [x + 8, by - 2],
          [x + 18, by + 10],
          [x + 6, by + 34]
        ],
        c.lapel
      );
    }
    if (c.brooch) {
      disc(x - 14, by + 12, 2, '#e0b040');
      P1(x - 14, by + 12, '#fff');
    }
    if (c.pearls)
      for (let i = 0; i < 9; i++)
        P1(x - 4 + i, by + 1 + Math.round(Math.sin((i / 8) * Math.PI) * 3), '#f4f0e8');
    R(x - 4, hy + 11, 8, 10, S.skin);
    R(x - 4, hy + 11, 8, 3, S.shade);
    head(x, hy, 13, 15, S, out);
    face(x, hy, em, S, blink, t, talk);
    if (c.style === 'bob') {
      ell(x, hy - 10, 15, 8, h);
      R(x - 15, hy - 9, 5, 22, h);
      R(x + 10, hy - 9, 5, 22, h);
      poly(
        [
          [x - 12, hy - 12],
          [x + 12, hy - 12],
          [x + 8, hy - 5],
          [x - 10, hy - 8]
        ],
        h
      );
      R(x - 12, hy - 12, 10, 1, hl);
    } else if (c.style === 'bun' || c.style === 'grayBun') {
      ell(x, hy - 11, 14, 6, h);
      disc(x, hy - 20, 6, h);
      ring(x, hy - 20, 4, hl);
      R(x - 14, hy - 9, 3, 8, h);
      R(x + 11, hy - 9, 3, 8, h);
      R(x - 10, hy - 14, 20, 1, hl);
    } else {
      ell(x, hy - 11, 15, 6, h);
      R(x, hy - 17, 1, 6, hl);
      poly(
        [
          [x, hy - 12],
          [x - 14, hy - 7],
          [x - 16, hy + 20],
          [x - 11, hy + 20],
          [x - 10, hy - 4]
        ],
        h
      );
      poly(
        [
          [x + 1, hy - 12],
          [x + 15, hy - 7],
          [x + 17, hy + 20],
          [x + 12, hy + 20],
          [x + 11, hy - 4]
        ],
        h
      );
      R(x - 14, hy - 4, 1, 22, hl);
      R(x + 14, hy - 4, 1, 22, hl);
    }
    if (c.gl === 'round') glassesRound(x, hy, c.glc);
    else if (c.gl === 'rect') {
      const g = c.glc;
      R(x - 11, hy - 2, 8, 1, g);
      R(x + 3, hy - 2, 8, 1, g);
      R(x - 11, hy + 3, 8, 1, g);
      R(x + 3, hy + 3, 8, 1, g);
      R(x - 11, hy - 2, 1, 6, g);
      R(x - 4, hy - 2, 1, 6, g);
      R(x + 3, hy - 2, 1, 6, g);
      R(x + 10, hy - 2, 1, 6, g);
      R(x - 3, hy - 1, 6, 1, g);
    }
    if (c.ear) (ring(x - 13, hy + 8, 1.8, c.ear), ring(x + 13, hy + 8, 1.8, c.ear));
  };
}
const drawLom = womanDraw({
  skin: '#f2c8ac',
  shade: '#d6a488',
  brow: '#3a2218',
  lip: '#c0706a',
  lid: '#d49c84',
  hair: '#4a2a1e',
  hl: '#6a4030',
  style: 'bob',
  top: '#2a3a6a',
  inner: '#f4f4f6',
  lapel: '#22305a',
  ear: '#e0c070',
  pearls: 1
});
const drawGre = womanDraw({
  skin: '#eec4a8',
  shade: '#d0a084',
  brow: '#2a1c16',
  lip: '#a85a58',
  lid: '#c89880',
  hair: '#2a1c16',
  hl: '#4a342a',
  style: 'bun',
  top: '#3a3a44',
  inner: '#c8c8d0',
  lapel: '#2e2e36',
  gl: 'rect',
  glc: '#2a1a14'
});
const drawKaz = womanDraw({
  skin: '#f0c8b0',
  shade: '#d4a48c',
  brow: '#a0a0a8',
  lip: '#b0706e',
  lid: '#c8a090',
  hair: '#c8c8d2',
  hl: '#eeeef4',
  style: 'grayBun',
  top: '#7a2a34',
  inner: '#ece4d4',
  knit: '#6a2230',
  gl: 'round',
  glc: '#8a6a40',
  brooch: 1
});
const drawVis = womanDraw({
  skin: '#f4d0ba',
  shade: '#dcaa92',
  brow: '#1e1418',
  lip: '#c86a72',
  lid: '#d8a090',
  hair: '#1a1418',
  hl: '#3a2c30',
  style: 'long',
  top: '#c9b08a',
  inner: '#151518',
  lapel: '#b49a74',
  ear: '#e8c060'
});
Object.assign(CHD, {
  kol: drawKol,
  nik: drawNik,
  san: drawSan,
  kn: drawKn,
  lom: drawLom,
  gre: drawGre,
  kaz: drawKaz,
  vis: drawVis
});
// --- дорога для мини-игры «Борский мост» ---
function drawRoad(m) {
  const off = (m.d * 2) % 16;
  R(0, 0, W, H, '#1a3a5a');
  for (let i = 0; i < 60; i++) {
    const x = (i * 53) % W,
      y = (i * 37 + m.d * 1.2) % H;
    ga(0.35);
    R(x < 100 || x > 220 ? x : (x + 120) % W, y, 6, 1, '#8ac0e8');
    ga(1);
  }
  R(96, 0, 128, H, '#3a3a40');
  R(96, 0, 3, H, '#b8b8c0');
  R(221, 0, 3, H, '#b8b8c0');
  for (let y = -16 + off; y < H; y += 16) {
    R(138, y, 2, 8, '#e8e8e0');
    R(180, y, 2, 8, '#e8e8e0');
  }
  for (let y = -20 + ((m.d * 2) % 20); y < H; y += 20) {
    R(90, y, 6, 2, '#6a6a74');
    R(224, y, 6, 2, '#6a6a74');
  }
  R(90, 0, 1, H, '#8a8a94');
  R(229, 0, 1, H, '#8a8a94');
  for (const o of m.obs) {
    const lx = 118 + o.l * 42;
    if (o.k === 'pit') {
      ell(lx, o.y, 9, 4, '#141418');
      ell(lx, o.y - 1, 7, 2, '#24242a');
    } else if (o.k === 'msg') {
      R(lx - 8, o.y - 7, 16, 12, '#fff');
      R(lx - 6, o.y + 5, 4, 3, '#fff');
      R(lx - 6, o.y - 4, 12, 1, '#ff5fa2');
      R(lx - 6, o.y - 1, 9, 1, '#bbb');
      R(lx - 6, o.y + 2, 10, 1, '#bbb');
    } else {
      pat(['..XX.', '.XX..', 'XXXXX', '..XX.', '.XX..'], lx - 5, o.y - 5, '#ffd166', 2);
    }
  }
  const cx = 118 + m.cx * 42,
    cy = 146;
  R(cx - 8, cy - 14, 16, 28, '#16161a');
  R(cx - 7, cy - 13, 14, 26, '#eeece6');
  R(cx - 6, cy - 7, 12, 6, '#2a3444');
  R(cx - 6, cy + 6, 12, 4, '#2a3444');
  R(cx - 5, cy - 1, 10, 6, '#9a1e24');
  R(cx - 7, cy - 13, 14, 1, '#d8dce4');
  R(cx - 9, cy - 10, 2, 6, '#0e0e12');
  R(cx + 7, cy - 10, 2, 6, '#0e0e12');
  R(cx - 9, cy + 5, 2, 6, '#0e0e12');
  R(cx + 7, cy + 5, 2, 6, '#0e0e12');
  R(cx - 6, cy - 14, 3, 2, '#fff6c0');
  R(cx + 3, cy - 14, 3, 2, '#fff6c0');
  if (m.hit && T - m.hit < 0.3) {
    ga(0.5);
    R(0, 0, W, H, '#ff3a3a');
    ga(1);
  }
}
// --- квартира Никитоса на Ванеева ---
Object.assign(BGS, {
  flat: {
    s(tod) {
      const n = tod !== 'day';
      R(0, 0, W, H, n ? '#2a2034' : '#d8c4a8');
      R(0, 0, W, 4, n ? '#221a2c' : '#c8b498');
      R(208, 22, 84, 70, '#18141e');
      R(211, 25, 78, 64, n ? '#0a0e22' : '#cfe0f0');
      const r = RNG(77);
      if (n) {
        for (let x = 212; x < 288; x += 7) {
          const h = 12 + r() * 40;
          R(x, 89 - h, 7, h, '#06081a');
          for (let y = 89 - h + 3; y < 88; y += 4)
            for (let xx = x + 1; xx < x + 6; xx += 2)
              if (r() < 0.4) P1(xx, y, r() < 0.7 ? '#ffd27a' : '#9ad0ff');
        }
      } else {
        for (let x = 212; x < 288; x += 9) {
          const h = 10 + r() * 30;
          R(x, 89 - h, 8, h, '#a8b4c4');
        }
      }
      R(249, 25, 2, 64, '#18141e');
      R(211, 56, 78, 2, '#18141e');
      R(200, 18, 10, 80, n ? '#5a2a3a' : '#b86a6a');
      R(290, 18, 10, 80, n ? '#5a2a3a' : '#b86a6a');
      R(30, 24, 40, 52, n ? '#1a3a4a' : '#3a6a7a');
      txt('ВАНЕЕВА', 33, 44, '#ffd166', 4);
      R(34, 52, 32, 1, '#ffd166');
      R(84, 30, 28, 36, '#3a2a20');
      R(86, 32, 24, 32, '#7a5a3a');
      R(0, 140, W, 40, n ? '#3a2a2a' : '#a88060');
      for (let x = 0; x < W; x += 16) R(x, 140, 1, 40, n ? '#2e2222' : '#987050');
      ell(160, 160, 90, 10, n ? '#4a2a3a' : '#b07070');
      R(8, 112, 120, 30, '#1e4a4a');
      R(8, 104, 120, 12, '#245a5a');
      R(4, 104, 10, 38, '#1a3e3e');
      R(122, 104, 10, 38, '#1a3e3e');
      R(30, 108, 22, 10, '#e8c860');
      R(84, 108, 22, 10, '#e86a8a');
      R(140, 126, 84, 4, '#5a3a26');
      R(146, 130, 4, 14, '#4a2e1e');
      R(214, 130, 4, 14, '#4a2e1e');
      R(150, 116, 26, 10, '#e8d0a0');
      R(151, 117, 24, 8, '#c84a2a');
      for (const [bx, c] of [
        [184, '#2a6a3a'],
        [192, '#6a3a1a'],
        [199, '#2a6a3a'],
        [206, '#c8a040']
      ]) {
        R(bx, 108, 5, 18, c);
        R(bx + 1, 104, 3, 4, c);
        P1(bx + 1, 110, '#fff');
      }
      R(240, 112, 40, 30, '#6a4a32');
      R(242, 114, 36, 10, '#8a6a4a');
      R(258, 100, 4, 12, '#2a2a30');
      ell(260, 98, 8, 4, '#ffcf7a');
    },
    a(t, tod) {
      if (tod === 'day') return;
      for (let i = 0, x = -4; x < 330; x += 9, i++) {
        const y = 10 + Math.round(Math.sin(x / 40) * 4);
        const k = 0.5 + 0.5 * Math.sin(t * 2.5 + i);
        ga(0.25 * k);
        disc(x, y, 3, ['#ffcf7a', '#ff9ad5', '#9ad0ff'][i % 3]);
        ga(1);
        P1(x, y, k > 0.5 ? '#fff6d0' : ['#ffcf7a', '#ff9ad5', '#9ad0ff'][i % 3]);
      }
      ga(0.1 + 0.04 * Math.sin(t * 3));
      disc(260, 98, 18, '#ffcf7a');
      ga(1);
    }
  },
  balcony: {
    s() {
      bands(0, 110, ['#04050e', '#080c22', '#101838', '#1a2248']);
      const r = RNG(88);
      for (let i = 0; i < 30; i++) P1(r() * W, r() * 50, '#8a8eb0');
      for (let x = 0; x < W; x += 6) {
        const h = 20 + r() * 60;
        R(x, 120 - h, 6, h, '#070a1a');
        for (let y = 120 - h + 3; y < 118; y += 4)
          for (let xx = x + 1; xx < x + 5; xx += 2)
            if (r() < 0.35) P1(xx, y, r() < 0.75 ? '#ffd27a' : '#9ad0ff');
      }
      R(0, 120, W, 60, '#141220');
      R(0, 118, W, 3, '#3a3a46');
      for (let x = 4; x < W; x += 10) R(x, 121, 2, 34, '#2a2a34');
      R(0, 154, W, 4, '#3a3a46');
      R(0, 158, W, 22, '#22202c');
      R(280, 124, 30, 40, '#3a3a46');
      R(282, 126, 26, 36, '#4a4a56');
      R(10, 150, 24, 8, '#6a4a32');
      P1(18, 148, '#ffcf7a');
    },
    a(t) {
      for (let i = 0; i < 20; i++) {
        const x = (i * 47 + t * 6) % W,
          y = (t * 14 + i * 31) % 180;
        ga(0.6);
        P1(x, y, '#e8ecff');
        ga(1);
      }
    }
  }
});
EMIT.balcony = ['snow', 0.2];

'use strict';
// ================= ENGINE =================
const $ = s => document.querySelector(s),
  $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SP = {
  ru: { n: 'Руслан', c: '#ffb347', v: [190, 'square'] },
  nu: { n: 'Нюрка', c: '#ffc4e4', v: [520, 'triangle'] },
  dan: { n: 'Дэн', c: '#7cf2a0', v: [150, 'sawtooth'] },
  lera: { n: 'Лера', c: '#c9a6ff', v: [600, 'triangle'] },
  kol: { n: 'Колян', c: '#ff9a5c', v: [135, 'sawtooth'] },
  nik: { n: 'Никитос', c: '#7cf2a0', v: [230, 'square'] },
  san: { n: 'Санёк', c: '#5ee1ff', v: [170, 'triangle'] },
  kn: { n: 'Кнаря', c: '#ff7a6a', v: [470, 'square'] },
  lom: { n: 'Ломовцева', c: '#9ab8ff', v: [380, 'triangle'] },
  gre: { n: 'Грешнова', c: '#b8b8c8', v: [300, 'square'] },
  kaz: { n: 'Казьбан', c: '#e8a8b8', v: [340, 'triangle'] },
  vis: { n: 'Висилицкая', c: '#ffe08a', v: [520, 'triangle'] },
  pal: { n: 'Палыч', c: '#9ad0ff', v: [110, 'square'] },
  in: { n: 'Внутренний голос', c: '#ff6bd6', v: [95, 'sine'] },
  nar: { n: 'Рассказчик', c: '#b9b4d0', v: [300, 'sine'] }
};
const PH = {
  ru: {
    love: 'r_meme',
    hope: 'r_meme',
    cringe: 'r_meme',
    smug: 'r_meme',
    laugh: 'r_meme',
    smile: 'r_meme',
    sad: 'r_gray',
    broken: 'r_gray',
    tired: 'r_gray',
    grow: 'r_suit',
    cool: 'r_suit',
    _: 'r_bw'
  },
  nu: {
    cold: 'n_cold',
    awk: 'n_cold',
    annoyed: 'n_cold',
    tired: 'n_cold',
    sad: 'n_cold',
    think: 'n_cold',
    _: 'n_soft'
  },
  kol: { _: 'k_por' },
  nik: { _: 'n2_por' },
  san: { _: 's_por' },
  kn: { _: 'kn_por' }
};
const STM = {
  kom: ['❤', 'Комфорт Нюрки', 1],
  self: ['🛡', 'Самоуважение', 1],
  cringe: ['😬', 'Кринж', -1],
  ideal: ['✨', 'Идеализация', -1],
  dep: ['🔗', 'Зависимость', -1],
  rep: ['🚗', 'Свои', 1],
  tired: ['💤', 'Усталость', -1],
  grow: ['🌱', 'Прозрение', 1]
};
const CHAP = [
  ['start', 'Пролог', 'Первое сентября'],
  ['ch1', 'Глава 1', 'Кто напишет первым'],
  ['ch2', 'Глава 2', 'Домашка до пятницы'],
  ['ch3', 'Глава 3', 'Не мой тип'],
  ['ch4', 'Глава 4', 'Волны'],
  ['ch5', 'Глава 5', 'Лучший день'],
  ['ch6', 'Глава 6', 'Ванеева, 2 ночи'],
  ['ch7', 'Глава 7', 'Развилка']
];
const ENDS = {
  poh: {
    n: 'МНЕ ПОХУЙ',
    s: 'Концовка роста',
    d: 'Теперь первой пишет она. А ему уже всё равно.',
    c: '#ffd166',
    h: 'Самоуважение 7+, прозрение 6+, зависимость ≤4'
  },
  bokom: {
    n: 'КАКИМ-ТО БОКОМ',
    s: 'Неожиданная концовка',
    d: 'Он перестал стараться — и она сама сделала шаг.',
    c: '#ff9ad5',
    h: 'Будь собой на мосту и на балконе + комфорт 6+, самоуважение 6+'
  },
  pac: {
    n: 'ЖИГУЛИ НА БОР',
    s: 'Концовка своих',
    d: 'Энергия была не в ней. Она была в шестёрке на Борском мосту.',
    c: '#ff9a5c',
    h: 'Свои 6+ и хоть немного прозрения'
  },
  tamada: {
    n: 'ЛУЧШИЙ ТАМАДА НИЖНЕГО',
    s: 'Угарная концовка',
    d: 'Сто сорок родственников Кнари пишут ему первыми. Каждый день.',
    c: '#ff7a6a',
    h: 'Много разговоров с Кнарей'
  },
  gats: {
    n: 'ГЭТСБИ',
    s: 'Грустная концовка',
    d: 'Черновик так и не отправлен. Огонёк на том берегу не стал ближе.',
    c: '#7aa0ff',
    h: 'Высокая идеализация'
  },
  friend: {
    n: 'ГЛУБОКАЯ ФРЕНДЗОНА',
    s: 'Зависимая концовка',
    d: 'Свидетель на её свадьбе. Крёстный её сына. Лучший друг.',
    c: '#5ee1ff',
    h: 'Делай за неё всё и жди'
  }
};
const NEND = Object.keys(ENDS).length;
const PERS = Object.assign({ ends: {}, chap: { 0: 1 } }, loadJSON('nmt2_pers') || {});
const savePers = () => saveJSON('nmt2_pers', PERS);
function newState() {
  return {
    lab: 'start',
    pc: 0,
    st: { kom: 3, self: 4, cringe: 0, ideal: 3, dep: 2, rep: 3, tired: 0, grow: 0 },
    flags: { ini: 0, iniBiz: 0 },
    bg: { n: 'black' },
    chars: {},
    mus: null,
    phone: null,
    fant: 0,
    filter: '',
    cg: null,
    ch: 0
  };
}
let G = newState(),
  RUN = 0,
  LOG = [],
  MODE = { auto: 0, skip: 0, ctrl: 0 },
  INGAME = 0;
const skipping = () => MODE.skip || MODE.ctrl;

// ---------- render loop ----------
const pcan = $('#pcan'),
  pctx = pcan.getContext('2d');
pctx.imageSmoothingEnabled = false;
X.imageSmoothingEnabled = false;
let typingNow = 0;
function frame(ts) {
  T = ts / 1000;
  C = X;
  drawBg(G.bg || { n: 'black' });
  if (MG.road) drawRoad(MG.road);
  if (MG.crowd) drawCrowd();
  drawChars();
  stepParts();
  drawTrain();
  if (G.fant) {
    ga(0.18);
    R(0, 0, W, H, '#ff6ac8');
    ga(1);
  }
  const pp = G.pport;
  if (pp && !$('#dlg').classList.contains('hide')) {
    pctx.clearRect(0, 0, 48, 48);
    pctx.fillStyle = '#120c22';
    pctx.fillRect(0, 0, 48, 48);
    const c = renderChar(pp.id, pp.emo, G.chars[pp.id] || {}, T, typingNow, false);
    pctx.drawImage(c, 26, 14, 48, 48, 0, 0, 48, 48);
  }
  requestAnimationFrame(frame);
}

// ---------- advance ----------
let advFn = null;
function advance() {
  if (advFn) {
    const f = advFn;
    advFn = null;
    f();
  }
}
function waitAdv(auto) {
  return new Promise(r => {
    advFn = r;
    if (skipping()) setTimeout(advance, 40);
    else if (MODE.auto && auto)
      setTimeout(() => {
        if (advFn === r) advance();
      }, auto);
  });
}

// ---------- state helpers ----------
function serial() {
  const g = JSON.parse(JSON.stringify(G));
  delete g.snap;
  delete g.train;
  delete g.pport;
  delete g.speaker;
  for (const k in g.chars) {
    const c = g.chars[k];
    if (c.out) {
      delete g.chars[k];
      continue;
    }
    c.x = c.tx;
    c.a = 1;
    c.t0 = 0;
  }
  return g;
}
function couple(fx) {
  const d = Object.assign({}, fx),
    add = (k, v) => {
      if (v) d[k] = (d[k] || 0) + v;
    };
  if (fx.dep > 0) {
    add('self', -Math.ceil(fx.dep / 2));
    add('grow', -Math.floor(fx.dep / 2));
    add('rep', -Math.ceil(fx.dep / 2));
  }
  if (fx.ideal > 0) add('grow', -Math.ceil(fx.ideal / 2));
  if (fx.grow > 0) add('ideal', -Math.floor(fx.grow / 2) - 1 + 1 * (fx.grow < 2));
  if (fx.dep < 0) add('self', 1);
  for (const k in d) if (!d[k]) delete d[k];
  return d;
}
function applyFx(fx) {
  if (!fx) return;
  fx = couple(fx);
  let i = 0;
  for (const k in fx) {
    const v = fx[k];
    if (!v || !(k in G.st)) continue;
    G.st[k] = clamp(G.st[k] + v, 0, 10);
    popStat(k, v, i++);
  }
  updHud();
}
function popStat(k, v, i) {
  const m = STM[k],
    good = v > 0 === m[2] > 0,
    el = document.createElement('div');
  el.className = 'pop ' + (good ? 'good' : 'bad');
  el.textContent = (v > 0 ? '+' : '') + v + ' ' + m[0] + ' ' + m[1];
  el.style.animationDelay = i * 0.12 + 's';
  $('#pops').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function updHud() {
  $('#hud').innerHTML =
    Object.keys(STM)
      .map(k => {
        const m = STM[k],
          v = G.st[k];
        return `<div class="hs" title="${m[1]}"><span class="hi">${m[0]}</span><span class="hn">${m[1]}</span><span class="hb">${Array.from({ length: 10 }, (_, i) => `<i class="${i < v ? (m[2] > 0 ? 'on g' : 'on b') : ''}"></i>`).join('')}</span></div>`;
      })
      .join('') +
    `<div class="hs ini" title="Сколько раз она написала первой"><span class="hi">📩</span><span class="hn">Она первой</span><b>${G.flags.ini || 0}</b><small>${G.flags.iniBiz ? 'по делу: ' + G.flags.iniBiz : ''}</small></div>`;
}
function meets(need, max, o) {
  if (need) for (const k in need) if (G.st[k] < need[k]) return false;
  if (max) for (const k in max) if (G.st[k] > max[k]) return false;
  if (o && o.flag && !G.flags[o.flag]) return false;
  if (o && o.cnt) for (const k in o.cnt) if ((G.flags[k] || 0) < o.cnt[k]) return false;
  return true;
}
function needText(need, max, o) {
  return Object.keys(need || {})
    .map(k => STM[k][0] + ' ' + STM[k][1] + ' ' + need[k] + '+')
    .concat(Object.keys(max || {}).map(k => STM[k][0] + ' ' + STM[k][1] + ' ≤' + max[k]))
    .concat(o && o.ft ? [o.ft] : [])
    .join(' · ');
}

// ---------- main interpreter ----------
async function play() {
  const my = ++RUN;
  INGAME = 1;
  while (my === RUN) {
    const seq = SCN[G.lab];
    if (!seq || G.pc >= seq.length) return;
    const st = seq[G.pc];
    G.snap = JSON.stringify(serial());
    const r = await exec(st, my);
    if (my !== RUN) return;
    if (r && r.halt) return;
    if (r && r.jump) {
      G.lab = r.jump;
      G.pc = 0;
      continue;
    }
    G.pc++;
  }
}
async function seq(list, my) {
  for (const st of list) {
    const r = await exec(st, my);
    if (my !== RUN) return { halt: 1 };
    if (r && (r.jump || r.halt)) return r;
  }
}
async function exec(st, my) {
  if (typeof st === 'string') return execStr(st, my);
  if (st.c) return doChoice(st, my);
  if (st.pick) return doPick(st, my);
  if (st.if) {
    const ok = st.if(G);
    const br = ok ? st.then : st.else;
    return br ? seq(br, my) : null;
  }
  if (st.split) return doSplit(st.split);
  if (st.write) {
    hideDlg();
    await MINI.write(st.write);
    return;
  }
  if (st.mini) {
    hideDlg();
    await MINI[st.mini](st.arg);
    return;
  }
  if (st.epi) return doEpi(st.epi, st.h);
  if (st.fn) {
    st.fn(G);
    return;
  }
}
function execStr(s, my) {
  if (s[0] === '@') {
    const i = s.indexOf(' '),
      cmd = i < 0 ? s.slice(1) : s.slice(1, i),
      arg = i < 0 ? '' : s.slice(i + 1);
    return CMD[cmd](arg, my);
  }
  if (s.startsWith('<<')) {
    const m = s.slice(2),
      i = m.indexOf(':');
    return phoneMsg('in', m.slice(0, i).trim(), m.slice(i + 1).trim());
  }
  if (s[0] === '<') return phoneMsg('in', null, s.slice(1).trim());
  if (s[0] === '>') return phoneMsg('out', null, s.slice(1).trim());
  const m = s.match(/^(\w+)(?:\.(\w+))?:\s*([\s\S]*)$/);
  if (m) return say(m[1], m[2], m[3]);
  console.warn('bad step', s);
}
function setEmo(id, emo) {
  const c = G.chars[id];
  if (c && emo && c.emo !== emo) {
    c.emo = emo;
    c.t0 = T;
  }
}
async function fadeTo(fn) {
  if (skipping()) {
    fn();
    return;
  }
  const f = $('#fade');
  f.style.opacity = 1;
  await sleep(260);
  fn();
  await sleep(60);
  f.style.opacity = 0;
  await sleep(200);
}
const CMD = {
  bg(a) {
    const [n, tod, x] = a.split(' ');
    return fadeTo(() => {
      G.bg = { n, tod: tod || '', x: x || '', rain: x === 'rain' };
      PARTS.length = 0;
      G.rainAll = x === 'rain';
    });
  },
  ini(a) {
    G.flags.ini = (G.flags.ini || 0) + 1;
    if (a === 'biz') G.flags.iniBiz = (G.flags.iniBiz || 0) + 1;
    updHud();
    const el = document.createElement('div');
    el.className = 'pop ini';
    el.textContent =
      '📩 Она написала первой' + (a === 'biz' ? ' (по делу)' : '') + ' · ' + G.flags.ini;
    $('#pops').appendChild(el);
    setTimeout(() => el.remove(), 2600);
  },
  cnt(a) {
    G.flags[a] = (G.flags[a] || 0) + 1;
  },
  meter(a) {
    const [f, t, l] = a.split(' ');
    return meterFx(+f, +t, l);
  },
  mus(a) {
    G.mus = a;
    playMusic(a);
  },
  sfx(a) {
    sfx(a);
  },
  show(a) {
    const [id, emo, pos, outfit] = a.split(' ');
    const c = G.chars[id];
    if (c && !c.out) {
      c.tx = POS[pos || 'c'] ?? c.tx;
      if (outfit) c.outfit = outfit;
      setEmo(id, emo);
      return;
    }
    const tx = POS[pos || 'c'];
    G.chars[id] = {
      emo: emo || 'neutral',
      tx,
      x: tx + (tx < 160 ? -14 : 14),
      a: 0,
      t0: T,
      outfit: outfit || ''
    };
  },
  hide(a) {
    const c = G.chars[a];
    if (c) c.out = 1;
  },
  hideall() {
    for (const k in G.chars) G.chars[k].out = 1;
    G.speaker = null;
  },
  emo(a) {
    const [id, e] = a.split(' ');
    setEmo(id, e);
  },
  fx(a) {
    return FX[a] && FX[a]();
  },
  cg(a) {
    const [k, cap] = a.split('|');
    G.cg = { k, cap: cap || '' };
    showCg();
    return skipping() ? null : sleep(500);
  },
  cgoff() {
    G.cg = null;
    showCg();
  },
  title(a) {
    const [b, s] = a.split('|');
    return titleCard(b, s || '');
  },
  phone(a) {
    const [n, st] = a.split('|');
    G.phone = { n, st: st || '', msgs: [] };
    showPhone();
    sfx('pop');
    return skipping() ? null : sleep(350);
  },
  phoneoff() {
    G.phone = null;
    showPhone();
  },
  fant(a) {
    G.fant = a === 'on' ? 1 : 0;
    $('#fant').classList.toggle('on', !!G.fant);
    if (G.fant) sfx('realize');
  },
  wait(a) {
    return skipping() ? null : sleep(+a || 500);
  },
  stamp(a) {
    return stamp(a, 'big');
  },
  filter(a) {
    G.filter = a === 'none' ? '' : a;
    applyFilter();
  },
  ending(a) {
    showEnding(a);
    return { halt: 1 };
  },
  goto(a) {
    return { jump: a };
  },
  chapter(a) {
    G.ch = +a;
    PERS.chap[a] = 1;
    savePers();
    G.snap = JSON.stringify(serial());
    saveSlot(0, 1);
  },
  set(a) {
    G.flags[a] = 1;
  },
  stat(a) {
    const [k, v] = a.split(' ');
    applyFx({ [k]: +v });
  },
  train() {
    G.train = T;
    sfx('train');
    return skipping() ? null : sleep(2500);
  }
};
function applyFilter() {
  cv.style.filter = G.filter || '';
}

// ---------- dialogue ----------
function hideDlg() {
  $('#dlg').classList.add('hide');
  G.speaker = null;
}
function setPortrait(who, emo) {
  const por = $('#por'),
    img = $('#pimg');
  por.className = '';
  G.pport = null;
  let key = null;
  if (who === 'nar') {
    por.classList.add('none');
    return;
  }
  if (who === 'in') {
    key = 'r_bw';
    por.classList.add('inner');
  } else if (PH[who]) {
    const c = G.chars[who];
    key =
      who === 'ru' && c && c.outfit === 'suit'
        ? 'r_suit'
        : PH[who][emo] || PH[who][c && c.emo] || PH[who]._;
    if (who === 'ru' && c && c.outfit === 'leather') key = 'r_meme';
  } else if (CHD[who]) {
    G.pport = { id: who, emo: emo || (G.chars[who] || {}).emo || 'neutral' };
    por.classList.add('spr');
  }
  if (key) {
    img.src = IMG[key];
    por.classList.add('img');
  }
  const e = emo || (G.chars[who] || {}).emo || 'neutral';
  por.classList.add('e-' + e);
}
function buildText(text) {
  const el = $('#dtext');
  el.innerHTML = '';
  const spans = [];
  let mode = '',
    i = 0;
  for (const ch of text) {
    if (ch === '*') {
      mode = mode === 'a' ? '' : 'a';
      continue;
    }
    if (ch === '_') {
      mode = mode === 'w' ? '' : 'w';
      continue;
    }
    const s = document.createElement('span');
    s.textContent = ch;
    if (mode) s.className = mode;
    if (mode === 'w') s.style.animationDelay = i * 0.06 + 's';
    el.appendChild(s);
    spans.push(s);
    i++;
  }
  return spans;
}
async function say(who, emo, text) {
  const sp = SP[who] || { n: who, c: '#fff' };
  if (emo) setEmo(who, emo);
  G.speaker = who;
  const d = $('#dlg');
  d.classList.remove('hide');
  d.className = who === 'in' ? 'inner' : who === 'nar' ? 'narr' : '';
  d.style.setProperty('--nc', sp.c);
  $('#dname').textContent = sp.n;
  setPortrait(who, emo);
  if (G.pport && emo) G.pport.emo = emo;
  $('#darr').style.visibility = 'hidden';
  LOG.push({ w: sp.n, c: sp.c, t: text.replace(/[*_]/g, '') });
  if (LOG.length > 300) LOG.shift();
  speak(text, who);
  const spans = buildText(text);
  typingNow = 1;
  $('#por').classList.add('talk');
  await new Promise(res => {
    let i = 0,
      done = 0,
      tm;
    const fin = () => {
      if (done) return;
      done = 1;
      clearTimeout(tm);
      spans.forEach(s => s.classList.add('v'));
      res();
    };
    advFn = fin;
    const tick = () => {
      if (done) return;
      if (skipping()) {
        advFn = null;
        fin();
        return;
      }
      if (i >= spans.length) {
        advFn = null;
        fin();
        return;
      }
      const s = spans[i++];
      s.classList.add('v');
      const ch = s.textContent;
      if (i % 2 && ch.trim()) blip(who);
      let dl = 1000 / SET.speed;
      if ('.!?…'.includes(ch)) dl *= 7;
      else if (',—:;'.includes(ch)) dl *= 3.5;
      tm = setTimeout(tick, dl);
    };
    tick();
  });
  typingNow = 0;
  $('#por').classList.remove('talk');
  $('#darr').style.visibility = 'visible';
  await waitAdv(1100 + text.length * 35);
}

// ---------- phone ----------
function showPhone() {
  const p = $('#phone');
  if (!G.phone) {
    p.classList.add('hide');
    return;
  }
  p.classList.remove('hide');
  $('#ph-name').textContent = G.phone.n;
  $('#ph-st').textContent = G.phone.st;
  const pn = G.phone.n;
  $('#ph-ava').textContent = /групп|ГМУ|чат/i.test(pn)
    ? '🔥'
    : pn.includes('Колян')
      ? '🚗'
      : pn.includes('Никитос')
        ? '👑'
        : pn.includes('Сан')
          ? '🎧'
          : pn.includes('Лера')
            ? '💜'
            : pn.includes('Кнар')
              ? '🍇'
              : '🌸';
  const m = $('#ph-msgs');
  m.innerHTML = '';
  G.phone.msgs.forEach(x => m.appendChild(bubble(x)));
  m.scrollTop = 1e6;
  const d = new Date();
  $('#ph-clock').textContent =
    String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}
function bubble(x) {
  const b = document.createElement('div');
  b.className = 'bub ' + x.s;
  b.innerHTML = (x.w ? `<b>${x.w}</b>` : '') + x.t.replace(/</g, '&lt;');
  return b;
}
async function phoneMsg(side, who, text) {
  if (!G.phone) {
    G.phone = { n: 'Чат', st: '', msgs: [] };
    showPhone();
  }
  hideDlg();
  const m = $('#ph-msgs');
  if (side === 'in' && !skipping()) {
    const ty = document.createElement('div');
    ty.className = 'bub in typing';
    ty.innerHTML = '<i></i><i></i><i></i>';
    m.appendChild(ty);
    m.scrollTop = 1e6;
    await sleep(650);
    ty.remove();
  }
  if (side === 'out' && !skipping()) {
    const dr = $('#ph-draft');
    dr.classList.add('on');
    for (let i = 0; i <= Math.min(text.length, 40); i++) {
      dr.textContent = text.slice(0, i) + (text.length > 40 && i === 40 ? '…' : '');
      if (i % 2) sfx('type');
      await sleep(16);
    }
    await sleep(150);
    dr.textContent = 'Сообщение';
    dr.classList.remove('on');
  }
  const x = { s: side, w: who, t: text };
  G.phone.msgs.push(x);
  const b = bubble(x);
  b.classList.add('new');
  m.appendChild(b);
  m.scrollTop = 1e6;
  sfx(side === 'in' ? 'notif' : 'send');
  LOG.push({
    w: side === 'out' ? 'Руслан 📱' : (who || G.phone.n) + ' 📱',
    c: side === 'out' ? '#ffb347' : '#ffc4e4',
    t: text
  });
  await waitAdv(900 + text.length * 30);
}

// ---------- choices ----------
function choose(opts, head) {
  return new Promise(res => {
    const box = $('#choices');
    box.innerHTML = head ? `<div class="ch-head">${head}</div>` : '';
    let n = 0;
    const btns = [];
    opts.forEach(o => {
      if (o.secret && !meets(o.need, o.max, o)) return;
      const ok = meets(o.need, o.max, o);
      const b = document.createElement('button');
      b.className = 'chb' + (ok ? '' : ' locked') + (o.secret ? ' secret' : '');
      n++;
      b.innerHTML =
        `<span class="k">${n}</span><span class="t">${o.t}</span>` +
        ((o.need || o.max || o.ft) && !o.secret
          ? `<span class="need">${ok ? '✓' : '🔒'} ${needText(o.need, o.max, o)}</span>`
          : '');
      b.style.animationDelay = n * 0.07 + 's';
      if (ok) {
        b.onclick = e => {
          e.stopPropagation();
          sfx('click');
          box.classList.add('hide');
          res(o);
        };
        b.onmouseenter = () => sfx('hover');
        btns.push(b);
      } else
        b.onclick = e => {
          e.stopPropagation();
          sfx('fail');
          b.classList.remove('shk');
          void b.offsetWidth;
          b.classList.add('shk');
        };
      b.dataset.i = n;
      box.appendChild(b);
    });
    box.classList.toggle('many', n > 5);
    box.classList.remove('hide');
    sfx('pop');
    box._keys = btns;
  });
}
async function doChoice(st, my) {
  MODE.skip = 0;
  updTop();
  const o = await choose(st.c, st.h);
  LOG.push({ w: 'Выбор', c: '#ffd166', t: '→ ' + o.t });
  applyFx(o.fx);
  if (o.set) G.flags[o.set] = 1;
  if (o.then) {
    const r = await seq(o.then, my);
    if (r) return r;
  }
  if (o.go) return { jump: o.go };
}
async function doPick(st, my) {
  let left = st.opts.slice();
  for (let i = 0; i < st.pick; i++) {
    MODE.skip = 0;
    const o = await choose(left, `${st.h || 'Выбери'} · ${i + 1}/${st.pick}`);
    left = left.filter(x => x !== o);
    LOG.push({ w: 'Выбор', c: '#ffd166', t: '→ ' + o.t });
    applyFx(o.fx);
    if (o.then) {
      const r = await seq(o.then, my);
      if (r) return r;
    }
  }
}
async function doSplit([a, b]) {
  hideDlg();
  const s = $('#split');
  s.classList.remove('hide');
  $('#sp-a').textContent = '';
  $('#sp-b').textContent = '';
  s.className = '';
  sfx('realize');
  $('#sp-a').textContent = a;
  s.classList.add('s1');
  await waitAdv(2600);
  sfx('scratch');
  s.classList.add('s2');
  $('#sp-b').textContent = b;
  await waitAdv(2600);
  s.className = 'hide';
}

// ---------- fx / overlays ----------
function shake(n = 'shk') {
  if (!SET.shake) return;
  const g = $('#game');
  g.classList.remove('shk', 'shk2');
  void g.offsetWidth;
  g.classList.add(n);
}
function fxEl(cls, html, ms) {
  const e = document.createElement('div');
  e.className = 'fxe ' + cls;
  e.innerHTML = html || '';
  $('#fx').appendChild(e);
  setTimeout(() => e.remove(), ms);
  return e;
}
const FX = {
  heart() {
    sfx('heart');
    fxEl('fx-heart', '<div class="ph"></div><b>ЁК!</b>', 1300);
    shake('shk');
    return skipping() ? null : sleep(700);
  },
  cringe() {
    sfx('cringe');
    fxEl('fx-cringe', '', 1400);
    stamp('КРИНЖ', 'cr', 1);
    shake('shk2');
    return skipping() ? null : sleep(900);
  },
  crash() {
    sfx('crash');
    fxEl(
      'fx-crash',
      '<svg viewBox="0 0 320 180" preserveAspectRatio="none"><path d="M160 90 L120 10 M160 90 L40 60 M160 90 L20 150 M160 90 L140 178 M160 90 L230 170 M160 90 L300 120 M160 90 L280 20 M160 90 L200 0 M120 10 L90 30 M40 60 L60 90 M230 170 L260 150 M280 20 L300 50" stroke="#fff" stroke-width="1.6" fill="none" shape-rendering="crispEdges"/></svg>',
      1600
    );
    stamp('ВНУТРЕННИЙ КРАХ', 'crash', 1);
    shake('shk2');
    return skipping() ? null : sleep(1100);
  },
  realize() {
    sfx('realize');
    fxEl('fx-flash', '', 900);
    stamp('ОСОЗНАНИЕ', 'real', 1);
    $('#game').classList.add('zoom');
    setTimeout(() => $('#game').classList.remove('zoom'), 1200);
    return skipping() ? null : sleep(1100);
  },
  scratch() {
    sfx('scratch');
    shake('shk2');
    fxEl('fx-flash', '', 400);
    return skipping() ? null : sleep(500);
  },
  alarm() {
    sfx('alarm');
    fxEl('fx-alarm', '', 1000);
    stamp('БЗЗЗЗЗЗ', 'cr', 1);
    shake('shk2');
    return skipping() ? null : sleep(900);
  },
  shake() {
    shake('shk2');
  },
  flash() {
    fxEl('fx-flash', '', 600);
  }
};
function meterFx(f, t, l) {
  const s = $('#stamp');
  s.className = 'meter';
  s.innerHTML = `<small>${(l || 'ВЛЮБЛЁННОСТЬ').replace(/_/g, ' ')}</small><div class="mbar"><i style="width:${f}%"></i></div><b>${f}%</b>`;
  void s.offsetWidth;
  s.classList.add('go');
  sfx('crash');
  const i = s.querySelector('i'),
    b = s.querySelector('b');
  let v = f;
  const iv = setInterval(() => {
    v += (t - v) * 0.08;
    if (Math.abs(t - v) < 0.6) {
      v = t;
      clearInterval(iv);
    }
    i.style.width = v + '%';
    b.textContent = Math.round(v) + '%';
  }, 40);
  return Promise.race([sleep(skipping() ? 300 : 3200), waitAdv()]).then(() => {
    clearInterval(iv);
    s.classList.remove('go');
    advFn = null;
  });
}
function stamp(text, cls, quick) {
  const s = $('#stamp');
  s.className = cls || 'big';
  s.innerHTML = '';
  s.textContent = text;
  void s.offsetWidth;
  s.classList.add('go');
  if (!quick) sfx('stamp');
  setTimeout(() => s.classList.remove('go'), quick ? 1100 : 2200);
  if (quick) return;
  return skipping() ? sleep(200) : Promise.race([sleep(2300), waitAdv()]);
}
async function titleCard(a, b) {
  hideDlg();
  const c = $('#card');
  $('#card-a').textContent = a;
  $('#card-b').textContent = b;
  c.classList.remove('hide');
  c.classList.remove('go');
  void c.offsetWidth;
  c.classList.add('go');
  sfx('stamp');
  if (skipping()) await sleep(300);
  else await Promise.race([sleep(2800), waitAdv()]);
  advFn = null;
  c.classList.add('hide');
}
function showCg() {
  const e = $('#cg');
  if (!G.cg) {
    e.classList.add('hide');
    return;
  }
  $('#cgimg').src = IMG[G.cg.k];
  $('#cgcap').textContent = G.cg.cap;
  e.classList.remove('hide');
  e.classList.remove('in');
  void e.offsetWidth;
  e.classList.add('in');
}

// ---------- epilogue ----------
function porURL(id, key) {
  const k =
    key ||
    { ru: 'r_bw', nu: 'n_soft', kol: 'k_por', nik: 'n2_por', san: 's_por', kn: 'kn_por' }[id];
  if (k && IMG[k]) return IMG[k];
  const c = renderChar(id, 'smile', {}, 1, false, false);
  const t = document.createElement('canvas');
  t.width = 48;
  t.height = 48;
  const g = t.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#120c22';
  g.fillRect(0, 0, 48, 48);
  g.drawImage(c, 26, 14, 48, 48, 0, 0, 48, 48);
  return t.toDataURL();
}
async function doEpi(list, title) {
  hideDlg();
  G.phone = null;
  showPhone();
  const e = $('#epi');
  e.innerHTML = `<h2>${title || 'ГДЕ ОНИ СЕЙЧАС'}</h2><div class="epg">${list.map((x, i) => `<div class="epc" style="animation-delay:${i * 0.35}s"><img src="${porURL(x[0], x[2])}" alt=""><div><b style="color:${(SP[x[0]] || {}).c || '#fff'}">${(SP[x[0]] || { n: x[0] }).n}</b><span>${x[1]}</span></div></div>`).join('')}</div><small>нажми, чтобы продолжить</small>`;
  e.classList.remove('hide');
  sfx('realize');
  if (!skipping()) await sleep(900);
  await waitAdv();
  e.classList.add('hide');
}
// ---------- ending ----------
function showEnding(k) {
  const e = ENDS[k];
  $('#stamp').className = '';
  PERS.ends[k] = 1;
  savePers();
  hideDlg();
  G.phone = null;
  showPhone();
  $('#choices').classList.add('hide');
  setUI(0);
  const n = Object.keys(PERS.ends).filter(x => ENDS[x]).length;
  const el = $('#ending');
  el.style.setProperty('--ec', e.c);
  el.innerHTML = `<div class="en-in"><div class="en-s">${e.s}</div><div class="en-n">${e.n}</div><div class="en-d">${e.d}</div>
  <div class="en-st">${Object.keys(STM)
    .map(s => `<div><span>${STM[s][0]} ${STM[s][1]}</span><b>${G.st[s]}/10</b></div>`)
    .join('')}</div>
  <div class="en-c">Она написала первой за игру: <b>${G.flags.ini || 0}</b> (по делу: ${G.flags.iniBiz || 0}) · Концовок открыто: <b>${n}/${NEND}</b>${n < NEND ? ' — пройди ещё раз, выбирай иначе' : ' — ты прошёл всё. Руслан гордится.'}</div>
  <div class="en-b"><button class="mb" data-a="menu">В главное меню</button><button class="mb" data-a="ends">Все концовки</button><button class="mb" data-a="ch6">Переиграть финал</button></div></div>`;
  el.classList.remove('hide');
  sfx(k === 'sad' || k === 'friend' ? 'fail' : 'win');
  INGAME = 0;
  el.querySelector('[data-a=menu]').onclick = () => {
    sfx('click');
    el.classList.add('hide');
    showMenu();
  };
  el.querySelector('[data-a=ends]').onclick = () => {
    sfx('click');
    openModal('ends');
  };
  el.querySelector('[data-a=ch6]').onclick = () => {
    sfx('click');
    el.classList.add('hide');
    if (!loadSlot(0)) showMenu();
  };
}

// ---------- save / load ----------
function saveSlot(i, silent) {
  if (!G.snap) return;
  const d = JSON.parse(G.snap);
  saveJSON('nmt2_s' + i, { d, t: Date.now(), ch: G.ch });
  if (!silent) toast('Сохранено в слот ' + (i || 'авто'));
}
function loadSlot(i) {
  const s = loadJSON('nmt2_s' + i);
  if (!s) return false;
  startFrom(s.d);
  return true;
}
function startFrom(state) {
  RUN++;
  closeModal();
  $('#menu').classList.add('hide');
  $('#ending').classList.add('hide');
  G = Object.assign(newState(), state);
  PARTS.length = 0;
  for (const k in G.chars) {
    G.chars[k].a = 1;
    G.chars[k].x = G.chars[k].tx;
  }
  showPhone();
  showCg();
  applyFilter();
  $('#fant').classList.toggle('on', !!G.fant);
  MG.crowd = null;
  $('#mini').classList.add('hide');
  hideDlg();
  $('#choices').classList.add('hide');
  playMusic(G.mus || 'campus');
  setUI(1);
  updHud();
  setTimeout(play, 30);
}
function newGame(lab) {
  const s = newState();
  s.lab = lab || 'start';
  if (lab && lab !== 'start') {
    const n = CHAP.findIndex(c => c[0] === lab);
    Object.assign(s.st, {
      cringe: n,
      ideal: 2 + (n >> 1),
      dep: 1 + (n >> 1),
      grow: n >> 1,
      tired: n >> 1
    });
  }
  LOG = [];
  startFrom(s);
}
function toast(t) {
  const e = $('#toast');
  e.textContent = t;
  e.classList.remove('go');
  void e.offsetWidth;
  e.classList.add('go');
}

// ---------- UI shell ----------
function setUI(on) {
  ['#top', '#hud'].forEach(s => $(s).classList.toggle('hide', !on));
  if (on && loadJSON('nmt2_hud') === 0) $('#hud').classList.add('hide');
}
function updTop() {
  $('[data-a=auto]').classList.toggle('on', !!MODE.auto);
  $('[data-a=skip]').classList.toggle('on', !!MODE.skip);
}
function showMenu() {
  RUN++;
  INGAME = 0;
  closeModal();
  G = newState();
  G.bg = { n: 'park', tod: 'night' };
  G.chars = {
    ru: { emo: 'hope', tx: POS.l, x: POS.l, a: 1 },
    nu: { emo: 'cold', tx: POS.r, x: POS.r, a: 1 }
  };
  G.speaker = null;
  hideDlg();
  G.phone = null;
  showPhone();
  G.cg = null;
  showCg();
  applyFilter();
  $('#fant').classList.remove('on');
  $('#choices').classList.add('hide');
  $('#mini').classList.add('hide');
  MG.crowd = null;
  setUI(0);
  $('#menu').classList.remove('hide');
  $('#m-cont').disabled = !loadJSON('nmt2_s0');
  playMusic('menu');
}
function openModal(kind) {
  const m = $('#modal'),
    b = $('#mbody');
  m.classList.remove('hide');
  m.dataset.k = kind;
  let h = '';
  if (kind === 'save' || kind === 'load') {
    $('#mtitle').textContent = kind === 'save' ? 'Сохранить' : 'Загрузить';
    h = [0, 1, 2, 3]
      .map(i => {
        const s = loadJSON('nmt2_s' + i);
        const lab = s
          ? `${CHAP[s.ch || 0][1]} · ${CHAP[s.ch || 0][2]}<small>${new Date(s.t).toLocaleString('ru-RU')}</small>`
          : '<i>пусто</i>';
        const can = kind === 'save' ? i > 0 && INGAME : !!s;
        return `<button class="slot" data-i="${i}" ${can ? '' : 'disabled'}><b>${i ? 'Слот ' + i : 'Автосейв'}</b><span>${lab}</span></button>`;
      })
      .join('');
    b.innerHTML = h;
    b.querySelectorAll('.slot').forEach(
      x =>
        (x.onclick = () => {
          sfx('click');
          const i = +x.dataset.i;
          if (kind === 'save') {
            saveSlot(i);
            openModal('save');
          } else loadSlot(i);
        })
    );
  } else if (kind === 'chap') {
    $('#mtitle').textContent = 'Главы';
    b.innerHTML = CHAP.map(
      (c, i) =>
        `<button class="slot" data-l="${c[0]}" ${PERS.chap[i] ? '' : 'disabled'}><b>${c[1]}</b><span>${PERS.chap[i] ? c[2] : '🔒 ещё не открыта'}</span></button>`
    ).join('');
    b.querySelectorAll('.slot').forEach(
      x =>
        (x.onclick = () => {
          sfx('click');
          newGame(x.dataset.l);
        })
    );
  } else if (kind === 'ends') {
    $('#mtitle').textContent =
      'Концовки ' + Object.keys(PERS.ends).filter(k => ENDS[k]).length + '/' + NEND;
    b.innerHTML =
      '<div class="egrid">' +
      Object.keys(ENDS)
        .map(k => {
          const e = ENDS[k],
            u = PERS.ends[k];
          return `<div class="ecard ${u ? 'u' : ''}" style="--ec:${e.c}"><small>${u ? e.s : '???'}</small><b>${u ? e.n : '████████'}</b><span>${u ? e.d : 'Подсказка: ' + e.h}</span></div>`;
        })
        .join('') +
      '</div>';
  } else if (kind === 'log') {
    $('#mtitle').textContent = 'Журнал';
    b.innerHTML =
      '<div class="logl">' +
      LOG.map(l => `<p><b style="color:${l.c}">${l.w}</b> ${l.t.replace(/</g, '&lt;')}</p>`).join(
        ''
      ) +
      '</div>';
    setTimeout(() => {
      const l = b.querySelector('.logl');
      if (l) l.scrollTop = 1e6;
    }, 10);
  } else if (kind === 'set') {
    $('#mtitle').textContent = 'Настройки';
    const sl = (k, l, mn, mx, st) =>
      `<label class="row"><span>${l}</span><input type="range" min="${mn}" max="${mx}" step="${st}" value="${SET[k]}" data-k="${k}"></label>`;
    const tg = (k, l) =>
      `<label class="row"><span>${l}</span><button class="tg ${SET[k] ? 'on' : ''}" data-t="${k}">${SET[k] ? 'ВКЛ' : 'ВЫКЛ'}</button></label>`;
    b.innerHTML =
      sl('mus', '🎵 Музыка', 0, 1, 0.05) +
      sl('sfx', '🔊 Звуки', 0, 1, 0.05) +
      sl('speed', '⌨ Скорость текста', 15, 120, 1) +
      tg('blip', '🗣 Голоса-бипы персонажей') +
      tg('tts', '🎙 Озвучка (синтез речи браузера)') +
      tg('shake', '📳 Тряска экрана') +
      tg('crt', '📺 CRT-сканлайны') +
      `<div class="hint">Пробел/Enter — дальше · 1–6 — выбор · Ctrl — скип · Tab — статы · H — скрыть UI · Esc — меню</div><button class="mb wide" id="wipe">Сбросить прогресс и концовки</button>`;
    b.querySelectorAll('input').forEach(
      x =>
        (x.oninput = () => {
          SET[x.dataset.k] = +x.value;
          setVol();
          saveJSON('nmt_set', SET);
        })
    );
    b.querySelectorAll('.tg').forEach(
      x =>
        (x.onclick = () => {
          const k = x.dataset.t;
          SET[k] = SET[k] ? 0 : 1;
          saveJSON('nmt_set', SET);
          applySet();
          openModal('set');
          sfx('click');
        })
    );
    $('#wipe').onclick = e => {
      const w = e.currentTarget;
      if (!w.dataset.sure) {
        w.dataset.sure = 1;
        w.textContent = 'Точно? Нажми ещё раз';
        return;
      }
      {
        try {
          ['nmt2_pers', 'nmt2_s0', 'nmt2_s1', 'nmt2_s2', 'nmt2_s3'].forEach(k =>
            localStorage.removeItem(k)
          );
        } catch (e) {}
        PERS.ends = {};
        PERS.chap = { 0: 1 };
        toast('Стёрто');
        openModal('set');
      }
    };
  } else if (kind === 'pause') {
    $('#mtitle').textContent = 'Пауза';
    b.innerHTML = [
      'Продолжить|close',
      'Сохранить|save',
      'Загрузить|load',
      'Журнал|log',
      'Настройки|set',
      'Главное меню|menu'
    ]
      .map(x => {
        const [l, a] = x.split('|');
        return `<button class="mb wide" data-a="${a}">${l}</button>`;
      })
      .join('');
    b.querySelectorAll('button').forEach(
      x =>
        (x.onclick = () => {
          sfx('click');
          const a = x.dataset.a;
          if (a === 'close') closeModal();
          else if (a === 'menu') showMenu();
          else openModal(a);
        })
    );
  }
}
function closeModal() {
  $('#modal').classList.add('hide');
}
function applySet() {
  $('#crt').style.display = SET.crt ? '' : 'none';
  if (!SET.tts && window.speechSynthesis) speechSynthesis.cancel();
}

// ---------- input ----------
const gameEl = $('#game');
gameEl.addEventListener('pointerdown', () => auInit(), { capture: true });
gameEl.addEventListener('click', e => {
  if (e.target.closest('button,input,textarea,.ui:not(#hud),#modal')) return;
  if (!$('#modal').classList.contains('hide')) return;
  if (MG.active) return;
  if (!$('#choices').classList.contains('hide')) return;
  if (gameEl.classList.contains('noui')) {
    gameEl.classList.remove('noui');
    return;
  }
  advance();
});
document.addEventListener('keydown', e => {
  auInit();
  const k = e.key;
  if (k === 'Control') {
    MODE.ctrl = 1;
    advance();
    return;
  }
  if (!$('#modal').classList.contains('hide')) {
    if (k === 'Escape') closeModal();
    return;
  }
  if (!$('#choices').classList.contains('hide') && /^[1-9]$/.test(k)) {
    const b = [...$$('#choices .chb')].find(x => x.dataset.i === k);
    if (b) b.click();
    return;
  }
  if (MG.active) {
    if (MG.key) MG.key(e);
    return;
  }
  if (k === ' ' || k === 'Enter') {
    e.preventDefault();
    if ($('#choices').classList.contains('hide') && $('#menu').classList.contains('hide'))
      advance();
  } else if (k === 'Tab') {
    e.preventDefault();
    if (INGAME) {
      $('#hud').classList.toggle('hide');
      saveJSON('nmt2_hud', $('#hud').classList.contains('hide') ? 0 : 1);
    }
  } else if (k === 'Escape' && INGAME) openModal('pause');
  else if ((k === 'h' || k === 'р') && INGAME) gameEl.classList.toggle('noui');
});
document.addEventListener('keyup', e => {
  if (e.key === 'Control') MODE.ctrl = 0;
});
$('#top').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  e.stopPropagation();
  sfx('click');
  const a = b.dataset.a;
  if (a === 'auto') {
    MODE.auto ^= 1;
    MODE.skip = 0;
    if (MODE.auto) advance();
  } else if (a === 'skip') {
    MODE.skip ^= 1;
    MODE.auto = 0;
    if (MODE.skip) advance();
  } else if (a === 'stats') {
    $('#hud').classList.toggle('hide');
    saveJSON('nmt2_hud', $('#hud').classList.contains('hide') ? 0 : 1);
  } else openModal(a);
  updTop();
});
$('#mclose').onclick = e => {
  e.stopPropagation();
  sfx('click');
  closeModal();
};
$('#m-new').onclick = () => {
  sfx('click');
  newGame('start');
};
$('#m-cont').onclick = () => {
  sfx('click');
  loadSlot(0);
};
$('#m-chap').onclick = () => {
  sfx('click');
  openModal('chap');
};
$('#m-load').onclick = () => {
  sfx('click');
  openModal('load');
};
$('#m-ends').onclick = () => {
  sfx('click');
  openModal('ends');
};
$('#m-set').onclick = () => {
  sfx('click');
  openModal('set');
};
$$('#menu .mb').forEach(b => b.addEventListener('mouseenter', () => sfx('hover')));

'use strict';
// ================= MINI-GAMES =================
const MG = { active: 0, crowd: null, key: null };
function miniOpen(cls, html) {
  const m = $('#mini');
  m.style.pointerEvents = '';
  m.onmousemove = null;
  m.className = 'ui ' + cls;
  m.innerHTML = html;
  MG.active = 1;
  return m;
}
function miniClose() {
  const m = $('#mini');
  m.className = 'ui hide';
  m.innerHTML = '';
  MG.active = 0;
  MG.key = null;
}
function drawCrowd() {
  const cr = MG.crowd;
  cr.sort((a, b) => a.y - b.y);
  for (const p of cr) {
    if (p.walk) {
      p.x += p.vx;
      if (p.x < 6 || p.x > W - 30) p.vx *= -1;
    }
    const s = p.y > 128 ? 2 : 1;
    miniPerson(p.x, p.y - (s === 2 ? 60 : 30), p, s, T);
    if (p.flash && T - p.flash < 0.5) {
      ga(0.6);
      R(p.x - 2, p.y - (s === 2 ? 64 : 32), 10 * s + 4, 32 * s, p.ok ? '#7cf2a0' : '#ff5f5f');
      ga(1);
    }
  }
}

const MINI = {
  // ---- 1. найти Нюрку в коридоре ----
  find() {
    return new Promise(res => {
      G.bg = { n: 'corridor' };
      G.chars = {};
      const types = [
        { hair: 'blondeLong', top: '#17161f', pants: '#9ab4d4', ok: 1 },
        {
          hair: 'blondeLong',
          top: '#ece4d4',
          pants: '#2a2a3a',
          t: 'Белое пальто, светлые волосы. Не она. Это Вика. Не та Вика — другая Вика. Обе смотрят на тебя с подозрением.'
        },
        {
          hair: 'brownLong',
          top: '#17161f',
          pants: '#9ab4d4',
          t: 'Пуховик тот же. Волосы — нет. Это вторая Вика. Ты перепутал Вик. Опять.'
        },
        {
          hair: 'blondeShort',
          top: '#1a1a1a',
          pants: '#3a3a4a',
          t: 'Это Кирилл. Блондин. В пуховике. Руслан, ты в порядке?'
        },
        {
          hair: 'blondeBun',
          top: '#17161f',
          pants: '#9ab4d4',
          t: 'Блондинка в чёрном пуховике! …с пучком. Это староста. Она спрашивает, где твоя курсовая.'
        },
        {
          hair: 'darkLong',
          top: '#c9a27a',
          pants: '#2a2a3a',
          t: 'Это Висилицкая. «Ruslan, are you lost?» Yes. Ruslan is very lost.'
        },
        {
          hair: 'cap',
          top: '#2f7a4c',
          pants: '#2a2a3a',
          t: 'Это Денчик. Он показывает тебе фак. По-дружески.'
        },
        {
          hair: 'darkShort',
          top: '#3a5a8a',
          pants: '#2a2a3a',
          t: 'Это Владос. Он снимает тебя на видео. Зачем — не говорит.'
        },
        {
          hair: 'redLong',
          top: '#7a3a5a',
          pants: '#9ab4d4',
          t: 'Кудри, бордовые волосы. Это Кнаря. «Руслан-джан, она левее, балбес!»'
        },
        {
          hair: 'brownLong',
          top: '#5a3a7a',
          pants: '#2a2a3a',
          t: 'Это Огромный Витёк. Как ты вообще мог его с кем-то перепутать?'
        },
        {
          hair: 'blondeShort',
          top: '#e8e0d0',
          pants: '#9ab4d4',
          t: 'Это… Казьбан. Здравствуйте! «Руслан, деточка, у вас пара не началась?»'
        }
      ];
      const r = Math.random;
      MG.crowd = types.map((p, i) =>
        Object.assign({}, p, {
          x: 20 + r() * 270,
          y: 100 + r() * 62,
          ph: r() * 10,
          walk: 1,
          vx: (r() < 0.5 ? -1 : 1) * (0.08 + r() * 0.25)
        })
      );
      let left = 15,
        done = 0;
      const m = miniOpen(
        'm-find',
        `<div class="mf-top pf"><b>НАЙДИ НЮРКУ</b><span>светлые волосы · чёрный пуховик · джинсы · две заколки</span><div class="tbar"><i id="mf-t"></i></div></div><div class="mf-msg pf" id="mf-msg">Кликай по людям в коридоре. У тебя 15 секунд до начала пары.</div>`
      );
      m.style.pointerEvents = 'none';
      m.querySelectorAll('.pf').forEach(x => (x.style.pointerEvents = 'auto'));
      const end = found => {
        if (done) return;
        done = 1;
        clearInterval(iv);
        cv.removeEventListener('click', onc);
        G.flags.found = found ? 1 : 0;
        $('#mf-msg').textContent = found
          ? 'Нашёл! Сердце колотится, как будто он нашёл не одногруппницу, а смысл жизни.'
          : 'Время вышло. Пара началась. Нюрка где-то там. Без тебя.';
        sfx(found ? 'win' : 'fail');
        if (found) applyFx(left > 8 ? { self: 1 } : {});
        setTimeout(() => {
          MG.crowd = null;
          miniClose();
          res();
        }, 1700);
      };
      const onc = e => {
        if (done) return;
        e.stopPropagation();
        const b = cv.getBoundingClientRect(),
          x = ((e.clientX - b.left) / b.width) * W,
          y = ((e.clientY - b.top) / b.height) * H;
        const hit = MG.crowd
          .slice()
          .reverse()
          .find(p => {
            const s = p.y > 128 ? 2 : 1;
            return x >= p.x && x <= p.x + 10 * s && y >= p.y - 32 * s && y <= p.y;
          });
        if (!hit) return;
        hit.flash = T;
        if (hit.ok) {
          end(1);
        } else {
          sfx('fail');
          $('#mf-msg').textContent = hit.t;
          left -= 2;
        }
      };
      cv.addEventListener('click', onc);
      const iv = setInterval(() => {
        left -= 0.1;
        $('#mf-t').style.width = clamp((left / 15) * 100, 0, 100) + '%';
        if (left <= 0) end(0);
      }, 100);
    });
  },

  // ---- 2. собрать сообщение ----
  msg() {
    return new Promise(res => {
      const chips = [
        { t: 'привет)', s: 1 },
        { t: 'задачи 3–7 из сборника, стр. 112', s: 2, info: 1 },
        { t: 'если непонятно — могу объяснить', s: 1 },
        { t: 'ахах', s: 0 },
        { t: 'кстати, ты сегодня красиво смеялась', s: -2, c: 2 },
        { t: 'я весь вечер ждал, что ты напишешь', s: -3, c: 3, d: 1 },
        { t: ')))))))', s: -1, c: 1 },
        { t: 'могу скинуть свои решения', s: 0, d: 1 },
        { t: 'спокойной ночи, солнце ☀️', s: -2, c: 2 },
        { t: 'у меня есть запасная зарядка (для тебя)', s: -1, c: 1 },
        { t: 'удачи с эконометрикой', s: 1 },
        { t: 'мне кажется, мы похожи', s: -2, c: 2 }
      ];
      chips.sort(() => Math.random() - 0.5);
      const pick = [];
      const m = miniOpen(
        'm-msg',
        `<div class="mm pf"><div class="mm-h"><b>ОТВЕТЬ ЕЙ</b><span>Цель: помочь и не скатиться в простыню</span></div><div class="mm-q">Нюрка: «привет) а ты не знаешь, что по эконометрике задали?»</div>
   <div class="mm-c" id="mm-c"><i>собери сообщение из кусочков ↓</i></div><div class="mm-meter"><span>простыня-метр</span><div class="tbar"><i id="mm-m"></i></div><b id="mm-l">0</b></div>
   <div class="mm-p" id="mm-p"></div><div class="mm-b"><button class="mb" id="mm-x">Стереть</button><button class="mb hot" id="mm-s">Отправить ➤</button></div></div>`
      );
      const pool = $('#mm-p'),
        comp = $('#mm-c');
      const draw = () => {
        const s = pick.map(c => c.t).join(' ');
        comp.innerHTML = s ? s.replace(/</g, '&lt;') : '<i>собери сообщение из кусочков ↓</i>';
        const L = s.length;
        $('#mm-l').textContent = L;
        const mt = $('#mm-m');
        mt.style.width = clamp((L / 130) * 100, 0, 100) + '%';
        mt.className = L > 95 ? 'red' : L > 60 ? 'yel' : '';
        pool.innerHTML = '';
        chips.forEach(c => {
          if (pick.includes(c)) return;
          const b = document.createElement('button');
          b.className = 'chip';
          b.textContent = c.t;
          b.onclick = e => {
            e.stopPropagation();
            if (pick.length >= 5) {
              sfx('fail');
              return;
            }
            pick.push(c);
            sfx('type');
            draw();
          };
          pool.appendChild(b);
        });
      };
      draw();
      $('#mm-x').onclick = e => {
        e.stopPropagation();
        pick.length = 0;
        sfx('click');
        draw();
      };
      $('#mm-s').onclick = async e => {
        e.stopPropagation();
        if (!pick.length) {
          sfx('fail');
          return;
        }
        const s = pick.map(c => c.t).join(' ');
        let sc =
          pick.reduce((a, c) => a + c.s, 0) +
          (pick.some(c => c.info) ? 1 : -2) -
          (s.length > 95 ? 2 : 0);
        const cr = pick.reduce((a, c) => a + (c.c || 0), 0),
          dp = pick.reduce((a, c) => a + (c.d || 0), 0);
        G.flags.msgScore = sc;
        miniClose();
        const fx = { cringe: cr, dep: dp };
        if (sc >= 2) {
          fx.kom = 1;
          fx.self = 1;
        }
        if (s.length > 95) fx.cringe = (fx.cringe || 0) + 1;
        G.phone.msgs.push({ s: 'out', t: s });
        showPhone();
        sfx('send');
        applyFx(fx);
        await sleep(700);
        res();
      };
    });
  },

  // ---- 3. домашка ночью ----
  hw() {
    return new Promise(res => {
      const tasks = [
        'Задача 1. Найти мат. ожидание выигрыша в лотерее «сдать матан с первого раза».',
        'Задача 2. Построить доверительный интервал для фразы «я сама разберусь».',
        'Задача 3. Проверить гипотезу H₀: «ей просто нужна домашка». Уровень значимости — твоё сердце.'
      ];
      let i = 0,
        min = 23 * 60,
        forHer = 0;
      const m = miniOpen(
        'm-hw',
        `<div class="mh pf"><div class="mh-h"><b>НОЧЬ ПЕРЕД ДЕДЛАЙНОМ</b><span class="clock" id="mh-cl">23:00</span></div><div class="mh-t" id="mh-t"></div><div class="mh-b" id="mh-b"></div><div class="mh-f" id="mh-f"></div></div>`
      );
      const clk = () => {
        const h = Math.floor(min / 60) % 24,
          mm = min % 60;
        $('#mh-cl').textContent = String(h).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      };
      const next = () => {
        if (i >= 3) {
          const own = '0%';
          $('#mh-t').innerHTML =
            `<b>Итог ночи</b><br>Сделано за неё: ${forHer} из 3<br>Своя домашка: ${own}<br>Время: ${$('#mh-cl').textContent}`;
          $('#mh-b').innerHTML = '<button class="mb hot" id="mh-ok">Лечь спать</button>';
          const fx = {};
          if (forHer === 0) fx.grow = 1;
          if (forHer === 3) {
            fx.ideal = 1;
            fx.cringe = 1;
          }
          G.flags.hwFor = forHer;
          applyFx(fx);
          $('#mh-ok').onclick = e => {
            e.stopPropagation();
            sfx('click');
            miniClose();
            res();
          };
          return;
        }
        $('#mh-t').textContent = tasks[i];
        $('#mh-f').textContent = '';
        $('#mh-b').innerHTML =
          '<button class="mb hot" data-o="all">🔥 Решить всё за неё</button><button class="mb" data-o="hint">💡 Написать подсказки</button><button class="mb" data-o="self">🙅 Пусть сделает сама</button>';
        $('#mh-b')
          .querySelectorAll('button')
          .forEach(
            b =>
              (b.onclick = e => {
                e.stopPropagation();
                sfx('click');
                const o = b.dataset.o;
                if (o === 'all') mash();
                else if (o === 'hint') {
                  min += 25;
                  clk();
                  applyFx({ kom: 1 });
                  $('#mh-f').textContent = 'Подсказки написаны. Она разберётся. Наверное.';
                  i++;
                  setTimeout(next, 900);
                } else {
                  min += 5;
                  clk();
                  applyFx({ self: 1 });
                  $('#mh-f').textContent = '«Ты справишься». Отправлено. Внутренний голос в шоке.';
                  i++;
                  setTimeout(next, 900);
                }
              })
          );
      };
      const mash = () => {
        let p = 0;
        $('#mh-b').innerHTML =
          '<button class="mb hot big" id="mh-m">ЖМИ! РЕШАЙ! ⌨</button><div class="tbar"><i id="mh-p"></i></div>';
        const hit = e => {
          if (e) e.stopPropagation();
          p++;
          sfx('type');
          $('#mh-p').style.width = (p / 14) * 100 + '%';
          min += 6;
          clk();
          if (p >= 14) {
            MG.key = null;
            forHer++;
            applyFx({ dep: 1, tired: 1 });
            $('#mh-f').textContent = [
              'Решено. С цветными пометками.',
              'Решено. Даже с пояснениями «для чайников» (с любовью).',
              'Решено. И сердечко на полях. Случайно.'
            ][i];
            i++;
            setTimeout(next, 900);
          }
        };
        $('#mh-m').onclick = hit;
        MG.key = e => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            hit();
          }
        };
      };
      clk();
      next();
    });
  },

  // ---- 4. поймать момент ----
  catch() {
    return new Promise(res => {
      const sp = 1.1 + G.st.dep * 0.12;
      let ph = 0,
        done = 0;
      const gz = [40 + Math.random() * 40, 9];
      const m = miniOpen(
        'm-catch',
        `<div class="mc pf"><div class="mc-h"><b>ПОЙМАЙ МОМЕНТ</b><span>Подойди, когда она одна. Жми ПРОБЕЛ или кнопку.</span></div>
   <div class="mc-track" id="mc-tr"><div class="z red" style="left:0;width:100%"></div><div class="z yel" style="left:${gz[0] - 14}%;width:${gz[1] + 28}%"></div><div class="z grn" style="left:${gz[0]}%;width:${gz[1]}%"></div><div class="mc-p" id="mc-p"></div></div>
   <div class="mc-l"><span>🎧 в наушниках</span><span>👯 с девочками</span><span>✨ одна</span></div><div class="mc-f" id="mc-f">Пульс: ${80 + G.st.dep * 8} ударов. Чем выше зависимость — тем быстрее бегает.</div><button class="mb hot big" id="mc-go">ПОДОЙТИ</button></div>`
      );
      let raf;
      const loop = () => {
        ph += 0.016 * sp;
        const x = (Math.sin(ph * 2.2) * 0.5 + 0.5) * 100;
        $('#mc-p').style.left = x + '%';
        m._x = x;
        if (!done) raf = requestAnimationFrame(loop);
      };
      loop();
      const go = e => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (done) return;
        done = 1;
        cancelAnimationFrame(raf);
        const x = m._x;
        const q =
          x >= gz[0] && x <= gz[0] + gz[1] ? 2 : x >= gz[0] - 14 && x <= gz[0] + gz[1] + 14 ? 1 : 0;
        G.flags.catchQ = q;
        $('#mc-f').textContent = [
          'Мимо. Она в наушниках и смотрит в телефон.',
          'Почти. Она с девочками. Ну… сойдёт.',
          'ИДЕАЛЬНО. Она одна. Сейчас или никогда.'
        ][q];
        sfx(q === 2 ? 'win' : q === 1 ? 'click' : 'fail');
        if (q === 2) applyFx({ self: 1 });
        setTimeout(() => {
          miniClose();
          res();
        }, 1500);
      };
      $('#mc-go').onclick = go;
      MG.key = e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          go();
        }
      };
    });
  },

  // ---- 5. не отправить ночное сообщение ----
  resist() {
    return new Promise(res => {
      const draft =
        'ань я не могу так. давай просто поговорим. я всё понял, я изменюсь, только не игнорь пж. я реально думал что у нас есть шанс. ты мне так нравишься что я не сплю. прости что пишу ночью. прости. короче прости';
      const temps = [
        'Она наверное ждёт 🥺',
        'Ну последний раз',
        'А вдруг она тоже не спит?',
        'Просто спросить «как дела»…',
        'Ты потом пожалеешь, что не отправил',
        'Она поймёт. Она обязана понять',
        'Ну хоть сердечко',
        'Это не навязчивость, это искренность'
      ];
      let hold = 0,
        holding = 0,
        left = 13,
        done = 0,
        pops = [],
        ti = 0;
      const need = 3;
      const m = miniOpen(
        'm-res',
        `<div class="mr pf"><div class="mr-h"><b>03:12 · НЕ ОТПРАВЛЯЙ</b><span>Удерживай «удалить». Закрывай искушения ✕. Не трогай «отправить».</span></div>
   <div class="mr-d" id="mr-d"></div><div class="tbar"><i id="mr-t"></i></div>
   <div class="mr-b"><button class="mb hold" id="mr-del">🗑 УДЕРЖИВАЙ, ЧТОБЫ УДАЛИТЬ<i id="mr-hp"></i></button><button class="mb hot" id="mr-send">ОТПРАВИТЬ ➤</button></div><div id="mr-pops"></div></div>`
      );
      let di = 0;
      const dIv = setInterval(() => {
        if (di < draft.length) {
          di += 2;
          $('#mr-d').textContent = draft.slice(0, di) + '▌';
        }
      }, 60);
      const fin = ok => {
        if (done) return;
        done = 1;
        clearInterval(iv);
        clearInterval(dIv);
        G.flags.resisted = ok ? 1 : 0;
        applyFx(ok ? { self: 1, grow: 1, dep: -1 } : { cringe: 2, dep: 1, self: -1 });
        sfx(ok ? 'win' : 'fail');
        $('#mr-d').textContent = ok
          ? 'Черновик удалён. Пустое поле. Тишина. Красота.'
          : 'Черновик не удалился. Палец сам открыл чат…';
        setTimeout(() => {
          miniClose();
          res();
        }, 1600);
      };
      const del = $('#mr-del');
      del.onpointerdown = e => {
        e.stopPropagation();
        holding = 1;
      };
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev =>
        del.addEventListener(ev, () => (holding = 0))
      );
      del.onclick = e => e.stopPropagation();
      MG.key = e => {
        if (e.key === ' ') {
          e.preventDefault();
          holding = e.type !== 'keyup';
        }
      };
      document.addEventListener('keyup', function ku(e) {
        if (e.key === ' ') holding = 0;
        if (done) document.removeEventListener('keyup', ku);
      });
      const send = $('#mr-send');
      send.onclick = e => {
        e.stopPropagation();
        fin(0);
      };
      m.onmousemove = e => {
        const b = send.getBoundingClientRect(),
          dx = e.clientX - (b.left + b.width / 2),
          dy = e.clientY - (b.top + b.height / 2);
        const d = Math.hypot(dx, dy);
        if (d < 260 && d > 30) {
          send.style.transform = `translate(${dx * 0.18}px,${dy * 0.18}px)`;
        }
      };
      const spawn = () => {
        const p = document.createElement('div');
        p.className = 'tp';
        p.style.left = 5 + Math.random() * 60 + '%';
        p.style.top = 10 + Math.random() * 55 + '%';
        p.innerHTML = `<span>${temps[ti++ % temps.length]}</span><button>✕</button>`;
        p.querySelector('button').onclick = e => {
          e.stopPropagation();
          sfx('click');
          p.remove();
          pops = pops.filter(x => x !== p);
        };
        p.onclick = e => e.stopPropagation();
        $('#mr-pops').appendChild(p);
        pops.push(p);
        sfx('notif');
        if (pops.length >= 5) {
          fin(0);
        }
      };
      let acc = 0;
      const rate = Math.max(1.05, 1.9 - G.st.dep * 0.08);
      const iv = setInterval(() => {
        if (done) return;
        left -= 0.05;
        acc += 0.05;
        $('#mr-t').style.width = clamp((left / 13) * 100, 0, 100) + '%';
        if (acc > rate) {
          acc = 0;
          spawn();
        }
        if (holding && !pops.length) {
          hold += 0.05;
          del.classList.add('on');
        } else del.classList.remove('on');
        $('#mr-hp').style.width = clamp((hold / need) * 100, 0, 100) + '%';
        if (hold >= need) fin(1);
        if (left <= 0) fin(0);
      }, 50);
    });
  }
};

'use strict';
// ================= СВОБОДНЫЕ СООБЩЕНИЯ + ЖИГУЛИ =================
function analyze(t) {
  const s = t.toLowerCase().replace(/ё/g, 'е'),
    has = re => re.test(s);
  const f = {
    t: s,
    len: t.trim().length,
    br: (t.match(/\)/g) || []).length,
    ex: (t.match(/!/g) || []).length,
    q: /\?/.test(t),
    emo: (t.match(/\p{Extended_Pictographic}/gu) || []).length
  };
  f.love = has(
    /любл|нравишь|влюб|чувств|скуча|солнц|зай|малыш|красив|прекрасн|милая|миленьк|❤|💕|😍|🥺|💘|💗|обожа|поцел|свидан|моя (девочк|принцесс)/
  );
  f.sorry = has(/прост(и|ите)\b|извин|сорри|сорян|виноват/);
  f.needy = has(
    /почему (ты )?не (отвеча|пишешь|пишет)|игнор|ты где|ответь|жду|не спишь|заметила|скучала|обижаешься|не нужен|что (со мной )?не так|чем я хуже|какой (у тебя )?тип|дай (мне )?шанс|изменюсь/
  );
  f.help = has(
    /помо(чь|гу|щь)|скину|сделаю|реш(у|ил|ить)|объясн|подскаж|займу|куплю|привезу|загружу/
  );
  f.ask = has(
    /как (ты|дела|жизнь|сама|прошл|настроени)|че как|чо как|что делаешь|чем занята|как оно/
  );
  f.joke = has(/ахах|хаха|хах|лол|ржу|😂|💀|🤣|кек|ору|угар/);
  f.mat = has(/бля|пизд|нахуй|хуй|ебан|еба|ебу|сука/);
  f.bound = has(
    /я пас|не надо|не нужно|удачи|все ок|все норм|не хочу|нет,? спасибо|без меня|не парься|без обид|все нормально|давай без|я понял|понимаю|мне это не|занят|в другой раз/
  );
  f.advice = has(/что (мне )?делать|помоги|совет|подскажи|как быть/);
  f.cold = f.len <= 7 || has(/^(ок|окей|ясно|понял|норм|ага|угу|да|нет|хз)[.!)]*$/);
  f.long = f.len > 150;
  f.huge = f.len > 300;
  return f;
}
const WTAG = {
  huge: '📏 простыня',
  love: '💗 палишься',
  needy: '🔗 навязчиво',
  bound: '🛡 с достоинством',
  topic: '🎯 по делу',
  joke: '😂 с юмором',
  ask: '🙂 интерес',
  cold: '🧊 сухо',
  neutral: '😐 нейтрально',
  advice: '🧭 просишь совета',
  good: '🪞 мудро',
  bad: '🔥 жёстко',
  nyu: '🙃 опять про неё',
  empty: '🤐 не отправил'
};
const NUFX = {
  huge: { cringe: 2, dep: 1, kom: -1 },
  love: { cringe: 2, ideal: 1, kom: -1 },
  needy: { dep: 2, self: -1, kom: -1 },
  bound: { self: 1, grow: 1 },
  topic: { kom: 1 },
  joke: { kom: 1 },
  ask: { dep: 1 },
  cold: { self: 1 },
  neutral: {}
};
const pick = a => a[Math.floor(Math.random() * a.length)];
// контексты: who — кто отвечает, kw — «по делу», order — приоритет категорий, r — ответы
const WR = {
  san1: {
    who: 'Санёк',
    ph: 'Ответь Саньку как хочешь…',
    hint: [
      'да видел, всё норм',
      'бро, я кажется реально влюбился',
      'а у тебя с Кристиной как?',
      'иди нахуй со своим спотиком 😂'
    ],
    kw: /кристин/,
    order: ['huge', 'love', 'topic', 'advice', 'joke', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 1 },
      love: { ideal: 1, dep: 1 },
      topic: { rep: 1 },
      advice: { grow: 1, rep: 1 },
      joke: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: {
      huge: [['бро ты мне поэму прислал', 'короче. если она сама не пишет — нахуй она нужна. всё']],
      love: [
        [
          'бро. БРО.',
          'нахуй тебе оно надо?',
          'вот у меня отношения с кристиной и бля......',
          'и бля......',
          'короче. если она сама не инициирует контакт — нахуй она нужна'
        ]
      ],
      topic: [
        [
          'ой не начинай',
          'кристина обиделась, что я лайкнул мем с какой-то тёлкой',
          'и бля......',
          'я заебался честно'
        ]
      ],
      advice: [
        ['совет бесплатный, в отличие от спотика:', 'перестань писать первым. посмотри, что будет']
      ],
      joke: [
        ['ахахах', 'мой спотик кормит меня, а твоя любовь тебя только ест 😂', 'вечером созвон']
      ],
      cold: [['понятно, страдаешь молча', 'классика']],
      neutral: [
        [
          'ну смотри',
          'правило одно: пишет первой — общаемся. не пишет — нахуй тебе оно надо',
          'поверь мне. у меня вот кристина. и бля......'
        ]
      ]
    }
  },
  nu_para: {
    who: 'Нюрка',
    ph: 'Ответь ей…',
    hint: ['ко второй', 'к первой, а что?', 'для тебя хоть к нулевой 😏', 'не знаю, как проснусь'],
    kw: /\d|перв|втор|трет|четв|нулев|к пар|еду|уже|не знаю|как проснусь|опоздаю/,
    order: ['huge', 'love', 'needy', 'topic', 'joke', 'ask', 'cold', 'neutral'],
    r: {
      huge: [['руслан, я просто спросила к какой паре 😅', 'купишь воды по дороге? 🙏']],
      love: [['ахах… ну ок)', 'а купишь воды по дороге? 🙏']],
      needy: [['эм. нет, всё нормально', 'просто хотела попросить воды купить 🙏']],
      topic: [['окей)', 'а купишь воды по дороге? 🙏', 'пожалуйста-пожалуйста']],
      joke: [['ахахах руслан', 'ладно, слушай, купишь воды по дороге? 🙏']],
      ask: [['да просто)', 'купишь воды по дороге? 🙏']],
      cold: [['ок', 'а воды купишь? 🙏']],
      neutral: [['поняла)', 'купишь воды по дороге? 🙏']]
    }
  },
  nu_hw: {
    who: 'Нюрка',
    ph: 'Как начнёшь разговор? Про домашку до пятницы — или издалека…',
    hint: [
      'чё как жизнь?',
      'ань, ты знала, что эконометрику до пятницы сдавать?',
      'я сделал домашку, могу скинуть',
      'привет) скучал по нашим разговорам'
    ],
    kw: /эконом|домашк|задан|задач|пятниц|дедлайн|сдо|файл|сдать/,
    order: ['huge', 'love', 'needy', 'topic', 'ask', 'joke', 'cold', 'neutral'],
    r: {
      huge: [['руслан, я не поняла, что случилось 😅', 'а, домашка? блин, я вообще не знала']],
      love: [['ахах, привет)', 'а что такое?']],
      needy: [['привет. всё нормально, просто занята была', 'а что такое?']],
      topic: [['ой бля', 'я вообще не знала 😭', 'скинешь посмотреть?']],
      ask: [['норм) а ты?']],
      joke: [['ахахаха', 'привет) что такое?']],
      cold: [['?']],
      neutral: [['привет)', 'что такое?']]
    }
  },
  san_kris: {
    who: 'Санёк',
    ph: 'Дай Саньку совет про Кристину…',
    hint: [
      'поговори с ней спокойно, без наездов',
      'да бросай её нахуй',
      'купи цветы и приезжай',
      'а я тут Нюрке домашку сделал...'
    ],
    kw: /кристин/,
    order: ['huge', 'nyu', 'good', 'bad', 'joke', 'cold', 'neutral'],
    test: {
      nyu: f => /нюрк|аня|аню|ане\b|стат/.test(f.t),
      good: f =>
        /поговор|спокойн|честн|скажи ей|выслуша|извин|обним|цвет|приед|сходите|не ори/.test(f.t),
      bad: f => /брос|нахуй|игнор|забей|похуй|расстан|кинь/.test(f.t)
    },
    fx: {
      huge: { rep: 1 },
      nyu: { dep: 1, ideal: 1 },
      good: { grow: 1, rep: 1 },
      bad: { self: 1, rep: 1 },
      joke: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: {
      huge: [['бро ты мне трактат написал', 'но спасибо, я понял, что ты за меня']],
      nyu: [['мы сейчас про кристину, не съезжай 😂', 'и да. ты ей опять что-то сделал? рус…']],
      good: [
        [
          'хм. звучит разумно',
          'хотя… и бля...... ладно, попробую',
          'а сам-то ты так можешь? сапожник без сапог'
        ]
      ],
      bad: [['ахахах', 'ты мне мои же слова возвращаешь', 'жёстко. но справедливо']],
      joke: [['ахаха', 'толку от тебя ноль, но угарно']],
      cold: [['спасибо, очень помог 🙃']],
      neutral: [['ну спасибо, бро', 'наверное']]
    }
  },
  nu_clear: {
    who: 'Нюрка',
    ph: 'Ты знаешь, что она сказала Лере. Напишешь ей?',
    hint: [
      'ань, всё ок. я всё понял, без обид',
      'почему я не твой тип?',
      'я просто хотел быть ближе...',
      'ахах ну я хотя бы красивый друг'
    ],
    skip: 'Не писать ничего',
    order: ['huge', 'needy', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 2, dep: 1 },
      needy: { dep: 2, self: -2 },
      love: { ideal: 1, dep: 1, self: -1 },
      bound: { self: 2, grow: 2, kom: 1 },
      joke: { self: 1, kom: 1, grow: 1 },
      ask: {},
      cold: { self: 1 },
      neutral: {}
    },
    r: {
      huge: [['руслан…', 'давай лучше лично как-нибудь. так сложно']],
      needy: [['руслан, дело не в тебе', 'просто… ну не в этом смысле', 'давай не будем, ладно?']],
      love: [['руслан…', 'я не хочу, чтобы ты надеялся. прости']],
      bound: [['руслан, спасибо. правда', 'давай нормально общаться, ладно?)']],
      joke: [['ахахах', 'ты как всегда)', 'всё нормально, правда?']],
      ask: [['норм) а ты?']],
      cold: [['?']],
      neutral: [['мм, окей)']]
    }
  },
  nu_night: {
    who: 'Нюрка',
    ph: '3:13. Чат открыт. Пиши что хочешь — или закрой.',
    hint: [
      'не спишь?',
      'ань, я не могу так больше',
      'просто хотел сказать, что ты классная',
      'спокойной ночи)'
    ],
    skip: 'Закрыть чат',
    order: ['huge', 'needy', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 3, dep: 2, self: -1 },
      needy: { dep: 2, self: -2, cringe: 1 },
      love: { cringe: 2, ideal: 1, dep: 1 },
      bound: { self: 1 },
      joke: { kom: 1 },
      ask: { dep: 1 },
      cold: {},
      neutral: { dep: 1 }
    },
    r: {
      huge: [['руслан, давай поговорим лично', 'но не так, пожалуйста']],
      needy: [['руслан…', 'давай не ночью, ладно?']],
      love: [['ахах… спасибо)', 'спи давай']],
      bound: [['ахах, и тебе)']],
      joke: [['ахахаха ты чего не спишь']],
      ask: [['уже нет, утро 😅', 'а что?']],
      cold: [['?']],
      neutral: [['доброе)']]
    }
  },
  kn_talk: {
    who: 'Кнаря',
    ph: 'Ответь Кнаре как есть…',
    hint: ['норм', 'хуёво, если честно', 'я всё ещё её люблю', 'ахах, норм, долму хочу'],
    order: ['huge', 'love', 'bound', 'joke', 'advice', 'cold', 'neutral'],
    test: { bound: f => /понял|отпускаю|переживу|норм уже|легче|справлюсь|всё будет/.test(f.t) },
    fx: {
      huge: { grow: 1, rep: 1 },
      love: { ideal: 1, rep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      joke: { rep: 1, self: 1 },
      advice: { grow: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1, grow: 1 }
    },
    r: {
      huge: [
        [
          'вай, руслан. это не сообщение, это сериал на россии-1',
          'ладно. завтра кофе, я угощаю, и ты мне всё рассказываешь лично'
        ]
      ],
      love: [
        [
          'руслан-джан…',
          'любить — не стыдно. стыдно себя не уважать',
          'завтра кофе. я угощаю. без возражений'
        ]
      ],
      bound: [['вот это мой брат 🫡', 'горжусь. завтра кофе']],
      joke: [['АХАХАХ ну вот, живой', 'бабушка передаёт долму. серьёзно, завтра принесу']],
      advice: [
        [
          'совет: два дня не смотришь её сторис. потом мне отчитываешься',
          'я проверю. у меня шпионы на всём потоке'
        ]
      ],
      cold: [
        [
          'руслан, не надо мне «норм»',
          'я армянка, я чувствую враньё через три корпуса',
          'завтра кофе. и правду'
        ]
      ],
      neutral: [['понятно', 'короче, завтра кофе, я угощаю. и не спорь']]
    }
  },
  nu_eve: {
    who: 'Нюрка',
    ph: 'Она сама написала. Просто так. Что ответишь?',
    hint: [
      'ахах спасибо, ты тоже была огонь',
      'это всё Колян',
      'может как-нибудь повторим? вдвоём',
      'ты сегодня очень красивая была'
    ],
    kw: /спасиб|тоже|классн|круто|весел|рад|огонь|колян|ласточк/,
    order: ['huge', 'love', 'needy', 'topic', 'joke', 'ask', 'cold', 'neutral'],
    test: { love: f => f.love || /вдвоем|вдвоём|свидан|погуля(ем|ть) вдвоем/.test(f.t) },
    fx: {
      huge: { cringe: 2, dep: 1 },
      love: { ideal: 2, dep: 1, cringe: 1 },
      needy: { dep: 2, self: -1 },
      topic: { kom: 1, self: 1 },
      joke: { kom: 1, rep: 1 },
      ask: { dep: 1 },
      cold: { self: 1, kom: -1 },
      neutral: { kom: 1 }
    },
    r: {
      huge: [['ахах… спасибо)', 'спокойной ночи!']],
      love: [['ахах', 'ну… может как-нибудь все вместе)', 'спокойной!']],
      needy: [['эм… всё нормально, руслан)', 'спокойной ночи']],
      topic: [['😂🫶🏻', 'колян вообще лучший']],
      joke: [['АХАХАХА', 'ласточка — это святое 😂']],
      ask: [['норм) устала жесть', 'спокойной!']],
      cold: [['ок)']],
      neutral: [['🫶🏻']]
    }
  },
  kn_whine: {
    who: 'Кнаря',
    counter: 'whineKn',
    ph: 'Поной Кнаре. Она выдержит. Наверное.',
    hint: [
      'она опять написала только по делу',
      'кнар, я всё понял, отпускаю',
      'а вдруг она просто стесняется?',
      'кнаря, ахах, принеси долму'
    ],
    order: ['huge', 'bound', 'joke', 'love', 'needy', 'advice', 'cold', 'neutral'],
    test: {
      bound: f => /понял|отпуска|переживу|норм уже|легче|справлюсь|все будет|хватит|забил/.test(f.t)
    },
    fx: {
      huge: { rep: 1, ideal: 1 },
      love: { rep: 1, ideal: 1 },
      needy: { rep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      joke: { rep: 1, self: 1 },
      advice: { grow: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    after: () => {
      G.flags.kn = (G.flags.kn || 0) + 1;
    },
    r: (c, n) => {
      if (c === 'bound') return ['вот это мой брат 🫡', 'горжусь. завтра кофе за мой счёт'];
      if (c === 'joke') return ['АХАХАХ', 'ну вот, живой. бабушка передаёт долму, завтра принесу'];
      if (c === 'advice')
        return [
          'совет: два дня не смотришь её сторис',
          'потом отчитываешься мне. у меня шпионы на всём потоке'
        ];
      return [
        [
          'ой, руслан-джан… держись, я с тобой 💪',
          'она слепая, если не видит. но и ты не дави, ладно?'
        ],
        ['так. это уже второй раз', 'я начинаю вести протокол 📋'],
        [
          'руслан. я тебя люблю как брата',
          'но если ты ещё раз скажешь «а вдруг», я приеду и заберу у тебя телефон'
        ],
        [
          'РУСЛАН. МЫ ЭТО ОБСУЖДАЛИ.',
          'ВОТ ТЕБЕ ДОЛМА 🫑',
          '…ладно, ной. но это последний раз. (нет)'
        ]
      ][Math.min(n, 4) - 1];
    }
  },
  san_whine: {
    who: 'Санёк',
    counter: 'whineSan',
    ph: 'Поной Саньку. Он предупреждал.',
    hint: [
      'сань, она опять не пишет',
      'бро, ты был прав',
      'а может написать ей первым?',
      'как там кристина?'
    ],
    order: ['huge', 'bound', 'topic', 'joke', 'love', 'needy', 'advice', 'cold', 'neutral'],
    kw: /кристин/,
    test: { bound: f => /прав|понял|нахуй|похуй|забил|хватит/.test(f.t) },
    fx: {
      huge: { rep: 1, ideal: 1 },
      love: { rep: 1, ideal: 1 },
      needy: { rep: 1, dep: 1 },
      bound: { self: 1, grow: 1, rep: 1 },
      topic: { rep: 1 },
      joke: { rep: 1 },
      advice: { rep: 1 },
      cold: {},
      neutral: { rep: 1 }
    },
    r: (c, n) => {
      if (c === 'bound')
        return [
          'НУ НАКОНЕЦ-ТО',
          'я с мая это говорю. с мая, рус',
          'празднуем: дарю тебе месяц спотифая бесплатно 🎧'
        ];
      if (c === 'topic')
        return [
          'ой не начинай',
          'кристина обиделась, что я ей «ок» написал, а не «окей». я заебался',
          'давай лучше ты поной, у тебя хоть проблемы простые'
        ];
      if (c === 'joke') return ['ахаха', 'ты хоть шутишь. значит не всё потеряно'];
      return [
        [
          'бро.',
          'нахуй тебе оно надо?',
          'вот у меня отношения с кристиной и бля......',
          'если она сама не инициирует контакт — нахуй она нужна'
        ],
        [
          'рус, у меня кристина каждый день мозги выносит. и бля......',
          'а у тебя нюрка даже не пишет. радуйся 😂',
          'нахуй тебе оно надо, серьёзно'
        ],
        ['так. я дарю тебе подписку на спотик', 'слушай грустные песни. мне про неё не пиши 😭'],
        [
          'ВСЁ.',
          'я сделал бота. он отвечает тебе вместо меня 🤖',
          '🤖 НахуйОнаНужнаБот: «если она сама не пишет — нахуй она нужна». бот работает 24/7'
        ]
      ][Math.min(n, 4) - 1];
    }
  },
  toast: {
    who: 'Все',
    say: 1,
    sayEmo: 'smile',
    ph: 'Твой тост. Скажи что хочешь — вся туса слушает.',
    hint: [
      'за нас, за группу и за ласточку!',
      'за тех, кто рядом… особенно за одного человека',
      'за Никитоса и его квартиру, пусть хозяйка не узнает',
      'короче, за нас 🥂'
    ],
    order: ['huge', 'needy', 'love', 'joke', 'bound', 'cold', 'neutral'],
    test: {
      needy: f => f.needy || /не ценят|некоторые|кое-кто|не замечают/.test(f.t),
      love: f => f.love || /одного человека|особенно за|за неё/.test(f.t),
      joke: f => f.joke || /ласточк|хозяйк|витек|витёк|колян/.test(f.t),
      bound: f => /за нас|за группу|за друзей|за своих|за всех/.test(f.t)
    },
    fx: {
      huge: { cringe: 1 },
      needy: { dep: 1, cringe: 2, kom: -2 },
      love: { cringe: 2, ideal: 1 },
      joke: { rep: 1, kom: 1, self: 1 },
      bound: { self: 1, rep: 1 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    r: {
      huge: [
        [
          'nar: Тост длился четыре минуты. Огромный Витёк уснул стоя. Денчик открыл вторую бутылку, не дожидаясь конца.',
          'nik.laugh: Рус, это был не тост. Это была курсовая.'
        ]
      ],
      needy: [
        [
          'nar: Тост про то, как «некоторые не ценят тех, кто рядом». Тишина. Кто-то кашлянул. Нюрка вышла на балкон.',
          '@fx crash'
        ]
      ],
      love: [
        [
          'nar: Все поняли, про кого тост. Даже чуваки, которых никто не звал. Нюрка уткнулась в телефон.',
          '@fx cringe',
          'nik: (шёпотом) Бро…'
        ]
      ],
      joke: [
        [
          'nar: Хохот. Владос чуть не уронил телефон. Денчик подавился сидром. Огромный Витёк смеялся так, что затряслась люстра.',
          'nu.laugh: Ахахах, Руслан!',
          'nik.laugh: Вот это тост. Записываю в историю группы.'
        ]
      ],
      bound: [
        [
          'nik.smile: Хороший тост, бро. По-человечески.',
          'nar: Чокнулись. Тепло. Нормально. Иногда нормально — это лучшее, что бывает.'
        ]
      ],
      cold: [
        [
          'nar: Два слова. Все такие: «и всё?» Колян одобрительно кивнул со своим чаем: «Коротко. Уважаю».'
        ]
      ],
      neutral: [['nar: Чокнулись. Выпили. Денчик сказал «хорошо сказал», хотя не слушал.']]
    }
  },
  wedtoast: {
    who: 'Гости',
    say: 1,
    sayEmo: 'smile',
    ph: 'Ты тамада на армянской свадьбе. Скажи тост. Длинно можно — здесь это уважают.',
    hint: [
      'за молодых! пусть кольцо больше никогда не тонет',
      'за любовь, которая взаимная',
      'за семью Кнари — вы лучшие',
      'горько!!!'
    ],
    order: ['huge', 'love', 'joke', 'bound', 'cold', 'neutral'],
    test: {
      joke: f => f.joke || /кольц|тон|волг|дайв|горько/.test(f.t),
      love: f => f.love || /взаимн|любов/.test(f.t),
      bound: f => /семь|родн|кнар|бабушк|мам/.test(f.t)
    },
    fx: {
      huge: { rep: 2, self: 1 },
      love: { grow: 1, rep: 1 },
      joke: { rep: 2, self: 1 },
      bound: { rep: 2 },
      cold: { rep: 1 },
      neutral: { rep: 1 }
    },
    r: {
      huge: [
        [
          'nar: Тост длился семь минут. На армянской свадьбе это значит — уважаемый человек. Бабушка Кнари встала и аплодировала.',
          'kn.laugh: Руслан-джан, ты теперь официально друг нашей семьи!'
        ]
      ],
      love: [
        [
          'nar: «За любовь, которая взаимная». Зал притих. Брат Кнари обнял невесту. Руслан сказал это — и вдруг понял, что ему не больно.',
          'kn.soft: (шёпотом) Руслан… это было красиво.'
        ]
      ],
      joke: [
        [
          'nar: Зал взорвался. Брат Кнари смеялся до слёз, невеста-дайвер — громче всех. Кольцо, кстати, на месте.',
          'kn.laugh: АХАХАХ, РУСЛАН!'
        ]
      ],
      bound: [
        [
          'nar: Мама Кнари прослезилась и поцеловала Руслана в макушку. Это у них высшая похвала.',
          'kn.smile: Всё. Ты попал. Теперь зовём тебя на все семейные праздники — как друга семьи.'
        ]
      ],
      cold: [['nar: «Горько!» — и зал подхватил. Иногда одного слова достаточно.']],
      neutral: [['nar: Гости хлопали. Бабушка Кнари сказала: «Хороший мальчик, кушай».']]
    }
  },
  nu_wed: {
    who: 'Нюрка',
    ph: 'Она выходит замуж и просит тебя быть свидетелем. Что ответишь?',
    hint: [
      'конечно буду',
      'ань, я не смогу, прости',
      'ты уверена, что он тот самый?',
      'ахах, а тамадой не надо?'
    ],
    order: ['huge', 'love', 'needy', 'bound', 'joke', 'cold', 'neutral'],
    test: { bound: f => /не смогу|не буду|прост|нет/.test(f.t) },
    fx: {
      huge: { dep: 1 },
      love: { dep: 1, ideal: 1 },
      needy: { dep: 1, self: -1 },
      bound: { self: 1, grow: 1 },
      joke: { dep: 1 },
      cold: { dep: 1 },
      neutral: { dep: 1 }
    },
    r: {
      huge: [['ахах руслан, я ничего не поняла, но ты лучший друг на свете ❤️']],
      love: [['ты лучший друг на свете ❤️❤️', 'серьёзно, что бы я без тебя делала']],
      needy: [['руслан, он правда хороший', 'ну так что, будешь свидетелем? 🥺']],
      bound: [['ой… жаль(', 'ну приходи хотя бы гостем! ты же мой лучший друг']],
      joke: [['ахахах', 'ну так что, будешь? 🥺', 'ты лучший друг']],
      cold: [['ура!!! ты лучший друг на свете ❤️']],
      neutral: [['ура!!! ты лучший ❤️']]
    }
  },
  nu_unsent: {
    who: 'Нюрка',
    draft: 1,
    ph: 'Напиши ей всё, что хотел сказать за эту осень. Это не отправится. Никогда.',
    hint: [
      'ты мне нравилась с лета',
      'спасибо, что была честной',
      'я бы сделал тебя счастливой',
      'надеюсь, у тебя всё будет хорошо'
    ],
    order: ['huge', 'love', 'bound', 'needy', 'neutral'],
    fx: {
      huge: { ideal: 1 },
      love: { ideal: 1 },
      bound: { grow: 1 },
      needy: { dep: 1 },
      neutral: {}
    },
    r: {}
  },
  nu_late: {
    who: 'Нюрка',
    ph: 'Она сама предлагает погулять. Что ответишь?',
    hint: [
      'не, ань, я пас. удачи тебе',
      'может как-нибудь, сейчас занят',
      'ДА!!! когда??',
      'ахах, а Кнаря в курсе?'
    ],
    order: ['huge', 'love', 'bound', 'joke', 'ask', 'cold', 'neutral'],
    fx: {
      huge: { cringe: 1 },
      love: { dep: 2, ideal: 1 },
      bound: { self: 1 },
      joke: {},
      ask: {},
      cold: { self: 1 },
      neutral: {}
    },
    r: {
      huge: [['ого. ладно)']],
      love: [['ахах, правда?)', 'ну давай в субботу']],
      bound: [['понимаю)', 'жаль. удачи тебе тоже']],
      joke: [['ахаха', 'я вообще-то серьёзно)']],
      ask: [['да просто давно не виделись', 'ты прикольный стал']],
      cold: [['ну ок…']],
      neutral: [['ну ладно)']]
    }
  }
};
function judge(ctx, f) {
  if (!f.len) return 'neutral';
  const T = {
    huge: f => f.huge || (f.long && f.br > 4),
    love: f => f.love,
    needy: f => f.needy,
    bound: f => f.bound,
    topic: f => ctx.kw && ctx.kw.test(f.t),
    joke: f => f.joke,
    ask: f => f.ask || (f.q && f.len < 40),
    cold: f => f.cold,
    advice: f => f.advice,
    neutral: () => true,
    ...(ctx.test || {})
  };
  for (const c of ctx.order) if (T[c] && T[c](f)) return c;
  return 'neutral';
}
MINI.write = key =>
  new Promise(res => {
    const ctx = WR[key];
    if (!G.phone && !ctx.say) {
      G.phone = { n: ctx.who, st: 'в сети', msgs: [] };
      showPhone();
    }
    const m = miniOpen(
      'm-write',
      `<div class="mw pf"><div class="mw-h"><b>НАПИШИ САМ</b><span>${ctx.ph}</span></div><textarea id="mw-in" maxlength="600" placeholder="Пиши как хочешь. Хоть матом."></textarea>
   <div class="mw-meta"><span id="mw-l">0</span><span>подсказки:</span></div><div class="mw-hints">${ctx.hint.map(h => `<button class="chip">${h}</button>`).join('')}</div>
   <div class="mw-b">${ctx.skip ? `<button class="mb" id="mw-skip">${ctx.skip}</button>` : ''}<button class="mb hot" id="mw-send">Отправить ➤</button></div></div>`
    );
    const inp = $('#mw-in');
    setTimeout(() => {
      try {
        inp.focus();
      } catch (e) {}
    }, 50);
    inp.oninput = () => {
      const L = inp.value.length;
      $('#mw-l').textContent =
        L + (L > 300 ? ' · это уже простыня' : L > 150 ? ' · длинновато' : '');
    };
    m.querySelectorAll('.chip').forEach(
      b =>
        (b.onclick = e => {
          e.stopPropagation();
          inp.value = b.textContent;
          inp.oninput();
          sfx('type');
          inp.focus();
        })
    );
    ['click', 'pointerdown'].forEach(ev => m.addEventListener(ev, e => e.stopPropagation()));
    const done = async text => {
      miniClose();
      const f = text ? analyze(text) : null;
      const cat = text ? judge(ctx, f) : 'empty';
      G.flags['w_' + key] = cat;
      if (!text) {
        applyFx(ctx.skipFx || { self: 1, grow: 1 });
        showTags(['empty']);
        await sleep(900);
        res();
        return;
      }
      if (ctx.say) {
        await say('ru', ctx.sayEmo || null, text);
      } else {
        G.phone.msgs.push({ s: ctx.draft ? 'out draft' : 'out', t: text });
        showPhone();
        sfx(ctx.draft ? 'type' : 'send');
        LOG.push({
          w: ctx.draft ? 'Руслан 📝 (не отправлено)' : 'Руслан 📱',
          c: '#ffb347',
          t: text
        });
      }
      const tags = [cat];
      if (f.br >= 4 && cat !== 'huge') tags.push('br');
      if (f.ex >= 4) tags.push('ex');
      if (f.sorry && ctx.who === 'Нюрка') tags.push('sorry');
      if (f.help && ctx.who === 'Нюрка' && cat !== 'topic') tags.push('help');
      if (f.mat && ctx.who === 'Нюрка') tags.push('mat');
      const fx = Object.assign({}, (ctx.fx || NUFX)[cat] || {});
      if (tags.includes('br')) fx.cringe = (fx.cringe || 0) + 1;
      if (tags.includes('ex')) fx.cringe = (fx.cringe || 0) + 1;
      if (tags.includes('sorry')) fx.self = (fx.self || 0) - 1;
      if (tags.includes('help')) fx.dep = (fx.dep || 0) + 1;
      showTags(tags);
      applyFx(fx);
      await sleep(skipping() ? 100 : 1300);
      let n = 0;
      if (ctx.counter) {
        n = G.flags[ctx.counter] = (G.flags[ctx.counter] || 0) + 1;
      }
      const rep =
        typeof ctx.r === 'function' ? ctx.r(cat, n, f) : pick(ctx.r[cat] || ctx.r.neutral);
      if (ctx.say) {
        for (const st of rep) {
          const r2 = execStr(st, RUN);
          if (r2 && r2.then) await r2;
        }
      } else if (!ctx.draft)
        for (const msg of rep) {
          await phoneMsg('in', G.phone.n.includes('ГМУ') ? ctx.who : null, msg);
        }
      if (ctx.after) ctx.after(cat, n);
      res();
    };
    $('#mw-send').onclick = e => {
      e.stopPropagation();
      const v = inp.value.trim();
      if (!v) {
        sfx('fail');
        inp.classList.remove('shk');
        void inp.offsetWidth;
        inp.classList.add('shk');
        return;
      }
      done(v);
    };
    if (ctx.skip)
      $('#mw-skip').onclick = e => {
        e.stopPropagation();
        sfx('click');
        done('');
      };
    MG.key = e => {
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement === inp) {
        e.preventDefault();
        $('#mw-send').click();
      }
    };
  });
const XTAG = {
  br: ')))) скобочный передоз',
  ex: '‼ восклицательный ад',
  sorry: '🙏 извиняешься зря',
  help: '🤝 опять предлагаешь помощь',
  mat: '🤬 с матом (она поймёт)'
};
function showTags(tags) {
  const box = document.createElement('div');
  box.className = 'wtags';
  box.innerHTML =
    '<small>РАЗБОР СООБЩЕНИЯ</small>' +
    tags.map(t => `<span>${WTAG[t] || XTAG[t] || t}</span>`).join('');
  $('#fx').appendChild(box);
  setTimeout(() => box.remove(), 2600);
}

// ---- Жигули: Борский мост ----
MINI.drive = () =>
  new Promise(res => {
    G.chars = {};
    G.speaker = null;
    const m = (MG.road = { d: 0, cx: 1, obs: [], hit: 0, pits: 0, msgs: 0, bolts: 0 });
    let left = 18,
      done = 0,
      sp = 1.6,
      acc = 0;
    const box = miniOpen(
      'm-drive',
      `<div class="md-top pf"><b>ЖИГУЛИ · БОРСКИЙ МОСТ</b><span>← → / тап по краям · объезжай ямы, не читай её сторис 💬, лови вайб ⚡</span><div class="tbar"><i id="md-t"></i></div><div class="md-s" id="md-s">⚡ 0 · 🕳 0 · 💬 0</div></div><div class="md-msg pf" id="md-msg">Колян: «Погнали. Аккуратно — она занижена. Каждая яма мне прямо в сердце. Тихо, но в сердце»</div>
   <button class="md-l" id="md-l">◀</button><button class="md-r" id="md-r">▶</button>`
    );
    box.style.pointerEvents = 'none';
    box.querySelectorAll('.pf,.md-l,.md-r').forEach(x => (x.style.pointerEvents = 'auto'));
    const say = t => {
      $('#md-msg').textContent = t;
    };
    const mv = d => {
      m.cx = clamp(m.cx + d, 0, 2);
      sfx('hover');
    };
    $('#md-l').onclick = e => {
      e.stopPropagation();
      mv(-1);
    };
    $('#md-r').onclick = e => {
      e.stopPropagation();
      mv(1);
    };
    MG.key = e => {
      if (['ArrowLeft', 'a', 'ф', 'A'].includes(e.key)) mv(-1);
      else if (['ArrowRight', 'd', 'в', 'D'].includes(e.key)) mv(1);
    };
    const iv = setInterval(() => {
      if (done) return;
      left -= 0.04;
      sp += 0.0025;
      m.d += sp;
      acc += sp;
      $('#md-t').style.width = clamp((left / 18) * 100, 0, 100) + '%';
      if (acc > 34) {
        acc = 0;
        const r = Math.random();
        const k = r < 0.5 ? 'pit' : r < 0.75 ? 'msg' : 'bolt';
        m.obs.push({ l: Math.floor(Math.random() * 3), y: -10, k });
      }
      for (const o of m.obs) o.y += sp;
      for (const o of m.obs) {
        if (!o.done && o.y > 134 && o.y < 158 && o.l === m.cx) {
          o.done = 1;
          if (o.k === 'pit') {
            m.pits++;
            m.hit = T;
            sfx('crash');
            shake('shk');
            say(
              pick([
                'Колян (спокойно): «Это была яма. Ласточка всё запомнила»',
                'Колян: «Подвеска сказала «ой». Я тоже»',
                'Колян: «Ласточка, прости его. Он влюблённый, он не видит дорогу»'
              ])
            );
          } else if (o.k === 'msg') {
            m.msgs++;
            sfx('notif');
            say(
              pick([
                'Ты открыл её сторис за рулём. Колян молча забрал телефон и положил в бардачок.',
                'Её сторис: фотка кофе. Ты посмотрел три раза. Колян: «Кофе как кофе, бро»',
                'Колян: «Ещё раз полезешь в телефон — пойдёшь пешком. Я не злюсь. Просто пешком»'
              ])
            );
          } else {
            m.bolts++;
            sfx('pop');
            say(
              pick([
                'Колян врубил музло на всю. Вайб ⚡',
                'Никитос в беседе: «пацаны, вы где? я с вами!» ⚡',
                'Колян: «Вот. Это — жизнь» ⚡'
              ])
            );
          }
          $('#md-s').textContent = `⚡ ${m.bolts} · 🕳 ${m.pits} · 💬 ${m.msgs}`;
        }
      }
      m.obs = m.obs.filter(o => o.y < H + 20);
      if (left <= 0) fin();
    }, 16);
    const fin = () => {
      if (done) return;
      done = 1;
      clearInterval(iv);
      const fx = { rep: m.bolts >= 4 ? 2 : 1 };
      if (m.msgs) fx.dep = Math.min(2, m.msgs);
      if (m.msgs === 0) fx.grow = 1;
      if (m.pits >= 3) fx.cringe = 1;
      G.flags.drive = m.bolts - m.msgs;
      applyFx(fx);
      say(
        m.msgs === 0
          ? 'Ни разу не залез в её сторис. Колян: «Красава. Вот так и живи».'
          : m.pits >= 3
            ? 'Колян: «Ласточка выжила. Твоя репутация водителя — нет».'
            : 'Доехали. Колян довольный, ласточка живая.'
      );
      sfx('win');
      setTimeout(() => {
        MG.road = null;
        miniClose();
        res();
      }, 1800);
    };
  });

// ---- бутылочка ----
MINI.bottle = target =>
  new Promise(res => {
    const names = [
      'Руслан',
      'Нюрка',
      'Никитос',
      'Денчик',
      'Владос',
      'Огромный Витёк',
      'Кирилл',
      'какой-то чувак'
    ];
    const ti = Math.max(0, names.indexOf(target));
    const box = miniOpen(
      'm-bottle',
      `<div class="mb2 pf"><b>БУТЫЛОЧКА</b><span>Жми, чтобы остановить. Бутылка, кажется, читала сценарий.</span><div class="bt-ring" id="bt-r">${names.map((n, i) => `<i style="--a:${(i * 360) / names.length}deg">${n}</i>`).join('')}<div class="bt-b" id="bt-b">🍾</div></div><button class="mb hot big" id="bt-go">СТОП</button></div>`
    );
    let ang = 0,
      v = 14,
      stopping = 0,
      t0 = 0,
      a0 = 0,
      a1 = 0,
      done = 0;
    const el = $('#bt-b');
    const loop = ts => {
      if (done) return;
      if (!stopping) {
        ang += v;
      } else {
        const k = Math.min(1, (ts - t0) / 2200),
          e = 1 - Math.pow(1 - k, 3);
        ang = a0 + (a1 - a0) * e;
        if (k >= 1) {
          done = 1;
          sfx('pop');
          box.querySelectorAll('.bt-ring i')[ti].classList.add('on');
          G.flags.bottle = target;
          setTimeout(() => {
            miniClose();
            res();
          }, 1200);
        }
      }
      el.style.transform = `translate(-50%,-50%) rotate(${ang}deg)`;
      if (((ang / 30) | 0) !== (((ang - v) / 30) | 0) && !stopping) sfx('hover');
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    const go = e => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (stopping) return;
      stopping = 1;
      t0 = performance.now();
      a0 = ang;
      const tgt = (ti * 360) / names.length;
      let base = Math.ceil((ang + 720 - tgt) / 360) * 360 + tgt;
      a1 = base;
      $('#bt-go').disabled = true;
    };
    $('#bt-go').onclick = go;
    MG.key = e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        go();
      }
    };
  });

'use strict';
// ================= SCRIPT v3: Нижний Новгород =================
const SCN = {
  start: [
    '@chapter 0',
    '@mus campus',
    '@bg niu day',
    '@title ПРОЛОГ|Первое сентября',
    '@cg cg_niu|Нижний Новгород · проспект Гагарина · РАНХиГС НИУ',
    'nar: Нижний Новгород. Проспект Гагарина. Нижегородский институт управления: зелёное здание с белыми колоннами, где из людей делают управленцев.',
    'nar: А из Руслана этой осенью сделают человека, который знает про френдзону всё.',
    '@cgoff',
    '@show ru neutral c',
    'nar: За лето Руслан успел закрыть сессию, отправить одной девушке примерно сто кружков и влюбиться. Последнее — не по плану.',
    'in: Летом она написала «с сентября сидим вместе». Бро. Это почти помолвка.',
    'ru.hope: Новый семестр. Всё будет по-другому.',
    '@sfx car',
    '@bg niu day car',
    '@show ru shock l',
    '@show kol laugh r',
    'kol.smile: О, Руслан. Зацени. Шестёрка. Белая. Салон — красная кожа. Диски — хром. Занижена. Сам с Бора пригнал.',
    'nar: Он говорит это так спокойно, будто показывает не машину мечты, а батон из «Пятёрочки». Но глаза светятся.',
    '@cg cg_zhiga|Ласточка · ВАЗ-2106 · Колян не дышит',
    'ru: Колян… она дымит.',
    'kol.smug: Не дымит. Дышит. Все деньги отдал и у бати занял. Два раза глохла на мосту. Я не нервничал. Она просто думала.',
    '@cgoff',
    'kol: Чё лицо такое? Опять Нюрка?',
    {
      c: [
        {
          t: '«Да не, просто не выспался»',
          fx: { self: 1 },
          then: [
            'ru: Да не. Просто не выспался.',
            'kol.smug: Ага. Потому что до трёх ночи смотрел, когда она была в сети.',
            'ru.shock: Откуда ты…',
            'kol: Я тебя год знаю, бро.'
          ]
        },
        {
          t: '«Колян, она написала «с сентября сидим вместе»…»',
          fx: { ideal: 1, rep: 1 },
          then: [
            'ru.love: Колян. Она летом написала «с сентября сидим вместе».',
            'kol: И чё?',
            'ru.love: Ну… это же знак.',
            'kol: Бро. Это не знак. Это рассадка.'
          ]
        },
        {
          t: '«Давай лучше про машину»',
          fx: { rep: 1 },
          then: [
            'ru.smile: Давай лучше про машину. Сколько она жрёт?',
            'kol.smile: Десять литров. Но ты послушай звук.',
            '@sfx car',
            'nar: Звук был такой, будто трактор пытается спеть Шуфутинского.'
          ]
        }
      ]
    },
    '@show nik smile c',
    'nik: Так, пацаны, доброе. Расписание скинул в беседу. Первая пара — Ломовцева. Ло-мов-це-ва. Не опаздываем. Колян, ты машину опять на газоне поставил.',
    'kol: Это не газон, это парковка для своих.',
    'nik: Руслан, ну чё, как лето? Видел твои кружки в сторис. Ну, понятно, для кого.',
    'ru.nerv: Да это так, по-дружески.',
    'nik.smile: Да норм она. Общайся, пробуй. Чё ты теряешь? Мы со Светой тоже не с первого раза сошлись.',
    'kol: Никитос, не поощряй. Он и так поощрённый.',
    'nik: Колян, у тебя девушка — шестёрка. Не тебе советовать.',
    'kol.laugh: Зато она меня не френдзонит!',
    '@hide kol',
    '@show kn laugh r',
    'kn.laugh: Ахпер, вы чё тут стоите, как на похоронах? Пара через пять минут! Колян, джан, это что за свадебный кортеж моей тёти?',
    'kn: Руслан. Ты чего такой загадочный? Опять про Нюрку думаешь? По лицу вижу.',
    'ru.nerv: Да почему все про Нюрку?!',
    'kn.smug: Потому что у тебя на лбу написано «Нюрка». Капслоком. С тремя сердечками.',
    'nar: Из-за колонны молча кивнул Огромный Витёк. Колонна рядом с ним выглядела маленькой. Вика и Вика помахали синхронно. Владос что-то снимал. Денчик и Кирилл спорили за заднюю парту. Софа и Лиза обсуждали маникюр. Группа в сборе.',
    '@hide kn',
    '@show kol smile r',
    {
      h: 'КАКОЙ У РУСЛАНА ПЛАН НА СЕМЕСТР?',
      c: [
        {
          t: '«В этом семестре я её добьюсь»',
          fx: { ideal: 1, dep: 1 },
          then: [
            'ru.smug: В этом семестре я её добьюсь. Всё. Решено.',
            'nik.smile: Вот это настрой!',
            'kol: Вот это диагноз.'
          ]
        },
        {
          t: '«Посмотрим, как пойдёт. Без фанатизма»',
          fx: { self: 1, grow: 1 },
          then: [
            'ru: Посмотрим, как пойдёт. Без фанатизма.',
            'nik: Мудро.',
            'kol: Ты сам-то в это веришь?',
            'in: Нет.'
          ]
        },
        {
          t: '«Пацаны, если я начну тупить — бейте»',
          fx: { rep: 2 },
          then: [
            'ru.smile: Пацаны. Если я начну тупить — бейте меня.',
            'kol.laugh: С удовольствием. Начать прямо сейчас?',
            'nik: Договорились. Бить буду я, Колян бьёт слишком честно.'
          ]
        }
      ]
    },
    '@hideall',
    '@mus night',
    '@bg room night',
    'nar: Вечер. FaceTime. Санёк — друг ещё со школы. Учится в Лобачевском, живёт в Маршал Граде, продаёт подписки на Спотифай через своего бота. И встречается с Кристиной. Они ссорятся примерно как дышат. Любимая фраза Санька — «нахуй тебе оно надо». Вторая любимая — «вот у меня с Кристиной… и бля……».',
    '@cg cg_san|Санёк · Маршал Град · бизнесмен',
    'san: Ну чё, Рус, первое сентября. Видел её?',
    'ru: Видел.',
    'san: И?',
    'ru: Ну… она поздоровалась.',
    'san: Бро. Я тебе с мая говорю. Если она сама не инициирует контакт — нахуй она нужна?',
    'san: Нахуй тебе оно надо, Рус? Вот у меня отношения с Кристиной — и бля…… Вчера обиделась, что я лайкнул не ту фотку. Позавчера — что лайкнул ту. И бля……',
    'san: Я вот сегодня за утро продал через бота четырнадцать подписок. Пассивный доход. А ты пассивно страдаешь.',
    'san: Ладно, у меня Кристина на второй линии, опять что-то случилось. Напиши потом.',
    '@cgoff',
    '@show ru neutral l',
    '@phone Санёк|в сети',
    '< ну чё, рассказывай нормально. как она?',
    'nar: Тут ты пишешь сам. Как хочешь, хоть матом. Игра разберёт, что ты написал, и тебе ответят по-разному.',
    { write: 'san1' },
    '@phoneoff',
    '@show ru think l',
    'nar: Перед сном — уведомление.',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini biz',
    '< руслан, займи пожалуйста нам с девочками парту завтра, мы опаздываем 🙏',
    'in: Она написала ПЕРВОЙ. Ты видишь? Первой!',
    'nar: Внутренний голос не видит слово «займи». Внутренний голос вообще мало что видит.',
    {
      c: [
        {
          t: '«Займу)»',
          fx: { dep: 1, kom: 1 },
          set: 'seat',
          then: ['> займу)', '< ты лучший 🫶🏻', 'in: «Ты лучший». Записываем.']
        },
        {
          t: '«Займу. Но с тебя рассказ, как лето прошло»',
          fx: { kom: 1, cringe: 1 },
          set: 'seat',
          then: [
            '> займу. но с тебя рассказ, как лето прошло',
            '< ахаха ок',
            'nar: Рассказа не будет. Но «ок» он перечитал четыре раза.'
          ]
        },
        {
          t: '«Сорян, завтра с пацанами сижу»',
          fx: { self: 2, kom: -1, grow: 1 },
          then: [
            '> сорян, завтра с пацанами сижу. попроси никитоса, он староста)',
            '< а, ок',
            'in: Ты что наделал. ТЫ ЧТО НАДЕЛАЛ.',
            'nar: Он сделал нормальную вещь. Внутренний голос просто не привык.'
          ]
        }
      ]
    },
    '@phoneoff',
    '@goto ch1'
  ],

  ch1: [
    '@chapter 1',
    '@mus campus',
    '@bg lecture',
    '@title ГЛАВА 1|Кто напишет первым',
    'nar: Сентябрь. Руслан начинает вести статистику. Не по учёбе. Кто кому пишет первым.',
    'nar: Счётчик «📩 Она первой» — внизу под статами. Следи за ним. Руслан следит.',
    {
      if: s => s.flags.seat,
      then: [
        '@show nu smile r',
        '@show ru hope l',
        'nu.smile: О, спасибо, что занял!',
        'nar: Она села. С девочками. На парту, которую он занял. А он — через проход. «Сидим вместе» летом и «сидим вместе» в сентябре — разные вещи.'
      ],
      else: [
        '@show nik smile r',
        '@show ru smile l',
        'nik: Садись к нам. Девочкам я занял, работа старосты.',
        '@show kn smile c',
        'kn: Руслан, не смотри туда каждые пять секунд. Шея отвалится, а мне потом одной конспекты писать?',
        'nar: Нюрка сидит через два ряда. Руслан сидит с пацанами и Кнарей. И, что странно, ему нормально.'
      ]
    },
    '@hideall',
    '@show lom smile c',
    '@show nik love rr',
    'lom.smile: Доброе утро, коллеги. Сегодня поговорим о принятии решений. Решение, принятое на эмоциях, обычно обходится дороже, чем кажется.',
    'nar: Никитос смотрит на Ломовцеву так, как Руслан смотрит на Нюрку. Только у Никитоса это взаимно: Ломовцева ставит ему «отлично».',
    'nik.love: (шёпотом) Легенда. Просто легенда.',
    'in: Это она про меня? Это она про меня.',
    'lom: Пример из жизни, кто-нибудь? Только не «взял кредит на айфон».',
    {
      c: [
        {
          t: 'Поднять руку и пошутить',
          fx: { rep: 1, kom: 1, self: 1 },
          then: [
            'ru.smug: Решение на эмоциях — это когда покупаешь шестёрку и вкладываешь в диски ещё две её цены.',
            '@hide nik',
            '@show kol shock rr',
            'kol: …Справедливо.',
            'lom.laugh: Николай, это правда?',
            'kol: Это не решение на эмоциях. Это решение на чувствах. Разные вещи.',
            'nar: Аудитория легла. Денчик упал со стула. Владос снял это на видео. Нюрка смеялась. Не хмыкала — смеялась.',
            '@fx heart',
            'in: Она смеялась. С ТЕБЯ.',
            '@hide kol'
          ]
        },
        {
          t: 'Молчать и смотреть на Нюрку',
          fx: { ideal: 1, dep: 1 },
          then: [
            'nar: Полторы пары Руслан изучал, как она заправляет волосы за ухо. Про принятие решений он узнал ровно ноль. Никитос записал за него. Из жалости.',
            'in: Зато я принял решение. Она — самая красивая в Нижнем.'
          ]
        },
        {
          t: 'Слушать Ломовцеву, как Никитос',
          fx: { self: 1, grow: 1 },
          then: [
            'nar: Руслан слушал. Реально слушал. Оказывается, у Ломовцевой интересно. Никитос посмотрел на него с гордостью, как отец.',
            'nik.smile: Ну наконец-то. Добро пожаловать в клуб.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg corridor',
    '@sfx notif',
    '@phone Группа ГМУ 🔥|28 участников',
    '<<Нюрка: кто-нибудь будет у кофейни на гагарина? раф хочу 🥺',
    '<<Колян: я на бору 😂',
    '<<Огромный Витёк: я у кофейни. но раф я донесу только до своего рта',
    '<<Софа: и мне раф 🙏',
    '<<Лиза: и мне!!',
    '<<Вика: вика пошли с ней',
    '<<Вика: какая из вик?',
    '<<Никитос: у нас через 40 минут Грешнова. опоздаете — она запомнит. навсегда',
    'in: Кофейня — пятнадцать минут туда, пятнадцать обратно. До пары — сорок. Успеваешь.',
    {
      c: [
        {
          t: 'Сорваться в кофейню специально',
          fx: { dep: 2, ideal: 1, kom: 1, cringe: 1 },
          set: 'coffee',
          then: [
            '> я как раз рядом, щас возьму',
            'nar: Он не был рядом. Теперь он бежит по Гагарина с лицом курьера, который влюбился в заказ.',
            '@phoneoff',
            '@bg niu day',
            '@show ru nerv l',
            'nar: Раф. Кокосовый. И круассан — «на всякий».',
            '@show nu laugh r',
            'nu.laugh: Аааа, Руслан, ты святой! Сколько я тебе должна?',
            'ru.love: Да ничего, ты чё.',
            'nu.smile: Спасибо-спасибо!',
            '@hide nu',
            '@bg lecture',
            '@show gre cold c',
            'gre.cold: Руслан. Опоздание — двадцать минут. Я запомню.',
            'nar: Грешнова запомнила. Навсегда. Как и обещал Никитос.',
            '@hide gre',
            '@show kol smug r',
            'kol: Раф. Через весь Гагарина. И опоздал к Грешновой. Бро, я даже не знаю, что сказать. А, знаю: ну такое.'
          ]
        },
        {
          t: '«Я далеко, сорян»',
          fx: { self: 1 },
          then: [
            '> я далеко, сорян',
            '<<Нюрка: эх ладно',
            '@phoneoff',
            'nar: Через десять минут раф ей принёс кто-то другой. Руслан этого не видел. И это к лучшему.'
          ]
        },
        {
          t: 'Промолчать в чате',
          fx: { self: 1, grow: 1 },
          then: [
            '@phoneoff',
            'nar: Он промолчал. Палец завис над клавиатурой, как над кнопкой «купить» в три часа ночи.',
            'in: Ну и сиди без её «спасибо».',
            'ru: Посижу.'
          ]
        }
      ]
    },
    '@hideall',
    '@mus hope',
    '@bg bench day',
    'nar: Суббота. Нюрка выложила сторис: каток в «Фантастике», подпись — «кто со мной в следующий раз? 🥺».',
    '@show ru think c',
    'in: «Кто со мной». Это тебе. Это прямо тебе, бро.',
    'nar: Сторис посмотрели 312 человек.',
    {
      c: [
        {
          t: 'Ответить на сторис: «я! когда?»',
          fx: { dep: 1, ideal: 1, cringe: 1 },
          then: [
            '@phone Нюрка|была недавно',
            '> я! когда?',
            'nar: Через четыре часа.',
            '< ахах мы уже с девочками договорились, но спасибо)',
            '@phoneoff',
            '@emo ru sad',
            'in: «Спасибо». Это вежливость с перспективой.',
            'nar: Это вежливость. Без перспективы.'
          ]
        },
        {
          t: 'Поставить огонёк 🔥 и жить дальше',
          fx: { self: 1 },
          then: ['nar: Огонёк. Одна секунда. Он закрыл сторис и пошёл в зал. Неплохой обмен.']
        },
        {
          t: 'Скинуть сторис Кнаре: «это знак?»',
          fx: { rep: 1, grow: 1 },
          then: [
            '@cnt kn',
            '@phone Кнаря|в сети',
            '> кнар. это знак?',
            '< руслан-джан, это каток',
            '< знак — это когда она пишет тебе. а это 312 человек посмотрели',
            '< приходи лучше к нам в субботу, мама хоровац делает',
            '@phoneoff'
          ]
        }
      ]
    },
    '@hideall',
    '@mus campus',
    '@bg room day',
    'nar: Утро. Руслан собирается на пары. И тут —',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini',
    '< руслан, а к какой паре приедешь?',
    '@fx heart',
    'in: Она спрашивает. Сама. Ей важно, когда ты приедешь. Ей ВАЖНО.',
    'nar: Ответь. А потом посмотрим, зачем ей было важно.',
    { write: 'nu_para' },
    {
      c: [
        {
          t: '«Куплю»',
          fx: { dep: 1, kom: 1 },
          then: ['> куплю', '< спасибо!! 🫶🏻', 'in: Сердечко руками. Это почти объятие.']
        },
        {
          t: '«Куплю. Но можешь писать и просто так)»',
          fx: { self: 1, cringe: 1 },
          then: [
            '> куплю. но можешь писать и просто так)',
            '< ахах ладно)',
            'nar: Просто так она не напишет. Но «ладно» он сохранил в избранное.'
          ]
        },
        {
          t: '«Не успеваю, сорян»',
          fx: { self: 2, kom: -1, grow: 1 },
          then: [
            '> не успеваю, сорян',
            '< оки',
            'nar: «Оки». Без скобочки. Мир не рухнул. Странно, да?'
          ]
        }
      ]
    },
    '@phoneoff',
    '@hideall',
    '@bg bench day',
    '@mus calm',
    '@show kn neutral r',
    '@show ru sad l',
    'nar: Перемена. Лавочка у корпуса. Кнаря с кофе. Руслан с лицом.',
    'kn: Ну давай. Я вижу, что тебе надо поныть. У тебя лицо как у моего брата, когда «Арарат» проиграл.',
    '@phone Кнаря|рядом, но пишет',
    'nar: Кнаря сидит рядом, но говорит, что ныть письменно легче. И она сохранит это для истории.',
    { write: 'kn_whine' },
    '@phoneoff',
    'kn.smile: Ладно. Пошли, я тебе покажу мем, где кот похож на нашего вахтёра. Тебе станет легче. Мне всегда легче.',
    '@hideall',
    '@bg niu day car',
    '@show kol smile r',
    '@show ru neutral l',
    'kol: Пары кончились. Поехали на Бор. Покажу, как живут спокойные люди.',
    'ru: А там что?',
    'kol.smile: Шашлык. Речка. Тишина. И ни одной Нюрки на сорок километров.',
    { mini: 'drive' },
    '@bg volga night car',
    '@mus calm',
    '@show kol smile r',
    '@show ru smile l',
    {
      if: s => s.flags.drive >= 3,
      then: [
        'kol.smile: Сорок минут ты не думал о ней. Я засёк. Молча.',
        'ru.smile: Блин. Реально.'
      ],
      else: [
        'kol: Ты в телефон лез на Борском мосту, бро. На мосту. Я не ругаюсь. Я просто запомнил.',
        'ru.sad: Я просто проверял…',
        'kol: Ты проверял, не написала ли она. Не написала.'
      ]
    },
    'kol: Слушай. Расскажу тебе одну вещь. Я её никому не рассказывал.',
    'kol: В школе я три года бегал за одной. Носил портфель. Решал ей алгебру. Ждал у подъезда.',
    'ru: И чё?',
    'kol: Она вышла замуж за моего двоюродного брата. Я был свидетелем. Тамада меня жалел.',
    'kol.smile: Вот поэтому я такой спокойный, бро. Я это уже прошёл. И тебя от свидетельства берегу.',
    'kol: И вот ещё. Когда она тебе последний раз писала просто так? Не «займи», не «купи». Просто так?',
    'nar: Руслан посмотрел на счётчик. Вы тоже можете.',
    {
      c: [
        {
          t: '«…Не помню»',
          fx: { grow: 1, self: 1 },
          then: ['ru.sad: …Не помню.', 'kol: Вот и я не помню.']
        },
        {
          t: '«Она просто стеснительная»',
          fx: { ideal: 1 },
          then: [
            'ru.hope: Она просто стеснительная.',
            'kol: Она меня в первую неделю попросила подкинуть её до «Фантастики». Стеснительная. Ага.'
          ]
        },
        {
          t: '«Колян, спасибо, что рассказал»',
          fx: { rep: 2 },
          then: [
            'ru: Колян. Спасибо, что рассказал. Серьёзно.',
            'kol.smile: Да ладно. Только никому. Особенно Кнаре, она меня неделю будет «свидетелем» звать.'
          ]
        }
      ]
    },
    '@goto ch2'
  ],

  ch2: [
    '@chapter 2',
    '@mus campus',
    '@bg comp',
    '@title ГЛАВА 2|Домашка до пятницы',
    '@show kaz smile c',
    'kaz.smile: Деточки, тишина. Документационное обеспечение управления. Запомните: документ без подписи — не документ. Без даты — не документ. Без регистрационного номера — тем более.',
    'nar: Казьбан. Ведёт ДОУ и делопроизводство. Знает про служебные записки всё. Добрая, как бабушка, но поля в документе проверяет с линейкой.',
    'in: Бро. А если оформить чувства к Нюрке служебной запиской? С подписью. С датой. С регистрационным номером.',
    {
      c: [
        {
          t: 'Набросать «служебную записку о чувствах»',
          fx: { cringe: 1, rep: 1 },
          then: [
            'nar: «Служебная записка. Кому: Нюрке. От: Руслана. О чувствах. Прошу рассмотреть». Кнаря увидела через плечо и легла на парту от смеха.',
            '@show kn laugh r',
            'kn.laugh: Руслан, у тебя поля не по ГОСТу!',
            'kaz: Деточки, что у вас там смешного? Покажите.',
            'ru.cringe: Ничего! Мы про… регистрационные номера!',
            '@hide kn'
          ]
        },
        {
          t: 'Слушать Казьбан',
          fx: { self: 1 },
          then: [
            'kaz.smile: Руслан, вы сегодня внимательный. Молодец, деточка.',
            'nar: Иногда простое «молодец, деточка» от Казьбан лечит лучше, чем «спасибо» от кого-то ещё.'
          ]
        }
      ]
    },
    '@hideall',
    '@show ru think c',
    'nar: Октябрь. В СДО висит домашка по эконометрике. Срок — до пятницы. Руслан уже сделал свою.',
    'in: А она знает? Она наверняка не знает. Надо ей сказать. По-дружески.',
    'nar: Внутренний голос, честно: сколько тут «помочь», а сколько — «просто чтобы она ответила»?',
    'in: …Пять на девяносто пять. Но какая разница!',
    {
      c: [
        { t: 'Написать ей', then: [] },
        {
          t: 'Не писать. Она взрослая, разберётся',
          fx: { self: 2, grow: 2 },
          then: [
            'nar: Он не написал. Через два дня она узнала про домашку от Никитоса. Никитос — староста. Это его работа, а не Руслана.',
            '@goto ch2b'
          ]
        }
      ]
    },
    '@phone Нюрка|была недавно',
    { write: 'nu_hw' },
    '> короче, по эконометрике домашка до пятницы. я свою уже сделал',
    '< блин руслан, а скинешь посмотреть? я вообще не понимаю что там',
    { mini: 'hw' },
    { if: s => s.flags.hwFor >= 2, then: ['@set domashkin'] },
    '< руслан а можешь сам в сдо загрузить? у меня не грузит 😭',
    {
      c: [
        {
          t: 'Загрузить за неё',
          fx: { dep: 1, kom: 1 },
          set: 'sdo',
          then: ['> загрузил', '< большое-большое спасибо!!! 🫶🏻🫶🏻', '< ты меня спас', '@fx heart']
        },
        {
          t: '«Попробуй с компа, я скину, как»',
          fx: { self: 1, grow: 1, kom: 1 },
          then: [
            '> попробуй с компа, щас скину как',
            '< ааа получилось, спасибо!!',
            'nar: Она справилась сама. Ему даже приятнее. Неожиданно.'
          ]
        }
      ]
    },
    '@phoneoff',
    {
      if: s => s.flags.sdo || s.flags.hwFor >= 2,
      then: [
        '@mus fantasy',
        '@bg volga night',
        '@fant on',
        '@show ru cool l',
        '@show nu soft r',
        'nar: [ФАНТАЗИЯ РУСЛАНА №1]',
        'nar: Каждое утро ему приходит «доброе утро, руслан ☀️». Первой. Просто так.',
        'nu.soft: Руслан, я тут поняла… Домашки, вода, парты… Ты — мой тип. Всегда был.',
        'ru.cool: Я знаю, Ань. Я посчитал. Это статистически значимо.',
        'nar: Никитос аплодирует с Борского моста. Колян одобрительно кивает из шестёрки. Молча. Казьбан регистрирует их отношения входящим номером.',
        '@fx scratch',
        '@fant off',
        '@hideall',
        '@mus night',
        '@bg room night',
        '@show ru cringe c',
        'nar: [КОНЕЦ ФАНТАЗИИ]. У Руслана есть «большое-большое спасибо» и галочка «прочитано». Доброе утро ему пишет только мама.'
      ]
    },
    '@goto ch2b'
  ],
  ch2b: [
    '@hideall',
    '@bg comp',
    '@sfx notif',
    '@phone Группа ГМУ 🔥|28 участников',
    '<<Кирилл: кто сделал эконометрику скиньте плз',
    {
      if: s => s.flags.sdo,
      then: [
        '<<Владос: у Руслана спроси, он Нюрке и сделал, и загрузил 😏',
        '<<Денчик: руслан сделай и мне, я тоже красивый'
      ],
      else: ['<<Владос: Руслан сделал, я видел', '<<Денчик: руслан скинь плз, я тебе потом шаурму']
    },
    '<<Огромный Витёк: 👍',
    {
      c: [
        {
          t: '«Прайс: одна задача — одна шаурма»',
          fx: { rep: 1 },
          then: [
            '> прайс: одна задача — одна шаурма. нюрке без скидки',
            '<<Денчик: АХАХАХ а раньше со скидкой было??',
            '<<Вика: всё понятно 😏',
            '<<Вика: да всё понятно'
          ]
        },
        {
          t: '«Сами сделаете, не маленькие»',
          fx: { self: 1, grow: 1 },
          then: ['> сами сделаете, не маленькие', '<<Кирилл: жёстко', '<<Кнаря: УВАЖАЮ 🫡']
        },
        {
          t: 'Скинуть всем свою домашку',
          fx: { rep: 1, dep: 1, cringe: 1 },
          set: 'domashkin',
          then: [
            '> держите 📎',
            '<<Кирилл: легенда',
            '<<Лиза: руслан спасибо 🫶🏻',
            '<<Софа: святой человек',
            '<<Владос: руслан домашкин',
            'nar: Прозвище «Руслан Домашкин» прилипло к нему до конца семестра.'
          ]
        }
      ]
    },
    '@phoneoff',
    '@hideall',
    '@bg comp',
    '@mus cringe',
    '@show kn smug r',
    '@show ru nerv l',
    'nar: Библиотека. Кнаря отобрала у Руслана телефон и читает его переписку с Нюркой. Вслух. С выражением.',
    'kn.smug: «Ань, ты знала, что домашка до пятницы?» Руслан. Это не флирт. Это служба поддержки СДО.',
    'kn.laugh: «Я свою уже сделал» — и смайлик. Ты бы ещё печать поставил. Казьбан бы одобрила: с датой и подписью.',
    'ru.cringe: Кнаря, отдай телефон.',
    'kn: Подожди, тут ещё «спасибо большое» от неё. Одно. За три задачи. Это одна целая и ноль сотых благодарности на сорок минут твоей жизни.',
    {
      c: [
        {
          t: 'Заржать вместе с ней',
          fx: { rep: 1, self: 1, grow: 1 },
          then: [
            '@cnt kn',
            'ru.laugh: Бля. Звучит реально жалко.',
            'kn.laugh: Не жалко. Мило. Но жалко немножко, да.'
          ]
        },
        {
          t: 'Обидеться: «Ты не понимаешь»',
          fx: { ideal: 1, rep: -1 },
          then: [
            'ru.angry: Ты не понимаешь.',
            'kn: Руслан-джан. У меня три брата. Я понимаю ВСЁ. Но ладно, ладно. Молчу. Пять минут.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg niu day car',
    '@mus campus',
    '@show kol smug r',
    '@show nik neutral c',
    '@show ru neutral l',
    {
      if: s => s.flags.sdo,
      then: [
        'kol: Подожди. Ты ей домашку сделал. И ещё в СДО загрузил. Сам.',
        'ru.nerv: Ну у неё не грузилось…',
        'kol: Бро. Ты ей не друг. Ты ей СДО.'
      ],
      else: [
        'kol: Ну чё, домашку сдал?',
        'ru: Сдал. Свою.',
        'kol.smile: Свою. Красава. Никитос, запиши. Исторический день.'
      ]
    },
    {
      if: s => s.flags.coffee,
      then: ['kol.smile: Он ей ещё раф таскал. Я это до пенсии помнить буду. Спокойно, но буду.']
    },
    'nik.sad: (смотрит в телефон) Света опять не может вечером. У неё Даша.',
    'kol: Даша — это как пробка на Борском мосту. Объехать нельзя. Только переждать.',
    'nik: Третий раз за неделю. То маникюр, то «срочно поговорить», то «ей грустно». Ей всегда грустно ровно в семь, когда у нас кино.',
    'kol.smile: Может, Даша тоже хочет в кино. С вами. На средний ряд.',
    'nik.angry: Колян. Не надо. Она уже была на нашей годовщине. Сидела между нами.',
    'nik: Ладно. Не про меня сейчас. Слушай, Рус. Я в сентябре тебе говорил «общайся, пробуй». Говорил же?',
    'ru: Говорил.',
    'nik: Я месяц смотрел. Ты не пробуешь, бро. Ты обслуживаешь.',
    'nik: Когда мы со Светой начали общаться, она мне тоже писала первой. Сама. Просто так. Это ощущается по-другому.',
    {
      c: [
        {
          t: '«И чё мне делать?»',
          fx: { grow: 1, rep: 1 },
          then: [
            'ru: И чё мне делать?',
            'nik: Перестань быть сервисом. Будь человеком. Если ей интересен человек — она придёт.',
            'kol: А если нет — значит, нет. Ласточка тоже не всегда заводится. Я не умоляю. Жду или еду на маршрутке.'
          ]
        },
        {
          t: '«У вас со Светой другое»',
          fx: { ideal: 1 },
          then: [
            'ru.sad: У вас со Светой другое.',
            'nik: Да ни хрена не другое. Просто у нас было взаимно. Вот и вся разница.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg room night',
    '@mus night',
    '@show ru neutral l',
    '@sfx notif',
    '@phone Санёк|в сети',
    '< рус, срочно',
    '< кристина устроила скандал, что я неделю не звонил её маме. я заебался',
    '< ты у нас специалист по девушкам. чё мне ей написать?',
    'in: Он спрашивает совета у тебя. У ТЕБЯ.',
    { write: 'san_kris' },
    '< ладно, бро. спасибо',
    '< хотя знаешь что. нахуй тебе оно вообще надо, рус. вот у меня отношения с кристиной и бля......',
    '< твоя очередь. ной, я разрешаю',
    { write: 'san_whine' },
    '@phoneoff',
    'nar: Вот так и живут: Санёк ноет Руслану про Кристину, Руслан ноет Саньку про Нюрку. Клуб анонимных нытиков. Встречи каждый вечер.',
    '@goto ch3'
  ],

  ch3: [
    '@chapter 3',
    '@mus tension',
    '@bg corridor',
    '@title ГЛАВА 3|Не мой тип',
    'nar: Кнаря не выдержала. Сказала: «Я больше не могу смотреть, как ты гадаешь по скобочкам». И пошла к Нюрке сама.',
    '@show kn neutral r',
    '@show ru nerv l',
    'kn: Руслан-джан. Я с ней поговорила. Аккуратно. Как дипломат. Ну, как армянский дипломат. Можно честно?',
    {
      c: [
        { t: '«Давай. Только честно»', fx: { grow: 1 }, set: 'truth', then: ['@cnt kn'] },
        {
          t: '«Не надо. Я не хочу знать»',
          fx: { ideal: 2, dep: 1 },
          then: [
            'ru.sad: Не надо. Я не хочу знать.',
            'kn.sad: Руслан… это не поможет. Но как скажешь. Я рядом, если что.',
            'nar: Он не узнал. И ещё месяц жил в мире «а вдруг». Это очень уютный мир. И очень дорогой.',
            '@goto ch3b'
          ]
        }
      ]
    },
    'kn: Я тебе перешлю, как она мне написала. Чтобы я ничего не приукрасила. Я бы приукрасила, ты меня знаешь.',
    '@hideall',
    '@phone Кнаря|в сети',
    '< вот, я спросила, как она к тебе',
    '< «руслан хороший друг. правда очень хороший»',
    '< «но как парня я его не рассматриваю»',
    '< «не мой тип. плюс одногруппник — это вообще кринж»',
    '< «и я не хочу, чтобы он надеялся»',
    '< прости, руслан-джан 🫂',
    '@phoneoff',
    '@show ru broken c',
    '@fx crash',
    '@meter 97 51 ВЛЮБЛЁННОСТЬ',
    'nar: Странная вещь. Он думал, что развалится. А шкала рухнула почти вдвое — и он стоит. Дышит. В коридоре пахнет кофе из автомата.',
    'in: Не мой тип. А какой у неё тип? Я могу стать типом. Я могу стать ЛЮБЫМ типом.',
    'nar: Внутренний голос предлагает переписать личность из-за двух слов. Внутренний голос — не самый надёжный советчик. Запомните.',
    {
      c: [
        {
          t: '«Значит, стану её типом»',
          fx: { ideal: 2, dep: 1, self: -1 },
          then: ['ru.angry: Значит, я стану её типом.', 'in: Да! Вот это я понимаю!']
        },
        {
          t: '«Это её право. Неприятно, но честно»',
          fx: { grow: 2, self: 1 },
          then: ['ru.sad: Это её право. Неприятно. Но честно.']
        },
        {
          t: '«Ну и ладно» (делает вид, что похуй)',
          fx: { self: 1, ideal: 1 },
          then: [
            'ru.smug: Ну и ладно. Вообще похуй.',
            'in: Тебе не похуй. Ты сейчас расплачешься у кофейного автомата.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg bench day',
    '@mus calm',
    '@show kn neutral r',
    '@show ru sad l',
    'nar: Через десять минут Кнаря уже сидела рядом. С двумя кофе. Будто знала. Она всегда знает.',
    'kn.smug: Слушай меня. «Не мой тип» — это её проблема, а не твоя. У меня бабушка говорит: кто тебя не ценит — пусть сам свою долму кушает.',
    'ru.sad: Я не понимаю, что со мной не так.',
    'kn: С тобой всё так, балбес. Ты смешной, добрый и делаешь людям домашку. Последнее — лишнее.',
    {
      c: [
        {
          t: 'Поныть Кнаре от души',
          then: ['@phone Кнаря|рядом', { write: 'kn_whine' }, '@phoneoff']
        },
        {
          t: '«Кнар, просто посиди со мной»',
          fx: { rep: 1, grow: 1 },
          then: [
            '@cnt kn',
            'ru: Кнар. Просто посиди со мной. Молча.',
            'kn.soft: Посижу. Молча — не обещаю. Но посижу.',
            'nar: Она молчала целых четыре минуты. Личный рекорд Кнари.'
          ]
        }
      ]
    },
    'nar: После разговора с Кнарей ему было легче два дня. Потом волна вернулась. Но два дня — это тоже результат.',
    '@hideall',
    '@show ru neutral c',
    '@phone Нюрка|в сети',
    'nar: Чат с Нюркой открыт. Можно написать. Можно не писать. Можно написать ерунду. Решай.',
    { write: 'nu_clear' },
    '@phoneoff',
    '@goto ch3b'
  ],
  ch3b: [
    '@hideall',
    '@mus calm',
    '@bg volga night car',
    '@show kol neutral ll',
    '@show ru sad c',
    '@show nik neutral rr',
    'nar: Вечер. Нижне-Волжская набережная. Ласточка. Санёк — на громкой.',
    {
      if: s => s.flags.truth,
      then: [
        'kol: Ну чё. Кнаря рассказала?',
        'ru.sad: Рассказала. Не мой тип. Плюс одногруппник.',
        'kol: Бро. Ну… бывает. Садись. Покатаемся молча.'
      ],
      else: [
        'kol: Ты чё, даже не стал слушать, что Кнаря узнала?',
        'ru: Не хочу знать.',
        'kol: Бро. Ты как страус. Только страус на шестёрке.'
      ]
    },
    'nik: Рус. Я в сентябре говорил «пробуй». Ты попробовал. Честно, по-мужски.',
    'nik: А теперь скажу то, что всю осень говорит Санёк. Правда — нахуй тебе оно надо?',
    'san: (по громкой) Я с мая это говорю! С МАЯ! Нахуй тебе оно надо, Рус? Вот у меня отношения с Кристиной — и бля…… Вот это «и бля» и есть отношения. Тебе оно надо?',
    'kn: (голосовым в беседу) Руслан, я тебя люблю как брата, поэтому скажу как сестра: нахуй тебе это надо?',
    'kol: Даже Кнаря. Ну всё, консенсус. Санёк, а вы с Кристиной помирились?',
    'san: (по громкой) Не спрашивай. Опять. Она сказала, что я «не так молчу». Я заебался. И бля…… Ладно, мы сейчас про Руслана.',
    {
      c: [
        {
          t: 'Послушать своих',
          fx: { rep: 2, grow: 1, dep: -1 },
          then: [
            'ru: …Может, вы и правы.',
            'kol.smile: Не «может». Правы. Поехали за шаурмой. Молча. Как мужчины.'
          ]
        },
        {
          t: '«Вы не понимаете. Она особенная»',
          fx: { ideal: 2, rep: -1 },
          then: [
            'ru.angry: Вы не понимаете. Она особенная.',
            'nik: Бро, все особенные. Света особенная. Кристина у Санька особенная. Ломовцева — особенная.',
            'kol: Ласточка — вот кто реально особенная.'
          ]
        },
        {
          t: 'Заржать вместе с ними',
          fx: { rep: 1, self: 1 },
          then: [
            'ru.laugh: Бля. Пацаны. Я месяц считал, кто первый пишет.',
            'kol.smile: Счётчик. Ты вёл счётчик. Бро.',
            'nik.laugh: Это в историю группы.',
            'nar: Ржали минут десять. Санёк ржал по громкой. Ласточка, кажется, тоже.'
          ]
        }
      ]
    },
    '@goto ch4'
  ],

  ch4: [
    '@chapter 4',
    '@mus night',
    '@bg room day',
    '@title ГЛАВА 4|Волны',
    '@show ru neutral c',
    'nar: Чувства — как волны на Волге. Вроде отпустило. А потом опять.',
    'nar: Октябрь. Три недели. Выбери, как Руслан их проживёт: три пункта. От этого зависит, кем он выйдет к финалу.',
    '@hideall',
    {
      pick: 3,
      h: 'ТРИ НЕДЕЛИ РУСЛАНА',
      opts: [
        {
          t: '💧 Покупать ей воду и занимать парту, как раньше',
          fx: { dep: 2, kom: 1, self: -1 },
          then: [
            '@bg lecture',
            '@show nu smile r',
            '@show ru hope l',
            'nar: Вода. Парта. «Спасибо». Вода. Парта. «Спасибо». Руслан стал самым надёжным сервисом на потоке.',
            'nu.smile: Руслан, ты лучший!',
            'nar: Она говорит это так, как говорят о хорошем такси.',
            '@hideall'
          ]
        },
        {
          t: '🤒 Неделя дома (заболел)',
          fx: { self: 1, grow: 1, tired: -1 },
          set: 'sick',
          then: [
            '@bg room day',
            '@show ru tired c',
            'nar: Руслан заболел. Неделю дома: сериалы, чай, мамин суп.',
            'nar: И странное дело — ему было хорошо. Никого не надо ловить в коридоре. Ни на что не надо надеяться.',
            '@hideall'
          ]
        },
        {
          t: '🔧 Помочь Коляну починить ласточку',
          fx: { rep: 2, grow: 1 },
          then: [
            '@bg volga night car',
            '@show kol sad r',
            '@show ru smile l',
            'nar: У ласточки сдох карбюратор. Колян на мели, но спокоен. Выходные в гараже на Бору: Руслан держит фонарик, Колян тихо разговаривает с карбюратором, как с котом.',
            'kol: Бро, ты вообще в машинах шаришь?',
            'ru.smile: Нет. Но фонарик держу профессионально.',
            '@emo kol laugh',
            'kol.smile: …Завелась. Руслан. Ты брат. Ты теперь крёстный ласточки.',
            '@hideall'
          ]
        },
        {
          t: '💸 Влезть в бизнес Санька со Спотифаем',
          fx: { self: 2, grow: 1, rep: 1 },
          then: [
            '@bg city',
            '@show san smile r',
            '@show ru smile l',
            'nar: Маршал Град. Розовые огни на башнях. Санёк показывает своего бота.',
            'san.smile: Смотри. Человек пишет боту, бот выдаёт подписку, мне капает. Ты занимаешься рекламой. Пятьдесят на пятьдесят.',
            'ru.smug: Я в деле.',
            'nar: За неделю Руслан заработал первые деньги. Не на чужой домашке.',
            'san: Видишь? Энергию можно тратить на дело. А не на «прочитано».',
            '@hideall'
          ]
        },
        {
          t: '💪 Зал, сон, права',
          fx: { self: 2, grow: 2, tired: -1 },
          then: [
            '@bg niu day car',
            '@show ru smile l',
            'nar: Зал три раза в неделю. Сон по восемь часов. Теория в ГАИ сдана. Колян обещал научить водить на ласточке.',
            '@show kol smile r',
            'kol: Только въедешь в столб — продам тебе ласточку за двести.',
            '@hideall'
          ]
        },
        {
          t: '📺 Написать ей про сериал (это просто повод)',
          fx: { cringe: 2, dep: 1 },
          then: [
            '@bg room night',
            '@phone Нюрка|была недавно',
            '> слушай, ты говорила про какой-то сериал, напомни название?',
            'nar: Через три часа.',
            '< эм, не помню уже 😅',
            'nar: Он тоже не помнил, чтобы она что-то говорила. Повод был шит белыми нитками.',
            '@phoneoff',
            '@hideall'
          ]
        },
        {
          t: '☕ Кофе и сплетни с Кнарей',
          fx: { rep: 1, grow: 1, dep: -1 },
          then: [
            '@cnt kn',
            '@bg bench day',
            '@show kn laugh r',
            '@show ru laugh l',
            'nar: Кофе у корпуса. Кнаря рассказывает, как её брат пытался сделать предложение и уронил кольцо в Волгу. Руслан ржёт так, что болит живот.',
            'kn.laugh: Видишь? У всех бывает хуже. Мой брат до сих пор ныряет.',
            'ru.laugh: Он нашёл кольцо?',
            'kn: Нет. Но нашёл другую девушку. Она дайвер. Скоро свадьба, кстати. Ты приглашён.',
            '@hideall'
          ]
        },
        {
          t: '🇬🇧 Английский у Висилицкой',
          fx: { self: 1, grow: 1 },
          then: [
            '@bg lecture',
            '@show vis smile c',
            "vis.smile: Okay guys, speaking. Topic: «Something you wanted but didn't get». Ruslan, you first.",
            'ru.nerv: Э… There is a girl… and she is… not my… I am not her type.',
            "vis: Oh, I see. You know, in English we say: «It's not meant to be». And that's okay. You're not a bad person — it's just not your story.",
            'vis.smile: Great vocabulary, by the way. Five.',
            'nar: Висилицкая — молодая, крутая, и, кажется, только что провела лучший сеанс терапии за семестр. На английском. За пятёрку.',
            '@hideall'
          ]
        }
      ]
    },
    '@mus calm',
    '@bg niu sunset',
    '@show nik sad r',
    '@show ru neutral l',
    'nar: Вечер. Никитос стоит у корпуса с телефоном. Лицо как у человека, которому Ломовцева поставила «удовлетворительно».',
    'nik.sad: Рус. Мы со Светой поругались. Из-за ерунды. Я не ответил ей два часа, потому что разбирался с расписанием группы.',
    'nik.angry: А Даша, конечно, сидела рядом и комментировала. Как спортивный комментатор. Только против меня.',
    '@sfx notif',
    '@phone Санёк|в сети',
    '< у меня вот кристина, у тебя даша. и бля......',
    '< передай никитосу: я с ним',
    '@phoneoff',
    {
      c: [
        {
          t: '«Бро, позвони ей. Прямо сейчас»',
          fx: { grow: 1, rep: 1 },
          then: ['ru: Бро, позвони ей. Прямо сейчас. Не пиши — позвони.', 'nik: …Да. Ты прав.']
        },
        {
          t: '«Да забей, она остынет»',
          fx: { rep: -1 },
          then: ['ru: Да забей, остынет.', 'nik: Не, бро. Так не работает. Я позвоню.']
        }
      ]
    },
    'nar: Никитос позвонил. Пять минут. «Свет, я был не прав, прости». Смех в трубке. «Люблю». Конец.',
    'nik.smile: Всё. Помирились.',
    'ru.shock: За пять минут?',
    'nik: Когда оба хотят — всё решается за пять минут. А когда хочет один — никакие домашки и рафы не помогут. Запиши себе.',
    {
      c: [
        {
          t: 'Записать себе в заметки',
          fx: { grow: 2 },
          then: ['nar: Он правда записал. Заметка называется «Никитос сказал». Там одна строчка.']
        },
        {
          t: '«У вас просто повезло»',
          fx: { ideal: 1 },
          then: ['nik: Повезло — это встретить. А дальше — работа обоих. Обоих, Рус.']
        }
      ]
    },
    '@hideall',
    '@mus tension',
    '@bg corridor',
    'nar: Понедельник. Руслан приходит в универ после трёх недель своей жизни.',
    '@show nu neutral r',
    '@show ru hope l',
    {
      if: s => s.flags.sick,
      then: ['nar: Неделю его не было. Она проходит мимо, кивает. И всё.'],
      else: ['nar: Она проходит мимо. Кивает. Не спрашивает, как дела.']
    },
    '@hide nu',
    '@emo ru sad',
    'in: Тебя нет. Ты пустое место. Ты неинтересный.',
    {
      c: [
        {
          t: 'Догнать и заговорить первым',
          fx: { dep: 1, kom: 1 },
          then: [
            '@show nu smile r',
            'ru: Привет! Как ты?',
            'nu.smile: О, привет! Норм. Слушай, а Грешнова сегодня будет?',
            'nar: Обычный разговор. Тридцать секунд. Он будет прокручивать его весь день.',
            '@hide nu'
          ]
        },
        {
          t: '«Ты заметила, что меня не было?»',
          fx: { cringe: 2, dep: 1, self: -1 },
          then: [
            '@show nu awk r',
            'ru.nerv: А ты заметила, что меня не было?',
            'nu.awk: А… да? Ну… ты болел, да?',
            '@fx cringe',
            'nar: Она не заметила. Теперь ей неловко, что не заметила. А ему — что спросил.',
            '@hide nu'
          ]
        },
        {
          t: 'Отпустить. Пойти к своим',
          fx: { rep: 1, grow: 1, self: 1 },
          then: [
            '@show nik smile r',
            'nik: О, вернулся! Живой? Мы скучали. Колян без тебя ласточку мыл в одиночестве.',
            'ru.smile: Живой.',
            'nar: Человек, который спросил, как он, нашёлся. Просто не тот, которого он ждал.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg niu day',
    '@mus calm',
    '@show ru sad l',
    'nar: Обед. Надо кому-то поныть. Срочно.',
    {
      h: 'КОМУ ПОНЫТЬ?',
      c: [
        {
          t: '🍇 Кнаре (она через стенку)',
          then: [
            '@show kn neutral r',
            'kn: Опять? Ладно. Садись. Я взяла два кофе, будто знала.',
            '@phone Кнаря|рядом',
            { write: 'kn_whine' },
            '@phoneoff',
            '@hideall'
          ]
        },
        {
          t: '🎧 Саньку (Лобач через дорогу)',
          then: [
            '@show san neutral r',
            'nar: Санёк пришёл из Лобачевского через дорогу. Пять минут пешком. «Мог бы каждый день тебе мозги вправлять», — говорит он.',
            'san: Давай. Ной. Я сегодня тоже поною, у меня Кристина.',
            '@phone Санёк|рядом',
            { write: 'san_whine' },
            '@phoneoff',
            'san: А теперь моя очередь. Кристина сказала, что я «эмоционально недоступный». Я ей подписку на Спотифай подарил! Это же любовь!',
            'ru.laugh: Сань, это не любовь, это бизнес-модель.',
            '@hideall'
          ]
        },
        {
          t: '🙅 Никому. Справлюсь сам',
          fx: { self: 1, grow: 1 },
          then: ['nar: Он не стал ныть. Просто пошёл и съел шаурму. Шаурма не осуждает.']
        }
      ]
    },
    '@hideall',
    '@bg room night',
    '@mus night',
    '@show ru tired c',
    'nar: Ночь. 3:12. Руслан не спит. Руслан пишет сообщение. Длинное.',
    'in: Просто напиши ей всё. Она поймёт. Она обязана понять.',
    'nar: Мини-игра. Не дай ему это отправить. Или дай — это тоже выбор.',
    { mini: 'resist' },
    {
      if: s => s.flags.resisted,
      then: [
        '@emo ru think',
        'nar: Черновик удалён. Телефон экраном вниз. Впервые за месяц.',
        'ru: Не сегодня.'
      ],
      else: [
        '@phone Нюрка|была недавно',
        'nar: Черновик не удалился. Палец завис над клавиатурой. Чат открыт. Пиши что угодно — или закрой.',
        { write: 'nu_night' },
        '@phoneoff'
      ]
    },
    '@goto ch5'
  ],

  ch5: [
    '@chapter 5',
    '@mus campus',
    '@bg hall',
    '@title ГЛАВА 5|Лучший день',
    'nar: Конец октября. Посвят первокурсников. Ваша группа — ведущие. Никитос всех построил, Колян на звуке, Руслан пишет шутки.',
    '@show nik smile ll',
    '@show ru smile c',
    '@show kol laugh rr',
    'nik: Так, по плану: Руслан пишет, я и Кнаря ведём, Колян не трогает пульт, если не просят. Владос на свете, Денчик на камере, Кирилл на подхвате, Вика и Вика на билетах. Огромный Витёк — охрана. Софа и Лиза — гримёрка и блёстки.',
    'nik: И в первом ряду — Ломовцева. Пацаны, не опозорьте меня перед Ломовцевой.',
    'kn: (из-за кулис) Если Колян тронет пульт — я трону Коляна.',
    {
      c: [
        {
          t: 'Вставить в сценарий шутку про ласточку',
          fx: { rep: 1, self: 1 },
          then: [
            'ru.smug: Колян, у меня для тебя номер. Называется «Ласточка заглохла на Борском мосту».',
            'kol.laugh: Ты не посмеешь. …Посмеешь. Давай.'
          ]
        },
        {
          t: 'Вставить шутку про Нюрку, чтобы она заметила',
          fx: { cringe: 2, ideal: 1 },
          then: [
            'ru.smug: А ещё будет шутка про девушку из третьего ряда, которая не отвечает на сообщения.',
            'nik: Бро. Нет.',
            'kol: Бро. Нет. Спокойно, но нет.',
            'nar: Пацаны вычеркнули шутку. Спасли его. Он поймёт это позже.'
          ]
        }
      ]
    },
    'nar: Шоу прошло на ура. Номер про ласточку лёг. Сценка «Служебная записка о любви» легла дважды: второй раз смеялась сама Казьбан. Ломовцева аплодировала стоя. Никитос чуть не заплакал от гордости.',
    'nar: После шоу, за кулисами, к ним подходит Нюрка.',
    '@hide kol',
    '@show nu laugh rr',
    'nu.laugh: Руслан, это ты писал? Я чуть не умерла с ласточки!',
    'kol: (из-за кулис, спокойно) Ласточка — это святое.',
    'nar: Все расходятся. А она стоит с ними ещё полчаса. Смеётся.',
    'nar: Можно поймать момент и нормально с ней поговорить. Если поймать.',
    { mini: 'catch' },
    {
      if: s => s.flags.catchQ >= 1,
      then: [
        '@hideall',
        '@show ru love l',
        '@show nu laugh r',
        'nar: Он сел рядом. Минут на десять. Они шутили, она смеялась. Слова шли сами.',
        'ru.love: …и Казьбан такая: «Деточка, чувства без регистрационного номера не принимаются».',
        'nu.laugh: Ахахах, Руслан, прекрати!',
        '@fx heart'
      ],
      else: [
        'nar: Не успел — её позвали девочки. Но она смеялась с их шуток весь вечер. Тоже неплохо.'
      ]
    },
    '@hideall',
    '@bg niu sunset car',
    '@mus hope',
    '@show kol smile r',
    '@show ru neutral l',
    'kol: Так, кого подкинуть? Кнаря, Нюрка — садитесь, по пути.',
    'nar: Кнаря на переднем. Руслан и Нюрка — сзади. Красный кожаный салон. Колян включил «Ламбаду».',
    '@hideall',
    '@bg volga night car',
    '@mus stop',
    '@sfx car',
    'nar: Мост. Половина пути. Ласточка чихнула. Дёрнулась. И заглохла. Под дождём.',
    '@show kol shock r',
    'kol: Так. Ласточка. Не сейчас. Не при гостях. Мы же договаривались.',
    'kn: (из машины) Я в новой кофте! Я не толкаю!',
    'kol: Руслан, Нюрка. Толкаем. Я рулю. Без паники.',
    '@hide kol',
    '@show ru shock l',
    '@show nu laugh r',
    '@mus calm',
    'nar: Дождь. Мост. Руслан и Нюрка толкают белую шестёрку. Кнаря машет из окна, как королева на параде.',
    {
      h: 'КАК РУСЛАН СЕБЯ ВЕДЁТ?',
      c: [
        {
          t: 'Просто угарать. По-настоящему, без задней мысли',
          fx: { kom: 2, self: 1 },
          set: 'pushOk',
          then: [
            '@cnt spark',
            'ru.laugh: Колян, если она не заведётся, мы её продадим на запчасти и купим тебе самокат!',
            'nu.laugh: Ахахахах! Колян, держись!',
            'kol: (из машины) Это оскорбление. …О. Завелась.',
            '@sfx car',
            'nar: Ласточка завелась. Они мокрые до нитки. И ржут так, что болит живот. Он ни разу не подумал, как выглядит. Просто был собой.'
          ]
        },
        {
          t: 'Быть романтичным: «Давай я один, держи мою куртку»',
          fx: { cringe: 1, dep: 1, kom: -1 },
          then: [
            'ru.love: Ань, давай я один. Держи мою куртку, замёрзнешь.',
            'nu.awk: Руслан, я сама могу. Правда. Толкай давай.',
            'nar: Куртка промокла. Нюрка промокла. Романтика — тоже.'
          ]
        },
        {
          t: 'Ныть и ругать Коляна',
          fx: { rep: -1, kom: -1 },
          then: [
            'ru.angry: Колян, бля, я же говорил, её надо было в сервис!',
            'kol: (из машины) Не ори на ласточку. Она чувствует.',
            'nar: Нюрка толкала молча. Было неловко всем, кроме ласточки.'
          ]
        }
      ]
    },
    {
      if: s => s.flags.pushOk,
      then: [
        '@show nu soft r',
        'nu.soft: Руслан… ты, оказывается, такой прикольный, когда не стараешься.',
        {
          split: [
            '«…она смотрит на меня по-другому… это начало…»',
            '«Ты прикольный, когда не стараешься». Это правда. И, может быть, правда больше, чем он думает.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg room night',
    '@mus hope',
    '@show ru love l',
    'nar: Ночью — уведомление.',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini',
    '< руслан, ахахах я до сих пор мокрая 😂 спасибо за вечер, было угарно',
    'in: САМА. ПРОСТО ТАК. НЕ ПО ДЕЛУ. Бро, это оно.',
    { write: 'nu_eve' },
    '@phoneoff',
    '@sfx notif',
    '@phone Санёк|в сети',
    '> сань. мы сегодня толкали ласточку под дождём. она смеялась. она мне написала сама',
    '< так',
    '< стоп',
    '< САМА?',
    '< не по делу?',
    '> не по делу',
    '< бро. я в шоке. я пересматриваю свою картину мира',
    '< но правило то же: не беги к ней. посмотри, что будет дальше',
    '< у меня вот кристина сегодня опять… и бля...... ладно, это потом',
    '@phoneoff',
    '@show ru love c',
    'nar: Руслан пишет в общий чат своих: «Это лучший день в жизни за последнее время».',
    'nar: А потом пришла мысль. Неприятная, но честная.',
    'in: Когда она рядом — ты живой. Когда её нет — ты как телефон на одном проценте.',
    'nar: Его энергия подключена к ней, как к зарядке. Без неё он разряжается.',
    {
      h: 'ЧТО ОН С ЭТИМ СДЕЛАЕТ?',
      c: [
        {
          t: 'Признаться ей. В субботу, на тусе у Никитоса',
          set: 'confess',
          then: [
            'ru.nerv: В субботу. У Никитоса на Ванеева. Я ей скажу.',
            'in: Наконец-то. Или «о нет». Я ещё не решил.'
          ]
        },
        {
          t: 'Ничего не портить. Просто кайфануть от дня',
          fx: { ideal: 1, dep: 1 },
          then: [
            'ru.love: Не буду ничего портить. Просто хороший день.',
            'nar: Этот день он будет вспоминать ещё месяц. Каждый вечер.'
          ]
        },
        {
          t: 'Понять: дело не в ней, а в том, кому я отдал зарядку',
          fx: { grow: 2, self: 1, dep: -1 },
          then: [
            'ru.think: Подожди. Почему моё настроение на сто процентов зависит от того, посмотрела она на меня или нет?',
            'ru: Это не она меня заряжает. Это я сам отдал ей провод.',
            'nar: Самая взрослая мысль за семестр. Внутренний голос притих. Ему нечем крыть.'
          ]
        }
      ]
    },
    '@goto ch6'
  ],
  ch5c: [
    '@hideall',
    '@bg volga night',
    '@mus garland',
    'nar: Через пару дней. Набережная. Она гуляла с девочками, Руслан «случайно» оказался рядом. Девочки всё поняли и ушли «за кофе».',
    '@show ru nerv l',
    '@show nu neutral r',
    'ru.nerv: Ань. Можно поговорить? Нормально. Без шуток.',
    'nu: …Давай.',
    'ru.nerv: Ты мне нравишься. Не как друг. Ты, наверное, и так знаешь.',
    'nu.sad: Знаю.',
    {
      if: s => s.flags.pushOk,
      then: [
        'nu.awk: Руслан… я не знаю. Правда. После того вечера на мосту я… запуталась. Дай мне время, ладно? И не жди специально.',
        'nar: Это было не «нет». Это было «не дави». Огромная разница.'
      ],
      else: [
        'nu: Руслан, ты хороший. Правда. Но не в этом смысле.',
        'nu.sad: Мне неловко, когда ты всё делаешь за меня. Как будто я тебе что-то должна. А я не могу дать то, чего ты хочешь.',
        'nu.cold: И я не хочу, чтобы ты надеялся. Это было бы нечестно.'
      ]
    },
    '@cg cg_side|Она отвернулась.',
    'nar: Она отвернулась. Не потому что ей похуй. А потому что ей неловко быть причиной чужой боли.',
    '@cgoff',
    {
      c: [
        {
          t: '«Понял. Спасибо, что честно»',
          fx: { self: 2, grow: 2 },
          then: ['ru.sad: Понял. Спасибо, что честно.', 'nu.soft: Ты правда хороший, Руслан.']
        },
        {
          t: '«Но мы же так хорошо общались…»',
          fx: { dep: 1, ideal: 1, self: -1 },
          then: [
            'ru.sad: Но мы же так хорошо общались…',
            'nu.sad: Общались. И я хочу, чтобы так и было.'
          ]
        },
        {
          t: '«Дай шанс. Я изменюсь»',
          fx: { self: -2, dep: 2, cringe: 1 },
          then: [
            'ru.broken: Дай мне шанс. Один. Я изменюсь.',
            'nu.cold: Руслан, не надо меняться ради меня. Это так не работает.',
            '@fx crash'
          ]
        },
        {
          t: 'Пошутить и красиво уйти',
          fx: { self: 1, kom: 1, grow: 1 },
          then: [
            'ru.smile: Ну я хотя бы попытался. Можно я теперь красиво уйду вдоль Волги?',
            'nu.laugh: Иди. Только не простудись, драматург.'
          ]
        }
      ]
    },
    '@hide nu',
    'nar: Она ушла к девочкам. Огни на Борском мосту продолжали мигать. Им вообще без разницы.',
    '@goto ch6'
  ],

  ch6: [
    '@chapter 6',
    '@mus campus',
    '@bg flat night',
    '@title ГЛАВА 6|Ванеева, 2 ночи',
    'nar: Суббота. Съёмная квартира Никитоса на Ванеева. Света уехала с Дашей на «девичник с ночёвкой» — единственный раз, когда Никитос благодарен Даше. Хозяйка квартиры — в Сочи.',
    '@show nik smile c',
    'nik.smile: Так. Правила квартиры. Первое: соседи снизу злые, после одиннадцати — шёпотом. Второе: в ванной хозяйкины фиалки, не трогать. Третье: если что-то разбили — это был Денчик.',
    'nar: Пришли: Руслан, Нюрка, Колян, Денчик, Владос, Кирилл, Огромный Витёк. И ещё какие-то чуваки, которых никто не звал. Они просто пришли. Так бывает.',
    '@show kol smile r',
    '@show ru neutral l',
    'kol: Я за рулём. Пью чай. Буду смотреть на вас и запоминать.',
    'nik: Колян, ты лучший трезвый водитель Нижнего.',
    'kol.smile: Я знаю. Ласточка тоже знает.',
    {
      h: 'ЧТО РУСЛАН ПРИНЁС?',
      c: [
        {
          t: 'Грушевый сидр — «Нюрка же такой любит»',
          fx: { dep: 1, ideal: 1 },
          then: [
            'nar: Её любимый. Он запомнил это ещё в сентябре, когда она один раз вскользь упомянула.',
            '@hide nik',
            '@show nu smile c',
            'nu.smile: О, грушевый! Кто принёс?',
            'ru.nerv: Да… как-то так, само.',
            'nar: Она взяла бутылку и ушла к девочкам. «Спасибо» прозвучало где-то в коридоре.',
            '@hide nu'
          ]
        },
        {
          t: 'Пиво и чипсы на всех',
          fx: { rep: 1 },
          then: [
            'nar: Пакет пива и три пачки чипсов. Огромный Витёк обнял его. Это было больно, но приятно.'
          ]
        },
        {
          t: 'Ничего. «Я сам — подарок»',
          fx: { self: 1, cringe: 1 },
          then: ['ru.smug: Я — подарок.', 'nik: Бро. Иди за пивом.', 'nar: Он пошёл за пивом.']
        }
      ]
    },
    '@hideall',
    '@mus cringe',
    '@title СЦЕНА 1|Денчик и чайник',
    'nar: Денчик решил сварить пельмени. В чайнике. Кухня в пару. Владос снимает. Какие-то чуваки болеют за пельмени.',
    '@show nik shock c',
    'nik.shock: Денчик. Денчик! Это не кастрюля. Это хозяйкин ЧАЙНИК.',
    'nar: Денчик ответил философски: «Всё в этой жизни — кастрюля, если веришь». Это стало цитатой вечера.',
    {
      c: [
        {
          t: 'Спасти пельмени',
          fx: { rep: 1 },
          then: [
            '@show ru smug l',
            'nar: Руслан достал кастрюлю. Пельмени спасены. Денчик назвал его «шеф». Временно.'
          ]
        },
        {
          t: 'Снимать вместе с Владосом',
          fx: { rep: 1, self: 1 },
          then: [
            'nar: Видос «Денчик и чайник» за ночь набрал четыре тысячи просмотров в чате потока. Денчик гордится.'
          ]
        }
      ]
    },
    '@hideall',
    '@mus hope',
    '@title СЦЕНА 2|Бутылочка',
    'nar: Кто-то из чуваков, которых никто не звал, предложил сыграть в бутылочку. Никто не возразил. Ошибка.',
    { mini: 'bottle', arg: 'Огромный Витёк' },
    'nar: Бутылка указала на Огромного Витька. Действие: станцевать. Витёк станцевал. Люстра станцевала вместе с ним. Соседи снизу постучали по батарее.',
    'nar: Второй круг. Крутит Витёк.',
    { mini: 'bottle', arg: 'Руслан' },
    '@show nik laugh c',
    '@show ru shock l',
    'nik.laugh: О-о-о, Руслан! Правда или действие?',
    {
      c: [
        {
          t: 'Правда',
          then: [
            'nik.smug: Окей. Кто тебе нравится в этой комнате?',
            'nar: Тишина. Двенадцать пар глаз. Нюрка смотрит в стакан.',
            {
              c: [
                {
                  t: 'Честно: «Нюрка»',
                  fx: { self: 1, cringe: 2, ideal: 1 },
                  set: 'outed',
                  then: [
                    'ru.nerv: …Нюрка.',
                    'nar: «О-О-О-О-О». Это был самый громкий звук вечера. Громче Витька.',
                    '@show nu awk r',
                    'nu.awk: Ахах… ну… спасибо?',
                    'nar: Она улыбнулась. Неловко. Это было честно. И очень, очень громко.',
                    '@fx cringe'
                  ]
                },
                {
                  t: 'Соврать: «Ломовцева»',
                  fx: { rep: 2 },
                  then: [
                    'ru.smug: Ломовцева.',
                    'nik.shock: ЧТО?! Бро. Это моё. Это МОЁ.',
                    'nar: Никитос обижался полминуты. Все остальные ржали минуты три.'
                  ]
                },
                {
                  t: 'Пошутить: «Ласточка Коляна»',
                  fx: { rep: 1, self: 1 },
                  then: [
                    'ru.laugh: Ласточка. Коляна.',
                    'kol: (с кухни, спокойно) Понимаю. Взаимно не будет.',
                    'nar: Лучший ответ вечера. Даже Нюрка засмеялась.'
                  ]
                }
              ]
            }
          ]
        },
        {
          t: 'Действие',
          then: [
            'nik.smug: Окей. Крути бутылку. На кого покажет — с тем на балкон, на пять минут. Поговорить.',
            { mini: 'bottle', arg: 'Нюрка' },
            'nar: Бутылка показала на Нюрку. Бутылка, кажется, тоже читала сценарий.',
            'nar: «Ооооо». Нюрка закатила глаза, но кивнула: «Потом. Позже».',
            '@set balconyDare'
          ]
        }
      ]
    },
    '@hideall',
    '@mus calm',
    '@title СЦЕНА 3|Тост',
    'nar: Никитос стучит вилкой по стакану: «Руслан, ты у нас сценарист посвята — давай тост».',
    '@show nik smile r',
    '@show ru smile l',
    { write: 'toast' },
    '@hideall',
    '@title СЦЕНА 4|Фиалки',
    'nar: Огромный Витёк уснул в ванной. Среди хозяйкиных фиалок. Фиалки выжили. Витёк — тоже. Никитос сфотографировал это «для отчёта хозяйке».',
    '@show nik sad c',
    'nik.sad: Если хоть одна фиалка завянет — я съезжаю. В Бор. К Коляну.',
    '@hide nik',
    '@show kol smile r',
    '@show ru neutral l',
    '@title СЦЕНА 5|Кухня, час ночи',
    'kol: Знаешь, что я понял за этот вечер? Денчик может сварить пельмени в чём угодно. И ещё: ты весь вечер смотришь на дверь балкона.',
    'ru.nerv: Не смотрю.',
    'kol.smile: Смотришь. Я трезвый, я всё вижу.',
    '@sfx notif',
    '@phone Санёк|в сети',
    '< рус ты на тусе?? завидую',
    '< у меня кристина. смотрим её сериал. четвёртый сезон. и бля......',
    '< как там она? только не делай глупостей пьяный. нахуй тебе оно надо',
    { write: 'san_whine' },
    '@phoneoff',
    '@hideall',
    '@bg balcony',
    '@mus garland',
    '@title СЦЕНА 6|Балкон, 3 часа ночи',
    'nar: Холодно. Внизу Ванеева. Огни спальника. Идёт первый снег.',
    {
      if: s => s.flags.balconyDare,
      then: ['nar: Пять минут по правилам бутылки. Она вышла, кутаясь в чью-то куртку.'],
      else: ['nar: Он вышел подышать. Через минуту дверь скрипнула. Нюрка. Тоже подышать.']
    },
    '@show ru neutral l',
    '@show nu soft r',
    'nu.soft: Хорошо у Никитоса. Только холодно.',
    {
      if: s => s.flags.confess,
      then: [
        'in: Ты собирался сказать. Сегодня. Здесь.',
        'ru.nerv: Ань. Можно поговорить? Нормально. Без шуток.',
        'nu: …Давай.',
        'ru.nerv: Ты мне нравишься. Не как друг. Ты, наверное, и так знаешь.',
        'nu.sad: Знаю.',
        {
          if: s => (s.flags.spark || 0) >= 1,
          then: [
            'nu.awk: Руслан… я не знаю. Правда. После того вечера на мосту я… запуталась. Дай мне время. И не жди специально, ладно?',
            'nar: Это было не «нет». Это было «не дави». Огромная разница.'
          ],
          else: [
            'nu: Руслан, ты хороший. Правда. Но не в этом смысле.',
            'nu.sad: Мне неловко, когда ты всё делаешь за меня. Как будто я тебе должна. А я не могу дать то, чего ты хочешь.',
            'nu.cold: И я не хочу, чтобы ты надеялся. Это было бы нечестно.'
          ]
        },
        '@cg cg_side|Она отвернулась.',
        'nar: Она отвернулась. Не потому что ей похуй. Потому что ей неловко быть причиной чужой боли.',
        '@cgoff'
      ]
    },
    {
      h: 'БАЛКОН. 3:12. ЧТО ДЕЛАЕТ РУСЛАН?',
      c: [
        {
          t: 'Просто поговорить. О ерунде. Как с человеком',
          fx: { kom: 2, self: 1 },
          then: [
            '@cnt spark',
            'ru.smile: Слушай, а ты видела, как Денчик варил пельмени в чайнике?',
            'nu.laugh: Ахахах! Видела! Я думала, Никитос его убьёт!',
            'nar: Они говорили двадцать минут. Про пельмени, Казьбан, Висилицкую. Про то, кем хотели стать в детстве. Она — ветеринаром. Он — водителем трамвая.',
            'nu.soft: Руслан, с тобой нормально, когда ты… ну, не стараешься.',
            'nar: Второй раз за осень он это слышит. Может, это не случайность.'
          ]
        },
        {
          t: 'Попробовать её поцеловать (вы оба выпили)',
          fx: { cringe: 3, dep: 1, self: -2, kom: -2 },
          set: 'kissFail',
          then: [
            'nar: Он наклонился. Она отступила на шаг. Спокойно, без драмы.',
            'nu.awk: Руслан, не надо. Ты выпил. Я тоже. Давай не будем, ладно?',
            'ru.broken: Прости. Блять. Прости.',
            'nu.soft: Всё нормально. Просто не надо.',
            'nar: Она ушла внутрь. Он стоял на балконе ещё полчаса. Снег падал на его очки.',
            '@fx crash'
          ]
        },
        {
          t: 'Уйти к своим. Сегодня — без драмы',
          fx: { self: 1, grow: 1, rep: 1 },
          then: [
            'ru: Ладно, пойду. Там Витёк проснулся, надо проконтролировать.',
            'nu.laugh: Иди, спасатель.',
            'nar: Он ушёл. И, внезапно, ему было хорошо. Не потому что ушёл от неё. А потому что шёл к своим.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg flat day',
    '@mus calm',
    '@title УТРО|9:40',
    'nar: Квартира выглядит как после посвята, только без грамоты.',
    'nar: Огромный Витёк — в ванной. Денчик спит в обнимку с чайником. Владос монтирует. Какие-то чуваки исчезли так же загадочно, как появились. Никитос моет посуду и пересчитывает фиалки.',
    '@show kol smile r',
    '@show ru tired l',
    'kol: Доброе. Я сделал яичницу на всех. Сковородка у хозяйки одна, так что для сковородки это была долгая ночь.',
    {
      if: s => s.flags.kissFail,
      then: [
        'kol: И, бро. Про балкон. Я видел. Ничего не скажу. Ешь яичницу.',
        'ru.broken: Колян…',
        'kol.smile: Ешь. Яичница не осуждает.'
      ],
      else: [
        {
          if: s => s.flags.outed,
          then: [
            'kol.smile: Твоё «Нюрка» в бутылочке — уже мем потока. Владос вырезал отдельным видео.',
            'ru.cringe: Он что?..'
          ],
          else: ['kol: Нормально посидели. Ты вчера был нормальный, кстати. Я заметил.']
        }
      ]
    },
    '@sfx notif',
    '@phone Нюрка|в сети',
    {
      if: s => (s.flags.spark || 0) >= 2 && !s.flags.kissFail,
      then: [
        '@ini',
        '< доброе) спасибо за балкон. и за пельмени 😂',
        'in: Она написала. Утром. Просто так. Второй раз за неделю.'
      ],
      else: [
        {
          if: s => s.flags.kissFail,
          then: ['nar: Сообщений нет. Она ушла рано утром. Тихо, никого не разбудив.'],
          else: [
            '@ini biz',
            '< руслан, у тебя не осталось зарядки? я у никитоса свою забыла',
            'nar: Классика.'
          ]
        }
      ]
    },
    '@phoneoff',
    '@phone Группа ГМУ 🔥|28 участников',
    '<<Владос: [видео] «Денчик и чайник», режиссёрская версия',
    '<<Денчик: я требую гонорар',
    '<<Огромный Витёк: кто меня положил в ванную',
    '<<Никитос: ты сам. и фиалку ты мне должен',
    '<<Кирилл: а что за чуваки были вообще?',
    '<<Никитос: я думал, это твои',
    '<<Кирилл: я думал, твои',
    '@phoneoff',
    '@goto ch7'
  ],

  ch7: [
    '@chapter 7',
    '@mus night',
    '@bg room night',
    '@title ГЛАВА 7|Развилка',
    '@show ru neutral c',
    'nar: Ноябрь. Руслан смотрит в потолок. Ответов там нет. Есть трещина и одинокий паук.',
    '@sfx notif',
    '@phone Свои 🚗|Колян, Никитос, Кнаря, Санёк',
    '<<Колян: ласточка завелась с первого раза. это знак',
    '<<Никитос: фиалки живы. хозяйка ничего не узнала. я снова могу дышать',
    '<<Никитос: света хотела прийти, но у даши опять «срочно». седьмой раз за месяц',
    '<<Колян: пробка на мосту',
    '<<Санёк: заберите меня из маршал града. кристина опять. и бля......',
    '<<Кнаря: в субботу свадьба брата!!! того, с кольцом. все приглашены, отказ не принимается, мама уже посчитала вас в рассадке',
    '@phoneoff',
    'nar: Это момент выбора. Не её — его. От того, каким он стал за эту осень, зависит, какие двери вообще открыты.',
    {
      h: 'КЕМ ВЫЙДЕТ РУСЛАН ИЗ ЭТОЙ ОСЕНИ?',
      c: [
        {
          t: '«Мне похуй. Я занимаюсь собой»',
          need: { self: 7, grow: 6 },
          max: { dep: 4 },
          go: 'e_poh'
        },
        {
          t: '«Не бегать. Просто жить — и посмотреть, что будет»',
          need: { kom: 6, self: 6 },
          max: { dep: 5 },
          cnt: { spark: 2 },
          ft: '✨ был собой на мосту и на балконе',
          go: 'e_bokom'
        },
        { t: '«Свои, я выхожу. Погнали на Бор»', need: { rep: 6, grow: 3 }, go: 'e_pac' },
        {
          t: '«Кнаря, я иду на свадьбу!»',
          need: { rep: 5 },
          cnt: { kn: 3 },
          ft: '🍇 3+ разговора с Кнарей',
          go: 'e_tamada'
        },
        { t: '«Я подожду. Она когда-нибудь поймёт»', need: { ideal: 6 }, go: 'e_gats' },
        { t: '«Буду рядом. Как друг. Всегда»', go: 'e_friend' }
      ]
    }
  ],

  e_friend: [
    '@mus friendzone',
    '@bg corridor',
    'nar: Он остался рядом. Как друг. Звучит благородно. Пока не посмотришь, как это выглядит.',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini biz',
    '< руслан, ты в магазине? купи нам с девочками воды и чего-нибудь сладкого пж 🙏',
    '> куплю',
    '@ini biz',
    '< руслан, займи парту',
    '> занял',
    '@ini biz',
    '< руслан, а можешь курсач глянуть? 🥺',
    '> гляну',
    'nar: Посмотрите на счётчик. Она пишет первой. Всегда — по делу.',
    '@phoneoff',
    {
      if: s => s.flags.domashkin,
      then: [
        '@phone Группа ГМУ 🔥|28 участников',
        '<<Кирилл: руслан, эконометрику сделаешь?',
        '> да',
        '<<Денчик: и мне',
        '> да',
        '<<Вика: и нам с викой',
        '> да',
        '<<Софа: и нам с лизой презентацию',
        '> да',
        '<<Огромный Витёк: эссе. 15 страниц',
        '> ДА',
        '@phoneoff',
        'nar: К январю — 412 домашек. Ни одной своей. «Руслан Домашкин» вошёл в легенды потока.',
        '@cg cg_can|Памятник. Три энергетика. Вечная слава.',
        'nar: В компьютерном классе ему поставили памятник из трёх энергетиков. Каждый понедельник к нему приносят домашку.',
        '@cgoff'
      ]
    },
    '@show ru tired l',
    '@show nu smile r',
    'nu.smile: Руслан, ты лучший друг на свете. Серьёзно.',
    '@fx crash',
    'nar: Третий курс. У неё появился парень. Руслан помог ему с курсачом. По её просьбе. Парень протянул руку — и тетрадку.',
    '@hideall',
    '@title ПЯТЫЙ КУРС|Сообщение в 23:47',
    '@phone Нюрка|в сети',
    '@ini biz',
    '< руслан!!! я выхожу замуж 😭❤️',
    '< будешь моим свидетелем? ты же мой лучший друг',
    { write: 'nu_wed' },
    '@phoneoff',
    {
      if: s => s.flags.w_nu_wed === 'bound',
      then: [
        'nar: Он сказал «нет». Впервые за пять лет. Она удивилась. Но пришлось идти гостем — «ты же лучший друг». Он сидел за столиком у колонки. Тамада смотрел на него с жалостью.'
      ],
      else: [
        'nar: Свадьба. Руслан — свидетель. Тамада смотрит на него с жалостью. Колян узнал этот взгляд: такой же он видел на себе в школе.'
      ]
    },
    'nar: Через два года — крестины. Руслан — крёстный. Сына назвали в честь мужа.',
    '@show kol neutral r',
    '@show ru broken l',
    'kol: Бро. Семь лет. Я же тебя от свидетельства берёг. Ну… такое.',
    'san: (в трубку) Рус, я тебе с мая говорил. Нахуй тебе оно было надо? У меня вот с Кристиной тоже, и бля…… но не семь же лет!',
    'ru.broken: Я просто не хотел быть для неё никем.',
    'nar: Он и не был никем. Он был удобным. Иногда это хуже.',
    '@stamp ГЛУБОКАЯ ФРЕНДЗОНА: ПОЖИЗНЕННЫЙ АБОНЕМЕНТ',
    {
      epi: [
        [
          'ru',
          'Свидетель на её свадьбе. Крёстный её сына. До сих пор покупает ей воду, когда она просит.',
          'r_gray'
        ],
        [
          'nu',
          'Счастлива в браке. Искренне считает Руслана лучшим другом. Ни разу не спросила, как он.'
        ],
        [
          'kol',
          'Всё так же на ласточке. Каждый раз, когда Руслан берёт трубку на «купи воды», молча качает головой.'
        ],
        [
          'nik',
          'Женился на Свете. Пригласил Руслана — и посадил подальше от Нюрки. На всякий случай.'
        ],
        ['kn', 'Говорит «я же тебе говорила». Уже даже не злится. Просто приносит кофе.'],
        ['san', 'Так и встречается с Кристиной. И бля…… Но он хотя бы предупреждал.']
      ]
    },
    '@ending friend'
  ],

  e_poh: [
    '@mus growth',
    '@show ru grow c',
    'ru.grow: Нет. Хватит.',
    'ru: Я два месяца жил в режиме «а вдруг». Считал, кто первый пишет. Таскал раф. Ждал, заметит ли она, что меня нет.',
    'ru.grow: Мне это *нахуй не надо*.',
    '@fx realize',
    'nar: И тут что-то щёлкнуло. Не сердце. Позвоночник.',
    '@hideall',
    '@title НОЯБРЬ|Зал. Сон. Права. Телефон — в другой комнате.',
    '@bg city',
    '@show san smile r',
    '@show ru cool l suit',
    '@title ДЕКАБРЬ|Бот Санька продаёт уже не только Спотифай. Руслан — партнёр.',
    '@cg cg_suit|Руслан · зима · Маршал Град',
    'nar: Костюм сидит так, будто он в нём родился. Взгляд — будто он в нём ещё и всех уволил.',
    '@cgoff',
    'san.laugh: Бро, ты теперь выглядишь как человек, который продаёт подписки на жизнь.',
    'ru.cool: Санёк, а у вас с Кристиной как?',
    'san: Расстались. Стало легче. Я на тебя посмотрел и понял: нахуй надо, если ты всё время заёбан.',
    '@hideall',
    '@bg niu day car',
    '@show kol smile r',
    '@show ru cool l suit',
    'kol: …Ты за рулём ласточки. Сам. Ты сдал на права. Я сейчас тихо заплачу.',
    'ru.cool: Сдал. С первого раза. Двигайся, сегодня везу я.',
    '@hideall',
    '@bg lecture',
    '@mus garland',
    '@show vis smile c',
    'vis.smile: Ruslan! Look at you. Confident, calm. What happened?',
    'ru.cool: I stopped waiting.',
    'vis: Best answer this semester. Five.',
    '@hideall',
    'nar: А потом началось странное.',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini',
    '< руслан, привет) ты сегодня придёшь?',
    '@ini',
    '< ты куда пропал вообще?',
    '@ini',
    '< кнаря говорит, ты с саньком бизнес мутишь, это правда?? расскажи',
    'nar: Счётчик «📩 Она первой» за неделю вырос больше, чем за всю осень. Посмотрите сами.',
    'in: Бро… это то, чего мы ждали два месяца.',
    'ru.cool: Это то, чего ТЫ ждал два месяца.',
    '@ini',
    '< слушай, может погуляем как-нибудь?',
    { write: 'nu_late' },
    '@phoneoff',
    '@hideall',
    '@bg flat night',
    '@mus garland',
    '@title 31 ДЕКАБРЯ|Ванеева, 23:55',
    'nar: Снова квартира Никитоса. Те же гирлянды. Тот же чайник, переживший Денчика. Фиалки — живы.',
    '@show ru cool l suit',
    '@show nu soft r',
    'nar: Без пяти двенадцать. Она подходит сама.',
    'nu.soft: Руслан… можно я с тобой встречу? Ну, рядом постою.',
    {
      h: 'КУРАНТЫ. 23:59.',
      c: [
        {
          t: 'Чокнуться с ней — и пойти к своим',
          fx: { self: 1 },
          then: [
            'ru.cool: С Новым годом, Ань. Правда. Пусть у тебя всё будет хорошо.',
            'nar: Звон бокалов. Он развернулся и пошёл к Коляну, Никитосу и Кнаре, которые орали «ТРИ! ДВА! ОДИН!» так, что соседи снизу постучали по батарее. С Новым годом.'
          ]
        },
        {
          t: '«Я с пацанами, Ань. Прости»',
          then: [
            'ru: Я с пацанами, Ань. Прости.',
            'nu.sad: …Ладно.',
            'nar: Без злобы. Просто у него уже есть, с кем встречать.'
          ]
        }
      ]
    },
    '@hideall',
    '@bg volga night car',
    '@show kol smile ll',
    '@show ru grow c suit',
    '@show nik smile rr',
    'kol.smile: Рус. Говорят, Нюрка по тебе теперь вздыхает.',
    'ru.grow: Колян. Нахуй мне это надо?',
    'kol.laugh: Хах. Вот теперь ты говоришь как Санёк. Только спокойнее. Как я.',
    'nik.laugh: Записываю в историю группы. И Ломовцевой расскажу.',
    '@train',
    '@stamp ПОЕЗД УШЁЛ',
    'ru.grow: Я не стал лучше ради неё. Я просто наконец оказался на своей стороне.',
    {
      epi: [
        [
          'ru',
          'Партнёр Санька. Права, костюм, зал. Пишет первым только тем, кто пишет ему.',
          'r_suit'
        ],
        ['nu', 'Иногда пишет ему «как дела?». Он отвечает. Коротко. Вежливо. И всё.'],
        ['kol', 'Научил Руслана водить. Ласточку так и не доверил: «Это другое, бро».'],
        ['nik', 'Рассказал про Руслана Ломовцевой. Она поставила «отлично». Никитосу. За историю.'],
        ['kn', 'Всем говорит, что это она его вырастила. Отчасти права.'],
        ['san', 'Расстался с Кристиной. Выдохнул «и бля…» — но уже с облегчением.']
      ]
    },
    '@ending poh'
  ],

  e_bokom: [
    '@mus calm',
    '@bg niu day',
    'nar: Он не стал бегать. Не стал ждать у кофейни. Просто жил: пары, ласточка, Кнаря, Санёк, зал.',
    'nar: А потом случилось то, чего не ожидал вообще никто. Даже внутренний голос.',
    '@sfx notif',
    '@phone Нюрка|в сети',
    '@ini',
    '< руслан, привет) а ты что вечером делаешь?',
    '@ini',
    '< просто спрашиваю',
    'in: «Просто». Она написала «просто». Без «займи». Без «купи». Бро, я боюсь.',
    '@phoneoff',
    '@show kn shock r',
    '@show ru shock l',
    'kn.shock: Руслан. Руслан-джан. Сядь. Она у меня про тебя спрашивала. Не по делу. Спросила, есть ли у тебя кто-то. Я чуть кофе не уронила.',
    'ru.shock: Чего?',
    'kn.laugh: Я не знаю, что ты сделал на том мосту и на том балконе, но продолжай это делать. То есть — не делай ничего. Ты понял.',
    '@hideall',
    '@bg volga night',
    '@mus garland',
    '@show ru neutral l',
    '@show nu soft r',
    'nar: Набережная. Она сама предложила погулять. Огни на мосту — тот самый мост.',
    'nu.awk: Руслан. Я сама не понимаю, как так вышло. Ты же… ну… «не мой тип». Я так Кнаре и говорила.',
    'nu.soft: А потом ты перестал стараться. Перестал таскать мне воду. И я вдруг увидела тебя — нормального. Смешного. Который толкает ласточку под дождём, орёт про самокат и спасает пельмени из чайника.',
    'nu.soft: Короче. Ты мне нравишься. Каким-то боком. Сама в шоке.',
    '@fx heart',
    {
      h: 'ЧТО ОТВЕТИТ РУСЛАН?',
      c: [
        {
          t: '«Давай попробуем. Без спешки»',
          set: 'together',
          then: [
            'ru.smile: Давай попробуем. Только без спешки. И я больше не ношу тебе воду.',
            'nu.laugh: Договорились. Воду буду носить я.',
            'nar: Они начали медленно. По-честному. Она пишет первой — иногда. Он — иногда. Счётчик больше никто не ведёт.',
            '@show kol smile rr',
            'kol: …Ну. Бывает и так. Беру слова назад. Но ласточку ты всё равно не водишь.',
            '@phone Санёк|в сети',
            '< бро',
            '< исключение подтверждает правило',
            '< но я всё равно с мая был прав. наполовину',
            '@phoneoff'
          ]
        },
        {
          t: '«Ань, спасибо. Но я уже перегорел»',
          fx: { self: 1 },
          then: [
            'ru: Ань. Спасибо. Правда. Но я уже перегорел. Я очень долго ждал — и где-то по дороге отпустил.',
            'nu.sad: …Понимаю. Наверное, я сама виновата.',
            'ru.smile: Никто не виноват. Просто поезда ходят по расписанию.',
            'nar: Он ушёл вдоль Волги. Легко. Без драмы. Она смотрела ему вслед — впервые.'
          ]
        }
      ]
    },
    'nar: Она сама сделала первый шаг. Он просто перестал стоять у неё на пути.',
    '@stamp КАКИМ-ТО БОКОМ',
    {
      if: s => s.flags.together,
      then: [
        {
          epi: [
            ['ru', 'Встречается с Нюркой. Медленно, по-честному. Воду теперь носит она.'],
            ['nu', 'Говорит, что «не мой тип» — самая большая ошибка её второго курса.'],
            ['kol', '«Беру слова назад», — сказал Колян. — «Но ласточку ты всё равно не водишь».'],
            [
              'nik',
              'Устроил двойное свидание на Ванеева: он со Светой, Руслан с Нюркой. Без Денчика и чайника.'
            ],
            ['kn', 'Утверждает, что это она всё подстроила. Никто не спорит — себе дороже.'],
            [
              'san',
              'Пересмотрел картину мира. Но всё равно считает, что «с мая был прав. наполовину».'
            ]
          ]
        }
      ],
      else: [
        {
          epi: [
            ['ru', 'Ушёл вдоль Волги. Впервые не он ждал ответа — ответа ждали от него.'],
            ['nu', 'Смотрела ему вслед. Говорят, иногда до сих пор пишет «как дела?».'],
            ['kol', 'Сказал «уважаю» и подкинул до Бора. Молча.'],
            ['nik', 'Записал в историю группы: «Руслан — первый человек, отказавший Нюрке».'],
            ['kn', 'Неделю называла его «ледяной принц». С гордостью.'],
            ['san', '«Бро. Ты сделал то, чего я не могу с Кристиной. И бля…… уважаю».']
          ]
        }
      ]
    },
    '@ending bokom'
  ],

  e_pac: [
    '@mus calm',
    '@bg niu sunset car',
    '@show ru smile l',
    '@show kol smile r',
    'ru.smile: Свои. Выхожу.',
    'kol.smile: Ласточка. Он выходит.',
    'nar: Колян, Никитос, Кнаря, Руслан. По дороге забрали Санька из Маршал Града. Санёк сел назад с лицом человека, сбежавшего из плена. Кнаря сразу забрала у него наушник.',
    'kol: Последний заезд сезона. Руслан, держи руль. Я разрешаю. Один раз.',
    'ru.shock: Я?!',
    'kol.smile: Ты. Только в телефон не лезь. Она там не пишет. Я проверял.',
    { mini: 'drive' },
    '@bg volga night car',
    '@show kol laugh ll',
    '@show nik smile c',
    '@show san smile rr',
    'nar: Борский мост. Ночь. Огни в Волге. Ласточка дымит, музыка орёт, четыре долбоёба и Кнаря поют «Ламбаду». Кнаря громче всех.',
    'nik.smile: Пацаны, мы со Светой сегодня ходили в кино. Вдвоём. Без Даши. Я до сих пор не верю.',
    'san: А я Кристине ничего не написал. Я тут с вами. И бля…… хорошо мне. Впервые за месяц не заёбан.',
    'kol.laugh: А мне ласточка ответила: заглохла.',
    '@sfx car',
    '@hide san',
    '@show kn laugh rr',
    'kn.laugh: Колян, джан, толкать будешь сам, я в новой кофте!',
    '@hideall',
    '@show ru laugh c',
    'nar: Руслан смеётся. Громко, по-настоящему. Как в тот «лучший день» — только без неё.',
    'ru.think: Подожди…',
    '@fx realize',
    'ru: Это была не она. Энергия, смех, «я живой» — это были вы. Колян, Никитос, Кнаря, Санёк. Вы и были рядом, когда она подсаживалась.',
    '@show kol smile r',
    'kol.smile: Ну вот. А я молчал. Я всегда молча знаю.',
    'ru.laugh: Санёк бы сказал: «нахуй тебе оно надо». И был бы прав.',
    'san: (с заднего сиденья) Я и говорю! С мая!',
    'nar: Он не перестал с ней здороваться. Не стал злым. Просто однажды заметил, что не проверил, в сети ли она. И на следующий день тоже.',
    '@stamp ЛАСТОЧКА ДОВЕЗЛА',
    {
      epi: [
        ['ru', 'Перестал считать, кто пишет первым. Считает только километры по Борскому мосту.'],
        ['kol', 'Ласточка прошла техосмотр. Колян сказал «я не сомневался» и тихо выдохнул.'],
        [
          'nik',
          'Каждую пятницу — сбор на Ванеева. Света приходит. Даша — нет. Никитос считает это главной победой года.'
        ],
        ['kn', 'Добавила их всех в «Родню 🇦🇲». Бабушка поздравляет их со всеми праздниками.'],
        [
          'san',
          'Поругался с Кристиной в пятницу, помирился в субботу, в воскресенье опять на Бору. И бля…… но счастлив.'
        ],
        ['nu', 'Здоровается. Улыбается. Просто одногруппница. И это нормально.']
      ]
    },
    '@ending pac'
  ],

  e_tamada: [
    '@mus meme',
    '@bg hall',
    'nar: Суббота. Свадьба брата Кнари. Того самого, который уронил кольцо в Волгу и нашёл девушку-дайвера.',
    '@show kn shock r',
    '@show ru smile l',
    'kn.shock: Руслан-джан! Катастрофа! Тамада заболел! Дядя сказал — без тамады свадьбы нет! Ты же шутки пишешь! Выручай!',
    'ru.shock: Кнар, я… там сто восемьдесят человек!',
    'kn: Сто восемьдесят два. Тётя привела соседей.',
    '@fx realize',
    'nar: Микрофон. Свет. Сто восемьдесят два человека смотрят на Руслана. Первый тост — за тобой.',
    { write: 'wedtoast' },
    'nar: Дальше — как по маслу. Конкурсы. Танцы. Номер «Ласточка заглохла на Борском мосту» — в армянской версии. Колян сидел рядом с тётей Кнари, спокойно ел долму и один раз заметно растрогался. Никитос со Светой танцевали. Санёк продал подписки на Спотифай половине родственников.',
    '@show kn laugh r',
    'kn.laugh: Руслан. Моя бабушка сказала, что ты лучший тамада, которого видела наша семья. Это высшая награда. Выше только долма.',
    'nar: Его добавили в семейный чат «Родня 🇦🇲». Сто сорок участников.',
    '@phone Родня 🇦🇲|140 участников',
    '<<мама Кнари: Руслан-джан, доброе утро ☀️',
    '<<брат Кнари: Руслан, в мае ещё свадьба. Ты ведёшь',
    '<<бабушка Кнари: руслан кушай хорошо',
    '<<Кнаря: всё, ты друг нашей семьи навсегда 😂',
    '@phoneoff',
    'in: …Подожди. Нам каждый день пишут первыми. Просто так. Сто сорок человек.',
    'ru.laugh: И ни один из них не Нюрка. И мне охуенно.',
    '@stamp ЛУЧШИЙ ТАМАДА НИЖНЕГО',
    {
      epi: [
        [
          'ru',
          'Ведёт свадьбы по выходным. Записан на полгода вперёд. Сто сорок человек пишут ему «доброе утро».'
        ],
        [
          'kn',
          '«Я же говорила — мы тебя не отпустим». На всех его свадьбах сидит в первом ряду, как лучшая подруга.'
        ],
        [
          'kol',
          'Возит молодожёнов на ласточке. Белая, салон красный — идеальный кортеж. Тётя Кнари одобрила.'
        ],
        [
          'nik',
          'Попросил Руслана вести его свадьбу со Светой. Готовится как к экзамену у Ломовцевой. Даша приглашена — за дальний столик. Это было условие.'
        ],
        [
          'san',
          'Продаёт подписки гостям всех свадеб. Бизнес вырос втрое. Кристина ревнует к бизнесу. И бля……'
        ],
        ['nu', 'Пришла на одну из свадеб гостем. Руслан даже не сразу её заметил.']
      ]
    },
    '@ending tamada'
  ],

  e_gats: [
    '@mus fantasy',
    '@bg volga night',
    '@fant on',
    '@show ru cool l',
    '@show nu soft r',
    'nar: [СОН]',
    'nar: Во сне всё было легко. Темы появлялись сами. Он был интересным, расслабленным, смешным.',
    'nu.soft: Руслан, с тобой так легко. Почему мы раньше так не говорили?',
    'ru.cool: Не знаю. Наверное, я был слишком занят тем, чтобы тебе понравиться.',
    'nu.soft: А сейчас?',
    'ru.love: А сейчас просто хорошо.',
    '@fx heart',
    '@fx alarm',
    '@fant off',
    '@hideall',
    '@mus sad',
    '@bg room day',
    'nar: БЗЗЗЗ. 07:40. Пара у Грешновой через пятьдесят минут. Ему хуёво именно потому, что во сне он получил то, чего так хотел наяву.',
    '@bg volga night',
    '@filter saturate(.55) brightness(.85)',
    '@show ru sad c',
    'nar: Он решил ждать.',
    'nar: Он смотрит её сторис. Каждую. В первые десять секунд. Как Гэтсби смотрел на зелёный огонёк на том берегу.',
    'in: Она поймёт. Когда-нибудь. Увидит, какой ты, и поймёт.',
    'nar: Пацаны звали на Бор — он не поехал. Санёк звонил — он не брал. Кнаря приносила кофе — он говорил «потом».',
    '@phone Нюрка|была недавно',
    'nar: Однажды ночью он открыл чат и написал ей всё. Всё, что хотел сказать за эту осень.',
    { write: 'nu_unsent' },
    'nar: Палец завис над «отправить». И не нажал. Черновик сохранён. Навсегда.',
    '@phoneoff',
    '@hideall',
    '@cg cg_bw|Он перестал шутить.',
    'nar: Он мог бы сделать её счастливой. Он правда так думал. Но она не просила.',
    'nar: На том берегу, на Бору, мигает огонёк. Колян говорит, это фонарь на заправке.',
    '@cgoff',
    '@show ru broken c',
    'ru.broken: У Гэтсби хотя бы была Дейзи.',
    'nar: А у Руслана были Колян с ласточкой, Никитос, Кнаря, Санёк. Он просто смотрел не на тот берег.',
    {
      epi: [
        [
          'ru',
          'Ждёт. Смотрит её сторис в первые десять секунд. Черновик в телефоне так и не отправлен.',
          'r_gray'
        ],
        ['nu', 'Живёт свою жизнь. Не знает про черновик. И не должна.'],
        ['kol', 'Каждую пятницу пишет «бро, на Бор?». Каждую пятницу — «потом». Пишет всё равно.'],
        ['nik', 'Оставляет ему место на паре у Ломовцевой. Место пустует.'],
        ['kn', 'Оставляет ему кофе на лавочке у корпуса. Иногда он забирает.'],
        ['san', 'Перестал говорить «нахуй тебе оно надо». Теперь просто звонит. Каждый вечер.']
      ]
    },
    '@ending gats'
  ]
};

'use strict';
// ================= BOOT =================
IMG.cg_zhiga = makeZhigaCG();
applySet();
updHud();
showMenu();
requestAnimationFrame(frame);
(() => {
  const m = location.hash.match(/lab=(\w+)/);
  if (m && SCN[m[1]]) newGame(m[1]);
})();
window.__nmt = { G: () => G, SCN, newGame, advance, MODE };
