// minimap.js - Compass Minimap & Interactive Full World Map Modal for Aethelgard
class MinimapSystem {
  constructor(game) {
    this.game = game;
    this.isWorldMapOpen = false;
    this.zoom = 1.0;
    this.init();
  }

  init() {
    this.createMinimapDOM();
    this.createWorldMapModalDOM();
    this.setupEvents();
  }

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

    // Insert into top center, just below calendar card or in top right
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
            <span class="world-map-icon">🗺️</span>
            <h2>CARTOGRAFIA DE ARES • PLANETA AETHELGARD</h2>
            <span class="world-map-sub">24 Fusos Horários • Escala 166.5 km • Topografia Paleohidrológica</span>
          </div>
          <div class="world-map-controls">
            <span class="world-map-god-hint" id="world-map-god-hint" style="display: none;">👑 MODO DEUS: Clique no mapa para Teleportar!</span>
            <button class="world-map-close-btn" id="world-map-close-btn" title="Fechar Mapa [M / Esc]">✕</button>
          </div>
        </div>
        <div class="world-map-viewport" id="world-map-viewport">
          <div class="world-map-img-wrapper" id="world-map-wrapper">
            <img src="assets/world/mapa_global.jpg" class="world-map-img" id="world-map-img" alt="Mapa Múndi de Aethelgard" />
            <!-- Player Location Pulse Pin -->
            <div class="world-map-pin" id="world-map-player-pin" title="Sua Localização">
              <div class="pin-ring"></div>
              <div class="pin-core"></div>
              <div class="pin-label" id="world-map-pin-label">Você Está Aqui</div>
            </div>
            <!-- Crosshair for God Mode Teleport -->
            <div class="world-map-crosshair" id="world-map-crosshair" style="display: none;"></div>
          </div>
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
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    this.modalEl = modal;
    this.mapImg = document.getElementById('world-map-img');
    this.playerPin = document.getElementById('world-map-player-pin');
    this.pinLabel = document.getElementById('world-map-pin-label');
    this.crosshair = document.getElementById('world-map-crosshair');
    this.godHint = document.getElementById('world-map-god-hint');
  }

  setupEvents() {
    // Click on Minimap opens World Map
    const minimapCard = document.getElementById('hud-minimap-widget');
    if (minimapCard) {
      minimapCard.addEventListener('click', () => this.toggleWorldMap());
    }

    // Close button & backdrop
    const closeBtn = document.getElementById('world-map-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeWorldMap());
    const backdrop = document.getElementById('world-map-backdrop');
    if (backdrop) backdrop.addEventListener('click', () => this.closeWorldMap());

    // Toggle with 'M' key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        // Only if not typing in input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          this.toggleWorldMap();
        }
      }
      if (e.key === 'Escape' && this.isWorldMapOpen) {
        this.closeWorldMap();
      }
    });

    // God Mode Map Teleport Click
    const viewport = document.getElementById('world-map-viewport');
    if (viewport) {
      viewport.addEventListener('click', (e) => {
        if (!this.game.isGodMode) return;
        const rect = this.mapImg.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

        const rawU = (e.clientX - rect.left) / rect.width;
        const rawV = (e.clientY - rect.top) / rect.height;

        // Inner cartographic grid bounds inside decorative parchment border
        const mapLeft = 0.052, mapRight = 0.948, mapTop = 0.105, mapBottom = 0.895;
        const u = Math.max(0, Math.min(1, (rawU - mapLeft) / (mapRight - mapLeft)));
        const v = Math.max(0, Math.min(1, (rawV - mapTop) / (mapBottom - mapTop)));

        const targetX = u * this.game.world.WORLD_WIDTH;
        const targetY = v * this.game.world.WORLD_HEIGHT;

        this.game.player.x = targetX;
        this.game.player.y = targetY;
        this.game.camera.x = targetX;
        this.game.camera.y = targetY;

        if (this.game.updateCalendarHUD) this.game.updateCalendarHUD();
        if (this.game.spawnDamageText) {
          this.game.spawnDamageText(this.game.player.x, this.game.player.y - 40, '⚡ TELEPORTE DIVINO!', '#ffd43b', 18);
        }
        if (this.game.addLog) {
          const info = this.game.world.getTimezoneInfo(targetX);
          const terr = this.game.world.getTerrainAt(targetX, targetY);
          this.game.addLog(`⚡ [MODO DEUS] Teleportado para ${info.regionName} (${terr.name} • ${info.utcStr})!`, 'action');
        }

        this.updateWorldMapPin();
      });

      // Crosshair follow mouse in God Mode
      viewport.addEventListener('mousemove', (e) => {
        if (!this.game.isGodMode || !this.crosshair) return;
        const rect = this.mapImg.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          this.crosshair.style.display = 'block';
          this.crosshair.style.left = `${e.clientX - rect.left}px`;
          this.crosshair.style.top = `${e.clientY - rect.top}px`;
        } else {
          this.crosshair.style.display = 'none';
        }
      });
    }
  }

  toggleWorldMap() {
    if (this.isWorldMapOpen) this.closeWorldMap();
    else this.openWorldMap();
  }

  openWorldMap() {
    this.isWorldMapOpen = true;
    if (this.modalEl) this.modalEl.style.display = 'flex';
    if (this.godHint) this.godHint.style.display = this.game.isGodMode ? 'inline-block' : 'none';
    this.updateWorldMapPin();
    if (window.sounds) window.sounds.playUIClick?.();
  }

  closeWorldMap() {
    this.isWorldMapOpen = false;
    if (this.modalEl) this.modalEl.style.display = 'none';
    if (this.crosshair) this.crosshair.style.display = 'none';
  }

  updateWorldMapPin() {
    if (!this.isWorldMapOpen || !this.mapImg || !this.playerPin) return;

    const w = this.game.world.WORLD_WIDTH;
    const h = this.game.world.WORLD_HEIGHT;
    const px = this.game.world.wrapX(this.game.player.x);
    const py = this.game.world.clampY(this.game.player.y);

    const u = px / w;
    const v = py / h;

    // Map into inner cartographic grid
    const mapLeft = 0.052, mapRight = 0.948, mapTop = 0.105, mapBottom = 0.895;
    const pinX = mapLeft + u * (mapRight - mapLeft);
    const pinY = mapTop + v * (mapBottom - mapTop);

    this.playerPin.style.left = `${(pinX * 100).toFixed(2)}%`;
    this.playerPin.style.top = `${(pinY * 100).toFixed(2)}%`;

    // Update bottom info
    const coordStr = `${this.game.world.getLongitudeStr(px)} • ${this.game.world.getLatitudeStr(py)}`;
    const fuso = this.game.world.getTimezoneInfo(px);
    const terr = this.game.world.getTerrainAt(px, py);
    const localDate = this.game.world.getLocalSolarTime(this.game.timeSystem.virtualDate, px);
    const timeStr = `${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;

    const cEl = document.getElementById('world-map-coord-str');
    if (cEl) cEl.innerText = coordStr;
    const rEl = document.getElementById('world-map-region-str');
    if (rEl) rEl.innerText = `${fuso.regionName} [${fuso.utcStr}]`;
    const tEl = document.getElementById('world-map-terrain-str');
    if (tEl) tEl.innerText = terr.name;
    const sEl = document.getElementById('world-map-solar-str');
    if (sEl) sEl.innerText = `${timeStr} (${terr.isWater ? 'Águas' : 'Terra'})`;
  }

  // Draw real-time radar Minimap (called from main game loop)
  update() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = cw / 2 - 2;

    ctx.clearRect(0, 0, cw, ch);

    // Save clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // 1. Radar background: sample terrain in a 13x13 grid around player
    const viewRange = 2400; // pixels in world
    const steps = 14;
    const stepSizePx = (viewRange * 2) / steps;
    const cellW = cw / steps;
    const cellH = ch / steps;

    for (let ix = 0; ix < steps; ix++) {
      for (let iy = 0; iy < steps; iy++) {
        const sampleWorldX = this.game.player.x + (ix - steps / 2) * stepSizePx;
        const sampleWorldY = this.game.player.y + (iy - steps / 2) * stepSizePx;

        const terr = this.game.world.getTerrainAt(sampleWorldX, sampleWorldY);

        let col = '#2b4421'; // Grass default
        if (terr.isWater) {
          col = terr.type === 'ocean' ? '#1864ab' : '#228be6';
        } else if (terr.type === 'shore') {
          col = '#fab005';
        } else if (terr.type === 'snow') {
          col = '#e9ecef';
        } else if (terr.type === 'canyon' || terr.type === 'mountain') {
          col = '#8c6239';
        }

        ctx.fillStyle = col;
        ctx.fillRect(ix * cellW, iy * cellH, cellW + 1, cellH + 1);
      }
    }

    // 2. Draw nearby entities (Trees, Deers, Wolves)
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

    // 3. Player Arrow in the Center
    ctx.save();
    ctx.translate(cx, cy);
    const facing = this.game.player.facingAngle || (Math.PI / 2);
    ctx.rotate(facing - Math.PI / 2);

    // Golden directional player arrow
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

    ctx.restore(); // Restore clip

    // Update World Map pin if modal is open
    if (this.isWorldMapOpen) {
      this.updateWorldMapPin();
    }
  }
}

window.MinimapSystem = MinimapSystem;
