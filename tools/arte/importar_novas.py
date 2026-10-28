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
Grava os PNGs em assets/arte/ e o assets/arte/manifest.json que o jogo le (js/art_overrides.js).

Uso: python tools/arte/importar_novas.py
"""
import json
import os
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
    'so_maior' = fica so com a maior peca (some pedaco solto)"""
    arr = np.array(im)
    for x0, y0, x1, y1 in spec.get('apagar', []):
        arr[y0:y1, x0:x1, 3] = 0
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


def main():
    os.makedirs(OUT, exist_ok=True)
    pecas = json.load(open(os.path.join(HERE, 'pecas.json'), encoding='utf-8'))
    manifest = {'floors': {}, 'furniture': {}, 'roofs': {}, 'ground': {}}
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
