document.addEventListener('DOMContentLoaded',()=>{
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
 set('balance','—');
 set('portfolioValue','—');
 set('pnl','—');
 set('holdingCount','0 stocks');
 set('orderCount','0 items');
 const holdings=document.getElementById('holdingsList');
 const orders=document.getElementById('ordersList');
 if(holdings)holdings.innerHTML='<p class="empty">No live holdings are connected yet.</p>';
 if(orders)orders.innerHTML='<p class="empty">No live trading activity is connected yet.</p>';
});