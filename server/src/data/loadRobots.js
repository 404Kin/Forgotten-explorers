// Reads every *.json in a folder (one record or an array per file) and keeps only records that pass validation.
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {validateRobot} from '../domain/robot.js';
export function loadRobots(dir,{sourceHosts},logger){
  const valid=[],rejected=[],seen=new Set();
  let files;
  try{files=readdirSync(dir).filter(f=>f.endsWith('.json')).sort()}
  catch{logger.warn('robots_dir_missing',{dir});return{valid,rejected}}
  for(const f of files){
    let recs;
    try{const x=JSON.parse(readFileSync(join(dir,f),'utf8'));recs=Array.isArray(x)?x:[x]}
    catch(err){rejected.push({file:f,id:null,errors:[`not valid JSON: ${err.message}`]});continue}
    for(const r of recs){
      const errors=validateRobot(r,{sourceHosts});
      if(!errors.length&&seen.has(r.id)) errors.push('duplicate id');
      if(errors.length) rejected.push({file:f,id:r?.id??null,errors});
      else{seen.add(r.id);valid.push(r)}
    }
  }
  if(rejected.length) logger.warn('robots_rejected',{count:rejected.length,rejected});
  return{valid,rejected};
}
