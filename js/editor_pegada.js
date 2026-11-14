// Editor visual de pegada das armas (F9, ou abra o jogo com ?editor=1).
// O boneco fica parado na pose escolhida (arma + acao + direcao + momento) e voce arrasta a arma na tela ampliada.
// O ajuste vale so para aquela arma/acao/direcao (um quadro ou todos) e e gravado em assets/weapons/items/_pegada.json,
// que o jogo le em js/game.js (pegadaAjuste). Ajuste = [dx, dy, giro em graus, comprimento (x), ordem 0 normal / 1 atras / 2 na frente].
// Mouse: arrastar = move | Shift+arrastar ou botao direito = gira | roda = gira | Ctrl+roda = comprimento.
// Teclado: setas = 1 px | Q e E = gira 5 graus | [ e ] = comprimento.
(function () {
  const ANG = { right: 0, down_right: 45, down: 90, down_left: 135, left: 180, up_left: -135, up: -90, up_right: -45 };
  const DIRMAIN = { right: 'right', down_right: 'right', down: 'down', down_left: 'down', left: 'left', up_left: 'up', up: 'up', up_right: 'right' };
  const OPOSTA = { right: 'left', left: 'right', up_left: 'up_right', up_right: 'up_left', down_left: 'down_right', down_right: 'down_left', up: 'up', down: 'down' };
  const GRADE = [['up_left', '↖'], ['up', '↑'], ['up_right', '↗'], ['left', '←'], [null, '●'], ['right', '→'], ['down_left', '↙'], ['down', '↓'], ['down_right', '↘']];
  const ZERO = [0, 0, 0, 1, 0];
  const PW = 400, PH = 400, SRC = 160, S = PW / SRC;     // area do jogo copiada (160 x 160) e ampliacao

  const E = window.EditorPegada = {
    ativo: false, g: null, arma: null, acao: 'golpe', d: 'down_right', prog: 0.5, escopo: 'quadro', px: 0, py: 0, ui: {}, orig: null,

    // chamado por game.drawPlayer antes de desenhar: trava o boneco na pose escolhida
    preparar(g, cx, cy) {
      this.g = g;
      const p = g.player, C = window.SurittoCombate, w = this.arma;
      if (!w) return;
      g.camera.zoom = 1;
      p.equippedWeapon = w; p.dir8 = this.d; p.direction = DIRMAIN[this.d]; p.facingAngle = ANG[this.d] * Math.PI / 180;
      p.isSitting = false; p.isJumping = false; p.jumpOffset = 0; p.gatherT = 0; p.isRunning = false; p.isMoving = false; p.isAttacking = false;
      const rs = g.images.raca, ficha = C.ficha(w), prog = Math.min(0.999, Math.max(0, this.prog));
      if (this.acao === 'andando') {
        const set = rs && rs.walk && (rs.walk[this.d] || rs.walk[p.direction]), n = (set && set.length) || 8, i = Math.min(n - 1, Math.floor(prog * n));
        p.isMoving = true; p.stridePhase = (i + 0.5) / n; p.vx = 0; p.vy = 0;
      } else if (this.acao === 'golpe' || this.acao === 'arremesso') {
        p.isAttacking = true; p.attackDuration = 1000; p.attackTimer = 1000 * (1 - prog);
        p.golpe = this.acao === 'arremesso' ? { w, mov: 'arremesso', arma: w, daMao: true, bate: 9999, feito: false } : { w, mov: ficha.mov, bate: 9999, feito: false };
      }
      const pdx = g.world ? g.world.wrapDelta(p.x - g.camera.x) : (p.x - g.camera.x);
      this.px = Math.round(pdx + cx); this.py = Math.round(p.y - g.getLift() - g.camera.y + cy);
    },

    // ---------- ajuste atual ----------
    chave() {
      const P = this.g && this.g._pose; if (!P) return null;
      const base = `${P.acao}_${P.d}`;
      return { base, quadro: `${base}_${P.idx}`, acao: P.acao, idx: P.idx };
    },
    efetivo() { return (this.g.pegadaAjuste() || ZERO).slice(); },
    gravar(arr) {
      const k = this.chave(); if (!k) return;
      const t = (this.g.pegada[this.arma] = this.g.pegada[this.arma] || {});
      if (this.escopo === 'direcao') { for (const c of Object.keys(t)) if (c.startsWith(k.base + '_')) delete t[c]; }
      const alvo = this.escopo === 'direcao' ? k.base : k.quadro;
      const zero = arr.every((v, i) => v === ZERO[i]);
      if (zero) delete t[alvo]; else t[alvo] = arr.map(v => Math.round(v * 100) / 100);
      this.sujo = true; this.atualizarUI();
    },
    mexer(i, v, rel) { const a = this.efetivo(); a[i] = rel ? a[i] + v : v; if (i === 3) a[3] = Math.max(0.2, Math.min(2, a[3])); this.gravar(a); },

    // ---------- interface ----------
    abrir() {
      if (this.ativo) return;
      const g = this.g || Object.values(window).find(v => v && v.saveSystem && v.inventory);
      if (!g) { console.warn('jogo nao encontrado'); return; }
      this.g = g; this.orig = { arma: g.player.equippedWeapon, zoom: g.camera.zoom };
      const C = window.SurittoCombate;
      if (!this.arma) this.arma = g.player.equippedWeapon && C.FICHA[g.player.equippedWeapon] ? g.player.equippedWeapon : (Object.keys(C.FICHA).find(k => k === 'sword') || Object.keys(C.FICHA)[0]);
      this.montar(); this.ativo = true; this.atualizarUI();
      const loop = () => { if (!this.ativo) return; this.desenharPreview(); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    },
    fechar() {
      if (!this.ativo) return;
      this.ativo = false;
      const g = this.g; g.player.equippedWeapon = this.orig.arma; g.player.isAttacking = false; g.player.isMoving = false; g.camera.zoom = this.orig.zoom;
      if (this.painel) { this.painel.remove(); this.painel = null; }
    },
    el(tag, css, txt) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; },
    montar() {
      const C = window.SurittoCombate, g = this.g, U = this.ui = {};
      const P = this.painel = this.el('div', 'position:fixed;top:0;right:0;width:420px;height:100vh;overflow:auto;background:#1a1410;color:#e8d9b5;font:12px Outfit,sans-serif;padding:8px;z-index:99999;border-left:2px solid #8a6a3a;box-sizing:border-box');
      P.appendChild(this.el('div', 'font-weight:700;font-size:14px;color:#d4a04c', '🛠 Editor de pegada  (F9 fecha)'));
      P.appendChild(this.el('div', 'color:#a89a78;margin:2px 0 6px', 'Arraste a arma na imagem. Shift ou botão direito: gira. Roda: gira. Ctrl+roda: comprimento. Setas: 1 px.'));
      const cv = U.cv = this.el('canvas', `width:${PW}px;height:${PH}px;background:#2b2b2b;image-rendering:pixelated;cursor:move;display:block;border:1px solid #555`); cv.width = PW; cv.height = PH;
      P.appendChild(cv);
      this.ligarArraste(cv);
      const linha = (rot, ...els) => { const l = this.el('div', 'display:flex;gap:6px;align-items:center;margin:5px 0'); l.appendChild(this.el('span', 'width:62px;color:#a89a78', rot)); for (const e of els) l.appendChild(e); P.appendChild(l); return l; };
      const sel = (opts, val, fn) => { const s = this.el('select', 'flex:1;background:#2a2118;color:#e8d9b5;border:1px solid #555;padding:2px'); for (const [v, t] of opts) { const o = this.el('option', null, t); o.value = v; s.appendChild(o); } s.value = val; s.onchange = () => fn(s.value); return s; };
      const armas = Object.keys(C.FICHA).map(k => [k, ((g.inventory.itemDB[k] || {}).name || k) + ' (' + k + ')']);
      U.arma = sel(armas, this.arma, v => { this.arma = v; this.atualizarUI(); }); linha('Arma', U.arma);
      U.acao = sel([['parado', 'Parado'], ['andando', 'Andando'], ['golpe', 'Golpe / tiro (da própria arma)'], ['arremesso', 'Arremesso']], this.acao, v => { this.acao = v; this.atualizarUI(); }); linha('Ação', U.acao);
      const grade = this.el('div', 'display:grid;grid-template-columns:repeat(3,38px);gap:3px'); U.dirs = {};
      for (const [d, t] of GRADE) { const b = this.el('button', 'height:28px;background:#2a2118;color:#e8d9b5;border:1px solid #555;cursor:pointer;font-size:15px', t); if (d) { b.onclick = () => { this.d = d; this.atualizarUI(); }; U.dirs[d] = b; } else b.disabled = true; grade.appendChild(b); }
      linha('Direção', grade);
      U.prog = this.el('input'); U.prog.type = 'range'; U.prog.min = 0; U.prog.max = 1; U.prog.step = 0.01; U.prog.value = this.prog; U.prog.style.flex = '1'; U.prog.oninput = () => { this.prog = Number(U.prog.value); this.atualizarUI(); };
      U.quadro = this.el('span', 'width:90px;color:#d4a04c'); linha('Momento', U.prog, U.quadro);
      U.esc = sel([['quadro', 'Só este quadro'], ['direcao', 'Todos os quadros desta ação e direção']], this.escopo, v => { this.escopo = v; this.atualizarUI(); }); linha('Vale para', U.esc);
      const slider = (rot, i, min, max, step) => {
        const r = this.el('input'); r.type = 'range'; r.min = min; r.max = max; r.step = step; r.style.flex = '1';
        const n = this.el('input', 'width:56px;background:#2a2118;color:#e8d9b5;border:1px solid #555'); n.type = 'number'; n.step = step;
        r.oninput = () => this.mexer(i, Number(r.value)); n.onchange = () => this.mexer(i, Number(n.value));
        linha(rot, r, n); U['s' + i] = [r, n];
      };
      slider('Esq/Dir', 0, -40, 40, 0.5); slider('Cima/Baixo', 1, -40, 40, 0.5); slider('Giro °', 2, -180, 180, 1); slider('Compr. ×', 3, 0.2, 2, 0.01);
      U.ord = sel([['0', 'Normal'], ['1', 'Atrás do corpo'], ['2', 'Na frente do corpo']], '0', v => this.mexer(4, Number(v))); linha('Ordem', U.ord);
      const bt = (t, fn) => { const b = this.el('button', 'padding:5px 8px;background:#3a2d1c;color:#e8d9b5;border:1px solid #8a6a3a;cursor:pointer;border-radius:3px', t); b.onclick = fn; return b; };
      const bs = this.el('div', 'display:flex;flex-wrap:wrap;gap:6px;margin:8px 0');
      bs.appendChild(bt('Zerar este ajuste', () => this.gravar(ZERO.slice())));
      bs.appendChild(bt('Copiar p/ lado oposto (espelha)', () => this.espelhar()));
      U.salvar = bt('💾 Salvar no arquivo', () => this.salvar()); bs.appendChild(U.salvar);
      P.appendChild(bs);
      U.info = this.el('div', 'color:#a89a78;white-space:pre-wrap'); P.appendChild(U.info);
      document.body.appendChild(P);
    },
    atualizarUI() {
      const U = this.ui; if (!U.cv) return;
      const k = this.chave(), a = this.g.pegadaAjuste() || ZERO;
      U.arma.value = this.arma; U.acao.value = this.acao; U.esc.value = this.escopo; U.prog.value = this.prog;
      for (const d of Object.keys(U.dirs)) U.dirs[d].style.background = d === this.d ? '#8a6a3a' : '#2a2118';
      for (let i = 0; i < 4; i++) { const [r, n] = U['s' + i]; if (document.activeElement !== n) { r.value = a[i]; n.value = a[i]; } }
      U.ord.value = String(a[4] || 0);
      U.quadro.textContent = k ? `${k.acao} · quadro ${k.idx}` : '';
      U.salvar.textContent = this.sujo ? '💾 Salvar no arquivo *' : '💾 Salvar no arquivo';
    },
    desenharPreview() {
      const g = this.g, U = this.ui; if (!g || !U.cv) return;
      const c = U.cv.getContext('2d'); c.imageSmoothingEnabled = false; c.fillStyle = '#2b2b2b'; c.fillRect(0, 0, PW, PH);
      c.drawImage(g.canvas, this.px - SRC / 2, this.py - SRC * 0.78, SRC, SRC, 0, 0, PW, PH);
      const k = this.chave(); if (k && k.quadro !== this._ultQuadro) { this._ultQuadro = k.quadro; this.atualizarUI(); }
    },
    ligarArraste(cv) {
      let arr = null;
      cv.addEventListener('contextmenu', e => e.preventDefault());
      cv.addEventListener('mousedown', e => { arr = { x: e.clientX, y: e.clientY, gira: e.shiftKey || e.button === 2 }; e.preventDefault(); });
      window.addEventListener('mouseup', () => { arr = null; });
      window.addEventListener('mousemove', e => {
        if (!arr) return;
        const dx = (e.clientX - arr.x) / S * (PW / cv.clientWidth), dy = (e.clientY - arr.y) / S * (PH / cv.clientHeight); arr.x = e.clientX; arr.y = e.clientY;
        const a = this.efetivo();
        if (arr.gira) a[2] += dx * 2; else { a[0] += dx; a[1] += dy; }
        this.gravar(a);
      });
      cv.addEventListener('wheel', e => { e.preventDefault(); if (e.ctrlKey) this.mexer(3, e.deltaY < 0 ? 0.03 : -0.03, true); else this.mexer(2, e.deltaY < 0 ? 3 : -3, true); }, { passive: false });
    },
    espelhar() {
      const k = this.chave(), t = this.g.pegada[this.arma]; if (!k || !t) return;
      const origem = this.escopo === 'direcao' ? k.base : k.quadro, a = t[origem]; if (!a) return;
      const dOp = OPOSTA[this.d], de = this.d, idx = k.idx, acao = k.acao;
      const alvo = this.escopo === 'direcao' ? `${acao}_${dOp}` : `${acao}_${dOp}_${idx}`;
      t[alvo] = [-a[0], a[1], -a[2], a[3], a[4]]; this.sujo = true;
      this.ui.info.textContent = `Copiado ${de} → ${dOp} (${alvo}).`; this.atualizarUI();
    },
    async salvar() {
      try {
        const r = await fetch('/api/dev/pegada', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(this.g.pegada) });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this.sujo = false; this.ui.info.textContent = 'Salvo em assets/weapons/items/_pegada.json ✔'; this.atualizarUI();
      } catch (e) { this.ui.info.textContent = 'Não consegui salvar: ' + e.message + (/404/.test(e.message) ? '. O servidor está desatualizado: feche o servidor (porta 3000) e abra de novo, depois recarregue a página com Ctrl+F5. Seus ajustes continuam na tela.' : ' (o servidor precisa estar rodando).'); }
    }
  };

  // bloqueia o jogo (ataque, andar) enquanto o editor esta aberto
  for (const t of ['mousedown', 'mouseup', 'click', 'contextmenu', 'wheel']) {
    window.addEventListener(t, e => { if (E.ativo && e.target && e.target.tagName === 'CANVAS' && e.target !== E.ui.cv) e.stopImmediatePropagation(); }, true);
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'F9') { e.preventDefault(); E.ativo ? E.fechar() : E.abrir(); return; }
    if (!E.ativo) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') { if (e.target.type !== 'range') return; }
    if (e.key.startsWith('F') && e.key.length > 1 || e.ctrlKey || e.metaKey) return;
    e.stopImmediatePropagation();
    const k = e.key.toLowerCase();
    if (k === 'arrowleft') E.mexer(0, -1, true); else if (k === 'arrowright') E.mexer(0, 1, true);
    else if (k === 'arrowup') E.mexer(1, -1, true); else if (k === 'arrowdown') E.mexer(1, 1, true);
    else if (k === 'q') E.mexer(2, -5, true); else if (k === 'e') E.mexer(2, 5, true);
    else if (k === '[') E.mexer(3, -0.03, true); else if (k === ']') E.mexer(3, 0.03, true);
    else return;
    e.preventDefault();
  }, true);
  window.addEventListener('keyup', e => { if (E.ativo && !(e.key.startsWith('F') && e.key.length > 1)) { const t = e.target && e.target.tagName; if (t !== 'INPUT' && t !== 'SELECT') e.stopImmediatePropagation(); } }, true);
  if (/[?&]editor=1/.test(location.search)) window.addEventListener('load', () => setTimeout(() => E.abrir(), 2500));
})();
