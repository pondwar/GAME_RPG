// terrain.js - Modelo de terreno de Suritto: um "Marte terraformado" (continuo, sem blocos).
// Entrada: u (0..1, longitude, com volta em X) e v (0..1, 0 = polo norte, 1 = polo sul).
// Saida: e (elevacao, nivel do mar = 0), m (umidade 0..1), t (temperatura 0..1), c (cânion 0..1) e o bioma.
// Tudo e funcao pura de (u,v): o mundo e o mapa sempre concordam. Para mexer na geografia, edite BLOBS / SEAS / MOUNTS abaixo.
class TerrainModel {
  constructor(W, H) {
    this.W = W; this.H = H; this.A = W / H;      // A = proporcao do mundo (largura/altura)
    this.seed = 20241021;
  }

  // ---- ruido de valor, periodico em u (o planeta e redondo) ----
  _h(ix, iy, s) {
    let h = (Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(s + 1, 2147483647) ^ this.seed) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  _vn(u, v, nx, ny, s) {
    const x = u * nx, y = v * ny, ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const sx = fx * fx * fx * (fx * (fx * 6 - 15) + 10), sy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
    const x0 = ((ix % nx) + nx) % nx, x1 = (x0 + 1) % nx;
    const a = this._h(x0, iy, s), b = this._h(x1, iy, s), c = this._h(x0, iy + 1, s), d = this._h(x1, iy + 1, s);
    return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy;
  }
  // fbm com comprimento de onda base em pixels de mundo
  _fbm(u, v, lambda, oct, s) {
    let sum = 0, amp = 1, tot = 0, l = lambda;
    for (let k = 0; k < oct; k++) {
      const nx = Math.max(1, Math.round(this.W / l)), ny = Math.max(1, Math.round(this.H / l));
      sum += amp * this._vn(u, v, nx, ny, s + k * 7); tot += amp; amp *= 0.5; l *= 0.5;
    }
    return sum / tot;
  }
  _ridged(u, v, lambda, oct, s) {
    let sum = 0, amp = 1, tot = 0, l = lambda;
    for (let k = 0; k < oct; k++) {
      const nx = Math.max(1, Math.round(this.W / l)), ny = Math.max(1, Math.round(this.H / l));
      const n = 1 - Math.abs(2 * this._vn(u, v, nx, ny, s + k * 11) - 1);
      sum += amp * n * n; tot += amp; amp *= 0.5; l *= 0.5;
    }
    return sum / tot;
  }

  _du(u, c) { let d = u - c; d -= Math.round(d); return d; }          // diferenca em u com volta
  _bump(u, v, cu, cv, ru, rv) {                                       // morro suave de suporte compacto (elipse em uv)
    const du = this._du(u, cu) / ru, dv = (v - cv) / rv, d2 = du * du + dv * dv;
    if (d2 >= 1) return 0; const q = 1 - d2; return q * q;
  }
  _segDist(u, v, a, b) {                                              // distancia (em unidades de v) de (u,v) ao segmento a-b
    const A = this.A, px = this._du(u, a[0]) * A, py = v - a[1], bx = this._du(b[0], a[0]) * A, by = b[1] - a[1];
    const L2 = bx * bx + by * by; let t = L2 ? (px * bx + py * by) / L2 : 0; t = t < 0 ? 0 : (t > 1 ? 1 : t);
    return Math.hypot(px - bx * t, py - by * t);
  }

  // Massas de terra [centro u, centro v, raio u, raio v] (layout inspirado no mapa-arte do jogo)
  static BLOBS = [
    [0.20, 0.25, 0.12, 0.17], [0.21, 0.47, 0.12, 0.21], [0.15, 0.72, 0.12, 0.19], [0.27, 0.86, 0.12, 0.12],
    [0.33, 0.60, 0.13, 0.20], [0.37, 0.25, 0.07, 0.12], [0.67, 0.26, 0.13, 0.12], [0.79, 0.46, 0.10, 0.16],
    [0.86, 0.60, 0.07, 0.13], [0.65, 0.79, 0.18, 0.20], [0.51, 0.90, 0.15, 0.10], [0.47, 0.50, 0.08, 0.18],
    [0.956, 0.295, 0.045, 0.085], [0.055, 0.20, 0.02, 0.04], [0.50, 1.00, 0.55, 0.12], [0.58, 0.45, 0.09, 0.10],
    [0.065, 0.36, 0.085, 0.15]
  ];
  // Mares / baias interiores [centro u, centro v, raio u, raio v, profundidade]
  static SEAS = [
    [0.505, 0.305, 0.07, 0.11, 1.0], [0.555, 0.205, 0.075, 0.065, 0.9], [0.395, 0.80, 0.03, 0.05, 0.9],
    [0.905, 0.31, 0.03, 0.20, 1.0], [0.955, 0.80, 0.07, 0.30, 1.0], [0.045, 0.62, 0.05, 0.25, 1.0],
    [0.975, 0.50, 0.04, 0.45, 1.0]
  ];
  // Valles Marineris: canal curvo (polilinha em uv) com largura em unidades de v
  static CHANNEL = { pts: [[0.50, 0.79], [0.52, 0.67], [0.58, 0.555], [0.66, 0.475], [0.74, 0.45], [0.805, 0.50]], w: 0.014 };
  static HELLAS = { u: 0.70, v: 0.73, island: 0.085, sea: 0.145 };   // raios em unidades de v
  // Altiplanos / vulcoes [cu, cv, ru, rv, altura]
  static MOUNTS = [
    [0.27, 0.48, 0.10, 0.15, 0.55],   // Tharsis
    [0.79, 0.43, 0.10, 0.12, 0.60],   // Arcadia Mentes
    [0.885, 0.60, 0.05, 0.13, 0.55],  // Cordilheira Erythraeen
    [0.20, 0.22, 0.05, 0.075, 1.15],  // Olympus Mons
    [0.60, 0.88, 0.09, 0.07, 0.45]
  ];

  // Amostra o terreno em (u,v). Devolve numeros; o bioma sai de classify().
  field(u, v, out) {
    const A = this.A, B = TerrainModel.BLOBS;
    // deformacao organica das coordenadas (costas nao ficam "geometricas")
    const wu = u + (this._fbm(u, v, 700000, 2, 31) - 0.5) * 0.045, wv = v + (this._fbm(u, v, 700000, 2, 47) - 0.5) * 0.045;
    // terra
    let keep = 1;
    for (let i = 0; i < B.length; i++) { const b = this._bump(wu, wv, B[i][0], B[i][1], B[i][2], B[i][3]); if (b > 0) keep *= (1 - b); }
    const L = 1 - keep;
    let e = (L - 0.30) * 1.25;
    // mares interiores
    const S = TerrainModel.SEAS; let carve = 0;
    for (let i = 0; i < S.length; i++) { const b = this._bump(wu, wv, S[i][0], S[i][1], S[i][2], S[i][3]); if (b > 0) carve = Math.max(carve, b * S[i][4]); }
    // oceano do norte (Oceanus Borealis), menos sobre Arcadia/Valoria
    const north = this._smooth(0.20, 0.115, wv) * (1 - 0.85 * this._bump(wu, wv, 0.20, 0.14, 0.13, 0.11));
    carve = Math.max(carve, north * 1.2);
    // canal Valles Marineris
    const ch = TerrainModel.CHANNEL; let cd = 9;
    for (let i = 0; i < ch.pts.length - 1; i++) cd = Math.min(cd, this._segDist(wu, wv, ch.pts[i], ch.pts[i + 1]));
    const widen = 1 + 0.5 * this._fbm(u, v, 90000, 2, 61);
    const chv = this._smooth(ch.w * widen * 2.1, ch.w * widen * 0.6, cd);
    carve = Math.max(carve, chv * 1.0);
    // Mar de Hellas (anel de agua em volta de uma ilha)
    const H0 = TerrainModel.HELLAS, hr = Math.hypot(this._du(wu, H0.u) * A, wv - H0.v);
    const ring = this._smooth(H0.sea + 0.012, H0.sea - 0.006, hr) * this._smooth(H0.island - 0.012, H0.island + 0.006, hr);
    carve = Math.max(carve, ring * 1.1);
    e -= carve * 1.25;
    // relevo: altiplanos e vulcoes + ruido de cordilheiras
    const rid = this._ridged(u, v, 260000, 5, 83);
    let hm = 0;
    const M = TerrainModel.MOUNTS;
    for (let i = 0; i < M.length; i++) { const b = this._bump(wu, wv, M[i][0], M[i][1], M[i][2], M[i][3]); if (b > 0) hm += b * M[i][4]; }
    const land = e > 0 ? 1 : 0;
    e += hm * 0.55 * (0.35 + 0.65 * rid) * (e > -0.1 ? 1 : 0.3);
    // ondulacao geral (fractal) para costas e colinas
    const n = this._fbm(u, v, 300000, 6, 5) - 0.5;
    e += n * (0.16 + 0.10 * Math.min(1, Math.max(0, e)));
    // cruzar o equador do relevo: bacias secas
    const lat = 90 - v * 180, alat = Math.abs(lat);
    // temperatura
    let t = Math.pow(Math.max(0, Math.cos(lat * Math.PI / 180)), 1.15) - 0.45 * Math.max(0, e - 0.35);
    // umidade: umido perto do mar (e baixo), seco no interior alto e nas faixas desérticas
    let m = 0.58 - 0.55 * Math.min(1, Math.max(0, e)) + (this._fbm(u, v, 260000, 4, 91) - 0.5) * 0.55;
    m -= 0.26 * Math.exp(-Math.pow((lat - 22) / 12, 2)) + 0.24 * Math.exp(-Math.pow((lat + 24) / 12, 2));
    m += 0.10 * Math.exp(-Math.pow(lat / 12, 2));
    // canion: margens do canal e Tharsis
    let c = this._smooth(ch.w * 6.5, ch.w * 2.6, cd);
    const th = this._bump(wu, wv, 0.30, 0.50, 0.075, 0.09) * this._ridged(u, v, 60000, 3, 17);
    c = Math.max(c, th > 0.38 ? 1 : 0);
    out.e = e; out.m = m; out.t = t; out.c = c; out.carve = carve; out.cd = cd; out.hr = hr; out.wu = wu; out.wv = wv;
    return out;
  }

  _smooth(a, b, x) { let t = (x - a) / (b - a); t = t < 0 ? 0 : (t > 1 ? 1 : t); return t * t * (3 - 2 * t); }   // 0 em a, 1 em b

  // Bioma a partir dos campos. e: nivel do mar = 0.
  classify(e, m, t, c) {
    if (e < 0) return e < -0.30 ? 'deep' : (e < -0.12 ? 'ocean' : 'water');
    if (e < 0.03) return t < 0.17 ? 'snow' : 'shore';
    if (t < 0.17 || e > 0.95) return 'snow';
    if (c > 0.5 && e < 0.6) return 'canyon';
    if (e > 0.72) return 'mountain';
    if (e > 0.50) return 'hills';
    if (m < 0.30) return 'desert';
    if (m < 0.44) return 'plains';
    if (m < 0.60) return 'forest';
    return 'dense_forest';
  }
}
window.TerrainModel = TerrainModel;
