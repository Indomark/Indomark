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
        if(badge) badge.textContent=(badge.textContent||'').replace(/LEVEL\s+/i,'') ? '🔒 LEVEL '+(badge.textContent.match(/\d+/)||[''])[0] : '🔒';
      }
    });
  }

  function readLastLearningContext(){
    try{
      const raw=localStorage.getItem('indomark_last_learning_context_v1');
      const ctx=raw?JSON.parse(raw):null;
      if(ctx&&ctx.lang&&ctx.teacher&&ctx.category) return ctx;
    }catch(_){ }
    return null;
  }

  function fallbackLearningContext(){
    try{
      const lang=localStorage.getItem('indomark_learn_language_v2')||'en';
      const teacher=localStorage.getItem(`indomark_teacher_${lang}`)||'';
      const category=localStorage.getItem('indomark_learn_category_v1')||'Stock Market Basics';
      if(lang&&teacher&&category) return {lang,teacher,category};
    }catch(_){ }
    return null;
  }

  function wireContinueLearning(){
    const button=document.querySelector('.continue-cta');
    if(!button) return;
    const context=readLastLearningContext()||fallbackLearningContext();
    if(context){
      const u=new URL('learn-videos.html',location.href);
      u.searchParams.set('lang',context.lang);
      u.searchParams.set('teacher',context.teacher);
      u.searchParams.set('category',context.category);
      if(context.videoId) u.searchParams.set('resume',context.videoId);
      button.href=u.toString();
    }else{
      button.href='learn-videos.html';
    }
  }

  const boot=()=>{
    if(window.INDOMARK_LEARN_LEVEL_GATE) wireLevelGate();
    else {
      const s=document.createElement('script');
      s.src='../js/learn-level-gating.js?v=1';
      s.onload=wireLevelGate;
      document.head.appendChild(s);
    }
    wireContinueLearning();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
