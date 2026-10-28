// Moveis desenhados por codigo (caixas isometricas) para a malha de pisos: eixos a=(54,27) e b=(-54,27), altura em px.
// FurnitureRenderer.sprite(kind, rot, mask) -> { canvas, ox, oy }  (ox,oy = pixel do CENTRO da celula ancora, no plano do piso)
// FurnitureRenderer.flame(ctx, x, y, t, s) desenha uma chama animada (usada ao vivo, nao entra no cache).
(function () {
  const WOOD = { top: '#a97a4c', left: '#80583a', right: '#6a4727', line: '#2b1a0e' };
  const DARKWOOD = { top: '#7c5534', left: '#5e3e26', right: '#4b311e', line: '#22140a' };
  const STONE = { top: '#9a968c', left: '#7a766d', right: '#625f58', line: '#2a2824' };
  const STONE2 = { top: '#8a867c', left: '#6c6860', right: '#56534c', line: '#26241f' };
  const IRON = { top: '#55575c', left: '#3d3f43', right: '#2f3033', line: '#151618' };
  const CREAM = { top: '#efe6cf', left: '#cfc4a8', right: '#b8ad92', line: '#6e6450' };
  const RED = { top: '#a33a35', left: '#842c28', right: '#6b2320', line: '#3a110f' };
  const BLUE = { top: '#3d5f9a', left: '#31497a', right: '#283c64', line: '#121a2e' };
  const WAX = { top: '#f3ead2', left: '#d8cdb0', right: '#bfb498', line: '#6a604a' };

  const pt = (a, b, h) => [Math.round(54 * (a - b)), Math.round(27 * (a + b) - h)];

  function make(w, h) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return cv; }
  function poly(ctx, pts, fill, line) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); }
  }
  // caixa: a0..a1, b0..b1 (celulas), h0..h1 (px). o = origem em pixels
  function box(ctx, o, a0, a1, b0, b1, h0, h1, c, planks) {
    const p = (a, b, h) => { const q = pt(a, b, h); return [q[0] + o[0], q[1] + o[1]]; };
    poly(ctx, [p(a0, b1, h0), p(a1, b1, h0), p(a1, b1, h1), p(a0, b1, h1)], c.left, c.line);      // face +b (esquerda-frente)
    poly(ctx, [p(a1, b0, h0), p(a1, b1, h0), p(a1, b1, h1), p(a1, b0, h1)], c.right, c.line);     // face +a (direita-frente)
    poly(ctx, [p(a0, b0, h1), p(a1, b0, h1), p(a1, b1, h1), p(a0, b1, h1)], c.top, c.line);        // topo
    if (planks) {                                                                                  // tabuas no topo
      ctx.strokeStyle = 'rgba(40,24,10,0.35)'; ctx.lineWidth = 1;
      const n = Math.max(1, Math.round((b1 - b0) / 0.17));
      for (let i = 1; i < n; i++) { const b = b0 + (b1 - b0) * i / n, s = p(a0, b, h1), e = p(a1, b, h1); ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); }
    }
  }

  const SIZE = { w: 330, h: 300, ox: 165, oy: 215 };     // tela generica (cabe cama 1x2 e lareira alta)

  function newSprite(w, h, ox, oy) { const cv = make(w || SIZE.w, h || SIZE.h); const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false; return { cv, ctx, o: [ox === undefined ? SIZE.ox : ox, oy === undefined ? SIZE.oy : oy] }; }
  function trim(S) {
    const { cv, ctx, o } = S; const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let x0 = cv.width, y0 = cv.height, x1 = 0, y1 = 0;
    for (let y = 0; y < cv.height; y++) for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < x0) return { canvas: cv, ox: o[0], oy: o[1] };
    const out = make(x1 - x0 + 1, y1 - y0 + 1); out.getContext('2d').drawImage(cv, -x0, -y0);
    return { canvas: out, ox: o[0] - x0, oy: o[1] - y0 };
  }

  // ---------- pecas ----------
  function table(mask) {   // mask: bit0 = vizinho em +a, bit1 = -a, bit2 = +b, bit3 = -b
    const S = newSprite(), { ctx, o } = S;
    const ap = !!(mask & 1), am = !!(mask & 2), bp = !!(mask & 4), bm = !!(mask & 8);
    const a0 = am ? -0.5 : -0.44, a1 = ap ? 0.5 : 0.44, b0 = bm ? -0.5 : -0.44, b1 = bp ? 0.5 : 0.44;
    const legs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];        // (sa, sb)
    legs.sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]));
    for (const [sa, sb] of legs) {
      if ((sa < 0 && am) || (sa > 0 && ap) || (sb < 0 && bm) || (sb > 0 && bp)) continue;
      const ca = sa * 0.34, cb = sb * 0.34;
      box(ctx, o, ca - 0.06, ca + 0.06, cb - 0.06, cb + 0.06, 0, 26, DARKWOOD);
    }
    box(ctx, o, a0, a1, b0, b1, 26, 33, WOOD, true);
    return trim(S);
  }
  function chair(rot) {
    const S = newSprite(), { ctx, o } = S;
    const back = (r, front) => {
      const t = 0.07, e = 0.3;
      if (r === 0) box(ctx, o, -e - t, -e, -e, e, 16, 46, WOOD);            // costas em -a
      if (r === 90) box(ctx, o, -e, e, -e - t, -e, 16, 46, WOOD);           // costas em -b
      if (r === 180) box(ctx, o, e, e + t, -e, e, 16, 46, WOOD);            // costas em +a
      if (r === 270) box(ctx, o, -e, e, e, e + t, 16, 46, WOOD);            // costas em +b
    };
    const far = (rot === 0 || rot === 90);
    for (const [sa, sb] of [[-1, -1], [1, -1], [-1, 1], [1, 1]].sort((p, q) => (p[0] + p[1]) - (q[0] + q[1]))) box(ctx, o, sa * 0.24 - 0.035, sa * 0.24 + 0.035, sb * 0.24 - 0.035, sb * 0.24 + 0.035, 0, 15, DARKWOOD);
    if (far) back(rot);
    box(ctx, o, -0.3, 0.3, -0.3, 0.3, 15, 20, WOOD, true);
    box(ctx, o, -0.25, 0.25, -0.25, 0.25, 20, 22, RED);                 // almofada
    if (!far) back(rot);
    return trim(S);
  }
  function bed(rot, pal) {    // cabeceira em u-min (rot 0/90) ou u-max (180/270); eixo a (0,180) ou b (90,270); ocupa a celula ancora e a seguinte
    const S = newSprite(), { ctx, o } = S, axisB = (rot === 90 || rot === 270), headMax = (rot === 180 || rot === 270);
    const B = (u0, u1, v0, v1, h0, h1, c, pl) => axisB ? box(ctx, o, v0, v1, u0, u1, h0, h1, c, pl) : box(ctx, o, u0, u1, v0, v1, h0, h1, c, pl);
    const m = (u) => headMax ? 1 - u : u;            // espelha ao longo do eixo (u in [-0.5,1.5] -> centro 0.5)
    const U = (u0, u1) => { const a = m(u0), b = m(u1); return a < b ? [a, b] : [b, a]; };
    const fab = pal || RED;
    const parts = [];
    parts.push([...U(-0.5, 1.5), -0.46, 0.46, 0, 11, WOOD, false]);                       // estrado
    parts.push([...U(-0.43, 1.43), -0.4, 0.4, 11, 19, CREAM, false]);                      // colchao
    parts.push([...U(0.38, 1.43), -0.42, 0.42, 14, 23, fab, false]);                       // coberta
    parts.push([...U(-0.38, 0.1), -0.3, 0.3, 19, 25, WAX, false]);                         // travesseiro
    parts.push([...U(-0.5, -0.41), -0.46, 0.46, 0, 40, DARKWOOD, false]);                  // cabeceira
    parts.push([...U(1.41, 1.5), -0.46, 0.46, 0, 24, DARKWOOD, false]);                    // peseira
    // ordem fundo -> frente: pelo valor de u (maior = mais perto)
    const key = (p) => p[0] + p[1];
    parts.sort((p, q) => (axisB ? 0 : 0) + (key(p) - key(q)) || (p[6] === undefined ? 0 : p[4] - q[4]));
    // as caixas dentro de cada faixa seguem a ordem de u; estrado primeiro
    const order = parts.slice().sort((p, q) => (Math.max(p[0], p[1]) - Math.max(q[0], q[1])) || (p[4] - q[4]));
    order.sort((p, q) => { const pe = (p[4] === 0 && p[5] === 11) ? -1 : 0, qe = (q[4] === 0 && q[5] === 11) ? -1 : 0; return pe - qe || ((Math.max(p[0], p[1]) + p[4] * 0.001) - (Math.max(q[0], q[1]) + q[4] * 0.001)); });
    for (const p of order) B(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
    return trim(S);
  }
  function fireplace(rot) {  // rot 0: boca na face +b (esq-frente); rot 90: face +a (dir-frente)
    const S = newSprite(), { ctx, o } = S;
    const face = (rot === 90) ? 'a' : 'b';
    const p = (a, b, h) => { const q = pt(a, b, h); return [q[0] + o[0], q[1] + o[1]]; };
    box(ctx, o, -0.46, 0.46, -0.46, 0.46, 0, 40, STONE);
    // fileiras de pedra
    ctx.strokeStyle = 'rgba(30,28,24,0.55)'; ctx.lineWidth = 1;
    for (let h = 8; h < 40; h += 8) {
      const s1 = p(-0.46, 0.46, h), e1 = p(0.46, 0.46, h); ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.lineTo(e1[0], e1[1]); ctx.stroke();
      const s2 = p(0.46, -0.46, h), e2 = p(0.46, 0.46, h); ctx.beginPath(); ctx.moveTo(s2[0], s2[1]); ctx.lineTo(e2[0], e2[1]); ctx.stroke();
    }
    // boca da lareira
    const q = (t, h) => face === 'b' ? p(t, 0.46, h) : p(0.46, t, h);
    poly(ctx, [q(-0.3, 3), q(0.3, 3), q(0.3, 26), q(-0.3, 26)], '#150a06', '#0a0503');
    poly(ctx, [q(-0.22, 3), q(0.22, 3), q(0.22, 13), q(-0.22, 13)], '#7a2a0a', null);        // brasas
    // viga de pedra acima
    poly(ctx, [q(-0.34, 26), q(0.34, 26), q(0.34, 31), q(-0.34, 31)], '#aaa59a', '#2a2824');
    // chamine
    box(ctx, o, -0.3, 0.3, -0.3, 0.3, 40, 118, STONE2);
    box(ctx, o, -0.35, 0.35, -0.35, 0.35, 118, 126, STONE);
    // soleira
    if (face === 'b') box(ctx, o, -0.36, 0.36, 0.46, 0.62, 0, 3, STONE2); else box(ctx, o, 0.46, 0.62, -0.36, 0.36, 0, 3, STONE2);
    return trim(S);
  }
  function candelabra() {
    const S = newSprite(), { ctx, o } = S;
    box(ctx, o, -0.13, 0.13, -0.13, 0.13, 0, 4, IRON);
    box(ctx, o, -0.03, 0.03, -0.03, 0.03, 4, 38, IRON);
    box(ctx, o, -0.2, 0.2, -0.025, 0.025, 38, 41, IRON);        // braco em a
    box(ctx, o, -0.025, 0.025, -0.2, 0.2, 38, 41, IRON);        // braco em b
    for (const [a, b] of [[-0.2, 0], [0.2, 0], [0, -0.2], [0, 0.2], [0, 0]]) box(ctx, o, a - 0.035, a + 0.035, b - 0.035, b + 0.035, 41, (a === 0 && b === 0) ? 54 : 49, WAX);
    return trim(S);
  }
  // Altura maxima dos moveis = MAX_H (abaixo do topo do muro, 77 px): o telhado assenta no topo do muro,
  // entao qualquer coisa mais alta fura o telhado. So a chamine da lareira passa de proposito.
  const MAX_H = 72;
  function lantern() {
    const S = newSprite(), { ctx, o } = S;
    box(ctx, o, -0.1, 0.1, -0.1, 0.1, 0, 5, IRON);
    box(ctx, o, -0.035, 0.035, -0.035, 0.035, 5, 44, IRON);
    box(ctx, o, -0.13, 0.13, -0.13, 0.13, 44, 47, IRON);
    box(ctx, o, -0.1, 0.1, -0.1, 0.1, 47, 63, { top: '#ffe28a', left: '#f4b844', right: '#d9942a', line: '#3a2810' });   // vidro aceso
    box(ctx, o, -0.15, 0.15, -0.15, 0.15, 63, 67, IRON);
    box(ctx, o, -0.04, 0.04, -0.04, 0.04, 67, MAX_H, IRON);
    return trim(S);
  }


  // ---------- lote 2 ----------
  const COUNTER = { top: '#b98a58', left: '#6e4a2c', right: '#573a22', line: '#22140a' };
  const GLASS = ['#2f5a3a', '#6b2a2a', '#3d4f7a', '#5a4a24', '#4a2f4f'];
  // desenha uma face vertical (fixa em a=a0 ou b=b0) como um quadrilatero parametrizado
  function facePt(o, fixed, val, u, h) { const q = fixed === 'a' ? pt(val, u, h) : pt(u, val, h); return [q[0] + o[0], q[1] + o[1]]; }

  function counter(mask) {     // bit0 +a, bit1 -a, bit2 +b, bit3 -b (vizinhos ligam)
    const S = newSprite(), { ctx, o } = S;
    const ap = !!(mask & 1), am = !!(mask & 2), bp = !!(mask & 4), bm = !!(mask & 8);
    const a0 = am ? -0.5 : -0.46, a1 = ap ? 0.5 : 0.46, b0 = bm ? -0.5 : -0.46, b1 = bp ? 0.5 : 0.46;
    box(ctx, o, a0, a1, b0, b1, 0, 31, COUNTER);
    // almofadas (paineis) nas faces visiveis: +b (esquerda-frente) e +a (direita-frente)
    ctx.strokeStyle = 'rgba(20,10,4,0.55)'; ctx.lineWidth = 1;
    const panel = (fixed, val, u0, u1) => {
      const n = Math.max(1, Math.round((u1 - u0) / 0.5));
      for (let i = 0; i < n; i++) {
        const ua = u0 + (u1 - u0) * i / n + 0.05, ub = u0 + (u1 - u0) * (i + 1) / n - 0.05;
        const p = [facePt(o, fixed, val, ua, 5), facePt(o, fixed, val, ub, 5), facePt(o, fixed, val, ub, 24), facePt(o, fixed, val, ua, 24)];
        poly(ctx, p, 'rgba(0,0,0,0.16)', 'rgba(20,10,4,0.6)');
        const hl = [facePt(o, fixed, val, ua, 24), facePt(o, fixed, val, ub, 24)]; ctx.strokeStyle = 'rgba(255,220,170,0.25)'; ctx.beginPath(); ctx.moveTo(hl[0][0], hl[0][1] + 1); ctx.lineTo(hl[1][0], hl[1][1] + 1); ctx.stroke();
      }
    };
    if (!bp) panel('b', b1, a0 + 0.02, a1 - 0.02);
    if (!ap) panel('a', a1, b0 + 0.02, b1 - 0.02);
    // tampo com borda
    box(ctx, o, a0 - (am ? 0 : 0.03), a1 + (ap ? 0 : 0.03), b0 - (bm ? 0 : 0.03), b1 + (bp ? 0 : 0.03), 31, 36, { top: '#cf9f68', left: '#8a6238', right: '#6e4c2c', line: '#22140a' }, true);
    return trim(S);
  }
  function counterBig(rot) {   // 2 celulas ao longo de a (rot 0) ou b (rot 90); tampo com canecas, trilho nas costas
    const S = newSprite(), { ctx, o } = S, axisB = (rot === 90 || rot === 270);
    const B = (u0, u1, v0, v1, h0, h1, c, pl) => axisB ? box(ctx, o, v0, v1, u0, u1, h0, h1, c, pl) : box(ctx, o, u0, u1, v0, v1, h0, h1, c, pl);
    B(-0.5, 1.5, -0.36, 0.36, 0, 36, COUNTER);
    // paineis na face da frente (+b se ao longo de a; +a se ao longo de b)
    const fixed = axisB ? 'a' : 'b', val = 0.36;
    for (let i = 0; i < 4; i++) {
      const ua = -0.5 + 0.5 * i + 0.05, ub = ua + 0.4;
      const P = (u, h) => facePt(o, fixed, val, u, h);
      poly(ctx, [P(ua, 6), P(ub, 6), P(ub, 29), P(ua, 29)], 'rgba(0,0,0,0.16)', 'rgba(20,10,4,0.6)');
    }
    B(-0.56, 1.56, -0.42, 0.42, 36, 42, { top: '#cf9f68', left: '#8a6238', right: '#6e4c2c', line: '#22140a' }, true);
    // canecas
    for (const [u, v] of [[0.0, 0.0], [0.5, -0.12], [1.0, 0.12], [1.35, 0]]) B(u - 0.05, u + 0.05, v - 0.05, v + 0.05, 42, 53, { top: '#d9d2c0', left: '#a89f88', right: '#8d856f', line: '#4a4538' });
    return trim(S);
  }
  // prateleira alta de 1 celula encostada num lado; face = lado aberto (rot 0:+b, 90:+a, 180:-b, 270:-a)
  function shelf(rot, kind) {
    const S = newSprite(), { ctx, o } = S;
    const T = 0.3, H = kind === 'wine' ? 64 : MAX_H;
    const spec = { 0: ['b', -1], 90: ['a', -1], 180: ['b', 1], 270: ['a', 1] }[rot];      // eixo da face e lado onde fica a COSTA
    const fixedAxis = spec[0], back = spec[1];
    let a0 = -0.46, a1 = 0.46, b0 = -0.46, b1 = 0.46;
    if (fixedAxis === 'b') { if (back < 0) { b0 = -0.5; b1 = -0.5 + T; } else { b0 = 0.5 - T; b1 = 0.5; } }
    else { if (back < 0) { a0 = -0.5; a1 = -0.5 + T; } else { a0 = 0.5 - T; a1 = 0.5; } }
    box(ctx, o, a0, a1, b0, b1, 0, H, kind === 'wine' ? DARKWOOD : WOOD);
    // face aberta so e visivel quando olha para +a / +b (rot 0 e 90)
    if (rot === 0 || rot === 90) {
      const fixed = rot === 0 ? 'b' : 'a', val = rot === 0 ? b1 : a1, u0 = (rot === 0 ? a0 : b0) + 0.04, u1 = (rot === 0 ? a1 : b1) - 0.04;
      const P = (u, h) => facePt(o, fixed, val, u, h);
      poly(ctx, [P(u0, 4), P(u1, 4), P(u1, H - 5), P(u0, H - 5)], '#1d120a', '#0e0804');
      const rows = kind === 'wine' ? 4 : 4, rh = (H - 9) / rows;
      for (let r = 0; r < rows; r++) {
        const h0 = 4 + r * rh;
        if (kind === 'wine') {
          const n = 5;
          for (let i = 0; i < n; i++) {
            const u = u0 + (u1 - u0) * (i + 0.5) / n, c = P(u, h0 + rh * 0.5), col = GLASS[(i + r * 2) % GLASS.length];
            ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(c[0], c[1], 3.6, 5.2, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(c[0] - 1, c[1] - 3, 1, 3);
          }
        } else {
          let u = u0 + 0.02, k = r * 3;
          while (u < u1 - 0.08) {
            const w = 0.07 + ((k * 37) % 5) * 0.012, hh = rh * (0.62 + ((k * 17) % 4) * 0.08);
            if (u + w > u1 - 0.02) break;
            const col = ['#7a2e2a', '#2f4f7a', '#3c6a3a', '#8a6a2a', '#5a3a6a', '#a0522d'][k % 6];
            poly(ctx, [P(u, h0 + 2), P(u + w, h0 + 2), P(u + w, h0 + 2 + hh), P(u, h0 + 2 + hh)], col, 'rgba(0,0,0,0.5)');
            u += w + 0.005; k++;
          }
        }
        const sh = [P(u0, h0 + rh - 2), P(u1, h0 + rh - 2)]; ctx.strokeStyle = '#8a6240'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sh[0][0], sh[0][1]); ctx.lineTo(sh[1][0], sh[1][1]); ctx.stroke();
      }
    }
    box(ctx, o, a0 - 0.02, a1 + 0.02, b0 - 0.02, b1 + 0.02, H, H + 4, { top: '#b38458', left: '#80583a', right: '#6a4727', line: '#22140a' });
    return trim(S);
  }
  function barrel() {
    const S = newSprite(), { ctx, o } = S, cx = o[0], cy = o[1];
    const H = 36, R = 20, ry = 10;
    ctx.fillStyle = '#6a4727'; ctx.strokeStyle = '#22140a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx - R, cy - H); ctx.bezierCurveTo(cx - R - 5, cy - H * 0.6, cx - R - 5, cy - H * 0.4, cx - R, cy); ctx.ellipse(cx, cy, R, ry, 0, Math.PI, 0, true); ctx.bezierCurveTo(cx + R + 5, cy - H * 0.4, cx + R + 5, cy - H * 0.6, cx + R, cy - H); ctx.ellipse(cx, cy - H, R, ry, 0, 0, Math.PI, false); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.save(); ctx.clip();
    for (let i = -R; i <= R; i += 5) { ctx.strokeStyle = 'rgba(20,10,4,0.45)'; ctx.beginPath(); ctx.moveTo(cx + i, cy - H - ry); ctx.lineTo(cx + i * 1.12, cy + ry); ctx.stroke(); }
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(cx + 4, cy - H - ry, R + 8, H + ry * 2 + 4);
    for (const h of [8, H - 8]) { ctx.strokeStyle = '#2f3033'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy - h, R + 3, ry + 1.5, 0, 0, Math.PI, false); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = '#8a6240'; ctx.beginPath(); ctx.ellipse(cx, cy - H, R, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(20,10,4,0.5)'; ctx.beginPath(); ctx.ellipse(cx, cy - H, R - 5, ry - 2.5, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#3a2412'; ctx.beginPath(); ctx.arc(cx + 3, cy - H, 2.4, 0, 7); ctx.fill();
    return trim(S);
  }
  function chest(rot) {     // rot 0: frente em +b; 90: frente em +a
    const S = newSprite(), { ctx, o } = S;
    box(ctx, o, -0.34, 0.34, -0.26, 0.26, 0, 15, { top: '#8a6240', left: '#6a4727', right: '#563a20', line: '#22140a' });
    // tampa abaulada (duas faixas)
    box(ctx, o, -0.35, 0.35, -0.27, 0.27, 15, 22, { top: '#a2754a', left: '#7c5532', right: '#654426', line: '#22140a' }, true);
    // cintas de ferro
    const fixed = rot === 90 ? 'a' : 'b', val = rot === 90 ? 0.35 : 0.27;
    const P = (u, h) => facePt(o, fixed, val, u, h);
    for (const u of [-0.2, 0.2]) poly(ctx, [P(u - 0.03, 0), P(u + 0.03, 0), P(u + 0.03, 22), P(u - 0.03, 22)], '#3d3f43', '#151618');
    poly(ctx, [P(-0.04, 10), P(0.04, 10), P(0.04, 18), P(-0.04, 18)], '#d4a73a', '#4a3810');
    return trim(S);
  }

  // ---------- Palacio de Zeus (marmore gelado, ouro e azul-tempestade) ----------
  const MARB = { top: '#e9f0fb', left: '#bccbe2', right: '#8497b8', line: '#2c3a58' };
  const MARB2 = { top: '#d3deef', left: '#a5b6d2', right: '#7084a8', line: '#27344f' };
  const GOLD = { top: '#f7dc7a', left: '#d9ae3c', right: '#a8821f', line: '#4a3810' };
  const STORM = { top: '#4b6cb0', left: '#38548c', right: '#2b416f', line: '#121b33' };
  const BRONZE = { top: '#a9803c', left: '#80602a', right: '#5f461d', line: '#24190a' };
  const SNOW = '#f4f8ff';

  function ell(ctx, x, y, rx, ry, fill, stroke, a0, a1) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, a0 || 0, a1 === undefined ? Math.PI * 2 : a1); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); } }

  function column() {
    const S = newSprite(170, 230, 85, 200), { ctx, o } = S, cx = o[0], cy = o[1];
    box(ctx, o, -0.36, 0.36, -0.36, 0.36, 0, 9, MARB2);
    box(ctx, o, -0.3, 0.3, -0.3, 0.3, 9, 16, MARB);
    const R = 17, y0 = cy - 16, y1 = cy - 128;
    // fuste: cilindro com degrade horizontal e caneluras
    const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
    g.addColorStop(0, '#f4f8ff'); g.addColorStop(0.32, '#d3deef'); g.addColorStop(0.7, '#9fb0cc'); g.addColorStop(1, '#6a7ea4');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - R, y1); ctx.lineTo(cx - R, y0); ctx.ellipse(cx, y0, R, R / 2, 0, Math.PI, 0, true); ctx.lineTo(cx + R, y1); ctx.ellipse(cx, y1, R, R / 2, 0, 0, Math.PI, false); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2c3a58'; ctx.lineWidth = 1; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(cx - R, y1, R * 2, y0 - y1 + R); ctx.clip();
    for (let i = -R + 3; i < R; i += 4) { ctx.strokeStyle = 'rgba(52,72,112,0.38)'; ctx.beginPath(); ctx.moveTo(cx + i, y1); ctx.lineTo(cx + i, y0 + R / 2 * Math.sqrt(Math.max(0, 1 - (i / R) * (i / R)))); ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(cx + i - 1, y1); ctx.lineTo(cx + i - 1, y0); ctx.stroke(); }
    ctx.restore();
    // aneis dourados e capitel
    for (const [yy, rr] of [[y0 + 2, R + 2], [y1 + 6, R + 2]]) { ell(ctx, cx, yy, rr, rr / 2, '#d9ae3c', '#4a3810'); }
    ell(ctx, cx, y1 - 2, R + 6, (R + 6) / 2, '#e3ecf9', '#2c3a58');
    box(ctx, o, -0.34, 0.34, -0.34, 0.34, 130, 140, MARB);
    box(ctx, o, -0.36, 0.36, -0.36, 0.36, 140, 146, GOLD);
    // neve no topo (irregular)
    const top = (a, b, h) => { const q = pt(a, b, h); return [q[0] + o[0], q[1] + o[1]]; };
    ctx.fillStyle = SNOW; ctx.beginPath(); const T = [top(-0.36, -0.36, 146), top(0.36, -0.36, 146), top(0.36, 0.36, 146), top(-0.36, 0.36, 146)];
    ctx.moveTo(T[0][0] + 6, T[0][1] + 2); ctx.lineTo(T[1][0] - 4, T[1][1] + 1); ctx.lineTo(T[2][0] - 8, T[2][1] - 3); ctx.lineTo(T[3][0] + 5, T[3][1] - 2); ctx.closePath(); ctx.fill();
    ell(ctx, cx - 8, cy - 150, 9, 3, 'rgba(255,255,255,0.9)'); ell(ctx, cx + 12, cy - 147, 7, 2.5, 'rgba(255,255,255,0.9)');
    return trim(S);
  }

  function brazier() {
    const S = newSprite(130, 170, 65, 135), { ctx, o } = S, cx = o[0], cy = o[1];
    ctx.strokeStyle = '#24190a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (const dx of [-14, 14, 0]) { ctx.beginPath(); ctx.moveTo(cx + dx * 0.5, cy - 30); ctx.lineTo(cx + dx * (dx === 0 ? 0.4 : 1.1), cy + (dx === 0 ? 8 : 2)); ctx.stroke(); }
    ctx.strokeStyle = '#80602a'; ctx.lineWidth = 3;
    for (const dx of [-14, 14, 0]) { ctx.beginPath(); ctx.moveTo(cx + dx * 0.5, cy - 30); ctx.lineTo(cx + dx * (dx === 0 ? 0.4 : 1.1), cy + (dx === 0 ? 8 : 2)); ctx.stroke(); }
    ctx.lineCap = 'butt';
    // tigela
    const g = ctx.createLinearGradient(cx - 26, 0, cx + 26, 0); g.addColorStop(0, '#d2a24e'); g.addColorStop(0.5, '#a9803c'); g.addColorStop(1, '#5f461d');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - 26, cy - 52); ctx.quadraticCurveTo(cx - 24, cy - 24, cx, cy - 22); ctx.quadraticCurveTo(cx + 24, cy - 24, cx + 26, cy - 52); ctx.ellipse(cx, cy - 52, 26, 11, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#24190a'; ctx.lineWidth = 1; ctx.stroke();
    ell(ctx, cx, cy - 52, 26, 11, '#3a2a10', '#24190a');
    ell(ctx, cx, cy - 52, 22, 8.5, '#c2461a'); ell(ctx, cx, cy - 53, 17, 6, '#ff9a2b'); ell(ctx, cx, cy - 54, 9, 3, '#ffe27a');
    ctx.strokeStyle = '#e3bd62'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - 52, 26, 11, 0, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = '#6e5224'; ctx.fillRect(cx - 4, cy - 24, 8, 5);
    return trim(S);
  }

  function throne(rot) {   // rot 0: de frente para +b (costas em -b); rot 90: frente para +a (costas em -a)
    const S = newSprite(260, 260, 130, 205), { ctx, o } = S, sw = (rot === 90);
    const B = (a0, a1, b0, b1, h0, h1, c, pl) => sw ? box(ctx, o, b0, b1, a0, a1, h0, h1, c, pl) : box(ctx, o, a0, a1, b0, b1, h0, h1, c, pl);
    // degrau
    B(-0.46, 0.46, -0.46, 0.46, 0, 8, MARB2);
    B(-0.4, 0.4, -0.4, 0.4, 8, 15, MARB);
    // costas altas
    B(-0.36, 0.36, -0.4, -0.28, 15, 128, MARB);
    B(-0.3, 0.3, -0.41, -0.27, 128, 138, GOLD);
    B(-0.4, -0.3, -0.42, -0.26, 15, 150, GOLD);      // pontas douradas laterais
    B(0.3, 0.4, -0.42, -0.26, 15, 150, GOLD);
    B(-0.38, -0.32, -0.4, -0.28, 150, 162, GOLD); B(0.32, 0.38, -0.4, -0.28, 150, 162, GOLD);
    // assento e almofada
    B(-0.3, 0.3, -0.28, 0.3, 15, 40, MARB);
    B(-0.27, 0.27, -0.25, 0.27, 40, 47, STORM);
    // bracos
    B(-0.38, -0.3, -0.28, 0.32, 15, 54, MARB); B(0.3, 0.38, -0.28, 0.32, 15, 54, MARB);
    B(-0.39, -0.29, -0.28, 0.32, 54, 58, GOLD); B(0.29, 0.39, -0.28, 0.32, 54, 58, GOLD);
    // emblema do raio no encosto (face visivel)
    const { ctx: c2 } = S;
    const fx = sw ? 'a' : 'b';
    return trim(S);
  }

  function banner(rot) {   // rot 0: pano voltado para +b; 90: voltado para +a
    const S = newSprite(130, 230, 65, 195), { ctx, o } = S;
    box(ctx, o, -0.08, 0.08, -0.08, 0.08, 0, 6, IRON);
    box(ctx, o, -0.03, 0.03, -0.03, 0.03, 6, 168, IRON);
    box(ctx, o, -0.03, 0.03, -0.03, 0.03, 168, 176, GOLD);
    const fixed = rot === 90 ? 'a' : 'b', val = 0.05;
    const P = (u, h) => facePt(o, fixed, val, u, h);
    const cloth = [P(-0.34, 160), P(0.34, 160), P(0.34, 62), P(0.17, 78), P(0, 52), P(-0.17, 78), P(-0.34, 62)];
    poly(ctx, cloth, '#34508c', '#121b33');
    poly(ctx, [P(-0.3, 156), P(0.3, 156), P(0.3, 150), P(-0.3, 150)], '#d9ae3c', null);
    // raio dourado
    const bolt = [[0.06, 142], [-0.12, 112], [-0.02, 112], [-0.1, 82], [0.14, 118], [0.03, 118], [0.12, 142]];
    poly(ctx, bolt.map(([u, h]) => P(u, h)), '#f7dc7a', '#4a3810');
    box(ctx, o, -0.36, 0.36, -0.03, 0.03, 160, 165, GOLD);
    return trim(S);
  }

  function spire(seed) {
    const S = newSprite(180, 200, 90, 150), { ctx, o } = S, cx = o[0], cy = o[1];
    const rnd = (k) => { const x = Math.sin((k + 1) * 12.9898 + (seed || 0) * 4.1) * 43758.5453; return x - Math.floor(x); };
    const crystals = [[-26, 4, 40, 15], [22, 8, 52, 17], [0, -6, 92, 24], [-10, 12, 58, 15], [34, -2, 30, 11], [-38, -4, 26, 10]];
    crystals.sort((a, b) => a[1] - b[1]);
    for (const [dx, dy, h, w] of crystals) {
      const x = cx + dx, y = cy + dy, lean = (rnd(dx) - 0.5) * 10;
      ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2 + 2 + lean * 0.3, y - h * 0.72); ctx.lineTo(x + lean, y - h); ctx.lineTo(x + w / 2 - 2 + lean * 0.3, y - h * 0.72); ctx.lineTo(x + w / 2, y); ctx.closePath();
      const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#e9fbff'); g.addColorStop(0.45, '#9fdcf0'); g.addColorStop(1, '#4f8fb8');
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#26506e'; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.moveTo(x - w / 4, y - 4); ctx.lineTo(x - w / 4 + lean * 0.2, y - h * 0.7); ctx.stroke();
    }
    ell(ctx, cx, cy + 4, 46, 12, 'rgba(240,248,255,0.9)'); 
    return trim(S);
  }

  function statueZeus() {
    const S = newSprite(300, 380, 150, 340), { ctx, o } = S, cx = o[0], cy = o[1];
    // pedestal em 3 degraus
    box(ctx, o, -0.5, 0.5, -0.5, 0.5, 0, 12, MARB2);
    box(ctx, o, -0.42, 0.42, -0.42, 0.42, 12, 26, MARB);
    box(ctx, o, -0.33, 0.33, -0.33, 0.33, 26, 70, MARB);
    box(ctx, o, -0.37, 0.37, -0.37, 0.37, 70, 76, GOLD);
    // placa dourada nas duas faces da frente
    poly(ctx, [facePt(o, 'b', 0.33, -0.2, 34), facePt(o, 'b', 0.33, 0.2, 34), facePt(o, 'b', 0.33, 0.2, 60), facePt(o, 'b', 0.33, -0.2, 60)], '#d9ae3c', '#4a3810');
    poly(ctx, [facePt(o, 'a', 0.33, -0.2, 34), facePt(o, 'a', 0.33, 0.2, 34), facePt(o, 'a', 0.33, 0.2, 60), facePt(o, 'a', 0.33, -0.2, 60)], '#a8821f', '#4a3810');
    const y0 = cy - 76;
    const lg = ctx.createLinearGradient(cx - 40, 0, cx + 40, 0); lg.addColorStop(0, '#f4f8ff'); lg.addColorStop(0.5, '#cdd9ec'); lg.addColorStop(1, '#8497b8');
    const line = '#2c3a58';
    // manto (capa) atras
    ctx.fillStyle = '#9fb1d0'; ctx.beginPath(); ctx.moveTo(cx - 24, y0 - 150); ctx.quadraticCurveTo(cx - 54, y0 - 90, cx - 44, y0 - 4); ctx.lineTo(cx + 40, y0 - 4); ctx.quadraticCurveTo(cx + 46, y0 - 90, cx + 22, y0 - 150); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    // tunica
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(cx - 22, y0 - 142); ctx.lineTo(cx + 22, y0 - 142); ctx.quadraticCurveTo(cx + 34, y0 - 80, cx + 38, y0 - 2); ctx.lineTo(cx - 38, y0 - 2); ctx.quadraticCurveTo(cx - 32, y0 - 80, cx - 22, y0 - 142); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    ctx.strokeStyle = 'rgba(52,72,112,0.45)'; for (let i = -28; i <= 28; i += 7) { ctx.beginPath(); ctx.moveTo(cx + i * 0.35, y0 - 110); ctx.quadraticCurveTo(cx + i * 0.9, y0 - 50, cx + i, y0 - 4); ctx.stroke(); }
    // cinto dourado
    ctx.fillStyle = '#d9ae3c'; ctx.fillRect(cx - 24, y0 - 96, 48, 6); ctx.strokeStyle = '#4a3810'; ctx.strokeRect(cx - 24, y0 - 96, 48, 6);
    // peito e ombros
    ctx.fillStyle = '#e6edf8'; ctx.beginPath(); ctx.moveTo(cx - 28, y0 - 140); ctx.quadraticCurveTo(cx, y0 - 154, cx + 28, y0 - 140); ctx.lineTo(cx + 24, y0 - 118); ctx.lineTo(cx - 24, y0 - 118); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    // braco esquerdo (cetro) para baixo
    ctx.fillStyle = '#dbe5f4'; ctx.beginPath(); ctx.moveTo(cx - 28, y0 - 140); ctx.lineTo(cx - 40, y0 - 134); ctx.lineTo(cx - 48, y0 - 92); ctx.lineTo(cx - 38, y0 - 90); ctx.lineTo(cx - 30, y0 - 120); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    ctx.strokeStyle = '#b8902c'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(cx - 44, y0 - 12); ctx.lineTo(cx - 44, y0 - 188); ctx.stroke(); ctx.lineWidth = 1;
    ell(ctx, cx - 44, y0 - 192, 6, 6, '#f7dc7a', '#4a3810');
    // braco direito erguido segurando o raio
    ctx.fillStyle = '#e6edf8'; ctx.beginPath(); ctx.moveTo(cx + 26, y0 - 142); ctx.lineTo(cx + 40, y0 - 150); ctx.lineTo(cx + 58, y0 - 190); ctx.lineTo(cx + 50, y0 - 198); ctx.lineTo(cx + 34, y0 - 164); ctx.lineTo(cx + 24, y0 - 126); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    ell(ctx, cx + 54, y0 - 200, 6, 6, '#eef3fb', line);
    // raio (zigue-zague) dourado com brilho
    const bx = cx + 54, by = y0 - 204;
    const gl = ctx.createRadialGradient(bx, by - 30, 4, bx, by - 30, 44); gl.addColorStop(0, 'rgba(255,240,150,0.55)'); gl.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(bx, by - 30, 44, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + 2, by + 6); ctx.lineTo(bx - 10, by - 18); ctx.lineTo(bx - 1, by - 18); ctx.lineTo(bx - 14, by - 46); ctx.lineTo(bx + 10, by - 24); ctx.lineTo(bx + 1, by - 24); ctx.lineTo(bx + 14, by - 4); ctx.closePath(); ctx.fillStyle = '#f7dc7a'; ctx.fill(); ctx.strokeStyle = '#6a4a10'; ctx.stroke();
    // cabeca, barba e coroa
    ell(ctx, cx, y0 - 160, 11, 12, '#eef3fb', line);
    ctx.fillStyle = '#dfe7f3'; ctx.beginPath(); ctx.moveTo(cx - 10, y0 - 158); ctx.quadraticCurveTo(cx - 12, y0 - 132, cx, y0 - 126); ctx.quadraticCurveTo(cx + 12, y0 - 132, cx + 10, y0 - 158); ctx.quadraticCurveTo(cx, y0 - 150, cx - 10, y0 - 158); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    ctx.fillStyle = '#cfd9ea'; ctx.beginPath(); ctx.arc(cx, y0 - 164, 12, Math.PI, 0); ctx.lineTo(cx + 12, y0 - 154); ctx.lineTo(cx - 12, y0 - 154); ctx.closePath(); ctx.fill(); ctx.strokeStyle = line; ctx.stroke();
    ctx.strokeStyle = '#d9ae3c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, y0 - 166, 12, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); ctx.lineWidth = 1;
    ctx.fillStyle = '#2c3a58'; ctx.fillRect(cx - 5, y0 - 162, 2, 2); ctx.fillRect(cx + 3, y0 - 162, 2, 2);
    // sombra suave de neve na base
    ell(ctx, cx, cy + 6, 62, 16, 'rgba(240,248,255,0.55)');
    return trim(S);
  }

  const cache = {};
  function sprite(kind, rot, mask) {
    // arte nova importada para este movel/rotacao (js/art_overrides.js); senao, o desenho por codigo abaixo
    const art = window.SurittoArt && window.SurittoArt.furnitureSprite(kind, rot, mask);
    if (art) return art;
    const k = kind + '|' + (rot || 0) + '|' + (mask || 0);
    if (cache[k]) return cache[k];
    let r;
    if (kind === 'table') r = table(mask || 0);
    else if (kind === 'chair') r = chair(rot || 0);
    else if (kind === 'bed') r = bed(rot || 0, mask === 1 ? BLUE : RED);
    else if (kind === 'fireplace') r = fireplace(rot || 0);
    else if (kind === 'candelabra') r = candelabra();
    else if (kind === 'lantern') r = lantern();
    else if (kind === 'counter') r = counter(mask || 0);
    else if (kind === 'counterbig') r = counterBig(rot || 0);
    else if (kind === 'bookshelf') r = shelf(rot || 0, 'book');
    else if (kind === 'winerack') r = shelf(rot || 0, 'wine');
    else if (kind === 'barrel') r = barrel();
    else if (kind === 'chest') r = chest(rot || 0);
    else if (kind === 'column') r = column();
    else if (kind === 'brazier') r = brazier();
    else if (kind === 'throne') r = throne(rot || 0);
    else if (kind === 'banner') r = banner(rot || 0);
    else if (kind === 'spire') r = spire(mask || 0);
    else if (kind === 'statuezeus') r = statueZeus();
    else r = table(0);
    return (cache[k] = r);
  }

  // chama animada centrada em (x,y) = base da chama
  function flame(ctx, x, y, t, s) {
    s = s || 1;
    const f1 = Math.sin(t * 0.017 + x) * 1.6, f2 = Math.cos(t * 0.023 + y * 0.3) * 1.2;
    ctx.save();
    ctx.fillStyle = '#e8531c'; ctx.beginPath(); ctx.moveTo(x - 5 * s, y); ctx.quadraticCurveTo(x - 6 * s + f2, y - 8 * s, x + f1, y - 17 * s - f2); ctx.quadraticCurveTo(x + 6 * s + f2, y - 8 * s, x + 5 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffa42b'; ctx.beginPath(); ctx.moveTo(x - 3.5 * s, y); ctx.quadraticCurveTo(x - 4 * s, y - 6 * s, x + f1 * 0.7, y - 13 * s); ctx.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 3.5 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe98a'; ctx.beginPath(); ctx.moveTo(x - 1.8 * s, y); ctx.quadraticCurveTo(x - 2 * s, y - 4 * s, x + f1 * 0.4, y - 8 * s); ctx.quadraticCurveTo(x + 2 * s, y - 4 * s, x + 1.8 * s, y); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  window.FurnitureRenderer = { sprite, flame, pt };
})();
