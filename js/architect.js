// architect.js - Modular 2.5D Block Construction System (Modo Construtor Oficial com Blocos & Telhados)
class ArchitectSystem {
  constructor(game) {
    this.game = game;
    this.isActive = false;
    this.GRID_SIZE = 48; // 48x48 pixel grid alignment
    this.selectedTool = 'fly'; 
    this.rotation = 0; // 0, 90, 180, 270 degrees
    this.wallHeight = 2; // Default wall height: 2 blocks (96px face + 24px coping = 120px total)
    this.roofAlpha = 1.0; // Smooth interior transparency transition
    this.activeCategory = 'all'; // Active category filter: 'all', 'parede', 'porta', 'telhado', 'piso', 'objeto'
    this.isMinimized = false; // Collapsed/minimized panel state

    // Block Registry
    // blocks: { 'layer:gx,gy': { type, gx, gy, rot, height, isOpen } }
    this.blocks = {};
    
    // Legacy support arrays for backward-compatibility
    this.roads = [];
    this.structures = [];

    // Block Metadata Definitions
    this.BLOCK_TYPES = {
      // --- PISOS & CAMINHOS (Layer 0: Floor) ---
      piso_pedra: { name: 'Piso de Pedra', icon: '🛣️', category: 'piso', layer: 0, w: 1, h: 1, solid: false, img: 'piso_pedra.png' },
      piso_madeira: { name: 'Piso de Madeira', icon: '🪵', category: 'piso', layer: 0, w: 1, h: 1, solid: false, img: 'piso_madeira.png' },
      piso_terra: { name: 'Trilha de Terra', icon: '🌾', category: 'piso', layer: 0, w: 1, h: 1, solid: false, img: 'piso_terra.png' },

      // --- PAREDES & PORTAS (Layer 1: Vertical Solid Entities) ---
      parede_pedra: { 
        name: 'Parede de Pedra', 
        icon: '🧱', 
        category: 'parede',
        layer: 1, 
        w: 1, 
        h: 1, 
        renderH: 120, 
        defaultHeight: 2,
        solid: true, 
        isWall: true,
        img: 'parede_pedra.png',
        imgFront: 'parede_pedra_front.png',
        imgSide: 'parede_pedra_side.png'
      },
      parede_madeira: { 
        name: 'Parede de Madeira', 
        icon: '🪵', 
        category: 'parede',
        layer: 1, 
        w: 1, 
        h: 1, 
        renderH: 120, 
        defaultHeight: 2,
        solid: true, 
        isWall: true,
        img: 'parede_madeira.png',
        imgFront: 'parede_madeira_front.png',
        imgSide: 'parede_madeira_side.png'
      },
      porta_simples: { 
        name: 'Porta Simples', 
        icon: '🚪', 
        category: 'porta',
        layer: 1, 
        w: 1, 
        h: 1, 
        renderH: 120, 
        defaultHeight: 2,
        solid: true, 
        isDoor: true, 
        img: 'porta_simples.png',
        imgOpen: 'porta_simples_aberta.png',
        imgSide: 'porta_simples_side.png',
        imgSideOpen: 'porta_simples_side_aberta.png'
      },
      porta_dupla: { 
        name: 'Porta Dupla', 
        icon: '🚪🚪', 
        category: 'porta',
        layer: 1, 
        w: 2, 
        h: 1, 
        renderH: 120, 
        defaultHeight: 2,
        solid: true, 
        isDoor: true, 
        img: 'porta_dupla.png',
        imgOpen: 'porta_dupla_aberta.png',
        imgSide: 'porta_dupla_side.png',
        imgSideOpen: 'porta_dupla_side_aberta.png'
      },
      portal_pequeno: { 
        name: 'Portal Pequeno', 
        icon: '⛩️', 
        category: 'porta', 
        layer: 1, 
        w: 4, 
        h: 1, 
        renderH: 216, 
        defaultHeight: 4, 
        solid: true, 
        isPortal: true, 
        img: 'portal_pequeno.png',
        imgSide: 'portal_pequeno_side.png'
      },
      portal_grande: { 
        name: 'Portal Grande', 
        icon: '🏰', 
        category: 'porta', 
        layer: 1, 
        w: 8, 
        h: 1, 
        renderH: 216, 
        defaultHeight: 4, 
        solid: true, 
        isPortal: true, 
        img: 'portal_grande.png',
        imgSide: 'portal_grande_side.png'
      },
      lantern: { name: 'Poste Lanterna', icon: '🏮', category: 'objeto', layer: 1, w: 1, h: 1, renderH: 64, solid: false, isLight: true, img: null },

      // --- TELHADOS (Layer 2: Roofs with Interior Transparency) ---
      telhado_palha: { 
        name: 'Telhado Palha', 
        icon: '🌾', 
        category: 'telhado',
        layer: 2, 
        w: 1, 
        h: 1, 
        renderH: 48, 
        isRoof: true, 
        img: 'telhado_palha.png',
        imgFront: 'telhado_palha_front.png',
        imgSide: 'telhado_palha_side.png'
      },
      telhado_madeira: { 
        name: 'Telhado Madeira', 
        icon: '🛖', 
        category: 'telhado',
        layer: 2, 
        w: 1, 
        h: 1, 
        renderH: 48, 
        isRoof: true, 
        img: 'telhado_madeira.png',
        imgFront: 'telhado_madeira_front.png',
        imgSide: 'telhado_madeira_side.png'
      }
    };

    // Preload Block Textures (including variant sprites for front/side and open doors)
    this.images = {};
    const imgFiles = [
      'piso_pedra.png', 'piso_madeira.png', 'piso_terra.png',
      'parede_pedra.png', 'parede_pedra_front.png', 'parede_pedra_side.png',
      'parede_madeira.png', 'parede_madeira_front.png', 'parede_madeira_side.png',
      'porta_simples.png', 'porta_simples_aberta.png',
      'porta_simples_side.png', 'porta_simples_side_aberta.png',
      'porta_dupla.png', 'porta_dupla_aberta.png',
      'porta_dupla_side.png', 'porta_dupla_side_aberta.png',
      'portal_pequeno.png', 'portal_pequeno_side.png',
      'portal_grande.png', 'portal_grande_side.png',
      'telhado_palha.png', 'telhado_palha_front.png', 'telhado_palha_side.png',
      'telhado_madeira.png', 'telhado_madeira_front.png', 'telhado_madeira_side.png'
    ];
    for (const filename of imgFiles) {
      const img = new Image();
      img.src = `assets/blocks/${filename}?v=${Date.now()}`;
      this.images[filename] = img;
    }

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
        <span><b>H:</b> Altura Parede (1x/2x/3x/4x)</span> •
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
          <button class="arch-cat-tab" data-cat="parede">🧱 Paredes</button>
          <button class="arch-cat-tab" data-cat="porta">🚪 Portas</button>
          <button class="arch-cat-tab" data-cat="telhado">🛖 Telhados</button>
          <button class="arch-cat-tab" data-cat="piso">🛣️ Pisos</button>
          <button class="arch-cat-tab" data-cat="objeto">🏮 Objetos</button>
        </div>

        <!-- Grade de Blocos e Peças Construtíveis (Quadradinhos) -->
        <div class="arch-items-grid" id="arch-items-grid"></div>

        <!-- Rodapé de Ações & Modificadores -->
        <div class="arch-panel-footer">
          <div class="arch-footer-row">
            <button class="arch-tool-btn" id="btn-arch-fly" data-tool="fly" title="Voo Livre e Inspeção (WASD rápido)">🖐️ Voo</button>
            <button class="arch-tool-btn" id="btn-arch-rot" title="Rotacionar Bloco [R]">🔄 <span id="arch-rot-val">0°</span></button>
            <button class="arch-tool-btn" id="btn-arch-height" title="Alterar Altura das Paredes [H]">🧱 <span id="arch-height-val">2x</span></button>
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

    this.renderItemsGrid();
  }

  renderItemsGrid() {
    const grid = document.getElementById('arch-items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const id in this.BLOCK_TYPES) {
      const cfg = this.BLOCK_TYPES[id];
      if (this.activeCategory !== 'all' && cfg.category !== this.activeCategory) {
        continue;
      }

      const card = document.createElement('div');
      card.className = `arch-item-card ${this.selectedTool === id ? 'selected' : ''}`;
      card.dataset.tool = id;
      card.title = `${cfg.name} (Camada ${cfg.layer})`;

      const iconFrame = document.createElement('div');
      iconFrame.className = 'arch-card-icon-frame';

      if (cfg.img) {
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
      // R Key to rotate block
      if ((e.key === 'r' || e.key === 'R') && this.isActive) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.cycleRotation();
        }
      }
      // H Key to cycle wall height
      if ((e.key === 'h' || e.key === 'H') && this.isActive) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.cycleWallHeight();
        }
      }
    });

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
        this.renderItemsGrid();
      });
    });

    // Rotation Button
    document.getElementById('btn-arch-rot')?.addEventListener('click', () => this.cycleRotation());

    // Wall Height Button
    document.getElementById('btn-arch-height')?.addEventListener('click', () => this.cycleWallHeight());

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
      this.handleBlockClick(this.game.mouse.worldX, this.game.mouse.worldY);
    });

    // Export/Save Button
    document.getElementById('btn-arch-export')?.addEventListener('click', () => this.exportVillageJSON());
  }

  cycleWallHeight() {
    this.wallHeight = (this.wallHeight % 4) + 1; // 1 -> 2 -> 3 -> 4 -> 1
    if (this.heightValEl) {
      const labels = {
        1: '1x (48px)',
        2: '2x (Padrão)',
        3: '3x (Alta)',
        4: '4x (Castelo)'
      };
      this.heightValEl.innerText = labels[this.wallHeight] || `${this.wallHeight}x`;
    }
    if (this.game.spawnDamageText) {
      this.game.spawnDamageText(this.game.player.x, this.game.player.y - 40, `🧱 Altura Parede: ${this.wallHeight}x (${this.wallHeight * 48}px)`, '#74c0fc', 13);
    }
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

  // Get dynamic block dimensions taking rotation into account (e.g. portals and doors in side walls)
  getBlockDimensions(type, rot = 0) {
    const cfg = this.BLOCK_TYPES[type];
    if (!cfg) return { w: 1, h: 1, renderW: 48, renderH: 48 };
    const G = this.GRID_SIZE;
    const isRotated = (rot === 90 || rot === 270);

    // 1. Portals (Castle gates for horizontal and vertical walls)
    if (cfg.isPortal) {
      if (isRotated) {
        // Lateral (North-South vertical wall): fits inside 1-block thick wall, spans along Y
        const gridH = cfg.w || 4; // 4 for pequeno, 8 for grande
        const renderH = type === 'portal_grande' ? 552 : 360;
        return { w: 1, h: gridH, renderW: G, renderH: renderH };
      } else {
        // Frontal (East-West horizontal wall): spans along X
        return { w: cfg.w || 1, h: cfg.h || 1, renderW: (cfg.w || 1) * G, renderH: cfg.renderH || 216 };
      }
    }

    // 2. Doors in side orientation
    if (cfg.isDoor) {
      if (isRotated) {
        return { w: 1, h: 1, renderW: G, renderH: cfg.renderH || 120 };
      } else {
        return { w: cfg.w || 1, h: cfg.h || 1, renderW: (cfg.w || 1) * G, renderH: cfg.renderH || 120 };
      }
    }

    // 3. Walls (parede_pedra, parede_madeira)
    if (cfg.isWall) {
      return { w: 1, h: 1, renderW: G, renderH: 120 };
    }

    // 4. Default / Roofs / Floors
    return { w: cfg.w || 1, h: cfg.h || 1, renderW: (cfg.w || 1) * G, renderH: cfg.renderH || G };
  }

  getBlockAt(layer, rawGX, rawGY) {
    const maxTilesX = Math.floor(this.game.world.WORLD_WIDTH / this.GRID_SIZE);
    const normX = ((rawGX % maxTilesX) + maxTilesX) % maxTilesX;

    // 1. Direct hit at anchor tile
    const direct = this.blocks[`${layer}:${normX},${rawGY}`];
    if (direct) {
      return { block: direct, anchorGX: normX, anchorGY: rawGY, isAnchor: true };
    }

    // 2. Multi-tile wide & tall blocks (supporting up to 8x8 footprints like portal_grande)
    for (let dy = 0; dy <= 8; dy++) {
      for (let dx = 0; dx <= 8; dx++) {
        if (dx === 0 && dy === 0) continue;
        const checkX = (((normX - dx) % maxTilesX) + maxTilesX) % maxTilesX;
        const checkY = rawGY - dy;
        const b = this.blocks[`${layer}:${checkX},${checkY}`];
        if (b) {
          const dims = this.getBlockDimensions(b.type, b.rot);
          if (dims.w > dx && dims.h > dy) {
            return { block: b, anchorGX: checkX, anchorGY: checkY, isAnchor: false };
          }
        }
      }
    }

    return null;
  }

  handleBlockClick(wx, wy) {
    const rawGX = Math.floor(this.game.world.wrapX(wx) / this.GRID_SIZE);
    const gx = this.normGX(rawGX);
    const gy = Math.floor(wy / this.GRID_SIZE);

    // DEMOLISH TOOL
    if (this.selectedTool === 'delete') {
      let removed = false;
      // Remove top-most layer first (roof, then wall, then floor), supporting multi-tile blocks
      for (const layer of [2, 1, 0]) {
        const res = this.getBlockAt(layer, gx, gy);
        if (res) {
          const key = `${layer}:${res.anchorGX},${res.anchorGY}`;
          delete this.blocks[key];
          removed = true;
          this.game.spawnDamageText(gx * this.GRID_SIZE + 24, gy * this.GRID_SIZE + 24, '🗑️ Demolido!', '#ff6b6b', 14);
          break;
        }
      }
      if (removed) this.saveWorldData();
      return;
    }

    const cfg = this.BLOCK_TYPES[this.selectedTool];
    if (!cfg) return;

    const layer = cfg.layer;
    const key = `${layer}:${gx},${gy}`;
    const existing = this.blocks[key];

    // Vertical wall stacking when clicking on an existing wall of the same type!
    if (cfg.isWall && existing && existing.type === this.selectedTool) {
      const curH = existing.height || cfg.defaultHeight || 2;
      const nextH = (this.wallHeight && this.wallHeight !== curH) ? this.wallHeight : ((curH % 4) + 1);
      existing.height = nextH;
      if (this.game.spawnDamageText) {
        this.game.spawnDamageText(gx * this.GRID_SIZE + 24, gy * this.GRID_SIZE + 12, `🧱 Altura: ${nextH}x (${nextH * 48}px)`, '#74c0fc', 13);
      }
      if (window.sounds) window.sounds.playWoodChop?.();
      this.saveWorldData();
      return;
    }

    // Avoid duplicate re-placement of identical block
    if (existing && existing.type === this.selectedTool && existing.rot === this.rotation) return;

    // Place block
    this.blocks[key] = {
      type: this.selectedTool,
      gx,
      gy,
      rot: this.rotation,
      layer,
      height: cfg.isWall ? (this.wallHeight || cfg.defaultHeight || 2) : (cfg.defaultHeight || 1),
      isOpen: false,
      placedAt: Date.now()
    };

    if (window.sounds) window.sounds.playWoodChop?.();
    this.saveWorldData();
  }

  saveWorldData() {
    try {
      localStorage.setItem('aethelgard_blocks_v2', JSON.stringify(this.blocks));
    } catch(e) {}
  }

  loadSavedWorldData() {
    try {
      const saved = localStorage.getItem('aethelgard_blocks_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.blocks = {};
        // Auto-normalize any legacy keys and assign default 2-block height for existing walls
        for (const key in parsed) {
          const b = parsed[key];
          if (!b) continue;
          const normX = this.normGX(b.gx);
          b.gx = normX;
          const cfg = this.BLOCK_TYPES[b.type];
          if (cfg && cfg.isWall && !b.height) {
            b.height = cfg.defaultHeight || 2;
          }
          const normKey = `${b.layer}:${normX},${b.gy}`;
          this.blocks[normKey] = b;
        }
      }
    } catch(e) {}
  }

  exportVillageJSON() {
    const data = {
      version: '2.0_blocks',
      worldWidth: this.game.world.WORLD_WIDTH,
      totalBlocks: Object.keys(this.blocks).length,
      blocks: this.blocks
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aethelgard_castelo_vilarejo_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (this.game.addLog) this.game.addLog(`💾 [CONSTRUTOR] Castelo / Vilarejo exportado com sucesso (${Object.keys(this.blocks).length} blocos modulares)!`, 'system');
  }

  normGX(gx) {
    const maxTilesX = Math.floor(this.game.world.WORLD_WIDTH / this.GRID_SIZE);
    return ((gx % maxTilesX) + maxTilesX) % maxTilesX;
  }

  // Check physical solid wall collision taking into account player body/foot radius (14px)
  isSolidAt(worldX, worldY, radius = 14) {
    const G = this.GRID_SIZE;
    const maxTilesX = Math.floor(this.game.world.WORLD_WIDTH / G);

    // Check all neighboring grid tiles that overlap with the player's bounding circle
    const minGX = Math.floor((worldX - radius) / G);
    const maxGX = Math.floor((worldX + radius) / G);
    const minGY = Math.floor((worldY - radius) / G);
    const maxGY = Math.floor((worldY + radius) / G);

    for (let gy = minGY; gy <= maxGY; gy++) {
      for (let rawGX = minGX; rawGX <= maxGX; rawGX++) {
        const res = this.getBlockAt(1, rawGX, gy);
        if (!res) continue;

        const block = res.block;
        const cfg = this.BLOCK_TYPES[block.type];
        if (!cfg || !cfg.solid) continue;

        // If it's a door, check open passage vs closed barrier
        if (cfg.isDoor) {
          const isSideDoor = (block.rot === 90 || block.rot === 270);
          if (block.isOpen) {
            // Open door: middle is passable, outer posts collide
            const anchorWorldX = res.anchorGX * G;
            const anchorWorldY = res.anchorGY * G;
            if (isSideDoor) {
              const dyToAnchor = worldY - anchorWorldY;
              if (dyToAnchor < 8 || dyToAnchor > 40) return true;
              continue; // Passable through open side doorway!
            } else {
              const dxToAnchor = this.game.world.wrapDelta(worldX - anchorWorldX);
              if (block.type === 'porta_simples') {
                if (dxToAnchor < 6 || dxToAnchor > 42) return true;
              } else if (block.type === 'porta_dupla') {
                // 96px total width across both tiles: middle 8..88px is completely open!
                if (dxToAnchor < 8 || dxToAnchor > 88) return true;
              }
              continue; // Clear passage inside front doorway!
            }
          }
          // Closed door: 100% solid, fall through to AABB test below!
        }

        // Portals: outer side pillars/bastions collide, central archway is completely open!
        if (cfg.isPortal) {
          const isSidePortal = (block.rot === 90 || block.rot === 270);
          const anchorWorldX = res.anchorGX * G;
          const anchorWorldY = res.anchorGY * G;

          if (isSidePortal) {
            // North-South vertical wall portal: passage goes East-West!
            const dyToAnchor = worldY - anchorWorldY;
            if (block.type === 'portal_pequeno') {
              // 4 tiles = 192px total height along Y. North bastion: 0..44px, South bastion: 148..192px. Archway: 44..148px (104px)
              if (dyToAnchor < 44 || dyToAnchor > 148) return true;
              continue; // Clear passage East-West!
            } else if (block.type === 'portal_grande') {
              // 8 tiles = 384px total height along Y. North tower: 0..48px, South tower: 336..384px. Gate: 48..336px (288px)
              if (dyToAnchor < 48 || dyToAnchor > 336) return true;
              continue; // Clear passage East-West!
            }
          } else {
            // East-West horizontal wall portal: passage goes North-South!
            const dxToAnchor = this.game.world.wrapDelta(worldX - anchorWorldX);
            if (block.type === 'portal_pequeno') {
              // Left pillar: 0..44px, Right pillar: 148..192px. Center archway: 44..148px (104px)
              if (dxToAnchor < 44 || dxToAnchor > 148) return true;
              continue; // Clear passage North-South under archway!
            } else if (block.type === 'portal_grande') {
              // Left bastion: 0..48px, Right bastion: 336..384px. Central gate: 48..336px (288px)
              if (dxToAnchor < 48 || dxToAnchor > 336) return true;
              continue; // Clear passage North-South under archway!
            }
          }
        }

        // Standard solid wall block bounds for tile [rawGX, gy]
        const tileLeft = rawGX * G;
        const tileRight = tileLeft + G;
        const tileTop = gy * G;
        const tileBottom = tileTop + G;

        // Handle world wrap delta to tile center
        const tileCenterX = tileLeft + G / 2;
        const dxWrap = this.game.world.wrapDelta(worldX - tileCenterX);
        const effectiveWorldX = tileCenterX + dxWrap;

        // Find nearest point on AABB to player center
        const nearestX = Math.max(tileLeft, Math.min(effectiveWorldX, tileRight));
        const nearestY = Math.max(tileTop, Math.min(worldY, tileBottom));

        const distSq = (effectiveWorldX - nearestX) * (effectiveWorldX - nearestX) + (worldY - nearestY) * (worldY - nearestY);
        if (distSq < radius * radius) {
          return true; // Collision detected!
        }
      }
    }

    return false;
  }

  // Toggle door open/closed at coordinates (works seamlessly from any tile of the door)
  toggleDoorAt(worldX, worldY) {
    const rawGX = Math.floor(this.game.world.wrapX(worldX) / this.GRID_SIZE);
    const gy = Math.floor(worldY / this.GRID_SIZE);
    const res = this.getBlockAt(1, rawGX, gy);
    if (res && this.BLOCK_TYPES[res.block.type]?.isDoor) {
      const block = res.block;
      block.isOpen = !block.isOpen;
      if (this.game.spawnDamageText) {
        const centerX = res.anchorGX * this.GRID_SIZE + ((this.BLOCK_TYPES[block.type].w || 1) * this.GRID_SIZE) / 2;
        this.game.spawnDamageText(centerX, gy * this.GRID_SIZE + 24, block.isOpen ? '🚪 Aberta' : '🚪 Fechada', '#ffd43b', 13);
      }
      if (window.sounds) window.sounds.playUIClick?.();
      this.saveWorldData();
      return true;
    }
    return false;
  }

  // Update roof transparency (Interior Reveal Mechanic)
  updateRoofTransparency(dt) {
    const px = this.game.world.wrapX(this.game.player.x);
    const py = this.game.player.y;
    const gx = this.normGX(Math.floor(px / this.GRID_SIZE));
    const gy = Math.floor(py / this.GRID_SIZE);

    // Is player under a roof block?
    const underRoof = !!this.blocks[`2:${gx},${gy}`];

    // Smooth interior reveal interpolation
    const targetAlpha = underRoof ? 0.15 : 1.0;
    this.roofAlpha += (targetAlpha - this.roofAlpha) * Math.min(1, 8 * dt);
  }

  // Draw Ground Layer (Layer 0: Floors, Roads, Trails)
  drawRoads(ctx, screenCenterX, screenCenterY) {
    const viewW = this.game.canvas.width / (this.game.camera.zoom || 1.0);
    const viewH = this.game.canvas.height / (this.game.camera.zoom || 1.0);
    const G = this.GRID_SIZE;

    // Draw all Layer 0 floor blocks
    for (const key in this.blocks) {
      if (!key.startsWith('0:')) continue;
      const b = this.blocks[key];
      const wx = b.gx * G;
      const wy = b.gy * G;

      const dx = this.game.world.wrapDelta(wx - this.game.camera.x);
      const dy = wy - this.game.camera.y;
      if (Math.abs(dx) > viewW / 2 + G * 2 || Math.abs(dy) > viewH / 2 + G * 2) continue;

      const sx = Math.round(dx + screenCenterX);
      const sy = Math.round(dy + screenCenterY);

      const img = this.images[b.type];
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        if (b.rot !== 0) {
          ctx.translate(sx + G / 2, sy + G / 2);
          ctx.rotate((b.rot * Math.PI) / 180);
          ctx.drawImage(img, -G / 2, -G / 2, G, G);
        } else {
          ctx.drawImage(img, sx, sy, G, G);
        }
        ctx.restore();
      }
    }
  }

  // Inject Walls, Doors, Portals, Lanterns, and Roofs into 2.5D Y-Sorted Render List
  addStructuresToRenderList(renderList, screenCenterX, screenCenterY) {
    const viewW = this.game.canvas.width / (this.game.camera.zoom || 1.0);
    const viewH = this.game.canvas.height / (this.game.camera.zoom || 1.0);
    const G = this.GRID_SIZE;

    // 1. Layer 1 (Walls, Doors, Portals, Lanterns)
    for (const key in this.blocks) {
      if (!key.startsWith('1:')) continue;
      const b = this.blocks[key];
      const wx = b.gx * G;
      const wy = b.gy * G;

      const dx = this.game.world.wrapDelta(wx - this.game.camera.x);
      const dy = wy - this.game.camera.y;
      if (Math.abs(dx) > viewW / 2 + G * 3 || Math.abs(dy) > viewH / 2 + G * 3) continue;

      const sx = Math.round(dx + screenCenterX);
      const sy = Math.round(dy + screenCenterY);

      const cfg = this.BLOCK_TYPES[b.type];
      const dims = this.getBlockDimensions(b.type, b.rot);
      const renderW = dims.renderW;
      const h = b.height || cfg.defaultHeight || (cfg.isWall || cfg.isDoor ? 2 : 1);
      const renderH = cfg.isWall ? (h * G + 24) : dims.renderH;
      const isSideDoor = cfg.isDoor && (b.rot === 90 || b.rot === 270);
      const sortY = isSideDoor ? (wy + G * 2 + 1) : (wy + (dims.h * G)); // Sort by bottom-most foot base

      renderList.push({
        type: 'block_wall',
        layer: 1,
        y: sortY,
        draw: () => this.drawWallBlock(this.game.ctx, b, cfg, sx, sy, renderW, renderH)
      });
    }

    // 2. Layer 2 (Roofs with Interior Reveal Transparency)
    for (const key in this.blocks) {
      if (!key.startsWith('2:')) continue;
      const b = this.blocks[key];
      const wx = b.gx * G;
      const wy = b.gy * G;

      const dx = this.game.world.wrapDelta(wx - this.game.camera.x);
      const dy = wy - this.game.camera.y;
      if (Math.abs(dx) > viewW / 2 + G * 3 || Math.abs(dy) > viewH / 2 + G * 3) continue;

      const sx = Math.round(dx + screenCenterX);
      const sy = Math.round(dy + screenCenterY);

      const cfg = this.BLOCK_TYPES[b.type];
      const renderW = (cfg.w || 1) * G;
      const renderH = cfg.renderH || G;
      const sortY = wy + G; // Same grid tile foot base, but with layer: 2 priority so it always renders on top of its own wall!

      renderList.push({
        type: 'block_roof',
        layer: 2,
        y: sortY,
        draw: () => this.drawRoofBlock(this.game.ctx, b, cfg, sx, sy, renderW, renderH)
      });
    }
  }

  // Resolve the appropriate image for a block based on its type, state, and rotation
  getBlockImage(b, cfg) {
    if (!cfg) return null;

    // 1. Doors: Dedicated Open vs Closed Sprites + Front vs Side
    if (cfg.isDoor) {
      const isSide = (b.rot === 90 || b.rot === 270);
      let imgKey;
      if (isSide) {
        imgKey = b.isOpen ? (cfg.imgSideOpen || cfg.imgOpen) : (cfg.imgSide || cfg.img);
      } else {
        imgKey = b.isOpen ? cfg.imgOpen : cfg.img;
      }
      return this.images[imgKey] || this.images[cfg.img];
    }

    // 2. Portals: Frontal vs Side Sprites
    if (cfg.isPortal) {
      const isSide = (b.rot === 90 || b.rot === 270);
      const imgKey = isSide ? (cfg.imgSide || cfg.img) : cfg.img;
      return this.images[imgKey] || this.images[cfg.img];
    }

    // 3. Walls: Dedicated Frontal (Horizontal) vs Side (Vertical) Sprites
    if (cfg.isWall) {
      const isSide = (b.rot === 90 || b.rot === 270);
      const imgKey = isSide ? cfg.imgSide : cfg.imgFront;
      return this.images[imgKey] || this.images[cfg.img];
    }

    // 4. Roofs: Dedicated Frontal (Horizontal Slope) vs Side (Vertical Slope) Sprites
    if (cfg.isRoof) {
      const isSide = (b.rot === 90 || b.rot === 270);
      const imgKey = isSide ? cfg.imgSide : cfg.imgFront;
      return this.images[imgKey] || this.images[cfg.img];
    }

    // Default
    return this.images[cfg.img];
  }

  drawWallBlock(ctx, b, cfg, sx, sy, renderW, renderH) {
    const G = this.GRID_SIZE;
    const dims = this.getBlockDimensions(b.type, b.rot);
    const actualRenderW = dims.renderW;
    const h = b.height || cfg.defaultHeight || (cfg.isWall || cfg.isDoor ? 2 : 1);
    const isSideWallB = cfg.isWall && (b.rot === 90 || b.rot === 270);
    const actualRenderH = (cfg.isWall && !isSideWallB) ? (h * G + 24) : dims.renderH;
    const topY = sy + (dims.h * G) - actualRenderH;

    if (b.type === 'lantern') {
      ctx.fillStyle = '#343a40';
      ctx.fillRect(sx + G / 2 - 3, topY + 8, 6, actualRenderH - 8);
      ctx.fillStyle = '#ffd43b';
      ctx.beginPath();
      ctx.arc(sx + G / 2, topY + 14, 8, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    const img = this.getBlockImage(b, cfg);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();

      // Soft drop shadow on ground under base
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      if (!isSideWallB) {
        ctx.ellipse(sx + actualRenderW / 2, sy + (dims.h * G) - 2, actualRenderW * 0.52, 9, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (cfg.isWall) {
        const isSide = (b.rot === 90 || b.rot === 270);
        if (isSide) {
          // Vertical side wall (90°/270°): 48px wide, perfectly seamless, matching front wall height
          if (b.rot === 270) {
            ctx.translate(sx + actualRenderW / 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, 48, 24, -actualRenderW / 2, topY, actualRenderW, 24);
            const faceStartY = topY + 24;
            for (let k = 0; k < h; k++) {
              const courseY = faceStartY + k * G;
              ctx.drawImage(img, 0, 24, 48, 48, -actualRenderW / 2, courseY, actualRenderW, G);
            }
          } else {
            ctx.drawImage(img, 0, 0, 48, 24, sx, topY, actualRenderW, 24);
            const faceStartY = topY + 24;
            for (let k = 0; k < h; k++) {
              const courseY = faceStartY + k * G;
              ctx.drawImage(img, 0, 24, 48, 48, sx, courseY, actualRenderW, G);
            }
          }
        } else {
          // Frontal wall (0°/180°): Single coping at topY (24px height), h courses of 48px brick face below
          if (b.rot === 180) {
            ctx.translate(sx + actualRenderW / 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0, 48, 24, -actualRenderW / 2, topY, actualRenderW, 24);
            const faceStartY = topY + 24;
            for (let k = 0; k < h; k++) {
              const courseY = faceStartY + k * G;
              ctx.drawImage(img, 0, 24, 48, 48, -actualRenderW / 2, courseY, actualRenderW, G);
            }
          } else {
            ctx.drawImage(img, 0, 0, 48, 24, sx, topY, actualRenderW, 24);
            const faceStartY = topY + 24;
            for (let k = 0; k < h; k++) {
              const courseY = faceStartY + k * G;
              ctx.drawImage(img, 0, 24, 48, 48, sx, courseY, actualRenderW, G);
            }
          }
        }
      } else if (cfg.isDoor) {
        const isSide = (b.rot === 90 || b.rot === 270);
        if (isSide) {
          if (b.rot === 270) {
            // Flip West
            ctx.translate(sx + actualRenderW / 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
          } else {
            // Face East
            ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
          }
        } else {
          if (b.rot === 180) {
            // Flip North
            ctx.translate(sx + actualRenderW / 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
          } else {
            // Face South
            ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
          }
        }
      } else if (cfg.isPortal) {
        if (b.rot === 180 || b.rot === 270) {
          // Flip North or West
          ctx.translate(sx + actualRenderW / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
        } else {
          // Face South (0°) or East (90°)
          ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
        }
      } else if (b.rot !== 0) {
        ctx.translate(sx + actualRenderW / 2, sy + G / 2);
        ctx.rotate((b.rot * Math.PI) / 180);
        ctx.drawImage(img, -actualRenderW / 2, -actualRenderH + G / 2, actualRenderW, actualRenderH);
      } else {
        ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
      }
      ctx.restore();
    }
  }

  drawRoofBlock(ctx, b, cfg, sx, sy, renderW, renderH) {
    const G = this.GRID_SIZE;
    const topY = sy - (renderH - G);
    const img = this.getBlockImage(b, cfg);

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = this.roofAlpha; // Interior reveal alpha!
      ctx.drawImage(img, sx, topY, renderW, renderH);
      ctx.restore();
    }
  }

  // Draw Grid Cursor & Block Ghost Preview
  drawPreview(ctx, screenCenterX, screenCenterY) {
    if (!this.isActive || this.selectedTool === 'fly') return;

    const G = this.GRID_SIZE;
    const wx = this.game.mouse.worldX;
    const wy = this.game.mouse.worldY;
    const rawGX = Math.floor(this.game.world.wrapX(wx) / G);
    const gx = this.normGX(rawGX);
    const gy = Math.floor(wy / G);

    const snapX = gx * G;
    const snapY = gy * G;

    const dx = this.game.world.wrapDelta(snapX - this.game.camera.x);
    const dy = snapY - this.game.camera.y;

    const sx = Math.round(dx + screenCenterX);
    const sy = Math.round(dy + screenCenterY);

    const cfg = this.BLOCK_TYPES[this.selectedTool];

    ctx.save();

    // 1. Grid Tile Outline (proportional to dynamic block w and h based on rotation!)
    ctx.strokeStyle = this.selectedTool === 'delete' ? '#ff6b6b' : '#ffd43b';
    ctx.lineWidth = 2;
    const dims = this.getBlockDimensions(this.selectedTool, this.rotation);
    const previewW = dims.w * G;
    const previewH = dims.h * G;
    ctx.strokeRect(sx, sy, previewW, previewH);

    // 2. Ghost Block Texture Preview
    if (cfg) {
      const dummyBlock = { type: this.selectedTool, rot: this.rotation, isOpen: false };
      const img = this.getBlockImage(dummyBlock, cfg);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.globalAlpha = 0.65;
        const actualRenderW = dims.renderW;
        const h = this.wallHeight || cfg.defaultHeight || 2;
        const isSideWallP = cfg.isWall && (this.rotation === 90 || this.rotation === 270);
        const actualRenderH = cfg.isWall ? (h * G + 24) : dims.renderH;
        const topY = sy + (dims.h * G) - actualRenderH;

        if (cfg.isWall) {
          const isSide = isSideWallP;
          if (isSide) {
            if (this.rotation === 270) {
              ctx.translate(sx + actualRenderW / 2, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(img, 0, 0, 48, 24, -actualRenderW / 2, topY, actualRenderW, 24);
              const faceStartY = topY + 24;
              for (let k = 0; k < h; k++) {
                const courseY = faceStartY + k * G;
                ctx.drawImage(img, 0, 24, 48, 48, -actualRenderW / 2, courseY, actualRenderW, G);
              }
            } else {
              ctx.drawImage(img, 0, 0, 48, 24, sx, topY, actualRenderW, 24);
              const faceStartY = topY + 24;
              for (let k = 0; k < h; k++) {
                const courseY = faceStartY + k * G;
                ctx.drawImage(img, 0, 24, 48, 48, sx, courseY, actualRenderW, G);
              }
            }
          } else {
            if (this.rotation === 180) {
              ctx.translate(sx + actualRenderW / 2, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(img, 0, 0, 48, 24, -actualRenderW / 2, topY, actualRenderW, 24);
              const faceStartY = topY + 24;
              for (let k = 0; k < h; k++) {
                const courseY = faceStartY + k * G;
                ctx.drawImage(img, 0, 24, 48, 48, -actualRenderW / 2, courseY, actualRenderW, G);
              }
            } else {
              ctx.drawImage(img, 0, 0, 48, 24, sx, topY, actualRenderW, 24);
              const faceStartY = topY + 24;
              for (let k = 0; k < h; k++) {
                const courseY = faceStartY + k * G;
                ctx.drawImage(img, 0, 24, 48, 48, sx, courseY, actualRenderW, G);
              }
            }
          }
        } else if (cfg.isDoor) {
          const isSide = (this.rotation === 90 || this.rotation === 270);
          if (isSide) {
            if (this.rotation === 270) {
              ctx.translate(sx + actualRenderW / 2, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
            } else {
              ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
            }
          } else {
            if (this.rotation === 180) {
              ctx.translate(sx + actualRenderW / 2, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
            } else {
              ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
            }
          }
        } else if (cfg.isPortal) {
          if (this.rotation === 180 || this.rotation === 270) {
            ctx.translate(sx + actualRenderW / 2, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, -actualRenderW / 2, topY, actualRenderW, actualRenderH);
          } else {
            ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
          }
        } else if (cfg.isRoof) {
          ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
        } else if (this.rotation !== 0) {
          ctx.translate(sx + actualRenderW / 2, sy + G / 2);
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.drawImage(img, -actualRenderW / 2, -actualRenderH + G / 2, actualRenderW, actualRenderH);
        } else {
          ctx.drawImage(img, sx, topY, actualRenderW, actualRenderH);
        }
      }
    }

    // 3. Rotation Direction Arrow indicator
    if (this.selectedTool !== 'delete' && this.selectedTool !== 'fly') {
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      const arrowMap = { 0: '↓ S (Frontal)', 90: '→ L (Lateral)', 180: '↑ N (Frontal)', 270: '← O (Lateral)' };
      ctx.fillText(arrowMap[this.rotation] || '', sx + previewW / 2, sy + previewH / 2 + 4);
    }

    ctx.restore();
  }
}

window.ArchitectSystem = ArchitectSystem;
