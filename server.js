import http from 'node:http';
import { URL } from 'node:url';

const PORT=Number(process.env.PORT||10000);
const HOST='0.0.0.0';
const INDIAN_API_KEY=String(process.env.INDIAN_API_KEY||'').trim();
const INDIAN_API_BASE='https://stock.indianapi.in';
const NSE_HOME='https://www.nseindia.com/';
const NSE_QUOTE='https://www.nseindia.com/api/quote-equity';
const YAHOO_CHART='https://query1.finance.yahoo.com/v8/finance/chart';
const cache=new Map();
const CACHE_MS=12000;
let nseCookie='';
let cookieFetchedAt=0;

function setCors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Cache-Control','no-store');}
function browserHeaders(extra={}){return {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36','Accept':'application/json,text/plain,*/*','Accept-Language':'en-IN,en;q=0.9','Cache-Control':'no-cache','Pragma':'no-cache',...extra};}
function withTimeout(promise,ms=8000){return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('upstream timeout')),ms))]);}
async function readJson(response,label){const text=await response.text();if(!response.ok)throw new Error(`${label} ${response.status}: ${text.slice(0,180)}`);try{return JSON.parse(text);}catch{throw new Error(`${label} invalid JSON`);}}
function asNumber(...values){for(const value of values){const n=Number(value);if(Number.isFinite(n))return n;}return null;}
function companyFrom(q){return q?.company_name||q?.company||q?.companyName||q?.ticker_id||q?.tickerId||q?.symbol||'';}
function normalizeQuote(symbol,json){const key=String(symbol).trim().toUpperCase();const price=asNumber(json?.currentPrice?.NSE,json?.currentPrice?.nse,json?.price,json?.lastPrice,json?.stockPrice);if(price===null)throw new Error('IndianAPI has no NSE price');return {symbol:key,price,previous:asNumber(json?.previousClose,json?.previous_close,json?.prevClose),change:asNumber(json?.netChange,json?.net_change,json?.change),pChange:asNumber(json?.percentChange,json?.percent_change,json?.pChange),open:asNumber(json?.open),high:asNumber(json?.high),low:asNumber(json?.low),volume:asNumber(json?.volume),source:'IndianAPI',updatedAt:Date.now()};}

async function fetchIndianApiQuote(symbol){
 if(!INDIAN_API_KEY)throw new Error('INDIAN_API_KEY not configured');
 const key=String(symbol).trim().toUpperCase();
 const url=`${INDIAN_API_BASE}/stock?name=${encodeURIComponent(key)}`;
 const response=await withTimeout(fetch(url,{headers:browserHeaders({'x-api-key':INDIAN_API_KEY})}),8000);
 return normalizeQuote(key,await readJson(response,'IndianAPI'));
}

async function fetchIndianApiTrending(){
 if(!INDIAN_API_KEY)throw new Error('INDIAN_API_KEY not configured');
 const response=await withTimeout(fetch(`${INDIAN_API_BASE}/trending`,{headers:browserHeaders({'x-api-key':INDIAN_API_KEY})}),8000);
 const json=await readJson(response,'IndianAPI trending');
 const data=json?.trending_stocks||json?.trendingStocks||{};
 const normalize=(item,negative=false)=>{
  const symbol=String(item?.ticker_id||item?.tickerId||item?.symbol||item?.ticker||'').replace(/\.NS$/i,'').toUpperCase();
  const price=asNumber(item?.price,item?.last_price,item?.currentPrice);
  const change=asNumber(item?.percent_change,item?.percentChange,item?.pChange);
  if(!symbol||price===null)return null;
  return {symbol,company:companyFrom(item)||symbol,price,change,volume:asNumber(item?.volume),source:'IndianAPI',negative,updatedAt:Date.now()};
 };
 const gainers=(Array.isArray(data?.top_gainers)?data.top_gainers:[]).map(x=>normalize(x,false)).filter(Boolean);
 const losers=(Array.isArray(data?.top_losers)?data.top_losers:[]).map(x=>normalize(x,true)).filter(Boolean);
 if(!gainers.length&&!losers.length)throw new Error('IndianAPI trending returned no stocks');
 return {gainers,losers,source:'IndianAPI',updatedAt:Date.now()};
}

async function fetchYahooQuote(symbol){const ticker=`${String(symbol).toUpperCase()}.NS`;const url=`${YAHOO_CHART}/${encodeURIComponent(ticker)}?range=1d&interval=1m&events=history`;const r=await withTimeout(fetch(url,{headers:browserHeaders()}),8000);const j=await readJson(r,'Yahoo chart');const meta=j?.chart?.result?.[0]?.meta||{};const price=asNumber(meta.regularMarketPrice,meta.previousClose);if(price===null)throw new Error('Yahoo has no current price');const previous=asNumber(meta.previousClose);const change=previous===null?null:price-previous;const pChange=previous===null||previous===0?null:(change/previous)*100;return {symbol:String(symbol).toUpperCase(),price,previous,pChange,change,open:asNumber(meta.regularMarketOpen),high:asNumber(meta.regularMarketDayHigh),low:asNumber(meta.regularMarketDayLow),volume:asNumber(meta.regularMarketVolume),source:'Yahoo Finance',updatedAt:Date.now()};}

async function getNseCookie(){const now=Date.now();if(nseCookie&&now-cookieFetchedAt<300000)return nseCookie;const response=await withTimeout(fetch(NSE_HOME,{headers:browserHeaders({Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'})}),8000);const sc=response.headers.get('set-cookie');if(sc){nseCookie=sc.split(',').map(v=>v.split(';')[0]).join('; ');cookieFetchedAt=now;}return nseCookie;}
async function fetchNseJson(url,cookie){const r=await withTimeout(fetch(url,{headers:browserHeaders({Referer:NSE_HOME,...(cookie?{Cookie:cookie}:{})})}),8000);if([401,403,429].includes(r.status))throw new Error(`NSE direct ${r.status}`);return readJson(r,'NSE direct');}

async function fetchNseQuote(symbol){const key=String(symbol||'').trim().toUpperCase();if(!/^[A-Z0-9&.-]+$/.test(key))throw new Error('Invalid NSE symbol');const cached=cache.get(key);if(cached&&Date.now()-cached.ts<CACHE_MS)return cached.data;const attempts=[];
 try{const data=await fetchIndianApiQuote(key);cache.set(key,{ts:Date.now(),data});console.log(`QUOTE ${key}: ₹${data.price} source=IndianAPI`);return data;}catch(e){attempts.push(`IndianAPI: ${e.message}`);console.warn(`IndianAPI failed for ${key}: ${e.message}`);}
 try{const data=await fetchYahooQuote(key);cache.set(key,{ts:Date.now(),data});console.log(`QUOTE ${key}: ₹${data.price} source=Yahoo`);return data;}catch(e){attempts.push(`Yahoo: ${e.message}`);console.warn(`Yahoo failed for ${key}: ${e.message}`);}
 try{const url=`${NSE_QUOTE}?symbol=${encodeURIComponent(key)}`;const json=await fetchNseJson(url,await getNseCookie());const info=json?.priceInfo||{};const day=info?.intraDayHighLow||{};const data={symbol:key,price:asNumber(info.lastPrice),previous:asNumber(info.previousClose),change:asNumber(info.change),pChange:asNumber(info.pChange),open:asNumber(info.open),high:asNumber(day.max),low:asNumber(day.min),volume:asNumber(json?.marketDeptOrderBook?.tradeInfo?.totalTradedVolume,json?.securityWiseDP?.tradedVolume),source:'NSE',updatedAt:Date.now()};if(data.price===null)throw new Error('NSE response has no last price');cache.set(key,{ts:Date.now(),data});console.log(`QUOTE ${key}: ₹${data.price} source=NSE`);return data;}catch(e){attempts.push(`NSE: ${e.message}`);console.error(`ALL QUOTE SOURCES FAILED ${key}: ${attempts.join(' | ')}`);throw new Error(`Market data unavailable for ${key}`);}}

async function fetchQuotes(symbols){const unique=[...new Set(symbols.map(s=>String(s).trim().toUpperCase()).filter(Boolean))];const results=[];for(const symbol of unique){try{results.push(await fetchNseQuote(symbol));}catch(e){console.warn(`Batch quote failed for ${symbol}: ${e.message}`);}if(unique.indexOf(symbol)<unique.length-1)await new Promise(r=>setTimeout(r,1100));}return results;}

const server=http.createServer(async(req,res)=>{setCors(res);if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}try{const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
 if(url.pathname==='/health'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({ok:true,service:'indospeed-market-backend',source:INDIAN_API_KEY?'IndianAPI-enabled':'fallback-only'}));}
 if(url.pathname==='/api/trending'){const data=await fetchIndianApiTrending();res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(data));}
 if(url.pathname==='/api/quote'){const data=await fetchNseQuote(url.searchParams.get('symbol'));res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(data));}
 if(url.pathname==='/api/quotes'){const symbols=(url.searchParams.get('symbols')||'').split(',');const quotes=await fetchQuotes(symbols);res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({quotes,updatedAt:Date.now()}));}
 res.statusCode=404;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'Not found'}));
 }catch(error){console.error(`REQUEST ERROR ${req.url}:`,error);res.statusCode=502;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error instanceof Error?error.message:'Market data unavailable'}));}});
server.listen(PORT,HOST,()=>console.log(`IndoSpeed market backend listening on ${HOST}:${PORT}`));
