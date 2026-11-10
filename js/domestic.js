// domestic.js - Animais domesticos das vilas (galinha, vaca, ovelha, porco, cavalo, cabra, cao, gato).
// Vivem em volta do centro da vila, andam devagar sem fugir do jogador (so correm se apanharem), e voltam para a vila se
// passam do limite. Nao entram na simulacao de numeros nem no save: a vila repoe os que faltam quando o jogador chega perto.
// Ficam na mesma lista game.critters dos selvagens (desenho em js/critters_draw.js, golpe em js/game.js), com e.domestic = true.
// Plano: docs/FAUNA_FLORA.md (secao 3.12). Por enquanto toda macro-regiao usa este mesmo grupo europeu; as racas locais
// (zebu no Brasil, iaque no Himalaia, camelo no deserto...) entram depois.
(function () {
  // n: quantos por vila [min, max]. walk/run px/s. leash: ate onde se afasta do centro da vila.
  const DOMESTIC = {
    chicken: { name: 'Galinha', w: 24, h: 24, hp: 3, xp: 4, ac: 11, carcass: 0.35, walk: 24, run: 120, radius: 5, n: [4, 6], pause: [1, 4] },
    sheep: { name: 'Ovelha', w: 46, h: 36, hp: 10, xp: 12, ac: 10, carcass: 0.6, walk: 20, run: 95, radius: 9, n: [3, 5], pause: [2, 7] },
    cow: { name: 'Vaca', w: 76, h: 54, hp: 26, xp: 20, ac: 10, carcass: 1.0, walk: 18, run: 85, radius: 14, n: [2, 3], pause: [3, 9] },
    pig: { name: 'Porco', w: 50, h: 34, hp: 16, xp: 14, ac: 10, carcass: 0.7, walk: 22, run: 100, radius: 10, n: [2, 3], pause: [2, 6] },
    horse: { name: 'Cavalo', w: 82, h: 72, hp: 24, xp: 25, ac: 11, carcass: 1.1, walk: 26, run: 140, radius: 14, n: [1, 2], pause: [3, 8] },
    goat: { name: 'Cabra', w: 42, h: 40, hp: 9, xp: 10, ac: 11, carcass: 0.55, walk: 24, run: 130, radius: 8, n: [2, 3], pause: [2, 6] },
    dog: { name: 'Cão', w: 44, h: 34, hp: 10, xp: 8, ac: 12, carcass: 0.5, walk: 34, run: 150, radius: 8, n: [1, 2], pause: [1, 4] },
    cat: { name: 'Gato', w: 28, h: 22, hp: 4, xp: 5, ac: 12, carcass: 0.3, walk: 28, run: 170, radius: 5, n: [1, 2], pause: [2, 8] }
  };
  const LEASH = 520, SPAWN_R = 420, NEAR = 2600, FAR = 3400;

  function install() {
    const F = window.Fauna; if (!F) return;
    for (const k in DOMESTIC) F.SPECIES[k] = Object.assign({ domestic: true, herd: [1, 1], hunger: 0 }, DOMESTIC[k]);
    F.DOMESTIC = DOMESTIC;
    const P = F.prototype;

    P.townCenters = function () {
      const T = window.SURITTO_TOWNS, out = [];
      if (T) for (const id in T) if (id.charAt(0) !== '_' && T[id].center) out.push({ id, x: T[id].center.x, y: T[id].center.y });
      return out;
    };
    // Ponto livre dentro da vila (rua, praca, quintal): perigo de vila alto e sem parede, movel nem agua
    P.townSpot = function (c, r, rad) {
      const W = this.game.world;
      for (let k = 0; k < 50; k++) {
        const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r;
        const x = W ? W.wrapX(c.x + Math.cos(a) * d) : c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d * 0.7;
        if (this.townDanger(x, y) < 0.35 || this.blocked(x, y, rad + 4)) continue;
        return { x, y };
      }
      return null;
    };
    P.makeDomestic = function (kind, town, x, y) {
      const sp = F.SPECIES[kind];
      return { id: Date.now() + Math.random(), kind, domestic: true, town: town.id, home: { x: town.x, y: town.y }, x, y, width: sp.w, height: sp.h, hp: sp.hp, maxHp: sp.hp,
        speed: sp.walk, direction: Math.random() > 0.5 ? 'left' : 'right', state: 'idle', act: 'idle', frameIndex: 0, animTimer: 0, animSpeed: 0.2,
        timer: 1 + Math.random() * 4, fleeTimer: 0, target: null, stuck: 0 };
    };
    // Repoe os que faltam (a cada ~15 s) quando o jogador esta perto da vila; tira todos quando ele se afasta muito
    P.livestockUpdate = function (dt) {
      const g = this.game, Pl = g.player, W = g.world;
      this._domT = (this._domT || 0) - dt;
      if (this._domT <= 0) {
        this._domT = 15;
        for (const t of this.townCenters()) {
          const d = Math.hypot(this.wd(t.x, Pl.x), t.y - Pl.y);
          this._dom = this._dom || {};
          const st = this._dom[t.id] || (this._dom[t.id] = { init: false, want: {}, next: 0 });
          if (d > FAR) {                                        // longe: some tudo e recomeca quando voltar
            for (let i = g.critters.length - 1; i >= 0; i--) if (g.critters[i].domestic && g.critters[i].town === t.id) g.critters.splice(i, 1);
            st.init = false; continue;
          }
          if (d > NEAR) continue;
          const mine = g.critters.filter(e => e.domestic && e.town === t.id);
          for (const kind in DOMESTIC) {
            const D = DOMESTIC[kind];
            if (st.want[kind] === undefined) st.want[kind] = D.n[0] + Math.floor(Math.random() * (D.n[1] - D.n[0] + 1));
            let missing = st.want[kind] - mine.filter(e => e.kind === kind).length;
            if (missing <= 0) continue;
            if (st.init) { if (this.t < st.next) continue; missing = 1; st.next = this.t + 300; }   // reposicao devagar (5 min por bicho)
            for (let i = 0; i < missing; i++) { const p = this.townSpot(t, SPAWN_R, D.radius); if (p) g.critters.push(this.makeDomestic(kind, t, p.x, p.y)); }
          }
          st.init = true;
        }
      }
      for (const e of g.critters) {
        if (!e.domestic) continue;
        const sp = F.SPECIES[e.kind], D = DOMESTIC[e.kind];
        const d = Math.hypot(this.wd(e.x, e.home.x), e.y - e.home.y);
        e.animTimer += dt;
        let vx = 0, vy = 0, speed = 0;
        const P0 = Pl, dp = Math.hypot(this.wd(e.x, P0.x), e.y - P0.y);
        if (e.fleeTimer > 0) {                                  // apanhou: corre para longe de quem bateu
          e.fleeTimer -= dt; e.act = 'flee';
          const s = e.threatSource || P0, dx = this.wd(e.x, s.x), dy = e.y - s.y, n = Math.hypot(dx, dy) || 1;
          vx = dx / n; vy = dy / n; speed = D.run;
        } else {
          e.timer -= dt;
          if (e.act === 'flee') { e.act = 'idle'; e.timer = 1 + Math.random() * 2; }
          if (e.act === 'idle' && e.timer <= 0) {               // escolhe para onde ir (volta para a vila se foi longe)
            let tx, ty;
            if (d > LEASH) { tx = e.home.x + (Math.random() - 0.5) * 200; ty = e.home.y + (Math.random() - 0.5) * 120; }
            else { const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 110; tx = e.x + Math.cos(a) * r; ty = e.y + Math.sin(a) * r * 0.6; }
            e.target = { x: tx, y: ty }; e.act = 'walk'; e.timer = 6;
          }
          if (e.act === 'walk' && e.target) {
            const dx = this.wd(e.target.x, e.x), dy = e.target.y - e.y, n = Math.hypot(dx, dy);
            if (n < 8 || e.timer <= 0) { e.act = 'idle'; e.timer = D.pause[0] + Math.random() * (D.pause[1] - D.pause[0]); e.target = null; }
            else { vx = dx / n; vy = dy / n; speed = D.walk; }
          }
        }
        if (speed > 0) {
          const nx = e.x + vx * speed * dt, ny = e.y + vy * speed * dt * 0.7;
          const wx = W ? W.wrapX(nx) : nx;
          if (!this.blocked(wx, ny, D.radius + 2)) { e.x = wx; e.y = ny; e.stuck = 0; if (Math.abs(vx) > 0.15) e.direction = vx > 0 ? 'right' : 'left'; }
          else { e.stuck += dt; if (e.stuck > 0.4) { e.act = 'idle'; e.timer = 0.5; e.target = null; e.stuck = 0; } }
        }
        if (e.animTimer > (speed > 80 ? 0.1 : 0.22)) { e.animTimer = 0; e.frameIndex = speed > 0 ? (e.frameIndex + 1) % 4 : e.frameIndex; }
      }
    };
  }

  // Fauna e carregada antes; se por algum motivo vier depois, tenta de novo quando a pagina terminar de carregar
  if (window.Fauna) install(); else window.addEventListener('load', install);
})();
