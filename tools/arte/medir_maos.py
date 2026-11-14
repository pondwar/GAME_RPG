"""Acha a mao que segura a arma em cada quadro dos bonecos das racas e grava em assets/player/racas/manifest.json
(chave 'maos' de cada raca): "<raca>/<acao>/<dir>_<i>": [x, y, angulo, atras, espelhar].

x, y: onde a mao fecha, em fracao da tela do quadro. angulo/espelhar: como girar a imagem da arma (as armas sao
desenhadas na diagonal, ponta para cima a direita) para a lamina sair na direcao certa. atras: desenhar a arma
atras do boneco (de costas).

Como acha: a mascara do quadro (_mascara.png, R = pele) marca rosto, bracos e maos. Tira a cabeca (perto do cabelo
verde) e os pes (halfling anda descalco). Braco da arma, sempre o mesmo em cada direcao: de lado o de perto (o maior);
de frente, de costas e na diagonal o lado da imagem em LADO_MAO. A mao e o ponto desse braco mais longe do ombro.
A arma sai do punho girada em relacao ao ANTEBRACO (o cabo atravessa a mao fechada), para o lado do polegar: braco
caido -> lamina para a frente e para baixo; esticado -> para cima; erguido -> para tras. Assim ela acompanha o braco
em todos os quadros. O 6o numero e o raio do punho: o jogo redesenha esse pedaco de pele POR CIMA da arma (game.js).
Na diagonal a parte "para a frente" da arma vai para dentro da tela (costas) ou para quem olha (frente) e encurta,
como em 3D: o 7o numero e quanto a arma encolhe no comprimento (1 = inteira).

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
GOLPES = {'attack_1h', 'attack_2h', 'thrust_1h', 'thrust_2h', 'punch', 'kick'}
FRENTE = ('down', 'up')
DIAG = ('down_right', 'down_left', 'up_right', 'up_left')
# "para a frente" de um boneco na diagonal, na tela (x para o lado dele, y para baixo/cima): ~30 graus, encurtado
FRENTE_DIAG = (0.69, 0.40)
# lado da imagem da mao direita do personagem (-1 esquerda, 1 direita); de lado (left/right): o braco de perto
LADO_MAO = {'down': -1, 'up': 1, 'down_right': -1, 'down_left': 1, 'up_right': 1, 'up_left': -1}


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
    # braco da arma, sempre o mesmo em cada direcao (antes pulava de um braco para o outro entre os quadros):
    #   de lado: o braco de perto (o maior, passa na frente do corpo);
    #   de frente, de costas e na diagonal: o lado da imagem onde fica a mao direita do personagem
    lado_img = LADO_MAO.get(d)
    if acao in ('attack_1h', 'thrust_1h') and d in ('left', 'right'): lado_img = -1 if d == 'left' else 1      # golpe de espada em 3/4: sempre o braco da mao direita (o que bate), nao o que fica caido
    if acao in GOLPES and d in ('down_left', 'down_right'): lado_img = -1 if d == 'down_left' else 1      # golpes na diagonal de frente (video 3/4): o braco que bate (mao direita) fica no lado ESQUERDO da imagem; a direita e o espelho
    if lado_img is None:
        i = max(comps, key=lambda i: st[i, cv2.CC_STAT_AREA])
    else:
        def mx(i):
            return np.where(lab == i)[1].mean() * lado_img
        grandes = [c for c in comps if st[c, cv2.CC_STAT_AREA] > 0.15 * max(st[k, cv2.CC_STAT_AREA] for k in comps)]
        i = max(grandes, key=mx)
    yi, xi = np.where(lab == i)
    dist = (xi - ombro[0]) ** 2 + (yi - ombro[1]) ** 2
    k = int(np.argmax(dist))
    px, py = float(xi[k]), float(yi[k])
    # antebraco: do meio do braco perto da mao ate a mao
    perto = (xi - px) ** 2 + (yi - py) ** 2 < (0.13 * corpo) ** 2
    vx, vy = px - xi[perto].mean(), py - yi[perto].mean()
    nv = math.hypot(vx, vy)
    if nv < 0.02 * corpo: vx, vy = px - ombro[0], py - ombro[1]; nv = math.hypot(vx, vy) or 1
    vx, vy = vx / nv, vy / nv
    # o punho fecha um pouco antes da ponta dos dedos
    px -= vx * 0.03 * corpo; py -= vy * 0.03 * corpo
    # a arma sai do punho de lado em relacao ao antebraco (o cabo atravessa a mao fechada), girada para o lado do
    # polegar: braco caido -> lamina para a frente e para baixo; braco esticado -> para a frente e para cima;
    # braco erguido -> para tras. De frente/costas o giro e menor (o cabo vem na direcao de quem olha)
    if d in FRENTE:
        f = -1 if px < hx else 1; phi = math.radians(35)
    else:
        f = 1 if 'right' in d else -1; phi = math.radians(60)
    a = -f * phi
    dx, dy = vx * math.cos(a) - vy * math.sin(a), vx * math.sin(a) + vy * math.cos(a)
    # golpe de espada de frente/costas, braco caido (posicao de guarda): costas -> lamina quase reta para cima;
    # frente -> lamina para baixo, inclinada para o centro do corpo (antes saia aberta para fora)
    if acao in ('attack_1h', 'idle', 'walk') and d in FRENTE and vy > (0.4 if d == 'up' else (0.7 if acao == 'attack_1h' else 0.4)):
        dentro = 1 if hx > px else -1
        dx, dy = (0.12 * dentro, -1.0) if d == 'up' else (0.62 * dentro, 0.78)
        n2 = math.hypot(dx, dy); dx, dy = dx / n2, dy / n2
    # diagonal: o giro acima e o de um boneco de perfil (frente = lado da tela). Na diagonal a frente do corpo
    # aponta para dentro da tela (costas) ou para quem olha (frente): a parte "para a frente" da arma vai para essa
    # direcao e encurta (perspectiva); a parte de cima/baixo fica igual. len = quanto a arma encolhe no comprimento
    ln = 1.0
    if d in DIAG:
        h = dx * f                                          # quanto aponta para a frente do corpo
        s = 1 if d.startswith('down') else -1
        dx, dy = FRENTE_DIAG[0] * f * h, FRENTE_DIAG[1] * s * h + dy
        ln = math.hypot(dx, dy) or 1
        dx, dy = dx / ln, dy / ln
    th, esp = angulo(dx, dy)
    atras = d.startswith('up')
    # raio do punho (redesenhado por cima do cabo): ate encostar em outra pele
    rf = 0.055 * corpo
    outros = (lab > 0) & (lab != i) & pele
    if outros.any():
        oy, ox = np.where(outros)
        rf = min(rf, 0.9 * math.sqrt(float(((ox - px) ** 2 + (oy - py) ** 2).min())))
    return [round(px / W, 4), round(py / H, 4), th, int(atras), int(esp), round(rf / W, 4), round(ln, 3)]


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
