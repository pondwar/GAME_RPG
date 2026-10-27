// db_create.js - Cria o banco (DB_NAME) se ainda nao existir. Conecta no banco 'postgres' para isso.
import pg from 'pg';
import { dbConfig } from './db_config.js';

const name = process.env.DB_NAME || 'suritto';
if (!/^[a-z_][a-z0-9_]*$/.test(name)) throw new Error(`DB_NAME invalido: ${name}`);

const client = new pg.Client(dbConfig('postgres'));
await client.connect();
try {
  const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
  if (rowCount) {
    console.log(`[db] banco "${name}" ja existe`);
  } else {
    await client.query(`CREATE DATABASE ${name} ENCODING 'UTF8' TEMPLATE template0`);
    console.log(`[db] banco "${name}" criado`);
  }
} finally {
  await client.end();
}
