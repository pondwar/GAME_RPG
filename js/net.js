// net.js - Conexao do jogo com o servidor local (server/server.js + PostgreSQL).
// Com o servidor no ar, o mundo construido, as vilas e o personagem vem do banco e sao gravados nele.
// Sem servidor (ex.: aberto pelo python http.server), o jogo usa o save do navegador (localStorage) como antes.
(function () {
  const TIMEOUT = 2500;
  const json = (r) => { if (!r.ok) throw new Error(r.status + ' ' + r.statusText); return r.json(); };
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

  const SurittoServer = {
    online: false,
    realm: null,
    charName: 'Aventureiro',        // sem login ainda: um personagem por nome
    chunks: [],                     // [{ id: "cx,cy", blocks: [[chave, bloco]...] }]
    settlements: {},                // code -> { name, signature, ... }
    character: null,                // snapshot do personagem (ou null se ainda nao existe no banco)
    fauna: null,                    // { "rx,ry": { plants, pop, hunger } } do ecossistema (js/fauna.js); null = servidor sem a rota (antigo)

    // Chamado antes de criar o Game: descobre se o servidor esta no ar e ja traz o mundo e o personagem
    async connect() {
      try {
        try { this.charName = localStorage.getItem('suritto_character_name') || this.charName; } catch (e) { }
        const h = await withTimeout(fetch('/api/health', { cache: 'no-store' }).then(json), TIMEOUT);
        this.realm = h.realm;
        const [w, s, c] = await Promise.all([
          fetch('/api/world/chunks', { cache: 'no-store' }).then(json),
          fetch('/api/world/settlements', { cache: 'no-store' }).then(json),
          fetch('/api/characters/' + encodeURIComponent(this.charName), { cache: 'no-store' }).then(r => (r.status === 404 ? null : json(r)))
        ]);
        this.chunks = w.chunks || [];
        for (const row of s) this.settlements[row.code] = row;
        this.character = c;
        // ecossistema: servidor antigo (sem a rota) nao impede o jogo de abrir, a fauna fica no navegador
        try { const f = await withTimeout(fetch('/api/world/fauna', { cache: 'no-store' }).then(json), TIMEOUT); this.fauna = f.regions || {}; } catch (e) { this.fauna = null; }
        this.online = true;
        console.info(`[Servidor] conectado (realm "${this.realm}"): ${this.chunks.length} chunks, ${s.length} vila(s), personagem ${c ? 'carregado' : 'novo'}.`);
      } catch (e) {
        this.online = false;
        console.info('[Servidor] offline, usando o save do navegador:', e.message);
      }
      return this.online;
    },

    _send(method, url, body, keepalive) {
      return fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: !!keepalive })
        .then(json)
        .catch(e => { console.warn(`[Servidor] ${method} ${url} falhou:`, e.message); throw e; });
    },
    // chunks: { "cx,cy": [[chave, bloco]...] }  (lista vazia apaga)
    saveChunks(chunks, keepalive) { return this._send('PUT', '/api/world/chunks', { chunks }, keepalive); },
    mergeChunks(chunks) { return this._send('POST', '/api/world/chunks/merge', { chunks }); },
    saveSettlement(code, data) { this.settlements[code] = { ...(this.settlements[code] || {}), ...data }; return this._send('PUT', '/api/world/settlements/' + code, data); },
    saveCharacter(snapshot, keepalive) { return this._send('PUT', '/api/characters/' + encodeURIComponent(this.charName), snapshot, keepalive); },
    // regions: { "rx,ry": { plants, pop, hunger } }
    saveFauna(regions, keepalive) { return this._send('PUT', '/api/world/fauna', { regions }, keepalive); }
  };

  window.SurittoServer = SurittoServer;
})();
