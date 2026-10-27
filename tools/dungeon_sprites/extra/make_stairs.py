#!/usr/bin/env python3
"""Gera e acrescenta ao atlas as escadas de 1 andar (madeira e pedra): 4 degraus, 2 tiles de comprimento, sobe 77 px.
Uso: python make_stairs.py <pasta_assets_dungeon>   (le e REESCREVE dungeon_game_atlas.png/.json). Idempotente.
Geometria (relativa ao centro H do tile ALTO): eixo a = (54,27) por tile ("\\"), eixo b = (-54,27). A escada ocupa
a em [-.5,1.5], b em [-.5,.5]; sobe em direcao a -a. Espelhando o sprite (flip) ela sobe em direcao a -b.
Ancora = centro do tile alto."""
import sys, os, json, math
import numpy as np
from PIL import Image, ImageDraw

root = sys.argv[1] if len(sys.argv) > 1 else '.'
jp = os.path.join(root, 'dungeon_game_atlas.json'); ip = os.path.join(root, 'dungeon_game_atlas.png')
data = json.load(open(jp, encoding='utf-8')); frames = data['frames']
NAMES = ['stair_wood_01', 'stair_stone_01']
if all(n in frames for n in NAMES):
    print('escadas ja presentes'); sys.exit(0)
STEP_H = 77; NSTEPS = 4
W, H, OX, OY = 165, 162, 55, 105
here = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(here, 'stairs'); os.makedirs(out, exist_ok=True)

def h2(a, b, s=0):
    n = (int(a) * 374761393 + int(b) * 668265263 + s * 2147483647) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((n ^ (n >> 16)) & 0xFFFF) / 65536.0
def shade(c, k): return tuple(int(max(0, min(255, v * k))) for v in c)
def proj(a, b, z): return (OX + 54 * (a - b), OY + 27 * (a + b) - z)

# ---- texturas: cada funcao recebe coordenadas da face e devolve cor ----
def wood_top(a, bb, a0, a1, px, py):
    t = (a - a0) / (a1 - a0); idx = min(1, int(t * 2)); f = t * 2 - idx
    base = [(150, 112, 78), (138, 102, 70)][(idx + int(a0 * 2)) % 2]
    c = shade(base, 0.95 + h2(px, py, 3) * 0.10)
    if h2(int((bb + .5) * 30), idx, 5) > 0.8: c = shade(c, 0.9)
    if f < 0.10 or f > 0.93: c = shade(c, 0.6)
    elif f < 0.22: c = shade(c, 1.12)
    if abs(bb) > 0.42 and abs(f - 0.5) < 0.2: c = shade(c, 0.78)          # pregos nas pontas
    return c
def wood_riser(bb, z, px, py):
    i = int((bb + .5) * 4.0); f = (bb + .5) * 4.0 - i
    c = shade([(112, 80, 56), (104, 74, 52), (118, 86, 60), (108, 78, 54)][i % 4], 0.95 + h2(px, py, 4) * 0.10)
    if f < 0.12 or f > 0.9: c = shade(c, 0.6)
    if h2(i, int(z / 5), 8) > 0.82: c = shade(c, 0.86)
    return c
def wood_side(a, z, px, py):
    c = shade((92, 66, 46), 0.94 + h2(px, py, 6) * 0.12)
    if int(z / 5.0) % 3 == 0 and h2(int(a * 8), int(z / 5), 3) > 0.45: c = shade(c, 0.86)
    if h2(int(a * 12), int(z / 3), 9) > 0.9: c = shade(c, 1.12)
    return c
def stone_top(a, bb, a0, a1, px, py):
    t = (a - a0) / (a1 - a0); idx = min(1, int(t * 2)); f = t * 2 - idx
    base = [(140, 136, 126), (130, 126, 117)][(idx + int(a0 * 2)) % 2]
    c = shade(base, 0.94 + h2(px, py, 7) * 0.12)
    if f < 0.10 or f > 0.94: c = shade(c, 0.62)
    elif f < 0.22: c = shade(c, 1.12)
    if h2(px // 3, py // 3, 12) > 0.975: c = (96, 112, 66)          # musgo
    return c
def brick(u, z, off_seed, px, py, rowh=9.0, brickw=0.34):
    r = int(z / rowh); fr = z / rowh - r
    uu = u / brickw + (0.5 if r % 2 else 0.0); i = int(math.floor(uu)); fu = uu - i
    base = [(122, 118, 108), (112, 108, 100), (132, 128, 118), (104, 100, 93)][int(h2(i, r, off_seed) * 4)]
    c = shade(base, 0.93 + h2(px, py, 9) * 0.14)
    if fr < 0.14 or fu < 0.07: c = shade(c, 0.55)
    elif fr > 0.88: c = shade(c, 1.08)
    if h2(i, r, off_seed + 4) > 0.9 and h2(px, py, 2) > 0.5: c = (98, 114, 68)
    return c
def stone_riser(bb, z, px, py): return shade(brick(bb + 5, z, 1, px, py), 0.92)
def stone_side(a, z, px, py): return shade(brick(a + 5, z, 2, px, py), 0.74)

def render(kind):
    img = np.zeros((H, W, 4), np.uint8); fid = np.zeros((H, W), np.int32); nid = 0
    def fill(poly, fn, shd):
        nonlocal nid
        nid += 1
        m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(poly, fill=255)
        ys, xs = np.nonzero(np.array(m))
        for y, x in zip(ys, xs):
            c = fn(x, y)
            img[y, x] = (*shade(c, shd), 255); fid[y, x] = nid
    for k in range(NSTEPS - 1, -1, -1):
        a1 = 1.5 - 0.5 * k; a0 = a1 - 0.5; hz = int(round(STEP_H * (k + 1) / NSTEPS)); lo, hi = -.5, .5
        # lado (b=+.5) -> coordenadas (a, z)
        side = [proj(a0, hi, 0), proj(a1, hi, 0), proj(a1, hi, hz), proj(a0, hi, hz)]
        def fs(x, y, hz=hz):
            a = (x - OX) / 54.0 + hi; z = 27 * (a + hi) - (y - OY)
            return (wood_side if kind == 'wood' else stone_side)(a, z, x, y)
        fill(side, fs, 1.0)
        riser = [proj(a1, lo, 0), proj(a1, hi, 0), proj(a1, hi, hz), proj(a1, lo, hz)]
        def fr(x, y, a1=a1):
            bb = a1 - (x - OX) / 54.0; z = 27 * (a1 + bb) - (y - OY)
            return (wood_riser if kind == 'wood' else stone_riser)(bb, z, x, y)
        fill(riser, fr, 1.0)
        top = [proj(a0, lo, hz), proj(a1, lo, hz), proj(a1, hi, hz), proj(a0, hi, hz)]
        def ft(x, y, a0=a0, a1=a1, hz=hz):
            s = (x - OX) / 54.0; t = (y - OY + hz) / 27.0          # s=a-b ; t=a+b
            a = (s + t) / 2; bb = (t - s) / 2
            return (wood_top if kind == 'wood' else stone_top)(a, bb, a0, a1, x, y)
        fill(top, ft, 1.12)
    # contorno 1 px: onde o vizinho de cima/esquerda e de outra face (ou vazio) escurece
    ol = (36, 26, 20) if kind == 'wood' else (38, 38, 42)
    o = img.copy()
    for y in range(H):
        for x in range(W):
            if not img[y, x, 3]: continue
            for dy, dx in ((-1, 0), (0, -1), (1, 0), (0, 1)):
                yy, xx = y + dy, x + dx
                other = (yy < 0 or xx < 0 or yy >= H or xx >= W or fid[yy, xx] == 0)
                if other: o[y, x] = (*ol, 255); break
                if fid[yy, xx] != fid[y, x] and (dy < 0 or dx < 0): o[y, x] = (*shade(ol, 1.4), 255); break
    return Image.fromarray(o, 'RGBA')

tiles = {'stair_wood_01': render('wood'), 'stair_stone_01': render('stone')}
for n, im in tiles.items(): im.save(os.path.join(out, n + '.png'))
atlas = Image.open(ip).convert('RGBA'); AW = data['meta']['size']['w']; H0 = data['meta']['size']['h']
big = Image.new('RGBA', (AW, ((H0 + H + 4 + 15) // 16) * 16), (0, 0, 0, 0)); big.paste(atlas, (0, 0))
x = 2; y = H0 + 2
for n, im in tiles.items():
    big.paste(im, (x, y))
    frames[n] = {'frame': {'x': x, 'y': y, 'w': W, 'h': H}, 'anchor': {'x': OX, 'y': OY}, 'category': 'stairs', 'kind': 'stair',
                 'axis': None, 'screenSlope': None, 'nativeSlope': None,
                 'ground': {'left': {'dx': -54, 'dy': 0}, 'right': {'dx': 54, 'dy': 0}, 'front': {'dx': 0, 'dy': 27}, 'back': {'dx': 0, 'dy': -27}},
                 'face': None, 'groundLengthPx': None, 'spriteWidthLengthPx': W, 'columnHeightPx': STEP_H, 'rise': STEP_H}
    x += W + 2
data['meta']['size']['h'] = big.height
big.save(ip); json.dump(data, open(jp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('escadas adicionadas; atlas', big.size)
