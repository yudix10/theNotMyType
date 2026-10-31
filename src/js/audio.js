'use strict';
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
