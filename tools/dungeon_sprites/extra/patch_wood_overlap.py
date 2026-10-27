"""Madeira: painéis/portas/quinas trazem poste nas duas pontas. Encurta o passo (B recua OVL px na direção da peça)
para que, ao encaixar, os dois postes se fundam em um só. Idempotente (marca 'woodOverlap' no frame).
Uso: python patch_wood_overlap.py <dungeon_game_atlas.json>"""
import json, sys
OVL = 8
p = sys.argv[1]
a = json.load(open(p)); fr = a.get('frames', a); n = 0
for k, m in fr.items():
    if m.get('woodOverlap'): continue
    wood = k.startswith('wood_') or k.startswith('door_wood') or k.startswith('portal_wood') or k.startswith('gate_wood')
    if not wood: continue
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
    m['woodOverlap'] = OVL; n += 1
json.dump(a, open(p, 'w'), indent=1 if False else None, separators=(',', ':')) if False else json.dump(a, open(p, 'w'))
print('ajustados', n)
