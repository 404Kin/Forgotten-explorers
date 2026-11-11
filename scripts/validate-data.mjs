import {loadConfig} from '../server/src/config.js';
import {loadRobots} from '../server/src/data/loadRobots.js';

const config=loadConfig();
const logger={
  warn(event,{count}={}){console.error(`${event}${count?`: ${count}`:''}`)},
  info(){},
  error(){}
};
const {valid,rejected}=loadRobots(config.robotsDir,config,logger);
if(rejected.length)throw new Error(`Data validation rejected ${rejected.length} record(s).`);
if(valid.length<15)throw new Error(`Expected at least 15 verified robot records; found ${valid.length}.`);
console.log(`Validated ${valid.length} robot records.`);
