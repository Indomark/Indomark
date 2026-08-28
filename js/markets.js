document.addEventListener('DOMContentLoaded',()=>{
 const symbols=['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK'];
 const money=v=>Number.isFinite(Number(v))?'₹'+Number(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
 const apply=d=>{set(`m-price-${d.symbol}`,money(d.price));const ch=Number(d.change);set(`m-change-${d.symbol}`,Number.isFinite(ch)?`${ch>=0?'+':''}${ch.toFixed(2)}%`:'—');const e=document.getElementById(`m-change-${d.symbol}`);if(e){e.classList.remove('up','down');e.classList.add(ch>=0?'up':'down');}set('updated','Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}));};
 const api=window.IndoSpeedMarket;
 symbols.forEach(symbol=>{const cached=api?.cached?.(symbol);if(cached)apply(cached);});
 document.querySelectorAll('.stock-row').forEach(row=>row.addEventListener('click',()=>{const symbol=row.dataset.symbol;if(symbol){localStorage.setItem('indospeed_selected_stock',symbol);location.href='stock.html';}}));
 document.getElementById('refreshButton')?.addEventListener('click',()=>api?.getFastQuotes?.(symbols).then(rows=>rows.forEach(apply)).catch(e=>console.warn('Manual market refresh failed',e)));
 const stopLive=api?.startLive?.(symbols,apply,15000);
 window.addEventListener('beforeunload',()=>stopLive?.());
});
