// Telhados de duas aguas desenhados por codigo (sem sprite no atlas).
// Uma area retangular de W x D celulas da malha de pisos (eixos a=(54,27), b=(-54,27)); cumeeira ao longo do lado maior.
// RoofRenderer.render(style, W, D, ridge) -> { canvas, ox, oy, poly } onde (ox,oy) e o pixel do vertice de tras (a=0,b=0, altura 0).
(function () {
  const AX = 54, AY = 27;
  const OVERHANG = 0.38;      // beiral, em celulas
  const PITCH = 0.7;          // subida / avanco (~35 graus): duas aguas levemente pontudo
  const MIN_RISE = 36, MAX_RISE = 118;

  const STYLES = {
    thatch: { name: 'Palha', row: 7, eave: 6, gable: '#8a6c36', gableLine: '#6b5128', outline: '#3a2a12' },
    wood: { name: 'Madeira', row: 9, eave: 3, gable: '#74563a', gableLine: '#4f3924', outline: '#2a1a0e' },
    tile: { name: 'Telha', row: 8, eave: 3, gable: '#8b8377', gableLine: '#6a645a', outline: '#3b1c10' },
    slate: { name: 'Ardosia gelada', row: 8, eave: 4, gable: '#b9c7de', gableLine: '#8fa0bd', outline: '#1f2b46', tones: ['#566a92', '#657aa2', '#4e6288', '#5d729a', '#6f86ad'], tileDark: 'rgba(14,24,48,0.55)', rib: 'rgba(20,34,64,0.28)', hl: 'rgba(210,225,255,0.25)', under: 'rgba(14,24,48,0.55)', eaveCol: '#34425f', ridge: '#27344f', ridge2: '#9fb3d6', snow: true }
  };

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

  function render(style, W, D, ridge) {
    const st = STYLES[style] || STYLES.wood;
    const { L, M, rise, P } = geometry(W, D, ridge);
    const ov = OVERHANG, pad = 10;
    const pts = [P(-ov, -ov, 0), P(L + ov, -ov, 0), P(-ov, M + ov, 0), P(L + ov, M + ov, 0), P(-ov, M / 2, rise), P(L + ov, M / 2, rise)];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
    y1 += st.eave + 2;
    const ox = Math.round(-x0 + pad), oy = Math.round(-y0 + pad);
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(x1 - x0 + pad * 2); cv.height = Math.ceil(y1 - y0 + pad * 2);
    const ctx = cv.getContext('2d');
    const T = (p, q, h) => { const r = P(p, q, h); return [Math.round(r[0] + ox), Math.round(r[1] + oy)]; };
    const rand = rng(W * 131 + D * 17 + (ridge === 'a' ? 3 : 7) + style.length * 1013);

    // face param: u along ridge (0..1), v from eave (0) to ridge (1); side 0 = low q (eave at q=-ov), side 1 = high q (eave at q=M+ov)
    const face = (side) => (u, v) => {
      const p = -ov + (L + 2 * ov) * u;
      const q = side === 0 ? (-ov + (M / 2 + ov) * v) : (M + ov - (M / 2 + ov) * v);
      return T(p, q, rise * v);
    };
    const quad = (f, u0, u1, v0, v1) => [f(u0, v0), f(u1, v0), f(u1, v1), f(u0, v1)];
    const path = (poly) => { ctx.beginPath(); ctx.moveTo(poly[0][0], poly[0][1]); for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]); ctx.closePath(); };
    const fillPoly = (poly, col) => { path(poly); ctx.fillStyle = col; ctx.fill(); };
    const line = (a, b, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };

    // shading: light from the left
    const lit = ridge === 'a' ? [false, true] : [true, false];       // [low-q slope, high-q slope]
    const shade = (side, poly) => { path(poly); ctx.fillStyle = lit[side] ? 'rgba(255,240,200,0.10)' : 'rgba(10,5,0,0.22)'; ctx.fill(); };

    const slopeLen = Math.hypot(M / 2 + ov, 1) * 0; // (unused)
    const slopePx = Math.hypot((M / 2 + ov) * 60.4, rise);
    const rows = Math.max(3, Math.round(slopePx / st.row));
    const ridgeLenPx = (L + 2 * ov) * 60.4;

    function drawSlope(side) {
      const f = face(side);
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
          line(a, b, 'rgba(70,48,14,0.35)', 1.2);
          line([a[0], a[1] + 1], [b[0], b[1] + 1], 'rgba(255,230,150,0.18)', 1);
        }
        ctx.restore();
        // ragged eave
        const e0 = f(0, 0), e1 = f(1, 0), n = Math.round(ridgeLenPx / 3);
        for (let i = 0; i <= n; i++) {
          const t = i / n, x = e0[0] + (e1[0] - e0[0]) * t, y = e0[1] + (e1[1] - e0[1]) * t, len = 3 + rand() * (st.eave);
          line([x, y], [x + (rand() - 0.5), y + len], mix('#9c7a34', '#6e5524', rand()), 2);
        }
      } else {
        const cols = style === 'tile' ? Math.max(4, Math.round(ridgeLenPx / 13)) : Math.max(3, Math.round(ridgeLenPx / 15));
        for (let r = rows - 1; r >= 0; r--) {          // from ridge to eave so the lower row overlaps the upper
          const v0 = r / rows, v1 = (r + 1) / rows;
          const off = (r % 2) ? 0.5 : 0;
          for (let c = -1; c <= cols; c++) {
            const ua = Math.max(0, (c + off) / cols), ub = Math.min(1, (c + 1 + off) / cols);
            if (ub <= ua) continue;
            const j = rand();
            if (style === 'wood') {
              const tone = mix('#8a6240', '#6a4a30', j * 0.9);
              const q4 = quad(f, ua, ub, v0, v1 + 0.012);
              fillPoly(q4, tone);
              line(f(ua, v0), f(ua, v1), 'rgba(30,16,8,0.55)', 1);                        // joint
              line(f(ua, v0), f(ub, v0), 'rgba(255,225,170,0.10)', 1);                    // top highlight
              line(f(ua, v0), f(ub, v0 + 0.01), 'rgba(0,0,0,0)', 1);
              line(f(ua + (ub - ua) * 0.3, v0 + (v1 - v0) * 0.35), f(ua + (ub - ua) * 0.62, v0 + (v1 - v0) * 0.42), 'rgba(40,22,10,0.35)', 1);   // grain
            } else {
              const tone = (st.tones || ['#b7552f', '#c4623a', '#a84a28', '#bd5a33', '#cc6b40'])[Math.floor(j * 5)];
              // tile with a rounded lower edge
              const ucs = (ua + ub) / 2, bulge = (v1 - v0) * 0.22;
              const poly = [f(ua, v0), f(ub, v0), f(ub, v1), f(ub - (ub - ua) * 0.18, v1 - bulge * 0.2), f(ucs, v1 - bulge * 0.9), f(ua + (ub - ua) * 0.18, v1 - bulge * 0.2), f(ua, v1)];
              fillPoly(poly, tone);
              line(f(ua, v0), f(ua, v1), st.tileDark || 'rgba(70,24,10,0.55)', 1);                           // gap between tiles
              line(f(ua + (ub - ua) * 0.5, v0), f(ua + (ub - ua) * 0.5, v1 - bulge), st.rib || 'rgba(90,30,12,0.28)', 1);   // rib
              line(f(ua + (ub - ua) * 0.15, v0 + (v1 - v0) * 0.2), f(ua + (ub - ua) * 0.15, v1 - (v1 - v0) * 0.3), st.hl || 'rgba(255,200,150,0.22)', 1);  // highlight
              line(f(ua + (ub - ua) * 0.1, v1 - bulge * 0.1), f(ub - (ub - ua) * 0.1, v1 - bulge * 0.1), st.under || 'rgba(50,16,6,0.55)', 1);                   // shadow under the row
            }
          }
          if (style === 'wood') line(f(0, v0), f(1, v0), 'rgba(25,12,5,0.7)', 1);
        }
      }
      if (st.snow) {                                   // neve acumulada junto a cumeeira, borda irregular
        const nu = Math.max(8, Math.round(ridgeLenPx / 6)); const top = []; const low = [];
        for (let k = 0; k <= nu; k++) { const u = k / nu; const vv = 0.40 + 0.22 * rand() + 0.12 * Math.sin(u * 17 + side * 2); low.push(f(u, Math.min(0.92, vv))); top.push(f(u, 1.0)); }
        fillPoly(top.concat(low.reverse()), 'rgba(244,248,255,0.96)');
        for (let k = 0; k < low.length - 1; k += 2) line(low[k], low[k + 1], 'rgba(150,175,215,0.7)', 1);
      }
      shade(side, outline);
      // thickness of the eave
      const e0 = f(0, 0), e1 = f(1, 0), th = st.eave;
      fillPoly([e0, e1, [e1[0], e1[1] + th], [e0[0], e0[1] + th]], style === 'thatch' ? '#7a5e2a' : (style === 'wood' ? '#4a3220' : (st.eaveCol || '#7c3a1e')));
      line(e0, e1, 'rgba(0,0,0,0.5)', 1);
      ctx.strokeStyle = st.outline; ctx.lineWidth = 1; path(outline); ctx.stroke();
    }

    // order: far slope first, then the near one (high q is nearer), gable end at p = L+ov in between
    drawSlope(0);
    // visible gable end (p = L + ov)
    const g = [T(L + ov, -ov, 0), T(L + ov, M + ov, 0), T(L + ov, M / 2, rise)];
    fillPoly(g, st.gable);
    ctx.save(); path(g); ctx.clip();
    for (let k = 1; k < 14; k++) { const a = T(L + ov, -ov, -0), b = T(L + ov, M / 2, rise); const t = k / 14; line([g[0][0] + (g[2][0] - g[0][0]) * t, g[0][1] + (g[2][1] - g[0][1]) * t - 0], [g[1][0] + (g[2][0] - g[1][0]) * t, g[1][1] + (g[2][1] - g[1][1]) * t], st.gableLine, 1); }
    ctx.restore();
    path(g); ctx.fillStyle = lit[0] === lit[1] ? 'rgba(0,0,0,0)' : (ridge === 'a' ? 'rgba(10,5,0,0.18)' : 'rgba(255,240,200,0.06)'); ctx.fill();
    ctx.strokeStyle = st.outline; ctx.lineWidth = 1; path(g); ctx.stroke();
    drawSlope(1);

    // ridge cap
    const r0 = T(-ov, M / 2, rise), r1 = T(L + ov, M / 2, rise);
    if (style === 'thatch') { line(r0, r1, '#7d6128', 6); line([r0[0], r0[1] - 1], [r1[0], r1[1] - 1], '#a8873c', 3); }
    else if (style === 'wood') { line(r0, r1, '#3f2a1a', 5); line([r0[0], r0[1] - 1], [r1[0], r1[1] - 1], '#7b5a3a', 2); }
    else {
      line(r0, r1, st.ridge || '#7d2f18', 6); line([r0[0], r0[1] - 1], [r1[0], r1[1] - 1], st.ridge2 || '#b5532e', 4);
      const n = Math.round(ridgeLenPx / 9);
      for (let i = 1; i < n; i++) { const t = i / n; const x = r0[0] + (r1[0] - r0[0]) * t, y = r0[1] + (r1[1] - r0[1]) * t; line([x, y - 3], [x, y + 2], 'rgba(60,20,8,0.6)', 1); }
    }

    // hit polygon (outer outline, relative to the back vertex) for demolition
    const poly = [P(-ov, -ov, 0), P(L + ov, -ov, 0), P(L + ov, -ov, 0), P(L + ov, M / 2, rise), P(-ov, M / 2, rise), P(-ov, M + ov, 0), P(L + ov, M + ov, 0)];
    return { canvas: cv, ox, oy, rise, P, L, M };
  }

  window.RoofRenderer = { render, STYLES, OVERHANG, geometry };
})();
