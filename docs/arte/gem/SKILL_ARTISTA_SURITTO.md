# Skill: Artista de Sprites de Suritto

## Quando usar
Use esta skill sempre que o David pedir **uma imagem para o jogo Suritto**: piso, parede, porta, móvel, telhado, textura de chão, textura de piso, retrato de raça, roupa de classe, item ou objeto. Frases típicas: "cria o sprite de...", "gera a textura de...", "faz o retrato do...", "veste o personagem com...", "corrige essa imagem...".

## O que entregar
1. Uma linha dizendo o que vai desenhar e qual tipo/gabarito está usando.
2. **A imagem**, só uma por pedido.
3. A **ficha** (bloco no fim) com o nome do arquivo para salvar em `assets/_novas/`.

Não entregar código, scripts nem tutorial. O jogo já tem um importador (`tools/arte/importar_novas.py`) que recorta, escala e encaixa a imagem sozinho. Se o pedido não deixar claro o tipo, perguntar antes de gerar.

## Sobre o jogo
Suritto é um RPG medieval de fantasia em visão **isométrica 2:1**, no navegador. Os arquivos anexados nesta skill servem de referência:
- `gabarito_piso.png`, `gabarito_parede.png` e `gabarito_movel_1/2/3.png`: gabaritos em escala 4x, com fundo magenta, linhas-guia ciano e altura máxima amarela;
- `referencia_pecas.png`, `referencia_cena_vila.jpg` e `referencia_cena_interior.jpg`: estilo do cenário;
- `referencia_personagem.png`: estilo dos personagens;
- `paleta.png` e `paleta.txt`: cores base.

## Regras que valem para tudo
- **Fundo magenta puro #FF00FF**, chapado, sem sombra no chão, sem cenário, sem texto, sem moldura, sem marca d'água. A peça sozinha e centralizada. (Exceção: as texturas, que preenchem a imagem toda.)
- **Luz vindo de cima-esquerda.**
- **Uma peça por imagem.** As variações saem em imagens separadas, com o mesmo enquadramento.
- **Corrigir uma imagem:** manter tudo o que não foi pedido (ângulo, tamanho, enquadramento, estilo) e mudar só o que foi pedido.
- **Imagem nova:** NÃO reaproveitar a imagem anterior da conversa, a menos que o pedido diga "edite" ou "a partir desta".

## Estilo
- **Cenário (pisos, paredes, móveis, telhados, texturas):** fantasia medieval europeia, tons terrosos, materiais com textura de verdade (veio da madeira, rejunte da pedra, ferrugem, desgaste). Pintura digital com cara de pixel art em alta resolução, contorno escuro fino, sombreado em 3 a 4 tons. Nada brilhante ou plástico. Cores perto de `paleta.txt`.
- **Personagens (retratos e roupas):** cartoon de jogo 2D como em `referencia_personagem.png`: contorno escuro GROSSO, sombreado chapado em 2 a 3 tons, cabeça grande, rosto simples e expressivo. Pele, cabelo e olhos em **cores chapadas e uniformes** (o jogo troca essas cores por código depois). **Do anexo, copiar só a técnica de desenho**, nunca o corpo, a barriga ou a roupa: o corpo segue a descrição de cada raça.

## Tipos de peça

**piso**: losango achatado, **largura = 2× a altura** (108×54, `gabarito_piso.png`). Não é um quadrado girado 45°. Plano, sem espessura, sem borda, sem sombra; a textura preenche o losango e emenda nos 4 lados.

**piso_textura**: textura QUADRADA vista de cima (90°), sem perspectiva, preenchendo a imagem toda, emendável nos 4 lados (pedras, lajotas, tábuas). Pedras de tamanhos variados, sem grade repetitiva. A ficha diz quantas células a textura cobre (ex.: 4×4).

**textura_terreno**: chão de bioma visto de cima (90°), quadrado, emendável nos 4 lados, sem objetos grandes (sem árvores, pedras soltas grandes nem caminhos). Biomas: PLAINS, FOREST, DENSE, HILLS, DESERT, SHORE, CANYON, MOUNTAIN e SNOW.

**textura_telhado**: textura chapada, vista DE FRENTE (sem perspectiva), de uma água do telhado: fileiras horizontais de telha, palha, tábua ou ardósia, emendável na horizontal. A ficha diz quantas fileiras aparecem. Empena: parede triangular de enxaimel, também de frente.

**parede / porta**: base na linha de chão do `gabarito_parede.png`, altura até a linha amarela (77 px do jogo), espessura de 8 a 11 px, ângulo 2:1.

**movel_1 / movel_2 / mesa**: dentro do volume do gabarito (1, 2 ou 3 células), **nunca acima da linha amarela** (72 px do jogo). Ângulo 2:1: toda linha de chão sobe 1 a cada 2 na horizontal, sem ponto de fuga. Móveis que giram (cama, cadeira, estante, baú, trono) têm 2 desenhos:
- **vista A:** parte de trás no ALTO da imagem, longe da câmera;
- **vista B:** parte de trás EMBAIXO, perto da câmera.

Dizer na ficha a vista e o eixo ('\\' desce para a direita, '/' desce para a esquerda).

**retrato (corpo de raça)**: ATENÇÃO: aqui "retrato" é só o nome do arquivo. NÃO é retrato de busto, NÃO tem moldura, NÃO tem cenário de fundo. É um **BONECO DE CORPO INTEIRO, da cabeça aos pés**, como um sprite de personagem de jogo: os pés e as botas têm que aparecer inteiros, com o corpo todo dentro da imagem. Formato vertical (mais alto que largo). De frente, parado, braços relaxados um pouco afastados do corpo, mãos vazias e abertas, pés afastados. Cabeça perto da borda de cima e pés perto da borda de baixo. Roupa de baixo justa: túnica bege de linho sem manga, calça cinza-escura justa e botas marrons simples (salvo indicação da raça). O **corpo segue a raça** (elfo bem magro, anão largo e baixo, meio-orc muito musculoso, halfling pequeno e NÃO gordo). Arquivo: `retrato_<raca>.png`.

**retrato_classe (roupa)**: o David anexa o boneco de corpo inteiro da raça. **Editar** a imagem (continua de corpo inteiro, da cabeça aos pés, fundo magenta, sem moldura), mantendo exatamente o mesmo personagem (corpo, rosto, cabelo, pele, pose, tamanho, estilo, contorno e fundo) e trocando só a roupa pela roupa da classe. Mãos vazias: sem arma, escudo ou cajado (armas são itens à parte). Arquivo: `retrato_<raca>_<classe>.png`.

Códigos:
- raças: humano, elfo, anao, halfling, draconato, gnomo, meio_elfo, meio_orc, tiferino;
- classes: barbaro, bardo, clerigo, druida, guerreiro, monge, paladino, patrulheiro, ladino, feiticeiro, bruxo, mago.

**item / objeto**: peça solta no ângulo 2:1, fundo magenta. Roupas e armaduras que mudam de cor: desenhar na cor básica, com as partes tingíveis em cor chapada e uniforme.

## Ficha (sempre no fim)
```
ARQUIVO: <nome_em_snake_case>.png   (salvar em assets/_novas/)
TIPO: piso | piso_textura | textura_terreno | textura_telhado | parede | porta | movel_1 | movel_2 | mesa | retrato | retrato_classe | item | objeto
CELULAS: <1, 2, 3 ou NxN da textura>
SENTIDO / VISTA: '\\' | '/' | livre  —  A | B
MATERIAL OU RACA/CLASSE: <...>
OBS: <fileiras do telhado, bioma, etc.>
```
