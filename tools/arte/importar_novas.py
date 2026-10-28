"""importar_novas.py - Leva a arte gerada (Gem do Gemini) de assets/_novas/ para o jogo (assets/arte/).

Para cada imagem listada em tools/arte/pecas.json:
  piso  -> acha a face de cima do losango (mesmo com angulo errado e com espessura), achata para 2:1,
           reduz para 108x54 e usa o contorno exato do piso do atlas (emenda sem fresta)
  movel -> tira o fundo magenta, recorta, escala pela pegada no chao (1 celula = 108 px de largura,
           2 celulas = 162 px) e calcula o ponto de encaixe (centro da celula ancora no plano do piso)
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


def importar_movel(path, kind, rot, cells, mirror=None):
    im = load_rgba(path)
    bbox = im.getbbox()
    im = im.crop(bbox)
    foot_w = CELL_W if cells == 1 else CELL_W + CELL_W // 2      # largura da pegada no chao
    scale = foot_w / im.width
    out = im.convert('RGBa').resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS).convert('RGBA')
    w, h = out.size
    # centro da celula ancora, no plano do piso:
    #   1 celula: centro no meio, 27 acima do ponto mais baixo
    #   2 celulas: rot 0/180 (eixo i) -> ancora na ponta esquerda; rot 90/270 (eixo j) -> na ponta direita
    if cells == 1:
        ox, oy = w / 2, h - 27
    elif rot % 180 == 0:
        ox, oy = 54, h - 54
    else:
        ox, oy = w - 54, h - 54
    name = f'{kind}_{rot}.png'
    out.save(os.path.join(OUT, name))
    altura = oy - 27                                # do chao (canto de tras da celula) ate o topo do sprite
    aviso = f'altura {altura:.0f} px' + (' - PASSA DO MURO, vai furar o telhado' if altura > WALL_TOP else '')
    entry = {'file': name, 'w': w, 'h': h, 'ox': round(ox), 'oy': round(oy)}
    if mirror is None:
        return name, entry, aviso
    # espelho: troca o eixo (0<->90, 180<->270); a ancora continua no mesmo canto da pegada, do outro lado
    mname = f'{kind}_{mirror}.png'
    out.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(OUT, mname))
    mentry = {'file': mname, 'w': w, 'h': h, 'ox': round(w - ox), 'oy': round(oy), 'espelhado': True}
    return name, entry, aviso, (mirror, mentry)


def main():
    os.makedirs(OUT, exist_ok=True)
    pecas = json.load(open(os.path.join(HERE, 'pecas.json'), encoding='utf-8'))
    manifest = {'floors': {}, 'furniture': {}}
    for fname, spec in pecas.items():
        if fname.startswith('_'):
            continue
        path = os.path.join(SRC, fname)
        if not os.path.exists(path):
            print('falta', fname); continue
        if spec['tipo'] == 'piso':
            name, entry, info = importar_piso(path, spec['substitui'])
            manifest['floors'][spec['substitui']] = entry
        else:
            res = importar_movel(path, spec['movel'], spec['rot'], spec.get('celulas', 1), spec.get('espelho'))
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
