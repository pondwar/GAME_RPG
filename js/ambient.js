// ambient.js - Bichos de ambiente da Europa (pacote A): coruja (so de noite, na mata), pato (beira d'agua) e castor (beira d'agua).
// Nao entram na simulacao de numeros nem no save: aparecem perto do jogador quando o lugar e a hora combinam, e somem quando ele se afasta
// (a coruja tambem some de dia). Ficam em game.critters com e.ambient = true. Sem bicho DENTRO da agua (decisao do David):
// pato e castor vivem na margem; se assustados, o pato levanta voo e o castor corre.
// Plano: docs/FAUNA_FLORA.md.
(function () {
  const HOLARTICO = ['ilhas_ocidentais', 'galia', 'norte_europeu', 'europa_oriental', 'iberia', 'china', 'japao', 'america_norte'];
  const FLORESTA = ['ilhas_ocidentais', 'galia', 'norte_europeu', 'europa_oriental', 'iberia', 'america_norte', 'china', 'japao'];
  const AMBIENT = {
    owl: { name: 'Coruja', w: 30, h: 34, hp: 4, xp: 10, ac: 14, carcass: 0.35, macros: FLORESTA, biomes: ['forest', 'dense_forest', 'hills'], night: true, cap: 1, group: [1, 1], spook: 170, flyZ: 62 },
    duck: { name: 'Pato-real', w: 32, h: 26, hp: 4, xp: 6, ac: 13, carcass: 0.4, macros: null, biomes: ['plains', 'forest', 'shore', 'hills', 'dense_forest'], water: true, cap: 3, group: [1, 3], spook: 150, flyZ: 58 },
    beaver: { name: 'Castor', w: 38, h: 26, hp: 12, xp: 14, ac: 12, carcass: 0.5, macros: HOLARTICO, biomes: ['plains', 'forest', 'shore', 'dense_forest', 'hills'], water: true, cap: 2, group: [1, 1], spook: 120, run: 120, walk: 22 }
  };
  const RAD = { owl: 6, duck: 6, beaver: 8 };
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
        e.z = Math.max(0, e.z - dt * 120);
        if (e.kind === 'beaver' && dp < A.spook && e.fleeTimer <= 0) e.fleeTimer = 3;
        if (e.fleeTimer > 0) {                                                                                  // castor assustado corre para longe
          e.fleeTimer -= dt; e.act = 'flee'; const dx = this.wd(e.x, Pl.x), dy = e.y - Pl.y, n = Math.hypot(dx, dy) || 1; vx = dx / n; vy = dy / n; speed = A.run || 120;
        } else {
          e.timer -= dt;
          if (e.act === 'flee') { e.act = 'idle'; e.timer = 1 + Math.random() * 2; }
          if (e.act === 'idle' && e.timer <= 0 && e.kind !== 'owl') {
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
        if (e.animTimer > (speed > 80 ? 0.1 : 0.25)) { e.animTimer = 0; if (speed > 0 || e.kind === 'beaver') e.frameIndex = (e.frameIndex + 1) % 4; }
      }
    };
  }
  if (window.Fauna) install(); else window.addEventListener('load', install);
})();
