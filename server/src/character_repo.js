// character_repo.js - Personagem <-> snapshot do jogo (js/save_system.js)
// O snapshot do cliente e quebrado nas tabelas de player.*; ao carregar, as tabelas viram o mesmo snapshot.
import { pool, tx, realmId } from './db.js';
import { saveResourceNodes, listResourceNodes } from './world_repo.js';

const DEV_ACCOUNT = 'dev';   // sem login ainda: todo personagem do localhost pertence a conta "dev"

async function devAccountId(c) {
  const { rows } = await c.query('SELECT id FROM account.user_account WHERE lower(username) = $1', [DEV_ACCOUNT]);
  return rows[0].id;
}

// codes validos do ruleset (para nao quebrar a FK com item/skill que so existe no cliente)
async function codes(c, table) {
  const { rows } = await c.query(`SELECT code FROM ruleset.${table}`);
  return new Set(rows.map(r => r.code));
}

export async function loadCharacter(realm, name) {
  const rid = await realmId(realm);
  const { rows } = await pool.query(
    'SELECT * FROM player.game_character WHERE realm_id = $1 AND lower(name) = lower($2) AND deleted_at IS NULL', [rid, name]);
  if (!rows.length) return null;
  const ch = rows[0];
  const q = (sql) => pool.query(sql, [ch.id]).then(r => r.rows);
  const [skills, pericias, inv, eq, attrs] = await Promise.all([
    q('SELECT skill_code, level, xp_progress, xp_total FROM player.character_skill WHERE character_id = $1'),
    q('SELECT pericia_code, bonus, xp_progress, xp_total FROM player.character_pericia WHERE character_id = $1'),
    q('SELECT slot_index, item_code, quantity FROM player.inventory_slot WHERE character_id = $1 ORDER BY slot_index'),
    q('SELECT equipment_slot_code, item_code FROM player.character_equipment WHERE character_id = $1'),
    q('SELECT attribute_code, value FROM player.character_attribute WHERE character_id = $1')
  ]);
  return {
    version: 1,
    savedAt: ch.updated_at,
    character: {
      name: ch.name, level: ch.level,
      hp: ch.hp, maxHp: ch.max_hp, mana: ch.mana, maxMana: ch.max_mana,
      stamina: ch.stamina, maxStamina: ch.max_stamina, hunger: ch.hunger,
      coins: Number(ch.coins), posX: ch.pos_x, posY: ch.pos_y, posZ: ch.pos_z, facing: ch.facing,
      playTimeSeconds: Number(ch.play_time_seconds), state: ch.state,
      race: ch.race_code, class: ch.class_code,                        // ficha (js/ruleset.js); null = personagem antigo sem ficha
      attributes: attrs.length ? Object.fromEntries(attrs.map(a => [a.attribute_code, a.value])) : null
    },
    skills: skills.map(s => ({ code: s.skill_code, level: s.level, xpProgress: s.xp_progress, xpTotal: Number(s.xp_total) })),
    pericias: pericias.map(s => ({ code: s.pericia_code, bonus: s.bonus, xpProgress: s.xp_progress, xpTotal: Number(s.xp_total) })),
    inventory: inv.map(s => ({ slotIndex: s.slot_index, itemCode: s.item_code, quantity: s.quantity })),
    equipment: eq.map(e => ({ slotCode: e.equipment_slot_code, itemCode: e.item_code })),
    world: { resourceNodes: await listResourceNodes(realm) }
  };
}

export async function saveCharacter(realm, name, snap) {
  const rid = await realmId(realm);
  const c0 = snap.character || {};
  const n = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
  return tx(async c => {
    const acc = await devAccountId(c);
    const { rows } = await c.query(
      `INSERT INTO player.game_character
         (account_id, realm_id, name, level, hp, max_hp, mana, max_mana, stamina, max_stamina, hunger, coins,
          pos_x, pos_y, pos_z, facing, play_time_seconds, state, race_code, class_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,$19,$20)
       ON CONFLICT (realm_id, lower(name)) WHERE deleted_at IS NULL DO UPDATE SET
         race_code = COALESCE(EXCLUDED.race_code, player.game_character.race_code),
         class_code = COALESCE(EXCLUDED.class_code, player.game_character.class_code),
         level = EXCLUDED.level, hp = EXCLUDED.hp, max_hp = EXCLUDED.max_hp, mana = EXCLUDED.mana, max_mana = EXCLUDED.max_mana,
         stamina = EXCLUDED.stamina, max_stamina = EXCLUDED.max_stamina, hunger = EXCLUDED.hunger, coins = EXCLUDED.coins,
         pos_x = EXCLUDED.pos_x, pos_y = EXCLUDED.pos_y, pos_z = EXCLUDED.pos_z, facing = EXCLUDED.facing,
         play_time_seconds = EXCLUDED.play_time_seconds, state = EXCLUDED.state
       RETURNING id`,
      [acc, rid, name, Math.max(1, n(c0.level, 1)),
       n(c0.hp, 100), Math.max(1, n(c0.maxHp, 100)), n(c0.mana), Math.max(0, n(c0.maxMana, 50)),
       n(c0.stamina, 100), Math.max(1, n(c0.maxStamina, 100)), Math.max(0, Math.min(100, n(c0.hunger, 100))),
       Math.max(0, Math.round(n(c0.coins))), n(c0.posX), n(c0.posY), n(c0.posZ),
       ['down', 'up', 'left', 'right'].includes(c0.facing) ? c0.facing : 'down',
       Math.max(0, Math.round(n(c0.playTimeSeconds))), JSON.stringify(c0.state || {}),
       (await codes(c, 'race')).has(c0.race) ? c0.race : null, (await codes(c, 'character_class')).has(c0.class) ? c0.class : null]);
    const id = rows[0].id;
    // atributos da ficha (so quando vierem no snapshot: save de cliente antigo nao apaga)
    if (c0.attributes && typeof c0.attributes === 'object') {
      const attrOk = await codes(c, 'attribute');
      await c.query('DELETE FROM player.character_attribute WHERE character_id = $1', [id]);
      for (const [a, v] of Object.entries(c0.attributes)) if (attrOk.has(a) && Number.isFinite(v)) {
        await c.query('INSERT INTO player.character_attribute (character_id, attribute_code, value) VALUES ($1,$2,$3)', [id, a, Math.max(1, Math.min(30, Math.round(v)))]);
      }
    }

    const skillOk = await codes(c, 'skill'), periciaOk = await codes(c, 'pericia'), itemOk = await codes(c, 'item');   // em sequencia: mesma conexao da transacao
    const slotOk = new Set(['weapon', 'offhand', 'armor']);
    for (const t of ['character_skill', 'character_pericia', 'inventory_slot', 'character_equipment']) {
      await c.query(`DELETE FROM player.${t} WHERE character_id = $1`, [id]);
    }
    for (const s of snap.skills || []) if (skillOk.has(s.code)) {
      await c.query('INSERT INTO player.character_skill (character_id, skill_code, level, xp_progress, xp_total) VALUES ($1,$2,$3,$4,$5)',
        [id, s.code, Math.max(1, n(s.level, 1)), Math.max(0, Math.round(n(s.xpProgress))), Math.max(0, Math.round(n(s.xpTotal)))]);
    }
    for (const s of snap.pericias || []) if (periciaOk.has(s.code)) {
      await c.query('INSERT INTO player.character_pericia (character_id, pericia_code, bonus, xp_progress, xp_total) VALUES ($1,$2,$3,$4,$5)',
        [id, s.code, n(s.bonus), Math.max(0, Math.round(n(s.xpProgress))), Math.max(0, Math.round(n(s.xpTotal)))]);
    }
    for (const s of snap.inventory || []) if (itemOk.has(s.itemCode) && s.quantity > 0) {
      await c.query('INSERT INTO player.inventory_slot (character_id, slot_index, item_code, quantity) VALUES ($1,$2,$3,$4)',
        [id, s.slotIndex, s.itemCode, s.quantity]);
    }
    for (const e of snap.equipment || []) if (itemOk.has(e.itemCode) && slotOk.has(e.slotCode)) {
      await c.query('INSERT INTO player.character_equipment (character_id, equipment_slot_code, item_code) VALUES ($1,$2,$3)',
        [id, e.slotCode, e.itemCode]);
    }
    await saveResourceNodes(c, rid, snap.world && snap.world.resourceNodes);
    return { id };
  });
}

// Personagens do realm (tela de escolha): nome, raca, classe, nivel, ultimo save
export async function listCharacters(realm) {
  const rid = await realmId(realm);
  const { rows } = await pool.query(
    `SELECT name, race_code AS race, class_code AS class, level, updated_at FROM player.game_character
     WHERE realm_id = $1 AND deleted_at IS NULL ORDER BY updated_at DESC`, [rid]);
  return rows;
}
