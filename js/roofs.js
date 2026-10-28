// Telhados de duas aguas desenhados por codigo (sem sprite no atlas).
// Uma area retangular de W x D celulas da malha de pisos (eixos a=(54,27), b=(-54,27)); cumeeira ao longo do lado maior.
// RoofRenderer.render(style, W, D, ridge, opts) -> { canvas, ox, oy, ... } onde (ox,oy) e o pixel do vertice de tras (a=0,b=0, altura 0).
// opts.chimneys: [[p, q]] posicoes de chamine (p ao longo da cumeeira, q atravessando), em celulas a partir do vertice de tras.
// Textura nova (assets/arte, via SurittoArt.roofTexture): onde houver, pinta as aguas / a empena; senao usa o desenho por codigo.
(function () {
  const AX = 54, AY = 27;
  const OVERHANG = 0.38;      // beiral, em celulas
  const VERGE = 0.12;         // quanto o telhado passa da empena (nas pontas da cumeeira)
  const PITCH = 0.7;          // subida / avanco (~35 graus): duas aguas levemente pontudo
  const MIN_RISE = 36, MAX_RISE = 118;
  const SHADOW = 14;          // px de sombra do beiral sobre as paredes
  const TEX_ROW = 18;         // px do jogo por fileira de telha na textura (igual a ROW_PX de tools/arte/importar_novas.py)

  const STYLES = {
    thatch: { name: 'Palha', row: 9, eave: 7, gable: '#8a6c36', gableLine: '#6b5128', outline: '#3a2a12' },
    wood: { name: 'Madeira', row: 10, eave: 5, gable: '#74563a', gableLine: '#4f3924', outline: '#2a1a0e', fascia: '#4a3220' },
    tile: { name: 'Telha', row: 11, eave: 5, gable: '#8b8377', gableLine: '#6a645a', outline: '#3b1c10', fascia: '#5a3a24' },
    slate: { name: 'Ardosia gelada', row: 9, eave: 5, gable: '#b9c7de', gableLine: '#8fa0bd', outline: '#1f2b46', tones: ['#566a92', '#657aa2', '#4e6288', '#5d729a', '#6f86ad'], tileDark: 'rgba(14,24,48,0.55)', rib: 'rgba(20,34,64,0.28)', hl: 'rgba(210,225,255,0.25)', under: 'rgba(14,24,48,0.55)', fascia: '#34425f', ridge: '#27344f', ridge2: '#9fb3d6', snow: true, noMoss: true }
  };
  // empena de enxaimel (combina com as paredes das vilas)
  const PLASTER = ['#d9caa6', '#d2c29d', '#ddd0ae'], TIMBER = '#5c3f28', TIMBER_DK = '#3a2717';

  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function mix(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t), g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t), bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  }

  function geometry(W, D, ridge) {
    const L = ridge === 'a' ? W : D, M = ridge === 'a' ? D : W;
    const s = M / 2 + OVERHANG;
    const rise = Math.max(MIN_RISE, Math.min(MAX_RISE, s * 60.4 * PITCH));
    // (p along ridge, q across, h) -> screen point relative to the back vertex at ground level
    const P = (p, q, h) => { const a = ridge === 'a' ? p : q, b = ridge === 'a' ? q : p; return [AX * (a - b), AY * (a + b) - h]; };
    return { L, M, rise, P };
  }

  function texture(name) { const A = window.SurittoArt; return (A && A.roofTexture && A.roofTexture(name)) || null; }

  function render(style, W, D, ridge, opts) {
    const st = STYLES[style] || STYLES.wood;
    const { L, M, rise, P } = geometry(W, D, ridge);
    const ov = OVERHANG, ovp = VERGE, pad = 10;
    // chamine sai perto da cumeeira (de longe, uma chamine no beiral de tras parece um poste atras da casa)
    const chimneys = ((opts && opts.chimneys) || []).map(c => [Math.max(0.2, Math.min(L - 0.2, c[0])), c[1] < M / 2 ? Math.max(c[1], M / 2 - 0.4) : Math.min(c[1], M / 2 + 0.4)]);
    const CH_TOP = rise + 20;
    const pts = [P(-ovp, -ov, 0), P(L + ovp, -ov, 0), P(-ovp, M + ov, 0), P(L + ovp, M + ov, 0), P(-ovp, M / 2, rise), P(L + ovp, M / 2, rise)];
    for (const c of chimneys) pts.push(P(c[0], c[1], CH_TOP + 4));
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    y1 += st.eave + SHADOW + 2;
    const ox = Math.round(-x0 + pad), oy = Math.round(-y0 + pad);
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(x1 - x0 + pad * 2); cv.height = Math.ceil(y1 - y0 + pad * 2);
    const ctx = cv.getContext('2d');
    const Tf = (p, q, h) => { const r = P(p, q, h); return [r[0] + ox, r[1] + oy]; };
    const T = (p, q, h) => { const r = Tf(p, q, h); return [Math.round(r[0]), Math.round(r[1])]; };
    const rand = rng(W * 131 + D * 17 + (ridge === 'a' ? 3 : 7) + style.length * 1013);
    const hq = (q) => Math.max(0, rise * (1 - Math.abs(q - M / 2) / (M / 2 + ov)));     // altura da agua em q

    // face param: u along ridge (0..1), v from eave (0) to ridge (1); side 0 = low q (eave at q=-ov), side 1 = high q (eave at q=M+ov)
    const faceQ = (side, v) => side === 0 ? (-ov + (M / 2 + ov) * v) : (M + ov - (M / 2 + ov) * v);
    const face = (side) => (u, v) => T(-ovp + (L + 2 * ovp) * u, faceQ(side, v), rise * v);
    const faceF = (side) => (u, v) => Tf(-ovp + (L + 2 * ovp) * u, faceQ(side, v), rise * v);
    const quad = (f, u0, u1, v0, v1) => [f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)];
    const path = (poly) => { ctx.beginPath(); ctx.moveTo(poly[0][0], poly[0][1]); for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]); ctx.closePath(); };
    const fillPoly = (poly, col) => { path(poly); ctx.fillStyle = col; ctx.fill(); };
    const line = (a, b, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
    const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

    // shading: light from the left
    const lit = ridge === 'a' ? [false, true] : [true, false];       // [low-q slope, high-q slope]
    const gableLit = ridge === 'b';                                   // empena em p=L: olha para +a (sombra) ou +b (luz)
    const shade = (side, poly) => { path(poly); ctx.fillStyle = lit[side] ? 'rgba(255,240,200,0.12)' : 'rgba(10,5,0,0.30)'; ctx.fill(); };

    const slopePx = Math.hypot((M / 2 + ov) * 60.4, rise);
    const rows = Math.max(3, Math.round(slopePx / st.row));
    const ridgeLenPx = (L + 2 * ovp) * 60.4;

    // pinta a textura (imagem chapada, fileiras na horizontal) num plano dado por origem e dois eixos de tela por px de textura
    function paintTexture(tex, clipPoly, O, ex, ey) {
      const pat = ctx.createPattern(tex.img, 'repeat'); if (!pat) return false;
      ctx.save(); path(clipPoly); ctx.clip();
      ctx.setTransform(ex[0], ex[1], ey[0], ey[1], O[0], O[1]);
      ctx.fillStyle = pat; ctx.fillRect(-4096, -4096, 8192, 8192);
      ctx.restore();
      return true;
    }

    function drawTilesProcedural(side, f) {
      const outline = quad(f, 0, 1, 0, 1);
      if (style === 'thatch') {
        fillPoly(outline, '#b8964a');
        ctx.save(); path(outline); ctx.clip();
        const cols = Math.round(ridgeLenPx / 2.2);
        for (let c = 0; c < cols; c++) {
          const u = (c + rand() * 0.9) / cols;
          const tone = ['#c9a655', '#b08a40', '#d3b568', '#9c7a34', '#bf9b4c'][Math.floor(rand() * 5)];
          let v = 1;
          while (v > -0.05) {
            const dv = (0.10 + rand() * 0.12);
            const a = f(u, Math.max(0, v)), b = f(u + (rand() - 0.5) * 0.01, Math.max(-0.02, v - dv));
            line(a, b, tone, 1.4); v -= dv * 0.9;
          }
        }
        for (let r = 1; r < rows; r++) {                // bundle bands
          const v = r / rows;
          const a = f(0, v), b = f(1, v);
          line(a, b, 'rgba(70,48,14,0.40)', 1.6);
          line([a[0], a[1] + 1.5], [b[0], b[1] + 1.5], 'rgba(255,230,150,0.20)', 1);
        }
        ctx.restore();
        return;
      }
      const cols = style === 'tile' ? Math.max(4, Math.round(ridgeLenPx / 16)) : Math.max(3, Math.round(ridgeLenPx / 15));
      for (let r = rows - 1; r >= 0; r--) {          // from ridge to eave so the lower row overlaps the upper
        const v0 = r / rows, v1 = (r + 1) / rows;
        const off = (r % 2) ? 0.5 : 0;
        for (let c = -1; c <= cols; c++) {
          const ua = Math.max(0, (c + off) / cols), ub = Math.min(1, (c + 1 + off) / cols);
          if (ub <= ua) continue;
          const j = rand();
          if (style === 'wood') {
            const tone = mix('#8a6240', '#6a4a30', j * 0.9);
            fillPoly(quad(f, ua, ub, v0, v1 + 0.012), tone);
            line(f(ua, v0), f(ua, v1), 'rgba(30,16,8,0.55)', 1);                        // joint
            line(f(ua, v0), f(ub, v0), 'rgba(255,225,170,0.12)', 1);                    // top highlight
            line(f(ua + (ub - ua) * 0.3, v0 + (v1 - v0) * 0.35), f(ua + (ub - ua) * 0.62, v0 + (v1 - v0) * 0.42), 'rgba(40,22,10,0.35)', 1);   // grain
          } else {
            const tone = (st.tones || ['#b7552f', '#c4623a', '#a84a28', '#bd5a33', '#cc6b40', '#9e4626', '#b9643f'])[Math.floor(j * (st.tones ? 5 : 7))];
            // telha com a borda de baixo arredondada (capa e canal)
            const ucs = (ua + ub) / 2, bulge = (v1 - v0) * 0.26;
            const poly = [f(ua, v0), f(ub, v0), f(ub, v1), f(ub - (ub - ua) * 0.18, v1 - bulge * 0.2), f(ucs, v1 - bulge * 0.9), f(ua + (ub - ua) * 0.18, v1 - bulge * 0.2), f(ua, v1)];
            fillPoly(poly, tone);
            line(f(ua, v0), f(ua, v1), st.tileDark || 'rgba(70,24,10,0.60)', 1);                           // gap between tiles
            line(f(ua + (ub - ua) * 0.5, v0), f(ua + (ub - ua) * 0.5, v1 - bulge), st.rib || 'rgba(90,30,12,0.30)', 1);   // rib
            line(f(ua + (ub - ua) * 0.2, v0 + (v1 - v0) * 0.15), f(ua + (ub - ua) * 0.2, v1 - (v1 - v0) * 0.3), st.hl || 'rgba(255,205,160,0.28)', 1.4);  // highlight
            line(f(ua + (ub - ua) * 0.1, v1 - bulge * 0.1), f(ub - (ub - ua) * 0.1, v1 - bulge * 0.1), st.under || 'rgba(50,16,6,0.60)', 1.4);                   // shadow under the row
            if (j > 0.965) fillPoly(quad(f, ua + (ub - ua) * 0.15, ub - (ub - ua) * 0.15, v0 + (v1 - v0) * 0.25, v1 - (v1 - v0) * 0.2), 'rgba(40,14,6,0.35)');   // telha trincada / mais velha
          }
        }
        if (style === 'wood') line(f(0, v0), f(1, v0), 'rgba(25,12,5,0.7)', 1);
      }
    }

    // musgo e sujeira: manchas perto do beiral e das juntas, sorteadas por casa
    function drawWear(side, f) {
      if (st.noMoss) return;
      const outline = quad(f, 0, 1, 0, 1);
      ctx.save(); path(outline); ctx.clip();
      const n = Math.round(ridgeLenPx / 30) + 2;
      for (let i = 0; i < n; i++) {
        const u = rand(), v = Math.pow(rand(), 1.8) * 0.7, c = f(u, v), r = 3 + rand() * 6;
        ctx.fillStyle = style === 'thatch' ? 'rgba(70,58,30,0.30)' : 'rgba(78,98,44,0.32)';
        ctx.beginPath(); ctx.ellipse(c[0], c[1], r * 1.6, r * 0.8, 0, 0, 7); ctx.fill();
        for (let k = 0; k < 4; k++) { ctx.fillStyle = 'rgba(150,160,80,0.35)'; ctx.fillRect(Math.round(c[0] + (rand() - 0.5) * r * 2.4), Math.round(c[1] + (rand() - 0.5) * r), 1, 1); }
      }
      // escurece perto do beiral (profundidade) e clareia perto da cumeeira
      for (let k = 0; k < 4; k++) fillPoly(quad(f, 0, 1, k * 0.05, (k + 1) * 0.05), 'rgba(20,10,4,' + (0.10 - k * 0.025) + ')');
      fillPoly(quad(f, 0, 1, 0.9, 1), 'rgba(255,235,190,0.06)');
      ctx.restore();
    }

    function drawSlope(side) {
      const f = face(side), ff = faceF(side);
      const outline = quad(f, 0, 1, 0, 1);
      const tex = texture(style);
      let painted = false;
      if (tex) {
        // origem na cumeeira (inicio), x ao longo da cumeeira, y descendo para o beiral; 1 px de textura = k px do jogo
        const k = (TEX_ROW * (tex.linhas || 8)) / tex.img.height;      // o importador ja grava na escala (k = 1)
        const O = ff(0, 1), Ue = ff(1, 1), Ve = ff(0, 0);
        const ex = [(Ue[0] - O[0]) / ridgeLenPx * k, (Ue[1] - O[1]) / ridgeLenPx * k], ey = [(Ve[0] - O[0]) / slopePx * k, (Ve[1] - O[1]) / slopePx * k];
        painted = paintTexture(tex, outline, O, ex, ey);
      }
      if (!painted) drawTilesProcedural(side, f);
      drawWear(side, f);
      if (st.snow) {                                   // neve acumulada junto a cumeeira, borda irregular
        const nu = Math.max(8, Math.round(ridgeLenPx / 6)); const top = []; const low = [];
        for (let k = 0; k <= nu; k++) { const u = k / nu; const vv = 0.40 + 0.22 * rand() + 0.12 * Math.sin(u * 17 + side * 2); low.push(f(u, Math.min(0.92, vv))); top.push(f(u, 1.0)); }
        fillPoly(top.concat(low.reverse()), 'rgba(244,248,255,0.96)');
        for (let k = 0; k < low.length - 1; k += 2) line(low[k], low[k + 1], 'rgba(150,175,215,0.7)', 1);
      }
      shade(side, outline);
      // beiral: tabeira grossa com as pontas dos caibros embaixo
      const e0 = f(0, 0), e1 = f(1, 0), th = st.eave;
      if (style === 'thatch') {
        fillPoly([e0, e1, [e1[0], e1[1] + th], [e0[0], e0[1] + th]], '#7a5e2a');
        const n = Math.round(ridgeLenPx / 3);
        for (let i = 0; i <= n; i++) {                  // beiral de palha desfiado
          const t = i / n, x = e0[0] + (e1[0] - e0[0]) * t, y = e0[1] + (e1[1] - e0[1]) * t + th - 2, len = 3 + rand() * 5;
          line([x, y], [x + (rand() - 0.5), y + len], mix('#9c7a34', '#6e5524', rand()), 2);
        }
      } else {
        fillPoly([e0, e1, [e1[0], e1[1] + th], [e0[0], e0[1] + th]], st.fascia);
        line([e0[0], e0[1] + 1], [e1[0], e1[1] + 1], 'rgba(255,220,170,0.18)', 1);
        line([e0[0], e0[1] + th], [e1[0], e1[1] + th], 'rgba(0,0,0,0.55)', 1);
        if (side === 1) {
          const n = Math.max(2, Math.round(L * 2));
          for (let i = 0; i <= n; i++) {
            const c = lerp(e0, e1, (ovp + L * i / n) / (L + 2 * ovp));
            ctx.fillStyle = '#2e1d10'; ctx.fillRect(Math.round(c[0] - 2), Math.round(c[1] + th), 4, 3);
          }
        }
      }
      line(e0, e1, 'rgba(0,0,0,0.5)', 1);
      ctx.strokeStyle = st.outline; ctx.lineWidth = 1; path(outline); ctx.stroke();
    }

    // sombra do beiral nas paredes (faixas que vao sumindo)
    function eaveShadow(a, b, top) {
      for (let k = 0; k < SHADOW; k += 2) {
        const al = 0.30 * (1 - k / SHADOW);
        fillPoly([[a[0], a[1] + top + k], [b[0], b[1] + top + k], [b[0], b[1] + top + k + 2], [a[0], a[1] + top + k + 2]], 'rgba(15,8,2,' + al.toFixed(3) + ')');
      }
    }

    // empena recuada na linha da parede (p = L): pentagono ate a parte de baixo das aguas
    function drawGable() {
      const G = (q, h) => T(L, q, h), Gf = (q, h) => Tf(L, q, h);
      const h0 = hq(0);
      const poly = [G(0, 0), G(M, 0), G(M, h0), G(M / 2, rise), G(0, h0)];
      const tex = texture('empena');
      let painted = false;
      if (tex) {
        const k = (60 * (tex.celulas || 1)) / tex.img.width;     // largura da textura = tex.celulas celulas
        const O = Gf(0, rise), Q1 = Gf(1, rise), H1 = Gf(0, rise - 1);
        painted = paintTexture(tex, poly, O, [(Q1[0] - O[0]) / 60.4 * k, (Q1[1] - O[1]) / 60.4 * k], [(H1[0] - O[0]) * k, (H1[1] - O[1]) * k]);
      }
      if (!painted) {
        fillPoly(poly, PLASTER[0]);
        ctx.save(); path(poly); ctx.clip();
        for (let i = 0; i < 40; i++) { const q = rand() * M, h = rand() * rise, c = G(q, h); ctx.fillStyle = PLASTER[1 + (i % 2)]; ctx.fillRect(c[0], c[1], 2 + Math.round(rand() * 3), 1); }
        // vigas: linha de baixo, montante central, montantes laterais, travessa e mao-francesa
        const beam = (q0, h0b, q1, h1) => { const a = G(q0, h0b), b = G(q1, h1); line(a, b, TIMBER_DK, 4); line(a, b, TIMBER, 2.6); };
        beam(0, 1.5, M, 1.5);
        const nStud = Math.max(1, Math.round(M / 0.8));
        for (let i = 1; i < nStud * 2; i++) { const q = (M * i) / (nStud * 2); if (Math.abs(q - M / 2) < 0.05) continue; if (i % 2) beam(q, 0, q, hq(q)); }
        beam(M / 2, 0, M / 2, rise);
        const hc = rise * 0.48, dq = Math.min(M / 2, (1 - 0.48) * (M / 2 + ov)); beam(M / 2 - dq, hc, M / 2 + dq, hc);
        beam(M * 0.18, 0, M / 2, hc * 0.95); beam(M * 0.82, 0, M / 2, hc * 0.95);
        // respiro do sotao
        const vh = rise * 0.72, vw = Math.min(0.12, M * 0.06);
        fillPoly([G(M / 2 - vw - 0.06, vh), G(M / 2 - 0.06, vh), G(M / 2 - 0.06, vh + 9), G(M / 2 - vw - 0.06, vh + 9)], '#20140b');
        fillPoly([G(M / 2 + 0.06, vh), G(M / 2 + vw + 0.06, vh), G(M / 2 + vw + 0.06, vh + 9), G(M / 2 + 0.06, vh + 9)], '#20140b');
        ctx.restore();
      }
      path(poly); ctx.fillStyle = gableLit ? 'rgba(255,240,200,0.06)' : 'rgba(10,5,0,0.26)'; ctx.fill();
      // sombra das aguas sobre a empena (faixa embaixo das bordas inclinadas)
      ctx.save(); path(poly); ctx.clip();
      for (let k = 0; k < 10; k += 2) { const al = 0.35 * (1 - k / 10); line(G(0, h0 - k), G(M / 2, rise - k), 'rgba(10,5,0,' + al.toFixed(3) + ')', 2); line(G(M, h0 - k), G(M / 2, rise - k), 'rgba(10,5,0,' + al.toFixed(3) + ')', 2); }
      ctx.restore();
      ctx.strokeStyle = st.outline; ctx.lineWidth = 1; path(poly); ctx.stroke();
    }

    // forro: parte de baixo da agua de tras no trecho que passa da empena (p de L ate L+ovp)
    function drawSoffit() {
      const f = face(0), u0 = (L + ovp) / (L + 2 * ovp);
      const poly = quad(f, u0, 1, 0, 1);
      fillPoly(poly, '#2e1f13');
      for (let i = 1; i < 4; i++) line(f(u0 + (1 - u0) * i / 4, 0), f(u0 + (1 - u0) * i / 4, 1), 'rgba(90,60,35,0.6)', 1);
      // tabeira (madeira na ponta da agua, ao longo da borda inclinada)
      const a = T(L + ovp, -ov, 0), b = T(L + ovp, M / 2, rise);
      line(a, b, '#2a1a0e', 3); line(a, b, st.fascia || '#5a3a24', 1.5);
    }
    function bargeNear() {
      const a = T(L + ovp, M + ov, 0), b = T(L + ovp, M / 2, rise);
      line(a, b, '#2a1a0e', 5); line(a, b, st.fascia || '#6a4a2c', 3); line([a[0], a[1] - 1], [b[0], b[1] - 1], 'rgba(255,220,170,0.25)', 1);
    }

    // chamine de pedra: caixa de pe saindo da agua
    function drawChimney(c) {
      const w = 0.17, pc = c[0], qc = c[1], H = CH_TOP;
      const C = (p, q, h) => T(p, q, h);
      const stoneL = '#958b7c', stoneD = '#6f665a', joint = 'rgba(40,30,20,0.55)';
      const qLit = ridge === 'a';                       // face +q olha para +b (luz) com cumeeira em a
      // face +q
      const fq = [C(pc - w, qc + w, hq(qc + w)), C(pc + w, qc + w, hq(qc + w)), C(pc + w, qc + w, H), C(pc - w, qc + w, H)];
      // face +p (base inclinada junto com a agua)
      const fp = [C(pc + w, qc + w, hq(qc + w)), C(pc + w, qc - w, hq(qc - w)), C(pc + w, qc - w, H), C(pc + w, qc + w, H)];
      const faceStones = (poly, col, A, B, hb) => {
        fillPoly(poly, col);
        ctx.save(); path(poly); ctx.clip();
        for (let h = H, r = 0; h > hb - 8; h -= 5, r++) {
          const a = lerp(C(A[0], A[1], h), C(B[0], B[1], h), 0), b = C(B[0], B[1], h);
          line(a, b, joint, 1);
          for (let t = (r % 2) * 0.25 + 0.25; t < 1; t += 0.5) { const m = lerp(C(A[0], A[1], h), b, t); line(m, [m[0], m[1] + 5], joint, 1); }
        }
        ctx.restore();
        ctx.strokeStyle = '#2b2219'; ctx.lineWidth = 1; path(poly); ctx.stroke();
      };
      faceStones(fq, qLit ? stoneL : stoneD, [pc - w, qc + w], [pc + w, qc + w], hq(qc + w));
      faceStones(fp, qLit ? stoneD : stoneL, [pc + w, qc + w], [pc + w, qc - w], Math.min(hq(qc - w), hq(qc + w)));
      // coroa (laje um pouco maior) e boca escura
      const cw = w + 0.04;
      const top = [C(pc - cw, qc - cw, H + 3), C(pc + cw, qc - cw, H + 3), C(pc + cw, qc + cw, H + 3), C(pc - cw, qc + cw, H + 3)];
      fillPoly([C(pc - cw, qc + cw, H), C(pc + cw, qc + cw, H), C(pc + cw, qc - cw, H), C(pc + cw, qc - cw, H + 3), C(pc + cw, qc + cw, H + 3), C(pc - cw, qc + cw, H + 3)], '#5e564b');
      fillPoly(top, '#a39887');
      ctx.strokeStyle = '#2b2219'; path(top); ctx.stroke();
      const iw = w - 0.06;
      fillPoly([C(pc - iw, qc - iw, H + 3), C(pc + iw, qc - iw, H + 3), C(pc + iw, qc + iw, H + 3), C(pc - iw, qc + iw, H + 3)], '#1a120c');
      // musgo/fuligem e sombra da chamine na agua
      fillPoly([C(pc - w, qc + w, H), C(pc + w, qc + w, H), C(pc + w, qc + w, H - 4), C(pc - w, qc + w, H - 4)], 'rgba(20,14,10,0.45)');
    }

    // ordem: agua de tras, chamines dela, empena recuada, forro e tabeira de tras, agua da frente, cumeeira, chamines da frente
    const ch0 = chimneys.filter(c => c[1] < M / 2), ch1 = chimneys.filter(c => c[1] >= M / 2);
    drawSlope(0);
    ch0.forEach(drawChimney);
    drawGable();
    drawSoffit();
    drawSlope(1);
    bargeNear();
    eaveShadow(T(-ovp, M + ov, 0), T(L + ovp, M + ov, 0), st.eave);

    // cumeeira
    const r0 = T(-ovp, M / 2, rise), r1 = T(L + ovp, M / 2, rise);
    if (style === 'thatch') {
      line(r0, r1, '#5e481c', 9); line(r0, r1, '#8a6c2e', 7); line([r0[0], r0[1] - 2], [r1[0], r1[1] - 2], '#b0913f', 3);
      const n = Math.round(ridgeLenPx / 14);
      for (let i = 1; i < n; i++) { const c = lerp(r0, r1, i / n); line([c[0] - 2, c[1] - 4], [c[0] + 2, c[1] + 4], 'rgba(60,40,12,0.8)', 1.5); }   // amarras
    } else if (style === 'wood') {
      line(r0, r1, '#2a1a0e', 7); line(r0, r1, '#4f3722', 5); line([r0[0], r0[1] - 2], [r1[0], r1[1] - 2], '#8b6844', 2);
    } else {
      // cumeeira de telhas meia-cana sobrepostas
      line(r0, r1, '#3a1a0c', 9); line(r0, r1, st.ridge || '#8a3418', 7); line([r0[0], r0[1] - 2], [r1[0], r1[1] - 2], st.ridge2 || '#c0603a', 3);
      const n = Math.max(2, Math.round(ridgeLenPx / 11));
      for (let i = 1; i <= n; i++) {
        const c = lerp(r0, r1, i / n);
        ctx.strokeStyle = 'rgba(40,12,4,0.75)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(c[0], c[1], 4, Math.PI * 0.55, Math.PI * 1.45, ridge !== 'a'); ctx.stroke();
      }
      ctx.fillStyle = st.ridge || '#8a3418'; ctx.beginPath(); ctx.arc(r1[0], r1[1], 4.2, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a1a0c'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(30,10,4,0.8)'; ctx.beginPath(); ctx.arc(r1[0], r1[1], 2, 0, 7); ctx.fill();
    }
    ch1.forEach(drawChimney);

    return { canvas: cv, ox, oy, rise, P, L, M };
  }

  window.RoofRenderer = { render, STYLES, OVERHANG, VERGE, geometry };
})();
