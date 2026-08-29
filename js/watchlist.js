document.addEventListener('DOMContentLoaded',()=>{
 const listEl=document.getElementById('list');
 const empty=document.getElementById('empty');
 const count=document.getElementById('count');
 const defaults=[
  {symbol:'RELIANCE',name:'Reliance Industries',price:'₹2,856.45',change:'+1.25%'},
  {symbol:'TCS',name:'Tata Consultancy Services',price:'₹3,450.20',change:'+0.35%'},
  {symbol:'INFY',name:'Infosys',price:'₹1,543.60',change:'+0.68%'},
  {symbol:'HDFCBANK',name:'HDFC Bank',price:'₹1,679.15',change:'+1.10%'}
 ];
 let items=defaults;
 try{const saved=JSON.parse(localStorage.getItem('indomark_watchlist')||'null');if(Array.isArray(saved))items=saved;}catch{}
 function save(){localStorage.setItem('indomark_watchlist',JSON.stringify(items));}
 function openStock(index){const stock=items[index];if(!stock?.symbol)return;localStorage.setItem('indomark_selected_stock',String(stock.symbol).toUpperCase());location.href='stock.html';}
 function render(){
  count.textContent=`${items.length} stock${items.length===1?'':'s'}`;
  empty.hidden=items.length!==0;
  listEl.innerHTML=items.map((s,i)=>`<div class="watch-row" data-i="${i}" role="link" tabindex="0" aria-label="Open ${s.symbol}"><span class="watch-main"><strong>${s.symbol}</strong><span>${s.price} · ${s.name}</span></span><span class="watch-side"><strong class="positive">${s.change}</strong><button class="remove-btn" type="button" data-remove="${i}" aria-label="Remove ${s.symbol}">×</button></span></div>`).join('');
  listEl.querySelectorAll('.watch-row').forEach(row=>{
   const open=()=>openStock(Number(row.dataset.i));
   row.addEventListener('click',e=>{if(e.target.closest('[data-remove]'))return;open();});
   row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(e.target.closest('[data-remove]'))return;open();}});
  });
  listEl.querySelectorAll('[data-remove]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const index=Number(btn.dataset.remove);items.splice(index,1);save();render();}));
 }
 document.getElementById('addBtn')?.addEventListener('click',()=>location.href='search.html');
 render();
});