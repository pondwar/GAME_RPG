"""wood_wall_panel_02 foi desenhado com inclinacao ~0.41 (o resto do atlas usa 0.5), o que gera degrau entre paineis.
Cisalha as colunas para 0.5 e regrava o sprite numa regiao nova abaixo do atlas (com folga vertical).
Idempotente (marca 'slopeFixed'). Uso: python fix_panel02_slope.py <pasta assets/dungeon>"""
import json, sys, os, numpy as np
from PIL import Image
d = sys.argv[1]; jp = os.path.join(d, 'dungeon_game_atlas.json'); pp = os.path.join(d, 'dungeon_game_atlas.png')
FIX = {'wood_wall_panel_02': 0.09, 'wood_wall_panel_01': -0.07}   # K = (0.5 - inclinacao medida)
a = json.load(open(jp)); fr = a['frames']
im = Image.open(pp).convert('RGBA')
for name, K in FIX.items():
  m = fr[name]
  if m.get('slopeFixed'): print(name, 'ja corrigido'); continue
  f = m['frame']; ax, ay = m['anchor']['x'], m['anchor']['y']
  t = np.array(im.crop((f['x'], f['y'], f['x'] + f['w'], f['y'] + f['h'])))
  W, H = f['w'], f['h']; PAD = 8
  s = lambda c: int(round(K * (c - ax)))
  out = np.zeros((H + 2 * PAD, W, 4), np.uint8)
  for c in range(W):
      sh = s(c) + PAD
      for y in range(H):
          if t[y, c, 3]: out[y + sh, c] = t[y, c]
  newY = im.height
  canvas = Image.new('RGBA', (im.width, newY + out.shape[0] + 2), (0, 0, 0, 0)); canvas.paste(im, (0, 0))
  canvas.paste(Image.fromarray(out), (2, newY + 1))
  canvas.save(pp); im = canvas
  m['frame'] = {'x': 2, 'y': newY + 1, 'w': W, 'h': out.shape[0]}
  m['anchor']['y'] = ay + PAD
  # A/B e ground ja estao na malha 2:1: nao mudam (so o desenho foi cisalhado)
  m['slopeFixed'] = True
  a['meta']['size']['h'] = canvas.height
  json.dump(a, open(jp, 'w')); print('ok', m['frame'], m['anchor'], m['face'])

# alinha a altura da viga do panel_02 com a do panel_01 (A/B 7 px mais baixos no sprite)
a = json.load(open(jp)); m = a['frames']['wood_wall_panel_02']
if not m.get('beamAligned'):
    m['face']['A']['dy'] += 7; m['face']['B']['dy'] += 7; m['beamAligned'] = True
    json.dump(a, open(jp, 'w')); print('beamAligned')
