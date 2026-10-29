// character_creation.js - Telas antes do jogo: escolher personagem e criar personagem (raca, classe, atributos).
// Regras em js/ruleset.js (D&D 5e SRD). Com o servidor no ar (js/net.js) os personagens vem do banco; sem servidor
// o jogo abre direto como antes. O resultado vai para SurittoServer: charName, character (save) e newSheet
// (ficha nova ou ficha que um personagem antigo, sem raca/classe, acabou de completar). O jogo aplica em Game.applySheet.
(function () {
  const R = () => window.SurittoRules;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sign = (n) => (n >= 0 ? '+' + n : String(n));

  const CharacterScreen = {
    async run() {
      const S = window.SurittoServer;
      if (!S || !S.online || !window.SurittoRules) return;                  // sem servidor: jogo abre como antes
      let list = [];
      try { list = await fetch('/api/characters', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)); } catch (e) { return; }
      if (!Array.isArray(list)) return;                                     // servidor antigo (sem a rota): jogo abre como antes
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

    // ---------------- criar ----------------
    create(fixedName, list) {
      const Rr = R();
      const st = { name: fixedName || '', race: 'humano', cls: 'guerreiro', method: 'points', chosen: [],
        base: { forca: 8, destreza: 8, constituicao: 8, inteligencia: 8, sabedoria: 8, carisma: 8 } };
      // ponto de partida razoavel para o guerreiro (27 pontos gastos)
      Object.assign(st.base, { forca: 15, destreza: 13, constituicao: 14, inteligencia: 8, sabedoria: 12, carisma: 10 });
      const spent = () => Rr.ATTRS.reduce((s, a) => s + (st.method === 'points' ? Rr.POINT_COST[st.base[a.code]] : 0), 0);
      const render = () => {
        const race = Rr.RACES[st.race], cls = Rr.CLASSES[st.cls];
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
                <div class="cs-grid">${Object.entries(Rr.CLASSES).map(([k, c]) => `<button class="cs-pick ${k === st.cls ? 'on' : ''}" data-cls="${k}"><span>${c.icon}</span>${c.name}</button>`).join('')}</div>
                <div class="cs-desc"><b>${cls.name}</b> — ${cls.desc}<br><small>${cls.role} · Dado de vida d${cls.hitDie} · Atributo principal: ${cls.key.map(a => Rr.ATTRS.find(x => x.code === a).name).join(' ou ')}${cls.caster ? ' · Conjurador' : ''}</small></div>
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
        $$('[data-race]').forEach(b => b.addEventListener('click', () => { st.race = b.dataset.race; render(); }));
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
          const S = window.SurittoServer;
          if (!fixedName) { S.charName = name; S.character = null; try { localStorage.setItem('suritto_character_name', name); } catch (e) { } }
          S.newSheet = { race: st.race, class: st.cls, attributes: Rr.finalAttrs(st.base, st.race, st.chosen), isNew: !fixedName };
          this.done();
        });
      };
      render();
    }
  };
  window.CharacterScreen = CharacterScreen;
})();
