(() => {
  const KEY = 'indospeed_learn_language_v2';
  const STATE_KEY = 'indospeed_learn_course_v9';
  const LANGS = [['en','English'],['kn','ಕನ್ನಡ'],['hi','हिन्दी'],['ta','தமிழ்'],['mr','मराठी'],['te','తెలుగు'],['ml','മലയാളം'],['gu','ગુજરાતી'],['bn','বাংলা'],['or','ଓଡ଼ିଆ']];
  const supported = new Set(LANGS.map(x => x[0]));
  const defaultTeacher = {en:'investopedia',kn:'wavetrader',hi:'pranjal',ta:'businessman',mr:'growwmr',te:'growwte',ml:'growwml',gu:'growwgu',bn:'growwbn',or:'searchor'};
  function loadI18n(){if(document.querySelector('script[data-learn-i18n]'))return;const s=document.createElement('script');s.src='../js/learn-i18n.js?v=9';s.dataset.learnI18n='1';document.head.appendChild(s);}
  function rewriteCategoryLinks(){document.querySelectorAll('a.cat').forEach(a=>{const u=new URL(a.getAttribute('href')||'',location.href);const category=u.searchParams.get('category');if(category){a.href=`learn-language-v2.html?category=${encodeURIComponent(category)}`;}});}
  function renderProgress(catalog, lang, teacher) {
    const parts = catalog?.parts || [];
    let state = {};
    try { state = JSON.parse(localStorage.getItem(STATE_KEY) || '{}') || {}; } catch { state = {}; }
    const done = parts.map(x => Boolean((state[`${lang}:varsity:${teacher}:${x.n}`] || {}).quiz));
    const count = done.filter(Boolean).length;
    const total = parts.length;
    const pct = total ? Math.round(count / total * 100) : 0;
    const first = done.findIndex(v => !v);
    const next = first < 0 ? (total || 1) : (parts[first]?.n || 1);
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
    set('completedCount', count); set('totalCount', total || '—'); set('progressPct', pct + '%');
    const ring = document.getElementById('progressRing'); const bar = document.getElementById('progressBar');
    if (ring) ring.style.setProperty('--progress', pct); if (bar) bar.style.width = pct + '%';
    set('continueText', !total ? 'Course mapping pending' : first < 0 ? 'Course 1 completed' : `Start/continue from Part ${next}`);
    const link = document.getElementById('continueLink'); if (link) link.href = `learn-view.html?lang=${encodeURIComponent(lang)}&course=varsity&teacher=${encodeURIComponent(teacher)}&part=${next}`;
    set('basicsSmall', total ? `${total} part${total === 1 ? '' : 's'} · Beginner` : 'Mapping pending');
  }
  function bindLanguageSelect() {
    const select = document.getElementById('learnLanguage'); if (!select || select.dataset.languageBound === '1') return;
    select.innerHTML = LANGS.map(([code, label]) => `<option value="${code}">${label}</option>`).join(''); select.dataset.languageBound = '1';
    const urlLang = new URLSearchParams(location.search).get('lang'); const saved = localStorage.getItem(KEY) || 'en'; const initial = supported.has(urlLang) ? urlLang : (supported.has(saved) ? saved : 'en');
    select.value = initial; localStorage.setItem(KEY, initial);
    select.addEventListener('change', () => { const next = supported.has(select.value) ? select.value : 'en'; localStorage.setItem(KEY, next); localStorage.setItem(`indospeed_teacher_${next}`, defaultTeacher[next] || ''); const target = new URL(window.location.href); target.searchParams.set('lang', next); target.searchParams.delete('teacher'); target.searchParams.delete('part'); target.searchParams.delete('course'); target.searchParams.set('_lang', String(Date.now())); window.location.assign(target.toString()); });
  }
  function init() { loadI18n(); bindLanguageSelect(); rewriteCategoryLinks(); const lang = localStorage.getItem(KEY) || 'en'; const teacher = localStorage.getItem(`indospeed_teacher_${lang}`) || defaultTeacher[lang] || ''; const catalog = window.INDOSPEED_LEARN_CATALOG?.getCatalog(lang, teacher, 'varsity'); renderProgress(catalog, lang, teacher); }
  function boot() { if (window.INDOSPEED_LEARN_CATALOG) { init(); return; } const s = document.createElement('script'); s.src = '../js/learn-course-catalog.js?v=4'; s.onload = init; s.onerror = init; document.head.appendChild(s); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
