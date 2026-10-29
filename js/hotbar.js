// hotbar.js - Barra de atalhos (teclas 1 a 0), estilo WoW: cada slot guarda o que o jogador quiser.
// Arraste um item da mochila para o slot; arraste entre slots para trocar; botao direito limpa o slot.
// Tecla / clique: consumivel = usa; arma ou tocha = equipa (ou guarda, se ja estiver na mao).
// Acoes especiais (nao sao itens): 'dice' = rolar o D20 da sorte.
// Salvo junto com o personagem (save_system.js -> character.state.hotbar).
class Hotbar {
  static KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  // mesma distribuicao das teclas antigas (fixas), para nao mudar o costume de quem ja joga
  static DEFAULT = ['fruit', 'potion_heal', 'potion_mana', 'axe', 'torch', 'scroll_enchant', 'sword', 'fire_sword', 'meat', 'dice'];
  static ACTIONS = { dice: { icon: '🎲', name: 'Rolar D20 da Sorte', stats: 'Teste de Iniciativa (+2)' } };

  constructor(game) {
    this.game = game;
    this.slots = Hotbar.DEFAULT.slice();
    this.el = document.getElementById('hotbar');
    this.render();
  }
  get inv() { return this.game.inventory; }

  // ---------------- estado ----------------
  set(i, id) { if (i >= 0 && i < 10) { this.slots[i] = id || null; this.render(); } }
  load(list) {
    if (!Array.isArray(list)) return;
    this.slots = Hotbar.KEYS.map((_, i) => (list[i] && (this.inv.itemDB[list[i]] || Hotbar.ACTIONS[list[i]]) ? list[i] : null));
    this.render();
  }
  keyOf(id) { const i = this.slots.indexOf(id); return i === -1 ? null : Hotbar.KEYS[i]; }
  count(id) { return this.inv.slots.reduce((n, s) => n + (s && s.id === id ? s.count : 0), 0); }
  equipped(id) { const e = this.inv.equipment; return e.weapon === id || e.offhand === id; }

  // ---------------- usar ----------------
  use(key) {
    const i = Hotbar.KEYS.indexOf(String(key)); if (i === -1) return;
    const id = this.slots[i], g = this.game, inv = this.inv;
    this.flash(i);
    if (!id) { g.addLog(`Atalho [${key}] vazio. Arraste um item da mochila [I] para cá.`, 'tip'); return; }
    if (id === 'dice') { window.diceSystem.rollD20('Iniciativa de Ação', 2, 12); return; }
    const item = inv.itemDB[id];
    if (item.type === 'material') { g.addLog(`${item.icon} ${item.name} é material (não se usa). No atalho [${key}] ele só mostra quanto você tem: ${this.count(id)}.`, 'tip'); return; }
    // arma / tocha na mao: guarda
    if ((item.type === 'weapon' || item.type === 'offhand') && this.equipped(id)) { inv.unequipItem(item.equipType); this.render(); return; }
    const idx = inv.slots.findIndex(s => s && s.id === id);
    if (idx === -1) {
      g.addLog(id === 'fire_sword' ? `Você não tem a Lâmina Flamejante. Ela nasce de uma Espada de Aço com o Pergaminho de Encantamento.` : `Você não tem ${item.name} na mochila.`, 'warning');
      return;
    }
    inv.useItem(idx);
    this.render();
  }
  flash(i) {
    if (!this.el) return;
    this.el.querySelectorAll('.slot').forEach(s => s.classList.remove('active'));
    const s = this.el.querySelector(`.slot[data-i="${i}"]`); if (s) s.classList.add('active');
  }

  // ---------------- desenho ----------------
  render() {
    if (!this.el || !this.inv) return;
    if (!this.el.dataset.built) this.build();
    this.slots.forEach((id, i) => {
      const s = this.el.querySelector(`.slot[data-i="${i}"]`); if (!s) return;
      const a = id && Hotbar.ACTIONS[id], item = id && this.inv.itemDB[id];
      const icon = s.querySelector('.slot-icon'), cnt = s.querySelector('.slot-count'), tip = s.querySelector('.slot-tooltip');
      s.classList.toggle('empty', !id);
      if (a) { icon.textContent = a.icon; cnt.textContent = '∞'; tip.textContent = a.name; s.classList.remove('dim', 'equipped'); return; }
      if (!item) { icon.textContent = ''; cnt.textContent = ''; tip.textContent = 'Vazio — arraste um item da mochila'; s.classList.remove('dim', 'equipped'); return; }
      const n = this.count(id), eq = this.equipped(id);
      icon.textContent = item.icon;
      cnt.textContent = eq ? '✋' : (n > 1 || item.type === 'consumable' ? n : (n ? '' : '0'));
      tip.textContent = `${item.name}${eq ? ' (na mão — tecla guarda)' : ''}`;
      s.classList.toggle('dim', !n && !eq);
      s.classList.toggle('equipped', eq);
    });
  }
  build() {
    this.el.dataset.built = '1';
    this.el.innerHTML = Hotbar.KEYS.map((k, i) => `<div class="slot" data-i="${i}" data-slot="${k}"><span class="slot-num">${k}</span><span class="slot-icon"></span><span class="slot-count"></span><span class="slot-tooltip"></span></div>`).join('');
    this.el.querySelectorAll('.slot').forEach(s => {
      const i = +s.dataset.i;
      s.addEventListener('click', () => this.use(Hotbar.KEYS[i]));
      s.addEventListener('contextmenu', (e) => { e.preventDefault(); if (this.slots[i]) { this.set(i, null); this.game.addLog(`Atalho [${Hotbar.KEYS[i]}] limpo.`, 'tip'); } });
      // arrastar: do slot para outro slot (troca) ou de um item da mochila para o slot
      s.draggable = true;
      s.addEventListener('dragstart', (e) => { if (!this.slots[i]) { e.preventDefault(); return; } e.dataTransfer.setData('text/suritto', JSON.stringify({ from: 'hotbar', i })); e.dataTransfer.effectAllowed = 'move'; });
      s.addEventListener('dragover', (e) => { e.preventDefault(); s.classList.add('drop-target'); });
      s.addEventListener('dragleave', () => s.classList.remove('drop-target'));
      s.addEventListener('drop', (e) => {
        e.preventDefault(); s.classList.remove('drop-target');
        let d; try { d = JSON.parse(e.dataTransfer.getData('text/suritto') || 'null'); } catch (err) { d = null; }
        if (!d) return;
        if (d.from === 'hotbar') { const t = this.slots[i]; this.slots[i] = this.slots[d.i]; this.slots[d.i] = t; }
        else if (d.id) {
          const old = this.slots.indexOf(d.id); if (old !== -1 && old !== i) this.slots[old] = null;   // o mesmo item nao fica em dois atalhos
          this.slots[i] = d.id;
          this.game.addLog(`${this.inv.itemDB[d.id].icon} ${this.inv.itemDB[d.id].name} no atalho [${Hotbar.KEYS[i]}].`, 'tip');
        }
        this.render(); this.inv.renderUI();
      });
    });
  }
}
window.Hotbar = Hotbar;
