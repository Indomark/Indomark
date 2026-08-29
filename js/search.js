let stocks=[];
let filter='all';
let visibleLimit=100;
const PAGE_SIZE=100;
const input=document.querySelector('#stockSearch');
const results=document.querySelector('#results');
const empty=document.querySelector('#empty');
const count=document.querySelector('#resultCount');
const tabs=[...document.querySelectorAll('.tab')];
const clear=document.querySelector('.clear-btn');
let stopWatching=null;

function selectStock(symbol){
 const normalized=String(symbol||'').trim().toUpperCase();
 if(!normalized)return;
 localStorage.setItem('indomark_selected_stock',normalized);
 localStorage.setItem('indomark_practice_stock_v1',normalized);
 location.href='stock.html';
}

function render(){
 const q=String(input?.value||'').trim().toLowerCase();
 const list=stocks.filter(s=>(filter==='all'||s.type===filter)&&(!q||`${s.symbol} ${s.name}`.toLowerCase().includes(q)));
 if(count) count.textContent=`${list.length.toLocaleString('en-IN')} result${list.length===1?'':'s'}`;
 const shown=list.slice(0,visibleLimit);
 results.innerHTML=shown.map(s=>`<button class="result-card" type="button" data-symbol="${s.symbol}"><span class="result-icon">${s.icon}</span><span class="result-main"><strong>${s.symbol}</strong><span>${s.name}</span>${s.analysisAvailable?'<small class="analysis-available">AI Analysis Available</small>':''}</span><span class="result-side"><strong>${s.analysisAvailable?'View Analysis':'Available'}</strong><span>›</span></span></button>`).join('');
 if(empty) empty.hidden=list.length!==0;
 results.querySelectorAll('.result-card').forEach(btn=>btn.addEventListener('click',()=>selectStock(btn.dataset.symbol)));
 document.getElementById('loadMoreStocks')?.remove();
 if(visibleLimit<list.length){
  const btn=document.createElement('button');btn.id='loadMoreStocks';btn.type='button';btn.className='load-more-btn';btn.textContent=`Show more (${Math.min(PAGE_SIZE,list.length-visibleLimit)} more)`;
  btn.addEventListener('click',()=>{visibleLimit+=PAGE_SIZE;render();document.getElementById('loadMoreStocks')?.scrollIntoView({behavior:'smooth',block:'nearest'});});
  results.parentElement.appendChild(btn);
 }
}

function startWatch(){
 if(!window.IndomarkStocks?.watch){
  if(count)count.textContent='Unavailable';
  if(empty)empty.hidden=false;
  return;
 }
 stopWatching?.();
 stopWatching=window.IndomarkStocks.watch((items)=>{stocks=items;visibleLimit=PAGE_SIZE;render();});
 if(count)count.textContent='Loading...';
}

input?.addEventListener('input',()=>{visibleLimit=PAGE_SIZE;render();});
tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));tab.classList.add('active');filter=tab.dataset.filter||'all';visibleLimit=PAGE_SIZE;render();}));
clear?.addEventListener('click',()=>{if(input){input.value='';input.focus();}visibleLimit=PAGE_SIZE;render();});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();input?.focus();}});

render();
startWatch();
