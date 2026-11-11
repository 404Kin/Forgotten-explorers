import {readFileSync} from 'node:fs';
import {parseQuery} from '../lib/validate.js';
import {notFound,upstreamUnavailable} from '../lib/errors.js';

const DSN_URL='https://eyes.nasa.gov/dsn/data/dsn.json';
const HORIZONS_URL='https://ssd.jpl.nasa.gov/api/horizons.api';
const DISTANCE_TTL=6*60*60*1000;
const DSN_TTL=60*1000;
const LIGHT_SPEED_KM_S=299792.458;
const IDS={type:'list',required:true,max:20,pattern:/^[a-z0-9-]{2,40}$/};

function parseVectorDistance(result,targetId){
  if(typeof result!=='string')throw new Error('Horizons result was not text');
  const target=result.match(/^Target body name:\s*(.*?)\s+\((-?\d+)\)/m);
  if(!target||target[2]!==String(targetId))throw new Error('Horizons response target did not match');
  const section=result.match(/\$\$SOE([\s\S]*?)\$\$EOE/);
  const vector=section?.[1].match(/\bX\s*=\s*([+-]?[\d.]+(?:E[+-]?\d+)?)\s+Y\s*=\s*([+-]?[\d.]+(?:E[+-]?\d+)?)\s+Z\s*=\s*([+-]?[\d.]+)/i);
  if(!vector)throw new Error('Horizons result did not contain a vector');
  const [x,y,z]=vector.slice(1).map(Number);
  const distanceKm=Math.hypot(x,y,z);
  if(!Number.isFinite(distanceKm)||distanceKm<=0)throw new Error('Horizons distance was invalid');
  return{distanceKm,targetName:target[1]};
}

function readSnapshot(file){
  const snapshot=JSON.parse(readFileSync(file,'utf8'));
  if(typeof snapshot?.asOf!=='string'||!snapshot.targets||typeof snapshot.targets!=='object')throw new Error('Distance snapshot has an invalid shape');
  return snapshot;
}

function activeDsnLinks(payload,robotMap,robots){
  if(!Number.isFinite(payload?.time)||!payload?.dishes||typeof payload.dishes!=='object'||Array.isArray(payload.dishes))throw new Error('NASA DSN Now returned an invalid response');
  const links=[];
  let unmapped=0;
  for(const[dish,entry]of Object.entries(payload.dishes)){
    if(!Array.isArray(entry?.sigs))continue;
    const activeTargets=new Set(entry.sigs.filter(signal=>signal?.active===true&&typeof signal.tgt==='string').map(signal=>signal.tgt));
    for(const code of activeTargets){
      const robotId=robotMap[code];
      if(!robotId||!robots.get(robotId)){unmapped++;continue}
      links.push({robotId,dish:`DSS-${dish}`,dsnCode:code});
    }
  }
  links.sort((a,b)=>a.robotId.localeCompare(b.robotId)||a.dish.localeCompare(b.dish));
  return{data:links,unmapped};
}

export function registerLive(router){
  const distanceCache=new Map();
  let dsnCache=null;

  router.add('GET','/api/v1/live/distance',async({url,data,config,fetchImpl,logger})=>{
    const {ids}=parseQuery(url,{ids:IDS});
    const output=[];
    for(const robotId of ids){
      const robot=data.robots.get(robotId);
      if(!robot)throw notFound(`No robot with id "${robotId}"`);
      const targetId=String(robot.horizonsId??config.horizonsTargets[robotId]??'');
      if(!targetId||!/^-?\d{1,12}$/.test(targetId)){
        logger.warn('horizons_target_missing',{robotId});
        throw upstreamUnavailable('JPL Horizons target mapping');
      }

      let measurement=distanceCache.get(targetId);
      if(!measurement||Date.now()-measurement.cachedAt>=DISTANCE_TTL){
        try{
          const start=new Date();
          start.setUTCMilliseconds(0);
          const stop=new Date(start.getTime()+60_000);
          const params=new URLSearchParams({
            format:'json',
            COMMAND:`'${targetId}'`,
            OBJ_DATA:'NO',
            MAKE_EPHEM:'YES',
            EPHEM_TYPE:'VECTORS',
            CENTER:"'500@399'",
            START_TIME:`'${start.toISOString().replace('T',' ').slice(0,19)}'`,
            STOP_TIME:`'${stop.toISOString().replace('T',' ').slice(0,19)}'`,
            STEP_SIZE:"'1m'",
            TIME_TYPE:'UT',
            VEC_TABLE:'2',
            VEC_CORR:'NONE'
          });
          const response=await fetchImpl(`${HORIZONS_URL}?${params}`,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
          if(!response.ok)throw new Error(`JPL Horizons returned HTTP ${response.status}`);
          const payload=await response.json();
          const vector=parseVectorDistance(payload?.result,targetId);
          measurement={...vector,asOf:start.toISOString(),cachedAt:Date.now(),source:'live'};
          distanceCache.set(targetId,measurement);
        }catch(error){
          let snapshot;
          try{snapshot=readSnapshot(config.distanceSnapshotFile)}
          catch(snapshotError){logger.warn('distance_snapshot_unavailable',{error:String(snapshotError?.message||snapshotError)})}
          const item=snapshot?.targets?.[targetId];
          if(item&&Number.isFinite(item.distanceKm)&&item.distanceKm>0&&typeof item.targetName==='string'){
            measurement={distanceKm:item.distanceKm,targetName:item.targetName,asOf:snapshot.asOf,cachedAt:Date.now(),source:'snapshot'};
            logger.warn('horizons_snapshot_used',{robotId,targetId});
          }else{
            logger.warn('horizons_unavailable',{robotId,targetId,error:String(error?.message||error)});
            throw upstreamUnavailable('JPL Horizons');
          }
        }
      }
      output.push({robotId,targetId,targetName:measurement.targetName||null,distanceKm:measurement.distanceKm,lightSeconds:measurement.distanceKm/LIGHT_SPEED_KM_S,source:measurement.source,asOf:measurement.asOf});
    }
    return{body:{data:output},cacheSeconds:DISTANCE_TTL/1000};
  });

  router.add('GET','/api/v1/live/dsn',async({data,config,fetchImpl,logger})=>{
    const now=Date.now();
    if(dsnCache&&now-dsnCache.cachedAt<DSN_TTL)return{body:dsnCache.body,cacheSeconds:DSN_TTL/1000};
    try{
      const response=await fetchImpl(DSN_URL,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error(`NASA DSN Now returned HTTP ${response.status}`);
      const payload=await response.json();
      const mapped=activeDsnLinks(payload,config.dsnRobotMap,data.robots);
      if(mapped.unmapped)logger.warn('dsn_targets_unmapped',{count:mapped.unmapped});
      const body={data:mapped.data,meta:{source:'NASA Deep Space Network Now',asOf:new Date(payload.time*1000).toISOString(),stale:false,unmappedTargets:mapped.unmapped}};
      dsnCache={body,cachedAt:now};
      return{body,cacheSeconds:DSN_TTL/1000};
    }catch(error){
      logger.warn('dsn_now_unavailable',{error:String(error?.message||error)});
      if(dsnCache)return{body:{...dsnCache.body,meta:{...dsnCache.body.meta,stale:true}},cacheSeconds:DSN_TTL/1000};
      throw upstreamUnavailable('NASA Deep Space Network Now');
    }
  });
}
