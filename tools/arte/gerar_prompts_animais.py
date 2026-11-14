# -*- coding: utf-8 -*-
# Gera docs/arte/PROMPTS_ANIMAIS.md: um prompt pronto do Gemini por bicho. Uso: python tools/arte/gerar_prompts_animais.py <sizes.txt>
# sizes.txt: linhas "kind|Nome|w|h" (tamanho no jogo, tirado de fauna.js/domestic.js)
# Folha A: 4 colunas x 6 linhas (andar nas 5 vistas da esquerda + acao de perfil). Folha B: 4 x 5 (a ACAO nas 5 vistas). As 3 direcoes da direita o jogo espelha.
# REGRA DE OURO: tudo que se move usa as 8 direcoes (docs/REGRA_8_DIRECOES.md)
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from animais_dados import D
SIZE = {}
for l in open(sys.argv[1], encoding='utf-8'):
    p = l.strip().split('|')
    if len(p) == 4: SIZE[p[0]] = (p[1], int(p[2]), int(p[3]))
SIZE.update({'chicken': ('Galinha', 24, 24), 'sheep': ('Ovelha', 46, 36), 'cow': ('Vaca', 76, 54), 'pig': ('Porco', 50, 34), 'horse': ('Cavalo', 82, 72), 'goat': ('Cabra', 42, 40), 'dog': ('Cão', 44, 34), 'cat': ('Gato', 28, 22)})
CIANO = {'pig', 'hippo', 'walrus'}   # bichos rosados: fundo ciano para nao comer o desenho
EXTRA = {
 'eat': 'PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.',
 'attack': 'ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).',
 'fly': 'VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.',
}
SNAKE_EX = 'ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).'
SNAKES = {'anaconda', 'python', 'rattlesnake', 'cobra', 'king_cobra'}
RAZOES = [('21:9', 21 / 9), ('16:9', 16 / 9), ('3:2', 1.5), ('4:3', 4 / 3), ('5:4', 1.25), ('1:1', 1.0), ('4:5', 0.8), ('3:4', 0.75), ('2:3', 2 / 3), ('9:16', 9 / 16)]
def formato(w, h):
    # a celula deve ter a proporcao do bicho de lado (com folga); imagem = celula * 4 colunas / 6 linhas
    ca = max(0.45, min(3.4, (w / h) * 1.2))
    alvo = ca * 4 / 6
    nome, v = min(RAZOES, key=lambda r: abs(math.log(r[1] / alvo)))
    return nome, v
BASE_B = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'animais_base_acao.txt'), encoding='utf-8').read()
BASE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'animais_base.txt'), encoding='utf-8').read()
out = ['# Prompts prontos: sprites de animais (um por especie), 8 direcoes', '',
 '> **REGRA DE OURO (obrigatória): tudo que se move, e toda ação, existe nas 8 direções** (baixo, cima, esquerda, direita e as 4 diagonais). Desenha-se 5 vistas da esquerda (frente, costas, lado, 3/4 frente, 3/4 costas) e o jogo espelha as 3 da direita. Veja [REGRA_8_DIRECOES.md](../REGRA_8_DIRECOES.md).', '',
 'Gerado por `tools/arte/gerar_prompts_animais.py` a partir de `tools/arte/animais_dados.py` e dos tamanhos reais do jogo. **Nao edite a mao**: mude o dado e gere de novo.', '',
 '**Como usar:** anexe no Gemini a imagem de estilo `assets/animals/cervo_frames/left_0.png` (ampliada), escolha no Gemini a **proporção** que o bloco indica e cole o prompt. Pegue a folha com **Copiar imagem**. Depois me mande, ou rode `python tools/arte/importar_animal.py <folha.png> <especie>` (porco, hipopotamo e morsa: `--fundo ciano`).', '',
 '- Uma folha **4 colunas x 6 linhas** (24 quadros): frente, costas, lado esquerdo, 3/4 frente esquerda, 3/4 costas esquerda e a acao. As 3 direcoes da direita (direita, 3/4 frente direita, 3/4 costas direita) o jogo faz **espelhando** as da esquerda, igual ao humano. Assim o bicho anda nas 8 direcoes.',
 '- **Cada espécie tem DUAS folhas:** **A (andar)**, 4x6, e **B (ação: comer / atacar / voar)**, 4x5, a ação nas mesmas 5 vistas. Mande a A primeiro e anexe a A pronta na B para manter o mesmo animal.',
 '- Se o Gemini errar uma linha, peca so aquela linha de novo e eu troco.',
 '- Todos de **terra**: bicho que vive na agua (jacare, hipopotamo, sucuri, pato, castor, ornitorrinco, crocodilo) vem em terra por enquanto.',
 '- Fundo **magenta `#FF00FF`**; so porco, hipopotamo e morsa usam fundo **ciano `#00FFFF`** (sao rosados).', '']
for k, (acao, desc) in D.items():
    nome, w, h = SIZE[k]
    fundo = ('ciano sólido #00FFFF', 'ciano') if k in CIANO else ('magenta sólido #FF00FF', 'magenta')
    walk = 'Cobra: rastejando em onda suave, corpo ondulando.' if k in SNAKES else ('Ave: andando/saltitando no chão, asas fechadas.' if acao == 'fly' else '')
    ex = SNAKE_EX if k in SNAKES else EXTRA[acao]
    rz, rv = formato(w, h)
    # celula: lado maior ~ 3x o tamanho do jogo (min 128), a outra pela proporcao da imagem
    iw = 1376 if rv >= 1 else int(round(1376 * rv))
    ih = int(round(iw / rv)); cw, chh = iw // 4, ih // 6
    kk = 0.84 * min(cw / w, chh / h)
    p = BASE.format(desc=desc, ratio=rz, cw=cw, ch=chh, iw=iw, ih=ih, aw=round(w * kk), ah=round(h * kk), walk=walk, extra=ex, fundo=fundo[0])
    ih2 = int(round(iw / (rv * 6 / 5))) if False else None
    out += [f'## {nome} (`{k}`)', f'Tamanho no jogo {w}x{h} px · proporção da imagem **{rz}** · fundo {fundo[1]} · linha 6: {acao}', '', '**Folha A (andar)**', '', '```text', p.strip(), '```', '']
    # folha B: 4 colunas x 5 linhas
    alvoB = max(0.45, min(3.4, (w / h) * 1.2)) * 4 / 5
    rzB, rvB = min(RAZOES, key=lambda r: abs(math.log(r[1] / alvoB)))
    iwB = 1376 if rvB >= 1 else int(round(1376 * rvB)); ihB = int(round(iwB / rvB)); cwB, chB = iwB // 4, ihB // 5
    kB = 0.84 * min(cwB / w, chB / h)
    pB = BASE_B.format(desc=desc, ratio=rzB, cw=cwB, ch=chB, iw=iwB, ih=ihB, aw=round(w * kB), ah=round(h * kB), extra=ex, fundo=fundo[0])
    out += [f'**Folha B (ação: {acao}, proporção {rzB})**', '', '```text', pB.strip(), '```', '']
open(os.path.join('docs', 'arte', 'PROMPTS_ANIMAIS.md'), 'w', encoding='utf-8').write('\n'.join(out))
print(len(D), 'prompts')
