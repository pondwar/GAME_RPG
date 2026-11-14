# REGRA DE OURO: tudo que se move usa as 8 direções

Decisão do dono do projeto (nov/2026). **Vale para tudo, sem exceção:** jogador, NPCs, animais, monstros, projéteis e qualquer objeto que se mova.
O Suritto não é um 2D comum: a meta é **simular um 3D**, com movimento fluido em todas as direções.

## As 8 direções
| # | Direção | Chave no jogo |
|---|---------|---------------|
| 1 | Baixo (vindo para a câmera) | `down` |
| 2 | Cima (indo para longe) | `up` |
| 3 | Esquerda | `left` |
| 4 | Direita | `right` |
| 5 | Diagonal baixo-esquerda | `down_left` |
| 6 | Diagonal baixo-direita | `down_right` |
| 7 | Diagonal cima-esquerda | `up_left` |
| 8 | Diagonal cima-direita | `up_right` |

## Como fazemos (economia: desenhar 5, espelhar 3)
Desenha-se o lado **esquerdo** e o jogo **espelha** para o direito:
- **5 vistas desenhadas:** frente (`down`), costas (`up`), lado esquerdo (`left`), 3/4 frente esquerda (`down_left`), 3/4 costas esquerda (`up_left`).
- **3 espelhadas pelo jogo:** `right`, `down_right`, `up_right`.
- O espelho só vale se **a arma/objeto na mão ficar certo** ao espelhar (o jogo guarda o lado da mão por quadro). Testar sempre.

## Vale para TODA ação, não só andar
Andar, correr, parado, **golpes (todas as armas)**, pular, sentar, coletar, comer, atacar, voar, morrer… cada ação precisa das 8 direções.
- Um golpe só "de lado" que aparece em diagonal como se fosse de lado é **erro** (foi o caso do golpe de espada: nas diagonais mostrava o golpe de lado, sempre apontando para baixo-direita).
- Gambiarra temporária (ex.: usar a folha de frente/costas nas diagonais) só enquanto a arte da diagonal não existe, e **sempre registrada como pendência**.

## Checklist obrigatório (arte, prompts e Kaggle)
1. Todo prompt de sprite que se move pede as **5 vistas esquerda + espelho** (ou as 8 direções completas).
2. Todo vídeo do Kaggle de uma ação é gerado **por vista**: frente, costas, lado, 3/4 frente, 3/4 costas (e espelhado para o resto). A print inicial de cada vista é a do boneco naquela direção.
3. Movimento **fluido**: ciclos completos (andar = 8 quadros por direção), sem trocas bruscas de pose ao mudar de direção.
4. Teste no jogo nas **8 direções do mouse** (0° baixo, 45° baixo-esq, 90° esq, 135° cima-esq, 180° cima, 225° cima-dir, 270° dir, 315° baixo-dir).
5. Item novo com movimento (animal, NPC, objeto) só é dado como pronto com as 8 direções funcionando.

## Estado (nov/2026)
- Humano: andar nas 8 direções; ações em 4 vistas (lado/frente/costas + espelho). **Falta** a vista 3/4 (diagonais) de: espada, machado, estocadas, soco, pular, sentar, coletar.
- Animais: prompts já pedem as 5 vistas + espelho no andar. A **ação** (comer/atacar/voar) tinha só o perfil: agora há a folha B da ação, nas 5 vistas (ver `docs/arte/PROMPTS_ANIMAIS.md`). O importador (`--acao-b`) e o carregador já aceitam a folha B (galinha feita).

## Auditoria (nov/2026): o que ainda NÃO cumpre a regra
- **Cervo, lobo e os 7 domésticos importados** (galinha, vaca, ovelha, porco, cavalo, cabra, cão): só 4 direções (cima, baixo, esquerda, direita). O usuário vai gerar de novo no Gemini com os prompts novos (folha A 4x6 + folha B da ação).
- **Os outros ~100 animais, NPCs e monstros:** ainda são bloquinhos por código, sem arte; quando ganharem arte, já nascem com as 8 direções.
- **Humano:** golpes/ações com diagonais 3/4 em geração no Kaggle (lotes 5 e 6, `.kaggle/acoes_lote5.py` e `acoes_lote6.py`).
- **Outras raças:** todas as ações vão precisar das 8 direções ao serem feitas; usar o humano aprovado como guia.
- **Projéteis, partículas e objetos móveis** (flecha, jangada, etc.): conferir se giram nas 8 direções quando forem trabalhados.

## Atualização (13/nov/2026)
- Humano: **todas as ações em 8 direções** (espada, machado, 2 estocadas, soco, pular, sentar, coletar; lado, frente, costas e as 2 diagonais 3/4, com a direita espelhada). O jogo escolhe a folha pela direção exata (`via8` em `js/game.js`).
- Pendências: lança de costas/diagonal de costas usam os quadros da estocada de uma mão (o vídeo de duas mãos de costas veio com um cabo de arma desenhado); chute e respiração fora por decisão do usuário.
- Animais com A e B: galinha, ovelha, vaca.
