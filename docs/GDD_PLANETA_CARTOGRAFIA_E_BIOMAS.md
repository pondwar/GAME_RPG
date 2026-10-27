# GDD — SISTEMA DE PLANETA, CARTOGRAFIA & ECOLOGIA GLOBAL
**Suritto: O Mundo Contínuo com Fusos Horários Reais & Ecossistema Vivo**  
*Documento de Design Oficial • Versão 1.0*  
*Autor: Equipe de Desenvolvimento & Game Design Suritto*  
*Status: Aprovado para Arquitetura & Implementação*

---

## 1. VISÃO GERAL & FILOSOFIA DE DESIGN

O objetivo de Suritto é criar uma experiência de RPG medieval com **99% de realismo ecológico e geográfico**, eliminando barreiras invisíveis, telas de carregamento entre continentes e instâncias isoladas de servidores.

### Pilares Fundamentais:
1. **Planeta Contínuo Esférico/Cilíndrico (*Seamless Toroidal Wrap*):**
   * Caminhar em linha reta para Leste levará o jogador, após horas de jornada, de volta ao ponto de partida vindo pelo Oeste.
2. **Fusos Horários Reais Atrelados à Longitude (24 Fusos de 15°):**
   * A iluminação solar, a fase do relógio astronômico e as sombras dependem da coordenada $X$ do jogador no globo.
   * Em multiplayer, jogadores do Brasil (UTC-3) nascem no continente ocidental em seu fuso diurno/noturno real; jogadores do Japão (UTC+9) nascem no oriente no seu fuso correspondente.
   * Encontrar jogadores de outras nacionalidades é o ápice de uma **Expedição Transcontinental** de 2 a 3 horas de marcha e navegação oceânica.
3. **Escala Humana Proporcional & Viagens Épicas:**
   * O mundo não é minúsculo (onde se cruza o mapa em 10 minutos) nem vazio e infinito (onde a caminhada é tediosa).
   * A circunferência foi calculada para exigir exatamente **5 horas de caminhada ininterrupta a pé** (ou ~1h30 a galope/barco).
4. **Performance Leve via Chunks Determinísticos:**
   * O jogo consome apenas ~50MB a 60MB de memória RAM, pois apenas os chunks visíveis na tela (raio de 100m) existem na memória, calculados proceduralmente por sementes matemáticas determinísticas (*Simplex Noise*).

---

## 2. MATEMÁTICA DA ESCALA DO PLANETA & TEMPO

### 2.1. Escala Métrica do Personagem
* **Altura do Boneco Humano:** $72\text{ pixels} \equiv 1,80\text{ metros}$.
* **Proporção Espacial:** $1\text{ metro} = 40\text{ pixels}$ ($1\text{ tile} = 32\text{ a }40\text{ pixels} \approx 0,8\text{ a }1,0\text{ metro}$).
* **Velocidade Padrão de Caminhada:** $185\text{ pixels/segundo} \approx 4,63\text{ km/h}$ (velocidade biológica real de um humano adulto em marcha firme).

### 2.2. Dimensões Globais
* **Tempo para Volta Completa Equatorial (a pé):** $10\text{ horas} = 36.000\text{ segundos}$.
* **Circunferência Equatorial ($W$):**
  $$W = 36.000\text{ s} \times 185\text{ px/s} = \mathbf{6.660.000\text{ pixels}}$$
* **Distância Linear Equivalente:**
  $$\frac{6.660.000\text{ px}}{40\text{ px/m}} = 166.500\text{ metros} \approx \mathbf{166,5\text{ km}}$$

### 2.3. Os 24 Fusos Horários (15° de Longitude cada)
$$\text{Largura de 1 Fuso Horário} = \frac{6.660.000\text{ pixels}}{24} = \mathbf{277.500\text{ pixels}}\ (\approx 6,94\text{ km})$$
$$\text{Tempo de Caminhada por Fuso} = \frac{10\text{ horas}}{24} = \mathbf{25\text{ minutos}}$$

> **Regra de Ouro da Gameplay:**  
> A cada **25 minutos** de marcha contínua para o Leste, o jogador cruza um novo meridiano de fuso horário, avançando **1 hora inteira** no ciclo solar em relação ao ponto de partida. Minutos e segundos permanecem rigorosamente sincronizados ao relógio real!

---

## 3. CARTOGRAFIA: LATITUDE, CLIMAS & BIOMAS

O eixo vertical ($Y$) do planeta dita a **Latitude Geográfica**, governada pelo modelo clássico de temperatura e umidade (*Diagrama de Whittaker*):

```
       [ Y = 0 ] POLO NORTE (Ártico • Tundras Geladas • Glaciares)
           |
       [ Y = 15% - 30% ] FAIXA BOREAL (Taiga Nórdica • Montes Rochosos)
           |
       [ Y = 30% - 45% ] FAIXA TEMPERADA NORTE (Bosques de Carvalho • Vales)
           |
=== [ Y = 50% ] LINHA DO EQUADOR (Selvas Tropicais • Savanas • Desertos) ===
           |
       [ Y = 55% - 70% ] FAIXA TEMPERADA SUL (Campinas • Florestas de Sequoias)
           |
       [ Y = 70% - 85% ] FAIXA AUSTRAL (Estilhas Costeiras • Pântanos Frios)
           |
       [ Y = 100% ] POLO SUL (Antártica • Geleiras Eternas)
```

### Zoneamento dos Continentes por Longitude (Fusos Culturais)

| Longitude (Graus) | Fuso Equivalente | Continente / Cultura de Origem | Bioma Predominante | Idioma / Povo de Nascimento |
| :---: | :---: | :--- | :--- | :--- |
| **0° a 45° Leste** | UTC+0 a UTC+3 | **Aldeias de Arton & Valória** (Europa Medieval) | Bosques de Carvalho, Colinas, Rios e Castelos | Português / Inglês / Francês |
| **45° a 75° Leste** | UTC+3 a UTC+5 | **Estepes de Askir & Planaltos** (Leste Europeu) | Estepes ventosas, Taiga fria, Bétulas | Russo / Eslavo |
| **75° a 150° Leste** | UTC+7 a UTC+10 | **Império de Yamato & Vales de Bambu** (Ásia/Japão) | Bambuzais, Cerejeiras, Templos de Montanha | Japonês / Coreano / Chinês |
| **150° a 210° Leste** | UTC+11 a UTC-10 | **Grande Oceano Abissal & Arquipélagos** | Atóis de coral, Ilhas vulcânicas, Mar aberto | Povos Navegadores & Corsários |
| **210° a 270° Leste** | UTC-9 a UTC-5 | **Bastiões do Norte & Terras Virgens** (América do Norte) | Canyons, Florestas de Pinheiros, Sequoias | Inglês / Espanhol |
| **270° a 330° Leste** | UTC-4 a UTC-3 | **Terras de Santa Cruz & Selvas Verdejantes** (Brasil) | Selvas tropicais úmidas, Pau-Brasil, Savanas | Português (Brasil) |
| **330° a 360° (0°)** | UTC-2 a UTC-1 | **Oceano Ocidental & Conexão Cilíndrica** | Mares profundos, Ilhas de névoa e portos | Navegadores Transatlânticos |

---

## 4. ENCICLOPÉDIA BOTÂNICA: ÁRVORES & CORTE DE MADEIRA (1 a 99)

A flora de Suritto foi desenhada para integrar a botânica real com o sistema de progressão de níveis de **Corte de Madeira (Woodcutting)**:

### Tabela Completa de Espécies Arbóreas

| Nível | Nome Popular / Científico | Bioma Nativo | Rendimento / Características | Aplicação no Ofício & Forja |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **Carvalho Comum** (*Quercus*) | Bosques Temperados | 4 a 8 Toras • 35% chance Resina • Frutos | Fogueiras de acampamento, cabos de ferramentas |
| **5** | **Bambu Gigante da Montanha** | Encostas Orientais | 12 Feixes rápidos • Madeira leve e oca | Dardos de precisão, cercas rústicas, suportes leves |
| **10** | **Salgueiro-Chorão** (*Salix*) | Margens de Rios e Pântanos | 6 Toras macias • Ramo flexível para cordas | Carvão de queima rápida, arcos de treinamento |
| **15** | **Cerejeira em Flor** (*Sakura*) | Vales Orientais e Bosques Nobres | 4 Toras aromáticas • Pétalas decorativas | Alaúdes e instrumentos de bardo, caixas de joias |
| **20** | **Bétula Prateada** (*Betula*) | Colinas Rochosas e Bosques Frios | 6 Toras retas • Casca nobre impermeável | Pergaminhos de encantamento, nós para barris |
| **30** | **Pau-Brasil / Ipê de Fogo** | Selvas Tropicais Úmidas | 8 Toras duras avermelhadas • Seiva carmesim | Tingimento de capas nobres, escudos de alto impacto |
| **35** | **Pinheiro Nórdico** (*Pinus*) | Taiga Boreal e Cordilheiras | 8 a 10 Toras • 60% chance de Resina pura | Tochas de longa duração, vigas mestras de casas |
| **40** | **Seringueira Nativa** (*Hevea*) | Florestas Pluviais Equatoriais | 4 Toras • Extração de Látex elástico puro | Vedações impermeáveis, estilingues, botas de caça |
| **50** | **Teixo Nobre** (*Taxus*) | Bosques Místicos e Santuários | 6 Toras de altíssima elasticidade | **Forja dos Melhores Arcos Longos** de Suritto |
| **55** | **Lariço da Geada** (*Larix*) | Tundras de Gelo e Encostas Árticas | 6 Toras densas que afundam na água | Trenós de alta velocidade, estacas à prova de podridão |
| **60** | **Ginkgo Biloba Dourado** | Bosques Sagrados do Oriente | 6 Toras douradas • Sementes medicinais | Elixires de antídoto de veneno, móveis de imperador |
| **65** | **Mogno Tropical** (*Swietenia*) | Selvas Fechadas Equatoriais | 10 Toras avermelhadas densas e nobres | **Construção de Naus Oceânicas** e caravelas |
| **70** | **Freixo Sagrado** (*Fraxinus*) | Colinas Rochosas Ancestrais | 8 Toras maciças de fibra entrelaçada | Hastes de lanças e cabos de machados de guerra |
| **75** | **Baobá Colossal da Savana** | Savanas e Oásis Áridos | **30 a 50 Toras** • Tronco de 6 metros • Seiva d'água | Reservatório de água no deserto, lenha para semanas |
| **80** | **Ébano da Meia-Noite** | Vales Sombrios e Pântanos Amaldiçoados | 6 Toras negras como carvão mineral | Cajados de necromancia, canalizadores de feitiçaria |
| **85** | **Araucária Ancestral dos Pinhais** | Planaltos Meridionais Frios | 12 Toras imensas • Pinhões calóricos (+40 HP) | Construção de pontes de vão largo e paliçadas fortes |
| **90** | **Sequoia Titânica Ancestral** | Vales Gigantes Ocultos no Globo | **40 a 70 Toras** • Exige machado de 2 mãos | Madeira suficiente para erguer um bastião inteiro |
| **99** | **Yggdrasil / Lenho dos Deuses** | Coração de Santuários no Eixo do Mundo | 3 Toras Divinas que pulsam luz áurea | Capa da Maestria, Cajados Lendários, Escudos Imortais |

---

## 5. ARQUITETURA TÉCNICA: CHUNKS PROCEDURAIS & SEED DETERMINÍSTICA

Para manter o jogo rodando a **60 FPS estáveis** em qualquer navegador com consumo ínfimo de memória, a arquitetura obedece às seguintes regras:

### 5.1. Sistema de Chunks
* **Tamanho do Chunk:** $32 \times 32\text{ tiles} = 1.024 \times 1.024\text{ pixels}$.
* **Largura Total do Mundo:** $3.330.000\text{ pixels} \approx 3.252\text{ chunks}$.
* **Matriz Ativa na RAM:** Apenas uma grade de $3 \times 3$ ou $5 \times 5$ chunks ao redor da câmera do jogador é mantida viva.
* **Descarregamento Instantâneo (*Garbage Collection Safe*):** Chunks fora da área de visão são descartados sem salvar dados pesados em disco; apenas alterações feitas pelo jogador (ex: árvore cortada que virou toco) são salvas em um mapa esparso (*Sparse Persistence Map*).

### 5.2. Coordenadas Modulares Cilíndricas (*World Wrap*)
```javascript
// Cálculo modular contínuo (impede coordenadas negativas ou maiores que o mundo)
function wrapWorldX(worldX, worldWidth = 3330000) {
  return ((worldX % worldWidth) + worldWidth) % worldWidth;
}

// Cálculo do fuso horário local (0 a 23) baseado na longitude X
function getLocalTimezone(worldX, worldWidth = 3330000) {
  const normX = wrapWorldX(worldX, worldWidth);
  const timezoneIndex = Math.floor((normX / worldWidth) * 24);
  return timezoneIndex; // 0 = Meridiano Inicial, 12 = Antípoda, 23 = Fronteira Ocidental
}
```

### 5.3. Geração Procedural por Camadas de Ruído (*Simplex Multi-Octave*)
Cada ponto $(X, Y)$ no planeta calcula deterministicamente:
1. **Elevação / Relevo:** Define se é Oceano Profundo, Praia, Planície ou Cordilheira.
2. **Temperatura:** Calculada pela distância até os Polos ($Y$) somada a variações locais de altitude.
3. **Umidade / Precipitação:** Define se uma região quente é Selva Tropical ou Deserto de Dunas.

---

## 6. GEOPOLÍTICA & DINÂMICA MULTIPLAYER REALISTA

### 6.1. Ponto de Spawn por IP / Geolocalização
* Quando uma conta nova entra no jogo, o servidor identifica a sua zona horária/país de conexão.
* O jogador nasce na **Cidade-Estado da sua terra natal** (ex: *Porto do Sol Nascente* para jogadores asiáticos; *Vila dos Pinhais* para brasileiros; *Bastião de Ferro* para europeus).
* Todos ao redor falam a mesma língua nativa nos primeiros níveis de jogo.

### 6.2. As Grandes Expedições Transcontinentais
* Para ir do continente ocidental ao oriental, o jogador precisa:
  1. Adquirir ou construir uma **Embarcação de Madeira Nobre** (Mogno ou Freixo).
  2. Estocar carnes defumadas e água potável (habilidade de Culinária & Fogueira).
  3. Navegar por fusos horários reais onde a noite cai e tempestades ocorrem.
  4. Chegar em portos distantes onde a economia local valoriza produtos exóticos (ex: Pau-Brasil vendido a peso de ouro no Oriente; Bambu e Seda vendidos a preços lendários no Ocidente).

---

## 7. CRONOGRAMA DE IMPLEMENTAÇÃO PRÁTICA

- [x] **Fase 1:** Sistema de Skills Híbrido RuneScape + Tormenta20 e GDD Base.
- [x] **Fase 2:** Mecânica de corte com toco de carvalho, resinas, físicas e queda sonora.
- [ ] **Fase 3 (Próxima):** Implementação da classe `WorldCoordinates` com cálculo de Longitude e Fusos Horários conectados ao Relógio Celestial.
- [ ] **Fase 4:** Gerador de Chunks Contínuos com wrap circular suave no eixo $X$.
- [ ] **Fase 5:** Adição das novas árvores regionais: **Salgueiro-Chorão (Rios)** e **Pinheiro Nórdico (Taiga)** com texturas e físicas próprias.
- [ ] **Fase 6:** Transição de Biomas contínuos (Bosque Temperado -> Taiga Fria -> Deserto).

---
*Suritto Game Design Document • Documento protegido e catalogado no repositório do projeto.*
