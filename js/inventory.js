// inventory.js - Interactive Dark Fantasy Grid Inventory & Equipment System
class InventorySystem {
  constructor(game) {
    this.game = game;
    this.maxSlots = 20; // 5 columns x 4 rows
    this.slots = new Array(this.maxSlots).fill(null);
    this.equipment = {
      weapon: 'sword',
      offhand: null,
      armor: null
    };
    this.coins = 75;
    this.selectedSlot = null;
    this.isOpen = false;

    // Item Catalog / Database
    this.itemDB = {
      fruit: {
        id: 'fruit',
        name: 'Fruto Silvestre',
        type: 'consumable',
        rarity: 'common',
        icon: '🍎',
        maxStack: 20,
        desc: 'Fruto fresco colhido das copas dos carvalhos ancestrais. Restaura vida e saciedade.',
        stats: '+15 HP, +20% Nutrição',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 15);
          g.player.hunger = Math.min(100, g.player.hunger + 20);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`🍎 Você consumiu um Fruto Silvestre! (+15 HP, +20% Nutrição)`, 'action');
        }
      },
      meat: {
        id: 'meat',
        name: 'Carne de Caça',
        type: 'consumable',
        rarity: 'common',
        icon: '🥩',
        maxStack: 15,
        desc: 'Carne fresca e nutritiva obtida através da caça e esfolamento de cervos. Asse na fogueira para obter benefícios épicos.',
        stats: '+35 HP, +45% Nutrição',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 35);
          g.player.hunger = Math.min(100, g.player.hunger + 45);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`🥩 Você devorou Carne de Caça Fresca! (+35 HP, +45% Nutrição)`, 'action');
        }
      },
      cooked_meat: {
        id: 'cooked_meat',
        name: 'Carne Grelhada Suculenta',
        type: 'consumable',
        rarity: 'uncommon',
        icon: '🍖',
        maxStack: 15,
        desc: 'Carne de caça assada lentamente na brasa da fogueira. Revitaliza o corpo e fortalece os músculos com vigor de combate.',
        stats: '+65 HP, +80% Nutrição • Buff: +3 Força (60s)',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 65);
          g.player.hunger = Math.min(100, g.player.hunger + 80);
          g.player.stamina = Math.min(g.player.maxStamina, (g.player.stamina || 0) + 50);
          g.player.isExhausted = false;
          g.player.strengthBuffTimer = 60; // 60 seconds buff
          if (window.sounds) window.sounds.playHarvest();
          g.spawnDamageText(g.player.x, g.player.y - 45, '+65 HP • +50 Estamina!', '#51cf66', 18);
          g.addLog(`🍖 Você saboreou a Carne Grelhada! (+65 HP, +50 Estamina, +80% Nutrição, +3 Força por 60s)!`, 'action');
        }
      },
      potion_heal: {
        id: 'potion_heal',
        name: 'Poção de Cura Menor',
        type: 'consumable',
        rarity: 'uncommon',
        icon: '🧪',
        maxStack: 10,
        desc: 'Destilado alquímico de ervas medicinais da floresta.',
        stats: '+40 HP Instantâneo',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 40);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`🧪 Você bebeu uma Poção de Cura Menor! (+40 HP)`, 'action');
        }
      },
      potion_mana: {
        id: 'potion_mana',
        name: 'Elixir de Mana',
        type: 'consumable',
        rarity: 'uncommon',
        icon: '💧',
        maxStack: 10,
        desc: 'Extrato cristalino que recarrega as energias arcanas do aventureiro.',
        stats: '+30 MP Instantâneo',
        useEffect: (g) => {
          g.player.mana = Math.min(g.player.maxMana, g.player.mana + 30);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`💧 Você bebeu um Elixir de Mana! (+30 MP)`, 'action');
        }
      },
      sword: {
        id: 'sword',
        name: 'Espada de Aço Forjada',
        type: 'weapon',
        rarity: 'common',
        icon: '🗡️',
        maxStack: 1,
        desc: 'Lâmina afiada forjada com aço temperado. Ataque ágil em arco.',
        stats: 'Dano: +3 • D20 Mod: +2 Força',
        equipType: 'weapon',
        equipId: 'sword'
      },
      axe: {
        id: 'axe',
        name: 'Machado de Lenhador',
        type: 'weapon',
        rarity: 'common',
        icon: '🪓',
        maxStack: 1,
        desc: 'Ferramenta robusta para desbastar madeira e desferir golpes pesados.',
        stats: 'Dano: +2 • Colheita de Madeira',
        equipType: 'weapon',
        equipId: 'axe'
      },
      fire_sword: {
        id: 'fire_sword',
        name: 'Lâmina Flamejante +16',
        type: 'weapon',
        rarity: 'legendary',
        icon: '⚔️',
        maxStack: 1,
        desc: 'Lâmina lendária encantada no D20 com Fogo Sagrado de Lineage 2. Emite calor e luz contínua.',
        stats: 'Dano: +8 • Iluminação Noturna 360° • Dobro de Dano em Feras',
        equipType: 'weapon',
        equipId: 'fire_sword'
      },
      torch: {
        id: 'torch',
        name: 'Tocha de Resina',
        type: 'offhand',
        rarity: 'common',
        icon: '🔥',
        maxStack: 5,
        desc: 'Tocha de breu e madeira. Dissipa a escuridão da noite e amedronta os lobos da floresta.',
        stats: 'Iluminação 175px • Afasta Lobos',
        equipType: 'offhand',
        equipId: 'torch'
      },
      scroll_enchant: {
        id: 'scroll_enchant',
        name: 'Pergaminho de Encantamento',
        type: 'consumable',
        rarity: 'rare',
        icon: '📜',
        maxStack: 5,
        desc: 'Pergaminho místico arcano. Rola um teste D20 arriscado para imbuir a espada com chamas eternas (+16).',
        stats: 'Encantamento D20 • Risco Mágico',
        useEffect: (g) => {
          // so encanta uma Espada de Aco que voce tenha (na mao ou na mochila)
          const inv = g.inventory, inHand = inv.equipment.weapon === 'sword';
          if (!inHand && inv.slots.findIndex(s => s && s.id === 'sword') === -1) {
            g.addLog(`📜 O pergaminho precisa de uma Espada de Aço para encantar (na mão ou na mochila).`, 'warning');
            return false;
          }
          g.addLog(`📜 Você abriu o Pergaminho de Encantamento Ancestral...`, 'system');
          window.diceSystem.rollD20('Encantamento de Arma (Lineage 2)', 3, 12, (res) => {
            if (res.isSuccess) {
              if (inv.equipment.weapon === 'sword') inv.equipItemDirect('weapon', 'fire_sword', true);     // a espada vira a lamina
              else {
                const si = inv.slots.findIndex(s => s && s.id === 'sword');
                if (si === -1) { g.addLog(`📜 A espada sumiu antes da magia terminar. O encantamento se perdeu.`, 'warning'); return; }
                inv.removeItem(si, 1); inv.equipItemDirect('weapon', 'fire_sword');
              }
              if (window.sounds) {
                window.sounds.playCritSuccess();
                window.sounds.playThunder();
              }
              g.addLog(`★ SUCESSO LENDÁRIO! A lâmina foi envolvida por Chamas Eternas (+16) com fogo sagrado!`, 'action');
              for (let k = 0; k < 30; k++) {
                g.particles.push({
                  x: g.player.x + (Math.random() - 0.5) * 60,
                  y: g.player.y - 20 + (Math.random() - 0.5) * 60,
                  vx: (Math.random() - 0.5) * 120,
                  vy: -Math.random() * 100 - 30,
                  life: 1.2,
                  maxLife: 1.2,
                  color: '#ff922b',
                  size: Math.random() * 6 + 3
                });
              }
            } else {
              if (window.sounds) window.sounds.playCritFail();
              g.addLog(`☠ O poder do pergaminho falhou... Mas a lâmina sobreviveu intacta.`, 'warning');
            }
          });
        }
      },
      wolf_pelt: {
        id: 'wolf_pelt',
        name: 'Pele de Lobo Feroz',
        type: 'material',
        rarity: 'rare',
        icon: '🐺',
        maxStack: 10,
        desc: 'Pele espessa e macia de um predador da floresta. Excelente isolante térmico para forja de armaduras.',
        stats: 'Material Raro • Valor: 25 Moedas'
      },
      wolf_tooth: {
        id: 'wolf_tooth',
        name: 'Dente Canino de Lobo',
        type: 'material',
        rarity: 'common',
        icon: '🦷',
        maxStack: 20,
        desc: 'Dente pontiagudo e afiado retirado de um lobo abatido.',
        stats: 'Material de Amuleto • Valor: 5 Moedas'
      },
      berries: {
        id: 'berries',
        name: 'Frutinhas Silvestres',
        type: 'consumable',
        rarity: 'common',
        icon: '🫐',
        maxStack: 30,
        desc: 'Amoras e mirtilos colhidos dos arbustos da mata. Os ursos e javalis disputam cada galho.',
        stats: '+8 HP, +12% Nutrição',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 8);
          g.player.hunger = Math.min(100, g.player.hunger + 12);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`🫐 Você comeu um punhado de Frutinhas Silvestres! (+8 HP, +12% Nutrição)`, 'action');
        }
      },
      mushroom: {
        id: 'mushroom',
        name: 'Cogumelo da Mata',
        type: 'consumable',
        rarity: 'common',
        icon: '🍄',
        maxStack: 20,
        desc: 'Cogumelo carnudo da mata fechada, a comida preferida dos javalis. Melhor assado.',
        stats: '+5 HP, +15% Nutrição',
        useEffect: (g) => {
          g.player.hp = Math.min(g.player.maxHp, g.player.hp + 5);
          g.player.hunger = Math.min(100, g.player.hunger + 15);
          if (window.sounds) window.sounds.playHarvest();
          g.addLog(`🍄 Você comeu um Cogumelo da Mata! (+5 HP, +15% Nutrição)`, 'action');
        }
      },
      rabbit_fur: {
        id: 'rabbit_fur',
        name: 'Pelo de Coelho',
        type: 'material',
        rarity: 'common',
        icon: '🐇',
        maxStack: 20,
        desc: 'Pelo macio e quente. Bom para forrar luvas e capuzes.',
        stats: 'Material de Costura • Valor: 4 Moedas'
      },
      fox_pelt: {
        id: 'fox_pelt',
        name: 'Pele de Raposa',
        type: 'material',
        rarity: 'uncommon',
        icon: '🦊',
        maxStack: 10,
        desc: 'Pele avermelhada de raposa, muito procurada pelos peleteiros das vilas.',
        stats: 'Material de Costura • Valor: 18 Moedas'
      },
      boar_tusk: {
        id: 'boar_tusk',
        name: 'Presa de Javali',
        type: 'material',
        rarity: 'uncommon',
        icon: '🐗',
        maxStack: 20,
        desc: 'Presa curva e afiada de um javali adulto. Usada em amuletos de caçador.',
        stats: 'Material de Amuleto • Valor: 10 Moedas'
      },
      bear_pelt: {
        id: 'bear_pelt',
        name: 'Pele de Urso',
        type: 'material',
        rarity: 'rare',
        icon: '🐻',
        maxStack: 5,
        desc: 'Pele pesada do senhor da mata. Prova de coragem e o melhor isolante contra o frio.',
        stats: 'Material Épico • Valor: 80 Moedas'
      },
      deer_hide: {
        id: 'deer_hide',
        name: 'Couro de Cervo Silvestre',
        type: 'material',
        rarity: 'common',
        icon: '🦌',
        maxStack: 10,
        desc: 'Couro flexível e resistente obtido através da esfoliação da caça.',
        stats: 'Material de Costura • Valor: 12 Moedas'
      },
      bone: {
        id: 'bone',
        name: 'Ossos de Animal Secos',
        type: 'material',
        rarity: 'common',
        icon: '🦴',
        maxStack: 30,
        desc: 'Ossos limpos pelo tempo e pelo solo da floresta.',
        stats: 'Material Básico • Valor: 2 Moedas'
      },
      wood: {
        id: 'wood',
        name: 'Toras de Carvalho',
        type: 'consumable',
        rarity: 'common',
        icon: '🪵',
        maxStack: 40,
        desc: 'Madeira densa cortada das árvores ancestrais com o machado. Use 2 toras para acender uma fogueira de acampamento!',
        stats: 'Construção: Fogueira (2x Madeira)',
        useEffect: (g) => {
          g.buildCampfire();
        }
      },
      stone: {
        id: 'stone',
        name: 'Pedra',
        type: 'material',
        rarity: 'common',
        icon: '🪨',
        maxStack: 60,
        desc: 'Blocos de pedra bruta para erguer muros, arcos e portais.',
        stats: 'Material de Construção • Demolir devolve 80%'
      },
      resin: {
        id: 'resin',
        name: 'Resina de Carvalho',
        type: 'material',
        rarity: 'common',
        icon: '🍯',
        maxStack: 20,
        desc: 'Resina aromática e inflamável colhida da casca dos troncos. Combustível essencial.',
        stats: 'Material Inflamável • Valor: 8 Moedas'
      },
      campfire_kit: {
        id: 'campfire_kit',
        name: 'Fogueira de Acampamento',
        type: 'consumable',
        rarity: 'uncommon',
        icon: '🔥',
        maxStack: 5,
        desc: 'Kit de acampamento com pedras de contenção e madeira empilhada. Acende fogo protetor que espanta lobos e permite assar carnes.',
        stats: 'Luz + Repelente de Feras + Cozinha',
        useEffect: (g) => {
          g.buildCampfire();
        }
      }
    };

    this.initStartingItems();
  }

  initStartingItems() {
    // Populate starting adventure gear
    this.addItem('fruit', 4);
    this.addItem('meat', 2);
    this.addItem('wood', 4);
    this.addItem('stone', 24); // TEMPORARIO (F7): lote inicial de pedra ate existir mineracao
    this.addItem('potion_heal', 1);
    this.addItem('potion_mana', 1);
    this.addItem('axe', 1);
    this.addItem('torch', 2);
    this.addItem('scroll_enchant', 1);
    this.addItem('deer_hide', 1);
  }

  init() {
    this.createUIElements();
    this.setupListeners();
    this.renderUI();
  }

  createUIElements() {
    // Modal Overlay Container
    const modal = document.createElement('div');
    modal.id = 'inventory-modal';
    modal.className = 'inventory-modal';
    modal.style.display = 'none';

    modal.innerHTML = `
      <div class="inv-window">
        <!-- Header -->
        <div class="inv-header">
          <div class="inv-title-row">
            <span class="inv-icon">🎒</span>
            <span class="inv-title">Mochila do Aventureiro</span>
            <span class="inv-capacity" id="inv-capacity">0 / 20</span>
          </div>
          <button class="inv-close-btn" id="inv-close-btn" title="Fechar (I ou B)">✕</button>
        </div>

        <div class="inv-body">
          <!-- Left Column: Equipment Paperdoll -->
          <div class="inv-equip-col">
            <div class="equip-title">Equipamento</div>
            <div class="equip-slots">
              <div class="equip-slot" id="equip-weapon" data-type="weapon" title="Mão Direita: Arma">
                <span class="equip-type-label">Arma</span>
                <span class="equip-icon" id="equip-icon-weapon">🗡️</span>
              </div>
              <div class="equip-slot" id="equip-offhand" data-type="offhand" title="Mão Esquerda: Tocha / Escudo">
                <span class="equip-type-label">Luz/Sec.</span>
                <span class="equip-icon" id="equip-icon-offhand">∅</span>
              </div>
              <div class="equip-slot" id="equip-armor" data-type="armor" title="Peitoral: Armadura">
                <span class="equip-type-label">Peitoral</span>
                <span class="equip-icon" id="equip-icon-armor">🛡️</span>
              </div>
            </div>
            <!-- Wallet -->
            <div class="inv-wallet">
              <span class="coin-icon">🪙</span>
              <span class="coin-amount" id="inv-coins">${this.coins} Moedas</span>
            </div>
          </div>

          <!-- Center Column: 20-Slot Grid -->
          <div class="inv-grid-col">
            <div class="grid-header">
              <span>Compartimentos da Mochila (20 Slots)</span>
              <button class="inv-sort-btn" id="btn-inv-sort" title="Junta pilhas iguais e agrupa por tipo">⇅ Organizar</button>
            </div>
            <div class="inv-help">Arraste para mover • Arraste para a barra 1–0 = atalho • Botão direito = usar/equipar • Shift+clique = dividir pilha</div>
            <div class="inv-grid" id="inv-grid">
              <!-- 20 slots dynamically injected -->
            </div>
          </div>
        </div>

        <!-- Bottom Detail & Action Footer -->
        <div class="inv-footer" id="inv-footer">
          <div class="inv-item-preview" id="inv-preview">
            <div class="preview-icon-box" id="preview-icon">📦</div>
            <div class="preview-details">
              <div class="preview-name" id="preview-name">Selecione um Item</div>
              <div class="preview-stats" id="preview-stats">Clique em um compartimento para ver detalhes</div>
              <div class="preview-desc" id="preview-desc">Passe o mouse ou clique para inspecionar, equipar, usar ou descartar.</div>
            </div>
          </div>
          <div class="inv-actions">
            <button class="inv-action-btn btn-use" id="btn-inv-use" disabled>⚡ Usar / Equipar</button>
            <button class="inv-action-btn btn-drop" id="btn-inv-drop" disabled>🗑️ Descartar</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('game-container').appendChild(modal);

    // Floating Backpack Button in HUD (Top Right or near Hotbar)
    const floatBtn = document.createElement('button');
    floatBtn.id = 'hud-backpack-btn';
    floatBtn.className = 'hud-backpack-btn';
    floatBtn.innerHTML = `<span>🎒</span><small>Mochila [I]</small>`;
    floatBtn.title = 'Abrir Mochila (Tecla I ou B)';
    document.getElementById('game-container').appendChild(floatBtn);
  }

  setupListeners() {
    // Keybinds: 'I' and 'B' toggle inventory
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'i' || key === 'b') {
        this.toggle();
      }
      if (key === 'escape' && this.isOpen) {
        this.close();
      }
    });

    // Close button
    const closeBtn = document.getElementById('inv-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Floating backpack button
    const floatBtn = document.getElementById('hud-backpack-btn');
    if (floatBtn) floatBtn.addEventListener('click', () => this.toggle());

    // Use / Equip button
    const useBtn = document.getElementById('btn-inv-use');
    if (useBtn) {
      useBtn.addEventListener('click', () => {
        if (this.selectedSlot !== null) {
          this.useItem(this.selectedSlot);
        }
      });
    }

    // Drop button
    const dropBtn = document.getElementById('btn-inv-drop');
    if (dropBtn) {
      dropBtn.addEventListener('click', () => {
        if (this.selectedSlot !== null) {
          this.dropItem(this.selectedSlot);
        }
      });
    }

    const sortBtn = document.getElementById('btn-inv-sort');
    if (sortBtn) sortBtn.addEventListener('click', () => this.sortItems());

    // Equipment slot clicks (unequip); arrastar da mochila equipa, arrastar para a mochila guarda
    const equipSlots = document.querySelectorAll('.equip-slot');
    equipSlots.forEach(el => {
      const type = el.getAttribute('data-type');
      el.addEventListener('click', () => this.unequipItem(type));
      el.draggable = true;
      el.addEventListener('dragstart', (e) => { if (!this.equipment[type]) { e.preventDefault(); return; } e.dataTransfer.setData('text/suritto', JSON.stringify({ from: 'equip', type })); });
      el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drop-target'); });
      el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
      el.addEventListener('drop', (e) => {
        e.preventDefault(); el.classList.remove('drop-target');
        const d = this._drag(e); if (!d || d.from !== 'bag') return;
        const item = this.itemDB[this.slots[d.idx] && this.slots[d.idx].id];
        if (!item || item.equipType !== type) { this.game.addLog(`Esse item não vai nesse lugar.`, 'warning'); return; }
        this.useItem(d.idx);
      });
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    const modal = document.getElementById('inventory-modal');
    if (modal) modal.style.display = 'flex';
    document.body.classList.add('inv-open');          // a barra de atalhos fica por cima (sem desfoque) para receber os itens
    this.renderUI();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('inventory-modal');
    if (modal) modal.style.display = 'none';
    document.body.classList.remove('inv-open');
    this.selectedSlot = null;
  }

  addItem(itemId, count = 1) {
    const itemData = this.itemDB[itemId];
    if (!itemData) return false;

    // 1. Try to stack with existing slots
    if (itemData.maxStack > 1) {
      for (let i = 0; i < this.maxSlots; i++) {
        const slot = this.slots[i];
        if (slot && slot.id === itemId && slot.count < itemData.maxStack) {
          const space = itemData.maxStack - slot.count;
          const add = Math.min(space, count);
          slot.count += add;
          count -= add;
          if (count <= 0) {
            this.syncGamePlayerInventory();
            this.renderUI();
            return true;
          }
        }
      }
    }

    // 2. Put into first empty slot
    while (count > 0) {
      const emptyIdx = this.slots.findIndex(s => s === null);
      if (emptyIdx === -1) {
        this.game.addLog(`⚠️ Mochila cheia! Não há mais espaço para coletar itens.`, 'warning');
        return false;
      }

      const add = Math.min(itemData.maxStack, count);
      this.slots[emptyIdx] = {
        id: itemId,
        count: add
      };
      count -= add;
    }

    this.syncGamePlayerInventory();
    this.renderUI();
    return true;
  }

  removeItem(slotIdx, count = 1) {
    const slot = this.slots[slotIdx];
    if (!slot) return false;

    slot.count -= count;
    if (slot.count <= 0) {
      this.slots[slotIdx] = null;
      if (this.selectedSlot === slotIdx) this.selectedSlot = null;
    }

    this.syncGamePlayerInventory();
    this.renderUI();
    return true;
  }

  useItem(slotIdx) {
    const slot = this.slots[slotIdx];
    if (!slot) return;
    const itemData = this.itemDB[slot.id];
    if (!itemData) return;

    // If it's equipment (weapon or offhand):
    if (itemData.type === 'weapon' || itemData.type === 'offhand') {
      const targetType = itemData.equipType; // 'weapon' or 'offhand'
      const oldEquipId = this.equipment[targetType];

      // Equip new item
      this.equipment[targetType] = itemData.equipId;
      this.removeItem(slotIdx, 1);

      // Put old item back into inventory if there was one
      if (oldEquipId && this.itemDB[oldEquipId]) {
        this.addItem(oldEquipId, 1);
      }

      // Apply to game player state
      if (targetType === 'weapon') {
        this.game.player.equippedWeapon = itemData.equipId;
      } else if (targetType === 'offhand' && itemData.equipId === 'torch') {
        this.game.player.torchLit = true;
      }

      if (window.sounds) window.sounds.playSwordSlash();
      this.game.addLog(`⚔️ Você equipou: <b>${itemData.name}</b>!`, 'action');
    } 
    // If it's consumable:
    else if (itemData.type === 'consumable') {
      // useEffect pode devolver false para nao gastar o item (ex.: pergaminho sem espada para encantar)
      if (itemData.useEffect && itemData.useEffect(this.game) === false) { this.renderUI(); return; }
      this.removeItem(slotIdx, 1);
    }

    this.syncGamePlayerInventory();
    this.renderUI();
  }

  // Equipa sem passar pela mochila. A arma que estava na mao volta para a mochila (antes sumia),
  // a menos que consumeOld (ex.: o encantamento transforma a espada na lamina flamejante).
  _drag(e) { try { return JSON.parse(e.dataTransfer.getData('text/suritto') || 'null'); } catch (err) { return null; } }

  // Move um compartimento para outro: junta pilhas do mesmo item (ate o maximo), senao troca de lugar
  moveSlot(from, to) {
    if (from === to) return;
    const a = this.slots[from], b = this.slots[to]; if (!a) return;
    if (b && b.id === a.id) {
      const max = this.itemDB[a.id].maxStack || 1, add = Math.min(max - b.count, a.count);
      b.count += add; a.count -= add; if (a.count <= 0) this.slots[from] = null;
    } else { this.slots[to] = a; this.slots[from] = b || null; }
    if (this.selectedSlot === from) this.selectedSlot = to;
    if (window.sounds) window.sounds.playUIClick?.();
    this.syncGamePlayerInventory(); this.renderUI();
  }

  // Divide uma pilha ao meio num compartimento vazio
  splitSlot(idx) {
    const s = this.slots[idx]; if (!s || s.count < 2) return;
    const empty = this.slots.findIndex(x => x === null);
    if (empty === -1) { this.game.addLog(`Mochila cheia: não há compartimento livre para dividir a pilha.`, 'warning'); return; }
    const half = Math.floor(s.count / 2); s.count -= half; this.slots[empty] = { id: s.id, count: half };
    this.renderUI();
  }

  // Junta pilhas iguais e ordena: armas e luz, consumiveis, materiais (e por nome)
  sortItems() {
    const total = {};
    for (const s of this.slots) if (s) total[s.id] = (total[s.id] || 0) + s.count;
    const order = { weapon: 0, offhand: 1, consumable: 2, material: 3 };
    const ids = Object.keys(total).sort((x, y) => {
      const a = this.itemDB[x], b = this.itemDB[y];
      return ((order[a.type] ?? 9) - (order[b.type] ?? 9)) || a.name.localeCompare(b.name, 'pt-BR');
    });
    const out = [];
    for (const id of ids) { let n = total[id]; const max = this.itemDB[id].maxStack || 1; while (n > 0) { const c = Math.min(max, n); out.push({ id, count: c }); n -= c; } }
    this.slots = new Array(this.maxSlots).fill(null).map((_, i) => out[i] || null);
    this.selectedSlot = null;
    if (window.sounds) window.sounds.playRustle();
    this.game.addLog(`🎒 Mochila organizada.`, 'tip');
    this.syncGamePlayerInventory(); this.renderUI();
  }

  equipItemDirect(equipType, itemId, consumeOld = false) {
    const old = this.equipment[equipType];
    if (old && old !== itemId && !consumeOld && this.itemDB[old] && !this.addItem(old, 1)) {
      this.game.addLog(`Mochila cheia: não há espaço para guardar o item que estava na mão.`, 'warning');
      return false;
    }
    this.equipment[equipType] = itemId;
    if (equipType === 'weapon') {
      this.game.player.equippedWeapon = itemId;
    }
    this.renderUI();
  }

  unequipItem(equipType) {
    const currentId = this.equipment[equipType];
    if (!currentId) return;

    // Try to move back to backpack
    const added = this.addItem(currentId, 1);
    if (added) {
      this.equipment[equipType] = null;
      if (equipType === 'weapon') {
        this.game.player.equippedWeapon = null;
        this.game.addLog(`Mãos livres. Arma desequipada.`, 'tip');
      } else if (equipType === 'offhand') {
        this.game.player.torchLit = false;
        this.game.addLog(`Tocha guardada na mochila.`, 'tip');
      }
      if (window.sounds) window.sounds.playRustle();
      this.renderUI();
    }
  }

  dropItem(slotIdx) {
    const slot = this.slots[slotIdx];
    if (!slot) return;
    const itemData = this.itemDB[slot.id];

    // Spawn item drop on ground in world
    if (slot.id === 'fruit') {
      this.game.fruitsOnGround.push({
        x: this.game.player.x + (Math.random() - 0.5) * 30,
        y: this.game.player.y + (Math.random() - 0.5) * 30,
        bounceY: 0,
        life: 180
      });
    }

    this.game.addLog(`Você descartou 1x <b>${itemData.name}</b> no chão.`, 'tip');
    this.removeItem(slotIdx, 1);
    this.renderUI();
  }

  syncGamePlayerInventory() {
    // Keep game.player.inventory synchronized with backpack
    let fruitCount = 0;
    let meatCount = 0;
    let potCount = 0;
    let manaCount = 0;

    for (const slot of this.slots) {
      if (!slot) continue;
      if (slot.id === 'fruit') fruitCount += slot.count;
      if (slot.id === 'meat') meatCount += slot.count;
      if (slot.id === 'potion_heal') potCount += slot.count;
      if (slot.id === 'potion_mana') manaCount += slot.count;
    }

    this.game.player.inventory.fruit = fruitCount;
    this.game.player.inventory.meat = meatCount;
    this.game.player.inventory.potions = potCount;
    this.game.player.inventory.manaPotions = manaCount;

    this.game.updateHUD();
  }

  renderUI() {
    const gridEl = document.getElementById('inv-grid');
    if (!gridEl) return;

    // Render 20 Slots
    gridEl.innerHTML = '';
    let usedSlots = 0;

    for (let i = 0; i < this.maxSlots; i++) {
      const slot = this.slots[i];
      const slotEl = document.createElement('div');
      slotEl.className = 'inv-slot';
      slotEl.setAttribute('data-slot-idx', i);

      if (slot) {
        usedSlots++;
        const item = this.itemDB[slot.id];
        slotEl.classList.add(`rarity-${item.rarity}`);

        const hk = this.game.hotbar && this.game.hotbar.keyOf(slot.id);
        slotEl.innerHTML = `
          <span class="slot-item-icon">${item.icon}</span>
          ${slot.count > 1 ? `<span class="slot-item-badge">x${slot.count}</span>` : ''}
          ${hk ? `<span class="slot-hotkey" title="No atalho [${hk}]">${hk}</span>` : ''}
        `;
        slotEl.draggable = true;
        slotEl.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/suritto', JSON.stringify({ from: 'bag', idx: i, id: slot.id }));
          e.dataTransfer.effectAllowed = 'move';
          slotEl.classList.add('dragging');
        });
        slotEl.addEventListener('dragend', () => slotEl.classList.remove('dragging'));
        slotEl.addEventListener('mouseenter', () => { if (this.selectedSlot === null) this.showPreview(i); });
      } else {
        slotEl.classList.add('empty');
      }

      if (this.selectedSlot === i) {
        slotEl.classList.add('selected');
      }

      // Slot Click (Shift+clique divide a pilha)
      slotEl.addEventListener('click', (e) => {
        if (e.shiftKey && slot) { this.splitSlot(i); return; }
        this.selectedSlot = i;
        this.renderUI();
      });
      // Botao direito: usa / equipa (como no WoW)
      slotEl.addEventListener('contextmenu', (e) => { e.preventDefault(); if (slot) this.useItem(i); });
      // Soltar aqui: item de outro compartimento, ou o item que estava equipado (guarda)
      slotEl.addEventListener('dragover', (e) => { e.preventDefault(); slotEl.classList.add('drop-target'); });
      slotEl.addEventListener('dragleave', () => slotEl.classList.remove('drop-target'));
      slotEl.addEventListener('drop', (e) => {
        e.preventDefault(); slotEl.classList.remove('drop-target');
        const d = this._drag(e); if (!d) return;
        if (d.from === 'bag') this.moveSlot(d.idx, i);
        else if (d.from === 'equip') this.unequipItem(d.type);
      });

      // Double-click to quick use/equip
      slotEl.addEventListener('dblclick', () => {
        this.useItem(i);
      });

      gridEl.appendChild(slotEl);
    }

    // Capacity text
    const capEl = document.getElementById('inv-capacity');
    if (capEl) capEl.innerText = `${usedSlots} / ${this.maxSlots}`;

    // Equipment Paperdoll
    const wIcon = document.getElementById('equip-icon-weapon');
    if (wIcon) {
      const wId = this.equipment.weapon;
      wIcon.innerText = wId && this.itemDB[wId] ? this.itemDB[wId].icon : '🗡️';
      wIcon.style.opacity = wId ? '1.0' : '0.35';
    }

    const oIcon = document.getElementById('equip-icon-offhand');
    if (oIcon) {
      const oId = this.equipment.offhand;
      oIcon.innerText = oId && this.itemDB[oId] ? this.itemDB[oId].icon : '🔥';
      oIcon.style.opacity = oId ? '1.0' : '0.35';
    }

    // Selected Item Detail Card
    const previewName = document.getElementById('preview-name');
    const previewStats = document.getElementById('preview-stats');
    const previewDesc = document.getElementById('preview-desc');
    const previewIcon = document.getElementById('preview-icon');
    const useBtn = document.getElementById('btn-inv-use');
    const dropBtn = document.getElementById('btn-inv-drop');

    if (this.selectedSlot !== null && this.slots[this.selectedSlot]) {
      const selSlot = this.slots[this.selectedSlot];
      const item = this.itemDB[selSlot.id];

      previewName.innerHTML = `<span class="rarity-badge ${item.rarity}">${item.rarity.toUpperCase()}</span> ${item.name}`;
      previewStats.innerText = item.stats || 'Sem atributos especiais';
      previewDesc.innerText = item.desc;
      previewIcon.innerText = item.icon;
      previewIcon.className = `preview-icon-box rarity-${item.rarity}`;

      useBtn.disabled = false;
      dropBtn.disabled = false;
      useBtn.innerText = item.type === 'weapon' || item.type === 'offhand' ? '⚔️ Equipar' : '⚡ Usar';
    } else {
      previewName.innerText = 'Nenhum Item Selecionado';
      previewStats.innerText = 'Clique em um compartimento da mochila';
      previewDesc.innerText = 'Pressione [ I ] ou [ B ] para abrir e fechar a mochila a qualquer momento.';
      previewIcon.innerText = '📦';
      previewIcon.className = 'preview-icon-box';
      useBtn.disabled = true;
      dropBtn.disabled = true;
      useBtn.innerText = '⚡ Usar / Equipar';
    }
    if (this.game.hotbar) this.game.hotbar.render();
  }

  // Detalhe do item ao passar o mouse (sem selecionar)
  showPreview(i) {
    const s = this.slots[i]; if (!s) return;
    const item = this.itemDB[s.id], hk = this.game.hotbar && this.game.hotbar.keyOf(s.id);
    document.getElementById('preview-name').innerHTML = `<span class="rarity-badge ${item.rarity}">${item.rarity.toUpperCase()}</span> ${item.name}${hk ? ` <span class="preview-hotkey">atalho [${hk}]</span>` : ''}`;
    document.getElementById('preview-stats').innerText = item.stats || 'Sem atributos especiais';
    document.getElementById('preview-desc').innerText = item.desc;
    const ic = document.getElementById('preview-icon'); ic.innerText = item.icon; ic.className = `preview-icon-box rarity-${item.rarity}`;
  }
}
