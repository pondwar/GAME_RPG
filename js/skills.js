// skills.js - Aethelgard Hybrid Skills System (RuneScape 1-99 Core + Tormenta20/D&D D20 Codex)
class SkillsSystem {
  constructor(game) {
    this.game = game;
    this.isOpen = false;
    this.activeFilter = 'all'; // 'all', 'combat', 'gathering', 'crafting', 'survival', 'd20'
    this.selectedSkillId = 'woodcutting';
    this.selectedType = 'primary'; // 'primary' or 'secondary'

    // ========================================================
    // 15 PRIMARY SKILLS (RuneScape Inspired 1-99 Progression)
    // ========================================================
    this.primarySkills = {
      woodcutting: {
        id: 'woodcutting',
        name: 'Corte de Madeira',
        title: 'Lenhador Florestal',
        cat: 'gathering',
        icon: '🪓',
        color: '#51cf66',
        level: 1,
        xp: 0,
        synergy: 'sobrevivencia',
        desc: 'A arte ancestral de cortar árvores majestosas e manejar machados com técnica cirúrgica. Fornece lenha nobre para fogueiras, resina aromática e toras para construções rústicas.',
        milestones: [
          { lvl: 1, text: 'Manejo de Machados Rústicos de Ferro & Corte de Carvalhos Jovens' },
          { lvl: 10, text: 'Machados de Aço Forjado (+20% velocidade de corte)' },
          { lvl: 25, text: 'Extração Avançada de Resinas Aromáticas (Dobra chance de resina)' },
          { lvl: 50, text: 'Corte de Pinheiros Ancestrais & Madeiras Mágicas' },
          { lvl: 75, text: 'Golpe Rachador de Troncos (+50% chance de extração crítica)' },
          { lvl: 99, text: 'Capa da Maestria dos Lenhadores Ancestrais de Aethelgard' }
        ]
      },
      mining: {
        id: 'mining',
        name: 'Mineração',
        title: 'Prospector de Veios',
        cat: 'gathering',
        icon: '⛏️',
        color: '#74c0fc',
        level: 1,
        xp: 0,
        synergy: 'atletismo',
        desc: 'Quebra de rochas, extração de jazidas de ferro, carvão fóssil, prata e pedras preciosas lapidáveis das encostas montanhosas.',
        milestones: [
          { lvl: 1, text: 'Picaretas de Pedra e Ferro • Extração de Cobre e Carvão' },
          { lvl: 20, text: 'Descoberta de Veios de Ferro Profundos' },
          { lvl: 40, text: 'Mineração de Prata e Ouro Nativo' },
          { lvl: 70, text: 'Picaretas de Mitril & Gemas Elementais' },
          { lvl: 99, text: 'Capa da Maestria dos Lordes da Montanha' }
        ]
      },
      hunter: {
        id: 'hunter',
        name: 'Caça & Rastreio',
        title: 'Rastreador Selvagem',
        cat: 'survival',
        icon: '🏹',
        color: '#ff922b',
        level: 1,
        xp: 0,
        synergy: 'percepcao',
        desc: 'Identificação de pegadas frescas na terra batida, esfolamento de peles macias e caça furtiva de cervos, javalis e feras.',
        milestones: [
          { lvl: 1, text: 'Esfolamento Básico de Cervos Silvestres & Armadilhas de Laço' },
          { lvl: 15, text: 'Extração Perfeita de Couros (Valor Comercial +35%)' },
          { lvl: 35, text: 'Rastreamento Furtivo de Predadores e Alcateias de Lobos' },
          { lvl: 60, text: 'Armadilhas Pesadas & Caça de Ursos Pardos' },
          { lvl: 99, text: 'Capa da Maestria do Predador Supremo de Aethelgard' }
        ]
      },
      fishing: {
        id: 'fishing',
        name: 'Pesca Fluvial',
        title: 'Pescador dos Rios Claros',
        cat: 'gathering',
        icon: '🎣',
        color: '#3bc9db',
        level: 1,
        xp: 0,
        synergy: 'sobrevivencia',
        desc: 'Uso de varas flexíveis, redes e iscas naturais para pescar trutas prateadas, salmões e enguias nas correntes dos rios.',
        milestones: [
          { lvl: 1, text: 'Varas de Salgueiro & Iscas de Minhoca da Terra' },
          { lvl: 20, text: 'Pesca com Mosca em Corredeiras Rápidas' },
          { lvl: 50, text: 'Captura de Trutas Douradas e Peixes Mágicos de Lagoa' },
          { lvl: 99, text: 'Capa da Maestria dos Mares e Rios de Aethelgard' }
        ]
      },
      cooking: {
        id: 'cooking',
        name: 'Culinária & Fogueira',
        title: 'Chef de Acampamento',
        cat: 'crafting',
        icon: '🍳',
        color: '#fcc419',
        level: 1,
        xp: 0,
        synergy: 'oficio',
        desc: 'Assados em brasa lenta, caldos reconfortantes e banquetes de acampamento que revitalizam vida, saciedade e concedem buffs musculares.',
        milestones: [
          { lvl: 1, text: 'Carne Grelhada na Brasa da Fogueira (+65 HP, Buff de Força)' },
          { lvl: 15, text: 'Assados Defumados com Resina Doce e Ervas Aromáticas' },
          { lvl: 35, text: 'Gisados de Cervo com Cogumelos (Buff de Vigor Duplo)' },
          { lvl: 65, text: 'Banquetes Nobres Restauradores de Mana e Vida' },
          { lvl: 99, text: 'Capa da Maestria dos Grandes Banqueteiros Reais' }
        ]
      },
      smithing: {
        id: 'smithing',
        name: 'Metalurgia & Forja',
        title: 'Ferreiro do Martelo Rubro',
        cat: 'crafting',
        icon: '🔨',
        color: '#ff6b6b',
        level: 1,
        xp: 0,
        synergy: 'oficio',
        desc: 'Transformação de minérios brutos em barras fundidas e forja de armaduras laminadas, machados e espadas letais.',
        milestones: [
          { lvl: 1, text: 'Fundição de Lingotes de Bronze & Pregos de Fixação' },
          { lvl: 20, text: 'Forja de Lâminas e Machados de Ferro Temperado' },
          { lvl: 45, text: 'Forja de Armaduras de Placas de Aço Polido' },
          { lvl: 75, text: 'Forja Rúnica e Armas Encantadas de Mitril' },
          { lvl: 99, text: 'Capa da Maestria do Forjador de Deuses' }
        ]
      },
      construction: {
        id: 'construction',
        name: 'Construção & Abrigo',
        title: 'Construtor de Bastiões',
        cat: 'crafting',
        icon: '📐',
        color: '#e599f7',
        level: 1,
        xp: 0,
        synergy: 'oficio',
        desc: 'Edificação de fogueiras permanentes com pedras de contenção, cabanas de madeira, estantes de armazenamento e paliçadas.',
        milestones: [
          { lvl: 1, text: 'Montagem de Fogueiras de Acampamento com Pedras' },
          { lvl: 15, text: 'Construção de Cavaletes de Secagem e Bancadas Rústicas' },
          { lvl: 40, text: 'Edificação de Cabanas Rústicas com Teto de Palha e Troncos' },
          { lvl: 70, text: 'Fortificações de Pedra Talhada com Portões Reforçados' },
          { lvl: 99, text: 'Capa da Maestria dos Arquitetos do Reino' }
        ]
      },
      herblore: {
        id: 'herblore',
        name: 'Herbologia & Alquimia',
        title: 'Herbalista dos Bosques',
        cat: 'crafting',
        icon: '🌿',
        color: '#69db7c',
        level: 1,
        xp: 0,
        synergy: 'sobrevivencia',
        desc: 'Coleta botânica de flores raras, raízes medicinais e cogumelos para destilar elixires de regeneração e óleos de lâmina.',
        milestones: [
          { lvl: 1, text: 'Identificação de Ervas Silvestres & Chás Curativos Básicos' },
          { lvl: 20, text: 'Destilação de Poções Menores de Cura e Elixires de Mana' },
          { lvl: 50, text: 'Óleos de Lâmina Flamejante e Unguentos Antiparasitários' },
          { lvl: 80, text: 'Poções Maiores de Regeneração e Frascos de Invulnerabilidade' },
          { lvl: 99, text: 'Capa da Maestria dos Alquimistas Supremos' }
        ]
      },
      farming: {
        id: 'farming',
        name: 'Agricultura & Cultivo',
        title: 'Cultivador da Terra Fértil',
        cat: 'gathering',
        icon: '🌾',
        color: '#ffd43b',
        level: 1,
        xp: 0,
        synergy: 'sobrevivencia',
        desc: 'Abertura de canteiros férteis, semeadura de grãos dourados, frutos doces e vegetais para sustento a longo prazo.',
        milestones: [
          { lvl: 1, text: 'Plantio de Trigo, Batatas Silvestres e Ervas Simples' },
          { lvl: 25, text: 'Pomares Frutíferos de Maçãs Douradas e Frutos do Bosque' },
          { lvl: 55, text: 'Irrigação Eficiente e Aceleração Sazonal de Safras' },
          { lvl: 99, text: 'Capa da Maestria dos Provedores da Terra' }
        ]
      },
      attack: {
        id: 'attack',
        name: 'Ataque & Precisão',
        title: 'Duelista das Lâminas',
        cat: 'combat',
        icon: '🗡️',
        color: '#ff4949',
        level: 1,
        xp: 0,
        synergy: 'atletismo',
        desc: 'Precisão nos golpes de espada, técnica de corte limpo, aumento da taxa de acerto e destravamento de armas marciais nobres.',
        milestones: [
          { lvl: 1, text: 'Manejo de Espadas Curtas e Lâminas Rústicas' },
          { lvl: 20, text: 'Espadas Longas de Aço Forjado (+15% Taxa de Acerto)' },
          { lvl: 40, text: 'Espadas de Duas Mãos & Golpes Perfurantes' },
          { lvl: 70, text: 'Lâminas Rúnicas Sagradas e Encantadas (+16)' },
          { lvl: 99, text: 'Capa da Maestria dos Espadachins Lendários' }
        ]
      },
      strength: {
        id: 'strength',
        name: 'Força & Vigor Físico',
        title: 'Colosso Indomável',
        cat: 'combat',
        icon: '💪',
        color: '#e03131',
        level: 1,
        xp: 0,
        synergy: 'atletismo',
        desc: 'Poder muscular bruto para esmagar armaduras inimigas, carregar machados pesados de duas mãos e rachar árvores inteiras com menos golpes.',
        milestones: [
          { lvl: 1, text: 'Golpes com Dano Base & Capacidade Padrão de Carga' },
          { lvl: 20, text: 'Golpe Esmagador (+20% Dano Crítico Físico)' },
          { lvl: 50, text: 'Empunhadura Titânica de Machados Pesados sem Penalidade' },
          { lvl: 80, text: 'Onda de Choque ao Desferir Golpes Pesados no Chão' },
          { lvl: 99, text: 'Capa da Maestria dos Campeões da Força Bruta' }
        ]
      },
      defense: {
        id: 'defense',
        name: 'Defesa & Resistência',
        title: 'Muralha Inabalável',
        cat: 'combat',
        icon: '🛡️',
        color: '#339af0',
        level: 1,
        xp: 0,
        synergy: 'atletismo',
        desc: 'Bloqueios firmes de escudo, absorção de ataques cortantes de presas e capacidade de usar couros espessos e placas de aço pesadas.',
        milestones: [
          { lvl: 1, text: 'Uso de Escudos de Madeira & Jaquetas de Couro Simples' },
          { lvl: 20, text: 'Escudos de Carvalho Reforçados com Ferro (+15 Bloqueio)' },
          { lvl: 50, text: 'Armaduras Completas de Placas de Aço Laminado' },
          { lvl: 80, text: 'Postura Imóvel: Reduz dano sofrido em 40% durante o bloqueio' },
          { lvl: 99, text: 'Capa da Maestria dos Guardiões Eternos' }
        ]
      },
      ranged: {
        id: 'ranged',
        name: 'Pontaria & Arco',
        title: 'Atirador de Elite',
        cat: 'combat',
        icon: '🎯',
        color: '#fab005',
        level: 1,
        xp: 0,
        synergy: 'percepcao',
        desc: 'Disparo de flechas em trajetória precisa, cálculo de vento e manejo de arcos recurvos e bestas de repetição.',
        milestones: [
          { lvl: 1, text: 'Arcos Curtos de Caça & Flechas de Ponta de Sílex' },
          { lvl: 25, text: 'Arcos Longos de Carvalho Ancestral com Alcance Estendido' },
          { lvl: 50, text: 'Flechas Perfurantes com Ponta de Aço Forjado' },
          { lvl: 75, text: 'Disparo Duplo Rápido & Bestas de Repetição Pesadas' },
          { lvl: 99, text: 'Capa da Maestria dos Arqueiros Fantasma' }
        ]
      },
      magic: {
        id: 'magic',
        name: 'Feitiçaria & Arcano',
        title: 'Mago das Chamas Primordiais',
        cat: 'combat',
        icon: '🔮',
        color: '#be4bdb',
        level: 1,
        xp: 0,
        synergy: 'arcanismo',
        desc: 'Manipulação das linhas de mana que cruzam a terra de Aethelgard. Invocação de labaredas protetoras, luz mística e barreiras cintilantes.',
        milestones: [
          { lvl: 1, text: 'Centelha de Fogo Mística & Encantamento de Tochas' },
          { lvl: 20, text: 'Projetil de Energia Arcana e Escudo Mágico Menor' },
          { lvl: 45, text: 'Torrente de Chamas e Encantamento de Armas (+16)' },
          { lvl: 75, text: 'Teletransporte Curto de Éter e Chuva de Meteoros' },
          { lvl: 99, text: 'Capa da Maestria dos Arquimagos de Aethelgard' }
        ]
      },
      agility: {
        id: 'agility',
        name: 'Agilidade & Esquiva',
        title: 'Acrobata dos Telhados',
        cat: 'survival',
        icon: '👟',
        color: '#20c997',
        level: 1,
        xp: 0,
        synergy: 'atletismo',
        desc: 'Coordenação corporal, velocidade ao correr [Shift], salto ágil [Espaço] e regeneração acelerada da barra de estamina.',
        milestones: [
          { lvl: 1, text: 'Corrida e Salto Básico • Regeneração Padrão de Vigor' },
          { lvl: 15, text: 'Recuperação de Estamina +25% mais rápida' },
          { lvl: 35, text: 'Consumo de Estamina ao Correr reduzido em 30%' },
          { lvl: 60, text: 'Salto Duplo Acrobático & Esquiva Rolada Rápida' },
          { lvl: 99, text: 'Capa da Maestria dos Mensageiros do Vento' }
        ]
      }
    };

    // ========================================================
    // 14 SECONDARY D20 SKILLS (Tormenta20 / D&D Parchment)
    // ========================================================
    this.secondarySkills = {
      sobrevivencia: {
        id: 'sobrevivencia',
        name: 'Sobrevivência',
        attr: 'Sabedoria / Vigor',
        icon: '🌲',
        bonus: 2,
        xp: 0,
        desc: 'Orientação por constelações e relevo, previsão de mudanças climáticas, identificação de frutos comestíveis e sustentação na natureza hostil.',
        examples: ['Rastrear pegadas de lobos', 'Prever vendavais e chuvas', 'Achar cogumelos em tocos úmidos']
      },
      atletismo: {
        id: 'atletismo',
        name: 'Atletismo',
        attr: 'Força / Vigor',
        icon: '🏃',
        bonus: 1,
        xp: 0,
        desc: 'Façanhas físicas puras: erguer troncos pesados, correr contra ventanias violentas, nadar em corredeiras e saltar ravinas profundas.',
        examples: ['Arrastar toras maciças', 'Salto em distância sobre pedras', 'Escalar encostas de pedra']
      },
      furtividade: {
        id: 'furtividade',
        name: 'Furtividade',
        attr: 'Destreza',
        icon: '🤫',
        bonus: 2,
        xp: 0,
        desc: 'Mover-se sem estalar galhos secos, ocultar a própria silhueta entre as folhagens e aproximar-se de cervos sem ser notado.',
        examples: ['Aproximação silenciosa de presas', 'Camuflagem em moitas', 'Mover-se sem barulho à noite']
      },
      percepcao: {
        id: 'percepcao',
        name: 'Percepção',
        attr: 'Sabedoria',
        icon: '👁️',
        bonus: 2,
        xp: 0,
        desc: 'Atenção aguçada aos cinco sentidos: ouvir o estalar de presas na mata distante, avistar olhos brilhando na escuridão e sentir cheiro de carniça.',
        examples: ['Detectar emboscada de lobos', 'Avistar frutas escondidas no alto', 'Sentir cheiro de fumaça distante']
      },
      oficio: {
        id: 'oficio',
        name: 'Ofício & Manufatura',
        attr: 'Inteligência / Força',
        icon: '⚒️',
        bonus: 1,
        xp: 0,
        desc: 'Habilidade artesanal para consertar ferramentas danificadas, improvisar nós resistentes, assar carnes sem queimar e talhar cabos de madeira.',
        examples: ['Consertar machado lascado', 'Montar fogueira à prova de vento', 'Esfolar sem rasgar o couro nobre']
      },
      ladinagem: {
        id: 'ladinagem',
        name: 'Ladinagem & Gazua',
        attr: 'Destreza',
        icon: '🗝️',
        bonus: 1,
        xp: 0,
        desc: 'Destreza de dedos para abrir baús esquecidos em ruínas, desarmar armadilhas de caçadores e operar mecanismos enferrujados.',
        examples: ['Abrir baús antigos trancados', 'Desativar armadilhas de urso', 'Destreza manual fina']
      },
      diplomacia: {
        id: 'diplomacia',
        name: 'Diplomacia',
        attr: 'Carisma',
        icon: '🤝',
        bonus: 1,
        xp: 0,
        desc: 'Capacidade de negociar trocas vantajosas com mercadores itinerantes, apaziguar tensões com aldeões desconfiados e firmar acordos.',
        examples: ['Pechinchar preços de poções', 'Negociar passagem por postos de guarda', 'Fazer aliados em povoados']
      },
      enganacao: {
        id: 'enganacao',
        name: 'Enganação',
        attr: 'Carisma',
        icon: '🎭',
        bonus: 0,
        xp: 0,
        desc: 'Criar ruídos falsos para despistar feras, blefar perante saqueadores de estrada e mascarar suas verdadeiras intenções.',
        examples: ['Criar distração acústica', 'Blefar contra salteadores', 'Simular ferimentos para atrair presas']
      },
      investigacao: {
        id: 'investigacao',
        name: 'Investigação',
        attr: 'Inteligência',
        icon: '🔍',
        bonus: 1,
        xp: 0,
        desc: 'Deduzir o que aconteceu num local analisando marcas no solo, cinzas frias de fogueiras abandonadas e vestígios de combate.',
        examples: ['Descobrir causa de morte em carcaça', 'Decifrar marcas rúnicas em pedras', 'Reconstruir passos de um comboio']
      },
      intuicao: {
        id: 'intuicao',
        name: 'Intuição',
        attr: 'Sabedoria',
        icon: '🔮',
        bonus: 1,
        xp: 0,
        desc: 'Sentir calafrios antes de um perigo iminente, pressentir a agressividade oculta de um estranho e ler a agitação dos animais.',
        examples: ['Sentir aproximação de fera alfa', 'Pressentir mau agouro na floresta', 'Julgar confiabilidade de um estranho']
      },
      cavalgar: {
        id: 'cavalgar',
        name: 'Cavalgar',
        attr: 'Destreza',
        icon: '🐎',
        bonus: 0,
        xp: 0,
        desc: 'Dominar montarias através de terrenos pedregosos, manter o equilíbrio durante galopes rápidos e saltar com cavalos.',
        examples: ['Domar corcel selvagem', 'Manter controle em terreno escarpado', 'Galopar à noite sem acidentes']
      },
      arcanismo: {
        id: 'arcanismo',
        name: 'Arcanismo',
        attr: 'Inteligência',
        icon: '📜',
        bonus: 0,
        xp: 0,
        desc: 'Compreensão de fenômenos mágicos, pergaminhos ancestrais de encantamento (+16 Lineage 2) e fendas dimensionais.',
        examples: ['Decifrar pergaminho de encantamento', 'Identificar anomalias arcanas', 'Canalizar energia de monólitos']
      },
      jogatina: {
        id: 'jogatina',
        name: 'Jogatina & Sorte',
        attr: 'Carisma / Sorte',
        icon: '🎲',
        bonus: 2,
        xp: 0,
        desc: 'Conhecimento de probabilidades, blefes com dados em tavernas e instinto para apostas de alto risco sob a luz de velas.',
        examples: ['Disputar partidas de dados com forasteiros', 'Apostar moedas de ouro', 'Leitura rápida de apostas']
      },
      atuacao: {
        id: 'atuacao',
        name: 'Atuação & Cantigas',
        attr: 'Carisma',
        icon: '🪕',
        bonus: 0,
        xp: 0,
        desc: 'Entoar canções heróicas ao redor da fogueira de acampamento, aquecendo os corações dos companheiros e inspirando vigor épico.',
        examples: ['Cantar balada antiga na fogueira', 'Inspirar aliados com histórias épicas', 'Recitar contos aos viajantes']
      }
    };
  }

  // ========================================================
  // XP PROGRESSION MATH & FORMULAS
  // ========================================================
  // RuneScape Exponential Curve: XP(N) = floor(65 * (N)^1.85)
  getXpForNextPrimaryLevel(level) {
    if (level >= 99) return Infinity;
    return Math.floor(65 * Math.pow(level, 1.85));
  }

  // Secondary D20 Bonus XP requirement: nextModXp = floor(95 * (bonus + 1)^1.65)
  getXpForNextSecondaryBonus(bonus) {
    if (bonus >= 15) return Infinity;
    return Math.floor(95 * Math.pow(Math.max(1, bonus + 1), 1.65));
  }

  getTotalLevel() {
    return Object.values(this.primarySkills).reduce((acc, s) => acc + s.level, 0);
  }

  getTotalXp() {
    const primaryTotal = Object.values(this.primarySkills).reduce((acc, s) => acc + s.xp, 0);
    const secondaryTotal = Object.values(this.secondarySkills).reduce((acc, s) => acc + s.xp, 0);
    return primaryTotal + secondaryTotal;
  }

  // ========================================================
  // ADD XP LOGIC & LEVEL UP HOOKS
  // ========================================================
  addXP(skillId, amount, notify = true) {
    amount = Math.max(1, Math.round(amount));

    // Check if it's a primary skill
    if (this.primarySkills[skillId]) {
      const skill = this.primarySkills[skillId];
      if (skill.level >= 99) return;

      skill.xp += amount;
      let leveledUp = false;
      let newLevel = skill.level;

      while (skill.level < 99) {
        const needed = this.getXpForNextPrimaryLevel(skill.level);
        if (skill.xp >= needed) {
          skill.xp -= needed;
          skill.level++;
          newLevel = skill.level;
          leveledUp = true;
        } else {
          break;
        }
      }

      // Also trigger XP Overflow to Synergy Secondary D20 Skill!
      if (skill.synergy && this.secondarySkills[skill.synergy]) {
        const overflowXP = Math.max(1, Math.floor(amount * 0.35));
        this.addXP(skill.synergy, overflowXP, false);
      }

      if (leveledUp) {
        this.triggerPrimaryLevelUp(skill);
      } else if (notify && this.game) {
        // Floating mini XP text above player
        this.game.spawnDamageText(
          this.game.player.x + (Math.random() - 0.5) * 20,
          this.game.player.y - 55,
          `+${amount} XP ${skill.icon}`,
          skill.color,
          13
        );
      }

      this.pulseHudSkillsButton();
      if (this.isOpen) this.renderUI();
      return;
    }

    // Check if it's a secondary D20 skill
    if (this.secondarySkills[skillId]) {
      const pericia = this.secondarySkills[skillId];
      pericia.xp += amount;
      let bonusIncreased = false;

      while (pericia.bonus < 15) {
        const needed = this.getXpForNextSecondaryBonus(pericia.bonus);
        if (pericia.xp >= needed) {
          pericia.xp -= needed;
          pericia.bonus++;
          bonusIncreased = true;
        } else {
          break;
        }
      }

      if (bonusIncreased) {
        this.triggerSecondaryBonusUp(pericia);
      }

      this.pulseHudSkillsButton();
      if (this.isOpen) this.renderUI();
      return;
    }
  }

  triggerPrimaryLevelUp(skill) {
    if (window.sounds) window.sounds.playLevelUp();

    // Screen float text
    if (this.game) {
      this.game.spawnDamageText(
        this.game.player.x,
        this.game.player.y - 75,
        `🎉 NÍVEL AVANÇADO! ${skill.name} Nv. ${skill.level}!`,
        '#ffd43b',
        20
      );
      this.game.addLog(
        `🎉 [LEVEL UP] Parabéns! Sua habilidade de [${skill.name}] avançou para o Nível ${skill.level}!`,
        'action'
      );
    }

    // Spawn celebratory golden sparks around player
    if (this.game && this.game.particles) {
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i;
        const spd = Math.random() * 90 + 60;
        this.game.particles.push({
          x: this.game.player.x,
          y: this.game.player.y - 20,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 0.8,
          maxLife: 0.8,
          color: i % 2 === 0 ? '#ffd43b' : '#ff922b',
          size: Math.random() * 4 + 3
        });
      }
    }
  }

  triggerSecondaryBonusUp(pericia) {
    if (window.sounds) window.sounds.playCritSuccess();
    if (this.game) {
      this.game.spawnDamageText(
        this.game.player.x,
        this.game.player.y - 75,
        `✨ PERÍCIA EVOLUÍDA! ${pericia.name} (+${pericia.bonus})!`,
        '#74c0fc',
        18
      );
      this.game.addLog(
        `✨ [MAESTRIA D20] Seu bônus de perícia em [${pericia.name}] aumentou para (+${pericia.bonus})!`,
        'action'
      );
    }
  }

  // ========================================================
  // ROLL D20 PERÍCIA CHECK (Tormenta20 / D&D Integration)
  // ========================================================
  rollD20Check(periciaId) {
    const pericia = this.secondarySkills[periciaId];
    if (!pericia) return;

    if (window.sounds) window.sounds.playDiceRoll();

    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + pericia.bonus;
    const isCrit = d20 === 20;
    const isFumble = d20 === 1;

    let resultTag = 'Sucesso Moderado';
    let logType = 'dice';

    if (isCrit) {
      resultTag = '★ CRÍTICO SUPREMO (20 NATURAL)!';
      logType = 'action';
      if (window.sounds) window.sounds.playCritSuccess();
    } else if (isFumble) {
      resultTag = '💀 FALHA CRÍTICA (1 NATURAL)!';
      logType = 'warning';
      if (window.sounds) window.sounds.playHurt();
    } else if (total >= 18) {
      resultTag = 'Sucesso Magistral';
      logType = 'action';
    } else if (total >= 12) {
      resultTag = 'Sucesso Aprovado';
      logType = 'dice';
    } else {
      resultTag = 'Falha Simples';
      logType = 'tip';
    }

    if (this.game) {
      this.game.spawnDamageText(
        this.game.player.x,
        this.game.player.y - 65,
        `🎲 D20 [${pericia.name}]: ${d20} + ${pericia.bonus} = ${total}`,
        isCrit ? '#ffd43b' : (isFumble ? '#ff6b6b' : '#a5d8ff'),
        16
      );
      this.game.addLog(
        `🎲 [TESTE D20] ${pericia.icon} ${pericia.name} (${pericia.attr}): Rolou 1d20 [${d20}] + Bônus (+${pericia.bonus}) = ${total} • ${resultTag}!`,
        logType
      );
    }

    // Award minor experience for rolling
    this.addXP(periciaId, 12, false);
  }

  pulseHudSkillsButton() {
    const btn = document.getElementById('hud-skills-btn');
    if (btn) {
      btn.classList.remove('pulse-glow');
      void btn.offsetWidth; // re-trigger animation
      btn.classList.add('pulse-glow');
    }
  }

  // ========================================================
  // INITIALIZATION & DOM CREATION
  // ========================================================
  init() {
    this.createUIElements();
    this.setupListeners();
    this.renderUI();
  }

  createUIElements() {
    // 1. Floating Skills Button next to Backpack button in HUD
    const hudContainer = document.getElementById('game-container');
    if (!hudContainer) return;

    if (!document.getElementById('hud-skills-btn')) {
      const skillsBtn = document.createElement('button');
      skillsBtn.id = 'hud-skills-btn';
      skillsBtn.className = 'hud-skills-btn';
      skillsBtn.title = 'Abrir Códice de Habilidades & Perícias (Tecla K)';
      skillsBtn.innerHTML = `
        <span class="btn-icon">📜</span>
        <small class="btn-label">Skills [K]</small>
      `;
      hudContainer.appendChild(skillsBtn);
    }

    // 2. Fullscreen Skills Modal
    if (!document.getElementById('skills-modal')) {
      const modal = document.createElement('div');
      modal.id = 'skills-modal';
      modal.className = 'skills-modal';
      modal.style.display = 'none';

      modal.innerHTML = `
        <div class="skills-window">
          <!-- Top Ornamental Header -->
          <div class="skills-header">
            <div class="skills-header-left">
              <div class="skills-crest">📜</div>
              <div class="skills-title-box">
                <h2 class="skills-title">AETHELGARD • CÓDICE DE HABILIDADES</h2>
                <span class="skills-subtitle">Progressão RuneScape (1-99) & Perícias D20 Tormenta/D&D</span>
              </div>
            </div>

            <!-- Global Stats (Total Level & Total XP) -->
            <div class="skills-summary-box">
              <div class="summary-stat">
                <span class="stat-label">TOTAL NÍVEL</span>
                <span class="stat-val gold" id="skills-total-lvl">15 / 1485</span>
              </div>
              <div class="summary-stat">
                <span class="stat-label">TOTAL XP</span>
                <span class="stat-val blue" id="skills-total-xp">0 XP</span>
              </div>
            </div>

            <button class="skills-close-btn" id="skills-close-btn" title="Fechar (Tecla K ou ESC)">✕</button>
          </div>

          <!-- Filter Navigation Tabs -->
          <div class="skills-nav-tabs">
            <button class="skill-tab active" data-filter="all">Todas as Áreas</button>
            <button class="skill-tab" data-filter="combat">⚔️ Combate (5)</button>
            <button class="skill-tab" data-filter="gathering">🌲 Coleta & Recursos (4)</button>
            <button class="skill-tab" data-filter="crafting">🔨 Ofício & Forja (4)</button>
            <button class="skill-tab" data-filter="survival">👟 Sobrevivência & Caça (2)</button>
            <button class="skill-tab parchment-tab" data-filter="d20">🎲 Grimório D20 (14 Perícias)</button>
          </div>

          <!-- Dual Pane Layout Container -->
          <div class="skills-dual-container">
            <!-- LEFT PANE: RUNESCAPE PRIMARY SKILLS GRID (60% WIDTH) -->
            <div class="skills-left-pane">
              <div class="pane-header">
                <span class="pane-title">HABILIDADES PRIMÁRIAS (RUNESCAPE 1-99)</span>
                <span class="pane-hint">Passe o mouse ou clique para inspecionar</span>
              </div>
              <div class="skills-grid" id="skills-primary-grid">
                <!-- Dynamically populated cards -->
              </div>
            </div>

            <!-- RIGHT PANE: TORMENTA20 / D&D PARCHMENT SCROLL (40% WIDTH) -->
            <div class="skills-right-pane">
              <div class="parchment-scroll-container">
                <div class="parchment-header">
                  <span class="parchment-wax-seal">⚜️</span>
                  <div class="parchment-titles">
                    <h3 class="parchment-title">PERÍCIAS DE TORMENTA20 & D&D</h3>
                    <span class="parchment-sub">Testes de 1d20 + Bônus de Atributo • Decidem Quests & Desafios</span>
                  </div>
                </div>

                <div class="parchment-list" id="skills-secondary-list">
                  <!-- Dynamically populated Tormenta20 rows -->
                </div>
              </div>
            </div>
          </div>

          <!-- BOTTOM FOOTER: INSPECTION & SYNERGY DETAILS DRAWER -->
          <div class="skills-footer" id="skills-detail-drawer">
            <div class="detail-icon-wrap" id="detail-icon-wrap">
              <span class="detail-icon" id="detail-icon">🪓</span>
              <span class="detail-level-badge" id="detail-lvl-badge">Nv. 1</span>
            </div>
            <div class="detail-info-wrap">
              <div class="detail-header-row">
                <span class="detail-name" id="detail-name">Corte de Madeira</span>
                <span class="detail-tag" id="detail-cat-tag">Coleta Florestal</span>
                <span class="detail-xp-status" id="detail-xp-status">0 / 65 XP para Nível 2</span>
              </div>
              <p class="detail-desc" id="detail-desc">
                A arte de extrair madeiras nobres, resinas de árvores e alimentar fogueiras com machados forjados.
              </p>
              <div class="detail-milestones" id="detail-milestones">
                <!-- Milestone tags -->
              </div>
            </div>
            <div class="detail-action-wrap" id="detail-action-wrap">
              <button class="detail-roll-btn" id="detail-roll-btn" style="display: none;">
                <span>🎲</span> Rolar Teste D20
              </button>
            </div>
          </div>
        </div>
      `;

      hudContainer.appendChild(modal);
    }
  }

  setupListeners() {
    // Keyboard Toggle 'K'
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'k') {
        this.toggle();
      }
      if (key === 'escape' && this.isOpen) {
        this.close();
      }
    });

    // Close button
    const closeBtn = document.getElementById('skills-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // Floating HUD button
    const hudBtn = document.getElementById('hud-skills-btn');
    if (hudBtn) hudBtn.addEventListener('click', () => this.toggle());

    // Filter Navigation Tabs
    const tabs = document.querySelectorAll('.skill-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeFilter = tab.getAttribute('data-filter');
        this.renderUI();
      });
    });

    // Detail Action Roll Button
    const rollBtn = document.getElementById('detail-roll-btn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        if (this.selectedType === 'secondary' && this.selectedSkillId) {
          this.rollD20Check(this.selectedSkillId);
        }
      });
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    const modal = document.getElementById('skills-modal');
    if (modal) modal.style.display = 'flex';
    const hudBtn = document.getElementById('hud-skills-btn');
    if (hudBtn) hudBtn.classList.remove('pulse-glow');
    this.renderUI();
  }

  close() {
    this.isOpen = false;
    const modal = document.getElementById('skills-modal');
    if (modal) modal.style.display = 'none';
  }

  // ========================================================
  // RENDER COMPLETE UI (DUAL-PANEL GRID & PARCHMENT)
  // ========================================================
  renderUI() {
    const modal = document.getElementById('skills-modal');
    if (!modal) return;

    // 1. Update Global Header Totals
    const totalLvlEl = document.getElementById('skills-total-lvl');
    const totalXpEl = document.getElementById('skills-total-xp');
    if (totalLvlEl) totalLvlEl.innerText = `${this.getTotalLevel()} / 1485`;
    if (totalXpEl) totalXpEl.innerText = `${this.getTotalXp().toLocaleString()} XP`;

    // 2. Render Left Pane: Primary Skills Grid
    const gridEl = document.getElementById('skills-primary-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      const primaryList = Object.values(this.primarySkills);

      primaryList.forEach(skill => {
        // Filter by category if not 'all' and not 'd20'
        if (this.activeFilter !== 'all' && this.activeFilter !== 'd20' && skill.cat !== this.activeFilter) {
          return;
        }

        const neededXp = this.getXpForNextPrimaryLevel(skill.level);
        const progressPct = skill.level >= 99 ? 100 : Math.min(100, Math.floor((skill.xp / neededXp) * 100));
        const isSelected = this.selectedType === 'primary' && this.selectedSkillId === skill.id;

        const card = document.createElement('div');
        card.className = `skill-card ${isSelected ? 'selected' : ''}`;
        card.style.setProperty('--skill-glow', skill.color);

        card.innerHTML = `
          <div class="skill-card-top">
            <div class="skill-icon-frame" style="border-color: ${skill.color}">
              <span class="skill-glyph">${skill.icon}</span>
            </div>
            <div class="skill-card-headings">
              <span class="skill-card-name">${skill.name}</span>
              <span class="skill-card-title">${skill.title}</span>
            </div>
            <div class="skill-level-pill">
              <span class="lvl-number">${skill.level}</span>
              <small class="lvl-max">/99</small>
            </div>
          </div>

          <div class="skill-progress-bar-wrap" title="${skill.xp} / ${neededXp} XP">
            <div class="skill-progress-fill" style="width: ${progressPct}%; background: linear-gradient(90deg, ${skill.color}, #f0c05a);"></div>
            <span class="skill-xp-text">${skill.level >= 99 ? 'MAESTRIA MÁXIMA' : `${skill.xp} / ${neededXp} XP (${progressPct}%)`}</span>
          </div>

          <div class="skill-card-synergy">
            <span class="synergy-label">Sinergia D20:</span>
            <span class="synergy-badge">🌲 ${this.secondarySkills[skill.synergy]?.name || 'Sobrevivência'}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          this.selectedType = 'primary';
          this.selectedSkillId = skill.id;
          this.renderUI();
        });

        gridEl.appendChild(card);
      });
    }

    // 3. Render Right Pane: Tormenta20 / D&D Parchment Scroll
    const listEl = document.getElementById('skills-secondary-list');
    if (listEl) {
      listEl.innerHTML = '';
      const secondaryList = Object.values(this.secondarySkills);

      secondaryList.forEach(pericia => {
        const neededXp = this.getXpForNextSecondaryBonus(pericia.bonus);
        const progressPct = Math.min(100, Math.floor((pericia.xp / neededXp) * 100));
        const isSelected = this.selectedType === 'secondary' && this.selectedSkillId === pericia.id;

        const row = document.createElement('div');
        row.className = `parchment-row ${isSelected ? 'selected' : ''}`;

        row.innerHTML = `
          <div class="p-row-left">
            <div class="d20-dice-badge" title="Rolar Teste D20 (${pericia.attr})">
              <span class="d20-icon">🎲</span>
              <span class="d20-bonus">+${pericia.bonus}</span>
            </div>
            <div class="p-row-info">
              <div class="p-row-name-line">
                <span class="p-name">${pericia.name}</span>
                <span class="p-attr">[${pericia.attr}]</span>
              </div>
              <div class="p-xp-line">
                <div class="p-xp-bar">
                  <div class="p-xp-fill" style="width: ${progressPct}%"></div>
                </div>
                <span class="p-xp-label">${pericia.xp} / ${neededXp} XP</span>
              </div>
            </div>
          </div>

          <div class="p-row-right">
            <button class="p-roll-btn" title="Rolar Teste de ${pericia.name} (1d20 + ${pericia.bonus})">
              <span>🎲</span> Testar
            </button>
          </div>
        `;

        // Click row to select
        row.addEventListener('click', (e) => {
          if (e.target.closest('.p-roll-btn')) return; // handled by button
          this.selectedType = 'secondary';
          this.selectedSkillId = pericia.id;
          this.renderUI();
        });

        // Quick roll button
        const btn = row.querySelector('.p-roll-btn');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rollD20Check(pericia.id);
            this.renderUI();
          });
        }

        listEl.appendChild(row);
      });
    }

    // 4. Render Bottom Detail Drawer
    this.renderDetailDrawer();
  }

  renderDetailDrawer() {
    const iconEl = document.getElementById('detail-icon');
    const lvlBadgeEl = document.getElementById('detail-lvl-badge');
    const nameEl = document.getElementById('detail-name');
    const catTagEl = document.getElementById('detail-cat-tag');
    const xpStatusEl = document.getElementById('detail-xp-status');
    const descEl = document.getElementById('detail-desc');
    const milestonesEl = document.getElementById('detail-milestones');
    const rollBtn = document.getElementById('detail-roll-btn');

    if (!nameEl) return;

    if (this.selectedType === 'primary') {
      const skill = this.primarySkills[this.selectedSkillId] || this.primarySkills.woodcutting;
      const needed = this.getXpForNextPrimaryLevel(skill.level);

      if (iconEl) iconEl.innerText = skill.icon;
      if (lvlBadgeEl) lvlBadgeEl.innerText = `Nv. ${skill.level}`;
      if (nameEl) nameEl.innerText = skill.name;
      if (catTagEl) {
        const catLabels = {
          gathering: 'COLETA & RECURSOS',
          crafting: 'OFÍCIO & FORJA',
          combat: 'COMBATE & MARCIAL',
          survival: 'SOBREVIVÊNCIA & AGILIDADE'
        };
        catTagEl.innerText = catLabels[skill.cat] || skill.cat.toUpperCase();
        catTagEl.className = `detail-tag cat-${skill.cat}`;
      }
      if (xpStatusEl) {
        xpStatusEl.innerText = skill.level >= 99 ? 'Maestria Nível 99' : `${skill.xp} / ${needed} XP para Nv. ${skill.level + 1}`;
      }
      if (descEl) descEl.innerText = skill.desc;
      if (rollBtn) rollBtn.style.display = 'none';

      if (milestonesEl) {
        milestonesEl.innerHTML = '';
        if (skill.milestones) {
          skill.milestones.forEach(m => {
            const isUnlocked = skill.level >= m.lvl;
            const chip = document.createElement('div');
            chip.className = `milestone-chip ${isUnlocked ? 'unlocked' : 'locked'}`;
            chip.innerHTML = `<strong>Nv. ${m.lvl}:</strong> <span>${m.text}</span>`;
            milestonesEl.appendChild(chip);
          });
        }
      }
    } else {
      const pericia = this.secondarySkills[this.selectedSkillId] || this.secondarySkills.sobrevivencia;
      const needed = this.getXpForNextSecondaryBonus(pericia.bonus);

      if (iconEl) iconEl.innerText = pericia.icon;
      if (lvlBadgeEl) lvlBadgeEl.innerText = `+${pericia.bonus}`;
      if (nameEl) nameEl.innerText = pericia.name;
      if (catTagEl) {
        catTagEl.innerText = `PERÍCIA D20 • ${pericia.attr}`;
        catTagEl.className = 'detail-tag cat-d20';
      }
      if (xpStatusEl) {
        xpStatusEl.innerText = `${pericia.xp} / ${needed} XP para Bônus +${pericia.bonus + 1}`;
      }
      if (descEl) descEl.innerText = pericia.desc;
      if (rollBtn) rollBtn.style.display = 'flex';

      if (milestonesEl) {
        milestonesEl.innerHTML = '';
        if (pericia.examples) {
          pericia.examples.forEach(ex => {
            const chip = document.createElement('div');
            chip.className = 'milestone-chip unlocked';
            chip.innerHTML = `<span>🎯 Testado em: ${ex}</span>`;
            milestonesEl.appendChild(chip);
          });
        }
      }
    }
  }
}

// Global hook
window.SkillsSystem = SkillsSystem;
