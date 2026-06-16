// =============================================
// APP CONTROLLER — Arranque y navegación
// =============================================

const App = {
  currentView:        'groups',
  currentGroupFilter: 'all',

  init() {
    document.getElementById('today-date').textContent =
      new Date().toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.showView(tab.dataset.view);
      });
    });

    this.showView('groups');
    this.initApi();
  },

  async initApi() {
    if (typeof ApiStore === 'undefined') return;
    const ok = await ApiStore.refresh();
    if (ok) this.refresh();
    this.scheduleNextFetch();
  },

  scheduleNextFetch() {
    if (typeof ApiStore === 'undefined') return;
    // 60 seg si hay partidos en vivo, 5 min si no
    const delay = ApiStore.hasLiveMatches() ? 60_000 : 300_000;
    setTimeout(async () => {
      const ok = await ApiStore.refresh();
      if (ok) this.refresh();
      this.scheduleNextFetch();
    }, delay);
  },

  showView(view) {
    this.currentView = view;
    ['groups','fixture','predictions','admin'].forEach(v => {
      document.getElementById(`view-${v}`).classList.add('hidden');
    });
    document.getElementById(`view-${view}`).classList.remove('hidden');

    switch (view) {
      case 'groups':      renderGroupsView();      break;
      case 'fixture':     renderFixtureView();     break;
      case 'predictions': renderPredictionsView(); break;
      case 'admin':       renderAdminView();        break;
    }
  },

  refresh() {
    this.showView(this.currentView);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
