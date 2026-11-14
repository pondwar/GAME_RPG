"""Importa os sprites de armas de longe gerados pelo FLUX.2-klein (Kaggle, .kaggle/montar_flux2.py).

Para cada item: tira o fundo magenta (flood fill a partir das bordas, que aguenta o degrade), corta no contorno,
reduz para no maximo 256 px no lado maior e grava em assets/weapons/items/<id>.png. Para arco e besta tambem mede as
duas pontas (a ponta de cima e a de baixo, onde a corda prende) e grava tudo em assets/weapons/items/_longe.json:
  { "<id>": { "w": largura, "h": altura, "pontas": [[x, y], [x, y]] } }   (x, y em fracao da imagem, 0..1)

Orientacao dos sprites (como o prompt pede): arco em pe, barriga para a direita; besta, flecha, virote, dardo e
azagaia deitados apontando para a direita; funda deitada.

Uso: python tools/arte/importar_flux_armas.py <pasta_com_os_pngs> [id=seed ...]
  ex.: python tools/arte/importar_flux_armas.py .kaggle/saida/suritto-flux2/flux arco_curto=2 besta_leve=1
Sem "id=seed" usa a semente 1 de todos.
"""
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'assets', 'weapons', 'items')
IDS = ['arco_curto', 'arco_longo', 'besta_leve', 'besta_pesada', 'besta_mao', 'funda', 'flecha', 'virote', 'pedra', 'dardo', 'azagaia']
COM_PONTAS = {'arco_curto', 'arco_longo', 'besta_leve', 'besta_pesada', 'besta_mao'}
MAXLADO = 256


def sem_fundo(im):
    a = np.array(im.convert('RGB'))
    h, w = a.shape[:2]
    bgr = cv2.cvtColor(a, cv2.COLOR_RGB2BGR)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    tol = (28, 28, 28)
    # semeia em todas as bordas (o degrade do fundo e suave, o flood fill flutuante acompanha)
    for x in range(0, w, 8):
        for y in (0, h - 1):
            if not mask[y + 1, x + 1]: cv2.floodFill(bgr.copy(), mask, (x, y), 0, tol, tol, cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    for y in range(0, h, 8):
        for x in (0, w - 1):
            if not mask[y + 1, x + 1]: cv2.floodFill(bgr.copy(), mask, (x, y), 0, tol, tol, cv2.FLOODFILL_MASK_ONLY | (255 << 8))
    fundo = mask[1:-1, 1:-1] > 0
    # miolo preso (ex.: dentro do arco) tambem e fundo se for da cor do fundo: pega tudo que e magenta/rosa forte e isolado
    r, g, b = [a[..., i].astype(int) for i in range(3)]
    magenta = (r > 150) & (b > 60) & (g < 0.55 * np.minimum(r, b) + 10) & (np.abs(r - b) < 140)
    fundo |= magenta & (cv2.dilate(fundo.astype(np.uint8), np.ones((3, 3), np.uint8), iterations=6) > 0)
    obj = (~fundo).astype(np.uint8)
    # tira ilhas minusculas e fecha buracos pequenos
    n, lab, st, _ = cv2.connectedComponentsWithStats(obj, connectivity=8)
    if n > 1:
        grande = max(range(1, n), key=lambda i: st[i, cv2.CC_STAT_AREA])
        obj = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.02 * st[grande, cv2.CC_STAT_AREA]]).astype(np.uint8)
    obj = cv2.erode(obj, np.ones((3, 3), np.uint8), iterations=1)       # tira o halo rosado da borda
    alpha = cv2.GaussianBlur(obj.astype(np.float32), (3, 3), 0)
    rgba = np.dstack([a, (alpha * 255).astype(np.uint8)])
    # despill: pixel de borda com tom magenta perde o excesso de vermelho/azul
    borda = (alpha > 0) & (alpha < 1)
    for c in (0, 2):
        ch = rgba[..., c].astype(int); g2 = rgba[..., 1].astype(int)
        ch[borda] = np.minimum(ch[borda], g2[borda] + 40)
        rgba[..., c] = ch
    return Image.fromarray(rgba, 'RGBA')


def pontas(im):
    a = np.array(im)[..., 3] > 128
    ys, xs = np.where(a)
    h, w = a.shape
    y0, y1 = ys.min(), ys.max()
    f = max(2, int((y1 - y0) * 0.04))
    cima = [xs[ys <= y0 + f].mean() / w, y0 / h]
    baixo = [xs[ys >= y1 - f].mean() / w, y1 / h]
    return [[round(cima[0], 4), round(cima[1], 4)], [round(baixo[0], 4), round(baixo[1], 4)]]


def main():
    pasta = sys.argv[1]
    sem = {k: int(v) for k, v in (x.split('=') for x in sys.argv[2:])}
    jp = os.path.join(OUT, '_longe.json')
    meta = json.load(open(jp, encoding='utf-8')) if os.path.exists(jp) else {}
    for i in IDS:
        f = os.path.join(pasta, f'{i}_s{sem.get(i, 1)}.png')
        if not os.path.exists(f): print('sem arquivo:', f); continue
        im = sem_fundo(Image.open(f))
        bb = im.getbbox()
        im = im.crop(bb)
        k = MAXLADO / max(im.size)
        if k < 1: im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        im.save(os.path.join(OUT, i + '.png'))
        meta[i] = {'w': im.width, 'h': im.height}
        if i in COM_PONTAS and i.startswith('arco'): meta[i]['pontas'] = pontas(im)
        elif i in COM_PONTAS: meta[i]['pontas'] = pontas(im)
        print('ok', i, im.size)
    json.dump(meta, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
