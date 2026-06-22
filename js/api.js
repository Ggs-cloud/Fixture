// =============================================
// API CLIENT — Football-Data.org via proxy
// =============================================

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
  const homeKey = TEAM_NAME_MAP[m.homeTeam.name] || TEAM_NAME_MAP[m.homeTeam.shortName];
  const awayKey = TEAM_NAME_MAP[m.awayTeam.name] || TEAM_NAME_MAP[m.awayTeam.shortName];
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
