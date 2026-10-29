// world_repo.js - Mundo persistente: construcoes por chunk, vilas e recursos alterados
import { pool, tx, realmId } from './db.js';

export const CHUNK_TILES = 16;   // mesmo tamanho de chunk do construtor (architect.js)

const parseId = id => {
  const m = /^(-?\d+),(-?\d+)$/.exec(id);
  if (!m) throw new Error(`id de chunk invalido: ${id}`);
  return [Number(m[1]), Number(m[2])];
};

export async function listChunks(realm) {
  const rid = await realmId(realm);
  const { rows } = await pool.query(
    'SELECT chunk_x, chunk_y, blocks, revision FROM world.build_chunk WHERE realm_id = $1', [rid]);
  return rows.map(r => ({ id: `${r.chunk_x},${r.chunk_y}`, blocks: r.blocks, revision: r.revision }));
}

// chunks: { "cx,cy": [[chave, bloco], ...] }  (lista vazia = apaga o chunk)
export async function saveChunks(realm, chunks, characterId = null) {
  const rid = await realmId(realm);
  return tx(async c => {
    let written = 0, removed = 0;
    for (const [id, blocks] of Object.entries(chunks)) {
      const [cx, cy] = parseId(id);
      if (!Array.isArray(blocks) || !blocks.length) {
        const r = await c.query('DELETE FROM world.build_chunk WHERE realm_id = $1 AND chunk_x = $2 AND chunk_y = $3', [rid, cx, cy]);
        removed += r.rowCount;
        continue;
      }
      await c.query(
        `INSERT INTO world.build_chunk (realm_id, chunk_x, chunk_y, blocks, updated_by_character_id)
         VALUES ($1, $2, $3, $4::jsonb, $5)
         ON CONFLICT (realm_id, chunk_x, chunk_y)
         DO UPDATE SET blocks = EXCLUDED.blocks, revision = world.build_chunk.revision + 1,
                       updated_by_character_id = EXCLUDED.updated_by_character_id`,
        [rid, cx, cy, JSON.stringify(blocks), characterId]);
      written++;
    }
    return { written, removed };
  });
}

// Junta blocos num chunk sem apagar os que ja existem (importacao / primeiro envio de um navegador)
export async function mergeChunks(realm, chunks) {
  const rid = await realmId(realm);
  return tx(async c => {
    let added = 0;
    for (const [id, blocks] of Object.entries(chunks)) {
      const [cx, cy] = parseId(id);
      const { rows } = await c.query(
        'SELECT blocks FROM world.build_chunk WHERE realm_id = $1 AND chunk_x = $2 AND chunk_y = $3 FOR UPDATE', [rid, cx, cy]);
      const cur = rows.length ? rows[0].blocks : [];
      const keys = new Set(cur.map(e => e[0]));
      const extra = blocks.filter(e => !keys.has(e[0]));
      if (!extra.length) continue;
      added += extra.length;
      await c.query(
        `INSERT INTO world.build_chunk (realm_id, chunk_x, chunk_y, blocks) VALUES ($1, $2, $3, $4::jsonb)
         ON CONFLICT (realm_id, chunk_x, chunk_y) DO UPDATE SET blocks = EXCLUDED.blocks, revision = world.build_chunk.revision + 1`,
        [rid, cx, cy, JSON.stringify(cur.concat(extra))]);
    }
    return { added };
  });
}

export async function listSettlements(realm) {
  const rid = await realmId(realm);
  const { rows } = await pool.query(
    'SELECT code, name, region_code, center_x, center_y, signature, built_at FROM world.settlement WHERE realm_id = $1', [rid]);
  return rows;
}

export async function saveSettlement(realm, code, s) {
  const rid = await realmId(realm);
  await pool.query(
    `INSERT INTO world.settlement (realm_id, code, name, region_code, center_x, center_y, signature)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (realm_id, code) DO UPDATE SET name = EXCLUDED.name, region_code = EXCLUDED.region_code,
       center_x = EXCLUDED.center_x, center_y = EXCLUDED.center_y, signature = EXCLUDED.signature, built_at = now()`,
    [rid, code, s.name, s.region_code || null, s.center_x, s.center_y, s.signature]);
}

export async function listResourceNodes(realm) {
  const rid = await realmId(realm);
  const { rows } = await pool.query('SELECT node_id, state FROM world.resource_node_state WHERE realm_id = $1', [rid]);
  return rows.map(r => ({ nodeId: r.node_id, state: r.state }));
}

export async function saveResourceNodes(client, rid, nodes) {
  for (const n of nodes || []) {
    if (!n || !n.nodeId || !n.state) continue;
    await client.query(
      `INSERT INTO world.resource_node_state (realm_id, node_id, state) VALUES ($1, $2, $3::jsonb)
       ON CONFLICT (realm_id, node_id) DO UPDATE SET state = EXCLUDED.state`,
      [rid, String(n.nodeId), JSON.stringify(n.state)]);
  }
}

// Ecossistema por regiao (js/fauna.js): { "rx,ry": state }
export async function listFauna(realm) {
  const rid = await realmId(realm);
  const { rows } = await pool.query('SELECT rx, ry, state FROM world.fauna_region WHERE realm_id = $1', [rid]);
  const out = {};
  for (const r of rows) out[`${r.rx},${r.ry}`] = r.state;
  return out;
}

// Grava varias regioes de uma vez (upsert de todas num comando so)
export async function saveFauna(realm, regions) {
  const rid = await realmId(realm);
  const clean = {};
  for (const [id, state] of Object.entries(regions || {})) {
    if (!/^-?\d+,-?\d+$/.test(id) || !state || typeof state !== 'object') continue;
    clean[id] = state;
  }
  if (!Object.keys(clean).length) return { written: 0 };
  const r = await pool.query(
    `INSERT INTO world.fauna_region (realm_id, rx, ry, state)
     SELECT $1, split_part(key, ',', 1)::int, split_part(key, ',', 2)::int, value FROM jsonb_each($2::jsonb)
     ON CONFLICT (realm_id, rx, ry) DO UPDATE SET state = EXCLUDED.state`,
    [rid, JSON.stringify(clean)]);
  return { written: r.rowCount };
}
