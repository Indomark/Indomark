document.addEventListener('DOMContentLoaded',()=>{
 const KEY='indospeed_alerts';
 const $=id=>document.getElementById(id);
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const conditionText=(a)=>({above:'Price above',below:'Price below',changeUp:'Change above',changeDown:'Change below'}[a.condition]||a.condition);
 function render(){
  const items=read();
  $('alertCount').textContent=`${items.length} alert${items.length===1?'':'s'}`;
  $('alertEmpty').hidden=items.length!==0;
  $('alertList').querySelectorAll('.alert-item').forEach(e=>e.remove());
  items.forEach((a,i)=>{
   const row=document.createElement('div');row.className='alert-item';
   row.innerHTML=`<div class="alert-main"><strong>${a.symbol}</strong><small>${conditionText(a)} ${Number(a.target).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</small></div><div class="alert-actions"><span class="alert-badge">Active</span><button class="delete-alert" type="button" aria-label="Delete alert">×</button></div>`;
   row.querySelector('.delete-alert').addEventListener('click',()=>{const next=read();next.splice(i,1);write(next);render();});
   $('alertList').appendChild(row);
  });
 }
 $('alertForm').addEventListener('submit',e=>{
  e.preventDefault();
  const symbol=$('alertSymbol').value.trim().toUpperCase();
  const target=Number($('alertTarget').value);
  if(!symbol||!Number.isFinite(target)){ $('alertMessage').textContent='Enter a valid symbol and target.';return; }
  const items=read();items.push({id:crypto.randomUUID?.()||String(Date.now()),symbol,condition:$('alertCondition').value,target,createdAt:Date.now()});write(items);
  e.target.reset();$('alertSymbol').focus();$('alertMessage').textContent='Alert created successfully.';render();
 });
 render();
});