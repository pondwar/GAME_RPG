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

## Sprites das armas (14/nov/2026) - FLUX.2-klein, estilo "pixel art sombrio"
- Todas as armas de longe e as 21 armas corpo a corpo do D&D tem sprite proprio (nao ha mais desenho por codigo, so a corda do arco e a flecha encaixada). Estilo escolhido: medieval gasto (aco riscado, madeira escura, couro), prompt em `.kaggle/montar_flux6.py` / `montar_flux7.py` / `montar_flux8.py`.
- Importadores: `tools/arte/importar_flux_armas.py` (arco, besta, funda, municao: tira o fundo magenta por cor, mede as pontas do arco/besta e a barriga do arco, tira a corda desenhada pelo FLUX; tabela `assets/weapons/items/_longe.json`) e `tools/arte/importar_flux_armas_corpo.py` (armas corpo a corpo: deita na diagonal, tamanho no jogo e onde a mao segura; tabela `_corpo.json`).
- Mao nas poses de tiro: `medir_maos.py` agora trata `shoot_*` e `sling` como golpe (acha a mao da frente, a que segura o arco) e guarda a outra mao nos numeros 8 e 9.
- Pendencias: 6 armas ainda usam movimentos emprestados (varredura de montante/glaive, giro do mangual, chicotada); besta de mao e balestra tem a coronha parecida com a da besta leve.

## Editor de pegada das armas (14/nov/2026)
`js/editor_pegada.js`: F9 no jogo (ou `?editor=1`). Trava o boneco numa pose (arma, ação, direção, momento) e deixa arrastar/girar a arma numa imagem ampliada.
Ajustes ficam em `assets/weapons/items/_pegada.json`: `{ arma: { "acao_dir8[_quadro]": [dx, dy, giro°, comprimento, ordem] } }` (ordem 0 normal, 1 atrás, 2 na frente).
O jogo aplica em `game.js` (`pegadaAjuste`, `drawWeapon`, `drawArmaDeTiro`). Salvar usa `PUT /api/dev/pegada` (servidor local).

## RESUMO PARA NOVA CONVERSA (14/nov/2026) - ler isto primeiro
**Estado**: commits `a249bf0` (sprites das armas + editor) e `7952609` (mão trocada, aviso 404, skills) no GitHub (main). game.js `?v=128`, editor_pegada.js `?v=2`. O usuário reiniciou o servidor 3000 e está testando as armas e o editor (F9).

**Por quê do editor**: o usuário não gostou da "pegada" (como a mão segura a arma) e não sabe ajustar por código. Referências: RuneScape Classic (3D), Tibia (muito 2D), Ragnarok. Solução: editor visual + 3º eixo falso (comprimento = perspectiva, ordem atrás/na frente, giro). Opção 3 futura: 3D real (piloto Godot, ver `piloto-3d-pixel` na memória).

**Editor (F9)**: painel à direita; escolhe arma, ação (parado/andando/golpe/arremesso), direção (grade 3x3), "Momento" (quadro), "Vale para" (só este quadro / toda a direção). Mouse: arrastar move; Shift ou botão direito gira; roda gira; Ctrl+roda muda comprimento. Teclas: setas 1 px, Q/E 5°, `[` `]` comprimento. Botões: Zerar, Copiar p/ lado oposto (espelha), Salvar. Dados em `_pegada.json` (busca `acao_dir_quadro`, depois `acao_dir`). Pendente: estender a armaduras e itens de uso.
**Pontos de atenção**: arco andando para cima fica atrás do corpo (usar ordem "na frente"); o editor trava câmera em zoom 1 e bloqueia mouse/teclado do jogo enquanto ativo; 404 ao salvar = servidor velho, reiniciar + Ctrl+F5.

**Mão trocada (corrigido)**: `medir_maos.py` às vezes pega a outra mão. `tools/arte/corrigir_maos.py` conserta 11 quadros do humano (thrust_1h left/right 2; attack_2h down_left/right 5; gather down_left/right 3; jump up_left/right 5; punch left/right 1; punch up 3) pela média dos vizinhos. **Rodar DEPOIS de `medir_maos.py`**. Só a adaga (estocada esq. 2 e 3) foi vista ao vivo; os outros 9 só por números.

**Skills**: instaladas em `.claude/skills/` (só valem em conversa nova): `game-balance` (curva de custo das armas, dominância), `game-feel` (pausa no acerto, tremor, rastro, som), `economy-design` (fontes e ralos de ouro/itens, mercado). Vieram de rbergman/dark-matter-marketplace (plugins/game-dev/skills). Pedir pelo nome. NÃO instalados de propósito: Claude-Code-Game-Studios (pesado, espera Vite/TypeScript; só copiar ideias: art-bible, asset-spec/asset-audit, reverse-document), sprite-gen (usa codex/grok/openai, não PixelLab/ElevenLabs; só vista lateral). PixelLab só para tiles/efeitos pequenos e só se a licença for confirmada.

**Pendências / próximos passos possíveis**
1. Usuário termina de ajustar pegadas no editor e avisa; eu confiro `_pegada.json` e commito.
2. Usar `game-balance` na tabela de armas (`js/armas.js`, `js/combate.js`) e `game-feel` nos golpes.
3. 6 armas pesadas com movimento emprestado (montante, glaive, mangual, chicote...) -> vídeos Kaggle; besta de mão/balestra com coronha parecida com a besta leve.
4. Vista de costas para arcos; recuperar flecha e penalidade de longo alcance (não feitos); outras raças além do humano.
5. Escrever o `art-bible` do Suritto e checklist de assets (opcional).
6. Atualizar `MEMORY.md` com FLUX, vigia, drop, editor de pegada (feito junto com este resumo).

**Cuidado ao testar**: conferir `g.player.name` (usar `humano-pondwar`) antes de agir; salvamento desligado; servidor 3001 + `launch.json` temporário a apagar.
