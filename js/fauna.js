// fauna.js - IA dos animais (fase 1): ficha por especie, necessidades com nota (IA de utilidade),
// mapa de perigo (vilas e luzes) e movimento com colisao (paredes, moveis, agua) igual ao do jogador.
// Os animais continuam em game.deers / game.wolves (desenho, combate, minimapa e HUD usam essas listas);
// aqui so decide o que cada um faz e para onde anda. Cadeia: cervo pasta e foge de vila, luz, lobo e gente;
// lobo segue a manada de longe e caca quando tem fome; sem cervos por perto, a fome cresce e ele parte para
// a emboscada perto dos humanos (de noite, fora da vila e longe do fogo).
// Fase 2: o mundo e dividido em regioes com pasto, cervos e lobos em numeros (ver "regioes" abaixo); perto do
// jogador os numeros viram animais de verdade. Salvo no navegador (localStorage, suritto_fauna_v1).
(function () {
  const SPECIES = {
    deer: {
      name: 'Cervo', biomes: ['plains', 'forest', 'dense_forest', 'hills'],
      walk: 55, run: 230, radius: 11, w: 58, h: 68, hp: 20,
      sight: 260,                 // ve lobo / gente a essa distancia
      herd: [3, 5],               // tamanho da manada
      fear: { town: 1.0, light: 1.0 },
      hunger: 1 / 300             // fome por segundo (vazio -> faminto em ~5 min); pastando cai 1/40 por segundo (se tiver pasto)
    },
    wolf: {
      name: 'Lobo', biomes: ['forest', 'dense_forest', 'hills', 'plains'],
      walk: 60, run: 215, radius: 11, w: 54, h: 60, hp: 35,
      sight: 150,                 // distancia de onde parte para o bote (antes disso vem espreitando)
      scent: 1500,                // fareja a manada de longe (segue sem atacar)
      herd: [3, 4],
      fear: { town: 0.7, light: 0.45, fire: 1.0 },
      hunger: 1 / 900,            // de saciado a caçando (0.45) em ~7 min, faminto (0.6) em ~9 min, no limite (1.0) em ~15 min
      chase: 4.0                  // folego da corrida (s)
    }
  };
  // lobo rondando gente: mais medo de entrar na vila que o normal (fica na borda, espreitando)
  const WOLF_AMBUSH = { ...SPECIES.wolf, name: 'LoboEspreita', fear: { ...SPECIES.wolf.fear, town: 1.2 } };
  const NEAR = 3200;              // limite de busca de lugar para nascer
  const REG = 1536;               // lado da regiao (px)
  const ACT_ON = 2400, ACT_OFF = 3000;   // regiao com o centro a essa distancia do jogador liga (animais de verdade) / desliga
  const STEP = 10;                // s entre passos da simulacao "de numeros"
  const SAVE_KEY = 'suritto_fauna_v1';
  // capacidade de pasto por bioma (0..1)
  const GRASS = { plains: 1, forest: 0.8, dense_forest: 0.45, hills: 0.6, shore: 0.1, desert: 0.05, canyon: 0.05, mountain: 0.1, snow: 0 };

  class Fauna {
    constructor(game) {
      this.game = game;
      this.t = 0;
      this._dc = new Map(); this._dcT = -1;       // cache do perigo por celula de 48 px
      this._tc = new Map();                        // cache do terreno por celula de 64 px
      this._lights = []; this._lightT = -1;
      this._herdSeq = 1;
      this.regions = new Map();                    // "rx,ry" -> regiao (ver regionsUpdate)
      this._step = 0; this._sec = 0; this._life = 0; this._saveT = 0;
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
        const B = t._bounds; if (!B) continue;
        const dx = this.wd(x, t.center.x), dy = y - t.center.y;
        const a = (dx / 54 + dy / 27) / 2 + 0.5, b = (dy / 27 - dx / 54) / 2 + 0.5;
        const da = Math.max(B.i0 - a, 0, a - B.i1), db = Math.max(B.j0 - b, 0, b - B.j1), d = Math.hypot(da, db);
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

    // ---------------- nascer / sumir ----------------
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
        herd, hunger: kind === 'wolf' ? 0.3 + Math.random() * 0.3 : Math.random() * 0.4, act: 'idle', think: Math.random() * 0.3,
        heading: Math.random() * Math.PI * 2, stuck: 0 };
      return e;
    }
    spawnGroup(kind, cx, cy, r0, r1) {
      const sp = SPECIES[kind], p = this.spot(sp, cx, cy, r0, r1); if (!p) return 0;
      const n = sp.herd[0] + Math.floor(Math.random() * (sp.herd[1] - sp.herd[0] + 1)), herd = this._herdSeq++;
      const list = kind === 'deer' ? this.game.deers : this.game.wolves; let made = 0;
      for (let i = 0; i < n; i++) {
        const q = this.spot(sp, p.x, p.y, 0, 90) || (i === 0 ? p : null); if (!q) continue;
        list.push(this.make(kind, q.x, q.y, herd)); made++;
      }
      return made;
    }
    // ---------------- regioes (fase 2) ----------------
    // O mundo e dividido em regioes de REG px. Cada uma guarda: pasto (g, ate gc = capacidade do bioma), cervos e lobos
    // (numeros, quando ninguem esta perto) e a fome media da matilha (wh). Longe do jogador, a regiao evolui a cada
    // STEP s: o pasto cresce, os cervos comem, nascem ou passam fome, os lobos cacam e crescem ou minguam, e quem
    // esta sem comida migra para a vizinha melhor. Perto do jogador, os numeros viram animais de verdade (com a IA
    // acima) e, quando ele se afasta, os animais voltam a ser numeros na regiao onde estiverem.
    rkey(x, y) { const W = this.game.world, X = W ? W.wrapX(x) : x; return Math.floor(X / REG) + ',' + Math.floor(y / REG); }
    rcenter(key) { const [rx, ry] = key.split(',').map(Number); return { x: (rx + 0.5) * REG, y: (ry + 0.5) * REG }; }
    region(key) {
      let r = this.regions.get(key); if (r) return r;
      const [rx, ry] = key.split(',').map(Number);
      let gc = 0, town = 0;
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        const x = (rx + (a + 0.5) / 4) * REG, y = (ry + (b + 0.5) / 4) * REG;
        gc += (GRASS[this.biome(x, y)] || 0) / 16; town = Math.max(town, this.townDanger(x, y));
      }
      const hab = gc * (1 - town), cap = Math.round(hab * 7);           // ate ~7 cervos numa regiao de campo boa, longe de vila
      r = { key, gc, cap, hab, g: gc * (0.7 + Math.random() * 0.3), deer: cap * (0.5 + Math.random() * 0.4),
        wolves: hab > 0.35 && Math.random() < 0.12 ? 3 + Math.random() * 1.5 : 0, wh: 0.4, birth: 0, active: false };   // matilha: territorio grande (~1 a cada 8 regioes boas)
      const saved = this._saved && this._saved[key];
      if (saved) [r.g, r.deer, r.wolves, r.wh] = saved;
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
    food(r) { return r.gc > 0 ? r.g / r.gc : 0; }
    // Simulacao "de numeros" de uma regiao por dt segundos
    tickRegion(r, dt) {
      const f = this.food(r);
      r.g = Math.min(r.gc, r.g + r.gc * 0.004 * dt * (1 - f) * (0.3 + f));          // rebrota (devagar quando rapado)
      if (r.active) return;                                                         // perto do jogador: os animais de verdade cuidam do resto
      r.g = Math.max(0, r.g - r.deer * 0.00025 * dt);                                // cervos pastando
      const f2 = this.food(r);
      r.deer += r.deer * 0.0012 * dt * Math.max(0, f2 - 0.35) / 0.65;               // nascem quando tem pasto
      r.deer -= r.deer * 0.001 * dt * Math.max(0, 0.2 - f2) / 0.2;                  // morrem de fome sem pasto
      const kills = Math.min(r.deer, r.wolves * 0.0006 * dt * r.deer / (r.deer + 1.5));   // matilha de 4 abate ~1 cervo a cada 10-15 min (como os de verdade)
      r.deer = Math.min(Math.max(r.cap * 1.5, 1), Math.max(0, r.deer - kills));
      if (r.wolves > 0) {
        r.wh = Math.max(0, Math.min(1, r.wh + dt * SPECIES.wolf.hunger - kills / r.wolves * 0.75));
        // cada lobo precisa de ~1 cervo a cada 48 min: a matilha so cresce se a regiao tiver mais de ~2 cervos
        r.wolves += (kills - r.wolves * 0.00035 * dt) * 0.15 - r.wolves * 0.00002 * dt;   // + mortalidade natural (velhice, doenca, brigas)
        if (r.wolves < 0.5) r.wolves = 0;
        r.wolves = Math.min(6, r.wolves, 2 + r.deer * 0.35);                         // territorio: nao cabe mais lobo do que a caca sustenta
      }
      // matilha de fora chega numa regiao boa, cheia de cervos e sem lobos (a area simulada nao e isolada)
      if (r.wolves === 0 && r.hab > 0.35 && r.deer > r.cap * 0.7 && Math.random() < dt * 0.00001 && !this.neighbors(r.key).some(o => o.wolves > 0)) { r.wolves = 3 + Math.random() * 1.5; r.wh = 0.5; }
      // migracao: cervo sem pasto procura a vizinha com mais pasto; lobo sem caca vai atras dos cervos
      if (f2 < 0.3 && r.deer > 1) {
        const n = this.neighbors(r.key).filter(o => !o.active && o.cap > 0).sort((a, b) => this.food(b) * b.hab - this.food(a) * a.hab)[0];
        if (n && this.food(n) > f2) { const m = r.deer * 0.1; r.deer -= m; n.deer += m; }
      }
      if (r.wolves > 0 && r.deer < r.wolves) {
        const n = this.neighbors(r.key).filter(o => !o.active && o.wolves + r.wolves <= 6).sort((a, b) => b.deer - a.deer)[0];   // so onde cabe a matilha
        if (n && n.deer > r.deer + 1) { n.wh = n.wolves > 0 ? (n.wh * n.wolves + r.wh * r.wolves) / (n.wolves + r.wolves) : r.wh; n.wolves += r.wolves; r.wolves = 0; }
      }
    }
    // Uma regiao chega perto do jogador: os numeros viram manadas e matilha dentro dela
    materialize(r) {
      r.active = true;
      const c = this.rcenter(r.key), P = this.game.player;
      let nd = Math.floor(r.deer);
      const nw = Math.floor(r.wolves);
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
        const herd = this._herdSeq++, list = kind === 'deer' ? this.game.deers : this.game.wolves;
        let made = 0;
        for (let i = 0; i < n; i++) {
          const q = i === 0 ? p : this.spot(sp, p.x, p.y, 0, 90); if (!q) continue;
          const e = this.make(kind, q.x, q.y, herd);
          e.home = { x: c.x, y: c.y };                              // territorio = centro da regiao onde nasceu
          if (kind === 'wolf') e.hunger = Math.min(1, Math.max(0, r.wh + (Math.random() - 0.5) * 0.15));
          list.push(e); made++;
        }
        return made;
      };
      while (nd > 0) { const n = Math.min(nd, 3 + Math.floor(Math.random() * 3)), m = group('deer', n); if (!m) break; nd -= n; r.deer -= m; }
      if (nw > 0) r.wolves -= group('wolf', nw);
      r.deer = Math.max(0, r.deer); r.wolves = Math.max(0, r.wolves);
    }
    // Um animal sai do jogo e vira numero na regiao (a onde esta, ou a dada)
    dissolve(e, list, i, into) {
      const r = into || this.region(this.rkey(e.x, e.y));
      if (e.kind === 'wolf') { r.wh = r.wolves > 0 ? (r.wh * r.wolves + e.hunger) / (r.wolves + 1) : e.hunger; r.wolves += 1; }
      else r.deer += 1;
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
      for (const r of this.regions.values()) if (r.active && !want.has(r.key)) r.active = false;
      for (const key of want) { const r = this.region(key); if (!r.active) this.materialize(r); }
      for (const list of [g.deers, g.wolves]) for (let i = list.length - 1; i >= 0; i--) {
        const r = this.region(this.rkey(list[i].x, list[i].y));
        if (!r.active) this.dissolve(list[i], list, i, r);
      }
    }
    // Nascimentos e fome dos animais de verdade (regioes perto do jogador), a cada 30 s
    activeLife(dt) {
      const g = this.game, P = g.player;
      const by = new Map();
      for (const d of g.deers) { const k = this.rkey(d.x, d.y); if (!by.has(k)) by.set(k, []); by.get(k).push(d); }
      for (const [k, list] of by) {
        const r = this.region(k); if (list.length < 2) continue;
        r.birth += list.length * 0.0012 * dt * Math.max(0, this.food(r) - 0.35) / 0.65;
        if (r.birth >= 1 && list.length < r.cap * 1.5) {
          r.birth -= 1;
          const m = list[Math.floor(Math.random() * list.length)], q = this.spot(SPECIES.deer, m.x, m.y, 10, 60);
          if (q) { const f = this.make('deer', q.x, q.y, m.herd); f.home = m.home; g.deers.push(f); if (this.dist(m, P.x, P.y) < 900) g.addLog('🦌 Um filhote nasceu na manada de cervos.', 'system'); }
        }
      }
      // faminto demais por muito tempo: vai embora (migra para a vizinha melhor)
      for (const [list, kind] of [[g.deers, 'deer'], [g.wolves, 'wolf']]) for (let i = list.length - 1; i >= 0; i--) {
        const e = list[i];
        e.starve = e.hunger >= 0.99 ? (e.starve || 0) + dt : 0;
        if (e.starve < (kind === 'deer' ? 120 : 480)) continue;
        const ns = this.neighbors(this.rkey(e.x, e.y)).filter(o => !o.active);
        if (!ns.length) continue;
        const to = kind === 'deer' ? ns.sort((a, b) => this.food(b) * b.hab - this.food(a) * a.hab)[0] : ns.sort((a, b) => b.deer - a.deer)[0];
        if (kind === 'wolf' && this.dist(e, P.x, P.y) < 1500 && this.t - (this._leftMsg || -1e9) > 120) { this._leftMsg = this.t; g.addLog('🐺 A matilha faminta partiu em busca de caça em outra região.', 'tip'); }
        this.dissolve(e, list, i, to);
      }
    }
    // Salva os numeros das regioes perto (40 regioes em volta); quem esta vivo conta na regiao onde esta
    save() {
      const out = {}, P = this.game.player, [prx, pry] = this.rkey(P.x, P.y).split(',').map(Number);
      const live = new Map();
      for (const e of [...this.game.deers, ...this.game.wolves]) {
        const k = this.rkey(e.x, e.y); if (!live.has(k)) live.set(k, [0, 0, 0]);
        const v = live.get(k); if (e.kind === 'wolf') { v[1]++; v[2] += e.hunger; } else v[0]++;
      }
      for (const r of this.regions.values()) {
        const [rx, ry] = r.key.split(',').map(Number); if (Math.abs(rx - prx) > 40 || Math.abs(ry - pry) > 40) continue;
        const v = live.get(r.key) || [0, 0, 0], w = r.wolves + v[1];
        out[r.key] = [+r.g.toFixed(3), +(r.deer + v[0]).toFixed(2), +w.toFixed(2), +(w ? (r.wh * r.wolves + v[2]) / w : r.wh).toFixed(2)];
      }
      try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, regions: out })); } catch (e) { }
    }
    load() {
      try { const d = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (d && d.regions) this._saved = d.regions; } catch (e) { }
    }
    // Linha "Pasto da regiao" no painel do ecossistema
    hud() {
      const el = document.getElementById('pasture-count'); if (!el) return;
      const P = this.game.player, r = this.region(this.rkey(P.x, P.y));
      el.innerText = r.gc < 0.05 ? 'sem pasto' : Math.round(this.food(r) * 100) + '%';
      const g = this.game;
      if (g.deerCountEl) g.deerCountEl.innerText = g.deers.length;
      if (g.wolfCountEl) g.wolfCountEl.innerText = g.wolves.length;
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
        if (e.kind === 'wolf') e.direction = vx >= 0 ? 'right' : 'left';
        else e.direction = deg >= -45 && deg <= 45 ? 'right' : deg > 45 && deg <= 135 ? 'down' : (deg < -135 || deg > 135) ? 'left' : 'up';
        e.animTimer += dt;
        const step = sp2 > 150 ? 0.08 : (e.kind === 'wolf' ? 0.14 : e.animSpeed || 0.16);
        if (e.animTimer >= step) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
      }
      return ok;
    }
    // Velocidade de passeio em bando: o lider vagueia, os outros seguem com afastamento
    herdVel(e, list, speed) {
      const leader = list.find(o => o.herd === e.herd) || e;
      let vx, vy;
      if (leader === e) {
        e.heading += (Math.random() - 0.5) * 0.6;
        if (e.home) {                                           // territorio: longe de casa, vira de volta para ela
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
      for (const o of list) {                                   // separacao: nao amontoar
        if (o === e) continue;
        const dx = this.wd(e.x, o.x), dy = e.y - o.y, d = Math.hypot(dx, dy);
        if (d > 0 && d < 46) { vx += dx / d * speed * (46 - d) / 30; vy += dy / d * speed * (46 - d) / 30; }
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

    // ---------------- cervo ----------------
    deer(e, dt) {
      const g = this.game, sp = SPECIES.deer, P = g.player;
      e.hunger = Math.min(1, e.hunger + sp.hunger * dt);
      if ((e.think -= dt) <= 0) {
        e.think = 0.3;
        // ameaca: lobo com fome por perto, ou gente (mais longe se estiver correndo)
        let threat = null, td = sp.sight;
        for (const w of g.wolves) {
          if (w.act === 'rest') continue;
          const r = w.act === 'hunt' || w.act === 'ambush' || w.act === 'flee' ? sp.sight : w.act === 'stalk' ? 110 : 180;   // lobo espreitando devagar quase nao e notado
          const d = this.dist(e, w.x, w.y); if (d < r && d < td) { td = d; threat = w; }
        }
        const pd = this.dist(e, P.x, P.y), pr = P.isRunning || P.isAttacking ? 200 : 135;
        if (!threat && pd < pr) threat = P;
        const here = this.danger(e.x, e.y, sp);
        let fruit = null, fd = 280;
        if (!threat && here < 0.3) for (const f of g.fruitsOnGround) { const d = this.dist(e, f.x, f.y); if (d < fd && this.danger(f.x, f.y, sp) < 0.3) { fd = d; fruit = f; } }
        // notas
        const opts = [
          ['flee', threat || e.fleeTimer > 0 ? 1 : 0],
          ['forage', fruit ? 0.6 : 0],
          ['graze', 0.25 + e.hunger * 0.45 + (e.act === 'graze' && e.timer > 0 ? 0.3 : 0)],
          ['roam', 0.4 + (e.act === 'roam' && e.timer > 0 ? 0.3 : 0)]
        ];
        let best = opts[0]; for (const o of opts) if (o[1] > best[1]) best = o;
        if (best[0] !== e.act) {
          if (best[0] === 'flee' && e.act !== 'flee') { e.state = 'alert'; e.alertTimer = 0.35; e.fleeTimer = Math.max(e.fleeTimer || 0, 4); if (window.sounds && this.dist(e, P.x, P.y) < 700) window.sounds.playRustle(); }
          if (best[0] === 'roam' || best[0] === 'graze') e.timer = 3 + Math.random() * 4;
          e.act = best[0];
        }
        if (threat) e.threatSource = threat;
        e.targetFruit = fruit;
        if (e.act === 'graze' || e.act === 'roam') { e.timer -= 0.3; if (e.timer <= 0) e.act = e.act === 'graze' ? 'roam' : 'graze', e.timer = 3 + Math.random() * 4; }
      }
      let vx = 0, vy = 0;
      if (e.act !== 'flee' && e.runT) e.runT = Math.max(0, e.runT - dt * 0.5);
      if (e.act === 'flee') {
        if (e.state === 'alert' && (e.alertTimer -= dt) > 0) return;   // orelhas em pe
        e.state = 'fleeing'; e.fleeTimer = Math.max(0, (e.fleeTimer || 0) - dt); e.runT = (e.runT || 0) + dt;
        const t = e.threatSource || P, dx = this.wd(e.x, t.x), dy = e.y - t.y, d = Math.hypot(dx, dy) || 1;
        const tire = e.runT < 3 ? 1 : Math.max(0.7, 1 - (e.runT - 3) * 0.12);    // depois de ~3 s de corrida o cervo cansa
        vx = dx / d * e.fleeSpeed * tire; vy = dy / d * e.fleeSpeed * tire;
        [vx, vy] = this.avoid(e, sp, vx, vy, e.fleeSpeed);              // nao foge para dentro da vila
        if (d > sp.sight * 1.6 && e.fleeTimer <= 0) { e.act = 'roam'; e.fleeSpeed = sp.run; e.threatSource = null; }
      } else if (e.act === 'forage' && e.targetFruit) {
        e.state = 'wandering';
        const f = e.targetFruit, dx = this.wd(f.x, e.x), dy = f.y - e.y, d = Math.hypot(dx, dy);
        if (d < 18) {
          const i = g.fruitsOnGround.indexOf(f); if (i !== -1) g.fruitsOnGround.splice(i, 1);
          e.hunger = Math.max(0, e.hunger - 0.4); e.act = 'graze'; e.timer = 4;
          if (window.sounds && this.dist(e, P.x, P.y) < 600) window.sounds.playHarvest();
          g.addLog('🦌 Um cervo silvestre encontrou um fruto caído e o comeu tranquilamente!', 'system'); g.updateHUD();
        } else { vx = dx / d * e.speed; vy = dy / d * e.speed; }
      } else if (e.act === 'graze') {
        e.state = 'grazing';
        const r = this.region(this.rkey(e.x, e.y));
        if (r.g > r.gc * 0.15) { e.hunger = Math.max(0, e.hunger - dt / 40); r.g = Math.max(0, r.g - dt * 0.0005); }   // so mata a fome se tiver pasto
        e.animTimer += dt; if (e.animTimer >= 0.25) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
        [vx, vy] = this.avoid(e, sp, 0, 0, e.speed);
        if (Math.hypot(vx, vy) < 1) return;
      } else {
        e.state = 'wandering';
        [vx, vy] = this.herdVel(e, g.deers, e.speed);
        [vx, vy] = this.avoid(e, sp, vx, vy, e.speed);
      }
      this.move(e, vx, vy, dt);
    }

    // ---------------- lobo ----------------
    wolf(e, dt) {
      const g = this.game, sp = SPECIES.wolf, P = g.player;
      e.hunger = Math.min(1, e.hunger + sp.hunger * dt);
      if (e.biteCd) e.biteCd = Math.max(0, e.biteCd - dt);
      const fiery = P.torchLit || P.equippedWeapon === 'fire_sword';
      if ((e.think -= dt) <= 0) {
        e.think = 0.3;
        const pd = this.dist(e, P.x, P.y);
        // fogo perto: foge
        let fire = null, fd = 1e9;
        for (const L of this.lights()) if (L.fire) { const d = this.dist(e, L.x, L.y); if (d < L.r * 0.8 && d < fd) { fd = d; fire = L; } }
        // caca: cervo mais perto (bote) e manada farejada (seguir)
        let deer = null, dd = 1e9;
        for (const d of g.deers) { const k = this.dist(e, d.x, d.y); if (k < dd) { dd = k; deer = d; } }
        const smell = deer && dd < sp.scent, inSight = deer && dd < sp.sight && this.danger(deer.x, deer.y, sp) < 0.5;
        const starving = e.hunger > 0.6;
        // emboscada: so sem caca farejada; fora da vila e longe do fogo; de noite (ou faminto demais)
        const pTown = this.townDanger(P.x, P.y);
        const canAmbush = !smell && starving && pTown < 0.4 && !fiery;
        const opts = [
          ['flee', fire || e.fleeTimer > 0 || (fiery && pd < 160) ? 1 : 0],
          ['rest', e.hunger < 0.25 ? 0.75 : 0],
          ['hunt', inSight && e.hunger > 0.45 && !(e.tired > 0) ? 0.55 + e.hunger * 0.4 : 0],
          ['stalk', smell && e.hunger > 0.2 ? 0.45 + e.hunger * 0.2 : 0],
          ['ambush', canAmbush ? 0.5 + e.hunger * 0.45 : 0],
          ['patrol', 0.3]
        ];
        let best = opts[0]; for (const o of opts) if (o[1] > best[1]) best = o;
        if (best[0] === 'hunt' && e.act !== 'hunt') e.chaseTimer = sp.chase;
        if (best[0] === 'ambush' && e.act !== 'ambush' && pd < 1200 && this.t - (this._ambushMsg || -1e9) > 60 && (this._ambushMsg = this.t)) g.addLog('🐺 Sem caça na região, a matilha faminta começou a rondar os humanos...', 'warning');
        e.act = best[0]; e.prey = deer; e.fireSrc = fire;
      }
      if (e.tired > 0) e.tired -= dt;
      let vx = 0, vy = 0;
      const toward = (x, y, s) => { const dx = this.wd(x, e.x), dy = y - e.y, d = Math.hypot(dx, dy) || 1; return [dx / d * s, dy / d * s, d]; };
      if (e.act === 'flee') {
        e.state = 'patrol';
        if (e.fleeTimer > 0) e.fleeTimer -= dt;
        const src = e.fireSrc || P, dx = this.wd(e.x, src.x), dy = e.y - src.y, d = Math.hypot(dx, dy) || 1;
        vx = dx / d * 125; vy = dy / d * 125;
      } else if (e.act === 'rest') {
        e.state = 'satiated';
        [vx, vy] = this.avoid(e, sp, 0, 0, e.speed);
        if (Math.hypot(vx, vy) < 1) return;
      } else if (e.act === 'hunt' && e.prey && g.deers.includes(e.prey)) {
        e.state = 'hunting';
        e.chaseTimer -= dt;
        if (e.chaseTimer <= 0) {
          e.tired = 6; e.act = 'stalk';
          if (this.dist(e, P.x, P.y) < 900) g.addLog('🐺 O cervo disparou entre as árvores e despistou o lobo exausto!', 'tip');
          return;
        }
        let d; [vx, vy, d] = toward(e.prey.x, e.prey.y, e.chaseSpeed);
        if (d < 35) { this.pounce(e, e.prey); return; }
      } else if (e.act === 'stalk' && e.prey) {
        // acompanha a manada a uns 300 px, devagar (sem assustar)
        e.state = 'patrol';
        const [tx, ty, d] = toward(e.prey.x, e.prey.y, e.speed);
        const near = e.hunger > 0.35 ? 120 : 280;                        // com fome, chega perto rastejando
        const k = d > near + 120 ? 1 : d > near ? 0.55 : d < near - 60 ? -0.6 : 0.05;
        vx = tx * k; vy = ty * k;
        const [hx, hy] = this.herdVel(e, g.wolves, e.speed * 0.5); vx += hx * 0.4; vy += hy * 0.4;
        [vx, vy] = this.avoid(e, sp, vx, vy, e.speed);
      } else if (e.act === 'ambush') {
        // ronda o humano: chega a ~260 px pelas costas; de noite (ou faminto demais) ataca
        const [tx, ty, d] = toward(P.x, P.y, e.chaseSpeed);
        const attack = (this.night() || e.hunger > 0.9) && this.townDanger(P.x, P.y) < 0.4;
        if (attack) {
          e.state = 'attack';
          if (e.biteCd > 4) { vx = -tx * 0.8; vy = -ty * 0.8; }        // morde e recua, rodeando (matilha)
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
      } else {
        e.state = 'patrol';
        [vx, vy] = this.herdVel(e, g.wolves, e.speed);
        [vx, vy] = this.avoid(e, sp, vx, vy, e.speed);
      }
      this.move(e, vx, vy, dt);
    }
    // Bote: D20 >= 15 abate; senao o cervo escapa com adrenalina e o lobo cansa
    pounce(w, deer) {
      const g = this.game, P = g.player, seen = this.dist(w, P.x, P.y) < 900;
      if (Math.floor(Math.random() * 20) + 1 >= 15) {
        const i = g.deers.indexOf(deer); if (i === -1) return;
        g.deers.splice(i, 1); g.spawnCarcass(deer.x, deer.y);
        for (const o of g.wolves) if (o.herd === w.herd) o.hunger = Math.max(0, o.hunger - 0.75);   // a matilha come junto
        w.hunger = 0; w.act = 'rest'; w.state = 'satiated';
        if (window.sounds && seen) { window.sounds.playWolfBite(); window.sounds.playWolfHowl(); }
        if (seen) g.addLog('🐺 Um lobo predador saltou sobre um cervo e o abateu! Carcaça fresca no solo.', 'system');
        g.updateHUD();
      } else {
        deer.act = 'flee'; deer.state = 'fleeing'; deer.fleeTimer = 6; deer.fleeSpeed = 265; deer.threatSource = w;
        w.tired = 5; w.act = 'stalk';
        if (window.sounds && seen) window.sounds.playRustle();
        if (seen) g.addLog('🦌 O cervo saltou com agilidade acrobática e se esquivou do bote do lobo!', 'action');
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
      for (const d of g.deers.slice()) { this.ensure(d, 'deer'); if (d.state === 'fleeing' && d.act !== 'flee' && d.fleeTimer > 0) d.act = 'flee'; this.deer(d, dt); }
      for (const w of g.wolves.slice()) { this.ensure(w, 'wolf'); if (w.state === 'fleeing' && w.fleeTimer > 0) w.act = 'flee'; this.wolf(w, dt); }
    }
  }

  window.Fauna = Fauna;
})();
