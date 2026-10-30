// ruleset.js - Regras de criacao de personagem do Suritto: racas e classes classicas do D&D 5e (SRD 5.1,
// licenca Creative Commons CC-BY-4.0, Wizards of the Coast) adaptadas ao jogo em tempo real.
// Fonte unica: a tela de criacao (js/character_creation.js) e o jogo leem daqui; o banco (ruleset.race,
// ruleset.character_class) recebe os mesmos dados pela migracao 005 (gerada por tools/gerar_ruleset_sql.js).
(function () {
  const ATTRS = [
    { code: 'forca', abbr: 'FOR', name: 'Força', hint: 'Golpes corpo a corpo, carregar peso, Atletismo' },
    { code: 'destreza', abbr: 'DES', name: 'Destreza', hint: 'Defesa, ataques à distância, Furtividade, caça' },
    { code: 'constituicao', abbr: 'CON', name: 'Constituição', hint: 'Pontos de vida, resistência, fôlego' },
    { code: 'inteligencia', abbr: 'INT', name: 'Inteligência', hint: 'Magia arcana do Mago, conhecimento, ofícios' },
    { code: 'sabedoria', abbr: 'SAB', name: 'Sabedoria', hint: 'Percepção, sobrevivência, magia divina e natural' },
    { code: 'carisma', abbr: 'CAR', name: 'Carisma', hint: 'Persuasão, liderança, magia do Bardo, Feiticeiro e Bruxo' }
  ];

  // Racas (SRD 5.1). bonus: atributos; choose: quantos +1 o jogador escolhe livremente (Meio-elfo)
  const RACES = {
    humano: { name: 'Humano', icon: '🧑', bonus: { forca: 1, destreza: 1, constituicao: 1, inteligencia: 1, sabedoria: 1, carisma: 1 }, speed: 30, size: 'Médio',
      desc: 'Os mais numerosos e ambiciosos dos povos. Adaptáveis, constroem as vilas e cidades de Suritto.',
      traits: ['Versátil: +1 em todos os atributos'] },
    elfo: { name: 'Elfo', icon: '🧝', bonus: { destreza: 2, inteligencia: 1 }, speed: 30, size: 'Médio',
      desc: 'Povo antigo e gracioso das florestas, de vida longa e sentidos apurados.',
      traits: ['Visão no escuro', 'Sentidos aguçados (Percepção)', 'Ancestralidade feérica: resiste a encantamentos', 'Transe: descansa meditando'] },
    anao: { name: 'Anão', icon: '🧔', bonus: { constituicao: 2, sabedoria: 1 }, speed: 25, size: 'Médio',
      desc: 'Robustos mestres da pedra e do metal, teimosos e leais até o fim.',
      traits: ['Visão no escuro', 'Resiliência anã: resiste a veneno', 'Robustez: +1 PV por nível', 'Conhece pedra e cantaria'] },
    halfling: { name: 'Halfling', icon: '🧒', bonus: { destreza: 2, carisma: 1 }, speed: 25, size: 'Pequeno',
      desc: 'Pequenos, alegres e sortudos. Passam despercebidos onde ninguém mais passa.',
      traits: ['Sortudo: rola de novo um 1 natural', 'Bravura: resiste a medo', 'Agilidade halfling', 'Pés leves: se esconde atrás de criaturas maiores'] },
    draconato: { name: 'Draconato', icon: '🐲', bonus: { forca: 2, carisma: 1 }, speed: 30, size: 'Médio',
      desc: 'Descendentes de dragões, orgulhosos e imponentes, com escamas e sopro elemental.',
      traits: ['Sopro de dragão (fogo)', 'Resistência a fogo'] },
    gnomo: { name: 'Gnomo', icon: '🧙', bonus: { inteligencia: 2, constituicao: 1 }, speed: 25, size: 'Pequeno',
      desc: 'Curiosos inventores e ilusionistas, de energia inesgotável.',
      traits: ['Visão no escuro', 'Esperteza gnômica: resiste a magia mental', 'Engenhoqueiro'] },
    meio_elfo: { name: 'Meio-elfo', icon: '🧝‍♂️', bonus: { carisma: 2 }, choose: 2, speed: 30, size: 'Médio',
      desc: 'Entre dois mundos, herdam a graça élfica e a ambição humana.',
      traits: ['Visão no escuro', 'Ancestralidade feérica', '+1 em dois atributos à escolha', 'Versatilidade em perícias'] },
    meio_orc: { name: 'Meio-orc', icon: '👹', bonus: { forca: 2, constituicao: 1 }, speed: 30, size: 'Médio',
      desc: 'Fortes e intimidadores, carregam a fúria dos orcs e a disciplina dos humanos.',
      traits: ['Visão no escuro', 'Resistência implacável: fica com 1 PV uma vez por descanso', 'Ataques selvagens: crítico mais forte', 'Ameaçador (Intimidação)'] },
    tiferino: { name: 'Tiferino', icon: '😈', bonus: { carisma: 2, inteligencia: 1 }, speed: 30, size: 'Médio',
      desc: 'Marcados por um pacto antigo com os planos inferiores: chifres, cauda e olhos brilhantes.',
      traits: ['Visão no escuro', 'Resistência infernal: resiste a fogo', 'Legado infernal: magias inatas'] }
  };

  // Classes (SRD 5.1). hitDie: dado de vida; key: atributo principal; saves: testes de resistencia; caster: magia
  const CLASSES = {
    barbaro: { name: 'Bárbaro', icon: '🪓', hitDie: 12, key: ['forca'], saves: ['forca', 'constituicao'], caster: 0,
      desc: 'Guerreiro feroz que luta em fúria, aguentando o que mataria outros.', role: 'Corpo a corpo, muita vida' },
    bardo: { name: 'Bardo', icon: '🎻', hitDie: 8, key: ['carisma'], saves: ['destreza', 'carisma'], caster: 1,
      desc: 'Artista e conjurador: sua música inspira aliados e confunde inimigos.', role: 'Suporte e magia' },
    clerigo: { name: 'Clérigo', icon: '✨', hitDie: 8, key: ['sabedoria'], saves: ['sabedoria', 'carisma'], caster: 1,
      desc: 'Sacerdote com poder divino: cura, protege e castiga.', role: 'Cura e magia divina' },
    druida: { name: 'Druida', icon: '🌿', hitDie: 8, key: ['sabedoria'], saves: ['inteligencia', 'sabedoria'], caster: 1,
      desc: 'Guardião da natureza, fala com os animais e assume a forma deles.', role: 'Natureza e transformação' },
    guerreiro: { name: 'Guerreiro', icon: '⚔️', hitDie: 10, key: ['forca', 'destreza'], saves: ['forca', 'constituicao'], caster: 0,
      desc: 'Mestre de todas as armas e armaduras, disciplinado e versátil.', role: 'Corpo a corpo, versátil' },
    monge: { name: 'Monge', icon: '🥋', hitDie: 8, key: ['destreza', 'sabedoria'], saves: ['forca', 'destreza'], caster: 0,
      desc: 'Lutador de mãos nuas que canaliza a energia interior (ki).', role: 'Agilidade e golpes rápidos' },
    paladino: { name: 'Paladino', icon: '🛡️', hitDie: 10, key: ['forca', 'carisma'], saves: ['sabedoria', 'carisma'], caster: 0.5,
      desc: 'Cavaleiro sagrado de um juramento: protege os fracos e castiga o mal.', role: 'Tanque com magia divina' },
    patrulheiro: { name: 'Patrulheiro', icon: '🏹', hitDie: 10, key: ['destreza', 'sabedoria'], saves: ['forca', 'destreza'], caster: 0.5,
      desc: 'Caçador das terras selvagens, rastreador e mestre do arco.', role: 'Caça e combate à distância' },
    ladino: { name: 'Ladino', icon: '🗡️', hitDie: 8, key: ['destreza'], saves: ['destreza', 'inteligencia'], caster: 0,
      desc: 'Furtivo e astuto: ataques pelas costas, armadilhas e fechaduras.', role: 'Furtividade e dano preciso' },
    feiticeiro: { name: 'Feiticeiro', icon: '🔥', hitDie: 6, key: ['carisma'], saves: ['constituicao', 'carisma'], caster: 1,
      desc: 'A magia corre no seu sangue, crua e poderosa.', role: 'Magia ofensiva' },
    bruxo: { name: 'Bruxo', icon: '🌒', hitDie: 8, key: ['carisma'], saves: ['sabedoria', 'carisma'], caster: 1,
      desc: 'Fez um pacto com uma entidade sobrenatural em troca de poder.', role: 'Magia de pacto' },
    mago: { name: 'Mago', icon: '📖', hitDie: 6, key: ['inteligencia'], saves: ['inteligencia', 'sabedoria'], caster: 1,
      desc: 'Estudioso das artes arcanas, com o maior repertório de magias.', role: 'Magia versátil' }
  };

  // Classes que cada raca pode seguir. O D&D 5e nao restringe; isto e regra do Suritto, inspirada nas edicoes
  // antigas (AD&D). Para mudar: edite a lista e rode tools/gerar_ruleset_sql.js (o servidor valida pela tabela).
  const ALL = Object.keys(CLASSES);
  const RACE_CLASSES = {
    humano: ALL,
    elfo: ['bardo', 'clerigo', 'druida', 'guerreiro', 'monge', 'patrulheiro', 'ladino', 'feiticeiro', 'mago'],
    anao: ['barbaro', 'clerigo', 'guerreiro', 'paladino', 'ladino'],
    halfling: ['bardo', 'clerigo', 'druida', 'guerreiro', 'monge', 'patrulheiro', 'ladino'],
    draconato: ['barbaro', 'bardo', 'clerigo', 'guerreiro', 'paladino', 'feiticeiro', 'bruxo'],
    gnomo: ['bardo', 'clerigo', 'druida', 'guerreiro', 'ladino', 'feiticeiro', 'mago'],
    meio_elfo: ['bardo', 'clerigo', 'druida', 'guerreiro', 'paladino', 'patrulheiro', 'ladino', 'feiticeiro', 'bruxo', 'mago'],
    meio_orc: ['barbaro', 'clerigo', 'guerreiro', 'patrulheiro', 'ladino', 'bruxo'],
    tiferino: ['bardo', 'guerreiro', 'ladino', 'feiticeiro', 'bruxo', 'mago']
  };
  const allowed = (raceCode, classCode) => (RACE_CLASSES[raceCode] || ALL).includes(classCode);

  // Aparencia (tela de criacao). Por enquanto 1 visual classico por raca (o retrato da previa); as outras opcoes
  // de cada parte entram aqui depois. scale: altura na previa (raca pequena aparece menor).
  const LOOK_PARTS = [
    { code: 'corpo', name: 'Corpo' }, { code: 'pele', name: 'Pele' }, { code: 'penteado', name: 'Penteado' },
    { code: 'cabelo', name: 'Cor cabelo' }, { code: 'barba', name: 'Barba' }, { code: 'olhos', name: 'Olhos' }, { code: 'rosto', name: 'Rosto' }
  ];
  const LOOKS = {
    humano: { scale: 1, corpo: 'Masculino', pele: 'Morena clara', penteado: 'Curto arrepiado', cabelo: 'Castanho', barba: 'Por fazer', olhos: 'Castanhos', rosto: 'Queixo quadrado' },
    elfo: { scale: 1.04, corpo: 'Masculino', pele: 'Clara rosada', penteado: 'Rabo com mechas', cabelo: 'Loiro-prateado', barba: 'Sem barba', olhos: 'Verdes', rosto: 'Fino, orelhas pontudas' },
    anao: { scale: 0.78, corpo: 'Masculino', pele: 'Rosada', cabelo: 'Ruivo, barba trançada', olhos: 'Cinzentos', rosto: 'Largo, nariz grande' },
    halfling: { scale: 0.62, corpo: 'Masculino', pele: 'Bronzeada', cabelo: 'Castanho cacheado', olhos: 'Avelã', rosto: 'Redondo e sorridente' },
    draconato: { scale: 1.06, corpo: 'Masculino', pele: 'Escamas vermelhas', cabelo: 'Chifres e cristas', olhos: 'Âmbar', rosto: 'Focinho de dragão' },
    gnomo: { scale: 0.58, corpo: 'Masculino', pele: 'Clara rosada', cabelo: 'Branco espetado', olhos: 'Azuis', rosto: 'Nariz grande, bigode' },
    meio_elfo: { scale: 1, corpo: 'Masculino', pele: 'Oliva', cabelo: 'Preto ondulado', olhos: 'Avelã', rosto: 'Suave, orelhas meio pontudas' },
    meio_orc: { scale: 1.04, corpo: 'Masculino', pele: 'Verde-acinzentada', cabelo: 'Preto preso', olhos: 'Castanhos', rosto: 'Presas inferiores' },
    tiferino: { scale: 1, corpo: 'Masculino', pele: 'Vermelho-rubi', cabelo: 'Preto longo, chifres curvos', olhos: 'Dourados sem pupila', rosto: 'Anguloso, cauda' }
  };

  // Cores de pele, cabelo e olhos (previa pintada por codigo: mascara do retrato, tools/arte/cores_racas.json).
  // A primeira opcao e a cor original do desenho (hex null = sem pintura).
  const COLORS = {
    humano: {
      pele: [['Morena clara', null], ['Clara', '#f0c8b0'], ['Bronzeada', '#c68e6c'], ['Morena', '#9a6a50'], ['Negra', '#6b4535'], ['Retinta', '#45302a']],
      cabelo: [['Castanho', null], ['Preto', '#2b2420'], ['Loiro', '#d8b25c'], ['Ruivo', '#b4532b'], ['Grisalho', '#9b968f'], ['Branco', '#ebe6dc']],
      olhos: [['Castanhos', null], ['Azuis', '#3c7fd0'], ['Verdes', '#3f9a4a'], ['Cinzentos', '#8a96a2'], ['Âmbar', '#d0902a'], ['Pretos', '#201a17']]
    },
    elfo: {
      pele: [['Clara rosada', null], ['Pálida', '#f3dcd2'], ['Dourada', '#e0b68a'], ['Bronze', '#b07a55'], ['Lunar', '#c9c8dc'], ['Noturna', '#4b4a66']],
      cabelo: [['Loiro-prateado', null], ['Dourado', '#e2c56a'], ['Branco', '#f0ece4'], ['Preto', '#1e1c22'], ['Ruivo', '#b8562e'], ['Castanho', '#6b4630']],
      olhos: [['Verdes', null], ['Azuis', '#3c8fe0'], ['Violeta', '#8a4fd0'], ['Âmbar', '#d39a2a'], ['Prateados', '#b8c0c8'], ['Dourados', '#d9b640']]
    }
  };

  // Penteados e barbas (pecas da cabeca: tools/arte/importar_novas.py, cabelo_<raca>_<estilo>.png e barba_<raca>_<estilo>.png).
  // A primeira opcao e a do desenho (null); as outras so aparecem se a peca ja foi importada.
  const STYLES = {
    humano: {
      penteado: [['Curto arrepiado', null], ['Raspado', 'raspado'], ['Repartido', 'lado'], ['Ondulado', 'ondulado'], ['Moicano', 'moicano'], ['Coque', 'coque']],
      barba: [['Por fazer', null], ['Sem barba', 'lisa'], ['Cavanhaque', 'cavanhaque'], ['Cheia', 'cheia'], ['Bigode', 'bigode']]
    },
    elfo: {                                     // elfo nao tem barba
      penteado: [['Rabo com mechas', null], ['Coque', 'coque'], ['Curto', 'curto'], ['Tranças', 'trancas'], ['Raspado', 'raspado']]
    }
  };

  // ---------------- contas ----------------
  const POINT_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };   // compra de pontos (27 pontos)
  const POINTS = 27;
  const HP_SCALE = 8;      // PV do D&D x 8 (o jogo e em tempo real: lobo morde 8, urso 16)
  const mod = (v) => Math.floor((v - 10) / 2);
  // valores finais = base + raca (+ escolhas livres do Meio-elfo)
  function finalAttrs(base, raceCode, chosen = []) {
    const r = RACES[raceCode] || {}, out = {};
    for (const a of ATTRS) out[a.code] = (base[a.code] || 10) + ((r.bonus || {})[a.code] || 0) + (chosen.includes(a.code) ? 1 : 0);
    return out;
  }
  // Ficha calculada (nivel 1): PV, PM, Defesa, bonus de ataque
  function sheet(attrs, raceCode, classCode) {
    const c = CLASSES[classCode] || CLASSES.guerreiro, m = (k) => mod(attrs[k] || 10);
    const dwarf = raceCode === 'anao' ? 1 : 0;
    const keyMod = Math.max(...c.key.map(m));
    const castMod = c.caster ? Math.max(m('inteligencia'), m('sabedoria'), m('carisma')) : 0;
    return {
      maxHp: Math.max(1, c.hitDie + m('constituicao') + dwarf) * HP_SCALE,
      maxMana: Math.round(20 + c.caster * (30 + castMod * 6)),          // conjurador tem mais PM; os outros usam PM em tecnicas
      defense: 10 + m('destreza'),                                       // + armadura (quando existir)
      attack: 2 + keyMod,                                                // proficiencia +2 + atributo da classe
      initiative: m('destreza'),
      speed: (RACES[raceCode] || {}).speed || 30
    };
  }
  // Rolagem classica: 4d6, descarta o menor
  function roll4d6() { const d = [0, 0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6)).sort((a, b) => a - b); return d[1] + d[2] + d[3]; }

  window.SurittoRules = { ATTRS, RACES, CLASSES, RACE_CLASSES, LOOK_PARTS, LOOKS, COLORS, STYLES, POINT_COST, POINTS, HP_SCALE, allowed, mod, finalAttrs, sheet, roll4d6 };
})();
