(() => {
  'use strict';
  const LEVEL_BY_CATEGORY = {
    'Stock Market Basics': 1,
    'Technical Analysis': 2,
    'Fundamental Analysis': 3,
    'Risk Management': 4,
    'Investor Psychology': 5
  };
  const CATEGORY_BY_LEVEL = Object.keys(LEVEL_BY_CATEGORY).reduce((m,k)=>{m[LEVEL_BY_CATEGORY[k]]=k;return m;},{});
  const DEFAULT_REQUIRED = {'Stock Market Basics':5,'Technical Analysis':3,'Fundamental Analysis':3,'Risk Management':1,'Investor Psychology':1};
  const STORE_PREFIX='indomark_learn_level_progress_v2|';
  const BAD_VIDEO_IDS=new Set(['LLGkm3TTcCg']);
  function normalizeCategory(value){const map={basics:'Stock Market Basics',technical:'Technical Analysis',fundamental:'Fundamental Analysis',risk:'Risk Management',psychology:'Investor Psychology'};const raw=String(value||'').trim();return map[raw.toLowerCase()]||raw||'Stock Market Basics';}
  function storeKey(category){return STORE_PREFIX+normalizeCategory(category);}
  function read(category){try{return JSON.parse(localStorage.getItem(storeKey(category))||'{"completed":{},"required":0}')||{completed:{},required:0};}catch(_){return {completed:{},required:0};}}
  function write(category,state){try{localStorage.setItem(storeKey(category),JSON.stringify({completed:state.completed||{},required:Number(state.required)||0}));}catch(_){} }
  function sourceVideos(lang,teacher,category){const cat=normalizeCategory(category);let list=[];try{if(lang==='kn'&&teacher==='vistara'&&typeof window.getIndomarkVistaraVideos==='function')list=window.getIndomarkVistaraVideos(cat)||[];else if(lang==='kn'&&teacher==='angel'&&typeof window.getIndomarkAngelInvestmentsVideos==='function')list=window.getIndomarkAngelInvestmentsVideos(cat)||[];}catch(_){list=[];}return(Array.isArray(list)?list:[]).filter(v=>v&&v.videoId&&v.verified!==false&&!BAD_VIDEO_IDS.has(v.videoId)&&(!v.category||v.category===cat)).slice().sort((a,b)=>(Number(a.order)||999999)-(Number(b.order)||999999));}
  function catalogSources(category){const cat=normalizeCategory(category);const out=[];const c=window.INDOMARK_LEARN_CATALOG?.CATALOG||{};Object.keys(c).forEach(key=>{if(!key.endsWith(':varsity'))return;const parts=c[key]?.parts||[];if(!parts.length)return;out.push({lang:key.split(':')[0]||'',teacher:key.split(':')[1]||'',category:cat,videos:parts.filter(v=>v&&v.videoId&&!BAD_VIDEO_IDS.has(v.videoId)).slice().sort((a,b)=>(Number(a.n)||999999)-(Number(b.n)||999999))});});['vistara','angel'].forEach(t=>{const vids=sourceVideos('kn',t,cat);if(vids.length)out.push({lang:'kn',teacher:t,category:cat,videos:vids});});return out;}
  function requiredCount(category){const cat=normalizeCategory(category);const own=read(cat).required||0;let max=Math.max(own,DEFAULT_REQUIRED[cat]||0);catalogSources(cat).forEach(s=>{max=Math.max(max,s.videos.length);});return max;}
  function setRequired(category,count){const cat=normalizeCategory(category);const state=read(cat);state.required=Math.max(Number(state.required)||0,Number(count)||0);write(cat,state);return state.required||requiredCount(cat);}
  function syncProgressRecord(category,videos,completed){const cat=normalizeCategory(category);const state=read(cat);(videos||[]).forEach((v,i)=>{if(completed&&completed[v.videoId])state.completed[String(i+1)]=true;});state.required=Math.max(Number(state.required)||0,(videos||[]).length,requiredCount(cat));write(cat,state);return state;}
  function syncLegacyProgress(category){const cat=normalizeCategory(category);const state=read(cat);const sources=catalogSources(cat);for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i)||'';const prefix='indomark_learning_progress_v3|';if(!key.startsWith(prefix)||!key.endsWith('|'+cat))continue;let saved;try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(_){saved={};}const parts=key.slice(prefix.length).split('|');const lang=parts[0]||'',teacher=parts[1]||'';const source=sources.find(s=>s.lang===lang&&s.teacher===teacher);if(!source)continue;Object.keys(saved.completed||{}).forEach(id=>{const idx=source.videos.findIndex(v=>v.videoId===id);if(idx>=0)state.completed[String(idx+1)]=true;});}write(cat,state);return state;}
  function completedCount(category){const state=syncLegacyProgress(category);return Object.keys(state.completed||{}).filter(k=>state.completed[k]).length;}
  function isSlotCompleted(category,number){return !!syncLegacyProgress(category).completed[String(number)];}
  function markCompleted(category,number){const cat=normalizeCategory(category);const state=syncLegacyProgress(cat);state.completed[String(number)]=true;state.required=Math.max(Number(state.required)||0,requiredCount(cat));write(cat,state);return state;}
  function isLevelUnlocked(category){const cat=normalizeCategory(category);const level=LEVEL_BY_CATEGORY[cat];if(!level||level===1)return true;const prev=CATEGORY_BY_LEVEL[level-1];const required=requiredCount(prev);return required>0&&completedCount(prev)>=required;}
  function getStatus(category){const cat=normalizeCategory(category);return{unlocked:isLevelUnlocked(cat),required:requiredCount(cat),completed:completedCount(cat),level:LEVEL_BY_CATEGORY[cat]||0};}
  window.INDOMARK_LEARN_LEVEL_GATE={LEVEL_BY_CATEGORY,CATEGORY_BY_LEVEL,normalizeCategory,sourceVideos,catalogSources,requiredCount,setRequired,syncProgressRecord,syncLegacyProgress,completedCount,isSlotCompleted,markCompleted,isLevelUnlocked,getStatus};
})();
