#!/usr/bin/env python3
"""Ajustes de metadados do atlas (idempotente). Uso: python patch_atlas_meta.py <pasta assets/dungeon>
- Arcos ganham 'face' A/B (como os portais) para encaixar nas paredes pelas pontas."""
import sys, os, json
p = os.path.join(sys.argv[1] if len(sys.argv) > 1 else '.', 'dungeon_game_atlas.json')
d = json.load(open(p, encoding='utf-8')); n = 0
for name, m in d['frames'].items():
    if m.get('kind') == 'arch' and not m.get('face'):
        m['face'] = {'A': {'dx': -40, 'dy': -20}, 'B': {'dx': 40, 'dy': 20}, 'dx': 80, 'cap': 10, 'reliable': True}; n += 1
json.dump(d, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False); print('arcos com face:', n)
