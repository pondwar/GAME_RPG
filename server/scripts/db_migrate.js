// db_migrate.js - Aplica, em ordem, os arquivos db/migrations/NNN_nome.sql que ainda nao rodaram.
// Cada migracao roda numa transacao e fica registrada em public.schema_migration.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { dbConfig } from './db_config.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations');
const files = fs.readdirSync(dir).filter(f => /^\d{3}_.+\.sql$/.test(f)).sort();

const client = new pg.Client(dbConfig());
await client.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS public.schema_migration (
    version    text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const done = new Set((await client.query('SELECT version FROM public.schema_migration')).rows.map(r => r.version));

  let applied = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO public.schema_migration (version) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`[db] aplicada ${file}`);
      applied++;
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(`[db] falhou ${file}: ${e.message}`);
      process.exitCode = 1;
      break;
    }
  }
  if (!applied && !process.exitCode) console.log('[db] nada a aplicar, banco em dia');
} finally {
  await client.end();
}
