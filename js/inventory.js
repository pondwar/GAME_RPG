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
          g.addLog(`📜 Você abriu o Pergaminho de Encantamento Ancestral...`, 'system');
          window.diceSystem.rollD20('Encantamento de Arma (Lineage 2)', 3, 12, (res) => {
            if (res.isSuccess) {
              g.inventory.equipItemDirect('weapon', 'fire_sword');
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
              <span class="inv-shortcut-hint">Pressione [ I ] ou [ B ]</span>
            </div>
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

    // Equipment slot clicks (unequip)
    const equipSlots = document.querySelectorAll('.equip-slot');
    equipSlots.forEach(el => {
      el.addEventListener('click', () => {
        const type = el.getAttribute('data-type');
        this.unequipItem(type);
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
    this.renderUI();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('inventory-modal');
    if (modal) modal.style.display = 'none';
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
      if (itemData.useEffect) {
        itemData.useEffect(this.game);
      }
      this.removeItem(slotIdx, 1);
    }

    this.syncGamePlayerInventory();
    this.renderUI();
  }

  equipItemDirect(equipType, itemId) {
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

        slotEl.innerHTML = `
          <span class="slot-item-icon">${item.icon}</span>
          ${slot.count > 1 ? `<span class="slot-item-badge">x${slot.count}</span>` : ''}
        `;
      } else {
        slotEl.classList.add('empty');
      }

      if (this.selectedSlot === i) {
        slotEl.classList.add('selected');
      }

      // Slot Click
      slotEl.addEventListener('click', () => {
        this.selectedSlot = i;
        this.renderUI();
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
  }
}
