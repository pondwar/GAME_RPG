# Prompts de TODAS as folhas do boneco do mapa

> **REGRA DE OURO (obrigatória): tudo que se move, e toda ação, existe nas 8 direções** (baixo, cima, esquerda, direita e as 4 diagonais). Desenha-se 5 vistas da esquerda (frente, costas, lado, 3/4 frente, 3/4 costas) e o jogo espelha as 3 da direita. O objetivo é simular 3D com movimento fluido. Veja [REGRA_8_DIRECOES.md](../REGRA_8_DIRECOES.md).


Cada raça tem **10 folhas**. Faça **na ordem**: a folha **1 (Andar)** é a referência de corpo de todas as outras, então ela vem primeiro e vai anexada nas seguintes. Uma conversa nova do Gemini por folha; salve em `assets/_novas/` com o nome indicado.

| # | Folha | Anexar |
|---|---|---|
| 1 | Andar | `retrato_<raça>.png` + `_ref_andar_silhueta.png` |
| 2 | Parado | `retrato_<raça>.png` + `folha_<raça>_andar.png` + `_ref_parado_silhueta.png` |
| 3 | Andar diagonal | `retrato_<raça>.png` + `folha_<raça>_andar.png` |
| 4–10 | Ações (pular, sentar, abaixar, espada, soco, machado, chute) | `retrato_<raça>.png` + `folha_<raça>_andar.png` + a silhueta da ação (o chute não tem) |

**Conferir antes de salvar:**
- a mesma roupa (túnica, calça, botas) em todos os bonecos, sem armadura;
- o mesmo personagem e o **mesmo corpo** da folha de andar (nem mais magro, nem maior);
- os pelos em verde chroma;
- a quantidade certa de bonecos;
- na diagonal, a **2ª linha de COSTAS** (vemos a nuca);
- nas ações de espada e machado, **nenhuma arma desenhada**.
O lado para onde cada linha olha eu confiro e corrijo aqui.

Nas folhas de ação, o **primeiro boneco** é ele de pé, de perfil: é a **régua de tamanho** e eu descarto depois.

---

## Humano

### 1. Andar: `folha_humano_andar.png`
Anexe: `retrato_humano.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_humano_parado.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_humano_andar_diagonal.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_humano_pular.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_humano_sentar.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_humano_abaixar.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_humano_espada.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_humano_soco.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_humano_machado.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_humano_chute.png`
Anexe: `retrato_humano.png` + `folha_humano_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o humano de túnica bege de manga curta, calça marrom e botas: altura média, cabelo curto arrepiado e barba por fazer), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA por fazer são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Elfo

### 1. Andar: `folha_elfo_andar.png`
Anexe: `retrato_elfo.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_elfo_parado.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_elfo_andar_diagonal.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_elfo_pular.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_elfo_sentar.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_elfo_abaixar.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_elfo_espada.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_elfo_soco.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_elfo_machado.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_elfo_chute.png`
Anexe: `retrato_elfo.png` + `folha_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o elfo de túnica bege de manga curta, calça marrom e botas: alto e esguio, rosto fino, orelhas longas e pontudas, olhos azuis, cabelo comprido preso em rabo de cavalo, sem barba), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO (com o rabo de cavalo) e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Anão

### 1. Andar: `folha_anao_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_anao_parado.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_anao_andar_diagonal.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_anao_pular.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_anao_sentar.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_anao_abaixar.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_anao_espada.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_anao_soco.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_anao_machado.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_anao_chute.png`
Anexe: `retrato_anao.png` + `folha_anao_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o anão de túnica bege de manga curta, calça marrom e botas: BAIXO e largo, ombros fortes, nariz grande, cabelo preso em rabo curto e barba cheia), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BAIXO e atarracado: mantenha as proporções de anão (pernas curtas, tronco largo) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Halfling

### 1. Andar: `folha_halfling_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_halfling_parado.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_halfling_andar_diagonal.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_halfling_pular.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_halfling_sentar.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_halfling_abaixar.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_halfling_espada.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_halfling_soco.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_halfling_machado.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_halfling_chute.png`
Anexe: `retrato_halfling.png` + `folha_halfling_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o halfling de túnica bege de manga curta e calça marrom dobrada no tornozelo: BEM BAIXINHO e rechonchudo, bochechas redondas, cabelo cacheado, DESCALÇO com pés grandes e peludos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; calça dobrada acima do tornozelo e PÉS DESCALÇOS.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é BEM BAIXINHO e anda DESCALÇO: mantenha os pés grandes e peludos (sem botas) em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e os PELOS DOS PÉS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Gnomo

### 1. Andar: `folha_gnomo_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_gnomo_parado.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_gnomo_andar_diagonal.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_gnomo_pular.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_gnomo_sentar.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_gnomo_abaixar.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_gnomo_espada.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_gnomo_soco.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_gnomo_machado.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_gnomo_chute.png`
Anexe: `retrato_gnomo.png` + `folha_gnomo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o gnomo de túnica bege de manga curta, calça marrom e botinhas: MUITO BAIXINHO, cabeça grande, nariz grande e redondo, orelhas grandes e pontudas, cabelo espetado, bigode e cavanhaque), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botinhas de couro marrom, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

Ele é MUITO BAIXINHO com a cabeça grande: mantenha as proporções de gnomo em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS, o BIGODE e o CAVANHAQUE são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Meio-elfo

### 1. Andar: `folha_meio_elfo_andar.png`
Anexe: `retrato_meio_elfo.png` + `_ref_andar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem da PRIMEIRA imagem anexada (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa grade de 3 LINHAS por 4 COLUNAS: 12 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

A SEGUNDA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE, o ÂNGULO e a PASSADA de cada quadro, na mesma posição da grade (as proporções do corpo vêm da primeira imagem). Ela não tem roupa nenhuma.
- LINHA 1: andando DE FRENTE (vindo na nossa direção), 4 passos.
- LINHA 2: andando DE COSTAS (indo para longe), 4 passos.
- LINHA 3: andando DE PERFIL para a ESQUERDA, 4 passos, braços e pernas alternando.

ROUPA (EXATAMENTE a da primeira imagem, igual nos 12 quadros): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_meio_elfo_parado.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_meio_elfo_andar_diagonal.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_meio_elfo_pular.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_meio_elfo_sentar.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_meio_elfo_abaixar.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_meio_elfo_espada.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_meio_elfo_soco.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_meio_elfo_machado.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_meio_elfo_chute.png`
Anexe: `retrato_meio_elfo.png` + `folha_meio_elfo_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-elfo de túnica bege de manga curta, calça marrom e botas: altura de humano, rosto suave, orelhas meio pontudas, cabelo ondulado e barba cheia curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Meio-orc

### 1. Andar: `folha_meio_orc_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_meio_orc_parado.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_meio_orc_andar_diagonal.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_meio_orc_pular.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_meio_orc_sentar.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_meio_orc_abaixar.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_meio_orc_espada.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_meio_orc_soco.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_meio_orc_machado.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_meio_orc_chute.png`
Anexe: `retrato_meio_orc.png` + `folha_meio_orc_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o meio-orc de túnica bege de manga curta, calça marrom e botas: GRANDE e musculoso, ombros muito largos, PELE CINZA-AZULADA, presas inferiores cor de marfim, rabo de cavalo com laterais raspadas e barba curta), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA em tudo (rosto, braços, mãos), SEM nenhum tom de verde, e o corpo é grande e bruto em todos os quadros.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO, as SOBRANCELHAS e a BARBA são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Draconato

### 1. Andar: `folha_draconato_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_draconato_parado.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_draconato_andar_diagonal.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_draconato_pular.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_draconato_sentar.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_draconato_abaixar.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_draconato_espada.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_draconato_soco.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_draconato_machado.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_draconato_chute.png`
Anexe: `retrato_draconato.png` + `folha_draconato_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o draconato de túnica bege de manga curta, calça marrom e botas: humanoide com CABEÇA DE DRAGÃO (focinho comprido), ESCAMAS CINZA-AZULADAS, garras curtas nas mãos, chifres curvos e crista de espinhos), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

As escamas são CINZA-AZULADAS em tudo, SEM nenhum tom de verde. Sem cabelo, sem barba, sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: os CHIFRES e a CRISTA de espinhos são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

---

## Tiferino

### 1. Andar: `folha_tiferino_andar.png`
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

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda). O corpo tem as mesmas proporções da primeira imagem. Só mudam braços e pernas da passada.

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 2. Parado: `folha_tiferino_parado.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_parado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), desenhado 3 vezes lado a lado numa única linha, todas do mesmo tamanho e com os pés na mesma altura.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE e o ÂNGULO de cada boneco. Ela não tem roupa nenhuma.
1) DE FRENTE, parado, braços relaxados ao lado do corpo.
2) DE COSTAS, parado (vemos a nuca e as costas da túnica).
3) DE PERFIL virado para a ESQUERDA, parado.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual nas 3 poses): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 3. Andar diagonal: `folha_tiferino_andar_diagonal.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa grade de 2 LINHAS por 4 COLUNAS: 8 quadros de animação de ANDAR, todos do mesmo tamanho e alinhados pelos pés.

- LINHA 1: andando na DIAGONAL vindo na nossa direção e indo para a ESQUERDA, em TRÊS QUARTOS DE FRENTE (vemos o rosto quase todo e um pouco do lado do corpo), 4 passos com braços e pernas alternando.
- LINHA 2: andando na DIAGONAL se AFASTANDO e indo para a ESQUERDA, em TRÊS QUARTOS DE COSTAS: vemos as COSTAS, a NUCA e só um pouco do lado esquerdo do rosto. NESTA LINHA O ROSTO NÃO APARECE DE FRENTE. 4 passos com braços e pernas alternando.
Os 4 quadros de cada linha virados para o MESMO lado.

Use a segunda imagem anexada (folha de andar) como guia da PASSADA. O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA: túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os quadros (não podem se encostar). Corpo inteiro em todos, nada cortado.
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 4. Pular: `folha_tiferino_pular.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_pular_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de PULO, de perfil virado para a ESQUERDA: 1) agachado tomando impulso; 2) subindo, corpo esticado, um braço para cima; 3) no alto, pernas encolhidas; 4) aterrissando, joelhos dobrados.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 5. Sentar: `folha_tiferino_sentar.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_sentar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 4 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 3 poses SENTADO NO CHÃO de pernas cruzadas, mãos apoiadas nos joelhos: 1) DE FRENTE; 2) DE COSTAS; 3) DE PERFIL virado para a ESQUERDA.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 6. Abaixar e pegar: `folha_tiferino_abaixar.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_abaixar_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros AGACHADO PEGANDO ALGO DO CHÃO, de perfil virado para a ESQUERDA: 1) começando a agachar; 2) agachado, mão indo ao chão; 3) mão tocando o chão; 4) mão subindo fechada (pegou algo). Mãos vazias, sem objeto desenhado.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 7. Golpe de espada: `folha_tiferino_espada.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_espada_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE DE ESPADA COM UMA MÃO, de perfil virado para a ESQUERDA: 1) em guarda; 2) braço da arma recuado para trás; 3) braço erguido no alto, preparando; 4) golpe cortando para a frente e para baixo; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 8. Soco: `folha_tiferino_soco.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_soco_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de SOCO, de perfil virado para a ESQUERDA, punhos fechados: 1) em guarda de luta; 2) recuando o punho; 3) soco esticado para a frente (braço todo estendido); 4) segundo soco com o outro braço; 5) voltando à guarda.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 9. Golpe de machado: `folha_tiferino_machado.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png` + `_ref_machado_silhueta.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 6 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 5 quadros de GOLPE PESADO COM AS DUAS MÃOS (machado), de perfil virado para a ESQUERDA: 1) as duas mãos erguidas bem acima da cabeça; 2) ainda acima, corpo arqueado para trás; 3) descendo com força; 4) golpe embaixo, à frente do corpo, joelhos dobrados; 5) voltando de pé.

A TERCEIRA imagem anexada é só uma SILHUETA cinza: use ela APENAS para a POSE de cada quadro de ação (o primeiro boneco, de pé, não está nela).

As mãos ficam FECHADAS como se segurassem o cabo de uma arma, mas SEM NENHUMA ARMA desenhada (a arma é colocada pelo jogo depois).

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

### 10. Chute: `folha_tiferino_chute.png`
Anexe: `retrato_tiferino.png` + `folha_tiferino_andar.png`

```text
Crie UMA folha de sprites em PIXEL ART do MESMO personagem das duas primeiras imagens anexadas (o tiferino de túnica bege de manga curta, calça marrom e botas: corpo de humano esguio, PELE CINZA-AZULADA, olhos dourados sem pupila, orelhas pontudas, CHIFRES DE CARNEIRO preto-acinzentados e cabelo liso comprido até os ombros), numa ÚNICA LINHA com 5 bonecos do mesmo tamanho, com os pés na mesma altura.

PRIMEIRO boneco (régua de tamanho): DE PÉ, parado, de perfil virado para a ESQUERDA, braços relaxados.
Depois dele, 4 quadros de CHUTE FRONTAL, de perfil virado para a ESQUERDA, punhos fechados em guarda: 1) em guarda, apoiado na perna de trás; 2) joelho da frente subindo dobrado; 3) perna esticada chutando para a frente (para a esquerda) na altura da cintura; 4) perna voltando para o chão.

O CORPO tem que ser EXATAMENTE o da folha de andar anexada: mesma largura de ombros, mesma grossura de braços e pernas, mesmas proporções e mesmo tamanho. NÃO deixe o personagem mais magro nem mais fino.

ROUPA (EXATAMENTE a das imagens anexadas, igual em todos os bonecos): túnica de linho BEGE-acinzentada de MANGA CURTA, solta, até o quadril, com pequena abertura em V no pescoço; calça de tecido MARROM-acinzentada, larga e reta; botas baixas marrom-claro, com a calça entrando nelas.
SEM armadura, SEM couro rebitado, SEM ombreiras, SEM cinto, SEM bolsinhas, SEM braçadeiras, SEM colete.

A pele é CINZA-AZULADA, SEM verde. Os CHIFRES são PRETO-ACINZENTADOS (NÃO verdes) e iguais em todos os quadros. Sem cauda.

O personagem tem que ser IDÊNTICO em todos os quadros e igual às imagens anexadas: mesmo rosto, mesmo cabelo, mesmo pixel art (mesmo tamanho de pixel, mesmo contorno escuro, luz vindo de cima-esquerda).

COR-GUIA: o CABELO e as SOBRANCELHAS são VERDE CHROMA puro (#00FF00), verde mais escuro nas sombras, igual às imagens anexadas. NADA mais é verde.

Espaço vazio entre os bonecos (não podem se encostar). Corpo inteiro em todos, nada cortado. Todos com os pés na mesma linha do chão (no pulo, o corpo sobe em relação a essa linha).
FUNDO: magenta puro #FF00FF, chapado. SEM moldura, SEM grade desenhada, SEM chão, SEM sombra, SEM texto, SEM números, SEM rastros de movimento.
```

