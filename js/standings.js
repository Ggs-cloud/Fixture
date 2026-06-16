// =============================================
// STANDINGS ENGINE — Cálculo puro de tablas
// =============================================

function calculateGroupStandings(groupId) {
  const matches  = DataStore.getMatchesByGroup(groupId);
  const teamIds  = Object.keys(TEAMS).filter(t => TEAMS[t].group === groupId);

  const table = {};
  teamIds.forEach(id => {
    table[id] = { team: id, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
  });

  matches.forEach(m => {
    if (m.status !== 'finished' || !m.real_score) return;
    const { home: hs, away: as_ } = m.real_score;
    const h = table[m.home], a = table[m.away];
    if (!h || !a) return;

    h.pj++; a.pj++;
    h.gf += hs; h.gc += as_;
    a.gf += as_; a.gc += hs;

    if (hs > as_)      { h.pg++; h.pts += 3; a.pp++; }
    else if (hs < as_) { a.pg++; a.pts += 3; h.pp++; }
    else               { h.pe++; h.pts++;    a.pe++; a.pts++; }
  });

  return Object.values(table)
    .map(s => ({ ...s, dg: s.gf - s.gc }))
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg  !== a.dg)  return b.dg  - a.dg;
      if (b.gf  !== a.gf)  return b.gf  - a.gf;
      return TEAMS[a.team].name.localeCompare(TEAMS[b.team].name);
    });
}

// Returns all 12 third-place teams sorted (top 8 qualify)
function rankBestThirds() {
  return GROUPS
    .map(g => {
      const s = calculateGroupStandings(g);
      return s.length >= 3 ? { ...s[2], group: g } : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg  !== a.dg)  return b.dg  - a.dg;
      if (b.gf  !== a.gf)  return b.gf  - a.gf;
      return 0;
    });
}
