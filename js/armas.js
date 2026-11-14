// armas.js - Tabela de armas do Suritto e as regras de quem pode usar cada uma.
//
// Base (para nao inventar do zero):
//  - Lista, dano, peso, preco e propriedades: armas do D&D 5e (SRD 5.1, CC-BY-4.0, Wizards of the Coast).
//  - Tamanho da arma x tamanho de quem segura: regra do AD&D 2a edicao / D&D 3.5. Uma arma do seu tamanho vai em
//    uma mao; um tamanho acima, nas duas maos; dois tamanhos acima, nao da para usar. Ex.: o halfling (Pequeno) usa a
//    espada longa (Media) com as duas maos e nao usa o arco longo nem a alabarda (Grandes). O anao e Medio: usa tudo.
//  - Proficiencia (saber usar): ideia do Tormenta20 e do D&D. Arma que voce nao sabe usar da -5 no ataque (T20).
//    O aldeao (sem classe) sabe as armas simples; a raca ensina algumas (anao: machados e martelos; elfo: espadas e
//    arcos, como no D&D 5e); a classe, escolhida numa guilda, ensina o resto.
// Peso em kg (libras do livro x 0,45). Preco em pecas de ouro (po); 0.1 = 1 peca de prata.
(function () {
  // tipo de dano: corte, perfuracao, impacto (concussao no livro)
  // props: leve, acuidade (usa Destreza), arremesso, versatil (uma ou duas maos), duas_maos, pesada, alcance,
  //        municao, recarga, especial
  const A = (nome, grupo, dano, tipo, peso, preco, props = {}) => ({ nome, grupo, dano, tipo, peso, preco, props });
  const ARMAS = {
    // ---- simples corpo a corpo ----
    clava: A('Clava', 'simples', '1d4', 'impacto', 1, 0.1, { leve: 1 }),
    adaga: A('Adaga', 'simples', '1d4', 'perfuracao', 0.5, 2, { leve: 1, acuidade: 1, arremesso: [6, 18] }),
    clava_grande: A('Clava grande', 'simples', '1d8', 'impacto', 4.5, 0.2, { duas_maos: 1 }),
    machadinha: A('Machadinha', 'simples', '1d6', 'corte', 1, 5, { leve: 1, arremesso: [6, 18] }),
    azagaia: A('Azagaia', 'simples', '1d6', 'perfuracao', 1, 0.5, { arremesso: [9, 36] }),
    martelo_leve: A('Martelo leve', 'simples', '1d4', 'impacto', 1, 2, { leve: 1, arremesso: [6, 18] }),
    maca: A('Maça', 'simples', '1d6', 'impacto', 2, 5),
    bordao: A('Bordão', 'simples', '1d6', 'impacto', 2, 0.2, { versatil: '1d8' }),
    foice: A('Foice curta', 'simples', '1d4', 'corte', 1, 1, { leve: 1 }),
    lanca: A('Lança', 'simples', '1d6', 'perfuracao', 1.5, 1, { arremesso: [6, 18], versatil: '1d8' }),
    // ---- simples a distancia ----
    besta_leve: A('Besta leve', 'simples', '1d8', 'perfuracao', 2.5, 25, { municao: [24, 96], recarga: 1, duas_maos: 1, distancia: 1 }),
    dardo: A('Dardo', 'simples', '1d4', 'perfuracao', 0.1, 0.05, { acuidade: 1, arremesso: [6, 18], distancia: 1 }),
    arco_curto: A('Arco curto', 'simples', '1d6', 'perfuracao', 1, 25, { municao: [24, 96], duas_maos: 1, distancia: 1 }),
    funda: A('Funda', 'simples', '1d4', 'impacto', 0, 0.1, { municao: [9, 36], distancia: 1 }),
    // ---- marciais corpo a corpo ----
    machado_batalha: A('Machado de batalha', 'marcial', '1d8', 'corte', 2, 10, { versatil: '1d10' }),
    mangual: A('Mangual', 'marcial', '1d8', 'impacto', 1, 10),
    glaive: A('Glaive', 'marcial', '1d10', 'corte', 3, 20, { pesada: 1, alcance: 1, duas_maos: 1 }),
    machado_grande: A('Machado grande', 'marcial', '1d12', 'corte', 3, 30, { pesada: 1, duas_maos: 1 }),
    montante: A('Montante', 'marcial', '2d6', 'corte', 3, 50, { pesada: 1, duas_maos: 1 }),
    alabarda: A('Alabarda', 'marcial', '1d10', 'corte', 3, 20, { pesada: 1, alcance: 1, duas_maos: 1 }),
    lanca_montada: A('Lança de cavalaria', 'marcial', '1d12', 'perfuracao', 3, 10, { alcance: 1, especial: 'montado: uma mão' }),
    espada_longa: A('Espada longa', 'marcial', '1d8', 'corte', 1.5, 15, { versatil: '1d10' }),
    malho: A('Malho', 'marcial', '2d6', 'impacto', 4.5, 10, { pesada: 1, duas_maos: 1 }),
    maca_estrela: A('Maça-estrela', 'marcial', '1d8', 'perfuracao', 2, 15),
    pique: A('Pique', 'marcial', '1d10', 'perfuracao', 8, 5, { pesada: 1, alcance: 1, duas_maos: 1 }),
    rapieira: A('Rapieira', 'marcial', '1d8', 'perfuracao', 1, 25, { acuidade: 1 }),
    cimitarra: A('Cimitarra', 'marcial', '1d6', 'corte', 1.5, 25, { leve: 1, acuidade: 1 }),
    espada_curta: A('Espada curta', 'marcial', '1d6', 'perfuracao', 1, 10, { leve: 1, acuidade: 1 }),
    tridente: A('Tridente', 'marcial', '1d6', 'perfuracao', 2, 5, { arremesso: [6, 18], versatil: '1d8' }),
    picareta_guerra: A('Picareta de guerra', 'marcial', '1d8', 'perfuracao', 1, 5),
    martelo_guerra: A('Martelo de guerra', 'marcial', '1d8', 'impacto', 1, 15, { versatil: '1d10' }),
    chicote: A('Chicote', 'marcial', '1d4', 'corte', 1.5, 2, { acuidade: 1, alcance: 1 }),
    // ---- marciais a distancia ----
    // (zarabatana fora do jogo por decisao do dono: pouca gente usaria; a balestra e a besta pesada)
    besta_mao: A('Besta de mão', 'marcial', '1d6', 'perfuracao', 1.5, 75, { municao: [9, 36], leve: 1, recarga: 1, distancia: 1 }),
    besta_pesada: A('Balestra (besta pesada)', 'marcial', '1d10', 'perfuracao', 8, 50, { municao: [30, 120], pesada: 1, recarga: 1, duas_maos: 1, distancia: 1 }),
    arco_longo: A('Arco longo', 'marcial', '1d8', 'perfuracao', 1, 50, { municao: [45, 180], pesada: 1, duas_maos: 1, distancia: 1 })
  };

  // Tamanho da arma (P, M, G), como no AD&D: leve = Pequena; pesada = Grande; o resto = Media.
  // A lanca de cavalaria e Grande (so se usa com uma mao montado)
  const TAM = ['P', 'M', 'G'];
  for (const a of Object.values(ARMAS)) a.tamanho = a.props.leve ? 'P' : (a.props.pesada || a.props.especial ? 'G' : 'M');

  // tamanho de quem segura (ruleset.js: RACES[...].size)
  const tamCriatura = (raceCode) => {
    const r = window.SurittoRules && window.SurittoRules.RACES[raceCode];
    return r && r.size === 'Pequeno' ? 'P' : 'M';
  };

  // Pode usar? Com quantas maos? { pode, maos, motivo }
  function empunhadura(raceCode, armaId) {
    const a = ARMAS[armaId];
    if (!a) return { pode: true, maos: 1, motivo: '' };
    const dif = TAM.indexOf(a.tamanho) - TAM.indexOf(tamCriatura(raceCode));
    const nome = ((window.SurittoRules && window.SurittoRules.RACES[raceCode]) || {}).name || 'Você';
    if (dif >= 2) return { pode: false, maos: 0, motivo: `${a.nome} é grande demais para ${nome}.` };
    if (dif === 1) return { pode: true, maos: 2, motivo: a.props.duas_maos ? '' : `${nome} usa ${a.nome} com as duas mãos.` };
    return { pode: true, maos: a.props.duas_maos ? 2 : 1, motivo: '' };
  }

  // Proficiencia: quem sabe usar o que. Grupos 'simples'/'marcial' ou nomes de armas
  const SIMPLES = Object.keys(ARMAS).filter(k => ARMAS[k].grupo === 'simples');
  const MARCIAIS = Object.keys(ARMAS).filter(k => ARMAS[k].grupo === 'marcial');
  // classes (D&D 5e); sem classe = aldeao = armas simples
  const PROF_CLASSE = {
    aldeao: ['simples'],
    barbaro: ['simples', 'marcial'], guerreiro: ['simples', 'marcial'], paladino: ['simples', 'marcial'], patrulheiro: ['simples', 'marcial'],
    bardo: ['simples', 'besta_mao', 'espada_longa', 'rapieira', 'espada_curta'],
    ladino: ['simples', 'besta_mao', 'espada_longa', 'rapieira', 'espada_curta'],
    clerigo: ['simples'], bruxo: ['simples'],
    monge: ['simples', 'espada_curta'],
    druida: ['clava', 'adaga', 'dardo', 'azagaia', 'maca', 'bordao', 'cimitarra', 'foice', 'funda', 'lanca'],
    feiticeiro: ['adaga', 'dardo', 'funda', 'bordao', 'besta_leve'],
    mago: ['adaga', 'dardo', 'funda', 'bordao', 'besta_leve']
  };
  // treino da raca (D&D 5e: anao e elfo); vale mesmo sem classe
  const PROF_RACA = {
    anao: ['machado_batalha', 'machadinha', 'martelo_leve', 'martelo_guerra'],
    elfo: ['espada_longa', 'espada_curta', 'arco_curto', 'arco_longo']
  };
  const PENALIDADE_SEM_PROFICIENCIA = -5;     // Tormenta20
  const expande = (l) => l.flatMap(x => x === 'simples' ? SIMPLES : x === 'marcial' ? MARCIAIS : [x]);
  function proficiente(raceCode, classCode, armaId) {
    if (!ARMAS[armaId]) return true;
    return expande(PROF_CLASSE[classCode] || PROF_CLASSE.aldeao).concat(PROF_RACA[raceCode] || []).includes(armaId);
  }

  // Arma com que cada raca comeca (aldeao): o treino da raca quando tem, senao uma arma simples do povo dela.
  // Sempre de ferro/madeira, a mais basica possivel
  const ARMA_INICIAL = {
    humano: 'clava', elfo: 'espada_curta', anao: 'machadinha', halfling: 'adaga', gnomo: 'adaga',
    meio_elfo: 'adaga', meio_orc: 'clava', draconato: 'lanca', tiferino: 'adaga'
  };

  // Armas que o jogo ja tem (inventory.js, equipId) -> arma da tabela
  const DO_JOGO = { sword: 'espada_longa', axe: 'machadinha', fire_sword: 'espada_longa' };

  // Resumo para o jogo: ao equipar e ao atacar
  function avaliar(raceCode, classCode, armaId) {
    const e = empunhadura(raceCode, armaId), prof = proficiente(raceCode, classCode, armaId);
    return { ...e, proficiente: prof, ataque: prof ? 0 : PENALIDADE_SEM_PROFICIENCIA };
  }

  window.SurittoArmas = { ARMAS, PROF_CLASSE, PROF_RACA, ARMA_INICIAL, DO_JOGO, PENALIDADE_SEM_PROFICIENCIA, empunhadura, proficiente, avaliar };
})();
