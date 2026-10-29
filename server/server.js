// server.js - Servidor local do Suritto: entrega o jogo (arquivos de GAME_RPG/) e a API do banco.
//   npm start  (dentro de server/)  ->  http://localhost:3000
// Rotas (realm "local" por enquanto; sem login, conta "dev"):
//   GET  /api/health
//   GET  /api/world/chunks                 PUT /api/world/chunks        { chunks: { "cx,cy": [[chave, bloco]...] } }
//   POST /api/world/chunks/merge           (junta sem apagar: primeiro envio de um navegador / importacao)
//   GET  /api/world/settlements            PUT /api/world/settlements/:code
//   GET  /api/world/fauna                  PUT /api/world/fauna         { regions: { "rx,ry": { plants, pop, hunger } } }
//   GET  /api/characters                   (lista para a tela de escolha)
//   GET  /api/characters/:name             PUT /api/characters/:name    (snapshot de js/save_system.js, com raca/classe/atributos)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './src/db.js';
import * as world from './src/world_repo.js';
import * as chars from './src/character_repo.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // pasta GAME_RPG
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';                                     // so a propria maquina
const REALM = process.env.REALM || 'local';
const MAX_BODY = 20 * 1024 * 1024;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.md': 'text/plain; charset=utf-8'
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(data);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const parts = [];
    req.on('data', d => { size += d.length; if (size > MAX_BODY) { reject(new Error('corpo grande demais')); req.destroy(); } else parts.push(d); });
    req.on('end', () => { try { resolve(parts.length ? JSON.parse(Buffer.concat(parts).toString('utf8')) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

// Arquivos do jogo. Nunca entrega a pasta do servidor (tem o .env), o .git nem arquivos ocultos.
function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  if (!rel) rel = 'index.html';
  const file = path.resolve(ROOT, rel);
  const relNorm = path.relative(ROOT, file).split(path.sep);
  if (!file.startsWith(ROOT + path.sep) || relNorm[0] === 'server' || relNorm.some(p => p.startsWith('.'))) return send(res, 404, 'nao encontrado', 'text/plain');
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'nao encontrado', 'text/plain');
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size });
    fs.createReadStream(file).pipe(res);
  });
}

async function api(req, res, url) {
  const m = req.method, p = url.pathname;
  if (m === 'GET' && p === '/api/health') {
    await pool.query('SELECT 1');
    return send(res, 200, { ok: true, realm: REALM, chunkTiles: world.CHUNK_TILES });
  }
  if (p === '/api/world/chunks') {
    if (m === 'GET') return send(res, 200, { tiles: world.CHUNK_TILES, chunks: await world.listChunks(REALM) });
    if (m === 'PUT') { const b = await readJson(req); return send(res, 200, { ok: true, ...(await world.saveChunks(REALM, b.chunks || {})) }); }
  }
  if (m === 'POST' && p === '/api/world/chunks/merge') {
    const b = await readJson(req); return send(res, 200, { ok: true, ...(await world.mergeChunks(REALM, b.chunks || {})) });
  }
  if (m === 'GET' && p === '/api/world/settlements') return send(res, 200, await world.listSettlements(REALM));
  if (p === '/api/world/fauna') {                                   // ecossistema por regiao (js/fauna.js)
    if (m === 'GET') return send(res, 200, { regions: await world.listFauna(REALM) });
    if (m === 'PUT') { const b = await readJson(req); return send(res, 200, { ok: true, ...(await world.saveFauna(REALM, b.regions || {})) }); }
  }
  let mm = /^\/api\/world\/settlements\/([a-z0-9_]+)$/.exec(p);
  if (mm && m === 'PUT') { await world.saveSettlement(REALM, mm[1], await readJson(req)); return send(res, 200, { ok: true }); }
  if (m === 'GET' && p === '/api/characters') return send(res, 200, await chars.listCharacters(REALM));
  mm = /^\/api\/characters\/([^/]{1,40})$/.exec(p);
  if (mm) {
    const name = decodeURIComponent(mm[1]);
    if (m === 'GET') { const s = await chars.loadCharacter(REALM, name); return s ? send(res, 200, s) : send(res, 404, { error: 'personagem nao existe' }); }
    if (m === 'PUT') return send(res, 200, { ok: true, ...(await chars.saveCharacter(REALM, name, await readJson(req))) });
  }
  return send(res, 404, { error: 'rota desconhecida' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else if (req.method === 'GET' || req.method === 'HEAD') serveStatic(req, res, url.pathname);
    else send(res, 405, 'metodo nao permitido', 'text/plain');
  } catch (e) {
    console.error('[api]', req.method, url.pathname, e.message);
    if (!res.headersSent) send(res, 500, { error: e.message });
  }
});

server.listen(PORT, HOST, () => console.log(`[suritto] servidor em http://localhost:${PORT} (realm "${REALM}", jogo em ${ROOT})`));
