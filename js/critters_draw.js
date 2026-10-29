// critters_draw.js - Desenho por codigo dos bichos novos da fauna (coelho, raposa, javali, urso, corvo) e das
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

  window.CritterArt = {
    draw(c, e, sx, sy) { const f = { rabbit, fox, boar, bear, crow }[e.kind]; if (f) f(c, e, sx, sy); },
    plant(c, p, sx, sy, level) { if (p.kind === 'bush') bush(c, p, sx, sy, level); else mushroom(c, p, sx, sy, level); },
    names: { rabbit: 'Coelho Silvestre', fox: 'Raposa Vermelha', boar: 'Javali', bear: 'Urso Pardo', crow: 'Corvo' }
  };
})();
