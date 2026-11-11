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

  window.CritterArt = {
    draw(c, e, sx, sy) { const f = { rabbit, fox, boar, bear, crow, hare, badger, squirrel, pheasant, lynx, chicken, sheep, cow, pig, horse, goat, dog, cat, owl, duck, beaver, jaguar, capybara, tapir, peccary, anteater, sloth, capuchin, rhea, maned_wolf, armadillo, toucan, macaw, caiman, marsh_deer, harpy, anaconda, moose, reindeer, snow_hare, musk_ox, polar_bear, arctic_fox, wolverine, snowy_owl, penguin }[e.kind]; if (f) f(c, e, sx, sy); },
    plant(c, p, sx, sy, level) { if (p.kind === 'bush') bush(c, p, sx, sy, level); else if (p.kind === 'herb') herb(c, p, sx, sy, level); else mushroom(c, p, sx, sy, level); },
    herbName(p) { return (p.set === 1 ? ['Boldo', 'Erva-cidreira', 'Guaco'] : ['Camomila', 'Hortelã', 'Sálvia'])[Math.floor(p.seed * 3) % 3]; },
    names: { rabbit: 'Coelho Silvestre', fox: 'Raposa Vermelha', boar: 'Javali', bear: 'Urso Pardo', crow: 'Corvo', hare: 'Lebre', badger: 'Texugo', squirrel: 'Esquilo-vermelho', pheasant: 'Faisão', lynx: 'Lince', chicken: 'Galinha', sheep: 'Ovelha', cow: 'Vaca', pig: 'Porco', horse: 'Cavalo', goat: 'Cabra', dog: 'Cão', cat: 'Gato', owl: 'Coruja', duck: 'Pato-real', beaver: 'Castor', jaguar: 'Onça-pintada', capybara: 'Capivara', tapir: 'Anta', peccary: 'Queixada', anteater: 'Tamanduá-bandeira', sloth: 'Preguiça', capuchin: 'Macaco-prego', rhea: 'Ema', maned_wolf: 'Lobo-guará', armadillo: 'Tatu', toucan: 'Tucano', macaw: 'Arara', caiman: 'Jacaré', marsh_deer: 'Cervo-do-pantanal', harpy: 'Harpia', anaconda: 'Sucuri', moose: 'Alce', reindeer: 'Rena', snow_hare: 'Lebre-da-neve', musk_ox: 'Boi-almiscarado', polar_bear: 'Urso-polar', arctic_fox: 'Raposa-do-ártico', wolverine: 'Glutão', snowy_owl: 'Coruja-das-neves', penguin: 'Pinguim' }
  };
})();
