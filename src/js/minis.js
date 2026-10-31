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
