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
    """Tira o fundo magenta pela COR (matiz entre 280 e 338 graus, saturado e claro). Pega tambem os vaos fechados
    (dentro da curva do arco, entre os bracos da besta). Vermelho de pena (matiz ~350) e madeira nao entram."""
    a = np.array(im.convert('RGB'))
    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
    h, sat, v = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    fundo = (h >= 140) & (h <= 169) & (sat > 100) & (v > 100)
    obj = (~fundo).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(obj, connectivity=8)       # tira ilhas minusculas
    if n > 1:
        grande = max(range(1, n), key=lambda i: st[i, cv2.CC_STAT_AREA])
        obj = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.01 * st[grande, cv2.CC_STAT_AREA]]).astype(np.uint8)
    obj = cv2.erode(obj, np.ones((3, 3), np.uint8), iterations=1)               # tira o halo rosado da borda
    alpha = cv2.GaussianBlur(obj.astype(np.float32), (3, 3), 0)
    rgba = np.dstack([a, (alpha * 255).astype(np.uint8)])
    borda = (alpha > 0) & (alpha < 1)                                          # despill: borda com tom magenta perde o excesso
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
        if i.startswith('arco'):        # tira a corda que o FLUX desenhou (fina): abertura morfologica; a corda do jogo e desenhada por codigo
            arr = np.array(im); al = (arr[..., 3] > 128).astype(np.uint8)
            ab = cv2.morphologyEx(al, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
            n, lab, st, _ = cv2.connectedComponentsWithStats(ab, connectivity=8)          # fica so a peca maior (o couro da corda sobra solto)
            if n > 1: ab = (lab == max(range(1, n), key=lambda q: st[q, cv2.CC_STAT_AREA])).astype(np.uint8)
            arr[..., 3] = np.where(ab > 0, arr[..., 3], 0); im = Image.fromarray(arr, 'RGBA'); im = im.crop(im.getbbox())
        if i.startswith('arco'):        # o jogo quer as pontas do arco voltadas para quem atira (esquerda) e a barriga para onde mira (direita)
            al = np.array(im)[..., 3] > 128; ys, xs = np.where(al); h = im.height
            meio = xs[(ys > h * 0.45) & (ys < h * 0.55)].mean(); pt = pontas(im); pontas_x = (pt[0][0] + pt[1][0]) / 2 * im.width
            if pontas_x > meio: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        k = MAXLADO / max(im.size)
        if k < 1: im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
        im.save(os.path.join(OUT, i + '.png'))
        meta[i] = {'w': im.width, 'h': im.height}
        if i in COM_PONTAS: meta[i]['pontas'] = pontas(im)
        if i.startswith('arco'):        # barriga do arco (x mais a direita no meio): e onde a mao segura
            al = np.array(im)[..., 3] > 128; ys, xs = np.where(al)
            meta[i]['barriga'] = round(float(xs[(ys > im.height * 0.4) & (ys < im.height * 0.6)].max()) / im.width, 4)
        print('ok', i, im.size)
    json.dump(meta, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
