// architect.js - Modo Construtor: catalogo, colocacao com encaixe, custos, colisao, portas e save por chunk (pecas do atlas dungeon).
// F5: sprites de cada estado das portas/portais do atlas. align 'face' = alinha pela ponta A (sprites de formas diferentes);
// align 'anchor' = mesmo quadro/ancora (portais).
const DUNGEON_DOOR_STATES = {
  door_wood_01: { ajar: 'door_wood_ajar_01', open: 'door_wood_open_01', align: 'face' },
  door_stone_01: { ajar: 'door_stone_ajar_01', open: 'door_stone_open_01', align: 'face' },

};

class ArchitectSystem {
  constructor(game) {
    this.game = game;
    this.isActive = false;
    this.GRID_SIZE = 48; // 48x48 pixel grid alignment
    this.CHUNK_TILES = 16; // F6: tamanho do chunk de save, em tiles
    this.selectedTool = 'fly';
    this.rotation = 0; // 0, 90, 180, 270 degrees
    this.wallLevels = 1;     // altura do muro a colocar: 1 ou 2 sprites
    this.stackMode = false;  // true: clicar numa peca coloca a nova EM CIMA dela
    this.buildLevel = 0;      // andar em que se constroi (0 = terreo)
    this.MAX_LEVEL = 3;
    this.FREE_BUILD = true;  // TEMPORARIO: modo Deus constroi de graca (sem custo nem reembolso). Mude para false para voltar a economia.
    this.STACK_STEP = 77;    // px de uma camada: altura da face frontal do muro (medida no sprite), assim a base de cima cobre o capeamento de baixo
    this.activeCategory = 'all'; // filtro de aba: 'all' ou subCategory do atlas
    this.isMinimized = false; // Collapsed/minimized panel state

    // O game.js ainda le estas listas (luz de lanternas): ficam vazias ate existirem objetos de cena.
    this.roads = [];
    this.structures = [];

    // Block Registry
    // blocks: { 'layer:gx,gy': { type, gx, gy, wx, wy, rot, isOpen, openT, lock } }
    this.blocks = {};

    // Catalogo: so as pecas do atlas dungeon (dungeon_blocks_data.js + geometria do atlas). As pecas antigas foram apagadas.
    this.BLOCK_TYPES = {};

    // Catalogo das pecas do atlas
    if (window.DUNGEON_BLOCKS_DATA) {
      Object.assign(this.BLOCK_TYPES, window.DUNGEON_BLOCKS_DATA);
    }
    // F1: se o atlas ja carregou antes do construtor existir, aplica a geometria agora.
    if (this.game.structures && this.game.structures.loaded) this.applyAtlasCatalog(this.game.structures.frames);

    this.init();
  }

  init() {
    this.createUI();
    this.setupEvents();
    this.loadSavedWorldData();
  }

  createUI() {
    // 1. Top God Mode Banner
    const banner = document.createElement('div');
    banner.id = 'god-mode-banner';
    banner.className = 'god-mode-banner';
    banner.style.display = 'none';
    banner.innerHTML = `
      <div class="god-badge">👑 MODO DEUS & CONSTRUTOR [F2]</div>
      <div class="god-controls-hint">
        <span><b>WASD:</b> Voo Rápido (650 px/s)</span> •
        <span><b>Noclip:</b> Atravessa Mares e Matas</span> •
        <span><b>R:</b> Rotacionar Bloco (0°/90°/180°/270°)</span> •
        <span><b>H:</b> Altura do muro (1x/2x)</span> •
        <span><b>T:</b> Empilhar sobre uma peca</span> •
        <span><b>G:</b> Andar (0-3)</span> •
        <span><b>Scroll:</b> Zoom Livre</span> •
        <span><b>M:</b> Teleporte no Mapa</span>
      </div>
      <button class="btn-god-exit" id="btn-god-exit" title="Sair do Modo Construtor [F2]">Sair [F2]</button>
    `;
    document.body.appendChild(banner);

    // 2. Compact Architect Panel (Quadradinho Estilo Skill/Inventário acima do Chat)
    const panel = document.createElement('div');
    panel.id = 'architect-panel';
    panel.className = 'architect-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
      <div class="arch-panel-header">
        <div class="arch-header-left">
          <span class="arch-crest">🛠️</span>
          <div>
            <div class="arch-title">MODO CONSTRUTOR</div>
            <div class="arch-subtitle">Painel de Criação [F2]</div>
          </div>
        </div>
        <div class="arch-header-right">
          <button class="arch-btn-icon" id="btn-arch-min" title="Minimizar / Expandir Painel">_</button>
          <button class="arch-btn-icon close" id="btn-arch-close" title="Fechar Construtor [F2]">✕</button>
        </div>
      </div>

      <div class="arch-panel-body" id="arch-panel-body">
        <!-- Abas de Categorias (Igual à tela de Skill/Codex) -->
        <div class="arch-category-tabs">
          <button class="arch-cat-tab active" data-cat="all">⭐ Todos</button>
          <button class="arch-cat-tab" data-cat="stone_walls">🧱 Pedras (20)</button>
          <button class="arch-cat-tab" data-cat="doors">🚪 Portas</button>
          <button class="arch-cat-tab" data-cat="gates">⛓️ Grades</button>
          <button class="arch-cat-tab" data-cat="brick_walls">🏰 Tijolos</button>
          <button class="arch-cat-tab" data-cat="wood_walls">🪵 Madeiras</button>
          <button class="arch-cat-tab" data-cat="arches">⛩️ Arcos</button>
          <button class="arch-cat-tab" data-cat="floors">🟫 Pisos (4)</button>
          <button class="arch-cat-tab" data-cat="stairs">🪜 Escadas (2)</button>
          <button class="arch-cat-tab" data-cat="roofs">🏠 Telhados (3)</button>
          <button class="arch-cat-tab" data-cat="furniture">🪑 Móveis (12)</button>
        </div>

        <!-- Barra Dinâmica de Sub-Filtros / Famílias (Ex: Lisas, Musgo, Quebradas) -->
        <div class="arch-sub-tabs" id="arch-sub-tabs" style="display: none;"></div>

        <!-- Grade de Blocos e Peças Construtíveis (Quadradinhos) -->
        <div class="arch-items-grid" id="arch-items-grid"></div>

        <!-- Rodapé de Ações & Modificadores -->
        <div class="arch-panel-footer">
          <div class="arch-footer-row">
            <button class="arch-tool-btn" id="btn-arch-height" title="Altura do muro: 1 ou 2 sprites [H]">⬆️ Altura <span id="arch-height-val">1x</span></button>
            <button class="arch-tool-btn" id="btn-arch-stack" title="Empilhar: clique numa peca para colocar a nova em cima dela [T]">🧱 Empilhar <span id="arch-stack-val">Off</span></button>
            <button class="arch-tool-btn" id="btn-arch-level" title="Andar em que voce constroi: 0 (terreo), 1, 2, 3 [G]">🏢 Andar <span id="arch-level-val">0</span></button>
          </div>
          <div class="arch-footer-row">
            <button class="arch-tool-btn" id="btn-arch-fly" data-tool="fly" title="Voo Livre e Inspeção (WASD rápido)">🖐️ Voo</button>
            <button class="arch-tool-btn" id="btn-arch-rot" title="Rotacionar Bloco [R]">🔄 <span id="arch-rot-val">0°</span></button>
            <button class="arch-tool-btn btn-danger" id="btn-arch-del" data-tool="delete" title="Demolir Bloco sob o Cursor">🗑️ Demolir</button>
          </div>
          <div class="arch-footer-row secondary">
            <div class="arch-zoom-group">
              <span class="zoom-label">Zoom:</span>
              <button class="btn-zoom-sm" id="btn-zoom-out" title="Afastar Câmera">−</button>
              <span class="arch-zoom-val" id="arch-zoom-val">1.0x</span>
              <button class="btn-zoom-sm" id="btn-zoom-in" title="Aproximar Câmera">+</button>
              <button class="btn-zoom-sm" id="btn-zoom-reset" title="Restaurar Zoom">1x</button>
            </div>
            <button class="btn-export-arch" id="btn-arch-export" title="Exportar Castelo / Cidade para JSON">💾 Exportar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    this.bannerEl = banner;
    this.panelEl = panel;
    this.zoomValEl = document.getElementById('arch-zoom-val');
    this.rotValEl = document.getElementById('arch-rot-val');
    this.heightValEl = document.getElementById('arch-height-val');
    this.stackValEl = document.getElementById('arch-stack-val');

    this.renderSubTabs();
    this.renderItemsGrid();
  }

  renderSubTabs() {
    const subContainer = document.getElementById('arch-sub-tabs');
    if (!subContainer) return;
    subContainer.innerHTML = '';

    const subFiltersMap = {
      stone_walls: [
        { id: 'all', label: '⭐ Todas (20)' },
        { id: 'stone_clean', label: '🧱 Lisas (7)' },
        { id: 'stone_mossy', label: '🌿 Com Musgo (8)' },
        { id: 'stone_broken', label: '💥 Quebradas (5)' }
      ],
      brick_walls: [
        { id: 'all', label: '⭐ Todos' },
        { id: 'brick_red', label: '🏰 Rústicos' },
        { id: 'brick_dark', label: '🌑 Tijolo Escuro' }
      ],
      doors: [
        { id: 'all', label: '⭐ Todas' },
        { id: 'door_single', label: '🚪 Simples (1 bloco)' },
        { id: 'door_double', label: '🏰 Duplos (mais largos)' }
      ]
    };

    const currentFilters = subFiltersMap[this.activeCategory];
    if (!currentFilters) {
      subContainer.style.display = 'none';
      this.activeSubSet = 'all';
      return;
    }

    subContainer.style.display = 'flex';
    if (!currentFilters.some(f => f.id === this.activeSubSet)) {
      this.activeSubSet = 'all';
    }

    currentFilters.forEach(f => {
      const btn = document.createElement('button');
      btn.className = `arch-sub-tab ${this.activeSubSet === f.id ? 'active' : ''}`;
      btn.innerText = f.label;
      btn.addEventListener('click', () => {
        this.activeSubSet = f.id;
        subContainer.querySelectorAll('.arch-sub-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderItemsGrid();
        if (window.sounds) window.sounds.playUIClick?.();
      });
      subContainer.appendChild(btn);
    });
  }

  renderItemsGrid() {
    const grid = document.getElementById('arch-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const id in this.BLOCK_TYPES) {
      const cfg = this.BLOCK_TYPES[id];
      // Match general category or dungeon subCategory
      if (this.activeCategory !== 'all') {
        if (cfg.category !== this.activeCategory && cfg.subCategory !== this.activeCategory) {
          continue;
        }
      }

      if (cfg.hidden || !cfg.isDungeon) continue; // fora do painel: variacoes/estados, pecas antigas (a refazer) e pecas descartadas

      // Match subSet within category
      if (this.activeSubSet && this.activeSubSet !== 'all') {
        if (cfg.subSet !== this.activeSubSet) {
          continue;
        }
      }

      const card = document.createElement('div');
      card.className = `arch-item-card ${this.selectedTool === id ? 'selected' : ''}`;
      card.dataset.tool = id;
      
      const tooltipText = cfg.hint ? `${cfg.name}\n💡 ${cfg.hint}` : `${cfg.name} (Camada ${cfg.layer})`;
      card.title = tooltipText;

      const iconFrame = document.createElement('div');
      iconFrame.className = 'arch-card-icon-frame';

      if (cfg.isDungeon && cfg.frame && this.game.structures && this.game.structures.atlasImage) {
        // Thumbnail crop from Dungeon Atlas
        const cvs = document.createElement('canvas');
        cvs.width = 38;
        cvs.height = 38;
        const cctx = cvs.getContext('2d');
        cctx.imageSmoothingEnabled = false;
        const fw = cfg.frame.w;
        const fh = cfg.frame.h;
        const scale = Math.min(38 / fw, 38 / fh);
        const dw = fw * scale;
        const dh = fh * scale;
        const dx = (38 - dw) / 2;
        const dy = (38 - dh) / 2;
        cctx.drawImage(
          this.game.structures.atlasImage,
          cfg.frame.x, cfg.frame.y, fw, fh,
          dx, dy, dw, dh
        );
        cvs.className = 'arch-card-img';
        iconFrame.appendChild(cvs);
      } else if (cfg.isFurniture && window.FurnitureRenderer) {
        const R = window.FurnitureRenderer.sprite(cfg.furn, 0, 0);
        const cvs = document.createElement('canvas'); cvs.width = 38; cvs.height = 38; cvs.className = 'arch-card-img';
        const cc = cvs.getContext('2d'), sc = Math.min(34 / R.canvas.width, 34 / R.canvas.height, 0.6);
        cc.imageSmoothingEnabled = false; cc.drawImage(R.canvas, (38 - R.canvas.width * sc) / 2, (38 - R.canvas.height * sc) / 2, R.canvas.width * sc, R.canvas.height * sc);
        iconFrame.appendChild(cvs);
      } else if (cfg.isRoof && window.RoofRenderer) {
        const R = this._roofImg(cfg.roofStyle, 2, 2, 'a');
        const cvs = document.createElement('canvas'); cvs.width = 38; cvs.height = 38; cvs.className = 'arch-card-img';
        const cc = cvs.getContext('2d'), sc = Math.min(36 / R.canvas.width, 36 / R.canvas.height);
        cc.drawImage(R.canvas, (38 - R.canvas.width * sc) / 2, (38 - R.canvas.height * sc) / 2, R.canvas.width * sc, R.canvas.height * sc);
        iconFrame.appendChild(cvs);
      } else if (cfg.img) {
        const img = document.createElement('img');
        img.src = `assets/blocks/${cfg.img}?v=2`;
        img.className = 'arch-card-img';
        img.alt = cfg.name;
        iconFrame.appendChild(img);
      } else {
        const emoji = document.createElement('span');
        emoji.className = 'arch-card-emoji';
        emoji.innerText = cfg.icon || '📦';
        iconFrame.appendChild(emoji);
      }

      const nameSpan = document.createElement('span');
      nameSpan.className = 'arch-card-name';
      nameSpan.innerText = cfg.name;

      card.appendChild(iconFrame);
      card.appendChild(nameSpan);
      const cst = this.buildCost(id);
      if (cst) {
        const cs = document.createElement('span'); cs.className = 'arch-card-cost'; cs.innerText = this._costText(cst);
        card.appendChild(cs);
        if (!this.canAfford(id)) card.classList.add('arch-nomat');
        card.title += `\n🧱 Custo: ${this._costText(cst)}  •  Demolir devolve 80%`;
      }

      card.addEventListener('click', () => {
        this.selectTool(id);
      });

      grid.appendChild(card);
    }
  }

  selectTool(toolId) {
    this.selectedTool = toolId;

    // Update item cards selection
    const cards = document.querySelectorAll('.arch-item-card');
    cards.forEach(c => {
      c.classList.toggle('selected', c.dataset.tool === toolId);
    });

    // Update footer tools (fly, delete)
    const flyBtn = document.getElementById('btn-arch-fly');
    const delBtn = document.getElementById('btn-arch-del');
    if (flyBtn) flyBtn.classList.toggle('active', toolId === 'fly');
    if (delBtn) delBtn.classList.toggle('active', toolId === 'delete');

    if (window.sounds) window.sounds.playUIClick?.();
  }

  setupEvents() {
    // F2 Key Toggle
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        this.toggle();
      }
      // H: altura do muro; T: modo empilhar
      if (this.isActive && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key === 'h' || e.key === 'H') { e.preventDefault(); this.cycleWallHeight(); }
        if (e.key === 't' || e.key === 'T') { e.preventDefault(); this.toggleStack(); }
        if (e.key === 'g' || e.key === 'G') { e.preventDefault(); this.cycleBuildLevel(); }
      }
      // R Key to rotate block
      if ((e.key === 'r' || e.key === 'R') && this.isActive) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.cycleRotation();
        }
      }
    });

    // F5: Shift pressionado (Shift+clique tranca/destranca porta ou grade)
    window.addEventListener('keydown', (e) => { if (e.key === 'Shift') this.shiftDown = true; });
    window.addEventListener('keyup', (e) => { if (e.key === 'Shift') this.shiftDown = false; });
    window.addEventListener('blur', () => { this.shiftDown = false; });

    // Exit & Close Buttons
    document.getElementById('btn-god-exit')?.addEventListener('click', () => this.toggle());
    document.getElementById('btn-arch-close')?.addEventListener('click', () => this.toggle());

    // Minimize / Expand Button
    const minBtn = document.getElementById('btn-arch-min');
    const bodyEl = document.getElementById('arch-panel-body');
    if (minBtn && bodyEl) {
      minBtn.addEventListener('click', () => {
        this.isMinimized = !this.isMinimized;
        bodyEl.style.display = this.isMinimized ? 'none' : 'flex';
        minBtn.innerText = this.isMinimized ? '＋' : '_';
        minBtn.title = this.isMinimized ? 'Expandir Painel' : 'Minimizar Painel';
      });
    }

    // Category Tabs Filter
    const catTabs = this.panelEl.querySelectorAll('.arch-cat-tab');
    catTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.cat;
        this.activeSubSet = 'all';
        this.renderSubTabs();
        this.renderItemsGrid();
      });
    });

    document.getElementById('btn-arch-height')?.addEventListener('click', () => this.cycleWallHeight());
    document.getElementById('btn-arch-stack')?.addEventListener('click', () => this.toggleStack());
    document.getElementById('btn-arch-level')?.addEventListener('click', () => this.cycleBuildLevel());

    // Rotation Button
    document.getElementById('btn-arch-rot')?.addEventListener('click', () => this.cycleRotation());

    // Footer Tool Buttons (Fly, Delete)
    document.getElementById('btn-arch-fly')?.addEventListener('click', () => this.selectTool('fly'));
    document.getElementById('btn-arch-del')?.addEventListener('click', () => this.selectTool('delete'));

    // Zoom Buttons
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.adjustZoom(0.15));
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.adjustZoom(-0.15));
    document.getElementById('btn-zoom-reset')?.addEventListener('click', () => this.setZoom(1.0));

    // Mouse Wheel Zoom in God Mode
    window.addEventListener('wheel', (e) => {
      if (this.isActive && !e.target.closest('#world-map-modal') && !e.target.closest('#architect-panel')) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.adjustZoom(delta);
      }
    }, { passive: true });

    // Canvas click to place block
    this.game.canvas.addEventListener('mousedown', (e) => {
      if (!this.isActive || this.selectedTool === 'fly' || e.button !== 0) return;
      this.handleBlockClick(this.game.mouse.worldX, this.game.mouse.worldY);
    });

    // Continuous dragging to lay down floors, walls, and roofs or demolish easily
    this.game.canvas.addEventListener('mousemove', (e) => {
      if (!this.isActive || !this.game.mouse.isLeftDown || this.selectedTool === 'fly') return;
      const dragCfg = this.BLOCK_TYPES[this.selectedTool];
      if (dragCfg && dragCfg.isDungeon && !dragCfg.isFloor) return; // F2: pecas do atlas encaixam por clique, nao por arrasto
      this.handleBlockClick(this.game.mouse.worldX, this.game.mouse.worldY);
    });

    // Export/Save Button
    document.getElementById('btn-arch-export')?.addEventListener('click', () => this.exportVillageJSON());
  }

  cycleWallHeight() {
    this.wallLevels = this.wallLevels === 1 ? 2 : 1;
    if (this.heightValEl) this.heightValEl.innerText = this.wallLevels + 'x';
    document.getElementById('btn-arch-height')?.classList.toggle('active', this.wallLevels > 1);
    if (window.sounds) window.sounds.playUIClick?.();
  }

  cycleBuildLevel() {
    this.buildLevel = (this.buildLevel + 1) % (this.MAX_LEVEL + 1);
    const el = document.getElementById('arch-level-val'); if (el) el.innerText = this.buildLevel;
    document.getElementById('btn-arch-level')?.classList.toggle('active', this.buildLevel > 0);
    if (window.sounds) window.sounds.playUIClick?.();
  }

  toggleStack() {
    this.stackMode = !this.stackMode;
    if (this.stackValEl) this.stackValEl.innerText = this.stackMode ? 'On' : 'Off';
    document.getElementById('btn-arch-stack')?.classList.toggle('active', this.stackMode);
    if (window.sounds) window.sounds.playUIClick?.();
  }

  cycleRotation() {
    this.rotation = (this.rotation + 90) % 360;
    if (this.rotValEl) {
      const labels = { 0: '0° (Frontal/Sul)', 90: '90° (Lateral/Leste)', 180: '180° (Frontal/Norte)', 270: '270° (Lateral/Oeste)' };
      this.rotValEl.innerText = labels[this.rotation] || `${this.rotation}°`;
    }
    if (window.sounds) window.sounds.playUIClick?.();
  }

  toggle() {
    this.isActive = !this.isActive;
    this.game.isGodMode = this.isActive;
    if (this.game.player) this.game.player.z = 0;   // modo Deus: sempre no chao

    if (this.isActive) {
      this.bannerEl.style.display = 'flex';
      this.panelEl.style.display = 'flex';
      this.renderItemsGrid();
      this.selectTool(this.selectedTool);
      this.game.player.speed = 650; // Super Fast Flight Speed!
      if (this.game.minimap) this.game.minimap.godHint.style.display = 'inline-block';
      if (this.game.addLog) this.game.addLog('👑 [MODO DEUS & CONSTRUTOR] Ativado! Voo rápido, noclip e painel de blocos aberto [F2].', 'action');
    } else {
      this.bannerEl.style.display = 'none';
      this.panelEl.style.display = 'none';
      this.game.player.speed = 185; // Normal speed
      this.setZoom(1.0);
      if (this.game.minimap) this.game.minimap.godHint.style.display = 'none';
      if (this.game.addLog) this.game.addLog('🛡️ [MODO CONSTRUTOR] Desativado. Modo sobrevivência restaurado.', 'system');
    }
  }

  adjustZoom(delta) {
    let z = (this.game.camera.zoom || 1.0) + delta;
    z = Math.max(0.18, Math.min(2.0, z));
    this.setZoom(z);
  }

  setZoom(val) {
    this.game.camera.zoom = Number(val.toFixed(2));
    if (this.zoomValEl) this.zoomValEl.innerText = `${this.game.camera.zoom.toFixed(2)}x`;
  }

  // Procura a peca registrada no tile (as pecas do atlas ocupam 1 chave de tile; a posicao exata fica em wx,wy).
  getBlockAt(layer, rawGX, rawGY) {
    const normX = this.normGX(rawGX);
    const direct = this.blocks[`${layer}:${normX},${rawGY}`];
    return direct ? { block: direct, anchorGX: normX, anchorGY: rawGY, isAnchor: true } : null;
  }

  // ---- F2: encaixe por pontas (ver js/dungeon_snap.js) ----
  // Ancora de uma peca do atlas no mundo: posicao exata (wx,wy) se foi encaixada, senao o centro-base do tile.
  dungeonAnchor(b) {
    const G = this.GRID_SIZE;
    if (b.wx !== undefined && b.wy !== undefined) return { x: b.wx, y: b.wy };
    return { x: b.gx * G + G / 2, y: b.gy * G + G };
  }

  // Lista das pecas do atlas ja construidas (camada 1) no formato do DungeonSnap.
  getDungeonPieces() {
    const out = [];
    for (const key in this.blocks) {
      if (!key.startsWith('1:')) continue;
      const b = this.blocks[key];
      const cfg = this.BLOCK_TYPES[b.type];
      if (!cfg || !cfg.isDungeon) continue;
      const a = this.dungeonAnchor(b);
      out.push({ sprite: cfg.sprite, ax: a.x, ay: a.y, flip: b.rot === 90 || b.rot === 270, block: b, z: b.z || 0 });
    }
    return out;
  }

  // So muros e quinas podem ser empilhados / ter altura 2x
  _stackable(cfg) { return !!(cfg && cfg.isDungeon && (cfg.kind === 'wall' || cfg.kind === 'wall_frontal' || cfg.isCorner)); }

  // Peca (a de cima, se houver pilha) sob o cursor, considerando o deslocamento vertical de cada camada.
  pickPieceAt(wx, wy) {
    const frames = this.game.structures && this.game.structures.frames;
    if (!frames) return null;
    let hit = null;
    for (const p of this.getDungeonPieces()) {
      const meta = frames[p.sprite];
      if (!meta) continue;
      const f = meta.frame, an = meta.anchor, lift = p.z * this.STACK_STEP;
      const x0 = p.flip ? p.ax - (f.w - an.x) : p.ax - an.x;
      const y0 = p.ay - lift - an.y;
      const cx = this.game.world.wrapDelta(wx - p.ax) + p.ax;
      if (cx < x0 || cx > x0 + f.w || wy < y0 || wy > y0 + f.h) continue;
      const d = Math.hypot(cx - p.ax, (wy - p.ay + lift) * 2);
      if (!hit || p.z > hit.p.z || (p.z === hit.p.z && d < hit.d)) hit = { p, d };
    }
    return hit && hit.p;
  }

  // Onde a ferramenta vai colocar pecas se o jogador clicar em (wx,wy): lista [{type,x,y,flip,z,snapped}].
  //  - normal: encaixada numa ponta livre (ou no tile) no chao
  //  - modo Empilhar: em cima da peca sob o cursor (mesma posicao, proxima camada livre)
  //  - Altura 2x: acrescenta uma segunda peca por cima
  planDungeonPlacement(type, wx, wy, rotation) {
    const cfg = this.BLOCK_TYPES[type];
    const stackable = this._stackable(cfg);
    let base = null, z0 = 0;
    if (stackable && this.stackMode) {
      const t = this.pickPieceAt(wx, wy);
      if (t && this._stackable(this.BLOCK_TYPES['dungeon_' + t.sprite])) {
        let top = 0;
        for (const q of this.getDungeonPieces()) if (Math.abs(q.ax - t.ax) < 2 && Math.abs(q.ay - t.ay) < 2 && q.flip === t.flip && q.z > top) top = q.z;
        base = { x: t.ax, y: t.ay, flip: t.flip, snapped: true }; z0 = top + 1;
      }
    }
    if (!base) { base = this.resolveDungeonPlacement(cfg, wx, wy + this.buildLevel * this.STACK_STEP, rotation); z0 = this.buildLevel; }
    const plan = [{ type, x: base.x, y: base.y, flip: base.flip, snapped: base.snapped, z: z0 }];
    if (stackable && this.wallLevels > 1) for (let k = 1; k < this.wallLevels; k++) plan.push({ type, x: base.x, y: base.y, flip: base.flip, snapped: base.snapped, z: z0 + k });
    return plan;
  }

  // F1: unico ponto de entrada para criar uma peca do atlas no mundo (construtor, cena de teste, futuros planos).
  // type = chave do BLOCK_TYPES (ex.: 'dungeon_stone_wall_straight_01'); (wx,wy) = ancora exata; flip = espelhada.
  // opts.temp = peca de cena (nao salva, nao exporta).
  addDungeonPiece(type, wx, wy, flip, opts = {}) {
    const cfg = this.BLOCK_TYPES[type];
    if (!cfg || !cfg.isDungeon) return null;
    const G = this.GRID_SIZE;
    const layer = cfg.layer;
    const pgx = this.normGX(Math.floor(this.game.world.wrapX(wx) / G));
    const pgy = Math.ceil(wy / G) - 1;
    const z = opts.z || 0;
    let kgx = pgx, kgy = pgy, key;
    if (z > 0) {
      // camadas de cima: chave propria (nao entram na colisao, que so olha o chao)
      let n = 0; do { key = `${layer}:${pgx},${pgy},z${z}${n ? '#' + n : ''}`; n++; } while (this.blocks[key]);
    } else {
      // Chave = tile livre mais proximo (a colisao procura as pecas pelos tiles em volta, +-2 em x e y).
      // Antes, com os 9 tiles vizinhos ocupados, a peca nova sobrescrevia uma existente.
      key = null;
      for (const [ox, oy] of ArchitectSystem.KEY_OFFSETS) {
        const k = `${layer}:${this.normGX(pgx + ox)},${pgy + oy}`;
        if (!this.blocks[k]) { kgx = this.normGX(pgx + ox); kgy = pgy + oy; key = k; break; }
      }
      if (!key) {   // tudo ocupado: guarda mesmo assim (sem colisao) em vez de apagar outra peca
        let n = 1; do { key = `${layer}:${pgx},${pgy}#${n++}`; } while (this.blocks[key]);
        console.warn('[Construtor] sem tile livre perto de', pgx, pgy, '- peca sem colisao:', type);
      }
    }
    const b = {
      type, gx: kgx, gy: kgy, wx: Math.round(wx), wy: Math.round(wy),
      rot: flip ? 90 : 0, layer, height: 1, isOpen: false, placedAt: Date.now()
    };
    if (z > 0) b.z = z;
    if (opts.temp) b.temp = true;
    this.blocks[key] = b;
    this._ec = null;
    return b;
  }

  // F1: coloca uma peca do atlas ja encaixada (mesma regra do clique do jogador). Devolve o bloco ou null.
  placeDungeonSnapped(type, wx, wy, rotation, opts = {}) {
    const cfg = this.BLOCK_TYPES[type];
    if (!cfg || !cfg.isDungeon) return null;
    const pl = this.resolveDungeonPlacement(cfg, wx, wy, rotation || 0);
    return this.addDungeonPiece(type, pl.x, pl.y, pl.flip, opts);
  }

  // F1: aplica a geometria do atlas (frame, anchor, face, ground) as definicoes de blocos dungeon.
  // Chamado pelo StructureManager quando o JSON do atlas termina de carregar.
  applyAtlasCatalog(frames) {
    let n = 0;
    for (const key in this.BLOCK_TYPES) {
      const cfg = this.BLOCK_TYPES[key];
      if (!cfg || !cfg.isDungeon) continue;
      const f = frames[cfg.sprite];
      if (!f) continue;
      cfg.frame = f.frame; cfg.anchor = f.anchor; cfg.face = f.face; cfg.ground = f.ground; cfg.nativeSlope = f.nativeSlope;
      n++;
    }
    if (this.panelEl && this.renderItemsGrid) this.renderItemsGrid();
    return n;
  }

  // Onde a peca 'cfg' vai ficar se o jogador clicar em (wx,wy): encaixada numa ponta livre ou no tile da grade.
  resolveDungeonPlacement(cfg, wx, wy, rotation) {
    const G = this.GRID_SIZE;
    const prefFlip = (rotation === 90 || rotation === 270);
    const frames = this.game.structures && this.game.structures.frames;
    if (window.DungeonSnap && frames) {
      const lvl = this.buildLevel;
      const snap = window.DungeonSnap.findSnap(this.getDungeonPieces().filter(p => (p.z || 0) === lvl), frames, cfg.sprite, wx, wy, prefFlip, 90);
      if (snap) return { x: snap.x, y: snap.y, flip: snap.flip, snapped: true };
    }
    const fv = this._floorVertexSnap(cfg, wx, wy, prefFlip, frames);
    if (fv) return fv;
    const gx = this.normGX(Math.floor(this.game.world.wrapX(wx) / G));
    const gy = Math.floor(wy / G);
    return { x: gx * G + G / 2, y: gy * G + G, flip: prefFlip, snapped: false };
  }

  handleBlockClick(wx, wy) {
    // DEMOLIR: clica em qualquer ponto do desenho (peca mais alta da pilha); devolve 80% do custo.
    // Se for uma peca com outras por cima, as de cima caem junto.
    if (this.selectedTool === 'delete') {
      if (this._demolishRoofAt(wx, wy)) return;
      if (this._demolishFurnitureAt(wx, wy)) return;     // telhado por cima de tudo: clicar no telhado derruba o telhado
      const hit = this.pickPieceAt(wx, wy);
      if (!hit) { this._demolishFloorAt(wx, wy); return; }
      const lift = hit.z * this.STACK_STEP;
      for (const p of this.getDungeonPieces()) {
        const same = p.block === hit.block;
        const above = Math.abs(p.ax - hit.ax) < 2 && Math.abs(p.ay - hit.ay) < 2 && p.flip === hit.flip && p.z > hit.z;
        if (!same && !above) continue;
        this._refund(p.block.type, p.ax, p.ay - p.z * this.STACK_STEP);
        for (const k of Object.keys(this.blocks)) if (this.blocks[k] === p.block) delete this.blocks[k];
      }
      this.game.spawnDamageText(hit.ax, hit.ay - lift - 30, '🗑️ Demolido!', '#ff6b6b', 14);
      this.saveWorldData();
      return;
    }

    // CONSTRUIR: pecas do atlas encaixam ponta com ponta (A/B) e guardam a posicao exata (wx,wy)
    const cfg = this.BLOCK_TYPES[this.selectedTool];
    if (!cfg || !cfg.isDungeon) return;
    if (cfg.isFurniture) { this._placeFurniture(this.selectedTool, wx, wy + this.buildLevel * this.STACK_STEP); return; }
    if (cfg.isRoof) { this._placeRoof(this.selectedTool, wx, wy + this.buildLevel * this.STACK_STEP); return; }
    if (cfg.isFloor) { this._placeFloor(this.selectedTool, wx, wy + this.buildLevel * this.STACK_STEP); return; }
    if (cfg.kind === 'stair') { this._placeStair(this.selectedTool, wx, wy + this.buildLevel * this.STACK_STEP); return; }
    const plan = this.planDungeonPlacement(this.selectedTool, wx, wy, this.rotation);
    const pieces = this.getDungeonPieces();
    const taken = pl => pieces.some(p => Math.abs(p.ax - pl.x) < 2 && Math.abs(p.ay - pl.y) < 2 && p.flip === pl.flip && p.z === pl.z &&
      (pl.z > 0 || p.sprite === cfg.sprite));
    const todo = plan.filter(pl => !taken(pl));
    if (!todo.length) return;
    const cost = this._costSum(todo.map(pl => pl.type));
    if (!this._chargeCost(cost)) { this._noMaterial(todo[0].type, todo[0].x, todo[0].y - todo[0].z * this.STACK_STEP, cost); return; }
    for (const pl of todo) this.addDungeonPiece(pl.type, pl.x, pl.y, pl.flip, { z: pl.z });
    if (window.sounds) window.sounds.playWoodChop?.();
    this.saveWorldData();
  }

  // ---- F7: economia da construcao ----
  // Custo por peca do atlas (so madeira/pedra por enquanto). Pecas antigas (nao-atlas) continuam gratis.
  // Qualquer entrada do dungeon_blocks_data.js pode trazer `cost: {stone:n, wood:n}` para sobrescrever a regra.
  buildCost(type) {
    const cfg = this.BLOCK_TYPES[type];
    if (!cfg || !cfg.isDungeon) return null;
    if (cfg.cost) return cfg.cost;
    if (cfg.isFurniture) return cfg.costs || { wood: 2 };
    if (cfg.isRoof) return cfg.roofStyle === 'tile' ? { stone: 2 } : cfg.roofStyle === 'wood' ? { wood: 2 } : { wood: 1 };   // por celula de piso coberta
    const sp = cfg.sprite || '', k = cfg.kind, sub = cfg.subCategory;
    if (k === 'stair') return sp.indexOf('wood') >= 0 ? { wood: 6 } : { stone: 6 };
    if (k === 'floor') return sp.indexOf('parquet') >= 0 ? { wood: 2 } : sp.indexOf('wood') >= 0 ? { wood: 1 } : sp.indexOf('polished') >= 0 ? { stone: 2 } : { stone: 1 };
    if (sp.indexOf('portal_wood') === 0) return { wood: sp.indexOf('wide') > 0 ? 6 : 4 };
    if (sp.indexOf('portal_stone') === 0) return { stone: sp.indexOf('wide') > 0 ? 6 : 4 };
    if (sp.indexOf('door_stone') === 0) return { stone: 4 };
    if (sp.indexOf('door_wood') === 0) return { wood: 3 };
    if (sub === 'wood_walls') return { wood: k === 'gate' ? 3 : (k === 'wall_frontal' ? 1 : 2) };
    if (k === 'gate') return sp.indexOf('wood') >= 0 ? { wood: 3 } : { stone: 5 };
    if (k === 'fence') return { stone: 2 };
    if (k === 'arch') return { stone: 4 };
    if (k === 'ruin') return { stone: 1 };
    if (sub === 'brick_walls') return { stone: 3 };
    return { stone: 2 }; // paredes, quinas e pilares de pedra
  }

  _invCount(id) {
    const inv = this.game.inventory; if (!inv) return 0;
    let n = 0; for (const sl of inv.slots) if (sl && sl.id === id) n += sl.count; return n;
  }
  _missing(cost) {
    const out = {}; if (!cost || this.FREE_BUILD) return out;
    for (const id in cost) { const lack = cost[id] - this._invCount(id); if (lack > 0) out[id] = lack; }
    return out;
  }
  canAfford(type) { return Object.keys(this._missing(this.buildCost(type))).length === 0; }
  // soma o custo de varias pecas (muro alto = 2 pecas)
  _costSum(types) {
    const out = {}; let any = false;
    for (const t of types) { const c = this.buildCost(t); if (!c) continue; any = true; for (const id in c) out[id] = (out[id] || 0) + c[id]; }
    return any ? out : null;
  }
  _costText(cost) {
    if (this.FREE_BUILD) return 'Grátis';
    if (!cost) return 'Grátis';
    const ic = { stone: '🪨', wood: '🪵' }; return Object.keys(cost).map(id => `${ic[id] || id} ${cost[id]}`).join('  ');
  }
  // Cobra o material do inventario (retorna false se faltar).
  _charge(type) { return this._chargeCost(this.buildCost(type)); }
  _chargeCost(cost) {
    if (!cost || this.FREE_BUILD) return true;
    if (Object.keys(this._missing(cost)).length) return false;
    const inv = this.game.inventory;
    for (const id in cost) {
      let left = cost[id];
      for (let i = inv.slots.length - 1; i >= 0 && left > 0; i--) {
        const sl = inv.slots[i]; if (!sl || sl.id !== id) continue;
        const take = Math.min(sl.count, left); inv.removeItem(i, take); left -= take;
      }
    }
    this._refreshCostCards();
    return true;
  }
  // Devolve 80% (arredondado) do custo ao demolir.
  _refund(type, x, y, mult = 1) {
    const cost = this.buildCost(type); if (!cost || this.FREE_BUILD) return;
    const inv = this.game.inventory; const got = [];
    for (const id in cost) {
      const n = Math.round(cost[id] * 0.8 * mult); if (n <= 0) continue;
      inv.addItem(id, n); got.push({ id, n });
    }
    if (got.length && this.game.spawnDamageText) {
      const ic = { stone: '🪨', wood: '🪵' };
      this.game.spawnDamageText(x, y - 14, '+' + got.map(g => `${g.n}${ic[g.id] || g.id}`).join(' '), '#8ce99a', 13);
    }
    this._refreshCostCards();
  }
  _noMaterial(type, x, y, cost) {
    const miss = this._missing(cost || this.buildCost(type)); const ic = { stone: '🪨', wood: '🪵' };
    const txt = Object.keys(miss).map(id => `${miss[id]} ${ic[id] || id}`).join(' + ');
    if (this.game.spawnDamageText) this.game.spawnDamageText(x, y - 30, 'Falta ' + txt, '#ff6b6b', 14);
    if (this.game.addLog) this.game.addLog(`⚠️ [CONSTRUTOR] Material insuficiente para ${this.BLOCK_TYPES[type].name}: faltam ${txt}.`, 'warning');
  }
  _refreshCostCards() {
    document.querySelectorAll('#arch-items-grid .arch-item-card').forEach(c => {
      const id = c.dataset.tool; if (!id) return;
      c.classList.toggle('arch-nomat', !this.canAfford(id));
    });
  }

  // ---- F6: persistencia por chunk ----
  // Cada chunk (16x16 tiles) vira uma chave propria no localStorage; so os chunks que mudaram sao regravados
  // (em lote, com debounce). Indice: 'suritto_chunks_v1'. O save antigo ('suritto_blocks_v2') e migrado
  // uma vez e fica intacto como copia de seguranca.
  _chunkIdOf(b) {
    const T = this.CHUNK_TILES || 16;
    return `${Math.floor(this.normGX(b.gx) / T)},${Math.floor(b.gy / T)}`;
  }

  saveWorldData() {
    this._ec = null; this._fl = null; this._ecVer = (this._ecVer || 0) + 1;
    if (this._saveTimer) return;
    this._saveTimer = setTimeout(() => { this._saveTimer = null; this.flushSave(); }, 250);
    if (!this._saveHooked && typeof window !== 'undefined') {
      this._saveHooked = true;
      const flush = () => { if (this._saveTimer) { clearTimeout(this._saveTimer); this._saveTimer = null; } this.flushSave(); };
      window.addEventListener('beforeunload', flush);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
    }
  }

  flushSave() {
    const chunks = {};
    const pb = this._persistentBlocks();
    for (const k in pb) { const id = this._chunkIdOf(pb[k]); (chunks[id] = chunks[id] || []).push([k, pb[k]]); }
    this._chunkCache = this._chunkCache || {};
    const srv = window.SurittoServer;
    if (srv && srv.online) return this._flushToServer(chunks);
    let failed = false, wrote = 0;
    const ids = Object.keys(chunks);
    for (const id of ids) {
      const str = JSON.stringify(chunks[id]);
      if (this._chunkCache[id] === str) continue;
      try { localStorage.setItem('suritto_chunk_v1:' + id, str); this._chunkCache[id] = str; wrote++; }
      catch (e) { failed = true; }
    }
    for (const id of Object.keys(this._chunkCache)) {       // chunks que ficaram vazios
      if (chunks[id]) continue;
      try { localStorage.removeItem('suritto_chunk_v1:' + id); delete this._chunkCache[id]; wrote++; } catch (e) { }
    }
    if (wrote || !this._indexWritten) {
      try { localStorage.setItem('suritto_chunks_v1', JSON.stringify({ v: 1, tiles: this.CHUNK_TILES || 16, ids: Object.keys(this._chunkCache) })); this._indexWritten = true; }
      catch (e) { failed = true; }
    }
    if (failed && !this._saveWarned) {
      this._saveWarned = true;
      if (this.game.addLog) this.game.addLog('⚠️ [CONSTRUTOR] Nao foi possivel salvar (armazenamento do navegador cheio). Use 💾 Exportar para guardar sua construcao.', 'system');
    } else if (!failed) this._saveWarned = false;
    return !failed;
  }

  // Servidor no ar (js/net.js): so os chunks que mudaram vao para o banco (world.build_chunk), num lote.
  // Se o envio falhar, o chunk volta a contar como "mudado" e vai de novo no proximo salvamento.
  _flushToServer(chunks, keepalive) {
    const batch = {}, prev = {};
    for (const id in chunks) {
      const str = JSON.stringify(chunks[id]);
      if (this._chunkCache[id] === str) continue;
      prev[id] = this._chunkCache[id]; batch[id] = chunks[id]; this._chunkCache[id] = str;
    }
    for (const id of Object.keys(this._chunkCache)) {
      if (chunks[id]) continue;
      prev[id] = this._chunkCache[id]; batch[id] = []; delete this._chunkCache[id];
    }
    if (!Object.keys(batch).length) return true;
    window.SurittoServer.saveChunks(batch, keepalive || document.visibilityState === 'hidden').then(() => { this._saveWarned = false; }).catch(() => {
      for (const id in prev) { if (prev[id] === undefined) delete this._chunkCache[id]; else this._chunkCache[id] = prev[id]; }
      if (!this._saveWarned && this.game.addLog) { this._saveWarned = true; this.game.addLog('⚠️ [CONSTRUTOR] O servidor nao respondeu: as construcoes serao reenviadas no proximo salvamento.', 'warning'); }
    });
    return true;
  }

  // Le os chunks salvos neste navegador (localStorage) como lista de blocos com _key
  _localChunkBlocks() {
    const list = [];
    try {
      const idx = localStorage.getItem('suritto_chunks_v1');
      if (!idx) return list;
      for (const id of JSON.parse(idx).ids || []) {
        const raw = localStorage.getItem('suritto_chunk_v1:' + id);
        if (raw) for (const [k, b] of JSON.parse(raw)) { b._key = k; list.push(b); }
      }
    } catch (e) { }
    return list;
  }

  // Blocos que vao para save/exportacao (pecas de cena temporaria ficam de fora).
  _persistentBlocks() {
    const out = {};
    for (const k in this.blocks) { if (!this.blocks[k].temp) out[k] = this.blocks[k]; }
    return out;
  }

  loadSavedWorldData() {
    this._ec = null; this._fl = null;
    this.blocks = {};
    this._chunkCache = {};
    // Limpeza unica (F8): todas as construcoes feitas ate aqui eram de teste e foram apagadas.
    try {
      if (localStorage.getItem('suritto_reset') !== 'f8_clean') {
        const del = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.indexOf('suritto_chunk_v1:') === 0 || k === 'suritto_chunks_v1' || k === 'suritto_blocks_v2')) del.push(k);
        }
        del.forEach(k => localStorage.removeItem(k));
        localStorage.setItem('suritto_reset', 'f8_clean');
      }
    } catch (e) { }
    let list = null;
    const srv = window.SurittoServer;
    if (srv && srv.online) {
      // Mundo vem do banco. Na primeira vez que este navegador fala com o servidor, as construcoes que so
      // existiam aqui (localStorage) sao juntadas ao mundo e enviadas (as pecas de vila nao: a vila e remontada).
      list = [];
      const have = new Set();
      for (const ch of srv.chunks) {
        this._chunkCache[ch.id] = JSON.stringify(ch.blocks);
        for (const [k, b] of ch.blocks) { b._key = k; list.push(b); have.add(k); }
      }
      const flag = 'suritto_uploaded:' + srv.realm;
      let uploaded = true; try { uploaded = !!localStorage.getItem(flag); } catch (e) { }
      if (!uploaded) {
        const mine = this._localChunkBlocks().filter(b => !b.town && !b.temp && !have.has(b._key));
        list.push(...mine);
        if (mine.length) { this._migrate = true; console.info(`[Construtor] ${mine.length} peca(s) deste navegador enviadas ao servidor.`); }
        try { localStorage.setItem(flag, new Date().toISOString()); } catch (e) { }
      }
    } else try {
      const idx = localStorage.getItem('suritto_chunks_v1');
      if (idx) {
        list = [];
        for (const id of JSON.parse(idx).ids || []) {
          const raw = localStorage.getItem('suritto_chunk_v1:' + id);
          if (!raw) continue;
          this._chunkCache[id] = raw;
          for (const [k, b] of JSON.parse(raw)) { b._key = k; list.push(b); }
        }
        this._indexWritten = true;
      } else {
        const saved = localStorage.getItem('suritto_blocks_v2');   // migracao do save antigo (fica como backup)
        if (saved) { list = Object.values(JSON.parse(saved)); this._migrate = true; }
      }
    } catch (e) { list = list || []; }
    if (!list) return;
    // Normaliza as chaves dos tiles
    for (const b of list) {
      if (!b || !this.BLOCK_TYPES[b.type]) continue; // tipo que nao existe mais
      b.gx = this.normGX(b.gx);
      const k = b._key || `${b.layer}:${b.gx},${b.gy}`; delete b._key;
      this.blocks[k] = b;
    }
    if (this._migrate) { this._migrate = false; this.flushSave(); }
  }

  exportVillageJSON() {
    const data = {
      version: '2.0_blocks',
      worldWidth: this.game.world.WORLD_WIDTH,
      totalBlocks: Object.keys(this._persistentBlocks()).length,
      blocks: this._persistentBlocks()
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suritto_castelo_vilarejo_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (this.game.addLog) this.game.addLog(`💾 [CONSTRUTOR] Castelo / Vilarejo exportado com sucesso (${Object.keys(this.blocks).length} blocos modulares)!`, 'system');
  }

  normGX(gx) {
    const maxTilesX = Math.floor(this.game.world.WORLD_WIDTH / this.GRID_SIZE);
    return ((gx % maxTilesX) + maxTilesX) % maxTilesX;
  }

  // Check physical solid wall collision taking into account player body/foot radius (14px)
  isSolidAt(worldX, worldY, radius = 14, z = 0, noFurn = false) {
    const G = this.GRID_SIZE;
    const level = Math.round(z / this.STACK_STEP);
    // Moveis so bloqueiam quando o player esta de fato NO andar deles (na escada, a meio caminho, o movel do andar de cima nao pode prender)
    if (!noFurn && Math.abs(z - level * this.STACK_STEP) <= 12 && this._furnSolid(worldX, worldY, level)) return true;
    if (level > 0) return this._isSolidUp(worldX, worldY, radius, level);
    // As pecas do atlas chegam a ~130px da ancora (~2,5 tiles) e a chave pode estar ate 2 tiles da ancora (KEY_OFFSETS): varre os tiles vizinhos.
    const minGX = Math.floor((worldX - (170 + radius)) / G), maxGX = Math.floor((worldX + (170 + radius)) / G);
    const minGY = Math.floor((worldY - (100 + radius)) / G), maxGY = Math.floor((worldY + (100 + radius)) / G);
    const frames = this.game.structures && this.game.structures.frames;
    const Snap = window.DungeonSnap;

    for (let gy = minGY; gy <= maxGY; gy++) {
      for (let rawGX = minGX; rawGX <= maxGX; rawGX++) {
        const res = this.getBlockAt(1, rawGX, gy);
        if (!res) continue;
        const block = res.block;
        const cfg = this.BLOCK_TYPES[block.type];
        if (!cfg || !cfg.isDungeon || !Snap || !frames) continue;
        if (!cfg.solid && !cfg.isArch) continue; // entulho/decoracao atravessavel
        const anc = this.dungeonAnchor(block);
        const dx = this.game.world.wrapDelta(worldX - anc.x), dy = worldY - anc.y;
        const flip = block.rot === 90 || block.rot === 270;
        const rEff = Math.min(radius, 10); // raio efetivo menor: o desenho ja afasta o jogador e os vaos ficam passaveis

        // Portais/arcos e portas/grades abertas: vao livre, so os pilares bloqueiam (portais)
        if (this.isDungeonOpenPassable(block, cfg)) {
          if (this._isPortalLike(cfg)) {
            const pc = Snap.portalPosts(flip, cfg.sprite.indexOf('wide') > 0 ? 50 : 30);
            for (const sg of pc.segs) if (this._distToSegment(dx, dy, sg[0], sg[1], sg[2], sg[3]) < pc.half + rEff) return true;
          }
          continue;
        }
        // Colisores vindos do atlas (reta, quina, arco, pilar)
        const col = Snap.colliderSegments(frames[cfg.sprite], flip);
        if (!col) continue;
        for (const sg of col.segs) if (this._distToSegment(dx, dy, sg[0], sg[1], sg[2], sg[3]) < col.half + rEff) return true;
      }
    }
    return false;
  }

  // Colisao nos andares de cima: so as pecas daquele andar (z == level), vindas da lista (nao ha indice por tile)
  _isSolidUp(worldX, worldY, radius, level) {
    const frames = this.game.structures && this.game.structures.frames, Snap = window.DungeonSnap;
    if (!frames || !Snap) return false;
    const rEff = Math.min(radius, 10);
    for (const p of this.getDungeonPieces()) {
      if ((p.z || 0) !== level) continue;
      const cfg = this.BLOCK_TYPES[p.block.type];
      if (!cfg || (!cfg.solid && !cfg.isArch)) continue;
      const dx = this.game.world.wrapDelta(worldX - p.ax), dy = worldY - p.ay;
      if (Math.abs(dx) > 160 || Math.abs(dy) > 120) continue;
      const block = p.block, flip = p.flip;
      if (this.isDungeonOpenPassable(block, cfg)) {
        if (this._isPortalLike(cfg)) {
          const pc = Snap.portalPosts(flip, cfg.sprite.indexOf('wide') > 0 ? 50 : 30);
          for (const sg of pc.segs) if (this._distToSegment(dx, dy, sg[0], sg[1], sg[2], sg[3]) < pc.half + rEff) return true;
        }
        continue;
      }
      const col = Snap.colliderSegments(frames[cfg.sprite], flip);
      if (!col) continue;
      for (const sg of col.segs) if (this._distToSegment(dx, dy, sg[0], sg[1], sg[2], sg[3]) < col.half + rEff) return true;
    }
    return false;
  }

  // Helper: Shortest distance from point (px, py) to line segment (x0, y0)-(x1, y1)
  _distToSegment(px, py, x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) return Math.hypot(px - x0, py - y0);
    let t = ((px - x0) * dx + (py - y0) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x0 + t * dx;
    const projY = y0 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  // Toggle door open/closed at coordinates (works seamlessly from any tile of the door)
  // ---- F5: portas e grades das pecas do atlas ----
  // 'swap' = porta de madeira que troca de sprite (fechada/entreaberta/aberta); 'lift' = grade/portao que sobe.
  dungeonDoorMode(cfg) {
    if (!cfg || !cfg.isDungeon) return null;
    if (DUNGEON_DOOR_STATES[cfg.sprite]) return 'swap';
    if (cfg.kind === 'gate' || cfg.kind === 'fence' || cfg.sprite === 'double_door_iron_gate_01') return 'lift';
    return null;
  }

  // progresso de abertura 0..1 (blocos antigos/salvos sem 'openT' derivam de isOpen)
  dungeonOpenT(b) {
    return b.openT !== undefined ? b.openT : (b.isOpen ? 1 : 0);
  }

  // passavel quando a abertura passou de ~2/3
  _isPortalLike(cfg) { return !!(cfg && cfg.isDungeon && ((cfg.sprite || '').indexOf('portal_') >= 0 || cfg.kind === 'arch')); }

  isDungeonOpenPassable(b, cfg) {
    if (this._isPortalLike(cfg)) return true; // portal = arco, sem folha: sempre livre
    return !!this.dungeonDoorMode(cfg) && this.dungeonOpenT(b) >= 0.66;
  }

  // Acha a peca interativa (porta/grade) cujo desenho contem o ponto (wx,wy).
  pickDungeonPiece(wx, wy, onlyDoors) {
    const frames = this.game.structures && this.game.structures.frames;
    if (!frames) return null;
    let hit = null, hitD = Infinity;
    for (const p of this.getDungeonPieces()) {
      const cfg = this.BLOCK_TYPES['dungeon_' + p.sprite];
      if (onlyDoors && !this.dungeonDoorMode(cfg)) continue;
      const meta = frames[p.sprite];
      if (!meta) continue;
      const f = meta.frame, an = meta.anchor;
      const x0 = p.flip ? p.ax - (f.w - an.x) : p.ax - an.x;
      const y0 = p.ay - an.y;
      const cx = this.game.world.wrapDelta(wx - p.ax) + p.ax;
      if (cx < x0 - 6 || cx > x0 + f.w + 6 || wy < y0 - 6 || wy > y0 + f.h + 6) continue;
      const d = Math.hypot(cx - p.ax, (wy - p.ay) * 2);
      if (d < hitD) { hitD = d; hit = p; }
    }
    return hit;
  }

  // Interacao com porta/grade do atlas. Shift+clique tranca/destranca; peca trancada pede teste D20 de Ladinagem.
  interactDungeonDoor(wx, wy) {
    const hit = this.pickDungeonPiece(wx, wy, true);
    if (!hit) return false;
    const b = hit.block;
    const group = [b];
    const say = (txt, col) => this.game.spawnDamageText && this.game.spawnDamageText(hit.ax, hit.ay - 70, txt, col || '#ffd43b', 13);

    if (this.shiftDown) {
      if (b.lock && b.lock.locked) { for (const g of group) if (g.lock) g.lock.locked = false; say('🔓 Destrancada'); }
      else { for (const g of group) { g.lock = { locked: true, cd: 12 }; g.isOpen = false; } say('🔒 Trancada (CD 12)'); }
      this.saveWorldData();
      return true;
    }
    if (b.lock && b.lock.locked) {
      const skills = this.game.skills;
      const bonus = (skills && skills.secondarySkills && skills.secondarySkills.ladinagem && skills.secondarySkills.ladinagem.bonus) || 0;
      if (window.diceSystem) {
        window.diceSystem.rollD20('Arrombar fechadura', bonus, b.lock.cd, (res) => {
          if (res.isSuccess) {
            for (const g of group) if (g.lock) g.lock.locked = false;
            say('🔓 Arrombada!', '#51cf66');
            if (skills && skills.addXP) skills.addXP('ladinagem', 12, false);
            this.saveWorldData();
          } else {
            say('🔒 Continua trancada', '#ff6b6b');
          }
        });
      } else say('🔒 Trancada', '#ff6b6b');
      return true;
    }
    const willOpen = !b.isOpen;
    for (const g of group) {
      g.isOpen = willOpen;
      if (g.openT === undefined) g.openT = willOpen ? 0 : 1;
      (this._animDoors = this._animDoors || new Set()).add(g);
    }
    say(b.isOpen ? '🚪 Aberta' : '🚪 Fechada');
    this.saveWorldData();
    return true;
  }

  toggleDoorAt(worldX, worldY) {
    return this.interactDungeonDoor(worldX, worldY);
  }

  // Chamado todo frame pelo game.js: anima portas/grades (abre/fecha em ~0,35 s).
  updateRoofTransparency(dt) {
    if (this._animDoors && this._animDoors.size) {
      for (const b of this._animDoors) {
        const target = b.isOpen ? 1 : 0;
        const cur = this.dungeonOpenT(b);
        const step = 3 * dt;
        b.openT = cur < target ? Math.min(target, cur + step) : Math.max(target, cur - step);
        if (b.openT === target) this._animDoors.delete(b);
      }
    }
  }

  // Camada de chao (pisos): sera refeita. O game.js ainda chama este metodo.
  // Pisos do terreo sao estaticos: ficam pre-desenhados em blocos de 512px (com 2px de sobra para nao haver frestas) e sao
  // copiados com 1 drawImage cada, em vez de ~400 drawImage por frame. Sao refeitos so quando o conjunto de blocos muda.
  drawRoads(ctx, screenCenterX, screenCenterY) {
    const frames = this.game.structures && this.game.structures.frames;
    if (!frames) return;
    const cam = this.game.camera, W = this.game.world, CS = 512, M = 2;
    const viewW = this.game.canvas.width / (cam.zoom || 1.0);
    const viewH = this.game.canvas.height / (cam.zoom || 1.0);
    const sig = (this._ecVer || 0) + '|' + Object.keys(this.blocks).length + '|' + (this.game.structures.loaded ? 1 : 0);
    if (!this._fc || this._fc.sig !== sig) {
      const idx = new Map();
      for (const key in this.blocks) {
        if (key.charAt(0) !== '0') continue;
        const b = this.blocks[key], cfg = this.BLOCK_TYPES[b.type];
        if (!cfg || !cfg.isFloor || b.wx === undefined || b.z) continue;
        const x0 = Math.floor((b.wx - 60) / CS), x1 = Math.floor((b.wx + 60) / CS), y0 = Math.floor((b.wy - 40) / CS), y1 = Math.floor((b.wy + 40) / CS);
        for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
          const k = cx + ',' + cy; let a = idx.get(k); if (!a) idx.set(k, a = []); a.push([b.wy, cfg.sprite, b.wx]);
        }
      }
      for (const a of idx.values()) a.sort((p, q) => p[0] - q[0]);
      this._fc = { sig, idx, cv: new Map() };
    }
    const fc = this._fc, visible = [];
    const cx0 = Math.floor((cam.x - viewW / 2 - 140) / CS), cx1 = Math.floor((cam.x + viewW / 2 + 140) / CS);
    const cy0 = Math.floor((cam.y - viewH / 2 - 100) / CS), cy1 = Math.floor((cam.y + viewH / 2 + 100) / CS);
    // wrap em X: o indice usa wx absoluto; a camera tambem, entao nao precisa normalizar aqui
    for (let cx = cx0; cx <= cx1; cx++) for (let cy = cy0; cy <= cy1; cy++) { const k = cx + ',' + cy; if (fc.idx.has(k)) visible.push([k, cx, cy]); }
    if (!visible.length) return;
    if (visible.length > 22) {          // muito afastado: desenho direto (nao vale gastar memoria em tantos blocos)
      const list = [];
      for (const key in this.blocks) {
        if (key.charAt(0) !== '0') continue;
        const b = this.blocks[key], cfg = this.BLOCK_TYPES[b.type];
        if (!cfg || !cfg.isFloor || b.wx === undefined || b.z) continue;
        const dx = W.wrapDelta(b.wx - cam.x), dy = b.wy - cam.y;
        if (Math.abs(dx) > viewW / 2 + 120 || Math.abs(dy) > viewH / 2 + 80) continue;
        list.push([b.wy, cfg.sprite, Math.round(dx + screenCenterX), Math.round(dy + screenCenterY)]);
      }
      list.sort((a, c) => a[0] - c[0]);
      for (const f of list) this.game.structures.drawStructure(ctx, f[1], f[2], f[3], false);
      return;
    }
    for (const [k, cx, cy] of visible) {
      let cv = fc.cv.get(k);
      if (!cv) {
        cv = document.createElement('canvas'); cv.width = CS + M * 2; cv.height = CS + M * 2;
        const c2 = cv.getContext('2d'), ox = cx * CS - M, oy = cy * CS - M;
        for (const f of fc.idx.get(k)) this.game.structures.drawStructure(c2, f[1], Math.round(f[2] - ox), Math.round(f[0] - oy), false);
        fc.cv.set(k, cv);
        if (fc.cv.size > 40) fc.cv.delete(fc.cv.keys().next().value);
      } else { fc.cv.delete(k); fc.cv.set(k, cv); }
      ctx.drawImage(cv, Math.round(W.wrapDelta(cx * CS - M - cam.x) + screenCenterX), Math.round(cy * CS - M - cam.y + screenCenterY));
    }
  }

  // ---- Pisos: losangos 108x54 numa malha isometrica ----
  // A malha nasce do piso vizinho mais proximo; sem piso por perto, do muro mais proximo; senao da origem do mundo.
  _floorOrigin(wx, wy) {
    const W = this.game.world;
    let best = null, bd = 140 * 140;
    for (const k in this.blocks) {                       // 1) piso vizinho: continua a mesma malha
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined || !this.BLOCK_TYPES[b.type] || !this.BLOCK_TYPES[b.type].isFloor) continue;
      const dx = W.wrapDelta(b.wx - wx), dy = b.wy - wy, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = { x: b.wx, y: b.wy }; }
    }
    if (best) return best;
    // 2) vertice de muro mais proximo (pontas A/B e quinas): todo vertice da malha e vertice de losango
    const frames = this.game.structures && this.game.structures.frames;
    bd = 260 * 260;
    if (frames && window.DungeonSnap) {
      for (const p of this.getDungeonPieces()) {
        if (p.z) continue;
        const meta = frames[p.sprite]; if (!meta) continue;
        const pts = (meta.kind === 'corner_convex' || meta.kind === 'corner_concave') ? [{ x: p.ax, y: p.ay }] : window.DungeonSnap.worldSockets(meta, p.ax, p.ay, p.flip);
        for (const s of pts) {
          const dx = W.wrapDelta(s.x - wx), dy = s.y - wy, d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = { x: wx + dx - (wx - s.x) + 0, y: s.y }; best.x = s.x; }
        }
      }
    }
    if (best) return { x: best.x + 54, y: best.y };   // vertice = ponta esquerda de um losango
    // 3) qualquer piso mais longe, senao origem do mundo
    bd = 1e18;
    for (const k in this.blocks) {
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined || !this.BLOCK_TYPES[b.type] || !this.BLOCK_TYPES[b.type].isFloor) continue;
      const dx = W.wrapDelta(b.wx - wx), dy = b.wy - wy, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = { x: b.wx, y: b.wy }; }
    }
    return best || { x: 0, y: 0 };
  }
  // Sem muro por perto, a peca encaixa nos vertices dos pisos ja pintados (a ponta A/B, ou a quina, cai no vertice).
  _floorVertexSnap(cfg, wx, wy, prefFlip, frames) {
    if (!frames || !window.DungeonSnap || cfg.isFloor) return null;
    const W = this.game.world, verts = [];
    for (const k in this.blocks) {
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined || !this.BLOCK_TYPES[b.type] || !this.BLOCK_TYPES[b.type].isFloor) continue;
      if ((b.z || 0) !== this.buildLevel) continue;
      if (Math.abs(W.wrapDelta(b.wx - wx)) > 260 || Math.abs(b.wy - wy) > 200) continue;
      const x = b.wx, y = b.wy;
      verts.push([x - 54, y], [x + 54, y], [x, y - 27], [x, y + 27]);
    }
    if (!verts.length) return null;
    const meta = frames[cfg.sprite]; if (!meta) return null;
    const isCorner = cfg.isCorner;
    const mine = isCorner ? [{ x: 0, y: 0 }] : window.DungeonSnap.localSockets(meta);
    let best = null;
    for (const flip of [!!prefFlip, !prefFlip]) {
      const m = flip ? -1 : 1;
      for (const t of mine) for (const v of verts) {
        const X = v[0] - m * t.x, Y = v[1] - t.y;
        const cost = Math.hypot(X - wx, Y - wy) + (flip !== !!prefFlip ? 6 : 0);
        if (cost < 70 && (!best || cost < best.cost)) best = { x: Math.round(X), y: Math.round(Y), flip, cost };
      }
    }
    return best ? { x: best.x, y: best.y, flip: best.flip, snapped: true } : null;
  }
  // Centro do losango sob (wx,wy)
  floorCellAt(wx, wy) {
    const o = this._floorOrigin(wx, wy);
    const dx = this.game.world.wrapDelta(wx - o.x), dy = wy - o.y;
    const i = Math.round((dx / 54 + dy / 27) / 2), j = Math.round((dy / 27 - dx / 54) / 2);
    return { x: o.x + (i - j) * 54, y: o.y + (i + j) * 27 };
  }
  _floorAt(cx, cy, level = 0) {
    for (const k in this.blocks) {
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined || (b.z || 0) !== level) continue;
      const cfg = this.BLOCK_TYPES[b.type]; if (!cfg || !cfg.isFloor) continue;
      if (Math.abs(this.game.world.wrapDelta(b.wx - cx)) < 3 && Math.abs(b.wy - cy) < 3) return { key: k, block: b };
    }
    return null;
  }
  _placeFloor(type, wx, wy) {
    const L = this.buildLevel;
    const c = this.floorCellAt(wx, wy);
    const old = this._floorAt(c.x, c.y, L);
    if (old && old.block.type === type) return;
    const cost = this.buildCost(type);
    if (!this._chargeCost(cost)) { this._noMaterial(type, c.x, c.y, cost); return; }
    if (old) { this._refund(old.block.type, c.x, c.y); delete this.blocks[old.key]; }
    const G = this.GRID_SIZE;
    const wxn = this.game.world.wrapX(c.x);
    const gx = this.normGX(Math.floor(wxn / G)), gy = Math.floor(c.y / G);
    const base = L ? `0:${gx},${gy},z${L}` : `0:${gx},${gy}`;
    let key = base, n = 0;
    while (this.blocks[key]) key = `${base}#${++n}`;
    const blk = { type, gx, gy, wx: Math.round(wxn), wy: Math.round(c.y), rot: 0, layer: 0, height: 1, isOpen: false, placedAt: Date.now() };
    if (L) blk.z = L;
    this.blocks[key] = blk;
    if (window.sounds) window.sounds.playWoodChop?.();
    this.saveWorldData();
  }
  _demolishFloorAt(wx, wy) {
    let best = null, bd = 9;
    for (const k in this.blocks) {
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined) continue;
      const cfg = this.BLOCK_TYPES[b.type]; if (!cfg || !cfg.isFloor) continue;
      const lift = (b.z || 0) * this.STACK_STEP;
      const d = Math.abs(this.game.world.wrapDelta(wx - b.wx)) / 54 + Math.abs(wy - (b.wy - lift)) / 27;
      if (d <= 1 && (best === null || (b.z || 0) > (best.block.z || 0) || ((b.z || 0) === (best.block.z || 0) && d < bd))) { bd = d; best = { key: k, block: b }; }
    }
    if (!best) return;
    this._refund(best.block.type, best.block.wx, best.block.wy - (best.block.z || 0) * this.STACK_STEP);
    delete this.blocks[best.key];
    this.game.spawnDamageText(best.block.wx, best.block.wy - (best.block.z || 0) * this.STACK_STEP - 20, '🗑️ Demolido!', '#ff6b6b', 14);
    this.saveWorldData();
  }

  // ---- Moveis (js/furniture.js) ----
  // Cada movel ocupa 1 celula da malha de pisos (cama: 2). Bloco 'f:gx,gy,zN': { type, wx, wy (centro da celula ancora), z, rot }.
  _furnCells(b) {
    const cfg = this.BLOCK_TYPES[b.type], out = [[b.wx, b.wy]];
    if (cfg && cfg.cells === 2) { const ax = (b.rot % 180 === 0); out.push(ax ? [b.wx + 54, b.wy + 27] : [b.wx - 54, b.wy + 27]); }
    return out;
  }
  _furnList() {
    if (this._fl) return this._fl;
    const out = [];
    for (const k in this.blocks) {
      if (k.charAt(0) !== 'f') continue;
      const b = this.blocks[k], cfg = this.BLOCK_TYPES[b.type]; if (!cfg || !cfg.isFurniture) continue;
      out.push({ key: k, b, cfg, cells: this._furnCells(b) });
    }
    return (this._fl = out);
  }
  _furnSolid(x, y, level) {
    const list = this._furnList(); if (!list.length) return false;
    const W = this.game.world;
    for (const f of list) {
      if (!f.cfg.solid || (f.b.z || 0) !== level) continue;
      for (const c of f.cells) {
        const dx = Math.abs(W.wrapDelta(x - c[0])), dy = Math.abs(y - c[1]);
        if (f.cfg.small ? (dx * dx + dy * dy * 4 < 18 * 18) : (dx / 54 + dy / 27 <= 0.8)) return true;
      }
    }
    return false;
  }
  _placeFurniture(type, wx, wy) {
    const cfg = this.BLOCK_TYPES[type], L = this.buildLevel, c = this.floorCellAt(wx, wy), W = this.game.world;
    let rot = this.rotation % 360; if (cfg.rots === 1) rot = 0; else if (cfg.rots === 2) rot = (rot % 180 === 0) ? 0 : 90;
    const b = { type, wx: c.x, wy: c.y, rot, z: L };
    const cells = this._furnCells(b);
    for (const cc of cells) {
      if (L > 0 && !this._floorAt(cc[0], cc[1], L)) { if (this.game.addLog) this.game.addLog('⚠️ [CONSTRUTOR] Mobilia so em cima de piso neste andar.', 'warning'); return; }
    }
    const same = (p, q) => Math.abs(W.wrapDelta(p[0] - q[0])) < 3 && Math.abs(p[1] - q[1]) < 3;
    for (const f of this._furnList()) {
      if ((f.b.z || 0) !== L) continue;
      const hit = f.cells.some(fc => cells.some(cc => same(fc, cc)));
      if (!hit) continue;
      if (f.b.type === type && same(f.cells[0], cells[0])) { if (f.b.rot !== rot) { f.b.rot = rot; this.saveWorldData(); } return; }   // mesmo movel: so gira
      this.game.spawnDamageText(c.x, c.y - L * this.STACK_STEP - 30, 'Ocupado', '#ff6b6b', 14); return;
    }
    const cost = this.buildCost(type);
    if (!this._chargeCost(cost)) { this._noMaterial(type, c.x, c.y - L * this.STACK_STEP, cost); return; }
    const G = this.GRID_SIZE, wxn = W.wrapX(c.x), gx = this.normGX(Math.floor(wxn / G)), gy = Math.floor(c.y / G);
    let key = `f:${gx},${gy}${L ? ',z' + L : ''}`, n = 0; while (this.blocks[key]) key = `f:${gx},${gy}${L ? ',z' + L : ''}#${++n}`;
    this.blocks[key] = { type, gx, gy, layer: 9, wx: Math.round(wxn), wy: Math.round(c.y), rot, z: L, placedAt: Date.now() };
    if (window.sounds) window.sounds.playWoodChop?.();
    this.saveWorldData();
  }
  _demolishFurnitureAt(wx, wy) {
    let best = null, bd = 1e9; const W = this.game.world;
    for (const f of this._furnList()) {
      const lift = (f.b.z || 0) * this.STACK_STEP;
      for (const c of f.cells) {
        const dx = Math.abs(W.wrapDelta(wx - c[0])) / 54, dy = Math.abs(wy - (c[1] - lift)) / 27;
        const d = dx + dy; if (d <= 1 && (d < bd || (best && (f.b.z || 0) > (best.f.b.z || 0)))) { bd = d; best = { f }; }
      }
    }
    if (!best) return false;
    const f = best.f; this._refund(f.b.type, f.b.wx, f.b.wy - (f.b.z || 0) * this.STACK_STEP);
    this.game.spawnDamageText(f.b.wx, f.b.wy - (f.b.z || 0) * this.STACK_STEP - 30, '🗑️ Demolido!', '#ff6b6b', 14);
    delete this.blocks[f.key]; this.saveWorldData(); return true;
  }
  // Fontes de luz (coordenadas de mundo; y ja desconta o andar e a altura da chama)
  getLights() {
    const out = [];
    for (const f of this._furnList()) {
      const li = f.cfg.light; if (!li) continue;
      out.push({ x: f.b.wx, y: f.b.wy - (f.b.z || 0) * this.STACK_STEP - li.h, r: li.r, kind: f.cfg.furn });
    }
    return out;
  }
  // ---- Conforto: abrigo (telhado), comodo fechado e calor das fontes ----
  _comfort() {
    const P = this.game.player; if (!P || this.game.isGodMode) return null;
    const S = this.STACK_STEP, W = this.game.world, level = Math.round((P.z || 0) / S);
    const c = this.floorCellAt(P.x, P.y + (P.z || 0));
    const ck = c.x + ',' + c.y + ',' + level + ',' + (this._ecVer || 0) + ',' + Object.keys(this.blocks).length;
    if (this._cmf && this._cmf.k === ck) return this._cmf.v;
    // abrigo: algum telhado acima cobre a posicao do player
    let sheltered = false;
    for (const k in this.blocks) {
      if (k.charAt(0) !== 'r') continue;
      const r = this.blocks[k]; if (r.z <= level) continue;
      if (this._roofHas({ wx: r.wx - 20, wy: r.wy - 10, W: r.W + 1, D: r.D + 1 }, P.x, P.y)) { sheltered = true; break; }
    }
    // comodo fechado: espalha pelas celulas com piso, parando nas paredes; se vaza (celula sem piso / porta aberta) nao esta fechado
    // memoriza chao/parede por celula enquanto o conjunto de blocos nao muda: andar de celula em celula reaproveita quase tudo (antes: ~10-60 ms por troca de celula)
    const mv = (this._ecVer || 0) + '|' + Object.keys(this.blocks).length + '|' + level;
    if (!this._cm || this._cm.v !== mv) this._cm = { v: mv, f: new Map(), s: new Map() };
    const fm = this._cm.f, sm = this._cm.s;
    const hasFloor = (x, y) => { const k = Math.round(x) + ',' + Math.round(y); let r = fm.get(k); if (r === undefined) { r = !!this._floorAt(x, y, level); fm.set(k, r); } return r; };
    const solidMid = (x, y) => { const k = Math.round(x) + ',' + Math.round(y); let r = sm.get(k); if (r === undefined) { r = !!this.isSolidAt(x, y, 4, level * S, true); sm.set(k, r); } return r; };
    let enclosed = false; const room = {};
    if (hasFloor(c.x, c.y)) {
      enclosed = true; const seen = { '0,0': true }, q = [[0, 0]]; let n = 0;
      while (q.length && enclosed) {
        const [i, j] = q.pop(); room[i + ',' + j] = true; if (++n > 260) { enclosed = false; break; }
        const cx = c.x + 54 * (i - j), cy = c.y + 27 * (i + j);
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + 54 * (di - dj), ny = cy + 27 * (di + dj), kk = (i + di) + ',' + (j + dj);
          if (solidMid((cx + nx) / 2, (cy + ny) / 2)) continue;     // parede entre as celulas
          if (!hasFloor(nx, ny)) { enclosed = false; break; }
          if (!seen[kk]) { seen[kk] = true; q.push([i + di, j + dj]); }
        }
      }
    }
    let heatSrc = 0;
    for (const f of this._furnList()) {
      if (!f.cfg.heat || (f.b.z || 0) !== level) continue;
      const dx = W.wrapDelta(f.b.wx - c.x), dy = f.b.wy - c.y, i = Math.round((dx / 54 + dy / 27) / 2), j = Math.round((dy / 27 - dx / 54) / 2);
      if (enclosed && room[i + ',' + j]) heatSrc += f.cfg.heat; else if (Math.hypot(i, j) <= 3) heatSrc += f.cfg.heat * 0.4;
    }
    let temp = 12;
    if (sheltered) temp += 3;
    if (sheltered && enclosed) temp += 5;
    temp += Math.min(2.2, heatSrc) * 7;
    const v = { sheltered, enclosed: enclosed && sheltered, heat: heatSrc > 0, temp: Math.round(temp) };
    this._cmf = { k: ck, v }; return v;
  }
  _updateComfortBadge() {
    const now = performance.now(); if (this._cbT && now - this._cbT < 300) return; this._cbT = now;
    const v = this._comfort(); let el = this._cbEl;
    if (!v || (!v.sheltered && !v.heat)) { if (el) el.style.display = 'none'; if (this.game.player) this.game.player.localTemp = undefined; return; }
    if (!el) {
      el = this._cbEl = document.createElement('div'); el.id = 'comfort-badge';
      el.style.cssText = 'position:fixed;top:54px;left:50%;transform:translateX(-50%);z-index:30;padding:4px 12px;border-radius:14px;background:rgba(20,14,8,0.72);color:#ffe9b8;font:600 13px sans-serif;border:1px solid rgba(255,200,120,0.35);pointer-events:none;';
      document.body.appendChild(el);
    }
    this.game.player.localTemp = v.temp;
    el.style.display = 'block';
    el.textContent = (v.heat && v.enclosed ? '🔥 Aquecido' : v.heat ? '🔥 Perto do fogo' : v.enclosed ? '🏠 Abrigado' : '☂️ Sob telhado') + '  •  🌡️ ' + v.temp + '°C';
  }

  // ---- Telhados (duas aguas, desenhados por codigo: js/roofs.js) ----
  // Area = piso conectado (do andar atual) sob o clique; telhado = retangulo que envolve essa area, assentado no topo das paredes do andar.
  _roofImg(style, W, D, ridge) {
    this._roofCache = this._roofCache || {};
    const k = style + '|' + W + 'x' + D + ridge;
    return this._roofCache[k] || (this._roofCache[k] = window.RoofRenderer.render(style, W, D, ridge));
  }
  _roofPlan(wx, wy) {
    const L = this.buildLevel, c = this.floorCellAt(wx, wy), Wd = this.game.world;
    // Pisos de cada andar ate o atual; o telhado do andar L usa o piso do proprio andar ou, se nao houver, o do andar mais alto abaixo dele
    const sets = {};
    for (const k in this.blocks) {
      if (k.charAt(0) !== '0') continue;
      const b = this.blocks[k]; if (b.wx === undefined || (b.z || 0) > L) continue;
      const cf = this.BLOCK_TYPES[b.type]; if (!cf || !cf.isFloor) continue;
      const dx = Wd.wrapDelta(b.wx - c.x), dy = b.wy - c.y;
      const i = Math.round((dx / 54 + dy / 27) / 2), j = Math.round((dy / 27 - dx / 54) / 2);
      if (Math.abs(i) > 60 || Math.abs(j) > 60) continue;
      (sets[b.z || 0] = sets[b.z || 0] || {})[i + ',' + j] = true;
    }
    let set = null;
    for (let lv = L; lv >= 0; lv--) if (sets[lv] && sets[lv]['0,0']) { set = sets[lv]; break; }
    if (!set) return null;
    const seen = { '0,0': true }, q = [[0, 0]]; let i0 = 0, i1 = 0, j0 = 0, j1 = 0, n = 0;
    while (q.length) {
      const [i, j] = q.pop(); n++;
      i0 = Math.min(i0, i); i1 = Math.max(i1, i); j0 = Math.min(j0, j); j1 = Math.max(j1, j);
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const kk = (i + di) + ',' + (j + dj); if (set[kk] && !seen[kk]) { seen[kk] = true; q.push([i + di, j + dj]); } }
    }
    const W = i1 - i0 + 1, D = j1 - j0 + 1;
    return { tx: c.x + 54 * (i0 - j0), ty: c.y + 27 * (i0 + j0) - 27, W, D, ridge: W >= D ? 'a' : 'b', z: L + 1, n: W * D };
  }
  _roofHas(r, x, y) {
    const dx = this.game.world.wrapDelta(x - r.wx), dy = y - r.wy;
    const a = (dx / 54 + dy / 27) / 2, b = (dy / 27 - dx / 54) / 2;
    return a >= 0 && a <= r.W && b >= 0 && b <= r.D;
  }
  _placeRoof(type, wx, wy) {
    const cfg = this.BLOCK_TYPES[type], pl = this._roofPlan(wx, wy);
    if (!pl) { if (this.game.addLog) this.game.addLog('⚠️ [CONSTRUTOR] Clique sobre um piso do andar atual: o telhado cobre toda a area de piso ligada a ele.', 'warning'); return; }
    const cost = this.buildCost(type), tot = cost ? Object.fromEntries(Object.entries(cost).map(([k, v]) => [k, v * pl.n])) : null;
    // troca telhados do mesmo andar que ocupam a mesma area
    const cx = pl.tx + 54 * (pl.W - pl.D) / 2, cy = pl.ty + 27 * (pl.W + pl.D) / 2;
    for (const k of Object.keys(this.blocks)) {
      if (k.charAt(0) !== 'r') continue;
      const r = this.blocks[k]; if (r.z !== pl.z) continue;
      const rx = r.wx + 54 * (r.W - r.D) / 2, ry = r.wy + 27 * (r.W + r.D) / 2;
      if (this._roofHas(r, cx, cy) || this._roofHas(pl.tx === undefined ? r : { wx: pl.tx, wy: pl.ty, W: pl.W, D: pl.D }, rx, ry)) { this._refund(r.type, r.wx, r.wy - r.z * this.STACK_STEP, r.W * r.D); delete this.blocks[k]; }
    }
    if (!this._chargeCost(tot)) { this._noMaterial(type, pl.tx, pl.ty - pl.z * this.STACK_STEP, tot); return; }
    const G = this.GRID_SIZE, wxn = this.game.world.wrapX(pl.tx);
    const gx = this.normGX(Math.floor(wxn / G)), gy = Math.floor(pl.ty / G);
    let key = `r:${gx},${gy},z${pl.z}`, n = 0; while (this.blocks[key]) key = `r:${gx},${gy},z${pl.z}#${++n}`;
    this.blocks[key] = { type, gx, gy, layer: 9, wx: Math.round(wxn), wy: Math.round(pl.ty), W: pl.W, D: pl.D, ridge: pl.ridge, z: pl.z, rot: 0, height: 1, placedAt: Date.now() };
    if (window.sounds) window.sounds.playWoodChop?.();
    if (this.game.addLog) this.game.addLog(`🏠 [CONSTRUTOR] ${cfg.name} montado (${pl.W}x${pl.D} blocos, cumeeira ${pl.ridge === 'a' ? 'no sentido ↘' : 'no sentido ↙'}).`, 'action');
    this.saveWorldData();
  }
  _roofHull(r) {
    const g = window.RoofRenderer.geometry(r.W, r.D, r.ridge), ov = window.RoofRenderer.OVERHANG;
    const pts = [g.P(-ov, -ov, 0), g.P(g.L + ov, -ov, 0), g.P(-ov, g.M + ov, 0), g.P(g.L + ov, g.M + ov, 0), g.P(-ov, g.M / 2, g.rise), g.P(g.L + ov, g.M / 2, g.rise)];
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    lo.pop(); up.pop(); return lo.concat(up);
  }
  // O telhado esta na frente do player e o cobre na tela? (pes, peito, cabeca e lados)
  _roofCovers(r, P) {
    if (!window.RoofRenderer) return false;
    const key = r.wy + 27 * (r.W + r.D) + 60 + r.z * 0.1;
    if (key <= (this.playerSortY() || P.y)) return false;
    const hull = this._roofHull(r), px = this.game.world.wrapDelta(P.x - r.wx), py0 = P.y - this.game.getLift() - r.wy + r.z * this.STACK_STEP;
    for (const [ox, oy] of [[0, 4], [0, -30], [0, -62], [-14, -30], [14, -30]]) {
      const x = px + ox, y = py0 + oy; let inside = false;
      for (let i = 0, j = hull.length - 1; i < hull.length; j = i++) {
        if ((hull[i][1] > y) !== (hull[j][1] > y) && x < (hull[j][0] - hull[i][0]) * (y - hull[i][1]) / (hull[j][1] - hull[i][1]) + hull[i][0]) inside = !inside;
      }
      if (inside) return true;
    }
    return false;
  }
  _roofAt(wx, wy) {
    if (!window.RoofRenderer) return null;
    let best = null;
    for (const k in this.blocks) {
      if (k.charAt(0) !== 'r') continue;
      const r = this.blocks[k], px = this.game.world.wrapDelta(wx - r.wx), py = wy - r.wy + r.z * this.STACK_STEP;
      const hull = this._roofHull(r); let inside = false;
      for (let i = 0, j = hull.length - 1; i < hull.length; j = i++) {
        if ((hull[i][1] > py) !== (hull[j][1] > py) && px < (hull[j][0] - hull[i][0]) * (py - hull[i][1]) / (hull[j][1] - hull[i][1]) + hull[i][0]) inside = !inside;
      }
      if (inside && (!best || r.z > best.r.z)) best = { key: k, r };
    }
    return best;
  }
  _demolishRoofAt(wx, wy) {
    const h = this._roofAt(wx, wy); if (!h) return false;
    this._refund(h.r.type, h.r.wx, h.r.wy - h.r.z * this.STACK_STEP, h.r.W * h.r.D);
    this.game.spawnDamageText(h.r.wx, h.r.wy - h.r.z * this.STACK_STEP - 30, '🗑️ Telhado demolido!', '#ff6b6b', 14);
    delete this.blocks[h.key]; this.saveWorldData(); return true;
  }

  // ---- Escadas (1 andar, 4 degraus, 2 tiles) ----
  // Ancora = centro do tile ALTO; sobe para -a ("\\" para tras) ou, espelhada, para -b. Ver tools/make_stairs.py.
  _placeStair(type, wx, wy) {
    const L = this.buildLevel, flip = (this.rotation === 90 || this.rotation === 270);
    const c = this.floorCellAt(wx, wy);
    for (const p of this.getDungeonPieces()) {
      const cf = this.BLOCK_TYPES[p.block.type]; if (!cf || cf.kind !== 'stair' || (p.z || 0) !== L) continue;
      if (Math.abs(this.game.world.wrapDelta(p.ax - c.x)) < 60 && Math.abs(p.ay - c.y) < 40) return;   // ja ha escada aqui
    }
    const cost = this.buildCost(type);
    if (!this._chargeCost(cost)) { this._noMaterial(type, c.x, c.y - L * this.STACK_STEP, cost); return; }
    this.addDungeonPiece(type, c.x, c.y, flip, { z: L });
    if (window.sounds) window.sounds.playWoodChop?.();
    this.saveWorldData();
  }
  // Se o player esta sobre uma escada, devolve a chave de ordenacao que o poe depois dela (senao null).
  playerSortY() {
    const p = this.game.player; if (!p || this.game.isGodMode) return null;
    const S = this.STACK_STEP, W = this.game.world, z = p.z || 0;
    let best = null;      // escadas largas (varias faixas lado a lado): o player tem que vir depois de TODAS as faixas vizinhas, nao so da primeira que o teste achar
    for (const st of this._elevData().stairs) {
      const dx = W.wrapDelta(p.x - st.x), dy = p.y - st.y;
      const a = (dx / 54 + dy / 27) / 2, b = (dy / 27 - dx / 54) / 2, u = st.flip ? b : a, v = st.flip ? a : b;
      if (u < -0.6 || u > 1.6 || Math.abs(v) > 1.25) continue;
      const zs = (st.z + Math.max(0, Math.min(1, (1.5 - u) / 2))) * S;
      const late = (this._stairLate || []).find(q => Math.abs(q.x - st.x) < 2 && Math.abs(q.y - st.y) < 2 && q.z === st.z);
      let k = null;
      if (late && (Math.abs(v) <= 1.25) && z < (st.z + 1) * S - 6 && z >= st.z * S - 6) k = Math.max(p.y, late.key + 0.5);
      else if (Math.abs(v) <= 0.65 && Math.abs(z - zs) <= 40) k = Math.max(p.y, st.y - 29 + st.z * 0.1 + 0.05);
      if (k !== null && (best === null || k > best)) best = k;
    }
    return best;
  }
  _invalidateElev() { this._ec = null; }
  _elevData() {
    if (this._ec) return this._ec;
    const floors = {}, stairs = [];
    for (const k in this.blocks) {
      const b = this.blocks[k], cfg = this.BLOCK_TYPES[b.type]; if (!cfg) continue;
      if (cfg.isFloor && (b.z || 0) > 0 && b.wx !== undefined) (floors[b.z] = floors[b.z] || []).push([b.wx, b.wy]);
      else if (cfg.kind === 'stair') { const a = this.dungeonAnchor(b); stairs.push({ x: a.x, y: a.y, z: b.z || 0, flip: b.rot === 90 || b.rot === 270 }); }
    }
    return (this._ec = { floors, stairs });
  }
  // Altura (px) em que o player pode ficar em (x,y), vindo da altura z; null = bloqueado (borda de piso, corpo da escada).
  elevationAt(x, y, z) {
    const S = this.STACK_STEP, ec = this._elevData(), W = this.game.world;
    let body = false;
    for (const st of ec.stairs) {
      const dx = W.wrapDelta(x - st.x), dy = y - st.y;
      const a = (dx / 54 + dy / 27) / 2, b = (dy / 27 - dx / 54) / 2;
      const u = st.flip ? b : a, v = st.flip ? a : b;
      if (u < -0.5 || u > 1.5 || Math.abs(v) > 0.5) continue;
      const zs = (st.z + (1.5 - u) / 2) * S;
      if (Math.abs(z - zs) <= 34) return zs;
      if (st.z === 0) body = true;      // corpo da escada do terreo e solido
    }
    if (body) return null;
    for (const lv in ec.floors) {
      const zl = lv * S; if (Math.abs(z - zl) > 34) continue;
      for (const f of ec.floors[lv]) if (Math.abs(W.wrapDelta(x - f[0])) / 54 + Math.abs(y - f[1]) / 27 <= 1) return zl;
    }
    return z <= 34 ? 0 : null;
  }

  // Coloca as pecas do atlas na lista de desenho 2.5D (ordenada pelo DepthSort).
  addStructuresToRenderList(renderList, screenCenterX, screenCenterY) {
    const viewW = this.game.canvas.width / (this.game.camera.zoom || 1.0);
    const viewH = this.game.canvas.height / (this.game.camera.zoom || 1.0);
    const G = this.GRID_SIZE;
    const frames = this.game.structures && this.game.structures.frames;
    if (!frames || this.game.structures.loaded === false) return;

    // Lajes de andares acima (centros): uma parede de cima apoia no piso do mesmo andar, entao e desenhada depois dele
    const upSlabs = [];
    for (const k2 in this.blocks) {
      if (k2.charAt(0) !== '0') continue;
      const s2 = this.blocks[k2]; if (!s2.z || s2.wx === undefined) continue;
      const c2 = this.BLOCK_TYPES[s2.type]; if (c2 && c2.isFloor) upSlabs.push(s2);
    }
    const _pl0 = this.game.player, _pz0 = (_pl0 && !this.game.isGodMode) ? (_pl0.z || 0) : 0;
    const S0 = this.STACK_STEP, lateStairs = [], stairRects = [];
    const lvlPieces = [];   // pecas nao-escada (rect de tela + chave fisica) para cobrir a escada quando estao na frente dela
    // Escada: se o player ainda esta abaixo do topo dela, ela e desenhada por cima das paredes/lajes proximas (para sempre se ver onde esta);
    // se ele ja esta em cima, ordem fisica e as paredes da frente que a cobrem ficam translucidas.
    const stairLate = (z) => _pz0 < (z + 1) * S0 - 6;
    for (const k3 in this.blocks) {
      const b3 = this.blocks[k3], c3 = this.BLOCK_TYPES[b3.type]; if (!c3 || c3.kind !== 'stair') continue;
      if (stairLate(b3.z || 0)) continue;
      const a3 = this.dungeonAnchor(b3), m3 = frames[c3.sprite]; if (!m3) continue;
      const fl3 = b3.rot === 90 || b3.rot === 270, z3 = b3.z || 0;
      const sx3 = this.game.world.wrapDelta(a3.x - this.game.camera.x) + screenCenterX, sy3 = a3.y - this.game.camera.y + screenCenterY - z3 * S0;
      stairRects.push({ x0: fl3 ? sx3 - (m3.frame.w - m3.anchor.x) : sx3 - m3.anchor.x, y0: sy3 - m3.anchor.y, w: m3.frame.w, h: m3.frame.h, key: a3.y - 30 + z3 * 0.1 });
    }
    for (const key in this.blocks) {
      if (!key.startsWith('1:')) continue;
      const b = this.blocks[key];
      const cfg = this.BLOCK_TYPES[b.type];
      if (!cfg || !cfg.isDungeon) continue;
      const anc = this.dungeonAnchor(b);                       // ancora exata no mundo
      const dx = this.game.world.wrapDelta(anc.x - this.game.camera.x);
      const dy = anc.y - this.game.camera.y;
      const z = b.z || 0;
      if (Math.abs(dx) > viewW / 2 + G * 3 + 40 || Math.abs(dy - z * this.STACK_STEP) > viewH / 2 + G * 3) continue;
      const ax = Math.round(dx + screenCenterX), ay = Math.round(dy + screenCenterY - z * this.STACK_STEP);
      const flip = b.rot === 90 || b.rot === 270;

      // Ordem de desenho: quinas convexas (V) ficam um pouco a frente, concavas atras; entulho solto fica sob o jogador
      const origY = anc.y + z * 0.1;
      let sortY = anc.y + z * 0.1;
      if (cfg.kind === 'ruin' && cfg.nativeSlope === 'free') sortY -= 28;
      let lateStair = false;
      if (cfg.kind === 'stair') { sortY = anc.y - 30 + z * 0.1; lateStair = stairLate(z); }   // fisica por padrao; "late" so e reordenada depois das lajes/paredes
      // Pecas do terreo sob uma laje de cima ficam por baixo dela (senao a face interna do muro escuro aparece por cima do piso)
      if (z === 0 && cfg.kind !== 'stair') {
        for (const s2 of upSlabs) {
          if (Math.abs(this.game.world.wrapDelta(s2.wx - anc.x)) > 110 || Math.abs(s2.wy - anc.y) > 60) continue;
          const k = s2.wy + (_pz0 < s2.z * S0 - 6 ? 10 : -28) + s2.z * 0.1 - 0.5; if (k < sortY) sortY = k;
        }
      }

      if (z > 0 && cfg.kind !== 'stair' && _pz0 < z * this.STACK_STEP - 6) {
        // player mais baixo: as lajes deste andar usam a chave wy+10; a parede (que esta sobre a borda delas) vem logo depois
        for (const s2 of upSlabs) {
          if (s2.z !== z) continue;
          if (Math.abs(this.game.world.wrapDelta(s2.wx - anc.x)) > 110 || Math.abs(s2.wy - anc.y) > 60) continue;
          const k = s2.wy + 10 + z * 0.1 + 0.5; if (k > sortY) sortY = k;
        }
      }

      // F3: linha(s) de chao da peca (x relativo a camera, y de mundo) para o DepthSort
      let segs;
      if (window.DungeonSnap) {
        const local = window.DungeonSnap.depthSegments(frames[cfg.sprite], flip);
        if (local.length) {
          const ancRelX = ax - screenCenterX;   // x nao muda com a camada
          segs = local.map(l => [ancRelX + l[0], anc.y + l[1], ancRelX + l[2], anc.y + l[3]]);
        }
      }
      // Pecas de andares acima: ficam translucidas quando cobririam o player (so o 2o andar em diante; o terreo nao precisa)
      let fa = 1;
      // Subindo a escada: paredes do terreo que cobririam o player ficam translucidas (so enquanto ele sobe)
      const climbing = z === 0 && cfg.kind !== 'stair' && _pz0 > 8 && _pz0 < S0 - 6;
      if (z === 0 && !climbing && this._fadeSt && this._fadeSt[key] !== undefined && this._fadeSt[key] < 1) {
        fa = this._fadeSt[key] + (1 - this._fadeSt[key]) * 0.2; if (fa > 0.98) fa = 1; this._fadeSt[key] = fa;
      }
      if ((z > 0 || climbing) && !this.game.isGodMode && this.game.player) {
        const P = this.game.player, meta = frames[cfg.sprite], f = meta && meta.frame, an = meta && meta.anchor;
        if (f && an) {
          const ppx = this.game.world.wrapDelta(P.x - this.game.camera.x) + screenCenterX, ppy = P.y - this.game.getLift() - this.game.camera.y + screenCenterY;
          const x0 = flip ? ax - (f.w - an.x) : ax - an.x, y0 = ay - an.y;
          const hit = ppx + 18 > x0 && ppx - 18 < x0 + f.w && ppy + 6 > y0 && ppy - 66 < y0 + f.h;
          const front = climbing ? (origY > P.y - 24) : sortY > (this.playerSortY() || P.y);   // subindo: vale a posicao fisica (o player esta desenhado depois da escada)
          let hit2 = false;      // tambem some quando cobre a escada (player ja em cima dela)
          for (const r of stairRects) if (sortY > r.key && x0 < r.x0 + r.w && x0 + f.w > r.x0 && y0 < r.y0 + r.h && y0 + f.h > r.y0) { hit2 = true; break; }
          const tgt = ((hit && front) || hit2) ? 0.28 : 1;
          this._fadeSt = this._fadeSt || {};
          const cur = this._fadeSt[key] === undefined ? 1 : this._fadeSt[key];
          fa = cur + (tgt - cur) * 0.2;
          if (Math.abs(fa - tgt) < 0.02) fa = tgt;
          this._fadeSt[key] = fa;
        }
      }
      const ent = {
        type: 'block_wall', layer: 1, y: sortY, segs, _ax: anc.x, _ay: anc.y, _z: z,
        draw: () => {
          const c = this.game.ctx;
          if (fa < 1) { c.save(); c.globalAlpha = fa; this.drawDungeonPiece(c, b, cfg, ax, ay); c.restore(); }
          else this.drawDungeonPiece(c, b, cfg, ax, ay);
        }
      };
      if (lateStair) { ent.segs = undefined; lateStairs.push({ ent, x: anc.x, y: anc.y, z, flip }); }
      {
        const mR = frames[cfg.sprite];
        if (mR) {
          const rr = { x0: flip ? ax - (mR.frame.w - mR.anchor.x) : ax - mR.anchor.x, y0: ay - mR.anchor.y, w: mR.frame.w, h: mR.frame.h };
          if (cfg.kind === 'stair') {
            // Uma parede do MESMO andar que esta na frente da escada cobre a escada, mesmo com a escada "late" por cima das lajes:
            // redesenha essas paredes so sobre os pixels da escada (mascara), sem mexer na ordem das lajes.
            const stKey = anc.y - 30 + z * 0.1, baseDraw = ent.draw;
            ent.draw = () => {
              baseDraw();
              const fr = lvlPieces.filter(p => p.z === z && p.origY > stKey && p.x0 < rr.x0 + rr.w && p.x0 + p.w > rr.x0 && p.y0 < rr.y0 + rr.h && p.y0 + p.h > rr.y0);
              if (!fr.length) return;
              const mk = (n) => { const cv = this[n] || (this[n] = document.createElement('canvas')); if (cv.width < rr.w || cv.height < rr.h) { cv.width = Math.max(cv.width, rr.w); cv.height = Math.max(cv.height, rr.h); } const t = cv.getContext('2d'); t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, cv.width, cv.height); t.translate(-rr.x0, -rr.y0); return [cv, t]; };
              const [cvA, tA] = mk('_ovA'), [cvB, tB] = mk('_ovB');
              this.drawDungeonPiece(tA, b, cfg, ax, ay);
              for (const p of fr) { tB.globalAlpha = p.fa; this.drawDungeonPiece(tB, p.b, p.cfg, p.ax, p.ay); } tB.globalAlpha = 1;
              tB.setTransform(1, 0, 0, 1, 0, 0); tB.globalCompositeOperation = 'destination-in'; tB.drawImage(cvA, 0, 0); tB.globalCompositeOperation = 'source-over';
              this.game.ctx.drawImage(cvB, 0, 0, rr.w, rr.h, rr.x0, rr.y0, rr.w, rr.h);
            };
          } else lvlPieces.push(Object.assign({ b, cfg, ax, ay, z, origY, fa }, rr));
        }
      }
      renderList.push(ent);
    }

    const pl = this.game.player, pz = (pl && !this.game.isGodMode) ? (pl.z || 0) : 0;
    // Pisos dos andares de cima (o do terreo e desenhado em drawRoads): entram na ordenacao pela borda de tras do losango
    for (const key in this.blocks) {
      if (key.charAt(0) !== '0') continue;
      const b = this.blocks[key]; if (!b.z || b.wx === undefined) continue;
      const cfg = this.BLOCK_TYPES[b.type]; if (!cfg || !cfg.isFloor) continue;
      const lift = b.z * this.STACK_STEP;
      const dx = this.game.world.wrapDelta(b.wx - this.game.camera.x), dy = b.wy - this.game.camera.y - lift;
      if (Math.abs(dx) > viewW / 2 + 120 || Math.abs(dy) > viewH / 2 + 80) continue;
      const fx = Math.round(dx + screenCenterX), fy = Math.round(dy + screenCenterY);
      const sp = cfg.sprite, skirt = /polished/.test(sp) ? '#5c5e66' : /stone/.test(sp) ? '#575248' : '#583f2c', rim = /polished/.test(sp) ? '#8a8c94' : /stone/.test(sp) ? '#7d776b' : '#7a5a40';
      // Player em andar >= ao da laje: ele esta SOBRE ela (laje antes). Player abaixo: a laje fica sobre a cabeca dele (depois, pela linha do centro).
      // Player abaixo da laje: ela fica translucida perto dele, para ele nao sumir por baixo do piso de cima
      let fade = 1;
      const below = pz < b.z * this.STACK_STEP - 6;     // player mais baixo que a laje (inclui a subida da escada)
      if (below && pl) {
        const fd = Math.hypot(this.game.world.wrapDelta(b.wx - pl.x), (b.wy - (pl.y + 20)) * 1.4);
        fade = Math.max(0.22, Math.min(1, 0.22 + (fd - 80) / 140 * 0.78));
      }
      const slabY = (!below) ? b.wy - 28 + b.z * 0.1 : b.wy + 10 + b.z * 0.1;
      renderList.push({ type: 'floor_up', layer: 0, y: slabY, _ax: b.wx, _ay: b.wy, _z: b.z, draw: () => {
        const ctx = this.game.ctx, T = 9;
        ctx.save(); ctx.globalAlpha = fade;
        // espessura da laje: faces da frente do losango
        ctx.fillStyle = skirt; ctx.beginPath();
        ctx.moveTo(fx - 54, fy); ctx.lineTo(fx, fy + 27); ctx.lineTo(fx + 54, fy); ctx.lineTo(fx + 54, fy + T); ctx.lineTo(fx, fy + 27 + T); ctx.lineTo(fx - 54, fy + T); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(fx - 54, fy + 1); ctx.lineTo(fx, fy + 28); ctx.lineTo(fx + 54, fy + 1); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.moveTo(fx, fy + 27); ctx.lineTo(fx, fy + 27 + T); ctx.stroke();
        this.game.structures.drawStructure(ctx, sp, fx, fy, false);
        ctx.restore();
      } });
    }
    // Moveis
    if (window.FurnitureRenderer) {
      const FR = window.FurnitureRenderer, fl = this._furnList(), T = performance.now();
      const at = {}; for (const f of fl) { if (f.cfg.furn === 'table' || f.cfg.furn === 'counter') at[f.cfg.furn + ',' + Math.round(f.b.wx) + ',' + Math.round(f.b.wy) + ',' + (f.b.z || 0)] = true; }
      for (const f of fl) {
        const b = f.b, z = b.z || 0, lift = z * this.STACK_STEP;
        const dxf = this.game.world.wrapDelta(b.wx - this.game.camera.x), dyf = b.wy - this.game.camera.y - lift;
        if (Math.abs(dxf) > viewW / 2 + 160 || Math.abs(dyf) > viewH / 2 + 160) continue;
        let mask = 0;
        if (f.cfg.furn === 'table' || f.cfg.furn === 'counter') {
          const has = (x, y) => at[f.cfg.furn + ',' + Math.round(x) + ',' + Math.round(y) + ',' + z];
          if (has(b.wx + 54, b.wy + 27)) mask |= 1; if (has(b.wx - 54, b.wy - 27)) mask |= 2; if (has(b.wx - 54, b.wy + 27)) mask |= 4; if (has(b.wx + 54, b.wy - 27)) mask |= 8;
        } else if (f.cfg.furn === 'bed') mask = (b.rot >= 180 ? 1 : 0) * 0 + (b.pal || 0);
        const S = FR.sprite(f.cfg.furn, b.rot, mask);
        const sx = Math.round(dxf + screenCenterX), sy = Math.round(dyf + screenCenterY);
        const kind = f.cfg.furn, rotn = b.rot;
        const cy2 = f.cells.length > 1 ? (f.cells[0][1] + f.cells[1][1]) / 2 : b.wy;
        // Movel de andar de cima: some junto com a laje quando o player esta abaixo dela
        let ffade = 1;
        if (z > 0 && pl && pz < z * this.STACK_STEP - 6) {
          const fd = Math.hypot(this.game.world.wrapDelta(b.wx - pl.x), (b.wy - (pl.y + 20)) * 1.4);
          ffade = Math.max(0.22, Math.min(1, 0.22 + (fd - 80) / 140 * 0.78));
        }
        // Movel de andar de baixo sob uma laje (player em cima dela): a laje esta mais perto da camera, entao cobre o movel.
        // Em vez de depender da ordem de desenho, recorta do sprite os pixels que caem dentro das lajes de cima.
        let cuts = null;
        const x0f = sx - S.ox, y0f = sy - S.oy, wf = S.canvas.width, hf = S.canvas.height;
        for (const s2 of upSlabs) {
          if (s2.z <= z) continue;
          const fxs = Math.round(this.game.world.wrapDelta(s2.wx - this.game.camera.x) + screenCenterX), fys = Math.round(s2.wy - this.game.camera.y - s2.z * this.STACK_STEP + screenCenterY);
          if (fxs + 54 < x0f || fxs - 54 > x0f + wf || fys + 36 < y0f || fys - 27 > y0f + hf) continue;
          let sf = 1;
          if (pl && pz < s2.z * this.STACK_STEP - 6) { const fd2 = Math.hypot(this.game.world.wrapDelta(s2.wx - pl.x), (s2.wy - (pl.y + 20)) * 1.4); sf = Math.max(0.22, Math.min(1, 0.22 + (fd2 - 80) / 140 * 0.78)); }
          (cuts = cuts || []).push([fxs, fys, sf]);
        }
        // x/lineY: entram na comparacao com a linha de chao das paredes (DepthSort), senao um movel encostado
        // no muro da frente era desenhado por cima dele (lampiao "atravessando" a parede)
        const cx2 = f.cells.length > 1 ? (f.cells[0][0] + f.cells[1][0]) / 2 : b.wx;
        renderList.push({ type: 'furniture', layer: 1, y: cy2 + 16 + z * 0.1, x: Math.round(this.game.world.wrapDelta(cx2 - this.game.camera.x)), lineY: cy2, draw: () => {
          const c = this.game.ctx; c.save(); c.globalAlpha = ffade;
          if (cuts) {
            const tc = this._cutCv || (this._cutCv = document.createElement('canvas'));
            if (tc.width < wf || tc.height < hf) { tc.width = Math.max(tc.width, wf); tc.height = Math.max(tc.height, hf); }
            const tx = tc.getContext('2d'); tx.setTransform(1, 0, 0, 1, 0, 0); tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, tc.width, tc.height);
            tx.drawImage(S.canvas, 0, 0); tx.globalCompositeOperation = 'destination-out'; for (const q of cuts) { tx.fillStyle = 'rgba(0,0,0,' + q[2] + ')'; const qx = q[0] - x0f, qy = q[1] - y0f; tx.beginPath(); tx.moveTo(qx - 54, qy); tx.lineTo(qx, qy - 27); tx.lineTo(qx + 54, qy); tx.lineTo(qx + 54, qy + 9); tx.lineTo(qx, qy + 36); tx.lineTo(qx - 54, qy + 9); tx.closePath(); tx.fill(); }
            tx.globalCompositeOperation = 'source-over';
            c.drawImage(tc, 0, 0, wf, hf, x0f, y0f, wf, hf);
          } else c.drawImage(S.canvas, x0f, y0f);
          if (kind === 'fireplace') FR.flame(c, sx + (rotn === 90 ? 25 : -25), sy + 7, T, 1.15);
          else if (kind === 'candelabra') for (const [a, bb] of [[-0.2, 0], [0.2, 0], [0, -0.2], [0, 0.2]]) { const p = FR.pt(a, bb, 49); FR.flame(c, sx + p[0], sy + p[1], T + a * 900, 0.5); }
          else if (kind === 'brazier') { FR.flame(c, sx, sy - 54, T, 1.9); FR.flame(c, sx - 8, sy - 52, T + 400, 1.1); FR.flame(c, sx + 9, sy - 52, T + 900, 1.2); }
          else if (kind === 'lantern') { const g = c.createRadialGradient(sx, sy - 55, 2, sx, sy - 55, 26); g.addColorStop(0, 'rgba(255,220,120,0.55)'); g.addColorStop(1, 'rgba(255,200,80,0)'); c.fillStyle = g; c.beginPath(); c.arc(sx, sy - 55, 26, 0, 7); c.fill(); }
          c.restore();
        } });
      }
    }
    // Telhados: ficam por cima de tudo da casa; translucidos quando o player esta sob eles
    if (window.RoofRenderer) {
      this._roofFade = this._roofFade || {};
      for (const rk in this.blocks) {
        if (rk.charAt(0) !== 'r') continue;
        const r = this.blocks[rk], rc = this.BLOCK_TYPES[r.type]; if (!rc || !rc.isRoof) continue;
        const dxr = this.game.world.wrapDelta(r.wx - this.game.camera.x), dyr = r.wy - this.game.camera.y - r.z * this.STACK_STEP;
        if (Math.abs(dxr) > viewW / 2 + 54 * (r.W + r.D) + 60 || Math.abs(dyr) > viewH / 2 + 27 * (r.W + r.D) + 160) continue;
        const R = this._roofImg(rc.roofStyle, r.W, r.D, r.ridge);
        const sx = Math.round(dxr + screenCenterX), sy = Math.round(dyr + screenCenterY);
        let tgt = 1;
        if (this.game.isGodMode) tgt = 0.4;
        else if (pl && this._roofCovers(r, pl)) tgt = 0.2;       // player atras/sob o telhado, em qualquer andar
        const cur = this._roofFade[rk] === undefined ? tgt : this._roofFade[rk];
        let fa2 = cur + (tgt - cur) * 0.18; if (Math.abs(fa2 - tgt) < 0.02) fa2 = tgt;
        this._roofFade[rk] = fa2;
        renderList.push({ type: 'roof', layer: 1, y: r.wy + 27 * (r.W + r.D) + 60 + r.z * 0.1, draw: () => {
          const c = this.game.ctx; c.save(); c.globalAlpha = fa2; c.imageSmoothingEnabled = false; c.drawImage(R.canvas, sx - R.ox, sy - R.oy); c.restore();
        } });
      }
    }
    this._updateComfortBadge();
    // escadas "late": depois de tudo que esta por perto (lajes, paredes), para aparecerem inteiras
    this._stairLate = [];
    for (const L of lateStairs) {
      let kmax = L.ent.y;
      for (const e of renderList) {
        if (e === L.ent || e._ax === undefined || !(e._z > L.z)) continue;     // so lajes/paredes de andares acima; muros do mesmo andar a frente continuam cobrindo a escada
        if (Math.abs(this.game.world.wrapDelta(e._ax - L.x)) > 170 || Math.abs(e._ay - L.y) > 140) continue;
        if (e.y + 0.5 > kmax) kmax = e.y + 0.5;
      }
      L.ent.y = kmax; this._stairLate.push({ x: L.x, y: L.y, z: L.z, flip: L.flip, key: kmax });
    }
  }

  // Desenha uma peca do atlas (com os estados de porta/grade) na ancora de tela (ax,ay).
  drawDungeonPiece(ctx, b, cfg, ax, ay) {
    if (!this.game.structures) return;
    const flip = b.rot === 90 || b.rot === 270;
    const mode = this.dungeonDoorMode(cfg);
    const t = mode ? this.dungeonOpenT(b) : 0;
    const frames = this.game.structures.frames;
    if (mode === 'swap' && t > 0.02 && !(frames[cfg.sprite] && frames[(DUNGEON_DOOR_STATES[cfg.sprite] || {}).ajar] && frames[(DUNGEON_DOOR_STATES[cfg.sprite] || {}).open])) {
      // atlas ainda nao terminou de carregar (ou falta o quadro da porta): desenha fechada em vez de derrubar o jogo
      if (frames[cfg.sprite]) this.game.structures.drawStructure(ctx, cfg.sprite, ax, ay, flip);
      return;
    }
    if (mode === 'swap' && t > 0.02) {
      // porta: fechada -> entreaberta -> aberta
      const st = DUNGEON_DOOR_STATES[cfg.sprite];
      const alt = t < 0.67 ? st.ajar : st.open;
      const al = window.DungeonSnap.altAnchor(frames[cfg.sprite], frames[alt], ax, ay, flip);
      this.game.structures.drawStructure(ctx, alt, al.ax, al.ay, al.flip);
    } else if (mode === 'lift' && t > 0.02 && frames[cfg.sprite]) {
      // grade/portao: sobe e some pelo topo (clip na area original da peca)
      const meta = frames[cfg.sprite], f = meta.frame, an = meta.anchor;
      const x0 = flip ? ax - (f.w - an.x) : ax - an.x;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, ay - an.y, f.w, f.h);
      ctx.clip();
      ctx.translate(0, -Math.round(f.h * t));
      this.game.structures.drawStructure(ctx, cfg.sprite, ax, ay, flip);
      ctx.restore();
    } else {
      this.game.structures.drawStructure(ctx, cfg.sprite, ax, ay, flip);
    }
    if (this.game.structures.showDebug) {
      this.game.structures.drawDebugOverlay(ctx, { sprite: cfg.sprite, flipX: flip, axis: flip ? 'y' : 'x' }, ax, ay, b.wy !== undefined ? b.wy : ay);
    }
  }

  // Fantasma da peca que sera colocada (ou o contorno do tile ao demolir) + custo
  drawPreview(ctx, screenCenterX, screenCenterY) {
    if (!this.isActive || this.selectedTool === 'fly') return;
    const G = this.GRID_SIZE;
    const wx = this.game.mouse.worldX, wy = this.game.mouse.worldY;
    const gx = this.normGX(Math.floor(this.game.world.wrapX(wx) / G)), gy = Math.floor(wy / G);
    const sx = Math.round(this.game.world.wrapDelta(gx * G - this.game.camera.x) + screenCenterX);
    const sy = Math.round(gy * G - this.game.camera.y + screenCenterY);
    const cfg = this.BLOCK_TYPES[this.selectedTool];

    ctx.save();
    if (this.selectedTool === 'delete') {
      ctx.strokeStyle = '#ff6b6b'; ctx.lineWidth = 2; ctx.strokeRect(sx, sy, G, G);
      ctx.restore();
      return;
    }
    if (!cfg || !cfg.isDungeon || !this.game.structures) { ctx.restore(); return; }

    if (cfg.isFurniture && window.FurnitureRenderer) {
      const L = this.buildLevel, lift = L * this.STACK_STEP, c = this.floorCellAt(wx, wy + lift);
      let rot = this.rotation % 360; if (cfg.rots === 1) rot = 0; else if (cfg.rots === 2) rot = (rot % 180 === 0) ? 0 : 90;
      const px = Math.round(this.game.world.wrapDelta(c.x - this.game.camera.x) + screenCenterX), py = Math.round(c.y - this.game.camera.y + screenCenterY - lift);
      const S = window.FurnitureRenderer.sprite(cfg.furn, rot, 0);
      ctx.globalAlpha = 0.7; ctx.drawImage(S.canvas, px - S.ox, py - S.oy); ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(0,255,255,0.8)'; ctx.lineWidth = 2;
      const dia = (x, y) => { ctx.beginPath(); ctx.moveTo(x, y - 27); ctx.lineTo(x + 54, y); ctx.lineTo(x, y + 27); ctx.lineTo(x - 54, y); ctx.closePath(); ctx.stroke(); };
      dia(px, py); if (cfg.cells === 2) { if (rot % 180 === 0) dia(px + 54, py + 27); else dia(px - 54, py + 27); }
      const cst = this.buildCost(this.selectedTool);
      if (cst) { const ok = Object.keys(this._missing(cst)).length === 0; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.fillStyle = ok ? '#ffe066' : '#ff6b6b'; const t = (ok ? '' : 'Sem material  ') + this._costText(cst); ctx.strokeText(t, px, py + 44); ctx.fillText(t, px, py + 44); }
      ctx.restore(); return;
    }
    if (cfg.isRoof && window.RoofRenderer) {
      const L = this.buildLevel, lift = L * this.STACK_STEP, pl = this._roofPlan(wx, wy + lift);
      if (pl) {
        const R = this._roofImg(cfg.roofStyle, pl.W, pl.D, pl.ridge);
        const px = Math.round(this.game.world.wrapDelta(pl.tx - this.game.camera.x) + screenCenterX), py = Math.round(pl.ty - this.game.camera.y + screenCenterY - pl.z * this.STACK_STEP);
        ctx.globalAlpha = 0.6; ctx.drawImage(R.canvas, px - R.ox, py - R.oy); ctx.globalAlpha = 1;
        const by = py + pl.z * this.STACK_STEP - lift;   // base do telhado = topo das paredes do andar
        ctx.strokeStyle = 'rgba(0,255,255,0.8)'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(px + 54 * pl.W, py + 27 * pl.W); ctx.lineTo(px + 54 * (pl.W - pl.D), py + 27 * (pl.W + pl.D)); ctx.lineTo(px - 54 * pl.D, py + 27 * pl.D); ctx.closePath(); ctx.stroke();
        const cst = this.buildCost(this.selectedTool);
        if (cst) {
          const tot = Object.fromEntries(Object.entries(cst).map(([k, v]) => [k, v * pl.n])), ok = Object.keys(this._missing(tot)).length === 0;
          ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.fillStyle = ok ? '#ffe066' : '#ff6b6b';
          const t = (ok ? '' : 'Sem material  ') + this._costText(tot) + `  (${pl.n} blocos)`; const tx = px + 54 * (pl.W - pl.D) / 2, ty = py + 27 * (pl.W + pl.D) + 24;
          ctx.strokeText(t, tx, ty); ctx.fillText(t, tx, ty);
        }
      }
      ctx.restore(); return;
    }
    if (cfg.isFloor) {
      const L = this.buildLevel, lift = L * this.STACK_STEP;
      const c = this.floorCellAt(wx, wy + lift);
      const px = Math.round(this.game.world.wrapDelta(c.x - this.game.camera.x) + screenCenterX), py = Math.round(c.y - this.game.camera.y + screenCenterY - lift);
      ctx.globalAlpha = 0.6; this.game.structures.drawStructure(ctx, cfg.sprite, px, py, false);
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(0,255,255,0.8)'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(px, py - 27); ctx.lineTo(px + 54, py); ctx.lineTo(px, py + 27); ctx.lineTo(px - 54, py); ctx.closePath(); ctx.stroke();
      const cst = this.buildCost(this.selectedTool);
      if (cst) {
        const ok = Object.keys(this._missing(cst)).length === 0;
        ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.fillStyle = ok ? '#ffe066' : '#ff6b6b';
        const t = (ok ? '' : 'Sem material  ') + this._costText(cst);
        ctx.strokeText(t, px, py + 42); ctx.fillText(t, px, py + 42);
      }
      ctx.restore(); return;
    }
    if (cfg.kind === 'stair') {
      const L = this.buildLevel, lift = L * this.STACK_STEP, flip = (this.rotation === 90 || this.rotation === 270);
      const c = this.floorCellAt(wx, wy + lift);
      const px = Math.round(this.game.world.wrapDelta(c.x - this.game.camera.x) + screenCenterX), py = Math.round(c.y - this.game.camera.y + screenCenterY - lift);
      ctx.globalAlpha = 0.7; this.game.structures.drawStructure(ctx, cfg.sprite, px, py, flip);
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(0,255,255,0.8)'; ctx.lineWidth = 2;
      const dia = (x, y) => { ctx.beginPath(); ctx.moveTo(x, y - 27); ctx.lineTo(x + 54, y); ctx.lineTo(x, y + 27); ctx.lineTo(x - 54, y); ctx.closePath(); ctx.stroke(); };
      dia(px, py); dia(px + (flip ? -54 : 54), py + 27);
      const cst = this.buildCost(this.selectedTool);
      if (cst) {
        const ok = Object.keys(this._missing(cst)).length === 0;
        ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.fillStyle = ok ? '#ffe066' : '#ff6b6b';
        const t = (ok ? '' : 'Sem material  ') + this._costText(cst);
        ctx.strokeText(t, px, py + 66); ctx.fillText(t, px, py + 66);
      }
      ctx.restore(); return;
    }
    const plan = this.planDungeonPlacement(this.selectedTool, wx, wy, this.rotation);
    const pl = plan[0];
    const anchorX = Math.round(this.game.world.wrapDelta(pl.x - this.game.camera.x) + screenCenterX);
    const anchorY = Math.round(pl.y - this.game.camera.y + screenCenterY);
    ctx.globalAlpha = 0.65;
    for (const q of plan) this.game.structures.drawStructure(ctx, cfg.sprite, anchorX, anchorY - q.z * this.STACK_STEP, q.flip);

    // guia do eixo da peca (no chao)
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)'; ctx.lineWidth = 2; ctx.beginPath();
    if (cfg.isCorner) {
      const sy2 = cfg.kind === 'corner_concave' ? 24 : -24;
      ctx.moveTo(anchorX - 48, anchorY + sy2); ctx.lineTo(anchorX, anchorY); ctx.lineTo(anchorX + 48, anchorY + sy2);
    } else {
      const m = pl.flip ? -1 : 1;
      ctx.moveTo(anchorX - 48, anchorY - 24 * m); ctx.lineTo(anchorX + 48, anchorY + 24 * m);
    }
    ctx.stroke();

    // custo total (vermelho se faltar material)
    const cst = this._costSum(plan.map(q => q.type));
    if (cst) {
      const ok = Object.keys(this._missing(cst)).length === 0;
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.75)'; ctx.fillStyle = ok ? '#ffe066' : '#ff6b6b';
      const t = (ok ? '' : 'Sem material  ') + this._costText(cst);
      ctx.strokeText(t, anchorX, anchorY + 22); ctx.fillText(t, anchorX, anchorY + 22);
    }
    if (pl.snapped) { ctx.fillStyle = '#51cf66'; ctx.beginPath(); ctx.arc(anchorX, anchorY - pl.z * this.STACK_STEP, 4, 0, Math.PI * 2); ctx.fill(); }
    if (this.game.structures.showDebug) {
      this.game.structures.drawDebugOverlay(ctx, { sprite: cfg.sprite, flipX: pl.flip, axis: pl.flip ? 'y' : 'x' }, anchorX, anchorY - pl.z * this.STACK_STEP, pl.y);
    }
    ctx.restore();
  }
}

// Tiles candidatos para a chave de uma peca do terreo, do mais perto ao mais longe (dentro do alcance da colisao)
ArchitectSystem.KEY_OFFSETS = (() => {
  const out = [];
  for (let oy = -2; oy <= 2; oy++) for (let ox = -2; ox <= 2; ox++) out.push([ox, oy]);
  return out.sort((p, q) => (p[0] * p[0] + p[1] * p[1] * 1.5) - (q[0] * q[0] + q[1] * q[1] * 1.5));
})();

window.ArchitectSystem = ArchitectSystem;
