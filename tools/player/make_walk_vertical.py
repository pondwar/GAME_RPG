"""make_walk_vertical.py - Gera os ciclos de andar/correr PARA CIMA e PARA BAIXO do boneco (assets/player/v2).

A arte original tinha so 2 quadros nessas direcoes (para cima eram 3 copias do boneco parado; para baixo a
perna direita ficava levantada nos dois quadros), entao ele "deslizava" como um robo. Aqui cada perna e
recortada abaixo do quadril e animada separadamente:

  quadro 0: contato   - apoio na perna esquerda, calcanhar direito saindo do chao
  quadro 1: passagem  - perna direita dobrada e levantada, passando
  quadro 2: contato   - espelho do 0
  quadro 3: passagem  - espelho do 1

Os bracos balancam ao contrario das pernas. Cada quadro tem o tamanho do original (o jogo escala pela
altura da imagem: mudar o tamanho mudaria o tamanho do boneco).

As bases ficam guardadas em walk/_base_down.png e walk/_base_up.png (copias da arte original), entao o
script pode rodar de novo sem degradar. Uso: python tools/player/make_walk_vertical.py [assets/player/v2]
"""
import os
import sys
from PIL import Image

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'player', 'v2')
LEG_TOP = 258                 # linha onde as pernas saem da tunica (sprites de 403-405 px)
ARM_TOP, ARM_BOT = 196, 266   # trecho do antebraco/mao que balanca
ARM_L, ARM_R = 44, 152        # colunas: braco esquerdo x < ARM_L, braco direito x >= ARM_R
CLEAR = (0, 0, 0, 0)


def legs_split(im):
    """coluna do vao entre as pernas (menos pixels opacos na faixa central logo abaixo do quadril)"""
    a = im.split()[3]
    cols = range(im.width // 2 - 20, im.width // 2 + 20)
    return min(cols, key=lambda x: sum(a.getpixel((x, y)) for y in range(LEG_TOP + 4, LEG_TOP + 60)))


def symmetric_base(im):
    """as duas pernas iguais e no chao: a perna esquerda (reta) espelhada no lugar da direita"""
    split = legs_split(im)
    out = im.copy()
    out.paste(Image.new('RGBA', (im.width - split, im.height - LEG_TOP), CLEAR), (split, LEG_TOP))
    left = im.crop((0, LEG_TOP, split, im.height)).transpose(Image.FLIP_LEFT_RIGHT)
    out.alpha_composite(left.crop((0, 0, min(left.width, im.width - split), left.height)), (split, LEG_TOP))
    return out


def narrow(leg, center_right, k):
    """aproxima os pes do centro (quem anda nao fica de pernas abertas). k = largura relativa no pe"""
    if abs(k - 1) < 1e-3:
        return leg
    out = Image.new('RGBA', leg.size, CLEAR)
    for y in range(leg.height):
        s = 1 + (k - 1) * (y / max(1, leg.height - 1))
        w = max(1, int(round(leg.width * s)))
        row = leg.crop((0, y, leg.width, y + 1)).resize((w, 1), Image.NEAREST)
        out.alpha_composite(row, (leg.width - w if center_right else 0, y))
    return out


def lift(leg, px):
    """encolhe a perna de baixo para cima: o pe sobe `px`, o quadril fica no lugar"""
    if px <= 0:
        return leg
    out = Image.new('RGBA', leg.size, CLEAR)
    out.alpha_composite(leg.resize((leg.width, max(1, leg.height - px)), Image.NEAREST), (0, 0))
    return out


def swing_arm(im, side, dy):
    """estica (dy > 0, mao mais baixa: braco indo para frente) ou encolhe o antebraco"""
    if dy == 0:
        return im
    x0, x1 = (0, ARM_L) if side == 'L' else (ARM_R, im.width)
    seg = im.crop((x0, ARM_TOP, x1, ARM_BOT))
    out = im.copy()
    out.paste(Image.new('RGBA', seg.size, CLEAR), (x0, ARM_TOP))
    out.alpha_composite(seg.resize((seg.width, max(1, seg.height + dy)), Image.NEAREST), (x0, ARM_TOP))
    return out


def frame(base, split, lift_l, lift_r, arm_l, arm_r, k):
    legL = lift(narrow(base.crop((0, LEG_TOP, split, base.height)), True, k), lift_l)
    legR = lift(narrow(base.crop((split, LEG_TOP, base.width, base.height)), False, k), lift_r)
    body = base.copy()
    body.paste(Image.new('RGBA', (base.width, base.height - LEG_TOP), CLEAR), (0, LEG_TOP))
    body = swing_arm(swing_arm(body, 'L', arm_l), 'R', arm_r)
    out = Image.new('RGBA', base.size, CLEAR)
    out.alpha_composite(legL, (0, LEG_TOP))
    out.alpha_composite(legR, (split, LEG_TOP))
    out.alpha_composite(body)
    return out


def cycle(base, heel, up, arm, k):
    split = legs_split(base)
    h = arm // 2
    return [
        frame(base, split, 0, heel, arm, -arm, k),    # contato: apoio na esquerda
        frame(base, split, 0, up, h, -h, k),          # passagem: direita passando
        frame(base, split, heel, 0, -arm, arm, k),    # contato: apoio na direita
        frame(base, split, up, 0, -h, h, k),          # passagem: esquerda passando
    ]


def main():
    p = lambda rel: os.path.join(ROOT, rel)
    for rel, orig in (('walk/_base_down.png', 'walk/down_0.png'), ('walk/_base_up.png', 'idle/up_0.png')):
        if not os.path.exists(p(rel)):
            Image.open(p(orig)).save(p(rel))
    down = symmetric_base(Image.open(p('walk/_base_down.png')).convert('RGBA'))
    up = Image.open(p('walk/_base_up.png')).convert('RGBA')
    specs = {'walk': dict(heel=6, up=16, arm=3), 'run': dict(heel=10, up=28, arm=6)}
    for kind, sp in specs.items():
        for d, base, k in (('down', down, 1.0), ('up', up, 0.72)):
            for i, f in enumerate(cycle(base, sp['heel'], sp['up'], sp['arm'], k)):
                f.save(p(f'{kind}/{d}_{i}.png'))
            print(f'{kind}/{d}: 4 quadros {base.size[0]}x{base.size[1]}')


if __name__ == '__main__':
    main()
