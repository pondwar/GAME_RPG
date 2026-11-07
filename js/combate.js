// combate.js - Ficha de ataque das armas e rolagem de combate pela ficha D&D, em tempo real (estilo WoW, sem turnos).
//
// Ataque basico: clicar (ou segurar o botao) ataca no ritmo da arma. Cada arma tem:
//   mov     - o movimento: 'corte' (espada, arco de lado), 'machadada' (ergue e desce: machados, clava),
//             'estocada' (empurra a ponta para a frente: lanca, adaga, espada curta), 'soco' (sem arma)
//   tempo   - segundos entre um golpe e o proximo (a "velocidade da arma" do WoW; o d20 decide se acerta)
//   anim    - quanto dura o movimento (o resto do tempo o boneco volta para a guarda)
//   alcance - distancia do golpe, em px do mundo (lanca alcanca mais)
//   folego  - estamina gasta por golpe (arma pesada cansa mais)
//   dano    - so quando difere da tabela do D&D (js/armas.js)
// O dano so entra no IMPACTO (quando a lamina chega), nao no clique.
//
// Rolagem (D&D 5e, SRD 5.1): d20 + atributo + proficiencia (+2; sem saber usar a arma: -5, Tormenta20) contra a
// Defesa do alvo. 20 natural = critico (rola os dados da arma duas vezes). Dano = dados da arma + atributo, vezes
// ESCALA (os bichos do jogo tem a vida do livro x ~3; o jogador tem x 8, ruleset.js HP_SCALE).
(function () {
  const FICHA = {
    punho:        { mov: 'soco',      tempo: 0.60, anim: 0.34, alcance: 60,  folego: 3, dano: '1' },
    adaga:        { mov: 'estocada',  tempo: 0.70, anim: 0.36, alcance: 65,  folego: 4 },
    espada_curta: { mov: 'estocada',  tempo: 0.85, anim: 0.42, alcance: 75,  folego: 5 },
    clava:        { mov: 'machadada', tempo: 1.00, anim: 0.50, alcance: 75,  folego: 5 },
    machadinha:   { mov: 'machadada', tempo: 1.00, anim: 0.52, alcance: 75,  folego: 6 },
    sword:        { mov: 'corte',     tempo: 1.10, anim: 0.52, alcance: 85,  folego: 7 },
    fire_sword:   { mov: 'corte',     tempo: 1.10, anim: 0.52, alcance: 85,  folego: 7, extra: '1d6' },   // +1d6 de fogo
    lanca:        { mov: 'estocada',  tempo: 1.25, anim: 0.58, alcance: 120, folego: 7 },
    axe:          { mov: 'machadada', tempo: 1.50, anim: 0.75, alcance: 85,  folego: 9, dano: '1d8' }     // machado de lenhador, duas maos
  };
  const ESCALA = 2.5;
  const PADRAO = FICHA.sword;

  // Linha do tempo de cada movimento (fracao de anim): quando chega no alto (ergueu), quando bate, quando volta.
  // A batida e o momento do dano. Estocada: recua um pouco e avanca o corpo (avanco em px)
  const TEMPOS = {
    corte:     { alto: 0.18, bate: 0.45, volta: 0.80 },
    machadada: { alto: 0.12, bate: 0.58, volta: 0.88 },
    estocada:  { alto: 0.00, bate: 0.38, volta: 0.80, avanco: 7 },
    soco:      { alto: 0.00, bate: 0.40, volta: 0.80, avanco: 3 }
  };

  const ficha = (w) => (w ? FICHA[w] || PADRAO : FICHA.punho);

  function dado(txt) {          // '2d6' -> soma; '3' -> 3
    const m = /^(\d+)d(\d+)$/.exec(txt || '');
    if (!m) return Number(txt) || 0;
    let s = 0;
    for (let i = 0; i < +m[1]; i++) s += 1 + Math.floor(Math.random() * +m[2]);
    return s;
  }

  // Ataque do jogador contra um alvo de Defesa `defesa`. Devolve { acertou, critico, d20, total, dano, texto }
  function rolar(player, w, defesa) {
    const Ar = window.SurittoArmas, st = (window.diceSystem && window.diceSystem.stats) || {};
    const id = w && Ar ? (Ar.DO_JOGO[w] || w) : null;
    const arma = id && Ar ? Ar.ARMAS[id] : null, f = ficha(w);
    // atributo: Forca; arma de acuidade usa a melhor entre Forca e Destreza
    const forca = st.forca || 0, des = st.destreza || 0;
    const atr = arma && (arma.props.acuidade || arma.props.distancia) ? Math.max(forca, des) : forca;
    const prof = !w ? 2 : (Ar && player.race ? (Ar.proficiente(player.race, player.cls, id) ? 2 : Ar.PENALIDADE_SEM_PROFICIENCIA) : 2);
    let d20 = 1 + Math.floor(Math.random() * 20);
    if (d20 === 1 && player.race === 'halfling') d20 = 1 + Math.floor(Math.random() * 20);   // Sortudo: rola de novo o 1
    const total = d20 + atr + prof;
    const critico = d20 === 20, acertou = critico || (d20 !== 1 && total >= defesa);
    let dano = 0;
    if (acertou) {
      // duas maos (versatil) quando a arma pede ou quando a raca pequena segura com as duas
      const maos = arma && Ar && player.race ? Ar.empunhadura(player.race, id).maos : 1;
      const dd = f.dano || (arma && maos === 2 && arma.props.versatil) || (arma && arma.dano) || '1d4';
      let base = dado(dd) + (critico ? dado(dd) : 0);
      if (critico && player.race === 'meio_orc') base += dado(dd.replace(/^\d+/, '1'));     // Ataques selvagens
      if (f.extra) base += dado(f.extra) + (critico ? dado(f.extra) : 0);
      dano = Math.max(1, Math.round((base + atr) * ESCALA));
    }
    const sinal = (n) => (n >= 0 ? '+' : '') + n;
    return { acertou, critico, d20, total, dano, texto: `d20 ${d20} ${sinal(atr)} ${sinal(prof)} = ${total} vs ${defesa}` };
  }

  // Quadros-chave de uma folha de golpe, achados pela mao medida em cada quadro (manifest 'maos', medir_maos.py),
  // para servir a toda raca (as folhas tem tamanhos diferentes). f = +1 olhando para a direita.
  //   alto  = a mao mais alta (ergueu a arma);
  //   bate  = depois do alto, a mao mais baixa (a arma desceu no alvo);
  //   frente = a mao mais para a frente sem estar acima da cabeca (estocada)
  function chaves(set, f) {
    const n = set.length, m = (i) => set[i] && set[i].mao;
    let alto = 0, bate, frente = 0;
    for (let i = 0; i < n; i++) if (m(i) && m(alto) && m(i)[1] < m(alto)[1]) alto = i;
    let mf = -1e9;
    for (let i = 0; i < n; i++) if (m(i) && m(i)[1] > 0.4 && m(i)[0] * f > mf) { mf = m(i)[0] * f; frente = i; }
    // a batida tem de ficar na frente do corpo (alguns quadros de golpe mostram o braco de tras)
    let baixo = -1; bate = -1;
    const xa = m(alto) ? m(alto)[0] * f : 0;
    for (let i = alto + 1; i < n; i++) if (m(i) && m(i)[0] * f >= xa - 0.1 && m(i)[1] > baixo) { baixo = m(i)[1]; bate = i; }
    if (bate < 0) bate = frente;
    return { alto, bate, frente };
  }

  // Quadro do golpe no instante prog (0..1 da anim) e o avanco do corpo. idx -1 = boneco parado (guarda)
  function quadro(set, mov, prog, f) {
    const T = TEMPOS[mov] || TEMPOS.corte, k = chaves(set, f);
    const sub = (a, b, t) => Math.round(a + (b - a) * Math.min(1, Math.max(0, t)));
    let idx, av = 0;
    if (mov === 'estocada' || mov === 'soco') {
      // recua um pouco e estica de uma vez
      if (prog < T.bate) { idx = -1; av = -(T.avanco || 0) * 0.35 * (prog / T.bate); }
      else if (prog < T.volta) { idx = k.frente; av = T.avanco || 0; }
      else { idx = -1; av = (T.avanco || 0) * (1 - (prog - T.volta) / (1 - T.volta)); }
    } else {
      if (prog < T.alto) idx = 0;
      else if (prog < T.bate) idx = sub(0, k.alto, (prog - T.alto) / Math.max(0.01, (T.bate - T.alto) * 0.6));   // sobe e segura no alto
      else if (prog < T.volta) idx = k.bate;                                                                      // desce de uma vez
      else idx = -1;
    }
    return { idx, avanco: av * f, estocando: (mov === 'estocada' || mov === 'soco') && prog >= T.bate && prog < T.volta };
  }

  window.SurittoCombate = { FICHA, TEMPOS, ESCALA, ficha, rolar, dado, chaves, quadro };
})();
