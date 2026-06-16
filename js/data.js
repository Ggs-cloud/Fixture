// =============================================
// DATA LAYER — Mundial 2026
// =============================================

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const TEAMS = {
  // GRUPO A
  mexico:         { name: 'México',               flag: '🇲🇽', group: 'A' },
  south_korea:    { name: 'Corea del Sur',        flag: '🇰🇷', group: 'A' },
  south_africa:   { name: 'Sudáfrica',            flag: '🇿🇦', group: 'A' },
  czech_republic: { name: 'Rep. Checa',           flag: '🇨🇿', group: 'A' },
  // GRUPO B
  canada:         { name: 'Canadá',               flag: '🇨🇦', group: 'B' },
  switzerland:    { name: 'Suiza',                flag: '🇨🇭', group: 'B' },
  qatar:          { name: 'Qatar',                flag: '🇶🇦', group: 'B' },
  bosnia:         { name: 'Bosnia y Herz.',       flag: '🇧🇦', group: 'B' },
  // GRUPO C
  brazil:         { name: 'Brasil',               flag: '🇧🇷', group: 'C' },
  morocco:        { name: 'Marruecos',            flag: '🇲🇦', group: 'C' },
  scotland:       { name: 'Escocia',              flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  haiti:          { name: 'Haití',                flag: '🇭🇹', group: 'C' },
  // GRUPO D
  usa:            { name: 'EE. UU.',              flag: '🇺🇸', group: 'D' },
  australia:      { name: 'Australia',            flag: '🇦🇺', group: 'D' },
  paraguay:       { name: 'Paraguay',             flag: '🇵🇾', group: 'D' },
  turkey:         { name: 'Turquía',              flag: '🇹🇷', group: 'D' },
  // GRUPO E
  germany:        { name: 'Alemania',             flag: '🇩🇪', group: 'E' },
  ecuador:        { name: 'Ecuador',              flag: '🇪🇨', group: 'E' },
  ivory_coast:    { name: 'Costa de Marfil',      flag: '🇨🇮', group: 'E' },
  curacao:        { name: 'Curazao',              flag: '🇨🇼', group: 'E' },
  // GRUPO F
  netherlands:    { name: 'Países Bajos',         flag: '🇳🇱', group: 'F' },
  japan:          { name: 'Japón',                flag: '🇯🇵', group: 'F' },
  sweden:         { name: 'Suecia',               flag: '🇸🇪', group: 'F' },
  tunisia:        { name: 'Túnez',                flag: '🇹🇳', group: 'F' },
  // GRUPO G
  belgium:        { name: 'Bélgica',              flag: '🇧🇪', group: 'G' },
  iran:           { name: 'Irán',                 flag: '🇮🇷', group: 'G' },
  egypt:          { name: 'Egipto',               flag: '🇪🇬', group: 'G' },
  new_zealand:    { name: 'Nueva Zelanda',        flag: '🇳🇿', group: 'G' },
  // GRUPO H
  spain:          { name: 'España',               flag: '🇪🇸', group: 'H' },
  uruguay:        { name: 'Uruguay',              flag: '🇺🇾', group: 'H' },
  saudi_arabia:   { name: 'Arabia Saudita',       flag: '🇸🇦', group: 'H' },
  cape_verde:     { name: 'Cabo Verde',           flag: '🇨🇻', group: 'H' },
  // GRUPO I
  france:         { name: 'Francia',              flag: '🇫🇷', group: 'I' },
  senegal:        { name: 'Senegal',              flag: '🇸🇳', group: 'I' },
  norway:         { name: 'Noruega',              flag: '🇳🇴', group: 'I' },
  iraq:           { name: 'Irak',                 flag: '🇮🇶', group: 'I' },
  // GRUPO J
  argentina:      { name: 'Argentina',            flag: '🇦🇷', group: 'J' },
  austria:        { name: 'Austria',              flag: '🇦🇹', group: 'J' },
  algeria:        { name: 'Argelia',              flag: '🇩🇿', group: 'J' },
  jordan:         { name: 'Jordania',             flag: '🇯🇴', group: 'J' },
  // GRUPO K
  portugal:       { name: 'Portugal',             flag: '🇵🇹', group: 'K' },
  colombia:       { name: 'Colombia',             flag: '🇨🇴', group: 'K' },
  uzbekistan:     { name: 'Uzbekistán',           flag: '🇺🇿', group: 'K' },
  dr_congo:       { name: 'RD del Congo',         flag: '🇨🇩', group: 'K' },
  // GRUPO L
  england:        { name: 'Inglaterra',           flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  croatia:        { name: 'Croacia',              flag: '🇭🇷', group: 'L' },
  panama:         { name: 'Panamá',               flag: '🇵🇦', group: 'L' },
  ghana:          { name: 'Ghana',                flag: '🇬🇭', group: 'L' },
};

// All 72 group-stage matches
// MD pairing per group: MD1=1v2,3v4 | MD2=1v3,2v4 | MD3=1v4,2v3
// Group order: A=mexico,south_korea,south_africa,czech_republic
//              B=canada,switzerland,qatar,bosnia
//              C=brazil,morocco,scotland,haiti
//              D=usa,australia,paraguay,turkey
//              E=germany,ecuador,ivory_coast,curacao
//              F=netherlands,japan,sweden,tunisia
//              G=belgium,iran,egypt,new_zealand
//              H=spain,uruguay,saudi_arabia,cape_verde
//              I=france,senegal,norway,iraq
//              J=argentina,austria,algeria,jordan
//              K=portugal,colombia,uzbekistan,dr_congo
//              L=england,croatia,panama,ghana
const INITIAL_MATCHES = [
  // ───── GRUPO A ─────
  { id:'GRP_A_MD1_1', group:'A', matchday:1, home:'mexico',         away:'south_korea',    date:'2026-06-11', time:'13:00', status:'finished',  real_score:{home:2,away:0} },
  { id:'GRP_A_MD1_2', group:'A', matchday:1, home:'south_africa',   away:'czech_republic', date:'2026-06-11', time:'16:00', status:'finished',  real_score:{home:2,away:1} },
  { id:'GRP_A_MD2_1', group:'A', matchday:2, home:'mexico',         away:'south_africa',   date:'2026-06-19', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_A_MD2_2', group:'A', matchday:2, home:'south_korea',    away:'czech_republic', date:'2026-06-19', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_A_MD3_1', group:'A', matchday:3, home:'mexico',         away:'czech_republic', date:'2026-06-23', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_A_MD3_2', group:'A', matchday:3, home:'south_korea',    away:'south_africa',   date:'2026-06-23', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO B ─────
  { id:'GRP_B_MD1_1', group:'B', matchday:1, home:'canada',         away:'switzerland',    date:'2026-06-11', time:'19:00', status:'finished',  real_score:{home:1,away:1} },
  { id:'GRP_B_MD1_2', group:'B', matchday:1, home:'qatar',          away:'bosnia',         date:'2026-06-12', time:'10:00', status:'finished',  real_score:{home:1,away:1} },
  { id:'GRP_B_MD2_1', group:'B', matchday:2, home:'canada',         away:'qatar',          date:'2026-06-19', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_B_MD2_2', group:'B', matchday:2, home:'switzerland',    away:'bosnia',         date:'2026-06-20', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_B_MD3_1', group:'B', matchday:3, home:'canada',         away:'bosnia',         date:'2026-06-24', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_B_MD3_2', group:'B', matchday:3, home:'switzerland',    away:'qatar',          date:'2026-06-24', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO C ─────
  { id:'GRP_C_MD1_1', group:'C', matchday:1, home:'brazil',         away:'morocco',        date:'2026-06-12', time:'13:00', status:'finished',  real_score:{home:1,away:1} },
  { id:'GRP_C_MD1_2', group:'C', matchday:1, home:'scotland',       away:'haiti',          date:'2026-06-12', time:'16:00', status:'finished',  real_score:{home:1,away:0} },
  { id:'GRP_C_MD2_1', group:'C', matchday:2, home:'brazil',         away:'scotland',       date:'2026-06-20', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_C_MD2_2', group:'C', matchday:2, home:'morocco',        away:'haiti',          date:'2026-06-20', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_C_MD3_1', group:'C', matchday:3, home:'brazil',         away:'haiti',          date:'2026-06-24', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_C_MD3_2', group:'C', matchday:3, home:'morocco',        away:'scotland',       date:'2026-06-24', time:'22:00', status:'scheduled', real_score:null },

  // ───── GRUPO D ─────
  { id:'GRP_D_MD1_1', group:'D', matchday:1, home:'usa',            away:'australia',      date:'2026-06-12', time:'19:00', status:'finished',  real_score:{home:4,away:1} },
  { id:'GRP_D_MD1_2', group:'D', matchday:1, home:'paraguay',       away:'turkey',         date:'2026-06-13', time:'10:00', status:'finished',  real_score:{home:2,away:0} },
  { id:'GRP_D_MD2_1', group:'D', matchday:2, home:'usa',            away:'paraguay',       date:'2026-06-20', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_D_MD2_2', group:'D', matchday:2, home:'australia',      away:'turkey',         date:'2026-06-21', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_D_MD3_1', group:'D', matchday:3, home:'usa',            away:'turkey',         date:'2026-06-25', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_D_MD3_2', group:'D', matchday:3, home:'australia',      away:'paraguay',       date:'2026-06-25', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO E ─────
  { id:'GRP_E_MD1_1', group:'E', matchday:1, home:'germany',        away:'ecuador',        date:'2026-06-13', time:'13:00', status:'finished',  real_score:{home:7,away:1} },
  { id:'GRP_E_MD1_2', group:'E', matchday:1, home:'ivory_coast',    away:'curacao',        date:'2026-06-13', time:'16:00', status:'finished',  real_score:{home:1,away:0} },
  { id:'GRP_E_MD2_1', group:'E', matchday:2, home:'germany',        away:'ivory_coast',    date:'2026-06-21', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_E_MD2_2', group:'E', matchday:2, home:'ecuador',        away:'curacao',        date:'2026-06-21', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_E_MD3_1', group:'E', matchday:3, home:'germany',        away:'curacao',        date:'2026-06-25', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_E_MD3_2', group:'E', matchday:3, home:'ivory_coast',    away:'ecuador',        date:'2026-06-25', time:'22:00', status:'scheduled', real_score:null },

  // ───── GRUPO F ─────
  { id:'GRP_F_MD1_1', group:'F', matchday:1, home:'netherlands',    away:'japan',          date:'2026-06-13', time:'19:00', status:'finished',  real_score:{home:2,away:2} },
  { id:'GRP_F_MD1_2', group:'F', matchday:1, home:'sweden',         away:'tunisia',        date:'2026-06-14', time:'10:00', status:'finished',  real_score:{home:5,away:1} },
  { id:'GRP_F_MD2_1', group:'F', matchday:2, home:'netherlands',    away:'sweden',         date:'2026-06-21', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_F_MD2_2', group:'F', matchday:2, home:'japan',          away:'tunisia',        date:'2026-06-22', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_F_MD3_1', group:'F', matchday:3, home:'netherlands',    away:'tunisia',        date:'2026-06-26', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_F_MD3_2', group:'F', matchday:3, home:'japan',          away:'sweden',         date:'2026-06-26', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO G ─────
  { id:'GRP_G_MD1_1', group:'G', matchday:1, home:'belgium',        away:'iran',           date:'2026-06-14', time:'13:00', status:'finished',  real_score:{home:1,away:1} },
  { id:'GRP_G_MD1_2', group:'G', matchday:1, home:'egypt',          away:'new_zealand',    date:'2026-06-14', time:'16:00', status:'finished',  real_score:{home:2,away:2} },
  { id:'GRP_G_MD2_1', group:'G', matchday:2, home:'belgium',        away:'egypt',          date:'2026-06-22', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_G_MD2_2', group:'G', matchday:2, home:'iran',           away:'new_zealand',    date:'2026-06-22', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_G_MD3_1', group:'G', matchday:3, home:'belgium',        away:'new_zealand',    date:'2026-06-26', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_G_MD3_2', group:'G', matchday:3, home:'iran',           away:'egypt',          date:'2026-06-26', time:'22:00', status:'scheduled', real_score:null },

  // ───── GRUPO H ─────
  { id:'GRP_H_MD1_1', group:'H', matchday:1, home:'spain',          away:'uruguay',        date:'2026-06-14', time:'19:00', status:'finished',  real_score:{home:0,away:0} },
  { id:'GRP_H_MD1_2', group:'H', matchday:1, home:'saudi_arabia',   away:'cape_verde',     date:'2026-06-15', time:'10:00', status:'finished',  real_score:{home:1,away:1} },
  { id:'GRP_H_MD2_1', group:'H', matchday:2, home:'spain',          away:'saudi_arabia',   date:'2026-06-22', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_H_MD2_2', group:'H', matchday:2, home:'uruguay',        away:'cape_verde',     date:'2026-06-23', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_H_MD3_1', group:'H', matchday:3, home:'spain',          away:'cape_verde',     date:'2026-06-27', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_H_MD3_2', group:'H', matchday:3, home:'uruguay',        away:'saudi_arabia',   date:'2026-06-27', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO I ───── (EN VIVO HOY 16 Jun)
  { id:'GRP_I_MD1_1', group:'I', matchday:1, home:'france',         away:'senegal',        date:'2026-06-16', time:'13:00', status:'live',      real_score:null },
  { id:'GRP_I_MD1_2', group:'I', matchday:1, home:'norway',         away:'iraq',           date:'2026-06-16', time:'16:00', status:'live',      real_score:null },
  { id:'GRP_I_MD2_1', group:'I', matchday:2, home:'france',         away:'norway',         date:'2026-06-23', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_I_MD2_2', group:'I', matchday:2, home:'senegal',        away:'iraq',           date:'2026-06-23', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_I_MD3_1', group:'I', matchday:3, home:'france',         away:'iraq',           date:'2026-06-27', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_I_MD3_2', group:'I', matchday:3, home:'senegal',        away:'norway',         date:'2026-06-27', time:'22:00', status:'scheduled', real_score:null },

  // ───── GRUPO J ───── (HOY 16 Jun)
  { id:'GRP_J_MD1_1', group:'J', matchday:1, home:'argentina',      away:'austria',        date:'2026-06-16', time:'19:00', status:'live',      real_score:null },
  { id:'GRP_J_MD1_2', group:'J', matchday:1, home:'algeria',        away:'jordan',         date:'2026-06-16', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_J_MD2_1', group:'J', matchday:2, home:'argentina',      away:'algeria',        date:'2026-06-24', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_J_MD2_2', group:'J', matchday:2, home:'austria',        away:'jordan',         date:'2026-06-24', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_J_MD3_1', group:'J', matchday:3, home:'argentina',      away:'jordan',         date:'2026-06-28', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_J_MD3_2', group:'J', matchday:3, home:'austria',        away:'algeria',        date:'2026-06-28', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO K ─────
  { id:'GRP_K_MD1_1', group:'K', matchday:1, home:'portugal',       away:'colombia',       date:'2026-06-17', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_K_MD1_2', group:'K', matchday:1, home:'uzbekistan',     away:'dr_congo',       date:'2026-06-17', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_K_MD2_1', group:'K', matchday:2, home:'portugal',       away:'uzbekistan',     date:'2026-06-25', time:'13:00', status:'scheduled', real_score:null },
  { id:'GRP_K_MD2_2', group:'K', matchday:2, home:'colombia',       away:'dr_congo',       date:'2026-06-25', time:'16:00', status:'scheduled', real_score:null },
  { id:'GRP_K_MD3_1', group:'K', matchday:3, home:'portugal',       away:'dr_congo',       date:'2026-06-29', time:'18:00', status:'scheduled', real_score:null },
  { id:'GRP_K_MD3_2', group:'K', matchday:3, home:'colombia',       away:'uzbekistan',     date:'2026-06-29', time:'18:00', status:'scheduled', real_score:null },

  // ───── GRUPO L ─────
  { id:'GRP_L_MD1_1', group:'L', matchday:1, home:'england',        away:'croatia',        date:'2026-06-17', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_L_MD1_2', group:'L', matchday:1, home:'panama',         away:'ghana',          date:'2026-06-18', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_L_MD2_1', group:'L', matchday:2, home:'england',        away:'panama',         date:'2026-06-25', time:'19:00', status:'scheduled', real_score:null },
  { id:'GRP_L_MD2_2', group:'L', matchday:2, home:'croatia',        away:'ghana',          date:'2026-06-26', time:'10:00', status:'scheduled', real_score:null },
  { id:'GRP_L_MD3_1', group:'L', matchday:3, home:'england',        away:'ghana',          date:'2026-06-29', time:'22:00', status:'scheduled', real_score:null },
  { id:'GRP_L_MD3_2', group:'L', matchday:3, home:'croatia',        away:'panama',         date:'2026-06-29', time:'22:00', status:'scheduled', real_score:null },
];

// ── LocalStorage keys ──
const LS_RESULTS     = 'wc2026_results';
const LS_PREDICTIONS = 'wc2026_predictions';

const DataStore = {
  getResultOverrides() {
    try { return JSON.parse(localStorage.getItem(LS_RESULTS) || '{}'); }
    catch { return {}; }
  },

  saveResultOverride(matchId, homeScore, awayScore, status) {
    const ov = this.getResultOverrides();
    ov[matchId] = { real_score: { home: homeScore, away: awayScore }, status };
    localStorage.setItem(LS_RESULTS, JSON.stringify(ov));
  },

  removeResultOverride(matchId) {
    const ov = this.getResultOverrides();
    delete ov[matchId];
    localStorage.setItem(LS_RESULTS, JSON.stringify(ov));
  },

  getAllMatches() {
    const ov       = this.getResultOverrides();
    const apiCache = (typeof ApiStore !== 'undefined') ? ApiStore.cache : {};
    return INITIAL_MATCHES.map(m => {
      const apiData   = apiCache[m.id]  || {};
      const adminData = ov[m.id]        || {};
      // prioridad: override manual > API > datos estáticos
      return { ...m, ...apiData, ...adminData };
    });
  },

  getMatchesByGroup(groupId) {
    return this.getAllMatches().filter(m => m.group === groupId);
  },

  getPredictions() {
    try { return JSON.parse(localStorage.getItem(LS_PREDICTIONS) || '{}'); }
    catch { return {}; }
  },

  savePrediction(matchId, home, away) {
    const p = this.getPredictions();
    p[matchId] = { home: parseInt(home), away: parseInt(away) };
    localStorage.setItem(LS_PREDICTIONS, JSON.stringify(p));
  },

  deletePrediction(matchId) {
    const p = this.getPredictions();
    delete p[matchId];
    localStorage.setItem(LS_PREDICTIONS, JSON.stringify(p));
  },
};
