# Prompts prontos: sprites de animais (um por especie), 8 direcoes

> **REGRA DE OURO (obrigatória): tudo que se move, e toda ação, existe nas 8 direções** (baixo, cima, esquerda, direita e as 4 diagonais). Desenha-se 5 vistas da esquerda (frente, costas, lado, 3/4 frente, 3/4 costas) e o jogo espelha as 3 da direita. Veja [REGRA_8_DIRECOES.md](../REGRA_8_DIRECOES.md).

Gerado por `tools/arte/gerar_prompts_animais.py` a partir de `tools/arte/animais_dados.py` e dos tamanhos reais do jogo. **Nao edite a mao**: mude o dado e gere de novo.

**Como usar:** anexe no Gemini a imagem de estilo `assets/animals/cervo_frames/left_0.png` (ampliada), escolha no Gemini a **proporção** que o bloco indica e cole o prompt. Pegue a folha com **Copiar imagem**. Depois me mande, ou rode `python tools/arte/importar_animal.py <folha.png> <especie>` (porco, hipopotamo e morsa: `--fundo ciano`).

- Uma folha **4 colunas x 6 linhas** (24 quadros): frente, costas, lado esquerdo, 3/4 frente esquerda, 3/4 costas esquerda e a acao. As 3 direcoes da direita (direita, 3/4 frente direita, 3/4 costas direita) o jogo faz **espelhando** as da esquerda, igual ao humano. Assim o bicho anda nas 8 direcoes.
- **Cada espécie tem DUAS folhas:** **A (andar)**, 4x6, e **B (ação: comer / atacar / voar)**, 4x5, a ação nas mesmas 5 vistas. Mande a A primeiro e anexe a A pronta na B para manter o mesmo animal.
- Se o Gemini errar uma linha, peca so aquela linha de novo e eu troco.
- Todos de **terra**: bicho que vive na agua (jacare, hipopotamo, sucuri, pato, castor, ornitorrinco, crocodilo) vem em terra por enquanto.
- Fundo **magenta `#FF00FF`**; so porco, hipopotamo e morsa usam fundo **ciano `#00FFFF`** (sao rosados).

## Galinha (`chicken`)
Tamanho no jogo 24x24 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: galinha: corpo marrom-avermelhado com penas brancas nas asas, crista vermelha pequena, barbela vermelha, bico amarelo, patas amarelas, cauda curta levantada. Bica o chao.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: galinha: corpo marrom-avermelhado com penas brancas nas asas, crista vermelha pequena, barbela vermelha, bico amarelo, patas amarelas, cauda curta levantada. Bica o chao.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Ovelha (`sheep`)
Tamanho no jogo 46x36 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: ovelha: la branca-suja fofa e cacheada cobrindo o corpo, cara e patas finas cinza-escuras, orelhas pequenas caidas para os lados.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: ovelha: la branca-suja fofa e cacheada cobrindo o corpo, cara e patas finas cinza-escuras, orelhas pequenas caidas para os lados.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 236 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Vaca (`cow`)
Tamanho no jogo 76x54 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: vaca malhada de preto e branco, chifres curtos, focinho rosado, ubere rosado, cauda com tufo preto.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 216 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: vaca malhada de preto e branco, chifres curtos, focinho rosado, ubere rosado, cauda com tufo preto.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 244 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Porco (`pig`)
Tamanho no jogo 50x34 px · proporção da imagem **5:4** · fundo ciano · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: porco rosado, orelhas grandes caidas, focinho achatado, rabo enrolado, corpo redondo e gordo, patas curtas.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 226 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: porco rosado, orelhas grandes caidas, focinho achatado, rabo enrolado, corpo redondo e gordo, patas curtas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 254 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cavalo (`horse`)
Tamanho no jogo 82x72 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cavalo alazao (marrom-avermelhado), crina e cauda marrom-escuras, patas finas e longas, uma pequena mancha branca na testa.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 219 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cavalo alazao (marrom-avermelhado), crina e cauda marrom-escuras, patas finas e longas, uma pequena mancha branca na testa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 263 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cabra (`goat`)
Tamanho no jogo 42x40 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cabra branca com manchas marrons, barbicha, chifres curvos para tras, orelhas curtas, corpo esguio.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 202 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cabra branca com manchas marrons, barbicha, chifres curvos para tras, orelhas curtas, corpo esguio.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 243 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cão (`dog`)
Tamanho no jogo 44x34 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cao de guarda de pelagem curta, corpo marrom com costas e orelhas pretas, orelhas caidas, cauda curva, porte medio.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 249 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cao de guarda de pelagem curta, corpo marrom com costas e orelhas pretas, orelhas caidas, cauda curva, porte medio.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 239 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Gato (`cat`)
Tamanho no jogo 28x22 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: gato cinza listrado (tigrado) com barriga branca, cauda longa erguida, orelhas pontudas, olhos verdes.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: gato cinza listrado (tigrado) com barriga branca, cauda longa erguida, orelhas pontudas, olhos verdes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 235 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Coelho (`rabbit`)
Tamanho no jogo 26x22 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: coelho silvestre: pelagem marrom-acinzentada, barriga e rabo brancos e redondos, orelhas medias, olho grande e escuro.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 227 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: coelho silvestre: pelagem marrom-acinzentada, barriga e rabo brancos e redondos, orelhas medias, olho grande e escuro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Javali (`boar`)
Tamanho no jogo 58x42 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: javali: pelo marrom-escuro eriçado com cerdas pretas no lombo, presas brancas curvas saindo da boca, focinho comprido, corpo robusto, patas curtas.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 266 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: javali: pelo marrom-escuro eriçado com cerdas pretas no lombo, presas brancas curvas saindo da boca, focinho comprido, corpo robusto, patas curtas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 239 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Raposa (`fox`)
Tamanho no jogo 42x32 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: raposa-vermelha: pelagem laranja-avermelhada, peito e ponta da cauda brancos, patas pretas, orelhas pontudas pretas por tras, cauda grossa e fofa.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 252 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: raposa-vermelha: pelagem laranja-avermelhada, peito e ponta da cauda brancos, patas pretas, orelhas pontudas pretas por tras, cauda grossa e fofa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 243 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Urso (`bear`)
Tamanho no jogo 84x74 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: urso-pardo: pelagem marrom espessa, corcunda nos ombros, cabeca larga, orelhas redondas, garras longas e claras.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: urso-pardo: pelagem marrom espessa, corcunda nos ombros, cabeca larga, orelhas redondas, garras longas e claras.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 262 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Lebre (`hare`)
Tamanho no jogo 34x28 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: lebre europeia: pelagem marrom-acinzentada, barriga clara, orelhas altas com pontas pretas, patas traseiras longas, cauda preta no topo.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: lebre europeia: pelagem marrom-acinzentada, barriga clara, orelhas altas com pontas pretas, patas traseiras longas, cauda preta no topo.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 224 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Texugo (`badger`)
Tamanho no jogo 44x26 px · proporção da imagem **4:3** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: texugo: corpo baixo e largo cinza-prateado, cabeca branca com duas faixas pretas, garras longas, cauda curta.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 172 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 144 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: texugo: corpo baixo e largo cinza-prateado, cabeca branca com duas faixas pretas, garras longas, cauda curta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 260 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Esquilo (`squirrel`)
Tamanho no jogo 22x24 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: esquilo-vermelho: ruivo, barriga branca, cauda enorme e fofa, tufos nas pontas das orelhas, segura uma noz.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 176 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: esquilo-vermelho: ruivo, barriga branca, cauda enorme e fofa, tufos nas pontas das orelhas, segura uma noz.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 212 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Faisão (`pheasant`)
Tamanho no jogo 34x30 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: faisao macho: cabeca verde-azulada com mancha vermelha no rosto, anel branco no pescoco, corpo cobre com manchas pretas, cauda longa e listrada.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: faisao macho: cabeca verde-azulada com mancha vermelha no rosto, anel branco no pescoco, corpo cobre com manchas pretas, cauda longa e listrada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 262 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Lince (`lynx`)
Tamanho no jogo 56x40 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: lince: pelagem marrom-amarelada com manchas escuras, tufos pretos nas orelhas, bochechas peludas, cauda curta com ponta preta.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 215 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: lince: pelagem marrom-amarelada com manchas escuras, tufos pretos nas orelhas, bochechas peludas, cauda curta com ponta preta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 242 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Corvo (`crow`)
Tamanho no jogo 24x18 px · proporção da imagem **1:1** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: corvo: preto lustroso com reflexos azulados, bico forte e preto, olho escuro.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 256 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: corvo: preto lustroso com reflexos azulados, bico forte e preto, olho escuro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Coruja (`owl`)
Tamanho no jogo 30x34 px · proporção da imagem **2:3** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: coruja-das-torres: cara em forma de coracao branca, costas douradas e cinza com pintinhas, olhos escuros, peito claro.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 170 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: coruja-das-torres: cara em forma de coracao branca, costas douradas e cinza com pintinhas, olhos escuros, peito claro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 204 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Pato-real (`duck`)
Tamanho no jogo 32x26 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: pato-real macho: cabeca verde brilhante, anel branco no pescoco, corpo cinza, peito marrom, bico amarelo, patas laranja.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 237 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: pato-real macho: cabeca verde brilhante, anel branco no pescoco, corpo cinza, peito marrom, bico amarelo, patas laranja.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 227 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Castor (`beaver`)
Tamanho no jogo 38x26 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: castor: marrom-escuro, cauda larga, chata e escamosa, dentes grandes laranja, corpo gordo e baixo.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 225 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: castor: marrom-escuro, cauda larga, chata e escamosa, dentes grandes laranja, corpo gordo e baixo.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 253 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Capivara (`capybara`)
Tamanho no jogo 54x36 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: capivara: marrom-avermelhada, cabeca grande e quadrada, focinho largo, sem cauda, orelhas pequenas, corpo em formato de barril.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: capivara: marrom-avermelhada, cabeca grande e quadrada, focinho largo, sem cauda, orelhas pequenas, corpo em formato de barril.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Anta (`tapir`)
Tamanho no jogo 74x52 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: anta: cinza-escura, corpo em formato de barril, proboscía curta e flexivel, orelhas redondas com borda clara, patas curtas.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 219 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: anta: cinza-escura, corpo em formato de barril, proboscía curta e flexivel, orelhas redondas com borda clara, patas curtas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Queixada (`peccary`)
Tamanho no jogo 46x34 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: queixada: cinza-escuro quase preto, queixo e pescoco brancos, cerdas eriçadas no lombo, focinho de porco, corpo pequeno.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 260 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: queixada: cinza-escuro quase preto, queixo e pescoco brancos, cerdas eriçadas no lombo, focinho de porco, corpo pequeno.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Tamanduá-bandeira (`anteater`)
Tamanho no jogo 78x42 px · proporção da imagem **3:2** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: tamandua-bandeira: cinza com faixa preta e branca que sobe no ombro, focinho muito longo e fino, cauda enorme e peluda, garras grandes.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 152 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 237 x 128 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 16:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: tamandua-bandeira: cinza com faixa preta e branca que sobe no ombro, focinho muito longo e fino, cauda enorme e peluda, garras grandes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 16:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 154 pixels (a imagem toda tem cerca de 1376 x 774 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 240 x 129 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Preguiça (`sloth`)
Tamanho no jogo 30x32 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: preguica: pelo felpudo marrom-acinzentado, rosto claro com mascara escura em volta dos olhos, garras longas e curvas, no chao anda devagar.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 180 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: preguica: pelo felpudo marrom-acinzentado, rosto claro com mascara escura em volta dos olhos, garras longas e curvas, no chao anda devagar.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 217 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Macaco-prego (`capuchin`)
Tamanho no jogo 28x32 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: macaco-prego: corpo marrom-claro, topete e cauda escuros, cara clara, cauda longa e enrolada.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 168 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: macaco-prego: corpo marrom-claro, topete e cauda escuros, cara clara, cauda longa e enrolada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 202 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Ema (`rhea`)
Tamanho no jogo 54x66 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: ema: penas cinza-amarronzadas desgrenhadas, pescoco longo e fino, tres dedos, pernas altas, sem voar.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 157 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: ema: penas cinza-amarronzadas desgrenhadas, pescoco longo e fino, tres dedos, pernas altas, sem voar.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 189 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Lobo-guará (`maned_wolf`)
Tamanho no jogo 56x62 px · proporção da imagem **3:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: lobo-guara: pelagem alaranjada, pernas muito longas e pretas, orelhas grandes, crina preta no pescoco, focinho fino.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 174 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: lobo-guara: pelagem alaranjada, pernas muito longas e pretas, orelhas grandes, crina preta no pescoco, focinho fino.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 209 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Tatu (`armadillo`)
Tamanho no jogo 34x24 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: tatu: carapaca de placas cinza-acastanhadas em faixas, focinho comprido, orelhas pequenas, cauda curta.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: tatu: carapaca de placas cinza-acastanhadas em faixas, focinho comprido, orelhas pequenas, cauda curta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cervo-do-pantanal (`marsh_deer`)
Tamanho no jogo 62x70 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cervo-do-pantanal: marrom-avermelhado, patas pretas ate o joelho, galhada ramificada, focinho com mancha clara.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 170 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cervo-do-pantanal: marrom-avermelhado, patas pretas ate o joelho, galhada ramificada, focinho com mancha clara.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 205 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Onça-pintada (`jaguar`)
Tamanho no jogo 80x54 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: onca-pintada: amarelo-dourado com rosetas pretas com pontinhos dentro, barriga branca, cabeca grande, corpo musculoso e baixo.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 228 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: onca-pintada: amarelo-dourado com rosetas pretas com pontinhos dentro, barriga branca, cabeca grande, corpo musculoso e baixo.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 228 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Tucano (`toucan`)
Tamanho no jogo 30x30 px · proporção da imagem **4:5** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: tucano: corpo preto, peito amarelo, bico enorme laranja com ponta preta, rosto azul ao redor do olho, cauda curta.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: tucano: corpo preto, peito amarelo, bico enorme laranja com ponta preta, rosto azul ao redor do olho, cauda curta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Arara (`macaw`)
Tamanho no jogo 34x34 px · proporção da imagem **4:5** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: arara-vermelha: penas vermelhas, asas com azul e amarelo, rosto branco sem penas, cauda longa, bico grande claro.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: arara-vermelha: penas vermelhas, asas com azul e amarelo, rosto branco sem penas, cauda longa, bico grande claro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Harpia (`harpy`)
Tamanho no jogo 44x52 px · proporção da imagem **2:3** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: harpia: cinza-escura nas costas, peito branco, crista de penas na cabeca, garras enormes amarelas, bico forte.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 163 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: harpia: cinza-escura nas costas, peito branco, crista de penas na cabeca, garras enormes amarelas, bico forte.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 195 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Sucuri (`anaconda`)
Tamanho no jogo 96x18 px · proporção da imagem **21:9** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: sucuri: cobra enorme verde-escura com grandes manchas pretas redondas, corpo grosso.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 98 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 54 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Cobra: rastejando em onda suave, corpo ondulando.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 21:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: sucuri: cobra enorme verde-escura com grandes manchas pretas redondas, corpo grosso.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 118 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 54 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Jacaré (`caiman`)
Tamanho no jogo 72x22 px · proporção da imagem **21:9** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: jacare: verde-oliva escuro, pele rugosa, focinho largo, dentes pontudos, cauda longa.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 98 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 269 x 82 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 21:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: jacare: verde-oliva escuro, pele rugosa, focinho largo, dentes pontudos, cauda longa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 118 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 88 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Abutre (`vulture`)
Tamanho no jogo 40x40 px · proporção da imagem **4:5** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: urubu-de-cabeca-preta: penas pretas, cabeca nua cinza enrugada, bico claro curvo.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: urubu-de-cabeca-preta: penas pretas, cabeca nua cinza enrugada, bico claro curvo.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Alce (`moose`)
Tamanho no jogo 92x92 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: alce: marrom-escuro, galhada larga e espalmada, focinho caido, papada pendurada, patas longas.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: alce: marrom-escuro, galhada larga e espalmada, focinho caido, papada pendurada, patas longas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Rena (`reindeer`)
Tamanho no jogo 64x70 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: rena: marrom-acinzentada, pescoco e barriga brancos, galhada ramificada comprida, focinho claro.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 176 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: rena: marrom-acinzentada, pescoco e barriga brancos, galhada ramificada comprida, focinho claro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 211 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Lebre-da-neve (`snow_hare`)
Tamanho no jogo 34x28 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: lebre-da-neve: pelo branco, pontas das orelhas pretas, patas grandes e peludas.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: lebre-da-neve: pelo branco, pontas das orelhas pretas, patas grandes e peludas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 224 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Boi-almiscarado (`musk_ox`)
Tamanho no jogo 84x62 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: boi-almiscarado: pelo longo e marrom-escuro que quase toca o chao, chifres largos curvos para baixo e para cima, corcunda.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 261 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: boi-almiscarado: pelo longo e marrom-escuro que quase toca o chao, chifres largos curvos para baixo e para cima, corcunda.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Urso-polar (`polar_bear`)
Tamanho no jogo 100x78 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: urso-polar: pelagem branco-amarelada, focinho preto, corpo longo, pescoco comprido, patas enormes.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 247 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: urso-polar: pelagem branco-amarelada, focinho preto, corpo longo, pescoco comprido, patas enormes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 237 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Raposa-do-ártico (`arctic_fox`)
Tamanho no jogo 40x30 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: raposa-do-artico: pelagem branca espessa, focinho preto pequeno, orelhas curtas e redondas, cauda muito fofa.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 256 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: raposa-do-artico: pelagem branca espessa, focinho preto pequeno, orelhas curtas e redondas, cauda muito fofa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Glutão (`wolverine`)
Tamanho no jogo 48x32 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: glutao: corpo baixo e peludo marrom-escuro com faixas claras nos lados, cauda peluda, garras fortes.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: glutao: corpo baixo e peludo marrom-escuro com faixas claras nos lados, cauda peluda, garras fortes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Coruja-das-neves (`snowy_owl`)
Tamanho no jogo 32x36 px · proporção da imagem **3:4** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: coruja-das-neves: penas brancas com pintas escuras, olhos amarelos, bico pequeno.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 171 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: coruja-das-neves: penas brancas com pintas escuras, olhos amarelos, bico pequeno.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 205 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Pinguim (`penguin`)
Tamanho no jogo 26x34 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: pinguim: costas pretas, barriga branca, bico alaranjado, mancha amarela no pescoco, anda ereto.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 147 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: pinguim: costas pretas, barriga branca, bico alaranjado, mancha amarela no pescoco, anda ereto.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 275 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 177 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Morsa (`walrus`)
Tamanho no jogo 96x50 px · proporção da imagem **3:2** · fundo ciano · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: morsa: corpo enorme marrom-rosado enrugado, presas brancas compridas, bigodes grossos, nadadeiras.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 152 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 128 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 16:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: morsa: corpo enorme marrom-rosado enrugado, presas brancas compridas, bigodes grossos, nadadeiras.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 16:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 154 pixels (a imagem toda tem cerca de 1376 x 774 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 248 x 129 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Foca (`seal`)
Tamanho no jogo 56x26 px · proporção da imagem **16:9** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: foca: corpo liso cinza-prateado com manchas escuras, cabeca redonda, bigodes, nadadeiras, desliza na barriga.

FORMATO DA IMAGEM: proporção 16:9. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 129 pixels (a imagem toda tem cerca de 1376 x 774 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 233 x 108 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 21:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: foca: corpo liso cinza-prateado com manchas escuras, cabeca redonda, bigodes, nadadeiras, desliza na barriga.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 118 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 213 x 99 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Zebra (`zebra`)
Tamanho no jogo 64x62 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: zebra: listras pretas e brancas, crina curta em pe, cauda com tufo preto, focinho escuro.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 199 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: zebra: listras pretas e brancas, crina curta em pe, cauda com tufo preto, focinho escuro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 238 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Gnu (`wildebeest`)
Tamanho no jogo 64x62 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: gnu: cinza-escuro, barba preta, crina preta, chifres curvos para cima, ombros altos e quadris baixos.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 199 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: gnu: cinza-escuro, barba preta, crina preta, chifres curvos para cima, ombros altos e quadris baixos.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 238 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Gazela (`gazelle`)
Tamanho no jogo 40x48 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: gazela: marrom-claro com faixa escura nos flancos, barriga branca, chifres finos anelados, patas finas.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 160 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: gazela: marrom-claro com faixa escura nos flancos, barriga branca, chifres finos anelados, patas finas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Girafa (`giraffe`)
Tamanho no jogo 70x132 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: girafa: manchas marrom-alaranjadas em fundo creme, pescoco muito longo, pequenos chifres com tufos, patas longas.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 102 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 9:16)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: girafa: manchas marrom-alaranjadas em fundo creme, pescoco muito longo, pequenos chifres com tufos, patas longas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 275 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 122 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Elefante (`elephant`)
Tamanho no jogo 124x100 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: elefante-africano: cinza, orelhas enormes, presas brancas, tromba longa, pele enrugada.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 239 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: elefante-africano: cinza, orelhas enormes, presas brancas, tromba longa, pele enrugada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 229 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Rinoceronte (`rhino`)
Tamanho no jogo 90x62 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: rinoceronte-branco: cinza, dois chifres no focinho (o da frente grande), corpo largo, pele em dobras.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 223 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: rinoceronte-branco: cinza, dois chifres no focinho (o da frente grande), corpo largo, pele em dobras.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 251 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Avestruz (`ostrich`)
Tamanho no jogo 50x92 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: avestruz macho: corpo preto com asas e cauda brancas, pescoco e pernas longos de cor rosada, cabeca pequena.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 105 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 9:16)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: avestruz macho: corpo preto com asas e cauda brancas, pescoco e pernas longos de cor rosada, cabeca pequena.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 275 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 126 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Camelo (`camel`)
Tamanho no jogo 76x84 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: camelo de uma corcova: bege, corcova nas costas, pescoco curvo, patas longas, cilios longos.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 174 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: camelo de uma corcova: bege, corcova nas costas, pescoco curvo, patas longas, cilios longos.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 209 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Órix (`oryx`)
Tamanho no jogo 56x66 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: orix: corpo creme-esbranquicado, faixa preta no focinho e nos flancos, chifres longos e retos, patas escuras.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 163 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: orix: corpo creme-esbranquicado, faixa preta no focinho e nos flancos, chifres longos e retos, patas escuras.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 196 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Leão (`lion`)
Tamanho no jogo 84x56 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: leao macho: pelagem dourada, juba escura e grossa, cauda com tufo preto.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: leao macho: pelagem dourada, juba escura e grossa, cauda com tufo preto.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Hiena (`hyena`)
Tamanho no jogo 56x44 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: hiena-malhada: pelo amarelado com manchas escuras, costas inclinadas, cabeca grande, orelhas redondas, mandibula forte.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: hiena-malhada: pelo amarelado com manchas escuras, costas inclinadas, cabeca grande, orelhas redondas, mandibula forte.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 235 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Leopardo (`leopard`)
Tamanho no jogo 66x42 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: leopardo: amarelo-dourado com rosetas pretas, barriga clara, cauda longa, corpo esguio e musculoso.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 242 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: leopardo: amarelo-dourado com rosetas pretas, barriga clara, cauda longa, corpo esguio e musculoso.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 242 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Crocodilo-do-Nilo (`nile_croc`)
Tamanho no jogo 110x24 px · proporção da imagem **21:9** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: crocodilo-do-nilo: verde-escuro com escamas rugosas, focinho longo com dentes, cauda longa.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 98 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 63 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 21:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: crocodilo-do-nilo: verde-escuro com escamas rugosas, focinho longo com dentes, cauda longa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 118 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 63 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Hipopótamo (`hippo`)
Tamanho no jogo 100x60 px · proporção da imagem **4:3** · fundo ciano · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: hipopotamo: corpo enorme cinza-rosado, cabeca larga, boca grande, orelhas pequenas, pernas curtas.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 172 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 241 x 144 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: hipopotamo: corpo enorme cinza-rosado, cabeca larga, boca grande, orelhas pequenas, pernas curtas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 256 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: ciano sólido #00FFFF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Escorpião (`scorpion`)
Tamanho no jogo 24x18 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: escorpiao: marrom-dourado, duas pincas grandes, cauda curvada com ferrao.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 256 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: escorpiao: marrom-dourado, duas pincas grandes, cauda curvada com ferrao.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Naja (`cobra`)
Tamanho no jogo 26x34 px · proporção da imagem **9:16** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: naja: cobra marrom-clara com capuz aberto no pescoco, ergue o corpo para atacar.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 147 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Cobra: rastejando em onda suave, corpo ondulando.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: naja: cobra marrom-clara com capuz aberto no pescoco, ergue o corpo para atacar.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 275 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 177 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Raposa-do-deserto (`fennec`)
Tamanho no jogo 30x28 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: raposa-do-deserto (fenec): cor de areia, orelhas enormes, rosto pequeno, cauda com ponta preta.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 206 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: raposa-do-deserto (fenec): cor de areia, orelhas enormes, rosto pequeno, cauda com ponta preta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 248 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Tigre (`tiger`)
Tamanho no jogo 88x58 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: tigre: pelagem laranja com listras pretas, barriga e peito brancos, cabeca grande, cauda listrada.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 233 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: tigre: pelagem laranja com listras pretas, barriga e peito brancos, cabeca grande, cauda listrada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 233 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Panda-gigante (`giant_panda`)
Tamanho no jogo 84x62 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: panda-gigante: corpo branco, orelhas, olhos, patas e ombros pretos, rosto redondo, corpo roliço.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 261 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: panda-gigante: corpo branco, orelhas, olhos, patas e ombros pretos, rosto redondo, corpo roliço.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Iaque (`yak`)
Tamanho no jogo 88x66 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: iaque: pelo longo preto-amarronzado cobrindo os flancos, chifres curvos, corcunda, cauda peluda.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 256 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: iaque: pelo longo preto-amarronzado cobrindo os flancos, chifres curvos, corcunda, cauda peluda.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Tahr (`tahr`)
Tamanho no jogo 48x56 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: tahr: pelagem marrom-avermelhada espessa, juba no pescoco, chifres curtos curvos para tras, corpo de cabra montanhesa.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 165 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: tahr: pelagem marrom-avermelhada espessa, juba no pescoco, chifres curtos curvos para tras, corpo de cabra montanhesa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 198 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Leopardo-das-neves (`snow_leopard`)
Tamanho no jogo 70x44 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: leopardo-das-neves: pelagem cinza-clara com rosetas escuras, cauda muito longa e grossa, patas grandes.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: leopardo-das-neves: pelagem cinza-clara com rosetas escuras, cauda muito longa e grossa, patas grandes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Elefante-asiático (`asian_elephant`)
Tamanho no jogo 118x96 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: elefante-asiatico: cinza, orelhas menores que o africano, testa com dois montes, presas curtas, tromba longa.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 236 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: elefante-asiatico: cinza, orelhas menores que o africano, testa com dois montes, presas curtas, tromba longa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 227 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Búfalo-d'água (`water_buffalo`)
Tamanho no jogo 96x66 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: bufalo-d'agua: cinza-escuro quase preto, chifres grandes curvos para tras, corpo pesado, pelo ralo.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 224 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: bufalo-d'agua: cinza-escuro quase preto, chifres grandes curvos para tras, corpo pesado, pelo ralo.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 252 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Macaco-rhesus (`macaque`)
Tamanho no jogo 34x38 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: macaco-rhesus: pelagem marrom-acinzentada, rosto rosado sem pelos, cauda curta, bumbum avermelhado.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 172 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: macaco-rhesus: pelagem marrom-acinzentada, rosto rosado sem pelos, cauda curta, bumbum avermelhado.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 207 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Grou-de-coroa-vermelha (`crane`)
Tamanho no jogo 34x56 px · proporção da imagem **9:16** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: grou-de-coroa-vermelha: corpo branco, pescoco e cabeca com preto e branco, coroa vermelha, cauda preta, pernas pretas e longas.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 117 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 9:16)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: grou-de-coroa-vermelha: corpo branco, pescoco e cabeca com preto e branco, coroa vermelha, cauda preta, pernas pretas e longas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 275 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 140 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Pavão (`peafowl`)
Tamanho no jogo 36x40 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: pavao macho: corpo azul-esverdeado brilhante, cabeca com crista de penas, cauda longa e verde com olhos dourados.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 173 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: pavao macho: corpo azul-esverdeado brilhante, cabeca com crista de penas, cauda longa e verde com olhos dourados.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 208 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Píton-reticulada (`python`)
Tamanho no jogo 100x18 px · proporção da imagem **21:9** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: piton-reticulada: cobra comprida com padrao de losangos marrom, amarelo e preto.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 98 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 52 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Cobra: rastejando em onda suave, corpo ondulando.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 21:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: piton-reticulada: cobra comprida com padrao de losangos marrom, amarelo e preto.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 21:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 118 pixels (a imagem toda tem cerca de 1376 x 590 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 289 x 52 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Panda-vermelho (`red_panda`)
Tamanho no jogo 34x30 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: panda-vermelho: pelo ruivo, barriga escura, rosto branco com marcas, cauda listrada e fofa, corpo pequeno.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: panda-vermelho: pelo ruivo, barriga escura, rosto branco com marcas, cauda listrada e fofa, corpo pequeno.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 262 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Orangotango (`orangutan`)
Tamanho no jogo 52x60 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: orangotango: pelo longo ruivo, rosto escuro, bracos muito longos, corpo pesado.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 167 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: orangotango: pelo longo ruivo, rosto escuro, bracos muito longos, corpo pesado.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 200 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Rinoceronte-indiano (`indian_rhino`)
Tamanho no jogo 100x74 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: rinoceronte-indiano: cinza, um so chifre, pele em placas como armadura com rebites.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 260 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: rinoceronte-indiano: cinza, um so chifre, pele em placas como armadura com rebites.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Gaur (`gaur`)
Tamanho no jogo 98x80 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: gaur: boi selvagem enorme marrom-escuro quase preto, meias brancas nas patas, chifres curvos claros, cupula nos ombros.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 236 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: gaur: boi selvagem enorme marrom-escuro quase preto, meias brancas nas patas, chifres curvos claros, cupula nos ombros.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 226 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cobra-real (`king_cobra`)
Tamanho no jogo 34x42 px · proporção da imagem **2:3** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cobra-real: cobra verde-oliva com capuz aberto e bandas claras, ergue o corpo para atacar.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 156 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Cobra: rastejando em onda suave, corpo ondulando.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cobra-real: cobra verde-oliva com capuz aberto e bandas claras, ergue o corpo para atacar.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 187 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Bisão (`bison`)
Tamanho no jogo 100x74 px · proporção da imagem **1:1** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: bisao: pelagem marrom-escura longa e felpuda na frente (cabeca e ombros), traseira de pelo curto, corcova alta, chifres curtos.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 260 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: bisao: pelagem marrom-escura longa e felpuda na frente (cabeca e ombros), traseira de pelo curto, corcova alta, chifres curtos.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 234 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Wapiti (`wapiti`)
Tamanho no jogo 82x86 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: wapiti: corpo marrom-claro com pescoco escuro, garupa creme, galhada longa e ramificada.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 183 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: wapiti: corpo marrom-claro com pescoco escuro, garupa creme, galhada longa e ramificada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 220 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Antilocapra (`pronghorn`)
Tamanho no jogo 56x60 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: antilocapra: pelagem marrom-avermelhada, garupa e barriga brancas, duas faixas brancas no pescoco, chifres com ponta curva.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 180 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: antilocapra: pelagem marrom-avermelhada, garupa e barriga brancas, duas faixas brancas no pescoco, chifres com ponta curva.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 216 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Puma (`puma`)
Tamanho no jogo 72x46 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: puma: pelagem marrom-amarelada uniforme, barriga clara, cauda longa com ponta escura, focinho claro.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 241 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: puma: pelagem marrom-amarelada uniforme, barriga clara, cauda longa com ponta escura, focinho claro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 241 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Coiote (`coyote`)
Tamanho no jogo 52x42 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: coiote: pelagem cinza-amarronzada, orelhas grandes, focinho fino, cauda grossa com ponta preta.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 238 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: coiote: pelagem cinza-amarronzada, orelhas grandes, focinho fino, cauda grossa com ponta preta.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 229 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Águia-careca (`bald_eagle`)
Tamanho no jogo 40x40 px · proporção da imagem **4:5** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: aguia-de-cabeca-branca: corpo marrom-escuro, cabeca e cauda brancas, bico amarelo forte, garras amarelas.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: aguia-de-cabeca-branca: corpo marrom-escuro, cabeca e cauda brancas, bico amarelo forte, garras amarelas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Peru-selvagem (`turkey`)
Tamanho no jogo 34x36 px · proporção da imagem **3:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: peru-selvagem: penas marrons e bronze com reflexos, cabeca azulada e vermelha sem penas, barbela, cauda em leque.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 229 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 182 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: peru-selvagem: penas marrons e bronze com reflexos, cabeca azulada e vermelha sem penas, barbela, cauda em leque.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 218 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Cascavel (`rattlesnake`)
Tamanho no jogo 30x16 px · proporção da imagem **3:2** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: cascavel: cobra marrom-amarelada com losangos escuros e guizo no fim da cauda.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 152 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 239 x 128 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Cobra: rastejando em onda suave, corpo ondulando.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Cobra: rastejando em onda suave, corpo ondulando.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 16:9)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: cascavel: cobra marrom-amarelada com losangos escuros e guizo no fim da cauda.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 16:9. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 154 pixels (a imagem toda tem cerca de 1376 x 774 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 243 x 129 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (ergue a cabeça, recua em S, bote para frente com a boca aberta, recolhe).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Canguru (`kangaroo`)
Tamanho no jogo 66x80 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: canguru: pelagem marrom-avermelhada, barriga clara, patas traseiras fortes, cauda grossa, orelhas grandes.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 159 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: canguru: pelagem marrom-avermelhada, barriga clara, patas traseiras fortes, cauda grossa, orelhas grandes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 191 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Emu (`emu`)
Tamanho no jogo 52x72 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: emu: penas marrom-acinzentadas desgrenhadas, pescoco azulado, pernas longas, sem voar.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 139 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 2:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: emu: penas marrom-acinzentadas desgrenhadas, pescoco azulado, pernas longas, sem voar.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 275 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 167 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Vombate (`wombat`)
Tamanho no jogo 46x30 px · proporção da imagem **5:4** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: vombate: corpo baixo e gordo marrom-acinzentado, focinho largo, patas curtas, orelhas pequenas.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 236 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: vombate: corpo baixo e gordo marrom-acinzentado, focinho largo, patas curtas, orelhas pequenas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 236 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Dingo (`dingo`)
Tamanho no jogo 56x44 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: dingo: pelagem amarelo-areia, peito e patas brancos, orelhas em pe, cauda fofa.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 245 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 5:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: dingo: pelagem amarelo-areia, peito e patas brancos, orelhas em pe, cauda fofa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 220 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 235 x 185 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Kookaburra (`kookaburra`)
Tamanho no jogo 24x28 px · proporção da imagem **2:3** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: kookaburra: cabeca branca com faixa marrom no olho, costas marrom e azul, bico grande e forte, cauda listrada.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 165 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: kookaburra: cabeca branca com faixa marrom no olho, costas marrom e azul, bico grande e forte, cauda listrada.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 198 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Coala (`koala`)
Tamanho no jogo 28x32 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: coala: pelo cinza felpudo, orelhas redondas com pelos brancos, nariz grande e preto, barriga clara.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 168 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 4:5)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: coala: pelo cinza felpudo, orelhas redondas com pelos brancos, nariz grande e preto, barriga clara.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 275 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 202 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Diabo-da-tasmânia (`tasmanian_devil`)
Tamanho no jogo 40x28 px · proporção da imagem **5:4** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: diabo-da-tasmania: preto com faixa branca no peito, orelhas rosadas, boca grande, corpo atarracado.

FORMATO DA IMAGEM: proporção 5:4. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 1101 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 220 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 4:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: diabo-da-tasmania: preto com faixa branca no peito, orelhas rosadas, boca grande, corpo atarracado.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 206 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 247 x 173 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Casuar (`cassowary`)
Tamanho no jogo 50x70 px · proporção da imagem **9:16** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: casuar: penas pretas e grossas como pelos, pescoco azul e vermelho, capacete duro na cabeca, garras fortes.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 137 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 2:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: casuar: penas pretas e grossas como pelos, pescoco azul e vermelho, capacete duro na cabeca, garras fortes.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 275 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 165 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Ornitorrinco (`platypus`)
Tamanho no jogo 34x20 px · proporção da imagem **4:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: ornitorrinco: corpo marrom-escuro felpudo, bico achatado de pato, cauda larga e chata, patas palmadas.

FORMATO DA IMAGEM: proporção 4:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 172 pixels (a imagem toda tem cerca de 1376 x 1032 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 144 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:2)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: ornitorrinco: corpo marrom-escuro felpudo, bico achatado de pato, cauda larga e chata, patas palmadas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:2. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 183 pixels (a imagem toda tem cerca de 1376 x 917 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 261 x 154 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Guanaco (`guanaco`)
Tamanho no jogo 62x82 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: guanaco: pelagem marrom-clara, barriga branca, pescoco longo, rosto cinza, orelhas retas.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 145 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: guanaco: pelagem marrom-clara, barriga branca, pescoco longo, rosto cinza, orelhas retas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 275 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 175 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Vicunha (`vicuna`)
Tamanho no jogo 48x68 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: vicunha: pelagem amarelada-clara, peito com tufo branco, pescoco fino e longo, patas finas.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 136 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 2:3)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: vicunha: pelagem amarelada-clara, peito com tufo branco, pescoco fino e longo, patas finas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 275 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 163 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Viscacha (`viscacha`)
Tamanho no jogo 32x30 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: viscacha: roedor cinza-acastanhado com barriga clara, cauda longa e fofa, orelhas altas.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 205 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: viscacha: roedor cinza-acastanhado com barriga clara, cauda longa e fofa, orelhas altas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 246 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Condor-dos-Andes (`condor`)
Tamanho no jogo 48x44 px · proporção da imagem **4:5** · fundo magenta · linha 6: fly

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: condor-dos-andes: penas pretas com colar branco no pescoco, cabeca nua enrugada, grande mancha branca nas asas.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 210 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). Ave: andando/saltitando no chão, asas fechadas.
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. Ave: andando/saltitando no chão, asas fechadas.
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). Ave: andando/saltitando no chão, asas fechadas.
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: fly, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: condor-dos-andes: penas pretas com colar branco no pescoco, cabeca nua enrugada, grande mancha branca nas asas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 252 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: VOANDO: ciclo de bater de asas em 4 quadros (asas para cima, meio, para baixo, meio), pernas recolhidas.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Lhama (`llama`)
Tamanho no jogo 62x84 px · proporção da imagem **9:16** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: lhama: la marrom e branca em manchas, pescoco longo, orelhas curvas como bananas, rosto comprido.

FORMATO DA IMAGEM: proporção 9:16. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 193 x 229 pixels (a imagem toda tem cerca de 774 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 142 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: lhama: la marrom e branca em manchas, pescoco longo, orelhas curvas como bananas, rosto comprido.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 275 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 170 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Alpaca (`alpaca`)
Tamanho no jogo 54x70 px · proporção da imagem **2:3** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: alpaca: la branca-creme densa e fofa, pescoco curto, franja caindo sobre os olhos, orelhas pequenas pontudas.

FORMATO DA IMAGEM: proporção 2:3. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 229 x 229 pixels (a imagem toda tem cerca de 917 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 148 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 3:4)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: alpaca: la branca-creme densa e fofa, pescoco curto, franja caindo sobre os olhos, orelhas pequenas pontudas.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 3:4. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 258 x 275 pixels (a imagem toda tem cerca de 1032 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 178 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Urso-de-óculos (`spectacled_bear`)
Tamanho no jogo 66x58 px · proporção da imagem **1:1** · fundo magenta · linha 6: attack

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: urso-de-oculos: pelo preto com manchas brancas em volta dos olhos e peito, focinho claro.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 229 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 219 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: attack, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: urso-de-oculos: pelo preto com manchas brancas em volta dos olhos e peito, focinho claro.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 263 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: ATAQUE: 4 quadros (agacha e se prepara, salta ou avança, morde/golpeia com a boca ou as patas, recua).

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```

## Chinchila (`chinchilla`)
Tamanho no jogo 28x28 px · proporção da imagem **4:5** · fundo magenta · linha 6: eat

**Folha A (andar)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo anexado.

ANIMAL: chinchila: pelo cinza-azulado macio e denso, barriga branca, orelhas redondas grandes, cauda fofa.

FORMATO DA IMAGEM: proporção 4:5. Grade exata de 4 colunas por 6 linhas = 24 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 275 x 229 pixels (a imagem toda tem cerca de 1101 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 192 x 192 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho e as MESMAS cores e proporções nas 6 linhas.

LINHAS (todas com 4 quadros de ciclo de passo, perna da frente, meio, perna de trás, meio):
 Linha 1: andando DE FRENTE para quem vê (vindo na direção da câmera, olhando para baixo na tela). 
 Linha 2: andando DE COSTAS (indo para longe da câmera, olhando para cima na tela). 
 Linha 3: andando DE LADO, perfil olhando para a ESQUERDA. 
 Linha 4: andando em 3/4 DE FRENTE virado para a ESQUERDA (indo para baixo e para a esquerda; vemos a frente e o lado esquerdo do animal). 
 Linha 5: andando em 3/4 DE COSTAS virado para a ESQUERDA (indo para cima e para a esquerda; vemos as costas e o lado esquerdo do animal). 
 Linha 6: DE LADO, perfil olhando para a ESQUERDA, PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 24 quadros.
```

**Folha B (ação: eat, proporção 1:1)**

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico (câmera levemente de cima, como nos RPGs de mapa), estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo e com o MESMO animal da folha de andar anexada (mesmo tamanho, mesmas cores e proporções).

ANIMAL: chinchila: pelo cinza-azulado macio e denso, barriga branca, orelhas redondas grandes, cauda fofa.

ESTA É A FOLHA DA AÇÃO. O animal precisa fazer a ação nas 8 direções do jogo; desenhamos 5 vistas da esquerda e o jogo espelha as da direita.

FORMATO DA IMAGEM: proporção 1:1. Grade exata de 4 colunas por 5 linhas = 20 quadros, todos do MESMO tamanho de célula, em grade uniforme, sem moldura e sem números. Cada quadro é uma célula de 344 x 275 pixels (a imagem toda tem cerca de 1376 x 1376 pixels).

TAMANHO DO ANIMAL: em vista de lado ele ocupa cerca de 231 x 231 pixels dentro da célula, centrado, com as patas apoiadas na MESMA linha do chão em todos os quadros da mesma linha. Nada é cortado nas bordas da célula. O animal tem o MESMO tamanho nas 5 linhas.

AÇÃO: PASTANDO/COMENDO: cabeça baixa no chão mastigando, 4 quadros (cabeça desce, mastiga, sobe um pouco, mastiga). Corpo parado, só a cabeça e o pescoço mexem.

LINHAS (todas com os 4 quadros da ação, na ordem):
 Linha 1: ação DE FRENTE para quem vê (a cabeça virada para a câmera, olhando para baixo na tela).
 Linha 2: ação DE COSTAS (de costas para a câmera, olhando para cima na tela).
 Linha 3: ação DE LADO, perfil olhando para a ESQUERDA.
 Linha 4: ação em 3/4 DE FRENTE virado para a ESQUERDA (vemos a frente e o lado esquerdo do animal, virado para baixo e para a esquerda).
 Linha 5: ação em 3/4 DE COSTAS virado para a ESQUERDA (vemos as costas e o lado esquerdo do animal, virado para cima e para a esquerda).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz vindo de cima e da esquerda em TODAS as linhas, cores naturais. Sem sombra no chão. Sem texto.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal em todos os 20 quadros.
```
