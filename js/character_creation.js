// character_creation.js - Telas antes do jogo: escolher personagem e criar personagem (raca, classe, atributos).
// Regras em js/ruleset.js (D&D 5e SRD). Com o servidor no ar (js/net.js) os personagens vem do banco; sem servidor
// o jogo abre direto como antes. O resultado vai para SurittoServer: charName, character (save) e newSheet
// (ficha nova ou ficha que um personagem antigo, sem raca/classe, acabou de completar). O jogo aplica em Game.applySheet.
// Previa: retrato da raca (e da raca com a roupa da classe, quando existir) importado por tools/arte/importar_novas.py
// (tipo retrato -> assets/arte/manifest.json, chave portraits). Sem retrato, mostra o icone no lugar.
(function () {
  const R = () => window.SurittoRules;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sign = (n) => (n >= 0 ? '+' + n : String(n));

  // ---------------- pintura das cores (pele, cabelo, olhos) ----------------
  // A mascara do retrato marca cada parte (R pele, G cabelo, B olhos). Cada pixel marcado troca de matiz para a cor
  // escolhida e guarda a luz e a sombra do desenho (saturacao e brilho proporcionais a cor media original da parte).
  const hexHsl = (hex) => {
    const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    return rgbHsl(r, g, b);
  };
  function rgbHsl(r, g, b) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, s, l];
  }
  function hslRgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }
  const loadImg = (src) => new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
  const clamp = (v) => Math.max(0, Math.min(1, v));
  async function paint(pic, colors) {
    const [img, mask] = await Promise.all([loadImg('assets/arte/' + pic.file + '?v=' + (pic.v || 0)), loadImg('assets/arte/' + pic.mask + '?v=' + (pic.v || 0))]);
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(mask, 0, 0); const m = cx.getImageData(0, 0, cv.width, cv.height).data;
    cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0);
    const id = cx.getImageData(0, 0, cv.width, cv.height), d = id.data;
    const parts = ['pele', 'cabelo', 'olhos'].map((k, ch) => {
      if (!colors[k] || !pic.ref || !pic.ref[k]) return null;
      const r = hexHsl(pic.ref[k]), t = hexHsl(colors[k]);
      return { ch, r, t };
    });
    for (let i = 0; i < d.length; i += 4) {
      for (const p of parts) {
        if (!p || m[i + p.ch] < 128) continue;
        const [h, s, l] = rgbHsl(d[i] / 255, d[i + 1] / 255, d[i + 2] / 255), { r, t } = p;
        let dh = h - r[0]; if (dh > 180) dh -= 360; if (dh < -180) dh += 360;
        const nh = (t[0] + dh * 0.5 + 360) % 360;
        const ns = clamp(r[1] > 0.02 ? s * t[1] / r[1] : t[1]);
        const nl = t[2] >= r[2] ? clamp(l + (1 - l) * (t[2] - r[2]) / (1 - r[2] + 1e-6)) : clamp(l * t[2] / (r[2] || 1));
        const [R, G, B] = hslRgb(nh, ns, nl); d[i] = R; d[i + 1] = G; d[i + 2] = B;
        break;
      }
    }
    cx.putImageData(id, 0, 0);
    return cv.toDataURL();
  }

  const CharacterScreen = {
    painted: new Map(),          // file|pele|cabelo|olhos -> imagem pintada (dataURL)
    async run() {
      const S = window.SurittoServer;
      if (!S || !S.online || !window.SurittoRules) return;                  // sem servidor: jogo abre como antes
      let list = [];
      try { list = await fetch('/api/characters', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)); } catch (e) { return; }
      if (!Array.isArray(list)) return;                                     // servidor antigo (sem a rota): jogo abre como antes
      try { this.portraits = ((await fetch('assets/arte/manifest.json', { cache: 'no-store' }).then(r => r.json())) || {}).portraits || {}; } catch (e) { this.portraits = {}; }
      this.root = document.createElement('div');
      this.root.id = 'char-screen';
      document.body.appendChild(this.root);
      await new Promise((done) => { this.done = done; list.length ? this.select(list) : this.create(null, list); });
      this.root.remove();
    },

    // ---------------- escolher ----------------
    select(list) {
      const Rr = R();
      this.root.innerHTML = `
        <div class="cs-window">
          <div class="cs-title">Escolha seu personagem</div>
          <div class="cs-sub">Reinos de Suritto</div>
          <div class="cs-list">${list.map((c, i) => {
            const race = Rr.RACES[c.race], cls = Rr.CLASSES[c.class];
            return `<button class="cs-char" data-i="${i}">
              <span class="cs-char-icon">${race ? race.icon : '❔'}</span>
              <span class="cs-char-info"><b>${esc(c.name)}</b>
                <small>${race ? race.name : 'Sem raça'} · ${cls ? cls.icon + ' ' + cls.name : 'Sem classe'} · Nível ${c.level}</small>
                ${!race || !cls ? '<em>Ficha incompleta: escolha raça e classe ao entrar</em>' : ''}</span>
            </button>`;
          }).join('')}</div>
          <button class="cs-btn cs-new">＋ Criar novo personagem</button>
        </div>`;
      this.root.querySelectorAll('.cs-char').forEach(b => b.addEventListener('click', async () => {
        const c = list[+b.dataset.i];
        const snap = await fetch('/api/characters/' + encodeURIComponent(c.name), { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).catch(() => null);
        if (!snap) return;
        const S = window.SurittoServer;
        S.charName = c.name; S.character = snap;
        try { localStorage.setItem('suritto_character_name', c.name); } catch (e) { }
        if (!c.race || !c.class) this.create(c.name, list);                 // personagem antigo: completa a ficha
        else this.done();
      }));
      this.root.querySelector('.cs-new').addEventListener('click', () => this.create(null, list));
    },

    // ---------------- previa ----------------
    preview(raceCode, classCode, sel = {}) {
      const Rr = R(), race = Rr.RACES[raceCode], cls = Rr.CLASSES[classCode], look = Rr.LOOKS[raceCode] || {};
      const pal = Rr.COLORS[raceCode] || {};
      // sem retrato importado, o humano usa o proprio boneco do jogo (parado, de frente)
      const P = this.portraits || {}, both = P[raceCode + '_' + classCode], only = P[raceCode] || (raceCode === 'humano' ? { file: '../player/v2/idle/down_0.png' } : null), pic = both || only;
      const h = Math.round(300 * (look.scale || 1));
      // cores escolhidas: com mascara, pinta (na hora ou do cache); sem mascara, fica o desenho original
      const colors = {}; for (const k of Object.keys(pal)) { const o = pal[k][sel[k] || 0]; if (o && o[1]) colors[k] = o[1]; }
      let src = pic && 'assets/arte/' + pic.file + (pic.v ? '?v=' + pic.v : '');
      if (pic && pic.mask && Object.keys(colors).length) {
        const key = [pic.file, colors.pele, colors.cabelo, colors.olhos].join('|');
        if (this.painted.has(key)) src = this.painted.get(key);
        else paint(pic, colors).then(url => {
          this.painted.set(key, url);
          const el = this.root && this.root.querySelector('.cs-fig'); if (el && el.dataset.key === key) el.src = url;
        }).catch(() => { });
        this.paintKey = key;
      } else this.paintKey = '';
      const fig = pic
        ? `<img class="cs-fig" src="${src}" data-key="${this.paintKey}" style="height:${h}px" alt="${race.name}">`
        : `<div class="cs-fig cs-fig-none" style="font-size:${Math.round(150 * (look.scale || 1))}px">${race.icon}</div>`;
      return `
        <div class="cs-stage">
          ${fig}
          <div class="cs-badge" title="${cls.name}">${cls.icon}</div>
          ${both ? '' : `<div class="cs-stage-note">${pic ? `Roupa de ${cls.name}: em breve` : 'Retrato ainda não desenhado'}</div>`}
        </div>
        <div class="cs-look">${Rr.LOOK_PARTS.map(p => {
          const opts = pic && pic.mask && pal[p.code];
          if (!opts) return `
          <div class="cs-look-row"><span>${p.name}</span>
            <button class="cs-arrow" disabled>‹</button><b>${look[p.code] || 'Clássico'}</b><button class="cs-arrow" disabled>›</button></div>`;
          const i = sel[p.code] || 0, o = opts[i];
          return `
          <div class="cs-look-row"><span>${p.name}</span>
            <button class="cs-arrow on" data-look="${p.code}" data-d="-1">‹</button>
            <b><i class="cs-dot" style="background:${o[1] || (pic.ref && pic.ref[p.code]) || '#888'}"></i>${o[0]}</b>
            <button class="cs-arrow on" data-look="${p.code}" data-d="1">›</button></div>`;
        }).join('')}
          <small>${Object.keys(pal).length && pic && pic.mask ? 'Cores de pele, cabelo e olhos. Penteados e rostos em breve.' : 'Mais opções de aparência em breve.'}</small>
        </div>`;
    },

    // ---------------- criar ----------------
    create(fixedName, list) {
      const Rr = R();
      const st = { name: fixedName || '', race: 'humano', cls: 'guerreiro', method: 'points', chosen: [], look: {},
        base: { forca: 8, destreza: 8, constituicao: 8, inteligencia: 8, sabedoria: 8, carisma: 8 } };
      // ponto de partida razoavel para o guerreiro (27 pontos gastos)
      Object.assign(st.base, { forca: 15, destreza: 13, constituicao: 14, inteligencia: 8, sabedoria: 12, carisma: 10 });
      const spent = () => Rr.ATTRS.reduce((s, a) => s + (st.method === 'points' ? Rr.POINT_COST[st.base[a.code]] : 0), 0);
      const render = () => {
        const race = Rr.RACES[st.race];
        if (!Rr.allowed(st.race, st.cls)) st.cls = Rr.RACE_CLASSES[st.race][0];   // trocou para uma raca que nao segue essa classe
        const cls = Rr.CLASSES[st.cls];
        if (!race.choose) st.chosen = [];
        const fin = Rr.finalAttrs(st.base, st.race, st.chosen), sh = Rr.sheet(fin, st.race, st.cls);
        const left = Rr.POINTS - spent();
        this.root.innerHTML = `
          <div class="cs-window cs-create">
            <div class="cs-title">${fixedName ? 'Complete a ficha de ' + esc(fixedName) : 'Criar personagem'}</div>
            <div class="cs-sub">${fixedName ? 'Seu progresso, mochila e posição continuam os mesmos.' : 'Raças e classes clássicas (D&D 5e SRD)'}</div>
            <div class="cs-cols">
              <div class="cs-col">
                <label class="cs-label">Nome</label>
                <input class="cs-name" maxlength="20" value="${esc(st.name)}" ${fixedName ? 'disabled' : ''} placeholder="Nome do personagem">
                <label class="cs-label">Raça</label>
                <div class="cs-grid">${Object.entries(Rr.RACES).map(([k, r]) => `<button class="cs-pick ${k === st.race ? 'on' : ''}" data-race="${k}"><span>${r.icon}</span>${r.name}</button>`).join('')}</div>
                <div class="cs-desc"><b>${race.name}</b> — ${race.desc}<br><small>${Object.entries(race.bonus).map(([a, v]) => Rr.ATTRS.find(x => x.code === a).abbr + ' ' + sign(v)).join(', ')}${race.choose ? ` + ${race.choose}× +1 à escolha` : ''} · Deslocamento ${race.speed} · ${race.traits.join(' · ')}</small></div>
                <label class="cs-label">Classe</label>
                <div class="cs-grid">${Object.entries(Rr.CLASSES).map(([k, c]) => Rr.allowed(st.race, k)
                  ? `<button class="cs-pick ${k === st.cls ? 'on' : ''}" data-cls="${k}"><span>${c.icon}</span>${c.name}</button>`
                  : `<button class="cs-pick off" disabled title="${race.name} não pode ser ${c.name}"><span>${c.icon}</span>${c.name}</button>`).join('')}</div>
                <div class="cs-desc"><b>${cls.name}</b> — ${cls.desc}<br><small>${cls.role} · Dado de vida d${cls.hitDie} · Atributo principal: ${cls.key.map(a => Rr.ATTRS.find(x => x.code === a).name).join(' ou ')}${cls.caster ? ' · Conjurador' : ''}</small></div>
              </div>
              <div class="cs-col cs-col-preview">
                <label class="cs-label">Aparência</label>
                ${this.preview(st.race, st.cls, st.look)}
              </div>
              <div class="cs-col">
                <label class="cs-label">Atributos
                  <span class="cs-methods">
                    <button class="cs-tab ${st.method === 'points' ? 'on' : ''}" data-m="points">Compra de pontos</button>
                    <button class="cs-tab ${st.method === 'roll' ? 'on' : ''}" data-m="roll">🎲 Rolar 4d6</button>
                  </span></label>
                <div class="cs-hint">${st.method === 'points' ? `Pontos restantes: <b class="${left < 0 ? 'bad' : ''}">${left}</b> de ${Rr.POINTS} (valores de 8 a 15)` : 'Cada atributo: 4d6, descarta o menor. Pode rolar de novo.'}</div>
                <table class="cs-attrs">${Rr.ATTRS.map(a => {
                  const v = fin[a.code], bonus = v - st.base[a.code];
                  return `<tr title="${a.hint}">
                    <td class="cs-an">${a.abbr}<small>${a.name}</small></td>
                    <td>${st.method === 'points' ? `<button class="cs-pm" data-a="${a.code}" data-d="-1">−</button>` : ''}<b class="cs-base">${st.base[a.code]}</b>${st.method === 'points' ? `<button class="cs-pm" data-a="${a.code}" data-d="1">＋</button>` : ''}</td>
                    <td class="cs-race">${bonus ? sign(bonus) : ''}${race.choose ? ` <label class="cs-chk"><input type="checkbox" data-c="${a.code}" ${st.chosen.includes(a.code) ? 'checked' : ''}> +1</label>` : ''}</td>
                    <td class="cs-final">${v}<small>${sign(Rr.mod(v))}</small></td>
                  </tr>`;
                }).join('')}</table>
                ${st.method === 'roll' ? '<button class="cs-btn cs-reroll">🎲 Rolar de novo</button>' : ''}
                <div class="cs-sheet">
                  <div><span>❤️ Vida (PV)</span><b>${sh.maxHp}</b></div>
                  <div><span>💧 Mana (PM)</span><b>${sh.maxMana}</b></div>
                  <div><span>🛡️ Defesa</span><b>${sh.defense}</b></div>
                  <div><span>⚔️ Ataque</span><b>${sign(sh.attack)}</b></div>
                  <div><span>⚡ Iniciativa</span><b>${sign(sh.initiative)}</b></div>
                </div>
                <div class="cs-err"></div>
                <div class="cs-actions">
                  ${list.length && !fixedName ? '<button class="cs-btn cs-back">← Voltar</button>' : ''}
                  <button class="cs-btn cs-go">${fixedName ? 'Salvar ficha e jogar' : 'Começar a aventura'}</button>
                </div>
              </div>
            </div>
          </div>`;
        const $ = (s) => this.root.querySelector(s), $$ = (s) => this.root.querySelectorAll(s);
        const nameEl = $('.cs-name'); nameEl.addEventListener('input', () => { st.name = nameEl.value; });
        $$('[data-race]').forEach(b => b.addEventListener('click', () => { if (st.race !== b.dataset.race) st.look = {}; st.race = b.dataset.race; render(); }));
        $$('[data-look]').forEach(b => b.addEventListener('click', () => {
          const k = b.dataset.look, n = Rr.COLORS[st.race][k].length;
          st.look[k] = ((st.look[k] || 0) + +b.dataset.d + n) % n; render();
        }));
        $$('[data-cls]').forEach(b => b.addEventListener('click', () => { st.cls = b.dataset.cls; render(); }));
        $$('[data-m]').forEach(b => b.addEventListener('click', () => {
          st.method = b.dataset.m;
          if (st.method === 'roll') for (const a of Rr.ATTRS) st.base[a.code] = Rr.roll4d6();
          else Object.assign(st.base, { forca: 15, destreza: 13, constituicao: 14, inteligencia: 8, sabedoria: 12, carisma: 10 });
          render();
        }));
        $$('.cs-pm').forEach(b => b.addEventListener('click', () => {
          const a = b.dataset.a, v = st.base[a] + +b.dataset.d;
          if (v < 8 || v > 15) return;
          const old = st.base[a]; st.base[a] = v;
          if (spent() > Rr.POINTS) st.base[a] = old;
          render();
        }));
        $$('[data-c]').forEach(c => c.addEventListener('change', () => {
          const a = c.dataset.c;
          if (c.checked && st.chosen.length < race.choose && !(race.bonus[a])) st.chosen.push(a);
          else st.chosen = st.chosen.filter(x => x !== a);
          render();
        }));
        const rr = $('.cs-reroll'); if (rr) rr.addEventListener('click', () => { for (const a of Rr.ATTRS) st.base[a.code] = Rr.roll4d6(); render(); });
        const back = $('.cs-back'); if (back) back.addEventListener('click', () => this.select(list));
        $('.cs-go').addEventListener('click', async () => {
          const err = (m) => { $('.cs-err').textContent = m; };
          const name = (fixedName || st.name).trim();
          if (!fixedName) {
            if (!/^[\p{L}][\p{L} '-]{1,19}$/u.test(name)) return err('Nome: de 2 a 20 letras (pode ter espaço, hífen e apóstrofo).');
            if (list.some(c => c.name.toLowerCase() === name.toLowerCase())) return err('Já existe um personagem com esse nome.');
          }
          if (st.method === 'points' && spent() > Rr.POINTS) return err('Você gastou mais pontos do que tem.');
          if (race.choose && st.chosen.length !== race.choose) return err(`${race.name}: escolha ${race.choose} atributos para o +1.`);
          if (!Rr.allowed(st.race, st.cls)) return err(`${race.name} não pode ser ${cls.name}.`);
          const S = window.SurittoServer;
          if (!fixedName) { S.charName = name; S.character = null; try { localStorage.setItem('suritto_character_name', name); } catch (e) { } }
          const pal = Rr.COLORS[st.race] || {}, appearance = {};
          for (const k of Object.keys(pal)) appearance[k] = pal[k][st.look[k] || 0][1];       // null = cor original do desenho
          S.newSheet = { race: st.race, class: st.cls, attributes: Rr.finalAttrs(st.base, st.race, st.chosen), appearance, isNew: !fixedName };
          this.done();
        });
      };
      render();
    }
  };
  window.CharacterScreen = CharacterScreen;
})();
