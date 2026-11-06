import {buildServer} from '../src/server.js';
import {loadConfig} from '../src/config.js';
import {createLogger} from '../src/lib/logger.js';
import {fileURLToPath} from 'node:url';
export const fx=rel=>fileURLToPath(new URL('./fixtures/'+rel,import.meta.url));
export async function start(env={},setup,{fetchImpl}={}){
  const config=loadConfig({PORT:'0',CORS_ORIGINS:'http://localhost:5173',ROBOTS_DIR:fx('robots/'),I18N_DIR:fx('i18n/'),SOURCE_HOSTS:'nasa.gov',...env});
  const quiet={log(){},error(){}};
  const {server,router}=buildServer({config,logger:createLogger({level:'error',sink:quiet}),fetchImpl});
  setup?.(router);
  await new Promise(r=>server.listen(0,r));
  return{base:`http://127.0.0.1:${server.address().port}`,stop:()=>new Promise(r=>server.close(r))};
}
