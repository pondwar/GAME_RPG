"""Acha a mao que segura a arma em cada quadro dos bonecos das racas e grava em assets/player/racas/manifest.json
(chave 'maos' de cada raca): "<raca>/<acao>/<dir>_<i>": [x, y, angulo, atras, espelhar].

x, y: onde a mao fecha, em fracao da tela do quadro. angulo/espelhar: como girar a imagem da arma (as armas sao
desenhadas na diagonal, ponta para cima a direita) para a lamina sair na direcao certa. atras: desenhar a arma
atras do boneco (de costas).

Como acha: a mascara do quadro (_mascara.png, R = pele) marca rosto, bracos e maos. Tira a cabeca (perto do cabelo
verde) e os pes (halfling anda descalco). Dos bracos que sobram:
  - de frente/costas: o braco do lado da mao direita do personagem (de frente: a esquerda da imagem);
  - de lado e na diagonal: o braco maior (o de perto, que passa na frente do corpo);
a mao e o ponto desse braco mais longe do ombro. Parado/andando a lamina fica para cima e para a frente; nos golpes
ela segue o braco (ombro -> mao).

Uso: python tools/arte/medir_maos.py   (precisa de numpy, pillow e opencv-python-headless)
"""
import json
import math
import os

import cv2
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'assets', 'player', 'racas')
GOLPES = {'attack_1h', 'attack_2h', 'punch', 'kick'}


def angulo(dx, dy):
    """giro e espelho para a lamina (desenhada para cima a direita) apontar para (dx, dy) na tela"""
    esp = dx < 0
    th = math.atan2(dy, -dx if esp else dx) + math.pi / 4
    return round(th, 3), esp


def medir(f, corpo, acao, d):
    a = np.array(Image.open(os.path.join(R, f + '.png')).convert('RGBA'))
    m = np.array(Image.open(os.path.join(R, f + '_mascara.png')).convert('RGB'))
    H, W = a.shape[:2]
    op = a[..., 3] > 128
    ys, xs = np.where(op)
    if not len(ys): return None
    pes = H - 0.2 * corpo                                   # tudo abaixo disso e perna/pe
    pele = (m[..., 0] > 128) & op
    pele[int(pes):] = False
    cab = (m[..., 1] > 128) & op
    cab[int(pes):] = False
    if cab.sum() < 30: return None
    cy, cx = [float(v.mean()) for v in np.where(cab)]
    # centro da cabeca: o cabelo fica em cima/atras; o rosto e um pouco abaixo
    hy, hx = cy + 0.03 * corpo, cx
    r = 0.12 * corpo
    yy, xx = np.mgrid[0:H, 0:W]
    pele &= (yy - hy) ** 2 + (xx - hx) ** 2 > r * r
    n, lab, st, _ = cv2.connectedComponentsWithStats(pele.astype(np.uint8), connectivity=8)
    comps = [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > 0.0006 * corpo * corpo]
    if acao not in GOLPES:                                # parado/andando a mao fica abaixo do ombro (orelha de gnomo e elfo nao)
        comps = [i for i in comps if np.where(lab == i)[0].max() > hy + 0.2 * corpo] or comps
    if not comps: return None
    ombro = (hx, hy + 0.15 * corpo)
    if d in ('down', 'up'):
        # mao direita do personagem: de frente fica a esquerda da imagem; de costas, a direita
        def lado(i):
            yi, xi = np.where(lab == i)
            return xi.mean()
        i = min(comps, key=lado) if d == 'down' else max(comps, key=lado)
    elif acao in GOLPES:
        i = None                                          # golpe: o punho mais longe do ombro, de qualquer braco
    else:
        i = max(comps, key=lambda i: st[i, cv2.CC_STAT_AREA])
    yi, xi = np.where(np.isin(lab, comps) if i is None else lab == i)
    dist = (xi - ombro[0]) ** 2 + (yi - ombro[1]) ** 2
    k = int(np.argmax(dist))
    px, py = float(xi[k]), float(yi[k])
    vx, vy = px - ombro[0], py - ombro[1]
    nv = math.hypot(vx, vy) or 1
    # a mao fecha um pouco antes da ponta dos dedos
    px -= vx / nv * 0.025 * corpo; py -= vy / nv * 0.025 * corpo
    # golpe com o braco esticado: a lamina continua o braco. Braco dobrado (guarda, punho no peito): lamina para cima
    if acao in GOLPES and nv > 0.2 * corpo:
        dx, dy = vx / nv, vy / nv
    else:
        # parada: lamina para cima e para fora, para o lado em que a mao esta (ou para onde olha)
        # de lado: para onde olha; de frente/costas e na diagonal: para o lado da mao (nao cruza o corpo)
        if d in ('left', 'right'): s = -1 if d == 'left' else 1
        else: s = -1 if px < W / 2 else 1
        dx, dy = 0.55 * s, -1
    th, esp = angulo(dx, dy)
    atras = d.startswith('up')
    return [round(px / W, 4), round(py / H, 4), th, int(atras), int(esp)]


def main():
    mpath = os.path.join(R, 'manifest.json')
    man = json.load(open(mpath, encoding='utf-8'))
    for race, ent in man.items():
        maos, falta = {}, 0
        for acao, dirs in ent['acoes'].items():
            if acao == 'sit': continue
            for d, fs in dirs.items():
                ant = None
                for f in fs:
                    s = medir(f, ent['corpo'], acao, d)
                    if s is None: s = ant; falta += 1          # mao escondida: fica onde estava no quadro anterior
                    if s is not None: maos[f] = s; ant = s
        ent['maos'] = maos
        print(f'{race}: {len(maos)} quadros com mao ({falta} sem mao visivel)')
    json.dump(man, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
