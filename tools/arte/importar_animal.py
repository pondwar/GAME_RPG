# -*- coding: utf-8 -*-
# Importa a folha de um bicho para assets/animals/<especie>_frames/ e registra a especie em assets/animals/catalogo.json
# (o jogo so usa a arte se a especie estiver la).
# Folha NOVA (padrao): 4 colunas x 6 linhas = frente, costas, lado esquerdo, 3/4 frente esq., 3/4 costas esq., acao.
#   O jogo espelha o lado esquerdo para fazer as 3 direcoes da direita (8 direcoes no total).
# Folha ANTIGA: 4 colunas x 2 linhas (lado esquerdo + acao), use --2linhas.
# Folha B (acao nas 5 vistas, 4 colunas x 5 linhas): --acao-b. Entra como <acao>_<direcao>_<n>.png ao lado da folha A (importe a A primeiro);
#   a escala e ajustada para o bicho ter o mesmo tamanho da folha A.
# Uso: python tools/arte/importar_animal.py <folha.png> <especie> [--fundo ciano] [--2linhas] [--acao-b]
import sys, os, json
import numpy as np
from PIL import Image
from collections import deque
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from animais_dados import D
args = [a for a in sys.argv[1:] if not a.startswith('--')]
sheet, kind = args[0], args[1]
ciano = '--fundo' in sys.argv and 'ciano' in sys.argv
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
im = Image.open(sheet).convert('RGB'); a = np.asarray(im).astype(int)
bg = np.array([0, 255, 255] if ciano else [255, 0, 255])
# fundo = parecido com a cor-chave (distancia no RGB) ou dominante dela
d = np.sqrt(((a - bg) ** 2).sum(-1))
if ciano: dom = np.minimum(a[..., 1], a[..., 2]) - a[..., 0]
else: dom = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
isbg = (d < 90) | (dom > 110)
fg = ~isbg
def maior_mancha(m, folga=3):
    # componentes conexos (com folga de alguns px, para nao separar patas finas); fica o maior
    h, w = m.shape; pts = np.argwhere(m)
    if len(pts) == 0: return m
    big = np.zeros_like(m)
    for dy in range(-folga, folga + 1):
        for dx in range(-folga, folga + 1):
            ys = np.clip(np.arange(h) + dy, 0, h - 1); xs = np.clip(np.arange(w) + dx, 0, w - 1)
            big |= m[np.ix_(ys, xs)]
    lab = np.zeros(m.shape, int); n = 0; sizes = [0]
    for y, x in pts:
        if big[y, x] and not lab[y, x]:
            n += 1; q = deque([(y, x)]); lab[y, x] = n; cnt = 0
            while q:
                cy, cx = q.popleft(); cnt += 1
                for ny, nx in ((cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)):
                    if 0 <= ny < h and 0 <= nx < w and big[ny, nx] and not lab[ny, nx]: lab[ny, nx] = n; q.append((ny, nx))
            sizes.append(cnt)
    return m & (lab == int(np.argmax(sizes)))
H, W = fg.shape
ACAO_B = '--acao-b' in sys.argv
NL = 5 if ACAO_B else (2 if '--2linhas' in sys.argv else 6)
ch, cw = H // NL, W // 4
NOMES = ['left', 'extra'] if NL == 2 else (['down', 'up', 'left', 'down_left', 'up_left'] if NL == 5 else ['down', 'up', 'left', 'down_left', 'up_left', 'extra'])
cells = []                                                       # (linha, coluna, mascara, rgb)
for r in range(NL):
    for c in range(4):
        m = maior_mancha(fg[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw])
        rgb = a[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw].copy()
        sp = (np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1]) if not ciano else (np.minimum(rgb[..., 1], rgb[..., 2]) - rgb[..., 0])
        al = m & (sp < 70)                                       # tira o resto do fundo na borda (franja rosa/ciano)
        out = np.dstack([rgb, al * 255]).astype('uint8'); out[~al] = 0
        img = Image.fromarray(out, 'RGBA'); bb = img.getbbox()
        cells.append((r, c, img.crop(bb) if bb else img))
if ACAO_B:
    extra = D[kind][0] if kind in D else 'eat'
    outd = os.path.join(root, 'assets', 'animals', kind + '_frames')
    ref = [np.asarray(Image.open(os.path.join(outd, f'left_{i}.png'))) for i in range(4)]
    refw = float(np.median([np.ptp((r[..., 3] > 0).any(0).nonzero()[0]) + 1 for r in ref])); TW, TH = Image.open(os.path.join(outd, 'left_0.png')).size
    lw = float(np.median([q.width for r, c, q in cells if r == 2]))          # linha 3 = lado
    k = refw / lw
    # escala POR VISTA: a area do bicho na acao fica na mesma proporcao da area dele andando em todas as vistas
    # (o Gemini desenha cada linha num tamanho; sem isso o bicho muda de tamanho ao comecar a comer)
    areaA = {n: float(np.median([(np.asarray(Image.open(os.path.join(outd, f'{n}_{i}.png')))[..., 3] > 0).sum() for i in range(4)])) for n in NOMES}
    areaB = {NOMES[r]: float(np.median([(np.asarray(q)[..., 3] > 0).sum() for rr, c, q in cells if rr == r])) for r in range(5)}
    t = (k * k) * areaB['left'] / areaA['left']
    ks = {n: ((t * areaA[n] / areaB[n]) ** 0.5) for n in NOMES}
    print('escala por vista:', {n: round(v, 2) for n, v in ks.items()})
    for r, c, q in cells:
        kk = ks[NOMES[r]]; kk = min(kk, TW / q.width, TH / q.height)
        q = q.resize((max(1, round(q.width * kk)), max(1, round(q.height * kk))), Image.NEAREST)
        tela = Image.new('RGBA', (TW, TH), (0, 0, 0, 0)); tela.alpha_composite(q, ((TW - q.width) // 2, TH - q.height))
        tela.save(os.path.join(outd, f'{extra}_{NOMES[r]}_{c}.png'))
    cp = os.path.join(root, 'assets', 'animals', 'catalogo.json'); cat = json.load(open(cp, encoding='utf-8'))
    cat[kind]['extradirs'] = 5; cat[kind]['v'] = cat[kind].get('v', 0) + 1
    json.dump(cat, open(cp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    print(kind, 'folha B importada: acao', extra, 'em 5 vistas, escala', round(k, 2)); sys.exit(0)
# tela comum a todos os quadros (pes embaixo, centrado): o bicho nao "pula" nem muda de escala entre vistas
TW = max(q.width for _, _, q in cells); TH = max(q.height for _, _, q in cells)
extra = D[kind][0] if kind in D else 'eat'
outd = os.path.join(root, 'assets', 'animals', kind + '_frames'); os.makedirs(outd, exist_ok=True)
for f in os.listdir(outd): os.remove(os.path.join(outd, f))
for r, c, q in cells:
    tela = Image.new('RGBA', (TW, TH), (0, 0, 0, 0)); tela.alpha_composite(q, ((TW - q.width) // 2, TH - q.height))
    nome = NOMES[r].replace('extra', extra)
    tela.save(os.path.join(outd, f'{nome}_{c}.png'))
cp = os.path.join(root, 'assets', 'animals', 'catalogo.json')
cat = json.load(open(cp, encoding='utf-8')) if os.path.exists(cp) else {}
cat[kind] = {'extra': extra, 'dirs': 5 if NL == 6 else 1, 'v': cat.get(kind, {}).get('v', 0) + 1}
json.dump(cat, open(cp, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(kind, 'importado:', TW, 'x', TH, 'px por quadro,', NL, 'linhas, acao =', extra)
