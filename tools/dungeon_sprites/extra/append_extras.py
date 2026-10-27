#!/usr/bin/env python3
"""Acrescenta ao atlas do jogo as pecas EXTRAS geradas a partir da arte existente (mesmo tema):
  door_stone_01/_ajar_01/_open_01       porta de pedra (recolor da porta de madeira)
  portal_stone_01/_ajar_01/_open_01     arco de pedra + folha de porta (fechado, entreaberto, aberto)
  portal_wood_01/_ajar_01/_open_01      arco de madeira + folha de porta
Uso:  python append_extras.py <pasta_assets_dungeon>   (le e REESCREVE dungeon_game_atlas.png/.json la dentro)
Idempotente: se as pecas ja existem no atlas, nao faz nada. PNGs individuais ficam em ./extra/.
"""
import sys, os, json, colorsys, random
import numpy as np
from PIL import Image

root = sys.argv[1] if len(sys.argv) > 1 else '.'
jpath = os.path.join(root, 'dungeon_game_atlas.json'); ipath = os.path.join(root, 'dungeon_game_atlas.png')
data = json.load(open(jpath, encoding='utf-8')); frames = data['frames']
atlas = Image.open(ipath).convert('RGBA')
here = os.path.dirname(os.path.abspath(__file__)); outdir = os.path.join(here, 'extra'); os.makedirs(outdir, exist_ok=True)
COS = data['meta'].get('cosAngle', 0.894)

NEW = ['door_stone_01', 'door_stone_ajar_01', 'door_stone_open_01',
       'portal_stone_01', 'portal_wood_01', 'portal_stone_wide_01', 'portal_wood_wide_01']
EXTRA_W = 40   # px a mais de largura no portal duplo (multiplo de 4)
if all(n in frames for n in NEW):
    print('extras ja presentes, nada a fazer'); sys.exit(0)

def spr(n):
    f = frames[n]['frame']; return atlas.crop((f['x'], f['y'], f['x'] + f['w'], f['y'] + f['h']))

# ---------- porta de pedra: recolor da madeira ----------
def stone(img, seed=1):
    rnd = random.Random(seed); a = np.array(img).astype(float); out = a.copy(); H, W = a.shape[:2]
    for y in range(H):
        for x in range(W):
            if a[y, x, 3] == 0: continue
            r, g, b = a[y, x, :3] / 255; h, s, v = colorsys.rgb_to_hsv(r, g, b)
            if s > 0.18 and 0.02 < h < 0.16:
                L = 0.299 * r + 0.587 * g + 0.114 * b
                L = 0.20 + 0.95 * (L - 0.10)
                if int(y - 0.5 * x + 1000) % 17 == 0: L *= 0.78       # junta na diagonal 2:1
                L *= 1 + rnd.uniform(-0.05, 0.05)
                out[y, x, :3] = np.clip(np.array([L * 1.02, L * 0.99, L * 0.93]) * 255, 0, 255)
    return Image.fromarray(out.astype('uint8'), 'RGBA')

# ---------- portal: arco + folha ----------
def opening(arch):
    a = np.array(arch); al = a[..., 3] > 200; H, W = al.shape
    row = int(H * 0.62); runs = []; x = 0
    while x < W:
        if al[row, x]:
            s = x
            while x < W and al[row, x]: x += 1
            runs.append((s, x - 1))
        else: x += 1
    b = runs[0][1]; c = runs[-1][0]
    yb = max(y for y in range(H) if al[y, b])
    top = []
    for x in range(b + 1, c):
        y = 0
        while y < H and not al[y, x]: y += 1
        while y < H and al[y, x]: y += 1
        top.append(y)
    return b, c, yb, top, al

def build(arch, door, state):
    b, c, yb, top, al = opening(arch); a = np.array(arch).copy(); H, W = al.shape
    dr = np.array(door); dh, dw = dr.shape[:2]; dl0, dl1 = 7, dw - 9
    ow = c - b - 1; frac = {'closed': 1.0, 'ajar': 0.38, 'open': 0.0}[state]
    if frac > 0:
        for i, x in enumerate(range(b + 1, c)):
            u = i / ow
            if u > frac: break
            sx = dl0 + int((u / frac) * (dl1 - dl0 - 1)); yl = yb + 0.5 * (x - b)
            for y in range(top[i], int(yl) + 1):
                if y < 0 or y >= H or al[y, x]: continue
                sy = int(round(y - yl + (87 + 0.5 * sx)))
                while sy < 4: sy += 30
                sy = min(sy, dh - 3); px = dr[sy, sx]
                if px[3] < 200: px = dr[min(sy + 3, dh - 3), sx]
                a[y, x] = px; a[y, x, 3] = 255
    return Image.fromarray(a, 'RGBA')

def to_wood(img, seed=3):
    rnd = random.Random(seed); a = np.array(img).astype(float); out = a.copy(); H, W = a.shape[:2]
    for y in range(H):
        for x in range(W):
            if a[y, x, 3] < 200: continue
            r, g, b = a[y, x, :3] / 255; L = 0.299 * r + 0.587 * g + 0.114 * b
            L = 0.06 + 0.78 * L; L *= 1 + rnd.uniform(-0.04, 0.04)
            if x % 7 == 0: L *= 0.84
            out[y, x, :3] = np.clip(np.array([L * 1.12, L * 0.78, L * 0.52]) * 255, 0, 255)
    return Image.fromarray(out.astype('uint8'), 'RGBA')

wood_door = spr('door_wood_01'); arch = spr('arch_stone_01'); warch = None
sprites = {}
for st, w in [('', 'door_wood_01'), ('_ajar', 'door_wood_ajar_01'), ('_open', 'door_wood_open_01')]:
    sprites['door_stone%s_01' % st] = stone(spr(w))
wa = to_wood(arch)

def widen(img, E):
    # abre o arco no meio: repete colunas do topo (ajustadas a inclinacao 2:1) e desce a metade direita E/2 px
    a = np.array(img); H, W = a.shape[:2]; al = a[..., 3] > 200
    b, c, yb, top, _ = opening(img); xm = (b + c) // 2
    def topy(x):
        y = 0
        while y < H and not al[y, x]: y += 1
        return y
    ty0 = topy(xm); out = np.zeros((H + E // 2, W + E, 4), dtype=np.uint8)
    out[:H, :xm] = a[:, :xm]                                  # metade esquerda
    out[E // 2:E // 2 + H, xm + E:] = a[:, xm:]               # metade direita, mais baixa e mais a direita
    cyc = [xm]
    for j in range(E):
        s_ = cyc[j % len(cyc)]; dev = topy(s_) - (ty0 + 0.5 * (s_ - xm)) if topy(s_) < H else 0
        col = a[:, s_]; off = int(round(0.5 * j - dev))      # linha reta 2:1 atravessando o topo
        for y in range(H):
            if col[y, 3] and 0 <= y + off < out.shape[0]: out[y + off, xm + j] = col[y]
    # a coluna do meio inserida deve respeitar a inclinacao: a direita parte do nivel certo (E/2)
    return Image.fromarray(out, 'RGBA')

sprites['portal_stone_01'] = arch.copy(); sprites['portal_wood_01'] = wa
sprites['portal_stone_wide_01'] = widen(arch, EXTRA_W); sprites['portal_wood_wide_01'] = widen(wa, EXTRA_W)
for n, im in sprites.items(): im.save(os.path.join(outdir, n + '.png'))

# ---------- empacota abaixo do atlas existente ----------
PAD = 2; y0 = data['meta']['size']['h'] + PAD; x = PAD; rowh = 0; y = y0; placed = []
for n in NEW:
    im = sprites[n]
    if x + im.width + PAD > data['meta']['size']['w']: x = PAD; y += rowh + PAD; rowh = 0
    placed.append((n, x, y, im)); x += im.width + PAD; rowh = max(rowh, im.height)
newH = y + rowh + PAD
while newH % 16: newH += 1
big = Image.new('RGBA', (data['meta']['size']['w'], newH), (0, 0, 0, 0)); big.paste(atlas, (0, 0))
import copy
FACE_PORTAL = {'A': {'dx': -40, 'dy': -20}, 'B': {'dx': 40, 'dy': 20}, 'dx': 80, 'cap': 10, 'reliable': True}
for n, px, py, im in placed:
    big.paste(im, (px, py))
    if n.startswith('door_stone'):
        meta = copy.deepcopy(frames[n.replace('stone', 'wood')])
    else:
        meta = copy.deepcopy(frames['door_wood_01'])
        a0 = frames['arch_stone_01']; E = EXTRA_W if 'wide' in n else 0
        meta['anchor'] = {'x': a0['anchor']['x'] + E // 2, 'y': a0['anchor']['y'] + E // 4}
        g = copy.deepcopy(a0['ground'])
        g['left']['dx'] -= E // 2; g['left']['dy'] -= E // 4; g['right']['dx'] += E // 2; g['right']['dy'] += E // 4
        meta['ground'] = g
        fp = copy.deepcopy(FACE_PORTAL); fp['A'] = {'dx': -40 - E // 2, 'dy': -20 - E // 4}; fp['B'] = {'dx': 40 + E // 2, 'dy': 20 + E // 4}; fp['dx'] = 80 + E
        meta['face'] = fp; meta['groundLengthPx'] = round((80 + E) / COS)
        meta['spriteWidthLengthPx'] = round(im.width / COS); meta['columnHeightPx'] = a0['columnHeightPx']
    meta['frame'] = {'x': px, 'y': py, 'w': im.width, 'h': im.height}
    frames[n] = meta
data['meta']['size']['h'] = newH
big.save(ipath); json.dump(data, open(jpath, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('extras adicionados:', len(placed), 'atlas', big.size)
