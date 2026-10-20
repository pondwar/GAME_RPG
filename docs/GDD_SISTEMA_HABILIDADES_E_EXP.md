# 📜 GDD — Sistema de Habilidades, Interdependência & Escalabilidade de EXP
**Projeto**: Aethelgard RPG  
**Versão**: 3.0 (Gamer Architecture Edition)  
**Inspirações Centrais**: RuneScape (Progressão Orgânica), Tormenta20 / D&D 5e (Perícias e Testes D20), Lineage 2 (Encantamento de Armas +16) e Tibia/ArcheAge (Habitação e Terrenos).

---

## 🎨 1. Conceito Visual da Interface de Habilidades

O jogador visualiza seu progresso através de uma tela unificada de dois painéis:

![Interface de Habilidades](/assets/ui/skills_ui_concept.jpg)

* **Painel Operacional Esquerdo (RuneScape Core)**: Grade de ícones com nível numérico (1 a 99) e barra de progresso de EXP em tempo real.
* **Painel Narrativo Direito (Tormenta / D&D Sheet)**: Pergaminho com modificadores de bônus (`+1`, `+3`, `+8`) aplicados nos testes com o dado **D20** durante eventos, diálogos e desafios do mundo.

---

## 🏛️ 2. A Estrutura dos Pilares de Habilidades

### ⚔️ Pilar I: Combate (Empunhadura e Poderio)
Determina que armas, escudos e armaduras o aventureiro tem preparo físico e mental para equipar:

1. **Ataque (Attack)**:
   - Requisito para empunhar armas de aço, ligas nobres e armas lendárias.
   - Determina a precisão do golpe e chance de acerto crítico.
2. **Força (Strength)**:
   - Dano bruto de proximidade (espadas, machados de guerra, maças).
   - **Requisito físico** para manejar ferramentas pesadas de coleta (Machados de Lenhador e Picaretas de Mineração).
3. **Defesa (Defense)**:
   - Requisito para vestir armaduras de cota de malha, placas de aço e escudos de torre.
   - Redução percentual de dano físico e resistência contra atordoamento.
4. **Pontaria (Ranged)**:
   - Manuseio de arcos curtos, arcos longos, bestas pesadas e adagas de arremesso.
   - Aumenta o alcance e o dano de caça à distância.
5. **Magia (Mage)**:
   - Conjuração de magias elementais, controle de mana e uso de mantos encantados.
   - Base para a leitura e criação de pergaminhos arcanos de encantamento.
6. **Vitalidade / HP (Hitpoints)**:
   - Barra de vida máxima do aventureiro, que sobe naturalmente conforme ele sobrevive a combates difíceis.

---

### 🌲 Pilar II: Coleta & Sobrevivência (Extração da Natureza)
Toda matéria-prima que movimenta a economia e a manufatura do jogo:

1. **Corte de Madeira (Woodcutting)**:
   - Capacidade de derrubar árvores mais nobres (Pinheiro, Carvalho, Ébano, Madeira Sagrada).
   - *Dependência*: Exige nível de **Força** e **Defesa** para suportar machados pesados de duas mãos.
2. **Mineração (Mining)**:
   - Extração de pedra bruta, ferro, carvão mineral, prata, ouro e adamante.
   - *Dependência*: Exige nível de **Força** para golpear veios rochosos densos com picaretas maciças.
3. **Caça & Rastreamento (Hunter)**:
   - Rastrear pegadas, abater cervos, lobos, javalis e criaturas lendárias.
   - *Dependência*: Sinergia direta com **Ataque / Pontaria** e ferramentas de esfolamento (facas de caça).
4. **Pesca (Fishing)**:
   - Pesca em rios, lagos e costas marítimas.
   - Fornece peixes ricos em mana e gorduras especiais para alquimia e culinária.
5. **Agricultura (Farming)**:
   - Habilidade avulsa e autônoma: preparar solo, plantar sementes de trigo, hortaliças e cuidar de brotos.
6. **Agilidade (Agility)**:
   - Velocidade de sprint, regeneração de estamina no pulo, equilíbrio sobre pontes estreitas e esquiva passiva.

---

### 🔨 Pilar III: Produção & Manufatura (Economia e Sustento)
Transforma a matéria-prima bruta em sobrevivência, poder e civilização:

1. **Culinária & Fogueiras (Cooking & Hearth)**:
   - *Fusão Realista*: A habilidade de fogueira (*Firemaking*) foi incorporada aqui!
   - A qualidade da lenha do *Corte de Madeira* determina o calor e a duração da brasa. Pratos nobres exigem fogueiras duradouras para assar ou cozinhar em caldeirões.
   - Alimentos restauram Vida, Estamina e conferem buffs temporários (ex: +2 Força por 10 minutos).
2. **Forja & Metalurgia (Smithing)**:
   - Forjar lingotes a partir do minério e criar armas, escudos, pontas de flecha e ferramentas de trabalho.
   - *Dependência*: Exige **Mineração** para o minério e **Força** para o trabalho na bigorna.
3. **Construção & Habitação (Construction & Housing)**:
   - Construir e mobiliar cabanas, casas e mansões nos terrenos adquiridos.
   - *Dependência*: Utiliza vigas e tábuas nobres de **Corte de Madeira**, pedras de **Mineração** e dobradiças/pregos de **Forja**.
4. **Alquimia & Herbalismo (Herblore)**:
   - Maceração de ervas medicinais e cogumelos colhidos em tocos de árvore para fabricar poções de cura, elixires de mana e antídotos.
   - *Dependência*: Conectada diretamente à **Agricultura** e colheita na flora viva.
5. **Encantamento de Armas D20 (Enchanting — Estilo Lineage 2)**:
   - Uso de pergaminhos sagrados para imbuir armas (+1, +2, +3... até +16 com aura de fogo!).
   - *Dependência*: Rola o dado **D20 + Modificador de Magia/Misticismo**. Se passar da dificuldade (CD), o nível do encantamento sobe; se falhar criticamente, a arma pode quebrar ou perder encantamento!

---

### 🎭 Pilar IV: Subterfúgio & Lábia Social (Especialidades de Quests)

1. **Ladinagem & Furtividade (Thieving & Stealth)**:
   - Arrombar fechaduras de baús antigos, desarmar armadilhas em masmorras e bater carteiras de bandidos desatentos.
2. **Carisma & Presença (Diplomacy & Deception)**:
   - Conduz os diálogos com NPCs: conseguir 20% a 40% de desconto em feiras, convencer guardas a liberar passagens, intimidar malfeitores ou blefar em missões secretas.

---

## 🏡 3. O Sistema de Habitação: Lotes e Terrenos Urbanos

Para evitar o caos de construções espalhadas bloqueando caminhos, adotamos a regra consagrada dos grandes RPGs:

```
[MUNDO ABERTO]
   ├── Vilas e Cidades Muradas
   │     └── Lotes Urbanos (Plots demarcados com placas de venda)
   │           ├── Pequeno Lote (Cabana simples de madeira)
   │           ├── Lote Médio (Casa de alvenaria com lareira)
   │           └── Lote Nobre (Solar fortificado com forja e jardim)
   └── Clareiras Florestais / Encostas
         └── Concessões de Terras Selvagens (Refúgios de Caça e Acampamentos)
```

* **Vantagens de ter uma Casa**:
  - **Baús de Armazenamento Seguro**: Guarda centenas de toras, minérios e equipamentos.
  - **Cama Quentinha**: Dormir na casa restaura 100% de vida, fome e estamina instantaneamente, concedendo o buff *"Bem Descansado"* (+10% EXP por 30 minutos).
  - **Bancadas Próprias**: Forja particular, caldeirão de culinária e horta pessoal de ervas no quintal.

---

## 🔄 4. O Sistema de Transbordamento de EXP (XP Overflow)

O jogador evolui fazendo o que gosta. A tabela abaixo dita a distribuição de EXP para cada ação:

| Ação Executada | Habilidade Primária (100% EXP) | Perícia Secundária Beneficiada (Tormenta/D&D) | Benefício Direto nas Quests |
| :--- | :--- | :--- | :--- |
| **Derrubar carvalho com machado** | 🪓 Corte de Madeira | 🌲 *Sobrevivência* (+35%) & 🏋️ *Atletismo* (+20%) | Identificar madeiras raras ou forçar portas trancadas. |
| **Picar minério com picareta** | ⛏️ Mineração | 🏋️ *Atletismo* (+30%) & ⚒️ *Ofício* (+25%) | Reconhecer minerais preciosos ou pontos fracos de muralhas. |
| **Caçar cervo com arco** | 🏹 Caça & Pontaria | 👣 *Furtividade* (+35%) & 👁️ *Percepção* (+25%) | Seguir rastros invisíveis e notar emboscadas a tempo. |
| **Assar prato com fogueira densa** | 🍳 Culinária | 📜 *Ofício (Cozinheiro)* (+40%) & 🌿 *Medicina* (+20%) | Criar banquetes para banquetes nobres ou tratar doenças. |
| **Correr veloz e saltar no ar** | ⚡ Agilidade | 🤸 *Acrobacia* (+40%) & 🏃 *Atletismo* (+30%) | Manobras ágeis para escapar de armadilhas mortais. |
| **Bater carteira de bandido** | 🗝️ Ladinagem | 🧤 *Prestidigitação* (+50%) & 👣 *Furtividade* (+30%) | Roubar chaves de celas em masmorras sem ser visto. |
| **Apostar na taverna com dados** | 🎲 Sorte / Jogatina | 🎭 *Enganação* (+40%) & 👁️ *Intuição* (+30%) | Descobrir quem está blefando em negociações políticas. |
| **Encantar arma com Pergaminho** | ✨ Encantamento D20 | 🔮 *Arcanismo* (+50%) & 📜 *Conhecimento* (+25%) | Identificar itens mágicos antigos em túmulos sagrados. |

---

## 📈 5. Curva Matemática de Escalabilidade de EXP

Para garantir uma progressão gratificante e sem picos abruptos, adotamos a clássica fórmula de progressão exponencial limpa:

$$\text{EXP para Nível } N = \lfloor 65 \times (N - 1)^{1.85} \rfloor$$

### Tabela de Amostra de Níveis (1 a 20 Inicial):

| Nível | EXP Necessária no Nível | EXP Acumulada Total | Bônus D20 em Testes |
| :---: | :---: | :---: | :---: |
| **1** | 0 | 0 | +0 |
| **2** | 65 | 65 | +1 |
| **3** | 150 | 215 | +1 |
| **4** | 255 | 470 | +2 |
| **5** | 380 | 850 | +2 |
| **6** | 525 | 1.375 | +3 |
| **7** | 690 | 2.065 | +3 |
| **8** | 875 | 2.940 | +4 |
| **9** | 1.080 | 4.020 | +4 |
| **10** | 1.300 | 5.320 | +5 (Marco de Especialista!) |
| **15** | 2.650 | 15.200 | +7 |
| **20** | 4.400 | 32.800 | +10 (Mestre Lendário!) |

---

## 🗺️ 6. Roteiro de Implementação Escalonada (Roadmap)

1. **Etapa 1 (Concluída)**:
   - Hand Sockets e animações fluidas de combate e pulo.
   - Corte de carvalho com limite biológico de toras, física de queda e toco de árvore enraizado.
   - Fogueira, cozimento de carne e recuperação de estamina ao sentar.
2. **Etapa 2 (Próxima)**:
   - Estrutura de dados de EXP no backend (`player.skills = { woodcutting: { lvl: 1, xp: 0 }, ... }`).
   - Popups flutuantes de ganho de EXP ao cortar madeira e assar carne (`+15 XP Corte de Madeira 🪵`).
   - Painel de Habilidades (tecla `K` ou aba na mochila).
3. **Etapa 3**:
   - Sistema de Mineração em rochas e Forja de armas básicas.
   - Testes de D20 em árvores duras e encantamento de armas (+1 a +16 com brilho).
4. **Etapa 4**:
   - NPCs de vilarejo com diálogos usando D20 de *Diplomacia* e *Enganação*.
   - Terrenos demarcados e compra de lote para início da cabana de madeira.
