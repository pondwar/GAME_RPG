// js/palace.js - Palacio de Zeus, no topo do Olympus Mons (u=0.20, v=0.22).
// Construido por codigo com as mesmas pecas do construtor (muros, pisos, escadas, telhados, moveis) + arte nova
// (marmore gelado, tapete, coluna, estatua, trono, braseiro). As pecas sao 'temp' (nao entram no save do jogador)
// e sao recriadas a cada carga. Tudo fica numa malha de losangos de 108x54 cujo centro e o ponto abaixo.
(function () {
  const U = 0.20, V = 0.22;
  // vertice (a,b) da malha e centro de celula (i,j) -> mundo
  function make(game) {
    const A = game.architect, W = game.world, fr = game.structures.frames, DS = window.DungeonSnap;
    let ox = Math.round(W.WORLD_WIDTH * U / 54) * 54, oy = Math.round(W.WORLD_HEIGHT * V / 27) * 27;
    if ((((ox / 54) - (oy / 27)) % 2 + 2) % 2) oy += 27;                       // mesma paridade da malha de pisos do jogo (origem 0,0)
    const Vx = (a, b) => ox + (a - b) * 54, Vy = (a, b) => oy + (a + b) * 27 - 27;
    const Cx = (i, j) => ox + (i - j) * 54, Cy = (i, j) => oy + (i + j) * 27;
    const T = (name) => 'dungeon_' + name;

    function remove() { for (const k of Object.keys(A.blocks)) if (A.blocks[k].palace) delete A.blocks[k]; }
    remove();

    const mark = (b) => { if (b) { b.palace = true; b.temp = true; } return b; };

    // ---- muros ----
    function sock(type) { const cfg = A.BLOCK_TYPES[type]; return DS.localSockets(fr[cfg.sprite])[0]; }
    function wallAt(type, a, b, flip, z) {                                     // ponta A no vertice (a,b)
      const s = sock(type), m = flip ? -1 : 1;
      return mark(A.addDungeonPiece(type, Math.round(Vx(a, b) - m * s.x), Math.round(Vy(a, b) - s.y), flip, { z: z || 0, temp: true }));
    }
    // corrida de muros de 'len' celulas a partir de (a,b) na direcao i (flip=false) ou j (flip=true)
    // gap = [inicio,fim) em celulas relativas onde NAO ha muro (vao do portal)
    function run(a, b, dir, len, opts) {
      opts = opts || {}; const flip = dir === 'j', z = opts.z || 0;
      const long = opts.long || 'marble_wall', short = opts.short || 'marble_wall_short';
      let t = 0; const step = (c) => { const q = dir === 'i' ? [a + t, b] : [a, b + t]; wallAt(T(c), q[0], q[1], flip, z); t += (c === short ? 1 : 2); };
      const odd = len % 2, shortEnd = odd && opts.gap && (opts.gap[0] % 2 === 0);      // a peca curta vai onde mantem o vao alinhado
      if (odd && !shortEnd) step(short);
      const limit = shortEnd ? len - 1 : len;
      while (t < limit) {
        if (opts.gap && t >= opts.gap[0] && t < opts.gap[1]) { t += 2; continue; }
        step(long);
      }
      if (shortEnd) step(short);
    }
    function corner(a, b, z) {                                                // quina convexa (ponta sul) no vertice (a,b)
      const type = T('marble_corner'), cfg = A.BLOCK_TYPES[type];
      return mark(A.addDungeonPiece(type, Math.round(Vx(a, b)), Math.round(Vy(a, b)), false, { z: z || 0, temp: true }));
    }
    function portal(a, b, dir, z) {                                           // portal largo ocupando 2 celulas a partir de (a,b)
      const type = T('marble_portal_wide'), s = sock(type), flip = dir === 'j', m = flip ? -1 : 1;
      return mark(A.addDungeonPiece(type, Math.round(Vx(a, b) - m * s.x), Math.round(Vy(a, b) - s.y), flip, { z: z || 0, temp: true }));
    }
    // retangulo de muros: vertices a0..a1, b0..b1. Quina sul em (a1,b1). gate = {side:'b1', at:a} (portal de 2 celulas)
    function box(a0, a1, b0, b1, o) {
      o = o || {}; const levels = o.levels || 1;
      for (let z = 0; z < levels; z++) {
        const gapS = o.gateS !== undefined ? [o.gateS - a0, o.gateS - a0 + 2] : null;
        run(a0, b0, 'i', a1 - a0, { z });                                     // aresta superior direita (T->E)
        run(a0, b0, 'j', b1 - b0, { z });                                     // aresta superior esquerda (T->W)
        run(a0, b1, 'i', a1 - 1 - a0, { z, gap: gapS });                      // aresta inferior esquerda (W->S) sem a ultima celula
        run(a1, b0, 'j', b1 - 1 - b0, { z });                                 // aresta inferior direita (E->S)
        corner(a1, b1, z);
      }
      if (o.gateS !== undefined) portal(o.gateS, b1, 'i', 0);
    }

    // ---- pisos ----
    const hash = (i, j, s) => { let h = Math.imul(i + 1013, 374761393) ^ Math.imul(j + 7919, 668265263) ^ Math.imul(s + 1, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const cellKey = {};
    function floor(type, i, j, z) {
      const ck = (z || 0) + '|' + i + '|' + j; if (cellKey[ck]) delete A.blocks[cellKey[ck]];
      const G = A.GRID_SIZE, x = Cx(i, j), y = Cy(i, j), gx = A.normGX(Math.floor(W.wrapX(x) / G)), gy = Math.floor(y / G);
      const base = z ? `0:${gx},${gy},z${z}` : `0:${gx},${gy}`; let key = base, n = 0; while (A.blocks[key]) key = `${base}#${++n}`;
      const b = { type: T(type), gx, gy, wx: Math.round(W.wrapX(x)), wy: Math.round(y), rot: 0, layer: 0, height: 1, isOpen: false, placedAt: 0, palace: true, temp: true };
      if (z) b.z = z; A.blocks[key] = b; cellKey[ck] = key; return b;
    }
    const marbleTile = (i, j) => ((i + j) & 1) ? 'floor_slate_0' + (1 + (hash(i, j, 1) * 2 | 0)) : 'floor_marble_0' + (1 + (hash(i, j, 2) * 3 | 0));
    function rug(set, z) {                                                     // set: Set 'i,j'
      for (const k of set) {
        const [i, j] = k.split(',').map(Number);
        const m = (set.has((i + 1) + ',' + j) ? 0 : 1) | (set.has((i - 1) + ',' + j) ? 0 : 2) | (set.has(i + ',' + (j + 1)) ? 0 : 4) | (set.has(i + ',' + (j - 1)) ? 0 : 8);
        floor('floor_rug_' + String(m).padStart(2, '0'), i, j, z);
      }
    }

    // ---- moveis / decoracao (celula ou ponto livre) ----
    function furn(type, i, j, rot, z) {
      const x = Cx(i, j), y = Cy(i, j), G = A.GRID_SIZE, wx = W.wrapX(x), gx = A.normGX(Math.floor(wx / G)), gy = Math.floor(y / G);
      let key = `f:${gx},${gy}${z ? ',z' + z : ''}`, n = 0; while (A.blocks[key]) key = `f:${gx},${gy}${z ? ',z' + z : ''}#${++n}`;
      const b = { type: T('furn_' + type), gx, gy, layer: 9, wx: Math.round(wx), wy: Math.round(y), rot: rot || 0, z: z || 0, placedAt: 0, palace: true, temp: true };
      A.blocks[key] = b; return b;
    }
    function stair(i, j, flip, z) { return mark(A.addDungeonPiece(T('stair_marble_01'), Cx(i, j), Cy(i, j), flip, { z: z || 0, temp: true })); }
    function roof(style, a0, a1, b0, b1, z) {                                  // cobre os vertices a0..a1 x b0..b1 (celulas a0..a1-1)
      const Wc = a1 - a0, Dc = b1 - b0, G = A.GRID_SIZE, tx = Vx(a0, b0), ty = Vy(a0, b0), wxn = W.wrapX(tx);
      const gx = A.normGX(Math.floor(wxn / G)), gy = Math.floor(ty / G);
      let key = `r:${gx},${gy},z${z}`, n = 0; while (A.blocks[key]) key = `r:${gx},${gy},z${z}#${++n}`;
      A.blocks[key] = { type: T('roof_' + style), gx, gy, layer: 9, wx: Math.round(wxn), wy: Math.round(ty), W: Wc, D: Dc, ridge: Wc >= Dc ? 'a' : 'b', z, rot: 0, height: 1, placedAt: 0, palace: true, temp: true };
    }

    // =====================================================================
    // PLANTA (celulas i,j; vertices a,b).  Eixo do palacio: vertice a=0; portao ao sul-oeste (b=11); salao do trono ao norte.
    // =====================================================================
    const P = { a0: -11, a1: 11, b0: -11, b1: 11 };

    // 1) piso do patio
    for (let i = P.a0; i < P.a1; i++) for (let j = P.b0; j < P.b1; j++) floor(marbleTile(i, j), i, j, 0);
    // praça central com medalhoes do raio
    for (let i = -4; i < 4; i++) for (let j = 1; j < 6; j++) floor(((i + j) & 1) ? 'floor_marble_01' : 'floor_marble_02', i, j, 0);
    for (const [i, j] of [[-1, 2], [0, 2], [-1, 4], [0, 4], [-2, 3], [1, 3], [-3, 1], [2, 1], [-3, 5], [2, 5]]) floor('floor_bolt_01', i, j, 0);

    // 2) tapete real: portao -> praca -> salao
    const R = new Set();
    for (let j = 6; j <= 10; j++) { R.add('-1,' + j); R.add('0,' + j); }
    for (let j = -9; j <= 0; j++) { R.add('-1,' + j); R.add('0,' + j); }

    // (o tapete e pintado depois do piso do salao)
    // 3) muralha dupla de marmore com portao
    box(P.a0, P.a1, P.b0, P.b1, { levels: 2, gateS: -1 });

    // 4) Grande Salao do Trono: vertices a -6..6, b -10..-2 ; muros altos (2) e telhado de ardosia
    const H = { a0: -6, a1: 6, b0: -10, b1: -2 };
    for (let i = H.a0; i < H.a1; i++) for (let j = H.b0; j < H.b1; j++) floor(marbleTile(i + 3, j), i, j, 0);
    box(H.a0, H.a1, H.b0, H.b1, { levels: 2, gateS: -1 });
    roof('slate', H.a0, H.a1, H.b0, H.b1, 2);
    rug(R, 0);

    // 5) plataforma do trono (andar 1) + escadaria
    for (let i = -5; i < 5; i++) for (let j = -10; j < -7; j++) { if (j === -8 && i >= -2 && i < 2) continue; floor(((i + j) & 1) ? 'floor_slate_01' : 'floor_marble_01', i, j, 1); }
    for (let i = -2; i < 2; i++) stair(i, -8, true, 0);
    rug(new Set(['-1,-10', '0,-10', '-1,-9', '0,-9']), 1);
    furn('throne', -0.5, -10, 0, 1);
    for (const i of [-4, 3]) { furn('brazier', i, -9, 0, 1); }
    for (const i of [-3, 2]) furn('banner', i, -10, 0, 1);

    // 6) colunas do salao, mesas de banquete nas naves laterais, candelabros
    for (const j of [-8, -6, -4]) { furn('column', -3, j, 0, 0); furn('column', 2, j, 0, 0); }
    for (const j of [-6, -5, -4]) {
      furn('table', -5, j, 0, 0); furn('chair', -6, j, 0, 0); furn('chair', -4, j, 180, 0);
      furn('table', 4, j, 0, 0); furn('chair', 3, j, 0, 0); furn('chair', 5, j, 180, 0);
    }
    for (const [i, j] of [[-5, -8], [4, -8], [-3, -3], [2, -3]]) furn('candelabra', i, j, 0, 0);

    // 7) patio: colunas da avenida, braseiros, estandartes, estatua de Zeus
    for (const j of [9, 7]) { furn('column', -3, j, 0, 0); furn('column', 2, j, 0, 0); furn('brazier', -2, j, 0, 0); furn('brazier', 1, j, 0, 0); }
    furn('banner', -2, 10, 0, 0); furn('banner', 1, 10, 0, 0);
    furn('statue_zeus', -0.5, 3, 0, 0);
    for (const [i, j] of [[-4, 0], [3, 0]]) furn('brazier', i, j, 0, 0);

    // 8) cristais de gelo fora da muralha
    for (const [a, b, s] of [[-13, -4, 0], [-13, 5, 1], [13, -2, 0], [13, 7, 1], [-5, -13, 1], [6, -13, 0], [-9, 13, 0], [9, 13, 1]]) furn('spire', a, b, 0, 0);

    A._ec = null; A._fl = null;
    game.palaceOrigin = { x: ox, y: oy };
    return { ox, oy };
  }

  window.ZeusPalace = { build: make };
})();
