// game.js - Main Engine with Y-Sorting, D20 rolls, Tibia-like movement, Deer AI & Ecology
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Resize handling
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Camera
    this.camera = { x: 0, y: 800000, zoom: 1.0 };

    // Player State
    this.player = {
      x: 333005, // spawn em terra firme (planicies de Valória)
      y: 960000,
      vx: 0,
      vy: 0,
      speed: 185, // pixels per second
      width: 48,
      height: 72,
      hp: 100,
      maxHp: 100,
      mana: 50,
      maxMana: 50,
      stamina: 100,
      maxStamina: 100,
      hunger: 85, // 0 to 100%
      direction: 'down', // 'down', 'up', 'left', 'right'
      isMoving: false,
      isRunning: false,
      isSitting: false,
      isJumping: false,
      jumpProgress: 0,
      jumpDuration: 0.38,
      jumpOffset: 0,
      isExhausted: false,
      exhaustionTimer: 0,
      frameIndex: 0,
      animTimer: 0,
      animSpeed: 0.14, // seconds per frame
      walkDistance: 0,
      moveTarget: null, // { x, y } for smooth click-to-move
      facingAngle: Math.PI / 2,
      equippedWeapon: 'sword', // 'sword', 'axe', 'fire_sword', or null
      isAttacking: false,
      attackTimer: 0,
      attackDuration: 0.12,
      slashAngle: 0,
      comboHits: 0,
      comboTimer: 0,
      lastAttackTime: 0,
      strengthBuffTimer: 0,
      inventory: {
        fruit: 3,
        meat: 1,
        potions: 1,
        manaPotions: 1
      }
    };

    // Input States
    this.keys = {};
    this.mouse = {
      x: 0,
      y: 0,
      worldX: 0,
      worldY: 0,
      isDown: false,
      button: null,
      isRightDown: false,
      isLeftDown: false,
      downTime: 0,
      hoveredEntity: null
    };
    this.deerSpawnTimer = 0;

    // Asset Cache
    this.images = {
      grass: new Image(),
      water: new Image(),
      sand: new Image(),
      tree: new Image(),
      treeStump: new Image(),
      playerFrames: { down: [], up: [], left: [], right: [] },
      player: {
        idle: { down: [], up: [], left: [], right: [] },
        walk: { down: [], up: [], left: [], right: [] },
        run: { down: [], up: [], left: [], right: [] },
        jump: { right: [], left: [] },
        sit: { down: null, up: null, left: null, right: null, angle_left: null, angle_right: null },
        exhausted: { right: [], left: [] },
        attack_1h: { right: [], left: [] },
        attack_2h: { right: [], left: [] },
        thrust: { right: [], left: [] },
        gather: { right: [], left: [] },
        hurt: { right: [], left: [] }
      },
      deerFrames: { down: [], up: [], left: [], right: [], eat: [] },
      wolfFrames: { down: [], up: [], left: [], right: [], attack: [] },
      weapons: {
        sword: new Image(),
        axe: new Image(),
        fire_sword: new Image()
      },
      carcass: [new Image(), new Image(), new Image()]
    };

    // World Entities
    this.trees = [];
    this.fruitsOnGround = [];
    this.deers = [];
    this.wolves = [];
    this.carcasses = [];
    this.campfires = [];
    this.particles = [];

    // UI Elements
    this.hpBar = document.getElementById('hp-bar');
    this.hpLabel = document.getElementById('hp-label');
    this.manaBar = document.getElementById('mana-bar');
    this.manaLabel = document.getElementById('mana-label');
    this.hungerBar = document.getElementById('hunger-bar');
    this.hungerLabel = document.getElementById('hunger-label');
    this.staminaBar = document.getElementById('stamina-bar');
    this.staminaLabel = document.getElementById('stamina-label');
    this.logMessages = document.getElementById('log-messages');

    // Offscreen lighting buffer canvas
    this.lightCanvas = document.createElement('canvas');
    this.lightCtx = this.lightCanvas.getContext('2d');
    this.interactPrompt = document.getElementById('interact-prompt');
    this.interactText = document.getElementById('interact-text');
    this.targetCard = document.getElementById('target-card');
    this.targetName = document.getElementById('target-name');
    this.targetDesc = document.getElementById('target-desc');
    this.treeCountEl = document.getElementById('tree-count');
    this.fruitCountEl = document.getElementById('fruit-count');
    this.deerCountEl = document.getElementById('deer-count');
    this.wolfCountEl = document.getElementById('wolf-count');
    this.carcassCountEl = document.getElementById('carcass-count');

    // World Planetary Coordinates & 24 Timezones System
    this.world = new WorldCoordinates(this);

    // Calendar & World Time System
    this.timeSystem = new WorldTimeSystem(this);
    this.clockTimeEl = document.getElementById('clock-time');
    this.clockPeriodEl = document.getElementById('clock-period');
    this.celestialIconEl = document.getElementById('celestial-icon');
    this.calDateEl = document.getElementById('cal-date');
    this.calSeasonEl = document.getElementById('cal-season');
    this.calMoonEl = document.getElementById('cal-moon');
    this.weatherBadgeEl = document.getElementById('weather-badge');
    this.btnToggleWeather = document.getElementById('btn-toggle-weather');
    this.btnSetDay = document.getElementById('btn-set-day');
    this.btnSetNight = document.getElementById('btn-set-night');
    this.btnSpeedTime = document.getElementById('btn-speed-time');
    this.geoCoordEl = document.getElementById('geo-coord');
    this.geoFusoEl = document.getElementById('geo-fuso');

    // Inventory System (20 Fixed Grid Slots + Paperdoll Equipment)
    this.inventory = new InventorySystem(this);

    // Hybrid Skills & D20 Codex System (RuneScape 1-99 + Tormenta20 / D&D)
    this.skills = new SkillsSystem(this);

    // God Mode [F2], Compass Minimap & World Map Modal [M]
    this.isGodMode = false;
    this.minimap = new MinimapSystem(this);
    this.structures = new StructureManager(this);
    this.architect = new ArchitectSystem(this);
    this.town = new TownBuilder(this);   // vilas/cidades de js/town_plans.js

    this.lastTime = performance.now();

    this.init();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    // Save: carrega o personagem antes de gerar o mundo (o mundo nasce em volta da posicao salva)
    this.saveSystem = new SaveSystem(this);
    const loaded = this.saveSystem.load();

    this.loadAssets();
    this.setupInputs();
    this.generateWorld();
    this.setupHotbar();
    this.setupMobileControls();
    this.inventory.init();
    this.skills.init();

    this.town.init();
    this.saveSystem.startAutosave();
    if (loaded) {
      this.updateHUD();
      this.addLog('💾 Progresso carregado: personagem, skills e mochila restaurados.', 'system');
    }

    // Start game loop
    requestAnimationFrame((t) => this.loop(t));
  }

  loadAssets() {
    const v = Date.now();
    this.images.grass.src = `assets/world/grama_tile.png?v=${v}`;
    this.images.water.src = `assets/world/agua_tile.png?v=${v}`;
    this.images.sand.src = `assets/world/areia_tile.png?v=${v}`;
    this.images.tree.src = `assets/nature/arvore_game.png?v=${v}`;
    this.images.treeStump.src = `assets/nature/toco_arvore.png?v=${v}`;

    // --- Load Player V2 Animations (High-Resolution Modular Rigs) ---
    // 1. Idle
    ['down', 'up', 'left', 'right'].forEach(dir => {
      this.images.player.idle[dir] = [];
      const count = (dir === 'left' || dir === 'right') ? 1 : 2;
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `assets/player/v2/idle/${dir}_${i}.png?v=${v}`;
        this.images.player.idle[dir].push(img);
      }
    });

    // 2. Walk
    ['down', 'up', 'left', 'right'].forEach(dir => {
      this.images.player.walk[dir] = [];
      const count = (dir === 'left' || dir === 'right') ? 4 : 2;
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `assets/player/v2/walk/${dir}_${i}.png?v=${v}`;
        this.images.player.walk[dir].push(img);
      }
      this.images.playerFrames[dir] = this.images.player.walk[dir];
    });

    // 3. Run (Athletic Sprint)
    ['down', 'up', 'left', 'right'].forEach(dir => {
      this.images.player.run[dir] = [];
      const count = (dir === 'left' || dir === 'right') ? 4 : 2;
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `assets/player/v2/run/${dir}_${i}.png?v=${v}`;
        this.images.player.run[dir].push(img);
      }
    });

    // 4. Jump (4-stage trajectory - right and left rigs)
    this.images.player.jump = { right: [], left: [] };
    for (let i = 0; i < 4; i++) {
      const imgR = new Image();
      imgR.src = `assets/player/v2/jump/jump_right_${i}.png?v=${v}`;
      this.images.player.jump.right.push(imgR);
      const imgL = new Image();
      imgL.src = `assets/player/v2/jump/jump_left_${i}.png?v=${v}`;
      this.images.player.jump.left.push(imgL);
    }
    for (let i = 0; i < 4; i++) {
      this.images.player.jump[i] = this.images.player.jump.right[i];
    }

    // 5. Sit (Human unique cross-legged postures)
    ['down', 'up', 'left', 'right', 'angle_left', 'angle_right'].forEach(k => {
      const img = new Image();
      img.src = `assets/player/v2/sit/${k}.png?v=${v}`;
      this.images.player.sit[k] = img;
    });

    // 6. Exhausted (Hands-on-knees panting)
    this.images.player.exhausted = { right: [], left: [] };
    for (let i = 0; i < 4; i++) {
      const imgR = new Image();
      imgR.src = `assets/player/v2/exhausted/panting_${i}.png?v=${v}`;
      this.images.player.exhausted.right.push(imgR);
      const imgL = new Image();
      imgL.src = `assets/player/v2/exhausted/panting_left_${i}.png?v=${v}`;
      this.images.player.exhausted.left.push(imgL);
    }

    // 7. Attack 1H (Empty fist weapon swing)
    this.images.player.attack_1h = { right: [], left: [] };
    for (let i = 0; i < 5; i++) {
      const imgR = new Image();
      imgR.src = `assets/player/v2/attack_1h/slash_right_${i}.png?v=${v}`;
      this.images.player.attack_1h.right.push(imgR);
      const imgL = new Image();
      imgL.src = `assets/player/v2/attack_1h/slash_left_${i}.png?v=${v}`;
      this.images.player.attack_1h.left.push(imgL);
    }

    // 8. Attack 2H (Overhead chop for Axe / Greatsword)
    this.images.player.attack_2h = { right: [], left: [] };
    for (let i = 0; i < 5; i++) {
      const imgR = new Image();
      imgR.src = `assets/player/v2/attack_2h/chop_right_${i}.png?v=${v}`;
      this.images.player.attack_2h.right.push(imgR);
      const imgL = new Image();
      imgL.src = `assets/player/v2/attack_2h/chop_left_${i}.png?v=${v}`;
      this.images.player.attack_2h.left.push(imgL);
    }

    // 9. Gather / Harvest (Crouching pick up)
    this.images.player.gather = { right: [], left: [] };
    for (let i = 0; i < 4; i++) {
      const imgR = new Image();
      imgR.src = `assets/player/v2/gather/gather_right_${i}.png?v=${v}`;
      this.images.player.gather.right.push(imgR);
      const imgL = new Image();
      imgL.src = `assets/player/v2/gather/gather_left_${i}.png?v=${v}`;
      this.images.player.gather.left.push(imgL);
    }

    // Load Deer animation frames (4 frames per direction/state)
    const deerSets = { down: 4, up: 4, left: 4, right: 4, eat: 4 };
    for (const [key, count] of Object.entries(deerSets)) {
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `assets/animals/cervo_frames/${key}_${i}.png?v=${v}`;
        this.images.deerFrames[key].push(img);
      }
    }

    // Load Wolf animation frames (4 frames per direction/state)
    const wolfSets = { down: 4, up: 4, left: 4, right: 4, attack: 4 };
    for (const [key, count] of Object.entries(wolfSets)) {
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `assets/animals/lobo_frames/${key}_${i}.png?v=${v}`;
        this.images.wolfFrames[key].push(img);
      }
    }

    // Load Weapons
    this.images.weapons.sword.src = `assets/weapons/items/sword.png?v=${v}`;
    this.images.weapons.axe.src = `assets/weapons/items/axe.png?v=${v}`;
    this.images.weapons.fire_sword.src = `assets/weapons/items/fire_sword.png?v=${v}`;

    // Load Carcasses (3 stages)
    for (let i = 0; i < 3; i++) {
      this.images.carcass[i].src = `assets/nature/carcass/stage_${i}.png?v=${v}`;
    }
  }

  setupInputs() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      // Interaction Key 'F'
      if (key === 'f') {
        this.handleInteraction();
      }

      // Drop Fruit Bait Key 'G'
      if (key === 'g') {
        this.dropFruitBait();
      }

      // Build Campfire Key 'C'
      if (key === 'c') {
        this.buildCampfire();
      }

      // Sit / Rest Key 'X'
      if (key === 'x') {
        this.toggleSit();
      }

      // Jump Key 'Space'
      if (e.code === 'Space') {
        e.preventDefault();
        this.performJump();
      }

      // Hotbar keys
      if ('1234567890'.includes(key)) {
        this.useHotbarSlot(key);
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
    });

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      const zoom = this.camera.zoom || 1.0;
      const rawWX = (this.mouse.x - this.canvas.width / 2) / zoom + this.camera.x;
      this.mouse.worldX = this.world ? this.world.wrapX(rawWX) : rawWX;
      this.mouse.worldY = (this.mouse.y - this.canvas.height / 2) / zoom + this.camera.y + this.getLift();

      this.checkMouseHover();
    });

    // Dice Widget Click
    const diceWidget = document.getElementById('dice-widget');
    if (diceWidget) {
      diceWidget.addEventListener('click', () => {
        window.diceSystem.rollD20('Teste de Sorte Geral', 2, 10);
      });
    }

    // Velocidade do personagem (teste): 1x / 3x / 10x / 30x
    this.speedMul = 1;
    const btnWalk = document.getElementById('btn-walk-speed');
    if (btnWalk) btnWalk.addEventListener('click', () => {
      const o = [1, 3, 10, 30]; this.speedMul = o[(o.indexOf(this.speedMul) + 1) % o.length];
      btnWalk.textContent = `🏃 ${this.speedMul}x`; btnWalk.blur();
    });

    // Weather Toggle Button
    if (this.btnToggleWeather) {
      this.btnToggleWeather.addEventListener('click', () => {
        const order = ['clear', 'light_rain', 'thunderstorm', 'overcast'];
        const nextIdx = (order.indexOf(this.timeSystem.weather) + 1) % order.length;
        this.timeSystem.weather = order[nextIdx];
        this.timeSystem.weatherTimer = 300;
        if (this.timeSystem.weather === 'thunderstorm') {
          this.timeSystem.triggerLightning();
        }
        this.addLog(`[Clima] Você alterou o clima para: <b>${this.timeSystem.weather}</b>`, 'tip');
        this.updateHUD();
      });
    }

    // Set Day Button (12:00 Midday in player's local timezone)
    if (this.btnSetDay) {
      this.btnSetDay.addEventListener('click', () => {
        const fuso = this.world ? this.world.getTimezoneInfo(this.player.x).utcOffset : 0;
        const d = new Date(this.timeSystem.virtualDate);
        // Desired local solar hour = 12:00
        // Since local = virtual + fuso => virtual = 12 - fuso
        d.setHours(12 - fuso, 0, 0, 0);
        this.timeSystem.virtualDate = d;
        this.addLog(`☀️ [Tempo] Horário ajustado para <b>Pleno Dia (12:00)</b>!`, 'action');
        this.updateHUD();
      });
    }

    // Set Night Button (00:00 Midnight in player's local timezone)
    if (this.btnSetNight) {
      this.btnSetNight.addEventListener('click', () => {
        const fuso = this.world ? this.world.getTimezoneInfo(this.player.x).utcOffset : 0;
        const d = new Date(this.timeSystem.virtualDate);
        // Desired local solar hour = 00:00
        d.setHours(0 - fuso, 0, 0, 0);
        this.timeSystem.virtualDate = d;
        this.addLog(`🌙 [Tempo] Horário ajustado para <b>Noite Profunda (00:00)</b>!`, 'action');
        this.updateHUD();
      });
    }

    // Time Speed Scale Button (1x -> 60x -> 300x)
    if (this.btnSpeedTime) {
      this.btnSpeedTime.addEventListener('click', () => {
        if (this.timeSystem.timeScale === 1.0) {
          this.timeSystem.timeScale = 60.0; // 1 second real = 1 minute game
          this.btnSpeedTime.innerText = '⚡ 60x';
          this.addLog(`[Tempo] Tempo acelerado em 60x (1 minuto por segundo)!`, 'tip');
        } else if (this.timeSystem.timeScale === 60.0) {
          this.timeSystem.timeScale = 300.0; // 5 minutes per second (watch day/night fast!)
          this.btnSpeedTime.innerText = '⚡ 300x';
          this.addLog(`[Tempo] Tempo hiper acelerado em 300x!`, 'tip');
        } else {
          this.timeSystem.timeScale = 1.0;
          this.btnSpeedTime.innerText = '⚡ 1x (Real)';
          this.addLog(`[Tempo] Tempo sincronizado com o relógio real (1x 24h)!`, 'tip');
        }
      });
    }

    // Prevent context menu on right click for fluid mouse navigation
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse Down: Click-to-Move / Hold-to-Walk / Context Attack & Interact
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.button = e.button;
      this.mouse.downTime = performance.now();

      // Right Click (button 2): EXCLUSIVE MOVEMENT (Click-to-Move & Hold-to-Walk)
      if (e.button === 2) {
        this.mouse.isRightDown = true;
        this.setMoveDestination(this.mouse.worldX, this.mouse.worldY);
      }
      // Left Click (button 0): ATTACK & INTERACTIONS ONLY (Never moves)
      else if (e.button === 0) {
        this.mouse.isLeftDown = true;

        if (this.architect && this.architect.isActive && this.architect.selectedTool !== 'fly') {
          return; // Handled by architect building placement
        }

        // Immediately face cursor direction on attack/interaction
        const mdx = this.world ? this.world.wrapDelta(this.mouse.worldX - this.player.x) : (this.mouse.worldX - this.player.x);
        const angle = Math.atan2(this.mouse.worldY - this.player.y, mdx);
        this.updatePlayerDirectionFromAngle(angle);

        // If clicking directly on a Wolf: Attack!
        if (this.mouse.hoveredEntity && this.mouse.hoveredEntity.type === 'wolf') {
          this.performAttack();
        }
        // If clicking directly on a Door: Open/Close Door!
        else if (
          this.architect &&
          Math.hypot(mdx, this.mouse.worldY - this.player.y) < 110 &&
          this.architect.toggleDoorAt(this.mouse.worldX, this.mouse.worldY)
        ) {
          if (window.sounds) window.sounds.playUIClick?.();
          return;
        }
        // If clicking directly on interactable (carcass, deer, tree) nearby: Interact!
        else if (
          this.mouse.hoveredEntity &&
          ['carcass', 'tree', 'deer', 'campfire'].includes(this.mouse.hoveredEntity.type) &&
          Math.hypot(mdx, this.mouse.worldY - this.player.y) < 110
        ) {
          this.handleInteraction();
        }
        // Otherwise (clicking on open ground/air): Attack!
        else {
          this.performAttack();
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      this.mouse.isDown = false;
      this.mouse.button = null;
      if (e.button === 2) {
        this.mouse.isRightDown = false;
      }
      if (e.button === 0) {
        this.mouse.isLeftDown = false;
      }
    });
  }

  toggleSit() {
    this.player.isSitting = !this.player.isSitting;
    if (this.player.isSitting) {
      this.player.moveTarget = null;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.isMoving = false;
      this.player.isRunning = false;
      this.spawnDamageText(this.player.x, this.player.y - 30, '💤 Sentado (Descanso)', '#74c0fc', 15);
      this.addLog('💤 Você se sentou para descansar. Sua estamina recupera mais rápido!', 'action');
    } else {
      this.spawnDamageText(this.player.x, this.player.y - 30, '🧍 Em Pé!', '#69db7c', 14);
      this.addLog('🧍 Você se levantou.', 'tip');
    }
    this.updateHUD();
  }

  performJump() {
    if (this.player.isSitting) {
      this.toggleSit();
      return;
    }
    if (this.player.isJumping) return;
    if (this.player.stamina < 8) {
      this.spawnDamageText(this.player.x, this.player.y - 30, '💧 Sem Estamina!', '#ff6b6b', 14);
      return;
    }

    this.player.isJumping = true;
    this.player.jumpProgress = 0;
    this.player.stamina = Math.max(0, this.player.stamina - 8);

    if (this.skills) {
      this.skills.addXP('agility', 4);
      this.skills.addXP('atletismo', 2);
    }

    // Jump dust particles at feet
    for (let k = 0; k < 6; k++) {
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 16,
        y: this.player.y + 4,
        vx: (Math.random() - 0.5) * 35,
        vy: -Math.random() * 20 - 5,
        life: 0.3,
        maxLife: 0.3,
        color: 'rgba(180, 160, 130, 0.6)',
        size: Math.random() * 3 + 1.5
      });
    }

    this.updateHUD();
  }

  setMoveDestination(x, y) {
    this.player.moveTarget = { x, y };
    this.createClickRipple(x, y);
  }

  createClickRipple(x, y) {
    this.particles.push({
      type: 'ripple',
      x: x,
      y: y,
      radius: 4,
      maxRadius: 26,
      life: 0.45,
      maxLife: 0.45,
      color: '#4dabf7'
    });
  }

  updatePlayerDirectionFromAngle(angle) {
    const current = this.player.direction;
    const deg = (angle * 180 / Math.PI); // -180 to +180

    // 16 degrees hysteresis threshold prevents diagonal jitter
    const h = 16;

    if (current === 'right') {
      if (deg > 45 + h && deg <= 135 - h) this.player.direction = 'down';
      else if (deg < -45 - h && deg >= -135 + h) this.player.direction = 'up';
      else if (Math.abs(deg) > 135 + h) this.player.direction = 'left';
    } else if (current === 'down') {
      if (deg >= -45 + h && deg <= 45 - h) this.player.direction = 'right';
      else if (Math.abs(deg) > 135 - h) this.player.direction = 'left';
      else if (deg < -45 - h) this.player.direction = 'up';
    } else if (current === 'left') {
      if (deg >= -45 + h && deg <= 45 - h) this.player.direction = 'right';
      else if (deg > 45 + h && deg <= 135 - h) this.player.direction = 'down';
      else if (deg < -45 - h && deg >= -135 + h) this.player.direction = 'up';
    } else if (current === 'up') {
      if (deg >= -45 + h && deg <= 45 - h) this.player.direction = 'right';
      else if (deg > 45 + h && deg <= 135 - h) this.player.direction = 'down';
      else if (Math.abs(deg) > 135 - h) this.player.direction = 'left';
    } else {
      if (deg >= -45 && deg <= 45) this.player.direction = 'right';
      else if (deg > 45 && deg <= 135) this.player.direction = 'down';
      else if (deg < -135 || deg > 135) this.player.direction = 'left';
      else this.player.direction = 'up';
    }
  }

  performAttack() {
    // If sitting, stand up to attack
    if (this.player.isSitting) {
      this.player.isSitting = false;
      this.updateHUD();
    }

    const now = performance.now();
    const timeSinceLast = (now - (this.player.lastAttackTime || 0)) / 1000;

    // If EXHAUSTED: Throttle cadence (forced 0.55s cooldown) and limit combo
    if (this.player.isExhausted) {
      if (timeSinceLast < 0.55) {
        return; // Click ignored: player has no breath to swing faster!
      }
      this.player.lastAttackTime = now;
      this.player.comboHits = 1;
      this.player.comboTimer = 0.4;
      this.spawnDamageText(this.player.x, this.player.y - 28, '💧 Golpe Sem Fôlego', '#ffa8a8', 13);
    } else {
      // Normal attack: zero-delay combo scaling
      this.player.lastAttackTime = now;
      if (timeSinceLast < 0.52) {
        this.player.comboHits = Math.min(12, (this.player.comboHits || 0) + 1);
      } else {
        this.player.comboHits = 1;
      }
      this.player.comboTimer = 0.85;

      // Consume stamina per strike: higher combo frenzy costs more stamina!
      const staminaCost = 6 + Math.min(10, (this.player.comboHits || 1) * 0.9);
      this.player.stamina = Math.max(0, this.player.stamina - staminaCost);

      if (this.player.stamina <= 0) {
        this.player.isExhausted = true;
        this.player.isRunning = false;
        this.spawnDamageText(this.player.x, this.player.y - 36, '💧 EXAUSTO!', '#ff6b6b', 17);
        this.addLog(`⚠️ Você esgotou toda a sua estamina e ficou exausto! Descanse ou vá para a fogueira.`, 'warning');
      }
      this.updateHUD();
    }

    this.player.isAttacking = true;
    this.player.attackTimer = 0.12; // snappy instant reset on every click!

    // Dynamic Combo Multiplier (Faster clicking = much more damage, exhausted = penalty!)
    let comboMultiplier = 1.0;
    if (this.player.isExhausted) {
      comboMultiplier = 0.65; // Exhaustion reduces swing impact
    } else {
      if (this.player.comboHits === 2) comboMultiplier = 1.25;
      else if (this.player.comboHits === 3) comboMultiplier = 1.55;
      else if (this.player.comboHits === 4) comboMultiplier = 1.90;
      else if (this.player.comboHits >= 5) comboMultiplier = 2.30 + (this.player.comboHits - 5) * 0.18;
    }

    if (this.mouse.worldX !== undefined && this.mouse.worldY !== undefined) {
      const mdx = this.world ? this.world.wrapDelta(this.mouse.worldX - this.player.x) : (this.mouse.worldX - this.player.x);
      const attackAngle = Math.atan2(this.mouse.worldY - this.player.y, mdx);
      this.updatePlayerDirectionFromAngle(attackAngle);
      this.player.facingAngle = attackAngle;
    }

    // Play pitch-scaled sound matching click frenzy
    const pitch = Math.min(1.8, 1.0 + (this.player.comboHits - 1) * 0.08);
    if (window.sounds) window.sounds.playSwordSlash(pitch);

    // Dynamic Slash Particles & Colors based on Combo & Weapon
    const isFiery = this.player.equippedWeapon === 'fire_sword';
    const pColor = isFiery ? (Math.random() > 0.4 ? '#ff6b6b' : '#ffa94d') : (this.player.comboHits >= 5 ? '#ffd43b' : '#74c0fc');
    const particleCount = this.player.comboHits >= 5 ? 12 : 6;
    for (let i = 0; i < particleCount; i++) {
      const pAngle = this.player.facingAngle + (Math.random() - 0.5) * 1.5;
      const pDist = 25 + Math.random() * 35;
      this.particles.push({
        x: this.player.x + Math.cos(pAngle) * pDist,
        y: this.player.y - 15 + Math.sin(pAngle) * pDist,
        vx: Math.cos(pAngle) * (80 + this.player.comboHits * 15),
        vy: Math.sin(pAngle) * (80 + this.player.comboHits * 15),
        life: 0.35,
        maxLife: 0.35,
        color: pColor,
        size: Math.random() * 3 + (this.player.comboHits >= 5 ? 3 : 1.5)
      });
    }

    // Weapon Base Damage
    let baseDmg = 12;
    if (this.player.equippedWeapon === 'sword') baseDmg = 16;
    else if (this.player.equippedWeapon === 'axe') baseDmg = 22;
    else if (this.player.equippedWeapon === 'fire_sword') baseDmg = 32;

    const finalDamage = Math.round(baseDmg * comboMultiplier);

    // Check if chopping tree with Axe
    if (this.player.equippedWeapon === 'axe') {
      for (const tree of this.trees) {
        const trunkX = tree.x + tree.trunkOffset.x;
        const trunkY = tree.y + tree.trunkOffset.y;
        const dx = this.world ? this.world.wrapDelta(this.player.x - trunkX) : (this.player.x - trunkX);
        if (Math.hypot(dx, this.player.y - trunkY) < 95) {
          this.chopTreeForWood(tree);
          return;
        }
      }
    }

    // Check hit against nearby Wolves
    for (let i = this.wolves.length - 1; i >= 0; i--) {
      const w = this.wolves[i];
      const wdx = this.world ? this.world.wrapDelta(this.player.x - w.x) : (this.player.x - w.x);
      const dist = Math.hypot(wdx, this.player.y - w.y);
      if (dist < 85) {
        // Fast Instant Combat Roll (Zero Delay)
        const d20 = Math.floor(Math.random() * 20) + 1;
        const comboMod = Math.floor((this.player.comboHits || 1) / 2);
        const mod = window.diceSystem.stats.forca + (isFiery ? 4 : 2) + comboMod;
        const total = d20 + mod;
        const isCrit = (d20 === 20);
        const isSuccess = (total >= 10 || isCrit);

        if (isSuccess) {
          let dmg = finalDamage;
          if (isCrit) dmg = Math.round(dmg * 1.5);
          w.hp -= dmg;

          // Spawn floating damage & combo numbers
          const textCol = isCrit ? '#ffd43b' : (this.player.comboHits >= 5 ? '#ff922b' : (isFiery ? '#ff6b6b' : '#ffffff'));
          const textSize = isCrit ? 22 : (this.player.comboHits >= 5 ? 19 : 15);
          this.spawnDamageText(w.x, w.y - 35, `${isCrit ? '★ CRÍTICO! ' : ''}-${dmg}`, textCol, textSize);

          if (this.player.comboHits >= 2) {
            const label = this.player.comboHits >= 5 ? `🔥 FÚRIA x${this.player.comboHits}!` : `COMBO x${this.player.comboHits}!`;
            this.spawnDamageText(w.x + 8, w.y - 52, label, '#ffa94d', 12);
          }

          if (window.sounds) window.sounds.playWolfBite();
          if (w.hp <= 0) {
            this.wolves.splice(i, 1);
            if (window.sounds) window.sounds.playCritSuccess();
            this.inventory.addItem('wolf_pelt', 1);
            this.inventory.addItem('wolf_tooth', 2);
            if (this.skills) {
              this.skills.addXP('attack', 35);
              this.skills.addXP('hunter', 25);
            }
            this.addLog(`⚔️ Você aniquilou o Lobo em Combo Frenético (${this.player.comboHits}x golpes)! (+1 Pele, +2 Dentes na Mochila)!`, 'action');
          } else {
            w.state = 'fleeing';
            w.fleeTimer = 2.0;
            if (this.skills) {
              this.skills.addXP('attack', 15);
              this.skills.addXP('strength', 10);
            }
            this.addLog(`⚔️ Golpe veloz (${this.player.comboHits}x Combo, -${dmg} dano)! O lobo recuou ferido.`, 'action');
          }
          this.updateHUD();
        } else {
          this.spawnDamageText(w.x, w.y - 30, 'ESQUIVOU!', '#adb5bd', 13);
          this.addLog(`O lobo se esquivou com rapidez selvagem!`, 'warning');
        }
        return;
      }
    }

    // Check hit against nearby Deer
    for (let i = this.deers.length - 1; i >= 0; i--) {
      const d = this.deers[i];
      const ddx = this.world ? this.world.wrapDelta(this.player.x - d.x) : (this.player.x - d.x);
      const dist = Math.hypot(ddx, this.player.y - d.y);
      if (dist < 75) {
        this.deers.splice(i, 1);
        this.spawnCarcass(d.x, d.y);
        this.inventory.addItem('meat', 2);
        if (this.skills) {
          this.skills.addXP('hunter', 40);
          this.skills.addXP('attack', 15);
        }
        this.spawnDamageText(d.x, d.y - 30, `-${finalDamage} (ABATE)`, '#51cf66', 16);
        if (this.player.comboHits >= 2) {
          this.spawnDamageText(d.x + 8, d.y - 48, `COMBO x${this.player.comboHits}!`, '#ffa94d', 12);
        }
        if (window.sounds) window.sounds.playCritSuccess();
        this.addLog(`🏹 Abate ágil com golpe veloz (${this.player.comboHits}x Combo)! (+2 Carnes guardadas na Mochila).`, 'action');
        this.updateHUD();
        return;
      }
    }
  }

  spawnDamageText(x, y, text, color = '#ff6b6b', size = 16) {
    this.particles.push({
      type: 'damage_text',
      x: x + (Math.random() - 0.5) * 14,
      y: y,
      vx: (Math.random() - 0.5) * 18,
      vy: -55,
      text: text,
      color: color,
      size: size,
      life: 0.85,
      maxLife: 0.85
    });
  }

  chopTreeForWood(tree) {
    const tx = tree.x + tree.trunkOffset.x;
    const ty = tree.y + tree.trunkOffset.y;

    // 1. If tree has already fallen into a stump
    if (tree.isStump) {
      if (tree.mushrooms && tree.mushrooms > 0) {
        tree.mushrooms = 0;
        if (this.world && this.world.chunks) this.world.chunks.saveModifiedTree(tree);
        this.inventory.addItem('fruit', 1);
        if (this.skills) {
          this.skills.addXP('herblore', 20);
          this.skills.addXP('sobrevivencia', 8);
        }
        this.spawnDamageText(tx, ty - 32, '+1 Cogumelo Silvestre 🍄', '#ffd43b', 15);
        if (window.sounds) window.sounds.playHarvest();
        this.addLog(`🍄 Você colheu um cogumelo fresco que brotou no toco úmido do carvalho!`, 'action');
        this.updateHUD();
      } else {
        this.spawnDamageText(tx, ty - 32, 'Toco Esgotado 🪵', '#ced4da', 13);
        this.addLog(`🪵 Este toco de carvalho já teve todo o lenho principal extraído. Suas raízes permanecem vivas nutrindo o solo da floresta.`, 'tip');
      }
      return;
    }

    // Initialize wood stats if not set
    if (typeof tree.wood === 'undefined') {
      tree.wood = Math.floor(Math.random() * 5) + 4;
      tree.maxWood = tree.wood;
    }

    if (window.sounds) window.sounds.playAxeChop();

    // Visual tree trunk shake
    tree.shake = 0.22;

    // Flying wood chips
    for (let k = 0; k < 14; k++) {
      this.particles.push({
        x: tx + (Math.random() - 0.5) * 26,
        y: ty + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 100,
        vy: -Math.random() * 85 - 25,
        life: 0.55,
        maxLife: 0.55,
        color: Math.random() > 0.35 ? '#8c6239' : '#d4a373',
        size: Math.random() * 3.5 + 2
      });
    }

    // Leaves falling from canopy shake
    this.createTreeLeafBurst(tree.x, tree.y - 120, 8);

    // D20 Forestry & Strength Roll
    const d20 = Math.floor(Math.random() * 20) + 1;
    const isCrit = d20 === 20;
    const woodAmount = isCrit ? Math.min(tree.wood, 2) : 1;

    tree.wood -= woodAmount;
    this.inventory.addItem('wood', woodAmount);

    // Award Woodcutting & Survival XP
    if (this.skills) {
      this.skills.addXP('woodcutting', isCrit ? 35 : 20);
      this.skills.addXP('sobrevivencia', 6);
    }

    this.spawnDamageText(tx, ty - 35, `+${woodAmount} Madeira 🪵 (${tree.wood} restantes)`, '#ffd43b', 15);

    // 35% chance to extract aromatic tree resin
    if (Math.random() < 0.35) {
      this.inventory.addItem('resin', 1);
      this.spawnDamageText(tx + 12, ty - 52, '+1 Resina 🍯', '#ffa94d', 13);
    }

    if (isCrit) {
      if (window.sounds) window.sounds.playCritSuccess();
      this.addLog(`★ GOLPE DE MESTRE! O machado rachou o lenho perfeito (+${woodAmount} Toras de Carvalho)! Restam [${tree.wood}/${tree.maxWood}].`, 'action');
    } else {
      this.addLog(`🪓 Você golpeou o carvalho com o machado (+${woodAmount} Tora). Lenho restante: [${tree.wood}/${tree.maxWood}].`, 'action');
    }

    // 2. CHECK IF TREE IS COMPLETELY CHOPPED DOWN -> TRANSFORMS INTO STUMP!
    if (tree.wood <= 0) {
      tree.isStump = true;
      tree.wood = 0;
      tree.shake = 0;

      // Heavy tree fall sound effect
      if (window.sounds) window.sounds.playTreeFall();

      // Big XP Bonus for felling entire tree
      if (this.skills) {
        this.skills.addXP('woodcutting', 60);
        this.skills.addXP('strength', 30);
        this.skills.addXP('sobrevivencia', 15);
      }

      // Massive leaves and wood dust burst
      this.createTreeLeafBurst(tree.x, tree.y - 40, 36);

      // Wood debris and sawdust particles on ground
      for (let k = 0; k < 20; k++) {
        this.particles.push({
          x: tx + (Math.random() - 0.5) * 60,
          y: ty + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 120,
          vy: -Math.random() * 70 - 20,
          life: 0.8,
          maxLife: 0.8,
          color: Math.random() > 0.4 ? '#6f4e37' : '#2b8a3e',
          size: Math.random() * 4 + 2
        });
      }

      // If tree had fruits remaining in canopy, scatter them on the ground
      if (tree.fruits > 0) {
        for (let k = 0; k < tree.fruits; k++) {
          this.fruitsOnGround.push({
            x: tree.x + (Math.random() - 0.5) * 75,
            y: ty + (Math.random() * 30 - 15),
            bounceY: 0,
            life: 200
          });
        }
        tree.fruits = 0;
      }

      this.spawnDamageText(tx, ty - 45, '🌲💥 ÁRVORE DERRUBADA!', '#ff8787', 18);
      this.addLog(`🌲💥 CRACK! O tronco do carvalho cedeu e ruiu com estrondo! Restou apenas o toco enraizado, preservando o solo da floresta.`, 'warning');
    }

    if (this.world && this.world.chunks) {
      this.world.chunks.saveModifiedTree(tree);
    }

    this.updateHUD();
  }

  buildCampfire() {
    // Check if player has at least 2 wood across slots or 1 campfire_kit
    let totalWood = 0;
    for (const s of this.inventory.slots) {
      if (s && s.id === 'wood') totalWood += s.count;
    }
    const kitIdx = this.inventory.slots.findIndex(s => s && s.id === 'campfire_kit');

    if (totalWood < 2 && kitIdx === -1) {
      this.addLog(`⚠️ Você precisa de pelo menos 2 Toras de Madeira para construir uma fogueira! Equipe o Machado [4] e corte árvores.`, 'warning');
      return;
    }

    if (kitIdx !== -1) {
      this.inventory.removeItem(kitIdx, 1);
    } else {
      let needed = 2;
      for (let i = 0; i < this.inventory.slots.length; i++) {
        const s = this.inventory.slots[i];
        if (s && s.id === 'wood') {
          const take = Math.min(s.count, needed);
          this.inventory.removeItem(i, take);
          needed -= take;
          if (needed <= 0) break;
        }
      }
    }

    let cx = this.player.x;
    let cy = this.player.y;
    if (this.player.direction === 'down') cy += 40;
    else if (this.player.direction === 'up') cy -= 40;
    else if (this.player.direction === 'left') cx -= 40;
    else if (this.player.direction === 'right') cx += 40;

    const campfire = {
      id: Date.now(),
      x: cx,
      y: cy,
      life: 200, // 200 seconds burn time
      maxLife: 200,
      isLit: true,
      cookedCount: 0
    };

    this.campfires.push(campfire);

    // Ignition burst particles
    for (let k = 0; k < 18; k++) {
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 70 - 20,
        life: 0.8,
        maxLife: 0.8,
        color: Math.random() > 0.4 ? '#ff922b' : '#ffd43b',
        size: Math.random() * 4 + 2
      });
    }

    if (window.sounds) window.sounds.playHarvest();
    if (this.skills) {
      this.skills.addXP('construction', 35);
      this.skills.addXP('sobrevivencia', 15);
    }
    this.spawnDamageText(cx, cy - 35, '🔥 FOGUEIRA ACESA!', '#ffd43b', 17);
    this.addLog(`🔥 Fogueira de Acampamento montada! Espanta lobos, recupera vida/mana e permite assar carnes [F].`, 'action');
    this.updateHUD();
  }

  cookMeatAtCampfire(campfire) {
    const meatIdx = this.inventory.slots.findIndex(s => s && s.id === 'meat');
    if (meatIdx === -1) {
      this.addLog(`Você não tem Carne Crua de Caça na mochila para assar! Cace um cervo ou esfolie uma carcaça.`, 'warning');
      return;
    }

    this.inventory.removeItem(meatIdx, 1);
    this.inventory.addItem('cooked_meat', 1);

    if (this.skills) {
      this.skills.addXP('cooking', 30);
      this.skills.addXP('oficio', 12);
    }

    if (window.sounds) window.sounds.playFireSizzle();

    for (let k = 0; k < 14; k++) {
      this.particles.push({
        x: campfire.x + (Math.random() - 0.5) * 22,
        y: campfire.y - 8 + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 25,
        vy: -Math.random() * 45 - 20,
        life: 0.9,
        maxLife: 0.9,
        color: Math.random() > 0.5 ? '#ced4da' : '#ffa94d',
        size: Math.random() * 4 + 2
      });
    }

    campfire.cookedCount = (campfire.cookedCount || 0) + 1;
    this.spawnDamageText(campfire.x, campfire.y - 45, '+1 Carne Grelhada! 🍖', '#51cf66', 16);
    this.addLog(`🍖 Você assou Carne de Caça na brasa (+1 Carne Grelhada Suculenta guardada na Mochila)!`, 'action');
    this.updateHUD();
  }

  drawCampfire(ctx, campfire, screenCenterX, screenCenterY) {
    const cdx = this.world ? this.world.wrapDelta(campfire.x - this.camera.x) : (campfire.x - this.camera.x);
    const fx = Math.round(cdx + screenCenterX);
    const fy = Math.round(campfire.y - this.camera.y + screenCenterY);

    // 1. Warm ground heat radiance (radiates outward on the grass)
    const heatGrad = ctx.createRadialGradient(fx, fy + 3, 6, fx, fy + 3, 44);
    heatGrad.addColorStop(0, 'rgba(255, 150, 30, 0.55)');
    heatGrad.addColorStop(0.4, 'rgba(230, 90, 15, 0.28)');
    heatGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = heatGrad;
    ctx.beginPath();
    ctx.ellipse(fx, fy + 4, 44, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Ground scorched ring (dark carbon ring)
    ctx.fillStyle = 'rgba(25, 18, 12, 0.75)';
    ctx.beginPath();
    ctx.ellipse(fx, fy + 4, 25, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Stone barrier circle with warm highlights
    for (let i = 0; i < 8; i++) {
      const stoneAngle = (i / 8) * Math.PI * 2;
      const sx = fx + Math.cos(stoneAngle) * 20;
      const sy = fy + 3 + Math.sin(stoneAngle) * 9;
      ctx.fillStyle = (i % 2 === 0) ? '#495057' : '#343a40';
      ctx.beginPath();
      ctx.arc(sx, sy, 4.8, 0, Math.PI * 2);
      ctx.fill();

      // Warm highlight on inner face of stone
      ctx.fillStyle = 'rgba(255, 169, 77, 0.4)';
      ctx.beginPath();
      ctx.arc(sx - Math.cos(stoneAngle) * 1.5, sy - Math.sin(stoneAngle) * 1.5, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Wooden logs criss-cross
    ctx.fillStyle = '#442817';
    ctx.save();
    ctx.translate(fx, fy + 2);
    ctx.rotate(0.35);
    ctx.fillRect(-16, -3.5, 32, 7);
    ctx.rotate(-0.7);
    ctx.fillRect(-16, -3.5, 32, 7);
    ctx.restore();

    // 5. Burning glowing ember core
    const emberGrad = ctx.createRadialGradient(fx, fy, 2, fx, fy, 12);
    emberGrad.addColorStop(0, '#ffffff');
    emberGrad.addColorStop(0.3, '#ffd43b');
    emberGrad.addColorStop(0.7, '#ff6b3b');
    emberGrad.addColorStop(1, '#c92a2a');
    ctx.fillStyle = emberGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, 11, 0, Math.PI * 2);
    ctx.fill();

    // 6. Multi-tiered procedural dancing flame tongues
    const t = performance.now() * 0.012;
    const f1 = Math.sin(t) * 4;
    const f2 = Math.cos(t * 1.4) * 5;
    const f3 = Math.sin(t * 2.1) * 3;
    const flameH = 26 + Math.sin(t * 2) * 6;

    // 6a. Outer fiery red/orange flame
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.moveTo(fx - 14 + f1, fy + 3);
    ctx.quadraticCurveTo(fx + f2, fy - flameH * 0.9, fx + f3, fy - flameH);
    ctx.quadraticCurveTo(fx - f2, fy - flameH * 0.9, fx + 14 + f1, fy + 3);
    ctx.closePath();
    ctx.fill();

    // 6b. Mid-layer blazing amber flame
    ctx.fillStyle = '#ff922b';
    ctx.beginPath();
    ctx.moveTo(fx - 10 + f2 * 0.6, fy + 2);
    ctx.quadraticCurveTo(fx + f1 * 0.8, fy - flameH * 0.8, fx, fy - flameH * 0.85);
    ctx.quadraticCurveTo(fx - f3 * 0.8, fy - flameH * 0.8, fx + 10 + f2 * 0.6, fy + 2);
    ctx.closePath();
    ctx.fill();

    // 6c. Inner bright yellow flame
    ctx.fillStyle = '#ffe066';
    ctx.beginPath();
    ctx.moveTo(fx - 6, fy + 1);
    ctx.quadraticCurveTo(fx + f1 * 0.5, fy - flameH * 0.65, fx, fy - flameH * 0.65);
    ctx.quadraticCurveTo(fx - f2 * 0.5, fy - flameH * 0.65, fx + 6, fy + 1);
    ctx.closePath();
    ctx.fill();

    // 6d. Intense white-hot core
    ctx.fillStyle = '#fff9db';
    ctx.beginPath();
    ctx.moveTo(fx - 3, fy);
    ctx.quadraticCurveTo(fx, fy - flameH * 0.35, fx, fy - flameH * 0.35);
    ctx.quadraticCurveTo(fx, fy - flameH * 0.35, fx + 3, fy);
    ctx.closePath();
    ctx.fill();

    // 7. Label with timer
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillText(`Fogueira (${Math.round(campfire.life)}s)`, fx + 1, fy - flameH - 9);
    ctx.fillStyle = '#ffd43b';
    ctx.fillText(`Fogueira (${Math.round(campfire.life)}s)`, fx, fy - flameH - 10);
  }

  setupHotbar() {
    const slots = document.querySelectorAll('.hotbar .slot');
    slots.forEach(slot => {
      slot.addEventListener('click', () => {
        const slotKey = slot.getAttribute('data-slot');
        this.useHotbarSlot(slotKey);
      });
    });
  }

  useHotbarSlot(key) {
    document.querySelectorAll('.hotbar .slot').forEach(s => s.classList.remove('active'));
    const activeSlot = document.querySelector(`.hotbar .slot[data-slot="${key}"]`);
    if (activeSlot) activeSlot.classList.add('active');

    if (key === '1') {
      // Eat Fruit
      const idx = this.inventory.slots.findIndex(s => s && s.id === 'fruit');
      if (idx !== -1) {
        this.inventory.useItem(idx);
      } else {
        this.addLog(`Você não tem Frutos Silvestres. Encontre uma árvore e aperte [F]!`, 'warning');
      }
    } else if (key === '2') {
      // Minor Healing Potion
      const idx = this.inventory.slots.findIndex(s => s && s.id === 'potion_heal');
      if (idx !== -1) {
        this.inventory.useItem(idx);
      } else {
        this.addLog(`Você não tem Poções de Cura Menor na mochila!`, 'warning');
      }
    } else if (key === '3') {
      // Mana Potion
      const idx = this.inventory.slots.findIndex(s => s && s.id === 'potion_mana');
      if (idx !== -1) {
        this.inventory.useItem(idx);
      } else {
        this.addLog(`Você não tem Elixir de Mana na mochila!`, 'warning');
      }
    } else if (key === '4') {
      // Equip/Toggle Lumberjack Axe
      if (this.inventory.equipment.weapon === 'axe') {
        this.inventory.unequipItem('weapon');
      } else {
        const idx = this.inventory.slots.findIndex(s => s && s.id === 'axe');
        if (idx !== -1) {
          this.inventory.useItem(idx);
        } else {
          this.inventory.equipItemDirect('weapon', 'axe');
          if (window.sounds) window.sounds.playRustle();
          this.addLog(`🪓 Machado de Lenhador empunhado na mão direita!`, 'action');
        }
      }
    } else if (key === '5') {
      // Toggle Torch
      this.player.torchLit = !this.player.torchLit;
      this.inventory.equipment.offhand = this.player.torchLit ? 'torch' : null;
      this.inventory.renderUI();
      if (this.player.torchLit) {
        if (window.sounds) window.sounds.playRustle();
        this.addLog(`🔥 Você acendeu a Tocha de Resina! A luz afasta o breu da noite.`, 'action');
      } else {
        this.addLog(`💨 Você apagou a tocha para se ocultar nas sombras.`, 'tip');
      }
    } else if (key === '6') {
      // Lineage 2 Weapon Enchant Scroll (D20 Risk!)
      const idx = this.inventory.slots.findIndex(s => s && s.id === 'scroll_enchant');
      if (idx !== -1) {
        this.inventory.useItem(idx);
      } else {
        this.addLog(`Você não possui Pergaminhos de Encantamento na mochila!`, 'warning');
      }
    } else if (key === '7') {
      // Equip Steel Sword
      if (this.inventory.equipment.weapon === 'sword') {
        this.inventory.unequipItem('weapon');
      } else {
        const idx = this.inventory.slots.findIndex(s => s && s.id === 'sword');
        if (idx !== -1) {
          this.inventory.useItem(idx);
        } else {
          this.inventory.equipItemDirect('weapon', 'sword');
          if (window.sounds) window.sounds.playSwordSlash();
          this.addLog(`🗡️ Espada de Aço empunhada na mão direita!`, 'action');
        }
      }
    } else if (key === '8') {
      // Equip Fire Sword +16
      if (this.inventory.equipment.weapon === 'fire_sword') {
        this.inventory.unequipItem('weapon');
      } else {
        const idx = this.inventory.slots.findIndex(s => s && s.id === 'fire_sword');
        if (idx !== -1) {
          this.inventory.useItem(idx);
        } else {
          this.inventory.equipItemDirect('weapon', 'fire_sword');
          if (window.sounds) window.sounds.playSwordSlash();
          this.addLog(`⚔️ Lâmina Flamejante +16 empunhada! O fogo sagrado ilumina a escuridão.`, 'action');
        }
      }
    } else if (key === '9') {
      // Eat Fresh Meat
      const idx = this.inventory.slots.findIndex(s => s && s.id === 'meat');
      if (idx !== -1) {
        this.inventory.useItem(idx);
      } else {
        this.addLog(`Você não tem Carne de Caça na mochila. Abata um cervo ou esfolie uma carcaça!`, 'warning');
      }
    } else if (key === '0') {
      // Roll D20
      window.diceSystem.rollD20('Iniciativa de Ação', 2, 12);
    } else {
      this.addLog(`Slot [${key}] selecionado.`, 'tip');
    }
  }

  setupMobileControls() {
    const fBtn = document.getElementById('mobile-f-btn');
    if (fBtn) {
      fBtn.addEventListener('click', () => this.handleInteraction());
    }

    const rollBtn = document.getElementById('mobile-roll-btn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => window.diceSystem.rollD20('Sorte Selvagem', 2, 10));
    }
  }

  generateWorld() {
    // 1. Generate active procedural chunk trees around player
    if (this.world && this.world.chunks) {
      this.trees = this.world.chunks.getVisibleTrees(this.player.x, this.player.y);
    }

    // 2. Spawn initial fruits on ground around player
    for (let i = 0; i < 9; i++) {
      const rx = (Math.random() - 0.5) * 700;
      const ry = (Math.random() - 0.5) * 700;
      this.fruitsOnGround.push({
        x: this.player.x + rx,
        y: this.player.y + ry,
        bounceY: 0,
        life: 180
      });
    }

    // 3. Spawn Deer Herd around player
    const numDeers = 7;
    for (let i = 0; i < numDeers; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 220 + Math.random() * 650;
      const spawnX = this.world ? this.world.wrapX(this.player.x + Math.cos(angle) * dist) : (this.player.x + Math.cos(angle) * dist);
      this.deers.push({
        id: i,
        x: spawnX,
        y: this.player.y + Math.sin(angle) * dist,
        width: 58,
        height: 68,
        speed: 55,       // calm walk
        fleeSpeed: 215,  // fast sprint when scared
        direction: Math.random() > 0.5 ? 'left' : 'right',
        state: 'grazing', // 'grazing', 'wandering', 'foraging', 'alert', 'fleeing'
        timer: Math.random() * 3 + 2,
        alertTimer: 0,
        fleeTimer: 0,
        frameIndex: 0,
        animTimer: 0,
        animSpeed: 0.16,
        targetFruit: null,
        hp: 20
      });
    }

    // 4. Spawn Wolf Pack around player
    const numWolves = 4;
    for (let i = 0; i < numWolves; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 380 + Math.random() * 550;
      const spawnX = this.world ? this.world.wrapX(this.player.x + Math.cos(angle) * dist) : (this.player.x + Math.cos(angle) * dist);
      this.wolves.push({
        id: i,
        x: spawnX,
        y: this.player.y + Math.sin(angle) * dist,
        width: 54,
        height: 60,
        speed: 60,
        chaseSpeed: 195,
        direction: 'down',
        state: 'patrol', // 'patrol', 'hunting', 'attack', 'fleeing'
        timer: Math.random() * 4 + 2,
        frameIndex: 0,
        animTimer: 0,
        targetDeer: null,
        hp: 35,
        maxHp: 35
      });
    }

    this.updateHUD();
    this.addLog(`🦌 Manadas de cervos habitam a floresta.`, 'system');
    this.addLog(`🐺 Uivos distantes... Uma matilha de 4 lobos ferozes patrulha a mata!`, 'warning');
    this.addLog(`⚔️ Pressione <b>[ 7 ]</b> para Espada, <b>[ 4 ]</b> para Machado ou <b>[ 6 ]</b> para Encantar! Clique para Atacar.`, 'tip');
  }

  spawnCarcass(x, y) {
    this.carcasses.push({
      id: Date.now() + Math.random(),
      x: this.world ? this.world.wrapX(x) : x,
      y: y,
      stage: 0, // 0: fresh, 1: decaying, 2: skeleton
      timer: 0,
      harvested: false
    });
    this.updateHUD();
  }

  spawnMigratingDeer() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 550 + Math.random() * 250;
    const spawnX = this.world ? this.world.wrapX(this.player.x + Math.cos(angle) * dist) : (this.player.x + Math.cos(angle) * dist);
    this.deers.push({
      id: Date.now() + Math.random(),
      x: spawnX,
      y: this.player.y + Math.sin(angle) * dist,
      width: 58,
      height: 68,
      speed: 55,
      fleeSpeed: 230,
      direction: Math.random() > 0.5 ? 'left' : 'right',
      state: 'wandering',
      timer: 4.0,
      alertTimer: 0,
      fleeTimer: 0,
      frameIndex: 0,
      animTimer: 0,
      animSpeed: 0.16,
      targetFruit: null,
      hp: 20
    });
    this.addLog(`🦌 Novos cervos selvagens migraram para a floresta em busca de alimento!`, 'system');
    this.updateHUD();
  }

  dropFruitBait() {
    const fruitSlotIdx = this.inventory.slots.findIndex(s => s && s.id === 'fruit');
    if (fruitSlotIdx === -1) {
      this.addLog(`Você não tem frutos na mochila para usar como isca!`, 'warning');
      return;
    }

    this.inventory.removeItem(fruitSlotIdx, 1);
    
    // Throw fruit slightly ahead in facing direction
    let dropX = this.player.x;
    let dropY = this.player.y;
    if (this.player.direction === 'down') dropY += 50;
    else if (this.player.direction === 'up') dropY -= 50;
    else if (this.player.direction === 'left') dropX -= 50;
    else if (this.player.direction === 'right') dropX += 50;
    dropX = this.world ? this.world.wrapX(dropX) : dropX;

    this.fruitsOnGround.push({
      x: dropX,
      y: dropY,
      bounceY: 0,
      life: 180
    });

    if (window.sounds) window.sounds.playHarvest();
    this.addLog(`🍎 Você jogou um Fruto Silvestre no chão como isca! Cervos próximos vão farejar o aroma.`, 'action');
    this.updateHUD();
  }

  checkMouseHover() {
    let hovered = null;

    // Check Wolves first (predators)
    for (const wolf of this.wolves) {
      const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - wolf.x) : (this.mouse.worldX - wolf.x);
      const top = wolf.y - wolf.height;
      const bottom = wolf.y + 10;
      if (
        Math.abs(dx) <= wolf.width / 2 &&
        this.mouse.worldY >= top && this.mouse.worldY <= bottom
      ) {
        hovered = { type: 'wolf', entity: wolf };
        break;
      }
    }

    // Check Deer
    if (!hovered) {
      for (const deer of this.deers) {
        const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - deer.x) : (this.mouse.worldX - deer.x);
        const top = deer.y - deer.height;
        const bottom = deer.y + 10;

        if (
          Math.abs(dx) <= deer.width / 2 &&
          this.mouse.worldY >= top && this.mouse.worldY <= bottom
        ) {
          hovered = { type: 'deer', entity: deer };
          break;
        }
      }
    }

    // Check Carcasses
    if (!hovered) {
      for (const carcass of this.carcasses) {
        const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - carcass.x) : (this.mouse.worldX - carcass.x);
        const dist = Math.hypot(dx, this.mouse.worldY - carcass.y);
        if (dist < 45) {
          hovered = { type: 'carcass', entity: carcass };
          break;
        }
      }
    }

    // Check Trees
    if (!hovered) {
      for (const tree of this.trees) {
        const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - tree.x) : (this.mouse.worldX - tree.x);
        const top = tree.y - tree.height;
        const bottom = tree.y + 20;

        if (
          Math.abs(dx) <= tree.width / 2 &&
          this.mouse.worldY >= top && this.mouse.worldY <= bottom
        ) {
          hovered = { type: 'tree', entity: tree };
          break;
        }
      }
    }

    this.mouse.hoveredEntity = hovered;

    if (hovered && hovered.type === 'wolf') {
      this.targetCard.style.display = 'block';
      this.targetCard.style.left = `${this.mouse.x + 18}px`;
      this.targetCard.style.top = `${this.mouse.y - 10}px`;
      let estadoTxt = 'Patrulhando a mata';
      if (hovered.entity.state === 'hunting') estadoTxt = 'CAÇANDO PRESA (Faro aguçado)!';
      if (hovered.entity.state === 'attack') estadoTxt = 'INVESTIDA AGRESSIVA!';
      if (hovered.entity.state === 'fleeing') estadoTxt = 'Recuando com medo do fogo!';
      this.targetName.innerText = `Lobo da Floresta [HP: ${hovered.entity.hp}/${hovered.entity.maxHp}]`;
      this.targetDesc.innerText = `Estado: ${estadoTxt}. Carnívoro feroz. Teme o fogo de tochas e lâminas flamejantes.`;
    } else if (hovered && hovered.type === 'carcass') {
      this.targetCard.style.display = 'block';
      this.targetCard.style.left = `${this.mouse.x + 18}px`;
      this.targetCard.style.top = `${this.mouse.y - 10}px`;
      let estadoTxt = 'Fresca (Pressione [F] para esfolar carne e couro)';
      if (hovered.entity.stage === 1) estadoTxt = 'Em decomposição (atrai insetos e vermes)';
      if (hovered.entity.stage === 2) estadoTxt = 'Ossada seca (consumida pelo tempo)';
      this.targetName.innerText = `Carcaça de Cervo`;
      this.targetDesc.innerText = `Estado: ${estadoTxt}.`;
    } else if (hovered && hovered.type === 'deer') {
      this.targetCard.style.display = 'block';
      this.targetCard.style.left = `${this.mouse.x + 18}px`;
      this.targetCard.style.top = `${this.mouse.y - 10}px`;
      
      let estadoTxt = 'Pastando calmamente';
      if (hovered.entity.state === 'foraging') estadoTxt = 'Farejando maçã no solo!';
      if (hovered.entity.state === 'alert') estadoTxt = 'ALERTA! Orelhas erguidas!';
      if (hovered.entity.state === 'fleeing') estadoTxt = 'FUGINDO EM PÂNICO!';

      this.targetName.innerText = `Cervo Silvestre (Herbívaro)`;
      this.targetDesc.innerText = `Estado: ${estadoTxt}. Animal arisco e sensível ao som de passos.`;
    } else if (hovered && hovered.type === 'tree') {
      this.targetCard.style.display = 'block';
      this.targetCard.style.left = `${this.mouse.x + 18}px`;
      this.targetCard.style.top = `${this.mouse.y - 10}px`;
      if (hovered.entity.isStump) {
        this.targetName.innerText = `Toco de Carvalho Enraizado`;
        this.targetDesc.innerText = (hovered.entity.mushrooms && hovered.entity.mushrooms > 0)
          ? 'Toco úmido com cogumelos silvestres brotando! Pressione F ou ataque para colher.'
          : 'Tronco cortado. Suas raízes profundas nutrem o solo florestal e a microfauna viva.';
      } else {
        const woodCount = (typeof hovered.entity.wood !== 'undefined') ? hovered.entity.wood : 5;
        const maxWood = hovered.entity.maxWood || 6;
        this.targetName.innerText = `Carvalho de Frutos [Lenha: ${woodCount}/${maxWood}]`;
        this.targetDesc.innerText = `Equipe o Machado [4] para extrair lenha. Pressione F perto do tronco para sacudir frutos!`;
      }
    } else {
      this.targetCard.style.display = 'none';
    }
  }

  handleInteraction() {
    // -1. Check near Campfire (Cooking Meat)
    for (const campfire of this.campfires) {
      const cdx = this.world ? this.world.wrapDelta(this.player.x - campfire.x) : (this.player.x - campfire.x);
      const dist = Math.hypot(cdx, this.player.y - campfire.y);
      if (dist < 75) {
        this.cookMeatAtCampfire(campfire);
        return;
      }
    }

    // 0. Check near Carcass (Skinning & Harvesting)
    for (let i = 0; i < this.carcasses.length; i++) {
      const c = this.carcasses[i];
      const cdx = this.world ? this.world.wrapDelta(this.player.x - c.x) : (this.player.x - c.x);
      const dist = Math.hypot(cdx, this.player.y - c.y);
      if (dist < 70) {
        if (c.stage === 0) {
          const mod = window.diceSystem.stats.sobrevivencia;
          window.diceSystem.rollD20('Esfolar Carcaça de Cervo', mod, 10, (res) => {
            if (res.isSuccess) {
              const meatGain = res.isCrit ? 4 : 2;
              this.inventory.addItem('meat', meatGain);
              this.inventory.addItem('deer_hide', 1);
              c.stage = 1;
              c.timer = 0;
              if (window.sounds) window.sounds.playHarvest();
              this.addLog(`🥩 Você esfolou a carcaça com maestria! (+${meatGain} Carnes de Caça, +1 Couro de Cervo guardados na Mochila)!`, 'action');
            } else {
              this.inventory.addItem('meat', 1);
              c.stage = 1;
              c.timer = 0;
              this.addLog(`🔪 Você retirou um corte de carne (+1 Carne guardada na Mochila), mas danificou o couro.`, 'tip');
            }
            this.updateHUD();
          });
          return;
        } else if (c.stage === 1) {
          this.addLog(`A carcaça está em avançado estado de decomposição. Apenas moscas habitam aqui.`, 'tip');
          return;
        } else {
          this.addLog(`Apenas ossos secos calcinados. A terra já absorveu os nutrientes.`, 'tip');
          return;
        }
      }
    }

    // 1. Check if near any Deer (Hunt / Tame attempt)
    for (let i = 0; i < this.deers.length; i++) {
      const d = this.deers[i];
      const ddx = this.world ? this.world.wrapDelta(this.player.x - d.x) : (this.player.x - d.x);
      const dist = Math.hypot(ddx, this.player.y - d.y);
      if (dist < 80) {
        // Roll D20 Dex/Hunting check!
        const mod = window.diceSystem.stats.destreza; // +3
        window.diceSystem.rollD20('Tentativa de Caça (Destreza)', mod, 12, (res) => {
          if (res.isSuccess) {
            // Hunt success!
            this.deers.splice(i, 1);
            this.inventory.addItem('meat', 2);
            this.inventory.addItem('deer_hide', 1);
            this.player.hunger = Math.min(100, this.player.hunger + 40);
            if (window.sounds) window.sounds.playCritSuccess();
            this.addLog(`🏹 SUCESSO NA CAÇA! Você abateu o cervo silenciosamente (+2 Carnes de Caça, +1 Couro, +40% Nutrição)!`, 'action');
            this.updateHUD();
          } else {
            // Deer panics and bolts away
            d.state = 'fleeing';
            d.fleeTimer = 5.0;
            if (window.sounds) window.sounds.playRustle();
            this.addLog(`💨 O cervo percebeu o ataque, saltou sobre os arbustos e disparou em fuga!`, 'warning');
          }
        });
        return;
      }
    }

    // 2. Check near fruit on the ground
    for (let i = this.fruitsOnGround.length - 1; i >= 0; i--) {
      const f = this.fruitsOnGround[i];
      const dist = Math.hypot(this.player.x - f.x, this.player.y - f.y);
      if (dist < 50) {
        this.fruitsOnGround.splice(i, 1);
        this.inventory.addItem('fruit', 1);
        if (window.sounds) window.sounds.playHarvest();
        this.addLog(`🧺 Você colheu 1 Fruto Silvestre do chão!`, 'action');
        this.updateHUD();
        return;
      }
    }

    // 3. Check near Tree trunk
    let nearestTree = null;
    let minDist = 110;
    for (const tree of this.trees) {
      const trunkX = tree.x + tree.trunkOffset.x;
      const trunkY = tree.y + tree.trunkOffset.y;
      const dx = this.world ? this.world.wrapDelta(this.player.x - trunkX) : (this.player.x - trunkX);
      const dist = Math.hypot(dx, this.player.y - trunkY);
      if (dist < minDist) {
        minDist = dist;
        nearestTree = tree;
      }
    }

    if (nearestTree) {
      if (nearestTree.isStump) {
        if (nearestTree.mushrooms && nearestTree.mushrooms > 0) {
          nearestTree.mushrooms = 0;
          this.inventory.addItem('fruit', 1);
          this.spawnDamageText(nearestTree.x, nearestTree.y + nearestTree.trunkOffset.y - 30, '+1 Cogumelo Silvestre 🍄', '#ffd43b', 15);
          if (window.sounds) window.sounds.playHarvest();
          this.addLog(`🍄 Você colheu um cogumelo fresco que brotou no toco do carvalho!`, 'action');
          this.updateHUD();
        } else {
          this.addLog(`🪵 Este toco de carvalho já teve todo o lenho principal extraído. Suas raízes continuam nutrindo o solo da floresta.`, 'tip');
        }
        return;
      }

      // If Axe is equipped: CHOP WOOD!
      if (this.player.equippedWeapon === 'axe') {
        this.chopTreeForWood(nearestTree);
        return;
      }

      if (nearestTree.fruits <= 0) {
        this.addLog(`Esta árvore está sem frutos no momento. A natureza precisa de tempo para florescer!`, 'tip');
        return;
      }

      if (window.sounds) window.sounds.playRustle();
      
      const mod = window.diceSystem.stats.sobrevivencia; // +4
      window.diceSystem.rollD20('Sacudir Árvore (Sobrevivência)', mod, 10, (res) => {
        if (res.isCrit) {
          const dropped = Math.min(3, nearestTree.fruits);
          nearestTree.fruits -= dropped;
          for (let k = 0; k < dropped; k++) {
            this.fruitsOnGround.push({
              x: nearestTree.x + (Math.random() - 0.5) * 60,
              y: nearestTree.y + nearestTree.trunkOffset.y + (Math.random() * 30 + 10),
              bounceY: 0
            });
          }
          this.addLog(`★ SUCESSO CRÍTICO! Vários frutos caíram perfeitamente no chão!`, 'action');
          this.createTreeLeafBurst(nearestTree.x, nearestTree.y - 120, 25);
        } else if (res.isFumble) {
          this.player.hp = Math.max(1, this.player.hp - 6);
          this.addLog(`☠ FALHA CRÍTICA! Um galho seco despencou e bateu na sua cabeça (-6 HP)!`, 'warning');
          this.updateHUD();
        } else if (res.isSuccess) {
          nearestTree.fruits--;
          this.fruitsOnGround.push({
            x: nearestTree.x + (Math.random() - 0.5) * 40,
            y: nearestTree.y + nearestTree.trunkOffset.y + 20,
            bounceY: 0
          });
          this.addLog(`🌾 Você sacudiu a árvore e 1 fruto maduro caiu!`, 'action');
          this.createTreeLeafBurst(nearestTree.x, nearestTree.y - 120, 10);
        } else {
          this.addLog(`Você empurrou o tronco, mas nenhum fruto se soltou. Tente novamente!`, 'tip');
        }
        this.updateHUD();
      });
    }
  }

  createTreeLeafBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 80,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 60,
        vy: Math.random() * 40 + 20,
        life: 1.5 + Math.random(),
        maxLife: 2.0,
        color: Math.random() > 0.4 ? '#40c057' : '#82c91e',
        size: Math.random() * 5 + 3
      });
    }
  }

  update(dt) {
    // 0. Astronomical Time & Calendar Update
    this.timeSystem.update(dt);
    this.updateCalendarHUD();
    if (this.saveSystem) this.saveSystem.update(dt);
    if (this.town) this.town.update(dt);

    // 0b. Procedural Chunk Manager Flora Update (Continuous Dynamic Streaming)
    if (this.world && this.world.chunks) {
      this.trees = this.world.chunks.getVisibleTrees(this.player.x, this.player.y);
    }

    // 0c. 2.5D Architect Roof Transparency Update (Interior Reveal)
    if (this.architect && this.architect.updateRoofTransparency) {
      this.architect.updateRoofTransparency(dt);
    }

    // 1. Fluid Mouse-Directional Movement & Smooth Physics
    // Running Sprint via Shift key
    const wantsRun = (this.keys['shift'] || this.keys['shiftleft'] || this.keys['shiftright']) && !this.player.isSitting;
    if (wantsRun && !this.player.isExhausted && this.player.stamina > 3 && this.player.isMoving) {
      this.player.isRunning = true;
      this.player.speed = 260; // Sprinting speed boost!
      this.player.stamina = Math.max(0, this.player.stamina - 15 * dt);
      if (this.player.stamina <= 0) {
        this.player.isExhausted = true;
        this.player.isRunning = false;
        this.spawnDamageText(this.player.x, this.player.y - 35, '💧 EXAUSTO!', '#ff6b6b', 16);
      }
      // Running dust puffs behind feet
      if (Math.random() < 0.35) {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 14,
          y: this.player.y + 4,
          vx: -this.player.vx * 0.2 + (Math.random() - 0.5) * 15,
          vy: -this.player.vy * 0.2 - Math.random() * 10,
          life: 0.3,
          maxLife: 0.3,
          color: 'rgba(170, 150, 120, 0.45)',
          size: Math.random() * 3 + 1.5
        });
      }
    } else {
      this.player.isRunning = false;
      this.player.speed = this.player.isExhausted ? 90 : 165;
    }
    if (this.speedMul > 1) { this.player.speed *= this.speedMul; this.player.stamina = Math.max(this.player.stamina, 50); this.player.isExhausted = false; }

    // Cancel sitting if player moves or commands movement
    if (this.player.isMoving && this.player.isSitting) {
      this.player.isSitting = false;
    }

    // Jump Physics Arc
    if (this.player.isJumping) {
      this.player.jumpProgress += dt / this.player.jumpDuration;
      this.player.jumpOffset = Math.sin(Math.min(1, this.player.jumpProgress) * Math.PI) * 22;
      if (this.player.jumpProgress >= 1) {
        this.player.isJumping = false;
        this.player.jumpProgress = 0;
        this.player.jumpOffset = 0;
      }
    }

    // Passive Stamina Recovery
    if (!this.player.isRunning) {
      let regenRate = 8; // base standing regen
      if (this.player.isSitting) regenRate = 22; // resting seated
      else if (this.player.isMoving) regenRate = 5; // walking gently

      this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + regenRate * dt);

      // Clear exhaustion once stamina recovers past 25
      if (this.player.isExhausted && this.player.stamina >= 25) {
        this.player.isExhausted = false;
        this.spawnDamageText(this.player.x, this.player.y - 30, '⚡ FÔLEGO RECUPERADO!', '#51cf66', 15);
        this.addLog('⚡ Você recuperou o fôlego!', 'action');
      }
    }

    let targetVx = 0;
    let targetVy = 0;

    // O alvo do mouse acompanha o boneco a cada frame (antes so mudava ao mover o mouse: o boneco andava ate um ponto fixo e a direcao 'pulava' com qualquer tremida da mao)
    if (this.mouse.x !== undefined && this.mouse.x !== null) {
      const mz = this.camera.zoom || 1.0, rawWX = (this.mouse.x - this.canvas.width / 2) / mz + this.camera.x;
      this.mouse.worldX = this.world ? this.world.wrapX(rawWX) : rawWX;
      this.mouse.worldY = (this.mouse.y - this.canvas.height / 2) / mz + this.camera.y + this.getLift();
    }

    // GOD MODE FAST FLIGHT (WASD or Right-Click 360° Flight at 650 px/s)
    if (this.isGodMode) {
      let kx = 0;
      let ky = 0;
      if (this.keys['w'] || this.keys['arrowup']) ky -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) ky += 1;
      if (this.keys['a'] || this.keys['arrowleft']) kx -= 1;
      if (this.keys['d'] || this.keys['arrowright']) kx += 1;

      if (kx !== 0 || ky !== 0) {
        const len = Math.hypot(kx, ky);
        targetVx = (kx / len) * this.player.speed;
        targetVy = (ky / len) * this.player.speed;
        this.player.moveTarget = null;
      } else if (this.mouse.isRightDown) {
        const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - this.player.x) : (this.mouse.worldX - this.player.x);
        const dy = this.mouse.worldY - this.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 18) {
          targetVx = (dx / dist) * this.player.speed;
          targetVy = (dy / dist) * this.player.speed;
        }
        this.player.moveTarget = null;
      }
    }
    // Right-Click Hold-to-Walk: continuous fluid 360° cursor steering
    else if (this.mouse.isRightDown) {
      const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - this.player.x) : (this.mouse.worldX - this.player.x);
      const dy = this.mouse.worldY - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 18) {
        targetVx = (dx / dist) * this.player.speed;
        targetVy = (dy / dist) * this.player.speed;
      } else {
        targetVx = 0;
        targetVy = 0;
      }
      this.player.moveTarget = null; // Direct hold-steering overrides single waypoint
    }
    // Direct Mouse Walk via 'W' key (point mouse cursor and hold W!)
    else if (this.keys['w'] || this.keys['arrowup']) {
      const dx = this.world ? this.world.wrapDelta(this.mouse.worldX - this.player.x) : (this.mouse.worldX - this.player.x);
      const dy = this.mouse.worldY - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 16) {
        targetVx = (dx / dist) * this.player.speed;
        targetVy = (dy / dist) * this.player.speed;
        this.player.moveTarget = null; // direct keyboard override
      }
    }
    // Click-to-Move waypoint navigation (single right click)
    else if (this.player.moveTarget) {
      const dx = this.world ? this.world.wrapDelta(this.player.moveTarget.x - this.player.x) : (this.player.moveTarget.x - this.player.x);
      const dy = this.player.moveTarget.y - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 10) {
        targetVx = (dx / dist) * this.player.speed;
        targetVy = (dy / dist) * this.player.speed;
      } else {
        this.player.moveTarget = null;
        targetVx = 0;
        targetVy = 0;
      }
    }

    // Smooth Inertia Acceleration & Deceleration (No more rigid stops!)
    const accel = this.isGodMode ? 22 : 13.5;
    this.player.vx += (targetVx - this.player.vx) * Math.min(1, accel * dt);
    this.player.vy += (targetVy - this.player.vy) * Math.min(1, accel * dt);

    const currentSpeed = Math.hypot(this.player.vx, this.player.vy);
    if (currentSpeed > 7) {
      this.player.isMoving = true;
      const moveAngle = Math.atan2(this.player.vy, this.player.vx);
      this.updatePlayerDirectionFromAngle(moveAngle);

      // Animacao presa a DISTANCIA andada (nao ao tempo): o pe nao desliza no chao e o passo acompanha a velocidade real.
      // Um ciclo = 4 quadros = 2 passos. Contatos do pe caem nos quadros 0 e 2, onde o "quique" e minimo.
      this.player.walkDistance += currentSpeed * dt;
      const cyc = this.player.isRunning ? 118 : 84;
      this.player.stridePhase = ((this.player.walkDistance / cyc) % 1 + 1) % 1;
      this.player.frameIndex = Math.floor(this.player.stridePhase * 4) % 4;
    } else {
      this.player.isMoving = false;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.frameIndex = 0; // neutral idle stance
      this.player.stridePhase = 0;
    }

    // Collision with Trees (Bypassed in God Mode Noclip)
    let currentX = this.player.x + this.player.vx * dt;
    let currentY = this.player.y + this.player.vy * dt;
    const playerFootRadius = 13;

    if (!this.isGodMode) {
      for (let pass = 0; pass < 2; pass++) {
        for (const tree of this.trees) {
          const trunkX = tree.x + tree.trunkOffset.x;
          const trunkY = tree.y + tree.trunkOffset.y;
          const R = playerFootRadius + tree.trunkOffset.radius; // combined collision circle

          const dx = this.world ? this.world.wrapDelta(currentX - trunkX) : (currentX - trunkX);
          const dy = currentY - trunkY;
          const dist = Math.hypot(dx, dy);

          if (dist < R) {
            // Inside collision circle: Push player out to circumference
            let nx = dist > 0 ? (dx / dist) : 0;
            let ny = dist > 0 ? (dy / dist) : 1;

            // Push position out to perimeter
            currentX += nx * (R - dist);
            currentY += ny * (R - dist);

            // Tangent vector along circular perimeter
            const tx = -ny;
            const ty = nx;

            // Project current velocity onto tangent
            let tangentVel = this.player.vx * tx + this.player.vy * ty;

            // If hitting head-on (dead-center collision with tree), auto-steer smoothly around it
            if (Math.abs(tangentVel) < 30) {
              const targetX = this.player.moveTarget ? this.player.moveTarget.x : this.mouse.worldX;
              const targetY = this.player.moveTarget ? this.player.moveTarget.y : this.mouse.worldY;
              const tdx = this.world ? this.world.wrapDelta(targetX - trunkX) : (targetX - trunkX);
              const cross = nx * (targetY - trunkY) - ny * tdx;
              const steerDir = cross >= 0 ? 1 : -1;
              tangentVel = steerDir * this.player.speed * 0.85;
            }

            // Re-orient velocity along tangent so the player effortlessly glides around the curve!
            this.player.vx = tx * tangentVel;
            this.player.vy = ty * tangentVel;
          }
        }
      }
    }

    // Collision with Solid Architect Walls (Bypassed in God Mode Noclip)
    if (!this.isGodMode && this.architect && this.architect.isSolidAt) {
      // Check full step
      if (this.architect.isSolidAt(currentX, currentY, playerFootRadius, this.player.z || 0)) {
        // Try horizontal slide (X axis only)
        if (!this.architect.isSolidAt(currentX, this.player.y, playerFootRadius, this.player.z || 0)) {
          currentY = this.player.y;
          this.player.vy = 0;
        }
        // Try vertical slide (Y axis only)
        else if (!this.architect.isSolidAt(this.player.x, currentY, playerFootRadius, this.player.z || 0)) {
          currentX = this.player.x;
          this.player.vx = 0;
        }
        // Both blocked: stop against wall corner
        else {
          currentX = this.player.x;
          currentY = this.player.y;
          this.player.vx = 0;
          this.player.vy = 0;
        }
      }
    }

    // Andares: altura do chao sob o player (escadas e pisos de cima); null = borda/corpo da escada, bloqueia
    if (!this.isGodMode && this.architect && this.architect.elevationAt) {
      const z0 = this.player.z || 0;
      let nz = this.architect.elevationAt(currentX, currentY, z0);
      if (nz === null) {
        const nzx = this.architect.elevationAt(currentX, this.player.y, z0);
        if (nzx !== null) { currentY = this.player.y; this.player.vy = 0; nz = nzx; }
        else {
          const nzy = this.architect.elevationAt(this.player.x, currentY, z0);
          if (nzy !== null) { currentX = this.player.x; this.player.vx = 0; nz = nzy; }
          else { currentX = this.player.x; currentY = this.player.y; this.player.vx = 0; this.player.vy = 0; nz = z0; }
        }
      }
      this.player.z = nz;
    }

    // Water Barrier & Shoreline Collision (Bypassed in God Mode Noclip)
    if (!this.isGodMode && this.world && this.world.getTerrainAt) {
      const terr = this.world.getTerrainAt(currentX, currentY);
      if (terr && terr.isWater) {
        // se o jogador ja esta dentro d'agua (save antigo / mapa novo), leva para a terra firme mais proxima em vez de prender
        const cur = this.world.getTerrainAt(this.player.x, this.player.y);
        if (cur && cur.isWater) {
          let found = null;
          for (let r = 512; r <= 120000 && !found; r *= 1.5) {
            for (let a = 0; a < 16 && !found; a++) {
              const px = this.world.wrapX(this.player.x + Math.cos(a * Math.PI / 8) * r), py = this.world.clampY(this.player.y + Math.sin(a * Math.PI / 8) * r);
              const t2 = this.world.getTerrainAt(px, py);
              if (!t2.isWater && t2.type !== 'shore') found = { x: px, y: py };
            }
          }
          if (found) { this.player.x = found.x; this.player.y = found.y; currentX = found.x; currentY = found.y; this.addLog('🌊 Você foi levado de volta à praia mais próxima.', 'info'); }
        }
        this.player.vx = 0;
        this.player.vy = 0;
        currentX = this.player.x;
        currentY = this.player.y;
        if (!this._lastWaterMsg || performance.now() - this._lastWaterMsg > 3000) {
          this._lastWaterMsg = performance.now();
          this.spawnDamageText(this.player.x, this.player.y - 32, `🌊 ${terr.name.toUpperCase()}`, '#74c0fc', 14);
          this.addLog(`🌊 [ÁGUAS PROFUNDAS] As águas de ${terr.name} impedem a travessia a pé! Construa uma jangada ou siga pelas praias.`, 'warning');
        }
      }
    }

    this.player.x = this.world ? this.world.wrapX(currentX) : currentX;
    this.player.y = this.world ? this.world.clampY(currentY) : currentY;

    // Smooth Camera follow with Seamless Toroidal Wrap
    const camDx = this.world ? this.world.wrapDelta(this.player.x - this.camera.x) : (this.player.x - this.camera.x);
    // Camera TRAVADA no boneco (rolagem 1:1 com o chao = sem tremida/robo); so teleportes e a altura de andar (escadas) suavizam
    this.camera.x = this.player.x;
    const liftNow = this.getLift();
    if (this._camLift === undefined || Math.abs(this._camLift - liftNow) > 400) this._camLift = liftNow;
    this._camLift += (liftNow - this._camLift) * (1 - Math.pow(0.0005, Math.min(dt, 0.1)));
    this.camera.y = this.player.y - this._camLift;

    // 2. BALANCED DEER ARTIFICIAL INTELLIGENCE & SENSORY SYSTEM
    for (const deer of this.deers) {
      const pdx = this.world ? this.world.wrapDelta(this.player.x - deer.x) : (this.player.x - deer.x);
      const distToPlayer = Math.hypot(pdx, this.player.y - deer.y);

      // Check nearest Wolf Threat (Keen Ears & Scent)
      let nearestThreat = null;
      let minThreatDist = 220; // 220px scent radius

      for (const w of this.wolves) {
        if (w.state === 'satiated') continue; // Don't fear resting/full wolves
        const wdx = this.world ? this.world.wrapDelta(w.x - deer.x) : (w.x - deer.x);
        const dist = Math.hypot(wdx, w.y - deer.y);
        if (dist < minThreatDist) {
          minThreatDist = dist;
          nearestThreat = w;
        }
      }

      // Also check player if player is sprinting nearby (< 135px) and not wielding fire
      if (!nearestThreat && distToPlayer < 135) {
        nearestThreat = this.player;
      }

      if (nearestThreat) {
        if (deer.state !== 'fleeing' && deer.state !== 'alert') {
          deer.state = 'alert';
          deer.alertTimer = 0.40; // perk up ears
          deer.threatSource = nearestThreat;
          if (window.sounds) window.sounds.playRustle();
        }
      }

      // Handle Alert state
      if (deer.state === 'alert') {
        deer.alertTimer -= dt;
        if (deer.alertTimer <= 0) {
          deer.state = 'fleeing';
          deer.fleeTimer = 5.0; // sprint away
        }
      }
      // Handle Fleeing state (Agile High-Speed Sprint: 230 px/s)
      else if (deer.state === 'fleeing') {
        deer.fleeTimer -= dt;
        const threat = deer.threatSource || this.player;
        const dx = this.world ? this.world.wrapDelta(deer.x - threat.x) : (deer.x - threat.x);
        const dy = deer.y - threat.y;
        const dist = Math.hypot(dx, dy) || 1;

        deer.x += (dx / dist) * deer.fleeSpeed * dt;
        deer.y += (dy / dist) * deer.fleeSpeed * dt;
        if (this.world) deer.x = this.world.wrapX(deer.x);

        // Smooth direction with 360 degree angle
        const moveAngle = Math.atan2(dy, dx);
        const deg = moveAngle * 180 / Math.PI;
        if (deg >= -45 && deg <= 45) deer.direction = 'right';
        else if (deg > 45 && deg <= 135) deer.direction = 'down';
        else if (deg < -135 || deg > 135) deer.direction = 'left';
        else deer.direction = 'up';

        // Fast gallop animation
        deer.animTimer += dt;
        if (deer.animTimer >= 0.08) {
          deer.animTimer = 0;
          deer.frameIndex = (deer.frameIndex + 1) % 4;
        }

        if (deer.fleeTimer <= 0) {
          deer.state = 'wandering';
          deer.timer = 4.0;
          deer.threatSource = null;
          deer.fleeSpeed = 230;
        }
      }
      // Handle Foraging (Farejando Fruto Caído no Solo)
      else if (deer.state === 'foraging') {
        if (!deer.targetFruit || !this.fruitsOnGround.includes(deer.targetFruit)) {
          deer.targetFruit = null;
          deer.state = 'wandering';
        } else {
          const fdx = this.world ? this.world.wrapDelta(deer.targetFruit.x - deer.x) : (deer.targetFruit.x - deer.x);
          const fdy = deer.targetFruit.y - deer.y;
          const fdist = Math.hypot(fdx, fdy);

          if (fdist < 18) {
            const idx = this.fruitsOnGround.indexOf(deer.targetFruit);
            if (idx !== -1) this.fruitsOnGround.splice(idx, 1);
            deer.targetFruit = null;
            deer.state = 'grazing';
            deer.timer = 4.0;
            if (window.sounds) window.sounds.playHarvest();
            this.addLog(`🦌 Um cervo silvestre encontrou um fruto caído e o comeu tranquilamente!`, 'system');
            this.updateHUD();
          } else {
            deer.x += (fdx / fdist) * deer.speed * dt;
            deer.y += (fdy / fdist) * deer.speed * dt;
            if (this.world) deer.x = this.world.wrapX(deer.x);
            
            const absFdx = Math.abs(fdx);
            const absFdy = Math.abs(fdy);
            if (absFdx > absFdy * 1.2) deer.direction = fdx > 0 ? 'right' : 'left';
            else deer.direction = fdy > 0 ? 'down' : 'up';

            deer.animTimer += dt;
            if (deer.animTimer >= deer.animSpeed) {
              deer.animTimer = 0;
              deer.frameIndex = (deer.frameIndex + 1) % 4;
            }
          }
        }
      }
      // Peaceful Wandering or Grazing
      else {
        let nearestFruit = null;
        let minFruitDist = 280;
        for (const f of this.fruitsOnGround) {
          const fdx = this.world ? this.world.wrapDelta(f.x - deer.x) : (f.x - deer.x);
          const d = Math.hypot(fdx, f.y - deer.y);
          if (d < minFruitDist) {
            minFruitDist = d;
            nearestFruit = f;
          }
        }

        if (nearestFruit) {
          deer.state = 'foraging';
          deer.targetFruit = nearestFruit;
        } else {
          deer.timer -= dt;
          if (deer.timer <= 0) {
            if (deer.state === 'grazing') {
              deer.state = 'wandering';
              deer.timer = Math.random() * 3 + 2;
              const dirs = ['down', 'up', 'left', 'right'];
              deer.direction = dirs[Math.floor(Math.random() * dirs.length)];
            } else {
              deer.state = 'grazing';
              deer.timer = Math.random() * 4 + 3;
            }
          }

          if (deer.state === 'wandering') {
            let wx = 0, wy = 0;
            if (deer.direction === 'down') wy = 1;
            else if (deer.direction === 'up') wy = -1;
            else if (deer.direction === 'left') wx = -1;
            else if (deer.direction === 'right') wx = 1;

            deer.x += wx * deer.speed * dt;
            deer.y += wy * deer.speed * dt;
            if (this.world) deer.x = this.world.wrapX(deer.x);

            deer.animTimer += dt;
            if (deer.animTimer >= deer.animSpeed) {
              deer.animTimer = 0;
              deer.frameIndex = (deer.frameIndex + 1) % 4;
            }
          } else if (deer.state === 'grazing') {
            deer.animTimer += dt;
            if (deer.animTimer >= 0.25) {
              deer.animTimer = 0;
              deer.frameIndex = (deer.frameIndex + 1) % 4;
            }
          }
        }
      }
    }

    // 3. Tree Ecology: Fruit growth timers & trunk shake decay
    for (const tree of this.trees) {
      if (tree.shake && tree.shake > 0) {
        tree.shake = Math.max(0, tree.shake - dt * 3.5);
      }
      if (!tree.isStump) {
        tree.growthTimer += dt;
        if (tree.growthTimer > 25) {
          tree.growthTimer = 0;
          if (tree.fruits < tree.maxFruits) {
            tree.fruits++;
            this.updateHUD();
          }
        }
      }
    }

    // Auto-pick fruits if player walks over them
    for (let i = this.fruitsOnGround.length - 1; i >= 0; i--) {
      const f = this.fruitsOnGround[i];
      const fdx = this.world ? this.world.wrapDelta(this.player.x - f.x) : (this.player.x - f.x);
      if (Math.hypot(fdx, this.player.y - f.y) < 22) {
        this.fruitsOnGround.splice(i, 1);
        this.inventory.addItem('fruit', 1);
        if (window.sounds) window.sounds.playHarvest();
        this.addLog(`🍎 Fruto colhido automaticamente do solo!`, 'action');
        this.updateHUD();
      }
    }

    // Update Player Attack Timer & Combo Decay
    if (this.player.isAttacking) {
      this.player.attackTimer -= dt;
      if (this.player.attackTimer <= 0) {
        this.player.isAttacking = false;
      }
    }
    if (this.player.comboTimer > 0) {
      this.player.comboTimer -= dt;
      if (this.player.comboTimer <= 0) {
        this.player.comboHits = 0;
      }
    }

    // 3b. Campfires Update (Burn decay, ambient embers, cozy healing)
    for (let i = this.campfires.length - 1; i >= 0; i--) {
      const c = this.campfires[i];
      c.life -= dt;

      // Ambient rising sparks and embers
      if (Math.random() < 0.35) {
        this.particles.push({
          x: c.x + (Math.random() - 0.5) * 16,
          y: c.y - 6,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 45 - 20,
          life: 1.1,
          maxLife: 1.1,
          color: Math.random() > 0.4 ? '#ffa94d' : '#ffe066',
          size: Math.random() * 2.5 + 1
        });
      }

      // Cozy rest & healing for player near campfire
      const cdx = this.world ? this.world.wrapDelta(this.player.x - c.x) : (this.player.x - c.x);
      const distToPlayer = Math.hypot(cdx, this.player.y - c.y);
      if (distToPlayer < 135) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + (this.player.isSitting ? 4.5 : 2.5) * dt);
        this.player.mana = Math.min(this.player.maxMana, this.player.mana + (this.player.isSitting ? 5.0 : 3.0) * dt);
        const campStamina = (this.player.isSitting ? 42 : 26) * dt;
        this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + campStamina);

        if (this.player.isExhausted && this.player.stamina >= 25) {
          this.player.isExhausted = false;
          this.spawnDamageText(this.player.x, this.player.y - 32, '⚡ FÔLEGO RECUPERADO!', '#51cf66', 15);
        }
      }

      if (c.life <= 0) {
        this.campfires.splice(i, 1);
        this.addLog(`💨 As brasas da fogueira se extinguiram.`, 'tip');
      }
    }

    // Strength Buff Timer Update
    if (this.player.strengthBuffTimer > 0) {
      this.player.strengthBuffTimer -= dt;
      if (this.player.strengthBuffTimer <= 0) {
        this.addLog(`O efeito vigoroso da carne grelhada cessou.`, 'tip');
      }
    }

    // 4. BALANCED WOLF PACK ARTIFICIAL INTELLIGENCE & HUNTING LOGIC
    for (const wolf of this.wolves) {
      const pdx = this.world ? this.world.wrapDelta(this.player.x - wolf.x) : (this.player.x - wolf.x);
      const distToPlayer = Math.hypot(pdx, this.player.y - wolf.y);
      const isPlayerFiery = this.player.torchLit || this.player.equippedWeapon === 'fire_sword';

      // Check nearest Campfire
      let nearestCampfire = null;
      let minCampDist = 200;
      for (const cf of this.campfires) {
        const cdx = this.world ? this.world.wrapDelta(wolf.x - cf.x) : (wolf.x - cf.x);
        const d = Math.hypot(cdx, wolf.y - cf.y);
        if (d < minCampDist) {
          minCampDist = d;
          nearestCampfire = cf;
        }
      }

      // 4a. Fire Fear Reaction (Torches, Fire Sword & Campfires!)
      if (nearestCampfire) {
        const dx = this.world ? this.world.wrapDelta(wolf.x - nearestCampfire.x) : (wolf.x - nearestCampfire.x);
        const dy = wolf.y - nearestCampfire.y;
        const dist = Math.hypot(dx, dy) || 1;
        wolf.x += (dx / dist) * 125 * dt;
        wolf.y += (dy / dist) * 125 * dt;
        if (this.world) wolf.x = this.world.wrapX(wolf.x);
        wolf.direction = dx > 0 ? 'right' : 'left';
        wolf.state = 'patrol';
      }
      else if (isPlayerFiery && distToPlayer < 145) {
        const dx = this.world ? this.world.wrapDelta(wolf.x - this.player.x) : (wolf.x - this.player.x);
        const dy = wolf.y - this.player.y;
        const dist = Math.hypot(dx, dy) || 1;
        wolf.x += (dx / dist) * 110 * dt;
        wolf.y += (dy / dist) * 110 * dt;
        if (this.world) wolf.x = this.world.wrapX(wolf.x);
        wolf.direction = dx > 0 ? 'right' : 'left';
        wolf.state = 'patrol';
      }
      // 4b. Nocturnal Aggression against defenseless player
      else if (!isPlayerFiery && this.timeSystem.virtualDate.getHours() >= 19 && distToPlayer < 150) {
        const dx = this.world ? this.world.wrapDelta(this.player.x - wolf.x) : (this.player.x - wolf.x);
        const dy = this.player.y - wolf.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (dist > 35) {
          wolf.x += (dx / dist) * wolf.chaseSpeed * dt;
          wolf.y += (dy / dist) * wolf.chaseSpeed * dt;
          if (this.world) wolf.x = this.world.wrapX(wolf.x);
          wolf.direction = dx > 0 ? 'right' : 'left';
          wolf.state = 'attack';
        } else {
          this.player.hp = Math.max(0, this.player.hp - 10);
          if (window.sounds) window.sounds.playWolfBite();
          this.addLog(`🐺 O lobo desferiu uma mordida violenta (-10 HP)! Acenda a tocha com [ 5 ]!`, 'warning');
          this.updateHUD();
          wolf.x -= (dx / dist) * 50;
          if (this.world) wolf.x = this.world.wrapX(wolf.x);
        }
      }
      // 4c. Predator Hunting Deer with Contested Reflexes & Stamina Limits
      else {
        // If wolf is satiated (full & resting after eating), it relaxes and won't hunt!
        if (wolf.state === 'satiated') {
          wolf.satiatedTimer -= dt;
          if (wolf.satiatedTimer <= 0) {
            wolf.state = 'patrol';
            wolf.timer = 4.0;
          }
          continue;
        }

        // If wolf is exhausted from a failed chase, it catches its breath
        if (wolf.state === 'exhausted') {
          wolf.exhaustedTimer -= dt;
          if (wolf.exhaustedTimer <= 0) {
            wolf.state = 'patrol';
            wolf.timer = 4.0;
          }
          continue;
        }

        let nearestDeer = null;
        let minDeerDist = 220; // realistic scent range
        for (const d of this.deers) {
          const ddx = this.world ? this.world.wrapDelta(d.x - wolf.x) : (d.x - wolf.x);
          const dist = Math.hypot(ddx, d.y - wolf.y);
          if (dist < minDeerDist) {
            minDeerDist = dist;
            nearestDeer = d;
          }
        }

        if (nearestDeer) {
          if (wolf.state !== 'hunting') {
            wolf.state = 'hunting';
            wolf.chaseTimer = 4.0; // Wolf can only sprint for 4 seconds!
          }

          wolf.chaseTimer -= dt;
          if (wolf.chaseTimer <= 0) {
            // Deer outran the wolf!
            wolf.state = 'exhausted';
            wolf.exhaustedTimer = 6.0;
            this.addLog(`🐺 O cervo disparou entre as árvores e despistou o lobo exausto!`, 'tip');
            continue;
          }

          const dx = this.world ? this.world.wrapDelta(nearestDeer.x - wolf.x) : (nearestDeer.x - wolf.x);
          const dy = nearestDeer.y - wolf.y;
          const dist = Math.hypot(dx, dy) || 1;

          if (dist > 35) {
            wolf.x += (dx / dist) * wolf.chaseSpeed * dt;
            wolf.y += (dy / dist) * wolf.chaseSpeed * dt;
            if (this.world) wolf.x = this.world.wrapX(wolf.x);
            wolf.direction = dx > 0 ? 'right' : 'left';

            wolf.animTimer += dt;
            if (wolf.animTimer >= 0.12) {
              wolf.animTimer = 0;
              wolf.frameIndex = (wolf.frameIndex + 1) % 4;
            }
          } else {
            // Contested Hunt Roll: 70% chance deer dodges with an acrobatic leap!
            const wolfPounceRoll = Math.floor(Math.random() * 20) + 1; // D20
            if (wolfPounceRoll >= 15) {
              // Ambush success!
              const deerIdx = this.deers.indexOf(nearestDeer);
              if (deerIdx !== -1) {
                this.deers.splice(deerIdx, 1);
                this.spawnCarcass(nearestDeer.x, nearestDeer.y);
                if (window.sounds) {
                  window.sounds.playWolfBite();
                  window.sounds.playWolfHowl();
                }
                this.addLog(`🐺 Um lobo predador saltou sobre um cervo e o abateu! Carcaça fresca no solo.`, 'system');
                wolf.state = 'satiated';
                wolf.satiatedTimer = 50.0; // Satiated for 50 seconds (leaves other deers alone!)
                this.updateHUD();
              }
            } else {
              // Deer DODGED and sprinted away!
              nearestDeer.state = 'fleeing';
              nearestDeer.fleeTimer = 6.0;
              nearestDeer.fleeSpeed = 265; // adrenaline boost!
              wolf.state = 'exhausted';
              wolf.exhaustedTimer = 5.0;
              if (window.sounds) window.sounds.playRustle();
              this.addLog(`🦌 O cervo saltou com agilidade acrobática e se esquivou do bote do lobo!`, 'action');
            }
          }
        } else {
          // Peaceful patrol
          wolf.timer -= dt;
          if (wolf.timer <= 0) {
            wolf.timer = Math.random() * 4 + 3;
            const dirs = ['down', 'up', 'left', 'right'];
            wolf.direction = dirs[Math.floor(Math.random() * dirs.length)];
          }

          let wx = 0, wy = 0;
          if (wolf.direction === 'down') wy = 1;
          else if (wolf.direction === 'up') wy = -1;
          else if (wolf.direction === 'left') wx = -1;
          else if (wolf.direction === 'right') wx = 1;

          wolf.x += wx * wolf.speed * dt;
          wolf.y += wy * wolf.speed * dt;
          if (this.world) wolf.x = this.world.wrapX(wolf.x);

          wolf.animTimer += dt;
          if (wolf.animTimer >= 0.16) {
            wolf.animTimer = 0;
            wolf.frameIndex = (wolf.frameIndex + 1) % 4;
          }
        }
      }
    }

    // 5. WILD HERD REPLENISHMENT (Perpetual Forest Equilibrium)
    this.deerSpawnTimer = (this.deerSpawnTimer || 0) + dt;
    if (this.deerSpawnTimer > 18 && this.deers.length < 6) {
      this.deerSpawnTimer = 0;
      this.spawnMigratingDeer();
    }

    // 5. CARCASS DECAY & DECOMPOSITION
    for (let i = this.carcasses.length - 1; i >= 0; i--) {
      const c = this.carcasses[i];
      c.timer += dt;
      if (c.stage === 0 && c.timer > 60) {
        c.stage = 1; // decay into exposed ribcage
        this.addLog(`🦴 Uma carcaça na floresta começou a entrar em decomposição.`, 'tip');
      } else if (c.stage === 1 && c.timer > 150) {
        c.stage = 2; // dried skeleton bones
      } else if (c.stage === 2 && c.timer > 300) {
        this.carcasses.splice(i, 1); // bones vanish into soil
        this.updateHUD();
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    this.updateInteractPrompt();
  }

  updateInteractPrompt() {
    let showPrompt = false;
    let text = '';

    // Check near Campfire
    for (const campfire of this.campfires) {
      const cdx = this.world ? this.world.wrapDelta(this.player.x - campfire.x) : (this.player.x - campfire.x);
      if (Math.hypot(cdx, this.player.y - campfire.y) < 70) {
        showPrompt = true;
        const rawMeat = this.inventory.slots.find(s => s && s.id === 'meat');
        if (rawMeat) {
          text = 'Assar Carne de Caça na Brasa (F)';
        } else {
          text = `Fogueira Aconchegante (${Math.round(campfire.life)}s) [Descanso]`;
        }
        break;
      }
    }

    // Check near Carcass
    if (!showPrompt) {
      for (const c of this.carcasses) {
        const cdx = this.world ? this.world.wrapDelta(this.player.x - c.x) : (this.player.x - c.x);
        if (Math.hypot(cdx, this.player.y - c.y) < 65) {
          showPrompt = true;
          if (c.stage === 0) text = 'Esfolar Carcaça Fresca (Carne & Couro)';
          else if (c.stage === 1) text = 'Carcaça em Decomposição';
          else text = 'Esqueleto de Ossos Secos';
          break;
        }
      }
    }

    // Check near Deer
    if (!showPrompt) {
      for (const d of this.deers) {
        const ddx = this.world ? this.world.wrapDelta(this.player.x - d.x) : (this.player.x - d.x);
        if (Math.hypot(ddx, this.player.y - d.y) < 75) {
          showPrompt = true;
          text = 'Caçar Cervo (D20)';
          break;
        }
      }
    }

    // Check near fruit on ground
    if (!showPrompt) {
      for (const f of this.fruitsOnGround) {
        const fdx = this.world ? this.world.wrapDelta(this.player.x - f.x) : (this.player.x - f.x);
        if (Math.hypot(fdx, this.player.y - f.y) < 50) {
          showPrompt = true;
          text = 'Pegar Fruto';
          break;
        }
      }
    }

    // Check near tree trunk
    if (!showPrompt) {
      for (const tree of this.trees) {
        const trunkX = tree.x + tree.trunkOffset.x;
        const trunkY = tree.y + tree.trunkOffset.y;
        const dx = this.world ? this.world.wrapDelta(this.player.x - trunkX) : (this.player.x - trunkX);
        if (Math.hypot(dx, this.player.y - trunkY) < 95) {
          showPrompt = true;
          if (tree.isStump) {
            if (tree.mushrooms && tree.mushrooms > 0) {
              text = 'Colher Cogumelo Silvestre [F]';
            } else {
              text = 'Toco de Carvalho (Lenho Esgotado)';
            }
          } else if (this.player.equippedWeapon === 'axe') {
            const wCount = (typeof tree.wood !== 'undefined') ? tree.wood : 5;
            const wMax = tree.maxWood || 6;
            text = `Cortar Lenha [${wCount}/${wMax}] [F / Clique]`;
          } else {
            text = tree.fruits > 0 ? `Sacudir Árvore (${tree.fruits}🍎)` : 'Árvore em Repouso';
          }
          break;
        }
      }
    }

    if (showPrompt) {
      this.interactPrompt.style.display = 'flex';
      const pdx = this.world ? this.world.wrapDelta(this.player.x - this.camera.x) : (this.player.x - this.camera.x);
      const screenX = pdx + this.canvas.width / 2;
      const screenY = this.player.y - this.camera.y + this.canvas.height / 2 - 50;
      this.interactPrompt.style.left = `${screenX}px`;
      this.interactPrompt.style.top = `${screenY}px`;
      this.interactText.innerText = text;
    } else {
      this.interactPrompt.style.display = 'none';
    }

    // 8. Radar Minimap Real-Time Update
    if (this.minimap) {
      this.minimap.update();
    }
  }

  // Desenha com a camera em pixels inteiros: todas as camadas (chao, pisos, paredes, boneco) arredondam do mesmo jeito -> sem tremida/cintilacao ao andar
  render() {
    const cam = this.camera, cx0 = cam.x, cy0 = cam.y;
    cam.x = Math.round(cx0); cam.y = Math.round(cy0);
    try { this._renderScene(); } finally { cam.x = cx0; cam.y = cy0; }
  }

  _renderScene() {
    const ctx = this.ctx;
    this._ph = this._ph || {};
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const screenCenterX = this.canvas.width / 2;
    const screenCenterY = this.canvas.height / 2;
    const zoom = this.camera.zoom || 1.0;

    // Apply Camera Zoom Scale (Around Viewport Center)
    ctx.save();
    ctx.translate(screenCenterX, screenCenterY);
    ctx.scale(zoom, zoom);
    ctx.translate(-screenCenterX, -screenCenterY);

    // 1. Chao: terreno continuo (mar, praia, planicie, floresta, deserto, colinas, neve) em blocos suaves em cache
    if (this.world && this.world.getTerrainAt && window.GroundRenderer) {
      if (!this.ground) this.ground = new GroundRenderer(this);
      const _t0 = performance.now();
      if (!this.dbg || this.dbg.ground !== false) this.ground.draw(ctx, this.camera, this.canvas.width, this.canvas.height, zoom, screenCenterX, screenCenterY, performance.now());
      this._ph.g = performance.now() - _t0;
    } else {
      ctx.fillStyle = '#2b4421';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 1c. Draw Architect Village Roads (Cobblestone / Dirt Trail)
    const _tf = performance.now();
    if (this.architect && (!this.dbg || this.dbg.floors !== false)) {
      this.architect.drawRoads(ctx, screenCenterX, screenCenterY);
    }
    this._ph.f = performance.now() - _tf;

    // 1b. Ground Click-to-Move Destination Waypoint Marker
    if (this.player.moveTarget) {
      const tdx = this.world ? this.world.wrapDelta(this.player.moveTarget.x - this.camera.x) : (this.player.moveTarget.x - this.camera.x);
      const tx = Math.round(tdx + screenCenterX);
      const ty = Math.round(this.player.moveTarget.y - this.camera.y + screenCenterY);
      const pulse = Math.sin(performance.now() * 0.009) * 2 + 10;
      
      ctx.save();
      // Outer pulsing ring
      ctx.strokeStyle = 'rgba(77, 171, 247, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(tx, ty, pulse, pulse * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glowing core
      ctx.fillStyle = '#74c0fc';
      ctx.beginPath();
      ctx.ellipse(tx, ty, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Y-SORTING RENDER LIST (True 2.5D Tibia Depth Sorting)
    const renderList = [];
    const relX = (wx) => (this.world ? this.world.wrapDelta(wx - this.camera.x) : (wx - this.camera.x)); // F3: X relativo a camera p/ DepthSort

    // Player
    renderList.push({
      type: 'player',
      x: relX(this.player.x),
      y: (this.architect && this.architect.playerSortY && this.architect.playerSortY()) || this.player.y,
      draw: () => this.drawPlayer(ctx, screenCenterX, screenCenterY)
    });

    // Fruits on ground
    for (const f of this.fruitsOnGround) {
      renderList.push({
        type: 'fruit',
        x: relX(f.x),
        y: f.y,
        draw: () => this.drawFruit(ctx, f, screenCenterX, screenCenterY)
      });
    }

    // Carcasses on ground
    for (const c of this.carcasses) {
      renderList.push({
        type: 'carcass',
        x: relX(c.x),
        y: c.y,
        draw: () => this.drawCarcass(ctx, c, screenCenterX, screenCenterY)
      });
    }

    // Campfires on ground
    for (const c of this.campfires) {
      renderList.push({
        type: 'campfire',
        x: relX(c.x),
        y: c.y,
        draw: () => this.drawCampfire(ctx, c, screenCenterX, screenCenterY)
      });
    }

    // Trees
    for (const tree of this.trees) {
      renderList.push({
        type: 'tree',
        x: relX(tree.x),
        y: tree.y + tree.trunkOffset.y,
        draw: () => this.drawTree(ctx, tree, screenCenterX, screenCenterY)
      });
    }

    // Deers
    for (const deer of this.deers) {
      renderList.push({
        type: 'deer',
        x: relX(deer.x),
        y: deer.y,
        draw: () => this.drawDeer(ctx, deer, screenCenterX, screenCenterY)
      });
    }

    // Wolves
    for (const wolf of this.wolves) {
      renderList.push({
        type: 'wolf',
        x: relX(wolf.x),
        y: wolf.y,
        draw: () => this.drawWolf(ctx, wolf, screenCenterX, screenCenterY)
      });
    }

    // Architect Structures (Villages, Shops, Houses, Lanterns)
    if (this.architect) {
      this.architect.addStructuresToRenderList(renderList, screenCenterX, screenCenterY);
    }

    // New Isometric Dungeon & Wall Structures System
    if (this.structures) {
      this.structures.addStructuresToRenderList(renderList, screenCenterX, screenCenterY);
    }

    // Sort by Y (foot level) and break ties using layer priority (Layer 2 Roofs > Layer 1 Walls/Entities)
    // F3: DepthSort trata paredes como linhas (frente/tras pela reta); sem o modulo, usa a ordem antiga por Y.
    if (window.DepthSort) {
      window.DepthSort.sort(renderList);
    } else {
      renderList.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        const layerA = a.layer || 1;
        const layerB = b.layer || 1;
        return layerA - layerB;
      });
    }

    // Draw sorted entities
    const _to = performance.now();
    const _tp = this._perf && this._perf.el.style.display !== 'none', _ty = _tp ? {} : null;
    if (!this.dbg || this.dbg.objects !== false) for (const item of renderList) {
      if (_tp) { const a = performance.now(); item.draw(); const q = _ty[item.type] || (_ty[item.type] = [0, 0]); q[0] += performance.now() - a; q[1]++; }
      else item.draw();
    }
    this._ph.ty = _ty; this._ph.nlist = renderList.length;
    this._ph.o = performance.now() - _to;

    // 3. Render Particles (Embers, Ripples & Leaves)
    for (const p of this.particles) {
      const pdx = this.world ? this.world.wrapDelta(p.x - this.camera.x) : (p.x - this.camera.x);
      const px = pdx + screenCenterX;
      const py = p.y - this.camera.y + screenCenterY;
      if (p.type === 'ripple') {
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5 * (p.life / p.maxLife);
        ctx.globalAlpha = (p.life / p.maxLife) * 0.85;
        ctx.beginPath();
        ctx.ellipse(px, py, p.radius, p.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        p.radius += (p.maxRadius - p.radius) * 0.22;
      } else if (p.type === 'damage_text') {
        ctx.save();
        ctx.font = `900 ${p.size || 16}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, p.life / (p.maxLife * 0.35));
        ctx.fillStyle = '#000000';
        ctx.fillText(p.text, px + 1, py + 1);
        ctx.fillStyle = p.color || '#ff6b6b';
        ctx.fillText(p.text, px, py);
        ctx.restore();
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // 3b. Draw Architect Grid Cursor & Ghost Block Preview
    if (this.architect && this.architect.drawPreview) {
      this.architect.drawPreview(ctx, screenCenterX, screenCenterY);
    }

    ctx.restore(); // Restore camera zoom context for full-screen lighting & weather

    // 4. Render Ambient Sky Lighting (Solar & Moon Cycle)
    const _tl = performance.now();
    if (!this.dbg || this.dbg.light !== false) this.renderLighting(ctx, screenCenterX, screenCenterY);
    this._ph.l = performance.now() - _tl;

    // 5. Render Rain & Weather Effects
    const _tr = performance.now();
    if (!this.dbg || this.dbg.rain !== false) this.timeSystem.renderRain(ctx);
    this._ph.r = performance.now() - _tr;

    // 6. Lightning Flash (Full Screen white blaze during storms)
    if (this.timeSystem.lightningFlash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.timeSystem.lightningFlash * 0.85})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Sprites de luz pre-renderizados (um gradiente radial de 128px por tipo), desenhados escalados: bem mais barato que criar gradiente + arco por luz por frame
  _lightSpr(name, ratio) {
    const P = {
      pErase: [[0, 'rgba(0,0,0,1)'], [0.45, 'rgba(0,0,0,0.85)'], [0.8, 'rgba(0,0,0,0.4)'], [1, 'rgba(0,0,0,0)']],
      cErase: [[0, 'rgba(0,0,0,1)'], [0.35, 'rgba(0,0,0,0.95)'], [0.7, 'rgba(0,0,0,0.55)'], [1, 'rgba(0,0,0,0)']],
      lErase: [[0, 'rgba(0,0,0,1)'], [0.5, 'rgba(0,0,0,0.6)'], [1, 'rgba(0,0,0,0)']],
      fErase: [[0, 'rgba(0,0,0,1)'], [0.4, 'rgba(0,0,0,0.9)'], [0.75, 'rgba(0,0,0,0.45)'], [1, 'rgba(0,0,0,0)']],
      cGlow: [[0, 'rgba(255,200,70,0.55)'], [0.3, 'rgba(255,140,35,0.32)'], [0.65, 'rgba(230,80,20,0.14)'], [1, 'rgba(0,0,0,0)']],
      lGlow: [[0, 'rgba(255,212,59,0.55)'], [0.4, 'rgba(255,170,40,0.25)'], [1, 'rgba(0,0,0,0)']],
      pGlow: [[0, 'rgba(255,185,75,0.38)'], [0.4, 'rgba(255,120,30,0.18)'], [1, 'rgba(0,0,0,0)']],
      fGlow: [[0, 'rgba(255,200,80,0.36)'], [0.35, 'rgba(255,150,45,0.18)'], [0.7, 'rgba(230,90,25,0.1)'], [1, 'rgba(0,0,0,0)']],
      fGlowS: [[0, 'rgba(255,200,80,0.5)'], [0.35, 'rgba(255,150,45,0.25)'], [0.7, 'rgba(230,90,25,0.1)'], [1, 'rgba(0,0,0,0)']]
    };
    this._lspr = this._lspr || {};
    const rq = Math.round(Math.min(0.9, Math.max(0, ratio)) * 40) / 40, key = name + '|' + rq;
    let c = this._lspr[key]; if (c) return c;
    c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 64 * rq, 64, 64, 64); for (const st of P[name]) g.addColorStop(st[0], st[1]);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return (this._lspr[key] = c);
  }

  renderLighting(ctx, screenCenterX, screenCenterY) {
    const ambient = this.timeSystem.getAmbientLight();
    const hasActiveCampfires = this.campfires.length > 0;
    const hasLanterns = this.architect && this.architect.structures.some(s => s.type === 'lantern');
    if (ambient.alpha <= 0.02 && !hasActiveCampfires && !hasLanterns) return;

    if (!this.lightCanvas) {
      this.lightCanvas = document.createElement('canvas');
      this.lightCtx = this.lightCanvas.getContext('2d');
    }

    // A mascara de escuridao e suave: calcula em meia resolucao (4x menos pixels) e estica por cima da cena
    const w = this.canvas.width;
    const h = this.canvas.height;
    const lw = Math.ceil(w / 2), lh = Math.ceil(h / 2);
    if (this.lightCanvas.width !== lw || this.lightCanvas.height !== lh) {
      this.lightCanvas.width = lw;
      this.lightCanvas.height = lh;
    }

    const lCtx = this.lightCtx;
    lCtx.setTransform(1, 0, 0, 1, 0, 0);
    lCtx.clearRect(0, 0, lw, lh);
    lCtx.setTransform(0.5, 0, 0, 0.5, 0, 0);          // dai em diante, coordenadas em pixels da tela cheia

    // 1. Escuridao ambiente
    const darknessAlpha = Math.max(0.04, ambient.alpha);
    lCtx.fillStyle = `rgba(${ambient.r}, ${ambient.g}, ${ambient.b}, ${darknessAlpha})`;
    lCtx.fillRect(0, 0, w, h);

    // 2. Furos de luz na escuridao (destination-out), com sprites de gradiente pre-renderizados
    lCtx.save();
    lCtx.globalCompositeOperation = 'destination-out';
    const blob = (c, spr, x, y, r) => { c.drawImage(spr, x - r, y - r, r * 2, r * 2); };

    const zoom = this.camera.zoom || 1.0;
    const wd = (x) => this.world ? this.world.wrapDelta(x - this.camera.x) : (x - this.camera.x);

    // 2a. Tocha do jogador e visao basica
    const pdx = wd(this.player.x);
    const px = Math.round(pdx * zoom + screenCenterX);
    const py = Math.round((this.player.y - this.getLift() - this.camera.y) * zoom + screenCenterY);
    const isFiery = this.player.torchLit || this.player.equippedWeapon === 'fire_sword';
    let lightRadius = 90 * zoom;
    if (isFiery) {
      const flicker = Math.sin(performance.now() * 0.012) * 6 + (Math.random() - 0.5) * 4;
      lightRadius = (this.player.equippedWeapon === 'fire_sword' ? 240 : 190) * zoom + flicker;
    }
    blob(lCtx, this._lightSpr('pErase', 15 * zoom / lightRadius), px, py, lightRadius);

    // 2b. Fogueiras
    const tN = performance.now() * 0.009;
    const sprCE = this._lightSpr('cErase', 0.08);
    for (const c of this.campfires) {
      const cx = Math.round(wd(c.x) * zoom + screenCenterX), cy = Math.round((c.y - this.camera.y) * zoom + screenCenterY);
      const fireRad = (310 + Math.sin(tN * 1.5) * 14 + Math.cos(tN * 2.1) * 8) * zoom;
      if (cx < -fireRad || cx > w + fireRad || cy < -fireRad || cy > h + fireRad) continue;
      blob(lCtx, sprCE, cx, cy, fireRad);
    }

    // 2c. Lampioes do construtor
    const lanterns = (this.architect && this.architect.structures) ? this.architect.structures.filter(s => s.type === 'lantern') : [];
    const sprLE = this._lightSpr('lErase', 0.06), lanternRad = 175 * zoom;
    for (const s of lanterns) {
      const lx = Math.round(wd(s.x) * zoom + screenCenterX), ly = Math.round((s.y - this.camera.y) * zoom + screenCenterY - (s.height / 2 - 8) * zoom);
      if (lx < -lanternRad || lx > w + lanternRad || ly < -lanternRad || ly > h + lanternRad) continue;
      blob(lCtx, sprLE, lx, ly, lanternRad);
    }

    // 2d. Moveis com luz (lareira, candelabro, braseiro): so os que aparecem na tela
    const furnLights = [];
    if (this.architect && this.architect.getLights) {
      for (const L of this.architect.getLights()) {
        const fx = Math.round(wd(L.x) * zoom + screenCenterX), fy = Math.round((L.y - this.camera.y) * zoom + screenCenterY), R = L.r * zoom + 20;
        if (fx < -R - 40 || fx > w + R + 40 || fy < -R - 40 || fy > h + R + 40) continue;
        furnLights.push({ L, fx, fy });
      }
    }
    const sprFE = this._lightSpr('fErase', 0.04);
    for (const f of furnLights) {
      const L = f.L, fr = (L.r + Math.sin(tN * 1.5 + L.x) * 8 + Math.cos(tN * 2.1 + L.y) * 5) * zoom;
      blob(lCtx, sprFE, f.fx, f.fy, fr);
    }
    lCtx.restore();
    lCtx.setTransform(1, 0, 0, 1, 0, 0);

    // 3. Camada de escuridao por cima da cena (esticada de meia para resolucao cheia)
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(this.lightCanvas, 0, 0, lw, lh, 0, 0, lw * 2, lh * 2);

    // 4. Brilho quente do fogo (blend screen)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sprCG = this._lightSpr('cGlow', 0.03);
    for (const c of this.campfires) {
      const cx = Math.round(wd(c.x) * zoom + screenCenterX), cy = Math.round((c.y - this.camera.y) * zoom + screenCenterY);
      const glowRad = (300 + Math.sin(tN * 1.5) * 12) * zoom;
      if (cx < -glowRad || cx > w + glowRad || cy < -glowRad || cy > h + glowRad) continue;
      blob(ctx, sprCG, cx, cy, glowRad);
    }
    for (const f of furnLights) {
      const L = f.L, gr = (L.r * 0.9 + Math.sin(tN * 1.5 + L.x) * 8) * zoom;
      blob(ctx, this._lightSpr(L.kind === 'fireplace' ? 'fGlowS' : 'fGlow', 0.02), f.fx, f.fy, gr);
    }
    const sprLG = this._lightSpr('lGlow', 0.05);
    for (const s of lanterns) {
      const lx = Math.round(wd(s.x) * zoom + screenCenterX), ly = Math.round((s.y - this.camera.y) * zoom + screenCenterY - (s.height / 2 - 8) * zoom);
      if (lx < -lanternRad || lx > w + lanternRad || ly < -lanternRad || ly > h + lanternRad) continue;
      blob(ctx, sprLG, lx, ly, lanternRad);
    }
    if (isFiery) blob(ctx, this._lightSpr('pGlow', 10 / lightRadius), px, py, lightRadius);
    ctx.restore();
  }

  updateCalendarHUD() {
    const px = this.player ? this.player.x : 0;
    const py = this.player ? this.player.y : 0;
    const localDate = this.world ? this.world.getLocalSolarTime(this.timeSystem.virtualDate, px) : this.timeSystem.virtualDate;

    const hours = String(localDate.getHours()).padStart(2, '0');
    const mins = String(localDate.getMinutes()).padStart(2, '0');
    const timeDec = localDate.getHours() + localDate.getMinutes() / 60;

    if (this.clockTimeEl) this.clockTimeEl.innerText = `${hours}:${mins}`;

    // Period of the day
    let period = 'Dia';
    let icon = '☀️';
    if (timeDec >= 5.0 && timeDec < 6.5) { period = 'Alvorada'; icon = '🌅'; }
    else if (timeDec >= 6.5 && timeDec < 11.5) { period = 'Manhã'; icon = '🌤'; }
    else if (timeDec >= 11.5 && timeDec < 16.5) { period = 'Tarde'; icon = '☀️'; }
    else if (timeDec >= 16.5 && timeDec < 18.5) { period = 'Entardecer'; icon = '🌇'; }
    else if (timeDec >= 18.5 && timeDec < 20.0) { period = 'Crepúsculo'; icon = '🌆'; }
    else { period = 'Noite'; icon = '🌙'; }

    if (this.clockPeriodEl) this.clockPeriodEl.innerText = period;
    if (this.celestialIconEl) this.celestialIconEl.innerText = icon;

    // Date & Season
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    if (this.calDateEl) this.calDateEl.innerText = `${localDate.getDate()} de ${months[localDate.getMonth()]}`;

    const season = this.timeSystem.getSeason(localDate);
    if (this.calSeasonEl) this.calSeasonEl.innerText = `${season.icon} ${season.name}`;

    const moon = this.timeSystem.getMoonPhase(localDate);
    if (this.calMoonEl) this.calMoonEl.innerText = `${moon.icon} ${moon.name}`;

    // Weather badge
    if (this.weatherBadgeEl) {
      let wTxt = '🌤 Céu Limpo';
      if (this.timeSystem.weather === 'overcast') wTxt = '☁️ Céu Nublado';
      if (this.timeSystem.weather === 'light_rain') wTxt = '🌧 Chuva Fina';
      if (this.timeSystem.weather === 'thunderstorm') wTxt = '⛈ Tempestade com Raios';
      this.weatherBadgeEl.innerText = wTxt;
    }

    // Geographic Coordinates & Timezone Bar
    if (this.world) {
      const lonStr = this.world.getLongitudeStr(px);
      const latStr = this.world.getLatitudeStr(py);
      const fuso = this.world.getTimezoneInfo(px);

      const terrain = this.world.getTerrainAt ? this.world.getTerrainAt(px, py) : null;
      const terrLabel = terrain ? ` • ${terrain.name}` : '';
      if (this.geoCoordEl) this.geoCoordEl.innerText = `🧭 ${lonStr} • ${latStr}${terrLabel}`;
      if (this.geoFusoEl) this.geoFusoEl.innerText = `${fuso.utcStr} [${fuso.regionName}]`;
    }
  }

  // Altura (px) do player acima do chao: andares/escadas (0 no modo Deus)
  getLift() { return this.isGodMode ? 0 : (this.player && this.player.z) || 0; }

  drawPlayer(ctx, screenCenterX, screenCenterY) {
    const pdx = this.world ? this.world.wrapDelta(this.player.x - this.camera.x) : (this.player.x - this.camera.x);
    const px = Math.round(pdx + screenCenterX);
    const py = Math.round(this.player.y - this.getLift() - this.camera.y + screenCenterY);

    const jumpOff = this.player.jumpOffset || 0;
    const isSit = this.player.isSitting;

    // Organic walking/running step cadence and subtle torso weight sway
    let stepBounce = 0;
    let swayAngle = 0;
    if (this.player.isMoving && !jumpOff && !isSit) {
      // quique e balanco ligados a fase do passo (2 quiques por ciclo, minimo nos contatos do pe)
      const ph = (this.player.stridePhase || 0) * Math.PI * 2, spd = Math.min(1, Math.hypot(this.player.vx, this.player.vy) / 150);
      stepBounce = Math.sin(ph) ** 2 * (this.player.isRunning ? 3.2 : 1.8) * spd;   // sin^2: suave, sem "quina" de |sin|
      swayAngle = Math.sin(ph) * (this.player.isRunning ? 0.045 : 0.022) * spd;
    }

    // 1. Ground Shadow (shrinks smoothly when jumping in air)
    const shadowScale = Math.max(0.45, 1.0 - jumpOff / 35);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.35 * shadowScale})`;
    ctx.beginPath();
    ctx.ellipse(px, py, (isSit ? 22 : 16) * shadowScale, (isSit ? 10 : 7) * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Select High-Resolution Sprite Frame from V2 Rig
    const pImgs = this.images.player;
    const dir = this.player.direction || 'down';
    const sideDir = (dir === 'left') ? 'left' : 'right';
    let frame = null;
    let frameKey = `idle_${dir}_0`;

    // 2a. Sitting: Authentic Human Cross-Legged Postures
    if (isSit) {
      frame = pImgs.sit[dir] || pImgs.sit.down;
      frameKey = `sit_${dir}`;
    }
    // 2b. Jumping: 4-stage athletic arc (crouch -> leap -> apex -> land)
    else if (jumpOff > 0 || this.player.isJumping) {
      const prog = this.player.jumpProgress || 0;
      let jIdx = 0;
      if (prog < 0.22) jIdx = 0; // prep crouch
      else if (prog < 0.52) jIdx = 1; // leap up with raised fist!
      else if (prog < 0.82) jIdx = 2; // apex in air
      else jIdx = 3; // landing impact
      const jFrames = (pImgs.jump[sideDir] || pImgs.jump.right || pImgs.jump);
      frame = (Array.isArray(jFrames) ? jFrames[jIdx] : null) || (pImgs.jump.right && pImgs.jump.right[jIdx]);
      frameKey = `jump_${sideDir}_${jIdx}`;
    }
    // 2c. Attacking: Dynamic Melee Swing Rig with empty clenched fists
    else if (this.player.isAttacking) {
      const prog = 1.0 - (this.player.attackTimer / this.player.attackDuration);
      const atkIdx = Math.min(4, Math.floor(prog * 5));
      if (this.player.equippedWeapon === 'axe') {
        frame = pImgs.attack_2h[sideDir][atkIdx] || pImgs.attack_2h.right[0];
        frameKey = `chop_${sideDir}_${atkIdx}`;
      } else {
        frame = pImgs.attack_1h[sideDir][atkIdx] || pImgs.attack_1h.right[0];
        frameKey = `slash_${sideDir}_${atkIdx}`;
      }
    }
    // 2d. Exhausted: Hands-on-knees panting
    else if (this.player.isExhausted && !this.player.isMoving) {
      const pIdx = Math.floor(performance.now() * 0.005) % 4;
      frame = pImgs.exhausted[sideDir][pIdx] || pImgs.exhausted.right[0];
      frameKey = `exhausted_${sideDir}_${pIdx}`;
    }
    // 2e. Running: Athletic sprint cycle
    else if (this.player.isMoving && this.player.isRunning) {
      const rFrames = pImgs.run[dir] || pImgs.run.right;
      const idx = this.player.frameIndex % rFrames.length;
      frame = rFrames[idx];
      frameKey = `run_${dir}_${idx}`;
    }
    // 2f. Walking: Fluid step cycle with natural arm and leg swing
    else if (this.player.isMoving) {
      const wFrames = pImgs.walk[dir] || pImgs.walk.right;
      const idx = this.player.frameIndex % wFrames.length;
      frame = wFrames[idx];
      frameKey = `walk_${dir}_${idx}`;
    }
    // 2g. Idle: Breathing stance
    else {
      const iFrames = pImgs.idle[dir] || pImgs.idle.down;
      const idx = this.player.frameIndex % iFrames.length;
      frame = iFrames[idx];
      frameKey = `idle_${dir}_${idx}`;
    }

    // Fallback to legacy frames if v2 frame not yet loaded
    if (!frame || !frame.complete || frame.naturalWidth <= 0) {
      const legacyFrames = this.images.playerFrames[dir];
      frame = legacyFrames && legacyFrames[this.player.frameIndex % (legacyFrames.length || 1)];
    }

    // 3. Render Sprite with correct aspect ratio and foot anchor
    const targetH = isSit ? 54 : 76;
    let targetW = 48;
    if (frame && frame.naturalHeight > 0) {
      targetW = Math.round((frame.naturalWidth / frame.naturalHeight) * targetH);
    }
    const drawX = px - targetW / 2;
    const drawY = py - targetH + 6 - jumpOff - stepBounce;

    // Precision Hand Socket Lookup
    const socketTable = window.PLAYER_WEAPON_SOCKETS || {};
    const socket = socketTable[frameKey] || 
                   socketTable[`jump_${sideDir}_1`] || 
                   socketTable[`idle_${dir}_0`] || 
                   null;

    const drawBehind = socket ? socket.behind : (dir === 'up');

    // Weapon behind player if specified by socket (e.g. facing UP or backswing)
    if (drawBehind && !isSit) {
      this.drawWeapon(ctx, px, py, drawX, drawY, targetW, targetH, frameKey, socket);
    }

    ctx.save();
    if (swayAngle !== 0) {
      ctx.translate(px, py);
      ctx.rotate(swayAngle);
      ctx.translate(-px, -py);
    }

    if (frame && frame.complete && frame.naturalWidth > 0) {
      ctx.drawImage(frame, drawX, drawY, targetW, targetH);
    } else {
      ctx.fillStyle = '#f0c05a';
      ctx.fillRect(px - 14, drawY, 28, targetH);
    }
    ctx.restore();

    // Weapon in front of player if NOT drawn behind
    if (!drawBehind && !isSit) {
      this.drawWeapon(ctx, px, py, drawX, drawY, targetW, targetH, frameKey, socket);
    }

    // 5. Dynamic Player Status Tag (Sitting, Exhausted, Running, Normal)
    let tag = 'Aventureiro';
    let tagColor = '#69db7c';
    if (isSit) {
      tag = 'Aventureiro [Descansando 💤]';
      tagColor = '#74c0fc';
    } else if (this.player.isExhausted) {
      tag = 'Aventureiro [Exausto 💧]';
      tagColor = '#ff8787';
    } else if (this.player.isRunning) {
      tag = 'Aventureiro [Correndo ⚡]';
      tagColor = '#ffd43b';
    }

    const tagY = drawY - 4;
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(tag, px + 1, tagY + 1);
    ctx.fillStyle = tagColor;
    ctx.fillText(tag, px, tagY);
  }

  drawWeapon(ctx, px, py, drawX, drawY, targetW, targetH, frameKey, socket) {
    if (!this.player.equippedWeapon) return;
    const weaponImg = this.images.weapons[this.player.equippedWeapon];
    if (!weaponImg || !weaponImg.complete || weaponImg.naturalWidth <= 0) return;

    ctx.save();

    let handX, handY, angle, scaleX;

    if (socket && typeof drawX === 'number' && typeof drawY === 'number') {
      // Dynamic Precision Socket: locks weapon hilt directly into character's fist on each frame!
      handX = drawX + targetW * socket.x;
      handY = drawY + targetH * socket.y;
      angle = socket.angle;
      scaleX = socket.flip ? -1 : 1;
    } else {
      // Safe fallback
      const isLeft = (this.player.direction === 'left');
      handX = px + (isLeft ? -12 : 12);
      handY = (typeof drawY === 'number') ? (drawY + targetH * 0.55) : (py - 24);
      angle = isLeft ? -0.22 : 0.22;
      scaleX = isLeft ? -1 : 1;
    }

    // Dynamic Attack Trail Arc
    if (this.player.isAttacking) {
      ctx.save();
      ctx.translate(handX, handY);
      ctx.beginPath();
      const slashColor = this.player.equippedWeapon === 'fire_sword' 
        ? 'rgba(255, 140, 0, 0.85)' 
        : 'rgba(230, 245, 255, 0.7)';
      ctx.strokeStyle = slashColor;
      ctx.lineWidth = this.player.equippedWeapon === 'fire_sword' ? 4 : 2.5;
      ctx.lineCap = 'round';
      ctx.arc(0, 0, 32, angle - 0.7, angle + 0.7, false);
      ctx.stroke();
      ctx.restore();
    }

    // Lineage 2 Enchantment Glow (+16 Fire Sword aura!)
    if (this.player.equippedWeapon === 'fire_sword') {
      ctx.shadowColor = '#ff6b00';
      ctx.shadowBlur = 14 + Math.sin(performance.now() * 0.01) * 6;
    }

    ctx.translate(handX, handY);
    ctx.scale(scaleX, 1);
    ctx.rotate(angle);

    // Anchor weapon sprite by grip handle (23% from left, 77% from top)
    const wSize = (this.player.equippedWeapon === 'axe') ? 36 : 34;
    const gripX = Math.round(wSize * 0.23);
    const gripY = Math.round(wSize * 0.77);
    ctx.drawImage(weaponImg, -gripX, -gripY, wSize, wSize);

    ctx.restore();

    // Passive fiery embers from Fire Sword +16
    if (this.player.equippedWeapon === 'fire_sword' && Math.random() < 0.35) {
      this.particles.push({
        x: this.player.x + (this.player.direction === 'left' ? -16 : 16) + (Math.random() - 0.5) * 8,
        y: this.player.y - 34 + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 35 - 15,
        life: 0.5,
        maxLife: 0.5,
        color: Math.random() > 0.4 ? '#ffa94d' : '#ff6b6b',
        size: Math.random() * 3 + 1.5
      });
    }
  }

  drawDeer(ctx, deer, screenCenterX, screenCenterY) {
    const ddx = this.world ? this.world.wrapDelta(deer.x - this.camera.x) : (deer.x - this.camera.x);
    const dx = Math.round(ddx + screenCenterX);
    const dy = Math.round(deer.y - this.camera.y + screenCenterY);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(dx, dy + 2, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Choose animation frame: if grazing, use eat frames; else use direction frames
    let frameList = this.images.deerFrames[deer.direction];
    if (deer.state === 'grazing') {
      frameList = this.images.deerFrames.eat;
    }

    const frame = frameList && frameList[deer.frameIndex % frameList.length];

    if (frame && frame.complete && frame.naturalWidth > 0) {
      const w = deer.width;
      const h = deer.height;
      ctx.drawImage(frame, dx - w / 2, dy - h + 6, w, h);
    } else {
      ctx.fillStyle = '#b27b14';
      ctx.fillRect(dx - 18, dy - 36, 36, 36);
    }

    // Alert Exclamation Icon (!) if deer is startled
    if (deer.state === 'alert') {
      ctx.font = '900 18px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText('!', dx + 1, dy - deer.height - 8);
      ctx.fillStyle = '#ffd43b';
      ctx.fillText('!', dx, dy - deer.height - 9);
    }

    // Small Deer Name tag
    ctx.font = '10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText('Cervo', dx + 1, dy - deer.height - 1);
    ctx.fillStyle = '#d8f5a2';
    ctx.fillText('Cervo', dx, dy - deer.height - 2);
  }

  drawWolf(ctx, wolf, screenCenterX, screenCenterY) {
    const wdx = this.world ? this.world.wrapDelta(wolf.x - this.camera.x) : (wolf.x - this.camera.x);
    const wx = Math.round(wdx + screenCenterX);
    const wy = Math.round(wolf.y - this.camera.y + screenCenterY);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.ellipse(wx, wy + 2, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    let frameList = this.images.wolfFrames[wolf.direction];
    if (wolf.state === 'attack') {
      frameList = this.images.wolfFrames.attack;
    }
    const frame = frameList && frameList[wolf.frameIndex % frameList.length];

    if (frame && frame.complete && frame.naturalWidth > 0) {
      const targetH = 54;
      const targetW = (frame.naturalWidth / frame.naturalHeight) * targetH;
      ctx.drawImage(frame, wx - targetW / 2, wy - targetH + 6, targetW, targetH);
    } else {
      ctx.fillStyle = '#495057';
      ctx.fillRect(wx - 16, wy - 30, 32, 30);
    }

    // Glowing red predator eyes in darkness or when hunting
    const isNight = this.timeSystem.virtualDate.getHours() >= 19 || this.timeSystem.virtualDate.getHours() < 5;
    if (wolf.state === 'hunting' || wolf.state === 'attack' || isNight) {
      ctx.fillStyle = '#ff3b3b';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 8;
      let eyeX = wx;
      let eyeY = wy - 36;
      if (wolf.direction === 'left') { eyeX = wx - 16; }
      else if (wolf.direction === 'right') { eyeX = wx + 16; }
      else if (wolf.direction === 'down') { eyeX = wx - 3; }
      else if (wolf.direction === 'up') { eyeX = wx - 2; }
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
      ctx.arc(eyeX + (wolf.direction === 'left' ? 4 : (wolf.direction === 'right' ? -4 : 6)), eyeY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Aggro icon if in combat
    if (wolf.state === 'attack' || wolf.state === 'hunting') {
      ctx.font = '900 16px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText('⚔', wx + 1, wy - 58);
      ctx.fillStyle = '#ff6b6b';
      ctx.fillText('⚔', wx, wy - 59);
    }

    // Wolf Tag
    ctx.font = '10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText('Lobo da Floresta', wx + 1, wy - 46);
    ctx.fillStyle = wolf.state === 'hunting' ? '#ff8787' : '#ced4da';
    ctx.fillText('Lobo da Floresta', wx, wy - 47);

    // HP Bar if damaged
    if (wolf.hp < wolf.maxHp) {
      const barW = 34;
      const barH = 4;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(wx - barW / 2, wy - 44, barW, barH);
      ctx.fillStyle = '#fa5252';
      ctx.fillRect(wx - barW / 2, wy - 44, barW * (wolf.hp / wolf.maxHp), barH);
    }
  }

  drawCarcass(ctx, carcass, screenCenterX, screenCenterY) {
    const cdx = this.world ? this.world.wrapDelta(carcass.x - this.camera.x) : (carcass.x - this.camera.x);
    const cx = Math.round(cdx + screenCenterX);
    const cy = Math.round(carcass.y - this.camera.y + screenCenterY);

    // Ground blood/decay stain
    ctx.fillStyle = carcass.stage === 0 ? 'rgba(150, 20, 20, 0.4)' : (carcass.stage === 1 ? 'rgba(80, 40, 20, 0.3)' : 'rgba(50, 50, 50, 0.2)');
    ctx.beginPath();
    ctx.ellipse(cx, cy + 3, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    const frame = this.images.carcass[carcass.stage];
    if (frame && frame.complete && frame.naturalWidth > 0) {
      const targetH = 38;
      const targetW = (frame.naturalWidth / frame.naturalHeight) * targetH;
      ctx.drawImage(frame, cx - targetW / 2, cy - targetH + 10, targetW, targetH);
    } else {
      ctx.fillStyle = carcass.stage === 0 ? '#8e2727' : '#868e96';
      ctx.fillRect(cx - 20, cy - 14, 40, 16);
    }

    // Flies particle effect around decaying carcass (stage 1)
    if (carcass.stage === 1) {
      ctx.fillStyle = 'rgba(20, 20, 20, 0.7)';
      for (let i = 0; i < 4; i++) {
        const flyX = cx + Math.sin(performance.now() * 0.005 + i * 2) * 16;
        const flyY = cy - 12 + Math.cos(performance.now() * 0.007 + i * 3) * 8;
        ctx.fillRect(flyX, flyY, 2, 2);
      }
    }

    // Label
    ctx.font = '10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    let label = 'Carcaça Fresca';
    let col = '#ffa8a8';
    if (carcass.stage === 1) { label = 'Carcaça em Decomposição'; col = '#e9ecef'; }
    else if (carcass.stage === 2) { label = 'Ossada Seca'; col = '#adb5bd'; }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillText(label, cx + 1, cy - 32);
    ctx.fillStyle = col;
    ctx.fillText(label, cx, cy - 33);
  }

  drawTree(ctx, tree, screenCenterX, screenCenterY) {
    const dx = this.world ? this.world.wrapDelta(tree.x - this.camera.x) : (tree.x - this.camera.x);
    const tx = Math.round(dx + screenCenterX);
    const ty = Math.round(tree.y - this.camera.y + screenCenterY);

    // 1. IF IT IS A CUT STUMP
    if (tree.isStump) {
      // Natural stump ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.30)';
      ctx.beginPath();
      ctx.ellipse(tx, ty + tree.trunkOffset.y + 4, 46, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Tree Stump Sprite
      const sImg = this.images.treeStump;
      if (sImg && sImg.complete && sImg.naturalWidth > 0) {
        const stumpW = 104;
        const stumpH = 84;
        const stumpX = tx - stumpW / 2;
        const stumpY = (ty + tree.trunkOffset.y) - stumpH + 16;
        ctx.drawImage(sImg, stumpX, stumpY, stumpW, stumpH);
      } else {
        // Fallback procedural stump
        ctx.fillStyle = '#6b4c2b';
        ctx.fillRect(tx - 24, ty + tree.trunkOffset.y - 20, 48, 24);
      }

      // Small edible woodland mushroom growing on the damp stump!
      if (tree.mushrooms && tree.mushrooms > 0) {
        ctx.fillStyle = '#f03e3e';
        ctx.beginPath();
        ctx.arc(tx + 18, ty + tree.trunkOffset.y - 12, 5, Math.PI, 0, false);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(tx + 16, ty + tree.trunkOffset.y - 12, 4, 6);
        ctx.beginPath();
        ctx.arc(tx + 18, ty + tree.trunkOffset.y - 14, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    // 2. IF IT IS A LIVING OAK TREE
    // Tree ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(tx, ty + tree.trunkOffset.y, 65, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk strike vibration shake
    let shakeX = 0;
    if (tree.shake && tree.shake > 0) {
      shakeX = Math.sin(tree.shake * 55) * (tree.shake * 14);
    }

    // Living Tree Sprite
    if (this.images.tree.complete && this.images.tree.naturalWidth > 0) {
      const w = tree.width;
      const h = tree.height;
      ctx.drawImage(this.images.tree, tx - w / 2 + shakeX, ty - h / 2, w, h);
    }

    // Red Fruits on canopy
    if (tree.fruits > 0) {
      for (let i = 0; i < tree.fruits; i++) {
        const fruitOffsetX = ((i % 3) - 1) * 32 + (i * 7 % 11);
        const fruitOffsetY = -60 + Math.floor(i / 3) * 26 + (i * 5 % 9);
        const fx = tx + fruitOffsetX + shakeX;
        const fy = ty + fruitOffsetY;

        ctx.fillStyle = '#e03131';
        ctx.beginPath();
        ctx.arc(fx, fy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffc9c9';
        ctx.beginPath();
        ctx.arc(fx - 1.5, fy - 1.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawFruit(ctx, fruit, screenCenterX, screenCenterY) {
    const fdx = this.world ? this.world.wrapDelta(fruit.x - this.camera.x) : (fruit.x - this.camera.x);
    const fx = Math.round(fdx + screenCenterX);
    const fy = Math.round(fruit.y - this.camera.y + screenCenterY);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(fx, fy + 3, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e03131';
    ctx.beginPath();
    ctx.arc(fx, fy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#51cf66';
    ctx.fillRect(fx - 0.5, fy - 6, 2, 2.5);
  }

  updateHUD() {
    this.hpBar.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    this.hpLabel.innerText = `HP ${Math.round(this.player.hp)} / ${this.player.maxHp}`;

    this.manaBar.style.width = `${(this.player.mana / this.player.maxMana) * 100}%`;
    this.manaLabel.innerText = `MP ${Math.round(this.player.mana)} / ${this.player.maxMana}`;

    this.hungerBar.style.width = `${this.player.hunger}%`;
    this.hungerLabel.innerText = `Nutrição ${Math.round(this.player.hunger)}%`;

    if (this.staminaBar && this.staminaLabel) {
      const stamPct = Math.max(0, Math.min(100, (this.player.stamina / this.player.maxStamina) * 100));
      this.staminaBar.style.width = `${stamPct}%`;
      this.staminaLabel.innerText = this.player.isExhausted
        ? `OFEGANTE! ${Math.round(this.player.stamina)} / ${this.player.maxStamina}`
        : `Estamina ${Math.round(this.player.stamina)} / ${this.player.maxStamina}`;
      if (this.player.isExhausted) {
        this.staminaBar.classList.add('exhausted');
      } else {
        this.staminaBar.classList.remove('exhausted');
      }
    }

    const countSlot1 = document.getElementById('count-slot-1');
    if (countSlot1) countSlot1.innerText = this.player.inventory.fruit;

    const countMeat = document.getElementById('count-meat');
    if (countMeat) countMeat.innerText = this.player.inventory.meat || 0;

    // World Stats
    if (this.treeCountEl) {
      const livingTrees = this.trees.filter(t => !t.isStump).length;
      this.treeCountEl.innerText = livingTrees;
    }
    
    let totalFruits = this.fruitsOnGround.length;
    for (const t of this.trees) totalFruits += t.fruits;
    if (this.fruitCountEl) this.fruitCountEl.innerText = totalFruits;

    if (this.deerCountEl) this.deerCountEl.innerText = this.deers.length;
    if (this.wolfCountEl) this.wolfCountEl.innerText = this.wolves.length;
    if (this.carcassCountEl) this.carcassCountEl.innerText = this.carcasses.length;
  }

  addLog(msg, type = 'entry') {
    if (!this.logMessages) return;
    const div = document.createElement('div');
    div.className = `log-entry ${type}`;
    div.innerHTML = msg;
    this.logMessages.appendChild(div);

    while (this.logMessages.children.length > 25) {
      this.logMessages.removeChild(this.logMessages.firstChild);
    }
    this.logMessages.scrollTop = this.logMessages.scrollHeight;
  }

  _loopErr(where, e) {
    this._seenErr = this._seenErr || {};
    const k = where + ':' + (e && e.message);
    if (this._seenErr[k]) return;
    this._seenErr[k] = true;
    console.error('[Game.' + where + '] erro (o jogo continua):', e);
  }

  // HUD de desempenho (tecla F9): fps, tempos por frame e grafico de picos -> ajuda a achar tremidas/engasgos
  _perfInit() {
    if (this._perf) return; const el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:8px;top:140px;z-index:99999;background:rgba(0,0,0,0.78);color:#9ef;font:11px monospace;padding:6px 8px;border:1px solid #468;border-radius:4px;pointer-events:none;display:none;white-space:pre';
    const cv = document.createElement('canvas'); cv.width = 240; cv.height = 56; cv.style.cssText = 'display:block;margin-top:4px';
    const tx = document.createElement('div'); el.appendChild(tx); el.appendChild(cv); document.body.appendChild(el);
    this.dbg = { rain: true, water: true, ground: true, floors: true, objects: true, light: true };
    const bar = document.createElement('div'); bar.style.cssText = 'margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;pointer-events:auto';
    for (const [k, n] of [['ground', 'chão'], ['water', 'água'], ['floors', 'pisos'], ['objects', 'objetos'], ['light', 'luz'], ['rain', 'chuva']]) {
      const b = document.createElement('button'); b.textContent = n + ': ON'; b.style.cssText = 'font:10px monospace;padding:1px 5px;background:#123;color:#9ef;border:1px solid #468;cursor:pointer';
      b.addEventListener('click', () => { this.dbg[k] = !this.dbg[k]; b.textContent = n + (this.dbg[k] ? ': ON' : ': OFF'); b.style.background = this.dbg[k] ? '#123' : '#611'; b.blur(); });
      bar.appendChild(b);
    }
    el.appendChild(bar);
    this._ph = this._ph || {}; this._perf = { el, cv, tx, c2: cv.getContext('2d'), iv: new Array(240).fill(16.7), ms: new Array(240).fill(0), i: 0, last: 0, upd: 0, ren: 0, worst: 0 };
    const btn = document.createElement('button'); btn.textContent = '📊 FPS'; btn.title = 'Painel de desempenho (F9)';
    btn.style.cssText = 'position:fixed;left:8px;top:112px;z-index:99999;font:11px sans-serif;padding:2px 8px;background:rgba(20,24,32,0.85);color:#9ef;border:1px solid #468;border-radius:4px;cursor:pointer';
    btn.addEventListener('click', () => { el.style.display = el.style.display === 'none' ? 'block' : 'none'; btn.blur(); }); document.body.appendChild(btn);
    window.addEventListener('keydown', (e) => { if (e.key === 'F9') { e.preventDefault(); el.style.display = el.style.display === 'none' ? 'block' : 'none'; } });
  }
  _perfFrame(interval, upd, ren, now) {
    const P = this._perf; if (!P || P.el.style.display === 'none') return;
    P.iv[P.i] = interval; P.ms[P.i] = upd + ren; P.i = (P.i + 1) % 240;
    const c = P.c2; c.clearRect(0, 0, 240, 56);
    for (let k = 0; k < 240; k++) { const j = (P.i + k) % 240, v = P.iv[j], h = Math.min(56, v * 1.1); c.fillStyle = v > 25 ? '#f55' : (v > 18.5 ? '#fb3' : '#4c8'); c.fillRect(k, 56 - h, 1, h); c.fillStyle = '#fff'; c.fillRect(k, 56 - Math.min(56, P.ms[j] * 1.1), 1, 1); }
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(0, 56 - 16.7 * 1.1, 240, 1);
    if (now - P.last > 500) {
      P.last = now; const a = P.iv, avg = a.reduce((x, y) => x + y, 0) / a.length, sd = Math.sqrt(a.reduce((x, y) => x + (y - avg) * (y - avg), 0) / a.length), mx = Math.max(...a);
      const G = this.ground; const dpr = window.devicePixelRatio || 1;
      P.tx.textContent = `FPS ${(1000 / avg).toFixed(0)}  intervalo ${avg.toFixed(1)}ms  desvio ${sd.toFixed(1)}  pico ${mx.toFixed(0)}ms\nupdate ${upd.toFixed(1)}ms  render ${ren.toFixed(1)}ms\nchão ${(this._ph.g||0).toFixed(1)} pisos ${(this._ph.f||0).toFixed(1)} objetos ${(this._ph.o||0).toFixed(1)} luz ${(this._ph.l||0).toFixed(1)} chuva ${(this._ph.r||0).toFixed(1)} ms\nobjetos(${this._ph.nlist||0}): ${this._ph.ty ? Object.entries(this._ph.ty).sort((a,b)=>b[1][0]-a[1][0]).slice(0,5).map(([k,v])=>k+' '+v[0].toFixed(1)+'ms/'+v[1]).join('  ') : ''}\nblocos ${G ? G.cache.size : 0}\ntela ${this.canvas.width}x${this.canvas.height}  DPR ${dpr}  zoom ${(this.camera.zoom || 1).toFixed(2)}`;
    }
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    const interval = timestamp - this.lastTime;
    this.lastTime = timestamp;
    if (!this._perf) this._perfInit();
    const t0 = performance.now();

    // Um erro pontual de desenho/logica nao pode derrubar o loop (tela preta): registra (no maximo 1x por erro) e segue
    try { this.update(dt); } catch (e) { this._loopErr('update', e); }
    const t1 = performance.now();
    // Com o mapa-mundi aberto o jogo por tras fica parado na tela (nao redesenha a cena inteira 60x por segundo)
    if (!(this.minimap && this.minimap.isWorldMapOpen)) { try { this.render(); } catch (e) { this._loopErr('render', e); } }
    this._perfFrame(interval, t1 - t0, performance.now() - t1, timestamp);

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Instantiate game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
