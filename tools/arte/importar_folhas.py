"""Folhas de quadros do boneco do mapa, por raca (assets/_novas/folha_<raca>_<acao>.png, fundo magenta).

  folha_<raca>_parado.png : 1 linha, 3 bonecos (frente, costas, perfil para a esquerda)
  folha_<raca>_andar.png  : 3 linhas (frente, costas, perfil para a esquerda) x 4 passos

Recorta cada boneco, poe todos na mesma escala e numa tela comum com os pes embaixo, faz a direita espelhando a
esquerda e gera a mascara de cores (R pele, G cabelo verde-chroma) com a mesma faixa de cor do retrato
(tools/arte/cores_racas.json). Saida: assets/player/racas/<raca>/<acao>/<dir>_<i>.png (+ _mascara.png) e
assets/player/racas/manifest.json, que o jogo (js/game.js) le para desenhar o boneco com as cores da criacao.

Uso: python tools/arte/importar_folhas.py
"""
import json
import os
import sys
import time

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SRC = os.path.join(ROOT, 'assets', '_novas')
OUT = os.path.join(ROOT, 'assets', 'player', 'racas')
sys.path.insert(0, HERE)
from importar_novas import load_rgba, mascara_cores  # noqa: E402

ALTURA = 400                       # altura da tela de cada quadro (o jogo desenha a tela inteira com 76 px de altura)
ACOES = {'parado': ('idle', [['down', 'up', 'left']]),
         'andar': ('walk', [['down'] * 4, ['up'] * 4, ['left'] * 4]),
         # diagonais (opcionais): 3/4 de frente e 3/4 de costas, viradas para a esquerda; a direita sai espelhada
         'parado_diagonal': ('idle', [['down_left', 'up_left']]),
         'andar_diagonal': ('walk', [['down_left'] * 4, ['up_left'] * 4])}
ESPELHO = {'left': 'right', 'down_left': 'down_right', 'up_left': 'up_right'}


def _faixas(v, minimo):
    r, st = [], None
    for i, x in enumerate(v):
        if x and st is None: st = i
        if not x and st is not None:
            if i - st >= minimo: r.append((st, i))
            st = None
    if st is not None and len(v) - st >= minimo: r.append((st, len(v)))
    return r


def recortar(path):
    """bonecos da folha, linha por linha (cada um recortado justo, RGBA)"""
    im = load_rgba(path); a = np.array(im); op = a[..., 3] > 128
    linhas = []
    for y0, y1 in _faixas(op.sum(1) > 3, 60):
        linha = []
        for x0, x1 in _faixas(op[y0:y1].sum(0) > 2, 30):
            sub = op[y0:y1, x0:x1]; ys, xs = np.where(sub)
            linha.append(im.crop((x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)))
        linhas.append(linha)
    return linhas


def centro_corpo(q):
    """x do meio do tronco e da cabeca (metade de cima): a perna que avanca nao empurra o boneco para o lado"""
    op = np.array(q)[..., 3] > 128
    ys, xs = np.where(op[: op.shape[0] * 45 // 100])
    return (xs.min() + xs.max()) / 2


def olha_para_direita(q):
    """perfil virado para a direita? Na altura do nariz, a ponta da frente e pele (nariz) e a de tras e cabelo verde
    (a barba fica mais embaixo e nao conta). Devolve +1 (direita), -1 (esquerda) ou 0 (nao deu para saber)"""
    a = np.array(q).astype(int); H = a.shape[0]; voto = 0
    for y in range(int(H * 0.08), int(H * 0.16)):
        xs = np.where(a[y, :, 3] > 128)[0]
        if len(xs) < 4: continue
        def verde(x): return a[y, x, 1] > a[y, x, 0] + 40 and a[y, x, 1] > a[y, x, 2] + 40
        e = any(verde(x) for x in xs[:3]); d = any(verde(x) for x in xs[-3:])
        if e and not d: voto += 1
        elif d and not e: voto -= 1
    return (voto > 0) - (voto < 0)


def lado_da_pele(q):
    """diagonal: de que lado da cabeca aparece pele (rosto de 3/4, ou orelha e bochecha de costas). Devolve o
    deslocamento em px do meio da pele em relacao ao meio da cabeca (negativo = virado para a esquerda)"""
    a = np.array(q).astype(int); top = a[: int(a.shape[0] * 0.18)]
    op = top[..., 3] > 128; R, G, B = top[..., 0], top[..., 1], top[..., 2]
    verde = op & (G > R + 40) & (G > B + 40); pele = op & (R > G + 15) & (R > B + 15) & ~verde
    if pele.sum() < 50: return 0
    xs = np.where(op)[1]
    return np.where(pele)[1].mean() - (xs.min() + xs.max()) / 2


def passo_fechado(qs):
    """quadro de andar com os pes mais juntos (serve de boneco parado quando a folha parada nao existe)"""
    def abertura(q):
        op = np.array(q)[..., 3] > 128; pes = op[int(op.shape[0] * 0.85):]
        xs = np.where(pes.any(0))[0]
        return (xs.max() - xs.min()) / q.height if len(xs) else 9
    return min(qs, key=abertura)


def importar(race, cfg, ref):
    folhas = {acao: os.path.join(SRC, f'folha_{race}_{acao}.png') for acao in ACOES}
    folhas = {k: v for k, v in folhas.items() if os.path.exists(v)}
    if not folhas: return None
    quadros = {}                                        # (acao, dir) -> [imagens]
    alturas = []
    for acao, path in folhas.items():
        nome, grade = ACOES[acao]
        linhas = recortar(path)
        if [len(l) for l in linhas] != [len(l) for l in grade]:
            print(f'  {os.path.basename(path)}: esperava {[len(l) for l in grade]} bonecos por linha, achei {[len(l) for l in linhas]}')
            continue
        # escala da folha: a altura mediana dos bonecos de frente vira ALTURA * 0.97
        h = np.median([q.height for q in linhas[0]])
        k = ALTURA * 0.97 / h
        for linha, dirs in zip(linhas, grade):
            for q, d in zip(linha, dirs):
                q = q.resize((max(1, round(q.width * k)), max(1, round(q.height * k))), Image.LANCZOS)
                quadros.setdefault((nome, d), []).append(q)
                alturas.append(q.height)
            if dirs[0] in ('down_left', 'up_left'):    # diagonal: cada quadro virado para a direita (pele bem do lado direito) vira
                fila = quadros[(nome, dirs[0])]
                # de costas aparece a orelha/bochecha do lado para onde ele olha (pele a direita = virado para a direita);
                # de 3/4 de frente e o contrario: o lado do rosto que mais aparece e o de tras (pele a esquerda = virado para a direita)
                if dirs[0] == 'up_left': errado = lambda q: lado_da_pele(q) * (q.height / ALTURA) > 25
                else: errado = lambda q: lado_da_pele(q) * (q.height / ALTURA) < -8
                quadros[(nome, dirs[0])] = [q.transpose(Image.FLIP_LEFT_RIGHT) if errado(q) else q for q in fila]
            if dirs[0] == 'left':                       # a linha toda de perfil vira para o mesmo lado (voto dos quadros)
                fila = quadros[(nome, 'left')]
                if sum(olha_para_direita(q) for q in fila) > 0:
                    quadros[(nome, 'left')] = [q.transpose(Image.FLIP_LEFT_RIGHT) for q in fila]
    if not quadros: return None
    for d in ('down_left', 'up_left'):                  # sem folha parada diagonal: o passo mais fechado do andar
        if ('walk', d) in quadros and ('idle', d) not in quadros:
            quadros[('idle', d)] = [passo_fechado(quadros[('walk', d)])]
    H = max(ALTURA, max(alturas) + 2)
    # largura comum: metade maior de um lado e do outro do centro do corpo
    meia = max(max(centro_corpo(q), q.width - centro_corpo(q)) for qs in quadros.values() for q in qs)
    W = int(2 * meia + 4)
    ent = {'w': W, 'h': H, 'v': int(time.time()), 'ref': ref, 'chroma': bool(cfg['cabelo'].get('chroma')), 'acoes': {}}
    pc = dict(cfg); pc.pop('olhos', None)
    pc['cabelo'] = dict(cfg['cabelo'], y=[-0.5, 1.0]); pc['cabelo'].pop('couro', None)
    pc['pele'] = {k: v for k, v in cfg['pele'].items() if k not in ('caixa', 'igualar_y')}
    pc['pele']['y'] = [0, 1.0]
    for (nome, d), qs in quadros.items():
        for i, q in enumerate(qs):
            pares = [(d, q)] + ([(ESPELHO[d], q.transpose(Image.FLIP_LEFT_RIGHT))] if d in ESPELHO else [])
            for dd, img in pares:
                tela = Image.new('RGBA', (W, H), (0, 0, 0, 0))
                tela.paste(img, (round(W / 2 - centro_corpo(img)), H - img.height - 1), img)
                pasta = os.path.join(OUT, race, nome); os.makedirs(pasta, exist_ok=True)
                tela.save(os.path.join(pasta, f'{dd}_{i}.png'))
                mask, _, _ = mascara_cores(tela, pc)
                mask.save(os.path.join(pasta, f'{dd}_{i}_mascara.png'))
                ent['acoes'].setdefault(nome, {}).setdefault(dd, []).append(f'{race}/{nome}/{dd}_{i}')
    for nome in ent['acoes']:
        for dd in ent['acoes'][nome]: ent['acoes'][nome][dd].sort()
    return ent


def main():
    cores = json.load(open(os.path.join(HERE, 'cores_racas.json'), encoding='utf-8'))
    arte = json.load(open(os.path.join(ROOT, 'assets', 'arte', 'manifest.json'), encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    mpath = os.path.join(OUT, 'manifest.json')
    manifest = json.load(open(mpath, encoding='utf-8')) if os.path.exists(mpath) else {}
    for race, cfg in cores.items():
        if race.startswith('_'): continue
        ref = (arte.get('portraits', {}).get(race) or {}).get('ref', {})
        ent = importar(race, cfg, ref)
        if ent:
            manifest[race] = ent
            print(f'{race}: tela {ent["w"]}x{ent["h"]}, ' + ', '.join(f'{a} {sum(len(v) for v in d.values())}' for a, d in ent['acoes'].items()))
    json.dump(manifest, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
