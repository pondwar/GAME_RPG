# -*- coding: utf-8 -*-
# Importa as folhas de 3 linhas (lado/frente/costas) das acoes do humano para o manifest e remede as maos.
# O importador antigo apaga o andar e o parado diagonal do humano: aqui eles voltam do git HEAD, e as 8 direcoes do andar sao conferidas.
# Uso: python tools/arte/importar_humano_acoes.py
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE); os.chdir(ROOT)
import importar_folhas as I
GRADE = lambda n: [['left'] * n, ['down'] * n, ['up'] * n]
I.ACOES['espada'] = ('attack_1h', GRADE(8))
I.ACOES['machado'] = ('attack_2h', GRADE(8))
I.ACOES['estocada1'] = ('thrust_1h', GRADE(8))
I.ACOES['estocada2'] = ('thrust_2h', GRADE(8))
I.ACOES['soco'] = ('punch', GRADE(8))
I.ACOES['pular'] = ('jump', GRADE(8))
I.ACOES['sentar'] = ('sit', GRADE(8))
I.ACOES['abaixar'] = ('gather', GRADE(8))
# projeteis (sem arma na mao; a arma e desenhada pelo jogo)
PROJ = {'arco': 'shoot_bow', 'besta2': 'shoot_xbow2', 'besta_mao': 'shoot_xbow1', 'arremesso': 'throw', 'funda': 'sling'}
for k, v in PROJ.items(): I.ACOES[k] = (v, GRADE(8))
# diagonais 3/4 (frente e costas, viradas para a esquerda; a direita sai espelhada): folha_humano_<acao>_diagonal.png, 2 linhas
GRADE_D = lambda n: [['down_left'] * n, ['up_left'] * n]
for k, (nome, g) in list(I.ACOES.items()):
    if (k in ('espada', 'machado', 'estocada1', 'estocada2', 'soco', 'pular', 'sentar', 'abaixar') or k in PROJ) and os.path.exists(os.path.join(ROOT, 'assets', '_novas', f'folha_humano_{k}_diagonal.png')):
        I.ACOES[k + '_diagonal'] = (nome, GRADE_D(8))
I.REGUA.difference_update({'espada', 'machado', 'soco', 'pular', 'sentar', 'abaixar'} | set(PROJ))
antigas = {'machado': 'attack_2h', 'soco': 'punch', 'pular': 'jump', 'sentar': 'sit', 'abaixar': 'gather', 'espada': 'attack_1h'}
# folha que ainda nao foi refeita em 3 linhas volta ao formato antigo (1 linha de perfil, 1o boneco = regua)
ANTIGO = {'machado': [['left'] * 7], 'soco': [['left'] * 6], 'pular': [['left'] * 4], 'sentar': [['down', 'up', 'left']], 'abaixar': [['left'] * 4], 'espada': [['left'] * 8]}
from PIL import Image
for k, grade in ANTIGO.items():
    path = os.path.join(ROOT, 'assets', '_novas', f'folha_humano_{k}.png')
    if os.path.exists(path) and Image.open(path).height < 1000:       # 1 linha so = formato antigo
        I.ACOES[k] = (antigas[k], grade)
        if k in ('machado', 'soco', 'pular', 'abaixar'): I.REGUA.add(k)
I.main()
m = json.load(open('assets/player/racas/manifest.json', encoding='utf-8'))
h = json.loads(subprocess.check_output(['git', 'show', 'HEAD:assets/player/racas/manifest.json']))
for k in ('idle', 'walk'): m['humano']['acoes'][k] = h['humano']['acoes'][k]
json.dump(m, open('assets/player/racas/manifest.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('andar:', {d: len(x) for d, x in m['humano']['acoes']['walk'].items()})
subprocess.run([sys.executable, os.path.join(HERE, 'medir_maos.py')])
