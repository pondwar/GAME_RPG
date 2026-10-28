// art_overrides.js - Arte nova importada (tools/arte/importar_novas.py -> assets/arte/manifest.json).
// Onde houver arte nova ela substitui o sprite do atlas (pisos) ou o desenho por codigo (moveis, por rotacao);
// onde nao houver, tudo continua como antes. As imagens carregam em segundo plano.
(function () {
  const BASE = 'assets/arte/';
  const SurittoArt = {
    floors: {},       // nome do sprite do atlas -> { img, anchor } (ou { n, pecas: {"i,j": img} } para piso feito de textura)
    furniture: {},    // "tipo|rot" ou "tipo|m<mascara>" (mesa emendada com os vizinhos) -> { canvas: img, ox, oy, chamas?, brilho? }
                      // chamas: [[dx, dy, tamanho]] e brilho: [dx, dy], relativos a ancora (onde o jogo desenha fogo / halo)
    ground: {},       // bioma do GroundRenderer (PLAINS, FOREST, ...) -> img (tile quadrado, ja achatado 2:1, js/ground.js)
    roofs: {},        // estilo do telhado (tile, thatch, wood, slate) ou 'empena' -> { img, linhas?, celulas? } (textura chapada, js/roofs.js)
    ready: false,

    async load() {
      let m;
      try { m = await fetch(BASE + 'manifest.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)); } catch (e) { m = null; }
      if (!m) return;
      const jobs = [];
      const img = (file) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = BASE + file + '?v=' + Date.now(); });
      for (const [name, e] of Object.entries(m.floors || {})) {
        if (e.pecas) {                                // piso feito de textura: n x n pecas, uma por posicao de celula
          const f = { img: null, anchor: e.anchor, n: e.celulas, pecas: {} };
          for (const [k, file] of Object.entries(e.pecas)) jobs.push(img(file).then(i => { if (i) { f.pecas[k] = i; if (k === '0,0') f.img = i; } }));
          this.floors[name] = f;
        } else jobs.push(img(e.file).then(i => { if (i) this.floors[name] = { img: i, anchor: e.anchor }; }));
      }
      for (const [kind, rots] of Object.entries(m.furniture || {})) {
        for (const [rot, e] of Object.entries(rots)) {
          jobs.push(img(e.file).then(i => { if (i) this.furniture[kind + '|' + rot] = { canvas: i, ox: e.ox, oy: e.oy, chamas: e.chamas, brilho: e.brilho }; }));
        }
      }
      for (const [name, e] of Object.entries(m.roofs || {})) {
        jobs.push(img(e.file).then(i => { if (i) this.roofs[name] = { img: i, linhas: e.linhas, celulas: e.celulas }; }));
      }
      for (const [bio, e] of Object.entries(m.ground || {})) {
        jobs.push(img(e.file).then(i => { if (i) this.ground[bio] = i; }));
      }
      await Promise.all(jobs);
      this.ready = true;
      // os pisos do chao ficam em cache por bloco de tela: refaz para aparecer a arte nova
      const A = window.game && window.game.architect;
      if (A) { A._fc = null; A._ecVer = (A._ecVer || 0) + 1; A._roofCache = null; }
      const G = window.game && window.game.ground;          // chao ja pintado com a grama/areia antiga: refaz os blocos
      if (G && Object.keys(this.ground).length) { G.tiles = null; G.cache.clear(); G.quick.clear(); G.job = null; }
      console.info(`[Arte] ${Object.keys(this.floors).length} piso(s) e ${Object.keys(this.furniture).length} movel(is)/rotacao importados, ${Object.keys(this.roofs).length} textura(s) de telhado, ${Object.keys(this.ground).length} de terreno.`);
    },
    floor(name, wx, wy) {
      const f = this.floors[name]; if (!f || !f.img) return null;
      if (!f.n || wx === undefined) return f;
      // celula (i, j) da malha isometrica a partir do centro dela no mundo
      const i = Math.round((wx / 54 + wy / 27) / 2), j = Math.round((wy / 27 - wx / 54) / 2), n = f.n;
      const p = f.pecas[(((i % n) + n) % n) + ',' + (((j % n) + n) % n)];
      return p ? { img: p, anchor: f.anchor } : f;
    },
    groundTexture(bio) { return this.ground[bio] || null; },
    roofTexture(name) { return this.roofs[name] || null; },
    furnitureSprite(kind, rot, mask) { return this.furniture[kind + '|m' + (mask || 0)] || this.furniture[kind + '|' + (rot || 0)] || null; }
  };
  window.SurittoArt = SurittoArt;
  SurittoArt.load();
})();
