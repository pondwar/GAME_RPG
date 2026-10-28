// db.js - Pool de conexoes com o PostgreSQL e helper de transacao
import pg from 'pg';
import { dbConfig } from '../scripts/db_config.js';

export const pool = new pg.Pool({ ...dbConfig(), max: 10 });

// Roda fn(client) numa transacao; desfaz tudo se der erro
export async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Id do realm pelo code (cache em memoria)
const realmCache = new Map();
export async function realmId(code) {
  if (realmCache.has(code)) return realmCache.get(code);
  const { rows } = await pool.query('SELECT id FROM world.realm WHERE code = $1', [code]);
  if (!rows.length) throw new Error(`realm "${code}" nao existe`);
  realmCache.set(code, rows[0].id);
  return rows[0].id;
}
