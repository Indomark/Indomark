(() => {
  const CATALOG = {
    'kn:tidi:varsity': {
      courseTitle: 'Stock Market Basics — Course 1',
      sourceCourse: 'TIDI Academy — Kannada Stock Market Education',
      verifiedSource: 'Channel added as a verified Kannada education source. Exact YouTube course/playlist mapping must be verified before videos are added.',
      parts: []
    },
    'kn:wavetrader:varsity': {
      courseTitle: 'Stock Market Basics — Course 1',
      sourceCourse: 'Stock Market Course — Zero to Advance',
      verifiedSource: 'Parts 1–5 have been identified from Wavetraderkannada YouTube course videos. Part 2 is mapped from the user-provided video URL; Parts 6+ still require exact video verification before mapping.',
      parts: [
        { n: 1, title: 'Stock Market Course Part - 1 Zero to Advance', videoId: 'xL83DdYMlWQ' },
        { n: 2, title: 'Stock Market Course Part - 2 Zero to Advance', videoId: 'K0N7BQjff1U' },
        { n: 3, title: 'Stock Market Course Part - 3 Zero to Advance', videoId: 'UYwNdeMQQPc' },
        { n: 4, title: 'Stock Market Course Part- 4 Zero to Advance', videoId: 'Op2manPp_vE' },
        { n: 5, title: 'Stock Market Course Part- 5 Zero to Advance', videoId: 'FrmDSd0vpCg' }
      ]
    },
    'kn:vistara:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'UucJL1nqejw' }] },
    'hi:pranjal:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'RFP3ooXIiyI' }] },
    'ta:businessman:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Complete Stock Market Course in Tamil', verifiedSource: 'One complete course video; it is not a multi-part series.', parts: [{ n: 1, title: 'Complete Stock Market Course in Tamil', videoId: 'SLO1dFKSvgg' }] },
    'en:investopedia:varsity': { courseTitle: 'Stock Market Basics — Course 1', sourceCourse: 'Verified beginner stock-market lesson', verifiedSource: 'One exact lesson currently verified; more course parts must be identified before adding them.', parts: [{ n: 1, title: 'Stock Market Basics — Verified Lesson', videoId: 'BgEZn-HJNb4' }] }
  };
  function getCatalog(language, teacher, course = 'varsity') { return CATALOG[`${language}:${teacher}:${course}`] || null; }
  window.INDOMARK_LEARN_CATALOG = { CATALOG, getCatalog };

  function wireLevelGate(){
    if(!window.INDOMARK_LEARN_LEVEL_GATE || !document.querySelector('.hub-card')) return;
    const gate=window.INDOMARK_LEARN_LEVEL_GATE;
    const cards=[...document.querySelectorAll('.hub-card')];
    cards.forEach(card=>{
      const href=card.getAttribute('href')||'';
      const m=href.match(/[?&]category=([^&]+)/);
      if(!m) return;
      const category=gate.normalizeCategory(decodeURIComponent(m[1]));
      const unlocked=gate.isLevelUnlocked(category);
      card.classList.toggle('level-locked',!unlocked);
      card.setAttribute('aria-disabled',String(!unlocked));
      if(!unlocked){
        card.addEventListener('click',e=>e.preventDefault());
        const badge=card.querySelector('.hub-level');
        if(badge) badge.textContent=(badge.textContent||'').replace(/LEVEL\\s+/i,'') ? '🔒 LEVEL '+(badge.textContent.match(/\\d+/)||[''])[0] : '🔒';
      }
    });
  }

  const boot=()=>{
    if(window.INDOMARK_LEARN_LEVEL_GATE) wireLevelGate();
    else {
      const s=document.createElement('script');
      s.src='../js/learn-level-gating.js?v=1';
      s.onload=wireLevelGate;
      document.head.appendChild(s);
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();

  function loadScript(src){
    return new Promise((resolve,reject)=>{
      if(document.querySelector(`script[src="${src}"]`)) return resolve();
      const s=document.createElement('script');
      s.src=src;
      s.onload=resolve;
      s.onerror=reject;
      document.head.appendChild(s);
    });
  }

  async function syncLearnProgress(){
    if(!document.getElementById('learnProgressPercent')) return;
    try{
      await loadScript('../js/vistara-kannada-video-catalog.js?v=20260830-19');
      await loadScript('../js/angel-investments-kannada-video-catalog.js?v=20260830-19');
      if(!window.INDOMARK_LEARN_LEVEL_GATE){
        await loadScript('../js/learn-level-gating.js?v=1');
      }
      const gate=window.INDOMARK_LEARN_LEVEL_GATE;
      if(!gate) return;
      const categories=['Stock Market Basics','Technical Analysis','Fundamental Analysis','Risk Management','Investor Psychology'];
      let progressTotal=0,completedLevels=0,unlockedLevels=0,inProgress=0;
      categories.forEach(category=>{
        const s=gate.getStatus(category);
        const required=Number(s.required)||0;
        const completed=Math.min(Number(s.completed)||0,required);
        const ratio=required?Math.max(0,Math.min(1,completed/required)):0;
        progressTotal+=ratio;
        if(s.unlocked) unlockedLevels+=1;
        if(required&&completed>=required) completedLevels+=1;
        else if(s.unlocked&&completed>0) inProgress=1;
      });
      if(!inProgress && unlockedLevels>completedLevels) inProgress=1;
      const percent=Math.round((progressTotal/categories.length)*100);
      const p=document.getElementById('learnProgressPercent');
      const c=document.getElementById('learnCompleted');
      const i=document.getElementById('learnInProgress');
      const l=document.getElementById('learnLocked');
      const bar=document.getElementById('learnContinueBar');
      if(p){p.textContent=percent+'%';p.parentElement.style.background=`conic-gradient(#22c55e 0 ${percent}%,rgba(148,163,184,.15) ${percent}% 100%)`;p.parentElement.setAttribute('aria-label',`Course progress ${percent} percent`);}
      if(c)c.textContent=String(completedLevels);
      if(i)i.textContent=String(inProgress);
      if(l)l.textContent=String(Math.max(categories.length-unlockedLevels,0));
      if(bar)bar.style.width=percent+'%';
    }catch(_){/* preserve existing page behavior when optional progress scripts are unavailable */}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(syncLearnProgress,0),{once:true});
  else setTimeout(syncLearnProgress,0);
})();
