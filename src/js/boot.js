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
