# Movimentos por arma (boneco SEM arma)

> **REGRA DE OURO (obrigatória): tudo que se move, e toda ação, existe nas 8 direções** (baixo, cima, esquerda, direita e as 4 diagonais). Desenha-se 5 vistas da esquerda (frente, costas, lado, 3/4 frente, 3/4 costas) e o jogo espelha as 3 da direita. O objetivo é simular 3D com movimento fluido. Veja [REGRA_8_DIRECOES.md](../REGRA_8_DIRECOES.md).


**Regra do Suritto:** toda arma nova começa pelo **movimento**. Primeiro desenhamos o boneco fazendo o golpe
daquela arma, com as mãos vazias e fechadas no cabo invisível. Depois criamos o desenho da arma, e o jogo encaixa
a arma na mão quadro a quadro. Assim cada arma tem um golpe só dela, e qualquer arma nova do mesmo tipo
(outra espada longa, por exemplo) reaproveita o movimento.

Ordem de trabalho: **só o humano** até ficar completo. Depois as outras raças, usando o humano aprovado como guia.

## Como fazer no Gemini (quadro a quadro)

1. Modelo **3.8 Flash**. Uma conversa nova para cada golpe (pode fazer todos os quadros do golpe na mesma conversa).
2. Em todo quadro, anexe: `retrato_humano.png` + `folha_humano_parado.png` (em `assets/_novas/`).
   A partir do quadro 2, anexe também o **quadro anterior já aprovado**: isso mantém o mesmo tamanho e o mesmo lugar dos pés.
3. Cole o prompt do quadro. Se errar, peça de novo na mesma conversa dizendo o que errou.
4. Pegue a imagem com **"Copiar imagem"** (não "Baixar no tamanho original", que borra) e salve em
   `assets/_novas/mov/` com o nome indicado no quadro. Pode também só me mandar aqui na conversa.

**Recuse o quadro se:** aparecer arma ou qualquer objeto na mão; a roupa mudar; o corpo ficar mais magro ou maior;
o cabelo ou a barba não estiverem verde chroma; o boneco estiver olhando para o lado errado; tiver mais de um boneco,
texto, chão, sombra ou rastro de movimento.

## Direções (OBRIGATÓRIO: as 8)

**Todo golpe, de toda arma, precisa existir nas 8 direções.** Desenhamos 5 vistas (todas virando para a ESQUERDA) e o jogo
espelha as 3 da direita, **igual ao andar** (assim a arma fica sempre na mesma mão andando e golpeando):

| Desenhada (vídeo/folha) | Espelhada pelo jogo |
|---|---|
| lado (perfil para a ESQUERDA, 90°) | direita (270°) |
| frente (0°, baixo) | |
| costas (180°, cima) | |
| diagonal de frente para a esquerda (3/4 frente, 45°) | diagonal de frente para a direita (315°) |
| diagonal de costas para a esquerda (3/4 costas, 135°) | diagonal de costas para a direita (225°) |

Ordem de trabalho: **lado, frente, costas e depois as duas diagonais**. Uma arma só está pronta quando as 8 direções funcionam rodando no jogo.
Não vale usar o golpe de lado numa diagonal (aparece sempre apontando para o mesmo canto). Até a arte 3/4 existir, a diagonal usa
a folha de frente/costas, mas fica **anotada como pendência**.

## Catálogo de movimentos

`cabo` = para onde aponta o cabo invisível (a lâmina sai para esse lado), com o boneco olhando para a esquerda.
Eu guardo esse ângulo de cada quadro no jogo, e é ele que gira a arma (não fica mais adivinhando pela mão).

| Arma (jogo) | Movimento | Mãos | Quadros | Ideia do golpe |
|---|---|---|---|---|
| Espada longa (`sword`) | **corte diagonal descendente** | 1 | 7 | ergue atrás da cabeça, dá um passo e corta de cima-trás para baixo-frente |
| Espada curta / gládio | **estocada de quadril** | 1 | 6 | recolhe o punho no quadril e espeta reto na altura da barriga |
| Adaga | **facada rápida** | 1 | 5 | punho no peito, golpe curto e rápido para a frente e para cima |
| Maça | **pancada de cima de um braço** | 1 | 7 | gira o ombro, ergue por cima e desce na vertical com o peso |
| Clava / tacape | **pancada lateral** | 1 | 6 | puxa para trás na altura do ombro e bate de lado, como um taco |
| Clava grande / tacape grande | **pancada por cima do ombro** | 2 | 7 | apoia no ombro, gira o tronco e desce em arco largo |
| Montante (espada de duas mãos) | **corte horizontal largo** | 2 | 8 | gira o quadril, varre na altura da cintura de trás para a frente |
| Machadinha | **machadada curta** | 1 | 6 | ergue até a orelha e desce rápido com o punho |
| Machado de lenhador / machado grande | **machadada de cima** | 2 | 7 | ergue com as duas mãos acima da cabeça e desce na vertical |
| Lança | **estocada de duas mãos** | 2 | 6 | mão de trás empurra, mão da frente guia, passo longo à frente |
| Sem arma | **soco direto** | - | 5 | guarda de punhos, soco reto com o braço de trás |

Os prompts de cada arma ficam abaixo. A espada longa é a **piloto**: só passamos para a próxima arma quando ela estiver aprovada no jogo.


---

## 1. Espada longa: corte diagonal descendente (piloto)

Direção: **lado**, perfil virado para a ESQUERDA. 7 quadros. O jogo repete o quadro 1 no fim (guarda).

| # | Quadro | Cabo | Arquivo |
|---|---|---|---|
| 1 | guarda | cabo para a frente e para cima (45°) | `mov/humano_espada_longa_lado_1.png` |
| 2 | preparo | cabo para cima (80°) | `mov/humano_espada_longa_lado_2.png` |
| 3 | erguido | cabo para trás e para baixo, a lâmina cai nas costas (-150°) | `mov/humano_espada_longa_lado_3.png` |
| 4 | desce | cabo para cima e um pouco para a frente (100°) | `mov/humano_espada_longa_lado_4.png` |
| 5 | impacto | cabo para a frente e um pouco para baixo (-20°) | `mov/humano_espada_longa_lado_5.png` |
| 6 | acompanha | cabo para baixo e para trás (-110°) | `mov/humano_espada_longa_lado_6.png` |
| 7 | volta | cabo para a frente e para cima (30°) | `mov/humano_espada_longa_lado_7.png` |

### Quadro 1: guarda → `mov/humano_espada_longa_lado_1.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png`

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: EM GUARDA, pronto para lutar: pernas um pouco afastadas, pé da frente à frente, joelhos levemente dobrados. O braço mais perto de nós está dobrado na frente da barriga, punho fechado na altura do umbigo, como segurando uma espada apontada para a frente e para cima. O outro braço relaxado ao lado do corpo.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.
```

### Quadro 2: preparo → `mov/humano_espada_longa_lado_2.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_1.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: COMEÇANDO A ERGUER: o tronco gira um pouco para trás, o peso vai para a perna de trás. O braço mais perto de nós sobe, punho fechado na altura do ombro, cotovelo para baixo, como levantando uma espada na vertical.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

### Quadro 3: erguido → `mov/humano_espada_longa_lado_3.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_2.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: ESPADA ERGUIDA ATRÁS DA CABEÇA: o braço mais perto de nós está levantado, cotovelo apontando para cima e para a frente, punho fechado atrás da orelha, como se a lâmina descansasse nas costas. Tronco inclinado para trás, peso na perna de trás. O outro braço vai à frente para equilibrar.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

### Quadro 4: desce → `mov/humano_espada_longa_lado_4.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_3.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: INÍCIO DO CORTE: dá um PASSO À FRENTE com o pé da frente, o tronco vem para a frente. O braço mais perto de nós passa por cima da cabeça, punho fechado acima e à frente da testa, braço quase esticado, como trazendo a espada de cima.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

### Quadro 5: impacto → `mov/humano_espada_longa_lado_5.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_4.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: IMPACTO: corpo inclinado para a frente, joelho da frente bem dobrado, perna de trás esticada. O braço mais perto de nós ESTICADO para a frente na altura do peito, punho fechado, como se a lâmina acertasse o inimigo à frente. O outro braço puxado para trás.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

### Quadro 6: acompanha → `mov/humano_espada_longa_lado_6.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_5.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: ACOMPANHANDO O GOLPE: o braço mais perto de nós continuou descendo e cruzou na frente do corpo, punho fechado perto do joelho da frente, como se a espada terminasse o corte apontando para o chão atrás. Tronco ainda inclinado à frente.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

### Quadro 7: volta → `mov/humano_espada_longa_lado_7.png`
Anexe: `retrato_humano.png` + `folha_humano_parado.png` + `humano_espada_longa_lado_6.png` (o quadro anterior)

```text
Crie UM ÚNICO boneco em PIXEL ART, de PERFIL virado para a ESQUERDA, num quadro de um GOLPE DE ESPADA LONGA COM UMA MÃO (corte diagonal de cima para baixo).

POSE: VOLTANDO À GUARDA: o tronco fica ereto de novo, o pé da frente volta um pouco. O braço mais perto de nós sobe de volta até a frente da barriga, punho fechado, como trazendo a espada de volta para a guarda.

O personagem é o MESMO das imagens anexadas: o humano de túnica bege de manga curta, calça marrom e botas, altura média, cabelo curto arrepiado e barba por fazer. O CORPO tem que ser EXATAMENTE o da folha de parado anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

MÃOS VAZIAS: a mão que segura fica FECHADA como se apertasse o cabo de uma arma invisível. NÃO desenhe arma, cabo, bastão nem objeto nenhum: o jogo coloca a arma depois. Os dedos dobrados e o polegar por cima mostram para onde o cabo invisível aponta.

ROUPA (EXATAMENTE a das imagens anexadas): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Mesmo rosto, mesmo cabelo, mesmo pixel art das imagens anexadas (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras. NADA mais é verde.

Corpo inteiro, nada cortado, com espaço em volta. UM boneco só.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros ou linhas de movimento.

A ÚLTIMA imagem anexada é o QUADRO ANTERIOR deste mesmo golpe: mantenha EXATAMENTE o mesmo tamanho do boneco, o mesmo enquadramento e os pés no mesmo lugar (só muda o que o golpe pede).
```

---

## Próximas armas

Os prompts das outras armas eu escrevo no mesmo formato quando a espada longa estiver aprovada no jogo,
seguindo o catálogo acima (assim aproveitamos o que aprendermos com a piloto).
