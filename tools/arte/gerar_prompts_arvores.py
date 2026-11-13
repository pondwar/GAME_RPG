# -*- coding: utf-8 -*-
# Gera docs/arte/PROMPTS_ARVORES.md (um prompt do Gemini por arvore). Tamanhos = js/trees_draw.js (SPECIES).
import os
T = {  # kind: (nome, w, h, descricao, neve)
 'pine': ('Pinheiro', 130, 230, 'pinheiro europeu: tronco reto marrom-avermelhado, copa alta em camadas de agulhas verde-escuras, pinhas marrons penduradas. SEM pinhas aparecendo', True),
 'spruce': ('Abeto', 120, 240, 'abeto: tronco fino, copa em forma de cone bem fechada com galhos que caem, verde muito escuro com tons azulados', True),
 'palm': ('Palmeira (coqueiro)', 150, 220, 'coqueiro: tronco fino e curvo cinza-amarronzado com aneis, folhas grandes em leque verdes no topo. SEM cocos', False),
 'acacia': ('Acácia', 200, 170, 'acacia-guarda-chuva da savana africana: tronco fino e torto marrom, copa larga e plana como guarda-chuva, verde-oliva', False),
 'baobab': ('Baobá', 190, 200, 'baoba: tronco gigantesco, grosso e liso cinza-arroxeado como uma garrafa, poucos galhos grossos e curtos no topo com folhas verdes esparsas. SEM frutos', False),
 'cactus': ('Cacto', 80, 130, 'cacto saguaro: corpo verde-azulado com gomos verticais, dois bracos curvados para cima, espinhos pequenos claros. SEM frutos', False),
 'cherry': ('Cerejeira', 190, 200, 'cerejeira em flor: tronco marrom-escuro retorcido, copa larga e fofa cheia de flores rosa-claras, algumas petalas. SEM frutos', False),
 'bamboo': ('Bambuzal', 130, 250, 'touceira de bambu: varios colmos verdes retos e altos com nos amarelados, folhas finas e verdes nas pontas', False),
 'eucalyptus': ('Eucalipto', 160, 240, 'eucalipto: tronco alto e claro cinza-esbranquicado com casca descascando, copa rala de folhas longas verde-azuladas', False),
 'araucaria': ('Araucária', 170, 240, 'araucaria: tronco reto e alto marrom-escuro, copa em forma de taca/candelabro no topo com galhos em espiral e folhas verde-escuras pontudas. SEM pinhoes', False),
 'jungle': ('Árvore Tropical', 210, 230, 'arvore tropical de floresta densa: tronco largo com raizes tabulares na base, copa muito larga e densa verde-brilhante, cipos pendurados. SEM frutos', False),
 'birch': ('Bétula', 150, 220, 'betula: tronco branco com manchas pretas horizontais, copa leve e solta de folhas verde-claras amareladas', True),
 'olive': ('Oliveira', 160, 150, 'oliveira: tronco grosso, retorcido e nodoso cinza-prateado, copa baixa e redonda de folhas estreitas verde-acinzentadas. SEM azeitonas', False),
}
BASE = """Crie UMA imagem de uma arvore para um RPG isometrico, em pixel art, estilo limpo e simples, no mesmo estilo da arvore (carvalho) anexada.

ARVORE: {desc}.

VISAO: isometrica 3/4 vista de cima, como o carvalho anexado, inteira (da base do tronco ate o topo), centrada na imagem, tronco apoiado no centro da parte de baixo.

TAMANHO: a imagem tem {iw} x {ih} pixels e a arvore ocupa quase toda ela (cerca de {aw} de largura e {ah} de altura), sem cortar nada nas bordas.
{neve}
ESTILO: contorno escuro fino (marrom bem escuro, nao preto), 3 tons por cor, luz de cima e da esquerda, cores naturais. SEM sombra no chao, SEM frutos, SEM texto, SEM moldura. A arvore tem de parecer de dia (cores vivas); o jogo escurece sozinho a noite.

FUNDO: magenta solido #FF00FF em toda a imagem, sem degrade, sem chao.
"""
NEVE = "\nLAYOUT: uma imagem larga com DUAS arvores lado a lado, iguais em tudo: a da ESQUERDA normal; a da DIREITA a MESMA arvore coberta de neve (neve branca nos galhos e na copa, tronco igual).\n"
out = ['# Prompts prontos: arvores (uma por especie)', '',
 'Gerado por `tools/arte/gerar_prompts_arvores.py`. O **carvalho** ja tem arte (`assets/nature/arvore_game.png`), as outras 13 sao desenhadas por codigo ate a arte chegar.', '',
 '**Regra importante:** a arvore vem **sem frutos**. O jogo desenha os frutos por cima, na cor de cada especie.', '',
 '**Como usar:** anexe `assets/nature/arvore_game.png` como estilo, cole o prompt, pegue a imagem com **Copiar imagem**. Depois: `python tools/arte/importar_arvore.py <imagem.png> <especie>`.', '',
 '**Toco e tronco caido:** por enquanto todos os tocos sao iguais (o do carvalho). Toco por especie fica para depois.', '']
for k, (nome, w, h, desc, neve) in T.items():
    iw, ih = w * 2, h * 2
    if neve: iw *= 2
    out += [f'## {nome} (`{k}`)', f'Tamanho no jogo {w}x{h} px' + (' · pede também a versão com neve' if neve else ''), '', '```text',
            BASE.format(desc=desc, iw=iw, ih=ih, aw=w * 2 - 10, ah=h * 2 - 10, neve=NEVE if neve else '').strip(), '```', '']
open(os.path.join('docs', 'arte', 'PROMPTS_ARVORES.md'), 'w', encoding='utf-8').write('\n'.join(out))
print(len(T), 'prompts')
