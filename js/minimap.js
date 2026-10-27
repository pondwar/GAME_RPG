// minimap.js - Radar minimap + Mapa Global interativo de Suritto
// O mapa global NAO e mais uma imagem: e desenhado direto de WorldCoordinates.getTerrainAt() (a mesma funcao que o jogo usa para
// decidir o que e agua e o que e terra), entao o pino do jogador e a costa sempre batem com o que se ve jogando.
// Zoom (roda / botoes / duplo clique), arrastar, grade de latitude/longitude, fusos e regioes, escala em km.
// Cidades/pontos de interesse: MinimapSystem.addPOI({ name, x, y, icon, minScale }) (x,y em pixels de mundo) - hoje a lista esta vazia.
class MinimapSystem {
  constructor(game) {
    this.game = game;
    this.isWorldMapOpen = false;
    this.zoom = 1.0;
    // Visao do mapa: centro em pixels de mundo e escala (px de tela por px de mundo)
    this.view = { cx: 0, cy: 0, scale: 0.0012 };
    this.pois = [];                       // pontos de interesse (cidades etc.) - vazio por enquanto
    this._grid = null; this._base = null; this._baseKey = '';
    this._drag = null; this._mouse = null; this._lastChange = 0; this._fineDone = false;
    this.init();
  }

  // Nomes de acidentes geograficos (nao sao cidades). u,v em 0..1 do mundo; big = so aparece afastado.
  static FEATURES = [
    { name: 'Oceanus Borealis', u: 0.55, v: 0.07, big: true, sea: true },
    { name: 'Grande Oceano Oriental', u: 0.92, v: 0.12, big: true, sea: true },
    { name: 'Mar de Aethel', u: 0.99, v: 0.50, big: true, sea: true },
    { name: 'Arcadia', u: 0.18, v: 0.32, big: true },
    { name: 'Olympus Mons', u: 0.20, v: 0.22, mount: true },
    { name: 'Planaltos de Tharsis', u: 0.27, v: 0.50, big: true },
    { name: 'Valles Marineris', u: 0.62, v: 0.515, big: true, sea: true },
    { name: 'Mar Interior de Hellas', u: 0.70, v: 0.60, sea: true },
    { name: 'Ilha de Aotearoa', u: 0.70, v: 0.73, small: true },
    { name: 'Ilha de Yamato', u: 0.956, v: 0.295 }
  ];

  addPOI(p) { this.pois.push(p); }

  init() {
    this.createMinimapDOM();
    this.createWorldMapModalDOM();
    this.setupEvents();
  }

  // ---- paleta compartilhada (radar + mapa global) ----
  static TYPE_ID = { ocean: 1, water: 2, shore: 3, grass: 4, mountain: 5, snow: 6, canyon: 7, deep: 8, desert: 9, plains: 10, forest: 11, dense_forest: 12, hills: 13 };
  static COLORS = {
    1: [24, 78, 146], 2: [52, 135, 190], 3: [230, 208, 143], 4: [111, 158, 79],
    5: [128, 120, 112], 6: [241, 245, 248], 7: [176, 100, 70],
    8: [13, 48, 108], 9: [210, 172, 102], 10: [150, 185, 90], 11: [66, 128, 62], 12: [32, 88, 50], 13: [124, 124, 86]
  };

  createMinimapDOM() {
    const topCenter = document.querySelector('.hud-top-center');
    if (!topCenter) return;

    const minimapCard = document.createElement('div');
    minimapCard.id = 'hud-minimap-widget';
    minimapCard.className = 'hud-minimap-card';
    minimapCard.title = 'Clique para abrir o Mapa Global [M]';
    minimapCard.innerHTML = `
      <div class="minimap-frame">
        <canvas id="minimap-canvas" width="150" height="150"></canvas>
        <div class="minimap-compass-label n">N</div>
        <div class="minimap-compass-label s">S</div>
        <div class="minimap-compass-label l">L</div>
        <div class="minimap-compass-label o">O</div>
        <div class="minimap-crosshair"></div>
      </div>
      <div class="minimap-footer">
        <span class="minimap-hint">🗺️ MAPA GLOBAL [M]</span>
      </div>
    `;

    const topRight = document.querySelector('.hud-top-right');
    if (topRight) {
      topRight.insertBefore(minimapCard, topRight.firstChild);
    } else {
      document.body.appendChild(minimapCard);
    }

    this.canvas = document.getElementById('minimap-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
  }

  createWorldMapModalDOM() {
    const modal = document.createElement('div');
    modal.id = 'world-map-modal';
    modal.className = 'world-map-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="world-map-backdrop" id="world-map-backdrop"></div>
      <div class="world-map-container">
        <div class="world-map-header">
          <div class="world-map-title">
            <h2><span class="world-map-icon">🗺️</span> CARTOGRAFIA DE ARES • PLANETA SURITTO</h2>
            <span class="world-map-sub">24 Fusos Horários • Circunferência 166.5 km • Terreno gerado do próprio mundo do jogo</span>
          </div>
          <div class="world-map-controls">
            <span class="world-map-god-hint" id="world-map-god-hint" style="display: none;">👑 MODO DEUS: Clique no mapa para Teleportar!</span>
            <button class="world-map-close-btn" id="world-map-close-btn" title="Fechar Mapa [M / Esc]">✕</button>
          </div>
        </div>
        <div class="world-map-viewport" id="world-map-viewport">
          <canvas id="world-map-canvas" class="world-map-canvas"></canvas>
          <div class="world-map-tools">
            <button class="wm-btn" id="wm-zoom-in" title="Aproximar [+]">+</button>
            <button class="wm-btn" id="wm-zoom-out" title="Afastar [-]">−</button>
            <button class="wm-btn" id="wm-center" title="Centralizar em você [C]">⌖</button>
            <button class="wm-btn" id="wm-world" title="Mundo inteiro [0]">🌐</button>
          </div>
          <div class="world-map-hintbar">Roda do mouse: zoom • Arraste: mover • Duplo clique: aproximar • C: centralizar • 0: mundo inteiro</div>
        </div>
        <div class="world-map-footer">
          <div class="world-map-info-col">
            <span class="info-label">Coordenadas Atuais:</span>
            <strong id="world-map-coord-str">0.0° L • 45.0° N</strong>
          </div>
          <div class="world-map-info-col">
            <span class="info-label">Região / Bioma:</span>
            <strong id="world-map-region-str">Reinos de Valória [UTC+0]</strong>
          </div>
          <div class="world-map-info-col">
            <span class="info-label">Terreno Local:</span>
            <strong id="world-map-terrain-str">Campos & Bosques</strong>
          </div>
          <div class="world-map-info-col">
            <span class="info-label">Horário Solar:</span>
            <strong id="world-map-solar-str">12:00 (Dia)</strong>
          </div>
          <div class="world-map-info-col">
            <span class="info-label">Cursor no mapa:</span>
            <strong id="world-map-cursor-str">—</strong>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    this.modalEl = modal;
    this.viewportEl = document.getElementById('world-map-viewport');
    this.mapCanvas = document.getElementById('world-map-canvas');
    this.mctx = this.mapCanvas.getContext('2d');
    this.godHint = document.getElementById('world-map-god-hint');
  }

  setupEvents() {
    const minimapCard = document.getElementById('hud-minimap-widget');
    if (minimapCard) minimapCard.addEventListener('click', () => this.toggleWorldMap());

    const closeBtn = document.getElementById('world-map-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeWorldMap());
    const backdrop = document.getElementById('world-map-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => this.closeWorldMap());

    window.addEventListener('keydown', (e) => {
      const typing = e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');
      if (typing) return;
      if (e.key === 'm' || e.key === 'M') { this.toggleWorldMap(); return; }
      if (!this.isWorldMapOpen) return;
      if (e.key === 'Escape') this.closeWorldMap();
      else if (e.key === '+' || e.key === '=') this._zoomBy(1.6);
      else if (e.key === '-' || e.key === '_') this._zoomBy(1 / 1.6);
      else if (e.key === '0') this.showWholeWorld();
      else if (e.key === 'c' || e.key === 'C') this.centerOnPlayer();
    });

    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', (ev) => { ev.stopPropagation(); fn(); }); };
    on('wm-zoom-in', () => this._zoomBy(1.8));
    on('wm-zoom-out', () => this._zoomBy(1 / 1.8));
    on('wm-center', () => this.centerOnPlayer());
    on('wm-world', () => this.showWholeWorld());

    const cv = this.mapCanvas;
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      const p = this._evPos(e);
      this._zoomBy(Math.exp(-e.deltaY * 0.0018), p.x, p.y);
    }, { passive: false });
    cv.addEventListener('pointerdown', (e) => {
      const p = this._evPos(e);
      this._drag = { x: p.x, y: p.y, cx: this.view.cx, cy: this.view.cy, moved: 0 };
      try { cv.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      cv.style.cursor = 'grabbing';
    });
    cv.addEventListener('pointermove', (e) => {
      const p = this._evPos(e);
      this._mouse = p;
      if (this._drag) {
        const d = this._drag, dx = p.x - d.x, dy = p.y - d.y;
        d.moved = Math.max(d.moved, Math.hypot(dx, dy));
        this.view.cx = d.cx - dx / this.view.scale;
        this.view.cy = d.cy - dy / this.view.scale;
        this._clampView(); this._touch();
      }
    });
    cv.addEventListener('pointerup', (e) => {
      const d = this._drag; this._drag = null; cv.style.cursor = this.game.isGodMode ? 'crosshair' : 'grab';
      if (d && d.moved < 5 && this.game.isGodMode) {
        const p = this._evPos(e), w = this._screenToWorld(p.x, p.y);
        this._teleport(w.x, w.y);
      }
    });
    cv.addEventListener('pointerleave', () => { this._mouse = null; });
    cv.addEventListener('dblclick', (e) => { const p = this._evPos(e); this._zoomBy(2.2, p.x, p.y); });

    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => { if (this.isWorldMapOpen) { this._resize(); this._touch(); } });
      this._ro.observe(this.viewportEl);
    }
    window.addEventListener('resize', () => { if (this.isWorldMapOpen) { this._resize(); this._touch(); } });
  }

  // ---------------- geometria da visao ----------------
  _evPos(e) { const r = this.mapCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  _resize() {
    const el = this.viewportEl, dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(200, Math.floor(el.clientWidth)), h = Math.max(160, Math.floor(el.clientHeight));
    this.vpW = w; this.vpH = h; this.dpr = dpr;
    this.mapCanvas.width = Math.floor(w * dpr); this.mapCanvas.height = Math.floor(h * dpr);
    this.mapCanvas.style.width = w + 'px'; this.mapCanvas.style.height = h + 'px';
  }
  _minScale() { const W = this.game.world; return Math.min(this.vpW / W.WORLD_WIDTH, this.vpH / W.WORLD_HEIGHT); }
  _maxScale() { return 0.25; }                 // 1 px de tela = 4 px de mundo
  _clampView() {
    const W = this.game.world, v = this.view;
    v.scale = Math.max(this._minScale(), Math.min(this._maxScale(), v.scale));
    v.cx = W.wrapX(v.cx);
    const halfH = this.vpH / 2 / v.scale;
    if (W.WORLD_HEIGHT <= halfH * 2) v.cy = W.WORLD_HEIGHT / 2;
    else v.cy = Math.max(halfH, Math.min(W.WORLD_HEIGHT - halfH, v.cy));
  }
  _touch() { this._lastChange = performance.now(); this._fineDone = false; }
  _screenToWorld(sx, sy) {
    const v = this.view;
    return { x: this.game.world.wrapX(v.cx + (sx - this.vpW / 2) / v.scale), y: this.game.world.clampY(v.cy + (sy - this.vpH / 2) / v.scale) };
  }
  _zoomBy(f, sx, sy) {
    if (sx === undefined) { sx = this.vpW / 2; sy = this.vpH / 2; }
    const before = this._screenToWorldUnwrapped(sx, sy);
    this.view.scale = Math.max(this._minScale(), Math.min(this._maxScale(), this.view.scale * f));
    // mantem o ponto sob o cursor fixo
    this.view.cx = before.x - (sx - this.vpW / 2) / this.view.scale;
    this.view.cy = before.y - (sy - this.vpH / 2) / this.view.scale;
    this._clampView(); this._touch();
  }
  _screenToWorldUnwrapped(sx, sy) { const v = this.view; return { x: v.cx + (sx - this.vpW / 2) / v.scale, y: v.cy + (sy - this.vpH / 2) / v.scale }; }
  centerOnPlayer() { const p = this.game.player; this.view.cx = p.x; this.view.cy = p.y; this._clampView(); this._touch(); }
  showWholeWorld() { this.view.scale = this._minScale(); this.view.cx = this.game.world.WORLD_WIDTH / 2; this.view.cy = this.game.world.WORLD_HEIGHT / 2; this._clampView(); this._touch(); }

  _teleport(targetX, targetY) {
    const g = this.game;
    g.player.x = targetX; g.player.y = targetY; g.camera.x = targetX; g.camera.y = targetY;
    if (g.updateCalendarHUD) g.updateCalendarHUD();
    if (g.spawnDamageText) g.spawnDamageText(g.player.x, g.player.y - 40, '⚡ TELEPORTE DIVINO!', '#ffd43b', 18);
    if (g.addLog) {
      const info = g.world.getTimezoneInfo(targetX), terr = g.world.getTerrainAt(targetX, targetY);
      g.addLog(`⚡ [MODO DEUS] Teleportado para ${info.regionName} (${terr.name} • ${info.utcStr})!`, 'action');
    }
    this._updateInfo(true);
  }

  toggleWorldMap() { if (this.isWorldMapOpen) this.closeWorldMap(); else this.openWorldMap(); }

  openWorldMap() {
    this.isWorldMapOpen = true;
    if (this.modalEl) this.modalEl.style.display = 'flex';
    if (this.godHint) this.godHint.style.display = this.game.isGodMode ? 'inline-block' : 'none';
    this._resize();
    // abre centrado onde o jogador realmente esta (mantem o ultimo nivel de zoom; na 1a vez, uma visao regional)
    if (!this._opened) { this.view.scale = Math.max(this._minScale(), 0.0016); this._opened = true; }
    this.centerOnPlayer();
    this.mapCanvas.style.cursor = this.game.isGodMode ? 'crosshair' : 'grab';
    this._updateInfo(true);
    if (window.sounds) window.sounds.playUIClick?.();
    this._loopRunning = true;
    requestAnimationFrame(() => this._frame());
  }

  closeWorldMap() {
    this.isWorldMapOpen = false; this._loopRunning = false; this._drag = null;
    if (this.modalEl) this.modalEl.style.display = 'none';
  }

  // ---------------- desenho do terreno (a partir do getTerrainAt) ----------------
  _renderBase(cell) {
    const world = this.game.world, v = this.view, vw = this.vpW, vh = this.vpH;
    const W = world.WORLD_WIDTH, H = world.WORLD_HEIGHT, TID = MinimapSystem.TYPE_ID, COL = MinimapSystem.COLORS;
    const gw = Math.ceil(vw / cell), gh = Math.ceil(vh / cell), n = gw * gh;
    if (!this._grid || this._grid.length < n) this._grid = new Uint8Array(n);
    const g = this._grid, sc = v.scale;
    const x0 = v.cx - vw / 2 / sc, y0 = v.cy - vh / 2 / sc, step = cell / sc;
    for (let gy = 0; gy < gh; gy++) {
      const wy = y0 + (gy + 0.5) * step;
      if (wy < 0 || wy > H) { for (let gx = 0; gx < gw; gx++) g[gy * gw + gx] = 0; continue; }
      for (let gx = 0; gx < gw; gx++) g[gy * gw + gx] = TID[world.getTerrainAt(x0 + (gx + 0.5) * step, wy).type] || 4;
    }
    if (!this._baseCv) this._baseCv = document.createElement('canvas');
    const bc = this._baseCv; if (bc.width !== gw || bc.height !== gh) { bc.width = gw; bc.height = gh; }
    const bx = bc.getContext('2d'), img = bx.createImageData(gw, gh), d = img.data;
    const kk = Math.max(1, Math.round(3 / cell));
    const at = (x, y) => (x < 0 || y < 0 || x >= gw || y >= gh) ? -1 : g[y * gw + x];
    const isLand = (id) => id >= 3 && id !== 8;
    for (let gy = 0; gy < gh; gy++) {
      const wy = y0 + (gy + 0.5) * step;
      for (let gx = 0; gx < gw; gx++) {
        const id = g[gy * gw + gx], o = (gy * gw + gx) * 4;
        let r, gg, b;
        if (id === 0) { r = 11; gg = 13; b = 18; }
        else if (id <= 2 || id === 8) {
          const base = COL[id]; let band = 0;
          for (let k = 1; k <= 3 && !band; k++) {
            const s = k * kk;
            if (isLand(at(gx + s, gy)) || isLand(at(gx - s, gy)) || isLand(at(gx, gy + s)) || isLand(at(gx, gy - s)) ||
                isLand(at(gx + s, gy + s)) || isLand(at(gx - s, gy - s)) || isLand(at(gx + s, gy - s)) || isLand(at(gx - s, gy + s))) band = k;
          }
          const t = band ? (4 - band) * 0.17 : 0;           // mais claro perto da costa
          r = base[0] + (107 - base[0]) * t; gg = base[1] + (180 - base[1]) * t; b = base[2] + (224 - base[2]) * t;
        } else {
          const base = COL[id]; let f = 1;
          if (id === 4 || (id >= 10 && id <= 12)) { const wx = x0 + (gx + 0.5) * step; f = 1 + 0.035 * (Math.sin(wx * 0.0000047) * Math.cos(wy * 0.0000063) + 0.5 * Math.sin(wx * 0.000021 + wy * 0.000017)); }
          else if (id === 5 || id === 7 || id === 13) f = ((gx + gy) & 1) ? 0.9 : 1.04;
          r = base[0] * f; gg = base[1] * f; b = base[2] * f;
          const w4 = at(gx + 1, gy), w5 = at(gx - 1, gy), w6 = at(gx, gy + 1), w7 = at(gx, gy - 1);
          const wt = (q) => q > 0 && (q <= 2 || q === 8);
          if (wt(w4) || wt(w5) || wt(w6) || wt(w7)) { r = 38; gg = 52; b = 34; }
        }
        d[o] = r; d[o + 1] = gg; d[o + 2] = b; d[o + 3] = 255;
      }
    }
    bx.putImageData(img, 0, 0);
    this._base = { gw, gh, cell }; this._bv = { cx: v.cx, cy: v.cy, scale: v.scale };
    this._baseKey = `${v.cx.toFixed(2)}|${v.cy.toFixed(2)}|${sc}|${vw}|${vh}|${cell}`;
  }

  _frame() {
    if (!this.isWorldMapOpen || !this._loopRunning) return;
    const now = performance.now();
    const v = this.view;
    const key = (cell) => `${v.cx.toFixed(2)}|${v.cy.toFixed(2)}|${v.scale}|${this.vpW}|${this.vpH}|${cell}`;
    const interacting = this._drag || (now - this._lastChange) < 160;
    const cur = key(3);
    if (!this._base) this._renderBase(8);                           // 1a vez: versao grossa e rapida
    else if (interacting) {                                         // arrastando/zoom: NAO recalcula o terreno, so move/escala a imagem pronta
      const r = v.scale / this._bv.scale; if ((r > 4 || r < 0.25) && this._baseKey !== key(8)) this._renderBase(8);
    } else if (this._baseKey !== cur) this._renderBase(3);           // parou: uma unica passada nitida
    this._draw(now);
    requestAnimationFrame(() => this._frame());
  }

  // Agrupa os blocos do construtor em "construcoes" (recalcula no maximo 1x/segundo) e as desenha no mapa.
  _structClusters(now) {
    const arch = this.game.architect; if (!arch) return [];
    if (this._sc && now - this._sc.t < 1000) return this._sc.list;
    const W = this.game.world.WORLD_WIDTH, CELL = 1400, cells = new Map(), pts = [];
    for (const k in arch.blocks) {
      const b = arch.blocks[k]; if (b.wx === undefined) continue;
      const cfg = arch.BLOCK_TYPES[b.type]; if (!cfg) continue;
      const kind = cfg.isFloor ? 0 : (cfg.layer === 'f' || String(b.type).indexOf('furn') >= 0 ? 2 : 1);
      const p = { x: b.wx, y: b.wy, kind, temp: !!b.temp }; pts.push(p);
      const ck = Math.floor(b.wx / CELL) + ',' + Math.floor(b.wy / CELL);
      let c = cells.get(ck); if (!c) cells.set(ck, c = []); c.push(p);
    }
    // une celulas vizinhas (8 direcoes) em construcoes
    const seen = new Set(), list = [];
    for (const [ck, arr] of cells) {
      if (seen.has(ck)) continue;
      const stack = [ck], mem = []; seen.add(ck);
      while (stack.length) {
        const cur = stack.pop(), [cx, cy] = cur.split(',').map(Number); mem.push(...cells.get(cur));
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
          const nk = (cx + dx) + ',' + (cy + dy); if (cells.has(nk) && !seen.has(nk)) { seen.add(nk); stack.push(nk); }
        }
      }
      let x0 = 1e18, x1 = -1e18, y0 = 1e18, y1 = -1e18, temp = 0;
      for (const p of mem) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); if (p.temp) temp++; }
      const pal = this.game.palaceOrigin, isPalace = pal && pal.x >= x0 - 200 && pal.x <= x1 + 200 && pal.y >= y0 - 200 && pal.y <= y1 + 200;
      list.push({ pts: mem, x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, name: isPalace ? 'Palácio de Zeus' : 'Construção', palace: isPalace });
    }
    this._sc = { t: now, list };
    return list;
  }
  _drawStructures(ctx, now, sx, sy, vw, vh, sc) {
    const list = this._structClusters(now); if (!list.length) return;
    const world = this.game.world, v = this.view;
    for (const c of list) {
      const mx = sx(c.cx), my = sy(c.cy);
      const hw = (c.x1 - c.x0) / 2 * sc + 60 * sc, hh = (c.y1 - c.y0) / 2 * sc + 30 * sc;
      if (mx + hw < -60 || mx - hw > vw + 60 || my + hh < -40 || my - hh > vh + 40) continue;
      const gold = c.palace ? '#ffd43b' : '#9ad1ff';
      // pegada real (visivel quando ha pixels suficientes)
      if (sc >= 0.012) {
        const dw = 54 * sc, dh = 27 * sc;
        for (const p of c.pts) {
          const x = sx(p.x), y = sy(p.y); if (x < -dw * 2 || x > vw + dw * 2 || y < -dh * 2 || y > vh + dh * 2) continue;
          if (p.kind === 0) { ctx.fillStyle = c.palace ? 'rgba(205,220,240,0.85)' : 'rgba(200,170,120,0.85)'; ctx.beginPath(); ctx.moveTo(x, y - dh); ctx.lineTo(x + dw, y); ctx.lineTo(x, y + dh); ctx.lineTo(x - dw, y); ctx.closePath(); ctx.fill(); }
        }
        for (const p of c.pts) {
          if (p.kind === 0) continue;
          const x = sx(p.x), y = sy(p.y); if (x < -20 || x > vw + 20 || y < -20 || y > vh + 20) continue;
          ctx.fillStyle = p.kind === 1 ? '#3a4660' : '#ffcf4a'; const r = Math.max(1.2, (p.kind === 1 ? 14 : 9) * sc); ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      } else {
        ctx.fillStyle = c.palace ? 'rgba(255,212,59,0.35)' : 'rgba(154,209,255,0.35)';
        ctx.beginPath(); ctx.ellipse(mx, my, Math.max(3, hw), Math.max(2, hh), 0, 0, 7); ctx.fill();
      }
      // contorno
      ctx.strokeStyle = gold; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.ellipse(mx, my, Math.max(5, hw), Math.max(3, hh), 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      // marcador + nome (sempre visivel, para achar de longe)
      const top = my - Math.max(hh, 5) - 6;
      ctx.fillStyle = gold; ctx.strokeStyle = '#2a1d08'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mx, top + 2); ctx.lineTo(mx - 6, top - 10); ctx.lineTo(mx + 6, top - 10); ctx.closePath(); ctx.stroke(); ctx.fill();
      ctx.font = 'bold 11px Outfit, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const label = (c.palace ? '⚡ ' : '🏠 ') + c.name, tw = ctx.measureText(label).width + 10;
      ctx.fillStyle = 'rgba(14,17,23,0.88)'; ctx.fillRect(mx - tw / 2, top - 28, tw, 16);
      ctx.strokeStyle = gold; ctx.lineWidth = 1; ctx.strokeRect(mx - tw / 2 + 0.5, top - 27.5, tw - 1, 15);
      ctx.fillStyle = c.palace ? '#ffe066' : '#d6ecff'; ctx.fillText(label, mx, top - 20);
    }
  }

  _draw(now) {
    const ctx = this.mctx, vw = this.vpW, vh = this.vpH, dpr = this.dpr, world = this.game.world, v = this.view;
    const W = world.WORLD_WIDTH, H = world.WORLD_HEIGHT, sc = v.scale;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    ctx.imageSmoothingEnabled = false;
    if (this._base) {
      const bv = this._bv, r = v.scale / bv.scale, offx = vw / 2 * (1 - r) + world.wrapDelta(bv.cx - v.cx) * v.scale, offy = vh / 2 * (1 - r) + (bv.cy - v.cy) * v.scale;
      ctx.fillStyle = '#0b0d12'; ctx.fillRect(0, 0, vw, vh);
      ctx.save(); ctx.translate(offx, offy); ctx.scale(r, r);
      ctx.drawImage(this._baseCv, 0, 0, this._base.gw * this._base.cell, this._base.gh * this._base.cell); ctx.restore();
    }
    const sx = (wx) => vw / 2 + world.wrapDelta(wx - v.cx) * sc;     // mundo -> tela (com wrap em X)
    const sy = (wy) => vh / 2 + (wy - v.cy) * sc;
    ctx.font = '11px Outfit, sans-serif'; ctx.textBaseline = 'middle';

    // ---- grade de latitude / longitude ----
    const pxLon = W / 360 * sc, pxLat = H / 180 * sc, steps = [45, 30, 15, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
    const pick = (px) => { for (const s of steps) if (s * px >= 84) return s; return steps[steps.length - 1]; };
    const lonStep = pick(pxLon), latStep = pick(pxLat), dec = (s) => (s >= 1 ? 0 : (s >= 0.1 ? 1 : 2));
    const degL = (v.cx - vw / 2 / sc) / W * 360, degR = (v.cx + vw / 2 / sc) / W * 360;
    ctx.lineWidth = 1;
    const labels = [], fw0 = W / 24 * sc;
    for (let k = Math.ceil(degL / lonStep); k <= Math.floor(degR / lonStep); k++) {
      const d = k * lonStep, x = Math.round(vw / 2 + (d / 360 * W - v.cx) * sc) + 0.5;
      const dn = ((d + 180) % 360 + 360) % 360 - 180;
      ctx.strokeStyle = Math.abs(dn) < 1e-9 ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.16)';
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, vh); ctx.stroke();
      labels.push({ t: `${Math.abs(dn).toFixed(dec(lonStep))}°${dn < 0 ? ' O' : (dn > 0 ? ' L' : '')}`, x, y: (fw0 >= 26 ? (fw0 >= 90 ? 36 : 18) : 0) + 11, c: 'x' });
    }
    const latT = 90 - (v.cy - vh / 2 / sc) / H * 180, latB = 90 - (v.cy + vh / 2 / sc) / H * 180;
    for (let k = Math.ceil(latB / latStep); k <= Math.floor(latT / latStep); k++) {
      const d = k * latStep; if (d > 90 || d < -90) continue;
      const y = Math.round(sy((90 - d) / 180 * H)) + 0.5;
      ctx.strokeStyle = d === 0 ? 'rgba(255,224,102,0.55)' : 'rgba(255,255,255,0.16)';
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(vw, y); ctx.stroke();
      labels.push({ t: d === 0 ? 'Equador' : `${Math.abs(d).toFixed(dec(latStep))}° ${d > 0 ? 'N' : 'S'}`, x: 6, y, c: 'y' });
    }
    const pill = (t, x, y, align) => {
      const w = ctx.measureText(t).width + 8; const lx = align === 'center' ? x - w / 2 : x;
      ctx.fillStyle = 'rgba(8,10,14,0.72)'; ctx.fillRect(lx, y - 8, w, 16);
      ctx.fillStyle = '#e9d9a6'; ctx.textAlign = 'left'; ctx.fillText(t, lx + 4, y);
    };
    for (const l of labels) pill(l.t, l.x, l.y, l.c === 'x' ? 'center' : 'left');

    // ---- fusos horarios + regioes culturais (faixa no topo) ----
    const fw = W / 24 * sc;
    if (fw >= 26) {
      const ribbonH = fw >= 90 ? 36 : 18;
      ctx.fillStyle = 'rgba(8,10,14,0.66)'; ctx.fillRect(0, 0, vw, ribbonH);
      const first = Math.floor(degL / 15), last = Math.floor(degR / 15);
      for (let k = first; k <= last; k++) {
        const x0 = vw / 2 + (k * 15 / 360 * W - v.cx) * sc, fi = ((k % 24) + 24) % 24;
        let off = fi; if (off > 12) off -= 24;
        ctx.strokeStyle = 'rgba(255,224,102,0.35)'; ctx.beginPath(); ctx.moveTo(Math.round(x0) + 0.5, 0); ctx.lineTo(Math.round(x0) + 0.5, ribbonH); ctx.stroke();
        if (fw >= 44) { ctx.fillStyle = '#ffe066'; ctx.textAlign = 'center'; ctx.fillText(`UTC${off >= 0 ? '+' : ''}${off}`, x0 + fw / 2, 9); }
      }
      if (ribbonH > 18) {
        for (const r of world.regions) {
          for (let k = Math.floor(degL / 360) - 1; k <= Math.floor(degR / 360); k++) {
            const a = vw / 2 + ((k * 24 + r.minFuso) * 15 / 360 * W - v.cx) * sc, b = vw / 2 + ((k * 24 + r.maxFuso + 1) * 15 / 360 * W - v.cx) * sc;
            if (b < 0 || a > vw) continue;
            const w = b - a; ctx.font = '10px Outfit, sans-serif'; ctx.fillStyle = '#c9d4e0'; ctx.textAlign = 'center';
            const tw = ctx.measureText(r.name).width; if (tw < w - 8) ctx.fillText(r.name, (a + b) / 2, 26);
            ctx.font = '11px Outfit, sans-serif';
          }
        }
      }
    }

    // ---- nomes de acidentes geograficos (sem cidades) ----
    ctx.textAlign = 'center';
    for (const f of MinimapSystem.FEATURES) {
      if (f.big && sc > 0.004) continue;
      if (f.small && sc < 0.0009) continue;
      if (!f.big && !f.small && sc > 0.03) continue;
      const x = sx(f.u * W), y = sy(f.v * H); if (x < -60 || x > vw + 60 || y < 0 || y > vh) continue;
      ctx.font = `italic ${f.big ? 13 : 11}px "Cinzel", serif`;
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(10,14,20,0.8)'; ctx.strokeText(f.name, x, y);
      ctx.fillStyle = f.sea ? '#cfe8ff' : '#fff6dc'; ctx.fillText(f.name, x, y);
    }
    // ---- construcoes do jogador / palacio: pegada em tamanho real + marcador ----
    this._drawStructures(ctx, now, sx, sy, vw, vh, sc);
    // ---- pontos de interesse (cidades etc.) - lista vazia por enquanto ----
    for (const p of this.pois) {
      if (p.minScale && sc < p.minScale) continue;
      const x = sx(p.x), y = sy(p.y); if (x < -40 || x > vw + 40 || y < -20 || y > vh + 20) continue;
      ctx.fillStyle = '#ffe066'; ctx.strokeStyle = '#2a1d08'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.stroke(); ctx.fill();
      ctx.font = 'bold 11px Outfit, sans-serif'; ctx.textAlign = 'center'; ctx.strokeStyle = 'rgba(10,14,20,0.85)'; ctx.lineWidth = 3;
      ctx.strokeText(p.name, x, y - 12); ctx.fillStyle = '#fff'; ctx.fillText(p.name, x, y - 12);
    }

    // ---- jogador: area visivel no jogo + pino ----
    const pl = this.game.player;
    if (pl) {
      const px = sx(pl.x), py = sy(pl.y), gz = this.game.camera && this.game.camera.zoom || 1;
      const gw2 = (this.game.canvas ? this.game.canvas.width : 1280) / gz * sc, gh2 = (this.game.canvas ? this.game.canvas.height : 720) / gz * sc;
      if (gw2 >= 14) { ctx.strokeStyle = 'rgba(255,224,102,0.8)'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeRect(px - gw2 / 2, py - gh2 / 2, gw2, gh2); ctx.setLineDash([]); }
      const t = (now % 1800) / 1800, ringR = 6 + t * 22;
      ctx.strokeStyle = `rgba(255,212,59,${(1 - t) * 0.9})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, ringR, 0, 7); ctx.stroke();
      ctx.fillStyle = '#ffd43b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.shadowColor = '#ffd43b'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(px, py, 5.5, 0, 7); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      const lbl = `Você • ${world.getLongitudeStr(pl.x)} • ${world.getLatitudeStr(pl.y)}`;
      ctx.font = 'bold 11px Outfit, sans-serif'; ctx.textAlign = 'center';
      const tw = ctx.measureText(lbl).width + 12, ly = py > 40 ? py - 20 : py + 20;
      ctx.fillStyle = 'rgba(14,17,23,0.92)'; ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 1;
      ctx.fillRect(px - tw / 2, ly - 9, tw, 18); ctx.strokeRect(px - tw / 2 + 0.5, ly - 8.5, tw - 1, 17);
      ctx.fillStyle = '#ffe066'; ctx.fillText(lbl, px, ly);
    }

    // ---- mira do modo deus ----
    if (this.game.isGodMode && this._mouse && !this._drag) {
      ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.arc(this._mouse.x, this._mouse.y, 12, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    }

    // ---- escala em km e nivel de zoom ----
    const kmPerPx = 166.5 / W / sc;                 // km por pixel de tela
    const nice = [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
    let L = nice[0]; for (const n of nice) if (n / kmPerPx <= 140) L = n;
    const barPx = L / kmPerPx, bx0 = 14, by0 = vh - 34;
    ctx.fillStyle = 'rgba(8,10,14,0.7)'; ctx.fillRect(bx0 - 6, by0 - 16, barPx + 12 + 56, 34);
    ctx.strokeStyle = '#f1f3f5'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx0, by0 - 4); ctx.lineTo(bx0, by0 + 4); ctx.lineTo(bx0 + barPx, by0 + 4); ctx.lineTo(bx0 + barPx, by0 - 4); ctx.stroke();
    ctx.fillStyle = '#f1f3f5'; ctx.textAlign = 'left'; ctx.font = '11px Outfit, sans-serif';
    ctx.fillText(L >= 1 ? `${L} km` : `${Math.round(L * 1000)} m`, bx0 + barPx + 8, by0);
    ctx.fillText(`zoom ${(sc / this._minScale()).toFixed(sc / this._minScale() >= 10 ? 0 : 1)}×`, bx0, by0 - 11);

    // moldura
    ctx.strokeStyle = 'rgba(130,90,23,0.9)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, vw - 2, vh - 2);
    this._updateInfo(false);
  }

  // ---------------- rodape de informacoes ----------------
  _updateInfo(force) {
    const now = performance.now();
    if (!force && this._infoAt && now - this._infoAt < 200) { this._updateCursor(); return; }
    this._infoAt = now;
    const world = this.game.world, p = this.game.player; if (!p) return;
    const px = world.wrapX(p.x), py = world.clampY(p.y);
    const fuso = world.getTimezoneInfo(px), terr = world.getTerrainAt(px, py);
    let timeStr = '--:--';
    if (this.game.timeSystem && this.game.timeSystem.virtualDate) {
      const ld = world.getLocalSolarTime(this.game.timeSystem.virtualDate, px);
      timeStr = `${String(ld.getHours()).padStart(2, '0')}:${String(ld.getMinutes()).padStart(2, '0')}`;
    }
    const set = (id, t) => { const el = document.getElementById(id); if (el && el.innerText !== t) el.innerText = t; };
    set('world-map-coord-str', `${world.getLongitudeStr(px)} • ${world.getLatitudeStr(py)}`);
    set('world-map-region-str', `${fuso.regionName} [${fuso.utcStr}]`);
    set('world-map-terrain-str', terr.name);
    set('world-map-solar-str', `${timeStr} (${terr.isWater ? 'Águas' : 'Terra'})`);
    this._updateCursor();
  }
  _updateCursor() {
    const el = document.getElementById('world-map-cursor-str'); if (!el) return;
    let t = '—';
    if (this._mouse) {
      const mk = this._mouse.x + ',' + this._mouse.y + '|' + this.view.cx + '|' + this.view.scale;
      if (this._curKey === mk) return; this._curKey = mk;
      const w = this._screenToWorld(this._mouse.x, this._mouse.y), world = this.game.world, terr = world.getTerrainAt(w.x, w.y);
      t = `${world.getLongitudeStr(w.x)} • ${world.getLatitudeStr(w.y)} • ${terr.name}`;
    }
    if (el.innerText !== t) el.innerText = t;
  }

  // ---------------- radar (minimapa do HUD) ----------------
  update() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = cw / 2 - 2;

    ctx.clearRect(0, 0, cw, ch);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // 1. Fundo do radar: amostra o terreno real numa grade 30x30 ao redor do jogador
    const viewRange = 2400;
    const steps = 30;
    const stepSizePx = (viewRange * 2) / steps;
    const cellW = cw / steps;
    const cellH = ch / steps;
    const TID = MinimapSystem.TYPE_ID, COL = MinimapSystem.COLORS;

    // O terreno do radar muda devagar: amostra 30x30 em um canvas pequeno, refeito so quando o jogador anda ~1 celula (ou a cada 1,5 s)
    const pl0 = this.game.player, nowR = performance.now();
    let rc = this._radar;
    if (!rc || Math.abs(this.game.world.wrapDelta(pl0.x - rc.x)) > stepSizePx * 0.75 || Math.abs(pl0.y - rc.y) > stepSizePx * 0.75 || nowR - rc.t > 1500) {
      if (!rc) { rc = this._radar = { cv: document.createElement('canvas') }; rc.cv.width = steps; rc.cv.height = steps; }
      const rx = rc.cv.getContext('2d'), im = rx.createImageData(steps, steps), d = im.data;
      for (let ix = 0; ix < steps; ix++) {
        for (let iy = 0; iy < steps; iy++) {
          const terr = this.game.world.getTerrainAt(pl0.x + (ix - steps / 2 + 0.5) * stepSizePx, pl0.y + (iy - steps / 2 + 0.5) * stepSizePx);
          const c = COL[TID[terr.type] || 4], o = (iy * steps + ix) * 4;
          d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
        }
      }
      rx.putImageData(im, 0, 0); rc.x = pl0.x; rc.y = pl0.y; rc.t = nowR;
    }
    ctx.imageSmoothingEnabled = false;
    const offX = this.game.world.wrapDelta(rc.x - pl0.x) / stepSizePx * cellW, offY = (rc.y - pl0.y) / stepSizePx * cellH;
    ctx.fillStyle = '#0e1117'; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(rc.cv, offX - 0.5, offY - 0.5, cw + 1, ch + 1);

    // 2. Entidades proximas (arvores, cervos, lobos)
    if (this.game.trees) {
      ctx.fillStyle = '#2b8a3e';
      for (const t of this.game.trees) {
        const dx = this.game.world.wrapDelta(t.x - this.game.player.x);
        const dy = t.y - this.game.player.y;
        if (Math.hypot(dx, dy) < viewRange) {
          const mx = cx + (dx / viewRange) * (radius - 8);
          const my = cy + (dy / viewRange) * (radius - 8);
          ctx.beginPath();
          ctx.arc(mx, my, t.isStump ? 1.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (this.game.deers) {
      ctx.fillStyle = '#ffd43b';
      for (const d of this.game.deers) {
        const dx = this.game.world.wrapDelta(d.x - this.game.player.x);
        const dy = d.y - this.game.player.y;
        if (Math.hypot(dx, dy) < viewRange) {
          const mx = cx + (dx / viewRange) * (radius - 8);
          const my = cy + (dy / viewRange) * (radius - 8);
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (this.game.wolves) {
      ctx.fillStyle = '#ff6b6b';
      for (const w of this.game.wolves) {
        const dx = this.game.world.wrapDelta(w.x - this.game.player.x);
        const dy = w.y - this.game.player.y;
        if (Math.hypot(dx, dy) < viewRange) {
          const mx = cx + (dx / viewRange) * (radius - 8);
          const my = cy + (dy / viewRange) * (radius - 8);
          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Seta do jogador no centro
    ctx.save();
    ctx.translate(cx, cy);
    const facing = this.game.player.facingAngle || (Math.PI / 2);
    ctx.rotate(facing - Math.PI / 2);
    ctx.fillStyle = '#ffe066';
    ctx.strokeStyle = '#d9480f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}

window.MinimapSystem = MinimapSystem;
