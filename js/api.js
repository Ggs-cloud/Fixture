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

const ApiStore = {
  cache: {},
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

      console.log(`[API] ${data.matches.length} partidos recibidos`);

      this.cache = {};
      let mapeados = 0;
      data.matches.forEach(m => {
        const homeKey = TEAM_NAME_MAP[m.homeTeam.name] || TEAM_NAME_MAP[m.homeTeam.shortName];
        const awayKey = TEAM_NAME_MAP[m.awayTeam.name] || TEAM_NAME_MAP[m.awayTeam.shortName];

        if (!homeKey || !awayKey) {
          console.warn(`[API] Sin mapeo: "${m.homeTeam.name}" vs "${m.awayTeam.name}"`);
          return;
        }

        const local = INITIAL_MATCHES.find(l => l.home === homeKey && l.away === awayKey);
        if (!local) {
          console.warn(`[API] Partido no encontrado en fixture local: ${homeKey} vs ${awayKey}`);
          return;
        }

        const status = STATUS_MAP[m.status] || 'scheduled';
        const ft = m.score?.fullTime;
        const real_score = (status === 'finished' || status === 'live') && ft?.home != null
          ? { home: ft.home, away: ft.away }
          : null;

        this.cache[local.id] = { status, real_score };
        mapeados++;
      });

      console.log(`[API] ${mapeados}/${data.matches.length} partidos mapeados correctamente`);
      this.lastFetch = Date.now();
      return true;
    } catch (e) {
      console.error('[API] fetch fallido:', e.message);
      return false;
    }
  },

  hasLiveMatches() {
    return Object.values(this.cache).some(m => m.status === 'live');
  },
};
