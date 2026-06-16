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
      if (!res.ok) return false;
      const data = await res.json();
      if (!Array.isArray(data.matches)) return false;

      this.cache = {};
      data.matches.forEach(m => {
        const homeKey = TEAM_NAME_MAP[m.homeTeam.name] || TEAM_NAME_MAP[m.homeTeam.shortName];
        const awayKey = TEAM_NAME_MAP[m.awayTeam.name] || TEAM_NAME_MAP[m.awayTeam.shortName];
        if (!homeKey || !awayKey) return;

        const local = INITIAL_MATCHES.find(l => l.home === homeKey && l.away === awayKey);
        if (!local) return;

        const status = STATUS_MAP[m.status] || 'scheduled';
        const ft = m.score?.fullTime;
        const real_score = (status === 'finished' || status === 'live') && ft?.home != null
          ? { home: ft.home, away: ft.away }
          : null;

        this.cache[local.id] = { status, real_score };
      });

      this.lastFetch = Date.now();
      return true;
    } catch (e) {
      console.warn('[API] fetch fallido, usando datos estáticos');
      return false;
    }
  },

  hasLiveMatches() {
    return Object.values(this.cache).some(m => m.status === 'live');
  },
};
