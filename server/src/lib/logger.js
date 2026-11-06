// JSON-lines logger. Anything that looks like a secret is replaced before it is written.
const RANK={debug:10,info:20,warn:30,error:40};
const SECRET=/(authorization|cookie|password|passwd|secret|token|api[-_]?key)/i;
export function redact(v,depth=0){
  if(v==null||depth>4) return v;
  if(Array.isArray(v)) return v.map(x=>redact(x,depth+1));
  if(typeof v==='object') return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,SECRET.test(k)?'[redacted]':redact(x,depth+1)]));
  return v;
}
export function createLogger({level='info',sink=console}={}){
  const min=RANK[level]??RANK.info;
  const write=(lv,msg,fields={})=>{if(RANK[lv]<min)return;(lv==='error'?sink.error:sink.log)(JSON.stringify({t:new Date().toISOString(),level:lv,msg,...redact(fields)}))};
  return{debug:(m,f)=>write('debug',m,f),info:(m,f)=>write('info',m,f),warn:(m,f)=>write('warn',m,f),error:(m,f)=>write('error',m,f)};
}
