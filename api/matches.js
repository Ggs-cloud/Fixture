let cache = { data: null, timestamp: 0 };
const TTL_MS = 45_000; // ventana en la que se comparte la misma respuesta entre todos los usuarios

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < TTL_MS) {
    return res.status(200).json(cache.data);
  }

  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return res.status(500).json({ error: 'API_FOOTBALL_KEY no configurada en Vercel' });
  }

  try {
    const r = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': key } }
    );
    const data = await r.json();

    if (!r.ok) {
      // si nos rechazan (ej. 429 por cuota), preferimos servir la última copia buena a dejar al usuario sin nada
      if (cache.data) return res.status(200).json(cache.data);
      return res.status(r.status).json({
        error: 'Football-Data.org rechazó la petición',
        status: r.status,
        detail: data
      });
    }

    cache = { data, timestamp: now };
    res.status(200).json(data);
  } catch (e) {
    if (cache.data) return res.status(200).json(cache.data);
    res.status(500).json({ error: 'proxy error', detail: e.message });
  }
};
