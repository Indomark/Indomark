document.addEventListener('DOMContentLoaded',()=>{
 const symbol=(localStorage.getItem('indospeed_selected_stock')||'RELIANCE').toUpperCase();
 const money=v=>Number.isFinite(Number(v))?'₹'+Number(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
 const pct=v=>Number.isFinite(Number(v))?`${Number(v)>=0?'+':''}${Number(v).toFixed(2)}%`:'—';
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
 set('stockSymbol',symbol);set('stockName',symbol);set('stockIcon',(symbol.replace(/[^A-Z]/g,'').slice(0,1)||'S'));
 const line=document.querySelector('.chart .line');const dot=document.querySelector('.chart .end-dot');
 function drawChart(series){if(!line||!dot||!series?.length)return;const points=series.slice(-80);const min=Math.min(...points.map(x=>x.close));const max=Math.max(...points.map(x=>x.close));const span=max-min||1;const pts=points.map((x,i)=>{const px=(i/(points.length-1||1))*900;const py=285-((x.close-min)/span)*245;return `${px.toFixed(1)},${py.toFixed(1)}`;}).join(' ');line.setAttribute('points',pts);const last=points.at(-1);const py=285-((last.close-min)/span)*245;dot.setAttribute('cx','900');dot.setAttribute('cy',py.toFixed(1));}
 const apply=d=>{set('stockPrice',money(d.price));set('stockChange',pct(d.change));set('chartValue',money(d.price)+' · '+pct(d.change));set('tooltipPrice',money(d.price));set('tooltipChange',pct(d.change));set('dOpen',money(d.open));set('dHigh',money(d.high));set('dLow',money(d.low));set('dPrev',money(d.previous));set('dVolume',Number.isFinite(d.volume)?Number(d.volume).toLocaleString('en-IN'):'—');const trend=Number.isFinite(d.sma20)&&Number.isFinite(d.sma50)?(d.price>d.sma20&&d.sma20>d.sma50?'Bullish':d.price<d.sma20&&d.sma20<d.sma50?'Bearish':'Neutral'):'—';set('trendSignal',trend);set('riskSignal',Number.isFinite(d.rsi)?(d.rsi>70||d.rsi<30?'High':'Medium'):'—');drawChart(d.series);const source=document.querySelector('.chart-head div span');if(source)source.textContent=d.source||'Live market quote';};
 const api=window.IndoSpeedMarket;
 const cached=api?.cached?.(symbol);if(cached)apply(cached);
 const firstLoad=async()=>{if(!api?.getQuote)return;try{apply(await api.getQuote(symbol));}catch(e){console.warn('Initial stock quote failed',e);}};
 if(!cached)firstLoad();
 const stopLive=api?.startLive?.([symbol],apply,15000);
 window.addEventListener('beforeunload',()=>stopLive?.());
 document.getElementById('backBtn')?.addEventListener('click',()=>history.back());
 document.getElementById('watchBtn')?.addEventListener('click',e=>{e.currentTarget.classList.toggle('saved');e.currentTarget.textContent=e.currentTarget.classList.contains('saved')?'★':'☆';});
 document.getElementById('shareBtn')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);alert('Stock page link copied.')}catch{alert('Unable to copy link')}});
 document.querySelectorAll('#rangeTabs button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#rangeTabs button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}));
 const realTradeNotice=()=>alert('Real trading is not connected yet.');
 document.getElementById('buyBtn')?.addEventListener('click',realTradeNotice);
 document.getElementById('sellBtn')?.addEventListener('click',realTradeNotice);
 document.getElementById('analysisBtn')?.addEventListener('click',()=>{localStorage.setItem('indospeed_selected_stock',symbol);location.href='analysis.html';});
});