// js/depth_sort.js - ordem de desenho com paredes como LINHAS (F3, v2 com ordenacao topologica).
// item.x = X relativo a camera; item.segs = [[x0,y0,x1,y1],...] (x relativo a camera, y de mundo).
//  - personagem x parede: fica na frente se o pe estiver abaixo da reta naquela coluna;
//  - parede x parede (que se sobrepoem em X): a de reta mais baixa (maior y) e desenhada depois.
// As relacoes viram arestas "A antes de B"; a ordem final e topologica, desempatando pela ordem por Y antiga.
// Ciclos (paredes que se cruzam) sao quebrados pela ordem antiga, sem travar.
(function (root) {
  const PAD = 22;      // tolerancia lateral entre personagem e ponta da parede
  const MINOVL = 6;    // sobreposicao minima em X para comparar duas paredes
  const MINDY = 3;     // diferenca minima de Y para criar aresta

  function base(a, b) {
    if (a.y !== b.y) return a.y - b.y;
    return (a.layer || 1) - (b.layer || 1);
  }

  function lineAt(segs, x) {
    let best = null;
    for (const s of segs) {
      const lo = Math.min(s[0], s[2]), hi = Math.max(s[0], s[2]);
      const cx = Math.max(lo, Math.min(hi, x));
      const d = Math.abs(x - cx);
      if (!best || d < best.d) {
        const t = s[2] === s[0] ? 0 : (cx - s[0]) / (s[2] - s[0]);
        best = { y: s[1] + (s[3] - s[1]) * t, d };
      }
    }
    return best;
  }

  function extent(segs) {
    let lo = Infinity, hi = -Infinity;
    for (const s of segs) { lo = Math.min(lo, s[0], s[2]); hi = Math.max(hi, s[0], s[2]); }
    return [lo, hi];
  }

  // heap minimo por _ord
  function push(h, it) { h.push(it); let i = h.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (h[p]._ord <= h[i]._ord) break; [h[p], h[i]] = [h[i], h[p]]; i = p; } }
  function pop(h) {
    const top = h[0], last = h.pop();
    if (h.length) { h[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < h.length && h[l]._ord < h[m]._ord) m = l; if (r < h.length && h[r]._ord < h[m]._ord) m = r; if (m === i) break; [h[m], h[i]] = [h[i], h[m]]; i = m; } }
    return top;
  }

  function sort(list) {
    list.sort(base);
    const n = list.length;
    const walls = [];
    for (let i = 0; i < n; i++) {
      const it = list[i]; it._ord = i; it._out = []; it._in = 0;
      if (it.segs) { it._ext = extent(it.segs); walls.push(it); }
    }
    if (!walls.length) return list;

    const edge = (a, b) => { a._out.push(b); b._in++; };

    // personagem x parede
    for (const w of walls) {
      for (const t of list) {
        if (t === w || t.segs || t.x === undefined) continue;
        if (t.x < w._ext[0] - PAD || t.x > w._ext[1] + PAD) continue;
        const r = lineAt(w.segs, t.x);
        if (!r || r.d > PAD) continue;
        // lineY: ponto do item que encosta no chao (moveis usam o centro da celula; o y de ordenacao deles e deslocado)
        const ty = t.lineY !== undefined ? t.lineY : t.y;
        if (ty >= r.y) edge(w, t); else edge(t, w);
      }
    }
    // parede x parede
    for (let i = 0; i < walls.length; i++) {
      for (let j = i + 1; j < walls.length; j++) {
        const a = walls[i], b = walls[j];
        const lo = Math.max(a._ext[0], b._ext[0]), hi = Math.min(a._ext[1], b._ext[1]);
        if (hi - lo < MINOVL) continue;
        const mid = (lo + hi) / 2;
        const ya = lineAt(a.segs, mid), yb = lineAt(b.segs, mid);
        if (!ya || !yb || ya.d > 0.5 || yb.d > 0.5) continue;
        if (Math.abs(ya.y - yb.y) < MINDY) continue;
        if (ya.y < yb.y) edge(a, b); else edge(b, a);
      }
    }

    // ordenacao topologica estavel (menor _ord primeiro); ciclo => cai para a ordem antiga
    const heap = [], out = [], done = new Set();
    for (const it of list) if (it._in === 0) push(heap, it);
    let nextScan = 0;
    while (out.length < n) {
      let it;
      if (heap.length) it = pop(heap);
      else { while (done.has(list[nextScan])) nextScan++; it = list[nextScan]; }
      if (done.has(it)) continue;
      done.add(it); out.push(it);
      for (const o of it._out) { if (!done.has(o) && --o._in === 0) push(heap, o); }
    }
    for (let i = 0; i < n; i++) list[i] = out[i];
    return list;
  }

  const api = { sort, lineAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DepthSort = api;
})(typeof window !== 'undefined' ? window : globalThis);
