// fauna.js - Ecossistema de Suritto: animais com IA de utilidade e uma cadeia alimentar por regiao.
//
// Fase 1 (IA): cada animal tem uma ficha de especie (SPECIES) e escolhe, a cada 0,3 s, a acao de maior nota
//   (fugir, pastar, buscar comida, cacar, espreitar, comer carcaca, investir, descansar, rondar, emboscar).
//   Mapa de perigo (vilas, fogueiras, tocha, lampioes) e movimento com colisao (paredes, moveis, agua).
// Fase 2 (regioes): o mundo e dividido em regioes de REG px com flora (pasto, frutinhas, cogumelos) e
//   populacoes em numeros; longe do jogador a regiao evolui sozinha (rebrota, pastoreio, nascimentos, fome,
//   caca, mortalidade, migracao); perto, os numeros viram animais de verdade e depois voltam a ser numeros.
//   Estado salvo no banco (world.fauna_region, via js/net.js) ou, sem servidor, no navegador.
// Fase 3 (cadeia): cervo, coelho e javali comem plantas; lobo caca cervo (e as vezes javali e coelho),
//   raposa caca coelho, urso come frutinhas e as vezes cervo/javali; javali investe em quem chega perto,
//   urso ataca quem invade o territorio; corvos aparecem nas carcacas e aceleram a decomposicao.
//   Arbustos de frutinhas e cogumelos sao a comida da regiao e o jogador colhe com [F].
// Listas: cervos em game.deers, lobos em game.wolves (desenho/combate antigos), o resto em game.critters.
(function () {
  const B = { P: 'plains', F: 'forest', D: 'dense_forest', H: 'hills', M: 'mountain' };
  // Ficha de especie. reg = parametros da simulacao "de numeros" (por segundo, por animal).
  //   diet: plantas/frutos que come (peso), prey: presas (peso), fears: quem faz fugir ('human' = jogador)
  //   temper: flee (foge), defend (investe se acuado), territorial (ataca quem chega perto), pack (matilha)
  const SPECIES = {
    deer: {
      name: 'Cervo', list: 'deers', biomes: [B.P, B.F, B.D, B.H], walk: 55, run: 230, radius: 11, w: 58, h: 68, hp: 20,
      sight: 260, herd: [3, 5], fear: { town: 1.0, light: 1.0 }, fears: ['wolf', 'bear', 'human'], temper: 'flee', tire: 3,
      hunger: 1 / 300, diet: { grass: 1, fruit: 0.6 },
      reg: { density: 7, birth: 0.0012, starve: 0.001, eat: { grass: 0.00025 } }
    },
    rabbit: {
      name: 'Coelho', biomes: [B.P, B.F, B.H], walk: 38, run: 255, radius: 6, w: 26, h: 22, hp: 4,
      sight: 190, herd: [1, 3], fear: { town: 0.8, light: 0.8 }, fears: ['fox', 'wolf', 'bear', 'human'], temper: 'flee', tire: 2,
      hunger: 1 / 240, diet: { grass: 1 },
      reg: { density: 9, birth: 0.0028, starve: 0.0015, eat: { grass: 0.00006 } }
    },
    boar: {
      name: 'Javali', biomes: [B.F, B.D], walk: 45, run: 205, radius: 12, w: 58, h: 42, hp: 30, dmg: 7,
      sight: 210, herd: [2, 4], fear: { town: 1.0, light: 0.7, fire: 0.8 }, fears: ['bear', 'wolf', 'human'], temper: 'defend', defendR: 95, tire: 4,
      hunger: 1 / 320, diet: { mushrooms: 1, fruit: 0.8, berries: 0.6, grass: 0.25 },
      reg: { density: 4, birth: 0.0009, starve: 0.0008, eat: { mushrooms: 0.00022, berries: 0.0001, grass: 0.00008 } }
    },
    wolf: {
      name: 'Lobo', list: 'wolves', biomes: [B.F, B.D, B.H, B.P], walk: 60, run: 215, radius: 11, w: 54, h: 60, hp: 35,
      sight: 150, scent: 1500, herd: [3, 4], fear: { town: 0.7, light: 0.45, fire: 1.0 }, fears: ['bear'], temper: 'pack',
      hunger: 1 / 900, hunt: 0.45, chase: 4.0, pounce: 15, prey: { deer: 1, boar: 0.4, rabbit: 0.5 }, carrion: true, ambush: true,
      reg: { kill: 0.0006, half: 1.5, value: { deer: 1, boar: 1.2, rabbit: 0.25 }, need: 0.0003, conv: 0.15, mort: 0.00002, max: 6,
        terr: (r) => 2 + r.pop.deer * 0.35 + (r.pop.boar || 0) * 0.3 + (r.pop.rabbit || 0) * 0.05, arrive: 0.00003, arriveIf: (r) => r.pop.deer > r.capS.deer * 0.7, start: [0.12, 3, 1.5] }
    },
    fox: {
      name: 'Raposa', biomes: [B.F, B.P, B.H], walk: 50, run: 240, radius: 8, w: 42, h: 32, hp: 12,
      sight: 95, scent: 700, herd: [1, 2], fear: { town: 0.9, light: 0.6, fire: 1.0 }, fears: ['wolf', 'bear', 'human'], temper: 'flee', tire: 3,
      hunger: 1 / 600, hunt: 0.4, chase: 2.5, pounce: 11, prey: { rabbit: 1 }, carrion: true,
      reg: { kill: 0.0012, half: 2, value: { rabbit: 1 }, need: 0.0007, conv: 0.2, mort: 0.00003, max: 3,
        terr: (r) => 1 + (r.pop.rabbit || 0) * 0.25, arrive: 0.00002, arriveIf: (r) => (r.pop.rabbit || 0) > 4, start: [0.25, 1, 1] }
    },
    bear: {
      name: 'Urso', biomes: [B.D, B.H, B.F, B.M], walk: 45, run: 205, radius: 16, w: 84, h: 74, hp: 120, dmg: 16,
      sight: 200, scent: 900, herd: [1, 1], fear: { town: 1.2, light: 0.3, fire: 0.6 }, fears: [], temper: 'territorial', territoryR: 150, tire: 5,
      hunger: 1 / 800, hunt: 0.7, chase: 3.0, pounce: 14, prey: { deer: 0.5, boar: 0.4 }, carrion: true, diet: { berries: 1, fruit: 1, mushrooms: 0.5 },
      reg: { density: 0.7, birth: 0.00012, starve: 0.0004, eat: { berries: 0.0003, mushrooms: 0.0001 }, kill: 0.00008, half: 2, start: [0.08, 1, 0] }
    },
    crow: { name: 'Corvo', w: 24, h: 18, hp: 2, radius: 5, fear: { town: 0, light: 0 }, fears: ['human'] }   // aparece nas carcacas (sem regiao)
  };
  const HERBIVORES = ['deer', 'rabbit', 'boar', 'bear'], PREDATORS = ['wolf', 'fox'];
  const KINDS = ['deer', 'rabbit', 'boar', 'wolf', 'fox', 'bear'];
  // lobo rondando gente: mais medo de entrar na vila que o normal (fica na borda, espreitando)
  const WOLF_AMBUSH = { ...SPECIES.wolf, name: 'LoboEspreita', fear: { ...SPECIES.wolf.fear, town: 1.2 } };
  const NEAR = 3200;              // limite de busca de lugar para nascer
  const REG = 1536;               // lado da regiao (px)
  const ACT_ON = 2400, ACT_OFF = 3000;   // regiao com o centro a essa distancia do jogador liga (animais de verdade) / desliga
  const STEP = 10;                // s entre passos da simulacao "de numeros"
  const SAVE_KEY = 'suritto_fauna_v2';
  // capacidade de cada planta por bioma (0..1) e rebrota (fracao da capacidade por segundo, no maximo)
  const PLANTS = {
    grass: { cap: { plains: 1, forest: 0.8, dense_forest: 0.45, hills: 0.6, shore: 0.1, desert: 0.05, canyon: 0.05, mountain: 0.1 }, regrow: 0.004 },
    berries: { cap: { forest: 0.6, dense_forest: 0.8, hills: 0.4, plains: 0.2, mountain: 0.15 }, regrow: 0.0015 },
    mushrooms: { cap: { dense_forest: 0.8, forest: 0.4, hills: 0.1 }, regrow: 0.003 }
  };

  // ruido deterministico por regiao (posicao das plantas)
  function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let s = seed || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }

  class Fauna {
    constructor(game) {
      this.game = game;
      this.t = 0;
      this._dc = new Map(); this._dcT = -1;       // cache do perigo por celula de 48 px
      this._tc = new Map();                        // cache do terreno por celula de 64 px
      this._lights = []; this._lightT = -1;
      this._herdSeq = 1;
      this.regions = new Map();                    // "rx,ry" -> regiao (ver regionsUpdate)
      this.plants = [];                            // arbustos e cogumelos das regioes ligadas (desenho e colheita)
      this._step = 0; this._sec = 0; this._life = 0; this._saveT = 0;
      if (!game.critters) game.critters = [];
      this.load();
    }
    static get SPECIES() { return SPECIES; }

    // ---------------- mundo ----------------
    wd(a, b) { const W = this.game.world; return W ? W.wrapDelta(a - b) : a - b; }
    dist(e, x, y) { return Math.hypot(this.wd(x, e.x), y - e.y); }
    night() { const h = this.game.timeSystem && this.game.timeSystem.virtualDate ? this.game.timeSystem.virtualDate.getHours() : 12; return h >= 19 || h < 6; }
    terrain(x, y) {               // tipo do terreno, com cache por celula de 64 px (o modelo de terreno e caro)
      const W = this.game.world; if (!W || !W.getTerrainAt) return { type: 'plains', isWater: false };
      const k = Math.round(W.wrapX(x) / 64) + ',' + Math.round(y / 64);
      let v = this._tc.get(k);
      if (!v) { const t = W.getTerrainAt(x, y); v = { type: t.type, isWater: t.isWater }; this._tc.set(k, v); if (this._tc.size > 4000) this._tc.delete(this._tc.keys().next().value); }
      return v;
    }
    blocked(x, y, r) {
      if (this.terrain(x, y).isWater) return true;
      const A = this.game.architect;
      return !!(A && A.isSolidAt && A.isSolidAt(x, y, r, 0));
    }
    biome(x, y) { return this.terrain(x, y).type; }
    list(kind) { const g = this.game; return kind === 'deer' ? g.deers : kind === 'wolf' ? g.wolves : g.critters; }

    // Fontes de luz/fogo perto do jogador (refeito 1x por segundo)
    lights() {
      if (this.t - this._lightT < 1) return this._lights;
      this._lightT = this.t;
      const g = this.game, P = g.player, out = [];
      for (const c of g.campfires || []) out.push({ x: c.x, y: c.y, r: 280, fire: true });
      if (P && (P.torchLit || P.equippedWeapon === 'fire_sword')) out.push({ x: P.x, y: P.y, r: 230, fire: true, player: true });
      const A = g.architect;
      if (A && A._furnList && P) for (const f of A._furnList()) {
        if (!f.cfg.light || Math.abs(this.wd(f.b.wx, P.x)) > 2600 || Math.abs(f.b.wy - P.y) > 1800) continue;
        out.push({ x: f.b.wx, y: f.b.wy, r: Math.max(180, (f.cfg.light.r || 200) * 0.9), fire: f.cfg.furn === 'brazier' || f.cfg.furn === 'fireplace' });
      }
      return (this._lights = out);
    }
    // Vila: 1 dentro, caindo ate 0 a ~14 celulas da borda
    townDanger(x, y) {
      const T = window.SURITTO_TOWNS; if (!T) return 0;
      let best = 0;
      for (const id in T) {
        if (id.charAt(0) === '_') continue;
        const t = T[id]; if (!t._bounds && window.TownBuilder) t._bounds = window.TownBuilder.bounds(t);
        const Bd = t._bounds; if (!Bd) continue;
        const dx = this.wd(x, t.center.x), dy = y - t.center.y;
        const a = (dx / 54 + dy / 27) / 2 + 0.5, b = (dy / 27 - dx / 54) / 2 + 0.5;
        const da = Math.max(Bd.i0 - a, 0, a - Bd.i1), db = Math.max(Bd.j0 - b, 0, b - Bd.j1), d = Math.hypot(da, db);
        best = Math.max(best, d <= 0 ? 1 : Math.max(0, 1 - d / 14));
      }
      return best;
    }
    // Perigo do ponto para a especie (0 = tranquilo, 1+ = nao chega perto)
    danger(x, y, sp) {
      if (this.t - this._dcT > 1) { this._dc.clear(); this._dcT = this.t; }
      const k = sp.name + Math.round(x / 48) + ',' + Math.round(y / 48);
      let v = this._dc.get(k); if (v !== undefined) return v;
      v = this.townDanger(x, y) * sp.fear.town;
      const nt = this.night();
      for (const L of this.lights()) {
        const d = Math.hypot(this.wd(x, L.x), y - L.y); if (d >= L.r) continue;
        const f = 1 - d / L.r;
        const w = L.fire && sp.fear.fire ? sp.fear.fire : sp.fear.light * (nt ? 1 : 0.35);
        v = Math.max(v, f * w * 1.2);
      }
      this._dc.set(k, v);
      return v;
    }
    // Direcao que desce o perigo (amostra em volta)
    away(x, y, sp) {
      let gx = 0, gy = 0;
      for (let a = 0; a < 8; a++) {
        const c = Math.cos(a * Math.PI / 4), s = Math.sin(a * Math.PI / 4);
        const d = this.danger(x + c * 90, y + s * 45, sp);
        gx -= c * d; gy -= s * d;
      }
      const n = Math.hypot(gx, gy); return n < 1e-6 ? null : [gx / n, gy / n];
    }

    // ---------------- criar animais ----------------
    spot(sp, cx, cy, r0, r1) {
      for (let k = 0; k < 60; k++) {
        const a = Math.random() * Math.PI * 2, r = Math.min(NEAR - 250, r0 + Math.random() * (r1 - r0) * (1 + k / 25));
        const x = this.game.world ? this.game.world.wrapX(cx + Math.cos(a) * r) : cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.8;
        if (!sp.biomes.includes(this.biome(x, y))) continue;
        if (this.danger(x, y, sp) > 0.05 || this.blocked(x, y, sp.radius + 6)) continue;
        return { x, y };
      }
      return null;
    }
    make(kind, x, y, herd) {
      const sp = SPECIES[kind];
      const e = { id: Date.now() + Math.random(), kind, x, y, width: sp.w, height: sp.h, hp: sp.hp, maxHp: sp.hp,
        speed: sp.walk, fleeSpeed: sp.run, chaseSpeed: sp.run, direction: Math.random() > 0.5 ? 'left' : 'right',
        state: kind === 'deer' ? 'grazing' : 'patrol', frameIndex: 0, animTimer: 0, animSpeed: 0.16, timer: 2, fleeTimer: 0,
        herd, hunger: sp.prey ? 0.3 + Math.random() * 0.3 : Math.random() * 0.4, act: 'idle', think: Math.random() * 0.3,
        heading: Math.random() * Math.PI * 2, stuck: 0 };
      return e;
    }
    spawnGroup(kind, cx, cy, r0, r1) {           // (testes) grupo perto de um ponto
      const sp = SPECIES[kind], p = this.spot(sp, cx, cy, r0, r1); if (!p) return 0;
      const n = sp.herd[0] + Math.floor(Math.random() * (sp.herd[1] - sp.herd[0] + 1)), herd = this._herdSeq++;
      let made = 0;
      for (let i = 0; i < n; i++) {
        const q = this.spot(sp, p.x, p.y, 0, 90) || (i === 0 ? p : null); if (!q) continue;
        const e = this.make(kind, q.x, q.y, herd); e.home = { x: p.x, y: p.y }; this.list(kind).push(e); made++;
      }
      return made;
    }

    // ---------------- regioes ----------------
    // Cada regiao guarda: capacidade de cada planta pelo bioma (cap), quanto tem (plants), capacidade de cada especie
    // de herbivoro pela comida (capS), populacao (pop) e fome media (hun) de cada especie. Ver tickRegion.
    rkey(x, y) { const W = this.game.world, X = W ? W.wrapX(x) : x; return Math.floor(X / REG) + ',' + Math.floor(y / REG); }
    rcenter(key) { const [rx, ry] = key.split(',').map(Number); return { x: (rx + 0.5) * REG, y: (ry + 0.5) * REG }; }
    region(key) {
      let r = this.regions.get(key); if (r) return r;
      const [rx, ry] = key.split(',').map(Number);
      const cap = { grass: 0, berries: 0, mushrooms: 0 }, bio = {};
      let town = 0;
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        const x = (rx + (a + 0.5) / 4) * REG, y = (ry + (b + 0.5) / 4) * REG, t = this.biome(x, y);
        for (const p in PLANTS) cap[p] += (PLANTS[p].cap[t] || 0) / 16;
        bio[t] = (bio[t] || 0) + 1 / 16; town = Math.max(town, this.townDanger(x, y));
      }
      const hab = cap.grass * (1 - town);
      r = { key, cap, town, hab, plants: {}, capS: {}, pop: {}, hun: {}, birth: {}, active: false };
      for (const p in PLANTS) r.plants[p] = cap[p] * (0.7 + Math.random() * 0.3);
      // capacidade de cada herbivoro: densidade x comida que ele come na regiao x fracao do bioma que ele habita x longe de vila
      for (const k of HERBIVORES) {
        const sp = SPECIES[k], d = sp.diet; let food = 0, w = 0;
        for (const f in d) if (PLANTS[f]) { food += d[f] * cap[f]; w += d[f]; }
        const live = sp.biomes.reduce((s, t) => s + (bio[t] || 0), 0);
        r.capS[k] = Math.round(sp.reg.density * (w ? food / w : 0) * Math.min(1, live * 1.3) * (1 - town) * 10) / 10;
        r.pop[k] = r.capS[k] * (0.5 + Math.random() * 0.4);
      }
      for (const k of PREDATORS) {
        const s = SPECIES[k].reg.start;
        const good = k === 'wolf' ? hab > 0.35 : (r.capS.rabbit || 0) > 3;
        r.pop[k] = good && Math.random() < s[0] ? s[1] + Math.random() * s[2] : 0;
        r.hun[k] = 0.4;
      }
      if (r.capS.bear >= 0.4 && Math.random() < SPECIES.bear.reg.start[0] * 4) r.pop.bear = 1; else r.pop.bear = 0;
      r.hun.bear = 0.4;
      const saved = this._saved && this._saved[key];
      if (saved) {
        Object.assign(r.plants, saved.plants || {}); Object.assign(r.pop, saved.pop || {}); Object.assign(r.hun, saved.hunger || {});
        for (const p in r.plants) r.plants[p] = Math.min(r.cap[p], r.plants[p]);
      }
      this.regions.set(key, r);
      return r;
    }
    // Vizinhas (4 lados). So cria regiao nova ate 8 regioes do jogador (o mapa de regioes nao cresce sem fim)
    neighbors(key) {
      const [rx, ry] = key.split(',').map(Number), out = [], P = this.game.player;
      const [prx, pry] = this.rkey(P.x, P.y).split(',').map(Number);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = (rx + dx) + ',' + (ry + dy);
        if (this.regions.has(k) || (Math.abs(rx + dx - prx) <= 8 && Math.abs(ry + dy - pry) <= 8)) out.push(this.region(k));
      }
      return out;
    }
    food(r, kind = 'deer') {      // quanto da comida da especie a regiao tem agora (0..1)
      const d = SPECIES[kind].diet; let f = 0, w = 0;
      for (const p in d) if (PLANTS[p] && r.cap[p] > 0.01) { f += d[p] * r.plants[p] / r.cap[p]; w += d[p]; }
      return w ? f / w : 0;
    }
    // Simulacao "de numeros" de uma regiao por dt segundos
    tickRegion(r, dt) {
      for (const p in PLANTS) {                                                     // rebrota (devagar quando rapado)
        const c = r.cap[p]; if (c <= 0) continue;
        const f = r.plants[p] / c;
        r.plants[p] = Math.min(c, r.plants[p] + c * PLANTS[p].regrow * dt * (1 - f) * (0.3 + f));
      }
      if (r.active) return;                                                         // perto do jogador: os animais de verdade cuidam do resto
      // herbivoros: comem, nascem quando tem comida, morrem de fome sem
      for (const k of HERBIVORES) {
        const sp = SPECIES[k], n = r.pop[k]; if (!(n > 0)) continue;
        for (const p in sp.reg.eat) r.plants[p] = Math.max(0, r.plants[p] - n * sp.reg.eat[p] * dt);
        const f = this.food(r, k);
        let m = n + n * sp.reg.birth * dt * Math.max(0, f - 0.35) / 0.65 - n * sp.reg.starve * dt * Math.max(0, 0.2 - f) / 0.2;
        if (k === 'bear') m = Math.min(m, Math.max(1, r.capS.bear * 1.5)); else m = Math.min(m, Math.max(r.capS[k] * 1.5, 1));
        r.pop[k] = Math.max(0, m < 0.05 ? 0 : m);
      }
      // predadores: cacam (presa/(presa+meio) = acham menos quando ha pouca), crescem com caca, minguam sem, morrem de velhice
      for (const k of PREDATORS) {
        const sp = SPECIES[k], R = sp.reg, n = r.pop[k]; if (!(n > 0)) continue;
        let fed = 0;
        for (const p in sp.prey) {
          const q = r.pop[p] || 0; if (q <= 0) continue;
          const kills = Math.min(q, n * R.kill * sp.prey[p] * dt * q / (q + R.half));
          r.pop[p] = q - kills; fed += kills * (R.value[p] || 1);
        }
        r.hun[k] = Math.max(0, Math.min(1, r.hun[k] + dt * sp.hunger - fed / n * 0.75));
        let m = n + (fed - n * R.need * dt) * R.conv - n * R.mort * dt;
        if (m < 0.5) m = 0;
        r.pop[k] = Math.min(R.max, m, R.terr(r));                                  // territorio: nao cabe mais do que a caca sustenta
      }
      // urso tambem pega um cervo/javali de vez em quando
      if (r.pop.bear > 0) for (const p in SPECIES.bear.prey) {
        const q = r.pop[p] || 0; if (q > 0) r.pop[p] = q - Math.min(q, r.pop.bear * SPECIES.bear.reg.kill * SPECIES.bear.prey[p] * dt * q / (q + 2));
      }
      // predador de fora chega numa regiao boa sem a especie (a area simulada nao e isolada)
      for (const k of PREDATORS) {
        const R = SPECIES[k].reg;
        if (r.pop[k] === 0 && r.hab > 0.3 && R.arriveIf(r) && Math.random() < dt * R.arrive && !this.neighbors(r.key).some(o => o.pop[k] > 0)) { r.pop[k] = R.start[1] + Math.random() * R.start[2]; r.hun[k] = 0.5; }
      }
      // migracao: herbivoro sem comida procura a vizinha com mais comida; predador sem caca vai atras dela
      for (const k of HERBIVORES) {
        const f = this.food(r, k); if (f >= 0.3 || !(r.pop[k] > 1)) continue;
        const n = this.neighbors(r.key).filter(o => !o.active && o.capS[k] > 0).sort((a, b) => this.food(b, k) * b.capS[k] - this.food(a, k) * a.capS[k])[0];
        if (n && this.food(n, k) > f) { const m = r.pop[k] * 0.1; r.pop[k] -= m; n.pop[k] += m; }
      }
      for (const k of PREDATORS) {
        const main = Object.keys(SPECIES[k].prey)[0];
        if (!(r.pop[k] > 0) || (r.pop[main] || 0) >= r.pop[k]) continue;
        const n = this.neighbors(r.key).filter(o => !o.active && o.pop[k] + r.pop[k] <= SPECIES[k].reg.max).sort((a, b) => (b.pop[main] || 0) - (a.pop[main] || 0))[0];
        if (n && (n.pop[main] || 0) > (r.pop[main] || 0) + 1) { n.hun[k] = n.pop[k] > 0 ? (n.hun[k] * n.pop[k] + r.hun[k] * r.pop[k]) / (n.pop[k] + r.pop[k]) : r.hun[k]; n.pop[k] += r.pop[k]; r.pop[k] = 0; }
      }
    }
    // Uma regiao chega perto do jogador: os numeros viram grupos dentro dela, e as plantas aparecem
    materialize(r) {
      r.active = true;
      const c = this.rcenter(r.key), P = this.game.player;
      const inRegion = (sp) => {
        for (let k = 0; k < 40; k++) {
          const x = c.x + (Math.random() - 0.5) * REG, y = c.y + (Math.random() - 0.5) * REG;
          if (this.dist(P, x, y) < 750 || !sp.biomes.includes(this.biome(x, y))) continue;
          if (this.danger(x, y, sp) > 0.05 || this.blocked(x, y, sp.radius + 6)) continue;
          return { x: this.game.world ? this.game.world.wrapX(x) : x, y };
        }
        return null;
      };
      const group = (kind, n) => {
        const sp = SPECIES[kind], p = inRegion(sp); if (!p) return 0;
        const herd = this._herdSeq++, list = this.list(kind);
        let made = 0;
        for (let i = 0; i < n; i++) {
          const q = i === 0 ? p : this.spot(sp, p.x, p.y, 0, 90); if (!q) continue;
          const e = this.make(kind, q.x, q.y, herd);
          e.home = { x: c.x, y: c.y };                              // territorio = centro da regiao onde nasceu
          if (sp.prey) e.hunger = Math.min(1, Math.max(0, (r.hun[kind] || 0.4) + (Math.random() - 0.5) * 0.15));
          list.push(e); made++;
        }
        return made;
      };
      for (const k of KINDS) {
        const sp = SPECIES[k]; let n = Math.floor(r.pop[k] || 0);
        if (k === 'wolf' || k === 'fox' || k === 'bear') { if (n > 0) r.pop[k] -= group(k, n); continue; }   // matilha / solitario: um grupo so
        while (n > 0) { const g = Math.min(n, sp.herd[0] + Math.floor(Math.random() * (sp.herd[1] - sp.herd[0] + 1))), m = group(k, g); if (!m) break; n -= g; r.pop[k] -= m; }
        r.pop[k] = Math.max(0, r.pop[k]);
      }
      this.plantsFor(r);
    }
    // Arbustos de frutinhas e cogumelos: lugares fixos por regiao (mesma semente sempre), quantos pela capacidade
    plantsFor(r) {
      const rand = rng(hash(r.key)), c = this.rcenter(r.key), out = [];
      const put = (kind, n, biomes) => {
        for (let i = 0, tries = 0; i < n && tries < n * 6; tries++) {
          const x = c.x + (rand() - 0.5) * REG, y = c.y + (rand() - 0.5) * REG, t = this.biome(x, y);
          if (!biomes.includes(t) || this.townDanger(x, y) > 0.2 || this.blocked(x, y, 14)) continue;
          out.push({ kind, x: this.game.world ? this.game.world.wrapX(x) : x, y, reg: r.key, seed: rand() }); i++;
        }
      };
      put('bush', Math.round(r.cap.berries * 9), [B.F, B.D, B.H, B.P, B.M]);
      put('mushroom', Math.round(r.cap.mushrooms * 10), [B.D, B.F, B.H]);
      this.plants = this.plants.filter(p => p.reg !== r.key).concat(out);
    }
    // Quanto um arbusto/cogumelo tem agora (0..1): o nivel da planta na regiao
    plantLevel(p) { const r = this.regions.get(p.reg); if (!r) return 0; const k = p.kind === 'bush' ? 'berries' : 'mushrooms'; return r.cap[k] > 0 ? r.plants[k] / r.cap[k] : 0; }
    // Comer / colher de uma planta: tira da regiao (amt = fracao da capacidade)
    takePlant(p, amt) {
      const r = this.regions.get(p.reg); if (!r) return 0;
      const k = p.kind === 'bush' ? 'berries' : 'mushrooms', have = r.plants[k], take = Math.min(have, r.cap[k] * amt);
      r.plants[k] = have - take; return r.cap[k] > 0 ? take / (r.cap[k] * amt) : 0;
    }
    // Um animal sai do jogo e vira numero na regiao (a onde esta, ou a dada)
    dissolve(e, list, i, into) {
      const r = into || this.region(this.rkey(e.x, e.y)), k = e.kind;
      if (k === 'crow') { list.splice(i, 1); return; }
      if (SPECIES[k].prey) r.hun[k] = r.pop[k] > 0 ? (r.hun[k] * r.pop[k] + e.hunger) / (r.pop[k] + 1) : e.hunger;
      r.pop[k] = (r.pop[k] || 0) + 1;
      list.splice(i, 1);
    }
    // A cada segundo: liga as regioes que chegaram perto, desliga as que ficaram longe, devolve quem saiu da area
    regionsUpdate() {
      const g = this.game, P = g.player;
      const [prx, pry] = this.rkey(P.x, P.y).split(',').map(Number);
      const want = new Set();
      for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
        const key = (prx + dx) + ',' + (pry + dy), c = this.rcenter(key);
        const d = Math.hypot(this.wd(c.x, P.x), c.y - P.y), r = this.regions.get(key);
        if (d < ACT_ON || (r && r.active && d < ACT_OFF)) want.add(key);
      }
      for (const r of this.regions.values()) if (r.active && !want.has(r.key)) { r.active = false; this.plants = this.plants.filter(p => p.reg !== r.key); }
      for (const key of want) { const r = this.region(key); if (!r.active) this.materialize(r); }
      for (const list of [g.deers, g.wolves, g.critters]) for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].kind === 'crow') continue;
        const r = this.region(this.rkey(list[i].x, list[i].y));
        if (!r.active) this.dissolve(list[i], list, i, r);
      }
    }
    // Nascimentos e fome dos animais de verdade (regioes perto do jogador), a cada 30 s
    activeLife(dt) {
      const g = this.game, P = g.player, by = new Map();
      for (const list of [g.deers, g.critters]) for (const d of list) {
        if (!HERBIVORES.includes(d.kind) || d.kind === 'bear') continue;
        const k = d.kind + '|' + this.rkey(d.x, d.y); if (!by.has(k)) by.set(k, []); by.get(k).push(d);
      }
      for (const [k, list] of by) {
        const [kind, rk] = k.split('|'), r = this.region(rk), sp = SPECIES[kind]; if (list.length < 2) continue;
        r.birth[kind] = (r.birth[kind] || 0) + list.length * sp.reg.birth * dt * Math.max(0, this.food(r, kind) - 0.35) / 0.65;
        if (r.birth[kind] >= 1 && list.length < r.capS[kind] * 1.5) {
          r.birth[kind] -= 1;
          const m = list[Math.floor(Math.random() * list.length)], q = this.spot(sp, m.x, m.y, 10, 60);
          if (q) {
            const f = this.make(kind, q.x, q.y, m.herd); f.home = m.home; this.list(kind).push(f);
            if (this.dist(m, P.x, P.y) < 900) g.addLog(kind === 'deer' ? '🦌 Um filhote nasceu na manada de cervos.' : kind === 'rabbit' ? '🐇 Nasceram filhotes de coelho na toca.' : '🐗 Um leitão nasceu no bando de javalis.', 'system');
          }
        }
      }
      // faminto demais por muito tempo: vai embora (migra para a vizinha melhor)
      for (const list of [g.deers, g.wolves, g.critters]) for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i]; if (e.kind === 'crow') continue;
        const pred = !!SPECIES[e.kind].prey && e.kind !== 'bear';
        e.starve = e.hunger >= 0.99 ? (e.starve || 0) + dt : 0;
        if (e.starve < (pred ? 480 : 120)) continue;
        const ns = this.neighbors(this.rkey(e.x, e.y)).filter(o => !o.active); if (!ns.length) continue;
        const main = pred ? Object.keys(SPECIES[e.kind].prey)[0] : null;
        const to = pred ? ns.sort((a, b) => (b.pop[main] || 0) - (a.pop[main] || 0))[0] : ns.sort((a, b) => this.food(b, e.kind) - this.food(a, e.kind))[0];
        if (e.kind === 'wolf' && this.dist(e, P.x, P.y) < 1500 && this.t - (this._leftMsg || -1e9) > 120) { this._leftMsg = this.t; g.addLog('🐺 A matilha faminta partiu em busca de caça em outra região.', 'tip'); }
        this.dissolve(e, list, i, to);
      }
    }

    // ---------------- salvar ----------------
    // Regioes perto (40 em volta); os animais de verdade contam na regiao onde estao
    snapshot() {
      const out = {}, P = this.game.player, [prx, pry] = this.rkey(P.x, P.y).split(',').map(Number);
      const live = new Map();
      for (const list of [this.game.deers, this.game.wolves, this.game.critters]) for (const e of list) {
        if (e.kind === 'crow' || !e.kind) continue;
        const k = this.rkey(e.x, e.y); if (!live.has(k)) live.set(k, {});
        const v = live.get(k); v[e.kind] = v[e.kind] || [0, 0]; v[e.kind][0]++; v[e.kind][1] += e.hunger || 0;
      }
      for (const r of this.regions.values()) {
        const [rx, ry] = r.key.split(',').map(Number); if (Math.abs(rx - prx) > 40 || Math.abs(ry - pry) > 40) continue;
        const v = live.get(r.key) || {}, pop = {}, hunger = {}, plants = {};
        for (const p in r.plants) plants[p] = +r.plants[p].toFixed(3);
        for (const k of KINDS) {
          const lv = v[k] || [0, 0], n = (r.pop[k] || 0) + lv[0];
          pop[k] = +n.toFixed(2);
          if (SPECIES[k].prey) hunger[k] = +(n > 0 ? ((r.hun[k] || 0) * (r.pop[k] || 0) + lv[1]) / n : (r.hun[k] || 0.4)).toFixed(2);
        }
        out[r.key] = { plants, pop, hunger };
      }
      return out;
    }
    save(keepalive) {
      const out = this.snapshot(), S = window.SurittoServer;
      if (S && S.online && S.fauna) S.saveFauna(out, keepalive).catch(() => { });
      try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, regions: out })); } catch (e) { }
    }
    load() {
      const S = window.SurittoServer;
      let local = null;
      try { const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (d && d.regions) local = d.regions; } catch (e) { }
      if (S && S.online && S.fauna) {
        this._saved = S.fauna;
        // primeira vez no banco: sobe o que este navegador ja tinha
        if (!Object.keys(S.fauna).length && local) { this._saved = local; S.saveFauna(local).catch(() => { }); }
      } else this._saved = local;
      if (!this._hooked) {
        this._hooked = true;
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') this.save(true); });
      }
    }
    // Linha "Pasto da regiao" no painel do ecossistema e as contagens
    hud() {
      const g = this.game, el = document.getElementById('pasture-count');
      if (el) { const P = g.player, r = this.region(this.rkey(P.x, P.y)); el.innerText = r.cap.grass < 0.05 ? 'sem pasto' : Math.round(r.plants.grass / r.cap.grass * 100) + '%'; }
      if (g.deerCountEl) g.deerCountEl.innerText = g.deers.length;
      if (g.wolfCountEl) g.wolfCountEl.innerText = g.wolves.length;
      const oc = document.getElementById('critter-count');
      if (oc) { const c = {}; for (const e of g.critters) c[e.kind] = (c[e.kind] || 0) + 1; oc.innerText = `🐇${c.rabbit || 0} 🦊${c.fox || 0} 🐗${c.boar || 0} 🐻${c.bear || 0}`; }
    }

    // ---------------- movimento ----------------
    move(e, vx, vy, dt) {
      const sp = SPECIES[e.kind] || SPECIES.deer, r = sp.radius, W = this.game.world;
      const nx = e.x + vx * dt, ny = e.y + vy * dt;
      const inside = this.blocked(e.x, e.y, r);                 // preso dentro de algo (nasceu antes das paredes): deixa sair
      let ok = false;
      if (inside || !this.blocked(nx, ny, r)) { e.x = nx; e.y = ny; ok = true; }
      else if (!this.blocked(nx, e.y, r)) { e.x = nx; ok = true; }
      else if (!this.blocked(e.x, ny, r)) { e.y = ny; ok = true; }
      if (W) e.x = W.wrapX(e.x);
      if (!ok) { e.stuck += dt; e.heading += Math.PI * (0.5 + Math.random()); } else e.stuck = Math.max(0, e.stuck - dt);
      const sp2 = Math.hypot(vx, vy);
      if (sp2 > 1) {
        const deg = Math.atan2(vy, vx) * 180 / Math.PI;
        if (e.kind === 'deer') e.direction = deg >= -45 && deg <= 45 ? 'right' : deg > 45 && deg <= 135 ? 'down' : (deg < -135 || deg > 135) ? 'left' : 'up';
        else e.direction = vx >= 0 ? 'right' : 'left';
        e.animTimer += dt;
        const step = sp2 > 150 ? 0.08 : (e.kind === 'wolf' ? 0.14 : e.animSpeed || 0.16);
        if (e.animTimer >= step) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
      }
      return ok;
    }
    // Velocidade de passeio em bando: o lider vagueia (voltando para o territorio), os outros seguem com afastamento
    herdVel(e, list, speed) {
      let leader = e;
      for (const o of list) if (o.herd === e.herd && o.kind === e.kind) { leader = o; break; }
      let vx, vy;
      if (leader === e) {
        e.heading += (Math.random() - 0.5) * 0.6;
        if (e.home) {
          const hx = this.wd(e.home.x, e.x), hy = e.home.y - e.y, hd = Math.hypot(hx, hy);
          if (hd > REG * 0.45) { const want = Math.atan2(hy, hx); let da = want - e.heading; da = Math.atan2(Math.sin(da), Math.cos(da)); e.heading += da * Math.min(1, (hd - REG * 0.45) / 400) * 0.25; }
        }
        vx = Math.cos(e.heading) * speed; vy = Math.sin(e.heading) * speed * 0.6;
      } else {
        const dx = this.wd(leader.x, e.x), dy = leader.y - e.y, d = Math.hypot(dx, dy) || 1;
        const k = d > 140 ? 1.25 : d > 70 ? 0.7 : 0.15;
        vx = dx / d * speed * k; vy = dy / d * speed * k;
        e.heading += (Math.random() - 0.5) * 0.4;
        vx += Math.cos(e.heading) * speed * 0.35; vy += Math.sin(e.heading) * speed * 0.2;
      }
      const sep = (SPECIES[e.kind].radius || 10) * 4;
      for (const o of list) {                                   // separacao: nao amontoar
        if (o === e || o.kind !== e.kind) continue;
        const dx = this.wd(e.x, o.x), dy = e.y - o.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < sep) { vx += dx / d * speed * (sep - d) / 30; vy += dy / d * speed * (sep - d) / 30; }
      }
      return [vx, vy];
    }
    // Soma o empurrao para fora do perigo (vila, luz) quando ele aparece
    avoid(e, sp, vx, vy, speed) {
      const d = this.danger(e.x, e.y, sp); if (d < 0.08) return [vx, vy, d];
      const a = this.away(e.x, e.y, sp); if (!a) return [vx, vy, d];
      const k = Math.min(1.6, d * 2);
      return [vx * (1 - Math.min(0.9, d)) + a[0] * speed * k, vy * (1 - Math.min(0.9, d)) + a[1] * speed * k, d];
    }

    // ---------------- cerebro (todas as especies) ----------------
    // Ameaca mais perto: especie temida (lobo espreitando devagar quase nao e notado) ou o jogador
    threatOf(e, sp, by) {
      const g = this.game, P = g.player;
      let threat = null, td = 1e9;
      for (const k of sp.fears) {
        if (k === 'human') continue;
        for (const w of by[k] || []) {
          if (w.act === 'rest') continue;
          const r = w.act === 'hunt' || w.act === 'ambush' || w.act === 'flee' || w.act === 'charge' ? sp.sight : w.act === 'stalk' ? sp.sight * 0.42 : sp.sight * 0.7;
          const d = this.dist(e, w.x, w.y); if (d < r && d < td) { td = d; threat = w; }
        }
      }
      if (sp.fears.includes('human')) {
        const pd = this.dist(e, P.x, P.y), pr = P.isRunning || P.isAttacking ? sp.sight * 0.77 : sp.sight * 0.52;
        if (pd < pr && pd < td) { td = pd; threat = P; }
      }
      return [threat, td];
    }
    // Comida mais perto que a especie come: fruto no chao, arbusto com frutinhas, cogumelo
    nearestFood(e, sp) {
      const g = this.game, d = sp.diet || {}; let best = null, bd = 300;
      if (d.fruit) for (const f of g.fruitsOnGround) { const k = this.dist(e, f.x, f.y); if (k < bd && this.danger(f.x, f.y, sp) < 0.3) { bd = k; best = { type: 'fruit', o: f, x: f.x, y: f.y }; } }
      for (const p of this.plants) {
        if (!(p.kind === 'bush' ? d.berries : d.mushrooms) || this.plantLevel(p) < 0.2) continue;
        const k = this.dist(e, p.x, p.y); if (k < bd && this.danger(p.x, p.y, sp) < 0.3) { bd = k; best = { type: p.kind, o: p, x: p.x, y: p.y }; }
      }
      return best;
    }
    think(e, sp, by) {
      const g = this.game, P = g.player, pd = this.dist(e, P.x, P.y);
      const fiery = P.torchLit || P.equippedWeapon === 'fire_sword';
      const [threat, td] = this.threatOf(e, sp, by);
      // fogo perto (predadores e urso)
      let fire = null;
      if (sp.fear.fire) { let fd = 1e9; for (const L of this.lights()) if (L.fire) { const d = this.dist(e, L.x, L.y); if (d < L.r * 0.8 * sp.fear.fire && d < fd) { fd = d; fire = L; } } }
      // presa: a mais perto de qualquer especie que come
      let prey = null, dd = 1e9;
      if (sp.prey) for (const k in sp.prey) for (const q of by[k] || []) { const d = this.dist(e, q.x, q.y) / sp.prey[k]; if (d < dd) { dd = d; prey = q; } }
      const preyD = prey ? this.dist(e, prey.x, prey.y) : 1e9;
      const smell = prey && preyD < (sp.scent || 0), inSight = prey && preyD < sp.sight && this.danger(prey.x, prey.y, sp) < 0.5;
      // carcaca
      let carc = null;
      if (sp.carrion && e.hunger > 0.4) { let cd = (sp.scent || 600) * 0.6; for (const c of g.carcasses) { if (c.stage > 1) continue; const d = this.dist(e, c.x, c.y); if (d < cd) { cd = d; carc = c; } } }
      const food = sp.diet ? this.nearestFood(e, sp) : null;
      const r = this.region(this.rkey(e.x, e.y));
      const canGraze = sp.diet && sp.diet.grass && r.plants.grass > r.cap.grass * 0.15;
      const calm = (a) => (e.act === a && e.timer > 0 ? 0.3 : 0);
      const opts = [];
      // reacao a ameaca: fugir, ou investir (javali acuado / urso no territorio)
      if (sp.temper === 'territorial') {
        if (!fiery && pd < sp.territoryR && !(e.chargeCd > 0)) opts.push(['charge', 1.1]);
      } else if (sp.temper === 'defend' && threat && td < sp.defendR && !(e.chargeCd > 0) && (threat === P || threat.kind === 'wolf')) opts.push(['charge', 1.1]);
      opts.push(['flee', fire || (threat && !(sp.temper === 'territorial')) || e.fleeTimer > 0 ? 1 : 0]);
      if (sp.prey) {
        opts.push(['rest', e.hunger < 0.25 ? 0.75 : 0]);
        opts.push(['hunt', inSight && e.hunger > sp.hunt && !(e.tired > 0) ? 0.55 + e.hunger * 0.4 : 0]);
        opts.push(['stalk', smell && e.hunger > 0.2 ? 0.45 + e.hunger * 0.2 : 0]);
        if (sp.ambush) {
          const canAmbush = !smell && e.hunger > 0.6 && this.townDanger(P.x, P.y) < 0.4 && !fiery;
          opts.push(['ambush', canAmbush ? 0.5 + e.hunger * 0.45 : 0]);
        }
      }
      if (carc) opts.push(['scavenge', 0.5 + e.hunger * 0.3]);
      if (food && e.hunger > 0.2) opts.push(['forage', 0.55 + e.hunger * 0.2]);
      if (canGraze) opts.push(['graze', 0.25 + e.hunger * 0.45 + calm('graze')]);
      opts.push(['roam', (sp.prey ? 0.3 : 0.4) + calm('roam')]);
      let best = opts[0]; for (const o of opts) if (o[1] > best[1]) best = o;
      const was = e.act;
      if (best[0] !== was) {
        if (best[0] === 'flee' && was !== 'flee') { e.state = 'alert'; e.alertTimer = 0.35; e.fleeTimer = Math.max(e.fleeTimer || 0, 4); if (window.sounds && pd < 700 && e.kind === 'deer') window.sounds.playRustle(); }
        if (best[0] === 'hunt') e.chaseTimer = sp.chase;
        if (best[0] === 'roam' || best[0] === 'graze') e.timer = 3 + Math.random() * 4;
        if (best[0] === 'charge') { e.chargeT = 2.5; if (pd < 900) g.addLog(e.kind === 'bear' ? '🐻 O urso se ergueu e avançou para defender o território!' : '🐗 O javali bufou e partiu para cima!', 'warning'); }
        if (best[0] === 'ambush' && pd < 1200 && this.t - (this._ambushMsg || -1e9) > 60) { this._ambushMsg = this.t; g.addLog('🐺 Sem caça na região, a matilha faminta começou a rondar os humanos...', 'warning'); }
        e.act = best[0];
      }
      if (threat) e.threatSource = threat;
      e.prey = prey; e.fireSrc = fire; e.carc = carc; e.food = food;
      if (e.act === 'graze' || e.act === 'roam') { e.timer -= 0.3; if (e.timer <= 0) { e.act = e.act === 'graze' && !sp.prey ? 'roam' : (canGraze ? 'graze' : 'roam'); e.timer = 3 + Math.random() * 4; } }
    }
    animal(e, dt, by) {
      const g = this.game, sp = SPECIES[e.kind], P = g.player;
      e.hunger = Math.min(1, e.hunger + sp.hunger * dt);
      if (e.biteCd) e.biteCd = Math.max(0, e.biteCd - dt);
      if (e.chargeCd) e.chargeCd = Math.max(0, e.chargeCd - dt);
      if (e.tired > 0) e.tired -= dt;
      if ((e.think -= dt) <= 0) { e.think = 0.3; this.think(e, sp, by); }
      let vx = 0, vy = 0;
      const toward = (x, y, s) => { const dx = this.wd(x, e.x), dy = y - e.y, d = Math.hypot(dx, dy) || 1; return [dx / d * s, dy / d * s, d]; };
      if (e.act !== 'flee' && e.runT) e.runT = Math.max(0, e.runT - dt * 0.5);
      switch (e.act) {
        case 'flee': {
          if (e.state === 'alert' && (e.alertTimer -= dt) > 0 && !sp.prey) return;        // orelhas em pe
          e.state = 'fleeing'; e.fleeTimer = Math.max(0, (e.fleeTimer || 0) - dt); e.runT = (e.runT || 0) + dt;
          const t = e.fireSrc || e.threatSource || P, dx = this.wd(e.x, t.x), dy = e.y - t.y, d = Math.hypot(dx, dy) || 1;
          const tire = e.runT < (sp.tire || 3) ? 1 : Math.max(0.7, 1 - (e.runT - (sp.tire || 3)) * 0.12);   // cansa depois de alguns segundos
          const s = sp.prey && !e.fireSrc && t !== P ? e.fleeSpeed : (sp.prey ? 125 : e.fleeSpeed);
          vx = dx / d * s * tire; vy = dy / d * s * tire;
          if (!e.fireSrc) [vx, vy] = this.avoid(e, sp, vx, vy, s);                     // nao foge para dentro da vila
          if (d > sp.sight * 1.6 && e.fleeTimer <= 0) { e.act = 'roam'; e.threatSource = null; }
          break;
        }
        case 'charge': {                                        // investida: corre ate o alvo, golpeia uma vez e se afasta
          e.state = 'attack';
          const t = sp.temper === 'territorial' ? P : (e.threatSource || P);
          let d; [vx, vy, d] = toward(t.x, t.y, sp.run * 0.9);
          e.chargeT -= dt;
          if (d < 32 + sp.radius) {
            if (t === P) { P.hp = Math.max(0, P.hp - sp.dmg); if (window.sounds) window.sounds.playWolfBite(); g.addLog(e.kind === 'bear' ? `🐻 A patada do urso acertou em cheio (-${sp.dmg} HP)! Afaste-se do território dele!` : `🐗 O javali te acertou com as presas (-${sp.dmg} HP)!`, 'warning'); g.updateHUD(); }
            else if (t.hp !== undefined) { t.hp -= sp.dmg; t.act = 'flee'; t.fleeTimer = 3; t.threatSource = e; }
            e.chargeCd = sp.temper === 'territorial' ? 5 : 8; e.act = sp.temper === 'territorial' ? 'roam' : 'flee'; e.fleeTimer = 3; e.threatSource = t;
          } else if (e.chargeT <= 0) { e.chargeCd = 6; e.act = 'roam'; }
          break;
        }
        case 'rest': {
          e.state = 'satiated';
          [vx, vy] = this.avoid(e, sp, 0, 0, e.speed);
          if (Math.hypot(vx, vy) < 1) return;
          break;
        }
        case 'hunt': {
          if (!e.prey || !this.list(e.prey.kind).includes(e.prey)) { e.act = 'roam'; break; }
          e.state = 'hunting';
          e.chaseTimer -= dt;
          if (e.chaseTimer <= 0) {
            e.tired = 6; e.act = 'stalk';
            if (e.kind === 'wolf' && this.dist(e, P.x, P.y) < 900) g.addLog('🐺 O cervo disparou entre as árvores e despistou o lobo exausto!', 'tip');
            return;
          }
          let d; [vx, vy, d] = toward(e.prey.x, e.prey.y, e.chaseSpeed);
          if (d < 25 + sp.radius) { this.pounce(e, e.prey); return; }
          break;
        }
        case 'stalk': {
          if (!e.prey) { e.act = 'roam'; break; }
          e.state = 'patrol';
          const [tx, ty, d] = toward(e.prey.x, e.prey.y, e.speed);
          const near = e.hunger > 0.35 ? sp.sight * 0.8 : sp.sight * 1.9;           // com fome, chega perto rastejando
          const k = d > near + 120 ? 1 : d > near ? 0.55 : d < near - 60 ? -0.6 : 0.05;
          vx = tx * k; vy = ty * k;
          const [hx, hy] = this.herdVel(e, this.list(e.kind), e.speed * 0.5); vx += hx * 0.4; vy += hy * 0.4;
          [vx, vy] = this.avoid(e, sp, vx, vy, e.speed);
          break;
        }
        case 'scavenge': {
          const c = e.carc; if (!c || !g.carcasses.includes(c) || c.stage > 1) { e.act = 'roam'; break; }
          e.state = 'patrol';
          let d; [vx, vy, d] = toward(c.x, c.y, e.speed * 1.2);
          if (d < 22) { e.hunger = Math.max(0, e.hunger - (c.stage === 0 ? 0.5 : 0.3)); c.timer += 45; e.act = 'rest'; vx = vy = 0; }
          break;
        }
        case 'forage': {
          const f = e.food; if (!f) { e.act = 'roam'; break; }
          e.state = 'wandering';
          let d; [vx, vy, d] = toward(f.x, f.y, e.speed);
          if (d < 18 + sp.radius) {
            if (f.type === 'fruit') {
              const i = g.fruitsOnGround.indexOf(f.o); if (i !== -1) g.fruitsOnGround.splice(i, 1); else { e.act = 'roam'; break; }
              e.hunger = Math.max(0, e.hunger - 0.4);
              if (e.kind === 'deer' && this.dist(e, P.x, P.y) < 600) { if (window.sounds) window.sounds.playHarvest(); g.addLog('🦌 Um cervo silvestre encontrou um fruto caído e o comeu tranquilamente!', 'system'); g.updateHUD(); }
            } else e.hunger = Math.max(0, e.hunger - 0.45 * this.takePlant(f.o, 0.04));
            e.act = sp.diet.grass ? 'graze' : 'roam'; e.timer = 4; vx = vy = 0;
          }
          break;
        }
        case 'graze': {
          e.state = 'grazing';
          const r = this.region(this.rkey(e.x, e.y));
          if (r.plants.grass > r.cap.grass * 0.15) { e.hunger = Math.max(0, e.hunger - dt / 40); r.plants.grass = Math.max(0, r.plants.grass - dt * 0.0005 * (sp.reg.eat.grass / 0.00025)); }
          e.animTimer += dt; if (e.animTimer >= 0.25) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
          [vx, vy] = this.avoid(e, sp, 0, 0, e.speed);
          if (Math.hypot(vx, vy) < 1) return;
          break;
        }
        case 'ambush': {
          // ronda o humano: chega a ~260 px; de noite (ou faminto demais) ataca, mordendo e recuando
          const [tx, ty, d] = toward(P.x, P.y, e.chaseSpeed);
          const attack = (this.night() || e.hunger > 0.9) && this.townDanger(P.x, P.y) < 0.4;
          if (attack) {
            e.state = 'attack';
            if (e.biteCd > 4) { vx = -tx * 0.8; vy = -ty * 0.8; }
            else if (d > 34) { vx = tx; vy = ty; }
            else if (!e.biteCd) {
              e.biteCd = 6; P.hp = Math.max(0, P.hp - 8);
              if (window.sounds) window.sounds.playWolfBite();
              g.addLog('🐺 O lobo faminto saiu da mata e mordeu (-8 HP)! Acenda a tocha com [ 5 ]!', 'warning'); g.updateHUD();
            }
          } else {
            e.state = 'hunting';
            const k = d > 320 ? 0.45 : d < 240 ? -0.3 : 0;
            vx = tx * k; vy = ty * k;
            const [hx, hy] = this.herdVel(e, g.wolves, e.speed * 0.5); vx += hx * 0.3; vy += hy * 0.3;
            [vx, vy] = this.avoid(e, WOLF_AMBUSH, vx, vy, e.speed);
          }
          break;
        }
        default: {                                              // roam: passeia com o bando, longe do perigo
          e.state = e.kind === 'deer' ? 'wandering' : 'patrol';
          [vx, vy] = this.herdVel(e, this.list(e.kind), e.speed);
          [vx, vy] = this.avoid(e, sp, vx, vy, e.speed);
        }
      }
      this.move(e, vx, vy, dt);
    }
    // Bote: D20 >= pounce abate; senao a presa escapa com adrenalina e o predador cansa
    pounce(w, prey) {
      const g = this.game, P = g.player, sp = SPECIES[w.kind], seen = this.dist(w, P.x, P.y) < 900, list = this.list(prey.kind);
      if (Math.floor(Math.random() * 20) + 1 >= sp.pounce) {
        const i = list.indexOf(prey); if (i === -1) return;
        list.splice(i, 1);
        g.spawnCarcass(prey.x, prey.y);
        const c = g.carcasses[g.carcasses.length - 1]; if (c) { c.kind = prey.kind; c.scale = prey.kind === 'rabbit' ? 0.4 : prey.kind === 'boar' ? 0.85 : 1; }
        const meal = prey.kind === 'rabbit' ? (w.kind === 'fox' ? 0.9 : 0.25) : 0.75;
        for (const o of this.list(w.kind)) if (o.kind === w.kind && o.herd === w.herd) o.hunger = Math.max(0, o.hunger - meal);   // o bando come junto
        w.hunger = Math.max(0, w.hunger - meal); w.act = 'rest'; w.state = 'satiated';
        if (seen) {
          if (window.sounds && w.kind === 'wolf') { window.sounds.playWolfBite(); window.sounds.playWolfHowl(); }
          const names = { deer: 'um cervo', boar: 'um javali', rabbit: 'um coelho' };
          g.addLog(w.kind === 'fox' ? '🦊 Uma raposa deu o bote e pegou um coelho!' : w.kind === 'bear' ? `🐻 O urso derrubou ${names[prey.kind]}!` : `🐺 Um lobo predador saltou sobre ${names[prey.kind]} e o abateu! Carcaça fresca no solo.`, 'system');
        }
        g.updateHUD();
      } else {
        prey.act = 'flee'; prey.state = 'fleeing'; prey.fleeTimer = 6; prey.fleeSpeed = SPECIES[prey.kind].run * 1.15; prey.threatSource = w;
        w.tired = 5; w.act = 'stalk';
        if (window.sounds && seen) window.sounds.playRustle();
        if (seen && prey.kind === 'deer') g.addLog('🦌 O cervo saltou com agilidade acrobática e se esquivou do bote do lobo!', 'action');
      }
    }

    // ---------------- corvos ----------------
    // 2-3 corvos por carcaca perto do jogador: chegam voando, rodeiam, pousam e comem (a carcaca some mais rapido);
    // fogem quando o jogador chega perto e voltam depois. Sem carcaca, vao embora.
    crows(dt) {
      const g = this.game, P = g.player, list = g.critters;
      for (const c of g.carcasses) {
        if (c.stage > 1 || this.dist(c, P.x, P.y) > 1800) continue;
        const n = list.filter(o => o.kind === 'crow' && o.carc === c).length, want = 2 + (c.id ? Math.floor((c.id * 7) % 2) : 0);
        for (let i = n; i < want; i++) {
          const a = Math.random() * Math.PI * 2;
          list.push({ kind: 'crow', carc: c, x: c.x + Math.cos(a) * 700, y: c.y + Math.sin(a) * 400, z: 140, phase: Math.random() * 6, mode: 'arrive', t: 0, width: 24, height: 18, hp: 2, maxHp: 2, direction: 'left', frameIndex: 0, animTimer: 0 });
        }
      }
      for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i]; if (e.kind !== 'crow') continue;
        const c = e.carc, alive = c && g.carcasses.includes(c) && c.stage <= 1;
        e.t += dt; e.phase += dt * 3;
        e.animTimer += dt; if (e.animTimer > (e.z > 4 ? 0.09 : 0.3)) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
        const pd = this.dist(e, P.x, P.y);
        if (!alive || e.mode === 'leave') {
          e.mode = 'leave'; e.z = Math.min(160, e.z + dt * 60);
          const dx = this.wd(e.x, P.x), dy = e.y - P.y, d = Math.hypot(dx, dy) || 1; e.x += dx / d * 160 * dt; e.y += dy / d * 90 * dt;
          if (pd > 1400) list.splice(i, 1);
          continue;
        }
        if (pd < 130 && e.mode !== 'scared') { e.mode = 'scared'; e.t = 0; }
        let tx = c.x, ty = c.y, tz = 0, spd = 150;
        if (e.mode === 'arrive') { tz = 70; if (this.dist(e, c.x, c.y) < 80) { e.mode = 'circle'; e.t = 0; } }
        else if (e.mode === 'circle') { tx = c.x + Math.cos(e.phase) * 55; ty = c.y + Math.sin(e.phase) * 28; tz = 60; spd = 110; if (e.t > 4 + Math.random() * 2) { e.mode = 'land'; e.t = 0; } }
        else if (e.mode === 'land') { const a = (e.phase % 6.28); tx = c.x + Math.cos(a) * 22; ty = c.y + Math.sin(a) * 9; tz = 0; spd = 60; if (this.dist(e, tx, ty) < 6 && e.z < 2) { c.timer += dt * 1.5; if (e.t > 8 + Math.random() * 6) { e.mode = 'circle'; e.t = 0; } } }
        else if (e.mode === 'scared') { tz = 120; const dx = this.wd(e.x, P.x), dy = e.y - P.y, d = Math.hypot(dx, dy) || 1; tx = e.x + dx / d * 200; ty = e.y + dy / d * 120; spd = 190; if (e.t > 6 && pd > 260) { e.mode = 'arrive'; e.t = 0; } }
        const dx = this.wd(tx, e.x), dy = ty - e.y, d = Math.hypot(dx, dy);
        if (d > 1) { const s = Math.min(spd * dt, d); e.x += dx / d * s; e.y += dy / d * s; if (Math.abs(dx) > 2) e.direction = dx > 0 ? 'right' : 'left'; }
        e.z += Math.max(-80 * dt, Math.min(80 * dt, tz - e.z));
        if (this.game.world) e.x = this.game.world.wrapX(e.x);
      }
    }

    // ---------------- loop ----------------
    ensure(e, kind) {             // animal criado fora daqui (lobo de teste da cena, save antigo): completa os campos
      if (e.kind) return;
      const sp = SPECIES[kind];
      Object.assign(e, { kind, herd: e.herd || 0, hunger: 0.4, act: 'idle', think: 0, heading: Math.random() * 6.28, stuck: 0 });
      e.speed = e.speed || sp.walk; e.fleeSpeed = e.fleeSpeed || sp.run; e.chaseSpeed = e.chaseSpeed || sp.run;
      e.width = e.width || sp.w; e.height = e.height || sp.h; e.animTimer = e.animTimer || 0; e.frameIndex = e.frameIndex || 0;
    }
    update(dt) {
      const g = this.game; if (!g.player) return;
      dt = Math.min(dt, 0.1); this.t += dt;
      if ((this._sec -= dt) <= 0) { this._sec = 1; this.regionsUpdate(); this.hud(); }
      if ((this._step += dt) >= STEP) { for (const r of this.regions.values()) this.tickRegion(r, this._step); this._step = 0; }
      if ((this._life += dt) >= 30) { this.activeLife(this._life); this._life = 0; g.updateHUD(); }
      if ((this._saveT += dt) >= 30) { this._saveT = 0; this.save(); }
      for (const d of g.deers) this.ensure(d, 'deer');
      for (const w of g.wolves) this.ensure(w, 'wolf');
      const by = { deer: g.deers, wolf: g.wolves };
      for (const e of g.critters) if (e.kind !== 'crow') (by[e.kind] = by[e.kind] || []).push(e);
      for (const list of [g.deers.slice(), g.wolves.slice(), g.critters.slice()]) for (const e of list) {
        if (e.kind === 'crow') continue;
        if (e.state === 'fleeing' && e.act !== 'flee' && e.fleeTimer > 0) e.act = 'flee';
        this.animal(e, dt, by);
      }
      this.crows(dt);
    }
  }

  window.Fauna = Fauna;
})();
