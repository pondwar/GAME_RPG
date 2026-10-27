# 🏰 GDD — Sistema de Construção & Sprites Modulares
**Projeto**: Suritto RPG · **Escopo**: paredes, quinas, portas, portões, grades, arcos, ruínas (e as próximas famílias)
**Base**: leitura de `index.html`, `iso.js`, `structures.js`, `architect.js` (linhas 1–1227), `dungeon_blocks_data.js`, `world.js` e trechos de `game.js` (render, colisão, input).
**Substitui** as "perguntas da Fase 0" do `PROMPT_IA_PAREDES_PORTAS_GRADES.md`: elas já estão respondidas aqui.

> Como usar: leia as seções 1–3 (5 min), siga o plano da seção 5 fase por fase. A seção 6 é o guia para os próximos sprites. Os trechos de código da seção 4 são o miolo; o resto é decisão e checklist.

---

## 1. Mapa do código (o que cada arquivo faz hoje)

| Arquivo | Papel | Situação |
|---|---|---|
| `world.js` | Mundo cilíndrico, fusos, terreno, chunks de 1024 px (`ProceduralChunkManager`) | ✅ sólido. `WORLD_WIDTH = 6 660 096` → o GDD de Cartografia §5 (3 330 000) está desatualizado |
| `iso.js` | Projeção 2:1 (`worldToScreen`, `screenToWorld`…) | ⚠️ **não é usado por ninguém** (0 chamadas a `Iso.` em todos os arquivos) |
| `structures.js` (`StructureManager`) | Carrega o atlas, desenha peças, F3 debug, cena de teste (`?scene=structures`) | ⚠️ dados fixos de teste; chave de ordem = só `wy` |
| `architect.js` (`ArchitectSystem`) | UI do modo construtor [F2], grade 48 px, colocar/demolir, colisão `isSolidAt`, portas, telhados, save | ⚠️ mistura o sistema **antigo** (blocos 48×48 ortogonais) com o **novo** (peças isométricas) |
| `dungeon_blocks_data.js` | 66 peças auto-geradas (nome, frame, âncora, `groundLengthPx`) | ❌ cópia do atlas que pode ficar fora de sincronia |
| `game.js` | Loop, `renderList.sort`, colisão do jogador (~l.1987), clique em porta (~l.495) | cria `architect` (l.173) **e** `structures` (l.172) e renderiza os dois |
| `skills.js`, `dice.js`, `inventory.js` | Construção (nv. 1/15/40/70/99), `rollD20(motivo, mod, CD, cb)`, itens | ✅ prontos para ligar na construção (seção 4.8) |

### O conceito-chave que ninguém escreveu
O mundo do jogo é um **plano de tela**: `sx = (wx − câmera.x) + centro`, `sy = (wy − câmera.y) + centro` (`structures.js` l.257, `architect.js` l.1074). Ou seja, **movimento, árvores e lobos são ortogonais**; as paredes são **desenhos isométricos 2:1 pousados nesse plano**, e o "eixo X da parede" é a reta de inclinação +0,5 (`\`), o "eixo Y" a de −0,5 (`/`). Isso funciona e é uma boa decisão (não precisa migrar o mundo). Regras decorrentes:

1. **Não use `iso.js` para converter coordenadas do mundo.** Use as constantes `COS = 0,894` / `SIN = 0,447` só para converter comprimentos (largura de tela ↔ comprimento ao longo da reta).
2. A direção de uma parede `\` é o vetor (2, 1); de uma `/` é (2, −1), ambos no mesmo plano em que o jogador anda.
3. Âncora de uma peça = ponto do plano de chão onde ela "pisa" (centro da base). Tudo (ordem, colisão, encaixe) deve ser calculado a partir dela.

---

## 2. Diagnóstico: por que os encaixes falham (com evidência)

| # | Causa-raiz | Onde está | Efeito que você vê |
|---|---|---|---|
| D1 | **Grade de 48 px ≠ comprimento das peças.** Toda peça do atlas está como `w:1, h:1` (uma célula), mas a face de uma parede mede de ~57 a ~135 px (1,2 a 2,8 células) | `dungeon_blocks_data.js` (todas `w:1,h:1`); `architect.js` `handleBlockClick` | Sobreposição ou vão entre segmentos; quinas "no meio" da linha; impossível encadear peças de tamanhos diferentes |
| D2 | **`groundLengthPx` inclui a tampa lateral.** Vale `frame.w / cos` (ex.: 122 → 136; 84 → 94), não o comprimento da face | `dungeon_blocks_data.js` | Colisão e linhas de debug mais longas que a face visível |
| D3 | **Ordem de desenho por um único Y** (a âncora). Em parede diagonal comprida, quem está na frente da ponta esquerda tem `y` menor que a âncora e é desenhado **atrás** da parede | `architect.js` l.1088–1096, `game.js` l.2836 | Jogador/lobo "atravessando" a parede visualmente, sobretudo perto das pontas |
| D4 | **Empates de ordem**: peças com o mesmo `sortY` (no print, duas peças do canto superior esquerdo mostram o mesmo `depth: 800160`) | `game.js` l.2836 (desempata só por camada) | Flicker/ordem instável entre peças vizinhas |
| D5 | **Dois sistemas desenham estruturas** com modelos de dados diferentes (grade × posição livre) | `game.js` l.2826–2833 | Dois "donos" para a mesma coisa; correção em um não vale no outro |
| D6 | **Colisão errada para vários tipos**: (a) quina côncava `^` é tratada como convexa `V`; (b) arcos têm `solid:false` → pilares atravessáveis; (c) peças *frontais* usam inclinação 0,5; (d) espessura fixa 14 px para tudo | `architect.js` l.809, 826–843 | Paredes que bloqueiam o lugar errado ou não bloqueiam |
| D7 | **Porta nunca "abre" visualmente**: o ramo dungeon sempre desenha `cfg.sprite`, ignora `isOpen` (só a colisão muda) | `architect.js` l.1189–1199 | Porta aberta que parece fechada |
| D8 | **Rotação 0/90/180/270 com só 2 estados visuais** (`flipX = rot 90/270`). 180 = 0 e 270 = 90 | `architect.js` l.554, 1190 | Aperta R duas vezes sem mudar nada; sem como escolher a quina |
| D9 | **Persistência em um dicionário único** `layer:gx,gy` no `localStorage` | `architect.js` l.730 | Uma célula = uma peça (não cabe quina + parede juntas); não escala por chunk |
| D10 | **Atlas fora de sincronia**: seus frames (`stone_wall_straight_01` = 122×138) ≠ o `atlas_game` entregue (142×160) | `dungeon_blocks_data.js` | Escalas diferentes entre peças e entre versões |

> No print: os blocos `stone_wall_straight_01/02` e `stone_corner_01` aparecem em sequência com passo de 48 px em `depth` (800304, 800352, 800400, 800448): é a grade empurrando peças de ~120 px de largura. Isso é o D1 em ação.

---

## 3. Decisões (o norte)

1. **Manter o mundo como plano de tela** e as peças como "desenhos 2:1 sobre ele". Não migrar para projeção isométrica real.
2. **Uma única fonte de verdade**: o JSON do atlas (`atlas_game/dungeon_game_atlas.json`, gerado por `tools/make_game_atlas.py`) vira o catálogo. `dungeon_blocks_data.js` deixa de existir.
3. **Peças em posição livre, não em célula.** Cada peça guarda a posição da âncora (`x,y` em px de chão) e `axis`. A grade de 48 px fica só para pisos e telhados antigos.
4. **Encaixe por extremidades** (snap-to-end): cada peça reta tem os pontos **A** (ponta sem tampa) e **B** (quina da frente) medidos no sprite; a próxima peça é colocada com `A = B` da anterior. É assim que se encadeiam peças de comprimentos diferentes.
5. **Ordem de desenho por regra de lado** (acima/abaixo da reta da parede), mais desempate por `x`.
6. **Colisão gerada a partir do mesmo dado** (face A→B deslocada pela espessura), nunca da caixa do sprite.
7. **Um dono só**: `StructureManager` passa a ser *store + render + colisão* das peças isométricas; `ArchitectSystem` fica com **UI/ferramentas** e chama o store.

---

## 4. Arquitetura-alvo (miolo técnico)

### 4.1 Catálogo gerado do atlas
O JSON do atlas agora traz, por peça (já escalado para a altura-alvo, px relativos à **âncora**, orientação **nativa** do PNG):
- `frame {x,y,w,h}`, `anchor {x,y}`, `kind`, `nativeSlope` (`\`, `/`, `flat`, `V`, `^`…).
- `ground {left,right,front,back}`: pontos do contorno inferior (serve para quinas e arcos).
- `face {A, B, dx, cap, reliable}` nas peças retas (`wall/door/gate/fence`): `A` = ponta sem tampa, `B` = quina da frente, `dx` = comprimento da face em px de tela, `cap` = largura da tampa lateral. **`reliable:false` = calibrar à mão no F3** (hoje só `stone_wall_broken_03`).
- `groundLengthPx` = comprimento da **face** ao longo da reta (`dx / 0,894`); `spriteWidthLengthPx` é o antigo valor (com tampa; não usar para encaixe).

```js
// catalog.js — carrega o atlas e vira a única definição de peças
async function loadCatalog(url) {
  const j = await (await fetch(url)).json();
  const defaults = SPRITE_RULES;                 // 4.5/4.6: colisão, estados, material por kind/família
  return Object.fromEntries(Object.entries(j.frames).map(([name, f]) =>
    [name, { name, ...f, ...(defaults[f.kind] || {}), ...(SPRITE_OVERRIDES[name] || {}) }]));
}
```
`SPRITE_OVERRIDES` (um arquivo pequeno à parte) guarda só as exceções: peças com `reliable:false`, estados de porta, custo/material.

### 4.2 Modelo de peça (substitui `blocks['layer:gx,gy']`)
```js
piece = {
  id, sprite: 'stone_wall_straight_01',
  x, y,                       // âncora no plano do mundo (px, float, x com wrap)
  axis: 'x' | 'y',            // 'x' = linha \ ; 'y' = linha / (mesma peça espelhada)
  state: 'closed' | 'ajar' | 'open',
  hp, material, tier, plotId, ownerId,
  lock: { locked:false, cd:0, keyId:null }
}
// espelhar? só se o PNG nativo não tem a inclinação pedida:
const mirror = (cat.nativeSlope === '\\') !== (piece.axis === 'x');   // m = mirror ? -1 : 1
```
Rotação deixa de ser 0/90/180/270: **R alterna `axis`** (x↔y) nas retas e percorre as quinas disponíveis (V, ^, e as novas da seção 6).

### 4.3 Encaixe por extremidades
```js
function ends(p, cat) {                                  // pontos A e B no mundo
  const m = ((cat.nativeSlope === '\\') !== (p.axis === 'x')) ? -1 : 1;
  return { A: { x: p.x + m * cat.face.A.dx, y: p.y + cat.face.A.dy },
           B: { x: p.x + m * cat.face.B.dx, y: p.y + cat.face.B.dy }, m };
}
// coloca `next` encostado no fim (B) de `prev`, na mesma reta:
function chainAfter(prev, prevCat, nextCat, nextAxis) {
  const B = ends(prev, prevCat).B;
  const m2 = ((nextCat.nativeSlope === '\\') !== (nextAxis === 'x')) ? -1 : 1;
  return { x: B.x - m2 * nextCat.face.A.dx, y: B.y - nextCat.face.A.dy, axis: nextAxis };
}
```
- **Fantasma na ferramenta**: perto de uma extremidade livre (raio ~16 px) o fantasma "gruda" nela; senão usa o mouse arredondado a 4 px.
- **Ferramenta "linha de parede"** (arrastar de P0 a P1): quebra o segmento em peças do *kit* escolhido, somando `face.dx` até cobrir; sobra → peça curta (`stone_wall_straight_02`, face ≈ 69). Deve mostrar o fantasma da linha inteira antes de soltar.
- **Quinas** (tabela do que encosta no quê):

| Peça | Ponto da quina | Encosta com |
|---|---|---|
| Quina **V** (convexa, canto sul) | braço esquerdo (`ground.left`) | parede `axis:x`, ponta **B** |
| | braço direito (`ground.right`) | parede `axis:y`, ponta **B** |
| Quina **^** (côncava, canto norte; hoje só `stone_corner_mossy_01`) | braço esquerdo | parede `axis:y`, ponta **A** |
| | braço direito | parede `axis:x`, ponta **A** |
| Cantos **leste e oeste** | **não existem peças** | ver seção 6 (backlog) |

### 4.4 Ordem de desenho (acaba com D3 e D4)
Mantenha a lista ordenada por `y` (chave = `y` da âncora), mas **antes de ordenar** ajuste a chave das entidades móveis (jogador, lobo, cervo…) que estão perto de uma parede:
```js
function applyWallSideRule(entities, walls) {            // walls: {A,B,key} já espelhados
  for (const e of entities) for (const w of walls) {
    if (Math.abs(e.x - (w.A.x + w.B.x) / 2) > 140) continue;          // longe
    const t = (e.x - w.A.x) / (w.B.x - w.A.x);                         // 0..1 ao longo da face
    if (t < -0.15 || t > 1.15) continue;                               // fora do alcance lateral
    const lineY = w.A.y + t * (w.B.y - w.A.y);
    e.key = (e.y > lineY) ? Math.max(e.key, w.key + 0.5)               // na frente da parede
                          : Math.min(e.key, w.key - 0.5);              // atrás da parede
  }
}
renderList.sort((a, b) => (a.key - b.key) || (a.x - b.x) || ((a.layer||1) - (b.layer||1)));
```
Peças entre si: chave = `y` da âncora; quinas V `+1`, quinas ^ `−1` (já existe, manter). Árvores/objetos pequenos: `y` do pé.
Opcional (pergunte ao jogo): quando o jogador está **atrás** de parede alta, reduzir a opacidade da parede para ~45 %.

### 4.5 Colisão (substitui o ramo `isDungeon` de `isSolidAt`)
A face A→B é a borda **frontal** da parede; a linha de centro fica deslocada para trás pela metade da espessura:
```js
// espessura em px de tela: cap = face.cap  →  meia espessura perpendicular ≈ 0,447 * cap
function colliderSegments(p, cat) {
  const { A, B, m } = ends(p, cat), cap = cat.face.cap, ox = m * cap / 2, oy = -cap / 4;
  return [{ x0: A.x + ox, y0: A.y + oy, x1: B.x + ox, y1: B.y + oy, half: Math.max(6, 0.447 * cap) }];
}
// teste: dist(ponto, segmento) < half + raioDoPé   (reaproveite _distToSegment)
```
Por tipo (guardar em `SPRITE_RULES`):
| kind | Colisão |
|---|---|
| `wall`, `fence`, `ruin` | 1 segmento (acima); `ruin`/`pillar`: reduzir a ~60 % ou deixar manual |
| `corner V` / `corner ^` | 2 segmentos saindo do vértice (`ground.front`/`ground.back`) para `left` e `right`; **^ aponta para baixo** |
| `door`, `gate` | segmento enquanto `closed`; sem colisão em `open`; `ajar` = só batentes |
| `arch` | **dois pilares** (retângulos pequenos nas laterais, ~20 % da largura cada); vão central livre |
| `wall_frontal`, `double_door_frontal` | segmento **horizontal** (não use inclinação 0,5) |
Busca: hoje cada célula consultada faz até 81 buscas de chave (`getBlockAt`, laço 8×8) e `isSolidAt` roda até 3× por passo; troque por **um hash espacial por chunk** (peças indexadas por `chunkKey` → só consulta os chunks vizinhos). Tudo em coordenadas de chão e com `world.wrapDelta` para a costura do mundo.

### 4.6 Portas, portões e arcos
- **Estados**: `closed` → `door_wood_01..07`; `ajar` → `door_wood_ajar_01`; `open` → `door_wood_open_01` (os três têm âncoras diferentes: guarde um `stateSprites` por família e **desenhe pelo sprite do estado**, não por `cfg.sprite` — corrige D7). Transição curta (~80 ms por quadro).
- **Portões/grades** não têm sprite aberto: abra-os **subindo** (portcullis) com `ctx.clip` na região acima da âncora e `translateY(-altura * progresso)`; colisão some ao passar de 70 %. Sem arte nova.
- **Portões duplos / arcos** (`double_door_*`, `arch_*`): estados só quando existir arte (seção 6).
- **Tranca** (gancho do GDD de Habilidades): `lock.locked`; na interação, se trancada → `window.diceSystem.rollD20('Arrombar fechadura', game.skills.secondarySkills.ladinagem.bonus, lock.cd, res => { if (res.isSuccess) lock.locked = false; if (res.isFumble) piece.hp -= 10; })` (`dice.js` já tem essa assinatura; XP: `game.skills.addXP('ladinagem', 12)`). Força bruta: mesma rolagem com `strength`/`atletismo`.
- O clique em porta hoje usa a posição do mouse (`game.js` ~l.495 → `toggleDoorAt`). Mantenha, mas busque a **peça mais próxima do ponto**, não a célula.

### 4.7 Persistência por chunk (combina com `modifiedEntities`)
`structuresByChunk: Map<"cx_cy", piece[]>` — chunk = `floor(wrapX(x)/1024)_floor(y/1024)` (igual a `ProceduralChunkManager`). Salve só o que o jogador mudou (pose, demolição, estado da porta, tranca). Estruturas **geradas** (vilas/ruínas) nascem de `hash2D(cx, cy, …)` e não ocupam o save. Migração: converta o `suritto_blocks_v2` antigo (`gx*48+24, gy*48+48` → `x,y`). Use `IndexedDB` quando passar de ~2 000 peças.

### 4.8 Ligação com o resto do GDD (ganchos, não obrigatório agora)
- **Skill Construção** (nv. 1 fogueira · 15 bancadas · 40 cabanas · 70 pedra com portões): cada peça do catálogo ganha `{ material, tier, minLevel, cost:{wood,stone,nails,…}, hp, xp }`. Sugestão: `wood_*` tier 1 (nv. 15–40), `brick_*` tier 2, `stone_*` tier 3 (nv. 70), `gate_iron*` exige Forja. Ao colocar: `game.skills.addXP('construction', xp)`.
- **Itens que ainda não existem em `inventory.js`**: `stone` (Mineração), `nails`/`iron_bar` (Forja). Sem eles, a construção só consome `wood` (já existe).
- **Lotes** (GDD §3 Habitação): `plotId` em cada peça; só permitir colocar dentro do lote do jogador. Cabana = `wood_*`, casa média = `brick_*`, solar = `stone_*` + portões.
- **Clima/relógio**: sombras dinâmicas só **depois** do sistema estável (as sombras de chão do sprite já existem em arcos/porta aberta).

---

## 5. Plano de trabalho (fases com critério de aceite)

| Fase | O que fazer | Pronto quando |
|---|---|---|
| **F0 — Fonte única** | Copiar `atlas_game/*` para `assets/dungeon/`; apagar `dungeon_blocks_data.js`; gerar `BLOCK_TYPES` dos frames do JSON; remover os 8 `pieces` fixos de `structures.js` (manter só o catálogo `?scene=structures`) | F3 mostra âncora/face de cada peça e o catálogo desenha as 65 sem erro |
| **F1 — Unificar** | `StructureManager` vira store+render+colisão das peças isométricas; `ArchitectSystem` só UI e chama `store.add/remove`; `game.js` chama **um** `addStructuresToRenderList` | Só um caminho desenha peças dungeon |
| **F2 — Encaixe** | `ends()`, `chainAfter()`, fantasma com snap, `R` alterna `axis`, tabela de quinas, ferramenta "linha de parede" | Uma parede de 10 peças de tamanhos diferentes sem vão nem sobreposição; fechar uma sala retangular com 3 quinas |
| **F3 — Ordem de desenho** | `applyWallSideRule` + comparador com desempate por `x` | Dar a volta numa sala: jogador/lobo sempre na ordem certa, inclusive nas pontas; sem flicker |
| **F4 — Colisão** | `colliderSegments`, quinas ^/V, pilares do arco, frontais horizontais, hash por chunk | Não atravessa nada; desliza ao longo da parede; passa pelo arco e pela porta aberta; vale na costura do mundo |
| **F5 — Portas/portões** | Estados por sprite, portcullis por clip, tranca + D20 | Porta mostra o estado certo; portão sobe; porta trancada arromba com `Ladinagem` |
| **F6 — Persistência** | Por chunk + migração do save antigo; hash espacial | Recarregar a página mantém tudo; estruturas geradas por semente não entram no save |
| **F7 — Economia** | `cost/hp/minLevel/xp`, itens `stone`/`nails`, `plotId` | Construir consome material e dá XP de Construção |

Regra de ouro: **uma fase por vez, com print/teste em `?scene=structures` antes de seguir.** Se uma correção mexer em colisão *e* desenho ao mesmo tempo, quebre em dois commits.

Testes rápidos (cena de teste): (1) sala 6×4 com 4 quinas + porta + portão + arco; (2) corredor de 12 peças misturando `straight_01`, `mossy_02`, `straight_02`; (3) jogador e lobo orbitando a sala; (4) atravessar a costura do mundo (`x` perto de `WORLD_WIDTH`).

---

## 6. Convenções e backlog para os próximos sprites

### 6.1 Regras para gerar novas folhas (peças que se encaixam)
- **Projeção 2:1** (26,565°), luz vinda do **canto superior esquerdo**, mesmo tamanho de tijolo/pedra em todas as peças, contorno escuro de 1 px, **fundo verde chapado** `#3E503D` (62,80,61), ≥ 24 px entre peças, sem sombra projetada (exceto arcos/porta aberta), uma peça por célula.
- **Espessura da parede** ≈ 1/8 do comprimento da face; **todas as retas desenhadas como `\`** (o jogo espelha para `/`). Evite peças só em `/`: hoje `door_wood_04/07`, `gate_iron_01`, `stone_wall_broken_01/02` vêm nesse sentido e precisam de tratamento especial.
- **Comprimentos de face padronizados** (ideal): curta ≈ 1/2 módulo, inteira = módulo, longa = 1,5 módulo, para o "linha de parede" fechar sem sobra. Hoje a face das paredes varia de 57 a 135 px no atlas de 104 px; peça comprimentos múltiplos entre si na próxima rodada.
- Peça de **porta/portão**: pedir os estados na mesma folha (`closed`, `ajar`, `open`) com a **mesma âncora e o mesmo recorte**.

### 6.2 Nomes e metadados
`<material>_<tipo>_<variante>_<nn>` (ex.: `stone_wall_mossy_03`, `brick_corner_torch_01`). Tipos: `wall`, `wall_half`, `corner_v`, `corner_caret`, `corner_east`, `corner_west`, `post`, `door`, `gate`, `fence`, `arch`, `window`, `stair`, `floor`, `roof`, `prop`, `ruin`. Materiais: `stone`, `brick`, `dark_brick`, `wood`, `iron`. O `kind` e o `nativeSlope` saem do script, não do nome.

### 6.3 Backlog priorizado (o que falta para construir castelos de verdade)
1. **Quinas leste (`>`) e oeste (`<`)** + **pilares/postes** (`post`) para fechar cantos e T. *Sem isso, só 2 dos 4 cantos de uma sala existem.*
2. **Portas em 3 estados** para todas as famílias (madeira já tem; faltam grade, portão duplo e arco).
3. **Pisos** em losango 2:1 (96×48 px, encaixam em tiles de 48 px) e **escadas**.
4. **Telhados isométricos** de 2 águas (palha, madeira, telha) e **janelas** nas paredes de pedra/madeira (hoje só tijolo tem).
5. **Torres** (redonda e quadrada), **ameias** (topo de muralha), **adereços** (tocha de parede, bandeira, baú).
6. Variações de **madeira/taipa e pedra** nos mesmos módulos de face.

### 6.4 Pipeline (para cada folha nova)
1. Gerar a folha com as regras de 6.1 → 2. extrair recortes (remoção do verde por cor, 1 componente = 1 peça, juntar pedaços soltos) → 3. paleta única (96 cores) → 4. nomear e classificar (`kind`, `nativeSlope`) → 5. `python3 tools/make_game_atlas.py 104` (escala uniforme + medição de `face`/`ground`) → 6. abrir `?scene=structures` com F3 e conferir âncora/face das peças com `reliable:false` → 7. commit do PNG+JSON. Quando chegar a próxima folha, peça para eu transformar os passos 2–4 em script reutilizável.

**Altura-alvo da parede**: `104 px` (≈ 2,6 m a 40 px/m; jogador 72 px). Se achar baixa/alta, regenere com `python3 tools/make_game_atlas.py <altura>` — nunca escale em tempo de execução. Desenhe sempre com `imageSmoothingEnabled = false` e posição inteira.

---

## 7. Achados fora do escopo (rápidos)
- `skills.js` `rollD20Check` chama `window.sounds.playHurt()` num 1 natural; **`playHurt` não existe** em `sound.js` → `TypeError`. Use `playCritFail()` ou crie `playHurt`.
- `sound.js` também não define `playWoodChop` nem `playUIClick`; o `architect.js` os chama com `?.`, então hoje o construtor é mudo (sem erro). Vale criar os dois sons.
- Pisos/telhados antigos (`assets/blocks/*.png`, 48×48 ortogonais) **não combinam** com as peças isométricas; trate-os como legado até o backlog 6.3 (3 e 4).
