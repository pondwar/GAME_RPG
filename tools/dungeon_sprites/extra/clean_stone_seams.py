"""Pedra/tijolo: remove o contorno preto da ponta esquerda (A) das paredes, que aparecia como linha vertical
entre segmentos. Troca os pixels escuros das 6 primeiras colunas pelo pixel de pedra mais proximo a direita.
Idempotente (flag 'seamClean'). Uso: python clean_stone_seams.py <atlas.json> <atlas.png>"""
import json, sys
from PIL import Image
jp, pp = sys.argv[1], sys.argv[2]
a = json.load(open(jp)); fr = a.get('frames', a); im = Image.open(pp).convert('RGBA'); px = im.load(); n = 0
PRE = ('stone_wall', 'brick_wall', 'dark_brick')
dark = lambda c: c[3] > 90 and sum(c[:3]) < 150
for k, m in fr.items():
    if m.get('seamClean') or not k.startswith(PRE) or m.get('kind') != 'wall': continue
    f = m['frame']
    for y in range(f['h']):
        src = None
        for x in range(6, 11):
            c = px[f['x'] + x, f['y'] + y]
            if c[3] > 200 and not dark(c): src = c; break
        if not src: continue
        for x in range(6):
            c = px[f['x'] + x, f['y'] + y]
            if c[3] > 90 and (dark(c) if x < 3 else sum(c[:3]) < 90): px[f['x'] + x, f['y'] + y] = (src[0], src[1], src[2], 255)
    m['seamClean'] = 1; n += 1
im.save(pp); json.dump(a, open(jp, 'w')); print('limpos', n)
