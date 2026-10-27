-- 002_seed_ruleset.sql - Dados de regra atuais do jogo (gerado a partir de js/skills.js e js/inventory.js)

INSERT INTO ruleset.attribute (code, name, abbreviation, sort_order) VALUES
  ('forca', 'Força', 'FOR', 1), ('destreza', 'Destreza', 'DES', 2), ('constituicao', 'Constituição', 'CON', 3),
  ('inteligencia', 'Inteligência', 'INT', 4), ('sabedoria', 'Sabedoria', 'SAB', 5), ('carisma', 'Carisma', 'CAR', 6);

INSERT INTO ruleset.die (code, faces) VALUES ('d4', 4), ('d6', 6), ('d8', 8), ('d10', 10), ('d12', 12), ('d20', 20), ('d100', 100);

INSERT INTO ruleset.roll_outcome (code, name, sort_order) VALUES
  ('critical_failure', 'Falha Crítica', 1), ('failure', 'Falha', 2), ('success', 'Sucesso', 3), ('critical_success', 'Sucesso Crítico', 4);

INSERT INTO ruleset.pericia (code, name, key_attribute_code, attribute_label, icon, description, examples) VALUES
  ('sobrevivencia', 'Sobrevivência', 'sabedoria', 'Sabedoria / Vigor', '🌲', 'Orientação por constelações e relevo, previsão de mudanças climáticas, identificação de frutos comestíveis e sustentação na natureza hostil.', ARRAY['Rastrear pegadas de lobos', 'Prever vendavais e chuvas', 'Achar cogumelos em tocos úmidos']::text[]),
  ('atletismo', 'Atletismo', 'forca', 'Força / Vigor', '🏃', 'Façanhas físicas puras: erguer troncos pesados, correr contra ventanias violentas, nadar em corredeiras e saltar ravinas profundas.', ARRAY['Arrastar toras maciças', 'Salto em distância sobre pedras', 'Escalar encostas de pedra']::text[]),
  ('furtividade', 'Furtividade', 'destreza', 'Destreza', '🤫', 'Mover-se sem estalar galhos secos, ocultar a própria silhueta entre as folhagens e aproximar-se de cervos sem ser notado.', ARRAY['Aproximação silenciosa de presas', 'Camuflagem em moitas', 'Mover-se sem barulho à noite']::text[]),
  ('percepcao', 'Percepção', 'sabedoria', 'Sabedoria', '👁️', 'Atenção aguçada aos cinco sentidos: ouvir o estalar de presas na mata distante, avistar olhos brilhando na escuridão e sentir cheiro de carniça.', ARRAY['Detectar emboscada de lobos', 'Avistar frutas escondidas no alto', 'Sentir cheiro de fumaça distante']::text[]),
  ('oficio', 'Ofício & Manufatura', 'inteligencia', 'Inteligência / Força', '⚒️', 'Habilidade artesanal para consertar ferramentas danificadas, improvisar nós resistentes, assar carnes sem queimar e talhar cabos de madeira.', ARRAY['Consertar machado lascado', 'Montar fogueira à prova de vento', 'Esfolar sem rasgar o couro nobre']::text[]),
  ('ladinagem', 'Ladinagem & Gazua', 'destreza', 'Destreza', '🗝️', 'Destreza de dedos para abrir baús esquecidos em ruínas, desarmar armadilhas de caçadores e operar mecanismos enferrujados.', ARRAY['Abrir baús antigos trancados', 'Desativar armadilhas de urso', 'Destreza manual fina']::text[]),
  ('diplomacia', 'Diplomacia', 'carisma', 'Carisma', '🤝', 'Capacidade de negociar trocas vantajosas com mercadores itinerantes, apaziguar tensões com aldeões desconfiados e firmar acordos.', ARRAY['Pechinchar preços de poções', 'Negociar passagem por postos de guarda', 'Fazer aliados em povoados']::text[]),
  ('enganacao', 'Enganação', 'carisma', 'Carisma', '🎭', 'Criar ruídos falsos para despistar feras, blefar perante saqueadores de estrada e mascarar suas verdadeiras intenções.', ARRAY['Criar distração acústica', 'Blefar contra salteadores', 'Simular ferimentos para atrair presas']::text[]),
  ('investigacao', 'Investigação', 'inteligencia', 'Inteligência', '🔍', 'Deduzir o que aconteceu num local analisando marcas no solo, cinzas frias de fogueiras abandonadas e vestígios de combate.', ARRAY['Descobrir causa de morte em carcaça', 'Decifrar marcas rúnicas em pedras', 'Reconstruir passos de um comboio']::text[]),
  ('intuicao', 'Intuição', 'sabedoria', 'Sabedoria', '🔮', 'Sentir calafrios antes de um perigo iminente, pressentir a agressividade oculta de um estranho e ler a agitação dos animais.', ARRAY['Sentir aproximação de fera alfa', 'Pressentir mau agouro na floresta', 'Julgar confiabilidade de um estranho']::text[]),
  ('cavalgar', 'Cavalgar', 'destreza', 'Destreza', '🐎', 'Dominar montarias através de terrenos pedregosos, manter o equilíbrio durante galopes rápidos e saltar com cavalos.', ARRAY['Domar corcel selvagem', 'Manter controle em terreno escarpado', 'Galopar à noite sem acidentes']::text[]),
  ('arcanismo', 'Arcanismo', 'inteligencia', 'Inteligência', '📜', 'Compreensão de fenômenos mágicos, pergaminhos ancestrais de encantamento (+16 Lineage 2) e fendas dimensionais.', ARRAY['Decifrar pergaminho de encantamento', 'Identificar anomalias arcanas', 'Canalizar energia de monólitos']::text[]),
  ('jogatina', 'Jogatina & Sorte', 'carisma', 'Carisma / Sorte', '🎲', 'Conhecimento de probabilidades, blefes com dados em tavernas e instinto para apostas de alto risco sob a luz de velas.', ARRAY['Disputar partidas de dados com forasteiros', 'Apostar moedas de ouro', 'Leitura rápida de apostas']::text[]),
  ('atuacao', 'Atuação & Cantigas', 'carisma', 'Carisma', '🪕', 'Entoar canções heróicas ao redor da fogueira de acampamento, aquecendo os corações dos companheiros e inspirando vigor épico.', ARRAY['Cantar balada antiga na fogueira', 'Inspirar aliados com histórias épicas', 'Recitar contos aos viajantes']::text[]);

INSERT INTO ruleset.skill_category (code, name, sort_order) VALUES
  ('combat', 'Combate & Marcial', 1), ('gathering', 'Coleta & Recursos', 2), ('crafting', 'Ofício & Forja', 3), ('survival', 'Sobrevivência & Agilidade', 4);

INSERT INTO ruleset.skill (code, name, title, category_code, icon, color, synergy_pericia_code, description, sort_order) VALUES
  ('woodcutting', 'Corte de Madeira', 'Lenhador Florestal', 'gathering', '🪓', '#51cf66', 'sobrevivencia', 'A arte ancestral de cortar árvores majestosas e manejar machados com técnica cirúrgica. Fornece lenha nobre para fogueiras, resina aromática e toras para construções rústicas.', 1),
  ('mining', 'Mineração', 'Prospector de Veios', 'gathering', '⛏️', '#74c0fc', 'atletismo', 'Quebra de rochas, extração de jazidas de ferro, carvão fóssil, prata e pedras preciosas lapidáveis das encostas montanhosas.', 2),
  ('hunter', 'Caça & Rastreio', 'Rastreador Selvagem', 'survival', '🏹', '#ff922b', 'percepcao', 'Identificação de pegadas frescas na terra batida, esfolamento de peles macias e caça furtiva de cervos, javalis e feras.', 3),
  ('fishing', 'Pesca Fluvial', 'Pescador dos Rios Claros', 'gathering', '🎣', '#3bc9db', 'sobrevivencia', 'Uso de varas flexíveis, redes e iscas naturais para pescar trutas prateadas, salmões e enguias nas correntes dos rios.', 4),
  ('cooking', 'Culinária & Fogueira', 'Chef de Acampamento', 'crafting', '🍳', '#fcc419', 'oficio', 'Assados em brasa lenta, caldos reconfortantes e banquetes de acampamento que revitalizam vida, saciedade e concedem buffs musculares.', 5),
  ('smithing', 'Metalurgia & Forja', 'Ferreiro do Martelo Rubro', 'crafting', '🔨', '#ff6b6b', 'oficio', 'Transformação de minérios brutos em barras fundidas e forja de armaduras laminadas, machados e espadas letais.', 6),
  ('construction', 'Construção & Abrigo', 'Construtor de Bastiões', 'crafting', '📐', '#e599f7', 'oficio', 'Edificação de fogueiras permanentes com pedras de contenção, cabanas de madeira, estantes de armazenamento e paliçadas.', 7),
  ('herblore', 'Herbologia & Alquimia', 'Herbalista dos Bosques', 'crafting', '🌿', '#69db7c', 'sobrevivencia', 'Coleta botânica de flores raras, raízes medicinais e cogumelos para destilar elixires de regeneração e óleos de lâmina.', 8),
  ('farming', 'Agricultura & Cultivo', 'Cultivador da Terra Fértil', 'gathering', '🌾', '#ffd43b', 'sobrevivencia', 'Abertura de canteiros férteis, semeadura de grãos dourados, frutos doces e vegetais para sustento a longo prazo.', 9),
  ('attack', 'Ataque & Precisão', 'Duelista das Lâminas', 'combat', '🗡️', '#ff4949', 'atletismo', 'Precisão nos golpes de espada, técnica de corte limpo, aumento da taxa de acerto e destravamento de armas marciais nobres.', 10),
  ('strength', 'Força & Vigor Físico', 'Colosso Indomável', 'combat', '💪', '#e03131', 'atletismo', 'Poder muscular bruto para esmagar armaduras inimigas, carregar machados pesados de duas mãos e rachar árvores inteiras com menos golpes.', 11),
  ('defense', 'Defesa & Resistência', 'Muralha Inabalável', 'combat', '🛡️', '#339af0', 'atletismo', 'Bloqueios firmes de escudo, absorção de ataques cortantes de presas e capacidade de usar couros espessos e placas de aço pesadas.', 12),
  ('ranged', 'Pontaria & Arco', 'Atirador de Elite', 'combat', '🎯', '#fab005', 'percepcao', 'Disparo de flechas em trajetória precisa, cálculo de vento e manejo de arcos recurvos e bestas de repetição.', 13),
  ('magic', 'Feitiçaria & Arcano', 'Mago das Chamas Primordiais', 'combat', '🔮', '#be4bdb', 'arcanismo', 'Manipulação das linhas de mana que cruzam a terra de Suritto. Invocação de labaredas protetoras, luz mística e barreiras cintilantes.', 14),
  ('agility', 'Agilidade & Esquiva', 'Acrobata dos Telhados', 'survival', '👟', '#20c997', 'atletismo', 'Coordenação corporal, velocidade ao correr [Shift], salto ágil [Espaço] e regeneração acelerada da barra de estamina.', 15);

INSERT INTO ruleset.skill_milestone (skill_code, required_level, description) VALUES
  ('woodcutting', 1, 'Manejo de Machados Rústicos de Ferro & Corte de Carvalhos Jovens'),
  ('woodcutting', 10, 'Machados de Aço Forjado (+20% velocidade de corte)'),
  ('woodcutting', 25, 'Extração Avançada de Resinas Aromáticas (Dobra chance de resina)'),
  ('woodcutting', 50, 'Corte de Pinheiros Ancestrais & Madeiras Mágicas'),
  ('woodcutting', 75, 'Golpe Rachador de Troncos (+50% chance de extração crítica)'),
  ('woodcutting', 99, 'Capa da Maestria dos Lenhadores Ancestrais de Suritto'),
  ('mining', 1, 'Picaretas de Pedra e Ferro • Extração de Cobre e Carvão'),
  ('mining', 20, 'Descoberta de Veios de Ferro Profundos'),
  ('mining', 40, 'Mineração de Prata e Ouro Nativo'),
  ('mining', 70, 'Picaretas de Mitril & Gemas Elementais'),
  ('mining', 99, 'Capa da Maestria dos Lordes da Montanha'),
  ('hunter', 1, 'Esfolamento Básico de Cervos Silvestres & Armadilhas de Laço'),
  ('hunter', 15, 'Extração Perfeita de Couros (Valor Comercial +35%)'),
  ('hunter', 35, 'Rastreamento Furtivo de Predadores e Alcateias de Lobos'),
  ('hunter', 60, 'Armadilhas Pesadas & Caça de Ursos Pardos'),
  ('hunter', 99, 'Capa da Maestria do Predador Supremo de Suritto'),
  ('fishing', 1, 'Varas de Salgueiro & Iscas de Minhoca da Terra'),
  ('fishing', 20, 'Pesca com Mosca em Corredeiras Rápidas'),
  ('fishing', 50, 'Captura de Trutas Douradas e Peixes Mágicos de Lagoa'),
  ('fishing', 99, 'Capa da Maestria dos Mares e Rios de Suritto'),
  ('cooking', 1, 'Carne Grelhada na Brasa da Fogueira (+65 HP, Buff de Força)'),
  ('cooking', 15, 'Assados Defumados com Resina Doce e Ervas Aromáticas'),
  ('cooking', 35, 'Gisados de Cervo com Cogumelos (Buff de Vigor Duplo)'),
  ('cooking', 65, 'Banquetes Nobres Restauradores de Mana e Vida'),
  ('cooking', 99, 'Capa da Maestria dos Grandes Banqueteiros Reais'),
  ('smithing', 1, 'Fundição de Lingotes de Bronze & Pregos de Fixação'),
  ('smithing', 20, 'Forja de Lâminas e Machados de Ferro Temperado'),
  ('smithing', 45, 'Forja de Armaduras de Placas de Aço Polido'),
  ('smithing', 75, 'Forja Rúnica e Armas Encantadas de Mitril'),
  ('smithing', 99, 'Capa da Maestria do Forjador de Deuses'),
  ('construction', 1, 'Montagem de Fogueiras de Acampamento com Pedras'),
  ('construction', 15, 'Construção de Cavaletes de Secagem e Bancadas Rústicas'),
  ('construction', 40, 'Edificação de Cabanas Rústicas com Teto de Palha e Troncos'),
  ('construction', 70, 'Fortificações de Pedra Talhada com Portões Reforçados'),
  ('construction', 99, 'Capa da Maestria dos Arquitetos do Reino'),
  ('herblore', 1, 'Identificação de Ervas Silvestres & Chás Curativos Básicos'),
  ('herblore', 20, 'Destilação de Poções Menores de Cura e Elixires de Mana'),
  ('herblore', 50, 'Óleos de Lâmina Flamejante e Unguentos Antiparasitários'),
  ('herblore', 80, 'Poções Maiores de Regeneração e Frascos de Invulnerabilidade'),
  ('herblore', 99, 'Capa da Maestria dos Alquimistas Supremos'),
  ('farming', 1, 'Plantio de Trigo, Batatas Silvestres e Ervas Simples'),
  ('farming', 25, 'Pomares Frutíferos de Maçãs Douradas e Frutos do Bosque'),
  ('farming', 55, 'Irrigação Eficiente e Aceleração Sazonal de Safras'),
  ('farming', 99, 'Capa da Maestria dos Provedores da Terra'),
  ('attack', 1, 'Manejo de Espadas Curtas e Lâminas Rústicas'),
  ('attack', 20, 'Espadas Longas de Aço Forjado (+15% Taxa de Acerto)'),
  ('attack', 40, 'Espadas de Duas Mãos & Golpes Perfurantes'),
  ('attack', 70, 'Lâminas Rúnicas Sagradas e Encantadas (+16)'),
  ('attack', 99, 'Capa da Maestria dos Espadachins Lendários'),
  ('strength', 1, 'Golpes com Dano Base & Capacidade Padrão de Carga'),
  ('strength', 20, 'Golpe Esmagador (+20% Dano Crítico Físico)'),
  ('strength', 50, 'Empunhadura Titânica de Machados Pesados sem Penalidade'),
  ('strength', 80, 'Onda de Choque ao Desferir Golpes Pesados no Chão'),
  ('strength', 99, 'Capa da Maestria dos Campeões da Força Bruta'),
  ('defense', 1, 'Uso de Escudos de Madeira & Jaquetas de Couro Simples'),
  ('defense', 20, 'Escudos de Carvalho Reforçados com Ferro (+15 Bloqueio)'),
  ('defense', 50, 'Armaduras Completas de Placas de Aço Laminado'),
  ('defense', 80, 'Postura Imóvel: Reduz dano sofrido em 40% durante o bloqueio'),
  ('defense', 99, 'Capa da Maestria dos Guardiões Eternos'),
  ('ranged', 1, 'Arcos Curtos de Caça & Flechas de Ponta de Sílex'),
  ('ranged', 25, 'Arcos Longos de Carvalho Ancestral com Alcance Estendido'),
  ('ranged', 50, 'Flechas Perfurantes com Ponta de Aço Forjado'),
  ('ranged', 75, 'Disparo Duplo Rápido & Bestas de Repetição Pesadas'),
  ('ranged', 99, 'Capa da Maestria dos Arqueiros Fantasma'),
  ('magic', 1, 'Centelha de Fogo Mística & Encantamento de Tochas'),
  ('magic', 20, 'Projetil de Energia Arcana e Escudo Mágico Menor'),
  ('magic', 45, 'Torrente de Chamas e Encantamento de Armas (+16)'),
  ('magic', 75, 'Teletransporte Curto de Éter e Chuva de Meteoros'),
  ('magic', 99, 'Capa da Maestria dos Arquimagos de Suritto'),
  ('agility', 1, 'Corrida e Salto Básico • Regeneração Padrão de Vigor'),
  ('agility', 15, 'Recuperação de Estamina +25% mais rápida'),
  ('agility', 35, 'Consumo de Estamina ao Correr reduzido em 30%'),
  ('agility', 60, 'Salto Duplo Acrobático & Esquiva Rolada Rápida'),
  ('agility', 99, 'Capa da Maestria dos Mensageiros do Vento');

INSERT INTO ruleset.item_type (code, name) VALUES
  ('consumable', 'Consumível'), ('weapon', 'Arma'), ('offhand', 'Mão Secundária'), ('armor', 'Armadura'), ('material', 'Material');

INSERT INTO ruleset.item_rarity (code, name, color, sort_order) VALUES
  ('common', 'Comum', '#ced4da', 1), ('uncommon', 'Incomum', '#51cf66', 2), ('rare', 'Raro', '#339af0', 3), ('epic', 'Épico', '#be4bdb', 4), ('legendary', 'Lendário', '#ff922b', 5);

INSERT INTO ruleset.equipment_slot (code, name, sort_order) VALUES ('weapon', 'Arma', 1), ('offhand', 'Mão Secundária', 2), ('armor', 'Peitoral', 3);

INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES
  ('fruit', 'Fruto Silvestre', 'consumable', 'common', NULL, '🍎', 20, 'Fruto fresco colhido das copas dos carvalhos ancestrais. Restaura vida e saciedade.', '+15 HP, +20% Nutrição'),
  ('meat', 'Carne de Caça', 'consumable', 'common', NULL, '🥩', 15, 'Carne fresca e nutritiva obtida através da caça e esfolamento de cervos. Asse na fogueira para obter benefícios épicos.', '+35 HP, +45% Nutrição'),
  ('cooked_meat', 'Carne Grelhada Suculenta', 'consumable', 'uncommon', NULL, '🍖', 15, 'Carne de caça assada lentamente na brasa da fogueira. Revitaliza o corpo e fortalece os músculos com vigor de combate.', '+65 HP, +80% Nutrição • Buff: +3 Força (60s)'),
  ('potion_heal', 'Poção de Cura Menor', 'consumable', 'uncommon', NULL, '🧪', 10, 'Destilado alquímico de ervas medicinais da floresta.', '+40 HP Instantâneo'),
  ('potion_mana', 'Elixir de Mana', 'consumable', 'uncommon', NULL, '💧', 10, 'Extrato cristalino que recarrega as energias arcanas do aventureiro.', '+30 MP Instantâneo'),
  ('sword', 'Espada de Aço Forjada', 'weapon', 'common', 'weapon', '🗡️', 1, 'Lâmina afiada forjada com aço temperado. Ataque ágil em arco.', 'Dano: +3 • D20 Mod: +2 Força'),
  ('axe', 'Machado de Lenhador', 'weapon', 'common', 'weapon', '🪓', 1, 'Ferramenta robusta para desbastar madeira e desferir golpes pesados.', 'Dano: +2 • Colheita de Madeira'),
  ('fire_sword', 'Lâmina Flamejante +16', 'weapon', 'legendary', 'weapon', '⚔️', 1, 'Lâmina lendária encantada no D20 com Fogo Sagrado de Lineage 2. Emite calor e luz contínua.', 'Dano: +8 • Iluminação Noturna 360° • Dobro de Dano em Feras'),
  ('torch', 'Tocha de Resina', 'offhand', 'common', 'offhand', '🔥', 5, 'Tocha de breu e madeira. Dissipa a escuridão da noite e amedronta os lobos da floresta.', 'Iluminação 175px • Afasta Lobos'),
  ('scroll_enchant', 'Pergaminho de Encantamento', 'consumable', 'rare', NULL, '📜', 5, 'Pergaminho místico arcano. Rola um teste D20 arriscado para imbuir a espada com chamas eternas (+16).', 'Encantamento D20 • Risco Mágico'),
  ('wolf_pelt', 'Pele de Lobo Feroz', 'material', 'rare', NULL, '🐺', 10, 'Pele espessa e macia de um predador da floresta. Excelente isolante térmico para forja de armaduras.', 'Material Raro • Valor: 25 Moedas'),
  ('wolf_tooth', 'Dente Canino de Lobo', 'material', 'common', NULL, '🦷', 20, 'Dente pontiagudo e afiado retirado de um lobo abatido.', 'Material de Amuleto • Valor: 5 Moedas'),
  ('deer_hide', 'Couro de Cervo Silvestre', 'material', 'common', NULL, '🦌', 10, 'Couro flexível e resistente obtido através da esfoliação da caça.', 'Material de Costura • Valor: 12 Moedas'),
  ('bone', 'Ossos de Animal Secos', 'material', 'common', NULL, '🦴', 30, 'Ossos limpos pelo tempo e pelo solo da floresta.', 'Material Básico • Valor: 2 Moedas'),
  ('wood', 'Toras de Carvalho', 'consumable', 'common', NULL, '🪵', 40, 'Madeira densa cortada das árvores ancestrais com o machado. Use 2 toras para acender uma fogueira de acampamento!', 'Construção: Fogueira (2x Madeira)'),
  ('stone', 'Pedra', 'material', 'common', NULL, '🪨', 60, 'Blocos de pedra bruta para erguer muros, arcos e portais.', 'Material de Construção • Demolir devolve 80%'),
  ('resin', 'Resina de Carvalho', 'material', 'common', NULL, '🍯', 20, 'Resina aromática e inflamável colhida da casca dos troncos. Combustível essencial.', 'Material Inflamável • Valor: 8 Moedas'),
  ('campfire_kit', 'Fogueira de Acampamento', 'consumable', 'uncommon', NULL, '🔥', 5, 'Kit de acampamento com pedras de contenção e madeira empilhada. Acende fogo protetor que espanta lobos e permite assar carnes.', 'Luz + Repelente de Feras + Cozinha');

-- Realm local (desenvolvimento)
INSERT INTO world.realm (code, name) VALUES ('local', 'Suritto Local (desenvolvimento)');
