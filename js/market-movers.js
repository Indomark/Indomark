/* Indomark market movers share the same quote service used by Home, Markets and Stock. */
(function(){
 const names={RELIANCE:'Reliance Industries',TCS:'Tata Consultancy Services',INFY:'Infosys',HDFCBANK:'HDFC Bank',ICICIBANK:'ICICI Bank'};
 const symbols=Object.keys(names);
 const cacheKey=kind=>`indomark_home_movers_${kind}`;
 const readCache=kind=>{try{const x=JSON.parse(localStorage.getItem(cacheKey(kind))||'null');return x?.rows?.length?x:null;}catch{return null;}};
 async function get(kind){
  const api=window.IndomarkMarket;if(!api?.getFastQuotes)throw new Error('Market quote service unavailable');
  const quotes=await api.getFastQuotes(symbols);
  const rows=quotes.map(q=>({symbol:q.symbol,company:names[q.symbol]||q.symbol,price:Number(q.price),change:Number(q.change),volume:Number(q.volume)})).filter(x=>Number.isFinite(x.price)&&Number.isFinite(x.change));
  rows.sort((a,b)=>kind==='losers'?a.change-b.change:b.change-a.change);
  const result=rows.slice(0,4);
  localStorage.setItem(cacheKey(kind),JSON.stringify({at:Date.now(),rows:result}));
  return result;
 }
 window.IndomarkMovers={get,readCache};
})();