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
