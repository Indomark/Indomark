document.addEventListener('DOMContentLoaded',()=>{
 const userName=document.getElementById('userName');
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem('indomark.user')||'null');}catch{}
 if(saved?.fullName) userName.textContent=saved.fullName.split(/\s+/)[0];
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
 const money=v=>Number.isFinite(Number(v))?'₹'+Number(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
 const pad=n=>String(n).padStart(2,'0');
 function updateCountdown(now){
  const day=now.getDay();
  const mins=now.getHours()*60+now.getMinutes();
  const marketOpen=day>=1&&day<=5&&mins>=555&&mins<930;
  const dot=document.getElementById('statusDot');
  if(marketOpen){
   const close=new Date(now);close.setHours(15,30,0,0);
   const diff=Math.max(0,close-now);
   const total=Math.floor(diff/1000);
   const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
   set('marketStatus','Market Open');
   set('marketGreeting','Market is open · Tracking current market movers');
   set('marketNext','NSE regular session: 9:15 AM–3:30 PM');
   set('marketCountdown',`${pad(h)}:${pad(m)}:${pad(s)}`);
   set('marketCloseLabel','Regular session end: 3:30 PM');
   dot?.classList.add('open');
  }else{
   set('marketStatus','Market Closed');
   set('marketGreeting','Track. Analyse. Invest Smartly.');
   set('marketNext','NSE regular session: 9:15 AM–3:30 PM');
   set('marketCountdown','—');
   set('marketCloseLabel',day===0||day===6?'Next regular session on a trading day':'Regular session starts at 9:15 AM');
   dot?.classList.remove('open');
  }
 }
 function moverRow(stock,negative=false){
  const pct=Number(stock.change);
  const pctText=Number.isFinite(pct)?`${pct>=0?'+':''}${pct.toFixed(2)}%`:'—';
  const row=document.createElement('button');
  row.className='stock-row';row.type='button';row.dataset.symbol=stock.symbol;
  row.innerHTML=`<span><b>${stock.symbol}</b><small>${stock.company||stock.symbol} · ${money(stock.price)}</small></span><strong class="${negative?'negative':'positive'}">${pctText}</strong>`;
  row.addEventListener('click',()=>{localStorage.setItem('indomark_selected_stock',stock.symbol);location.href='stock.html';});
  return row;
 }
 function renderMovers(containerId,rows,negative,updatedId){
  const box=document.getElementById(containerId);if(!box||!rows.length)return;
  box.innerHTML='';rows.forEach(stock=>box.appendChild(moverRow(stock,negative)));
  set(updatedId,`Updated ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}`);
 }
 function applyTrending(data){
  const gainers=Array.isArray(data?.gainers)?data.gainers:[];
  const losers=Array.isArray(data?.losers)?data.losers:[];
  if(gainers.length)renderMovers('gainersList',gainers.slice(0,5),false,'gainersUpdated');
  if(losers.length)renderMovers('losersList',losers.slice(0,5),true,'losersUpdated');
 }
 function showCached(){
  const api=window.IndomarkMarket;if(!api?.cached)return;
  const cached=['RELIANCE','TCS','HDFCBANK','INFY','ICICIBANK'].map(s=>api.cached(s)).filter(Boolean);
  if(cached.length){
   const sorted=[...cached].sort((a,b)=>Number(b.change)-Number(a.change));
   renderMovers('gainersList',sorted.slice(0,5),false,'gainersUpdated');
   renderMovers('losersList',[...sorted].reverse().slice(0,5),true,'losersUpdated');
  }
 }
 async function refreshNow(){
  const api=window.IndomarkMarket;if(!api?.getTrending)return;
  try{applyTrending(await api.getTrending());}catch(e){console.warn('Home trending refresh failed',e);}
 }
 updateCountdown(new Date());
 showCached();
 refreshNow();
 const timer=setInterval(()=>updateCountdown(new Date()),1000);
 const dataTimer=setInterval(refreshNow,60000);
 const onVisible=()=>{if(document.visibilityState==='visible'){updateCountdown(new Date());refreshNow();}};
 document.addEventListener('visibilitychange',onVisible);
 window.addEventListener('focus',onVisible);
 window.addEventListener('beforeunload',()=>{clearInterval(timer);clearInterval(dataTimer);document.removeEventListener('visibilitychange',onVisible);window.removeEventListener('focus',onVisible);});
});
