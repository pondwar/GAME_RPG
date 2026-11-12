// ambient.js - Bichos de ambiente da Europa (pacote A): coruja (so de noite, na mata), pato (beira d'agua) e castor (beira d'agua).
// Nao entram na simulacao de numeros nem no save: aparecem perto do jogador quando o lugar e a hora combinam, e somem quando ele se afasta
// (a coruja tambem some de dia). Ficam em game.critters com e.ambient = true. Sem bicho DENTRO da agua (decisao do David):
// pato e castor vivem na margem; se assustados, o pato levanta voo e o castor corre.
// Plano: docs/FAUNA_FLORA.md.
(function () {
  const HOLARTICO = ['ilhas_ocidentais', 'galia', 'norte_europeu', 'europa_oriental', 'iberia', 'china', 'japao', 'america_norte'];
  const FLORESTA = ['ilhas_ocidentais', 'galia', 'norte_europeu', 'europa_oriental', 'iberia', 'america_norte', 'china', 'japao'];
  const TROPICO_AM = ['brasil', 'america_central'];
  const DESERTO = ['africa', 'oriente_medio'];
  const AMBIENT = {
    owl: { name: 'Coruja', w: 30, h: 34, hp: 4, xp: 10, ac: 14, carcass: 0.35, macros: FLORESTA, biomes: ['forest', 'dense_forest', 'hills'], night: true, cap: 1, group: [1, 1], spook: 170, flyZ: 62 },
    duck: { name: 'Pato-real', w: 32, h: 26, hp: 4, xp: 6, ac: 13, carcass: 0.4, macros: null, biomes: ['plains', 'forest', 'shore', 'hills', 'dense_forest'], water: true, cap: 3, group: [1, 3], spook: 150, flyZ: 58 },
    toucan: { name: 'Tucano', w: 30, h: 30, hp: 4, xp: 12, ac: 14, carcass: 0.4, macros: TROPICO_AM, biomes: ['dense_forest', 'forest'], cap: 3, group: [1, 2], spook: 170, flyZ: 70, perch: true, perchZ: 26 },
    macaw: { name: 'Arara', w: 34, h: 34, hp: 5, xp: 14, ac: 14, carcass: 0.45, macros: TROPICO_AM, biomes: ['dense_forest', 'forest'], cap: 4, group: [2, 3], spook: 180, flyZ: 78, perch: true, perchZ: 30 },
    harpy: { name: 'Harpia', w: 44, h: 52, hp: 14, xp: 60, ac: 14, carcass: 0.8, macros: TROPICO_AM, biomes: ['dense_forest'], cap: 1, group: [1, 1], spook: 230, flyZ: 95, perch: true, perchZ: 52 },
    anaconda: { name: 'Sucuri', w: 96, h: 18, hp: 32, xp: 65, ac: 12, carcass: 0.8, macros: TROPICO_AM, biomes: ['plains', 'shore', 'forest', 'dense_forest'], water: true, cap: 1, group: [1, 1], spook: 80, run: 60, walk: 9 },
    caiman: { name: 'Jacaré', w: 72, h: 22, hp: 26, xp: 40, ac: 12, carcass: 0.9, macros: TROPICO_AM, biomes: ['plains', 'shore', 'forest', 'dense_forest'], water: true, cap: 2, group: [1, 1], spook: 110, run: 95, walk: 12 },
    snowy_owl: { name: 'Coruja-das-neves', w: 32, h: 36, hp: 5, xp: 14, ac: 14, carcass: 0.4, macros: null, lat: [48, 90], biomes: ['snow', 'plains', 'hills', 'forest'], cap: 1, group: [1, 1], spook: 170, flyZ: 62, perch: true },
    penguin: { name: 'Pinguim', w: 26, h: 34, hp: 6, xp: 12, ac: 12, carcass: 0.4, macros: null, lat: [-90, -60], biomes: ['snow', 'shore', 'plains', 'hills'], cap: 6, group: [2, 4], spook: 90, run: 70, walk: 14 },
    vulture: { name: 'Abutre', w: 40, h: 40, hp: 8, xp: 20, ac: 13, carcass: 0.6, macros: DESERTO, biomes: ['plains', 'hills', 'desert', 'canyon'], cap: 3, group: [1, 3], spook: 190, flyZ: 90, perch: true, perchZ: 30 },
    nile_croc: { name: 'Crocodilo-do-Nilo', w: 110, h: 24, hp: 30, xp: 50, ac: 13, carcass: 1.0, macros: ['africa'], biomes: ['plains', 'shore', 'forest'], water: true, cap: 2, group: [1, 1], spook: 110, run: 90, walk: 12 },
    hippo: { name: 'Hipopótamo', w: 100, h: 60, hp: 70, xp: 120, ac: 13, carcass: 2.0, macros: ['africa'], biomes: ['plains', 'shore', 'forest'], water: true, cap: 2, group: [1, 2], spook: 80, run: 45, walk: 10 },
    scorpion: { name: 'Escorpião', w: 24, h: 18, hp: 2, xp: 8, ac: 12, carcass: 0, macros: DESERTO, biomes: ['desert', 'canyon', 'plains'], cap: 3, group: [1, 2], spook: 50, run: 70, walk: 10 },
    cobra: { name: 'Naja', w: 26, h: 34, hp: 6, xp: 20, ac: 13, carcass: 0.1, macros: DESERTO, biomes: ['desert', 'canyon', 'plains', 'hills'], cap: 2, group: [1, 1], spook: 60, run: 80, walk: 12 },
    crane: { name: 'Grou-de-coroa-vermelha', w: 34, h: 56, hp: 6, xp: 16, ac: 13, carcass: 0.5, macros: ['china', 'japao'], biomes: ['plains', 'shore', 'forest'], water: true, cap: 3, group: [1, 2], spook: 170, flyZ: 80 },
    peafowl: { name: 'Pavão', w: 36, h: 40, hp: 6, xp: 14, ac: 13, carcass: 0.5, macros: ['sudoeste_asiatico', 'sul_asiatico'], biomes: ['plains', 'forest', 'dense_forest', 'hills'], cap: 3, group: [1, 3], spook: 120, flyZ: 50, walk: 14 },
    python: { name: 'Píton-reticulada', w: 100, h: 18, hp: 28, xp: 55, ac: 12, carcass: 0.8, macros: ['sudoeste_asiatico', 'sul_asiatico'], biomes: ['plains', 'shore', 'forest', 'dense_forest'], water: true, cap: 1, group: [1, 1], spook: 80, run: 60, walk: 9 },
    bald_eagle: { name: 'Águia-careca', w: 40, h: 40, hp: 8, xp: 22, ac: 14, carcass: 0.6, macros: ['america_norte'], biomes: ['plains', 'shore', 'forest', 'hills'], water: true, cap: 2, group: [1, 2], spook: 200, flyZ: 110, perch: true, perchZ: 30 },
    turkey: { name: 'Peru-selvagem', w: 34, h: 36, hp: 6, xp: 14, ac: 12, carcass: 0.6, macros: ['america_norte'], biomes: ['plains', 'forest', 'hills'], cap: 3, group: [2, 4], spook: 130, flyZ: 40, walk: 14 },
    rattlesnake: { name: 'Cascavel', w: 30, h: 16, hp: 5, xp: 18, ac: 13, carcass: 0.1, macros: ['america_norte', 'america_central'], biomes: ['desert', 'canyon', 'plains', 'hills'], cap: 2, group: [1, 1], spook: 60, run: 70, walk: 11 },
    kookaburra: { name: 'Kookaburra', w: 24, h: 28, hp: 4, xp: 10, ac: 13, carcass: 0.3, macros: ['oceania'], biomes: ['forest', 'plains', 'dense_forest'], cap: 3, group: [1, 2], spook: 110, flyZ: 50 },
    koala: { name: 'Coala', w: 28, h: 32, hp: 7, xp: 16, ac: 12, carcass: 0.4, macros: ['oceania'], biomes: ['forest', 'dense_forest'], cap: 2, group: [1, 1], spook: 70, run: 50, walk: 8 },
    condor: { name: 'Condor-dos-Andes', w: 48, h: 44, hp: 10, xp: 28, ac: 13, carcass: 0.8, macros: ['america_sul_hispanica'], biomes: ['hills', 'plains', 'desert'], cap: 2, group: [1, 3], spook: 210, flyZ: 130, perch: true, perchZ: 30 },
    king_cobra: { name: 'Cobra-real', w: 34, h: 42, hp: 8, xp: 28, ac: 13, carcass: 0.2, macros: ['sudoeste_asiatico', 'sul_asiatico'], biomes: ['forest', 'dense_forest', 'plains', 'hills'], cap: 1, group: [1, 1], spook: 70, run: 80, walk: 12 },
    platypus: { name: 'Ornitorrinco', w: 34, h: 20, hp: 6, xp: 18, ac: 13, carcass: 0.3, macros: ['oceania'], biomes: ['plains', 'forest', 'shore', 'dense_forest'], water: true, cap: 1, group: [1, 1], spook: 90, run: 90, walk: 18 },
    beaver: { name: 'Castor', w: 38, h: 26, hp: 12, xp: 14, ac: 12, carcass: 0.5, macros: HOLARTICO, biomes: ['plains', 'forest', 'shore', 'dense_forest', 'hills'], water: true, cap: 2, group: [1, 1], spook: 120, run: 120, walk: 22 }
  };
  const RAD = { snowy_owl: 6, penguin: 6, owl: 6, duck: 6, beaver: 8, toucan: 6, macaw: 6, caiman: 12, harpy: 8, anaconda: 12, vulture: 8, nile_croc: 14, hippo: 14, scorpion: 4, cobra: 5, crane: 8, peafowl: 7, python: 12, bald_eagle: 8, turkey: 7, rattlesnake: 5, kookaburra: 5, koala: 5, condor: 9, king_cobra: 7, platypus: 6 };
  const NEAR = 1500, GONE = 2300;

  function install() {
    const F = window.Fauna; if (!F) return;
    for (const k in AMBIENT) F.SPECIES[k] = Object.assign({ ambient: true, herd: [1, 1], hunger: 0 }, AMBIENT[k]);
    const P = F.prototype;

    P.nearWater = function (x, y) {
      for (let a = 0; a < 8; a++) { const r = 70; if (this.terrain(x + Math.cos(a * Math.PI / 4) * r, y + Math.sin(a * Math.PI / 4) * r * 0.7).isWater) return true; }
      return false;
    };
    P.ambientSpot = function (kind) {
      const A = AMBIENT[kind], Pl = this.game.player;
      for (let k = 0; k < 60; k++) {
        const a = Math.random() * Math.PI * 2, r = 500 + Math.random() * (NEAR - 500);
        const x = this.game.world ? this.game.world.wrapX(Pl.x + Math.cos(a) * r) : Pl.x + Math.cos(a) * r, y = Pl.y + Math.sin(a) * r * 0.75;
        const T = this.terrain(x, y); if (T.isWater || !A.biomes.includes(T.type)) continue;
        if (A.macros && !A.macros.includes(this.macro(x, y))) continue;
        if (A.lat) { const la = this.game.world ? this.game.world.getLatitudeDeg(y) : 0; if (la < A.lat[0] || la > A.lat[1]) continue; }
        if (A.water && !this.nearWater(x, y)) continue;
        if (this.townDanger(x, y) > 0.1 || this.blocked(x, y, RAD[kind] + 4)) continue;
        return { x, y };
      }
      return null;
    };
    P.makeAmbient = function (kind, x, y, home) {
      const A = AMBIENT[kind];
      return { id: Date.now() + Math.random(), kind, ambient: true, x, y, z: 0, home: home || { x, y }, width: A.w, height: A.h, hp: A.hp, maxHp: A.hp,
        direction: Math.random() > 0.5 ? 'left' : 'right', act: 'idle', state: 'idle', mode: 'idle', frameIndex: 0, animTimer: 0, timer: 1 + Math.random() * 4, target: null,
        phase: Math.random() * 6, t: 0, fleeTimer: 0, stuck: 0 };
    };
    P.ambientUpdate = function (dt) {
      const g = this.game, Pl = g.player, W = g.world;
      const h = this.game.timeSystem && this.game.timeSystem.horaLocal ? this.game.timeSystem.horaLocal() : 12, night = h >= 20 || h < 5;
      this._ambT = (this._ambT || 0) - dt;
      if (this._ambT <= 0) {
        this._ambT = 12;
        for (const kind in AMBIENT) {
          const A = AMBIENT[kind]; if (A.night && !night) continue;
          const have = g.critters.filter(e => e.ambient && e.kind === kind && e.mode !== 'leave').length;
          if (have >= A.cap || Math.random() > 0.6) continue;
          const p = this.ambientSpot(kind); if (!p) continue;
          const n = Math.min(A.cap - have, A.group[0] + Math.floor(Math.random() * (A.group[1] - A.group[0] + 1)));
          for (let i = 0; i < n; i++) { const q = i === 0 ? p : { x: p.x + (Math.random() - 0.5) * 70, y: p.y + (Math.random() - 0.5) * 40 }; if (i && this.blocked(q.x, q.y, 8)) continue; g.critters.push(this.makeAmbient(kind, q.x, q.y, p)); }
        }
      }
      for (let i = g.critters.length - 1; i >= 0; i--) {
        const e = g.critters[i]; if (!e.ambient) continue;
        const A = AMBIENT[e.kind], dp = Math.hypot(this.wd(e.x, Pl.x), e.y - Pl.y);
        if (dp > GONE) { g.critters.splice(i, 1); continue; }
        e.animTimer += dt; e.t += dt; e.phase += dt * 3;
        let vx = 0, vy = 0, speed = 0;
        if (A.night && !night && e.mode !== 'leave') { e.mode = 'leave'; e.t = 0; }                          // amanheceu: a coruja vai embora
        const flyer = !!A.flyZ;
        if (flyer && e.mode !== 'fly' && e.mode !== 'leave' && dp < A.spook) { e.mode = 'fly'; e.t = 0; e.away = Math.atan2(e.y - Pl.y, this.wd(e.x, Pl.x)); }
        if (e.mode === 'fly' || e.mode === 'leave') {                                                           // voa para longe, subindo
          if (e.mode === 'leave' && e.away === undefined) e.away = Math.random() * Math.PI * 2;
          e.z = Math.min(A.flyZ, e.z + dt * 90);
          vx = Math.cos(e.away); vy = Math.sin(e.away) * 0.6; speed = e.kind === 'owl' ? 90 : 150;
          if (e.mode === 'fly' && e.t > 6) { e.mode = 'leave'; }
          if (e.mode === 'leave' && dp > 1600) { g.critters.splice(i, 1); continue; }
          if (Math.abs(vx) > 0.2) e.direction = vx > 0 ? 'right' : 'left';
          e.x += vx * speed * dt; e.y += vy * speed * dt; if (W) e.x = W.wrapX(e.x);
          if (e.animTimer > 0.09) { e.animTimer = 0; e.frameIndex = (e.frameIndex + 1) % 4; }
          continue;
        }
        e.z = e.z > (A.perchZ || 0) ? Math.max(A.perchZ || 0, e.z - dt * 120) : Math.min(A.perchZ || 0, e.z + dt * 60);
        if (!flyer && A.run && dp < A.spook && e.fleeTimer <= 0) e.fleeTimer = 3;
        if (e.fleeTimer > 0) {                                                                                  // castor assustado corre para longe
          e.fleeTimer -= dt; e.act = 'flee'; const dx = this.wd(e.x, Pl.x), dy = e.y - Pl.y, n = Math.hypot(dx, dy) || 1; vx = dx / n; vy = dy / n; speed = A.run || 120;
        } else {
          e.timer -= dt;
          if (e.act === 'flee') { e.act = 'idle'; e.timer = 1 + Math.random() * 2; }
          if (e.act === 'idle' && e.timer <= 0 && !A.perch) {
            const a = Math.random() * Math.PI * 2, r = 25 + Math.random() * 60;
            e.target = { x: e.home.x + Math.cos(a) * r * 1.6, y: e.home.y + Math.sin(a) * r }; e.act = 'walk'; e.timer = 5;
          }
          if (e.act === 'walk' && e.target) {
            const dx = this.wd(e.target.x, e.x), dy = e.target.y - e.y, n = Math.hypot(dx, dy);
            if (n < 6 || e.timer <= 0) { e.act = 'idle'; e.timer = 2 + Math.random() * 6; e.target = null; } else { vx = dx / n; vy = dy / n; speed = A.walk || 20; }
          }
        }
        if (speed > 0) {
          const nx = W ? W.wrapX(e.x + vx * speed * dt) : e.x + vx * speed * dt, ny = e.y + vy * speed * dt * 0.7;
          if (!this.blocked(nx, ny, RAD[e.kind] + 2)) { e.x = nx; e.y = ny; if (Math.abs(vx) > 0.15) e.direction = vx > 0 ? 'right' : 'left'; }
          else { e.act = 'idle'; e.timer = 1; e.target = null; }
        }
        if (e.animTimer > (speed > 80 ? 0.1 : 0.25)) { e.animTimer = 0; if (speed > 0 || e.kind === 'beaver' || e.kind === 'caiman' || e.kind === 'anaconda' || e.kind === 'nile_croc' || e.kind === 'hippo' || e.kind === 'cobra' || e.kind === 'python' || e.kind === 'rattlesnake' || e.kind === 'king_cobra' || e.kind === 'platypus') e.frameIndex = (e.frameIndex + 1) % 4; }
      }
    };
  }
  if (window.Fauna) install(); else window.addEventListener('load', install);
})();
