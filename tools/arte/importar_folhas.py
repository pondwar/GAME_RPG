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
         'andar_diagonal': ('walk', [['down_left'] * 4, ['up_left'] * 4]),
         # acoes: 1 linha de perfil para a esquerda (sentar: frente, costas e perfil). O PRIMEIRO boneco de cada folha
         # de acao e um boneco de pe que serve de regua (agachado, sentado ou pulando a altura engana) e e descartado
         'pular': ('jump', [['left'] * 4]), 'sentar': ('sit', [['down', 'up', 'left']]),
         'abaixar': ('gather', [['left'] * 4]), 'espada': ('attack_1h', [['left'] * 5]),
         'soco': ('punch', [['left'] * 5]), 'machado': ('attack_2h', [['left'] * 5]), 'chute': ('kick', [['left'] * 4])}
REGUA = {'pular', 'sentar', 'abaixar', 'espada', 'soco', 'machado', 'chute'}
TELA = 1.3                         # a tela tem 30% a mais que a altura de pe (braco erguido, pulo); o jogo sabe (corpo)
NOVOS_LADOS = {}                   # lado das folhas de perfil decidido pelo voto nesta importacao (gravado no fim)
PADRAO = {}                        # (acao, dir) -> altura mediana do humano (preenchido ao importar o humano)
ESPELHO = {'left': 'right', 'down_left': 'down_right', 'up_left': 'up_right'}


def salvar(img, path):
    """o Windows as vezes recusa gravar (arquivo aberto pelo servidor/antivirus): tenta de novo"""
    for t in range(8):
        try: return img.save(path)
        except OSError:
            if t == 7: raise
            time.sleep(0.3)


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
        cols = _faixas(op[y0:y1].sum(0) > 2, 30)
        # bonecos encostados (punho de um no outro) viram uma faixa larga: corta na coluna mais vazia entre eles
        larg = np.median([b - a for a, b in cols]) if cols else 0
        partes = []
        for x0, x1 in cols:
            n = int(round((x1 - x0) / larg)) if larg and (x1 - x0) >= 1.7 * larg else 1
            if n >= 2:
                perfil = op[y0:y1, x0:x1].sum(0)
                cortes = []
                for i in range(1, n):
                    c = int((x1 - x0) * i / n); r = int((x1 - x0) / n * 0.35)
                    k = c - r + int(np.argmin(perfil[c - r:c + r]))
                    # so corta onde quase nao ha boneco (um chute largo nao e dois bonecos: o corte passaria na perna)
                    if perfil[k] <= 0.1 * (y1 - y0): cortes.append(k)
                bordas = [0] + cortes + [x1 - x0]
                partes += [(x0 + a, x0 + b) for a, b in zip(bordas, bordas[1:])]
            else:
                partes.append((x0, x1))
        for x0, x1 in partes:
            sub = op[y0:y1, x0:x1]; ys, xs = np.where(sub)
            if len(ys) == 0: continue
            linha.append(im.crop((x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1)))
        if linha:                                       # pedaco solto (respingo, mecha separada): menos de 45% da altura
            hm = np.median([q.height for q in linha])
            linha = [q for q in linha if q.height >= 0.45 * hm]
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


def cabeca(q):
    """largura do cabelo/barba verde: medida do tamanho da cabeca"""
    a = np.array(q).astype(int); op = a[..., 3] > 128
    g = op & (a[..., 1] > a[..., 0] + 40) & (a[..., 1] > a[..., 2] + 40)
    xs = np.where(g.any(0))[0]
    return (xs.max() - xs.min()) if g.sum() > 200 else None


def passo_fechado(qs):
    """quadro de andar com os pes mais juntos (serve de boneco parado quando a folha parada nao existe)"""
    def abertura(q):
        op = np.array(q)[..., 3] > 128; pes = op[int(op.shape[0] * 0.85):]
        xs = np.where(pes.any(0))[0]
        return (xs.max() - xs.min()) / q.height if len(xs) else 9
    return min(qs, key=abertura)


def importar(race, cfg, ref):
    # anotacao feita olhando a folha: linhas que o Gemini desenhou viradas para o lado contrario
    lpath = os.path.join(HERE, 'folhas_lados.json')
    lados = (json.load(open(lpath, encoding='utf-8')) if os.path.exists(lpath) else {}).get(race, {})
    folhas = {acao: os.path.join(SRC, f'folha_{race}_{acao}.png') for acao in ACOES}
    folhas = {k: v for k, v in folhas.items() if os.path.exists(v)}
    if not folhas: return None
    quadros = {}                                        # (acao, dir) -> [imagens]
    alturas = []
    for acao, path in folhas.items():
        nome, grade = ACOES[acao]
        linhas = recortar(path)
        regua = None
        if acao in REGUA and len(linhas) == 1 and len(set(grade[0])) == 1 and len(linhas[0]) >= 3:
            # acao de perfil: o Gemini as vezes desenha um quadro a mais ou a menos; vale quantos vierem (a animacao
            # usa o tamanho da lista). O primeiro e a regua.
            regua = linhas[0][0]; linhas[0] = linhas[0][1:]; grade = [[grade[0][0]] * len(linhas[0])]
        elif acao in REGUA and linhas and len(linhas[0]) == len(grade[0]) + 1:
            regua = linhas[0][0]; linhas[0] = linhas[0][1:]
        if [len(l) for l in linhas] != [len(l) for l in grade]:
            print(f'  {os.path.basename(path)}: esperava {[len(l) for l in grade]} bonecos por linha, achei {[len(l) for l in linhas]}')
            continue
        # escala da folha: a altura mediana dos bonecos de frente vira ALTURA * 0.97
        # escala por LINHA: o Gemini desenha cada linha num tamanho um pouco diferente (o perfil e as costas saiam
        # 3-4% menores que a frente); a altura mediana de cada linha vira ALTURA * 0.97
        for linha, dirs in zip(linhas, grade):
            k = ALTURA * 0.97 / (regua.height if regua is not None else np.median([q.height for q in linha]))
            for q, d in zip(linha, dirs):
                q = q.resize((max(1, round(q.width * k)), max(1, round(q.height * k))), Image.LANCZOS)
                quadros.setdefault((nome, d), []).append(q)
                alturas.append(q.height)
            if dirs[0] in ('down_left', 'up_left'):    # diagonal: cada quadro virado para a direita (pele bem do lado direito) vira
                fila = quadros[(nome, dirs[0])]
                # de costas: a orelha/bochecha aparece do lado para onde ele olha; cada quadro com pele bem a direita vira.
                # de 3/4 de frente nao da para saber pela pele (a barba muda o meio): vale a anotacao de folhas_lados.json
                if dirs[0] == 'up_left': errado = lambda q: lado_da_pele(q) > 15
                else: errado = lambda q: False
                if lados.get(acao, {}).get(dirs[0]) == 'espelhar': errado = lambda q: True
                if lados.get(acao, {}).get(dirs[0]) == 'ignorar':   # linha desenhada errada: o jogo usa as 4 direcoes
                    del quadros[(nome, dirs[0])]; continue
                quadros[(nome, dirs[0])] = [q.transpose(Image.FLIP_LEFT_RIGHT) if errado(q) else q for q in fila]
            if dirs[0] == 'left':
                # linha toda de perfil: para que lado a FOLHA ORIGINAL foi desenhada. Anotado em folhas_lados.json
                # ('fonte_direita' vira, 'fonte_esquerda' fica). Sem anotacao, vota pelos quadros (nariz x cabelo) e
                # GRAVA o resultado: o voto mudava de uma importacao para outra (o gnomo de sobrancelha verde andava de
                # costas) e uma anotacao 'espelhar' relativa ao voto deixava de valer
                fila = quadros[(nome, 'left')]
                fonte = lados.get(acao, {}).get('left')
                if fonte not in ('fonte_direita', 'fonte_esquerda'):
                    fonte = 'fonte_direita' if sum(olha_para_direita(q) for q in fila) > 0 else 'fonte_esquerda'
                    NOVOS_LADOS.setdefault(race, {}).setdefault(acao, {})['left'] = fonte
                if fonte == 'fonte_direita':
                    quadros[(nome, 'left')] = [q.transpose(Image.FLIP_LEFT_RIGHT) for q in fila]
            # anotacao de folhas_lados.json valendo para as outras linhas (ex.: o perfil sentado veio virado para a direita)
            for d in set(dirs) - {'down_left', 'up_left'} - ({'left'} if dirs[0] == 'left' else set()):
                if lados.get(acao, {}).get(d) in ('espelhar', 'fonte_direita') and (nome, d) in quadros:
                    quadros[(nome, d)] = [q.transpose(Image.FLIP_LEFT_RIGHT) for q in quadros[(nome, d)]]
    if not quadros: return None
    if lados.get('parado_do_andar'):                     # folha parada desenhada com outro corpo (elfo magrinho): usa o andar
        for d in ('down', 'up'):                     # de lado o passo sempre tem as pernas abertas: fica o perfil parado
            if ('walk', d) in quadros: quadros[('idle', d)] = [passo_fechado(quadros[('walk', d)])]
    for d in ('down_left', 'up_left'):                  # sem folha parada diagonal: o passo mais fechado do andar
        if ('walk', d) in quadros and ('idle', d) not in quadros:
            quadros[('idle', d)] = [passo_fechado(quadros[('walk', d)])]
    # mesma cabeca em todas as acoes: o Gemini as vezes desenha a folha de acao com cabeca menor (o pulo do humano
    # saia ~17% menor, um anao no ar). Referencia: a menor cabeca de perfil entre o parado e o andar (o rabo de
    # cavalo do anao parado aumenta a medida). So AUMENTA: cabeca maior na acao e cabelo solto, nao tamanho
    refs = [float(np.median(cs)) for n in ('idle', 'walk') for cs in [[c for c in map(cabeca, quadros.get((n, 'left'), [])) if c]] if cs]
    if refs:
        ref_c = min(refs)
        for nome in {n for (n, d) in quadros} - {'idle', 'walk'}:
            cs = [c for c in map(cabeca, quadros.get((nome, 'left'), [])) if c]
            if not cs: continue
            k = ref_c / float(max(cs))                  # o maior: quadro encolhido/de lado mostra menos cabelo
            if not 1.05 <= k < 1.4: continue
            print(f'  {nome}: cabeca {k:.2f}x')
            for (n, d), qs in list(quadros.items()):
                if n == nome:
                    quadros[(n, d)] = [q.resize((round(q.width * k), round(q.height * k)), Image.LANCZOS) for q in qs]
    # padrao humano: cada acao de cada raca fica do mesmo tamanho, relativo ao boneco de pe, que a mesma acao do humano.
    # O Gemini desenha cada folha num tamanho (o anao sentado saia da altura dele em pe, o chute do gnomo 20% maior) e a
    # regua da folha nem sempre e confiavel. Medida: a AREA do boneco (raiz), que quase nao muda com a pose; a altura
    # enganava (um agachado mais fundo virava gigante). Comparada com o andar da mesma direcao da propria raca, o corpo
    # mais largo (anao) nao conta. O tamanho da RACA (anao menor, draconato maior) nao entra aqui: e o 'scale' de
    # js/ruleset.js (LOOKS), aplicado pelo jogo
    def area(q): return float((np.array(q)[..., 3] > 128).sum())
    def base(d):
        qs = quadros.get(('walk', d)) or quadros.get(('idle', d))   # o andar: 4 quadros, mais firme
        return float(np.median([area(q) for q in qs])) if qs else None
    # QUADRO A QUADRO: dentro da mesma folha o Gemini desenha cada boneco num tamanho (no pulo do anao um quadro saia
    # com metade do tamanho). Cada quadro vai para a area alvo = area do andar x proporcao da acao no humano (mediana)
    alvo = {}
    for k, qs in quadros.items():
        b = base(k[1])
        if b and k[0] not in ('idle', 'walk'): alvo[k] = (b, [area(q) / b for q in qs])
    if race == 'humano': PADRAO.update({k: float(np.median(rs)) for k, (b, rs) in alvo.items()})
    # ajuste fino no olho (tools/arte/folhas_escala.json), por folha: multiplica por cima
    epath = os.path.join(HERE, 'folhas_escala.json')
    esc = json.load(open(epath, encoding='utf-8')) if os.path.exists(epath) else {}
    acao_de = {nome: acao for acao, (nome, g) in ACOES.items() if 'diagonal' not in acao}
    def extra(nome):
        a = acao_de.get(nome)
        return esc.get('_todas', {}).get(a, 1.0) * esc.get(race, {}).get(a, 1.0)
    for k, (b, rs) in alvo.items():
        if k not in PADRAO: continue
        fs = [min(max((PADRAO[k] / r) ** 0.5, 0.7), 1.5) * extra(k[0]) for r in rs]
        if max(abs(f - 1) for f in fs) < 0.03: continue
        print(f'  {k[0]} {k[1]}: ' + ' '.join(f'{f:.2f}' for f in fs))
        quadros[k] = [q.resize((max(1, round(q.width * f)), max(1, round(q.height * f))), Image.LANCZOS) for q, f in zip(quadros[k], fs)]
    alturas = [q.height for qs in quadros.values() for q in qs]
    H = max(int(ALTURA * TELA), max(alturas) + 2)
    # largura comum: metade maior de um lado e do outro do centro do corpo
    meia = max(max(centro_corpo(q), q.width - centro_corpo(q)) for qs in quadros.values() for q in qs)
    W = int(2 * meia + 4)
    ent = {'w': W, 'h': H, 'corpo': ALTURA, 'v': int(time.time()), 'ref': ref, 'chroma': bool(cfg['cabelo'].get('chroma')), 'acoes': {}}
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
                salvar(tela, os.path.join(pasta, f'{dd}_{i}.png'))
                mask, _, _ = mascara_cores(tela, pc)
                salvar(mask, os.path.join(pasta, f'{dd}_{i}_mascara.png'))
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
    # o humano primeiro: as outras racas seguem o tamanho das acoes dele (PADRAO)
    for race, cfg in sorted(cores.items(), key=lambda rc: rc[0] != 'humano'):
        if race.startswith('_'): continue
        ref = (arte.get('portraits', {}).get(race) or {}).get('ref', {})
        ent = importar(race, cfg, ref)
        if ent:
            manifest[race] = ent
            print(f'{race}: tela {ent["w"]}x{ent["h"]}, ' + ', '.join(f'{a} {sum(len(v) for v in d.values())}' for a, d in ent['acoes'].items()))
    json.dump(manifest, open(mpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    # congela o lado das folhas de perfil que ainda nao tinham anotacao
    if NOVOS_LADOS:
        lpath = os.path.join(HERE, 'folhas_lados.json')
        lados = json.load(open(lpath, encoding='utf-8')) if os.path.exists(lpath) else {}
        for race, acoes in NOVOS_LADOS.items():
            for acao, dd in acoes.items(): lados.setdefault(race, {}).setdefault(acao, {}).update(dd)
        json.dump(lados, open(lpath, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('lado das folhas de perfil gravado em folhas_lados.json:', sum(len(a) for a in NOVOS_LADOS.values()))
    # onde a mao segura a arma em cada quadro (tools/arte/medir_maos.py): os quadros mudaram, mede de novo
    import medir_maos
    medir_maos.main()


if __name__ == '__main__':
    main()
