// =============================================
// UI RENDERING — Todas las vistas
// =============================================

// ── Helpers ──────────────────────────────────

function fmtDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function fmtDateShort(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  });
}

function statusBadge(status) {
  const map = {
    finished:  '<span class="badge badge-fin">✓ Finalizado</span>',
    live:      '<span class="badge badge-live">● EN VIVO</span>',
    scheduled: '<span class="badge badge-sch">Programado</span>',
  };
  return map[status] || map.scheduled;
}

function rowBg(i) {
  if (i < 2) return 'row-promote';
  if (i === 2) return 'row-third';
  return 'row-out';
}

// ── VISTA: GRUPOS ─────────────────────────────

function renderGroupsView() {
  let html = '<div class="groups-grid">';
  GROUPS.forEach(g => {
    const standings = calculateGroupStandings(g);
    html += groupCard(g, standings);
  });
  html += '</div>';
  html += bestThirdsPanel();
  document.getElementById('view-groups').innerHTML = html;
}

function groupCard(groupId, standings) {
  return `
    <div class="card">
      <div class="card-header">GRUPO ${groupId}</div>
      <table class="standings-table">
        <thead>
          <tr>
            <th>#</th><th class="col-team">Equipo</th>
            <th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
            <th>GF</th><th>GC</th><th>DG</th><th class="col-pts">Pts</th>
          </tr>
        </thead>
        <tbody>
          ${standings.map((row, i) => standingRow(row, i)).join('')}
        </tbody>
      </table>
    </div>`;
}

function standingRow(row, i) {
  const t = TEAMS[row.team];
  return `
    <tr class="${rowBg(i)}">
      <td class="pos">${i + 1}</td>
      <td class="team-cell">${t.flag} <span>${t.name}</span></td>
      <td>${row.pj}</td><td>${row.pg}</td><td>${row.pe}</td><td>${row.pp}</td>
      <td>${row.gf}</td><td>${row.gc}</td>
      <td>${row.dg > 0 ? '+' : ''}${row.dg}</td>
      <td class="pts">${row.pts}</td>
    </tr>`;
}

function bestThirdsPanel() {
  const thirds = rankBestThirds();
  if (thirds.length === 0) return '';
  return `
    <div class="card mt-6">
      <div class="card-header" style="background:#b45309">MEJORES TERCEROS — Top 8 avanzan</div>
      <table class="standings-table">
        <thead>
          <tr><th>Pos</th><th class="col-team">Equipo</th><th>Grupo</th>
              <th>PJ</th><th>DG</th><th>GF</th><th class="col-pts">Pts</th><th>Estado</th></tr>
        </thead>
        <tbody>
          ${thirds.map((row, i) => `
            <tr class="${i < 8 ? 'row-promote' : 'row-out'}">
              <td class="pos">${i + 1}</td>
              <td class="team-cell">${TEAMS[row.team].flag} <span>${TEAMS[row.team].name}</span></td>
              <td style="color:#94a3b8">Grp ${row.group}</td>
              <td>${row.pj}</td>
              <td>${row.dg > 0 ? '+' : ''}${row.dg}</td>
              <td>${row.gf}</td>
              <td class="pts">${row.pts}</td>
              <td>${i < 8
                ? '<span class="badge badge-fin">Clasifica</span>'
                : '<span class="badge badge-out">Eliminado</span>'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <p class="legend">🟢 Clasifica directamente &nbsp; 🟡 Zona de mejores terceros &nbsp; 🔴 Eliminado</p>
    </div>`;
}

// ── VISTA: FIXTURE ────────────────────────────

function renderFixtureView() {
  const matches     = DataStore.getAllMatches();
  const predictions = DataStore.getPredictions();

  // Group by date
  const byDate = {};
  matches.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });

  let html = groupFilterBar();

  Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([date, dayMatches]) => {
      html += `<div class="day-section" data-date="${date}">
        <h3 class="day-title">${fmtDate(date)}</h3>
        <div class="matches-list">
          ${dayMatches.map(m => matchCard(m, predictions[m.id])).join('')}
        </div>
      </div>`;
    });

  document.getElementById('view-fixture').innerHTML = html;
  attachPredictionListeners();
  applyGroupFilter(App.currentGroupFilter);
}

function groupFilterBar() {
  const active = App.currentGroupFilter;
  const btn = (val, label) =>
    `<button class="filter-btn ${active === val ? 'active' : ''}" data-group="${val}">${label}</button>`;
  return `<div class="filter-bar">
    ${btn('all','Todos')}
    ${GROUPS.map(g => btn(g, `Grupo ${g}`)).join('')}
  </div>`;
}

function matchCard(match, prediction) {
  const ht = TEAMS[match.home], at = TEAMS[match.away];
  const isFinished  = match.status === 'finished' && match.real_score;
  const canPredict  = match.status === 'scheduled' || match.status === 'live';

  let centerContent;
  if (isFinished) {
    const sc = match.real_score;
    centerContent = `<div class="score-display">${sc.home} – ${sc.away}</div>`;
  } else if (match.status === 'live') {
    centerContent = `<div class="live-pulse">EN VIVO</div>`;
  } else {
    centerContent = `<div class="match-time">${match.time}</div>`;
  }

  let predRow = '';
  if (isFinished && prediction) {
    const r = calcPredictionScore(prediction, match.real_score);
    predRow = `<div class="pred-result">
      Tu predicción: <strong>${prediction.home}–${prediction.away}</strong>
      <span class="${r.cls} font-bold ml-1">${r.label} (+${r.score} pts)</span>
    </div>`;
  }

  let predInput = '';
  if (canPredict) {
    predInput = predictionInputHTML(match.id, prediction);
  }

  return `
    <div class="match-card" data-group="${match.group}" data-match-id="${match.id}">
      <div class="match-card-meta">
        <span class="group-tag">GRUPO ${match.group} · J${match.matchday} · ${fmtDateShort(match.date)}</span>
        ${statusBadge(match.status)}
      </div>
      <div class="match-body">
        <div class="team-name right">${ht.flag} <span>${ht.name}</span></div>
        ${centerContent}
        <div class="team-name left"><span>${at.name}</span> ${at.flag}</div>
      </div>
      ${predRow}
      ${predInput}
    </div>`;
}

function predictionInputHTML(matchId, prediction) {
  const h = prediction !== undefined ? prediction.home : '';
  const a = prediction !== undefined ? prediction.away : '';
  return `
    <div class="pred-input-row">
      <span class="pred-label">Tu predicción:</span>
      <input type="number" min="0" max="99" class="pred-num" data-match="${matchId}" data-side="home" value="${h}" placeholder="0">
      <span class="pred-sep">–</span>
      <input type="number" min="0" max="99" class="pred-num" data-match="${matchId}" data-side="away" value="${a}" placeholder="0">
      <button class="btn-save-pred" data-match="${matchId}">Guardar</button>
      ${prediction !== undefined
        ? `<button class="btn-del-pred" data-match="${matchId}">✕</button>`
        : ''}
    </div>`;
}

function attachPredictionListeners() {
  document.querySelectorAll('.btn-save-pred').forEach(btn => {
    btn.addEventListener('click', () => {
      const id   = btn.dataset.match;
      const card = document.querySelector(`[data-match-id="${id}"]`);
      const h    = card.querySelector('[data-side="home"]').value;
      const a    = card.querySelector('[data-side="away"]').value;
      if (h === '' || a === '' || parseInt(h) < 0 || parseInt(a) < 0) {
        showToast('Ingresa marcadores válidos', 'error'); return;
      }
      DataStore.savePrediction(id, h, a);
      showToast('Predicción guardada ✓');
      App.refresh();
    });
  });

  document.querySelectorAll('.btn-del-pred').forEach(btn => {
    btn.addEventListener('click', () => {
      DataStore.deletePrediction(btn.dataset.match);
      showToast('Predicción eliminada');
      App.refresh();
    });
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      App.currentGroupFilter = btn.dataset.group;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyGroupFilter(App.currentGroupFilter);
    });
  });
}

function applyGroupFilter(filter) {
  document.querySelectorAll('.match-card').forEach(card => {
    card.style.display = (filter === 'all' || card.dataset.group === filter) ? '' : 'none';
  });
  document.querySelectorAll('.day-section').forEach(section => {
    const hasVisible = [...section.querySelectorAll('.match-card')]
      .some(c => c.style.display !== 'none');
    section.style.display = hasVisible ? '' : 'none';
  });
}

// ── VISTA: PREDICCIONES ───────────────────────

function renderPredictionsView() {
  const matches     = DataStore.getAllMatches();
  const predictions = DataStore.getPredictions();
  const stats       = getTotalPredictionScore();

  const hasPreds = Object.keys(predictions).length > 0;

  let html = `
    <div class="score-banner">
      <div class="score-big">${stats.total}</div>
      <div class="score-label">puntos acumulados</div>
      <div class="score-sub">${stats.evaluated} evaluados · ${stats.pending} pendientes</div>
    </div>`;

  if (!hasPreds) {
    html += `<div class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>Todavía no hiciste predicciones.</p>
      <p class="mt-1" style="color:#64748b">Ve al <strong>Fixture</strong> y predice los resultados.</p>
    </div>`;
  } else {
    const relevant = matches.filter(m => predictions[m.id] !== undefined || m.status === 'finished');
    html += '<div class="pred-list">';
    relevant.forEach(m => { html += predCompareCard(m, predictions[m.id]); });
    html += '</div>';
  }

  document.getElementById('view-predictions').innerHTML = html;
}

function predCompareCard(match, prediction) {
  const ht = TEAMS[match.home], at = TEAMS[match.away];
  const isFinished = match.status === 'finished' && match.real_score;
  let result = null;
  if (isFinished && prediction) result = calcPredictionScore(prediction, match.real_score);

  const realDisplay = isFinished
    ? `<span class="compare-score real">${match.real_score.home} – ${match.real_score.away}</span>`
    : `<span style="color:#475569">–</span>`;

  const predDisplay = prediction !== undefined
    ? `<span class="compare-score pred">${prediction.home} – ${prediction.away}</span>`
    : `<span style="color:#475569">Sin predicción</span>`;

  return `
    <div class="compare-card ${result ? (result.score === 3 ? 'exact' : result.score === 1 ? 'hit' : 'miss') : ''}">
      <div class="compare-meta">
        GRUPO ${match.group} · ${ht.name} vs ${at.name} · ${fmtDateShort(match.date)}
      </div>
      <div class="compare-body">
        <div class="compare-col">
          <div class="compare-col-label">Resultado Real</div>
          ${realDisplay}
        </div>
        <div class="compare-middle">
          ${ht.flag} ${at.flag}
          ${result ? `<div class="${result.cls} fw-bold">${result.label}<br>+${result.score} pts</div>` : ''}
        </div>
        <div class="compare-col">
          <div class="compare-col-label">Tu Predicción</div>
          ${predDisplay}
        </div>
      </div>
    </div>`;
}

// ── VISTA: ADMIN ──────────────────────────────

function renderAdminView() {
  const matches = DataStore.getAllMatches();
  const optGroups = GROUPS.map(g => {
    const gm = matches.filter(m => m.group === g);
    return `<optgroup label="Grupo ${g}">
      ${gm.map(m =>
        `<option value="${m.id}">${TEAMS[m.home].name} vs ${TEAMS[m.away].name} — J${m.matchday} (${m.status})</option>`
      ).join('')}
    </optgroup>`;
  }).join('');

  document.getElementById('view-admin').innerHTML = `
    <div class="admin-wrap">
      <div class="card">
        <div class="card-header" style="background:#1d4ed8">⚙️ Panel de Administración</div>
        <div class="admin-body">
          <p class="admin-hint">Ingresa los resultados a medida que se van jugando. Los cambios persisten en el navegador.</p>

          <label class="field-label">Seleccionar partido</label>
          <select id="admin-select" class="admin-select">
            <option value="">-- Elige un partido --</option>
            ${optGroups}
          </select>

          <div id="admin-form" class="admin-form hidden">
            <div class="admin-teams">
              <div class="admin-team">
                <div id="a-home-name" class="admin-team-name"></div>
                <input id="a-home" type="number" min="0" max="99" class="admin-score-input" placeholder="0">
              </div>
              <div class="admin-vs">VS</div>
              <div class="admin-team">
                <div id="a-away-name" class="admin-team-name"></div>
                <input id="a-away" type="number" min="0" max="99" class="admin-score-input" placeholder="0">
              </div>
            </div>
            <label class="field-label mt-4">Estado del partido</label>
            <select id="a-status" class="admin-select">
              <option value="scheduled">Programado</option>
              <option value="live">En Vivo</option>
              <option value="finished">Finalizado</option>
            </select>
            <button id="a-save" class="btn-primary mt-4">Guardar resultado</button>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header" style="background:#374151">Resultados ingresados manualmente</div>
        <div class="admin-body">
          <div id="overrides-log"></div>
        </div>
      </div>
    </div>`;

  attachAdminListeners();
  renderOverridesLog();
}

function renderOverridesLog() {
  const ov  = DataStore.getResultOverrides();
  const log = document.getElementById('overrides-log');
  if (!log) return;
  const ids = Object.keys(ov);
  if (ids.length === 0) {
    log.innerHTML = '<p style="color:#64748b;font-size:.85rem">Ninguno todavía.</p>';
    return;
  }
  const allMatches = DataStore.getAllMatches();
  log.innerHTML = ids.map(id => {
    const m = allMatches.find(x => x.id === id);
    if (!m) return '';
    const o = ov[id];
    return `<div class="override-row">
      <span>${TEAMS[m.home].flag} ${TEAMS[m.home].name} <strong>${o.real_score.home} – ${o.real_score.away}</strong> ${TEAMS[m.away].name} ${TEAMS[m.away].flag}</span>
      <span class="badge badge-fin" style="margin-left:8px">${o.status}</span>
      <button class="btn-rm-override" data-id="${id}">Quitar</button>
    </div>`;
  }).join('');

  log.querySelectorAll('.btn-rm-override').forEach(btn => {
    btn.addEventListener('click', () => {
      DataStore.removeResultOverride(btn.dataset.id);
      renderOverridesLog();
      App.refresh();
      showToast('Resultado eliminado');
    });
  });
}

function attachAdminListeners() {
  const sel  = document.getElementById('admin-select');
  const form = document.getElementById('admin-form');

  sel.addEventListener('change', () => {
    if (!sel.value) { form.classList.add('hidden'); return; }
    const m = DataStore.getAllMatches().find(x => x.id === sel.value);
    document.getElementById('a-home-name').textContent = `${TEAMS[m.home].flag} ${TEAMS[m.home].name}`;
    document.getElementById('a-away-name').textContent = `${TEAMS[m.away].flag} ${TEAMS[m.away].name}`;
    document.getElementById('a-status').value = m.status;
    document.getElementById('a-home').value  = m.real_score ? m.real_score.home : '';
    document.getElementById('a-away').value  = m.real_score ? m.real_score.away : '';
    form.classList.remove('hidden');
  });

  document.getElementById('a-save').addEventListener('click', () => {
    if (!sel.value) { showToast('Selecciona un partido', 'error'); return; }
    const h  = parseInt(document.getElementById('a-home').value);
    const a  = parseInt(document.getElementById('a-away').value);
    const st = document.getElementById('a-status').value;
    if (isNaN(h) || isNaN(a)) { showToast('Ingresa marcadores válidos', 'error'); return; }
    DataStore.saveResultOverride(sel.value, h, a, st);
    renderOverridesLog();
    showToast('Resultado guardado ✓');
    App.refresh();
  });
}

// ── Toast ─────────────────────────────────────

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type === 'error' ? 'toast-error' : 'toast-ok'} visible`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('visible'), 2800);
}
