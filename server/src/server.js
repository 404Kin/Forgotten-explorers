// HTTP server with one pipeline for every request: ids, security headers, CORS, rate limit, routing, errors, logging.
import http from 'node:http';
import crypto from 'node:crypto';
import {createRouter} from './lib/router.js';
import {createRateLimiter} from './lib/rateLimit.js';
import {AppError,notFound,methodNotAllowed,tooMany,internal,toBody} from './lib/errors.js';
import {registerRoutes} from './routes/index.js';
import {loadData} from './data/index.js';
export function buildServer({config,logger,data}){
  const router=createRouter(),limiter=createRateLimiter(config.rateLimit),deps={config,logger,data:data??loadData(config,logger)};
  registerRoutes(router,deps);
  const clientIp=req=>config.trustProxy?(req.headers['x-forwarded-for']||'').split(',')[0].trim()||req.socket.remoteAddress:req.socket.remoteAddress;
  const server=http.createServer((req,res)=>{
    const id=crypto.randomUUID(),t0=Date.now();let status=500,path='?';
    const send=(code,body,headers={},cacheSeconds=0)=>{
      status=code;
      res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':cacheSeconds?`public, max-age=${cacheSeconds}`:'no-store','X-Request-Id':id,'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...headers});
      res.end(req.method==='HEAD'?undefined:JSON.stringify(body));
    };
    (async()=>{
      try{
        const url=new URL(req.url,'http://localhost');path=url.pathname;
        const origin=req.headers.origin;
        // Only websites on our allow-list get CORS headers, so other sites' browsers cannot read our answers.
        res.setHeader('Vary','Origin');
        if(origin&&config.corsOrigins.includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Max-Age','600')}
        if(req.method==='OPTIONS'){status=204;res.writeHead(204,{'X-Request-Id':id});return res.end()}
        const rl=limiter.check(clientIp(req)||'unknown');
        res.setHeader('RateLimit-Limit',rl.limit);res.setHeader('RateLimit-Remaining',rl.remaining);
        if(!rl.allowed) throw tooMany(rl.retryAfterSeconds);
        if(req.method!=='GET'&&req.method!=='HEAD') throw methodNotAllowed(['GET','HEAD','OPTIONS']);
        const m=router.match('GET',url.pathname);
        if(!m.handler) throw m.allow.length?methodNotAllowed([...m.allow,'OPTIONS']):notFound();
        const r=await m.handler({req,url,params:m.params,id,...deps});
        send(r.status||200,r.body,r.headers,r.cacheSeconds);
      }catch(err){
        const e=err instanceof AppError?err:internal();
        // Unknown errors are logged with details, but the client only sees a safe generic message.
        if(!(err instanceof AppError)) logger.error('unhandled_error',{requestId:id,error:String(err?.message),stack:err?.stack});
        send(e.status,toBody(e),e.headers);
      }finally{logger.info('request',{requestId:id,method:req.method,path,status,ms:Date.now()-t0})}
    })();
  });
  server.on('close',()=>limiter.stop());
  return{server,router};
}
