(() => {
  'use strict';
  const LEVEL_BY_CATEGORY = {
    'Stock Market Basics': 1,
    'Technical Analysis': 2,
    'Fundamental Analysis': 3,
    'Risk Management': 4,
    'Investor Psychology': 5
  };
  const CATEGORY_BY_LEVEL = Object.keys(LEVEL_BY_CATEGORY).reduce((m, k) => { m[LEVEL_BY_CATEGORY[k]] = k; return m; }, {});
  const STORE_PREFIX = 'indomark_learn_level_progress_v1|';
  const BAD_VIDEO_IDS = new Set(['LLGkm3TTcCg']);

  function normalizeCategory(value) {
    const map = { basics:'Stock Market Basics', technical:'Technical Analysis', fundamental:'Fundamental Analysis', risk:'Risk Management', psychology:'Investor Psychology' };
    const raw = String(value || '').trim();
    return map[raw.toLowerCase()] || raw || 'Stock Market Basics';
  }

  function sourceVideos(lang, teacher, category) {
    const cat = normalizeCategory(category);
    let list = [];
    try {
      if (lang === 'kn' && teacher === 'vistara' && typeof window.getIndomarkVistaraVideos === 'function') {
        list = window.getIndomarkVistaraVideos(cat) || [];
      } else if (lang === 'kn' && teacher === 'angel' && typeof window.getIndomarkAngelInvestmentsVideos === 'function') {
        list = window.getIndomarkAngelInvestmentsVideos(cat) || [];
      }
    } catch (_) { list = []; }
    if (!Array.isArray(list)) list = [];
    return list.filter(v => v && v.videoId && v.verified !== false && !BAD_VIDEO_IDS.has(v.videoId) && (!v.category || v.category === cat))
      .slice().sort((a,b) => (Number(a.order) || 999999) - (Number(b.order) || 999999));
  }

  function catalogVideos() {
    const out = [];
    const c = window.INDOMARK_LEARN_CATALOG?.CATALOG || {};
    Object.keys(c).forEach(key => {
      const parts = c[key]?.parts || [];
      const lang = key.split(':')[0] || '';
      const teacher = key.split(':')[1] || '';
      const category = key.endsWith(':varsity') ? 'Stock Market Basics' : '';
      if (!category) return;
      out.push({ lang, teacher, category, videos: parts.filter(v => v && v.videoId && !BAD_VIDEO_IDS.has(v.videoId)).slice().sort((a,b)=>(Number(a.n)||999999)-(Number(b.n)||999999)) });
    });
    return out;
  }

  function allSourcesForCategory(category) {
    const cat = normalizeCategory(category);
    const seen = new Set();
    const out = [];
    const add = (lang, teacher, videos) => {
      const key = `${lang}|${teacher}|${cat}`;
      if (seen.has(key) || !videos?.length) return;
      seen.add(key);
      out.push({ lang, teacher, category: cat, videos });
    };
    const langs = ['kn'];
    langs.forEach(lang => {
      ['vistara','angel'].forEach(teacher => add(lang, teacher, sourceVideos(lang, teacher, cat)));
    });
    catalogVideos().filter(x => x.category === cat).forEach(x => add(x.lang, x.teacher, x.videos));
    return out;
  }

  function storeKey(category) { return STORE_PREFIX + normalizeCategory(category); }
  function read(category) {
    try { return JSON.parse(localStorage.getItem(storeKey(category)) || '{"completed":{}}') || {completed:{}}; } catch (_) { return {completed:{}}; }
  }
  function write(category, state) {
    try { localStorage.setItem(storeKey(category), JSON.stringify({ completed: state.completed || {} })); } catch (_) {}
  }

  function syncLegacyProgress(category) {
    const cat = normalizeCategory(category);
    const state = read(cat);
    const allSources = allSourcesForCategory(cat);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const prefix = 'indomark_learning_progress_v3|';
      if (!key.startsWith(prefix) || !key.endsWith('|' + cat)) continue;
      let saved;
      try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { saved = {}; }
      const p = key.slice(prefix.length).split('|');
      const lang = p[0] || '', teacher = p[1] || '';
      const source = allSources.find(x => x.lang === lang && x.teacher === teacher);
      if (!source) continue;
      Object.keys(saved.completed || {}).forEach(videoId => {
        const idx = source.videos.findIndex(v => v.videoId === videoId);
        if (idx >= 0) state.completed[String(idx + 1)] = true;
      });
    }
    write(cat, state);
    return state;
  }

  function requiredCount(category) {
    const sources = allSourcesForCategory(category);
    let max = 0;
    sources.forEach(s => { max = Math.max(max, s.videos.length); });
    return max;
  }

  function completedCount(category) {
    const state = syncLegacyProgress(category);
    return Object.keys(state.completed || {}).filter(k => state.completed[k]).length;
  }

  function markCompleted(category, videoNumber) {
    const cat = normalizeCategory(category);
    const state = syncLegacyProgress(cat);
    state.completed[String(videoNumber)] = true;
    write(cat, state);
    return state;
  }

  function isLevelUnlocked(category) {
    const cat = normalizeCategory(category);
    const level = LEVEL_BY_CATEGORY[cat];
    if (!level) return true;
    if (level === 1) return true;
    const prevCat = CATEGORY_BY_LEVEL[level - 1];
    const required = requiredCount(prevCat);
    if (!required) return false;
    return completedCount(prevCat) >= required;
  }

  function getStatus(category) {
    const cat = normalizeCategory(category);
    return { unlocked: isLevelUnlocked(cat), required: requiredCount(cat), completed: completedCount(cat), level: LEVEL_BY_CATEGORY[cat] || 0 };
  }

  window.INDOMARK_LEARN_LEVEL_GATE = {
    LEVEL_BY_CATEGORY,
    CATEGORY_BY_LEVEL,
    normalizeCategory,
    sourceVideos,
    allSourcesForCategory,
    requiredCount,
    completedCount,
    markCompleted,
    isLevelUnlocked,
    getStatus,
    syncLegacyProgress
  };
})();
