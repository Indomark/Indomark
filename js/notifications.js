document.addEventListener('DOMContentLoaded',()=>{
 const key='indomark_notifications';
 const sample=[
  {id:'market-open',type:'alerts',title:'Market is Open',text:'NSE is now open for trading.',time:'9:15 AM',unread:true,icon:'market',createdAt:Date.now()-60_000},
  {id:'nifty-up',type:'updates',title:'NIFTY 50 Up',text:'NIFTY 50 is up by 0.66%.',time:'9:14 AM',unread:true,icon:'chart',createdAt:Date.now()-120_000},
  {id:'practice',type:'updates',title:'Daily Practice Reminder',text:'Complete your daily practice.',time:'8:30 AM',unread:true,icon:'practice',createdAt:Date.now()-3_000_000},
  {id:'course',type:'updates',title:'New Course Available',text:'Learn Options Trading Basics.',time:'Yesterday',unread:false,icon:'course',createdAt:Date.now()-86_400_000},
  {id:'system',type:'system',title:'Weekend Webinar',text:'Join the live webinar this Sunday.',time:'2 days ago',unread:false,icon:'announce',createdAt:Date.now()-172_800_000}
 ];
 const list=document.getElementById('notificationList');
 const filters=[...document.querySelectorAll('.filter-chip')];
 const markAll=document.getElementById('markAllRead');
 const clear=document.getElementById('clearBtn');
 let current='all';
 let remoteItems=[];
 let liveMode=false;

 function escapeHtml(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 function icon(name){
  const paths={
   market:'<path d="M6 18V9m6 9V5m6 13v-6"/><path d="M4 18h16"/>',
   chart:'<path d="M4 18V9m5 9V6m5 12v-4m5 4V4"/><path d="M3 19h18"/>',
   practice:'<circle cx="12" cy="12" r="8"/><path d="m8.5 12.2 2.2 2.2 4.8-5"/>',
   course:'<path d="M4 5.5c2.8-.8 5.3-.2 8 1.4v12.2c-2.7-1.6-5.2-2.2-8-1.4V5.5Z"/><path d="M20 5.5c-2.8-.8-5.3-.2-8 1.4v12.2c2.7-1.6 5.2-2.2 8-1.4V5.5Z"/><path d="M12 6.9v12.2"/>',
   announce:'<path d="M4 10v4l12 4V6L4 10Z"/><path d="M16 9v6"/><path d="M7 14v5"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.announce}</svg>`;
 }
 function localLoad(){
  try{const stored=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(stored)?stored:sample;}catch{return sample;}
 }
 function localSave(items){localStorage.setItem(key,JSON.stringify(items));}
 function currentItems(){return liveMode?remoteItems:localLoad();}
 function render(){
  const items=currentItems();
  const filtered=current==='all'?items:items.filter(x=>x.type===current);
  if(!filtered.length){list.innerHTML='<div class="notification-empty glass"><strong>No notifications</strong><span>You are all caught up.</span></div>';return;}
  list.innerHTML=filtered.map(x=>`<article class="notification-card glass ${x.unread?'unread':''}" data-id="${escapeHtml(x.id)}" data-source="${escapeHtml(x.source||'local')}"><span class="notification-icon">${icon(x.icon)}</span><div class="notification-body"><h2>${escapeHtml(x.title)}</h2><p>${escapeHtml(x.text)}</p></div><div class="notification-meta"><span class="notification-time">${escapeHtml(x.time)}</span><button class="notification-status" type="button" data-action="read">${x.unread?'Mark read':'Read'}</button></div></article>`).join('');
 }
 function renderBadge(){
  const badge=document.getElementById('notificationCount');
  if(!badge)return;
  const n=currentItems().filter(x=>x.unread).length;
  badge.textContent=n>99?'99+':String(n);
  badge.hidden=!n;
 }
 filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');current=btn.dataset.filter||'all';render();}));
 markAll?.addEventListener('click',async()=>{
  const items=currentItems();
  if(liveMode && window.IndomarkNotifications){
   try{await window.IndomarkNotifications.markAllRead(items);}catch(error){console.warn('Mark all read failed:',error);}
  } else localSave(items.map(x=>({...x,unread:false})));
  remoteItems=remoteItems.map(x=>({...x,unread:false})); render(); renderBadge();
 });
 clear?.addEventListener('click',()=>{
  if(liveMode){
   remoteItems=[]; render(); renderBadge();
   return;
  }
  localSave([]);render();renderBadge();
 });
 list?.addEventListener('click',async e=>{
  const button=e.target.closest('[data-action="read"]');if(!button)return;
  const card=button.closest('[data-id]');if(!card)return;
  const id=card.dataset.id;
  if(liveMode){
   const item=remoteItems.find(x=>x.id===id);
   if(item){try{await window.IndomarkNotifications.markRead(item);}catch(error){console.warn('Mark read failed:',error);}remoteItems=remoteItems.map(x=>x.id===id?{...x,unread:false}:x);render();renderBadge();}
   return;
  }
  localSave(localLoad().map(x=>x.id===id?{...x,unread:false}:x));render();renderBadge();
 });

 if(window.IndomarkNotifications){
  liveMode=true;
  window.IndomarkNotifications.watch((items)=>{remoteItems=items;render();renderBadge();});
 }
 render();
 renderBadge();
});
