document.addEventListener('DOMContentLoaded',()=>{
  const STARTING_BALANCE=1000;
  const STORAGE_VERSION='v2';
  const prefix='indomark_paper_';
  const selectedKey='indomark_practice_stock_v1';
  let symbol=(localStorage.getItem(selectedKey)||'').trim().toUpperCase();
  let price=null;
  let previous=null;
  let balance=Number(localStorage.getItem(prefix+'balance_'+STORAGE_VERSION));
  let holdings={};
  let orders=[];
  let side='buy';

  try{holdings=JSON.parse(localStorage.getItem(prefix+'holdings_'+STORAGE_VERSION)||'{}')||{};}catch{holdings={};}
  try{orders=JSON.parse(localStorage.getItem(prefix+'orders_'+STORAGE_VERSION)||'[]')||[];}catch{orders=[];}
  if(!Number.isFinite(balance)) balance=STARTING_BALANCE;

  const $=id=>document.getElementById(id);
  const money=n=>Number.isFinite(Number(n))?`₹${Number(n).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'—';
  const pct=n=>Number.isFinite(Number(n))?`${Number(n)>=0?'+':''}${Number(n).toFixed(2)}%`:'—';

  function save(){
    localStorage.setItem(prefix+'balance_'+STORAGE_VERSION,String(balance));
    localStorage.setItem(prefix+'holdings_'+STORAGE_VERSION,JSON.stringify(holdings));
    localStorage.setItem(prefix+'orders_'+STORAGE_VERSION,JSON.stringify(orders));
  }

  function setTradeEnabled(enabled){
    const controls=$('tradeControls');
    if(!controls)return;
    controls.classList.toggle('trade-disabled',!enabled);
    controls.setAttribute('aria-disabled',String(!enabled));
    const action=$('placeOrder');
    const tabs=[$('buyTab'),$('sellTab')].filter(Boolean);
    const qty=$('qty');
    if(action)action.disabled=!enabled;
    tabs.forEach(b=>b.disabled=!enabled);
    if(qty)qty.disabled=!enabled;
  }

  function render(){
    $('symbol').textContent=symbol||'Select a stock';
    $('price').textContent=money(price);
    $('price').classList.toggle('muted-price',!Number.isFinite(price));
    $('stockChange').textContent=Number.isFinite(price)&&Number.isFinite(previous)?pct(((price-previous)/previous)*100):'—';

    const selectedHolding=symbol?holdings[symbol]:null;
    const currentSelectedValue=selectedHolding&&Number.isFinite(price)?selectedHolding.qty*price:0;
    const otherValue=Object.values(holdings).reduce((sum,h)=>{
      if(!h||h.symbol===symbol)return sum;
      const p=Number(h.currentPrice??h.avgPrice);
      return sum+(Number.isFinite(p)?h.qty*p:0);
    },0);
    const portfolio=balance+currentSelectedValue+otherValue;
    const pnl=portfolio-STARTING_BALANCE;

    $('balance').textContent=money(balance);
    $('portfolio').textContent=money(portfolio);
    $('pnl').textContent=(pnl>=0?'+':'')+money(pnl);
    $('pnl').className=pnl>=0?'positive':'negative';

    const rawQty=Number($('qty')?.value||1);
    const qty=Math.max(1,Math.floor(Number.isFinite(rawQty)?rawQty:1));
    $('orderValue').textContent=Number.isFinite(price)?money(price*qty):'—';

    const hs=Object.values(holdings);
    $('holdingCount').textContent=`${hs.length} stock${hs.length===1?'':'s'}`;
    $('holdingsList').innerHTML=hs.length?hs.map(h=>{
      const hPrice=Number(h.symbol===symbol&&Number.isFinite(price)?price:h.currentPrice??h.avgPrice);
      const value=Number.isFinite(hPrice)?h.qty*hPrice:0;
      const profit=Number.isFinite(hPrice)?(hPrice-h.avgPrice)*h.qty:0;
      return `<div class="holding-row"><div class="holding-main"><strong>${h.symbol}</strong><small>${h.qty} share${h.qty===1?'':'s'} · Avg ${money(h.avgPrice)}</small></div><div class="holding-side"><strong>${money(value)}</strong><small class="${profit>=0?'positive':'negative'}">${profit>=0?'+':''}${money(profit)}</small></div></div>`;
    }).join(''):'<p class="empty">No holdings yet. Place your first paper order.</p>';

    $('orderCount').textContent=`${orders.length} order${orders.length===1?'':'s'}`;
    $('ordersList').innerHTML=orders.length?orders.slice().reverse().map(o=>`<div class="order-row"><div class="order-main"><strong>${o.side.toUpperCase()} · ${o.symbol}</strong><small>${o.qty} share${o.qty===1?'':'s'} · ${o.time}</small></div><div class="order-side"><strong>${money(o.value)}</strong><small>${o.status}</small></div></div>`).join(''):'<p class="empty">No orders yet.</p>';

    const state=$('selectStockState');
    if(state)state.hidden=Boolean(symbol);
    setTradeEnabled(Boolean(symbol&&Number.isFinite(price)));
  }

  function message(text,good=false){
    const el=$('message');
    if(!el)return;
    el.textContent=text;
    el.style.color=good?'#59e5a3':'#ff9aa9';
  }

  function setSide(next){
    side=next;
    $('buyTab')?.classList.toggle('active',side==='buy');
    $('sellTab')?.classList.toggle('active',side==='sell');
    if($('placeOrder'))$('placeOrder').textContent=side==='buy'?'Place Paper Buy':'Place Paper Sell';
    message('');
  }

  async function loadQuote(){
    if(!symbol){render();return;}
    const api=window.IndomarkMarket;
    if(!api?.getQuote){message('Market data service is unavailable right now.');render();return;}
    try{
      const cached=api.cached?.(symbol);
      if(cached?.price!==undefined){price=Number(cached.price);previous=Number(cached.previous);render();}
      const quote=await api.getQuote(symbol);
      price=Number(quote.price);previous=Number(quote.previous);render();
    }catch(err){
      price=null;previous=null;render();message('Unable to load the selected stock price right now.');
    }
  }

  $('qty')?.addEventListener('input',()=>{const el=$('qty');el.value=el.value.replace(/[^0-9]/g,'');render();});
  $('buyTab')?.addEventListener('click',()=>setSide('buy'));
  $('sellTab')?.addEventListener('click',()=>setSide('sell'));

  $('placeOrder')?.addEventListener('click',()=>{
    if(!symbol){message('Select a stock first.');return;}
    if(!Number.isFinite(price)){message('Selected stock price is unavailable.');return;}
    const qty=Math.floor(Number($('qty').value));
    if(!qty||qty<1){message('Enter a valid quantity.');return;}

    const value=qty*price;
    if(side==='buy'){
      if(value>balance){message(`Insufficient paper balance. You need ${money(value)}.`);return;}
      balance-=value;
      const old=holdings[symbol]||{symbol,qty:0,avgPrice:price,currentPrice:price};
      const totalCost=(old.qty*old.avgPrice)+value;
      old.qty+=qty;
      old.avgPrice=totalCost/old.qty;
      old.currentPrice=price;
      holdings[symbol]=old;
      message(`Bought ${qty} ${symbol} share${qty===1?'':'s'} successfully.`,true);
    }else{
      const old=holdings[symbol];
      if(!old||old.qty<qty){message(`You only have ${old?old.qty:0} ${symbol} share${old&&old.qty===1?'':'s'} to sell.`);return;}
      balance+=value;
      old.qty-=qty;
      old.currentPrice=price;
      if(old.qty<=0)delete holdings[symbol];
      message(`Sold ${qty} ${symbol} share${qty===1?'':'s'} successfully.`,true);
    }

    orders.push({side,symbol,qty,value,status:'Filled',time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});
    save();
    render();
    if($('qty'))$('qty').value=1;
  });

  render();
  setSide('buy');
  if(symbol)loadQuote();

  const style=document.createElement('style');
  style.textContent=`#placeOrder:not(:disabled){background:#5f35e8;border-color:#5f35e8;color:#fff}#placeOrder:not(:disabled):hover{background:#5130ca;border-color:#5130ca}`;
  document.head.appendChild(style);
});