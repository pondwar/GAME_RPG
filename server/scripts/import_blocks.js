// import_blocks.js - Importa um JSON do botao "💾 Exportar" do construtor para o banco (world.build_chunk).
//   npm run db:import -- "C:\caminho\suritto_castelo_vilarejo_123.json"
// Junta com o que ja existe (nao apaga nada; chave repetida mantem a do banco).
import fs from 'node:fs';
import { mergeChunks, CHUNK_TILES } from '../src/world_repo.js';
import { pool } from '../src/db.js';

const file = process.argv[2];
if (!file) { console.error('uso: npm run db:import -- <arquivo.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const GRID = 48, tilesX = Math.floor((data.worldWidth || 6660096) / GRID);
const normGX = gx => ((gx % tilesX) + tilesX) % tilesX;

const chunks = {};
let n = 0;
for (const [key, b] of Object.entries(data.blocks || {})) {
  if (!b || b.temp || b.gx === undefined || b.gy === undefined) continue;
  const id = `${Math.floor(normGX(b.gx) / CHUNK_TILES)},${Math.floor(b.gy / CHUNK_TILES)}`;
  (chunks[id] = chunks[id] || []).push([key, b]);
  n++;
}
const res = await mergeChunks(process.env.REALM || 'local', chunks);
console.log(`[import] ${n} blocos lidos em ${Object.keys(chunks).length} chunks; ${res.added} novos gravados no banco.`);
await pool.end();
