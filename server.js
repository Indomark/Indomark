import http from 'node:http';
import { URL, fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const PORT=Number(process.env.PORT||10000);
const HOST='0.0.0.0';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const INDIAN_API_KEY=String(process.env.INDIAN_API_KEY||'').trim();
const INDIAN_API_BASE='https://stock.indianapi.in';
const NSE_HOME='https://www.nseindia.com/';
const NSE_QUOTE='https://www.nseindia.com/api/quote-equity';
const YAHOO_CHART='https://query1.finance.yahoo.com/v8/finance/chart';
const cache=new Map();
const CACHE_MS=12000;
let nseCookie='';
let cookieFetchedAt=0;

const SMTP_HOST=String(process.env.SMTP_HOST||'smtp.gmail.com').trim();
const SMTP_PORT=Number(process.env.SMTP_PORT||465);
const SMTP_SECURE=String(process.env.SMTP_SECURE||'true').toLowerCase()!=='false';
const SMTP_USER=String(process.env.SMTP_USER||'').trim();
const SMTP_PASS=String(process.env.SMTP_PASS||'').trim();
const SMTP_FROM=String(process.env.SMTP_FROM||SMTP_USER).trim();
const OTP_TTL_MS=10*60*1000;
const OTP_RESEND_MS=60*1000;
const OTP_MAX_ATTEMPTS=5;
const otpStore=new Map();

const mailer=SMTP_USER&&SMTP_PASS?nodemailer.createTransport({host:SMTP_HOST,port:SMTP_PORT,secure:SMTP_SECURE,auth:{user:SMTP_USER,pass:SMTP_PASS}}):null;

function setCors(res){res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Cache-Control','no-store');}
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
 const normalize=(item,negative=false)=>{const symbol=String(item?.ticker_id||item?.tickerId||item?.symbol||item?.ticker||'').replace(/\.NS$/i,'').toUpperCase();const price=asNumber(item?.price,item?.last_price,item?.currentPrice);const change=asNumber(item?.percent_change,item?.percentChange,item?.pChange);if(!symbol||price===null)return null;return {symbol,company:companyFrom(item)||symbol,price,change,volume:asNumber(item?.volume),source:'IndianAPI',negative,updatedAt:Date.now()};};
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
 try{const url=`${NSE_QUOTE}?symbol=${encodeURIComponent(key)}`;const json=await fetchNseJson(url,await getNseCookie());const info=json?.priceInfo||{};const day=info?.intraDayHighLow||{};const data={symbol:key,price:asNumber(info.lastPrice),previous:asNumber(info.previousClose),change:asNumber(info.change),pChange:asNumber(info.pChange),open:asNumber(info.open),high:asNumber(day.max),low:asNumber(day.min),volume:asNumber(json?.marketDeptOrderBook?.tradeInfo?.totalTradedVolume,json?.securityWiseDP?.tradedVolume),source:'NSE',updatedAt:Date.now()};if(data.price===null)throw new Error('NSE response has no last price');cache.set(key,{ts:Date.now(),data});return data;}catch(e){attempts.push(`NSE: ${e.message}`);console.error(`ALL QUOTE SOURCES FAILED ${key}: ${attempts.join(' | ')}`);throw new Error(`Market data unavailable for ${key}`);}}
async function fetchQuotes(symbols){const unique=[...new Set(symbols.map(s=>String(s).trim().toUpperCase()).filter(Boolean))];const results=[];for(const symbol of unique){try{results.push(await fetchNseQuote(symbol));}catch(e){console.warn(`Batch quote failed for ${symbol}: ${e.message}`);}if(unique.indexOf(symbol)<unique.length-1)await new Promise(r=>setTimeout(r,1100));}return results;}

function otpKey(email,purpose){return `${purpose}:${String(email).trim().toLowerCase()}`;}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
function makeOtp(){return crypto.randomInt(100000,1000000).toString();}
function hashOtp(otp){return crypto.createHash('sha256').update(String(otp)).digest('hex');}
function json(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data));}
async function readBody(req){let body='';for await(const chunk of req){body+=chunk;if(body.length>16384)throw new Error('Request too large');}return body?JSON.parse(body):{};}
async function sendOtp(email,purpose){
 if(!mailer)throw new Error('Email OTP is not configured on the server');
 const clean=String(email).trim().toLowerCase();
 if(!validEmail(clean))throw new Error('Invalid email address');
 const key=otpKey(clean,purpose);const current=otpStore.get(key);const now=Date.now();
 if(current&&now-current.sentAt<OTP_RESEND_MS){const wait=Math.ceil((OTP_RESEND_MS-(now-current.sentAt))/1000);const error=new Error(`Please wait ${wait} seconds before requesting another OTP`);error.code='OTP_COOLDOWN';throw error;}
 const otp=makeOtp();const token=crypto.randomBytes(18).toString('hex');
 const record={hash:hashOtp(otp),token,sentAt:now,expiresAt:now+OTP_TTL_MS,attempts:0,purpose};otpStore.set(key,record);
 const subject=purpose==='signup'?'Indomark email verification code':'Indomark login verification code';
 const intro=purpose==='signup'?'Use this one-time code to verify your email and create your Indomark account.':'Use this one-time code to complete your Indomark login.';
 await mailer.sendMail({from:SMTP_FROM,to:clean,subject,text:`${subject}\n\n${intro}\n\nOTP: ${otp}\n\nThis code expires in 10 minutes. Never share it with anyone.`,html:`<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px"><h2 style="margin-bottom:8px">${subject}</h2><p>${intro}</p><div style="font-size:32px;font-weight:800;letter-spacing:8px;padding:18px 20px;background:#f4f6fb;border-radius:12px;text-align:center">${otp}</div><p style="color:#666">This code expires in 10 minutes. Never share it with anyone.</p></div>`});
 return {token,expiresIn:OTP_TTL_MS/1000};
}
function verifyOtp(email,purpose,otp,token){
 const key=otpKey(email,purpose);const record=otpStore.get(key);if(!record)throw new Error('OTP not found. Request a new code.');if(Date.now()>record.expiresAt){otpStore.delete(key);throw new Error('OTP expired. Request a new code.');}if(record.token!==String(token||''))throw new Error('Invalid OTP session. Request a new code.');if(record.attempts>=OTP_MAX_ATTEMPTS)throw new Error('Too many invalid attempts. Request a new code.');record.attempts+=1;if(record.hash!==hashOtp(otp)){if(record.attempts>=OTP_MAX_ATTEMPTS)otpStore.delete(key);throw new Error('Invalid OTP.');}otpStore.delete(key);return true;}
setInterval(()=>{const now=Date.now();for(const [key,record] of otpStore){if(record.expiresAt<now)otpStore.delete(key);}},60*1000).unref();

const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
async function serveStatic(pathname,res){const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');const file=path.resolve(ROOT,relative);if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.statusCode=403;return res.end('Forbidden');}try{const stat=await fs.stat(file);if(!stat.isFile())throw new Error('not a file');const body=await fs.readFile(file);res.statusCode=200;res.setHeader('Content-Type',MIME[path.extname(file).toLowerCase()]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');return res.end(body);}catch{}res.statusCode=404;res.setHeader('Content-Type','text/plain; charset=utf-8');return res.end('Not found');}

const server=http.createServer(async(req,res)=>{setCors(res);if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}try{const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
 if(url.pathname==='/health')return json(res,200,{ok:true,service:'indomark-market-backend',source:INDIAN_API_KEY?'IndianAPI-enabled':'fallback-only',emailOtpConfigured:Boolean(mailer)});
 if(url.pathname==='/api/otp/send'&&req.method==='POST'){const body=await readBody(req);const email=String(body?.email||'').trim().toLowerCase();const purpose=body?.purpose==='login'?'login':'signup';try{return json(res,200,{ok:true,...await sendOtp(email,purpose)});}catch(error){const status=error?.code==='OTP_COOLDOWN'?429:503;return json(res,status,{ok:false,error:error instanceof Error?error.message:'Unable to send OTP'});}}
 if(url.pathname==='/api/otp/verify'&&req.method==='POST'){const body=await readBody(req);const email=String(body?.email||'').trim().toLowerCase();const otp=String(body?.otp||'').trim();const token=String(body?.token||'');const purpose=body?.purpose==='login'?'login':'signup';try{verifyOtp(email,purpose,otp,token);return json(res,200,{ok:true,verified:true});}catch(error){return json(res,400,{ok:false,error:error instanceof Error?error.message:'Invalid OTP'});}}
 if(url.pathname==='/api/trending'){const data=await fetchIndianApiTrending();return json(res,200,data);}
 if(url.pathname==='/api/quote'){const data=await fetchNseQuote(url.searchParams.get('symbol'));return json(res,200,data);}
 if(url.pathname==='/api/quotes'){const symbols=(url.searchParams.get('symbols')||'').split(',');return json(res,200,{quotes:await fetchQuotes(symbols),updatedAt:Date.now()});}
 if(req.method==='GET')return serveStatic(url.pathname,res);
 return json(res,405,{error:'Method not allowed'});
 }catch(error){console.error(`REQUEST ERROR ${req.url}:`,error);return json(res,502,{error:error instanceof Error?error.message:'Request failed'});}});
server.listen(PORT,HOST,()=>console.log(`Indomark backend listening on ${HOST}:${PORT}`));
