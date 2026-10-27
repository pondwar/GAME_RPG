// js/dungeon_snap.js - F2: encaixe por pontas (sockets) das pecas do atlas dungeon.
// Funcoes puras, sem dependencia de DOM. Coordenadas: mundo = plano da tela (pixels).
(function (root) {
  const DIRX = 0.894427, DIRY = 0.447214; // direcao 2:1 normalizada

  function norm(dx, dy) { const l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; }

  // Pontas da peca em coordenadas locais (relativas a ancora), sem espelhamento.
  // dx,dy = direcao "para fora" da peca naquela ponta.
  function localSockets(meta) {
    const out = [];
    if (!meta) return out;
    const k = meta.kind;
    if (meta.face && (k === 'wall' || k === 'door' || k === 'gate' || k === 'fence' || k === 'arch')) {
      const A = meta.face.A, B = meta.face.B;
      const d = norm(A.dx - B.dx, A.dy - B.dy);
      out.push({ tag: 'A', x: A.dx, y: A.dy, dx: d.x, dy: d.y });
      out.push({ tag: 'B', x: B.dx, y: B.dy, dx: -d.x, dy: -d.y });
    } else if ((k === 'corner_convex' || k === 'corner_concave') && meta.ground) {
      const g = meta.ground;
      const Lc = Math.round((Math.abs(g.left.dx) + Math.abs(g.right.dx)) / 2);
      const sy = k === 'corner_convex' ? -1 : 1; // convexa: bracos sobem; concava: bracos descem
      out.push({ tag: 'L', x: -Lc, y: sy * Lc / 2, dx: -DIRX, dy: sy * DIRY });
      out.push({ tag: 'R', x: Lc, y: sy * Lc / 2, dx: DIRX, dy: sy * DIRY });
    }
    return out;
  }

  function worldSockets(meta, ax, ay, flip) {
    const m = flip ? -1 : 1;
    return localSockets(meta).map(s => ({ tag: s.tag, x: ax + m * s.x, y: ay + s.y, dx: m * s.dx, dy: s.dy }));
  }

  // pieces: [{sprite, ax, ay, flip}]  frames: atlas.frames
  // Procura a ponta livre mais proxima do ponto (px,py) onde a peca 'sprite' encaixa.
  // Devolve {x,y,flip,cost,tag} (x,y = ancora da peca nova) ou null.
  function findSnap(pieces, frames, sprite, px, py, preferFlip, maxDist) {
    maxDist = maxDist || 90;
    const meta = frames[sprite];
    const mine = localSockets(meta);
    if (!meta || !mine.length) return null;

    const ex = [];
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      if (Math.abs(p.ax - px) > 400 || Math.abs(p.ay - py) > 400) continue;
      const ws = worldSockets(frames[p.sprite], p.ax, p.ay, p.flip);
      for (const s of ws) { s.owner = i; ex.push(s); }
    }
    const free = ex.filter(s => !ex.some(t => t.owner !== s.owner && Math.hypot(t.x - s.x, t.y - s.y) < 3 && (t.dx * s.dx + t.dy * s.dy) < -0.97));

    let best = null;
    for (const flip of [!!preferFlip, !preferFlip]) {
      const m = flip ? -1 : 1;
      for (const t of mine) {
        const tdx = m * t.dx, tdy = t.dy;
        for (const s of free) {
          if (s.dx * tdx + s.dy * tdy > -0.97) continue; // so encaixa em linha reta, pontas opostas
          const X = s.x - m * t.x, Y = s.y - t.y;
          const cost = Math.hypot(X - px, Y - py) + (flip !== !!preferFlip ? 6 : 0);
          if (cost < maxDist && (!best || cost < best.cost)) best = { x: Math.round(X), y: Math.round(Y), flip, cost, tag: t.tag, to: s.tag };
        }
      }
    }
    return best;
  }

  // F3: linha(s) de chao da peca para a ordem de desenho, relativas a ancora.
  // Reta: face A->B deslocada pela espessura (cap). Quina: dois bracos a partir do vertice (ancora).
  function depthSegments(meta, flip) {
    const m = flip ? -1 : 1, out = [];
    if (!meta) return out;
    const k = meta.kind, g = meta.ground, nat = meta.nativeSlope;
    if (meta.face && (k === 'wall' || k === 'door' || k === 'gate' || k === 'fence')) {
      const A = meta.face.A, B = meta.face.B, sx = m * meta.face.cap / 2, sy = -meta.face.cap / 4;
      out.push([m * A.dx + sx, A.dy + sy, m * B.dx + sx, B.dy + sy]);
    } else if (k === 'corner_convex' || k === 'corner_concave') {
      for (const s of localSockets(meta)) out.push([m * s.x, s.y, 0, 0]);
    } else if (k === 'arch') {
      const w = Math.round((Math.abs(g.left.dx) + Math.abs(g.right.dx)) / 2);
      out.push([m * -w, -w / 2, m * w, w / 2]);                      // eixo inteiro do arco
    } else if (k === 'wall_frontal' || k === 'double_door_frontal') {
      out.push([m * g.left.dx, -1, m * g.right.dx, -1]);
    } else if (k === 'pillar') {
      out.push([-12, -4, 12, -4]);
    } else if (k === 'ruin' && nat !== 'free') {
      const sl = nat === '\\' ? 0.5 : -0.5, f = g.front, y = x => f.dy + sl * (x - f.dx);
      out.push([m * g.left.dx, y(g.left.dx), m * (g.right.dx - 12), y(g.right.dx - 12)]);
    }
    return out;
  }

  // F4: colisores da peca (relativos a ancora, ja espelhados): { half: espessura/2 em px, segs: [[x0,y0,x1,y1],...] }.
  // Devolve null se o tipo nao tem colisor definido (o chamador usa o fallback antigo).
  function colliderSegments(meta, flip) {
    if (!meta) return null;
    const m = flip ? -1 : 1, k = meta.kind, g = meta.ground, nat = meta.nativeSlope;
    const sg = (x0, y0, x1, y1) => [m * x0, y0, m * x1, y1];
    if (meta.face && (k === 'wall' || k === 'door' || k === 'gate' || k === 'fence')) {
      const A = meta.face.A, B = meta.face.B, c = meta.face.cap;
      return { half: 8, segs: [sg(A.dx + c / 2, A.dy - c / 4, B.dx + c / 2, B.dy - c / 4)] };
    }
    if (k === 'corner_convex' || k === 'corner_concave') {
      return { half: 8, segs: localSockets(meta).map(s => sg(s.x, s.y, 0, 0)) };
    }
    if (k === 'pillar') return { half: 11, segs: [sg(0, -4, 0, -4)] };
    if (k === 'arch') {
      const w = Math.round((Math.abs(g.left.dx) + Math.abs(g.right.dx)) / 2), c = w - 10; // centro de cada pilar
      return { half: 5, segs: [sg(-c, -c / 2, -c, -c / 2), sg(c, c / 2, c, c / 2)] };       // vao central livre p/ passar
    }
    if (k === 'wall_frontal' || k === 'double_door_frontal') {
      return { half: 9, segs: [sg(g.left.dx, -1, g.right.dx, -1)] };
    }
    if (k === 'ruin') {
      if (nat === 'free') return { half: 0, segs: [] }; // entulho solto: atravessavel
      const sl = nat === '\\' ? 0.5 : -0.5;
      const f = g.front, y = x => f.dy + sl * (x - f.dx);
      const xa = g.left.dx, xb = g.right.dx - 12;
      return { half: 8, segs: [sg(xa, y(xa), xb, y(xb))] };
    }
    return null;
  }

  // F5: ancora para desenhar a peca 'metaB' no lugar de 'metaA' (mesma inclinacao e ponta A coincidente).
  // Serve p/ trocar o sprite de uma porta (fechada -> entreaberta -> aberta) sem a porta "andar".
  function altAnchor(metaA, metaB, ax, ay, flipA) {
    const opp = v => (v === '\\' ? '/' : '\\');
    const slopeA = flipA ? opp(metaA.nativeSlope) : metaA.nativeSlope;
    const flipB = metaB.nativeSlope !== slopeA;
    const mA = flipA ? -1 : 1, mB = flipB ? -1 : 1;
    const Ax = ax + mA * metaA.face.A.dx, Ay = ay + metaA.face.A.dy;
    return { ax: Ax - mB * metaB.face.A.dx, ay: Ay - metaB.face.A.dy, flip: flipB };
  }

  // F5: pilares de um portal ABERTO (o vao central fica livre); relativos a ancora, ja espelhados.
  function portalPosts(flip, c) {
    const m = flip ? -1 : 1; c = c || 30;
    return { half: 5, segs: [[m * -c, -c / 2, m * -c, -c / 2], [m * c, c / 2, m * c, c / 2]] };
  }

  const api = { localSockets, worldSockets, findSnap, depthSegments, colliderSegments, altAnchor, portalPosts };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DungeonSnap = api;
})(typeof window !== 'undefined' ? window : globalThis);
