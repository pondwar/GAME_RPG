"""Desenha as armas do jogo no estilo dos bonecos das racas (alta resolucao, sombreado suave e contorno roxo-escuro
grosso), no formato que o jogo usa (assets/weapons/items/<id>.png): na diagonal, cabo embaixo a esquerda e a ponta
para cima a direita.

Cada arma e desenhada deitada (t = ao longo da arma, 0 = ponta do cabo, 100 = ponta; u = de lado) e depois girada
45 graus. u > 0 e o lado de BAIXO quando a arma aponta para a frente: e para la que fica o fio dos machados (golpe de
cima para baixo: o fio bate no alvo / na arvore).

Escala: 6 px da imagem por px do jogo (boneco de 76 px). O jogo reduz a imagem como reduz o boneco, entao o traco
fica parecido.

Saida: assets/weapons/items/<id>.png e a tabela W_ARMA para js/game.js (tamanho no jogo e onde a mao segura).
Uso: python tools/arte/gerar_armas.py
"""
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'assets', 'weapons', 'items')

DENS = 6          # px da imagem por px do jogo
SS = 4            # desenha 4x maior e reduz (borda lisa)
CONTORNO = (48, 16, 40)       # o roxo-escuro do contorno dos bonecos
LINHA = 4                     # contorno de fora, px da imagem final
LINHA_DENTRO = 1.6            # linha entre as pecas

# materiais: cor base; o sombreado clareia em cima e escurece embaixo
FERRO = (172, 178, 190)
FERRO_ESC = (122, 120, 132)
ACO = (198, 204, 216)
MADEIRA = (146, 96, 58)
MADEIRA_ESC = (112, 72, 44)
COURO = (104, 62, 40)
LATAO = (196, 150, 70)


def circulo(tc, uc, r, n=20):
    return [(tc + r * math.cos(2 * math.pi * i / n), uc + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def ret(t0, t1, w0, w1=None):
    w1 = w0 if w1 is None else w1
    return [(t0, -w0), (t1, -w1), (t1, w1), (t0, w0)]


def espada(pomo, cabo, guarda, lam, fio_w, cor_lam=ACO, cor_cabo=COURO, cor_guarda=FERRO_ESC):
    """pomo r; cabo (t0,t1,w); guarda (t0,t1,w); lamina comeca no fim da guarda e vai ate 100"""
    g1 = guarda[1]
    return [
        ('pomo', circulo(pomo[0], 0, pomo[1]), cor_guarda, 'cil'),
        ('cabo', ret(cabo[0], cabo[1], cabo[2]), cor_cabo, 'cil', 'faixas'),
        ('guarda', [(guarda[0], -guarda[2]), (guarda[1], -guarda[2] * 0.9), (guarda[1], guarda[2] * 0.9), (guarda[0], guarda[2])],
         cor_guarda, 'cil'),
        ('lamina', [(g1, -lam), (88, -lam * 0.85), (100, 0), (88, lam * 0.85), (g1, lam)], cor_lam, 'lamina'),
        ('sulco', ret(g1 + 2, 74, fio_w), tuple(int(c * 0.82) for c in cor_lam), 'plano'),
    ]


def machado(cabo_w, olho, lam, poll, cor_cabo=MADEIRA):
    """olho (t0,t1,w): o ferro em volta do cabo; lam: pontos da lamina (lado u>0, o fio e a borda de baixo);
    poll: a parte de tras da cabeca (u<0)"""
    return [
        ('cabo', [(0, -cabo_w * 1.15), (6, -cabo_w), (olho[1] + 4, -cabo_w * 0.9), (olho[1] + 4, cabo_w * 0.9), (6, cabo_w), (0, cabo_w * 1.15)],
         cor_cabo, 'cil', 'veio'),
        ('lamina', lam, FERRO, 'machado'),
        ('poll', poll, FERRO_ESC, 'cil'),
        ('olho', ret(olho[0], olho[1], olho[2]), FERRO_ESC, 'cil'),
    ]


# comprimento no jogo (px, boneco de 76 px ~ 1,75 m), onde a mao segura (t) e as pecas
ARMAS = {
    'adaga': dict(comp=18, pega=22, pecas=espada((4, 4.6), (7, 36, 3.8), (36, 41, 12), 6.5, 1.2)),
    'espada_curta': dict(comp=28, pega=16, pecas=espada((3.5, 3.6), (6, 27, 2.9), (27, 31, 10), 5.2, 1.0)),
    'sword': dict(comp=40, pega=13, pecas=espada((3, 3.2), (5, 22, 2.4), (22, 26, 11), 4.3, 0.9)),
    'fire_sword': dict(comp=40, pega=13, fogo=True, pecas=espada((3, 3.4), (5, 22, 2.5), (22, 26, 12), 4.6, 0.9,
                                                                   cor_lam=(255, 170, 60), cor_cabo=(110, 30, 30), cor_guarda=LATAO)),
    'clava': dict(comp=32, pega=12, pecas=[
        ('cabo', [(t, -(3.6 + 7.4 * (t / 100) ** 1.7)) for t in range(0, 92, 4)] +
                 [(91 + 9 * math.cos(a), 9.8 * math.sin(a)) for a in np.linspace(-math.pi / 2, math.pi / 2, 12)] +
                 [(t, 3.6 + 7.4 * (t / 100) ** 1.7) for t in range(88, -1, -4)], MADEIRA, 'cil', 'veio'),
        ('no1', circulo(62, -3, 1.6, 10), MADEIRA_ESC, 'plano'),
        ('no2', circulo(80, 4, 2.0, 10), MADEIRA_ESC, 'plano'),
        ('tira', ret(2, 22, 4.1, 4.6), COURO, 'cil', 'faixas'),
    ]),
    # machadinha (uma mao): cabeca pequena, fio largo e curvo
    'machadinha': dict(comp=24, pega=13, pecas=machado(
        3.4, (74, 90, 5.2),
        [(75, 3), (71, 12), (66, 21), (63, 28), (66, 31.5), (76, 32.5), (88, 32), (96, 29.5), (97, 24), (93, 14), (90, 3)],
        [(78, -4), (77, -10), (88, -10.5), (88, -4)])),
    # machado de lenhador (duas maos): cabo comprido, cabeca estreita e funda
    'axe': dict(comp=38, pega=10, pecas=machado(
        2.6, (82, 93, 4.2),
        [(83, 3), (81, 9), (78, 15), (76, 20.5), (80, 22.5), (88, 23.2), (96, 22.5), (100, 20), (98.5, 13), (95, 7), (93, 3)],
        [(84, -3.5), (84, -8), (91.5, -8.3), (91.5, -3.5)])),
    'lanca': dict(comp=78, pega=40, pecas=[
        ('cabo', ret(0, 88, 1.55), MADEIRA, 'cil', 'veio'),
        ('ponteira', ret(0, 2.5, 2.0), FERRO_ESC, 'cil'),
        ('lamina', [(86.5, -1.9), (90.5, -4.3), (95, -3.3), (100, 0), (95, 3.3), (90.5, 4.3), (86.5, 1.9)], ACO, 'lamina'),
        ('alvado', ret(82, 87.5, 2.3, 2.0), FERRO_ESC, 'cil'),
    ]),
}


def sombrear(base, v, tipo, tt, uu):
    """v: 0 em cima da peca, 1 embaixo (por coluna). Volta a cor RGB de cada pixel"""
    b = np.array(base, float)
    if tipo == 'cil':          # roliço: brilho a 1/4 de cima, escuro embaixo
        f = 1.18 - 0.55 * v + 0.22 * np.exp(-((v - 0.25) / 0.12) ** 2)
    elif tipo == 'lamina':     # duas faces: a de cima clara, a de baixo escura; brilho no fio de cima
        f = np.where(v < 0.5, 1.12, 0.84) + 0.18 * np.exp(-((v - 0.06) / 0.05) ** 2)
    elif tipo == 'machado':    # face lisa escurecendo para a ponta; o fio (embaixo) e um chanfro claro
        f = 1.05 - 0.25 * v + 0.35 * (v > 0.86)
    else:
        f = np.ones_like(v)
    return np.clip(b[None, :] * f[:, None], 0, 255)


def desenhar(nome, cfg):
    comp_px = cfg['comp'] * DENS * SS
    k = comp_px / 100.0                                   # px (super) por unidade
    pts = [p for pc in cfg['pecas'] for p in pc[1]]
    umax = max(abs(u) for _, u in pts) + 3
    tmin, tmax = min(t for t, _ in pts) - 2, max(t for t, _ in pts) + 2
    marg = (LINHA + 4) * SS
    W = int((tmax - tmin) * k) + 2 * marg
    H = int(2 * umax * k) + 2 * marg
    X = lambda t: marg + (t - tmin) * k
    Y = lambda u: H / 2 + u * k
    img = np.zeros((H, W, 4), float)
    alfa_tudo = Image.new('L', (W, H), 0)
    yy, xx = np.mgrid[0:H, 0:W]
    tt = (xx - marg) / k + tmin
    uu = (yy - H / 2) / k
    for pc in cfg['pecas']:
        _, poly, base, tipo = pc[:4]
        extra = pc[4] if len(pc) > 4 else None
        m = Image.new('L', (W, H), 0)
        ImageDraw.Draw(m).polygon([(X(t), Y(u)) for t, u in poly], fill=255)
        ma = np.array(m) > 127
        if not ma.any(): continue
        # v por coluna: 0 na borda de cima da peca, 1 na de baixo
        cols = ma.any(0)
        top = np.where(cols, ma.argmax(0), 0)
        bot = np.where(cols, H - 1 - ma[::-1].argmax(0), 1)
        v = np.clip((yy - top[None, :]) / np.maximum(1, bot - top)[None, :], 0, 1)
        cor = sombrear(base, v[ma], tipo, tt[ma], uu[ma])
        if cfg.get('fogo') and pc[0] == 'lamina':        # lamina em brasa: miolo amarelo, borda vermelha
            d = np.abs(v[ma] - 0.5) * 2
            cor = np.stack([255 - 20 * d, 235 - 160 * d, 140 - 120 * d], 1)
        if extra == 'faixas':                             # tiras de couro enroladas
            cor *= (0.82 + 0.18 * (np.sin(tt[ma] * 2.2 + uu[ma] * 0.9) > -0.2))[:, None]
        elif extra == 'veio':                             # veio da madeira, ao longo do cabo
            cor *= (0.93 + 0.07 * np.sin(uu[ma] * 2.7 + np.sin(tt[ma] * 0.35) * 1.4))[:, None]
        img[ma, :3] = cor
        img[ma, 3] = 255
        # linha entre as pecas (por cima do que ja estava, contorno da peca)
        ImageDraw.Draw(alfa_tudo).polygon([(X(t), Y(u)) for t, u in poly], fill=255)
        borda = np.array(m.filter(ImageFilter.MaxFilter(int(LINHA_DENTRO * SS) | 1))) > 127
        borda &= ~(np.array(m.filter(ImageFilter.MinFilter(int(LINHA_DENTRO * SS) | 1))) > 127)
        borda &= ma
        img[borda, :3] = img[borda, :3] * 0.35 + np.array(CONTORNO) * 0.65
    # contorno grosso de fora (o roxo-escuro dos bonecos), por baixo de tudo
    fora = alfa_tudo.filter(ImageFilter.MaxFilter(LINHA * SS * 2 + 1))
    fo = np.array(fora) > 127
    base = np.zeros_like(img)
    base[fo, :3] = CONTORNO
    base[fo, 3] = 255
    dentro = img[..., 3] > 0
    base[dentro] = img[dentro]
    loc = Image.fromarray(base.astype(np.uint8), 'RGBA')
    # gira 45 graus: t vai para cima a direita, u > 0 para baixo a direita
    rot = loc.rotate(45, resample=Image.BICUBIC, expand=True)
    # onde a mao segura, depois do giro
    cx, cy = W / 2, H / 2
    cx2, cy2 = rot.width / 2, rot.height / 2
    px, py = X(cfg['pega']) - cx, Y(0) - cy
    c = s = math.sqrt(0.5)
    gx, gy = cx2 + px * c + py * s, cy2 - px * s + py * c
    fin = rot.resize((round(rot.width / SS), round(rot.height / SS)), Image.LANCZOS)
    bb = fin.getbbox()
    # recorta quadrado (o jogo desenha a arma num quadrado), mantendo o centro do giro
    lado = max(bb[2] - bb[0], bb[3] - bb[1])
    x0, y0 = (bb[0] + bb[2]) / 2 - lado / 2, (bb[1] + bb[3]) / 2 - lado / 2
    fin = fin.crop((round(x0), round(y0), round(x0) + lado, round(y0) + lado))
    gxf, gyf = (gx / SS - round(x0)) / lado, (gy / SS - round(y0)) / lado
    fin.save(os.path.join(OUT, nome + '.png'))
    return round(lado / DENS, 1), round(gxf, 3), round(gyf, 3)


def main():
    linhas = []
    for nome, cfg in ARMAS.items():
        tam, gx, gy = desenhar(nome, cfg)
        linhas.append(f'{nome}: [{tam}, {gx}, {gy}]')
        print(nome, tam, gx, gy)
    print('W_ARMA para js/game.js: {', ', '.join(linhas), '}')


if __name__ == '__main__':
    main()
