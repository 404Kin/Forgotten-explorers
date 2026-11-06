// Fixed-window limiter per client IP, kept in memory (fine for one small server).
export function createRateLimiter({windowMs,max,now=()=>Date.now()}){
  const hits=new Map();
  const timer=setInterval(()=>{const t=now();for(const[k,v]of hits)if(v.reset<=t)hits.delete(k)},windowMs);
  timer.unref?.();
  return{
    check(ip){
      const t=now();let h=hits.get(ip);
      if(!h||h.reset<=t){h={count:0,reset:t+windowMs};hits.set(ip,h)}
      h.count++;
      return{allowed:h.count<=max,limit:max,remaining:Math.max(0,max-h.count),retryAfterSeconds:Math.max(1,Math.ceil((h.reset-t)/1000))};
    },
    stop(){clearInterval(timer)}
  };
}
