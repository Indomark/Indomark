(function(){
 const BUILD='20260829-8';
 const url=new URL(window.location.href);
 if(!url.searchParams.has('v')){
  url.searchParams.set('v',BUILD);
  window.location.replace(url.href);
  return;
 }
})();

document.addEventListener('DOMContentLoaded',()=>{
 const userName=document.getElementById('userName');
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem('indomark.user')||'null');}catch{}
 if(saved?.fullName) userName.textContent=saved.fullName.split(/\s+/)[0];
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
 const pad=n=>String(n).padStart(2,'0');
 const tz='Asia/Kolkata';

 // NSE 2026 equity-market holidays. Weekends are handled separately.
 const NSE_HOLIDAYS_2026=new Set([
  '2026-01-26','2026-03-03','2026-03-26','2026-03-31','2026-04-03',
  '2026-04-14','2026-05-01','2026-05-28','2026-06-26','2026-09-14',
  '2026-10-02','2026-10-20','2026-11-10','2026-11-24','2026-12-25'
 ]);

 function dateKey(p){return `${p.year}-${pad(p.month)}-${pad(p.day)}`;}
 function weekdayNum(p){return new Date(Date.UTC(p.year,p.month-1,p.day)).getUTCDay();}
 function isTradingDay(p){
  const d=weekdayNum(p);
  return d>=1&&d<=5&&!NSE_HOLIDAYS_2026.has(dateKey(p));
 }

 function indiaParts(date=new Date()){
  const parts=new Intl.DateTimeFormat('en-IN',{
   timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',weekday:'long',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
  }).formatToParts(date);
  const get=k=>parts.find(p=>p.type===k)?.value;
  return {
   year:Number(get('year')),month:Number(get('month')),day:Number(get('day')),
   hour:Number(get('hour')),minute:Number(get('minute')),second:Number(get('second')),
   weekday:get('weekday')
  };
 }

 function wallMs(p){return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);}

 function addDays(p,days){
  const d=new Date(Date.UTC(p.year,p.month-1,p.day));
  d.setUTCDate(d.getUTCDate()+days);
  return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()};
 }

 function nextTradingDate(base){
  let cursor={year:base.year,month:base.month,day:base.day};
  while(true){
   if(isTradingDay(cursor))return cursor;
   cursor=addDays(cursor,1);
  }
 }

 function formatDuration(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  const h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
  if(h>0)return `${h}h ${pad(m)}m ${pad(s)}s`;
  return `${m}m ${pad(s)}s`;
 }

 function targetFor(base,hour,minute){
  return {year:base.year,month:base.month,day:base.day,hour,minute,second:0};
 }

 function tradingLabel(p,prefix){
  return `${prefix}: ${p.weekday || new Intl.DateTimeFormat('en-IN',{timeZone:tz,weekday:'long'}).format(new Date(Date.UTC(p.year,p.month-1,p.day)))} · ${pad(p.day)} ${new Intl.DateTimeFormat('en-IN',{timeZone:tz,month:'short'}).format(new Date(Date.UTC(p.year,p.month-1,p.day)))} ${p.year} · 9:15 AM IST`;
 }

 function updateCountdown(now=new Date()){
  const p=indiaParts(now);
  const minutes=p.hour*60+p.minute+(p.second/60);
  const currentDay={year:p.year,month:p.month,day:p.day};
  const isTrading=isTradingDay(currentDay);
  const openMinutes=9*60+15,closeMinutes=15*60+30;
  const isOpen=isTrading&&minutes>=openMinutes&&minutes<closeMinutes;
  const dot=document.getElementById('statusDot');
  dot?.classList.remove('open','closed');

  if(isOpen){
   const close=targetFor(p,15,30);
   set('marketStatus','Market Open');
   set('marketGreeting','Market is open · Live NSE session');
   set('marketNext','NSE regular session: 9:15 AM–3:30 PM IST');
   set('marketCountdown',formatDuration(wallMs(close)-wallMs(p)));
   set('marketCloseLabel','Closes at 3:30 PM IST');
   dot?.classList.add('open');
   return;
  }

  const beforeOpen=isTrading&&minutes<openMinutes;
  const next=beforeOpen
   ? {...currentDay,hour:9,minute:15,second:0,weekday:p.weekday}
   : (()=>{
      const d=nextTradingDate(addDays(p,1));
      const dt=new Date(Date.UTC(d.year,d.month-1,d.day));
      return {...d,hour:9,minute:15,second:0,weekday:new Intl.DateTimeFormat('en-IN',{timeZone:tz,weekday:'long'}).format(dt)};
     })();

  set('marketStatus','Market Closed');
  set('marketGreeting','Next NSE session countdown is live');
  set('marketNext','NSE regular session: 9:15 AM–3:30 PM IST');
  set('marketCountdown',formatDuration(wallMs(next)-wallMs(p)));
  set('marketCloseLabel',tradingLabel(next,beforeOpen?'Trading today':'Next trading day'));
  dot?.classList.add('closed');
 }

 updateCountdown();
 const timer=setInterval(()=>updateCountdown(),1000);
 const onVisible=()=>{if(document.visibilityState==='visible')updateCountdown();};
 document.addEventListener('visibilitychange',onVisible);
 window.addEventListener('focus',onVisible);
 window.addEventListener('beforeunload',()=>{
  clearInterval(timer);
  document.removeEventListener('visibilitychange',onVisible);
  window.removeEventListener('focus',onVisible);
 });
});
