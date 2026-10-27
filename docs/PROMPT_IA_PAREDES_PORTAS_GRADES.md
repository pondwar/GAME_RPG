# PROMPT — Integrar paredes, portas, grades e arcos (Suritto)

## Como usar (leia você primeiro)

1. Abra a outra IA (de preferência uma com acesso ao seu código, como Claude Code, Cursor ou Copilot Agent).
2. **Anexe / deixe acessível:**
   - os 4 GDDs `.md` que você já usa;
   - a pasta `dungeon_sprites/` (principalmente `atlas_game/`, `sprites_manifest.json` e `contact_sheet.png`);
   - o print do jogo com o problema;
   - o código do seu jogo (render, mapa/chunks, colisão, entrada do jogador).
3. Cole tudo que está **abaixo da linha "COPIE DAQUI"**.
4. Responda às perguntas da Fase 0 e aprove cada checkpoint antes de ela seguir.

---

## ===== COPIE DAQUI =====

# PAPEL E OBJETIVO

Você é um engenheiro sênior de jogos 2D/2.5D para navegador, e também professor paciente. Vou trabalhar com você em **Suritto**, um RPG medieval com mundo contínuo.

**Objetivo:** substituir meu código atual de paredes, portas, grades e estruturas por um sistema correto e reutilizável, usando um pacote de 65 sprites que já recortei e padronizei. Hoje o resultado no jogo está feio e inconsistente (veja a seção 3).

**Como quero que você trabalhe:**
- Explique cada decisão em linguagem simples, com uma analogia curta quando ajudar. Não sou especialista em projeção isométrica.
- Trabalhe em fases pequenas, com checkpoints. Não reescreva o jogo inteiro.
- **Leia meu código antes de propor qualquer coisa.** Respeite a stack que já existe (linguagem, motor, estilo de módulos). Não introduza frameworks novos sem me perguntar.
- Nunca invente números do jogo: se algo conflitar entre GDD e código, me avise e pergunte.

---

# 1. CONTEXTO DO JOGO (extraído dos GDDs — confirme no código)

| Tema | Valor / regra |
|---|---|
| Plataforma | Navegador, 60 FPS, meta de ~50–60 MB de RAM |
| Escala humana | Personagem = **72 px de altura = 1,80 m** → **1 m = 40 px** |
| Tile | 32 a 40 px (≈ 1 m). Use a constante `TILE` que o código já tem |
| Velocidade de caminhada | 185 px/s |
| Chunk | 32×32 tiles = 1.024×1.024 px; só 3×3 ou 5×5 chunks ficam na memória |
| Geração | Procedural determinística por semente (Simplex). Chunks fora da tela são descartados |
| Persistência | Só **mudanças do jogador** são salvas, num mapa esparso por chunk (ex.: árvore cortada vira toco) |
| Mundo | Cilíndrico: a coordenada X dá a volta (`wrapWorldX`). **Estruturas perto da "costura" precisam funcionar** |
| ⚠ Inconsistência no GDD | O GDD cita largura do mundo 6.660.000 px (seção 2.2) e 3.330.000 px (seções 5.1/5.2). Descubra qual valor o código usa e me avise |

**Ganchos de design que o sistema de estruturas deve deixar prontos (não precisa implementar tudo agora):**
- **Construção & Habitação:** casas feitas com madeira (Corte de Madeira), pedra (Mineração) e dobradiças/pregos (Forja). Lotes: pequeno = cabana de madeira, médio = alvenaria, nobre = solar fortificado. → cada estrutura precisa de `material`, `tier`, `hp` e `plotId`.
- **Ladinagem / Força:** portas trancadas podem ser arrombadas (teste D20 + modificador contra uma CD) ou forçadas. Masmorras têm celas com chaves. → cada porta/portão precisa de `lock: { locked, cd, keyId }`.
- **Estilos regionais (sugestão, confirme comigo):** Krasnovar e Njordheim → madeira/tora; Londen-Valoria e Tian-Zhu → pedra; masmorras e prisões → tijolo escuro + grades de ferro; biomas úmidos (selva, Santa Cruz) → pedra com musgo.

---

# 2. OS ASSETS (o que eu já preparei)

```
dungeon_sprites/
├── atlas_game/dungeon_game_atlas.png + .json   ← USE ESTE NO JOGO (já na escala final)
├── sprites_manifest.json                       ← dados de cada sprite (tipo, eixo, escala, âncora…)
├── 1x/ 2x/ 4x/<categoria>/<nome>.png           ← peças individuais (originais limpos e ampliações)
├── atlas/dungeon_atlas_1x|2x.png + .json       ← atlas sem redimensionar (NÃO usar direto no jogo)
├── contact_sheet.png                           ← prévia de todas as 65 peças com os nomes
└── tools/make_game_atlas.py                    ← regenera o atlas para outra altura de parede
```

**Por que existe um "atlas_game"?** As 65 peças foram desenhadas com alturas diferentes entre si (a mesma "parede" varia de ~134 a ~190 px de altura de coluna). O script já aplica **um fator de escala por sprite** para que todas fiquem com a mesma altura de parede (**104 px ≈ 2,6 m**, ~1,4× a altura do personagem). Redimensionar sprite em tempo de execução com fator quebrado (0,58 etc.) distorce os pixels, por isso o atlas já vem pronto: **desenhe com escala 1.**

**Famílias (65 peças):**

| Categoria | Qtd | Exemplos de nome | Observação |
|---|---|---|---|
| `stone_walls` | 20 | `stone_wall_straight_01/02`, `stone_wall_mossy_01..04`, `stone_corner_01..04`, `stone_corner_mossy_01..04`, `stone_wall_broken_01..03`, `stone_wall_ruined_01/02`, `stone_pillar_ruined_01` | Pedra cinza; `mossy` = com musgo |
| `brick_walls` | 11 | `brick_corner_torch_01`, `brick_wall_torch_01`, `dark_brick_wall_window_01`… | Tijolo marrom/escuro; tochas e janelas com grade |
| `wood_walls` | 9 | `wood_wall_panel_01/02`, `wood_corner_cross_01`, `wood_wall_low_01`… | Madeira e taipa (enxaimel) |
| `doors` | 12 | `door_wood_01..07`, `door_wood_ajar_01`, `door_wood_open_01`, `double_door_*` | Portas de madeira e portões monumentais |
| `gates` | 7 | `gate_iron_01..04`, `gate_iron_door_01`, `gate_wood_grate_01`, `fence_iron_spiked_01` | Grades de ferro/madeira (dá para ver através) |
| `arches` | 2 | `arch_stone_01`, `arch_stone_mossy_01` | Vão central livre |
| `ruins` | 4 | `ruin_wall_hole_01`, `ruin_wall_cracked_01`, `ruin_wall_rubble_01`, `ruin_scattered_bricks_01` | Decoração/ruína |

**Cada entrada do `sprites_manifest.json` / do `.json` do atlas tem:**
`kind` (wall, corner_convex, corner_concave, door, gate, fence, arch, pillar, ruin, wall_frontal, double_door_frontal), `axis` (`"x"`, `"y"` ou null), `screenSlope`, `anchor` (pixel do sprite que deve ficar em cima do ponto do chão), `groundLengthPx` (comprimento da peça no chão) e `columnHeightPx`. O manifesto também traz `defaultsByKind` (colisão e bloqueio de visão por tipo) e `conventions`.

## Glossário de orientação (importante)

Os sprites são **isométricos 2:1** (inclinação de 26,565°: a cada 2 px para o lado, 1 px para baixo).
- **Eixo X do mundo** = na tela vai para **baixo-direita**. Uma parede ao longo de X aparece como **`\`**.
- **Eixo Y do mundo** = na tela vai para **baixo-esquerda**. Uma parede ao longo de Y aparece como **`/`**.
- **Quase todas as peças vêm desenhadas como `\`** (eixo X). Para o eixo Y, use a mesma peça com **`flipX`** (a luz inverte, é aceitável).
- **Quina convexa** (`corner_convex`, silhueta em **V**): o canto da frente (sul), com os braços indo para −X e −Y.
- **Quina côncava** (`corner_concave`, silhueta em **^**, só existe `stone_corner_mossy_01`): canto de trás (norte) visto por dentro, braços para +X e +Y.
- **Não existem** sprites de quina leste/oeste: nesses cantos, encontre dois segmentos retos e teste visualmente; se ficar ruim, me avise (eu posso gerar peças novas).
- **Peças "frontais"** (`wall_frontal`: 5 peças; `double_door_frontal`: 3 peças) foram desenhadas de frente para a câmera, sem inclinação. **Não misture com paredes isométricas** sem eu aprovar. Deixe-as catalogadas e fora do uso padrão.
- Só existe **1 porta entreaberta e 1 aberta** (`door_wood_ajar_01`, `door_wood_open_01`), ambas `\`. Para os estados use: `closed` = `door_wood_01..07`; `ajar` = `door_wood_ajar_01`; `open` = `door_wood_open_01`. Faça uma transição curta (~80 ms por quadro).

---

# 3. O QUE ESTÁ ERRADO HOJE (veja o print que anexei)

1. **Escalas inconsistentes:** na fileira da esquerda, um segmento em `/` no meio está bem mais alto (~165 px) que os vizinhos (~115 px).
2. **Paredes baixas demais para o personagem:** o Aventureiro (~75 px) aparece praticamente do tamanho da parede, como se estivesse em cima dela. Parece que os sprites foram reduzidos sem critério.
3. **Ordem de desenho (profundidade) errada:** o personagem se sobrepõe ao topo da parede quando deveria estar atrás ou na frente dela, conforme o lado em que pisa.
4. **Peças soltas no centro:** três "lajes" cinza flutuando, desalinhadas, com símbolos de **círculos pretos repetidos** que não vêm do pacote de sprites. Descubra no código de onde vêm (textura procedural? placeholder?).
5. **Encontros (juntas) mal resolvidos:** há vãos e sobreposições entre segmentos; a torre/portão escuro à direita não encaixa nas paredes vizinhas e parece de outro conjunto de assets.
6. **Sombras avulsas no chão** não acompanham as paredes.

---

# 4. REGRAS TÉCNICAS OBRIGATÓRIAS

## 4.1 Uma única matemática de projeção para tudo
Crie **um** módulo (ex.: `iso.js`) e use-o em jogador, mobs, árvores, estruturas, câmera e mouse. Coordenadas de lógica ficam no **chão** (`wx`, `wy`, em pixels de chão, 1 m = 40 px).

```js
const COS = 0.894427, SIN = 0.447214;       // cos/sin de 26,565° (2:1)
function worldToScreen(wx, wy, wz = 0) {    // wz = altura em px de tela (1:1)
  return { sx: (wx - wy) * COS, sy: (wx + wy) * SIN - wz };
}
function screenToWorld(sx, sy) {            // inverso (para mouse e movimento)
  return { wx: (sx / COS + sy / SIN) / 2, wy: (sy / SIN - sx / COS) / 2 };
}
```
Comprimento no chão de um sprite inclinado = `larguraNaTela / COS` (já calculado como `groundLengthPx`).

> **Pergunta crítica (Fase 0):** hoje o meu terreno e a minha movimentação são isométricos ou ortogonais (visão de cima 3/4)? Os sprites de parede **só ficam corretos numa projeção 2:1**.
> - **Caso A, o mundo já é 2:1:** apenas use o módulo acima.
> - **Caso B, o mundo é ortogonal:** não improvise. Me explique as opções (migrar o mundo para 2:1 mantendo o terreno procedural, ou outra abordagem) com prós e contras e **me deixe escolher** antes de codar. Recomende uma.

## 4.2 Escala e pixel nítido
- Desenhe o atlas com **escala 1**, `ctx.imageSmoothingEnabled = false`, posição **inteira** (`Math.round`) e respeitando `devicePixelRatio`.
- Nunca escale sprite por fator quebrado em tempo de execução. Se precisar de outra altura de parede, regenere: `python3 tools/make_game_atlas.py 120`.
- Antes de decidir a altura (104 px), compare no jogo com o personagem e **me mostre um print**.

## 4.3 Âncora e posicionamento
- Posição de desenho = `worldToScreen(wx, wy)` menos o `anchor` do sprite (já na escala do atlas).
- `wx, wy` = **centro da base (pegada) da peça**. Para encadear segmentos ao longo do eixo: próximo centro = centro atual + `(groundLengthPx_atual + groundLengthPx_proximo) / 2` ao longo de X (ou Y), com um parâmetro `overlap` (0–4 px) para esconder frestas.

## 4.4 Ordenação de desenho e oclusão (a causa do bug nº 3)
- **Nunca** ordene pela base ou pelo topo da imagem. Use a **pegada no chão**.
- Para entidades móveis (jogador, lobo, NPC) contra uma parede **longa**, use a regra do lado:
  - parede no eixo X na linha `wy`: se a entidade está dentro do alcance `[x0−m, x1+m]` (m ≈ 20 px), ela é desenhada **depois** (na frente) se `ent.wy >= wy`, senão **antes** (atrás).
  - parede no eixo Y: o mesmo, comparando `wx`.
  - fora do alcance lateral, ordene por profundidade `wx + wy`.
- Para objetos pequenos (árvores, tocos, baús), a profundidade `wx + wy` do ponto do pé basta.
- Ordene só o que está visível (chunks ativos) e reaproveite o array entre quadros.
- **Opcional (me pergunte):** quando o jogador está atrás de uma parede alta, desenhar uma silhueta dele ou reduzir a opacidade da parede (~40%) perto dele.

## 4.5 Colisão (nunca use a caixa do sprite)
Colisão fica em coordenadas de **chão**:
- `wall`/`fence`: segmento na linha da base, comprimento = `groundLengthPx`, espessura ~14 px (0,35 m).
- `corner_*`: dois segmentos em L com vértice no centro da base.
- `door`/`gate`/`double_door_frontal`: sólida enquanto `closed`; só os batentes quando `open`/`ajar`.
- `arch`: dois pilares laterais; vão central livre.
- `ruin`/`pillar`: base reduzida, ajustável por peça.
- O movimento do jogador é na tela, então converta com `screenToWorld`, teste a colisão no chão e deslize ao longo da parede (não trave).
- `gate`/`fence` bloqueiam movimento mas **não** bloqueiam visão nem projéteis (pergunte-me se houver arco/magia).
- Tudo precisa funcionar **ao cruzar a costura do mundo (wrap de X)**: use distância modular.

## 4.6 Modelo de dados e persistência

```js
Structure = {
  id, type: 'wall' | 'corner' | 'door' | 'gate' | 'fence' | 'arch' | 'ruin',
  style: 'stone' | 'stone_mossy' | 'brick' | 'dark_brick' | 'wood' | 'iron',
  sprite: 'stone_wall_straight_02',      // nome no atlas
  wx, wy,                                 // centro da base (px de chão)
  axis: 'x' | 'y', flipX: false,          // 'y' = usa a peça "\" com flipX
  state: 'closed' | 'ajar' | 'open',
  lock: { locked: false, cd: 0, keyId: null },
  hp: 100, material: 'stone', tier: 1, plotId: null   // ganchos p/ Construção/Habitação
}
```
- Estruturas **geradas** (vilas, ruínas) nascem de funções determinísticas por semente + posição, **sem salvar nada**.
- Salve só o delta do jogador (colocada, destruída, estado da porta, tranca) no mapa esparso por chunk, como o jogo já faz com troncos/tocos.
- Carregar/descarregar estruturas junto com os chunks.

## 4.7 Colocação e variação (sem repetição visível)
- Função `buildWallLine(from, to, style, seed)`: escolhe as peças e as variações (ex.: `mossy`) de forma **determinística** por `hash(seed, posição)`, com chance de musgo ligada à umidade do bioma.
- Resolve as juntas: onde duas linhas se encontram, usa quina convexa/côncava; onde há porta, abre o vão com o comprimento da porta.
- Ferramenta de debug de construção (tecla à escolha): fantasma da peça seguindo o mouse, `R` troca o eixo, `Q/E` troca a variação, clique coloca. Serve para eu testar tudo sem escrever código.

## 4.8 Sombras
Os sprites têm sombra de chão em preto semitransparente só onde fazia parte da arte (arcos, porta aberta). Não desenhe outra sombra por cima; se o jogo tem sombra dinâmica por fuso horário, avalie **depois** da Fase 6 e me proponha.

## 4.9 Performance
- Um único atlas = uma textura. Use `drawImage` com recorte; nada de carregar PNG por peça.
- Meta: 60 FPS com 500+ estruturas visíveis; sem alocações por quadro no laço de render.
- O atlas `game` ocupa ~2048×~640 px (≈5 MB decodificado). Não use o atlas `2x` no jogo (≈46 MB).

---

# 5. MÉTODO DE TRABALHO (siga na ordem)

**Fase 0 — Diagnóstico (NÃO altere código).** Leia GDDs e código e me entregue, numa tabela curta:
1. projeção atual (isométrica ou ortogonal) e valor de `TILE`;
2. como as paredes e portas atuais são carregadas, desenhadas e ordenadas hoje (arquivos e funções);
3. de onde vêm as "lajes com círculos pretos" do print;
4. como funciona a colisão hoje e como os chunks guardam objetos;
5. qual largura de mundo o código usa;
6. riscos e dúvidas (**no máximo 5 perguntas**, cada uma com uma recomendação sua).
→ **Pare e espere meu OK.**

**Fase 1 — Fundação.** Módulo `iso`, carregador do atlas (`atlas_game`), `drawStructure(name, wx, wy, flipX)`, overlay de debug (tecla F3: âncora em vermelho, pegada em ciano, chave de ordenação em número, grade) e uma **cena de teste** (`?scene=structures` ou equivalente) com o catálogo das 65 peças com nomes + um pequeno forte (4 paredes, quinas, porta, portão de ferro, arco, ruína) + jogador e lobo para testar profundidade. → **Checkpoint:** peça-me um print.

**Fase 2 — Render + oclusão** (seção 4.4) usando a cena de teste.

**Fase 3 — Colisão e movimento** (seção 4.5). → **Checkpoint:** eu testo andando em volta.

**Fase 4 — Portas, portões e arcos** com estados, interação (tecla `E`), transição entre quadros, `lock` com mensagem "trancada" e um gancho para o teste D20 (função vazia `tryLockpick(player, door)` que só retorna `false` por enquanto).

**Fase 5 — Colocação, variação determinística e persistência por chunk** (4.6 e 4.7) + ferramenta de debug de construção.

**Fase 6 — Migração.** Troque as paredes antigas do jogo pelo novo sistema, **remova** o código morto e as "lajes com círculos", e atualize os GDDs com uma seção curta "Sistema de Estruturas".

**Em cada fase:** (a) liste os arquivos alterados; (b) explique **o que mudou e por quê** em até 10 linhas, em linguagem simples; (c) diga **exatamente como testar** (teclas, o que olhar); (d) não avance sem eu confirmar nos checkpoints.

---

# 6. CRITÉRIOS DE ACEITE (checklist final)

- [ ] Todas as paredes de uma mesma linha têm a **mesma altura visual** (±2 px) e proporção coerente com o jogador.
- [ ] O jogador anda **atrás** e **na frente** das paredes corretamente, inclusive perto das pontas, sem "pulos" de ordem.
- [ ] Não atravesso paredes, quinas, portas/portões fechados nem pilares do arco; passo pela porta aberta e pelo vão do arco; deslizo ao longo da parede.
- [ ] Tudo isso continua certo **ao cruzar a costura do mundo (wrap de X)**.
- [ ] Portas mudam de estado com `E`; porta trancada avisa e chama o gancho de arrombamento.
- [ ] Nenhum pixel borrado ou irregular (escala 1, posições inteiras).
- [ ] Estruturas colocadas/destruídas/abertas sobrevivem a recarregar a página; as geradas por semente não ocupam espaço no save.
- [ ] 60 FPS com ≥ 500 estruturas visíveis; memória dentro da meta.
- [ ] Sem código morto das paredes antigas; GDD atualizado.

---

# 7. PROIBIDO

- Não carregue um PNG por peça; use o atlas.
- Não escale sprites por fator quebrado em tempo de execução.
- Não ordene pela base/topo da imagem nem use a caixa do sprite como colisão.
- Não use as peças `*_frontal` junto com as isométricas sem minha aprovação.
- Não reescreva sistemas fora do escopo (habilidades, clima, relógio celeste, geração de bioma).
- Não invente sprites nem números do GDD: pergunte.
- Não avance de fase sem eu confirmar nos checkpoints.

**Comece agora pela Fase 0.**

## ===== FIM DO PROMPT =====
