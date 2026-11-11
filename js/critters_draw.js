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
    if (e.urubu) { c.scale(1.35, 1.35); }                       // urubu (Brasil): maior, cabeca nua
    blob(c, 2, -8, 7, 4.5, '#1d1d24');                         // corpo
    c.fillStyle = '#1d1d24'; c.beginPath(); c.moveTo(8, -9); c.lineTo(14, -11); c.lineTo(13, -6); c.closePath(); c.fill();   // cauda
    blob(c, -5, -11, 4, 3.6, e.urubu ? '#8a6a62' : '#24242c');   // cabeca
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
    blob(c, 1, -11, 8.5, 6.5, e.br ? '#8a5a34' : '#f1ece0');   // corpo (caipira: marrom e pintada)
    if (e.br) { c.fillStyle = '#e8dcc6'; for (let i = 0; i < 5; i++) c.fillRect(-5 + i * 3, -14 + (i % 2) * 4, 1.4, 1.4); }
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
    if (e.br) { blob(c, 2, -26, 26, 13, '#d9d4c8'); blob(c, -12, -37, 8, 7, '#cfc9bc'); blob(c, -12, -40, 5, 3, 'rgba(255,255,255,0.3)'); }   // zebu: cinza claro com a pequena corcova nos ombros
    else {
    blob(c, 2, -26, 26, 13, '#f1ece2');                        // corpo branco
    for (const [x, y, rx, ry] of [[-8, -30, 9, 6], [10, -27, 8, 8], [2, -20, 7, 4]]) { c.fillStyle = '#2d2622'; c.beginPath(); c.ellipse(x, y, rx, ry, 0.3, 0, Math.PI * 2); c.fill(); }   // manchas
    }
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
    blob(c, 4, -36, 26, 12, e.br ? '#6a5a44' : '#8a4a26');     // corpo (crioulo: baio escuro, mais parrudo)
    if (e.br) { c.fillStyle = '#2a2018'; c.fillRect(-18, -46, 4, 8); }
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
    blob(c, 3, -15, 15, 7.5, e.br ? '#d9a54a' : '#8a5e3a');    // corpo (vira-lata caramelo no Brasil)
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

  // ---- Pacote A: coruja, pato, castor e ervas ----
  function owl(c, e, sx, sy) {
    const z = e.z || 0, fly = z > 4;
    shadow(c, sx, sy, 8 * Math.max(0.4, 1 - z / 160), 3 * Math.max(0.4, 1 - z / 160), 0.22);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-1.0, -0.2, 0.7, -0.2][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 0, -5, 5, 2, '#b98f4a', 0); leg(c, 4, -5, 5, 2, '#b98f4a', 0); }
    blob(c, 1, -14, 8.5, 10, '#c9a26a');                       // corpo
    blob(c, 1, -10, 5.4, 6.4, '#efe3c8');                      // peito claro
    c.fillStyle = '#8a6a3a'; for (let i = 0; i < 4; i++) c.fillRect(-1 + (i % 2) * 3, -14 + i * 2.2, 1.6, 1.2);
    c.save(); c.translate(5, -17); c.rotate(flap);              // asa
    c.fillStyle = '#a98250'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -16 : -3, 11, fly ? -11 : 6); c.lineTo(4, 5); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();
    c.restore();
    blob(c, -2, -25, 8.2, 7.2, '#f3ead6');                     // cabeca em coracao
    blob(c, -5, -25, 3.8, 3.8, '#fff8e8'); blob(c, 1, -25, 3.8, 3.8, '#fff8e8');
    c.fillStyle = '#1c140d'; c.beginPath(); c.arc(-5, -25, 1.9, 0, 6.3); c.arc(1, -25, 1.9, 0, 6.3); c.fill();   // olhos grandes
    c.fillStyle = '#d9a23a'; c.beginPath(); c.moveTo(-3, -23.4); c.lineTo(-2, -21); c.lineTo(-1, -23.4); c.closePath(); c.fill();   // bico
    c.restore();
  }
  function duck(c, e, sx, sy) {
    const z = e.z || 0, fly = z > 4;
    shadow(c, sx, sy, 11 * Math.max(0.4, 1 - z / 160), 3.5 * Math.max(0.4, 1 - z / 160), 0.22);
    begin(c, e, sx, sy - z);
    const m = e.act === 'walk', bob = m ? [0, -1, 0, -1][e.frameIndex % 4] : 0, flap = fly ? [-1.0, -0.2, 0.8, -0.2][e.frameIndex % 4] : 0;
    c.translate(0, bob);
    if (!fly) { leg(c, 0, -5, 5, 1.8, '#e08a2a', swing(e.frameIndex, m) * 0.7); leg(c, 3, -5, 5, 1.8, '#e08a2a', -swing(e.frameIndex, m) * 0.7); }
    c.fillStyle = '#6a6a72'; c.beginPath(); c.moveTo(8, -10); c.lineTo(14, -13); c.lineTo(12, -7); c.closePath(); c.fill();
    blob(c, 2, -9, 9.5, 6, '#8f8f98');                         // corpo cinza
    blob(c, -4, -8, 5, 5, '#8a4a2a');                          // peito marrom
    c.fillStyle = '#2a4a8a'; c.fillRect(0, -9, 5, 2);           // espelho azul da asa
    c.save(); c.translate(3, -12); c.rotate(flap); c.fillStyle = '#7d7d86'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -13 : -3, 10, fly ? -8 : 2); c.lineTo(3, 3); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    blob(c, -8, -16, 4, 3.8, '#2f7a4a');                       // cabeca verde
    c.fillStyle = '#efefef'; c.fillRect(-10.5, -13.5, 5, 1.2);   // anel branco
    c.fillStyle = '#e8c23a'; c.beginPath(); c.ellipse(-13, -15.5, 3.4, 1.6, 0, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // bico
    c.fillStyle = OUT; c.fillRect(-9.2, -17.2, 1.3, 1.3);
    c.restore();
  }
  function beaver(c, e, sx, sy) {
    shadow(c, sx, sy, 15, 4.5);
    begin(c, e, sx, sy);
    const m = e.act === 'walk' || e.act === 'flee', s = swing(e.frameIndex, m) * 0.7, gnaw = e.act === 'idle' ? (e.frameIndex % 2) * 1.2 : 0;
    leg(c, 6, -5, 5, 3.4, '#3f2a1a', s); leg(c, -6, -5, 5, 3.4, '#3f2a1a', -s);
    c.fillStyle = '#2f2118'; c.beginPath(); c.ellipse(17, -6, 8, 3.2, 0.1, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // cauda larga e chata
    c.strokeStyle = '#4a3322'; c.lineWidth = 0.8; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(12 + i * 3, -8); c.lineTo(12 + i * 3, -4); c.stroke(); }
    blob(c, 2, -10, 12, 8, '#6b4a2e');                         // corpo
    blob(c, 2, -13, 8, 3.4, 'rgba(255,220,170,0.2)');
    leg(c, 3, -5, 5, 3.4, '#573a22', -s); leg(c, -9, -5, 5, 3.4, '#573a22', s);
    blob(c, -11, -12, 6, 5.6, '#78543a');                      // cabeca
    blob(c, -16, -10.5 + gnaw * 0.3, 3.6, 3, '#5a3d28');       // focinho
    c.fillStyle = '#f1e6c0'; c.fillRect(-18.5, -9.5, 2.2, 3 + gnaw);   // dentes
    c.fillStyle = OUT; c.fillRect(-13.6, -14, 1.4, 1.4);
    blob(c, -8, -17, 2, 2, '#4a3322');
    c.restore();
  }
  // Ervas medicinais: p.seed escolhe camomila (branca e amarela), hortela (folhas verdes) ou salvia (folhas cinzentas e flor roxa)
  function herb(c, p, sx, sy, level) {
    if (p.set === 1) return herbBR(c, p, sx, sy, level);
    if (level < 0.2) return;
    const r = (n) => { const v = Math.sin(p.seed * 6151 + n * 31.7) * 9631; return v - Math.floor(v); };
    const type = Math.floor(p.seed * 3) % 3, n = 3 + Math.round(level * 3);
    for (let i = 0; i < n; i++) {
      const x = sx + (r(i) - 0.5) * 22, y = sy + (r(i + 5) - 0.5) * 9, k = (0.7 + r(i + 2) * 0.5) * (0.7 + level * 0.3), h = (8 + r(i + 9) * 5) * k;
      shadow(c, x, y, 4 * k, 1.5 * k, 0.18);
      c.strokeStyle = type === 2 ? '#7d9a7a' : '#3f7a35'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + (r(i + 3) - 0.5) * 4, y - h * 0.6, x + (r(i + 4) - 0.5) * 3, y - h); c.stroke();
      const tx = x + (r(i + 4) - 0.5) * 3, ty = y - h;
      if (type === 0) { c.fillStyle = '#fbf7ee'; for (let a = 0; a < 6; a++) { c.beginPath(); c.ellipse(tx + Math.cos(a * 1.05) * 2.6 * k, ty + Math.sin(a * 1.05) * 2.6 * k, 1.5 * k, 1 * k, a * 1.05, 0, 6.3); c.fill(); } c.fillStyle = '#e6b422'; c.beginPath(); c.arc(tx, ty, 1.4 * k, 0, 6.3); c.fill(); }
      else if (type === 1) { c.fillStyle = '#4f9a3e'; c.beginPath(); c.ellipse(tx - 2 * k, ty + 1, 3 * k, 1.8 * k, -0.5, 0, 6.3); c.ellipse(tx + 2 * k, ty + 1, 3 * k, 1.8 * k, 0.5, 0, 6.3); c.ellipse(tx, ty - 1, 2.6 * k, 1.6 * k, 0, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 0.7; c.stroke(); }
      else { c.fillStyle = '#9db79a'; c.beginPath(); c.ellipse(tx, ty + 2, 3.4 * k, 1.8 * k, 0.2, 0, 6.3); c.fill(); c.fillStyle = '#8a5fb0'; c.fillRect(tx - 1, ty - 3 * k, 2, 3 * k); }
    }
  }

  // ---- Pacote B (Brasil): bloquinhos ate chegar a arte do Gem ----
  const mv = (e) => e.act !== 'rest' && e.act !== 'idle' && e.state !== 'satiated' && e.act !== 'graze';
  function jaguar(c, e, sx, sy) {
    shadow(c, sx, sy, 28, 7);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m), low = e.act === 'stalk' || e.act === 'ambush' ? 5 : 0;
    c.translate(0, low);
    leg(c, 14, -13, 13, 4.4, '#7a5a2a', s); leg(c, -13, -13, 13, 4.4, '#7a5a2a', -s);
    c.fillStyle = '#d8a548'; c.beginPath(); c.moveTo(20, -22); c.quadraticCurveTo(36, -22, 38, -10); c.lineTo(30, -12); c.quadraticCurveTo(26, -18, 19, -16); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // cauda
    blob(c, 4, -22, 22, 11, '#dcaa4c');                        // corpo dourado
    blob(c, 4, -26, 15, 4.5, 'rgba(255,235,170,0.25)');
    blob(c, 4, -14, 15, 3.6, '#f1e1b8');                       // barriga
    c.fillStyle = '#2a1a0e'; for (const [x, y] of [[-8, -26], [-2, -29], [5, -27], [12, -25], [-4, -20], [3, -19], [10, -20], [16, -22], [-12, -22], [20, -17]]) { c.beginPath(); c.arc(x, y, 2.4, 0, 6.3); c.fill(); c.fillStyle = '#dcaa4c'; c.beginPath(); c.arc(x, y, 0.9, 0, 6.3); c.fill(); c.fillStyle = '#2a1a0e'; }   // rosetas
    leg(c, 9, -13, 13, 4.4, '#9a7234', -s); leg(c, -18, -13, 13, 4.4, '#9a7234', s);
    blob(c, -24, -26, 9.4, 8.4, '#e1b155');                    // cabeca grande
    blob(c, -30, -22, 5, 3.6, '#f1e1b8');
    c.fillStyle = '#e1b155'; c.beginPath(); c.arc(-27, -33, 2.8, 0, 6.3); c.arc(-20, -33, 2.8, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // orelhas
    c.fillStyle = '#2a1a0e'; c.fillRect(-26, -27.4, 1.4, 1.4); c.fillRect(-30, -27, 1.4, 1.4); c.fillRect(-23, -30, 1.6, 1.6);
    c.fillStyle = '#d9c24a'; c.fillRect(-28.6, -28.4, 2.2, 1.8);
    c.fillStyle = OUT; c.fillRect(-28.2, -28.2, 1, 1.2);
    blob(c, -34, -23.5, 1.8, 1.4, '#3a2a22');
    c.restore();
  }
  function capybara(c, e, sx, sy) {
    shadow(c, sx, sy, 24, 6);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.7, graze = e.state === 'grazing' || e.act === 'graze' ? 4 : 0;
    leg(c, 11, -8, 8, 4.4, '#5a3a24', s); leg(c, -10, -8, 8, 4.4, '#5a3a24', -s);
    blob(c, 2, -16, 21, 11, '#8a5a36');                        // corpo
    blob(c, 2, -21, 14, 4, 'rgba(255,225,180,0.2)');
    leg(c, 6, -8, 8, 4.4, '#6a4428', -s); leg(c, -15, -8, 8, 4.4, '#6a4428', s);
    blob(c, -20, -17 + graze, 9, 8, '#94623a');                // cabeca quadrada
    blob(c, -26, -14 + graze, 5, 5, '#7a4a2a');                // focinho largo
    c.fillStyle = '#1c140d'; c.fillRect(-29, -15.5 + graze, 1.8, 1.8); c.fillRect(-21.5, -21 + graze, 1.6, 1.6);
    blob(c, -14, -24 + graze, 2.2, 2.2, '#5a3a24');
    c.restore();
  }
  function tapir(c, e, sx, sy) {
    shadow(c, sx, sy, 30, 7);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.7;
    leg(c, 15, -12, 12, 5, '#3a3a40', s); leg(c, -14, -12, 12, 5, '#3a3a40', -s);
    blob(c, 3, -27, 26, 14, '#4a4a52');                        // corpo cinza-escuro
    blob(c, -4, -30, 12, 8, '#e8e4dc');                        // faixa clara no dorso/ombro
    blob(c, 3, -33, 18, 4.4, 'rgba(255,255,255,0.18)');
    leg(c, 9, -12, 12, 5, '#2f2f36', -s); leg(c, -20, -12, 12, 5, '#2f2f36', s);
    blob(c, -28, -29, 10, 8.6, '#4f4f57');                     // cabeca
    c.fillStyle = '#4f4f57'; c.beginPath(); c.moveTo(-35, -29); c.quadraticCurveTo(-46, -26, -45, -17); c.quadraticCurveTo(-39, -21, -33, -22); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // probosce
    blob(c, -22, -35, 2.8, 3.4, '#e8e4dc');                    // orelha com borda branca
    c.fillStyle = OUT; c.fillRect(-31, -31, 1.6, 1.6);
    c.restore();
  }
  function peccary(c, e, sx, sy) {
    shadow(c, sx, sy, 20, 5.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m);
    leg(c, 9, -8, 8, 3.2, '#2a2420', s); leg(c, -9, -8, 8, 3.2, '#2a2420', -s);
    blob(c, 2, -15, 16, 9, '#4a423a');                         // corpo escuro e eriçado
    c.strokeStyle = '#2a241e'; c.lineWidth = 1; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(-8 + i * 3.4, -22); c.lineTo(-8 + i * 3.4 + 1, -25); c.stroke(); }
    blob(c, -10, -17, 9, 4.6, '#efe8da');                      // colar branco no queixo/pescoco
    leg(c, 5, -8, 8, 3.2, '#3a342e', -s); leg(c, -13, -8, 8, 3.2, '#3a342e', s);
    blob(c, -19, -14, 7, 6, '#4f463d');                        // cabeca
    blob(c, -25, -12, 4, 3.4, '#3a322a');
    c.fillStyle = '#efe8da'; c.fillRect(-27.6, -10.4, 1.4, 2);   // dente
    c.fillStyle = OUT; c.fillRect(-21, -16, 1.5, 1.5);
    c.restore();
  }
  function anteater(c, e, sx, sy) {
    shadow(c, sx, sy, 30, 6);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.6;
    c.fillStyle = '#6a5a4a'; c.beginPath(); c.moveTo(14, -22); c.quadraticCurveTo(42, -26, 44, -6); c.quadraticCurveTo(26, -12, 12, -10); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // cauda peluda enorme
    c.strokeStyle = '#8a7a68'; c.lineWidth = 1; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(18 + i * 4, -20 + i); c.lineTo(22 + i * 4, -9); c.stroke(); }
    leg(c, 8, -11, 11, 3.4, '#2a2420', s); leg(c, -4, -11, 11, 3.4, '#2a2420', -s);
    blob(c, 0, -18, 16, 9, '#8f8678');                         // corpo cinza
    c.fillStyle = '#1c1816'; c.beginPath(); c.moveTo(-10, -22); c.lineTo(12, -20); c.lineTo(10, -14); c.closePath(); c.fill();   // faixa preta
    c.fillStyle = '#f1ece2'; c.beginPath(); c.moveTo(-10, -22); c.lineTo(-4, -24); c.lineTo(14, -20); c.lineTo(12, -19); c.closePath(); c.fill();   // borda branca
    c.fillStyle = '#7a6f62'; c.beginPath(); c.moveTo(-14, -22); c.quadraticCurveTo(-28, -22, -34, -12); c.lineTo(-33, -10); c.quadraticCurveTo(-24, -14, -12, -12); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // focinho longo
    blob(c, -13, -20, 4.4, 4, '#8f8678');
    leg(c, 3, -11, 11, 3.4, '#3a342e', s); leg(c, -10, -11, 11, 3.4, '#3a342e', -s);
    c.fillStyle = OUT; c.fillRect(-15, -22, 1.4, 1.4);
    c.restore();
  }
  function sloth(c, e, sx, sy) {
    shadow(c, sx, sy, 12, 4);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.3;
    leg(c, 6, -6, 7, 3.2, '#5a4a3a', s); leg(c, -6, -6, 7, 3.2, '#5a4a3a', -s);
    blob(c, 0, -13, 10, 8.4, '#9a8a74');                       // corpo felpudo
    c.strokeStyle = '#7a6a56'; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-6 + i * 3.4, -19); c.lineTo(-7 + i * 3.4, -15); c.stroke(); }
    blob(c, -9, -19, 6, 5.2, '#b3a48c');                       // cabeca clara
    c.fillStyle = '#4a3a2c'; c.beginPath(); c.ellipse(-10, -19.5, 4.4, 2, -0.2, 0, 6.3); c.fill();   // mascara escura
    c.fillStyle = '#efe6d0'; c.fillRect(-12, -19.8, 1.2, 1.2); c.fillRect(-8, -19.8, 1.2, 1.2);
    c.strokeStyle = '#e8dfc8'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-12.5, -17); c.lineTo(-7, -17); c.stroke();   // sorriso
    c.strokeStyle = '#efe6d0'; c.lineWidth = 1.2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-7 + i * 2, -7); c.lineTo(-6 + i * 2, -2); c.stroke(); }   // garras
    c.restore();
  }
  function capuchin(c, e, sx, sy) {
    shadow(c, sx, sy, 10, 3.2);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m), hop = m ? [0, -2, -3, -1][e.frameIndex % 4] : 0;
    c.translate(0, hop);
    c.strokeStyle = '#4a3624'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath(); c.moveTo(7, -11); c.quadraticCurveTo(18, -12, 15, -26); c.quadraticCurveTo(13, -30, 17, -30); c.stroke(); c.lineCap = 'butt';   // cauda longa
    leg(c, 4, -6, 7, 2.8, '#5a4430', s); leg(c, -4, -6, 7, 2.8, '#5a4430', -s);
    blob(c, 1, -13, 7, 6.6, '#7a5a3c');                        // corpo
    blob(c, -1, -14, 4.4, 4.6, '#d8c4a0');                     // peito claro
    c.strokeStyle = '#6a4c30'; c.lineWidth = 2; c.beginPath(); c.moveTo(-4, -14); c.lineTo(-9, -9); c.stroke();   // braco
    blob(c, -5, -22, 5.2, 5, '#d8c4a0');                       // cabeca clara
    c.fillStyle = '#3a2a1c'; c.beginPath(); c.ellipse(-5, -25.6, 5, 2.6, 0, Math.PI, 0); c.fill();   // topete escuro
    c.fillStyle = OUT; c.fillRect(-8, -22.6, 1.3, 1.3); c.fillRect(-4, -22.6, 1.3, 1.3);
    c.fillStyle = '#c89a7a'; c.fillRect(-8, -20, 3, 1.4);
    c.restore();
  }
  function rhea(c, e, sx, sy) {
    shadow(c, sx, sy, 20, 5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.9, peck = e.state === 'grazing' || e.act === 'graze' ? 22 : 0;
    leg(c, 4, -22, 22, 2.6, '#8a7a68', s); leg(c, -3, -22, 22, 2.6, '#8a7a68', -s);
    blob(c, 4, -30, 17, 11, '#8e8274');                        // corpo desgrenhado
    c.fillStyle = '#7a6e60'; for (let i = 0; i < 5; i++) { c.beginPath(); c.ellipse(10 + i * 1.5, -22 + i * 2, 5, 2, 0.2, 0, 6.3); c.fill(); }
    c.strokeStyle = '#8e8274'; c.lineWidth = 4.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-8, -36); c.lineTo(-14, -52 + peck); c.stroke(); c.lineCap = 'butt';   // pescoco
    blob(c, -15, -54 + peck, 4.6, 3.6, '#a59886');             // cabeca pequena
    c.fillStyle = '#d9c9a8'; c.beginPath(); c.moveTo(-19, -54 + peck); c.lineTo(-24, -52.5 + peck); c.lineTo(-19, -51.6 + peck); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-16.4, -55.4 + peck, 1.3, 1.3);
    c.restore();
  }
  function maned_wolf(c, e, sx, sy) {
    shadow(c, sx, sy, 22, 5.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m);
    leg(c, 10, -24, 24, 3, '#1f1814', s); leg(c, -9, -24, 24, 3, '#1f1814', -s);
    c.fillStyle = '#c9702c'; c.beginPath(); c.moveTo(14, -30); c.quadraticCurveTo(26, -30, 24, -18); c.lineTo(15, -24); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // rabo
    blob(c, 3, -31, 15, 8, '#d27a34');                         // corpo alaranjado
    c.fillStyle = '#1f1814'; c.beginPath(); c.moveTo(-8, -36); c.lineTo(10, -37); c.lineTo(8, -33); c.lineTo(-8, -33); c.closePath(); c.fill();   // crina preta
    leg(c, 6, -24, 24, 3, '#2a201a', -s); leg(c, -13, -24, 24, 3, '#2a201a', s);
    blob(c, -17, -37, 6.2, 5.6, '#d27a34');                    // cabeca
    blob(c, -23, -35, 4, 2.8, '#d27a34');                      // focinho fino
    c.fillStyle = '#d27a34'; c.beginPath(); c.moveTo(-19, -42); c.lineTo(-17, -52); c.lineTo(-13, -42); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // orelha grande
    c.fillStyle = '#f1e6d2'; c.fillRect(-22, -33.4, 4, 1.4);
    c.fillStyle = OUT; c.fillRect(-19.4, -38.4, 1.4, 1.4); c.fillRect(-26.2, -36, 2, 1.6);
    c.restore();
  }
  function armadillo(c, e, sx, sy) {
    shadow(c, sx, sy, 15, 4);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m);
    leg(c, 6, -5, 5, 2.8, '#4a3e34', s); leg(c, -6, -5, 5, 2.8, '#4a3e34', -s);
    c.fillStyle = '#6a5a4a'; c.beginPath(); c.moveTo(12, -10); c.lineTo(22, -7); c.lineTo(12, -6); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // rabo
    blob(c, 1, -11, 13, 8, '#8f7e6a');                         // carapaca
    c.strokeStyle = '#5e5042'; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-8 + i * 4.4, -18); c.quadraticCurveTo(-8 + i * 4.4 + 2, -11, -8 + i * 4.4, -4); c.stroke(); }
    blob(c, -13, -9, 5.6, 4.6, '#a59580');                     // cabeca
    blob(c, -18, -8, 3, 2.2, '#7a6a58');
    c.fillStyle = '#7a6a58'; c.beginPath(); c.moveTo(-14, -13); c.lineTo(-12, -17); c.lineTo(-10, -12.5); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-14.4, -10.4, 1.3, 1.3);
    c.restore();
  }
  function toucan(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 7 * Math.max(0.4, 1 - z / 160), 2.5, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-1.0, -0.2, 0.8, -0.2][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 0, -3, 6, 1.8, '#5a6a8a', 0); leg(c, 3, -3, 6, 1.8, '#5a6a8a', 0); }
    c.fillStyle = '#16161c'; c.beginPath(); c.moveTo(6, -9); c.lineTo(14, -6); c.lineTo(6, -5); c.closePath(); c.fill();   // cauda
    blob(c, 0, -11, 7.4, 7.4, '#1d1d24');                      // corpo preto
    blob(c, -4, -13, 3.8, 4, '#f6c42a');                       // peito amarelo
    c.save(); c.translate(3, -14); c.rotate(flap); c.fillStyle = '#26262e'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -14 : -3, 9, fly ? -9 : 3); c.lineTo(3, 3); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    blob(c, -7, -18, 4.2, 4, '#1d1d24');                       // cabeca
    c.fillStyle = '#f08a1a'; c.beginPath(); c.moveTo(-9, -21); c.quadraticCurveTo(-22, -19, -23, -14); c.quadraticCurveTo(-14, -14, -9, -15.4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // bico enorme
    c.fillStyle = '#1c140d'; c.fillRect(-22, -17, 2, 2);
    c.fillStyle = '#3a8ac8'; c.fillRect(-9, -19.4, 2.4, 2.4);
    c.fillStyle = OUT; c.fillRect(-8.6, -19, 1.2, 1.2);
    c.restore();
  }
  function macaw(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 8 * Math.max(0.4, 1 - z / 160), 2.5, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-1.0, -0.2, 0.8, -0.2][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 0, -3, 6, 1.8, '#4a4a52', 0); leg(c, 3, -3, 6, 1.8, '#4a4a52', 0); }
    c.fillStyle = '#c4221f'; c.beginPath(); c.moveTo(4, -9); c.lineTo(20, -3); c.lineTo(5, -6); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // cauda longa
    c.fillStyle = '#2a5ac8'; c.fillRect(12, -6, 7, 1.4);
    blob(c, 0, -12, 7.6, 8, '#d62a24');                        // corpo vermelho
    c.save(); c.translate(3, -15); c.rotate(flap); c.fillStyle = '#f2c230'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -15 : -3, 10, fly ? -10 : 4); c.lineTo(3, 4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();
    c.fillStyle = '#2a6ad8'; c.beginPath(); c.moveTo(5, 1); c.quadraticCurveTo(8, fly ? -6 : 1, 10, fly ? -10 : 4); c.lineTo(5, 4); c.closePath(); c.fill(); c.restore();
    blob(c, -6, -19, 4.6, 4.4, '#d62a24');                     // cabeca
    blob(c, -8, -18.6, 2.6, 2.4, '#f4eee4');                   // face branca
    c.fillStyle = '#efe6cc'; c.beginPath(); c.moveTo(-9, -22); c.quadraticCurveTo(-16, -21, -14, -15); c.lineTo(-10, -17); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // bico curvo
    c.fillStyle = OUT; c.fillRect(-7.4, -19.4, 1.2, 1.2);
    c.restore();
  }
  function caiman(c, e, sx, sy) {
    shadow(c, sx, sy, 32, 5, 0.22);
    begin(c, e, sx, sy);
    const m = e.act === 'walk' || e.act === 'flee', s = swing(e.frameIndex, m) * 0.5;
    leg(c, 14, -4, 5, 3.4, '#2d3a24', s); leg(c, -12, -4, 5, 3.4, '#2d3a24', -s);
    c.fillStyle = '#4a5a34'; c.beginPath(); c.moveTo(18, -9); c.quadraticCurveTo(36, -8, 46, -3); c.quadraticCurveTo(30, -4, 18, -4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // cauda
    blob(c, 2, -8, 20, 5.6, '#56693c');                        // corpo
    c.fillStyle = '#3a4a28'; for (let i = 0; i < 7; i++) c.fillRect(-14 + i * 4.6, -13.5, 2.4, 2.4);   // escamas do dorso
    leg(c, 8, -4, 5, 3.4, '#3a4a28', -s); leg(c, -18, -4, 5, 3.4, '#3a4a28', s);
    c.fillStyle = '#5e7342'; c.beginPath(); c.moveTo(-18, -12); c.lineTo(-36, -8); c.lineTo(-37, -5); c.lineTo(-18, -4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();   // focinho
    c.fillStyle = '#efe9d4'; for (let i = 0; i < 4; i++) c.fillRect(-35 + i * 4, -5.4, 1.2, 1.6);   // dentes
    c.fillStyle = '#d9c24a'; c.fillRect(-22, -12.6, 2, 1.6);
    c.fillStyle = OUT; c.fillRect(-21.4, -12.4, 1, 1.2);
    c.restore();
  }

  // Ervas do Brasil: boldo (folhas largas acinzentadas), erva-cidreira (capim fino e alto), guaco (trepadeira de folha em coracao)
  function herbBR(c, p, sx, sy, level) {
    if (level < 0.2) return;
    const r = (n) => { const v = Math.sin(p.seed * 4231 + n * 21.3) * 7919; return v - Math.floor(v); };
    const type = Math.floor(p.seed * 3) % 3, n = 3 + Math.round(level * 3);
    for (let i = 0; i < n; i++) {
      const x = sx + (r(i) - 0.5) * 22, y = sy + (r(i + 5) - 0.5) * 9, k = (0.7 + r(i + 2) * 0.5) * (0.7 + level * 0.3), h = (9 + r(i + 9) * 6) * k;
      shadow(c, x, y, 4 * k, 1.5 * k, 0.18);
      if (type === 0) { c.fillStyle = '#8fa88a'; c.beginPath(); c.ellipse(x, y - h * 0.5, 3.6 * k, h * 0.5, (r(i + 3) - 0.5) * 0.6, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 0.8; c.stroke(); c.strokeStyle = '#d8e4d0'; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - h); c.stroke(); }
      else if (type === 1) { c.strokeStyle = '#7fb04a'; c.lineWidth = 1.2; for (let b = -1; b <= 1; b++) { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + b * 3 * k, y - h * 0.6, x + b * 6 * k, y - h * 1.1); c.stroke(); } }
      else { c.strokeStyle = '#4f7a35'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 3 * k, y - h * 0.5, x + 2 * k, y - h); c.stroke(); c.fillStyle = '#3f8a3a'; c.beginPath(); c.moveTo(x + 2 * k, y - h); c.bezierCurveTo(x - 4 * k, y - h - 3 * k, x - 5 * k, y - h + 3 * k, x + 2 * k, y - h + 5 * k); c.bezierCurveTo(x + 8 * k, y - h + 3 * k, x + 7 * k, y - h - 3 * k, x + 2 * k, y - h); c.fill(); c.strokeStyle = OUT; c.lineWidth = 0.7; c.stroke(); }
    }
  }

  // ---- Pacote B (fim): cervo-do-pantanal, harpia, sucuri ----
  function marsh_deer(c, e, sx, sy) {
    shadow(c, sx, sy, 26, 6.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m), graze = e.state === 'grazing' || e.act === 'graze' ? 14 : 0;
    leg(c, 14, -26, 26, 3.6, '#5a2f1a', s); leg(c, -13, -26, 26, 3.6, '#5a2f1a', -s);
    blob(c, 2, -38, 22, 11, '#a85a2c');                        // corpo ruivo
    blob(c, 2, -43, 15, 4, 'rgba(255,220,170,0.22)');
    blob(c, 22, -39, 3.4, 2.6, '#f1e8d8');                     // rabo claro
    leg(c, 8, -26, 26, 3.6, '#2a1a12', -s); leg(c, -19, -26, 26, 3.6, '#2a1a12', s);   // patas pretas
    c.fillStyle = '#a85a2c'; c.beginPath(); c.moveTo(-14, -44); c.lineTo(-22, -62 + graze); c.lineTo(-29, -57 + graze); c.lineTo(-18, -34); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // pescoco
    blob(c, -28, -58 + graze, 7.4, 5.4, '#b8683a', -0.4);      // cabeca
    c.fillStyle = '#1f1a16'; c.fillRect(-35, -57 + graze, 3, 2);
    c.strokeStyle = '#6a4a2e'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-24, -63 + graze); c.lineTo(-22, -74 + graze); c.moveTo(-22, -69 + graze); c.lineTo(-17, -73 + graze); c.moveTo(-22, -74 + graze); c.lineTo(-25, -78 + graze); c.stroke();   // galhada
    c.fillStyle = OUT; c.fillRect(-30, -60 + graze, 1.4, 1.4);
    c.restore();
  }
  function harpy(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 12 * Math.max(0.4, 1 - z / 200), 3.5, 0.22);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-1.0, -0.2, 0.8, -0.2][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 0, -4, 7, 3, '#e8d062', 0); leg(c, 5, -4, 7, 3, '#e8d062', 0); }
    c.fillStyle = '#3a3a42'; c.beginPath(); c.moveTo(8, -12); c.lineTo(20, -6); c.lineTo(8, -4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // cauda
    blob(c, 0, -18, 10, 13, '#3d3d46');                        // corpo cinza-escuro
    blob(c, -1, -14, 6.4, 8.4, '#efeae0');                     // peito branco
    c.fillStyle = '#1c1c22'; c.fillRect(-6, -22, 12, 3);        // faixa escura no peito
    c.save(); c.translate(4, -22); c.rotate(flap); c.fillStyle = '#2f2f38'; c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(4, fly ? -20 : -4, 14, fly ? -13 : 8); c.lineTo(5, 7); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    blob(c, -4, -33, 6.4, 6, '#b8b8c2');                       // cabeca cinza
    c.fillStyle = '#3a3a44'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0 + i * 2, -37); c.lineTo(5 + i * 3, -43 - i); c.lineTo(3 + i * 2, -35); c.closePath(); c.fill(); }   // penacho
    c.fillStyle = '#2a2a30'; c.beginPath(); c.moveTo(-9, -34); c.lineTo(-15, -31.5); c.lineTo(-9.6, -30); c.closePath(); c.fill();
    c.fillStyle = '#f0d048'; c.fillRect(-7, -35, 2, 1.8);
    c.fillStyle = OUT; c.fillRect(-6.5, -34.8, 1, 1.4);
    c.restore();
  }
  function anaconda(c, e, sx, sy) {
    shadow(c, sx, sy, 40, 4, 0.2);
    begin(c, e, sx, sy);
    const t = (e.frameIndex % 4) * 0.7, moving = e.act === 'walk' || e.act === 'flee';
    const n = 24;
    for (let pass = 0; pass < 2; pass++) {
      c.beginPath();
      for (let i = 0; i <= n; i++) { const x = -34 + i * (68 / n), y = -6 + Math.sin(i * 0.6 + (moving ? t : 0)) * 2.8; if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
      c.lineCap = 'round'; c.lineWidth = pass ? 6 : 8.4; c.strokeStyle = pass ? '#5a6a38' : OUT; c.stroke();
    }
    c.fillStyle = '#2f3a1e'; for (let i = 2; i < n; i += 3) { const x = -34 + i * (68 / n), y = -6 + Math.sin(i * 0.6 + (moving ? t : 0)) * 2.8; c.beginPath(); c.ellipse(x, y, 2.4, 1.7, 0, 0, 6.3); c.fill(); }   // manchas redondas
    blob(c, -38, -7, 6, 4.4, '#66763e');                       // cabeca
    c.fillStyle = '#d9c24a'; c.fillRect(-40, -9, 1.8, 1.6);
    c.fillStyle = OUT; c.fillRect(-39.6, -8.8, 1, 1.2);
    c.strokeStyle = '#b8263a'; c.lineWidth = 1; c.beginPath(); c.moveTo(-43, -6.4); c.lineTo(-48, -6.4); c.lineTo(-50, -8); c.moveTo(-48, -6.4); c.lineTo(-50, -5); c.stroke();   // lingua
    c.restore();
  }

  // ---- Pacote C (frio e polar): bloquinhos ----
  function moose(c, e, sx, sy) {
    shadow(c, sx, sy, 34, 8);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.8, graze = e.state === 'grazing' || e.act === 'graze' ? 14 : 0;
    leg(c, 17, -30, 30, 4.6, '#3a2a20', s); leg(c, -16, -30, 30, 4.6, '#3a2a20', -s);
    blob(c, 3, -46, 28, 15, '#4a3326');                        // corpo escuro
    blob(c, -14, -56, 14, 9, '#3d2a1f');                       // corcova dos ombros
    blob(c, 3, -52, 20, 4.4, 'rgba(255,230,200,0.14)');
    leg(c, 10, -30, 30, 4.6, '#2a1c14', -s); leg(c, -23, -30, 30, 4.6, '#2a1c14', s);
    c.fillStyle = '#4a3326'; c.beginPath(); c.moveTo(-20, -56); c.lineTo(-30, -68 + graze); c.lineTo(-38, -60 + graze); c.lineTo(-22, -42); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // pescoco
    blob(c, -40, -60 + graze, 9, 7, '#55392b', -0.35);         // cabeca comprida
    blob(c, -48, -55 + graze, 6, 5, '#6a4a38');                // focinho caido
    c.strokeStyle = '#8a6a48'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-34, -66 + graze); c.lineTo(-30, -78 + graze); c.lineTo(-20, -82 + graze); c.moveTo(-30, -78 + graze); c.lineTo(-30, -88 + graze); c.moveTo(-24, -80 + graze); c.lineTo(-22, -90 + graze); c.stroke();   // galhada larga
    c.fillStyle = OUT; c.fillRect(-42, -62 + graze, 1.6, 1.6);
    c.restore();
  }
  function reindeer(c, e, sx, sy) {
    shadow(c, sx, sy, 28, 6.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m), graze = e.state === 'grazing' || e.act === 'graze' ? 14 : 0;
    leg(c, 14, -26, 26, 3.6, '#6a5a4a', s); leg(c, -13, -26, 26, 3.6, '#6a5a4a', -s);
    blob(c, 2, -38, 21, 11, '#8a7a68');                        // corpo cinza-marrom
    blob(c, -14, -37, 9, 7, '#f0ece4');                        // pescoco branco
    blob(c, 2, -43, 14, 4, 'rgba(255,255,255,0.2)');
    leg(c, 8, -26, 26, 3.6, '#5a4a3c', -s); leg(c, -19, -26, 26, 3.6, '#5a4a3c', s);
    c.fillStyle = '#9a8a76'; c.beginPath(); c.moveTo(-14, -44); c.lineTo(-22, -62 + graze); c.lineTo(-29, -57 + graze); c.lineTo(-18, -34); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();
    blob(c, -28, -58 + graze, 7, 5.2, '#a39482', -0.4);
    blob(c, -34, -56 + graze, 3.4, 2.8, '#2a2420');
    c.strokeStyle = '#c8b48a'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(-24, -63 + graze); c.lineTo(-20, -76 + graze); c.lineTo(-12, -80 + graze); c.moveTo(-20, -76 + graze); c.lineTo(-24, -84 + graze); c.moveTo(-17, -78 + graze); c.lineTo(-15, -86 + graze); c.stroke();   // galhada
    c.fillStyle = OUT; c.fillRect(-30, -60 + graze, 1.4, 1.4);
    c.restore();
  }
  function snow_hare(c, e, sx, sy) {
    shadow(c, sx, sy, 14, 4.5);
    begin(c, e, sx, sy);
    const moving = e.act === 'flee' || e.act === 'roam' || e.act === 'forage', hop = moving ? [0, -6, -9, -4][e.frameIndex % 4] : 0;
    const head = e.state === 'grazing' ? 4 : 0;
    c.translate(0, hop);
    leg(c, 7, -7, 7, 3.4, '#cfc9c0', swing(e.frameIndex, moving));
    blob(c, 3, -12, 12, 7.5, '#f1efe9');                       // corpo branco
    blob(c, 3, -8.5, 8, 3, '#e4e0d6');
    blob(c, 14, -12, 3.2, 3.2, '#ffffff');
    leg(c, -6, -7, 7, 3.4, '#e2ded4', -swing(e.frameIndex, moving));
    blob(c, -9, -17 + head, 5.4, 4.6, '#f4f2ec');
    blob(c, -8, -29 + head, 2.2, 8.5, '#e6e2d8', -0.12); blob(c, -4.5, -29 + head, 2.2, 8.5, '#f1efe9', 0.2);
    c.fillStyle = '#2a2420'; c.fillRect(-9.2, -37.5 + head, 2.6, 2.4); c.fillRect(-5.7, -37.5 + head, 2.6, 2.4);
    c.fillStyle = OUT; c.fillRect(-12.5, -18.5 + head, 1.8, 1.8);
    c.restore();
  }
  function musk_ox(c, e, sx, sy) {
    shadow(c, sx, sy, 30, 7);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.6, graze = e.state === 'grazing' || e.act === 'graze' ? 6 : 0;
    leg(c, 14, -14, 14, 5, '#efe6d0', s); leg(c, -13, -14, 14, 5, '#efe6d0', -s);
    blob(c, 3, -30, 28, 16, '#2f241c');                        // corpo peludo escuro
    c.fillStyle = '#2f241c'; c.beginPath(); c.moveTo(-26, -34); c.quadraticCurveTo(-22, -10, -18, -8); c.lineTo(28, -8); c.quadraticCurveTo(34, -20, 30, -34); c.closePath(); c.fill();   // saia de pelo
    c.strokeStyle = '#4a3a2c'; c.lineWidth = 1; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-18 + i * 5, -22); c.lineTo(-19 + i * 5, -10); c.stroke(); }
    blob(c, -4, -40, 14, 6, '#3d2f24');                        // cupula dos ombros
    leg(c, 8, -14, 14, 5, '#e2d8c0', -s); leg(c, -19, -14, 14, 5, '#e2d8c0', s);
    blob(c, -30, -26 + graze, 9.4, 8.4, '#3a2c22');            // cabeca
    c.fillStyle = '#efe6cc'; c.beginPath(); c.moveTo(-34, -34 + graze); c.quadraticCurveTo(-42, -36 + graze, -41, -22 + graze); c.lineTo(-37, -26 + graze); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // chifre curvo
    c.beginPath(); c.moveTo(-27, -33 + graze); c.quadraticCurveTo(-22, -36 + graze, -22, -26 + graze); c.lineTo(-26, -28 + graze); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = OUT; c.fillRect(-33, -28 + graze, 1.6, 1.6);
    c.restore();
  }
  function polar_bear(c, e, sx, sy) {
    shadow(c, sx, sy, 38, 9);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.7;
    leg(c, 17, -18, 18, 7, '#ddd6c6', s); leg(c, -16, -18, 18, 7, '#ddd6c6', -s);
    blob(c, 3, -34, 32, 17, '#f4efe4');                        // corpo
    blob(c, 3, -42, 22, 6, 'rgba(255,255,255,0.4)');
    blob(c, 3, -22, 24, 5, '#e2dccd');
    leg(c, 9, -18, 18, 7, '#cfc8b6', -s); leg(c, -23, -18, 18, 7, '#cfc8b6', s);
    blob(c, -34, -34, 11, 9.4, '#f6f1e6');                     // cabeca
    blob(c, -43, -30, 7, 5, '#efe8da');                        // focinho comprido
    blob(c, -49, -30.4, 2, 1.8, '#17120e');                    // nariz preto
    c.fillStyle = '#f1ece0'; c.beginPath(); c.arc(-30, -43, 3.2, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();   // orelha
    c.fillStyle = OUT; c.fillRect(-38, -36, 1.8, 1.8);
    c.restore();
  }
  function arctic_fox(c, e, sx, sy) {
    shadow(c, sx, sy, 17, 5);
    begin(c, e, sx, sy);
    const moving = e.act !== 'rest' && e.state !== 'satiated' && e.act !== 'idle', s = swing(e.frameIndex, moving), low = e.act === 'stalk' ? 3 : 0;
    c.translate(0, low);
    leg(c, 8, -10, 10, 3, '#cfc9be', s); leg(c, -7, -10, 10, 3, '#cfc9be', -s);
    c.fillStyle = '#f4f1ea'; c.beginPath(); c.moveTo(13, -14); c.quadraticCurveTo(28, -18, 30, -8); c.quadraticCurveTo(24, -6, 13, -10); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();
    blob(c, 3, -15, 13, 6.4, '#f6f3ec');                       // corpo branco
    blob(c, 3, -18, 9, 3, 'rgba(255,255,255,0.5)');
    leg(c, 4, -10, 10, 3, '#e4dfd4', -s); leg(c, -11, -10, 10, 3, '#e4dfd4', s);
    blob(c, -15, -19, 6, 5.2, '#f6f3ec');
    blob(c, -21, -17, 3.6, 2.4, '#eeeae0');
    c.fillStyle = '#f1eee6'; c.beginPath(); c.moveTo(-17, -23); c.lineTo(-15, -29); c.lineTo(-12, -23); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();
    c.fillStyle = '#17120e'; c.fillRect(-23.6, -17.4, 1.8, 1.6); c.fillRect(-17, -20, 1.4, 1.4);
    c.restore();
  }
  function wolverine(c, e, sx, sy) {
    shadow(c, sx, sy, 20, 5.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.8;
    leg(c, 9, -7, 7, 4, '#2a2018', s); leg(c, -9, -7, 7, 4, '#2a2018', -s);
    c.fillStyle = '#2a2018'; c.beginPath(); c.moveTo(14, -14); c.quadraticCurveTo(24, -16, 25, -8); c.lineTo(14, -9); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.1; c.stroke();   // rabo felpudo
    blob(c, 2, -12, 16, 8, '#4a3626');                         // corpo marrom escuro
    c.fillStyle = '#c9a463'; c.beginPath(); c.moveTo(-10, -17); c.quadraticCurveTo(4, -22, 16, -14); c.lineTo(14, -12); c.quadraticCurveTo(2, -17, -9, -14); c.closePath(); c.fill();   // faixa clara do dorso
    leg(c, 5, -7, 7, 4, '#3a2a1e', -s); leg(c, -13, -7, 7, 4, '#3a2a1e', s);
    blob(c, -17, -14, 7, 6, '#3a2c20');                        // cabeca
    blob(c, -23, -12, 4, 3, '#4a3828');
    c.fillStyle = '#6a5a48'; c.beginPath(); c.arc(-15, -20, 2.2, 0, 6.3); c.fill();
    c.fillStyle = '#e6dcc4'; c.fillRect(-26, -10, 1.4, 1.8);   // dente
    c.fillStyle = OUT; c.fillRect(-19.4, -15.4, 1.4, 1.4);
    c.restore();
  }
  function snowy_owl(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 8 * Math.max(0.4, 1 - z / 160), 3, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-1.0, -0.2, 0.7, -0.2][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 0, -5, 5, 2.4, '#efe8dc', 0); leg(c, 4, -5, 5, 2.4, '#efe8dc', 0); }
    blob(c, 1, -14, 9, 10.4, '#f6f3ec');                       // corpo branco
    c.fillStyle = '#3a342e'; for (let i = 0; i < 6; i++) c.fillRect(-4 + (i % 3) * 4, -18 + Math.floor(i / 3) * 5, 1.8, 1.2);   // pintas
    c.save(); c.translate(5, -17); c.rotate(flap); c.fillStyle = '#ebe6da'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -16 : -3, 11, fly ? -11 : 6); c.lineTo(4, 5); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    blob(c, -2, -25, 7.6, 7, '#fbf9f4');                       // cabeca redonda
    c.fillStyle = '#e8b72a'; c.beginPath(); c.arc(-5, -25, 2.2, 0, 6.3); c.arc(1, -25, 2.2, 0, 6.3); c.fill();   // olhos amarelos
    c.fillStyle = '#1c140d'; c.beginPath(); c.arc(-5, -25, 1.1, 0, 6.3); c.arc(1, -25, 1.1, 0, 6.3); c.fill();
    c.fillStyle = '#2a2a2e'; c.beginPath(); c.moveTo(-3, -23); c.lineTo(-2, -20.5); c.lineTo(-1, -23); c.closePath(); c.fill();
    c.restore();
  }
  function penguin(c, e, sx, sy) {
    shadow(c, sx, sy, 10, 3, 0.2);
    begin(c, e, sx, sy);
    const m = e.act === 'walk' || e.act === 'flee', sway = m ? [0, 0.12, 0, -0.12][e.frameIndex % 4] : 0;
    c.rotate(sway);
    c.fillStyle = '#e8a02a'; c.fillRect(-4, -3, 3.4, 3); c.fillRect(1, -3, 3.4, 3);   // pes
    blob(c, 0, -14, 8, 12, '#1d1f26');                         // corpo
    blob(c, -1, -12, 5.4, 9, '#f6f4ee');                       // barriga branca
    c.fillStyle = '#1d1f26'; c.beginPath(); c.moveTo(6, -18); c.lineTo(11, -10); c.lineTo(6, -9); c.closePath(); c.fill();   // asa
    blob(c, -3, -25, 5, 4.6, '#1d1f26');                       // cabeca
    c.fillStyle = '#f2c230'; c.fillRect(-6, -23, 8, 1.6);       // faixa amarela do pescoco
    c.fillStyle = '#e8a02a'; c.beginPath(); c.moveTo(-7.4, -25.6); c.lineTo(-12, -24); c.lineTo(-7.4, -23); c.closePath(); c.fill();   // bico
    c.fillStyle = '#f4f2ec'; c.fillRect(-5.4, -26.6, 1.3, 1.3);
    c.restore();
  }

  // ---- Pacote D: Africa e deserto ----
  function glow(c, x, y, rx, ry) { c.fillStyle = 'rgba(255,255,255,0.15)'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 6.3); c.fill(); }
  function inBody(c, by, rx, ry, fn) { c.save(); c.beginPath(); c.ellipse(2, by, rx, ry, 0, 0, 6.3); c.clip(); fn(); c.restore(); }
  // desenhador generico de bicho de casco (olhando para a esquerda): o = medidas e cores; pat/neckPat/top = detalhes de cada especie
  function hoof(c, e, sx, sy, o) {
    shadow(c, sx, sy, o.sh, o.sh / 4.2);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * (o.sw || 1), gz = (e.state === 'grazing' || e.act === 'graze') ? (o.gz === undefined ? 10 : o.gz) : 0;
    const L = o.leg, lw = o.lw || 3.6, rx = o.rx, ry = o.ry, by = -(L + ry * 0.7), k = rx / 22, lc = o.lc || o.dark;
    leg(c, 14 * k, -L, L, lw, lc, s); leg(c, -13 * k, -L, L, lw, lc, -s);
    blob(c, rx + 1, by - ry * 0.3, 2.6, 3.2, o.dark);                               // rabo
    blob(c, 2, by, rx, ry, o.col);                                                  // corpo
    glow(c, 2, by - ry * 0.5, rx * 0.7, ry * 0.28);
    if (o.pat) o.pat(c, by, rx, ry);
    leg(c, 8 * k, -L, L, lw, o.dark, -s); leg(c, -19 * k, -L, L, lw, o.dark, s);
    const bx = -rx * 0.62, nx = bx - o.nd, ny = by - ry * 0.3 - o.nh + gz;
    c.fillStyle = o.neck || o.col; c.beginPath(); c.moveTo(bx + 5, by - ry * 0.9); c.lineTo(nx + 2, ny - 2); c.lineTo(nx - 3, ny + 5); c.lineTo(bx - 3, by + ry * 0.4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();   // pescoco
    if (o.neckPat) o.neckPat(c, bx, by, nx, ny);
    const hx = nx - o.hd, hy = ny + 1;
    blob(c, hx, hy, o.hr, o.hr * 0.75, o.head || o.col, -0.3);                      // cabeca
    blob(c, hx - o.hr * 0.9, hy + o.hr * 0.25, o.hr * 0.65, o.hr * 0.5, o.snout || o.head || o.col, -0.2);
    c.fillStyle = OUT; c.fillRect(hx - o.hr * 0.3, hy - o.hr * 0.4, 1.5, 1.5);
    if (o.top) o.top(c, hx, hy, o.hr);
    c.restore();
  }
  const ear = (c, x, y, col, h = 6) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - 2.4, y); c.lineTo(x, y - h); c.lineTo(x + 2.4, y); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); };
  function zebra(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 26, leg: 22, lw: 3.4, rx: 20, ry: 10, col: '#f3f0ea', dark: '#cfcac0', lc: '#e6e2d8', nd: 6, nh: 15, hd: 6, hr: 6.2, head: '#f0ede6', snout: '#3a3430',
      pat(c, by, rx, ry) { inBody(c, by, rx, ry, () => { c.strokeStyle = '#1e1a18'; c.lineWidth = 2.2; for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(1 + i * 4.2, by - ry); c.quadraticCurveTo(4 + i * 4.2, by, 1 + i * 4.2, by + ry); c.stroke(); } }); },
      neckPat(c, bx, by, nx, ny) { c.strokeStyle = '#1e1a18'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(bx + 2, by - 9); c.lineTo(nx + 1, ny - 3); c.stroke(); for (let i = 1; i < 4; i++) { const t = i / 4; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - (bx - nx) * t - 3, by - 5 + (ny - by + 5) * t); c.lineTo(bx - (bx - nx) * t + 3, by - 8 + (ny - by + 5) * t); c.stroke(); } },
      top(c, hx, hy, r) { ear(c, hx + 2, hy - r * 0.6, '#2a2420', 6); ear(c, hx + 5, hy - r * 0.5, '#e8e4da', 5); } });
  }
  function wildebeest(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 28, leg: 22, lw: 3.6, rx: 20, ry: 11, col: '#6e6c74', dark: '#3c3a40', nd: 9, nh: 6, hd: 6, hr: 7.4, head: '#3e3c42', snout: '#2a282c',
      pat(c, by, rx, ry) { inBody(c, by, rx, ry, () => { c.strokeStyle = '#4a484e'; c.lineWidth = 1.2; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(-10 + i * 4, by - ry * 0.5); c.lineTo(-11 + i * 4, by + ry * 0.2); c.stroke(); } }); blob(c, -12, by - ry * 0.7, 9, 5, '#58565c'); },
      top(c, hx, hy, r) { c.strokeStyle = '#d8d0b8'; c.lineWidth = 2; c.beginPath(); c.moveTo(hx + 2, hy - r * 0.6); c.quadraticCurveTo(hx - 4, hy - r - 5, hx - 8, hy - r + 1); c.moveTo(hx + 5, hy - r * 0.5); c.quadraticCurveTo(hx + 8, hy - r - 5, hx + 12, hy - r + 1); c.stroke(); blob(c, hx - r * 0.5, hy + r * 0.9, 2.4, 4, '#2a282c'); } });
  }
  function gazelle(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 18, leg: 18, lw: 2.6, rx: 13, ry: 6.5, col: '#c8985c', dark: '#8a5a30', lc: '#d8b888', nd: 4, nh: 11, hd: 4, hr: 4.2, head: '#d2a468', snout: '#f0e6d0', gz: 8,
      pat(c, by, rx, ry) { inBody(c, by, rx, ry, () => { c.fillStyle = '#f4ecdc'; c.fillRect(-rx, by + ry * 0.35, rx * 2 + 4, ry); c.fillStyle = '#4a2e18'; c.fillRect(-rx, by + ry * 0.05, rx * 2 + 4, 1.8); }); },
      top(c, hx, hy, r) { ear(c, hx + 3, hy - r * 0.4, '#b08450', 4); c.strokeStyle = '#2a2018'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(hx + 1, hy - r * 0.7); c.quadraticCurveTo(hx + 4, hy - r - 6, hx + 9, hy - r - 7); c.stroke(); } });
  }
  function giraffe(c, e, sx, sy) {
    const spots = (c, pts) => { c.fillStyle = '#9a6a24'; for (const [x, y, r] of pts) { c.beginPath(); c.ellipse(x, y, r, r * 0.8, 0.3, 0, 6.3); c.fill(); } };
    hoof(c, e, sx, sy, { sh: 30, leg: 36, lw: 3.4, rx: 19, ry: 9.5, col: '#dcae4e', dark: '#b88a34', lc: '#e4bc64', nd: 5, nh: 48, hd: 5, hr: 5.4, head: '#e0b458', snout: '#cfa04a', gz: 30, sw: 0.8,
      pat(c, by, rx, ry) { inBody(c, by, rx, ry, () => spots(c, [[-8, by - 3, 3.4], [0, by + 2, 3.2], [8, by - 4, 3.6], [14, by + 3, 2.8], [-14, by + 3, 2.6], [4, by - 7, 2.4]])); },
      neckPat(c, bx, by, nx, ny) { for (let i = 1; i < 5; i++) { const t = i / 5; spots(c, [[bx + (nx - bx) * t - 1 + (i % 2) * 2, by - 6 + (ny - by + 6) * t, 2.4]]); } },
      top(c, hx, hy, r) { c.strokeStyle = OUT; c.lineWidth = 1; c.fillStyle = '#5a3a1a'; for (const dx of [1, 5]) { c.beginPath(); c.moveTo(hx + dx, hy - r * 0.5); c.lineTo(hx + dx, hy - r - 5); c.stroke(); blob(c, hx + dx, hy - r - 6, 1.8, 1.8, '#5a3a1a'); } ear(c, hx + 7, hy - 1, '#c89a44', 4); } });
  }
  function camel(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 30, leg: 28, lw: 3.6, rx: 20, ry: 10, col: '#c9a468', dark: '#a8864e', lc: '#b8945a', nd: 9, nh: 22, hd: 6, hr: 5.4, head: '#cfaa70', snout: '#d8b87e', gz: 12, sw: 0.8,
      pat(c, by, rx, ry) { blob(c, -6, by - ry - 5, 6, 7, '#c29c62'); blob(c, 8, by - ry - 5, 6, 7, '#b8935a'); },
      top(c, hx, hy, r) { ear(c, hx + 3, hy - r * 0.5, '#a8864e', 4); } });
  }
  function oryx(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 24, leg: 26, lw: 3.2, rx: 18, ry: 9, col: '#e8e0d0', dark: '#7a6a58', lc: '#d8cfbd', nd: 6, nh: 14, hd: 6, hr: 5.6, head: '#f0e8da', snout: '#4a3c30', gz: 9,
      pat(c, by, rx, ry) { inBody(c, by, rx, ry, () => { c.fillStyle = '#4a3c30'; c.fillRect(-rx, by + ry * 0.45, rx * 2 + 4, ry); c.fillRect(-rx, by - 0.5, rx * 2 + 4, 1.6); }); },
      top(c, hx, hy, r) { ear(c, hx + 4, hy - r * 0.4, '#bdb29a', 5); c.strokeStyle = '#2a2018'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(hx + 1, hy - r * 0.6); c.lineTo(hx - 9, hy - r - 14); c.moveTo(hx + 3, hy - r * 0.6); c.lineTo(hx - 6, hy - r - 14); c.stroke(); } });
  }
  function rhino(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 36, leg: 13, lw: 7, rx: 28, ry: 14, col: '#8d8a82', dark: '#6a6860', nd: 10, nh: 0, hd: 7, hr: 8.6, head: '#96938a', snout: '#8d8a82', gz: 6, sw: 0.7,
      pat(c, by, rx, ry) { c.strokeStyle = '#6a6860'; c.lineWidth = 1.2; c.beginPath(); c.arc(-14, by, ry * 0.9, -1.2, 1.2); c.stroke(); c.beginPath(); c.arc(14, by, ry * 0.9, 1.9, 4.3); c.stroke(); },
      top(c, hx, hy, r) { c.fillStyle = '#d8d2c0'; c.beginPath(); c.moveTo(hx - r * 1.2, hy + 1); c.lineTo(hx - r * 1.55, hy - 13); c.lineTo(hx - r * 0.7, hy - 2); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); ear(c, hx + 4, hy - r * 0.5, '#7a776e', 5); } });
  }
  function elephant(c, e, sx, sy, asia) {
    shadow(c, sx, sy, 46, 10);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.6;
    leg(c, 16, -20, 20, 9.5, '#7a7874', s); leg(c, -15, -20, 20, 9.5, '#7a7874', -s);
    blob(c, 4, -40, 32, 21, '#8d8b87');
    glow(c, 4, -52, 22, 6);
    leg(c, 9, -20, 20, 9.5, '#6e6c68', -s); leg(c, -22, -20, 20, 9.5, '#6e6c68', s);
    blob(c, 36, -38, 2.4, 6, '#6e6c68');                                           // rabo
    blob(c, -28, -44, asia ? 6.5 : 10, asia ? 8.5 : 13, '#7f7c78', 0.1);                                      // orelha
    blob(c, -40, -42, 13, 12, '#938f8b');                                           // cabeca
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 8.4; c.beginPath(); c.moveTo(-48, -38); c.quadraticCurveTo(-57, -26, -53, -10); c.stroke();
    c.strokeStyle = '#8d8b87'; c.lineWidth = 6.2; c.beginPath(); c.moveTo(-48, -38); c.quadraticCurveTo(-57, -26, -53, -10); c.stroke();     // tromba
    c.strokeStyle = OUT; c.lineWidth = 4; c.beginPath(); c.moveTo(-47, -33); c.quadraticCurveTo(-60, -29, -61, -21); c.stroke();
    c.strokeStyle = '#f2ecd8'; c.lineWidth = asia ? 1.6 : 2.4; c.beginPath(); c.moveTo(-47, -33); c.quadraticCurveTo(-60, -29, -61, -21); c.stroke();     // presa
    c.fillStyle = OUT; c.fillRect(-44, -46, 1.8, 1.8);
    c.restore();
  }
  function ostrich(c, e, sx, sy) {
    shadow(c, sx, sy, 14, 4);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 1.2, gz = (e.state === 'grazing' || e.act === 'graze') ? 36 : 0;
    leg(c, 3, -28, 28, 3.2, '#d4a99a', s); leg(c, -3, -28, 28, 3.2, '#c89a8a', -s);
    blob(c, 20, -40, 7, 9, '#f2efe6', 0.4);                                         // penas da cauda
    blob(c, 5, -38, 17, 12, '#2a2624');                                             // corpo preto
    blob(c, 8, -38, 9, 6.5, '#f2efe6', 0.2);                                        // asa branca
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 5.4; c.beginPath(); c.moveTo(-8, -44); c.quadraticCurveTo(-14, -58 + gz * 0.5, -15, -72 + gz); c.stroke();
    c.strokeStyle = '#dcb0a0'; c.lineWidth = 3.4; c.beginPath(); c.moveTo(-8, -44); c.quadraticCurveTo(-14, -58 + gz * 0.5, -15, -72 + gz); c.stroke();   // pescoco
    blob(c, -16, -74 + gz, 4.6, 3.6, '#e4b8a8');
    c.fillStyle = '#d8a850'; c.beginPath(); c.moveTo(-20, -75 + gz); c.lineTo(-26, -73 + gz); c.lineTo(-20, -72 + gz); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-17.6, -75.6 + gz, 1.6, 1.6);
    c.restore();
  }
  // felinos grandes (leao, leopardo)
  function cat(c, e, sx, sy, o) {
    shadow(c, sx, sy, o.sh, o.sh / 4.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.8, low = e.act === 'stalk' ? 4 : 0, L = o.leg, rx = o.rx, ry = o.ry, by = -(L + ry * 0.75), hr = o.hr;
    c.translate(0, low);
    leg(c, rx * 0.6, -L, L, o.lw, o.dark, s); leg(c, -rx * 0.6, -L, L, o.lw, o.dark, -s);
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 4.4; c.beginPath(); c.moveTo(rx - 2, by - 2); c.quadraticCurveTo(rx + 14, by - 8, rx + 17, by + 5); c.stroke();
    c.strokeStyle = o.col; c.lineWidth = 2.8; c.beginPath(); c.moveTo(rx - 2, by - 2); c.quadraticCurveTo(rx + 14, by - 8, rx + 17, by + 5); c.stroke();
    if (o.tuft) blob(c, rx + 17, by + 6, 3, 4, o.tuft);
    blob(c, 2, by, rx, ry, o.col);
    blob(c, 2, by + ry * 0.5, rx * 0.8, ry * 0.4, o.belly || o.dark);
    if (o.stripes) inBody(c, by, rx, ry, () => { c.strokeStyle = o.stripes; c.lineWidth = 1.8; for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(2 + i * 4.6, by - ry); c.quadraticCurveTo(5 + i * 4.6, by, 1 + i * 4.6, by + ry * 0.7); c.stroke(); } });
    if (o.spots) inBody(c, by, rx, ry, () => { c.fillStyle = o.spots; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(-rx * 0.8 + (i % 5) * rx * 0.4, by - ry * 0.5 + Math.floor(i / 5) * ry * 0.8, 2, 1.6, 0.4, 0, 6.3); c.fill(); } });
    leg(c, rx * 0.25, -L, L, o.lw, o.col, -s); leg(c, -rx * 0.95, -L, L, o.lw, o.col, s);
    if (o.mane) blob(c, -rx * 0.8, by - ry * 0.1, hr + 4.5, hr + 5.5, o.mane);
    blob(c, -rx * 0.85, by - ry * 0.4, hr, hr * 0.85, o.head || o.col);
    blob(c, -rx * 0.85 - hr * 0.85, by - ry * 0.4 + hr * 0.3, hr * 0.5, hr * 0.4, '#ecd6a8');
    c.fillStyle = '#2a1a14'; c.fillRect(-rx * 0.85 - hr * 1.3, by - ry * 0.4 + hr * 0.1, 2, 1.6);
    for (const dx of [-0.2, 0.5]) { c.fillStyle = o.head || o.col; c.beginPath(); c.arc(-rx * 0.85 + hr * dx, by - ry * 0.4 - hr * 0.8, 2.4, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); }
    c.fillStyle = OUT; c.fillRect(-rx * 0.85 - hr * 0.5, by - ry * 0.4 - hr * 0.25, 1.5, 1.5);
    c.restore();
  }
  function lion(c, e, sx, sy) { cat(c, e, sx, sy, { sh: 32, rx: 23, ry: 10, leg: 14, lw: 5.4, col: '#c9964a', dark: '#a87630', belly: '#d8b070', mane: '#6a4420', head: '#d2a052', tuft: '#3a2814', hr: 7.6 }); }
  function leopard(c, e, sx, sy) { cat(c, e, sx, sy, { sh: 25, rx: 20, ry: 8, leg: 12, lw: 4, col: '#d8a850', dark: '#8a6224', belly: '#efe2bc', spots: '#3a2814', head: '#dcb05a', hr: 6.4 }); }
  function hyena(c, e, sx, sy) {
    shadow(c, sx, sy, 24, 6);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m);
    leg(c, 14, -14, 14, 4, '#6a5a44', s); leg(c, -12, -17, 17, 4.4, '#6a5a44', -s);
    blob(c, 11, -24, 12, 8.5, '#a8946a');                                           // garupa baixa
    blob(c, -6, -29, 14, 10.5, '#b8a47a');                                          // ombros altos
    inBody(c, -26, 24, 12, () => { c.fillStyle = '#4a3c2a'; for (let i = 0; i < 6; i++) c.fillRect(-12 + i * 5, -30 + (i % 2) * 6, 2.4, 2.4); });
    c.strokeStyle = '#3a2e20'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-14, -37); c.lineTo(4, -33); c.stroke();   // crina
    leg(c, 8, -14, 14, 4, '#8a7650', -s); leg(c, -17, -17, 17, 4.4, '#8a7650', s);
    c.strokeStyle = OUT; c.lineWidth = 3.6; c.beginPath(); c.moveTo(21, -24); c.lineTo(25, -14); c.stroke(); c.strokeStyle = '#4a3c2a'; c.lineWidth = 2.2; c.stroke();
    blob(c, -22, -29, 7.6, 6.6, '#b8a47a');                                         // cabeca
    blob(c, -29, -26, 5.6, 4, '#3a3026');                                           // focinho escuro
    c.fillStyle = '#7a6a48'; c.beginPath(); c.arc(-19, -35, 3.2, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();
    c.fillStyle = OUT; c.fillRect(-25, -31, 1.5, 1.5);
    c.restore();
  }
  // aves/bichos de ambiente do pacote D
  function vulture(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 12 * Math.max(0.4, 1 - z / 200), 4, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-0.9, -0.1, 0.6, -0.1][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, -1, -7, 7, 2.6, '#6a5a4a', 0); leg(c, 4, -7, 7, 2.6, '#6a5a4a', 0); }
    blob(c, 2, -17, 10, 11, '#3a2e26');                                             // corpo escuro
    c.save(); c.translate(5, -19); c.rotate(flap); c.fillStyle = '#2c231d'; c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(6, fly ? -22 : -4, 20, fly ? -14 : 8); c.lineTo(8, 7); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    blob(c, -6, -26, 7, 3.4, '#e8e2d2');                                            // gola de penas claras
    c.strokeStyle = '#c89a8a'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); c.moveTo(-6, -27); c.lineTo(-10, -32); c.stroke();
    blob(c, -11, -34, 4.2, 3.8, '#d8a090');                                         // cabeca calva
    c.fillStyle = '#3a342c'; c.beginPath(); c.moveTo(-14, -34); c.lineTo(-19, -32); c.lineTo(-15, -31); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-12.6, -35.4, 1.4, 1.4);
    c.restore();
  }
  function nile_croc(c, e, sx, sy) {
    shadow(c, sx, sy, 44, 6, 0.22);
    begin(c, e, sx, sy);
    const m = e.act === 'walk' || e.act === 'flee', s = swing(e.frameIndex, m) * 0.5;
    leg(c, 20, -4, 5, 4, '#4a4a30', s); leg(c, -16, -4, 5, 4, '#4a4a30', -s);
    c.fillStyle = '#6a6a44'; c.beginPath(); c.moveTo(24, -11); c.quadraticCurveTo(48, -10, 62, -3); c.quadraticCurveTo(40, -5, 24, -4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.2; c.stroke();
    blob(c, 4, -9, 27, 7, '#7a7a52');
    c.fillStyle = '#4a4a30'; for (let i = 0; i < 9; i++) c.fillRect(-20 + i * 5, -15.4, 2.6, 2.6);
    leg(c, 10, -4, 5, 4, '#56563a', -s); leg(c, -23, -4, 5, 4, '#56563a', s);
    c.fillStyle = '#82825a'; c.beginPath(); c.moveTo(-24, -14); c.lineTo(-50, -9); c.lineTo(-51, -5); c.lineTo(-24, -4); c.closePath(); c.fill(); c.strokeStyle = OUT; c.stroke();
    c.fillStyle = '#efe9d4'; for (let i = 0; i < 6; i++) c.fillRect(-49 + i * 4.4, -5.4, 1.2, 1.8);
    c.fillStyle = '#d9c24a'; c.fillRect(-28, -14.6, 2.4, 1.8); c.fillStyle = OUT; c.fillRect(-27.4, -14.4, 1.2, 1.2);
    c.restore();
  }
  function hippo(c, e, sx, sy) {
    shadow(c, sx, sy, 40, 8);
    begin(c, e, sx, sy);
    const m = e.act === 'walk' || e.act === 'flee', s = swing(e.frameIndex, m) * 0.6;
    leg(c, 16, -13, 13, 8.5, '#6e5e66', s); leg(c, -15, -13, 13, 8.5, '#6e5e66', -s);
    blob(c, 3, -28, 31, 17, '#8a7a82');
    blob(c, 3, -20, 24, 6, '#b08a90');
    glow(c, 3, -38, 20, 5);
    leg(c, 9, -13, 13, 8.5, '#5e4e56', -s); leg(c, -22, -13, 13, 8.5, '#5e4e56', s);
    blob(c, -34, -28, 13, 11.5, '#92828a');                                         // cabecao
    blob(c, -44, -23, 10, 8, '#a08a92');                                            // focinho largo
    c.fillStyle = '#efe6d0'; c.fillRect(-48, -17, 2, 3.4); c.fillRect(-42, -16, 2, 3.4);   // presas
    c.fillStyle = '#3a2a30'; c.fillRect(-50, -27, 2, 1.8);
    c.fillStyle = '#7a6a72'; c.beginPath(); c.arc(-31, -39, 3.2, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke();
    c.fillStyle = OUT; c.fillRect(-37, -35, 1.8, 1.8);
    c.restore();
  }
  function scorpion(c, e, sx, sy) {
    shadow(c, sx, sy, 9, 3, 0.2);
    begin(c, e, sx, sy);
    const t = e.frameIndex % 4, w = [0, 1, 0, -1][t];
    c.strokeStyle = '#3a2a1a'; c.lineWidth = 1; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-4 + i * 3, -4); c.lineTo(-6 + i * 3 + w, 0); c.stroke(); }
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 4; c.beginPath(); c.moveTo(6, -5); c.quadraticCurveTo(15, -8, 12, -18); c.quadraticCurveTo(8, -22, 3, -17); c.stroke();
    c.strokeStyle = '#b8863a'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(6, -5); c.quadraticCurveTo(15, -8, 12, -18); c.quadraticCurveTo(8, -22, 3, -17); c.stroke();   // cauda arqueada
    c.fillStyle = '#3a1a10'; c.beginPath(); c.moveTo(3, -17); c.lineTo(0, -15); c.lineTo(4, -14); c.closePath(); c.fill();
    blob(c, 0, -5, 7, 3.6, '#c8963e');
    blob(c, -8, -5, 3.4, 3, '#b8863a');
    for (const dy of [-3, -8]) { c.fillStyle = '#c8963e'; c.beginPath(); c.ellipse(-13, dy, 3.4, 2, 0, 0, 6.3); c.fill(); c.strokeStyle = OUT; c.lineWidth = 0.9; c.stroke(); }
    c.fillStyle = OUT; c.fillRect(-9.4, -6.4, 1.2, 1.2);
    c.restore();
  }
  function cobra(c, e, sx, sy) {
    shadow(c, sx, sy, 13, 3.4, 0.22);
    begin(c, e, sx, sy);
    const sway = Math.sin((e.frameIndex % 4) * 1.6) * 1.4;
    blob(c, 2, -3, 12, 3.4, '#7a6a3c'); blob(c, 5, -6.6, 9, 3, '#6a5a32'); blob(c, 2, -9.6, 6, 2.6, '#7a6a3c');   // espiras
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(-5 + sway, -17, -3 + sway, -25); c.stroke();
    c.strokeStyle = '#7a6a3c'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(-5 + sway, -17, -3 + sway, -25); c.stroke();
    blob(c, -3 + sway, -26, 6, 4.8, '#6a5a32');                                     // capuz aberto
    blob(c, -3 + sway, -26, 2.4, 3.4, '#d8c890');
    blob(c, -5 + sway, -31, 3.8, 3, '#7a6a3c');                                     // cabeca
    c.strokeStyle = '#b03030'; c.lineWidth = 1; c.beginPath(); c.moveTo(-8 + sway, -30.6); c.lineTo(-12 + sway, -30.6 + ((e.frameIndex % 2) ? 1.2 : -1.2)); c.stroke();
    c.fillStyle = '#e8c840'; c.fillRect(-6.4 + sway, -32.2, 1.4, 1.4);
    c.restore();
  }

  // ---- Pacote E: Asia ----
  function tiger(c, e, sx, sy) { cat(c, e, sx, sy, { sh: 34, rx: 24, ry: 10.5, leg: 14, lw: 5.6, col: '#d9822b', dark: '#a85a18', belly: '#f2e6cc', stripes: '#2a1a10', head: '#dc8a34', hr: 7.8 }); }
  function snow_leopard(c, e, sx, sy) { cat(c, e, sx, sy, { sh: 27, rx: 21, ry: 8.6, leg: 12, lw: 4.8, col: '#c9c8c2', dark: '#8a8a86', belly: '#eceae4', spots: '#3a3a3a', head: '#d2d1cb', hr: 6.8 }); }
  function asian_elephant(c, e, sx, sy) { elephant(c, e, sx, sy, true); }
  function yak(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 30, leg: 16, lw: 4.6, rx: 22, ry: 12, col: '#2e2822', dark: '#1e1a16', lc: '#3a322a', nd: 9, nh: 4, hd: 6, hr: 6.8, head: '#2e2822', snout: '#4a4038', gz: 6, sw: 0.7,
      pat(c, by, rx, ry) { blob(c, 2, by + ry * 0.75, rx * 1.05, ry * 0.5, '#241f1a'); c.strokeStyle = '#3e362c'; c.lineWidth = 1; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-18 + i * 5, by + ry * 0.4); c.lineTo(-19 + i * 5, by + ry * 1.2); c.stroke(); } },
      top(c, hx, hy, r) { c.strokeStyle = '#e6dcc0'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(hx + 2, hy - r * 0.6); c.quadraticCurveTo(hx - 3, hy - r - 2, hx - 6, hy - r - 9); c.moveTo(hx + 5, hy - r * 0.5); c.quadraticCurveTo(hx + 9, hy - r - 2, hx + 11, hy - r - 9); c.stroke(); } });
  }
  function tahr(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 20, leg: 18, lw: 3, rx: 14, ry: 7.5, col: '#8a6a44', dark: '#4a3624', lc: '#6a5030', nd: 5, nh: 8, hd: 4.4, hr: 4.6, head: '#7a5c3a', snout: '#5a4228', gz: 7,
      pat(c, by, rx, ry) { blob(c, -8, by - ry * 0.4, 7, 5.4, '#6a4e30'); },
      top(c, hx, hy, r) { c.strokeStyle = '#2a2018'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(hx + 1, hy - r * 0.6); c.quadraticCurveTo(hx + 4, hy - r - 5, hx + 9, hy - r - 3); c.stroke(); ear(c, hx + 4, hy - 1, '#6a4e30', 3); } });
  }
  function water_buffalo(c, e, sx, sy) {
    hoof(c, e, sx, sy, { sh: 34, leg: 17, lw: 5, rx: 25, ry: 12.5, col: '#4a4a4c', dark: '#2e2e30', lc: '#5a5a5c', nd: 10, nh: 3, hd: 7, hr: 7.6, head: '#3e3e40', snout: '#5a5a5c', gz: 6, sw: 0.7,
      pat(c, by, rx, ry) { c.strokeStyle = '#34343a'; c.lineWidth = 1; c.beginPath(); c.arc(-12, by, ry * 0.8, -1.1, 1.1); c.stroke(); },
      top(c, hx, hy, r) { c.strokeStyle = OUT; c.lineWidth = 4.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx + 2, hy - r * 0.5); c.quadraticCurveTo(hx - 7, hy - r - 4, hx - 14, hy - r + 1); c.stroke(); c.strokeStyle = '#cfc8b4'; c.lineWidth = 3; c.beginPath(); c.moveTo(hx + 2, hy - r * 0.5); c.quadraticCurveTo(hx - 7, hy - r - 4, hx - 14, hy - r + 1); c.stroke(); } });
  }
  function giant_panda(c, e, sx, sy) {
    shadow(c, sx, sy, 26, 6.5);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m) * 0.7, gz = (e.state === 'grazing' || e.act === 'graze') ? 3 : 0;
    leg(c, 13, -16, 16, 7, '#1c1a1a', s); leg(c, -13, -16, 16, 7, '#1c1a1a', -s);
    blob(c, 2, -28, 22, 15, '#f4f2ee');                                             // corpo branco
    c.fillStyle = '#1c1a1a'; c.beginPath(); c.ellipse(-8, -32, 7, 13, -0.15, 0, 6.3); c.fill();   // faixa preta dos ombros
    leg(c, 7, -16, 16, 7, '#262424', -s); leg(c, -20, -16, 16, 7, '#262424', s);
    blob(c, -28, -33 + gz, 12, 10.6, '#f6f4f0');                                    // cabecao
    c.fillStyle = '#1c1a1a'; for (const dx of [-8, 4]) { c.beginPath(); c.arc(-28 + dx, -43 + gz, 4, 0, 6.3); c.fill(); }
    for (const dx of [-8, -1]) { c.beginPath(); c.ellipse(-30 + dx, -33.5 + gz, 3.2, 4.2, 0.5, 0, 6.3); c.fill(); }   // manchas dos olhos
    c.fillStyle = '#e8e4de'; c.beginPath(); c.ellipse(-35, -29 + gz, 4.4, 3.2, 0, 0, 6.3); c.fill(); c.fillStyle = '#17120e'; c.fillRect(-38.5, -30.6 + gz, 2.8, 2.2);
    c.fillStyle = '#f4f2ee'; c.fillRect(-32.6, -34.4 + gz, 1.2, 1.2);
    c.restore();
  }
  function macaque(c, e, sx, sy) {
    shadow(c, sx, sy, 11, 3.6);
    begin(c, e, sx, sy);
    const m = mv(e), s = swing(e.frameIndex, m);
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 3.6; c.beginPath(); c.moveTo(9, -14); c.quadraticCurveTo(20, -14, 19, -26); c.stroke(); c.strokeStyle = '#8a6c48'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(9, -14); c.quadraticCurveTo(20, -14, 19, -26); c.stroke();
    leg(c, 5, -10, 10, 3.4, '#7a5e3c', s); leg(c, -5, -10, 10, 3.4, '#8a6c48', -s);
    blob(c, 1, -17, 9, 7.4, '#9a7a54');
    blob(c, 3, -15, 5, 4, '#b8946a');
    leg(c, -9, -17, 9, 3, '#8a6c48', -s * 0.6);
    blob(c, -9, -25, 5.4, 5, '#9a7a54');
    blob(c, -11, -24.4, 3.6, 3.2, '#d8a08a');                                       // cara rosada
    c.fillStyle = '#d8a08a'; c.beginPath(); c.arc(-5, -26, 1.8, 0, 6.3); c.fill();
    c.fillStyle = OUT; c.fillRect(-12.4, -26.2, 1.3, 1.3);
    c.restore();
  }
  function crane(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 10 * Math.max(0.4, 1 - z / 160), 3, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-0.9, -0.1, 0.7, -0.1][e.frameIndex % 4] : 0, st = e.act === 'walk' ? [0.2, 0, -0.2, 0][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 1, -20, 20, 1.8, '#3a3430', st); leg(c, 5, -20, 20, 1.8, '#4a423a', -st); }
    blob(c, 3, -26, 11, 7.6, '#f6f4ee');                                            // corpo branco
    c.fillStyle = '#2a2624'; c.beginPath(); c.moveTo(12, -26); c.quadraticCurveTo(19, -22, 17, -18); c.lineTo(9, -23); c.closePath(); c.fill();   // penas escuras do rabo
    c.save(); c.translate(4, -28); c.rotate(flap); c.fillStyle = '#ebe8e0'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(4, fly ? -18 : -3, 14, fly ? -12 : 7); c.lineTo(5, 6); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 4; c.beginPath(); c.moveTo(-6, -30); c.quadraticCurveTo(-10, -38, -9, -45); c.stroke(); c.strokeStyle = '#2a2624'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-6, -30); c.quadraticCurveTo(-10, -38, -9, -45); c.stroke();   // pescoco escuro
    blob(c, -9, -47, 3.6, 3.2, '#f6f4ee');
    c.fillStyle = '#d83030'; c.beginPath(); c.arc(-9, -50, 2.2, 0, 6.3); c.fill();   // coroa vermelha
    c.fillStyle = '#c8a860'; c.beginPath(); c.moveTo(-12, -47); c.lineTo(-20, -45.4); c.lineTo(-12, -45); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-10.4, -47.6, 1.3, 1.3);
    c.restore();
  }
  function peafowl(c, e, sx, sy) {
    const z = e.z || 0, fly = e.mode === 'fly' || e.mode === 'leave';
    shadow(c, sx, sy, 12 * Math.max(0.4, 1 - z / 160), 3.6, 0.2);
    begin(c, e, sx, sy - z);
    const flap = fly ? [-0.8, -0.1, 0.6, -0.1][e.frameIndex % 4] : 0, st = e.act === 'walk' ? [0.25, 0, -0.25, 0][e.frameIndex % 4] : 0;
    if (!fly) { leg(c, 1, -9, 9, 1.8, '#7a6a58', st); leg(c, 5, -9, 9, 1.8, '#8a7a68', -st); }
    for (let i = 0; i < 7; i++) {                                                   // cauda longa com olhos
      const a = -0.5 + i * 0.16, ex = 14 + Math.cos(a) * 20, ey = -14 + Math.sin(a) * 20 - 6;
      c.strokeStyle = '#2f7a4a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(8, -14); c.lineTo(ex, ey); c.stroke();
      c.fillStyle = '#1f6a9a'; c.beginPath(); c.arc(ex, ey, 2.6, 0, 6.3); c.fill(); c.fillStyle = '#4ab0a0'; c.beginPath(); c.arc(ex, ey, 1.2, 0, 6.3); c.fill();
    }
    blob(c, 2, -17, 9.4, 7, '#1f5aa8');                                             // corpo azul
    c.save(); c.translate(4, -19); c.rotate(flap); c.fillStyle = '#2a7a5a'; c.beginPath(); c.moveTo(-3, 0); c.quadraticCurveTo(3, fly ? -14 : -2, 11, fly ? -9 : 5); c.lineTo(3, 5); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1; c.stroke(); c.restore();
    c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 4.2; c.beginPath(); c.moveTo(-6, -19); c.quadraticCurveTo(-9, -26, -8, -30); c.stroke(); c.strokeStyle = '#1a6ab8'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(-6, -19); c.quadraticCurveTo(-9, -26, -8, -30); c.stroke();
    blob(c, -9, -32, 3.2, 2.8, '#1a6ab8');
    c.strokeStyle = '#1a3a6a'; c.lineWidth = 1; c.beginPath(); c.moveTo(-9, -34); c.lineTo(-9, -39); c.stroke(); c.fillStyle = '#4ab0e0'; c.beginPath(); c.arc(-9, -39.6, 1.4, 0, 6.3); c.fill();   // crista
    c.fillStyle = '#c8b480'; c.beginPath(); c.moveTo(-11.6, -32); c.lineTo(-15, -31); c.lineTo(-11.6, -30.4); c.closePath(); c.fill();
    c.fillStyle = OUT; c.fillRect(-10.6, -32.6, 1.2, 1.2);
    c.restore();
  }
  function python(c, e, sx, sy) {
    shadow(c, sx, sy, 40, 4, 0.22);
    begin(c, e, sx, sy);
    const ph = (e.frameIndex % 4) * 0.8;
    const pts = []; for (let i = 0; i < 18; i++) { const x = 34 - i * 4.2; pts.push([x, -5 - Math.sin(i * 0.7 + ph) * 3]); }
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = OUT; c.lineWidth = 8; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    c.strokeStyle = '#b8964a'; c.lineWidth = 5.6; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke();
    c.fillStyle = '#4a3418'; pts.forEach(([x, y], i) => { if (i % 2 === 0 && i < 16) { c.beginPath(); c.ellipse(x, y - 0.4, 1.9, 1.5, 0, 0, 6.3); c.fill(); } });
    const [hx, hy] = pts[17];
    blob(c, hx - 3, hy - 1, 5.2, 3.6, '#a88642');
    c.strokeStyle = '#b03030'; c.lineWidth = 1; c.beginPath(); c.moveTo(hx - 8, hy - 1); c.lineTo(hx - 12, hy - 1 + ((e.frameIndex % 2) ? 1 : -1)); c.stroke();
    c.fillStyle = OUT; c.fillRect(hx - 5.4, hy - 3, 1.3, 1.3);
    c.restore();
  }

  window.CritterArt = {
    draw(c, e, sx, sy) { const f = { tiger, snow_leopard, asian_elephant, yak, tahr, water_buffalo, giant_panda, macaque, crane, peafowl, python, zebra, wildebeest, gazelle, giraffe, camel, oryx, rhino, elephant, ostrich, lion, leopard, hyena, vulture, nile_croc, hippo, scorpion, cobra, rabbit, fox, boar, bear, crow, hare, badger, squirrel, pheasant, lynx, chicken, sheep, cow, pig, horse, goat, dog, cat, owl, duck, beaver, jaguar, capybara, tapir, peccary, anteater, sloth, capuchin, rhea, maned_wolf, armadillo, toucan, macaw, caiman, marsh_deer, harpy, anaconda, moose, reindeer, snow_hare, musk_ox, polar_bear, arctic_fox, wolverine, snowy_owl, penguin }[e.kind]; if (f) f(c, e, sx, sy); },
    plant(c, p, sx, sy, level) { if (p.kind === 'bush') bush(c, p, sx, sy, level); else if (p.kind === 'herb') herb(c, p, sx, sy, level); else mushroom(c, p, sx, sy, level); },
    herbName(p) { return (p.set === 1 ? ['Boldo', 'Erva-cidreira', 'Guaco'] : ['Camomila', 'Hortelã', 'Sálvia'])[Math.floor(p.seed * 3) % 3]; },
    names: { rabbit: 'Coelho Silvestre', fox: 'Raposa Vermelha', boar: 'Javali', bear: 'Urso Pardo', crow: 'Corvo', hare: 'Lebre', badger: 'Texugo', squirrel: 'Esquilo-vermelho', pheasant: 'Faisão', lynx: 'Lince', chicken: 'Galinha', sheep: 'Ovelha', cow: 'Vaca', pig: 'Porco', horse: 'Cavalo', goat: 'Cabra', dog: 'Cão', cat: 'Gato', owl: 'Coruja', duck: 'Pato-real', beaver: 'Castor', jaguar: 'Onça-pintada', capybara: 'Capivara', tapir: 'Anta', peccary: 'Queixada', anteater: 'Tamanduá-bandeira', sloth: 'Preguiça', capuchin: 'Macaco-prego', rhea: 'Ema', maned_wolf: 'Lobo-guará', armadillo: 'Tatu', toucan: 'Tucano', macaw: 'Arara', caiman: 'Jacaré', marsh_deer: 'Cervo-do-pantanal', harpy: 'Harpia', anaconda: 'Sucuri', moose: 'Alce', reindeer: 'Rena', snow_hare: 'Lebre-da-neve', musk_ox: 'Boi-almiscarado', polar_bear: 'Urso-polar', arctic_fox: 'Raposa-do-ártico', wolverine: 'Glutão', snowy_owl: 'Coruja-das-neves', penguin: 'Pinguim', zebra: 'Zebra', wildebeest: 'Gnu', gazelle: 'Gazela', giraffe: 'Girafa', camel: 'Camelo', oryx: 'Órix', rhino: 'Rinoceronte', elephant: 'Elefante', ostrich: 'Avestruz', lion: 'Leão', leopard: 'Leopardo', hyena: 'Hiena', vulture: 'Abutre', nile_croc: 'Crocodilo-do-Nilo', hippo: 'Hipopótamo', scorpion: 'Escorpião', cobra: 'Naja', tiger: 'Tigre', snow_leopard: 'Leopardo-das-neves', asian_elephant: 'Elefante-asiático', yak: 'Iaque', tahr: 'Tahr', water_buffalo: "Búfalo-d'água", giant_panda: 'Panda-gigante', macaque: 'Macaco-rhesus', crane: 'Grou-de-coroa-vermelha', peafowl: 'Pavão', python: 'Píton' }
  };
})();
