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
