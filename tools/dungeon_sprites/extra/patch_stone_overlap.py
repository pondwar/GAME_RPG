"""Pedra/tijolo: mesma correcao da madeira. Encurta o passo (B recua OVL px) para que a ponta com contorno preto
de uma peca fique sob a seguinte, sem fresta nem linha dupla. Idempotente (marca 'stoneOverlap').
Uso: python patch_stone_overlap.py <dungeon_game_atlas.json>"""
import json, sys
import os
OVL = int(os.environ.get("OVL", 8))
p = sys.argv[1]
a = json.load(open(p)); fr = a.get('frames', a); n = 0
PRE = ('stone_wall', 'stone_corner', 'brick_wall', 'brick_corner', 'dark_brick', 'arch_', 'door_stone', 'portal_stone')
for k, m in fr.items():
    if m.get('stoneOverlap') or not k.startswith(PRE) or m.get('kind') in ('wall_frontal', 'ruin'): continue
    f = m.get('face')
    if f:
        f['B']['dx'] -= OVL; f['B']['dy'] -= OVL // 2; f['dx'] -= OVL
    elif m.get('kind') in ('corner_convex', 'corner_concave') and m.get('ground'):
        g = m['ground']
        g['left']['dx'] += OVL; g['right']['dx'] -= OVL
        g['left']['dy'] += OVL // 2 if g['left']['dy'] < 0 else -OVL // 2
        g['right']['dy'] += OVL // 2 if g['right']['dy'] < 0 else -OVL // 2
    else:
        continue
    m['stoneOverlap'] = OVL; n += 1
json.dump(a, open(p, 'w'))
print('ajustados', n)
