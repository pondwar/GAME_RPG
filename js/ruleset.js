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

  window.SurittoRules = { ATTRS, RACES, CLASSES, POINT_COST, POINTS, HP_SCALE, mod, finalAttrs, sheet, roll4d6 };
})();
