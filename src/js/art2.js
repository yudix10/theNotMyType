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
