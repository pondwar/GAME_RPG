// regions.js - Macro-regioes culturais de Suritto e gerador de nomes de lugares.
// Cada macro-regiao corresponde a uma regiao real da Terra pelo FUSO (UTC) e pela LATITUDE do ponto no mapa.
// No multiplayer, o jogador nasce numa cidade-estado da macro-regiao do seu fuso real (ver docs/GDD_MAPA_MUNDI...).
// Os nomes sao inventados, com sons da lingua da regiao (nao sao cidades reais), e saem sempre iguais para a
// mesma semente: `SurittoRegions.placeName(regiao, 'vila_inicial')`.
(function () {
  // utc: [min, max] (inclusive); lat: [min, max] em graus (+N / -S). A primeira que bater vence.
  const MACRO_REGIONS = [
    { id: 'ilhas_ocidentais', name: 'Ilhas do Oeste', real: 'Reino Unido & Irlanda', lang: 'Inglês antigo', utc: [0, 0], lat: [35, 90],
      gen: { pre: ['Ash', 'Brad', 'Thorn', 'Wick', 'Hal', 'Elm', 'Stan', 'Bram', 'Gray', 'Kings', 'Black', 'Wold', 'Har', 'Ox', 'Fen', 'Red', 'Wex', 'Mar', 'Hart', 'Lyn'],
             suf: ['ford', 'bury', 'ham', 'wick', 'ton', 'leigh', 'mere', 'stead', 'by', 'worth', 'dale', 'brook', 'field', 'cester', 'minster', 'gate'] } },
    { id: 'iberia', name: 'Península Ibérica', real: 'Portugal & Espanha', lang: 'Português / Castelhano', utc: [-1, 1], lat: [15, 35],
      gen: { lead: ['Vila ', 'Santa ', 'Porto ', 'Castro ', 'San ', 'Monte ', 'Torre ', ''], pre: ['Alv', 'Mir', 'Cast', 'Lor', 'Val', 'Tor', 'Ben', 'Rib', 'Fer', 'Sal', 'Ourem', 'Lus'],
             suf: ['ado', 'eira', 'elo', 'ença', 'ança', 'osa', 'al', 'ares', 'ilha', 'edo'] } },
    { id: 'galia', name: 'Gália', real: 'França & Europa Central', lang: 'Francês antigo', utc: [1, 1], lat: [35, 55],
      gen: { pre: ['Beau', 'Mont', 'Val', 'Fonte', 'Roche', 'Belle', 'Cler', 'Lou', 'Ver', 'Brai', 'Cham', 'Mar'], suf: ['mont', 'ville', 'court', 'vire', 'lac', 'fort', 'bois', 'rive', 'champ', 'lieu', 'pré'] } },
    { id: 'norte_europeu', name: 'Norte Europeu', real: 'Escandinávia', lang: 'Nórdico antigo', utc: [1, 3], lat: [55, 90],
      gen: { pre: ['Nord', 'Skel', 'Hrafn', 'Ulf', 'Bjorn', 'Sval', 'Frey', 'Grim', 'Thor', 'Vik', 'Ask', 'Sig'], suf: ['heim', 'vik', 'fjord', 'stad', 'by', 'gard', 'holm', 'dal', 'nes'] } },
    { id: 'europa_oriental', name: 'Europa Oriental', real: 'Leste Europeu & Rússia', lang: 'Eslavo antigo', utc: [2, 4], lat: [35, 90],
      gen: { pre: ['Kras', 'Vol', 'Bel', 'Mir', 'Dob', 'Sver', 'Zlat', 'Grad', 'Kov', 'Yar', 'Lud', 'Bor'], suf: ['ograd', 'ovar', 'insk', 'omir', 'ava', 'ets', 'ovo', 'ica', 'ovsk'] } },
    { id: 'oriente_medio', name: 'Oriente Médio', real: 'Arábia & Pérsia', lang: 'Árabe / Persa', utc: [3, 4], lat: [0, 35],
      gen: { lead: ['Al-', 'Dar ', 'Bab ', '', ''], pre: ['Zahr', 'Qasr', 'Nur', 'Rimal', 'Sahr', 'Jabal', 'Ward', 'Fayr', 'Hadi', 'Misk', 'Tar'], suf: ['a', 'an', 'iya', 'abad', 'ir', ''] } },
    { id: 'africa', name: 'África', real: 'África', lang: 'Banto / Iorubá', utc: [-1, 3], lat: [-90, 15],
      gen: { pre: ['Zul', 'Kar', 'Mbe', 'Nya', 'Ota', 'Ilo', 'Kas', 'Tem', 'Ade', 'Ba', 'Ko'], suf: ['imba', 'ani', 'oro', 'ala', 'ende', 'uru', 'ombe', 'asi', 'ika'] } },
    { id: 'sudoeste_asiatico', name: 'Sudoeste Asiático', real: 'Índia & Mongólia', lang: 'Sânscrito / Mongol', utc: [5, 6], lat: [-90, 90],
      gen: { pre: ['Raja', 'Chandra', 'Sura', 'Ganga', 'Indra', 'Kali', 'Hari', 'Altan', 'Khan', 'Bayan', 'Deva'], suf: ['pur', 'abad', 'nagar', 'garh', 'pura', 'tara', 'khot', 'tor'] } },
    { id: 'china', name: 'Norte Asiático', real: 'China', lang: 'Chinês antigo', utc: [7, 8], lat: [20, 90],
      gen: { pre: ['Tian', 'Long', 'Shan', 'Bai', 'Jin', 'Hua', 'Ming', 'Feng', 'Yun', 'Qing', 'He', 'Lian'], suf: ['zhou', 'jing', 'an', 'yang', 'men', 'cheng', 'ling', 'hai', 'shui'], join: '-' } },
    { id: 'japao', name: 'Leste Asiático', real: 'Japão', lang: 'Japonês antigo', utc: [9, 9], lat: [30, 90],
      gen: { pre: ['Hana', 'Kawa', 'Yama', 'Mori', 'Taka', 'Kiri', 'Sakura', 'Hoshi', 'Tsuki', 'Kaze'], suf: ['mura', 'zaki', 'shima', 'oka', 'hara', 'gawa', 'yama', 'no-sato'] } },
    { id: 'sul_asiatico', name: 'Sul Asiático', real: 'Coreia, Indochina & Indonésia', lang: 'Coreano / Tai / Malaio', utc: [7, 9], lat: [-90, 90],
      gen: { pre: ['Han', 'Seo', 'Dae', 'Ban', 'Chiang', 'Sukh', 'Phu', 'Dai', 'Bin', 'Jaya', 'Suri'], suf: ['gang', 'san', 'won', 'thong', 'pura', 'long', 'khet', 'karta', 'dong'] } },
    { id: 'oceania', name: 'Oceania', real: 'Austrália & Nova Zelândia', lang: 'Maori / Aborígene', utc: [10, 12], lat: [-90, 90],
      gen: { pre: ['Kora', 'Aroha', 'Wai', 'Tama', 'Moana', 'Kiri', 'Rangi', 'Taru', 'Mara', 'Ulu'], suf: ['roa', 'nui', 'kai', 'rua', 'tea', 'tangi', 'kura', 'wera'] } },
    { id: 'oceania_leste', name: 'Oceania', real: 'Ilhas do Pacífico', lang: 'Polinésio', utc: [-12, -10], lat: [-90, 90],
      gen: { pre: ['Moana', 'Hau', 'Tiki', 'Lani', 'Mau', 'Pele'], suf: ['nui', 'kea', 'loa', 'iti', 'ahu'] } },
    { id: 'america_norte', name: 'América do Norte', real: 'EUA & Canadá', lang: 'Inglês pioneiro / nativo', utc: [-9, -4], lat: [25, 90],
      gen: { lead: ['Fort ', '', '', ''], pre: ['Red', 'Pine', 'Stone', 'Eagle', 'Bear', 'Cedar', 'Silver', 'Iron', 'Elk', 'Maple', 'Wolf'], suf: [' Creek', ' Ridge', 'wood', ' Falls', ' Hollow', ' Crossing', 'ton', 'ville', ' Rock'] } },
    { id: 'america_central', name: 'América Central', real: 'México & América Central', lang: 'Náuatle / Maia', utc: [-8, -5], lat: [0, 25],
      gen: { pre: ['Itza', 'Kukul', 'Tlal', 'Xoco', 'Teo', 'Chak', 'Ixi', 'Quetz', 'Ahua', 'Yax'], suf: ['pan', 'tlan', 'co', 'tikal', 'ché', 'apa', 'tepec', 'cal'] } },
    { id: 'america_sul_hispanica', name: 'América do Sul Hispânica', real: 'Andes & Pampas', lang: 'Castelhano / Quéchua', utc: [-6, -4], lat: [-90, 10],
      gen: { lead: ['San ', 'Santa ', 'Villa ', 'Puerto ', 'Alto ', 'Nueva '], pre: ['Morel', 'Valdiv', 'Sorat', 'Arequ', 'Rosar', 'Mendo', 'Salt', 'Tarij', 'Pampl', 'Cuzc'], suf: ['ia', 'os', 'o', 'ana', 'illo', 'ena', 'ales'] } },
    { id: 'brasil', name: 'Terras de Santa Cruz', real: 'Brasil', lang: 'Português / Tupi', utc: [-3, -2], lat: [-90, 90],
      gen: { lead: ['Vila ', 'Porto ', 'Santa ', 'São ', 'Arraial ', ''], pre: ['Itaba', 'Jacare', 'Piraqu', 'Ubira', 'Araru', 'Itapo', 'Guara', 'Tamba', 'Caet', 'Ipan'], suf: ['í', 'ema', 'ara', 'ã', 'ú', 'ava', 'iba'] } },
    { id: 'mares', name: 'Mares Ocidentais', real: 'Ilhas do Atlântico', lang: 'Língua franca', utc: [-12, 12], lat: [-90, 90],
      gen: { lead: ['Ilha ', 'Porto ', 'Cabo '], pre: ['Bren', 'Sal', 'Mar', 'Cor', 'Ves', 'Alba'], suf: ['ena', 'mar', 'ora', 'ais', 'una'] } }
  ];

  // hash/rng deterministico (mesma semente -> mesmo nome)
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = hashStr(String(seed)); return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const SurittoRegions = {
    MACRO_REGIONS,
    // Macro-regiao de um ponto do mundo (usa o fuso e a latitude do WorldCoordinates)
    at(world, x, y) {
      const utc = world.getTimezoneInfo(x).utcOffset, lat = world.getLatitudeDeg(y);
      return MACRO_REGIONS.find(r => utc >= r.utc[0] && utc <= r.utc[1] && lat >= r.lat[0] && lat <= r.lat[1]) || MACRO_REGIONS[MACRO_REGIONS.length - 1];
    },
    placeName(region, seed) {
      const g = region.gen, r = rng(region.id + ':' + seed);
      const lead = g.lead ? pick(r, g.lead) : '';
      const pre = pick(r, g.pre); let suf = pick(r, g.suf);
      if (g.join === '-') suf = cap(suf);
      return lead + pre + (g.join || '') + suf;
    }
  };
  window.SurittoRegions = SurittoRegions;
})();
