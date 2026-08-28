document.addEventListener('DOMContentLoaded',()=>{
 const user=JSON.parse(localStorage.getItem('indospeed.user')||'null');
 const name=String(user?.fullName||user?.name||'Investor').trim()||'Investor';
 const email=String(user?.email||'').trim();
 const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'IS';
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 set('profileName',name);set('profileEmail',email||'Not signed in');set('profileAvatar',initials);
 try{const paper=Number(localStorage.getItem('indospeed_paper_balance_v2'));set('paperBalance',Number.isFinite(paper)?`₹${paper.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'₹1,000.00')}catch{set('paperBalance','₹1,000.00')}
 try{const watch=JSON.parse(localStorage.getItem('indospeed_watchlist')||'[]');set('watchCount',Array.isArray(watch)?watch.length:'0')}catch{set('watchCount','0')}
 const status=window.IndoSpeedSettings?.getAccountStatus?.()||'active';
 const statusValue=document.getElementById('memberStatusValue');const statusToggle=document.getElementById('accountStatusToggle');const statusHint=document.getElementById('accountStatusHint');
 const renderStatus=(next)=>{const inactive=next==='inactive';if(statusValue){statusValue.textContent=inactive?'Inactive':'Active';statusValue.classList.toggle('inactive',inactive);statusValue.classList.toggle('value',true)}if(statusToggle){statusToggle.setAttribute('aria-pressed',String(!inactive));statusToggle.textContent=inactive?'Activate':'Deactivate';statusToggle.classList.toggle('inactive-action',inactive)}if(statusHint)statusHint.textContent=inactive?'All app features are disabled until you activate your account again.':'All app features are available.'};
 renderStatus(status);
 statusToggle?.addEventListener('click',()=>{const current=window.IndoSpeedSettings?.getAccountStatus?.()||'active';const next=current==='active'?'inactive':'active';window.IndoSpeedSettings?.setAccountStatus?.(next);renderStatus(next);const message=document.getElementById('profileMessage');if(message)message.textContent=next==='inactive'?'Account deactivated. Features are now inactive.':'Account activated. All features are available.'});
 window.addEventListener('indospeed-account-status-change',(event)=>renderStatus(event.detail?.status||'active'));
 document.getElementById('logoutBtn')?.addEventListener('click',async()=>{try{await window.IndoSpeedFirebase?.auth?.signOut()}catch(error){console.warn('Firebase sign-out failed:',error)}localStorage.removeItem('indospeed.user');localStorage.removeItem('indospeed.session');localStorage.removeItem('indospeed.loginEmail');location.href='login.html';});
});
