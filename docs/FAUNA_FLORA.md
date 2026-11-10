# Suritto: Fauna e Flora (projeto do ecossistema)

Este documento é o plano de **quais animais e plantas existem em cada lugar do mundo**, por que, e o que cada um faz. A lista de **sprites a desenhar** (com prompts do Gemini) está em [`docs/arte/LISTA_SPRITES_FAUNA_FLORA.md`](arte/LISTA_SPRITES_FAUNA_FLORA.md).

Nada aqui muda o código ainda. É o mapa para a gente seguir, pacote por pacote, do jeito que fizemos com o cervo e o lobo.

---

## 0. Decisões do David (valem sobre o resto do documento)

1. **Água é só navegação e pesca.** O mar e o rio **não têm animais** por enquanto: nada de peixe, tubarão, golfinho, baleia, foca, morsa, tartaruga, jacaré nadando etc. como bicho no mapa. A pesca é uma habilidade, sem peixe desenhado na água. **Ficam fora do jogo agora** (e das listas de sprites): toda a seção 3.11 e os animais marinhos de outras seções.
2. **Ficam** as aves e bichos de **costa e beira d'água que andam ou voam em terra**: gaivota, garça, pato, ganso, martim-pescador, caranguejo na praia, urubu etc. Eles pousam na água, mas vivem no ar e na margem.
3. **Dungeons dentro d'água e eventos com bichos aquáticos** ficam para o futuro (arte 2.5D de água com transparência é cara).
4. **Bichos de fantasia ficam de fora do mundo selvagem comum.** Vão ser trabalhados à parte, com uma inteligência maior e comportamento diferente.
5. **Sprites básicos primeiro.** Só andar, parar e pastar/bicar. Os animais que **atacam e revidam** ganham **depois** os sprites de ataque, bicho a bicho.
6. **Animais dão consumíveis** (carne, couro, osso, pena, lã, leite, ovo, mel). É parte central do jogo.
7. **Domesticar existe:** domésticos nas vilas, **PETs**, **montarias** e **animais que ajudam na caça e no combate** (como o caçador do WoW). Cada região de vila tem os animais próprios do lugar.
8. **Caça é uma habilidade própria, separada da Pesca** (como no RuneScape). A Pesca já existe; a Caça é nova.
9. **Ordem de trabalho:** o David deixou livre. Segue o **item 7 (pacotes)** por macro-região e vai testando; ele revisa depois com calma. A região de Elmford é só onde ele caiu por acaso, não é prioridade do mundo.

---

## 1. Ideias que guiam tudo

1. **Mundo real, bichos reais.** O mundo de Suritto é a Terra. Então o lugar define o bicho: lobo e alce no norte frio, leão na savana africana, onça no Brasil, canguru na Oceania. Nada de inventar monstro por enquanto.
2. **O lugar vem de quatro dados que o jogo já tem:**
   - a **macro-região** (fuso + latitude, em `js/regions.js`): Europa, Brasil, África, Oceania...;
   - o **bioma do terreno** (`js/terrain.js`): neve, montanha, colinas, deserto, planície, floresta, floresta densa, cânion, praia, água;
   - a **temperatura** e a **umidade** do ponto (o terreno calcula as duas);
   - o **clima real e a estação do ano** (já ligados: temperatura real, chuva, hemisfério certo).
3. **Cadeia alimentar de verdade.** Planta → herbívoro → predador → carniceiro. Sem plantas, os herbívoros somem; sem herbívoros, o predador some ou ataca a vila. Isso o `js/fauna.js` já faz para 7 espécies: vamos reaproveitar o mesmo motor e só **acrescentar espécies**.
4. **Só os mais importantes.** Não vamos fazer todos os animais do planeta. Por região, escolhemos 10 a 15 espécies que contam a história do lugar (o rei, o predador, a presa comum, o carniceiro, o bicho da fazenda).
5. **Sprite básico.** Animal não precisa do detalhe do humano. Um desenho limpo e fácil de ler, de lado, de frente e de costas, com passo de 4 quadros. É o que o cervo e o lobo já têm.
6. **O bicho também serve ao jogador:** carne, couro, penas, lã, leite, ovos, mel. Isso alimenta sobrevivência, culinária, alfaiataria e comércio entre regiões (como o pau-brasil vendido no Oriente).

---

## 2. Como o jogo decide quem mora onde

Para cada ponto do mapa, nesta ordem:

1. **Reino** (grupo de ecossistema), escolhido por macro-região + temperatura + umidade (tabela abaixo).
2. **Bioma do terreno** filtra dentro do reino (floresta, planície, montanha, água...).
3. **Altitude e água por perto** acrescentam bichos de montanha, de rio, de lago, de costa.
4. **Hora e estação** mudam quem aparece (coruja à noite, urso hiberna no inverno, aves migram).
5. **Clima** mexe no comportamento (chuva forte: muitos se abrigam; frio extremo: some o réptil).

### Reinos (grupos de ecossistema)

| Reino | Onde (macro-região real) | Clima | Bioma típico do jogo |
|---|---|---|---|
| **Temperado** | Ilhas do Oeste, Gália, parte da Europa Oriental, Japão e China temperada, EUA/Canadá do sul | 8–18 °C, chuva o ano todo | floresta, planície, colinas |
| **Boreal (taiga)** | Norte Europeu, Rússia, Canadá, Sibéria | frio longo, neve | floresta fria, colinas |
| **Polar** | Ártico e Antártica | congelante | neve |
| **Mediterrâneo** | Península Ibérica, sul da Europa, Califórnia | verão seco, inverno ameno | colinas, planície seca |
| **Estepe e pradaria** | Leste Europeu, Mongólia, Grandes Planícies da América do Norte | seco, ventoso | planície |
| **Deserto** | Oriente Médio, Saara, Austrália central, Sudoeste dos EUA | quente e seco | deserto, cânion |
| **Savana** | África, parte da Índia | quente com estação das chuvas | planície seca |
| **Tropical úmido** | Brasil (Amazônia, Mata Atlântica), África central, Sul da Ásia, América Central | quente e úmido | floresta densa |
| **Pampas e cerrado** | Sul do Brasil, Argentina, Uruguai, Brasil central | temperado quente, campo | planície |
| **Montanha** | Andes, Himalaia, Alpes, Rochosas | frio com a altitude | montanha, colinas |
| **Oceania** | Austrália e Nova Zelândia | varia | todos |
| **Água (só aves e margem)** | costa, rio e lago de todo lugar | — | água, praia (sem bicho na água) |
| **Doméstico** | vilas e cidades | — | perto de casas |

---

## 3. Bestiário por reino

**Como ler as tabelas**
- **Papel:** 🍃 herbívoro · 🥩 predador · 🦴 carniceiro · 🌰 onívoro · 🐟 aquático · 🐦 ave.
- **Hábito:** foge (`flee`), defende-se se acuado (`defend`), protege território (`territorial`), caça em bando (`pack`) — os mesmos temperamentos do `fauna.js`. Aqui só dizemos o que importa; as contas ficam para quando formos programar.
- **Tam.:** altura aproximada no jogo, tomando o humano como 76 px. **P** ≈ 20–35 px · **M** ≈ 45–75 px · **G** ≈ 90–130 px · **GG** ≈ 140+ px.
- **5e:** criatura equivalente do D&D 5e (SRD) para a ficha de combate, quando existe. **CR** é o nível de desafio.
- ⭐ = essencial (entra no primeiro pacote do reino). ✅ = já existe.

### 3.1 Temperado (Elmford, Europa: o lugar de teste atual)
Cadeia: **bolota, grama, frutinhas → cervo, coelho, javali → raposa, lobo, urso → corvo e carniceiros**.

| Espécie | Papel | Come / é caçado por | Hábito | Tam. | 5e (CR) | |
|---|---|---|---|---|---|---|
| Cervo-vermelho | 🍃 | grama, brotos / lobo, lince | foge, manada | M | Deer (0) | ✅ |
| Corço (cervo pequeno) | 🍃 | brotos / lobo, raposa jovem | foge | M | Deer (0) | |
| Coelho | 🍃 | grama / raposa, coruja, lince | foge | P | — | ✅ (bloquinhos) |
| Lebre | 🍃 | grama / raposa, águia | foge muito rápido | P | — | ⭐ |
| Javali | 🌰 | bolotas, raízes, cogumelos / lobo, urso | defende (investe) | M | Boar (1/4) | ✅ (bloquinhos) |
| Lobo | 🥩 | cervo, javali / (urso) | bando | M | Wolf (1/4) | ✅ |
| Raposa-vermelha | 🥩 | coelho, ovos, frutas / lobo | foge | P | — | ✅ (bloquinhos) |
| Urso-pardo | 🌰 | frutas, peixe, carniça / ninguém | territorial, hiberna no inverno | G | Brown Bear (1) | ✅ (bloquinhos) |
| Lince | 🥩 | lebre, corço / lobo | emboscada, solitário | M | Panther (1/4) | ⭐ |
| Texugo | 🌰 | minhocas, raízes / lobo, urso | defende, noturno | P | — | ⭐ |
| Esquilo-vermelho | 🌰 | nozes, pinhões / coruja, marta | foge para a árvore | P | — | ⭐ |
| Ouriço | 🌰 | insetos / raposa, coruja | encolhe, noturno | P | — | |
| Castor | 🍃 | casca, galhos / lobo, urso | constrói represa no rio | P | — | ⭐ |
| Lontra | 🥩🐟 | peixe / — | rio, brincalhona | P | — | |
| Marta | 🥩 | esquilo, ovos / coruja | árvore, noturna | P | — | |
| Corvo | 🦴🐦 | carcaças, restos | segue o jogador e as carcaças | P | Raven (0) | ✅ (bloquinhos) |
| Coruja-das-torres | 🥩🐦 | ratos, coelhos pequenos | noturna | P | Owl (0) | ⭐ |
| Águia-real / gavião | 🥩🐦 | lebre, coelho | voa em círculos | M | Hawk (0), Giant Eagle (1) | |
| Faisão / perdiz | 🍃🐦 | grãos, sementes / raposa | voa assustado | P | — | ⭐ |
| Pato-real / ganso | 🍃🐦🐟 | plantas aquáticas | lago e rio, migra | P | — | ⭐ |
| Rato / camundongo | 🌰 | grãos / coruja, raposa | perto de celeiros | P | Rat (0) | |
| Cobra-d'água / víbora | 🥩 | rato, sapo | morde se pisada | P | Poisonous Snake (1/8) | |

**Quase extintos / raros** (encontros especiais): **bisão-europeu**, **cavalo selvagem**, **lobo-cinzento branco** no inverno.

### 3.2 Boreal (taiga) e Polar
Cadeia: **líquen, brotos → rena, alce, lebre-da-neve → lince, lobo, urso, glutão**. (Urso e raposa polar caçam na terra e no gelo; sem foca nem peixe no jogo.)

| Espécie | Papel | Come / é caçado por | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|---|
| Alce | 🍃 | brotos, plantas de lago / lobo, urso | defende, macho agressivo no cio | G | Elk (1/4) | ⭐ |
| Rena / caribu | 🍃 | líquen / lobo | manada que migra | M | Elk (1/4) | ⭐ |
| Lebre-da-neve | 🍃 | casca, brotos / lince, raposa | pelo branco no inverno | P | — | ⭐ |
| Lobo-cinzento | 🥩 | alce, rena | bando maior | M | Wolf (1/4), Dire Wolf (1) | ✅ |
| Lince-boreal | 🥩 | lebre | emboscada | M | Panther (1/4) | ⭐ |
| Glutão (carcajou) | 🥩🦴 | carniça, roubo de caça | solitário, feroz | P | — | |
| Urso-pardo | 🌰 | salmão, frutas | hiberna | G | Brown Bear (1) | ✅ |
| Coruja-grande-cinzenta | 🥩🐦 | roedores | noturna | M | Owl (0) | |
| Tetraz / galo-lira | 🍃🐦 | brotos de pinheiro | — | P | — | |
| **Polar:** Urso-polar | 🥩 | foca, peixe | solitário, perigoso | GG | Polar Bear (2) | ⭐ |
| Raposa-do-ártico | 🥩 | lemingues, ovos | pelo branco no inverno | P | — | ⭐ |
| Coruja-das-neves | 🥩🐦 | lemingues, lebres | diurna e noturna | P | Owl (0) | |
| Boi-almiscarado | 🍃 | líquen | forma círculo defensivo | G | — | |
| Pinguim | 🐟🐦 | peixe | só no polo sul | P | — | ⭐ (polo sul) |

### 3.3 Mediterrâneo (Península Ibérica)
| Espécie | Papel | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|
| Cabra-montês / bode | 🍃 | sobe rochas | M | Goat (0) | ⭐ |
| Javali, raposa, coelho, perdiz | (como no temperado) | — | — | — | ⭐ |
| **Lince-ibérico** | 🥩 | emboscada, caça coelho | M | Panther (1/4) | ⭐ |
| **Lobo-ibérico** | 🥩 | bando | M | Wolf (1/4) | |
| Abutre / grifo | 🦴🐦 | circula carcaças | G | Vulture (0) | ⭐ |
| Águia-imperial | 🥩🐦 | — | M | Hawk (0) | |
| Lagarto-ocelado, cegonha | 🥩 / 🐟🐦 | — | P / M | — | |

### 3.4 Estepe e pradaria (Leste Europeu, Mongólia, Grandes Planícies)
| Espécie | Papel | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|
| Cavalo selvagem (tarpan, Przewalski) | 🍃 | manada, coice | G | Riding Horse (1/4) | ⭐ |
| Saiga | 🍃 | manada migratória | M | Deer (0) | |
| Bisão (EUA) | 🍃 | manada enorme, investe | GG | ficha própria (~CR 2) | ⭐ |
| Cachorro-da-pradaria / marmota | 🌰 | toca em colônia | P | — | ⭐ |
| Lobo-da-estepe / coiote (EUA) | 🥩 | bando / sozinho | M | Wolf (1/4), Jackal (0) | ⭐ |
| Raposa-corsac | 🥩 | — | P | — | |
| Águia-das-estepes | 🥩🐦 | — | M | Hawk (0) | |
| Abetarda (ave grande) | 🍃🐦 | corre | M | — | |
| Cascavel | 🥩 | avisa antes de morder | P | Poisonous Snake (1/8) | |

### 3.5 Deserto
| Espécie | Papel | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|
| Camelo | 🍃 | montaria, carga, guarda água | G | Camel (1/8) | ⭐ |
| Órix / gazela | 🍃 | foge rápido | M | Deer (0) | ⭐ |
| Raposa-do-deserto (fenec) | 🥩 | noturna | P | — | ⭐ |
| Chacal / hiena | 🦴🥩 | bando, noturno | M | Jackal (0), Hyena (1/2) | ⭐ |
| Escorpião | 🥩 | emboscada, veneno | P | Scorpion (0); o gigante é Giant Scorpion (3) | ⭐ |
| Cobra (naja, víbora) | 🥩 | veneno | P | Poisonous Snake (1/8) | ⭐ |
| Lagarto / varano | 🥩 | — | P / M | — | |
| Abutre | 🦴🐦 | — | G | Vulture (0) | ⭐ |
| Cachorro-do-mato (dingo na Austrália) | 🥩 | bando | M | Jackal (0) | |

### 3.6 Savana (África)
Cadeia: **capim e acácia → zebra, gnu, gazela, elefante, girafa → leão, hiena, leopardo, crocodilo → abutres**.

| Espécie | Papel | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|
| Zebra | 🍃 | manada, coice | M | Riding Horse (1/4) | ⭐ |
| Gnu | 🍃 | manada migratória | M | Elk (1/4) | ⭐ |
| Gazela | 🍃 | muito rápida | M | Deer (0) | |
| Girafa | 🍃 | alta, chuta | GG | Giraffe (1/2) | ⭐ |
| Elefante | 🍃 | manada, destrói árvores, investe | GG | Elephant (4) | ⭐ |
| Rinoceronte | 🍃 | territorial, investe | G | Rhinoceros (2) | ⭐ |
| Búfalo-africano | 🍃 | manada perigosa | G | ficha própria (~CR 2) | |
| Javali-africano (facóquero) | 🌰 | foge de rabo em pé | M | Boar (1/4) | |
| Avestruz | 🍃🐦 | corre, chuta | G | Axe Beak (1/4) | ⭐ |
| **Leão** | 🥩 | leoa caça, macho protege | G | Lion (1) | ⭐ |
| Leopardo | 🥩 | sobe em árvore, solitário | M | Panther (1/4), Leopard | ⭐ |
| Hiena | 🦴🥩 | bando, noturna | M | Hyena (0) | ⭐ |
| Crocodilo | 🥩🐟 | emboscada na água | G | Crocodile (1/2) | ⭐ |
| Hipopótamo | 🍃🐟 | territorial no rio, muito perigoso | GG | Hippopotamus (2) | ⭐ |
| Abutre | 🦴🐦 | carcaças | G | Vulture (0) | ⭐ |

### 3.7 Tropical úmido (Brasil, Sul da Ásia, África central, América Central)
Cadeia: **frutas e folhas → anta, queixada, macaco, capivara → onça, sucuri, jacaré → urubus**.

**Brasil (Terras de Santa Cruz)**
| Espécie | Papel | Hábito | Tam. | 5e | |
|---|---|---|---|---|---|
| **Onça-pintada** | 🥩 | solitária, emboscada, nada | G | ficha própria (~CR 1/2), entre Panther e Tiger | ⭐ |
| Anta | 🍃 | foge para a água | G | Boar (1/4) | ⭐ |
| Capivara | 🍃🐟 | grupo em rio e lago | M | — | ⭐ |
| Queixada / cateto | 🌰 | bando, agressivo | M | Boar (1/4) | ⭐ |
| Veado-mateiro / campeiro | 🍃 | foge | M | Deer (0) | |
| Tamanduá-bandeira | 🥩 | cupins, defende com garras | M | — | ⭐ |
| Tatu | 🌰 | cava, bola | P | — | |
| Preguiça | 🍃 | lenta, na árvore | P | — | ⭐ |
| Macaco-prego / bugio | 🍃🌰 | grupo, atira frutas | P | Ape (1/2) | ⭐ |
| Tucano / arara | 🍃🐦 | bando colorido | P | — | ⭐ |
| Harpia | 🥩🐦 | caça macaco | M | Giant Eagle (1) | |
| Sucuri | 🥩🐟 | emboscada na água | G | Constrictor Snake (1/4), Giant (2) | ⭐ |
| Jacaré / jacaré-açu | 🥩🐟 | emboscada | M / G | Crocodile (1/2) | ⭐ |
| Pirarucu / piranha | 🐟 | piranha em cardume | P / M | — | |
| Urubu | 🦴🐦 | carcaças | M | Vulture (0) | ⭐ |
| **Cerrado e pampas:** Lobo-guará | 🌰 | solitário, come lobeira | M | Jackal (0) | ⭐ |
| Ema | 🍃🐦 | corre | M | — | ⭐ |
| Seriema, quero-quero | 🥩🐦 / 🐦 | alarma | P | — | |
| Cervo-do-pantanal, Tuiuiú, ariranha | | Pantanal | — | — | |

**Ásia tropical:** tigre (G, Tiger 1), elefante-asiático (GG, Elephant 4), orangotango (M, Ape 1/2), macaco-rhesus, rinoceronte-indiano, píton-reticulada (Giant Constrictor 2), pavão, búfalo-d'água, gaur, cobra-real, tigre-d'água/jacaré-de-água-salgada, **panda-vermelho** e **panda-gigante** (bambuzais da China, não agressivo).

**África central:** gorila (G, Ape → gorilla), chimpanzé, okapi, elefante-da-floresta, leopardo, píton.

### 3.8 Montanha
| Espécie | Onde | Papel | Tam. | 5e | |
|---|---|---|---|---|---|
| Cabra-montesa / íbex | Alpes, Pirineus | 🍃 | M | Goat (0) | ⭐ |
| Camurça, marmota | Alpes | 🍃 / 🌰 | P / M | — | |
| Lhama, alpaca, vicunha, guanaco | Andes | 🍃 | M | Camel (1/8) | ⭐ |
| Condor | Andes | 🦴🐦 | G | Giant Eagle (1) | ⭐ |
| Chinchila, viscacha | Andes | 🍃 | P | — | |
| Iaque | Himalaia | 🍃 | G | ficha própria (~CR 2) | ⭐ |
| Leopardo-das-neves | Himalaia | 🥩 | M | Panther (1/4) | ⭐ |
| Bode-selvagem, tahr | Himalaia | 🍃 | M | Goat (0) | |
| Urso-negro-asiático | Ásia | 🌰 | G | Black Bear (1/2) | |
| Puma | Américas | 🥩 | M | Panther (1/4) | ⭐ |
| Águia-real | todas | 🥩🐦 | M | Hawk (0) | |

### 3.9 América do Norte (mistura)
Boreal no norte, **bisão e coiote** nas planícies, **urso-negro** e **puma** nas rochosas, **jacaré** na Flórida.
Espécies próprias: **alce-americano (wapiti)**, **urso-grizzly**, **urso-negro**, **puma**, **coiote**, **guaxinim**, **peru-selvagem**, **águia-de-cabeça-branca**, **castor**, **gambá**, **veado-de-cauda-branca**, **cascavel**, **jacaré-americano**.

### 3.10 Oceania
| Espécie | Papel | Tam. | |
|---|---|---|---|
| **Canguru** (vermelho e cinza) | 🍃, salta, chuta | G | ⭐ |
| **Emu** | 🍃🐦, corre | G | ⭐ |
| **Coala** | 🍃, na árvore de eucalipto | P | ⭐ |
| **Wombat** | 🍃, cava | P | |
| **Dingo** | 🥩, bando | M | ⭐ |
| **Demônio-da-Tasmânia** | 🦴🥩, ruidoso | P | |
| **Kookaburra, cacatua** | 🐦 | P | ⭐ |
| **Crocodilo-de-água-salgada** | 🥩, mais perigoso | GG | ⭐ |
| **Ornitorrinco** | 🐟, raro | P | |
| **Nova Zelândia:** kiwi (não voa), moa extinta (só lenda) | | P / GG | |

### 3.11 Água: **fora do jogo por enquanto** (decisão do David)
A tabela abaixo fica só como arquivo para o futuro. **Mantemos apenas** gaivota, garça, martim-pescador, pato, ganso e caranguejo-de-praia.
| Espécie | Onde | Papel | Tam. | |
|---|---|---|---|---|
| Peixes comuns (truta, carpa, bagre, salmão, tilápia, pirarucu) | rio e lago | 🐟 | P | ⭐ (pesca) |
| Caranguejo, siri | praia | 🦴 | P | ⭐ |
| Gaivota | costa | 🦴🐦 | P | ⭐ |
| Tartaruga-marinha | mar quente | 🐟 | M | |
| Golfinho | mar | 🐟 | M | |
| Foca / leão-marinho | costa fria | 🐟 | M | ⭐ |
| Tubarão | mar | 🥩 | G | ⭐ (perigo) |
| Baleia | mar aberto | 🐟 | GG | ⭐ (espetáculo) |
| Polvo, água-viva | mar | 🥩 | P | |
| Garça, martim-pescador | rio | 🐟🐦 | P | |

### 3.12 Doméstico (vilas e cidades)
Sem eles, a vila parece vazia. **Todos em todas as regiões** (só a raça muda: ex. iaque no Himalaia, lhama nos Andes, camelo no deserto, boi-zebu no Brasil).

| Espécie | Serve para |
|---|---|
| Galinha, galo, pinto | ovo, carne, penas |
| Vaca / boi | leite, carne, couro, tração |
| Ovelha | lã, carne |
| Cabra | leite, carne |
| Porco | carne, bolota na floresta |
| Cavalo | montaria, carroça |
| Burro / mula | carga |
| Cão (mastim, pastor, caça) | guarda, caça, companhia |
| Gato | afugenta rato |
| Pato, ganso | ovo, carne, penas |
| Pombo | mensageiro |
| Abelha (colmeia) | mel, cera |

---

## 4. Como o tempo, o clima e a estação mexem nos bichos

| Condição | O que acontece |
|---|---|
| **Noite** | Coruja, texugo, hiena, raposa-do-deserto, lince, lobo ficam mais ativos. Coelho, cervo, galinha dormem. |
| **Madrugada e entardecer** | Herbívoros pastam, predadores rondam (hora de maior risco). |
| **Chuva forte** | Aves e pequenos se abrigam. Anfíbios, caracóis, minhocas aparecem. Rastros somem (predador perde o cheiro). |
| **Tempestade** | A maioria se esconde. Gado e cavalo ficam inquietos. |
| **Neve e frio** | Urso hiberna (some da superfície). Lebre e raposa trocam para o pelo branco no polo. Répteis somem. Lobo desce para perto de vilas. |
| **Calor extremo** | Animais de clima frio recuam para a sombra, a água ou a altitude. |
| **Estação (já por hemisfério)** | **Primavera:** filhotes, ninhos, ovos. **Verão:** fartura, bichos mais gordos. **Outono:** frutas e castanhas, javali e urso engordam, aves migram. **Inverno:** escassez, predador mais ousado. |
| **Migração** | Rena, gnu, aves, salmão e baleia têm rota anual, ligada à estação e à região. |

**Frutas e comida** aparecem conforme a estação e a temperatura reais. Isso controla a fome dos herbívoros e, por consequência, dos predadores.

---

## 5. Flora

### 5.1 Árvores (ligadas à tabela de corte de madeira)
Já definidas em `GDD_PLANETA_CARTOGRAFIA_E_BIOMAS.md` seção 4. Aqui só dizemos **onde** cada uma nasce e **que tipo de desenho** precisa. Cada árvore precisa de: **copa cheia**, **toco** (depois de cortada) e, se possível, **tronco caído**.

| Reino | Árvores (⭐ essencial) |
|---|---|
| Temperado | ⭐ Carvalho (nível 1), ⭐ Bétula (20), Faia, Castanheiro, Tília, Freixo (70), Salgueiro-chorão (10) na beira de rio, Macieira e Cerejeira silvestres (frutíferas) |
| Boreal | ⭐ Pinheiro nórdico (35), ⭐ Abeto, Lariço (55), Bétula |
| Mediterrâneo | ⭐ Oliveira, ⭐ Sobreiro (cortiça), Pinheiro-manso, Cipreste |
| Estepe | poucas: bétula esparsa, salgueiro na água. Quase tudo é capim alto |
| Deserto | ⭐ Palmeira-tamareira (oásis), Acácia seca, ⭐ Cacto |
| Savana | ⭐ Acácia-guarda-chuva, ⭐ Baobá (75), Capim alto |
| Tropical úmido | ⭐ Mogno (65), ⭐ Seringueira (40), ⭐ Pau-brasil/Ipê (30), Palmeira (açaí, buriti, coco), Samambaia-gigante, Bambu (5), Mangue (costa) |
| Pampas e cerrado | ⭐ Araucária (85, só no sul planalto), Ipê-amarelo, Pequi, capim e arbusto torto |
| Montanha | Pinheiro anão, Abeto, Rododendro, Líquen; Andes: Queñoa |
| Ásia temperada | ⭐ Bambuzal (5), ⭐ Cerejeira em flor (15), Ginkgo (60), Bordo |
| Oceania | ⭐ Eucalipto, Banksia, Samambaia-arbórea |
| Polar | quase nada: líquen, musgo |
| Lendárias | Sequoia (90, vale escondido), Yggdrasil (99, centro do mundo) |

### 5.2 Plantas de comida, remédio e uso (colher com [F])
| Tipo | Exemplos | Onde | Para quê |
|---|---|---|---|
| **Frutinhas** (já existe arbusto) | amora, mirtilo, framboesa, morango-silvestre | temperado, boreal | comida, urso e raposa também comem |
| **Cogumelos** (já existe) | cantarelo, porcini, champignon; **venenoso**: agário-das-moscas | floresta úmida | comida / veneno |
| **Frutas de árvore** | maçã, pera, cereja, figo, azeitona, laranja, manga, banana, coco, açaí, caju, pequi | por clima | comida, vinho, óleo |
| **Castanhas e sementes** | bolota, castanha, noz, avelã, pinhão (araucária), amêndoa | floresta | javali, esquilo, humano |
| **Ervas medicinais** | camomila, hortelã, sálvia, alecrim, arnica, erva-cidreira, guaco, boldo | por região | poções, chás |
| **Cultivo (fazenda)** | trigo, cevada, centeio, milho, batata, cenoura, repolho, arroz, mandioca, cana-de-açúcar, café, uva, algodão | vilas | comida, comércio, bebida |
| **Fibras e tinta** | linho, algodão, cânhamo; anil, garança, pau-brasil | por região | roupa, tinta |
| **Mel e cera** | colmeia na árvore | floresta | comida, vela |
| **Flores e decoração** | margarida, papoula, lavanda, tulipa, ipê florido, cerejeira | por região | enfeite do mapa, perfume |
| **Plantas perigosas** | urtiga, cicuta, beladona, hera-venenosa | pântano, mata | veneno, dano |

### 5.3 Chão e cenário (só visual, deixa o mapa vivo)
Capim alto e baixo, trevo, samambaia, musgo, líquen, pedras com musgo, tronco caído, folhas secas (outono), neve no chão (inverno), cogumelos soltos, juncos e vitórias-régias na beira d'água, cactos pequenos, dunas, ossos no deserto.

---

## 6. Perigos e riqueza para o jogador

- **Predador grande** (urso, leão, onça, tigre, polar) só **ataca se o jogador invadir o território** ou se estiver com fome e ferido. Sempre dá aviso (rugido, postura).
- **Veneno** (cobra, escorpião, aranha) só fere se pisarem ou chegarem perto; o sprite precisa ser pequeno e discreto (de propósito).
- **Recompensa por caça:** carne (comida), couro e peles (roupas, mochila), ossos e dentes (ferramentas, enfeites), penas (flechas), lã, leite, ovos.
- **Domesticar:** ovelha, vaca, porco e galinha desde cedo; cavalo, camelo, lhama, cão e falcão mais tarde.
- **Pesca** vira habilidade (peixes por rio, lago e mar).

---

## 7. Plano de trabalho (pacotes)

Cada pacote entrega **a lista de sprites + o motor com as espécies novas na região**. Os sprites vão sendo feitos no Gemini aos poucos; enquanto a arte não chega, o jogo desenha **bloquinhos por código** (como já fazemos com coelho, raposa, javali, urso e corvo).

| Pacote | Região | Espécies novas (essenciais) |
|---|---|---|
| **A. Elmford** | Europa temperada + vila | lebre, lince, texugo, esquilo, castor, coruja, faisão, pato, truta; **domésticos**: galinha, vaca, ovelha, porco, cavalo, cão, gato, cabra |
| **B. Brasil** | Terras de Santa Cruz | onça-pintada, capivara, anta, queixada, tamanduá, preguiça, macaco-prego, tucano, arara, jacaré, sucuri, urubu, lobo-guará, ema |
| **C. Frio** | Boreal + polar | alce, rena, lebre-da-neve, urso-polar, raposa-do-ártico, foca, morsa, coruja-das-neves, salmão |
| **D. África e deserto** | Savana e deserto | leão, elefante, girafa, zebra, gnu, hiena, rinoceronte, avestruz, crocodilo, hipopótamo, camelo, órix, escorpião, cobra, abutre |
| **E. Ásia** | Ásia | tigre, panda, iaque, leopardo-das-neves, elefante-asiático, macaco, grou, carpa |
| **F. América do Norte** | EUA e Canadá | bisão, wapiti, urso-negro, grizzly, puma, coiote, águia-de-cabeça-branca, guaxinim, peru, cascavel |
| **G. Oceania** | Austrália e Nova Zelândia | canguru, emu, coala, wombat, dingo, kookaburra, demônio-da-Tasmânia, kiwi |
| **H. Andes e pampas** | América do Sul | lhama, vicunha, condor, guanaco, puma, ema |
| **I. Margem e costa** | todos os lugares | gaivota, garça, martim-pescador, caranguejo-de-praia |

**Andamento (atualizado):**
- ✅ **Mecanismo de reinos no código** (`js/fauna.js`): cada espécie pode ter `macros` (as macro-regiões onde vive). Fora delas, não nasce nem migra para lá. As 7 espécies antigas ainda vivem em qualquer lugar (temporário, até cada região ganhar os seus bichos).
- ✅ **Pacote A, primeira leva (selvagens da Europa):** lebre, texugo, esquilo-vermelho, faisão e lince, já no ecossistema (comem, se reproduzem, são caçados; raposa, lobo e lince agora também caçam lebre e faisão). Desenhados por código (bloquinhos) até a arte chegar. Só aparecem em Ilhas do Oeste, Gália, Norte Europeu, Leste Europeu e Ibéria (a lebre e o faisão também na China, no Japão e na América do Norte).
- ✅ **Domésticos da vila** (`js/domestic.js`): galinha, vaca, ovelha, porco, cavalo, cabra, cão e gato (bloquinhos). Vivem em volta do centro da vila, andam devagar, não fogem do jogador (só correm se apanharem), voltam para a vila se passam do limite e são repostos quando o jogador chega perto. Dá para golpear, deixam carcaça e dão experiência. Por enquanto toda macro-região usa o mesmo grupo europeu; as raças locais entram depois.
- ⏳ Falta no pacote A: coruja, pato e castor (ficam na margem, sem entrar na água) e as plantas (bétula, pinheiro, ervas, cultivos).

**Sugestão de ordem:** **A** (onde o jogo roda hoje) → **B** (a sua região) → **C** → **D** → o resto.

**Para o código (quando chegar a hora):** as fichas de espécie em `js/fauna.js` ganham um campo `reinos` (e opcionalmente `macro`), o sorteio de quem aparece usa **macro-região + bioma + temperatura + hora + estação**, e as populações por região seguem iguais.

---

## 8. Perguntas que já foram respondidas

1. **Fantasia:** fora do mundo comum, tratada à parte com inteligência maior.
2. **Domésticos:** existem, nas vilas (os próprios de cada região). Dá para **domar** para virar PET, montaria ou ajudante de caça.
3. **Domar selvagem:** sim, com habilidade (inspirado no caçador do WoW).
4. **Caça e pesca:** a Pesca já é habilidade; a **Caça** será outra, separada.
