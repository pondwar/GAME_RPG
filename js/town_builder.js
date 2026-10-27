// town_builder.js - Monta vilas/cidades a partir de js/town_plans.js usando as mesmas pecas do construtor.
// Uso (console ou botao 🏘️ do construtor):
//   game.town.build('vila_inicial')  -> (re)monta a vila; pula lotes onde ja existe construcao sua
//   game.town.clear('vila_inicial')  -> remove so as pecas da vila
//   game.town.goto('vila_inicial')   -> leva o personagem para a praca
//   game.town.auditFurniture()       -> lista moveis mais altos que o muro (furariam o telhado)
//   ?scene=moveis                    -> sala de teste com todos os moveis encostados nas 4 paredes
// Todas as pecas da vila levam `town: <id>` e `bld: <predio>`; o resto do save nao e tocado.
(function () {
  const CELL_A = [54, 27], CELL_B = [-54, 27];           // passo de uma celula nos eixos a (+i) e b (+j)
  const WALL = 'dungeon_wood_wall_panel_01';
  const DOOR = 'dungeon_door_wood_01';
  const ROT_T = { 0: 90, 90: 0, 180: 270, 270: 180 };     // rot ao transpor a planta (i<->j)
  const SIDE_T = { N: 'W', W: 'N', S: 'E', E: 'S' };
  const WALL_TOP = 77;                                    // altura do muro (= STACK_STEP do construtor)

  const cellCenter = (O, i, j) => [O.x + (i - j) * 54, O.y + (i + j) * 27];
  const add = (p, c, k) => [p[0] + c[0] * k, p[1] + c[1] * k];

  // Planta orientada (transposta se pedido) + ajustes do predio (lado da porta, numero de camas)
  function orient(plan, bld) {
    const T = !!bld.transpose;
    const sw = (i, j) => (T ? [j, i] : [i, j]);
    const out = {
      name: plan.name, floor: plan.floor, roof: plan.roof,
      W: T ? plan.D : plan.W, D: T ? plan.W : plan.D,
      doors: (plan.doors || []).map(d => ({ ...d, side: T ? SIDE_T[d.side] : d.side })),
      partitions: (plan.partitions || []).map(p => ({ ...p, axis: T ? (p.axis === 'a' ? 'b' : 'a') : p.axis })),
      furniture: []
    };
    if (bld.door && out.doors.length) out.doors[0].side = bld.door;
    let furn = plan.furniture.slice();
    if (bld.beds === 5 && plan.extraBed) furn.push(plan.extraBed);
    for (const [type, i, j, rot] of furn) {
      const [ii, jj] = sw(i, j);
      out.furniture.push({ type, i: ii, j: jj, rot: T ? (ROT_T[rot] !== undefined ? ROT_T[rot] : rot) : rot });
    }
    return out;
  }

  class TownBuilder {
    constructor(game) {
      this.game = game;
      this.extraClearings = [];       // areas livres de arvores registradas por cenas de teste
    }
    get A() { return this.game.architect; }

    // Botao no rodape do construtor (ao lado de Exportar) + cena de teste pela URL
    init() {
      const exp = document.getElementById('btn-arch-export');
      if (exp && !document.getElementById('btn-arch-town')) {
        const btn = document.createElement('button');
        btn.id = 'btn-arch-town'; btn.className = exp.className;
        btn.title = 'Monta (ou remonta) a Vila Inicial e leva voce ate a praca. Shift+clique: so ir ate la.';
        btn.textContent = '🏘️ Vila';
        btn.addEventListener('click', async (e) => {
          btn.blur();
          if (!e.shiftKey || !this.isBuilt()) await this.build();
          this.goto();
        });
        exp.parentNode.insertBefore(btn, exp);
      }
      if (new URLSearchParams(location.search).get('scene') === 'moveis') this.buildFurnitureTestScene();
      this.autoBuild();
    }

    // ---- nome e regiao ----
    region(id) {
      const t = window.SURITTO_TOWNS[id];
      return window.SurittoRegions && t ? window.SurittoRegions.at(this.game.world, t.center.x, t.center.y) : null;
    }
    townName(id) {
      const t = window.SURITTO_TOWNS[id]; if (!t) return id;
      if (t.name) return t.name;
      const r = this.region(id);
      return r ? window.SurittoRegions.placeName(r, id) : id;
    }

    // ---- a vila e conteudo do MUNDO, nao do save do jogador ----
    // Em todo navegador ela e montada sozinha na primeira carga e de novo sempre que a planta mudar
    // (assinatura guardada em suritto_town_sig:<id>). As construcoes do jogador nunca sao apagadas.
    _signature(id) {
      const t = window.SURITTO_TOWNS[id], plans = {};
      for (const b of t.buildings || []) plans[b.plan] = window.SURITTO_BUILDING_PLANS[b.plan];
      const s = JSON.stringify([t, plans, TownBuilder.VERSION], (k, v) => (k.charAt(0) === '_' ? undefined : v));   // ignora caches (_bounds)
      let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
      return (h >>> 0).toString(36);
    }
    async autoBuild() {
      await this.whenReady();
      for (const id of Object.keys(window.SURITTO_TOWNS)) {
        if (id.charAt(0) === '_') continue;
        const key = 'suritto_town_sig:' + id, sig = this._signature(id);
        let saved = null; try { saved = localStorage.getItem(key); } catch (e) { }
        if (saved === sig && this.isBuilt(id)) continue;
        await this.build(id);
        try { localStorage.setItem(key, sig); } catch (e) { }
      }
    }

    // Aviso ao entrar/sair de uma vila (checado a cada ~0,5 s pelo game.update)
    update(dt) {
      this._chk = (this._chk || 0) + dt; if (this._chk < 0.5) return; this._chk = 0;
      const P = this.game.player; let here = null;
      for (const id in window.SURITTO_TOWNS) {
        if (id.charAt(0) === '_') continue;
        const t = window.SURITTO_TOWNS[id]; t._bounds = t._bounds || TownBuilder.bounds(t);
        const dx = this.game.world.wrapDelta(P.x - t.center.x), dy = P.y - t.center.y;
        const a = (dx / 54 + dy / 27) / 2 + 0.5, b = (dy / 27 - dx / 54) / 2 + 0.5, B = t._bounds;
        if (a >= B.i0 && a <= B.i1 && b >= B.j0 && b <= B.j1) { here = id; break; }
      }
      if (here === this._here) return;
      if (here) {
        const r = this.region(here), name = this.townName(here);
        this.game.spawnDamageText(P.x, P.y - 80, `🏘️ ${name}`, '#ffe08a', 20);
        this.game.addLog(`🏘️ Você chegou a <b>${name}</b>${r ? ` • ${r.name} (${r.real})` : ''}.`, 'system');
      } else if (this._here) {
        this.game.addLog(`🌲 Você deixou ${this.townName(this._here)}.`, 'tip');
      }
      this._here = here;
    }
    get frames() { return this.game.structures && this.game.structures.frames; }

    // Espera o atlas carregar (a geometria das pecas vem dele)
    whenReady() {
      return new Promise(res => {
        const ok = () => this.frames && this.A && this.A.BLOCK_TYPES[WALL] && this.A.BLOCK_TYPES[WALL].frame;
        if (ok()) return res();
        const t = setInterval(() => { if (ok()) { clearInterval(t); res(); } }, 100);
      });
    }

    _meta(type) { const cfg = this.A.BLOCK_TYPES[type]; return cfg && this.frames[cfg.sprite]; }
    _xlen(type) { const m = this._meta(type); return m && m.face ? Math.abs(m.face.B.dx - m.face.A.dx) : 42; }

    // ---- areas sem arvores (consultado pelo gerador de chunks em world.js) ----
    static bounds(town) {
      let i0 = Infinity, i1 = -Infinity, j0 = Infinity, j1 = -Infinity;
      const grow = (a0, b0, w, d) => { i0 = Math.min(i0, a0); j0 = Math.min(j0, b0); i1 = Math.max(i1, a0 + w); j1 = Math.max(j1, b0 + d); };
      for (const s of town.streets || []) grow(s.i0, s.j0, s.W, s.D);
      for (const b of town.buildings || []) {
        const p = window.SURITTO_BUILDING_PLANS[b.plan]; if (!p) continue;
        grow(b.i0, b.j0, b.transpose ? p.D : p.W, b.transpose ? p.W : p.D);
      }
      const m = town.clearMargin || 0;
      return { i0: i0 - m, i1: i1 + m, j0: j0 - m, j1: j1 + m };
    }
    static isInClearing(x, y) {
      const towns = window.SURITTO_TOWNS || {}, W = window.game && window.game.world;
      const wd = v => (W ? W.wrapDelta(v) : v);
      const inside = (O, B) => {
        const dx = wd(x - O.x), dy = y - O.y;
        const a = (dx / 54 + dy / 27) / 2 + 0.5, b = (dy / 27 - dx / 54) / 2 + 0.5;   // +0.5: (0,0) e o centro da celula
        return a >= B.i0 - 1 && a <= B.i1 + 1 && b >= B.j0 - 1 && b <= B.j1 + 1;      // +1: copa da arvore na borda
      };
      for (const id in towns) {
        const t = towns[id]; t._bounds = t._bounds || TownBuilder.bounds(t);
        if (inside(t.center, t._bounds)) return true;
      }
      const tb = window.game && window.game.town;
      if (tb) for (const c of tb.extraClearings) if (inside(c.center, c)) return true;
      return false;
    }
    _refreshTrees() {
      const ch = this.game.world && this.game.world.chunks;
      if (ch && ch.activeChunks) ch.activeChunks.clear();
      if (ch) this.game.trees = ch.getVisibleTrees(this.game.player.x, this.game.player.y);
    }

    // ---- geracao das pecas (lista de operacoes; nada e gravado aqui) ----
    // Paredes de um lado: paineis distribuidos para fechar exatamente no vertice (painel 42 px x celula 54 px),
    // com as portas centradas nas celulas pedidas.
    _wallRun(ops, P0, axis, cells, doors, tag) {
      const c = axis === 'a' ? CELL_A : CELL_B, flip = axis === 'b';
      const L = cells * 54, P = this._xlen(WALL);
      const at = s => add(P0, c, s / 54);
      const piece = (type, s) => {
        const m = this._meta(type), A = at(s);
        ops.push({ kind: 'wall', type, x: flip ? A[0] + m.face.A.dx : A[0] - m.face.A.dx, y: A[1] - m.face.A.dy, flip, tag });
      };
      const fill = (s0, s1) => {
        const len = s1 - s0; if (len < 3) return;
        if (len <= P) { piece(WALL, s1 - P); return; }
        const n = Math.ceil((len - P) / P) + 1, sp = (len - P) / (n - 1);
        for (let k = 0; k < n; k++) piece(WALL, s0 + k * sp);
      };
      const gaps = (doors || []).map(d => {
        const type = d.type || DOOR, len = this._xlen(type), ctr = (d.at + (d.span || 1) / 2) * 54;
        return [ctr - len / 2, ctr + len / 2, type];
      }).sort((p, q) => p[0] - q[0]);
      let cur = 0;
      for (const g of gaps) { fill(cur, g[0]); piece(g[2], g[0]); cur = g[1]; }
      fill(cur, L);
    }

    // Celulas de dentro logo atras de uma porta ("i,j")
    _entryCells(p, d) {
      const out = [];
      for (let u = Math.floor(d.at); u < Math.ceil(d.at + (d.span || 1)); u++) {
        out.push(d.side === 'N' ? u + ',0' : d.side === 'S' ? u + ',' + (p.D - 1) : d.side === 'W' ? '0,' + u : (p.W - 1) + ',' + u);
      }
      return out;
    }
    // Porta tapada por movel (ex.: porta virada para o fundo, onde ficam lareira e estantes): desliza a porta para o
    // vao livre mais proximo do mesmo lado; sem vao, tira os moveis da entrada.
    _fitDoors(p, tag, report) {
      const cellsOf = f => {
        const cfg = this.A.BLOCK_TYPES['dungeon_furn_' + f.type], c = [f.i + ',' + f.j];
        if (cfg && cfg.cells === 2) c.push(f.rot % 180 === 0 ? (f.i + 1) + ',' + f.j : f.i + ',' + (f.j + 1));
        return c;
      };
      for (const d of p.doors) {
        const taken = new Set(p.furniture.flatMap(cellsOf));
        const free = at => this._entryCells(p, { ...d, at }).every(k => !taken.has(k));
        if (free(d.at)) continue;
        const len = (d.side === 'N' || d.side === 'S') ? p.W : p.D, span = d.span || 1;
        let best = null;
        for (let at = 0; at + span <= len; at++) if (free(at) && (best === null || Math.abs(at - d.at) < Math.abs(best - d.at))) best = at;
        if (best !== null) { d.at = best; continue; }
        const block = new Set(this._entryCells(p, d));
        const before = p.furniture.length;
        p.furniture = p.furniture.filter(f => !cellsOf(f).some(k => block.has(k)));
        report.warnings.push(`${tag}: sem vao livre para a porta; ${before - p.furniture.length} movel(is) retirado(s) da entrada`);
      }
    }

    planTown(id) {
      const town = window.SURITTO_TOWNS[id];
      if (!town) throw new Error('Vila nao encontrada: ' + id);
      const O = town.center, ops = [], report = { warnings: [], buildings: [] };
      const floors = new Map();                                    // "i,j" -> {type, tag}
      const occupied = new Map();                                  // "i,j" -> predio (para achar sobreposicao)

      for (const s of town.streets || []) for (let i = s.i0; i < s.i0 + s.W; i++) for (let j = s.j0; j < s.j0 + s.D; j++) floors.set(i + ',' + j, { type: s.floor, tag: 'rua' });

      for (const bld of town.buildings) {
        const base = window.SURITTO_BUILDING_PLANS[bld.plan];
        if (!base) { report.warnings.push(`${bld.id}: planta "${bld.plan}" nao existe`); continue; }
        const p = orient(base, bld), tag = bld.id;
        report.buildings.push({ id: bld.id, plan: bld.plan, W: p.W, D: p.D, i0: bld.i0, j0: bld.j0 });
        for (let i = 0; i < p.W; i++) for (let j = 0; j < p.D; j++) {
          const k = (bld.i0 + i) + ',' + (bld.j0 + j);
          if (occupied.has(k)) report.warnings.push(`${bld.id} sobrepoe ${occupied.get(k)} na celula ${k}`);
          occupied.set(k, bld.id);
          floors.set(k, { type: p.floor, tag });
        }
        const T = add(cellCenter(O, bld.i0, bld.j0), [0, -27], 1);    // vertice de tras (topo)
        const doorsOn = side => p.doors.filter(d => d.side === side);
        this._wallRun(ops, T, 'a', p.W, doorsOn('N'), tag);
        this._wallRun(ops, T, 'b', p.D, doorsOn('W'), tag);
        this._wallRun(ops, add(T, CELL_B, p.D), 'a', p.W, doorsOn('S'), tag);
        this._wallRun(ops, add(T, CELL_A, p.W), 'b', p.D, doorsOn('E'), tag);
        for (const pt of p.partitions) {
          const P0 = pt.axis === 'a' ? add(add(T, CELL_B, pt.line), CELL_A, pt.from) : add(add(T, CELL_A, pt.line), CELL_B, pt.from);
          this._wallRun(ops, P0, pt.axis, pt.to - pt.from, pt.doors || [], tag);
        }
        // moveis: dentro do predio, sem sobrepor, sem tapar a entrada
        const used = new Map(), entry = new Set();
        this._fitDoors(p, tag, report);
        for (const d of p.doors) for (const k of this._entryCells(p, d)) entry.add(k);
        for (const f of p.furniture) {
          const type = 'dungeon_furn_' + f.type, cfg = this.A.BLOCK_TYPES[type];
          if (!cfg) { report.warnings.push(`${tag}: movel desconhecido "${f.type}"`); continue; }
          const cells = [[f.i, f.j]];
          if (cfg.cells === 2) cells.push(f.rot % 180 === 0 ? [f.i + 1, f.j] : [f.i, f.j + 1]);
          let bad = false;
          for (const [ci, cj] of cells) {
            const k = ci + ',' + cj;
            if (ci < 0 || cj < 0 || ci >= p.W || cj >= p.D) { report.warnings.push(`${tag}: ${f.type} fora do predio (${k})`); bad = true; }
            else if (used.has(k)) { report.warnings.push(`${tag}: ${f.type} em cima de ${used.get(k)} (${k})`); bad = true; }
            else if (entry.has(k)) report.warnings.push(`${tag}: ${f.type} na frente da porta (${k})`);
          }
          if (bad) continue;
          for (const [ci, cj] of cells) used.set(ci + ',' + cj, f.type);
          const [x, y] = cellCenter(O, bld.i0 + f.i, bld.j0 + f.j);
          const rot = cfg.rots === 1 ? 0 : cfg.rots === 2 ? (f.rot % 180 === 0 ? 0 : 90) : f.rot;   // mesma regra do construtor
          ops.push({ kind: 'furn', type, x, y, rot, tag });
        }
        ops.push({ kind: 'roof', type: p.roof, x: T[0], y: T[1], W: p.W, D: p.D, ridge: p.W >= p.D ? 'a' : 'b', tag });
      }
      for (const [type, i, j, rot] of town.props || []) {
        const k = i + ',' + j;
        if (occupied.has(k)) { report.warnings.push(`enfeite ${type} dentro de ${occupied.get(k)} (${k})`); continue; }
        const [x, y] = cellCenter(O, i, j);
        ops.push({ kind: 'furn', type: 'dungeon_furn_' + type, x, y, rot, tag: 'rua' });
      }
      for (const [k, f] of floors) {
        const [i, j] = k.split(',').map(Number), [x, y] = cellCenter(O, i, j);
        ops.unshift({ kind: 'floor', type: f.type, x, y, tag: f.tag });
      }
      // terreno: avisa se algum piso cair na agua
      const W = this.game.world;
      if (W && W.getTerrainAt) { let wet = 0; for (const o of ops) if (o.kind === 'floor' && W.getTerrainAt(o.x, o.y).isWater) wet++; if (wet) report.warnings.push(`${wet} celula(s) de piso sobre a agua`); }
      return { town, ops, report };
    }

    // ---- gravacao ----
    _key(prefix, x, y, suffix) {
      const A = this.A, G = A.GRID_SIZE, gx = A.normGX(Math.floor(this.game.world.wrapX(x) / G)), gy = Math.floor(y / G);
      const base = `${prefix}:${gx},${gy}${suffix || ''}`; let key = base, n = 0;
      while (A.blocks[key]) key = `${base}#${++n}`;
      return { key, gx, gy };
    }
    _write(op, townId, temp) {
      const A = this.A, W = this.game.world, now = Date.now();
      const mark = b => { b.town = townId; b.bld = op.tag; if (temp) b.temp = true; return b; };
      if (op.kind === 'wall') {
        const b = A.addDungeonPiece(op.type, op.x, op.y, op.flip, temp ? { temp: true } : {});
        if (b) mark(b);
        return;
      }
      const x = W.wrapX(op.x);
      if (op.kind === 'floor') {
        const { key, gx, gy } = this._key('0', x, op.y);
        A.blocks[key] = mark({ type: op.type, gx, gy, wx: Math.round(x), wy: Math.round(op.y), rot: 0, layer: 0, height: 1, isOpen: false, placedAt: now });
      } else if (op.kind === 'furn') {
        const { key, gx, gy } = this._key('f', x, op.y);
        A.blocks[key] = mark({ type: op.type, gx, gy, layer: 9, wx: Math.round(x), wy: Math.round(op.y), rot: op.rot || 0, z: 0, placedAt: now });
      } else if (op.kind === 'roof') {
        const { key, gx, gy } = this._key('r', x, op.y, ',z1');
        A.blocks[key] = mark({ type: op.type, gx, gy, layer: 9, wx: Math.round(x), wy: Math.round(op.y), W: op.W, D: op.D, ridge: op.ridge, z: 1, rot: 0, height: 1, placedAt: now });
      }
    }
    _removeTown(townId) {
      let n = 0;
      for (const k of Object.keys(this.A.blocks)) if (this.A.blocks[k].town === townId) { delete this.A.blocks[k]; n++; }
      return n;
    }
    _touched() { const A = this.A; A._ec = null; A._fl = null; A._fc = null; A._ecVer = (A._ecVer || 0) + 1; }

    // Construcoes do jogador (nao da vila) dentro do retangulo de um predio (+1 celula de folga)
    _conflicts(town, b, p) {
      const O = town.center, W = this.game.world, out = [];
      for (const k in this.A.blocks) {
        const blk = this.A.blocks[k]; if (blk.town || blk.temp) continue;
        const a0 = this.A.dungeonAnchor(blk); const x = blk.wx !== undefined ? blk.wx : a0.x, y = blk.wy !== undefined ? blk.wy : a0.y;
        const dx = W.wrapDelta(x - O.x), dy = y - O.y, a = (dx / 54 + dy / 27) / 2 + 0.5, c = (dy / 27 - dx / 54) / 2 + 0.5;
        if (a >= b.i0 - 1 && a <= b.i0 + p.W + 1 && c >= b.j0 - 1 && c <= b.j0 + p.D + 1) out.push(k);
      }
      return out;
    }

    _cellOf(town, x, y) {
      const dx = this.game.world.wrapDelta(x - town.center.x), dy = y - town.center.y;
      return Math.floor((dx / 54 + dy / 27) / 2 + 0.5) + ',' + Math.floor((dy / 27 - dx / 54) / 2 + 0.5);
    }
    // Celulas da malha da vila ocupadas (ou encostadas) por pecas do jogador
    _playerCells(town) {
      const out = new Set();
      for (const k in this.A.blocks) {
        const b = this.A.blocks[k]; if (b.town || b.temp) continue;
        const a0 = this.A.dungeonAnchor(b), x = b.wx !== undefined ? b.wx : a0.x, y = b.wy !== undefined ? b.wy : a0.y;
        for (const [ox, oy] of [[0, 0], [27, 13], [-27, 13], [27, -13], [-27, -13]]) out.add(this._cellOf(town, x + ox, y + oy));
      }
      return out;
    }

    async build(id = 'vila_inicial') {
      await this.whenReady();
      const { town, ops, report } = this.planTown(id);
      this._removeTown(id);
      const skip = new Set();
      for (const b of report.buildings) {
        const c = this._conflicts(town, b, b);
        if (c.length) { skip.add(b.id); report.warnings.push(`${b.id}: pulado, ja existe construcao sua no lote (${c.length} peca(s))`); }
      }
      // ruas, praca e enfeites desviam das celulas onde o jogador ja construiu
      const mine = this._playerCells(town);
      let streetSkips = 0;
      const counts = { floor: 0, wall: 0, furn: 0, roof: 0 };
      for (const op of ops) {
        if (skip.has(op.tag)) continue;
        if (op.tag === 'rua' && mine.has(this._cellOf(town, op.x, op.y))) { streetSkips++; continue; }
        this._write(op, id, false); counts[op.kind]++;
      }
      if (streetSkips) report.warnings.push(`${streetSkips} celula(s) de rua/praca deixadas livres por causa das suas construcoes`);
      this._touched();
      this.A.saveWorldData();
      this._refreshTrees();
      report.counts = counts;
      const g = this.game;
      g.addLog(`🏘️ [VILA] ${this.townName(id)}: ${report.buildings.length - skip.size} predios, ${counts.wall} paredes, ${counts.floor} pisos, ${counts.furn} moveis, ${counts.roof} telhados.`, 'action');
      for (const w of report.warnings) g.addLog('⚠️ [VILA] ' + w, 'warning');
      console.info('[Vila]', id, report);
      return report;
    }

    clear(id = 'vila_inicial') {
      const n = this._removeTown(id);
      this._touched(); this.A.saveWorldData();
      this.game.addLog(`🏘️ [VILA] ${n} peca(s) da vila removidas.`, 'tip');
      return n;
    }

    isBuilt(id = 'vila_inicial') { for (const k in this.A.blocks) if (this.A.blocks[k].town === id) return true; return false; }

    goto(id = 'vila_inicial') {
      const t = window.SURITTO_TOWNS[id]; if (!t) return;
      const [x, y] = cellCenter(t.center, 3, 3);
      const p = this.game.player; p.x = this.game.world.wrapX(x); p.y = y; p.z = 0; p.moveTarget = null; p.vx = p.vy = 0;
      this._refreshTrees();
    }

    // ---- validacao ----
    // Altura de cada movel acima do chao (px). Acima do muro (77) o movel fura o telhado.
    auditFurniture() {
      const FR = window.FurnitureRenderer, rows = [];
      if (!FR) return rows;
      for (const [k, cfg] of Object.entries(this.A.BLOCK_TYPES)) {
        if (!cfg.isFurniture || cfg.hidden) continue;
        const rots = cfg.rots === 4 ? [0, 90, 180, 270] : cfg.rots === 2 ? [0, 90] : [0];
        let h = 0;
        for (const r of rots) { const S = FR.sprite(cfg.furn, r, 0); h = Math.max(h, S.oy - 27); }   // oy = centro da celula; -27 = canto de tras
        rows.push({ movel: cfg.name, tipo: k.replace('dungeon_furn_', ''), altura: Math.round(h), status: cfg.furn === 'fireplace' ? 'chamine (fura de proposito)' : h > WALL_TOP ? 'FURA O TELHADO' : 'ok' });
      }
      rows.sort((a, b) => b.altura - a.altura);
      console.table(rows);
      return rows;
    }

    // Cena de teste (?scene=moveis): duas salas lado a lado, com todos os moveis encostados nas 4 paredes.
    // Sala 1 com telhado (nada pode passar do telhado), sala 2 sem telhado (moveis atras das paredes da frente).
    async buildFurnitureTestScene() {
      await this.whenReady();
      const town = window.SURITTO_TOWNS.vila_inicial;
      const O = { x: town.center.x, y: town.center.y - 27 * 160 };   // celula (-80,-80) da vila: bem ao norte, fora dela
      for (const k of Object.keys(this.A.blocks)) if (this.A.blocks[k].town === 'cena_moveis') delete this.A.blocks[k];
      const kinds = Object.entries(this.A.BLOCK_TYPES).filter(([, c]) => c.isFurniture && !c.hidden && c.cells === 1).map(([k]) => k.replace('dungeon_furn_', ''));
      const N = kinds.length, W = N + 2, D = N + 2;
      const furniture = [];
      kinds.forEach((t, n) => {
        furniture.push([t, n + 1, 0, 0]);          // encostado em N
        furniture.push([t, 0, n + 1, 90]);         // encostado em W
        furniture.push([t, n + 1, D - 1, 180]);    // encostado em S (parede da frente)
        furniture.push([t, W - 1, n + 1, 270]);    // encostado em E (parede da frente)
      });
      const plan = { name: 'Teste', W, D, floor: 'dungeon_floor_wood', roof: 'dungeon_roof_tile', doors: [{ side: 'S', at: 0 }], furniture };
      window.SURITTO_BUILDING_PLANS._teste_moveis = plan;
      const scene = { name: 'Cena de moveis', center: O, clearMargin: 3, streets: [], buildings: [
        { id: 'sala_com_telhado', plan: '_teste_moveis', i0: 0, j0: 0 },
        { id: 'sala_sem_telhado', plan: '_teste_moveis', i0: W + 3, j0: 0 }
      ] };
      window.SURITTO_TOWNS._cena_moveis = scene;
      try {
        const { ops, report } = this.planTown('_cena_moveis');
        for (const op of ops) {
          if (op.kind === 'roof' && op.tag === 'sala_sem_telhado') continue;
          this._write(op, 'cena_moveis', true);
        }
        const B = TownBuilder.bounds(scene);
        this.extraClearings.push({ center: O, ...B });
        this._touched(); this._refreshTrees();
        const [x, y] = cellCenter(O, W + 1, D + 3);
        const p = this.game.player; p.x = this.game.world.wrapX(x); p.y = y; p.z = 0;
        this._refreshTrees();
        this.game.addLog(`🧪 [TESTE] Cena de moveis: ${N} moveis x 4 paredes. Sala da esquerda com telhado, da direita sem. Nada e salvo.`, 'system');
        if (report.warnings.length) console.warn('[Cena moveis]', report.warnings);
      } finally {
        delete window.SURITTO_TOWNS._cena_moveis;
      }
      return this.auditFurniture();
    }
  }

  TownBuilder.VERSION = 2;   // suba quando mudar a forma de montar (forca remontar em todos os saves)
  window.TownBuilder = TownBuilder;
})();
