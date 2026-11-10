# Lista de sprites: fauna e flora

Plano completo (quem mora onde e por quê): [`docs/FAUNA_FLORA.md`](../FAUNA_FLORA.md).
Aqui ficam **o padrão técnico**, **o prompt-base do Gemini** e **a lista de sprites por pacote**, para a gente ir marcando.

**Decisões do David:** sem animais na água (mar e rio): peixe, tubarão, golfinho, baleia, foca, morsa, tartaruga e afins **ficam fora**; **ficam** gaivota, garça, pato e caranguejo-de-praia. Sprites **básicos** agora; os **de ataque** vêm depois, bicho a bicho. Fantasia fora.

Regras de sempre: fundo **magenta `#FF00FF`**, **uma folha por pedido**, pegar a imagem com **"Copiar imagem"** (nunca "Baixar no tamanho original"), pelos e folhas em verde chroma só quando for **cabelo/barba de personagem** (animais e plantas usam a cor real).

---

## 1. Padrão técnico

### 1.1 Animal (como o cervo e o lobo que já temos)
- **Uma folha com 4 linhas**, 4 quadros por linha, na ordem:
  1. **Lado esquerdo** (olhando para a esquerda), andando, 4 quadros.
  2. **Frente** (olhando para quem vê), andando, 4 quadros.
  3. **Costas**, andando, 4 quadros.
  4. **Ação**, 4 quadros: herbívoro **pastando/comendo**; predador **ataque** (bote/mordida); ave **bicando** ou **voando** (asas abrindo).
- O **lado direito** o jogo faz espelhando o esquerdo.
- **Tamanho no jogo** (humano = 76 px de altura): **P** 20–35 px · **M** 45–75 px · **G** 90–130 px · **GG** 140–190 px.
- Desenho **básico e limpo**: contorno escuro fino, 3 tons por cor, luz de cima-esquerda, **sem sombra** no chão (o jogo põe), 4 quadros de passo (perna da frente, meio, perna de trás, meio).
- Arquivos: `assets/animals/<especie>_frames/{left,down,up,eat|attack}_{0..3}.png` (o jogo hoje usa esse formato). A folha original fica em `assets/_novas/folha_animal_<especie>.png`.

### 1.2 Árvore
- Uma folha com 5 imagens: **copa cheia** (3 variações de tamanho), **toco** (depois de cortada), **tronco caído**.
- Tamanho: pequena ≈ 180 px de altura, média ≈ 260 px, grande ≈ 340 px (a atual `arvore_game.png` tem 277×320).
- **Sem sombra**, o jogo põe. Visão isométrica 3/4 de cima, como a árvore atual.

### 1.3 Planta pequena (arbusto, frutinha, cogumelo, erva, flor)
- Uma folha com **6 a 8 itens** do mesmo tipo (variações), cada um com **fase "pronta para colher"** e **fase "colhida"**.
- Tamanho 24–48 px.

### 1.4 Cenário de chão
- Uma folha de **12 itens soltos** (capim alto, capim baixo, trevo, samambaia, pedra com musgo, tronco caído, folhas secas, etc.), 24–64 px.

---

## 2. Prompt-base do Gemini (animais)

Anexe sempre uma referência: **`assets/animals/cervo_frames/left_0.png` ampliado** (ou o lobo) como exemplo de estilo, mais o **animal real em foto**, se o Gemini errar a anatomia.

Prompt completo de exemplo (**lebre**). Para outro animal, é só trocar a descrição e o tamanho. Quando você quiser a próxima folha, me peça "prompt da <espécie>" que eu preencho:

```text
Crie UMA folha de sprites de um animal, em pixel art de RPG isométrico, estilo limpo e simples (menos detalhe que um personagem humano), no mesmo estilo do cervo e do lobo anexados.

ANIMAL: lebre europeia adulta. Pelagem marrom-acinzentada, barriga clara, ponta das orelhas preta, cauda curta com ponta preta, olho grande e escuro. Corpo esguio, patas traseiras longas e fortes, orelhas altas.

TAMANHO: cada quadro cabe numa célula de 96 x 96 pixels. A lebre ocupa cerca de 44 pixels de comprimento e 30 de altura, centrada e apoiada na mesma linha do chão em todos os quadros.

LAYOUT: exatamente 4 linhas por 4 colunas = 16 quadros, mesmo tamanho de célula, espaçados de forma uniforme, em grade.
 Linha 1: vista de LADO, olhando para a ESQUERDA, ciclo de corrida/salto em 4 quadros (impulso, voo, aterrissagem, preparação).
 Linha 2: vista de FRENTE, olhando para quem vê, ciclo de pulo em 4 quadros.
 Linha 3: vista de COSTAS, olhando para longe, ciclo de pulo em 4 quadros.
 Linha 4: vista de LADO, olhando para a ESQUERDA, PASTANDO: cabeça baixa mastigando, 4 quadros (cabeça sobe e desce, orelhas mexem).

ESTILO: contorno escuro fino (marrom bem escuro, não preto), 3 tons por cor, luz de cima e da esquerda, cores naturais e quentes. Sem sombra no chão. Sem texto, sem números, sem moldura.

FUNDO: magenta sólido #FF00FF em toda a imagem, sem degradê, sem chão.

O MESMO animal, com as mesmas cores e proporções, em todos os 16 quadros.
```

Variação por tipo (só troque o miolo; o resto é igual):
- **Predador:** linha 4 vira **ataque** (4 quadros: agacha, salta, morde, recua).
- **Ave:** linha 1 anda de lado (4 quadros), linhas 2 e 3 também; linha 4 **voa** (asas para cima, meio, baixo, meio) de lado. Ave voadora também precisa de uma **folha de voo** (4 quadros) de lado, que o jogo usa quando ela sobrevoa.
- **Aquático:** nada de lado (4 quadros), de frente e de costas só se visível; sem linha de passo.
- **Animal grande (G, GG):** células de **160 × 160** em vez de 96, e o animal ocupa a altura que a tabela dá.
- **Animal muito pequeno (P):** células de **64 × 64**.

### Descrição curta de cada espécie (para eu montar os prompts)
**Pacote A (Europa/Elmford)**
| Espécie | Cor e marcas | Tam. |
|---|---|---|
| Lebre | marrom-acinzentada, orelhas altas com ponta preta, cauda preta no topo | P |
| Lince | marrom-amarelado com manchas escuras, tufos pretos nas orelhas, cauda curta, bochechas peludas | M |
| Texugo | cinza-prateado, faixa branca e preta na cabeça, corpo baixo e largo, garras longas | P |
| Esquilo-vermelho | ruivo, barriga branca, cauda enorme e fofa, tufos nas orelhas | P |
| Castor | marrom-escuro, cauda larga e chata, dentes de frente, corpo gordo | P |
| Coruja-das-torres | cara em forma de coração branca, costas douradas e cinza, olhos escuros | P |
| Faisão | macho: cabeça verde-azulada, corpo cobre com manchas, cauda longa | P |
| Pato-real | macho: cabeça verde, anel branco, corpo cinza, peito marrom; fêmea parda | P |
| Galinha / galo | galinha: marrom e branca; galo: crista vermelha, cauda arqueada com penas verdes e douradas | P |
| Vaca | malhada preto e branco (ou marrom), chifres curtos, úbere | G |
| Ovelha | lã branca-suja fofa, cara e patas escuras | M |
| Porco | rosado, orelhas caídas, rabo enrolado | M |
| Cavalo | alazão (marrom-avermelhado), crina e cauda escuras, pernas finas | G |
| Cão (guarda) | pelagem curta marrom e preta, orelhas caídas, porte médio | M |
| Gato | cinza listrado ou preto e branco, cauda erguida | P |
| Cabra | branca e marrom, barbicha, chifres curvos | M |

**Pacote B (Brasil)**
| Espécie | Cor e marcas | Tam. |
|---|---|---|
| Onça-pintada | amarelo-dourado com rosetas pretas, cabeça grande, corpo musculoso | G |
| Capivara | marrom-avermelhada, cabeça quadrada, sem cauda, corpo gordo | M |
| Anta | cinza-escuro, probóscide curta, corpo em formato de barril, faixa clara no focinho | G |
| Queixada | cinza-escuro, queixo e pescoço brancos, pelos eriçados | M |
| Tamanduá-bandeira | cinza com faixa preta e branca no ombro, focinho longo e cauda enorme e peluda | M |
| Preguiça | marrom-acinzentada, pelo felpudo, rosto com máscara escura, garras longas, pendurada | P |
| Macaco-prego | corpo marrom, topete escuro, cara clara, cauda longa | P |
| Tucano | corpo preto, peito amarelo, bico enorme laranja | P |
| Arara-vermelha | vermelho, asas azuis e amarelas, cara branca | P |
| Jacaré | verde-oliva escuro, pele rugosa, focinho largo | G |
| Sucuri | verde-escura com manchas pretas redondas | G |
| Urubu | preto, cabeça nua cinza | M |
| Lobo-guará | alaranjado, pernas longas e pretas, orelhas grandes, crina preta | M |
| Ema | cinza-marrom, pescoço longo e pernas altas, penas desgrenhadas | G |

**Pacote C (frio)**
Alce (marrom-escuro, galhada larga, focinho caído, G) · Rena (marrom-acinzentado, pescoço branco, galhada ramificada, M) · Lebre-da-neve (branca no inverno, P) · Urso-polar (branco-amarelado, GG) · Raposa-do-ártico (branca/cinza-azulada, P) · Coruja-das-neves (branca com pintas escuras, P).

**Pacote D (África e deserto)**
Leão (dourado, juba escura no macho, G) · Elefante (cinza, presas, orelhas grandes, GG) · Girafa (manchas marrom-laranja, GG) · Zebra (listras preto e branco, G) · Gnu (cinza-escuro, barba e crina, M) · Hiena (pelo manchado, costas inclinadas, M) · Rinoceronte (cinza, chifre grande, GG) · Avestruz (macho preto e branco, G) · Crocodilo (verde-escuro, G) · Hipopótamo (cinza-rosado, GG) · Camelo (um corcova, bege, G) · Órix (branco com marcas pretas, chifres retos, M) · Raposa-do-deserto (cor de areia, orelhas enormes, P) · Escorpião (marrom-dourado, P) · Cobra-naja (marrom-claro, capuz aberto, P) · Abutre (marrom-escuro, cabeça nua, G).

---

## 3. Lista de sprites por pacote (marque conforme for ficando pronto)

Legenda: ⭐ = fazer primeiro · ✅ = já existe · 🟦 = temos só os "bloquinhos" feitos por código.

### Pacote A: Europa e vila (Elmford)
**Selvagens**
- [x] Cervo ✅ · [x] Lobo ✅
- [ ] Coelho 🟦 · [ ] Raposa 🟦 · [ ] Javali 🟦 · [ ] Urso-pardo 🟦 · [ ] Corvo 🟦
- [ ] ⭐ Lebre · [ ] ⭐ Lince · [ ] ⭐ Texugo · [ ] ⭐ Esquilo-vermelho · [ ] ⭐ Castor
- [ ] ⭐ Coruja-das-torres · [ ] ⭐ Faisão · [ ] ⭐ Pato-real (e ganso) · 
- [ ] Corço · [ ] Ouriço · [ ] Marta · [ ] Lontra · [ ] Águia/gavião · [ ] Víbora
**Domésticos**
- [ ] ⭐ Galinha e galo · [ ] ⭐ Vaca · [ ] ⭐ Ovelha · [ ] ⭐ Porco · [ ] ⭐ Cavalo · [ ] ⭐ Cão · [ ] ⭐ Gato · [ ] ⭐ Cabra
- [ ] Burro · [ ] Pombo · [ ] Colmeia (abelhas)
**Flora**
- [x] Carvalho ✅ (copa e toco)
- [ ] ⭐ Bétula · [ ] ⭐ Pinheiro · [ ] Faia · [ ] Salgueiro-chorão · [ ] Macieira
- [ ] ⭐ Arbusto de frutinhas (amora, mirtilo) · [ ] ⭐ Cogumelos (comestível e venenoso) · [ ] ⭐ Ervas (camomila, hortelã, sálvia)
- [ ] ⭐ Trigo e cevada (cultivo, 3 fases) · [ ] Batata, cenoura, repolho
- [ ] Flores (papoula, margarida, lavanda) · [ ] Cenário de chão (capim, samambaia, trevo, folhas secas, pedras com musgo)

### Pacote B: Brasil
- [ ] ⭐ Onça-pintada · [ ] ⭐ Capivara · [ ] ⭐ Anta · [ ] ⭐ Queixada · [ ] ⭐ Tamanduá-bandeira
- [ ] ⭐ Preguiça · [ ] ⭐ Macaco-prego · [ ] ⭐ Tucano · [ ] ⭐ Arara · [ ] ⭐ Jacaré · [ ] ⭐ Sucuri · [ ] ⭐ Urubu
- [ ] ⭐ Lobo-guará · [ ] ⭐ Ema · [ ] Tatu · [ ] Harpia
- Domésticos de lá: boi-zebu, galinha caipira, cavalo crioulo
- **Flora:** [ ] Mogno · [ ] Seringueira · [ ] Pau-brasil/Ipê · [ ] Palmeiras (açaí, buriti, coco) · [ ] Araucária · [ ] Bambu · [ ] Mandioca, milho, cana, café (cultivo) · [ ] Frutas (caju, goiaba, banana, manga, pequi, abacaxi) · [ ] Samambaia-gigante, bromélia, vitória-régia

### Pacote C: Frio e polar
- [ ] ⭐ Alce · [ ] ⭐ Rena · [ ] ⭐ Lebre-da-neve · [ ] ⭐ Urso-polar · [ ] ⭐ Raposa-do-ártico
- [ ] ⭐ Coruja-das-neves · [ ] Glutão · [ ] Boi-almiscarado · [ ] ⭐ Pinguim (polo sul, anda em terra/gelo)
- **Flora:** [ ] ⭐ Abeto · [ ] Lariço · [ ] Pinheiro coberto de neve · [ ] Líquen e musgo

### Pacote D: África e deserto
- [ ] ⭐ Leão · [ ] ⭐ Elefante · [ ] ⭐ Girafa · [ ] ⭐ Zebra · [ ] ⭐ Gnu · [ ] ⭐ Hiena · [ ] ⭐ Rinoceronte
- [ ] ⭐ Avestruz · [ ] ⭐ Crocodilo · [ ] ⭐ Hipopótamo · [ ] ⭐ Abutre
- [ ] ⭐ Camelo · [ ] ⭐ Órix · [ ] ⭐ Raposa-do-deserto · [ ] ⭐ Escorpião · [ ] ⭐ Cobra
- **Flora:** [ ] ⭐ Acácia-guarda-chuva · [ ] ⭐ Baobá · [ ] ⭐ Palmeira-tamareira · [ ] ⭐ Cacto · [ ] Capim alto de savana

### Pacotes E a I (depois)
- **E (Ásia):** tigre, panda, iaque, leopardo-das-neves, elefante-asiático, macaco, grou, carpa; bambuzal, cerejeira, ginkgo.
- **F (América do Norte):** bisão, wapiti, urso-negro, grizzly, puma, coiote, águia-de-cabeça-branca, guaxinim, peru, cascavel; sequoia.
- **G (Oceania):** canguru, emu, coala, wombat, dingo, kookaburra, demônio-da-Tasmânia, kiwi; eucalipto.
- **H (Andes e pampas):** lhama, vicunha, condor, guanaco, puma; quenoa.
- **I (margem e costa):** gaivota, garça, martim-pescador, caranguejo-de-praia. (Sem bicho na água.)

---

## 4. Como a gente vai trabalhar

1. Você pede "**prompt da <espécie>**" (ou "o pacote A inteiro").
2. Eu mando o prompt pronto (sem coisa para preencher) e a referência que anexar.
3. Você gera no Gemini e me manda a imagem.
4. Eu corto a folha, tiro o fundo magenta, monto os quadros, ligo no jogo e testo (como fizemos com o cervo e o lobo).
5. Enquanto a arte não chega, os **bloquinhos por código** seguram o lugar.
