"""importar_novas.py - Leva a arte gerada (Gem do Gemini) de assets/_novas/ para o jogo (assets/arte/).

Para cada imagem listada em tools/arte/pecas.json:
  piso  -> acha a face de cima do losango (mesmo com angulo errado e com espessura), achata para 2:1,
           reduz para 108x54 e usa o contorno exato do piso do atlas (emenda sem fresta)
  movel -> tira o fundo magenta, recorta, escala pela pegada no chao (1 celula = 108 px de largura,
           2 celulas = 162 px; 'largura' < 1 para movel menor que a celula) e calcula o ponto de encaixe
  mesa  -> como movel, mais as 16 pecas de emenda com os vizinhos (sem as pernas do lado emendado)
           e 'encurtar_pernas_px' para baixar o tampo sem mudar o pe das pernas
  textura_telhado -> textura chapada (vista de frente) de uma agua do telhado ou da empena: reduz para a
           escala do jogo ('linhas' fileiras de telha = linhas * 18 px de altura; empena: 'celulas' de largura
           = celulas * 60 px) e emenda as bordas para repetir sem costura (js/roofs.js pinta e inclina);
           'recorte' [x0,y0,x1,y1] corta so fileiras e colunas inteiras, e 'emendar': false dispensa a emenda
  piso_textura -> textura quadrada de piso vista de cima (emendavel) que cobre 'celulas' x 'celulas' celulas:
           corta em pedacos de 1 celula e projeta cada um no losango 108x54; o jogo escolhe o pedaco pela
           posicao da celula (i mod n, j mod n), entao as pedras continuam de uma celula para a outra sem grade.
           'substitui' = sprite do atlas, ou 'novo' = sprite que so existe na arte nova (tipo de piso novo)
  textura_terreno -> chao de um bioma (vista de cima): emenda as bordas, nivela as manchas grandes ('nivelar',
           fracao da largura do desfoque; 0 desliga), reduz para 'largura_px' (potencia de 2,
           padrao 256), achata pela metade na vertical (angulo da camera) e repete 2x na vertical: tile quadrado
           que js/ground.js usa no lugar da grama/areia recolorida
  retrato -> previa da tela de criacao de personagem (corpo inteiro, de frente, fundo magenta): tira o fundo,
           recorta e reduz para 'altura_px' (padrao 600). 'raca' (e 'classe', para a raca vestida com a roupa da
           classe) vira a chave em manifest.json -> portraits (js/character_creation.js). Arquivos retrato_<raca>.png e
           retrato_<raca>_<classe>.png em assets/_novas/ entram sozinhos (sem pecas.json)
Grava os PNGs em assets/arte/ e o assets/arte/manifest.json que o jogo le (js/art_overrides.js).

Uso: python tools/arte/importar_novas.py
"""
import json
import os
import time
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.normpath(os.path.join(HERE, '..', '..'))
SRC = os.path.join(GAME, 'assets', '_novas')
OUT = os.path.join(GAME, 'assets', 'arte')
ATLAS = os.path.join(GAME, 'assets', 'dungeon')
WALL_TOP, FURN_MAX = 77, 72
CELL_W, CELL_H = 108, 54


def magenta_mask(rgb):
    """True onde e fundo magenta (com folga: a imagem vem comprimida e o magenta nao e puro)"""
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    return (r > 150) & (b > 150) & (g < 120) & (abs(r - b) < 70)


def load_rgba(path):
    im = Image.open(path).convert('RGB')
    rgb = np.array(im)
    alpha = np.where(magenta_mask(rgb), 0, 255).astype(np.uint8)
    # tira o tom magenta que sobra na borda (pixels misturados com o fundo)
    edge = magenta_mask(np.roll(rgb, 1, 0)) | magenta_mask(np.roll(rgb, -1, 0)) | magenta_mask(np.roll(rgb, 1, 1)) | magenta_mask(np.roll(rgb, -1, 1))
    fix = edge & (alpha > 0)
    rgb = rgb.copy()
    rgb[fix, 0] = np.minimum(rgb[fix, 0], rgb[fix, 1] + 40)
    rgb[fix, 2] = np.minimum(rgb[fix, 2], rgb[fix, 1] + 40)
    return Image.fromarray(np.dstack([rgb, alpha]), 'RGBA')


def atlas_frame(name):
    meta = json.load(open(os.path.join(ATLAS, 'dungeon_game_atlas.json'), encoding='utf-8'))
    frames = meta.get('frames', meta)
    f = frames[name]
    sheet = Image.open(os.path.join(ATLAS, 'dungeon_game_atlas.png')).convert('RGBA')
    fr = f['frame']
    return sheet.crop((fr['x'], fr['y'], fr['x'] + fr['w'], fr['y'] + fr['h'])), f


def importar_piso(path, substitui):
    im = load_rgba(path)
    a = np.array(im)[..., 3] > 0
    ys, xs = np.where(a)
    top = np.array([xs[ys.argmin()], ys.min()], float)
    left = np.array([xs.min(), ys[xs.argmin()]], float)
    right = np.array([xs.max(), ys[xs.argmax()]], float)
    # face de cima = paralelogramo topo/esquerda/direita; o 4o canto sai da regra do paralelogramo
    # (a espessura, se houver, fica abaixo dele e e descartada)
    bottom = left + right - top
    center = (top + bottom) / 2
    inset = 0.97                                   # puxa 3% para dentro: corta o contorno escuro da borda
    T, L, R = [center + (p - center) * inset for p in (top, left, right)]
    S = 4                                          # amostra em 4x e reduz no fim (menos serrilhado)
    W, H = CELL_W * S, CELL_H * S
    # saida (x,y) -> u,v na malha do losango -> entrada = T + u*(R-T) + v*(L-T)
    # u = ((x - W/2)/(W/2) + y/(H/2)) / 2 ;  v = (y/(H/2) - (x - W/2)/(W/2)) / 2
    du, dv = R - T, L - T
    ax, ay = 1 / W, 1 / H                          # d(u)/dx = 1/W, d(u)/dy = 1/H ; d(v)/dx = -1/W, d(v)/dy = 1/H
    cx = du[0] * ax - dv[0] * ax
    cy = du[0] * ay + dv[0] * ay
    c0 = T[0] + du[0] * (-0.5) - dv[0] * (-0.5)
    fx = du[1] * ax - dv[1] * ax
    fy = du[1] * ay + dv[1] * ay
    f0 = T[1] + du[1] * (-0.5) - dv[1] * (-0.5)
    big = im.convert('RGBa').transform((W, H), Image.AFFINE, (cx, cy, c0, fx, fy, f0), resample=Image.BICUBIC)
    tile = big.resize((CELL_W, CELL_H), Image.LANCZOS).convert('RGBA')
    ref, _ = atlas_frame(substitui)                # contorno exato do piso atual
    arr = np.array(tile)
    arr[..., 3] = np.array(ref)[..., 3]
    out = Image.fromarray(arr, 'RGBA')
    name = substitui + '.png'
    out.save(os.path.join(OUT, name))
    ratio = (right[0] - left[0]) / max(1, (bottom[1] - top[1]))
    return name, {'file': name, 'w': CELL_W, 'h': CELL_H, 'anchor': {'x': CELL_W // 2, 'y': CELL_H // 2}}, f'losango de origem {ratio:.2f}:1 achatado para 2:1'


def tampo(a):
    """cantos da face de cima de um tampo isometrico (mascara alfa): topo, esquerda, direita e frente"""
    ys, xs = np.where(a)
    T = np.array([xs[ys.argmin()], ys.min()], float)
    L = np.array([xs.min(), ys[xs <= xs.min() + 3].min()], float)
    R = np.array([xs.max(), ys[xs >= xs.max() - 3].min()], float)
    return T, L, R, L + R - T


def borda_frente(L, F, R, x):
    """y da borda da frente do tampo (esquerda->frente->direita) na coluna x"""
    if x <= F[0]:
        return L[1] + (x - L[0]) / max(1, F[0] - L[0]) * (F[1] - L[1])
    return F[1] + (x - F[0]) / max(1, R[0] - F[0]) * (R[1] - F[1])


def encurtar_pernas(im, k, base):
    """tira k linhas das pernas logo abaixo do tampo+saia (base = px da imagem abaixo da borda da frente):
    em cada coluna o que esta acima desce k px, entao o tampo baixa e o pe das pernas fica no lugar"""
    arr = np.array(im)
    _, L, R, F = tampo(arr[..., 3] > 0)
    out = np.zeros_like(arr)
    for x in range(arr.shape[1]):
        yc = int(borda_frente(L, F, R, x) + base)
        out[yc + k:, x] = arr[yc + k:, x]
        out[k:yc + k, x] = arr[:yc, x]
    return Image.fromarray(out, 'RGBA')


def pernas(im, base):
    """colunas de cada perna visivel (abaixo do tampo+saia): {'esq','frente','dir'} -> (x0, x1, linha de corte)"""
    arr = np.array(im)
    a = arr[..., 3] > 0
    _, L, R, F = tampo(a)
    cut = np.array([borda_frente(L, F, R, x) + base for x in range(a.shape[1])])
    below = a & (np.arange(a.shape[0])[:, None] >= cut[None, :])
    cols = below.any(0)
    runs, x = [], 0
    while x < len(cols):
        if cols[x]:
            x0 = x
            while x < len(cols) and cols[x]:
                x += 1
            if x - x0 > 8:
                runs.append((x0, x))
        x += 1
    if len(runs) != 3:
        raise SystemExit(f'esperava 3 pernas visiveis abaixo do tampo, achei {len(runs)}: ajuste "base_do_tampo"')
    return dict(zip(('esq', 'frente', 'dir'), runs)), cut


def importar_mesa(path, spec):
    """mesa de 1 celula + as pecas emendadas: para cada mascara de vizinhos (bit0 +a, bit1 -a, bit2 +b, bit3 -b)
    some com as pernas do lado emendado; o tampo ja cobre a celula inteira, entao as mesas se juntam sem fresta"""
    im = load_rgba(path)
    im = im.crop(im.getbbox())
    scale = CELL_W / im.width
    base = spec.get('base_do_tampo', 245)
    if spec.get('encurtar_pernas_px'):
        im = encurtar_pernas(im, round(spec['encurtar_pernas_px'] / scale), base)
        im = im.crop(im.getbbox())
    legs, cut = pernas(im, base)
    # perna da esquerda = canto (a-, b+); da direita = (a+, b-); da frente = (a+, b+); a de tras fica escondida
    some = {1: ('dir', 'frente'), 2: ('esq',), 4: ('esq', 'frente'), 8: ('dir',)}
    entries, size = {}, (max(1, round(im.width * scale)), max(1, round(im.height * scale)))
    for mask in range(16):
        arr = np.array(im)
        for bit, names in some.items():
            if mask & bit:
                for n in names:
                    x0, x1 = legs[n]
                    for x in range(x0, x1):
                        arr[int(cut[x]) - 20:, x, 3] = 0     # um pouco acima do corte: sem toco de perna na emenda
        out = Image.fromarray(arr, 'RGBA').convert('RGBa').resize(size, Image.LANCZOS).convert('RGBA')
        w, h = out.size
        name = f'{spec["movel"]}_m{mask}.png'
        out.save(os.path.join(OUT, name))
        entries['m' + str(mask)] = {'file': name, 'w': w, 'h': h, 'ox': round(w / 2), 'oy': h - 27}
    altura = entries['m0']['oy'] - 27
    return f'{spec["movel"]}_m0..m15.png', entries, f'altura {altura} px, 16 pecas de emenda'


def limpar(im, spec):
    """retoques na imagem original: 'apagar' = retangulos [x0,y0,x1,y1] a apagar (sobras do gerador);
    'so_maior' = fica so com a maior peca (some pedaco solto); 'tirar_madeira' = apaga fundo de tabuas marrons;
    'manter' = apaga tudo fora das formas dadas (retangulos e elipses); 'so_marmore_em' = nessas areas, so marmore"""
    arr = np.array(im)
    for x0, y0, x1, y1 in spec.get('apagar', []):
        arr[y0:y1, x0:x1, 3] = 0
    if spec.get('manter'):                             # so o que estiver dentro destas formas: ['r', x0,y0,x1,y1] ou ['e', cx,cy,rx,ry]
        h, w = arr.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]; keep = np.zeros((h, w), bool)
        for f in spec['manter']:
            if f[0] == 'r': keep |= (xx >= f[1]) & (xx < f[3]) & (yy >= f[2]) & (yy < f[4])
            else: keep |= ((xx - f[1]) / f[3]) ** 2 + ((yy - f[2]) / f[4]) ** 2 <= 1
        arr[~keep, 3] = 0
    for x0, y0, x1, y1 in spec.get('so_marmore_em', []):    # nesta area fica so o que e claro e quase sem cor (marmore); some bronze/brasa
        r, g, b = (arr[y0:y1, x0:x1, i].astype(int) for i in range(3))
        mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b)
        marble = (mx > 95) & ((mx - mn) < 0.22 * mx)
        marble = marble | np.roll(marble, 1, 0) | np.roll(marble, -1, 0) | np.roll(marble, 1, 1) | np.roll(marble, -1, 1)   # leva junto o contorno
        sub = arr[y0:y1, x0:x1, 3]; sub[~marble] = 0
    if spec.get('tirar_madeira'):                      # fundo de tabuas que o gerador deixou: marrom saturado (o ouro e mais amarelo e claro)
        r, g, b = (arr[..., i].astype(int) for i in range(3))
        mx = np.maximum(np.maximum(r, g), b)
        wood = (r > g) & (g > b) & (r - b > 35) & (g < r * 0.74) & (mx < 215)
        pink = (r > g + 30) & (b > g + 25)              # magenta misturado no que sobrou
        arr[wood | pink, 3] = 0
    if spec.get('so_maior'):
        a = arr[::4, ::4, 3] > 0                       # componentes numa copia 1/4 (rapido)
        lab = np.zeros(a.shape, int); best, n = (0, 0), 0
        for y, x in zip(*np.where(a)):
            if lab[y, x]:
                continue
            n += 1; lab[y, x] = n; stack, size = [(y, x)], 0
            while stack:
                cy, cx = stack.pop(); size += 1
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < a.shape[0] and 0 <= nx < a.shape[1] and a[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; stack.append((ny, nx))
            best = max(best, (size, n))
        keep = lab == best[1]
        keep = keep | np.roll(keep, 1, 0) | np.roll(keep, -1, 0) | np.roll(keep, 1, 1) | np.roll(keep, -1, 1)
        keep = np.repeat(np.repeat(keep, 4, 0), 4, 1)[:arr.shape[0], :arr.shape[1]]
        arr[~keep, 3] = 0
    return Image.fromarray(arr, 'RGBA')


def importar_movel(path, spec):
    """spec (pecas.json): movel, rot, celulas, espelho e o tamanho:
      largura  -> fracao da celula que a pegada ocupa (1 = celula inteira; cadeira 0.45), centrada nela
      altura   -> escala pela altura em px do jogo (poste, candelabro); 'pe' = largura do pe, ancora no x do pe
      encosto  -> movel fino encostado na parede (estante): 'altura' = altura da caixa, costas na borda da celula
      chamas / brilho -> pontos [x, y(, tamanho)] na imagem original onde o jogo desenha fogo / halo de luz"""
    kind, rot, cells, mirror = spec['movel'], spec['rot'], spec.get('celulas', 1), spec.get('espelho')
    largura = spec.get('largura', 1.0)
    im = limpar(load_rgba(path), spec)
    bbox = im.getbbox()
    im = im.crop(bbox)
    if spec.get('encosto'):
        scale = spec['altura'] / (im.height - im.width / 2)     # caixa: altura do sprite = altura + largura/2
        if 'comprimento_max' in spec:                           # mais comprido que isso sai da celula: reduz tudo
            scale = min(scale, 54 * (spec['comprimento_max'] + spec.get('profundidade', 0.3)) / im.width)
    elif spec.get('altura'):
        scale = spec['altura'] / im.height
    else:
        foot_w = CELL_W * largura if cells == 1 else CELL_W + CELL_W // 2      # largura da pegada no chao
        scale = foot_w / im.width
    out = im.convert('RGBa').resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS).convert('RGBA')
    w, h = out.size
    # centro da celula ancora, no plano do piso:
    #   1 celula: centro no meio, 27*largura acima do ponto mais baixo
    #   2 celulas: rot 0/180 (eixo i) -> ancora na ponta esquerda; rot 90/270 (eixo j) -> na ponta direita
    #   encosto: costas na borda da celula, centrado no comprimento (prof. 0.3 celula)
    #   altura: x do pe (media das linhas mais baixas), 27*pe acima do ponto mais baixo
    if spec.get('encosto'):
        L = w / 54 - spec.get('profundidade', 0.3)
        if rot in (90, 180):
            ox, oy = 54 * (L / 2 + 0.5), h - 27 * (L / 2 + 0.5) if rot == 180 else h - 27 * (spec.get('profundidade', 0.3) + L / 2 - 0.5)
        else:
            ox, oy = w - 54 * (L / 2 + 0.5), h - 27 * (L / 2 + 0.5) if rot == 270 else h - 27 * (spec.get('profundidade', 0.3) + L / 2 - 0.5)
    elif spec.get('altura'):
        a = np.array(out)[..., 3] > 8
        ys, xs = np.where(a)
        ox, oy = xs[ys >= ys.max() - 3].mean(), h - 27 * spec.get('pe', 0.2)
    elif cells == 1:
        ox, oy = w / 2, h - 27 * largura
    elif rot % 180 == 0:
        ox, oy = 54, h - 54
    else:
        ox, oy = w - 54, h - 54
    name = f'{kind}_{rot}.png'
    out.save(os.path.join(OUT, name))
    altura = oy - 27                                # do chao (canto de tras da celula) ate o topo do sprite
    aviso = f'altura {altura:.0f} px' + (' - PASSA DO MURO, vai furar o telhado' if altura > WALL_TOP else '')
    if spec.get('encosto'):
        aviso += f', comprimento {L:.2f} celula'
    entry = {'file': name, 'w': w, 'h': h, 'ox': round(ox), 'oy': round(oy)}
    pt = lambda q: [round((q[0] - bbox[0]) * scale - ox), round((q[1] - bbox[1]) * scale - oy)]   # relativo a ancora
    if spec.get('chamas'):
        entry['chamas'] = [pt(q) + [q[2] if len(q) > 2 else 0.5] for q in spec['chamas']]
    if spec.get('brilho'):
        entry['brilho'] = pt(spec['brilho'])
    if mirror is None:
        return name, entry, aviso
    # espelho: troca o eixo (0<->90, 180<->270); a ancora continua no mesmo canto da pegada, do outro lado
    mname = f'{kind}_{mirror}.png'
    out.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(OUT, mname))
    mentry = {'file': mname, 'w': w, 'h': h, 'ox': round(w - ox), 'oy': round(oy), 'espelhado': True}
    if 'chamas' in entry:
        mentry['chamas'] = [[-c[0], c[1], c[2]] for c in entry['chamas']]
    if 'brilho' in entry:
        mentry['brilho'] = [-entry['brilho'][0], entry['brilho'][1]]
    return name, entry, aviso, (mirror, mentry)


ROW_PX, GABLE_CELL_PX = 18, 60          # ROW_PX = TEX_ROW de js/roofs.js


def emendar(a, frac):
    """Deixa a textura repetir sem costura: o fim de cada eixo (ultimos m px) entra em fade sobre o comeco e sai.
    Ao repetir, o ultimo px que fica e vizinho do primeiro (que agora e o px logo apos ele na imagem original)."""
    a = a.astype(float)
    for ax in (1, 0):
        n = a.shape[ax]; m = max(2, int(n * frac))
        shp = [1, 1, 1]; shp[ax] = m
        t = (np.arange(m) / m).reshape(shp)                           # 0 no comeco (so o fim), 1 em m (so o comeco)
        head = np.take(a, range(m), axis=ax); tail = np.take(a, range(n - m, n), axis=ax)
        body = np.take(a, range(m, n - m), axis=ax)
        a = np.concatenate([head * t + tail * (1 - t), body], axis=ax)
    return np.clip(a, 0, 255).astype(np.uint8)


def importar_textura_telhado(path, spec):
    im = Image.open(path).convert('RGB')
    if spec.get('recorte'):                      # [x0, y0, x1, y1]: so fileiras/colunas inteiras (ai repete sem precisar emendar)
        im = im.crop(tuple(spec['recorte']))
    if spec['estilo'] == 'empena':
        cel = spec.get('celulas', 1)
        w = int(GABLE_CELL_PX * cel); h = max(8, round(im.height * w / im.width))
    else:
        h = int(ROW_PX * spec.get('linhas', 8)); w = max(8, round(im.width * h / im.height))
    a = np.array(im)
    if spec.get('emendar', True):
        a = emendar(a, 0.08)
    a = np.array(Image.fromarray(a).resize((w, h), Image.LANCZOS))
    name = f'telhado_{spec["estilo"]}.png'
    Image.fromarray(a, 'RGB').save(os.path.join(OUT, name))
    entry = {'file': name}
    if spec['estilo'] == 'empena': entry['celulas'] = spec.get('celulas', 1)
    else: entry['linhas'] = spec.get('linhas', 8)
    return name, entry, f'{w}x{h} px'


def importar_piso_textura(path, spec):
    k = int(spec.get('celulas', 2))
    name = spec.get('substitui') or spec['novo']
    im = Image.open(path).convert('RGB')
    if spec.get('recorte'):
        im = im.crop(tuple(spec['recorte']))
    a = np.array(im)
    if spec.get('emendar', True):
        a = emendar(a, 0.06)
    S = 4                                            # amostra em 4x e reduz no fim
    n = 64 * S                                       # px de textura por celula (o lado do losango tem ~60 px)
    N = n * k
    tex = np.array(Image.fromarray(a).resize((N, N), Image.LANCZOS))
    W, H = CELL_W * S, CELL_H * S
    y, x = np.mgrid[0:H, 0:W].astype(float)
    X, Y = x + 0.5 - W / 2, y + 0.5
    ua = (X / (W / 2) + Y / (H / 2)) / 2             # eixo a (+i, desce para a direita) = x da textura
    vb = (Y / (H / 2) - X / (W / 2)) / 2             # eixo b (+j, desce para a esquerda) = y da textura
    ref, _ = atlas_frame('floor_stone_01')           # contorno exato do losango do atlas
    alpha = np.array(ref)[..., 3]
    pecas = {}
    for ci in range(k):
        for cj in range(k):
            u = (((ci + ua) * n).astype(int)) % N
            v = (((cj + vb) * n).astype(int)) % N
            big = tex[v, u]
            tile = np.array(Image.fromarray(big).resize((CELL_W, CELL_H), Image.LANCZOS))
            fname = f'{name}_{ci}{cj}.png'
            Image.fromarray(np.dstack([tile, alpha]), 'RGBA').save(os.path.join(OUT, fname))
            pecas[f'{ci},{cj}'] = fname
    entry = {'file': pecas['0,0'], 'w': CELL_W, 'h': CELL_H, 'anchor': {'x': CELL_W // 2, 'y': CELL_H // 2}, 'celulas': k, 'pecas': pecas}
    return name, entry, f'{k}x{k} pecas de losango'


BIOMAS = ('PLAINS', 'FOREST', 'DENSE', 'HILLS', 'DESERT', 'SHORE', 'CANYON', 'MOUNTAIN', 'SNOW')     # GroundRenderer.B


def nivelar(a, frac):
    """Tira as manchas grandes de claro/escuro (que denunciam a repeticao do tile) e deixa so os detalhes pequenos:
    imagem - desfoque largo + media. O desfoque e feito no tile repetido 3x3, entao continua emendando."""
    from PIL import ImageFilter
    h, w = a.shape[:2]
    big = np.tile(a, (3, 3, 1))
    blur = np.array(Image.fromarray(big).filter(ImageFilter.GaussianBlur(radius=max(4, w * frac))))[h:2 * h, w:2 * w].astype(float)
    out = a.astype(float) - blur + a.reshape(-1, 3).mean(0)
    return np.clip(out, 0, 255).astype(np.uint8)


def importar_textura_terreno(path, spec):
    bio = spec['bioma']
    assert bio in BIOMAS, f'bioma desconhecido: {bio}'
    im = Image.open(path).convert('RGB')
    if spec.get('recorte'):
        im = im.crop(tuple(spec['recorte']))
    a = np.array(im)
    if spec.get('emendar', True):
        a = emendar(a, 0.08)
    w = int(spec.get('largura_px', 256))
    assert w & (w - 1) == 0, 'largura_px tem que ser potencia de 2'
    if spec.get('nivelar', 1 / 6):
        a = nivelar(a, spec.get('nivelar', 1 / 6))
    half = np.array(Image.fromarray(a).resize((w, w // 2), Image.LANCZOS))   # achatado 2:1 (camera do jogo)
    tile = np.concatenate([half, half], axis=0)
    name = f'chao_{bio.lower()}.png'
    Image.fromarray(tile, 'RGB').save(os.path.join(OUT, name))
    return name, {'file': name}, f'{w}x{w} px (achatado 2:1)'


CLASSES = {'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge', 'paladino', 'patrulheiro', 'ladino',
           'feiticeiro', 'bruxo', 'mago'}
BASE_REFS = {}                                       # cor media de pele/cabelo/olhos do boneco de cada raca


def importar_retrato(path, spec):
    im = limpar(load_rgba(path), spec)
    box = im.getbbox()
    im = im.crop(box)
    h = spec.get('altura_px', 600)
    w = max(1, round(im.width * h / im.height))
    im = im.resize((w, h), Image.LANCZOS)
    key = spec.get('chave') or spec['raca'] + ('_' + spec['classe'] if spec.get('classe') else '')
    name = f'retrato_{key}.png'
    im.save(os.path.join(OUT, name))
    entry, info = {'file': name, 'w': w, 'h': h, 'v': int(time.time())}, f'{w}x{h} px'   # v: o navegador nao usa a copia velha
    cores = json.load(open(os.path.join(HERE, 'cores_racas.json'), encoding='utf-8'))
    race = max((r for r in cores if not r.startswith('_') and (key == r or key.startswith(r + '_'))), key=len, default=None)
    if race:
        mask, refs, _ = mascara_cores(im, cores[race])
        # todas as roupas usam a cor de referencia do boneco da raca: o mesmo tom escolhido sai igual em qualquer roupa
        if key == race: BASE_REFS[race] = refs
        else: refs = {k: BASE_REFS.get(race, {}).get(k, v) for k, v in refs.items()}
        mname = f'retrato_{key}_mascara.png'
        mask.save(os.path.join(OUT, mname))
        entry.update({'mask': mname, 'ref': refs})
        info += '; mascara de cores: ' + ', '.join(refs)
    return key, name, entry, info


def hsv_arr(a):
    r, g, b = a[..., 0] / 255, a[..., 1] / 255, a[..., 2] / 255
    mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); d = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return h, np.where(mx > 0, (mx - mn) / (mx + 1e-9), 0), mx


def mascara_cores(im, cfg, frame=None):
    """pele / cabelo / olhos do retrato pela cor (cores_racas.json): nucleo pela faixa de cor, depois cresce 3 px
    para as sombras da mesma cor. Devolve a mascara RGB (R pele, G cabelo, B olhos), a cor media de cada parte e as
    partes (bool). frame = (x, y, w, h) do corpo na imagem: as fracoes y/caixa do cfg sao medidas nele"""
    a = np.array(im.convert('RGBA')).astype(float)
    H, W = a.shape[:2]
    fx, fy, fw, fh = frame or (0, 0, W, H)
    h, s, v = hsv_arr(a); op = a[..., 3] > 128
    yy, xx = np.mgrid[0:H, 0:W]; yf, xf = (yy - fy) / fh, (xx - fx) / fw
    inr = lambda x, r: (x >= r[0]) & (x <= r[1])
    inh = lambda x, r: inr(x, r) if r[0] <= r[1] else (x >= r[0]) | (x <= r[1])   # matiz: [350, 15] passa pelo 0
    parts, taken = {}, np.zeros((H, W), bool)
    for k in ('olhos', 'cabelo', 'pele'):          # olhos e cabelo primeiro: a pele nao rouba sobrancelha nem iris
        c = cfg.get(k)
        if not c:
            continue
        area = op & ~taken
        if 'y' in c: area &= inr(yf, c['y'])
        if 'caixa' in c:
            x0, y0, x1, y1 = c['caixa']; area &= (xf >= x0) & (xf <= x1) & (yf >= y0) & (yf <= y1)
        cor = inh(h, c['h']) & inr(s, c['s'])
        m = area & cor & inr(v, c['v'])
        if c.get('perto_do_branco'):              # iris: so colada no branco do olho (a sombra do chapeu nao conta)
            w = area & (v > 0.78) & (s < 0.25)
            for _ in range(c['perto_do_branco']):
                w = w | np.roll(w, 1, 0) | np.roll(w, -1, 0) | np.roll(w, 1, 1) | np.roll(w, -1, 1)
            m &= w
        if c.get('v_sombra') is not None:          # cresce para as sombras vizinhas da mesma cor
            cand = area & cor & (v >= c['v_sombra'])
            for _ in range(3):
                g = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
                m = g & cand
        parts[k] = m; taken |= m
    out = np.zeros((H, W, 3), np.uint8)
    refs = {}
    for i, k in enumerate(('pele', 'cabelo', 'olhos')):
        if k in parts and parts[k].any():
            out[parts[k], i] = 255
            refs[k] = '#%02x%02x%02x' % tuple(int(x) for x in a[parts[k]][:, :3].mean(0))
    return Image.fromarray(out, 'RGB'), refs, parts


# ---------------- retratos de uma raca, alinhados (roupas, penteados e barbas) ----------------
# Raca com 'cabeca' em cores_racas.json: o boneco (retrato_<raca>.png), as roupas (retrato_<raca>_<classe>.png), os
# penteados (cabelo_<raca>_<estilo>.png) e as barbas (barba_<raca>_<estilo>.png) sao encaixados no boneco pelos olhos
# (escala + posicao) e saem todos na MESMA tela, com o corpo no mesmo lugar. Assim o jogo (js/character_creation.js)
# troca penteado e barba de qualquer roupa so apagando a regiao (apagar_*) e desenhando a peca por cima.
ALINHAMENTO = os.path.join(HERE, 'alinhamento.json')     # cache: o encaixe leva alguns segundos por imagem


def _cinza(im):
    a = np.array(im.convert('RGBA')).astype(np.float32)
    g = a[..., :3].mean(-1); g[a[..., 3] < 128] = 255
    return g


def _busca(base_g, piece, r, D, box, perto=None, raio=None):
    from numpy.lib.stride_tricks import sliding_window_view as janelas
    x0, y0, x1, y1 = box
    T = base_g[D][y0 // D:y1 // D, x0 // D:x1 // D]; T = T - T.mean()
    w, h = max(1, int(piece.width * r / D)), max(1, int(piece.height * r / D))
    P = _cinza(piece.resize((w, h), Image.BILINEAR))
    if perto is None:
        oy, ox = 0, 0; P = P[: int(h * 0.35)]
    else:
        cx, cy = perto[0] // D, perto[1] // D
        oy, ox = max(0, cy - raio), max(0, cx - raio)
        P = P[oy: cy + raio + T.shape[0], ox: cx + raio + T.shape[1]]
    if P.shape[0] < T.shape[0] or P.shape[1] < T.shape[1]:
        return None
    J = janelas(P, T.shape)
    d = (((J - J.mean(axis=(2, 3), keepdims=True)) - T) ** 2).mean(axis=(2, 3))
    iy, ix = np.unravel_index(d.argmin(), d.shape)
    return d[iy, ix], ((ix + ox) * D, (iy + oy) * D)


def encaixe(base, piece, box):
    """(r, dx, dy): ponto da peca * r + (dx, dy) = ponto do boneco base. Compara a faixa dos olhos (box, no base):
    primeiro grosso (1/8, escalas de 0.70 a 1.40), depois fino (1/2) perto do melhor"""
    base_g = {D: _cinza(base.resize((base.width // D, base.height // D), Image.BILINEAR)) for D in (8, 2)}
    best = None
    for r in np.arange(0.70, 1.40, 0.02):
        b = _busca(base_g, piece, r, 8, box)
        if b and (best is None or b[0] < best[0]): best = (b[0], r, b[1])
    _, r0, p0 = best
    best = None
    for r in np.arange(r0 - 0.02, r0 + 0.021, 0.004):
        b = _busca(base_g, piece, r, 2, box, (int(p0[0] * r / r0), int(p0[1] * r / r0)), 10)
        if b and (best is None or b[0] < best[0]): best = (b[0], r, b[1])
    _, r, (px, py) = best
    return float(r), float(box[0] - px), float(box[1] - py)


def _crescer(m, n):
    for _ in range(n):
        m = m | np.roll(m, 1, 0) | np.roll(m, -1, 0) | np.roll(m, 1, 1) | np.roll(m, -1, 1)
    return m


def _encolher(m, n):
    return ~_crescer(~m, n)


def _diferente(a, b):
    """onde duas telas RGBA diferem de verdade (sem as linhas finas de um traco redesenhado 1-2 px ao lado)"""
    d = (np.abs(a[..., :3].astype(int) - b[..., :3].astype(int)).sum(-1) > 90) | ((a[..., 3] > 128) != (b[..., 3] > 128))
    return _crescer(_encolher(d, 2), 3)


def _preencher(a, buraco):
    """preenche o buraco com a cor dos vizinhos, de fora para dentro (camada por camada); devolve RGBA float"""
    f = a.astype(float).copy(); f[..., :3] *= f[..., 3:] / 255         # pre-multiplicado: o fundo nao suja a cor
    ok = ~buraco
    while (~ok).any():
        soma = np.zeros_like(f); n = np.zeros(ok.shape)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            okv = np.roll(ok, (dy, dx), (0, 1)); soma += np.roll(f, (dy, dx), (0, 1)) * okv[..., None]; n += okv
        novo = ~ok & (n > 0)
        if not novo.any():
            break
        f[novo] = soma[novo] / n[novo][:, None]; ok |= novo
    f[..., :3] /= np.maximum(f[..., 3:], 1) / 255
    return f


def _camada(img_arr, alpha, name):
    """salva so o pedaco com alpha (RGBA) e devolve {file, x, y}"""
    ys, xs = np.where(alpha)
    if not len(ys):
        return None
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    a = img_arr[y0:y1, x0:x1].copy()
    a[..., 3] = np.where(alpha[y0:y1, x0:x1], a[..., 3], 0)
    Image.fromarray(a.astype(np.uint8), 'RGBA').save(os.path.join(OUT, name))
    return {'file': name, 'x': int(x0), 'y': int(y0)}


def importar_raca(race, cfg, arquivos, altura=600):
    cab = cfg['cabeca']
    cache = json.load(open(ALINHAMENTO, encoding='utf-8')) if os.path.exists(ALINHAMENTO) else {}
    base = load_rgba(os.path.join(SRC, f'retrato_{race}.png'))
    bb = base.getbbox(); bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    k = altura / bh
    ob = cab['olhos_busca']
    box = (bb[0] + int(ob[0] * bw), bb[1] + int(ob[1] * bh), bb[0] + int(ob[2] * bw), bb[1] + int(ob[3] * bh))
    imgs, T = {}, {}
    for key, f in arquivos:
        path = os.path.join(SRC, f)
        im = base if key == race else load_rgba(path)
        st = os.stat(path); ck = f'{f}|{st.st_size}|{int(st.st_mtime)}|{os.path.getsize(os.path.join(SRC, f"retrato_{race}.png"))}|{ob}'
        if key == race: T[key] = (1.0, 0.0, 0.0)
        elif ck in cache: T[key] = tuple(cache[ck])
        else:
            T[key] = encaixe(base, im, box); cache[ck] = list(T[key])
        imgs[key] = im
    json.dump(cache, open(ALINHAMENTO, 'w', encoding='utf-8'), indent=0)
    # tela comum: uniao de tudo (no espaco do boneco base), simetrica em volta do centro do corpo
    U = [1e9, 1e9, -1e9, -1e9]
    for key, im in imgs.items():
        r, dx, dy = T[key]; b = im.getbbox()
        U = [min(U[0], b[0] * r + dx), min(U[1], b[1] * r + dy), max(U[2], b[2] * r + dx), max(U[3], b[3] * r + dy)]
    U[3] = bb[3]                                           # embaixo: os pes do boneco (peca cortada embaixo nao estica a tela)
    cx = bb[0] + bw / 2; half = max(cx - U[0], U[2] - cx)
    X0, Y0 = cx - half, U[1]
    W, H = int(round(2 * half * k)), int(round((U[3] - Y0) * k))
    corpo = [round((bb[0] - X0) * k), round((bb[1] - Y0) * k), round(bw * k), altura]

    def na_tela(key):
        r, dx, dy = T[key]; im = imgs[key]
        q = im.resize((max(1, round(im.width * r * k)), max(1, round(im.height * r * k))), Image.LANCZOS)
        c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        c.paste(q, (round((dx - X0) * k), round((dy - Y0) * k)), q)
        return c

    nariz, queixo = corpo[1] + cab['nariz'] * altura, corpo[1] + cab['queixo'] * altura
    rx0, rx1 = corpo[0] + cab['rosto_x'][0] * corpo[2], corpo[0] + cab['rosto_x'][1] * corpo[2]
    yy, xx = np.mgrid[0:H, 0:W]
    v = int(time.time())
    banda = (yy >= nariz - 2) & (yy < queixo + 2) & (xx >= rx0) & (xx < rx1)       # faixa da barba
    retratos, refs_base, infos = {}, None, []
    heads = {'cabelo': {}, 'barba': {}, 'apagar': {'barba': {}}, 'chapeu': cab.get('chapeu', [])}
    # cabelo comprido que desce na frente (elfo): as mechas abaixo do nariz sao achadas comparando o boneco com um
    # penteado sem mechas (sem_mechas). Para trocar o penteado, cada roupa ganha um remendo (apagar.mechas) que
    # apaga as mechas dela e preenche com a roupa em volta (o pescoco e o ombro vem do penteado sem mechas)
    sm = cab.get('sem_mechas')
    if sm and f'cabelo:{sm}' not in imgs: sm = None
    if sm:
        abaixo = (yy >= nariz) & (yy < corpo[1] + cab['mechas_y'] * altura)
        acima = (yy >= nariz - 0.05 * altura) & (yy < nariz)        # a mecha acima do nariz nao entra no preenchimento
        t_sem = np.array(na_tela(f'cabelo:{sm}')); t_base = np.array(na_tela(race))
        # nucleo (diferenca grossa) + os contornos finos ligados a ele (a ponta da mecha sobre a tunica da mesma cor
        # so difere no contorno); depois fecha o miolo entre os contornos
        bruto = _crescer((np.abs(t_base[..., :3].astype(int) - t_sem[..., :3].astype(int)).sum(-1) > 90)
                         | ((t_base[..., 3] > 128) != (t_sem[..., 3] > 128)), 2) & (abaixo | acima)
        mechas = _diferente(t_base, t_sem) & (abaixo | acima)
        while True:
            novo = _crescer(mechas, 1) & bruto
            if (novo & ~mechas).sum() == 0: break
            mechas |= novo
        mechas = _encolher(_crescer(mechas, 3), 3) & (abaixo | acima) & (t_base[..., 3] > 8)
        heads['apagar']['mechas'] = {}
        # nas roupas a mecha esta no mesmo lugar, mas pode descer mais: faixa = mechas do boneco escorridas para baixo
        faixa = mechas.copy()
        for dy in range(2, int(0.16 * altura), 2): faixa |= np.roll(mechas, dy, 0)
        faixa = _crescer(faixa, 6) & (abaixo | acima)
    roupas = [key for key, _ in arquivos if not key.startswith(('cabelo:', 'barba:'))]
    rosto = {}                                              # por roupa: onde a barba pode trocar (rosto e pescoco a mostra)
    for key in roupas:
        tela = na_tela(key)
        name = f'retrato_{key}.png'; tela.save(os.path.join(OUT, name))
        mask, refs, parts = mascara_cores(tela, cfg, corpo)
        a = np.array(tela); op = a[..., 3] > 8
        if sm:                                              # mechas desta roupa: cor de cabelo perto das mechas do boneco
            c = cfg['cabelo']; hh, ss, vv = hsv_arr(a.astype(float))
            fio = op & (hh >= c['h'][0]) & (hh <= c['h'][1]) & (ss >= c['s'][0]) & (ss <= c['s'][1]) & (vv >= c['v_sombra'])
            if key == race:
                m_k = mechas
            else:                                           # cor de cabelo ligada as mechas do boneco, dentro da faixa
                m_k = fio & mechas
                solto = op & (hh >= c['h'][0] - 5) & (hh <= c['h'][1] + 10) & (ss >= 0.02) & (ss <= c['s'][1] + 0.1) & (vv >= 0.3)   # reflexo e sombra da mecha
                while True:
                    novo = _crescer(m_k, 1) & solto & faixa
                    if (novo & ~m_k).sum() == 0: break
                    m_k |= novo
                m_k = _encolher(_crescer(m_k, 3), 3)                      # fecha o miolo
                m_k = (m_k | (_crescer(m_k, 2) & (vv < 0.35))) & faixa & op  # + o contorno escuro da mecha
                # do lado do rosto (ate o queixo) nao ha roupa: tudo que esta onde o boneco sem mechas tem fundo e mecha
                m_k |= op & _crescer(mechas, 6) & (yy < queixo) & (t_sem[..., 3] < 128)
            fio_m = m_k & fio & abaixo
            parts['cabelo'] = parts.get('cabelo', np.zeros((H, W), bool)) | fio_m
            mk = np.array(mask); mk[fio_m, 0] = 0; mk[fio_m, 1] = 255; mask = Image.fromarray(mk, 'RGB')
            if parts['cabelo'].any(): refs['cabelo'] = '#%02x%02x%02x' % tuple(int(x) for x in a[parts['cabelo']][:, :3].mean(0))
            buraco = _crescer(m_k, 2) & (abaixo | acima)
            f = _preencher(a, buraco)
            # onde a roupa em volta do buraco e igual ao boneco sem mechas (pescoco, ombro, fundo), usa os pixels
            # dele (contorno nitido); onde a roupa e outra (capa, armadura), fica o preenchimento
            g = _preencher(t_sem, buraco)
            igual = buraco & (np.abs(f - g).sum(-1) < 80)
            f[igual] = t_sem[igual]
            # opaco onde o boneco sem mechas tem corpo, ou onde a roupa existe dos dois lados do buraco (capa,
            # armadura); o resto (ao lado do rosto e do pescoco) e fundo
            dentro = t_sem[..., 3] >= 128
            for y in np.where(buraco.any(1))[0]:
                xs = np.where(buraco[y])[0]
                for run in np.split(xs, np.where(np.diff(xs) > 1)[0] + 1):
                    x0, x1 = run[0] - 1, run[-1] + 1
                    if x0 >= 0 and x1 < W and a[y, x0, 3] > 128 and a[y, x1, 3] > 128: dentro[y, run] = True
            f[..., 3] = np.where(dentro, 255, 0) * ~igual + f[..., 3] * igual
            buraco &= abaixo                                # o remendo so cobre abaixo do nariz (acima vem o penteado)
            f = f.clip(0, 255).astype(np.uint8)
            fmask, _, _ = mascara_cores(Image.fromarray(f, 'RGBA'), dict(cfg, cabelo=dict(cfg['cabelo'], y=[0, 0])), corpo)
            z = np.zeros((H, W, 4), np.uint8); z[..., 3] = 255
            ent = {'hole': _camada(z, buraco, f'cabeca_{race}_apagar_mechas__{key}.png'),
                   'layer': _camada(f, buraco & (f[..., 3] > 0), f'cabeca_{race}_mechas__{key}.png')}
            fm4 = np.dstack([np.array(fmask), np.full((H, W), 255, np.uint8)])
            ent['layer']['mask'] = _camada(fm4, buraco & (f[..., 3] > 0), f'cabeca_{race}_mechas__{key}_mascara.png')['file']
            heads['apagar']['mechas'][key] = ent
        if key == race: refs_base = refs
        mname = f'retrato_{key}_mascara.png'; mask.save(os.path.join(OUT, mname))
        retratos[key] = {'file': name, 'w': W, 'h': H, 'v': v, 'corpo': corpo, 'mask': mname, 'ref': refs_base or refs}
        infos.append(f'retrato_{key}')
        pele = np.zeros((H, W), bool)
        for m in parts.values(): pele |= m
        pele = _crescer(pele, 2) & op & banda
        # cada linha: do primeiro ao ultimo pixel de rosto (fecha boca, barba por fazer e contornos; a gola fica de fora)
        R = np.zeros((H, W), bool)
        for y in np.where(pele.any(1))[0]:
            xs = np.where(pele[y])[0]; R[y, xs.min():xs.max() + 1] = True
        rosto[key] = R & op
        z = np.zeros((H, W, 4), np.uint8); z[..., 3] = 255
        heads['apagar']['barba'][key] = _camada(z, rosto[key], f'cabeca_{race}_apagar_barba__{key}.png')
        if key == race:                                     # penteado: apaga a cabeca do boneco acima do nariz
            heads['apagar']['cabelo'] = _camada(z, op & (yy < nariz), f'cabeca_{race}_apagar_cabelo.png')
    pc = dict(cfg); pc['cabelo'] = dict(cfg['cabelo'], y=[0, cab['mechas_y'] if sm else cab['queixo'] + 0.02])  # na peca, a barba conta como cabelo
    for key, _ in arquivos:
        if not key.startswith(('cabelo:', 'barba:')):
            continue
        kind, estilo = key.split(':')
        tela = na_tela(key); a = np.array(tela); op = a[..., 3] > 8
        mask, _, parts = mascara_cores(tela, pc, corpo)
        m4 = np.dstack([np.array(mask), np.full((H, W), 255, np.uint8)])
        pelo = parts.get('cabelo', np.zeros((H, W), bool))
        if kind == 'cabelo':                                # acima do nariz (2 px a mais: sem fresta) + cabelo que desce
            if sm:                                          # abaixo do nariz: o que difere do penteado sem mechas (trancas, franja)
                desce = _diferente(a, t_sem) & op & abaixo
                ligado = desce & _crescer(op & (yy < nariz + 2), 1)    # so o que esta ligado a cabeca (sem sobra solta)
                while True:
                    novo = _crescer(ligado, 1) & desce
                    if (novo & ~ligado).sum() == 0: break
                    ligado |= novo
                m4[ligado] = (0, 255, 0, 255)                       # abaixo do nariz a peca e so cabelo (a sombra nao e pele)
                alpha = (op & (yy < nariz + 2)) | ligado
            else:
                alpha = (op & (yy < nariz + 2)) | (_crescer(pelo, 1) & op & (yy < queixo))
            ent = _camada(a, alpha, f'cabeca_{race}_cabelo_{estilo}.png')
            ent['mask'] = _camada(m4, alpha, f'cabeca_{race}_cabelo_{estilo}_mascara.png')['file']
            heads['cabelo'][estilo] = ent
        else:                                               # barba: recortada para cada roupa (a gola fica na frente)
            fios = _crescer(pelo & banda, 1)
            heads['barba'][estilo] = {}
            for r in roupas:
                alpha = op & (_crescer(rosto[r], 1) | fios) & banda
                ent = _camada(a, alpha, f'cabeca_{race}_barba_{estilo}__{r}.png')
                ent['mask'] = _camada(m4, alpha, f'cabeca_{race}_barba_{estilo}__{r}_mascara.png')['file']
                heads['barba'][estilo][r] = ent
        infos.append(f'{kind}_{estilo}')
    return retratos, heads, f'{len(infos)} pecas alinhadas numa tela {W}x{H}: ' + ', '.join(infos)


def main():
    os.makedirs(OUT, exist_ok=True)
    pecas = json.load(open(os.path.join(HERE, 'pecas.json'), encoding='utf-8'))
    manifest = {'floors': {}, 'furniture': {}, 'roofs': {}, 'ground': {}, 'portraits': {}}
    # retratos (retrato_<raca>.png e retrato_<raca>_<classe>.png) entram sozinhos, sem precisar de pecas.json
    for f in sorted(os.listdir(SRC)):
        if f.startswith('retrato_') and f.endswith('.png') and f not in pecas:
            pecas[f] = {'tipo': 'retrato', 'chave': f[len('retrato_'):-len('.png')]}
    # racas com cabeca configurada: tudo da raca entra alinhado de uma vez (importar_raca)
    cores = json.load(open(os.path.join(HERE, 'cores_racas.json'), encoding='utf-8'))
    manifest['heads'] = {}
    for race, cfg in cores.items():
        if race.startswith('_') or 'cabeca' not in cfg or not os.path.exists(os.path.join(SRC, f'retrato_{race}.png')):
            continue
        arquivos = []
        for f in sorted(os.listdir(SRC)):
            if not f.endswith('.png'):
                continue
            stem = f[:-4]
            if stem == f'retrato_{race}':
                arquivos.insert(0, (race, f))
            elif stem.startswith(f'retrato_{race}_') and stem[len(f'retrato_{race}_'):] in CLASSES:
                arquivos.append((stem[len('retrato_'):], f))
            elif stem.startswith((f'cabelo_{race}_', f'barba_{race}_')):
                kind, rest = stem.split('_', 1)
                arquivos.append((f'{kind}:{rest[len(race) + 1:]}', f))
            else:
                continue
            pecas.pop(f, None)
        retratos, heads, info = importar_raca(race, cfg, arquivos)
        manifest['portraits'].update(retratos); manifest['heads'][race] = heads
        print(f'{race}: {info}')
    for fname, spec in pecas.items():
        if fname.startswith('_'):
            continue
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            print('falta', fname); continue
        if spec['tipo'] == 'piso':
            name, entry, info = importar_piso(path, spec['substitui'])
            manifest['floors'][spec['substitui']] = entry
        elif spec['tipo'] == 'textura_telhado':
            name, entry, info = importar_textura_telhado(path, spec)
            manifest['roofs'][spec['estilo']] = entry
        elif spec['tipo'] == 'piso_textura':
            name, entry, info = importar_piso_textura(path, spec)
            manifest['floors'][name] = entry
            name = name + '_*.png'
        elif spec['tipo'] == 'textura_terreno':
            name, entry, info = importar_textura_terreno(path, spec)
            manifest['ground'][spec['bioma']] = entry
        elif spec['tipo'] == 'retrato':
            key, name, entry, info = importar_retrato(path, spec)
            manifest['portraits'][key] = entry
        elif spec['tipo'] == 'mesa':
            name, entries, info = importar_mesa(path, spec)
            manifest['furniture'].setdefault(spec['movel'], {}).update(entries)
        else:
            res = importar_movel(path, spec)
            name, entry, info = res[:3]
            rots = manifest['furniture'].setdefault(spec['movel'], {})
            rots[str(spec['rot'])] = entry
            if len(res) > 3:
                m_rot, m_entry = res[3]
                rots.setdefault(str(m_rot), m_entry)        # arte propria daquela rotacao (se houver) vale mais que o espelho
                info += f'; espelhada -> {spec["movel"]}_{m_rot}.png'
        print(f'{fname} -> assets/arte/{name}  ({info})')
    with open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
    print('manifest:', os.path.join(OUT, 'manifest.json'))


if __name__ == '__main__':
    main()
