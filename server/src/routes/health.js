import {readFileSync} from 'node:fs';
const version=JSON.parse(readFileSync(new URL('../../package.json',import.meta.url),'utf8')).version;
const started=Date.now();
export function registerHealth(router){
  router.add('GET','/api/v1/health',({data})=>({body:{status:'ok',data:data.stats,service:'forgotten-explorers-api',version,uptimeSeconds:Math.round((Date.now()-started)/1000),time:new Date().toISOString()}}));
}
