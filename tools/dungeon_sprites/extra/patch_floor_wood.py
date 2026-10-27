#!/usr/bin/env python3
"""Redesenha o tile floor_wood_01 (108x54) in-place no atlas: tabuas longas (5 fileiras), UMA linha de junta por
fileira (a versao antiga tinha banda dupla na borda do tile + marcas de prego repetidas = aspecto de textura sobreposta).
Uso: python patch_floor_wood.py <pasta_assets_dungeon>. Idempotente (flag woodFloorV2 no json)."""
import sys, os, json
import numpy as np
from PIL import Image
root = sys.argv[1] if len(sys.argv) > 1 else '.'
jp = os.path.join(root, 'dungeon_game_atlas.json'); ip = os.path.join(root, 'dungeon_game_atlas.png')
data = json.load(open(jp, encoding='utf-8')); fr = data['frames']['floor_wood_01']
if fr.get('woodFloorV2'): print('ja aplicado'); sys.exit(0)
HW, HH = 54, 27
def h2(a, b, s=0):
    n = (int(a) * 374761393 + int(b) * 668265263 + s * 2147483647) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((n ^ (n >> 16)) & 0xFFFF) / 65536.0
def shade(c, k): return tuple(int(max(0, min(255, v * k))) for v in c)
BASES = [(146, 108, 74), (136, 100, 68), (154, 116, 80), (128, 94, 64), (141, 104, 72)]
ROWS = 5
def wood(u, v):
    r = int(v * ROWS) % ROWS; fv = v * ROWS - int(v * ROWS)
    j1 = [0.0, 0.4, 0.8, 0.2, 0.6][r]                   # uma tabua longa por fileira (1 tile), juntas escalonadas
    d1 = min(abs(u - j1), 1 - abs(u - j1)); d2 = 9; seg = 0
    base = BASES[int(h2(r, seg, 7) * len(BASES))]
    c = shade(base, 0.97 + h2(r, seg, 3) * 0.06)
    g = h2(int(u * 22), r * 2 + seg, 5)                 # veio curto, bem sutil
    if g > 0.86: c = shade(c, 0.93)
    elif g < 0.08: c = shade(c, 1.05)
    if fv < 0.12: c = shade(c, 0.58)                   # unica linha de emenda entre fileiras
    elif fv < 0.26: c = shade(c, 1.07)
    if d1 < 0.011 or d2 < 0.011: c = shade(c, 0.6)      # junta de topo
    return c
img = np.zeros((2 * HH, 2 * HW, 4), np.uint8)
for py in range(2 * HH):
    for px in range(2 * HW):
        x = px + 0.5 - HW; y = py + 0.5 - HH
        if abs(x) / HW + abs(y) / HH > 1: continue
        u = ((x / HW + y / HH) / 2 + 0.5) % 1.0; v = ((y / HH - x / HW) / 2 + 0.5) % 1.0
        r, g, b = wood(u, v); img[py, px] = (r, g, b, 255)
tile = Image.fromarray(img, 'RGBA')
atlas = Image.open(ip).convert('RGBA'); f = fr['frame']
# limpa o retangulo e cola
atlas.paste(Image.new('RGBA', (f['w'], f['h']), (0, 0, 0, 0)), (f['x'], f['y'])); atlas.paste(tile, (f['x'], f['y']))
atlas.save(ip); fr['woodFloorV2'] = True
json.dump(data, open(jp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
here = os.path.dirname(os.path.abspath(__file__)); os.makedirs(os.path.join(here, 'floors'), exist_ok=True)
tile.save(os.path.join(here, 'floors', 'floor_wood_01.png')); print('piso de madeira v2 aplicado')
