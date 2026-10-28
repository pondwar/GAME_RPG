// town_plans.js - Plantas de predios e mapas de cidades/vilas (so dados; quem monta e o js/town_builder.js)
//
// Malha: celulas de piso (losango 108x54). (i, j) = coluna/linha da celula:
//   +i anda para a direita-baixo na tela (eixo a = 54, 27), +j para a esquerda-baixo (eixo b = -54, 27).
// Paredes de um predio W x D (W celulas em i, D em j):
//   N = lado j=0 (fundo-direita)   W = lado i=0 (fundo-esquerda)
//   S = lado j=D (frente-esquerda) E = lado i=W (frente-direita)
// Porta: { side, at, span, type } - centro em `at + span/2` celulas ao longo do lado.
// Divisorias: { axis: 'a' (corre em i, na linha j=line) | 'b' (corre em j, na coluna i=line), from, to, door }.
// Movel: [tipo, i, j, rot]. rot segue o construtor:
//   estante/adega: 0 encostada em N, 90 em W, 180 em S, 270 em E   cadeira: costas em 0:-i 90:-j 180:+i 270:+j
//   cama: 0 deitada em +i (cabeceira em i), 90 deitada em +j (cabeceira em j)   lareira: 0 boca para +j, 90 para +i
// `transpose: true` no mapa da vila gira a planta (troca i<->j, N<->W, S<->E e ajusta os rots).

window.SURITTO_BUILDING_PLANS = {
  casa_pequena: {
    name: 'Casa pequena (casal)', W: 5, D: 4,
    floor: 'dungeon_floor_wood', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 2 }],
    furniture: [
      ['fireplace', 2, 0, 0], ['bookshelf', 1, 0, 0],
      ['bed', 3, 0, 90], ['bed', 4, 0, 90],
      ['chest', 0, 1, 90],
      ['table', 1, 2, 0], ['chair', 0, 2, 0], ['chair', 1, 3, 270],
      ['lantern', 0, 3, 0]
    ]
  },

  casa_familia: {
    name: 'Casa de familia (3 a 5 pessoas)', W: 7, D: 5,
    floor: 'dungeon_floor_wood', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 3 }],
    furniture: [
      ['winerack', 1, 0, 0], ['bookshelf', 2, 0, 0], ['fireplace', 3, 0, 0],
      ['bed', 5, 0, 90], ['bed', 6, 0, 90],                     // casal
      ['bed', 0, 2, 0], ['bed', 0, 3, 0],                       // filhos (o 5o leito vem com `beds: 5`)
      ['table', 4, 3, 0], ['chair', 3, 3, 0], ['chair', 5, 3, 180], ['chair', 4, 2, 90],
      ['counter', 6, 2, 0], ['barrel', 6, 3, 0], ['chest', 6, 4, 0],
      ['lantern', 2, 4, 0]
    ],
    extraBed: ['bed', 0, 4, 0]
  },

  casa_nobre: {
    name: 'Casa nobre', W: 10, D: 7,
    floor: 'dungeon_floor_parquet', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 4, span: 2, type: 'dungeon_portal_wood_wide' }],
    furniture: [
      ['candelabra', 0, 0, 0], ['bookshelf', 1, 0, 0], ['bookshelf', 2, 0, 0], ['bookshelf', 3, 0, 0],
      ['fireplace', 4, 0, 0],
      ['bed', 7, 0, 90], ['bed', 8, 0, 90], ['candelabra', 9, 0, 0],
      ['winerack', 0, 2, 90], ['bookshelf', 0, 3, 90], ['chest', 0, 5, 90],
      ['table', 3, 3, 0], ['table', 4, 3, 0], ['table', 5, 3, 0], ['table', 6, 3, 0],
      ['chair', 3, 2, 90], ['chair', 4, 2, 90], ['chair', 5, 2, 90], ['chair', 6, 2, 90],
      ['chair', 3, 4, 270], ['chair', 4, 4, 270], ['chair', 5, 4, 270], ['chair', 6, 4, 270],
      ['chair', 2, 3, 0], ['chair', 7, 3, 180],
      ['chest', 9, 3, 90], ['barrel', 9, 6, 0],
      ['candelabra', 1, 6, 0], ['candelabra', 8, 6, 0]
    ]
  },

  prefeitura: {
    name: 'Prefeitura', W: 11, D: 9,
    floor: 'dungeon_floor_stone_polished', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 5, span: 2, type: 'dungeon_portal_wood_wide' }],
    furniture: [
      // trono e estandarte (palace.js) passam de 150 px e furam o telhado: aqui o prefeito usa mesa e cadeira
      ['bookshelf', 4, 0, 0], ['chair', 5, 1, 90], ['table', 5, 2, 0], ['bookshelf', 6, 0, 0],
      ['candelabra', 3, 1, 0], ['candelabra', 7, 1, 0],
      ['bookshelf', 0, 1, 90], ['bookshelf', 0, 2, 90], ['bookshelf', 0, 3, 90], ['bookshelf', 0, 4, 90],
      ['table', 3, 4, 0], ['table', 4, 4, 0], ['table', 5, 4, 0], ['table', 6, 4, 0], ['table', 7, 4, 0],
      ['chair', 3, 3, 90], ['chair', 4, 3, 90], ['chair', 6, 3, 90], ['chair', 7, 3, 90],
      ['chair', 3, 5, 270], ['chair', 4, 5, 270], ['chair', 6, 5, 270], ['chair', 7, 5, 270],
      ['chair', 2, 4, 0], ['chair', 8, 4, 180],
      ['counter', 9, 6, 0], ['counter', 10, 6, 0], ['chest', 10, 0, 90], ['chest', 10, 1, 90],
      ['lantern', 1, 8, 0], ['lantern', 9, 8, 0]
    ]
  },

  cadeia: {
    name: 'Cadeia', W: 8, D: 6,
    floor: 'dungeon_floor_stone', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 2 }],
    partitions: [
      { axis: 'a', line: 3, from: 0, to: 8, doors: [{ at: 2, type: 'dungeon_gate_iron_door_01' }, { at: 6, type: 'dungeon_gate_iron_door_01' }] },
      { axis: 'b', line: 4, from: 0, to: 3 }                     // duas celas
    ],
    furniture: [
      ['bed', 0, 0, 90], ['barrel', 3, 0, 0],                    // cela 1
      ['bed', 7, 0, 90], ['barrel', 4, 0, 0],                    // cela 2
      ['counter', 5, 4, 0], ['counter', 6, 4, 0], ['chair', 5, 5, 270],
      ['chest', 7, 5, 0], ['bookshelf', 0, 4, 90], ['lantern', 0, 5, 0], ['lantern', 7, 3, 0]
    ]
  },

  mercado: {
    name: 'Mercado', W: 10, D: 7,
    floor: 'dungeon_floor_terracotta', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 4, span: 2, type: 'dungeon_portal_wood_wide' }],
    furniture: [
      ['barrel', 0, 0, 0], ['barrel', 1, 0, 0], ['winerack', 2, 0, 0], ['winerack', 3, 0, 0],
      ['bookshelf', 6, 0, 0], ['chest', 7, 0, 0], ['chest', 8, 0, 0], ['barrel', 9, 0, 0],
      ['counter', 2, 2, 0], ['counter', 3, 2, 0], ['counter', 4, 2, 0],
      ['counter', 6, 2, 0], ['counter', 7, 2, 0], ['counter', 8, 2, 0],
      ['counter_big', 0, 4, 90], ['barrel', 0, 6, 0],
      ['counter_big', 9, 4, 90], ['barrel', 9, 3, 0],
      ['lantern', 3, 6, 0], ['lantern', 7, 6, 0]
    ]
  },

  bar: {
    name: 'Bar (taverna)', W: 10, D: 8,
    floor: 'dungeon_floor_wood', roof: 'dungeon_roof_tile',
    doors: [{ side: 'S', at: 4 }],
    furniture: [
      ['fireplace', 2, 0, 0], ['bookshelf', 1, 0, 0],
      ['winerack', 6, 0, 0], ['winerack', 7, 0, 0], ['winerack', 8, 0, 0], ['barrel', 9, 0, 0],
      ['counter_big', 6, 2, 0], ['counter', 8, 2, 0], ['barrel', 9, 1, 0], ['barrel', 9, 2, 0],
      ['chair', 6, 3, 270], ['chair', 7, 3, 270], ['chair', 8, 3, 270],
      ['table', 2, 3, 0], ['chair', 1, 3, 0], ['chair', 3, 3, 180], ['chair', 2, 2, 90],
      ['table', 2, 6, 0], ['chair', 1, 6, 0], ['chair', 3, 6, 180], ['chair', 2, 5, 90],
      ['table', 6, 6, 0], ['table', 7, 6, 0], ['chair', 5, 6, 0], ['chair', 8, 6, 180], ['chair', 6, 5, 90], ['chair', 7, 5, 90],
      ['candelabra', 0, 7, 0], ['lantern', 9, 7, 0], ['chest', 0, 1, 90]
    ]
  }
};

// Vilas e cidades. center = celula (0,0) no mundo. Ruas e praca sao pisos; predios entram por cima.
window.SURITTO_TOWNS = {
  vila_inicial: {
    name: null,                                 // null = nome gerado pela macro-regiao (js/regions.js)
    // 8.6° L, 50.6° N. Centro alinhado a malha de pisos da casa do David (o piso (0,0) dela e a celula (29,-11) da vila)
    center: { x: 159084, y: 699732 },
    clearMargin: 4,                             // celulas sem arvores alem dos predios e ruas
    streets: [
      { i0: -38, j0: -1, W: 86, D: 3, floor: 'dungeon_floor_stone' },          // rua principal (eixo i)
      { i0: -1, j0: -8, W: 3, D: 46, floor: 'dungeon_floor_stone' },           // rua da prefeitura (eixo j)
      { i0: -6, j0: -6, W: 13, D: 13, floor: 'dungeon_floor_stone_polished' }  // praca
    ],
    props: [
      ['statue_zeus', 0, 0, 0],
      ['lantern', -6, -6, 0], ['lantern', 6, -6, 0], ['lantern', -6, 6, 0], ['lantern', 6, 6, 0],
      ['lantern', -14, -2, 0], ['lantern', -24, -2, 0], ['lantern', -34, -2, 0],
      ['lantern', 14, 2, 0], ['lantern', 26, 2, 0], ['lantern', 38, 2, 0],
      ['lantern', 2, 14, 0], ['lantern', -2, 26, 0]
    ],
    buildings: [
      // civicos
      { id: 'prefeitura', plan: 'prefeitura', i0: -6, j0: -17 },
      { id: 'bar', plan: 'bar', i0: 8, j0: -10 },
      { id: 'mercado', plan: 'mercado', i0: 11, j0: 3, door: 'N' },
      { id: 'cadeia', plan: 'cadeia', i0: -16, j0: -8 },
      // nobreza
      { id: 'nobre_1', plan: 'casa_nobre', i0: -21, j0: 3, door: 'N' },
      { id: 'nobre_2', plan: 'casa_nobre', transpose: true, i0: -10, j0: 8 },
      { id: 'nobre_3', plan: 'casa_nobre', transpose: true, i0: 3, j0: 8, door: 'W' },
      // familias
      { id: 'familia_1', plan: 'casa_familia', i0: 20, j0: -7 },
      { id: 'familia_2', plan: 'casa_familia', i0: 23, j0: 3, door: 'N', beds: 5 },
      { id: 'familia_3', plan: 'casa_familia', i0: -25, j0: -7, beds: 5 },
      { id: 'familia_4', plan: 'casa_familia', i0: -30, j0: 3, door: 'N' },
      { id: 'familia_5', plan: 'casa_familia', transpose: true, i0: -8, j0: 20, beds: 5 },
      { id: 'familia_6', plan: 'casa_familia', transpose: true, i0: 3, j0: 20, door: 'W' },
      { id: 'familia_7', plan: 'casa_familia', transpose: true, i0: 3, j0: 29, door: 'W', beds: 5 },
      { id: 'familia_8', plan: 'casa_familia', i0: 32, j0: 3, door: 'N' },
      // casais
      { id: 'casa_david', reserved: true, i0: 29, j0: -11, W: 6, D: 9, note: 'Casa do David (construida a mao, fica no banco como construcao do jogador)' },
      { id: 'pequena_2', plan: 'casa_pequena', i0: 41, j0: 3, door: 'N' },
      { id: 'pequena_3', plan: 'casa_pequena', i0: -33, j0: -6 },
      { id: 'pequena_4', plan: 'casa_pequena', i0: -37, j0: 3, door: 'N' },
      { id: 'pequena_5', plan: 'casa_pequena', transpose: true, i0: -6, j0: 29 }
    ]
  }
};
