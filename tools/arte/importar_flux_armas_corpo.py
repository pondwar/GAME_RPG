"""Importa os sprites das armas corpo a corpo gerados pelo FLUX.2-klein (Kaggle, .kaggle/montar_flux3.py).

O FLUX desenha a arma em PE (ponta para cima, cabo embaixo). O jogo usa imagem QUADRADA com a arma na diagonal
(cabo embaixo a esquerda, ponta para cima a direita; o fio dos machados para baixo/direita), 6 px da imagem por px do
jogo (como tools/arte/gerar_armas.py). Este script:
  1. tira o fundo magenta (importar_flux_armas.sem_fundo);
  2. acha o eixo (a linha do cabo): x medio do pedaco de baixo; a ponta e o topo da imagem;
  3. se o peso da arma (cabeca do machado, lamina) estiver na ESQUERDA do eixo, espelha (o fio fica embaixo a direita);
  4. gira 45 graus e escala para a arma ter o comprimento COMPRIMENTO[id] (px do jogo) no quadrado;
  5. grava assets/weapons/items/<id>.png e a tabela assets/weapons/items/_corpo.json: { id: [tamanho no jogo, gripX, gripY] }
     (o jogo desenha a imagem com a mao em (gripX, gripY) do quadrado: js/game.js drawWeapon).

Uso: python tools/arte/importar_flux_armas_corpo.py <pasta_com_os_pngs> [id=seed ...]
  ex.: python tools/arte/importar_flux_armas_corpo.py .kaggle/saida/suritto-flux3/flux maca=2 montante=3
Sem "id=seed" usa a semente 1.  Arquivos esperados: <id>_s<seed>.png
"""
import json
import math
import os
import sys

import cv2
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importar_flux_armas import sem_fundo  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'assets', 'weapons', 'items')
DENS = 6            # px da imagem por px do jogo
MARGEM = 0.04       # folga do cabo e da ponta nas quinas do quadrado

# id: (comprimento da arma no jogo em px (do fim do cabo a ponta), onde a mao segura (0 = fim do cabo, 1 = ponta))
COMPRIMENTO = {
    'clava_grande': (34, 0.12), 'martelo_leve': (22, 0.15), 'maca': (26, 0.13), 'bordao': (52, 0.50), 'foice': (22, 0.15),
    'machado_batalha': (33, 0.13), 'mangual': (30, 0.12), 'glaive': (60, 0.30), 'machado_grande': (42, 0.12),
    'montante': (46, 0.12), 'alabarda': (62, 0.30), 'lanca_montada': (70, 0.40), 'malho': (38, 0.12), 'maca_estrela': (28, 0.12),
    'pique': (80, 0.40), 'rapieira': (34, 0.15), 'cimitarra': (29, 0.15), 'tridente': (52, 0.35), 'picareta_guerra': (28, 0.13),
    'martelo_guerra': (28, 0.13), 'chicote': (30, 0.12),
}


def montar(im, comp):
    """im: RGBA sem fundo, arma em pe. Devolve o quadrado com a arma na diagonal e o tamanho (px do jogo)."""
    a = np.array(im)
    ys, xs = np.where(a[..., 3] > 128)
    y0, y1 = ys.min(), ys.max()
    h = y1 - y0
    base = a[..., 3] > 128
    # eixo = x medio dos 8% de baixo (o cabo)
    eixo = xs[ys >= y1 - max(2, int(h * 0.08))].mean()
    # peso do alto (cabeca/lamina): se estiver na esquerda do eixo, espelha
    alto = (ys <= y0 + h * 0.35)
    if xs[alto].mean() < eixo - 0.02 * h:
        a = a[:, ::-1].copy(); eixo = a.shape[1] - 1 - eixo
    c = s_ = math.cos(math.pi / 4)
    # a folga (m) cresce ate a arma toda caber no quadrado (cabeca de machado larga encosta nas quinas); o eixo
    # continua passando pelo centro do quadrado e o comprimento da arma no jogo nao muda
    m = MARGEM
    while True:
        S = int(round(comp * DENS / (1 - 2 * m) / math.sqrt(2)))
        k = (S * (1 - 2 * m) * math.sqrt(2)) / h
        M = np.array([[k * c, -k * s_, 0], [k * s_, k * c, 0]], np.float32)
        M[:, 2] = [m * S, (1 - m) * S] - M[:, :2] @ np.array([eixo, y1], np.float32)
        out = cv2.warpAffine(a, M, (S, S), flags=cv2.INTER_AREA if k < 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
        al = out[..., 3]
        if m >= 0.3 or not (al[0].any() or al[-1].any() or al[:, 0].any() or al[:, -1].any()): break
        m += 0.02
    return Image.fromarray(out, 'RGBA'), S, m


def main():
    pasta = sys.argv[1]
    sem = {k: int(v) for k, v in (x.split('=') for x in sys.argv[2:])}
    jp = os.path.join(OUT, '_corpo.json')
    tab = json.load(open(jp, encoding='utf-8')) if os.path.exists(jp) else {}
    for i, (comp, t) in COMPRIMENTO.items():
        f = os.path.join(pasta, f'{i}_s{sem.get(i, 1)}.png')
        if not os.path.exists(f): print('sem arquivo:', f); continue
        im = sem_fundo(Image.open(f))
        im = im.crop(im.getbbox())
        quad, S, m = montar(im, comp)
        quad.save(os.path.join(OUT, i + '.png'))
        g = m + t * (1 - 2 * m)                         # posicao da mao ao longo da diagonal: x = g, y = 1 - g
        tab[i] = [round(S / DENS, 1), round(g, 3), round(1 - g, 3)]
        print('ok', i, S, tab[i])
    json.dump(tab, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
