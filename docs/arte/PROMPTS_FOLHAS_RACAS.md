# Prompts das folhas do boneco do mapa, por raça

Cada raça tem **3 folhas**. Faça **na ordem** (a 3ª usa a 2ª como referência), uma conversa nova do Gemini por folha, e salve em `assets/_novas/` com o nome indicado.

| Folha | Anexar |
|---|---|
| 1. Parado | `retrato_<raça>.png` + `_ref_parado_silhueta.png` |
| 2. Andar | `retrato_<raça>.png` + `_ref_andar_silhueta.png` |
| 3. Andar diagonal | `retrato_<raça>.png` + a **folha 2 da raça** (`folha_<raça>_andar.png`) |

**Conferir antes de salvar:** mesma roupa (túnica, calça, botas) em todos os quadros, sem armadura; o mesmo personagem do retrato; pelos em verde. O lado das diagonais eu confiro aqui.

---

## Elfo

### 1. `folha_elfo_parado.png`
Anexe: `retrato_elfo.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_elfo_andar.png`
Anexe: `retrato_elfo.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_elfo_andar_diagonal.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Anão

### 1. `folha_anao_parado.png`
Anexe: `retrato_anao.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_anao_andar.png`
Anexe: `retrato_anao.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_anao_andar_diagonal.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Halfling

### 1. `folha_halfling_parado.png`
Anexe: `retrato_halfling.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_halfling_andar.png`
Anexe: `retrato_halfling.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_halfling_andar_diagonal.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Gnomo

### 1. `folha_gnomo_parado.png`
Anexe: `retrato_gnomo.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_gnomo_andar.png`
Anexe: `retrato_gnomo.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_gnomo_andar_diagonal.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Meio-elfo

### 1. `folha_meio_elfo_parado.png`
Anexe: `retrato_meio_elfo.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_meio_elfo_andar.png`
Anexe: `retrato_meio_elfo.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_meio_elfo_andar_diagonal.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Meio-orc

### 1. `folha_meio_orc_parado.png`
Anexe: `retrato_meio_orc.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_meio_orc_andar.png`
Anexe: `retrato_meio_orc.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_meio_orc_andar_diagonal.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Draconato

### 1. `folha_draconato_parado.png`
Anexe: `retrato_draconato.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_draconato_andar.png`
Anexe: `retrato_draconato.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_draconato_andar_diagonal.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

---

## Tiferino

### 1. `folha_tiferino_parado.png`
Anexe: `retrato_tiferino.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

ROUPA (EXATAMENTE a da primeira imagem, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO nas 3 poses e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 2. `folha_tiferino_andar.png`
Anexe: `retrato_tiferino.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO nos 12 quadros e igual à primeira imagem: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

### 3. `folha_tiferino_andar_diagonal.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se afastando e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS (vemos as costas e um pouco do lado esquerdo do rosto), 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada como guia da PASSADA e do tamanho do personagem. O personagem tem que ser IDÊNTICO nos 8 quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo corpo, mesmas proporções, mesmo pixel art.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual à primeira imagem. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números.
```

