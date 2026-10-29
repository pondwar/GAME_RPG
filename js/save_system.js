// save_system.js - Camada unica de save do Suritto (personagem, skills, pericias, inventario, recursos do mundo)
// O formato do snapshot espelha as tabelas do banco (server/db/migrations/001_initial_schema.sql):
//   character  -> player.game_character        skills    -> player.character_skill
//   pericias   -> player.character_pericia     inventory -> player.inventory_slot
//   equipment  -> player.character_equipment   world.resourceNodes -> world.resource_node_state
// Hoje grava no localStorage (LocalStorageAdapter). Para o multiplayer basta trocar o adapter por um que fale
// com o servidor: o resto do jogo so chama save()/load().

const SURITTO_STORAGE = {
  character: 'suritto_character_v1',   // snapshot do personagem
  chunkIndex: 'suritto_chunks_v1',     // construtor: indice de chunks (architect.js)
  chunkPrefix: 'suritto_chunk_v1:',    // construtor: um chunk por chave
  legacyPrefix: 'aethelgard_',         // chaves do nome antigo do projeto
  legacyMigrated: 'suritto_legacy_migrated'
};

// Migracao unica do nome antigo: copia toda chave 'aethelgard_*' para 'suritto_*' (as antigas ficam como backup).
// Roda ao carregar o script, antes do construtor ler os chunks.
(function migrateLegacyStorageKeys() {
  try {
    if (localStorage.getItem(SURITTO_STORAGE.legacyMigrated)) return;
    const legacy = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(SURITTO_STORAGE.legacyPrefix) === 0) legacy.push(k);
    }
    for (const k of legacy) {
      const nk = 'suritto_' + k.slice(SURITTO_STORAGE.legacyPrefix.length);
      if (localStorage.getItem(nk) === null) localStorage.setItem(nk, localStorage.getItem(k));
    }
    localStorage.setItem(SURITTO_STORAGE.legacyMigrated, new Date().toISOString());
    if (legacy.length) console.info(`[Save] ${legacy.length} chave(s) do save antigo copiadas para o nome Suritto.`);
  } catch (e) {
    console.warn('[Save] migracao das chaves antigas falhou:', e);
  }
})();

class LocalStorageAdapter {
  constructor(key) { this.key = key; }
  load() {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }
  save(snapshot) { localStorage.setItem(this.key, JSON.stringify(snapshot)); }
  clear() { localStorage.removeItem(this.key); }
}

// Servidor no ar (js/net.js): personagem no banco (player.*). O localStorage continua com uma copia,
// usada so quando o jogo abrir sem servidor. Personagem que ainda nao existe no banco sobe a partir da copia local.
class ServerAdapter {
  constructor(server, local) { this.server = server; this.local = local; }
  load() { return this.server.character || this.local.load(); }
  save(snapshot) {
    try { this.local.save(snapshot); } catch (e) { }
    this.server.saveCharacter(snapshot, document.visibilityState === 'hidden').catch(() => { });
  }
  clear() { this.local.clear(); }
}

class SaveSystem {
  constructor(game, adapter = SaveSystem.defaultAdapter()) {
    this.game = game;
    this.adapter = adapter;
    this.VERSION = 1;
    this.AUTOSAVE_SECONDS = 20;
    this.playTimeSeconds = 0;
    this._sinceSave = 0;
    this._warned = false;
  }

  static defaultAdapter() {
    const local = new LocalStorageAdapter(SURITTO_STORAGE.character);
    return window.SurittoServer && window.SurittoServer.online ? new ServerAdapter(window.SurittoServer, local) : local;
  }

  // ---- montar o snapshot a partir do estado do jogo ----
  buildSnapshot() {
    const g = this.game, p = g.player, inv = g.inventory, sk = g.skills;
    const chunks = g.world && g.world.chunks;
    return {
      version: this.VERSION,
      savedAt: new Date().toISOString(),
      character: {
        name: p.name || 'Aventureiro',
        level: p.level || 1,
        hp: p.hp, maxHp: p.maxHp,
        mana: p.mana, maxMana: p.maxMana,
        stamina: p.stamina, maxStamina: p.maxStamina,
        hunger: p.hunger,
        coins: inv.coins,
        posX: p.x, posY: p.y, posZ: p.z || 0,
        facing: p.direction,
        playTimeSeconds: Math.floor(this.playTimeSeconds),
        state: {
          torchLit: !!p.torchLit,
          hotbar: g.hotbar ? g.hotbar.slots.slice() : undefined,      // barra de atalhos 1-0 (js/hotbar.js)
          strengthBuffTimer: p.strengthBuffTimer || 0
        }
      },
      skills: Object.values(sk.primarySkills).map(s => ({ code: s.id, level: s.level, xpProgress: s.xp, xpTotal: s.xpTotal || 0 })),
      pericias: Object.values(sk.secondarySkills).map(s => ({ code: s.id, bonus: s.bonus, xpProgress: s.xp, xpTotal: s.xpTotal || 0 })),
      inventory: inv.slots.map((s, i) => s && { slotIndex: i, itemCode: s.id, quantity: s.count }).filter(Boolean),
      equipment: Object.entries(inv.equipment).filter(([, id]) => id).map(([slot, id]) => ({ slotCode: slot, itemCode: id })),
      world: {
        resourceNodes: chunks && chunks.modifiedEntities
          ? [...chunks.modifiedEntities.entries()].map(([nodeId, state]) => ({ nodeId, state: { ...state, shake: 0 } }))
          : []
      }
    };
  }

  // ---- aplicar um snapshot no jogo (chamar antes de gerar o mundo) ----
  applySnapshot(snap) {
    const g = this.game, p = g.player, inv = g.inventory, sk = g.skills;
    const c = snap.character || {};
    const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);

    p.maxHp = num(c.maxHp, p.maxHp); p.hp = Math.min(p.maxHp, num(c.hp, p.hp));
    p.maxMana = num(c.maxMana, p.maxMana); p.mana = Math.min(p.maxMana, num(c.mana, p.mana));
    p.maxStamina = num(c.maxStamina, p.maxStamina); p.stamina = Math.min(p.maxStamina, num(c.stamina, p.stamina));
    p.hunger = num(c.hunger, p.hunger);
    p.x = num(c.posX, p.x); p.y = num(c.posY, p.y); p.z = num(c.posZ, 0);
    if (c.facing) p.direction = c.facing;
    this.playTimeSeconds = num(c.playTimeSeconds, 0);
    inv.coins = num(c.coins, inv.coins);
    if (c.state) {
      p.strengthBuffTimer = num(c.state.strengthBuffTimer, 0);
      p.torchLit = !!c.state.torchLit;
      if (this.game.hotbar && c.state.hotbar) this.game.hotbar.load(c.state.hotbar);
    }

    for (const s of snap.skills || []) {
      const dst = sk.primarySkills[s.code];
      if (dst) { dst.level = num(s.level, 1); dst.xp = num(s.xpProgress, 0); dst.xpTotal = num(s.xpTotal, 0); }
    }
    for (const s of snap.pericias || []) {
      const dst = sk.secondarySkills[s.code];
      if (dst) { dst.bonus = num(s.bonus, dst.bonus); dst.xp = num(s.xpProgress, 0); dst.xpTotal = num(s.xpTotal, 0); }
    }

    // Inventario: substitui os itens iniciais pelos salvos (itens que nao existem mais no catalogo sao ignorados)
    inv.slots = new Array(inv.maxSlots).fill(null);
    for (const s of snap.inventory || []) {
      if (s.slotIndex >= 0 && s.slotIndex < inv.maxSlots && inv.itemDB[s.itemCode] && s.quantity > 0) {
        inv.slots[s.slotIndex] = { id: s.itemCode, count: s.quantity };
      }
    }
    inv.equipment = { weapon: null, offhand: null, armor: null };
    for (const e of snap.equipment || []) {
      if (e.slotCode in inv.equipment && inv.itemDB[e.itemCode]) inv.equipment[e.slotCode] = e.itemCode;
    }
    p.equippedWeapon = inv.equipment.weapon;
    p.torchLit = inv.equipment.offhand === 'torch' && p.torchLit;

    // Recursos do mundo alterados (arvores cortadas, tocos, cogumelos colhidos)
    const chunks = g.world && g.world.chunks;
    if (chunks && chunks.modifiedEntities) {
      for (const n of (snap.world && snap.world.resourceNodes) || []) {
        if (n && n.nodeId && n.state) chunks.modifiedEntities.set(n.nodeId, n.state);
      }
      chunks.activeChunks && chunks.activeChunks.clear();   // regenera os chunks ja usando o estado salvo
    }
  }

  // ---- API publica ----
  load() {
    let snap = null;
    try { snap = this.adapter.load(); } catch (e) { console.warn('[Save] save corrompido, comecando do zero:', e); }
    if (!snap || snap.version !== this.VERSION) return false;
    try {
      this.applySnapshot(snap);
      return true;
    } catch (e) {
      console.error('[Save] falha ao aplicar o save:', e);
      return false;
    }
  }

  save() {
    try {
      this.adapter.save(this.buildSnapshot());
      this._sinceSave = 0;
      this._warned = false;
      return true;
    } catch (e) {
      if (!this._warned && this.game.addLog) {
        this._warned = true;
        this.game.addLog('⚠️ [SAVE] Não foi possível salvar o progresso (armazenamento do navegador cheio ou bloqueado).', 'warning');
      }
      console.error('[Save] falha ao salvar:', e);
      return false;
    }
  }

  // Apaga o personagem salvo (usar pelo console: game.saveSystem.reset()). Recarregue a pagina depois.
  reset() {
    this._resetting = true;
    this.adapter.clear();
  }

  // Autosave periodico + ao fechar/ocultar a aba
  startAutosave() {
    const flush = () => { if (!this._resetting) this.save(); };
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  }

  update(dt) {
    this.playTimeSeconds += dt;
    this._sinceSave += dt;
    if (this._sinceSave >= this.AUTOSAVE_SECONDS && !this._resetting) this.save();
  }
}

window.SURITTO_STORAGE = SURITTO_STORAGE;
window.SaveSystem = SaveSystem;
