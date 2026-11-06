import {loadConfig} from './config.js';
import {createLogger} from './lib/logger.js';
import {buildServer} from './server.js';
const config=loadConfig(),logger=createLogger({level:config.logLevel});
const {server}=buildServer({config,logger});
server.listen(config.port,()=>logger.info('server_started',{port:config.port,env:config.env}));
// Hosts send SIGTERM on redeploy: finish open requests, then exit.
for(const sig of['SIGTERM','SIGINT'])process.on(sig,()=>{logger.info('shutting_down',{sig});server.close(()=>process.exit(0))});
