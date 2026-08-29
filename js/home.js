document.addEventListener('DOMContentLoaded',()=>{
 const userName=document.getElementById('userName');
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem('indomark.user')||'null');}catch{}
 if(saved?.fullName) userName.textContent=saved.fullName.split(/\s+/)[0];
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
 const pad=n=>String(n).padStart(2,'0');
 const tz='Asia/Kolkata';

 function indiaParts(date=new Date()){
  const parts=new Intl.DateTimeFormat('en-IN',{
   timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
  }).formatToParts(date);
  const get=k=>parts.find(p=>p.type===k)?.value;
  return {
   year:Number(get('year')),month:Number(get('month')),day:Number(get('day')),
   hour:Number(get('hour')),minute:Number(get('minute')),second:Number(get('second')),
   weekday:get('weekday')
  };
 }

 function wallMs(p){
  return Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);
 }

 function addDays(p,days){
  const d=new Date(Date.UTC(p.year,p.month-1,p.day));
  d.setUTCDate(d.getUTCDate()+days);
  return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()};
 }

 function nextTradingDate(base){
  let cursor={year:base.year,month:base.month,day:base.day};
  while(true){
   const d=new Date(Date.UTC(cursor.year,cursor.month-1,cursor.day));
   const weekday=d.getUTCDay();
   if(weekday>=1&&weekday<=5)return cursor;
   cursor=addDays(cursor,1);
  }
 }

 function formatDuration(ms){
  const total=Math.max(0,Math.floor(ms/1000));
  const h=Math.floor(total/3600);
  const m=Math.floor((total%3600)/60);
  const s=total%60;
  if(h>0)return `${h}h ${pad(m)}m ${pad(s)}s`;
  return `${m}m ${pad(s)}s`;
 }

 function clockLabel(p){
  return `${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`;
 }

 function targetFor(base,hour,minute){
  return {year:base.year,month:base.month,day:base.day,hour,minute,second:0};
 }

 function updateCountdown(now=new Date()){
  const p=indiaParts(now);
  const minutes=p.hour*60+p.minute+(p.second/60);
  const weekdayNum=(new Date(Date.UTC(p.year,p.month-1,p.day))).getUTCDay();
  const isWeekday=weekdayNum>=1&&weekdayNum<=5;
  const openMinutes=9*60+15;
  const closeMinutes=15*60+30;
  const isOpen=isWeekday&&minutes>=openMinutes&&minutes<closeMinutes;
  const dot=document.getElementById('statusDot');

  if(isOpen){
   const close=targetFor(p,15,30);
   const diff=wallMs(close)-wallMs(p);
   set('marketStatus','Market Open');
   set('marketGreeting','Market is open · Live NSE session');
   set('marketNext','NSE regular session: 9:15 AM–3:30 PM IST');
   set('marketCountdown',formatDuration(diff));
   set('marketCloseLabel',`Closes at ${clockLabel(close)} IST`);
   dot?.classList.add('open');
   return;
  }

  let next;
  if(isWeekday&&minutes<openMinutes){
   next=targetFor(p,9,15);
  }else{
   const nextDay=nextTradingDate(addDays(p,1));
   next={...nextDay,hour:9,minute:15,second:0};
  }
  const diff=wallMs(next)-wallMs(p);
  set('marketStatus','Market Closed');
  set('marketGreeting','Next NSE session countdown is live');
  set('marketNext','NSE regular session: 9:15 AM–3:30 PM IST');
  set('marketCountdown',formatDuration(diff));
  set('marketCloseLabel',`Opens at 9:15 AM IST${isWeekday&&minutes<openMinutes?' today': ' on the next trading day'}`);
  dot?.classList.remove('open');
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
