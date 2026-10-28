// art_overrides.js - Arte nova importada (tools/arte/importar_novas.py -> assets/arte/manifest.json).
// Onde houver arte nova ela substitui o sprite do atlas (pisos) ou o desenho por codigo (moveis, por rotacao);
// onde nao houver, tudo continua como antes. As imagens carregam em segundo plano.
(function () {
  const BASE = 'assets/arte/';
  const SurittoArt = {
    floors: {},       // nome do sprite do atlas -> { img, anchor }
    furniture: {},    // "tipo|rot" ou "tipo|m<mascara>" (mesa emendada com os vizinhos) -> { canvas: img, ox, oy, chamas?, brilho? }
                      // chamas: [[dx, dy, tamanho]] e brilho: [dx, dy], relativos a ancora (onde o jogo desenha fogo / halo)
    roofs: {},        // estilo do telhado (tile, thatch, wood, slate) ou 'empena' -> { img, linhas?, celulas? } (textura chapada, js/roofs.js)
    ready: false,

    async load() {
      let m;
      try { m = await fetch(BASE + 'manifest.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)); } catch (e) { m = null; }
      if (!m) return;
      const jobs = [];
      const img = (file) => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = BASE + file + '?v=' + Date.now(); });
      for (const [name, e] of Object.entries(m.floors || {})) {
        jobs.push(img(e.file).then(i => { if (i) this.floors[name] = { img: i, anchor: e.anchor }; }));
      }
      for (const [kind, rots] of Object.entries(m.furniture || {})) {
        for (const [rot, e] of Object.entries(rots)) {
          jobs.push(img(e.file).then(i => { if (i) this.furniture[kind + '|' + rot] = { canvas: i, ox: e.ox, oy: e.oy, chamas: e.chamas, brilho: e.brilho }; }));
        }
      }
      for (const [name, e] of Object.entries(m.roofs || {})) {
        jobs.push(img(e.file).then(i => { if (i) this.roofs[name] = { img: i, linhas: e.linhas, celulas: e.celulas }; }));
      }
      await Promise.all(jobs);
      this.ready = true;
      // os pisos do chao ficam em cache por bloco de tela: refaz para aparecer a arte nova
      const A = window.game && window.game.architect;
      if (A) { A._fc = null; A._ecVer = (A._ecVer || 0) + 1; A._roofCache = null; }
      console.info(`[Arte] ${Object.keys(this.floors).length} piso(s) e ${Object.keys(this.furniture).length} movel(is)/rotacao importados, ${Object.keys(this.roofs).length} textura(s) de telhado.`);
    },
    floor(name) { return this.floors[name] || null; },
    roofTexture(name) { return this.roofs[name] || null; },
    furnitureSprite(kind, rot, mask) { return this.furniture[kind + '|m' + (mask || 0)] || this.furniture[kind + '|' + (rot || 0)] || null; }
  };
  window.SurittoArt = SurittoArt;
  SurittoArt.load();
})();
