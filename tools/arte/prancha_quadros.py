# -*- coding: utf-8 -*-
# Prancha dos quadros brutos de um video (numerados), recortada em volta do boneco, para escolher os 8 quadros.
# Uso: python prancha_quadros.py <pasta_frames_brutos> <saida.png> [escala=0.42] [colunas=13]
import glob, sys
import numpy as np
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + '/*.png')); esc = float(sys.argv[3]) if len(sys.argv) > 3 else 0.42; cols = int(sys.argv[4]) if len(sys.argv) > 4 else 13
ims = [Image.open(f).convert('RGB') for f in fs]
def fg(a):
    r, g, b = a[..., 0].astype(int), a[..., 1].astype(int), a[..., 2].astype(int)
    return (np.minimum(r, b) - g) < 80
U = np.zeros(np.asarray(ims[0]).shape[:2], bool)
for im in ims[::4]: U |= fg(np.asarray(im))
ys, xs = np.where(U); box = (max(0, xs.min() - 6), max(0, ys.min() - 6), xs.max() + 6, ys.max() + 6)
cr = [im.crop(box).resize((int((box[2] - box[0]) * esc), int((box[3] - box[1]) * esc))) for im in ims]
w, h = cr[0].size; rows = (len(cr) + cols - 1) // cols
sh = Image.new('RGB', (cols * w, rows * h), (40, 40, 40)); d = ImageDraw.Draw(sh)
for i, c in enumerate(cr):
    x, y = (i % cols) * w, (i // cols) * h; sh.paste(c, (x, y)); d.text((x + 3, y + 2), str(i), fill=(255, 255, 0))
sh.save(sys.argv[2]); print(sh.size, len(cr), 'quadros')
