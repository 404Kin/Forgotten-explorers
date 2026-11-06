// All settings come from environment variables, validated once at start-up.
import {fileURLToPath} from 'node:url';
const repoPath=rel=>fileURLToPath(new URL(rel,import.meta.url));
const list=(v,d)=>(v||d).split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const int=(v,d)=>{const n=Number.parseInt(v??'',10);return Number.isFinite(n)?n:d};
export function loadConfig(env=process.env){
  const cfg={
    env:env.NODE_ENV||'development',
    port:int(env.PORT,8787),
    corsOrigins:(env.CORS_ORIGINS||'http://localhost:5173').split(',').map(s=>s.trim()).filter(Boolean),
    rateLimit:{windowMs:int(env.RATE_LIMIT_WINDOW_MS,60000),max:int(env.RATE_LIMIT_MAX,120)},
    trustProxy:env.TRUST_PROXY==='true',
    logLevel:env.LOG_LEVEL||'info',
    // P1's validated robot files. Records that fail validation are never served.
    robotsDir:env.ROBOTS_DIR||repoPath('../../data-pipeline/robots/'),
    i18nDir:env.I18N_DIR||repoPath('../../data-pipeline/translations/'),
    // Every robot needs a source URL on one of these hosts (partner agencies are added on purpose, e.g. isro.gov.in).
    sourceHosts:list(env.SOURCE_HOSTS,'nasa.gov,isro.gov.in')
  };
  // Fail fast: a wrong setting should stop the server, not surprise us in production.
  if(cfg.port<0||cfg.port>65535) throw new Error('PORT must be between 0 and 65535');
  if(cfg.rateLimit.max<1||cfg.rateLimit.windowMs<1000) throw new Error('Rate limit settings are too small');
  if(cfg.corsOrigins.includes('*')) throw new Error('CORS_ORIGINS must be an explicit allow-list, not *');
  return Object.freeze(cfg);
}
