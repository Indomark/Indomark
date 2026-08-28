document.addEventListener('DOMContentLoaded',()=>{
 const API_BASE='https://indoverification-production.up.railway.app';
 const getToken=()=>String(localStorage.getItem('indomark.token')||'').trim();
 const readUser=()=>{try{return JSON.parse(localStorage.getItem('indomark.user')||'null')}catch{return null}};
 const user=readUser();
 const name=String(user?.fullName||user?.name||'Investor').trim()||'Investor';
 const email=String(user?.email||localStorage.getItem('indomark.loginEmail')||'').trim();
 const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0].toUpperCase()).join('')||'IM';
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
 const message=text=>set('profileMessage',text);
 set('profileName',name);set('profileEmail',email||'Not signed in');set('profileAvatar',initials);
 try{const paper=Number(localStorage.getItem('indomark_paper_balance_v2')??localStorage.getItem('indospeed_paper_balance_v2'));set('paperBalance',Number.isFinite(paper)?`₹${paper.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'₹1,000.00')}catch{set('paperBalance','₹1,000.00')}
 try{const watch=JSON.parse(localStorage.getItem('indomark_watchlist')||localStorage.getItem('indospeed_watchlist')||'[]');set('watchCount',Array.isArray(watch)?watch.length:'0')}catch{set('watchCount','0')}
 const statusKey='indomark_account_status_v1';
 let status=(user?.active===false||localStorage.getItem(statusKey)==='inactive')?'inactive':'active';
 const statusValue=document.getElementById('memberStatusValue');
 const statusToggle=document.getElementById('accountStatusToggle');
 const statusHint=document.getElementById('accountStatusHint');
 const renderStatus=(next)=>{status=next==='inactive'?'inactive':'active';if(statusValue){statusValue.textContent=status==='inactive'?'Inactive':'Active';statusValue.classList.toggle('inactive',status==='inactive');statusValue.classList.add('value')}if(statusToggle){statusToggle.setAttribute('aria-pressed',String(status==='active'));statusToggle.textContent=status==='inactive'?'Activate':'Deactivate';statusToggle.classList.toggle('inactive-action',status==='inactive')}if(statusHint)statusHint.textContent=status==='inactive'?'All app features are disabled until you activate your account again.':'All app features are available.';localStorage.setItem(statusKey,status)};
 renderStatus(status);
 async function api(path,options={}){const token=getToken();const headers={'Content-Type':'application/json',...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const response=await fetch(`${API_BASE}${path}`,{...options,headers});let body={};try{body=await response.json()}catch{}if(!response.ok)throw new Error(body.error||`Request failed (${response.status})`);return body;}
 async function accountAction(action){
   const token=getToken();
   if(!token){message('Session expired. Please login again.');return}
   statusToggle.disabled=true;message(`Sending ${action} OTP…`);
   try{
     await api(`/api/account/${action}/request-otp`,{method:'POST'});
     const otp=window.prompt(`Enter the 6-digit OTP sent to ${email}:`);
     if(!/^\d{6}$/.test(String(otp||'').trim())){message('Enter the 6-digit OTP to continue.');return}
     message(`Verifying ${action} OTP…`);
     await api(`/api/account/${action}/verify-otp`,{method:'POST',body:JSON.stringify({otp:String(otp).trim()})});
     const saved=readUser()||{};const updated={...saved,active:action==='activate'};localStorage.setItem('indomark.user',JSON.stringify(updated));
     renderStatus(action==='activate'?'active':'inactive');
     message(action==='activate'?'Account activated successfully.':'Account deactivated successfully.');
   }catch(error){message(error?.message||`Unable to ${action} account.`)}finally{statusToggle.disabled=false}
 }
 statusToggle?.addEventListener('click',async()=>{const action=status==='active'?'deactivate':'activate';await accountAction(action)});
 window.addEventListener('indomark-account-status-change',event=>renderStatus(event.detail?.status||'active'));
 document.getElementById('logoutBtn')?.addEventListener('click',()=>{
   localStorage.removeItem('indomark.token');
   localStorage.removeItem('indomark.user');
   localStorage.removeItem('indomark.session');
   localStorage.removeItem('indomark.loginEmail');
   localStorage.removeItem(statusKey);
   location.href='login.html';
 });
});
