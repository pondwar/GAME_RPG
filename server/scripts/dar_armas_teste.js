// Poe as armas do jogo na mochila de um personagem de TESTE (so adiciona, nunca apaga nada). Nao use nos personagens "Aventureiro"/"Pondwar".
// Uso: node --env-file=.env scripts/dar_armas_teste.js <nome-do-personagem> [--aplicar]      (sem --aplicar so mostra o que faria)
import { pool } from '../src/db.js';
const nome = process.argv[2], aplicar = process.argv.includes('--aplicar');
if (!nome || ['aventureiro', 'pondwar'].includes(nome.toLowerCase())) { console.log('Informe um personagem de teste (nao Aventureiro nem Pondwar).'); process.exit(1); }
const ARMAS = ['sword', 'fire_sword', 'axe', 'machadinha', 'clava', 'adaga', 'espada_curta', 'lanca'];
try {
  const { rows: ch } = await pool.query('SELECT id, name, race_code FROM player.game_character WHERE name = $1 AND deleted_at IS NULL', [nome]);
  if (ch.length !== 1) { console.log('personagem encontrado:', ch.length); process.exit(1); }
  const id = ch[0].id;
  const { rows: ok } = await pool.query('SELECT code FROM ruleset.item WHERE code = ANY($1)', [ARMAS]);
  const existem = new Set(ok.map(r => r.code));
  const { rows: inv } = await pool.query('SELECT slot_index, item_code, quantity FROM player.inventory_slot WHERE character_id = $1 ORDER BY slot_index', [id]);
  const { rows: eq } = await pool.query('SELECT equipment_slot_code, item_code FROM player.character_equipment WHERE character_id = $1', [id]);
  const tem = new Set([...inv.map(s => s.item_code), ...eq.map(e => e.item_code)]);
  const usados = new Set(inv.map(s => s.slot_index));
  const livres = []; for (let i = 0; i < 20; i++) if (!usados.has(i)) livres.push(i);
  const falta = ARMAS.filter(a => existem.has(a) && !tem.has(a));
  console.log(`${ch[0].name} (${ch[0].race_code}): mochila ${inv.length}/20 | equipado: ${eq.map(e => e.item_code).join(', ') || '-'}`);
  console.log('armas que o banco nao conhece:', ARMAS.filter(a => !existem.has(a)).join(', ') || 'nenhuma');
  console.log('ja tem:', ARMAS.filter(a => tem.has(a)).join(', ') || 'nenhuma', '| vai receber:', falta.join(', ') || 'nenhuma', `| espacos livres: ${livres.length}`);
  if (falta.length > livres.length) { console.log('NAO CABE na mochila (20 espacos). Esvazie espaco ou veja o que remover.'); process.exit(2); }
  if (aplicar) { for (let i = 0; i < falta.length; i++) await pool.query('INSERT INTO player.inventory_slot (character_id, slot_index, item_code, quantity) VALUES ($1,$2,$3,1)', [id, livres[i], falta[i]]); console.log('OK: armas adicionadas.'); }
} finally { await pool.end(); }
