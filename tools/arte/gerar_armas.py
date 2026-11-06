"""Desenha as armas basicas (aldeao: ferro e madeira) em pixel art, no mesmo formato das armas do jogo
(assets/weapons/items/<id>.png): na diagonal, cabo embaixo a esquerda e a ponta para cima a direita.

Cada arma e um perfil ao longo do eixo da diagonal: t = distancia ao longo do eixo (0 = onde a mao segura),
s = distancia de lado. Cada pedaco (pomo, cabo, guarda, lamina...) diz a largura e o material. Depois: luz de um
lado, sombra do outro e contorno escuro. Grade pequena (pixel grosso) e ampliada 2x, como o resto da arte.

Saida: assets/weapons/items/<id>.png e a pega (onde a mao segura, em fracao da imagem) impressa para js/game.js.
Uso: python tools/arte/gerar_armas.py
"""
import json
import math
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'assets', 'weapons', 'items')

# materiais: (claro, medio, escuro)
FERRO = ((214, 220, 226), (158, 166, 176), (96, 102, 112))
FERRO_ESC = ((150, 150, 158), (110, 110, 118), (70, 70, 78))
MADEIRA = ((170, 118, 72), (128, 84, 48), (86, 54, 30))
COURO = ((128, 80, 52), (92, 56, 36), (60, 36, 24))
CONTORNO = (34, 24, 22)

# pedacos: (t0, t1, largura no t0, largura no t1, material); largura = meia-largura em pixels da grade
ARMAS = {
    'adaga': dict(grade=32, pega=(8, 24), partes=[
        (-3.2, -1.8, 1.4, 1.4, FERRO_ESC), (-1.8, 3.2, 0.9, 0.9, COURO), (3.2, 4.6, 3.2, 3.2, FERRO_ESC),
        (4.6, 13.5, 1.7, 0.2, FERRO)]),
    'espada_curta': dict(grade=32, pega=(7, 25), partes=[
        (-3.6, -2.0, 1.6, 1.6, FERRO_ESC), (-2.0, 4.0, 0.9, 0.9, COURO), (4.0, 5.6, 4.0, 4.0, FERRO_ESC),
        (5.6, 19.0, 1.9, 1.6, FERRO), (19.0, 22.5, 1.6, 0.2, FERRO)]),
    'clava': dict(grade=32, pega=(7, 25), partes=[
        (-3.0, 4.0, 1.1, 1.3, MADEIRA), (4.0, 17.0, 1.3, 3.0, MADEIRA), (17.0, 20.5, 3.0, 1.2, MADEIRA)]),
    'machadinha': dict(grade=32, pega=(7, 25), partes=[
        (-3.0, 18.5, 0.9, 0.9, MADEIRA)], cabeca=('machado', 10.0, 18.0)),
    'lanca': dict(grade=48, pega=(14, 34), partes=[
        (-12.0, 24.0, 0.9, 0.9, MADEIRA), (24.0, 26.0, 1.3, 1.3, FERRO_ESC), (26.0, 30.0, 1.4, 2.4, FERRO),
        (30.0, 36.0, 2.4, 0.2, FERRO)]),
}


def material(t, s, cfg):
    """material e meia-largura no ponto (t, s); None = vazio"""
    for t0, t1, w0, w1, mat in cfg['partes']:
        if t0 <= t <= t1:
            w = w0 + (w1 - w0) * (t - t0) / max(1e-6, t1 - t0)
            if abs(s) <= w: return mat, w
    cab = cfg.get('cabeca')
    if cab and cab[0] == 'machado':
        _, a, b = cab
        if a <= t <= b:
            m = (a + b) / 2; h = (b - a) / 2
            # lamina para um lado (s negativo), o fio em curva (mais largo no meio); perto do cabo mais estreita
            fio = -8.0 + 1.8 * ((t - m) / h) ** 2
            larg = h * (0.45 + 0.55 * min(1.0, max(0.0, -s) / 6.0))     # estreita junto do cabo, larga no fio
            if fio <= s <= 1.2 and abs(t - m) <= larg:
                return ('fio' if s < fio + 1.3 else 'corpo'), 4.0
            if 1.2 < s <= 2.6 and abs(t - m) <= 1.4: return FERRO_ESC, 2.0      # nuca
    return None


def desenhar(nome, cfg):
    g = cfg['grade']; gx, gy = cfg['pega']
    u = (1 / math.sqrt(2), -1 / math.sqrt(2)); n = (1 / math.sqrt(2), 1 / math.sqrt(2))
    px = {}
    for y in range(g):
        for x in range(g):
            dx, dy = x + 0.5 - gx, y + 0.5 - gy
            t = dx * u[0] + dy * u[1]; s = dx * n[0] + dy * n[1]
            r = material(t, s, cfg)
            if r is None: continue
            mat, w = r
            if mat == 'fio': c = FERRO[0]                  # cabeca do machado: fio claro, corpo medio
            elif mat == 'corpo': c = FERRO[1] if (x + y) % 5 else FERRO[2]
            else:
                # luz vinda de cima/esquerda: lado s<0 claro, s>0 escuro, meio medio
                k = s / max(w, 0.6)
                c = mat[0] if k < -0.35 else (mat[2] if k > 0.45 else mat[1])
            px[(x, y)] = c
    im = Image.new('RGBA', (g, g), (0, 0, 0, 0))
    for (x, y), c in px.items(): im.putpixel((x, y), c + (255,))
    # contorno: vizinho vazio de um pixel cheio
    for (x, y) in list(px):
        for ddx, ddy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + ddx, y + ddy)
            if 0 <= q[0] < g and 0 <= q[1] < g and q not in px and im.getpixel(q)[3] == 0:
                im.putpixel(q, CONTORNO + (255,))
    im = im.resize((g * 2, g * 2), Image.NEAREST)
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, f'{nome}.png'))
    return [round((gx) / g, 3), round((gy) / g, 3)]


def main():
    pegas = {nome: desenhar(nome, cfg) for nome, cfg in ARMAS.items()}
    print(json.dumps(pegas))


if __name__ == '__main__':
    main()
