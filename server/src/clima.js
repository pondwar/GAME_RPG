// clima.js - Clima real por latitude/longitude (Open-Meteo, gratis, sem chave). O servidor busca e guarda em cache,
// assim todos os jogadores da mesma regiao veem o mesmo tempo e o servico externo recebe poucas chamadas.
const TTL_MS = 15 * 60 * 1000;          // o dado do Open-Meteo atualiza de 15 em 15 minutos
const GRADE = 0.25;                     // graus: jogadores a ~25 km compartilham o mesmo pedido
const MAX_ENTRADAS = 500;
const cache = new Map();                // "lat,lon" -> { t, dados }

function arredonda(v) { return Math.round(v / GRADE) * GRADE; }

export async function climaReal(latIn, lonIn) {
  const lat = Math.max(-89.9, Math.min(89.9, arredonda(Number(latIn))));
  const lon = arredonda(((Number(lonIn) + 180) % 360 + 360) % 360 - 180);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('lat/lon invalidos');
  const chave = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const hit = cache.get(chave);
  if (hit && Date.now() - hit.t < TTL_MS) return { ...hit.dados, cache: true };

  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
    '&current=temperature_2m,precipitation,snowfall,weather_code,cloud_cover,wind_speed_10m,is_day&timezone=auto';
  const r = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'suritto-game' } });
  if (!r.ok) throw new Error('open-meteo ' + r.status);
  const c = (await r.json()).current;
  if (!c) throw new Error('open-meteo sem dados');
  const dados = {
    lat, lon, codigo: c.weather_code, temp: c.temperature_2m, chuva: c.precipitation, neve: c.snowfall,
    nuvens: c.cloud_cover, vento: c.wind_speed_10m, dia: !!c.is_day, medidoEm: c.time, fonte: 'open-meteo'
  };
  if (cache.size >= MAX_ENTRADAS) cache.delete(cache.keys().next().value);
  cache.set(chave, { t: Date.now(), dados });
  return { ...dados, cache: false };
}
