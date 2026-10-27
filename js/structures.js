// js/structures.js - Unified Structure Management & Dungeon Atlas Renderer for Aethelgard
// Loads atlas_game (104px wall height standard) and handles F3 debug overlay + test scene

class StructureManager {
  constructor(game) {
    this.game = game;
    this.loaded = false;
    this.atlasImage = new Image();
    this.manifest = null;
    this.frames = {};
    this.showDebug = false; // F3 toggle

    this.init();
  }

  async init() {
    try {
      const res = await fetch('assets/dungeon/dungeon_game_atlas.json?v=' + Date.now());
      this.manifest = await res.json();
      this.frames = this.manifest.frames || {};

      this.atlasImage.onload = () => {
        this.loaded = true;
        console.log(`[StructureManager] Atlas loaded with ${Object.keys(this.frames).length} sprites.`);
        this.syncCatalog();
        this.checkSceneMode();
        if (window.ZeusPalace && window.ZeusPalace.build) { try { window.ZeusPalace.build(this.game); } catch (e) { console.error('[ZeusPalace]', e); } }
      };
      this.atlasImage.src = 'assets/dungeon/dungeon_game_atlas.png?v=' + Date.now();
    } catch (err) {
      console.error('[StructureManager] Failed to load atlas/manifest:', err);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'F3') {
        e.preventDefault();
        this.showDebug = !this.showDebug;
        if (this.game && this.game.spawnDamageText) {
          this.game.spawnDamageText(
            this.game.player.x,
            this.game.player.y - 40,
            `Debug Estruturas [F3]: ${this.showDebug ? 'LIGADO' : 'DESLIGADO'}`,
            this.showDebug ? '#51cf66' : '#ff6b6b',
            14
          );
        }
      }
    });
  }

  checkSceneMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('scene') === 'structures') {
      this.buildTestScene();
    }
  }

  // F1: fonte unica. A geometria (frame, anchor, face A/B, ground) vem so do JSON do atlas
  // e e aplicada as definicoes de blocos do construtor (rotulos/flags ficam em dungeon_blocks_data.js).
  syncCatalog() {
    const arch = this.game && this.game.architect;
    if (!arch || !arch.applyAtlasCatalog) return;
    const n = arch.applyAtlasCatalog(this.frames);
    console.log(`[StructureManager] Catalogo sincronizado: ${n} pecas com geometria do atlas.`);
  }

  // Cena de teste (?scene=structures): usa o MESMO armazenamento e encaixe do construtor,
  // com pecas temporarias (nao entram em save nem exportacao). Fortinho encadeado + catalogo.
  buildTestScene() {
    const arch = this.game && this.game.architect;
    if (!arch || !arch.addDungeonPiece) {
      console.warn('[StructureManager] Construtor indisponivel: cena de teste nao criada.');
      return;
    }
    for (const k of Object.keys(arch.blocks)) { if (arch.blocks[k].temp) delete arch.blocks[k]; }

    const originX = 100000;
    const originY = 800000; // Latitude ~45N: Reinos de Valoria & Bosques Verdes

    if (this.game && this.game.player) {
      this.game.player.x = originX + 50;
      this.game.player.y = originY + 30;
      this.game.camera.x = this.game.player.x;
      this.game.camera.y = this.game.player.y;
    }

    // Lobo de teste para checar profundidade com entidades
    if (this.game && this.game.wolves) {
      this.game.wolves = this.game.wolves.filter(w => !w.isTestWolf);
      this.game.wolves.push({
        id: 'test_wolf_1', isTestWolf: true, x: originX + 70, y: originY + 80,
        dir: 'down', frame: 0, state: 'idle', hp: 50, maxHp: 50
      });
    }

    // 1. Fortinho: quina convexa no centro e duas paredes saindo dos bracos, cada peca encaixada na anterior.
    const cx = originX + 150, cy = originY + 90;
    const seed = (name, x, y) => arch.addDungeonPiece('dungeon_' + name, x, y, false, { temp: true });
    const snap = (name, dx, dy, flip) => arch.placeDungeonSnapped('dungeon_' + name, cx + dx, cy + dy, flip ? 90 : 0, { temp: true });
    seed('stone_corner_03', cx, cy);
    // braco esquerdo (sobe para a esquerda)
    snap('stone_wall_straight_01', -80, -70, false);
    snap('stone_wall_straight_02', -160, -110, false);
    snap('stone_wall_straight_01', -240, -160, false);
    snap('door_wood_01', -270, -190, false);
    // braco direito (sobe para a direita)
    snap('stone_wall_straight_01', 80, -70, true);
    snap('stone_wall_straight_02', 160, -110, true);
    snap('gate_iron_01', 235, -150, true);
    snap('stone_wall_mossy_01', 310, -190, true);
    snap('stone_corner_north_01', 380, -225, false);

    // 2. Catalogo de TODAS as pecas do atlas em grade de exposicao, acima do forte
    let col = 0;
    const catX = originX - 600, catY = originY - 900;
    for (const name of Object.keys(this.frames).sort()) {
      if (!arch.BLOCK_TYPES['dungeon_' + name]) continue;
      arch.addDungeonPiece('dungeon_' + name, catX + (col % 8) * 160, catY + Math.floor(col / 8) * 160, false, { temp: true });
      col++;
    }

    const total = Object.values(arch.blocks).filter(b => b.temp).length;
    console.log(`[StructureManager] Cena de teste: ${total} pecas temporarias no armazenamento do construtor.`);
  }

  // Core drawing method: draws a structure from atlas at screen position
  drawStructure(ctx, name, sx, sy, flipX = false) {
    if (!this.loaded) return;
    const meta = this.frames[name];
    if (!meta) return;

    const f = meta.frame;
    const anc = meta.anchor;

    // Draw position on screen: (sx - anc.x, sy - anc.y)
    const drawX = Math.round(sx - anc.x);
    const drawY = Math.round(sy - anc.y);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (flipX) {
      // Flip horizontally around the anchor X
      ctx.translate(sx, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.atlasImage,
        f.x, f.y, f.w, f.h,
        -anc.x, drawY, f.w, f.h
      );
    } else {
      ctx.drawImage(
        this.atlasImage,
        f.x, f.y, f.w, f.h,
        drawX, drawY, f.w, f.h
      );
    }

    ctx.restore();
  }

  // Draw F3 Debug Overlay: Anchor, Footprint baseline & Depth Key
  drawDebugOverlay(ctx, struct, sx, sy, depthKey) {
    if (!this.showDebug) return;

    ctx.save();

    // 1. Red Anchor crosshair on ground center
    ctx.strokeStyle = '#ff0033';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - 8, sy);
    ctx.lineTo(sx + 8, sy);
    ctx.moveTo(sx, sy - 8);
    ctx.lineTo(sx, sy + 8);
    ctx.stroke();

    // Anchor circle
    ctx.fillStyle = '#ff0033';
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cyan Ground Footprint baseline & Yellow Face Line
    const meta = this.frames[struct.sprite];
    if (meta) {
      // (a) Ground contour / arms (cyan)
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (meta.ground) {
        const m = struct.flipX ? -1 : 1;
        const g = meta.ground;
        if (meta.kind === 'corner_concave' || struct.sprite.includes('corner_north') || struct.sprite.includes('mossy_01')) {
          ctx.moveTo(sx + m * g.left.dx, sy + g.left.dy);
          ctx.lineTo(sx, sy);
          ctx.lineTo(sx + m * g.right.dx, sy + g.right.dy);
        } else if (meta.kind === 'corner_convex' || struct.sprite.includes('corner')) {
          ctx.moveTo(sx + m * g.left.dx, sy + g.left.dy);
          ctx.lineTo(sx, sy);
          ctx.lineTo(sx + m * g.right.dx, sy + g.right.dy);
        } else {
          ctx.moveTo(sx + m * g.left.dx, sy + g.left.dy);
          ctx.lineTo(sx + m * g.right.dx, sy + g.right.dy);
        }
      } else {
        const gl = (meta.groundLengthPx || 100) / 2;
        const slope = struct.axis === 'y' ? -0.5 : 0.5;
        ctx.moveTo(sx - gl * 0.894, sy - gl * 0.894 * slope);
        ctx.lineTo(sx + gl * 0.894, sy + gl * 0.894 * slope);
      }
      ctx.stroke();

      // (b) Face A -> B segment (yellow line showing real usable wall face)
      if (meta.face) {
        const m = struct.flipX ? -1 : 1;
        const fA = meta.face.A;
        const fB = meta.face.B;
        ctx.strokeStyle = '#ffd43b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(sx + m * fA.dx, sy + fA.dy);
        ctx.lineTo(sx + m * fB.dx, sy + fB.dy);
        ctx.stroke();

        // Mark Point A (green dot) and Point B (orange dot)
        ctx.fillStyle = '#51cf66';
        ctx.beginPath();
        ctx.arc(sx + m * fA.dx, sy + fA.dy, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff922b';
        ctx.beginPath();
        ctx.arc(sx + m * fB.dx, sy + fB.dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Depth Sorting Key & Sprite Name Tag
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(`${struct.sprite}`, sx, sy - 110);
    ctx.fillStyle = '#ffd43b';
    ctx.fillText(`depth: ${Math.round(depthKey)}`, sx, sy - 98);

    ctx.restore();
  }

  // F1: as pecas agora sao desenhadas pelo construtor (architect.addStructuresToRenderList).
  // Mantido vazio para nao quebrar a chamada em game.js.
  addStructuresToRenderList() {}
}

window.StructureManager = StructureManager;
