// trees_draw.js - Variedades de arvore por regiao e clima, desenhadas por codigo (bloquinhos) ate existir arte do Gem.
// O carvalho continua sendo a imagem arvore_game.png. Aqui: TreeArt.pick escolhe a especie de cada arvore (js/world.js) e
// TreeArt.draw desenha. (bx, by) = onde o tronco toca o chao, na tela. Luz de cima-esquerda, contorno escuro.
(function () {
  const OUT = '#1c140d';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Medidas de cada especie: w/h = caixa para o mouse e o desenho; r = raio do tronco (colisao); nome; frutos?
  const SPECIES = {
    oak:        { name: 'Carvalho', w: 190, h: 220, r: 24, fruit: true, wood: 'Carvalho' },
    pine:       { name: 'Pinheiro', w: 130, h: 230, r: 20, wood: 'Pinheiro' },
    spruce:     { name: 'Abeto', w: 120, h: 240, r: 18, wood: 'Abeto' },
    palm:       { name: 'Palmeira', w: 150, h: 220, r: 14, wood: 'Palmeira' },
    acacia:     { name: 'Acácia', w: 200, h: 170, r: 16, wood: 'Acácia' },
    baobab:     { name: 'Baobá', w: 190, h: 200, r: 36, wood: 'Baobá' },
    cactus:     { name: 'Cacto', w: 80, h: 130, r: 12, wood: 'Cacto' },
    cherry:     { name: 'Cerejeira', w: 190, h: 200, r: 20, fruit: true, wood: 'Cerejeira' },
    bamboo:     { name: 'Bambuzal', w: 130, h: 250, r: 18, wood: 'Bambu' },
    eucalyptus: { name: 'Eucalipto', w: 160, h: 240, r: 17, wood: 'Eucalipto' },
    araucaria:  { name: 'Araucária', w: 170, h: 240, r: 18, wood: 'Araucária' },
    jungle:     { name: 'Árvore Tropical', w: 210, h: 230, r: 30, wood: 'Madeira Tropical' },
    birch:      { name: 'Bétula', w: 150, h: 220, r: 16, wood: 'Bétula' },
    olive:      { name: 'Oliveira', w: 160, h: 150, r: 20, wood: 'Oliveira' }
  };
  const AMERICAS = ['america_norte', 'america_central', 'america_sul_hispanica', 'brasil'];

  // Qual especie nasce aqui? mac = macro-regiao, lat = latitude, terr = tipo de terreno do ponto, h = sorteio 0..1 (fixo por arvore)
  function pick(mac, lat, terr, h) {
    const al = Math.abs(lat), dense = terr === 'dense_forest', forest = terr === 'forest' || dense;
    if (terr === 'desert' || terr === 'canyon') {
      if (AMERICAS.includes(mac)) return 'cactus';
      if (mac === 'oriente_medio' || mac === 'africa') return h < 0.5 ? 'palm' : 'acacia';
      return null;                                                       // deserto sem arvore
    }
    if (terr === 'snow') return al >= 35 ? 'spruce' : null;            // neve em clima quente (pico de montanha): sem arvore
    if (terr === 'shore' && al < 28) return 'palm';
    switch (mac) {
      case 'africa': return terr === 'plains' || terr === 'hills' ? (h < 0.3 ? 'baobab' : 'acacia') : (dense ? 'jungle' : (h < 0.5 ? 'palm' : 'acacia'));
      case 'oriente_medio': return al < 24 ? 'palm' : 'olive';
      case 'iberia': return forest && h < 0.3 ? 'pine' : 'olive';
      case 'sudoeste_asiatico': case 'sul_asiatico': return dense ? 'jungle' : (forest ? (h < 0.45 ? 'jungle' : 'palm') : (terr === 'hills' ? 'pine' : 'palm'));
      case 'china': return forest ? (h < 0.4 ? 'bamboo' : 'cherry') : (terr === 'hills' ? 'pine' : 'cherry');
      case 'japao': return terr === 'hills' ? 'pine' : (dense ? 'bamboo' : (h < 0.2 ? 'bamboo' : 'cherry'));
      case 'oceania': return 'eucalyptus';
      case 'oceania_leste': return 'palm';
      case 'america_central': return dense ? 'jungle' : (h < 0.6 ? 'palm' : 'jungle');
      case 'brasil': return dense ? 'jungle' : (al > 22 && forest && h < 0.6 ? 'araucaria' : (forest ? 'jungle' : (h < 0.45 ? 'jungle' : 'palm')));
      case 'america_sul_hispanica': return terr === 'hills' ? 'pine' : (al > 30 && forest ? 'araucaria' : (terr === 'plains' ? 'acacia' : 'jungle'));
      case 'america_norte': return lat > 52 ? (h < 0.7 ? 'spruce' : 'birch') : (terr === 'hills' || (forest && h < 0.35) ? 'pine' : 'oak');
      case 'norte_europeu': case 'europa_oriental': return lat > 58 ? (h < 0.75 ? 'spruce' : 'birch') : (h < 0.3 ? 'birch' : (h < 0.5 ? 'pine' : 'oak'));
      case 'galia': case 'ilhas_ocidentais': return terr === 'hills' && h < 0.4 ? 'pine' : (h < 0.15 ? 'birch' : 'oak');
      default: return 'oak';
    }
  }

  // ---- pecas
  function blob(c, x, y, rx, ry, col, rot = 0) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); c.fill(); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); }
  function soft(c, x, y, rx, ry, col) { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
  // tronco afilando para cima: (x, base) -> (x+lean, base-h)
  function trunk(c, x, by, w0, w1, h, col, dark, lean = 0) {
    c.fillStyle = col; c.beginPath(); c.moveTo(x - w0 / 2, by); c.lineTo(x + lean - w1 / 2, by - h); c.lineTo(x + lean + w1 / 2, by - h); c.lineTo(x + w0 / 2, by); c.closePath(); c.fill();
    c.fillStyle = dark; c.beginPath(); c.moveTo(x + w0 * 0.1, by); c.lineTo(x + lean + w1 * 0.1, by - h); c.lineTo(x + lean + w1 / 2, by - h); c.lineTo(x + w0 / 2, by); c.closePath(); c.fill();
    c.strokeStyle = OUT; c.lineWidth = 2; c.beginPath(); c.moveTo(x - w0 / 2, by); c.lineTo(x + lean - w1 / 2, by - h); c.moveTo(x + w0 / 2, by); c.lineTo(x + lean + w1 / 2, by - h); c.stroke();
  }
  // copa em camadas de bolhas: lista de [dx, dy, rx, ry]
  function crown(c, x, y, parts, dark, mid, light) {
    for (const [dx, dy, rx, ry] of parts) blob(c, x + dx, y + dy, rx, ry, dark);
    for (const [dx, dy, rx, ry] of parts) soft(c, x + dx - rx * 0.08, y + dy - ry * 0.1, rx * 0.86, ry * 0.8, mid);
    for (const [dx, dy, rx, ry] of parts) soft(c, x + dx - rx * 0.28, y + dy - ry * 0.34, rx * 0.5, ry * 0.42, light);
  }
  function tier(c, x, y, w, h, dark, mid, light, snow) {          // camada triangular de conifera
    c.fillStyle = dark; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + w / 2, y); c.lineTo(x - w / 2, y); c.closePath(); c.fill();
    c.fillStyle = mid; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + w * 0.18, y - h * 0.15); c.lineTo(x - w / 2, y); c.closePath(); c.fill();
    c.fillStyle = light; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x - w * 0.12, y - h * 0.5); c.lineTo(x - w * 0.34, y - h * 0.12); c.closePath(); c.fill();
    if (snow) { c.fillStyle = '#f2f6fa'; c.beginPath(); c.moveTo(x, y - h); c.lineTo(x + w * 0.2, y - h * 0.6); c.lineTo(x - w * 0.2, y - h * 0.6); c.closePath(); c.fill(); }
    c.strokeStyle = OUT; c.lineWidth = 2; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x, y - h); c.lineTo(x + w / 2, y); c.closePath(); c.stroke();
  }

  const D = {
    pine(c, t) {
      trunk(c, 0, 0, 22, 14, 70, '#7a5230', '#54361e');
      const k = 0.9 + t.v * 0.2;
      for (let i = 0; i < 4; i++) tier(c, 0, -52 - i * 46 * k, (118 - i * 24) * k, 66 * k, '#1f4a2a', '#2c6a38', '#4a9050', false);
    },
    spruce(c, t) {
      trunk(c, 0, 0, 18, 10, 50, '#6a4628', '#46301a');
      const k = 0.9 + t.v * 0.2;
      for (let i = 0; i < 5; i++) tier(c, 0, -34 - i * 40 * k, (100 - i * 18) * k, 56 * k, '#173c2a', '#235a3c', '#3a7a52', t.snowy || i === 4);
    },
    palm(c, t) {
      const lean = (t.v - 0.5) * 36;
      const top = [lean, -150];
      c.lineCap = 'round'; c.strokeStyle = OUT; c.lineWidth = 15; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(lean * 0.2, -80, top[0], top[1]); c.stroke();
      c.strokeStyle = '#a07a4a'; c.lineWidth = 11; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(lean * 0.2, -80, top[0], top[1]); c.stroke();
      c.strokeStyle = '#7a5a34'; c.lineWidth = 2; for (let i = 1; i < 9; i++) { const f = i / 9; c.beginPath(); c.moveTo(-6 + lean * f * 0.6, -f * 150); c.lineTo(6 + lean * f * 0.6, -f * 150 - 3); c.stroke(); }
      const frond = (a, len, col) => { c.save(); c.translate(top[0], top[1]); c.rotate(a); c.fillStyle = col; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(len * 0.5, -len * 0.34, len, len * 0.2); c.quadraticCurveTo(len * 0.5, -len * 0.08, 0, 5); c.closePath(); c.fill(); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); c.restore(); };
      const angs = [-2.9, -2.4, -1.8, -1.0, -0.4, 0.1, 0.6, 1.6, 2.2];
      angs.forEach((a, i) => frond(a, 62 + (i % 3) * 8, i % 2 ? '#2f8a3c' : '#3da64a'));
      blob(c, top[0] - 4, top[1] + 6, 5, 5, '#6a4a28'); blob(c, top[0] + 5, top[1] + 8, 5, 5, '#7a5a30');   // cocos
    },
    acacia(c, t) {
      c.strokeStyle = OUT; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-6, -50, -22 * (t.v - 0.5) * 2, -92); c.moveTo(-4, -56); c.lineTo(30, -96); c.stroke();
      c.strokeStyle = '#6a4a2c'; c.lineWidth = 7; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-6, -50, -22 * (t.v - 0.5) * 2, -92); c.moveTo(-4, -56); c.lineTo(30, -96); c.stroke();
      crown(c, 0, -112, [[-52, 4, 50, 17], [8, -8, 62, 22], [58, 2, 42, 15]], '#5a7a2c', '#86a63c', '#b6cc5c');
    },
    baobab(c, t) {
      c.fillStyle = '#8a6a4a'; c.beginPath(); c.moveTo(-34, 0); c.quadraticCurveTo(-22, -36, -18, -80); c.lineTo(-12, -110); c.lineTo(12, -110); c.lineTo(18, -80); c.quadraticCurveTo(22, -36, 34, 0); c.closePath(); c.fill();
      c.fillStyle = '#6a4e34'; c.beginPath(); c.moveTo(6, 0); c.quadraticCurveTo(14, -36, 12, -80); c.lineTo(12, -110); c.lineTo(18, -80); c.quadraticCurveTo(22, -36, 34, 0); c.closePath(); c.fill();
      c.strokeStyle = OUT; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-34, 0); c.quadraticCurveTo(-22, -36, -18, -80); c.lineTo(-12, -110); c.moveTo(34, 0); c.quadraticCurveTo(22, -36, 18, -80); c.lineTo(12, -110); c.stroke();
      c.lineCap = 'round'; for (const [x, y, a] of [[-10, -108, -0.9], [0, -112, -1.57], [10, -108, -2.2], [-8, -104, -0.5], [8, -104, -2.6]]) { c.strokeStyle = OUT; c.lineWidth = 8; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 38, y + Math.sin(a) * 38); c.stroke(); c.strokeStyle = '#7a5a3c'; c.lineWidth = 4.4; c.stroke(); }
      crown(c, 0, -148, [[-34, 10, 24, 14], [0, -2, 30, 18], [34, 8, 24, 14]], '#3e6a2a', '#5a9038', '#86bc58');
    },
    cactus(c, t) {
      const g = (x, y, w, h, col) => { c.fillStyle = col; c.beginPath(); c.roundRect ? c.roundRect(x - w / 2, y - h, w, h, w / 2) : c.rect(x - w / 2, y - h, w, h); c.fill(); c.strokeStyle = OUT; c.lineWidth = 2; c.stroke(); };
      g(0, 0, 22, 104, '#3f8a4a');
      g(-24, -34, 12, 38, '#3f8a4a'); g(-24 + 2, -44, 12, 4, '#3f8a4a'); g(26, -48, 12, 44, '#3f8a4a');
      c.fillStyle = '#2f6a3a'; c.fillRect(-1, -102, 3, 100);
      c.fillStyle = '#7acc84'; c.fillRect(-7, -96, 3, 88);
      c.strokeStyle = '#f0e8c8'; c.lineWidth = 1; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-9, -12 - i * 10); c.lineTo(-13, -14 - i * 10); c.moveTo(9, -12 - i * 10); c.lineTo(13, -14 - i * 10); c.stroke(); }
      blob(c, 0, -106, 4, 3, '#e8508a');
    },
    cherry(c, t) {
      trunk(c, 0, 0, 24, 14, 70, '#5a3a2a', '#3e281c', 6);
      c.strokeStyle = OUT; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, -60); c.lineTo(-30, -92); c.moveTo(8, -64); c.lineTo(40, -94); c.stroke();
      c.strokeStyle = '#5a3a2a'; c.lineWidth = 3.4; c.stroke();
      crown(c, 0, -128, [[-48, 14, 42, 32], [46, 12, 42, 32], [0, -6, 56, 42], [-22, -22, 36, 28], [26, -20, 36, 28]], '#c8587a', '#f08aae', '#ffd0e0');
      c.fillStyle = '#ffeaf2'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-60 + ((i * 37) % 120), -150 + ((i * 53) % 60), 2.2, 0, 6.3); c.fill(); }
    },
    bamboo(c, t) {
      const stalks = [[-30, 190, 7], [-14, 230, 8], [4, 250, 9], [22, 215, 8], [38, 180, 7]];
      stalks.forEach(([x, h, w], i) => {
        const sway = (i - 2) * 3;
        c.fillStyle = '#7ab04a'; c.fillRect(x - w / 2, -h, w, h); c.fillStyle = '#a4d46a'; c.fillRect(x - w / 2, -h, w * 0.35, h); c.fillStyle = '#4a7a2c'; c.fillRect(x + w * 0.2, -h, w * 0.3, h);
        c.strokeStyle = OUT; c.lineWidth = 1.6; c.strokeRect(x - w / 2, -h, w, h);
        for (let n = 1; n < h / 36; n++) { c.fillStyle = '#4a7a2c'; c.fillRect(x - w / 2 - 1, -n * 36, w + 2, 3); }
        for (const [dy, dir] of [[-h + 6, -1], [-h + 40, 1], [-h + 80, -1]]) { c.save(); c.translate(x + sway, dy); c.rotate(dir * 0.9); c.fillStyle = i % 2 ? '#3d8a3a' : '#58a848'; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(14, -6, 36, 4); c.quadraticCurveTo(14, 4, 0, 0); c.fill(); c.strokeStyle = OUT; c.lineWidth = 1.4; c.stroke(); c.restore(); }
      });
    },
    eucalyptus(c, t) {
      const lean = (t.v - 0.5) * 30;
      trunk(c, 0, 0, 20, 10, 110, '#c8c0aa', '#9a927c', lean);
      c.strokeStyle = '#6a6250'; c.lineWidth = 1.6; for (let i = 1; i < 7; i++) { c.beginPath(); c.moveTo(-6 + lean * i / 9, -i * 15); c.lineTo(2 + lean * i / 9, -i * 15 - 5); c.stroke(); }
      c.strokeStyle = OUT; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(lean, -100); c.lineTo(lean - 36, -136); c.moveTo(lean, -104); c.lineTo(lean + 38, -142); c.stroke(); c.strokeStyle = '#b4ac96'; c.lineWidth = 3.4; c.stroke();
      crown(c, lean, -158, [[-40, 14, 34, 18], [40, 8, 36, 18], [0, -12, 42, 24], [-10, 18, 30, 14]], '#4a7a6a', '#6aa28a', '#9acab0');
    },
    araucaria(c, t) {
      trunk(c, 0, 0, 18, 12, 150, '#6a4a34', '#46301e');
      for (let i = 0; i < 3; i++) { const y = -140 - i * 24; c.strokeStyle = OUT; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(-46 + i * 8, y - 8, -64 + i * 14, y - 36); c.moveTo(0, y); c.quadraticCurveTo(46 - i * 8, y - 8, 64 - i * 14, y - 36); c.stroke(); c.strokeStyle = '#2c5a30'; c.lineWidth = 3; c.stroke(); }
      crown(c, 0, -200, [[-52, 8, 28, 12], [52, 8, 28, 12], [0, -6, 44, 16], [-28, 6, 26, 12], [28, 6, 26, 12]], '#1f4a2a', '#2f6a3a', '#58a45a');
      blob(c, -20, -184, 6, 6, '#7a4a2a'); blob(c, 28, -188, 6, 6, '#7a4a2a');                 // pinhas
    },
    jungle(c, t) {
      c.fillStyle = '#5a3e2a'; c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(-16, -10, -12, -60); c.lineTo(-10, -110); c.lineTo(10, -110); c.lineTo(12, -60); c.quadraticCurveTo(16, -10, 40, 0); c.closePath(); c.fill();
      c.fillStyle = '#42291a'; c.beginPath(); c.moveTo(8, 0); c.quadraticCurveTo(14, -20, 10, -110); c.lineTo(12, -60); c.quadraticCurveTo(16, -10, 40, 0); c.closePath(); c.fill();
      c.strokeStyle = OUT; c.lineWidth = 2.4; c.beginPath(); c.moveTo(-40, 0); c.quadraticCurveTo(-16, -10, -12, -60); c.lineTo(-10, -110); c.moveTo(40, 0); c.quadraticCurveTo(16, -10, 12, -60); c.lineTo(10, -110); c.stroke();
      crown(c, 0, -156, [[-62, 16, 48, 34], [62, 14, 48, 34], [0, -8, 76, 52], [-34, -34, 48, 34], [38, -32, 48, 34]], '#1e4a22', '#2f7a34', '#5cb450');
      c.strokeStyle = '#2f7a34'; c.lineWidth = 2; for (const x of [-56, -20, 34, 64]) { c.beginPath(); c.moveTo(x, -128); c.quadraticCurveTo(x + 4, -104, x - 2, -84); c.stroke(); }   // cipos
      blob(c, -40, -150, 4, 4, '#e84a5a'); blob(c, 44, -172, 4, 4, '#f0a030');
    },
    birch(c, t) {
      trunk(c, 0, 0, 18, 11, 130, '#eae4d6', '#bdb6a4', (t.v - 0.5) * 14);
      c.fillStyle = '#2a2420'; for (let i = 0; i < 7; i++) c.fillRect(-7 + (i % 2) * 6, -12 - i * 17, 6, 3);
      crown(c, 0, -164, [[-34, 12, 36, 28], [34, 14, 36, 28], [0, -8, 46, 38], [-10, 20, 32, 20]], '#7a9a3c', '#a8c456', '#d6e68a');
    },
    olive(c, t) {
      c.strokeStyle = OUT; c.lineWidth = 22; c.lineCap = 'round'; c.beginPath(); c.moveTo(-4, 0); c.quadraticCurveTo(-18, -30, -2, -56); c.moveTo(0, -36); c.quadraticCurveTo(18, -50, 26, -74); c.stroke();
      c.strokeStyle = '#8a6e52'; c.lineWidth = 16; c.stroke(); c.strokeStyle = '#a88a68'; c.lineWidth = 6; c.beginPath(); c.moveTo(-8, 0); c.quadraticCurveTo(-22, -30, -6, -56); c.stroke();
      crown(c, 0, -90, [[-34, 8, 38, 24], [34, 10, 36, 22], [0, -8, 46, 30], [-6, 16, 34, 16]], '#5a6a48', '#86986a', '#b4c692');
    }
  };

  window.TreeArt = {
    SPECIES, pick,
    info(kind) { return SPECIES[kind] || SPECIES.oak; },
    // desenha uma arvore viva que nao seja carvalho; devolve false se nao souber (o jogo usa o carvalho)
    draw(c, tree, bx, by, shakeX) {
      const f = D[tree.species]; if (!f) return false;
      c.save(); c.translate(Math.round(bx + shakeX), Math.round(by)); c.lineJoin = 'round';
      f(c, tree);
      c.restore();
      return true;
    }
  };
})();
