const fallbackStocks=[
 {symbol:'RELIANCE',name:'Reliance Industries Ltd.',type:'stocks',icon:'R'},
 {symbol:'TCS',name:'Tata Consultancy Services Ltd.',type:'stocks',icon:'T'},
 {symbol:'INFY',name:'Infosys Ltd.',type:'stocks',icon:'I'},
 {symbol:'HDFCBANK',name:'HDFC Bank Ltd.',type:'stocks',icon:'H'},
 {symbol:'ICICIBANK',name:'ICICI Bank Ltd.',type:'stocks',icon:'I'}
];
let stocks=[...fallbackStocks];
let filter='all';
let visibleLimit=100;
const PAGE_SIZE=100;
const input=document.querySelector('#stockSearch');
const results=document.querySelector('#results');
const empty=document.querySelector('#empty');
const count=document.querySelector('#resultCount');
const tabs=[...document.querySelectorAll('.tab')];
const clear=document.querySelector('.clear-btn');
const CACHE_KEY='indomark_nse_stock_master';
const CACHE_TTL=6*60*60*1000;
function iconFor(symbol){return (symbol||'S').replace(/[^A-Z]/g,'').slice(0,1)||'S';}
function normalizeRow(row){
 const symbol=String(row.SYMBOL||row.Symbol||row.symbol||'').trim();
 const name=String(row['NAME OF COMPANY']||row['Company Name']||row.companyName||row.NAME||'').trim();
 const series=String(row.SERIES||row.Series||row.series||'').trim();
 if(!symbol||!name)return null;
 if(series&&series!=='EQ')return null;
 return {symbol,name,type:'stocks',icon:iconFor(symbol)};
}
function loadCached(){
 try{
  const cached=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');
  if(Array.isArray(cached?.stocks)&&cached.stocks.length){stocks=cached.stocks;return Date.now()-Number(cached.updatedAt||0)<CACHE_TTL;}
 }catch{}
 return false;
}
async function loadAllNSEStocks(){
 const fresh=loadCached();
 render();
 if(fresh)return;
 const url='https://nsearchives.nseindia.com/content/equities/EQUITY_L.csv';
 try{
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw new Error(`NSE stock list unavailable (${response.status})`);
  const text=await response.text();
  const lines=text.split(/\r?\n/).filter(Boolean);
  if(lines.length<2)throw new Error('NSE stock list is empty');
  const headers=lines[0].split(',').map(x=>x.trim().replace(/^\"|\"$/g,''));
  const rows=[];
  for(const line of lines.slice(1)){
   const fields=line.match(/(?:^|,)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,]*))/g)?.map(x=>x.replace(/^,/, '').replace(/^\"|\"$/g,'').replace(/\"\"/g,'\"'))||[];
   const row={};headers.forEach((h,i)=>row[h]=fields[i]||'');
   const normalized=normalizeRow(row);if(normalized)rows.push(normalized);
  }
  const seen=new Set();
  stocks=rows.filter(s=>{if(seen.has(s.symbol))return false;seen.add(s.symbol);return true;});
  stocks.sort((a,b)=>a.symbol.localeCompare(b.symbol));
  localStorage.setItem(CACHE_KEY,JSON.stringify({updatedAt:Date.now(),stocks}));
  visibleLimit=PAGE_SIZE;
  render();
 }catch(error){console.warn('NSE stock master refresh failed; keeping cached/fallback list.',error);}
}
function attachMoreHandler(total){
 document.getElementById('loadMoreStocks')?.remove();
 if(visibleLimit>=total)return;
 const btn=document.createElement('button');
 btn.id='loadMoreStocks';btn.type='button';btn.className='load-more-btn';
 btn.textContent=`Show more (${Math.min(PAGE_SIZE,total-visibleLimit)} more)`;
 btn.addEventListener('click',()=>{visibleLimit+=PAGE_SIZE;render();document.getElementById('loadMoreStocks')?.scrollIntoView({behavior:'smooth',block:'nearest'});});
 results.parentElement.appendChild(btn);
}
function setPrice(symbol,data){
 const priceEl=document.querySelector(`[data-price=\"${CSS.escape(symbol)}\"]`);
 const changeEl=document.querySelector(`[data-change=\"${CSS.escape(symbol)}\"]`);
 if(!priceEl||!changeEl)return;
 const price=Number(data?.price);const change=Number(data?.change);
 priceEl.textContent=Number.isFinite(price)?`₹${price.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'—';
 changeEl.textContent=Number.isFinite(change)?`${change>=0?'+':''}${change.toFixed(2)}%`:'—';
 changeEl.classList.toggle('positive',change>=0);changeEl.classList.toggle('negative',change<0);
}
function showCachedPrices(list){
 for(const stock of list){const cached=window.IndomarkMarket?.cached(stock.symbol);if(cached)setPrice(stock.symbol,cached);}
}
async function fastQuote(stock){
 try{
  const data=await Promise.race([
   window.IndomarkMarket?.getFastQuote(stock.symbol),
   new Promise((_,reject)=>setTimeout(()=>reject(new Error('quote timeout')),2500))
  ]);
  if(data)setPrice(stock.symbol,data);
 }catch{}
}
function hydrateVisiblePrices(list){
 const query=input.value.trim();
 const targets=(query?list.slice(0,20):list.slice(0,12));
 showCachedPrices(targets);
 targets.forEach((stock,i)=>setTimeout(()=>fastQuote(stock),i*35));
}
function selectStock(symbol){
 const normalized=String(symbol||'').trim().toUpperCase();
 if(!normalized)return;
 localStorage.setItem('indomark_selected_stock',normalized);
 localStorage.setItem('indomark_practice_stock_v1',normalized);
 location.href='stock.html';
}
function render(){
 const q=input.value.trim().toLowerCase();
 const list=stocks.filter(s=>(filter==='all'||s.type===filter)&&(!q||`${s.symbol} ${s.name}`.toLowerCase().includes(q)));
 count.textContent=`${list.length.toLocaleString('en-IN')} result${list.length===1?'':'s'}`;
 const shown=list.slice(0,visibleLimit);
 results.innerHTML=shown.map(s=>`<button class=\"result-card\" data-symbol=\"${s.symbol}\"><span class=\"result-icon\">${s.icon}</span><span class=\"result-main\"><strong>${s.symbol}</strong><span>${s.name}</span></span><span class=\"result-side\"><strong data-price=\"${s.symbol}\">—</strong><span data-change=\"${s.symbol}\">—</span></span></button>`).join('');
 empty.hidden=list.length!==0;
 results.querySelectorAll('.result-card').forEach(btn=>btn.addEventListener('click',()=>selectStock(btn.dataset.symbol)));
 attachMoreHandler(list.length);
 hydrateVisiblePrices(list);
}
input.addEventListener('input',()=>{visibleLimit=PAGE_SIZE;render();});
tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');filter=tab.dataset.filter;visibleLimit=PAGE_SIZE;render();}));
clear.addEventListener('click',()=>{input.value='';input.focus();visibleLimit=PAGE_SIZE;render();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input.focus();}});
render();
loadAllNSEStocks();