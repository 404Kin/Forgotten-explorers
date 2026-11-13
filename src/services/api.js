// API client for /api/v1 (contract: docs/openapi.yaml, owner P2).
// Goals: one place for fetch rules (timeout, one retry, standard error shape) and an app that still works
// when the API is off or broken, by answering from the bundled data in src/data.
import {MISSIONS} from '../robots/index.js';
import {getLang} from '../i18n/index.js';

const BASE=(import.meta.env?.VITE_API_BASE_URL||'').replace(/\/+$/,'');
export const API_ENABLED=BASE!=='';
const PREFIX='/api/v1';
const DEFAULTS={timeoutMs:6000,retries:1,retryDelayMs:400,maxRetryAfterMs:2000};
// After the API is unreachable we skip it for a while: otherwise every screen would wait for the timeout again.
const COOL_DOWN_MS=30000;let downUntil=0,downError=null;

/** Every failure becomes this class, so screens only ever handle one error shape: {code,message,details,status}. */
export class ApiError extends Error{
  constructor(code,message,{status=0,details={}}={}){super(message);this.name='ApiError';this.code=code;this.status=status;this.details=details}
}

// ---- pure helpers (no network): easy to unit-test later ----

export function buildUrl(path,params={},base=BASE){
  const q=new URLSearchParams();
  for(const[k,v]of Object.entries(params))if(v!==undefined&&v!==null&&v!=='')q.set(k,Array.isArray(v)?v.join(','):v);
  const s=q.toString();return `${base}${PREFIX}${path}${s?'?'+s:''}`;
}

/** Turn a failed response body (standard format {error:{code,message,details}}) or any thrown value into an ApiError. */
export function normalizeError(input,status=0){
  if(input instanceof ApiError)return input;
  const e=input?.error;
  if(e&&typeof e==='object')return new ApiError(String(e.code||'INTERNAL'),String(e.message||'Request failed'),{status,details:e.details||{}});
  if(input?.name==='AbortError')return new ApiError('TIMEOUT','The server took too long to answer.',{status});
  if(status)return new ApiError('INTERNAL',`Unexpected answer (${status}).`,{status});
  return new ApiError('NETWORK','Could not reach the server.',{status});
}

/** Retry only problems that can go away by themselves: network, timeout, 429 and 5xx. Never a 4xx we caused. */
export const isRetryable=err=>err.code==='NETWORK'||err.code==='TIMEOUT'||err.code==='RATE_LIMITED'||err.status>=500;

/** Fall back to local data for everything except INVALID_PARAM, which is our bug and should not be hidden. */
export const shouldFallback=err=>err.code!=='INVALID_PARAM';

const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function attempt(url,{timeoutMs,signal}){
  const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),timeoutMs);
  // Let the caller cancel too (screen closed), without confusing that with a timeout.
  signal?.addEventListener('abort',()=>ctl.abort(),{once:true});
  try{
    const res=await fetch(url,{signal:ctl.signal,headers:{Accept:'application/json'}});
    let body=null;try{body=await res.json()}catch{/* empty or non-JSON body */}
    if(!res.ok){const err=normalizeError(body,res.status);err.retryAfterMs=(Number(res.headers.get('Retry-After'))||0)*1000;throw err}
    if(body===null)throw new ApiError('INTERNAL','The server sent an empty answer.',{status:res.status});
    return body;
  }catch(e){
    throw normalizeError(signal?.aborted?Object.assign(new Error('cancelled'),{name:'AbortError'}):e,e?.status||0);
  }finally{clearTimeout(timer)}
}

/** GET with timeout + retry. Resolves to the parsed JSON body or throws ApiError. */
export async function request(path,params,opts={}){
  if(!API_ENABLED)throw new ApiError('NETWORK','API is not configured (VITE_API_BASE_URL is empty).');
  const o={...DEFAULTS,...opts};const url=buildUrl(path,params);let last;
  for(let i=0;i<=o.retries;i++){
    try{return await attempt(url,o)}
    catch(e){last=e;if(o.signal?.aborted||!isRetryable(e)||i===o.retries)break;
      await sleep(Math.min(e.retryAfterMs||o.retryDelayMs,o.maxRetryAfterMs))}
  }
  throw last;
}

/**
 * Ask the API; on failure answer from `local()`. Result always says where it came from, so the UI can be honest
 * ("live" vs "snapshot"): { ...body, source: 'api' | 'local', error?: ApiError }.
 */
export async function withFallback(path,params,local,opts){
  if(!API_ENABLED)return{...await local(),source:'local'};
  if(Date.now()<downUntil)return{...await local(),source:'local',error:downError};
  try{const body=await request(path,params,opts);downUntil=0;return{...body,source:'api'}}
  catch(err){
    if(!shouldFallback(err))throw err;
    // Only "the server is down" starts the cool-down; a 404 on one route must not switch off the whole API.
    if(err.code==='NETWORK'||err.code==='TIMEOUT'||err.status>=500){downUntil=Date.now()+COOL_DOWN_MS;downError=err}
    return{...await local(),source:'local',error:err};
  }
}

// ---- local fallback adapters: same shapes as docs/openapi.yaml, built from src/data ----

// Status comes from P1's robotRecords.json through the robot registry (left_behind | silent | talking).
// The ONE place the app asks "what is this robot's status?" is statusOf(). The old guess below only runs for a robot without a status.
const PLACEHOLDER_STATUS_OVERRIDE={EAGLE:'left_behind'};
export const statusOf=m=>m.status||m.real?.statusCode||PLACEHOLDER_STATUS_OVERRIDE[m.n]||(m.a?'talking':'silent');
const localStatus=statusOf;

const toSummary=m=>({id:m.id,name:m.n,world:m.w,status:localStatus(m),lat:m.real?.lat??null,lon:m.real?.lon??null,
  kidFact:m.t,i18nKey:`robot.${m.n}`,lang:'en'});

export function paginate(items,page=1,pageSize=12){
  const total=items.length,totalPages=Math.max(1,Math.ceil(total/pageSize)),p=Math.min(Math.max(1,page),totalPages);
  return{items:items.slice((p-1)*pageSize,p*pageSize),meta:{page:p,pageSize,total,totalPages}};
}

const localRobots=({world,status,page=1,pageSize=12}={})=>{
  const all=MISSIONS.map(toSummary).filter(r=>(!world||r.world===world)&&(!status||r.status===status));
  const{items,meta}=paginate(all,page,pageSize);return{data:items,meta:{...meta,lang:'en'}};
};

const localRobot=id=>{
  const m=MISSIONS.find(x=>x.id===id);
  if(!m)throw new ApiError('NOT_FOUND',`No robot with id "${id}"`,{status:404});
  return{data:{...toSummary(m),launchDate:m.real?.launchDate,arrivalDate:m.real?.arrivalDate,endReason:m.real?.status,
    story:m.p.map(([title,text])=>({title,text})),quiz:[{q:m.q[0],options:m.q.slice(1)}],sources:[]}};
};

// PLACEHOLDER (task 6): relics.json distances are an undated snapshot. P1 should add the snapshot date; until then asOf is null.
const localDistance=ids=>({data:ids.map(id=>MISSIONS.find(x=>x.id===id)).filter(Boolean)
  .map(m=>({robotId:m.id,distanceKm:m.real?.distanceKm??null,lightSeconds:m.real?.lightSeconds??null,source:'snapshot',asOf:null}))});

// PLACEHOLDER (task 6): without the API nobody can say who is talking *right now*, so we list robots marked awake, as a snapshot.
const localDsn=()=>({data:MISSIONS.filter(m=>localStatus(m)==='talking').map(m=>({robotId:m.id,dish:null})),asOf:null});

// ---- public API used by screens ----

export const getRobots=({world,status,page,pageSize,lang=getLang()}={},opts)=>
  withFallback('/robots',{world,status,page,pageSize,lang},()=>localRobots({world,status,page,pageSize}),opts);

export const getRobot=(id,{lang=getLang()}={},opts)=>
  withFallback(`/robots/${encodeURIComponent(id)}`,{lang},()=>localRobot(id),opts);

export const getDistances=(ids,opts)=>
  withFallback('/live/distance',{ids},()=>localDistance(ids),opts);

export const getDsn=opts=>withFallback('/live/dsn',{},localDsn,opts);

export const getHealth=opts=>request('/health',{},opts);
