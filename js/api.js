// =============================================
// API CLIENT — Football-Data.org via proxy
// =============================================

// IDs estables de Football-Data.org (no cambian aunque el nombre varíe de ortografía)
const TEAM_ID_MAP = {
  769: 'mexico', 772: 'south_korea', 774: 'south_africa', 798: 'czech_republic',
  828: 'canada', 788: 'switzerland', 8030: 'qatar', 1060: 'bosnia',
  764: 'brazil', 815: 'morocco', 8873: 'scotland', 836: 'haiti',
  771: 'usa', 779: 'australia', 761: 'paraguay', 803: 'turkey',
  759: 'germany', 791: 'ecuador', 1935: 'ivory_coast', 9460: 'curacao',
  8601: 'netherlands', 766: 'japan', 792: 'sweden', 802: 'tunisia',
  805: 'belgium', 840: 'iran', 825: 'egypt', 783: 'new_zealand',
  760: 'spain', 758: 'uruguay', 801: 'saudi_arabia', 1930: 'cape_verde',
  773: 'france', 804: 'senegal', 8872: 'norway', 8062: 'iraq',
  762: 'argentina', 816: 'austria', 778: 'algeria', 8049: 'jordan',
  765: 'portugal', 818: 'colombia', 8070: 'uzbekistan', 1934: 'dr_congo',
  770: 'england', 799: 'croatia', 1836: 'panama', 763: 'ghana',
};

// Respaldo por nombre, en caso de que algún equipo no esté en TEAM_ID_MAP
const TEAM_NAME_MAP = {
  // Grupo A
  'Mexico': 'mexico',
  'South Korea': 'south_korea', 'Korea Republic': 'south_korea',
  'South Africa': 'south_africa',
  'Czech Republic': 'czech_republic', 'Czechia': 'czech_republic',
  // Grupo B
  'Canada': 'canada',
  'Switzerland': 'switzerland',
  'Qatar': 'qatar',
  'Bosnia and Herzegovina': 'bosnia', 'Bosnia-Herzegovina': 'bosnia',
  // Grupo C
  'Brazil': 'brazil',
  'Morocco': 'morocco',
  'Scotland': 'scotland',
  'Haiti': 'haiti',
  // Grupo D
  'USA': 'usa', 'United States': 'usa',
  'Australia': 'australia',
  'Paraguay': 'paraguay',
  'Turkey': 'turkey', 'Türkiye': 'turkey',
  // Grupo E
  'Germany': 'germany',
  'Ecuador': 'ecuador',
  "Côte d'Ivoire": 'ivory_coast', 'Ivory Coast': 'ivory_coast',
  'Curaçao': 'curacao', 'Curacao': 'curacao',
  // Grupo F
  'Netherlands': 'netherlands',
  'Japan': 'japan',
  'Sweden': 'sweden',
  'Tunisia': 'tunisia',
  // Grupo G
  'Belgium': 'belgium',
  'Iran': 'iran', 'IR Iran': 'iran',
  'Egypt': 'egypt',
  'New Zealand': 'new_zealand',
  // Grupo H
  'Spain': 'spain',
  'Uruguay': 'uruguay',
  'Saudi Arabia': 'saudi_arabia',
  'Cape Verde': 'cape_verde',
  // Grupo I
  'France': 'france',
  'Senegal': 'senegal',
  'Norway': 'norway',
  'Iraq': 'iraq',
  // Grupo J
  'Argentina': 'argentina',
  'Austria': 'austria',
  'Algeria': 'algeria',
  'Jordan': 'jordan',
  // Grupo K
  'Portugal': 'portugal',
  'Colombia': 'colombia',
  'Uzbekistan': 'uzbekistan',
  'DR Congo': 'dr_congo', 'Congo DR': 'dr_congo',
  'Congo, DR': 'dr_congo', 'Democratic Republic of Congo': 'dr_congo',
  // Grupo L
  'England': 'england',
  'Croatia': 'croatia',
  'Panama': 'panama',
  'Ghana': 'ghana',
};

const STATUS_MAP = {
  'SCHEDULED': 'scheduled',
  'TIMED':     'scheduled',
  'IN_PLAY':   'live',
  'PAUSED':    'live',
  'HALFTIME':  'live',
  'FINISHED':  'finished',
  'AWARDED':   'finished',
  'SUSPENDED': 'scheduled',
  'POSTPONED': 'scheduled',
  'CANCELLED': 'scheduled',
};

function mapApiMatch(m) {
  const homeKey = TEAM_ID_MAP[m.homeTeam.id] || TEAM_NAME_MAP[m.homeTeam.name] || TEAM_NAME_MAP[m.homeTeam.shortName];
  const awayKey = TEAM_ID_MAP[m.awayTeam.id] || TEAM_NAME_MAP[m.awayTeam.name] || TEAM_NAME_MAP[m.awayTeam.shortName];
  if (!homeKey || !awayKey || !m.group) {
    console.warn(`[API] Sin mapeo: "${m.homeTeam.name}" vs "${m.awayTeam.name}"`);
    return null;
  }

  const status = STATUS_MAP[m.status] || 'scheduled';
  const ft = m.score?.fullTime;
  const real_score = (status === 'finished' || status === 'live') && ft?.home != null
    ? { home: ft.home, away: ft.away }
    : null;

  const d = new Date(m.utcDate);
  const date = d.toLocaleDateString('en-CA');                                  // YYYY-MM-DD en horario local
  const time = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

  return {
    id: 'API_' + m.id,
    group: m.group.replace('GROUP_', ''),
    matchday: m.matchday,
    home: homeKey,
    away: awayKey,
    date, time, status, real_score,
  };
}

const ApiStore = {
  matches: [],
  lastFetch: null,

  async refresh() {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();

      if (!res.ok) {
        console.error('[API] Error del servidor:', data);
        return false;
      }

      if (!Array.isArray(data.matches)) {
        console.error('[API] Respuesta inesperada (sin array matches):', data);
        return false;
      }

      const mapped = data.matches
        .filter(m => m.stage === 'GROUP_STAGE')
        .map(mapApiMatch)
        .filter(Boolean);

      console.log(`[API] ${mapped.length}/${data.matches.length} partidos de fase de grupos mapeados`);

      if (mapped.length > 0) this.matches = mapped;
      this.lastFetch = Date.now();
      return true;
    } catch (e) {
      console.error('[API] fetch fallido:', e.message);
      return false;
    }
  },

  hasLiveMatches() {
    return this.matches.some(m => m.status === 'live');
  },
};
