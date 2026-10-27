// world.js - Planetary Coordinates, Longitude, 24 Timezones & Seamless Toroidal Wrap
class WorldCoordinates {
  constructor(game) {
    this.game = game;

    // 10 Hours of continuous walking at 185 px/s (25 minutes per 15° timezone)
    this.WORLD_WIDTH = 6660096;  // 166.5 km equatorial circumference (exactly 6504 chunks of 1024px)
    this.WORLD_HEIGHT = 3200000; // 80.0 km polar axis (North Pole to South Pole, exactly 3125 chunks)
    this.terrain = new TerrainModel(this.WORLD_WIDTH, this.WORLD_HEIGHT); // modelo continuo do terreno (terrain.js)
    this.TIMEZONES_COUNT = 24;
    this.TIMEZONE_WIDTH = this.WORLD_WIDTH / this.TIMEZONES_COUNT; // 277,504 px (exactly 271 chunks per fuso)

    // Cultural Regions and Timezone Directory (GDD Compliant)
    this.regions = [
      { minFuso: 0,  maxFuso: 2,  name: 'Reinos de Valória & Arton', culture: 'Europa Medieval', lang: 'Português / Valoriano', biome: 'Bosques de Carvalho & Colinas' },
      { minFuso: 3,  maxFuso: 4,  name: 'Estepes de Askir', culture: 'Estepes Nórdicas', lang: 'Eslavo Antigo', biome: 'Taiga Fria, Montes & Bétulas' },
      { minFuso: 5,  maxFuso: 8,  name: 'Império de Yamato', culture: 'Oriente Ancestral', lang: 'Japonês Arcaico', biome: 'Bambuzais, Cerejeiras & Ginkgo' },
      { minFuso: 9,  maxFuso: 13, name: 'Grande Oceano Abissal', culture: 'Povos Navegadores', lang: 'Dialeto dos Mares', biome: 'Ilhas Vulcânicas & Atóis' },
      { minFuso: 14, maxFuso: 17, name: 'Bastiões do Norte', culture: 'Terras Ermas & Pioneiros', lang: 'Inglês Rústico', biome: 'Pinhais, Canyons & Sequoias' },
      { minFuso: 18, maxFuso: 21, name: 'Terras de Santa Cruz', culture: 'Brasil Nativo & Pioneiro', lang: 'Português Brasileiro', biome: 'Mata Atlântica, Pau-Brasil & Cerrado' },
      { minFuso: 22, maxFuso: 23, name: 'Mar Ocidental dos Navegantes', culture: 'Rotas de Comércio', lang: 'Língua Franca', biome: 'Costas Rochosas & Arquipélagos' }
    ];

    // Procedural Chunk Manager for infinite continuous terrain & flora
    this.chunks = new ProceduralChunkManager(this, game);
  }

  // Seamless horizontal toroidal wrap (0 to WORLD_WIDTH)
  wrapX(x) {
    const w = this.WORLD_WIDTH;
    return ((x % w) + w) % w;
  }

  // Clamped vertical latitude (0 to WORLD_HEIGHT)
  clampY(y) {
    return Math.max(0, Math.min(this.WORLD_HEIGHT, y));
  }

  // Get Longitude in Degrees (-180° to +180°)
  getLongitudeDeg(x) {
    const normX = this.wrapX(x);
    // 0 = 0° (Greenwich/Prime Meridian), 0.5 = 180° (Antipode), 1.0 = 360° (0°)
    let deg = (normX / this.WORLD_WIDTH) * 360;
    if (deg > 180) deg -= 360; // -180° to +180°
    return deg;
  }

  getLongitudeStr(x) {
    const deg = this.getLongitudeDeg(x);
    const absDeg = Math.abs(deg).toFixed(1);
    return deg >= 0 ? `${absDeg}° L` : `${absDeg}° O`;
  }

  // Get Latitude in Degrees (+90° North to -90° South)
  getLatitudeDeg(y) {
    const normY = this.clampY(y);
    // Y=0 -> North Pole (+90°), Y=Center -> Equator (0°), Y=Height -> South Pole (-90°)
    const prog = normY / this.WORLD_HEIGHT;
    return 90 - prog * 180;
  }

  getLatitudeStr(y) {
    const deg = this.getLatitudeDeg(y);
    const absDeg = Math.abs(deg).toFixed(1);
    if (Math.abs(deg) < 0.5) return 'Equador (0°)';
    return deg >= 0 ? `${absDeg}° N` : `${absDeg}° S`;
  }

  // Get Timezone Information (0 to 23)
  getTimezoneInfo(x) {
    const normX = this.wrapX(x);
    const fusoIndex = Math.floor((normX / this.WORLD_WIDTH) * this.TIMEZONES_COUNT) % this.TIMEZONES_COUNT;
    
    // UTC offset relative to Prime Meridian (0)
    let utcOffset = fusoIndex;
    if (utcOffset > 12) utcOffset -= 24; // e.g. 21 -> -3 (Brasil)
    const sign = utcOffset >= 0 ? '+' : '';
    const utcStr = `UTC${sign}${utcOffset}`;

    // Find region
    const region = this.regions.find(r => fusoIndex >= r.minFuso && fusoIndex <= r.maxFuso) || this.regions[0];

    return {
      fusoIndex,
      utcOffset,
      utcStr,
      regionName: region.name,
      culture: region.culture,
      language: region.lang,
      biome: region.biome
    };
  }

  // Calculate local solar time at coordinate X given the world base time
  // Shift ONLY full integer hours: minutes and seconds always remain synchronized to real-time clock!
  getLocalSolarTime(baseDate, x) {
    const normX = this.wrapX(x);
    const fusoIndex = Math.floor((normX / this.WORLD_WIDTH) * this.TIMEZONES_COUNT) % this.TIMEZONES_COUNT;
    
    // UTC offset in full integer hours
    let utcOffsetHours = fusoIndex;
    if (utcOffsetHours > 12) utcOffsetHours -= 24; // e.g. 21 -> -3 (Brasil)

    // Preserve exact minutes, seconds, and milliseconds!
    const shiftedDate = new Date(baseDate.getTime());
    shiftedDate.setHours(baseDate.getHours() + utcOffsetHours);
    return shiftedDate;
  }

  // Teleport player directly to a specific timezone (0 to 23) for testing
  teleportToTimezone(fusoIndex) {
    const targetX = (fusoIndex % 24) * this.TIMEZONE_WIDTH + (this.TIMEZONE_WIDTH / 2);
    if (this.game && this.game.player) {
      this.game.player.x = targetX;
      if (this.game.camera) {
        this.game.camera.x = targetX;
      }
      if (this.game.world && this.game.world.chunks) {
        this.game.trees = this.game.world.chunks.getVisibleTrees(this.game.player.x, this.game.player.y);
      }
      if (this.game.updateCalendarHUD) {
        this.game.updateCalendarHUD();
      }
      const info = this.getTimezoneInfo(targetX);
      if (this.game.addLog) {
        this.game.addLog(`🧭 [EXPEDIÇÃO] Teleportado para o fuso ${info.utcStr} (${info.regionName} • ${info.biome})!`, 'action');
      }
    }
  }

  // Seamless shortest delta wrap distance
  wrapDelta(dx) {
    const w = this.WORLD_WIDTH;
    dx = ((dx % w) + w) % w;
    if (dx > w / 2) dx -= w;
    return dx;
  }

  // ========================================================
  // PLANETARY TOPOGRAPHY & HYDROLOGY MODEL (TERRAFORMED MARS / ARES)
  // ========================================================
  getTerrainAt(worldX, worldY) {
    const T = this.terrain || (this.terrain = new TerrainModel(this.WORLD_WIDTH, this.WORLD_HEIGHT));
    const f = this._tf || (this._tf = {});
    const u = this.wrapX(worldX) / this.WORLD_WIDTH, v = this.clampY(worldY) / this.WORLD_HEIGHT;
    T.field(u, v, f);
    let type = T.classify(f.e, f.m, f.t, f.c);
    const isWater = type === 'deep' || type === 'ocean' || type === 'water';
    return { type, isWater, isWalkable: !isWater, name: this.terrainName(type, f, u, v) };
  }

  terrainName(type, f, u, v) {
    const T = TerrainModel, A = this.WORLD_WIDTH / this.WORLD_HEIGHT;
    if (type === 'deep' || type === 'ocean' || type === 'water') {
      if (f.cd < T.CHANNEL.w * 3) return 'Estreito de Valles Marineris';
      if (f.hr < T.HELLAS.sea + 0.03) return 'Mar Interior de Hellas';
      if (v < 0.22) return 'Oceanus Borealis';
      return type === 'deep' ? 'Oceano Profundo' : (type === 'ocean' ? 'Mar de Aethel' : 'Águas Rasas');
    }
    let du = u - 0.20; du -= Math.round(du);
    if (Math.hypot(du * A, v - 0.22) < 0.05) return 'Encostas de Olympus Mons';
    if (f.hr < T.HELLAS.island) return 'Ilha de Aotearoa';
    if (type === 'canyon') return 'Canyons de Valles Marineris';
    const names = { shore: 'Praia', desert: 'Deserto Vermelho', plains: 'Planícies', forest: 'Floresta', dense_forest: 'Floresta Densa',
      hills: 'Colinas', mountain: 'Montanhas', snow: 'Terras Geladas' };
    return names[type] || 'Terras de Aethel';
  }
}

// ========================================================
// PROCEDURAL CHUNK MANAGER (Continuous Terrain & Flora)
// ========================================================
class ProceduralChunkManager {
  constructor(world, game) {
    this.world = world;
    this.game = game;
    this.CHUNK_SIZE = 1024; // 1024x1024 pixels per chunk
    this.seed = 42817;

    // Sparse persistence map for modified entities (e.g. chopped trees that became stumps)
    this.modifiedEntities = new Map();

    // Cache of active chunks in memory (Max 36 chunks ~ 36MB)
    this.activeChunks = new Map();
  }

  // Hash function for deterministic pseudo-randomness per chunk
  hash2D(cx, cy, extra = 0) {
    let h = (this.seed ^ (cx * 374761393) ^ (cy * 668265263) ^ (extra * 1274126177)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // Get chunk coordinates from world coordinates
  getChunkCoord(worldX, worldY) {
    const wrappedX = this.world.wrapX(worldX);
    const clampedY = this.world.clampY(worldY);
    return {
      cx: Math.floor(wrappedX / this.CHUNK_SIZE),
      cy: Math.floor(clampedY / this.CHUNK_SIZE)
    };
  }

  // Generate or retrieve chunk data
  getChunk(cx, cy) {
    const key = `${cx}_${cy}`;
    if (this.activeChunks.has(key)) {
      return this.activeChunks.get(key);
    }

    const chunk = this.generateChunk(cx, cy);
    this.activeChunks.set(key, chunk);

    // Keep memory clean: remove chunks if cache exceeds 36 chunks
    if (this.activeChunks.size > 36) {
      const oldestKey = this.activeChunks.keys().next().value;
      this.activeChunks.delete(oldestKey);
    }

    return chunk;
  }

  generateChunk(cx, cy) {
    const chunkOriginX = cx * this.CHUNK_SIZE;
    const chunkOriginY = cy * this.CHUNK_SIZE;
    const chunkCenterX = chunkOriginX + this.CHUNK_SIZE / 2;
    const chunkCenterY = chunkOriginY + this.CHUNK_SIZE / 2;
    const terrain = this.world.getTerrainAt(chunkCenterX, chunkCenterY);
    const regionInfo = this.world.getTimezoneInfo(chunkCenterX);

    const trees = [];
    const fruits = [];

    // Flora por bioma: cada tentativa sorteia uma posicao e so vira arvore se o terreno ali (nao so o centro do chunk) permitir
    const DENS = { forest: 0.55, dense_forest: 0.95, plains: 0.10, hills: 0.14, shore: 0.03 };
    const attempts = 11;
    for (let i = 0; i < attempts; i++) {
      const entityId = `chunk_${cx}_${cy}_tree_${i}`;
      const relX = this.hash2D(cx, cy, 10 + i * 4) * (this.CHUNK_SIZE - 200) + 100;
      const relY = this.hash2D(cx, cy, 11 + i * 4) * (this.CHUNK_SIZE - 220) + 110;

      // Vilas e cidades (js/town_plans.js) sao clareiras: nenhuma arvore nasce dentro delas
      if (window.TownBuilder && window.TownBuilder.isInClearing(chunkOriginX + relX, chunkOriginY + relY)) continue;

      // Check if player has modified this tree previously
      if (this.modifiedEntities.has(entityId)) {
        trees.push(this.modifiedEntities.get(entityId));
        continue;
      }
      const spot = this.world.getTerrainAt(chunkOriginX + relX, chunkOriginY + relY);
      if (this.hash2D(cx, cy, 15 + i * 4) > (DENS[spot.type] || 0)) continue;
      const woodCap = Math.floor(this.hash2D(cx, cy, 12 + i * 4) * 5) + 4;

      const tree = {
        id: entityId,
        cx: cx,
        cy: cy,
        x: chunkOriginX + relX,
        y: chunkOriginY + relY,
        width: 190,
        height: 220,
        trunkOffset: { x: 0, y: 80, radius: 24 },
        fruits: Math.floor(this.hash2D(cx, cy, 13 + i * 4) * 4) + 2,
        maxFruits: 6,
        growthTimer: 0,
        wood: woodCap,
        maxWood: woodCap,
        isStump: false,
        shake: 0,
        mushrooms: this.hash2D(cx, cy, 14 + i * 4) < 0.35 ? 1 : 0
      };

      trees.push(tree);
    }

    return {
      cx,
      cy,
      terrain: terrain.type,
      terrainName: terrain.name,
      isWater: terrain.isWater,
      trees,
      fruits,
      region: regionInfo
    };
  }

  // Save modified tree state (e.g. chopped or converted to stump)
  saveModifiedTree(tree) {
    if (tree && tree.id) {
      this.modifiedEntities.set(tree.id, { ...tree });
    }
  }

  // Get active trees in a radius around player/camera (3x3 grid of chunks)
  getVisibleTrees(camX, camY) {
    const { cx, cy } = this.getChunkCoord(camX, camY);
    const visibleTrees = [];
    const maxCX = Math.floor(this.world.WORLD_WIDTH / this.CHUNK_SIZE);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const curCX = ((cx + dx) % maxCX + maxCX) % maxCX;
        const curCY = Math.max(0, cy + dy);
        const chunk = this.getChunk(curCX, curCY);
        for (const t of chunk.trees) {
          visibleTrees.push(t);
        }
      }
    }
    return visibleTrees;
  }
}

// Global hook
window.WorldCoordinates = WorldCoordinates;
window.ProceduralChunkManager = ProceduralChunkManager;
