"""make_gem_kit.py - Monta o pacote de arte para o Gem do Gemini (docs/arte/gem/).

Gera:
  gabarito_piso.png        losango do piso (108x54) em 4x
  gabarito_parede.png      trecho de parede de 2 celulas, altura do muro (77) em 4x, nos dois sentidos
  gabarito_movel_1.png     volume maximo de um movel de 1 celula (altura 72) em 4x
  gabarito_movel_2.png     volume maximo de um movel de 2 celulas (cama, balcao grande) em 4x
  gabarito_movel_3.png     3 celulas em fila (mesa comprida, que o importador corta em ponta/meio/ponta)
  referencia_pecas.png     pecas atuais do atlas (paredes, portas, pisos, escada) para o estilo
  referencia_personagem.png  boneco parado/andando nas 4 direcoes
  paleta.png / paleta.txt  32 cores tiradas das pecas atuais

Fundo dos gabaritos: magenta puro (#FF00FF), que nao aparece na arte e sai facil na importacao.
Uso: python tools/arte/make_gem_kit.py
"""
import json
import os
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.normpath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(GAME, 'docs', 'arte', 'gem')
S = 4                                # escala dos gabaritos
MAGENTA = (255, 0, 255, 255)
GUIDE = (0, 255, 255, 255)           # linhas-guia (ciano)
GUIDE2 = (255, 255, 0, 255)          # altura maxima (amarelo)
WALL_H, FURN_H, CELL_W, CELL_H = 77, 72, 108, 54

os.makedirs(OUT, exist_ok=True)


def canvas(w, h):
    im = Image.new('RGBA', (w, h), MAGENTA)
    return im, ImageDraw.Draw(im)


def diamond(cx, cy, w=CELL_W, h=CELL_H):
    return [(cx - w / 2 * S, cy), (cx, cy - h / 2 * S), (cx + w / 2 * S, cy), (cx, cy + h / 2 * S)]


def gabarito_piso():
    im, d = canvas(CELL_W * S + 64, CELL_H * S + 64)
    d.polygon(diamond(im.width / 2, im.height / 2), outline=GUIDE, width=3)
    im.save(os.path.join(OUT, 'gabarito_piso.png'))


def gabarito_parede():
    # parede de 2 celulas: base em diagonal 2:1 (108 x 54 px) e altura do muro 77 px; esquerda '\', direita '/'
    run_x, run_y = 2 * CELL_W // 2, 2 * CELL_H // 2
    pad = 40
    w = (run_x * 2 + 60) * S + pad * 2
    h = (run_y + WALL_H + 20) * S + pad * 2
    im, d = canvas(w, h)
    base_y = h - pad - 10 * S
    for k, sign in ((0, 1), (1, -1)):
        x0 = pad + (k * (run_x + 60)) * S + (0 if sign > 0 else run_x * S)
        a = (x0, base_y - run_y * S)
        b = (x0 + sign * run_x * S, base_y)
        top_a = (a[0], a[1] - WALL_H * S)
        top_b = (b[0], b[1] - WALL_H * S)
        d.line([a, b], fill=GUIDE, width=3)                 # linha de chao
        d.line([top_a, top_b], fill=GUIDE2, width=3)        # topo do muro
        d.line([a, top_a], fill=GUIDE, width=2)
        d.line([b, top_b], fill=GUIDE, width=2)
    im.save(os.path.join(OUT, 'gabarito_parede.png'))


def box_template(cells):
    """volume maximo de um movel de N celulas em fila no eixo i (desce para a direita)"""
    m = 20                                                   # margem (px do jogo)
    # pegada: celula k tem centro c0 + k*(54, 27); limites em px do jogo, relativos a c0
    x0, x1 = -CELL_W / 2, CELL_W / 2 * (cells - 1) + CELL_W / 2
    y0, y1 = -CELL_H / 2 - FURN_H, CELL_H / 2 * (cells - 1) + CELL_H / 2
    im, d = canvas(int((x1 - x0 + 2 * m) * S), int((y1 - y0 + 2 * m) * S))
    c0 = ((m - x0) * S, (m - y0) * S)
    cells_pts = [diamond(c0[0] + k * CELL_W / 2 * S, c0[1] + k * CELL_H / 2 * S) for k in range(cells)]
    for poly in cells_pts:
        d.polygon(poly, outline=GUIDE, width=3)
    left, back = cells_pts[0][0], cells_pts[0][1]
    right, front = cells_pts[-1][2], cells_pts[-1][3]
    for p in (left, right, front, back):
        d.line([p, (p[0], p[1] - FURN_H * S)], fill=GUIDE2, width=2)
    top = [(p[0], p[1] - FURN_H * S) for p in (left, back, right, front)]
    d.polygon(top, outline=GUIDE2, width=3)
    im.save(os.path.join(OUT, f'gabarito_movel_{cells}.png'))


def referencia_pecas():
    atlas_dir = os.path.join(GAME, 'assets', 'dungeon')
    meta = json.load(open(os.path.join(atlas_dir, 'dungeon_game_atlas.json'), encoding='utf-8'))
    frames = meta.get('frames', meta)
    sheet = Image.open(os.path.join(atlas_dir, 'dungeon_game_atlas.png')).convert('RGBA')
    names = ['wood_wall_panel_01', 'wood_wall_panel_02', 'wood_wall_cross_01', 'wood_corner_cross_01', 'door_wood_01', 'portal_wood_01',
             'stone_wall_straight_01', 'stone_wall_mossy_01', 'stone_corner_01', 'brick_wall_torch_01', 'gate_iron_01',
             'floor_wood_01', 'floor_stone_01', 'floor_parquet_01', 'stair_wood_01']
    crops = []
    for n in names:
        f = frames.get(n)
        if not f:
            continue
        fr = f['frame']
        crops.append(sheet.crop((fr['x'], fr['y'], fr['x'] + fr['w'], fr['y'] + fr['h'])).resize((fr['w'] * 2, fr['h'] * 2), Image.NEAREST))
    W = sum(c.width for c in crops) + 20 * (len(crops) + 1)
    H = max(c.height for c in crops) + 40
    out = Image.new('RGBA', (W, H), (74, 107, 58, 255))
    x = 20
    for c in crops:
        out.alpha_composite(c, (x, H - 20 - c.height)); x += c.width + 20
    out.save(os.path.join(OUT, 'referencia_pecas.png'))
    return crops


def referencia_personagem():
    pv = os.path.join(GAME, 'assets', 'player', 'v2')
    files = ['idle/down_0', 'walk/down_1', 'idle/up_0', 'walk/up_1', 'walk/right_0', 'walk/right_2', 'walk/left_1', 'idle/right_0']
    ims = [Image.open(os.path.join(pv, f + '.png')).convert('RGBA') for f in files]
    W = sum(i.width for i in ims) + 20 * (len(ims) + 1)
    H = max(i.height for i in ims) + 40
    out = Image.new('RGBA', (W, H), (74, 107, 58, 255))
    x = 20
    for i in ims:
        out.alpha_composite(i, (x, H - 20 - i.height)); x += i.width + 20
    out.save(os.path.join(OUT, 'referencia_personagem.png'))
    return ims


def paleta(images):
    big = Image.new('RGBA', (sum(i.width for i in images), max(i.height for i in images)), (0, 0, 0, 0))
    x = 0
    for i in images:
        big.alpha_composite(i, (x, 0)); x += i.width
    data = big.get_flattened_data() if hasattr(big, 'get_flattened_data') else big.getdata()
    px = [p[:3] for p in data if p[3] > 200]
    sample = Image.new('RGB', (len(px), 1)); sample.putdata(px)
    q = sample.quantize(colors=32, method=Image.MEDIANCUT)
    pal = q.getpalette()[:32 * 3]
    cols = sorted({tuple(pal[i:i + 3]) for i in range(0, len(pal), 3)}, key=lambda c: (0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]))
    sw = Image.new('RGB', (len(cols) * 40, 40))
    d = ImageDraw.Draw(sw)
    for n, c in enumerate(cols):
        d.rectangle([n * 40, 0, n * 40 + 39, 39], fill=c)
    sw.save(os.path.join(OUT, 'paleta.png'))
    with open(os.path.join(OUT, 'paleta.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join('#%02X%02X%02X' % c for c in cols) + '\n')


if __name__ == '__main__':
    gabarito_piso()
    gabarito_parede()
    box_template(1)
    box_template(2)
    box_template(3)
    pecas = referencia_pecas()
    boneco = referencia_personagem()
    paleta(pecas + boneco)
    print('pacote em', OUT)
    for f in sorted(os.listdir(OUT)):
        print('  ', f)
