# scripts/generate_side_walls_oblique.py
# Gera as paredes LESTE/OESTE (rot 90 / 270) em projecao obliqua "estilo Tibia".
#
# Geometria (cada bloco de parede = 1 tile no chao 48x48):
#   - O topo do muro tomba 48px para a ESQUERDA (oeste) ao subir 96px (2 blocos de altura)
#   - Assim aparece: a face de CIMA (coping), a face LESTE (tijolos inclinados) e a
#     tampa SUL (fecha a ponta do muro).
#   - Sprite 96 x 144. O pe do bloco (tile 48x48) fica em x=48..96, y=96..144.
#     No jogo: desenhar em (sx - 48, sy - 96).
#
# Saida: assets/blocks/parede_pedra_side.png e parede_madeira_side.png (96x144)

import os
from PIL import Image

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'blocks')
W, H = 96, 144
LEAN = 48      # quanto o topo tomba para a esquerda
BODY = 96      # altura do corpo (z)
T = 48         # espessura/comprimento do tile


def noise(a, b, m=5):
    return ((a * 73856093) ^ (b * 19349663)) % m - m // 2


def clamp(c):
    return tuple(max(0, min(255, int(v))) for v in c)


def shade(c, d):
    return clamp((c[0] + d, c[1] + d, c[2] + d))


# ---------------------------------------------------------------- PEDRA
STONE_FACE = (92, 98, 112)
STONE_TOP = (140, 146, 160)
STONE_MORTAR = (36, 38, 46)


def stone_face(u, v):
    """u = ao longo do muro (0..47) | v = altura (0..47, 12 por fileira)."""
    course = v // 12
    iv = v % 12
    off = 12 if course % 2 else 0
    uu = (u + off) % 48
    brick_len = 24
    iu = uu % brick_len
    if iv == 0 or iv == 11:
        return STONE_MORTAR
    if iu == 0 or iu == brick_len - 1:
        return STONE_MORTAR
    c = shade(STONE_FACE, noise(u, v, 9) + (course * -3))
    if iv == 1 or iu == 1:
        c = shade(c, 22)       # luz topo/esquerda do tijolo
    if iv == 10 or iu == brick_len - 2:
        c = shade(c, -14)
    return c


def stone_top(x, y):
    """x = 0..47 (espessura) | y = 0..47 (comprimento)."""
    if x in (0, 47):
        return STONE_MORTAR
    c = shade(STONE_TOP, noise(x, y, 9))
    if x <= 5:                       # pedras de borda (parapeito) esquerda
        c = shade(c, 12)
        if x == 5:
            c = STONE_MORTAR
    elif x >= 42:                    # pedras de borda direita
        c = shade(c, -10)
        if x == 42:
            c = STONE_MORTAR
    if y % 16 == 0:
        c = STONE_MORTAR if 5 < x < 42 else shade(STONE_MORTAR, 8)
    elif y % 16 == 1:
        c = shade(c, 16)
    if 5 < x < 42 and x % 24 == 0:
        c = shade(c, -26)
    return c


def stone_cap(x, z):
    """Tampa sul. x = 0..47 | z = 0..95."""
    course = z // 24
    iz = z % 24
    off = 12 if course % 2 else 0
    ix = (x + off) % 24
    if iz in (0, 23) or ix in (0, 23):
        return STONE_MORTAR
    c = shade((104, 110, 124), noise(x, z, 9))
    if iz == 22 or ix == 1:
        c = shade(c, 18)
    return c


# ---------------------------------------------------------------- MADEIRA
WOOD = (140, 92, 52)
WOOD_DARK = (46, 28, 14)
IRON = (40, 44, 54)
RIVET = (170, 178, 190)


def wood_face(u, v):
    iv = v % 12
    if iv == 0:
        return WOOD_DARK
    base = shade(WOOD, noise(u // 2, v, 11) - (v // 12) * 3)
    if iv == 1:
        base = shade(base, 24)
    if iv == 11:
        base = shade(base, -16)
    if 20 <= u <= 24:                       # cinta de ferro
        base = IRON
        if iv in (5, 6) and u == 22:
            base = RIVET
    return shade(base, -22)


def wood_top(x, y):
    if x in (0, 47):
        return WOOD_DARK
    ix = x % 12
    if ix == 0:
        return WOOD_DARK
    c = shade((170, 118, 68), noise(x, y // 2, 9))
    if ix == 1:
        c = shade(c, 20)
    if 20 <= y <= 24:
        c = IRON
        if ix == 6 and y == 22:
            c = RIVET
    return c


def wood_cap(x, z):
    iz = z % 24
    if iz == 0 or x % 12 == 0:
        return WOOD_DARK
    c = shade(WOOD, noise(x, z, 9) - 10)
    if iz == 1:
        c = shade(c, 18)
    if 8 <= (z % 48) <= 12 and 2 <= x <= 45:
        c = IRON
    return c


# ---------------------------------------------------------------- COMPOSICAO
def build(face_fn, top_fn, cap_fn, name):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = img.load()

    # 1) tampa sul (plano y = 48):  ys = 144 - z ; x = xs + z/2  (48..95)
    for ys in range(48, 144):
        z = 144 - ys
        if z >= BODY:
            continue
        for xs in range(0, W):
            x = xs + z // 2
            if 48 <= x < 96:
                px[xs, ys] = cap_fn(x - 48, z) + (255,)

    # 2) face leste (plano x = 96):  v = 96 - xs (0..47) ; u = ys + 2v - 96 (0..47)
    for xs in range(48, 96):
        v = 96 - xs - 1
        for ys in range(0, H):
            u = ys + 2 * v - 96
            if 0 <= u < 48 and 0 <= v < 48:
                px[xs, ys] = face_fn(u, v) + (255,)

    # 3) topo (z = 96): retangulo x 0..47, y 0..47
    for ys in range(0, 48):
        for xs in range(0, 48):
            px[xs, ys] = top_fn(xs, ys) + (255,)

    # 4) contorno escuro na silhueta (por dentro, mantem 96x144)
    src = img.copy()
    sp = src.load()
    for y in range(H):
        for x in range(W):
            if sp[x, y][3] == 0:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= W or ny >= H or sp[nx, ny][3] == 0:
                    px[x, y] = (22, 22, 28, 255)
                    break

    # 5) linha de luz na quina topo/face leste
    for ys in range(1, 48):
        if px[48, ys][3] and ys > 1:
            r, g, b, a = px[47, ys]
            px[47, ys] = (min(255, r + 40), min(255, g + 40), min(255, b + 40), 255)

    img.save(os.path.join(OUT, name))
    print('Gerado', name, img.size)


if __name__ == '__main__':
    build(stone_face, stone_top, stone_cap, 'parede_pedra_side.png')
    build(wood_face, wood_top, wood_cap, 'parede_madeira_side.png')

    # Previa: 5 blocos empilhados no eixo Y (como no jogo) em 3x
    prev = Image.new('RGBA', (W, 48 * 4 + 144 - 48 + 10), (60, 90, 50, 255))
    for name, ox in (('parede_pedra_side.png', 0),):
        s = Image.open(os.path.join(OUT, name))
        for i in range(4):
            prev.alpha_composite(s, (ox, 48 * i))
    prev = prev.resize((prev.width * 3, prev.height * 3), Image.NEAREST)
    prev.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_preview_side_pedra.png'))
    prev2 = Image.new('RGBA', (W, 48 * 4 + 144 - 48 + 10), (60, 90, 50, 255))
    s = Image.open(os.path.join(OUT, 'parede_madeira_side.png'))
    for i in range(4):
        prev2.alpha_composite(s, (0, 48 * i))
    prev2 = prev2.resize((prev2.width * 3, prev2.height * 3), Image.NEAREST)
    prev2.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_preview_side_madeira.png'))
