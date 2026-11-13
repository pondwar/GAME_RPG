# -*- coding: utf-8 -*-
# Importa a imagem de uma arvore (ou duas lado a lado: normal | neve) para assets/trees/<especie>.png (e _neve.png)
# e registra em assets/trees/catalogo.json (o jogo so usa a arte se a especie estiver la).
# Uso: python tools/arte/importar_arvore.py <imagem.png> <especie> [--neve]
import sys, os, json
import numpy as np
from PIL import Image
args = [a for a in sys.argv[1:] if not a.startswith('--')]
src, kind = args[0], args[1]; neve = '--neve' in sys.argv
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
sp = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
bg = (np.sqrt(((a - np.array([255, 0, 255])) ** 2).sum(-1)) < 90) | (sp > 110)
parts = [(0, im.width // 2), (im.width // 2, im.width)] if neve else [(0, im.width)]
outd = os.path.join(root, 'assets', 'trees'); os.makedirs(outd, exist_ok=True)
for i, (x0, x1) in enumerate(parts):
    m = ~bg[:, x0:x1]; rgb = a[:, x0:x1].copy(); s = sp[:, x0:x1]
    al = m & (s < 70); out = np.dstack([rgb, al * 255]).astype('uint8'); out[~al] = 0
    img = Image.fromarray(out, 'RGBA'); img = img.crop(img.getbbox())
    img.save(os.path.join(outd, kind + ('_neve' if i else '') + '.png'))
cp = os.path.join(outd, 'catalogo.json')
cat = json.load(open(cp, encoding='utf-8')) if os.path.exists(cp) else {}
cat[kind] = {'neve': neve, 'v': cat.get(kind, {}).get('v', 0) + 1}
json.dump(cat, open(cp, 'w', encoding='utf-8'), indent=1)
print(kind, 'importado', img.size)
