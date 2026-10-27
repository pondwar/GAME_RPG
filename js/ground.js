// ground.js - Render do chao em blocos suaves (sem "chunks quadrados").
// Cada bloco (256px de mundo no zoom normal) e calculado a partir do TerrainModel: campos de elevacao/umidade/temperatura
// sao amostrados numa grade esparsa, interpolados por pixel, e viram textura de bioma (derivada das imagens grama/areia do jogo).
// Costa, praia, raso/fundo e espuma saem da "distancia estimada ate a costa" (e / |grad e|), por isso as margens sao retas e suaves.
// A agua e animada por baixo (padrao agua_tile rolando); os blocos so pintam tinta semitransparente por cima dela.
class GroundRenderer {
  static B = { PLAINS: 0, FOREST: 1, DENSE: 2, HILLS: 3, DESERT: 4, SHORE: 5, CANYON: 6, MOUNTAIN: 7, SNOW: 8 };
  static MEAN = [[140, 150, 72], [62, 112, 58], [32, 78, 48], [118, 112, 84], [214, 170, 100], [236, 214, 156], [168, 92, 64], [118, 112, 106], [238, 243, 250]];

  constructor(game) {
    this.game = game;
    this.cache = new Map(); this.quick = new Map(); this.job = null; this._deadline = Infinity;
    this.tiles = null; this.noise = this._makeNoise();
    this.maxFull = 150; this.maxQuick = 160;       // poucos canvases vivos (cada um e uma textura de GPU)
    this._frames = 0;
  }

  _makeNoise() {
    const S = 256, out = new Float32Array(S * S), hs = (x, y, s) => { let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(s, 1274126177); h = Math.imul(h ^ (h >>> 13), 1103515245); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
    for (const [cells, amp, seed] of [[32, 0.65, 3], [64, 0.35, 9]]) {
      const cs = S / cells;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const fx = x / cs, fy = y / cs, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
        const a = hs(ix % cells, iy % cells, seed), b = hs((ix + 1) % cells, iy % cells, seed), c = hs(ix % cells, (iy + 1) % cells, seed), d = hs((ix + 1) % cells, (iy + 1) % cells, seed);
        out[y * S + x] += amp * ((a + (b - a) * tx) + ((c + (d - c) * tx) - (a + (b - a) * tx)) * ty);
      }
    }
    return out;     // ~0..1
  }

  // Deriva os tiles de bioma das imagens carregadas (grama 512, areia 1024). Retorna false se ainda nao carregaram.
  _initTiles() {
    if (this.tiles) return true;
    const im = this.game.images, ok = (i) => i && i.complete && i.naturalWidth > 0;
    if (!ok(im.grass) || !ok(im.sand)) return false;
    const read = (img) => { const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return { d: x.getImageData(0, 0, c.width, c.height).data, s: c.width }; };
    const G = read(im.grass), S = read(im.sand), B = GroundRenderer.B;
    const cl = (v) => v < 0 ? 0 : (v > 255 ? 255 : v | 0);
    const mk = (src, fn) => {
      const n = src.s, base = new Uint32Array(n * n);
      for (let i = 0; i < n * n; i++) { const o = i * 4, c = fn(src.d[o], src.d[o + 1], src.d[o + 2]); base[i] = (255 << 24) | (cl(c[2]) << 16) | (cl(c[1]) << 8) | cl(c[0]); }
      const lods = [base]; let cur = base, sz = n;
      for (let L = 1; L < 3; L++) {                                  // mipmaps por media de caixa 2x2
        const ns = sz >> 1, nxt = new Uint32Array(ns * ns);
        for (let y = 0; y < ns; y++) for (let x = 0; x < ns; x++) {
          let r = 0, g = 0, b = 0;
          for (let k = 0; k < 4; k++) { const p = cur[(y * 2 + (k >> 1)) * sz + x * 2 + (k & 1)]; r += p & 255; g += (p >> 8) & 255; b += (p >> 16) & 255; }
          nxt[y * ns + x] = (255 << 24) | ((b >> 2) << 16) | ((g >> 2) << 8) | (r >> 2);
        }
        lods.push(nxt); cur = nxt; sz = ns;
      }
      return { size: n, lg: Math.round(Math.log2(n)), lods };
    };
    const lum = (r, g, b) => 0.3 * r + 0.59 * g + 0.11 * b;
    const t = [];
    t[B.PLAINS] = mk(G, (r, g, b) => [r * 1.8 + 8, g * 1.72 + 6, b * 1.45]);
    t[B.FOREST] = mk(G, (r, g, b) => [r * 0.88, g * 1.02, b * 0.88]);
    t[B.DENSE] = mk(G, (r, g, b) => [r * 0.52, g * 0.7, b * 0.6]);
    t[B.HILLS] = mk(G, (r, g, b) => { const l = lum(r, g, b); return [0.4 * r * 1.6 + 0.6 * (l * 1.45 + 38), 0.4 * g * 1.45 + 0.6 * (l * 1.4 + 36), 0.4 * b * 1.2 + 0.6 * (l * 1.2 + 26)]; });
    t[B.DESERT] = mk(S, (r, g, b) => [r * 1.0, g * 0.92, b * 0.8]);
    t[B.SHORE] = mk(S, (r, g, b) => [r * 1.03 + 6, g * 1.06 + 8, b * 1.08 + 12]);
    t[B.CANYON] = mk(S, (r, g, b) => [r * 0.78, g * 0.5, b * 0.38]);
    t[B.MOUNTAIN] = mk(S, (r, g, b) => { const l = lum(r, g, b) * 0.6; return [l * 1.06, l, l * 0.94]; });
    t[B.SNOW] = mk(S, (r, g, b) => { const k = 0.9 + 0.1 * lum(r, g, b) / 195; return [236 * k, 242 * k, 250 * k]; });
    this.tiles = t;
    return true;
  }

  _land(e, m, t, c) {
    const B = GroundRenderer.B;
    if (t < 0.17 || e > 0.95) return B.SNOW;
    if (c > 0.5 && e < 0.6) return B.CANYON;
    if (e > 0.72) return B.MOUNTAIN;
    if (e > 0.5) return B.HILLS;
    if (m < 0.30) return B.DESERT;
    if (m < 0.44) return B.PLAINS;
    if (m < 0.60) return B.FOREST;
    return B.DENSE;
  }

  // Renderiza um bloco. lod 0..2 (1 px = 2^lod px de mundo quando size=256). size: resolucao do canvas do bloco.
  _render(lod, bx, by, size, full) {      // versao sincrona (usa o gerador ate o fim)
    const it = this._renderGen(lod, bx, by, size, full); this._deadline = Infinity;
    let r; do { r = it.next(); } while (!r.done); return r.value;
  }
  // Gerador: pinta o bloco em fatias de linhas e cede (yield) quando o orcamento de tempo do frame acaba -> sem travadas ao andar
  *_renderGen(lod, bx, by, size, full) {
    const world = this.game.world, T = world.terrain, W = world.WORLD_WIDTH, H = world.WORLD_HEIGHT;
    const WS = 256 << lod, step = WS / 16, N = 19;                 // grade 19x19 (margem de 1 p/ gradiente)
    const E = new Float32Array(N * N), M = new Float32Array(N * N), TT = new Float32Array(N * N), C = new Float32Array(N * N), f = {};
    const ox = bx * WS, oy = by * WS;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let wx = ox + (i - 1) * step, wy = oy + (j - 1) * step;
      wx = ((wx % W) + W) % W; wy = wy < 0 ? 0 : (wy > H ? H : wy);
      T.field(wx / W, wy / H, f);
      const k = j * N + i; E[k] = f.e; M[k] = f.m; TT[k] = f.t; C[k] = f.c;
    }
    const NN = 17, G = new Float32Array(NN * NN), SH = new Float32Array(NN * NN);
    for (let j = 0; j < NN; j++) for (let i = 0; i < NN; i++) {
      const k = (j + 1) * N + (i + 1), dx = (E[k + 1] - E[k - 1]) / (2 * step), dy = (E[k + N] - E[k - N]) / (2 * step);
      G[j * NN + i] = Math.hypot(dx, dy); SH[j * NN + i] = -(dx + dy) * 0.7071;      // luz vinda do noroeste
    }
    const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
    const cx = cv.getContext('2d'), img = cx.createImageData(size, size), u32 = new Uint32Array(img.data.buffer);
    const tiles = (full && lod < 2) ? this.tiles : null, B = GroundRenderer.B, MEAN = GroundRenderer.MEAN, noise = this.noise;
    let wat = false;                                                // este bloco tem agua? (se nenhum visivel tiver, nao desenha a agua animada)
    const ppc = size / 16, wpp = WS / size;                          // pixels por celula, px de mundo por pixel
    const cl = (v) => v < 0 ? 0 : (v > 255 ? 255 : v);
    for (let py = 0; py < size; py++) {
      if ((py & 7) === 0 && py && performance.now() > this._deadline) yield 0;
      const fy = py / ppc, jy = Math.min(15, fy | 0), ty = fy - jy;
      for (let px = 0; px < size; px++) {
        const fx = px / ppc, ix = Math.min(15, fx | 0), tx = fx - ix;
        const k00 = (jy + 1) * N + ix + 1, k10 = k00 + 1, k01 = k00 + N, k11 = k01 + 1;
        const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
        const e = E[k00] * w00 + E[k10] * w10 + E[k01] * w01 + E[k11] * w11;
        const g0 = jy * NN + ix, g1 = g0 + 1, g2 = g0 + NN, g3 = g2 + 1;
        const g = Math.max(3e-7, G[g0] * w00 + G[g1] * w10 + G[g2] * w01 + G[g3] * w11);
        const nz = noise[(((by * size + py) & 255) << 8) | ((bx * size + px) & 255)] - 0.5;
        const dc = e / g, dn = dc + nz * 520;                            // dc: distancia (px de mundo) ate a costa; dn: com serrilhado organico (so p/ biomas)
        if (e < 0) {
          wat = true;
          // ---- AGUA: tinta por profundidade sobre a agua animada ----
          const dd = -dc - nz * 90; let r, gg, b, a;
          if (dd < 330) { const q = Math.max(0, dd) / 330; r = 238; gg = 250; b = 255; a = 0.80 * (1 - q) + 0.30 * q; }       // espuma
          else if (dd < 2600) { const q = (dd - 330) / 2270; r = 84 - 28 * q; gg = 216 - 44 * q; b = 208 - 8 * q; a = 0.30; }
          else if (dd < 8500) { const q = (dd - 2600) / 5900; r = 56 - 26 * q; gg = 172 - 62 * q; b = 200 - 25 * q; a = 0.30 + 0.12 * q; }
          else if (dd < 22000) { const q = (dd - 8500) / 13500; r = 30 - 14 * q; gg = 110 - 46 * q; b = 175 - 40 * q; a = 0.42 + 0.16 * q; }
          else { r = 16; gg = 64; b = 135; a = 0.58; }
          const dp = Math.min(1, Math.max(0, (-e - 0.10) / 0.25));
          if (dp > 0 && dd >= 330) { r += (8 - r) * dp; gg += (34 - gg) * dp; b += (92 - b) * dp; a += (0.78 - a) * dp; }
          u32[py * size + px] = ((a * 255) << 24) | (cl(b) << 16) | (cl(gg) << 8) | cl(r);
          continue;
        }
        // ---- TERRA ----
        const m = M[k00] * w00 + M[k10] * w10 + M[k01] * w01 + M[k11] * w11;
        const t = TT[k00] * w00 + TT[k10] * w10 + TT[k01] * w01 + TT[k11] * w11;
        const c = C[k00] * w00 + C[k10] * w10 + C[k01] * w01 + C[k11] * w11;
        const sh = SH[g0] * w00 + SH[g1] * w10 + SH[g2] * w01 + SH[g3] * w11;
        let bio, wet = 1;
        if (dn < 2700) { bio = t < 0.17 ? B.SNOW : B.SHORE; if (dn < 300) wet = 0.80 + 0.2 * Math.max(0, dn) / 300; }
        else { const am = lod ? 0.25 : 1; bio = this._land(Math.max(e + nz * 0.025 * am, 0.031), m + nz * 0.11 * am, t, c + nz * 0.2 * am); }
        let r, gg, b;
        if (tiles) {
          const tl = tiles[bio], sz = tl.size >> lod, lg = tl.lg - lod, gx = bx * size + px, gy = by * size + py;
          // quebra do padrao repetido: mistura suave com uma segunda amostra (transposta e deslocada), peso vindo de ruido em larga escala
          const arr = tl.lods[lod], mk = sz - 1;
          let tx = gx & mk, ty = gy & mk, p = arr[ty * sz + tx];
          const nw = noise[((((gy << lod) >> 5) & 255) << 8) | (((gx << lod) >> 5) & 255)];
          let w = (nw - 0.38) * 4.5; w = w < 0 ? 0 : (w > 1 ? 1 : w); w = w * w * (3 - 2 * w);
          if (w > 0.02) {
            const p2 = arr[(((tx + (sz >> 1) + 91) & mk) * sz) + ((ty + (sz >> 2) + 37) & mk)];
            const ar = p & 255, ag = (p >> 8) & 255, ab = (p >> 16) & 255;
            p = (255 << 24) | (((ab + (((p2 >> 16) & 255) - ab) * w) | 0) << 16) | (((ag + (((p2 >> 8) & 255) - ag) * w) | 0) << 8) | ((ar + ((p2 & 255) - ar) * w) | 0);
          }
          r = p & 255; gg = (p >> 8) & 255; b = (p >> 16) & 255;
        } else { const mc = MEAN[bio]; r = mc[0]; gg = mc[1]; b = mc[2]; }
        let s = 1 + sh * 14000; s = s < 0.72 ? 0.72 : (s > 1.28 ? 1.28 : s);
        if (bio === B.SHORE || bio === B.SNOW) s = 1 + (s - 1) * 0.35;
        s *= wet;
        // variacao suave em larga escala (quebra a repeticao do tile)
        s *= 0.86 + 0.09 * this._ns((bx * size + px) / 8, (by * size + py) / 8) + 0.20 * this._ns((bx * size + px) / 64, (by * size + py) / 64);
        u32[py * size + px] = (255 << 24) | (cl(b * s) << 16) | (cl(gg * s) << 8) | cl(r * s);
      }
    }
    cx.putImageData(img, 0, 0);
    cv._w = wat;
    return cv;
  }

  _ns(x, y) {                                                       // ruido do tile, interpolado (x,y em celulas do tile)
    const n = this.noise, ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const x0 = ix & 255, x1 = (ix + 1) & 255, y0 = (iy & 255) << 8, y1 = ((iy + 1) & 255) << 8;
    const a = n[y0 | x0], b = n[y0 | x1], c = n[y1 | x0], d = n[y1 | x1];
    return (a + (b - a) * fx) + ((c + (d - c) * fx) - (a + (b - a) * fx)) * fy;
  }

  _get(map, key, make, max) {
    let v = map.get(key);
    if (v) { map.delete(key); map.set(key, v); return v; }
    v = make(); map.set(key, v);
    if (map.size > max) map.delete(map.keys().next().value);
    return v;
  }

  // Desenha o chao. ctx ja esta com a escala do zoom aplicada em torno do centro da tela.
  draw(ctx, cam, cw, ch, zoom, scx, scy, now) {
    const world = this.game.world, W = world.WORLD_WIDTH, H = world.WORLD_HEIGHT, im = this.game.images;
    const ready = this._initTiles();
    const lod = zoom >= 0.55 ? 0 : (zoom >= 0.28 ? 1 : 2), WS = 256 << lod, nbx = Math.round(W / WS);
    const hw = cw / (2 * zoom), hh = ch / (2 * zoom);

    const bx0 = Math.floor((cam.x - hw) / WS), bx1 = Math.floor((cam.x + hw) / WS);
    const by0 = Math.max(0, Math.floor((cam.y - hh) / WS)), by1 = Math.min(Math.ceil(H / WS) - 1, Math.floor((cam.y + hh) / WS));
    const missing = [], list = [];
    for (let by = by0; by <= by1; by++) for (let bx = bx0; bx <= bx1; bx++) {
      const wbx = ((bx % nbx) + nbx) % nbx, key = lod + '|' + wbx + '|' + by;
      list.push({ bx, by, wbx, key });
      if (!this.cache.has(key)) missing.push({ wbx, by, key, d: Math.abs(bx * WS + WS / 2 - cam.x) + Math.abs(by * WS + WS / 2 - cam.y) });
    }
    // precisa da agua animada? so se algum bloco visivel tem agua (ou ainda nao foi gerado)
    let needWater = false;
    for (const b of list) { const cv0 = this.cache.get(b.key) || this.quick.get(b.key); if (!cv0 || cv0._w) { needWater = true; break; } }
    if (this.game.dbg && this.game.dbg.water === false) needWater = false;

    // 1) agua animada por baixo de tudo
    const wimg = im.water;
    if (!needWater) { /* so terra no campo de visao: pula 2 preenchimentos de tela cheia */ }
    else if (wimg && wimg.complete && wimg.naturalWidth > 0) {
      const pat = ctx.createPattern(wimg, 'repeat');
      if (pat) {
        const tw = wimg.width || 128, th = wimg.height || 128;
        const wx = Math.sin(now * 0.002) * 8, wy = (now * 0.008) % th;
        const ox = scx - (((cam.x + wx) % tw) + tw) % tw, oy = scy - (((cam.y + wy) % th) + th) % th;
        ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = pat;
        ctx.fillRect(scx - hw - 2 - ox, scy - hh - 2 - oy, hw * 2 + 4, hh * 2 + 4);
        ctx.restore();
      }
      // segunda camada de agua (escala/ritmo diferentes) so para quebrar o padrao repetido do tile
      const pat2 = ctx.createPattern(wimg, 'repeat');
      if (pat2 && pat2.setTransform) {
        const k = 1.37, tw2 = (wimg.width || 128) * k;
        pat2.setTransform(new DOMMatrix([k, 0, 0, k, scx - (((cam.x * 0.93 - now * 0.012) % tw2) + tw2) % tw2, scy - (((cam.y * 0.93 + now * 0.006) % tw2) + tw2) % tw2]));
        ctx.save(); ctx.globalAlpha = 0.34; ctx.fillStyle = pat2;
        ctx.fillRect(scx - hw - 2, scy - hh - 2, hw * 2 + 4, hh * 2 + 4); ctx.restore();
      }
    } else { ctx.fillStyle = '#1864ab'; ctx.fillRect(scx - hw - 2, scy - hh - 2, hw * 2 + 4, hh * 2 + 4); }

    // 2) blocos de terreno
    if (ready) {
      // fila: blocos visiveis + 1 de margem na direcao do movimento (pre-geracao), do mais perto para o mais longe
      const want = missing.slice();
      for (let by = by0 - 1; by <= by1 + 1; by++) for (let bx = bx0 - 1; bx <= bx1 + 1; bx++) {
        if (by < 0 || by > Math.ceil(H / WS) - 1) continue;
        if (bx >= bx0 && bx <= bx1 && by >= by0 && by <= by1) continue;
        const wbx = ((bx % nbx) + nbx) % nbx, key = lod + '|' + wbx + '|' + by;
        if (!this.cache.has(key)) want.push({ wbx, by, key, d: 1e6 + Math.abs(bx * WS + WS / 2 - cam.x) + Math.abs(by * WS + WS / 2 - cam.y) });
      }
      const t0 = performance.now(), budget = this._frames < 2 ? 120 : (missing.length ? 3.5 : 2.5);
      this._deadline = t0 + budget;
      want.sort((a, b) => a.d - b.d);
      while (performance.now() < this._deadline) {
        if (!this.job || (this.job.lod !== lod)) {
          const m = want.find(q => !this.cache.has(q.key)); if (!m) { this.job = null; break; }
          this.job = { key: m.key, lod, gen: this._renderGen(lod, m.wbx, m.by, lod === 2 ? 128 : 256, true) };
        }
        const r = this.job.gen.next();
        if (r.done) {
          this.cache.set(this.job.key, r.value); this.job = null;
          if (this.cache.size > this.maxFull) this.cache.delete(this.cache.keys().next().value);
        }
      }
    }
    this._frames++;
    ctx.imageSmoothingEnabled = true;
    for (const b of list) {
      let cv = this.cache.get(b.key);
      if (cv) { this.cache.delete(b.key); this.cache.set(b.key, cv); }        // LRU
      else cv = this._get(this.quick, b.key, () => this._render(lod, b.wbx, b.by, 32, false), this.maxQuick);
      const x0 = Math.round(b.bx * WS - cam.x + scx), y0 = Math.round(b.by * WS - cam.y + scy);
      const x1 = Math.round((b.bx + 1) * WS - cam.x + scx), y1 = Math.round((b.by + 1) * WS - cam.y + scy);
      ctx.drawImage(cv, x0, y0, x1 - x0, y1 - y0);
    }
  }
}
window.GroundRenderer = GroundRenderer;
