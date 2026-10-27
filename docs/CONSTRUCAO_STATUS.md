# Sistema de construção — status (Aethelgard)

Atualizado em 22/10/2026. Fases do `GDD_CONSTRUCAO_E_SPRITES.md` já feitas e testadas no jogo: **F0, F1, F2, F3, F4, F5**.

## Arquivos
| Arquivo | Papel |
|---|---|
| `assets/dungeon/dungeon_game_atlas.png/.json` | **Fonte única da geometria**: `frame`, `anchor`, `face` A/B, `ground`, `kind`, `nativeSlope` de cada peça |
| `js/dungeon_blocks_data.js` | Só rótulos e flags (nome, dica, aba, solid, isWall…). Sem geometria |
| `js/dungeon_snap.js` | Funções puras: pontas de encaixe (`localSockets`), `findSnap`, linhas de profundidade (`depthSegments`), colisores (`colliderSegments`), `altAnchor` (troca de sprite de porta) |
| `js/depth_sort.js` | Ordem de desenho: parede = linha; personagem e parede, e parede e parede, por ordenação topológica |
| `js/architect.js` | Construtor: `addDungeonPiece`, `placeDungeonSnapped`, `applyAtlasCatalog`, portas/grades (F5), colisão (`isSolidAt`) |
| `js/structures.js` | Carrega o atlas, sincroniza o catálogo e monta a cena `?scene=structures` (peças temporárias) |

## Como funciona
- **Encaixe (F2):** cada peça tem pontas (A/B nas retas; braços nas quinas). Ao clicar, a peça gruda na ponta livre mais próxima com a orientação certa (até ~90 px). Sem ponta perto, usa a grade de 48 px. Peças de atlas entram só por clique (não por arrasto). Peças encaixadas guardam `wx`,`wy` exatos.
- **Ordem de desenho (F3):** cada peça tem `segs` (linha de chão). Personagem está na frente se o pé estiver abaixo da reta.
- **Colisão (F4):** colisor por tipo (reta, quina, arco = só os 2 pilares, pilar, frontal, ruína; entulho solto é atravessável). Para peças do atlas o raio do jogador é `min(raio, 10)` e a espessura da parede é 8 — se um vão ficar apertado, mexa nesses dois números (`colliderSegments` e `isSolidAt`).
- **Portas e grades (F5):** porta de madeira `door_wood_01..07` troca de sprite (fechada → entreaberta → aberta) mantendo a ponta A; grades e portões (`gate_*`, `fence_*`, `double_door_iron_gate_01`) sobem com clip. Passável com abertura ≥ 66 %.
- **Tranca (guardado para o futuro):** **Shift + clique** numa porta/grade tranca (CD 12) ou destranca. Clique normal numa trancada rola D20 de **Ladinagem** (`window.diceSystem.rollD20('Arrombar fechadura', bonus, cd, cb)`); sucesso destranca e dá 12 XP de `ladinagem`. Estado em `block.lock = {locked, cd}`; abertura em `block.isOpen` + `block.openT`. Próximo passo possível: botão de tranca no painel do construtor, CD por peça, chave como item, força bruta com `forca`.

## Saves
Chave do `localStorage`: `aethelgard_blocks_v2` (inalterada). Peças da cena de teste têm `temp:true` e **não** são salvas nem exportadas. Antes de limpar cache do navegador, use **Exportar** no construtor.

## Cuidados
- Ao mudar qualquer `.js`, aumente o `?v=` no `index.html` (o navegador guarda em cache).
- Backups das versões anteriores: `backup_f0_fix/`.

## Pendências / backlog
- Limpar o painel de portas e criar **Porta/Portal de Madeira e de Pedra, simples e dupla (2 blocos)**.
- Portas duplas de madeira e a de arco de pedra ainda sem sprite aberto.
- `stone_wall_broken_03`: face marcada como não confiável (calibrar A/B).
- Peças sem pontas medidas (arcos, pilares, ruínas, frontais) ainda não encaixam entre si.
- Paredes de madeira, telhados, pisos e escadas: mesmo tratamento (pontas, linha de chão, colisor).

## Portas e portais (F5c)
- Painel "Portas": Porta de Madeira Simples, Porta de Pedra Simples (abrem/fecham com sprite; Shift+clique tranca) e Portais (arco sem porta, passagem livre): Pedra/Madeira, Simples e Duplo (arco largo, peca unica, passam 2 pessoas). Demais portas ficam `hidden:true`.
- Portais sao sempre passaveis; so os pilares sao solidos (`DungeonSnap.portalPosts(flip, c)`, c=30 simples, 50 largo).
- Arte nova gerada por `dungeon_sprites/extra/append_extras.py` (idempotente, anexa ao atlas; EXTRA_W=40 controla a largura do portal duplo). **Se o atlas for regenerado por make_game_atlas, rode `python append_extras.py <assets/dungeon>` de novo.**

## F6 - Persistencia por chunk
- Save em chunks de 16x16 tiles: chaves `aethelgard_chunk_v1:<cx>,<cy>` + indice `aethelgard_chunks_v1` (localStorage). So chunks alterados sao regravados (debounce 250 ms; tambem ao fechar/ocultar a aba).
- Migracao automatica na 1a carga a partir de `aethelgard_blocks_v2`, que fica intacto como backup (pode ser apagado depois).
- Se o navegador estourar a cota, aparece aviso no log (usar 💾 Exportar). Estado das portas (aberta/trancada) vai junto no save.
- Proximo passo possivel: carregar so os chunks proximos do jogador (hoje carrega todos ao iniciar).

## F7 - Economia da construcao
- Pecas do atlas custam material: pedra (muros, quinas, pilares 2; tijolo 3; arcos 4; ruinas 1; portal/porta de pedra 4, portal largo 6; grade de ferro 5) ou madeira (porta 3; paredes de madeira 2; portal de madeira 4/6). Regra em `ArchitectSystem.buildCost()`; qualquer peca pode ter `cost:{stone,wood}` no `dungeon_blocks_data.js`. Pecas antigas (nao-atlas) seguem gratis.
- Sem material: nao coloca, mostra "Falta N" e aviso no log; preview mostra o custo (vermelho se faltar); cartoes do painel mostram custo e ficam esmaecidos.
- Demolir devolve 80% (arredondado). Pecas de cena temporaria sao gratis.
- Item novo `stone` (Pedra) em `inventory.js`. **TEMPORARIO:** `initStartingItems` da 24 pedras. Ainda nao existe fonte de pedra no mundo (mineracao) - a fazer.

## Limpeza do painel (pos-F7)
- Fora do painel (`hidden`, ainda desenhadas em saves antigos): ruinas (4), wood_wall_low_01, tijolos 7-11 (quina janela+tocha, 3 janelas com grade, brick_wall_torch_01).
- Pecas classicas (nao-atlas: paredes, portas, telhados, pisos, objetos) nao aparecem mais no painel (`renderItemsGrid` so lista `isDungeon`); abas Ruinas/Classicos/Telhados/Pisos removidas. O codigo delas continua para desenhar saves antigos; serao refeitas.
- (substituido pela secao F8 abaixo)

## F8 - Limpeza geral e encaixe unico
- Mapa zerado: na 1a carga o jogo apaga os saves antigos (chunks + `aethelgard_blocks_v2`) e grava `aethelgard_reset='f8_clean'` (so roda uma vez; para zerar de novo, mude a tag em `loadSavedWorldData`).
- Catalogo so tem pecas do atlas (48): pedras 20, portas 6, grades 7, tijolos 6, madeiras 8, arco 1. Apagados: todos os blocos classicos (parede/porta/piso/telhado/objeto + imagens preload), ruinas, variacoes tecnicas, wood_wall_low_01, tijolos 7-11, arch_stone_01 (igual ao portal de pedra), stone_wall_broken_03 (encaixe torto). Dead code dos classicos ainda existe em `architect.js` (inofensivo). As imagens em `assets/blocks/` nao sao mais usadas e podem ser apagadas.
- Encaixe: ja era um modulo unico (`DungeonSnap`, usado por TODAS as pecas). Cada peca so precisa de metadados no atlas: `face` A/B (retas, portas, grades, arcos) ou bracos (quinas). Arcos ganharam `face` via `dungeon_sprites/extra/patch_atlas_meta.py` (idempotente; rodar de novo se o atlas for regenerado, junto com `append_extras.py`).
- Verificado em folha de conferencia: todas as 48 pecas encaixam parede-peca-parede (quinas concavas so encaixam com parede espelhada, por geometria; pilar e livre, sem pontas).
- Arco musgoso agora se chama "Portal de Pedra Musgoso" (passagem livre como os portais).

## F8b - Codigo antigo removido
- `architect.js` caiu de ~1870 para ~1045 linhas: sem blocos classicos (paredes/portas/pisos/telhados/lanternas), sem altura de parede (botao/tecla H), sem portas duplas encadeadas (`pair`), sem desenho/colisao/preview de grade. Tudo agora e peca do atlas.
- Mantidos por compatibilidade com o game.js: `drawRoads()` (vazio, sera a camada de pisos), `updateRoofTransparency(dt)` (agora so anima portas/grades), `toggleDoorAt()`.
- Pasta `assets/blocks/` nao e mais usada por nada e pode ser apagada.

## F9 - Muros empilhados (altura)
- Botoes no rodape do painel: **Altura 1x/2x** (tecla H) e **Empilhar On/Off** (tecla T). So muros, quinas e muro frontal (`_stackable`); portas, grades, arcos e pilar ignoram.
- Altura 2x: ao colocar, entram 2 pecas (camadas 0 e 1), custo dobrado. Empilhar: clicar numa peca coloca a selecionada EM CIMA dela (mesma posicao/espelho, proxima camada livre); da para repetir (3, 4...).
- Dados: `block.z` (0 = chao). Camada = deslocamento vertical de `STACK_STEP` = 77 px (altura da face frontal do muro; a base de cima cobre o capeamento da de baixo; ajustar se alguma familia ficar com fresta). Chave da peca elevada: `1:gx,gy,z<N>[#n]` (nao entra na colisao, que so olha o chao). Save por chunk grava as chaves como estao.
- Demolir: pega a peca mais alta sob o cursor; se for uma base, as de cima caem junto (reembolso de 80% de cada uma). Snap lateral so considera pecas do chao.
- Limitacao: camada de cima nao muda a ordem de desenho com o jogador (usa a mesma linha de chao da base).

## F10 – Pisos
- 4 pisos (madeira, pedra, pedra polida, taco) em losangos 108x54 no atlas (`floor_*_01`, gerados por `dungeon_sprites/extra/make_floors.py`).
- Aba "Pisos"; arraste para pintar numa malha isometrica (origem: piso vizinho > muro proximo > origem do mundo).
- Custo: madeira 1, taco 2 madeiras, pedra 1, pedra polida 2 pedras. Trocar o tipo reembolsa 80% do antigo; demolir (muros primeiro, senao o piso) reembolsa 80%.
- Desenhados em `drawRoads` (chao), salvos nos chunks como camada 0.
- F10b: malha do piso alinhada aos muros. Sem piso vizinho, a malha nasce de um vertice de muro (pontas A/B ou quina); e muros/quinas sem outro muro por perto encaixam nos vertices dos pisos (raio 70 px). Muro reto 01 (108 px) = 2 tiles; muros de outros comprimentos (musgo 94, porta 52) so alinham numa das pontas.
- F10c: portas (madeira e pedra) entreaberta/aberta: removida a sombra/fundo verde cozido no sprite (aparecia como mancha escura no vao) e o halo verde dos contornos. Corrigido direto no atlas. Se o atlas for regenerado (append_extras.py), repetir a limpeza para door_stone_ajar_01/open_01.
- F10d: madeira: passo dos paineis/portas/quinas de madeira encurtado em 8 px (script `dungeon_sprites/extra/patch_wood_overlap.py`, idempotente) para os postes de dois paineis vizinhos se fundirem em um so (antes ficavam dois postes lado a lado, lendo como "escadinha"). Rodar de novo se o atlas for regenerado. Pecas de madeira ja construidas continuam no passo antigo; as novas encaixam no novo.
- F10e: `wood_wall_panel_02` (2 blocos) e `wood_wall_panel_01` tinham inclinacao diferente de 0.5 (0.41 / 0.57): cisalhados para 0.5 e regravados numa regiao nova do atlas (altura 906+), viga alinhada com a do panel_01 (`dungeon_sprites/extra/fix_panel02_slope.py`, idempotente). `fence_iron_spiked_01`, `gate_iron_03/04` e os arcos tambem tem inclinacao fora de 0.5 (pendente, so se forem usados). Removido o `wood_corner_gate_01` do catalogo.

## F11 – Segundo andar e escadas
- **Andar de construcao** (botao 🏢 Andar / tecla G, 0-3): tudo o que se constroi (muros, portas, pisos, escadas) fica na altura `andar * 77 px`. Pecas guardam `z`; pisos de cima usam chave `0:gx,gy,zN`.
- **Escadas** (`stair_wood_01`, `stair_stone_01`, aba Escadas; madeira 6 🪵 / pedra 6 🪨): 4 degraus, 2 tiles, sobem 1 andar. Ancora = tile ALTO; R espelha o lado. Arte gerada por `dungeon_sprites/extra/make_stairs.py`.
- **Player**: `player.z` (px). `architect.elevationAt(x,y,z)` decide onde ele pode ficar: escadas (z segue a rampa), pisos de cima (z fixo) e terreo; borda de piso / corpo de escada bloqueiam. Colisao dos muros so com pecas do mesmo andar (`isSolidAt(x,y,r,z)`). `game.js`: `getLift()`, camera, mouse e desenho do player descontam `z`; modo Deus zera `z`.
- Pisos de cima entram na ordenacao de profundidade (`floor_up`); escada ordena antes de quem esta sobre ela.
- Limites conhecidos: portas/grades acima do terreo nao abrem (toggle so olha o terreo); monstros/animais ignoram andares.
- F11b: escada desenhada depois dos pisos de cima ao redor (aparece inteira; so fica atras do player enquanto ele esta sobre ela); pisos dos andares de cima ganharam espessura de laje (9 px) para nao parecerem folhas soltas.
- F11c: ordem de desenho por andar. Player abaixo de uma laje: a laje e desenhada DEPOIS dele (linha do centro) e fica translucida perto dele (nao some mais por baixo do piso de cima); player no andar da laje ou acima: laje antes (ele fica sobre ela). Escada sempre inteira (key anc.y+130) e o player sobre ela ganha `architect.playerSortY()` (game.js usa como y de ordenacao).

### F11d - ordem da escada
Escada volta a ordem fisica (atras de quem esta sobre ela, sob as lajes de cima); fade das lajes passa a valer tambem durante a subida (player mais baixo que a laje). v41.

### F12 - fade nas pecas do 2o andar + sobreposicao da pedra
- Paredes/portas/etc. com z>0 ficam translucidas (alpha 0.28, suave) quando cobririam o player; terreo nao faz fade. Nao vale no modo Deus.
- patch_stone_overlap.py: pedra/tijolo/arcos/portais de pedra com overlap 8 px (flag stoneOverlap), igual a madeira (34 frames). Linha preta nas pontas some/fica 1 so.
- v42.

### F12b - emendas da pedra
- clean_stone_seams.py: remove o contorno preto da ponta esquerda das paredes de pedra/tijolo (15 frames, flag seamClean); depois patch_stone_overlap.py (8 px). Ordem: clean -> overlap. v43.

### F12c - encaixe piso x parede do 2o andar
Paredes de andar > 0 passam a ser desenhadas depois das lajes do mesmo andar (antes a laje cobria a base das paredes da frente). v44.

### F12d - escada sempre visivel + terreo sob a laje
- Escada: player abaixo do topo -> desenhada depois das lajes/paredes proximas (inteira, sobre o resto); player em cima -> ordem fisica e paredes que cobrem a escada ficam translucidas. playerSortY cobre a frente da escada.
- Pecas do terreo sob lajes de cima ficam por baixo da laje (some a face interna do muro escuro por cima do piso). v45.

### F13 - Telhados
- js/roofs.js: telhado de duas aguas desenhado por codigo (palha, madeira, telha). PITCH=0.7 (~35 graus), beiral 0.38, cumeeira no lado maior (empate: sentido a).
- Ferramenta (aba Telhados): clique num piso do andar atual -> cobre o retangulo que envolve todo o piso ligado; assenta no topo das paredes do andar (z = andar+1). Custo por celula (palha 1 madeira, madeira 2 madeira, telha 2 pedra).
- Salvo como bloco r:gx,gy,zN; demolir = clicar no telhado; novo telhado no mesmo local substitui. Fade 0.2 com player sob ele (andar abaixo do telhado), 0.4 no modo Deus. v46.

### F13b - telhado em qualquer andar + fade sempre
- Fade 0.2 sempre que o telhado esta na frente do player e o cobre na tela (atras, sob ou dentro), em qualquer andar.
- Telhado no andar L usa o piso do proprio andar ou, se nao houver, o do andar mais alto abaixo (base em z=L+1). v47.

### Anotado para depois
- Telhado: textura mais medieval e menos "desenho" (telha irregular, musgo, palha mais solta); fechar a empena (triangulo) com parede em vez de superficie lisa; quatro aguas e formatos em L.
- Fade das paredes de cima usa retangulo do sprite (bordas retas): suavizar com degrade.
- Emendas antigas de pedra continuam com o espaco antigo (refazer trechos).

### F14 - Mobiliario, luz e calor (v48)
- js/furniture.js: moveis desenhados por codigo (caixas isometricas, cache): mesa (liga com vizinhas), cadeira (4 lados), cama 1x2 (4 lados), lareira (2 bocas, chama animada), candelabro, lampiao.
- Aba Moveis no construtor; blocos 'f:gx,gy[,zN]' {type,wx,wy,rot,z}; 1 celula (cama 2); em andar > 0 so sobre piso; R gira; clicar no mesmo movel so gira; demolir = clicar na celula.
- Colisao: mesa/cama/lareira/candelabro/lampiao solidos; cadeira passavel. isSolidAt(..., noFurn).
- Luz: architect.getLights() -> game.renderLighting fura a escuridao (lareira r300, lampiao r235, candelabro r165) + brilho quente.
- Conforto (architect._comfort): abrigo (telhado acima), comodo fechado (espalha pelas celulas com piso; parede/porta fechada bloqueia; vazou = aberto) e calor (lareira 1.0, candelabro 0.15, lampiao 0.1). Temp = 12 +3 abrigo +5 fechado +7/fonte (max 2.2). Selo no topo da tela; player.localTemp para o futuro sistema de frio.
- Pendente: balcao 1x1/grande, estante, adega/barril, bau com inventario, sentar na cadeira, dormir na cama, fumaca da chamine, texturas melhores.

### F14b - escada x muro do mesmo andar
A escada "late" so passa por cima de lajes/paredes de andares ACIMA; muros do mesmo andar a frente dela voltam a cobri-la. v49.

### F15 - Mobiliario lote 2 (v50)
Balcao (liga com vizinhos), balcao grande (2 blocos), estante de livros e adega (4 lados), barril, bau (2 frentes). Todos solidos; bau ainda sem inventario. Aba Moveis (12).
