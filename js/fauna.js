// fauna.js - IA dos animais (fase 1): ficha por especie, necessidades com nota (IA de utilidade),
// mapa de perigo (vilas e luzes) e movimento com colisao (paredes, moveis, agua) igual ao do jogador.
// Os animais continuam em game.deers / game.wolves (desenho, combate, minimapa e HUD usam essas listas);
// aqui so decide o que cada um faz e para onde anda. Cadeia: cervo pasta e foge de vila, luz, lobo e gente;
// lobo segue a manada de longe e caca quando tem fome; sem cervos por perto, a fome cresce e ele parte para
// a emboscada perto dos humanos (de noite, fora da vila e longe do fogo).
(function () {
  const SPECIES = {
    deer: {
      name: 'Cervo', biomes: ['plains', 'forest', 'dense_forest', 'hills'],
      walk: 55, run: 230, radius: 11, w: 58, h: 68, hp: 20,
      sight: 260,                 // ve lobo / gente a essa distancia
      herd: [3, 5],               // tamanho da manada
      fear: { town: 1.0, light: 1.0 },
      hunger: 1 / 300,            // fome por segundo (vazio -> faminto em ~5 min); pastando cai 1/40 por segundo
      respawn: 120                // s ate uma manada nova migrar para a regiao (se faltar cervo)
    },
    wolf: {
      name: 'Lobo', biomes: ['forest', 'dense_forest', 'hills', 'plains'],
      walk: 60, run: 215, radius: 11, w: 54, h: 60, hp: 35,
      sight: 150,                 // distancia de onde parte para o bote (antes disso vem espreitando)
      scent: 1500,                // fareja a manada de longe (segue sem atacar)
      herd: [3, 4],
      fear: { town: 0.7, light: 0.45, fire: 1.0 },
      hunger: 1 / 420,            // de saciado a faminto (0.6) em ~4 min, no limite (1.0) em ~7 min
      chase: 4.0,                 // folego da corrida (s)
      respawn: 200
    }
  };
  // lobo rondando gente: mais medo de entrar na vila que o normal (fica na borda, espreitando)
  const WOLF_AMBUSH = { ...SPECIES.wolf, name: 'LoboEspreita', fear: { ...SPECIES.wolf.fear, town: 1.2 } };
  const NEAR = 3200;              // alem disso o animal "volta a ser numero" (sai do jogo; fase 2: simulacao por regiao)
  const RING = [800, 1700];       // onde nascem: longe da tela, perto o bastante para aparecer logo

  class Fauna {
    constructor(game) {
      this.game = game;
      this.t = 0;
      this._dc = new Map(); this._dcT = -1;       // cache do perigo por celula de 48 px
      this._tc = new Map();                        // cache do terreno por celula de 64 px
      this._lights = []; this._lightT = -1;
      this._herdSeq = 1;
      this.respawnT = { deer: 0, wolf: 0 };
      this.target = { deer: 2, wolf: 1 };          // manadas / matilhas que nascem em volta do jogador
      this.minCount = { deer: 5, wolf: 2 };        // abaixo disso, depois de um tempo, chega uma manada / matilha nova
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
    // Primeira carga: manadas e matilha em volta do jogador, nos biomas certos e longe das vilas
    populate() {
      const P = this.game.player; if (!P) return;
      for (let i = 0; i < this.target.deer; i++) this.spawnGroup('deer', P.x, P.y, RING[0], RING[1]);
      for (let i = 0; i < this.target.wolf; i++) this.spawnGroup('wolf', P.x, P.y, RING[0] + 300, RING[1] + 300);
    }
    // Quem ficou longe some; falta de manada/matilha volta depois de um tempo (migracao)
    keepPopulation(dt) {
      const g = this.game, P = g.player;
      for (const [kind, list] of [['deer', g.deers], ['wolf', g.wolves]]) {
        for (let i = list.length - 1; i >= 0; i--) if (this.dist(list[i], P.x, P.y) > NEAR) list.splice(i, 1);
        if (list.length >= this.minCount[kind]) { this.respawnT[kind] = 0; continue; }
        this.respawnT[kind] += dt;
        if (this.respawnT[kind] < SPECIES[kind].respawn) continue;
        if (this.spawnGroup(kind, P.x, P.y, RING[0] + 200, RING[1] + 400)) {
          this.respawnT[kind] = 0;
          if (kind === 'deer') g.addLog('🦌 Uma manada de cervos migrou para a região em busca de pasto.', 'system');
          else g.addLog('🐺 Uivos ao longe... uma matilha chegou à região.', 'warning');
          g.updateHUD();
        }
      }
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
        e.state = 'grazing'; e.hunger = Math.max(0, e.hunger - dt / 40);
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
          ['hunt', inSight && e.hunger > 0.3 && !(e.tired > 0) ? 0.55 + e.hunger * 0.4 : 0],
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
      if (!this._populated) { this._populated = true; this.populate(); g.updateHUD(); }
      for (const d of g.deers.slice()) { this.ensure(d, 'deer'); if (d.state === 'fleeing' && d.act !== 'flee' && d.fleeTimer > 0) d.act = 'flee'; this.deer(d, dt); }
      for (const w of g.wolves.slice()) { this.ensure(w, 'wolf'); if (w.state === 'fleeing' && w.fleeTimer > 0) w.act = 'flee'; this.wolf(w, dt); }
      this.keepPopulation(dt);
    }
  }

  window.Fauna = Fauna;
})();
