module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Falta el parámetro id, ej: /api/team?id=769' });

  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return res.status(500).json({ error: 'API_FOOTBALL_KEY no configurada en Vercel' });

  try {
    const r = await fetch(`https://api.football-data.org/v4/teams/${id}`, {
      headers: { 'X-Auth-Token': key }
    });
    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({ error: 'Football-Data.org rechazó la petición', status: r.status, detail: data });
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'proxy error', detail: e.message });
  }
};
