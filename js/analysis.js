document.addEventListener('DOMContentLoaded',async()=>{
 const symbol=localStorage.getItem('indospeed_selected_stock')||'RELIANCE';
 const names={RELIANCE:'Reliance Industries',TCS:'Tata Consultancy Services',INFY:'Infosys',HDFCBANK:'HDFC Bank',ICICIBANK:'ICICI Bank'};
 const $=id=>document.getElementById(id);
 const set=(id,v)=>{const el=$(id);if(el)el.textContent=v};
 const money=n=>Number.isFinite(Number(n))?`₹${Number(n).toLocaleString('en-IN',{maximumFractionDigits:2})}`:'—';
 set('title',names[symbol]||symbol);set('subtitle','Free market-data analysis');
 $('backBtn')?.addEventListener('click',()=>history.back());
 const renderBars=data=>{const box=$('miniBars');if(!box||!data.series?.length)return;const a=data.series.slice(-20).map(x=>x.close);const min=Math.min(...a),max=Math.max(...a);box.innerHTML=a.map(v=>`<i style="height:${Math.max(12,((v-min)/(max-min||1))*82+12)}%"></i>`).join('')};
 try{
  if(!window.IndoSpeedMarket)throw new Error('Market data service unavailable');
  const data=window.IndoSpeedMarket.cached(symbol)||await window.IndoSpeedMarket.getQuote(symbol);
  const trend=data.yearReturn>=0?'Positive':'Negative';
  const technical=Number.isFinite(data.sma50)?(data.price>data.sma50?'Bullish':'Bearish'):'Unavailable';
  const momentum=Number.isFinite(data.rsi)?(data.rsi>=55?'Strong':data.rsi<=45?'Weak':'Neutral'):'Unavailable';
  const score=Math.max(10,Math.min(95,Math.round(50+(data.yearReturn>0?12:-12)+(technical==='Bullish'?10:-10)+(data.rsi>50?8:-8))));
  const signal=score>=68?'Bullish':score<=42?'Bearish':'Neutral';
  const risk=Math.abs(data.yearReturn)>35?'High':Math.abs(data.yearReturn)>18?'Medium':'Low';
  set('signal',signal);set('score',score);set('confidence',`Calculated score · ${score}/100`);set('trend',trend);set('technical',technical);set('momentum',momentum);set('risk',risk);set('sma20',money(data.sma20));set('sma50',money(data.sma50));set('rsi',Number.isFinite(data.rsi)?data.rsi.toFixed(0):'—');set('levelTrend',technical);set('dataStatus',data.source||'Updated');
  set('historyText',`1-year return ${data.yearReturn>=0?'+':''}${data.yearReturn.toFixed(2)}%. Current price ${money(data.price)}; previous close ${money(data.previous)}.`);
  renderBars(data);
  const bull=$('bullishList'), risks=$('riskList');
  if(bull){bull.innerHTML='';[data.yearReturn>=0?'Positive 1-year price trend':'Negative 1-year price trend',technical==='Bullish'?'Price above 50-day average':'Price below 50-day average',momentum==='Strong'?'Momentum above neutral':momentum==='Weak'?'Momentum below neutral':'Momentum near neutral'].forEach(x=>{const li=document.createElement('li');li.textContent=x;bull.appendChild(li)});}
  if(risks){risks.innerHTML='';[risk==='High'?'High recent volatility/range':risk==='Medium'?'Medium risk based on recent movement':'Lower calculated volatility risk',Number.isFinite(data.rsi)&&data.rsi>70?'RSI elevated':Number.isFinite(data.rsi)&&data.rsi<30?'RSI weak':'RSI not at an extreme','Free public market data can be delayed or temporarily unavailable'].forEach(x=>{const li=document.createElement('li');li.textContent=x;risks.appendChild(li)});}
  const allParas=document.querySelectorAll('.info-card p');allParas.forEach(p=>{if(/news|sentiment/i.test(p.textContent)){p.textContent='Live news sentiment is not connected yet, so no news score is shown.';}});
 }catch(err){set('signal','Unavailable');set('score','—');set('confidence','Market data unavailable');set('dataStatus','Unavailable');set('historyText','No market data was returned.');set('dataMessage',`Free market data could not be loaded right now. ${err.message||''}`);}
});