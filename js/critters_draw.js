// critters_draw.js - Desenho por codigo dos bichos novos da fauna (coelho, raposa, javali, urso, corvo, lebre, texugo, esquilo, faisao, lince) e das
// plantas (arbusto de frutinhas, cogumelos), ate existir arte do Gem para eles. Luz de cima-esquerda, contorno escuro,
// 4 quadros de passo (frameIndex). (sx, sy) = pes no chao, na tela. Olhando para a esquerda; 'right' espelha.
(function () {
  const OUT = '#1c140d';
  function shadow(c, sx, sy, rx, ry, a = 0.28) { c.fillStyle = `rgba(0,0,0,${a})`; c.beginPath(); c.ellipse(sx, sy, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
  function blob(c, x, y, rx, ry, col, rot = 0) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke(); }
  function leg(c, x, y, len, w, col, ang = 0) { c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = col; c.fillRect(-w / 2, 0, w, len); c.strokeStyle = OUT; c.lineWidth = 1; c.strokeRect(-w / 2, 0, w, len); c.restore(); }
  // passo: angulo das pernas por quadro (par e impar alternam)
  const swing = (f, moving) => moving ? [0.35, 0, -0.35, 0][f % 4] : 0;
  function begin(c, e, sx, sy) { c.save(); c.translate(Math.round(sx), Math.round(sy)); if (e.direction === 'right') c.scale(-1, 1); }

  function rabbit(c, e, sx, sy) {
    shadow(c, sx, sy, 11, 4);
    begin(c, e, sx, sy);
    const moving = e.act === 'flee' || e.act === 'roam' || e.act === 'forage', hop = moving ? [0, -4, -6, -3][e.frameIndex % 4] : 0;
    const head = e.state === 'grazing' ? 4 : 0;
    c.translate(0, hop);
    leg(c, 5, -5, 5, 3, '#7a6a58', swing(e.frameIndex, moving));
    blob(c, 2, -9, 9, 6.5, '#8f7d69');                         // corpo
    blob(c, 2, -11, 6, 3, 'rgba(255,240,220,0.18)');
    blob(c, 11, -10, 3, 3, '#f1ece4');                         // rabo
    leg(c, -5, -5, 5, 3, '#8f7d69', -swing(e.frameIndex, moving));
    blob(c, -7, -13 + head, 5, 4.5, '#97846f');                // cabeca
    blob(c, -6, -21 + head, 1.8, 6, '#8a7864', -0.15);         // orelhas
    blob(c, -3.5, -21 + head, 1.8, 6, '#9a8772', 0.2);
    c.fillStyle = '#d9a3a3'; c.fillRect(-4, -24 + head, 1, 4);
    c.fillStyle = OUT; c.fillRect(-10, -14 + head, 1.6, 1.6);  // olho
    c.restore();
  }
  function fox(c, e, sx, sy) {
    shadow(c, sx, sy, 17, 5);
    begin(c, e, sx, sy);
    const moving = e.act !== 'rest' && e.state !== 'satiated' && e.act !== 'idle', s = swing(e.frameIndex, moving);
    const low = e.act === 'stalk' ? 3 : 0;
    c.translate(0, low);
    leg(c, 8, -10, 10, 3, '#2a1f18', s); leg(c, -7, -10, 10, 3, '#2a1f18', -s);
    // rabo
    c.fillStyle = '#c8642a'; c.beginPath(); c.moveTo(13, -14); c.quadraticCurveTo(28, -18, 30, -8); c.quadraticCurveTo(24, -6, 13, -10); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();
    blob(c, 28, -9, 3.5, 2.6, '#f4efe6');
    blob(c, 2, -15, 14, 6.5, '#c8642a');                       // corpo
    blob(c, -1, -12, 8, 3, '#f2e6d8');                         // peito
    leg(c, 6, -10, 10, 3, '#2a1f18', -s); leg(c, -9, -10, 10, 3, '#2a1f18', s);
    blob(c, -13, -19, 6.5, 5.5, '#d06d30');                    // cabeca
    c.fillStyle = '#d06d30'; c.beginPath(); c.moveTo(-17, -20); c.lineTo(-25, -16); c.lineTo(-16, -15); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // focinho
    c.fillStyle = OUT; c.fillRect(-25.5, -17, 2, 2);
    c.fillStyle = '#b5551f'; for (const ex of [-15, -10]) { c.beginPath(); c.moveTo(ex - 2.5, -23); c.lineTo(ex, -30); c.lineTo(ex + 2.5, -23); c.closePath(); c.fill(); c.stroke(); }
    c.fillStyle = OUT; c.fillRect(-16, -21, 1.8, 1.8);
    c.restore();
  }
  function boar(c, e, sx, sy) {
    shadow(c, sx, sy, 24, 7);
    begin(c, e, sx, sy);
    const moving = e.act !== 'graze' && e.act !== 'rest' && e.act !== 'idle', s = swing(e.frameIndex, moving);
    leg(c, 12, -11, 11, 5, '#2f251d', s); leg(c, -10, -11, 11, 5, '#2f251d', -s);
    blob(c, 3, -20, 21, 12, '#4d3d30');                        // corpo
    blob(c, 0, -26, 15, 4, 'rgba(255,230,200,0.10)');
    c.strokeStyle = '#2a1f17'; c.lineWidth = 1.4;                // cerdas no lombo
    for (let i = -10; i <= 14; i += 3) { c.beginPath(); c.moveTo(i, -31); c.lineTo(i + 1, -35); c.stroke(); }
    leg(c, 9, -11, 11, 5, '#3a2e24', -s); leg(c, -13, -11, 11, 5, '#3a2e24', s);
    const down = e.state === 'grazing' ? 4 : 0;
    blob(c, -18, -19 + down, 10, 9, '#57463a');                // cabeca
    blob(c, -27, -15 + down, 4.5, 4, '#8a6a5a');               // focinho
    c.fillStyle = OUT; c.fillRect(-29, -16 + down, 1.5, 1.5); c.fillRect(-27, -16 + down, 1.5, 1.5);
    c.strokeStyle = '#f1ead8'; c.lineWidth = 2; c.beginPath(); c.moveTo(-24, -13 + down); c.quadraticCurveTo(-28, -18 + down, -26, -21 + down); c.stroke();   // presa
    c.fillStyle = '#3a2e24'; c.beginPath(); c.moveTo(-17, -27 + down); c.lineTo(-13, -33 + down); c.lineTo(-11, -26 + down); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();
    c.fillStyle = e.state === 'attack' ? '#ff5a3c' : OUT; c.fillRect(-21, -22 + down, 2, 2);
    c.restore();
  }
  function bear(c, e, sx, sy) {
    shadow(c, sx, sy, 34, 10);
    begin(c, e, sx, sy);
    const moving = e.act !== 'rest' && e.act !== 'idle' && e.state !== 'satiated', s = swing(e.frameIndex, moving) * 0.8;
    if (e.state === 'attack' && e.act === 'charge' && e.chargeT > 1.6) {   // ergue nas patas de tras antes de avancar
      leg(c, 6, -24, 24, 9, '#3e2a1b', 0); leg(c, -6, -24, 24, 9, '#4a3322', 0);
      blob(c, 0, -46, 17, 26, '#5d4029');
      blob(c, -2, -50, 9, 14, 'rgba(255,220,180,0.10)');
      blob(c, -16, -58, 7, 5, '#5d4029', -0.6); blob(c, 16, -58, 7, 5, '#5d4029', 0.6);   // bracos abertos
      blob(c, 0, -76, 12, 11, '#664631');
      blob(c, -9, -85, 4, 4, '#5d4029'); blob(c, 9, -85, 4, 4, '#5d4029');
      blob(c, -2, -72, 5, 4, '#a07a58');
      c.fillStyle = OUT; c.fillRect(-6, -79, 2, 2); c.fillRect(3, -79, 2, 2); c.fillRect(-3, -73, 3, 2);
      c.restore(); return;
    }
    leg(c, 18, -18, 18, 9, '#3a281a', s); leg(c, -14, -18, 18, 9, '#3a281a', -s);
    blob(c, 4, -34, 31, 19, '#5d4029');                        // corpo
    blob(c, 10, -46, 14, 9, '#634430');                        // corcova
    blob(c, 0, -44, 20, 5, 'rgba(255,220,180,0.10)');
    leg(c, 14, -18, 18, 9, '#4a3322', -s); leg(c, -18, -18, 18, 9, '#4a3322', s);
    blob(c, -26, -36, 13, 11, '#664631');                      // cabeca
    blob(c, -37, -31, 6, 5, '#a07a58');                        // focinho
    blob(c, -22, -47, 4.2, 4.2, '#5d4029'); blob(c, -31, -45, 4, 4, '#5d4029');
    c.fillStyle = OUT; c.fillRect(-41, -33, 3, 2.5); c.fillRect(-30, -39, 2, 2);
    c.restore();
  }
  function crow(c, e, sx, sy) {
    const z = e.z || 0;
    shadow(c, sx, sy, 7 * Math.max(0.4, 1 - z / 200), 2.5 * Math.max(0.4, 1 - z / 200), 0.22);
    begin(c, e, sx, sy - z);
    const fly = z > 4, flap = fly ? [-0.9, -0.3, 0.5, -0.3][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 1, -4, 4, 1, '#2b2b2b', 0); leg(c, 3, -4, 4, 1, '#2b2b2b', 0); }
    blob(c, 2, -8, 7, 4.5, '#1d1d24');                         // corpo
    c.fillStyle = '#1d1d24'; c.beginPath(); c.moveTo(8, -9); c.lineTo(14, -11); c.lineTo(13, -6); c.closePath(); c.fill();   // cauda
    blob(c, -5, -11, 4, 3.6, '#24242c');                       // cabeca
    c.fillStyle = '#3a3a40'; c.beginPath(); c.moveTo(-8, -11); c.lineTo(-13, -10); c.lineTo(-8, -9); c.closePath(); c.fill();   // bico
    c.fillStyle = '#d8d8d8'; c.fillRect(-6, -12, 1.2, 1.2);
    c.save(); c.translate(2, -10); c.rotate(flap);              // asa
    c.fillStyle = '#2c2c36'; c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(3, fly ? -14 : -4, 10, fly ? -9 : 1); c.lineTo(4, 2); c.closePath(); c.fill(); c.strokeStyle = '#0d0d10'; c.lineWidth = 1; c.stroke();
    c.restore();
    c.restore();
  }

  // Arbusto de frutinhas: as bolinhas somem conforme a regiao fica sem frutinhas (level 0..1)
  function bush(c, p, sx, sy, level) {
    shadow(c, sx, sy, 22, 7);
    const r = (n) => { const v = Math.sin(p.seed * 9301 + n * 49.297) * 233280; return v - Math.floor(v); };
    const parts = [[-10, -12, 13, 11], [10, -12, 13, 11], [0, -22, 15, 13], [0, -10, 16, 10]];
    for (const [x, y, rx, ry] of parts) blob(c, sx + x, sy + y, rx, ry, '#3c6b2e');
    for (const [x, y, rx, ry] of parts) { c.fillStyle = 'rgba(160,220,110,0.22)'; c.beginPath(); c.ellipse(sx + x - rx * 0.25, sy + y - ry * 0.3, rx * 0.55, ry * 0.45, 0, 0, Math.PI * 2); c.fill(); }
    const n = Math.round(level * 14);
    for (let i = 0; i < n; i++) {
      const a = r(i) * Math.PI * 2, d = r(i + 50) * 0.85;
      const x = sx + Math.cos(a) * 18 * d, y = sy - 15 + Math.sin(a) * 11 * d;
      c.fillStyle = r(i + 99) > 0.5 ? '#7d2a5a' : '#b8263a'; c.beginPath(); c.arc(x, y, 2.2, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.6)'; c.fillRect(x - 1, y - 1.2, 1, 1);
    }
  }
  // Cogumelos: tamanho e quantidade pelo nivel da regiao
  function mushroom(c, p, sx, sy, level) {
    if (level < 0.2) return;
    const r = (n) => { const v = Math.sin(p.seed * 7919 + n * 12.9898) * 43758.5453; return v - Math.floor(v); };
    const n = 2 + Math.round(level * 3);
    for (let i = 0; i < n; i++) {
      const x = sx + (r(i) - 0.5) * 26, y = sy + (r(i + 7) - 0.5) * 10, k = (0.6 + r(i + 3) * 0.6) * (0.7 + level * 0.3);
      shadow(c, x, y, 6 * k, 2 * k, 0.2);
      c.fillStyle = '#efe4cf'; c.fillRect(x - 1.5 * k, y - 8 * k, 3 * k, 8 * k); c.strokeStyle = OUT; c.lineWidth = 1; c.strokeRect(x - 1.5 * k, y - 8 * k, 3 * k, 8 * k);
      const red = r(i + 11) > 0.6;
      c.fillStyle = red ? '#b8332a' : '#8a5a34'; c.beginPath(); c.ellipse(x, y - 8 * k, 6.5 * k, 4.2 * k, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
      if (red) { c.fillStyle = '#f6efe0'; c.fillRect(x - 3 * k, y - 10 * k, 1.4, 1.4); c.fillRect(x + 1.5 * k, y - 11 * k, 1.4, 1.4); }
    }
  }

  // ---- Pacote A (Europa): lebre, texugo, esquilo, faisao, lince. Bloquinhos ate chegar a arte do Gem ----
  function hare(c, e, sx, sy) {
    shadow(c, sx, sy, 14, 4.5);
    begin(c, e, sx, sy);
    const moving = e.act === 'flee' || e.act === 'roam' || e.act === 'forage', hop = moving ? [0, -6, -9, -4][e.frameIndex % 4] : 0;
    const head = e.state === 'grazing' ? 4 : 0;
    c.translate(0, hop);
    leg(c, 7, -7, 7, 3.4, '#6f5a45', swing(e.frameIndex, moving));
    blob(c, 3, -12, 12, 7.5, '#9a8268');                       // corpo
    blob(c, 3, -14.5, 8, 3.2, 'rgba(255,240,215,0.2)');
    blob(c, 3, -8.5, 8, 3, '#d8ccb6');                         // barriga
    blob(c, 14, -12, 3.2, 3.2, '#f1ece4');                     // rabo (preto em cima)
    c.fillStyle = '#2a211a'; c.fillRect(13, -15, 4, 2);
    leg(c, -6, -7, 7, 3.4, '#9a8268', -swing(e.frameIndex, moving));
    blob(c, -9, -17 + head, 5.4, 4.6, '#a68e73');               // cabeca
    blob(c, -8, -29 + head, 2.2, 8.5, '#947c62', -0.12);       // orelhas altas
    blob(c, -4.5, -29 + head, 2.2, 8.5, '#a68e73', 0.2);
    c.fillStyle = '#1c140d'; c.fillRect(-9.2, -37.5 + head, 2.6, 2.4); c.fillRect(-5.7, -37.5 + head, 2.6, 2.4);   // pontas pretas
    c.fillStyle = OUT; c.fillRect(-12.5, -18.5 + head, 1.8, 1.8);
    c.restore();
  }
  function badger(c, e, sx, sy) {
    shadow(c, sx, sy, 19, 5.5);
    begin(c, e, sx, sy);
    const moving = e.act !== 'rest' && e.act !== 'idle', s = swing(e.frameIndex, moving) * 0.8;
    leg(c, 9, -6, 6, 4, '#2a2420', s); leg(c, -8, -6, 6, 4, '#2a2420', -s);
    blob(c, 2, -11, 17, 8.5, '#7c7a76');                       // corpo largo e baixo
    blob(c, 2, -14, 12, 4, 'rgba(255,255,255,0.18)');
    blob(c, -4, -9, 12, 4, '#4a4744');                         // flanco escuro
    blob(c, 19, -11, 3.2, 2.4, '#6b6966');                     // rabo curto
    leg(c, 5, -6, 6, 4, '#38322e', -s); leg(c, -11, -6, 6, 4, '#38322e', s);
    blob(c, -15, -12, 7, 5.5, '#efece6');                      // cabeca clara
    c.fillStyle = '#211c18'; c.beginPath(); c.moveTo(-21, -15); c.lineTo(-9, -17); c.lineTo(-10, -14); c.lineTo(-20, -12); c.closePath(); c.fill();   // faixa escura
    c.fillStyle = '#211c18'; c.beginPath(); c.moveTo(-21, -9); c.lineTo(-12, -9.5); c.lineTo(-12, -7.5); c.closePath(); c.fill();
    blob(c, -22, -11.5, 1.8, 1.6, '#17110d');                  // focinho
    c.fillStyle = '#f5f5f0'; c.fillRect(-17.5, -14.2, 1.4, 1.4);
    c.restore();
  }
  function squirrel(c, e, sx, sy) {
    shadow(c, sx, sy, 8, 3);
    begin(c, e, sx, sy);
    const moving = e.act === 'flee' || e.act === 'roam' || e.act === 'forage', hop = moving ? [0, -3, -4, -2][e.frameIndex % 4] : 0;
    c.translate(0, hop);
    c.fillStyle = '#b5532a'; c.beginPath(); c.moveTo(4, -6); c.quadraticCurveTo(16, -14, 11, -26); c.quadraticCurveTo(4, -22, 1, -11); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // cauda enorme
    blob(c, 11, -22, 2.6, 4, '#d9794a', 0.3);
    leg(c, 2, -4, 4, 2.4, '#7a361b', swing(e.frameIndex, moving));
    blob(c, 0, -9, 6.2, 5.2, '#c2602f');                       // corpo
    blob(c, -1, -7, 3.6, 3, '#f1e6d2');                        // barriga
    blob(c, -6, -14, 4, 3.6, '#c76a37');                       // cabeca
    blob(c, -6.5, -18.5, 1.3, 2.6, '#a24a24');                 // orelhas com tufo
    blob(c, -4, -18.5, 1.3, 2.6, '#a24a24');
    blob(c, -9.5, -13.5, 1.5, 1.2, '#f1e6d2');
    c.fillStyle = OUT; c.fillRect(-8.4, -15.2, 1.4, 1.4);
    c.restore();
  }
  function pheasant(c, e, sx, sy) {
    shadow(c, sx, sy, 11, 3.5);
    begin(c, e, sx, sy);
    const moving = e.act === 'flee' || e.act === 'roam' || e.act === 'forage', bob = moving ? [0, -1.5, 0, -1.5][e.frameIndex % 4] : 0, peck = e.state === 'grazing' ? 5 : 0;
    c.translate(0, bob);
    c.fillStyle = '#9a5a2a'; c.beginPath(); c.moveTo(8, -13); c.quadraticCurveTo(26, -17, 33, -8); c.quadraticCurveTo(22, -9, 9, -8); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // cauda longa
    c.fillStyle = '#6b3a1a'; c.fillRect(14, -12.5, 14, 1.2);
    leg(c, 1, -6, 6, 1.6, '#8a7a5a', swing(e.frameIndex, moving) * 0.7); leg(c, 4, -6, 6, 1.6, '#8a7a5a', -swing(e.frameIndex, moving) * 0.7);
    blob(c, 1, -12, 9, 6.2, '#b0642e');                        // corpo cobre
    blob(c, 0, -14, 6, 2.8, 'rgba(255,225,170,0.25)');
    c.fillStyle = '#3a2a1a'; for (let i = 0; i < 4; i++) c.fillRect(-4 + i * 3.4, -12 + (i % 2), 1.4, 1.4);
    blob(c, -7, -17 + peck, 3.8, 3.6, '#2f6b52');              // cabeca verde
    blob(c, -9, -16 + peck, 1.9, 2, '#b8262a');                // face vermelha
    c.fillStyle = '#efe9dc'; c.fillRect(-7, -14 + peck, 4, 1.2);   // colar branco
    c.fillStyle = '#e0c060'; c.beginPath(); c.moveTo(-11, -17 + peck); c.lineTo(-14, -16 + peck); c.lineTo(-11, -15.5 + peck); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-9.2, -18 + peck, 1.2, 1.2);
    c.restore();
  }
  function lynx(c, e, sx, sy) {
    shadow(c, sx, sy, 22, 6);
    begin(c, e, sx, sy);
    const moving = e.act !== 'rest' && e.state !== 'satiated' && e.act !== 'idle', s = swing(e.frameIndex, moving);
    const low = e.act === 'stalk' || e.act === 'ambush' ? 4 : 0;
    c.translate(0, low);
    leg(c, 10, -11, 11, 3.6, '#5a4a34', s); leg(c, -9, -11, 11, 3.6, '#5a4a34', -s);
    c.fillStyle = '#a07c4c'; c.beginPath(); c.moveTo(15, -16); c.quadraticCurveTo(22, -17, 23, -11); c.lineTo(14, -11); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // rabo curto
    c.fillStyle = '#1c140d'; c.fillRect(20.5, -13, 2.6, 2.4);
    blob(c, 3, -17, 17, 9, '#b8905a');                         // corpo
    blob(c, 3, -20, 12, 4, 'rgba(255,235,190,0.22)');
    c.fillStyle = '#5a4128'; for (const [x, y] of [[-4, -19], [3, -22], [9, -18], [-1, -15], [7, -14], [12, -20]]) c.fillRect(x, y, 2, 2);
    blob(c, 3, -11, 12, 3.4, '#e6d9bd');                       // barriga clara
    leg(c, 7, -11, 11, 3.6, '#6a5439', -s); leg(c, -13, -11, 11, 3.6, '#7a6244', s);
    blob(c, -17, -21, 7.4, 6.6, '#c09a64');                    // cabeca com bochechas
    blob(c, -21, -18, 4.4, 3.4, '#ece2cc');                    // bochecha clara
    c.fillStyle = '#b8905a'; c.beginPath(); c.moveTo(-21, -26); c.lineTo(-19, -34); c.lineTo(-16, -27); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // orelha com tufo
    c.beginPath(); c.moveTo(-15, -27); c.lineTo(-12, -34); c.lineTo(-11, -26); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#17110d'; c.fillRect(-19.8, -35.6, 1.6, 2.6); c.fillRect(-12.6, -35.6, 1.6, 2.6);
    c.fillStyle = '#d9c24a'; c.fillRect(-22, -22.5, 2.2, 1.8);   // olho amarelo
    c.fillStyle = OUT; c.fillRect(-21.4, -22.2, 1, 1.2);
    blob(c, -24, -18, 1.6, 1.3, '#3a2a22');
    c.restore();
  }

  // ---- Domesticos da vila (js/domestic.js): bloquinhos ate chegar a arte do Gem ----
  const walking = (e) => e.act === 'walk' || e.act === 'flee';
  function chicken(c, e, sx, sy) {
    shadow(c, sx, sy, 10, 3);
    begin(c, e, sx, sy);
    const m = walking(e), bob = m ? [0, -1.5, 0, -1.5][e.frameIndex % 4] : 0, peck = e.act === 'idle' && (e.frameIndex % 4 > 1) ? 4 : 0;
    c.translate(0, bob);
    leg(c, 1, -6, 6, 1.6, '#d9a443', swing(e.frameIndex, m) * 0.7); leg(c, 4, -6, 6, 1.6, '#d9a443', -swing(e.frameIndex, m) * 0.7);
    c.fillStyle = '#e9e1d2'; c.beginPath(); c.moveTo(7, -11); c.quadraticCurveTo(15, -18, 13, -8); c.lineTo(7, -8); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // cauda
    blob(c, 1, -11, 8.5, 6.5, '#f1ece0');                      // corpo branco
    blob(c, 0, -9, 5, 3.5, '#d8cdb6');                         // asa
    blob(c, -6, -16 + peck, 3.6, 3.4, '#f4efe4');              // cabeca
    c.fillStyle = '#c92a2a'; c.fillRect(-7, -21 + peck, 3.4, 2.6);   // crista
    c.fillStyle = '#e0a63a'; c.beginPath(); c.moveTo(-9.5, -16 + peck); c.lineTo(-12.5, -15 + peck); c.lineTo(-9.5, -14.2 + peck); c.closePath(); c.fill();
    c.fillStyle = '#c92a2a'; c.fillRect(-8.6, -14 + peck, 1.4, 2);
    c.fillStyle = OUT; c.fillRect(-7.6, -17 + peck, 1.2, 1.2);
    c.restore();
  }
  function sheep(c, e, sx, sy) {
    shadow(c, sx, sy, 20, 5.5);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m) * 0.7, bob = m ? [0, -1, 0, -1][e.frameIndex % 4] : 0, graze = e.act === 'idle' && (e.frameIndex % 4 > 1) ? 4 : 0;
    c.translate(0, bob);
    leg(c, 9, -8, 8, 3, '#3a3029', s); leg(c, -9, -8, 8, 3, '#3a3029', -s);
    for (const [x, y, r] of [[-10, -17, 8], [0, -20, 9], [10, -17, 8], [-4, -14, 9], [6, -14, 9]]) blob(c, x, y, r, r * 0.85, '#ece6d8');   // la fofa
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.ellipse(-2, -23, 6, 3, 0, 0, Math.PI * 2); c.fill();
    leg(c, 5, -8, 8, 3, '#2a2420', -s); leg(c, -13, -8, 8, 3, '#2a2420', s);
    blob(c, -19, -17 + graze, 5, 5.2, '#3a3029');              // cara escura
    blob(c, -22, -15.5 + graze, 3, 2.4, '#4a3f36');
    c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(-16, -20 + graze, 3, 1.6, 0.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#f1ece0'; c.fillRect(-20.5, -18.5 + graze, 1.3, 1.3);
    c.restore();
  }
  function cow(c, e, sx, sy) {
    shadow(c, sx, sy, 32, 8);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m) * 0.6, graze = e.act === 'idle' && (e.frameIndex % 4 > 1) ? 6 : 0;
    leg(c, 17, -14, 14, 5, '#5a4a40', s); leg(c, -15, -14, 14, 5, '#5a4a40', -s);
    blob(c, 2, -26, 26, 13, '#f1ece2');                        // corpo branco
    for (const [x, y, rx, ry] of [[-8, -30, 9, 6], [10, -27, 8, 8], [2, -20, 7, 4]]) { c.fillStyle = '#2d2622'; c.beginPath(); c.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2); c.fill(); }   // manchas
    c.fillStyle = '#e6a7a0'; c.beginPath(); c.ellipse(14, -15, 5, 3.5, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // ubere
    c.strokeStyle = '#3a2f28'; c.lineWidth = 2; c.beginPath(); c.moveTo(27, -32); c.quadraticCurveTo(32, -24, 28, -14); c.stroke();   // rabo
    leg(c, 11, -14, 14, 5, '#3f342d', -s); leg(c, -21, -14, 14, 5, '#3f342d', s);
    blob(c, -28, -26 + graze, 9, 7.5, '#f1ece2');              // cabeca
    blob(c, -34, -23 + graze, 5, 4, '#d9a69a');                // focinho
    c.fillStyle = '#e9dfc0'; c.beginPath(); c.moveTo(-26, -32 + graze); c.lineTo(-23, -38 + graze); c.lineTo(-22, -31 + graze); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // chifre
    blob(c, -22, -29 + graze, 3, 2, '#2d2622', 0.6);           // orelha
    c.fillStyle = OUT; c.fillRect(-30, -28 + graze, 1.6, 1.6);
    c.restore();
  }
  function pig(c, e, sx, sy) {
    shadow(c, sx, sy, 22, 6);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m) * 0.7, bob = m ? [0, -1, 0, -1][e.frameIndex % 4] : 0;
    c.translate(0, bob);
    leg(c, 11, -8, 8, 4, '#c98f84', s); leg(c, -11, -8, 8, 4, '#c98f84', -s);
    blob(c, 2, -15, 18, 10, '#e8aaa0');                        // corpo rosado
    blob(c, 2, -19, 12, 4, 'rgba(255,230,220,0.3)');
    c.strokeStyle = '#c47c72'; c.lineWidth = 2; c.beginPath(); c.arc(21, -17, 3, 0, Math.PI * 1.6); c.stroke();   // rabo enrolado
    leg(c, 6, -8, 8, 4, '#b87a70', -s); leg(c, -15, -8, 8, 4, '#b87a70', s);
    blob(c, -18, -15, 8, 7, '#eeb2a8');                        // cabeca
    blob(c, -25, -13, 4.5, 3.6, '#d98c82');                    // focinho
    c.fillStyle = '#7a3a34'; c.fillRect(-27.5, -14, 1.4, 1.8); c.fillRect(-25, -14, 1.4, 1.8);
    blob(c, -14, -21, 3.4, 4.2, '#d98c82', 0.5);               // orelha caida
    c.fillStyle = OUT; c.fillRect(-20, -17, 1.6, 1.6);
    c.restore();
  }
  function horse(c, e, sx, sy) {
    shadow(c, sx, sy, 32, 8);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m), graze = e.act === 'idle' && (e.frameIndex % 4 > 1) ? 10 : 0;
    leg(c, 19, -24, 24, 4.5, '#5a2f1a', s); leg(c, -17, -24, 24, 4.5, '#5a2f1a', -s);
    c.fillStyle = '#2a1a12'; c.beginPath(); c.moveTo(26, -38); c.quadraticCurveTo(38, -34, 33, -12); c.quadraticCurveTo(28, -22, 24, -28); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // cauda
    blob(c, 4, -36, 26, 12, '#8a4a26');                        // corpo alazao
    blob(c, 4, -41, 18, 4.5, 'rgba(255,220,170,0.22)');
    leg(c, 12, -24, 24, 4.5, '#6a3a1e', -s); leg(c, -22, -24, 24, 4.5, '#6a3a1e', s);
    c.fillStyle = '#8a4a26'; c.beginPath(); c.moveTo(-18, -42); c.lineTo(-26, -58 + graze); c.lineTo(-34, -52 + graze); c.lineTo(-24, -34); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // pescoco
    blob(c, -34, -52 + graze * 1.1, 9, 6, '#946030', -0.5);    // cabeca
    c.fillStyle = '#2a1a12'; c.beginPath(); c.moveTo(-20, -44); c.lineTo(-27, -58 + graze); c.lineTo(-24, -60 + graze); c.lineTo(-16, -46); c.closePath(); c.fill();   // crina
    c.fillStyle = '#946030'; c.beginPath(); c.moveTo(-28, -60 + graze); c.lineTo(-27, -66 + graze); c.lineTo(-24, -60 + graze); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = OUT; c.fillRect(-37, -54 + graze, 1.6, 1.6);
    c.restore();
  }
  function goat(c, e, sx, sy) {
    shadow(c, sx, sy, 19, 5);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m) * 0.8, graze = e.act === 'idle' && (e.frameIndex % 4 > 1) ? 4 : 0;
    leg(c, 9, -12, 12, 3, '#5a5048', s); leg(c, -9, -12, 12, 3, '#5a5048', -s);
    blob(c, 2, -19, 15, 8, '#efe9dc');                         // corpo
    blob(c, 2, -23, 10, 3.4, 'rgba(255,255,255,0.3)');
    c.fillStyle = '#efe9dc'; c.beginPath(); c.moveTo(16, -22); c.lineTo(20, -26); c.lineTo(18, -19); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // rabinho
    leg(c, 5, -12, 12, 3, '#3f3a34', -s); leg(c, -13, -12, 12, 3, '#3f3a34', s);
    c.fillStyle = '#efe9dc'; c.beginPath(); c.moveTo(-13, -23); c.lineTo(-19, -32 + graze); c.lineTo(-24, -28 + graze); c.lineTo(-16, -17); c.closePath(); c.fill(); c.stroke();   // pescoco
    blob(c, -23, -28 + graze, 5.5, 4.6, '#f1ece0', -0.3);      // cabeca
    c.fillStyle = '#d8cdb6'; c.beginPath(); c.moveTo(-26, -24 + graze); c.lineTo(-24, -19 + graze); c.lineTo(-22, -24 + graze); c.closePath(); c.fill();   // barbicha
    c.strokeStyle = '#6a5a44'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-22, -32 + graze); c.quadraticCurveTo(-18, -42 + graze, -13, -38 + graze); c.stroke();   // chifre curvo
    c.fillStyle = OUT; c.fillRect(-25, -29 + graze, 1.3, 1.3);
    c.restore();
  }
  function dog(c, e, sx, sy) {
    shadow(c, sx, sy, 17, 5);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m), wag = e.act === 'idle' ? Math.sin(e.frameIndex * 1.6) * 3 : 0;
    leg(c, 9, -10, 10, 3.2, '#4a3220', s); leg(c, -8, -10, 10, 3.2, '#4a3220', -s);
    c.fillStyle = '#7a5230'; c.beginPath(); c.moveTo(15, -17); c.quadraticCurveTo(23 + wag, -26, 21 + wag, -22); c.lineTo(15, -13); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // rabo
    blob(c, 3, -15, 15, 7.5, '#8a5e3a');                       // corpo
    blob(c, 3, -18, 10, 3, 'rgba(255,225,180,0.22)');
    c.fillStyle = '#2d2018'; c.beginPath(); c.ellipse(5, -17, 7, 4, 0, 0, Math.PI * 2); c.fill();   // manto escuro
    leg(c, 5, -10, 10, 3.2, '#5a3a22', -s); leg(c, -12, -10, 10, 3.2, '#5a3a22', s);
    blob(c, -17, -21, 6.2, 5.6, '#8a5e3a');                    // cabeca
    blob(c, -23, -19, 4.4, 3.2, '#c8a37a');                    // focinho
    c.fillStyle = '#1c140d'; c.fillRect(-27, -20, 2, 1.8);
    blob(c, -13, -24, 2.6, 5, '#3a2616', 0.3);                 // orelha caida
    c.fillStyle = OUT; c.fillRect(-19.5, -22.5, 1.5, 1.5);
    c.restore();
  }
  function cat(c, e, sx, sy) {
    shadow(c, sx, sy, 11, 3.5);
    begin(c, e, sx, sy);
    const m = walking(e), s = swing(e.frameIndex, m) * 0.8, tail = Math.sin(e.frameIndex * 1.3) * 2;
    leg(c, 6, -7, 7, 2.6, '#4a4a4f', s); leg(c, -6, -7, 7, 2.6, '#4a4a4f', -s);
    c.strokeStyle = '#6a6a72'; c.lineWidth = 2.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(10, -10); c.quadraticCurveTo(18, -14 + tail, 16, -24 + tail); c.stroke(); c.lineCap = 'butt';   // rabo erguido
    blob(c, 1, -10, 10, 5.8, '#7b7b84');                       // corpo cinza
    c.fillStyle = '#4a4a52'; for (let i = 0; i < 4; i++) c.fillRect(-4 + i * 3.4, -14, 1.3, 4);   // listras
    leg(c, 3, -7, 7, 2.6, '#55555c', -s); leg(c, -9, -7, 7, 2.6, '#55555c', s);
    blob(c, -11, -14, 4.8, 4.4, '#85858e');                    // cabeca
    c.fillStyle = '#85858e'; c.beginPath(); c.moveTo(-15, -17); c.lineTo(-14, -22); c.lineTo(-11.5, -18); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // orelhas
    c.beginPath(); c.moveTo(-10, -18); c.lineTo(-8, -22); c.lineTo(-7, -17); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#d9c24a'; c.fillRect(-14, -15.2, 1.6, 1.4);
    c.fillStyle = '#e9b8b8'; c.fillRect(-15.8, -13, 1.2, 1);
    c.restore();
  }

  window.CritterArt = {
    draw(c, e, sx, sy) { const f = { rabbit, fox, boar, bear, crow, hare, badger, squirrel, pheasant, lynx, chicken, sheep, cow, pig, horse, goat, dog, cat }[e.kind]; if (f) f(c, e, sx, sy); },
    plant(c, p, sx, sy, level) { if (p.kind === 'bush') bush(c, p, sx, sy, level); else mushroom(c, p, sx, sy, level); },
    names: { rabbit: 'Coelho Silvestre', fox: 'Raposa Vermelha', boar: 'Javali', bear: 'Urso Pardo', crow: 'Corvo', hare: 'Lebre', badger: 'Texugo', squirrel: 'Esquilo-vermelho', pheasant: 'Faisão', lynx: 'Lince', chicken: 'Galinha', sheep: 'Ovelha', cow: 'Vaca', pig: 'Porco', horse: 'Cavalo', goat: 'Cabra', dog: 'Cão', cat: 'Gato' }
  };
})();
