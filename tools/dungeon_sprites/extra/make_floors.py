#!/usr/bin/env python3
"""Gera e acrescenta ao atlas os 4 pisos (losango 2:1 de 108x54, tileavel): madeira, pedra, pedra polida e taco.
Uso: python make_floors.py <pasta_assets_dungeon>   (le e REESCREVE dungeon_game_atlas.png/.json). Idempotente.
PNGs individuais em ./floors/. Cada tile e desenhado por pixel a partir de coordenadas (u,v) do plano, entao
a textura e continua entre tiles vizinhos."""
import sys, os, json, math
import numpy as np
from PIL import Image

root = sys.argv[1] if len(sys.argv) > 1 else '.'
jp = os.path.join(root, 'dungeon_game_atlas.json'); ip = os.path.join(root, 'dungeon_game_atlas.png')
data = json.load(open(jp, encoding='utf-8')); frames = data['frames']
NAMES = ['floor_wood_01', 'floor_stone_01', 'floor_stone_polished_01', 'floor_parquet_01']
if all(n in frames for n in NAMES):
    print('pisos ja presentes'); sys.exit(0)
HW, HH = 54, 27            # meia largura / meia altura do losango
here = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(here, 'floors'); os.makedirs(out, exist_ok=True)

def h2(a, b, s=0):          # hash deterministico -> [0,1)
    n = (int(a) * 374761393 + int(b) * 668265263 + s * 2147483647) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((n ^ (n >> 16)) & 0xFFFF) / 65536.0

def shade(c, k): return tuple(int(max(0, min(255, v * k))) for v in c)
def mix(a, b, t): return tuple(int(a[i] * (1 - t) + b[i] * t) for i in range(3))

def wood(u, v, px, py):
    rows = 6; r = int(v * rows); fv = v * rows - r
    off = h2(r, 1); uu = (u + off) % 1.0
    joint = (uu < 0.012) or (uu > 0.988)
    base = [(142, 106, 74), (130, 96, 66), (152, 114, 80), (120, 88, 62)][int(h2(r, 7) * 4)]
    c = shade(base, 1 + h2(r, 3) * 0.12 - 0.06)
    streak = h2(int(uu * 40), r, 5)
    if streak > 0.78: c = shade(c, 0.88)
    elif streak < 0.12: c = shade(c, 1.10)
    if fv < 0.14 or fv > 0.90: c = shade(c, 0.62)
    if 0.14 <= fv < 0.30: c = shade(c, 1.10)
    if joint: c = shade(c, 0.55)
    if (abs(uu - 0.06) < 0.012 or abs(uu - 0.94) < 0.012) and 0.4 < fv < 0.6: c = shade(c, 0.5)
    return c

def stone(u, v, px, py):
    N = 4; best = 9; second = 9; bid = (0, 0)
    for i in range(-1, N + 1):
        for j in range(-1, N + 1):
            ci, cj = i % N, j % N
            cx = (i + 0.5 + (h2(ci, cj, 11) - 0.5) * 0.7) / N; cy = (j + 0.5 + (h2(ci, cj, 12) - 0.5) * 0.7) / N
            d = math.hypot((u - cx) * N, (v - cy) * N)
            if d < best: second = best; best = d; bid = (ci, cj)
            elif d < second: second = d
    edge = second - best
    base = [(128, 123, 113), (118, 113, 104), (138, 133, 122), (108, 104, 96)][int(h2(*bid, 3) * 4)]
    c = shade(base, 0.92 + h2(px, py, 9) * 0.16)
    if edge < 0.10: c = (48, 46, 42)
    elif edge < 0.20: c = shade(c, 1.12)
    if h2(*bid, 21) > 0.82 and edge > 0.2 and h2(px, py, 4) > 0.55: c = mix(c, (86, 104, 60), 0.55)
    return c

def polished(u, v, px, py):
    N = 2; a = u * N; b = v * N; fu = a - int(a); fv = b - int(b); sid = (int(a) % N, int(b) % N)
    base = [(150, 152, 156), (158, 160, 164), (144, 146, 151), (154, 154, 160)][int(h2(*sid, 5) * 4)]
    c = shade(base, 0.97 + (fu + fv) * 0.03)
    if fu < 0.035 or fv < 0.035: c = (88, 90, 96)
    elif fu < 0.075 or fv < 0.075: c = shade(c, 1.12)
    elif fu > 0.965 or fv > 0.965: c = shade(c, 0.9)
    if h2(px, py, 14) > 0.985: c = (214, 216, 222)
    if abs(math.sin((u * 3 + v * 5) * math.pi * 2 + h2(*sid, 8) * 6)) > 0.985: c = shade(c, 0.88)
    return c

def parquet(u, v, px, py):
    N = 2; a = u * N; b = v * N; bi = int(a); bj = int(b); fu = a - bi; fv = b - bj
    orient = (bi + bj) % 2
    t = (fv if orient == 0 else fu) * 3; k = int(t); ft = t - k
    base = [(172, 128, 78), (160, 118, 70), (184, 140, 88), (150, 110, 64)][int(h2(bi * 3 + k, bj, 2 + orient) * 4)]
    c = shade(base, 0.96 + h2(px, py, 6) * 0.08)
    if ft < 0.12: c = shade(c, 0.58)
    elif ft < 0.28: c = shade(c, 1.10)
    along = (fu if orient == 0 else fv)
    if along < 0.05 or along > 0.95: c = shade(c, 0.6)
    if int(along * 14) % 5 == 0 and h2(bi, bj, k) > 0.5: c = shade(c, 0.94)
    return c

def render(fn):
    img = np.zeros((2 * HH, 2 * HW, 4), np.uint8)
    for py in range(2 * HH):
        for px in range(2 * HW):
            x = px + 0.5 - HW; y = py + 0.5 - HH
            if abs(x) / HW + abs(y) / HH > 1: continue
            u = ((x / HW + y / HH) / 2 + 0.5) % 1.0; v = ((y / HH - x / HW) / 2 + 0.5) % 1.0
            r, g, b = fn(u, v, px, py); img[py, px] = (r, g, b, 255)
    return Image.fromarray(img, 'RGBA')

tiles = {'floor_wood_01': render(wood), 'floor_stone_01': render(stone),
         'floor_stone_polished_01': render(polished), 'floor_parquet_01': render(parquet)}
for n, im in tiles.items(): im.save(os.path.join(out, n + '.png'))

atlas = Image.open(ip).convert('RGBA'); W = data['meta']['size']['w']; H0 = data['meta']['size']['h']
PAD = 2; x = PAD; y = H0 + PAD; placed = []
for n in NAMES:
    im = tiles[n]
    if x + im.width + PAD > W: x = PAD; y += 2 * HH + PAD
    placed.append((n, x, y, im)); x += im.width + PAD
newH = y + 2 * HH + PAD
while newH % 16: newH += 1
big = Image.new('RGBA', (W, newH), (0, 0, 0, 0)); big.paste(atlas, (0, 0))
for n, px, py, im in placed:
    big.paste(im, (px, py))
    frames[n] = {'frame': {'x': px, 'y': py, 'w': 2 * HW, 'h': 2 * HH}, 'anchor': {'x': HW, 'y': HH}, 'category': 'floors', 'kind': 'floor',
                 'axis': None, 'screenSlope': None, 'nativeSlope': None,
                 'ground': {'left': {'dx': -HW, 'dy': 0}, 'right': {'dx': HW, 'dy': 0}, 'front': {'dx': 0, 'dy': HH}, 'back': {'dx': 0, 'dy': -HH}},
                 'face': None, 'groundLengthPx': None, 'spriteWidthLengthPx': 2 * HW, 'columnHeightPx': 0}
data['meta']['size']['h'] = newH
big.save(ip); json.dump(data, open(jp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('pisos adicionados:', len(placed), 'atlas', big.size)
