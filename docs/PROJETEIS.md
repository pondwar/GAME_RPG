# Projéteis e armas de longe (plano)

> **REGRA DE OURO:** tudo que se move usa as 8 direções (veja [REGRA_8_DIRECOES.md](REGRA_8_DIRECOES.md)). Vale para o atirador **e** para o projétil.

## Armas de longe do jogo (tabela D&D em `js/armas.js`)
| Grupo | Armas | Munição | Movimento do boneco |
|---|---|---|---|
| Arco | arco curto, arco longo | flecha | **arco** (puxa a corda, mira, solta) |
| Besta de duas mãos | besta leve, **balestra** (besta pesada) | virote | **besta2** (ombro, mira, atira, recarrega) |
| Besta de uma mão | besta de mão | virote pequeno | **besta_mao** (braço esticado, mira, coice) |
| Arremesso | adaga, machadinha, azagaia, martelo leve, lança, tridente, dardo | a própria arma | **arremesso** (por cima do ombro) |
| Funda | funda | pedra | **funda** (gira por cima da cabeça e solta) |

Zarabatana saiu do jogo (decisão do dono, nov/2026). Magias ficam para um bloco à parte (efeitos visuais).

## Movimentos (vídeos no Kaggle, humano, boneco SEM arma na mão)
5 movimentos x 5 vistas (lado, frente, costas, 3/4 frente, 3/4 costas; a direita é espelhada) = 25 vídeos: `.kaggle/acoes_lote7.py` (arco, besta2, besta_mao) e `acoes_lote8.py` (arremesso, funda). Depois: montar as folhas, importar como ações `shoot_bow`, `shoot_xbow2`, `shoot_xbow1`, `throw`, `sling`, medir a mão e testar nas 8 direções.

## Projétil no jogo (a fazer)
- Entidade que voa **nas 8 direções** (ou em qualquer ângulo, desenhada girada), com alcance normal e longo, queda e hit pelo d20 da ficha D&D (ataque à distância, desvantagem no alcance longo).
- Munição como item na mochila (flecha, virote, pedra); arma sem munição não atira. Arremesso gasta a própria arma, que cai no chão e pode ser pega.
- Desenhos por código (`tools/arte/gerar_armas.py`): arco, besta, balestra, funda e os projéteis.
- Skins: só visual, sem dano extra (veja memória `armas-basicas-e-skins`).

## Estado (13/nov/2026)
Folhas shoot_bow, shoot_xbow2, shoot_xbow1, throw e sling importadas nas 8 direcoes. Tiro funcionando no jogo (municao, voo, d20). Costas do arco/besta2 usam a diagonal de costas. Falta: arremesso de armas de corpo a corpo, desenhos finais das armas de longe, recuperar flechas.

## Arremesso (13/nov/2026)
- Tecla **Q** arremessa na direcao do mouse (qualquer angulo, 8 direcoes testadas). Joga a arma da mao se for adaga, machadinha ou lanca; senao, azagaia ou dardo da mochila (`js/combate.js`: `ARREMESSO`, `ARREMESSO_FICHA`).
- A arma sai da mao no instante certo do movimento `throw`, voa (sem municao), rola o d20 de ataque como o arco e cai no chao no ponto de parada ou de impacto (`armasNoChao`). Anda-se por cima para pegar de volta (nao persiste ao recarregar o jogo).
- Itens novos: `dardo` (pilha de 20) e `azagaia` (pilha de 10). O modo `?testearmas=1` entrega 10 dardos e 5 azagaias.
- Desenho por codigo (`desenharArmaArremessada`): na mao durante o preparo, no ar (adaga e machadinha giram) e no chao. `medir_maos.py` agora trata `throw` como golpe, para achar a mao certa de frente e de costas.
- As armas caidas ficam no banco (`world.ground_item`, migracao 008; `GET|PUT /api/world/ground-items`): recarregar nao as faz sumir; sem servidor ficam no navegador. A migracao 008 tambem cadastrou arco, bestas, funda, municao, dardo, azagaia e ervas, que o servidor descartava ao salvar.
- Falta: desvantagem em alcance longo (D&D), martelo leve e tridente, arte final das armas.

## Itens no chao (drop) - multiplayer (13/nov/2026)
- Qualquer item pode ser largado: **botao direito** na mochila abre o menu (Equipar/Usar, Largar 1, Largar tudo), o botao **Largar** solta 1 e **arrastar para fora da janela da mochila** solta a pilha inteira (do equipamento tambem). O item aparece aos pes como miniatura (sprite da arma, forma da arma de arremesso, ou o icone) com anel da cor da raridade e "xN" na pilha. **Nao pega sozinho**: aperte **F** perto do item (pega o mais perto; F de novo pega o proximo) ou clique com o **botao direito em cima do(s) item(ns)**: abre a lista de tudo que esta ali e voce escolhe o que pegar (se estiver longe, o boneco anda ate la e pega). O nome do item aparece ao passar o mouse. Frutas no chao seguem a mesma regra (antes eram pegas sozinhas). So pega se couber na mochila.
- Banco: `world.ground_item` (migracoes 008 e 009: item, quantidade, x, y, giro, validade). Rotas: `GET /api/world/ground-items`, `POST` (largar, devolve o id) e `DELETE /api/world/ground-items/:id` (pegar: so quem apagar a linha leva o item; o outro recebe 404 "ja pegaram"). O jogo consulta a lista a cada 5 s para ver o que os outros largaram ou pegaram. Itens largados duram 30 min; o mundo guarda ate 2000.
- Sem servidor, o chao fica no navegador (`suritto_ground_v2`). Frutas largadas continuam virando isca para a fauna (`fruitsOnGround`).
