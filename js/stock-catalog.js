(() => {
  const database = window.IndomarkFirebase?.database;
  const root = database?.ref?.('stocks');

  const normalize = (value) => String(value || '').normalize('NFKC').trim().toLowerCase();
  const iconFor = (symbol) => String(symbol || 'S').replace(/[^A-Za-z]/g, '').slice(0, 1).toUpperCase() || 'S';

  function normalizeStock(key, raw) {
    if (!raw || typeof raw !== 'object') return null;
    const symbol = String(raw.symbol || key || '').trim().toUpperCase();
    const name = String(raw.name || raw.companyName || '').trim();
    if (!symbol || !name) return null;

    const analysis = raw.aiAnalysis || raw.analysis || null;
    return {
      symbol,
      name,
      type: 'stocks',
      icon: String(raw.icon || iconFor(symbol)),
      analysisAvailable: Boolean(analysis && raw.analysisAvailable !== false),
      analysisUpdatedAt: raw.analysisUpdatedAt || analysis?.analysisDate || null,
      aiAnalysis: analysis,
    };
  }

  async function load() {
    if (!root) throw new Error('Firebase Realtime Database is unavailable.');
    const snapshot = await root.once('value');
    const data = snapshot.val() || {};
    return Object.entries(data)
      .map(([key, value]) => normalizeStock(key, value))
      .filter(Boolean)
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  function watch(callback) {
    if (!root) return () => {};
    const handler = (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.entries(data)
        .map(([key, value]) => normalizeStock(key, value))
        .filter(Boolean)
        .sort((a, b) => a.symbol.localeCompare(b.symbol));
      callback(items);
    };
    root.on('value', handler);
    return () => root.off('value', handler);
  }

  window.IndomarkStocks = Object.freeze({ normalize, load, watch });
})();
